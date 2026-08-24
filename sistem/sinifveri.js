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
    /* 6. sınıf soruları muhâdese ders verisinden ÜRETİLİYOR
       (oyunlar/uret_biy6.py); ders verisi büyürse betik yeniden
       çalıştırılır ve buradaki sayı da güncellenir. */
    sinif6:      { sinif: 6,  seviye: 1, sira: 1, soru: 173 },
    sinif7:      { sinif: 7,  seviye: 1, sira: 2, soru: 125 },
    sinif9:      { sinif: 9,  seviye: 1, sira: 3, soru: 72 },
    sinif10:     { sinif: 10, seviye: 2, sira: 4, soru: 64 },
    /* genel konular — her sınıfta görünür */
    alfabe:      { sinif: 0,  seviye: 1, sira: 1, soru: 138 },
    kelimeler:   { sinif: 0,  seviye: 1, sira: 3, soru: 71 },
    edatlar:     { sinif: 0,  seviye: 2, sira: 3, soru: 25 },
    vezinler:    { sinif: 0,  seviye: 3, sira: 1, soru: 53 },
    /* Kalıplar tablosunun okuduğu veriden ÜRETİLİYOR (oyunlar/uret_kaliplar.py);
       sorular oyunlar/biy_kaliplar.js dosyasında durur. Veri büyürse betik
       yeniden çalıştırılır ve buradaki sayı da güncellenir. */
    kaliplar:    { sinif: 0,  seviye: 3, sira: 2, soru: 459 },
    dilbilgisi1: { sinif: 0,  seviye: 3, sira: 3, soru: 20 },
    dilbilgisi2: { sinif: 0,  seviye: 3, sira: 4, soru: 18 },
    /* tamlamavecumleler.html testinin soruları — aynı havuz burada da sorulur */
    tamlamacumle:{ sinif: 0,  seviye: 3, sira: 5, soru: 156 },
    /* tamlamavecumleler.html İ'RAB TESTİ — örnek havuzundan üretilen
       159 soru (hâl · görev · alâmet · lafzen/takdiren/mahallen) */
    irab:        { sinif: 0,  seviye: 3, sira: 6, soru: 159 }
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
    /* 6. sınıfın ALTI ÜNİTESİNİN muhâdese cümlelerinden üretildi
       (6_1_1 … 6_6_3); dört seviyenin de olgusu bu ünitelerde geçiyor.
       5. ve 6. ünite eklenince 160 → 300 cümleye çıktı. */
    6:  { cumle: 300, kelime: 1206, seviye: 4 },
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

  /* ------------------------------------------------------------------
     3) ÖĞRETİM YILI — hangi sınıfın verisi hangi yıla/programa ait?

     Site şu an iki müfredat yılını birden taşıyor: 5-6-7'nin ders verisi
     bir yıla, 9-10'unki başka yıla ait. Etiketler bunu görünür kılar.

     ⚠️ YENİ YIL EKLEMEK — sınıfın dizisine BAŞA bir satır ekle (en yeni
        önce). `onek`, o yılın ders verisinin nerede durduğunu söyler:
          onek: ''         → muhadese/veri/6_1_1.js      (bugünkü yer)
          onek: 'y2627/'   → muhadese/veri/y2627/6_1_1.js
        Böylece var olan dosyaların yeri değişmez; yeni yıl kendi
        klasörüne girer. Sınıfın birden çok yılı olunca kartlarda ve
        yarışmada seçici kendiliğinden çıkar, tek yıl varsa yalnız
        rozet görünür.

     NOT: Buradaki yıl DERS VERİSİ içindir. dosyalar/ altındaki plan ve
     sınav evrakları ayrı ilerler — 6. sınıfta evraklar 2026-2027
     programına göre, ders verisi ise hâlâ 2025-2026 kitabına göredir.
     ------------------------------------------------------------------ */
  var VERI_YILI = {
    5:  [{ yil: '2025-2026', program: '2025 TYMM Arapça Programı (5-8. sınıflar)', onek: '' }],
    6:  [{ yil: '2025-2026', program: 'Önceki program · 2025 ders kitabı (6 ünite)', onek: '' }],
    7:  [{ yil: '2026-2027', program: '2025 TYMM Arapça Programı (5-8. sınıflar)', onek: '' }],
    9:  [{ yil: '2026-2027', program: '2026 Arapça Programı (9-10. sınıflar)', onek: '' }],
    10: [{ yil: '2026-2027', program: '2026 Arapça Programı (9-10. sınıflar)', onek: '' }]
  };

  var YIL_ANAHTAR = 'kidef_veri_yili';   /* localStorage: { "6": "2026-2027" } */

  function yilKaydiOku() {
    try { return JSON.parse(localStorage.getItem(YIL_ANAHTAR) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function yilKaydiYaz(k) {
    try { localStorage.setItem(YIL_ANAHTAR, JSON.stringify(k || {})); } catch (e) {}
  }

  /* Sınıfın yıl listesi — en yeni önce. Sınıf yoksa boş dizi. */
  function veriYillari(sinif) {
    var n = sayi(sinif);
    return (n && VERI_YILI[n]) ? VERI_YILI[n].slice() : [];
  }

  /* Belirli bir yılın kaydı; yil verilmezse listenin ilki (en yeni). */
  function veriYili(sinif, yil) {
    var d = veriYillari(sinif);
    if (!d.length) return null;
    if (!yil) return d[0];
    for (var i = 0; i < d.length; i++) if (d[i].yil === yil) return d[i];
    return d[0];
  }

  /* Kullanıcının bu sınıf için seçtiği yıl; seçmediyse en yenisi. */
  function seciliVeriYili(sinif) {
    var n = sayi(sinif);
    if (!n) return null;
    return veriYili(n, yilKaydiOku()[String(n)]);
  }

  /* Seçimi kaydeder ve seçilen kaydı döner. Geçersiz yıl yok sayılır. */
  function veriYiliSec(sinif, yil) {
    var n = sayi(sinif), d = veriYillari(n);
    if (!n || !d.length) return null;
    var bulundu = null;
    for (var i = 0; i < d.length; i++) if (d[i].yil === yil) bulundu = d[i];
    if (!bulundu) return seciliVeriYili(n);
    var k = yilKaydiOku();
    k[String(n)] = yil;
    yilKaydiYaz(k);
    return bulundu;
  }

  function kacis(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Rozet/seçici HTML'i. Tek yıl varsa <span>, birden çoksa <select>.
     Sınıfın kaydı yoksa boş dize döner — çağıran yer bozulmaz. */
  function yilRozetHtml(sinif, ayar) {
    var n = sayi(sinif), d = veriYillari(n);
    if (!d.length) return '';
    ayar = ayar || {};
    var s = seciliVeriYili(n), sinif_ = ayar.sinif || '';
    if (d.length < 2 || ayar.secici === false) {
      return '<span class="kd-yil ' + kacis(sinif_) + '" title="' + kacis(s.program) + '">' +
             '<span class="kd-yil-nokta" aria-hidden="true"></span>' + kacis(s.yil) + '</span>';
    }
    var o = d.map(function (x) {
      return '<option value="' + kacis(x.yil) + '"' + (x.yil === s.yil ? ' selected' : '') +
             ' title="' + kacis(x.program) + '">' + kacis(x.yil) + '</option>';
    }).join('');
    return '<label class="kd-yil kd-yil-sec ' + kacis(sinif_) + '" title="' + kacis(s.program) + '">' +
           '<span class="kd-yil-nokta" aria-hidden="true"></span>' +
           '<span class="kd-yil-etiket">Öğretim yılı</span>' +
           '<select data-kd-yil-sinif="' + n + '" aria-label="' + n + '. sınıf öğretim yılı">' +
           o + '</select></label>';
  }

  /* Seçicinin ortak davranışı: sayfa başına BİR kez bağlanır, sonradan
     basılan rozetler de çalışır (olay belgeye bağlı). Seçim kaydedilir ve
     `kidef:veriyili` olayı yayılır — ilgilenen sayfa dinleyip kendini
     tazeler:
        document.addEventListener('kidef:veriyili', function (e) {
          e.detail = { sinif: 6, yil: '2026-2027', kayit: {…} }
        });
     Dinleyen yoksa hiçbir şey olmaz; seçim yine de saklanır. */
  function yilBagla() {
    if (document.__kdYilBagli) return;
    document.__kdYilBagli = 1;
    document.addEventListener('change', function (e) {
      var el = e.target;
      if (!el || !el.getAttribute) return;
      var n = el.getAttribute('data-kd-yil-sinif');
      if (!n) return;
      var kayit = veriYiliSec(n, el.value);
      if (!kayit) return;
      var kutu = el.closest ? el.closest('.kd-yil') : null;
      if (kutu) kutu.setAttribute('title', kayit.program);
      try {
        document.dispatchEvent(new CustomEvent('kidef:veriyili', {
          detail: { sinif: sayi(n), yil: kayit.yil, kayit: kayit }
        }));
      } catch (h) {}
    }, false);
  }

  /* Rozetin ortak stili — her sayfa kendi CSS'ine eklemesin diye burada.
     Seçici davranışını da bağlar; çağıran tek satırla işini bitirir. */
  function yilStilKur() {
    yilBagla();
    if (document.getElementById('kdYilStil')) return;
    var st = document.createElement('style');
    st.id = 'kdYilStil';
    st.textContent =
      /* Rozet her zeminde okunur olmalı: DOLU açık yeşil zemin + koyu yazı.
         Saydam zemin ve düşük opaklık, kartların renkli arka planında yılı
         soluk gösteriyordu; ikisi de kaldırıldı. */
      '.kd-yil{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;' +
      'font-weight:700;line-height:1;padding:6px 11px;border-radius:999px;' +
      'background:#E6F7F2;color:#0B5F51;border:1px solid #9FD9CB;' +
      'white-space:nowrap;vertical-align:middle;text-shadow:none;}' +
      '.kd-yil-nokta{width:7px;height:7px;border-radius:50%;background:#0E9E86;flex:none;}' +
      '.kd-yil-etiket{color:#3F6F65;font-weight:600;}' +
      '.kd-yil-sec{cursor:pointer;padding-right:7px;}' +
      '.kd-yil-sec select{font:inherit;font-weight:700;color:#0B5F51;background:transparent;' +
      'border:0;padding:0 2px;cursor:pointer;outline:none;}' +
      '.kd-yil-sec select option{color:#0B5F51;background:#fff;}' +
      '.kd-yil-sec select:focus-visible{outline:2px solid #0E9E86;outline-offset:2px;border-radius:6px;}' +
      '@media (prefers-color-scheme: dark){' +
      '.kd-yil{background:#0C3F36;color:#8FEAD5;border-color:#1E7A67;}' +
      '.kd-yil-etiket{color:#67C7B2;}' +
      '.kd-yil-sec select{color:#8FEAD5;}' +
      '.kd-yil-sec select option{color:#0B5F51;background:#fff;}}';
    (document.head || document.documentElement).appendChild(st);
  }

  window.KidefSinifVeri = {
    biyKonu:     BIY_KONU,
    biyKonulari: biyKonulari,
    biySiniflar: biySiniflar,
    biyIlkKonu:  biyIlkKonu,
    biyKonuGoc:  konuGoc,
    sozlukVeri:      SOZLUK_SINIF,
    sozlukSinif:     sozlukSinif,
    sozlukSiniflari: sozlukSiniflari,
    /* öğretim yılı */
    veriYiliKayit:   VERI_YILI,
    veriYillari:     veriYillari,
    veriYili:        veriYili,
    seciliVeriYili:  seciliVeriYili,
    veriYiliSec:     veriYiliSec,
    yilRozetHtml:    yilRozetHtml,
    yilStilKur:      yilStilKur,
    yilBagla:        yilBagla
  };
})();
