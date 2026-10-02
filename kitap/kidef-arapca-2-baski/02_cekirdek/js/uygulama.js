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
    var q = { d: k.klasor, n: k.adet, a: k.ad };
    if (k.pdf && PDF_VAR) q.p = k.pdf;
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

  function kaynakPaneliAc(no) {
    var k = sayfaKaynaklari(no);
    var liste = $('#kaynakListe');
    liste.innerHTML = '';
    var d = dersBul(no);
    $('#kaynakBaslik').textContent = d ? d.ad : no + '. sayfa';

    if (!k) {
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
        if (!k) return;                                    /* bu derste dijital kaynak yok */
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
     ZOOM & PAN
     ============================================================ */
  var z = { o: 1, x: 0, y: 0 }, ENAZ = 1, ENCOK = 5;
  var kaydir = $('#kaydir'), sahne = $('#sahne');

  function zUygula(animasyonlu, yumusak) {
    kaydir.classList.toggle('serbest', !animasyonlu);
    kaydir.classList.toggle('yumusak', !!yumusak);         // yön tuşlarıyla ince kaydırma
    kaydir.style.transform = 'translate(' + z.x + 'px,' + z.y + 'px) scale(' + z.o + ')';
    $('#zoomEt').textContent = '%' + Math.round(z.o * 100);
    var zb = $('#zoomBilgi');
    zb.textContent = '%' + Math.round(z.o * 100) + ' — sürükleyerek gezin, ' +
      (flip.tekli ? 'çift dokunarak çık' : 'yön tuşlarıyla geç, dokununca küçülür');
    zb.classList.toggle('gor', z.o > 1.02);
    flip.kilitli = z.o > 1.02 || !!acikPanel;
  }

  function sinirla() {
    if (z.o <= 1.001) { z.x = 0; z.y = 0; return; }
    var r = sahne.getBoundingClientRect();
    var mx = (r.width * (z.o - 1)) / 2, my = (r.height * (z.o - 1)) / 2;
    z.x = Math.max(-mx, Math.min(mx, z.x));
    z.y = Math.max(-my, Math.min(my, z.y));
  }

  function zAyarla(yeni, mx, my) {
    yeni = Math.max(ENAZ, Math.min(ENCOK, yeni));
    var r = sahne.getBoundingClientRect();
    if (mx == null) { mx = r.width / 2; my = r.height / 2; }
    var kx = mx - r.width / 2, ky = my - r.height / 2;
    var k = yeni / z.o;
    z.x = kx - (kx - z.x) * k;
    z.y = ky - (ky - z.y) * k;
    z.o = yeni;
    sinirla();
    zUygula(true);
  }

  $('#tYaklas').addEventListener('click', function () { zAyarla(z.o * 1.5); });
  $('#tUzaklas').addEventListener('click', function () { zAyarla(z.o / 1.5); });

  // tekerlek / trackpad pinch
  sahne.addEventListener('wheel', function (e) {
    if (!(e.ctrlKey || e.metaKey) && z.o <= 1.001) return;
    e.preventDefault();
    var r = sahne.getBoundingClientRect();
    var k = e.ctrlKey || e.metaKey ? Math.exp(-e.deltaY / 220) : Math.exp(-e.deltaY / 500);
    zAyarla(z.o * k, e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });

  /* ÇİFT SAYFA (masaüstü / akıllı tahta / yatay tablet): 6 BÖLGE — DOKUN, BÜYÜT (02.10.2026)
     Açık iki sayfa 6 bölgeye ayrılır: sol sayfada 3 satır, sağ sayfada 3 satır. Bir bölgeye
     tek dokunuş o bölgeyi ekranı dolduracak kadar büyütür; büyükken tek dokunuş küçültür.
     Büyükken parmakla/fareyle sürükleyerek sayfanın yukarısına, aşağısına ya da öbür sayfaya
     geçilir (aşağıdaki "zoomluyken sürükleyerek gezinme"). Altın çerçeveler ve HTML sayfa
     bağlantıları her zamanki gibi çalışır, büyütmez.
     TEK SAYFA (telefon / dikey ekran): eskisi gibi çift dokunma. */
  var BOLGE_SATIR = 3;
  var bolgeDokun = null;
  function bolgeHedefi(e) {
    if (e.target.closest('.nokta, [data-git], .html-sayfa a, button, .panel')) return null;
    var kitap = sahne.querySelector('.kitap');
    if (!kitap) return null;
    var kr = kitap.getBoundingClientRect();            // ekrandaki (o anki zoom'lu) kitap
    if (e.clientX < kr.left || e.clientX > kr.right || e.clientY < kr.top || e.clientY > kr.bottom) return null;
    var sag = e.clientX >= kr.left + kr.width / 2;
    if (sag && flip.sagSayfa() == null) return null;  // son yaprağın arkası boş
    if (!sag && flip.solSayfa() == null) return null; // kapakta sol taraf boş
    var satir = Math.min(BOLGE_SATIR - 1, Math.floor((e.clientY - kr.top) / (kr.height / BOLGE_SATIR)));
    return { sag: sag, satir: satir, kr: kr };
  }
  // Kitabın zoom'suz (1x) dikdörtgeni, sahneye göre — o an zoom'lu olsa da hesaplanır
  function kitap1x() {
    // DİKKAT: getBoundingClientRect kullanılmaz — zoom geçişi sürerken o anki (eski) konumu
    // verir, art arda tuşa basınca hesap kayar. Yerleşim (offset*) değerleri transform'dan bağımsız.
    var kt = sahne.querySelector('.kitap');
    return { x: kaydir.offsetLeft + kt.offsetLeft, y: kaydir.offsetTop + kt.offsetTop,
      en: kt.offsetWidth, boy: kt.offsetHeight, w: sahne.clientWidth, h: sahne.clientHeight };
  }
  function bolgeyiBuyut(h) {
    var k = kitap1x(), en = k.en / 2;
    var bx = k.x + (h.sag ? en : 0), by = k.y + h.satir * k.boy / BOLGE_SATIR;
    var bEn = en, bBoy = k.boy / BOLGE_SATIR;
    var o = Math.min(ENCOK, Math.min(k.w / bEn, k.h / bBoy) * 0.98);
    var cx = bx + bEn / 2 - k.w / 2, cy = by + bBoy / 2 - k.h / 2;
    z.o = o; z.x = -cx * o; z.y = -cy * o;
    sinirla(); zUygula(true);
  }
  // Ekranın ortasındaki bölge (zoom'luyken)
  function ortadakiBolge() {
    var k = kitap1x();
    var px = k.w / 2 - z.x / z.o, py = k.h / 2 - z.y / z.o;
    var sag = px >= k.x + k.en / 2;
    var satir = Math.max(0, Math.min(BOLGE_SATIR - 1, Math.floor((py - k.y) / (k.boy / BOLGE_SATIR))));
    return { sag: sag, satir: satir };
  }
  /* YÖN TUŞLARI (zoom'luyken, çift sayfa):
     ↑ ↓ aynı sayfada satır satır; sayfanın sonunda öbür sayfaya / sonraki iki sayfaya geçer.
     ← → sol ve sağ sayfa arasında aynı satırda; kenarda önceki / sonraki iki sayfaya geçer.
     Boşluk / PageDown okuma sırasıyla ileri, PageUp geri. */
  function cifteGec(ileri) {                       // önceki/sonraki iki sayfaya animasyonsuz geç
    if (ileri) { if (!flip._ilerisiVar()) return false; flip.git(2 * (flip.c + 1)); }
    else { if (flip.c <= 0) return false; flip.git(flip.c - 1 === 0 ? 1 : 2 * (flip.c - 1)); }
    return true;
  }
  // ↑ ↓ ince adım: sayfa boyunun 1/9'u kadar yumuşak kaydırır; sayfanın ucuna gelince false
  var DIKEY_ADIM = 9;
  function dikeyKay(yon) {
    var k = kitap1x();
    var gor = k.h / z.o;                                    // ekranda görünen yükseklik (1x birimi)
    var py = k.h / 2 - z.y / z.o;                           // ekran ortasının sayfadaki yeri
    var ust = k.y + gor / 2, alt = k.y + k.boy - gor / 2;   // sayfadan taşmadan gidilebilecek uçlar
    if (alt < ust) return false;
    if (yon === 'asagi' ? py >= alt - 2 : py <= ust + 2) return false;   // zaten uçta → öbür sayfaya geç
    var yeni = Math.max(ust, Math.min(alt, py + (yon === 'asagi' ? 1 : -1) * k.boy / DIKEY_ADIM));
    z.y = (k.h / 2 - yeni) * z.o;
    zUygula(true, true);
    return true;
  }
  function bolgeGez(yon) {
    if ((yon === 'asagi' || yon === 'yukari') && dikeyKay(yon)) return;
    var h = ortadakiBolge(), S = BOLGE_SATIR - 1;
    if (yon === 'asagi') h.satir = S; else if (yon === 'yukari') h.satir = 0;   // uçtayız
    if (yon === 'asagi') {
      if (h.satir < S) h.satir++;
      else if (!h.sag && flip.sagSayfa() != null) { h.sag = true; h.satir = 0; }
      else if (cifteGec(true)) { h.sag = false; h.satir = 0; }
      else return;
    } else if (yon === 'yukari') {
      if (h.satir > 0) h.satir--;
      else if (h.sag && flip.solSayfa() != null) { h.sag = false; h.satir = S; }
      else if (cifteGec(false)) { h.sag = flip.sagSayfa() != null; h.satir = S; }
      else return;
    } else if (yon === 'sag') {
      if (!h.sag && flip.sagSayfa() != null) h.sag = true;
      else if (cifteGec(true)) { h.sag = false; h.satir = 0; }
      else return;
    } else if (yon === 'sol') {
      if (h.sag && flip.solSayfa() != null) h.sag = false;
      else if (cifteGec(false)) { h.sag = flip.sagSayfa() != null; h.satir = 0; }
      else return;
    }
    // kapak (sol yok) ya da son sayfa (sağ yok) düzeltmesi
    if (!h.sag && flip.solSayfa() == null) h.sag = true;
    if (h.sag && flip.sagSayfa() == null) h.sag = false;
    bolgeyiBuyut(h);
    if (yon === 'asagi' || yon === 'yukari') {             // yeni sayfanın tam üstüne / altına otur
      var k = kitap1x(), gor = k.h / z.o;
      var py = yon === 'asagi' ? k.y + gor / 2 : k.y + k.boy - gor / 2;
      z.y = (k.h / 2 - py) * z.o;
      zUygula(true, true);
    }
  }
  // tek sayfa modunda zoom'luyken yön tuşları kaydırır
  function zKaydir(dx, dy) {
    var r = sahne.getBoundingClientRect();
    z.x -= dx * r.width * 0.35; z.y -= dy * r.height * 0.35;
    sinirla(); zUygula(true);
  }
  // zoom'luyken yön tuşu yakalanırsa true döner
  function zoomTusu(k) {
    if (z.o <= 1.02) return false;
    var yon = { ArrowDown: 'asagi', ArrowUp: 'yukari', ArrowRight: 'sag', ArrowLeft: 'sol',
      PageDown: 'asagi', ' ': 'asagi', PageUp: 'yukari' }[k];
    if (!yon) return false;
    if (flip.tekli) {
      if (k === 'ArrowDown' || k === 'PageDown' || k === ' ') zKaydir(0, 1);
      else if (k === 'ArrowUp' || k === 'PageUp') zKaydir(0, -1);
      else zKaydir(k === 'ArrowRight' ? 1 : -1, 0);
    } else bolgeGez(yon);
    return true;
  }
  sahne.addEventListener('pointerdown', function (e) {
    if (flip.tekli || acikPanel || e.button > 0) { bolgeDokun = null; return; }
    bolgeDokun = { x: e.clientX, y: e.clientY, t: Date.now(), h: bolgeHedefi(e) };
  });
  window.addEventListener('pointerup', function (e) {
    var d = bolgeDokun; bolgeDokun = null;
    if (!d || flip.tekli || acikPanel) return;
    if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 10 || Date.now() - d.t > 600) return; // sürükleme
    if (z.o > 1.02) { if (!e.target.closest('.nokta, [data-git], .html-sayfa a, button')) zAyarla(1); return; }
    if (d.h) bolgeyiBuyut(d.h);
  });

  // TEK SAYFA: çift tıklama / çift dokunma
  // Kaydırma ya da sürükleme çift dokunma sayılmaz: telefonda art arda iki hızlı
  // sayfa kaydırma yakınlaştırmayı açmasın. İki dokunuş aynı yere düşmeli.
  var sonDokunma = 0, dokunmaYer = null;
  window.addEventListener('pointerup', function (e) {
    if (dokunmaYer && Math.hypot(e.clientX - dokunmaYer.x, e.clientY - dokunmaYer.y) > 12) sonDokunma = 0;
  });
  sahne.addEventListener('pointerdown', function (e) {
    if (!flip.tekli) return;                 // çift sayfada 6 bölge kullanılır
    var t = Date.now();
    var yakin = dokunmaYer && Math.hypot(e.clientX - dokunmaYer.x, e.clientY - dokunmaYer.y) < 40;
    dokunmaYer = { x: e.clientX, y: e.clientY };
    if (t - sonDokunma < 320 && yakin) {
      var r = sahne.getBoundingClientRect();
      if (z.o > 1.02) zAyarla(1);
      else zAyarla(2.4, e.clientX - r.left, e.clientY - r.top);
      sonDokunma = 0;
      return;
    }
    sonDokunma = t;
  });

  // zoomluyken sürükleyerek gezinme
  var pan = null;
  sahne.addEventListener('pointerdown', function (e) {
    if (z.o <= 1.02) return;
    if (e.target.closest('.nokta')) return;
    pan = { x: e.clientX, y: e.clientY, zx: z.x, zy: z.y };
    sahne.style.cursor = 'grabbing';
  });
  window.addEventListener('pointermove', function (e) {
    if (!pan) return;
    z.x = pan.zx + (e.clientX - pan.x);
    z.y = pan.zy + (e.clientY - pan.y);
    sinirla(); zUygula(false);
  });
  window.addEventListener('pointerup', function () { pan = null; sahne.style.cursor = ''; });

  // iki parmak pinch (dokunmatik)
  var dokunmalar = {}, pinch = null;
  sahne.addEventListener('touchstart', function (e) {
    if (e.touches.length === 2) {
      var a = e.touches[0], b = e.touches[1];
      pinch = { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), o: z.o };
    }
  }, { passive: true });
  sahne.addEventListener('touchmove', function (e) {
    if (e.touches.length === 2 && pinch) {
      e.preventDefault();
      var a = e.touches[0], b = e.touches[1];
      var d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      var r = sahne.getBoundingClientRect();
      zAyarla(pinch.o * (d / pinch.d),
        (a.clientX + b.clientX) / 2 - r.left, (a.clientY + b.clientY) / 2 - r.top);
    }
  }, { passive: false });
  sahne.addEventListener('touchend', function (e) { if (e.touches.length < 2) pinch = null; }, { passive: true });

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
      else if (z.o > 1.02) zAyarla(1);
      else if (bindirmeAcik) bindirmeKaldir();
      return;
    }
    if (acikPanel) return;
    if (zoomTusu(k)) { e.preventDefault(); return; }
    switch (k) {
      case 'ArrowRight': case 'PageDown': case ' ': e.preventDefault(); flip.ileri(); break;
      case 'ArrowLeft': case 'PageUp': e.preventDefault(); flip.geri(); break;
      case 'Home': flip.git(1); break;
      case 'End': flip.git(K.toplamSayfa); break;
      case '+': case '=': zAyarla(z.o * 1.5); break;
      case '-': case '_': zAyarla(z.o / 1.5); break;
      case '0': zAyarla(1); break;
      case 'i': case 'I': case 'ı': $('#tIcindekiler').click(); break;
      case 's': case 'S': e.preventDefault(); sozlukAc(); break;
      case 'a': case 'A': e.preventDefault(); $('#tAraclar').click(); break;
      case 'h': case 'H': $('#tIpucu').click(); break;
      case 'f': case 'F': $('#tTamEkran').click(); break;
      case 'k': case 'K': {
        var kk = sayfaKaynaklari(flip.aktif);
        if (kk) kaynakPaneliAc(flip.aktif); else tost('Bu sayfada dijital kaynak yok');
        break;
      }
    }
  });

  /* ---------- yeniden boyutlandırma ---------- */
  var rz;
  window.addEventListener('resize', function () {
    clearTimeout(rz);
    rz = setTimeout(function () { flip.olcekle(); htmlOlcek(); sinirla(); zUygula(true); }, 120);
  });

  /* ---------- açılış ---------- */
  var basla = new URLSearchParams(location.search).get('s');
  flip.git(basla ? parseInt(basla, 10) : (K.uretilmisSayfalar[0] || 1));
  zUygula(true);

  setTimeout(function () {
    tost(flip.tekli ? 'Sayfayı sürükleyerek çevir · çift dokunarak yaklaş · altın çerçevelere tıkla'
      : 'Sayfayı sürükleyerek çevir · bir yere dokun, büyüsün · altın çerçevelere tıkla');
  }, 900);
})();
