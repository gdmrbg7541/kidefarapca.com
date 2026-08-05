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
        seviye  : 1 Temel · 2 Orta · 3 İleri
        sira    : seviye içindeki sıra (basitten zora dizilim)
     ------------------------------------------------------------------ */
  var BIY_KONU = {
    yedi:        { sinif: 7,  seviye: 1, sira: 1 },
    dokuz:       { sinif: 9,  seviye: 1, sira: 2 },
    kelimeler:   { sinif: 0,  seviye: 1, sira: 3 },
    cumle7:      { sinif: 7,  seviye: 2, sira: 1 },
    cumle10:     { sinif: 10, seviye: 2, sira: 2 },
    edatlar:     { sinif: 0,  seviye: 2, sira: 3 },
    vezinler:    { sinif: 0,  seviye: 3, sira: 1 },
    dilbilgisi1: { sinif: 0,  seviye: 3, sira: 2 },
    dilbilgisi2: { sinif: 0,  seviye: 3, sira: 3 }
  };

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

  window.KidefSinifVeri = {
    biyKonu:     BIY_KONU,
    biyKonulari: biyKonulari,
    biySiniflar: biySiniflar,
    biyIlkKonu:  biyIlkKonu
  };
})();
