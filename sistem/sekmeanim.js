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

    /* ---------------------------------------------------------- BİÇİM */
    function stilKur() {
        if (document.getElementById('saStil')) return;
        var s = document.createElement('style');
        s.id = 'saStil';
        s.textContent = [
            /* simgeler büyüsün (öğretmen: "daha büyük olsunlar") */
            '#ll-root #content .tabs .tab .tab-ikon{ width:34px; height:34px; }',
            '@media (max-width:620px){ #ll-root #content .tabs .tab .tab-ikon{ width:28px; height:28px; } }',
            '#ll-root #content .tabs .tab .tab-ikon{ transition:opacity .32s ease, transform .32s ease; }',
            '#ll-root #content .tabs .tab .tab-ikon.sa-sol{ opacity:0; transform:scale(.86) rotate(-6deg); }',
            /* rozetin başındaki küçük simge */
            '#ll-root #content .tabs #active-class-title .rz-ik{',
            '  width:22px; height:22px; flex:0 0 auto; margin-inline-end:1px;',
            '  transition:opacity .32s ease, transform .32s ease; }',
            '#ll-root #content .tabs #active-class-title .rz-ik.sa-sol{ opacity:0; transform:scale(.86); }',
            /* sahne içi küçük hareketler */
            '@keyframes saNabiz{ 0%,100%{ opacity:1 } 50%{ opacity:.35 } }',
            '.sa-nabiz{ animation:saNabiz 1.5s ease-in-out infinite; }',
            '@keyframes saIbre{ from{ transform:rotate(0) } to{ transform:rotate(360deg) } }',
            '.sa-ibre{ transform-origin:12px 13.4px; animation:saIbre 2.6s linear infinite; }',
            '@keyframes saKum{ 0%{ transform:translateY(-2px); opacity:0 }',
            '  40%{ opacity:1 } 100%{ transform:translateY(5px); opacity:0 } }',
            '.sa-kum{ animation:saKum 1.1s linear infinite; }',
            '@keyframes saDon{ 0%,70%,100%{ transform:rotate(0) } 80%{ transform:rotate(-12deg) }',
            '  90%{ transform:rotate(10deg) } }',
            '.sa-don{ transform-origin:12px 12px; animation:saDon 3s ease-in-out infinite; }',
            '@keyframes saKalk{ 0%,100%{ transform:translate(0,0) } 50%{ transform:translate(.8px,-1.4px) } }',
            '.sa-kalk{ animation:saKalk 2.2s ease-in-out infinite; }',
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

    /* Rozet (Öğrenciler) her sınıf değişiminde yeniden çizildiği için
       ayrı izleniyor: içine küçük bir simge konup döngüye alınıyor. */
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
        r.__saKuruldu = 1;
        dongu(svg, S.liste, 450);
    }

    var tur = 0;
    var zaman = setInterval(function () {
        tur++;
        try { kur(); rozetKur(); } catch (e) { }
        if (tur > 120) clearInterval(zaman);     /* ~60 sn sonra bırak */
    }, 500);
    try { kur(); rozetKur(); } catch (e) { }

    window.KidefSekmeAnim = { kur: kur, rozetKur: rozetKur, sahneler: S };
})();
