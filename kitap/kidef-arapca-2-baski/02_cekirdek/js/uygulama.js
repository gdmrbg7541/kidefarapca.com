/* ============================================================
   Kidef Arapça — FLIPBOOK UYGULAMA KATMANI
   Hotspot'lar, zoom/pan, paneller (sunum • video • cevap • etkinlik),
   içindekiler, arama, klavye.
   ============================================================ */
(function () {
  'use strict';

  var K = window.KITAP;
  var $ = function (s) { return document.querySelector(s); };

  if (!K) {
    document.body.insertAdjacentHTML('afterbegin',
      '<div style="padding:60px 24px;text-align:center;font-size:14px;line-height:1.7">' +
      '<b style="font-size:17px">Kitap verisi yüklenemedi</b><br>' +
      '<span style="color:#9FB0CC">03_veri/kitap.js bulunamadı. ' +
      '_araclar/02_kitap_json.py çalıştırılmalı.</span></div>');
    return;
  }

  /* ---------- kısayollar ---------- */
  var simgeHar = {};
  K.simgeler.forEach(function (s) { simgeHar[s.kod] = s; });

  function dersBul(no) {
    var bul = null;
    K.dersler.forEach(function (d) { if (no >= d.sayfa && no <= d.bitis) bul = d; });
    return bul;
  }

  function uretilmis(no) { return K.uretilmisSayfalar.indexOf(no) >= 0; }

  /* ---------- tost ---------- */
  var tostZ;
  function tost(m) {
    var t = $('#tost');
    t.textContent = m;
    t.classList.add('gor');
    clearTimeout(tostZ);
    tostZ = setTimeout(function () { t.classList.remove('gor'); }, 2600);
  }

  /* ============================================================
     PANELLER
     ============================================================ */
  var acikPanel = null;

  function panelAc(sec) {
    panelKapat(true);
    var p = $(sec);
    p.classList.add('acik');
    p.setAttribute('aria-hidden', 'false');
    $('#perde').classList.add('acik');
    acikPanel = p;
    flip.kilitli = true;
    // odağı panele al: iframe'li panelde bile klavye kısayolları çalışsın
    var kp = p.querySelector('[data-kapat]');
    if (kp) setTimeout(function () { kp.focus({ preventScroll: true }); }, 60);
  }

  // iframe içindeki alıştırmadan gelen mesajlar (Escape vb.)
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.kidef !== 'kapat') return;
    panelKapat();
  });

  /* Sitedeki sozluk.html çerçeve içindeyken kapanmak için
     window.parent.SozlukPop.kapat() çağırır (sitede index.html bunu sağlar).
     Flipbook aynı arayüzü sunar — böylece sözlük HİÇ değiştirilmeden çalışır. */
  window.SozlukPop = { kapat: function () { panelKapat(); } };

  function panelKapat(sessiz) {
    if (acikPanel) {
      acikPanel.classList.remove('acik');
      acikPanel.setAttribute('aria-hidden', 'true');
      acikPanel = null;
    }
    if (!sessiz) $('#perde').classList.remove('acik');
    else $('#perde').classList.remove('acik');
    var v = $('#videoOyn');
    if (v && !v.paused) v.pause();
    // Alıştırma/araç çerçevesini boşalt: sesli oyunlar ve zamanlayıcılar
    // panel kapandıktan sonra arkada çalışmaya devam etmesin.
    // (Sözlük çerçevesi bilerek canlı bırakılır — arama ve favoriler korunsun.)
    var ec = $('#etkinlikCerceve');
    if (ec && ec.getAttribute('src') && ec.getAttribute('src') !== 'about:blank') {
      ec.setAttribute('src', 'about:blank');
    }
    flip.kilitli = false;
    // odağı ana belgeye geri al — iframe'li panel kapandıktan sonra
    // klavye kısayolları çalışmaya devam etsin
    if (!sessiz) { var s = $('#sahne'); if (s) s.focus({ preventScroll: true }); }
  }

  document.querySelectorAll('[data-kapat]').forEach(function (b) {
    b.addEventListener('click', function () { panelKapat(); });
  });
  $('#perde').addEventListener('click', function () { panelKapat(); });

  /* ============================================================
     SUNUM OYNATICI
     ============================================================ */
  var sunum = { klasor: null, adet: 0, i: 1 };

  /* PDF yolu FLIPBOOK'a göre göreli; emoji/Türkçe harf/?/# için parça parça kodlanır */
  function pdfAdres(yol) { return yol.split('/').map(encodeURIComponent).join('/'); }
  /* SUNU = PDF, YENİ SEKMEDE (kullanıcı kararı 01.10.2026). Sununun PDF'i varsa
     damgaya/karta basınca doğrudan yeni sekmede açılır; uygulama içi slayt
     gösterici yalnız PDF'i olmayan deste için ya da "Slaytları burada göster"le açılır. */
  /* PDF'ler yalnız bilgisayardaki kopyada var (../1. Knlr/…). Sitede (http/https)
     asıl PDF'ler yok (~1 GB) → sunu yine YENİ SEKMEDE, sunum.html gösterici ile açılır. */
  var PDF_VAR = location.protocol === 'file:';
  /* Sunu her yerde sunum.html ile açılır (kullanıcı kararı 01.10.2026): slayt tam ekran,
     düğmeler üstünde. Asıl PDF bilgisayarda gösterici içindeki "PDF" düğmesiyle (&p=). */
  function sunumAdres(k) {
    /* 05.10.2026 — öğretmen: "HTML'ye çevirdiğimiz PDF sunumlar siyah renkte
       açılıyor ve kaymalar olabiliyor, PDF'e dönelim."
       Ölçüldü: sunum.html'de sahne background:#000, slayt çizilemezse siyah
       görünüyor; ayrıca çevirici kendi başlığında yazıyor ki yazı tipleri
       PowerPoint'inkiler olmadığı için satırlar taşıyor ve yazı %14'e kadar
       küçültülüp sığdırılıyor. PDF'te yazı tipleri gömülü olduğu için ikisi
       de olmaz.

       Üç kademe:
         1. k.pdf + file://  → asıl PDF (bilgisayardaki kopya, tam kalite)
         2. k.sitePdf        → sitedeki sıkıştırılmış PDF (ders sunuları)
         3. yoksa            → sunum.html göstericisi (oyun slaytları)
       Siteye yalnız ders sunuları konuyor (öğretmenin kararı): oyun
       slaytları 865 MB ve sınıfta kendi bilgisayarından açılıyor. */
    if (k.pdf && PDF_VAR) return pdfAdres(k.pdf);
    if (k.sitePdf) return pdfAdres(k.sitePdf);
    var q = { d: k.klasor, n: k.adet, a: k.ad };
    return 'sunum.html?' + new URLSearchParams(q);
  }
  function sunumAc(k, icerde) {
    if (!icerde) {
      // 'noopener' özelliği verilirse window.open her zaman null döner; engel anlaşılmaz
      var w = window.open(sunumAdres(k), '_blank');
      if (w) { try { w.opener = null; } catch (e) {} }
      else sunumAc(k, true);   // açılır pencere engellendiyse içeride göster
      return;
    }
    // 02.10.2026: içeride de aynı gösterici (sunum.html) çerçevede açılır — HTML sunu varsa
    // onu (adımlı), yoksa resimleri gösterir. Eski resim oynatıcısı (#pSunum) yalnız yedek.
    if (k.klasor && /^05_sunumlar\//.test(k.klasor)) {
      $('#etkinlikBaslik').textContent = k.ad;
      panelAc('#pEtkinlik');
      $('#etkinlikCerceve').setAttribute('src', sunumAdres(k));
      return;
    }
    sunum.klasor = k.klasor; sunum.adet = k.adet; sunum.i = 1;
    $('#sunumBaslik').textContent = k.ad;
    var pa = $('#sunumPdf');
    if (pa) { pa.hidden = !(k.pdf && PDF_VAR); if (k.pdf && PDF_VAR) pa.href = pdfAdres(k.pdf); }
    $('#slaytKaydirac').max = k.adet;
    panelAc('#pSunum');
    slaytGoster(1);
  }

  function slaytGoster(i) {
    i = Math.max(1, Math.min(sunum.adet, i));
    sunum.i = i;
    var n = ('00' + i).slice(-3);
    $('#slaytGorsel').src = sunum.klasor + '/' + n + '.webp';
    $('#slaytSayac').textContent = i + ' / ' + sunum.adet;
    var kd = $('#slaytKaydirac');
    kd.value = i;
    kd.style.setProperty('--dolu', ((i - 1) / Math.max(1, sunum.adet - 1) * 100) + '%');
    $('#slaytGeri').disabled = i <= 1;
    $('#slaytIleri').disabled = i >= sunum.adet;
    // komşu slaytları önceden indir
    [i + 1, i + 2].forEach(function (j) {
      if (j <= sunum.adet) { var im = new Image(); im.src = sunum.klasor + '/' + ('00' + j).slice(-3) + '.webp'; }
    });
  }

  $('#slaytGeri').addEventListener('click', function () { slaytGoster(sunum.i - 1); });
  $('#slaytIleri').addEventListener('click', function () { slaytGoster(sunum.i + 1); });
  $('#slaytKaydirac').addEventListener('input', function () { slaytGoster(+this.value); });
  $('#slaytTamEkran').addEventListener('click', function () {
    var a = $('#pSunum');
    if (document.fullscreenElement) document.exitFullscreen();
    else if (a.requestFullscreen) a.requestFullscreen();
  });

  /* ============================================================
     CEVAP ANAHTARI
     ============================================================ */
  var cevap = { klasor: null, adet: 0, i: 1 };

  function cevapAc(k) {
    cevap.klasor = k.klasor; cevap.adet = k.adet; cevap.i = 1;
    $('#cevapBaslik').textContent = k.ad;
    /* Sayfaya bindirme yalnız cevap anahtarı YENİ baskının sayfa düzeninde hazırlandıysa
       anlamlı (kaynakta "bindir": true). Eldeki anahtarlar (Mazi, Muzari, Emir, Kalıplar
       Tablosu) eski baskının düzeninde: yeni sayfalara oturmuyor, üst üste binen iki
       metin öğrenciyi yanıltır (22.09.2026 karşılaştırması). Panelde okunur. */
    $('#cevapBindir').hidden = !k.bindir;
    var serit = $('#cevapSerit');
    serit.innerHTML = '';
    for (var i = 1; i <= k.adet; i++) {
      (function (j) {
        var b = document.createElement('button');
        b.innerHTML = '<img src="' + k.klasor + '/' + ('0' + j).slice(-2) + '.webp" alt="' + j + '">';
        b.title = j + '. sayfa';
        b.addEventListener('click', function () { cevapGoster(j); });
        serit.appendChild(b);
      })(i);
    }
    panelAc('#pCevap');
    cevapGoster(1);
  }

  function cevapGoster(i) {
    cevap.i = i;
    $('#cevapGorsel').src = cevap.klasor + '/' + ('0' + i).slice(-2) + '.webp';
    $('#cevapSerit').querySelectorAll('button').forEach(function (b, j) {
      b.classList.toggle('simdi', j + 1 === i);
    });
  }

  /* cevabı kitap sayfasının üstüne bindir */
  var bindirmeAcik = false;
  $('#cevapBindir').addEventListener('click', function () {
    var url = cevap.klasor + '/' + ('0' + cevap.i).slice(-2) + '.webp';
    bindirmeUygula(url);
    panelKapat();
    tost('Cevap sayfaya bindirildi — saydamlığı alt çubuktan ayarla');
  });

  function bindirmeUygula(url) {
    bindirmeKaldir();
    var yuz = aktifYuz();
    if (!yuz) { tost('Bindirme için sayfa bulunamadı'); return; }
    var k = document.createElement('div');
    k.className = 'cevap-bindirme';
    k.id = 'bindirmeKatmani';
    k.style.backgroundImage = 'url("' + url + '")';
    k.style.opacity = 0.55;
    yuz.appendChild(k);
    bindirmeAcik = true;
    bindirmeCubuguGoster();
  }

  function bindirmeKaldir() {
    var v = document.getElementById('bindirmeKatmani');
    if (v) v.remove();
    var c = document.getElementById('bindirmeCubugu');
    if (c) c.remove();
    bindirmeAcik = false;
  }

  function bindirmeCubuguGoster() {
    if (document.getElementById('bindirmeCubugu')) return;
    var d = document.createElement('div');
    d.id = 'bindirmeCubugu';
    d.className = 'bindirme';
    d.style.cssText = 'position:fixed;left:50%;bottom:74px;transform:translateX(-50%);z-index:46;' +
      'background:rgba(16,26,46,.9);backdrop-filter:blur(10px);color:#D6DEEC;padding:9px 16px;' +
      'border-radius:99px;box-shadow:0 10px 30px rgba(0,0,0,.35)';
    d.innerHTML = '<span>Cevap saydamlığı</span>' +
      '<input type="range" min="0" max="100" value="55" id="bindirmeAyar">' +
      '<button class="dg" style="padding:5px 12px;font-size:12px" id="bindirmeKapat">Kaldır</button>';
    document.body.appendChild(d);
    d.querySelector('#bindirmeAyar').addEventListener('input', function () {
      var v = document.getElementById('bindirmeKatmani');
      if (v) v.style.opacity = this.value / 100;
    });
    d.querySelector('#bindirmeKapat').addEventListener('click', bindirmeKaldir);
  }

  function aktifYuz() {
    var no = flip.aktif;
    return document.querySelector('.yuz[data-sayfa="' + no + '"]');
  }

  /* ============================================================
     VİDEO
     ============================================================ */
  function videoAc(v) {
    $('#videoBaslik').textContent = v.ad;
    var o = $('#videoOyn');
    o.src = v.dosya;
    panelAc('#pVideo');
    o.play().catch(function () { /* otomatik oynatma engellenebilir */ });
  }

  /* ============================================================
     ETKİNLİK
     ============================================================ */
  function etkinlikAc(e) {
    $('#etkinlikBaslik').textContent = e.ad;
    // SIRA ÖNEMLİ: önce panelAc — o, önceki paneli kapatırken alıştırma
    // çerçevesini about:blank'e sıfırlar. src ondan SONRA verilmeli.
    panelAc('#pEtkinlik');
    // Dosya adlarında boşluk ve Türkçe karakter var ("Dilbilgisi Konuları.html")
    $('#etkinlikCerceve').setAttribute('src', encodeURI(e.dosya));
  }

  /* ============================================================
     SÖZLÜK — sitedeki sozluk.html (530 kök · 5.269 türev · 1.297 kelime)
     ============================================================ */
  function sozlukAc(aranan) {
    var c = $('#sozlukCerceve');
    if (!c.getAttribute('src')) c.setAttribute('src', encodeURI(K.sozluk.dosya));
    panelAc('#pSozluk');
    // odağı sözlüğün arama kutusuna ver (çerçeve aynı kökenden)
    var dene = 0;
    (function odak() {
      try {
        var d = c.contentDocument;
        var inp = d && d.querySelector('input[type=search],input[type=text]');
        if (inp) {
          if (aranan != null) {
            inp.value = aranan;
            inp.dispatchEvent(new Event('input', { bubbles: true }));
          }
          inp.focus();
          return;
        }
      } catch (err) { return; }   // farklı köken (web'de) — sessizce geç
      if (++dene < 30) setTimeout(odak, 100);
    })();
  }
  $('#tSozluk').addEventListener('click', function () {
    if (acikPanel === $('#pSozluk')) { panelKapat(); return; }
    sozlukAc();
  });

  /* ============================================================
     ARAÇLAR — sitedeki oyun ve çalışmaların kopyaları (07_araclar/)
     ============================================================ */
  var katHar = {};
  (K.aracKategorileri || []).forEach(function (k) { katHar[k.kod] = k; });

  function aracListesiKur(filtre) {
    var l = $('#aracListe');
    l.innerHTML = '';
    var f = (filtre || '').trim().toLocaleLowerCase('tr');
    var sayi = 0;
    (K.aracKategorileri || []).forEach(function (kat) {
      var liste = (K.araclar || []).filter(function (a) {
        if (a.kategori !== kat.kod) return false;
        if (!f) return true;
        return (a.ad + ' ' + a.aciklama + ' ' + kat.ad).toLocaleLowerCase('tr').indexOf(f) >= 0;
      });
      if (!liste.length) return;
      var g = document.createElement('div');
      g.className = 'unite';
      g.innerHTML = '<h3><span style="color:' + kat.renk + '">' + kat.simge + '</span> ' + kat.ad + '</h3>';
      var kutu = document.createElement('div');
      kutu.className = 'kaynaklar';
      liste.forEach(function (a) {
        sayi++;
        var b = document.createElement('button');
        b.className = 'kaynak';
        b.innerHTML = '<span class="ik" style="background:' + kat.renk + '1A;color:' + kat.renk + '">' +
          kat.simge + '</span><span class="mt"><b>' + a.ad + '</b><small>' + a.aciklama + '</small></span>';
        b.addEventListener('click', function () {
          if (a.dosya === K.sozluk.dosya) sozlukAc(); else etkinlikAc(a);
        });
        kutu.appendChild(b);
      });
      g.appendChild(kutu);
      l.appendChild(g);
    });
    if (!sayi) l.innerHTML = '<div class="bos-sonuc">Araç bulunamadı.</div>';
  }
  aracListesiKur();
  $('#aracAra').addEventListener('input', function () { aracListesiKur(this.value); });
  $('#tAraclar').addEventListener('click', function () {
    if (acikPanel === $('#pAraclar')) { panelKapat(); return; }
    panelAc('#pAraclar');
    setTimeout(function () { $('#aracAra').focus(); }, 260);
  });

  /* ============================================================
     SAYFA KAYNAKLARI
     ============================================================ */
  function sayfaKaynaklari(no) {
    var d = dersBul(no);
    if (!d || !d.kaynak) return null;
    return K.kaynaklar[d.kaynak] || null;
  }

  /* Bir dersin sunuları: tek nesne (Mazi pilotu) ya da liste (_araclar/04_sunum_uret.py).
     Listedeki her deste `sayfa` taşır: o sayfadaki "Ders/Etkinlik Sunusu" damgası onu
     açar (ör. s.27 → 1. oyun, s.28 → 2. oyun). Aynı damgaya birden çok deste düşerse
     (İkiki'nin 4 renk destesi, Türemiş Fiiller'in 4 bölümü) kaynak paneli seçtirir. */
  function sunumlar(k) {
    if (!k || !k.sunum) return [];
    return Array.isArray(k.sunum) ? k.sunum : [k.sunum];
  }
  function sayfaSunumu(k, no) {
    var l = sunumlar(k);
    var bu = l.filter(function (s) { return s.sayfa === no; });
    if (bu.length === 1) return bu[0];
    return l.length === 1 ? l[0] : null;
  }

  /* Kütüphane simgeleri — çubuktakilerin aynısı (02.10.2026) */
  var KTP_IK = {
    sunu: '<svg class="ktp-ik ik-sunu" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="4" width="17.6" height="11.6" rx="2"/><path d="M12 15.6v2.7M8.5 20.8 12 18.3l3.5 2.5"/><path class="ik-oyna" d="M10.5 7.4 15 9.8l-4.5 2.4Z"/></svg>',
    belge: '<svg class="ktp-ik ik-pdf" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 2.8H7.4A2.1 2.1 0 0 0 5.3 4.9v14.2a2.1 2.1 0 0 0 2.1 2.1h9.2a2.1 2.1 0 0 0 2.1-2.1V7.4Z"/><path class="ik-kivrim" d="M14.2 2.8v4.6h4.5Z"/><path d="M8.2 10.5h5.4"/><rect class="ik-bant" x="8" y="13.4" width="8" height="4.6" rx="1.2"/></svg>'
  };

  /* ---------- çıktı alınabilir belgeler (02.10.2026) ----------
     Dersin A4 çıktılıkları: 03_veri/belgeler.js → window.KITAP_BELGE.
     Kaynak slug'ıyla ya da (kaynağı olmayan dersler için) dersin İLK
     sayfasıyla eşleşir. Tıklayınca yeni sekmede açılır; tarayıcının PDF
     görüntüleyicisi hem yazdırır hem indirir. Sağdaki ok doğrudan indirir. */
  function belgeler(no) {
    var B = window.KITAP_BELGE;
    if (!B) return [];
    var d = dersBul(no), r = [];
    if (d && d.kaynak && B.kaynak && B.kaynak[d.kaynak]) r = r.concat(B.kaynak[d.kaynak]);
    if (d && B.sayfa && B.sayfa[String(d.sayfa)]) r = r.concat(B.sayfa[String(d.sayfa)]);
    return r;
  }
  function belgeBoyu(b) {
    if (!b) return '';
    return b >= 1048576 ? (b / 1048576).toFixed(1).replace('.', ',') + ' MB'
                        : Math.round(b / 1024) + ' KB';
  }

  function kaynakPaneliAc(no) {
    var k = sayfaKaynaklari(no);
    var liste = $('#kaynakListe');
    liste.innerHTML = '';
    var d = dersBul(no);
    $('#kaynakBaslik').textContent = d ? d.ad : no + '. sayfa';

    /* Kaynağı tanımlı olmasa da çıktılık belgesi olabilir (02.10.2026):
       ör. "Genel Bilgiler ve Harfler" s.6-14. O zaman panel boş sayılmaz. */
    if (!k && !belgeler(no).length) {
      liste.innerHTML = '<div class="bos-sonuc">Bu ders için dijital kaynak henüz eklenmedi.<br>' +
        '<small>Kaynaklar 03_veri/kitap.js içindeki <code>KAYNAKLAR</code> bölümünden tanımlanır.</small></div>';
      panelAc('#pKaynak');
      return;
    }
    function kart(ik, sinif, ad, alt, tik) {
      var b = document.createElement('button');
      b.className = 'kaynak';
      b.innerHTML = '<span class="ik ' + sinif + '">' + ik + '</span>' +
        '<span class="mt"><b>' + ad + '</b><small>' + alt + '</small></span>';
      b.addEventListener('click', tik);
      liste.appendChild(b);
    }
    k = k || {};
    sunumlar(k).forEach(function (s) {
      var oyun = /Oyun|Kartlar|Etkinlik/.test(s.ad);
      kart(oyun ? '🎯' : '🧐', 'i-teal', s.ad, s.adet + ' slayt · yeni sekmede tam ekran', function () { sunumAc(s); });
      if (true) {
        // kart sunuyu yeni sekmede açar; slaytlar flipbook içinde istenirse buradan
        var a = document.createElement('button');
        a.className = 'kaynak-pdf';
        a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/></svg>' +
          '<span>Slaytları burada göster</span><small>' + s.adet + ' slayt</small>';
        a.addEventListener('click', function () { sunumAc(s, true); });
        liste.appendChild(a);
      }
    });
    if (k.cevap) kart('✅', 'i-gold', k.cevap.ad, k.cevap.adet + ' sayfa · sayfaya bindirilebilir', function () { cevapAc(k.cevap); });
    (k.video || []).forEach(function (v) {
      kart('📺', 'i-coral', v.ad, 'Video', function () { videoAc(v); });
    });
    /* Dersin çıktılıkları — sunu/cevap kartlarının yanında (02.10.2026) */
    var bl = belgeler(no);
    if (bl.length) {
      var bas = document.createElement('div');
      bas.className = 'belge-bas';
      bas.innerHTML = '<b>Çıktı alınabilir belgeler</b><small>' + bl.length +
        ' belge · yazdırmak için aç, indirmek için oka bas</small>';
      liste.appendChild(bas);
      bl.forEach(function (x) {
        var sat = document.createElement('div');
        sat.className = 'belge';
        /* 'yatay' = A4/A3 yatay tablo; yazıcıyı ona göre kurmak gerekiyor */
        var alt = [x.n ? x.n + ' sayfa' : '', x.y ? 'yatay' : '', belgeBoyu(x.b), 'PDF']
          .filter(Boolean).join(' · ');
        sat.innerHTML =
          '<button type="button" class="belge-ac">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2.5H7A2 2 0 0 0 5 4.5v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5Z"/>' +
          '<path d="M14 2.5v5h5"/><path d="M8.5 13h7M8.5 16.5h4.5"/></svg>' +
          '<span class="mt"><b></b><small></small></span></button>' +
          '<a class="belge-indir" download title="İndir" aria-label="İndir">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v11"/>' +
          '<polyline points="7.5 10 12 14.5 16.5 10"/><path d="M4.5 17v2.5h15V17"/></svg></a>';
        sat.querySelector('.belge-ac b').textContent = x.a;
        sat.querySelector('.belge-ac small').textContent = alt;
        var a = sat.querySelector('.belge-indir');
        a.setAttribute('href', x.d);
        sat.querySelector('.belge-ac').addEventListener('click', function () {
          var w = window.open(x.d, '_blank');
          if (w) { try { w.opener = null; } catch (e) {} }
          else tost('Tarayıcı yeni sekmeyi engelledi — indirme okunu kullanabilirsin');
        });
        liste.appendChild(sat);
      });
    }

    (k.etkinlik || []).forEach(function (e) {
      // sitedeki araçlar açıklama ve kategori taşır; flipbook alıştırmaları taşımaz
      var kat = e.kategori && katHar[e.kategori];
      var ik = kat ? kat.simge : '🦾';
      var alt = e.aciklama ? e.aciklama + ' · kidefarapca.com' : 'Etkileşimli alıştırma';
      kart(ik, 'i-violet', e.ad, alt, function () {
        if (K.sozluk && e.dosya === K.sozluk.dosya) sozlukAc(); else etkinlikAc(e);
      });
    });
    panelAc('#pKaynak');
  }

  /* ============================================================
     KÜTÜPHANE — KİTAPTAN BAĞIMSIZ DOLAŞMA           (02.10.2026)
     Öğretmen isteği: "öğretmen isterse kitaptan bağımsız şekilde
     kütüphane gibi dolaşabilmeli." Üst çubuktaki iki düğme (Sunular
     / Çıktılar) aynı iki sekmeli paneli açar. Liste ünite → ders
     sırasında; veri yeni değil: K.kaynaklar[...].sunum ve
     window.KITAP_BELGE okunur.
     ============================================================ */
  var ktpTur = 'sunu';

  function ktpKucuk(t) { return String(t).toLocaleLowerCase('tr'); }

  function dersSunulari(d) {
    return sunumlar(d && d.kaynak ? K.kaynaklar[d.kaynak] : null);
  }

  /* [{unite, dersler:[{ders, oge:[...]}]}] — aynı öğe iki derse düşerse
     yalnız ilkinde görünür (liste tekrarlı olmasın). */
  function ktpVeri(tur) {
    var gor = {}, g = [];
    K.uniteler.forEach(function (u) {
      var dl = [];
      K.dersler.forEach(function (d) {
        if (d.unite !== u.no) return;
        var oge = (tur === 'sunu' ? dersSunulari(d) : belgeler(d.sayfa))
          .filter(function (x) {
            var a = tur === 'sunu' ? x.klasor : x.d;
            if (gor[a]) return false;
            gor[a] = 1; return true;
          });
        if (oge.length) dl.push({ ders: d, oge: oge });
      });
      if (dl.length) g.push({ unite: u, dersler: dl });
    });
    return g;
  }

  function ktpSayilar() {
    var s = { sunu: 0, slayt: 0, belge: 0, sayfa: 0, boyut: 0 };
    ktpVeri('sunu').forEach(function (u) {
      u.dersler.forEach(function (d) {
        d.oge.forEach(function (x) { s.sunu++; s.slayt += x.adet || 0; });
      });
    });
    ktpVeri('belge').forEach(function (u) {
      u.dersler.forEach(function (d) {
        d.oge.forEach(function (x) { s.belge++; s.sayfa += x.n || 0; s.boyut += x.b || 0; });
      });
    });
    return s;
  }

  function ktpSayi(n) { return n.toLocaleString ? n.toLocaleString('tr') : String(n); }

  function ktpSatir(x, ders) {
    var sat = document.createElement('div');
    if (ktpTur === 'sunu') {
      sat.className = 'ktp-sat sunu';
      sat.innerHTML =
        '<button type="button" class="ktp-ac">' + KTP_IK.sunu +
        '<span class="mt"><b></b><small></small></span></button>' +
        '<button type="button" class="ktp-ek" title="Slaytları burada göster" ' +
        'aria-label="Slaytları burada göster">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="12" rx="2"/>' +
        '<path d="M8 21h8M12 17v4"/></svg></button>';
      sat.querySelector('.ktp-ac b').textContent = x.ad;
      sat.querySelector('.ktp-ac small').textContent = x.adet + ' slayt · ' +
        (x.sayfa && x.sayfa !== ders.sayfa ? 's. ' + x.sayfa + ' · ' : '') +
        'yeni sekmede tam ekran';
      sat.querySelector('.ktp-ac').addEventListener('click', function () { sunumAc(x); });
      sat.querySelector('.ktp-ek').addEventListener('click', function () { sunumAc(x, true); });
    } else {
      /* .html çıktı sayfaları da aynı listeye girecek (tablolar HTML'e geçiyor) */
      var htm = /\.html?$/i.test(x.d);
      sat.className = 'ktp-sat belge';
      sat.innerHTML =
        '<button type="button" class="ktp-ac">' + KTP_IK.belge +
        '<span class="mt"><b></b><small></small></span></button>' +
        '<a class="ktp-ek" download title="İndir" aria-label="İndir">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v11"/>' +
        '<polyline points="7.5 10 12 14.5 16.5 10"/><path d="M4.5 17v2.5h15V17"/></svg></a>';
      sat.querySelector('.ktp-ac b').textContent = x.a;
      sat.querySelector('.ktp-ac small').textContent =
        [x.n ? x.n + ' sayfa' : '', x.y ? 'yatay' : '', belgeBoyu(x.b),
         htm ? 'Yazdırılabilir sayfa' : 'PDF'].filter(Boolean).join(' · ');
      sat.querySelector('.ktp-ek').setAttribute('href', x.d);
      sat.querySelector('.ktp-ac').addEventListener('click', function () {
        var w = window.open(x.d, '_blank');
        if (w) { try { w.opener = null; } catch (e) {} }
        else tost('Tarayıcı yeni sekmeyi engelledi — indirme okunu kullanabilirsin');
      });
    }
    return sat;
  }

  function ktpKur(filtre) {
    var l = $('#ktpListe');
    var f = ktpKucuk((filtre || '').trim());
    var fno = /^\d+$/.test(f) ? +f : 0;
    l.innerHTML = '';
    var say = 0;

    ktpVeri(ktpTur).forEach(function (grup) {
      var dl = [];
      grup.dersler.forEach(function (d) {
        var oge = d.oge.filter(function (x) {
          if (!f) return true;
          var ad = ktpKucuk(ktpTur === 'sunu' ? x.ad : x.a);
          return ad.indexOf(f) >= 0 ||
                 ktpKucuk(d.ders.ad).indexOf(f) >= 0 ||
                 ktpKucuk(grup.unite.ad).indexOf(f) >= 0 ||
                 (fno && fno >= d.ders.sayfa && fno <= d.ders.bitis);
        });
        if (oge.length) dl.push({ ders: d.ders, oge: oge });
      });
      if (!dl.length) return;

      var g = document.createElement('div');
      g.className = 'unite';
      g.innerHTML = '<h3></h3>';
      g.querySelector('h3').textContent = grup.unite.ad;
      dl.forEach(function (d) {
        var kutu = document.createElement('div');
        kutu.className = 'ktp-ders';
        kutu.innerHTML = '<button type="button" class="ktp-ders-bas" ' +
          'title="Kitabı bu derse götür"><span class="ad"></span>' +
          '<span class="sy">s. ' + d.ders.sayfa + '</span></button>';
        kutu.querySelector('.ad').textContent = d.ders.ad;
        kutu.querySelector('.ktp-ders-bas').addEventListener('click', function () {
          flip.git(d.ders.sayfa);
          panelKapat();
          if (!uretilmis(d.ders.sayfa)) tost(d.ders.ad + ' — bu sayfa henüz üretilmedi');
        });
        d.oge.forEach(function (x) { kutu.appendChild(ktpSatir(x, d.ders)); say++; });
        g.appendChild(kutu);
      });
      l.appendChild(g);
    });

    if (!say) {
      if (ktpTur === 'belge' && !window.KITAP_BELGE) {
        l.innerHTML = '<div class="bos-sonuc">Çıktılık belge listesi yüklenmedi.<br>' +
          '<small>03_veri/belgeler.js — <code>_araclar/11_belgeler.py</code> üretir.</small></div>';
      } else {
        l.innerHTML = '<div class="bos-sonuc">Sonuç bulunamadı.</div>';
      }
    }
  }

  function ktpSekmeGuncelle() {
    var s = ktpSayilar(), sn = ktpTur === 'sunu';
    $('#ktpSekmeSunu').classList.toggle('acik', sn);
    $('#ktpSekmePdf').classList.toggle('acik', !sn);
    $('#ktpSekmeSunu').setAttribute('aria-selected', sn ? 'true' : 'false');
    $('#ktpSekmePdf').setAttribute('aria-selected', sn ? 'false' : 'true');
    $('#ktpSayiSunu').textContent = s.sunu + ' deste · ' + ktpSayi(s.slayt) + ' slayt';
    $('#ktpSayiPdf').textContent = s.belge + ' belge · ' + ktpSayi(s.sayfa) + ' sayfa';
    $('#ktpBaslik').textContent = sn ? 'Sunu kütüphanesi' : 'Çıktı kütüphanesi';
    $('#ktpOzet').textContent = sn
      ? 'Bütün ders ve etkinlik sunuları — kitabın sayfasını açmaya gerek yok. Satıra bas, sunu yeni sekmede tam ekran açılır.'
      : 'Yazdırmaya hazır belgeler. Satıra bas, yeni sekmede açılır (oradan çıktı al); okla doğrudan indir.';
  }

  function ktpAc(tur) {
    if (acikPanel === $('#pKutuphane') && ktpTur === tur) { panelKapat(); return; }
    ktpTur = tur;
    ktpSekmeGuncelle();
    ktpKur($('#ktpAra').value);
    if (acikPanel !== $('#pKutuphane')) panelAc('#pKutuphane');
    setTimeout(function () { $('#ktpAra').focus(); }, 260);
  }

  function ktpSekme(tur) {
    ktpTur = tur;
    ktpSekmeGuncelle();
    ktpKur($('#ktpAra').value);
    $('#ktpListe').scrollTop = 0;
  }

  $('#tSunular').addEventListener('click', function () { ktpAc('sunu'); });
  $('#tBelgeler').addEventListener('click', function () { ktpAc('belge'); });
  $('#ktpSekmeSunu').addEventListener('click', function () { ktpSekme('sunu'); });
  $('#ktpSekmePdf').addEventListener('click', function () { ktpSekme('belge'); });
  $('#ktpAra').addEventListener('input', function () { ktpKur(this.value); });
  ktpSekmeGuncelle();

  /* ============================================================
     HOTSPOT KATMANI
     ============================================================ */
  function katmanKur(no, el) {
    el.innerHTML = '';
    var s = K.sayfa[String(no)];
    if (!s || !s.hotspot || !s.hotspot.length) return;
    var k = sayfaKaynaklari(no);

    /* KİTABIN TAMAMI ÜRETİLİNCE (231 sayfa, 200 çerçeve): altın çerçeve yalnız bir
       işe yarıyorsa çıkar. Kaynağı olmayan derste simge çerçevesi "henüz eklenmedi"
       paneline götürüyordu — öğrenci her sayfada boş panele düşerdi. Simgeler (s.3)
       ve İçindekiler (s.4) sayfasındaki simgeler yalnız liste, çerçeve almaz. */
    if (no <= 4) return;
    /* Aynı simge bir sayfada çok kez geçebilir (s.104'te 36 ⏱, alıştırma sayfalarında
       "Zamanı kaydet!" başına bir ⏱): hepsi aynı paneli açar, sayfayı çerçeveye boğmasın
       diye her simgeden yalnız ilki çerçeve alır. */
    var gorulen = {};
    s.hotspot.forEach(function (h) {
      var etiket = h.etiket;
      var is;

      if (h.tur === 'sunum') {
        var su = sayfaSunumu(k, no);
        if (su) { etiket = su.ad; is = function () { sunumAc(su); }; }
        else if (sunumlar(k).length) { etiket = 'Ders sunuları'; is = function () { kaynakPaneliAc(no); }; }
        else return;                                       /* sunusu olmayan derste çerçeve yok */
      } else if (h.alt === 'sozluk') {                     /* 📚 Sözlük Çalışması: sözlük her zaman hazır */
        etiket = h.simge + '  ' + h.etiket; is = function () { sozlukAc(); };
      } else {
        if (!k && !belgeler(no).length) return;            /* ne kaynak ne belge var */
        etiket = h.simge + '  ' + h.etiket;
        is = function () { kaynakPaneliAc(no); };
      }
      if (h.tur === 'simge') {
        if (gorulen[h.simge]) return;
        gorulen[h.simge] = 1;
      }
      var b = document.createElement('button');
      b.className = 'nokta nabiz';
      b.dataset.tur = h.tur;
      b.style.left = h.x + '%'; b.style.top = h.y + '%';
      b.style.width = h.w + '%'; b.style.height = h.h + '%';
      b.innerHTML = '<span class="ipucu">' + etiket + '</span>';
      b.setAttribute('aria-label', etiket);
      b.addEventListener('click', function (e) { e.stopPropagation(); is(); });
      el.appendChild(b);
    });
  }

  /* ============================================================
     FLIP MOTORU
     ============================================================ */
  var flip = new window.Flip($('#kaydir'), {
    toplam: K.toplamSayfa,
    oran: K.oran,
    gorselYolu: function (n) { return '01_sayfalar/' + ('00' + n).slice(-3) + '.webp'; },
    kucukYolu: function (n) { return '01_sayfalar/kucuk/' + ('00' + n).slice(-3) + '.webp'; },
    katmanKur: katmanKur,
    degisti: durumGuncelle
  });
  window.flip = flip;

  /* HTML sayfalar (s.1–7): 595 birimlik tuval sayfa genişliğine ölçeklenir;
     İçindekiler'deki satırlar (data-git) o sayfaya götürür. */
  function htmlOlcek() {
    var en = flip.sayfaEn || (flip.kitap && flip.kitap.clientWidth / 2) || 595;
    document.documentElement.style.setProperty('--hs', en / 595);
  }
  htmlOlcek();
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.html-sayfa [data-git]');
    if (!a) return;
    e.preventDefault(); e.stopPropagation();
    flip.git(+a.dataset.git);
  });

  function durumGuncelle(d) {
    var no = d.aktif;
    // tek sayfa modunda (telefon) yalnız görünen sayfa yazılır: "26 / 231"
    $('#sayfaEt').textContent = (!d.tekli && d.sol ? d.sol + '–' + (d.sag || '') : no) + ' / ' + K.toplamSayfa;
    var kd = $('#kaydiracInput');
    kd.value = no;
    kd.style.setProperty('--dolu', ((no - 1) / (K.toplamSayfa - 1) * 100) + '%');
    $('#okSol').disabled = d.ilk;
    $('#okSag').disabled = d.son;

    var ders = dersBul(no);
    $('#uniteEt').textContent = ders ? (ders.unite ? 'Ünite ' + ders.unite : 'Giriş') : 'Ünite —';
    var sim = ders && simgeHar[ders.simge] ? simgeHar[ders.simge].simge + ' ' : '';
    $('#dersEt').textContent = ders ? sim + ders.ad : '—';

    document.querySelectorAll('#tocListe .ders').forEach(function (b) {
      b.classList.toggle('simdi', ders && +b.dataset.sayfa === ders.sayfa);
    });
    if (bindirmeAcik) bindirmeKaldir();
  }

  /* ---------- gezinme kontrolleri ---------- */
  $('#okSol').addEventListener('click', function () { flip.geri(); });
  $('#okSag').addEventListener('click', function () { flip.ileri(); });
  $('#kaydiracInput').addEventListener('input', function () {
    var n = +this.value;
    this.style.setProperty('--dolu', ((n - 1) / (K.toplamSayfa - 1) * 100) + '%');
    $('#sayfaEt').textContent = n + ' / ' + K.toplamSayfa;
  });
  $('#kaydiracInput').addEventListener('change', function () { flip.git(+this.value); });
  $('#gitInput').addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var n = parseInt(this.value, 10);
    if (!n || n < 1 || n > K.toplamSayfa) { tost('1–' + K.toplamSayfa + ' arası bir sayfa yaz'); return; }
    if (!uretilmis(n)) tost(n + '. sayfa henüz üretilmedi');
    flip.git(n); this.blur();
  });

  /* ============================================================
     İÇİNDEKİLER + ARAMA
     ============================================================ */
  function tocKur(filtre) {
    var l = $('#tocListe');
    l.innerHTML = '';
    /* Türkçe küçük harf ("İsim" → "isim"); sayı yazılırsa o sayfayı İÇEREN ders de
       bulunur (150 → Kök-Kelime-Cümle, 136-166) */
    var kucuk = function (t) { return String(t).toLocaleLowerCase('tr'); };
    var f = kucuk((filtre || '').trim());
    var fno = /^\d+$/.test(f) ? +f : 0;
    var sayi = 0;

    K.uniteler.forEach(function (u) {
      var dl = K.dersler.filter(function (d) {
        if (d.unite !== u.no) return false;
        if (!f) return true;
        return kucuk(d.ad).indexOf(f) >= 0 ||
               kucuk(u.ad).indexOf(f) >= 0 ||
               String(d.sayfa).indexOf(f) === 0 ||
               (fno && fno >= d.sayfa && fno <= d.bitis);
      });
      if (!dl.length) return;
      var g = document.createElement('div');
      g.className = 'unite';
      g.innerHTML = '<h3>' + u.ad + '</h3>';
      var dd = document.createElement('div');
      dd.className = 'dersler';
      dl.forEach(function (d) {
        sayi++;
        var s = simgeHar[d.simge] || { simge: '•', ad: '' };
        var b = document.createElement('button');
        b.className = 'ders';
        b.dataset.sayfa = d.sayfa;
        // iki simgeli işaretler (🎯✊ takım, 🎯⚔ ikişerli oyun) küçük kutuya iki satır olup taşıyordu
        var cift = Array.from(String(s.simge).replace(/\uFE0F/g, '')).length > 1;
        b.innerHTML = '<span class="sim' + (cift ? ' cift' : '') + '" style="color:' + (s.renk || '#122040') + '">' + s.simge + '</span>' +
          '<span class="ad">' + d.ad + '</span><span class="sy">' + d.sayfa + '</span>';
        b.title = s.ad + ' · ' + d.sayfa + '–' + d.bitis + '. sayfa';
        b.addEventListener('click', function () {
          flip.git(d.sayfa);
          panelKapat();
          if (!uretilmis(d.sayfa)) tost(d.ad + ' — bu sayfa henüz üretilmedi');
        });
        dd.appendChild(b);
      });
      g.appendChild(dd);
      l.appendChild(g);
    });
    if (!sayi) l.innerHTML = '<div class="bos-sonuc">Sonuç bulunamadı.</div>';
  }
  tocKur();

  $('#tIcindekiler').addEventListener('click', function () {
    if (acikPanel === $('#pIcindekiler')) { panelKapat(); return; }
    panelAc('#pIcindekiler');
    setTimeout(function () { $('#aramaInput').focus(); }, 260);
  });
  $('#aramaInput').addEventListener('input', function () { tocKur(this.value); });

  /* ============================================================
     ZOOM & PAN — ORTAK MODÜL (02_cekirdek/js/kitapzoom.js)
     02.10.2026: Bu blok (6 bölge dokun-büyüt, yön tuşlarıyla gezinme,
     pinch, çift dokunma, imlece göre yakınlaştırma) ortak dosyaya
     taşındı; 5. ve 6. sınıf kitapları da aynı dosyayı kullanıyor.
     KODU BURADA DEĞİŞTİRME — ortak kaynak sitede
     _kaynak/ortak-kitap/kitapzoom.js; değişiklikten sonra
     _kaynak/uretici/kitapOrtakla.py bütün kitaplara kopyalar.
     ============================================================ */
  var kaydir = $('#kaydir'), sahne = $('#sahne');
  var Z = window.KitapZoom({
    sahne: sahne,
    kaydir: kaydir,
    flip: flip,
    panelAcik: function () { return !!acikPanel; },
    etiket: $('#zoomEt'),
    bilgi: $('#zoomBilgi'),
    yaklas: $('#tYaklas'),
    uzaklas: $('#tUzaklas'),
    yoksay: '.nokta,[data-git],.html-sayfa a'
  });

  /* ============================================================
     İPUÇLARI / TAM EKRAN
     ============================================================ */
  $('#tIpucu').addEventListener('click', function () {
    var kapali = document.body.classList.toggle('ipuclari-kapali');
    this.classList.toggle('aktif', !kapali);
    tost(kapali ? 'Tıklanabilir alanlar gizlendi' : 'Tıklanabilir alanlar gösteriliyor');
  });
  $('#tIpucu').classList.add('aktif');

  $('#tTamEkran').addEventListener('click', function () {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(function () {
      tost('Tarayıcı tam ekranı engelledi');
    });
  });

  /* ============================================================
     KLAVYE
     ============================================================ */
  document.addEventListener('keydown', function (e) {
    var k = e.key;
    // Escape her yerde çalışır — kaydıraç/kutu odaktayken bile
    if (k === 'Escape' && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) {
      e.target.blur();
    } else if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) {
      return;
    }
    if (acikPanel === $('#pSunum')) {
      if (k === 'ArrowRight' || k === ' ' || k === 'PageDown') { e.preventDefault(); slaytGoster(sunum.i + 1); return; }
      if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); slaytGoster(sunum.i - 1); return; }
      if (k === 'Home') { slaytGoster(1); return; }
      if (k === 'End') { slaytGoster(sunum.adet); return; }
    }
    if (k === 'Escape') {
      if (acikPanel) panelKapat();
      else if (Z.oran() > 1.02) Z.sifirla();
      else if (bindirmeAcik) bindirmeKaldir();
      return;
    }
    if (acikPanel) return;
    if (Z.tus(k)) { e.preventDefault(); return; }
    switch (k) {
      case 'ArrowRight': case 'PageDown': case ' ': e.preventDefault(); flip.ileri(); break;
      case 'ArrowLeft': case 'PageUp': e.preventDefault(); flip.geri(); break;
      case 'Home': flip.git(1); break;
      case 'End': flip.git(K.toplamSayfa); break;
      case '+': case '=': Z.ayarla(Z.oran() * 1.5); break;
      case '-': case '_': Z.ayarla(Z.oran() / 1.5); break;
      case '0': Z.sifirla(); break;
      case 'i': case 'I': case 'ı': $('#tIcindekiler').click(); break;
      case 's': case 'S': e.preventDefault(); sozlukAc(); break;
      case 'a': case 'A': e.preventDefault(); $('#tAraclar').click(); break;
      case 'u': case 'U': e.preventDefault(); ktpAc('sunu'); break;
      case 'b': case 'B': e.preventDefault(); ktpAc('belge'); break;
      case 'h': case 'H': $('#tIpucu').click(); break;
      case 'f': case 'F': $('#tTamEkran').click(); break;
      case 'k': case 'K': {
        /* Kaynağı olmasa da çıktılık belgesi varsa panel açılır (02.10.2026) */
        var kk = sayfaKaynaklari(flip.aktif);
        if (kk || belgeler(flip.aktif).length) kaynakPaneliAc(flip.aktif);
        else tost('Bu sayfada dijital kaynak yok');
        break;
      }
    }
  });

  /* ---------- yeniden boyutlandırma ---------- */
  var rz;
  window.addEventListener('resize', function () {
    clearTimeout(rz);
    rz = setTimeout(function () { flip.olcekle(); htmlOlcek(); Z.olcekle(); }, 120);
  });

  /* ---------- açılış ---------- */
  var basla = new URLSearchParams(location.search).get('s');
  flip.git(basla ? parseInt(basla, 10) : (K.uretilmisSayfalar[0] || 1));
  Z.uygula(true);

  setTimeout(function () {
    tost(flip.tekli ? 'Sayfayı sürükleyerek çevir · çift dokunarak yaklaş · altın çerçevelere tıkla'
      : 'Sayfayı sürükleyerek çevir · bir yere dokun, büyüsün · altın çerçevelere tıkla');
  }, 900);
})();
