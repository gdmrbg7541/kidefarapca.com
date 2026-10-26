/* =====================================================================
   ÖĞRENCİ · SINIFIM                                (sistem/sinifim.js)
   ---------------------------------------------------------------------
   Öğretmen (26.10.2026): "öğrenci sisteme kayıt yapmışsa bi sınıf
   seçsin ya da bi öğretmenin belirlediği bi sınıfa tanımlanmışsa o
   sınıfın flipbookuna ve materyallere ulaşabilsin, yani öğretmene benzer
   bi şekilde materyallere ulaşabilecek ama sadece kendi kişisel
   bilgilere ve o sınıfın materyallerine".

   KİM GÖRÜR: yalnız e-postayla giriş yapmış ÖĞRENCİ. Ziyaretçi, misafir,
   anonim katılım, öğretmen ve yönetici görmez; rol çözülene kadar
   bölüm hiç çizilmez. Her kilit kipinde durur — 🎓 Sadece Girişliler
   kipinde İmam Hatip öğrenciye gizli olduğu için öğrencinin materyal
   kapısı burasıdır (bkz. sistem/ihgorunum.js). Türkçe dışındaki dillerde
   gizli (data-kd-yalniz-tr, sistem/dil.js).

   SINIF NEREDEN GELİR
     1) Öğretmeninin sınıfına bağlıysa (hesap/ogrencihesap.js → OH.bag,
        durum 'onayli'): o sınıfın seviyesi — seviye adı «7. Sınıflar» →
        7; tanınmazsa sınıf adı «7-B» → 7. Birden çok öğretmen varsa
        öğretmen seçici (OH.ogretmenSec, öbür ekranlarla aynı seçim).
     2) Değilse öğrenci kendisi seçer (5–10). Seçim bu tarayıcıda
        (localStorage kidefSinifim:<uid> → {n, t}) ve hesabında
        (kullanicilar/{uid} → sinifSecimi, sinifSecimiT; başka cihazda
        da gelsin, yönetici de görsün) durur; yenisi kazanır.
        «Öğretmenimin kodu var» → OH.kodModalAc().

   İÇERİK — öğretmen belgeleri (plan, sınav, defter, BEP…) YOK:
     · Ders Kitabı ve yanında Kidef Arapça kitabı (A4 kitaplar; index.html
       → ihKitapKur)
     · Etkinlik kartları (Muhâdese, Alfabe, Kelime Listeleri…; index.html
       → ihIcKur — İmam Hatip ve sınıf panelindeki Materyaller ile AYNI
       kaynak; öğretmene özel kartlar kendini zaten gizliyor)
     · «Kişisel bilgilerim» → öğrenci profili (toggleStudentProfile)
   BİÇİM: İmam Hatip'in ince ayarları sistem/materyalstil.css'te
   #llMateryalKap için yazılı; aynı kurallar çalışırken (CSSOM'dan)
   #sinifimKap'a kopyalanır — İmam Hatip'in biçimi değişince bu da değişir.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefSinifim) return;

    var BOLUM_ID = 'sinifim', KAP_ID = 'sinifimKap';
    var SEVIYELER = [5, 6, 7, 8, 9, 10];
    /* İmam Hatip akordiyonundaki sınıf renkleri */
    var RENK = { 5: '#16A085', 6: '#F39C12', 7: '#2563EB', 8: '#7C3AED', 9: '#EE5253', 10: '#0E9E86' };

    function kac(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function rgba(hex, a) {
        var h = String(hex || '#16A085').replace('#', '');
        return 'rgba(' + parseInt(h.substr(0, 2), 16) + ',' + parseInt(h.substr(2, 2), 16) + ',' +
            parseInt(h.substr(4, 2), 16) + ',' + a + ')';
    }
    function renkler(n) {
        var c = RENK[n] || '#16A085';
        return '--ihc:' + c + ';--ihcy:' + rgba(c, '.10') + ';--ihcb:' + rgba(c, '.34') +
            ';--ihck:' + rgba(c, '.26') + ';--snc:' + c + ';--snz:' + rgba(c, '.10');
    }

    /* ------------------------------------------------------ ROL KAPISI */
    function oturum() {
        try {
            var u = (window.firebase && firebase.auth) ? firebase.auth().currentUser : null;
            return (u && u.email && !u.isAnonymous) ? u : null;
        } catch (e) { return null; }
    }
    /* appState "let" ile tanımlı: çıplak adla okunur. Misafir kabuğu
       (initAppAsGuest → 'student') rol sayılmaz; o anda bu hesabın rol
       önbelleğine (sistem/rol.js, uid'ye bağlı) bakılır. */
    function rol(u) {
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

    /* ------------------------------------------- ÖĞRETMENİN SINIFI (OH) */
    var yuklendi = {}, ilkGorulme = {};
    /* Bağlar okunmadan çizilirse bağlı öğrenci bir an «sınıfını seç»
       görürdü: OH.baglantiyiYukle bitince işaretlenir (en çok 5 sn
       beklenir — okuma hiç bitmezse de bölüm açılsın). */
    function ohSarmala() {
        var O = window.OH;
        if (!O || typeof O.baglantiyiYukle !== 'function' || O.baglantiyiYukle.__snm) return;
        var eski = O.baglantiyiYukle;
        var yeni = function () {
            var u = oturum(), uid = u ? u.uid : '';
            var p = eski.apply(this, arguments);
            var bitti = function () { if (uid) yuklendi[uid] = 1; setTimeout(function () { ciz(); }, 0); };
            if (p && typeof p.then === 'function') p.then(bitti, bitti); else bitti();
            return p;
        };
        yeni.__snm = true;
        O.baglantiyiYukle = yeni;
    }
    function bagHazir(uid) {
        if (yuklendi[uid]) return true;
        try { if (window.OH && OH.bag) return true; } catch (e) { }
        if (!ilkGorulme[uid]) ilkGorulme[uid] = Date.now();
        return Date.now() - ilkGorulme[uid] > 5000;
    }
    function seviyeNo(ad) {
        try {
            if (window.KidefSinifMateryal && KidefSinifMateryal.seviyeNo) return KidefSinifMateryal.seviyeNo(ad);
        } catch (e) { }
        var m = String(ad || '').match(/\d+/), n = m ? parseInt(m[0], 10) : 0;
        return SEVIYELER.indexOf(n) >= 0 ? n : 0;
    }
    function bagBilgi() {
        var b = null;
        try { b = window.OH ? OH.bag : null; } catch (e) { }
        if (!b) return null;
        return {
            durum: b.durum || '', ogretmenUid: b.ogretmenUid || '',
            ogretmen: b.ogretmenAd || '', sinif: b.sinifAd || '', seviyeAd: b.seviyeAd || '',
            no: (b.durum === 'onayli') ? (seviyeNo(b.seviyeAd) || seviyeNo(b.sinifAd)) : 0
        };
    }
    function seciciBaglar() {
        try { return (window.OH && OH.seciciBaglar) ? OH.seciciBaglar() : []; } catch (e) { return []; }
    }

    /* ---------------------------------------------- KENDİ SEÇTİĞİ SINIF */
    function anahtar(uid) { return 'kidefSinifim:' + uid; }
    function yerelOku(uid) {
        try {
            var v = JSON.parse(localStorage.getItem(anahtar(uid)) || 'null');
            if (v && SEVIYELER.indexOf(+v.n) >= 0) return { n: +v.n, t: +v.t || 0 };
        } catch (e) { }
        return null;
    }
    function yerelYaz(uid, n, t) {
        try { localStorage.setItem(anahtar(uid), JSON.stringify({ n: n, t: t })); } catch (e) { }
    }
    var bulutBakildi = {};
    function buluttanOku(uid) {
        if (bulutBakildi[uid]) return;
        bulutBakildi[uid] = 1;
        try {
            firebase.firestore().collection('kullanicilar').doc(uid).get().then(function (d) {
                var v = (d && d.exists && d.data()) || {};
                var n = parseInt(v.sinifSecimi, 10), t = +v.sinifSecimiT || 0;
                if (SEVIYELER.indexOf(n) < 0) return;
                var y = yerelOku(uid);
                if (!y || t > y.t) { yerelYaz(uid, n, t); ciz(true); }
            }).catch(function () { });
        } catch (e) { }
    }
    function bulutaYaz(uid, n, t) {
        try {
            firebase.firestore().collection('kullanicilar').doc(uid)
                .update({ sinifSecimi: n, sinifSecimiT: t })
                .catch(function (e) {
                    try { console.warn('Sınıfım: seçim hesaba yazılamadı:', e && (e.code || e.message)); } catch (x) { }
                });
        } catch (e) { }
    }

    /* ----------------------------------------------------------- SVG'LER */
    var KISI_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.6" fill="none" stroke="currentColor" stroke-width="1.9"/>' +
        '<path d="M4.8 20c.6-3.8 3.6-6 7.2-6s6.6 2.2 7.2 6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';
    var ANAHTAR_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8.4" cy="9.6" r="3.9" fill="none" stroke="currentColor" stroke-width="1.9"/>' +
        '<path d="M11.2 12.4 20 21.2M17.2 18.4l2-2M14.6 15.8l1.6-1.6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';
    var KALEM_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1-4.2L15.6 5.2a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.2 19 4 20z" fill="none"' +
        ' stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M13.8 7l3.2 3.2" stroke="currentColor" stroke-width="1.8"/></svg>';
    var OGRETMEN_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3.5" width="18" height="11.5" rx="2" fill="#EAF6F3" stroke="#16A085" stroke-width="1.5"/>' +
        '<path d="M6.5 7.5h7M6.5 10.5h4.5" stroke="#F39C12" stroke-width="1.5" stroke-linecap="round"/>' +
        '<circle cx="16.5" cy="13.6" r="2.6" fill="#F6D3B5" stroke="#16A085" stroke-width="1.2"/>' +
        '<path d="M12.2 21c.5-2.6 2.2-4 4.3-4s3.8 1.4 4.3 4" fill="#16A085"/></svg>';
    var SAAT_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6" fill="#FEF5E7" stroke="#E67E22" stroke-width="1.7"/>' +
        '<path d="M12 7.4V12l3.2 2" fill="none" stroke="#E67E22" stroke-width="1.8" stroke-linecap="round"/></svg>';

    /* Başlıktaki madalyon: cinsiyet biliniyorsa çocuk, değilse sırt çantası.
       Göz kırpma CSS'le (hareketi azalt / düşük güç kipinde durur). */
    function figur() {
        var g = '';
        try { g = (typeof appState !== 'undefined' && appState && appState.currentUserGender) || ''; } catch (e) { }
        var goz = '<ellipse class="snm-goz" cx="23.6" cy="25.4" rx="1.5" ry="1.8" fill="#2F3A4A"/>' +
                  '<ellipse class="snm-goz" cx="32.4" cy="25.4" rx="1.5" ry="1.8" fill="#2F3A4A"/>';
        var yuz = '<rect x="25" y="33" width="6" height="6" fill="#EAB892"/>' +
                  '<circle cx="28" cy="24.5" r="10.4" fill="#F6D3B5"/>' + goz +
                  '<circle cx="21" cy="29" r="2.1" fill="#F59E9E" opacity=".55"/><circle cx="35" cy="29" r="2.1" fill="#F59E9E" opacity=".55"/>' +
                  '<path d="M24.6 29.6q3.4 2.6 6.8 0" fill="none" stroke="#B4533C" stroke-width="1.6" stroke-linecap="round"/>';
        var askilar = '<path d="M19.6 41.5 21.6 56M36.4 41.5 34.4 56" stroke="#F39C12" stroke-width="3.2" stroke-linecap="round"/>';
        if (g === 'kadin') {
            return '<svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="28" fill="#FBEDF4"/>' +
                '<circle cx="15.2" cy="26" r="4.2" fill="#3E2C23"/><circle cx="40.8" cy="26" r="4.2" fill="#3E2C23"/>' +
                '<path d="M9 56c0-9.6 8.4-16 19-16s19 6.4 19 16z" fill="#EE5253"/>' + askilar + yuz +
                '<path d="M17.4 24.6c0-7.4 4.8-11.6 10.6-11.6s10.6 4.2 10.6 11.6c-2.4-4.8-6-6.2-10.6-6.2s-8.2 1.4-10.6 6.2z" fill="#3E2C23"/>' +
                '<circle cx="35.6" cy="15.4" r="2.2" fill="#F39C12"/></svg>';
        }
        if (g === 'erkek') {
            return '<svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="28" fill="#EAF2FB"/>' +
                '<path d="M9 56c0-9.6 8.4-16 19-16s19 6.4 19 16z" fill="#2563EB"/>' + askilar + yuz +
                '<path d="M17.6 23.4c0-6.8 4.6-10.6 10.4-10.6 6 0 10.4 3.6 10.4 10.2-2.6-3.2-5.4-4.4-9.4-4.4-4.6 0-7.8 1.6-11.4 4.8z" fill="#3E2C23"/></svg>';
        }
        return '<svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="28" fill="#EAF6F3"/>' +
            '<path d="M19 22a9 9 0 0 1 18 0" fill="none" stroke="#0E7C66" stroke-width="3" stroke-linecap="round"/>' +
            '<rect x="14.5" y="20" width="27" height="25" rx="7" fill="#16A085"/>' +
            '<rect x="19" y="31" width="18" height="10" rx="3" fill="#0E7C66"/>' +
            '<path d="M19 31h18" stroke="#F39C12" stroke-width="2.2" stroke-linecap="round"/>' +
            '<circle cx="28" cy="36" r="1.7" fill="#F39C12"/>' +
            '<path class="snm-yildiz" d="M40.5 12.5l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2z" fill="#F39C12"/></svg>';
    }

    /* ------------------------------------------------------------ BİÇİM */
    function stilKur() {
        if (document.getElementById('snmStil')) return;
        var B = '#' + BOLUM_ID;
        var s = document.createElement('style');
        s.id = 'snmStil';
        s.textContent = [
            B + '{ display:none; }',
            B + '.gor{ display:block; }',
            /* Kilitli sitede öğrenci ana sayfada yalnız Değerler Eğitimi ·
               Sosyal Hesaplar'ı görüyor (26.10: Oyunlar da kapalı; sistem/erisim.js,
               body.erisim-ogrenci-kisit). Sınıfım bu kısıtın dışında: kendi
               sınıfının kitabı ve etkinlikleri. Seçici o kuraldan özgül. */
            'body.erisim-ogrenci-kisit #home-hub-section ' + B + '.gor{ display:block !important; }',
            B + ' h2.snm-bas{ display:flex; align-items:center; gap:10px; flex-wrap:wrap;',
            '  padding:10px 12px; margin:0 0 12px; border-radius:16px; min-height:74px; }',
            B + ' .snm-fig{ width:56px; height:56px; flex:0 0 auto; border-radius:50%; overflow:hidden;',
            '  display:inline-block; margin:0 4px 0 6px;',
            '  box-shadow:0 0 0 3px #fff, 0 0 0 4.5px var(--snb, rgba(22,160,133,.30)); }',
            B + ' .snm-fig svg{ width:100%; height:100%; display:block; }',
            B + ' .snm-goz{ transform-box:fill-box; transform-origin:center; animation:snmKirp 4.4s infinite; }',
            B + ' .snm-yildiz{ transform-box:fill-box; transform-origin:center; animation:snmParla 2.6s ease-in-out infinite; }',
            '@keyframes snmKirp{ 0%,88%,100%{ transform:scaleY(1) } 92%{ transform:scaleY(.12) } }',
            '@keyframes snmParla{ 0%,100%{ transform:scale(.6); opacity:.5 } 50%{ transform:scale(1.1); opacity:1 } }',
            '@media (prefers-reduced-motion: reduce){ ' + B + ' .snm-goz,' + B + ' .snm-yildiz{ animation:none } }',
            'html.dusuk-guc ' + B + ' .snm-goz, html.dusuk-guc ' + B + ' .snm-yildiz{ animation:none }',
            B + ' .snm-cip{ display:inline-flex; align-items:center; font-size:.9rem; font-weight:800; line-height:1;',
            '  color:#fff; background:var(--snc,#16A085); padding:7px 13px; border-radius:999px;',
            '  box-shadow:0 2px 6px rgba(0,0,0,.12); white-space:nowrap; }',
            B + ' .snm-profil{ margin-inline-start:auto; display:inline-flex; align-items:center; gap:7px;',
            '  cursor:pointer; font-family:inherit; font-size:.84rem; font-weight:700; line-height:1;',
            '  color:#1E4E8C; padding:9px 14px 9px 11px; border:1.5px solid #CFE0F5; border-radius:999px;',
            '  background:#F4F8FE; transition:background .15s, border-color .15s, transform .15s; }',
            B + ' .snm-profil:hover{ background:#E6F0FC; border-color:#9CC1EE; transform:translateY(-1px); }',
            B + ' .snm-profil svg{ width:18px; height:18px; flex:0 0 auto; }',

            /* durum şeridi */
            B + ' .snm-serit{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin:0 0 14px;',
            '  padding:10px 14px; border-radius:14px; background:linear-gradient(135deg, var(--snz,#EAF6F3) 0%, #fff 75%);',
            '  border:1px solid #E3E8EF; border-left:5px solid var(--snc,#16A085); color:#33414F;',
            '  font-size:.9rem; line-height:1.5; }',
            B + ' .snm-serit.bekle{ --snc:#E67E22; --snz:#FEF5E7; }',
            B + ' .snm-serit > svg{ width:26px; height:26px; flex:0 0 auto; }',
            B + ' .snm-serit .snm-yazi{ flex:1 1 230px; }',
            B + ' .snm-serit b{ color:#1F2430; }',
            B + ' .snm-tuslar{ display:inline-flex; gap:8px; flex-wrap:wrap; }',
            B + ' .snm-tus{ display:inline-flex; align-items:center; gap:6px; cursor:pointer; font-family:inherit;',
            '  font-size:.82rem; font-weight:700; line-height:1; padding:8px 13px; border-radius:999px;',
            '  border:1.5px solid #D5DCE5; background:#fff; color:#33414F; transition:border-color .15s, color .15s, background .15s; }',
            B + ' .snm-tus:hover{ border-color:var(--snc,#16A085); color:var(--snc,#16A085); }',
            B + ' .snm-tus svg{ width:16px; height:16px; flex:0 0 auto; }',
            B + ' .snm-ogtler{ display:flex; gap:6px; flex-wrap:wrap; align-items:center; flex-basis:100%; }',
            B + ' .snm-ogt{ cursor:pointer; font-family:inherit; font-size:.8rem; font-weight:700; padding:6px 12px;',
            '  border-radius:999px; border:1.5px solid #D5DCE5; background:#fff; color:#33414F; }',
            B + ' .snm-ogt.secili{ background:#16A085; border-color:#16A085; color:#fff; cursor:default; }',
            B + ' .snm-ogt small{ opacity:.75; font-weight:600; }',

            /* sınıf seçici */
            B + ' .snm-sec{ background:#fff; border:1.5px dashed #C7D0DA; border-radius:16px; padding:18px 14px 16px;',
            '  text-align:center; margin:0 0 6px; }',
            B + ' .snm-sec-bas{ font-size:.92rem; color:#4A5563; margin:0 0 14px; line-height:1.5; }',
            B + ' .snm-sec-bas b{ display:block; color:#1F2430; font-size:1.06rem; margin-bottom:2px; }',
            B + ' .snm-sec-izgara{ display:grid; grid-template-columns:repeat(6, minmax(0, 92px)); justify-content:center; gap:12px; }',
            B + ' .snm-sv{ cursor:pointer; font-family:inherit; aspect-ratio:1/1; border-radius:50%;',
            '  border:3px dashed var(--snc); background:#fff; color:var(--snc); padding:0;',
            '  display:flex; flex-direction:column; align-items:center; justify-content:center; line-height:1;',
            '  transition:transform .15s, background .15s, color .15s; }',
            B + ' .snm-sv b{ font-size:1.9rem; font-weight:800; }',
            B + ' .snm-sv small{ font-size:.64rem; font-weight:700; opacity:.85; margin-top:4px; }',
            B + ' .snm-sv:hover,' + B + ' .snm-sv.secili{ background:var(--snc); color:#fff; border-style:solid; transform:translateY(-2px); }',
            B + ' .snm-sec-alt{ display:flex; align-items:center; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:16px; }',
            B + ' .snm-sec-alt small{ flex-basis:100%; color:#8A93A0; font-size:.78rem; }',
            B + ' .snm-yok{ padding:6px 4px 2px; color:#8A93A0; font-size:.9rem; }',
            /* ders kitabı yoksa (10. sınıf seçmeli) ayırıcı da gizli */
            B + ' .snm-kitap:empty, ' + B + ' .snm-kitap:empty + .ihsec-ayirac{ display:none; }',

            '@media (max-width:560px){',
            '  ' + B + ' h2.snm-bas{ min-height:0; gap:8px; }',
            '  ' + B + ' .snm-fig{ width:44px; height:44px; margin:0 2px 0 2px; }',
            '  ' + B + ' .snm-cip{ font-size:.76rem; padding:6px 10px; }',
            '  ' + B + ' .snm-profil{ font-size:.74rem; padding:7px 11px 7px 9px; }',
            '  ' + B + ' .snm-serit{ font-size:.84rem; padding:9px 11px; }',
            '  ' + B + ' .snm-sec-izgara{ grid-template-columns:repeat(3, minmax(0, 84px)); gap:10px; }',
            '  ' + B + ' .snm-sv b{ font-size:1.6rem; } }'
        ].join('\n');
        (document.head || document.documentElement).appendChild(s);
    }

    /* İmam Hatip'in materyal kurallarını (sistem/materyalstil.css,
       #llMateryalKap) #sinifimKap'a kopyala. Dosya yüklenmemişse sonra
       yeniden denenir. */
    function kuralCevir(r) {
        if (!r) return '';
        if (r.type === 1) {
            if (String(r.selectorText || '').indexOf('#llMateryalKap') < 0) return '';
            return r.cssText.split('#llMateryalKap').join('#' + KAP_ID);
        }
        if ((r.type === 4 || r.type === 12) && r.cssRules) {
            var ic = [].map.call(r.cssRules, kuralCevir).filter(Boolean).join('\n');
            if (!ic) return '';
            var kosul = r.conditionText || (r.media && r.media.mediaText) || '';
            return (r.type === 4 ? '@media ' : '@supports ') + kosul + '{\n' + ic + '\n}';
        }
        return '';
    }
    function stilKopyala() {
        if (document.getElementById('snmKopyaStil')) return true;
        var parca = [], bulundu = false;
        [].forEach.call(document.styleSheets || [], function (sh) {
            if (String(sh.href || '').indexOf('materyalstil.css') < 0) return;
            var k = null;
            try { k = sh.cssRules; } catch (e) { return; }
            if (!k || !k.length) return;
            bulundu = true;
            [].forEach.call(k, function (r) { var t = kuralCevir(r); if (t) parca.push(t); });
        });
        if (!bulundu) return false;
        var s = document.createElement('style');
        s.id = 'snmKopyaStil';
        s.textContent = parca.join('\n');
        (document.head || document.documentElement).appendChild(s);
        return true;
    }

    /* ------------------------------------------------------------ ÇİZİM */
    function kabuk() {
        var b = document.getElementById(BOLUM_ID);
        if (b) return b;
        stilKur();
        b = document.createElement('section');
        b.id = BOLUM_ID;
        b.className = 'content-section';
        b.setAttribute('data-kd-yalniz-tr', '');
        /* Öğrencide Sınıflarım ve Sınıfta Yeni görünmez; Sınıfım onların
           yerinde, kataloğun hemen altında durur. */
        var once = document.getElementById('siniflarim') ||
                   document.getElementById('guncellemeler') ||
                   document.getElementById('imam-hatip');
        if (once && once.parentNode) once.parentNode.insertBefore(b, once);
        else {
            var hub = document.getElementById('home-hub-section');
            if (!hub) return null;
            hub.appendChild(b);
        }
        return b;
    }

    function baslikHtml(cip) {
        return '<h2 class="snm-bas">' +
            '<span class="snm-fig">' + figur() + '</span>' +
            '<span class="snm-ad">Sınıfım</span>' +
            (cip ? '<span class="snm-cip">' + kac(cip) + '</span>' : '') +
            '<button type="button" class="snm-profil" onclick="KidefSinifim.profil()"' +
            ' title="Profilin: kişisel bilgilerin ve öğretmenlerin">' + KISI_SVG +
            '<span>Kişisel bilgilerim</span></button>' +
            '</h2>';
    }

    function seciciHtml(secili, vazgec) {
        return '<div class="snm-sec">' +
            '<div class="snm-sec-bas"><b>Kaçıncı sınıftasın?</b>Seç — o sınıfın ders kitabı ve etkinlikleri burada açılsın.</div>' +
            '<div class="snm-sec-izgara">' + SEVIYELER.map(function (n) {
                return '<button type="button" class="snm-sv' + (n === secili ? ' secili' : '') + '"' +
                    ' style="--snc:' + RENK[n] + '" onclick="KidefSinifim.sec(' + n + ')"' +
                    ' aria-label="' + n + '. sınıf"><b>' + n + '</b><small>. sınıf</small></button>';
            }).join('') + '</div>' +
            '<div class="snm-sec-alt">' +
            '<button type="button" class="snm-tus" onclick="KidefSinifim.kod()">' + ANAHTAR_SVG +
            '<span>Öğretmenimin kodu var</span></button>' +
            (vazgec ? '<button type="button" class="snm-tus" onclick="KidefSinifim.vazgec()"><span>Vazgeç</span></button>' : '') +
            '<small>Öğretmeninin sınıfına katılırsan sınıfın buraya kendiliğinden gelir.</small>' +
            '</div></div>';
    }

    function ogretmenlerHtml(liste, aktifUid) {
        if (liste.length < 2) return '';
        return '<div class="snm-ogtler">' + liste.map(function (b) {
            var sec = String(b.ogretmenUid) === String(aktifUid);
            return '<button type="button" class="snm-ogt' + (sec ? ' secili' : '') + '"' +
                (sec ? '' : ' onclick="KidefSinifim.ogretmen(\'' + kac(String(b.ogretmenUid).replace(/'/g, '')) + '\')"') + '>' +
                kac(b.ogretmenAd || 'Öğretmen') + (b.sinifAd ? ' <small>· ' + kac(b.sinifAd) + '</small>' : '') +
                '</button>';
        }).join('') + '</div>';
    }

    function materyalHtml(n) {
        return '<div id="' + KAP_ID + '" class="kd-kitaplik" style="' + renkler(n) + '">' +
            '<div class="ihsec-item ihsec-bassiz"><div class="ihsec-panel"><div class="ihsec-panel-in">' +
            '<div class="snm-kitap" data-sinif="' + n + '"></div>' +
            '<div class="ihsec-ayirac" aria-hidden="true"></div>' +
            '<div class="ih-kartlar" data-sinif="' + n + '"></div>' +
            '</div></div></div></div>';
    }
    function materyalKur(b, n) {
        var kap = b.querySelector('#' + KAP_ID);
        if (!kap) return;
        if (!stilKopyala()) setTimeout(stilKopyala, 800);
        try {
            var k = kap.querySelector('.snm-kitap');
            if (window.ihKitapKur) { if (!window.ihKitapKur(k, n)) k.innerHTML = ''; }
        } catch (e) { }
        try { if (window.ihIcKur) window.ihIcKur(kap); } catch (e) {
            try { console.warn('Sınıfım: kartlar kurulamadı:', e && e.message); } catch (x) { }
        }
    }

    var sonImza = '', duzenle = false, sonUid = '';

    function gizle() {
        var b = document.getElementById(BOLUM_ID);
        if (b) { b.classList.remove('gor'); b.innerHTML = ''; }
        sonImza = ''; duzenle = false;
    }

    function ciz(zorla) {
        ohSarmala();
        var u = oturum();
        if (!u || rol(u) !== 'student') { gizle(); return; }
        if (u.uid !== sonUid) { sonUid = u.uid; duzenle = false; }
        if (!bagHazir(u.uid)) return;
        buluttanOku(u.uid);

        var bg = bagBilgi(), y = yerelOku(u.uid);
        var no = (bg && bg.no) || 0, kaynak = no ? 'ogretmen' : '';
        if (!no && y) { no = y.n; kaynak = 'kendi'; }
        var liste = seciciBaglar();
        var g = '';
        try { g = (typeof appState !== 'undefined' && appState && appState.currentUserGender) || ''; } catch (e) { }

        var imza = [u.uid, bg ? [bg.durum, bg.ogretmenUid, bg.ogretmen, bg.sinif, bg.seviyeAd].join('|') : '-',
            no, kaynak, duzenle ? 1 : 0, g,
            liste.map(function (b) { return b.ogretmenUid + ':' + (b.sinifAd || ''); }).join(',')].join('#');
        var b = document.getElementById(BOLUM_ID);
        if (!zorla && b && imza === sonImza && b.classList.contains('gor')) return;
        sonImza = imza;
        b = kabuk();
        if (!b) return;
        b.style.cssText = no ? renkler(no) : '';

        /* başlıktaki hap */
        var cip = '';
        if (kaynak === 'ogretmen') {
            cip = bg.sinif || (no + '. sınıf');
            if (bg.sinif && String(bg.sinif).indexOf(String(no)) < 0) cip += ' · ' + no + '. sınıf';
        } else if (no) cip = no + '. sınıf';

        var h = baslikHtml(cip);
        var bekliyor = !!(bg && bg.durum === 'bekliyor');
        var bagli = !!(bg && bg.durum === 'onayli');

        if (bagli) {
            h += '<div class="snm-serit">' + OGRETMEN_SVG +
                '<span class="snm-yazi">' +
                (bg.ogretmen ? 'Öğretmenin <b>' + kac(bg.ogretmen) + '</b>' : 'Öğretmeninin sınıfındasın') +
                (bg.sinif ? ' · sınıfın <b>' + kac(bg.sinif) + '</b>' : '') +
                (no ? (kaynak === 'kendi'
                        ? '. Sınıfının seviyesi 5–10 arasında görünmüyor; materyaller senin seçtiğin <b>' + no + '. sınıf</b> için.'
                        : '. Ders kitabın ve etkinliklerin aşağıda.')
                    : '. Sınıfının seviyesi 5–10 arasında görünmüyor; materyaller için sınıfını seç.') +
                '</span>' +
                (kaynak === 'kendi' && !duzenle
                    ? '<span class="snm-tuslar"><button type="button" class="snm-tus" onclick="KidefSinifim.degistir()">' +
                      KALEM_SVG + '<span>Değiştir</span></button></span>' : '') +
                ogretmenlerHtml(liste, bg.ogretmenUid) +
                '</div>';
        } else if (bekliyor) {
            h += '<div class="snm-serit bekle">' + SAAT_SVG +
                '<span class="snm-yazi">Öğretmenine gönderdiğin <b>katılım isteği onay bekliyor</b>. ' +
                'Onaylanınca sınıfın buraya kendiliğinden gelir' + (no ? '; şimdilik seçtiğin <b>' + no + '. sınıf</b> açık.' : '.') +
                '</span>' +
                (no && !duzenle
                    ? '<span class="snm-tuslar"><button type="button" class="snm-tus" onclick="KidefSinifim.degistir()">' +
                      KALEM_SVG + '<span>Değiştir</span></button></span>' : '') +
                '</div>';
        } else if (no && !duzenle) {
            h += '<div class="snm-serit">' + OGRETMEN_SVG +
                '<span class="snm-yazi"><b>' + no + '. sınıf</b> — kendi seçimin. Öğretmeninin sınıfına katılırsan ' +
                'sınıfın kendiliğinden gelir.</span>' +
                '<span class="snm-tuslar">' +
                '<button type="button" class="snm-tus" onclick="KidefSinifim.degistir()">' + KALEM_SVG + '<span>Değiştir</span></button>' +
                '<button type="button" class="snm-tus" onclick="KidefSinifim.kod()">' + ANAHTAR_SVG + '<span>Öğretmenimin kodu var</span></button>' +
                '</span></div>';
        }

        var seciciGerek = (kaynak !== 'ogretmen') && (!no || duzenle);
        if (seciciGerek) h += seciciHtml(kaynak === 'kendi' ? no : 0, duzenle && !!no);
        var materyal = no && !duzenle;
        if (materyal) h += materyalHtml(no);

        b.innerHTML = h;
        b.classList.add('gor');
        if (materyal) materyalKur(b, no);
    }

    /* --------------------------------------------------------- EYLEMLER */
    function sec(n) {
        n = parseInt(n, 10);
        var u = oturum();
        if (!u || SEVIYELER.indexOf(n) < 0) return;
        var t = Date.now();
        yerelYaz(u.uid, n, t);
        bulutaYaz(u.uid, n, t);
        duzenle = false;
        ciz(true);
        try {
            var b = document.getElementById(BOLUM_ID);
            if (b && b.scrollIntoView && b.getBoundingClientRect().top < 0) b.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (e) { }
    }
    function degistir() { duzenle = true; ciz(true); }
    function vazgec() { duzenle = false; ciz(true); }
    function kod() {
        try {
            if (window.OH && OH.kodModalAc) { OH.kodModalAc(); return; }
        } catch (e) { }
    }
    function ogretmen(uid) {
        try { if (window.OH && OH.ogretmenSec) OH.ogretmenSec(uid); } catch (e) { }
        setTimeout(function () { ciz(true); }, 50);
    }
    function profil() {
        try { if (typeof toggleStudentProfile === 'function') { toggleStudentProfile(); return; } } catch (e) { }
        try { if (typeof changeView === 'function') changeView('student-profile-section'); } catch (e) { }
    }

    /* Ders kitabı yılı değişince kart yeniden kurulsun. */
    document.addEventListener('kidef:veriyili', function () {
        try { if (document.getElementById(KAP_ID)) ciz(true); } catch (e) { }
    });

    /* ----------------------------------------------------------- NABIZ
       Oturum, rol ve öğretmen bağı asenkron geliyor; değişmedikçe
       hiçbir şey yeniden çizilmez (imza). */
    ohSarmala();
    var tur = 0;
    (function nabiz() {
        try { ciz(); } catch (e) { }
        tur++;
        setTimeout(nabiz, tur < 50 ? 600 : 2000);
    })();
    document.addEventListener('visibilitychange', function () { if (!document.hidden) { try { ciz(); } catch (e) { } } });

    window.KidefSinifim = {
        ciz: ciz, sec: sec, degistir: degistir, vazgec: vazgec, kod: kod,
        ogretmen: ogretmen, profil: profil
    };
})();
