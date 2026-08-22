#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KALIPLAR TABLOSU → BİLGİ YARIŞMASI SORU ÜRETİCİSİ
=================================================

Kaynak (tek gerçek kaynak — tablo da aynı dosyaları okur):
    veri/veri_kokler.js            wordEasterEggs · babVezinleri
    veri/veri_sozluk.js            sozlukVerileri (kokler ile birleşir)
    veri/veri_vezin_numaralari.js  KALIP_DATA  (1..105 kalıp adresi)
    sarf/kaliplartablosudijital.js embeddedGameData.roots (Türkçe alıntılar)

Çıktı:
    oyunlar/biy_kaliplar.js  →  window.BIY_EK_KONULAR'a "kaliplar" konusu

Betik DETERMİNİSTİK'tir: rastgelelik yok, tohumlu Fisher-Yates kullanılır.
Aynı veriyle iki kez çalıştırılırsa bayt bayt aynı dosya üretilir.
Veri büyürse betik yeniden çalıştırılır; sistem/sinifveri.js'teki soru
sayısı da elle güncellenir (betik sonunda yazdırılır).

ÜRETİLEN SORU TİPLERİ
  A · Anlam        A1 ar→tr · A2 tr→ar · A3 emoji ipuçlu
  B · Kalıp/bâb    B1 kelime→kalıp · B2 kök+kalıp→kelime · B3 kelime→bâb
                   B4 vezin→bâb · B5 doğru-yanlış
  C · Yapı         C1 bâb dörtlüsü sırala · C2 eşleştirme
  D · Bağlam       D1 örnek cümlede boşluk · D2 cümle sırala
                   D3/D4 Türkçedeki Arapça alıntılar

