/* =====================================================================
   KIDEF · SORU KÂĞIDI HAZIRLA — sinifici/sorukagidi.js
   ---------------------------------------------------------------------
   Öğretmen Bilgi Yarışması'nın soru havuzundan soru tipini ve soruları
   tek tek seçer; A4 soru kâğıdı hazırlanır:
     • PDF İndir  — jsPDF + html2canvas (oyunlar/cevrimdisi_pdf.js,
                    Bilgi Yarışması'nın çevrimdışı PDF motoru)
     • Yazdır     — tarayıcının kendi baskısı (vektör, en keskin çıktı;
                    "PDF olarak kaydet" de buradan)

   HAVUZ ÇALIŞMA ANINDA OKUNUR
     oyunlar/biy_kaliplar.js + oyunlar/bilgiyarismasikacom.js dosyaları
     metin olarak alınır ve Firebase/DOM taklit edilerek çalıştırılır;
     yalnız KONULAR, TIP_BILGI, BICIM_BILGI okunur. Yarışmaya eklenen her
     yeni soru burada da KENDİLİĞİNDEN görünür — ayrı bir veri kopyası yok.

   ARAPÇA İÇİN İKİ KURAL (bozulursa harfler birleşmez / yer değiştirir)
     1) Arapça metin tek metin düğümünde kalır; kelime parça parça
        ayrı öğelere bölünmez (sıralama sorularında parçalar zaten ayrı).
     2) Karışık (Türkçe içinde Arapça) satırlarda Arapça kısımlar
        <bdi dir="rtl"> içine alınır; noktalama ve «» yer değiştirmez.
        Arapça metne letter-spacing verilmez — html2canvas o zaman harf
        harf çizer ve bağlantılar kopar.
   ===================================================================== */
