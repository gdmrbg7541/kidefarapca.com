# -*- coding: utf-8 -*-
"""ÇÖZÜMLEYİCİ — yüzey biçimden (aranan yalın biçim, dilbilgisi etiketi).

Sözlük simülasyonunun istediği iki alanı üretir:
    root     = sözlükte ARANAN yalın biçim  (ya da 'SKIP')
    category = Türkçe etiket ("isim (ال takılı · dişil)" gibi)

Kaynak, sitenin KENDİ verisidir; elle sözlükçe yazılmaz:
    sozluk/dizin_uret.js -> yüzey biçim → {ara, tur, rol, onek, ek, mezid}
Dizinde doğrudan bulunmayan biçimler için ön-ek (و ف ب ل ك ال), bitişik
zamir, dişil ة ve çoğul/ikil ekleri soyularak tekrar bakılır; soyulan
parça etikete yazılır.

KURALLAR ÖLÇÜMLE BULUNDU, tahminle değil: sozluk/sina_cozumleyici.py
motoru 5/6/7/9/10. sınıfların ELDEN GEÇMİŞ çözümleriyle karşılaştırır.
Aşağıdaki her kural, o sınamada gördüğüm somut bir yanlıştan doğdu:

  • KİMLİK ÖNCELİĞİ — biçimin KENDİSİ sözlükte bir madde başıysa oraya
    bakılır: مُعَلِّمَة → معلمة (dişil isim), ama واسِعَة → واسع (dişil
    SIFAT; kendi maddesi yok). Elle "isim mi sıfat mı" ayırmak yerine
    sözlüğün kendi madde başlarına güveniyoruz.
  • ARANAN BİÇİM ال TAŞIMAZ — الثّالِثَة → ثالثة (الثالث değil).
  • س / أ ÖN EKİ yalnız FİİLDE soyulur — سَيِّدي → سيد, يد değil.
  • EDAT + ZAMİR BÜTÜN ARANIR (لي → لي), ZARF + ZAMİR köke iner
    (عِنْدي → عند). Kurulu veri ikisini böyle ayırıyor.
"""
import io, json, os, re, subprocess

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HAREKE = re.compile(r'[ً-ْـٰ]')
DISI_ARAP = re.compile(r'[^ء-ي]')


def yalin(t):
    return DISI_ARAP.sub('', HAREKE.sub('', t or ''))


# --------------------------------------------------------------- DİZİN
_DIZIN = None


def dizin():
    global _DIZIN
    if _DIZIN is None:
        p = subprocess.run(['node', os.path.join(KOK, 'sozluk', 'dizin_uret.js'), KOK],
                           capture_output=True, text=True)
        if p.returncode:
            raise SystemExit('dizin_uret.js: ' + p.stderr[:300])
        _DIZIN = json.loads(p.stdout)
    return _DIZIN


# ÖZEL ADLAR — sözlükte aranmaz. Şehir/ülke verisi zaten dizinde SKIP;
# burada KİŞİ adları ve sözlükte karşılığı olan yer adları var (القدس
# hem "kudsî" kökünü hem şehri karşılıyor, şehir kazanır).
OZEL_AD = set("""
أحمد زينب مريم ليلى علي فاتح عائشة خديجة فاطمة عمر عثمان حمزة يوسف إبراهيم
موسى عيسى محمد مصطفى سمية فرقان جحا سلمى رقية آمنة زكريا هارون يعقوب
زيد عبد خالد سعيد أسامة بلال أنس سلمان صهيب سليمان طارق الله لله بالله والله
القدس المكرمة المنورة حراء أحد قباء عرفات الصفا المروة بدر طيبة
تركيا إسطنبول أنقرة بورصة قونيا بولو مكة فلسطين السعودية الأردن
""".split())

