/* =====================================================================
   KİTAP ETKİNLİKLERİ — motor                                 18.10.2026
   Öğretmen: "ebaya yönlendiren kısımlarda mümkün olduğunca o kısmın cevap
   anahtarını oluşturan etkinlikler hazırla" · "mümkün olduğunca ebaya
   gitmesin öğretmen".
   Kitaptaki her "نشاط N" karekodu bir alıştırmanın etkileşimli sürümüne
   gidiyordu (EBA). Bu sayfa aynı alıştırmayı sitenin içinde oynatır;
   cevaplar resmî cevap anahtarından (yoksa kitap sayfasından).
   etkinlik/index.html?n=19  →  veri/19.js (window.ETK_VERI) + resim/19-r3.webp
   etkinlik/index.html       →  bütün etkinliklerin listesi (veri/liste.js)
   Türler: eslestir · secmeli · dogruyanlis · bosluk · siralama · tablo ·
   cumle-kur · acik. Hepsi dokun-seç (sürükleme yok): tahtada parmakla,
   telefonda da çalışır. Karıştırma tohumlu (her cihazda aynı sıra:
   tahta yansıtmada iki ekran aynı görünür).
   ===================================================================== */
(function () {
  'use strict';
  var KOK = document.getElementById('etk');
  var Q = {};
  location.search.replace(/^\?/, '').split('&').forEach(function (p) {
    var a = p.split('=');
    if (a[0]) { try { Q[decodeURIComponent(a[0])] = decodeURIComponent(a[1] || ''); } catch (e) { } }
  });
  var NO = parseInt(Q.n, 10) || 0;
  var SURUM = (function () {
    var s = document.querySelector('script[src*="etkinlik.js"]');
    var m = s && /[?&]v=([^&#]+)/.exec(s.getAttribute('src') || '');
    return m ? m[1] : '';
  })();
  var RAKAM = '٠١٢٣٤٥٦٧٨٩';
  var RENK = ['#1D5FD1', '#C2410C', '#7C3AED', '#0F766E', '#B91C1C', '#A16207', '#0369A1', '#BE185D', '#15803D', '#4D7C0F', '#9333EA', '#0E7490'];
  var KAYNAK_AD = { cevap: 'Cevaplar: MEB cevap anahtarı', sayfa: 'Cevaplar: kitap sayfası', ogretmen: 'Örnek çözüm' };

  function ar(n) { return String(n).replace(/\d/g, function (d) { return RAKAM.charAt(+d); }); }
  function nn(n) { return (n < 10 ? '0' : '') + n; }
  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  /* "___" → boşluk çizgisi (seçmelide seçilen kelime içine yazılır) */
  function yazi(t) { return esc(t).replace(/___/g, '<span class="bosluk-i">&nbsp;</span>'); }
  function $(s, k) { return (k || document).querySelector(s); }
  function $$(s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); }

  /* tohumlu üreteç (mulberry32) ve karıştırma: n>1 iken hiç bir öğe yerinde kalmasın diye denenir */
  function uretec(t) {
    var a = t >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var x = Math.imul(a ^ (a >>> 15), 1 | a);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }
  function karistir(n, tohum) {
    var r = uretec(tohum), en = null, enSabit = 1e9;
    for (var deneme = 0; deneme < 40; deneme++) {
      var p = [], i;
      for (i = 0; i < n; i++) p.push(i);
      for (i = n - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = p[i]; p[i] = p[j]; p[j] = t; }
      var sabit = 0;
      for (i = 0; i < n; i++) if (p[i] === i) sabit++;
      if (sabit < enSabit) { en = p; enSabit = sabit; }
      if (sabit === 0 || n < 2) break;
    }
    return en || [];
  }

  function hata(m) {
    KOK.innerHTML = '<div class="hata-kutu"><p><b>' + esc(m) + '</b></p><p><a href="index.html">Bütün etkinlikler</a></p></div>';
  }

  /* ------------------------------------------------------------------ */
  var D = null, IS = null, KILIT = false;
  function resim(id) { return 'resim/' + nn(D.no) + '-' + id + '.webp'; }
  function hucreIc(h) {
    var s = '';
    if (h && h.r) s += '<img src="' + resim(h.r) + '" alt="" decoding="async">';
    if (h && h.m) s += '<span>' + yazi(h.m) + '</span>';
    return s;
  }
  function hucre(h, ek) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'hucre' + (h && h.r ? ' resimli' : '') + (ek ? ' ' + ek : '');
    b.innerHTML = hucreIc(h);
    if (h && h.m) b.setAttribute('lang', 'ar');
    return b;
  }
  function rozet(b, metin, renk) {
    var r = $('.rozet', b);
    if (metin == null) { if (r) r.remove(); return; }
    if (!r) { r = document.createElement('span'); r.className = 'rozet'; b.appendChild(r); }
    r.textContent = metin;
    r.style.background = renk || '#1D5FD1';
  }
  function isaretSil() {
    $$('.dogru, .yanlis, .bos', KOK).forEach(function (x) { x.classList.remove('dogru', 'yanlis', 'bos'); });
    sonuc('');
  }
  function degisti() { if (!KILIT && $('.sonuc').textContent) isaretSil(); }
  function isaret(x, d) { if (x) x.classList.add(d === true ? 'dogru' : d === false ? 'yanlis' : 'bos'); }
  function sonuc(m, sinif) {
    var s = $('.sonuc');
    s.textContent = m;
    s.className = 'sonuc' + (sinif ? ' ' + sinif : '');
  }

  /* ------------------------------ eşleştir ------------------------------ */
  function eslestir(G) {
    var A = D.a, B = D.b, cift = {}, secA = null, secB = null;
    var sira = karistir(B.length, D.no * 131 + 17);
    var kap = document.createElement('div');
    kap.className = 'esl';
    var sa = document.createElement('div'), sb = document.createElement('div');
    sa.className = 'esl-sutun' + (A.every(function (h) { return h.r && !h.m; }) ? ' resimli' : '');
    sb.className = 'esl-sutun' + (B.every(function (h) { return h.r && !h.m; }) ? ' resimli' : '');
    kap.appendChild(sa); kap.appendChild(sb); G.appendChild(kap);
    var hA = A.map(function (h, i) { var b = hucre(h); b.dataset.i = i; sa.appendChild(b); return b; });
    var hB = [];
    sira.forEach(function (j) { var b = hucre(B[j]); b.dataset.j = j; sb.appendChild(b); hB[j] = b; });
    function bAnahtar(j) { for (var i in cift) if (cift[i] === j) return +i; return null; }
    function ciz() {
      hA.forEach(function (b, i) {
        b.classList.toggle('secili', secA === i);
        rozet(b, ar(i + 1), cift[i] != null ? RENK[i % RENK.length] : '#7A8B99');
      });
      hB.forEach(function (b, j) {
        var i = bAnahtar(j);
        b.classList.toggle('secili', secB === j);
        rozet(b, i == null ? null : ar(i + 1), i == null ? null : RENK[i % RENK.length]);
      });
    }
    function bagla(i, j) {
      var eski = bAnahtar(j);
      if (eski != null) delete cift[eski];
      cift[i] = j; secA = secB = null; degisti(); ciz();
    }
    hA.forEach(function (b, i) {
      b.addEventListener('click', function () {
        if (KILIT) return;
        if (cift[i] != null && secB == null) { delete cift[i]; secA = i; degisti(); ciz(); return; }
        if (secB != null) { bagla(i, secB); return; }
        secA = secA === i ? null : i; ciz();
      });
    });
    hB.forEach(function (b, j) {
      b.addEventListener('click', function () {
        if (KILIT) return;
        if (secA != null) { bagla(secA, j); return; }
        var i = bAnahtar(j);
        if (i != null) { delete cift[i]; secA = i; secB = null; degisti(); ciz(); return; }
        secB = secB === j ? null : j; ciz();
      });
    });
    ciz();
    return {
      kontrol: function () {
        var s = { d: 0, y: 0, b: 0, t: A.length };
        A.forEach(function (h, i) {
          if (cift[i] == null) { s.b++; isaret(hA[i], null); return; }
          var ok = cift[i] === D.dogru[i];
          s[ok ? 'd' : 'y']++; isaret(hA[i], ok); isaret(hB[cift[i]], ok);
        });
        return s;
      },
      goster: function () { cift = {}; D.dogru.forEach(function (j, i) { cift[i] = j; }); secA = secB = null; ciz(); hA.forEach(function (b, i) { isaret(b, true); isaret(hB[D.dogru[i]], true); }); },
      sifirla: function () { cift = {}; secA = secB = null; ciz(); }
    };
  }

  /* ------------------------------ seçmeli ------------------------------ */
  function maddeKutu(G, i, h) {
    var m = document.createElement('div');
    m.className = 'madde';
    m.innerHTML = '<span class="mno">' + ar(i + 1) + '</span><div class="mic"></div>';
    if (h && (h.m || h.r)) {
      var s = document.createElement('div');
      s.className = 'soru';
      s.setAttribute('lang', 'ar');
      s.innerHTML = (h.r ? '<img src="' + resim(h.r) + '" alt="">' : '') + (h.m ? yazi(h.m) : '');
      $('.mic', m).appendChild(s);
    }
    G.appendChild(m);
    return m;
  }
  function secmeli(G) {
    var M = D.maddeler, sec = [], H = [];
    M.forEach(function (x, i) {
      var m = maddeKutu(G, i, x);
      var sk = document.createElement('div');
      var metinli = x.secenekler.every(function (h) { return h.m && !h.r; });
      sk.className = 'secenekler' + (metinli ? ' metinli' : '');
      sk.setAttribute('dir', 'rtl');
      H[i] = x.secenekler.map(function (h, j) {
        var b = hucre(h);
        b.addEventListener('click', function () {
          if (KILIT) return;
          sec[i] = sec[i] === j ? null : j; degisti(); ciz(i);
        });
        sk.appendChild(b);
        return b;
      });
      $('.mic', m).appendChild(sk);
    });
    function ciz(i) {
      H[i].forEach(function (b, j) { b.classList.toggle('secili', sec[i] === j); b.setAttribute('aria-pressed', sec[i] === j ? 'true' : 'false'); });
      var bo = $$('.bosluk-i', H[i][0].parentNode.parentNode)[0], x = M[i];
      if (bo) bo.innerHTML = sec[i] != null && x.secenekler[sec[i]].m && !x.secenekler[sec[i]].r ? esc(x.secenekler[sec[i]].m) : '&nbsp;';
    }
    return {
      kontrol: function () {
        var s = { d: 0, y: 0, b: 0, t: M.length };
        M.forEach(function (x, i) {
          if (sec[i] == null) { s.b++; H[i].forEach(function (b) { isaret(b, null); }); return; }
          var ok = sec[i] === x.dogru;
          s[ok ? 'd' : 'y']++; isaret(H[i][sec[i]], ok);
        });
        return s;
      },
      goster: function () { M.forEach(function (x, i) { sec[i] = x.dogru; ciz(i); isaret(H[i][x.dogru], true); }); },
      sifirla: function () { M.forEach(function (x, i) { sec[i] = null; ciz(i); }); }
    };
  }

  /* ---------------------------- doğru / yanlış ---------------------------- */
  function dogruyanlis(G) {
    var M = D.maddeler, sec = [], H = [];
    M.forEach(function (x, i) {
      var m = maddeKutu(G, i, x);
      m.classList.add('dyl');
      var k = document.createElement('div');
      k.className = 'dy';
      var bd = hucre(null, 'd'), by = hucre(null, 'y');
      bd.textContent = '✓'; by.textContent = '✗';
      bd.setAttribute('aria-label', 'Doğru'); by.setAttribute('aria-label', 'Yanlış');
      [[bd, true], [by, false]].forEach(function (p) {
        p[0].addEventListener('click', function () {
          if (KILIT) return;
          sec[i] = sec[i] === p[1] ? null : p[1]; degisti(); ciz(i);
        });
      });
      k.appendChild(bd); k.appendChild(by);
      m.appendChild(k);
      H[i] = [bd, by];
    });
    function ciz(i) { H[i][0].classList.toggle('secili', sec[i] === true); H[i][1].classList.toggle('secili', sec[i] === false); }
    return {
      kontrol: function () {
        var s = { d: 0, y: 0, b: 0, t: M.length };
        M.forEach(function (x, i) {
          if (sec[i] == null) { s.b++; isaret(H[i][0], null); isaret(H[i][1], null); return; }
          var ok = sec[i] === x.dogru;
          s[ok ? 'd' : 'y']++; isaret(H[i][sec[i] ? 0 : 1], ok);
        });
        return s;
      },
      goster: function () { M.forEach(function (x, i) { sec[i] = x.dogru; ciz(i); isaret(H[i][x.dogru ? 0 : 1], true); }); },
      sifirla: function () { M.forEach(function (x, i) { sec[i] = null; ciz(i); }); }
    };
  }

  /* ------------------------------ boşluk ------------------------------ */
  function bosluk(G) {
    var M = D.maddeler, W = D.kelimeler, dol = [], Y = [], secK = null, etkin = null;
    var banka = document.createElement('div');
    banka.className = 'banka';
    banka.setAttribute('lang', 'ar');
    var KB = karistir(W.length, D.no * 71 + 3).map(function (j) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'kelime'; b.textContent = W[j];
      b.addEventListener('click', function () {
        if (KILIT) return;
        if (etkin) { koy(etkin[0], etkin[1], W[j]); return; }
        secK = secK === W[j] ? null : W[j]; ciz();
      });
      banka.appendChild(b);
      return { b: b, w: W[j] };
    });
    G.appendChild(banka);
    M.forEach(function (x, i) {
      var m = maddeKutu(G, i, x.r ? { r: x.r } : null);
      var p = document.createElement('div');
      p.className = 'bsatir';
      p.setAttribute('lang', 'ar');
      var parca = String(x.m).split('___');
      dol[i] = []; Y[i] = [];
      parca.forEach(function (t, k) {
        p.appendChild(document.createTextNode(t));
        if (k < parca.length - 1) {
          var y = document.createElement('button');
          y.type = 'button'; y.className = 'yuva'; y.innerHTML = '&nbsp;';
          y.setAttribute('aria-label', 'Boşluk ' + (k + 1));
          y.addEventListener('click', function () {
            if (KILIT) return;
            if (secK) { koy(i, k, secK); secK = null; ciz(); return; }
            if (dol[i][k]) { dol[i][k] = null; degisti(); }
            etkin = [i, k];                          /* boş yuva hep etkin kalır (kelimeye dokununca dolar) */
            ciz();
          });
          p.appendChild(y);
          Y[i][k] = y; dol[i][k] = null;
        }
      });
      $('.mic', m).appendChild(p);
    });
    function sonrakiBos(i, k) {
      for (var a = i; a < M.length; a++) for (var b = (a === i ? k + 1 : 0); b < Y[a].length; b++) if (!dol[a][b]) return [a, b];
      return null;
    }
    function koy(i, k, w) { dol[i][k] = w; etkin = sonrakiBos(i, k); degisti(); ciz(); }
    function ciz() {
      Y.forEach(function (L, i) {
        L.forEach(function (y, k) {
          y.innerHTML = dol[i][k] ? esc(dol[i][k]) : '&nbsp;';
          y.classList.toggle('dolu', !!dol[i][k]);
          y.classList.toggle('etkin', !!(etkin && etkin[0] === i && etkin[1] === k));
        });
      });
      KB.forEach(function (o) { o.b.classList.toggle('secili', secK === o.w); });
    }
    return {
      kontrol: function () {
        var s = { d: 0, y: 0, b: 0, t: 0 };
        M.forEach(function (x, i) {
          x.cevap.forEach(function (c, k) {
            s.t++;
            if (!dol[i][k]) { s.b++; isaret(Y[i][k], null); return; }
            var ok = dol[i][k] === c;
            s[ok ? 'd' : 'y']++; isaret(Y[i][k], ok);
          });
        });
        etkin = null; ciz();
        return s;
      },
      goster: function () { M.forEach(function (x, i) { x.cevap.forEach(function (c, k) { dol[i][k] = c; isaret(Y[i][k], true); }); }); etkin = null; secK = null; ciz(); },
      sifirla: function () { M.forEach(function (x, i) { x.cevap.forEach(function (c, k) { dol[i][k] = null; }); }); etkin = null; secK = null; ciz(); }
    };
  }

  /* ------------------------------ sıralama ------------------------------ */
  function siralama(G) {
    var M = D.maddeler, sira = [], n = M.length;
    var L = document.createElement('div');
    L.className = 'sira-liste' + (M.every(function (x) { return x.r && !x.m; }) ? ' resimli' : '');
    G.appendChild(L);
    var H = M.map(function (x, i) {
      var b = hucre(x);
      b.addEventListener('click', function () {
        if (KILIT) return;
        if (sira[i] != null) sira[i] = null;
        else { for (var k = 1; k <= n; k++) if (sira.indexOf(k) < 0) { sira[i] = k; break; } }
        degisti(); ciz();
      });
      L.appendChild(b);
      return b;
    });
    function ciz() { H.forEach(function (b, i) { rozet(b, sira[i] != null ? ar(sira[i]) : '·', sira[i] != null ? '#1D5FD1' : '#A7B4BF'); }); }
    ciz();
    return {
      kontrol: function () {
        var s = { d: 0, y: 0, b: 0, t: n };
        M.forEach(function (x, i) {
          if (sira[i] == null) { s.b++; isaret(H[i], null); return; }
          var ok = sira[i] === x.sira;
          s[ok ? 'd' : 'y']++; isaret(H[i], ok);
        });
        return s;
      },
      goster: function () { M.forEach(function (x, i) { sira[i] = x.sira; isaret(H[i], true); }); ciz(); },
      sifirla: function () { sira = []; ciz(); }
    };
  }

  /* ------------------------------ tablo ------------------------------ */
  function tablo(G) {
    var S = D.sutunlar, R = D.satirlar, sec = [], H = [];
    var k = document.createElement('div');
    k.className = 'tablo-kap';
    var t = document.createElement('table');
    t.className = 'tablo';
    var bas = '<thead><tr><th aria-hidden="true"></th>' + S.map(function (h) { return '<th lang="ar">' + hucreIc(h) + '</th>'; }).join('') + '</tr></thead><tbody></tbody>';
    t.innerHTML = bas;
    R.forEach(function (x, i) {
      var tr = document.createElement('tr');
      var ad = document.createElement('td');
      ad.className = 'ad'; ad.setAttribute('lang', 'ar'); ad.innerHTML = hucreIc(x);
      tr.appendChild(ad);
      H[i] = S.map(function (h, j) {
        var td = document.createElement('td');
        var b = hucre(null);
        b.setAttribute('aria-label', 'Satır ' + (i + 1) + ', sütun ' + (j + 1));
        b.addEventListener('click', function () {
          if (KILIT) return;
          sec[i] = sec[i] === j ? null : j; degisti(); ciz(i);
        });
        td.appendChild(b); tr.appendChild(td);
        return b;
      });
      $('tbody', t).appendChild(tr);
    });
    k.appendChild(t); G.appendChild(k);
    function ciz(i) { H[i].forEach(function (b, j) { b.classList.toggle('secili', sec[i] === j); b.textContent = sec[i] === j ? '✓' : ''; }); }
    return {
      kontrol: function () {
        var s = { d: 0, y: 0, b: 0, t: R.length };
        R.forEach(function (x, i) {
          if (sec[i] == null) { s.b++; H[i].forEach(function (b) { isaret(b, null); }); return; }
          var ok = sec[i] === x.dogru;
          s[ok ? 'd' : 'y']++; isaret(H[i][sec[i]], ok);
        });
        return s;
      },
      goster: function () { R.forEach(function (x, i) { sec[i] = x.dogru; ciz(i); isaret(H[i][x.dogru], true); }); },
      sifirla: function () { R.forEach(function (x, i) { sec[i] = null; ciz(i); }); }
    };
  }

  /* ------------------------------ cümle kur ------------------------------ */
  function etiketler(h) { return h && h.c != null ? (Array.isArray(h.c) ? h.c.slice() : [h.c]) : null; }
  function gecerli(secim) {
    var kume = null;
    for (var s = 0; s < D.sutunlar.length; s++) {
      var c = D.sutunlar[s];
      if (!c.secenekler) continue;
      var e = etiketler(c.secenekler[secim[s]]);
      if (!e) continue;
      kume = kume ? kume.filter(function (x) { return e.indexOf(x) >= 0; }) : e;
      if (!kume.length) return false;
    }
    return true;
  }
  function cumleMetni(secim) {
    var out = '';
    D.sutunlar.forEach(function (c, s) {
      var p = c.secenekler ? (secim[s] != null ? c.secenekler[secim[s]].m : '…') : c.sabit;
      if (!p) return;
      if (out && !/^[،,.؟!:]/.test(p)) out += ' ';
      out += p;
    });
    if (out && !/[.؟!…]$/.test(out)) out += '.';
    return out;
  }
  function cumleKur(G) {
    var S = D.sutunlar, secim = {}, liste = [], sec = [];
    var kap = document.createElement('div');
    kap.className = 'ck-sutunlar';
    S.forEach(function (c, s) {
      if (!c.secenekler) {
        var f = document.createElement('div');
        f.className = 'ck-sabit'; f.setAttribute('lang', 'ar'); f.textContent = c.sabit;
        kap.appendChild(f); return;
      }
      var k = document.createElement('div');
      k.className = 'ck-sutun';
      sec[s] = c.secenekler.map(function (h, j) {
        var b = hucre({ m: h.m });
        b.addEventListener('click', function () {
          if (KILIT) return;
          secim[s] = secim[s] === j ? undefined : j; ciz();
        });
        k.appendChild(b);
        return b;
      });
      kap.appendChild(k);
    });
    G.appendChild(kap);
    var on = document.createElement('div');
    on.className = 'ck-onizle';
    on.innerHTML = '<span class="cumle" lang="ar"></span><button type="button" class="tus" id="ckEkle">Cümleyi ekle</button>';
    G.appendChild(on);
    var say = document.createElement('div');
    say.className = 'ck-say';
    G.appendChild(say);
    var L = document.createElement('div');
    L.className = 'ck-liste';
    G.appendChild(L);
    function tamam() { return S.every(function (c, s) { return !c.secenekler || secim[s] != null; }); }
    function ciz() {
      S.forEach(function (c, s) { if (sec[s]) sec[s].forEach(function (b, j) { b.classList.toggle('secili', secim[s] === j); }); });
      $('.cumle', on).textContent = cumleMetni(secim);
      $('#ckEkle').disabled = KILIT || !tamam();
      say.textContent = 'Kurulan cümle: ' + liste.length + ' / ' + D.adet;
    }
    function listeCiz(goster) {
      L.innerHTML = '';
      (goster || liste).forEach(function (o, i) {
        var r = document.createElement('div');
        r.className = 'ck-cumle' + (goster ? ' ornek-c' : '');
        r.innerHTML = '<span class="cumle" lang="ar"></span>' + (goster ? '' : '<button type="button" class="ck-sil" aria-label="Sil">×</button>');
        $('.cumle', r).textContent = cumleMetni(o.secim);
        if (!goster) {
          $('.ck-sil', r).addEventListener('click', function () { if (KILIT) return; liste.splice(i, 1); degisti(); listeCiz(); ciz(); });
          o.el = r;
        }
        L.appendChild(r);
      });
    }
    $('#ckEkle').addEventListener('click', function () {
      if (KILIT || !tamam()) return;
      var kopya = {};
      for (var k in secim) if (secim[k] != null) kopya[k] = secim[k];
      var m = cumleMetni(kopya);
      if (liste.some(function (o) { return cumleMetni(o.secim) === m; })) { sonuc('Bu cümleyi zaten kurdun.', 'orta'); return; }
      liste.push({ secim: kopya });
      secim = {}; degisti(); listeCiz(); ciz();
    });
    function ornekler(adet) {
      var r = uretec(D.no * 977 + 5), out = [], gor = {};
      for (var deneme = 0; deneme < 4000 && out.length < adet; deneme++) {
        var s = {};
        S.forEach(function (c, i) { if (c.secenekler) s[i] = Math.floor(r() * c.secenekler.length); });
        var m = cumleMetni(s);
        if (gor[m] || !gecerli(s)) continue;
        gor[m] = 1; out.push({ secim: s });
      }
      return out;
    }
    ciz();
    return {
      kontrol: function () {
        var s = { d: 0, y: 0, b: 0, t: D.adet, cumle: true };
        liste.forEach(function (o) { var ok = gecerli(o.secim); o.el.classList.add(ok ? 'dogru' : 'yanlis'); s[ok ? 'd' : 'y']++; });
        s.b = Math.max(0, D.adet - liste.length);
        return s;
      },
      goster: function () { secim = {}; listeCiz(ornekler(D.adet)); ciz(); say.textContent = 'Doğru cümle örnekleri:'; },
      sifirla: function () { secim = {}; liste = []; listeCiz(); ciz(); }
    };
  }

  /* ------------------------------ açık uçlu ------------------------------ */
  function acik(G) {
    var M = D.maddeler, C = [];
    M.forEach(function (x, i) {
      var m = maddeKutu(G, i, x);
      var c = document.createElement('div');
      c.className = 'acik-cevap gizli'; c.setAttribute('lang', 'ar'); c.textContent = x.ornek;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'goster'; b.textContent = 'Örnek cevabı göster';
      b.addEventListener('click', function () { var g = c.classList.toggle('gizli'); b.textContent = g ? 'Örnek cevabı göster' : 'Örnek cevabı gizle'; });
      $('.mic', m).appendChild(b); $('.mic', m).appendChild(c);
      C.push([c, b]);
    });
    return {
      acik: true,
      goster: function (g) { C.forEach(function (p) { p[0].classList.toggle('gizli', !g); p[1].textContent = g ? 'Örnek cevabı gizle' : 'Örnek cevabı göster'; }); },
      sifirla: function () { C.forEach(function (p) { p[0].classList.add('gizli'); p[1].textContent = 'Örnek cevabı göster'; }); }
    };
  }

  var TUR = { eslestir: eslestir, secmeli: secmeli, dogruyanlis: dogruyanlis, bosluk: bosluk, siralama: siralama, tablo: tablo, 'cumle-kur': cumleKur, acik: acik };

  /* ------------------------------ kurulum ------------------------------ */
  function kur(veri) {
    D = veri;
    document.title = 'Etkinlik ' + D.no + ' · ' + D.baslik_tr + ' — Arapça 8';
    var h = '<header class="ust"><div class="ust-satir"><span class="tno" title="Alıştırma ' + D.tamrin + '">' + ar(D.tamrin) + '</span>' +
      '<h1 class="yonerge" lang="ar">' + yazi(D.yonerge) + '</h1></div>' +
      '<p class="yonerge-tr">' + esc(D.yonerge_tr) + '</p>' +
      '<div class="kunye"><span class="cip">Kitap s. ' + D.sayfa + '</span><span class="cip">Etkinlik ' + D.no + '</span>' +
      '<span class="cip k-' + esc(D.kaynak) + '">' + (KAYNAK_AD[D.kaynak] || '') + '</span></div>';
    if (D.sesler && D.sesler.length) {
      h += '<div class="sesler">' + D.sesler.map(function (s) {
        return '<div class="ses-kutu"><b lang="ar">صَوْت ' + ar(s.no) + '</b><audio controls preload="none" src="' + esc(s.yol) + '"></audio></div>';
      }).join('') + '</div>';
    }
    h += '</header>';
    if (D.gorsel) h += '<div class="ek gorsel"><img src="' + resim(D.gorsel) + '" alt=""></div>';
    if (D.metin) h += '<div class="ek metin" lang="ar">' + esc(D.metin) + '</div>';
    if (D.ornek && D.tur !== 'acik') h += '<div class="ek ornek" lang="ar"><span class="etiket">مِثال</span><span>' + yazi(D.ornek) + '</span></div>';
    h += '<section class="govde" id="govde"></section><nav class="gecis" id="gecis"></nav>';
    KOK.innerHTML = h;
    var alt = document.createElement('div');
    alt.className = 'alt';
    var tur = TUR[D.tur];
    if (!tur) { hata('Bu etkinlik türü tanınmadı: ' + D.tur); return; }
    IS = tur($('#govde'));
    if (IS.acik) {
      alt.innerHTML = '<button type="button" class="tus" id="tGoster">Örnek cevapları göster</button><div class="sonuc"></div>';
      document.body.appendChild(alt);
      var acikGor = false;
      $('#tGoster').addEventListener('click', function () { acikGor = !acikGor; IS.goster(acikGor); this.textContent = acikGor ? 'Örnek cevapları gizle' : 'Örnek cevapları göster'; });
    } else {
      alt.innerHTML = '<button type="button" class="tus" id="tKontrol">Kontrol et</button>' +
        '<button type="button" class="tus iki" id="tGoster">Cevapları göster</button>' +
        '<button type="button" class="tus uc" id="tBastan">Baştan</button><div class="sonuc" role="status" aria-live="polite"></div>';
      document.body.appendChild(alt);
      $('#tKontrol').addEventListener('click', function () {
        if (KILIT) return;
        isaretSil();
        var s = IS.kontrol();
        if (s.cumle) {
          if (!s.d && !s.y) { sonuc('Önce sütunlardan seçip cümle ekle.', 'orta'); return; }
          sonuc((s.d >= D.adet && !s.y ? '✓ Tebrikler! ' : '') + '✓ ' + s.d + ' doğru cümle' + (s.y ? ' · ✗ ' + s.y + ' yanlış' : '') +
            (s.d < D.adet ? ' · ' + D.adet + ' cümle isteniyor' : ''), s.y ? 'kotu' : (s.d >= D.adet ? 'iyi' : 'orta'));
          return;
        }
        if (s.d === s.t) sonuc('✓ Tebrikler! Hepsi doğru (' + s.d + ' / ' + s.t + ').', 'iyi');
        else sonuc('✓ ' + s.d + ' doğru · ✗ ' + s.y + ' yanlış' + (s.b ? ' · ' + s.b + ' boş' : '') + ' — yanlışları düzeltip yeniden kontrol et.', s.d >= s.t / 2 ? 'orta' : 'kotu');
      });
      $('#tGoster').addEventListener('click', function () {
        isaretSil(); IS.goster(); KILIT = true; document.body.classList.add('kilit');
        $('#tKontrol').disabled = true; this.disabled = true;
        sonuc('Cevap anahtarı gösteriliyor. Yeniden denemek için «Baştan».', 'iyi');
      });
      $('#tBastan').addEventListener('click', function () {
        KILIT = false; document.body.classList.remove('kilit');
        isaretSil(); IS.sifirla();
        $('#tKontrol').disabled = false; $('#tGoster').disabled = false;
        window.scrollTo(0, 0);
      });
    }
    gecisKur();
  }

  /* önceki / sonraki etkinlik ve bütün liste */
  function listeYukle(sonra) {
    if (window.ETK_LISTE) { sonra(window.ETK_LISTE); return; }
    var s = document.createElement('script');
    s.src = 'veri/liste.js' + (SURUM ? '?v=' + SURUM : '');
    s.onload = function () { sonra(window.ETK_LISTE || null); };
    s.onerror = function () { sonra(null); };
    document.head.appendChild(s);
  }
  function gecisKur() {
    listeYukle(function (L) {
      if (!L) return;
      var i = -1;
      L.etkinlikler.forEach(function (e, k) { if (e.no === D.no) i = k; });
      var o = L.etkinlikler[i - 1], s = L.etkinlikler[i + 1];
      $('#gecis').innerHTML = '<span>' + (o ? '<a href="?n=' + o.no + '">‹ Etkinlik ' + o.no + '</a>' : '') + '</span>' +
        '<a href="index.html">Bütün etkinlikler</a><span>' + (s ? '<a href="?n=' + s.no + '">Etkinlik ' + s.no + ' ›</a>' : '') + '</span>';
    });
  }
  function listeSayfasi() {
    document.title = 'Etkinlikler — Arapça 8';
    listeYukle(function (L) {
      if (!L) { hata('Etkinlik listesi bulunamadı.'); return; }
      var h = '<header class="ust"><h1 class="yonerge-tr" style="font-size:22px;font-weight:800;color:#15222E;margin:0">Kitap etkinlikleri</h1>' +
        '<p class="yonerge-tr">' + esc(L.ad) + ' · ' + L.etkinlikler.length + ' etkinlik. Kitapta bir alıştırmanın yanındaki etkinlik düğmesi aynı etkinliği açar.</p></header>';
      var gr = {};
      L.etkinlikler.forEach(function (e) { (gr[e.unite] = gr[e.unite] || []).push(e); });
      Object.keys(gr).sort(function (a, b) { return a - b; }).forEach(function (u) {
        var un = (L.uniteler || {})[u] || '';
        h += '<section class="madde" style="display:block;direction:ltr"><h2 style="margin:0 0 8px;font-size:17px">' + esc(u + '. ünite') +
          (un ? ' · <span class="ar" style="font-weight:400;font-size:22px">' + esc(un) + '</span>' : '') + '</h2>' +
          '<div style="display:flex;flex-wrap:wrap;gap:8px">' + gr[u].map(function (e) {
            return '<a class="cip" style="text-decoration:none;font-size:14px;padding:7px 12px" href="?n=' + e.no + '">' + e.no + ' · ' + esc(e.baslik) + ' <small style="opacity:.7">s. ' + e.sayfa + '</small></a>';
          }).join('') + '</div></section>';
      });
      KOK.innerHTML = h;
    });
  }

  if (!NO) { listeSayfasi(); return; }
  var s = document.createElement('script');
  s.src = 'veri/' + nn(NO) + '.js' + (SURUM ? '?v=' + SURUM : '');
  s.onload = function () {
    if (window.ETK_VERI && window.ETK_VERI.no === NO) { try { kur(window.ETK_VERI); } catch (e) { hata('Etkinlik açılamadı: ' + e.message); } }
    else hata('Etkinlik verisi okunamadı.');
  };
  s.onerror = function () { hata('Etkinlik ' + NO + ' bulunamadı.'); };
  document.head.appendChild(s);
})();
