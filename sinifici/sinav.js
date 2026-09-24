/* =====================================================================
   KIDEF · SINAV HAZIRLA — sinifici/sinav.js
   ---------------------------------------------------------------------
   İKİ YOL TEK SAYFADA (24.09.2026). Önceden iki ayrı sayfa vardı:
   "Soru Kâğıdı Hazırla" (serbest soru seçimi) ve "Öğrenme Çıktısına Göre
   Sınav". İkisi burada birleşti.

     · OKUL SINAVI — öğrenme çıktılarına göre. Sınıf ve ünite seçilir,
       çıktı ağacından çıktı seçilir, havuz o alan becerisine süzülür.
       Antet (okul, ders yılı, dönem, kaçıncı yazılı, ders, sınıf) okul
       bilgilerinden KENDİLİĞİNDEN kurulur. Her sorunun yanında öğrenme
       çıktısı numarası (8.2.1 gibi) yazar; cevap anahtarında ve dağılım
       tablosunda da görünür.
     · ALIŞTIRMA — öğretmen soru tipini, biçimini ve zorluğunu kendi seçer.
       Antet serbesttir, çıktı numarası isteğe bağlıdır.

   OKUL VE ÖĞRETMEN ADI DEPOYA YAZILMAZ. Bilgiler yalnız o tarayıcıda
   (localStorage 'kidef-sinav-okul-v1') durur; siteye ya da GitHub'a hiçbir
   okul/kişi adı gitmez.

   Kâğıt motoru (sayfalama, şık karıştırma, kitapçık, cevap anahtarı, PDF)
   denenmiş hâliyle korundu — sorukagidi.js'ten gelir.
   Üretim betiği: _kaynak/yedekler/betikler/sinav/uret.py
   ---------------------------------------------------------------------
   ESKİ BAŞLIK — SORU KÂĞIDI HAZIRLA
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
  var DEPO = 'kidef-sinav-v1';
  var OKUL_DEPO = 'kidef-sinav-okul-v1';       // okul/öğretmen bilgisi — YALNIZ tarayıcıda
  var CIKTI_VERI = 'veri/veri_ciktilar.js';    // MEB programından ayıklanmış öğrenme çıktıları
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
  var klasikYukleniyor = false;
  var secili = [];                 // sıralı anahtarlar: "konuId#soruId"
  var gosterilen = LISTE_ADIM;
  var ayar = {
    baslik: 'Arapça Değerlendirme', okul: '', ders: 'Arapça', sinif: '',
    tarih: bugun(), ogrenci: true, anahtar: true, kitapcik: 'tek', tohum: 1,
    puan: true, toplam: 100, boyut: 'normal', kalite: 'keskin',
    /* --- iki yol --- */
    yol: '',              // '' açılış · 'sinav' · 'temrin'
    klasikTur: null,      // açık klasik soru türleri (null = varsayılan küme)
    sinifNo: '',          // öğrenme çıktısı için sınıf (5..10)
    unite: '1',           // seçili ünite
    ciktiKodu: true,      // soruların yanında çıktı numarası yazsın mı
    aciklama: true,       // okul sınavında yönerge açıklama satırları
    baslikSerbest: 'Arapça Temrin Kâğıdı'   // temrin yolunun kendi başlığı
  };
  /* soru anahtarı → öğrenme çıktısı kodu ("8.2.1" ya da "8.2.1#b") */
  var ciktiAtama = {};
  /* okul bilgileri — ayrı depoda; sınav temizlense de kalır */
  var okul = { ad: '', ogretmen: '', yil: '', donem: '1', yazili: '1', sube: '' };

  function bugun() {
    var d = new Date();
    return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear();
  }

  function kaydet() {
    try { localStorage.setItem(DEPO, JSON.stringify({ secili: secili, ayar: ayar, cikti: ciktiAtama })); } catch (e) {}
  }
  /* Okul ve öğretmen bilgisi AYRI depoda: sınav temizlense de kalsın,
     öğretmen her sınavda yeniden yazmasın. Hiçbir yere gönderilmez. */
  function okulKaydet() {
    try { localStorage.setItem(OKUL_DEPO, JSON.stringify(okul)); } catch (e) {}
  }
  function okulYukle() {
    try {
      var o = JSON.parse(localStorage.getItem(OKUL_DEPO) || 'null');
      if (o) Object.keys(okul).forEach(function (k) { if (typeof o[k] === 'string') okul[k] = o[k]; });
    } catch (e) {}
    if (!okul.yil) okul.yil = ogretimYili();
  }
  /* Eylülden sonra yeni ders yılı başlar: 2026-2027 gibi. */
  function ogretimYili() {
    var d = new Date(), y = d.getFullYear();
    if (d.getMonth() < 7) y -= 1;                 // ocak-temmuz → bir önceki yılın dönemi
    return y + '-' + (y + 1);
  }
  function geriYukle() {
    try {
      var d = JSON.parse(localStorage.getItem(DEPO) || 'null');
      if (!d) return;
      if (Array.isArray(d.secili)) secili = d.secili;
      if (d.ayar) Object.keys(ayar).forEach(function (k) { if (k in d.ayar) ayar[k] = d.ayar[k]; });
      if (d.cikti && typeof d.cikti === 'object') ciktiAtama = d.cikti;
      /* eski adlar (24.09.2026 öncesi): okul→sinav, alistirma→temrin */
      if (ayar.yol === 'okul') ayar.yol = 'sinav';
      if (ayar.yol === 'alistirma') ayar.yol = 'temrin';
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
     3b) ÖĞRENME ÇIKTILARI  (veri/veri_ciktilar.js → window.ARP_CIKTI)
     ---------------------------------------------------------------------
     Alan becerisinin NUMARASI sınıfa göre değişir (5-6'da SESLETİM ayrı bir
     beceri, 9-10'da OKUMA ikinci sırada, 5. sınıf 1. ünitede OKUMA hiç yok),
     bu yüzden kod yerine ADIN BAŞIYLA aranır.
     ===================================================================== */
  var C = null;                                  // window.ARP_CIKTI
  var TIP_ALAN = {
    anlam: 'SÖZCÜK', kok: 'SÖZCÜK', bosluk: 'SÖZCÜK', kelime: 'SÖZCÜK',
    cumle: 'OKUMA', okuma: 'OKUMA',
    gramer: 'DİL BİLGİSİ', irab: 'DİL BİLGİSİ', vezin: 'DİL BİLGİSİ',
    'ters-vezin': 'DİL BİLGİSİ', edat: 'DİL BİLGİSİ',
    harf: 'SESLETİM',
    /* --- klasik (açık uçlu) sorular: sinifici/klasik.js üretir --- */
    'kl-ceviri-ar': 'OKUMA', 'kl-ceviri-tr': 'OKUMA', 'kl-anlama': 'OKUMA',
    'kl-sozcuk': 'SÖZCÜK', 'kl-eslestirme': 'SÖZCÜK', 'kl-bosluk': 'SÖZCÜK',
    'kl-kurma': 'DİL BİLGİSİ', 'kl-hareke': 'DİL BİLGİSİ', 'kl-duzeltme': 'DİL BİLGİSİ',
    'kl-yazma': 'YAZMA', 'kl-uretim': 'YAZMA',
    'kl-konusma': 'KONUŞMA', 'kl-dinleme': 'DİNLEME'
  };
  var ALAN_KISA = {
    'DİNLEME': 'Dinleme', 'OKUMA': 'Okuma', 'DİL BİLGİSİ': 'Dil bilgisi',
    'SÖZCÜK': 'Sözcük', 'SESLETİM': 'Sesletim', 'KONUŞMA': 'Konuşma', 'YAZMA': 'Yazma'
  };
  function ciktiVarMi() { return !!(C && C.alan && C.cikti); }
  /* Program PDF'inden ayıklanırken bazı beceri adlarının sonuna sayfa
     numarası yapışmış ("OKUMA-ANLAMLANDIRMA295"); ekranda gösterilmez.
     Veri dosyasına dokunulmuyor, yalnız gösterim temizleniyor. */
  function alanAdi(kod) { return String((C && C.alan[kod]) || '').replace(/\d{2,}$/, '').trim(); }
  function alanBul(anahtar, sinif, unite) {
    if (!ciktiVarMi()) return '';
    var on = (sinif || ayar.sinifNo) + '.' + (unite || ayar.unite) + '.';
    for (var i = 1; i <= 9; i++) {
      var k = on + i;
      if (C.alan[k] && C.alan[k].indexOf(anahtar) === 0) return k;
    }
    return '';
  }
  function alanCiktilari(alanKod) {
    if (!ciktiVarMi()) return [];
    return Object.keys(C.cikti).filter(function (k) { return k.indexOf(alanKod + '.') === 0; })
      .sort(function (a, b) { return (+a.split('.')[3]) - (+b.split('.')[3]); });
  }
  function uniteAlanlari(sinif, unite) {
    var on = sinif + '.' + unite + '.', r = [];
    if (!ciktiVarMi()) return r;
    for (var i = 1; i <= 9; i++) if (C.alan[on + i]) r.push(on + i);
    return r;
  }
  function uniteSayisi(sinif) {
    var n = 0;
    if (!ciktiVarMi()) return 0;
    for (var u = 1; u <= 12; u++) if (uniteAlanlari(sinif, u).length) n = u;
    return n;
  }
  function uniteAdi(sinif, unite) {
    var u = C && C.unite && C.unite[String(sinif)];
    return (u && u[String(unite)]) || '';
  }
  function soruAlanAnahtari(o) { return TIP_ALAN[o.q.tip] || ''; }
  /* Soruya önerilen çıktı: türünden alan becerisi çıkar, o becerinin
     seçili ünitedeki ilk çıktısı önerilir. ÜNİTE TAHMİN EDİLMEZ — ünite
     öğretmenin üstten seçtiğidir; numara bir ÖNERİDİR. */
  function onerilenCikti(o) {
    var an = soruAlanAnahtari(o); if (!an) return '';
    var ak = alanBul(an); if (!ak) return '';
    var c = alanCiktilari(ak);
    return c.length ? c[0] : '';
  }
  function ciktiKodu(a) { return (ciktiAtama[a] || '').split('#')[0]; }
  function ciktiBilesen(a) { return (ciktiAtama[a] || '').split('#')[1] || ''; }
  function ciktiEtiketi(a) {
    var k = ciktiAtama[a]; if (!k) return '';
    var b = k.split('#');
    return b[0] + (b[1] ? ' ' + b[1] + ')' : '');
  }
  function ciktiMetni(kod) { return (C && C.cikti[kod] && C.cikti[kod].m) || ''; }

  /* =====================================================================
     3c) OKUL SINAVI ANTETİ
     Öğretmen bilgileri bir kez girer; antet bunlardan kurulur. Bilgiler
     yalnız bu tarayıcıda durur (OKUL_DEPO), depoya hiçbir ad yazılmaz.
     ===================================================================== */
  var ROMEN = ['', '1', '2', '3', '4'];
  function otoBaslik() {
    var s = ayar.sinifNo ? ayar.sinifNo + '. SINIF ' : '';
    return s + 'ARAPÇA DERSİ ' + okul.donem + '. DÖNEM ' + okul.yazili + '. YAZILI SINAVI';
  }
  function anteteAktar() {
    if (ayar.yol !== 'sinav') return;
    ayar.okul = okul.ad;
    ayar.baslik = otoBaslik();
    ayar.ders = 'Arapça';
    ayar.sinif = okul.sube || (ayar.sinifNo ? ayar.sinifNo + '. sınıf' : '');
  }
  /* Yazılı ve Uygulamalı Sınavlar Yönergesi'ne göre kâğıdın başındaki
     açıklama satırları. Öğretmen isterse kapatır. */
  function aciklamaSatirlari() {
    var n = secili.length;
    return [
      'Sınav süresi bir ders saatidir.',
      'Her sorunun puanı soru sonunda belirtilmiştir.' ,
      'Arapça yazarken harekeleri de yazmayı unutmayınız.',
      'Cevaplarınızı okunaklı yazınız; okunmayan cevaplar değerlendirmeye alınmaz.'
    ].concat(n ? [] : []);
  }

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
    /* Okul sınavı yolunda ağaçtan bir çıktı seçiliyse havuz o çıktının
       ALAN BECERİSİNE süzülür (soru tipinden alan becerisi kesin çıkar). */
    var odakAlan = ayar.yol === 'sinav' ? odakSuzgeci() : '';
    var acikTurler = klasikAcikTurler();
    return V.sorular.filter(function (o) {
      /* SINAV yolunda yalnız klasik (açık uçlu) sorular görünür:
         Yazılı ve Uygulamalı Sınavlar Yönergesi m.5/1-e. Temrinde ikisi de. */
      if (ayar.yol === 'sinav' && !o.klasik) return false;
      if (o.klasik && acikTurler.indexOf(o.q.tip) < 0) return false;
      if (odakAlan && soruAlanAnahtari(o) !== odakAlan) return false;
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
        '<span class="rozet r-z' + q.zorluk + '">' + ['', 'Kolay', 'Orta', 'Zor'][q.zorluk || 0] + '</span>' +
        (ayar.yol === 'sinav' && soruAlanAnahtari(o)
          ? '<span class="rozet r-alan">' + kac(ALAN_KISA[soruAlanAnahtari(o)] || soruAlanAnahtari(o)) + '</span>' : '') +
        '</div>' +
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
        '<span class="k-metin">' + karisik(o.q.soru) + ciktiSecici(a) + '</span>' +
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
    if (i >= 0) { secili.splice(i, 1); delete ciktiAtama[a]; }
    else {
      secili.push(a);
      /* Soru eklenince çıktısı KENDİLİĞİNDEN atanır (öneri); öğretmen
         Kâğıdım listesindeki seçiciden değiştirebilir. */
      if (ayar.yol === 'sinav' && !ciktiAtama[a]) {
        var oner = odakCikti() || onerilenCikti(V.harita[a]);
        if (oner) ciktiAtama[a] = oner;
      }
    }
    liste(); kagidim(); if (ayar.yol === 'sinav') cizAgac();
  }

  /* Kâğıdım satırındaki çıktı seçici: o ünitenin bütün çıktıları + bileşenleri */
  function ciktiSecici(a) {
    if (ayar.yol !== 'sinav' || !ciktiVarMi()) return '';
    var simdi = ciktiAtama[a] || '';
    var sec = ['<option value="">— çıktı seç —</option>'];
    uniteAlanlari(ayar.sinifNo, ayar.unite).forEach(function (ak) {
      sec.push('<optgroup label="' + kac(alanAdi(ak)) + '">');
      alanCiktilari(ak).forEach(function (ck) {
        var c = C.cikti[ck];
        sec.push('<option value="' + ck + '"' + (simdi === ck ? ' selected' : '') + '>' +
                 ck + ' — ' + kac((c.m || '').slice(0, 64)) + '</option>');
        (c.b || []).forEach(function (b, bi) {
          var v = ck + '#' + String.fromCharCode(97 + bi);
          sec.push('<option value="' + v + '"' + (simdi === v ? ' selected' : '') + '>&nbsp;&nbsp;' +
                   ck + ' ' + String.fromCharCode(97 + bi) + ') — ' + kac(String(b).slice(0, 56)) + '</option>');
        });
      });
      sec.push('</optgroup>');
    });
    return '<select class="k-cikti" data-a="' + kac(a) + '" aria-label="Öğrenme çıktısı">' + sec.join('') + '</select>';
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
    } else if (q.cevapYazi) {                                    // yazma / klasik
      /* q.satir: cevap için kaç çizgi bırakılsın. Klasik sorularda çeviri 2,
         paragraf yazma 4-6 satır ister; uygulamalı (konuşma) soruda çizgi
         gerekmez, satir:0 gelir. */
      var kacSatir = (typeof q.satir === 'number') ? q.satir : 1;
      var cizgiler = '';
      for (var cz = 0; cz < kacSatir; cz++) cizgiler += '<div class="k-cizgi"></div>';
      govde = arKutusu + (q.tuslar && q.tuslar.length
        ? '<div class="k-tus" dir="rtl"><small>Kullanabileceğin harfler:</small> ' + q.tuslar.map(function (t) { return arKutu(t); }).join(' ') + '</div>'
        : '') + cizgiler;
      cevap = q.cevapYazi;
    } else {
      govde = arKutusu + '<div class="k-cizgi"></div>';
    }
    /* Öğrenme çıktısı numarası (8.2.1 gibi) sorunun sağ üstünde; puanın
       solunda durur ki yazdırırken ikisi çakışmasın. */
    var kod = ayar.ciktiKodu ? ciktiEtiketi(o.anahtar) : '';
    var html = '<section class="k-soru" data-no="' + no + '" data-a="' + kac(o.anahtar) + '">' +
      '<div class="k-bas"><b class="k-no">' + no + '.</b><p>' + karisik(q.soru) + '</p>' +
      (kod ? '<span class="k-ck" title="Öğrenme çıktısı">' + kac(kod) + '</span>' : '') +
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
      '<div class="s-bas-sol">' +
      (ayar.yol === 'sinav' && okul.yil ? '<div class="s-yil">' + kac(okul.yil) + ' EĞİTİM ÖĞRETİM YILI</div>' : '') +
      (ayar.okul ? '<div class="s-okul">' + kac(ayar.okul) + '</div>' : '') +
      '<h1>' + kac(ayar.baslik) + '</h1>' +
      '<div class="s-alt">' + [ayar.ders, ayar.sinif, ayar.tarih].filter(Boolean).map(kac).join(' · ') + '</div></div>' + sag +
      '</header>' +
      (ayar.ogrenci ? '<div class="s-kimlik">' +
        '<div class="gen"><b>Adı Soyadı <bdi dir="rtl" class="ar">الاسم</bdi></b></div>' +
        '<div><b>Numara <bdi dir="rtl" class="ar">الرقم</bdi></b></div>' +
        '<div><b>Sınıf <bdi dir="rtl" class="ar">الصف</bdi></b></div>' +
        '<div><b>Puan <bdi dir="rtl" class="ar">الدرجة</bdi></b></div></div>' : '') +
      (ayar.yol === 'sinav' && ayar.aciklama
        ? '<div class="s-aciklama"><b>AÇIKLAMALAR</b><ul>' +
          aciklamaSatirlari().map(function (x) { return '<li>' + kac(x) + '</li>'; }).join('') +
          '</ul></div>' : '');
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
        var ck = ayar.ciktiKodu ? ciktiEtiketi(k.sira[i]) : '';
        ol.insertAdjacentHTML('beforeend', '<li><b>' + (i + 1) + '</b><span>' + metin(c || '—') + '</span>' +
          (ck ? '<i class="ca-ck">' + kac(ck) + '</i>' : '') + '</li>');
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
        /* Alıştırma yolunda yazılan başlık, okul sınavının otomatik
           başlığını ezmesin diye ayrı saklanır. */
        if (k === 'baslik' && ayar.yol === 'temrin') ayar.baslikSerbest = ayar.baslik;
        kagidim();
      });
    });
  }

  /* =====================================================================
     9a) KLASİK SORULAR  (sinifici/klasik.js)
     ---------------------------------------------------------------------
     Seçilen sınıf+ünitenin kendi ders cümlelerinden açık uçlu sorular
     üretilir ve havuza katılır. Böylece DİNLEME ve KONUŞMA dâhil hemen
     her öğrenme çıktısının karşılığında soru bulunur; çoktan seçmeli
     havuzda yalnız SÖZCÜK, OKUMA, DİL BİLGİSİ ve SESLETİM vardı.
     ===================================================================== */
  function klasikAcikTurler() {
    if (ayar.klasikTur && ayar.klasikTur.length) return ayar.klasikTur;
    return (window.KidefKlasik && window.KidefKlasik.VARSAYILAN) || [];
  }
  function klasikTurAdi(tip) {
    return (window.KidefKlasik && window.KidefKlasik.TUR_ADI[tip]) || tip;
  }
  /* Havuzdaki klasik soruları söker; yeni ünite için yenileri eklenecek. */
  function klasikTemizle() {
    V.sorular = V.sorular.filter(function (o) {
      if (!o.klasik) return true;
      delete V.harita[o.anahtar];
      return false;
    });
  }
  function klasikYukle() {
    if (!window.KidefKlasik || !ayar.sinifNo || !ayar.unite) { klasikTemizle(); return Promise.resolve(); }
    klasikYukleniyor = true;
    var bilgi = $('#klasikDurum');
    if (bilgi) bilgi.textContent = 'Ünitenin soruları hazırlanıyor…';
    var ad = uniteAdi(ayar.sinifNo, ayar.unite);
    return window.KidefKlasik.uret(ayar.sinifNo, ayar.unite, ad).then(function (liste) {
      klasikTemizle();
      liste.forEach(function (q) {
        var o = {
          anahtar: 'klasik#' + ayar.sinifNo + '_' + ayar.unite + '#' + q.id,
          konu: 'klasik', konuAd: ayar.sinifNo + '/' + ayar.unite + '. ünite',
          q: q, klasik: true,
          ara: normalle([q.soru, q.arapca, q.cevapYazi,
            (q.parcalar || []).join(' '),
            (q.ciftler || []).map(function (c) { return c.join(' '); }).join(' ')].join(' '))
        };
        V.harita[o.anahtar] = o; V.sorular.push(o);
      });
      klasikYukleniyor = false;
      if (bilgi) {
        bilgi.textContent = liste.length
          ? liste.length + ' klasik soru hazır — ünitenin kendi cümlelerinden üretildi'
          : 'Bu ünitenin ders verisi bulunamadı; klasik soru üretilemedi.';
      }
      klasikCipleri();
      return liste;
    }).catch(function (e) {
      klasikYukleniyor = false;
      if (bilgi) bilgi.textContent = 'Klasik sorular yüklenemedi.';
      console.error('[sinav] klasik', e);
    });
  }
  /* Klasik tür çipleri — hangi soru türleri görünsün */
  function klasikCipleri() {
    var kutu = $('#suz-klasik'); if (!kutu || !window.KidefKlasik) return;
    var acik = klasikAcikTurler();
    var say = {};
    V.sorular.forEach(function (o) { if (o.klasik) say[o.q.tip] = (say[o.q.tip] || 0) + 1; });
    var turler = Object.keys(window.KidefKlasik.TUR_ADI);
    kutu.innerHTML = turler.map(function (tip) {
      var v = acik.indexOf(tip) >= 0, n = say[tip] || 0;
      if (!n && !v) return '';
      return '<button type="button" class="cip' + (v ? ' acik' : '') + '" data-klasik="' + tip +
        '" aria-pressed="' + v + '">' + kac(klasikTurAdi(tip)) + '<small>' + n + '</small></button>';
    }).join('');
  }

  /* =====================================================================
     9b) İKİ YOL · ÇIKTI AĞACI · OKUL BİLGİSİ · DAĞILIM TABLOSU
     ===================================================================== */
  var odak = '';                                  // ağaçta seçili çıktı kodu

  function odakCikti() { return odak; }
  function odakAlanKodu() { return odak ? odak.split('.').slice(0, 3).join('.') : ''; }
  function odakAlanAdi() {
    var ak = odakAlanKodu(); if (!ak) return '';
    var ad = alanAdi(ak);
    var bulunan = '';
    Object.keys(ALAN_KISA).forEach(function (k) { if (!bulunan && ad.indexOf(k) === 0) bulunan = k; });
    return bulunan;
  }
  /* Havuzda o alan becerisinden hiç soru yoksa SÜZME: dinleme, konuşma ve
     yazma becerilerinin yazılı soru havuzunda karşılığı yok; süzsek liste
     bomboş kalır, öğretmen soruyu bulamaz. Durum satırı bunu söyler. */
  function odakSuzgeci() {
    var an = odakAlanAdi(); if (!an) return '';
    var v = V.sorular.some(function (o) { return soruAlanAnahtari(o) === an; });
    return v ? an : '';
  }

  /* --- yol seçimi --- */
  function yolKur(y, sessiz) {
    if (y === 'okul') y = 'sinav';
    if (y === 'alistirma') y = 'temrin';
    ayar.yol = y;
    document.body.setAttribute('data-yol', y);
    $('#yolSec').hidden = !!y;
    $('#uygulama').hidden = !y;
    $('#okulPaneli').hidden = y !== 'sinav';
    $('#agacPaneli').hidden = y !== 'sinav';
    var kp = $('#klasikPaneli'); if (kp) kp.hidden = !y;
    $('#ciktiAyar').hidden = !y;
    var aa = $('#aciklamaAyar'); if (aa) aa.hidden = y !== 'sinav';
    $('#btnDagilim').hidden = y !== 'sinav';
    if (y === 'sinav') {
      ayar.ciktiKodu = true; anteteAktar();
      /* Okul adı henüz yoksa panel açık gelsin: öğretmen ilk iş onu yazsın. */
      var op = $('#okulPaneli'); if (op) op.open = !okul.ad;
    } else if (y === 'temrin') {
      /* Okul sınavından gelindiyse antet ve çıktı numarası orada kalsın:
         alıştırma kâğıdında okul adı ve yazılı başlığı işi yok. */
      if (ayar.baslik === otoBaslik()) ayar.baslik = ayar.baslikSerbest || 'Arapça Temrin Kâğıdı';
      ayar.okul = '';
      ayar.ciktiKodu = false;
    }
    var ya = $('#yolAdi');
    if (ya) ya.textContent = y === 'sinav' ? 'Sınav — öğrenme çıktılarına göre, yalnız klasik sorular'
                           : y === 'temrin' ? 'Temrin — alıştırma ve çalışma kâğıdı' : '';
    var yd2 = $('#yolDegis'); if (yd2) yd2.hidden = !y;
    if (!sessiz) {
      formDoldur(); cipler(); klasikCipleri(); liste(); kagidim();
      sinifSecKur();
      if (y === 'sinav') cizAgac();
      if (ayar.sinifNo) klasikYukle().then(function () { cipler(); liste(); if (y === 'sinav') cizAgac(); });
    }
    kaydet();
  }

  /* --- okul bilgisi formu --- */
  function okulFormDoldur() {
    $$('[data-okul]').forEach(function (el) { el.value = okul[el.getAttribute('data-okul')] || ''; });
    okulOzet();
  }
  function okulOzet() {
    var e = $('#okulOzet'); if (!e) return;
    e.textContent = [okul.ad || '(okul adı yok)', okul.yil, okul.donem + '. dönem ' + okul.yazili + '. yazılı'].join(' · ');
  }
  function okulDinle() {
    $$('[data-okul]').forEach(function (el) {
      el.addEventListener('input', function () {
        okul[el.getAttribute('data-okul')] = el.value;
        okulKaydet(); anteteAktar(); formDoldur(); okulOzet();
      });
      el.addEventListener('change', function () {
        okul[el.getAttribute('data-okul')] = el.value;
        okulKaydet(); anteteAktar(); formDoldur(); okulOzet();
      });
    });
  }

  /* --- sınıf ve ünite seçici --- */
  function sinifSecKur() {
    var s = $('#sinifSec'); if (!s) return;
    if (!s.options.length) {
      s.innerHTML = '<option value="">Sınıf…</option>' +
        [5, 6, 7, 8, 9, 10].map(function (x) { return '<option value="' + x + '">' + x + '. sınıf</option>'; }).join('');
    }
    s.value = ayar.sinifNo || '';
    uniteSecKur();
  }
  function uniteSecKur() {
    var u = $('#uniteSec'); if (!u) return;
    var n = ayar.sinifNo ? uniteSayisi(ayar.sinifNo) : 0;
    if (!n) { u.innerHTML = '<option value="">—</option>'; u.disabled = true; return; }
    u.disabled = false;
    var liste_ = [];
    for (var i = 1; i <= n; i++) {
      var ad = uniteAdi(ayar.sinifNo, i);
      liste_.push('<option value="' + i + '">' + i + '. ünite' + (ad ? ' — ' + kac(ad) : '') + '</option>');
    }
    u.innerHTML = liste_.join('');
    if (+ayar.unite > n) ayar.unite = '1';
    u.value = ayar.unite;
  }

  /* --- çıktı ağacı --- */
  function ciktiSoruSayisi(alanKod) {
    var ad = alanAdi(alanKod), an = '';
    Object.keys(ALAN_KISA).forEach(function (k) { if (!an && ad.indexOf(k) === 0) an = k; });
    if (!an) return 0;
    return V.sorular.filter(function (o) { return soruAlanAnahtari(o) === an; }).length;
  }
  function ciktiSecimSayisi(kod) {
    var n = 0;
    Object.keys(ciktiAtama).forEach(function (a) {
      if (secili.indexOf(a) >= 0 && ciktiKodu(a) === kod) n++;
    });
    return n;
  }
  function cizAgac() {
    var kutu = $('#agac'); if (!kutu) return;
    if (!ciktiVarMi()) { kutu.innerHTML = '<div class="bos">Öğrenme çıktısı verisi yüklenemedi.</div>'; return; }
    if (!ayar.sinifNo) { kutu.innerHTML = '<div class="bos">Önce sınıf seç.</div>'; return; }
    var alanlar = uniteAlanlari(ayar.sinifNo, ayar.unite);
    if (!alanlar.length) { kutu.innerHTML = '<div class="bos">Bu ünitede çıktı bulunamadı.</div>'; return; }
    kutu.innerHTML = alanlar.map(function (ak) {
      var sy = ciktiSoruSayisi(ak);
      return '<section class="ag-alan"><h4>' + kac(alanAdi(ak)) +
        '<small>' + (sy ? sy + ' soru' : 'havuzda soru yok') + '</small></h4>' +
        alanCiktilari(ak).map(function (ck) {
          var c = C.cikti[ck], se = ciktiSecimSayisi(ck);
          return '<button type="button" class="ag-cikti' + (odak === ck ? ' acik' : '') + '" data-cikti="' + ck + '">' +
            '<b>' + ck + '</b><span>' + kac(c.m || '') + '</span>' +
            (se ? '<i class="ag-say">' + se + ' soru seçili</i>' : '') + '</button>';
        }).join('') + '</section>';
    }).join('');
    var d = $('#agacDurum');
    if (!d) return;
    if (!odak) { d.textContent = 'Bir çıktı seç: havuz o alan becerisine süzülür.'; d.className = 'agac-durum'; return; }
    var an = odakAlanAdi(), suzuldu = !!odakSuzgeci();
    d.className = 'agac-durum' + (suzuldu ? '' : ' uyari');
    d.textContent = suzuldu
      ? odak + ' seçili — havuz “' + (ALAN_KISA[an] || an) + '” sorularına süzüldü'
      : odak + ' seçili — “' + (ALAN_KISA[an] || an) + '” becerisinin havuzda hazır sorusu yok, ' +
        'liste süzülmedi. Uygun bir soru seçip çıktısını elle bu çıktıya bağlayabilirsin.';
  }

  /* --- dağılım tablosu --- */
  function dagilimAc() {
    if (!secili.length) return;
    var puanlar = puanDagit(secili.length);
    var satir = secili.map(function (a, i) {
      var o = V.harita[a], kod = ciktiKodu(a), bil = ciktiBilesen(a);
      return '<tr><td>' + (i + 1) + '</td><td>' + karisik(o.q.soru) + '</td>' +
        '<td>' + kac(o.konuAd) + '</td>' +
        '<td>' + kac(ALAN_KISA[soruAlanAnahtari(o)] || '—') + '</td>' +
        '<td>' + (kod ? kod + (bil ? ' ' + bil + ')' : '') : '—') + '</td>' +
        '<td>' + kac(ciktiMetni(kod).slice(0, 90) || '—') + '</td>' +
        '<td>' + puanlar[i] + '</td></tr>';
    }).join('');
    var ozetSay = {};
    secili.forEach(function (a, i) {
      var k = ciktiKodu(a) || '—';
      ozetSay[k] = ozetSay[k] || { n: 0, p: 0 };
      ozetSay[k].n++; ozetSay[k].p += puanlar[i];
    });
    var ozet = Object.keys(ozetSay).sort().map(function (k) {
      return '<tr><td>' + k + '</td><td>' + kac(ciktiMetni(k).slice(0, 110) || '') + '</td>' +
        '<td>' + ozetSay[k].n + '</td><td>' + ozetSay[k].p + '</td></tr>';
    }).join('');
    var h = '<!doctype html><html lang="tr"><head><meta charset="utf-8">' +
      '<title>Konu ve Kazanım Dağılım Tablosu</title><style>' +
      'body{font:12px/1.5 system-ui,sans-serif;margin:18mm 14mm;color:#111}' +
      'h1{font-size:15px;margin:0 0 2px}h2{font-size:13px;margin:16px 0 6px}' +
      '.ust{margin-bottom:10px;color:#444}table{width:100%;border-collapse:collapse;margin-bottom:12px}' +
      'th,td{border:1px solid #999;padding:4px 5px;vertical-align:top;font-size:11px}' +
      'th{background:#eef2f6;text-align:left}td:first-child,td:last-child{text-align:center;white-space:nowrap}' +
      '.ar{font-family:Arakom,serif}@media print{body{margin:12mm}}</style></head><body>' +
      '<h1>KONU VE KAZANIM DAĞILIM TABLOSU</h1><div class="ust">' +
      [kac(okul.ad), kac(okul.yil), kac(ayar.baslik), kac(ayar.sinif)].filter(Boolean).join(' · ') +
      '</div><h2>Soru dağılımı</h2><table><thead><tr><th>No</th><th>Soru</th><th>Havuz konusu</th>' +
      '<th>Alan becerisi</th><th>Öğrenme çıktısı</th><th>Çıktı metni</th><th>Puan</th></tr></thead><tbody>' +
      satir + '</tbody></table><h2>Çıktıya göre özet</h2><table><thead><tr><th>Çıktı</th><th>Metin</th>' +
      '<th>Soru</th><th>Puan</th></tr></thead><tbody>' + ozet + '</tbody></table>' +
      '<p style="color:#666;font-size:10px">Öğrenme çıktısı numaraları bir öneridir; ünite öğretmenin seçtiğidir. ' +
      'kidefarapca.com</p></body></html>';
    var w = window.open('', '_blank');
    if (!w) { durum('Tarayıcı yeni sekmeyi engelledi. İzin verip yeniden dene.', 'hata'); return; }
    w.document.write(h); w.document.close();
  }

  /* =====================================================================
     10) OLAYLAR
     ===================================================================== */
  function olaylar() {
    document.addEventListener('click', function (e) {
      /* Klasik tür çipleri de .cip sınıfını taşıyor ama başka eksende
         çalışıyor (data-klasik); genel süzgeç onları yutmasın. */
      var c = e.target.closest('.cip:not([data-klasik])');
      if (c) {
        var alan = c.getAttribute('data-alan'), d = c.getAttribute('data-deger');
        if (alan === 'zorluk') d = +d;
        if (suz[alan].has(d)) suz[alan].delete(d); else suz[alan].add(d);
        gosterilen = LISTE_ADIM; cipler(); liste(); return;
      }
      var yol = e.target.closest('[data-yol-sec]');
      if (yol) { yolKur(yol.getAttribute('data-yol-sec')); window.scrollTo(0, 0); return; }
      var kc = e.target.closest('[data-klasik]');
      if (kc) {
        var tip = kc.getAttribute('data-klasik');
        var acik = klasikAcikTurler().slice();
        var i = acik.indexOf(tip);
        if (i >= 0) acik.splice(i, 1); else acik.push(tip);
        ayar.klasikTur = acik;
        gosterilen = LISTE_ADIM; klasikCipleri(); cipler(); liste(); kaydet(); return;
      }
      var ag = e.target.closest('.ag-cikti');
      if (ag) {
        var ck = ag.getAttribute('data-cikti');
        odak = (odak === ck) ? '' : ck;
        gosterilen = LISTE_ADIM; cizAgac(); cipler(); liste(); return;
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
    document.addEventListener('change', function (e) {
      var cs = e.target.closest('.k-cikti');
      if (cs) {
        var a = cs.getAttribute('data-a');
        if (cs.value) ciktiAtama[a] = cs.value; else delete ciktiAtama[a];
        kaydet(); cizAgac(); return;
      }
    });
    var ss = $('#sinifSec');
    if (ss) ss.addEventListener('change', function () {
      ayar.sinifNo = this.value; odak = '';
      uniteSecKur(); anteteAktar(); formDoldur();
      gosterilen = LISTE_ADIM; cizAgac(); cipler(); liste(); kagidim();
      klasikYukle().then(function () { cipler(); liste(); cizAgac(); });
    });
    var us = $('#uniteSec');
    if (us) us.addEventListener('change', function () {
      ayar.unite = this.value; odak = '';
      gosterilen = LISTE_ADIM; cizAgac(); cipler(); liste(); kagidim();
      klasikYukle().then(function () { cipler(); liste(); cizAgac(); });
    });
    var bd = $('#btnDagilim'); if (bd) bd.addEventListener('click', dagilimAc);
    var yd = $('#yolDegis');
    if (yd) yd.addEventListener('click', function () {
      ayar.yol = ''; document.body.removeAttribute('data-yol');
      $('#yolSec').hidden = false; $('#uygulama').hidden = true; kaydet(); window.scrollTo(0, 0);
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
    var hb = $('#havuzBilgi');
    if (hb) hb.textContent = V.sorular.length.toLocaleString('tr-TR') + ' soru · ' + V.konular.length + ' konu';
  }

  /* Öğrenme çıktısı verisi ayrı dosyada (286 KB); yalnız bir kez okunur.
     Yüklenemezse okul sınavı yolu yine çalışır, çıktı ağacı boş kalır. */
  function ciktiVerisiniYukle() {
    if (window.ARP_CIKTI) { C = window.ARP_CIKTI; return Promise.resolve(); }
    return new Promise(function (ok) {
      var s = document.createElement('script');
      s.src = CIKTI_VERI;
      s.onload = function () { C = window.ARP_CIKTI || null; ok(); };
      s.onerror = function () { C = null; ok(); };
      document.head.appendChild(s);
    });
  }

  function basla() {
    geriYukle(); okulYukle();
    /* index.html'den "?sinif=8&yol=okul" ile gelinebilir */
    try {
      var s = new URLSearchParams(location.search);
      if (s.get('sinif')) { ayar.sinifNo = s.get('sinif'); ayar.yol = ayar.yol || 'sinav'; }
      if (s.get('yol')) ayar.yol = s.get('yol');
    } catch (e) {}
    formDoldur(); formDinle(); okulFormDoldur(); okulDinle(); olaylar();
    Promise.all([havuzuOku(), ciktiVerisiniYukle()]).then(function (r) {
      hazirla(r[0]);
      $('#yukleniyor').hidden = true;
      if (ayar.yol) { yolKur(ayar.yol); } else { $('#yolSec').hidden = false; }
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
