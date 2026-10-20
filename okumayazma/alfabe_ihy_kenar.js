/* =====================================================================
   ALFABE — KATMANLAR KUMANDAYLA GEZİLİR       (okumayazma/alfabe_ihy_kenar.js)
   ---------------------------------------------------------------------
   Öğretmen (20.10.2026): "alfabe.html de istenen harfi yaza basınca
   soldaki sidebar kaybolmasın, çarpı olmasın o kısımda side bar
   aracılığı ile gezinelim" · (2. sürüm) "alfabe.html deki dene
   kısımlarına basınca sidebar kaybolmasın".

   NE OLUYORDU
   «İstenen Harfi Yaz» konu anlatımı ve «Dene» (Kendini Dene: Harf
   Tanıtımı, İstenen Harfi Yaz, Harf Birleştirme, Okuma, Dinle ve Yaz)
   alfabe_akordiyon.js'teki aynı tam ekran katmanı açıyor (#ak-tam,
   z-index 9000). Soldaki kumanda (çekmece) ve sol kenardaki ok onun
   ALTINDA kalıyordu: menü kayboluyordu.

   ŞİMDİ — katman açıkken (konu anlatımı da «Dene» de)
   · Kumanda ve ok katmanın ÜSTÜNDE: çekmece açıksa açık kalır, kapalıysa
     sol kenardaki ok durur. Öteki sekmelerdeki gibi: içeriğe dokununca
     çekmece katlanır, okla yeniden açılır.
   · Kumandada başka bir sekmeye basınca katman kapanır, o sekme açılır
     (çekmece açık kalır, art arda gezilebilir). Başka bir «Dene»ye ya da
     «İstenen Harfi Yaz»a basınca katman ona geçer.
   · Kumandada açık olan bölüm seçili sekme gibi görünür (konu anlatımında
     «İstenen Harfi Yaz», testte o bölümün «Dene»si), tepedeki ad da onu
     yazar. Açık olana bir daha basmak (öteki sekmelerdeki gibi) yalnız
     çekmeceyi katlar: soru sırası, yarışma baştan başlamaz.
   · Konu anlatımında ✕ yok. «Dene»de ✕ ve sonuçtaki «Kapat» durur
     (istenmedi kaldırılması). Esc ikisini de kapatır.
   NASIL: .main-app'in arka plan bulanıklığı (backdrop-filter) onu ayrı
   bir katman yığını yapıyor; kumanda (z 60) ve ok (z 61) bu yüzden
   sayfanın dışındaki katmanın (9000) üstüne çıkamıyordu. Katman açıkken
   bulanıklık kapatılır (arkası zaten katmanla örtülü, fark görünmez),
   katman 59'a iner. Katman yerinden oynatılmaz; harf yazılışı katmanı
   (#hd-overlay, 9600) yine en üstte açılır.
   alfabe.html'e yalnız bu dosyanın etiketi eklendi; alfabe_akordiyon.js
   ve öteki dosyalara dokunulmadı.
   ===================================================================== */
