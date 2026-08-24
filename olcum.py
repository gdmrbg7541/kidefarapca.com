#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VİTRİN SAYAÇ ÖLÇÜMÜ — indeks.html'deki rakamları kaynak koddan hesaplar
=======================================================================

indeks.html'in "etkileşim analizi" bölümündeki sayılar elle yazılıyordu ve
site büyüdükçe eskiyordu. Bu betik hepsini ölçer ve isteğe bağlı olarak
indeks.html içindeki data-hedef / data-yuzde değerlerini YERİNDE günceller.

    python3 olcum.py           → yalnız ölç ve raporla (dosyaya dokunmaz)
    python3 olcum.py --yaz     → ölç ve indeks.html'i güncelle

Ölçüm kuralları indeks.html'deki yorumla AYNIDIR:
  ETKİLEŞİMLİ  : düğme + 2·girdi + sürükleme + dokunma + ses >= 2
                 ya da tıklama dinleyicisi >= 3
                 (kaynak-koruma betiğinin dinleyicileri sayılmaz)
  GÖRSEL DESTEK: svg+canvas+img+video >= 2 ya da @keyframes >= 3
                 ya da transform >= 10
  ÇOK KİŞİLİ   : iki kişilik mod / takım / sunum kumandası / sınıfça
                 uygulama izleri; pay ETKİLEŞİMLİ sayfaya oranlanır

