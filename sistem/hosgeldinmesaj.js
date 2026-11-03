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

   03.11.2026: mesaj e-postayla da gönderilir; WhatsApp tuşu onarıldı
   (aşağıda «GÖNDERME YOLLARI»).
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

  /* ---------------------------------------------- ÖĞRETMENLİK İSPATI
     (13.10.2026) Yönetici: "onaylamadan önce öğretmen olduğunu ispatlamasını
     istediğim bi mesaj olacak, öğretmenin ismi de olacak."
     Onay mesajının kardeşi: aynı kart, başka metin. ONAY VERMEDEN önce
     gönderilir; kart onay tuşuna basmadan, listedeki «Belge iste»den açılır.
     KVKK: belgede gereksiz kişisel veri istenmiyor, karalanabileceği ve
     doğrulama bitince silineceği açıkça yazıyor.
     01.11.2026 — yönetici: "bunu herkesten istiyorum ifadesini sil, bazılarını tanıdığım için belge
     istemiyorum": «bu adımı herkese uyguluyorum» kalktı. */
  function ispatMetni(ad) {
    var a = adDuzelt(ad);
    var selam = a ? ('Merhaba ' + a + ' hocam,') : 'Merhaba hocam,';
    return selam + '\n\n' +
      'kidefarapca.com\'a öğretmen başvurunuz ulaştı. Hesabı açmadan önce ' +
      'öğretmen olduğunuzu doğrulamam gerekiyor; sitede sınıf listeleri, ' +
      'sınav ve belge arşivi gibi yalnız öğretmene açık bölümler var.\n\n' +
      /* 13.10.2026 — yönetici: "üniversite diploması tarzında bi şey de
         olabilir", "mebbis ten ekran görüntüsü de olabilir", "pdf yerine
         foto veya ekran görüntüsü gibi ifadeler olsun, resmi bi istek değil
         sonuçta". Henüz atanmamış ya da kuruma bağlı olmayan meslektaşlara
         da yol açılsın; istek resmî evrak isteği gibi durmasın. */
      'Şunlardan birinin fotoğrafı ya da ekran görüntüsü yeterli:\n' +
      '• Kurum kimlik kartınız\n' +
      '• MEBBİS ekranınız\n' +
      '• e-Devlet\'ten aldığınız çalışma/görev belgeniz\n' +
      '• Üniversite diplomanız ya da e-Devlet\'ten aldığınız mezuniyet belgeniz\n\n' +
      'Resmî bir evrak göndermenize gerek yok; telefonla çekeceğiniz bir ' +
      'fotoğraf ya da ekrandan alacağınız bir görüntü de olur. ' +
      'T.C. kimlik numarası, doğum tarihi, diploma numarası gibi bilgileri ' +
      'karalayabilirsiniz; bana yalnız ad soyad ile kurum/bölüm bilgisi ' +
      'lazım. ' +
      'Gönderdiğiniz görsel sadece doğrulama için kullanılır, doğrulama biter ' +
      'bitmez silinir.\n\n' +
      'Görseli aldığım gibi hesabınızı açıp size haber vereceğim.\n\n' +
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
      /* GÖNDERME YOLLARI (03.11.2026): WhatsApp Web, e-posta, bilgi satırı, dar ekran */
      '#hgmPerde .hgm-wa svg, #hgmPerde .hgm-eposta svg{ width:18px; height:18px; flex:none; }',
      '#hgmPerde .hgm-wa-web{ background:#E3F7EA; color:#11743E; }',
      '#hgmPerde .hgm-wa-web:hover{ background:#CFF0DB; }',
      '#hgmPerde .hgm-eposta{ background:#2563EB; color:#fff; text-decoration:none;',
      '  display:inline-flex; align-items:center; gap:7px; font-weight:700;',
      '  font-size:.94rem; border-radius:11px; padding:11px 20px; }',
      '#hgmPerde .hgm-eposta:hover{ background:#1D4ED8; }',
      '#hgmPerde .hgm-gonder{ display:flex; gap:9px; flex-wrap:wrap; margin-top:14px; }',
      '#hgmPerde .hgm-gonder + .hgm-tus{ margin-top:9px; }',
      '#hgmPerde .hgm-not{ margin:10px 2px 0; font-size:.86rem; line-height:1.45; color:#0E7C66; }',
      '#hgmPerde .hgm-not:empty{ display:none; }',
      '@media (max-width:560px){',
      '  #hgmPerde .hgm-kart{ padding:22px 18px 18px; }',
      '  #hgmPerde .hgm-gonder > *{ flex:1 1 100%; justify-content:center; }',
      '  #hgmPerde .hgm-tus > *{ flex:1 1 auto; justify-content:center; }',
      '}',
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

  /* ---------------------------------------------- GÖNDERME YOLLARI (03.11.2026)
     Yönetici: "belge isteme veya onay mesajını bi tuşla mail olarak ta gönderme seçeneği
     olsun, ayrıca watsap otomotik açılmıyor" — seçimleri: Mac'te «Uygulama» ve «Web» iki ayrı
     WhatsApp tuşu, e-posta Gmail'de açılsın.

     WHATSAPP NEDEN AÇILMIYORDU: tuş numarayı data-tel'de taşıyordu. sistem/telkopya.js telefon
     rozeti için belgedeki HER [data-tel] tıklamasını YAKALAMA aşamasında durduruyordu
     (preventDefault + stopPropagation): tıklama tuşa hiç ulaşmıyor, yalnız numara panoya
     kopyalanıyordu. Safari'ye özgü değildi, her tarayıcıda böyleydi. Numara artık
     data-wa-num'da; telkopya da yalnız kendi rozetini (.tk-roz) dinliyor.

     · Bilgisayarda iki WhatsApp tuşu:
         «WhatsApp uygulaması» → whatsapp://send/?phone=… — WhatsApp'ın kendi «Sohbete devam et»
           sayfasının uygulamayı açtığı adres. Tarayıcı bir kez «açılsın mı?» diye sorar.
         «WhatsApp Web» → web.whatsapp.com/send?phone=…, yeni sekmede (08.10.2026'dan beri; wa.me
           masaüstünde WhatsApp Web'e gitmiyor, ara sayfada kalıyordu).
     · Telefonda tek tuş: uygulama (aynı whatsapp:// adresi; wa.me'nin «tarayıcıda aç» seçimine
       takılmaz).
     · «E-postayla gönder» öğretmenin kayıt e-postasına: bilgisayarda Gmail'in yeni ileti
       penceresi (alıcı, konu, metin hazır; yönetici yalnız «Gönder»e basar), telefonda cihazın
       e-posta uygulaması (mailto). Site statik; e-postayı kendiliğinden gönderecek sunucu yok.
     · Gönder tuşları metni panoya da koyar: sohbet metinsiz açılırsa yapıştırmak yeter.
     · Adresler tıklama anında yeniden kurulur: metin değiştirildiyse değişmiş hâli gider. */
  var IK_SOHBET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20.4 11.7a8.3 8.3 0 0 1-12.2 7.3L3.6 20.4l1.5-4.3a8.3 8.3 0 1 1 15.3-4.4z"/></svg>';
  var IK_WEB = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/>' +
    '<path d="M3.6 12h16.8M12 3.4c2.3 2.4 3.5 5.3 3.5 8.6s-1.2 6.2-3.5 8.6c-2.3-2.4-3.5-5.3-3.5-8.6s1.2-6.2 3.5-8.6z"/></svg>';
  var IK_ZARF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="3.2" y="5.4" width="17.6" height="13.2" rx="2.2"/><path d="M3.9 6.7l8.1 6.2 8.1-6.2"/></svg>';

  function mobilMi() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile Safari/i
      .test(navigator.userAgent || '');
  }
  function epostaDuzelt(e) {
    var s = String(e == null ? '' : e).trim();
    return /^[^\s@<>"'&?#]+@[^\s@<>"'&?#]+\.[^\s@<>"'&?#]+$/.test(s) ? s : '';
  }
  /* tur: 'uygulama' (bilgisayar ve telefon) | 'web' */
  function waAdres(tur, num, metin) {
    var m = encodeURIComponent(metin || '');
    if (tur === 'web') {
      return 'https://web.whatsapp.com/send?' + (num ? 'phone=' + num + '&' : '') + 'text=' + m;
    }
    return num
      ? ('whatsapp://send/?phone=' + num + '&text=' + m + '&type=phone_number&app_absent=0')
      : ('whatsapp://send?text=' + m);
  }
  /* tur: 'gmail' (bilgisayar) | 'posta' (telefon: cihazın e-posta uygulaması) */
  function epostaAdres(tur, adres, konu, metin) {
    var a = epostaDuzelt(adres);
    if (tur === 'gmail') {
      return 'https://mail.google.com/mail/?view=cm&fs=1' +
        (a ? '&to=' + encodeURIComponent(a) : '') +
        '&su=' + encodeURIComponent(konu || '') + '&body=' + encodeURIComponent(metin || '');
    }
    return 'mailto:' + encodeURIComponent(a).replace(/%40/g, '@') +
      '?subject=' + encodeURIComponent(konu || '') +
      '&body=' + encodeURIComponent(String(metin || '').replace(/\r?\n/g, '\r\n'));   /* RFC 6068 */
  }

  /* ORTAK KART — iki mesaj da aynı pencereyi kullanır (13.10.2026).
     o = { baslik, metin, tel, eposta, konu } */
  function kartAc(o) {
    stilKur();
    kapat();
    var p = document.createElement('div');
    p.id = 'hgmPerde';
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-label', o.baslik || 'Mesaj');
    var m = o.metin || '';
    var numara = telDuzelt(o.tel);
    var numaraYazi = telGosterim(o.tel);
    var eposta = epostaDuzelt(o.eposta);
    var konu = o.konu || 'kidefarapca.com';
    var mobil = mobilMi();
    var epTur = mobil ? 'posta' : 'gmail';
    var bilgi =
      (numara ? ('WhatsApp: <b>' + kac(numaraYazi) + '</b>')
              : 'WhatsApp: telefon kayıtlı değil, kişiyi sen seçeceksin') + ' · ' +
      (eposta ? ('E-posta: <b>' + kac(eposta) + '</b>')
              : 'E-posta: adres kayıtlı değil, alıcıyı sen yazacaksın') +
      '. İstersen önce metni değiştir.';
    function waTus(tur, yazi, sinif, ikon) {
      return '<a class="' + sinif + '" href="' + kac(waAdres(tur, numara, m)) + '"' +
        (tur === 'web' ? ' target="_blank" rel="noopener"' : '') +
        ' data-wa="' + tur + '" data-wa-num="' + numara + '"' +
        ' onclick="return KidefHosgeldin.waAc(this)">' + ikon + '<span>' + yazi + '</span></a>';
    }
    p.innerHTML =
      '<div class="hgm-kart">' +
      '<h3>' + kac(o.baslik || 'Mesaj') + '</h3>' +
      '<p class="hgm-alt">' + bilgi + '</p>' +
      '<textarea id="hgmMetin" spellcheck="false">' + kac(m) + '</textarea>' +
      '<div class="hgm-gonder">' +
      (mobil
        ? waTus('uygulama', numara ? 'WhatsApp\'tan gönder' : 'WhatsApp\'ta aç', 'hgm-wa', IK_SOHBET)
        : waTus('uygulama', 'WhatsApp uygulaması', 'hgm-wa', IK_SOHBET) +
          waTus('web', 'WhatsApp Web', 'hgm-wa hgm-wa-web', IK_WEB)) +
      '<a class="hgm-eposta" href="' + kac(epostaAdres(epTur, eposta, konu, m)) + '"' +
        (epTur === 'gmail' ? ' target="_blank" rel="noopener"' : '') +
        ' data-tur="' + epTur + '" data-eposta="' + kac(eposta) + '" data-konu="' + kac(konu) + '"' +
        ' onclick="return KidefHosgeldin.epostaAc(this)">' + IK_ZARF + '<span>E-postayla gönder</span></a>' +
      '</div>' +
      '<div class="hgm-tus">' +
      '<button type="button" class="hgm-kopya" onclick="KidefHosgeldin.kopyala(this)">Kopyala</button>' +
      '<button type="button" class="hgm-kapat" onclick="KidefHosgeldin.kapat()">Kapat</button>' +
      '</div>' +
      '<p class="hgm-not" id="hgmNot" aria-live="polite"></p>' +
      '</div>';
    p.addEventListener('click', function (e) { if (e.target === p) kapat(); });
    document.body.appendChild(p);
    document.addEventListener('keydown', tus);
  }

  /* ONAY SONRASI hoş geldin mesajı */
  function goster(ad, kod, tel, eposta) {
    kartAc({
      baslik: (adDuzelt(ad) ? adDuzelt(ad) + ' onaylandı' : 'Öğretmen onaylandı'),
      metin: metin(ad, kod),
      tel: tel,
      eposta: eposta,
      konu: 'kidefarapca.com · öğretmen hesabınız açıldı'
    });
  }

  /* ONAYDAN ÖNCE öğretmenlik belgesi isteyen mesaj */
  function ispatIste(ad, tel, eposta) {
    kartAc({
      baslik: (adDuzelt(ad) ? adDuzelt(ad) + ' — belge iste' : 'Öğretmenlik belgesi iste'),
      metin: ispatMetni(ad),
      tel: tel,
      eposta: eposta,
      konu: 'kidefarapca.com · öğretmen başvurunuz'
    });
  }

  function notYaz(yazi) {
    var n = document.getElementById('hgmNot');
    if (n) n.textContent = yazi || '';
  }
  /* Yedek: gönder tuşları metni panoya da koyar. Yazılamazsa (izin yok) sessizce geçer;
     bilgi satırı da "kopyalandı" demez. */
  function panoyaKoy(metin, sonra) {
    var bitti = false;
    function son(ok) { if (!bitti) { bitti = true; sonra(ok); } }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(metin).then(function () { son(true); }, function () { son(false); });
        return;
      }
    } catch (e) {}
    son(false);
  }

  /* Bağlantıyı tıklama anında kurar: kullanıcı metni değiştirdiyse değiştirilmiş hâli gider. */
  function waAc(a) {
    var t = document.getElementById('hgmMetin');
    var metin = t ? t.value : '';
    var tur = (a && a.getAttribute('data-wa')) || 'uygulama';
    var num = (a && a.getAttribute('data-wa-num')) || '';
    if (a) a.href = waAdres(tur, num, metin);
    notYaz(tur === 'web'
      ? 'WhatsApp Web yeni sekmede açıldı; giriş isterse telefonundan QR kodu okut.'
      : 'WhatsApp uygulaması açılıyor; tarayıcı izin sorarsa «Aç» ya da «İzin ver»e bas.');
    panoyaKoy(metin, function (ok) {
      var n = document.getElementById('hgmNot');
      if (ok && n && n.textContent.indexOf('panoya') < 0) n.textContent += ' Metin panoya da kopyalandı.';
    });
    return true;
  }

  function epostaAc(a) {
    var t = document.getElementById('hgmMetin');
    var metin = t ? t.value : '';
    var tur = (a && a.getAttribute('data-tur')) || 'gmail';
    if (a) a.href = epostaAdres(tur, a.getAttribute('data-eposta') || '', a.getAttribute('data-konu') || '', metin);
    notYaz(tur === 'gmail'
      ? 'Gmail yeni sekmede açıldı: alıcı, konu ve metin hazır, «Gönder»e basman yeter.'
      : 'E-posta uygulaması açılıyor: alıcı, konu ve metin hazır.');
    panoyaKoy(metin, function (ok) {
      var n = document.getElementById('hgmNot');
      if (ok && n && n.textContent.indexOf('panoya') < 0) n.textContent += ' Metin panoya da kopyalandı.';
    });
    return true;
  }

  window.KidefHosgeldin = {
    goster: goster, ispatIste: ispatIste, kapat: kapat, kopyala: kopyala,
    waAc: waAc, epostaAc: epostaAc, waAdres: waAdres, epostaAdres: epostaAdres,
    metin: metin, ispatMetni: ispatMetni,
    telDuzelt: telDuzelt, telGosterim: telGosterim, epostaDuzelt: epostaDuzelt
  };
})();
