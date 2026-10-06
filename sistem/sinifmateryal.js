/* =====================================================================
   KİDEF · SINIF MATERYALLERİ SEKMESİ      (sistem/sinifmateryal.js)
   ---------------------------------------------------------------------
   Öğretmen (06.10.2026): "eğer imam hatipten bi sınıfı varsa, 5-10 arası
   sınıf tanımlayınca otomatik olarak imam hatip seviyelerindeki belgeler
   etkinlik kartları da kendi sınıfları için bi kopya oluşsun, yani
   pratiklik olsun."

   NE YAPAR
   Sınıf panelinde "Materyaller" sekmesi açılır; içinde o sınıfın
   SEVİYESİNE ait İmam Hatip belgeleri (üstte) ve etkinlik kartları
   (altta) durur. Seviye, sınıfın bağlı olduğu seviyenin adındaki
   rakamdan okunur: "7. Sınıflar" → 7. Yani öğretmen 7-B'yi açtığı anda
   7. sınıf materyalleri onun sınıfının içinde olur; ayrıca bir şey
   yapması gerekmez.

   NİYE GERÇEK KOPYA DEĞİL
   Belge ve kart listesi KOPYALANMIYOR, aynı kaynaktan çiziliyor
   (index.html → ihdocKur / mhKur; ikisini window.ihIcKur çağırıyor).
   Sebebi şu: siteye yeni bir 7. sınıf belgesi eklendiğinde bütün 7.
   sınıflarda kendiliğinden belirsin. Gerçek kopya üretseydik eski
   kopyalar olduğu yerde kalır, zamanla her sınıfta farklı bir liste
   olurdu — aranan pratiklik tersine dönerdi.

   ÇİZİM MALİYETİ
   İmam Hatip bölümü de "tembel" kuruluyor (açılışta altı sınıfın
   hepsini çizmek sayfayı yavaşlatıyordu). Burası da öyle: sekmeye
   basılmadan hiçbir şey kurulmaz, kurulan da sınıf değişene kadar
   yerinde kalır.

   SEVİYESİ 5-10 DIŞINDA OLAN SINIF (Hazırlık, 11, kurs grubu…):
   sekme yine açılır ama içinde kısa bir açıklama durur — boş ekran
   bırakılmaz.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefSinifMateryal) return;

    var KAP_ID = 'llMateryalKap';
    var SEVIYELER = [5, 6, 7, 8, 9, 10];

    function kac(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /* Seviye adındaki ilk sayı: "7. Sınıflar" → 7, "Hazırlık" → 0 */
    function seviyeNo(ad) {
        var m = String(ad || '').match(/\d+/);
        var n = m ? parseInt(m[0], 10) : 0;
        return (SEVIYELER.indexOf(n) >= 0) ? n : 0;
    }

    /* Açık sınıfın seviyesi ve adı. listelerim.js'teki curLId/curCId
       modül içinde kaldığı için oradan küçük bir pencere açıldı
       (window.llAktifSinif). */
    function aktif() {
        try {
            var a = (typeof window.llAktifSinif === 'function') ? window.llAktifSinif() : null;
            if (!a || !a.lId) return null;
            var d = (typeof data !== 'undefined' && data) ? data : null;
            var lvl = d && d.levels ? d.levels[a.lId] : null;
            if (!lvl) return null;
            var sinif = (lvl.classes && a.cId) ? lvl.classes[a.cId] : null;
            return {
                lId: a.lId, cId: a.cId,
                seviyeAd: lvl.name || '',
                sinifAd: (sinif && sinif.name) || '',
                no: seviyeNo(lvl.name)
            };
        } catch (e) { return null; }
    }

    function stilKur() {
        if (document.getElementById('smtStil')) return;
        var s = document.createElement('style');
        s.id = 'smtStil';
        s.textContent = [
            '#' + KAP_ID + ' .smt-bas{ display:flex; align-items:center; gap:10px; flex-wrap:wrap;',
            '  margin:0 0 16px; padding:12px 16px; border-radius:14px;',
            '  background:linear-gradient(135deg,#FFF6EC 0%,#FFFFFF 70%);',
            '  border:1px solid #F3DCC2; border-left:5px solid #E67E22; }',
            '#' + KAP_ID + ' .smt-bas b{ color:#B9651A; font-size:1.02rem; }',
            '#' + KAP_ID + ' .smt-bas small{ color:#8A93A0; font-size:.85rem; flex-basis:100%; line-height:1.5; }',
            '#' + KAP_ID + ' .smt-yok{ padding:28px 18px; text-align:center; color:#8A93A0;',
            '  font-size:.95rem; line-height:1.6; }'
            /* .ihsec-ayirac ve öteki ince ayarlar sistem/materyalstil.css'te
               (İmam Hatip kurallarından üretiliyor); burada ezilmesin. */
        ].join('\n');
        document.head.appendChild(s);
    }

    /* ----------------------------------------------------------- ÇİZİM */
    var sonAnahtar = '';

    function ciz(zorla) {
        var panel = document.getElementById('tab13');
        if (!panel) return;
        var a = aktif();

        if (!a) {
            sonAnahtar = '';
            panel.innerHTML = '<div id="' + KAP_ID + '"><div class="smt-yok">' +
                'Önce bir sınıf seç.</div></div>';
            return;
        }

        /* Aynı sınıf için yeniden çizme: İmam Hatip bölümü gibi burası da
           ağır (SVG'li kartlar); sınıf değişmedikçe yerinde kalsın. */
        var anahtar = a.lId + '/' + a.cId + '/' + a.no;
        if (!zorla && anahtar === sonAnahtar && panel.querySelector('#' + KAP_ID)) return;
        sonAnahtar = anahtar;

        stilKur();

        if (!a.no) {
            panel.innerHTML = '<div id="' + KAP_ID + '">' +
                '<div class="smt-yok"><b>' + kac(a.seviyeAd || 'Bu seviye') + '</b> için hazır materyal yok.' +
                '<br>Belgeler ve etkinlik kartları 5–10. sınıflar için hazırlanıyor; ' +
                'seviyenin adında bu sınıflardan biri geçerse (örneğin “7. Sınıflar”) ' +
                'materyaller burada kendiliğinden görünür.</div></div>';
            return;
        }

        panel.innerHTML = '<div id="' + KAP_ID + '">' +
            '<div class="smt-bas">' +
            '<b>' + a.no + '. sınıf belgeleri ve etkinlikleri</b>' +
            '<small>' + kac(a.sinifAd || a.seviyeAd) + ' için İmam Hatip programından geliyor. ' +
            'Siteye yeni bir ' + a.no + '. sınıf belgesi eklendiğinde burada da kendiliğinden görünür.</small>' +
            '</div>' +
            '<div class="ihsec-item ihsec-bassiz"><div class="ihsec-panel"><div class="ihsec-panel-in">' +
            '<div class="ihdoc-acc" data-sinif="' + a.no + '"></div>' +
            '<div class="ihsec-ayirac" aria-hidden="true"></div>' +
            '<div class="ih-kartlar" data-sinif="' + a.no + '"></div>' +
            '</div></div></div></div>';

        /* Belgeleri ve kartları aynı kaynaktan kur (index.html → ihIcKur).
           ihIcKur bir kez kurduğu kabı işaretler; kabı her seferinde yeni
           oluşturduğumuz için işaret taze gelir. */
        try {
            var kap = document.getElementById(KAP_ID);
            if (window.ihIcKur) window.ihIcKur(kap);
        } catch (e) {
            try { console.warn('materyal kurulamadı:', e && e.message); } catch (x) { }
        }
    }

    /* Kitap/veri yılı değişince İmam Hatip de tazeleniyor; burası da. */
    document.addEventListener('kidef:veriyili', function () {
        try { if (document.getElementById('tab13') && sonAnahtar) ciz(true); } catch (e) { }
    });

    window.KidefSinifMateryal = { ciz: ciz, seviyeNo: seviyeNo, aktif: aktif };
})();
