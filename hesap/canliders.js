/* ==========================================================================
   CANLI DERS — GİRİŞ VE ÇAĞRI (hesap/canliders.js)                 05.11.2026
   Yönetici: "özel dersler için … bir öğrenciye site üstünden ders verebilmesi" ·
   "şimdilik sadece yönetici hesabından denemek istiyorum, hazır olunca öğretmenlere
   açarız" · "amacımız kameradan çok sitedeki dosyaları kolaylıkla yansıtmak … öğrencinin
   cihazına öğretmenin kullandığı şekilde yansıtmak … kusursuz olmalı … sitede zaten
   kumanda özelliği var".

   ODA = TAHTA KABUĞU. Canlı ders, Tahtaya yansıt motorunun (sistem/tahta.js) canlı kipidir:
   öğretmen tahta.html?rol=yansit&canli=ders_<uid> (kumanda), öğrenci
   tahta.html?rol=izle&canli=ders_<uid> (yalnız izler). Öğretmenin açtığı sayfa, kaydırma,
   tıklama, video öğrencinin cihazında kendi çözünürlüğünde, keskin. Ses (ve istenirse
   kamera) kabukta küçük pencerede: hesap/canliOda.js (WebRTC, Cloudflare TURN).

   BU DOSYA (ana sayfa):
   · Yetkili (şimdilik yalnız yönetici — KIMLER): başlıkta canlı ders düğmesi ve Listelerim'de
     «Canlı ders» → öğrenci listesi (listelerim verisi; yoksa ogrenciBaglari) sessionStorage'a
     yazılır (kidef_canli_liste, kidef_canli_ad), kabuk açılır. Öğrenci kabuktaki pencereden çağrılır.
   · Öğrenci: canlı veritabanında canliCagri/<uid> dinlenir (öğretmen yazar: { oda, ad, t }).
     «<öğretmen> seni canlı derse çağırıyor» kartı + zil → «Derse katıl» kabuğa gider;
     «Şimdi değil» aynı çağrı için kartı kapatır. Ders bitince öğretmen çağrıyı siler.
   · Kabuğun çerçevesinde (tahta.html içindeki site) hiçbir şey yapmaz.
   Veritabanı kuralı: sistem/tahta.js başlığında (canli, canliCagri).
   ========================================================================== */
