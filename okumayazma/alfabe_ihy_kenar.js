/* =====================================================================
   ALFABE — «İSTENEN HARFİ YAZ» KUMANDAYLA     (okumayazma/alfabe_ihy_kenar.js)
   ---------------------------------------------------------------------
   Öğretmen (20.10.2026): "alfabe.html de istenen harfi yaza basınca
   soldaki sidebar kaybolmasın, çarpı olmasın o kısımda side bar
   aracılığı ile gezinelim".

   NE OLUYORDU
   «İstenen Harfi Yaz» (konu anlatımı, alfabe_akordiyon.js → yazAc) bütün
   ekranı kaplayan bir katman açıyor (#ak-tam, z-index 9000). Soldaki
   kumanda (çekmece) ve sol kenardaki ok onun ALTINDA kalıyordu: menü
   kayboluyor, çıkmanın tek yolu sağ üstteki ✕ oluyordu.

   ŞİMDİ — yalnız «İstenen Harfi Yaz» konu anlatımında
   · Katman kumandanın ve okun ALTINA iner: çekmece açıksa açık kalır,
     kapalıysa sol kenardaki ok durur. Öteki sekmelerdeki gibi: içeriğe
     dokununca çekmece katlanır, okla yeniden açılır.
   · ✕ yok. Çıkış kumandadan: başka bir sekmeye basınca katman kapanır,
     o sekme açılır (çekmece açık kalır, art arda gezilebilir). Esc de
     kapatır.
   · Kumandada «İstenen Harfi Yaz» seçili sekme gibi görünür; açıkken bir
     daha basmak (öteki sekmelerdeki gibi) yalnız çekmeceyi katlar, soru
     sırası baştan başlamaz.
   · «Dene» (şıklı ölçme) ve öteki «Kendini Dene» katmanları DEĞİŞMEDİ:
     tam ekran ve ✕'li.
   NASIL: .main-app'in arka plan bulanıklığı (backdrop-filter) onu ayrı
   bir katman yığını yapıyor; kumanda (z 60) ve ok (z 61) bu yüzden
   sayfanın dışındaki katmanın (9000) üstüne çıkamıyordu. Konu anlatımı
   açıkken bulanıklık kapatılır (arkası zaten katmanla örtülü, fark
   görünmez), katman 59'a iner. Katman yerinden oynatılmaz.
   alfabe.html'e yalnız bu dosyanın etiketi eklendi; alfabe_akordiyon.js
   ve öteki dosyalara dokunulmadı.
   ===================================================================== */
