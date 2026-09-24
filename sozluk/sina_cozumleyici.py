# -*- coding: utf-8 -*-
"""ÇÖZÜMLEYİCİ SINAMASI — motorun ürettiğini ELDEN GEÇMİŞ veriyle karşılaştır.

sozluk/veri/sozluk_5|6|7|9|10.js dosyalarındaki çözümler öğretmenin
elinden geçmiş; motor onları ÜRETEBİLİYORSA 8. sınıfta da güvenilir
demektir. Motor bu dosyaları GİRDİ olarak kullanmaz (döngüsel olmasın):
yalnız sitenin sözlük/kök verisinden besleniyor.

Üç sayı basar:
  kök TAM     : aranan yalın biçim birebir aynı
  kök YANLIŞ  : bulundu ama başka biçim  ← asıl tehlike, örnekleri yazılır
  BULAMADI    : motor çözemedi           ← cümle atlanır, veri azalır (zararsız)
"""
import io, json, os, subprocess, sys, collections

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(KOK, 'sozluk'))
import cozumleyici as CZ

NODE = r'''
const fs=require('fs'),vm=require('vm'); const out=[];
for (const f of ['sozluk_5','sozluk_6','sozluk_7','sozluk_9','sozluk_10']) {
  const c={window:{},console}; vm.createContext(c);
  vm.runInContext(fs.readFileSync(process.argv[1]+'/sozluk/veri/'+f+'.js','utf8'),c);
  Object.values(c.window.SOZLUK_SINIF)[0].seviyeler.forEach(lv=>lv.sentences.forEach(s=>{
    s.arabic.forEach(w=>out.push([f, w.text, w.root, w.category]));
  }));
}
process.stdout.write(JSON.stringify(out));
'''


def kurulu():
    p = subprocess.run(['node', '-e', NODE, KOK], capture_output=True, text=True)
    if p.returncode:
        sys.exit('node: ' + p.stderr[:300])
    return json.loads(p.stdout)


def main():
    veri = kurulu()
    # Aynı yüzey biçimi defalarca geçiyor; biçim başına bir kez ölç.
    gor, ornekler = {}, []
    for dosya, metin, kok, kat in veri:
        y = CZ.yalin(metin)
        if y and y not in gor:
            gor[y] = (metin, kok, kat)

    say = collections.Counter()
    yanlis, bulunamadi = [], []
    etiketTam = 0
    for y, (metin, kok, kat) in gor.items():
        c = CZ.coz(metin)
        if not c:
            say['BULAMADI'] += 1
            bulunamadi.append('%s(%s)' % (y, kok))
            continue
        if c[0] == kok:
            say['kök TAM'] += 1
            if c[1] == kat:
                etiketTam += 1
        else:
            say['kök YANLIŞ'] += 1
            yanlis.append('%-14s kurulu=%-12s motor=%-12s | %s || %s' % (y, kok, c[0], kat, c[1]))

    n = len(gor)
    print('sınanan ayrı biçim :', n)
    for a in ('kök TAM', 'kök YANLIŞ', 'BULAMADI'):
        print('  %-12s %4d  (%%%.1f)' % (a, say[a], 100.0 * say[a] / n))
    print('  %-12s %4d  (doğru köklerin %%%.1f\'i)'
          % ('etiket de aynı', etiketTam, 100.0 * etiketTam / max(1, say['kök TAM'])))

    io.open('/tmp/yanlis.txt', 'w', encoding='utf-8').write('\n'.join(yanlis))
    io.open('/tmp/bulunamadi.txt', 'w', encoding='utf-8').write(' '.join(bulunamadi))
    print('\n--- YANLIŞ örnekleri (ilk 30) ---')
    for x in yanlis[:30]:
        print('  ', x)
    print('\n--- BULAMADI örnekleri (ilk 40) ---')
    print('  ', ' '.join(bulunamadi[:40]))


main()
