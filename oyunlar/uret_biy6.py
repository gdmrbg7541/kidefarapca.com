#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
BİLGİ YARIŞMASI — 6. SINIF KONUSUNU ÜRETİR
==========================================
Kaynak : muhadese/veri/6_1_1 … 6_6_3 (18 ders, 6 ünite) kelime ve cümleleri
Çıktı  : oyunlar/bilgiyarismasikacom.js içindeki  { id: "sinif6", … }  bloğu

Soru id aralıkları — 7. sınıftaki düzenin aynısı:
    1 …  8999  kelime soruları
    9000 … 9999  kelime oyunları (eşleştir / sırala / yaz)
   20000 … 20999 cümle soruları

Betik YİNELENEBİLİR: dosyada zaten bir sinif6 bloğu varsa onu değiştirir.
Ders verisi büyürse yeniden çalıştırılır.
"""
import json, re, io, os, unicodedata

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DERSLER = ['6_1_1','6_1_2','6_1_3','6_2_1','6_2_2','6_2_3',
           '6_3_1','6_3_2','6_3_3','6_4_1','6_4_2','6_4_3',
           '6_5_1','6_5_2','6_5_3','6_6_1','6_6_2','6_6_3']
HEDEF = os.path.join(KOK, 'oyunlar', 'bilgiyarismasikacom.js')

HAREKE = re.compile(r'[ً-ْـٰ]')

# Rastgelelik yok: aynı girdiden hep aynı soru çıksın (yeniden üretilebilirlik).
def karisik(dizi, tohum):
    """Tohuma bağlı, deterministik karıştırma (Fisher-Yates + LCG)."""
    d = list(dizi); s = tohum & 0x7fffffff
    for i in range(len(d) - 1, 0, -1):
        s = (s * 1103515245 + 12345) & 0x7fffffff
        j = s % (i + 1)
        d[i], d[j] = d[j], d[i]
    return d

def veriOku():
    kelimeler, cumleler = [], []
    for d in DERSLER:
        src = io.open(os.path.join(KOK, 'muhadese', 'veri', d + '.js'),
                      encoding='utf-8').read()
        i = src.index('{', src.index('window.data'))
        v = json.loads(src[i:src.rindex('}') + 1])
        unite = int(d.split('_')[1])
        for w in v.get('words', []):
            if w.get('ar') and w.get('tr'):
                kelimeler.append({'ar': w['ar'].strip(), 'tr': w['tr'].strip(), 'u': unite})
        for c in v.get('sentence', []):
            kel = sorted(c['words'], key=lambda x: x['order'])
            ar = ' '.join(x['ar'] for x in kel).strip()
            tr = ' '.join(x['tr'] for x in c['words']).strip()
            if ar and tr:
                cumleler.append({'ar': ar, 'tr': tr, 'u': unite,
                                 'parca': [x['ar'] for x in kel]})
    # yinelenenleri at (aynı Arapça birden çok derste geçebiliyor)
    def tekille(dizi):
        gor, cik = set(), []
        for x in dizi:
            a = HAREKE.sub('', x['ar'])
            if a in gor: continue
            gor.add(a); cik.append(x)
        return cik
    return tekille(kelimeler), tekille(cumleler)

def zorluk(u):
    """Ünite ilerledikçe soru zorlaşır: 1-2 → 1, 3-4 → 2, 5-6 → 3."""
    return 1 if u <= 2 else (2 if u <= 4 else 3)

def celdirici(dogruTr, havuz, tohum, n=4):
    """Aynı sınıfın kelimelerinden, doğru cevaba EŞİT OLMAYAN n çeldirici."""
    aday = [x for x in havuz if x != dogruTr]
    return karisik(aday, tohum)[:n]

def secenekKur(dogru, celdiriciler, tohum):
    """Doğru cevabı da karıştırıp indeksini döner.
       Aynı metin iki şıkta çıkmasın: çeldiriciler tekilleştirilir."""
    temiz, gor = [], {dogru}
    for c in celdiriciler:
        if c in gor: continue
        gor.add(c); temiz.append(c)
    hepsi = karisik([dogru] + temiz, tohum)
    return hepsi, hepsi.index(dogru)

def uret():
    kelimeler, cumleler = veriOku()
    trHavuz = sorted({k['tr'] for k in kelimeler})
    arHavuz = sorted({k['ar'] for k in kelimeler})
    sorular = []

    # ---------------------------------------------------------------
    # 1) KELİME · «X» ne demek?            (id 1…)
    # ---------------------------------------------------------------
    kid = 1
    for i, k in enumerate(karisik(kelimeler, 6001)):
        if kid > 60: break
        sec, dg = secenekKur(k['tr'], celdirici(k['tr'], trHavuz, 7000 + i), 7500 + i)
        sorular.append({"id": kid, "tip": "anlam", "zorluk": zorluk(k['u']),
                        "soru": "«%s» ne demek?" % k['ar'],
                        "secenekler": sec, "dogru": dg, "arapca": k['ar']})
        kid += 1

    # ---------------------------------------------------------------
    # 2) KELİME · Türkçeden Arapçaya        (id 61…)
    # ---------------------------------------------------------------
    for i, k in enumerate(karisik(kelimeler, 6002)):
        if kid > 80: break
        sec, dg = secenekKur(k['ar'], celdirici(k['ar'], arHavuz, 7100 + i), 7600 + i)
        sorular.append({"id": kid, "tip": "anlam", "zorluk": zorluk(k['u']),
                        "soru": "«%s» kelimesinin Arapçası hangisi?" % k['tr'],
                        "secenekler": sec, "dogru": dg, "arSecenek": True})
        kid += 1

    # ---------------------------------------------------------------
    # 3) KELİME OYUNLARI                    (id 9000…)
    # ---------------------------------------------------------------
    oid = 9000
    dizi = karisik(kelimeler, 6003)
    #  a) eşleştirme — dörderli
    for g in range(6):
        d4 = dizi[g * 4:(g + 1) * 4]
        if len(d4) < 4: break
        sorular.append({"id": oid, "tip": "anlam", "bicim": "eslestir",
                        "zorluk": zorluk(max(x['u'] for x in d4)),
                        "soru": "Kelimeleri anlamlarıyla eşleştir.",
                        "ciftler": [[x['ar'], x['tr']] for x in d4]})
        oid += 1
    #  b) doğru / yanlış — yarısı doğru, yarısı yanlış eşleşme
    dy = karisik(kelimeler, 6004)
    for i in range(10):
        k = dy[i]
        dogruMu = (i % 2 == 0)
        gosterilen = k['tr'] if dogruMu else dy[(i + 5) % len(dy)]['tr']
        if not dogruMu and gosterilen == k['tr']:
            gosterilen = dy[(i + 6) % len(dy)]['tr']
        sorular.append({"id": oid, "tip": "anlam", "bicim": "dogruyanlis",
                        "zorluk": zorluk(k['u']),
                        "soru": "Bu kelime «%s» demek. Doğru mu?" % gosterilen,
                        "secenekler": ["Doğru", "Yanlış"],
                        "dogru": 0 if dogruMu else 1, "arapca": k['ar']})
        oid += 1
    #  c) harf sıralama — kısa ve ال'siz kelimelerden
    kisa = [k for k in karisik(kelimeler, 6005)
            if 3 <= len(HAREKE.sub('', k['ar']).replace(' ', '')) <= 6
            and ' ' not in k['ar']]
    for k in kisa[:4]:
        harf = list(HAREKE.sub('', k['ar']))
        sorular.append({"id": oid, "tip": "anlam", "bicim": "surukle",
                        "zorluk": zorluk(k['u']),
                        "soru": "Harfleri sırala: «%s»" % k['tr'],
                        "parcalar": harf})
        oid += 1
    #  d) yazma — klavyede kelimeyi kur
    EK_TUS = list('ابتثجحخدذرزسشصضطظعغفقكلمنهوي')
    for i, k in enumerate(kisa[4:8]):
        cevap = HAREKE.sub('', k['ar'])
        tus = sorted(set(cevap))
        for h in karisik(EK_TUS, 6100 + i):
            if len(tus) >= 10: break
            if h not in tus: tus.append(h)
        sorular.append({"id": oid, "tip": "anlam", "bicim": "yazma", "zorluk": 3,
                        "soru": "«%s» kelimesinin Arapçasını harflerle yaz." % k['tr'],
                        "cevapYazi": cevap, "tuslar": karisik(tus, 6200 + i)})
        oid += 1

    # ---------------------------------------------------------------
    # 4) CÜMLE SORULARI                     (id 20000…)
    # ---------------------------------------------------------------
    cid = 20000
    cTr = sorted({c['tr'] for c in cumleler})
    cAr = sorted({c['ar'] for c in cumleler})
    cd = karisik(cumleler, 6006)

    #  a) Bu cümlenin anlamı nedir?  (4 şık, Türkçe)
    for i, c in enumerate(cd):
        if cid >= 20025: break
        sec, dg = secenekKur(c['tr'], celdirici(c['tr'], cTr, 7200 + i, 3), 7700 + i)
        sorular.append({"id": cid, "tip": "cumle", "zorluk": zorluk(c['u']),
                        "soru": "Bu cümlenin anlamı nedir?",
                        "secenekler": sec, "dogru": dg, "arapca": c['ar']})
        cid += 1
    #  b) Cümlenin Arapçası hangisi?
    for i, c in enumerate(karisik(cumleler, 6007)):
        if cid >= 20037: break
        sec, dg = secenekKur(c['ar'], celdirici(c['ar'], cAr, 7300 + i, 3), 7800 + i)
        sorular.append({"id": cid, "tip": "cumle", "zorluk": zorluk(c['u']),
                        "soru": "«%s» cümlesinin Arapçası hangisi?" % c['tr'],
                        "secenekler": sec, "dogru": dg, "arSecenek": True})
        cid += 1
    #  c) Kelimeleri sırala
    for c in karisik([x for x in cumleler if 3 <= len(x['parca']) <= 5], 6008):
        if cid >= 20049: break
        sorular.append({"id": cid, "tip": "cumle", "bicim": "cumlesira",
                        "zorluk": zorluk(c['u']),
                        "soru": "Kelimeleri sırala: «%s»" % c['tr'],
                        "parcalar": c['parca']})
        cid += 1
    #  d) Boşluk doldurma — cümlenin SON parçası boşaltılır.
    #     Muhâdese verisinde bir "parça" bazen çok kelimelik anlam öbeği
    #     olabiliyor (عَبْدُ اللهِ, مِنَ البَيْتِ ...). Şıkların uzunluğu
    #     eşit olsun (yoksa cevap gözle seçilir) diye hem boşaltılan parça
    #     hem de çeldirici havuzu TEK kelimelik parçalarla sınırlandırıldı.
    def tekKelime(pz):
        return len(pz.split()) == 1
    havuzTumu = sorted({y['parca'][-1] for y in cumleler
                        if tekKelime(y['parca'][-1])})
    for i, c in enumerate(karisik([x for x in cumleler
                                   if len(x['parca']) >= 3
                                   and tekKelime(x['parca'][-1])], 6009)):
        if cid >= 20061: break
        eksik = c['parca'][-1]
        govde = ' '.join(c['parca'][:-1])
        havuz = [y for y in havuzTumu if y != eksik]
        celd = karisik(havuz, 7400 + i)[:3]
        sec, dg = secenekKur(eksik, celd, 7900 + i)
        sorular.append({"id": cid, "tip": "cumle", "bicim": "bosluk",
                        "zorluk": zorluk(c['u']),
                        "soru": "Boşluğa gelecek kelimeyi seç: «%s ____»" % govde,
                        "secenekler": sec, "dogru": dg, "arSecenek": True})
        cid += 1
    #  e) Doğru / yanlış çeviri
    dyc = karisik(cumleler, 6010)
    for i in range(8):
        c = dyc[i]
        dogruMu = (i % 2 == 0)
        gosterilen = c['tr'] if dogruMu else dyc[(i + 4) % len(dyc)]['tr']
        sorular.append({"id": cid, "tip": "cumle", "bicim": "dogruyanlis",
                        "zorluk": zorluk(c['u']),
                        "soru": "«%s» çevirisi doğru mu?" % gosterilen,
                        "secenekler": ["Doğru", "Yanlış"],
                        "dogru": 0 if dogruMu else 1, "arapca": c['ar']})
        cid += 1

    return sorular

# =====================================================================
def yaz(sorular):
    src = io.open(HEDEF, encoding='utf-8').read()
    satirlar = ',\n'.join('    ' + json.dumps(s, ensure_ascii=False)
                          for s in sorular)
    blok = ('  /* 6. SINIF — muhadese/veri/6_1_1…6_6_3 ders verisinden ÜRETİLDİ.\n'
            '     Üretici: oyunlar/uret_biy6.py (ders verisi değişirse yeniden\n'
            '     çalıştırılır). Elle düzenlenirse betik üzerine yazar. */\n'
            '  { id: "sinif6", ad: "6. Sınıf", pdf: "", sorular: [\n'
            + satirlar + '\n  ]},\n')

    imza = '{ id: "sinif6", ad: "6. Sınıf"'
    if imza in src:                      # varsa değiştir (betik yinelenebilir)
        b = src.index('  /* 6. SINIF —')
        s7 = src.index('  { id: "sinif7"')
        src = src[:b] + blok + src[s7:]
    else:                                 # yoksa sinif7'nin ÖNÜNE ekle
        i = src.index('  { id: "sinif7"')
        src = src[:i] + blok + src[i:]
    io.open(HEDEF, 'w', encoding='utf-8').write(src)

s = uret()
yaz(s)
import collections
t = collections.Counter(x.get('tip') for x in s)
b = collections.Counter(x.get('bicim', 'test') for x in s)
z = collections.Counter(x.get('zorluk') for x in s)
print('sinif6 soru: %d' % len(s))
print('  tip   :', dict(t))
print('  biçim :', dict(b))
print('  zorluk:', dict(sorted(z.items())))
