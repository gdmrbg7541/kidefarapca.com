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
    tahta: '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8M12 16v5"/><path d="M6 12.5a3.5 3.5 0 0 1 3.5-3.5M6 9.5a.6.6 0 0 1 .6-.6"/></svg>'
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
  function canliDinle() {
    var u = kullanici();
    if (!u || durumDinle) return;
    vtHazir(function (db) {
      if (durumDinle || !kullanici()) return;
      var kok = db.ref('tahta/' + kullanici().uid);
      durumDinle = kok;
      kok.child('yayin').on('value', function (s) { yayin = s.val(); yayinOkundu = true; durumYaz(); soruKontrol(); noktaYaz(); donusKontrol(); }, function () { });
      kok.child('izle').on('value', function (s) { izle = s.val(); izleOkundu = true; durumYaz(); tahtalarCiz(); noktaYaz(); donusKontrol(); }, function () { });
    });
  }
  function canliBirak() {
    if (!durumDinle) return;
    try { durumDinle.child('yayin').off(); durumDinle.child('izle').off(); } catch (e) { }
    durumDinle = null; yayin = null; izle = null; yayinOkundu = false; izleOkundu = false;
  }
  function yayinVar() { return !!(yayin && yayin.cevrimici); }
  function tahtaSayisi() {
    var n = 0;
    if (izle) for (var k in izle) if (Object.prototype.hasOwnProperty.call(izle, k) && izle[k] && izle[k].cevrimici) n++;
    return n;
  }

  /* ------------------------------------------------------------ panel */
  function durumYaz() {
    var d = $('thgDurum');
    if (!d) return;
    var n = tahtaSayisi(), sinif = '', m;
    if (!vt) m = kd('th.p_durum_bekle', 'Durum okunuyor…');
    else if (yayinVar() && n) { sinif = 'canli'; m = kd('th.p_durum_ikisi', 'Yansıtma açık; tahtan bağlı.'); }
    else if (yayinVar()) { sinif = 'bekle'; m = kd('th.p_durum_yayin', 'Bir bilgisayarın yansıtıyor; tahta bağlı değil.'); }
    else if (n) { sinif = 'bekle'; m = kd('th.p_durum_tahta', 'Tahtan hazır, bilgisayarını bekliyor.'); }
    else m = kd('th.p_durum_yok', 'Şu an yansıtma yok.');
    d.innerHTML = '<span class="thg-nokta ' + sinif + '"></span><span>' + kac(m) + '</span>';
  }
  function panelAc() {
    /* tahta cihazında seçim paneli yok: doğrudan tahta görünümü (18.10.2026) */
    if (tahtaCihazi() && kullanici()) { git('izle'); return; }
    stilKur();
    panelKapat();
    var p = document.createElement('div');
    p.id = 'thgPerde';
    var tahta = tahtaCihazi();
    p.innerHTML = '<div id="thgKutu" role="dialog" aria-modal="true" aria-labelledby="thgBaslik">' +
      '<button type="button" class="thg-kapat" data-thg="kapat" aria-label="' + kac(kd('g.kapat', 'Kapat')) + '">&times;</button>' +
      '<div class="thg-ust">' + cizim() + '<div><h2 id="thgBaslik">' + kac(kd('th.p_baslik', 'Tahtaya yansıt')) + '</h2>' +
      '<p>' + kac(kd('th.p_alt', 'Bilgisayarında sitede ne yaparsan tahtada aynen görünür. Kablo, ekran paylaşımı yok; iki cihazda aynı hesap yeter.')) + '</p></div></div>' +
      '<div class="thg-secim">' +
      '<div class="thg-kart' + (tahta ? '' : ' secili') + '"><span class="thg-sim">' + SIM.pc + '</span>' +
      '<h3>' + kac(kd('th.p_yansit', 'Bu bilgisayardan yansıt')) + '</h3>' +
      '<p>' + kac(kd('th.p_yansit_alt', 'Burada açtığın sayfa, kaydırma, tıklama ve yazdıkların tahtada görünür. Üstteki şeritten tahtayı karartabilir, duraklatabilirsin.')) + '</p>' +
      '<div class="thg-tahtalar" id="thgTahtalar"></div>' +
      '<button type="button" class="thg-dug" data-thg="yansit">' + kac(kd('th.p_yansit_dug', 'Yansıtmayı başlat')) + '</button></div>' +
      '<div class="thg-kart' + (tahta ? ' secili' : '') + '"><span class="thg-sim">' + SIM.tahta + '</span>' +
      '<h3>' + kac(kd('th.p_izle', 'Bu cihaz tahta')) + '</h3>' +
      '<p>' + kac(kd('th.p_izle_alt', 'Bilgisayarında yaptıkların bu ekranda görünür. Tahta bunu hatırlar: sonraki derslerde bilgisayarda başlatman yeter.')) + '</p>' +
      '<button type="button" class="thg-dug ikincil" data-thg="izle">' + kac(kd('th.p_izle_dug', 'Tahta görünümünü aç')) + '</button></div>' +
      '</div>' +
      '<div class="thg-durum" id="thgDurum"></div>' +
      '<p class="thg-not">' + kac(kd('th.p_not', 'Yalnız bu site yansır. Şifre, e-posta ve PIN alanları tahtaya gitmez; hiçbir şey iki kez kaydedilmez.')) +
      (tahta ? ' <a data-thg="unut">' + kac(kd('th.p_unut', 'Bu cihaz tahta değil')) + '</a>' : '') + '</p>' +
      '</div>';
    p.addEventListener('click', function (e) {
      if (e.target === p) { panelKapat(); return; }
      var t = e.target.closest ? e.target.closest('[data-thg]') : null;
      if (!t) return;
      var is = t.getAttribute('data-thg');
      if (is === 'kapat') panelKapat();
      else if (is === 'yansit') { cihazYaz(null); var hs = hedefSecili(); hedefYaz(hs); git('yansit', hs); }
      else if (is === 'izle') { cihazYaz('tahta'); git('izle'); }
      else if (is === 'unut') { cihazYaz(null); panelAc(); }
    });
    document.body.appendChild(p);
    durumYaz();
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
  function hedefSecili() {
    var se = document.querySelector('#thgTahtalar input[name="thgHedef"]:checked');
    if (!se || !se.value) return null;
    return { k: se.value, ad: se.getAttribute('data-ad') || '' };
  }
  var tahtaImza = '';
  function tahtalarCiz() {
    var el = $('thgTahtalar');
    if (!el) return;
    var l = tahtalar();
    var imza = JSON.stringify(l) + '|' + (vt ? 1 : 0);
    if (imza === tahtaImza) return;
    tahtaImza = imza;
    var once = hedefSecili(), h = hedefOku();
    var secili = once ? once.k : (h ? h.k : '');
    var varMi = false;
    l.forEach(function (t) { if (t.kimlik === secili) varMi = true; });
    if (!varMi) secili = (l.length === 1 && !once) ? l[0].kimlik : '';
    var s = '<div class="thg-bas">' + kac(kd('th.p_hangi', 'Hangi tahta?')) + '</div>';
    if (!vt) s += '<div class="thg-yok">' + kac(kd('th.p_durum_bekle', 'Durum okunuyor…')) + '</div>';
    else if (!l.length) s += '<div class="thg-yok">' + kac(kd('th.p_tahta_yok', 'Şu an açık tahta yok. Tahtada site açılınca burada görünür; yine de başlatabilirsin.')) + '</div>';
    else {
      s += '<label><input type="radio" name="thgHedef" value=""' + (secili ? '' : ' checked') + '><span><b>' + kac(kd('th.hedef_hepsi', 'Bütün tahtalar')) + ' (' + l.length + ')</b>' +
        '<small>' + kac(kd('th.p_hepsi_alt', 'Açık olan her tahta aynı dersi gösterir.')) + '</small></span></label>';
      l.forEach(function (t) {
        s += '<label><input type="radio" name="thgHedef" value="' + kac(t.kimlik) + '" data-ad="' + kac(t.ad || '') + '"' + (t.kimlik === secili ? ' checked' : '') + '>' +
          '<span><b>' + kac(tahtaAdi(t)) + '</b><small>' +
          kac(t.sinif ? (t.sinifAcik ? kd('th.acik_sinif', 'açık sınıf: {s}', { s: t.sinif }) : kd('th.son_sinif', 'son sınıf: {s}', { s: t.sinif }))
                      : kd('th.p_sinif_yok', 'açık sınıf yok')) + '</small></span></label>';
      });
    }
    el.innerHTML = s;
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
  function soruKontrol() {
    if (!tahtaCihazi() || gidiyor) return;
    var taze = yayinVar() && !yayin.durak;
    if (!taze || birakildiMi()) return;
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
  }
  function basla() {
    dugmeGuncelle();
    setInterval(dugmeGuncelle, 1500);
    try { firebase.auth().onAuthStateChanged(function () { setTimeout(dugmeGuncelle, 300); }); } catch (e) { }
    document.addEventListener('kidef:dil', function () { if ($('thgPerde')) panelAc(); });
  }
  window.KidefTahtaGir = { ac: panelAc, kapat: panelKapat };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
