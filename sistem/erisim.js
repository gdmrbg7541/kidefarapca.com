/* ==========================================================================
   KIDEF · ERİŞİM KATMANI  —  erisim.js  (v1)
   --------------------------------------------------------------------------
   İki ayrı kapıyı yönetir. İkisi de sistem/kilit.js'in yanında çalışır ve
   onun kararını EZMEZ; kilit perdesi inmişse zaten bu katman görünmez.

   1) ÖĞRENCİ KATEGORİ KISITI
      Site kilidi "🎓 Sadece Girişliler" (kilit: 'girisli') kademesindeyken
      ÖĞRENCİ hesapları ana sayfada yalnız üç kategoriyi görür:
          Oyunlar · Değerler Eğitimi · Sosyal Hesaplar
      Öğretmen ve yönetici hesapları bütün kategorileri görmeye devam eder;
      kilit "açık" kademesindeyken kimse kısıtlanmaz. Kısıt <body> üzerine
      "erisim-ogrenci-kisit" sınıfı basılarak uygulanır — bölümler sonradan
      yeniden çizilse bile CSS kuralı yerinde kalır.

   2) ÖĞRETMEN ONAY KAPISI
      Öğretmen olarak kayıt olan hesabın belgesine kayıt anında
          kullanicilar/{uid} -> { ogretmenOnay: 'bekliyor' }
      yazılır. Bu alan 'bekliyor' olduğu sürece hesap siteyi kullanamaz:
      turuncu bir perde iner ve "yönetici onayladıktan sonra girebilirsin"
      bilgisi verilir. Yönetici panelden onaylayınca alan 'onayli' olur ve
      perde ANINDA kalkar (kendi belgesi onSnapshot ile dinlenir).

      GERİYE DÖNÜK EMNİYET: alanı HİÇ olmayan ESKİ öğretmen hesapları
      onaylı sayılır; böylece bu değişiklik mevcut öğretmenleri dışarıda
      bırakmaz. Alan varsa yalnız 'onayli' geçer — 'bekliyor' ve
      'reddedildi' durdurulur (reddedilene ayrı bir metin gösterilir).

   DÜRÜSTLÜK NOTU: Site statik barındırıldığı için bu da kilit.js gibi bir
   KAPI PERDESİDİR; normal ziyaretçiyi durdurur. Asıl koruma Firestore
   kurallarındadır — "ogretmenOnay" alanını yalnız yöneticinin
   yazabilmesi için kuralların da güncellenmesi gerekir.
   ========================================================================== */
