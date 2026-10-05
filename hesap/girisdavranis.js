/* ===========================================================================
   KİDEF · GİRİŞ PENCERESİ DAVRANIŞI        (hesap/girisdavranis.js)
   ---------------------------------------------------------------------------
   Öğretmen: "bilgi yarışmasındaki giriş ve kayıt ekranı ile indextekini aynı
   yapalım, indextekinin aynısını istiyorum… tek giriş sayfası olsun, farklı
   yerlerde de olsa."

   Pencerenin HTML'i hesap/girispenceresi.js'te (tek kaynak, index'ten
   çıkarıldı). Pencerenin DÜĞMELERİ index'te hesap/auth.js'teki işlevlere
   bağlı — ama auth.js index'in uygulama katmanı (appState, başlık çubuğu,
   paketler…), başka sayfaya olduğu gibi taşınamaz.

   Bu dosya o boşluğu doldurur: pencerenin işlevlerini YALNIZ EKSİKSE kurar.
   index'te auth.js zaten kurduğu için buradaki hiçbir şey devreye girmez;
   bilgi yarışması gibi sayfalarda ise pencere bu dosyayla çalışır.

   Alan doğrulaması ve kullanıcı belgesi yine hesap/kayitalani.js'ten gelir —
   iki ekran da AYNI belgeyi yazar, öğretmen kaydı aynı onay kapısına düşer.

   Sayfa isterse sonucu dinleyebilir:
       window.KidefGirisDavranis.bittiginde = function (bilgi) { … }
   =========================================================================== */
