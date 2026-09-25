/* =====================================================================
   KIDEF · ETKİNLİK SEKMESİ           (sistem/etkinlik-kapat.js)
   ---------------------------------------------------------------------
   NEDEN
   Kitap etkinlikleri 25.09.2026'dan beri siteden YENİ SEKMEDE açılıyor
   (sistem/kitapetkinlik.js). Paketlerin kendi «geri» tuşu o sekmede işe
   yaramıyordu:
     · history.back()        → sekmede gidilecek sayfa yok, düğme ölü,
     · <a href="index.html"> → paketin kendi menüsüne gidiyor, oysa
       öğretmen siteye dönmek istiyor.
   NE YAPAR
   Sayfa SEKMENİN İLK SAYFASIYSA geri tuşunu "sekmeyi kapat"a çevirir.
   Öğretmen alttaki site sekmesine döner, listede kaldığı yerdedir.
     · Paket içinde gezinildiyse (menü → etkinlik) geri NORMAL çalışır.
     · Oyunun kendi içinde ekran değiştiren düğmelere (başa dön, menüye
       dön, yeniden başlat) DOKUNULMAZ.
   Tarayıcı window.close()'a yalnız sekmenin tek sayfası varken izin
   verir; koşulumuz zaten bu. Kapanmazsa (elle açılmış sekme) geldiği
   sayfaya, o da yoksa siteye döner.

   PAKETLERİN KENDİ KODU DEĞİŞMEDİ: her etkinlik dosyasının sonuna
   yalnız bu betiğin <script> satırı eklendi. 📖Komisyon'daki asıllar da
   olduğu gibi duruyor.
   ===================================================================== */
(function () {
  'use strict';
  if (window.__kidefEtkKapat) return;
  window.__kidefEtkKapat = 1;

  /* sitenin kökü: betiğin kendi adresinden bulunur (sistem/… → bir üst) */
  var KOK = '/';
  try {
    var b = document.currentScript;
    if (b && b.src) KOK = new URL('../', b.src).href;
  } catch (e) { }

  /* --- DURUM -------------------------------------------------------
     BAS: betik yüklenirken geçmiş uzunluğu. 1 ise bu sekme doğrudan bu
     dosyayla açılmış demektir (siteden yeni sekme) → kapatılabilir.
     Paket içinde gezinildiyse (menü → etkinlik) BAS 2+ olur, karışmayız.
     Bazı paketler kendi ekranları için history.pushState kullanıyor ve
     state.depth tutuyor; derinlikteyken geri tuşu KENDİ ekranına dönmeli,
     yalnız kök ekranda sekme kapanmalı. */
  var BAS = (function () { try { return history.length; } catch (e) { return 9; } })();
  function tazeSekme() { return BAS <= 1; }
  function kokEkran() {
    try {
      var st = history.state;
      return !(st && typeof st.depth === 'number' && st.depth > 0);
    } catch (e) { return true; }
  }
  function kapatilir() { return tazeSekme() && kokEkran(); }

  function kapat() {
    try { window.close(); } catch (e) { }
    /* Kapanmadıysa: geldiği sayfa (aynı site) ya da site kökü */
    setTimeout(function () {
      if (window.closed) return;
      var hedef = KOK + 'index.html';
      try {
        var r = document.referrer;
        if (r && new URL(r).origin === location.origin && r !== location.href) hedef = r;
      } catch (e) { }
      location.href = hedef;
    }, 220);
  }

  /* ---- 1) history.back() / history.go(-1) → sekmeyi kapat ---------- */
  try {
    var asilBack = history.back.bind(history);
    var asilGo = history.go.bind(history);
    history.back = function () { if (kapatilir()) kapat(); else asilBack(); };
    history.go = function (n) { if (n === -1 && kapatilir()) kapat(); else asilGo(n); };
  } catch (e) { }

  /* ---- 2) geri düğmeleri → sekmeyi kapat ---------------------------
     Oyunun KENDİ içinde ekran değiştiren düğmeler elenir: sınıfı
     .back-menu olanlar ve onclick'i showScreen / goBackToStart /
     location.reload gibi bir şey çağıranlar. */
  var GERI = '.back-btn,.back-button,.back-icon-btn,.nav-back-btn,.back-home,[data-geri]';
  var ICERDE = /showScreen|goBackToStart|backToStart|restart|reload|nextRound|showMenu\s*\(/i;

  document.addEventListener('click', function (e) {
    if (!kapatilir()) return;
    var t = e.target && e.target.closest ? e.target.closest(GERI) : null;
    if (!t) return;
    if (t.classList && t.classList.contains('back-menu')) return;
    var o = (t.getAttribute && t.getAttribute('onclick')) || '';
    if (ICERDE.test(o)) return;
    e.preventDefault();
    e.stopPropagation();
    kapat();
  }, true);
})();
