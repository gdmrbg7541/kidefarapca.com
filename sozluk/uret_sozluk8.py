#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SÖZLÜK SİMÜLASYONU — 8. SINIF VERİSİNİ ÜRETİR
=============================================
Kaynak : muhadese/veri/8_1_1 … 8_6_3 ders cümleleri (18 ders, 6 ünite)
Çıktı  : sozluk/veri/sozluk_8.js

6. sınıfın betiğinden (uret_sozluk6.py) TEK FARKI: orada her kelimenin
"aranan yalın biçimi" dosyanın içindeki ELLE yazılmış sözlükçeden (EK)
geliyordu. 8. sınıfta 994 ayrı biçim var; elle yazmak yerine
sozluk/cozumleyici.py sitenin KENDİ sözlük ve kök verisinden türetiyor.
Motorun doğruluğu ölçüldü (sozluk/sina_cozumleyici.py): 5/6/7/9/10.
sınıfların elden geçmiş çözümlerinde kök TAM %78.8 · YANLIŞ %6.4.

EMNİYET: bir kelimesi bile çözülemeyen cümle ATLANIR. Böylece veri
azalır ama yanlış dilbilgisi ekrana çıkmaz — 6. sınıfın betiğindeki
kuralın aynısı.

Betik YİNELENEBİLİR: ders verisi büyürse yeniden çalıştırılır.
"""
import collections, io, json, os, subprocess, sys

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(KOK, 'sozluk'))
import cozumleyici as CZ

# =====================================================================
# EL EKİ — motorun çözemediği biçimler
# ---------------------------------------------------------------------
# Motor sitenin sözlük/kök verisinden besleniyor; o veride karşılığı
# olmayan biçimler burada ELLE tamamlanır (6. sınıfın betiğindeki EK
# tablosunun aynısı). Liste, üretimden sonra yazılan
# /tmp/cozulemeyen8.json'daki EN SIK biçimlerden çıkarıldı: her satır
# bir cümleyi daha oyuna sokuyor.
#   yalın_biçim: (aranan_biçim, dilbilgisi etiketi)
# NOT: etiketteki sözcükler SEVİYE kuralını da belirler — 'fiil',
# 'çoğul', 'bitişik zamir', 'mezid' gibi kelimeler oradan okunuyor.
# =====================================================================
EK = {
    # ---- fiiller -----------------------------------------------------
    'تحب':    ('أحب',  'fiil (muzari · mezid · muhatap)'),
    'يحب':    ('أحب',  'fiil (muzari · mezid)'),
    'أحب':    ('أحب',  'fiil (mazi · mezid)'),
    'نحب':    ('أحب',  'fiil (muzari · mezid · mütekellim)'),
    'تقع':    ('وقع',  'fiil (muzari · misal · dişil)'),
    'يقع':    ('وقع',  'fiil (muzari · misal)'),
    'ألتقي':  ('التقى', 'fiil (muzari · mezid · nakıs · mütekellim)'),
    'يلتقي':  ('التقى', 'fiil (muzari · mezid · nakıs)'),
    'تخرجت':  ('تخرج', 'fiil (mazi · mezid · mütekellim)'),
    'صليت':   ('صلى',  'fiil (mazi · nakıs · mütekellim)'),
    'ستجد':   ('وجد',  'fiil (muzari · istikbal · misal · muhatap)'),
    'تصدقني': ('صدق',  'fiil (muzari · mezid · muhatap) + bitişik zamir (ben)'),
    'سأذهب':  ('ذهب',  'fiil (muzari · istikbal · mütekellim)'),

    # ---- kırık ve ses çoğulları -------------------------------------
    'الكتب':    ('كتاب',  'isim (kırık çoğul · ال takılı)'),
    'الأماكن':  ('مكان',  'isim (kırık çoğul · ال takılı)'),
    'الكوارث':  ('كارثة', 'isim (kırık çoğul · ال takılı)'),
    'أصدقائي':  ('صديق',  'isim (kırık çoğul) + bitişik zamir (ben)'),
    'أصدقائه':  ('صديق',  'isim (kırık çoğul) + bitişik zamir (o)'),
    'الأصدقاء': ('صديق',  'isim (kırık çoğul · ال takılı)'),
    'أصدقاء':   ('صديق',  'isim (kırık çoğul)'),
    'الأقارب':  ('قريب',  'isim (kırık çoğul · ال takılı)'),
    'أدوات':    ('أداة',  'isim (dişil çoğul)'),
    'الأدوات':  ('أداة',  'isim (dişil çoğul · ال takılı)'),
    'هدايا':    ('هدية',  'isim (kırık çoğul)'),
    'الزلازل':  ('زلزال', 'isim (kırık çoğul · ال takılı)'),
    'الصور':    ('صورة',  'isim (kırık çoğul · ال takılı)'),
    'الأشياء':  ('شيء',   'isim (kırık çoğul · ال takılı)'),
    'الرياضات': ('رياضة', 'isim (dişil çoğul · ال takılı)'),
    'الأندية':  ('نادي',  'isim (kırık çoğul · ال takılı)'),

    # ---- dişil isimler ----------------------------------------------
    'صديقتي':   ('صديقة', 'isim (dişil) + bitişik zamir (ben)'),
    'صديقتها':  ('صديقة', 'isim (dişil) + bitişik zamir (o · dişil)'),
    'ممثلة':    ('ممثلة', 'isim (ism-i fâil · dişil)'),
    'حفلة':     ('حفلة',  'isim (dişil)'),
    'شهادة':    ('شهادة', 'isim (mastar · dişil)'),
    'منطقة':    ('منطقة', 'isim (dişil)'),
    'نهاية':    ('نهاية', 'isim (mastar · dişil)'),
    'قراءة':    ('قراءة', 'isim (mastar)'),
    'القراءة':  ('قراءة', 'isim (mastar · ال takılı)'),
    'ليلة':     ('ليلة',  'isim (dişil)'),
    'وليلة':    ('ليلة',  'atıf harfi + isim (dişil)'),
    'السعادة':  ('سعادة', 'isim (mastar · ال takılı)'),
    'الصداقة':  ('صداقة', 'isim (mastar · ال takılı)'),
    'التخرج':   ('تخرج',  'isim (mastar · ال takılı)'),
    'التقاطع':  ('تقاطع', 'isim (mastar · ال takılı)'),

    # ---- sıfatlar (dişili eril hâliyle aranır) ----------------------
    'مفيدة':    ('مفيد',  'isim (sıfat · dişil)'),
    'جميلة':    ('جميل',  'isim (sıfat · dişil)'),
    'قريبة':    ('قريب',  'isim (sıfat · dişil)'),
    'ممتعة':    ('ممتع',  'isim (sıfat · dişil)'),
    'مسؤولة':   ('مسؤول', 'isim (sıfat · dişil)'),
    'القديمة':  ('قديم',  'isim (sıfat · ال takılı · dişil)'),
    'الطويلة':  ('طويل',  'isim (sıfat · ال takılı · dişil)'),
    'الصغيرة':  ('صغير',  'isim (sıfat · ال takılı · dişil)'),
    'ذاهبة':    ('ذاهب',  'isim (ism-i fâil · dişil)'),
    'المتوسطة': ('متوسط', 'isim (sıfat · ال takılı · dişil)'),

    # ---- nisbet sıfatları -------------------------------------------
    'التركي':    ('تركي',   'isim (sıfat · ال takılı)'),
    'العربي':    ('عربي',   'isim (sıfat · ال takılı)'),
    'التاريخية': ('تاريخي', 'isim (sıfat · ال takılı · dişil)'),
    'الطبيعية':  ('طبيعي',  'isim (sıfat · ال takılı · dişil)'),
    'الجماعية':  ('جماعي',  'isim (sıfat · ال takılı · dişil)'),
    'الفردية':   ('فردي',   'isim (sıfat · ال takılı · dişil)'),
    'اليدوية':   ('يدوي',   'isim (sıfat · ال takılı · dişil)'),

    # ---- edat ve bağlaçlar ------------------------------------------
    'أن':    ('أن',   'masdar harfi'),
    'إلا':   ('إلا',  'istisna edatı'),
    'لذلك':  ('لذلك', 'bağlaç'),
    'ولذلك': ('لذلك', 'atıf harfi + bağlaç'),
    'لكن':   ('لكن',  'bağlaç'),
    'بدقة':  ('دقة',  'harf-i cer + isim (mastar)'),
    'عند':   ('عند',  'zarf (mekân)'),

    # ---- özel adlar (sözlükte aranmaz) ------------------------------
    'كلخانة': ('SKIP', 'isim (özel · yer)'),
    'طوب':    ('SKIP', 'isim (özel · yer)'),
    'قابي':   ('SKIP', 'isim (özel · yer)'),
    'آيا':    ('SKIP', 'isim (özel · yer)'),
    'صوفيا':  ('SKIP', 'isim (özel · yer)'),
    'أسبندوس': ('SKIP', 'isim (özel · yer)'),

    # ---- ikinci tur (üretim raporundaki kalan biçimler) --------------
    'مهمة':      ('مهم',   'isim (sıfat · dişil)'),
    'قديمة':     ('قديم',  'isim (sıfat · dişil)'),
    'جيدة':      ('جيد',   'isim (sıfat · dişil)'),
    'بعيدة':     ('بعيد',  'isim (sıfat · dişil)'),
    'كبيرة':     ('كبير',  'isim (sıfat · dişil)'),
    'مختلفة':    ('مختلف', 'isim (ism-i fâil · mezid · dişil)'),
    'وجميلة':    ('جميل',  'atıf harfi + isim (sıfat · dişil)'),
    'الحفلة':    ('حفلة',  'isim (ال takılı · dişil)'),
    'بصديقتي':   ('صديقة', 'harf-i cer + isim (dişil) + bitişik zamir (ben)'),
    'وأصدقائي':  ('صديق',  'atıf harfi + isim (kırık çoğul) + bitişik zamir (ben)'),
    'أقاربي':    ('قريب',  'isim (kırık çoğul) + bitişik zamir (ben)'),
    'طلاب':      ('طالب',  'isim (kırık çoğul)'),
    'المتاحف':   ('متحف',  'isim (kırık çoğul · ال takılı)'),
    'دروسي':     ('درس',   'isim (kırık çoğul) + bitişik zamir (ben)'),
    'بمسؤولياتي': ('مسؤولية', 'harf-i cer + isim (dişil çoğul) + bitişik zamir (ben)'),
    'العديد':    ('عديد',  'isim (ال takılı)'),
    'المغمور':   ('مغمور', "isim (ism-i mef'ûl · ال takılı)"),
    'البازار':   ('بازار', 'isim (ال takılı)'),
    # fiiller — dişil muhatap ve mütekellim çekimleri
    'تحبين':     ('أحب',   'fiil (muzari · mezid · muhatap · dişil)'),
    'تقومين':    ('قام',   'fiil (muzari · ecvef · muhatap · dişil)'),
    'تقرئين':    ('قرأ',   'fiil (muzari · mehmuz · muhatap · dişil)'),
    'كنت':       ('كان',   'fiil (mazi · ecvef · mütekellim)'),
    'زرت':       ('زار',   'fiil (mazi · ecvef · mütekellim)'),
    'وزرت':      ('زار',   'atıf harfi + fiil (mazi · ecvef · mütekellim)'),
    'سأضع':      ('وضع',   'fiil (muzari · istikbal · misal · mütekellim)'),
    'ستجدها':    ('وجد',   'fiil (muzari · istikbal · misal · muhatap) + bitişik zamir (o · dişil)'),
    'ستجده':     ('وجد',   'fiil (muzari · istikbal · misal · muhatap) + bitişik zamir (o)'),
    # edat / cevap
    'أليس':      ('ليس',   'soru edatı + nakıs fiil'),
    'بلى':       ('بلى',   'cevap harfi'),
    'دودن':      ('SKIP',  'isim (özel · yer)'),
}

DERSLER = ['8_%d_%d' % (u, d) for u in range(1, 7) for d in range(1, 4)]
HEDEF = os.path.join(KOK, 'sozluk', 'veri', 'sozluk_8.js')

NODE = r'''
const fs = require('fs'), vm = require('vm');
const arg = process.argv.slice(1).filter(a => a !== '--');
const kok = arg[0], dersler = arg.slice(1), out = [];
for (const d of dersler) {
  const ctx = { window: {}, console }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(kok + '/muhadese/veri/' + d + '.js', 'utf8'), ctx);
  ((ctx.window.data || {}).sentence || []).forEach(s => out.push({ ders: d, words: s.words }));
}
process.stdout.write(JSON.stringify(out));
'''


def cumleler():
    p = subprocess.run(['node', '-e', NODE, KOK] + DERSLER, capture_output=True, text=True)
    if p.returncode:
        sys.exit('node: ' + p.stderr[:400])
    ham = json.loads(p.stdout)
    cik = []
    for c in ham:
        kel = sorted(c['words'], key=lambda w: w['order'])
        cik.append({
            'ders': c['ders'],
            'parca': [{'ar': w['ar'], 'tr': w['tr']} for w in kel],
            'trTam': ' '.join(w['tr'] for w in c['words']).strip(),
        })
    return cik


def seviye(kategoriler):
    """uret_sozluk6.py'deki kuralın AYNISI — seviyeler sınıflar arasında
       aynı anlama gelsin."""
    s = 1
    for k in kategoriler:
        if 'fiil' in k or 'nehiy' in k:
            zor = any(x in k for x in ('ecvef', 'nakıs', 'misal', 'mehmuz', 'mezid',
                                       'mudâaf', 'lefif', 'meçhul'))
            s = max(s, 4 if zor else 3)
        elif ('bitişik zamir' in k or 'çoğul' in k or 'sayı' in k
              or 'ikil' in k or 'maksûr' in k):
            s = max(s, 2)
    return s


BASLIK = {
    1: 'Seviye 1 · <bdi class="ip-ar">ال</bdi> takısı ve yalın isim',
    2: 'Seviye 2 · Bitişik zamir, sayı ve çoğul',
    3: 'Seviye 3 · Fiiller: muzariden maziye',
    4: 'Seviye 4 · İlletli, mehmuz ve mezid fiiller',
}
KURAL = {
    1: ['Kelimenin başındaki <bdi class="ip-ar">ال</bdi> takısı atılır: '
        '<bdi class="ip-ar">النّادي</bdi> → <bdi class="ip-ar">نادي</bdi>.',
        'Harekeler ve sondaki tenvin yazılmaz.',
        'Harf-i cer kelimeye bitişikse o da atılır: '
        '<bdi class="ip-ar">بِالرِّياضَة</bdi> → <bdi class="ip-ar">رياضة</bdi>.',
        'Özel adlar (kişi, şehir) sözlükte aranmaz, atlanır.'],
    2: ['Önceki seviyenin kuralları geçerlidir.',
        'Bitişik zamir atılır: <bdi class="ip-ar">صَديقي</bdi> → '
        '<bdi class="ip-ar">صديق</bdi>.',
        'Çoğul, <b>tekil</b> biçimiyle aranır: '
        '<bdi class="ip-ar">الأَنْدِيَة</bdi> → <bdi class="ip-ar">نادي</bdi>.',
        'Dişil çoğulun tekili de dişildir: '
        '<bdi class="ip-ar">الرِّياضات</bdi> → <bdi class="ip-ar">رياضة</bdi>.'],
    3: ['Önceki seviyelerin kuralları geçerlidir.',
        'Fiil, sözlükte <b>mazi</b> (geçmiş zaman) biçimiyle aranır: '
        '<bdi class="ip-ar">يَخْتارُ</bdi> → <bdi class="ip-ar">اختار</bdi>.',
        'Şahıs ve zaman ekleri atılır: '
        '<bdi class="ip-ar">سَأَذْهَبُ، ذَهَبوا، كَتَبْتُ</bdi> → '
        '<bdi class="ip-ar">ذهب، ذهب، كتب</bdi>.',
        'Emir ve nehiy de maziye çevrilir.'],
    4: ['Önceki seviyelerin kuralları geçerlidir.',
        '<b>Ecvef</b> (ortası illetli) fiilde harf geri gelir: '
        '<bdi class="ip-ar">يَقولُ</bdi> → <bdi class="ip-ar">قال</bdi>.',
        '<b>Misâl</b> fiilde düşen <bdi class="ip-ar">و</bdi> geri gelir: '
        '<bdi class="ip-ar">تَقَعُ</bdi> → <bdi class="ip-ar">وقع</bdi>.',
        '<b>Mezid</b> fiil, artan harfleriyle birlikte aranır: '
        '<bdi class="ip-ar">يُنَظِّفُ</bdi> → <bdi class="ip-ar">نظف</bdi>.'],
}


def ipucu(sv, ornekler):
    h = ('<h3 dir="ltr">' + BASLIK[sv] + '</h3>'
         '<p class="ip-sinif" dir="ltr">8. sınıf muhâdese cümlelerinden</p><ul>')
    h += ''.join('<li>' + k + '</li>' for k in KURAL[sv]) + '</ul>'
    if ornekler:
        h += '<p class="ip-bas" dir="ltr">Bu seviyeden örnekler:</p><ul class="ip-ornek">'
        for t, r, k in ornekler:
            h += ('<li><bdi class="ip-ar">' + t + '</bdi> → '
                  '<bdi class="ip-ar"><b>' + r + '</b></bdi> <i>(' + k + ')</i></li>')
        h += '</ul>'
    return h


def main():
    cml = cumleler()
    kutu = {1: [], 2: [], 3: [], 4: []}
    cozulemeyen = collections.Counter()
    atlanan = 0

    for c in cml:
        ar, kat, tr = [], [], []
        atla = False
        for p in c['parca']:
            for parca in p['ar'].split():
                y = CZ.yalin(parca)
                if not y:
                    continue
                g = EK.get(y) or CZ.coz(parca)
                if not g:
                    cozulemeyen[y] += 1
                    atla = True
                    break
                ar.append({'text': parca, 'root': g[0], 'category': g[1]})
                kat.append(g[1])
            if atla:
                break
            tr.append(p['tr'] or '—')
        if atla or not ar:
            atlanan += 1
            continue
        # Türkçe dizisi Arapça parça sayısıyla hizalansın
        while len(tr) < len(ar):
            tr.append('—')
        kutu[seviye(kat)].append({'arabic': ar, 'turkish': tr[:len(ar)],
                                  'turkishFull': c['trTam'], 'ders': c['ders']})

    ANAHTAR = {1: 'al', 2: 'zamir', 3: 'fiil', 4: 'illetli'}
    seviyeler = []
    for sv in (1, 2, 3, 4):
        gor, orn = set(), []
        for s in kutu[sv]:
            for w in s['arabic']:
                if w['root'] == 'SKIP' or w['root'] in gor:
                    continue
                ilgi = (('fiil' in w['category']) if sv >= 3
                        else ('çoğul' in w['category'] or 'bitişik zamir' in w['category'])
                        if sv == 2 else 'ال takılı' in w['category'])
                if not ilgi:
                    continue
                gor.add(w['root'])
                orn.append((w['text'], w['root'], w['category']))
                if len(orn) >= 6:
                    break
            if len(orn) >= 6:
                break
        seviyeler.append({'level': sv, 'anahtar': ANAHTAR[sv],
                          'hint': ipucu(sv, orn), 'sentences': kutu[sv]})

    toplamCumle = sum(len(s['sentences']) for s in seviyeler)
    toplamKelime = sum(len(c['arabic']) for s in seviyeler for c in s['sentences'])
    veri = {'sinif': 8, 'cumle': toplamCumle, 'kelime': toplamKelime,
            'seviyeler': seviyeler}

    bas = ('/* =====================================================================\n'
           '   SÖZLÜK SİMÜLASYONU — 8. SINIF VERİSİ            (üretilmiş dosya)\n'
           '   ---------------------------------------------------------------------\n'
           '   KAYNAK: muhadese/veri/8_1_1 … 8_6_3 ders cümleleri (6 ünite, 18 ders).\n'
           '   Arapça ELLE YAZILMADI; ders verisinden alındı.\n'
           '   KÖK: üç harfli sarf kökü değil, SÖZLÜKTE ARANAN yalın biçim\n'
           '   (ال atılır, bitişik zamir atılır, çoğul tekile döner, fiil maziye).\n'
           '   Bu alanlar sozluk/cozumleyici.py ile sitenin KENDİ sözlük/kök\n'
           '   verisinden türetildi; motorun doğruluğu 5/6/7/9/10. sınıfların\n'
           '   elden geçmiş çözümleriyle ölçüldü (kök TAM %78.8, YANLIŞ %6.4 —\n'
           '   bkz. sozluk/sina_cozumleyici.py).\n'
           '   Bir kelimesi bile çözülemeyen cümle ALINMADI: veri azalır ama\n'
           '   yanlış dilbilgisi çıkmaz.\n'
           '   ÜRETİCİ: sozluk/uret_sozluk8.py — ders verisi değişirse yeniden üret.\n'
           '   ===================================================================== */\n')
    with io.open(HEDEF, 'w', encoding='utf-8') as f:
        f.write(bas)
        f.write('window.SOZLUK_SINIF = window.SOZLUK_SINIF || {};\n')
        f.write('window.SOZLUK_SINIF["8"] = ' +
                json.dumps(veri, ensure_ascii=False, indent=2) + ';\n')

    print('ders cümlesi        : %d' % len(cml))
    print('alınan cümle        : %d  (%%%.1f)' % (toplamCumle, 100.0 * toplamCumle / len(cml)))
    print('atlanan cümle       : %d' % atlanan)
    print('kelime              : %d' % toplamKelime)
    for s in seviyeler:
        print('  seviye %d (%-8s): %3d cümle' % (s['level'], s['anahtar'], len(s['sentences'])))
    print('çözülemeyen biçim   : %d' % len(cozulemeyen))
    print('  en sık 30:', ' '.join('%s(%d)' % (k, v) for k, v in cozulemeyen.most_common(30)))
    io.open('/tmp/cozulemeyen8.json', 'w', encoding='utf-8').write(
        json.dumps(cozulemeyen.most_common(), ensure_ascii=False))


main()
