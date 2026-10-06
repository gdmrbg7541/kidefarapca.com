/* =====================================================================
   KİDEF · SINIFA DOĞRUDAN BAĞLANTI          (sistem/sinifbag.js)
   ---------------------------------------------------------------------
   Öğretmen (06.10.2026): "sınıf listesine tıklayınca ayrı sekmede
   açılsın."

   NİYE AYRI DOSYA: ayrı sekmede açmak için o sınıfa GİDEN BİR ADRES
   gerekiyor; site tek sayfa olduğu için sınıf seçimi şimdiye kadar
   yalnız bellekte yaşıyordu (selectClass). Bu dosya adrese küçük bir
   kapı açıyor:

       index.html?sinif=<seviyeId>&sube=<sinifId>

   Sayfa bu adresle açıldığında Listelerim görünümüne geçip o sınıfı
   seçiyor. Böylece:
     · Sınıflarım kategorisindeki kart yeni sekmede açılabiliyor,
     · öğretmen sınıfın adresini yer imine ekleyebiliyor,
     · orta tuş / Ctrl+tık gibi tarayıcı alışkanlıkları da çalışıyor.

   BEKLEME: veriler (data) ve selectClass hazır olmadan seçim yapılamaz;
   ikisi de gelene kadar kısa aralıklarla bakılıyor, 15 saniyede
   gelmezse vazgeçiliyor (sayfa yine normal açılmış olur).

   ADRES TEMİZLENİYOR: sınıf açıldıktan sonra ?sinif=… adres çubuğundan
   siliniyor (history.replaceState). Sebebi: öğretmen sayfayı
   yenilediğinde ya da başka bir yere gidip geri geldiğinde aynı sınıfın
   zorla yeniden açılmasını istemiyoruz; bir kerelik bir kapı bu.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefSinifBag) return;

    function parametre() {
        try {
            var p = new URLSearchParams(location.search);
            var l = p.get('sinif'), c = p.get('sube');
            return (l && c) ? { lId: l, cId: c } : null;
        } catch (e) { return null; }
    }

    /* Bir sınıfın adresi — kartlar bunu kullanıyor. */
    function adres(lId, cId) {
        return 'index.html?sinif=' + encodeURIComponent(lId) +
               '&sube=' + encodeURIComponent(cId);
    }

    function hazirMi(h) {
        try {
            if (typeof selectClass !== 'function') return false;
            if (typeof changeView !== 'function') return false;
            var d = (typeof data !== 'undefined' && data) ? data : null;
            if (!d || !d.levels || !d.levels[h.lId]) return false;
            var s = d.levels[h.lId].classes || {};
            return !!s[h.cId];
        } catch (e) { return false; }
    }

    function ac(h) {
        try {
            changeView('listelerim-section');
            if (typeof initListelerim === 'function') initListelerim();
            setTimeout(function () {
                try { selectClass(h.lId, h.cId); } catch (e) { }
            }, 0);
            /* Adresi sadeleştir: yenilemede sınıf zorla açılmasın. */
            try {
                var u = location.pathname + location.hash;
                history.replaceState(null, '', u);
            } catch (e) { }
        } catch (e) {
            try { console.warn('sınıf bağlantısı:', e && e.message); } catch (x) { }
        }
    }

    var hedef = parametre();
    if (hedef) {
        var tur = 0;
        var zaman = setInterval(function () {
            tur++;
            if (hazirMi(hedef)) { clearInterval(zaman); ac(hedef); return; }
            if (tur > 60) clearInterval(zaman);      /* ~15 sn sonra vazgeç */
        }, 250);
    }

    window.KidefSinifBag = { adres: adres, parametre: parametre };
})();
