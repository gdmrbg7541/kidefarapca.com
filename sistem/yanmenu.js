/* ==========================================================================
   MOBİL YAN MENÜ (17.10.2026)
   Öğretmen: "mobilde giriş tuşu ve profil hariç headerdeki tüm elementler
   sidebar olarak soldan açılsın".

   Telefonda (dikey: en çok 576px genişlik · yatay: en çok 500px yükseklik)
   başlıkta yalnız MENÜ TUŞU, SİTE ADI ve PROFİL / GİRİŞ TUŞU kalır.
   Sekmeler (Paketler, Canlı Ders, Ders Talep, Panelim, istek zili, Tahtaya
   yansıt, Yönetici), dil düğmesi ve Çıkış soldan açılan çekmeceye geçer.

   Öğeler KOPYALANMAZ, TAŞINIR: id'leri, tıklama işleri, rozetleri ve
   görünürlük ayarları (router.js, auth.js, tahtagir.js, ogrencihesap.js)
   aynen çalışır. Ekran genişleyince (tablet / bilgisayar) her öğe eski
   yerine geri konur; masaüstünde hiçbir şey değişmez.

   Yazılar sözlükteki hazır anahtarlardan gelir (bas.*, th.dugme,
   nav.anasayfa, nav.ana_menu, dil.baslik, dil.yakinda, g.cikis, g.kapat);
   dil değişince sistem/dil.js çekmecedeki yazıları da çevirir.
   index.html bu dosyayı </header>'ın hemen altında çağırır: başlık
   ilk boyanmadan önce yeni düzene geçer, sayfa zıplamaz.

   CANLI SİMGELER (21.10.2026) — öğretmen: "mobildeki sidebardaki svg ler
   animasyonlu olsun". Çekmece açıkken her simge anlamına uygun kısa bir
   hareket yapar; satırlar yukarıdan aşağı sırayla (simgeSirasi), 6 sn'de bir.
   «Yakında» satırları ve «hareketi azalt» tercihi hariç.
   ========================================================================== */
