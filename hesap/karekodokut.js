/* ======================================================================
   KIDEF · KAREKODU OKUT — telefonda kamerayı doğrudan açan tuş
                                                       hesap/karekodokut.js
   ----------------------------------------------------------------------
                                                            17.10.2026
   Öğretmen: "giriş kayıt sayfasında direkt kamerayı açan bi tuş olsun
   mobillerde".

   · Giriş/kayıt penceresinin başlığının hemen altına, YALNIZ telefon ve
     tablette, "Karekodu okut" tuşu gelir (tahtada ve bilgisayarda yok).
     Rol sorusu ya da form açıkken de görünür.
   · Tuş kamerayı sayfanın içinde açar (arka kamera); karekod çerçeveye
     girince kendiliğinden okunur. Okuyucu: tarayıcının kendi karekod
     tanıyıcısı (BarcodeDetector), yoksa sistem/jsqr.js (yalnız gerekince
     yüklenir; iPhone'da gerekir).
   · Kamera açılamazsa (izin verilmedi, kamera yok, güvenli bağlantı değil)
     "Fotoğraf çek" ile telefonun kamera uygulamasından çekilen fotoğraftaki
     karekod okunur.
   · YALNIZ bu sitenin bağlantıları açılır (kidefarapca.com ya da sayfanın
     kendi adresi). Tahtadaki giriş karekodu (index.html?qr=…) açılınca
     telefonda onay ekranı gelir; giriş yapılmamışsa önce giriş istenir
     (hesap/qrgiris.js'teki akış). Başka siteye giden karekod açılmaz.

   2. SÜRÜM (17.10.2026) — öğretmen: "telefondan karekod okutulacaksa önce
   giriş yapılması sağlansın sonra karekod için kamera açılsın … mobilden
   giriş yapılmışsa ve akıllı tahtadan karekod okutularak giriş yapılmak
   isteniyorsa sidebarda akıllı tahtayı bağla ya tıklansın direkt kamera
   açılsın".
   · Giriş penceresindeki tuş ÖNCE GİRİŞ ister: giriş yoksa kamera açılmaz,
     tuş "Önce giriş yap" der; giriş biter bitmez (pencere kapanınca)
     kamera kendiliğinden açılır. Niyet sessionStorage'da 10 dakika durur
     (Google ile girişte sayfa gidip gelse de kaybolmaz).
   · Telefonda/tablette giriş yapmış öğretmene kenar menüde (çekmecede)
     "Akıllı tahtayı bağla": dokununca kamera doğrudan açılır, tahtadaki
     giriş karekodu okutulur. Tahta zaten girişliyse kameradaki "Tahtam
     zaten açık" düğmesi Tahtaya yansıt panelini açar.
   Dışa açılan: window.KidefKarekodOkut = { ac, kapat, mobilMi }
   ====================================================================== */
