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
    var KORUMA_SURE = 7000;      /* görünümü koruma süresi (ms) */
    var KARARLI = 3;             /* kaç yoklama yerinde kalırsa perde kalkar */

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
            '#' + PERDE_ID + ' .sb-gec{ font-size:.86rem; color:#8A93A0;',
            '  opacity:0; transition:opacity .3s ease; }',
            '#' + PERDE_ID + '.sb-uzadi{ cursor:pointer; }',
            '#' + PERDE_ID + '.sb-uzadi .sb-gec{ opacity:1; }',
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
            '<div class="sb-alt">liste açılıyor…</div>' +
            '<div class="sb-gec">beklemek istemezsen dokun, siteye geç</div>';
        p.addEventListener('click', function () { dur(); perdeKapa(); });
        (document.body || document.documentElement).appendChild(p);

        /* body henüz yoksa (betik <head> içinde) hazır olunca taşı. */
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', function () {
                try { document.body.appendChild(p); } catch (e) { }
            }, { once: true });
        }
        /* İş uzarsa çıkış kapısını göster. */
        setTimeout(function () {
            var q = document.getElementById(PERDE_ID);
            if (q) q.classList.add('sb-uzadi');
        }, 3200);
    }

    function perdeKapa() {
        var p = document.getElementById(PERDE_ID);
        if (!p) return;
        p.classList.add('sb-kalk');
        setTimeout(function () {
            try { if (p.parentNode) p.parentNode.removeChild(p); } catch (e) { }
        }, 320);
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
        }, 300);
    }

    function ac(h) {
        uygula(h);
        koru(h);
    }

    /* Sekme içinde başka sınıfa geçilirse adres de onu göstersin —
       böylece yenileme/yer imi her zaman EKRANDAKİ sınıfa gider. */
    function adresIzle() {
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
            /* (b) sekme içinde sınıf değiştiyse adres de onu göstersin. */
            try {
                if (!window.llAktifSinif) return;
                var a = window.llAktifSinif();
                if (!a || !a.lId || !a.cId) return;
                var su = parametre();
                if (su && su.lId === a.lId && su.cId === a.cId) return;
                history.replaceState(null, '', adres(a.lId, a.cId) + location.hash);
            } catch (e) { }
        }, 1000);
    }

    var hedef = parametre();
    if (hedef) {
        var bilgi = kayitliAd(hedef);
        if (bilgi) {
            /* Sınıf bu tarayıcıda kayıtlı: hem perde hem başlıksız sekme.
               Kayıtlı değilse ikisi de yok — giriş ekranı ya da anasayfa
               başlığıyla birlikte normal açılsın. */
            perdeAc(bilgi);
            basligiGizle();
        }

        var tur = 0;
        var zaman = setInterval(function () {
            tur++;
            if (hazirMi(hedef)) { clearInterval(zaman); ac(hedef); adresIzle(); return; }
            if (tur > 60) { clearInterval(zaman); perdeKapa(); basligiGeriVer(); }  /* ~15 sn */
        }, 250);
    }

    window.KidefSinifBag = {
        adres: adres, parametre: parametre,
        ac: ac, perdeKapa: perdeKapa,
        basligiGeriVer: basligiGeriVer
    };
})();
