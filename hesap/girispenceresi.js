/* ===========================================================================
   KİDEF · GİRİŞ PENCERESİ — TEK KAYNAK      (hesap/girispenceresi.js)
   ---------------------------------------------------------------------------
   Öğretmen: "bilgi yarışmasındaki giriş ve kayıt ekranı ile indextekini
   aynı yapalım, indextekinin aynısını istiyorum… tek giriş sayfası olsun,
   farklı yerlerde de olsa."

   Pencerenin HTML'i ARTIK SADECE BURADA. index.html'den çıkarıldı ve bu
   dosyaya kondu; hangi sayfa bu dosyayı yüklerse aynı pencereyi alır.
   Böylece iki ekran bir daha ayrışamaz.

   ⚠️ BU DOSYA ÜRETİLİYOR: _kaynak/uretici/girisPenceresiUret.py index.html'den
   çıkardı. Pencereyi değiştirmek gerekirse BU dosyadaki HTML düzenlenir
   (artık kaynak burası); index.html'de pencerenin markup'ı yok.

   NASIL ÇALIŞIR
     · Dosya yüklenince pencereyi document.body'ye ekler. Sayfada zaten
       bir #login-modal varsa DOKUNMAZ (çift basmayı önler).
     · Pencerenin düğmeleri şu işlevleri çağırır:
         authIslemi · setRole · moduDegistir · togglePassword
         closeLoginModal · qrGirisTusu
       index'te bunları hesap/auth.js ve hesap/qrgiris.js sağlıyor.
       Başka bir sayfada eksik olan olursa bileşen kendi yedeğini kurar
       (aşağıdaki YEDEK bölümü) — alan doğrulaması ve belge biçimi yine
       hesap/kayitalani.js'ten gelir, iki ekran aynı belgeyi yazar.

     KidefGirisPenceresi.ac()    pencereyi aç
     KidefGirisPenceresi.kapat() kapat
   =========================================================================== */
