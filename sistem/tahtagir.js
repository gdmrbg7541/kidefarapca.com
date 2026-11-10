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
   · AÇIK CİHAZDAN SEÇ (01.11.2026) — öğretmen: "kumanda özelliğinde kumanda olan cihaz ve
     yansıtılan cihazdan da girince sonra bağlanıyor bazen, iki cihaz da internete bağlı ve aynı
     öğretmen hesabıyla giriş yapılmışsa direkt başlamalı, ister kumanda olacak cihazdan
     yansıtılacak cihazı seçelim, ister yansıtılacak cihazdan kumanda seçelim". Pencerede, iki
     seçeneğin altında aynı hesabın sitesi şu an açık öbür cihazları: kumanda seçeneğinin altındakine
     dokununca o cihaz Sınıf Ekranı olur (kendiliğinden tahta.html?rol=izle), bu cihaz kumanda; Sınıf
     Ekranı seçeneğinin altındakine dokununca o cihaz kumanda olur (tahta.html?rol=yansit), bu cihaz
     Sınıf Ekranı. Öbür cihaza dokunmak, onu işaretlemek gerekmez.
     KAPI ZİLİ hesabın kendi belgesi (kullanicilar/<uid>): hesap/cihazlar.js ve sistem/kilit.js bu
     belgeyi zaten canlı dinliyor — Firestore aynı belgenin dinleyicilerini tek dinlemede birleştirir,
     yeni bağlantı yok; Realtime Database'e her cihazdan bağlanılmaz (eşzamanlı bağlantı sınırı).
       tahtaYokla = { y, k, t }            pencere açılınca (12 sn'de bir, en çok 8 kez) «kim açık?»
       tahtaYanit.<kimlik> = { y, ad, tur, t }   ana sayfası açık öğretmen cihazının cevabı
       tahtaCagri.<kimlik> = { n, rol, k, ad, t }  rol: 'izle' (Sınıf Ekranı ol) | 'yansit' (kumanda ol)
     Cihazların saati karşılaştırılmaz: sayfa açıldığında belgede duran yoklamaya cevap verilmez,
     duran çağrı işlenmez, silinir (TABAN); yalnız sayfa açıkken gelen işlenir. Bir çağrıyı bir sekme
     işler (localStorage kidef_tahta_cagri; önce görünen sekme). Aynı cihazın birden çok sekmesi
     açıksa Sınıf Ekranı'na / kumandaya yalnız biri geçer (Web Locks kidef_tahta_gecis; işaretli
     cihazın kendiliğinden geçişi de). Kural değişmedi: hesap kendi
     belgesini rolünü değiştirmeden güncelleyebiliyor.
   · BAĞLANTI ONAYI (10.11.2026) — öğretmen: "kumanda olarak seçilen bi cihazla yansıtılacak cihaz arasında şu olsun,
     kumanda olan cihazdan yansıtılacak cihaz seçildiğinde yansıtılacak cihazda bildirim gelsin, onaylanınca bağlansın"
     ve "zaten listeden seçmeyince bağlanma olmasın, listeden seçtikten sonra olmalı". «Sınıf Ekranı olacak cihaz»
     listesinden bir cihaza dokunulunca o cihazda «… bağlanmak istiyor» penceresi (Onayla / Reddet) çıkar; yalnız
     Onayla'da bağlanılır (hedef Sınıf Ekranı olur, istek yapan kumanda olur). Reddet'te, 60 sn cevapsızlıkta ya da
     kumandada «İptal»de (pencereyi kapatmak da iptaldir) bağlanılmaz. Hedef ana sayfadaysa (bu dosya):
       tahtaCagri.<hedef> = { n, rol:'izle', onay:1, k, ad, t }   hedefte onay penceresi (onayCagri)
       tahtaCevap.<istek yapan> = { n, d, t }                      d: goruldu (pencere açıldı) | onay | red
     Hedef Sınıf Ekranı sayfasındaysa (orada Firestore yok; ana sayfada da Realtime Database bağlantısı yok) aynı iş
     Realtime Database'te: tahta/<uid>/istek/<hedef> = { n, k, ad, t (sunucu saati) } ve
     tahta/<uid>/istekCevap/<istek yapan> = { n, d, t } (hedef tarafı: sistem/tahta.js → istekKur). Kural değişmedi.
     Listeden seçmeden bağlantı OLMAZ: «Bu cihazı kumanda olarak kullan» artık bağlamaz, listeyi gösterir ve yeniden
     arar; Sınıf Ekranı olarak işaretli cihaz da yansıtma başlayınca kendiliğinden geçmez (OTO_GECIS = false).
     Değişmeyenler: Sınıf Ekranı'ndan kumanda seçmek (ters yön), karekod, kumandanın kaldığı yere dönüşü.
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
    /* açık cihazdan seç (01.11.2026) */
    '.thg-cihazlar{margin:-2px 0 2px 16px;padding-inline-start:12px;border-inline-start:2px solid #cfe9e2;display:flex;flex-direction:column;gap:6px}',
    '.thg-cihazlar.ekran{border-inline-start-color:#d5dde8}',
    '.thg-cihazlar[hidden]{display:none}',
    '.thg-cihazlar .thg-bas{font-size:.74rem;font-weight:800;color:#64748b;letter-spacing:.3px;text-transform:uppercase}',
    '.thg-cipler{display:flex;flex-wrap:wrap;gap:6px}',
    '.thg-cip{display:inline-flex;align-items:center;gap:9px;max-width:100%;box-sizing:border-box;border:1.5px solid #bfe3d8;background:#f2fbf8;color:#0f2a43;',
    ' border-radius:12px;padding:7px 12px 7px 9px;font:inherit;font-size:.88rem;font-weight:800;line-height:1.2;cursor:pointer;text-align:start;',
    ' transition:border-color .15s, box-shadow .15s, transform .15s, background .15s}',
    '.thg-cip:hover,.thg-cip:focus-visible{border-color:#16A085;background:#e6f6f1;box-shadow:0 6px 16px rgba(22,160,133,.2);transform:translateY(-1px);outline:none}',
    '.thg-cihazlar.ekran .thg-cip{border-color:#d5dde8;background:#f6f8fb}',
    '.thg-cihazlar.ekran .thg-cip:hover,.thg-cihazlar.ekran .thg-cip:focus-visible{border-color:#0f2a43;background:#eef2f7;box-shadow:0 6px 16px rgba(15,42,67,.16)}',
    '.thg-cip > svg{width:22px;height:22px;flex:none;fill:none;stroke:#0E7C66;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.thg-cihazlar.ekran .thg-cip > svg{stroke:#0f2a43}',
    '.thg-cip > span{min-width:0}',
    '.thg-cip b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.thg-cip small{display:flex;align-items:center;gap:5px;margin-top:2px;font-size:.72rem;font-weight:700;color:#5b6b7c}',
    '.thg-cip small .thg-nokta{width:7px;height:7px}',
    '.thg-cip:disabled{opacity:.75;cursor:progress;transform:none}',
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
    '#thgSoru .hayir{background:rgba(255,255,255,.14);color:#fff}',
    /* bağlantı onayı (10.11.2026): kumanda tarafında bekleme kutusu, hedef tarafında onay penceresi */
    '.thg-istek{margin:-2px 0 2px 16px;padding:10px 12px;border-radius:12px;background:#effaf6;border:1.5px solid #bfe3d8;color:#0f2a43;font-size:.86rem;line-height:1.4}',
    '.thg-istek[hidden]{display:none}',
    '.thg-ist-ust{display:flex;align-items:center;gap:10px}',
    '.thg-ist-ust > span:not(.thg-radar){flex:1;min-width:0;font-weight:800;overflow-wrap:anywhere}',
    '.thg-istek small{display:block;margin-top:6px;color:#5b6b7c;font-size:.78rem;font-weight:600;line-height:1.4}',
    '.thg-iptal{flex:none;border:1.5px solid #cbd5e1;border-radius:10px;background:#fff;color:#334155;padding:7px 14px;font:inherit;font-weight:800;font-size:.84rem;cursor:pointer}',
    '.thg-iptal:hover,.thg-iptal:focus-visible{background:#f1f5f9;outline:none}',
    '.thg-istek.red{background:#fff5f5;border-color:#fecaca}',
    '.thg-istek.onay{border-color:#16A085}',
    '.thg-istek .thg-tik{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}',
    '.thg-istek.red .thg-tik{color:#dc2626}',
    '.thg-istek.onay .thg-tik{color:#0E7C66}',
    '.thg-cip.bekle{border-color:#16A085;background:#e6f6f1}',
    '.thg-vurgula{animation:thgVurgula 1.1s ease 2;border-radius:10px}',
    '@keyframes thgVurgula{0%,100%{box-shadow:0 0 0 0 rgba(22,160,133,0)}50%{box-shadow:0 0 0 6px rgba(22,160,133,.3)}}',
    '#thgOnay{position:fixed;inset:0;z-index:2000000000;background:rgba(15,42,67,.62);display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(2px);animation:thgAc .18s ease}',
    '#thgOnay .thg-onay-kutu{width:min(440px,100%);box-sizing:border-box;background:#fff;color:#0f2a43;border-radius:22px;box-shadow:0 24px 70px rgba(15,42,67,.4);padding:24px 22px 18px;text-align:center;font-family:inherit}',
    '#thgOnay .thg-onay-sim{width:62px;height:62px;margin:0 auto 12px;border-radius:19px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#16A085,#0E7C66);box-shadow:0 6px 18px rgba(14,124,102,.3)}',
    '#thgOnay .thg-onay-sim svg{width:34px;height:34px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '#thgOnay h2{margin:0 0 6px;font-size:1.3rem;line-height:1.25;overflow-wrap:anywhere}',
    '#thgOnay p{margin:0 0 16px;color:#475569;font-size:.97rem;line-height:1.5}',
    '#thgOnay .thg-onay-dugmeler{display:flex;gap:10px}',
    '#thgOnay .thg-onay-dug{flex:1;border:0;border-radius:14px;padding:15px 12px;font:inherit;font-weight:800;font-size:1.05rem;line-height:1.1;cursor:pointer}',
    '#thgOnay .thg-onay-dug.evet{color:#fff;background:linear-gradient(135deg,#16A085,#0E7C66);box-shadow:0 6px 16px rgba(14,124,102,.3)}',
    '#thgOnay .thg-onay-dug.hayir{color:#334155;background:#f1f5f9}',
    '#thgOnay .thg-onay-dug:focus-visible{outline:3px solid rgba(22,160,133,.5);outline-offset:2px}',
    '#thgOnay .thg-onay-sure{margin-top:14px;height:4px;border-radius:2px;background:#e2e8f0;overflow:hidden}',
    '#thgOnay .thg-onay-sure i{display:block;height:100%;background:#16A085;animation:thgOnaySure linear forwards}',
    '@keyframes thgOnaySure{from{width:100%}to{width:0}}',
    '#thgOnay small{display:block;margin-top:8px;color:#64748b;font-size:.8rem;line-height:1.4}',
    '@media (prefers-reduced-motion:reduce){.thg-vurgula{animation:none}}'
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
  /* açık cihaz düğmelerinde cihaz türü (hesap/cihazlar.js'teki simgelerle aynı) — 01.11.2026 */
  var SIM_TUR = {
    bilgisayar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M8.5 20h7M12 16.5V20"/></svg>',
    telefon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="2.5" width="11" height="19" rx="2.6"/><path d="M10.6 18.4h2.8"/></svg>',
    tablet: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="2.8" width="16" height="18.4" rx="2.4"/><path d="M10.6 18.2h2.8"/></svg>',
    tahta: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="3.5" width="19" height="12.5" rx="1.8"/><path d="M7 7.8h7M7 11h4.6"/><path d="M12 16v3M8.4 21.2 12 18.8l3.6 2.4"/></svg>'
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
    panelKapat(true);                                 /* yeniden çizim: bekleyen bağlantı isteği korunur (10.11.2026) */
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
      '<div class="thg-cihazlar" id="thgKCihaz" hidden></div>' +          /* açık cihazdan seç: Sınıf Ekranı olacak */
      '<div class="thg-istek" id="thgIstek" role="status" aria-live="polite" hidden></div>' +      /* bağlantı isteği: onay bekleniyor (10.11.2026) */
      '<div class="thg-tahtalar" id="thgTahtalar" hidden></div>' +
      '<button type="button" class="thg-sec ikincil" data-thg="izle"><span class="thg-sim">' + SIM.tahta + '</span><span class="thg-yazi">' +
      '<b>' + kac(kd('th.p_ekran', 'Bu cihazı Sınıf Ekranı olarak kullan')) + '</b>' +
      '<small>' + kac(kd('th.p_ekran_alt', 'Kumandadan yaptıkların bu ekranda görünür. Cihaz bunu hatırlar: sonraki derslerde kumandadan başlatman yeter.')) + '</small></span>' + SIM.ok + '</button>' +
      '<div class="thg-cihazlar ekran" id="thgECihaz" hidden></div>' +    /* açık cihazdan seç: kumanda olacak */
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
      else if (is === 'yansit') listeVurgu();                         /* listeden seçmeden bağlanılmaz (10.11.2026) */
      else if (is === 'izle') { cihazYaz('tahta'); git('izle'); }
      else if (is === 'unut') { cihazYaz(null); hazirSil(); panelAc(); }
      else if (is === 'cagir') cagir(t.getAttribute('data-k'), t.getAttribute('data-rol'));
      else if (is === 'istek-iptal') istekBit('iptal');
    });
    document.body.appendChild(p);
    durumYaz();
    tahtaImza = '';                                   /* yeni pencere: liste yeniden çizilsin */
    cihazImza = '';
    tahtalarCiz();
    canliDinle();
    yoklaBaslat();                                    /* açık cihazdan seç: «kim açık?» (01.11.2026) */
    istekCiz();                                       /* bekleyen / son bağlantı isteği (10.11.2026) */
    document.addEventListener('keydown', escKapat);
  }
  function escKapat(e) { if (e.key === 'Escape') panelKapat(); }
  function panelKapat(koru) {
    var p = $('thgPerde');
    if (p) p.parentNode.removeChild(p);
    document.removeEventListener('keydown', escKapat);
    yoklaBitir();
    if (!koru) istekBit('iptal');                     /* pencere kapanınca bekleyen bağlantı isteğinden de vazgeçilir (10.11.2026) */
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
      kac(kd('th.p_bulundu2', 'Cihaz bulundu: {ad} — bağlanmak için aşağıdan seç', { ad: bul ? bul.ad : '' })) + '</span>';
    else if (dur === 'sec') a.innerHTML = '<svg class="thg-tik" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v13M6.5 12.5 12 18l5.5-5.5"/></svg><span>' +
      kac(kd('th.p_ara_sec', 'Açık cihazın var: Sınıf Ekranı olacak olanı aşağıdan seç')) + '</span>';
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
    cihazlarCiz();                                    /* açık cihazdan seç (01.11.2026) */
    var acik = acikCihazlar();
    /* CİHAZ ARANIYOR (24.10.2026): yeşil yalnız aynı hesabın başka bir cihazı Sınıf
       Ekranı olarak şu an hazırsa; kayıtlı ama kapalı tahta yeşil yapmaz */
    var bul = ekranBulundu(), tc = tahtaCihazi(), e = bul || ekranBilgi();
    var imza = JSON.stringify(e) + '|' + (bul ? 1 : 0) + '|' + (vt ? 1 : 0) + '|' + (tc ? 1 : 0) + '|' + (yayinVar() ? 1 : 0) + '|' + acik.length;
    if (imza === tahtaImza) return;
    tahtaImza = imza;
    var kb = document.querySelector('#thgPerde [data-thg="yansit"]');
    if (kb) kb.classList.toggle('vurgu', !!(bul && !tc));
    araYaz(tc ? '' : (bul ? 'bulundu' : (acik.length ? 'sec' : 'ara')), bul);
    if ((!e || e.ben) && !tc) {
      /* açık cihaz varsa ipucu yerine yukarıdaki düğmeler (01.11.2026) */
      el.hidden = !!acik.length;
      el.innerHTML = acik.length ? '' : '<div class="thg-ipucu">' + kac(kd('th.p_ara_ipucu3', 'Tahtada siteyi bu hesapla aç: burada görünür; dokununca tahtada onay istenir.')) + '</div>';
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

  /* ------------------------------------------ AÇIK CİHAZDAN SEÇ (01.11.2026)
     Açıklama dosyanın başında. Hesabın belgesi (kullanicilar/<uid>) kapı zili. */
  var FB = { uid: null, dinle: null, v: null, taban: false, yanitlanan: '', temiz: '' };
  var YK = { j: '', once: '', z: 0, say: 0, zaman: null };          /* yoklama: jeton, önceki jeton, zamanı */
  var cihazImza = '';
  function sahip(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function jetonUret() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function hesapBelge() {
    var u = kullanici();
    try { return u ? firebase.firestore().collection('kullanicilar').doc(u.uid) : null; } catch (e) { return null; }
  }
  function belgeYaz(o) {
    var b = hesapBelge();
    if (!b) return Promise.resolve(false);
    try { return b.update(o).then(function () { return true; }, function () { return false; }); } catch (e) { return Promise.resolve(false); }
  }
  function sureli(p, ms) {
    return new Promise(function (bit) {
      var z = setTimeout(function () { bit(false); }, ms);
      p.then(function (v) { clearTimeout(z); bit(v); }, function () { clearTimeout(z); bit(false); });
    });
  }
  function silme() { try { return firebase.firestore.FieldValue.delete(); } catch (e) { return null; } }
  function turBul() {                                 /* hesap/cihazlar.js cihazBilgi() ile aynı */
    var ua = navigator.userAgent || '', kisa = 9999;
    try { kisa = Math.min(screen.width, screen.height); } catch (e) { }
    var ipad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    if (tahtaCihazi()) return 'tahta';
    if (/iPhone|iPod|Windows Phone/.test(ua) || (/Android/.test(ua) && /Mobile/.test(ua) && kisa <= 600)) return 'telefon';
    if (ipad || (/Android/.test(ua) && kisa <= 820)) return 'tablet';
    if (/Android/.test(ua)) return 'tahta';
    return 'bilgisayar';
  }
  /* öğretmen girişliyken hesabın belgesi dinlenir (aynı belgeyi hesap/cihazlar.js de dinliyor) */
  function belgeDinleKur() {
    var u = kullanici(), uid = (u && ogretmenMi()) ? u.uid : null;
    if (uid === FB.uid && (FB.dinle || !uid)) return;
    if (FB.dinle) { try { FB.dinle(); } catch (e) { } FB.dinle = null; }
    FB.uid = uid; FB.v = null; FB.taban = false; FB.yanitlanan = ''; FB.temiz = '';
    if (!uid) return;
    var b = hesapBelge();
    if (!b) { FB.uid = null; return; }
    /* includeMetadataChanges: önbellekten gelen ilk görüntüden sonra sunucuyla eşitlenme de haber verilsin (TABAN için);
       aynı belge aynı dinlemede birleşir, ek okuma yok */
    try { FB.dinle = b.onSnapshot({ includeMetadataChanges: true }, belgeGeldi, function () { }); } catch (e) { FB.dinle = null; FB.uid = null; }
  }
  function belgeGeldi(doc) {
    if (!FB.uid) return;
    var v = (doc && doc.exists) ? (doc.data() || {}) : {};
    FB.v = v;
    if (!FB.taban) {
      if (doc && doc.metadata && doc.metadata.fromCache) { if ($('thgPerde')) tahtalarCiz(); return; }   /* önbellek taban değil */
      /* TABAN: sayfa açılırken belgede duran yoklama ve çağrı ESKİ sayılır — cevap verilmez,
         bu cihaza çağrı varsa işlenmeden silinir (cihazların saati karşılaştırılmaz) */
      FB.taban = true;
      FB.yanitlanan = (v.tahtaYokla && v.tahtaYokla.y) ? String(v.tahtaYokla.y) : '';
      cagriSil(v.tahtaCagri);
    } else {
      yoklaCevapla(v.tahtaYokla);
      cevapBak(v.tahtaCevap, v.tahtaCagri);                /* bağlantı isteğimin cevabı (10.11.2026) */
      cagriBak(v.tahtaCagri);
    }
    if ($('thgPerde')) tahtalarCiz();
  }
  function cagriSil(c) {
    var ben = kimlik();
    if (!ben || !c || typeof c !== 'object' || !c[ben]) return;
    var im = JSON.stringify(c[ben]);
    if (FB.temiz === im) return;
    FB.temiz = im;
    var o = {}; o['tahtaCagri.' + ben] = silme();
    belgeYaz(o);
  }
  /* «kim açık?» — bu cihaz ana sayfası açık bir öğretmen cihazı: cevap */
  function yoklaCevapla(y) {
    var ben = kimlik();
    if (!ben || !y || typeof y !== 'object' || !y.y || y.k === ben || FB.yanitlanan === String(y.y)) return;
    FB.yanitlanan = String(y.y);
    var o = {}; o['tahtaYanit.' + ben] = { y: String(y.y), ad: hazirAd(), tur: turBul(), t: Date.now() };
    belgeYaz(o);
  }
  /* çağrı: öbür cihaz bu cihazı Sınıf Ekranı (izle) ya da kumanda (yansit) yaptı */
  function cagriBak(c) {
    var ben = kimlik();
    onayKalktiMi(c);                                    /* gösterilen bağlantı isteği geri alındı mı (10.11.2026) */
    if (!ben || !c || typeof c !== 'object' || !c[ben]) return;
    var x = c[ben];
    if (!x || typeof x !== 'object' || !x.n || (x.rol !== 'izle' && x.rol !== 'yansit') || x.k === ben) { cagriSil(c); return; }
    if (x.onay && x.rol === 'izle') { onayCagri(x, c); return; }       /* onay istenen çağrı: pencere göster, cevaba göre geç (10.11.2026) */
    var son = '';
    try { son = localStorage.getItem('kidef_tahta_cagri') || ''; } catch (e) { }
    if (son === String(x.n)) { cagriSil(c); return; }                 /* başka sekme işledi */
    if (gidiyor) return;
    var calis = function () {
      var s2 = '';
      try { s2 = localStorage.getItem('kidef_tahta_cagri') || ''; } catch (e) { }
      if (s2 === String(x.n) || gidiyor) return false;
      try { localStorage.setItem('kidef_tahta_cagri', String(x.n)); } catch (e) { }
      gidiyor = true;
      gecisYaz();
      soruKapat(); panelKapat();
      var ad = String(x.ad || '').slice(0, 40) || kd('th.p_cagri_biri', 'Öbür cihazın');
      bildirGoster(x.rol === 'izle'
        ? kd('th.p_cagri_izle', '{ad} bu cihazı Sınıf Ekranı yaptı — açılıyor…', { ad: ad })
        : kd('th.p_cagri_yansit', '{ad} bu cihazı kumanda yaptı — açılıyor…', { ad: ad }));
      FB.temiz = JSON.stringify(x);
      var o = {}; o['tahtaCagri.' + ben] = silme();
      sureli(belgeYaz(o), 1500).then(function () {
        if (x.rol === 'izle') { cihazYaz('tahta'); git('izle'); }
        else { cihazYaz(null); hedefYaz(null); git('yansit'); }
      });
      return true;
    };
    /* aynı cihazda birden çok sekme: çağrıyı yalnız biri işler, önce görünen sekme alır */
    var kilitle = function () { tekSekme(calis); };
    if (document.visibilityState === 'hidden') setTimeout(kilitle, 700); else kilitle();
  }
  /* AYNI CİHAZIN SEKMELERİ (01.11.2026): kumandaya / Sınıf Ekranı'na geçişi yalnız bir sekme yapar —
     Web Locks (sayfa değişene dek tutulur; yoksa doğrudan); geçen sekme zamanı yazar (kidef_tahta_gecis) */
  function tekSekme(f) {
    try {
      if (navigator.locks && navigator.locks.request) {
        navigator.locks.request('kidef_tahta_gecis', { ifAvailable: true }, function (k) {
          if (!k || !f()) return;
          return new Promise(function (r) { setTimeout(r, 4000); });
        }).catch(function () { f(); });
        return;
      }
    } catch (e) { }
    f();
  }
  function gecisYaz() { try { localStorage.setItem('kidef_tahta_gecis', String(Date.now())); } catch (e) { } }
  function gecisVar() { var g = 0; try { g = +localStorage.getItem('kidef_tahta_gecis') || 0; } catch (e) { } return Date.now() - g < 20000; }
  function yokla() {
    var ben = kimlik();
    if (!kullanici() || !ogretmenMi() || !ben) return;
    belgeDinleKur();
    YK.once = YK.j; YK.j = jetonUret(); YK.z = Date.now();
    var o = { tahtaYokla: { y: YK.j, k: ben, t: Date.now() } };
    var Y = (FB.v && FB.v.tahtaYanit) || {};               /* bir günden eski cevaplar silinir */
    for (var k in Y) if (sahip(Y, k) && (!Y[k] || !(+Y[k].t > 0) || Date.now() - (+Y[k].t) > 864e5)) o['tahtaYanit.' + k] = silme();
    var CV = (FB.v && FB.v.tahtaCevap) || {};              /* bağlantı isteği cevapları: bir günden eskisi silinir (10.11.2026) */
    for (var c in CV) if (sahip(CV, c) && (!CV[c] || !(+CV[c].t > 0) || Date.now() - (+CV[c].t) > 864e5)) o['tahtaCevap.' + c] = silme();
    belgeYaz(o);
    if ($('thgPerde')) tahtalarCiz();
  }
  function yoklaBaslat() {
    yoklaBitir();
    YK.say = 0;
    yokla();
    YK.zaman = setInterval(function () {
      if (!$('thgPerde') || ++YK.say > 8) { yoklaBitir(); return; }
      if (document.visibilityState !== 'hidden') yokla();
    }, 12000);
  }
  function yoklaBitir() { clearInterval(YK.zaman); YK.zaman = null; }
  /* şu an açık öbür cihazlar: bu yoklamaya cevap verenler (yeni yoklamanın ilk 5 sn'sinde öncekine
     cevap verenler de) + Sınıf Ekranı sayfası açık ya da işaretli, sitesi açık cihazlar (hazirlar) */
  function acikCihazlar() {
    var ben = kimlik(), l = [], gor = {};
    var Y = (FB.v && FB.v.tahtaYanit) || {}, oncesi = YK.once && Date.now() - YK.z < 5000;
    if (YK.j) for (var k in Y) {
      if (!sahip(Y, k) || k === ben) continue;
      var r = Y[k];
      if (!r || typeof r !== 'object') continue;
      var y = String(r.y || '');
      if (y !== YK.j && !(oncesi && y === YK.once)) continue;
      gor[k] = 1;
      l.push({ kimlik: k, ad: String(r.ad || '').slice(0, 40) || tahtaAdi({ kimlik: k }), tur: SIM_TUR[r.tur] ? String(r.tur) : 'bilgisayar', izle: false });
    }
    hazirlar().forEach(function (t) {
      if (gor[t.kimlik]) { l.forEach(function (x) { if (x.kimlik === t.kimlik && t.izle) x.izle = true; }); return; }
      gor[t.kimlik] = 1;
      l.push({ kimlik: t.kimlik, ad: t.ad, tur: 'tahta', izle: !!t.izle });
    });
    var ek = (ekran && ekran.kimlik) || '';
    l.sort(function (a, b) { return ((b.kimlik === ek) - (a.kimlik === ek)) || (a.ad < b.ad ? -1 : (a.ad > b.ad ? 1 : 0)); });
    return l;
  }
  function cipHtml(x, rol) {
    var alt = x.izle ? kd('th.p_cip_ekran_acik', 'Sınıf Ekranı açık') : kd('th.p_cip_acik', 'şimdi açık');
    var et = rol === 'izle' ? kd('th.p_cip_ekran_et', '{ad} Sınıf Ekranı olsun, bu cihaz kumanda', { ad: x.ad })
                            : kd('th.p_cip_kumanda_et', '{ad} kumanda olsun, bu cihaz Sınıf Ekranı', { ad: x.ad });
    return '<button type="button" class="thg-cip" data-thg="cagir" data-rol="' + rol + '" data-k="' + kac(x.kimlik) + '" title="' + kac(et) + '" aria-label="' + kac(et) + '">' +
      (SIM_TUR[x.tur] || SIM_TUR.bilgisayar) + '<span><b>' + kac(x.ad) + '</b><small><span class="thg-nokta canli"></span>' + kac(alt) + '</small></span></button>';
  }
  function cihazlarCiz() {
    var kc = $('thgKCihaz'), ec = $('thgECihaz');
    if (!kc || !ec || gidiyor) return;
    var l = acikCihazlar(), e = l.filter(function (x) { return !x.izle; });        /* Sınıf Ekranı sayfasındaki cihaz kumanda yapılamaz */
    var im = JSON.stringify(l);
    if (im === cihazImza) return;
    cihazImza = im;
    kc.hidden = !l.length; ec.hidden = !e.length;
    kc.innerHTML = l.length ? '<div class="thg-bas">' + kac(kd('th.p_sec_ekran', 'Sınıf Ekranı olacak cihaz')) + '</div><div class="thg-cipler">' +
      l.map(function (x) { return cipHtml(x, 'izle'); }).join('') + '</div>' : '';
    ec.innerHTML = e.length ? '<div class="thg-bas">' + kac(kd('th.p_sec_kumanda', 'Kumanda olacak cihaz')) + '</div><div class="thg-cipler">' +
      e.map(function (x) { return cipHtml(x, 'yansit'); }).join('') + '</div>' : '';
    chipKilit();                                      /* bekleyen istek varken düğmeler kilitli (10.11.2026) */
  }
  /* dokunulan cihaz: rol 'izle' → o cihaz Sınıf Ekranı, bu cihaz kumanda (artık o cihazın ONAYI gerekir — 10.11.2026);
     'yansit' → tersi: o cihaz kumanda, bu cihaz Sınıf Ekranı (değişmedi) */
  function cagir(k, rol) {
    if (!k || (rol !== 'izle' && rol !== 'yansit') || gidiyor || ISTEK) return;
    var x = null;
    acikCihazlar().forEach(function (c) { if (c.kimlik === k) x = c; });
    if (!x || (rol === 'yansit' && x.izle)) return;
    if (rol === 'izle') { istekBaslat(x); return; }       /* o cihaz «Onayla» deyince bağlanılır */
    gidiyor = true;
    [].forEach.call(document.querySelectorAll('#thgPerde .thg-cip'), function (b) {
      b.disabled = true;
      if (b.getAttribute('data-k') === k && b.getAttribute('data-rol') === rol) {
        var sm = b.querySelector('small');
        if (sm) sm.innerHTML = '<span class="thg-radar" aria-hidden="true"></span>' + kac(kd('th.p_cip_baglaniyor', 'bağlanıyor…'));
      }
    });
    var basla = function () {
      gecisYaz();
      if (rol === 'izle') { cihazYaz(null); hedefYaz(null); git('yansit'); }
      else { cihazYaz('tahta'); git('izle'); }
    };
    if (rol === 'izle' && x.izle) { basla(); return; }             /* Sınıf Ekranı sayfası zaten açık: çağrı gerekmez */
    var o = {}; o['tahtaCagri.' + k] = { n: jetonUret(), rol: rol, k: kimlik(), ad: hazirAd(), t: Date.now() };
    sureli(belgeYaz(o), 2500).then(basla);
  }

  /* ------------------------------------------ BAĞLANTI ONAYI (10.11.2026)
     Açıklama dosyanın başında. KUMANDA tarafı: ISTEK (şimdiki istek), ISTEK_SON (son sonuç iletisi).
     HEDEF tarafı (ana sayfada): ONAY. Hedef Sınıf Ekranı sayfasındaysa sistem/tahta.js → istekKur karşılar. */
  var ISTEK = null, ISTEK_SON = null, ISTEK_SON_Z = null, ONAY = null;
  function istekSure() { var s = +window.__kidefOnaySure; return s > 0 ? s : 60000; }        /* deneme kancası */

  /* KUMANDA: listeden seçilen cihaza bağlantı isteği gönder, cevabı bekle */
  function istekBaslat(x) {
    var u = kullanici(), ben = kimlik();
    if (ISTEK || gidiyor || !u || !ben || !x) return;
    clearTimeout(ISTEK_SON_Z); ISTEK_SON = null;
    var n = jetonUret();
    var I = ISTEK = { k: x.kimlik, ad: x.ad || tahtaAdi({ kimlik: x.kimlik }), n: n, kanal: x.izle ? 'vt' : 'fs',
                      durum: 'gonder', belgede: false, bitti: false, z: null, gz: null, kok: null, cvRef: null, cvIs: null };
    istekCiz(); chipKilit();
    I.z = setTimeout(function () { istekBit('zaman'); }, istekSure());
    I.gz = setTimeout(function () { if (ISTEK === I && !I.bitti && I.durum === 'gonder') istekBit('hata'); }, 10000);
    if (I.kanal === 'fs') {                                   /* hedef ana sayfada: kapı zili belgesi */
      var o = {}; o['tahtaCagri.' + I.k] = { n: n, rol: 'izle', onay: 1, k: ben, ad: hazirAd(), t: Date.now() };
      if (FB.v && FB.v.tahtaCevap && FB.v.tahtaCevap[ben]) o['tahtaCevap.' + ben] = silme();      /* önceki cevabın kalıntısı */
      sureli(belgeYaz(o), 6000).then(function (ok) {
        if (ISTEK !== I || I.bitti) return;
        if (!ok) { istekBit('hata'); return; }
        if (I.durum === 'gonder') { I.durum = 'bekle'; istekCiz(); }
      });
    } else {                                                  /* hedef Sınıf Ekranı sayfasında: Realtime Database */
      vtHazir(function (db) {
        if (ISTEK !== I || I.bitti || !kullanici()) return;
        var kok = db.ref('tahta/' + kullanici().uid);
        I.kok = kok;
        I.cvRef = kok.child('istekCevap/' + ben);
        I.cvIs = function (s) { istekCevapGeldi(I, s.val()); };
        try { I.cvRef.on('value', I.cvIs, function () { }); } catch (e) { }
        var yaz = null, u = {};
        u['istek/' + I.k] = { n: n, k: ben, ad: hazirAd(), t: firebase.database.ServerValue.TIMESTAMP };
        u['istekCevap/' + ben] = null;                        /* önceki cevabın kalıntısı */
        try { yaz = kok.update(u); } catch (e) { }
        if (yaz && yaz.then) yaz.then(function () {
          if (ISTEK === I && !I.bitti && I.durum === 'gonder') { I.durum = 'bekle'; istekCiz(); }
        }, function () { if (ISTEK === I && !I.bitti) istekBit('hata'); });
      });
    }
  }
  function istekCevapGeldi(I, c) {
    if (!I || ISTEK !== I || I.bitti || !c || typeof c !== 'object' || String(c.n) !== I.n) return;
    if (c.d === 'onay') istekBit('onay');
    else if (c.d === 'red') istekBit('red');
    else if (c.d === 'goruldu' && I.durum !== 'goruldu') { I.durum = 'goruldu'; istekCiz(); }
  }
  /* Firestore kanalı: cevap belgede (tahtaCevap.<ben>). Gönderdiğim istek belgeden kalktıysa (hedef yeni bir sayfa açıp eskiyi
     sildi, başka bir kumanda üstüne yazdı) istek kapanmıştır. */
  function cevapBak(cv, cagri) {
    var I = ISTEK, ben = kimlik();
    if (!I || I.kanal !== 'fs' || I.bitti || !ben) return;
    if (cv && typeof cv === 'object' && cv[ben]) istekCevapGeldi(I, cv[ben]);
    if (ISTEK !== I || I.bitti) return;
    var s = (cagri && typeof cagri === 'object') ? cagri[I.k] : null;
    if (s && typeof s === 'object' && String(s.n) === I.n) I.belgede = true;
    else if (I.belgede) istekBit('kapandi');
  }
  /* sonuç: onay | red | zaman | hata | kapandi | iptal */
  function istekBit(durum) {
    var I = ISTEK;
    if (!I || I.bitti) return;
    I.bitti = true;
    clearTimeout(I.z); clearTimeout(I.gz);
    var ben = kimlik();
    if (I.cvRef) { try { I.cvRef.off('value', I.cvIs); } catch (e) { } }
    /* istek: onayda ve ret'te hedef zaten sildi; iptal / zaman aşımı / hatada geri alınır (hedefteki pencere kapanır) */
    var geriAl = durum === 'iptal' || durum === 'zaman' || durum === 'hata';
    if (I.kanal === 'fs') {
      var o = {}, F = (FB.v && FB.v.tahtaCagri && FB.v.tahtaCagri[I.k]) || null;
      if (geriAl && !(F && typeof F === 'object' && String(F.n) !== I.n)) o['tahtaCagri.' + I.k] = silme();   /* başkasının isteğine dokunma */
      if (FB.v && FB.v.tahtaCevap && FB.v.tahtaCevap[ben]) o['tahtaCevap.' + ben] = silme();
      if (Object.keys(o).length) belgeYaz(o);
    } else if (I.kok) {                                       /* Realtime Database: cevap (ve gerekirse istek) tek yazışta temizlenir */
      var u = {}; u['istekCevap/' + ben] = null; if (geriAl) u['istek/' + I.k] = null;
      try { I.kok.update(u); } catch (e) { }
    }
    if (durum === 'onay') {                                   /* hedef onayladı: şimdi bağlan */
      I.durum = 'onay';
      istekCiz();
      gidiyor = true;
      gecisYaz();
      soruKapat();
      cihazYaz(null); hedefYaz(null);
      git('yansit');
      return;
    }
    ISTEK = null;
    clearTimeout(ISTEK_SON_Z);
    ISTEK_SON = (durum === 'iptal') ? null : { durum: durum, ad: I.ad };
    if (ISTEK_SON) ISTEK_SON_Z = setTimeout(function () { ISTEK_SON = null; istekCiz(); }, 9000);
    cihazImza = '';                                           /* düğmeler yeniden çizilsin, kilit açılsın */
    cihazlarCiz();
    istekCiz();
  }
  /* pencerede bekleme / sonuç kutusu */
  function istekCiz() {
    var el = $('thgIstek');
    if (!el) return;
    var I = ISTEK, S = ISTEK_SON;
    if (!I && !S) { el.hidden = true; el.className = 'thg-istek'; el.innerHTML = ''; return; }
    var ad = I ? I.ad : S.ad, d = I ? I.durum : S.durum, sinif = '', ust = '', alt = '';
    var tik = function (yol) { return '<svg class="thg-tik" viewBox="0 0 24 24" aria-hidden="true"><path d="' + yol + '"/></svg>'; };
    var CARPI = 'M6 6l12 12M18 6L6 18';
    if (I && d !== 'onay') {
      ust = '<span class="thg-radar" aria-hidden="true"></span><span>' + kac(kd('th.p_istek_bekle', '{ad} cihazında onay bekleniyor…', { ad: ad })) + '</span>' +
            '<button type="button" class="thg-iptal" data-thg="istek-iptal">' + kac(kd('th.p_istek_iptal', 'İptal')) + '</button>';
      alt = d === 'gonder' ? kd('th.p_istek_gonder', 'İstek gönderiliyor…')
          : d === 'goruldu' ? kd('th.p_istek_goruldu', 'İstek o cihazda göründü. Orada «Onayla»ya basılınca bağlanılır.')
          : kd('th.p_istek_alt', 'O cihazda çıkan pencerede «Onayla»ya basılmalı. Cevap gelmezse istek bir dakika sonra kapanır.');
    } else if (d === 'onay') {
      sinif = ' onay'; ust = tik('M5 12.5l4.5 4.5L19 7.5') + '<span>' + kac(kd('th.p_istek_onay', 'Onaylandı — bağlanıyor…')) + '</span>';
    } else if (d === 'red') {
      sinif = ' red'; ust = tik(CARPI) + '<span>' + kac(kd('th.p_istek_red', '{ad} isteği reddetti.', { ad: ad })) + '</span>';
    } else if (d === 'zaman') {
      sinif = ' red'; ust = tik(CARPI) + '<span>' + kac(kd('th.p_istek_zaman', '{ad} cevap vermedi; istek kapandı.', { ad: ad })) + '</span>';
      alt = kd('th.p_istek_zaman_alt', 'O cihazda siteyi açık tut, sonra yeniden seç. Tahtadaki sayfa eski sürümdeyse bir kez yenile.');
    } else if (d === 'hata') {
      sinif = ' red'; ust = tik(CARPI) + '<span>' + kac(kd('th.p_istek_hata', 'İstek gönderilemedi.')) + '</span>';
      alt = kd('th.p_istek_hata_alt', 'İnternet bağlantını kontrol edip yeniden dene.');
    } else {
      sinif = ' red'; ust = tik(CARPI) + '<span>' + kac(kd('th.p_istek_kapandi', 'İstek kapandı.')) + '</span>';
      alt = kd('th.p_istek_kapandi_alt', 'İstersen cihazı yeniden seçebilirsin.');
    }
    el.className = 'thg-istek' + sinif;
    el.hidden = false;
    el.innerHTML = '<div class="thg-ist-ust">' + ust + '</div>' + (alt ? '<small>' + kac(alt) + '</small>' : '');
  }
  /* istek sürerken çipler kilitli; istek yapılan cihazın çipinde «onay bekleniyor» */
  function chipKilit() {
    var I = ISTEK;
    [].forEach.call(document.querySelectorAll('#thgPerde .thg-cip'), function (b) {
      b.disabled = !!I;
      var hedef = !!(I && b.getAttribute('data-rol') === 'izle' && b.getAttribute('data-k') === I.k);
      b.classList.toggle('bekle', hedef);
      var sm = b.querySelector('small');
      if (hedef && sm && !sm.querySelector('.thg-radar')) sm.innerHTML = '<span class="thg-radar" aria-hidden="true"></span>' + kac(kd('th.p_cip_onay_bekle', 'onay bekleniyor…'));
    });
  }
  /* «Bu cihazı kumanda olarak kullan»: artık bağlamaz — listeden seçilmeden bağlantı yok */
  function listeVurgu() {
    var l = acikCihazlar(), kc = $('thgKCihaz');
    var el = ISTEK ? $('thgIstek') : ((l.length && kc && !kc.hidden) ? kc : $('thgTahtalar'));
    if (!ISTEK) {
      bildirGoster(l.length ? kd('th.p_liste_sec', 'Sınıf Ekranı olacak cihazı aşağıdaki listeden seç; o cihazda onay istenecek.')
                            : kd('th.p_liste_yok', 'Açık cihaz yok. Tahtada siteyi bu hesapla aç, burada görünsün; sonra listeden seç.'));
      if (!l.length) yoklaBaslat();                           /* yeniden ara */
    }
    if (el && !el.hidden) {
      el.classList.remove('thg-vurgula'); void el.offsetWidth; el.classList.add('thg-vurgula');
      try { el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { }
    }
  }
  /* sayfa kapanırken (en azından deneyerek) bekleyen istek geri alınır; hedefteki pencere de süre bitince kapanır */
  window.addEventListener('pagehide', function () { var I = ISTEK; if (I && !I.bitti) { try { istekBit('iptal'); } catch (e) { } } });

  /* HEDEF (ana sayfada): bu cihaza gelen bağlantı isteği — pencere göster, cevabı yaz */
  function onayCagri(x, c) {
    var n = String(x.n);
    if (!/^[a-z0-9]{8,24}$/.test(String(x.k || ''))) { cagriSil(c); return; }   /* cihaz kimliği biçimi (tahta.js KIMLIK) tutmuyorsa sorulmaz, silinir */
    if (ONAY && ONAY.n === n) return;                         /* zaten gösteriliyor ya da cevaplandı */
    var son = '';
    try { son = localStorage.getItem('kidef_tahta_cagri') || ''; } catch (e) { }
    if (son === n) { cagriSil(c); return; }                   /* aynı cihazın başka sekmesi cevapladı */
    if (gidiyor) return;
    if (ONAY && !ONAY.bitti) { ONAY.bitti = true; onayKaldir(); }      /* yeni istek eskisinin yerini alır */
    var O = ONAY = { n: n, k: String(x.k || ''), ad: String(x.ad || '').slice(0, 40), z: null, bitti: false };
    onayGoster();
    O.z = setTimeout(function () { onayBitir('zaman'); }, istekSure());
    if (O.k) { var o = {}; o['tahtaCevap.' + O.k] = { n: n, d: 'goruldu', t: Date.now() }; belgeYaz(o); }
  }
  /* gösterilen istek belgeden kalktı: kumanda iptal etti ya da başka bir sekme cevapladı */
  function onayKalktiMi(c) {
    var O = ONAY, ben = kimlik();
    if (!O || O.bitti) return;
    var x = (c && typeof c === 'object' && ben) ? c[ben] : null;
    if (x && typeof x === 'object' && String(x.n) === O.n) return;
    O.bitti = true;
    onayKaldir();
    var baska = ''; try { baska = localStorage.getItem('kidef_tahta_cagri') || ''; } catch (e) { }
    if (baska !== O.n) bildirGoster(kd('th.p_onay_geri', 'Bağlantı isteği geri alındı.'));
  }
  function onayGoster() {
    stilKur();
    var O = ONAY;
    if (!O) return;
    onayKaldir();
    var ad = O.ad || kd('th.p_onay_biri', 'Bir cihaz');
    var p = document.createElement('div');
    p.id = 'thgOnay';
    p.setAttribute('role', 'alertdialog'); p.setAttribute('aria-modal', 'true');
    p.setAttribute('aria-labelledby', 'thgOnayBaslik'); p.setAttribute('aria-describedby', 'thgOnayYazi');
    p.innerHTML = '<div class="thg-onay-kutu"><span class="thg-onay-sim">' + SIM.kumanda + '</span>' +
      '<h2 id="thgOnayBaslik">' + kac(kd('th.p_onay_baslik', '{ad} bağlanmak istiyor', { ad: ad })) + '</h2>' +
      '<p id="thgOnayYazi">' + kac(kd('th.p_onay_yazi', 'Onaylarsan bu cihaz Sınıf Ekranı olur, kumanda olarak {ad} bağlanır.', { ad: ad })) + '</p>' +
      '<div class="thg-onay-dugmeler">' +
      '<button type="button" class="thg-onay-dug hayir" data-onay="red">' + kac(kd('th.p_onay_btn_red', 'Reddet')) + '</button>' +
      '<button type="button" class="thg-onay-dug evet" data-onay="onay">' + kac(kd('th.p_onay_btn_evet', 'Onayla')) + '</button></div>' +
      '<div class="thg-onay-sure"><i style="animation-duration:' + istekSure() + 'ms"></i></div>' +
      '<small>' + kac(kd('th.p_onay_not', 'Cevap vermezsen istek kendiliğinden kapanır.')) + '</small></div>';
    p.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-onay]') : null;
      if (b) onayBitir(b.getAttribute('data-onay'));
    });
    document.body.appendChild(p);
    document.addEventListener('keydown', onayEsc);
  }
  function onayEsc(e) { if (e.key === 'Escape') onayBitir('red'); }
  function onayKaldir() {                                     /* pencereyi kaldırır (ONAY kaydı kalır: aynı istek yeniden sorulmaz) */
    var p = $('thgOnay');
    if (p && p.parentNode) p.parentNode.removeChild(p);
    document.removeEventListener('keydown', onayEsc);
    if (ONAY) clearTimeout(ONAY.z);
  }
  /* d: onay | red | zaman */
  function onayBitir(d) {
    var O = ONAY;
    if (!O || O.bitti) return;
    O.bitti = true;
    clearTimeout(O.z);
    var ben = kimlik();
    try { localStorage.setItem('kidef_tahta_cagri', O.n); } catch (e) { }       /* aynı cihazın öbür sekmeleri bu isteği yeniden sormasın */
    var o = {}; o['tahtaCagri.' + ben] = silme();
    if (d !== 'zaman' && O.k) o['tahtaCevap.' + O.k] = { n: O.n, d: d, t: Date.now() };
    onayKaldir();
    if (d === 'onay') {
      gidiyor = true;
      gecisYaz();
      soruKapat(); panelKapat();
      bildirGoster(kd('th.p_onay_aciliyor', 'Onaylandı — Sınıf Ekranı açılıyor…'));
      sureli(belgeYaz(o), 1500).then(function () { cihazYaz('tahta'); git('izle'); });
      return;
    }
    belgeYaz(o);
    bildirGoster(d === 'red' ? kd('th.p_onay_reddedildi', 'Bağlantı isteği reddedildi.') : kd('th.p_onay_sure', 'Bağlantı isteğinin süresi doldu.'));
  }
  document.addEventListener('kidef:dil', function () { if ($('thgOnay') && ONAY && !ONAY.bitti) onayGoster(); });

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
  var soruIlk = 0, soruBekleZ = null, soruIstek = false;
  /* LİSTEDEN SEÇMEDEN BAĞLANMA YOK (10.11.2026): işaretli Sınıf Ekranı, kumandadan yansıtma başlayınca eskiden kendiliğinden
     tahta görünümüne geçerdi; artık geçmez — bağlantı yalnız kumandada listeden seçilip bu cihazda «Onayla»ya basılınca
     kurulur (istekBaslat / onayCagri). Eski davranış için true yap. */
  var OTO_GECIS = false;
  function soruKontrol() {
    if (!OTO_GECIS || !tahtaCihazi() || gidiyor) return;
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
    /* aynı cihazın başka sekmesi az önce geçtiyse bu sekme geçmez; aynı anda yalnız biri (01.11.2026) */
    if (gecisVar() || soruIstek) return;
    soruIstek = true;
    tekSekme(function () {
      soruIstek = false;
      if (gidiyor || gecisVar()) return false;
      gidiyor = true;
      gecisYaz();
      soruKapat();
      git('izle');
      return true;
    });
    setTimeout(function () { soruIstek = false; }, 3000);
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
    belgeDinleKur();                                   /* açık cihazdan seç: yoklama / çağrı (01.11.2026) */
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
  window.KidefTahtaGir = { ac: panelAc, kapat: function () { panelKapat(); }, yokla: yokla, acikCihazlar: acikCihazlar, _fb: FB, _yk: YK,
                           _istek: function () { return ISTEK; }, _onay: function () { return ONAY; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