(function () {
    'use strict';
    if (window.alfabeIhyKenar) return;

    var katman = null, kurulu = false, sonDene = '';

    function stilKur() {
        if (document.getElementById('alfabeIhyKenarStil')) return;
        var st = document.createElement('style');
        st.id = 'alfabeIhyKenarStil';
        st.textContent = [
            /* kumanda (60) ve ok (61) katmanın üstünde kalsın */
            'body.ak-kenar .main-app{-webkit-backdrop-filter:none !important; backdrop-filter:none !important;}',
            'body.ak-kenar #ak-tam{z-index:59;}',
            /* konu anlatımında ✕ yok — çıkış kumandadan */
            '#ak-tam.ak-yaz .ak-kapa{display:none !important;}',
            /* sol kenardaki ok içeriğin üstüne binmesin */
            'body.ak-kenar.nav-kenar #ak-tam .ak-cerceve{padding-left:max(2vw, 46px);}',
            /* arkadaki sayfa (ve Harf Tanıtımı rayı) görünmesin, dokunulmasın */
            'body.ak-kenar .main-app .content-area{visibility:hidden;}',
            'body.ak-kenar #harfRay,body.ak-kenar #p1-switch{display:none !important;}',
            'body.ak-kenar.harf-ray #navKol{width:30px;}',
            /* kumandada açık bölüm seçili görünür, arkadaki sekme sönük */
            'body.ak-kenar .nav-tabs .tab-trigger.active:not(.ak-secili){background:rgba(6,62,51,.62); color:#fff;',
            '  font-weight:normal; box-shadow:none;}',
            'body.ak-kenar .nav-tabs .tab-trigger.active:not(.ak-secili):hover{background:rgba(6,62,51,.82);}',
            'body.ak-kenar .nav-mini .tab-trigger.active:not(.ak-secili) .tab-ad{text-shadow:0 1px 3px rgba(0,0,0,.55);}',
            'body.ak-kenar .nav-tabs .tab-trigger.ak-secili{background:rgba(255,255,255,.94); color:#0E6655; font-weight:bold;',
            '  box-shadow:0 3px 10px rgba(0,0,0,.18);}',
            'body.ak-kenar .nav-mini .tab-trigger.ak-secili .tab-ad,body.ak-kenar .nav-mini .tab-trigger.ak-secili .ak-yanad{text-shadow:none;}',
            'body.ak-kenar .nav-tabs .ak-tetik.ak-secili .ak-yanad{color:#0E6655;}'
        ].join('\n');
        document.head.appendChild(st);
    }

    function acikMi() { return !!(katman && !katman.hidden); }
    function yazMi() { return acikMi() && katman.classList.contains('ak-yaz'); }
    function bolumler() {
        return (window.AlfabeAkordiyon && window.AlfabeAkordiyon.bolumler) || [];
    }
    /* açık testin bölümü: son basılan «Dene»; bilinmiyorsa başlıktan */
    function deneAnahtar() {
        if (!acikMi() || yazMi()) return '';
        var b = katman.querySelector('[data-rol="baslik"]');
        var ad = b ? String(b.textContent || '').replace(/^\s*Kendini Dene\s*[—-]\s*/, '').trim() : '';
        var L = bolumler(), bul = '';
        for (var i = 0; i < L.length; i++) if (L[i].baslik === ad) { bul = L[i].anahtar; break; }
        return bul || sonDene;
    }
    function deneAd(k) {
        var L = bolumler();
        for (var i = 0; i < L.length; i++) if (L[i].anahtar === k) return L[i].baslik;
        return '';
    }

    /* kumandada seçili görünen öge */
    function seciliYaz() {
        var hedef = null;
        if (yazMi()) hedef = document.querySelector('.nav-tabs .ak-konu');
        else if (acikMi()) {
            var k = deneAnahtar();
            if (k) hedef = document.querySelector('.nav-tabs .ak-tetik[data-ak="' + k + '"]');
        }
        [].forEach.call(document.querySelectorAll('.nav-tabs .ak-secili'), function (x) {
            if (x !== hedef) x.classList.remove('ak-secili');
        });
        if (hedef) hedef.classList.add('ak-secili');
    }
    /* kumandanın tepesindeki ad: açık bölüm */
    function adYaz() {
        var ad = document.getElementById('navMiniAd');
        if (!ad) return;
        if (yazMi()) {
            if (window.KidefDil && window.KidefDil.yaz) window.KidefDil.yaz(ad, 'alf.istenen_harf', 'İstenen Harfi Yaz');
            else ad.textContent = 'İstenen Harfi Yaz';
            return;
        }
        var b = deneAd(deneAnahtar());
        ad.removeAttribute('data-i18n');
        ad.textContent = b ? 'Dene · ' + b : 'Kendini Dene';
    }
    var _son = null;
    function guncelle() {
        var a = acikMi();
        document.body.classList.toggle('ak-kenar', a);
        seciliYaz();
        var durum = a ? (yazMi() ? 'yaz' : 'dene:' + deneAnahtar()) : '';
        if (durum === _son) return;
        _son = durum;
        if (a) adYaz();
        else if (typeof window.navAdYaz === 'function') { try { window.navAdYaz(); } catch (e) { } }
    }
    /* sayfanın kendi navAdYaz'ı (sekme değişince, çekmece katlanınca çağrılır)
       adı etkin sekmeye döndürür; katman açıkken yeniden yazılır */
    function navAdSar() {
        var asil = window.navAdYaz;
        if (typeof asil !== 'function' || asil.ihySarili) return;
        var sarili = function () {
            var r = asil.apply(this, arguments);
            if (acikMi()) adYaz();
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
    function cekmeceKatla(e) {
        e.preventDefault(); e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        if (typeof window.navKapat === 'function') { try { window.navKapat(); } catch (h) { } }
    }

    /* KUMANDADAN GEZİNME — yakalama evresinde, sekmenin kendi onclick'inden
       ve alfabe_akordiyon.js'in dinleyicisinden ÖNCE çalışır. */
    function kumandaTik(e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var tus = t.closest('.nav-tabs .tab-trigger');
        if (!tus) return;
        var dene = tus.classList.contains('ak-tetik');
        if (!acikMi()) {
            if (dene) sonDene = tus.getAttribute('data-ak') || '';
            return;                                          /* katman kapalı: her şey eskisi gibi */
        }
        /* açık olana bir daha basmak: yeniden başlatma, yalnız çekmeceyi katla */
        if (tus.classList.contains('ak-konu') && yazMi()) { cekmeceKatla(e); return; }
        if (dene && !yazMi() && (tus.getAttribute('data-ak') || '') === deneAnahtar()) { cekmeceKatla(e); return; }
        /* başka bir «Dene» ya da konu anlatımı: katman ona geçer (alfabe_akordiyon.js) */
        if (dene) { sonDene = tus.getAttribute('data-ak') || ''; return; }
        if (tus.classList.contains('ak-konu')) return;
        /* indirme bağlantıları (PDF, defter) katmanı kapatmaz */
        if (tus.tagName === 'A') return;
        /* başka bir sekme: katman kapanır, o sekme açılır. Arkadaki sekmenin
           kendisine basıldıysa da «başka sekme» sayılır — yoksa ui.tab «aynı
           sekme» deyip çekmeceyi katlıyordu. */
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
        var gozcu = new MutationObserver(guncelle);
        gozcu.observe(katman, { attributes: true, attributeFilter: ['hidden', 'class'] });
        /* başlık değişince (başka bir «Dene»ye geçildi) seçili öge tazelensin */
        var bas = katman.querySelector('[data-rol="baslik"]');
        if (bas) gozcu.observe(bas, { childList: true, characterData: true, subtree: true });
        document.addEventListener('click', kumandaTik, true);
        guncelle();
        window.alfabeIhyKenar = { guncelle: guncelle, acikMi: acikMi, yazMi: yazMi, deneAnahtar: deneAnahtar };
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
