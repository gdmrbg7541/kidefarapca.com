/* =====================================================================
   KİDEF · SINIFLAR GİRİŞLE AÇILIR              (sistem/oturumkapi.js)
   ---------------------------------------------------------------------
   Öğretmen (18.10.2026): "çıkış yapıldığı gibi okul svg'si kapansın ve
   sınıflarımda öğrencilere, sınıflara ulaşılamasın ve giriş yapılması
   beklensin."

   07.10'daki "çıkıştan sonra salt görünüm" kaldırıldı: sınıflar, öğrenci
   listeleri ve okul penceresi artık yalnız GİRİŞ YAPMIŞ ve öğretmense
   YÖNETİCİ ONAYLI hesapta açılıyor.
     · Çıkış yapılınca: açık okul penceresi ve sınıf seçici kapanır, okul
       sekmesi kendini kapatır; sınıf listesi (Listelerim) kapanır,
       anasayfaya dönülür; Sınıflarım kategorisi kapanıp giriş davetine
       döner (sistem/siniflarim.js).
     · Sınıf sekmesi (index.html?sinif=…) açıkken çıkış yapılırsa ya da
       adres girişsiz açılırsa liste yerine "Giriş bekleniyor" ekranı
       çıkar. Giriş yapılınca sekme kendini yeniler, sınıf yeniden açılır.
     · Onay bekleyen ya da reddedilen öğretmen hesabı da girişsiz sayılır
       (onay perdesi: sistem/erisim.js).
   Tarayıcıdaki kopya (schoolData) SİLİNMEZ: girişte buluttan tazelenir,
   çevrimdışı yapılmış bir değişiklik kaybolmaz — yalnız ekrana gelmez.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefOturumKapi) return;

  var BEKLE_ID = 'okGirisBekle';
  var durum = { bilindi: false, uid: null, bekliyor: false };

  function kullanici() {
    try {
      var u = window.firebase && firebase.auth && firebase.auth().currentUser;
      return (u && !u.isAnonymous) ? u : null;
    } catch (e) { return null; }
  }
  /* onay bekleyen / reddedilen öğretmen (perdesi erisim.js'te) */
  function onaysiz() {
    try {
      var E = window.KidefErisim;
      return !!(E && E._rol === 'teacher' && typeof E.onayKarar === 'function' && !E.onayKarar('teacher', E._onay));
    } catch (e) { return false; }
  }
  function yetkili() { return !!kullanici() && !onaysiz(); }
  function prm(ad) { try { return new URLSearchParams(location.search).get(ad); } catch (e) { return null; } }
  function sinifSekmesi() { return !!(prm('sinif') && prm('sube')); }
  function okulSekmesi() { return prm('okul') === '1'; }
  function gorunum() { try { return (typeof appState !== 'undefined' && appState) ? appState.currentView : ''; } catch (e) { return ''; } }

  /* ---------------------------------------------------- KAPATMALAR */
  function okulKapat() {
    try {
      var p = document.getElementById('llOkulPopup');
      var sn = document.getElementById('siniflarim');
      /* Sınıflarım'ın içindeki panel bu pencere değil: kendisi davete döner */
      if (p && !(sn && sn.contains(p)) && typeof window.llOkulPopupKapat === 'function') window.llOkulPopupKapat();
    } catch (e) { }
    try { if (document.getElementById('llSinifSec') && typeof window.llSinifListesiKapat === 'function') window.llSinifListesiKapat(); } catch (e) { }
  }
  function listeKapat() {
    try { var r = document.getElementById('ll-root'); if (r) r.classList.remove('logged-in'); } catch (e) { }
    if (sinifSekmesi() || okulSekmesi()) return;          /* o sekmeleri bekleme ekranı karşılar */
    try {
      if (gorunum() === 'listelerim-section' && typeof window.changeView === 'function') window.changeView('home-hub-section');
    } catch (e) { }
  }
  function temizle() {
    okulKapat();
    listeKapat();
    try { if (window.KidefSiniflarim && typeof KidefSiniflarim.ciz === 'function') KidefSiniflarim.ciz(); } catch (e) { }
    /* okul sekmesi: pencere kapanınca sekme kendini kapatır ya da ana
       sayfaya döner (sistem/sinifbag.js) — orada da Sınıflarım giriş daveti */
    if (sinifSekmesi()) bekleGoster();
  }

  /* ------------------------------------------ GİRİŞ BEKLENİYOR EKRANI */
  function stilKur() {
    if (document.getElementById('okGirisBekleStil')) return;
    var s = document.createElement('style');
    s.id = 'okGirisBekleStil';
    s.textContent = [
      '#' + BEKLE_ID + '{ position:fixed; inset:0; z-index:100000000; display:flex;',
      '  align-items:center; justify-content:center; padding:20px; box-sizing:border-box;',
      '  background:linear-gradient(135deg,#F2FBF8 0%,#EAF6F3 100%); font-family:inherit; }',
      '#' + BEKLE_ID + ' .okb-kart{ width:min(480px,100%); background:#fff; border-radius:20px;',
      '  border:1.5px solid #CFE7E0; padding:30px 26px 24px; text-align:center;',
      '  box-shadow:0 18px 50px rgba(14,124,102,.14); }',
      '#' + BEKLE_ID + ' .okb-ikon{ width:64px; height:64px; margin:0 auto 12px; display:block; }',
      '#' + BEKLE_ID + ' h2{ margin:0 0 8px; font-size:clamp(1.15rem,2.4vw,1.4rem); color:#0E7C66; }',
      '#' + BEKLE_ID + ' p{ margin:0 0 18px; color:#5A6B78; font-size:clamp(.92rem,1.6vw,1rem); line-height:1.55; }',
      '#' + BEKLE_ID + ' .okb-tus{ display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }',
      '#' + BEKLE_ID + ' button{ border:0; cursor:pointer; font-family:inherit; font-weight:800;',
      '  font-size:1rem; border-radius:12px; padding:12px 24px; }',
      '#' + BEKLE_ID + ' .okb-giris{ background:#16A085; color:#fff; box-shadow:0 6px 16px rgba(22,160,133,.28); }',
      '#' + BEKLE_ID + ' .okb-giris:hover{ background:#0E7C66; }',
      '#' + BEKLE_ID + ' .okb-don{ background:#EDF1F6; color:#4A5A6B; }',
      '#' + BEKLE_ID + ' .okb-don:hover{ background:#E1E7EF; }'
    ].join('\n');
    (document.head || document.documentElement).appendChild(s);
  }
  var KILIT_SVG =
    '<svg class="okb-ikon" viewBox="0 0 48 48" aria-hidden="true">' +
    '<circle cx="24" cy="24" r="23" fill="#EAF6F3"/>' +
    '<rect x="13" y="21" width="22" height="16" rx="3.4" fill="#16A085"/>' +
    '<path d="M17.6 21v-4.2a6.4 6.4 0 0 1 12.8 0V21" fill="none" stroke="#0E7C66" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="24" cy="28.4" r="2.4" fill="#fff"/><path d="M24 30v3" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
  function bekleGoster() {
    if (document.getElementById(BEKLE_ID)) return;
    if (!document.body) { document.addEventListener('DOMContentLoaded', bekleGoster); return; }
    stilKur();
    var k = document.createElement('div');
    k.id = BEKLE_ID;
    k.setAttribute('role', 'dialog');
    k.setAttribute('aria-modal', 'true');
    var bekleyen = !!kullanici() && onaysiz();
    k.innerHTML =
      '<div class="okb-kart">' + KILIT_SVG +
      '<h2>' + (bekleyen ? 'Hesabın onay bekliyor' : 'Giriş yapılması bekleniyor') + '</h2>' +
      '<p>' + (bekleyen
        ? 'Sınıfların ve öğrenci listelerin yönetici onayından sonra açılır.'
        : 'Oturum kapalı. Sınıflarını ve öğrenci listelerini görmek için giriş yap; giriş yapınca bu sekme kendiliğinden açılır.') + '</p>' +
      '<div class="okb-tus">' +
      (bekleyen ? '' : '<button type="button" class="okb-giris">Giriş yap</button>') +
      '<button type="button" class="okb-don">Ana sayfa</button>' +
      '</div></div>';
    document.body.appendChild(k);
    var g = k.querySelector('.okb-giris');
    if (g) g.addEventListener('click', function () {
      try { if (typeof window.showLoginModal === 'function') window.showLoginModal(); } catch (e) { }
    });
    k.querySelector('.okb-don').addEventListener('click', anaSayfa);
    durum.bekliyor = true;
  }
  function bekleKaldir() {
    var k = document.getElementById(BEKLE_ID);
    if (k && k.parentNode) k.parentNode.removeChild(k);
    durum.bekliyor = false;
  }
  /* sekme siteden açıldıysa kapanır, alttaki sekme görünür; yoksa ana sayfa */
  function anaSayfa() {
    try { if (window.opener && !window.opener.closed) { window.close(); } } catch (e) { }
    setTimeout(function () {
      if (window.closed) return;
      try { location.href = location.pathname; } catch (e) { location.href = 'index.html'; }
    }, 250);
  }

  /* --------------------------------------------------------- KARAR */
  function denetle() {
    if (!durum.bilindi) return;
    if (yetkili()) {
      if (durum.bekliyor) {
        /* giriş yapıldı (ya da onay geldi): sekme baştan, yeni oturumla açılır */
        bekleKaldir();
        if (sinifSekmesi() || okulSekmesi()) { try { location.reload(); } catch (e) { } }
      }
      return;
    }
    temizle();
  }

  function baglan() {
    try {
      if (!(window.firebase && firebase.auth && firebase.apps && firebase.apps.length)) return false;
      firebase.auth().onAuthStateChanged(function (u) {
        var yeni = (u && !u.isAnonymous) ? u.uid : null;
        var degisti = durum.bilindi && durum.uid && durum.uid !== yeni;
        durum.bilindi = true;
        durum.uid = yeni;
        if (!yeni || degisti) temizle();
        else denetle();
      });
      return true;
    } catch (e) { return false; }
  }
  if (!baglan()) {
    var n = 0, t = setInterval(function () { if (baglan() || ++n > 80) clearInterval(t); }, 150);
  }

  /* Okul penceresi girişsiz açılmaz (okul sekmesi adresle açılsa bile) */
  function okulSar() {
    if (typeof window.llOkulPopupAc !== 'function' || window.llOkulPopupAc.__ok) return;
    var eski = window.llOkulPopupAc;
    var yeni = function () {
      if (durum.bilindi && !yetkili()) {
        if (!sinifSekmesi() && !okulSekmesi() && !onaysiz()) {
          try { if (typeof window.showLoginModal === 'function') window.showLoginModal(); } catch (e) { }
        }
        return;
      }
      return eski.apply(this, arguments);
    };
    yeni.__ok = 1;
    window.llOkulPopupAc = yeni;
  }
  okulSar();

  /* Çıkış tuşu: bulut cevabını beklemeden, ANINDA */
  function cikisSar() {
    if (typeof window.cikisYap !== 'function' || window.cikisYap.__ok) return;
    var eski = window.cikisYap;
    var yeni = function () {
      try { temizle(); } catch (e) { }
      return eski.apply(this, arguments);
    };
    yeni.__ok = 1;
    window.cikisYap = yeni;
  }
  cikisSar();
  window.addEventListener('load', function () { cikisSar(); okulSar(); });

  /* Nabız: onay sonradan gelirse / gider ise, sekme içinde başka yoldan
     liste açılırsa (geri tuşu vb.) kapı yine doğru dursun. */
  setInterval(function () {
    cikisSar(); okulSar();
    if (!durum.bilindi) return;
    if (!yetkili()) {
      if (sinifSekmesi() && !durum.bekliyor) bekleGoster();
      var r = document.getElementById('ll-root');
      if ((r && r.classList.contains('logged-in')) || gorunum() === 'listelerim-section' ||
          (document.getElementById('llOkulPopup') && !(document.getElementById('siniflarim') || { contains: function () { return false; } }).contains(document.getElementById('llOkulPopup')))) {
        temizle();
      }
    } else if (durum.bekliyor) denetle();
  }, 1000);

  window.KidefOturumKapi = { yetkili: yetkili, temizle: temizle, denetle: denetle };
})();
