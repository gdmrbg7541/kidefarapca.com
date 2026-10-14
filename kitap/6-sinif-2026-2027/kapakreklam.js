/* ==========================================================================
   KAPAK REKLAMI — kidefarapca.com                        kapakreklam.js
   --------------------------------------------------------------------------
   Kitap kapağı açıkken karşı sayfa boş duruyor (soldan sağa kitapta SOL,
   Arapça/rtl kitapta SAĞ); bu dosya oraya tam sayfa bir
   tanıtım sayfası koyuyor — basılı kitaplardaki iç kapak ilanı gibi.

   NEDEN BÖYLE: sayfa kitabın numaralarına GİRMİYOR. Reklam .kitap kabının
   ilk çocuğu olarak duruyor, yaprakların ALTINDA kalıyor; kapak çevrilince
   1. yaprağın arka yüzü (2. sayfa) üstünü örtüyor. Yani ne toplam sayfa
   değişiyor ne içindekiler ne de karekodlar.

   Telefonda (tek sayfa modu) kitap tek sayfaya göre kaydığı için sol sayfa
   ekran dışında kalır; orada görünmez.

   Bütün flipbooklarda aynı dosya: kitap klasörüne kopyalanıp index.html'de
   uygulama.js'ten SONRA yüklenir.                              14.10.2026
   ========================================================================== */
