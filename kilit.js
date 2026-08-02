/* ==========================================================================
   SITE ERISIM KILIDI  —  kilit.js  (v1)
   --------------------------------------------------------------------------
   Yonetici, profilindeki "Site Erisim Kilidi" panelinden siteyi uc kademede
   acip kapatir; ayar Firestore'da tek dokumandadir ve ANLIK uygulanir
   (acik sekmeler bile aninda kilitlenir/acilir):

     ayarlar/site  ->  { kilit: 'acik' | 'girisli' | 'yonetici' }

     🌍 acik     : herkes girer (varsayilan).
     🎓 girisli  : yalniz e-postayla giris yapmis kullanicilar (ogrenciler,
                   ogretmen, yonetici). Ders verirken disariya kapali kip.
     🔒 yonetici : yalniz yonetici. Baskasi girisli olsa da perde iner.

   Son bilinen kilit localStorage'da saklanir: kilitli sitede sayfa acilirken
   icerik gorunup kaybolmaz (perde aninda iner), bulut cevabi gelince tazelenir.

   DURUSTLUK NOTU: Site statik barindirildigi icin bu bir KAPI PERDESIDIR;
   normal ziyaretciyi durdurur. Ogrenci verilerinin asil korumasi Firestore
   kurallarindadir. Ayari yalniz yonetici degistirebilir (firestore.rules).
   ========================================================================== */