(function () {
  'use strict';
  if (window.KidefGirisPenceresi) return;

  var HTML = "<div id=\"login-modal\" class=\"modal-overlay\">\n        <div class=\"modal-content glass-card\" style=\"box-shadow: 0 10px 40px rgba(0,0,0,0.5);\">\n            <div class=\"modal-close\" onclick=\"closeLoginModal()\">✖</div>\n            <h2 id=\"auth-title\" style=\"color:#16A085; margin-top:0;\">Sisteme Giriş Yap</h2>\n\n            <!-- ROL KARTLARI (25.09.2026): \"öğrenciysen / öğretmensen panelde ne\n                 var?\" — karta basınca çizimli tanıtım penceresi açılır.\n                 İçeriği sistem/panel-tanitim.js doldurur. -->\n            <div id=\"kdtGirisKartlar\"></div>\n\n            <!-- KAREKOD ALANI — giriş penceresi ilk açıldığında BURASI görünür;\n                 e-posta/şifre formu gizlidir. İçeriği hesap/qrgiris.js doldurur.\n                 \"E-posta ve şifreyle gir\" tuşu ikisi arasında geçiş yaptırır. -->\n            <div id=\"qr-modal-alan\" style=\"display:none;\"></div>\n\n            <!-- Klasik giriş/kayıt formu. Karekod kipinde tamamen gizlenir. -->\n            <div id=\"giris-form-alani\">\n            <div style=\"display: flex; gap: 10px; margin-bottom: 20px;\">\n                <button onclick=\"setRole('student')\" id=\"btn-student\" class=\"role-btn active-role\">Öğrenci</button>\n                <button onclick=\"setRole('teacher')\" id=\"btn-teacher\" class=\"role-btn\">Öğretmen</button>\n            </div>\n\n            <div style=\"display: none; gap: 15px; width: 100%; flex-wrap: wrap;\" id=\"student-extra-group\">\n                <div class=\"form-group\" style=\"flex: 1; min-width: 200px;\">\n                    <label>Ad Soyad</label>\n                    <input type=\"text\" id=\"student-name\" placeholder=\"Örn: Ali Yılmaz\">\n                </div>\n                <div class=\"form-group\" style=\"flex: 1; min-width: 200px;\">\n                    <label>Meslek <span style=\"color:#EF5350;\">*</span></label>\n                    <input type=\"text\" id=\"student-profession\" placeholder=\"Örn: Öğretmen, Mühendis...\" required>\n                </div>\n                <div class=\"form-group\" style=\"flex: 1; min-width: 200px;\">\n                    <label>Cinsiyet <span style=\"color:#EF5350;\">*</span></label>\n                    <select id=\"student-gender\" required style=\"width:100%; padding:12px; border:1px solid #E9EEF5; border-radius:12px; font-family:inherit; box-sizing:border-box; background:#fff;\">\n                        <option value=\"\">Seçiniz…</option>\n                        <option value=\"erkek\">Erkek</option>\n                        <option value=\"kadin\">Kadın</option>\n                    </select>\n                </div>\n                <div class=\"form-group\" id=\"ogr-kod-grup\" style=\"flex: 1 1 100%; min-width: 200px;\">\n                    <label>Öğretmen Kodu <span style=\"color:#A6836E; font-weight:400;\">(varsa — örn. TCH-4582)</span></label>\n                    <input type=\"text\" id=\"student-teacher-code\" placeholder=\"Öğretmenin verdiyse buraya yaz\" autocomplete=\"off\" style=\"text-transform:uppercase; letter-spacing:1px;\">\n                    <small style=\"display:block; margin-top:4px; color:#A6836E;\">Kodu girersen kayıttan hemen sonra öğretmenine bağlanma isteğin otomatik gönderilir. Boş bırakabilirsin.</small>\n                </div>\n            </div>\n            \n            <div style=\"display: flex; gap: 15px; width: 100%; flex-wrap: wrap;\">\n                <div class=\"form-group\" style=\"flex: 1; min-width: 200px;\">\n                    <label>E-posta Adresi</label>\n                    <input type=\"email\" id=\"email\" placeholder=\"ornek@mail.com\" required>\n                </div>\n                <div class=\"form-group\" id=\"phone-group\" style=\"display: none; flex: 1; min-width: 200px;\">\n                    <label>Telefon Numarası <span style=\"color:#EF5350;\">*</span></label>\n                    <div style=\"display: flex;\">\n                        <span style=\"padding: 12px; background: #E9EEF5; border: 1px solid #E9EEF5; border-radius: 12px 0 0 12px; color: #555; font-weight: bold;\">+90</span>\n                        <input type=\"tel\" id=\"phone\" placeholder=\"5XX XXX XX XX\" pattern=\"^5[0-9]{9}$\" maxlength=\"10\" style=\"border-radius: 0 12px 12px 0; border-left: none;\">\n                    </div>\n                </div>\n            </div>\n\n            <div style=\"display: flex; gap: 15px; width: 100%; flex-wrap: wrap;\">\n                <div class=\"form-group\" style=\"position:relative; flex: 1; min-width: 200px;\">\n                    <label>Şifre <button type=\"button\" class=\"gz-tus\" aria-pressed=\"false\" title=\"Şifreyi göster\" aria-label=\"Şifreyi göster\" onclick=\"togglePassword('password')\"><svg class=\"gz\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><g class=\"gz-kapali\"><path d=\"M3.2 10.4c2.4 3.1 5.4 4.7 8.8 4.7s6.4-1.6 8.8-4.7\"/><path d=\"M4.4 14.1 3 16.3M8.1 15.9 7.4 18.4M12 16.5v2.6M15.9 15.9l.7 2.5M19.6 14.1 21 16.3\"/></g><g class=\"gz-acik\"><path d=\"M2.7 12.3s3.7-5.9 9.3-5.9 9.3 5.9 9.3 5.9-3.7 5.9-9.3 5.9S2.7 12.3 2.7 12.3z\"/><circle cx=\"12\" cy=\"12.3\" r=\"3\"/><circle class=\"gz-bebek\" cx=\"12\" cy=\"12.3\" r=\"1.25\"/><path d=\"M4.2 7.3 2.9 5.4M8 5.8 7.4 3.5M12 5.2V2.7M16 5.8l.6-2.3M19.8 7.3l1.3-1.9\"/></g></svg></button></label>\n                    <input type=\"password\" id=\"password\" placeholder=\"••••••••\" required>\n                </div>\n                <div class=\"form-group\" id=\"re-password-group\" style=\"display: none; position:relative; flex: 1; min-width: 200px;\">\n                    <label>Şifreyi Onayla <button type=\"button\" class=\"gz-tus\" aria-pressed=\"false\" title=\"Şifreyi göster\" aria-label=\"Şifreyi göster\" onclick=\"togglePassword('re-password')\"><svg class=\"gz\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><g class=\"gz-kapali\"><path d=\"M3.2 10.4c2.4 3.1 5.4 4.7 8.8 4.7s6.4-1.6 8.8-4.7\"/><path d=\"M4.4 14.1 3 16.3M8.1 15.9 7.4 18.4M12 16.5v2.6M15.9 15.9l.7 2.5M19.6 14.1 21 16.3\"/></g><g class=\"gz-acik\"><path d=\"M2.7 12.3s3.7-5.9 9.3-5.9 9.3 5.9 9.3 5.9-3.7 5.9-9.3 5.9S2.7 12.3 2.7 12.3z\"/><circle cx=\"12\" cy=\"12.3\" r=\"3\"/><circle class=\"gz-bebek\" cx=\"12\" cy=\"12.3\" r=\"1.25\"/><path d=\"M4.2 7.3 2.9 5.4M8 5.8 7.4 3.5M12 5.2V2.7M16 5.8l.6-2.3M19.8 7.3l1.3-1.9\"/></g></svg></button></label>\n                    <input type=\"password\" id=\"re-password\" placeholder=\"••••••••\">\n                </div>\n            </div>\n\n            <div class=\"form-group\" id=\"teacher-cv-group\" style=\"display: none;\">\n                <label>Özgeçmiş (CV) / Neden Siz?</label>\n                <textarea id=\"teacher-cv\" placeholder=\"Üniversite, bölüm, mezuniyet, tecrübe ve başarılarınızdan bahsedin...\" rows=\"4\" style=\"width: 100%; padding: 12px; border: 1px solid #E9EEF5; border-radius: 12px; font-family: inherit; font-size: 14px; resize: vertical; box-sizing: border-box;\"></textarea>\n            </div>\n            \n            <div class=\"form-group\" id=\"teacher-file-group\" style=\"display: none;\">\n                <label>Diploma veya E-devlet Belgesi (PDF/JPG)</label>\n                <input type=\"file\" id=\"teacher-file\" accept=\".pdf,.jpg,.jpeg,.png\" style=\"width: 100%; padding: 10px; border: 1px dashed #16A085; border-radius: 12px; background: #f0f8ff; box-sizing: border-box;\">\n                <small style=\"color: #666; display: block; margin-top: 5px;\">* Lütfen yeterliliğinizi doğrulayan bir belge yükleyin.</small>\n            </div>\n            \n            <button id=\"auth-action-btn\" class=\"btn btn-primary\" style=\"width:100%; margin-top:10px;\" onclick=\"authIslemi()\">Giriş Yap</button>\n\n            <!-- KAREKODLA GİRİŞ — akıllı tahtada şifre yazmamak için.\n                 Öğretmen kendi telefonundan okutup onaylar; bu ekran onun\n                 hesabıyla açılır. Sunucu tarafı: functions/index.js -->\n            <div id=\"qr-giris-satir\">\n                <button type=\"button\" class=\"qr-giris-tus\" onclick=\"qrGirisTusu()\" title=\"Telefonundan onaylayarak şifresiz gir\">\n                    <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\" width=\"22\" height=\"22\"><rect x=\"2.6\" y=\"2.6\" width=\"7.4\" height=\"7.4\" rx=\"1.6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\"/><rect x=\"14\" y=\"2.6\" width=\"7.4\" height=\"7.4\" rx=\"1.6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\"/><rect x=\"2.6\" y=\"14\" width=\"7.4\" height=\"7.4\" rx=\"1.6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\"/><rect x=\"5.2\" y=\"5.2\" width=\"2.2\" height=\"2.2\" fill=\"currentColor\"/><rect x=\"16.6\" y=\"5.2\" width=\"2.2\" height=\"2.2\" fill=\"currentColor\"/><rect x=\"5.2\" y=\"16.6\" width=\"2.2\" height=\"2.2\" fill=\"currentColor\"/><path d=\"M14 14h3v3h-3zM18.4 14h3v3h-3zM14 18.4h3v3h-3zM18.4 18.4h3v3h-3z\" fill=\"currentColor\" opacity=\".75\"/></svg>\n                    <span>Karekodla Giriş<small>Telefonundan onayla — şifre yazma</small></span>\n                </button>\n            </div>\n            <p id=\"hata-mesaji\" style=\"color:#ff6b6b; font-size:13px; min-height:15px; margin: 10px 0;\"></p>\n            \n            <div style=\"text-align:center; font-size:14px;\" id=\"auth-switch-container\">\n                <span id=\"auth-switch-text\">Hesabınız yok mu?</span> \n                <span class=\"auth-toggle-text\" id=\"auth-switch-link\" onclick=\"moduDegistir()\">Kayıt Ol</span>\n            </div>\n            </div><!-- /giris-form-alani -->\n        </div>\n    </div>";


  function kur() {
    if (document.getElementById('login-modal')) return document.getElementById('login-modal');
    var k = document.createElement('div');
    k.innerHTML = HTML;
    var p = k.firstElementChild;
    document.body.appendChild(p);
    return p;
  }

  /* Sayfa gövdesi hazırsa hemen bas; değilse hazır olunca. */
  if (document.body) kur();
  else document.addEventListener('DOMContentLoaded', kur);

  function ac() {
    var p = kur();
    p.style.display = 'flex';
    try { if (typeof prefillEmail === 'function') prefillEmail(); } catch (e) {}
    return p;
  }
  function kapat() {
    var p = document.getElementById('login-modal');
    if (p) p.style.display = 'none';
  }

  window.KidefGirisPenceresi = { ac: ac, kapat: kapat, kur: kur, html: HTML };
})();