Her HTML sayfası, KENDİ yerel script/css dosyalarıyla birlikte taranır.
İç sayfalar hariç tutulur (vitrinin kendisi, index kabuğu, veri girişi,
yol/süre kontrol) — bunlar öğrenciye görünen içerik sayfası değildir.
"""

import io, json, os, re, subprocess, sys, tempfile

KOK = os.path.dirname(os.path.abspath(__file__))
INDEKS = os.path.join(KOK, 'indeks.html')

# Öğrenciye görünen içerik sayfası olmayanlar
HARIC = {'indeks.html', 'index.html', 'sozluk_veri_giris.html',
         '_yolkontrol.html', 'surekontrol.html'}

ATLA_KLASOR = {'.git', 'node_modules', '_kidef_tmp', '_to_delete', 'functions'}
# Sayfa sayımına girmeyen ek klasörler: dış kaynaktan alınmış kopyalar ve
# tek başına açılmayan yardımcı sayfalar.
ATLA_SAYFA_KLASOR = {'alfabe github', 'flipbooks'}

def oku(yol):
    try:
        return io.open(yol, encoding='utf-8', errors='ignore').read()
    except Exception:
        return ''

# ---------------------------------------------------------------------------
# 1) İÇERİK — sözlük/kök/kalıp verisinden
# ---------------------------------------------------------------------------

DUMPER = r'''
const fs=require('fs'), vm=require('vm');
const ctx={ window:{}, console,
  document:{ getElementById:()=>null, querySelector:()=>null, querySelectorAll:()=>[],
             addEventListener:()=>{}, createElement:()=>({style:{},classList:{add(){},remove(){}},appendChild(){}}) },
  navigator:{userAgent:''}, location:{search:'',href:''},
  setTimeout:()=>0, setInterval:()=>0, localStorage:{getItem:()=>null,setItem:()=>{}} };
ctx.globalThis=ctx; vm.createContext(ctx);
const K=process.argv[2];
function calistir(p){ try{ vm.runInContext(fs.readFileSync(K+'/'+p,'utf8'), ctx, {filename:p}); }catch(e){} }
calistir('veri/veri_kokler.js');
calistir('veri/veri_vezin_numaralari.js');
calistir('veri/veri_sozluk.js');
const al = k => { try { return vm.runInContext(k, ctx); } catch(e){ return null; } };

const S   = al('typeof sozlukVerileri!=="undefined"?sozlukVerileri:null') || {};
const KAL = al('typeof KALIP_DATA!=="undefined"?KALIP_DATA:null') || {};
const KAT = al('typeof kategoriTanimlari!=="undefined"?kategoriTanimlari:null') || {};
const SIG = al('typeof sigaSablonlari!=="undefined"?sigaSablonlari:null') || {};

const AR3 = /^[ء-ي]{3}$/;
/* Fiil kalıpları: mücerret mazi/muzari/emir (1-16) + her mezid bâbın ilk üçü */
const FIIL = new Set();
for (let i=1;i<=16;i++) FIIL.add(i);
[52,58,64,71,77,83,88,94,100].forEach(b=>{ FIIL.add(b); FIIL.add(b+1); FIIL.add(b+2); });

let kok=0, hucre=0, fiil=0, ornek=0, not=0, sozlukKelime=0;
Object.keys(S).forEach(function(k){
  const m = S[k];
  if (!m || typeof m !== 'object') return;
  const kokMu = AR3.test(k);
  if (kokMu) kok++; else { sozlukKelime++; }
  Object.keys(m).forEach(function(ref){
    const h = m[ref];
    if (!h || typeof h !== 'object') return;
    if (h.not) not++;
    const b = h.base;
    if (!b || typeof b !== 'object' || !b.arText) return;
    /* "türetilmiş kelime" YALNIZ 3 harfli köklerden türeyenleri sayar;
       kök olmayan sözlük kayıtları ("İsim: Yumurta" gibi) ayrı sayaçta. */
    if (kokMu) hucre++;
    const n = parseInt(ref,10);
    if (kokMu && FIIL.has(n)) fiil++;
    let o = b.ornek;
    if (o) { if (!Array.isArray(o)) o=[o];
             ornek += o.filter(x=>x&&x.ar&&x.tr).length; }
  });
});

/* Sîga şablonları: bir fiil kalıbından türeyen çekimli biçim sayısı */
let sigaSayi=0;
Object.keys(SIG).forEach(function(t){
  const v=SIG[t];
  sigaSayi += (v && typeof v==='object') ? Object.keys(v).length : 0;
});

process.stdout.write(JSON.stringify({
  kok: kok, hucre: hucre, fiilHucre: fiil, ornek: ornek, not: not,
  sozlukKelime: sozlukKelime,
  kalip: Object.keys(KAL).length,
  kategori: Object.keys(KAT).length,
  siga: sigaSayi
}));
'''

def icerikOlc():
    fd, yol = tempfile.mkstemp(suffix='.js'); os.close(fd)
    io.open(yol, 'w', encoding='utf-8').write(DUMPER)
    try:
        ham = subprocess.check_output(['node', yol, KOK], stderr=subprocess.DEVNULL)
        return json.loads(ham.decode('utf-8'))
    except Exception as e:
        print('  ! içerik ölçülemedi:', e)
        return {}
    finally:
        os.unlink(yol)

# ---------------------------------------------------------------------------
# 2) SAYFALAR — her HTML + kendi yerel js/css'i
# ---------------------------------------------------------------------------

RE_KAYNAK = re.compile(r'(?:src|href)\s*=\s*"([^"]+\.(?:js|css))(?:\?[^"]*)?"', re.I)
# Kaynak-koruma betiğinin dinleyicileri sayılmasın
RE_KORUMA = re.compile(r'<script id="kidef-koruma">.*?</script>', re.S)

def sayfaKaynagi(html_yol):
    """HTML + referans verdiği YEREL js/css dosyalarının birleşik metni."""
    h = oku(html_yol)
    h = RE_KORUMA.sub('', h)
    parcalar = [h]
    klasor = os.path.dirname(html_yol)
    gor = set()
    for m in RE_KAYNAK.finditer(h):
        u = m.group(1)
        if u.startswith('http') or u.startswith('//'):
            continue
        p = os.path.normpath(os.path.join(klasor, u))
        if p in gor or not os.path.isfile(p):
            continue
        gor.add(p)
        parcalar.append(oku(p))
    return '\n'.join(parcalar)

def say(metin, kalip, bayrak=re.I):
    return len(re.findall(kalip, metin, bayrak))

def sayfaOlc(metin):
    dugme   = say(metin, r'<button\b') + say(metin, r'\.biy-btn|class="btn\b')
    girdi   = say(metin, r'<input\b') + say(metin, r'<textarea\b') + say(metin, r'<select\b')
    surukle = say(metin, r'draggable\s*=|dragstart|\bondrop\b|ondragover')
    dokunma = say(metin, r'touchstart|touchmove|touchend')
    ses     = say(metin, r'new Audio\(|<audio\b|playClick|SoundEngine')
    tikla   = say(metin, r'onclick\s*=') + say(metin, r"addEventListener\(\s*['\"]click")

    etkilesim = (1 if dugme else 0) + 2 * (1 if girdi else 0) + \
                (1 if surukle else 0) + (1 if dokunma else 0) + (1 if ses else 0)
    etkilesimli = (etkilesim >= 2) or (tikla >= 3)

    gorsel = say(metin, r'<svg\b') + say(metin, r'<canvas\b') + \
             say(metin, r'<img\b') + say(metin, r'<video\b')
    keyfr  = say(metin, r'@keyframes\b')
    trans  = say(metin, r'\btransform\s*:')
    gorselDestek = (gorsel >= 2) or (keyfr >= 3) or (trans >= 10)

    cok = say(metin, r"data-mode\s*=\s*['\"]2|playerMode\s*[:=]\s*2|\bp2\b|iki ki[şs]ilik|"
                     r"tak[ıi]m|versus|kap[ıi][şs]ma|sunum kumandas|s[ıi]n[ıi]fça|"
                     r"PageDown|ArrowRight.*ArrowLeft")
    cokKisili = cok >= 2

    return etkilesimli, gorselDestek, cokKisili

def sayfalariOlc():
    """Kökteki sayfalar + içerik alt klasörlerindekiler ("Gizem Sandığı",
       "sunum html" gibi). Altyapı klasörleri (functions, node_modules,
       geçici/yedek klasörler) sayılmaz."""
    sayfalar = []
    for kokDizin, klasorler, dosyalar in os.walk(KOK):
        klasorler[:] = [k for k in klasorler
                        if k not in ATLA_KLASOR and k not in ATLA_SAYFA_KLASOR
                        and not k.startswith('.')]
        for ad in sorted(dosyalar):
            if not ad.endswith('.html') or ad in HARIC:
                continue
            sayfalar.append(os.path.join(kokDizin, ad))
    sayfalar.sort()
    top = etk = gor = cok = 0
    for p in sayfalar:
        m = sayfaKaynagi(p)
        e, g, c = sayfaOlc(m)
        top += 1
        if e: etk += 1
        if g: gor += 1
        if c and e: cok += 1        # pay etkileşimli sayfaya oranlanır
    return {'sayfa': top, 'etkilesimli': etk, 'gorsel': gor, 'cokKisili': cok}

# ---------------------------------------------------------------------------
# 3) YAPI — tüm kaynak ağacı
# ---------------------------------------------------------------------------

def yapiOlc():
    etkilesim = svg = anim = satir = 0
    for kokDizin, klasorler, dosyalar in os.walk(KOK):
        klasorler[:] = [k for k in klasorler if k not in ATLA_KLASOR and not k.startswith('.')]
        for d in dosyalar:
            if not d.endswith(('.js', '.css', '.html')):
                continue
            m = oku(os.path.join(kokDizin, d))
            if not m:
                continue
            satir += m.count('\n') + 1
            etkilesim += say(m, r'onclick\s*=') + say(m, r'addEventListener\(')
            svg += say(m, r'<svg\b') + say(m, r'<canvas\b')
            anim += say(m, r'@keyframes\b')
    return {'etkilesim': etkilesim, 'svg': svg, 'anim': anim, 'satir': satir}

# ---------------------------------------------------------------------------
# 4) indeks.html'i güncelle
# ---------------------------------------------------------------------------

def yuzde(pay, payda):
    return int(round(100.0 * pay / payda)) if payda else 0

def hedefYaz(s, etiket, deger):
    """<span data-hedef="X">0</span><span>ETİKET</span> kalıbındaki X'i değiştirir."""
    kal = re.compile(r'(<span data-hedef=")\d+(">0</span></b><span>' + re.escape(etiket) + r'</span>)')
    yeni, n = kal.subn(lambda m: m.group(1) + str(deger) + m.group(2), s)
    return yeni, n

