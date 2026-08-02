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
        /* DIKKAT: appState sayfada "let" ile tanimli -> window.appState YOKTUR;
           ciplak isimle (typeof korumali) okunmali (data/window.data dersi). */
        try { return (typeof appState !== 'undefined' && appState && appState.userRole) || ''; } catch (e) { return ''; }
    }
    function girisliMi() {
        try {
            var u = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
            return !!(u && u.email && !u.isAnonymous);
        } catch (e) { return false; }
    }

    /* ------------------------------------------------ PERDE = TANITIM EKRANI
       Kilitli sitede ziyaretci "kilit" yazisi degil, siteyi TANITAN bir
       vitrin gorur: ogrenciye / ogretmene / kurumlara uc reklam karti,
       hepsi ozel animasyonlu SVG. Giris tusu perdeyi kenara cekip giris
       penceresini acar (mola sistemi). */
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

    function kartSvg(tur) {
        if (tur === 'ogrenci') /* KUPA: parlayan kupa + yukselen rekor cubuklari */
            return '<svg viewBox="0 0 64 64" aria-hidden="true">' +
                '<rect class="rk-bar rk-b1" x="8"  y="38" width="6" height="14" rx="2" fill="#E67E22"/>' +
                '<rect class="rk-bar rk-b2" x="17" y="32" width="6" height="20" rx="2" fill="#F39C12"/>' +
                '<rect class="rk-bar rk-b3" x="26" y="25" width="6" height="27" rx="2" fill="#27ae60"/>' +
                '<g class="rk-kupa"><path d="M38 14h16v7a8 8 0 0 1-16 0z" fill="#F1C40F" stroke="#B7950B" stroke-width="1.6"/>' +
                '<path d="M38 16h-3.4a4.4 4.4 0 0 0 4.4 5.6M54 16h3.4a4.4 4.4 0 0 1-4.4 5.6" fill="none" stroke="#B7950B" stroke-width="1.8"/>' +
                '<rect x="43.6" y="28.6" width="4.8" height="5.4" fill="#B7950B"/>' +
                '<rect x="40.4" y="33.6" width="11.2" height="3.6" rx="1.4" fill="#8D6E63"/></g>' +
                '<g class="rk-parla" stroke="#F1C40F" stroke-width="2" stroke-linecap="round">' +
                '<path d="M35 8l2 2M58 8l-2 2M46 4v3"/></g></svg>';
        if (tur === 'ogretmen') /* TAHTA: cizilen onay + kalem */
            return '<svg viewBox="0 0 64 64" aria-hidden="true">' +
                '<rect x="8" y="10" width="48" height="34" rx="4" fill="#2C6E49"/>' +
                '<rect x="8" y="10" width="48" height="34" rx="4" fill="none" stroke="#8D6E63" stroke-width="3"/>' +
                '<path class="th-tik" d="M20 28l7 7 16-16" fill="none" stroke="#FFF3E0" stroke-width="4"' +
                ' stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="34" stroke-dashoffset="0"/>' +
                '<path d="M14 52h22" stroke="#D5BFAE" stroke-width="3" stroke-linecap="round"/>' +
                '<g class="th-kalem"><path d="M44 56l10-10 4 4-10 10-5.2 1.2z" fill="#F39C12" stroke="#B9770E" stroke-width="1.4"/>' +
                '<path d="M54 46l4 4" stroke="#8D6E63" stroke-width="3" stroke-linecap="round"/></g></svg>';
        /* KURUM: bayragi dalgalanan, pencereleri isiyan okul */
        return '<svg viewBox="0 0 64 64" aria-hidden="true">' +
            '<path d="M10 26L32 12l22 14z" fill="#D84315"/>' +
            '<rect x="14" y="26" width="36" height="26" rx="2" fill="#FFF3E0" stroke="#E8A87C" stroke-width="1.6"/>' +
            '<rect class="ok-cam c1" x="19" y="31" width="7" height="7" rx="1.4" fill="#5DADE2"/>' +
            '<rect class="ok-cam c2" x="38" y="31" width="7" height="7" rx="1.4" fill="#5DADE2"/>' +
            '<rect class="ok-cam c3" x="19" y="42" width="7" height="7" rx="1.4" fill="#5DADE2"/>' +
            '<rect class="ok-cam c4" x="38" y="42" width="7" height="7" rx="1.4" fill="#5DADE2"/>' +
            '<path d="M28.6 52v-9a3.4 3.4 0 0 1 6.8 0v9z" fill="#8D6E63"/>' +
            '<rect x="31" y="6" width="2.4" height="12" fill="#8D6E63"/>' +
            '<path class="ok-bayrak" d="M33.4 7h11l-2.6 3 2.6 3h-11z" fill="#E53935"/></svg>';
    }

    function perdeHtml(neden) {
        var kartlar = [
            { s: 'ogrenci', b: 'Öğrenciysen', m: 'Oyunlarla öğren, rekorlarını kır, görevlerini tamamla — gelişimin adım adım kaydedilir.' },
            { s: 'ogretmen', b: 'Öğretmensen', m: 'Sınıflarını yönet, tek tıkla görev gönder, notları ve gelişimi canlı panelden izle.' },
            { s: 'kurum', b: 'Kurumsan', m: 'Şubeler, seviyeler ve sınıflar tek çatıda: performans, sınav ve veli takibi bir arada.' }
        ].map(function (k) {
            return '<div style="flex:1; min-width:200px; background:#FFF8F2; border:1px solid #F3E2D3;' +
                ' border-radius:16px; padding:18px 16px; text-align:center;">' +
                '<div style="width:74px; height:74px; margin:0 auto 10px;">' + kartSvg(k.s) + '</div>' +
                '<div style="font-weight:800; color:#9C3B0C; font-size:1.02rem; margin-bottom:6px;">' + k.b + '</div>' +
                '<div style="font-size:.82rem; color:#6B4A38; line-height:1.55;">' + k.m + '</div></div>';
        }).join('');

        var altSatir;
        if (girisliMi()) {
            altSatir = '<p style="margin:0; color:#B9770E; font-size:.82rem;">Bu hesabın bu bölüm için yetkisi yok — ' +
                'ders saatinde ya da yönetici izin verdiğinde açılır.</p>';
        } else if (neden === 'giris') {
            altSatir = '<button type="button" onclick="SiteKilit.girisAc()" style="padding:14px 40px; border:none;' +
                ' border-radius:12px; cursor:pointer; font-family:inherit; font-weight:800; font-size:1.05rem; color:#fff;' +
                ' background:linear-gradient(135deg,#F39C12,#D84315); box-shadow:0 6px 18px rgba(216,67,21,.35);">Giriş Yap</button>' +
                '<p style="margin:10px 0 0; color:#A6836E; font-size:.78rem;">Hesabını öğretmenin oluşturur — kodunla bağlanırsın.</p>';
        } else {
            altSatir = '<p style="margin:0 0 10px; color:#A6836E; font-size:.8rem;">Şu an derslere özel çalışıyoruz — ' +
                'katılmak için öğretmeninle iletişime geç.</p>' +
                '<a onclick="SiteKilit.girisAc()" style="color:#B34700; font-weight:700; font-size:.8rem;' +
                ' cursor:pointer; text-decoration:underline;">Giriş</a>';
        }

        return '' +
            '<div style="max-width:880px; width:100%; max-height:94vh; overflow-y:auto; text-align:center;' +
            ' padding:30px 24px; background:#fff; border-radius:24px; box-shadow:0 24px 60px rgba(0,0,0,.35);">' +
            '<style>' +
            '@keyframes rkBar{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.55)}}' +
            '.rk-bar{transform-box:fill-box; transform-origin:50% 100%; animation:rkBar 2.6s ease-in-out infinite}' +
            '.rk-b2{animation-delay:.2s}.rk-b3{animation-delay:.4s}' +
            '@keyframes rkKupa{0%,100%{transform:translateY(0)}50%{transform:translateY(-2.4px)}}' +
            '.rk-kupa{animation:rkKupa 2.4s ease-in-out infinite}' +
            '@keyframes rkParla{0%,45%,100%{opacity:.2}18%{opacity:1}}' +
            '.rk-parla{animation:rkParla 2s ease-in-out infinite}' +
            '@keyframes thTik{0%,12%{stroke-dashoffset:34}45%,78%{stroke-dashoffset:0}92%,100%{stroke-dashoffset:34}}' +
            '.th-tik{animation:thTik 3.4s ease-in-out infinite}' +
            '@keyframes thKalem{0%,100%{transform:translate(0,0)}30%{transform:translate(-2.4px,-2.4px)}60%{transform:translate(1.4px,1.4px)}}' +
            '.th-kalem{animation:thKalem 3.4s ease-in-out infinite}' +
            '@keyframes okBayrak{0%,100%{transform:skewY(0deg)}50%{transform:skewY(5deg)}}' +
            '.ok-bayrak{transform-box:fill-box; transform-origin:0% 50%; animation:okBayrak 2.6s ease-in-out infinite}' +
            '@keyframes okCam{0%,100%{fill:#5DADE2}50%{fill:#F9E79F}}' +
            '.ok-cam{animation:okCam 3.6s ease-in-out infinite}' +
            '.c2{animation-delay:.9s}.c3{animation-delay:1.8s}.c4{animation-delay:2.7s}' +
            '@keyframes klLogo{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}' +
            '.kl-logo{animation:klLogo 2.6s ease-in-out infinite}' +
            '</style>' +
            '<svg viewBox="0 0 64 64" style="width:64px; height:64px;" aria-hidden="true" class="kl-logo">' +
            '<path d="M10 14a4 4 0 0 1 4-4h16v40H14a4 4 0 0 0-4 4z" fill="#FFF3E0" stroke="#E8A87C" stroke-width="2"/>' +
            '<path d="M54 14a4 4 0 0 0-4-4H34v40h16a4 4 0 0 1 4 4z" fill="#FDEBD0" stroke="#E8A87C" stroke-width="2"/>' +
            '<text x="22" y="32" font-size="13" font-weight="800" fill="#D84315" text-anchor="middle">ك</text>' +
            '<text x="43" y="32" font-size="13" font-weight="800" fill="#B34700" text-anchor="middle">ع</text></svg>' +
            '<h2 style="margin:8px 0 4px; color:#9C3B0C; font-size:1.5rem;">Kidef Arapça</h2>' +
            '<p style="margin:0 0 20px; color:#8B6A57; font-size:.92rem;">Arapçayı oyunla, görevle ve canlı takiple öğreten sınıf platformu</p>' +
            '<div style="display:flex; gap:14px; flex-wrap:wrap; margin-bottom:20px;">' + kartlar + '</div>' +
            altSatir + '</div>';
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
            if (firebase.auth) firebase.auth().onAuthStateChanged(function (u) {
                if (u) K._mola = 0;          /* giris geldi: mola biter, karar netlesir */
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
