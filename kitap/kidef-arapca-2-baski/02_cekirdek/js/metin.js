/* ============================================================
   Kidef Arapça — HTML METİN KATMANI (02.10.2026)
   Sayfaların Türkçe/Latin yazıları resim değil gerçek metin: SVG <text>, PDF'teki konumunda
   ve genişliğinde (textLength). Arka plan görselinde (01_sayfalar/NNN.webp) yalnız çizimler,
   resimler, Arapça yazılar ve simgeler kalır — PDF Arapçayı bazen yanlış harf koduyla
   sakladığı için Arapça bilerek görselde bırakıldı.
   Veri: 03_veri/metin/NNN.js (gerektiğinde yüklenir), liste: 03_veri/metin/liste.js
   Üretici: _araclar/09_metin_katmani.py
   ============================================================ */
(function (k) {
  'use strict';
  /* PDF yazı tipi → serbest benzeri (02_cekirdek/fonts, internet gerekmez) */
  var Y = {
    c: ['Carlito', 400, 'normal'], cl: ['Carlito', 400, 'normal'], cb: ['Carlito', 700, 'normal'],
    ci: ['Carlito', 400, 'italic'], cbi: ['Carlito', 700, 'italic'],
    bio: ["'Exo 2'", 300, 'normal'], bh: ['Caveat', 700, 'normal'], ch: ["'Cabin Sketch'", 400, 'normal'],
    cn: ["'Courier Prime'", 400, 'normal'], cnb: ["'Courier Prime'", 700, 'normal'],
    ar: ['Arial', 400, 'normal'], arb: ['Arial', 700, 'normal'], vd: ['Verdana', 400, 'normal'],
    cm: ['Cambria,Georgia', 400, 'normal'], cmb: ['Cambria,Georgia', 700, 'normal'],
    tn: ["'Times New Roman'", 400, 'normal'], tnb: ["'Times New Roman'", 700, 'normal'],
    nw: ["'Patrick Hand'", 400, 'normal'], hc: ['Cinzel', 400, 'normal']
  };
  function kac(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function renk(c) { return '#' + ('00000' + c.toString(16)).slice(-6); }
  function svg(v) {
    var h = '<svg class="metin-katman" viewBox="0 0 ' + v.W + ' ' + v.H + '" preserveAspectRatio="none" ' +
      'xmlns="http://www.w3.org/2000/svg" aria-hidden="false">';
    for (var i = 0; i < v.t.length; i++) {
      var t = v.t[i], y = Y[t[0]] || Y.c;
      h += '<text x="' + t[3] + '" y="' + t[4] + '" font-size="' + t[1] + '" fill="' + renk(t[2]) +
        '" font-family="' + y[0] + ',sans-serif" font-weight="' + y[1] + '" font-style="' + y[2] + '"' +
        (t[5] > 0 ? ' textLength="' + t[5] + '" lengthAdjust="spacingAndGlyphs"' : '') + '>' + kac(t[6]) + '</text>';
    }
    return h + '</svg>';
  }
  var bekleyen = {};
  function koy(no, yuz) {
    if (yuz.querySelector('.metin-katman')) return;
    var d = document.createElement('div');
    d.innerHTML = svg(k.SAYFA_METIN[no]);
    yuz.insertBefore(d.firstChild, yuz.querySelector('.katman'));
  }
  /* flip.js her sayfa yüzü yüklenince çağırır */
  k.metinKatmani = function (no, yuz) {
    if (!k.METIN_SAYFALARI || k.METIN_SAYFALARI.indexOf(no) < 0) return;
    if (k.SAYFA_METIN && k.SAYFA_METIN[no]) { koy(no, yuz); return; }
    (bekleyen[no] = bekleyen[no] || []).push(yuz);
    if (bekleyen[no].length > 1) return;
    var s = document.createElement('script');
    s.src = '03_veri/metin/' + ('00' + no).slice(-3) + '.js';
    s.onload = function () { (bekleyen[no] || []).forEach(function (y) { koy(no, y); }); delete bekleyen[no]; };
    s.onerror = function () { delete bekleyen[no]; };
    document.head.appendChild(s);
  };
})(window);
