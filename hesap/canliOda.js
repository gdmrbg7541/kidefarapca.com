/* ======================================================================
   KIDEF · CANLI DERS ODASI — hesap/canliOda.js (tahta.html kabuğunda)
   ----------------------------------------------------------------------
                                                            05.11.2026
   Yönetici: "amacım arapça dersleri için tasarlanmış bi canlı ders odası kurmak,
   hatta amacımız kameradan çok sitedeki dosyaları kolaylıkla yansıtmak … öğrencinin
   cihazına öğretmenin kullandığı şekilde yansıtmak … kusursuz olmalı … sitede zaten
   kumanda özelliği var, zaten öğretmen de öğrenci de giriş yapmak zorunda".

   ODA = TAHTA KABUĞU. Sayfa yansıtmayı sistem/tahta.js yapar (canlı kipi: kök
   canli/<oda>/oda; öğretmen kumanda, öğrenci yalnız izler — Sınıf Ekranı gibi).
   Bu dosya kabuğun üstüne küçük bir pencere koyar (sol alt):
   · SES (ve istenirse kamera): WebRTC, 1'e 1. İşaretleşme aynı odada:
       canli/<oda>/ses/ogt = { kimlik, t, cevap:{type,sdp,n}, aday/*, kamera, mik, yenile }   (öğretmen yazar)
       canli/<oda>/ses/ogr = { n, icin, teklif:{type,sdp}, aday/*, kamera, mik, t }           (öğrenci yazar)
     Öğrenci TEKLİF eder: öğretmenin kimliğini görünce (ya da kimlik değişince: öğretmen
     sayfayı yeniledi) yeni n ile teklif yazar; öğretmen cevaplar. Bağlantı koparsa öğrenci
     yeniden teklif eder; öğretmen koptuğunu görürse "yenile" yazar, öğrenci yeniden teklif
     eder. Kamera açılıp kapanınca yeniden anlaşma yok: görüntü yolu baştan ayrılır
     (addTransceiver), açılınca iz değiştirilir (replaceTrack). Mikrofon izni yoksa yalnız dinler.
     Bağlantı sunucusu: Cloudflare TURN (turnKimlik fonksiyonu, REST; 4 saat önbellek
     kidef_turn), olmazsa Google STUN + açık aktarıcı.
   · ÇAĞRI (öğretmen): sınıf listesindeki hesaplı öğrenciler (ana sayfa oturum deposuna
     yazar: kidef_canli_liste). «Çağır» → canli/<oda>/davetli = uid (okuma izni bu alana
     bağlı), canliCagri/<uid> = { oda, ad, t } → öğrencinin ana sayfasında kart
     (hesap/canliders.js). Tek öğrenci: başkası çağrılınca öncekinin çağrısı silinir, okuma
     izni düşer, cihazı dersten çıkar.
   · «Dersi bitir» (öğretmen): çağrı ve ses kayıtları silinir, kumandanın Bitir'i basılır
     (tahta.js: yayin/bitir → öğrenci ana sayfaya döner). «Dersten ayrıl» (öğrenci): kendi
     çağrısını ve teklifini siler, kabuktan çıkar; öğretmen odada kalır, yeniden çağırabilir.
   · KULLANIM ÖLÇÜMÜ (06.11.2026) — yönetici: "öğretmenler de bu sistemi kullanmak isterse ona göre
     ücret öderler ama video açarlarsa ve para harcanırsa". Cloudflare yalnız aktarıcıdan (TURN) geçen
     trafiği sayar (ayda 1.000 GB ortak ücretsiz pay, üstü 0,05 $/GB); doğrudan bağlantı bedava. Her
     10 sn'de pc.getStats(): seçili aday çiftinden alınan/verilen bayt ve aktarıcı mı, ses ve görüntü
     akışlarından ayrı ayrı. Öğrenci kendi sayaçlarını ses/ogr/istat'a yazar; öğretmen ikisini toplar,
     ders bitince (öğrenci 60 sn yok · Bitir · başka öğrenci · sekme kapanır) öğretmenin kullanicilar
     belgesine yazar — Firestore REST: canliKullanim.<YYYY-MM>.{ders,sn,kameraSn,sesMB,goruntuMB,aktarMB,son}
     artışları + canliDersler dizisine kayıt. Yazılamazsa localStorage kuyruğu (kidef_canli_bekleyen),
     oda yeniden açılınca denenir. Kamera: öğretmende ilk açışta uyarı (veri tüketir, aşım öğretmene ait).
     Yönetici panelinde gösterim: hesap/canlikullanim.js.
   · SFU (06.11.2026) — yönetici: "sfu kuruyorum". Cloudflare Realtime SFU varsa (Cloud Function «sfu»:
     uygulama gizi sunucuda) ses/görüntü eşten eşe değil Cloudflare üzerinden akar: her taraf kendi SFU
     oturumunu açar (sessions/new), mikrofonunu yayınlar (tracks/new, local), karşı tarafın yayınına abone
     olur (tracks/new, remote → SFU teklifi → renegotiate). Oturum kimliği odaya yazılır
     (ses/<rol>/sfu = { sid, ses, kamera }); karşı taraf onu görünce abone olur, sid değişince (sayfa
     yenilendi) yeniden. TURN gerekmez (SFU'nun açık adresi var; STUN stun.cloudflare.com). Çok öğrenci
     bu yolla açılabilir. Öğretmen kipi seçer (ses/ogt/kip: 'sfu' | 'p2p'); SFU işlevi yüklü değilse ya
     da hata verirse eşten eşe (P2P + TURN) yol. Ölçümde SFU'dan geçen her bayt «aktarıcı» sayılır.
   Veritabanı kuralı: sistem/tahta.js başlığında.
   ====================================================================== */
