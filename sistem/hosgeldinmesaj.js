/* =====================================================================
   KİDEF · HOŞ GELDİN MESAJI (paylaşmak için)  (sistem/hosgeldinmesaj.js)
   ---------------------------------------------------------------------
   Öğretmen (07.10.2026): "yönetici hesabından bi öğretmeni onayladıktan
   sonra onun ismiyle bi hoşgeldin mesajı ve tavsiyelerini isteyen
   eleştirilerini bekleyen bi mesaj olsun, ben bu mesajı hızlıca
   kopyalayabileyim; amacım ona WhatsApp'tan kolayca mesajı kopyalayıp
   paylaşmak." + "ismi soyismi olsun."

   NE YAPIYOR
   Yönetici panelinde bir öğretmen ONAYLANDIĞI anda ekranın ortasında
   küçük bir kart açılıyor: içinde o öğretmenin AD SOYADIYLA yazılmış,
   WhatsApp'a yapıştırmaya hazır bir mesaj duruyor. Tek tuşla panoya
   kopyalanıyor; istenirse doğrudan WhatsApp'ta da açılıyor.

   SİTEDEKİ HOŞ GELDİN MESAJINDAN AYRI: sistem/erisim.js onay anında
   öğretmenin site içi gelen kutusuna uzun bir "nasıl başlarım" mesajı
   bırakıyor — o duruyor, değişmedi. Buradaki metin onun yerine geçmiyor;
   WhatsApp'ta okunacak kadar kısa ve sıcak, asıl işi tavsiye ve eleştiri
   istemek.

   AD SOYAD: kayıt formunda tek alan var ("Ad soyad"), Firestore'da
   `name` olarak duruyor; mesaj onu olduğu gibi kullanıyor. Ad boşsa
   "hocam" diye başlıyor, boş bir satır kalmıyor.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefHosgeldin) return;

  var IMZA = 'Geylani Demirbağ';

  function kac(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Ad soyadı derli toplu hâle getirir: fazladan boşlukları atar.
     Büyük/küçük harfe karışmıyor — kayıttaki yazım öğretmenin kendi
     yazdığı hâli, panelde bir "baş harfleri büyüt" aracı zaten var. */
  function adDuzelt(ad) {
    return String(ad || '').replace(/\s+/g, ' ').trim();
  }

  /* ---------------------------------------------- TELEFON NUMARASI
     (08.10.2026) Öğretmen: "direkt öğretmenin kendi numarasına
     watsaptan mesaj atılabilecek şekilde olsun."
     wa.me ülke kodlu ve işaretsiz numara ister: 905XXXXXXXXX.
     Sitede numaralar 05XX…, +90 5XX…, 5XX… gibi farklı yazılmış
     olabiliyor; hepsi tek hâle getirilir. Tanınmayan bir yazım gelirse
     numara kullanılmaz, bağlantı eskisi gibi kişi seçtiren hâline
     döner — yanlış kişiye mesaj açılmasın. */
  function telDuzelt(t) {
    var d = String(t == null ? '' : t).replace(/\D/g, '');
    if (!d) return '';
    if (d.slice(0, 2) === '00') d = d.slice(2);                      /* 0090… */
    if (d.length === 13 && d.slice(0, 3) === '090') d = d.slice(3);  /* 090 5XX… */
    else if (d.length === 12 && d.slice(0, 2) === '90') d = d.slice(2);
    else if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
    /* elde 10 hane ve 5 ile başlayan bir CEP numarası kalmalı; sabit hat
       (0212…) ya da eksik yazım wa.me'ye gönderilmez. */
    if (d.length !== 10 || d.charAt(0) !== '5') return '';
    return '90' + d;
  }
  function telGosterim(t) {
    var d = telDuzelt(t);
    if (!d) return '';
    var y = d.slice(2);                       /* 5XXXXXXXXX */
    return '0' + y.slice(0, 3) + ' ' + y.slice(3, 6) + ' ' + y.slice(6, 8) + ' ' + y.slice(8);
  }

  function metin(ad, kod) {
    var a = adDuzelt(ad);
    var selam = a ? ('Merhaba ' + a + ' hocam,') : 'Merhaba hocam,';
    return selam + '\n\n' +
      'kidefarapca.com\'da öğretmen hesabınız açıldı. Sınıf listeleri, ' +
      'sınıf defteri, planlar, belgeler ve etkinlikler artık size açık.\n\n' +
      /* KOD AÇIK YAZILMIYOR (07.10.2026) — öğretmen: "kod açık olmasın,
         .... olsun." Mesaj hazır bir metin; yanlış kişiye yapıştırılma
         ihtimali olan bir kodu içinde taşımıyor. Yerinde noktalar
         duruyor, öğretmen göndermeden önce elle yazıyor. Satır her
         durumda çıkıyor, çünkü boşluk doldurulacak yer orası. */
      /* 08.10.2026 — öğretmen: "... olmuş, sadece TCH..... gibi olsun."
         Kodun kendisi hâlâ yazılmıyor; yalnız biçimi tanınsın diye ön eki
         duruyor, rakamların yeri noktalı. */
      'Öğrencileriniz kayıt olurken bu kodu girerse sınıfınıza bağlanma ' +
      'isteği gönderir: TCH-....\n\n' +
      /* 07.10.2026 — öğretmen: "'en çok işe yarayan şeyler meslektaşlarımın
         uyarısıyla eklendi' burda böyle bi şey yok, sadece eleştiri ve
         tavsiyeler yeterli." Doğru olmayan cümle çıkarıldı; metin yalnız
         istediğini istiyor. */
      'Site hâlâ geliştiriliyor. Eksik gördüğünüz, "şu da olsa" dediğiniz ' +
      'ya da ters giden ne varsa çekinmeden yazın; tavsiyenizi de ' +
      'eleştirinizi de bekliyorum.\n\n' +
      'Kolaylıklar dilerim.\n' + IMZA;
  }

  function stilKur() {
    if (document.getElementById('kidef-hgm-stil')) return;
    var s = document.createElement('style');
    s.id = 'kidef-hgm-stil';
    s.textContent = [
      '#hgmPerde{ position:fixed; inset:0; z-index:100001; display:flex;',
      '  align-items:center; justify-content:center; padding:24px 16px;',
      '  background:rgba(12,38,32,.5); -webkit-backdrop-filter:blur(3px);',
      '  backdrop-filter:blur(3px); }',
      '#hgmPerde .hgm-kart{ position:relative; width:min(640px,94vw);',
      '  max-height:88vh; overflow-y:auto; overscroll-behavior:contain;',
      '  background:#fff; border-radius:20px; padding:26px 28px 24px;',
      '  box-shadow:0 30px 70px rgba(8,45,37,.34);',
      '  background-image:linear-gradient(90deg,#16A085 0%,#F39C12 50%,#2563EB 100%);',
      '  background-size:100% 6px; background-repeat:no-repeat;',
      '  background-position:top left; }',
      '#hgmPerde h3{ margin:8px 0 4px; font-size:1.2rem; color:#12463B; }',
      '#hgmPerde .hgm-alt{ margin:0 0 14px; font-size:.88rem; color:#7C8894; }',
      '#hgmPerde textarea{ width:100%; min-height:250px; resize:vertical;',
      '  font-family:inherit; font-size:.95rem; line-height:1.55; color:#2C3E50;',
      '  border:1px solid #E1E8EE; border-radius:14px; padding:14px 16px;',
      '  background:#FBFDFC; }',
      '#hgmPerde textarea:focus{ outline:2px solid rgba(22,160,133,.45);',
      '  outline-offset:1px; }',
      '#hgmPerde .hgm-tus{ display:flex; gap:9px; flex-wrap:wrap; margin-top:14px; }',
      '#hgmPerde button{ cursor:pointer; font-family:inherit; font-weight:700;',
      '  font-size:.94rem; border:0; border-radius:11px; padding:11px 20px; }',
      '#hgmPerde .hgm-kopya{ background:#16A085; color:#fff; }',
      '#hgmPerde .hgm-kopya:hover{ background:#0E7C66; }',
      '#hgmPerde .hgm-kopya.oldu{ background:#0B6B58; }',
      '#hgmPerde .hgm-wa{ background:#25D366; color:#fff; text-decoration:none;',
      '  display:inline-flex; align-items:center; gap:7px; font-weight:700;',
      '  font-size:.94rem; border-radius:11px; padding:11px 20px; }',
      '#hgmPerde .hgm-wa:hover{ background:#1DAE52; }',
      '#hgmPerde .hgm-kapat{ background:#EDF1F0; color:#55636E; margin-inline-start:auto; }',
      '#hgmPerde .hgm-kapat:hover{ background:#E0E7E5; }'
    ].join('\n');
    document.head.appendChild(s);
  }

  function kapat() {
    var p = document.getElementById('hgmPerde');
    if (p && p.parentNode) p.parentNode.removeChild(p);
    document.removeEventListener('keydown', tus);
  }
  function tus(e) { if (e.key === 'Escape') kapat(); }

  function kopyala(dug) {
    var t = document.getElementById('hgmMetin');
    if (!t) return;
    var tamam = function () {
      dug.textContent = '✓ Kopyalandı';
      dug.classList.add('oldu');
      setTimeout(function () {
        dug.textContent = 'Kopyala';
        dug.classList.remove('oldu');
      }, 1800);
    };
    /* Pano izni yoksa ya da eski tarayıcıda: seçip execCommand ile.
       İkisi de olmazsa metin zaten seçili kalıyor, elle kopyalanabilir. */
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t.value).then(tamam, function () {
          t.select(); try { document.execCommand('copy'); tamam(); } catch (e) {}
        });
        return;
      }
    } catch (e) {}
    t.select();
    try { document.execCommand('copy'); tamam(); } catch (e) {}
  }

  /* ad = öğretmenin ad soyadı, kod = varsa TCH- kodu,
     tel = öğretmenin telefonu (varsa mesaj doğrudan ona açılır) */
  function goster(ad, kod, tel) {
    stilKur();
    kapat();
    var p = document.createElement('div');
    p.id = 'hgmPerde';
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-label', 'Hoş geldin mesajı');
    var m = metin(ad, kod);
    var numara = telDuzelt(tel);
    var numaraYazi = telGosterim(tel);
    p.innerHTML =
      '<div class="hgm-kart">' +
      '<h3>' + (adDuzelt(ad) ? kac(adDuzelt(ad)) + ' onaylandı' : 'Öğretmen onaylandı') + '</h3>' +
      '<p class="hgm-alt">' +
        (numara
          ? ('WhatsApp doğrudan <b>' + kac(numaraYazi) + '</b> numarasına açılır. ' +
             'İstersen önce metni değiştir.')
          : ('Bu öğretmenin telefonu kayıtlı değil; WhatsApp açılınca kişiyi ' +
             'sen seçeceksin. İstersen önce metni değiştir.')) +
      '</p>' +
      '<textarea id="hgmMetin" spellcheck="false">' + kac(m) + '</textarea>' +
      '<div class="hgm-tus">' +
      '<button type="button" class="hgm-kopya" onclick="KidefHosgeldin.kopyala(this)">Kopyala</button>' +
      '<a class="hgm-wa" href="https://wa.me/' + numara + '" target="_blank" rel="noopener"' +
      ' data-tel="' + numara + '"' +
      ' onclick="return KidefHosgeldin.waAc(this)">' +
      (numara ? 'WhatsApp\'tan gönder' : 'WhatsApp\'ta aç') + '</a>' +
      '<button type="button" class="hgm-kapat" onclick="KidefHosgeldin.kapat()">Kapat</button>' +
      '</div></div>';
    p.addEventListener('click', function (e) { if (e.target === p) kapat(); });
    document.body.appendChild(p);
    document.addEventListener('keydown', tus);
    /* WhatsApp bağlantısı metin değiştirilirse de güncel kalsın diye
       tıklama anında kuruluyor (bkz. waAc). */
  }

  /* Bağlantıyı tıklama anında kurar: kullanıcı metni değiştirdiyse
     değiştirilmiş hâli gider. */
  function waAc(a) {
    var t = document.getElementById('hgmMetin');
    var num = (a && a.getAttribute('data-tel')) || '';
    a.href = 'https://wa.me/' + num + '?text=' + encodeURIComponent(t ? t.value : '');
    return true;
  }

  window.KidefHosgeldin = {
    goster: goster, kapat: kapat, kopyala: kopyala, waAc: waAc, metin: metin,
    telDuzelt: telDuzelt, telGosterim: telGosterim
  };
})();
