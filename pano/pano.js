/* ==================================================================
   PANO — seçici + afiş çizimi (pano.html)
   ------------------------------------------------------------------
   Veri: pano/panoveri.js → window.PANO_VERI (üretilmiş dosya;
   Arapçanın tamamı sitenin kök verisinden geliyor).

   İki görünüm var:
     · Pano görünümü  — mantar zeminde, raptiyeli, eğik durur.
     · Gerçek boyut   — afiş 1:1 (A3) görünür, baskı öncesi denetim.
   Yazdır tuşu A3 dikey, kenar boşluksuz çıktı verir (bkz. pano.css).
   ================================================================== */
(function () {
  'use strict';

  var VERI = window.PANO_VERI || [];
  var secili = 0;
  var gercek = false;

  var liste = document.getElementById('pnListe');
  var sahne = document.getElementById('pnSahne');
  var tusGercek = document.getElementById('pnGercek');
  var tusIndir = document.getElementById('pnIndir');
  /* Tuşun yazısı ayrı bir <span>'de: doğrudan textContent yazılsaydı
     içindeki ok ikonu silinirdi. */
  var indirYazi = document.getElementById('pnIndirYazi');

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------------- sol liste ---------------- */
  function listeCiz() {
    var h = '<h2>Bu Günün Kökü · ' + VERI.length + ' afiş</h2>';
    VERI.forEach(function (p, i) {
      h += '<button type="button" data-i="' + i + '" aria-current="' + (i === secili) + '">' +
        '<span class="pn-nokta" style="background:' + esc(p.renk) + '"></span>' +
        '<span class="pn-ad">' + esc(p.ad) +
        '<span class="pn-tar">' + esc(p.tarih) + '</span></span>' +
        '<span class="pn-kok">' + esc(p.kok) + '</span>' +
        '</button>';
    });
    liste.innerHTML = h;
    [].forEach.call(liste.querySelectorAll('button'), function (b) {
      b.onclick = function () { sec(+b.getAttribute('data-i')); };
    });
  }

  /* Rengi beyazla karıştırıp açık ton üretir (oran: rengin payı).
     CSS'in color-mix()'i yerine bunu kullanıyoruz; indirme sırasında
     çalışan html2canvas yeni renk yazımlarını okuyamıyor. */
  function tint(hex, oran) {
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return '#ffffff';
    var o = '#';
    for (var i = 0; i < 3; i++) {
      var d = parseInt(h.substr(i * 2, 2), 16);
      var y = Math.round(d * oran + 255 * (1 - oran));
      o += ('0' + y.toString(16)).slice(-2);
    }
    return o;
  }

  /* ---------------- afiş ----------------
     adet: kaç örnek cümle yazılacağı. sec() bunu 3'ten başlatıp
     gerekirse azaltıyor (bkz. aşağısı). */
  function afisHtml(p, adet) {
    var harfler = String(p.kok || '').split('').map(function (x) {
      return '<span class="pn-harf">' + esc(x) + '</span>';
    }).join('');

    var satir = (p.turev || []).map(function (t) {
      /* Alt satır, üsttekini TEKRARLAMASIN: veride anlamlar
         "Ölçtü / Güç yetirdi" gibi tek dizgide duruyor; ilk parça
         zaten kalın satırda yazılıyor, burada yalnız gerisi kalsın. */
      var uzun = '';
      if (t.tr && t.kisa && t.tr !== t.kisa) {
        uzun = t.tr.indexOf(t.kisa) === 0
          ? t.tr.slice(t.kisa.length).replace(/^[\s\/();,·-]+/, '')
          : t.tr;
      }
      return '<div class="pn-sat">' +
        '<span class="pn-ar">' + esc(t.ar) + '</span>' +
        '<span class="pn-tr">' + esc(t.kisa || t.tr) +
        (uzun ? '<span class="pn-uzun">' + esc(uzun) + '</span>' : '') +
        '</span></div>';
    }).join('');

    var ornekler = (p.cumleler || []).slice(0, Math.max(1, adet || 3));
    var cumle = ornekler.length
      ? '<div class="pn-ornek">' + ornekler.map(function (c) {
          return '<div class="pn-cumle">' +
            '<div class="pn-car">' + esc(c.ar) + '</div>' +
            '<div class="pn-ctr">' + esc(c.tr) +
            (c.kaynak ? '<span class="pn-kaynak">' + esc(c.kaynak) + '</span>' : '') +
            '</div></div>';
        }).join('') + '</div>'
      : '';

    return '<div class="pn-afis" id="pnAfis" style="--renk:' + esc(p.renk) +
      ';--acik12:' + tint(p.renk, .12) + ';--acik8:' + tint(p.renk, .08) + '">' +
      '<div class="pn-bant">' +
        '<div class="pn-gun">' + esc(p.ad) + '</div>' +
        '<div class="pn-tarih">' + esc(p.tarih) + '</div>' +
      '</div>' +
      '<div class="pn-ic">' +
        '<p class="pn-uste">Bu günün kökü</p>' +
        '<div class="pn-kokkutu">' + harfler + '</div>' +
        '<div class="pn-kokalt">üç harf · bir anlam ailesi</div>' +
        '<div class="pn-turev">' + satir + '</div>' +
        cumle +
        '<p class="pn-not">' + esc(p.not || '') + '</p>' +
      '</div>' +
      '<div class="pn-alt"><span>kidefarapca.com</span><span class="pn-cizgi"></span>' +
        '<span>Arapça</span></div>' +
    '</div>';
  }

  function sec(i) {
    if (!VERI.length) return;
    secili = Math.max(0, Math.min(VERI.length - 1, i));
    [].forEach.call(liste.querySelectorAll('button'), function (b) {
      b.setAttribute('aria-current', (+b.getAttribute('data-i') === secili) + '');
    });
    /* KAÇ ÖRNEK CÜMLE YAZILACAK
       İki istek yan yana duruyor: afişte olabildiğince çok örnek olsun,
       ama yazılar da olabildiğince iri olsun. İkisi birbirini çekiştiriyor
       — her cümle, kalan yazıyı küçültüyor. Uzlaşma: en çok örnekten
       başlanıyor, yazı boyu ESIK'in altına düşerse bir örnek eksiltilip
       yeniden bakılıyor. ESIK 0,72'de A3'te kök türevleri ~13 mm, örnek
       cümleler ~12 mm boyunda çıkıyor; panoda uzaktan rahat okunuyor.
       Kalabalık köklerde (5-6 türevli) iki örnek, gerisinde üç örnek
       yazılıyor. */
    var ESIK = 0.72;
    var p = VERI[secili], enIyi = null, enCok = Math.min(3, (p.cumleler || []).length) || 1;
    for (var adet = enCok; adet >= 1; adet--) {
      sahne.innerHTML = '<div class="pn-asili">' + afisHtml(p, adet) + '</div>';
      olcekle();
      var sk = sigdir();
      if (!enIyi || sk > enIyi.sk) enIyi = { adet: adet, sk: sk };
      if (sk >= ESIK) { enIyi = { adet: adet, sk: sk }; break; }
    }
    if (enIyi.adet !== adet) {          /* döngü en iyide bitmediyse yeniden çiz */
      sahne.innerHTML = '<div class="pn-asili">' + afisHtml(p, enIyi.adet) + '</div>';
      olcekle();
      sigdir();
    }
    try { history.replaceState(null, '', '#' + VERI[secili].id); } catch (e) { }
  }

  /* Afiş, panonun boş alanına sığacak kadar büyük olsun; "gerçek boyut"
     kipinde ise A3 eni (297 mm) kadar. */
  function olcekle() {
    var a = document.getElementById('pnAfis');
    if (!a) return;
    if (gercek) { a.style.setProperty('--ae', '297mm'); return; }
    /* Sahnenin İÇ ölçüsü (dolgu düşülmüş) alınmalı; yoksa afiş alta
       taşıp el yazısı not ile alt bant kırpılıyor. */
    var c = getComputedStyle(sahne);
    var yatayDolgu = parseFloat(c.paddingLeft) + parseFloat(c.paddingRight);
    var dikeyDolgu = parseFloat(c.paddingTop) + parseFloat(c.paddingBottom);
    var bosluk = 26;                       /* raptiye ve gölge payı */
    var en = Math.max(240, sahne.clientWidth - yatayDolgu - bosluk);
    var boy = Math.max(300, sahne.clientHeight - dikeyDolgu - bosluk);
    a.style.setProperty('--ae', Math.floor(Math.min(en, boy / 1.41421)) + 'px');
  }

  /* Afişin çerçevesi A3 oranında SABİT; içerik ona sığmak zorunda.
     Uzun el yazısı not ya da altı türevli bir kök taşırsa yazılar
     hep birlikte küçültülüyor (--sk). Bütün iç ölçüler --m = --ae * --sk
     üzerinden yazıldığı için bu oran ekranda da baskıda da aynı sonucu
     veriyor; afiş bir daha asla alttan kırpılmıyor. */
  function sigdir() {
    var a = document.getElementById('pnAfis');
    if (!a) return;
    var ic = a.querySelector('.pn-ic');
    if (!ic) return;
    /* Yazılar OLABİLDİĞİNCE İRİ olsun isteniyor; o yüzden ölçek yalnız
       küçültülmüyor, sığdığı yere kadar büyütülüyor de. Sığan en büyük
       değer ikili arama ile bulunuyor (12 adım ≈ binde bir hassasiyet).
       İçerik büyüdükçe boyu da büyüdüğü için arama güvenli. */
    var EN_KUCUK = 0.55, EN_BUYUK = 1.9;

    /* DİKKAT — ölçüm hilesi. İçerik kutusunda '.pn-cumle{margin-top:auto}'
       var; içerik kısa kalınca bu boşluk artan yeri yutuyor, yani
       scrollHeight her zaman clientHeight'a EŞİT çıkıyor. Sırf orana
       bakan bir karşılaştırma ("%1 payla sığıyor mu") bu yüzden hiçbir
       afişte doğru olmaz ve hepsi en küçük ölçeğe inerdi.
       Doğrusu: eşitlik = sığıyor, büyük = taşıyor. Baskıda satır
       kırılmaları biraz kayabildiği için de ölçüm sırasında alta
       geçici bir pay ekleniyor; pay varken taşmıyorsa gerçekten
       sığıyor demektir. */
    var sk = 1;
    var payPx = Math.round(a.getBoundingClientRect().height * 0.012);
    var eskiDolgu = ic.style.paddingBottom;
    var tabanDolgu = parseFloat(getComputedStyle(ic).paddingBottom) || 0;
    ic.style.paddingBottom = (tabanDolgu + payPx) + 'px';

    function sigiyorMu(deger) {
      a.style.setProperty('--sk', deger.toFixed(4));
      ic.style.paddingBottom = '';
      var taban = parseFloat(getComputedStyle(ic).paddingBottom) || 0;
      ic.style.paddingBottom = (taban + payPx) + 'px';
      return ic.scrollHeight <= ic.clientHeight;
    }

    var alt = EN_KUCUK, ust = EN_BUYUK;
    if (sigiyorMu(EN_BUYUK)) { alt = EN_BUYUK; }
    else {
      for (var n = 0; n < 12; n++) {
        var orta = (alt + ust) / 2;
        if (sigiyorMu(orta)) alt = orta; else ust = orta;
      }
    }
    sk = alt;
    a.style.setProperty('--sk', sk.toFixed(4));
    ic.style.paddingBottom = eskiDolgu;
    return sk;
  }

  var z = 0;
  window.addEventListener('resize', function () {
    clearTimeout(z); z = setTimeout(function () { olcekle(); sigdir(); }, 120);
  });

  /* ---------------- tuşlar ---------------- */
  tusGercek.onclick = function () {
    gercek = !gercek;
    document.body.classList.toggle('pn-gercek', gercek);
    tusGercek.classList.toggle('etkin', gercek);
    tusGercek.textContent = gercek ? 'Pano görünümü' : 'Gerçek boyut';
    olcekle();
    sigdir();
  };
  /* ------------- indirme -------------
     Afiş, A3 dikey tek sayfalık PDF olarak iniyor. Sayfa tam 297x420 mm
     (841,89 x 1190,55 punto), içine 2480 px enindeki görüntü tam sayfa
     yerleşiyor — yani ≈210 dpi. Yazıcıya "A3, ölçekleme yok" denince
     kenar boşluksuz, tam boy çıkıyor.

     NİYE html2canvas: afişteki her şey (harekeler, el yazısı not,
     renkli bantlar) sayfanın kendi yazı tipleriyle çiziliyor. SVG
     foreignObject yolunda yazı tiplerini tek tek gömmek gerekirdi;
     bu kütüphane sayfada YÜKLÜ olan yazı tipleriyle çizdiği için
     çıktı ekranda görünenin aynısı oluyor. Dosya yanına kopyalandı
     (pano/html2canvas.min.js) — internet olmadan da, dosyaya çift
     tıklayıp açınca da çalışsın diye.

     ÖLÇEK HİLESİ: klonda --ae sabit 1240 px'e çekiliyor. Bütün iç
     ölçüler --m = --ae * --sk üzerinden yazıldığı için afiş, ekranda
     ne kadar küçük görünürse görünsün, tam boyda ve doğru oranlarla
     çiziliyor; --sk'ya dokunmaya gerek yok.

     PDF NİYE ELDE YAPILIYOR: hazır bir PDF kütüphanesi (jsPDF vb.)
     tek başına ~350 KB daha yük demek ve yaptığı iş tam olarak
     aşağıdaki: tek sayfa, içine bir JPEG. PDF'in JPEG'i olduğu gibi
     kabul eden bir yolu var (/DCTDecode), o yüzden dosyayı kendimiz
     kuruyoruz — ek kütüphane yok, çıktı her okuyucuda açılıyor. */
  var KAYNAK_EN = 1240, HEDEF_EN = 2480;
  var A3_EN = 841.89, A3_BOY = 1190.55;   /* 297 x 420 mm, punto */
  var JPEG_KALITE = 0.95;

  function kutuphane(bitti, olmadi) {
    if (window.html2canvas) { bitti(); return; }
    var e = document.createElement('script');
    e.src = 'pano/html2canvas.min.js?v=1';
    e.onload = function () { window.html2canvas ? bitti() : olmadi(); };
    e.onerror = olmadi;
    document.head.appendChild(e);
  }

  /* Dosya adı: Türkçe harfler bazı sistemlerde bozuk iniyor. */
  function sade(t) {
    var a = 'çğıöşüÇĞİÖŞÜâîû', b = 'cgiosuCGIOSUaiu', o = '';
    for (var i = 0; i < t.length; i++) {
      var n = a.indexOf(t[i]);
      o += n < 0 ? t[i] : b[n];
    }
    return o.replace(/[^\w .·()-]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /* ---- elde PDF: tek sayfa, içinde tam sayfa JPEG ----
     PDF'te her nesnenin dosya içindeki BAYT konumu xref tablosuna
     yazılıyor; o yüzden parçalar bayt bayt birleştiriliyor, metin
     birleştirip sonradan kodlamak konumları kaydırırdı. */
  function pdfKur(jpegBaytlar, en, boy) {
    var parca = [], uzunluk = 0, konum = [];

    function ekle(x) {
      var d = (typeof x === 'string') ? metniBayta(x) : x;
      parca.push(d); uzunluk += d.length;
    }
    function metniBayta(t) {
      var d = new Uint8Array(t.length);
      for (var i = 0; i < t.length; i++) d[i] = t.charCodeAt(i) & 0xFF;
      return d;
    }
    function nesne(no, govde, akis) {
      konum[no] = uzunluk;
      ekle(no + ' 0 obj\n' + govde + '\n');
      if (akis) { ekle('stream\n'); ekle(akis); ekle('\nendstream\n'); }
      ekle('endobj\n');
    }

    ekle('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    nesne(1, '<< /Type /Catalog /Pages 2 0 R >>');
    nesne(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    nesne(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' +
             A3_EN + ' ' + A3_BOY + '] /Resources << /XObject << /R0 4 0 R >> >>' +
             ' /Contents 5 0 R >>');
    nesne(4, '<< /Type /XObject /Subtype /Image /Width ' + en + ' /Height ' + boy +
             ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' +
             jpegBaytlar.length + ' >>', jpegBaytlar);
    /* görüntüyü sayfanın tamamına yay */
    var icerik = 'q\n' + A3_EN + ' 0 0 ' + A3_BOY + ' 0 0 cm\n/R0 Do\nQ\n';
    nesne(5, '<< /Length ' + icerik.length + ' >>', metniBayta(icerik));

    var xref = uzunluk;
    var t = 'xref\n0 6\n0000000000 65535 f \n';
    for (var i = 1; i <= 5; i++) {
      t += ('0000000000' + konum[i]).slice(-10) + ' 00000 n \n';
    }
    t += 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
    ekle(t);

    var hepsi = new Uint8Array(uzunluk), n = 0;
    parca.forEach(function (d) { hepsi.set(d, n); n += d.length; });
    return new Blob([hepsi], { type: 'application/pdf' });
  }

  /* data:image/jpeg;base64,... -> bayt dizisi */
  function baytlar(veriUrl) {
    var ham = atob(veriUrl.split(',')[1]);
    var d = new Uint8Array(ham.length);
    for (var i = 0; i < ham.length; i++) d[i] = ham.charCodeAt(i);
    return d;
  }

  function indir() {
    var a = document.getElementById('pnAfis');
    if (!a || tusIndir.disabled) return;
    var p = VERI[secili];
    var eskiYazi = indirYazi.textContent;
    tusIndir.disabled = true;
    indirYazi.textContent = 'Hazırlanıyor…';

    function bitir(yazi) {
      tusIndir.disabled = false;
      indirYazi.textContent = yazi || eskiYazi;
      if (yazi) setTimeout(function () { indirYazi.textContent = eskiYazi; }, 4000);
    }

    kutuphane(function () {
      window.html2canvas(a, {
        backgroundColor: '#ffffff',
        scale: HEDEF_EN / KAYNAK_EN,
        useCORS: true,
        logging: false,
        width: KAYNAK_EN,
        height: Math.round(KAYNAK_EN * 1.41421),
        windowWidth: KAYNAK_EN + 200,
        onclone: function (belge) {
          var k = belge.getElementById('pnAfis');
          if (!k) return;
          k.style.setProperty('--ae', KAYNAK_EN + 'px');
          k.style.boxShadow = 'none';
          var as = k.closest ? k.closest('.pn-asili') : null;
          if (as) as.style.transform = 'none';          /* eğikliği düzelt */
          var sa = belge.getElementById('pnSahne');
          if (sa) { sa.style.padding = '0'; sa.style.background = '#fff'; }
        }
      }).then(function (tuval) {
        var ad = sade(p.ad) + ' - Bu Gunun Koku (A3).pdf';
        var belge = pdfKur(baytlar(tuval.toDataURL('image/jpeg', JPEG_KALITE)),
                           tuval.width, tuval.height);
        var u = URL.createObjectURL(belge);
        var b = document.createElement('a');
        b.href = u; b.download = ad;
        document.body.appendChild(b); b.click(); b.remove();
        setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
        bitir();
      }).catch(function () {
        bitir('Olmadı, yazdırmayı dene');
      });
    }, function () {
      /* kütüphane gelmediyse hiç değilse baskı penceresi açılsın */
      bitir();
      window.print();
    });
  }

  tusIndir.onclick = indir;

  document.addEventListener('keydown', function (e) {
    if (e.target && /input|textarea/i.test(e.target.tagName)) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { sec(secili + 1); e.preventDefault(); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { sec(secili - 1); e.preventDefault(); }
  });

  /* ---------------- kurulum ---------------- */
  listeCiz();
  var h = (location.hash || '').replace('#', '');
  var i = 0;
  VERI.forEach(function (p, n) { if (p.id === h) i = n; });
  sec(i);
})();
