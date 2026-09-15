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

    /* Formun doğrulaması. Dönen değer:
         { tamam:true, veri:{…} }            — her şey yolunda
         { tamam:false, hata:'…' }           — ilk hatalı alanın mesajı
       Mesajlar index'teki metinlerle birebir aynı; öğretmen iki ekranda
       farklı uyarı görmesin. */
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
            name: v.ad || 'Belirtilmedi',
            meslek: v.meslek || '',
            cinsiyet: v.cinsiyet || '',
            phone: v.tel ? ('+90' + v.tel) : '',
            packages: []
        };
        try {
            d.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        } catch (e) { /* firebase yoksa alan yazılmaz */ }
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
