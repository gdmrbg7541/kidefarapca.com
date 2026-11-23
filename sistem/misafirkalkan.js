/* =====================================================================
   MİSAFİR KALKANI — girişsiz kullanımda buluta yazım yok       (sistem/misafirkalkan.js)
   ---------------------------------------------------------------------
   Yönetici (23.11.2026): "sınıf materyallerinin herkese açık olduğu bi switch ekleyelim ... ama giriş yapmadan
   kullanılırsa bulut hizmetlerine kaydedilmeyecek şekilde olsun".

   NE ZAMAN İŞLER (hepsi birden)
     · yönetici panelinde «Sınıf materyalleri herkese açık» AÇIK         (ayarlar/site.materyalAcik → localStorage siteMateryalAcik)
     · site kilidi 🌍 Açık (girişli/yönetici kilidinde misafir zaten kapıda; o kiplerde kalkan işlemez)
     · ziyaretçi giriş yapmamış ya da misafir (anonim) kimlikte: Firebase'in ilk oturum cevabı geldi ve giriş yapmış hesap YOK
     · sayfa yarışmaya karekodla katılım değil (?oda= — o akış zaten misafir kimlikle yazar; onu bozmayız)
   Anahtar kapalıyken HİÇBİR ŞEY değişmez: kalkan yüklü olsa da her çağrıyı aynen geçirir.

   NE YAPAR
     Firebase kitaplığının YAZMA kapılarını çağrı anında kapatır. Çağıran sayfa sunucunun vereceği «izin yok» cevabının
     aynısını alır (kurallar girişsiz yazıma zaten izin vermiyor) — sayfaların bildiği bir hata; yalnız istek hiç yola çıkmaz
     ve misafir için bulutta kimlik/belge oluşmaz:
       Firestore            set · update · delete · add · batch.commit · transaction içindeki set/update/delete
       Gerçek zamanlı veri  set · update · push(değerle) · remove · setPriority · setWithPriority · transaction · onDisconnect yazımları
       Depolama             put · putString · delete · updateMetadata
       Oturum               signInAnonymously (misafir kimlik açılmaz)
   NE YAPMAZ
     Okumalar (belge/koleksiyon dinleme), e-posta ile giriş · kayıt · şifre sıfırlama, Cloud Functions (karekodla giriş),
     giriş yapmış hesabın hiçbir işlemi. Sayfa istatistiği (Google Analytics) bu betiğin konusu değil.

   NASIL YÜKLENİR
     Ana sayfada index.html, öbür sayfalarda sistem/kapi.js (her sayfanın başında çalışır, çerçevelerde de). Firebase
     kitaplığı sonradan yüklenebilir: kalkan kitaplık görününce takılır (önce sık, sonra seyrek yoklama).

   GİRİŞ YAPMIŞ HESAP: karar çağrı ANINDA firebase.auth().currentUser'a bakar (kayıt olan hesabın ilk yazısı, oturum
   dinleyicisi gelmeden de geçer). Oturum geri yüklenirken (ilk cevap gelmeden) hiçbir şey engellenmez.

   DÜRÜSTLÜK NOTU: bu bir TARAYICI tarafı emniyet kemeridir; asıl koruma Firestore kurallarındadır (girişsiz yazım zaten yok).
   Kalkanın amacı, misafirin kullanımının buluta iz bırakmaması ve gereksiz istek göndermemesidir.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefMisafirKalkan) return;
    var K = window.KidefMisafirKalkan = { surum: '2026-11-23', kayit: [], say: 0, yamali: {} };

    var belli = false;          /* Firebase'in ilk oturum cevabı geldi mi */
    var bagli = false;          /* oturum dinleyicisi takıldı mı */

    /* ------------------------------------------------------------ KARAR */
    function aktif() {
        if (/[?&]oda=/.test(location.search)) return false;                 /* yarışmaya karekodla katılım */
        try {
            var k = localStorage.getItem('siteKilitSon');
            if (k === 'girisli' || k === 'yonetici') return false;         /* kilitli sitede misafir kapıda */
            return localStorage.getItem('siteMateryalAcik') === '1';
        } catch (e) { return false; }
    }
    function misafir() {
        if (!belli) return false;                                           /* oturum geri yükleniyor: dokunma */
        try {
            var u = window.firebase.auth().currentUser;
            return !u || !!u.isAnonymous;
        } catch (e) { return false; }
    }
    K.aktifMi = aktif;
    K.engelMi = function () { return aktif() && misafir(); };
    K.durum = function () {
        return { aktif: aktif(), misafir: misafir(), belli: belli, engellenen: K.say, yamali: Object.keys(K.yamali) };
    };

    /* ------------------------------------------------------------ HATA */
    var KOD = { firestore: 'permission-denied', rtdb: 'PERMISSION_DENIED', storage: 'storage/unauthorized', auth: 'auth/operation-not-allowed' };
    function hata(tur, yol) {
        K.say++;
        if (K.kayit.length < 60) K.kayit.push({ t: Date.now(), tur: tur, yol: String(yol || '') });
        var e = new Error(tur === 'auth' ? 'Misafir kimliği kapalı: giriş yapmadan oturum açılmaz.'
                                         : 'Giriş yapmadan buluta kayıt yapılmaz.');
        e.name = 'FirebaseError';
        e.code = KOD[tur] || 'permission-denied';
        e.kalkan = true;
        return e;
    }
    function reddedilmis(e) {
        var p = Promise.reject(e);
        p.catch(function () { });          /* «işlenmemiş söz» gürültüsü çıkmasın; çağıran yine hatayı alır */
        return p;
    }
    function soz(tur, yol) { return reddedilmis(hata(tur, yol)); }
    function at(tur, yol) { throw hata(tur, yol); }
    function yukleme(tur, yol) {                                            /* Storage UploadTask yerine geçen reddedici */
        var e = hata(tur, yol), p = reddedilmis(e);
        return {
            then: function (a, b) { return p.then(a, b); },
            catch: function (b) { return p.catch(b); },
            on: function (tip, sonraki, hataFn) {
                if (typeof hataFn === 'function') setTimeout(function () { hataFn(e); }, 0);
                return function () { };
            },
            cancel: function () { return false; }, pause: function () { return false; }, resume: function () { return false; },
            snapshot: null
        };
    }

    /* ------------------------------------------------------------ SARMA */
    function yolu(o) {
        try { return (o && (o.path || o.fullPath || (o.toString && o.toString()))) || ''; } catch (e) { return ''; }
    }
    function sar(ad, proto, yontem, nasil, tur) {
        if (!proto || typeof proto[yontem] !== 'function') return;
        var o = proto[yontem];
        if (o.__kdKalkan) return;
        var y = function () {
            if (K.engelMi()) return nasil(tur, yolu(this));
            return o.apply(this, arguments);
        };
        y.__kdKalkan = 1;
        proto[yontem] = y;
        K.yamali[ad + '.' + yontem] = 1;
    }

    function kurFirestore() {
        var fs = window.firebase && window.firebase.firestore;
        if (!fs) return;
        if (fs.DocumentReference) ['set', 'update', 'delete'].forEach(function (m) { sar('firestore.doc', fs.DocumentReference.prototype, m, soz, 'firestore'); });
        if (fs.CollectionReference) sar('firestore.koleksiyon', fs.CollectionReference.prototype, 'add', soz, 'firestore');
        if (fs.WriteBatch) sar('firestore.toplu', fs.WriteBatch.prototype, 'commit', soz, 'firestore');
        if (fs.Transaction) ['set', 'update', 'delete'].forEach(function (m) { sar('firestore.islem', fs.Transaction.prototype, m, at, 'firestore'); });
    }

    function kurVeritabani() {
        var db = window.firebase && window.firebase.database;
        if (!db || !db.Reference) return;
        var P = db.Reference.prototype;
        ['set', 'update', 'remove', 'setPriority', 'setWithPriority', 'transaction'].forEach(function (m) { sar('rtdb.ref', P, m, soz, 'rtdb'); });
        /* push(değer) yazar; push() yalnız anahtar üretir (yazı yok) */
        var po = P.push;
        if (typeof po === 'function' && !po.__kdKalkan) {
            var py = function (deger) {
                if (arguments.length && deger !== undefined && K.engelMi()) {
                    var r = po.call(this), e = hata('rtdb', yolu(this)), p = reddedilmis(e);
                    try {
                        r.then = function (a, b) { return p.then(a, b); };
                        r['catch'] = function (b) { return p.catch(b); };
                    } catch (x) { }
                    return r;
                }
                return po.apply(this, arguments);
            };
            py.__kdKalkan = 1; P.push = py; K.yamali['rtdb.ref.push'] = 1;
        }
        var oo = P.onDisconnect;
        if (typeof oo === 'function' && !oo.__kdKalkan) {
            var oy = function () {
                var od = oo.apply(this, arguments), yol = yolu(this);
                if (od && K.engelMi()) {
                    ['set', 'update', 'remove', 'setWithPriority'].forEach(function (m) {
                        if (typeof od[m] === 'function') od[m] = function () { return soz('rtdb', yol); };
                    });
                }
                return od;
            };
            oy.__kdKalkan = 1; P.onDisconnect = oy; K.yamali['rtdb.ref.onDisconnect'] = 1;
        }
    }

    function kurDepolama() {
        var st = window.firebase && window.firebase.storage;
        if (!st || !st.Reference) return;
        var P = st.Reference.prototype;
        ['delete', 'updateMetadata'].forEach(function (m) { sar('storage.ref', P, m, soz, 'storage'); });
        ['put', 'putString'].forEach(function (m) { sar('storage.ref', P, m, yukleme, 'storage'); });
    }

    function kurOturum() {
        var A = window.firebase && window.firebase.auth && window.firebase.auth.Auth;
        if (A) sar('auth', A.prototype, 'signInAnonymously', soz, 'auth');
    }

    function oturumBagla() {
        if (bagli) return;
        try {
            var fb = window.firebase;
            if (!fb || !fb.auth || !fb.apps || !fb.apps.length) return;
            bagli = true;
            fb.auth().onAuthStateChanged(function () { belli = true; });
        } catch (e) { bagli = false; }
    }

    function kur() {
        try { kurFirestore(); } catch (e) { }
        try { kurVeritabani(); } catch (e) { }
        try { kurDepolama(); } catch (e) { }
        try { kurOturum(); } catch (e) { }
        try { oturumBagla(); } catch (e) { }
    }
    K.kur = kur;

    /* Kitaplık bu betikten sonra da yüklenebilir (sayfaya göre, hatta tıklamayla): ilk 20 sn'de sık, sonra seyrek yokla.
       Takılmış parçalar tekrar sarılmaz (__kdKalkan). */
    kur();
    var tur = 0;
    (function yokla() {
        tur++;
        kur();
        setTimeout(yokla, tur < 130 ? 150 : 2000);
    })();
})();