def main():
    yazacak = '--yaz' in sys.argv

    print('İÇERİK ölçülüyor…')
    ic = icerikOlc()
    print('SAYFALAR taranıyor…')
    sy = sayfalariOlc()
    print('YAPI taranıyor…')
    yp = yapiOlc()

    etkYuzde = yuzde(sy['etkilesimli'], sy['sayfa'])
    gorYuzde = yuzde(sy['gorsel'], sy['sayfa'])
    cokYuzde = yuzde(sy['cokKisili'], sy['etkilesimli'])

    print('\n--- SAYFA ---')
    print('  taranan sayfa : %d' % sy['sayfa'])
    print('  etkileşimli   : %d  (%%%d)' % (sy['etkilesimli'], etkYuzde))
    print('  görsel destek : %d  (%%%d)' % (sy['gorsel'], gorYuzde))
    print('  çok kişili    : %d  (%%%d — etkileşimliye oranla)' % (sy['cokKisili'], cokYuzde))

    icerik = [
        ('Arapça kök',        ic.get('kok', 0)),
        ('türetilmiş kelime', ic.get('hucre', 0)),
        # "çekimli fiil" = fiil kalıplarında (mücerret 1-16 ve her mezid
        # bâbın mazi/muzari/emiri) veri girilmiş hücre sayısı. Elle yazılmış
        # eski değer 2655 idi; bu ölçüm onunla örtüşüyor.
        ('çekimli fiil',      ic.get('fiilHucre', 0)),
        ('vezin / kalıp',     ic.get('kalip', 0)),
        ('örnek cümle',       ic.get('ornek', 0)),
        ('sözlük kelimesi',   ic.get('sozlukKelime', 0)),
        ('tematik liste',     ic.get('kategori', 0)),
        ('semantik not',      ic.get('not', 0)),
    ]
    yapi = [
        ('etkileşim noktası', yp['etkilesim']),
        ('svg / tuval çizimi', yp['svg']),
        ('animasyon tanımı',  yp['anim']),
        ('satır kod',         yp['satir']),
    ]

    print('\n--- İÇERİK ---')
    for a, v in icerik: print('  %-20s %s' % (a, v))
    print('\n--- YAPI ---')
    for a, v in yapi:   print('  %-20s %s' % (a, v))

    if not yazacak:
        print('\n(yalnız ölçüm — yazmak için: python3 olcum.py --yaz)')
        return

    s = oku(INDEKS)
    if not s:
        print('\n! indeks.html okunamadı'); sys.exit(1)
    onceki = s
    eksik = []
    for etiket, deger in icerik + yapi:
        s, n = hedefYaz(s, etiket, deger)
        if not n: eksik.append(etiket)

    s = re.sub(r'(id="anzEtk" data-hedef=")\d+(")',    r'\g<1>' + str(etkYuzde) + r'\2', s)
    s = re.sub(r'(id="anzGorsel" data-hedef=")\d+(")', r'\g<1>' + str(gorYuzde) + r'\2', s)
    s = re.sub(r'(id="anzCok" data-hedef=")\d+(")',    r'\g<1>' + str(cokYuzde) + r'\2', s)
    s = re.sub(r'(<div class="anz-c" data-yuzde=")\d+(")',    r'\g<1>' + str(gorYuzde) + r'\2', s)
    s = re.sub(r'(<div class="anz-c c2" data-yuzde=")\d+(")', r'\g<1>' + str(cokYuzde) + r'\2', s)

    # Yorumdaki "Son ölçüm" satırını da tazele
    s = re.sub(r'Son ölçüm: \d+ sayfa · \d+ etkileşimli ·\s*\n\s*\d+ görsel destekli · \d+ çok kişili/sınıfça\.',
               'Son ölçüm: %d sayfa · %d etkileşimli ·\n     %d görsel destekli · %d çok kişili/sınıfça.'
               % (sy['sayfa'], sy['etkilesimli'], sy['gorsel'], sy['cokKisili']), s)

    if eksik:
        print('\n! şu etiketler indeks.html\'de bulunamadı:', ', '.join(eksik))
    if s == onceki:
        print('\nDeğişiklik yok.')
    else:
        io.open(INDEKS, 'w', encoding='utf-8').write(s)
        print('\nindeks.html güncellendi.')

if __name__ == '__main__':
    main()
