/* =====================================================================
   KİDEF · BAŞLIKTAKİ OKUL TUŞU — HER ÖĞRETMENDE  (sistem/okultusu.js)
   ---------------------------------------------------------------------
   Öğretmen (05.10.2026): "öğretmen giriş yapınca kurum ve sınıf
   belirlememişse bile okul svg'si olsun."

   SORUN: tuşun görünürlüğünü hesap/auth.js → updateHeaderUI() veriyordu
   ve o işlev giriş akışında SAYILI KEZ çalışıyor. Rol (öğretmen/yönetici)
   Firestore'dan ASENKRON geldiği için, updateHeaderUI son kez çalıştığında
   appState.userRole hâlâ "student" olabiliyor; o zaman tuş gizli kalıyor
   ve bir daha kimse açmıyordu. Yeni kayıt olmuş, henüz kurum/sınıf
   tanımlamamış öğretmende bu daha sık görülüyordu.

   BU DOSYA: tuşu role göre KISA ARALIKLARLA eşitliyor — rol geç gelse de
   gelir gelmez tuş çıkıyor. Rol iki kaynaktan okunuyor:
       appState.userRole          (uygulamanın kendi durumu)
       KidefRol.ogretmenMi(...)   (sitenin ortak rol çözücüsü)
   İkisinden biri "öğretmen/yönetici" diyorsa tuş görünür.

   KURUM/SINIF ŞARTI YOK: tuş veriye değil ROLE bakıyor. Hiç kurum ve
   sınıf tanımlamamış öğretmen de tuşu görür; pencere zaten boşsa
   "+ Kurum Ekle" ile başlamasını sağlıyor (llOkulPopupAc kendi içinde
   boş durumu karşılıyor).

   Yoklama sonsuz değil: ~25 sn boyunca yarım saniyede bir bakılır, rol
   öğretmen çıkınca birkaç tur daha teyit edip durur. Ayrıca sekmeye geri
   dönünce (visibilitychange) bir kez daha bakılır — oturum başka sekmede
   açılmış olabilir.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefOkulTusu) return;

  function tus() { return document.getElementById('header-okul-btn'); }

  function misafirMi() {
    try {
      if (typeof appState === 'undefined') return true;
      if (appState.currentUser === 'Misafir Öğrenci') return true;
      var u = (window.firebase && firebase.auth && firebase.auth().currentUser) || null;
      if (u && u.isAnonymous) return true;
      return !u && !appState.userRole;
    } catch (e) { return false; }
  }

  function ogretmenMi() {
    try {
      var r = (typeof appState !== 'undefined' && appState.userRole) || '';
      if (r === 'teacher' || r === 'admin') return true;
      if (window.KidefRol && typeof window.KidefRol.ogretmenMi === 'function') {
        if (window.KidefRol.ogretmenMi(r)) return true;
        /* Önbellekteki rol (sayfa yenilenince anında doğru sonuç verir) */
        if (typeof window.KidefRol.onbellekOku === 'function') {
          var o = window.KidefRol.onbellekOku();
          if (o && window.KidefRol.ogretmenMi(o)) return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function esitle() {
    var b = tus();
    if (!b) return false;
    var goster = !misafirMi() && ogretmenMi();
    if (b.classList.contains('gor') !== goster) b.classList.toggle('gor', goster);
    return goster;
  }

  var tur = 0, teyit = 0;
  var zaman = setInterval(function () {
    tur++;
    var goruldu = esitle();
    if (goruldu) teyit++;
    /* Rol geldiyse birkaç tur teyit edip bırak; gelmediyse ~25 sn sonra dur. */
    if (teyit >= 4 || tur > 50) clearInterval(zaman);
  }, 500);

  /* Sekmeye dönünce bir kez daha: oturum başka sekmede açılmış olabilir. */
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) esitle();
  });
  window.addEventListener('focus', esitle);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', esitle);
  else esitle();

  window.KidefOkulTusu = { esitle: esitle, ogretmenMi: ogretmenMi };
})();