(function () {
    'use strict';
    if (window.KidefCanli) return;
    try { if (window.name === 'kidefTahta' || (window.parent !== window && window.parent.KidefTahta)) {
        window.KidefCanli = { ac: function () { }, kabukta: true, yetkili: function () { return false; } };
        /* paneldeki «Canlı Ders Başlat» kabuğun içinde (06.11.2026): yeni ders açılmaz, kısa bilgi */
        window.kidefCanliBaslat = function () {
            try { var T = window.parent.KidefTahta; T.bildir(T.canli ? 'Zaten canlı ders ekranındasın.' : 'Canlı dersi başlatmak için önce tahtaya yansıtmayı bitir.', 3000); } catch (e) { }
        };
        return;
    } } catch (e) { }
    var C = window.KidefCanli = {};
    /* ŞİMDİLİK YALNIZ YÖNETİCİ (05.11.2026): öğretmenlere açılınca 'teacher' eklenir */
    var KIMLER = ['admin'];
    /* sistem/tahta.js ve sistem/tahtagir.js'teki adresle aynı olmalı */
    var VT_ADRES = 'https://kidefarapca-98f9c-default-rtdb.europe-west1.firebasedatabase.app';
    var SDK = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js';
    var RED_ANAHTAR = 'kidef_canli_red';

    /* ---------------------------------------------------------------- yardımcılar */
    function fb() { return (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) ? firebase : null; }
    function oturum() { var f = fb(); try { return (f && f.auth) ? f.auth().currentUser : null; } catch (e) { return null; } }
    function veri() {
        var f = fb(); if (!f) return null;
        try { if (typeof db !== 'undefined' && db) return db; return f.firestore(); } catch (e) { return null; }
    }
    function rol() { try { return (typeof appState !== 'undefined' && appState.userRole) || ''; } catch (e) { return ''; } }
    function yetkili() { return KIMLER.indexOf(rol()) >= 0; }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
    function $(id) { return document.getElementById(id); }
    function benimAdim() {
        try { var a = appState.currentUserName; if (a && a !== 'Belirtilmedi' && a !== 'Öğrenci' && a !== 'Misafir Öğrenci') return a; } catch (e) { }
        var u = oturum(); return (u && (u.displayName || u.email)) || '';
    }
    function uyar(m) { if (typeof showCustomAlert === 'function') return showCustomAlert(m); alert(m); }
    C.odaId = function (uid) { return 'ders_' + String(uid || ''); };

    /* canlı veritabanı (sistem/tahtagir.js ile aynı yükleme) */
    var vt = null, vtYukleniyor = null;
    function vtHazir(cb) {
        if (vt) { cb(vt); return; }
        if (!window.firebase || !firebase.app) return;
        var kur = function () { try { vt = firebase.app().database(VT_ADRES); } catch (e) { vt = null; } if (vt) cb(vt); };
        if (firebase.database) { kur(); return; }
        if (!vtYukleniyor) {
            vtYukleniyor = [];
            var s = document.createElement('script');
            s.src = SDK; s.async = true;
            s.onload = function () { var l = vtYukleniyor; vtYukleniyor = null; kur(); l.forEach(function (f) { if (vt) f(vt); }); };
            s.onerror = function () { vtYukleniyor = null; };
            document.head.appendChild(s);
        }
        vtYukleniyor.push(cb);
    }

    /* ---------------------------------------------------------------- biçim */
    function stil() {
        if ($('kcd-stil')) return;
        var st = document.createElement('style');
        st.id = 'kcd-stil';
        st.textContent = [
            /* başlık düğmesi */
            '#tab-canli{display:none; position:relative; color:rgba(255,255,255,.8); text-decoration:none; align-items:center; justify-content:center;',
            '  padding:5px 9px; transition:all .2s; border-bottom:3px solid transparent;}',
            '#tab-canli:hover{color:#fff;}',
            /* Listelerim düğmesi */
            '#kcdListeTus{display:flex; align-items:center; justify-content:center; gap:8px; width:calc(100% - 10px); margin:0 5px 12px 5px; padding:9px 10px;',
            '  border-radius:9px; cursor:pointer; background:#fff; color:#B8322A; border:1px solid #F3C9C5; box-shadow:0 1px 3px rgba(216,67,21,.07);',
            '  font-family:inherit; font-size:.82rem; font-weight:700;}',
            '#kcdListeTus svg{width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round;}',
            /* öğrencinin çağrı kartı */
            '#kcdKart{position:fixed; right:16px; bottom:16px; z-index:10070; width:min(360px, calc(100vw - 32px)); background:#fff; color:#1F2430;',
            '  border-radius:16px; box-shadow:0 18px 46px rgba(0,0,0,.35); border:1px solid #F0DACA; padding:16px 18px; font-family:inherit;',
            '  animation:kcdGel .35s cubic-bezier(.2,.8,.2,1);}',
            '@keyframes kcdGel{from{opacity:0; transform:translateY(16px);} to{opacity:1; transform:none;}}',
            '#kcdKart .kcd-bas{display:flex; align-items:center; gap:12px; margin-bottom:10px;}',
            '#kcdKart .kcd-simge{width:46px; height:46px; border-radius:14px; display:flex; align-items:center; justify-content:center; color:#B34700;',
            '  background:#FFF1E2; animation:kcdZil 1.2s ease-in-out infinite;}',
            '#kcdKart .kcd-simge svg{width:26px; height:26px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round;}',
            '@keyframes kcdZil{0%,100%{transform:rotate(0)} 20%{transform:rotate(-12deg)} 40%{transform:rotate(10deg)} 60%{transform:rotate(-6deg)} 80%{transform:rotate(4deg)}}',
            '#kcdKart .kcd-bas b{display:block; font-size:1.02rem; color:#9C3B0C;}',
            '#kcdKart .kcd-bas span{font-size:.84rem; color:#6B4A38;}',
            '#kcdKart .kcd-tuslar{display:flex; gap:8px;}',
            '#kcdKart .kcd-katil{flex:1; border:0; border-radius:11px; padding:12px; background:linear-gradient(135deg,#20C997,#16A085); color:#fff; font-weight:800; font-size:.98rem; cursor:pointer; font-family:inherit;}',
            '#kcdKart .kcd-sonra{border:1px solid #F0DACA; border-radius:11px; padding:12px 14px; background:#fff; color:#B34700; font-weight:700; cursor:pointer; font-family:inherit;}',
            '@media (prefers-reduced-motion: reduce){#kcdKart, #kcdKart .kcd-simge{animation:none;}}',
            /* eski kamera odası (hesap/live-lesson.js) telefonda açılırsa tuşlar sığsın */
            '@media (max-width:600px){',
            '  #live-class-modal .live-class-controls{flex-wrap:wrap; justify-content:center; max-width:calc(100% - 12px); left:50%; gap:6px;}',
            '  #live-class-modal #btn-screen, #live-class-modal #btn-pip{display:none !important;}',
            '  #live-class-modal .tooltip-container{display:none !important;}',
            '}'
        ].join('\n');
        (document.head || document.documentElement).appendChild(st);
    }
    var SVG_DERS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 9l3 2-3 2M12 13h5"/></svg>';

    /* ================================================================ YETKİLİ (öğretmen) */
    /* sınıf listesindeki hesaplı öğrenciler (listelerim verisi) */
    function listedenOgrenciler() {
        var d = (typeof data !== 'undefined' && data) ? data : null, L = [], gor = {};
        if (!d || !d.levels) return null;
        var sira = (d.levelOrder && d.levelOrder.length) ? d.levelOrder : Object.keys(d.levels);
        sira.forEach(function (lId) {
            var lvl = d.levels[lId]; if (!lvl || !lvl.classes) return;
            Object.keys(lvl.classes).forEach(function (cId) {
                var cls = lvl.classes[cId] || {};
                (cls.students || []).forEach(function (s) {
                    if (!s || !s.hesapUid || gor[s.hesapUid]) return;
                    gor[s.hesapUid] = 1;
                    L.push({ uid: String(s.hesapUid), ad: String(s.name || s.hesapEmail || 'Öğrenci'), sinif: String(lvl.name || lId) + ' / ' + String(cls.name || cId) });
                });
            });
        });
        L.sort(function (a, b) { return a.ad.localeCompare(b.ad, 'tr'); });
        return L;
    }
    /* yedek: bulut bağları (listelerim verisi inmemişse) */
    function bagdanOgrenciler() {
        var u = oturum(), D = veri();
        if (!u || !D) return Promise.resolve([]);
        return D.collection('ogrenciBaglari').where('ogretmenUid', '==', u.uid).where('durum', '==', 'onayli').get().then(function (snap) {
            var L = [], gor = {};
            snap.forEach(function (d) {
                var v = d.data() || {}, uid = v.uid || String(d.id).split('__')[0];
                if (!uid || gor[uid]) return; gor[uid] = 1;
                L.push({ uid: String(uid), ad: String(v.ad || v.email || 'Öğrenci'), sinif: String(v.seviyeAd || '') + (v.sinifAd ? ' / ' + v.sinifAd : '') });
            });
            L.sort(function (a, b) { return a.ad.localeCompare(b.ad, 'tr'); });
            return L;
        }).catch(function () { return []; });
    }
    C.liste = function () {
        var L = listedenOgrenciler();
        if (L && L.length) return Promise.resolve(L);
        return bagdanOgrenciler().then(function (L2) { return (L2 && L2.length) ? L2 : (L || []); });
    };
    /* kabuğa geç: öğrenci listesi ve öğretmenin adı oturum deposunda (kabuk Firestore yüklemez) */
    C.ac = function () {
        var u = oturum();
        if (!u || !yetkili()) return;
        if (C.aciliyor) return;
        C.aciliyor = true;
        var git = function (L) {
            try {
                sessionStorage.setItem('kidef_canli_liste', JSON.stringify(L || []));
                sessionStorage.setItem('kidef_canli_ad', benimAdim() || 'Öğretmen');
            } catch (e) { }
            var adres = location.pathname.replace(/^.*\//, '') || 'index.html';
            var sayfa = adres + location.search + location.hash;
            location.href = 'tahta.html?rol=yansit&canli=' + encodeURIComponent(C.odaId(u.uid)) + '&sayfa=' + encodeURIComponent(sayfa);
        };
        var z = setTimeout(function () { git([]); }, 4000);
        C.liste().then(function (L) { clearTimeout(z); git(L); }, function () { clearTimeout(z); git([]); });
    };
    C.yetkili = function () { return yetkili() && !!oturum(); };
    /* PANELDEKİ «CANLI DERS BAŞLAT» (06.11.2026) — yönetici: "yönetici panelinden açınca farklı ve eski olan
       açıldı". Yönetici/öğretmen panelindeki düğme (hesap/teacher-admin.js) bu yeni canlı dersi açar (yetki:
       KIMLER); yetkisi henüz olmayan hesap (şimdilik öğretmen) eski odayla (hesap/live-lesson.js) sürer. */
    window.kidefCanliBaslat = function () {
        if (C.yetkili()) { C.ac(); return; }
        if (typeof window.openLiveClassRoom === 'function') window.openLiveClassRoom();
    };

    /* ================================================================ ÖĞRENCİ */
    var S = { ref: null, uid: null, kart: null, zilZaman: null, sonZil: 0, son: null };
    function dinle() {
        var u = oturum(); if (!u) return;
        if (S.ref && S.uid === u.uid) return;
        birak();
        vtHazir(function (db) {
            var uu = oturum(); if (!uu || S.ref) return;
            S.uid = uu.uid;
            S.ref = db.ref('canliCagri/' + uu.uid);
            S.ref.on('value', function (s) { cagriIsle(s.val()); }, function () { });
        });
    }
    function birak() {
        try { if (S.ref) S.ref.off(); } catch (e) { }
        S.ref = null; S.uid = null; S.son = null; kartKapat();
    }
    function reddedildi(v) {
        try { var r = JSON.parse(localStorage.getItem(RED_ANAHTAR) || 'null'); return !!(r && r.oda === v.oda && r.t === v.t); } catch (e) { return false; }
    }
    function cagriIsle(v) {
        S.son = v || null;
        if (!v || !v.oda || !/^ders_[A-Za-z0-9]{1,64}$/.test(String(v.oda))) { kartKapat(); return; }
        if (reddedildi(v)) { kartKapat(); return; }
        kartGoster(String(v.oda), String(v.ad || 'Öğretmenin'), v.t || 0);
    }
    function kartGoster(oda, ad, t) {
        stil();
        if (S.kart && S.kart.oda === oda && S.kart.t === t) return;
        kartKapat();
        var k = document.createElement('div');
        k.id = 'kcdKart'; k.setAttribute('role', 'alertdialog'); k.setAttribute('aria-label', ad + ' seni canlı derse çağırıyor');
        k.innerHTML =
            '<div class="kcd-bas"><div class="kcd-simge">' + SVG_DERS + '</div><div><b>' + esc(ad) + '</b><span>seni canlı derse çağırıyor</span></div></div>' +
            '<div class="kcd-tuslar"><button type="button" class="kcd-katil">Derse katıl</button><button type="button" class="kcd-sonra">Şimdi değil</button></div>';
        k.querySelector('.kcd-katil').onclick = function () { C.katil(oda); };
        k.querySelector('.kcd-sonra').onclick = function () {
            try { localStorage.setItem(RED_ANAHTAR, JSON.stringify({ oda: oda, t: t })); } catch (e) { }
            kartKapat();
        };
        document.body.appendChild(k);
        S.kart = { oda: oda, ad: ad, t: t, el: k };
        zil();
        if (S.zilZaman) clearTimeout(S.zilZaman);
        S.zilZaman = setTimeout(function () { if (S.kart && S.kart.oda === oda) zil(); }, 8000);
        try { document.title = '📹 ' + ad + ' çağırıyor — ' + (document.title.replace(/^📹 .*? — /, '')); } catch (e) { }
    }
    function kartKapat() {
        if (S.kart && S.kart.el && S.kart.el.parentNode) S.kart.el.parentNode.removeChild(S.kart.el);
        S.kart = null;
        if (S.zilZaman) { clearTimeout(S.zilZaman); S.zilZaman = null; }
        try { document.title = document.title.replace(/^📹 .*? — /, ''); } catch (e) { }
    }
    function zil() {
        if (Date.now() - S.sonZil < 3000) return;
        S.sonZil = Date.now();
        try {
            var ac = new (window.AudioContext || window.webkitAudioContext)();
            [[659.25, 0], [880, .18], [659.25, .36], [880, .54]].forEach(function (n) {
                var o = ac.createOscillator(), g = ac.createGain();
                o.type = 'sine'; o.frequency.value = n[0];
                g.gain.setValueAtTime(0.0001, ac.currentTime + n[1]);
                g.gain.exponentialRampToValueAtTime(0.09, ac.currentTime + n[1] + .03);
                g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + n[1] + .17);
                o.connect(g); g.connect(ac.destination);
                o.start(ac.currentTime + n[1]); o.stop(ac.currentTime + n[1] + .2);
            });
            setTimeout(function () { try { ac.close(); } catch (e) { } }, 1200);
        } catch (e) { }
    }
    C.katil = function (oda) {
        kartKapat();
        if (!/^ders_[A-Za-z0-9]{1,64}$/.test(String(oda || ''))) return;
        location.href = 'tahta.html?rol=izle&canli=' + encodeURIComponent(oda);
    };

    /* ================================================================ BAĞLANTIYLA KATILIM (06.11.2026)
       Yönetici: "canlı ders için link kopyalayıp başka cihazdan giriş yapmak isteyince siteye giriş istiyor,
       giriş yapıyorum ama tekrar giriş sayfasına yönlendiriyor". Ders kabuğu (tahta.html) giriş penceresi
       taşımaz; girişsiz açılan ders bağlantısı buraya gelir:
       · ?canlidonus=<oda> (kabuğun «Giriş yap» tuşu): giriş penceresi açılır, giriş yapınca derse dönülür.
       · ?donus=/tahta.html?…canli=<oda>… (sistem/kapi.js, öğretmen bağlantısı): giriş yapan odanın sahibi
         değilse öğrenci görünümüne gider — site kilidi («Sadece Yönetici» dahil) beklemez; sahibin
         dönüşünü sistem/kilit.js yapar.
       Odanın sahibi öğretmen görünümüne, başkası öğrenci görünümüne gider; kim girer, veritabanı kuralı
       (çağrılan öğrenci) karar verir. */
    function canliHedef() {
        try {
            var q = new URLSearchParams(location.search), oda = q.get('canlidonus') || '', yol = 'canlidonus';
            if (!oda) {
                var m = /^\/tahta\.html\?(?:[^#]*&)?canli=(ders_[A-Za-z0-9]{1,64})(?:&|#|$)/.exec(q.get('donus') || '');
                if (m) { oda = m[1]; yol = 'donus'; }
            }
            return /^ders_[A-Za-z0-9]{1,64}$/.test(oda) ? { oda: oda, yol: yol } : null;
        } catch (e) { return null; }
    }
    function biletHazir(u) {        /* sahibin öğretmen görünümü kapıdan geçer: ana sayfanın bileti yazılmış olsun */
        try { var b = JSON.parse(localStorage.getItem('kidefKapiBilet') || 'null'); return !!(b && b.uid === u.uid && b.t && Date.now() - b.t < 20 * 3600000); } catch (e) { return true; }
    }
    function canliDonusKur() {
        var h = canliHedef();
        if (!h || C.donusKuruldu) return;
        var f = fb();
        if (!f || !f.auth) { setTimeout(canliDonusKur, 300); return; }
        C.donusKuruldu = true;
        var bekle = 0;
        var git = function (u) {
            if (C.donuldu) return;
            var sahip = h.oda === C.odaId(u.uid);
            if (sahip && h.yol === 'donus') return;
            if (sahip && !biletHazir(u) && bekle++ < 20) { setTimeout(function () { git(u); }, 300); return; }
            C.donuldu = true;
            var hedef = sahip ? 'tahta.html?rol=yansit&canli=' + encodeURIComponent(h.oda) + '&sayfa=index.html'
                              : 'tahta.html?rol=izle&canli=' + encodeURIComponent(h.oda);
            try { location.replace(hedef); } catch (e) { location.href = hedef; }
        };
        f.auth().onAuthStateChanged(function (u) {
            if (u && !u.isAnonymous) { git(u); return; }
            if (h.yol === 'canlidonus' && !C.girisAcildi) {
                C.girisAcildi = true;
                setTimeout(function () {
                    var o = oturum();
                    if ((!o || o.isAnonymous) && typeof window.openLoginModal === 'function') { try { window.openLoginModal(); } catch (e) { } }
                }, 500);
            }
        });
    }

    /* ================================================================ BAŞLIK + LİSTELERİM DÜĞMELERİ, DÖNGÜ */
    function dugmeGuncelle() {
        var gor = yetkili() && !!oturum();
        var d = $('tab-canli');
        if (!d && gor) {
            var z = $('tab-istekler');
            if (z && z.parentNode) {
                stil();
                d = document.createElement('a');
                d.href = '#'; d.id = 'tab-canli'; d.title = 'Canlı ders — öğrencini derse çağır, açtığın her şey onun ekranında'; d.setAttribute('aria-label', d.title);
                d.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;">' +
                              '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 9l3 2-3 2M12 13h5"/></svg>';
                d.onclick = function (e) { e.preventDefault(); C.ac(); };
                z.parentNode.insertBefore(d, z);
            }
        }
        if (d) d.style.display = gor ? 'inline-flex' : 'none';
        /* Listelerim: «Bekleyen İstekler»in altına */
        var it = $('ohIstekTus'), lt = $('kcdListeTus');
        if (gor && it && !lt && it.parentNode) {
            stil();
            lt = document.createElement('button'); lt.type = 'button'; lt.id = 'kcdListeTus';
            lt.title = 'Öğrencini canlı derse çağır: açtığın sayfalar onun cihazında, sesli';
            lt.innerHTML = SVG_DERS + '<span>Canlı ders</span>';
            lt.onclick = function () { C.ac(); };
            it.parentNode.insertBefore(lt, it.nextSibling);
        } else if (lt && !gor && lt.parentNode) lt.parentNode.removeChild(lt);
        /* öğrenci: çağrı dinleyicisi */
        var u = oturum();
        if (u && rol() === 'student') dinle();
        else if (!u || rol() !== 'student') { if (S.ref || S.kart) birak(); }
    }
    function basla() {
        dugmeGuncelle();
        setInterval(dugmeGuncelle, 1500);
        canliDonusKur();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla);
    else basla();
})();