(function () {
  'use strict';
  if (window.KidefGirisDavranis) return;

  var D = { rol: 'student', girisKipi: true, bittiginde: null };

  function el(id) { return document.getElementById(id); }
  function g(id, v) { var e = el(id); if (e) e.style.display = v; }
  function yaz(id, m) { var e = el(id); if (e) e.innerText = m; }
  function hata(m) { var e = el('hata-mesaji'); if (e) { e.innerText = m || ''; e.style.display = m ? 'block' : 'none'; } }

  /* ----------------------------------------------------- pencere açma/kapama */
  function ac() {
    if (window.KidefGirisPenceresi) window.KidefGirisPenceresi.ac();
    else { var p = el('login-modal'); if (p) p.style.display = 'flex'; }
    hata('');
    arayuzTazele();
  }
  function kapat() {
    if (window.KidefGirisPenceresi) window.KidefGirisPenceresi.kapat();
    else { var p = el('login-modal'); if (p) p.style.display = 'none'; }
  }

  /* --------------------------------------------------------------- arayüz
     auth.js'teki updateAuthUI ile AYNI davranış; tek farkı appState'e
     bakmaması (o index'e özel). */
  function arayuzTazele() {
    hata('');
    var mc = document.querySelector('#login-modal .modal-content');
    if (D.girisKipi) {
      yaz('auth-title', 'Sisteme Giriş Yap');
      yaz('auth-action-btn', 'Giriş Yap');
      yaz('auth-switch-text', 'Hesabınız yok mu?');
      yaz('auth-switch-link', 'Kayıt Ol');
      g('re-password-group', 'none'); g('phone-group', 'none');
      g('student-extra-group', 'none');
      g('teacher-cv-group', 'none'); g('teacher-file-group', 'none');
    } else {
      yaz('auth-title', 'Sisteme Kayıt Ol');
      yaz('auth-action-btn', 'Kayıt Ol');
      yaz('auth-switch-text', 'Zaten hesabınız var mı?');
      yaz('auth-switch-link', 'Giriş Yap');
      /* 'flex' YAPILMAZ: form-group flex satırına dönünce "Şifreyi Onayla"
         etiketi kutunun yanına geçiyor (index'teki nottan). */
      g('re-password-group', 'block'); g('phone-group', 'block');
      g('student-extra-group', 'flex');
      g('teacher-cv-group', 'none'); g('teacher-file-group', 'none');
      g('ogr-kod-grup', D.rol === 'teacher' ? 'none' : 'block');

      /* Öğretmen kaydında meslek sabit "Eğitmen" — index'teki gibi. */
      var mes = el('student-profession');
      if (mes) {
        if (D.rol === 'teacher') {
          mes.value = 'Eğitmen'; mes.readOnly = true;
          mes.style.background = '#F0F4F8'; mes.style.color = '#16A085';
          mes.style.fontWeight = 'bold';
        } else {
          if (mes.value === 'Eğitmen') mes.value = '';
          mes.readOnly = false;
          mes.style.background = ''; mes.style.color = ''; mes.style.fontWeight = '';
        }
      }
    }
    if (mc) { mc.style.maxWidth = '450px'; mc.style.width = '90%'; }
  }

  function rolSec(rol) {
    D.rol = rol;
    var t = document.querySelectorAll('#login-modal .role-btn');
    for (var i = 0; i < t.length; i++) t[i].classList.remove('active-role');
    var b = el('btn-' + rol);
    if (b) b.classList.add('active-role');
    g('auth-switch-container', rol === 'admin' ? 'none' : 'block');
    arayuzTazele();
  }

  function kipDegistir() { D.girisKipi = !D.girisKipi; arayuzTazele(); }

  function gozCevir(alanId) {
    var i = el(alanId);
    if (!i) return;
    i.type = (i.type === 'password') ? 'text' : 'password';
    var gorunur = i.type === 'text';
    var tus = i.parentNode && i.parentNode.querySelector('.gz-tus');
    if (tus) {
      tus.setAttribute('aria-pressed', gorunur ? 'true' : 'false');
      tus.setAttribute('title', gorunur ? 'Şifreyi gizle' : 'Şifreyi göster');
      tus.setAttribute('aria-label', gorunur ? 'Şifreyi gizle' : 'Şifreyi göster');
    }
  }

  /* ------------------------------------------------------------- gönderim */
  function mesgul(d) {
    var b = el('auth-action-btn');
    if (!b) return;
    b.disabled = !!d;
    b.style.opacity = d ? '.6' : '';
    b.style.pointerEvents = d ? 'none' : '';
  }

  function gonder() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
      hata('Bağlantı kurulamadı. Sayfayı yenileyip tekrar dene.'); return;
    }
    var email = (el('email') ? el('email').value : '').trim();
    var pass = el('password') ? el('password').value : '';

    /* ---- GİRİŞ ---- */
    if (D.girisKipi) {
      if (!email || !pass) { hata('Lütfen tüm alanları doldurun.'); return; }
      mesgul(true);
      firebase.auth().signInWithEmailAndPassword(email, pass)
        .then(function (c) {
          mesgul(false); kapat();
          if (typeof D.bittiginde === 'function') D.bittiginde({ kip: 'giris', user: c.user });
        })
        .catch(function (e) { mesgul(false); hata('Giriş başarısız: ' + ((e && e.message) || e)); });
      return;
    }

    /* ---- KAYIT ---- alanlar ve belge biçimi hesap/kayitalani.js'ten ---- */
    if (!window.KidefKayit) { hata('Kayıt bileşeni yüklenemedi.'); return; }
    var s = window.KidefKayit.dogrula({
      email: email, pass: pass,
      pass2: el('re-password') ? el('re-password').value : '',
      ad: el('student-name') ? el('student-name').value : '',
      meslek: el('student-profession') ? el('student-profession').value : '',
      tel: el('phone') ? el('phone').value : '',
      cinsiyet: el('student-gender') ? el('student-gender').value : ''
    });
    if (!s.tamam) { hata(s.hata); return; }

    var rol = (D.rol === 'teacher') ? 'teacher' : 'student';
    mesgul(true);
    firebase.auth().createUserWithEmailAndPassword(s.veri.email, s.veri.pass)
      .then(function (cred) {
        return firebase.firestore().collection('kullanicilar')
          .doc(cred.user.uid).set(window.KidefKayit.belge(s.veri, rol))
          .then(function () { return cred; });
      })
      .then(function (cred) {
        mesgul(false); kapat();
        try { alert(window.KidefKayit.bitisMesaji(rol)); } catch (e) {}
        if (typeof D.bittiginde === 'function') D.bittiginde({ kip: 'kayit', rol: rol, user: cred.user });
      })
      .catch(function (e) { mesgul(false); hata('Kayıt başarısız: ' + ((e && e.message) || e)); });
  }

  /* --------------------------------------------- yalnız EKSİKSE devreye gir
     index'te auth.js bunların hepsini zaten tanımlıyor; orada bu dosya
     hiçbir şeyi değiştirmez. */
  function yedek(ad, islev) {
    if (typeof window[ad] !== 'function') window[ad] = islev;
  }
  yedek('setRole', rolSec);
  yedek('moduDegistir', kipDegistir);
  yedek('togglePassword', gozCevir);
  yedek('closeLoginModal', kapat);
  yedek('showLoginModal', ac);
  yedek('authIslemi', gonder);
  yedek('prefillEmail', function () {
    try {
      var k = localStorage.getItem('savedEmail');
      if (k && el('email') && !el('email').value) el('email').value = k;
    } catch (e) {}
  });
  /* Karekod satırı yalnız qrgiris.js varsa anlamlı; yoksa gizlensin. */
  function qrDenetle() {
    if (typeof window.qrGirisTusu !== 'function') {
      g('qr-giris-satir', 'none'); g('qr-modal-alan', 'none');
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', qrDenetle);
  else qrDenetle();

  window.KidefGirisDavranis = {
    ac: ac, kapat: kapat, rolSec: rolSec, kipDegistir: kipDegistir,
    arayuzTazele: arayuzTazele, durum: D
  };
})();
