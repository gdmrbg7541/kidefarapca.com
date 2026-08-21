/* =====================================================================
   KIDEF · SINIF VERİ KAYDI            (sistem/sinifveri.js)
   ---------------------------------------------------------------------
   TEK KAYNAK. "Hangi sınıfın hangi modülde hazır verisi var?" sorusunun
   cevabı YALNIZCA bu dosyadadır.

   Aynı dosyayı iki taraf birden okur:
     • index.html          → İmam Hatip akordiyonunda o sınıfın kartını
                             gösterir mi, göstermez mi?
     • modülün kendi sayfası (ör. bilgiyarismasikacom.html)
                           → konuları sınıfa göre süzer/seçer.

   Böylece modülün TEK bir HTML dosyası olur; tasarım/iskelet değişince
   tek dosya düzenlenir, veriler ise sınıfa göre buradan gelir.

   ⚠️ YENİ SINIF EKLEMEK: aşağıdaki haritaya satır ekle. Başka hiçbir
      dosyaya dokunmaya gerek yok.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefSinifVeri) return;

  /* ------------------------------------------------------------------
     1) BİLGİ YARIŞMASI — konu sınıflandırması
        anahtar : oyunlar/bilgiyarismasikacom.js içindeki KONULAR[].id
        sinif   : 5..10  ·  0 = Genel (her sınıfta görünür, karta sebep olmaz)
        seviye  : 1 Temel · 2 Orta · 3 İleri  (yalnız GENEL konuları sıralar)
        sira    : seviye içindeki sıra (basitten zora dizilim)
        soru    : YALNIZ index.html'deki kartın rozetinde yazan sayı. Asıl
                  sorular bilgiyarismasikacom.js'tedir; buradaki sayı ondan
                  kopyadır, uyuşmazlığı test yakalar (bkz. t_smod.js).

     ⚠️ BİR SINIF = BİR KONU. Sınıfın kelime ve cümle soruları ayrı konu
        değildir; hepsi "sinifN" konusunun içindedir. Yeni sınıf eklerken
        buraya tek satır eklenir.
     ------------------------------------------------------------------ */
  var BIY_KONU = {
    /* sınıf konuları — kelime + cümle birlikte */
    sinif7:      { sinif: 7,  seviye: 1, sira: 1, soru: 125 },
    sinif9:      { sinif: 9,  seviye: 1, sira: 2, soru: 72 },
    sinif10:     { sinif: 10, seviye: 2, sira: 3, soru: 64 },
    /* genel konular — her sınıfta görünür */
    alfabe:      { sinif: 0,  seviye: 1, sira: 1, soru: 138 },
    kelimeler:   { sinif: 0,  seviye: 1, sira: 3, soru: 71 },
    edatlar:     { sinif: 0,  seviye: 2, sira: 3, soru: 25 },
    vezinler:    { sinif: 0,  seviye: 3, sira: 1, soru: 53 },
    dilbilgisi1: { sinif: 0,  seviye: 3, sira: 2, soru: 20 },
    dilbilgisi2: { sinif: 0,  seviye: 3, sira: 3, soru: 18 },
    /* tamlamavecumleler.html testinin soruları — aynı havuz burada da sorulur */
    tamlamacumle:{ sinif: 0,  seviye: 3, sira: 4, soru: 156 },
    /* tamlamavecumleler.html İ'RAB TESTİ — örnek havuzundan üretilen
       159 soru (hâl · görev · alâmet · lafzen/takdiren/mahallen) */
    irab:        { sinif: 0,  seviye: 3, sira: 5, soru: 159 }
  };

  /* Kelime/cümle ayrımı kaldırılmadan önce paylaşılmış bağlantılar
     ("?konu=yedi" gibi) çalışmaya devam etsin diye eski id eşlemesi. */
  var ESKI_ID = {
    yedi: 'sinif7', cumle7: 'sinif7',
    dokuz: 'sinif9',
    cumle10: 'sinif10'
  };
  function konuGoc(id) { return (id && ESKI_ID[id]) || id || null; }

  function sayi(s) { var n = parseInt(s, 10); return isFinite(n) ? n : 0; }

  /* Bir sınıfa AİT konu id'leri (Genel konular sayılmaz — kart ölçütü budur) */
  function biyKonulari(sinif) {
    var n = sayi(sinif);
    if (!n) return [];
    var c = [];
    for (var id in BIY_KONU) {
      if (Object.prototype.hasOwnProperty.call(BIY_KONU, id) && BIY_KONU[id].sinif === n) c.push(id);
    }
    c.sort(function (a, b) {
      var A = BIY_KONU[a], B = BIY_KONU[b];
      return (A.seviye - B.seviye) || (A.sira - B.sira);
    });
    return c;
  }

  /* Verisi olan sınıflar — süzgeç çipleri bundan üretilir (elle liste yok) */
  function biySiniflar() {
    var s = {}, c = [];
    for (var id in BIY_KONU) {
      if (!Object.prototype.hasOwnProperty.call(BIY_KONU, id)) continue;
      var n = BIY_KONU[id].sinif;
      if (n > 0 && !s[n]) { s[n] = 1; c.push(n); }
    }
    return c.sort(function (a, b) { return a - b; });
  }

  /* Sınıfın açılışta seçilecek konusu (en basit olan) */
  function biyIlkKonu(sinif) {
    var k = biyKonulari(sinif);
    return k.length ? k[0] : null;
  }

  /* ------------------------------------------------------------------
     2) SÖZLÜK SİMÜLASYONU — sınıf verisi
        Kaynak : sozluk/veri/sozluk_N.js (muhadese ders cümlelerinden
                 üretildi; üretici /tmp/s_uret.js, kural motoru
                 dosyanın başındaki yorumda anlatılıyor)
        cumle  : oyuna giren cümle sayısı — kart rozetinde yazar
        kelime : o cümlelerdeki toplam kelime (sorulacak parça) sayısı
        seviye : o sınıfta AÇILAN seviye sayısı; sınıfta karşılığı
                 olmayan olgu için seviye açılmaz (5'te ikil/çoğul
                 seviyesi yok, 10'da beşi de var).
        ⚠️ Sayılar veri dosyalarından KOPYADIR; uyuşmazlığı test
        yakalar (bkz. t_sozsinif.js). Ders verisi değişip veri yeniden
        üretilirse bu satırlar da güncellenmeli.
     ------------------------------------------------------------------ */
  var SOZLUK_SINIF = {
    5:  { cumle: 60,  kelime: 134, seviye: 3 },
    /* 6. sınıf 1. ünite (الحَياة اليَوْمِيَّة) + 2. ünite (المَأْكولات
       وَالمَشْروبات) muhâdese cümlelerinden üretildi; dört seviyenin de
       olgusu bu ünitelerde geçiyor. */
    6:  { cumle: 160, kelime: 451, seviye: 4 },
    7:  { cumle: 118, kelime: 349, seviye: 3 },
    9:  { cumle: 58,  kelime: 146, seviye: 4 },
    10: { cumle: 83,  kelime: 267, seviye: 5 }
  };
  function sozlukSinif(sinif) {
    var n = sayi(sinif);
    return (n && SOZLUK_SINIF[n]) ? SOZLUK_SINIF[n] : null;
  }
  function sozlukSiniflari() {
    var c = [];
    for (var n in SOZLUK_SINIF)
      if (Object.prototype.hasOwnProperty.call(SOZLUK_SINIF, n)) c.push(+n);
    return c.sort(function (a, b) { return a - b; });
  }

  window.KidefSinifVeri = {
    biyKonu:     BIY_KONU,
    biyKonulari: biyKonulari,
    biySiniflar: biySiniflar,
    biyIlkKonu:  biyIlkKonu,
    biyKonuGoc:  konuGoc,
    sozlukVeri:      SOZLUK_SINIF,
    sozlukSinif:     sozlukSinif,
    sozlukSiniflari: sozlukSiniflari
  };
})();