(function () {
  'use strict';

  var HAVUZ_DOSYALARI = ['oyunlar/biy_kaliplar.js', 'oyunlar/bilgiyarismasikacom.js'];
  var PDF_ARACI = 'oyunlar/cevrimdisi_pdf.js';
  var DEPO = 'kidef-sorukagidi-v1';
  var A4_G = 794, A4_Y = 1123;                 // 96 dpi'de A4 = 210 × 297 mm
  var LISTE_ADIM = 40;                         // havuzda bir seferde gösterilen soru

  var $ = function (s, k) { return (k || document).querySelector(s); };
  var $$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };

  /* =====================================================================
     1) HAVUZU OKU
     ===================================================================== */
  function yapay(h) {
    h = h || function () {};
    return new Proxy(h, {
      get: function (t, k) {
        if (k in t) return t[k];
        if (k === Symbol.toPrimitive) return function () { return ''; };
        if (k === 'then') return undefined;            // await edilen taklit takılmasın
        return yapay();
      },
      set: function (t, k, v) { t[k] = v; return true; },
      apply: function () { return yapay(); },
      construct: function () { return yapay(); }
    });
  }

  function havuzuOku() {
    /* window taklidi: sitenin kendi küreselleri (BÜYÜK harfle ya da _ ile
       başlayanlar: BIY_EK_KONULAR, MAARIF_SET, __CDD…) gerçek tarayıcıdaki
       gibi YOKTUR; küçük harfli tarayıcı yöntemleri sessiz taklittir.
       Hepsi taklit olsaydı "window.BIY_EK_KONULAR || []" dolu sayılır ve
       Kalıplar Tablosu'nun 459 sorusu kaybolurdu. */
    var Wt = {};
    var W = new Proxy(Wt, {
      get: function (t, k) {
        if (k in t) return t[k];
        if (typeof k !== 'string' || /^[A-Z_]/.test(k)) return undefined;
        return yapay();
      },
      set: function (t, k, v) { t[k] = v; return true; }
    });
    var hic = function () { return 0; };
    var adlar = ['window', 'self', 'globalThis', 'top', 'parent', 'document', 'firebase',
      'localStorage', 'sessionStorage', 'location', 'history', 'alert', 'confirm', 'prompt',
      'open', 'fetch', 'gtag', 'addEventListener', 'removeEventListener', 'setTimeout',
      'setInterval', 'requestAnimationFrame', 'navigator'];
    var degerler = [W, W, W, W, W, yapay(), yapay(), yapay(), yapay(),
      { search: '', href: '', hostname: '', pathname: '', hash: '' }, yapay(), hic,
      function () { return false; }, function () { return null; }, hic,
      function () { return new Promise(function () {}); }, hic, hic, hic, hic, hic, hic,
      { userAgent: '', language: 'tr' }];
    var kuyruk = HAVUZ_DOSYALARI.map(function (y) {
      return fetch(y, { cache: 'no-cache' }).then(function (r) {
        if (!r.ok) throw new Error(y + ' alınamadı (' + r.status + ')');
        return r.text();
      });
    });
    return Promise.all(kuyruk).then(function (metinler) {
      var sonuc = null;
      metinler.forEach(function (kaynak, i) {
        var ana = /bilgiyarismasikacom\.js$/.test(HAVUZ_DOSYALARI[i]);
        var kuyrukKod = ana
          ? '\n;return {KONULAR: typeof KONULAR!=="undefined"?KONULAR:[],' +
            ' TIP_BILGI: typeof TIP_BILGI!=="undefined"?TIP_BILGI:{},' +
            ' BICIM_BILGI: typeof BICIM_BILGI!=="undefined"?BICIM_BILGI:{},' +
            ' ICERIK_SIRA: typeof ICERIK_SIRA!=="undefined"?ICERIK_SIRA:null};'
          : '';
        var fn = Function.apply(null, adlar.concat([kaynak + kuyrukKod]));
        var r = fn.apply(null, degerler);
        if (ana) sonuc = r;
      });
      if (!sonuc || !sonuc.KONULAR || !sonuc.KONULAR.length) throw new Error('Soru havuzu boş geldi.');
      return sonuc;
    });
  }

  /* =====================================================================
     2) DURUM
     ===================================================================== */
  var V = { konular: [], sorular: [], harita: {}, tip: {}, bicim: {} };
  var suz = { konu: new Set(), tip: new Set(), bicim: new Set(), zorluk: new Set(), ara: '' };
  var secili = [];                 // sıralı anahtarlar: "konuId#soruId"
  var gosterilen = LISTE_ADIM;
  var ayar = {
    baslik: 'Arapça Değerlendirme', okul: '', ders: 'Arapça', sinif: '',
    tarih: bugun(), ogrenci: true, anahtar: true, kitapcik: 'tek', tohum: 1,
    puan: true, toplam: 100, boyut: 'normal', kalite: 'keskin'
  };

  function bugun() {
    var d = new Date();
    return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear();
  }

  function kaydet() {
    try { localStorage.setItem(DEPO, JSON.stringify({ secili: secili, ayar: ayar })); } catch (e) {}
  }
  function geriYukle() {
    try {
      var d = JSON.parse(localStorage.getItem(DEPO) || 'null');
      if (!d) return;
      if (Array.isArray(d.secili)) secili = d.secili;
      if (d.ayar) Object.keys(ayar).forEach(function (k) { if (k in d.ayar) ayar[k] = d.ayar[k]; });
      ayar.tarih = ayar.tarih || bugun();
      ayar.tohum = Math.max(1, Math.min(9999, parseInt(ayar.tohum, 10) || 1));
    } catch (e) {}
  }

  /* =====================================================================
     3) YARDIMCILAR
     ===================================================================== */
  var AR = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]/;
  var AR_PARCA = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff](?:[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff\u064b-\u065f\u0670\u200c\u200d\u200e\u200f\u202a-\u202e\u2066-\u2069 ._\-\u060c\u061b\u061f!:]*[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff\u064b-\u065f\u0670_.\u060c\u061b\u061f!\u202c\u2069])?/g;

  function kac(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function arMi(s) { return AR.test(String(s || '')); }
  /* Türkçe içindeki Arapça parçaları yalıtır (bidi karışmasın) */
  function karisik(s) {
    return kac(s).replace(AR_PARCA, function (m) { return '<bdi dir="rtl" class="ar">' + m + '</bdi>'; });
  }
  /* Tamamen Arapça bir öğe: tek metin düğümü, rtl */
  function arKutu(s, sinif) {
    return '<span dir="rtl" class="ar ' + (sinif || '') + '">' + kac(s) + '</span>';
  }
  function metin(s) { return arMi(s) && !/[a-zçğıöşü]{3,}/i.test(s) ? arKutu(s) : karisik(s); }

  function normalle(s) {   // arama: harekeyi ve büyük/küçük harfi yok say
    return String(s || '').toLocaleLowerCase('tr')
      .replace(/[\u064b-\u065f\u0670\u0640\u200c-\u200f\u202a-\u202e\u2066-\u2069]/g, '')
      .replace(/[\u0623\u0625\u0622\u0671]/g, '\u0627').replace(/\u0649/g, '\u064a').replace(/\u0629/g, '\u0647');
  }

  /* tekrar üretilebilir karıştırma: aynı soru + aynı kitapçık → aynı sıra */
  function tohum(str) {
    var h = 1779033703 ^ str.length;
    for (var i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    return function () {
      h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }
  function karistir(dizi, anahtar, serbest) {
    var r = tohum(anahtar), a = dizi.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    /* sıralama sorusunda karışık hâl doğru hâlle aynı çıkmasın */
    if (!serbest && a.length > 1 && a.every(function (x, i) { return x === dizi[i]; })) a.push(a.shift());
    return a;
  }

  /* ---------------------------------------------------------------------
     Doğru şıkkın kâğıttaki yeri.
     Veride doğru şık çoğunlukla İLK sırada durur (yarışma ekranda karıştırır);
     kâğıtta karıştırılmazsa cevapların çoğu "A" olur. Her kitapçık için yerler
     önceden seçilir: her soruda eşit olasılıklı rastgele, ama
       · aynı harf üst üste en çok 2 kez gelir,
       · her harfin sayısı beklenenden en çok ±1,5 (uzun kâğıtta ±%40) sapar.
     Koşulu tutmayan dizi atılıp yeniden çekilir (tohumlu → önizleme, PDF ve
     baskı hep aynı cevap anahtarını verir).
     --------------------------------------------------------------------- */
  function sikliMi(q) {
    return bicimi(q) !== 'dogruyanlis' && Array.isArray(q.secenekler) && q.secenekler.length > 2 &&
      typeof q.dogru === 'number' && q.dogru >= 0 && q.dogru < q.secenekler.length;
  }
  function cevapYerleri(kitap, sira) {
    var r = tohum('yer|' + ayar.tohum + '|' + kitap + '|' + sira.join(','));
    var sorular = sira.filter(function (a) { return sikliMi(V.harita[a].q); });
    var ks = sorular.map(function (a) { return Math.min(V.harita[a].q.secenekler.length, HARF.length); });
    var bek = HARF.map(function () { return 0; });
    ks.forEach(function (k) { for (var i = 0; i < k; i++) bek[i] += 1 / k; });
    var pay = bek.map(function (e) { return Math.max(1.5, e * 0.4); });
    var enIyi = null, enIyiCeza = Infinity;
    for (var d = 0; d < 400; d++) {
      var h = [], say = HARF.map(function () { return 0; });
      ks.forEach(function (k, j) {
        var yasak = j > 1 && h[j - 1] === h[j - 2] ? h[j - 1] : -1, aday = [];
        for (var i = 0; i < k; i++) if (i !== yasak) aday.push(i);
        var x = aday[Math.floor(r() * aday.length)]; h.push(x); say[x]++;
      });
      var ceza = 0;
      for (var i = 0; i < HARF.length; i++) ceza += Math.max(0, Math.abs(say[i] - bek[i]) - pay[i]);
      if (ceza < enIyiCeza) { enIyiCeza = ceza; enIyi = h; }
      if (!ceza) break;
    }
    var yer = {};
    sorular.forEach(function (a, j) { yer[a] = enIyi[j]; });
    return yer;
  }

  function bicimi(q) { return q.bicim || 'test'; }
  var HARF = ['A', 'B', 'C', 'D', 'E', 'F'];
  var KUCUK = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  /* =====================================================================
     4) HAVUZ LİSTESİ + SÜZGEÇLER
     ===================================================================== */
  function sayim(alan) {
    var s = {};
    suzulmus(alan).forEach(function (o) {
      var d = alan === 'konu' ? o.konu : alan === 'tip' ? o.q.tip : alan === 'bicim' ? bicimi(o.q) : o.q.zorluk;
      s[d] = (s[d] || 0) + 1;
    });
    return s;
  }
  /* haric: o eksen süzgeçte YOK sayılır → çiplerdeki sayı "bunu seçersem kaç soru kalır" */
  function suzulmus(haric) {
    var a = normalle(suz.ara);
    return V.sorular.filter(function (o) {
      if (haric !== 'konu' && suz.konu.size && !suz.konu.has(o.konu)) return false;
      if (haric !== 'tip' && suz.tip.size && !suz.tip.has(o.q.tip)) return false;
      if (haric !== 'bicim' && suz.bicim.size && !suz.bicim.has(bicimi(o.q))) return false;
      if (haric !== 'zorluk' && suz.zorluk.size && !suz.zorluk.has(o.q.zorluk)) return false;
      if (a && o.ara.indexOf(a) < 0) return false;
      return true;
    });
  }

  function cipler() {
    var gruplar = [
      ['konu', V.konular.map(function (k) { return [k.id, k.ad]; })],
      ['tip', Object.keys(V.tip).map(function (k) { return [k, (V.tip[k].emoji || '') + ' ' + V.tip[k].ad]; })],
      ['bicim', Object.keys(V.bicim).map(function (k) { return [k, (V.bicim[k].emoji || '') + ' ' + V.bicim[k].ad]; })],
      ['zorluk', [[1, 'Kolay'], [2, 'Orta'], [3, 'Zor']]]
    ];
    gruplar.forEach(function (g) {
      var alan = g[0], kutu = $('#suz-' + alan);
      if (!kutu) return;
      var say = sayim(alan);
      kutu.innerHTML = g[1].filter(function (x) { return say[x[0]] || suz[alan].has(x[0]); }).map(function (x) {
        var acik = suz[alan].has(x[0]);
        return '<button type="button" class="cip' + (acik ? ' acik' : '') + '" data-alan="' + alan +
          '" data-deger="' + kac(x[0]) + '" aria-pressed="' + acik + '">' + kac(x[1]) +
          '<small>' + (say[x[0]] || 0) + '</small></button>';
      }).join('');
    });
    var sayac = suz.konu.size + suz.tip.size + suz.bicim.size + suz.zorluk.size + (suz.ara ? 1 : 0);
    $('#suzTemizle').hidden = !sayac;
  }

  function soruOzeti(o) {
    var q = o.q, b = bicimi(q), h = '';
    if (q.arapca) h += '<div class="oz-ar">' + arKutu(q.arapca) + '</div>';
    if (q.secenekler && b !== 'dogruyanlis') {
      /* harf yok: kâğıtta şıklar karıştırılır, harfler orada belli olur */
      h += '<ul class="oz-sik">' + q.secenekler.map(function (s, i) {
        return '<li' + (i === q.dogru ? ' class="dogru"' : '') + '><b aria-hidden="true">' + (i === q.dogru ? '✓' : '–') + '</b> ' +
          metin(s) + (i === q.dogru ? '<span class="gizli"> (doğru cevap)</span>' : '') + '</li>';
      }).join('') + '</ul>';
    }
    if (b === 'dogruyanlis' && q.secenekler) h += '<div class="oz-dy">Cevap: <b>' + kac(q.secenekler[q.dogru]) + '</b></div>';
    if (q.ciftler) h += '<div class="oz-cift">' + q.ciftler.map(function (c) {
      return '<span>' + metin(c[0]) + ' <i>↔</i> ' + metin(c[1]) + '</span>'; }).join('') + '</div>';
    if (q.parcalar) h += '<div class="oz-parca">' + q.parcalar.map(function (p) { return '<span>' + metin(p) + '</span>'; }).join('') + '</div>';
    if (q.cevapYazi) h += '<div class="oz-dy">Cevap: ' + arKutu(q.cevapYazi) + '</div>';
    return h;
  }

  function liste() {
    var l = suzulmus(), kutu = $('#liste');
    $('#bulunan').textContent = l.length + ' soru';
    if (!l.length) {
      kutu.innerHTML = '<div class="bos">Bu süzgeçlerle soru yok. Bir süzgeci kaldırmayı dene.</div>';
      $('#dahaFazla').hidden = true; return;
    }
    kutu.innerHTML = l.slice(0, gosterilen).map(function (o) {
      var q = o.q, var_ = secili.indexOf(o.anahtar) >= 0, t = V.tip[q.tip] || {}, bi = V.bicim[bicimi(q)] || {};
      return '<article class="soru' + (var_ ? ' secili' : '') + '" data-a="' + kac(o.anahtar) + '">' +
        '<div class="soru-ust"><span class="rozet">' + kac(o.konuAd) + '</span>' +
        '<span class="rozet r-tip">' + kac((t.emoji || '') + ' ' + (t.ad || q.tip || '')) + '</span>' +
        '<span class="rozet r-bic">' + kac((bi.emoji || '') + ' ' + (bi.ad || '')) + '</span>' +
        '<span class="rozet r-z' + q.zorluk + '">' + ['', 'Kolay', 'Orta', 'Zor'][q.zorluk || 0] + '</span></div>' +
        '<p class="soru-kok">' + karisik(q.soru) + '</p>' +
        '<details><summary>Şıklar ve cevap</summary>' + soruOzeti(o) + '</details>' +
        '<button type="button" class="ekle" data-a="' + kac(o.anahtar) + '" aria-pressed="' + var_ + '">' +
        (var_ ? '✓ Kâğıtta' : '+ Kâğıda ekle') + '</button></article>';
    }).join('');
    $('#dahaFazla').hidden = l.length <= gosterilen;
    $('#dahaFazla').textContent = 'Daha fazla göster (' + (l.length - gosterilen) + ' soru daha)';
  }

  /* =====================================================================
     5) KÂĞIDIM (seçili sorular)
     ===================================================================== */
  function kagidim() {
    secili = secili.filter(function (a) { return V.harita[a]; });
    var kutu = $('#kagit');
    $$('.say-secili').forEach(function (e) { e.textContent = secili.length; });
    $('#kagitBos').hidden = !!secili.length;
    $('#kagitAraclar').hidden = !secili.length;
    ['#btnOnizle', '#btnPdf', '#btnYazdir'].forEach(function (s) { $(s).disabled = !secili.length; });
    var puanlar = puanDagit(secili.length);
    kutu.innerHTML = secili.map(function (a, i) {
      var o = V.harita[a];
      return '<li data-a="' + kac(a) + '"><span class="no">' + (i + 1) + '</span>' +
        '<span class="k-metin">' + karisik(o.q.soru) + '</span>' +
        (ayar.puan ? '<span class="k-puan">' + puanlar[i] + ' p</span>' : '') +
        '<span class="k-dug"><button type="button" data-is="yukari" aria-label="Yukarı taşı"' + (i ? '' : ' disabled') + '>↑</button>' +
        '<button type="button" data-is="asagi" aria-label="Aşağı taşı"' + (i < secili.length - 1 ? '' : ' disabled') + '>↓</button>' +
        '<button type="button" data-is="sil" aria-label="Kâğıttan çıkar">✕</button></span></li>';
    }).join('');
    $('#puanOzet').textContent = ayar.puan && secili.length
      ? 'Her soru ' + (puanlar[0] === puanlar[puanlar.length - 1] ? puanlar[0] : puanlar[puanlar.length - 1] + '–' + puanlar[0]) + ' puan · toplam ' + ayar.toplam
      : '';
    kaydet();
  }

  function puanDagit(n) {
    if (!n) return [];
    var t = Math.max(1, parseInt(ayar.toplam, 10) || 100), taban = Math.floor(t / n), art = t - taban * n;
    return Array.from({ length: n }, function (_, i) { return taban + (i < art ? 1 : 0); });
  }

  function ekleCikar(a) {
    var i = secili.indexOf(a);
    if (i >= 0) secili.splice(i, 1); else secili.push(a);
    liste(); kagidim();
  }

  /* =====================================================================
     6) SORUNUN KÂĞITTAKİ HÂLİ
     ===================================================================== */
  /* Bir sorunun kâğıt HTML'i + cevap anahtarındaki karşılığı */
  function kagitSorusu(o, no, puan, kitap, yer) {
    var q = o.q, b = bicimi(q), anahtarTohum = ayar.tohum + '|' + kitap + '|' + o.anahtar;
    var govde = '', cevap = '';
    var arKutusu = q.arapca ? '<div class="k-ar">' + arKutu(q.arapca) + '</div>' : '';

    if (b === 'dogruyanlis') {
      govde = arKutusu + '<div class="k-dy"><span><i></i> Doğru</span><span><i></i> Yanlış</span></div>';
      cevap = q.secenekler ? q.secenekler[q.dogru] : '';
      /* anahtarda tam yazılır: "D" kısaltması D şıkkıyla karışmasın */
    } else if (q.secenekler) {                                   // test + boşluk
      var sira = q.secenekler.map(function (_, i) { return i; });
      if (typeof yer === 'number' && sikliMi(q)) {
        /* doğru şık önceden seçilen yere, çeldiriciler karışık olarak kalan yerlere */
        sira = karistir(sira.filter(function (i) { return i !== q.dogru; }), anahtarTohum, true);
        sira.splice(Math.min(yer, sira.length), 0, q.dogru);
      } else if (q.secenekler.length > 2) {
        sira = karistir(sira, anahtarTohum, true);
      }
      var uzun = Math.max.apply(null, q.secenekler.map(function (s) { return String(s).length; }));
      /* sütun: kısa şıklar tek satırda (şık sayısı kadar), orta uzunlukta 2, uzunsa alt alta */
      var adet = q.secenekler.length;
      var sut = uzun <= 16 ? Math.min(adet, 5) : uzun <= 38 ? (adet === 3 ? 3 : 2) : 1;
      var ar = q.arSecenek || q.secenekler.every(arMi);
      govde = arKutusu + '<ol class="k-sik s' + sut + (ar ? ' ar-sik' : '') + '">' + sira.map(function (i, j) {
        return '<li><b>' + HARF[j] + ')</b> ' + metin(q.secenekler[i]) + '</li>';
      }).join('') + '</ol>';
      cevap = HARF[sira.indexOf(q.dogru)];
    } else if (q.ciftler) {                                      // eşleştirme
      var sol = q.ciftler.map(function (c) { return c[0]; }), sag = q.ciftler.map(function (c) { return c[1]; });
      var sagSira = karistir(sag.map(function (_, i) { return i; }), anahtarTohum);
      govde = '<div class="k-es"><ol class="es-sol">' + sol.map(function (s, i) {
          return '<li><b>' + (i + 1) + '.</b> ' + metin(s) + '<span class="es-kutu"></span></li>'; }).join('') +
        '</ol><ol class="es-sag">' + sagSira.map(function (i, j) {
          return '<li><b>' + KUCUK[j] + ')</b> ' + metin(sag[i]) + '</li>'; }).join('') + '</ol></div>';
      cevap = sol.map(function (_, i) { return (i + 1) + '-' + KUCUK[sagSira.indexOf(i)]; }).join('  ');
    } else if (q.parcalar) {                                     // harf/cümle sıralama
      var parca = karistir(q.parcalar, anahtarTohum);
      var harf = b === 'surukle' && q.parcalar.every(function (p) { return String(p).trim().length <= 2; });
      govde = '<div class="k-parca' + (harf ? ' harf' : '') + '" dir="rtl">' + parca.map(function (p) {
        return '<span>' + metin(p) + '</span>'; }).join('') + '</div><div class="k-cizgi"></div>';
      cevap = harf ? q.parcalar.join('') : q.parcalar.join(' ');
    } else if (q.cevapYazi) {                                    // yazma
      govde = arKutusu + (q.tuslar && q.tuslar.length
        ? '<div class="k-tus" dir="rtl"><small>Kullanabileceğin harfler:</small> ' + q.tuslar.map(function (t) { return arKutu(t); }).join(' ') + '</div>'
        : '') + '<div class="k-cizgi"></div>';
      cevap = q.cevapYazi;
    } else {
      govde = arKutusu + '<div class="k-cizgi"></div>';
    }
    var html = '<section class="k-soru" data-no="' + no + '" data-a="' + kac(o.anahtar) + '">' +
      '<div class="k-bas"><b class="k-no">' + no + '.</b><p>' + karisik(q.soru) + '</p>' +
      (ayar.puan ? '<span class="k-p">' + puan + ' p</span>' : '') + '</div>' + govde + '</section>';
    return { html: html, cevap: cevap };
  }

  /* =====================================================================
     7) SAYFALAMA
     ===================================================================== */
  function basHtml(kitap, ilk) {
    var sag = ayar.kitapcik === 'AB' ? '<div class="kb-harf">' + kitap + '<small>kitapçığı</small></div>' : '';
    if (!ilk) return '<header class="s-bas kisa"><span>' + kac(ayar.baslik) + '</span>' +
      (ayar.kitapcik === 'AB' ? '<span>' + kitap + ' kitapçığı</span>' : '') + '</header>';
    return '<header class="s-bas">' +
      '<div class="s-bas-sol">' + (ayar.okul ? '<div class="s-okul">' + kac(ayar.okul) + '</div>' : '') +
      '<h1>' + kac(ayar.baslik) + '</h1>' +
      '<div class="s-alt">' + [ayar.ders, ayar.sinif, ayar.tarih].filter(Boolean).map(kac).join(' · ') + '</div></div>' + sag +
      '</header>' +
      (ayar.ogrenci ? '<div class="s-kimlik">' +
        '<div class="gen"><b>Adı Soyadı <bdi dir="rtl" class="ar">الاسم</bdi></b></div>' +
        '<div><b>Numara <bdi dir="rtl" class="ar">الرقم</bdi></b></div>' +
        '<div><b>Sınıf <bdi dir="rtl" class="ar">الصف</bdi></b></div>' +
        '<div><b>Puan <bdi dir="rtl" class="ar">الدرجة</bdi></b></div></div>' : '');
  }
  function altHtml(no, n, kitap) {
    return '<footer class="s-alt-bilgi"><span>kidefarapca.com</span>' +
      (ayar.kitapcik === 'AB' && kitap ? '<span>' + kitap + ' kitapçığı</span>' : '<span></span>') +
      '<span>Sayfa ' + no + ' / ' + n + '</span></footer>';
  }

  function sayfaKabugu(kitap, ilk) {
    var s = document.createElement('div');
    s.className = 'sk-sayfa boy-' + ayar.boyut;
    s.setAttribute('data-kitap', kitap);
    s.innerHTML = basHtml(kitap, ilk) + '<div class="s-ic"></div>' + altHtml(1, 1, kitap);
    return s;
  }

  /* .s-ic sabit yükseklikte (flex:1, overflow:hidden); içerik ondan uzunsa taşmıştır */
  function tasti(ic) { return ic.scrollHeight > ic.clientHeight + 1; }

  /* sorular sırayla eklenir; taşan soru yeni sayfaya geçer (ölçerek) */
  function kitapcikKur(sahne, kitap, sira, puan) {
    var yer = cevapYerleri(kitap, sira), sayfalar = [], cevaplar = [];
    var s = sayfaKabugu(kitap, true); sahne.appendChild(s); sayfalar.push(s);
    sira.forEach(function (a, i) {
      var ks = kagitSorusu(V.harita[a], i + 1, puan[a], kitap, yer[a]);
      cevaplar.push(ks.cevap);
      var ic = $('.s-ic', s);
      ic.insertAdjacentHTML('beforeend', ks.html);
      if (tasti(ic) && ic.children.length > 1) {
        var son = ic.lastElementChild; ic.removeChild(son);
        s = sayfaKabugu(kitap, false); sahne.appendChild(s); sayfalar.push(s);
        $('.s-ic', s).appendChild(son);
      }
    });
    return { sayfalar: sayfalar, cevaplar: cevaplar };
  }

  function anahtarSayfalari(sahne, kitaplar) {
    var sayfalar = [];
    function yeniSayfa() {
      var s = document.createElement('div');
      s.className = 'sk-sayfa anahtar boy-' + ayar.boyut;
      s.innerHTML = '<header class="s-bas kisa"><span>' + kac(ayar.baslik) + '</span><span>Cevap anahtarı</span></header>' +
        '<div class="s-ic"></div>' + altHtml(1, 1, '');
      sahne.appendChild(s); sayfalar.push(s);
      return $('.s-ic', s);
    }
    var ic = yeniSayfa();
    kitaplar.forEach(function (k) {
      var bas = '<h2>' + (kitaplar.length > 1 ? k.ad + ' kitapçığı — ' : '') +
        'Cevap anahtarı <bdi dir="rtl" class="ar">مِفْتاحُ الإِجابَة</bdi></h2>';
      ic.insertAdjacentHTML('beforeend', bas + '<ol class="ca"></ol>');
      if (tasti(ic) && ic.children.length > 2) {             // başlık sayfanın dibinde kalmasın
        ic.removeChild(ic.lastElementChild); ic.removeChild(ic.lastElementChild);
        ic = yeniSayfa(); ic.insertAdjacentHTML('beforeend', bas + '<ol class="ca"></ol>');
      }
      var ol = ic.lastElementChild;
      k.cevaplar.forEach(function (c, i) {
        ol.insertAdjacentHTML('beforeend', '<li><b>' + (i + 1) + '</b><span>' + metin(c || '—') + '</span></li>');
        if (tasti(ic) && ol.children.length > 1) {
          var son = ol.lastElementChild; ol.removeChild(son);
          ic = yeniSayfa(); ic.insertAdjacentHTML('beforeend', '<ol class="ca" start="' + (i + 1) + '"></ol>');
          ol = ic.lastElementChild; ol.appendChild(son);
        }
      });
    });
    var n = sayfalar.length;
    sayfalar.forEach(function (sy, i) { $('.s-alt-bilgi', sy).outerHTML = altHtml(i + 1, n, ''); });
    return sayfalar;
  }

  /* Tüm kâğıdı kurar → sayfa öğeleri listesi */
  function kagidiKur(sahne) {
    sahne.innerHTML = '';
    var kitaplar = [{ ad: 'A', sira: secili.slice() }];
    if (ayar.kitapcik === 'AB') kitaplar.push({ ad: 'B', sira: karistir(secili, 'B-kitapcigi|' + ayar.tohum + '|' + secili.join(',')) });
    /* puan soruya bağlı: aynı soru iki kitapçıkta da aynı puanı alır */
    var puan = {};
    puanDagit(secili.length).forEach(function (p, i) { puan[secili[i]] = p; });
    var tum = [];
    kitaplar.forEach(function (k) {
      var r = kitapcikKur(sahne, k.ad, k.sira, puan);
      k.cevaplar = r.cevaplar;
      var n = r.sayfalar.length;
      r.sayfalar.forEach(function (sy, i) {
        var alt = $('.s-alt-bilgi', sy);
        alt.outerHTML = altHtml(i + 1, n, k.ad);
      });
      tum = tum.concat(r.sayfalar);
    });
    if (ayar.anahtar) tum = tum.concat(anahtarSayfalari(sahne, kitaplar));
    return tum;
  }

  /* =====================================================================
     8) ÖNİZLEME · PDF · YAZDIR
     ===================================================================== */
  function yaziTipleriHazir() {
    var bekle = [];
    try {
      bekle.push(document.fonts.load('20px Arakom', 'كَتَبَ'));
      bekle.push(document.fonts.load('20px Arakom', 'Ağıöşü'));
      bekle.push(document.fonts.ready);
    } catch (e) {}
    return Promise.all(bekle).catch(function () {});
  }

  function onizle() {
    return yaziTipleriHazir().then(function () {
      var sayfalar = kagidiKur($('#sahne'));          // ÖLÇEKSİZ sahnede kur ve ölç
      var kap = $('#onizlemeSayfalar'); kap.innerHTML = '';
      sayfalar.forEach(function (sy) { kap.appendChild(sy); });   // sonra önizlemeye taşı
      $('#onizlemeBilgi').textContent = sayfalar.length + ' sayfa' +
        (ayar.kitapcik === 'AB' ? ' · A ve B kitapçığı' : '') + (ayar.anahtar ? ' · son sayfa cevap anahtarı' : '');
      $('#onizleme').hidden = false;
      document.body.classList.add('onizleme-acik');
      olcekle();
      $('#onizlemeKapat').focus();
      return sayfalar;
    });
  }
  function olcekle() {
    var kap = $('#onizlemeSayfalar'); if (!kap) return;
    var g = Math.min(1, (kap.clientWidth - 32) / A4_G);
    kap.style.setProperty('--olcek', Math.max(0.2, g).toFixed(4));
  }

  function durum(m, tur) {
    var d = $('#durum'); d.textContent = m || ''; d.className = 'durum' + (tur ? ' ' + tur : '');
    d.hidden = !m;
  }

  var pdfYukleniyor = null;
  function pdfAraci() {
    if (window.jspdf && typeof window.html2canvas === 'function') return Promise.resolve();
    if (pdfYukleniyor) return pdfYukleniyor;
    pdfYukleniyor = new Promise(function (ok, hata) {
      var s = document.createElement('script');
      s.src = PDF_ARACI; s.onload = ok;
      s.onerror = function () { pdfYukleniyor = null; hata(new Error('PDF aracı yüklenemedi')); };
      document.head.appendChild(s);
    });
    return pdfYukleniyor;
  }

  function dosyaAdi() {
    var b = normalle(ayar.baslik).replace(/[\u00e7\u011f\u0131\u00f6\u015f\u00fc]/g, function (c) { return { '\u00e7': 'c', '\u011f': 'g', '\u0131': 'i', '\u00f6': 'o', '\u015f': 's', '\u00fc': 'u' }[c]; })
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'soru-kagidi';
    return b + '-' + ayar.tarih.replace(/\./g, '-') + '.pdf';
  }

  function pdfIndir() {
    if (!secili.length) return;
    var btn = $('#btnPdf'); btn.disabled = true;
    durum('PDF hazırlanıyor…');
    var olcek = ayar.kalite === 'keskin' ? 3 : 2;
    return Promise.all([pdfAraci(), yaziTipleriHazir()]).then(function () {
      var sahne = $('#sahne');
      var sayfalar = kagidiKur(sahne);
      var jsPDF = window.jspdf.jsPDF;
      var pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait', compress: true });
      var gen = pdf.internal.pageSize.getWidth(), yuk = pdf.internal.pageSize.getHeight();
      var i = 0;
      function sonraki() {
        if (i >= sayfalar.length) return Promise.resolve();
        durum('PDF hazırlanıyor… sayfa ' + (i + 1) + ' / ' + sayfalar.length);
        return window.html2canvas(sayfalar[i], {
          scale: olcek, backgroundColor: '#ffffff', logging: false, useCORS: true,
          windowWidth: A4_G, width: A4_G, height: A4_Y
        }).then(function (cnv) {
          if (i) pdf.addPage();
          pdf.addImage(cnv.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, gen, yuk, undefined, 'FAST');
          i++; return sonraki();
        });
      }
      return sonraki().then(function () {
        pdf.save(dosyaAdi());
        sahne.innerHTML = '';
        durum(sayfalar.length + ' sayfalık PDF indirildi: ' + dosyaAdi(), 'ok');
      });
    }).catch(function (e) {
      console.error('[sorukagidi]', e);
      durum('PDF üretilemedi: ' + (e && e.message ? e.message : e) + ' — "Yazdır" ile "PDF olarak kaydet" deneyebilirsin.', 'hata');
    }).then(function () { btn.disabled = !secili.length; });
  }

  function yazdir() {
    if (!secili.length) return;
    yaziTipleriHazir().then(function () {
      var sayfalar = kagidiKur($('#sahne'));
      var alan = $('#baskiAlani'); alan.innerHTML = '';
      sayfalar.forEach(function (sy) { alan.appendChild(sy); });
      setTimeout(function () { window.print(); }, 60);
    });
  }

  /* =====================================================================
     9) AYARLAR FORMU
     ===================================================================== */
  function karisimYaz() { var e = $('#karisimNo'); if (e) e.textContent = 'Karışım no: ' + ayar.tohum; }
  function formDoldur() {
    karisimYaz();
    $$('[data-ayar]').forEach(function (el) {
      var k = el.getAttribute('data-ayar');
      if (el.type === 'checkbox') el.checked = !!ayar[k];
      else if (el.type === 'radio') el.checked = String(ayar[k]) === el.value;
      else el.value = ayar[k];
    });
  }
  function formDinle() {
    $$('[data-ayar]').forEach(function (el) {
      el.addEventListener(el.type === 'text' || el.type === 'number' ? 'input' : 'change', function () {
        var k = el.getAttribute('data-ayar');
        if (el.type === 'checkbox') ayar[k] = el.checked;
        else if (el.type === 'radio') { if (el.checked) ayar[k] = el.value; }
        else ayar[k] = el.type === 'number' ? Math.max(1, Math.min(1000, parseInt(el.value, 10) || 100)) : el.value;
        kagidim();
      });
    });
  }

  /* =====================================================================
     10) OLAYLAR
     ===================================================================== */
  function olaylar() {
    document.addEventListener('click', function (e) {
      var c = e.target.closest('.cip');
      if (c) {
        var alan = c.getAttribute('data-alan'), d = c.getAttribute('data-deger');
        if (alan === 'zorluk') d = +d;
        if (suz[alan].has(d)) suz[alan].delete(d); else suz[alan].add(d);
        gosterilen = LISTE_ADIM; cipler(); liste(); return;
      }
      var ek = e.target.closest('.ekle');
      if (ek) { ekleCikar(ek.getAttribute('data-a')); return; }
      var dug = e.target.closest('#kagit button[data-is]');
      if (dug) {
        var a = dug.closest('li').getAttribute('data-a'), i = secili.indexOf(a), is = dug.getAttribute('data-is');
        if (is === 'sil') secili.splice(i, 1);
        if (is === 'yukari' && i > 0) { secili.splice(i, 1); secili.splice(i - 1, 0, a); }
        if (is === 'asagi' && i < secili.length - 1) { secili.splice(i, 1); secili.splice(i + 1, 0, a); }
        kagidim(); liste(); return;
      }
    });
    $('#ara').addEventListener('input', function () { suz.ara = this.value; gosterilen = LISTE_ADIM; cipler(); liste(); });
    $('#suzTemizle').addEventListener('click', function () {
      suz.konu.clear(); suz.tip.clear(); suz.bicim.clear(); suz.zorluk.clear(); suz.ara = ''; $('#ara').value = '';
      gosterilen = LISTE_ADIM; cipler(); liste();
    });
    $('#dahaFazla').addEventListener('click', function () { gosterilen += LISTE_ADIM; liste(); });
    $('#rastgeleEkle').addEventListener('click', function () {
      var n = Math.max(1, Math.min(50, parseInt($('#rastgeleSayi').value, 10) || 10));
      var aday = suzulmus().filter(function (o) { return secili.indexOf(o.anahtar) < 0; });
      var sec = karistir(aday.map(function (o) { return o.anahtar; }), String(Date.now())).slice(0, n);
      secili = secili.concat(sec);
      liste(); kagidim();
      durum(sec.length ? sec.length + ' soru rastgele eklendi.' : 'Eklenecek yeni soru kalmadı.', sec.length ? 'ok' : '');
    });
    $('#hepsiniEkle').addEventListener('click', function () {
      var aday = suzulmus().slice(0, gosterilen).filter(function (o) { return secili.indexOf(o.anahtar) < 0; });
      secili = secili.concat(aday.map(function (o) { return o.anahtar; }));
      liste(); kagidim();
    });
    $('#kagitTemizle').addEventListener('click', function () {
      if (!secili.length) return;
      if (!window.confirm(secili.length + ' soru kâğıttan çıkarılsın mı?')) return;
      secili = []; liste(); kagidim();
    });
    $('#yenidenKaristir').addEventListener('click', function () {
      ayar.tohum = ayar.tohum % 9999 + 1;
      kagidim(); karisimYaz();
      durum('Şıklar yeniden karıştırıldı' + (ayar.kitapcik === 'AB' ? ', B kitapçığının soru sırası da değişti' : '') +
        '. Cevap anahtarı yeni sıraya göre çıkar.', 'ok');
    });
    $('#btnOnizle').addEventListener('click', onizle);
    $('#btnPdf').addEventListener('click', pdfIndir);
    $('#btnYazdir').addEventListener('click', yazdir);
    $('#onizlemePdf').addEventListener('click', pdfIndir);
    $('#onizlemeYazdir').addEventListener('click', yazdir);
    $('#onizlemeKapat').addEventListener('click', onizlemeKapat);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('#onizleme').hidden) onizlemeKapat(); });
    window.addEventListener('resize', olcekle);
    window.addEventListener('afterprint', function () { $('#baskiAlani').innerHTML = ''; });
    /* mobil sekmeleri */
    $$('.sekme').forEach(function (s) {
      s.addEventListener('click', function () {
        $$('.sekme').forEach(function (x) { x.setAttribute('aria-selected', x === s); });
        document.body.setAttribute('data-sekme', s.getAttribute('data-sekme'));
        window.scrollTo(0, 0);
      });
    });
  }
  function onizlemeKapat() {
    $('#onizleme').hidden = true; document.body.classList.remove('onizleme-acik');
    $('#onizlemeSayfalar').innerHTML = ''; $('#btnOnizle').focus();
  }

  /* =====================================================================
     11) AÇILIŞ
     ===================================================================== */
  function hazirla(r) {
    V.tip = r.TIP_BILGI || {}; V.bicim = r.BICIM_BILGI || {};
    V.konular = r.KONULAR.map(function (k) { return { id: String(k.id), ad: k.ad || String(k.id), n: (k.sorular || []).length }; });
    r.KONULAR.forEach(function (k) {
      (k.sorular || []).forEach(function (q) {
        if (!q || q.soru == null) return;
        var o = {
          anahtar: k.id + '#' + q.id, konu: String(k.id), konuAd: k.ad || String(k.id), q: q,
          ara: normalle([q.soru, q.arapca, (q.secenekler || []).join(' '), (q.parcalar || []).join(' '),
            q.cevapYazi, (q.ciftler || []).map(function (c) { return c.join(' '); }).join(' ')].join(' '))
        };
        V.harita[o.anahtar] = o; V.sorular.push(o);
      });
    });
    /* tipleri havuzdaki sıklığa göre değil, yarışmanın kendi sırasıyla göster */
    if (r.ICERIK_SIRA) {
      var sirali = {};
      r.ICERIK_SIRA.forEach(function (k) { if (V.tip[k]) sirali[k] = V.tip[k]; });
      Object.keys(V.tip).forEach(function (k) { if (!sirali[k]) sirali[k] = V.tip[k]; });
      V.tip = sirali;
    }
    $('#havuzBilgi').textContent = V.sorular.length.toLocaleString('tr-TR') + ' soru · ' + V.konular.length + ' konu';
  }

  function basla() {
    geriYukle(); formDoldur(); formDinle(); olaylar();
    havuzuOku().then(function (r) {
      hazirla(r);
      $('#yukleniyor').hidden = true; $('#uygulama').hidden = false;
      cipler(); liste(); kagidim();
    }).catch(function (e) {
      console.error('[sorukagidi]', e);
      $('#yukleniyor').innerHTML = '<b>Soru havuzu yüklenemedi.</b><br><small>' + kac(e.message || e) +
        '</small><br><button type="button" onclick="location.reload()">Yeniden dene</button>';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();

  /* test ve hata ayıklama için */
  window.SoruKagidi = {
    durum: function () { return { secili: secili.slice(), ayar: ayar, havuz: V.sorular.length }; },
    soru: function (a) { var o = V.harita[a]; return o ? JSON.parse(JSON.stringify(o.q)) : null; }
  };
})();
