/* =========================================================================
   KİDEF — SÖZLÜK FAVORİLERİ                    (sozluk.html + açılır sözlük)
   -------------------------------------------------------------------------
   Öğrenci bir kelimeyi yıldızlar, sonra "Favorilerim"den ona bakar
   (Geylani: "kelimeleri favori olarak yapıp sonradan favori olarak seçtiği
   kelimelere bakabilsin öğrenci").

   NEREDE DURUYOR — ikisi birden:
     · HER ZAMAN tarayıcıda (localStorage). Giriş yapmayan öğrenci de
       kullanabilsin diye; yıldız hiçbir koşulda "önce giriş yap" demez.
     · Öğrenci GİRİŞ YAPMIŞSA ayrıca kendi belgesine
       kullanicilar/{uid}.sozlukFavori yazılır; başka cihazda açtığında
       listesi geri gelir.

   FIREBASE TEMBEL YÜKLENİR. Sözlüğün işi anında arama yapmak; giriş
   yapmamış öğrenci için SDK hiç indirilmez. Girişin izi (localStorage'daki
   "firebase:authUser:…" anahtarı) varsa SDK boş anda yüklenir. SDK hiç
   gelmezse (çevrimdışı, engel) sözlük yerelde sorunsuz çalışmaya devam eder
   — bulut yalnızca bir eklentidir, koşul değil.

   BİRLEŞTİRME KURALI
     yerel boş  -> buluttaki liste alınır
     bulut boş  -> yereldeki liste buluta itilir
     ikisi dolu -> BİRLEŞİM alınır (hiçbir kelime kaybolmaz), sonuç hemen
                   buluta yazılır. Böylece bundan sonra silme de tutar:
                   bulut ile yerel eşitlendiği için silinen kelime bir daha
                   geri gelmez. (Tek istisna: A cihazında silerken B cihazı
                   çevrimdışıysa, B açıldığında kelime geri döner.)
   ========================================================================= */
