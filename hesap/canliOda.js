/* ======================================================================
   KIDEF · CANLI DERS ODASI — hesap/canliOda.js (tahta.html kabuğunda)
   ----------------------------------------------------------------------
                                                            05.11.2026
   Yönetici: "amacım arapça dersleri için tasarlanmış bi canlı ders odası kurmak,
   hatta amacımız kameradan çok sitedeki dosyaları kolaylıkla yansıtmak … öğrencinin
   cihazına öğretmenin kullandığı şekilde yansıtmak … kusursuz olmalı … sitede zaten
   kumanda özelliği var, zaten öğretmen de öğrenci de giriş yapmak zorunda".

   ODA = TAHTA KABUĞU. Sayfa yansıtmayı sistem/tahta.js yapar (canlı kipi: kök
   canli/<oda>/oda; öğretmen kumanda, öğrenciler izler — Sınıf Ekranı gibi).
   Bu dosya kabuğun üstüne küçük bir pencere koyar (sol alt): ses, çağrı, katılımcılar, söz.

   ÇOK ÖĞRENCİ + SÖZ (26.11.2026) — yönetici: "canlı derste iken herhangi bi öğrencinin ekranını ve
   siteyi kullanma özelliğini aktif edelim, çoklu öğrenci olabilsin sistemde". Seçimleri: ses = herkes
   öğretmeni ve SÖZ ALAN öğrenciyi duyar, öbür öğrencileri yalnız öğretmen duyar · söz alan sitenin
   tamamını kullanır, öğretmen sözü her an geri alır · öğrenci «Söz iste» ile el kaldırır.
   · ÇAĞRI: öğretmen tek tek ya da bir sınıfı birden çağırır. Çağrılanlar canli/<oda>/davetliler/<uid> =
     { ad, t } (okuma izni buna bağlı; ilk çağrılan ayrıca «davetli»: eski kuralla tek öğrencili ders
     çalışsın), canliCagri/<uid> = { oda, ad, t } → öğrencinin ana sayfasında kart (hesap/canliders.js).
     «Çıkar»: öğrencinin kaydı, çağrısı, ses ve varlık kayıtları silinir; cihazı dersten çıkar.
   · SÖZ: «Söz ver» → sistem/tahta.js oda/ayar/soz = <uid>. O öğrenci sayfasına dokununca lider olur
     (akıllı tahtadaki «Tahtadan da kullan» gibi): yaptıkları öğretmende ve öbür öğrencilerde aynen
     görünür; öğretmen dokununca kontrol yine öğretmende. «Sözü al» → öğrenci yeniden yalnız izler.
     Söz sahibi dersten düşerse söz 15 sn sonra kendiliğinden geri alınır.
   · EL KALDIRMA: öğrenci «Söz iste» → ses/ogr/<uid>/el = zaman; öğretmenin listesinde el işareti ve
     bildirim. Söz verilince el iner.
   · SES (ve istenirse kamera): WebRTC. İşaretleşme aynı odada:
       canli/<oda>/ses/ogt        = { kimlik, kip, t, kamera, mik, sfu:{sid,ses,kamera} }          (öğretmen, ortak)
       canli/<oda>/ses/ogtk/<uid> = { cevap:{type,sdp,n}, aday/*, yenile }                         (öğretmen, öğrenci başına)
       canli/<oda>/ses/ogr/<uid>  = { n, icin, kip, teklif, aday/*, kamera, mik, istat, sfu, el }  (öğrenci)
     EŞTEN EŞE (SFU yoksa): öğretmen her öğrenciyle ayrı bağlantı kurar (yıldız). Öğrenci TEKLİF eder
     (öğretmenin kimliğini görünce / kimlik değişince / «yenile»), öğretmen cevaplar. Teklifte üçüncü bir
     ses yolu daha vardır (yalnız alır): öğretmen SÖZ ALAN öğrencinin sesini öbür öğrencilere bu yoldan
     aktarır (replaceTrack; yeniden anlaşma yok). Kamera: görüntü yolu baştan ayrılır, açılınca iz değişir.
     SFU (Cloudflare Realtime; Cloud Function «sfu»): her katılımcı kendi oturumunu açar, mikrofonunu
     yayınlar. Öğretmen bütün öğrencilerin sesine, öğrenciler öğretmenin sesine (ve kamerasına) ve söz
     alanın sesine abone olur; söz değişince eski abonelik kapatılır. Öğretmen kipi seçer
     (ses/ogt/kip: 'sfu' | 'p2p'); SFU işlevi yoksa / hata verirse eşten eşe yol.
     Öğretmen, kamerası açık öğrencilerden birini görür (söz alan; yoksa ilk açan). Öğrenciler yalnız
     öğretmenin kamerasını görür. Mikrofon izni yoksa yalnız dinler.
     Bağlantı sunucusu: Cloudflare TURN (turnKimlik fonksiyonu, REST; 4 saat önbellek kidef_turn),
     olmazsa Google STUN + açık aktarıcı.
   · «Dersi bitir» (öğretmen): çağrılar ve ses kayıtları silinir, kumandanın Bitir'i basılır (tahta.js:
     yayin/bitir → öğrenciler ana sayfaya döner). «Dersten ayrıl» (öğrenci): kendi çağrısını ve ses
     kaydını siler, kabuktan çıkar; öğretmen odada kalır, yeniden çağırabilir.
   · KULLANIM ÖLÇÜMÜ (06.11.2026) — yönetici: "öğretmenler de bu sistemi kullanmak isterse ona göre
     ücret öderler ama video açarlarsa ve para harcanırsa". Her 10 sn'de getStats (bütün bağlantılar):
     ses / görüntü ve aktarıcıdan geçen baytlar. Her öğrenci kendi sayaçlarını ses/ogr/<uid>/istat'a
     yazar; öğretmen hepsini toplar, ders bitince (derste kimse 60 sn yok · Bitir · sekme kapanır)
     kullanicilar belgesine yazar — Firestore REST: canliKullanim.<YYYY-MM>.{ders,sn,kameraSn,sesMB,
     goruntuMB,aktarMB,son} artışları + canliDersler dizisine kayıt (çok öğrencide ad: adlar, ogrSay).
     Yazılamazsa localStorage kuyruğu (kidef_canli_bekleyen). Kamera: ilk açışta uyarı.
     Yönetici panelinde gösterim: hesap/canlikullanim.js.
   · VERİTABANI KURALI: çok öğrenci ve söz, kuralın yeni hâliyle çalışır (canliSurum okunabiliyorsa
     kurulu). Eski kuralda pencere tek öğrencili derse döner (başkası çağrılınca önceki çıkar, söz yok)
     ve bunu yazıyla söyler. Kural: _kaynak/rtdb-kurallar-2026-11-26.json, özeti sistem/tahta.js.
   · DESTEKÇİYE AÇIK (23.11.2026) — yönetici: "canlı ders özelliğini de aktif edelim, sadece destek verenler
     kullanabilecek". Ana sayfadaki düğmeler (hesap/canliders.js) kapıdan geçirir; bu dosya ikinci kapıdır: öğretmen
     görünümünde destekçi değilse (yönetici serbest) ses ve çağrı başlamaz, «Canlı ders destekçilere açık» ekranı çıkar.
     Öğrenci görünümü etkilenmez.
   ====================================================================== */
