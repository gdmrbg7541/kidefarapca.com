/* =====================================================================
   KIDEF · KLASİK SORU ÜRETECİ — sinifici/klasik.js
   ---------------------------------------------------------------------
   Seçilen SINIF ve ÜNİTE için klasik (açık uçlu) sorular üretir.

   ARAPÇA HİÇBİR YERDE ELLE YAZILMADI. Bütün Arapça, o ünitenin kendi
   ders verisinden gelir:
     muhadese/veri/<sınıf>_<ünite>_<ders>.js
       · data.sentence[].words[] → {tr, ar, order}
         dizi sırası TÜRKÇE okuma sırası, "order" ARAPÇA sıradır.
       · data.dialog[]           → {p1:[...], p2:[...]} soru-cevap çifti
       · data.words[]            → {tr, ar} ünite sözcükleri
   Dosyalar çalışma anında okunur ve Firebase/DOM taklit edilerek
   çalıştırılır (Soru Kâğıdı motorunun havuz okuma yöntemiyle aynı).
   Ders verisi güncellenince sorular da kendiliğinden güncellenir.

   NEDEN KLASİK
     Yazılı ve Uygulamalı Sınavlar Yönergesi m.5/1-e gereği okul yazılıları
     açık uçlu / kısa cevaplı sorulardan oluşur. Bu yüzden "Sınav" yolunda
     yalnız buradaki sorular görünür; çoktan seçmeli havuz kapalıdır.

   ÜRETİLEN TÜRLER  (tip → alan becerisi eşlemesi sinav.js'tedir)
     kl-ceviri-ar  Arapçadan Türkçeye çeviri            → OKUMA
     kl-ceviri-tr  Türkçeden Arapçaya çeviri            → OKUMA
     kl-anlama     Diyalogdan kısa cevaplı anlama       → OKUMA
     kl-sozcuk     Sözcüğün karşılığı                   → SÖZCÜK
     kl-eslestirme Sözcük eşleştirme                    → SÖZCÜK
     kl-bosluk     Boşluk doldurma                      → SÖZCÜK
     kl-kurma      Karışık sözcüklerden cümle kurma     → DİL BİLGİSİ
     kl-yazma      Konu üzerine cümle/paragraf yazma    → YAZMA
     kl-konusma    Konuşma görevi (uygulamalı)          → KONUŞMA
     kl-dinleme    Dinleme görevi (öğretmen okur)       → DİNLEME
     -- varsayılan KAPALI, sayfadan açılır --
     kl-hareke     Harekeleme                           → DİL BİLGİSİ
     kl-duzeltme   Doğru/yanlış + yanlışı düzeltme      → DİL BİLGİSİ
     kl-uretim     Verilen sözcüklerle özgün cümle      → YAZMA
   ===================================================================== */