(function () {
  'use strict';

  var QR = '<svg class="kr-qr" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" class="segno"><path class="qrline" stroke="#16324f" d="M2 2.5h7m1 0h1m1 0h1m2 0h2m3 0h7m-25 1h1m5 0h1m1 0h1m1 0h3m1 0h1m3 0h1m5 0h1m-25 1h1m1 0h3m1 0h1m1 0h1m1 0h7m1 0h1m1 0h3m1 0h1m-25 1h1m1 0h3m1 0h1m2 0h1m1 0h3m4 0h1m1 0h3m1 0h1m-25 1h1m1 0h3m1 0h1m1 0h1m5 0h1m1 0h1m1 0h1m1 0h3m1 0h1m-25 1h1m5 0h1m3 0h3m5 0h1m5 0h1m-25 1h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7m-16 1h2m1 0h2m-14 1h1m2 0h9m3 0h3m2 0h1m1 0h3m-25 1h1m1 0h4m6 0h4m3 0h5m-24 1h2m1 0h1m1 0h3m1 0h2m1 0h2m1 0h1m1 0h1m1 0h1m1 0h1m2 0h1m-25 1h1m1 0h2m1 0h1m1 0h1m3 0h2m2 0h2m1 0h1m1 0h5m-24 1h1m2 0h1m1 0h4m5 0h1m2 0h2m4 0h1m-25 1h1m1 0h2m5 0h2m1 0h5m3 0h1m2 0h1m-24 1h8m1 0h1m5 0h1m1 0h2m1 0h5m-25 1h1m1 0h1m1 0h1m3 0h1m3 0h1m3 0h1m1 0h2m1 0h2m1 0h1m-25 1h1m4 0h2m2 0h5m1 0h6m1 0h2m-16 1h4m1 0h1m2 0h1m3 0h1m1 0h2m-24 1h7m1 0h1m1 0h1m1 0h1m3 0h1m1 0h1m1 0h1m3 0h1m-25 1h1m5 0h1m1 0h1m1 0h2m1 0h1m1 0h2m3 0h1m2 0h1m-24 1h1m1 0h3m1 0h1m1 0h5m1 0h7m2 0h2m-25 1h1m1 0h3m1 0h1m1 0h2m2 0h3m2 0h2m4 0h2m-25 1h1m1 0h3m1 0h1m3 0h3m4 0h1m2 0h5m-25 1h1m5 0h1m2 0h4m1 0h1m3 0h3m1 0h3m-25 1h7m1 0h7m1 0h1m1 0h1m2 0h1m2 0h1"/></svg>';

  var BICIM = [
    '.kr{position:absolute;left:0;top:0;width:50%;height:100%;z-index:0;',
    '    display:flex;flex-direction:column;align-items:center;justify-content:center;',
    '    gap:1.25em;text-align:center;padding:5em 4em;box-sizing:border-box;',
    '    background:linear-gradient(180deg,#FFFFFF 0%,#F6FAFD 100%);',
    "    font-family:'Marhey',Calibri,Carlito,'Segoe UI',system-ui,sans-serif;",
    '    color:#16324F;line-height:1.35;overflow:hidden;}',
    /* Arapça kitaplar sağdan sola (flip.js rtl): yapraklar SOL yarıda durur,
       kapak açıkken boş sayfa SAĞDA kalır — reklam oraya geçer. */
    '.kitap.rtl .kr{left:auto;right:0;}',
    '.kitap.tekli .kr{display:none;}',
    '.kr-ust{font-size:1.05em;letter-spacing:.38em;color:#E3A02A;font-weight:700;}',
    '.kr-ad{font-size:3.9em;line-height:1;font-weight:700;letter-spacing:-.01em;}',
    '.kr-ad b{color:#16A085;font-weight:700;}',
    '.kr-alt{font-size:1.5em;color:#5b7086;margin-top:-.4em;}',
    '.kr-cizgi{width:46%;height:2px;background:#E3A02A;border-radius:2px;}',
    '.kr-liste{display:flex;flex-direction:column;gap:.85em;font-size:1.34em;',
    '    color:#2b4660;text-align:start;max-width:24em;}',
    '.kr-s{display:flex;align-items:flex-start;gap:.7em;}',
    ".kr-s i{font-style:normal;font-family:'Apple Color Emoji','Segoe UI Emoji',",
    "    'Noto Color Emoji',sans-serif;font-size:1.1em;line-height:1.2;}",
    '.kr-kare{display:flex;flex-direction:column;align-items:center;gap:.5em;margin-top:.2em;}',
    '.kr-qr{width:11.5em;height:11.5em;display:block;}',
    '.kr-url{font-size:1.65em;font-weight:700;color:#16A085;letter-spacing:.01em;}',
    '.kr-not{font-size:1.05em;color:#92a3b4;max-width:26em;line-height:1.45;}'
  ].join('\n');

  var SATIR = [
    ['\uD83D\uDCDA', 'Bütün sınıfların dijital ders kitapları'],
    ['\uD83D\uDEE0\uFE0F', 'Sözlük, kalıplar tablosu, sarf ve kelime araçları'],
    ['\uD83C\uDFAF', 'Sunular, oyunlar ve sınıf etkinlikleri'],
    ['\uD83D\uDDA8\uFE0F', 'Çıktılar, planlar ve sınav hazırlığı']
  ];

  function yap(sinif, ic) {
    var e = document.createElement('div');
    e.className = sinif;
    if (ic) e.innerHTML = ic;
    return e;
  }

  function kur() {
    var kitap = document.querySelector('.kitap');
    if (!kitap || kitap.querySelector('.kr')) return !!kitap;

    if (!document.getElementById('krBicim')) {
      var st = document.createElement('style');
      st.id = 'krBicim'; st.textContent = BICIM;
      document.head.appendChild(st);
    }

    var k = yap('kr');
    k.setAttribute('aria-label', 'kidefarapca.com tanıtımı');
    k.appendChild(yap('kr-ust', 'DİJİTAL ARAPÇA'));
    k.appendChild(yap('kr-ad', 'kidefarapca<b>.com</b>'));
    k.appendChild(yap('kr-alt', 'Bu kitabın dijital evi'));
    k.appendChild(yap('kr-cizgi'));
    var l = yap('kr-liste');
    SATIR.forEach(function (s) {
      l.appendChild(yap('kr-s', '<i>' + s[0] + '</i><span>' + s[1] + '</span>'));
    });
    k.appendChild(l);
    var kare = yap('kr-kare', QR);
    kare.appendChild(yap('kr-url', 'kidefarapca.com'));
    k.appendChild(kare);
    k.appendChild(yap('kr-not',
      'Karekodu telefonuna okut. Bu kitabı bilgisayarına indirdiysen '
      + 'sayfalar çevrimdışı açılır; sunular, sözlük ve alıştırmalar için '
      + 'internet gerekir.'));

    kitap.insertBefore(k, kitap.firstChild);

    /* Yazı boyu kitapla birlikte ölçeklenir: 595 birimlik sayfada 1em = 10px */
    function olcek() {
      var en = kitap.clientWidth / 2;
      if (en > 0) k.style.fontSize = (en / 59.5) + 'px';
    }
    olcek();
    if (window.ResizeObserver) new window.ResizeObserver(olcek).observe(kitap);
    else window.addEventListener('resize', olcek);
    return true;
  }

  if (!kur()) {
    var g = new MutationObserver(function () { if (kur()) g.disconnect(); });
    g.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { g.disconnect(); }, 8000);
  }
})();