(function () {
  'use strict';
  if (window.KidefCanliOda) return;
  var T = window.KidefTahta, ODA = T && T.canli;
  if (!ODA) { window.KidefCanliOda = { acik: false }; return; }
  var OGR = !!T.canliOgr, BEN = T.id;
  /* izni olmayan / kalkan öğrencinin (çağrılmadı · çıkarıldı · ders bitti) reddedilen yazımları beklenen durumdur: konsolu
     doldurmasın. Dosya yüklenirken kurulur (yansıtma motorunun ilk yazımlarından önce). */
  if (OGR) window.addEventListener('unhandledrejection', function (e) {
    var r = e && e.reason;
    if (r && (r.code === 'PERMISSION_DENIED' || /permission[_ ]denied/i.test(String(r.message || r)))) { try { e.preventDefault(); } catch (x) { } }
  });
  var FN_ADRES = 'https://europe-west1-kidefarapca-98f9c.cloudfunctions.net/turnKimlik';
  var PROJE = 'kidefarapca-98f9c';
  var FS_KOK = 'projects/' + PROJE + '/databases/(default)/documents';
  var FS_ADRES = 'https://firestore.googleapis.com/v1/' + FS_KOK;
  var KUYRUK = 'kidef_canli_bekleyen';
  var SFU_ADRES = 'https://europe-west1-kidefarapca-98f9c.cloudfunctions.net/sfu';
  var SFU_PC = { iceServers: [{ urls: 'stun:stun.cloudflare.com:3478' }], bundlePolicy: 'max-bundle' };
  var ISTAT_ARALIK = 10000, DERS_KAPANMA = 60000;
  var EN_COK = 40;                       /* bir derse çağrılabilecek en çok öğrenci */
  var SOZ_BEKLE = 15000;                 /* söz sahibi dersten düştü: bu kadar sonra söz kendiliğinden geri alınır */
  var TURN_DEPO = 'kidef_turn';
  var YEDEK = { iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
    { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
    { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' }
  ], iceCandidatePoolSize: 4 };
  var has = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
  var SIMDI = function () { return Date.now(); };
  function $(id) { return document.getElementById(id); }
  function kac(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rastgele() { try { var a = new Uint32Array(2); crypto.getRandomValues(a); return a[0].toString(36) + a[1].toString(36); } catch (e) { return Math.random().toString(36).slice(2) + SIMDI().toString(36); } }
  function bildir(m, ms) { try { T.bildir(m, ms); } catch (e) { } }
  var TS = function () { return firebase.database.ServerValue.TIMESTAMP; };
  /* iz: son 200 olay (hata ayıklama: tarayıcı konsolunda KidefCanliOda.iz) */
  var IZ = [], IZD = [];               /* IZD: ders ve kayıt olayları (silinmez, en çok 100) */
  function iz(ad, ek) {
    var k = [SIMDI() % 1000000, ad, ek == null ? '' : String(ek).slice(0, 120)];
    IZ.push(k); if (IZ.length > 200) IZ.shift();
    if (ad === 'ders' || ad === 'kayit' || ad === 'kayitHata') { IZD.push(k); if (IZD.length > 100) IZD.shift(); }
  }

  var SVG = {
    mik: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></svg>',
    mikKapali: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8M4 4l16 16"/></svg>',
    kamera: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></svg>',
    kameraKapali: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3zM4 4l16 16"/></svg>',
    ses: '<svg viewBox="0 0 24 24"><path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>',
    cagir: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M18 8v6M15 11h6"/></svg>',
    bitir: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    kucult: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
    buyut: '<svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>',
    yenile: '<svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 21v-5h-5"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"/></svg>',
    /* 26.11.2026: el (söz iste), söz (dokunan parmak), öğrenciler, çıkar */
    el: '<svg viewBox="0 0 24 24"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V13"/><path d="M17 13V9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-4.6-2.2L4.6 15.2a1.5 1.5 0 0 1 2.3-1.9L8 14.5"/></svg>',
    soz: '<svg viewBox="0 0 24 24"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M12 10.5a1.5 1.5 0 0 1 3 0V12M15 11.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.5a6 6 0 0 1-4.7-2.3L4 16.3a1.5 1.5 0 0 1 2.3-1.9L9 16.5V11"/><path d="M5.5 7.5a5 5 0 0 1 10 0"/></svg>',
    ogrenciler: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/></svg>',
    cikar: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 11h6"/></svg>'
  };

  /* ------------------------------------------------------------ biçim */
  function stilKur() {
    if ($('cdStil')) return;
    var s = document.createElement('style'); s.id = 'cdStil';
    s.textContent = [
      '.cd-kutu{position:fixed;left:12px;bottom:12px;z-index:43;width:min(292px,calc(100vw - 24px));box-sizing:border-box;background:#0f2a43;color:#fff;',
      ' border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.32);font:600 13px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;overflow:hidden;',
      ' max-height:calc(100vh - 24px);max-height:calc(100dvh - 24px);display:flex;flex-direction:column}',
      '.cd-bas{display:flex;align-items:center;gap:8px;padding:9px 10px 9px 12px;cursor:pointer;user-select:none;-webkit-user-select:none;flex:none}',
      '.cd-bas b{flex:1;min-width:0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.cd-bas .cd-sure{font-weight:500;opacity:.75;font-variant-numeric:tabular-nums}',
      '.cd-nokta{width:10px;height:10px;border-radius:50%;background:#F4D03F;box-shadow:0 0 0 2px rgba(255,255,255,.18);flex:none}',
      '.cd-nokta.canli{background:#2ECC71}.cd-nokta.hata{background:#E74C3C}',
      '.cd-kucult{border:0;background:transparent;color:#fff;padding:2px;cursor:pointer;display:flex;flex:none}',
      '.cd-kutu svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:none}',
      '.cd-govde{padding:0 12px 12px;overflow:auto;-webkit-overflow-scrolling:touch;min-height:0}',
      '.cd-kutu.kucuk .cd-govde{display:none}',
      '.cd-durum{font-weight:500;opacity:.9;margin:0 0 8px;min-height:1em}',
      '.cd-durum.uyari{color:#F4D03F;opacity:1}',
      '.cd-video{position:relative;display:none;margin:0 0 8px;border-radius:10px;overflow:hidden;background:#000;aspect-ratio:4/3}',
      '.cd-video.var{display:block}',
      '.cd-video video{display:block;width:100%;height:100%;object-fit:cover;background:#000}',
      '.cd-video .cd-ben{position:absolute;right:6px;bottom:6px;width:34%;height:auto;aspect-ratio:4/3;border-radius:6px;border:1px solid rgba(255,255,255,.6);display:none}',
      '.cd-video .cd-ben.var{display:block}',
      '.cd-video .cd-uzak[hidden]{display:none}',
      '.cd-video.tek .cd-ben{position:static;width:100%;border:0;border-radius:0}',
      '.cd-video .cd-kim{position:absolute;left:6px;top:6px;max-width:70%;padding:2px 7px;border-radius:999px;background:rgba(0,0,0,.55);font-size:11px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.cd-video .cd-kim:empty{display:none}',
      '.cd-tuslar{display:flex;gap:6px;flex-wrap:wrap}',
      '.cd-dug{display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:#fff;border-radius:10px;',
      ' padding:7px 10px;font:inherit;font-weight:700;font-size:12px;cursor:pointer;-webkit-tap-highlight-color:transparent;position:relative}',
      '.cd-dug:hover{background:rgba(255,255,255,.16)}',
      '.cd-dug[aria-pressed="false"]{background:rgba(231,76,60,.28);border-color:rgba(231,76,60,.6)}',
      '.cd-dug.kirmizi{background:#B03A2E;border-color:#B03A2E}.cd-dug.kirmizi:hover{background:#962d23}',
      '.cd-dug.yesil{background:#16A085;border-color:#16A085}.cd-dug.yesil:hover{background:#128f76}',
      '.cd-dug.sari{background:#F4D03F;color:#0f2a43;border-color:#F4D03F}',
      '.cd-dug[hidden]{display:none}',
      '.cd-dug[disabled]{opacity:.45;cursor:default}',
      '.cd-rozet{position:absolute;right:-5px;top:-6px;min-width:17px;height:17px;padding:0 4px;box-sizing:border-box;border-radius:999px;background:#F4D03F;color:#0f2a43;',
      ' font-size:10.5px;font-weight:800;line-height:17px;text-align:center}',
      '.cd-liste{margin:8px 0 0;border-top:1px solid rgba(255,255,255,.14);padding-top:8px}',
      '.cd-liste[hidden]{display:none}',
      '.cd-liste .cd-sat{display:flex;align-items:center;gap:6px;padding:5px 0}',
      '.cd-liste .cd-sat>span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}',
      '.cd-liste .cd-sat small{display:block;font-weight:500;opacity:.7;font-size:11px;overflow:hidden;text-overflow:ellipsis}',
      '.cd-liste .cd-dug{padding:5px 8px}',
      '.cd-liste .cd-dug svg{width:17px;height:17px}',
      '.cd-liste .cd-n{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.3);flex:none}',
      '.cd-liste .cd-n.canli{background:#2ECC71}',
      '.cd-liste .cd-el{display:inline-flex;color:#F4D03F;animation:cdEl 1.1s ease-in-out infinite;flex:none}',
      '@keyframes cdEl{0%,100%{transform:translateY(0) rotate(0)}30%{transform:translateY(-2px) rotate(-10deg)}60%{transform:translateY(0) rotate(8deg)}}',
      '.cd-bolum{display:flex;align-items:center;gap:8px;margin:8px 0 2px;font-size:11px;font-weight:700;letter-spacing:.02em;opacity:.75}',
      '.cd-bolum:first-child{margin-top:0}',
      '.cd-bolum span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.cd-soz{display:flex;align-items:center;gap:8px;margin:0 0 8px;padding:7px 9px;border-radius:10px;background:rgba(244,208,63,.16);border:1px solid rgba(244,208,63,.55);font-size:12px}',
      '.cd-soz b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.cd-soz.bende{background:rgba(46,204,113,.2);border-color:rgba(46,204,113,.7)}',
      '.cd-soz[hidden]{display:none}',
      '.cd-ipucu{margin:8px 0 0;font-size:11px;font-weight:500;opacity:.7;line-height:1.35}',
      '.cd-bos{font-size:12px;font-weight:500;opacity:.8;margin:0}',
      '.cd-veri{margin:6px 0 0;font-size:11px;font-weight:500;opacity:.75;font-variant-numeric:tabular-nums}',
      '.cd-uyari{margin:8px 0 0;padding:8px 10px;border-radius:10px;background:rgba(244,208,63,.16);border:1px solid rgba(244,208,63,.55);font-size:12px;font-weight:500;line-height:1.4}',
      '.cd-uyari .cd-tuslar{margin-top:8px}',
      '#cdSesler{display:none}',
      /* canlı derste kalkan kumanda tuşları: «Tahtadan da kullan» yerine söz (bu pencerede), cihaz ad/işaret yok */
      'body.th-canli #thKipDug,body.th-canli [data-th="zkip"],body.th-canli [data-th="unut"],body.th-canli [data-th="ad"],',
      'body.th-canli .th-zadver,body.th-canli .th-zunut,body.th-canli .th-unut,body.th-canli [data-th="zperde"],body.th-canli #thHedef{display:none !important}',
      '@media (max-width:600px){.cd-kutu{width:min(272px,calc(100vw - 24px))}.cd-ipucu{display:none}',
      ' .cd-liste .cd-sat>span,.cd-soz b{white-space:normal;line-height:1.25}.cd-liste .cd-sat small{white-space:nowrap}}',
      /* yatay telefon (kısa ekran): pencere genişler, tuşlar tek satıra sığar (pencere kısalır) */
      '@media (max-height:500px) and (min-width:601px) and (pointer:coarse){.cd-kutu{width:min(340px,calc(100vw - 24px))}}',
      '@media (prefers-reduced-motion:reduce){.cd-liste .cd-el{animation:none}}',
      /* katılım bağlantısı (elle kopyalama kutusu) */
      '.cd-bag{display:block;width:100%;box-sizing:border-box;margin:6px 0 0;padding:6px 8px;border-radius:8px;border:1px solid rgba(255,255,255,.35);background:rgba(0,0,0,.25);color:#fff;font:12px/1.35 inherit;user-select:all;-webkit-user-select:all}',
      /* TELEFONDA KÜÇÜK KAMERA (06.11.2026) — yönetici: "telefondan katılan kişi için kamera görüntüsü çok daha
         küçük olsun": dar ekranda (dikey) ve kısa dokunmatik ekranda (yatay telefon) görüntü küçük kutu */
      '@media (max-width:600px),(max-height:500px) and (pointer:coarse){.cd-video{width:112px;max-width:50%}.cd-video .cd-ben{width:40%}}'
    ].join('\n');
    document.head.appendChild(s);
    document.body.classList.add('th-canli');
  }

  /* ------------------------------------------------------------ durum */
  var vt = null, auth = null, kok = null, UID = null, ADIM = '';
  var D = {
    davetliler: {}, davetli: null,                 /* çağrılanlar: uid → { ad, t }; davetli: ilk çağrılan (eski kuralla uyum) */
    izle: {}, yayin: null,
    ogt: null, ogtk: null, ogtGeldi: false, ogtkGeldi: false,     /* öğrenci: öğretmenin ses kaydı (ortak + bana özel) */
    ogr: {}, ogrGeldi: false,                      /* öğretmen: öğrencilerin ses kayıtları (uid → kayıt) */
    soz: null, sozAd: '', el: false,               /* söz kimde · öğrenci: söz istedi */
    kural: null,                                   /* veritabanı kuralı: 'yeni' (çok öğrenci + söz) | 'eski' | null (henüz bilinmiyor) */
    gorKim: null,                                  /* öğretmen: kamerası gösterilen öğrenci */
    katildiT: 0, mik: true, kucuk: false, sesKilit: false, mikHata: '', liste: [], listeAcik: false, cikiyor: false, hazir: false, baglanti: true,
    kameraSor: false, kameraOnay: false                                    /* kamera uyarısı (06.11.2026) */
  };
  function yeniEs(kim) {
    return { kim: kim, pc: null, n: null, icin: null, vSender: null, sozSender: null, sozTr: null, sozIz: null, sesIz: null, kamIz: null, uzak: null, bagli: false,
             bekleyen: [], kopZ: null, sonYenile: null, baglandiT: 0, deneme: 0, denemeZ: null, cevaplananN: null, adayKuyruk: null, bekciZ: null,
             gorulenAday: {}, istPc: null, istSon: null, istCift: null };
  }
  /* V: «ana» bağlantı — öğrencide öğretmenle eş bağlantısı; iki rolde de SFU oturumu. P: öğretmen, eşten eşe: uid → eş */
  var V = yeniEs('ana'); V.yerel = null; V.kam = null; V.ice = null;
  var P = {};
  /* SFU: kip (öğretmen seçer; öğrenci uyar), kendi oturumu, yayınlanan izler, abonelikler (anahtar: karşı oturum/iz), mid → kim */
  var SFU = { kip: null, sid: null, izler: {}, abone: {}, kimler: {}, midler: {}, mid: {}, midsiz: [], kuyruk: Promise.resolve(), baslatiliyor: null, hata: '', sozKim: null, sozRef: null };

  function liste() {
    try { var L = JSON.parse(sessionStorage.getItem('kidef_canli_liste') || '[]'); return Array.isArray(L) ? L.filter(function (s) { return s && s.uid; }) : []; } catch (e) { return []; }
  }
  function adim() {
    var a = '';
    try { a = sessionStorage.getItem('kidef_canli_ad') || ''; } catch (e) { }
    if (!a) { try { a = (auth.currentUser && auth.currentUser.displayName) || ''; } catch (e) { } }
    return (a || 'Öğretmen').slice(0, 40);
  }
  function cokMu() { return D.kural === 'yeni'; }                 /* çok öğrenci ve söz: yalnız yeni veritabanı kuralıyla */
  function cagrilanlar() {                                        /* çağrılma sırasıyla: [{ uid, ad, t }] */
    var L = [], d = D.davetliler || {};
    for (var u in d) if (has(d, u) && d[u]) L.push({ uid: u, ad: String(d[u].ad || 'Öğrenci'), t: +d[u].t || 0 });
    L.sort(function (a, b) { return (a.t - b.t) || (a.uid < b.uid ? -1 : 1); });
    return L;
  }
  function adOf(uid) { var v = D.davetliler[uid]; return String((v && v.ad) || 'Öğrenci'); }
  function ogrCihaz(uid) {                                        /* öğrencinin cihazı odada (motorun varlık kaydı) */
    var tek = null, say = 0;
    for (var k in D.izle) {
      if (!has(D.izle, k)) continue;
      var t = D.izle[k];
      if (!t || !t.cevrimici || t.cihaz !== 'tahta') continue;
      if (t.uid === uid) return t;
      if (!t.uid) { tek = t; say++; }
    }
    return (say === 1 && cagrilanlar().length === 1) ? tek : null;    /* uid'siz kayıt (eski sürüm cihaz): tek öğrenciyse onundur */
  }
  function ogrSes(uid) { var v = D.ogr[uid]; return !!(v && (v.teklif || (v.sfu && v.sfu.sid))); }    /* öğrencinin ses kaydı (teklif ya da SFU oturumu) */
  function derste(uid) { return !!ogrCihaz(uid) || ogrSes(uid); }
  function derstekiler() { return cagrilanlar().filter(function (s) { return derste(s.uid); }); }
  function sesBagli(uid) { return SFU.kip === 'sfu' ? !!(V.bagli && ogrSes(uid)) : !!(P[uid] && P[uid].bagli); }
  function ogretmenVar() { return !!(D.ogt && D.ogt.kimlik) || !!(D.yayin && D.yayin.cevrimici && D.yayin.cihaz !== 'tahta'); }
  function benimYol() { return OGR ? 'ses/ogr/' + UID : 'ses/ogt'; }

  /* ------------------------------------------------------------ pencere */
  function kutu() {
    var k = $('cdKutu');
    if (k) return k;
    stilKur();
    k = document.createElement('div'); k.id = 'cdKutu'; k.className = 'cd-kutu';
    k.innerHTML =
      '<div class="cd-bas" id="cdBas"><span class="cd-nokta" id="cdNokta"></span><b id="cdBaslik">Canlı ders</b><span class="cd-sure" id="cdSure"></span>' +
      '<button type="button" class="cd-kucult" id="cdKucult" aria-label="Küçült">' + SVG.kucult + '</button></div>' +
      '<div class="cd-govde">' +
      '<p class="cd-durum" id="cdDurum"></p>' +
      '<div class="cd-soz" id="cdSoz" hidden></div>' +
      '<div class="cd-video" id="cdVideo"><video id="cdGoruntu" class="cd-uzak" autoplay playsinline muted></video><span class="cd-kim" id="cdGorKim"></span><video id="cdBen" class="cd-ben" autoplay playsinline muted></video></div>' +
      '<div class="cd-tuslar" id="cdTuslar"></div>' +
      '<div id="cdUyari"></div>' +
      (OGR ? '' : '<p class="cd-veri" id="cdVeri"></p>') +
      (OGR ? '' : '<div class="cd-liste" id="cdListe" hidden></div>') +
      (OGR ? '' : '<p class="cd-ipucu">Kitaplar, etkinlikler ve oyunlar öğrencilerde aynen görünür; Sınıflarım, Listelerim ve ders modu gibi öğretmen araçları yansımaz. Söz verdiğin öğrenci sayfayı kullanır, herkes onu izler.</p>') +
      '</div><div id="cdSesler"></div>';
    document.body.appendChild(k);
    $('cdBas').addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('#cdKucult') === null && !D.kucuk) return;   /* başlık: yalnız küçükken açar */
      D.kucuk = !D.kucuk; ciz();
    });
    var tusIsi = function (e) {
      var b = e.target.closest ? e.target.closest('[data-cd]') : null;
      if (!b || b.disabled) return;
      var is = b.getAttribute('data-cd');
      if (is === 'mik') mikDegistir();
      else if (is === 'kamera') kameraIste();
      else if (is === 'kameraEvet') { D.kameraSor = false; D.kameraOnay = true; kameraDegistir(); }
      else if (is === 'kameraHayir') { D.kameraSor = false; ciz(); }
      else if (is === 'ses') sesAc();
      else if (is === 'mikdene') mikAc(true);
      else if (is === 'cagir') { D.listeAcik = !D.listeAcik; ciz(); }
      else if (is === 'bitir') bitir();
      else if (is === 'bag') baglantiPaylas();
      else if (is === 'ayril') ayril();
      else if (is === 'bagKapat') { D.bagGoster = false; ciz(); }
      else if (is === 'sozal') sozAl();
      else if (is === 'el') elDegistir();
    };
    $('cdTuslar').addEventListener('click', tusIsi);
    $('cdUyari').addEventListener('click', tusIsi);
    $('cdSoz').addEventListener('click', tusIsi);
    var l = $('cdListe');
    if (l) l.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null;
      if (!b || b.disabled) return;
      if (b.hasAttribute('data-uid')) cagir(b.getAttribute('data-uid'), b.getAttribute('data-ad'));
      else if (b.hasAttribute('data-sinif')) sinifiCagir(b.getAttribute('data-sinif'));
      else if (b.hasAttribute('data-soz')) { var u = b.getAttribute('data-soz'); if (D.soz === u) sozAl(); else sozVer(u); }
      else if (b.hasAttribute('data-cikar')) cikar(b.getAttribute('data-cikar'));
    });
    return k;
  }
  /* KATILIM BAĞLANTISI (06.11.2026) — yönetici: "canlı ders için link kopyalayıp başka cihazdan giriş yapmak
     isteyince …". Öğrencinin bağlantısı (tahta.html?rol=izle&canli=<oda>): telefonda paylaşma penceresi
     (WhatsApp vb.), bilgisayarda panoya; olmazsa elle kopyalama kutusu. Yalnız çağrılan öğrenci girer
     (veritabanı kuralı); girişsiz açılırsa giriş yapınca ders kendiliğinden açılır. */
  function baglantiAdres() { return location.origin + '/tahta.html?rol=izle&canli=' + encodeURIComponent(ODA); }
  function baglantiPaylas() {
    var adres = baglantiAdres();
    var tamam = function () { bildir('Katılım bağlantısı kopyalandı — öğrencilere gönder. Yalnız çağırdığın öğrenciler girebilir.', 4000); };
    var elle = function () {
      D.bagGoster = true; ciz();
      setTimeout(function () { var g = $('cdBagYazi'); if (g) { try { g.focus(); g.select(); } catch (e) { } } }, 30);
    };
    var kopyala = function () {
      try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(adres).then(tamam, elle); return; } } catch (e) { }
      elle();
    };
    var dokunmatik = false;
    try { dokunmatik = !!(window.matchMedia && window.matchMedia('(pointer:coarse)').matches); } catch (e) { }
    if (dokunmatik && navigator.share) {
      try {
        navigator.share({ title: 'Canlı ders', text: 'Canlı derse katıl:', url: adres }).catch(function (e) { if (!e || e.name !== 'AbortError') kopyala(); });
        return;
      } catch (e) { }
    }
    kopyala();
  }
  function sureYaz() {
    var e = $('cdSure'); if (!e) return;
    if (!D.katildiT) { e.textContent = ''; return; }
    var sn = Math.max(0, Math.floor((SIMDI() - D.katildiT) / 1000)), d = Math.floor(sn / 60), s = sn % 60;
    e.textContent = (d < 10 ? '0' : '') + d + ':' + (s < 10 ? '0' : '') + s;
  }
  function elSayisi() { var n = 0; for (var u in D.ogr) if (has(D.ogr, u) && D.ogr[u] && D.ogr[u].el && D.davetliler[u]) n++; return n; }
  function adSirasi(a, b) {
    var x = 0;
    try { x = String(a.ad).localeCompare(String(b.ad), 'tr'); } catch (e) { x = a.ad < b.ad ? -1 : (a.ad > b.ad ? 1 : 0); }
    return x || (a.uid < b.uid ? -1 : 1);
  }
  /* öğretmenin listesi: (söz isteyenler) · çağrılanlar — önce derstekiler, sonra beklenenler, ad sırasıyla (durum, el, söz, çıkar) ·
     çağrılabilecekler (sınıf sınıf). Sıra yalnız biri katılınca / ayrılınca değişir: satırlar parmağın altından kaymasın. */
  function listeYazisi() {
    var L = cagrilanlar(), cok = cokMu(), h = '';
    if (L.length) {
      var eller = cok ? L.filter(function (s) { return derste(s.uid) && D.ogr[s.uid] && D.ogr[s.uid].el && D.soz !== s.uid; }) : [];
      if (eller.length && L.length > 1) {                    /* söz isteyenler en üstte, isteme sırasıyla */
        eller.sort(function (a, b) { return ((+D.ogr[a.uid].el || 0) - (+D.ogr[b.uid].el || 0)) || adSirasi(a, b); });
        h += '<div class="cd-bolum"><span>Söz isteyenler</span></div>';
        eller.forEach(function (s) {
          h += '<div class="cd-sat" data-elsat="' + kac(s.uid) + '"><i class="cd-el">' + SVG.el + '</i><span>' + kac(s.ad) + '</span>' +
            '<button type="button" class="cd-dug yesil" data-soz="' + kac(s.uid) + '" title="Söz ver: bu öğrenci sayfayı kullanır, herkes onu izler">' + SVG.soz + '<span>Söz ver</span></button></div>';
        });
      }
      var sirali = L.slice().sort(function (a, b) { var da = derste(a.uid) ? 0 : 1, db = derste(b.uid) ? 0 : 1; return (da - db) || adSirasi(a, b); });
      h += '<div class="cd-bolum"><span>Derste ve çağrılanlar</span></div>';
      sirali.forEach(function (s) {
        var ic = derste(s.uid), v = D.ogr[s.uid] || {}, alt = !ic ? 'bekleniyor' : (v.mik === false ? 'derste · mikrofonu kapalı' : 'derste'), sozOnda = D.soz === s.uid;
        h += '<div class="cd-sat" data-sat="' + kac(s.uid) + '"><i class="cd-n' + (ic ? ' canli' : '') + '"></i><span>' + kac(s.ad) + '<small>' + alt + (sozOnda ? ' · söz onda' : '') + '</small></span>' +
          (v.el ? '<i class="cd-el" title="Söz istiyor">' + SVG.el + '</i>' : '') +
          (!ic ? '<button type="button" class="cd-dug" data-uid="' + kac(s.uid) + '" data-ad="' + kac(s.ad) + '" title="Yeniden çağır">' + SVG.yenile + '</button>' : '') +
          (cok && ic ? '<button type="button" class="cd-dug' + (sozOnda ? ' sari' : (v.el ? ' yesil' : '')) + '" data-soz="' + kac(s.uid) + '" title="' +
            (sozOnda ? 'Sözü geri al: öğrenci yeniden yalnız izler' : 'Söz ver: bu öğrenci sayfayı kullanır, herkes onu izler') + '">' + SVG.soz + '<span>' + (sozOnda ? 'Sözü al' : 'Söz ver') + '</span></button>' : '') +
          '<button type="button" class="cd-dug" data-cikar="' + kac(s.uid) + '" title="Dersten çıkar">' + SVG.cikar + '</button></div>';
      });
    }
    var kalan = D.liste.filter(function (s) { return !D.davetliler[s.uid]; });
    if (!D.liste.length) h += '<p class="cd-bos">Sınıf listende hesabı bağlı öğrenci yok. Öğrenci kodunu girip bağlanınca Listelerim\'de belirir; sonra buradan çağırabilirsin.</p>';
    else if (kalan.length) {
      var gruplar = {}, sira = [];
      kalan.forEach(function (s) { var g = String(s.sinif || ''); if (!gruplar[g]) { gruplar[g] = []; sira.push(g); } gruplar[g].push(s); });
      sira.forEach(function (g) {
        h += '<div class="cd-bolum"><span>' + kac(g || 'Öğrenciler') + '</span>' +
          (cok && gruplar[g].length > 1 ? '<button type="button" class="cd-dug yesil" data-sinif="' + kac(g) + '" title="Bu sınıftaki herkesi çağır">' + SVG.ogrenciler + '<span>Hepsini çağır</span></button>' : '') + '</div>';
        gruplar[g].forEach(function (s) {
          h += '<div class="cd-sat"><span>' + kac(s.ad || 'Öğrenci') + '</span>' +
            '<button type="button" class="cd-dug yesil" data-uid="' + kac(s.uid) + '" data-ad="' + kac(s.ad || 'Öğrenci') + '">Çağır</button></div>';
        });
      });
    }
    if (D.kural === 'eski') h += '<p class="cd-ipucu" id="cdKuralNot">Şu an derse tek öğrenci çağrılabilir. Çok öğrenci ve söz verme, veritabanı kuralının yeni hâli Firebase\'e yapıştırılınca açılır.</p>';
    return h;
  }
  function ciz() {
    var k = kutu();
    k.classList.toggle('kucuk', !!D.kucuk);
    $('cdKucult').innerHTML = D.kucuk ? SVG.buyut : SVG.kucult;
    $('cdKucult').setAttribute('aria-label', D.kucuk ? 'Büyüt' : 'Küçült');
    var nokta = 'bekle', durum = '', uyari = false, baslik = 'Canlı ders', L = OGR ? [] : cagrilanlar(), ic = OGR ? [] : derstekiler();
    if (!D.baglanti) { nokta = 'hata'; durum = 'İnternet bağlantısı yok'; uyari = true; }
    else if (OGR) {
      if (!ogretmenVar()) durum = 'Öğretmen bekleniyor…';
      else if (V.bagli) { nokta = 'canli'; durum = 'Öğretmen bağlı · ses açık' + (SFU.kip === 'sfu' ? ' (SFU)' : ''); }
      else if (!D.ogt || !D.ogt.kimlik) durum = 'Öğretmen bağlı · ses bekleniyor…';
      else durum = 'Ses bağlantısı kuruluyor…';
      if (D.ogt && D.ogt.mik === false && V.bagli) durum += ' · öğretmenin mikrofonu kapalı';
    } else if (L.length <= 1) {
      var ad = L.length ? L[0].ad : 'Öğrenci', u1 = L.length ? L[0].uid : null, v1 = u1 ? D.ogr[u1] : null;
      baslik = L.length ? ad : 'Canlı ders';
      if (!L.length) durum = 'Öğrenci çağrılmadı.';
      else if (!ic.length) durum = ad + ' çağrıldı · bekleniyor… (sitede açık olmalı)';
      else if (sesBagli(u1)) { nokta = 'canli'; durum = ad + ' derste · ses açık' + (SFU.kip === 'sfu' ? ' (SFU)' : ''); }
      else durum = ad + ' bağlandı · ses kuruluyor…';
      if (v1 && v1.mik === false && sesBagli(u1)) durum += ' · mikrofonu kapalı';
    } else {
      var sesli = ic.filter(function (s) { return sesBagli(s.uid); }).length;
      baslik = 'Canlı ders · ' + ic.length + '/' + L.length;
      if (!ic.length) durum = L.length + ' öğrenci çağrıldı · bekleniyor… (sitede açık olmalı)';
      else {
        nokta = sesli ? 'canli' : 'bekle';
        durum = ic.length + '/' + L.length + ' öğrenci derste' + (sesli === ic.length ? ' · ses açık' : (sesli ? ' · ses ' + sesli + '/' + ic.length : ' · ses kuruluyor…')) + (SFU.kip === 'sfu' ? ' (SFU)' : '');
      }
    }
    if (D.mikHata) { durum += (durum ? ' · ' : '') + D.mikHata; uyari = true; }
    $('cdNokta').className = 'cd-nokta ' + nokta;
    $('cdBaslik').textContent = baslik;
    var du = $('cdDurum'); du.textContent = durum; du.className = 'cd-durum' + (uyari ? ' uyari' : '');
    /* söz bandı */
    var sb = $('cdSoz'), sh = '';
    if (D.soz) {
      if (OGR) sh = D.soz === UID ? SVG.soz + '<b>Söz sende — sayfayı kullanabilirsin</b>' : SVG.soz + '<b>Söz: ' + kac(D.sozAd || 'arkadaşın') + '</b>';
      else sh = SVG.soz + '<b>Söz: ' + kac(D.sozAd || adOf(D.soz)) + '</b><button type="button" class="cd-dug sari" data-cd="sozal" title="Sözü geri al: öğrenci yeniden yalnız izler">Sözü al</button>';
    }
    if (D.sozSon !== sh) { sb.innerHTML = sh; D.sozSon = sh; }
    sb.hidden = !sh; sb.classList.toggle('bende', !!(OGR && D.soz === UID));
    /* görüntü: öğrencide öğretmenin kamerası; öğretmende kamerası açık öğrencilerden biri (söz alan, yoksa ilk) */
    var kv = OGR ? !!(D.ogt && D.ogt.kamera && V.bagli) : !!(D.gorKim && sesBagli(D.gorKim));
    $('cdVideo').classList.toggle('var', kv || !!V.kam);
    $('cdVideo').classList.toggle('tek', !kv && !!V.kam);
    $('cdGoruntu').hidden = !kv;
    $('cdBen').classList.toggle('var', !!V.kam);
    var gk = (!OGR && kv && L.length > 1) ? adOf(D.gorKim) : '';
    if ($('cdGorKim').textContent !== gk) $('cdGorKim').textContent = gk;
    /* tuşlar */
    var t = '';
    t += '<button type="button" class="cd-dug" data-cd="mik" aria-pressed="' + (D.mik ? 'true' : 'false') + '" title="' + (D.mik ? 'Mikrofonu kapat' : 'Mikrofonu aç') + '">' + (D.mik ? SVG.mik : SVG.mikKapali) + '</button>';
    t += '<button type="button" class="cd-dug" data-cd="kamera" aria-pressed="' + (V.kam ? 'true' : 'false') + '" title="' + (V.kam ? 'Kamerayı kapat' : 'Kamerayı aç (isteğe bağlı)') + '">' + (V.kam ? SVG.kamera : SVG.kameraKapali) + '</button>';
    if (D.sesKilit) t += '<button type="button" class="cd-dug sari" data-cd="ses">' + SVG.ses + '<span>Sesi aç</span></button>';
    if (D.mikHata) t += '<button type="button" class="cd-dug" data-cd="mikdene" title="Mikrofonu yeniden dene">' + SVG.yenile + '</button>';
    if (OGR) {
      if (D.soz !== UID && cokMu()) t += '<button type="button" class="cd-dug' + (D.el ? ' sari' : '') + '" data-cd="el" title="' + (D.el ? 'Söz isteğini geri al' : 'Söz iste: öğretmen görür, söz verirse sayfayı sen kullanırsın') + '">' + SVG.el + '<span>' + (D.el ? 'Söz istendi' : 'Söz iste') + '</span></button>';
      t += '<button type="button" class="cd-dug kirmizi" data-cd="ayril" title="Dersten ayrıl, ana sayfaya dön">' + SVG.bitir + '<span>Ayrıl</span></button>';
    } else {
      var eller = elSayisi();
      t += '<button type="button" class="cd-dug yesil" data-cd="cagir" title="' + (L.length ? 'Öğrenciler: çağır, söz ver, çıkar' : 'Öğrenciyi derse çağır') + '">' + (L.length ? SVG.ogrenciler : SVG.cagir) +
        '<span>' + (L.length ? 'Öğrenciler' : 'Öğrenciyi çağır') + '</span>' + (eller ? '<i class="cd-rozet" title="Söz isteyen var">' + eller + '</i>' : '') + '</button>';
      if (L.length) t += '<button type="button" class="cd-dug" data-cd="bag" title="Katılım bağlantısı: kopyala ya da gönder (yalnız çağırdığın öğrenciler girer)">' + SVG.bag + '</button>';
      t += '<button type="button" class="cd-dug kirmizi" data-cd="bitir" title="Dersi bitir: öğrenciler ana sayfaya döner, sen bu sayfada kalırsın">' + SVG.bitir + '<span>Bitir</span></button>';
    }
    if (D.tusSon !== t) { $('cdTuslar').innerHTML = t; D.tusSon = t; }
    var uy = D.kameraSor
      ? '<div class="cd-uyari">Kamera görüntüsü veri tüketir (saatte yaklaşık 0,3–0,5 GB). Aylık ücretsiz pay aşılırsa fark ' +
        (OGR ? 'öğretmene' : 'sana') + ' aittir; ses tek başına ücretsiz payı aşmaz.' +
        '<div class="cd-tuslar"><button type="button" class="cd-dug yesil" data-cd="kameraEvet">' + SVG.kamera + '<span>Kamerayı aç</span></button>' +
        '<button type="button" class="cd-dug" data-cd="kameraHayir">Vazgeç</button></div></div>'
      : (D.bagGoster && !OGR && L.length)
        ? '<div class="cd-uyari">Katılım bağlantısı — kopyala, öğrenciye gönder (yalnız çağırdığın öğrenciler girer):' +
          '<input id="cdBagYazi" class="cd-bag" readonly value="' + kac(baglantiAdres()) + '">' +
          '<div class="cd-tuslar"><button type="button" class="cd-dug" data-cd="bagKapat">Tamam</button></div></div>'
        : '';
    if (D.uyariSon !== uy) { $('cdUyari').innerHTML = uy; D.uyariSon = uy; }   /* değişmediyse yeniden çizilmez (seçim/odak korunur) */
    if (!OGR) {
      var cv = $('cdVeri');
      if (cv) cv.textContent = veriYazisi();
      var l = $('cdListe');
      l.hidden = !(D.listeAcik || !L.length);
      if (!l.hidden) { var lh = listeYazisi(); if (D.listeSon !== lh) { l.innerHTML = lh; D.listeSon = lh; } }
    }
    sureYaz();
  }

  /* ------------------------------------------------------------ ses: ortam */
  function mikAc(elle) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { D.mikHata = 'Bu tarayıcı mikrofonu desteklemiyor'; ciz(); return Promise.resolve(false); }
    return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } }).then(function (s) {
      V.yerel = s;
      s.getAudioTracks().forEach(function (t) { t.enabled = D.mik; });
      D.mikHata = '';
      if (elle) {                                /* sonradan izin verildi: iz bağlantıya eklenir (SFU: yayınla; eşten eşe: yeniden teklif) */
        if (SFU.kip === 'sfu') { if (V.pc && !SFU.izler.ses) sfuYayinla('ses', s.getAudioTracks()[0]).then(sfuKaydiYaz, function () { }); }
        else if (OGR) { if (V.pc) teklifEt(); }
        else cagrilanlar().forEach(function (o) { if (P[o.uid]) yenileIste(o.uid); });
      }
      ciz();
      return true;
    }).catch(function (e) {
      var ad = (e && e.name) || '';
      D.mikHata = (ad === 'NotAllowedError' || ad === 'SecurityError') ? 'Mikrofon izni verilmedi' : (ad === 'NotFoundError' ? 'Mikrofon bulunamadı' : 'Mikrofon açılamadı');
      ciz();
      return false;
    });
  }
  function mikDegistir() {
    D.mik = !D.mik;
    if (V.yerel) V.yerel.getAudioTracks().forEach(function (t) { t.enabled = D.mik; });
    try { kok.child(benimYol() + '/mik').set(D.mik); } catch (e) { }
    ciz();
  }
  /* KAMERA UYARISI (06.11.2026): ilk açışta (bu sayfada) bir kez sorulur; kapatmak sormaz */
  function kameraIste() {
    if (V.kam || D.kameraOnay) { kameraDegistir(); return; }
    D.kameraSor = true; ciz();
  }
  function kamGonder(iz) {                      /* eşten eşe: görüntü yolu bütün bağlantılarda (öğrencide tek, öğretmende öğrenci başına) */
    var L = [V]; for (var u in P) if (has(P, u)) L.push(P[u]);
    L.forEach(function (p) { if (p.vSender) { try { p.vSender.replaceTrack(iz); } catch (e) { } } });
  }
  function kameraDegistir() {
    if (V.kam) {
      try { V.kam.stop(); } catch (e) { }
      V.kam = null; kamBen(false);
      kamGonder(null);
      $('cdBen').srcObject = null;
      try { kok.child(benimYol() + '/kamera').set(false); } catch (e) { }
      if (SFU.kip === 'sfu') { try { kok.child(benimYol() + '/sfu/kamera').set(false); } catch (e) { } }
      ciz(); return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 20, max: 24 } } }).then(function (s) {
      V.kam = s.getVideoTracks()[0];
      if (!V.kam) return;
      kamBen(true);
      V.kam.onended = function () { if (V.kam) kameraDegistir(); };
      if (SFU.kip === 'sfu') sfuKameraYayinla();
      else kamGonder(V.kam);
      try { $('cdBen').srcObject = new MediaStream([V.kam]); } catch (e) { }
      try { kok.child(benimYol() + '/kamera').set(true); } catch (e) { }
      ciz();
    }).catch(function () { bildir('Kamera açılamadı.'); });
  }
  /* uzak sesler: her iz kendi <audio> öğesinde (birden çok ses izi bütün tarayıcılarda aynı anda çalsın) */
  var SESLER = {};                              /* kim → { el, iz } — kim: 'ogt' (öğretmen) | 'soz' (aktarılan söz sesi) | öğrenci uid'i */
  function sesBagla(kim, track) {
    var k = SESLER[kim];
    if (k && k.iz === track) return;
    if (!k) {
      var a = document.createElement('audio');
      a.autoplay = true; a.setAttribute('playsinline', ''); a.setAttribute('data-kim', kim);
      $('cdSesler').appendChild(a);
      k = SESLER[kim] = { el: a, iz: null };
    }
    k.iz = track;
    try {
      k.el.srcObject = new MediaStream([track]);
      var p = k.el.play();
      if (p && p.catch) p.catch(function () { D.sesKilit = true; ciz(); });
    } catch (e) { }
  }
  function sesKopar(kim) {
    var k = SESLER[kim]; if (!k) return;
    try { k.el.srcObject = null; if (k.el.parentNode) k.el.parentNode.removeChild(k.el); } catch (e) { }
    delete SESLER[kim];
  }
  function sesAc() {
    var L = [], kilit = false;
    for (var k in SESLER) if (has(SESLER, k)) L.push(SESLER[k].el);
    if (!L.length) { D.sesKilit = false; ciz(); return; }
    Promise.all(L.map(function (a) { try { return a.play().catch(function () { kilit = true; }); } catch (e) { kilit = true; return null; } }))
      .then(function () { D.sesKilit = kilit; ciz(); });
  }
  function goruntuBagla(track) {
    var v = $('cdGoruntu'); if (!v) return;
    if (!track) { if (v.srcObject) v.srcObject = null; return; }
    var st = v.srcObject, var_ = false;
    try { var_ = !!(st && st.getVideoTracks()[0] === track); } catch (e) { }
    if (var_) return;
    try { v.srcObject = new MediaStream([track]); var q = v.play(); if (q && q.catch) q.catch(function () { }); } catch (e) { }
  }
  /* öğretmen: kimin kamerası gösterilecek — kamerası açık ve derste olanlardan söz alan; yoksa ilk açan */
  function gorSec() {
    if (OGR) return;
    var aday = cagrilanlar().filter(function (s) { var v = D.ogr[s.uid]; return !!(v && v.kamera && derste(s.uid)); });
    var yeni = null;
    if (aday.length) yeni = aday.some(function (s) { return s.uid === D.soz; }) ? D.soz : (aday.some(function (s) { return s.uid === D.gorKim; }) ? D.gorKim : aday[0].uid);
    var eski = D.gorKim;
    D.gorKim = yeni;
    if (SFU.kip === 'sfu') {
      if (eski && eski !== yeni) sfuBirak(eski, 'kamera');
      var k = yeni && D.ogr[yeni] && D.ogr[yeni].sfu;
      if (k && k.sid && k.kamera) sfuTek(yeni, k.sid, 'kamera').catch(function () { });
      else if (!yeni) goruntuBagla(null);
    } else goruntuBagla(yeni && P[yeni] ? P[yeni].kamIz : null);
  }

  /* ------------------------------------------------------------ ses: bağlantı sunucuları */
  function iceAl() {
    try {
      var v = JSON.parse(localStorage.getItem(TURN_DEPO) || 'null');
      if (v && Array.isArray(v.iceServers) && v.iceServers.length && v.son > SIMDI() + 60000) return Promise.resolve(yap(v.iceServers));
    } catch (e) { }
    var u = auth.currentUser;
    if (!u || typeof fetch !== 'function') return Promise.resolve(null);
    var ac = (typeof AbortController === 'function') ? new AbortController() : null;
    var z = setTimeout(function () { try { if (ac) ac.abort(); } catch (e) { } }, 6000);
    return u.getIdToken().then(function (j) {
      return fetch(FN_ADRES, { method: 'POST', cache: 'no-store', credentials: 'omit', signal: ac ? ac.signal : undefined,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + j }, body: '{"data":{}}' });
    }).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); }).then(function (j) {
      var d = j && j.result;
      if (!d || !Array.isArray(d.iceServers) || !d.iceServers.length) throw new Error('boş');
      var cf = d.iceServers.map(function (s) { return Object.assign({}, s, { urls: [].concat(s.urls || []).filter(function (x) { return !/:53(\?|$)/.test(String(x)); }) }); })
                           .filter(function (s) { return s.urls.length; });
      try { localStorage.setItem(TURN_DEPO, JSON.stringify({ iceServers: cf, son: SIMDI() + Math.max(600, (+d.ttl || 3600) - 600) * 1000 })); } catch (e) { }
      return yap(cf);
    }).catch(function () { return null; }).then(function (v) { clearTimeout(z); return v; });
    function yap(cf) { return { iceServers: cf.concat([{ urls: 'stun:stun.l.google.com:19302' }]), iceCandidatePoolSize: 4 }; }
  }

  /* ------------------------------------------------------------ KULLANIM ÖLÇÜMÜ (06.11.2026; 26.11.2026: bütün bağlantılar, bütün öğrenciler) */
  var IST = { sesIn: 0, sesOut: 0, goruntuIn: 0, goruntuOut: 0, aktarIn: 0, aktarOut: 0, aktarli: false, kameraSn: 0 };
  var DERS = null;                      /* öğretmen: süren dersin toplamları */
  var JETON = { v: '', z: 0 };          /* kimlik jetonu (sekme kapanırken keepalive yazım için hazır) */
  function istatOkuEs(p) {              /* bir bağlantının sayaçları: önceki okumadan bu yana artış IST'e eklenir */
    var pc = p.pc;
    if (!pc || typeof pc.getStats !== 'function') return Promise.resolve();
    return pc.getStats().then(function (r) {
      var yerel = {}, uzak = {}, ciftler = {}, secili = null, ham = { sesIn: 0, sesOut: 0, goruntuIn: 0, goruntuOut: 0, aktarIn: 0, aktarOut: 0 };
      r.forEach(function (x) {
        if (x.type === 'transport' && x.selectedCandidatePairId) secili = x.selectedCandidatePairId;
        else if (x.type === 'candidate-pair') ciftler[x.id] = x;
        else if (x.type === 'local-candidate') yerel[x.id] = x;
        else if (x.type === 'remote-candidate') uzak[x.id] = x;
        else if (x.type === 'inbound-rtp') { var ki = x.kind || x.mediaType; if (ki === 'audio') ham.sesIn += x.bytesReceived || 0; else if (ki === 'video') ham.goruntuIn += x.bytesReceived || 0; }
        else if (x.type === 'outbound-rtp') { var ko = x.kind || x.mediaType; if (ko === 'audio') ham.sesOut += x.bytesSent || 0; else if (ko === 'video') ham.goruntuOut += x.bytesSent || 0; }
      });
      var c = secili ? ciftler[secili] : null;
      if (!c) { for (var k in ciftler) if (has(ciftler, k) && ciftler[k].state === 'succeeded' && (ciftler[k].nominated || ciftler[k].selected)) { if (!c || (ciftler[k].bytesReceived || 0) > (c.bytesReceived || 0)) c = ciftler[k]; } }
      var aktarli = false;
      if (c) {
        ham.aktarIn = c.bytesReceived || 0; ham.aktarOut = c.bytesSent || 0;
        var ly = yerel[c.localCandidateId], uz = uzak[c.remoteCandidateId];
        aktarli = SFU.kip === 'sfu' || !!((ly && ly.candidateType === 'relay') || (uz && uz.candidateType === 'relay'));
      }
      if (p.istPc !== pc) { p.istPc = pc; p.istSon = null; p.istCift = null; }
      var o = p.istSon || {};
      ['sesIn', 'sesOut', 'goruntuIn', 'goruntuOut'].forEach(function (k2) { var d = ham[k2] - (o[k2] || 0); if (d > 0) IST[k2] += d; });
      if (c) {
        var oi = (p.istCift === c.id) ? (o.aktarIn || 0) : 0, oo = (p.istCift === c.id) ? (o.aktarOut || 0) : 0;
        if (aktarli) { var di = ham.aktarIn - oi, dd = ham.aktarOut - oo; if (di > 0) IST.aktarIn += di; if (dd > 0) IST.aktarOut += dd; IST.aktarli = true; }
        p.istCift = c.id;
      }
      p.istSon = ham;
    }).catch(function () { });
  }
  function istatOku() {
    var L = [istatOkuEs(V)];
    for (var u in P) if (has(P, u)) L.push(istatOkuEs(P[u]));
    return Promise.all(L);
  }
  function istatYaz() {                 /* öğrenci: sayaçlarını odaya yazar (öğretmen toplar) */
    if (!OGR || !V.pc) return;
    try {
      kok.child('ses/ogr/' + UID + '/istat').set({ sesIn: IST.sesIn, sesOut: IST.sesOut, goruntuIn: IST.goruntuIn, goruntuOut: IST.goruntuOut,
                                                  aktarIn: IST.aktarIn, aktarOut: IST.aktarOut, aktarli: IST.aktarli, kameraSn: IST.kameraSn, t: TS() });
    } catch (e) { }
  }
  function mb(b) { return Math.round((b || 0) / 1e3) / 1000; }          /* bayt → MB, üç ondalık (KB çözünürlük) */
  /* kamera süresi: açık kaldığı süre kesin ölçülür (10 sn'lik tik değil); öğretmen kendi + (herhangi bir) öğrencinin kamerasını toplar */
  var KAM = { ben: 0, benBas: 0, karsi: 0, karsiBas: 0 };
  function kamBen(acik) { var z = SIMDI(); if (acik && !KAM.benBas) KAM.benBas = z; else if (!acik && KAM.benBas) { KAM.ben += z - KAM.benBas; KAM.benBas = 0; } }
  function kamKarsi(acik) { var z = SIMDI(); if (acik && !KAM.karsiBas) KAM.karsiBas = z; else if (!acik && KAM.karsiBas) { KAM.karsi += z - KAM.karsiBas; KAM.karsiBas = 0; } }
  function kamSn() { var z = SIMDI(); return Math.round((KAM.ben + (KAM.benBas ? z - KAM.benBas : 0) + KAM.karsi + (KAM.karsiBas ? z - KAM.karsiBas : 0)) / 1000); }
  function kamSifirla() { var z = SIMDI(); KAM.ben = 0; KAM.karsi = 0; if (KAM.benBas) KAM.benBas = z; if (KAM.karsiBas) KAM.karsiBas = z; }
  function ayAd(ms) { var d = new Date(ms || SIMDI()); return d.getFullYear() + '-' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1); }
  function dersBaslat() {
    if (OGR || DERS) return;
    var L = derstekiler(); if (!L.length) return;
    kamSifirla();
    DERS = { id: rastgele(), ogr: L[0].uid, ad: L[0].ad, ogrler: {}, bas: SIMDI(), bitis: 0, sn: 0, kameraSn: 0,
             sesB: 0, goruntuB: 0, aktarB: 0, aktarli: false, benSon: { sesIn: IST.sesIn, goruntuIn: IST.goruntuIn, aktarIn: IST.aktarIn }, ogrSon: {}, kapanisZ: null };
    L.forEach(function (s) { DERS.ogrler[s.uid] = s.ad; });
    iz('ders', 'başladı ' + DERS.id);
  }
  function dersTopla() {                /* öğretmen: kendi ve öğrencilerin sayaçlarından dersin toplamları (teslim edilen bayt) */
    if (!DERS) return;
    var b = DERS.benSon;
    var di = IST.sesIn - b.sesIn, dg = IST.goruntuIn - b.goruntuIn, da = IST.aktarIn - b.aktarIn;
    if (di > 0) DERS.sesB += di; if (dg > 0) DERS.goruntuB += dg; if (da > 0) DERS.aktarB += da;
    DERS.benSon = { sesIn: IST.sesIn, goruntuIn: IST.goruntuIn, aktarIn: IST.aktarIn };
    if (IST.aktarli) DERS.aktarli = true;
    for (var u in D.ogr) {
      if (!has(D.ogr, u)) continue;
      var v = D.ogr[u] && D.ogr[u].istat;
      if (!v) continue;
      var o = DERS.ogrSon[u] || {};
      ['sesIn', 'goruntuIn', 'aktarIn'].forEach(function (k) {
        var yeni = +v[k] || 0, eski = +o[k] || 0, d = yeni - eski;
        if (d < 0) d = yeni;                                  /* öğrencinin sayfası yenilendi: sayaç baştan */
        if (d > 0) { if (k === 'sesIn') DERS.sesB += d; else if (k === 'goruntuIn') DERS.goruntuB += d; else DERS.aktarB += d; }
      });
      if (v.aktarli) DERS.aktarli = true;
      DERS.ogrSon[u] = { sesIn: +v.sesIn || 0, goruntuIn: +v.goruntuIn || 0, aktarIn: +v.aktarIn || 0 };
    }
    derstekiler().forEach(function (s) { DERS.ogrler[s.uid] = s.ad; });
    DERS.kameraSn = kamSn();
  }
  function dersKayit() {
    var k = DERS; if (!k) return null;
    dersTopla();
    k.bitis = SIMDI(); k.sn = Math.max(0, Math.round((k.bitis - k.bas) / 1000));
    var adlar = [], u; for (u in k.ogrler) if (has(k.ogrler, u)) adlar.push(k.ogrler[u]);
    var ad = adlar.length <= 1 ? (adlar[0] || k.ad) : (adlar.slice(0, 2).join(', ') + (adlar.length > 2 ? ' +' + (adlar.length - 2) : ''));
    var r = { id: k.id, ogr: k.ogr, ad: String(ad).slice(0, 60), bas: k.bas, bitis: k.bitis, sn: k.sn, kameraSn: Math.round(k.kameraSn),
              sesMB: mb(k.sesB), goruntuMB: mb(k.goruntuB), aktarMB: mb(k.aktarB), aktarli: !!k.aktarli };
    if (adlar.length > 1) r.ogrSay = adlar.length;
    return r;
  }
  function dersBitir(neden, keepalive) {
    if (!DERS) return;
    clearTimeout(DERS.kapanisZ);
    var k = dersKayit(); DERS = null;
    iz('ders', 'bitti ' + neden + ' ' + k.sn + 'sn ' + k.sesMB + 'MB');
    if (k.sn < 15 && k.sesMB < 0.02) return;                 /* kazara açılıp kapanan: kayıt yok */
    kayitYaz(k, keepalive);
  }
  function veriYazisi() {
    var k = DERS; if (!k) return '';
    var ses = mb(k.sesB + Math.max(0, IST.sesIn - k.benSon.sesIn)), gor = mb(k.goruntuB + Math.max(0, IST.goruntuIn - k.benSon.goruntuIn));
    var akt = mb(k.aktarB + Math.max(0, IST.aktarIn - k.benSon.aktarIn));
    return 'Veri: ses ' + ses.toFixed(1) + ' MB' + (gor ? ' · kamera ' + gor.toFixed(1) + ' MB' : '') + (k.aktarli || IST.aktarli ? ' · aktarıcıdan ' + akt.toFixed(1) + ' MB' : ' · doğrudan bağlantı');
  }
  /* Firestore REST: kullanicilar/<uid> belgesinde aylık artışlar + ders kaydı (tek yazımda, atomik) */
  function kayitYazisi(k, uid) {
    var ay = ayAd(k.bas), yol = 'canliKullanim.`' + ay + '`.';
    var harita = function (o) { var f = {}; for (var x in o) if (has(o, x)) f[x] = (typeof o[x] === 'number') ? (Number.isInteger(o[x]) ? { integerValue: String(o[x]) } : { doubleValue: o[x] }) : (typeof o[x] === 'boolean' ? { booleanValue: o[x] } : { stringValue: String(o[x]) }); return { mapValue: { fields: f } }; };
    var ayF = {}; ayF[ay] = { mapValue: { fields: { son: { integerValue: String(k.bitis) } } } };
    return { writes: [{
      update: { name: FS_KOK + '/kullanicilar/' + uid, fields: { canliKullanim: { mapValue: { fields: ayF } } } },
      updateMask: { fieldPaths: [yol + 'son'] },
      updateTransforms: [
        { fieldPath: yol + 'ders', increment: { integerValue: '1' } },
        { fieldPath: yol + 'sn', increment: { integerValue: String(k.sn) } },
        { fieldPath: yol + 'kameraSn', increment: { integerValue: String(k.kameraSn) } },
        { fieldPath: yol + 'sesMB', increment: { doubleValue: k.sesMB } },
        { fieldPath: yol + 'goruntuMB', increment: { doubleValue: k.goruntuMB } },
        { fieldPath: yol + 'aktarMB', increment: { doubleValue: k.aktarMB } },
        { fieldPath: 'canliDersler', appendMissingElements: { values: [harita(k)] } }
      ],
      currentDocument: { exists: true }
    }] };
  }
  function kuyruk() { try { var l = JSON.parse(localStorage.getItem(KUYRUK) || '[]'); return Array.isArray(l) ? l : []; } catch (e) { return []; } }
  function kuyrugaYaz(l) { try { if (l.length) localStorage.setItem(KUYRUK, JSON.stringify(l.slice(-50))); else localStorage.removeItem(KUYRUK); } catch (e) { } }
  function kayitYaz(k, keepalive) {
    var u = auth && auth.currentUser;
    if (!u || typeof fetch !== 'function') { var l0 = kuyruk(); l0.push(k); kuyrugaYaz(l0); return Promise.resolve(false); }
    var l = kuyruk(); if (!l.some(function (x) { return x.id === k.id; })) { l.push(k); kuyrugaYaz(l); }   /* önce kuyruğa: sekme kapanırsa kaybolmaz */
    var gonder = function (jeton) {
      return fetch(FS_ADRES + ':commit', { method: 'POST', keepalive: !!keepalive, credentials: 'omit', cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jeton }, body: JSON.stringify(kayitYazisi(k, u.uid)) })
        .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); kuyrugaYaz(kuyruk().filter(function (x) { return x.id !== k.id; })); iz('kayit', 'yazıldı ' + k.id); return true; });
    };
    var p = (keepalive && JETON.v) ? gonder(JETON.v) : u.getIdToken().then(gonder);
    return p.catch(function (e) { iz('kayitHata', e && e.message); return false; });
  }
  function kuyrukGonder() {               /* oda açılınca: önceki derslerden yazılamayanlar */
    var l = kuyruk(); if (!l.length) return;
    var sira = Promise.resolve();
    l.forEach(function (k) { sira = sira.then(function () { return kayitYaz(k, false); }); });
  }
  function jetonTazele() { try { var u = auth.currentUser; if (u) u.getIdToken().then(function (j) { JETON.v = j; JETON.z = SIMDI(); }); } catch (e) { } }
  function olcumBasla() {
    setInterval(function () {
      istatOku().then(function () {
        if (OGR) { IST.kameraSn = kamSn(); istatYaz(); }
        else { if (DERS) dersTopla(); }
        ciz();
      });
    }, ISTAT_ARALIK);
    if (!OGR) {
      jetonTazele(); setInterval(jetonTazele, 20 * 60000);
      kuyrukGonder();
      window.addEventListener('pagehide', function () { if (DERS) dersBitir('sayfa', true); });
    }
  }
  /* öğretmen: derste öğrenci varsa ders sürer; kimse kalmayınca 60 sn sonra biter (tek kayıt: bütün öğrenciler) */
  function dersDenetle() {
    if (OGR) return;
    var L = derstekiler();
    if (L.length) {
      if (!DERS) dersBaslat();
      else { if (DERS.kapanisZ) { clearTimeout(DERS.kapanisZ); DERS.kapanisZ = null; } L.forEach(function (s) { DERS.ogrler[s.uid] = s.ad; }); }
      if (!D.katildiT) D.katildiT = SIMDI();
    } else {
      if (D.katildiT && !V.bagli) { D.katildiT = 0; }          /* herkes gitti: süre durur, yeniden gelince baştan */
      if (DERS && !DERS.kapanisZ) DERS.kapanisZ = setTimeout(function () { if (DERS) { DERS.kapanisZ = null; dersBitir('ayrildi'); } }, DERS_KAPANMA);
    }
    sozDenetle();
  }

  /* ------------------------------------------------------------ ses: eş bağlantısı (p: V ya da P[uid]) */
  function bagliGuncelle() {                  /* öğretmen, eşten eşe: «bağlı» = en az bir öğrenciyle ses kurulu */
    if (OGR || SFU.kip === 'sfu') return;
    var b = false; for (var u in P) if (has(P, u) && P[u].bagli) b = true;
    V.bagli = b;
  }
  function izGeldi(p, e) {
    var tr = e.track, kind = tr.kind;
    if (!p.uzak) p.uzak = new MediaStream();
    try { p.uzak.addTrack(tr); } catch (x) { }
    if (p !== V) {                                             /* öğretmen ← öğrenci (eşten eşe) */
      if (kind === 'audio') { p.sesIz = tr; sesBagla(p.kim, tr); rolele(); }
      else { p.kamIz = tr; gorSec(); }
      if (!V.uzak) V.uzak = new MediaStream();
      try { V.uzak.addTrack(tr); } catch (x2) { }
      return;
    }
    if (SFU.kip === 'sfu' || SFU.baslatiliyor) {               /* SFU: iz kimin — abone olurken mid kaydedildi */
      var k = SFU.mid[(e.transceiver && e.transceiver.mid) || ''] || null;
      if (!k) {                                                /* SFU mid bildirmediyse: bekleyen aboneliklerden aynı türün ilki */
        for (var i = 0; i < SFU.midsiz.length; i++) if ((SFU.midsiz[i].tur === 'kamera') === (kind === 'video')) { k = SFU.midsiz.splice(i, 1)[0]; break; }
      }
      if (!k || !SFU.abone[k.anahtar]) return;                 /* bırakılmış / bilinmeyen abonelik: çalınmaz */
      if (kind === 'audio') sesBagla(k.kim, tr);
      else if (OGR || k.kim === D.gorKim) goruntuBagla(tr);
      return;
    }
    /* öğrenci ← öğretmen (eşten eşe): ilk ses yolu öğretmenin mikrofonu, «söz» yolu aktarılan söz sesi */
    if (kind === 'audio') sesBagla((p.sozTr && e.transceiver === p.sozTr) ? 'soz' : 'ogt', tr);
    else goruntuBagla(tr);
  }
  function yeniPc(p, sfu) {
    var pc = new RTCPeerConnection(sfu ? SFU_PC : (V.ice || YEDEK));
    pc.onicecandidate = function (e) {
      if (sfu || pc !== p.pc || !e.candidate) return;
      iz('adayGonder', p.n + ' ' + String(e.candidate.candidate).slice(0, 40));
      /* teklif/cevap yazılmadan aday yazılmaz (güncelleme «aday»ı siler: önce yazılan aday kaybolurdu) */
      if (p.adayKuyruk) { p.adayKuyruk.push(e.candidate.toJSON()); return; }
      adayYaz(p, e.candidate.toJSON());
    };
    pc.ontrack = function (e) { if (pc === p.pc) { try { izGeldi(p, e); } catch (x) { iz('izHata', x && x.message); } ciz(); } };
    var durum = function () {
      if (pc !== p.pc) return;
      var s = pc.connectionState || pc.iceConnectionState;
      iz('pc', p.kim + ' ' + s + ' ice=' + pc.iceConnectionState + ' sig=' + pc.signalingState);
      if (s === 'connected' || s === 'completed') {
        p.bagli = true; p.deneme = 0; clearTimeout(p.kopZ); p.kopZ = null;
        if (!p.baglandiT) p.baglandiT = SIMDI();
        if (!D.katildiT) D.katildiT = SIMDI();
      } else if (s === 'failed') { p.bagli = false; koptu(p); }
      else if (s === 'disconnected') {
        p.bagli = false;
        clearTimeout(p.kopZ);
        p.kopZ = setTimeout(function () { p.kopZ = null; if (pc === p.pc && pc.connectionState !== 'connected' && pc.iceConnectionState !== 'connected' && pc.iceConnectionState !== 'completed') koptu(p); }, 6000);
      } else if (s === 'closed') p.bagli = false;
      if (p !== V) { bagliGuncelle(); rolele(); }
      ciz();
    };
    pc.onconnectionstatechange = durum;
    pc.oniceconnectionstatechange = durum;
    return pc;
  }
  function pcKapat(p) {
    p = p || V;
    iz('pcKapat', p.kim + ' ' + p.n);
    clearTimeout(p.kopZ); p.kopZ = null;
    clearTimeout(p.bekciZ); p.bekciZ = null; p.adayKuyruk = null;
    var pc = p.pc; p.pc = null; p.vSender = null; p.sozSender = null; p.sozTr = null; p.sozIz = null; p.sesIz = null; p.kamIz = null; p.bagli = false; p.bekleyen = []; p.gorulenAday = {};
    if (pc) { try { pc.onicecandidate = pc.ontrack = pc.onconnectionstatechange = pc.oniceconnectionstatechange = null; pc.close(); } catch (e) { } }
    if (p !== V && p.uzak && V.uzak) { try { p.uzak.getTracks().forEach(function (t) { V.uzak.removeTrack(t); }); } catch (e) { } }
    p.uzak = null;
    if (p === V) {
      if (OGR || SFU.kip === 'sfu' || SFU.baslatiliyor) { for (var k in SESLER) if (has(SESLER, k)) sesKopar(k); goruntuBagla(null); }
    } else {
      sesKopar(p.kim);
      bagliGuncelle(); rolele(); gorSec();
    }
  }
  function esKapat(uid) {                      /* öğretmen: öğrencinin bağlantısı ve kayıtları (çıkarıldı / ayrıldı) */
    var p = P[uid];
    if (p) { clearTimeout(p.denemeZ); p.denemeZ = null; pcKapat(p); delete P[uid]; }
    if (SFU.kip === 'sfu') { sfuBirak(uid, 'ses'); sfuBirak(uid, 'kamera'); }
    sesKopar(uid);
  }
  function koptu(p) {                          /* bağlantı düştü: öğrenci yeniden teklif eder, öğretmen ister (artan bekleme); SFU: oturum baştan */
    if (D.cikiyor || p.denemeZ) return;
    var bekle = Math.min(20000, 800 * Math.pow(2, p.deneme++));
    pcKapat(p);
    p.denemeZ = setTimeout(function () {
      p.denemeZ = null;
      if (D.cikiyor) return;
      if (SFU.kip === 'sfu') { sfuBasla(); return; }
      if (OGR) { if (D.ogt && D.ogt.kimlik) teklifEt(); }
      else if (P[p.kim] === p && D.davetliler[p.kim]) yenileIste(p.kim);
    }, bekle);
    ciz();
  }
  function yenileIste(uid) { try { kok.child('ses/ogtk/' + uid + '/yenile').set(TS()); } catch (e) { } }
  function adayYolu(p) { return OGR ? 'ses/ogr/' + UID + '/aday' : 'ses/ogtk/' + p.kim + '/aday'; }
  function adayYaz(p, c) { try { kok.child(adayYolu(p)).push({ n: p.n, c: c }); } catch (x) { } }
  function adayAkit(p) { var l = p.adayKuyruk || []; p.adayKuyruk = null; l.forEach(function (c) { adayYaz(p, c); }); }
  function bekciKur(p, pc, ms) {              /* bekçi: bu kadar sürede bağlanmadıysa yeniden (öğrenci teklif, öğretmen ister) */
    clearTimeout(p.bekciZ);
    p.bekciZ = setTimeout(function () { p.bekciZ = null; if (pc === p.pc && !p.bagli && !D.cikiyor) { iz('bekci', p.kim + ' ' + pc.connectionState); koptu(p); } }, ms);
  }
  function adayGeldi(p, v) {
    if (!v || !v.c || v.n !== p.n || !p.pc) return false;
    if (!p.pc.remoteDescription) { p.bekleyen.push(v.c); return true; }
    try { p.pc.addIceCandidate(new RTCIceCandidate(v.c)).catch(function () { }); } catch (e) { }
    return true;
  }
  function adaylar(p, o) {                    /* kayıttaki adaylar: görülmemiş olanlar işlenir (başka teklifin adayı beklemede kalır) */
    if (!o || !p) return;
    for (var k in o) { if (!has(o, k) || p.gorulenAday[k]) continue; if (adayGeldi(p, o[k])) p.gorulenAday[k] = 1; }
  }
  function adayBosalt(p) {
    var l = p.bekleyen; p.bekleyen = [];
    l.forEach(function (c) { try { p.pc.addIceCandidate(new RTCIceCandidate(c)).catch(function () { }); } catch (e) { } });
  }
  /* ÖĞRENCİ: teklif — ses (mikrofon), görüntü (kamera, sonradan açılır) ve «söz» yolu (yalnız alır: söz alanın aktarılan sesi) */
  function teklifEt() {
    iz('teklifEt', (D.ogt && D.ogt.kimlik) + ' hazir=' + D.hazir + ' cikiyor=' + D.cikiyor);
    if (!OGR || D.cikiyor || !D.hazir || !D.ogt || !D.ogt.kimlik) return;
    pcKapat(V);
    var n = V.n = rastgele(), icin = V.icin = D.ogt.kimlik;
    var pc = V.pc = yeniPc(V);
    V.adayKuyruk = [];
    bekciKur(V, pc, 20000);
    var ses = V.yerel && V.yerel.getAudioTracks()[0];
    if (ses) pc.addTrack(ses, V.yerel); else pc.addTransceiver('audio', { direction: 'recvonly' });
    var tr = pc.addTransceiver('video', { direction: 'sendrecv' });
    V.vSender = tr.sender;
    if (V.kam) { try { tr.sender.replaceTrack(V.kam); } catch (e) { } }
    V.sozTr = pc.addTransceiver('audio', { direction: 'recvonly' });
    pc.createOffer().then(function (o) { return pc.setLocalDescription(o).then(function () { return o; }); }).then(function (o) {
      if (pc !== V.pc) return;
      var r = kok.child('ses/ogr/' + UID);
      r.onDisconnect().remove();
      return r.update({ n: n, icin: icin, kip: 'p2p', sfu: null, kamera: !!V.kam, mik: D.mik, teklif: { type: o.type, sdp: o.sdp }, aday: null, t: TS() }).then(function () { if (pc === V.pc) adayAkit(V); });
    }).catch(function (e) { iz('teklifHata', e && e.message); bildir('Ses bağlantısı kurulamadı: ' + ((e && e.message) || e), 4000); });
    ciz();
  }
  /* ÖĞRETMEN: bir öğrencinin teklifine cevap (eşten eşe: öğrenci başına ayrı bağlantı) */
  function cevapla(uid, v) {
    if (OGR || D.cikiyor || !D.hazir || !v || !v.teklif || v.icin !== BEN) return;
    var p = P[uid] || (P[uid] = yeniEs(uid));
    if (v.n === p.cevaplananN) return;                        /* bu teklif cevaplandı */
    iz('cevapla', uid + ' ' + v.n);
    pcKapat(p);
    p.n = p.cevaplananN = v.n;
    var pc = p.pc = yeniPc(p);
    p.adayKuyruk = [];
    bekciKur(p, pc, 25000);
    pc.setRemoteDescription(new RTCSessionDescription(v.teklif)).then(function () {
      if (pc !== p.pc) return;
      var ses = V.yerel && V.yerel.getAudioTracks()[0], sesTr = null, sesNo = 0;
      pc.getTransceivers().forEach(function (tr) {
        var kind = (tr.receiver && tr.receiver.track && tr.receiver.track.kind) || '';
        if (kind === 'video') {
          p.vSender = tr.sender;
          try { tr.direction = 'sendrecv'; } catch (e) { }
          if (V.kam) { try { tr.sender.replaceTrack(V.kam); } catch (e) { } }
        } else if (kind === 'audio') {
          if (sesNo++ === 0) sesTr = tr;                       /* öğrencinin mikrofonu ↔ öğretmenin mikrofonu */
          else if (!p.sozSender) { p.sozSender = tr.sender; try { tr.direction = 'sendonly'; } catch (e) { } }   /* «söz» yolu: söz alanın sesi buradan aktarılır */
        }
      });
      if (ses) {
        if (sesTr) { try { sesTr.direction = 'sendrecv'; sesTr.sender.replaceTrack(ses); } catch (e) { } }
        else pc.addTrack(ses, V.yerel);
      }
      adayBosalt(p);
      return pc.createAnswer();
    }).then(function (c) {
      if (!c || pc !== p.pc) return;
      return pc.setLocalDescription(c).then(function () {
        return kok.child('ses/ogtk/' + uid).update({ cevap: { type: c.type, sdp: c.sdp, n: v.n }, aday: null });
      }).then(function () { if (pc === p.pc) { adayAkit(p); rolele(); } });
    }).catch(function (e) { iz('cevapHata', uid + ' ' + (e && e.message)); bildir('Ses bağlantısı kurulamadı: ' + ((e && e.message) || e), 4000); });
    ciz();
  }
  /* ÖĞRETMEN, eşten eşe: söz alan öğrencinin sesi öbür öğrencilere aktarılır (söz yoksa / söz o öğrencideyse yol boş) */
  function rolele() {
    if (OGR || SFU.kip === 'sfu') return;
    var kaynak = (D.soz && P[D.soz] && P[D.soz].bagli) ? P[D.soz].sesIz : null;
    for (var u in P) {
      if (!has(P, u)) continue;
      var p = P[u], hedef = (u !== D.soz) ? (kaynak || null) : null;
      if (!p.sozSender || p.sozIz === hedef) continue;
      p.sozIz = hedef;
      try { p.sozSender.replaceTrack(hedef); iz('rolele', u + ' ← ' + (hedef ? D.soz : 'yok')); } catch (e) { }
    }
  }

  /* ------------------------------------------------------------ SFU (06.11.2026): Cloudflare Realtime */
  function sfuCagri(islem, sid, govde) {        /* Cloud Function «sfu» (REST): uygulama gizi sunucuda */
    if (typeof window.__sfuSahte === 'function') return window.__sfuSahte(islem, sid, govde);   /* deneme kancası */
    var u = auth.currentUser;
    if (!u || typeof fetch !== 'function') return Promise.reject(new Error('giriş yok'));
    return u.getIdToken().then(function (j) {
      return fetch(SFU_ADRES, { method: 'POST', cache: 'no-store', credentials: 'omit',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + j }, body: JSON.stringify({ data: { islem: islem, sid: sid || null, govde: govde || null } }) });
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, durum: r.status, j: j }; }, function () { return { ok: r.ok, durum: r.status, j: {} }; }); })
      .then(function (x) {
        if (!x.ok || (x.j && x.j.error)) { var e = new Error((x.j && x.j.error && x.j.error.message) || ('http ' + x.durum)); e.durum = x.durum; e.kod = x.j && x.j.error && x.j.error.status; throw e; }
        var r = x.j && x.j.result;
        if (!r) throw new Error('boş cevap');
        if (r.errorCode) { var e2 = new Error(r.errorDescription || r.errorCode); e2.kod = r.errorCode; throw e2; }
        return r;
      });
  }
  function sfuSira(f) { var p = SFU.kuyruk.then(f, f); SFU.kuyruk = p.catch(function () { }); return p; }   /* SFU işlemleri sırayla (SDP tek seferde değişir) */
  /* aday toplama bitsin (en çok 1,5 sn): SFU'ya giden SDP adayları da taşısın (trickle yok) */
  function adayBekle(pc, ms) {
    return new Promise(function (ok) {
      if (!pc || pc.iceGatheringState === 'complete') { ok(); return; }
      var bitti = false, z = setTimeout(function () { if (!bitti) { bitti = true; ok(); } }, ms || 1500);
      pc.addEventListener('icegatheringstatechange', function f() { if (pc.iceGatheringState === 'complete' && !bitti) { bitti = true; clearTimeout(z); pc.removeEventListener('icegatheringstatechange', f); ok(); } });
    });
  }
  function sfuSifirla() {
    SFU.sid = null; SFU.izler = {}; SFU.abone = {}; SFU.kimler = {}; SFU.midler = {}; SFU.mid = {}; SFU.midsiz = []; SFU.baslatiliyor = null;
    /* söz sesi dinleyicisi de baştan: yeni oturumda yeniden abone olunur (sozSesBak) */
    try { if (SFU.sozRef) SFU.sozRef.off(); } catch (e) { }
    SFU.sozRef = null; SFU.sozKim = null;
  }
  /* kendi oturumu: eş bağlantısı + sessions/new + mikrofon yayını; kaydı odaya yazar */
  function sfuBasla() {
    if (SFU.baslatiliyor) return SFU.baslatiliyor;
    if (D.cikiyor) return Promise.reject(new Error('çıkılıyor'));
    pcKapat(V); sfuSifirla();
    var pc = V.pc = yeniPc(V, true);
    SFU.baslatiliyor = sfuCagri('oturum').then(function (r) {
      if (pc !== V.pc) throw new Error('eş değişti');
      if (!r.sessionId) throw new Error('oturum yok');
      SFU.sid = String(r.sessionId);
      iz('sfu', 'oturum ' + SFU.sid.slice(0, 8));
      var ses = V.yerel && V.yerel.getAudioTracks()[0];
      bekciKur(V, pc, 25000);
      return ses ? sfuYayinla('ses', ses) : null;
    }).then(function () {
      if (pc !== V.pc) throw new Error('eş değişti');
      SFU.kip = 'sfu'; SFU.hata = '';
      if (V.kam) return sfuYayinla('kamera', V.kam);
    }).then(function () {
      SFU.baslatiliyor = null;
      sfuKaydiYaz();
      sfuKarsiBak();
      ciz();
      return true;
    }).catch(function (e) {
      SFU.baslatiliyor = null;
      iz('sfuHata', e && e.message);
      SFU.hata = (e && e.message) || 'hata';
      return false;
    });
    return SFU.baslatiliyor;
  }
  /* iz yayınla: sendonly alıcı-verici + teklif → tracks/new (local) → SFU cevabı */
  function sfuYayinla(ad, track) {
    return sfuSira(function () {
      var pc = V.pc; if (!pc || !SFU.sid) throw new Error('oturum yok');
      var tr = pc.addTransceiver(track, { direction: 'sendonly' });
      return pc.createOffer().then(function (o) { return pc.setLocalDescription(o); }).then(function () { return adayBekle(pc); }).then(function () {
        return sfuCagri('iz', SFU.sid, { sessionDescription: { sdp: pc.localDescription.sdp, type: 'offer' }, tracks: [{ location: 'local', mid: tr.mid, trackName: ad }] });
      }).then(function (r) {
        var t = r.tracks && r.tracks[0];
        if (t && t.errorCode) throw new Error(t.errorDescription || t.errorCode);
        if (!r.sessionDescription) throw new Error('cevap yok');
        return pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: r.sessionDescription.sdp }));
      }).then(function () { SFU.izler[ad] = tr; if (ad === 'kamera') V.vSender = tr.sender; iz('sfu', 'yayın ' + ad + ' mid=' + tr.mid); });
    });
  }
  /* birinin izine abone ol: tracks/new (remote) → SFU teklifi → cevap → renegotiate. kim: 'ogt' ya da öğrencinin uid'i.
     Anahtar: <karşı oturum>/<iz adı>. Kurulurken bırakılırsa (söz bitti, öğrenci çıktı) kurulum bitince iz kapatılır. */
  function sfuAbone(kim, karsiSid, ad) {
    var anahtar = karsiSid + '/' + ad, midim = null;
    if (SFU.abone[anahtar]) return Promise.resolve();
    SFU.abone[anahtar] = 'bekliyor'; SFU.kimler[anahtar] = kim;
    return sfuSira(function () {
      var pc = V.pc; if (!pc || !SFU.sid) throw new Error('oturum yok');
      if (!SFU.abone[anahtar]) return;                          /* sırasını beklerken bırakıldı */
      return sfuCagri('iz', SFU.sid, { tracks: [{ location: 'remote', sessionId: karsiSid, trackName: ad }] }).then(function (r) {
        var t = r.tracks && r.tracks[0];
        if (t && t.errorCode) throw new Error(t.errorDescription || t.errorCode);
        if (t && t.mid != null) { midim = String(t.mid); SFU.midler[anahtar] = midim; SFU.mid[midim] = { kim: kim, tur: ad, anahtar: anahtar }; }   /* ontrack: iz kimin */
        else SFU.midsiz.push({ kim: kim, tur: ad, anahtar: anahtar });
        if (!r.requiresImmediateRenegotiation || !r.sessionDescription) return;
        return pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: r.sessionDescription.sdp }))
          .then(function () { return pc.createAnswer(); }).then(function (a) { return pc.setLocalDescription(a); }).then(function () { return adayBekle(pc); })
          .then(function () { return sfuCagri('anlas', SFU.sid, { sessionDescription: { sdp: pc.localDescription.sdp, type: 'answer' } }); });
      }).then(function () {
        if (SFU.abone[anahtar]) { SFU.abone[anahtar] = true; iz('sfu', 'abone ' + ad + ' ← ' + karsiSid.slice(0, 8)); return; }
        if (midim) {                                            /* kurulurken bırakıldı: iz kapatılır */
          delete SFU.mid[midim]; delete SFU.midler[anahtar];
          return sfuCagri('kapat', SFU.sid, { tracks: [{ mid: midim }], force: true }).then(function () { }, function () { });
        }
      });
    }).catch(function (e) { delete SFU.abone[anahtar]; delete SFU.kimler[anahtar]; iz('sfuHata', 'abone ' + ad + ': ' + (e && e.message)); throw e; });
  }
  /* aynı kişinin aynı izine tek abonelik: oturumu değiştiyse (sayfası yenilendi) eskisi bırakılır */
  function sfuTek(kim, karsiSid, ad) {
    var son = '/' + ad;
    for (var a in SFU.kimler) {
      if (has(SFU.kimler, a) && SFU.kimler[a] === kim && a.slice(-son.length) === son && a !== karsiSid + son) { sfuBirak(kim, ad); break; }
    }
    return sfuAbone(kim, karsiSid, ad);
  }
  /* aboneliği bırak (söz bitti, öğrenci çıktı, gösterilen kamera değişti): iz kapatılır (olmazsa yalnız susar) */
  function sfuBirak(kim, ad) {
    var son = '/' + ad, bulundu = false;
    for (var a in SFU.kimler) {
      if (!has(SFU.kimler, a) || SFU.kimler[a] !== kim || a.slice(-son.length) !== son) continue;
      bulundu = true;
      var kurulu = SFU.abone[a] === true, mid = SFU.midler[a];
      delete SFU.abone[a]; delete SFU.kimler[a];
      if (!kurulu || !mid) continue;                            /* kurulmakta olan: sfuAbone bitince kendisi kapatır */
      delete SFU.midler[a]; delete SFU.mid[mid];
      (function (m) {
        sfuSira(function () { if (!V.pc || !SFU.sid) return; return sfuCagri('kapat', SFU.sid, { tracks: [{ mid: m }], force: true }); })
          .then(function () { iz('sfu', 'bırakıldı ' + ad + ' ' + kim); }, function (e) { iz('sfuHata', 'bırak ' + ad + ': ' + (e && e.message)); });
      })(mid);
    }
    if (ad === 'ses') sesKopar(kim);
    return bulundu;
  }
  function sfuKameraYayinla() {
    var t = SFU.izler.kamera;
    var p = t ? Promise.resolve(t.sender.replaceTrack(V.kam)) : sfuYayinla('kamera', V.kam);
    p.then(function () { try { kok.child(benimYol() + '/sfu/kamera').set(true); } catch (e) { } }, function () { });
  }
  /* kendi SFU kaydı odaya: karşı taraf görünce abone olur */
  function sfuKaydiYaz() {
    if (!SFU.sid) return;
    var r = kok.child(benimYol());
    var kayit = { kip: 'sfu', sfu: { sid: SFU.sid, ses: !!SFU.izler.ses, kamera: !!(SFU.izler.kamera && V.kam) }, kamera: !!V.kam, mik: D.mik, t: TS() };
    if (OGR) { kayit.teklif = null; kayit.aday = null; }
    else kayit.kimlik = BEN;
    r.onDisconnect().remove(); r.update(kayit);
  }
  /* öbür tarafların kayıtlarına bak: kimlere abone olunacak */
  function sfuKarsiBak() {
    if (SFU.kip !== 'sfu' || !SFU.sid || !V.pc) return;
    if (OGR) {
      /* öğrenci: öğretmenin sesi (ve kamerası); söz başka bir öğrencideyse onun sesi */
      var k = D.ogt && D.ogt.sfu;
      if (k && k.sid) {
        if (k.ses) sfuTek('ogt', k.sid, 'ses').catch(function () { });
        if (k.kamera) sfuTek('ogt', k.sid, 'kamera').catch(function () { });
        else sfuBirak('ogt', 'kamera');
      }
      sozSesBak();
      return;
    }
    /* öğretmen: bütün öğrencilerin sesi; kamera yalnız gösterilen öğrenciden (gorSec) */
    for (var u in D.ogr) {
      if (!has(D.ogr, u) || !D.davetliler[u]) continue;
      var o = D.ogr[u] && D.ogr[u].sfu;
      if (o && o.sid && o.ses) sfuTek(u, o.sid, 'ses').catch(function () { });
    }
    gorSec();
  }
  /* öğrenci, SFU: söz başka bir öğrencideyse onun ses kaydını dinle ve sesine abone ol; söz değişince / bitince bırak */
  function sozSesBak() {
    if (!OGR) return;
    var istenen = (SFU.kip === 'sfu' && D.soz && D.soz !== UID) ? D.soz : null;
    if (SFU.sozKim === istenen) return;
    if (SFU.sozKim) { try { if (SFU.sozRef) SFU.sozRef.off(); } catch (e) { } SFU.sozRef = null; sfuBirak(SFU.sozKim, 'ses'); }
    SFU.sozKim = istenen;
    if (!istenen) return;
    var kim = istenen, r = SFU.sozRef = kok.child('ses/ogr/' + kim + '/sfu');
    r.on('value', function (s) {
      var v = s.val();
      if (SFU.sozKim !== kim || SFU.kip !== 'sfu' || !v || !v.sid || !v.ses) return;
      sfuTek(kim, v.sid, 'ses').catch(function () { });                       /* arkadaşın sayfası yenilendiyse yeni oturumuna */
    }, function () { });
  }

  /* ------------------------------------------------------------ söz (26.11.2026) */
  function sozVer(uid) {
    if (OGR || !uid || D.cikiyor || !D.davetliler[uid]) return;
    if (!cokMu()) { bildir('Söz verme, veritabanı kuralının yeni hâli kurulunca açılır.', 4500); return; }
    var ad = adOf(uid);
    if (!derste(uid)) { bildir(ad + ' henüz derste değil.'); return; }
    if (!T.soz || !T.soz.ver(uid, ad)) { bildir('Söz verilemedi.'); return; }
    try { if (D.ogr[uid] && D.ogr[uid].el) kok.child('ses/ogr/' + uid + '/el').set(null); } catch (e) { }
    bildir('Söz verildi: ' + ad + ' — sayfayı o kullanabilir, herkes onu izler.', 4500);
  }
  function sozAl(sessiz) {
    if (OGR || !D.soz) return;
    var ad = D.sozAd || adOf(D.soz);
    if (T.soz) T.soz.ver(null);
    if (sessiz !== true) bildir('Söz geri alındı: ' + ad, 3500);
  }
  var sozZ = null;
  function sozDenetle() {                    /* söz sahibi dersten düştüyse söz bir süre sonra kendiliğinden geri alınır */
    if (OGR) return;
    if (D.soz && !D.cikiyor && !derste(D.soz)) {
      if (!sozZ) sozZ = setTimeout(function () {
        sozZ = null;
        if (D.soz && !D.cikiyor && !derste(D.soz)) { sozAl(true); bildir('Söz sahibi dersten ayrıldı; söz geri alındı.', 4000); }
      }, +window.__kidefSozBekle > 0 ? +window.__kidefSozBekle : SOZ_BEKLE);          /* deneme kancası */
    } else if (sozZ) { clearTimeout(sozZ); sozZ = null; }
  }
  /* öğrenci: söz iste / isteği geri al (el kaldırma) */
  function elDegistir() {
    if (!OGR || D.cikiyor || D.soz === UID) return;
    D.el = !D.el;
    try { var r = kok.child('ses/ogr/' + UID); r.onDisconnect().remove(); r.child('el').set(D.el ? TS() : null); } catch (e) { }
    bildir(D.el ? 'Söz istedin: öğretmen görünce söz verebilir.' : 'Söz isteği geri alındı.', 3000);
    ciz();
  }

  /* ------------------------------------------------------------ çağrı (öğretmen) */
  function cagriYaz(uid) {
    var r = vt.ref('canliCagri/' + uid);
    return r.set({ oda: ODA, ad: ADIM, t: TS() }).then(function () { r.onDisconnect().remove(); });
  }
  function izleSil(g, uid) {                  /* öğrencinin varlık kayıtları: çıkarılan öğrenci kendisi silemez (izni düşer) */
    for (var k in D.izle) if (has(D.izle, k) && D.izle[k] && D.izle[k].uid === uid) g['oda/izle/' + k] = null;
  }
  function cikarYazisi(g, uid) {
    g['davetliler/' + uid] = null; g['ses/ogr/' + uid] = null; g['ses/ogtk/' + uid] = null; g['oda/ekran/' + uid] = null;
    izleSil(g, uid);
    try { vt.ref('canliCagri/' + uid).remove(); } catch (e) { }
    esKapat(uid);
  }
  function cagir(uid, ad) {
    if (OGR || !uid || D.cikiyor) return;
    uid = String(uid); ad = String(ad || 'Öğrenci').slice(0, 40);
    var L = cagrilanlar(), zaten = !!D.davetliler[uid], cok = cokMu(), g = { bitti: null, davetT: TS() };
    if (!zaten && cok && L.length >= EN_COK) { bildir('Bir derse en çok ' + EN_COK + ' öğrenci çağrılabilir.', 4000); return; }
    g['davetliler/' + uid] = { ad: ad, t: (zaten && D.davetliler[uid].t) || TS() };
    if (!cok) {
      /* eski kural: tek öğrenci — başkası çağrılınca öncekiler çıkar (okuma izni tek «davetli»ye bağlı) */
      L.forEach(function (s) { if (s.uid !== uid) { if (D.soz === s.uid) sozAl(true); cikarYazisi(g, s.uid); } });
      g.davetli = uid; g.davetliAd = ad;
      D.listeAcik = false;
    } else {
      if (!D.davetli || !D.davetliler[D.davetli] || D.davetli === uid) { g.davetli = uid; g.davetliAd = ad; }
      D.listeAcik = true;                                    /* çok öğrenci: liste açık kalır (sıradakini çağır, söz ver) */
    }
    if (!zaten) g['ses/ogr/' + uid] = null;
    kok.update(g).then(function () { return cagriYaz(uid); })
      .then(function () { bildir(ad + ' çağrıldı.'); }, function (e) { bildir('Çağrı yazılamadı: ' + ((e && e.message) || e), 4000); });
    ciz();
  }
  /* bir sınıftaki (listedeki grup) çağrılmamış herkesi çağır */
  function sinifiCagir(sinif) {
    if (OGR || D.cikiyor) return;
    if (!cokMu()) { bildir('Sınıfı birden çağırma, veritabanı kuralının yeni hâli kurulunca açılır.', 4500); return; }
    var L = D.liste.filter(function (s) { return String(s.sinif || '') === String(sinif || '') && !D.davetliler[s.uid]; });
    if (!L.length) return;
    var yer = EN_COK - cagrilanlar().length;
    if (L.length > yer) { L = L.slice(0, Math.max(0, yer)); bildir('Bir derse en çok ' + EN_COK + ' öğrenci çağrılabilir.', 4000); if (!L.length) return; }
    var g = { bitti: null, davetT: TS() };
    L.forEach(function (s) { g['davetliler/' + s.uid] = { ad: String(s.ad || 'Öğrenci').slice(0, 40), t: TS() }; g['ses/ogr/' + s.uid] = null; });
    if (!D.davetli || !D.davetliler[D.davetli]) { g.davetli = String(L[0].uid); g.davetliAd = String(L[0].ad || 'Öğrenci').slice(0, 40); }
    D.listeAcik = true;
    kok.update(g).then(function () { return Promise.all(L.map(function (s) { return cagriYaz(String(s.uid)).catch(function () { }); })); })
      .then(function () { bildir(L.length + ' öğrenci çağrıldı.'); }, function (e) { bildir('Çağrı yazılamadı: ' + ((e && e.message) || e), 4000); });
  }
  function cikar(uid) {
    if (OGR || !uid || D.cikiyor || !D.davetliler[uid]) return;
    var ad = adOf(uid), g = {};
    if (D.soz === uid) sozAl(true);
    cikarYazisi(g, uid);
    if (D.davetli === uid) { var k = cagrilanlar().filter(function (s) { return s.uid !== uid; })[0]; g.davetli = k ? k.uid : null; g.davetliAd = k ? k.ad : null; }
    kok.update(g).then(function () { bildir(ad + ' dersten çıkarıldı.'); }, function () { });
  }
  function hepsiniKapat() { pcKapat(V); for (var u in P) if (has(P, u)) { clearTimeout(P[u].denemeZ); pcKapat(P[u]); } }
  function bitir() {
    if (OGR || D.cikiyor) return;
    D.cikiyor = true;
    clearTimeout(sozZ); sozZ = null;
    if (DERS) istatOku().then(function () { dersBitir('bitir', true); hepsiniKapat(); });   /* son sayaç okuması, kayıt, sonra bağlantılar kapanır */
    else hepsiniKapat();
    try { if (V.yerel) V.yerel.getTracks().forEach(function (t) { t.stop(); }); if (V.kam) V.kam.stop(); } catch (e) { }
    cagrilanlar().forEach(function (s) { try { vt.ref('canliCagri/' + s.uid).remove(); } catch (e) { } });
    /* çağrılanlar silinmez: öğrencilerin okuma izni sürer, kumandanın «Bitir»i (yayin/bitir) onları ana sayfaya yollar */
    try { kok.update({ ses: null, bitti: true }); } catch (e) { }
    setTimeout(function () {
      var b = $('thBitirDug');
      if (b) b.click(); else { try { T.cik('index.html'); } catch (e) { location.href = 'index.html'; } }
    }, 250);
  }
  /* ------------------------------------------------------------ ayrılış (öğrenci) */
  function ayril() {
    if (!OGR || D.cikiyor) return;
    D.cikiyor = true;
    pcKapat(V);
    try { if (V.yerel) V.yerel.getTracks().forEach(function (t) { t.stop(); }); if (V.kam) V.kam.stop(); } catch (e) { }
    try { vt.ref('canliCagri/' + UID).remove(); } catch (e) { }
    try { kok.child('ses/ogr/' + UID).remove(); } catch (e) { }
    setTimeout(function () { try { T.cik('index.html', true); } catch (e) { location.href = 'index.html'; } }, 250);
  }
  function dersBitti(neden) {
    if (D.cikiyor) return;
    D.cikiyor = true;
    pcKapat(V);
    try { if (V.yerel) V.yerel.getTracks().forEach(function (t) { t.stop(); }); if (V.kam) V.kam.stop(); } catch (e) { }
    bildir(neden === 'cikarildi' ? 'Öğretmen seni dersten çıkardı. Ana sayfaya dönülüyor…' : 'Bu derse çağrılmadın ya da ders bitti. Ana sayfaya dönülüyor…', 3000);
    setTimeout(function () { try { T.cik('index.html'); } catch (e) { location.href = 'index.html'; } }, 1500);
  }

  /* ------------------------------------------------------------ veritabanı kuralı: yeni mi (çok öğrenci + söz) */
  function kuralBak() {
    if (typeof window.__kidefCanliKural === 'string') { D.kural = window.__kidefCanliKural; return; }     /* deneme kancası */
    try {
      var p = vt.ref('canliSurum').once('value', function () { D.kural = 'yeni'; ciz(); }, function () { D.kural = 'eski'; D.listeSon = null; ciz(); });
      if (p && p.catch) p.catch(function () { });                 /* eski kuralda okuma reddedilir: beklenen durum, konsola hata düşmesin */
    } catch (e) { D.kural = 'eski'; }
  }

  /* ------------------------------------------------------------ dinleyiciler */
  function ogretmenBasla() {                 /* veri dinleyicileri hemen (mikrofon izni beklenirken pencere çalışır) */
    ADIM = adim();
    D.liste = liste();
    kuralBak();
    kok.child('davetliler').on('value', function (s) {
      var once = D.davetliler, u;
      D.davetliler = s.val() || {};
      for (u in once) if (has(once, u) && !D.davetliler[u]) esKapat(u);        /* listeden çıkan öğrenci */
      if (D.ogrGeldi) ogrIsle(D.ogr);                                            /* ses kaydı çağrı kaydından önce gelmiş öğrenci */
      dersDenetle(); gorSec(); ciz();
    });
    kok.child('davetli').on('value', function (s) { D.davetli = s.val() || null; });
    kok.child('oda/izle').on('value', function (s) { D.izle = s.val() || {}; dersDenetle(); gorSec(); ciz(); });
    kok.child('oda/ayar').on('value', function (s) {
      var v = s.val() || {};
      D.soz = v.soz ? String(v.soz) : null; D.sozAd = v.soz ? String(v.sozAd || '') : '';
      rolele(); gorSec(); sozDenetle(); ciz();
    });
    kok.once('value', function (s) {
      var v = s.val() || {}, dl = v.davetliler || {}, u, hepsi = {};
      if (v.bitti) {
        /* önceki ders «Bitir»le bitmiş: yeni ders temiz başlar (eski çağrılanların okuma izni de düşer) */
        kok.update({ davetliler: null, davetli: null, davetliAd: null, davetT: null, bitti: null, ses: null });
        return;
      }
      for (u in dl) if (has(dl, u) && dl[u]) hepsi[u] = 1;
      /* eski biçim (yalnız «davetli»): listeye alınır */
      if (v.davetli && !hepsi[v.davetli]) { kok.child('davetliler/' + v.davetli).set({ ad: String(v.davetliAd || 'Öğrenci').slice(0, 40), t: v.davetT || TS() }); hepsi[v.davetli] = 1; }
      /* yarıda kalan ders (sekme kapandı, «Bitir» denmedi): oda yeniden açılınca çağrılanlar yeniden çağrılır */
      if (!D.cikiyor) for (u in hepsi) if (has(hepsi, u)) cagriYaz(u).catch(function () { });
    });
  }
  /* öğretmen: öğrencilerin ses kayıtları (D.ogr) → bağlantılar. once: önceki kayıtlar (kalkanların bağlantısı kapanır) */
  function ogrIsle(once) {
    var v = D.ogr, u, kamAcik = false;
    for (u in v) if (has(v, u) && v[u] && v[u].kamera && D.davetliler[u]) kamAcik = true;
    kamKarsi(kamAcik);
    if (SFU.kip === 'sfu') {
      for (u in once) if (has(once, u) && !v[u]) { sfuBirak(u, 'ses'); sfuBirak(u, 'kamera'); }
      sfuKarsiBak();                                                     /* SFU: öğrencilerin oturumlarına abone ol (kendi bağlantısı sürer) */
    } else if (SFU.kip && !SFU.baslatiliyor) {                           /* SFU kuruluyorsa bağlantılara dokunma */
      for (u in P) if (has(P, u) && !v[u]) esKapat(u);                   /* ses kaydı kalkan öğrenci (ayrıldı / koptu) */
      for (u in v) {
        if (!has(v, u) || !v[u] || !D.davetliler[u] || v[u].kip === 'sfu') continue;
        cevapla(u, v[u]);
        adaylar(P[u], v[u].aday);
      }
      gorSec();
    }
  }
  function ogretmenSes() {                   /* mikrofon ve bağlantı sunucuları hazır: işaretleşme */
    kok.child('ses/ogr').on('value', function (s) {
      var v = s.val() || {}, once = D.ogr, u;
      if (v.teklif || v.n || v.icin || v.sfu) v = {};                    /* eski sürüm kaydı (tek öğrenci, düz): yok sayılır */
      D.ogr = v; D.ogrGeldi = true;
      for (u in v) if (has(v, u) && v[u] && v[u].el && !(once[u] && once[u].el) && D.davetliler[u]) bildir(adOf(u) + ' söz istiyor.', 4500);
      ogrIsle(once);
      dersDenetle();
      ciz();
    });
    var kimlikYaz = function () {
      var r = kok.child('ses/ogt');
      r.onDisconnect().remove();
      try { kok.child('ses/ogtk').onDisconnect().remove(); } catch (e) { }
      if (SFU.kip === 'sfu') { sfuKaydiYaz(); return; }
      r.update({ kimlik: BEN, kip: 'p2p', sfu: null, t: TS(), kamera: !!V.kam, mik: D.mik });
    };
    /* önce SFU denenir (Cloud Function «sfu»); yoksa/olmazsa eşten eşe */
    sfuBasla().then(function (oldu) { if (!oldu) { SFU.kip = 'p2p'; pcKapat(V); } kimlikYaz(); if (D.ogrGeldi) ogrIsle(D.ogr); ciz(); });
    /* bağlantı gidip gelince: kimlik ve çağrılar yeniden (kopunca işleri silmiş olabilir) */
    vt.ref('.info/connected').on('value', function (s) {
      var once = D.baglanti;
      D.baglanti = !!s.val();
      if (D.baglanti && !once && !D.cikiyor) {
        if (SFU.kip) kimlikYaz();
        cagrilanlar().forEach(function (o) { if (!derste(o.uid)) cagriYaz(o.uid).catch(function () { }); });
      }
      ciz();
    });
  }
  function adKoy(ad) {
    window.__kidefCanliAd = ad;                              /* motor: cihaz adı = öğrencinin adı (tahtaAdi) */
    /* odanın «ekran» kaydı motor başlarken yazıldı (ad henüz yoktu): adı düzelt */
    try { var e = T.S && T.S.ekran; if (ad && e && e.id === BEN && e.ad !== ad) { e.ad = ad; kok.child('oda/ekran/' + UID).update({ ad: ad }); } } catch (x) { }
  }
  function ogrenciBasla() {                  /* veri dinleyicileri hemen */
    var vardi = false;
    kuralBak();                                /* «Söz iste» yalnız yeni kuralda (söz verilebiliyorsa) görünür */
    kok.child('davetliler/' + UID).on('value', function (s) {
      var v = s.val();
      if (v) { vardi = true; if (v.ad) adKoy(String(v.ad)); }
      else if (vardi) dersBitti('cikarildi');                 /* öğretmen listeden çıkardı */
      ciz();
    }, function () { dersBitti('izin'); });
    kok.child('davetli').on('value', function (s) { D.davetli = s.val() || null; }, function () { });
    kok.child('davetliAd').on('value', function (s) {       /* eski biçim (tek öğrenci): ad buradan */
      var ad = String(s.val() || '');
      if (ad && D.davetli === UID && !vardi) adKoy(ad);
    }, function () { });
    kok.child('oda/yayin').on('value', function (s) { D.yayin = s.val(); ciz(); }, function () { });
    kok.child('oda/ayar').on('value', function (s) {
      var v = s.val() || {}, once = D.soz;
      D.soz = v.soz ? String(v.soz) : null; D.sozAd = v.soz ? String(v.sozAd || '') : '';
      if (D.soz !== once) {
        if (D.soz === UID) bildir('Söz sende: sayfayı kullanabilirsin. Öğretmenin ve arkadaşların seni izliyor.', 6000);
        else if (once === UID) bildir('Öğretmen sözü geri aldı.', 3500);
        else if (D.soz) bildir('Söz verildi: ' + (D.sozAd || 'arkadaşın'), 3000);
      }
      sozSesBak();
      ciz();
    }, function () { });
    kok.child('ses/ogr/' + UID + '/el').on('value', function (s) { D.el = !!s.val(); ciz(); }, function () { });
    vt.ref('.info/connected').on('value', function (s) { D.baglanti = !!s.val(); ciz(); });
  }
  /* öğrenci: öğretmenin ses kaydı (ortak: ses/ogt; bu öğrenciye özel: ses/ogtk/<uid>) değişti */
  function ogtDegerlendir() {
    if (!D.ogtGeldi || !D.ogtkGeldi) return;
    var v = D.ogt, k = D.ogtk || {};
    kamKarsi(!!(v && v.kamera));
    if (v && v.kip === 'sfu') {                                /* öğretmen SFU'da: kendi oturumunu aç, öğretmenin izlerine abone ol */
      if (SFU.kip !== 'sfu' && !SFU.baslatiliyor) { if (V.pc) pcKapat(V); sfuBasla().then(function (oldu) { if (!oldu) { SFU.kip = 'p2p'; } ciz(); }); }
      else sfuKarsiBak();
      ciz(); return;
    }
    if (SFU.baslatiliyor) { ciz(); return; }                        /* SFU kuruluyor: bağlantıya dokunma */
    if (SFU.kip === 'sfu' && v && v.kimlik) { SFU.kip = null; pcKapat(V); sfuSifirla(); }   /* öğretmen eşten eşe döndü */
    if (!v || !v.kimlik) { if (V.pc) pcKapat(V); V.icin = null; ciz(); return; }
    if (v.kimlik !== V.icin) { V.sonYenile = k.yenile || null; V.deneme = 0; teklifEt(); return; }     /* öğretmen (yeniden) geldi */
    if ((k.yenile || null) !== V.sonYenile) { V.sonYenile = k.yenile || null; V.deneme = 0; teklifEt(); return; }   /* öğretmen yeniden istedi */
    if (k.cevap && V.pc && k.cevap.n === V.n && V.cevapN !== V.n && V.pc.signalingState === 'have-local-offer') {
      var pc = V.pc;
      V.cevapN = V.n;
      pc.setRemoteDescription(new RTCSessionDescription({ type: k.cevap.type, sdp: k.cevap.sdp }))
        .then(function () { if (pc === V.pc) { adayBosalt(V); adaylar(V, (D.ogtk || {}).aday); } }).catch(function (e) { iz('cevapUygHata', e && e.message); });
    }
    adaylar(V, k.aday);
    ciz();
  }
  function ogrenciSes() {                    /* mikrofon ve bağlantı sunucuları hazır: işaretleşme */
    kok.child('ses/ogtk/' + UID).on('value', function (s) { D.ogtk = s.val() || null; D.ogtkGeldi = true; ogtDegerlendir(); },
      function () { D.ogtkGeldi = true; ogtDegerlendir(); });
    kok.child('ses/ogt').on('value', function (s) {
      var v = s.val() || null;
      D.ogt = v; D.ogtGeldi = true;
      iz('ses/ogt', v ? ('kip=' + v.kip + ' kimlik=' + v.kimlik + ' sfu=' + !!(v.sfu && v.sfu.sid)) : 'yok');
      ogtDegerlendir();
    }, function () { });
  }

  /* DESTEKÇİYE AÇIK — İKİNCİ KAPI (23.11.2026): ders kabuğunu adresten açan öğretmen de destekçi olmalı (yönetici serbest).
     Durum, ana sayfada yazılan kidefDestekDurum'dan (sistem/hak.js payli() ile aynı kural) ya da yöneticinin kapı biletinden okunur.
     Öğrenci görünümü bu kapıya girmez. */
  var PAYLI_SEBEP = { odeme: 1, kismi: 1, referans: 1, yonetici: 1 };
  function destekciMi(uid) {
    try {
      var d = JSON.parse(localStorage.getItem('kidefDestekDurum') || 'null');
      if (d && d.uid === uid) {
        if (d.rol === 'admin') return true;
        if (d.rol === 'teacher' && d.sinirsiz && PAYLI_SEBEP[d.sebep] && (!d.bit || d.bit > Date.now())) return true;
      }
      var b = JSON.parse(localStorage.getItem('kidefKapiBilet') || 'null');
      if (b && b.uid === uid && b.rol === 'admin' && b.t && Date.now() - b.t < 24 * 3600000) return true;
    } catch (e) { }
    return false;
  }
  function destekEngel() {
    if ($('cdDestekEngel')) return;
    window.KidefCanliOda.engelli = true;
    var p = document.createElement('div');
    p.id = 'cdDestekEngel'; p.setAttribute('role', 'alertdialog'); p.setAttribute('aria-modal', 'true');
    p.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:18px;' +
      'background:rgba(15,42,67,.82);font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;';
    p.innerHTML = '<div style="max-width:430px;width:100%;background:#fff;color:#1F2430;border-radius:18px;padding:26px 22px 20px;text-align:center;box-shadow:0 22px 60px rgba(0,0,0,.45)">' +
      '<svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" style="color:#C0392B"><rect x="5" y="10.5" width="14" height="10" rx="2.4" fill="currentColor"/>' +
      '<path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>' +
      '<h3 style="margin:10px 0 8px;font-size:1.25rem">Canlı ders destekçilere açık</h3>' +
      '<p style="margin:0 0 10px;line-height:1.5;color:#44505E">Dersi başlatmak, Kidef\'e destek veren öğretmenlere açık. Öğrencinin katılması için destek gerekmez.</p>' +
      '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:14px 0 10px">' +
      '<a href="index.html#destek" style="padding:11px 16px;border-radius:11px;background:linear-gradient(135deg,#20C997,#16A085);color:#fff;font-weight:800;text-decoration:none">Destek ver</a>' +
      '<a href="index.html" style="padding:11px 16px;border-radius:11px;border:1px solid #D5DEE6;color:#1F2430;font-weight:700;text-decoration:none">Ana sayfaya dön</a></div>' +
      '<small style="display:block;color:#6B7886;line-height:1.45">Destek verdiysen Kidef ana sayfasını bu tarayıcıda bir kez aç, sonra canlı dersi yeniden başlat.</small></div>';
    document.body.appendChild(p);
  }

  function basla() {
    if (!window.firebase || !firebase.apps || !firebase.apps.length || !firebase.database) { setTimeout(basla, 150); return; }
    auth = firebase.auth(); vt = firebase.database(); kok = vt.ref('canli/' + ODA);
    stilKur();
    auth.onAuthStateChanged(function (u) {
      if (!u || u.isAnonymous || UID) return;                /* giriş yoksa kabuğun kendi ekranı var */
      UID = u.uid;
      if (!OGR && ODA !== 'ders_' + UID) return;             /* başkasının odası: tahta.js ana sayfaya yollar */
      if (!OGR && !destekciMi(UID)) { destekEngel(); return; }   /* destekçi değil (23.11.2026) */
      if (OGR) ogrenciBasla(); else ogretmenBasla();
      ciz();
      olcumBasla();
      Promise.all([mikAc(false), iceAl()]).then(function (r) {
        V.ice = r[1] || null;
        D.hazir = true;
        if (OGR) ogrenciSes(); else ogretmenSes();
        ciz();
      });
    });
    setInterval(sureYaz, 1000);
  }
  window.KidefCanliOda = { acik: true, oda: ODA, ogrenci: OGR, D: D, V: V, P: P, IST: IST, SFU: SFU, SESLER: SESLER, iz: IZ, izd: IZD,
                           cagir: cagir, sinifiCagir: sinifiCagir, cikar: cikar, sozVer: sozVer, sozAl: sozAl, el: elDegistir,
                           bitir: bitir, ayril: ayril, mik: mikDegistir, kamera: kameraIste, cagrilanlar: cagrilanlar, derstekiler: derstekiler,
                           ders: function () { return DERS; }, kayit: dersKayit, kuyruk: kuyruk, kayitYazisi: kayitYazisi, istatOku: istatOku };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
