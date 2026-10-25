/* =====================================================================
   KIDEF · TAHTAYA YANSIT — ana sayfa düğmesi ve paneli    sistem/tahtagir.js
   ---------------------------------------------------------------------
                                                            17.10.2026
   Öğretmen: "sadece site için çalışsa yeter, sadece çok pratik olsun,
   mümkün olduğu kadar gecikme az olsun ... index te güzel bi arayüz
   ekleyelim".

   · Başlıktaki "Tahta" düğmesi (yalnız giriş yapmış öğretmen/yönetici)
     paneli açar: "Bu bilgisayardan yansıt" (tahta.html?rol=yansit) ya da
     "Bu cihaz tahta" (tahta.html?rol=izle). Panel canlı durumu da gösterir
     (tahtan bağlı mı, bilgisayarın yansıtıyor mu).
   · Tahta olarak kullanılan cihaz bunu hatırlar (localStorage
     kidef_tahta_cihaz = 'tahta'): ana sayfası açık dururken bilgisayarda
     yansıtma başlarsa HEMEN tahta görünümüne geçer — tahtaya hiç dokunmak
     gerekmez. (18.10.2026, öğretmen: "akıllı tahta olarak kullanılan
     cihazda geri sayım ve akıllı tahta veya bilgisayar olarak kullan
     ekranı çıkıyor buna hiç gerek yok": 5 saniyelik geri sayım sorusu
     kalktı; tahta cihazında başlıktaki düğme de seçim paneli açmadan
     doğrudan tahta görünümünü açar. Tahta görünümünden "Çık" ile
     ayrılınca aynı yansıtma sürdükçe geri dönülmez; yeni yansıtmada döner.
     "Bu cihaz tahta değil" bağlantısı tahta görünümünün bekleme ekranında.)
   · KUMANDA DÖNÜŞÜ (18.10.2026): bir dersin kumandası olan telefon/bilgisayar
     siteyi yeniden açınca (tarayıcı kapanmıştı, sekme gitti) ders tahtada hâlâ
     sürüyorsa ana sayfa kendiliğinden kumandaya döner, kaldığı yerden
     (tahtadaki sayfa geçmişiyle açılır; tahta yenilenmez). "Bitir" ile
     bitirilen derse dönülmez.
   · Canlı veritabanı (Firebase Realtime Database) yalnız gerektiğinde
     yüklenir: panel açılınca, cihaz tahta olarak işaretliyse ya da bu cihaz
     az önce bir dersin kumandasıysa.
   · SEÇİM PENCERESİ (21.10.2026) — öğretmen: "akıllı tahtaya dokununca iki
     seçenek çıksın ama tam sayfa olarak değil popup olarak: bu cihazı kumanda
     olarak kullan, ya da bu cihazı Sınıf Ekranı olarak kullan". Düğme artık
     her cihazda — Sınıf Ekranı olarak işaretli cihazda da — aynı küçük
     pencereyi açar; 18.10'daki "doğrudan tahta görünümü" kestirmesi kalktı.
     Kumandadan yansıtma başlayınca işaretli cihazın kendiliğinden geçmesi
     sürüyor (soruKontrol).
   · CİHAZ ARANIYOR (24.10.2026) — öğretmen: "kumandaya basınca aynı hesaptan
     giriş yapan 2. cihaz olmadıkça bu cihazı kumanda olarak kullan tuşu
     yeşil olmasın, cihaz aranıyor gibi bi yazı görünebilir". Kumanda
     seçeneği yalnız aynı hesabın başka bir cihazı Sınıf Ekranı olarak şu an
     hazırsa yeşil (Sınıf Ekranı sayfası açık — izle/ — ya da işaretli
     cihazda site açık — hazir/); tuşta «Cihaz aranıyor…» / «Cihaz bulundu».
     İşaretli cihaz site açıkken tahta/<uid>/hazir/<kimlik> yazar, bağlantı
     kopunca sunucu siler (onDisconnect).
   Motor ve veritabanı kuralı: sistem/tahta.js.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefTahtaGir) return;

  /* TAHTA KABUĞUNUN İÇİNDE HİÇBİR ŞEY YAPMA (17.10.2026) — öğretmen:
     "akıllı tahtada yansıtma açılmışken gereksiz yere bir süre sonra
     bildirim çıkıyor". tahta.html siteyi kidefTahta adlı çerçevede açar;
     tahtanın çerçevesindeki ana sayfa "Bilgisayarın yansıtıyor" sorusunu
     gösterip 5 saniye sonra kabuğun içinde ikinci bir kabuk açıyordu
     (bilgisayarda da "Tahta bağlandı" tekrar tekrar). Kabuğun kendi
     şeridi var: çerçevede düğme, panel ve soru yok. */
  var KABUKTA = (function () {
    try {
      if (window.name === 'kidefTahta') return true;
      return window.parent !== window && !!window.parent.KidefTahta;
    } catch (e) { return window.name === 'kidefTahta'; }
  })();
  if (KABUKTA) {
    window.KidefTahtaGir = { ac: function () { }, kapat: function () { }, kabukta: true };
    return;
  }

  /* sistem/tahta.js'teki adresle aynı olmalı */
  var VT_ADRES = 'https://kidefarapca-98f9c-default-rtdb.europe-west1.firebasedatabase.app';
  var SDK = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js';

  function $(id) { return document.getElementById(id); }
  function kd(k, tr, yer) {
    var m = (window.KidefDil && window.KidefDil.metin) ? window.KidefDil.metin(k, tr) : tr;
    if (!yer || m == null) return m;
    return String(m).replace(/\{([A-Za-z0-9_]+)\}/g, function (t, ad) {
      return Object.prototype.hasOwnProperty.call(yer, ad) ? String(yer[ad]) : t;
    });
  }
  function kac(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function kullanici() {
    try { var u = window.firebase && firebase.auth && firebase.auth().currentUser; return (u && !u.isAnonymous) ? u : null; } catch (e) { return null; }
  }
  function ogretmenMi() {
    if (!kullanici()) return false;
    try { if (typeof appState !== 'undefined' && appState && /^(teacher|admin)$/.test(appState.userRole || '')) return true; } catch (e) { }
    try {
      var r = JSON.parse(localStorage.getItem('kidefRolBilgi') || 'null');
      if (r && r.uid === kullanici().uid && (r.ogretmen || /^(teacher|admin)$/.test(r.rol || ''))) return true;
    } catch (e) { }
    return false;
  }
  function tahtaCihazi() { try { return localStorage.getItem('kidef_tahta_cihaz') === 'tahta'; } catch (e) { return false; } }
  function cihazYaz(v) { try { if (v) localStorage.setItem('kidef_tahta_cihaz', v); else localStorage.removeItem('kidef_tahta_cihaz'); } catch (e) { } }

  /* ------------------------------------------------------------ stil */
  var STIL = [
    '#thgPerde{position:fixed;inset:0;z-index:2500;background:rgba(15,42,67,.55);display:flex;align-items:center;justify-content:center;padding:16px;',
    ' backdrop-filter:blur(2px);animation:thgAc .18s ease}',
    '@keyframes thgAc{from{opacity:0}}',
    '#thgKutu{position:relative;width:min(680px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#fff;border-radius:22px;',
    ' box-shadow:0 24px 70px rgba(15,42,67,.35);padding:22px 24px 18px;color:#0f2a43;font-family:inherit}',
    '#thgKutu .thg-kapat{position:absolute;top:12px;right:12px;width:36px;height:36px;border:0;border-radius:50%;background:#f1f5f9;',
    ' color:#334155;font-size:20px;line-height:36px;cursor:pointer}',
    '#thgKutu .thg-kapat:hover{background:#e2e8f0}',
    '.thg-ust{display:flex;align-items:center;gap:16px;margin:0 40px 14px 0}',
    '.thg-ust svg{width:118px;height:auto;flex:none}',
    '.thg-ust h2{margin:0 0 4px;font-size:1.45rem;line-height:1.2}',
    '.thg-ust p{margin:0;color:#475569;font-size:.95rem;line-height:1.45}',
    '#thgKutu.thg-kucuk{width:min(470px,100%);box-sizing:border-box;padding:20px 20px 16px;border-radius:20px}',
    '.thg-kucuk .thg-ust{margin:0 36px 14px 0;gap:12px}',
    '.thg-logo{width:48px;height:48px;border-radius:14px;background:#e8f6f2;color:#0E7C66;display:grid;place-items:center;flex:none}',
    '.thg-logo svg{width:30px;height:30px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.thg-kucuk .thg-ust h2{font-size:1.3rem}',
    '.thg-secenekler{display:flex;flex-direction:column;gap:10px}',
    '.thg-sec{display:flex;align-items:center;gap:12px;width:100%;text-align:start;border:1.5px solid #e2e8f0;border-radius:16px;padding:12px;',
    ' background:#fbfdff;color:#0f2a43;font:inherit;cursor:pointer;transition:border-color .15s, box-shadow .15s, transform .15s}',
    '.thg-sec:hover,.thg-sec:focus-visible{border-color:#16A085;box-shadow:0 8px 22px rgba(22,160,133,.15);transform:translateY(-1px);outline:none}',
    '.thg-sec .thg-sim{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;flex:none;color:#fff;',
    ' background:linear-gradient(135deg,#16A085,#0E7C66);box-shadow:0 4px 12px rgba(14,124,102,.25)}',
    '.thg-sec.ikincil .thg-sim{background:#0f2a43;box-shadow:0 4px 12px rgba(15,42,67,.25)}',
    '.thg-sec .thg-sim svg{width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.thg-sec .thg-yazi{flex:1;min-width:0}',
    '.thg-sec b{display:block;font-size:1.02rem;line-height:1.25}',
    '.thg-sec small{display:block;color:#5b6b7c;font-size:.82rem;line-height:1.4;margin-top:3px}',
    '.thg-sec .thg-ok{width:18px;height:18px;flex:none;color:#94a3b8;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
    '.thg-kucuk .thg-tahtalar{margin:-2px 0 2px 16px;padding-inline-start:12px;border-inline-start:2px solid #cfe9e2}',
    '.thg-kucuk .thg-tahtalar[hidden]{display:none}',
    '.thg-secim{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '.thg-kart{border:1.5px solid #e2e8f0;border-radius:16px;padding:14px 14px 12px;display:flex;flex-direction:column;gap:6px;background:#fbfdff;',
    ' transition:border-color .15s, box-shadow .15s, transform .15s}',
    '.thg-kart:hover{border-color:#16A085;box-shadow:0 8px 22px rgba(22,160,133,.15);transform:translateY(-1px)}',
    '.thg-kart.secili{border-color:#16A085;background:#effaf6}',
    '.thg-kart .thg-sim{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:#e8f6f2;color:#0E7C66}',
    '.thg-kart .thg-sim svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.thg-kart h3{margin:2px 0 0;font-size:1.05rem}',
    '.thg-kart p{margin:0;color:#5b6b7c;font-size:.86rem;line-height:1.45;flex:1}',
    '.thg-dug{margin-top:6px;border:0;border-radius:11px;padding:11px 14px;font:inherit;font-weight:800;font-size:.95rem;color:#fff;cursor:pointer;',
    ' background:linear-gradient(135deg,#16A085,#0E7C66);box-shadow:0 4px 14px rgba(14,124,102,.28)}',
    '.thg-dug:hover{filter:brightness(1.06)}',
    '.thg-dug.ikincil{background:#0f2a43;box-shadow:0 4px 14px rgba(15,42,67,.25)}',
    '.thg-durum{margin-top:12px;display:flex;align-items:center;gap:8px;font-size:.88rem;color:#334155;background:#f8fafc;border-radius:12px;padding:9px 12px}',
    '.thg-nokta{width:10px;height:10px;border-radius:50%;background:#94a3b8;flex:none}',
    '.thg-nokta.canli{background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.25)}',
    '.thg-nokta.bekle{background:#f59e0b}',
    '.thg-not{margin:10px 2px 0;color:#64748b;font-size:.8rem;line-height:1.45}',
    '.thg-not a{color:#0E7C66;font-weight:700;cursor:pointer;text-decoration:underline}',
    '.thg-tahtalar{margin:4px 0 2px;display:flex;flex-direction:column;gap:6px}',
    '.thg-tahtalar .thg-bas{font-size:.78rem;font-weight:800;color:#64748b;letter-spacing:.3px;text-transform:uppercase}',
    '.thg-tahtalar label{display:flex;align-items:flex-start;gap:8px;padding:7px 9px;border:1.5px solid #e2e8f0;border-radius:10px;background:#fff;cursor:pointer;',
    ' font-size:.86rem;line-height:1.35;color:#0f2a43}',
    '.thg-tahtalar label:has(input:checked){border-color:#16A085;background:#effaf6}',
    '.thg-tahtalar input{margin:3px 0 0;accent-color:#16A085;flex:none}',
    '.thg-tahtalar b{display:block}',
    '.thg-tahtalar small{display:block;color:#5b6b7c;font-size:.78rem}',
    '.thg-tahtalar .thg-yok{font-size:.82rem;color:#64748b;background:#f8fafc;border-radius:10px;padding:8px 10px}',
    /* tek Sınıf Ekranı satırı; Sınıf Ekranı seçiliyken yeşil kumanda seçeneği; bildirim (21.10.2026) */
    '.thg-ekran{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:10px;background:#f8fafc;font-size:.86rem;line-height:1.35;color:#0f2a43}',
    '.thg-ekran .thg-nokta{margin-top:4px}',
    '.thg-ekran b{display:block}',
    '.thg-ekran small{display:block;color:#5b6b7c;font-size:.78rem}',
    '.thg-sec.vurgu{background:linear-gradient(135deg,#16A085,#0E7C66);border-color:#0E7C66;color:#fff;box-shadow:0 8px 22px rgba(14,124,102,.3)}',
    '.thg-sec.vurgu small{color:rgba(255,255,255,.88)}',
    '.thg-sec.vurgu .thg-sim{background:rgba(255,255,255,.2);box-shadow:none}',
    '.thg-sec.vurgu .thg-ok{color:#fff}',
    '.thg-sec.vurgu:hover,.thg-sec.vurgu:focus-visible{border-color:#0b6b58;box-shadow:0 10px 26px rgba(14,124,102,.38)}',
    /* cihaz aranıyor / bulundu satırı (24.10.2026) */
    '.thg-ara{display:flex;align-items:center;gap:8px;margin-top:7px;font-size:.8rem;font-weight:800;line-height:1.3;color:#64748b}',
    '.thg-ara:empty{display:none}',
    '.thg-radar{position:relative;width:12px;height:12px;flex:none;border-radius:50%;background:#94a3b8}',
    '.thg-radar::before,.thg-radar::after{content:"";position:absolute;inset:-6px;border-radius:50%;border:2px solid #94a3b8;opacity:0;',
    ' animation:thgRadar 1.8s ease-out infinite}',
    '.thg-radar::after{animation-delay:.9s}',
    '@keyframes thgRadar{0%{transform:scale(.35);opacity:.9}100%{transform:scale(1.15);opacity:0}}',
    '.thg-ara .thg-tik{width:16px;height:16px;flex:none;fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}',
    '.thg-sec.vurgu .thg-ara{color:#fff}',
    '.thg-ipucu{font-size:.8rem;line-height:1.4;color:#64748b;background:#f8fafc;border-radius:10px;padding:8px 10px}',
    '@media (prefers-reduced-motion:reduce){.thg-radar::before,.thg-radar::after{animation:none;opacity:.5;transform:scale(.8)}}',
    '#thgBildir{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2600;background:#0f2a43;color:#fff;border-radius:14px;',
    ' padding:12px 16px;font-family:inherit;font-weight:600;font-size:.92rem;line-height:1.4;box-shadow:0 16px 40px rgba(0,0,0,.3);',
    ' width:max-content;max-width:calc(100vw - 24px);box-sizing:border-box;text-align:center;animation:thgYuk .25s ease}',
    '#thgBildir[hidden]{display:none}',
    '@media (max-width:560px){.thg-secim{grid-template-columns:1fr}.thg-ust svg{width:84px}.thg-ust h2{font-size:1.2rem}}',
    '#thgSoru{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2600;display:flex;align-items:center;gap:12px;',
    ' background:#0f2a43;color:#fff;border-radius:16px;padding:12px 14px 12px 16px;box-shadow:0 16px 40px rgba(0,0,0,.3);',
    ' font-family:inherit;max-width:calc(100vw - 24px);animation:thgYuk .25s ease}',
    '@keyframes thgYuk{from{transform:translate(-50%,16px);opacity:0}}',
    '#thgSoru b{display:block;font-size:1rem}',
    '#thgSoru small{display:block;opacity:.8;font-size:.82rem;margin-top:2px}',
    '#thgSoru button{border:0;border-radius:10px;padding:10px 14px;font:inherit;font-weight:800;cursor:pointer;white-space:nowrap}',
    '#thgSoru .evet{background:#22c55e;color:#06281b}',
    '#thgSoru .hayir{background:rgba(255,255,255,.14);color:#fff}'
  ].join('\n');
  function stilKur() {
    if ($('thgStil')) return;
    var s = document.createElement('style'); s.id = 'thgStil'; s.textContent = STIL;
    document.head.appendChild(s);
  }
  var SIM = {
    pc: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M1 20h22"/><path d="M9 10l2 2 4-4"/></svg>',
    tahta: '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8M12 16v5"/><path d="M6 12.5a3.5 3.5 0 0 1 3.5-3.5M6 9.5a.6.6 0 0 1 .6-.6"/></svg>',
    /* kumanda (telefon/bilgisayar) ve ok — seçim penceresi (21.10.2026) */
    kumanda: '<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2.5"/><circle cx="12" cy="7" r="1.1"/><path d="M10 11.5h4M10 15h4M10 18.5h4"/></svg>',
    ok: '<svg class="thg-ok" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
  };
  function cizim() {
    return '<svg viewBox="0 0 160 84" aria-hidden="true">' +
      '<rect x="4" y="22" width="56" height="38" rx="5" fill="#e2e8f0" stroke="#0f2a43" stroke-width="2.5"/>' +
      '<rect x="10" y="28" width="44" height="26" rx="2" fill="#fff"/><path d="M0 64h64l-6 6H6z" fill="#0f2a43"/>' +
      '<rect x="92" y="8" width="64" height="48" rx="5" fill="#0f2a43"/><rect x="97" y="13" width="54" height="38" rx="3" fill="#fff"/>' +
      '<path d="M124 56v18M112 76h24" stroke="#0f2a43" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M64 40 C78 22, 82 22, 90 32" fill="none" stroke="#16A085" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 6">' +
      '<animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1s" repeatCount="indefinite"/></path>' +
      '<rect x="14" y="32" width="20" height="4" rx="2" fill="#16A085"/><rect x="14" y="40" width="32" height="3" rx="1.5" fill="#cbd5e1"/>' +
      '<rect x="102" y="19" width="26" height="6" rx="3" fill="#16A085"/><rect x="102" y="30" width="42" height="4" rx="2" fill="#cbd5e1"/>' +
      '<rect x="102" y="38" width="34" height="4" rx="2" fill="#cbd5e1"/></svg>';
  }

  /* ------------------------------------------------ canlı veritabanı */
  var vt = null, vtYukleniyor = null;
  function vtHazir(cb) {
    if (vt) { cb(vt); return; }
    if (!window.firebase || !firebase.app) return;
    var kur = function () {
      try { vt = firebase.app().database(VT_ADRES); } catch (e) { vt = null; }
      if (vt) cb(vt);
    };
    if (firebase.database) { kur(); return; }
    if (!vtYukleniyor) {
      vtYukleniyor = [];
      var s = document.createElement('script');
      s.src = SDK; s.async = true;
      s.onload = function () { var l = vtYukleniyor; vtYukleniyor = null; kur(); l.forEach(function (f) { if (vt) f(vt); }); };
      s.onerror = function () { vtYukleniyor = null; };
      document.head.appendChild(s);
    }
    vtYukleniyor.push(cb);
  }
  var durumDinle = null, yayin = null, izle = null, yayinOkundu = false, izleOkundu = false;
  var ekran = null, ekranOkundu = false;          /* hesabın Sınıf Ekranı (tahta/<uid>/ekran — sistem/tahta.js) */
  var hazir = null;                               /* sitesi açık işaretli Sınıf Ekranları (tahta/<uid>/hazir — 24.10.2026) */
  function kimlik() { try { return localStorage.getItem('kidef_cihaz_kimlik') || ''; } catch (e) { return ''; } }
  function canliDinle() {
    var u = kullanici();
    if (!u || durumDinle) return;
    vtHazir(function (db) {
      if (durumDinle || !kullanici()) return;
      var kok = db.ref('tahta/' + kullanici().uid);
      durumDinle = kok;
      kok.child('yayin').on('value', function (s) { yayin = s.val(); yayinOkundu = true; durumYaz(); tahtalarCiz(); soruKontrol(); noktaYaz(); donusKontrol(); }, function () { });
      kok.child('izle').on('value', function (s) { izle = s.val(); izleOkundu = true; durumYaz(); tahtalarCiz(); noktaYaz(); donusKontrol(); soruKontrol(); }, function () { });
      kok.child('ekran').on('value', function (s) { ekran = s.val(); ekranOkundu = true; durumYaz(); tahtalarCiz(); soruKontrol(); }, function () { ekranOkundu = true; soruKontrol(); });
      kok.child('hazir').on('value', function (s) { hazir = s.val(); durumYaz(); tahtalarCiz(); }, function () { });
    });
  }
  function canliBirak() {
    if (!durumDinle) return;
    try { durumDinle.child('yayin').off(); durumDinle.child('izle').off(); durumDinle.child('ekran').off(); durumDinle.child('hazir').off(); } catch (e) { }
    durumDinle = null; yayin = null; izle = null; yayinOkundu = false; izleOkundu = false; ekran = null; ekranOkundu = false; hazir = null;
  }
  function yayinVar() { return !!(yayin && yayin.cevrimici); }
  function tahtaSayisi() {
    var n = 0;
    if (izle) for (var k in izle) if (Object.prototype.hasOwnProperty.call(izle, k) && izle[k] && izle[k].cevrimici && izle[k].cihaz !== 'bilgisayar') n++;
    return n;
  }

  /* ------------------------------------------------------------ panel */
  function durumYaz() {
    var d = $('thgDurum');
    if (!d) return;
    var n = tahtaSayisi() + hazirYalniz(), sinif = '', m;            /* + sitesi açık işaretli tahta (24.10.2026) */
    /* tek kumanda (21.10.2026): kumandanın adı Çıkış yap penceresindekiyle aynı */
    var kum = (yayinVar() && yayin.cihaz === 'bilgisayar' && yayin.cihazAd) ? String(yayin.cihazAd) : '';
    if (kum && yayin.kimlik && yayin.kimlik === kimlik()) kum += ' ' + kd('th.p_bu_cihaz', '(bu cihaz)');
    if (!vt) m = kd('th.p_durum_bekle', 'Durum okunuyor…');
    else if (yayinVar() && n) { sinif = 'canli'; m = kum ? kd('th.p_durum_ikisi_ad', 'Yansıtma açık · kumanda: {k}', { k: kum }) : kd('th.p_durum_ikisi', 'Yansıtma açık; Sınıf Ekranı bağlı.'); }
    else if (yayinVar()) { sinif = 'bekle'; m = kum ? kd('th.p_durum_yayin_ad', 'Kumanda: {k} · Sınıf Ekranı bağlı değil.', { k: kum }) : kd('th.p_durum_yayin', 'Bir kumanda yansıtıyor; Sınıf Ekranı bağlı değil.'); }
    else if (n) { sinif = 'bekle'; m = kd('th.p_durum_tahta', 'Sınıf Ekranı hazır, kumandayı bekliyor.'); }
    else m = kd('th.p_durum_yok', 'Şu an yansıtma yok.');
    d.innerHTML = '<span class="thg-nokta ' + sinif + '"></span><span>' + kac(m) + '</span>';
  }
  function panelAc() {
    /* küçük seçim penceresi: iki seçenek (21.10.2026) — Sınıf Ekranı olarak
       işaretli cihazda da açılır (tahta görünümüne doğrudan gidilmez) */
    stilKur();
    panelKapat();
    var p = document.createElement('div');
    p.id = 'thgPerde';
    var tahta = tahtaCihazi();
    p.innerHTML = '<div id="thgKutu" class="thg-kucuk" role="dialog" aria-modal="true" aria-labelledby="thgBaslik">' +
      '<button type="button" class="thg-kapat" data-thg="kapat" aria-label="' + kac(kd('g.kapat', 'Kapat')) + '">&times;</button>' +
      '<div class="thg-ust"><span class="thg-logo">' + SIM.tahta + '</span><div><h2 id="thgBaslik">' + kac(kd('th.p_baslik2', 'Akıllı tahta')) + '</h2>' +
      '<p>' + kac(kd('th.p_soru', 'Bu cihaz ne olsun?')) + '</p></div></div>' +
      '<div class="thg-secenekler">' +
      '<button type="button" class="thg-sec" data-thg="yansit"><span class="thg-sim">' + SIM.kumanda + '</span><span class="thg-yazi">' +
      '<b>' + kac(kd('th.p_kumanda', 'Bu cihazı kumanda olarak kullan')) + '</b>' +
      '<small>' + kac(kd('th.p_kumanda_alt', 'Burada açtığın sayfa, kaydırma, tıklama ve yazdıkların Sınıf Ekranı’nda görünür.')) + '</small>' +
      '<span class="thg-ara" id="thgAra" aria-live="polite"></span></span>' + SIM.ok + '</button>' +
      '<div class="thg-tahtalar" id="thgTahtalar" hidden></div>' +
      '<button type="button" class="thg-sec ikincil" data-thg="izle"><span class="thg-sim">' + SIM.tahta + '</span><span class="thg-yazi">' +
      '<b>' + kac(kd('th.p_ekran', 'Bu cihazı Sınıf Ekranı olarak kullan')) + '</b>' +
      '<small>' + kac(kd('th.p_ekran_alt', 'Kumandadan yaptıkların bu ekranda görünür. Cihaz bunu hatırlar: sonraki derslerde kumandadan başlatman yeter.')) + '</small></span>' + SIM.ok + '</button>' +
      '</div>' +
      '<div class="thg-durum" id="thgDurum"></div>' +
      '<p class="thg-not">' + kac(kd('th.p_not', 'Yalnız bu site yansır. Şifre, e-posta ve PIN alanları tahtaya gitmez; hiçbir şey iki kez kaydedilmez.')) +
      (tahta ? ' ' + kac(kd('th.p_isaretli', 'Bu cihaz Sınıf Ekranı olarak işaretli.')) + ' <a data-thg="unut">' + kac(kd('th.p_isaret_kaldir', 'İşareti kaldır')) + '</a>' : '') + '</p>' +
      '</div>';
    p.addEventListener('click', function (e) {
      if (e.target === p) { panelKapat(); return; }
      var t = e.target.closest ? e.target.closest('[data-thg]') : null;
      if (!t) return;
      var is = t.getAttribute('data-thg');
      if (is === 'kapat') panelKapat();
      else if (is === 'yansit') { cihazYaz(null); hedefYaz(null); git('yansit'); }
      else if (is === 'izle') { cihazYaz('tahta'); git('izle'); }
      else if (is === 'unut') { cihazYaz(null); hazirSil(); panelAc(); }
    });
    document.body.appendChild(p);
    durumYaz();
    tahtaImza = '';                                   /* yeni pencere: liste yeniden çizilsin */
    tahtalarCiz();
    canliDinle();
    document.addEventListener('keydown', escKapat);
  }
  function escKapat(e) { if (e.key === 'Escape') panelKapat(); }
  function panelKapat() {
    var p = $('thgPerde');
    if (p) p.parentNode.removeChild(p);
    document.removeEventListener('keydown', escKapat);
    if (!tahtaCihazi()) canliBirak();
  }
  function git(rol, hedef) {
    var adres = location.pathname.replace(/^.*\//, '') || 'index.html';
    var sayfa = adres + location.search + location.hash;
    var ek = '';
    if (rol === 'yansit' && hedef && hedef.k) ek = '&hedef=' + encodeURIComponent(hedef.k) + '&hedefAd=' + encodeURIComponent(hedef.ad || '');
    location.href = 'tahta.html?rol=' + rol + (rol === 'yansit' ? '&sayfa=' + encodeURIComponent(sayfa) + ek : '');
  }

  /* ------------------------------------------- HANGİ TAHTA? (21.10.2026)
     Öğretmen: "tahtaya yansıtırken açık olan cihazlar görünsün ve onlardan
     biri seçilebilsin, hatta eğer o tahtada bi sınıf açılmışsa o sınıf ismi
     de görünsün". Açık tahtalar izle/ kayıtlarından (sistem/tahta.js:
     kimlik, ad, sinif). Seçim hatırlanır (kidef_tahta_hedef); tahta.html
     &hedef= ile açılır, ders ortasında şeritten değiştirilir. */
  function hedefOku() {
    try { var h = JSON.parse(localStorage.getItem('kidef_tahta_hedef') || 'null'); return (h && h.k) ? h : null; } catch (e) { return null; }
  }
  function hedefYaz(h) {
    try { if (h && h.k) localStorage.setItem('kidef_tahta_hedef', JSON.stringify({ k: h.k, ad: h.ad || '' })); else localStorage.removeItem('kidef_tahta_hedef'); } catch (e) { }
  }
  function tahtalar() {
    var l = [];
    if (izle) for (var k in izle) {
      if (!Object.prototype.hasOwnProperty.call(izle, k)) continue;
      var t = izle[k];
      if (t && t.cevrimici && t.cihaz === 'tahta') l.push({ kimlik: t.kimlik || k, ad: t.ad || '', sinif: t.sinif || '', sinifAcik: !!t.sinifAcik });
    }
    l.sort(function (a, b) { return (a.ad || a.kimlik) < (b.ad || b.kimlik) ? -1 : 1; });
    return l;
  }
  function tahtaAdi(t) { return t.ad || kd('th.tahta_n', 'Tahta {n}', { n: String(t.kimlik).slice(-3).toUpperCase() }); }
  function hedefSecili() { return null; }          /* tek Sınıf Ekranı: seçim yok (21.10.2026) */
  /* hesabın Sınıf Ekranı: kaydı (ekran) ve açıksa izle/ kaydı — kayıt yoksa (eski sürüm) açık tahta */
  function ekranBilgi() {
    var l = tahtalar(), e = ekran, t = null;
    if (e && e.kimlik) l.forEach(function (x) { if (x.kimlik === e.kimlik) t = x; });
    else if (l.length) t = l[0];
    if (!(e && e.kimlik) && !t) return null;
    var kim = (e && e.kimlik) || t.kimlik;
    return { kimlik: kim, ad: (t && t.ad) || (e && e.ad) || tahtaAdi({ kimlik: kim }), acik: !!t,
             sinif: t ? t.sinif : '', sinifAcik: !!(t && t.sinifAcik), ben: kim === kimlik() };
  }
  /* CİHAZ ARANIYOR (24.10.2026) — aynı hesabın bu cihaz dışındaki, şu an hazır Sınıf
     Ekranı: önce açık Sınıf Ekranı sayfası (izle/), sonra sitesi açık işaretli cihaz
     (hazir/); hesabın kayıtlı Sınıf Ekranı (ekran) öne alınır. */
  function hazirlar() {
    var ben = kimlik(), l = [], gor = {};
    tahtalar().forEach(function (t) {
      if (t.kimlik === ben || gor[t.kimlik]) return;
      gor[t.kimlik] = 1;
      l.push({ kimlik: t.kimlik, ad: tahtaAdi(t), acik: true, sinif: t.sinif, sinifAcik: t.sinifAcik, ben: false, izle: true });
    });
    if (hazir && typeof hazir === 'object') for (var k in hazir) {
      if (!Object.prototype.hasOwnProperty.call(hazir, k)) continue;
      var h = hazir[k];
      if (!h || typeof h !== 'object') continue;
      var kim = String(h.kimlik || k);
      if (kim === ben || gor[kim]) continue;
      gor[kim] = 1;
      l.push({ kimlik: kim, ad: String(h.ad || '') || tahtaAdi({ kimlik: kim }), acik: true, sinif: '', sinifAcik: false, ben: false, izle: false });
    }
    var ek = (ekran && ekran.kimlik) || '';
    l.sort(function (a, b) { return ((b.kimlik === ek) - (a.kimlik === ek)) || ((b.izle ? 1 : 0) - (a.izle ? 1 : 0)); });
    return l;
  }
  function ekranBulundu() { return hazirlar()[0] || null; }
  function hazirYalniz() {                      /* durum satırı: izle/ dışında sitesi açık işaretli tahta sayısı */
    var n = 0;
    hazirlar().forEach(function (t) { if (!t.izle) n++; });
    return n;
  }
  function araYaz(dur, bul) {
    var a = $('thgAra');
    if (!a) return;
    if (dur === 'ara') a.innerHTML = '<span class="thg-radar" aria-hidden="true"></span><span>' + kac(kd('th.p_araniyor', 'Cihaz aranıyor…')) + '</span>';
    else if (dur === 'bulundu') a.innerHTML = '<svg class="thg-tik" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg><span>' +
      kac(kd('th.p_bulundu', 'Cihaz bulundu: {ad}', { ad: bul ? bul.ad : '' })) + '</span>';
    else a.innerHTML = '';
  }
  /* İşaretli Sınıf Ekranı: site açıkken «hazırım» kaydı. Bağlantı her kurulduğunda
     yeniden yazılır; kopunca sunucu siler. Kural: tahta/$uid sahibine açık. */
  var hazirRef = null, hazirIs = null;
  function hazirAd() {
    try { if (window.KidefCihazlar && KidefCihazlar.ad) { var a = String(KidefCihazlar.ad() || '').trim(); if (a) return a.slice(0, 40); } } catch (e) { }
    try { var b = (localStorage.getItem('kidef_cihaz_ad') || localStorage.getItem('kidef_tahta_ad') || '').trim(); if (b) return b.slice(0, 40); } catch (e) { }
    return tahtaAdi({ kimlik: kimlik() });
  }
  function hazirYaz() {
    var k = kimlik();
    if (!(kullanici() && ogretmenMi() && tahtaCihazi() && k)) { hazirSil(); return; }
    if (hazirRef) return;
    hazirRef = 'bekle';
    vtHazir(function (db) {
      if (hazirRef !== 'bekle' || !kullanici() || !tahtaCihazi()) { if (hazirRef === 'bekle') hazirRef = null; return; }
      var ref = db.ref('tahta/' + kullanici().uid + '/hazir/' + k);
      hazirRef = ref;
      hazirIs = function (s) {
        if (!s || !s.val() || hazirRef !== ref) return;
        try { ref.onDisconnect().remove(); } catch (e) { }
        try { ref.set({ kimlik: k, ad: hazirAd(), ts: firebase.database.ServerValue.TIMESTAMP }); } catch (e) { }
      };
      try { db.ref('.info/connected').on('value', hazirIs); } catch (e) { }
    });
  }
  function hazirSil() {
    if (!hazirRef) return;
    var ref = hazirRef; hazirRef = null;
    if (ref === 'bekle') return;
    try { if (vt && hazirIs) vt.ref('.info/connected').off('value', hazirIs); } catch (e) { }
    hazirIs = null;
    try { ref.onDisconnect().cancel(); } catch (e) { }
    try { ref.remove().catch(function () { }); } catch (e) { }
  }
  function ekranAcik(e) {
    var var_ = false;
    tahtalar().forEach(function (t) { if (e && t.kimlik === e.kimlik) var_ = true; });
    return var_;
  }
  var tahtaImza = '';
  function tahtalarCiz() {
    /* TEK SINIF EKRANI (21.10.2026) — öğretmen: "sadece bi cihaz kumandayı kullanabileceği
       yansıtma ekranı olabilir". «Hangi Sınıf Ekranı?» listesi yerine tek satır: hesabın
       Sınıf Ekranı ve açık sınıfı. Bir cihaz Sınıf Ekranı seçildiyse (bu cihaz değil)
       kumanda seçeneği yeşil — öğretmen: "bi cihazı akıllı tahta seçtikten sonra bu cihazı
       kumanda olarak kullan kısmı yeşil dolgu beyaz yazı olsun". */
    var el = $('thgTahtalar');
    if (!el) return;
    /* CİHAZ ARANIYOR (24.10.2026): yeşil yalnız aynı hesabın başka bir cihazı Sınıf
       Ekranı olarak şu an hazırsa; kayıtlı ama kapalı tahta yeşil yapmaz */
    var bul = ekranBulundu(), tc = tahtaCihazi(), e = bul || ekranBilgi();
    var imza = JSON.stringify(e) + '|' + (bul ? 1 : 0) + '|' + (vt ? 1 : 0) + '|' + (tc ? 1 : 0) + '|' + (yayinVar() ? 1 : 0);
    if (imza === tahtaImza) return;
    tahtaImza = imza;
    var kb = document.querySelector('#thgPerde [data-thg="yansit"]');
    if (kb) kb.classList.toggle('vurgu', !!(bul && !tc));
    araYaz(tc ? '' : (bul ? 'bulundu' : 'ara'), bul);
    if ((!e || e.ben) && !tc) {
      el.hidden = false;
      el.innerHTML = '<div class="thg-ipucu">' + kac(kd('th.p_ara_ipucu', 'Tahtada siteyi bu hesapla aç ve «Bu cihazı Sınıf Ekranı olarak kullan»a dokun.')) + '</div>';
      return;
    }
    el.hidden = !e || e.ben;
    if (!e || e.ben) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="thg-ekran"><span class="thg-nokta' + (e.acik ? ' canli' : '') + '"></span><span><b>' +
      kac(kd('th.p_ekran_ad', 'Sınıf Ekranı: {ad}', { ad: e.ad })) + '</b><small>' +
      kac([e.acik ? (yayinVar() ? kd('th.p_ekran_bagli', 'bağlı, yansıtma açık') : kd('th.p_ekran_hazir', 'açık, kumandayı bekliyor'))
                  : kd('th.p_ekran_kapali', 'şu an açık değil — açılınca kumandaya bağlanır'),
           e.acik && e.sinif ? (e.sinifAcik ? kd('th.acik_sinif', 'açık sınıf: {s}', { s: e.sinif }) : kd('th.son_sinif', 'son sınıf: {s}', { s: e.sinif })) : ''
          ].filter(Boolean).join(' · ')) + '</small></span></div>';
  }

  /* ------------------------------- tahta cihazı: yansıtma başlayınca geç
     Geri sayım ve soru YOK (18.10.2026): yansıtma başlar başlamaz tahta
     görünümü açılır. Tahta görünümünden "Çık" ile ayrılınmışsa
     (sistem/tahta.js → localStorage kidef_tahta_birakti) AYNI yansıtma
     sürdükçe geri dönülmez — yoksa ana sayfaya çıkan tahta hemen geri
     sürüklenirdi; bilgisayar yeni bir yansıtma başlatınca döner. */
  var soruZ = null, gidiyor = false;
  function birakildiMi() {
    var b = null;
    try { b = JSON.parse(localStorage.getItem('kidef_tahta_birakti') || 'null'); } catch (e) { }
    if (!b) return false;
    if (b.bas && yayin && yayin.bas) return b.bas === yayin.bas;      /* aynı yansıtma oturumu */
    return Date.now() - (b.t || 0) < 10 * 60000;                       /* eski bilgisayar sürümü: 10 dk */
  }
  var soruIlk = 0, soruBekleZ = null;
  function soruKontrol() {
    if (!tahtaCihazi() || gidiyor) return;
    var taze = yayinVar() && !yayin.durak;
    if (!taze || birakildiMi()) { soruIlk = 0; return; }
    /* TEK SINIF EKRANI (21.10.2026): hesabın Sınıf Ekranı başka bir cihazsa ve o açıksa bu
       tahta geçmez; birkaç saniyede açılmazsa bu tahta Sınıf Ekranı olur */
    if (!ekranOkundu || !izleOkundu) return;
    var e = ekran;
    if (e && e.kimlik && e.kimlik !== kimlik()) {
      if (ekranAcik(e)) { soruIlk = 0; return; }
      if (!soruIlk) soruIlk = Date.now();
      var kalan = 3500 - (Date.now() - soruIlk);
      if (kalan > 0) { clearTimeout(soruBekleZ); soruBekleZ = setTimeout(soruKontrol, kalan + 50); return; }
    }
    gidiyor = true;
    soruKapat();
    git('izle');
  }
  function soruKapat() {
    clearInterval(soruZ); soruZ = null;
    var s = $('thgSoru');
    if (s) s.parentNode.removeChild(s);
  }

  /* --------------------------------------- KUMANDA DÖNÜŞÜ (18.10.2026)
     Öğretmen: "kumanda tekrar tarayıcıda site açılırsa otomatik bağlansın ...
     tekrar açtığında telefonda kaldığı yerden devam edebilmeli". Bu cihaz az
     önce bir dersin kumandasıydı (sistem/tahta.js → localStorage
     kidef_kumanda_son) ve o ders tahtada hâlâ sürüyorsa ana sayfa açılır
     açılmaz kumandaya dönülür: tahtadaki sayfa geçmişiyle açılır, tahta
     yenilenmez. Dönülmez: "Bitir" ile bitmişse, başka cihaz yansıtıyorsa,
     tahtada açık değilse, ana sayfaya tarayıcının Geri tuşuyla gelinmişse
     (öğretmen bilerek çıktı), karekod bağlantısıyla açılmışsa, kumanda
     100 dakikadır kullanılmıyorsa. */
  var donusBitti = false;
  function kumandaSon() { try { return JSON.parse(localStorage.getItem('kidef_kumanda_son') || 'null'); } catch (e) { return null; } }
  function yeniAcilis() {
    try {
      var n = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      if (n && n.type === 'back_forward') return false;
    } catch (e) { }
    return !/[?&]qr=/.test(location.search);
  }
  function donusKontrol() {
    if (donusBitti || gidiyor || tahtaCihazi()) return;
    var son = kumandaSon(), u = kullanici();
    if (!son || !son.bas) { donusBitti = true; return; }
    if (!u || !ogretmenMi()) return;                       /* giriş / rol henüz gelmedi */
    if (son.uid !== u.uid || Date.now() - (son.t || 0) > 100 * 60000 || !yeniAcilis()) { donusBitti = true; return; }
    if (!durumDinle) { canliDinle(); return; }
    if (!yayinOkundu || !izleOkundu) return;
    donusBitti = true;
    var y = yayin;
    if (!y || y.bas !== son.bas || y.bitir || !y.u) return;
    var tahta = false;
    if (izle) for (var k in izle) {
      if (!Object.prototype.hasOwnProperty.call(izle, k)) continue;
      var t = izle[k];
      if (t && t.cevrimici && t.cihaz !== 'bilgisayar' && t.d === y.d) tahta = true;
    }
    /* ders sürüyor: tahta tutuyor (vekil ya da tahtadan kullanılıyor) ya da kumanda
       koptu ama tahta o sayfada. Bir bilgisayar/telefon şu an yansıtıyorsa (başka
       cihaz ya da bu telefonun açık kumanda sekmesi) dönülmez. */
    var surer = y.cevrimici ? y.cihaz === 'tahta' : tahta;
    if (!surer) return;
    gidiyor = true;
    soruKapat(); panelKapat();
    location.replace('tahta.html?rol=yansit');
  }

  /* ------------------------------------------------- başlıktaki düğme */
  function noktaYaz() {
    var n = $('tab-tahta-nokta');
    if (n) n.style.display = (yayinVar() || tahtaSayisi()) ? 'block' : 'none';
  }
  function dugmeGuncelle() {
    var d = $('tab-tahta');
    var gor = ogretmenMi();
    if (d) d.style.display = gor ? 'inline-flex' : 'none';
    if (gor && tahtaCihazi()) canliDinle();
    if (gor) donusKontrol();
    if (!kullanici()) { canliBirak(); soruKapat(); }
    hazirYaz();                                        /* işaretli cihaz: «site açık» kaydı (24.10.2026) */
  }
  /* kumanda / Sınıf Ekranı başka cihaza geçti (sistem/tahta.js → sessionStorage) */
  function bildirGoster(m) {
    stilKur();
    var b = $('thgBildir');
    if (!b) { b = document.createElement('div'); b.id = 'thgBildir'; b.setAttribute('role', 'status'); document.body.appendChild(b); }
    b.textContent = m; b.hidden = false;
    clearTimeout(bildirGoster.z);
    bildirGoster.z = setTimeout(function () { b.hidden = true; }, 7000);
  }
  function devirBildir() {
    var oku = function (k) {
      var v = null;
      try { v = JSON.parse(sessionStorage.getItem(k) || 'null'); sessionStorage.removeItem(k); } catch (e) { }
      return (v && Date.now() - (v.t || 0) < 60000) ? v : null;
    };
    var k = oku('kidef_kumanda_devir'), e = oku('kidef_ekran_devir');
    if (k) bildirGoster(k.bitti ? kd('th.g_devir_bitti', 'Yansıtma başka bir kumandadan bitirildi.')
      : (k.ad ? kd('th.g_devir', 'Kumanda artık {ad} cihazında. Bu cihazı yeniden kumanda yapmak için başlıktaki kumanda simgesine dokun.', { ad: k.ad })
              : kd('th.g_devir_yok', 'Kumanda başka bir sekmeye geçti.')));
    else if (e) bildirGoster(e.ad ? kd('th.g_ekran_devir', 'Sınıf Ekranı artık {ad}. Bu cihazı yeniden Sınıf Ekranı yapmak için başlıktaki kumanda simgesine dokun.', { ad: e.ad })
                                 : kd('th.g_ekran_devir_yok', 'Başka bir cihaz Sınıf Ekranı oldu.'));
  }
  function basla() {
    devirBildir();
    dugmeGuncelle();
    setInterval(dugmeGuncelle, 1500);
    try { firebase.auth().onAuthStateChanged(function () { setTimeout(dugmeGuncelle, 300); }); } catch (e) { }
    document.addEventListener('kidef:dil', function () { if ($('thgPerde')) panelAc(); });
  }
  window.KidefTahtaGir = { ac: panelAc, kapat: panelKapat };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