(function () {
    'use strict';

    if (window.KidefErisim) return;
    var E = window.KidefErisim = {};

    /* Öğrencinin kilitli sitede görebileceği bölümler (index.html id'leri) */
    var OGRENCI_BOLUM = ['oyunlar', 'degerler-egitimi', 'youtube-kanallari'];
    E.OGRENCI_BOLUM = OGRENCI_BOLUM;

    var GOVDE_SINIF = 'erisim-ogrenci-kisit';
    var PERDE_ID = 'ogretmenOnayPerde';

    /* ------------------------------------------------------- SAF KARARLAR
       (tarayıcısız da sınanabilsin diye ayrı tutuldu) */

    /* Öğrenci kategori kısıtı uygulanacak mı? */
    E.kisitKarar = function (kilit, rol) {
        if (kilit !== 'girisli') return false;      /* açık site: kısıt yok   */
        if (rol === 'admin' || rol === 'teacher') return false;
        return rol === 'student';                   /* rol çözülemediyse dokunma */
    };

    /* Hesap siteyi kullanabilir mi? (öğretmen onay kapısı)
       Alan HİÇ yoksa hesap eskidir → geçer (bu değişiklik mevcut
       öğretmenleri dışarıda bırakmasın). Alan varsa yalnız 'onayli' geçer;
       'bekliyor' ve 'reddedildi' durdurulur. */
    E.onayKarar = function (rol, onay) {
        if (rol !== 'teacher') return true;         /* öğrenci/yönetici muaf */
        if (onay === undefined || onay === null || onay === '') return true;
        return onay === 'onayli';
    };

    /* ------------------------------------------------------- DURUM OKUMA */
    function kilitOku() {
        try {
            if (window.SiteKilit && window.SiteKilit.durum) return window.SiteKilit.durum;
            return localStorage.getItem('siteKilitSon') || 'acik';
        } catch (e) { return 'acik'; }
    }
    function rolOku() {
        try {
            var r = (typeof appState !== 'undefined' && appState && appState.userRole) || '';
            if (r) return r;
        } catch (e) { }
        return (window.SiteKilit && window.SiteKilit._bulutRol) || E._rol || '';
    }
    function kullanici() {
        try {
            var u = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
            return (u && u.email && !u.isAnonymous) ? u : null;
        } catch (e) { return null; }
    }

    /* ------------------------------------------------- 1) KATEGORİ KISITI */
    function kisitUygula() {
        var g = document.body;
        if (!g) return;
        var kisit = E.kisitKarar(kilitOku(), rolOku());
        g.classList.toggle(GOVDE_SINIF, !!kisit);
    }
    E.kisitUygula = kisitUygula;

    /* --------------------------------------------------- 2) ONAY PERDESİ */
    function perdeHtml(durum) {
        var red = (durum === 'reddedildi');
        var ikon = red
            ? '<circle cx="12" cy="12" r="9"></circle><line x1="12" y1="7.4" x2="12" y2="13"></line>' +
              '<line x1="12" y1="16.4" x2="12.01" y2="16.4"></line>'
            : '<circle cx="12" cy="12" r="9"></circle><polyline points="12 7.2 12 12 15 13.8"></polyline>';
        var baslik = red ? 'Başvurun onaylanmadı' : 'Kaydın alındı';
        var metin = red
            ? 'Öğretmen başvurun şu an onaylı değil, bu yüzden site kapalı. ' +
              'Bir yanlışlık olduğunu düşünüyorsan iletişim sayfasından yazabilirsin.'
            : 'Öğretmen hesapları <b>yönetici onayından</b> sonra açılıyor. ' +
              'Başvurun sıraya alındı; <b>yönetici onayladıktan sonra siteyi ' +
              'kullanabileceksin</b>. Onaylandığında bu ekran kendiliğinden kalkar — ' +
              'sayfayı açık bırakabilirsin.';
        return '' +
        '<div class="eop-kutu">' +
          '<div class="eop-ikon">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
                 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ikon + '</svg>' +
          '</div>' +
          '<h2>' + baslik + '</h2>' +
          '<p>' + metin + '</p>' +
          '<div class="eop-tus">' +
            '<button type="button" onclick="KidefErisim.tazele()">Durumu yenile</button>' +
            '<button type="button" class="eop-cik" onclick="KidefErisim.cikis()">Çıkış yap</button>' +
          '</div>' +
          '<p class="eop-dip">Sorun olursa iletişim sayfasından yazabilirsin.</p>' +
        '</div>';
    }

    function perdeGoster(durum) {
        var p = document.getElementById(PERDE_ID);
        if (!p) {
            p = document.createElement('div');
            p.id = PERDE_ID;
            (document.body || document.documentElement).appendChild(p);
        }
        if (p.dataset.durum !== String(durum)) {
            p.innerHTML = perdeHtml(durum);
            p.dataset.durum = String(durum);
        }
        p.style.display = 'flex';
        /* Arkadaki giriş penceresi açık kalmasın: perde tek başına dursun */
        try {
            var lm = document.getElementById('login-modal');
            if (lm) lm.classList.remove('active');
        } catch (e) { }
    }
    function perdeKaldir() {
        var p = document.getElementById(PERDE_ID);
        if (p) p.style.display = 'none';
    }

    E.cikis = function () {
        try {
            if (typeof firebase !== 'undefined' && firebase.auth) {
                firebase.auth().signOut().then(function () { location.reload(); });
                return;
            }
        } catch (e) { }
        location.reload();
    };
    E.tazele = function () { location.reload(); };

    /* ------------------------------------------------------- UYGULAYICI */
    function uygula() {
        kisitUygula();
        var rol = rolOku();
        var izin = E.onayKarar(rol, E._onay);
        if (izin) perdeKaldir(); else perdeGoster(E._onay);
    }
    E.uygula = uygula;

    /* --------------------------------------------------- BULUT BAĞLANTISI */
    var dinleyici = null;
    function belgeDinle(u) {
        if (dinleyici) { try { dinleyici(); } catch (e) { } dinleyici = null; }
        E._onay = undefined; E._rol = '';
        if (!u) { uygula(); return; }
        try {
            dinleyici = firebase.firestore().collection('kullanicilar').doc(u.uid)
                .onSnapshot(function (doc) {
                    var v = (doc.exists && doc.data()) || {};
                    E._onay = v.ogretmenOnay;
                    E._rol = v.role || '';
                    uygula();
                }, function () { /* kural/çevrimdışı: kapı açık kalır */ });
        } catch (e) { }
    }

    function baglan() {
        if (typeof firebase === 'undefined' || !firebase.auth || !firebase.firestore) {
            setTimeout(baglan, 400); return;
        }
        if (!firebase.apps || !firebase.apps.length) { setTimeout(baglan, 400); return; }
        try {
            firebase.auth().onAuthStateChanged(function (u) { belgeDinle(u && u.email ? u : null); });
        } catch (e) { setTimeout(baglan, 600); return; }
    }

    /* Bekçi bulut bağlantısından BAĞIMSIZ çalışır: rol geç çözülüyor,
       bölümler sonradan çiziliyor ve Firebase hiç yüklenmese bile
       (ağ yok / SDK engelli) kısıt kuralı yine de doğru uygulanmalı. */
    function baslat() { uygula(); setInterval(uygula, 1200); baglan(); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', baslat);
    } else { baslat(); }

    /* ------------------------------------------- YÖNETİCİ: ONAY İŞLEMLERİ */
    /* Panelden çağrılır (hesap/teacher-admin.js). Yalnız yönetici görür. */
    E.bekleyenler = function () {
        return firebase.firestore().collection('kullanicilar')
            .where('ogretmenOnay', '==', 'bekliyor').get()
            .then(function (snap) {
                var l = [];
                snap.forEach(function (d) { var v = d.data() || {}; v._id = d.id; l.push(v); });
                l.sort(function (a, b) { return (a.name || '').localeCompare(b.name || '', 'tr'); });
                return l;
            });
    };
    E.onayla = function (uid) {
        return firebase.firestore().collection('kullanicilar').doc(uid)
            .update({ ogretmenOnay: 'onayli', role: 'teacher' });
    };
    E.reddet = function (uid) {
        return firebase.firestore().collection('kullanicilar').doc(uid)
            .update({ ogretmenOnay: 'reddedildi' });
    };
})();
