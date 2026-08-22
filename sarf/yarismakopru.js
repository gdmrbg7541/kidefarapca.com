/* ===========================================================================
   YARIŞMA KÖPRÜSÜ — kalıplar tablosunu "canlı tahta" olarak sürer
   ---------------------------------------------------------------------------
   Bilgi yarışması (bilgiyarismasikacom.html) bu sayfayı bir iframe içinde
   açar ve postMessage ile yönetir. İki sayfa AYRI JS bağlamında kalır:
   böylece 167 + 92 üst düzey `const` çakışmaz, monkey-patch zinciri
   (vezingezinti → handleBoxClick, babodak → showBabInfo …) bozulmaz ve
   klavye dinleyicileri birbirini yutmaz.

   GELEN MESAJLAR      { kidef:'biy-tahta', is:…, kok:…, ref:… }
     is:'soru'     → kökü yükle, hedef hücreyi KIRMIZI vurgula (cevabı AÇMA)
     is:'cevap'    → hücreyi aç, kelime türetilsin
     is:'sifirla'  → tabloyu temizle
   GİDEN CEVAP         { kidef:'biy-tahta-ok', is:…, tamam:bool, kok:…, ref:… }

   "Soruyu göster / cevabı göster" ayrımı tablonun kendi
   activateBoxByRef(ref, isBackward) davranışıdır:
     isBackward = true  → yalnız kırmızı vurgu, kelime türetilmez
     isBackward = false → normal tıklama, kelime yazılır
   Yani cevap sızdırmayan bir "soru kipi" zaten var, yeniden yazmıyoruz.

   YÜKLEME SIRASI: bu dosya kaliplartablosu.js VE onu sarmalayan tüm
   dosyalardan (vezingezinti.js, babodak.js, muhadesekopru.js) SONRA
   yüklenmelidir.
   =========================================================================== */
