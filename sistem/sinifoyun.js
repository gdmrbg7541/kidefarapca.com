/* =====================================================================
   KİDEF · SINIF OYUN KARTLARI          (sistem/sinifoyun.js)
   ---------------------------------------------------------------------
   Öğretmen (07.10.2026):
     "oyunlar kategorisinden 5. sınıf kategorisine merak çarkı, hangi
      harf, klavye oyununu ekleyelim, tasarımlar aynı olsun."
     "6. sınıflar için merak çarkı, hangi harf, klavye oyunu, hareke
      avcısı, kökü tanı, ikiki kartları olsun."
     "7. sınıfta merak çarkı, hangi harf, hareke avcısı, kökü tanı,
      kökten gövdeye, klavye oyunu, ikiki oyunları olsun aynı tasarımla."
     "8. sınıfa tüm oyun kartlarını ekle, ama zaten bazıları varsa onları
      atla; 9. sınıfa merak çarkı, hangi harf, hareke avcısı, kökü tanı,
      klavye oyununu ekleyelim; 10. sınıfa ise merak çarkı ve tüm oyun
      kartlarını ekleyelim, önceden eklenen varsa iki kere eklemeyelim."

   On oyun, tek dosya. Kayıt sözleşmesi sistem/sinifmodul.js'te
   anlatılıyor: veriVar() null dönerse kart O SINIFTA basılmaz. Burada
   sınıf seçimi her oyunun "siniflar" dizisinde duruyor — yeni bir sınıfa
   eklemek için o diziye sayı yazmak yetiyor.

   HANGİ OYUN, HANGİ SINIF, NEREYE GİDİYOR
     merakcarki    5,6,7,8,9,10  → merakcarki.html   (ders başı ısınma)
     hangiharf     5,6,7,8,9,10  → hangiharf.html
     harekeavcisi    6,7,8,9,10  → harekeavcisi.html
     kokutani        6,7,8,9,10  → kokutani.html
     klavyeoyunu   5,6,7,8,9,10  → klavyeoyunu.html
     koktengovdeye     7, 8, 10  → koktengovdeye.html
     ikiki             6,7,8,10  → ikikidijital.html
     isimx4                8, 10  → isimx4.html
     hafizakartlari        8, 10  → hafizakartlari.html
     zamanlayaris          8, 10  → zamanlayaris.html

   AYNI KART İKİ KERE BASILMAZ (öğretmen: "zaten bazıları varsa onları
   atla... önceden eklenen varsa dikkat et"). Oyunlar kategorisindeki
   12 karttan ikisi — Bilgi Yarışması ve Test Kapışması — 8, 9 ve 10'a
   zaten BAŞKA bir modülden giriyor ve oradaki sürümleri daha iyi:
   "?sinif=N" ile o sınıfın kendi sorularını açıyorlar. Bu yüzden
   listede yoklar. Ama liste elle budanmadı: her oyun basılmadan önce
   o sınıfta aynı adda ya da aynı adrese giden bir kart var mı diye
   bakılıyor (bkz. zatenVar). Yarın başka bir modül başka bir oyunu
   bir sınıfa eklerse burası kendiliğinden susar.

   TASARIM ANASAYFADAKİNİN AYNISI
   Kartın rengi (oyun-card + oyun-mor/oyun-yesil/oyun-sarf gradyanı),
   ikon halkası (oyun-ikon), Maarif etiketi ve rozeti anasayfadaki
   Oyunlar kategorisindeki kartla birebir aynı. Çizimler elle
   kopyalanmadı: sistem/kartcizim.js'ten okunuyor, o da index.html'den
   üretiliyor (_kaynak/uretici/kartCizimUret.py). Anasayfadaki çizim
   değişirse betik yeniden çalıştırılır, buradaki kartlar kendiliğinden
   uyar — iki ayrı kopya tutulmuyor.

   SIRA ders akışına göre: ısınma (merak çarkı) → harf/hareke tanıma →
   kök → klavye → türetme yarışı. 60'tan başlıyor; eksunukart ve kitap
   etkinlikleri kartlarından SONRA, oyunlar en sonda dursun diye.

   NOT — "?sinif=" GÖNDERİLMİYOR: bu sayfaların hiçbiri sınıfa göre veri
   seçmiyor. Anlamsız parametre eklemek yerine sade adres bırakıldı;
   biri ileride sınıfa göre ayrışırsa url() işlevine eklenir.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefSinifOyun) return;

  var DES = '<span class="mrf mrf-des"><i>Maarif</i>Destekleme</span>';
  var ZEN = '<span class="mrf mrf-zen"><i>Maarif</i>Zenginleştirme</span>';
  var OYNA = '🎮 Hemen Oyna';          /* 🎮 — anasayfadaki rozetin aynısı */

  /* Çizim kayıtlı değilse kart HİÇ basılmaz: yarım kart basmaktansa hiç
     basmamak yeğ. Eksikse kartcizim.js yeniden üretilmeli. */
  function ciz(ad) {
    var c = window.KidefKartCizim;
    return (c && c[ad]) ? c[ad] : '';
  }

  var OYUNLAR = [
    {
      id: 'oyunmerakcarki', cizim: 'merakcarki',
      ad: 'Merak Çarkı', siniflar: [5, 6, 7, 8, 9, 10], sira: 60,
      eksinif: 'oyun-card oyun-mor',
      ekstil: 'background:linear-gradient(150deg,#7C4DBE,#5B2E9E)',
      maarif: DES, rozet: '🎡 Çarkı Çevir',
      aciklama: 'Ders başı: fıkra, kelime kökeni, kültür ya da bulmaca — çark seçsin.',
      url: 'merakcarki.html'
    },
    {
      id: 'oyunhangiharf', cizim: 'hangiharf',
      ad: 'Hangi Harf?', siniflar: [5, 6, 7, 8, 9, 10], sira: 61,
      eksinif: 'oyun-card oyun-yesil',
      maarif: DES, rozet: '🕹️ Hemen Oyna',
      aciklama: 'Hızlıca doğru harfi bul.',
      url: 'hangiharf.html'
    },
    {
      id: 'oyunharekeavcisi', cizim: 'harekeavcisi',
      ad: 'Hareke Avcısı', siniflar: [6, 7, 8, 9, 10], sira: 62,
      eksinif: 'oyun-card oyun-sarf',
      ekstil: 'background:linear-gradient(150deg,#FF7A7A,#EE5253)',
      maarif: DES, rozet: OYNA,
      aciklama: 'Doğru harekeleri yakala.',
      url: 'harekeavcisi.html'
    },
    {
      id: 'oyunkokutani', cizim: 'kokutani',
      ad: 'Kökü Tanı', siniflar: [6, 7, 8, 9, 10], sira: 63,
      eksinif: 'oyun-card oyun-sarf',
      ekstil: 'background:linear-gradient(150deg,#2BD4B5,#0E9E86)',
      maarif: ZEN, rozet: OYNA,
      aciklama: 'Kökten türeyen kelimeleri bul!',
      url: 'kokutani.html'
    },
    {
      id: 'oyunkoktengovdeye', cizim: 'koktengovdeye',
      ad: 'Kökten Gövdeye', siniflar: [7, 8, 10], sira: 64,
      eksinif: 'oyun-card oyun-sarf',
      ekstil: 'background:linear-gradient(150deg,#FFB84D,#F39C12)',
      maarif: ZEN, rozet: OYNA,
      aciklama: 'Kökü doğru kalıba sürükle!',
      url: 'koktengovdeye.html'
    },
    {
      id: 'oyunklavye', cizim: 'klavyeoyunu',
      ad: 'Klavye Oyunu', siniflar: [5, 6, 7, 8, 9, 10], sira: 65,
      eksinif: 'oyun-card oyun-mor',
      rozet: '🕹️ Hemen Oyna',
      aciklama: 'Arapça klavye pratiği yap.',
      url: 'klavyeoyunu.html'
    },
    {
      id: 'oyunikiki', cizim: 'ikiki',
      ad: 'İkiki', siniflar: [6, 7, 8, 10], sira: 66,
      eksinif: 'oyun-card oyun-sarf',
      ekstil: 'background:linear-gradient(150deg,#8B7CFF,#5A50E0)',
      maarif: ZEN, rozet: OYNA,
      aciklama: 'Kelimeleri ilk sen türet!',
      url: 'ikikidijital.html'
    },
    {
      id: 'oyunisimx4', cizim: 'isimx4',
      ad: 'İsim x 4', siniflar: [8, 10], sira: 67,
      eksinif: 'oyun-card oyun-mavi',
      maarif: ZEN, rozet: '\uD83D\uDD79\uFE0F Hemen Oyna',
      aciklama: 'İsmin 4 özelliğini analiz et!',
      url: 'isimx4.html'
    },
    {
      id: 'oyunhafizakartlari', cizim: 'hafizakartlari',
      ad: 'Hafıza Kartları', siniflar: [8, 10], sira: 68,
      eksinif: 'oyun-card oyun-turuncu',
      maarif: DES, rozet: '\uD83D\uDD79\uFE0F Hemen Oyna',
      aciklama: 'Kelime kartlarını eşleştir.',
      url: 'hafizakartlari.html'
    },
    {
      id: 'oyunzamanlayaris', cizim: 'zamanlayaris',
      ad: 'Zamanla Yarış', siniflar: [8, 10], sira: 69,
      eksinif: 'oyun-card oyun-sarf',
      ekstil: 'background:linear-gradient(150deg,#FF7EB3,#FF2D75)',
      maarif: ZEN, rozet: OYNA,
      aciklama: 'Kök&kalıptan gövdeye!',
      url: 'zamanlayaris.html'
    }
  ];

  /* ---------------------------------------------------------- ÇAKIŞMA
     Bir oyun, o sınıfa BAŞKA bir modülden zaten giriyorsa burada
     basılmaz. Ölçüt iki tane: aynı ad ya da aynı sayfa (adresin "?"
     öncesi). Böylece "testkapismasi.html?sinif=8" ile sade
     "testkapismasi.html" aynı sayılıyor ve sınıfın kendi sorularını
     açan sürüm yerinde kalıyor.
     Kendi oyunlarımız ölçüye katılmıyor (hepsinin id'si 'oyun' ile
     başlıyor); yoksa her oyun kendini eler. */
  var sorguda = false;                 /* başka modül kartlar() çağırırsa */

  function sadeAd(x) {
    return String(x == null ? '' : x).toLocaleLowerCase('tr')
      .replace(/[\s?!.·x×]+/g, '');
  }
  function sayfa(u) {
    return String(u == null ? '' : u).split('?')[0].split('#')[0]
      .replace(/^\.?\//, '').toLowerCase();
  }
  function cagir(v, n) {
    try { return (typeof v === 'function') ? v(n) : v; } catch (e) { return null; }
  }

  function zatenVar(ad, url, sinif) {
    var M = window.KidefSinifModul;
    if (!M || !M.liste || sorguda) return false;
    var a = sadeAd(ad), u = sayfa(url), bulundu = false;
    sorguda = true;
    try {
      M.liste().forEach(function (t) {
        if (bulundu || !t || !t.id || t.id.indexOf('oyun') === 0) return;
        if (!cagir(t.veriVar, sinif)) return;
        if (sadeAd(cagir(t.ad, sinif)) === a || sayfa(cagir(t.url, sinif)) === u) {
          bulundu = true;
        }
      });
    } catch (e) { bulundu = false; }
    sorguda = false;
    return bulundu;
  }

  function kur() {
    var M = window.KidefSinifModul;
    if (!M || !M.ekle) return false;
    OYUNLAR.forEach(function (o) {
      M.ekle({
        id: o.id, ad: o.ad, sira: o.sira,
        eksinif: o.eksinif, ekstil: o.ekstil || '',
        ikonSinif: 'oyun-ikon', maarif: o.maarif || '',
        rozet: o.rozet, aciklama: o.aciklama,
        svg: function () { return ciz(o.cizim); },
        veriVar: function (sinif) {
          if (o.siniflar.indexOf(sinif) < 0) return null;
          if (!ciz(o.cizim)) return null;
          if (zatenVar(o.ad, o.url, sinif)) return null;   /* iki kere basma */
          return { rozet: o.rozet };
        },
        url: function () { return o.url; }
      });
    });
    try { if (M.kur) M.kur(); } catch (e) { }
    return true;
  }

  /* sinifmodul.js ya da kartcizim.js geç yüklenirse kısa süre beklenir. */
  function hazirMi() { return !!(window.KidefSinifModul && window.KidefKartCizim); }
  if (!(hazirMi() && kur())) {
    var tur = 0;
    var zaman = setInterval(function () {
      if ((hazirMi() && kur()) || ++tur > 40) clearInterval(zaman);
    }, 150);
  }

  window.KidefSinifOyun = { kur: kur, liste: function () { return OYUNLAR.slice(); } };
})();
