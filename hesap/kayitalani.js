/* =========================================================================
   KİDEF — KAYIT ALANLARI (tek doğruluk kaynağı)
   -------------------------------------------------------------------------
   NİYE VAR: kayıt formu artık İKİ yerde açılıyor —
     · index.html            (hesap/auth.js → authIslemi)
     · bilgiyarismasikacom.html (hesap/biygiris.js → yerinde panel)
   İkisi de aynı doğrulamayı yapmalı ve kullanicilar/{uid} belgesini AYNI
   biçimde yazmalı. Belge biçimi Firestore kurallarına bağlı: öğretmen
   kaydında `ogretmenOnay:'bekliyor'` ZORUNLU (bkz. firestore.rules →
   kullanicilar/create), yoksa kayıt kural tarafından reddedilir.

   Bu yüzden hem doğrulama hem belge biçimi burada tutuluyor; iki dosya da
   buradan okuyor. Kayıt alanlarında bir değişiklik gerekirse YALNIZ BU
   DOSYA düzenlenir.
   ========================================================================= */
(function () {
    'use strict';

    var K = {};

    /* Telefon: 5 ile başlayan 10 hane. Kayıtta "+90" ön eki ekleniyor. */
    K.TELEFON = /^5[0-9]{9}$/;

    /* ----------------------------------------------- AD-SOYAD BAŞ HARFİ
       Öğretmen (06.10.2026): "isim veya soyisimlerinin baş harflerini
       bazen küçük yazıyorlar, onları otomatik yapalım."

       TÜRKÇE TUZAĞI: JavaScript'in toUpperCase'i "i" harfini "I" yapar;
       doğrusu "İ". Aynı şekilde "I" küçülünce "ı" olmalı. Bu iki harf
       elle ele alınıyor, gerisi tr-TR yerel kurallarıyla.

       Sözcüğün İLK harfi büyük, GERİSİ küçük: böylece caps lock'la
       yazılmış "MEHMET" de düzeliyor. Sözcük sınırı boşluk ve kısa
       çizgi; kesme işareti sınır sayılmaz ("Ali'nin" bozulmasın). */
    function trBuyuk(h) {
        if (h === 'i') return 'İ';
        if (h === 'ı') return 'I';
        try { return h.toLocaleUpperCase('tr-TR'); } catch (e) { return h.toUpperCase(); }
    }
    function trKucuk(m) {
        m = String(m).split('I').join('ı').split('İ').join('i');
        try { return m.toLocaleLowerCase('tr-TR'); } catch (e) { return m.toLowerCase(); }
    }
    K.adDuzelt = function (ad) {
        var s = String(ad == null ? '' : ad).replace(/\s+/g, ' ').trim();
        if (!s) return '';
        return s.split(' ').map(function (sozcuk) {
            return sozcuk.split('-').map(function (k) {
                if (!k) return k;
                return trBuyuk(k.charAt(0)) + trKucuk(k.slice(1));
            }).join('-');
        }).join(' ');
    };

    /* Formun doğrulaması. Dönen değer:
         { tamam:true, veri:{…} }            — her şey yolunda
         { tamam:false, hata:'…' }           — ilk hatalı alanın mesajı
       Mesajlar index'teki metinlerle birebir aynı; öğretmen iki ekranda
       farklı uyarı görmesin. */
    /* KAYIT ANKETI: rol + 4 kisa soru (hesap/kayitanketi.js). Cevaplar
       zorunlu; kapi gecilmeden e-posta alanlari gorunmuyor, bu yuzden
       burada ayrica dogrulanmiyor - yalniz belgeye ekleniyor. */
    K.dogrula = function (a, sec) {
        a = a || {};
        var sifresiz = !!(sec && sec.sifresiz);     /* «Kaydı tamamla»: hesap zaten açık, şifre sorulmaz (26.10.2026) */
        var email = String(a.email || '').trim();
        var pass = String(a.pass || '');
        var pass2 = String(a.pass2 || '');
        var ad = String(a.ad || '').trim();
        var meslek = String(a.meslek || '').trim();
        var tel = String(a.tel || '').trim();
        var cinsiyet = String(a.cinsiyet || '').trim();

        if (!email || (!pass && !sifresiz)) return { tamam: false, hata: 'Lütfen tüm alanları doldurun.' };
        if (!sifresiz && pass !== pass2) return { tamam: false, hata: 'Şifreler uyuşmuyor.' };
        if (!ad) return { tamam: false, hata: 'Lütfen isminizi girin.' };
        if (!meslek) return { tamam: false, hata: 'Lütfen mesleğinizi girin (zorunlu).' };
        if (!K.TELEFON.test(tel)) {
            return { tamam: false, hata: 'Geçerli bir telefon numarası girin: 5XX XXX XX XX (zorunlu).' };
        }
        if (!cinsiyet) return { tamam: false, hata: 'Lütfen cinsiyetinizi seçin (zorunlu).' };

        return { tamam: true, veri: { email: email, pass: pass, ad: ad,
                                      meslek: meslek, tel: tel, cinsiyet: cinsiyet } };
    };

    /* kullanicilar/{uid} belgesi. rol yalnız 'student' ya da 'teacher'
       olabilir (kural: kimse kendini admin yazamaz). */
    K.belge = function (v, rol) {
        rol = (rol === 'teacher') ? 'teacher' : 'student';
        var d = {
            email: v.email,
            role: rol,
            /* Baş harfler burada düzeltiliyor; iki kayıt ekranı da bu
               belgeyi yazdığı için tek yer yetiyor (06.10.2026). */
            name: K.adDuzelt(v.ad) || 'Belirtilmedi',
            meslek: v.meslek || '',
            cinsiyet: v.cinsiyet || '',
            phone: v.tel ? ('+90' + v.tel) : '',
            packages: []
        };
        try {
            d.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        } catch (e) { /* firebase yoksa alan yazılmaz */ }
        /* KAYIT ANKETI (27.09.2026): rol sorusu + 4 kisa soru. Cevaplari
           hesap/kayitanketi.js tutar; burada yalniz belgeye ekleniyor ki
           iki kayit ekrani da ayni alani yazsin. Dosya yuklenmemisse alan
           hic yazilmaz - eski kayitlar gibi. */
        try {
            var _ank = (window.KidefAnket && window.KidefAnket.belgeAlani)
                ? window.KidefAnket.belgeAlani(rol) : null;
            if (_ank) d.anket = _ank;
        } catch (e) { }
        /* ÖĞRETMEN ONAY KAPISI: öğretmen kaydı doğrudan açılmaz, yönetici
           onayına düşer (sistem/erisim.js perdesi ve yönetici paneli). */
        if (rol === 'teacher') {
            d.ogretmenOnay = 'bekliyor';
            try {
                d.onayIstekTarihi = firebase.firestore.FieldValue.serverTimestamp();
            } catch (e) { }
        }
        return d;
    };

    /* Kayıt sonrası kullanıcıya gösterilecek metin. */
    K.bitisMesaji = function (rol) {
        return (rol === 'teacher')
            ? 'Kaydın alındı. Öğretmen hesapları yönetici onayından sonra açılıyor; onaylandığında siteyi kullanabileceksin.'
            : 'Kayıt başarılı!';
    };

    /* =====================================================================
       HESAP HATALARI — TÜRKÇE (26.10.2026)
       Öğretmen: "bi öğretmen giriş yapmış ama böyle bi hata almış" — ekranda
       Firebase'in ham JSON'u çıkıyordu:
         Giriş başarısız: {"error":{"code":400,"message":"INVALID_LOGIN_CREDENTIALS"…
       Firebase'de e-posta sayımı koruması açık: yanlış şifre ile olmayan hesap
       ayrı ayrı söylenmez; eski SDK (8.10.1) bunu auth/internal-error + JSON
       gövde olarak verir. Bütün giriş/kayıt ekranları hatayı buradan Türkçeye
       çevirir; ham kod yalnız bilinmeyen hatada, parantez içinde kalır.
       ===================================================================== */
    function hamKod(e) {
        if (!e) return '';
        var kod = String(e.code || '');
        var m = String(e.message || (typeof e === 'string' ? e : ''));
        var j = /"message"\s*:\s*"([A-Z_]+)/.exec(m);        /* {"error":{"message":"INVALID_LOGIN_CREDENTIALS"}} */
        if (j) return j[1];
        if (kod) return kod;
        var k2 = /\b((?:auth|firestore)\/[a-z-]+)/.exec(m);
        return k2 ? k2[1] : (m.length <= 60 ? m : '');
    }
    K.hataKodu = hamKod;
    K.hataMetni = function (e, kip) {
        if (e && e.metin) return e.metin;                      /* buradan çıkmış, Türkçesi hazır */
        var k = hamKod(e);
        var unut = ' Şifreni unuttuysan «Şifremi unuttum» ile yenileyebilirsin.';
        switch (k) {
            case 'INVALID_LOGIN_CREDENTIALS': case 'INVALID_PASSWORD': case 'EMAIL_NOT_FOUND':
            case 'auth/invalid-login-credentials': case 'auth/wrong-password':
            case 'auth/user-not-found': case 'auth/invalid-credential':
                return 'E-posta ya da şifre hatalı. Yazımı denetleyip tekrar dene.' + unut;
            case 'INVALID_EMAIL': case 'auth/invalid-email': case 'MISSING_EMAIL': case 'auth/missing-email':
                return 'E-posta adresi geçersiz görünüyor; yazımını denetle (örn. ad@posta.com).';
            case 'MISSING_PASSWORD': case 'auth/missing-password':
                return 'Şifreni yaz.';
            case 'USER_DISABLED': case 'auth/user-disabled':
                return 'Bu hesap kapatılmış. İletişim sayfasından yazabilirsin.';
            case 'TOO_MANY_ATTEMPTS_TRY_LATER': case 'auth/too-many-requests':
                return 'Çok fazla deneme yapıldı; birkaç dakika bekleyip tekrar dene.' + unut;
            case 'auth/network-request-failed':
                return 'Bağlantı kurulamadı. İnternetini denetleyip tekrar dene.';
            case 'EMAIL_EXISTS': case 'auth/email-already-in-use':
                return 'Bu e-posta ile zaten bir hesap var. Giriş yap; şifreni unuttuysan «Şifremi unuttum» ile yenile.';
            case 'WEAK_PASSWORD': case 'auth/weak-password':
                return 'Şifre en az 6 karakter olmalı.';
            case 'OPERATION_NOT_ALLOWED': case 'auth/operation-not-allowed':
                return 'Bu giriş yöntemi şu an kapalı. İletişim sayfasından yazabilirsin.';
            case 'auth/requires-recent-login':
                return 'Güvenlik için yeniden giriş yapman gerekiyor.';
            case 'permission-denied': case 'firestore/permission-denied':
                return (kip === 'kayit' ? 'Kayıt yazılamadı (izin).' : 'Bilgiler okunamadı (izin).') +
                    ' Tekrar dene; sürerse iletişim sayfasından yaz.';
            case 'unavailable': case 'firestore/unavailable': case 'deadline-exceeded':
                return 'Sunucuya ulaşılamadı. Bağlantını denetleyip tekrar dene.';
            case 'resource-exhausted': case 'firestore/resource-exhausted': case 'RESOURCE_EXHAUSTED':
                /* Firestore ücretsiz plan: günde 50.000 okuma; dolunca gün bitimine (Pasifik gece
                   yarısı = Türkiye'de sabah ~10:00) kadar her okuma bu hatayı verir (26.10.2026). */
                return kip === 'okuma'
                    ? 'Firestore günlük ücretsiz okuma kotası (50.000) doldu; listeler sabah 10:00 sularına kadar alınamaz. Kalıcı çözüm: Firebase planını Blaze planına yükseltmek.'
                    : 'Site günlük kullanım sınırına ulaştı (Firebase kotası). Sabah 10:00 sularından sonra tekrar dene.';
        }
        var bas = kip === 'kayit' ? 'Kayıt yapılamadı.' : kip === 'sifre' ? 'Şifre yenileme bağlantısı gönderilemedi.'
                : kip === 'okuma' ? 'Liste alınamadı.' : 'Giriş yapılamadı.';
        return bas + ' Tekrar dene; sürerse iletişim sayfasından yaz.' + (k ? ' (' + k + ')' : '');
    };
    K.hesapZatenVarMi = function (e) {
        var k = hamKod(e);
        return k === 'auth/email-already-in-use' || k === 'EMAIL_EXISTS';
    };

    /* =====================================================================
       VAR OLAN HESAP (26.10.2026) — yönetici: "bi öğrenciyi yönetici öğretmenler
       kısmından silince tekrar kayıt olduğunda firebase'ta göründüğü gibi …
       öğretmenler kısmında görelim, onaylayabilelim".
       Yönetici paneli kullanicilar/{uid} belgesini siler; Firebase KİMLİK hesabı
       kalır (tarayıcıdan silinemez). Kişi aynı e-postayla yeniden kayıt olunca
       createUserWithEmailAndPassword "e-posta kullanımda" der, belge yazılmaz;
       kişi girse de panelde görünmez (belgesi yok). Burada aynı e-posta ve
       şifreyle giriş denenir:
         · girilir, belge YOK  → kayıt belgesi yazılır (yeni kayıt gibi; öğretmen
                                 yönetici onay kuyruğuna düşer)
         · girilir, belge VAR  → kişi zaten kayıtlı; giriş yapılmış olur
         · girilemez (şifre)   → Türkçe uyarı: şifre bu hesabın şifresi değil
       Dönen söz: { durum: 'yazildi' | 'kayitli', user, belge }
       ===================================================================== */
    K.varOlanHesap = function (veri, rol) {
        rol = (rol === 'teacher') ? 'teacher' : 'student';
        var auth = firebase.auth(), db = firebase.firestore();
        return auth.signInWithEmailAndPassword(veri.email, veri.pass).then(function (c) {
            var u = c.user, ref = db.collection('kullanicilar').doc(u.uid);
            return ref.get().then(function (doc) {
                var v = doc.exists ? (doc.data() || {}) : null;
                if (v && v.role) return { durum: 'kayitli', user: u, belge: v };
                var b = K.belge(veri, rol);
                /* belge var ama rolü yok (eski/yarım kayıt): üstüne yazılır, öbür alanlar kalır */
                return (v ? ref.set(b, { merge: true }) : ref.set(b)).then(function () { return { durum: 'yazildi', user: u, belge: b }; });
            });
        }, function (e) {
            var k = hamKod(e), h;
            if (k === 'auth/network-request-failed' || k === 'auth/too-many-requests' || k === 'TOO_MANY_ATTEMPTS_TRY_LATER' ||
                k === 'USER_DISABLED' || k === 'auth/user-disabled') {
                h = new Error(K.hataMetni(e, 'kayit'));
            } else {
                h = new Error('Bu e-posta ile daha önce hesap açılmış ama yazdığın şifre o hesabın şifresi değil. ' +
                    'Doğru şifreyle «Kayıt Ol»a basarsan kaydın tamamlanır; şifreni unuttuysan «Şifremi unuttum» ile yenileyip giriş yap.');
            }
            h.kod = 'varolan'; h.asil = e; h.metin = h.message;
            throw h;
        });
    };

    /* ŞİFREMİ UNUTTUM (26.10.2026): Firebase sıfırlama e-postası (Türkçe).
       Hesabın olup olmadığı söylenmez (e-posta sayımı koruması gibi). */
    K.sifreMesaji = function (email) {
        return 'Bu adrese kayıtlı bir hesap varsa şifre yenileme bağlantısı gönderildi: ' + email +
            '. Gelen kutusunu ve gereksiz (spam) klasörünü denetle; bağlantıyla yeni şifreni belirleyip giriş yap.';
    };
    K.sifreSifirla = function (email) {
        email = String(email || '').trim();
        if (!email) {
            var bos = new Error('Önce e-posta adresini yaz, sonra «Şifremi unuttum»a bas.');
            bos.metin = bos.message; return Promise.reject(bos);
        }
        var auth = firebase.auth();
        try { auth.languageCode = 'tr'; } catch (e) { }
        return auth.sendPasswordResetEmail(email).then(function () { return K.sifreMesaji(email); }, function (e) {
            var k = hamKod(e);
            if (k === 'EMAIL_NOT_FOUND' || k === 'auth/user-not-found') return K.sifreMesaji(email);   /* hesap var mı söylenmez */
            var h = new Error(K.hataMetni(e, 'sifre')); h.metin = h.message; h.asil = e; throw h;
        });
    };

    window.KidefKayit = K;
})();
