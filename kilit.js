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
        try { return (window.appState && appState.userRole) || ''; } catch (e) { return ''; }
    }
    function girisliMi() {
        try {
            var u = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
            return !!(u && u.email && !u.isAnonymous);
        } catch (e) { return false; }
    }

    /* ------------------------------------------------ PERDE (tam ekran) */
    var PERDE_ID = 'siteKilitPerde';
    function perdeHtml(neden) {
        var mesaj = neden === 'yonetici'
            ? 'Site şu an <b>yalnız yönetici girişine</b> açık.'
            : 'Siteye devam etmek için <b>giriş yapman</b> gerekiyor.';
        var alt = neden === 'yonetici'
            ? 'Ders saatinde ya da yönetici izin verdiğinde yeniden açılır.'
            : 'Öğretmeninin sana verdiği hesapla giriş yapabilirsin.';
        return '' +
            '<div style="max-width:420px; text-align:center; padding:34px 26px; background:#fff; border-radius:22px;' +
            ' box-shadow:0 24px 60px rgba(0,0,0,.35);">' +
            '<svg viewBox="0 0 64 64" style="width:86px; height:86px;" aria-hidden="true">' +
            '<g class="kilit-govde"><rect x="14" y="27" width="36" height="27" rx="6" fill="#D84315"/>' +
            '<rect x="14" y="27" width="36" height="9" rx="5" fill="rgba(255,255,255,.14)"/>' +
            '<circle cx="32" cy="39" r="4.6" fill="#FFF3E0"/>' +
            '<rect x="30.2" y="41" width="3.6" height="7.5" rx="1.8" fill="#FFF3E0"/></g>' +
            '<path class="kilit-kulp" d="M21.5 27v-6.5a10.5 10.5 0 0 1 21 0V27" fill="none" stroke="#8D6E63"' +
            ' stroke-width="5.4" stroke-linecap="round"/>' +
            '<g class="kilit-parilti" stroke="#F39C12" stroke-width="2.4" stroke-linecap="round">' +
            '<path d="M8 20l4 2.4M56 20l-4 2.4M32 6.5v4"/></g></svg>' +
            '<style>' +
            '@keyframes kilitSalla{0%,86%,100%{transform:rotate(0)}90%{transform:rotate(-3.5deg)}95%{transform:rotate(3deg)}}' +
            '.kilit-govde{transform-origin:32px 40px; animation:kilitSalla 3.2s ease-in-out infinite}' +
            '@keyframes kilitIsik{0%,100%{opacity:.25}50%{opacity:1}}' +
            '.kilit-parilti{animation:kilitIsik 2.2s ease-in-out infinite}' +
            '</style>' +
            '<h2 style="margin:14px 0 8px; color:#9C3B0C; font-size:1.35rem;">Site Kilitli</h2>' +
            '<p style="margin:0 0 6px; color:#5A4034; font-size:.95rem; line-height:1.6;">' + mesaj + '</p>' +
            '<p style="margin:0 0 18px; color:#A6836E; font-size:.8rem;">' + alt + '</p>' +
            (girisliMi()
                ? '<p style="margin:0; color:#B9770E; font-size:.82rem;">Bu hesabın yetkisi bu kademe için yeterli değil.</p>'
                : '<button type="button" onclick="try{ if(typeof showLoginModal===\'function\'){' +
                  'var p=document.getElementById(\'' + PERDE_ID + '\'); if(p) p.style.pointerEvents=\'none\';' +
                  'setTimeout(function(){ if(p) p.style.pointerEvents=\'auto\'; }, 60000); showLoginModal(); } }catch(e){}"' +
                  ' style="padding:13px 34px; border:none; border-radius:12px; cursor:pointer; font-family:inherit;' +
                  ' font-weight:700; font-size:1rem; color:#fff;' +
                  ' background:linear-gradient(135deg,#F39C12,#D84315);">Giriş Yap</button>') +
            '</div>';
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
    function uygula() {
        var kilit = K.durum;
        if (kilit == null) {
            try { kilit = localStorage.getItem('siteKilitSon') || VARSAYILAN; } catch (e) { kilit = VARSAYILAN; }
        }
        var k = K.karar(kilit, girisliMi(), rolOku());
        if (k.izin) perdeKaldir();
        else perdeGoster(k.neden);
    }
    K.uygula = uygula;   /* test kancasi */

    /* ------------------------------------------------ BULUT BAGLANTISI */
    function baglan() {
        if (typeof firebase === 'undefined' || !firebase.apps || !firebase.apps.length ||
            !firebase.firestore) { setTimeout(baglan, 400); return; }
        try {
            firebase.firestore().collection('ayarlar').doc('site')
                .onSnapshot(function (doc) {
                    var v = (doc.exists && doc.data()) || {};
                    K.durum = (v.kilit === 'girisli' || v.kilit === 'yonetici') ? v.kilit : VARSAYILAN;
                    try { localStorage.setItem('siteKilitSon', K.durum); } catch (e) { }
                    uygula();
                    kilitPanelTazele();
                }, function (e) { console.warn('kilit ayari okunamadi:', e && (e.code || e.message)); });
            if (firebase.auth) firebase.auth().onAuthStateChanged(function () { setTimeout(uygula, 400); });
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
        if (!window.appState || appState.userRole !== 'admin') {
            yaz('Bu işlem yönetici hesabı ister (şu anki rol: ' + ((window.appState && appState.userRole) || 'yok') + ').', true);
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
