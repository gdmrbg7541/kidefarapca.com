/* =====================================================================
   KİDEF · EK SINIF KARTLARI            (sistem/eksunukart.js)
   ---------------------------------------------------------------------
   Öğretmen (05.10.2026): "5 ve 6. sınıflara sunumlardan harf-i ta'rîf
   sunusunu kart olarak ekle, aynı şekilde tüm sınıflara kelime çarkını
   ekle, sözlük kartını her sınıfa kart olarak ekle, 10. sınıfa kelime
   fabrikasını ekle, niçin arapça sunumunu 9. sınıfa ekle."

   Beş kart, tek dosya. Kayıt sözleşmesi sistem/sinifmodul.js'te
   anlatılıyor: veriVar() null dönerse kart O SINIFTA basılmaz — sınıf
   seçimi bu yüzden veriVar içinde, ayrı bir liste tutulmuyor.

   HANGİ KART, HANGİ SINIF, NEREYE GİDİYOR
     nicinarapca  9           → sunum html/sunumlar.html?s=arapcaninonemi
     harfitarif   5, 6        → sunum html/harfitarif.html   (müstakil sunu)
     kelimecarki  hepsi       → kelimecarki.html
     sozluk       hepsi       → sozluk.html
     kelimefabrikasi 10       → sarf.html  (tek oyun kipi: fabrika)

   NOT — "?sinif=" GÖNDERİLMİYOR: bu beş sayfanın hiçbiri sınıfa göre
   veri seçmiyor (sozluk.html yalnız q/fav/test/yaz okuyor, kelimecarki
   ve sarf hiç okumuyor). Anlamsız parametre eklemek yerine sade adres
   bırakıldı; sayfalardan biri ileride sınıfa göre ayrışırsa buradaki
   url() işlevine eklenir.

   NOT — KLASÖR ADINDA BOŞLUK: sunumlar "sunum html/" klasöründe; adres
   "sunum%20html/" diye yazılıyor, yoksa bağlantı kırılıyor.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefEkSunuKart) return;

  /* Küçük yardımcı: kartın SVG'si tek renk (currentColor) kullanır,
     rengi sinifmodul.js kartın "renk" alanından veriyor. */
  function svg(ic) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ' +
           'aria-hidden="true" focusable="false">' + ic + '</svg>';
  }

  var IK = {
    /* dünya — "bir dil, iki dünya" */
    dunya: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/>' +
               '<path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z"/>'),
    /* kitap + üstünde harf takısı vurgusu */
    takı: svg('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15.5H6.5A2.5 2.5 0 0 0 4 21z"/>' +
              '<path d="M8.5 8.2v5.6"/><path d="M12.4 8.2v4a1.6 1.6 0 0 0 1.6 1.6h1.5"/>'),
    /* çark */
    cark: svg('<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="2.4"/>' +
              '<path d="M12 3.8v3M12 17.2v3M3.8 12h3M17.2 12h3"/>' +
              '<path d="M6.2 6.2l2.1 2.1M15.7 15.7l2.1 2.1M17.8 6.2l-2.1 2.1M8.3 15.7l-2.1 2.1"/>'),
    /* sözlük: açık kitap + arama */
    sozluk: svg('<path d="M3.5 5.2A2.2 2.2 0 0 1 5.7 3H11v15H5.7a2.2 2.2 0 0 0-2.2 2.2z"/>' +
                '<path d="M11 3h5.3a2.2 2.2 0 0 1 2.2 2.2v5"/>' +
                '<circle cx="17.4" cy="16.4" r="3.1"/><path d="M19.7 18.7 21.6 20.6"/>'),
    /* fabrika: huni + dişli */
    fabrika: svg('<path d="M4.2 3.6h11.4l-4 5.2v4.4l-3.4 2.2V8.8z"/>' +
                 '<circle cx="17.2" cy="15.6" r="4.2"/>' +
                 '<path d="M17.2 11.4v1.4M17.2 18.4v1.4M13 15.6h1.4M20 15.6h1.4"/>')
  };

  function hepsi() { return true; }

  /* KENDİ KATEGORİSİNDEKİ ÇİZİM (07.10.2026) — öğretmen: "öğretmen özel
     kategorisinden eklediklerimiz de aynı tasarım olsun."
     Kelime Çarkı, Sözlük ve Kelime Fabrikası anasayfada kendi kategorisinde
     ayrıntılı, hareketli birer çizimle duruyor; sınıf kutusunda ise burada
     elle çizilmiş sade çizgi simgelerle görünüyorlardı — aynı kart iki
     türlü görünüyordu. Artık sınıf kartı da kategorideki çizimi kullanıyor
     (sistem/kartcizim.js, index.html'den üretiliyor). Çizim bulunamazsa
     eski sade simge yedek olarak kalıyor, kart kaybolmuyor.
     Niçin Arapça? ve Harf-i Ta'rîf birer SUNU; anasayfada kartları yok,
     onlar sade simgeleriyle kalıyor. */
  function kendiCizimi(ad, yedek) {
    return function () {
      var c = window.KidefKartCizim;
      return (c && c[ad]) ? c[ad] : yedek;
    };
  }

  var KARTLAR = [
    {
      id: 'nicinarapca',
      ad: 'Niçin Arapça?',
      sira: 36,
      renk: '#16A085',
      aciklama: function () { return 'Bir dil, iki dünya — giriş sunusu'; },
      svg: function () { return IK.dunya; },
      veriVar: function (s) { return (s === 9) ? { rozet: 'Sunu' } : null; },
      url: function () { return 'sunum%20html/sunumlar.html?s=arapcaninonemi&don=indeks'; }
    },
    {
      id: 'harfitarif',
      ad: 'Harf-i Ta’rîf',
      sira: 38,
      renk: '#7C3AED',
      aciklama: function () { return 'Elif-Lâm takısı «ال» — ders sunusu'; },
      svg: function () { return IK.takı; },
      veriVar: function (s) { return (s === 5 || s === 6) ? { rozet: 'Sunu' } : null; },
      url: function () { return 'sunum%20html/harfitarif.html'; }
    },
    {
      id: 'kelimecarki',
      ad: 'Kelime Çarkı',
      sira: 40,
      renk: '#E67E22',
      aciklama: function () { return 'Çarkı çevir, kelimeyi kur'; },
      svg: kendiCizimi('kelimecarki', IK.cark),
      veriVar: hepsi,
      url: function () { return 'kelimecarki.html'; }
    },
    {
      id: 'sozluk',
      ad: 'Sözlük',
      sira: 42,
      renk: '#2E86DE',
      aciklama: function () { return 'Kelime ara, favorine ekle'; },
      svg: kendiCizimi('sozluk', IK.sozluk),
      veriVar: hepsi,
      url: function () { return 'sozluk.html'; }
    },
    {
      id: 'kelimefabrikasi',
      ad: 'Kelime Fabrikası',
      sira: 44,
      renk: '#0E7C66',
      aciklama: function () { return 'Kökten kelime üret — öğütücü ve atölye'; },
      svg: kendiCizimi('kelimefabrikasi', IK.fabrika),
      veriVar: function (s) { return (s === 10) ? { rozet: 'Oyun' } : null; },
      url: function () { return 'sarf.html'; }
    }
  ];

  function kaydet() {
    var M = window.KidefSinifModul;
    if (!M || typeof M.ekle !== 'function') return false;
    KARTLAR.forEach(function (k) { M.ekle(k); });
    try { if (typeof M.kur === 'function') M.kur(); } catch (e) {}
    return true;
  }

  /* sinifmodul.js bu dosyadan önce yükleniyor ama sıra garanti değil;
     ciktikart.js'teki gibi kısa aralıklarla denenip bırakılıyor. */
  var kez = 0;
  function basla() {
    if (kaydet() || ++kez > 40) return;
    setTimeout(basla, 300);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla);
  else basla();

  window.KidefEkSunuKart = { kartlar: KARTLAR };
})();
