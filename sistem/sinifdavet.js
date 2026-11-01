/* =====================================================================
   KIDEF · SINIF DAVETİ                            (sistem/sinifdavet.js)
   ---------------------------------------------------------------------
                                                            01.11.2026
   Öğretmen: "sadece sitede sınıf eklemeyen öğretmenlere bi bildirim
   gösterilsin, sınıf oluştururlarsa nasıl özelliklerden istifade
   edebileceklerini öğrensinler" — seçim: köşede küçük kart, «Sonra»
   deyince 3 gün çıkmaz, sınıf eklenince bir daha hiç çıkmaz.

   KİME: girişli, ONAYLI ÖĞRETMEN (yönetici, onay bekleyen, öğrenci,
   misafir görmez); hesabın sınıf verisi buluttan geldikten sonra
   (hesap/listelerim.js → window._llBulutGeldi === uid) hiç sınıfı yoksa
   (data.levels'ta sınıf yok — sistem/ihgorunum.js'teki ölçü). Yeni
   cihazda sınıflar inene kadar sınıfı olan öğretmene yanlış kart çıkmaz.
   NE ZAMAN: ana sayfa açıkken, sayfa açıldıktan birkaç saniye sonra;
   başka bir pencere ya da kart (destek hatırlatması, akıllı tahta
   penceresi, giriş…) açıkken çıkmaz, sonradan biri açılırsa kart çekilir
   (sol alt köşeyi destek hatırlatmasıyla paylaşıyor).
   «Sınıf ekle» → Sınıflarım'daki ekleme satırına iner
   (KidefSiniflarim.sinifEkle); kart 1 gün çıkmaz, sınıf eklenmişse hiç.
   «Sonra» ya da × → bu tarayıcıda o hesap için 3 gün çıkmaz:
   localStorage kidefSinifDavet = { <uid>: <yeniden çıkabileceği an> }.
   Tahta kabuğunun çerçevesinde (tahta.html) çalışmaz.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefSinifDavet) return;
  try {
    if (window.name === 'kidefTahta' || (window.parent !== window && window.parent.KidefTahta)) {
      window.KidefSinifDavet = { kontrol: function () { } };
      return;
    }
  } catch (e) { }

  var ANAHTAR = 'kidefSinifDavet';
  var GUN = 864e5, SONRA = 3 * GUN, EKLE_SONRA = GUN;
  var ILK_BEKLE = 5000;
  var yuklendi = Date.now();

  function $(id) { return document.getElementById(id); }
  function kd(k, tr) {
    try { if (window.KidefDil && window.KidefDil.metin) { var m = window.KidefDil.metin(k, tr); if (m != null) return m; } } catch (e) { }
    return tr;
  }
  function oturum() {
    try { var u = window.firebase && firebase.auth && firebase.auth().currentUser; return (u && !u.isAnonymous) ? u : null; } catch (e) { return null; }
  }
  /* yalnız ONAYLI öğretmen: bu hesabın rol önbelleği (sistem/rol.js — rol ve onay; yönetici,
     onay bekleyen ve reddedilen öğretmende ogretmen/rol tutmaz). Önbellek yoksa kart çıkmaz. */
  function onayliOgretmen(u) {
    try {
      var o = (window.KidefRol && KidefRol.onbellekOku) ? KidefRol.onbellekOku(u.uid) : null;
      if (!o || o.rol !== 'teacher' || !o.ogretmen) return false;
    } catch (e) { return false; }
    try {
      if (typeof appState !== 'undefined' && appState && appState.userRole && appState.userRole !== 'teacher') return false;
    } catch (e) { }
    return true;
  }
  function sinifVar() {
    try {
      var d = (typeof data !== 'undefined' && data) ? data : (window.data || null);   /* hesap/listelerim.js */
      if (!d || !d.levels) return false;
      return Object.keys(d.levels).some(function (l) {
        var c = d.levels[l] && d.levels[l].classes;
        return !!(c && Object.keys(c).length);
      });
    } catch (e) { return false; }
  }
  function anaSayfa() {
    try {
      if (typeof appState !== 'undefined' && appState && appState.currentView && appState.currentView !== 'home-hub-section') return false;
    } catch (e) { }
    var ev = $('home-hub-section');
    return !!(ev && ev.getClientRects().length);
  }
  function baskaPencere() {
    return !!document.querySelector('#dstHatirlat, #dstOrt, .kh-perde, #thgPerde, #kdtSahne, #cihPencere, #qrPerde') ||
      (function () { var l = $('login-modal'); return !!(l && getComputedStyle(l).display !== 'none' && l.getClientRects().length); })();
  }
  function bekleme() {
    try { return JSON.parse(localStorage.getItem(ANAHTAR) || '{}') || {}; } catch (e) { return {}; }
  }
  function ertele(uid, ms) {
    var b = bekleme();
    b[uid] = Date.now() + ms;
    try { localStorage.setItem(ANAHTAR, JSON.stringify(b)); } catch (e) { }
  }

  /* --------------------------------------------------------------- stil */
  var STIL = [
    '#sdvKart{position:fixed;left:16px;bottom:16px;z-index:9000;width:min(410px,calc(100% - 32px));box-sizing:border-box;',
    ' display:flex;gap:12px;align-items:flex-start;padding:16px 16px 14px;border-radius:18px;background:#fff;color:#1F2430;',
    ' border:1.5px solid #CDEBE2;box-shadow:0 18px 44px rgba(15,42,67,.22);font-family:inherit;animation:sdvGir .35s cubic-bezier(.22,1,.36,1)}',
    '@keyframes sdvGir{from{opacity:0;transform:translateY(16px)}}',
    '#sdvKart .sdv-ikon{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:#E8F6F2}',
    '#sdvKart .sdv-ikon svg{width:30px;height:30px}',
    '#sdvKart .sdv-ic{flex:1;min-width:0}',
    '#sdvKart b.sdv-bas{display:block;margin:2px 30px 4px 0;font-size:1.02rem;line-height:1.3;color:#0E5E4E}',
    '#sdvKart p{margin:0 0 8px;font-size:.86rem;line-height:1.45;color:#5B6471}',
    '#sdvKart ul{list-style:none;margin:0 0 12px;padding:0;display:flex;flex-direction:column;gap:7px}',
    '#sdvKart li{display:flex;gap:9px;align-items:flex-start;font-size:.84rem;line-height:1.4;color:#3B434E}',
    '#sdvKart li svg{flex:none;width:18px;height:18px;margin-top:1px;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '#sdvKart li b{color:#1F2430}',
    '#sdvKart .sdv-tus{display:flex;gap:8px;flex-wrap:wrap}',
    '#sdvKart .sdv-tus button{border:0;border-radius:11px;padding:9px 16px;font:inherit;font-size:.9rem;font-weight:800;cursor:pointer}',
    '#sdvKart .sdv-ekle{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#16A085,#0E7C66);color:#fff;',
    ' box-shadow:0 6px 16px rgba(14,124,102,.28)}',
    '#sdvKart .sdv-ekle svg{width:16px;height:16px}',
    '#sdvKart .sdv-ekle:hover{filter:brightness(1.06)}',
    '#sdvKart .sdv-sonra{background:#F1F5F9;color:#475569}',
    '#sdvKart .sdv-sonra:hover{background:#E2E8F0}',
    '#sdvKart .sdv-x{position:absolute;top:10px;right:10px;width:30px;height:30px;border:0;border-radius:50%;background:#F1F5F9;',
    ' color:#55636E;font-size:19px;line-height:30px;cursor:pointer}',
    '#sdvKart .sdv-x:hover{background:#E2E8F0}',
    '@media (max-width:480px){#sdvKart{left:12px;bottom:12px;width:calc(100% - 24px);padding:14px 13px 12px}#sdvKart .sdv-ikon{display:none}}',
    '@media (prefers-reduced-motion:reduce){#sdvKart{animation:none}}'
  ].join('\n');
  function stilKur() {
    if ($('sdvStil')) return;
    var s = document.createElement('style');
    s.id = 'sdvStil';
    s.textContent = STIL;
    (document.head || document.documentElement).appendChild(s);
  }
  var IKON = '<svg viewBox="0 0 32 32" aria-hidden="true">' +
    '<rect x="4" y="6" width="24" height="16" rx="2.5" fill="#fff" stroke="#16A085" stroke-width="2"/>' +
    '<path d="M9 11h9M9 15h6" stroke="#F39C12" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M12 22v4M20 22v4M9 26h14" stroke="#16A085" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="24" cy="9" r="5.2" fill="#16A085"/><path d="M24 6.6v4.8M21.6 9h4.8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>';
  function sim(renk, yol) { return '<svg viewBox="0 0 24 24" stroke="' + renk + '" aria-hidden="true">' + yol + '</svg>'; }
  var MADDE = [
    [sim('#16A085', '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15.5H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 18.5h15"/>'),
     'sdv.m1', '<b>Sınıf kitaplığı:</b> o sınıfın ders kitabı, yıllık ve günlük planı, belgeleri ve etkinlik kartları'],
    [sim('#F39C12', '<path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>'),
     'sdv.m2', '<b>Sınıf listesi:</b> okul no, kurayla seç, sınav ve performans listeleri'],
    [sim('#2563EB', '<circle cx="9" cy="8" r="3.4"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 11l2 2 4-4"/>'),
     'sdv.m3', '<b>Öğrencilerin:</b> öğretmen kodunla bağlanır; görev gönderirsin, sonuçları tek tabloda görürsün'],
    [sim('#7C3AED', '<rect x="4" y="3" width="15" height="18" rx="2"/><path d="M8 3v18M11 8h5M11 12h5"/>'),
     'sdv.m4', '<b>Sınıf defteri</b> ve sınıf raporu']
  ];
  var ARTI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>';

  function kartKur(uid) {
    stilKur();
    var k = document.createElement('div');
    k.id = 'sdvKart';
    k.setAttribute('role', 'dialog');
    k.setAttribute('aria-labelledby', 'sdvBaslik');
    k.setAttribute('data-uid', uid);
    k.innerHTML = '<span class="sdv-ikon">' + IKON + '</span><div class="sdv-ic">' +
      '<b class="sdv-bas" id="sdvBaslik">' + kd('sdv.baslik', 'Sınıfını ekle, sınıf araçların açılsın') + '</b>' +
      '<p>' + kd('sdv.alt', 'Sitede henüz sınıfın yok. Bir sınıf ekleyince:') + '</p><ul>' +
      MADDE.map(function (m) { return '<li>' + m[0] + '<span>' + kd(m[1], m[2]) + '</span></li>'; }).join('') + '</ul>' +
      '<div class="sdv-tus"><button type="button" class="sdv-ekle" data-sdv="ekle">' + ARTI + '<span>' + kd('sdv.ekle', 'Sınıf ekle') + '</span></button>' +
      '<button type="button" class="sdv-sonra" data-sdv="sonra">' + kd('sdv.sonra', 'Sonra') + '</button></div></div>' +
      '<button type="button" class="sdv-x" data-sdv="sonra" aria-label="' + kd('g.kapat', 'Kapat') + '">&times;</button>';
    k.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('[data-sdv]') : null;
      if (!t) return;
      var is = t.getAttribute('data-sdv');
      kaldir();
      if (is === 'sonra') { ertele(uid, SONRA); return; }
      ertele(uid, EKLE_SONRA);
      try { if (window.KidefSiniflarim && KidefSiniflarim.sinifEkle) KidefSiniflarim.sinifEkle(); } catch (x) { }
    });
    document.body.appendChild(k);
  }
  function kaldir() { var k = $('sdvKart'); if (k) k.parentNode.removeChild(k); }

  function kontrol() {
    var k = $('sdvKart'), u = oturum();
    var uygun = !!(u && onayliOgretmen(u) && window._llBulutGeldi === u.uid && !sinifVar() && anaSayfa());
    if (k) {
      /* sınıf eklendi, çıkış yapıldı, sayfa değişti ya da başka pencere açıldı: kart çekilir */
      if (!uygun || k.getAttribute('data-uid') !== u.uid || baskaPencere()) kaldir();
      return;
    }
    if (!uygun || Date.now() - yuklendi < ILK_BEKLE || baskaPencere()) return;
    if ((+bekleme()[u.uid] || 0) > Date.now()) return;
    kartKur(u.uid);
  }
  setInterval(kontrol, 2000);
  setTimeout(kontrol, ILK_BEKLE + 100);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && $('sdvKart') && !baskaPencere()) { var u = oturum(); kaldir(); if (u) ertele(u.uid, SONRA); }
  });
  window.KidefSinifDavet = { kontrol: kontrol };
})();
