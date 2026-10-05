/* ===========================================================================
   KİDEF · GİRİŞ PENCERESİ — KAYIT KİPİ VE ‹ GERİ TUŞU
   ---------------------------------------------------------------------------
   Öğretmen (05.10.2026): "giriş sayfasında scroll olmadan her şey sığsın…
   karekod veya kayıt ola basınca çarpı geri tuşuna dönsün."

   İKİ İŞ
   1. Kayıt kipine geçilince #login-modal'a .kdt-kayit sınıfı konuyor.
      hesap/qrgiris.css onu görünce kayıt ekranında iki parçayı gizliyor:
        · "Kayıt ol" kartı — zaten kayıt ekranındasın
        · "Karekodla Giriş" satırı — karekod GİRİŞ içindir, kayıt için değil
      İkisi birlikte ~164 px; pencerenin kaydırmasız sığmasına bu da girdi.
   2. Kayıt kipinde sağ üstteki ✕ ‹ geri'ye dönüyor; basınca giriş kipine
      dönüp yeniden ✕ oluyor. Karekod yolunda aynı işi kayitanketi.js'teki
      kapatTusu() zaten yapıyordu — eksik olan kayıt yoluydu.

   NİYE GÖZLEMCİ, NİYE SADECE moduDegistir SARMASI DEĞİL
   Kipi iki ayrı dosya çeviriyor: index'te hesap/auth.js (isLoginMode),
   başka sayfada hesap/girisdavranis.js (kendi durumu). Üstüne
   kayitanketi.js de moduDegistir'i sarmalıyor. Hangisinin en son
   sarmaladığına bağlı kalmamak için kip EKRANDAN okunuyor: "Şifreyi
   Onayla" alanı görünürse kayıt kipindeyiz. MutationObserver o alanın
   style'ını izliyor — kim çevirirse çevirsin yakalanıyor.
   =========================================================================== */
(function () {
    'use strict';
    if (window.KidefGirisGenislik) return;

    function el(id) { return document.getElementById(id); }

    /* Kip ekrandan okunur: "Şifreyi Onayla" görünüyorsa kayıt kipi. */
    function kayitMi() {
        var g = el('re-password-group');
        return !!(g && getComputedStyle(g).display !== 'none');
    }

    var GERI_IK = '<svg class="ka-ik" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="2.2" stroke-linecap="round" ' +
        'stroke-linejoin="round" aria-hidden="true"><path d="M14.8 5.2 8 12l6.8 6.8"/></svg>';

    /* Sağ üstteki tuş: ara ekranda ‹ geri, ilk ekranda ✕ kapat.
       kayitanketi.js de aynı düğmeyi kullanıyor (ka-geri-tus / ka-x-tus
       sınıfları ve __kaEski alanı onun); aynı kurallara uyuluyor ki iki
       taraf birbirinin işini bozmasın. */
    function tusAyarla(geriIslev) {
        var x = document.querySelector('#login-modal .modal-close');
        if (!x) return;
        if (x.__kaEski == null) x.__kaEski = x.innerHTML;
        if (geriIslev) {
            if (!x.classList.contains('ka-geri-tus')) {
                x.innerHTML = GERI_IK;
                x.classList.add('ka-geri-tus');
                x.classList.remove('ka-x-tus');
            }
            x.setAttribute('title', 'Geri');
            x.setAttribute('aria-label', 'Geri');
            x.onclick = geriIslev;
        } else {
            x.innerHTML = x.__kaEski;
            x.classList.remove('ka-geri-tus');
            x.classList.add('ka-x-tus');
            x.setAttribute('title', 'Kapat');
            x.setAttribute('aria-label', 'Kapat');
            x.onclick = function () {
                if (typeof window.closeLoginModal === 'function') window.closeLoginModal();
            };
        }
    }

    /* Karekod ekranı açık mı? Açıksa tuşu BİZ ellemiyoruz — orayı
       kayitanketi.js yönetiyor, iki taraf çekiştirmesin. */
    function karekodAcikMi() {
        var a = el('qr-modal-alan');
        return !!(a && getComputedStyle(a).display !== 'none' && a.innerHTML.trim());
    }

    function tazele() {
        var m = el('login-modal');
        if (!m) return;
        var kayit = kayitMi();
        m.classList.toggle('kdt-kayit', kayit);
        if (karekodAcikMi()) return;
        if (kayit) {
            tusAyarla(function () {
                if (typeof window.moduDegistir === 'function') window.moduDegistir();
                setTimeout(tazele, 0);
            });
        } else {
            tusAyarla(null);
        }
    }

    /* "Şifreyi Onayla" alanının style'ı değişince kip değişmiştir. */
    function gozle() {
        var g = el('re-password-group');
        if (!g || g.__kdtGozlu) return !!g;
        g.__kdtGozlu = 1;
        try {
            new MutationObserver(function () { setTimeout(tazele, 0); })
                .observe(g, { attributes: true, attributeFilter: ['style', 'class'] });
        } catch (e) { return false; }
        tazele();
        return true;
    }

    /* Pencere sonradan basılıyor (hesap/girispenceresi.js), alan da onunla
       geliyor: kısa bir süre denenip bırakılıyor. */
    var deneme = 0;
    (function bekle() {
        if (gozle() || ++deneme > 60) return;
        setTimeout(bekle, 200);
    })();

    /* Pencere kapanınca kip ve tuş sıfırlansın. */
    if (typeof window.closeLoginModal === 'function' && !window.closeLoginModal.__kdt) {
        var eski = window.closeLoginModal;
        var yeni = function () {
            var m = el('login-modal');
            if (m) m.classList.remove('kdt-kayit');
            return eski.apply(this, arguments);
        };
        yeni.__kdt = 1;
        window.closeLoginModal = yeni;
    }

    window.KidefGirisGenislik = { tazele: tazele, kayitMi: kayitMi };
})();
