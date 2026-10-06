/* =====================================================================
   KİDEF · SINIFA DOĞRUDAN BAĞLANTI          (sistem/sinifbag.js)
   ---------------------------------------------------------------------
   Öğretmen (06.10.2026):
     "sınıf listesine tıklayınca ayrı sekmede açılsın."
     "ayrıca yeni sekme açılırken liste açılmalı, tekrar indexin yeni
      bi sekmede açılmasının anlamı yok."

   NE YAPIYOR: adrese sınıfa giden bir kapı açıyor —

       index.html?sinif=<seviyeId>&sube=<sinifId>

   Site TEK SAYFA olduğu için dosya yine index.html; ama öğretmen
   anasayfayı GÖRMÜYOR. Sayfa bu adresle açılırken daha ilk boyamadan
   önce üstüne sınıfın adını taşıyan bir "liste açılıyor" perdesi
   çekiliyor; arkada görünüm Listelerim'e geçip sınıf seçiliyor ve perde
   ancak liste OTURDUKTAN sonra kalkıyor. Öğretmenin gördüğü sıra:

       (perde: 5/A · liste açılıyor…)  →  5/A listesi

   Anasayfa, güncellemeler, galeri hiç görünmüyor.

   NİYE "OTURANA KADAR": sitenin açılış akışı (Firebase oturumu gelince
   çalışan yönlendirme) görünümü kendi başına anasayfaya çekiyor. Bir
   kez changeView çağırmak yetmiyordu — açılış akışı sonradan üstüne
   yazıp öğretmeni yine anasayfada bırakıyordu. Bu yüzden açılıştan
   sonra kısa bir KORUMA var: görünüm Listelerim'de ve doğru sınıf seçili
   değilse yeniden uygulanıyor; üst üste üç yoklamada (~0,9 sn) yerinde
   kalırsa perde kalkıyor. Koruma en çok 7 saniye sürer, öğretmen ekrana
   dokunduğu anda da biter — kendi tıklamasıyla hiçbir zaman yarışmaz.

   PERDE SADECE EMİN OLUNCA: perde, bu sınıfın bu tarayıcıda KAYITLI
   olduğu localStorage'dan sayfa açılır açılmaz doğrulanırsa çekiliyor.
   Sınıf yoksa (bağlantı eski, veri başka hesapta, giriş yapılmamış)
   perde HİÇ çekilmiyor — yoksa öğretmen giriş ekranını göremez, boş bir
   perdeye bakakalırdı. O durumda sayfa normal açılır, veri sonradan
   gelirse sınıf yine seçilir. Perdeye dokunmak da onu kaldırır (çıkış
   kapısı: iş uzarsa öğretmen beklemek zorunda kalmasın).

   ADRES KALIYOR: ?sinif=… adres çubuğunda bırakılıyor (ilk sürümde
   siliniyordu). Sebebi: sekme artık "o sınıfın sekmesi"; öğretmen
   yenilediğinde ya da yer imine eklediğinde aynı sınıf açılsın. Sekme
   içinde rozetten başka bir sınıfa geçilirse adres de ona göre
   güncelleniyor (llAktifSinif saniyede bir yoklanıyor) — böylece
   yenileme her zaman EKRANDAKİ sınıfı geri getiriyor.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefSinifBag) return;

    var PERDE_ID = 'sbPerde';
    var YALNIZ = 'sb-yalniz-sinif';   /* <html> işareti: bu sekme sınıf sekmesi */
    var YALNIZ_OKUL = 'sb-yalniz-okul'; /* <html> işareti: bu sekme okul sekmesi */
    var KORUMA_SURE = 20000;     /* görünümü koruma süresi (ms) — bulut
                                    verisi geç gelebiliyor, panel ancak o
                                    zaman gerçekten açılıyor */
    var KARARLI = 2;             /* kaç yoklama yerinde kalırsa perde kalkar */
    var YOKLAMA = 150;           /* koruma yoklama aralığı (ms) — perde liste
                                    hazır olduktan sonra boşuna beklemesin */

    function parametre() {
        try {
            var p = new URLSearchParams(location.search);
            var l = p.get('sinif'), c = p.get('sube');
            return (l && c) ? { lId: l, cId: c } : null;
        } catch (e) { return null; }
    }

    /* Bir sınıfın adresi — anasayfadaki kartlar bunu kullanıyor. */
    function adres(lId, cId) {
        return 'index.html?sinif=' + encodeURIComponent(lId) +
               '&sube=' + encodeURIComponent(cId);
    }

    /* ---------------------------------------------------------------
       Perde için: sınıfın adını localStorage'dan SENKRON oku. Burada
       hesap/listelerim.js henüz çalışmamış olabilir; o yüzden veriye
       doğrudan bakılıyor. Bulunamazsa null döner ve perde çekilmez. */
    function kayitliAd(h) {
        try {
            var ham = localStorage.getItem('schoolData');
            if (!ham) return null;
            var d = JSON.parse(ham);
            var sv = d && d.levels && d.levels[h.lId];
            if (!sv) return null;
            var sn = sv.classes && sv.classes[h.cId];
            if (!sn) return null;
            var kurum = '';
            try {
                var kr = d.kurumlar && sv.kurumId && d.kurumlar[sv.kurumId];
                kurum = kr ? String(kr.name || '').trim() : '';
            } catch (x) { }
            return {
                ad: String(sn.name || sv.name || '').trim() || '—',
                kurum: kurum
            };
        } catch (e) { return null; }
    }

    /* ------------------------------------------------- ÜST ÇUBUK ----
       Öğretmen (06.10.2026): "yeni sekmede bi sınıf listesi açılınca
       header görülmesin, sadece sınıflar arasında gezilsin, anasayfa için
       diğer sekme kullanılsın."

       Bu sekme artık o sınıfın çalışma sekmesi: site başlığı (logo, menü,
       okul tuşu, profil) gizleniyor. Sınıflar arasında geçiş panelin kendi
       rozetinden — adın yanındaki ok — yapılıyor. Anasayfa, galeri, kurum
       işlemleri öbür sekmede.

       GİZLEME CSS İLE, satır içi stille değil: changeView her görünüm
       değişiminde header'ın display'ini kendisi eliyor (satır içi atama
       anında geri geliyordu).

       ÇIKMAZ SOKAK OLMASIN: sınıf açılamazsa ya da sekmede listeden
       çıkılırsa başlık geri geliyor — öğretmen başlıksız boş bir sayfada
       kalmasın. */
    function basligiGizle() {
        if (document.getElementById('sbYalnizStil')) return;
        var s = document.createElement('style');
        s.id = 'sbYalnizStil';
        s.textContent =
            'html.' + YALNIZ + ' header{ display:none !important; }\n' +
            'html.' + YALNIZ + ' #listelerim-section{ padding-top:10px; }';
        (document.head || document.documentElement).appendChild(s);
        document.documentElement.classList.add(YALNIZ);
    }

    function basligiGeriVer() {
        try { document.documentElement.classList.remove(YALNIZ); } catch (e) { }
    }

    /* ------------------------------------------------- SEKME ADI ----
       Öğretmen (06.10.2026): "bi sınıf açıldığında tarayıcı sekmesinde o
       sınıfın ismi görünsün."

       Tarayıcı sekmesi dar: yalnız ilk birkaç harf okunuyor. O yüzden
       sınıfın adı EN BAŞA konuyor ("5/A · kidefarapca.com"), site adı
       arkada kalıyor. Ad, perde için zaten senkron okunduğundan sayfa
       daha yüklenirken sekmede görünüyor; sınıf değişirse ad da
       değişiyor (aşağıdaki saniyelik yoklama). */
    var SITE_ADI = 'kidefarapca.com';

    function sekmeAdi(ad) {
        try {
            var yeni = (ad ? ad + ' · ' : '') + SITE_ADI;
            if (document.title !== yeni) document.title = yeni;
        } catch (e) { }
    }

    function kac(t) {
        return String(t == null ? '' : t).replace(/[&<>"]/g, function (k) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[k];
        });
    }

    /* ----------------------------------------------------- PERDE ---- */
    function perdeAc(bilgi) {
        if (document.getElementById(PERDE_ID)) return;

        var s = document.createElement('style');
        s.id = 'sbPerdeStil';
        s.textContent = [
            '#' + PERDE_ID + '{',
            '  position:fixed; inset:0; z-index:99999;',
            '  display:flex; flex-direction:column; align-items:center;',
            '  justify-content:center; gap:16px;',
            '  background:#EEF1F5; color:#1F2430; cursor:default;',
            '  font-family:inherit; opacity:1; transition:opacity .26s ease; }',
            '#' + PERDE_ID + '.sb-kalk{ opacity:0; pointer-events:none; }',
            '#' + PERDE_ID + ' .sb-ad{ font-size:1.42rem; font-weight:800;',
            '  letter-spacing:.01em; }',
            '#' + PERDE_ID + ' .sb-kurum{ font-size:.9rem; color:#8A93A0;',
            '  margin-top:-10px; }',
            '#' + PERDE_ID + ' .sb-alt{ font-size:.92rem; color:#5B6471; }',
            '#' + PERDE_ID + ' .sb-okul{ width:74px; height:74px; }',
            '#' + PERDE_ID + ' .sb-cubuk{ width:132px; height:4px; border-radius:2px;',
            '  background:#DCE3EB; overflow:hidden; }',
            '#' + PERDE_ID + ' .sb-cubuk i{ display:block; width:40%; height:100%;',
            '  border-radius:2px; background:#16A085; animation:sbKay 1.15s ease-in-out infinite; }',
            '@keyframes sbKay{ 0%{ transform:translateX(-100%) } 100%{ transform:translateX(250%) } }',
            '@keyframes sbKapi{ 0%,55%{ transform:rotateY(0) } 100%{ transform:rotateY(-62deg) } }',
            '#' + PERDE_ID + ' .sb-kapi{ transform-origin:9.4px 50%;',
            '  animation:sbKapi 1.5s .25s ease-in-out forwards; }',
            '@media (prefers-reduced-motion: reduce){',
            '  #' + PERDE_ID + ' .sb-cubuk i{ animation:none; width:100% }',
            '  #' + PERDE_ID + ' .sb-kapi{ animation:none }',
            '  #' + PERDE_ID + '{ transition:none } }'
        ].join('\n');
        (document.head || document.documentElement).appendChild(s);

        var p = document.createElement('div');
        p.id = PERDE_ID;
        p.setAttribute('role', 'status');
        p.setAttribute('aria-live', 'polite');
        /* Okul + açılan kapı: anasayfadaki sınıf kartlarıyla aynı dil. */
        p.innerHTML =
            '<svg class="sb-okul" viewBox="0 0 48 48" aria-hidden="true">' +
            '<path d="M24 4l19 9.6V17H5v-3.4z" fill="#D84315"/>' +
            '<rect x="8" y="17" width="32" height="25" rx="2.4" fill="#fff" stroke="#C7D0DA" stroke-width="1.6"/>' +
            '<rect x="12" y="21" width="7" height="6" rx="1.2" fill="#FDEBD0" stroke="#E0B37A" stroke-width="1.2"/>' +
            '<rect x="29" y="21" width="7" height="6" rx="1.2" fill="#FDEBD0" stroke="#E0B37A" stroke-width="1.2"/>' +
            '<rect x="19" y="30" width="10" height="12" rx="1.4" fill="#EAF6F3" stroke="#16A085" stroke-width="1.4"/>' +
            '<rect class="sb-kapi" x="19" y="30" width="10" height="12" rx="1.4" fill="#16A085"/>' +
            '</svg>' +
            '<div class="sb-ad">' + kac(bilgi.ad) + '</div>' +
            (bilgi.kurum ? '<div class="sb-kurum">' + kac(bilgi.kurum) + '</div>' : '') +
            '<div class="sb-cubuk"><i></i></div>' +
            '<div class="sb-alt">liste açılıyor…</div>';
        p.addEventListener('click', function () { dur(); perdeKapa(); });
        (document.body || document.documentElement).appendChild(p);

        /* body henüz yoksa (betik <head> içinde) hazır olunca taşı. */
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', function () {
                try { document.body.appendChild(p); } catch (e) { }
            }, { once: true });
        }
    }

    function perdeKapa() {
        var p = document.getElementById(PERDE_ID);
        if (!p) return;
        p.classList.add('sb-kalk');
        setTimeout(function () {
            try { if (p.parentNode) p.parentNode.removeChild(p); } catch (e) { }
        }, 320);
    }

    /* ====================================================== OKUL SEKMESİ
       Öğretmen (06.10.2026): "okul svg sine basınca da ayrı sekme açılsın,
       okul svg sine basınca sadece okul svg si açılsın arka kısımda sınıf
       listeleri açılmasın; açık olan okul svg sinde bi sınıfa basınca da
       ayrı sekmede sınıf listesi açılsın."

       Adres:  index.html?okul=1

       O sekmede YALNIZ okul penceresi var: site başlığı gizli, pencerenin
       arka perdesi saydam değil mat (arkada anasayfa sızmasın), Listelerim
       görünümüne geçilmiyor ve son sınıf geri açılmıyor (bunu
       hesap/listelerim.js, KidefSinifBag.yalnizOkul'a bakarak yapıyor).
       Pencereden bir sınıf seçilince sınıf KENDİ sekmesinde açılıyor;
       okul penceresi açık kalıyor, arka arkaya birkaç sınıf açılabilsin.
       Pencere kapatılınca sekme kendini kapatıyor; tarayıcı izin vermezse
       (adres elle açılmışsa olur) başlık geri gelip anasayfaya dönülüyor. */
    var yalnizOkul = false;
    var okulZaman = null;

    function okulAdres() { return 'index.html?okul=1'; }

    function okulSekmesiAc() {
        /* noopener YOK: sekmenin kendini kapatabilmesi için açan pencereyle
           bağı gerekiyor. Aynı köken, kendi sayfamız. */
        try { window.open(okulAdres(), '_blank'); }
        catch (e) { try { location.href = okulAdres(); } catch (x) { } }
    }

    function okulModuMu() {
        try { return new URLSearchParams(location.search).get('okul') === '1'; }
        catch (e) { return false; }
    }

    function okulStil() {
        if (document.getElementById('sbOkulStil')) return;
        var s = document.createElement('style');
        s.id = 'sbOkulStil';
        s.textContent = [
            /* pencerenin arka perdesi mat olsun: arkada site görünmesin */
            'html.' + YALNIZ_OKUL + ' #llOkulPopup{',
            '  background:#EEF1F5 !important; backdrop-filter:none !important; }',
            /* pencere bu sekmede tek başına: biraz daha geniş dursun */
            'html.' + YALNIZ_OKUL + ' #llOkulPopup .okul-panel{ max-height:94vh; }'
        ].join('\n');
        (document.head || document.documentElement).appendChild(s);
        document.documentElement.classList.add(YALNIZ_OKUL);
    }

    /* Sınıf yeni sekmede açıldıktan sonra kapı animasyonunu başa al —
       pencere açık kalıyor, öğretmen hemen başka bir sınıfa basabilsin. */
    function kapiSifirla() {
        try {
            var k = document.getElementById('llOkulPopup');
            if (!k) return;
            k.querySelectorAll('.acildi').forEach(function (x) { x.classList.remove('acildi'); });
            k.querySelectorAll('.aciliyor').forEach(function (x) { x.classList.remove('aciliyor'); });
            k.querySelectorAll('.girildi').forEach(function (x) { x.classList.remove('girildi'); });
        } catch (e) { }
    }

    function okulKur() {
        yalnizOkul = true;
        basligiGizle();
        okulStil();
        sekmeAdi('Okulum');
        perdeAc({ ad: 'Okulum', kurum: 'sınıflarım açılıyor' });

        var tur = 0, acildi = false;
        okulZaman = setInterval(function () {
            var z = okulZaman;
            tur++;
            if (!acildi) {
                if (typeof llOkulPopupAc === 'function') {
                    try { llOkulPopupAc(); acildi = true; perdeKapa(); } catch (e) { }
                } else if (tur > 60) {        /* ~15 sn: açılamadı */
                    clearInterval(z); okulZaman = null; perdeKapa(); basligiGeriVer();
                    try { document.documentElement.classList.remove(YALNIZ_OKUL); } catch (x) { }
                }
                return;
            }
            /* Pencere kapatıldıysa sekmeyi kapat. */
            if (!document.getElementById('llOkulPopup')) {
                clearInterval(z); okulZaman = null;
                try { window.close(); } catch (e) { }
                setTimeout(function () {         /* kapanmadıysa siteye dön */
                    try {
                        basligiGeriVer();
                        document.documentElement.classList.remove(YALNIZ_OKUL);
                        if (typeof changeView === 'function') changeView('home-hub-section');
                        history.replaceState(null, '', location.pathname);
                    } catch (x) { }
                }, 220);
            }
        }, 250);
    }

    /* OKUL PENCERESİNİ BU SEKMEDE AÇ (06.10.2026) — öğretmen: "sınıflarım
       kategorisinden bi sınıf ayrı bi sekmede açıldıktan sonra, sınıf
       değiştirince yeni sekmeden açılmasın."

       Sınıf sekmesindeki okul simgesi artık yeni sekme açmıyor: pencere bu
       sekmede açılıyor ve seçilen sınıf da bu sekmede geliyor. Böylece
       öğretmen bir sınıf sekmesinde kalıp sınıflar arasında geziyor, her
       geçişte yeni bir sekme birikmiyor.

       yalnizOkul bayrağı pencere açıkken kalkıyor; hesap/listelerim.js ona
       bakıp (a) arka planı değiştirmiyor, (b) sınıfı sinifaGec ile YERİNDE
       açıyor. Pencere seçim yapılmadan kapatılırsa bayrak iniyor. */
    function okulPencereAc() {
        var sinifSekmesi = !!parametre() ||
            document.documentElement.classList.contains(YALNIZ);
        if (!sinifSekmesi) {
            /* Anasayfa sekmesi: pencere eskisi gibi, sınıf da aynı sekmede
               seçilir (orada başlık da duruyor, bir şey saklamıyoruz). */
            try { if (typeof llOkulPopupAc === 'function') llOkulPopupAc(); } catch (e) { }
            return;
        }
        yalnizOkul = true;
        try { if (typeof llOkulPopupAc === 'function') llOkulPopupAc(); } catch (e) { }
        var z = setInterval(function () {        /* seçim yapılmadan kapatılırsa */
            if (document.getElementById('llOkulPopup')) return;
            clearInterval(z);
            if (!okulModuMu()) yalnizOkul = false;
        }, 400);
    }

    /* Okul sekmesinde ya da sınıf sekmesinde bir sınıfa basıldı: YENİ SEKME
       AÇMA, bu sekmeyi o sınıfın sekmesine çevir (06.10.2026 — öğretmen: "okul svg sine
       basınca ayrı bi sekme açılıyor ya, ordan bi sınıf açınca bi daha
       yeni sekmede açılmasın").
       Sayfa yeniden yüklenmiyor: pencere kapanıyor, okul sekmesi işareti
       kalkıyor, Listelerim'e geçilip sınıf seçiliyor, adres ve sekme adı
       o sınıfı gösteriyor. Yani sekme sayısı artmıyor; öğretmen okulu açtı,
       bir sınıfa girdi, aynı yerde kaldı. */
    function sinifaGec(lId, cId) {
        if (okulZaman) { clearInterval(okulZaman); okulZaman = null; }  /* "pencere kapandı → sekmeyi kapat" izlemesi dursun */
        yalnizOkul = false;
        try { document.documentElement.classList.remove(YALNIZ_OKUL); } catch (e) { }
        try { if (typeof llOkulPopupKapat === 'function') llOkulPopupKapat(); } catch (e) { }

        var h = { lId: lId, cId: cId };
        basligiGizle();                       /* sınıf sekmesinde de başlık yok */
        var b = kayitliAd(h);
        if (b) { perdeAc(b); sekmeAdi(b.ad); }
        try { history.replaceState(null, '', adres(lId, cId) + location.hash); } catch (e) { }
        ac(h);                                /* görünüm + seçim + koruma */
        adresIzle();
    }

    /* ------------------------------------------------------ AÇILIŞ -- */
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

    /* Ekranda gerçekten o sınıfın listesi mi var?
       ÖLÇÜT DOM: appState her yerde pencereye bağlı değil (kapsamı
       betiğin içinde kalabiliyor), o yüzden "hangi ekrandayım" sorusu
       görünür gerçeğe soruluyor — Listelerim bölümü açık mı, ve açık
       sınıf bizim istediğimiz sınıf mı. */
    function yerindeMi(h) {
        try {
            var ls = document.getElementById('listelerim-section');
            if (!ls || getComputedStyle(ls).display === 'none') return false;

            /* PANEL GERÇEKTEN AÇIK MI (06.10.2026 — "sınıf açılmıyor").
               Sınıfın seçili olması yetmiyor: #content, #ll-root.logged-in
               gelene kadar CSS'te !important ile kapalı; ayrıca bulut
               verisi gelince çalışan showLLPlaceholder() paneli "bir sınıf
               seç" yer tutucusuna çeviriyor. İkisinde de curLId/curCId
               yerinde kalıyor, yani veriye bakan ölçüt "oldu" diyor ama
               ekran boş. Artık ekrana bakıyoruz. */
            var c = document.getElementById('content');
            if (!c || getComputedStyle(c).display === 'none') return false;
            var ipucu = document.getElementById('ll-select-hint');
            if (ipucu && getComputedStyle(ipucu).display !== 'none') return false;
            var cubuk = document.querySelector('#content .tabs');
            if (cubuk && getComputedStyle(cubuk).display === 'none') return false;
            /* Panellerden biri açık mı: yer tutucu hepsinin "active"ini
               siliyor, selectClass ise panel açmıyor. Çubuk görünüp altı
               boş kalabiliyordu. */
            if (!document.querySelector('#content .tab-panel.active')) return false;

            if (!window.llAktifSinif) return true;      /* bilemiyorsak görünüm yeter */
            var a = window.llAktifSinif();
            return !!a && a.lId === h.lId && a.cId === h.cId;
        } catch (e) { return false; }
    }

    var ilkKurulum = true;
    function uygula(h) {
        try {
            changeView('listelerim-section');
            if (ilkKurulum && typeof initListelerim === 'function') {
                initListelerim();
                ilkKurulum = false;
            }
            try { selectClass(h.lId, h.cId); } catch (e) { }
            /* Yer tutucu paneli kapatmış olabilir; listelerim.js'in kendi
               llSonSinifAc'ında yaptığı gibi geri açıyoruz. */
            try {
                var c = document.getElementById('content');
                if (c) c.style.display = 'block';
                var ipucu = document.getElementById('ll-select-hint');
                if (ipucu) ipucu.style.display = 'none';
                var cubuk = document.querySelector('#content .tabs');
                if (cubuk) cubuk.style.display = '';
                /* Açık panel yoksa listeyi aç — rozete basınca olan şey. */
                if (!document.querySelector('#content .tab-panel.active') &&
                    typeof switchTab === 'function') switchTab(0);
            } catch (e) { }
        } catch (e) {
            try { console.warn('sınıf bağlantısı:', e && e.message); } catch (x) { }
        }
    }

    /* ----------------------------------------------------- KORUMA --- */
    var korumaZaman = null, elDegdi = false, basarili = false;
    function elDegdiYaz() { elDegdi = true; }
    function dur() {
        if (korumaZaman) { clearInterval(korumaZaman); korumaZaman = null; }
        document.removeEventListener('pointerdown', elDegdiYaz, true);
        document.removeEventListener('keydown', elDegdiYaz, true);
    }

    function koru(h) {
        var bitis = Date.now() + KORUMA_SURE, kararli = 0;
        document.addEventListener('pointerdown', elDegdiYaz, true);
        document.addEventListener('keydown', elDegdiYaz, true);
        korumaZaman = setInterval(function () {
            /* Öğretmen ekrana dokunduysa karışma: onun tıklaması kazanır. */
            if (elDegdi || Date.now() > bitis) {
                dur(); perdeKapa();
                if (!basarili) basligiGeriVer();   /* açılamadı: başlık geri */
                return;
            }
            if (!yerindeMi(h)) { kararli = 0; uygula(h); return; }
            basarili = true;
            kararli++;
            if (kararli >= KARARLI) { dur(); perdeKapa(); }
        }, YOKLAMA);
    }

    function ac(h) {
        uygula(h);
        koru(h);
    }

    /* Sekme içinde başka sınıfa geçilirse adres de onu göstersin —
       böylece yenileme/yer imi her zaman EKRANDAKİ sınıfa gider. */
    var adresIzleniyor = false;
    function adresIzle() {
        if (adresIzleniyor) return;          /* iki kez başlamasın */
        adresIzleniyor = true;
        var kacir = 0, basligaBakiliyor = true;
        setInterval(function () {
            /* (a) sekmede listeden çıkıldıysa site başlığını geri ver —
               iki yoklama üst üste: koruma sırasındaki anlık geçişler
               başlığı boşuna geri getirmesin. */
            try {
                if (basligaBakiliyor && basarili) {
                    var ls = document.getElementById('listelerim-section');
                    var acik = !!ls && getComputedStyle(ls).display !== 'none';
                    kacir = acik ? 0 : kacir + 1;
                    if (kacir >= 2) { basligiGeriVer(); basligaBakiliyor = false; }
                }
            } catch (e) { }
            /* (b) sekme içinde sınıf değiştiyse adres ve SEKME ADI da
               onu göstersin. */
            try {
                if (!window.llAktifSinif) return;
                var a = window.llAktifSinif();
                if (!a || !a.lId || !a.cId) return;
                var yeniAd = kayitliAd(a);
                if (yeniAd) sekmeAdi(yeniAd.ad);
                var su = parametre();
                if (su && su.lId === a.lId && su.cId === a.cId) return;
                history.replaceState(null, '', adres(a.lId, a.cId) + location.hash);
            } catch (e) { }
        }, 1000);
    }

    if (okulModuMu()) okulKur();

    var hedef = parametre();
    if (hedef) {
        var bilgi = kayitliAd(hedef);
        if (bilgi) {
            /* Sınıf bu tarayıcıda kayıtlı: hem perde hem başlıksız sekme.
               Kayıtlı değilse ikisi de yok — giriş ekranı ya da anasayfa
               başlığıyla birlikte normal açılsın. */
            perdeAc(bilgi);
            basligiGizle();
            sekmeAdi(bilgi.ad);          /* sekmede sınıf adı, daha yüklenirken */
        }

        var tur = 0;
        var zaman = setInterval(function () {
            tur++;
            if (hazirMi(hedef)) { clearInterval(zaman); ac(hedef); adresIzle(); return; }
            if (tur > 125) {                      /* ~15 sn: açılamadı */
                clearInterval(zaman); perdeKapa(); basligiGeriVer(); sekmeAdi('');
            }
        }, 120);
    }

    window.KidefSinifBag = {
        adres: adres, parametre: parametre, sekmeAdi: sekmeAdi,
        ac: ac, perdeKapa: perdeKapa,
        basligiGeriVer: basligiGeriVer,
        okulAdres: okulAdres, okulSekmesiAc: okulSekmesiAc,
        okulPencereAc: okulPencereAc, sinifaGec: sinifaGec,
        kapiSifirla: kapiSifirla,
        /* hesap/listelerim.js buna bakıyor: okul sekmesinde arka planı
           açmıyor ve sınıfı yeni sekmede açıyor. */
        get yalnizOkul() { return yalnizOkul; }
    };
})();