ÇELDİRİCİ İLKESİ (öğretici olması için, rastgele havuz DEĞİL)
  · anlam ar→tr  → AYNI KALIPTAN başka kökler  (vezinden değil anlamdan ayır)
  · anlam tr→ar  → AYNI KÖKÜN başka kalıpları  (doğru kalıbı seçmek zorunda)
  · kalıp/bâb    → komşu kalıp (fâil ↔ mef'ûl) ve aynı harf-sayısı grubu
"""

import io, json, os, re, subprocess, sys, tempfile, unicodedata

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CIKTI = os.path.join(KOK, 'oyunlar', 'biy_kaliplar.js')

HAREKE = re.compile(r'[ؗ-ًؚ-ْٰـ]')
AR3 = re.compile(r'^[ء-ي]{3}$')
ARKEL = re.compile(r'[ء-ي]')

# --------------------------------------------------------------------------
# 0) Tohumlu karıştırma — Math.random YOK, çıktı her koşuda aynı
# --------------------------------------------------------------------------

def karisik(dizi, tohum):
    """Tohumlu Fisher-Yates. Girdiyi bozmaz, yeni liste döner."""
    d = list(dizi)
    x = (tohum * 6364136223846793005 + 1442695040888963407) & 0xFFFFFFFFFFFFFFFF
    for i in range(len(d) - 1, 0, -1):
        x = (x * 6364136223846793005 + 1442695040888963407) & 0xFFFFFFFFFFFFFFFF
        j = (x >> 33) % (i + 1)
        d[i], d[j] = d[j], d[i]
    return d

# --------------------------------------------------------------------------
# 1) Veriyi node ile oku (JS dosyaları JSON değil, vm ile çalıştırılır)
# --------------------------------------------------------------------------

DUMPER = r'''
const fs=require('fs'), vm=require('vm');
const ctx={ window:{}, console,
  document:{ getElementById:()=>null, querySelector:()=>null, querySelectorAll:()=>[],
             addEventListener:()=>{}, createElement:()=>({style:{},classList:{add(){},remove(){}},appendChild(){}}) },
  navigator:{userAgent:''}, location:{search:'',href:''},
  setTimeout:()=>0, setInterval:()=>0, localStorage:{getItem:()=>null,setItem:()=>{}} };
ctx.globalThis=ctx; vm.createContext(ctx);
const KOK=process.argv[2];
function calistir(p){ vm.runInContext(fs.readFileSync(KOK+'/'+p,'utf8'), ctx, {filename:p}); }
calistir('veri/veri_kokler.js');
calistir('veri/veri_vezin_numaralari.js');
calistir('veri/veri_sozluk.js');
const al = k => { try { return vm.runInContext(k, ctx); } catch(e){ return null; } };

/* Türkçe alıntılar — kaliplartablosudijital.js içindeki embeddedGameData */
let alinti=[];
try{
  const s=fs.readFileSync(KOK+'/sarf/kaliplartablosudijital.js','utf8');
  const i=s.indexOf('const embeddedGameData'), st=s.indexOf('{', i);
  let d=0,end=st;
  for(let j=st;j<s.length;j++){ if(s[j]==='{')d++; else if(s[j]==='}'){ d--; if(d===0){ end=j; break; } } }
  const c2={}; vm.createContext(c2); vm.runInContext('var E='+s.slice(st,end+1)+';', c2);
  const r=c2.E.roots; alinti = Array.isArray(r)? r : Object.values(r||{});
}catch(e){ alinti=[]; }

process.stdout.write(JSON.stringify({
  sozluk: al('typeof sozlukVerileri!=="undefined"?sozlukVerileri:null'),
  kalip:  al('typeof KALIP_DATA!=="undefined"?KALIP_DATA:null'),
  bab:    al('typeof babVezinleri!=="undefined"?babVezinleri:null'),
  alinti: alinti
}));
'''

def veriOku():
    fd, yol = tempfile.mkstemp(suffix='.js')
    os.close(fd)
    io.open(yol, 'w', encoding='utf-8').write(DUMPER)
    try:
        ham = subprocess.check_output(['node', yol, KOK])
    finally:
        os.unlink(yol)
    return json.loads(ham.decode('utf-8'))

# --------------------------------------------------------------------------
# 2) Hücreleri düz bir listeye indir
# --------------------------------------------------------------------------

def hucreler(sozluk):
    """[{kok, ref, ar, tr, emoji, ornek:[{ar,tr}], cogul, cogulTr}] döner."""
    cik = []
    for kok, m in sozluk.items():
        if not AR3.match(kok) or not isinstance(m, dict):
            continue
        for ref, h in m.items():
            if not isinstance(h, dict):
                continue
            if not str(ref).isdigit():
                continue                       # joker anahtarlar atlanır
            b = h.get('base')
            if not isinstance(b, dict):
                continue
            ar, tr = b.get('arText'), b.get('trText')
            if not ar or not tr:
                continue
            o = b.get('ornek') or []
            if isinstance(o, dict):
                o = [o]
            o = [x for x in o if isinstance(x, dict) and x.get('ar') and x.get('tr')]
            cik.append({'kok': kok, 'ref': int(ref),
                        'ar': ar.strip(), 'tr': tr.strip(),
                        'emoji': (b.get('emoji') or '').strip(),
                        'ornek': o,
                        'cogul': (b.get('cogul') or '').strip(),
                        'cogulTr': (b.get('cogulTr') or '').strip()})
    cik.sort(key=lambda h: (h['kok'], h['ref']))
    return cik

# --------------------------------------------------------------------------
# 3) Kalıp bilgisi — ad, bâb, tür, zorluk
# --------------------------------------------------------------------------

# Bâb başlangıç numaraları ve harf sayısı grubu. Grup, çeldirici seçiminde
# kullanılır: aynı harf sayısındaki bâblar görsel olarak birbirine benzediği
# için (تَفَعَّلَ ↔ تَفَاعَلَ) en öğretici çeldiriciler oradan gelir.
MEZID_BAS = [52, 58, 64, 71, 77, 83, 88, 94, 100]
BAB_GRUP  = {52: 4, 58: 4, 64: 4, 71: 5, 77: 5, 83: 5, 88: 5, 94: 5, 100: 6}
TUR_SIRA  = ['Mazi', 'Muzari', 'Emir', 'Masdar', 'İsm-i Fâil', 'İsm-i Mef\'ûl']

# Bâb ADLARI tek kaynaktan: veri/veri_vezin_numaralari.js → KALIP_DATA[n].tr
# ("Tef'îl Babı Mazi" → "Tef'îl"). Böylece yarışmadaki ad ile tablodaki ad
# her zaman birebir aynı olur; veride bir ad düzeltilirse ikisi birden düzelir.
BAB_AD = {}          # başlangıç ref → bâb adı   (veriOku sonrası doldurulur)

def babAdlariniKur(KALIP):
    ayir = re.compile(r'^(.*?)\s+Bab[ıi]\s')
    for bas in MEZID_BAS:
        d = KALIP.get(str(bas)) or {}
        m = ayir.match(d.get('tr') or '')
        BAB_AD[bas] = m.group(1).strip() if m else ('Bâb %d' % bas)

def babBas(ref):
    """Mezid kalıp numarası → bâbın başlangıç numarası (yoksa None)."""
    if ref < 52 or ref > 105:
        return None
    if 64 <= ref <= 70: return 64              # Mufâ'ale'nin İKİ mastarı var
    if 83 <= ref <= 87: return 83              # İf'ilâl'in mef'ûlü yok
    for bas in MEZID_BAS:
        if bas in (64, 83):
            continue
        if bas <= ref <= bas + 5:
            return bas
    return None

def babOf(ref):
    """Mezid kalıp numarası → (bâb adı, tür adı). Mücerret ise (None, None)."""
    bas = babBas(ref)
    if bas is None:
        return None, None
    if bas == 64:
        tur = ['Mazi', 'Muzari', 'Emir', 'Masdar', 'Masdar',
               'İsm-i Fâil', 'İsm-i Mef\'ûl'][ref - 64]
    elif bas == 83:
        tur = ['Mazi', 'Muzari', 'Emir', 'Masdar', 'İsm-i Fâil/Mef\'ûl'][ref - 83]
    else:
        tur = TUR_SIRA[ref - bas]
    return BAB_AD.get(bas, 'Bâb %d' % bas), tur

def kalipZorluk(ref):
    """Sınıfta dengeli bir tur çıksın diye: en sık karşılaşılan kalıplar kolay,
       mezidin çekirdek üç türü orta, fâil/mef'ûl/emir zor."""
    if ref in (1, 2, 3, 8, 9, 19, 20, 21, 33, 36):
        return 1                               # her derste geçenler
    if ref <= 51:
        return 2                               # diğer mücerret isim kalıpları
    tur = babOf(ref)[1]
    return 2 if tur in ('Mazi', 'Muzari', 'Masdar') else 3

def temizAd(s):
    """KALIP_DATA.tr etiketini soru metnine uygun kısalt."""
    return re.sub(r'\s+', ' ', (s or '')).strip()

def anlamMetni(s):
    """Şık olarak gösterilecek Türkçe anlam. Kaynak veride bazı anlamlar
       nokta ile bitiyor, bazıları bitmiyor; bu fark şıklar arasında
       'doğru olan hangisi' ipucu veriyordu — noktayı tekdüzeleştiriyoruz."""
    return re.sub(r'\s*\.\s*$', '', re.sub(r'\s+', ' ', (s or '').strip()))


def tahta(kok=None, ref=None, kokVar=None):
    """Tahtadaki (kalıplar tablosu) koordinat. Yarışma motoru bu alanı
       iframe'e postMessage ile geçirir: kök yüklenir, hücre vurgulanır.
       ref bir sayı ya da sayı listesi olabilir; liste ise cevap fazında
       sırayla açılır. kokVar verilirse kök sözlükte yoksa alan eklenmez."""
    t = {}
    if kok:
        if kokVar is not None and kok not in kokVar:
            return None
        t['kok'] = kok
    if ref is not None:
        t['ref'] = ref
    return t or None

# --------------------------------------------------------------------------
# 4) Şık kurma — yinelenen şık ÜRETİLMEZ
# --------------------------------------------------------------------------

def norm(s):
    return unicodedata.normalize('NFKC', HAREKE.sub('', str(s))).strip().lower()

def secenekKur(dogru, celdiriciler, tohum, enAz=3):
    """Doğru + çeldiricileri karıştırır. Yinelenenler (harekesiz karşılaştırma
       ile) elenir. Yeterli şık yoksa None döner — soru üretilmez."""
    gor = {norm(dogru)}
    sec = [dogru]
    for c in celdiriciler:
        n = norm(c)
        if not n or n in gor:
            continue
        gor.add(n)
        sec.append(c)
        if len(sec) >= 5:
            break
    if len(sec) < enAz:
        return None, None
    d = karisik(sec, tohum)
    return d, d.index(dogru)

# --------------------------------------------------------------------------
# 5) Üretim
# --------------------------------------------------------------------------

def uret():
    v = veriOku()
    KALIP = v['kalip'] or {}
    babAdlariniKur(KALIP)          # bâb adları KALIP_DATA'dan gelir
    hep = hucreler(v['sozluk'] or {})

    # dizinler
    slotta = {}          # kalıpNo → [hücre]
    kokte = {}           # kök     → [hücre]
    for h in hep:
        slotta.setdefault(h['ref'], []).append(h)
        kokte.setdefault(h['kok'], []).append(h)

    # kalıp adı ar (yinelenen vezinleri ele — mücerrette فَعِلَ hem 8 hem 14)
    arSayac = {}
    for n, d in KALIP.items():
        arSayac[d['ar']] = arSayac.get(d['ar'], 0) + 1
    def vezinTekMi(ref):
        d = KALIP.get(str(ref))
        return bool(d) and arSayac.get(d['ar'], 0) == 1

    S = []          # üretilen sorular
    def ekle(q): S.append(q)

    # ---- A1 · «kelime» ne demek?  (çeldirici: AYNI KALIPTAN başka kökler)
    aday = [h for h in hep if len(slotta.get(h['ref'], [])) >= 5]
    for i, h in enumerate(karisik(aday, 5101)[:90]):
        celd = [anlamMetni(x['tr']) for x in karisik(slotta[h['ref']], 5200 + i)
                if x['kok'] != h['kok']][:6]
        sec, dg = secenekKur(anlamMetni(h['tr']), celd, 5300 + i, enAz=4)
        if not sec: continue
        ekle({"id": 1000 + i, "tip": "anlam", "zorluk": kalipZorluk(h['ref']),
              "soru": "«%s» ne demek?" % h['ar'], "arapca": h['ar'],
              "secenekler": sec, "dogru": dg,
              "tahta": tahta(h['kok'], h['ref'])})

    # ---- A2 · Türkçesi verilen kelimenin Arapçası
    #      (çeldirici: AYNI KÖKÜN başka kalıpları → doğru kalıbı seçmek gerekir)
    aday = [h for h in hep if len(kokte.get(h['kok'], [])) >= 5]
    for i, h in enumerate(karisik(aday, 5401)[:60]):
        celd = [x['ar'] for x in karisik(kokte[h['kok']], 5500 + i)
                if x['ref'] != h['ref']][:6]
        sec, dg = secenekKur(h['ar'], celd, 5600 + i, enAz=4)
        if not sec: continue
        ekle({"id": 1500 + i, "tip": "anlam",
              "zorluk": min(3, kalipZorluk(h['ref']) + 1),
              "soru": "«%s» — Arapçası hangisidir?" % anlamMetni(h['tr']),
              "secenekler": sec, "dogru": dg, "arSecenek": True,
              "tahta": tahta(h['kok'], h['ref'])})

    # ---- A3 · Emoji ipuçlu anlam (ısınma turu)
    aday = [h for h in hep if h['emoji'] and len(slotta.get(h['ref'], [])) >= 5
            and h['ref'] in (1, 2, 3, 19, 20, 21, 33, 36, 38)]
    for i, h in enumerate(karisik(aday, 5701)[:30]):
        celd = [anlamMetni(x['tr']) for x in karisik(slotta[h['ref']], 5800 + i)
                if x['kok'] != h['kok']][:6]
        sec, dg = secenekKur(anlamMetni(h['tr']), celd, 5900 + i, enAz=4)
        if not sec: continue
        ekle({"id": 1800 + i, "tip": "anlam", "zorluk": 1,
              "soru": "%s  «%s» ne demek?" % (h['emoji'], h['ar']),
              "arapca": h['ar'], "secenekler": sec, "dogru": dg,
              "tahta": tahta(h['kok'], h['ref'])})

    # ---- B1 · Bu kelime hangi kalıptır?  (şıklar: kalıp ADI — tekil)
    #      Çeldirici: komşu kalıp (fâil ↔ mef'ûl) + aynı bâbın diğerleri
    aday = [h for h in hep if 52 <= h['ref'] <= 105]
    for i, h in enumerate(karisik(aday, 6101)[:50]):
        bab, tur = babOf(h['ref'])
        if not bab: continue
        komsu = []
        for d in (1, -1, 2, -2, 3, -3, 4, 5):
            r = h['ref'] + d
            if 52 <= r <= 105 and str(r) in KALIP:
                komsu.append(temizAd(KALIP[str(r)]['tr']))
        sec, dg = secenekKur(temizAd(KALIP[str(h['ref'])]['tr']),
                             komsu, 6200 + i, enAz=4)
        if not sec: continue
        ekle({"id": 2000 + i, "tip": "vezin", "zorluk": 3,
              "soru": "«%s» hangi kalıptır?" % h['ar'], "arapca": h['ar'],
              "secenekler": sec, "dogru": dg,
              "tahta": tahta(h['kok'], h['ref'])})

    # ---- B2 · «kök» kökünün <kalıp adı>'i hangisidir?
    #      Çeldirici: AYNI KÖKÜN başka kalıpları (hepsi doğru kelime, yanlış kalıp)
    #      DİKKAT: bir kökte birden çok "Masdar" etiketli kalıp olabilir
    #      (19 فَعْل, 25 فُعُول …). Aynı etiketi taşıyan hücre çeldirici
    #      olarak kullanılırsa soru İKİ doğru cevaplı olur — eleniyor.
    #      Etiketin yanına vezin de yazılıyor ki soru tek anlamlı olsun.
    aday = [h for h in hep if len(kokte.get(h['kok'], [])) >= 5
            and str(h['ref']) in KALIP]
    for i, h in enumerate(karisik(aday, 6301)[:50]):
        etiket = temizAd(KALIP[str(h['ref'])]['tr'])
        celd = [x['ar'] for x in karisik(kokte[h['kok']], 6400 + i)
                if x['ref'] != h['ref'] and str(x['ref']) in KALIP
                and temizAd(KALIP[str(x['ref'])]['tr']) != etiket][:6]
        sec, dg = secenekKur(h['ar'], celd, 6500 + i, enAz=4)
        if not sec: continue
        ekle({"id": 2300 + i, "tip": "ters-vezin",
              "zorluk": min(3, kalipZorluk(h['ref']) + 1),
              "soru": "«%s» kökünün «%s» (%s) kalıbındaki kelime hangisidir?"
                      % ('-'.join(h['kok']), KALIP[str(h['ref'])]['ar'], etiket),
              "secenekler": sec, "dogru": dg, "arSecenek": True,
              "tahta": tahta(h['kok'], h['ref'])})

    # ---- B3 · Bu kelime hangi bâbdandır?  (yalnız mezid — mücerrette #1 üç bâbın ortağı)
    babAdlari = [BAB_AD[b] for b in MEZID_BAS]
    grupOf = lambda ad: BAB_GRUP[[b for b in MEZID_BAS if BAB_AD[b] == ad][0]]
    aday = [h for h in hep if 52 <= h['ref'] <= 105 and babOf(h['ref'])[0]]
    for i, h in enumerate(karisik(aday, 6601)[:30]):
        bab, _ = babOf(h['ref'])
        ayniGrup = [a for a in babAdlari if a != bab and grupOf(a) == grupOf(bab)]
        digerler = [a for a in babAdlari if a != bab and grupOf(a) != grupOf(bab)]
        celd = karisik(ayniGrup, 6700 + i) + karisik(digerler, 6750 + i)
        sec, dg = secenekKur(bab, celd, 6800 + i, enAz=4)
        if not sec: continue
        ekle({"id": 2600 + i, "tip": "vezin", "zorluk": 3,
              "soru": "«%s» hangi bâbdandır?" % h['ar'], "arapca": h['ar'],
              "secenekler": sec, "dogru": dg,
              "tahta": tahta(h['kok'], h['ref'])})

    # ---- B4 · Bu VEZİN hangi bâbdır?  (kökten bağımsız temel bilgi)
    vezinler = [(r, KALIP[str(r)]['ar']) for r in range(52, 106)
                if str(r) in KALIP and vezinTekMi(r) and babOf(r)[0]]
    for i, (r, ar) in enumerate(karisik(vezinler, 6901)[:20]):
        bab, tur = babOf(r)
        ayniGrup = [a for a in babAdlari if a != bab and grupOf(a) == grupOf(bab)]
        digerler = [a for a in babAdlari if a != bab and grupOf(a) != grupOf(bab)]
        celd = karisik(ayniGrup, 6950 + i) + karisik(digerler, 6970 + i)
        sec, dg = secenekKur(bab, celd, 6990 + i, enAz=4)
        if not sec: continue
        ekle({"id": 2800 + i, "tip": "vezin", "zorluk": 2,
              "soru": "«%s» vezni hangi bâba aittir?  (%s)" % (ar, tur),
              "arapca": ar, "secenekler": sec, "dogru": dg,
              "tahta": tahta(None, r)})

    # ---- B5 · Doğru / Yanlış  (bozma: aynı kökün komşu kalıbının adı)
    #      ref 1 (فَعَلَ) HARİÇ: o mazi 1./2./3. bâbın ORTAK kalıbı, tek doğru
    #      cevabı yok — "doğru" demek öğrenciye yanlış bâbı öğretirdi.
    aday = [h for h in hep if str(h['ref']) in KALIP and h['ref'] != 1
            and len(kokte[h['kok']]) >= 3]
    for i, h in enumerate(karisik(aday, 7101)[:24]):
        dogruMu = (i % 2 == 0)
        if dogruMu:
            iddia = temizAd(KALIP[str(h['ref'])]['tr'])
        else:
            baska = [x for x in karisik(kokte[h['kok']], 7200 + i)
                     if x['ref'] != h['ref'] and str(x['ref']) in KALIP
                     and temizAd(KALIP[str(x['ref'])]['tr'])
                         != temizAd(KALIP[str(h['ref'])]['tr'])]
            if not baska: continue
            iddia = temizAd(KALIP[str(baska[0]['ref'])]['tr'])
        ekle({"id": 3000 + i, "tip": "vezin", "bicim": "dogruyanlis",
              "zorluk": 2,
              "soru": "«%s» → %s. Bu doğru mu?" % (h['ar'], iddia),
              "arapca": h['ar'], "secenekler": ["Doğru", "Yanlış"],
              "dogru": 0 if dogruMu else 1,
              "tahta": tahta(h['kok'], h['ref'])})

    # ---- C1 · Bâb dörtlüsünü sırala (mazi → muzari → emir → mastar)
    dortlu = []
    for kok, hs in kokte.items():
        var = {h['ref']: h for h in hs}
        for bas in MEZID_BAS:
            if bas in (64, 83):          # düzensiz iki bâb (çift mastar / eksik mef'ûl)
                continue
            ad = BAB_AD[bas]
            dizi = [var.get(bas + k) for k in range(4)]
            if all(dizi):
                metin = [x['ar'] for x in dizi]
                if len({norm(m) for m in metin}) == 4:
                    dortlu.append((kok, ad, metin, [bas + k for k in range(4)]))
    dortlu.sort(key=lambda t: (t[0], t[1]))
    for i, (kok, ad, metin, refler) in enumerate(karisik(dortlu, 7301)[:20]):
        ekle({"id": 4000 + i, "tip": "vezin", "bicim": "surukle", "zorluk": 3,
              "soru": "«%s» kökünün %s bâbını sırala: mazi → muzari → emir → mastar"
                      % ('-'.join(kok), ad),
              "parcalar": metin,
              "tahta": tahta(kok, refler)})

    # ---- C2 · Eşleştirme: aynı kökün 4 kalıbı ↔ 4 kalıp adı
    esAday = []
    for kok, hs in kokte.items():
        adli = [h for h in hs if str(h['ref']) in KALIP]
        # kalıp adları farklı olmalı, kelimeler de
        gorAd, gorAr, sec4 = set(), set(), []
        for h in sorted(adli, key=lambda x: x['ref']):
            ad = temizAd(KALIP[str(h['ref'])]['tr'])
            if ad in gorAd or norm(h['ar']) in gorAr:
                continue
            gorAd.add(ad); gorAr.add(norm(h['ar']))
            sec4.append((h['ar'], ad, h['ref']))
        if len(sec4) >= 4:
            esAday.append((kok, sec4))
    esAday.sort(key=lambda t: t[0])
    for i, (kok, sec4) in enumerate(karisik(esAday, 7401)[:16]):
        dort = karisik(sec4, 7500 + i)[:4]
        ekle({"id": 4200 + i, "tip": "vezin", "bicim": "eslestir", "zorluk": 3,
              "soru": "«%s» kökünün kelimelerini kalıplarıyla eşleştir."
                      % '-'.join(kok),
              "ciftler": [[a, b] for a, b, _ in dort],
              "tahta": tahta(kok, [r for _, _, r in dort])})

    # ---- D1 · Örnek cümlede boşluk  (çeldirici: aynı kökün başka çekimleri)
    bosAday = []
    for h in hep:
        if len(kokte.get(h['kok'], [])) < 4:
            continue
        for o in h['ornek']:
            hs = HAREKE.sub('', o['ar'])
            if HAREKE.sub('', h['ar']) in hs and len(o['ar'].split()) >= 2:
                bosAday.append((h, o))
                break
    bosAday.sort(key=lambda t: (t[0]['kok'], t[0]['ref']))
    for i, (h, o) in enumerate(karisik(bosAday, 7601)[:24]):
        # cümledeki kelimeyi ____ ile değiştir (harekesiz eşleşen parçayı bul)
        parcalar = o['ar'].split()
        hedef = HAREKE.sub('', h['ar'])
        yeni, bulundu = [], False
        for p in parcalar:
            if not bulundu and hedef in HAREKE.sub('', p):
                yeni.append('____'); bulundu = True
            else:
                yeni.append(p)
        if not bulundu: continue
        celd = [x['ar'] for x in karisik(kokte[h['kok']], 7700 + i)
                if x['ref'] != h['ref']][:6]
        sec, dg = secenekKur(h['ar'], celd, 7800 + i, enAz=4)
        if not sec: continue
        ekle({"id": 5000 + i, "tip": "bosluk", "bicim": "bosluk", "zorluk": 3,
              "soru": "Boşluğa gelecek kelimeyi seç: «%s»  (%s)"
                      % (' '.join(yeni), o['tr']),
              "secenekler": sec, "dogru": dg, "arSecenek": True,
              "tahta": tahta(h['kok'], h['ref'])})

    # ---- D2 · Örnek cümleyi sırala
    cumAday = []
    for h in hep:
        for o in h['ornek']:
            p = o['ar'].split()
            if 3 <= len(p) <= 5 and len({norm(x) for x in p}) == len(p):
                cumAday.append((h, o, p))
    cumAday.sort(key=lambda t: (t[0]['kok'], t[0]['ref'], t[1]['ar']))
    gorCumle = set()
    secildi = []
    for h, o, p in karisik(cumAday, 7901):
        a = norm(o['ar'])
        if a in gorCumle: continue
        gorCumle.add(a); secildi.append((h, o, p))
        if len(secildi) >= 20: break
    for i, (h, o, p) in enumerate(secildi):
        ekle({"id": 5300 + i, "tip": "cumle", "bicim": "cumlesira", "zorluk": 2,
              "soru": "Kelimeleri sırala: «%s»" % o['tr'], "parcalar": p,
              "tahta": tahta(h['kok'], h['ref'])})

    # ---- D3/D4 · Türkçedeki Arapça alıntılar (kültür köprüsü)
    alintiKok = []
    for r in (v.get('alinti') or []):
        kk = ''.join(r.get('root') or [])
        ws = [w for w in (r.get('words') or [])
              if w.get('arapca') and w.get('turkce')]
        if len(kk) == 3 and len(ws) >= 2:
            alintiKok.append((kk, ws))
    alintiKok.sort(key=lambda t: t[0])

    # D3: bu Türkçe kelimelerin ortak kökü hangisidir?
    for i, (kk, ws) in enumerate(karisik(alintiKok, 8101)[:20]):
        tr = [re.sub(r'\s*[^\w\sÇĞİÖŞÜçğıöşü].*$', '', w['turkce']).strip()
              for w in ws[:4]]
        tr = [t for t in tr if t]
        if len(tr) < 2: continue
        celd = [ '-'.join(k) for k, _ in karisik(alintiKok, 8200 + i)
                 if k != kk ][:6]
        sec, dg = secenekKur('-'.join(kk), celd, 8300 + i, enAz=4)
        if not sec: continue
        ekle({"id": 6000 + i, "tip": "kok", "zorluk": 2,
              "soru": "%s — bu Türkçe kelimelerin ortak Arapça kökü hangisidir?"
                      % ', '.join(tr),
              "secenekler": sec, "dogru": dg, "arSecenek": True,
              "tahta": tahta(kk, None, kokVar=kokte)})

    # D4: Arapça aslı ↔ Türkçedeki hâli eşleştir
    havuz = []
    for kk, ws in alintiKok:
        for w in ws:
            havuz.append((w['arapca'], w['turkce']))
    havuz.sort()
    havuz = karisik(havuz, 8401)
    for i in range(6):
        dort = havuz[i * 4:(i + 1) * 4]
        if len(dort) < 4: break
        if len({norm(a) for a, _ in dort}) < 4: continue
        if len({norm(b) for _, b in dort}) < 4: continue
        ekle({"id": 6200 + i, "tip": "kok", "bicim": "eslestir", "zorluk": 1,
              "soru": "Arapça asıllarını Türkçedeki hâlleriyle eşleştir.",
              "ciftler": [[a, b] for a, b in dort]})

    return S, hep

# --------------------------------------------------------------------------
# 6) Doğrulama — motorun sözleşmesine uymayan soru ÇIKMASIN
# --------------------------------------------------------------------------

def dogrula(S):
    hata, gor = [], set()
    for q in S:
        i = q['id']
        if i in gor: hata.append(('yinelenen id', i))
        gor.add(i)
        b = q.get('bicim', 'test')
        if b in ('test', 'dogruyanlis', 'bosluk'):
            sec = q.get('secenekler') or []
            if len(sec) < 2: hata.append(('az şık', i))
            if len({norm(x) for x in sec}) != len(sec):
                hata.append(('yinelenen şık', i, sec))
            if not (0 <= q.get('dogru', -1) < len(sec)):
                hata.append(('dogru indeksi', i))
        elif b == 'eslestir':
            c = q.get('ciftler') or []
            if len(c) != 4: hata.append(('eşleştirme çift sayısı', i, len(c)))
            if len({norm(x[0]) for x in c}) != len(c) or \
               len({norm(x[1]) for x in c}) != len(c):
                hata.append(('eşleştirmede yinelenen', i))
        elif b in ('surukle', 'cumlesira'):
            p = q.get('parcalar') or []
            if len(p) < 3: hata.append(('az parça', i, len(p)))
            if len({norm(x) for x in p}) != len(p):
                hata.append(('yinelenen parça', i, p))
        if not q.get('soru'): hata.append(('soru metni yok', i))
        if q.get('zorluk') not in (1, 2, 3): hata.append(('zorluk', i))
    return hata

# --------------------------------------------------------------------------
# 7) Dosyayı yaz
# --------------------------------------------------------------------------

BASLIK = """/* ===========================================================================
   KALIPLAR TABLOSU — BİLGİ YARIŞMASI KONUSU        (ÜRETİLMİŞ DOSYA)
   ---------------------------------------------------------------------------
   Üretici : oyunlar/uret_kaliplar.py
   Kaynak  : veri/veri_kokler.js · veri/veri_sozluk.js ·
             veri/veri_vezin_numaralari.js · sarf/kaliplartablosudijital.js
             (kalıplar tablosunun okuduğu veriyle AYNI dosyalar)

   ELLE DÜZENLEME: betik yeniden çalıştırıldığında üzerine yazılır.
   Veri büyüdüğünde:  python3 oyunlar/uret_kaliplar.py
   ve sistem/sinifveri.js'teki BIY_KONU.kaliplar.soru sayısını güncelle.

   Bu dosya bilgiyarismasikacom.js'ten ÖNCE yüklenir; motor açılışta
   window.BIY_EK_KONULAR'ı KONULAR dizisine ekler.
   =========================================================================== */
window.BIY_EK_KONULAR = window.BIY_EK_KONULAR || [];
window.BIY_EK_KONULAR.push({ id: "kaliplar", ad: "Kalıplar Tablosu", pdf: "", sorular: [
"""

SON = """]});
"""

def yaz(S):
    satirlar = []
    for q in S:
        if q.get('tahta') is None:
            q.pop('tahta', None)
        satirlar.append('  ' + json.dumps(q, ensure_ascii=False,
                                          separators=(', ', ': ')))
    io.open(CIKTI, 'w', encoding='utf-8').write(
        BASLIK + ',\n'.join(satirlar) + '\n' + SON)

def main():
    S, hep = uret()
    hata = dogrula(S)
    if hata:
        print('HATA (%d):' % len(hata))
        for h in hata[:20]:
            print('  ', h)
        sys.exit(1)
    yaz(S)
    from collections import Counter
    print('kaliplar konusu → %d soru' % len(S))
    print('  kaynak : %d dolu hücre / %d kök'
          % (len(hep), len({h['kok'] for h in hep})))
    print('  biçim  :', dict(Counter(q.get('bicim', 'test') for q in S)))
    print('  tip    :', dict(Counter(q['tip'] for q in S)))
    print('  zorluk :', dict(sorted(Counter(q['zorluk'] for q in S).items())))
    print('  dosya  :', os.path.relpath(CIKTI, KOK))
    print('  ⚠ sistem/sinifveri.js → BIY_KONU.kaliplar.soru = %d' % len(S))

if __name__ == '__main__':
    main()
