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
    K.dogrula = function (a) {
        a = a || {};
        var email = String(a.email || '').trim();
        var pass = String(a.pass || '');
        var pass2 = String(a.pass2 || '');
        var ad = String(a.ad || '').trim();
        var meslek = String(a.meslek || '').trim();
        var tel = String(a.tel || '').trim();
        var cinsiyet = String(a.cinsiyet || '').trim();

        if (!email || !pass) return { tamam: false, hata: 'Lütfen tüm alanları doldurun.' };
        if (pass !== pass2) return { tamam: false, hata: 'Şifreler uyuşmuyor.' };
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

    window.KidefKayit = K;
})();
