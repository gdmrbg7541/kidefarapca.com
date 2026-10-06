/* =====================================================================
   KİDEF · SEKME SİMGELERİ — DEĞİŞEN ANİMASYONLAR  (sistem/sekmeanim.js)
   ---------------------------------------------------------------------
   Öğretmen (06.10.2026): "listede neler varsa, sınıf defterinde neler
   varsa, materyallerde ve sınıf araçlarında değişen svg animasyonlarla
   içeriğin dikkati çekilsin... daha büyük olsunlar."

   FİKİR: her sekmenin simgesi TEK bir resim değil, o sekmenin İÇİNDE NE
   OLDUĞUNU sırayla gösteren küçük sahneler. Öğretmen çubuğa baktığında
   "burada ne var" sorusunun cevabını simgenin kendisinden alıyor:

     Öğrenciler    → sınıf listesi · yoklama · notlar
     Sınıf Defteri → açık defter · hafta çizelgesi · işlendi kutusu
     Sınıf Araçları→ kronometre · kum saati · takım zarı
     Materyaller   → belge · etkinlik kartları · kitap

   Sahneler 3,4 sn'de bir yumuşak geçişle değişiyor; her sekme farklı
   anda başlıyor (hepsi aynı anda kıpırdayınca çubuk huzursuz oluyor).
   Sahnelerin içinde de küçük hareketler var (kalem yazar, kum akar,
   zar döner) — duran bir resim değil.

   HAREKET İSTEMEYENE: prefers-reduced-motion açıksa sahne değişmez,
   iç hareketler durur; ilk sahne sabit kalır.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefSekmeAnim) return;

    var SURE = 3400;          /* bir sahnenin ekranda kalma süresi */
    var GECIS = 320;          /* solma süresi (css ile aynı) */

    function sakin() {
        try {
            return window.matchMedia &&
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch (e) { return false; }
    }

    /* ---------------------------------------------------- SAHNELER
       Hepsi 24x24. Renkler sitenin kendi paletinden. */
    var S = {};

    /* ---- ÖĞRENCİLER: liste · yoklama · not ---- */
    S.liste = [
        /* sınıf listesi: satırlar sırayla belirir */
        '<rect x="3" y="4" width="18" height="16" rx="2.4" fill="#fff" stroke="#8A93A0" stroke-width="1.3"/>' +
        '<circle cx="7.2" cy="8.4" r="1.3" fill="#3498db"/>' +
        '<rect class="sa-y1" x="10" y="7.6" width="8" height="1.6" rx=".8" fill="#C7D0DA"/>' +
        '<circle cx="7.2" cy="12.4" r="1.3" fill="#16A085"/>' +
        '<rect class="sa-y2" x="10" y="11.6" width="8" height="1.6" rx=".8" fill="#C7D0DA"/>' +
        '<circle cx="7.2" cy="16.4" r="1.3" fill="#E67E22"/>' +
        '<rect class="sa-y3" x="10" y="15.6" width="6" height="1.6" rx=".8" fill="#C7D0DA"/>',
        /* yoklama: kişi + onay */
        '<circle cx="10" cy="8.4" r="3.4" fill="#3498db"/>' +
        '<path d="M3.6 19.4c0-3.6 2.9-5.6 6.4-5.6s6.4 2 6.4 5.6z" fill="#5DADE2"/>' +
        '<circle class="sa-nabiz" cx="17.6" cy="16.6" r="4.6" fill="#16A085"/>' +
        '<path d="M15.4 16.6l1.6 1.7 3.2-3.4" fill="none" stroke="#fff" stroke-width="1.7"' +
        ' stroke-linecap="round" stroke-linejoin="round"/>',
        /* notlar: yıldız + çizelge */
        '<rect x="3" y="5" width="18" height="14" rx="2.2" fill="#FFF6EC" stroke="#E0B37A" stroke-width="1.3"/>' +
        '<path class="sa-don" d="M12 7.4l1.5 3.1 3.4.5-2.5 2.4.6 3.4-3-1.6-3 1.6.6-3.4-2.5-2.4 3.4-.5z"' +
        ' fill="#F39C12"/>'
    ];

    /* ---- SINIF DEFTERİ: açık defter · hafta çizelgesi · işlendi ---- */
    S.defter = [
        /* açık defter, kalem yazıyor */
        '<path d="M3 6.2c2.6-1.4 5.4-1.4 8 0v12c-2.6-1.4-5.4-1.4-8 0z" fill="#fff" stroke="#8A93A0" stroke-width="1.2"/>' +
        '<path d="M21 6.2c-2.6-1.4-5.4-1.4-8 0v12c2.6-1.4 5.4-1.4 8 0z" fill="#fff" stroke="#8A93A0" stroke-width="1.2"/>' +
        '<path d="M5 9.4h4M5 12h4M5 14.6h3" stroke="#C7D0DA" stroke-width="1.1" stroke-linecap="round"/>' +
        '<path class="sa-yaz" d="M15 9.6h4M15 12.2h4M15 14.8h2.6" stroke="#16A085" stroke-width="1.2" stroke-linecap="round"/>',
        /* 36 hafta: ızgara, bir kare yanıp söner */
        '<rect x="3" y="4.6" width="18" height="15" rx="2.2" fill="#fff" stroke="#8A93A0" stroke-width="1.3"/>' +
        '<rect x="3" y="4.6" width="18" height="3.6" rx="2.2" fill="#D84315"/>' +
        '<g fill="#C7D0DA">' +
        '<rect x="5.4" y="10" width="3.2" height="2.6" rx=".7"/>' +
        '<rect x="10.4" y="10" width="3.2" height="2.6" rx=".7"/>' +
        '<rect x="15.4" y="10" width="3.2" height="2.6" rx=".7"/>' +
        '<rect x="5.4" y="14.2" width="3.2" height="2.6" rx=".7"/>' +
        '<rect x="15.4" y="14.2" width="3.2" height="2.6" rx=".7"/></g>' +
        '<rect class="sa-nabiz" x="10.4" y="14.2" width="3.2" height="2.6" rx=".7" fill="#16A085"/>',
        /* işlendi kutusu */
        '<rect x="4" y="4.4" width="16" height="15.2" rx="2.4" fill="#fff" stroke="#8A93A0" stroke-width="1.3"/>' +
        '<path d="M7 8.6h10M7 11.4h7" stroke="#C7D0DA" stroke-width="1.2" stroke-linecap="round"/>' +
        '<rect x="6.6" y="14" width="4.4" height="4.4" rx="1" fill="#fff" stroke="#16A085" stroke-width="1.5"/>' +
        '<path class="sa-ciz" d="M7.6 16.2l1.4 1.5 2.8-3.1" fill="none" stroke="#16A085" stroke-width="1.7"' +
        ' stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M13 15.4h5" stroke="#C7D0DA" stroke-width="1.2" stroke-linecap="round"/>'
    ];

    /* ---- SINIF ARAÇLARI: kronometre · kum saati · zar ---- */
    S.arac = [
        /* kronometre, ibre döner */
        '<path d="M9.6 2.8h4.8" stroke="#1F2430" stroke-width="1.7" stroke-linecap="round"/>' +
        '<circle cx="12" cy="13.4" r="7.6" fill="#fff" stroke="#D84315" stroke-width="1.6"/>' +
        '<path class="sa-ibre" d="M12 13.4V8.6" stroke="#D84315" stroke-width="1.7" stroke-linecap="round"/>' +
        '<circle cx="12" cy="13.4" r="1.2" fill="#D84315"/>',
        /* kum saati, kum akar */
        '<path d="M6.6 3.4h10.8M6.6 20.6h10.8" stroke="#1F2430" stroke-width="1.7" stroke-linecap="round"/>' +
        '<path d="M8 3.6h8c0 4-3.2 5.6-3.2 8.4S16 16.4 16 20.4H8c0-4 3.2-5.6 3.2-8.4S8 7.6 8 3.6z"' +
        ' fill="#FDF2E2" stroke="#E67E22" stroke-width="1.4" stroke-linejoin="round"/>' +
        '<path d="M9.4 5.2h5.2c0 2-2 3.4-2 4.8h-1.2c0-1.4-2-2.8-2-4.8z" fill="#F39C12"/>' +
        '<circle class="sa-kum" cx="12" cy="12.6" r=".9" fill="#F39C12"/>',
        /* takım zarı, döner */
        '<rect class="sa-don" x="4.4" y="4.4" width="15.2" height="15.2" rx="3.4" fill="#16A085"/>' +
        '<g fill="#fff"><circle cx="8.6" cy="8.6" r="1.5"/><circle cx="15.4" cy="8.6" r="1.5"/>' +
        '<circle cx="12" cy="12" r="1.5"/><circle cx="8.6" cy="15.4" r="1.5"/>' +
        '<circle cx="15.4" cy="15.4" r="1.5"/></g>'
    ];

    /* ---- MATERYALLER: belge · etkinlik kartları · kitap ---- */
    S.materyal = [
        /* belge (pdf), köşesi kıvrık */
        '<path d="M6 3.2h8.2L19 8v12.8H6z" fill="#fff" stroke="#8A93A0" stroke-width="1.3" stroke-linejoin="round"/>' +
        '<path d="M14.2 3.2V8H19" fill="none" stroke="#8A93A0" stroke-width="1.3" stroke-linejoin="round"/>' +
        '<path class="sa-yaz" d="M8.4 11.6h8.2M8.4 14.2h8.2M8.4 16.8h5.4" stroke="#D84315"' +
        ' stroke-width="1.3" stroke-linecap="round"/>',
        /* etkinlik kartları, üstteki hafif kalkar */
        '<rect x="3.2" y="7.6" width="12.4" height="12.4" rx="2.4" fill="#EAF6F3" stroke="#16A085" stroke-width="1.3"/>' +
        '<rect class="sa-kalk" x="8.4" y="4" width="12.4" height="12.4" rx="2.4" fill="#fff" stroke="#E67E22" stroke-width="1.4"/>' +
        '<path d="M11.4 8.4h6.4M11.4 11h6.4M11.4 13.6h4" stroke="#F0B27A" stroke-width="1.2" stroke-linecap="round"/>',
        /* dolu klasör: içinden kâğıtlar görünüyor (eski Materyaller
           simgesi de sarı klasördü — süreklilik). Sınıf Defteri'nin
           açık kitabıyla karışmasın diye kitap sahnesi buradan çıkarıldı. */
        '<path d="M8.6 5.4h7.4v5.2H8.6z" fill="#fff" stroke="#C7D0DA" stroke-width="1.1"/>' +
        '<path class="sa-kalk" d="M6.8 7h7.4v4.6H6.8z" fill="#fff" stroke="#C7D0DA" stroke-width="1.1"/>' +
        '<path d="M3 7.4h6.2l1.6 2h9.2a1.4 1.4 0 0 1 1.4 1.4v8a1.4 1.4 0 0 1-1.4 1.4H3a1.4 1.4 0 0 1-1.4-1.4V8.8A1.4 1.4 0 0 1 3 7.4z"' +
        ' fill="#F5B041" stroke="#D68910" stroke-width="1.1" stroke-linejoin="round"/>' +
        '<path class="sa-nabiz" d="M6.6 13.4h8.4M6.6 16h5.8" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>'
    ];

    /* Rozetteki okul: anasayfadaki Sınıflarım kategorisiyle ve okul
       penceresindeki binayla aynı dil — kırmızı çatı, yeşil kapı. */
    var OKUL_SVG =
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M12 2.2l9.4 5.2v1.4H2.6V7.4z" fill="#D84315"/>' +
        '<rect x="4.4" y="8.8" width="15.2" height="12.6" rx="1.4" fill="#fff"' +
        ' stroke="#C7D0DA" stroke-width="1.1"/>' +
        '<rect x="6.6" y="11" width="3.4" height="3" rx=".7" fill="#FDEBD0"' +
        ' stroke="#E0B37A" stroke-width=".9"/>' +
        '<rect x="14" y="11" width="3.4" height="3" rx=".7" fill="#FDEBD0"' +
        ' stroke="#E0B37A" stroke-width=".9"/>' +
        '<rect x="9.6" y="15.4" width="4.8" height="6" rx=".8" fill="#16A085"/>' +
        '<circle cx="13.2" cy="18.4" r=".55" fill="#fff"/>' +
        '</svg>';

    /* Okulun yanındaki küçük ok (06.10.2026 — öğretmen: "bi sınıf listesi
       açıkken okul svg sine basınca diğer sınıflara ulaşabiliyoruz ya,
       bunu simgelemek için okul svg sinin yanında bi ok olsun").
       Okul "nereye gidileceğini", ok "burada açılacak bir şey olduğunu"
       söylüyor. */
    var OK_SVG =
        '<svg class="rz-okcuk" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M6 9.5l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.6"' +
        ' stroke-linecap="round" stroke-linejoin="round"/></svg>';

    /* ---------------------------------------------------------- BİÇİM */
    function stilKur() {
        if (document.getElementById('saStil')) return;
        var s = document.createElement('style');
        s.id = 'saStil';
        s.textContent = [
            /* ---- BAŞLIKLAR GERİ GELDİ (06.10.2026) ----------------------
               Öğretmen: "liste satırındaki 4 kısmın da başlığı yazsın ...
               yazılar svg lerin sağında olsun ve büyük olsunlar ... aralarda
               dikey ayırıcılar olsun."
               Başlıklar bir ara gizlenmişti (listelerim.css: "SEKME CUBUGU:
               YALNIZ SIMGE") çünkü dar ekranda yazılar alta kayıp çubuğu iki
               satıra çıkarıyordu. O sebep burada başka türlü çözüldü: çubuk
               artık ALT SATIRA GEÇMİYOR, dar ekranda yatay kayıyor. */
            '#ll-root #content .tabs{ flex-wrap:nowrap; overflow-x:auto;',
            '  -webkit-overflow-scrolling:touch; scrollbar-width:thin; }',
            '#ll-root #content .tabs{ gap:14px; }',   /* ayırıcıya yer açsın */
            '#ll-root #content .tabs .tab{ flex:0 0 auto;',
            '  display:inline-flex; flex-direction:row; align-items:center; gap:12px;',
            '  padding:9px 15px; }',
            '#ll-root #content .tabs .tab > span{ display:inline; font-size:1.04rem;',
            '  font-weight:600; line-height:1.15; white-space:nowrap; }',
            '@media (max-width:620px){',
            '  #ll-root #content .tabs .tab{ gap:7px; padding:8px 11px; }',
            '  #ll-root #content .tabs .tab > span{ font-size:.94rem; } }',
            /* ayırıcılar: boşluğun ortasına ince dikey çizgi. Düğmenin
               kendisine kenarlık vermek yerine sözde öğe — seçili sekmenin
               turuncu zeminine çizgi bulaşmasın. */
            '#ll-root #content .tabs > * + *{ position:relative; }',
            '#ll-root #content .tabs > * + *::before{ content:""; position:absolute;',
            '  left:-8px; top:14%; bottom:14%; width:2px; border-radius:1px;',
            '  background:#D7DEE7; pointer-events:none; }',
            '@media (max-width:620px){',
            '  #ll-root #content .tabs{ gap:11px; }',
            '  #ll-root #content .tabs > * + *::before{ left:-6px; width:1px; } }',
            /* simgeler büyüsün (öğretmen: "daha büyük olsunlar") */
            '#ll-root #content .tabs .tab .tab-ikon{ width:34px; height:34px; flex:0 0 auto; }',
            '@media (max-width:620px){ #ll-root #content .tabs .tab .tab-ikon{ width:28px; height:28px; } }',
            '#ll-root #content .tabs .tab .tab-ikon{ transition:opacity .32s ease, transform .32s ease; }',
            '#ll-root #content .tabs .tab .tab-ikon.sa-sol{ opacity:0; transform:scale(.86) rotate(-6deg); }',
            /* ---- ROZET = "SINIF LİSTESİ" ----------------------------------
               Rozet öbür sekmelerle aynı dili konuşsun: simge · başlık ·
               açık sınıfın adı · sınıf sayısı · ok. */
            '#ll-root #content .tabs #active-class-title .rz-ik{',
            '  width:34px; height:34px; flex:0 0 auto;',
            '  transition:opacity .32s ease, transform .32s ease; }',
            '@media (max-width:620px){',
            '  #ll-root #content .tabs #active-class-title .rz-ik{ width:28px; height:28px; } }',
            '#ll-root #content .tabs #active-class-title .rz-ik.sa-sol{ opacity:0; transform:scale(.86); }',
            '#ll-root #content .tabs #active-class-title{ gap:12px; }',
            /* ROZETİN İÇİNDEKİ AYIRICI (06.10.2026) — öğretmen: "diğer
               sınıfların açılma kısmı ile sınıf listesinin açıldığı yer
               arasında ayırıcı olsun ama şık olsun".
               Rozet tek bir tuş gibi görünüyor ama iki ayrı iş yapıyor:
                 sol  → başka sınıfa geç (llSinifListesiAc) — ok
                 sağ  → bu sınıfın öğrenci listesi (switchTab 0)
               Düz bir çizgi rozeti ikiye bölüp sertleştiriyordu; çizgi
               uçlarda saydama eriyor — ayırıyor ama kesmiyor. */
            '#ll-root #content .tabs #active-class-title .rz-ayr{',
            '  flex:0 0 auto; width:1px; align-self:stretch; margin:3px 0; border-radius:1px;',
            /* RENGİ YAZIDAN ALIYOR (currentColor): rozet kimi durumda beyaz
               zeminli, kimi durumda turuncu dolgulu. Sabit bir renk birinde
               görünmez oluyordu. Uçlardaki erime maskeyle — böylece renk tek
               yerde kalıyor. Maskeyi desteklemeyen tarayıcıda düz ince çizgi
               olarak kalır, yine iş görür. */
            '  background:currentColor; opacity:.24;',
            '  -webkit-mask-image:linear-gradient(to bottom, transparent 0%, #000 26%,',
            '    #000 74%, transparent 100%);',
            '  mask-image:linear-gradient(to bottom, transparent 0%, #000 26%,',
            '    #000 74%, transparent 100%); }',
            /* Ok SOLDA (06.10.2026 — öğretmen: "diğer sınıfları açtığımız
               oku sola alalım"): rozet soldan sağa "başka sınıf ▾ │ bu
               sınıfın listesi" diye okunuyor. Sınıf SAYISI kaldırıldı
               (öğretmen: "kaç sınıf olduğunu gösteren sınıf rakamı
               olmasın") — okun kendisi zaten başka sınıf olduğunu söylüyor. */
            '#ll-root #content .tabs #active-class-title .rz-say{ display:none !important; }',
            /* OKUL SİMGESİ (06.10.2026) — öğretmen: "liste açıkken diğer
               sınıfları açmak için bastığımız ok yerine okul svg si olsun,
               sınıflar okul svg si içinden seçilerek açılsın, yani
               görselleştirelim". Ok yerine okul: basınca okul penceresi
               kendi sekmesinde açılıyor, sınıflar binanın kapılarından
               seçiliyor. */
            /* Tuşun kendisi 26x26 sabitti (küçük ok için yapılmıştı) ve okul
               çizimini yanlardan eziyordu: yükseklik 28'e çıkıyor ama genişlik
               16'da kalıyordu. Ölçü artık içeriğe göre. */
            '#ll-root #content .tabs #active-class-title .rz-ok{',
            '  width:auto !important; height:auto !important; padding:4px 4px 4px 5px;',
            '  display:inline-flex; align-items:center; gap:1px; }',
            '#ll-root #content .tabs #active-class-title .rz-ok svg{',
            '  flex:0 0 auto; width:28px !important; height:28px !important; }',
            /* okulun yanındaki küçük ok: okuldan belirgin biçimde küçük,
               rengini yazıdan alıyor, biraz soluk — okul öne çıksın. */
            '#ll-root #content .tabs #active-class-title .rz-ok .rz-okcuk{',
            '  width:14px !important; height:14px !important; opacity:.6;',
            '  transition:transform .15s ease, opacity .15s ease; }',
            '#ll-root #content .tabs #active-class-title .rz-ok:hover .rz-okcuk{',
            '  opacity:1; transform:translateY(1.5px); }',
            '@media (max-width:620px){',
            '  #ll-root #content .tabs #active-class-title .rz-ok .rz-okcuk{',
            '    width:12px !important; height:12px !important; } }',
            /* pencere açıkken ok yukarı dönsün (okul yerinde kalır) */
            '#ll-root #content .tabs #active-class-title.acik .rz-ok .rz-okcuk{',
            '  transform:rotate(180deg); opacity:1; }',
            '@media (max-width:620px){',
            '  #ll-root #content .tabs #active-class-title .rz-ok svg{',
            '    width:24px !important; height:24px !important; } }',
            /* ok değil artık: açılınca dönmesin */
            '#ll-root #content .tabs #active-class-title.acik .rz-ok{ transform:none; }',
            '#ll-root #content .tabs #active-class-title .rz-bas{ font-size:1.04rem;',
            '  font-weight:600; line-height:1.15; white-space:nowrap; }',
            '@media (max-width:620px){',
            '  #ll-root #content .tabs #active-class-title .rz-bas{ font-size:.94rem; } }',
            /* açık sınıfın adı başlıktan ayrılsın: ince çizgiyle ve kendi
               zeminiyle "seçili olan bu" desin. */
            '#ll-root #content .tabs #active-class-title .rz-ad{',
            '  padding:2px 9px; border-radius:8px; font-weight:800;',
            '  background:rgba(107,74,56,.10); }',
            '#ll-root #content .tabs #active-class-title.aktif .rz-ad{',
            '  background:rgba(255,255,255,.22); }',
            /* sahne içi küçük hareketler */
            '@keyframes saNabiz{ 0%,100%{ opacity:1 } 50%{ opacity:.35 } }',
            '.sa-nabiz{ animation:saNabiz 1.5s ease-in-out infinite; }',
            '@keyframes saIbre{ from{ transform:rotate(0) } to{ transform:rotate(360deg) } }',
            '.sa-ibre{ transform-box:view-box; transform-origin:12px 13.4px;',
            '  animation:saIbre 2.6s linear infinite; }',
            '@keyframes saKum{ 0%{ transform:translateY(-2px); opacity:0 }',
            '  40%{ opacity:1 } 100%{ transform:translateY(5px); opacity:0 } }',
            '.sa-kum{ transform-box:view-box; animation:saKum 1.1s linear infinite; }',
            '@keyframes saDon{ 0%,70%,100%{ transform:rotate(0) } 80%{ transform:rotate(-12deg) }',
            '  90%{ transform:rotate(10deg) } }',
            '.sa-don{ transform-box:view-box; transform-origin:12px 12px;',
            '  animation:saDon 3s ease-in-out infinite; }',
            '@keyframes saKalk{ 0%,100%{ transform:translate(0,0) } 50%{ transform:translate(.8px,-1.4px) } }',
            '.sa-kalk{ transform-box:view-box; animation:saKalk 2.2s ease-in-out infinite; }',
            '@keyframes saYaz{ from{ stroke-dashoffset:26 } to{ stroke-dashoffset:0 } }',
            '.sa-yaz{ stroke-dasharray:26; animation:saYaz 1.6s ease-out forwards; }',
            '@keyframes saCiz{ from{ stroke-dashoffset:9 } to{ stroke-dashoffset:0 } }',
            '.sa-ciz{ stroke-dasharray:9; animation:saCiz .7s ease-out forwards; }',
            '@keyframes saSatir{ from{ width:0 } }',
            '.sa-y1{ animation:saSatir .5s ease-out }',
            '.sa-y2{ animation:saSatir .5s .18s ease-out backwards }',
            '.sa-y3{ animation:saSatir .5s .36s ease-out backwards }',
            '@media (prefers-reduced-motion: reduce){',
            '  .sa-nabiz,.sa-ibre,.sa-kum,.sa-don,.sa-kalk,.sa-yaz,.sa-ciz,',
            '  .sa-y1,.sa-y2,.sa-y3{ animation:none !important }',
            '  #ll-root #content .tabs .tab .tab-ikon,',
            '  #ll-root #content .tabs #active-class-title .rz-ik{ transition:none !important }',
            '}'
        ].join('\n');
        document.head.appendChild(s);
    }

    /* ------------------------------------------------------- MOTOR */
    function sahneKur(svg, dizi, i) {
        if (!svg) return;
        svg.innerHTML = dizi[i % dizi.length];
    }

    function dongu(svg, dizi, gecikme) {
        sahneKur(svg, dizi, 0);
        if (sakin()) return;
        var i = 0;
        setTimeout(function () {
            setInterval(function () {
                /* sekme görünmüyorsa boşuna çizme */
                if (document.hidden) return;
                svg.classList.add('sa-sol');
                setTimeout(function () {
                    i++;
                    sahneKur(svg, dizi, i);
                    svg.classList.remove('sa-sol');
                }, GECIS);
            }, SURE);
        }, gecikme);
    }

    function tusBul(no) {
        return document.querySelector('#ll-root #content .tabs .tab[onclick*="switchTab(' + no + ')"]');
    }

    var kuruldu = false;
    function kur() {
        if (kuruldu) return;
        var cubuk = document.querySelector('#ll-root #content .tabs');
        if (!cubuk) return;
        stilKur();

        var esle = [[12, S.defter, 0], [4, S.arac, 900], [13, S.materyal, 1800]];
        var bulunan = 0;
        esle.forEach(function (e) {
            var t = tusBul(e[0]);
            if (!t) return;
            var svg = t.querySelector('.tab-ikon');
            if (!svg) return;
            svg.removeAttribute('class');
            svg.setAttribute('class', 'lli tab-ikon');
            svg.setAttribute('viewBox', '0 0 24 24');
            dongu(svg, e[1], e[2]);
            bulunan++;
        });
        if (bulunan) kuruldu = true;
    }

    /* Rozet ("Sınıf Listesi" sekmesi) her sınıf değişiminde listelerim.js
       tarafından baştan çizildiği için ayrı izleniyor: simgesi ve başlığı
       her çizimden sonra yeniden konuyor (aşağıda MutationObserver). */
    function rozetKur() {
        var r = document.getElementById('active-class-title');
        if (!r || r.__saKuruldu) return;
        var ad = r.querySelector('.rz-ad');
        if (!ad) return;
        stilKur();
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'rz-ik');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        r.insertBefore(svg, ad);
        /* Başlık simgenin sağında, sınıf adından önce: "Sınıf Listesi 5/A" */
        var bas = document.createElement('span');
        bas.className = 'rz-bas';
        bas.textContent = 'Sınıf Listesi';
        r.insertBefore(bas, ad);
        rozetAyir(r);
        r.__saKuruldu = 1;
        dongu(svg, S.liste, 450);
    }

    /* Oku okul simgesine çevir: artık "aşağı açılır liste" değil, "okuluma
       gir" demek. Tıklayınca okul penceresi kendi sekmesinde açılıyor;
       sınıflar oradaki binanın kapılarından seçiliyor. Okul sekmesini açan
       düzenek yoksa eski iş (küçük sınıf seçici) yedek olarak duruyor. */
    function okulaCevir(ok) {
        if (ok.__saOkul) return;
        ok.innerHTML = OKUL_SVG + OK_SVG;
        ok.setAttribute('title', 'Okulum — sınıflarımı aç');
        ok.setAttribute('aria-label', 'Okulum — sınıflarımı aç');
        /* YENİ SEKME AÇMIYOR (06.10.2026): pencere bu sekmede açılıyor,
           seçilen sınıf da bu sekmede geliyor — öğretmen sınıflar arasında
           gezerken sekme birikmesin. */
        ok.setAttribute('onclick',
            'event.stopPropagation();' +
            'if(window.KidefSinifBag&&KidefSinifBag.okulPencereAc){KidefSinifBag.okulPencereAc();}' +
            'else if(typeof llOkulPopupAc===\'function\'){llOkulPopupAc();}' +
            'else if(typeof llSinifListesiAc===\'function\'){llSinifListesiAc();}');
        ok.__saOkul = 1;
    }

    /* Rozetin iki işini ayır: okul simgesi en solda, hemen sağında ince çizgi, sonra
       bu sınıfın kendi parçası. Tek sınıfı olan öğretmende ok yok — o zaman
       ayrılacak bir şey de yok, çizgi konmuyor. */
    function rozetAyir(r) {
        /* Sınıf sayısı rozetten kalkıyor: listelerim.js onu hâlâ üretiyor
           (başka yerde işe yarayabilir), burada DOM'dan çıkarılıyor. */
        var say = r.querySelector('.rz-say');
        if (say && say.parentNode) say.parentNode.removeChild(say);

        if (r.querySelector('.rz-ayr')) return;

        /* TEK SINIFLI ÖĞRETMENDE DE OKUL TUŞU (06.10.2026).
           listelerim.js bu tuşu yalnız birden fazla sınıf varsa basıyordu —
           o zaman işi "başka sınıfa geç"ti ve tek sınıfta anlamsızdı. Artık
           tuş OKULA açılıyor (kurum/seviye/sınıf ekleme de orada) ve sınıf
           sekmesinde site başlığı gizli; tuş olmazsa tek sınıflı öğretmenin
           okula hiçbir kapısı kalmıyordu. Yoksa kendimiz kuruyoruz. */
        var ok = r.querySelector('.rz-ok');
        if (!ok) {
            ok = document.createElement('button');
            ok.type = 'button';
            ok.className = 'rz-ok';
            ok.setAttribute('tabindex', '0');
        }

        okulaCevir(ok);
        r.insertBefore(ok, r.firstChild);     /* okul simgesi en sola */
        var ayr = document.createElement('span');
        ayr.className = 'rz-ayr';
        ayr.setAttribute('aria-hidden', 'true');
        if (ok.nextSibling) r.insertBefore(ayr, ok.nextSibling);
        else r.appendChild(ayr);
    }

    /* Rozet yeniden çizilince (sınıf değişimi) simge ve başlık geri gelsin.
       Yoklamaya güvenilmiyor: yoklama bir dakika sonra duruyor, sınıf
       değişimi ise saatler sonra olabilir. */
    function rozetIzle() {
        var kap = document.getElementById('viewTitle');
        if (!kap || kap.__saIzleniyor || !window.MutationObserver) return;
        kap.__saIzleniyor = 1;
        new MutationObserver(function () {
            try { rozetKur(); } catch (e) { }
        }).observe(kap, { childList: true, subtree: true });
    }

    var tur = 0;
    var zaman = setInterval(function () {
        tur++;
        try { kur(); rozetKur(); rozetIzle(); } catch (e) { }
        if (tur > 120) clearInterval(zaman);     /* ~60 sn sonra bırak */
    }, 500);
    try { kur(); rozetKur(); rozetIzle(); } catch (e) { }

    window.KidefSekmeAnim = { kur: kur, rozetKur: rozetKur, sahneler: S };
})();
