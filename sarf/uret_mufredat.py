# -*- coding: utf-8 -*-
"""sarf/ihkelime.js içindeki MUFREDAT ağacını muhadese.js'ten YENİDEN ÜRETİR.

Neden gerek oldu: ağaç elle yazılmıştı ve 8. sınıf kitabı 6 ünite × 3 derse
çıkınca geride kaldı (dosyada hâlâ 4 ünite × 2 ders yazıyordu), bu yüzden
"8. Sınıf Kelime Listeleri" kartı hiç çıkmadı.

Kaynak  : muhadese/muhadese.js  ->  educationData   (TEK KAYNAK)
`veri`  : muhadese/veri/<id>.js dosyası GERÇEKTEN var mı — diskten bakılır,
          elle işaretlenmez.

Önce yalnız KARŞILAŞTIRIR (--yaz verilmezse hiçbir şey yazmaz).
"""
import io, json, os, re, subprocess, sys

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # site kökü
MUH = os.path.join(KOK, 'muhadese', 'muhadese.js')
IHK = os.path.join(KOK, 'sarf', 'ihkelime.js')
VERI = os.path.join(KOK, 'muhadese', 'veri')

# educationData'yi node ile OKU: elle ayristirmak yorum/virgul tuzaklarina
# takiliyor. muhadese.js document'e dokunuyor, onu sahteleyip durduruyoruz.
KOD = r'''
const fs = require('fs'), vm = require('vm');
const sahteEl = new Proxy({}, { get: () => (() => sahteEl), set: () => true });
const ctx = {
  console,
  document: { getElementById: () => sahteEl, querySelector: () => sahteEl,
              querySelectorAll: () => [], addEventListener: () => {},
              createElement: () => sahteEl, body: sahteEl, head: sahteEl },
  window: {}, localStorage: { getItem: () => null, setItem: () => {} },
  location: { search: '', href: '' }, setTimeout: () => {}, addEventListener: () => {},
  /* muhadese.js tarayici kuresellerine dokunuyor; eksik olani ilk
     satirda patlatip educationData'ya hic ulasamiyorduk. */
  URLSearchParams, URL, fetch: () => Promise.resolve({ json: () => ({}) }),
  navigator: { language: 'tr', userAgent: 'node' },
  Audio: function () { return sahteEl; }, Image: function () { return sahteEl; },
  requestAnimationFrame: () => 0, matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  history: { replaceState: () => {}, pushState: () => {} },
  sessionStorage: { getItem: () => null, setItem: () => {} }
};
ctx.window = ctx;
vm.createContext(ctx);
/* educationData "const" ile tanimli: vm baglaminda GLOBAL NESNEYE
   yazilmaz, sozcuksel kapsamda kalir. Bu yuzden ctx.educationData
   bos donuyordu. Kaynagin SONUNA ifadeyi ekleyip donen degeri
   aliyoruz — ayni kapsamda oldugu icin gorunur. */
let ed = null;
try {
  ed = vm.runInContext(fs.readFileSync(process.argv[1], 'utf8') +
       '\n;(typeof educationData !== "undefined" ? educationData : null)', ctx);
} catch (e) { }
if (!ed) ed = ctx.educationData || (ctx.window && ctx.window.educationData);
if (!ed) { console.error('educationData okunamadi'); process.exit(2); }
process.stdout.write(JSON.stringify(ed));
'''


def egitim_verisi():
    p = subprocess.run(['node', '-e', KOD, MUH], capture_output=True, text=True)
    if p.returncode:
        sys.exit('node: ' + (p.stderr or '')[:400])
    return json.loads(p.stdout)


def agac(ed):
    """educationData -> ihkelime.js'in MUFREDAT bicimi."""
    cikti = {}
    for sinif, uniteler in ed.items():
        bolumler = []
        for u in (uniteler or []):
            dersler = []
            for d in (u.get('lessons') or []):
                m = re.search(r'ders=([0-9_]+)', d.get('simultaneUrl') or '')
                if not m:
                    continue
                did = m.group(1)
                dersler.append({
                    'ad': d.get('name') or did,
                    'id': did,
                    'veri': os.path.exists(os.path.join(VERI, did + '.js')),
                })
            if dersler:
                bolumler.append({'ad': u.get('unitName') or '', 'dersler': dersler})
        if bolumler:
            cikti[sinif] = bolumler
    return cikti


def mevcut_agac():
    s = io.open(IHK, encoding='utf-8').read()
    i = s.index('var MUFREDAT = ')
    j = s.index('{', i)
    d, k = 1, j + 1
    while k < len(s) and d:
        if s[k] == '{':
            d += 1
        elif s[k] == '}':
            d -= 1
        k += 1
    return json.loads(s[j:k]), (i, j, k, s)


def main():
    yeni = agac(egitim_verisi())
    eski, (i, j, k, kaynak) = mevcut_agac()

    print('%-6s %-28s %-28s' % ('sınıf', 'DOSYADA', 'MUHADESE.JS'))
    for sinif in sorted(set(list(eski) + list(yeni)), key=lambda x: int(x)):
        e, y = eski.get(sinif, []), yeni.get(sinif, [])
        def say(a):
            return '%d ünite · %d ders · %d veri' % (
                len(a), sum(len(u['dersler']) for u in a),
                sum(1 for u in a for d in u['dersler'] if d.get('veri')))
        isaret = '  ' if say(e) == say(y) else '≠ '
        print('%s%-4s %-28s %-28s' % (isaret, sinif, say(e), say(y)))

    if '--yaz' not in sys.argv:
        print('\n(yalnız karşılaştırma — yazmak için --yaz)')
        return

    hedef = sys.argv[sys.argv.index('--yaz') + 1] if len(sys.argv) > sys.argv.index('--yaz') + 1 else None
    son = dict(eski)
    if hedef:                      # yalnız verilen sınıf değişsin
        if hedef not in yeni:
            sys.exit('bu sınıf muhadese.js\'te yok: ' + hedef)
        son[hedef] = yeni[hedef]
    else:
        son = yeni

    # Dosyadaki düzen: indent=4 + tüm bloğun 4 boşluk içeri alınması
    # ("5": 8 boşlukta, kapanış süslü 4 boşlukta). Aynen korunuyor ki
    # diff yalnız gerçekten değişen sınıfı göstersin.
    ham = json.dumps(son, ensure_ascii=False, indent=4).split('\n')
    metin = ham[0] + '\n' + '\n'.join('    ' + x for x in ham[1:])
    io.open(IHK, 'w', encoding='utf-8').write(kaynak[:j] + metin + kaynak[k:])
    print('\nyazıldı:', hedef or 'hepsi')


main()