# --------------------------------------------------------- ÖN EK / ZAMİR
# (ön ek, etiket, ال mi, yalnızFiil mi) — uzun olan önce denenir.
ONEKLER = [
    ('وال', 'atıf harfi', True, False), ('فال', 'atıf harfi', True, False),
    ('بال', 'harf-i cer', True, False), ('كال', 'harf-i cer', True, False),
    ('لل', 'harf-i cer', True, False), ('ال', '', True, False),
    ('وس', 'atıf harfi', False, True), ('فس', 'atıf harfi', False, True),
    ('و', 'atıf harfi', False, False), ('ف', 'atıf harfi', False, False),
    ('ب', 'harf-i cer', False, False), ('ل', 'harf-i cer', False, False),
    ('ك', 'harf-i cer', False, False),
    ('س', 'istikbal', False, True), ('أ', 'soru edatı', False, True),
]
ZAMIRLER = [
    ('هما', 'onlar (ikil)'), ('كما', 'siz (ikil)'),
    ('كم', 'siz'), ('كن', 'siz (dişil)'), ('هم', 'onlar'), ('هن', 'onlar (dişil)'),
    ('ني', 'ben'), ('ها', 'o · dişil'), ('نا', 'biz'),
    ('ه', 'o'), ('ك', 'sen'), ('ي', 'ben'),
]
ONEK_TUR_ETIKET = {
    'Harficer': 'harf-i cer', 'Edat': 'edat', 'Bağlaç': 'bağlaç',
    'Cevap': 'cevap harfi', 'Soru': 'soru edatı', 'Kalıp': 'kalıp',
    'Zaman': 'zarf (zaman)', 'Zarf': 'zarf', 'Yön': 'zarf (yön)',
}


def _adaylar(y):
    return dizin().get(y) or []


def _sec(y, fiilMi=None, isimZorunlu=False):
    """y için en uygun kayıt. KİMLİK ÖNCELİĞİ: aranan biçim y'nin kendisi
       olan kayıt varsa o kazanır (معلمة → معلمة, واسعة → واسع)."""
    a = _adaylar(y)
    if not a:
        return None
    if fiilMi is True:
        a = [x for x in a if x.get('tur') == 'fiil'] or None
        if not a:
            return None
    if isimZorunlu:
        # ال takısı fiile gelmez: ال'li bir biçim asla fiil çözülmemeli.
        a = [x for x in a if x.get('tur') != 'fiil'] or None
        if not a:
            return None
    def coguMu(x):
        e = (x.get('ek') or '').lower()
        return x.get('rol') == 'coguldan' or 'cogul' in e or 'cemi' in e
    # KİMLİK önceliği: biçimin kendisi madde başıysa oraya bak. AMA çoğul
    # kaydına uygulanmaz — أَطْباق dizinde geçiyor diye tekile (طبق)
    # inmemek yanlış olurdu.
    fiilVar = any(x.get('tur') == 'fiil' for x in a)
    kimlik = [x for x in a if x.get('ara') == y and not coguMu(x)
              and not (fiilVar and x.get('rol') == 'isim')]
    return (kimlik or a)[0]


# Cemi teksir (kırık çoğul) kalıpları — KALIP_DATA'daki adlarından
# alındı. Bu kalıptaki bir biçim KENDİSİNİ gösteriyorsa (دَقائِق → دقائق)
# tekili elimizde yok demektir; çözmüyoruz, cümle atlanır.
COGUL_KALIP = {41, 42, 43, 44, 45, 46, 47, 48}


def _alSiz(s):
    return s[2:] if s.startswith('ال') and len(s) > 3 else s


def _etiket(kayit, oz):
    tur = kayit.get('tur')
    onek = kayit.get('onek') or ''
    nitelik = []
    if tur == 'fiil':
        govde = 'fiil'
        rol = kayit.get('rol')
        nitelik.append('mazi' if rol == 'mazi' else ('emir' if rol == 'emir' else 'muzari'))
        if oz.get('istikbal'):
            nitelik.append('istikbal')
        if kayit.get('mezid'):
            nitelik.append('mezid')
    elif tur == 'zarf':
        govde = ONEK_TUR_ETIKET.get(onek, 'zarf')
    elif tur == 'edat':
        govde = ONEK_TUR_ETIKET.get(onek, 'edat')
    elif tur == 'ifade':
        govde = 'kalıp'
    else:
        govde = 'isim'
        rol = kayit.get('rol')
        if rol == 'mastar':
            nitelik.append('mastar')
        elif rol == 'fail':
            nitelik.append('ism-i fâil')
        elif rol == 'meful':
            nitelik.append("ism-i mef'ûl")
        ek = (kayit.get('ek') or '').lower()
        if oz.get('cogul'):
            nitelik.append(oz['cogul'])
        elif oz.get('ikil'):
            nitelik.append('ikil')
        elif rol == 'coguldan' or 'cogul' in ek or 'cemi' in ek:
            nitelik.append('kırık çoğul')
        if oz.get('al'):
            nitelik.append('ال takılı')
        if oz.get('disil') or kayit.get('mu'):
            nitelik.append('dişil')
    metin = govde + (' (' + ' · '.join(nitelik) + ')' if nitelik else '')
    if oz.get('onEk'):
        metin = oz['onEk'] + ' + ' + metin
    if oz.get('zamir'):
        metin += ' + bitişik zamir (' + oz['zamir'] + ')'
    return metin