(function () {
  'use strict';
  if (window.KidefCanliOda) return;
  var T = window.KidefTahta, ODA = T && T.canli;
  if (!ODA) { window.KidefCanliOda = { acik: false }; return; }
  var OGR = !!T.canliOgr, BEN = T.id;
  var ROLUM = OGR ? 'ogr' : 'ogt';
  var FN_ADRES = 'https://europe-west1-kidefarapca-98f9c.cloudfunctions.net/turnKimlik';
  var PROJE = 'kidefarapca-98f9c';
  var FS_KOK = 'projects/' + PROJE + '/databases/(default)/documents';
  var FS_ADRES = 'https://firestore.googleapis.com/v1/' + FS_KOK;
  var KUYRUK = 'kidef_canli_bekleyen';
  var SFU_ADRES = 'https://europe-west1-kidefarapca-98f9c.cloudfunctions.net/sfu';
  var SFU_PC = { iceServers: [{ urls: 'stun:stun.cloudflare.com:3478' }], bundlePolicy: 'max-bundle' };
  var ISTAT_ARALIK = 10000, DERS_KAPANMA = 60000;
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
    yenile: '<svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 21v-5h-5"/></svg>'
  };

  /* ------------------------------------------------------------ biçim */
  function stilKur() {
    if ($('cdStil')) return;
    var s = document.createElement('style'); s.id = 'cdStil';
    s.textContent = [
      '.cd-kutu{position:fixed;left:12px;bottom:12px;z-index:43;width:min(272px,calc(100vw - 24px));box-sizing:border-box;background:#0f2a43;color:#fff;',
      ' border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.32);font:600 13px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;overflow:hidden}',
      '.cd-bas{display:flex;align-items:center;gap:8px;padding:9px 10px 9px 12px;cursor:pointer;user-select:none;-webkit-user-select:none}',
      '.cd-bas b{flex:1;min-width:0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.cd-bas .cd-sure{font-weight:500;opacity:.75;font-variant-numeric:tabular-nums}',
      '.cd-nokta{width:10px;height:10px;border-radius:50%;background:#F4D03F;box-shadow:0 0 0 2px rgba(255,255,255,.18);flex:none}',
      '.cd-nokta.canli{background:#2ECC71}.cd-nokta.hata{background:#E74C3C}',
      '.cd-kucult{border:0;background:transparent;color:#fff;padding:2px;cursor:pointer;display:flex;flex:none}',
      '.cd-kutu svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
      '.cd-govde{padding:0 12px 12px}',
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
      '.cd-tuslar{display:flex;gap:6px;flex-wrap:wrap}',
      '.cd-dug{display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:#fff;border-radius:10px;',
      ' padding:7px 10px;font:inherit;font-weight:700;font-size:12px;cursor:pointer;-webkit-tap-highlight-color:transparent}',
      '.cd-dug:hover{background:rgba(255,255,255,.16)}',
      '.cd-dug[aria-pressed="false"]{background:rgba(231,76,60,.28);border-color:rgba(231,76,60,.6)}',
      '.cd-dug.kirmizi{background:#B03A2E;border-color:#B03A2E}.cd-dug.kirmizi:hover{background:#962d23}',
      '.cd-dug.yesil{background:#16A085;border-color:#16A085}.cd-dug.yesil:hover{background:#128f76}',
      '.cd-dug.sari{background:#F4D03F;color:#0f2a43;border-color:#F4D03F}',
      '.cd-dug[hidden]{display:none}',
      '.cd-liste{margin:8px 0 0;border-top:1px solid rgba(255,255,255,.14);padding-top:8px;max-height:200px;overflow:auto}',
      '.cd-liste[hidden]{display:none}',
      '.cd-liste .cd-sat{display:flex;align-items:center;gap:8px;padding:5px 0}',
      '.cd-liste .cd-sat span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}',
      '.cd-liste .cd-sat small{display:block;font-weight:500;opacity:.7;font-size:11px}',
      '.cd-liste .cd-dug{padding:5px 9px}',
      '.cd-ipucu{margin:8px 0 0;font-size:11px;font-weight:500;opacity:.7;line-height:1.35}',
      '.cd-bos{font-size:12px;font-weight:500;opacity:.8;margin:0}',
      '.cd-veri{margin:6px 0 0;font-size:11px;font-weight:500;opacity:.75;font-variant-numeric:tabular-nums}',
      '.cd-uyari{margin:8px 0 0;padding:8px 10px;border-radius:10px;background:rgba(244,208,63,.16);border:1px solid rgba(244,208,63,.55);font-size:12px;font-weight:500;line-height:1.4}',
      '.cd-uyari .cd-tuslar{margin-top:8px}',
      /* canlı derste kalkan kumanda tuşları: öğrenci lider olamaz, cihaz ad/işaret yok */
      'body.th-canli #thKipDug,body.th-canli [data-th="zkip"],body.th-canli [data-th="unut"],body.th-canli [data-th="ad"],',
      'body.th-canli .th-zadver,body.th-canli .th-zunut,body.th-canli .th-unut,body.th-canli [data-th="zperde"],body.th-canli #thHedef{display:none !important}',
      '@media (max-width:600px){.cd-kutu{width:min(236px,calc(100vw - 24px))}.cd-ipucu{display:none}}'
    ].join('\n');
    document.head.appendChild(s);
    document.body.classList.add('th-canli');
  }

  /* ------------------------------------------------------------ durum */
  var vt = null, auth = null, kok = null, UID = null, ADIM = '';
  var D = {
    davetli: null, davetliAd: '', izle: {}, yayin: null, karsi: null,        /* karsi: öbür tarafın ses kaydı (ses/ogt ya da ses/ogr) */
    katildiT: 0, mik: true, kucuk: false, sesKilit: false, mikHata: '', liste: [], listeAcik: false, cikiyor: false, hazir: false, baglanti: true,
    kameraSor: false, kameraOnay: false                                    /* kamera uyarısı (06.11.2026) */
  };
  var V = { pc: null, n: null, icin: null, yerel: null, kam: null, vSender: null, uzak: null, bagli: false, ice: null, bekleyen: [], kopZ: null, sonYenile: null, baglandiT: 0, deneme: 0, denemeZ: null, cevaplananN: null, adayKuyruk: null, bekciZ: null };
  /* SFU durumu: kip (öğretmen seçer; öğrenci öğretmeninkine uyar), kendi oturumu, yayınlanan izler, karşı oturum ve abonelikler */
  var SFU = { kip: null, sid: null, izler: {}, karsiSid: null, abone: {}, kuyruk: Promise.resolve(), baslatiliyor: null, hata: '' };

  function liste() {
    try { var L = JSON.parse(sessionStorage.getItem('kidef_canli_liste') || '[]'); return Array.isArray(L) ? L.filter(function (s) { return s && s.uid; }) : []; } catch (e) { return []; }
  }
  function adim() {
    var a = '';
    try { a = sessionStorage.getItem('kidef_canli_ad') || ''; } catch (e) { }
    if (!a) { try { a = (auth.currentUser && auth.currentUser.displayName) || ''; } catch (e) { } }
    return (a || 'Öğretmen').slice(0, 40);
  }
  function ogrenciVar() {                     /* öğrencinin cihazı odada (motorun varlık kaydı) */
    for (var k in D.izle) if (has(D.izle, k) && D.izle[k] && D.izle[k].cevrimici && D.izle[k].cihaz === 'tahta') return D.izle[k];
    return null;
  }
  function ogretmenVar() { return !!(D.yayin && D.yayin.cevrimici) || !!(D.karsi && D.karsi.kimlik); }
  function karsiSes() { return !!(D.karsi && (D.karsi.teklif || (D.karsi.sfu && D.karsi.sfu.sid))); }   /* karşı tarafın ses kaydı (P2P teklif ya da SFU oturumu) */

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
      '<div class="cd-video" id="cdVideo"><video id="cdGoruntu" class="cd-uzak" autoplay playsinline muted></video><video id="cdBen" class="cd-ben" autoplay playsinline muted></video></div>' +
      '<div class="cd-tuslar" id="cdTuslar"></div>' +
      '<div id="cdUyari"></div>' +
      (OGR ? '' : '<p class="cd-veri" id="cdVeri"></p>') +
      (OGR ? '' : '<div class="cd-liste" id="cdListe" hidden></div>') +
      (OGR ? '' : '<p class="cd-ipucu">Kitaplar, etkinlikler ve oyunlar öğrencide aynen görünür; Sınıflarım, Listelerim ve ders modu gibi öğretmen araçları yansımaz.</p>') +
      '</div><audio id="cdSes" autoplay></audio>';
    document.body.appendChild(k);
    $('cdBas').addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('#cdKucult') === null && !D.kucuk) return;   /* başlık: yalnız küçükken açar */
      D.kucuk = !D.kucuk; ciz();
    });
    $('cdTuslar').addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-cd]') : null;
      if (!b) return;
      var is = b.getAttribute('data-cd');
      if (is === 'mik') mikDegistir();
      else if (is === 'kamera') kameraIste();
      else if (is === 'kameraEvet') { D.kameraSor = false; D.kameraOnay = true; kameraDegistir(); }
      else if (is === 'kameraHayir') { D.kameraSor = false; ciz(); }
      else if (is === 'ses') sesAc();
      else if (is === 'mikdene') mikAc(true);
      else if (is === 'cagir') { D.listeAcik = !D.listeAcik; ciz(); }
      else if (is === 'bitir') bitir();
      else if (is === 'ayril') ayril();
    });
    $('cdUyari').addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-cd]') : null;
      if (!b) return;
      var is = b.getAttribute('data-cd');
      if (is === 'kameraEvet') { D.kameraSor = false; D.kameraOnay = true; kameraDegistir(); }
      else if (is === 'kameraHayir') { D.kameraSor = false; ciz(); }
    });
    var l = $('cdListe');
    if (l) l.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-uid]') : null;
      if (b) cagir(b.getAttribute('data-uid'), b.getAttribute('data-ad'));
    });
    return k;
  }
  function sureYaz() {
    var e = $('cdSure'); if (!e) return;
    if (!D.katildiT) { e.textContent = ''; return; }
    var sn = Math.max(0, Math.floor((SIMDI() - D.katildiT) / 1000)), d = Math.floor(sn / 60), s = sn % 60;
    e.textContent = (d < 10 ? '0' : '') + d + ':' + (s < 10 ? '0' : '') + s;
  }
  function ciz() {
    var k = kutu();
    k.classList.toggle('kucuk', !!D.kucuk);
    $('cdKucult').innerHTML = D.kucuk ? SVG.buyut : SVG.kucult;
    $('cdKucult').setAttribute('aria-label', D.kucuk ? 'Büyüt' : 'Küçült');
    var nokta = 'bekle', durum = '', uyari = false, baslik = 'Canlı ders';
    if (!D.baglanti) { nokta = 'hata'; durum = 'İnternet bağlantısı yok'; uyari = true; }
    else if (OGR) {
      if (!ogretmenVar()) durum = 'Öğretmen bekleniyor…';
      else if (V.bagli) { nokta = 'canli'; durum = 'Öğretmen bağlı · ses açık' + (SFU.kip === 'sfu' ? ' (SFU)' : ''); }
      else if (!D.karsi || !D.karsi.kimlik) durum = 'Öğretmen bağlı · ses bekleniyor…';
      else durum = 'Ses bağlantısı kuruluyor…';
      if (D.karsi && D.karsi.mik === false && V.bagli) durum += ' · öğretmenin mikrofonu kapalı';
    } else {
      var ad = D.davetliAd || 'Öğrenci', o = ogrenciVar();
      baslik = D.davetli ? ad : 'Canlı ders';
      if (!D.davetli) durum = 'Öğrenci çağrılmadı.';
      else if (!o && !karsiSes()) durum = ad + ' çağrıldı · bekleniyor… (sitede açık olmalı)';
      else if (V.bagli) { nokta = 'canli'; durum = ad + ' derste · ses açık' + (SFU.kip === 'sfu' ? ' (SFU)' : ''); }
      else durum = ad + ' bağlandı · ses kuruluyor…';
      if (D.karsi && D.karsi.mik === false && V.bagli) durum += ' · mikrofonu kapalı';
    }
    if (D.mikHata) { durum += (durum ? ' · ' : '') + D.mikHata; uyari = true; }
    $('cdNokta').className = 'cd-nokta ' + nokta;
    $('cdBaslik').textContent = baslik;
    var du = $('cdDurum'); du.textContent = durum; du.className = 'cd-durum' + (uyari ? ' uyari' : '');
    /* görüntü: karşı taraf kamerasını açtıysa */
    var kv = !!(D.karsi && D.karsi.kamera && V.bagli);
    $('cdVideo').classList.toggle('var', kv || !!V.kam);
    $('cdVideo').classList.toggle('tek', !kv && !!V.kam);
    $('cdGoruntu').hidden = !kv;
    $('cdBen').classList.toggle('var', !!V.kam);
    /* tuşlar */
    var t = '';
    t += '<button type="button" class="cd-dug" data-cd="mik" aria-pressed="' + (D.mik ? 'true' : 'false') + '" title="' + (D.mik ? 'Mikrofonu kapat' : 'Mikrofonu aç') + '">' + (D.mik ? SVG.mik : SVG.mikKapali) + '</button>';
    t += '<button type="button" class="cd-dug" data-cd="kamera" aria-pressed="' + (V.kam ? 'true' : 'false') + '" title="' + (V.kam ? 'Kamerayı kapat' : 'Kamerayı aç (isteğe bağlı)') + '">' + (V.kam ? SVG.kamera : SVG.kameraKapali) + '</button>';
    if (D.sesKilit) t += '<button type="button" class="cd-dug sari" data-cd="ses">' + SVG.ses + '<span>Sesi aç</span></button>';
    if (D.mikHata) t += '<button type="button" class="cd-dug" data-cd="mikdene" title="Mikrofonu yeniden dene">' + SVG.yenile + '</button>';
    if (OGR) t += '<button type="button" class="cd-dug kirmizi" data-cd="ayril" title="Dersten ayrıl, ana sayfaya dön">' + SVG.bitir + '<span>Ayrıl</span></button>';
    else {
      t += '<button type="button" class="cd-dug yesil" data-cd="cagir" title="Öğrenciyi derse çağır">' + SVG.cagir + '<span>' + (D.davetli ? 'Değiştir' : 'Öğrenciyi çağır') + '</span></button>';
      t += '<button type="button" class="cd-dug kirmizi" data-cd="bitir" title="Dersi bitir: öğrenci ana sayfaya döner, sen bu sayfada kalırsın">' + SVG.bitir + '<span>Bitir</span></button>';
    }
    $('cdTuslar').innerHTML = t;
    $('cdUyari').innerHTML = D.kameraSor
      ? '<div class="cd-uyari">Kamera görüntüsü veri tüketir (saatte yaklaşık 0,3–0,5 GB). Aylık ücretsiz pay aşılırsa fark ' +
        (OGR ? 'öğretmene' : 'sana') + ' aittir; ses tek başına ücretsiz payı aşmaz.' +
        '<div class="cd-tuslar"><button type="button" class="cd-dug yesil" data-cd="kameraEvet">' + SVG.kamera + '<span>Kamerayı aç</span></button>' +
        '<button type="button" class="cd-dug" data-cd="kameraHayir">Vazgeç</button></div></div>'
      : '';
    if (!OGR) {
      var cv = $('cdVeri');
      if (cv) cv.textContent = veriYazisi();
      var l = $('cdListe');
      l.hidden = !(D.listeAcik || !D.davetli);
      if (!l.hidden) {
        if (!D.liste.length) l.innerHTML = '<p class="cd-bos">Sınıf listende hesabı bağlı öğrenci yok. Öğrenci kodunu girip bağlanınca Listelerim\'de belirir; sonra buradan çağırabilirsin.</p>';
        else l.innerHTML = D.liste.map(function (s) {
          var secili = s.uid === D.davetli;
          return '<div class="cd-sat"><span>' + kac(s.ad || 'Öğrenci') + (s.sinif ? '<small>' + kac(s.sinif) + '</small>' : '') + '</span>' +
            '<button type="button" class="cd-dug' + (secili ? '' : ' yesil') + '" data-uid="' + kac(s.uid) + '" data-ad="' + kac(s.ad || 'Öğrenci') + '">' + (secili ? 'Yeniden çağır' : 'Çağır') + '</button></div>';
        }).join('');
      }
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
      if (elle && V.pc) {                        /* sonradan izin verildi: iz bağlantıya eklenir (öğrenci yeniden teklif eder; SFU: yayınla) */
        if (SFU.kip === 'sfu') { if (!SFU.izler.ses) sfuYayinla('ses', s.getAudioTracks()[0]).then(sfuKaydiYaz, function () { }); }
        else if (OGR) teklifEt(); else { kok.child('ses/ogt/yenile').set(TS()); }
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
    try { kok.child('ses/' + ROLUM + '/mik').set(D.mik); } catch (e) { }
    ciz();
  }
  /* KAMERA UYARISI (06.11.2026): ilk açışta (bu sayfada) bir kez sorulur; kapatmak sormaz */
  function kameraIste() {
    if (V.kam || D.kameraOnay) { kameraDegistir(); return; }
    D.kameraSor = true; ciz();
  }
  function kameraDegistir() {
    if (V.kam) {
      try { V.kam.stop(); } catch (e) { }
      V.kam = null; kamBen(false);
      if (V.vSender) { try { V.vSender.replaceTrack(null); } catch (e) { } }
      $('cdBen').srcObject = null;
      try { kok.child('ses/' + ROLUM + '/kamera').set(false); } catch (e) { }
      if (SFU.kip === 'sfu') { try { kok.child('ses/' + ROLUM + '/sfu/kamera').set(false); } catch (e) { } }
      ciz(); return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 20, max: 24 } } }).then(function (s) {
      V.kam = s.getVideoTracks()[0];
      if (!V.kam) return;
      kamBen(true);
      V.kam.onended = function () { if (V.kam) kameraDegistir(); };
      if (SFU.kip === 'sfu') sfuKameraYayinla();
      else if (V.vSender) { try { V.vSender.replaceTrack(V.kam); } catch (e) { } }
      try { $('cdBen').srcObject = new MediaStream([V.kam]); } catch (e) { }
      try { kok.child('ses/' + ROLUM + '/kamera').set(true); } catch (e) { }
      ciz();
    }).catch(function () { bildir('Kamera açılamadı.'); });
  }
  function sesAc() {
    var a = $('cdSes');
    if (!a) return;
    a.play().then(function () { D.sesKilit = false; ciz(); }).catch(function () { });
  }
  function uzakBagla(st) {
    var a = $('cdSes'), v = $('cdGoruntu');
    if (a && a.srcObject !== st) { a.srcObject = st; var p = a.play(); if (p && p.catch) p.catch(function () { D.sesKilit = true; ciz(); }); }
    if (v && v.srcObject !== st) { v.srcObject = st; try { var q = v.play(); if (q && q.catch) q.catch(function () { }); } catch (e) { } }
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

  /* ------------------------------------------------------------ KULLANIM ÖLÇÜMÜ (06.11.2026) */
  var IST = { sesIn: 0, sesOut: 0, goruntuIn: 0, goruntuOut: 0, aktarIn: 0, aktarOut: 0, aktarli: false, kameraSn: 0, pc: null, son: null, ciftId: null };
  var DERS = null;                      /* öğretmen: süren dersin toplamları */
  var JETON = { v: '', z: 0 };          /* kimlik jetonu (sekme kapanırken keepalive yazım için hazır) */
  function istatOku() {
    var pc = V.pc;
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
      if (IST.pc !== pc) { IST.pc = pc; IST.son = null; IST.ciftId = null; }
      var o = IST.son || {};
      ['sesIn', 'sesOut', 'goruntuIn', 'goruntuOut'].forEach(function (k2) { var d = ham[k2] - (o[k2] || 0); if (d > 0) IST[k2] += d; });
      if (c) {
        var oi = (IST.ciftId === c.id) ? (o.aktarIn || 0) : 0, oo = (IST.ciftId === c.id) ? (o.aktarOut || 0) : 0;
        if (aktarli) { var di = ham.aktarIn - oi, dd = ham.aktarOut - oo; if (di > 0) IST.aktarIn += di; if (dd > 0) IST.aktarOut += dd; IST.aktarli = true; }
        IST.ciftId = c.id;
      }
      IST.son = ham;
    }).catch(function () { });
  }
  function istatYaz() {                 /* öğrenci: sayaçlarını odaya yazar (öğretmen toplar) */
    if (!OGR || !V.pc) return;
    try {
      kok.child('ses/ogr/istat').set({ sesIn: IST.sesIn, sesOut: IST.sesOut, goruntuIn: IST.goruntuIn, goruntuOut: IST.goruntuOut,
                                       aktarIn: IST.aktarIn, aktarOut: IST.aktarOut, aktarli: IST.aktarli, kameraSn: IST.kameraSn, t: TS() });
    } catch (e) { }
  }
  function mb(b) { return Math.round((b || 0) / 1e3) / 1000; }          /* bayt → MB, üç ondalık (KB çözünürlük) */
  /* kamera süresi: açık kaldığı süre kesin ölçülür (10 sn'lik tik değil); öğretmen kendi + öğrencinin kamerasını toplar */
  var KAM = { ben: 0, benBas: 0, karsi: 0, karsiBas: 0 };
  function kamBen(acik) { var z = SIMDI(); if (acik && !KAM.benBas) KAM.benBas = z; else if (!acik && KAM.benBas) { KAM.ben += z - KAM.benBas; KAM.benBas = 0; } }
  function kamKarsi(acik) { var z = SIMDI(); if (acik && !KAM.karsiBas) KAM.karsiBas = z; else if (!acik && KAM.karsiBas) { KAM.karsi += z - KAM.karsiBas; KAM.karsiBas = 0; } }
  function kamSn() { var z = SIMDI(); return Math.round((KAM.ben + (KAM.benBas ? z - KAM.benBas : 0) + KAM.karsi + (KAM.karsiBas ? z - KAM.karsiBas : 0)) / 1000); }
  function kamSifirla() { var z = SIMDI(); KAM.ben = 0; KAM.karsi = 0; if (KAM.benBas) KAM.benBas = z; if (KAM.karsiBas) KAM.karsiBas = z; }
  function ayAd(ms) { var d = new Date(ms || SIMDI()); return d.getFullYear() + '-' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1); }
  function dersBaslat() {
    if (OGR || DERS || !D.davetli) return;
    kamSifirla();
    DERS = { id: rastgele(), ogr: D.davetli, ad: D.davetliAd || 'Öğrenci', bas: SIMDI(), bitis: 0, sn: 0, kameraSn: 0,
             sesB: 0, goruntuB: 0, aktarB: 0, aktarli: false, benSon: { sesIn: IST.sesIn, goruntuIn: IST.goruntuIn, aktarIn: IST.aktarIn }, ogrSon: null, kapanisZ: null };
    iz('ders', 'başladı ' + DERS.id);
  }
  function dersTopla() {                /* öğretmen: kendi ve öğrencinin sayaçlarından dersin toplamları (teslim edilen bayt) */
    if (!DERS) return;
    var b = DERS.benSon;
    var di = IST.sesIn - b.sesIn, dg = IST.goruntuIn - b.goruntuIn, da = IST.aktarIn - b.aktarIn;
    if (di > 0) DERS.sesB += di; if (dg > 0) DERS.goruntuB += dg; if (da > 0) DERS.aktarB += da;
    DERS.benSon = { sesIn: IST.sesIn, goruntuIn: IST.goruntuIn, aktarIn: IST.aktarIn };
    if (IST.aktarli) DERS.aktarli = true;
    var v = D.karsi && D.karsi.istat;
    if (v) {
      var o = DERS.ogrSon || {};
      ['sesIn', 'goruntuIn', 'aktarIn'].forEach(function (k) {
        var yeni = +v[k] || 0, eski = +o[k] || 0, d = yeni - eski;
        if (d < 0) d = yeni;                                  /* öğrencinin sayfası yenilendi: sayaç baştan */
        if (d > 0) { if (k === 'sesIn') DERS.sesB += d; else if (k === 'goruntuIn') DERS.goruntuB += d; else DERS.aktarB += d; }
      });
      if (v.aktarli) DERS.aktarli = true;
      DERS.ogrSon = { sesIn: +v.sesIn || 0, goruntuIn: +v.goruntuIn || 0, aktarIn: +v.aktarIn || 0 };
    }
    DERS.kameraSn = kamSn();
  }
  function dersKayit() {
    var k = DERS; if (!k) return null;
    dersTopla();
    k.bitis = SIMDI(); k.sn = Math.max(0, Math.round((k.bitis - k.bas) / 1000));
    return { id: k.id, ogr: k.ogr, ad: k.ad, bas: k.bas, bitis: k.bitis, sn: k.sn, kameraSn: Math.round(k.kameraSn),
             sesMB: mb(k.sesB), goruntuMB: mb(k.goruntuB), aktarMB: mb(k.aktarB), aktarli: !!k.aktarli };
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
  /* öğretmen: öğrencinin varlığına göre dersi aç/kapat (60 sn yoksa biter) */
  function dersDenetle() {
    if (OGR) return;
    var var_ = !!(ogrenciVar() || karsiSes());
    if (var_) {
      if (DERS && DERS.ogr !== D.davetli) dersBitir('ogrenci-degisti');
      if (!DERS) dersBaslat();
      else if (DERS.kapanisZ) { clearTimeout(DERS.kapanisZ); DERS.kapanisZ = null; }
    } else if (DERS && !DERS.kapanisZ) {
      DERS.kapanisZ = setTimeout(function () { if (DERS) { DERS.kapanisZ = null; dersBitir('ayrildi'); } }, DERS_KAPANMA);
    }
  }

  /* ------------------------------------------------------------ ses: eş bağlantısı */
  function yeniPc(sfu) {
    var pc = new RTCPeerConnection(sfu ? SFU_PC : (V.ice || YEDEK));
    pc.onicecandidate = function (e) {
      if (sfu || pc !== V.pc || !e.candidate) return;
      iz('adayGonder', V.n + ' ' + String(e.candidate.candidate).slice(0, 40));
      /* teklif/cevap yazılmadan aday yazılmaz (set düğümü değiştirir: önce yazılan aday silinirdi) */
      if (V.adayKuyruk) { V.adayKuyruk.push(e.candidate.toJSON()); return; }
      adayYaz(e.candidate.toJSON());
    };
    pc.ontrack = function (e) {
      if (pc !== V.pc) return;
      var st = (e.streams && e.streams[0]) || V.uzak || new MediaStream();
      if (!(e.streams && e.streams[0])) { try { st.addTrack(e.track); } catch (x) { } }
      V.uzak = st;
      uzakBagla(st);
    };
    var durum = function () {
      if (pc !== V.pc) return;
      var s = pc.connectionState || pc.iceConnectionState;
      iz('pc', s + ' ice=' + pc.iceConnectionState + ' sig=' + pc.signalingState);
      if (s === 'connected' || s === 'completed') {
        V.bagli = true; V.deneme = 0; clearTimeout(V.kopZ); V.kopZ = null;
        if (!V.baglandiT) V.baglandiT = SIMDI();
        if (!D.katildiT) D.katildiT = SIMDI();
      } else if (s === 'failed') { V.bagli = false; koptu(); }
      else if (s === 'disconnected') {
        V.bagli = false;
        clearTimeout(V.kopZ);
        V.kopZ = setTimeout(function () { V.kopZ = null; if (pc === V.pc && pc.connectionState !== 'connected' && pc.iceConnectionState !== 'connected' && pc.iceConnectionState !== 'completed') koptu(); }, 6000);
      } else if (s === 'closed') V.bagli = false;
      ciz();
    };
    pc.onconnectionstatechange = durum;
    pc.oniceconnectionstatechange = durum;
    return pc;
  }
  function pcKapat() {
    iz('pcKapat', V.n);
    clearTimeout(V.kopZ); V.kopZ = null;
    clearTimeout(V.bekciZ); V.bekciZ = null; V.adayKuyruk = null;
    var pc = V.pc; V.pc = null; V.vSender = null; V.bagli = false; V.bekleyen = [];
    if (pc) { try { pc.onicecandidate = pc.ontrack = pc.onconnectionstatechange = pc.oniceconnectionstatechange = null; pc.close(); } catch (e) { } }
    V.uzak = null;
    var a = $('cdSes'), v = $('cdGoruntu');
    if (a) a.srcObject = null;
    if (v) v.srcObject = null;
  }
  function koptu() {                           /* bağlantı düştü: öğrenci yeniden teklif eder, öğretmen ister (artan bekleme); SFU: oturum baştan */
    if (D.cikiyor || V.denemeZ) return;
    var bekle = Math.min(20000, 800 * Math.pow(2, V.deneme++));
    pcKapat();
    V.denemeZ = setTimeout(function () {
      V.denemeZ = null;
      if (D.cikiyor) return;
      if (SFU.kip === 'sfu') { sfuBasla(); return; }
      if (OGR) { if (D.karsi && D.karsi.kimlik) teklifEt(); }
      else { try { kok.child('ses/ogt/yenile').set(TS()); } catch (e) { } }
    }, bekle);
    ciz();
  }
  function yerelEkle(pc) {
    var ses = V.yerel && V.yerel.getAudioTracks()[0];
    if (ses) pc.addTrack(ses, V.yerel);
    else if (OGR) pc.addTransceiver('audio', { direction: 'recvonly' });
  }
  function adayYaz(c) { try { kok.child('ses/' + ROLUM + '/aday').push({ n: V.n, c: c }); } catch (x) { } }
  function adayAkit() { var l = V.adayKuyruk || []; V.adayKuyruk = null; l.forEach(adayYaz); }
  function bekciKur(pc, ms) {                 /* bekçi: bu kadar sürede bağlanmadıysa yeniden (öğrenci teklif, öğretmen ister) */
    clearTimeout(V.bekciZ);
    V.bekciZ = setTimeout(function () { V.bekciZ = null; if (pc === V.pc && !V.bagli && !D.cikiyor) { iz('bekci', pc.connectionState); koptu(); } }, ms);
  }
  function adayGeldi(v) {
    iz('adayGeldi', (v && v.n) + ' bizim=' + V.n + ' pc=' + !!V.pc + ' uzak=' + !!(V.pc && V.pc.remoteDescription));
    if (!v || !v.c || v.n !== V.n || !V.pc) return;
    if (!V.pc.remoteDescription) { V.bekleyen.push(v.c); return; }
    try { V.pc.addIceCandidate(new RTCIceCandidate(v.c)).catch(function () { }); } catch (e) { }
  }
  function adayBosalt() {
    var l = V.bekleyen; V.bekleyen = [];
    l.forEach(function (c) { try { V.pc.addIceCandidate(new RTCIceCandidate(c)).catch(function () { }); } catch (e) { } });
  }
  /* ÖĞRENCİ: teklif */
  function teklifEt() {
    iz('teklifEt', (D.karsi && D.karsi.kimlik) + ' hazir=' + D.hazir + ' cikiyor=' + D.cikiyor);
    if (!OGR || D.cikiyor || !D.hazir || !D.karsi || !D.karsi.kimlik) return;
    pcKapat();
    var n = V.n = rastgele(), icin = V.icin = D.karsi.kimlik;
    var pc = V.pc = yeniPc();
    V.adayKuyruk = [];
    bekciKur(pc, 20000);
    yerelEkle(pc);
    var tr = pc.addTransceiver('video', { direction: 'sendrecv' });
    V.vSender = tr.sender;
    if (V.kam) { try { tr.sender.replaceTrack(V.kam); } catch (e) { } }
    pc.createOffer().then(function (o) { return pc.setLocalDescription(o).then(function () { return o; }); }).then(function (o) {
      if (pc !== V.pc) return;
      var r = kok.child('ses/ogr');
      r.onDisconnect().remove();
      return r.set({ n: n, icin: icin, kamera: !!V.kam, mik: D.mik, teklif: { type: o.type, sdp: o.sdp }, t: TS() }).then(function () { if (pc === V.pc) adayAkit(); });
    }).catch(function (e) { iz('teklifHata', e && e.message); bildir('Ses bağlantısı kurulamadı: ' + ((e && e.message) || e), 4000); });
    ciz();
  }
  /* ÖĞRETMEN: cevap */
  function cevapla(v) {
    iz('cevapla', (v && v.n) + ' icin=' + (v && v.icin) + ' ben=' + BEN + ' hazir=' + D.hazir + ' eski=' + V.cevaplananN);
    if (OGR || D.cikiyor || !D.hazir || !v || !v.teklif || v.icin !== BEN) return;
    if (v.n === V.cevaplananN) return;                        /* bu teklif cevaplandı */
    pcKapat();
    V.n = V.cevaplananN = v.n;
    var pc = V.pc = yeniPc();
    V.adayKuyruk = [];
    bekciKur(pc, 25000);
    pc.setRemoteDescription(new RTCSessionDescription(v.teklif)).then(function () {
      if (pc !== V.pc) return;
      yerelEkle(pc);
      pc.getTransceivers().forEach(function (tr) {
        var kind = (tr.receiver && tr.receiver.track && tr.receiver.track.kind) || '';
        if (kind === 'video') {
          V.vSender = tr.sender;
          try { tr.direction = 'sendrecv'; } catch (e) { }
          if (V.kam) { try { tr.sender.replaceTrack(V.kam); } catch (e) { } }
        }
      });
      adayBosalt();
      return pc.createAnswer();
    }).then(function (c) {
      if (!c || pc !== V.pc) return;
      return pc.setLocalDescription(c).then(function () {
        return kok.child('ses/ogt').update({ cevap: { type: c.type, sdp: c.sdp, n: v.n }, aday: null, kamera: !!V.kam, mik: D.mik });
      }).then(function () { if (pc === V.pc) adayAkit(); });
    }).catch(function (e) { iz('cevapHata', e && e.message); bildir('Ses bağlantısı kurulamadı: ' + ((e && e.message) || e), 4000); });
    ciz();
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
  function sfuSifirla() { SFU.sid = null; SFU.izler = {}; SFU.abone = {}; SFU.karsiSid = null; SFU.baslatiliyor = null; }
  /* kendi oturumu: eş bağlantısı + sessions/new + mikrofon yayını; kaydı odaya yazar */
  function sfuBasla() {
    if (SFU.baslatiliyor) return SFU.baslatiliyor;
    if (D.cikiyor) return Promise.reject(new Error('çıkılıyor'));
    pcKapat(); sfuSifirla();
    var pc = V.pc = yeniPc(true);
    SFU.baslatiliyor = sfuCagri('oturum').then(function (r) {
      if (pc !== V.pc) throw new Error('eş değişti');
      if (!r.sessionId) throw new Error('oturum yok');
      SFU.sid = String(r.sessionId);
      iz('sfu', 'oturum ' + SFU.sid.slice(0, 8));
      var ses = V.yerel && V.yerel.getAudioTracks()[0];
      bekciKur(pc, 25000);
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
  /* karşı tarafın izine abone ol: tracks/new (remote) → SFU teklifi → cevap → renegotiate */
  function sfuAbone(karsiSid, ad) {
    var anahtar = karsiSid + '/' + ad;
    if (SFU.abone[anahtar]) return Promise.resolve();
    SFU.abone[anahtar] = 'bekliyor';
    return sfuSira(function () {
      var pc = V.pc; if (!pc || !SFU.sid) throw new Error('oturum yok');
      return sfuCagri('iz', SFU.sid, { tracks: [{ location: 'remote', sessionId: karsiSid, trackName: ad }] }).then(function (r) {
        var t = r.tracks && r.tracks[0];
        if (t && t.errorCode) throw new Error(t.errorDescription || t.errorCode);
        if (!r.requiresImmediateRenegotiation || !r.sessionDescription) return;
        return pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: r.sessionDescription.sdp }))
          .then(function () { return pc.createAnswer(); }).then(function (a) { return pc.setLocalDescription(a); }).then(function () { return adayBekle(pc); })
          .then(function () { return sfuCagri('anlas', SFU.sid, { sessionDescription: { sdp: pc.localDescription.sdp, type: 'answer' } }); });
      }).then(function () { SFU.abone[anahtar] = true; iz('sfu', 'abone ' + ad + ' ← ' + karsiSid.slice(0, 8)); });
    }).catch(function (e) { delete SFU.abone[anahtar]; iz('sfuHata', 'abone ' + ad + ': ' + (e && e.message)); throw e; });
  }
  function sfuKameraYayinla() {
    var t = SFU.izler.kamera;
    var p = t ? Promise.resolve(t.sender.replaceTrack(V.kam)) : sfuYayinla('kamera', V.kam);
    p.then(function () { try { kok.child('ses/' + ROLUM + '/sfu/kamera').set(true); } catch (e) { } }, function () { });
  }
  /* kendi SFU kaydı odaya: karşı taraf görünce abone olur */
  function sfuKaydiYaz() {
    if (!SFU.sid) return;
    var r = kok.child('ses/' + ROLUM);
    var kayit = { kip: 'sfu', sfu: { sid: SFU.sid, ses: !!SFU.izler.ses, kamera: !!(SFU.izler.kamera && V.kam) }, kamera: !!V.kam, mik: D.mik, t: TS() };
    if (OGR) { r.onDisconnect().remove(); r.update(kayit); }
    else { kayit.kimlik = BEN; r.onDisconnect().remove(); r.update(kayit); }
  }
  /* karşı tarafın kaydına bak: oturumu (değiştiyse) ve açık izlerine abone ol */
  function sfuKarsiBak() {
    if (SFU.kip !== 'sfu' || !SFU.sid || !V.pc) return;
    var v = D.karsi, k = v && v.sfu;
    if (!k || !k.sid) { SFU.karsiSid = null; return; }
    if (k.sid !== SFU.karsiSid) { SFU.karsiSid = k.sid; }
    if (k.ses) sfuAbone(k.sid, 'ses').catch(function () { });
    if (k.kamera) sfuAbone(k.sid, 'kamera').catch(function () { });
  }

  /* ------------------------------------------------------------ çağrı (öğretmen) */
  function cagir(uid, ad) {
    if (OGR || !uid) return;
    uid = String(uid); ad = String(ad || 'Öğrenci').slice(0, 40);
    var eski = D.davetli;
    var sonra = function () {
      var r = vt.ref('canliCagri/' + uid);
      r.set({ oda: ODA, ad: ADIM, t: TS() }).then(function () { r.onDisconnect().remove(); }).catch(function (e) { bildir('Çağrı yazılamadı: ' + ((e && e.message) || e), 4000); });
      bildir(ad + ' çağrıldı.');
    };
    if (eski && eski !== uid) { try { vt.ref('canliCagri/' + eski).remove(); } catch (e) { } pcKapat(); D.katildiT = 0; V.baglandiT = 0; if (DERS) dersBitir('ogrenci-degisti'); }
    D.listeAcik = false;
    kok.update({ davetli: uid, davetliAd: ad, davetT: TS(), bitti: null, 'ses/ogr': null }).then(sonra, function (e) { bildir('Çağrı yazılamadı: ' + ((e && e.message) || e), 4000); });
  }
  function bitir() {
    if (OGR || D.cikiyor) return;
    D.cikiyor = true;
    if (DERS) istatOku().then(function () { dersBitir('bitir', true); pcKapat(); });   /* son sayaç okuması, kayıt, sonra bağlantı kapanır */
    else pcKapat();
    try { if (V.yerel) V.yerel.getTracks().forEach(function (t) { t.stop(); }); if (V.kam) V.kam.stop(); } catch (e) { }
    try { if (D.davetli) vt.ref('canliCagri/' + D.davetli).remove(); } catch (e) { }
    /* davetli silinmez: öğrencinin okuma izni sürer, kumandanın «Bitir»i (yayin/bitir) onu ana sayfaya yollar */
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
    pcKapat();
    try { if (V.yerel) V.yerel.getTracks().forEach(function (t) { t.stop(); }); if (V.kam) V.kam.stop(); } catch (e) { }
    try { vt.ref('canliCagri/' + UID).remove(); } catch (e) { }
    try { kok.child('ses/ogr').remove(); } catch (e) { }
    setTimeout(function () { try { T.cik('index.html', true); } catch (e) { location.href = 'index.html'; } }, 250);
  }
  function dersBitti(neden) {
    if (D.cikiyor) return;
    D.cikiyor = true;
    pcKapat();
    try { if (V.yerel) V.yerel.getTracks().forEach(function (t) { t.stop(); }); if (V.kam) V.kam.stop(); } catch (e) { }
    bildir(neden === 'baska' ? 'Öğretmen başka bir öğrenciyi çağırdı. Ana sayfaya dönülüyor…' : 'Bu derse çağrılmadın ya da ders bitti. Ana sayfaya dönülüyor…', 3000);
    setTimeout(function () { try { T.cik('index.html'); } catch (e) { location.href = 'index.html'; } }, 1500);
  }

  /* ------------------------------------------------------------ dinleyiciler */
  function ogretmenBasla() {                 /* veri dinleyicileri hemen (mikrofon izni beklenirken pencere çalışır) */
    ADIM = adim();
    D.liste = liste();
    kok.child('davetli').on('value', function (s) { D.davetli = s.val() || null; ciz(); });
    kok.child('davetliAd').on('value', function (s) { D.davetliAd = String(s.val() || ''); ciz(); });
    kok.child('oda/izle').on('value', function (s) {
      D.izle = s.val() || {};
      var o = ogrenciVar();
      if (o && !D.katildiT) D.katildiT = SIMDI();
      if (!o && D.katildiT && !V.bagli) { /* öğrenci gitti: süre durur, yeniden gelince baştan */ D.katildiT = 0; V.baglandiT = 0; }
      dersDenetle();
      ciz();
    });
    /* yarıda kalan ders (sekme kapandı, «Bitir» denmedi): oda yeniden açılınca öğrenci yeniden çağrılır */
    kok.once('value', function (s) {
      var v = s.val() || {}, uid = v.davetli;
      if (uid && !v.bitti && !D.cikiyor) { var r = vt.ref('canliCagri/' + uid); r.set({ oda: ODA, ad: ADIM, t: TS() }).then(function () { r.onDisconnect().remove(); }).catch(function () { }); }
    });
  }
  function ogretmenSes() {                   /* mikrofon ve bağlantı sunucuları hazır: işaretleşme */
    kok.child('ses/ogr').on('value', function (s) {
      var v = s.val() || null;
      D.karsi = v;
      iz('ses/ogr', v ? ('kip=' + v.kip + ' n=' + v.n + ' teklif=' + !!v.teklif + ' sfu=' + !!(v.sfu && v.sfu.sid)) : 'yok');
      kamKarsi(!!(v && v.kamera));
      if (SFU.kip === 'sfu') { sfuKarsiBak(); }                       /* SFU: öğrencinin oturumuna abone ol (kendi bağlantısı sürer) */
      else if (SFU.baslatiliyor) { }                                   /* SFU kuruluyor: bağlantıya dokunma */
      else if (!v) { if (V.pc) pcKapat(); }
      else if (v.kip !== 'sfu') cevapla(v);
      dersDenetle();
      ciz();
    });
    kok.child('ses/ogr/aday').on('child_added', function (s) { adayGeldi(s.val()); });
    var kimlikYaz = function () {
      var r = kok.child('ses/ogt');
      r.onDisconnect().remove();
      if (SFU.kip === 'sfu') { sfuKaydiYaz(); return; }
      r.update({ kimlik: BEN, kip: 'p2p', t: TS(), kamera: !!V.kam, mik: D.mik });
    };
    /* önce SFU denenir (Cloud Function «sfu»); yoksa/olmazsa eşten eşe */
    sfuBasla().then(function (oldu) { if (!oldu) { SFU.kip = 'p2p'; pcKapat(); } kimlikYaz(); ciz(); });
    /* bağlantı gidip gelince: kimlik ve çağrı yeniden (kopunca işleri silmiş olabilir) */
    vt.ref('.info/connected').on('value', function (s) {
      var once = D.baglanti;
      D.baglanti = !!s.val();
      if (D.baglanti && !once && !D.cikiyor) {
        if (SFU.kip) kimlikYaz();
        if (D.davetli && !ogrenciVar()) { var r = vt.ref('canliCagri/' + D.davetli); r.set({ oda: ODA, ad: ADIM, t: TS() }).then(function () { r.onDisconnect().remove(); }).catch(function () { }); }
      }
      ciz();
    });
  }
  function ogrenciBasla() {                  /* veri dinleyicileri hemen */
    kok.child('davetliAd').on('value', function (s) {
      var ad = String(s.val() || '');
      window.__kidefCanliAd = ad;                            /* motor: cihaz adı = öğrencinin adı (tahtaAdi) */
      /* odanın «ekran» kaydı motor başlarken yazıldı (ad henüz yoktu): adı düzelt */
      try { var e = T.S && T.S.ekran; if (ad && e && e.id === BEN && e.ad !== ad) { e.ad = ad; kok.child('oda/ekran').update({ ad: ad }); } } catch (x) { }
      ciz();
    });
    kok.child('davetli').on('value', function (s) {
      var v = s.val();
      if (v && v !== UID) dersBitti('baska');
    }, function () { dersBitti('izin'); });
    kok.child('oda/yayin').on('value', function (s) { D.yayin = s.val(); ciz(); }, function () { });
    vt.ref('.info/connected').on('value', function (s) { D.baglanti = !!s.val(); ciz(); });
  }
  function ogrenciSes() {                    /* mikrofon ve bağlantı sunucuları hazır: işaretleşme */
    kok.child('ses/ogt').on('value', function (s) {
      var v = s.val() || null;
      D.karsi = v;
      iz('ses/ogt', v ? ('kip=' + v.kip + ' kimlik=' + v.kimlik + ' cevap=' + (v.cevap && v.cevap.n) + ' yenile=' + v.yenile + ' sfu=' + !!(v.sfu && v.sfu.sid)) : 'yok');
      kamKarsi(!!(v && v.kamera));
      if (v && v.kip === 'sfu') {                                /* öğretmen SFU'da: kendi oturumunu aç, öğretmenin izlerine abone ol */
        if (SFU.kip !== 'sfu' && !SFU.baslatiliyor) { if (V.pc && SFU.kip !== 'sfu') pcKapat(); sfuBasla().then(function (oldu) { if (!oldu) { SFU.kip = 'p2p'; } ciz(); }); }
        else sfuKarsiBak();
        ciz(); return;
      }
      if (SFU.baslatiliyor) { ciz(); return; }                        /* SFU kuruluyor: bağlantıya dokunma */
      if (SFU.kip === 'sfu' && v && v.kimlik) { SFU.kip = null; pcKapat(); sfuSifirla(); }   /* öğretmen eşten eşe döndü */
      if (!v || !v.kimlik) { if (V.pc) pcKapat(); V.icin = null; ciz(); return; }
      if (v.kimlik !== V.icin) { V.sonYenile = v.yenile || null; V.deneme = 0; teklifEt(); return; }     /* öğretmen (yeniden) geldi */
      if ((v.yenile || null) !== V.sonYenile) { V.sonYenile = v.yenile || null; V.deneme = 0; teklifEt(); return; }   /* öğretmen yeniden istedi */
      if (v.cevap && V.pc && v.cevap.n === V.n && V.pc.signalingState === 'have-local-offer') {
        var pc = V.pc;
        pc.setRemoteDescription(new RTCSessionDescription({ type: v.cevap.type, sdp: v.cevap.sdp })).then(function () { if (pc === V.pc) adayBosalt(); }).catch(function () { });
      }
      ciz();
    }, function () { });
    kok.child('ses/ogt/aday').on('child_added', function (s) { adayGeldi(s.val()); }, function () { });
  }

  function basla() {
    if (!window.firebase || !firebase.apps || !firebase.apps.length || !firebase.database) { setTimeout(basla, 150); return; }
    auth = firebase.auth(); vt = firebase.database(); kok = vt.ref('canli/' + ODA);
    stilKur();
    auth.onAuthStateChanged(function (u) {
      if (!u || u.isAnonymous || UID) return;                /* giriş yoksa kabuğun kendi ekranı var */
      UID = u.uid;
      if (!OGR && ODA !== 'ders_' + UID) return;             /* başkasının odası: tahta.js ana sayfaya yollar */
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
  window.KidefCanliOda = { acik: true, oda: ODA, ogrenci: OGR, D: D, V: V, IST: IST, SFU: SFU, iz: IZ, izd: IZD, cagir: cagir, bitir: bitir, ayril: ayril, mik: mikDegistir, kamera: kameraIste,
                           ders: function () { return DERS; }, kayit: dersKayit, kuyruk: kuyruk, kayitYazisi: kayitYazisi, istatOku: istatOku };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