(function () {
  'use strict';
  if (window.KidefKarekodOkut) return;

  /* tahtanın kabuğunda (tahta.html çerçevesi) hiçbir şey yapma */
  try { if (window.name === 'kidefTahta') { window.KidefKarekodOkut = { ac: function () { }, kapat: function () { }, mobilMi: function () { return false; } }; return; } } catch (e) { }

  var KOK = (function () {               /* sitenin kökü: bu dosya hesap/ altında */
    try {
      var s = document.currentScript && document.currentScript.src;
      if (s) return s.replace(/hesap\/karekodokut\.js.*$/, '');
    } catch (e) { }
    return location.href.replace(/[^\/]*([?#].*)?$/, '');
  })();
  var JSQR = KOK + 'sistem/jsqr.js?v=8d9cb20c';
  var SITELER = /^(www\.)?kidefarapca\.com$/i;

  function $(id) { return document.getElementById(id); }

  /* ------------------------------------------------------------ cihaz */
  function mobilMi() {
    try {
      var ua = navigator.userAgent || '';
      if (navigator.userAgentData && navigator.userAgentData.mobile) return true;
      if (/iPhone|iPod|Windows Phone|Mobi/i.test(ua)) return true;
      if (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return true;
      /* Android tablet evet, Android akıllı tahta hayır (tahtanın ekranı büyük) */
      if (/Android/i.test(ua)) return Math.min(screen.width, screen.height) <= 820;
    } catch (e) { }
    return false;
  }

  /* ------------------------------------------------------------ stil */
  var STIL = [
    '.kko-tus{display:flex;align-items:center;gap:12px;width:100%;margin:2px 0 14px;padding:12px 14px;border:0;border-radius:16px;',
    ' background:linear-gradient(135deg,#16A085,#0E7C66);color:#fff;font:inherit;text-align:left;cursor:pointer;',
    ' box-shadow:0 8px 20px rgba(14,124,102,.28);-webkit-tap-highlight-color:transparent}',
    '.kko-tus:active{transform:scale(.985)}',
    '.kko-tus .kko-ik{flex:none;width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center}',
    '.kko-tus .kko-ik svg{width:28px;height:28px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.kko-tus b{display:block;font-size:1.08rem;font-weight:800;line-height:1.2}',
    '.kko-tus small{display:block;margin-top:2px;font-size:.8rem;font-weight:600;opacity:.92;line-height:1.3}',
    '.kko-tus .kko-ok{margin-left:auto;font-size:1.6rem;line-height:1;opacity:.8}',
    '#kkoKatman{position:fixed;inset:0;z-index:2147483000;background:#000;color:#fff;font-family:"Nunito","Segoe UI",sans-serif;',
    ' display:flex;flex-direction:column;touch-action:none}',
    '#kkoKatman[hidden]{display:none}',
    '#kkoKatman video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000}',
    '#kkoKatman .kko-ust{position:relative;z-index:2;display:flex;align-items:center;gap:10px;padding:max(12px,env(safe-area-inset-top)) 14px 12px;',
    ' background:linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,0))}',
    '#kkoKatman .kko-ust b{flex:1;font-size:1.08rem;font-weight:800}',
    '#kkoKatman .kko-kapat{width:42px;height:42px;border-radius:50%;border:0;background:rgba(255,255,255,.16);color:#fff;font-size:1.5rem;line-height:1;cursor:pointer}',
    '#kkoKatman .kko-vizor{position:relative;z-index:1;margin:auto;width:min(68vw,68vh,320px);aspect-ratio:1/1;border-radius:22px;',
    ' box-shadow:0 0 0 100vmax rgba(0,0,0,.42)}',
    '#kkoKatman .kko-kose{position:absolute;width:34px;height:34px;border:5px solid #2EE6B6}',
    '#kkoKatman .kko-kose.k1{top:-3px;left:-3px;border-right:0;border-bottom:0;border-radius:22px 0 0 0}',
    '#kkoKatman .kko-kose.k2{top:-3px;right:-3px;border-left:0;border-bottom:0;border-radius:0 22px 0 0}',
    '#kkoKatman .kko-kose.k3{bottom:-3px;left:-3px;border-right:0;border-top:0;border-radius:0 0 0 22px}',
    '#kkoKatman .kko-kose.k4{bottom:-3px;right:-3px;border-left:0;border-top:0;border-radius:0 0 22px 0}',
    '#kkoKatman .kko-cizgi{position:absolute;left:8%;right:8%;height:3px;border-radius:2px;background:#2EE6B6;box-shadow:0 0 12px #2EE6B6;',
    ' animation:kkoTara 2.2s ease-in-out infinite}',
    '@keyframes kkoTara{0%,100%{top:10%}50%{top:88%}}',
    '#kkoKatman.kko-tamam .kko-kose{border-color:#FFD166}#kkoKatman.kko-tamam .kko-cizgi{display:none}',
    '#kkoKatman .kko-alt{position:relative;z-index:2;padding:14px 16px max(18px,env(safe-area-inset-bottom));text-align:center;',
    ' background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.72))}',
    '#kkoKatman .kko-yazi{font-size:1rem;font-weight:700;line-height:1.4;margin:0 auto 12px;max-width:420px}',
    '#kkoKatman .kko-yazi.uyari{color:#FFD166}',
    '#kkoKatman .kko-tuslar{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}',
    '#kkoKatman .kko-tuslar button,#kkoKatman .kko-tuslar label{display:inline-flex;align-items:center;gap:8px;padding:11px 16px;border-radius:999px;',
    ' border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.14);color:#fff;font:inherit;font-weight:800;font-size:.95rem;cursor:pointer}',
    '#kkoKatman .kko-tuslar button[hidden]{display:none}',
    '#kkoKatman .kko-tuslar svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '#kkoKatman .kko-tuslar .on{background:#FFD166;color:#3b2f00;border-color:#FFD166}',
    '.kko-tus.kko-bekle{background:#fff;color:#0E7C66;box-shadow:inset 0 0 0 2px #16A085,0 6px 16px rgba(14,124,102,.14)}',
    '.kko-tus.kko-bekle .kko-ik{background:#E7F6F2}',
    '.kko-tus.kko-bekle .kko-ik svg{stroke:#0E7C66}',
    '.kko-tus.kko-bekle .kko-ok{opacity:.55}',
    '@media (prefers-reduced-motion:reduce){#kkoKatman .kko-cizgi{animation:none;top:48%}}'
  ].join('\n');
  function stilKur() {
    if ($('kkoStil')) return;
    var s = document.createElement('style');
    s.id = 'kkoStil';
    s.textContent = STIL;
    (document.head || document.documentElement).appendChild(s);
  }

  var SIM_KAMERA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.7l1.3-2h7l1.3 2h1.7A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z"/><circle cx="12" cy="12.8" r="3.8"/></svg>';
  var SIM_FOTO = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>';
  var SIM_FENER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2h8l-1 6H9z"/><path d="M9 8h6v4l-1.5 2v8h-3v-8L9 12z"/></svg>';
  var SIM_TAHTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8M12 16v5"/></svg>';
  /* kenar menü: karekod çerçevesi (başlıktaki öbür sekme simgeleriyle aynı biçim) */
  var SIM_BAGLA = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;" aria-hidden="true">' +
    '<path d="M3 8V5.5A2.5 2.5 0 0 1 5.5 3H8M16 3h2.5A2.5 2.5 0 0 1 21 5.5V8M21 16v2.5a2.5 2.5 0 0 1-2.5 2.5H16M8 21H5.5A2.5 2.5 0 0 1 3 18.5V16"/>' +
    '<rect x="7.5" y="7.5" width="3.5" height="3.5" rx=".6"/><rect x="13" y="7.5" width="3.5" height="3.5" rx=".6"/>' +
    '<rect x="7.5" y="13" width="3.5" height="3.5" rx=".6"/><path d="M13 13h3.5v3.5M13 16.5h.01"/></svg>';

  /* ------------------------------------------------------------ oturum */
  function girisli() {
    try {
      var u = window.firebase && firebase.auth && firebase.auth().currentUser;
      return !!(u && !u.isAnonymous);
    } catch (e) { return false; }
  }
  /* "önce giriş, sonra kamera" niyeti: aynı sekmede 10 dakika geçerli */
  var NIYET = 'kko_giris_sonra_kamera';
  function niyetYaz() { try { sessionStorage.setItem(NIYET, String(Date.now())); } catch (e) { } }
  function niyetSil() { try { sessionStorage.removeItem(NIYET); } catch (e) { } }
  function niyetVar() {
    var t = 0;
    try { t = parseInt(sessionStorage.getItem(NIYET) || '0', 10) || 0; } catch (e) { }
    if (t && Date.now() - t < 10 * 60000) return true;
    if (t) niyetSil();
    return false;
  }
  function pencereAcik(id) {
    var e = $(id);
    if (!e) return false;
    try { var s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden'; } catch (x) { return false; }
  }
  /* Giriş tamamlandı: giriş penceresi (ve rol sorusu) kapanınca kamerayı aç */
  var bekleZ = null;
  function niyetiYerineGetir() {
    if (bekleZ || !niyetVar() || !girisli()) return;
    var n = 0;
    bekleZ = setInterval(function () {
      n++;
      if (!niyetVar() || !girisli() || n > 150) { clearInterval(bekleZ); bekleZ = null; return; }
      if (pencereAcik('login-modal')) return;          /* rol sorusu da bu pencerenin içinde */
      clearInterval(bekleZ); bekleZ = null;
      ac({ tahta: true });
    }, 400);
  }

  /* ------------------------------------------------------------ tuş */
  function tusYaz(b) {
    var bekle = niyetVar() && !girisli();
    b.classList.toggle('kko-bekle', bekle);
    b.querySelector('b').textContent = bekle ? 'Önce giriş yap' : 'Karekodu okut';
    b.querySelector('small').textContent = bekle
      ? 'Aşağıdan giriş yap; kamera giriş biter bitmez kendiliğinden açılacak'
      : 'Önce giriş yaparsın, sonra kamera açılır: tahtadaki karekodu tara';
  }
  function tusKur() {
    if (!mobilMi()) return true;
    var m = $('login-modal');
    if (!m) return false;
    if (m.querySelector('.kko-tus')) return true;
    var bas = m.querySelector('#auth-title');
    var kap = (bas && bas.parentNode) || m.querySelector('.modal-content');
    if (!kap) return false;
    stilKur();
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'kko-tus';
    b.innerHTML = '<span class="kko-ik">' + SIM_KAMERA + '</span>' +
      '<span><b></b><small></small></span>' +
      '<span class="kko-ok" aria-hidden="true">›</span>';
    tusYaz(b);
    b.addEventListener('click', function () {
      if (girisli()) { niyetSil(); ac({ tahta: true }); return; }
      /* ÖNCE GİRİŞ: kamera açılmaz; giriş bitince kendiliğinden açılır */
      niyetYaz();
      tusYaz(b);
      try {
        var g = m.querySelector('input[type="email"], input[type="text"]');
        if (g && g.offsetParent) g.focus({ preventScroll: false });
      } catch (e) { }
    });
    if (bas && bas.nextSibling) kap.insertBefore(b, bas.nextSibling);
    else kap.insertBefore(b, kap.firstChild);
    return true;
  }

  /* ------------------------------------- kenar menü: Akıllı tahtayı bağla */
  function baglaKur() {
    if (!mobilMi()) return true;
    var t = $('tab-tahta');
    if (!t || !t.parentNode) return false;
    var b = $('tab-tahta-bagla');
    if (!b) {
      b = document.createElement('a');
      b.href = '#';
      b.id = 'tab-tahta-bagla';
      b.title = 'Akıllı tahtayı bağla';
      b.setAttribute('aria-label', 'Akıllı tahtayı bağla — tahtadaki karekodu okut');
      /* başlıktaki (tablette) görünüşü Tahtaya yansıt düğmesininki gibi */
      b.setAttribute('style', (t.getAttribute('style') || '').replace(/(^|;)\s*display\s*:[^;]*/i, '$1'));
      b.innerHTML = SIM_BAGLA + '<span class="kc-ad">Akıllı tahtayı bağla</span>';
      b.addEventListener('click', function (e) {
        e.preventDefault();
        ac({ tahta: true });
      });
      t.parentNode.insertBefore(b, t);
      var esle = function () {
        /* Tahtaya yansıt düğmesiyle birlikte görünür: giriş yapmış öğretmen */
        var gor = t.style.display !== 'none' && girisli();
        b.style.display = gor ? 'inline-flex' : 'none';
      };
      esle();
      if (window.MutationObserver) new MutationObserver(esle).observe(t, { attributes: true, attributeFilter: ['style'] });
      setInterval(esle, 2000);
    }
    return true;
  }

  /* ------------------------------------------------------------ okuyucu */
  var K = null;          /* { akis, iz, bd, zaman, bitti, tuval, ctx } */

  function katmanKur() {
    stilKur();
    var k = $('kkoKatman');
    if (k) return k;
    k = document.createElement('div');
    k.id = 'kkoKatman';
    k.hidden = true;
    k.setAttribute('role', 'dialog');
    k.setAttribute('aria-modal', 'true');
    k.setAttribute('aria-label', 'Karekodu okut');
    k.innerHTML =
      '<video id="kkoVideo" playsinline muted autoplay></video>' +
      '<div class="kko-ust"><b id="kkoBaslik">Karekodu okut</b><button type="button" class="kko-kapat" id="kkoKapat" aria-label="Kapat">&times;</button></div>' +
      '<div class="kko-vizor"><span class="kko-kose k1"></span><span class="kko-kose k2"></span>' +
      '<span class="kko-kose k3"></span><span class="kko-kose k4"></span><span class="kko-cizgi"></span></div>' +
      '<div class="kko-alt"><div class="kko-yazi" id="kkoYazi">Karekodu çerçevenin içine getir</div>' +
      '<div class="kko-tuslar">' +
      '<button type="button" id="kkoFener" hidden>' + SIM_FENER + 'Fener</button>' +
      '<label id="kkoFotoEt">' + SIM_FOTO + 'Fotoğraf çek<input type="file" id="kkoFoto" accept="image/*" capture="environment" hidden></label>' +
      '<button type="button" id="kkoTahtaAcik" hidden>' + SIM_TAHTA + 'Tahtam zaten açık</button>' +
      '</div></div>';
    document.body.appendChild(k);
    $('kkoKapat').addEventListener('click', function () { niyetSil(); kapat(); });
    $('kkoTahtaAcik').addEventListener('click', function () {
      /* tahta zaten girişli: karekod yok, Tahtaya yansıt paneli */
      niyetSil();
      kapat();
      try { if (window.KidefTahtaGir) window.KidefTahtaGir.ac(); } catch (e) { }
    });
    $('kkoFoto').addEventListener('change', fotoOku);
    $('kkoFener').addEventListener('click', fener);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && K) { niyetSil(); kapat(); } });
    return k;
  }
  function yazi(m, uyari) {
    var y = $('kkoYazi');
    if (!y) return;
    y.textContent = m;
    y.classList.toggle('uyari', !!uyari);
  }

  function jsqrYukle() {
    return new Promise(function (ok, hata) {
      if (window.jsQR) return ok();
      var s = document.createElement('script');
      s.src = JSQR;
      s.onload = function () { window.jsQR ? ok() : hata(new Error('jsqr')); };
      s.onerror = function () { hata(new Error('jsqr')); };
      document.head.appendChild(s);
    });
  }
  /* Tarayıcının kendi tanıyıcısı varsa onu, yoksa jsQR'ı kullan */
  function okuyucuHazirla() {
    if (K.bd !== undefined) return Promise.resolve();
    var dene = Promise.resolve(null);
    try {
      if ('BarcodeDetector' in window && window.BarcodeDetector.getSupportedFormats) {
        dene = window.BarcodeDetector.getSupportedFormats().then(function (f) {
          return (f || []).indexOf('qr_code') >= 0 ? new window.BarcodeDetector({ formats: ['qr_code'] }) : null;
        }).catch(function () { return null; });
      }
    } catch (e) { }
    return dene.then(function (bd) {
      if (!K) return;
      K.bd = bd;
      if (!bd) return jsqrYukle();
    });
  }

  function ac(secenek) {
    katmanKur();
    if (K) kapat();
    var tahta = !!(secenek && secenek.tahta);
    K = { bd: undefined, bitti: false, tahta: tahta };
    var k = $('kkoKatman');
    k.classList.remove('kko-tamam');
    k.hidden = false;
    $('kkoFener').hidden = true;
    $('kkoBaslik').textContent = tahta ? 'Akıllı tahtayı bağla' : 'Karekodu okut';
    /* "Tahtam zaten açık": yalnız giriş yapmış öğretmende (Tahtaya yansıt düğmesi görünüyorsa) */
    var tt = $('tab-tahta');
    $('kkoTahtaAcik').hidden = !(tahta && girisli() && window.KidefTahtaGir && tt && tt.style.display !== 'none');
    yazi('Kamera açılıyor…');
    try { document.documentElement.style.overflow = 'hidden'; } catch (e) { }
    okuyucuHazirla().catch(function () { });
    if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      yazi('Bu tarayıcı kamerayı sayfanın içinde açamıyor. "Fotoğraf çek"e dokun, karekodun fotoğrafını çek.', true);
      return;
    }
    var iste = function (k2) { return navigator.mediaDevices.getUserMedia({ audio: false, video: k2 }); };
    iste({ facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } })
      .catch(function (e) {
        if (e && (e.name === 'OverconstrainedError' || e.name === 'NotFoundError')) return iste(true);
        throw e;
      })
      .then(function (akis) {
        if (!K) { akis.getTracks().forEach(function (t) { t.stop(); }); return; }
        K.akis = akis;
        var v = $('kkoVideo');
        v.srcObject = akis;
        var p = v.play();
        if (p && p.catch) p.catch(function () { });
        try {
          var iz = akis.getVideoTracks()[0];
          K.iz = iz;
          var y = iz && iz.getCapabilities ? iz.getCapabilities() : {};
          if (y && y.torch) $('kkoFener').hidden = false;
        } catch (e) { }
        yazi(K.tahta ? 'Tahtadaki giriş karekodunu çerçevenin içine getir' : 'Karekodu çerçevenin içine getir');
        return okuyucuHazirla().then(function () { tara(); });
      })
      .catch(function (e) {
        if (!K) return;
        var n = (e && e.name) || '';
        if (n === 'NotAllowedError' || n === 'SecurityError') {
          yazi('Kamera izni verilmedi. Adres çubuğundaki simgeden kameraya izin ver ya da "Fotoğraf çek"e dokun.', true);
        } else if (n === 'NotFoundError') {
          yazi('Kamera bulunamadı. "Fotoğraf çek" ile dene.', true);
        } else if (n === 'NotReadableError') {
          yazi('Kamera başka bir uygulamada açık. Onu kapatıp yeniden dene ya da "Fotoğraf çek"e dokun.', true);
        } else {
          yazi('Kamera açılamadı. "Fotoğraf çek" ile dene.', true);
        }
      });
  }

  function kapat() {
    if (K) {
      K.bitti = true;
      clearTimeout(K.zaman);
      try { if (K.akis) K.akis.getTracks().forEach(function (t) { t.stop(); }); } catch (e) { }
    }
    K = null;
    var v = $('kkoVideo');
    if (v) { try { v.pause(); } catch (e) { } v.srcObject = null; }
    var k = $('kkoKatman');
    if (k) k.hidden = true;
    var f = $('kkoFoto');
    if (f) f.value = '';
    try { document.documentElement.style.overflow = ''; } catch (e) { }
  }

  /* Kameradan sürekli okuma: tanıyıcı varsa doğrudan, yoksa küçültülmüş kare */
  function tara() {
    if (!K || K.bitti) return;
    var v = $('kkoVideo');
    var sonra = function () { if (K && !K.bitti) K.zaman = setTimeout(tara, 140); };
    if (!v || v.readyState < 2 || !v.videoWidth) return sonra();
    if (K.bd) {
      K.bd.detect(v).then(function (L) {
        if (L && L.length && L[0].rawValue) bulundu(L[0].rawValue); else sonra();
      }).catch(sonra);
      return;
    }
    if (!window.jsQR) return sonra();
    var r = kareOku(v, v.videoWidth, v.videoHeight, 800);
    if (r) bulundu(r); else sonra();
  }
  function kareOku(kaynak, w, h, enCok) {
    if (!K) K = { bitti: false };
    if (!K.tuval) { K.tuval = document.createElement('canvas'); K.ctx = K.tuval.getContext('2d', { willReadFrequently: true }); }
    var o = Math.min(1, enCok / Math.max(w, h));
    var cw = Math.max(1, Math.round(w * o)), ch = Math.max(1, Math.round(h * o));
    K.tuval.width = cw; K.tuval.height = ch;
    K.ctx.drawImage(kaynak, 0, 0, cw, ch);
    var d = K.ctx.getImageData(0, 0, cw, ch);
    var s = window.jsQR(d.data, cw, ch, { inversionAttempts: 'attemptBoth' });
    return s && s.data ? s.data : '';
  }

  /* Fotoğraftan okuma (kamera sayfada açılamazsa) */
  function fotoOku(e) {
    var dosya = e.target.files && e.target.files[0];
    if (!dosya) return;
    if (!K) K = { bd: undefined, bitti: false };
    yazi('Fotoğraf okunuyor…');
    var url = URL.createObjectURL(dosya);
    var im = new Image();
    im.onload = function () {
      okuyucuHazirla().then(function () {
        if (K && K.bd) {
          return K.bd.detect(im).then(function (L) { return (L && L.length && L[0].rawValue) || ''; });
        }
        return kareOku(im, im.naturalWidth, im.naturalHeight, 1400);
      }).then(function (r) {
        URL.revokeObjectURL(url);
        if (r) bulundu(r);
        else yazi('Bu fotoğrafta karekod bulunamadı. Karekodu ortalayıp yakından yeniden çek.', true);
      }).catch(function () {
        URL.revokeObjectURL(url);
        yazi('Fotoğraf okunamadı. Yeniden dene.', true);
      });
    };
    im.onerror = function () { URL.revokeObjectURL(url); yazi('Fotoğraf açılamadı. Yeniden dene.', true); };
    im.src = url;
    e.target.value = '';
  }

  function fener() {
    if (!K || !K.iz) return;
    var b = $('kkoFener'), ac2 = !b.classList.contains('on');
    K.iz.applyConstraints({ advanced: [{ torch: ac2 }] }).then(function () {
      b.classList.toggle('on', ac2);
    }).catch(function () { b.hidden = true; });
  }

  /* Okunan yazı bu sitenin bağlantısı mı? Değilse açılmaz. */
  function siteAdresi(t) {
    var u;
    try { u = new URL(String(t).trim(), location.href); } catch (e) { return null; }
    if (!/^https?:$/.test(u.protocol)) return null;
    if (u.host === location.host || SITELER.test(u.hostname)) return u;
    return null;
  }
  function bulundu(t) {
    if (!K || K.bitti) return;
    var u = siteAdresi(t);
    if (!u) {
      var ad = '';
      try { ad = new URL(String(t).trim()).hostname; } catch (e) { }
      yazi('Bu karekod Kidef Arapça\'ya ait değil' + (ad ? ' (' + ad + ')' : '') + ', açılmadı.', true);
      K.zaman = setTimeout(function () { if (K && !K.bitti) { yazi('Karekodu çerçevenin içine getir'); tara(); } }, 2600);
      return;
    }
    K.bitti = true;
    niyetSil();
    try { if (navigator.vibrate) navigator.vibrate(60); } catch (e) { }
    var k = $('kkoKatman');
    if (k) k.classList.add('kko-tamam');
    yazi(/[?&]qr=/.test(u.search) ? 'Okundu — onay ekranı açılıyor…' : 'Okundu — açılıyor…');
    setTimeout(function () {
      try { if (K && K.akis) K.akis.getTracks().forEach(function (tt) { tt.stop(); }); } catch (e) { }
      location.href = u.href;
    }, 250);
  }

  /* ------------------------------------------------------------ kurulum */
  function kur() {
    var n = 0, z = setInterval(function () {
      var a = tusKur(), b = baglaKur();
      if ((a && b) || ++n > 40) clearInterval(z);
    }, 250);
    if (!mobilMi()) return;
    /* giriş tamamlanınca bekleyen "önce giriş, sonra kamera" niyeti */
    var m = 0, y = setInterval(function () {
      var f = null;
      try { f = window.firebase && firebase.auth && firebase.auth(); } catch (e) { }
      if (f && f.onAuthStateChanged) {
        clearInterval(y);
        f.onAuthStateChanged(function (u) {
          var t = document.querySelector('#login-modal .kko-tus');
          if (t) tusYaz(t);
          if (u && !u.isAnonymous) niyetiYerineGetir();
        });
      } else if (++m > 80) clearInterval(y);
    }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
  else kur();

  window.KidefKarekodOkut = { ac: ac, kapat: kapat, mobilMi: mobilMi };
})();