def _cogulCoz(y):
    """Düzenli çoğul / ikil eklerini soyup tekili dener.
       (dizinde kırık çoğullar zaten var; burası SES çoğulları içindir)"""
    denemeler = []
    if y.endswith('ات') and len(y) > 4:
        denemeler.append((y[:-2] + 'ة', 'dişil çoğul'))
        denemeler.append((y[:-2], 'dişil çoğul'))
    if y.endswith('ون') and len(y) > 4:
        denemeler.append((y[:-2], 'düzenli çoğul'))
    if y.endswith('ين') and len(y) > 4:
        denemeler.append((y[:-2], 'düzenli çoğul'))
    if y.endswith('ان') and len(y) > 4:
        denemeler.append((y[:-2], 'ikil'))
    for kok, etiket in denemeler:
        k = _sec(kok)
        if k and k.get('tur') == 'isim':
            return k, kok, etiket
    return None, None, None


MAZI_EKI = ['تموا', 'تما', 'نا', 'تم', 'تن', 'وا', 'تا', 'ت', 'ا', 'وا']
MUZARI_ONU = {'ت': 'sen/dişil', 'ن': 'biz', 'أ': 'mütekellim', 'ي': ''}


def _fiilCoz(y):
    """Şahıs/zaman çekimli fiili köke indirir.
         ذَهَبْتُ → ذهب   ·  تَذْهَبُ → يذهب → ذهب  ·  نَلْعَبُ → يلعب → ذهb
       Sözlük dizininde yalnız MAZİ / MUZARİ / EMİR temel biçimleri var;
       çekimler burada normalleştirilir. Her adayı dizinde DOĞRULUYORUZ,
       uydurmuyoruz: karşılığı yoksa çözülmez."""
    # 1) muzari: baştaki şahıs harfini ي ile değiştir
    if len(y) > 3 and y[0] in MUZARI_ONU:
        aday = _sec('ي' + y[1:], True)
        if aday:
            return aday, 'ي' + y[1:], {'kisi': MUZARI_ONU[y[0]]}
    # 2) mazi: sondaki şahıs ekini at
    for ek in MAZI_EKI:
        if y.endswith(ek) and len(y) > len(ek) + 2:
            aday = _sec(y[:-len(ek)], True)
            if aday and aday.get('rol') == 'mazi':
                return aday, y[:-len(ek)], {'kisi': ''}
    return None, None, None


TENVIN_SONU = re.compile(r'\u064b\s*ا?\s*[^\u0621-\u064a]*$')