(function () {
  'use strict';
  if (window.KidefYanMenu) return;

  var SORGU = '(max-width:576px) and (orientation:portrait), (orientation:landscape) and (max-height:500px)';
  var mq = window.matchMedia ? window.matchMedia(SORGU) : null;
  var bas = document.querySelector('header');
  if (!bas || !mq) return;

  /* sekme anahtarı → Türkçe ad (dil.js çevirir) */
  var ADLAR = {
    'bas.paketler': 'Paketler',
    'bas.canli': 'Canlı Ders Paketleri',
    'bas.talep': 'Ders Talep Et',
    'bas.panelim': 'Panelim',
    'bas.istekler': 'Bekleyen öğrenci istekleri',
    'th.dugme': 'Tahtaya yansıt',
    'bas.yonetici': 'Yönetici Paneli'
  };

  function $(id) { return document.getElementById(id); }
  function yap(etiket, sinif, html) {
    var e = document.createElement(etiket);
    if (sinif) e.className = sinif;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function metin(k, tr) {
    try { return (window.KidefDil && window.KidefDil.metin) ? window.KidefDil.metin(k, tr) : tr; } catch (e) { return tr; }
  }
  /* data-i18n-tr: Türkçe asıl; dil.js Türkçeye dönerken bunu yazar */
  function adSpan(anahtar, tr) {
    var s = yap('span', 'kc-ad');
    s.setAttribute('data-i18n', anahtar);
    s.setAttribute('data-i18n-tr', tr);
    s.textContent = metin(anahtar, tr);
    return s;
  }
  function nitelik(e, ad, anahtar, tr) {        /* ad: 'title' | 'aria' */
    var n = 'data-i18n-' + ad;
    e.setAttribute(n, anahtar);
    e.setAttribute(n + '-tr', tr);
    e.setAttribute(ad === 'aria' ? 'aria-label' : 'title', metin(anahtar, tr));
  }

  /* ------------------------------------------------------------- stil */
  var STIL = [
    '#kdMenuTus{ display:none; }',
    'html.kd-yanmenu #kdMenuTus{ display:inline-flex; align-items:center; justify-content:center; position:relative;',
    '  flex:none; width:40px; height:40px; padding:0; margin:0; cursor:pointer; color:#fff;',
    '  background:rgba(255,255,255,.16); border:1px solid rgba(255,255,255,.45); border-radius:11px;',
    '  -webkit-tap-highlight-color:transparent; transition:background .15s, transform .12s; }',
    'html.kd-yanmenu #kdMenuTus:active{ transform:scale(.94); background:rgba(255,255,255,.3); }',
    '#kdMenuTus svg{ width:22px; height:22px; display:block; stroke:#fff; }',
    '#kdMenuTus .kc-isaret{ display:none; position:absolute; top:-4px; right:-4px; width:12px; height:12px;',
    '  border-radius:50%; background:#22C55E; box-shadow:0 0 0 2px #fff; }',
    '#kdMenuTus.var .kc-isaret{ display:block; }',
    'header .kc-ad, header .kc-yakinda{ display:none !important; }',
    /* dikey telefon: tek satır — menü | site adı | profil/giriş */
    '@media (max-width:576px) and (orientation:portrait){',
    '  html.kd-yanmenu header{ grid-template-columns:44px minmax(0,1fr) 44px !important; row-gap:0 !important;',
    '    column-gap:8px !important; padding:8px 10px !important; }',
    '  html.kd-yanmenu header #kdMenuTus{ grid-column:1; grid-row:1; justify-self:start; align-self:center; }',
    '  html.kd-yanmenu header h1{ grid-column:2 !important; grid-row:1 !important; align-self:center !important;',
    '    justify-self:center !important; font-size:1.32em !important; }',
    '  html.kd-yanmenu header #user-info{ grid-column:3 !important; grid-row:1 !important; align-self:center !important;',
    '    justify-self:end !important; }',
    '  html.kd-yanmenu header #header-login-btn{ grid-column:3 !important; grid-row:1 !important; align-self:center !important;',
    '    justify-self:end !important; width:40px; height:40px; padding:0 !important;',
    '    align-items:center; justify-content:center; border-radius:11px; }',
    '  html.kd-yanmenu header #header-login-btn:not([style*="display: none"]):not([style*="display:none"]){ display:inline-flex !important; }',
    '  html.kd-yanmenu header #header-login-btn svg{ width:19px !important; height:19px !important; }',
    '}',
    '@media (orientation:landscape) and (max-height:500px){',
    '  html.kd-yanmenu #kdMenuTus{ width:34px; height:34px; margin-right:4px; }',
    '}',
    /* çekmece */
    '#kdCekmeceKok{ position:fixed; inset:0; z-index:10100; pointer-events:none; visibility:hidden; }',
    '#kdCekmeceKok.acik{ pointer-events:auto; visibility:visible; }',
    '#kdCekmeceKok .kc-perde{ position:absolute; inset:0; background:rgba(15,23,42,.46); opacity:0;',
    '  transition:opacity .26s ease; -webkit-tap-highlight-color:transparent; }',
    '#kdCekmeceKok.acik .kc-perde{ opacity:1; }',
    '#kdCekmece{ position:absolute; top:0; left:0; bottom:0; width:min(84vw,320px); display:flex; flex-direction:column;',
    '  background:#fff; color:#1F2937; box-shadow:12px 0 36px rgba(15,23,42,.28); border-radius:0 20px 20px 0;',
    '  transform:translateX(-104%); transition:transform .28s cubic-bezier(.4,0,.2,1); overflow:hidden;',
    '  font-family:inherit; text-align:left; direction:ltr; overscroll-behavior:contain; }',
    '#kdCekmeceKok.acik #kdCekmece{ transform:none; }',
    '#kdCekmeceKok.kc-sert, #kdCekmeceKok.kc-sert *{ transition:none !important; }',
    '#kdCekmece .kc-bas{ flex:none; display:flex; align-items:center; gap:10px;',
    '  padding:calc(14px + env(safe-area-inset-top,0px)) 12px 14px 18px;',
    '  background:linear-gradient(90deg,#FFC107 0%,#F39C12 55%,#EF5350 100%); color:#fff; }',
    '#kdCekmece .kc-marka{ flex:1 1 auto; min-width:0; text-align:left; background:none; border:0; padding:4px 0; margin:0;',
    '  color:#fff; cursor:pointer; font-family:"Marhey",sans-serif; font-weight:700; font-size:1.3rem; line-height:1.2;',
    '  white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-shadow:0 1px 2px rgba(0,0,0,.12); }',
    '#kdCekmece .kc-kapat{ flex:none; width:38px; height:38px; display:inline-flex; align-items:center; justify-content:center;',
    '  padding:0; margin:0; border-radius:50%; border:1px solid rgba(255,255,255,.5); background:rgba(255,255,255,.18);',
    '  color:#fff; cursor:pointer; }',
    '#kdCekmece .kc-kapat svg{ width:20px; height:20px; display:block; }',
    '#kdCekmece .kc-govde{ flex:1 1 auto; min-height:0; overflow-y:auto; -webkit-overflow-scrolling:touch;',
    '  padding:10px 10px 12px; display:flex; flex-direction:column; gap:2px; }',
    '#kdCekmece .kc-alt{ flex:none; padding:10px 10px calc(12px + env(safe-area-inset-bottom,0px)); border-top:1px solid #EEF1F5; }',
    '#kdCekmece .kc-alt:empty, #kdCekmece .kc-alt.bos{ display:none; }',
    '#kdCekmece .kc-ayrac{ height:1px; margin:8px 6px; background:#EEF1F5; flex:none; }',
    '#kdCekmece [hidden]{ display:none !important; }',
    /* satırlar: taşınan sekmeler + çekmecenin kendi satırları */
    '#kdCekmece #header-nav-tabs{ display:flex !important; flex-direction:column !important; flex-wrap:nowrap !important;',
    '  gap:2px !important; margin:0 !important; width:auto !important; padding:0 !important; }',
    '#kdCekmece #header-nav-tabs > a:not([style*="display:none"]):not([style*="display: none"]){ display:flex !important; }',
    '#kdCekmece #header-nav-tabs > a, #kdCekmece .kc-oge{ position:relative; align-items:center !important;',
    '  justify-content:flex-start !important; gap:14px !important; width:100%; box-sizing:border-box; min-height:52px;',
    '  margin:0 !important; padding:7px 12px !important; border:0 !important; border-radius:14px !important;',
    '  background:transparent; color:#1F2937 !important; font:inherit; font-weight:700; font-size:1rem; line-height:1.25;',
    '  text-align:left; text-decoration:none !important; cursor:pointer; -webkit-tap-highlight-color:transparent;',
    '  transition:background .15s; }',
    '#kdCekmece .kc-oge{ display:flex; }',
    '#kdCekmece #header-nav-tabs > a:active, #kdCekmece .kc-oge:active{ background:#FFF4E5; }',
    '@media (hover:hover){ #kdCekmece #header-nav-tabs > a:hover, #kdCekmece .kc-oge:hover{ background:#FFF8EE; } }',
    '#kdCekmece #header-nav-tabs > a > svg, #kdCekmece .kc-simge{ flex:none; box-sizing:content-box; width:22px !important;',
    '  height:22px !important; padding:8px; border-radius:11px; background:#FFF1DE; color:#E67E22; stroke:currentColor; }',
    '#kdCekmece .kc-simge svg{ width:22px; height:22px; display:block; }',
    '#kdCekmece .kc-ad{ flex:1 1 auto; min-width:0; }',
    /* etkin sayfa: router.js sekmeye beyaz alt çizgi koyuyor → burada dolgu */
    '#kdCekmece #header-nav-tabs > a[style*="solid white"], #kdCekmece .kc-oge.etkin{ background:#FFF1DE;',
    '  color:#B45309 !important; box-shadow:inset 4px 0 0 #F39C12; }',
    '#kdCekmece #header-nav-tabs > a[style*="solid white"] > svg, #kdCekmece .kc-oge.etkin .kc-simge{ background:#F39C12; color:#fff; }',
    /* henüz açılmamış sekme (router.js soluk ve tıklanmaz yapıyor) */
    '#kdCekmece .kc-yakinda{ display:none; margin-left:auto; font-size:.62rem; font-weight:800; letter-spacing:.05em;',
    '  text-transform:uppercase; color:#8A5A00; background:#FFF6E3; border:1px solid #F0D79B; border-radius:999px; padding:3px 7px; }',
    '#kdCekmece #header-nav-tabs > a[style*="pointer-events: none"] .kc-yakinda{ display:inline-block; }',
    /* rozet ve yeşil nokta satırın sağına */
    '#kdCekmece #tab-istek-rozet{ position:static !important; margin-left:auto; box-shadow:none !important; }',
    '#kdCekmece #tab-tahta-nokta{ position:static !important; margin-left:auto; width:11px !important; height:11px !important; }',
    /* dil satırı */
    '#kdCekmece .kc-dil{ cursor:pointer; }',
    '#kdCekmece .kc-dil .kc-ad{ font-weight:700; }',
    '#kdCekmece #kdDilTus{ flex:none; margin-left:auto; background:#F1F5F9 !important; color:#0F2A43 !important;',
    '  border:1px solid #DDE3EA !important; padding:7px 11px 7px 8px !important; font-size:.88rem !important; }',
    '#kdCekmece #kdDilTus:active{ background:#E2E8F0 !important; }',
    /* çıkış */
    '#kdCekmece #logout-btn:not([style*="display:none"]):not([style*="display: none"]){ display:flex !important; }',
    '#kdCekmece #logout-btn{ align-items:center; justify-content:flex-start; gap:14px; width:100%; box-sizing:border-box;',
    '  min-height:50px; margin:0 !important; padding:7px 12px !important; border:1px solid #FDE2E2 !important;',
    '  border-radius:14px !important; background:#FEF5F5 !important; color:#B91C1C !important; box-shadow:none !important;',
    '  font:inherit; font-weight:800; font-size:1rem; text-align:left; transform:none !important; }',
    '#kdCekmece #logout-btn svg{ flex:none; box-sizing:content-box; width:20px !important; height:20px !important; padding:8px;',
    '  border-radius:11px; background:#FDE2E2; stroke:currentColor; }',
    /* ÇEKMECEDE CANLI SİMGELER (21.10.2026) — öğretmen: "mobildeki sidebardaki
       svg ler animasyonlu olsun". Yalnız çekmece açıkken; satırlar yukarıdan
       aşağı sırayla oynar (--kc-gec, ac() → simgeSirasi), 6 sn'de bir yinelenir. */
    '#kdCekmece #header-nav-tabs > a > svg, #kdCekmece .kc-simge svg, #kdCekmece #logout-btn svg{ overflow:visible; }',
    '#kdCekmece #header-nav-tabs > a > svg *, #kdCekmece .kc-simge svg *, #kdCekmece #logout-btn svg *{ transform-box:view-box; }',
    '#kdCekmeceKok #kdCekmece #tab-istekler > svg{ animation:none !important; }',
    '#kdCekmece .kc-ad small{ display:block; margin-top:2px; font-size:.76rem; font-weight:600; color:#8A94A3; line-height:1.25; }',
    '#kdCekmece #tab-tahta-bagla .kc-tarama{ stroke:#16A085; stroke-width:2.2; opacity:0; }',
    /* ev zıplar */
    '#kdCekmeceKok.acik .kc-ev .kc-simge svg{ transform-origin:50% 100%; animation:kcHop 6s var(--kc-gec,0s) ease-in-out infinite both; }',
    '@keyframes kcHop{ 0%,19%,100%{ transform:translateY(0) scale(1); } 5%{ transform:translateY(-3.5px) scale(1); }',
    '  9%{ transform:translateY(0) scale(1.08,.9); } 12.5%{ transform:translateY(-1px) scale(.98,1.02); } 15.5%{ transform:translateY(0) scale(1); } }',
    /* paket sallanır */
    '#kdCekmeceKok.acik #tab-paketler > svg > *{ transform-origin:50% 92%; animation:kcSalla 6s var(--kc-gec,0s) ease-in-out infinite both; }',
    '@keyframes kcSalla{ 0%,20%,100%{ transform:rotate(0); } 3.5%{ transform:rotate(-10deg); } 7.5%{ transform:rotate(9deg); }',
    '  11.5%{ transform:rotate(-6deg); } 15%{ transform:rotate(3deg); } 18%{ transform:rotate(-1deg); } }',
    /* kamera: mercek kapanıp açılır, gövde kımıldar */
    '#kdCekmeceKok.acik #tab-online-packages > svg > polygon{ transform-box:fill-box; transform-origin:0 50%;',
    '  animation:kcMercek 6s var(--kc-gec,0s) ease-in-out infinite both; }',
    '@keyframes kcMercek{ 0%,19%,100%{ transform:scaleX(1); } 5%{ transform:scaleX(.3); } 10%{ transform:scaleX(1.22); } 14%{ transform:scaleX(.9); } 17%{ transform:scaleX(1.04); } }',
    '#kdCekmeceKok.acik #tab-online-packages > svg > rect{ animation:kcGovde 6s var(--kc-gec,0s) ease-in-out infinite both; }',
    '@keyframes kcGovde{ 0%,19%,100%{ transform:translateX(0); } 6%{ transform:translateX(-1px); } 11%{ transform:translateX(.6px); } }',
    /* takvim: halkalar oynar, tik yeniden çizilir */
    '#kdCekmeceKok.acik #tab-booking > svg > polyline{ stroke-dasharray:13; animation:kcTik 6s var(--kc-gec,0s) ease-out infinite both; }',
    '@keyframes kcTik{ 0%{ stroke-dashoffset:0; } 1.5%{ stroke-dashoffset:13; } 15%,100%{ stroke-dashoffset:0; } }',
    '#kdCekmeceKok.acik #tab-booking > svg > line:nth-of-type(1), #kdCekmeceKok.acik #tab-booking > svg > line:nth-of-type(2){',
    '  animation:kcHalka 6s var(--kc-gec,0s) ease-in-out infinite both; }',
    '#kdCekmeceKok.acik #tab-booking > svg > line:nth-of-type(2){ animation-delay:calc(var(--kc-gec,0s) + .08s); }',
    '@keyframes kcHalka{ 0%,14%,100%{ transform:translateY(0); } 3.5%{ transform:translateY(-1.8px); } 7%{ transform:translateY(0); } }',
    /* Panelim: perde iner */
    '#kdCekmeceKok.acik #tab-teacher-panel > svg > path:nth-of-type(2){ transform-origin:50% 12.5%; animation:kcPerdeIn 6s var(--kc-gec,0s) ease-in-out infinite both; }',
    '@keyframes kcPerdeIn{ 0%,20%,100%{ transform:scaleY(1); } 6%{ transform:scaleY(.15); } 13%{ transform:scaleY(1.08); } 17%{ transform:scaleY(.98); } }',
    '#kdCekmeceKok.acik #tab-teacher-panel > svg > path:nth-of-type(3){ animation:kcAyak 6s var(--kc-gec,0s) ease-in-out infinite both; }',
    '@keyframes kcAyak{ 0%,20%,100%{ transform:translateY(0); } 6%{ transform:translateY(-1.2px); } 13%{ transform:translateY(.6px); } }',
    /* zil çalar, tokmak gecikmeli sallanır */
    '#kdCekmeceKok.acik #tab-istekler > svg > path:nth-of-type(1){ transform-origin:50% 8%; animation:kcZil 6s var(--kc-gec,0s) ease-in-out infinite both; }',
    '#kdCekmeceKok.acik #tab-istekler > svg > path:nth-of-type(2){ transform-origin:50% 8%; animation:kcTokmak 6s var(--kc-gec,0s) ease-in-out infinite both; }',
    '@keyframes kcZil{ 0%,21%,100%{ transform:rotate(0); } 3%{ transform:rotate(15deg); } 6.5%{ transform:rotate(-13deg); }',
    '  10%{ transform:rotate(9deg); } 13.5%{ transform:rotate(-6deg); } 17%{ transform:rotate(3deg); } }',
    '@keyframes kcTokmak{ 0%,21%,100%{ transform:rotate(0); } 4%{ transform:rotate(22deg); } 7.5%{ transform:rotate(-20deg); }',
    '  11%{ transform:rotate(13deg); } 14.5%{ transform:rotate(-8deg); } 18%{ transform:rotate(4deg); } }',
    /* karekod: tarama çizgisi iner-çıkar, çerçeve nefes alır */
    '#kdCekmeceKok.acik #tab-tahta-bagla > svg > .kc-tarama{ animation:kcTara 6s var(--kc-gec,0s) ease-in-out infinite both; }',
    '@keyframes kcTara{ 0%{ opacity:0; transform:translateY(-5px); } 2%{ opacity:1; transform:translateY(-5px); } 9%{ opacity:1; transform:translateY(5px); }',
    '  16%{ opacity:1; transform:translateY(-5px); } 18.5%,100%{ opacity:0; transform:translateY(-5px); } }',
    '#kdCekmeceKok.acik #tab-tahta-bagla > svg > path:first-child{ transform-origin:50% 50%; animation:kcCerceve 6s var(--kc-gec,0s) ease-in-out infinite both; }',
    '@keyframes kcCerceve{ 0%,18%,100%{ transform:scale(1); } 9%{ transform:scale(.9); } }',
    /* tahtaya yansıt: yayın dalgası yanıp söner */
    '#kdCekmeceKok.acik #tab-tahta > svg > path:nth-of-type(2){ animation:kcDalgaB 6s var(--kc-gec,0s) linear infinite both; }',
    '#kdCekmeceKok.acik #tab-tahta > svg > path:nth-of-type(3){ animation:kcDalgaA 6s var(--kc-gec,0s) linear infinite both; }',
    '@keyframes kcDalgaA{ 0%,15%,100%{ opacity:1; } 1.5%{ opacity:.12; } 4%{ opacity:1; } 8%{ opacity:.12; } 10.5%{ opacity:1; } }',
    '@keyframes kcDalgaB{ 0%,17%,100%{ opacity:1; } 1.5%{ opacity:.12; } 6%{ opacity:1; } 8%{ opacity:.12; } 12.5%{ opacity:1; } }',
    /* yönetici: dişli döner */
    '#kdCekmeceKok.acik #tab-admin-panel > svg > *{ transform-origin:50% 50%; animation:kcCark 6s var(--kc-gec,0s) cubic-bezier(.55,0,.3,1) infinite both; }',
    '@keyframes kcCark{ 0%{ transform:rotate(0); } 20%,100%{ transform:rotate(180deg); } }',
    /* dil: dünya döner (boylam çizgisi daralıp genişler) */
    '#kdCekmeceKok.acik .kc-dil .kc-simge svg .kc-meridyen{ transform-origin:50% 50%; animation:kcDunya 6s var(--kc-gec,0s) ease-in-out infinite both; }',
    '@keyframes kcDunya{ 0%,20%,100%{ transform:scaleX(1); } 5%{ transform:scaleX(.08); } 10%{ transform:scaleX(1); } 15%{ transform:scaleX(.08); } }',
    /* çıkış: ok kapıdan çıkar, yeniden gelir */
    '#kdCekmeceKok.acik #logout-btn svg polyline, #kdCekmeceKok.acik #logout-btn svg line{ animation:kcCik 6s var(--kc-gec,0s) ease-in-out infinite both; }',
    '@keyframes kcCik{ 0%,19%,100%{ transform:translateX(0); opacity:1; } 7%{ transform:translateX(3.5px); opacity:1; }',
    '  9.5%{ transform:translateX(5.5px); opacity:0; } 10.5%{ transform:translateX(-3px); opacity:0; } 15%{ transform:translateX(0); opacity:1; } }',
    /* kapalı («yakında») satırlar oynamaz */
    '#kdCekmece #header-nav-tabs > a[style*="pointer-events: none"] > svg, #kdCekmece #header-nav-tabs > a[style*="pointer-events: none"] > svg *,',
    '#kdCekmece #header-nav-tabs > a[style*="pointer-events:none"] > svg, #kdCekmece #header-nav-tabs > a[style*="pointer-events:none"] > svg *{ animation:none !important; }',
    '@media (prefers-reduced-motion:reduce){ #kdCekmece svg, #kdCekmece svg *{ animation:none !important; }',
    '  #kdCekmece #tab-tahta-bagla .kc-tarama{ opacity:0 !important; } }',
    '@media (prefers-reduced-motion:reduce){ #kdCekmece, #kdCekmeceKok .kc-perde{ transition:none !important; } }',
    'html.kd-cekmece-acik, html.kd-cekmece-acik body{ overflow:hidden !important; }',
    '@media print{ #kdCekmeceKok, #kdMenuTus{ display:none !important; } }'
  ].join('\n');

  var stil = yap('style');
  stil.id = 'kdYanMenuStil';
  stil.textContent = STIL;
  (document.head || document.documentElement).appendChild(stil);

  /* ------------------------------------------------------- menü tuşu */
  var sol = bas.querySelector(':scope > div') || bas.firstElementChild;
  var tus = yap('button');
  tus.type = 'button';
  tus.id = 'kdMenuTus';
  tus.setAttribute('aria-controls', 'kdCekmece');
  tus.setAttribute('aria-expanded', 'false');
  nitelik(tus, 'title', 'nav.ana_menu', 'Ana Menü');
  nitelik(tus, 'aria', 'nav.ana_menu', 'Ana Menü');
  tus.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">' +
    '<path d="M4 7h16M4 12h16M4 17h11"/></svg><span class="kc-isaret"></span>';
  if (sol) sol.insertBefore(tus, sol.firstChild);

  /* -------------------------------------------------------- çekmece */
  var kok = yap('div');
  kok.id = 'kdCekmeceKok';
  var perde = yap('div', 'kc-perde');
  var cek = yap('aside');
  cek.id = 'kdCekmece';
  cek.setAttribute('role', 'dialog');
  cek.setAttribute('aria-modal', 'true');
  cek.setAttribute('aria-hidden', 'true');
  nitelik(cek, 'aria', 'nav.ana_menu', 'Ana Menü');

  var ust = yap('div', 'kc-bas');
  var marka = yap('button', 'kc-marka');
  marka.type = 'button';
  var ad = $('brand-name');
  marka.textContent = ad ? ad.textContent : 'kidefarapca.com';
  var kapatTus = yap('button', 'kc-kapat',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>');
  kapatTus.type = 'button';
  nitelik(kapatTus, 'title', 'g.kapat', 'Kapat');
  nitelik(kapatTus, 'aria', 'g.kapat', 'Kapat');
  ust.appendChild(marka);
  ust.appendChild(kapatTus);

  var govde = yap('div', 'kc-govde');
  var ev = yap('button', 'kc-oge kc-ev');
  ev.type = 'button';
  ev.appendChild(yap('span', 'kc-simge',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>'));
  ev.appendChild(adSpan('nav.anasayfa', 'Ana sayfa'));
  var navYuva = yap('div', 'kc-yuva');
  var ayrac = yap('div', 'kc-ayrac');
  var dilSatir = yap('div', 'kc-oge kc-dil');
  dilSatir.appendChild(yap('span', 'kc-simge',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/>' +
    '<path class="kc-meridyen" d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>'));
  dilSatir.appendChild(adSpan('dil.baslik', 'Dil / Language'));
  dilSatir.hidden = true;                       /* dil düğmesi gelince açılır */
  govde.appendChild(ev);
  govde.appendChild(navYuva);
  govde.appendChild(ayrac);
  govde.appendChild(dilSatir);
  var alt = yap('div', 'kc-alt bos');

  cek.appendChild(ust);
  cek.appendChild(govde);
  cek.appendChild(alt);
  kok.appendChild(perde);
  kok.appendChild(cek);
  (document.body || document.documentElement).appendChild(kok);

  /* --------------------------------------------- taşıma ve geri koyma */
  var yer = {};                                 /* öğe → eski yerindeki işaret */
  function isaretKoy(ad, el) {
    if (yer[ad] || !el || !el.parentNode) return;
    yer[ad] = document.createComment('kd-yanmenu:' + ad);
    el.parentNode.insertBefore(yer[ad], el);
  }
  function geriKoy(ad, el) {
    var y = yer[ad];
    if (!y || !el || !y.parentNode) return;
    if (y.nextSibling !== el) y.parentNode.insertBefore(el, y.nextSibling);
  }

  function sekmeleriHazirla(nav) {
    var l = nav.children;
    for (var i = 0; i < l.length; i++) {
      var a = l[i];
      if (a.tagName !== 'A' || a.querySelector(':scope > .kc-ad')) continue;
      var k = a.getAttribute('data-i18n-title') || '';
      var tr = ADLAR[k] || a.getAttribute('aria-label') || a.title || '';
      var s = adSpan(k || 'x', tr);
      if (!k) { s.removeAttribute('data-i18n'); s.removeAttribute('data-i18n-tr'); }
      var svg = a.querySelector(':scope > svg');
      if (svg && svg.nextSibling) a.insertBefore(s, svg.nextSibling); else a.appendChild(s);
      var y = adSpan('dil.yakinda', 'yakında');
      y.className = 'kc-yakinda';
      a.insertBefore(y, s.nextSibling);
    }
  }
  function cikisHazirla(b) {
    if (b.querySelector('.kc-ad')) return;
    b.appendChild(adSpan('g.cikis', 'Çıkış Yap'));
  }

  var mobil = false;
  function yerlestir() {
    var nav = $('header-nav-tabs'), dil = $('kdDilTus'), cikis = $('logout-btn');
    if (mobil) {
      if (nav && nav.parentNode !== navYuva) { isaretKoy('nav', nav); sekmeleriHazirla(nav); navYuva.appendChild(nav); }
      if (dil && dil.parentNode !== dilSatir) { isaretKoy('dil', dil); dilSatir.appendChild(dil); }
      if (cikis && cikis.parentNode !== alt) { isaretKoy('cikis', cikis); cikisHazirla(cikis); alt.appendChild(cikis); }
    } else {
      geriKoy('nav', nav); geriKoy('dil', dil); geriKoy('cikis', cikis);
    }
    dilSatir.hidden = !(dil && dil.parentNode === dilSatir);
    ayrac.hidden = dilSatir.hidden;
    altTazele();
    isaretTazele();
  }
  function altTazele() {
    var c = $('logout-btn');
    var gor = !!(c && c.parentNode === alt && c.style.display !== 'none');
    alt.classList.toggle('bos', !gor);
  }
  /* menü tuşunda yeşil nokta: içeride bekleyen istek ya da canlı tahta */
  function isaretTazele() {
    var r = $('tab-istek-rozet'), n = $('tab-tahta-nokta'), z = $('tab-istekler');
    var var_ = !!((r && r.style.display !== 'none' && (r.textContent || '').trim() && z && z.style.display !== 'none') ||
                  (n && n.style.display === 'block'));
    tus.classList.toggle('var', mobil && var_);
  }

  /* ------------------------------------------------------ aç / kapat */
  var acik = false, sonOdak = null;
  /* simgeler yukarıdan aşağı sırayla oynasın: görünen (ve kapalı olmayan)
     satırların gecikmesi her açılışta yeniden yazılır */
  var siraStil = null;
  function simgeSirasi() {
    try {
      if (!siraStil) { siraStil = yap('style'); siraStil.id = 'kdYanMenuSira'; (document.head || document.documentElement).appendChild(siraStil); }
      var l = [ev], nav = $('header-nav-tabs'), c = $('logout-btn');
      if (nav && nav.parentNode === navYuva) [].forEach.call(nav.children, function (a) { if (a.tagName === 'A') l.push(a); });
      l.push(dilSatir);
      if (c && c.parentNode === alt) l.push(c);
      var css = '', i = 0;
      l.forEach(function (e) {
        if (!e || e.hidden || !e.getClientRects().length) return;
        if (/pointer-events:\s*none/.test(e.getAttribute('style') || '')) return;
        var sec = e === ev ? '.kc-ev' : (e === dilSatir ? '.kc-dil' : (e.id ? '#' + e.id : ''));
        if (!sec) return;
        css += '#kdCekmece ' + sec + '{ --kc-gec:' + (0.3 + (i++ % 12) * 0.42).toFixed(2) + 's; }\n';
      });
      siraStil.textContent = css;
    } catch (e) { }
  }
  function etkinTazele() {
    var h1 = bas.querySelector('h1');
    ev.classList.toggle('etkin', !!(h1 && h1.classList.contains('home-active')));
  }
  function ac() {
    if (acik || !mobil) return;
    acik = true;
    etkinTazele();
    altTazele();
    sonOdak = document.activeElement;
    simgeSirasi();
    kok.classList.add('acik');
    cek.setAttribute('aria-hidden', 'false');
    tus.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('kd-cekmece-acik');
    setTimeout(function () { try { kapatTus.focus({ preventScroll: true }); } catch (e) { } }, 60);
  }
  function kapat(sert) {
    if (!acik) return;
    acik = false;
    if (sert) { kok.classList.add('kc-sert'); setTimeout(function () { kok.classList.remove('kc-sert'); }, 50); }
    kok.classList.remove('acik');
    cek.setAttribute('aria-hidden', 'true');
    tus.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('kd-cekmece-acik');
    if (sonOdak && sonOdak === tus) { try { tus.focus({ preventScroll: true }); } catch (e) { } }
    sonOdak = null;
  }

  tus.addEventListener('click', function (e) { e.preventDefault(); if (acik) kapat(); else ac(); });
  perde.addEventListener('click', function () { kapat(); });
  kapatTus.addEventListener('click', function () { kapat(); });
  marka.addEventListener('click', function () {
    kapat();
    try { if (typeof window.changeView === 'function') window.changeView('home-hub-section'); } catch (e) { }
  });
  ev.addEventListener('click', function () {
    kapat();
    try { if (typeof window.changeView === 'function') window.changeView('home-hub-section'); } catch (e) { }
  });
  dilSatir.addEventListener('click', function (e) {
    var d = $('kdDilTus');
    if (d && !d.contains(e.target)) d.click();
  });
  /* çekmecedeki herhangi bir sekmeye / düğmeye basılınca: önce onun işi
     yapılır (kendi onclick'i), sonra çekmece kapanır */
  govde.addEventListener('click', function (e) {
    var o = e.target && e.target.closest ? e.target.closest('a, button') : null;
    if (o && govde.contains(o)) setTimeout(function () { kapat(); }, 0);
  });
  alt.addEventListener('click', function (e) {
    var o = e.target && e.target.closest ? e.target.closest('button') : null;
    if (o) setTimeout(function () { kapat(); }, 0);
  });
  document.addEventListener('keydown', function (e) {
    if (acik && (e.key === 'Escape' || e.key === 'Esc')) { e.stopPropagation(); kapat(); }
  }, true);
  /* sola kaydırınca kapanır */
  (function () {
    var x0 = null, y0 = 0;
    cek.addEventListener('touchstart', function (e) {
      var t = e.touches && e.touches[0]; if (!t) return; x0 = t.clientX; y0 = t.clientY;
    }, { passive: true });
    cek.addEventListener('touchmove', function (e) {
      if (x0 == null) return;
      var t = e.touches && e.touches[0]; if (!t) return;
      var dx = t.clientX - x0, dy = t.clientY - y0;
      if (dx < -60 && Math.abs(dx) > Math.abs(dy) * 1.4) { x0 = null; kapat(); }
    }, { passive: true });
    cek.addEventListener('touchend', function () { x0 = null; }, { passive: true });
  })();

  /* ---------------------------------------------------- kip değişimi */
  function kipUygula() {
    var yeni = !!mq.matches;
    if (yeni === mobil && document.documentElement.classList.contains('kd-yanmenu') === yeni) { yerlestir(); return; }
    mobil = yeni;
    if (!mobil) kapat(true);
    document.documentElement.classList.toggle('kd-yanmenu', mobil);
    yerlestir();
    /* başlık boyu değişti: kategori başlıklarının üst boşluğu tazelensin */
    try { document.documentElement.style.setProperty('--header-height', bas.offsetHeight + 'px'); } catch (e) { }
  }
  if (mq.addEventListener) mq.addEventListener('change', kipUygula);
  else if (mq.addListener) mq.addListener(kipUygula);
  kipUygula();

  /* dil düğmesini sistem/dil.js sonradan koyuyor; çıkış ve rozetler de
     oturum açılınca değişiyor → izlenip yerine taşınır */
  if (window.MutationObserver) {
    var kontrol = bas.querySelector('.user-controls');
    if (kontrol) new MutationObserver(function () { if (mobil) yerlestir(); }).observe(kontrol, { childList: true });
    new MutationObserver(function () { altTazele(); isaretTazele(); })
      .observe(kok, { subtree: true, attributes: true, attributeFilter: ['style'], childList: true, characterData: true });
  }
  document.addEventListener('DOMContentLoaded', function () { yerlestir(); });
  window.addEventListener('load', function () { yerlestir(); });

  window.KidefYanMenu = { ac: ac, kapat: kapat, mobil: function () { return mobil; } };
})();
