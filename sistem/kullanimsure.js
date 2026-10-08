/* =====================================================================
   KİDEF · SİTEDE GEÇİRİLEN SÜRE            (sistem/kullanimsure.js)
   ---------------------------------------------------------------------
   Öğretmen (08.10.2026): "öğretmen olarak giriş yapanların toplam ne
   kadar siteyi kullandıklarını hesaplayan bi sistem yapalım, bunu
   yönetici de görebilsin."

   NE SAYAR — ve neyi saymaz
     · Yalnız GERÇEK ETKİN süre sayılır: sekme GÖRÜNÜR olacak ve son
       BOŞTA_SN saniye içinde kullanıcıdan bir hareket gelmiş olacak
       (tıklama, tuş, kaydırma, dokunma). Arka planda açık duran sekme,
       açık unutulmuş bilgisayar ve uyku süresi sayılmaz.
     · Sayaç her saniye değil, tarayıcının saatine göre ARALIK olarak
       işlenir; iki ölçüm arası ATLAMA_SN'den uzunsa (uyku, saat
       değişimi) o aralık atılır — süre şişmesin.

   NEREYE YAZAR
     kullanicilar/{uid}.kullanim = {
        toplamSn   : artımlı toplam (saniye)
        oturum     : kaç kez oturum açıldı (bu betik yüklendiğinde +1)
        sonGoruldu : sunucu zaman damgası
        gun        : { "2026-10-08": saniye, ... }   son 1 yıl
     }
   Yazma aralığı YAZ_ARALIK_SN; ayrıca sekme gizlenince/kapanınca bir
   kez daha yazılır. Yazılamayan saniyeler tarayıcıda bekler ve bir
   sonraki denemede eklenir — süre kaybolmaz.

   NEDEN kullanicilar BELGESİ: yönetici zaten bu koleksiyonu okuyor
   (teacher-admin.js), ayrı bir koleksiyon açmak yeni kural ve ikinci
   bir okuma demekti. Kurallarda "kendi belgesini güncelleyebilir"
   (rolünü değiştirmemek şartıyla) zaten var; bu betik yalnız kullanim
   alanına dokunuyor.

   YÜKLENDİĞİ SAYFALAR: index.html ve sarf.html — Firebase yüklü olan ve
   öğretmenin gerçekten çalıştığı sayfalar. Flipbook/sunum gibi ayrı
   sekmeler Firebase yüklemiyor, oradaki süre sayılmaz.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefKullanim) return;

    var BOSTA_SN = 300;        /* 5 dk hareketsizlik -> duraklat */
    var ATLAMA_SN = 120;       /* iki ölçüm arası bundan uzunsa aralığı at */
    var YAZ_ARALIK_SN = 60;    /* en sık bu kadarda bir buluta yaz */
    var EN_COK_TEK_YAZIM = 3 * 3600;   /* tek seferde en çok 3 saat eklensin */
    var ANAHTAR = 'kidefKullanimBekleyen';

    var uid = null;
    var sonVuru = Date.now();      /* son ölçüm anı */
    var sonHareket = Date.now();   /* son kullanıcı hareketi */
    var biriken = 0;               /* henüz yazılmamış saniye */
    var sonYazim = 0;
    var oturumSayildi = false;
    var oturumToplam = 0;        /* bu sayfa acildigindan beri sayilan saniye */

    function bugun() {
        var d = new Date();
        var a = d.getMonth() + 1, g = d.getDate();
        return d.getFullYear() + '-' + (a < 10 ? '0' : '') + a + '-' + (g < 10 ? '0' : '') + g;
    }
    function dbAl() {
        try { if (typeof db !== 'undefined' && db) return db; } catch (e) { }
        try { return window.db || (window.firebase && firebase.firestore()); } catch (e) { }
        return null;
    }
    function kullanici() {
        try {
            var u = (window.firebase && firebase.auth && firebase.auth().currentUser) || null;
            return (u && !u.isAnonymous) ? u : null;
        } catch (e) { return null; }
    }

    /* --- yazılamayan saniyeler tarayıcıda bekler --- */
    function bekleyenOku(u) {
        try {
            var h = JSON.parse(localStorage.getItem(ANAHTAR) || 'null');
            if (h && h.uid === u) return h;
        } catch (e) { }
        return null;
    }
    function bekleyenYaz(u, sn, gun) {
        try { localStorage.setItem(ANAHTAR, JSON.stringify({ uid: u, sn: sn, gun: gun })); } catch (e) { }
    }
    function bekleyenSil() { try { localStorage.removeItem(ANAHTAR); } catch (e) { } }

    /* --- sayaç --- */
    function vur() {
        var simdi = Date.now();
        var fark = (simdi - sonVuru) / 1000;
        sonVuru = simdi;
        if (fark <= 0 || fark > ATLAMA_SN) return;              /* uyku / saat sıçraması */
        if (document.visibilityState !== 'visible') return;      /* arka planda sayma */
        if ((simdi - sonHareket) / 1000 > BOSTA_SN) return;      /* boşta */
        biriken += fark;
        oturumToplam += fark;
    }

    function yaz(zorla) {
        var u = kullanici();
        if (!u) return;
        uid = u.uid;
        var bek = bekleyenOku(uid);
        var topla = biriken + (bek ? (bek.sn || 0) : 0);
        var gunler = {};
        if (bek && bek.gun) gunler = bek.gun;
        if (biriken > 0) gunler[bugun()] = (gunler[bugun()] || 0) + biriken;
        if (topla < 1) return;
        if (!zorla && (Date.now() - sonYazim) / 1000 < YAZ_ARALIK_SN) return;

        var D = dbAl();
        if (!D || !window.firebase || !firebase.firestore || !firebase.firestore.FieldValue) {
            bekleyenYaz(uid, topla, gunler);                     /* bağlantı yok: beklet */
            biriken = 0;
            return;
        }
        var art = firebase.firestore.FieldValue.increment;
        var ek = Math.min(Math.round(topla), EN_COK_TEK_YAZIM);
        var govde = { toplamSn: art(ek), sonGoruldu: firebase.firestore.FieldValue.serverTimestamp(), gun: {} };
        Object.keys(gunler).forEach(function (g) {
            var v = Math.min(Math.round(gunler[g]), EN_COK_TEK_YAZIM);
            if (v > 0) govde.gun[g] = art(v);
        });
        if (!oturumSayildi) { govde.oturum = art(1); oturumSayildi = true; }

        biriken = 0;
        sonYazim = Date.now();
        /* Yazma denemesi sürerken sayaç sıfırlandı; başarısız olursa
           bekleyene geri konur, böylece süre kaybolmaz. */
        D.collection('kullanicilar').doc(uid)
            .set({ kullanim: govde }, { merge: true })
            .then(function () { bekleyenSil(); })
            .catch(function () { bekleyenYaz(uid, topla, gunler); });
    }

    /* --- olaylar --- */
    ['pointerdown', 'keydown', 'wheel', 'touchstart', 'mousemove'].forEach(function (t) {
        document.addEventListener(t, function () { sonHareket = Date.now(); },
            { passive: true, capture: true });
    });
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') { sonVuru = Date.now(); sonHareket = Date.now(); }
        else { vur(); yaz(true); }
    });
    window.addEventListener('pagehide', function () { vur(); yaz(true); });
    window.addEventListener('beforeunload', function () { vur(); yaz(true); });

    setInterval(function () { vur(); yaz(false); }, 15000);

    /* Oturum geç açılabilir: kullanıcı gelince sayaç sıfırdan başlasın. */
    (function oturumIzle() {
        var n = 0, t = setInterval(function () {
            try {
                if (window.firebase && firebase.auth) {
                    clearInterval(t);
                    firebase.auth().onAuthStateChanged(function (u) {
                        if (u && !u.isAnonymous) {
                            if (uid && uid !== u.uid) { biriken = 0; oturumSayildi = false; }
                            uid = u.uid; sonVuru = Date.now(); sonHareket = Date.now();
                        }
                    });
                }
            } catch (e) { }
            if (++n > 120) clearInterval(t);
        }, 250);
    })();

    /* Okunur biçim: 3h 05dk / 48dk / 35sn */
    function bicim(sn) {
        sn = Math.max(0, Math.round(sn || 0));
        if (sn < 60) return sn + ' sn';
        var d = Math.floor(sn / 60), s = Math.floor(d / 60);
        if (s < 1) return d + ' dk';
        return s + ' sa ' + (d % 60) + ' dk';
    }
    window.KidefKullanim = {
        bicim: bicim,
        yaz: function () { vur(); yaz(true); },
        /* Bu sayfa açıldığından beri sayılan etkin saniye — profildeki
           'bu oturum' satırı bunu gösterir (buluttaki toplam, girişteki
           değerde donmuş olabilir). */
        oturum: function () { vur(); return Math.round(oturumToplam); }
    };
})();