def coz(metin):
    """(root, category) ya da çözülemezse None."""
    y = yalin(metin)
    if not y:
        return None
    if TENVIN_SONU.search(metin or '') and len(y) > 2:
        govdeT, onEkT = y, None
        if not _sec(y):
            for ek, etiket, alMi, yalnizFiil in ONEKLER[:9]:
                if y.startswith(ek) and len(y) > len(ek) + 2 and _sec(y[len(ek):]):
                    govdeT, onEkT = y[len(ek):], etiket
                    break
            else:
                # Tenvinli biçim sözlükte hiç yoksa bile atıf harfi
                # soyulur: وَسَهْلًا → سهلا (kurulu veri böyle yazıyor).
                if y[0] in ('و', 'ف') and len(y) > 3:
                    govdeT, onEkT = y[1:], 'atıf harfi'
        k0 = _sec(govdeT)
        oz0 = {'onEk': onEkT} if onEkT else {}
        if k0 and k0.get('tur') in ('zarf', 'edat', 'ifade'):
            return (govdeT, _etiket(k0, oz0))
        # Tenvin-i nasb elifi düşürülünce İSİM çıkıyorsa aranan biçim odur:
        #   صَوْتًا → صوت.  Çıkmıyorsa zarf sayılır: أَوَّلًا → أولا.
        if govdeT.endswith('ا') and len(govdeT) > 3:
            k1 = _sec(govdeT[:-1])
            if k1 and k1.get('tur') == 'isim' and k1.get('ara') == govdeT[:-1]:
                return (govdeT[:-1], _etiket(k1, oz0))
        return (govdeT, ('atıf harfi + zarf' if onEkT else 'zarf'))
    if _alSiz(y) in OZEL_AD or y in OZEL_AD:
        return ('SKIP', 'isim (özel)')

    alli = y.startswith('ال')
    oz = {}
    k = _sec(y, isimZorunlu=alli)
    govde = y

    # --- ön ek soy -----------------------------------------------------
    if not k:
        for ek, etiket, alMi, yalnizFiil in ONEKLER:
            if not y.startswith(ek) or len(y) <= len(ek) + 1:
                continue
            kalan = y[len(ek):]
            aday = None
            if yalnizFiil:
                # Önce ÇEKİMİ çöz: أَعْمَلُ burada "İf'âl mazi" diye değil,
                # muzari mütekellim diye okunmalı (سَأَعْمَلُ → عمل).
                a0, g0, _b = _fiilCoz(kalan)
                if a0:
                    aday, kalan = a0, g0
            if aday is None:
                aday = _sec(kalan, True if yalnizFiil else None, isimZorunlu=alMi)
            if not aday and not alMi and not yalnizFiil:
                aday = _sec('ال' + kalan)
                if aday:
                    oz['al'] = True
            if not aday:
                continue
            if _alSiz(kalan) in OZEL_AD:
                return ('SKIP', (etiket + ' + ' if etiket else '') + 'isim (özel)')
            k, govde = aday, kalan
            if alMi:
                oz['al'] = True
            if etiket == 'istikbal':
                oz['istikbal'] = True
            elif etiket:
                oz['onEk'] = etiket
            break

    # --- dişil ة: ölçüme dayalı kural ---------------------------------
    #  Kurulu veride ة'li biçimin sözlükte KENDİ maddesi varsa ة korunur
    #  (معلمة → معلمة), yoksa sıfat sayılıp atılır (واسعة → واسع). Ama
    #  "yoksa at" kuralı ölçümde 18 yanlış üretti (طبيبة، قائمة، ثالثة…),
    #  "hep koru" da 41 yanlış. Kararsız kümede ÇÖZMÜYORUZ: cümle atlanır,
    #  yanlış dilbilgisi çıkmaz. (Kimlik/mu kayıtları zaten yukarıda
    #  bulunuyor; buraya yalnız kararsızlar düşer.)
    if not k:
        ham = _alSiz(y)
        if ham.endswith('ة') and len(ham) > 3:
            return None

    # --- çoğul / ikil ---------------------------------------------------
    if not k:
        ham = _alSiz(y)
        aday, kok, etiket = _cogulCoz(ham)
        if aday:
            k, govde = aday, kok
            oz['cogul' if etiket != 'ikil' else 'ikil'] = etiket
            if ham != y:
                oz['al'] = True

    # --- fiil çekimi (şahıs/zaman) -------------------------------------
    if not k and not alli:
        aday, govdeF, bilgi = _fiilCoz(y)
        if aday:
            k, govde = aday, govdeF

    # --- bitişik zamir --------------------------------------------------
    # ال ile zamir bir arada olmaz: الْقُدْسي'deki ي nisbet ekidir,
    # zamir değil. ال'li biçimde bu yol hiç denenmez.
    if not k and not alli:
        for zm, kisi in ZAMIRLER:
            if not y.endswith(zm) or len(y) <= len(zm):
                continue
            govdeler = [y[:-len(zm)]]
            if govdeler[0].endswith('ت'):
                govdeler.append(govdeler[0][:-1] + 'ة')   # مدرستي → مدرسة
            aday, secilen, onEkBilgi = None, None, None
            for g in govdeler:
                aday = _sec(g)
                if aday:
                    secilen = g
                    break
                for ek, etiket, alMi, yalnizFiil in ONEKLER:
                    if yalnizFiil or not g.startswith(ek) or len(g) <= len(ek) + 1:
                        continue
                    a2 = _sec(g[len(ek):])
                    if a2:
                        aday, secilen, onEkBilgi = a2, g[len(ek):], (etiket, alMi)
                        break
                if aday:
                    break
            if not aday:
                continue
            k, govde = aday, secilen
            oz['zamir'] = kisi
            if onEkBilgi:
                if onEkBilgi[1]:
                    oz['al'] = True
                if onEkBilgi[0]:
                    oz['onEk'] = onEkBilgi[0]
            # EDAT + zamir bütün aranır (لي → لي); zarf/isim köke iner.
            if aday.get('tur') == 'edat':
                return (y, _etiket(aday, {'zamir': kisi}))
            break

    if not k:
        return None
    if k.get('ara') == 'SKIP':
        return ('SKIP', _skipEtiket(k))

    if govde.startswith('ال') and k.get('tur') == 'isim':
        oz['al'] = True
    if k.get('tur') == 'isim' and govde.endswith('ة') and k['ara'] != govde and not oz.get('disil'):
        oz['disil'] = True

    # --- EK'e göre aranan biçim (kurulu veriyle ölçülerek bulundu) -----
    ek = k.get('ek') or ''
    hamGovde = _alSiz(govde)
    if ek == 'ة':
        # Dişil ة: ism-i fâilden gelen isimde KORUNUR (مُعَلِّمَة → معلمة,
        # طالِبَة → طالبة); sıfatta atılır (كَبيرَة → كبير). Sıfat/ism-i
        # mef'ûl ayrımı elimizde kesin olmadığı için ism-i fâil dışındaki
        # kararsız durumlarda ÇÖZMÜYORUZ.
        if k.get('rol') == 'fail':
            return (hamGovde, _etiket(k, dict(oz, disil=True)))
        return None
    if ek in ('ات', 'يَّات', 'يَّاتٌ'):
        # Dişil ses çoğulu TEKİL DİŞİLE iner: مُسْلِمات → مسلمة
        oz['cogul'] = 'dişil çoğul'
        return (k['ara'] + 'ة', _etiket(k, oz))
    if ek in ('يّ', 'ي', 'يَّة', 'ية', 'يًّا', 'يَّ', 'ِيَّة', 'يَّات'):
        # Nispet eki: aranan biçim nispetli hâlidir (قُدْسي → قدسي)
        return (hamGovde, _etiket(k, oz))
    if k.get('kalip') in COGUL_KALIP and k.get('ara') == hamGovde:
        return None                 # kırık çoğulun tekili elimizde yok

    if k.get('ara') == hamGovde + 'ة':
        # Kayıt, biçimin ة'li eşine götürüyor (سِتّ → ستة, الحَمّام →
        # حمامة). Kurulu veri biçimin KENDİSİNİ arıyor.
        return (hamGovde, _etiket(k, oz))
    if (k.get('rk') or '')[:5] in ('Sayı:', 'Sıra:') and hamGovde.endswith('ة'):
        # Sayı ve sıra sayısında dişil ة korunur: الثّالِثَة → ثالثة
        return (hamGovde, _etiket(k, dict(oz, disil=True)))

    ara = _alSiz(k['ara'])          # aranan biçim ال taşımaz
    if ara in OZEL_AD:
        return ('SKIP', 'isim (özel)')
    return (ara, _etiket(k, oz))


def _skipEtiket(k):
    onek = k.get('onek') or ''
    return {'Zamir': 'zamir', 'İşaret': 'işaret ismi', 'Mevsul': 'ismi mevsul',
            'Şehir': 'isim (özel · yer)', 'Ülke': 'isim (özel · yer)',
            'Kıta': 'isim (özel · yer)'}.get(onek, 'isim (özel)')
