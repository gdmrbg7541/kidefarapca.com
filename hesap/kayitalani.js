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

   E-POSTA YAZIM ÖNERİSİ (03.11.2026): dosyanın sonunda — kayıt formlarında
   «gmial.com» gibi yazımlara «gmail.com mu demek istedin?» önerisi.
   GİRİŞTE YAZIM ÖNERİSİ (04.11.2026): girişte de, ama yalnız giriş başarısız
   olunca ya da «Şifremi unuttum»a basınca.
   AD + SOYAD ZORUNLU (06.11.2026): öğretmen kaydında ad en az iki sözcük
   (adSoyadTam, SOYAD_ZORUNLU); dogrula(a, {rol}) ile.
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

    /* ----------------------------------------------- AD + SOYAD ZORUNLU (06.11.2026)
       Yönetici: "sadece ismini yazıp soy ismini yazmayan öğretmenler oluyor bunu
       engelleyelim". Öğretmen kaydında ad en az İKİ sözcük olmalı; her sözcükte en
       az iki harf («Ali Y.» geçmez; «Dr. Ayşe Yılmaz» ve «Ayşe Nur Yılmaz» geçer).
       Öğrenci kaydı eskisi gibi (SOYAD_ZORUNLU.student). Harf: Latin (Türkçe),
       Kiril, Arap alfabesi. Ana sayfanın kayıt formu (hesap/auth.js) da aynı
       denetimi buradan kullanır. */
    K.SOYAD_ZORUNLU = { teacher: true, student: false };
    K.AD_SOYAD_HATA = 'Lütfen adını ve soyadını birlikte yaz (örn. Ayşe Yılmaz).';
    K.adSoyadTam = function (ad) {
        var s = String(ad == null ? '' : ad).replace(/\s+/g, ' ').trim();
        if (!s) return false;
        var n = 0, p = s.split(' ');
        for (var i = 0; i < p.length; i++) {
            var harf = p[i].replace(/[^A-Za-zÀ-ɏЀ-ӿ؀-ۿ]/g, '');
            if (harf.length >= 2) n++;
        }
        return n >= 2;
    };
    K.soyadGerekli = function (rol) { return !!K.SOYAD_ZORUNLU[rol === 'teacher' ? 'teacher' : 'student']; };

    /* ÖĞRETMEN KAYIT SORUSU (09.11.2026) — bir öğretmen: "Üye olup öğretmen olmama rağmen profilimde
       öğrenci olarak görünüyorum ve tüm sınıflara ulaşım sağlayamıyorum". Öğrenci seçiliyken mesleğe
       öğretmenlik yazılırsa kayıttan ÖNCE sorulur: «Öğretmen olarak kaydol» / «Öğrenciyim, devam et».
       Kullananlar: hesap/auth.js (ana sayfanın kayıt formu), hesap/kayittamamla.js («Kaydını tamamla»). */
    K.OGRETMEN_MESLEK = /öğretmen|ogretmen|hoca|eğitimci|egitimci|eğitmen|egitmen|teacher|akademisyen|öğretim görevlisi|ogretim gorevlisi|öğretim üyesi|ogretim uyesi|muallim/;
    K.meslekAnahtar = function (m) {
        var s = String(m == null ? '' : m).replace(/\s+/g, ' ').trim();
        try { return s.toLocaleLowerCase('tr'); } catch (e) { return s.toLowerCase(); }
    };
    K.ogretmenMeslegi = function (m) { return K.OGRETMEN_MESLEK.test(K.meslekAnahtar(m)); };
    /* kap: kutunun yazılacağı öğe (hata satırı). Kutu çizildiyse true döner. */
    K.rolSor = function (kap, meslek, ogretmen, ogrenci) {
        if (!kap) return false;
        var e = function (t) {
            return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
                return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
            });
        };
        kap.innerHTML =
            '<span class="kk-rolsor" role="group" aria-label="Öğretmen misin?" style="display:block;text-align:left;margin:6px 0 2px;' +
            'padding:11px 13px;border-radius:14px;background:#FFF8E6;border:1.5px solid #F3D9A4;color:#5B4A1F;font-size:13.5px;' +
            'line-height:1.5;font-weight:600;">' +
            '<b style="display:block;color:#2C3E50;font-size:14.5px;margin:0 0 3px;">Öğretmen misin?</b>' +
            'Mesleğine «' + e(meslek) + '» yazdın ama <b>öğrenci</b> olarak kaydoluyorsun. Öğrenci hesabıyla sınıflarına ' +
            've öğretmen araçlarına ulaşamazsın.' +
            '<span style="display:flex;flex-wrap:wrap;gap:8px;margin-top:9px;">' +
            '<button type="button" data-kk-rol="teacher" style="flex:1 1 170px;border:0;border-radius:11px;padding:10px 12px;' +
            'background:#16A085;color:#fff;font:inherit;font-weight:800;cursor:pointer;">Öğretmen olarak kaydol</button>' +
            '<button type="button" data-kk-rol="student" style="flex:1 1 140px;border:0;border-radius:11px;padding:10px 12px;' +
            'background:#F2F5F8;color:#2C3E50;font:inherit;font-weight:700;cursor:pointer;">Öğrenciyim, devam et</button>' +
            '</span></span>';
        var b = kap.querySelectorAll('button[data-kk-rol]');
        b[0].onclick = function (ev) { if (ev) ev.preventDefault(); kap.innerHTML = ''; if (ogretmen) ogretmen(); };
        b[1].onclick = function (ev) { if (ev) ev.preventDefault(); kap.innerHTML = ''; if (ogrenci) ogrenci(); };
        try { b[0].focus(); } catch (x) { }
        return true;
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
        if (sec && K.soyadGerekli(sec.rol) && !K.adSoyadTam(ad)) return { tamam: false, hata: K.AD_SOYAD_HATA };   /* AD + SOYAD ZORUNLU (06.11.2026) */
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
        /* GİRİŞTE YAZIM ÖNERİSİ (04.11.2026): «e-posta ya da şifre hatalı» → adres yanlış yazılmış mı? */
        if (kip === 'giris' && EP_GIRIS_HATA[k]) { try { setTimeout(epGirisHatasi, 0); } catch (x) { } }
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

    /* =====================================================================
       E-POSTA YAZIM ÖNERİSİ (03.11.2026) — yönetici: "bi hesap için birden fazla
       kişi oluşuyor, şuan bi öğrenciden 3 tane anket görünüyor". Aynı e-postayla
       ikinci hesap açılamıyor (Firebase izin vermiyor; yukarıdaki varOlanHesap
       ya giriş yapar ya «zaten kayıtlı» der). Ayrı hesaplar FARKLI YAZILMIŞ
       adreslerle açılıyor: gmial.com, hotmial.com, gmail.co, gmail.com.tr…
       Kayıt formunda alan adı bilinen bir adrese çok benziyorsa e-posta alanının
       altında öneri çıkar: «… mu demek istedin? [Evet, düzelt] [Hayır, doğru
       yazdım]». «Kayıt Ol»a ya da Enter'a basınca öneri yanıtsızsa kayıt bir kez
       durur; öneriyi görüp 2 sn sonra yeniden basan geçer. Girişte öneri ÖNCEDEN
       çıkmaz (yanlış yazılmış adresle açılmış eski hesabın sahibi yanlış yöne
       çekilmesin); yalnız giriş başarısız olunca ya da «Şifremi unuttum»a basınca
       çıkar — GİRİŞTE YAZIM ÖNERİSİ (04.11.2026), aşağıda.
       Formlar: giriş penceresi #email (index + ortak pencere) · sepet
       #checkout-email · bilgi yarışması paneli #biyg-email.
       Bu dosya DOM'a yalnız bu bölümde dokunur.
       ===================================================================== */
    var EP_BILINEN = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'yandex.com',
        'live.com', 'msn.com', 'me.com', 'mail.com', 'ymail.com', 'aol.com', 'gmx.com', 'googlemail.com',
        'proton.me', 'protonmail.com', 'protonmail.ch', 'hotmail.com.tr', 'outlook.com.tr', 'yahoo.com.tr',
        'yandex.com.tr', 'live.com.tr', 'yandex.ru', 'windowslive.com', 'mynet.com', 'ttmail.com',
        'meb.k12.tr', 'meb.gov.tr'];

    /* iki yazım arası en az düzeltme sayısı (yer değiştiren iki komşu harf: 1) */
    function epMesafe(a, b) {
        var m = a.length, n = b.length, d = [], i, j, c;
        for (i = 0; i <= m; i++) d[i] = [i];
        for (j = 1; j <= n; j++) d[0][j] = j;
        for (i = 1; i <= m; i++) {
            for (j = 1; j <= n; j++) {
                c = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
                d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
                if (i > 1 && j > 1 && a.charAt(i - 1) === b.charAt(j - 2) && a.charAt(i - 2) === b.charAt(j - 1)) {
                    d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
                }
            }
        }
        return d[m][n];
    }
    function epBilinen(a) { return EP_BILINEN.indexOf(a) >= 0; }

    /* Önerilen tam adres ya da ''. Yalnız @'den sonrası düzeltilir. */
    K.epostaOneri = function (e) {
        e = String(e == null ? '' : e).trim();
        var at = e.lastIndexOf('@');
        if (at < 1 || at === e.length - 1) return '';
        var yerel = e.slice(0, at), alan = e.slice(at + 1).toLowerCase();
        if (epBilinen(alan)) return '';
        var a = alan.replace(/̇/g, '').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
            .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/\s+/g, '').replace(/,/g, '.').replace(/\.{2,}/g, '.').replace(/^\.+|\.+$/g, '');
        if (!a) return '';
        var i, k, en = '', ed = 99, dd, sinir;
        function oner(x) { return yerel + '@' + x; }
        if (epBilinen(a)) return oner(a);                                   /* gmaıl.com · gmail.com. · gmail,com */
        /* başka ülkenin gerçek adresi (hotmail.com.br, live.com.au, yandex.ua): dokunma */
        var ul = /^(.+)\.([a-z]{2})$/.exec(a);
        if (ul && ul[2] !== 'tr') {
            if (epBilinen(ul[1])) return '';
            for (i = 0; i < EP_BILINEN.length; i++) {
                k = /^(.+)\.([a-z]{2})$/.exec(EP_BILINEN[i]);
                if (k && k[1] === ul[1] && k[2] !== 'tr') return '';
            }
        }
        /* bilinen adres + fazladan birkaç harf: gmail.com.tr · gmail.comm · hotmail.com.trr */
        for (i = 0; i < EP_BILINEN.length; i++) {
            k = EP_BILINEN[i];
            if (a.length > k.length && a.length - k.length <= 4 && a.indexOf(k) === 0 && k.length > en.length) en = k;
        }
        if (en) return oner(en);
        /* noktasız: gmail → gmail.com · gmial → gmail.com · gmailcom → gmail.com */
        if (a.indexOf('.') < 0 && a.length >= 4) {
            for (i = 0; i < EP_BILINEN.length; i++) {
                k = EP_BILINEN[i].split('.')[0];
                dd = epMesafe(a, EP_BILINEN[i].replace(/\./g, ''));
                if (dd < ed && dd <= (a.length <= 7 ? 1 : 2)) { ed = dd; en = EP_BILINEN[i]; }
                if (k.length < 4) continue;
                dd = epMesafe(a, k);
                if (dd < ed && dd <= (k.length <= 5 ? 1 : 2)) { ed = dd; en = EP_BILINEN[i]; }
            }
            return en ? oner(en) : '';
        }
        for (i = 0; i < EP_BILINEN.length; i++) {
            dd = epMesafe(a, EP_BILINEN[i]);
            if (dd < ed) { ed = dd; en = EP_BILINEN[i]; }
        }
        sinir = a.length <= 7 ? 1 : 2;
        return (en && ed <= sinir) ? oner(en) : '';
    };

    /* ---- kayıt formlarındaki öneri kutusu ---- */
    var EP_FORM = [
        { e: 'email', grup: 're-password-group', tus: 'auth-action-btn' },               /* giriş penceresi */
        { e: 'checkout-email', grup: 'checkout-re-password-group', tus: 'checkout-action-btn' },   /* sepet */
        { e: 'biyg-email', ikinci: 'biyg-pass2', tus: 'biyg-gonder' }                    /* bilgi yarışması paneli */
    ];
    var _epRed = {};          /* «Hayır, doğru yazdım» denen adresler */
    var _epDur = {};          /* adres → kaydın ilk durduğu an */
    var _epSaat = 0;
    var _epGiris = {};        /* girişi başarısız olan ya da «Şifremi unuttum» denen adresler: girişte de öneri */
    function ep$(id) { return document.getElementById(id); }
    function epForm(id) {
        for (var i = 0; i < EP_FORM.length; i++) { if (EP_FORM[i].e === id || EP_FORM[i].tus === id) return EP_FORM[i]; }
        return null;
    }
    function epKayitMi(f) {
        if (f.ikinci) return !!ep$(f.ikinci);
        var g = ep$(f.grup);
        try { return !!g && getComputedStyle(g).display !== 'none'; } catch (x) { return false; }
    }
    function epGorunur(el) { return !!el && !!(el.offsetWidth || el.offsetHeight || (el.getClientRects && el.getClientRects().length)); }
    function epDeger(inp) { return String((inp && inp.value) || '').trim(); }
    function epBekleyen(f, girisDe) {
        var inp = ep$(f.e);
        if (!inp) return '';
        var v = epDeger(inp);
        if (!v || _epRed[v.toLowerCase()]) return '';
        /* girişte: yalnız o adresle giriş başarısız olduysa ya da «Şifremi unuttum»a basıldıysa */
        if (!epKayitMi(f) && !girisDe && !_epGiris[v.toLowerCase()]) return '';
        return K.epostaOneri(v);
    }
    function epEsc(x) {
        return String(x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
    }
    function epStil() {
        if (ep$('kdepStil')) return;
        var s = document.createElement('style');
        s.id = 'kdepStil';
        s.textContent =
            '.kdep{display:block;margin:7px 0 2px;padding:9px 11px;border-radius:11px;background:#FFF8E6;border:1px solid #F3D28A;' +
              'color:#6B4600;font-size:.88rem;font-weight:600;line-height:1.45;text-align:left;box-sizing:border-box;max-width:100%;overflow-wrap:anywhere}' +
            '.kdep b{color:#3F2A00;font-weight:800}' +
            '.kdep .kdep-tus{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}' +
            '.kdep .kdep-tus button{width:auto;margin:0;border:0;border-radius:9px;padding:7px 11px;font:inherit;font-size:.84rem;' +
              'font-weight:800;line-height:1.2;cursor:pointer;box-shadow:none}' +
            '.kdep .kdep-tus .kdep-evet{background:#0E7C66;color:#fff}' +
            '.kdep .kdep-tus .kdep-hayir{background:#EEF2F6;color:#3F4B5B}' +
            '.kdep.kdep-vurgu{animation:kdepTit .45s}' +
            '@keyframes kdepTit{0%,100%{transform:none}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}' +
            '@media (prefers-reduced-motion:reduce){.kdep.kdep-vurgu{animation:none}}' +
            /* HAZIR UZANTI TUŞLARI (04.11.2026) */
            '.kdep-cip{display:flex;flex-wrap:wrap;gap:6px;margin:7px 0 2px;align-items:center}' +
            '.kdep-cip button{width:auto;margin:0;border:1px solid #DCE3EC;background:#F7F9FC;color:#3F4B5B;border-radius:999px;' +
              'padding:5px 10px;font:inherit;font-size:.8rem;font-weight:700;line-height:1.2;cursor:pointer;box-shadow:none;' +
              'direction:ltr;unicode-bidi:isolate;transition:border-color .15s,color .15s,background .15s}' +
            '.kdep-cip button:hover,.kdep-cip button:focus-visible{border-color:#16A085;color:#0E7C66;background:#F0FAF7;outline:none}' +
            '.kdep-cip .kdep-cip-not{flex:1 1 100%;font-size:.8rem;font-weight:700;color:#8A5A00;line-height:1.4}' +
            '.kdep-cip .kdep-cip-not:empty{display:none}';
        (document.head || document.documentElement).appendChild(s);
    }
    function epKutu(inp) {
        var n = inp && inp.nextElementSibling;
        return (n && n.classList && n.classList.contains('kdep')) ? n : null;
    }
    function epKaldir(f) {
        var k = epKutu(ep$(f.e));
        if (k && k.parentNode) k.parentNode.removeChild(k);
    }
    /* kip değişince (Kayıt Ol ↔ Giriş Yap) kutu kendini tazelesin */
    function epGozle(f) {
        var g = f.grup ? ep$(f.grup) : null;
        if (!g || g.__kdep || typeof MutationObserver !== 'function') return;
        g.__kdep = 1;
        try { new MutationObserver(function () { epDegerlendir(f); }).observe(g, { attributes: true, attributeFilter: ['style', 'class'] }); } catch (x) { }
    }
    function epGoster(f, oneri, vurgu) {
        var inp = ep$(f.e);
        if (!inp || !inp.parentNode) return;
        epStil(); epGozle(f);
        var k = epKutu(inp), v = epDeger(inp), at = oneri.lastIndexOf('@');
        if (!k) {
            k = document.createElement('div');
            k.className = 'kdep';
            k.setAttribute('role', 'status');
            k.setAttribute('aria-live', 'polite');
            inp.parentNode.insertBefore(k, inp.nextSibling);
        }
        if (k.getAttribute('data-oneri') !== oneri) {
            k.setAttribute('data-oneri', oneri);
            k.innerHTML = '<span>«' + epEsc(v.slice(v.lastIndexOf('@') + 1)) + '» yazdın; ' + epEsc(oneri.slice(0, at + 1)) +
                '<b>' + epEsc(oneri.slice(at + 1)) + '</b> mu demek istedin?</span>' +
                '<span class="kdep-tus"><button type="button" class="kdep-evet">Evet, düzelt</button>' +
                '<button type="button" class="kdep-hayir">Hayır, doğru yazdım</button></span>';
        }
        if (vurgu) {
            k.classList.remove('kdep-vurgu'); void k.offsetWidth; k.classList.add('kdep-vurgu');
            try { inp.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (x) { }
        }
    }
    function epDegerlendir(f) {
        if (!f) return;
        var o = epBekleyen(f);
        if (o) epGoster(f, o, false); else epKaldir(f);
    }
    /* «Kayıt Ol» / Enter: öneri yanıtsızsa bir kez dur */
    function epDurdur(e, f, girisDe) {
        if (!f) return false;
        var inp = ep$(f.e), o = epBekleyen(f, girisDe);
        if (!o || !epGorunur(inp)) return false;
        if (girisDe) _epGiris[epDeger(inp).toLowerCase()] = 1;
        var v = epDeger(inp).toLowerCase(), t = _epDur[v], simdi = Date.now();
        if (t && simdi - t >= 2000) return false;                 /* öneriyi gördü, yine de bastı: geçsin */
        if (!t) _epDur[v] = simdi;
        e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        epGoster(f, o, true);
        return true;
    }
    K.epostaOneriTazele = function () { for (var i = 0; i < EP_FORM.length; i++) epDegerlendir(EP_FORM[i]); };

    /* GİRİŞTE YAZIM ÖNERİSİ (04.11.2026) — yönetici: "öğretmen yanlış e posta yazmış, bu nedenle şifre yanlış
       demiş"; «Şifremi unuttum» bağlantısı da (o adreste hesap olmadığı için) hiç gelmemiş. Giriş
       «e-posta ya da şifre hatalı» ile dönünce görünür formdaki adres yanlış yazılmış görünüyorsa öneri
       kutusu çıkar ve sallanır; giriş durdurulmaz. K.hataMetni(e, 'giris') çağırır. */
    var EP_GIRIS_HATA = { 'INVALID_LOGIN_CREDENTIALS': 1, 'INVALID_PASSWORD': 1, 'EMAIL_NOT_FOUND': 1,
        'auth/invalid-login-credentials': 1, 'auth/wrong-password': 1, 'auth/user-not-found': 1, 'auth/invalid-credential': 1 };
    function epGirisHatasi() {
        if (typeof document === 'undefined') return;
        for (var i = 0; i < EP_FORM.length; i++) {
            var f = EP_FORM[i], inp = ep$(f.e);
            if (!inp || !epGorunur(inp) || epKayitMi(f)) continue;
            var o = epBekleyen(f, true);
            if (!o) continue;
            _epGiris[epDeger(inp).toLowerCase()] = 1;
            epGoster(f, o, true);
        }
    }

    /* HAZIR UZANTI TUŞLARI (04.11.2026) — yönetici: "girişte hazırda @gmail.com, @hotmail.com gibi en çok
       kullanılan beş tanesi hazır tuş olarak beklesin daha kolay olur". E-posta alanının altında beş tuş;
       basınca @'den sonrası seçilen uzantı olur (yanlış yazılmış uzantı da değişir), sıra şifreye geçer.
       Giriş ve kayıt kipinde, üç formda da. Öneri kutusu çıkarsa alanla tuşların ARASINA girer. */
    var EP_HAZIR = ['gmail.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'yahoo.com'];
    var EP_SIFRE = { 'email': 'password', 'checkout-email': 'checkout-password', 'biyg-email': 'biyg-pass' };
    function epCipKur() {
        if (typeof document === 'undefined' || !document.getElementById) return;
        for (var i = 0; i < EP_FORM.length; i++) {
            var inp = ep$(EP_FORM[i].e);
            if (!inp || !inp.parentNode || inp.__kdepCip) continue;
            epStil();
            var r = document.createElement('div');
            r.className = 'kdep-cip';
            r.setAttribute('role', 'group');
            r.setAttribute('aria-label', 'Sık kullanılan e-posta uzantıları');
            r.setAttribute('data-kdep-icin', inp.id);
            r.innerHTML = EP_HAZIR.map(function (a) {
                return '<button type="button" data-kdep-alan="' + a + '" aria-label="E-postayı @' + a + ' ile tamamla">@' + a + '</button>';
            }).join('') + '<span class="kdep-cip-not" aria-live="polite"></span>';
            var k = epKutu(inp);
            (k || inp).insertAdjacentElement('afterend', r);
            inp.__kdepCip = r;
        }
    }
    function epCipBas(c) {
        var r = c.closest('.kdep-cip'), id = r ? r.getAttribute('data-kdep-icin') : '', inp = id ? ep$(id) : null;
        if (!inp) return;
        var not = r.querySelector('.kdep-cip-not');
        var v = String(inp.value || '').replace(/\s+/g, ''), at = v.lastIndexOf('@'), yerel = at >= 0 ? v.slice(0, at) : v;
        if (!yerel) {
            if (not) not.textContent = 'Önce adresinin @ işaretinden önceki kısmını yaz, sonra uzantıya bas.';
            try { inp.focus(); } catch (x) { }
            return;
        }
        inp.value = yerel + '@' + c.getAttribute('data-kdep-alan');
        if (not) not.textContent = '';
        try { inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); } catch (x) { }
        var f = epForm(id);
        if (f) epKaldir(f);
        var s = ep$(EP_SIFRE[id]);
        try { if (s && !s.value && epGorunur(s)) s.focus(); } catch (x) { }
    }

    if (typeof document !== 'undefined' && document.addEventListener) {
        document.addEventListener('focusout', function (e) {
            var t = e.target, f = t && t.id ? epForm(t.id) : null;
            if (!f || t.id !== f.e) return;
            clearTimeout(_epSaat);
            _epSaat = setTimeout(function () { epDegerlendir(f); }, 180);     /* önce olası «Kayıt Ol» tıklaması işlensin */
        }, true);
        document.addEventListener('input', function (e) {
            var t = e.target, f = t && t.id ? epForm(t.id) : null;
            if (f && t.id === f.e && epKutu(t)) epDegerlendir(f);           /* açık öneri yazdıkça tazelenir ya da kalkar */
        }, true);
        document.addEventListener('click', function (e) {
            var c = e.target && e.target.closest ? e.target.closest('[data-kdep-alan]') : null;
            if (c) { epCipBas(c); return; }                        /* HAZIR UZANTI TUŞLARI (04.11.2026) */
            var t = e.target && e.target.closest ? e.target.closest('.kdep-evet, .kdep-hayir, #auth-action-btn, #checkout-action-btn, #biyg-gonder, #sifre-unut-tus') : null;
            if (!t) return;
            if (t.classList.contains('kdep-evet') || t.classList.contains('kdep-hayir')) {
                var kutu = t.closest('.kdep'), inp = kutu ? kutu.previousElementSibling : null, f = inp && inp.id ? epForm(inp.id) : null;
                if (!f || inp.id !== f.e) return;
                var v = epDeger(inp);
                if (t.classList.contains('kdep-evet')) {
                    var o = K.epostaOneri(v);
                    if (o) {
                        inp.value = o;
                        try { inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); } catch (x) { }
                    }
                } else {
                    _epRed[v.toLowerCase()] = 1;
                }
                setTimeout(function () { epKaldir(f); }, 0);                 /* tıklama yolunu bozmadan kalksın */
                return;
            }
            if (t.id === 'sifre-unut-tus') { epDurdur(e, EP_FORM[0], true); return; }   /* «Şifremi unuttum»: önce öner (04.11.2026) */
            epDurdur(e, epForm(t.id));
        }, true);
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' || e.isComposing) return;
            var t = e.target;
            if (!t || !t.closest) return;
            if (t.closest('.kdep')) { e.stopPropagation(); return; }         /* öneri tuşunda Enter: tuş çalışsın, form gitmesin */
            if (t.tagName === 'TEXTAREA') return;
            var m = ep$('login-modal');
            if (m && (t.closest('#login-modal') || m.style.display === 'flex')) { epDurdur(e, EP_FORM[0]); return; }
            if (t.closest('#biyg-kart')) epDurdur(e, EP_FORM[2]);
        }, true);
        /* HAZIR UZANTI TUŞLARI: pencere ve panel sonradan çizildiği için belge değiştikçe (en çok 60 ms'de bir) denetlenir */
        epCipKur();
        document.addEventListener('DOMContentLoaded', epCipKur);
        window.addEventListener('load', epCipKur);
        document.addEventListener('focusin', function (e) {
            var t = e.target;
            if (t && t.id && EP_SIFRE.hasOwnProperty(t.id)) epCipKur();
        }, true);
        try {
            var _epCipBekle = 0;
            new MutationObserver(function () {
                if (_epCipBekle) return;
                _epCipBekle = setTimeout(function () { _epCipBekle = 0; epCipKur(); }, 60);
            }).observe(document.documentElement, { childList: true, subtree: true });
        } catch (x) { }
    }

    window.KidefKayit = K;
})();