(function () {
  'use strict';

  var ONBELLEK = {};                 // "8_2" → üretilmiş soru dizisi
  var HAREKE = /[ً-ْٰ]/g;
  var TATVIL = 'ـ';
  var BOSLUK_ISARETI = new Array(9).join(TATVIL);   // ــــــــ

  /* ---------- ders dosyalarını oku (sanal window ile) ---------- */
  function yapay(h) {
    h = h || function () {};
    return new Proxy(h, {
      get: function (t, k) {
        if (k in t) return t[k];
        if (k === Symbol.toPrimitive) return function () { return ''; };
        if (k === 'then') return undefined;
        return yapay();
      },
      set: function (t, k, v) { t[k] = v; return true; },
      apply: function () { return yapay(); },
      construct: function () { return yapay(); }
    });
  }

  function dosyaOku(yol) {
    return fetch(yol, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) return null;
      return r.text();
    }).then(function (kaynak) {
      if (!kaynak) return null;
      var W = { data: null };
      var adlar = ['window', 'self', 'globalThis', 'document', 'localStorage', 'console'];
      var degerler = [W, W, W, yapay(), yapay(), yapay()];
      try {
        Function.apply(null, adlar.concat([kaynak + '\n;return null;'])).apply(null, degerler);
      } catch (e) { return null; }
      return W.data || null;
    }).catch(function () { return null; });
  }

  /* Bir ünitenin ders dosyaları.
     İki adlandırma var: çoğu sınıfta "<sınıf>_<ünite>_<ders>.js", 7. sınıfın
     Mektep kitabında ünite başına tek dosya "<sınıf>_<ünite>.js".
     Klasör SEÇİLİ KİTABA göre değişir (y2627/, sec10/); bu yüzden yol,
     sitenin kendi çözücüsü KidefSinifVeri.dersYolu ile bulunur —
     burada ayrıca eşleme tutulmaz, kitap seçimi değişince kendiliğinden
     doğru klasöre gider. */
  function dersYolu(id) {
    try {
      var v = window.KidefSinifVeri;
      if (v && v.dersYolu) return v.dersYolu(id);
    } catch (e) {}
    return 'muhadese/veri/' + id + '.js';
  }
  function uniteVerisi(sinif, unite) {
    var kimlikler = [sinif + '_' + unite];
    for (var d = 1; d <= 6; d++) kimlikler.push(sinif + '_' + unite + '_' + d);
    return Promise.all(kimlikler.map(function (id) { return dosyaOku(dersYolu(id)); }))
      .then(function (ds) { return ds.filter(Boolean); });
  }

  /* ---------- yardımcılar ---------- */
  function arCumle(words) {
    return words.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); })
      .map(function (w) { return String(w.ar || '').trim(); }).filter(Boolean).join(' ').trim();
  }
  function trCumle(words) {
    return words.map(function (w) { return String(w.tr || '').trim(); }).filter(Boolean).join(' ')
      .replace(/\s+([,.;:?!])/g, '$1').trim();
  }
  function arSozcukler(words) {
    return words.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); })
      .map(function (w) { return String(w.ar || '').trim(); }).filter(Boolean);
  }
  function soruMu(s) { return /[؟?]\s*$/.test(s); }
  function temiz(s) { return String(s || '').replace(/["«»]/g, '').trim(); }

  /* tekrar üretilebilir sıra: aynı ünite → aynı sorular, aynı numaralar */
  function tohum(str) {
    var h = 1779033703 ^ str.length;
    for (var i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    return function () {
      h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }
  function karistir(dizi, anahtar) {
    var r = tohum(anahtar), a = dizi.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  /* ---------- üretim ---------- */
  function uret(sinif, unite, uniteAd) {
    var anahtar = sinif + '_' + unite;
    if (ONBELLEK[anahtar]) return Promise.resolve(ONBELLEK[anahtar]);

    return uniteVerisi(sinif, unite).then(function (dersler) {
      var cumleler = [], diyaloglar = [], sozcukler = [];
      dersler.forEach(function (d) {
        (d.sentence || []).forEach(function (c) {
          if (!c || !c.words || c.words.length < 2) return;
          var ar = arCumle(c.words), tr = trCumle(c.words);
          if (ar && tr) cumleler.push({ ar: ar, tr: tr, words: c.words });
        });
        (d.dialog || []).forEach(function (g) {
          if (!g || !g.p1 || !g.p2) return;
          var s = { sAr: arCumle(g.p1), sTr: trCumle(g.p1), cAr: arCumle(g.p2), cTr: trCumle(g.p2) };
          if (s.sAr && s.cAr) diyaloglar.push(s);
        });
        (d.words || []).forEach(function (w) {
          if (w && w.ar && w.tr) sozcukler.push({ ar: String(w.ar).trim(), tr: String(w.tr).trim() });
        });
      });
      /* sözcükleri tekille */
      var gorulen = {}, tekil = [];
      sozcukler.forEach(function (w) {
        var k = w.ar.replace(HAREKE, '');
        if (gorulen[k]) return;
        gorulen[k] = 1; tekil.push(w);
      });
      sozcukler = tekil;

      var out = [], n = 0;
      var ad = uniteAd || (unite + '. ünite');
      function ekle(tur, zorluk, q) {
        q.id = 'kl' + (++n);
        q.tip = tur;
        q.zorluk = zorluk;
        q.klasik = true;
        out.push(q);
      }

      /* 1 — Arapçadan Türkçeye çeviri */
      karistir(cumleler.filter(function (c) { return c.words.length >= 3; }), 'ceviri-ar|' + anahtar)
        .slice(0, 14).forEach(function (c) {
          ekle('kl-ceviri-ar', 2, {
            soru: 'Aşağıdaki cümleyi Türkçeye çeviriniz.',
            arapca: c.ar, cevapYazi: c.tr, satir: 2
          });
        });

      /* 2 — Türkçeden Arapçaya çeviri */
      karistir(cumleler.filter(function (c) { return c.words.length >= 3; }), 'ceviri-tr|' + anahtar)
        .slice(0, 12).forEach(function (c) {
          ekle('kl-ceviri-tr', 3, {
            soru: 'Aşağıdaki cümleyi Arapçaya çeviriniz: “' + c.tr + '”',
            cevapYazi: c.ar, satir: 2
          });
        });

      /* 3 — Boşluk doldurma: cümleden bir sözcük çıkarılır */
      karistir(cumleler.filter(function (c) { return c.words.length >= 3; }), 'bosluk|' + anahtar)
        .slice(0, 12).forEach(function (c, i) {
          var p = arSozcukler(c.words);
          var yer = 1 + (i % Math.max(1, p.length - 1));
          if (yer >= p.length) yer = p.length - 1;
          var eksik = p[yer], kopya = p.slice();
          kopya[yer] = BOSLUK_ISARETI;
          ekle('kl-bosluk', 2, {
            soru: 'Boşluğa uygun sözcüğü yazınız. (Cümlenin Türkçesi: “' + c.tr + '”)',
            arapca: kopya.join(' '), cevapYazi: eksik, satir: 1
          });
        });

      /* 4 — Karışık sözcüklerden cümle kurma (motor sözcükleri karıştırır) */
      karistir(cumleler.filter(function (c) { return c.words.length >= 3 && c.words.length <= 8; }), 'kurma|' + anahtar)
        .slice(0, 10).forEach(function (c) {
          ekle('kl-kurma', 2, {
            soru: 'Sözcükleri doğru sıraya koyarak cümleyi yazınız. (Anlamı: “' + c.tr + '”)',
            parcalar: arSozcukler(c.words), bicim: 'surukle', cevapYazi: c.ar
          });
        });

      /* 5 — Sözcüğün karşılığı */
      karistir(sozcukler, 'sozcuk|' + anahtar).slice(0, 16).forEach(function (w) {
        ekle('kl-sozcuk', 1, {
          soru: 'Aşağıdaki sözcüğün Türkçe karşılığını yazınız.',
          arapca: w.ar, cevapYazi: w.tr, satir: 1
        });
      });

      /* 6 — Eşleştirme: beşerli öbekler */
      var es = karistir(sozcukler, 'es|' + anahtar);
      for (var i = 0; i + 5 <= es.length && i < 20; i += 5) {
        ekle('kl-eslestirme', 1, {
          soru: 'Sözcükleri Türkçe karşılıklarıyla eşleştiriniz.',
          ciftler: es.slice(i, i + 5).map(function (w) { return [w.ar, w.tr]; })
        });
      }

      /* 7 — Diyalogdan kısa cevaplı anlama */
      karistir(diyaloglar.filter(function (g) { return soruMu(g.sAr) || soruMu(g.sTr); }), 'anlama|' + anahtar)
        .slice(0, 10).forEach(function (g) {
          ekle('kl-anlama', 2, {
            soru: 'Aşağıdaki soruyu Arapça cevaplayınız.',
            arapca: g.sAr, cevapYazi: g.cAr, satir: 2
          });
        });

      /* 8 — Yazma */
      [['Arapça üç cümle yazınız.', 3], ['Arapça beş cümle yazınız.', 5]].forEach(function (x) {
        ekle('kl-yazma', 3, {
          soru: '“' + ad + '” konusunda ' + x[0],
          cevapYazi: '(Öğrenci üretimi — ünitenin sözcük ve yapılarıyla değerlendirilir.)',
          satir: x[1] + 1
        });
      });
      if (diyaloglar.length) {
        var dd = karistir(diyaloglar, 'yazma-diyalog|' + anahtar)[0];
        ekle('kl-yazma', 3, {
          soru: 'Aşağıdaki soruya yazılı olarak Arapça cevap veriniz.',
          arapca: dd.sAr, cevapYazi: dd.cAr, satir: 3
        });
      }

      /* 9 — Konuşma görevi (uygulamalı sınav) */
      ekle('kl-konusma', 2, {
        soru: '“' + ad + '” konusunda bir dakika Arapça konuşunuz. ' +
              '(Uygulamalı — öğretmen dinler, ölçütlere göre puanlar.)',
        cevapYazi: '(Sözlü anlatım — akıcılık, sözcük kullanımı ve doğruluk ölçütleriyle değerlendirilir.)',
        satir: 0
      });
      if (diyaloglar.length >= 2) {
        var ik = karistir(diyaloglar, 'konusma|' + anahtar).slice(0, 2);
        ekle('kl-konusma', 2, {
          soru: 'Arkadaşınızla aşağıdaki soruyu kullanarak karşılıklı konuşunuz.',
          arapca: ik[0].sAr,
          cevapYazi: '(Karşılıklı konuşma — örnek cevap: ' + ik[0].cAr + ')',
          satir: 0
        });
      }

      /* 10 — Dinleme görevi: öğretmen okur, öğrenci cevaplar */
      karistir(diyaloglar, 'dinleme|' + anahtar).slice(0, 4).forEach(function (g) {
        ekle('kl-dinleme', 2, {
          soru: 'Öğretmeninizin okuyacağı soruyu dinleyip Arapça cevap yazınız. ' +
                '(Okunacak metin cevap anahtarındadır.)',
          cevapYazi: 'Okunacak: ' + g.sAr + '  —  Beklenen cevap: ' + g.cAr,
          satir: 2
        });
      });

      /* ---- varsayılan KAPALI türler ---- */

      /* 11 — Harekeleme */
      karistir(cumleler.filter(function (c) { return HAREKE.test(c.ar); }), 'hareke|' + anahtar)
        .slice(0, 8).forEach(function (c) {
          ekle('kl-hareke', 3, {
            soru: 'Aşağıdaki cümleyi harekeleyiniz. (Anlamı: “' + c.tr + '”)',
            arapca: c.ar.replace(HAREKE, ''), cevapYazi: c.ar, satir: 1
          });
        });

      /* 12 — Doğru/yanlış + düzeltme: bir sözcük başka cümleden değiştirilir */
      var dy = karistir(cumleler.filter(function (c) { return c.words.length >= 3; }), 'duzeltme|' + anahtar).slice(0, 8);
      dy.forEach(function (c, i) {
        var p = arSozcukler(c.words);
        var baska = arSozcukler(dy[(i + 1) % dy.length].words);
        var yer = 1 + (i % Math.max(1, p.length - 1));
        if (yer >= p.length) yer = p.length - 1;
        var bozuk = p.slice();
        bozuk[yer] = baska[Math.min(yer, baska.length - 1)];
        if (bozuk.join(' ') === p.join(' ')) return;
        ekle('kl-duzeltme', 3, {
          soru: 'Aşağıdaki cümle anlamca doğru mu? Yanlışsa düzeltip yeniden yazınız. ' +
                '(Olması gereken anlam: “' + c.tr + '”)',
          arapca: bozuk.join(' '), cevapYazi: c.ar, satir: 2
        });
      });

      /* 13 — Verilen sözcüklerle özgün cümle */
      var uc = karistir(sozcukler, 'uretim|' + anahtar);
      for (var j = 0; j + 3 <= uc.length && j < 12; j += 3) {
        var grup = uc.slice(j, j + 3);
        ekle('kl-uretim', 3, {
          soru: 'Aşağıdaki sözcüklerin her birini kullanarak birer Arapça cümle kurunuz.',
          arapca: grup.map(function (w) { return w.ar; }).join('  ·  '),
          cevapYazi: '(Öğrenci üretimi — sözcükler: ' + grup.map(function (w) { return w.tr; }).join(', ') + ')',
          satir: 3
        });
      }

      ONBELLEK[anahtar] = out;
      return out;
    });
  }

  window.KidefKlasik = {
    uret: uret,
    /* Varsayılan açık türler: temel set + yazma/üretim (öğretmen seçimi).
       Öteki türler sayfadaki "Soru türleri" kutusundan açılır. */
    VARSAYILAN: ['kl-ceviri-ar', 'kl-ceviri-tr', 'kl-bosluk', 'kl-kurma', 'kl-sozcuk',
                 'kl-eslestirme', 'kl-anlama', 'kl-yazma', 'kl-konusma', 'kl-dinleme'],
    TUR_ADI: {
      'kl-ceviri-ar': 'Çeviri (Ar→Tr)', 'kl-ceviri-tr': 'Çeviri (Tr→Ar)',
      'kl-bosluk': 'Boşluk doldurma', 'kl-kurma': 'Cümle kurma',
      'kl-sozcuk': 'Sözcük karşılığı', 'kl-eslestirme': 'Eşleştirme',
      'kl-anlama': 'Okuma-anlama', 'kl-yazma': 'Yazma',
      'kl-konusma': 'Konuşma (uygulamalı)', 'kl-dinleme': 'Dinleme (uygulamalı)',
      'kl-hareke': 'Harekeleme', 'kl-duzeltme': 'Yanlışı düzeltme',
      'kl-uretim': 'Sözcüklerle cümle kurma'
    }
  };
})();
