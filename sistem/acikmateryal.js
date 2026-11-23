/* =====================================================================
   SINIF MATERYALLERİ HERKESE AÇIK — ANA SAYFA PARÇASI          (sistem/acikmateryal.js)
   ---------------------------------------------------------------------
   Yönetici (23.11.2026): "sınıf materyallerinin herkese açık olduğu bi switch ekleyelim, bu switch yönetici panelinde
   siteyi herkese açık olduğu yerde olsun, yani siteyi herkese açık yaparken sınıf materyallerini de herkese açabileyim,
   ama giriş yapmadan kullanılırsa bulut hizmetlerine kaydedilmeyecek şekilde olsun".
   Cevaplar: giriş yapmamış ziyaretçi «belgeler dahil her şeyi» görsün; giriş yapmış öğretmen ve öğrenci için bir şey değişmesin.

   ANAHTAR   ayarlar/site.materyalAcik (yönetici paneli → Site Erişim Kilidi → 🌍 Açık kartının altı; sistem/kilit.js).
             Yalnız kilit 🌍 Açık iken işler: SiteKilit.materyalAcikMi().
   NE YAPAR  Anahtar açık VE ziyaretçi giriş yapmamışsa <html>'e «kd-acikmat» koyar. Bu sınıf, 26.10.2026'dan beri herkese
             gizli duran #imam-hatip bölümünü (5–10. sınıf rafı) görünür kılar ve «Sınıf Materyalleri» adıyla gösterir:
               · her sınıfta Ders Kitabı, Kidef Arapça, Metinlerle Arapça, o sınıfın belgeleri (plan, çalışma kâğıdı,
                 sınav…) ve etkinlik kartları — öğretmenin sınıf kapısındaki Materyaller sekmesiyle aynı çizim işlevleri
                 (index.html → ihToggle / ihIcKur), yani aynı içerik;
               · «Kidef Arapça · Yardımcı» rafı.
             Misafire çizilmeyenler: Sınıf Defteri kartı ile Bilgi Yarışması kartı (ikisi de hesap ister) ve okul geneli
             «Öğretmen Dökümanları» (sınıfa ait değil: zümre, mevzuat…).
   GİRİŞ YAPMIŞ  öğretmen/öğrenci/yönetici: bölüm eskisi gibi gizli kalır (materyaller sınıfın içinde ya da Sınıfım'da).
   ÇIKIŞ-GİRİŞ   Giriş yapılınca bölüm kendiliğinden kapanır, çıkış yapılınca anahtar açıksa geri gelir.
   BULUT         Girişsiz kullanımın buluta yazmaması sistem/misafirkalkan.js'in işi (SDK'nın yazma kapılarını kapatır).
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefAcikMateryal) return;
    var A = window.KidefAcikMateryal = {};
    var H = document.documentElement;

    var authBelli = false, kullanici = null, authBagli = false;

    /* ------------------------------------------------------------ BİÇİM */
    function stilKur() {
        if (document.getElementById('kdAmStil')) return;
        var s = document.createElement('style');
        s.id = 'kdAmStil';
        s.textContent = [
            /* misafir parçaları: varsayılan gizli */
            '#imam-hatip > h2.kd-am-bas, #imam-hatip > .kd-am-not{ display:none; }',
            /* anahtar açık + misafir: bölüm görünür (ihgorunum.js'in «herkese gizli» kuralını yener) */
            'html.kd-acikmat #imam-hatip{ display:block !important; }',
            'html.kd-acikmat #imam-hatip > h2:not(.kd-am-bas){ display:none !important; }',
            'html.kd-acikmat #imam-hatip > h2.kd-am-bas{ display:block; }',
            'html.kd-acikmat #imam-hatip > .kd-am-not{ display:flex; }',
            /* hesap isteyen ya da okul geneli parçalar misafire çizilmez */
            'html.kd-acikmat #imam-hatip .ih-genel-dok,',
            'html.kd-acikmat #imam-hatip .a4-kart.a4-tikla,',
            'html.kd-acikmat #imam-hatip [data-smodul="bilgiyarismasi"]{ display:none !important; }',

            '#imam-hatip > .kd-am-not{ align-items:center; gap:10px; flex-wrap:wrap; max-width:760px; box-sizing:border-box;',
            '  margin:2px auto 12px; padding:9px 14px; border-radius:14px;',
            '  background:linear-gradient(135deg,#EAF6F3 0%,#FFFFFF 78%); border:1px solid #CFE8E0; border-left:5px solid #16A085;',
            '  color:#33414F; font-size:.88rem; line-height:1.5; }',
            '#imam-hatip > .kd-am-not > svg{ width:26px; height:26px; flex:0 0 auto; }',
            '#imam-hatip > .kd-am-not .kd-am-yazi{ flex:1 1 230px; }',
            '#imam-hatip > .kd-am-not b{ color:#0E7C66; }',
            '#imam-hatip > .kd-am-not .kd-am-giris{ cursor:pointer; font-family:inherit; font-size:.86rem; font-weight:800; line-height:1.2;',
            '  min-height:40px; padding:9px 18px; border-radius:999px; border:0; background:#16A085; color:#fff; }',
            '#imam-hatip > .kd-am-not .kd-am-giris:hover{ background:#0E7C66; }',
            '#imam-hatip > .kd-am-not .kd-am-giris:focus-visible{ outline:3px solid #2563EB; outline-offset:2px; }',
            /* başlıktaki kitap: sayfalar sırayla yazılıyor; bulut simgesindeki çizgi hafifçe nabız atıyor */
            '@keyframes kdAmYaz{ 0%{ stroke-dashoffset:22 } 55%,100%{ stroke-dashoffset:0 } }',
            '@keyframes kdAmNabiz{ 0%,100%{ opacity:1 } 50%{ opacity:.45 } }',
            '#imam-hatip .kd-am-yaz{ stroke-dasharray:22; animation:kdAmYaz 4.5s ease-in-out infinite; }',
            '#imam-hatip .kd-am-yaz.k2{ animation-delay:.35s; }',
            '#imam-hatip .kd-am-yaz.k3{ animation-delay:.7s; }',
            '#imam-hatip .kd-am-cizgi{ animation:kdAmNabiz 2.6s ease-in-out infinite; }',
            '@media (prefers-reduced-motion:reduce){ #imam-hatip .kd-am-yaz, #imam-hatip .kd-am-cizgi{ animation:none; stroke-dasharray:none; } }',
            '@media (max-width:640px){ #imam-hatip > .kd-am-not{ border-radius:12px; } }'
        ].join('\n');
        (document.head || H).appendChild(s);
    }

    var KITAP_SVG = '<svg class="kbas" viewBox="0 0 64 64" aria-hidden="true">' +
        '<path d="M5 13c8-4.4 17-4.4 27 2v39c-10-6.4-19-6.4-27-2z" fill="#fff" stroke="#16A085" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M59 13c-8-4.4-17-4.4-27 2v39c10-6.4 19-6.4 27-2z" fill="#EAF6F3" stroke="#16A085" stroke-width="3" stroke-linejoin="round"/>' +
        '<path class="kd-am-yaz" d="M12 24c4-1.1 8-.9 12 .9" fill="none" stroke="#F39C12" stroke-width="2.8" stroke-linecap="round"/>' +
        '<path class="kd-am-yaz k2" d="M12 33c4-1.1 8-.9 12 .9" fill="none" stroke="#F39C12" stroke-width="2.8" stroke-linecap="round"/>' +
        '<path class="kd-am-yaz k3" d="M40 25.9c4-1.8 8-2 12-.9M40 34.9c4-1.8 8-2 12-.9" fill="none" stroke="#F39C12" stroke-width="2.8" stroke-linecap="round"/>' +
        '</svg>';
    var BULUT_SVG = '<svg viewBox="0 0 32 32" aria-hidden="true">' +
        '<path d="M10 25a6 6 0 0 1-.9-11.9A8 8 0 0 1 24.3 12a5.5 5.5 0 0 1-.8 13Z" fill="#fff" stroke="#16A085" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path class="kd-am-cizgi" d="M6 5 26 27" fill="none" stroke="#EE5253" stroke-width="2.6" stroke-linecap="round"/></svg>';

    /* ----------------------------------------------------------- BÖLÜM */
    var kuruldu = false, ilkAcilis = false;
    function bolumKur() {
        var s = document.getElementById('imam-hatip');
        if (!s) return;
        if (!kuruldu && !s.querySelector(':scope > h2.kd-am-bas')) {
            var bas = document.createElement('h2');
            bas.className = 'kd-am-bas';
            bas.innerHTML = KITAP_SVG + ' <span>Sınıf Materyalleri</span>';
            s.insertBefore(bas, s.firstChild);
            var not = document.createElement('div');
            not.className = 'kd-am-not';
            not.innerHTML = BULUT_SVG +
                '<span class="kd-am-yazi"><b>Giriş yapmadan kullanıyorsun:</b> burada yaptığın hiçbir şey buluta kaydedilmez.</span>' +
                '<button type="button" class="kd-am-giris">Giriş yap / Kayıt ol</button>';
            bas.insertAdjacentElement('afterend', not);
            var dugme = not.querySelector('.kd-am-giris');
            if (dugme) dugme.onclick = function () { try { if (typeof showLoginModal === 'function') showLoginModal(); } catch (e) { } };
        }
        kuruldu = true;
        if (!ilkAcilis) { ilkAcilis = true; ilkAcilisIsleri(); }
    }

    /* Sayfaya bu bölümle gelindiyse (adresteki #imam-hatip ya da kelimeler.html'den «?ihsinif=N» dönüşü) yerine götür.
       Bölüm gizliyken tarayıcı oraya kaydıramamıştı. ihToggle sayfanın ana betiğinde sonradan tanımlanıyor: bekler. */
    function ilkAcilisIsleri() {
        var m = /[?&]ihsinif=(\d+)/.exec(location.search || '');
        var n = m ? m[1] : '';
        var hash = location.hash === '#imam-hatip';
        if (!n && !hash) return;
        var deneme = 0;
        (function dene() {
            var s = document.getElementById('imam-hatip');
            if (!s || !H.classList.contains('kd-acikmat')) return;
            if (n) {
                var k = s.querySelector('.ih-kartlar[data-sinif="' + n + '"]');
                var item = k && k.closest ? k.closest('.ih-item') : null;
                var bas = item && item.querySelector(':scope > .ih-head');
                if (bas && typeof window.ihToggle === 'function') {
                    if (!item.classList.contains('acik')) { try { window.ihToggle(bas); } catch (e) { } }
                    setTimeout(function () { try { bas.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { } }, 300);
                    return;
                }
            } else if (s.getBoundingClientRect().height > 0) {
                try { s.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { }
                return;
            }
            if (++deneme < 25) setTimeout(dene, 200);
        })();
    }

    /* ----------------------------------------------------------- DURUM */
    function anahtarAcik() {
        var K = window.SiteKilit;
        try { if (K && typeof K.materyalAcikMi === 'function') return !!K.materyalAcikMi(); } catch (e) { }
        return false;
    }
    /* Misafir kesinleşti mi: Firebase oturum cevabı verdiyse o; vermediyse kilit.js'in tarayıcıdaki oturum izi
       (IndexedDB/localStorage) araması «iz yok» dediyse. Oturum geri yükleniyorken (null) bölüm AÇILMAZ —
       giriş yapmış öğretmene bir an bile görünmesin. */
    function misafirKesin() {
        if (authBelli) return !(kullanici && !kullanici.isAnonymous);
        var K = window.SiteKilit;
        try { return !!(K && typeof K.oturumVar === 'function' && K.oturumVar() === false); } catch (e) { return false; }
    }
    function uygula() {
        var ac = false;
        try { ac = anahtarAcik() && misafirKesin(); } catch (e) { ac = false; }
        if (ac !== H.classList.contains('kd-acikmat')) H.classList.toggle('kd-acikmat', ac);
        if (ac) bolumKur();
    }
    function authBagla() {
        if (authBagli) return;
        try {
            var fb = window.firebase;
            if (!fb || !fb.auth || !fb.apps || !fb.apps.length) return;
            authBagli = true;
            fb.auth().onAuthStateChanged(function (u) {
                authBelli = true; kullanici = u || null;
                try { uygula(); } catch (e) { }
            });
        } catch (e) { authBagli = false; }
    }

    stilKur();
    authBagla();
    uygula();
    /* anahtar (kilit.js bulut dinleyicisi) ve oturum asenkron geliyor: olay + ilk yarım dakika sık, sonra seyrek yoklama */
    window.addEventListener('kidefmateryalacik', function () { try { uygula(); } catch (e) { } });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) { try { uygula(); } catch (e) { } } });
    var tur = 0;
    (function nabiz() {
        try { authBagla(); uygula(); } catch (e) { }
        tur++;
        setTimeout(nabiz, tur < 60 ? 500 : 1500);
    })();

    A.uygula = uygula; A.acikMi = anahtarAcik; A.misafirMi = misafirKesin;
})();
