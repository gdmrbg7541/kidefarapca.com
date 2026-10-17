/* ============================================================
   MEB Arapça dijital ders kitabı uygulaması (5. ve 6. sınıf ortak)
   Kitap sağdan sola okunur: flip.js rtl seçeneği (yapraklar sol yarıda, sağa çevrilir).
   Sayfa numarası: flipbook sayfası f  ->  kitaptaki sayfa f - 2
     f=1 ön kapak, f=2 iç kapak (boş), f=209 boş, f=210 arka kapak
   Kitaba özgü her şey veri.js'te (window.KITAP_VERI): ad, sayfa farkı, ünite,
   kaynaklar, saklama anahtarı, ZIP adı. Dosya listesi: dosyalar.js (window.DOSYALAR)
   ============================================================ */
(function () {
  'use strict';
  var K = window.KITAP_VERI || window.KITAP6, FARK = K.fark, TOPLAM = K.toplam;
  var SON_BASILI = K.sonBasili || (TOPLAM - FARK - 2);   // kitapta numaralı son sayfa
  var $ = function (s, k) { return (k || document).querySelector(s); };
  var $$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };

  /* ---------- SVG simgeler ---------- */
  var SVG = {
    ses: '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    etkinlik: '<svg viewBox="0 0 24 24"><path d="M10 3.5h4v2.2a1.8 1.8 0 1 0 3.6 0V3.5h2.9v6.4h-2.2a1.8 1.8 0 1 0 0 3.6h2.2v7h-6.4v-2.2a1.8 1.8 0 1 0-3.6 0v2.2H3.5v-7h2.2a1.8 1.8 0 1 0 0-3.6H3.5V3.5H10z"/></svg>',
    video: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/></svg>',
    sarki: '<svg viewBox="0 0 24 24"><path d="M9 18V5.5l11-2v12.5"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/><path d="M9 9.5l11-2"/></svg>',
    eba: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/></svg>',
    indir: '<svg viewBox="0 0 24 24"><path d="M12 3v12"/><polyline points="7 10 12 15 17 10"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
    paket: '<svg viewBox="0 0 24 24"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>'
  };
  var TUR_AD = { ses: 'Ses', etkinlik: 'Etkinlik', video: 'Video', sarki: 'Şarkı', eba: 'EBA' };

  /* ---------- yardımcılar ---------- */
  function basili(f) { return f - FARK; }
  function etiket(f) {
    if (!f) return '';
    var pr = basili(f);
    if (pr >= 1 && pr <= SON_BASILI) return String(pr);
    if (f === 1) return 'Kapak';
    if (f === TOPLAM) return 'Arka kapak';
    return pr < 1 ? 'İç kapak' : '';
  }
  function uniteBul(pr) {
    for (var i = 0; i < K.uniteler.length; i++) {
      var u = K.uniteler[i];
      if (pr >= u.bas && pr <= u.son) return u;
    }
    return null;
  }
  var tostZ;
  function tost(m, sure) {
    var t = $('#tost'); t.textContent = m; t.classList.add('gor');
    clearTimeout(tostZ); tostZ = setTimeout(function () { t.classList.remove('gor'); }, sure || 2600);
  }
  var YEREL = location.protocol === 'file:';
  var ACILIS = new URLSearchParams(location.search).get('s');
  /* En son kalınan sayfa bu tarayıcıda saklanır; adreste ?s= yoksa oradan açılır */
  var SON_ANAHTAR = K.anahtar || 'arapca6_2026_sonSayfa', SON = null;
  try { SON = parseInt(localStorage.getItem(SON_ANAHTAR), 10); } catch (e) {}   // flip kurulmadan oku (degisti adresi yeniler)

  /* ---------- hotspot katmanı ---------- */
  function katmanKur(f, katman) {
    katman.innerHTML = '';
    var L = K.sayfa[String(f)];
    if (!L) return;
    L.forEach(function (h) {
      var k = K.kaynak[h.k];
      var b = document.createElement('button');
      b.className = 'nokta n-' + k.tur;
      b.style.left = h.x + '%'; b.style.top = h.y + '%';
      b.style.width = h.w + '%'; b.style.height = h.h + '%';
      b.dataset.k = h.k;
      b.title = k.ad + (k.tur === 'eba' ? ' — EBA’da açılır (internet gerekir)' : '');
      b.setAttribute('aria-label', k.ad);
      b.innerHTML = SVG[k.tur] + '<b>' + (k.tur === 'eba' ? 'EBA' : (TUR_AD[k.tur] + ' ' + k.no)) + '</b>';
      b.addEventListener('click', function (e) { e.stopPropagation(); ac(h.k); });
      // dokunmatik geri bildirim: basılır basılmaz renklenir, kısa titreşim
      b.addEventListener('pointerdown', function (e) {
        e.stopPropagation(); b.classList.add('basili');
        if (e.pointerType !== 'mouse' && navigator.vibrate) { try { navigator.vibrate(12); } catch (x) {} }
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
        b.addEventListener(ev, function () { setTimeout(function () { b.classList.remove('basili'); }, 120); });
      });
      katman.appendChild(b);
    });
  }

  /* ---------- flipbook ---------- */
  var flip = new window.Flip($('#ayna'), {
    toplam: TOPLAM, oran: K.oran, rtl: true,
    gorselYolu: function (no) { return 'sayfa/' + ('00' + no).slice(-3) + '.webp'; },
    kucukYolu: function (no) { return 'sayfa/k/' + ('00' + no).slice(-3) + '.webp'; },
    katmanKur: katmanKur,
    degisti: degisti
  });
  function olcuYaz() { document.documentElement.style.setProperty('--sayfaEn', (flip.sayfaEn || 500) + 'px'); }
  olcuYaz();
  window.addEventListener('resize', function () { flip.olcekle(); olcuYaz(); if (Z) Z.olcekle(); });

  var sonDurum = null;
  function degisti(d) {
    sonDurum = d;
    var gor = d.tekli ? [d.aktif] : [d.sol, d.sag].filter(Boolean);
    // sağdan sola: sayaçta önce sağdaki (küçük) sayfa
    var yazi = gor.map(etiket).filter(Boolean);
    $('#sayfaEt').textContent = yazi.length ? yazi.join(' – ') : '—';
    var kay = $('#kaydiracInput'); kay.value = d.aktif;
    kay.style.setProperty('--dolu', ((d.aktif - 1) / (TOPLAM - 1) * 100) + '%');
    $('#okSol').disabled = d.son; $('#okSag').disabled = d.ilk;
    var pr = basili(d.aktif), u = uniteBul(pr);
    if (!u && d.sol) u = uniteBul(basili(d.sol));
    $('#uniteEt').textContent = u ? (u.no ? u.no + '. Ünite' : u.ad) : (pr < 1 ? 'Kapak' : (pr > SON_BASILI ? 'Arka kapak' : 'Giriş'));
    $('#dersEt').textContent = u && u.no ? u.ad : '';
    try { localStorage.setItem(SON_ANAHTAR, String(d.aktif)); } catch (e) {}   // en son kalınan sayfa
    try { history.replaceState(null, '', '?s=' + (pr >= 1 && pr <= SON_BASILI ? pr : (pr < 1 ? 'kapak' : 'son'))); } catch (e) {}
    calanIsaretle();
  }

  /* ---------- gezinme ---------- */
  $('#okSol').addEventListener('click', function () { flip.ileri(); });
  $('#okSag').addEventListener('click', function () { flip.geri(); });
  $('#kaydiracInput').addEventListener('input', function () { flip.git(+this.value); });
  $('#gitInput').addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var n = parseInt(this.value, 10);
    if (isNaN(n) || n < 1 || n > SON_BASILI) { tost('Kitapta 1 ile ' + SON_BASILI + ' arası sayfa var'); return; }
    sayfayaGit(n); this.blur();
  });
  function sayfayaGit(pr) { kapatHepsi(); flip.git(pr + FARK); }

  /* ---------- paneller ---------- */
  var perde = $('#perde');
  function panelAc(id) {
    kapatHepsi(true);
    $(id).classList.add('acik'); $(id).setAttribute('aria-hidden', 'false');
    perde.classList.add('acik');
  }
  function kapatHepsi(sessiz) {
    $$('.panel.acik').forEach(function (p) { p.classList.remove('acik'); p.setAttribute('aria-hidden', 'true'); });
    perde.classList.remove('acik');
    var v = $('#videoOyn'); if (!v.paused) v.pause();
    var fr = $('#etkinlikCerceve'); if (fr.getAttribute('src')) fr.removeAttribute('src');
    $$('.tus.etiketli').forEach(function (t) { t.classList.remove('aktif'); });
  }
  perde.addEventListener('click', function () { kapatHepsi(); });
  $$('[data-kapat]').forEach(function (b) { b.addEventListener('click', function () { kapatHepsi(); }); });

  /* ---------- yükleniyor göstergesi ---------- */
  function yukleniyorGoster(panel, yazi) {
    var g = $(panel + ' .pgovde'), y = $('.yukleniyor', g);
    if (!y) { y = document.createElement('div'); y.className = 'yukleniyor'; g.style.position = 'relative'; g.appendChild(y); }
    y.textContent = yazi; y.hidden = false;
    clearTimeout(y._z); y._z = setTimeout(function () { y.hidden = true; }, 8000);   // güvenlik ağı
  }
  function yukleniyorGizle(panel) { var y = $(panel + ' .yukleniyor'); if (y) y.hidden = true; }

  /* ---------- dokunma halkası: parmağın/kalemin değdiği yerde kısa bir halka ---------- */
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    var h = document.createElement('div'); h.className = 'halka';
    h.style.left = e.clientX + 'px'; h.style.top = e.clientY + 'px';
    document.body.appendChild(h); setTimeout(function () { h.remove(); }, 500);
  }, true);

  /* ---------- kaynak açma ---------- */
  var calanK = null;
  /* Analytics olayı: hangi ses/etkinlik/video açıldı (gtag yoksa sessizce geçer) */
  function olay(ad, veri) { try { if (window.gtag) window.gtag('event', ad, veri); } catch (e) {} }
  function ac(i) {
    var k = K.kaynak[i];
    olay((K.olay || 'kitap6') + '_kaynak', { kaynak_turu: k.tur, kaynak_adi: k.ad, kitap_sayfasi: k.s });
    if (k.tur === 'ses') return sesCal(i);
    if (k.tur === 'video' || k.tur === 'sarki') {
      panelAc('#pVideo');
      $('#videoRozet').textContent = TUR_AD[k.tur];
      $('#videoBaslik').textContent = k.ad + ' · s. ' + k.s;
      $('#videoIndir').href = k.yol;
      var v = $('#videoOyn'); v.poster = k.poster || '';
      yukleniyorGoster('#pVideo', 'Video yükleniyor…');
      v.oncanplay = v.onerror = function () { yukleniyorGizle('#pVideo'); };
      v.src = k.yol;
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      sesDurdur();
      return;
    }
    if (k.tur === 'etkinlik') {
      panelAc('#pEtkinlik');
      $('#etkinlikBaslik').textContent = k.ad + ' · s. ' + k.s;
      $('#etkinlikYeni').href = k.yol;
      yukleniyorGoster('#pEtkinlik', 'Etkinlik açılıyor…');
      var fr = $('#etkinlikCerceve');
      fr.onload = function () { yukleniyorGizle('#pEtkinlik'); };
      fr.src = k.yol;
      sesDurdur();
      return;
    }
    if (k.tur === 'eba') {
      if (!navigator.onLine) { tost('EBA içeriği için internet bağlantısı gerekir'); return; }
      window.open(k.yol, '_blank', 'noopener');
    }
  }
  function sesCal(i) {
    var k = K.kaynak[i], a = $('#calarSes');
    if (calanK === i && !a.paused) { a.pause(); return; }
    if (calanK !== i) { a.src = k.yol; calanK = i; }
    $('#calarAd').textContent = k.ad;
    $('#calarSayfa').textContent = k.s ? 'Kitap sayfası ' + k.s : '';
    $('#calar').hidden = false;
    var p = a.play(); if (p && p.catch) p.catch(function () { tost('Ses dosyası açılamadı'); });
    calanIsaretle();
  }
  function sesDurdur() { var a = $('#calarSes'); if (!a.paused) a.pause(); }
  function calanIsaretle() {
    var a = $('#calarSes'), calan = !a.paused ? calanK : null;
    $$('.nokta.n-ses').forEach(function (n) { n.classList.toggle('calan', calan !== null && +n.dataset.k === calan); });
  }
  ['play', 'pause', 'ended'].forEach(function (ev) { $('#calarSes').addEventListener(ev, calanIsaretle); });
  $('#calarKapat').addEventListener('click', function () {
    var a = $('#calarSes'); a.pause(); a.removeAttribute('src'); a.load(); calanK = null;
    $('#calar').hidden = true; calanIsaretle();
  });

  /* ---------- içindekiler ---------- */
  function sayilar(u) {
    var c = { ses: 0, etkinlik: 0, video: 0 };
    K.kaynak.forEach(function (k) {
      if (k.s < u.bas || k.s > u.son) return;
      if (k.tur === 'ses') c.ses++; else if (k.tur === 'etkinlik') c.etkinlik++;
      else if (k.tur === 'video' || k.tur === 'sarki') c.video++;
    });
    var p = [];
    if (c.ses) p.push(c.ses + ' ses'); if (c.etkinlik) p.push(c.etkinlik + ' etkinlik'); if (c.video) p.push(c.video + ' video/şarkı');
    return p.join(' · ');
  }
  function tocKur() {
    var h = '<button class="tunite" data-git="kapak"><span class="nu bos">K</span><span class="mt"><b>Kapak</b></span></button>';
    K.uniteler.forEach(function (u) {
      var s = sayilar(u);
      h += '<button class="tunite" data-git="' + u.bas + '"><span class="nu' + (u.no ? '' : ' bos') + '">' + (u.no || '·') + '</span>' +
        '<span class="mt"><b>' + (u.no ? u.no + '. Ünite: ' : '') + u.ad + '</b>' + (u.ar ? '<span dir="rtl">' + u.ar + '</span>' : '') +
        (s ? '<small>' + s + '</small>' : '') + '</span><span class="sy">s. ' + u.bas + '–' + u.son + '</span></button>';
    });
    $('#tocListe').innerHTML = h;
    $$('#tocListe .tunite').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.git === 'kapak') { kapatHepsi(); flip.git(1); } else sayfayaGit(+b.dataset.git);
      });
    });
  }
  tocKur();
  $('#tIcindekiler').addEventListener('click', function () {
    var pr = sonDurum ? basili(sonDurum.aktif) : 0;
    $$('#tocListe .tunite').forEach(function (b) {
      var u = K.uniteler.filter(function (x) { return String(x.bas) === b.dataset.git; })[0];
      b.classList.toggle('simdi', !!u && pr >= u.bas && pr <= u.son);
    });
    panelAc('#pIcindekiler');
  });

  /* ---------- kaynaklar ---------- */
  var filtre = 'hepsi';
  /* bir kaynak satırı — ünite grubunda da "Diğer kaynaklar"da da aynı */
  function satir(i) {
    var k = K.kaynak[i];
    var indir = (k.tur === 'ses' || k.tur === 'video' || k.tur === 'sarki')
      ? '<a class="gizle-kucuk" href="' + k.yol + '" download title="Bilgisayara indir">İndir</a>' : '';
    return '<div class="ksatir"><span class="ik i-' + k.tur + '">' + SVG[k.tur] + '</span>' +
      '<span class="ad">' + k.ad + (k.s ? '<small>Kitap sayfası ' + k.s + '</small>' : '') + '</span>' +
      '<span class="dgm"><button data-ac="' + i + '">' + (k.tur === 'ses' ? 'Dinle' : (k.tur === 'eba' ? 'EBA’da aç' : 'Aç')) + '</button>' +
      (k.s ? '<button data-sayfa="' + k.s + '" class="gizle-kucuk">Sayfaya git</button>' : '') + indir + '</span></div>';
  }
  function kaynakKur() {
    var gruplar = K.uniteler;
    var h = '';
    /* 02.10.2026: ünitesi belli olan kaynak o ünitenin altında listelenir;
       yalnız sayfaya bakmak, sayfası olmayan kaynağı her ünitede tekrar
       ediyordu. Ne ünitesi ne sayfası olan kaynak en sonda toplanır. */
    function uygun(k, u) {
      /* no:0 olan bölümler (sözlük, kaynakça) gerçek ünite değil: onlara
         yalnız sayfa aralığıyla girilir, yoksa ünitesiz kaynak ikisinde de
         görünüyordu. */
      if (u.no && k.u != null) return k.u === u.no;
      if (k.s != null) return k.s >= u.bas && k.s <= u.son;
      return false;
    }
    function suzgec(k) {
      return filtre === 'hepsi' || filtre === k.tur || (filtre === 'video' && k.tur === 'sarki');
    }
    var yerlesen = {};
    gruplar.forEach(function (u) {
      var L = [];
      K.kaynak.forEach(function (k, i) {
        if (!uygun(k, u)) return;
        yerlesen[i] = 1;
        if (!suzgec(k)) return;
        L.push(i);
      });
      if (!L.length) return;
      h += '<div class="kgrup"><h3>' + (u.no ? u.no + '. Ünite · ' : '') + u.ad + (u.ar ? ' <span dir="rtl">' + u.ar + '</span>' : '') + '</h3>';
      h += L.map(satir).join('');
      h += '</div>';
    });
    var arta = [];
    K.kaynak.forEach(function (k, i) { if (!yerlesen[i] && suzgec(k)) arta.push(i); });
    if (arta.length) {
      h += '<div class="kgrup"><h3>Diğer kaynaklar</h3>' + arta.map(satir).join('') + '</div>';
    }
    $('#kaynakListe').innerHTML = h || '<div class="bos-sonuc">Kaynak yok</div>';
    $$('#kaynakListe [data-ac]').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.dataset.ac, k = K.kaynak[i];
        if (k.tur === 'ses' || k.tur === 'eba') ac(i); else { ac(i); }
      });
    });
    $$('#kaynakListe [data-sayfa]').forEach(function (b) {
      b.addEventListener('click', function () { sayfayaGit(+b.dataset.sayfa); });
    });
  }
  $$('#kSekme button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#kSekme button').forEach(function (x) { x.classList.toggle('secili', x === b); });
      filtre = b.dataset.f; kaynakKur();
    });
  });
  $('#tKaynak').addEventListener('click', function () {
    kaynakKur(); panelAc('#pKaynak'); this.classList.add('aktif');
  });

  /* ---------- indir (flaş paketi) ---------- */
  var D = window.DOSYALAR || null;
  function mb(b) { return (b / 1048576).toFixed(b > 10485760 ? 0 : 1).replace('.', ',') + ' MB'; }
  function paketBoy(f) { return D.dosyalar.filter(f).reduce(function (t, x) { return t + x[1]; }, 0); }
  var SAY = { ses: 0, etkinlik: 0, video: 0, sarki: 0 };
  K.kaynak.forEach(function (k) { if (SAY[k.tur] != null) SAY[k.tur]++; });
  var PAKETLER = [
    { ad: 'Tam paket', alt: (K.paketAciklama || 'Kitap + sesler + etkinlikler + videolar') + ' — flaşa çıkarıp index.html’i açın', ana: true, ek: 'tam',
      f: function () { return true; } },
    { ad: 'Kitap ve etkinlikler', alt: 'Sayfa çevirmeli kitap ve ' + SAY.etkinlik + ' etkinlik (videosuz, sessiz)', ek: 'kitap-etkinlik',
      f: function (x) { return !/^(ses|video)\//.test(x[0]); } },
    { ad: 'Sesler', alt: SAY.ses + ' ses kaydı (mp3)', ek: 'sesler', f: function (x) { return /^ses\//.test(x[0]); } },
    { ad: 'Videolar ve şarkılar', alt: SAY.video + ' video + ' + SAY.sarki + ' şarkı klibi (mp4)', ek: 'videolar', f: function (x) { return /^video\//.test(x[0]); } }
  ];
  function indirKur() {
    if (!D) { $('#indirListe').innerHTML = '<div class="bos-sonuc">Dosya listesi bulunamadı.</div>'; return; }
    // içinde dosyası olmayan paket gösterilmez (ör. sesi/videosu olmayan kitap);
    // yalnız tam paket kalıyorsa o da yeter
    var gor = PAKETLER.map(function (p, i) { return [p, i]; })
      .filter(function (x) { return paketBoy(x[0].f) > 0 && (x[0].ana || paketBoy(x[0].f) < paketBoy(PAKETLER[0].f)); });
    $('#indirListe').innerHTML = gor.map(function (x) { var p = x[0], i = x[1];
      return '<button data-p="' + i + '"' + (p.ana ? ' class="ana"' : '') + '>' + (p.ana ? SVG.paket : SVG.indir) +
        '<span class="mt"><b>' + p.ad + '</b><small>' + p.alt + '</small></span><small>' + mb(paketBoy(p.f)) + '</small></button>';
    }).join('');
    $$('#indirListe button').forEach(function (b) {
      b.addEventListener('click', function () { zipIndir(PAKETLER[+b.dataset.p]); });
    });
  }
  function betikYukle(src) {
    return new Promise(function (ok, hata) {
      var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = hata; document.head.appendChild(s);
    });
  }
  var zipCalisiyor = false;
  function zipIndir(p) {
    if (zipCalisiyor) return;
    olay((K.olay || 'kitap6') + '_indir', { paket: p.ek });
    if (YEREL) { tost('Bu kopya zaten bilgisayarınızda: klasörü olduğu gibi flaşa kopyalayabilirsiniz', 5000); return; }
    var L = D.dosyalar.filter(p.f), top = paketBoy(p.f), inen = 0;
    zipCalisiyor = true;
    $$('#indirListe button').forEach(function (b) { b.disabled = true; });
    var il = $('#indirIlerleme'); il.hidden = false;
    function yaz(oran, m) { $('#indirCubuk').style.width = Math.round(oran * 100) + '%'; $('#indirYazi').textContent = m; }
    yaz(0, 'Hazırlanıyor…');
    (window.JSZip ? Promise.resolve() : betikYukle('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'))
      .then(function () {
        var zip = new window.JSZip(), kok = zip.folder(K.zipKlasor || '6. Sınıf Arapça 2026-2027'), i = 0;
        function sonraki() {
          if (i >= L.length) return Promise.resolve();
          var x = L[i++];
          return fetch(x[0]).then(function (r) { if (!r.ok) throw new Error(x[0]); return r.arrayBuffer(); })
            .then(function (b) {
              kok.file(x[0], b, { binary: true });
              inen += x[1]; yaz(inen / top * 0.9, 'İndiriliyor: ' + mb(inen) + ' / ' + mb(top));
              return sonraki();
            });
        }
        // 4 paralel kanal
        return Promise.all([sonraki(), sonraki(), sonraki(), sonraki()]).then(function () {
          yaz(0.92, 'ZIP oluşturuluyor…');
          return zip.generateAsync({ type: 'blob', compression: 'STORE', streamFiles: true },
            function (m) { yaz(0.92 + m.percent / 100 * 0.08, 'ZIP oluşturuluyor… %' + Math.round(m.percent)); });
        });
      })
      .then(function (blob) {
        var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
        a.download = (K.zipAd || '6-sinif-arapca-2026-2027') + '-' + p.ek + '.zip'; document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
        yaz(1, 'Hazır: ' + a.download + ' indirildi. Klasöre çıkarıp index.html’i açın.');
      })
      .catch(function (e) { yaz(0, 'İndirme yarıda kaldı (' + (e && e.message || 'bağlantı') + '). Tekrar deneyin.'); })
      .then(function () { zipCalisiyor = false; $$('#indirListe button').forEach(function (b) { b.disabled = false; }); });
  }
  /* İndir düğmesi olmayan kitap olabilir (02.10.2026: 7. sınıf Maarif
     kitabı resmî olarak yayınlanamadığı için indirilemiyor). */
  var bIndir = $('#tIndir');
  if (bIndir) bIndir.addEventListener('click', function () {
    indirKur(); panelAc('#pIndir'); this.classList.add('aktif');
  });

  /* ---------- düğmeleri göster/gizle ---------- */
  $('#tIpucu').addEventListener('click', function () {
    var kapali = document.body.classList.toggle('ipuclari-kapali');
    this.classList.toggle('aktif', !kapali);
    tost(kapali ? 'Sayfa düğmeleri gizlendi (üzerine gelince görünür)' : 'Sayfa düğmeleri gösteriliyor');
  });

  /* ---------- tam ekran ---------- */
  function tamEkran() {
    var d = document, el = d.documentElement;
    if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    else (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el);
  }
  $('#tTamEkran').addEventListener('click', tamEkran);

  /* ---------- yakınlaştırma: ORTAK MODÜL (kitapzoom.js) ----------
     02.10.2026, öğretmen isteği: "tasarımsal şeyler tüm flipbooklarda ortak
     olmalı". Burada önce basit bir yakınlaştırma vardı (yalnız fareyle çift
     tıklama + sürükleme, en çok %300). Kidef Arapça flipbook'undaki motor
     ortak dosyaya çıkarıldı; artık üç kitapta da aynısı çalışıyor:
       · çift sayfada 6 bölge — bir bölgeye dokunuş onu ekranı dolduracak
         kadar büyütür, tekrar dokunuş küçültür (akıllı tahta)
       · büyükken yön tuşları: ↑↓ sayfa boyunun 1/9'u kadar yumuşak kayar,
         uçta öbür sayfaya/yayılıma geçer; ←→ okuma sırasına göre sayfa
       · iki parmak pinch, telefonda çift dokunma, imlece göre yakınlaştırma
       · %500'e kadar
     KODU BURADA DEĞİŞTİRME — ortak kaynak: _kaynak/ortak-kitap/kitapzoom.js
     (değişiklikten sonra _kaynak/uretici/kitapOrtakla.py çalıştırılır).
     rtl ayarı Flip örneğinden okunur. */
  var sahne = $('#sahne');
  var Z = window.KitapZoom({
    sahne: sahne,
    kaydir: $('#kaydir'),
    flip: flip,
    panelAcik: function () { return !!$('.panel.acik'); },
    etiket: $('#zoomEt'),
    bilgi: $('#zoomBilgi'),
    yaklas: $('#tYaklas'),
    uzaklas: $('#tUzaklas'),
    yoksay: '.nokta'
  });

  /* ---------- klavye ---------- */
  document.addEventListener('keydown', function (e) {
    if (/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '')) return;
    var acik = !!$('.panel.acik');
    if (e.key === 'Escape') { if (acik) kapatHepsi(); else Z.sifirla(); return; }
    if (acik) return;
    /* Büyükken yön tuşları sayfa çevirmez, sayfanın içinde gezdirir. */
    if (Z.tus(e.key)) { e.preventDefault(); return; }
    switch (e.key) {
      case 'ArrowLeft': case 'PageDown': case ' ': e.preventDefault(); flip.ileri(); break;   // sağdan sola: sol = ileri
      case 'ArrowRight': case 'PageUp': e.preventDefault(); flip.geri(); break;
      case 'Home': flip.git(1); break;
      case 'End': flip.git(TOPLAM); break;
      case 'f': case 'F': tamEkran(); break;
      case 'i': case 'I': $('#tIcindekiler').click(); break;
      case 'k': case 'K': $('#tKaynak').click(); break;
      case 'h': case 'H': $('#tIpucu').click(); break;
      case '+': case '=': Z.ayarla(Z.oran() * 1.5); break;
      case '-': case '_': Z.ayarla(Z.oran() / 1.5); break;
      case '0': Z.sifirla(); break;
    }
  });

  /* ---------- açılış ---------- */
  var s = ACILIS;
  if (s && /^\d+$/.test(s)) flip.git(+s + FARK, true);
  else if (s === 'son') flip.git(TOPLAM, true);
  else if (!s && SON > 1 && SON <= TOPLAM) {
    flip.git(SON, true);
    setTimeout(function () { tost('Kaldığınız sayfadan açıldı: ' + (etiket(SON) || SON) + ' — kapağa dönmek için Home tuşu', 3800); }, 600);
  }
  if (!s && !(SON > 1)) setTimeout(function () { tost('Sayfa çevirmek için sayfanın kenarına dokunun, parmakla sürükleyin ya da oklara basın', 4200); }, 700);
})();
