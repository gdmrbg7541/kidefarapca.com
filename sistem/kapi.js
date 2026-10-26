/* =====================================================================
   KİDEF · SAYFA KAPISI                                 (sistem/kapi.js)
   ---------------------------------------------------------------------
   26.10.2026 — Yönetici «Sadece Girişliler» ya da «Sadece Yönetici»
   kilidini açtığında yalnız ana sayfa kapanıyordu; kitaplar, oyunlar,
   araçlar, defter… bağlantıyla doğrudan açılabiliyordu. Bu dosya ana
   sayfa DIŞINDAKİ her sayfanın <head>'inde ilk iş olarak çalışır.

   KARAR
     · Kilit «Açık»  → hiçbir şey yapmaz (sayfa her zamanki gibi).
     · Kilit «Sadece Girişliler» → içeri giren: bu tarayıcıda oturumu
       açık VE ana sayfanın verdiği «giriş bileti» geçerli olan hesap
       (öğrenci, onaylı öğretmen, yönetici). Giriş yapmamış, onay
       bekleyen ya da reddedilen öğretmen ve site kaydı olmayan hesap
       ana sayfaya gider: index.html?donus=<bu sayfa>. Ana sayfa giriş
       ekranını açar; izin çıkınca ziyaretçiyi kendiliğinden geri getirir.
     · Kilit «Sadece Yönetici» → yalnız yönetici bileti geçer.

   BİLET (localStorage kidefKapiBilet = {uid, rol, izin, t})
     sistem/kilit.js ana sayfada hesabın kendi kaydını okuyunca yazar,
     çıkışta siler. 24 saatten eskiyse ziyaretçi bir kez ana sayfaya
     uğrayıp tazelenir. Oturumun kime ait olduğu Firebase'in tarayıcıdaki
     kaydından (firebase:authUser) okunur — Firebase yüklenmeden.

   KİLİT DURUMU
     localStorage siteKilitSon (+ siteKilitZaman). 60 sn'den eskiyse
     ayarlar/site belgesi Firestore REST ile okunur (kurallar herkese
     okuma izni veriyor). Kilitli bilinen ya da hiç bilinmeyen sayfa
     karar verilene kadar görünmez; en çok 4 sn.

   MUAF
     · Aynı sitenin çerçevesindeki sayfa (kitap içi etkinlik, sözlük
       penceresi, tahta kabuğu…): kararı üstteki sayfa verir.
     · Yarışmaya karekodla katılım (?oda=…): öğrencinin hesabı olmayabilir.
     · Bilgisayardaki deneme (file://, localhost).

   DÜRÜSTLÜK NOTU: site statik barındırıldığı için bu da bir kapı
   perdesidir; normal ziyaretçiyi durdurur, tarayıcı ayarıyla aşılabilir.
   Asıl veri koruması Firestore kurallarındadır.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefKapi) return;
    var Z = window.KidefKapi = { surum: '2026-10-26' };

    var API = 'AIzaSyBGIQPJ_Bjm5I3-QmrrGpLR5MqmG3S5F8w';
    var KILIT = 'siteKilitSon', KILIT_ZAMAN = 'siteKilitZaman';
    var BILET = 'kidefKapiBilet', SAYAC = 'kidefKapiSayac';
    var TAZE_MS = 60000;                     /* kilit bilgisi bu kadar taze sayılır */
    var BILET_OMUR = 24 * 3600000;           /* bilet ömrü */
    var GIZLE_EN_COK = 4000;                 /* sayfa en çok bu kadar gizli kalır */

    function yerelAl(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function yerelYaz(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
    function kilitliMi(k) { return k === 'girisli' || k === 'yonetici'; }

    /* ---------------------------------------------------------- muafiyet */
    var h = location.hostname;
    var deneme = !!window.__kapiDeneme;
    if (!deneme && (location.protocol === 'file:' || h === 'localhost' || h === '127.0.0.1' || h === '')) return;
    if (/[?&]oda=/.test(location.search)) return;                 /* karekodla yarışmaya katılım */

    var yabanciCerceve = false;
    try {
        if (window.top !== window.self) {
            var ayni = false;
            try { ayni = !!window.top.location.href; } catch (e) { ayni = false; }
            if (ayni) return;                                       /* kararı üstteki sayfa verir */
            yabanciCerceve = true;
        }
    } catch (e) { }

    /* ------------------------------------------------------ gizle/göster */
    var stil = null;
    function gizle() {
        if (stil) return;
        stil = document.createElement('style');
        stil.id = 'kidefKapiGizle';
        stil.textContent = 'html{visibility:hidden!important}';
        (document.head || document.documentElement).appendChild(stil);
        setTimeout(goster, GIZLE_EN_COK);
    }
    function goster() {
        if (stil && stil.parentNode) stil.parentNode.removeChild(stil);
        stil = null;
    }

    /* --------------------------------------------- tarayıcıdaki oturum uid'i
       Firebase'in kendi kaydı: localStorage / sessionStorage ya da IndexedDB
       firebaseLocalStorageDb › firebaseLocalStorage. Anonim kimlik sayılmaz. */
    function oturumUid(cb) {
        var bitti = false;
        function son(v) { if (!bitti) { bitti = true; cb(v || null); } }
        function depoda(d) {
            try {
                for (var i = 0; i < d.length; i++) {
                    var k = d.key(i);
                    if (k && k.indexOf('firebase:authUser:' + API) === 0) {
                        var v = JSON.parse(d.getItem(k) || 'null');
                        if (v && v.uid && !v.isAnonymous) return v.uid;
                    }
                }
            } catch (e) { }
            return null;
        }
        var u = null;
        try { u = depoda(window.localStorage) || depoda(window.sessionStorage); } catch (e) { }
        if (u) return son(u);
        if (!window.indexedDB) return son(null);
        setTimeout(function () { son(null); }, 1500);
        var r;
        try { r = indexedDB.open('firebaseLocalStorageDb'); } catch (e) { return son(null); }
        r.onupgradeneeded = function () { try { r.transaction.abort(); } catch (e) { } };
        r.onerror = function (e) { try { e.preventDefault(); } catch (x) { } son(null); };
        r.onblocked = function () { son(null); };
        r.onsuccess = function () {
            var db = r.result;
            try {
                if (!db.objectStoreNames.contains('firebaseLocalStorage')) { db.close(); return son(null); }
                var c = db.transaction('firebaseLocalStorage', 'readonly').objectStore('firebaseLocalStorage').openCursor();
                c.onsuccess = function () {
                    var k = c.result;
                    if (!k) { db.close(); return son(null); }
                    var x = k.value || {}, v = x.value;
                    if (String(x.fbase_key || k.key || '').indexOf('firebase:authUser:' + API) === 0 && v && v.uid && !v.isAnonymous) {
                        db.close(); return son(v.uid);
                    }
                    k.continue();
                };
                c.onerror = function () { db.close(); son(null); };
            } catch (e) { try { db.close(); } catch (x) { } son(null); }
        };
    }

    /* ------------------------------------------------------------ karar */
    function biletOku() {
        try { return JSON.parse(yerelAl(BILET) || 'null'); } catch (e) { return null; }
    }
    function karar(kilit, cb) {
        if (!kilitliMi(kilit)) return cb(true);
        oturumUid(function (uid) {
            if (!uid) return cb(false);
            var b = biletOku();
            if (!b || b.uid !== uid || !b.t || Date.now() - b.t > BILET_OMUR) return cb(false);
            if (kilit === 'yonetici') return cb(b.rol === 'admin');
            return cb(!!b.izin);
        });
    }
    Z.karar = karar;

    /* --------------------------------------------- ana sayfaya yönlendir
       Döngü kalkanı: 1 dakikada 3'ten çok yönlendirme olursa durur (ana
       sayfa bileti yazamıyorsa — örn. bağlantı yok — sayfa açık kalır). */
    function yonlendir() {
        var s = null;
        try { s = JSON.parse(sessionStorage.getItem(SAYAC) || 'null'); } catch (e) { }
        if (!s || Date.now() - s.t > 60000) s = { n: 0, t: Date.now() };
        if (s.n >= 3) { goster(); return; }
        s.n++;
        try { sessionStorage.setItem(SAYAC, JSON.stringify(s)); } catch (e) { }
        var donus = location.pathname + location.search + location.hash;
        location.replace('/index.html?donus=' + encodeURIComponent(donus));
    }
    function yabanciKapat() {
        var yaz = function () {
            try {
                document.documentElement.innerHTML = '<head><meta charset="utf-8"></head><body style="margin:0;' +
                    'display:flex;align-items:center;justify-content:center;min-height:100vh;font:16px sans-serif;' +
                    'background:#FFF8EE;color:#8B6A57;text-align:center;padding:20px">Bu içerik şu an yalnız giriş ' +
                    'yapanlara açık — kidefarapca.com\'dan giriş yap.</body>';
            } catch (e) { }
            goster();
        };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', yaz); else yaz();
    }
    var yonlendi = false;
    function uygula(kilit) {
        karar(kilit, function (izin) {
            if (yonlendi) return;
            if (izin) { goster(); return; }
            yonlendi = true;
            if (yabanciCerceve) yabanciKapat(); else yonlendir();
        });
    }

    /* ------------------------------------- kilit durumunu buluttan oku */
    function kilitGetir(cb) {
        var bitti = false;
        var son = function (v) { if (!bitti) { bitti = true; cb(v); } };
        setTimeout(function () { son(null); }, 3500);
        try {
            fetch('https://firestore.googleapis.com/v1/projects/kidefarapca-98f9c/databases/(default)/documents/ayarlar/site?key=' + API,
                  { cache: 'no-store', credentials: 'omit' })
                .then(function (r) {
                    if (r.status === 404) return {};
                    if (!r.ok) throw new Error('http ' + r.status);
                    return r.json();
                })
                .then(function (j) {
                    var v = j && j.fields && j.fields.kilit && j.fields.kilit.stringValue;
                    v = kilitliMi(v) ? v : 'acik';
                    yerelYaz(KILIT, v); yerelYaz(KILIT_ZAMAN, String(Date.now()));
                    son(v);
                })
                .catch(function () { son(null); });
        } catch (e) { son(null); }
    }

    /* ------------------------------------------------------------ akış */
    var kilit = yerelAl(KILIT);
    var zaman = +yerelAl(KILIT_ZAMAN) || 0;
    var bilinmiyor = !kilit;
    if (kilitliMi(kilit) || bilinmiyor) gizle();
    if (kilitliMi(kilit)) uygula(kilit);
    if (bilinmiyor || Date.now() - zaman > TAZE_MS) {
        kilitGetir(function (v) {
            if (v === null) { if (!kilitliMi(kilit)) goster(); return; }   /* bulut yok: son bilinenle kal */
            if (kilitliMi(v)) { if (v !== kilit) uygula(v); }
            else goster();
            kilit = v;
        });
    } else if (!kilitliMi(kilit)) goster();
})();
