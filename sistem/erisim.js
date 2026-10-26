/* ==========================================================================
   KIDEF · ERİŞİM KATMANI  —  erisim.js  (v1)
   --------------------------------------------------------------------------
   İki ayrı kapıyı yönetir. İkisi de sistem/kilit.js'in yanında çalışır ve
   onun kararını EZMEZ; kilit perdesi inmişse zaten bu katman görünmez.

   1) ÖĞRENCİ KATEGORİ KISITI
      Site kilidi "🎓 Sadece Girişliler" (kilit: 'girisli') kademesindeyken
      ÖĞRENCİ hesapları ana sayfada yalnız şunları görür:
          Sınıfım · Değerler Eğitimi · Sosyal Hesaplar
      (26.10.2026: Oyunlar da kapandı — öğrencinin oyunları Sınıfım'da, o
      sınıfın kartları. Sınıfım: sistem/sinifim.js.)
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
    var OGRENCI_BOLUM = ['degerler-egitimi', 'youtube-kanallari'];   /* 26.10.2026: 'oyunlar' çıktı */
    E.OGRENCI_BOLUM = OGRENCI_BOLUM;

    /* ------------------------------------------- WHATSAPP BİLDİRİMİ
       Öğretmen kayıt olup onay perdesinde beklerken, tek dokunuşla
       yöneticiye haber verebilsin diye hazır mesajlı bir wa.me bağlantısı
       kuruluyor. Sunucu/API yok: bağlantı WhatsApp'ı açar, mesaj yazılı
       gelir, öğretmen yalnız "gönder"e basar.

       NUMARA DEĞİŞTİRMEK İSTERSEN TEK YER BURASI. Uluslararası biçim,
       başında + ve boşluk olmadan (wa.me böyle istiyor).
       Not: bu numara sayfa kaynağında görünür — gizli bir hat verme. */
    var WP_NUMARA = '905386482614';

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

        /* Hazır mesajlı WhatsApp bağlantısı. Mesajı öğretmen gönderiyor,
           bu yüzden birinci ağızdan yazılı; içinde kaydı bulmaya yetecek
           kadar bilgi var (ad, e-posta, varsa telefon). */
        var k = E._kisi || {};
        var govde = red
            ? ('Merhaba, kidefarapca.com\'a öğretmen olarak kayıt oldum ama ' +
               'başvurum onaylanmamış görünüyor. Yardımcı olabilir misiniz?')
            : ('Merhaba, kidefarapca.com\'a öğretmen hesabı açtım, onayınızı ' +
               'bekliyorum.');
        var satirlar = [govde, ''];
        if (k.ad)    satirlar.push('Ad Soyad: ' + k.ad);
        if (k.email) satirlar.push('E-posta: ' + k.email);
        if (k.tel)   satirlar.push('Telefon: ' + k.tel);
        var wpBag = 'https://wa.me/' + WP_NUMARA + '?text=' +
                    encodeURIComponent(satirlar.join('\n'));
        var wpTus = '' +
          '<a class="eop-wp" href="' + wpBag + '" target="_blank" rel="noopener">' +
            '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
              '<path d="M20 3.9A11 11 0 0 0 3.6 18.5L2.5 22.5l4.1-1.1A11 11 0 1 0 20 3.9zm-8 18a9 9 0 0 1-4.6-1.3l-.3-.2-2.7.7.7-2.7-.2-.3A9 9 0 1 1 12 21.9zm5-6.7c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.5.1a7.4 7.4 0 0 1-3.7-3.2c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5s-.6-1.5-.9-2c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3A3 3 0 0 0 6 10.5a5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c2.2.9 2.2.6 2.6.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/>' +
            '</svg>' +
            '<span>' + (red ? 'WhatsApp\'tan yaz' : 'WhatsApp\'tan haber ver') + '</span>' +
          '</a>' +
          '<div class="eop-wp-dip">Mesaj hazır gelir; yalnızca gönder\'e basman yeterli.</div>';

        /* BEKLEYENE ÖN BİLGİ: onay gelene kadar ekranda oturan öğretmen
           hiçbir şey deneyemiyor. Hiç değilse kendisini nelerin beklediğini
           ve ilk gün ne yapacağını burada okusun. Reddedilene gösterilmez. */
        var onIzleme = red ? '' : '' +
          '<div class="eop-adimlar">' +
            '<div class="eop-adimlar-bas">Onaylandığında ilk üç adımın:</div>' +
            '<ol>' +
              '<li><b>Sınıfını kur.</b> Sağ üstteki avatarına bas — <b>Listelerim</b> ' +
                  'açılır. Kurum, seviye ve sınıflarını buradan oluşturursun.</li>' +
              '<li><b>Öğrencilerini ekle.</b> Her öğrenciye kişisel bir giriş kodu ' +
                  'üretilir; listede adının yanında gizli durur, dokununca görünür.</li>' +
              '<li><b>Öğretmen kodunu dağıt.</b> Sana özel, hiç değişmeyen bir ' +
                  '<b>TCH-…</b> kodun olur. Öğrencin kayıt olurken bu kodu girerse ' +
                  'sana bağlanma isteği gönderir, sen onaylarsın.</li>' +
            '</ol>' +
            '<div class="eop-adimlar-dip">Onay mesajı geldiğinde kendi kodun da ' +
              'içinde yazılı olacak.</div>' +
          '</div>';
        return '' +
        '<div class="eop-kutu">' +
          '<div class="eop-ikon">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
                 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ikon + '</svg>' +
          '</div>' +
          '<h2>' + baslik + '</h2>' +
          '<p>' + metin + '</p>' +
          wpTus +
          onIzleme +
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
            /* sayfanın kendi biçimi yoksa (index dışı sayfalar) bu dosyadaki */
            try { if (getComputedStyle(p).position !== 'fixed') stilKur(); } catch (e) { stilKur(); }
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
    /* ONAY KARARI ANINDA (18.10.2026) — öğretmen: "öğretmen kayıt olduğunda
       ben onaylamadan da öğretmen olarak sisteme bakabiliyor".
       Perde yalnız bu dosyanın KENDİ dinleyicisinden gelen cevapla iniyordu;
       rol ise hesap/auth.js'te AYRI bir okumayla geliyordu. Arada (ağ
       yavaşsa saniyelerce) öğretmen arayüzü açık kalıyor; dinleyici bir kez
       hata verirse (çevrimdışı, kural) perde o oturumda hiç inmiyordu. Artık:
         · auth.js belgeyi okuyunca aynı veriyi buraya da verir (belgeGeldi):
           perde, öğretmen arayüzü çizilmeden ÖNCE iner;
         · bu tarayıcıda aynı hesabın son bilinen onay durumu (sistem/rol.js
           önbelleği) oturum açılır açılmaz uygulanır;
         · dinleyici hata verirse son bilinen durum korunur, kapı açılmaz;
         · karar belgedeki role bakar (uygulamanın rolü geç gelse de);
         · perdenin biçimi bu dosyada da var: başka sayfada da çalışır. */
    function uygula() {
        kisitUygula();
        var rol = E._rol || rolOku();
        var izin = E.onayKarar(rol, E._onay);
        if (izin) perdeKaldir(); else perdeGoster(E._onay);
    }
    E.uygula = uygula;

    function stilKur() {
        if (document.getElementById('eopStil')) return;
        var s = document.createElement('style');
        s.id = 'eopStil';
        s.textContent = [
            '#ogretmenOnayPerde{position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;',
            ' justify-content:center;padding:22px;box-sizing:border-box;overflow:auto;',
            ' background:linear-gradient(160deg,#F5A623 0%,#E8830C 55%,#D2740A 100%);',
            " font-family:'Arakom','Marhey',system-ui,sans-serif}",
            '#ogretmenOnayPerde .eop-kutu{width:min(560px,100%);background:#fff;border-radius:22px;',
            ' padding:34px 30px 26px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.28);box-sizing:border-box}',
            '#ogretmenOnayPerde .eop-ikon{width:64px;height:64px;margin:0 auto 14px;border-radius:50%;',
            ' background:#FFF3E0;color:#E8830C;display:flex;align-items:center;justify-content:center}',
            '#ogretmenOnayPerde .eop-ikon svg{width:32px;height:32px}',
            '#ogretmenOnayPerde h2{margin:0 0 10px;font-size:1.55rem;color:#1d1d1f}',
            '#ogretmenOnayPerde p{margin:0 0 8px;font-size:1.02rem;line-height:1.6;color:#4B5563}',
            '#ogretmenOnayPerde .eop-tus{display:flex;gap:10px;justify-content:center;margin:20px 0 6px;flex-wrap:wrap}',
            '#ogretmenOnayPerde .eop-tus button{border:0;cursor:pointer;font-family:inherit;font-weight:800;',
            ' font-size:1rem;border-radius:12px;padding:12px 22px;background:#E8830C;color:#fff}',
            '#ogretmenOnayPerde .eop-tus button.eop-cik{background:#EDF1F7;color:#4B5563}',
            '#ogretmenOnayPerde .eop-wp{display:inline-flex;align-items:center;gap:8px;margin:12px 0 2px;',
            ' padding:11px 20px;border-radius:12px;background:#25D366;color:#fff;font-weight:800;text-decoration:none}',
            '#ogretmenOnayPerde .eop-wp svg{width:20px;height:20px}',
            '#ogretmenOnayPerde .eop-wp-dip,#ogretmenOnayPerde .eop-dip{font-size:.85rem;color:#8A93A0}',
            '#ogretmenOnayPerde .eop-adimlar{margin:16px 0 0;text-align:start;background:#FFF8EE;',
            ' border:1px solid #F6D08A;border-radius:14px;padding:12px 16px;font-size:.93rem;color:#5C430A}',
            '#ogretmenOnayPerde .eop-adimlar ol{margin:6px 0;padding-inline-start:20px}'
        ].join('\n');
        (document.head || document.documentElement).appendChild(s);
    }

    /* ------------------------------------------- SON BİLİNEN ONAY DURUMU
       sistem/rol.js önbelleği: { uid, rol, onay } — yalnız AYNI hesap için */
    function onbellekOnay(uid) {
        try {
            var h = JSON.parse(localStorage.getItem('kidefRolBilgi') || 'null');
            if (h && uid && h.uid === uid && h.rol === 'teacher' && h.onay) return h.onay;
        } catch (e) { }
        return undefined;
    }
    function kisiYaz(v, u) {
        v = v || {};
        E._kisi = {
            ad: (v.name && v.name !== 'Belirtilmedi') ? v.name : '',
            email: v.email || (u && u.email) || '',
            tel: (v.phone && v.phone !== 'Belirtilmedi') ? v.phone : ''
        };
    }
    /* hesap/auth.js belgeyi okuyunca (ya da kayıtta yazınca) çağırır */
    E.belgeGeldi = function (u, v) {
        if (!u || !v) return;
        if (E._uid && E._uid !== u.uid) return;          /* başka hesabın geç kalmış cevabı */
        E._uid = u.uid;
        E._onay = v.ogretmenOnay;
        E._rol = v.role || '';
        kisiYaz(v, u);
        uygula();
    };

    /* --------------------------------------------------- BULUT BAĞLANTISI */
    var dinleyici = null;
    function belgeDinle(u) {
        var uid = u ? u.uid : null;
        if (dinleyici) { try { dinleyici(); } catch (e) { } dinleyici = null; }
        if (E._uid !== uid) {                              /* hesap değişti: baştan */
            E._uid = uid;
            E._onay = undefined; E._rol = '';
            E._kisi = {};                     /* WhatsApp mesajı için ad/e-posta/telefon */
            var son = onbellekOnay(uid);
            if (son) { E._onay = son; E._rol = 'teacher'; kisiYaz(null, u); }
        }
        if (!u) { uygula(); return; }
        uygula();
        try {
            dinleyici = firebase.firestore().collection('kullanicilar').doc(u.uid)
                .onSnapshot(function (doc) {
                    if (E._uid !== uid) return;
                    if (!doc.exists) return;                 /* kayıt belgesi henüz yazılmadı */
                    var v = doc.data() || {};
                    E._onay = v.ogretmenOnay;
                    E._rol = v.role || '';
                    kisiYaz(v, u);
                    uygula();
                }, function () { /* kural/çevrimdışı: son bilinen durum korunur */ });
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
    /* REDDEDİLENLER (26.10.2026) — yönetici: "yöneticinin reddettiği
       öğretmenleri görüp sonradan onay verebilmesini istiyorum". Reddedilen
       hesap silinmez (ogretmenOnay:'reddedildi'); paneldeki «Reddedilenler»
       bu sorguyla dolar. Sıra: son reddedilen önce (redTarihi), tarihsiz
       eski kayıtlar sonda, ada göre. */
    E.reddedilenler = function () {
        return firebase.firestore().collection('kullanicilar')
            .where('ogretmenOnay', '==', 'reddedildi').get()
            .then(function (snap) {
                var l = [];
                snap.forEach(function (d) { var v = d.data() || {}; v._id = d.id; l.push(v); });
                var ms = function (t) {
                    try { return (t && t.toDate) ? (t.toDate().getTime() || 0) : (typeof t === 'number' ? t : 0); }
                    catch (e) { return 0; }
                };
                l.sort(function (a, b) {
                    return (ms(b.redTarihi) - ms(a.redTarihi)) || (a.name || '').localeCompare(b.name || '', 'tr');
                });
                return l;
            });
    };
    /* ------------------------------------------- HOŞ GELDİN MESAJI
       Onay anında öğretmenin gelen kutusuna düşen bilgi mesajı.
       METNİ DEĞİŞTİRMEK İSTERSEN TEK YER BURASI.

       Düz metindir: gelen kutusu metni kaçırıp `white-space: pre-wrap`
       ile basıyor, yani HTML çalışmaz ama satır sonları korunur.

       Kod: öğretmen kodunu ogrencihesap.js üretiyor (OH.koduTuret).
       Oradan alıyoruz ki kural değişirse mesaj yanlış kod söylemesin;
       dosya yüklü değilse kod satırı metinden çıkarılır.               */
    E.hosgeldinMetni = function (ad, kod) {
        var isim = (ad || '').trim();
        var selam = isim ? ('Merhaba ' + isim + ',') : 'Merhaba,';
        return selam + '\n\n' +
        'Öğretmen hesabın onaylandı — artık siteyi kullanabilirsin.\n\n' +
        'Başlamak için üç adım:\n\n' +
        '1) SINIFINI KUR\n' +
        'Sağ üstteki avatarına bas; "Listelerim" açılır. Kurum, seviye ve ' +
        'sınıflarını buradan oluşturuyorsun. (Avatara ikinci kez basarsan ' +
        'profiline geçersin.)\n\n' +
        '2) ÖĞRENCİLERİNİ EKLE\n' +
        'Sınıfa öğrenci eklediğinde her birine kişisel bir giriş kodu ' +
        'üretilir. Listede adının yanında gizli durur, üstüne dokununca ' +
        'görünür.\n\n' +
        '3) ÖĞRETMEN KODUNU DAĞIT\n' +
        (kod
          ? ('Sana özel kodun: ' + kod + '\n')
          : 'Profil > Kişisel Bilgilerim bölümünde sana özel bir TCH- kodu var.\n') +
        'Öğrencilerin kayıt olurken bu kodu girerse sana bağlanma isteği ' +
        'gönderir. İstekleri Profil > Kişisel Bilgilerim > "İstekleri Gör" ' +
        'ile onaylıyorsun. Kodun sabittir, hiç değişmez — rahatça ' +
        'dağıtabilirsin.\n\n' +
        'Sınıfın kurulduktan sonra: not ve davranış girme, görev (ödev) ' +
        'gönderip sonuçlarını görme, öğrencilerinin oyun etkinliğini takip ' +
        'etme, sınıfa toplu mesaj atma ve sınıf içi bilgi yarışması ' +
        'başlatma hepsi açık olacak.\n\n' +
        'Takıldığın yerde bu mesaja cevap yazman yeterli.';
    };

    /* Mesajı gelen kutusuna bırakır. Yönetici oturumundan çağrıldığı için
       Firestore kuralı `from:'admin'` yazımına izin verir (bkz.
       firestore.rules.txt → match /mesajlar). */
    function hosgeldinYolla(uid, bilgi) {
        bilgi = bilgi || {};
        var kod = '';
        try { if (window.OH && OH.koduTuret) kod = OH.koduTuret(uid); } catch (e) { kod = ''; }
        return firebase.firestore().collection('mesajlar').add({
            uid: uid,
            email: bilgi.email || '',
            ad: bilgi.ad || 'Öğretmen',
            from: 'admin',
            kategori: 'Hoş geldin',
            text: E.hosgeldinMetni(bilgi.ad, kod),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            readByAdmin: true,
            readByUser: false
        });
    }

    /* bilgi = {ad, email} — yönetici panelindeki bekleyen kaydından gelir.
       Mesaj yazılamazsa ONAY YİNE GEÇERLİDİR: asıl iş rol güncellemesidir,
       mesaj ikincil. Bu yüzden hata yutulur, söz reddedilmez. */
    E.onayla = function (uid, bilgi) {
        return firebase.firestore().collection('kullanicilar').doc(uid)
            .update({ ogretmenOnay: 'onayli', role: 'teacher' })
            .then(function () {
                return hosgeldinYolla(uid, bilgi).catch(function (e) {
                    try { console.warn('Hoş geldin mesajı gönderilemedi:', e); } catch (x) {}
                });
            });
    };
    /* Red tarihi de yazılır (26.10.2026): «Reddedilenler»de ne zaman
       reddedildiği görünsün. Kural yöneticiye her alanı açık. */
    E.reddet = function (uid) {
        var v = { ogretmenOnay: 'reddedildi' };
        try { v.redTarihi = firebase.firestore.FieldValue.serverTimestamp(); } catch (e) { }
        return firebase.firestore().collection('kullanicilar').doc(uid).update(v);
    };
})();