(function () {
    'use strict';
    if (window.KidefFavori) return;

    var ANAHTAR = 'kidef_sozluk_favori';
    var SURUM = 1;
    var SINIR = 500;                 /* belge 1MB sınırının çok altında kalsın */
    var SDK = 'https://www.gstatic.com/firebasejs/8.10.1/';
    var AYAR = {
        apiKey: "AIzaSyBGIQPJ_Bjm5I3-QmrrGpLR5MqmG3S5F8w",
        authDomain: "kidefarapca-98f9c.firebaseapp.com",
        projectId: "kidefarapca-98f9c",
        storageBucket: "kidefarapca-98f9c.firebasestorage.app",
        messagingSenderId: "503317118211",
        appId: "1:503317118211:web:a9c8cf15b854597e0b3d36"
    };

    var _liste = null;
    var _dinleyici = [];
    var _db = null, _uid = null, _itmeZaman = null;

    /* ------------------------------------------------ kimlik ------------- */
    /* Harekeler kimliğe DAHİL: كَتَبَ ile كُتُب harekesiz aynı olur, ayrı
       kelimelerdir. Anlam da kimliğe girer; aynı yazılışın iki anlamı
       listede ayrı ayrı durabilsin. */
    function kimlik(ar, tr) { return String(ar || '') + '¦' + String(tr || ''); }

    /* ------------------------------------------------ yerel -------------- */
    function oku() {
        if (_liste) return _liste;
        _liste = [];
        try {
            var o = JSON.parse(localStorage.getItem(ANAHTAR) || 'null');
            if (o && o.liste && o.liste.length) {
                for (var i = 0; i < o.liste.length; i++) {
                    var k = o.liste[i];
                    if (k && k.ar) _liste.push({ ar: k.ar, tr: k.tr || '', tur: k.tur || '', t: k.t || 0 });
                }
            }
        } catch (e) { }
        return _liste;
    }

    function yazYerel() {
        try {
            localStorage.setItem(ANAHTAR, JSON.stringify({ s: SURUM, liste: _liste }));
        } catch (e) { }   /* kota dolu / gizli sekme: sessiz geç, liste bellekte yaşar */
    }

    function duyur() {
        for (var i = 0; i < _dinleyici.length; i++) {
            try { _dinleyici[i](_liste.length); } catch (e) { }
        }
    }

    function dizin() {
        var h = {}, l = oku();
        for (var i = 0; i < l.length; i++) h[kimlik(l[i].ar, l[i].tr)] = i;
        return h;
    }

    /* ------------------------------------------------ genel arayüz ------- */
    function icinde(ar, tr) {
        var l = oku(), k = kimlik(ar, tr);
        for (var i = 0; i < l.length; i++) if (kimlik(l[i].ar, l[i].tr) === k) return true;
        return false;
    }

    function cevir(ar, tr, tur) {
        var l = oku(), k = kimlik(ar, tr);
        for (var i = 0; i < l.length; i++) {
            if (kimlik(l[i].ar, l[i].tr) === k) {
                l.splice(i, 1); yazYerel(); duyur(); itBulut();
                return false;
            }
        }
        if (l.length >= SINIR) { duyur(); return true; }   /* sınır: sessizce ekleme */
        l.unshift({ ar: ar, tr: tr || '', tur: tur || '', t: Date.now() });
        yazYerel(); duyur(); itBulut();
        return true;
    }

    function liste() { return oku().slice(); }
    function sayi() { return oku().length; }

    function hepsiniSil() { _liste = []; yazYerel(); duyur(); itBulut(); }

    function dinle(fn) { if (typeof fn === 'function') { _dinleyici.push(fn); fn(sayi()); } }

    /* ------------------------------------------------ yıldız düğmeleri --- */
    /* Kap içindeki her kartın yıldızını listeye göre boya. */
    function yildizTazele(kap) {
        if (!kap) return;
        var d = dizin(), k = kap.querySelectorAll('.szk-kart');
        for (var i = 0; i < k.length; i++) {
            var t = k[i].querySelector('[data-fav]');
            if (!t) continue;
            var dolu = d.hasOwnProperty(kimlik(k[i].getAttribute('data-ar'), k[i].getAttribute('data-tr')));
            t.classList.toggle('dolu', dolu);
            t.setAttribute('aria-pressed', dolu ? 'true' : 'false');
            t.setAttribute('aria-label', dolu ? 'Favorilerden çıkar' : 'Favorilere ekle');
        }
    }

    /* Tek dinleyici: kap içindeki bütün yıldızlar. */
    function bagla(kap, sonra) {
        if (!kap || kap.getAttribute('data-fav-bagli')) return;
        kap.setAttribute('data-fav-bagli', '1');
        kap.addEventListener('click', function (e) {
            var t = e.target.closest ? e.target.closest('[data-fav]') : null;
            if (!t) return;
            e.preventDefault();
            e.stopPropagation();
            var kart = t.closest('.szk-kart');
            if (!kart) return;
            var dolu = cevir(kart.getAttribute('data-ar'),
                             kart.getAttribute('data-tr'),
                             kart.getAttribute('data-tur'));
            t.classList.toggle('dolu', dolu);
            t.setAttribute('aria-pressed', dolu ? 'true' : 'false');
            t.setAttribute('aria-label', dolu ? 'Favorilerden çıkar' : 'Favorilere ekle');
            if (typeof sonra === 'function') sonra(kart, dolu);
        });
    }

    /* ------------------------------------------------ bulut -------------- */
    /* window.localStorage'a ERİŞMEK bile atabilir (gizli sekme, üçüncü taraf
       çerçevede engellenmiş depo): okuma değil, özelliğin kendisi SecurityError
       verir. Bu yüzden depo adla alınıp erişim de try içinde. */
    function depoBak(ad) {
        try {
            var dep = window[ad];
            if (!dep) return false;
            for (var i = 0; i < dep.length; i++) {
                var k = dep.key(i);
                if (k && k.indexOf('firebase:authUser:') === 0) return true;
            }
        } catch (e) { }
        return false;
    }
    function girisIzi() { return depoBak('localStorage') || depoBak('sessionStorage'); }

    function betik(src) {
        return new Promise(function (ok, hata) {
            var s = document.createElement('script');
            s.src = src; s.async = false;
            s.onload = ok; s.onerror = function () { hata(new Error(src)); };
            document.head.appendChild(s);
        });
    }

    function itBulut() {
        if (!_db || !_uid) return;
        clearTimeout(_itmeZaman);
        _itmeZaman = setTimeout(function () {
            try {
                _db.collection('kullanicilar').doc(_uid).set({
                    sozlukFavori: { s: SURUM, guncel: Date.now(), liste: oku().slice(0, SINIR) }
                }, { merge: true }).catch(function () { });
            } catch (e) { }
        }, 1200);   /* arka arkaya yıldızlamada tek yazma */
    }

    function birlestir(uzak) {
        var yerel = oku();
        var u = (uzak && uzak.liste) ? uzak.liste : [];
        if (!u.length) { if (yerel.length) itBulut(); return; }
        if (!yerel.length) { _liste = u.slice(0, SINIR); yazYerel(); duyur(); return; }

        var h = {}, yeni = [];
        function kat(o) {
            if (!o || !o.ar) return;
            var k = kimlik(o.ar, o.tr);
            if (h[k]) { if (o.t && (!h[k].t || o.t < h[k].t)) h[k].t = o.t; return; }
            h[k] = { ar: o.ar, tr: o.tr || '', tur: o.tur || '', t: o.t || 0 };
            yeni.push(h[k]);
        }
        for (var i = 0; i < yerel.length; i++) kat(yerel[i]);
        for (var j = 0; j < u.length; j++) kat(u[j]);
        yeni.sort(function (a, b) { return (b.t || 0) - (a.t || 0); });
        _liste = yeni.slice(0, SINIR);
        yazYerel(); duyur();
        itBulut();            /* iki taraf eşitlensin: bundan sonra silme tutar */
    }

    function bulutBagla() {
        if (!girisIzi()) return;                      /* giriş yok -> SDK hiç inmesin */
        betik(SDK + 'firebase-app.js')
            .then(function () { return betik(SDK + 'firebase-auth.js'); })
            .then(function () { return betik(SDK + 'firebase-firestore.js'); })
            .then(function () {
                if (typeof firebase === 'undefined') return;
                if (!firebase.apps.length) firebase.initializeApp(AYAR);
                var db = firebase.firestore();
                firebase.auth().onAuthStateChanged(function (u) {
                    if (!u) { _db = null; _uid = null; return; }
                    _db = db; _uid = u.uid;
                    db.collection('kullanicilar').doc(u.uid).get().then(function (d) {
                        birlestir(d.exists && d.data() ? d.data().sozlukFavori : null);
                    }).catch(function () { });
                });
            })
            .catch(function () { });                  /* SDK inmedi: yerel devam eder */
    }

    function basla() {
        oku();
        if (window.requestIdleCallback) requestIdleCallback(bulutBagla, { timeout: 4000 });
        else setTimeout(bulutBagla, 1500);
    }

    window.KidefFavori = {
        kimlik: kimlik, icinde: icinde, cevir: cevir,
        liste: liste, sayi: sayi, hepsiniSil: hepsiniSil,
        dinle: dinle, bagla: bagla, yildizTazele: yildizTazele,
        basla: basla, sinir: SINIR
    };
})();
