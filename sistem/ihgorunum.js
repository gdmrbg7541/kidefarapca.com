/* =====================================================================
   İMAM HATİP — KİLİTLİ SİTEDE GÖRÜNÜM          (sistem/ihgorunum.js)
   ---------------------------------------------------------------------
   Yönetici (26.10.2026): "eğer sadece giriş yapanlara açarsak siteyi
   imam hatip kategorisi görünmesin çünkü sınıflarım kategorisini
   kullanmalarını teşvik etmek istiyorum ve hem daha çok veri toplarız
   ... hem sınıflardan açılan materyaller var hem imam hatip
   kategorisinde olması kafa karıştırabilir."
   Seçimler: gizli → öğretmen ve öğrenciler (yönetici görür); sınıfı
   olmayan öğretmende de gizli kalır, yerine «önce sınıf ekle» daveti.

   NE YAPAR — yalnız kilit 🎓 Sadece Girişliler (ya da 🔒 Sadece
   Yönetici) iken; 🌍 Açık kipte hiçbir şey değişmez:
     öğretmen  → İmam Hatip başlığı, ipucu ve 5–10 akordiyonu gizli.
                 Okul geneli «Öğretmen Dökümanları» yerinde kalır (zümre,
                 mevzuat… başka hiçbir yerde yok). Sınıflarım başlığının
                 altında kısa yol yazısı: sınıfa gir → Materyaller.
     öğrenci, veli, rolü henüz çözülmemiş hesap → bölümün tamamı gizli
                 (öğrenci materyallerine «Sınıfım»dan ulaşır:
                 sistem/sinifim.js).
     yönetici  → her şey görünür; başlığın altında küçük not.

   DOM'A DOKUNMAZ: bölüm yerinde durur — sınıf panelindeki Materyaller
   sekmesi ve öğrencinin Sınıfım bölümü aynı çizim işlevlerini
   (index.html → window.ihIcKur) kullanıyor. Yalnız <html>'e sınıf konur,
   gizleme CSS'le yapılır:
     kdih-tam  bölümün tamamı gizli      kdih-ogt  öğretmen görünümü
     kdih-yon  yönetici notu             kdih-sinifsiz  öğretmenin sınıfı yok
   (kd-girisli / kd-ogretmen başka iş görür — index.html, Sınıfta Yeni.)

   BAĞLANTILAR: #imam-hatip adresi (dersten «geri», eski yer imleri)
   gizliyken Sınıflarım'a (öğretmen) ya da Sınıfım'a (öğrenci) gider.
   Sınıf panelindeki İH rozet penceresi (sistem/ihoneri.js → ihSinifAc)
   öğretmenin o seviyedeki sınıfının Materyaller sekmesini açar.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefIhGorunum) return;

    var H = document.documentElement;

    /* --------------------------------------------------------- BİÇİM */
    function stilKur() {
        if (document.getElementById('kdihStil')) return;
        var s = document.createElement('style');
        s.id = 'kdihStil';
        s.textContent = [
            'html.kdih-tam #imam-hatip{ display:none !important; }',
            'html.kdih-ogt #imam-hatip > h2,',
            'html.kdih-ogt #imam-hatip > .ih-ipucu,',
            'html.kdih-ogt #imam-hatip > .ih-acc,',
            'html.kdih-ogt #imam-hatip > .kdih-not{ display:none !important; }',
            /* başlık gidince Öğretmen Dökümanları bölümün en üstünde: üst boşluk yok */
            'html.kdih-ogt #imam-hatip > .ih-genel-dok{ margin-top:0 !important; }',

            /* yönetici notu: başlığın hemen altında, ortada küçük hap */
            '#imam-hatip > .kdih-not{ display:none; align-items:center; gap:8px; width:max-content;',
            '  max-width:100%; box-sizing:border-box; margin:6px auto 4px; padding:7px 14px;',
            '  border-radius:999px; background:#FFF8E6; border:1px solid #F1D79A; color:#6B4E0E;',
            '  font-size:.82rem; line-height:1.45; }',
            'html.kdih-yon #imam-hatip > .kdih-not{ display:flex; }',
            '#imam-hatip > .kdih-not svg{ width:18px; height:18px; flex:0 0 auto; }',
            '#imam-hatip > .kdih-not b{ color:#5C430A; }',
            '@media (max-width:640px){ #imam-hatip > .kdih-not{ border-radius:12px; width:auto; } }',

            /* Sınıflarım kısa yol yazısı */
            '#siniflarim > .kdih-ipucu{ display:none; align-items:center; gap:10px; flex-wrap:wrap;',
            '  margin:2px 0 12px; padding:10px 14px; border-radius:14px;',
            '  background:linear-gradient(135deg,#EAF6F3 0%,#FFFFFF 75%);',
            '  border:1px solid #CFE8E0; border-left:5px solid #16A085;',
            '  color:#33414F; font-size:.9rem; line-height:1.5; }',
            'html.kdih-ogt #siniflarim.gor > .kdih-ipucu{ display:flex; }',
            '#siniflarim > .kdih-ipucu > svg{ width:26px; height:26px; flex:0 0 auto; }',
            '#siniflarim > .kdih-ipucu b{ color:#0E7C66; }',
            '#siniflarim > .kdih-ipucu .kdih-yazi{ flex:1 1 260px; }',
            '#siniflarim > .kdih-ipucu .kdih-yok,',
            'html.kdih-sinifsiz #siniflarim > .kdih-ipucu .kdih-var{ display:none; }',
            'html.kdih-sinifsiz #siniflarim > .kdih-ipucu .kdih-yok{ display:inline; }',
            '#siniflarim > .kdih-ipucu .kdih-ekle{ display:none; align-items:center; gap:6px;',
            '  cursor:pointer; font-family:inherit; font-size:.86rem; font-weight:800;',
            '  padding:8px 14px; border-radius:999px; border:0; background:#16A085; color:#fff; }',
            'html.kdih-sinifsiz #siniflarim > .kdih-ipucu .kdih-ekle{ display:inline-flex; }',
            '#siniflarim > .kdih-ipucu .kdih-ekle:hover{ background:#0E7C66; }',
            '#siniflarim > .kdih-ipucu .kdih-ekle svg{ width:16px; height:16px; }'
            /* koyu tema kuralı yok: sitenin bölümleri her temada açık renkli */
        ].join('\n');
        (document.head || H).appendChild(s);
    }

    /* ---------------------------------------------------------- DURUM */
    function kilit() {
        var k = null;
        try { k = window.SiteKilit ? window.SiteKilit.durum : null; } catch (e) { }
        if (k == null) { try { k = localStorage.getItem('siteKilitSon'); } catch (e) { } }
        return (k === 'girisli' || k === 'yonetici') ? k : 'acik';
    }
    function oturum() {
        try {
            var u = (window.firebase && firebase.auth) ? firebase.auth().currentUser : null;
            return (u && !u.isAnonymous) ? u : null;
        } catch (e) { return null; }
    }
    /* Rol: önce sayfanın çözdüğü (appState — "let", çıplak adla okunur),
       o yoksa bu hesabın rol önbelleği (sistem/rol.js, uid'ye bağlı).
       Misafir kabuğu (initAppAsGuest → 'student') rol sayılmaz. */
    function rol() {
        var u = oturum();
        if (!u) return '';
        var r = '';
        try {
            if (typeof appState !== 'undefined' && appState && appState.currentUser !== 'Misafir Öğrenci')
                r = appState.userRole || '';
        } catch (e) { }
        if (r === 'guest') r = '';
        if (!r) {
            try {
                var o = (window.KidefRol && KidefRol.onbellekOku) ? KidefRol.onbellekOku(u.uid) : null;
                if (o && o.rol) r = o.rol;
            } catch (e) { }
        }
        return r;
    }
    /* 'acik' | 'yon' | 'ogt' | 'tam' */
    function durum() {
        if (kilit() === 'acik') return 'acik';
        var r = rol();
        if (r === 'admin') return 'yon';
        if (r === 'teacher') return 'ogt';
        return 'tam';                 /* öğrenci, veli, rolü bilinmeyen */
    }
    function sinifVar() {
        try {
            var d = (typeof data !== 'undefined' && data) ? data : null;   /* hesap/listelerim.js */
            if (!d || !d.levels) return false;
            return Object.keys(d.levels).some(function (l) {
                var c = d.levels[l] && d.levels[l].classes;
                return !!(c && Object.keys(c).length);
            });
        } catch (e) { return false; }
    }
    /* «Önce sınıf ekle» yalnız bu hesabın bulut verisi geldikten sonra
       (listelerim.js → window._llBulutGeldi = uid): yeni cihazda sınıflar
       inene kadar sınıfı olan öğretmene yanlış davet çıkmasın. */
    function sinifsizMi() {
        var u = oturum();
        if (!u || sinifVar()) return false;
        try { return window._llBulutGeldi === u.uid; } catch (e) { return false; }
    }

    /* --------------------------------------------------- KÜÇÜK PARÇALAR */
    var GOZ_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.6 12s3.4-6.2 9.4-6.2 9.4 6.2 9.4 6.2-3.4 6.2-9.4 6.2S2.6 12 2.6 12z"' +
        ' fill="#FFF1C9" stroke="#B9770E" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="#B9770E"/>' +
        '<path d="M4 20 20 4" stroke="#B9770E" stroke-width="1.6" stroke-linecap="round"/></svg>';
    var KITAP_SVG = '<svg viewBox="0 0 32 32" aria-hidden="true">' +
        '<path d="M4 7.5c3.6-1.6 7.6-1.6 12 .8v17.4c-4.4-2.4-8.4-2.4-12-.8z" fill="#fff" stroke="#16A085" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M28 7.5c-3.6-1.6-7.6-1.6-12 .8v17.4c4.4-2.4 8.4-2.4 12-.8z" fill="#EAF6F3" stroke="#16A085" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M7.4 12.2c2-.5 4-.3 6 .6M7.4 16.2c2-.5 4-.3 6 .6M18.6 12.8c2-.9 4-1.1 6-.6M18.6 16.8c2-.9 4-1.1 6-.6"' +
        ' fill="none" stroke="#F39C12" stroke-width="1.5" stroke-linecap="round"/></svg>';
    var ARTI_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none"' +
        ' stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';

    function notKur() {
        var s = document.getElementById('imam-hatip');
        if (!s || s.querySelector(':scope > .kdih-not')) return;
        var n = document.createElement('div');
        n.className = 'kdih-not';
        n.innerHTML = GOZ_SVG + '<span><b>🎓 Sadece Girişliler</b> kipinde bu bölüm öğretmen ve öğrencilere gizli — ' +
            'öğretmenler sınıflarının <b>Materyaller</b> sekmesinden, öğrenciler <b>Sınıfım</b>dan ulaşıyor.</span>';
        var h2 = s.querySelector(':scope > h2');
        if (h2) h2.insertAdjacentElement('afterend', n);
        else s.insertBefore(n, s.firstChild);
    }

    /* Sınıflarım'ın başlığını sistem/siniflarim.js gerektiğinde baştan
       yazıyor (innerHTML); yazı kaybolursa nabız geri koyar. */
    function ipucuKur() {
        var b = document.getElementById('siniflarim');
        if (!b) return;
        var h2 = b.querySelector(':scope > h2');
        if (!h2) return;
        var ip = b.querySelector(':scope > .kdih-ipucu');
        if (ip && ip.previousElementSibling === h2) return;
        if (!ip) {
            ip = document.createElement('div');
            ip.className = 'kdih-ipucu';
            ip.innerHTML = KITAP_SVG +
                '<span class="kdih-yazi">' +
                '<span class="kdih-var"><b>İmam Hatip materyalleri sınıflarının içinde:</b> bir sınıfına gir → ' +
                '<b>Materyaller</b> sekmesi. Ders kitabı, belgeler ve etkinlik kartları sınıfın seviyesine göre açılır.</span>' +
                '<span class="kdih-yok"><b>Önce bir sınıf ekle.</b> 5–10. sınıfların ders kitabı, belgeleri ve ' +
                'etkinlik kartları sınıfının <b>Materyaller</b> sekmesinde açılır.</span>' +
                '</span>' +
                '<button type="button" class="kdih-ekle" onclick="if(window.KidefSiniflarim)KidefSiniflarim.sinifEkle()">' +
                ARTI_SVG + '<span>Sınıf ekle</span></button>';
        }
        h2.insertAdjacentElement('afterend', ip);
    }

    /* ------------------------------------------------- #imam-hatip ADRESİ */
    function gizliMi(d) { return d === 'tam' || d === 'ogt'; }
    function hedefBolum() {
        var d = durum(), r = rol();
        if (d === 'ogt') return 'siniflarim';
        if (d === 'tam' && r === 'student') return 'sinifim';
        return '';
    }
    function gorunur(el) {
        if (!el) return false;
        var st = getComputedStyle(el);
        return st.display !== 'none' && el.getBoundingClientRect().height > 0;
    }
    function oraya(id) {
        var n = 0;
        (function dene() {
            var el = document.getElementById(id);
            if (gorunur(el)) {
                try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { }
                return;
            }
            if (++n < 25) setTimeout(dene, 200);
        })();
    }
    function adresBak() {
        if (location.hash !== '#imam-hatip' || !gizliMi(durum())) return;
        if (!rol()) return;                   /* rol netleşince karar */
        var hedef = hedefBolum();
        try { history.replaceState(null, '', location.pathname + location.search + (hedef ? '#' + hedef : '')); } catch (e) { }
        if (hedef) oraya(hedef);
    }

    /* ----------------------------------- İH ROZET PENCERESİ (ihoneri.js) */
    function seviyeNo(ad) {
        try { if (window.KidefSinifMateryal && KidefSinifMateryal.seviyeNo) return KidefSinifMateryal.seviyeNo(ad); } catch (e) { }
        var m = String(ad || '').match(/\d+/);
        return m ? parseInt(m[0], 10) : 0;
    }
    function ogretmenSinifiAc(n) {
        try {
            var a = (window.KidefSinifMateryal && KidefSinifMateryal.aktif) ? KidefSinifMateryal.aktif() : null;
            if (a && a.no === n && typeof switchTab === 'function') { switchTab(13); return true; }
            var d = (typeof data !== 'undefined' && data) ? data : null;
            if (!d || !d.levels || typeof selectClass !== 'function') return false;
            var sira = (d.levelOrder && d.levelOrder.length) ? d.levelOrder : Object.keys(d.levels);
            for (var i = 0; i < sira.length; i++) {
                var lvl = d.levels[sira[i]];
                if (!lvl || !lvl.classes) continue;
                var cIds = Object.keys(lvl.classes);
                for (var j = 0; j < cIds.length; j++) {
                    var no = seviyeNo(lvl.name) || seviyeNo((lvl.classes[cIds[j]] || {}).name);
                    if (no !== n) continue;
                    /* sınıf çizimi bir yerde takılsa da sınıf seçilmiş olur:
                       Materyaller sekmesi yine açılsın */
                    try { selectClass(sira[i], cIds[j]); } catch (e) { }
                    setTimeout(function () { try { switchTab(13); } catch (e) { } }, 60);
                    return true;
                }
            }
        } catch (e) { }
        return false;
    }
    function sarmala() {
        var f = window.ihSinifAc;
        if (typeof f !== 'function' || f.__kdih) return;
        var yeni = function (n, bolum) {
            var d = durum();
            if (!gizliMi(d)) return f.apply(this, arguments);
            n = parseInt(n, 10) || 0;
            try { if (window.ihoPopKapat) window.ihoPopKapat(); } catch (e) { }
            if (d === 'ogt' && bolum !== 'ogretmen' && ogretmenSinifiAc(n)) return;
            /* Öğretmen Dökümanları açık kalıyor; diğerleri: kendi bölümüne */
            try { if (typeof changeView === 'function') changeView('home-hub-section'); } catch (e) { }
            if (d === 'ogt' && bolum === 'ogretmen') {
                setTimeout(function () {
                    var h = document.querySelector('#imam-hatip .ih-genel-dok .ihsec-head');
                    var it = h && h.closest('.ihsec-item');
                    if (h && it && !it.classList.contains('acik')) h.click();
                    else if (h) { try { h.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { } }
                }, 280);
                return;
            }
            var hedef = hedefBolum();
            if (hedef) setTimeout(function () { oraya(hedef); }, 200);
        };
        yeni.__kdih = true;
        window.ihSinifAc = yeni;
    }

    /* ---------------------------------------------------------- UYGULA */
    var son = null;
    function uygula() {
        var d = durum();
        H.classList.toggle('kdih-tam', d === 'tam');
        H.classList.toggle('kdih-ogt', d === 'ogt');
        H.classList.toggle('kdih-yon', d === 'yon' && kilit() === 'girisli');
        H.classList.toggle('kdih-sinifsiz', d === 'ogt' && sinifsizMi());
        if (d === 'yon') notKur();
        if (d === 'ogt') ipucuKur();
        sarmala();
        if (d !== son) son = d;
        adresBak();
    }

    stilKur();
    uygula();
    /* Rol ve kilit asenkron geliyor: ilk yarım dakika sık, sonra seyrek. */
    var tur = 0;
    (function nabiz() {
        try { uygula(); } catch (e) { }
        tur++;
        setTimeout(nabiz, tur < 60 ? 500 : 1500);
    })();
    window.addEventListener('hashchange', function () { try { uygula(); } catch (e) { } });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) { try { uygula(); } catch (e) { } } });

    window.KidefIhGorunum = { uygula: uygula, durum: durum, rol: rol };
})();
