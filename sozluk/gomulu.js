/* ==================================================================
   GÖMÜLÜ KİP — sozluksimulasyonu.html · yenisozlukdedektifi.html
   ------------------------------------------------------------------
   NİYE VAR: iki oyun, sozluk.html içinde sekme olarak <iframe> ile
   açılıyor. Orada oyunun kendi "geri / ana sayfa" tuşu ve başlık
   satırı gereksiz — üstte zaten sözlüğün şeridi duruyor.

   NİYE DIŞARIDAN YAPILMIYOR: sayfa "file://" ile açıldığında (öğretmen
   dosyayı bilgisayarından çift tıklayıp açıyor) tarayıcı çerçevenin
   içine erişimi ENGELLİYOR — üstteki sayfa iframe'in içindeki hiçbir
   şeye dokunamıyor. O yüzden gizleme işini sayfanın KENDİSİ yapıyor;
   üst sayfayla haberleşme de postMessage ile, o her iki durumda da
   çalışıyor.

   NASIL ÇALIŞIR: yalnız adreste ?gomulu=1 varsa devreye girer. Tek
   başına açıldığında (index'ten, İmam Hatip görevinden, katalogdan)
   hiçbir şey yapmaz — sayfa eskisi gibi.

     · kendi geri/ana sayfa tuşlarını ve başlık satırını gizler
     · üst şeride taşınacak tuşları (Joker, İpuçları) üst sayfaya
       bildirir: { kidef:'gomulu', tuslar:[{id,yazi,pasif}] }
     · üst sayfadan { kidef:'gomulu-tik', id } gelince o tuşa basar
   ================================================================== */
(function () {
    'use strict';
    if (!/[?&]gomulu=1/.test(location.search || '')) return;

    /* Üst şeride taşınacak tuşlar (varsa; dedektifte yok). */
    var TASINAN = ['joker-btn', 'hint-btn'];

    /* ---------------- gizlenecekler ---------------- */
    function stilKur() {
        if (document.getElementById('kdGomuluStil')) return;
        var st = document.createElement('style');
        st.id = 'kdGomuluStil';
        st.textContent =
            '#back-btn,' +
            '[onclick*="kidefGeri"],' +
            '.szk-geri,.geri-tus,' +
            '[aria-label="Geri"],[aria-label="Ana sayfaya dön"],' +
            'a[href="index.html"][title*="Ana"],' +
            'a[href="index.html"][title*="ana"],' +
            '.mobile-home-btn,' +
            /* simülasyonun başlık satırı: başlık + geri + Joker + İpuçları.
               Tuşlar yukarı taşındığı için satırın tamamı kalkıyor. */
            '.header,' +
            /* seviye şeridi de yukarı taşındı; altındaki ayıraç da
               boşuna bir satır yiyordu (28.09.2026). */
            '.level-selector,' +
            '.content-wrapper > hr' +
            '{display:none !important}';
        (document.head || document.documentElement).appendChild(st);
    }

    /* ---------------- üst sayfaya bildir ---------------- */
    var zaman = 0;

    /* Oyun, duruma göre bu tuşları kendi gizleyip gösteriyor: giriş
       ekranında (ipuçları + "Başla") ikisi de display:none, oyun
       başlayınca inline-block oluyor. Üstteki vekiller de aynı anda
       görünsün diye durum da bildiriliyor.
       DİKKAT: .header'ı biz gizliyoruz, o yüzden offsetParent'a
       bakılmıyor — yalnız tuşun ve .header-buttons kabının kendi
       display değerine bakılıyor. */
    function gizliMi(e) {
        if (!e) return true;
        var s = getComputedStyle(e);
        if (s.display === 'none' || s.visibility === 'hidden') return true;
        var k = e.closest ? e.closest('.header-buttons') : null;
        if (k) {
            var ks = getComputedStyle(k);
            if (ks.display === 'none' || ks.visibility === 'hidden') return true;
        }
        return false;
    }

    /* Seviye düğmeleri: id'leri yok, data-level ile duruyorlar. Etkin
       olanı oyun .active sınıfıyla işaretliyor; bitmiş seviyeleri de
       hidden yapabiliyor — ikisi de üste bildiriliyor. */
    function seviyeler() {
        var l = [];
        [].forEach.call(document.querySelectorAll('.level-btn'), function (e, i) {
            var n = e.getAttribute('data-level');
            l.push({
                n: (n == null ? String(i) : n),
                yazi: (e.textContent || '').trim(),
                etkin: e.classList.contains('active'),
                pasif: !!e.disabled,
                gizli: e.hasAttribute('hidden')
            });
        });
        return l;
    }

    function bildir() {
        var l = [];
        TASINAN.forEach(function (id) {
            var e = document.getElementById(id);
            if (!e) return;
            l.push({
                id: id, yazi: (e.textContent || '').trim(),
                pasif: !!e.disabled, gizli: gizliMi(e)
            });
        });
        try {
            parent.postMessage({ kidef: 'gomulu', tuslar: l, seviyeler: seviyeler() }, '*');
        } catch (e) { }
    }
    function gecikmeliBildir() { clearTimeout(zaman); zaman = setTimeout(bildir, 60); }

    function izle() {
        /* Seviye şeridi: etkin seviye değişince (oyun .active'i taşıyor)
           üstteki kaydırak da kaysın. */
        var sv = document.querySelector('.level-selector');
        if (sv && !sv.__kdIzli) {
            sv.__kdIzli = 1;
            try {
                new MutationObserver(gecikmeliBildir).observe(sv, {
                    childList: true, subtree: true, attributes: true
                });
            } catch (x) { }
        }
        TASINAN.forEach(function (id) {
            var e = document.getElementById(id);
            if (!e || e.__kdIzli) return;
            e.__kdIzli = 1;
            try {
                new MutationObserver(gecikmeliBildir).observe(e, {
                    childList: true, characterData: true, subtree: true, attributes: true
                });
            } catch (x) { }
            /* Kabın kendisi de gizlenip gösteriliyor (headerButtons). */
            var k = e.closest ? e.closest('.header-buttons') : null;
            if (k && !k.__kdIzli) {
                k.__kdIzli = 1;
                try {
                    new MutationObserver(gecikmeliBildir).observe(k, { attributes: true });
                } catch (x) { }
            }
        });
    }

    /* ---------------- üstten gelen tıklama ---------------- */
    window.addEventListener('message', function (ev) {
        var d = ev && ev.data;
        if (!d) return;
        if (d.kidef === 'gomulu-seviye' && d.n != null) {
            var s = document.querySelector('.level-btn[data-level="' + d.n + '"]');
            if (s) { try { s.click(); } catch (x) { } }
            gecikmeliBildir();
            return;
        }
        if (d.kidef !== 'gomulu-tik' || !d.id) return;
        var e = document.getElementById(d.id);
        if (e) { try { e.click(); } catch (x) { } }
    });

    /* ---------------- kurulum ----------------
       Oyunlar arayüzlerini geç kurabiliyor; birkaç kez bakıyoruz. */
    function kur() { stilKur(); izle(); bildir(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();
    window.addEventListener('load', kur);
    [200, 700, 1600, 3000].forEach(function (ms) { setTimeout(kur, ms); });
})();
