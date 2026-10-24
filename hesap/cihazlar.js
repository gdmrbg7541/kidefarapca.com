/* =====================================================================
   KİDEF · CİHAZLARIM — HESABIN AÇIK OLDUĞU CİHAZLAR   (hesap/cihazlar.js)
   ---------------------------------------------------------------------
   Öğretmen (18.10.2026): "giriş yapınca kaç cihazda giriş yapılmışsa o
   cihazlara bakabilip çıkış yapabilmeliyiz".

   NE YAPAR
     · Giriş yapılan her cihaz (tarayıcı) hesabın belgesine kendini yazar:
         kullanicilar/{uid}.cihazlar.<cihazKimliği> =
           { ad, tur, giris, son }      tur: bilgisayar | telefon | tablet | tahta
       Yeni bir koleksiyon açılmaz: hesap sahibi kendi belgesini zaten
       güncelleyebiliyor (Firestore kurallarına dokunulmadı).
     · Başlıktaki ÇIKIŞ tuşu artık doğrudan sormak yerine "Çıkış yap"
       penceresini açar: bu cihazdan çıkış, hesabın açık olduğu bütün
       cihazların listesi (son görülme), her birine "Çıkış yaptır" ve
       "Diğer tüm cihazlardan çıkış yap". Başka cihazda da açıksa tuşun
       köşesinde sayısı görünür.
     · "Çıkış yaptır": o cihazın kaydına çıkış işareti (cik) konur. Cihaz
       açıksa anında, kapalıysa site ilk açıldığında oturumu kapanır ve
       "oturumun başka bir cihazdan kapatıldı" der.
     · Bu cihazdan çıkılınca (elle, 40 dk boşta kalma, gece yarısı…) kayıt
       silinir; uzun süre görülmeyen kayıt listede soluk durur, silinebilir.

   DÜRÜSTLÜK NOTU: çıkışı cihazın kendisi yapar (tarayıcı uygulaması
   sunucu oturumunu iptal edemez). Site o cihazda hiç açılmazsa çıkış da
   ancak ilk açılışta olur.

   YALNIZ ÖĞRETMEN VE YÖNETİCİ (24.10.2026) — öğretmen: "öğrenci giriş
   yapıp çıkış tuşuna basınca cihazın açık olduğu cihazlar vs özellikler
   olmasın, bu sadece öğretmen ve yönetici için kumanda özellikleri vs
   açısından önemli". Öğrencide (ve rolü belli olmayanda) kayıt yazılmaz,
   tuşta rozet yok, çıkış tuşu eski kısa onayı sorar; öğrencinin
   belgesindeki eski cihaz kayıtları bir kez silinir, belge dinlenmez. Rol
   hesabın belgesinden (role) okunur; belge gelmeden appState.userRole.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefCihazlar) return;

  var ANAHTAR_ID = 'kidef_cihaz_kimlik';
  var ANAHTAR_YAZ = 'kidef_cihaz_son_yazma';
  var NABIZ = 10 * 60000;                  /* "son görülme" en çok bu sıklıkta yazılır */
  var ESKI = 30 * 24 * 3600000;            /* bu kadar görülmeyen kayıt "eski" */
  var PENCERE_ID = 'cihPencere';

  function kd(k, tr, yer) {
    var m = tr;
    try { if (window.KidefDil && window.KidefDil.metin) m = window.KidefDil.metin(k, tr); } catch (e) { }
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
  function yerelAl(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function yerelYaz(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }

  /* ------------------------------------------------- BU CİHAZ */
  function cihazId() {
    var id = yerelAl(ANAHTAR_ID);
    if (!id || !/^[a-z0-9]{8,24}$/.test(id)) {
      id = '';
      try { var a = new Uint32Array(3); crypto.getRandomValues(a); for (var i = 0; i < 3; i++) id += a[i].toString(36); }
      catch (e) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); }
      id = id.replace(/[^a-z0-9]/g, '').slice(0, 20);
      yerelYaz(ANAHTAR_ID, id);
    }
    return id;
  }
  var CID = cihazId();

  /* CİHAZ ADI TEK (21.10.2026) — öğretmen: "çıkış yaparken ki cihaz isimleri ile kumanda
     olarak yansıtılan cihaz isimleri aynı olsun". Ad: elle verilen ad (kidef_cihaz_ad; eski
     tahta adı kidef_tahta_ad) ya da «Tür + kimliğin son 3 harfi» (Telefon 7QX, Tahta 3KD) —
     sistem/tahta.js kumandada ve Sınıf Ekranı'nda aynı adı gösterir. Tarayıcı ve sistem
     (Chrome · Windows) ayrı alanda (tarayici); eski kayıtlar da bu adla gösterilir. */
  var TUR_KISA = { bilgisayar: 'Bilgisayar', telefon: 'Telefon', tablet: 'Tablet' };
  function varsayilanAd(tur, id) {
    var n = String(id || '').slice(-3).toUpperCase();
    if (tur === 'tahta') return kd('th.tahta_n', 'Tahta {n}', { n: n });
    var t = TUR_KISA[tur] ? tur : 'bilgisayar';
    return kd('cih.ad_' + t, TUR_KISA[t] + ' {n}', { n: n });
  }
  function ozelAd() { return String(yerelAl('kidef_cihaz_ad') || yerelAl('kidef_tahta_ad') || '').trim().slice(0, 40); }

  function cihazBilgi() {
    var ua = navigator.userAgent || '';
    var tarayici = /Edg\//.test(ua) ? 'Edge' : (/OPR\/|Opera/.test(ua) ? 'Opera' :
      (/SamsungBrowser/.test(ua) ? 'Samsung Internet' : (/Firefox\/|FxiOS/.test(ua) ? 'Firefox' :
      (/CriOS|Chrome\//.test(ua) ? 'Chrome' : (/Safari\//.test(ua) ? 'Safari' : '')))));
    var ipad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    var sistem = /iPhone|iPod/.test(ua) ? 'iPhone' : (ipad ? 'iPad' : (/Android/.test(ua) ? 'Android' :
      (/Windows/.test(ua) ? 'Windows' : (/CrOS/.test(ua) ? 'ChromeOS' : (/Mac OS X|Macintosh/.test(ua) ? 'macOS' :
      (/Linux/.test(ua) ? 'Linux' : ''))))));
    var kisa = 9999;
    try { kisa = Math.min(screen.width, screen.height); } catch (e) { }
    var tur = 'bilgisayar';
    if (yerelAl('kidef_tahta_cihaz') === 'tahta') tur = 'tahta';
    else if (/iPhone|iPod|Windows Phone/.test(ua) || (/Android/.test(ua) && /Mobile/.test(ua) && kisa <= 600)) tur = 'telefon';
    else if (ipad || (/Android/.test(ua) && kisa <= 820)) tur = 'tablet';
    else if (/Android/.test(ua)) tur = 'tahta';                     /* büyük ekranlı Android: akıllı tahta */
    return { tur: tur, tarayici: [tarayici, sistem].filter(Boolean).join(' · ') || 'Tarayıcı', ad: ozelAd() || varsayilanAd(tur, CID) };
  }

  /* ------------------------------------------------- BULUT */
  function kullanici() {
    try { var u = window.firebase && firebase.auth && firebase.auth().currentUser; return (u && !u.isAnonymous) ? u : null; }
    catch (e) { return null; }
  }
  function belge(uid) {
    try { return firebase.firestore().collection('kullanicilar').doc(uid); } catch (e) { return null; }
  }
  function alanYaz(uid, deger) {
    var b = belge(uid); if (!b) return Promise.resolve(false);
    var g = {}; g['cihazlar.' + CID] = deger;
    try { return b.update(g).then(function () { return true; }, function () { return false; }); }
    catch (e) { return Promise.resolve(false); }
  }
  function zamanAsimi(p, ms) {
    return new Promise(function (bitir) { var t = setTimeout(function () { bitir(false); }, ms); p.then(function (v) { clearTimeout(t); bitir(v); }, function () { clearTimeout(t); bitir(false); }); });
  }

  var D = {
    uid: null, liste: {}, ilkGeldi: false, yeniGiris: false, sonDurum: undefined,
    cikiyor: false, dinleyici: null, istenen: {},    /* çıkış yaptırılan cihaz: istek zamanı */
    rol: '', temiz: false                            /* hesabın rolü (belgeden) · öğrencide eski kayıt silindi mi */
  };
  /* cihaz özellikleri yalnız öğretmen ve yöneticide (24.10.2026) */
  function rolNe() {
    if (D.rol) return D.rol;
    try { return (typeof appState !== 'undefined' && appState && appState.userRole) || ''; } catch (e) { return ''; }
  }
  function yetkili() { var r = rolNe(); return r === 'teacher' || r === 'admin'; }

  function kayitYaz(zorla) {
    var u = kullanici();
    if (!u || u.uid !== D.uid || !D.ilkGeldi || D.cikiyor || !yetkili()) return;
    var b = D.liste[CID], simdi = Date.now();
    var son = +yerelAl(ANAHTAR_YAZ + '_' + u.uid) || 0;
    var bil = cihazBilgi();
    /* ad, tür ya da tarayıcı değiştiyse (ad verildi, Sınıf Ekranı oldu, dil) hemen yazılır */
    var eskimis = !!(b && (b.ad !== bil.ad || b.tur !== bil.tur || b.tarayici !== bil.tarayici));
    if (!zorla && !eskimis && b && !b.cik && simdi - Math.max(son, +b.son || 0) < NABIZ) return;
    var giris = (b && !b.cik && b.giris && !D.yeniGiris) ? +b.giris : simdi;
    D.yeniGiris = false;
    yerelYaz(ANAHTAR_YAZ + '_' + u.uid, String(simdi));
    alanYaz(u.uid, { ad: bil.ad, tarayici: bil.tarayici, tur: bil.tur, giris: giris, son: simdi });
  }

  /* Bu cihazın kaydını sil (çıkıştan ÖNCE: yetki gerekiyor) */
  function kendiniSil() {
    var u = kullanici();
    if (!u || !yetkili()) return Promise.resolve(false);           /* öğrencinin kaydı yok */
    var sil = null;
    try { sil = firebase.firestore.FieldValue.delete(); } catch (e) { return Promise.resolve(false); }
    return zamanAsimi(alanYaz(u.uid, sil), 1500);
  }

  /* Başka bir cihazdan kapatıldı: bu cihaz kendini siler, çıkar, söyler */
  function uzaktanKapat() {
    if (D.cikiyor) return;
    D.cikiyor = true;
    try { sessionStorage.setItem('kidef_cihaz_kapatildi', '1'); } catch (e) { }
    var a = firebase.auth();
    kendiniSil().then(function () {
      try {
        if (typeof window.cikisYap === 'function') window.cikisYap();
        else a.signOut();
      } catch (e) { try { a.signOut(); } catch (x) { } }
    });
  }
  function kapatildiBildir() {
    var var_ = false;
    try { var_ = sessionStorage.getItem('kidef_cihaz_kapatildi') === '1'; sessionStorage.removeItem('kidef_cihaz_kapatildi'); } catch (e) { }
    if (!var_) return;
    var m = kd('cih.kapatildi', 'Bu cihazdaki oturumun başka bir cihazdan kapatıldı. Yeniden kullanmak için giriş yapabilirsin.');
    setTimeout(function () {
      try { if (typeof window.showCustomAlert === 'function') { window.showCustomAlert(m); return; } } catch (e) { }
      try { alert(m); } catch (e) { }
    }, 400);
  }

  function snapGeldi(doc) {
    if (!doc || !doc.exists) { D.ilkGeldi = true; D.liste = {}; arayuzTazele(); return; }
    var v = doc.data() || {};
    D.rol = String(v.role || '');
    if (!yetkili()) {
      /* öğrenci: cihaz özellikleri yok — eski kayıtlar bir kez silinir, dinleme biter (24.10.2026) */
      D.liste = {}; D.ilkGeldi = true;
      if (!D.temiz && v.cihazlar && typeof v.cihazlar === 'object' && Object.keys(v.cihazlar).length) {
        D.temiz = true;
        try { belge(D.uid).update({ cihazlar: firebase.firestore.FieldValue.delete() }).catch(function () { }); } catch (e) { }
      }
      if (D.dinleyici) { try { D.dinleyici(); } catch (e) { } D.dinleyici = null; }
      arayuzTazele();
      return;
    }
    D.liste = (v.cihazlar && typeof v.cihazlar === 'object') ? v.cihazlar : {};
    var ilk = !D.ilkGeldi;
    D.ilkGeldi = true;
    /* kapatma isteği sonuçlandı (cihaz kaydını sildi ya da yeniden giriş yaptı) */
    for (var k in D.istenen) {
      if (Object.prototype.hasOwnProperty.call(D.istenen, k) && !(D.liste[k] && D.liste[k].cik)) delete D.istenen[k];
    }
    var b = D.liste[CID];
    /* Çıkış işareti: başka bir cihaz bu cihazı kapattı. Sayfa açıkken yeni
       giriş yapıldıysa işaret ESKİDİR (kayıt hemen yeniden yazılır, işaret
       kalkar). Cihazların saati farklı olabildiği için zaman karşılaştırılmaz. */
    if (b && b.cik && !D.yeniGiris) { uzaktanKapat(); return; }
    if (ilk || !b || b.cik) kayitYaz(true);
    arayuzTazele();
  }

  function dinle(u) {
    if (D.dinleyici) { try { D.dinleyici(); } catch (e) { } D.dinleyici = null; }
    D.liste = {}; D.ilkGeldi = false; D.istenen = {}; D.rol = ''; D.temiz = false;
    if (!u) { arayuzTazele(); return; }
    var b = belge(u.uid);
    if (!b) return;
    try { D.dinleyici = b.onSnapshot(snapGeldi, function () { /* okunamadı: liste boş kalır */ }); } catch (e) { }
  }

  /* ------------------------------------------------- ÇIKIŞ: önce kayıt silinir */
  function cikisSar() {
    var a;
    try { a = firebase.auth(); } catch (e) { return false; }
    if (!a || a.signOut.__kidefCihaz) return true;
    var asil = a.signOut;
    var yeni = function () {
      var self = this, args = arguments;
      return kendiniSil().then(function () { return asil.apply(a, args); }, function () { return asil.apply(a, args); });
    };
    yeni.__kidefCihaz = 1;
    a.signOut = yeni;
    return true;
  }

  function baglan() {
    try {
      if (!(window.firebase && firebase.auth && firebase.firestore && firebase.apps && firebase.apps.length)) return false;
      cikisSar();
      firebase.auth().onAuthStateChanged(function (u) {
        var uid = (u && !u.isAnonymous) ? u.uid : null;
        /* sayfa açıkken yapılan giriş: eski bir çıkış işareti bu girişi düşürmesin */
        D.yeniGiris = !!(uid && D.sonDurum === null);
        D.sonDurum = uid;
        D.cikiyor = false;
        if (uid !== D.uid) { D.uid = uid; dinle(uid ? u : null); }
        if (!uid) { pencereKapat(); kapatildiBildir(); }
        arayuzTazele();
      });
      return true;
    } catch (e) { return false; }
  }
  if (!baglan()) { var n = 0, t = setInterval(function () { if (baglan() || ++n > 80) clearInterval(t); }, 150); }

  setInterval(function () { if (!document.hidden) kayitYaz(false); }, 60000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) kayitYaz(false); });
  /* ad başka sayfada (Sınıf Ekranı «Ad ver», tahta işareti) değişti; dil değişti */
  window.addEventListener('storage', function (e) {
    if (e && e.key && !/^kidef_(cihaz_ad|tahta_ad|tahta_cihaz)$/.test(e.key)) return;
    kayitYaz(false); arayuzTazele();
  });
  document.addEventListener('kidef:dil', function () { kayitYaz(false); arayuzTazele(); });

  /* ------------------------------------------------- LİSTE */
  function siraliListe() {
    var l = [], simdi = Date.now();
    for (var k in D.liste) {
      if (!Object.prototype.hasOwnProperty.call(D.liste, k)) continue;
      var c = D.liste[k];
      if (!c || typeof c !== 'object') continue;
      var tur = c.tur || 'bilgisayar', yeni = typeof c.tarayici === 'string';
      var ad = yeni ? (c.ad || varsayilanAd(tur, k)) : varsayilanAd(tur, k), tar = yeni ? c.tarayici : (c.ad || '');
      if (k === CID) { var bb = cihazBilgi(); tur = bb.tur; ad = bb.ad; tar = bb.tarayici; }      /* bu cihaz: güncel ad */
      l.push({ id: k, ad: ad, tarayici: tar, tur: tur, giris: +c.giris || 0, son: +c.son || 0,
               cik: +c.cik || 0, ben: k === CID, eski: simdi - (+c.son || 0) > ESKI });
    }
    l.sort(function (a, b) { return (b.ben - a.ben) || (b.son - a.son); });
    return l;
  }
  function digerSayisi() {
    return siraliListe().filter(function (c) { return !c.ben && !c.cik && !c.eski; }).length;
  }
  function onceMetni(z) {
    if (!z) return '';
    var f = Math.max(0, Date.now() - z), dk = Math.floor(f / 60000);
    if (dk < 2) return kd('cih.simdi', 'şimdi');
    if (dk < 60) return kd('cih.dk_once', '{n} dk önce', { n: dk });
    var sa = Math.floor(dk / 60);
    if (sa < 24) return kd('cih.sa_once', '{n} saat önce', { n: sa });
    var gun = Math.floor(sa / 24);
    if (gun === 1) return kd('cih.dun', 'dün');
    return kd('cih.gun_once', '{n} gün önce', { n: gun });
  }
  var TUR_AD = { bilgisayar: 'Bilgisayar', telefon: 'Telefon', tablet: 'Tablet', tahta: 'Akıllı tahta' };
  var TUR_SVG = {
    bilgisayar: '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M8.5 20h7M12 16.5V20"/>',
    telefon: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.6"/><path d="M10.6 18.4h2.8"/>',
    tablet: '<rect x="4" y="2.8" width="16" height="18.4" rx="2.4"/><path d="M10.6 18.2h2.8"/>',
    tahta: '<rect x="2.5" y="3.5" width="19" height="12.5" rx="1.8"/><path d="M7 7.8h7M7 11h4.6"/><path d="M12 16v3M8.4 21.2 12 18.8l3.6 2.4"/>'
  };
  function turSvg(t) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + (TUR_SVG[t] || TUR_SVG.bilgisayar) + '</svg>';
  }

  /* ------------------------------------------------- PENCERE */
  function stilKur() {
    if (document.getElementById('cihStil')) return;
    var s = document.createElement('style');
    s.id = 'cihStil';
    s.textContent = [
      '#' + PENCERE_ID + '{ position:fixed; inset:0; z-index:1000090; display:flex; align-items:center;',
      '  justify-content:center; padding:16px; background:rgba(0,0,0,.55); backdrop-filter:blur(4px); }',
      '#' + PENCERE_ID + ' .cih-kart{ background:#fff; width:100%; max-width:480px; max-height:calc(100vh - 32px);',
      '  display:flex; flex-direction:column; border-radius:16px; overflow:hidden; box-shadow:0 18px 46px rgba(0,0,0,.35);',
      '  font-family:inherit; }',
      '#' + PENCERE_ID + ' .cih-bas{ flex:none; display:flex; align-items:center; gap:10px; color:#fff; padding:12px 12px 12px 16px;',
      '  font-weight:700; background:linear-gradient(135deg,#E74C3C,#C0392B); }',
      '#' + PENCERE_ID + ' .cih-bas span{ flex:1; }',
      '#' + PENCERE_ID + ' .cih-x{ border:0; background:rgba(255,255,255,.18); color:#fff; width:32px; height:32px;',
      '  border-radius:50%; cursor:pointer; font-size:18px; line-height:1; }',
      '#' + PENCERE_ID + ' .cih-govde{ padding:16px; overflow-y:auto; }',
      '#' + PENCERE_ID + ' .cih-not{ margin:0 0 14px; color:#6B4A38; line-height:1.55; }',
      '#' + PENCERE_ID + ' .cih-tus{ display:flex; width:100%; align-items:center; justify-content:center; gap:8px;',
      '  padding:12px; border:none; border-radius:11px; cursor:pointer; font-family:inherit; font-weight:700; font-size:1rem; }',
      '#' + PENCERE_ID + ' .cih-cik{ color:#fff; background:linear-gradient(135deg,#E74C3C,#C0392B); }',
      '#' + PENCERE_ID + ' .cih-hepsi{ margin-top:10px; color:#C0392B; background:#FEF5F5; border:1px solid #FDE2E2; }',
      '#' + PENCERE_ID + ' .cih-vazgec{ margin-top:10px; color:#B34700; background:#fff; border:1px solid #F0DACA; }',
      '#' + PENCERE_ID + ' .cih-alt{ margin:18px 0 8px; font-weight:800; color:#1F2430; font-size:.95rem; }',
      '#' + PENCERE_ID + ' .cih-liste{ display:flex; flex-direction:column; gap:8px; }',
      '#' + PENCERE_ID + ' .cih-oge{ display:flex; align-items:center; gap:11px; padding:10px 11px; border:1px solid #E7ECF2;',
      '  border-radius:13px; background:#F8FAFC; }',
      '#' + PENCERE_ID + ' .cih-oge.ben{ background:#EAF6F3; border-color:#BFE3D9; }',
      '#' + PENCERE_ID + ' .cih-oge.soluk{ opacity:.6; }',
      '#' + PENCERE_ID + ' .cih-simge{ flex:none; width:38px; height:38px; border-radius:11px; display:flex;',
      '  align-items:center; justify-content:center; background:#fff; color:#16A085; border:1px solid #DCE9E5; }',
      '#' + PENCERE_ID + ' .cih-simge svg{ width:22px; height:22px; }',
      '#' + PENCERE_ID + ' .cih-yazi{ flex:1; min-width:0; }',
      '#' + PENCERE_ID + ' .cih-ad{ font-weight:800; color:#1F2430; font-size:.95rem; overflow-wrap:anywhere; }',
      '#' + PENCERE_ID + ' .cih-ust{ font-size:.82rem; color:#6B7785; margin-top:2px; }',
      '#' + PENCERE_ID + ' .cih-ust b{ color:#0E7C66; }',
      '#' + PENCERE_ID + ' .cih-kucuk{ flex:none; border:1px solid #F3C7C1; background:#fff; color:#C0392B; cursor:pointer;',
      '  font-family:inherit; font-weight:800; font-size:.82rem; border-radius:999px; padding:7px 12px; white-space:nowrap; }',
      '#' + PENCERE_ID + ' .cih-kucuk:disabled{ opacity:.6; cursor:default; }',
      '#' + PENCERE_ID + ' .cih-kucuk.gri{ border-color:#DCE2EA; color:#5A6B78; }',
      /* çıkış tuşundaki sayı */
      '#logout-btn{ position:relative; }',
      '#logout-btn .cih-rozet{ position:absolute; top:-6px; right:-6px; min-width:18px; height:18px; padding:0 5px;',
      '  border-radius:999px; background:#fff; color:#C0392B; border:2px solid #C0392B; font-size:11px; font-weight:800;',
      '  line-height:14px; box-sizing:border-box; text-align:center; pointer-events:none; }',
      '#kdCekmece #logout-btn .cih-rozet{ position:static; margin-left:auto; }'
    ].join('\n');
    (document.head || document.documentElement).appendChild(s);
  }

  function pencereKapat() {
    var p = document.getElementById(PENCERE_ID);
    if (p && p.parentNode) p.parentNode.removeChild(p);
    document.removeEventListener('keydown', escKapat, true);
  }
  function escKapat(e) { if (e.key === 'Escape') { e.stopPropagation(); pencereKapat(); } }

  function kisiMetni() {
    var rol = '', ad = '';
    try {
      rol = (typeof appState !== 'undefined' && appState.userRole) || '';
      ad = (typeof appState !== 'undefined' && appState.currentUserName) || '';
      if (!ad || ad === 'Öğrenci' || ad === 'Belirtilmedi') ad = (appState && appState.currentUser) || '';
    } catch (e) { }
    var rolAd = rol === 'admin' ? kd('cih.rol_yonetici', 'Yönetici') : (rol === 'teacher' ? kd('cih.rol_ogretmen', 'Öğretmen') : kd('cih.rol_ogrenci', 'Öğrenci'));
    return { rol: rolAd, ad: ad };
  }

  function pencereCiz() {
    var p = document.getElementById(PENCERE_ID);
    if (!p) return;
    var govde = p.querySelector('.cih-govde');
    var l = siraliListe(), diger = digerSayisi();
    var k = kisiMetni();
    var h = '<p class="cih-not">' + kac(kd('cih.not', '{rol} oturumunu kapatıyorsun{ad}. Kayıtlı bilgilerin silinmez.',
      { rol: k.rol, ad: k.ad ? ' (' + k.ad + ')' : '' })) + '</p>' +
      '<button type="button" class="cih-tus cih-cik" data-is="buradan">' + kac(kd('cih.bu_cihaz_cik', 'Bu cihazdan çıkış yap')) + '</button>';
    if (diger > 0) h += '<button type="button" class="cih-tus cih-hepsi" data-is="hepsi">' +
      kac(kd('cih.hepsi_cik', 'Bütün cihazlardan çıkış yap ({n} cihaz daha)', { n: diger })) + '</button>';
    h += '<div class="cih-alt">' + kac(kd('cih.baslik', 'Hesabının açık olduğu cihazlar')) + ' (' + l.filter(function (c) { return !c.eski; }).length + ')</div>';
    h += '<div class="cih-liste">';
    if (!l.length) h += '<div class="cih-ust">' + kac(kd('cih.yukleniyor', 'Liste yükleniyor…')) + '</div>';
    l.forEach(function (c) {
      var istek = D.istenen[c.id];
      var ust;
      if (c.ben) ust = '<b>' + kac(kd('cih.bu', 'Bu cihaz')) + '</b>';
      else if (c.cik || istek) ust = kac((istek && Date.now() - istek < 15000) || (c.cik && Date.now() - c.cik < 15000)
        ? kd('cih.kapaniyor', 'Kapatılıyor…') : kd('cih.istendi', 'Çıkış istendi · cihaz açılınca kapanır'));
      else ust = kac(kd('cih.son_gorulme', 'son görülme: {z}', { z: onceMetni(c.son) })) +
        (c.eski ? ' · ' + kac(kd('cih.eski', 'uzun süredir kullanılmadı')) : '');
      if (c.tarayici) ust += ' · ' + kac(c.tarayici);
      var tus = c.ben ? '<button type="button" class="cih-kucuk gri" data-is="ad">' + kac(kd('cih.ad_ver', 'Ad ver')) + '</button>' : '';
      if (!c.ben) {
        /* İşaretli kayıt silinmez: kapalı cihaz açılınca işareti görüp çıkacak.
           Yalnız uzun süredir görülmeyen kayıt listeden kaldırılabilir. */
        if (c.eski) tus = '<button type="button" class="cih-kucuk gri" data-is="sil" data-id="' + kac(c.id) + '">' + kac(kd('cih.listeden_sil', 'Listeden kaldır')) + '</button>';
        else if (!c.cik) tus = '<button type="button" class="cih-kucuk" data-is="kapat" data-id="' + kac(c.id) + '"' + (istek ? ' disabled' : '') + '>' +
          kac(kd('cih.kapat', 'Çıkış yaptır')) + '</button>';
      }
      h += '<div class="cih-oge' + (c.ben ? ' ben' : '') + ((c.cik || c.eski) && !c.ben ? ' soluk' : '') + '">' +
        '<span class="cih-simge" title="' + kac(kd('cih.tur_' + c.tur, TUR_AD[c.tur] || 'Cihaz')) + '">' + turSvg(c.tur) + '</span>' +
        '<span class="cih-yazi"><div class="cih-ad">' + kac(c.ad) + '</div>' +
        '<div class="cih-ust">' + ust + '</div></span>' + tus + '</div>';
    });
    h += '</div><button type="button" class="cih-tus cih-vazgec" data-is="vazgec">' + kac(kd('cih.vazgec', 'Vazgeç')) + '</button>';
    govde.innerHTML = h;
  }

  function pencereAc() {
    stilKur();
    pencereKapat();
    var p = document.createElement('div');
    p.id = PENCERE_ID;
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-modal', 'true');
    p.innerHTML = '<div class="cih-kart"><div class="cih-bas"><span>' + kac(kd('cih.pencere', 'Çıkış yap')) + '</span>' +
      '<button type="button" class="cih-x" data-is="vazgec" aria-label="' + kac(kd('g.kapat', 'Kapat')) + '">✕</button></div>' +
      '<div class="cih-govde"></div></div>';
    document.body.appendChild(p);
    p.addEventListener('click', function (e) {
      if (e.target === p) { pencereKapat(); return; }
      var t = e.target.closest ? e.target.closest('[data-is]') : null;
      if (!t) return;
      var is = t.getAttribute('data-is'), id = t.getAttribute('data-id');
      if (is === 'vazgec') pencereKapat();
      else if (is === 'buradan') { pencereKapat(); buradanCik(); }
      else if (is === 'hepsi') { pencereKapat(); hepsindenCik(); }
      else if (is === 'kapat' && id) uzaktanCikar([id]);
      else if (is === 'sil' && id) kayitSil(id);
      else if (is === 'ad') adVer();
    });
    document.addEventListener('keydown', escKapat, true);
    pencereCiz();
  }

  /* ------------------------------------------------- İŞLER */
  function adVer() {
    var bil = cihazBilgi();
    var y = window.prompt(kd('cih.ad_sor', 'Bu cihazın adı (ör. Öğretmen masası, 7-A tahtası):'), bil.ad);
    if (y === null) return;
    y = String(y).trim().slice(0, 40);
    if (y === varsayilanAd(bil.tur, CID)) y = '';
    try {
      if (y) localStorage.setItem('kidef_cihaz_ad', y); else localStorage.removeItem('kidef_cihaz_ad');
      localStorage.removeItem('kidef_tahta_ad');
    } catch (e) { }
    kayitYaz(true);
    pencereCiz();
  }
  function buradanCik() {
    try { if (typeof window.cikisYap === 'function') { window.cikisYap(); return; } } catch (e) { }
    try { firebase.auth().signOut(); } catch (e) { }
  }
  function uzaktanCikar(idler) {
    var u = kullanici();
    if (!u || !idler.length) return Promise.resolve();
    var b = belge(u.uid); if (!b) return Promise.resolve();
    var g = {}, simdi = Date.now();
    idler.forEach(function (id) {
      if (id === CID) return;
      g['cihazlar.' + id + '.cik'] = simdi;
      D.istenen[id] = simdi;
    });
    pencereCiz();
    setTimeout(pencereCiz, 15500);
    try { return b.update(g).catch(function () { }); } catch (e) { return Promise.resolve(); }
  }
  function hepsindenCik() {
    var digerleri = siraliListe().filter(function (c) { return !c.ben && !c.cik; }).map(function (c) { return c.id; });
    var bekle = zamanAsimi(uzaktanCikar(digerleri), 1500);
    bekle.then(buradanCik, buradanCik);
  }
  function kayitSil(id) {
    var u = kullanici(); if (!u || id === CID) return;
    var b = belge(u.uid); if (!b) return;
    var g = {};
    try { g['cihazlar.' + id] = firebase.firestore.FieldValue.delete(); } catch (e) { return; }
    try { b.update(g).catch(function () { }); } catch (e) { }
  }

  /* ------------------------------------------------- ÇIKIŞ TUŞU */
  function rozetTazele() {
    var t = document.getElementById('logout-btn');
    if (!t) return;
    var n = (kullanici() && yetkili()) ? digerSayisi() : 0;       /* öğrencide rozet yok */
    var r = t.querySelector('.cih-rozet');
    if (n > 0) {
      stilKur();
      if (!r) { r = document.createElement('span'); r.className = 'cih-rozet'; t.appendChild(r); }
      if (r.textContent !== String(n)) r.textContent = String(n);
      t.title = kd('cih.tus_ipucu', 'Çıkış Yap · hesabın {n} cihazda daha açık', { n: n });
    } else if (r) { r.parentNode.removeChild(r); t.title = kd('g.cikis', 'Çıkış Yap'); }
  }
  function arayuzTazele() {
    rozetTazele();
    if (document.getElementById(PENCERE_ID)) pencereCiz();
  }
  setInterval(arayuzTazele, 30000);

  /* Çıkış tuşu (hesap/auth.js → cikisOnayla) artık bu pencereyi açar.
     Misafirde eskisi gibi doğrudan çıkar; öğrencide (24.10.2026) eski kısa
     onay sorulur — cihaz listesi yalnız öğretmen ve yöneticide. */
  function onaySar() {
    if (typeof window.cikisOnayla !== 'function' || window.cikisOnayla.__kidefCihaz) return;
    var eski = window.cikisOnayla;
    var yeni = function () {
      var misafir = false;
      try { misafir = (typeof appState !== 'undefined' && appState.currentUser === 'Misafir Öğrenci'); } catch (e) { }
      if (misafir || !kullanici() || !yetkili()) return eski.apply(this, arguments);   /* öğrenci: kısa onay */
      pencereAc();
    };
    yeni.__kidefCihaz = 1;
    window.cikisOnayla = yeni;
  }
  onaySar();
  window.addEventListener('load', onaySar);
  setTimeout(onaySar, 1500);

  window.KidefCihazlar = {
    ac: pencereAc, kapat: pencereKapat, liste: siraliListe, kimlik: function () { return CID; },
    ad: function () { return cihazBilgi().ad; },
    cikar: uzaktanCikar, _d: D
  };
})();