(function () {
    'use strict';

    var BEKLE = 200;        // kilit/hazırlık yoklama aralığı (ms)
    var ENFAZLA = 60;       // ~12 sn sonra vazgeç
    var ACMA_ARA = 900;     // çok hücreli cevapta hücreler arası bekleme

    /* ---------------------------------------------------------------- */
    /* Hazırlık                                                          */
    /* ---------------------------------------------------------------- */

    function hazirMi() {
        return typeof window.activateBoxByRef === 'function'
            && typeof window.selectRootFromMenu === 'function'
            && typeof sozlukVerileri !== 'undefined';
    }

    /* activateBoxByRef sekme değiştirirken isPresentationLocked'ı 1 sn
       true yapıyor; o pencerede gelen komut sessizce yutulurdu. Kuyruğa
       alıp kilit açılınca çalıştırıyoruz. */
    function kilitliMi() { return !!window.isPresentationLocked; }

    function sirada(fn, tur) {
        tur = tur || 0;
        if (!hazirMi() || kilitliMi()) {
            if (tur > ENFAZLA) return;
            setTimeout(function () { sirada(fn, tur + 1); }, BEKLE);
            return;
        }
        try { fn(); } catch (e) { /* tek komut düşerse tur devam etsin */ }
    }

    /* ---------------------------------------------------------------- */
    /* Kök yükleme                                                       */
    /* ---------------------------------------------------------------- */

    function yukluKok() {
        if (window.activeConfirmedRoot) return window.activeConfirmedRoot;
        if (typeof currentRoot !== 'undefined' && currentRoot) return currentRoot;
        return '';
    }

    function kokYukle(kok) {
        if (!kok) return true;
        if (yukluKok() === kok) return true;                 // zaten yüklü
        if (typeof sozlukVerileri === 'undefined' || !sozlukVerileri[kok]) {
            return false;                                    // sözlükte yok
        }
        try { window.selectRootFromMenu(kok); } catch (e) { return false; }
        return yukluKok() === kok;
    }

    /* ---------------------------------------------------------------- */
    /* Hücre vurgulama                                                   */
    /* ---------------------------------------------------------------- */

    function refDizisi(ref) {
        if (ref === null || ref === undefined) return [];
        return (Array.isArray(ref) ? ref : [ref])
            .map(function (r) { return parseInt(r, 10); })
            .filter(function (r) { return r >= 1 && r <= 105; });
    }

    /* Soru kipi: TEK hücre vurgulanır. Çok hücreli sorularda (bâb dörtlüsü
       sırala, eşleştirme) hücre hücre kırmızı yakmak tabloyu kaydırıp
       durur ve zaten dördünü de göstermek soruyu ele verir — o yüzden
       yalnız kök yüklenir, kökün dolu hücreleri sarı kalır. */
    function soruGoster(kok, ref) {
        perdeleriKapat();
        var oldu = kokYukle(kok);
        var r = refDizisi(ref);
        if (r.length === 1) {
            try { window.activateBoxByRef(r[0], true); } catch (e) { oldu = false; }
        }
        return oldu;
    }

    /* activateBoxByRef ile AYNI seçici — hedefi o hangi kutuda buluyorsa
       biz de orada bulalım (masaüstü .window-pencere, dar ekran #mobile-grid). */
    function kutuBul(no) {
        var sec = (window.innerWidth <= 1024)
            ? '#mobile-grid .glass-box' : '.window-pencere .glass-box';
        var hepsi = Array.prototype.slice.call(document.querySelectorAll(sec));
        for (var i = 0; i < hepsi.length; i++) {
            var r = hepsi[i].querySelector('.ref');
            if (r && parseInt(String(r.innerText).trim(), 10) === no) return hepsi[i];
        }
        return null;
    }

    /* Cevap kipi: hücre(ler) açılır, kelime türetilir. Birden çoksa sırayla.

       DİKKAT — tıklama sayacı: handleBoxClick kademeli çalışır
       (1 sarı vurgu · 2 kelime türer · 3 çekim penceresi · 4 büyütme · 5 sıfırla).
       activateBoxByRef(ref, true) soru kipinde sayacı doğrudan 3'e kuruyor
       (sunumda geri gitmek için). Bu yüzden ardından (ref, false) çağırmak
       kelimeyi TÜRETMEZ, 3'ten sonrasına geçip sayacı sıfırlar. Doğru açılış:
       sayacı 1'e sabitle, sonra normal tıklamayı tetikle → 2'ye geçer,
       kelime yazılır. (نصف/52 → أَنْصَفَ, حقق/25 → حُقُوق ile doğrulandı.) */
    function birHucreAc(no) {
        var b = kutuBul(no);
        if (b) { try { b.setAttribute('data-tiklama-sayisi', '1'); } catch (e) {} }
        try { window.activateBoxByRef(no, false); } catch (e) {}
    }

    function cevapGoster(kok, ref) {
        perdeleriKapat();
        kokYukle(kok);
        var r = refDizisi(ref);
        if (!r.length) return false;
        r.forEach(function (no, i) {
            if (i === 0) { sirada(function () { birHucreAc(no); }); }
            else { setTimeout(function () {
                sirada(function () { birHucreAc(no); });
            }, i * ACMA_ARA); }
        });
        return true;
    }

    function sifirla() {
        perdeleriKapat();
        try {
            if (typeof window.resetTableOnly === 'function') window.resetTableOnly(true);
            else if (typeof resetTableOnly === 'function') resetTableOnly(true);
        } catch (e) { /* sıfırlanamazsa tablo olduğu gibi kalsın */ }
    }

    /* Tahtayı kapatan pencereler: kullanım kılavuzu, günün kökü, kelime
       kartı. Projeksiyonda bunlardan biri açık kalırsa sınıf tabloyu
       göremez; her komuttan önce kapatılır. */
    function perdeleriKapat() {
        try {
            var k = document.getElementById('kt-kilavuz');
            if (k && k.style.display === 'block' &&
                typeof window.kilavuzKapat === 'function') window.kilavuzKapat();
            var g = document.getElementById('rootOfDayOverlay');
            if (g) {
                if (typeof window.closeRootOfDay === 'function') window.closeRootOfDay();
                else if (g.parentNode) g.parentNode.removeChild(g);
            }
            var m = document.getElementById('word-details-modal');
            var o = document.getElementById('word-details-overlay');
            if (m) m.style.display = 'none';
            if (o) o.style.display = 'none';
        } catch (e) {}
    }

    /* ---------------------------------------------------------------- */
    /* Mesaj yolu                                                        */
    /* ---------------------------------------------------------------- */

    function gecerli(e) {
        if (!e || !e.data || typeof e.data !== 'object') return false;
        if (e.data.kidef !== 'biy-tahta') return false;
        /* Yalnız aynı kaynak. file:// (origin 'null') kabul edilmez. */
        if (e.origin && e.origin !== location.origin) return false;
        return true;
    }

    function bildir(e, is, tamam, d) {
        try {
            if (e.source) e.source.postMessage({
                kidef: 'biy-tahta-ok', is: is, tamam: !!tamam,
                kok: d.kok || null, ref: (d.ref === undefined ? null : d.ref)
            }, location.origin);
        } catch (x) { /* kaynak kapanmış olabilir */ }
    }

    window.addEventListener('message', function (e) {
        if (!gecerli(e)) return;
        var d = e.data, is = d.is;

        if (is === 'sifirla') { sirada(sifirla); bildir(e, is, true, d); return; }

        if (is === 'soru') {
            sirada(function () { bildir(e, is, soruGoster(d.kok, d.ref), d); });
            return;
        }
        if (is === 'cevap') {
            sirada(function () { bildir(e, is, cevapGoster(d.kok, d.ref), d); });
            return;
        }
        if (is === 'yoklama') { bildir(e, is, hazirMi(), d); return; }
    });

    /* ---------------------------------------------------------------- */
    /* Tahta kipi: sayfa bir iframe içindeyse rahatsız eden şeyleri kapat */
    /* ---------------------------------------------------------------- */

    function iframeDeMi() {
        try { return window.self !== window.top; } catch (e) { return true; }
    }

    if (iframeDeMi()) {
        /* "Günün Kökü" penceresi DOMContentLoaded'dan ~800 ms sonra açılıp
           tahtayı kapatıyordu. Bu dosya kaliplartablosu.js'ten sonra
           yüklendiği için burada devre dışı bırakmak yetiyor. */
        try { window.showRootOfDay = function () { /* tahta kipi */ }; } catch (e) {}

        /* KULLANIM KILAVUZU İLK ZİYARETTE KENDİLİĞİNDEN AÇILIYOR
           (kaliplartablosu.js: localStorage 'kidef_kt_kilavuz_v1', 900 ms
           gecikmeli). Sınıfın ilk açılışında tam ekran kılavuz tabloyu
           kapatırdı. O IIFE biz yüklenmeden çalıştığı için bayrağı
           değiştiremiyoruz; bunun yerine kilavuzAc'ı KISA SÜRE etkisiz
           bırakıp sonra geri veriyoruz — öğretmen ⓘ ile hâlâ açabilir. */
        try {
            var gercekKilavuz = window.kilavuzAc;
            if (typeof gercekKilavuz === 'function') {
                window.kilavuzAc = function () { /* tahta kipi: açılış bastırıldı */ };
                setTimeout(function () { window.kilavuzAc = gercekKilavuz; }, 2500);
            }
        } catch (e) {}
        setTimeout(perdeleriKapat, 1400);
        /* Yarışma hazır olduğumuzu bilsin — iframe onload'dan önce de gelebilir. */
        var haber = function () {
            try {
                if (window.parent) window.parent.postMessage(
                    { kidef: 'biy-tahta-hazir', tamam: hazirMi() }, location.origin);
            } catch (e) {}
        };
        if (document.readyState === 'complete') setTimeout(haber, 300);
        else window.addEventListener('load', function () { setTimeout(haber, 300); },
                                     { once: true });
    }
})();