(function () {
    'use strict';

    var VARSAYILAN = 'acik';
    var K = window.SiteKilit = window.SiteKilit || {};
    K.durum = null;                 /* buluttan gelen guncel kilit kademesi */

    /* GOZLE kipi (or. indexyeni.html): kilit durumu OKUNUR ama perde HIC
       cizilmez — tanitim sayfasi her kademede acik kalir; sayfa yalniz
       SiteKilit.izinliMi() ile karari sorar. */
    var GOZLE = !!window.SITE_KILIT_GOZLE;

    /* Bu betik tek basina da calisabilsin (SDK'siz sayfalar): gerekirse
       Firebase'i kendi yukler, uygulama yoksa kendi baslatir. auth.js'teki
       "if (!firebase.apps.length)" korumasi sayesinde cakisma olmaz. */
    var CFG = {
        apiKey: "AIzaSyBGIQPJ_Bjm5I3-QmrrGpLR5MqmG3S5F8w",
        authDomain: "kidefarapca-98f9c.firebaseapp.com",
        projectId: "kidefarapca-98f9c",
        storageBucket: "kidefarapca-98f9c.firebasestorage.app",
        messagingSenderId: "503317118211",
        appId: "1:503317118211:web:a9c8cf15b854597e0b3d36"
    };
    var SDK = 'https://www.gstatic.com/firebasejs/8.10.1/';
    function sdkYukle(src) {
        return new Promise(function (res, rej) {
            var s = document.createElement('script');
            s.src = src; s.onload = res; s.onerror = rej;
            (document.head || document.documentElement).appendChild(s);
        });
    }

    /* ------------------------------------------------ SAF KARAR ISLEVI
       (test edilebilir) — kilit kademesi + kullanici durumuna gore:
       { izin: bool, neden: 'giris' | 'yonetici' | null } */
    K.karar = function (kilit, girisliMi, rol) {
        if (kilit !== 'girisli' && kilit !== 'yonetici') return { izin: true, neden: null };
        if (rol === 'admin') return { izin: true, neden: null };
        if (kilit === 'girisli') return girisliMi ? { izin: true, neden: null } : { izin: false, neden: 'giris' };
        return { izin: false, neden: 'yonetici' };
    };

    function rolOku() {
        /* DIKKAT: appState sayfada "let" ile tanimli -> window.appState YOKTUR;
           ciplak isimle (typeof korumali) okunmali (data/window.data dersi).
           appState olmayan sayfalarda (indexyeni) rol buluttan okunur. */
        try {
            var r = (typeof appState !== 'undefined' && appState && appState.userRole) || '';
            return r || K._bulutRol || '';
        } catch (e) { return K._bulutRol || ''; }
    }
    function girisliMi() {
        try {
            var u = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
            return !!(u && u.email && !u.isAnonymous);
        } catch (e) { return false; }
    }

    /* ------------------------------------------------ PERDE = DOGRUDAN GIRIS
       Kilitli sitede ara kart YOKTUR: turuncu fon iner ve kayit/giris
       penceresi (login-modal) KENDILIGINDEN acilir — index dogrudan giris
       ekrani olarak acilir. Pencere carpiyla kapatilirsa bekci ~2 sn icinde
       yeniden acar (kilitliyken site bosta gorunmez). Yalniz "girisli ama
       yetkisiz" hesaplar kisa bir aciklama karti gorur. */
    var PERDE_ID = 'siteKilitPerde';

    /* Giris molasi: Giris Yap'a basilinca perde gecici kalkar ki giris
       penceresi gorunebilsin. Giris olmazsa 90 sn sonra perde geri iner. */
    K.girisAc = function () {
        K._mola = Date.now() + 90000;   /* ust sinir (emniyet) */
        K._molaBas = Date.now();
        var p = document.getElementById(PERDE_ID);
        if (p) p.style.display = 'none';
        try { if (typeof showLoginModal === 'function') showLoginModal(); } catch (e) { }
    };
    /* Giris penceresi acik mi? (kapatilinca mola derhal biter) */
    function girisPenceresiAcik() {
        try {
            var lm = document.getElementById('login-modal');
            return !!(lm && window.getComputedStyle(lm).display !== 'none');
        } catch (e) { return false; }
    }

    function perdeHtml(neden) {
        if (girisliMi()) {
            return '<div style="max-width:440px; width:100%; text-align:center; padding:30px 26px;' +
                ' background:#fff; border-radius:20px; box-shadow:0 24px 60px rgba(0,0,0,.35);' +
                ' color:#B9770E; font-size:.92rem; line-height:1.6;">' +
                'Bu hesabın bu bölüm için yetkisi yok — ders saatinde ya da yönetici izin verdiğinde açılır.</div>';
        }
        /* Anonim ziyaretci: perde yalniz turuncu fondur; kayit/giris
           penceresi uygula() tarafindan dogrudan acilir. */
        return '';
    }

    /* Kayit/giris penceresini dogrudan ac (kapatilirsa bekci yeniden acar).
       ~2 sn kisitlama: carpi sonrasi cirpinma olmasin. */
    function girisEkraniAc() {
        if (girisPenceresiAcik()) return;
        var t = Date.now();
        if (t < (K._sonAc || 0) + 1800) return;
        K._sonAc = t;
        try {
            if (typeof showLoginModal === 'function') showLoginModal();
            else if (!/(?:^|\/)index\.html$|\/$/.test(location.pathname)) location.href = 'index.html';
        } catch (e) { }
    }
    function perdeGoster(neden) {
        var p = document.getElementById(PERDE_ID);
        if (!p) {
            p = document.createElement('div');
            p.id = PERDE_ID;
            p.setAttribute('style',
                'position:fixed; inset:0; z-index:100000000; display:flex; align-items:center; justify-content:center;' +
                ' padding:18px; background:linear-gradient(135deg,#FFC107 0%,#F39C12 45%,#EF5350 100%);');
            (document.body || document.documentElement).appendChild(p);
        }
        /* icerik anahtari: neden + giris durumu (giris yapinca mesaj degissin) */
        var anahtar = neden + (girisliMi() ? '-g' : '-a');
        if (p.getAttribute('data-neden') !== anahtar) {
            p.setAttribute('data-neden', anahtar);
            p.innerHTML = perdeHtml(neden);
        }
        p.style.display = 'flex';
    }
    function perdeKaldir() {
        var p = document.getElementById(PERDE_ID);
        if (p) p.remove();
    }

    /* ------------------------------------------------ DEGERLENDIRME */
    function sonKilit() {
        var kilit = K.durum;
        if (kilit == null) {
            try { kilit = localStorage.getItem('siteKilitSon') || VARSAYILAN; } catch (e) { kilit = VARSAYILAN; }
        }
        return kilit;
    }
    /* Sayfalarin sorabilecegi tek soru: bu ziyaretci su an iceri girebilir mi? */
    K.izinliMi = function () {
        return K.karar(sonKilit(), girisliMi(), rolOku()).izin;
    };
    function uygula() {
        if (GOZLE) return;          /* gozlem kipi: perde hic cizilmez */
        var kilit = sonKilit();
        var k = K.karar(kilit, girisliMi(), rolOku());
        if (k.izin) { K._mola = 0; perdeKaldir(); return; }
        /* Giris molasi: Giris Yap'a basildi, giris penceresi acik —
           perde gizli bekler. Pencere KAPATILIRSA (carpi) mola derhal
           biter ve perde geri iner; ust sinir 90 sn'dir. Ilk 2.5 sn
           pencere daha acilmamis olabilir diye kapali sayilmaz. */
        if (K._mola && Date.now() < K._mola) {
            var gecen = Date.now() - (K._molaBas || 0);
            if (gecen > 2500 && !girisPenceresiAcik()) {
                K._mola = 0;   /* carpiya basildi: kilit geri */
            } else {
                var p = document.getElementById(PERDE_ID);
                if (p) p.style.display = 'none';
                return;
            }
        }
        perdeGoster(k.neden);
        if (!girisliMi()) girisEkraniAc();   /* dogrudan kayit/giris ekrani */
    }
    K.uygula = uygula;   /* test kancasi */

    /* ------------------------------------------------ BULUT BAGLANTISI */
    var sdkDeneniyor = false;
    function baglan() {
        if (typeof firebase === 'undefined') {
            /* SDK'siz sayfa (indexyeni gibi): Firebase'i kendimiz yukleriz */
            if (sdkDeneniyor) return;
            sdkDeneniyor = true;
            sdkYukle(SDK + 'firebase-app.js')
                .then(function () { return sdkYukle(SDK + 'firebase-auth.js'); })
                .then(function () { return sdkYukle(SDK + 'firebase-firestore.js'); })
                .then(function () { sdkDeneniyor = false; baglan(); })
                .catch(function () { sdkDeneniyor = false; setTimeout(baglan, 2500); });
            return;
        }
        if (!firebase.firestore || !firebase.auth) { setTimeout(baglan, 400); return; }
        if (!firebase.apps || !firebase.apps.length) {
            try { firebase.initializeApp(CFG); } catch (e) { setTimeout(baglan, 400); return; }
        }
        try {
            firebase.firestore().collection('ayarlar').doc('site')
                .onSnapshot(function (doc) {
                    var v = (doc.exists && doc.data()) || {};
                    K.durum = (v.kilit === 'girisli' || v.kilit === 'yonetici') ? v.kilit : VARSAYILAN;
                    try { localStorage.setItem('siteKilitSon', K.durum); } catch (e) { }
                    uygula();
                    kilitPanelTazele();
                }, function (e) { console.warn('kilit ayari okunamadi:', e && (e.code || e.message)); });
            if (firebase.auth) firebase.auth().onAuthStateChanged(function (u) {
                if (u) K._mola = 0;          /* giris geldi: mola biter, karar netlesir */
                K._bulutRol = '';
                /* appState olmayan sayfalarda rol dogrudan buluttan okunur
                   (kendi kullanicilar dokumani — kurallar izin verir). */
                if (u && u.email) {
                    try {
                        firebase.firestore().collection('kullanicilar').doc(u.uid).get().then(function (doc) {
                            K._bulutRol = ((doc.exists && doc.data()) || {}).role || '';
                            uygula();
                        }).catch(function () { });
                    } catch (e) { }
                }
                setTimeout(uygula, 400);
            });
        } catch (e) { console.warn('kilit:', e && e.message); }
        /* rol gec cozulur + perde elle silinirse geri gelsin: hafif bekci */
        setInterval(uygula, 1500);
    }

    /* ------------------------------------------------ YONETICI PANELI */
    window.kilitPanelHtml = function () {
        var kademe = [
            { k: 'acik',     ad: '🌍 Açık',              acikla: 'Herkes girebilir (normal durum).' },
            { k: 'girisli',  ad: '🎓 Sadece Girişliler', acikla: 'Yalnız hesapla giriş yapanlar: öğrencilerin ve sen. Ders kipinde dışarıya kapalı.' },
            { k: 'yonetici', ad: '🔒 Sadece Yönetici',   acikla: 'Herkese kapalı; yalnız yönetici girer. Öğrenciler de kilit ekranı görür.' }
        ];
        var simdiki = K.durum || VARSAYILAN;
        var adBul = { acik: '🌍 Açık', girisli: '🎓 Sadece Girişliler', yonetici: '🔒 Sadece Yönetici' };
        return '<div id="tpKilitGovde">' +
            '<p style="margin:0 0 8px; font-size:.85rem; color:#8B6A57;">Ayar anında uygulanır: açık sekmeler bile ' +
            'seçtiğin kademeye göre o an kilitlenir ya da açılır. Not: bu bir kapı perdesidir — öğrenci verilerinin ' +
            'asıl koruması her zaman açık olan bulut kurallarındadır.</p>' +
            '<p style="margin:0 0 12px; font-size:.8rem; color:#6B4A38; background:#FFF6EC; border:1px dashed #F0C9A6;' +
            ' border-radius:9px; padding:7px 11px;">Buluttaki ayar: <b style="color:#D84315;">' +
            (K.durum ? (adBul[K.durum] || K.durum) : '—') + '</b> · bağlantı: ' +
            (K.durum !== null ? '<b style="color:#1E8449;">canlı ✓</b>'
                : '<b style="color:#C0392B;">henüz yok</b> <small>(kurallar yayınlanmamış ya da bulut erişilemiyor olabilir)</small>') + '</p>' +
            kademe.map(function (s) {
                var secili = s.k === simdiki;
                return '<button type="button" data-kilit-kademe="' + s.k + '" onclick="kilitSec(\'' + s.k + '\')"' +
                    ' style="display:flex; align-items:flex-start; gap:12px; width:100%; text-align:left; margin:0 0 10px;' +
                    ' padding:13px 15px; border-radius:12px; cursor:pointer; font-family:inherit;' +
                    (secili
                        ? ' border:2px solid #D84315; background:linear-gradient(135deg,#FFF3E0,#FFE0B2); box-shadow:0 3px 10px rgba(216,67,21,.18);'
                        : ' border:1.5px solid #F0DACA; background:#fff;') + '">' +
                    '<span style="font-size:1.05rem; font-weight:800; color:' + (secili ? '#D84315' : '#8B6A57') + '; white-space:nowrap;">' + s.ad + '</span>' +
                    '<span style="flex:1; font-size:.8rem; color:#8B6A57; line-height:1.5;">' + s.acikla +
                    (secili ? ' <b style="color:#1E8449;">— şu an bu kademe açık ✓</b>' : '') + '</span></button>';
            }).join('') +
            '<p id="tpKilitNot" style="min-height:16px; margin:4px 0 0; font-size:.8rem; color:#16A085;"></p></div>';
    };
    function kilitPanelTazele() {
        var g = document.getElementById('tpKilitGovde');
        if (g && typeof window.kilitPanelHtml === 'function') g.outerHTML = window.kilitPanelHtml();
    }
    window.kilitSec = function (kademe) {
        /* cift tetiklenme kalkani: inline onclick + yedek dinleyici ayni
           tiklamada ikisi birden calisirsa tek yazim yapilir */
        var simdi = Date.now();
        if (K._sonSec && simdi - K._sonSec < 300) return;
        K._sonSec = simdi;
        var not = document.getElementById('tpKilitNot');
        var yaz = function (m, hata) { if (not) { not.style.color = hata ? '#E74C3C' : '#16A085'; not.textContent = m; } };
        yaz('Kaydediliyor…');   /* tiklama ulasti mi? aninda gorunur */
        var rol = rolOku();
        if (rol !== 'admin') {
            yaz('Bu işlem yönetici hesabı ister (şu anki rol: ' + (rol || 'yok') + ').', true);
            return;
        }
        try {
            firebase.firestore().collection('ayarlar').doc('site')
                .set({ kilit: kademe, guncelleme: Date.now() }, { merge: true })
                .then(function () { yaz('Kaydedildi — ayar anında uygulandı.'); })
                .catch(function (e) {
                    yaz(/permission/i.test(String(e && e.code))
                        ? 'İzin hatası: firestore.rules güncellenip konsoldan yayınlanmalı.'
                        : 'Kaydedilemedi: ' + ((e && (e.code || e.message)) || ''), true);
                });
        } catch (e) { yaz('Kaydedilemedi.', true); }
    };

    /* Yedek tiklama yolu: inline onclick herhangi bir sebeple calismazsa
       panel tuslari data-kilit-kademe uzerinden yine islesin. */
    try {
        document.addEventListener('click', function (e) {
            var t = e.target;
            while (t && t !== document) {
                if (t.getAttribute && t.getAttribute('data-kilit-kademe')) {
                    window.kilitSec(t.getAttribute('data-kilit-kademe'));
                    return;
                }
                t = t.parentNode;
            }
        }, true);
    } catch (e) { }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { uygula(); baglan(); });
    else { uygula(); baglan(); }
})();