(function () {
    'use strict';
    if (window.alfabeIhyKenar) return;

    var katman = null, kurulu = false;

    function stilKur() {
        if (document.getElementById('alfabeIhyKenarStil')) return;
        var st = document.createElement('style');
        st.id = 'alfabeIhyKenarStil';
        st.textContent = [
            /* kumanda (60) ve ok (61) katmanın üstünde kalsın */
            'body.ihy-kenar .main-app{-webkit-backdrop-filter:none !important; backdrop-filter:none !important;}',
            'body.ihy-kenar #ak-tam.ak-yaz{z-index:59;}',
            /* ✕ yok — çıkış kumandadan */
            '#ak-tam.ak-yaz .ak-kapa{display:none !important;}',
            /* sol kenardaki ok içeriğin üstüne binmesin */
            'body.ihy-kenar.nav-kenar #ak-tam.ak-yaz .ak-cerceve{padding-left:max(2vw, 46px);}',
            /* arkadaki sayfa (ve Harf Tanıtımı rayı) görünmesin, dokunulmasın */
            'body.ihy-kenar .main-app .content-area{visibility:hidden;}',
            'body.ihy-kenar #harfRay,body.ihy-kenar #p1-switch{display:none !important;}',
            'body.ihy-kenar.harf-ray #navKol{width:30px;}',
            /* kumandada «İstenen Harfi Yaz» seçili görünür, arkadaki sekme sönük */
            'body.ihy-kenar .nav-tabs .tab-trigger.active:not(.ak-konu){background:rgba(6,62,51,.62); color:#fff;',
            '  font-weight:normal; box-shadow:none;}',
            'body.ihy-kenar .nav-tabs .tab-trigger.active:not(.ak-konu):hover{background:rgba(6,62,51,.82);}',
            'body.ihy-kenar .nav-mini .tab-trigger.active:not(.ak-konu) .tab-ad{text-shadow:0 1px 3px rgba(0,0,0,.55);}',
            'body.ihy-kenar .nav-tabs .tab-trigger.ak-konu{background:rgba(255,255,255,.94); color:#0E6655; font-weight:bold;',
            '  box-shadow:0 3px 10px rgba(0,0,0,.18);}',
            'body.ihy-kenar .nav-mini .tab-trigger.ak-konu .tab-ad{text-shadow:none;}'
        ].join('\n');
        document.head.appendChild(st);
    }

    function yazAcikMi() {
        return !!(katman && !katman.hidden && katman.classList.contains('ak-yaz'));
    }
    /* kumandanın tepesindeki sekme adı: açıkken «İstenen Harfi Yaz» */
    function adYaz() {
        var ad = document.getElementById('navMiniAd');
        if (!ad) return;
        if (window.KidefDil && window.KidefDil.yaz) window.KidefDil.yaz(ad, 'alf.istenen_harf', 'İstenen Harfi Yaz');
        else ad.textContent = 'İstenen Harfi Yaz';
    }
    var _son = null;
    function guncelle() {
        var a = yazAcikMi();
        document.body.classList.toggle('ihy-kenar', a);
        if (a === _son) return;
        _son = a;
        if (a) adYaz();
        else if (typeof window.navAdYaz === 'function') { try { window.navAdYaz(); } catch (e) { } }
    }
    /* sayfanın kendi navAdYaz'ı (sekme değişince, çekmece katlanınca çağrılır)
       adı etkin sekmeye döndürür; konu anlatımı açıkken yeniden yazılır */
    function navAdSar() {
        var asil = window.navAdYaz;
        if (typeof asil !== 'function' || asil.ihySarili) return;
        var sarili = function () {
            var r = asil.apply(this, arguments);
            if (yazAcikMi()) adYaz();
            return r;
        };
        sarili.ihySarili = true;
        window.navAdYaz = sarili;
    }

    function kapatKatman() {
        try {
            if (window.AlfabeAkordiyon && typeof window.AlfabeAkordiyon.kapat === 'function') window.AlfabeAkordiyon.kapat();
        } catch (e) { }
        guncelle();
    }

    /* KUMANDADAN GEZİNME — yakalama evresinde, sekmenin kendi onclick'inden
       ÖNCE çalışır. */
    function kumandaTik(e) {
        if (!yazAcikMi()) return;
        var t = e.target;
        if (!t || !t.closest) return;
        var tus = t.closest('.nav-tabs .tab-trigger');
        if (!tus) return;
        /* «İstenen Harfi Yaz» zaten açık: yeniden başlatma, öteki sekmelerde
           olduğu gibi yalnız çekmeceyi katla */
        if (tus.classList.contains('ak-konu')) {
            e.preventDefault(); e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            if (typeof window.navKapat === 'function') { try { window.navKapat(); } catch (h) { } }
            return;
        }
        /* «Dene»: şıklı ölçme kendi tam ekran katmanını açar (değişmedi) */
        if (tus.classList.contains('ak-tetik')) return;
        /* indirme bağlantıları (PDF, defter) katmanı kapatmaz */
        if (tus.tagName === 'A') return;
        /* başka bir sekme: konu anlatımı kapanır, o sekme açılır. Arkadaki
           sekmenin kendisine basıldıysa da «başka sekme» sayılır — yoksa
           ui.tab «aynı sekme» deyip çekmeceyi katlıyordu. */
        tus.classList.remove('active');
        kapatKatman();
    }

    function kur() {
        if (kurulu) return true;
        katman = document.getElementById('ak-tam');
        if (!katman || !document.querySelector('.main-app')) return false;
        kurulu = true;
        stilKur();
        navAdSar();
        new MutationObserver(guncelle).observe(katman, { attributes: true, attributeFilter: ['hidden', 'class'] });
        document.addEventListener('click', kumandaTik, true);
        guncelle();
        window.alfabeIhyKenar = { guncelle: guncelle, acikMi: yazAcikMi };
        return true;
    }

    function basla() {
        if (kur()) return;
        /* katman alfabe_akordiyon.js'te kuruluyor: gelmesini bekle */
        var kac = 0;
        var saat = setInterval(function () {
            if (kur() || ++kac > 40) clearInterval(saat);
        }, 250);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla);
    else basla();
})();
