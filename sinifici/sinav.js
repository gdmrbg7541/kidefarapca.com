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
    /* anteteAktar'ın en son kendi yazdığı değerler: öğretmenin elle
       değiştirdiği alanı ezmemek için karşılaştırma ölçütü. */
    sonOtoBaslik: '', sonOtoOkul: '', sonOtoSinif: '',
    puan: true, toplam: 100, boyut: 'normal', kalite: 'keskin',
    elPuanlar: {},                 /* anahtar → elle yazılan puan (30.09.2026) */
    /* --- iki yol --- */
    yol: '',              // '' açılış · 'sinav' · 'temrin'
    yontem: 'cikti',      // sınav yolu: 'cikti' (çıktıdan) · 'havuz' (havuzdan)
    klasikTur: null,      // açık klasik soru türleri (null = varsayılan küme)
    kitapYil: '',         // birden çok kitabı olan sınıflarda seçili kitap
    dersSuz: '',          // ders süzgeci: '' = ünitenin tamamı · '8_2_1' tek ders
                          // (ayar.ders ANTETTEKİ ders adıdır — karıştırma)
    sinifNo: '',          // öğrenme çıktısı için sınıf (5..10)
    unite: '1',           // seçili ünite
    ciktiKodu: true,      // soruların yanında çıktı numarası yazsın mı
    aciklama: true,       // okul sınavında yönerge açıklama satırları
    baslikSerbest: 'Arapça Temrin Kâğıdı'   // temrin yolunun kendi başlığı
  };
  /* soru anahtarı → öğrenme çıktısı kodu ("8.2.1" ya da "8.2.1#b") */
  var ciktiAtama = {};
  /* okul bilgileri — ayrı depoda; sınav temizlense de kalır */
  var okul = { ad: '', ogretmen: '', yil: '', donem: '1', yazili: '1', sube: '', sure: '' };

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
  /* Ünite verilmezse sınıfın bütün üniteleri taranır — seçili üniteye
     denk gelen program ünitesi başta (bkz. ciktiUniteSirasi). Eskiden
     yalnız o ünite taranıyordu; kitapta program karşılığı olmayan bir
     ünite (8/5 Spor gibi) seçiliyse hiçbir beceri bulunamıyordu. */
  function alanBul(anahtar, sinif, unite) {
    if (!ciktiVarMi()) return '';
    var s = sinif || ayar.sinifNo;
    var liste = unite ? [unite] : ciktiUniteSirasi(s);
    for (var j = 0; j < liste.length; j++) {
      var on = s + '.' + liste[j] + '.';
      for (var i = 1; i <= 9; i++) {
        var k = on + i;
        if (C.alan[k] && C.alan[k].indexOf(anahtar) === 0) return k;
      }
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
  /* ---------------------------------------------------------------------
     PROGRAM ÜNİTESİ ≠ KİTAP ÜNİTESİ  (30.09.2026)
     veri_ciktilar.js MEB PROGRAMINI anlatıyor: her sınıfta dört ünite var
     ve ünite adları kitabınkilerle tutmuyor. Kitaplarda altı ünite
     olabiliyor (8. sınıf, 7. Mektep, eski 6. sınıf). Bu yüzden çıktılar
     "kitabın ünite numarasına eşit program ünitesine" KİLİTLENMİYOR:
     sınıfın bütün üniteleri sunuluyor, aynı numaralı olan başa alınıyor.
     Öğretmen doğru kazanımı kendi seçer; kural hiçbir ünitede kapanmaz.
     --------------------------------------------------------------------- */
  function sinifUniteleri(sinif) {
    var r = [];
    if (!ciktiVarMi()) return r;
    for (var u = 1; u <= 12; u++) if (uniteAlanlari(sinif, u).length) r.push(u);
    return r;
  }
  function ciktiUniteSirasi(sinif) {
    var s = sinif || ayar.sinifNo, h = sinifUniteleri(s), i = h.indexOf(+ayar.unite);
    if (i > 0) { h.splice(i, 1); h.unshift(+ayar.unite); }
    return h;
  }
  /* "Program" ön eki bilerek: üstteki seçicide kitabın ünitesi yazıyor
     (8/2 "Kültür ve Sanat"), burada programınki (8/2 "SAĞLIKLI HAYATIM").
     İkisinin ayrı numaralandırma olduğu görünsün. */
  function ciktiUniteEtiketi(sinif, u) {
    var ad = uniteAdi(sinif, u);
    return 'Program ' + u + '. ünite' + (ad ? ' — ' + ad : '');
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
  /* HER SORUYA BİR ÇIKTI (29.09.2026, öğretmen isteği). Kural yalnız sınav
     yolunda ve ATANACAK ÇIKTI VARSA işler: çıktı verisi yüklenmediyse
     kâğıdı kilitlemenin anlamı yok.
     30.09.2026: ölçüt ÜNİTE değil SINIF. Eskiden "bu ünitenin çıktısı yok"
     sayıldığı için 8/5, 8/6 gibi ünitelerde kural kendiliğinden kapanıyor
     ve kâğıt numarasız basılıyordu — oysa sınıfın çıktıları duruyor. */
  function ciktiZorunlu() {
    return ayar.yol === 'sinav' && ciktiVarMi() &&
           sinifUniteleri(ayar.sinifNo).length > 0;
  }
  /* Boş olan da, ARTIK VAR OLMAYAN bir koda bağlı olan da eksik sayılır:
     ünite ya da kitap değişince listede bulunamayan bir kod sessizce
     düşüyordu, uyarı çıkmadan kazanımsız kâğıt basılabiliyordu. */
  function eksikCiktilar() {
    if (!ciktiZorunlu()) return [];
    return secili.filter(function (a) {
      var k = ciktiKodu(a);
      return !k || !(C.cikti && C.cikti[k]);
    });
  }
  /* Bir soruya atanabilecek en makul çıktı: ağaçta seçili olan → soru
     türünün alan becerisindeki ilk çıktı → ünitenin ilk çıktısı. */
  function ciktiOner(a) {
    var o = odakCikti(V.harita[a]) || onerilenCikti(V.harita[a]);
    if (o) return o;
    var sira = ciktiUniteSirasi();
    var al = sira.length ? uniteAlanlari(ayar.sinifNo, sira[0]) : [];
    var c = al.length ? alanCiktilari(al[0]) : [];
    return c[0] || '';
  }

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
  /* 30.09.2026: ELLE YAZILANI EZMİYOR. Eskiden dört alan da her çağrıda
     yeniden yazılıyordu; anteteAktar her okul bilgisi tuşuna basışta da
     çağrıldığı için öğretmen başlığı değiştirip Okul bilgileri'ne bir
     harf yazınca başlık geri dönüyordu. Ölçüt şu: alan boşsa ya da hâlâ
     BİZİM en son yazdığımız değerde duruyorsa güncelle; öğretmen
     değiştirmişse dokunma. sonOto* alanları bunun için tutuluyor. */
  function anteteAktar() {
    if (ayar.yol !== 'sinav') return;
    var oB = otoBaslik();
    if (!ayar.baslik || ayar.baslik === ayar.sonOtoBaslik) ayar.baslik = oB;
    ayar.sonOtoBaslik = oB;

    if (!ayar.okul || ayar.okul === ayar.sonOtoOkul) ayar.okul = okul.ad;
    ayar.sonOtoOkul = okul.ad;

    var oS = okul.sube || (ayar.sinifNo ? ayar.sinifNo + '. sınıf' : '');
    if (!ayar.sinif || ayar.sinif === ayar.sonOtoSinif) ayar.sinif = oS;
    ayar.sonOtoSinif = oS;

    if (!ayar.ders) ayar.ders = 'Arapça';
  }
  /* "-dir" eki, öğretmenin yazdığı süreye göre ünlü ve ünsüz uyumuyla
     çekilir: "40 dakikadır", "bir ders saatidir", "iki ders saatidir",
     "45 dk.dır". Süre alanı serbest metin olduğu için gerekli. */
  function ekDir(son) {
    if (/saat$/.test(son)) return 'tir';            /* ince ünlülü istisna */
    var unlu = '', i;
    for (i = son.length - 1; i >= 0; i--) if ('aeıioöuü'.indexOf(son[i]) >= 0) { unlu = son[i]; break; }
    var d = 'pçtkfhsş'.indexOf(son.slice(-1)) >= 0 ? 't' : 'd';
    var u = (unlu === 'a' || unlu === 'ı') ? 'ı'
          : (unlu === 'o' || unlu === 'u') ? 'u'
          : (unlu === 'ö' || unlu === 'ü') ? 'ü' : 'i';
    return d + u + 'r';
  }
  /* Süre alanı serbest metin. Çekilebiliyorsa "… 40 dakikadır", kısaltma
     ya da sayıyla bitiyorsa ("45 dk.", "2x40") iki nokta ile yazılır. */
  function sureCumlesi() {
    var t = (okul.sure || '').trim() || 'bir ders saati';
    var son = t.toLowerCase().replace(/[^a-zçğıöşü]+$/, '');
    if (son.length < 3 || !/[aeıioöuü]/.test(son)) return 'Sınav süresi: ' + t.replace(/\.+$/, '') + '.';
    return 'Sınav süresi ' + t + ekDir(son) + '.';
  }

  /* Yazılı ve Uygulamalı Sınavlar Yönergesi'ne göre kâğıdın başındaki
     açıklama satırları. Öğretmen isterse kapatır. */
  function aciklamaSatirlari() {
    var n = secili.length;
    return [
      sureCumlesi(),
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
    var odakAlan = ayar.yol === 'sinav' ? odakSuzgeci() : [];
    var acikTurler = klasikAcikTurler();
    return V.sorular.filter(function (o) {
      /* SINAV yolunda yalnız klasik (açık uçlu) sorular görünür:
         Yazılı ve Uygulamalı Sınavlar Yönergesi m.5/1-e. Temrinde ikisi de. */
      if (ayar.yol === 'sinav' && !o.klasik) return false;
      /* Hiç tür seçilmediyse süzme yok: hepsi görünür (29.09.2026). */
      if (o.klasik && acikTurler.length && acikTurler.indexOf(o.q.tip) < 0) return false;
      if (o.klasik && ayar.dersSuz && o.q.ders !== ayar.dersSuz) return false;
      if (odakAlan.length && odakAlan.indexOf(soruAlanAnahtari(o)) < 0) return false;
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
      /* Çipi olmayan grup gizlenir (30.09.2026): sınav yolunda "Konu /
         sınıf" ve "Soru içeriği" hep boş kalıyor (klasik soruların konusu
         'klasik', tipi 'kl-*'; ikisi de havuzun listelerinde yok) ama
         başlıkları yer kaplıyordu. */
      var grup = kutu.parentNode;
      if (grup && grup.className === 'suz-grup') grup.hidden = !kutu.children.length;
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
    klasikOzetYaz();                     /* üstteki sabit şerit tazelensin */
    var l = suzulmus(), kutu = $('#liste');
    $('#bulunan').textContent = l.length + ' soru';
    if (!l.length) {
      kutu.innerHTML = '<div class="bos">Bu süzgeçlerle soru yok. Bir süzgeci kaldırmayı dene.</div>';
      $('#dahaFazla').hidden = true; return;
    }
    kutu.innerHTML = l.slice(0, gosterilen).map(function (o) {
      var q = o.q, var_ = secili.indexOf(o.anahtar) >= 0, t = V.tip[q.tip] || {}, bi = V.bicim[bicimi(q)] || {};
      /* 29.09.2026 (öğretmen isteği): önce SORU, sonra ŞIKLAR VE CEVAP
         (artık katlanmıyor, hep açık), en altta ETİKETLER. */
      var ozet = soruOzeti(o);
      return '<article class="soru' + (var_ ? ' secili' : '') + '" data-a="' + kac(o.anahtar) + '">' +
        '<p class="soru-kok">' + karisik(q.soru) + '</p>' +
        (ozet ? '<div class="soru-cevap">' + ozet + '</div>' : '') +
        '<div class="soru-etiket"><span class="rozet">' + kac(o.konuAd) + '</span>' +
        '<span class="rozet r-tip">' + kac((t.emoji || '') + ' ' + (t.ad || q.tip || '')) + '</span>' +
        '<span class="rozet r-bic">' + kac((bi.emoji || '') + ' ' + (bi.ad || '')) + '</span>' +
        '<span class="rozet r-z' + q.zorluk + '">' + ['', 'Kolay', 'Orta', 'Zor'][q.zorluk || 0] + '</span>' +
        (ayar.yol === 'sinav' && soruAlanAnahtari(o)
          ? '<span class="rozet r-alan">' + kac(ALAN_KISA[soruAlanAnahtari(o)] || soruAlanAnahtari(o)) + '</span>' : '') +
        '</div>' +
        '<button type="button" class="ekle" data-a="' + kac(o.anahtar) + '" aria-pressed="' + var_ + '">' +
        (var_ ? '✓ Kâğıtta' : '+ Kâğıda ekle') + '</button></article>';
    }).join('');
    $('#dahaFazla').hidden = l.length <= gosterilen;
    $('#dahaFazla').textContent = 'Daha fazla göster (' + (l.length - gosterilen) + ' soru daha)';
  }

  /* =====================================================================
     5) KÂĞIDIM (seçili sorular)
     ===================================================================== */
  /* Kâğıt satırında soruyu tanımaya yarayan Arapça parça. soruOzeti()
     HTML döndürüyor; etiketler atılıp ilk Arapça öbek alınıyor. */
  function kagitArapca(o) {
    var d = String(soruOzeti(o) || '').replace(/<[^>]*>/g, ' ');
    var m = d.match(/[\u0600-\u06FF][\u0600-\u06FF\u064B-\u0652\u0640\s]{3,}/);
    return m ? m[0].replace(/\s+/g, ' ').trim().slice(0, 64) : '';
  }
  function kagidim() {
    secili = secili.filter(function (a) { return V.harita[a]; });
    var kutu = $('#kagit');
    $$('.say-secili').forEach(function (e) { e.textContent = secili.length; });
    $('#kagitBos').hidden = !!secili.length;
    $('#kagitAraclar').hidden = !secili.length;
    /* Çıktısı bağlanmamış soru varsa kâğıt çıkmaz (29.09.2026). */
    var eksik = eksikCiktilar();
    ['#btnOnizle', '#btnPdf', '#btnYazdir'].forEach(function (s) {
      $(s).disabled = !secili.length || eksik.length > 0;
    });
    var uy = $('#ciktiUyari');
    if (uy) {
      uy.hidden = !eksik.length;
      var uyz = $('#ciktiUyariYazi');
      if (uyz) uyz.textContent = eksik.length + ' sorunun öğrenme çıktısı boş. ' +
        'Sınav kâğıdı, her soru bir kazanıma bağlanmadan çıkmaz.';
    }
    var puanlar = puanDagit(secili.length);
    kutu.innerHTML = secili.map(function (a, i) {
      var o = V.harita[a];
      return '<li data-a="' + kac(a) + '"' + (eksik.indexOf(a) >= 0 ? ' class="eksik"' : '') +
        '><span class="no">' + (i + 1) + '</span>' +
        /* Soru metni kendi kutusunda, iki satıra kadar; yanında ARAPÇA
           parça (30.09.2026). Çeviri sorularında yönerge cümlesi hepsinde
           aynı ("Aşağıdaki cümleyi Türkçeye çeviriniz."), ayırt eden şey
           Arapça metin — o da soru kökünde değil özetinde duruyor.
           Tek satıra kırpılıyken on soru aynı görünüyordu. */
        '<span class="k-metin"><span class="k-soru">' + karisik(o.q.soru) +
        (function (ar) { return ar ? ' <bdi class="ar k-sor-ar">' + kac(ar) + '</bdi>' : ''; })(kagitArapca(o)) +
        '</span>' + ciktiSecici(a) + '</span>' +
        /* Puan artık yazılabilir: boş bırakılırsa otomatik dağıtılır. */
        (ayar.puan ? '<span class="k-puan"><input type="number" min="1" max="100" ' +
          'class="k-puan-gir" data-a="' + kac(a) + '" value="' + puanlar[i] + '"' +
          (elPuan(a) ? ' data-el="1"' : '') +
          ' aria-label="Bu sorunun puanı" title="Puanı elle yaz; boşaltırsan otomatik dağıtılır">' +
          '<b>p</b></span>' : '') +
        '<span class="k-dug"><button type="button" data-is="yukari" aria-label="Yukarı taşı"' + (i ? '' : ' disabled') + '>↑</button>' +
        '<button type="button" data-is="asagi" aria-label="Aşağı taşı"' + (i < secili.length - 1 ? '' : ' disabled') + '>↓</button>' +
        '<button type="button" data-is="sil" aria-label="Kâğıttan çıkar">✕</button></span></li>';
    }).join('');
    /* Gerçek toplam yazılıyor: soru sayısı toplam puandan çoksa her soru
       1 puan alıyor ve toplam ayar.toplam'ı aşıyor (bkz. puanDagit). */
    var puanToplam = puanlar.reduce(function (a, b) { return a + b; }, 0);
    $('#puanOzet').textContent = ayar.puan && secili.length
      ? 'Her soru ' + (puanlar[0] === puanlar[puanlar.length - 1] ? puanlar[0] : puanlar[puanlar.length - 1] + '–' + puanlar[0]) +
        ' puan · toplam ' + puanToplam +
        (puanToplam !== (parseInt(ayar.toplam, 10) || 100)
          ? ' — soru sayısı toplam puandan çok, her soru en az 1 puan aldı' : '')
      : '';
    /* Sepet kapalıyken de ne olduğu görünsün. */
    var so = $('#sepetOzet');
    if (so) {
      so.innerHTML = secili.length
        ? secili.length + ' soru' + (ayar.puan ? ' · toplam ' + puanToplam + ' puan' : '')
        : 'Havuzdan <b>+ Kâğıda ekle</b> ile başla';
    }
    sepetOlc();
    kaydet();
  }

  /* Puanlar toplam puana tam bölünür; artan ilk sorulara birer birer
     dağıtılır. 30.09.2026: soru sayısı toplam puandan ÇOKSA taban 0
     çıkıyor ve sondaki sorular kâğıda "0 p" basılıyordu — o durumda
     herkese 1 puan veriliyor (toplam, soru sayısına çıkar; puan özeti
     bunu söyler). */
  /* Öğretmenin elle yazdığı puanlar (anahtar → puan). Kutuyu boşaltmak
     o soruyu otomatik dağıtıma geri döndürür. */
  function elPuan(a) {
    var v = parseInt(ayar.elPuanlar && ayar.elPuanlar[a], 10);
    return v > 0 ? v : 0;
  }
  function puanDagit(n) {
    if (!n) return [];
    var t = Math.max(1, parseInt(ayar.toplam, 10) || 100);
    /* Elle verilen puanlar sabit; kalan, puanı verilmemiş sorulara
       otomatik dağıtılır (30.09.2026). */
    var el = secili.slice(0, n).map(elPuan);
    var elTop = el.reduce(function (x, y) { return x + y; }, 0);
    var kalanN = el.filter(function (p) { return !p; }).length;
    if (!kalanN) return el;
    var kalanT = Math.max(kalanN, t - elTop);          /* her birine en az 1 */
    var taban = Math.floor(kalanT / kalanN), art = kalanT - taban * kalanN, k = 0;
    return el.map(function (p) {
      if (p) return p;
      var v = taban + (k < art ? 1 : 0); k++; return v;
    });
  }

  /* Bir sorunun çıktısını, boşsa, öneriyle doldurur. Tek tek eklemede de
     toplu eklemede de aynı kural işlesin diye ayrı işlev (30.09.2026):
     eskiden yalnız ekleCikar atıyordu, "Görünenleri ekle" ve "Rastgele
     soru ekle" atamıyordu ve kâğıt hep kilitli duruma düşüyordu. */
  function ciktiyiDoldur(a) {
    if (ayar.yol !== 'sinav' || ciktiAtama[a]) return;
    var oner = odakCikti(V.harita[a]) || onerilenCikti(V.harita[a]);
    if (oner) ciktiAtama[a] = oner;
  }
  function ekleCikar(a) {
    var i = secili.indexOf(a);
    if (i >= 0) {
      secili.splice(i, 1);
      delete ciktiAtama[a];
      if (ayar.elPuanlar) delete ayar.elPuanlar[a];
    } else {
      secili.push(a);
      ciktiyiDoldur(a);
    }
    liste(); kagidim(); if (ayar.yol === 'sinav') cizAgac();
  }

  /* Kâğıdım satırındaki çıktı seçici: SINIFIN bütün çıktıları + bileşenleri.
     Seçili üniteye denk gelen program ünitesi başta. Tek üniteye
     kilitliyken atanmış bir kod ünite değişince listeden düşüyordu. */
  function ciktiSecici(a) {
    if (ayar.yol !== 'sinav' || !ciktiVarMi()) return '';
    var simdi = ciktiAtama[a] || '';
    var sec = ['<option value="">— çıktı seç —</option>'];
    var uSira = ciktiUniteSirasi(), cokUnite = uSira.length > 1;
    uSira.forEach(function (u) {
    uniteAlanlari(ayar.sinifNo, u).forEach(function (ak) {
      sec.push('<optgroup label="' +
        (cokUnite ? kac(ciktiUniteEtiketi(ayar.sinifNo, u)) + ' · ' : '') +
        kac(alanAdi(ak)) + '">');
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
    });
    return '<select class="k-cikti" data-a="' + kac(a) + '" aria-label="Öğrenme çıktısı">' + sec.join('') + '</select>';
  }

  /* =====================================================================
     6) SORUNUN KÂĞITTAKİ HÂLİ
     ===================================================================== */
  /* Sınavda çıktı numarası HER ZAMAN yazılır (yönergeye göre soru hangi
     kazanımı ölçüyor belli olsun); temrinde ayardan açılıp kapanır. */
  function ciktiKoduYazilsin() { return ayar.yol === 'sinav' || !!ayar.ciktiKodu; }

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
    /* Öğrenme çıktısı numarası (8.2.1 a gibi) SORUNUN SONUNDA (29.09.2026,
       öğretmen isteği). Sınavda her zaman yazılır — ayara bakmaz; temrinde
       isteğe bağlı. Eskiden soru başlığının sağ üstündeydi. */
    var kod = ciktiKoduYazilsin() ? ciktiEtiketi(o.anahtar) : '';
    var html = '<section class="k-soru" data-no="' + no + '" data-a="' + kac(o.anahtar) + '">' +
      '<div class="k-bas"><b class="k-no">' + no + '.</b><p>' + karisik(q.soru) + '</p>' +
      (ayar.puan ? '<span class="k-p">' + puan + ' p</span>' : '') + '</div>' + govde +
      (kod ? '<div class="k-ck-son"><span title="Öğrenme çıktısı">' + kac(kod) + '</span></div>' : '') +
      '</section>';
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
      '<div class="s-alt">' + [ayar.ders, ayar.sinif, ayar.tarih].filter(Boolean).map(kac).join(' · ') + '</div>' +
      /* Öğretmen adı Okul bilgileri'nde toplanıyordu ama hiçbir çıktıda
         görünmüyordu (30.09.2026). Yalnız sınav kâğıdında yazılır. */
      (ayar.yol === 'sinav' && okul.ogretmen
        ? '<div class="s-ogretmen">Ders Öğretmeni: ' + kac(okul.ogretmen) + '</div>' : '') +
      '</div>' + sag +
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
        var ck = ciktiKoduYazilsin() ? ciktiEtiketi(k.sira[i]) : '';
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
  /* 29.09.2026 (öğretmen isteği: "seçili soru tipi olmasın, filtreyi
     öğretmen kendisi seçebilsin"): AÇILIŞTA HİÇBİR TÜR SEÇİLİ DEĞİL.
     BOŞ LİSTE = SÜZGEÇ YOK; bütün klasik türler görünür, öğretmen bir
     türe basınca liste ona daralır (bkz. suzulmus). Eskiden
     KidefKlasik.VARSAYILAN kümesi kendiliğinden seçili geliyor, öteki
     türler havuzda olduğu hâlde listeye düşmüyordu. */
  function klasikAcikTurler() {
    return (ayar.klasikTur && ayar.klasikTur.length) ? ayar.klasikTur : [];
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
    var u = seciliUnite();
    var ad = (u && u.ad) || uniteAdi(ayar.sinifNo, ayar.unite);
    var dersIdleri = u ? u.dersler.map(function (d) { return d.id; }) : null;
    return window.KidefKlasik.uret(ayar.sinifNo, ayar.unite, ad, dersIdleri).then(function (liste) {
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
      son_dersler = liste.dersler || null;
      dersCipleri(son_dersler);
      return liste;
    }).catch(function (e) {
      klasikYukleniyor = false;
      if (bilgi) bilgi.textContent = 'Klasik sorular yüklenemedi.';
      console.error('[sinav] klasik', e);
    });
  }
  /* Ders çipleri: ünite içindeki dersler. "Tüm ünite" + her ders.
     Ünite başına tek dosyası olan kitaplarda (7. sınıf Mektep) tek ders çıkar,
     o zaman satır hiç gösterilmez. */
  function dersCipleri(dersler) {
    var kutu = $('#suz-ders'); if (!kutu) return;
    var sat = $('#dersSatir');
    if (!dersler || dersler.length < 2) { if (sat) sat.hidden = true; kutu.innerHTML = ''; return; }
    if (sat) sat.hidden = false;
    var say = {};
    V.sorular.forEach(function (o) { if (o.klasik) say[o.q.ders || ''] = (say[o.q.ders || ''] || 0) + 1; });
    var toplam = V.sorular.filter(function (o) { return o.klasik; }).length;
    kutu.innerHTML = '<button type="button" class="cip' + (ayar.dersSuz ? '' : ' acik') +
        '" data-ders="" aria-pressed="' + !ayar.dersSuz + '">Tüm ünite<small>' + toplam + '</small></button>' +
      dersler.map(function (d) {
        var v = ayar.dersSuz === d.id;
        return '<button type="button" class="cip' + (v ? ' acik' : '') + '" data-ders="' + kac(d.id) +
          '" aria-pressed="' + v + '">' + kac(d.ad) + '<small>' + (say[d.id] || 0) + '</small></button>';
      }).join('');
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
  /* ÇOKLU SEÇİM (29.09.2026, öğretmen isteği: "birden fazla bileşen &
     kazanım seçebilmem lazım, zaten sınav senaryolarında birden fazla
     seçilmeli"). Doğru: bir yazılı tek kazanımı değil, ünitenin birkaç
     kazanımını ölçer. Eskiden tek 'odak' vardı, ikinciye basınca birinci
     düşüyordu. */
  var odaklar = [];                               // ağaçta seçili çıktı kodları
  var son_dersler = null;                         // son yüklenen ünitenin dersleri

  function odakSecili(ck) { return odaklar.indexOf(ck) >= 0; }
  /* Çıktı kodu → alan becerisi anahtarı (ALAN_KISA'daki ad). */
  function ciktiAlanAdi(ck) {
    var ak = ck ? ck.split('.').slice(0, 3).join('.') : '';
    if (!ak) return '';
    var ad = alanAdi(ak), bulunan = '';
    Object.keys(ALAN_KISA).forEach(function (k) { if (!bulunan && ad.indexOf(k) === 0) bulunan = k; });
    return bulunan;
  }
  /* Süzgeç = seçili çıktıların alan becerilerinin BİRLEŞİMİ. Havuzda hiç
     sorusu olmayan beceri süzgece KATILMAZ: dinleme, konuşma ve yazma
     becerilerinin yazılı soru havuzunda karşılığı yok; katsak liste
     bomboş kalır, öğretmen soruyu bulamaz. Durum satırı bunu söyler. */
  /* Ölçüt YOLUN havuzu: sınavda yalnız klasik sorular görünüyor, oysa
     eskiden bütün havuza bakılıyordu. Yalnız çoktan seçmelide karşılığı
     olan bir beceri (Sesletim) "süzüldü" sanılıp liste bomboş kalıyordu. */
  function yolHavuzu() {
    return ayar.yol === 'sinav'
      ? V.sorular.filter(function (o) { return o.klasik; })
      : V.sorular;
  }
  function odakSuzgeci() {
    var s = [], h = yolHavuzu();
    odaklar.forEach(function (ck) {
      var an = ciktiAlanAdi(ck);
      if (an && s.indexOf(an) < 0 &&
          h.some(function (o) { return soruAlanAnahtari(o) === an; })) s.push(an);
    });
    return s;
  }
  /* Seçili çıktılardan SORUYA UYANI: önce sorunun alan becerisiyle
     eşleşen; eşleşen yoksa ve tek çıktı seçiliyse o. Birkaç çıktı seçili
     ve hiçbiri sorunun becerisine uymuyorsa boş döner — o zaman tür
     tabanlı öneri (onerilenCikti) devreye girer. */
  function odakCikti(o) {
    if (!odaklar.length) return '';
    if (o) {
      var an = soruAlanAnahtari(o);
      for (var i = 0; i < odaklar.length; i++) if (ciktiAlanAdi(odaklar[i]) === an) return odaklar[i];
    }
    return odaklar.length === 1 ? odaklar[0] : '';
  }
  /* Süzgeçte kullanılmayan (havuzda sorusu olmayan) seçili çıktılar. */
  function odakBossuzgec() {
    var h = yolHavuzu();
    return odaklar.filter(function (ck) {
      var an = ciktiAlanAdi(ck);
      return !an || !h.some(function (o) { return soruAlanAnahtari(o) === an; });
    });
  }

  /* --- yol seçimi --- */
  function yolKur(y, sessiz) {
    if (y === 'okul') y = 'sinav';
    if (y === 'alistirma') y = 'temrin';
    ayar.yol = y;
    document.body.setAttribute('data-yol', y);
    $$('[data-yol-sec]').forEach(function (d) {
      var s = d.getAttribute('data-yol-sec') === y;
      d.setAttribute('aria-selected', s ? 'true' : 'false');
      d.classList.toggle('acik', s);
    });
    $('#uygulama').hidden = !y;
    $('#okulPaneli').hidden = y !== 'sinav';
    var yp = $('#yontemPaneli'); if (yp) yp.hidden = y !== 'sinav';
    yontemGoster();                       /* ağaç paneli yönteme göre açılır */
    var kp = $('#klasikPaneli'); if (kp) kp.hidden = !y;
    $('#ciktiAyar').hidden = !y;
    var aa = $('#aciklamaAyar'); if (aa) aa.hidden = y !== 'sinav';
    $('#btnDagilim').hidden = y !== 'sinav';
    if (y === 'sinav') {
      /* SINAVDA YALNIZ AÇIK UÇLU SORU OLUR (Yazılı ve Uygulamalı Sınavlar
         Yönergesi m.5/1-e). suzulmus() çoktan seçmelileri LİSTEDEN
         gizliyor ama kâğıt secili'den kuruluyordu: temrinde seçilmiş test
         soruları sekme değişince kâğıtta kalıyor ve resmî yazılıya şıklı
         sorular basılıyordu. Burada çıkarılıyorlar. V.harita boşken
         (ilk açılış, havuz daha yüklenmedi) dokunulmuyor. */
      if (V.harita && secili.length) {
        var atilan = 0;
        secili = secili.filter(function (a) {
          var o = V.harita[a];
          if (o && !o.klasik) { delete ciktiAtama[a]; atilan++; return false; }
          return true;
        });
        if (atilan) durum(atilan + ' çoktan seçmeli soru kâğıttan çıkarıldı — ' +
          'sınav kâğıdında yalnız açık uçlu sorular olur.', 'uyari');
      }
      ayar.ciktiKodu = true; anteteAktar();
      /* Sınavda numara zorunlu; onay kutusu anlamsız kaldığı için gizlenir. */
      var cka = $('#ciktiKoduAyar'); if (cka) cka.hidden = true;
      /* 29.09.2026: bölümler artık HEP KAPALI açılıyor (öğretmen isteği),
         okul adı boş olsa da panel kendiliğinden açılmıyor. */
    } else if (y === 'temrin') {
      /* Okul sınavından gelindiyse antet ve çıktı numarası orada kalsın:
         alıştırma kâğıdında okul adı ve yazılı başlığı işi yok. */
      if (ayar.baslik === otoBaslik()) ayar.baslik = ayar.baslikSerbest || 'Arapça Temrin Kâğıdı';
      ayar.okul = '';
      ayar.ciktiKodu = false;
      var ck2 = $('#ciktiKoduAyar'); if (ck2) ck2.hidden = false;
    }
    var ya = $('#yolAdi');
    if (ya) ya.textContent = y === 'sinav' ? 'Sınav — öğrenme çıktılarına göre, yalnız klasik sorular'
                           : y === 'temrin' ? 'Temrin — alıştırma ve çalışma kâğıdı' : '';
    /* "Yolu değiştir" düğmesi kalktı: yol artık üstteki sekmelerden seçiliyor. */
    if (!sessiz) {
      formDoldur(); cipler(); klasikCipleri(); liste(); kagidim();
      Promise.resolve(sinifSecKur()).then(function () {
        if (y === 'sinav') cizAgac();
        if (ayar.sinifNo) return klasikYukle();
      }).then(function () { cipler(); liste(); if (y === 'sinav') cizAgac(); });
    }
    kaydet();
  }

  /* --- ÜSTTE SABİT SINIF ŞERİDİ / ALTTA SEPET (29.09.2026) ------------
     Üstteki başlık şeridiyle alttaki sepetin yüksekliği yazı boyuna ve
     ekran enine göre değişiyor; ikisi de JS'le ölçülüp CSS değişkenine
     yazılıyor: --ust-y (sınıf paneli oraya yapışıyor) ve --sepet-y
     (sayfanın alt boşluğu, içerik sepetin altında kalmasın). */
  function sepetOlc() {
    var u = document.querySelector('.ust');
    if (u) document.documentElement.style.setProperty('--ust-y', u.offsetHeight + 'px');
    /* Sepet AÇIKKEN ölçme: o an yüksekliği ekranın yarısı, sayfanın alt
       boşluğu boşuna o kadar büyümesin. */
    if (document.body.classList.contains('sepet-acik')) return;
    var p = document.querySelector('.kagit-panel');
    if (p && !p.hidden) document.documentElement.style.setProperty('--sepet-y', p.offsetHeight + 'px');
  }
  function sepetAc(ac) {
    document.body.classList.toggle('sepet-acik', !!ac);
    var t = $('#sepetTog');
    if (t) t.setAttribute('aria-expanded', ac ? 'true' : 'false');
    sepetOlc();
  }

  /* Şeritteki soru türü rozeti. Sayım ÇİPLERDEN okunuyor: havuzda hiç
     sorusu olmayan tür çipte görünmüyor, şeritte de görünmesin — yazan
     hep listeyi gerçekten süzen türler olsun. Hiçbiri seçili değilse
     süzgeç yoktur, yani hepsi listelenir. */
  function klasikTurOzeti() {
    var kutu = $('#suz-klasik'); if (!kutu) return '';
    var cip = [].slice.call(kutu.querySelectorAll('[data-klasik]'));
    if (!cip.length) return '';
    var acik = cip.filter(function (b) { return b.classList.contains('acik'); });
    if (!acik.length || acik.length === cip.length) return 'tüm soru türleri (' + cip.length + ')';
    return acik.map(function (b) {
      return ((b.firstChild && b.firstChild.nodeValue) || b.textContent || '').trim();
    }).join(' · ');
  }

  /* Sınıf panelinin başlığı: seçili SINIF, KİTAP ve ÜNİTE hep görünsün
     (öğretmen isteği: "her zaman yukarda hangi sınıf ve kitabı olduğu
     açık olsun"). Metin seçicilerin kendi yazısından geliyor, yani kitap
     adı listede nasıl yazıyorsa şeritte de öyle. */
  function klasikOzetYaz() {
    var e = $('#klasikOzet'); if (!e) return;
    var s = $('#sinifSec');
    var sad = (s && s.value && s.selectedIndex >= 0) ? (s.options[s.selectedIndex].textContent || '').trim() : '';
    if (!sad) { e.textContent = 'önce sınıf ve kitap seç'; e.className = 'sv-ozet bos'; return; }
    var u = $('#uniteSec');
    var uad = (u && !u.disabled && u.selectedIndex >= 0) ? (u.options[u.selectedIndex].textContent || '').trim() : '';
    /* ÜÇ AYRI RENK (29.09.2026, öğretmen isteği): sınıf+kitap yeşil,
       ünite mavi, soru türü süzgeci turuncu. Hangi bilginin ne olduğu
       bir bakışta ayrılsın. */
    var tad = klasikTurOzeti();
    e.innerHTML = '<span class="ko-sinif">' + kac(sad) + '</span>' +
                  (uad ? '<span class="ko-unite">' + kac(uad) + '</span>' : '') +
                  (tad ? '<span class="ko-tur">' + kac(tad) + '</span>' : '');
    e.className = 'sv-ozet';
  }

  /* --- sınav hazırlama yöntemi (29.09.2026) ---------------------------
     İki yöntem aynı kâğıdı üretir, FARK HAVUZUN NASIL DARALDIĞINDA:
       'cikti' → çıktı ağacı açık; seçilen çıktının alan becerisi havuzu
                 süzer, eklenen soru o çıktıyı kendiliğinden alır.
       'havuz' → ağaç kapalı, süzme yok; soru doğrudan seçilir, çıktısı
                 Kâğıdım'daki seçiciden bağlanır (önerisi hazır gelir).
     Her iki yöntemde de çıktısız soruyla kâğıt çıkmaz. */
  function yontemGoster() {
    if (ayar.yontem !== 'havuz') ayar.yontem = 'cikti';
    /* Gövdedeki imi 'data-sinav-yontem': gövde de [data-yontem] ile
       eşleşip düğme sanılmasın (yoksa her tık yöntemi değiştirirdi). */
    document.body.setAttribute('data-sinav-yontem', ayar.yontem);
    $$('button[data-yontem]').forEach(function (b) {
      var s = b.getAttribute('data-yontem') === ayar.yontem;
      b.setAttribute('aria-pressed', s ? 'true' : 'false');
      b.classList.toggle('acik', s);
    });
    var ap = $('#agacPaneli');
    if (ap) ap.hidden = !(ayar.yol === 'sinav' && ayar.yontem === 'cikti');
  }
  function yontemKur(y) {
    ayar.yontem = (y === 'havuz') ? 'havuz' : 'cikti';
    if (ayar.yontem === 'havuz') odaklar = [];   /* havuz yönteminde süzme yok */
    yontemGoster();
    gosterilen = LISTE_ADIM; cizAgac(); cipler(); liste(); kagidim(); kaydet();
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
  /* Sınıf seçici: BİRDEN ÇOK KİTABI OLAN SINIFLAR AYRI SATIR (24.09.2026).
     6, 7 ve 10. sınıfın iki kitabı var; ünite sayıları, ders verisi klasörü ve
     çıktı eşlemesi kitaba göre değiştiği için tek "7. sınıf" satırı yanıltıcıydı.
     Kitap listesi sistem/sinifveri.js'ten (veriYillari) gelir; seçilince
     veriYiliSec ile sitenin kendi kitap seçimi de güncellenir, böylece ders
     verisi doğru klasörden okunur. */
  function kitapListesi(sinif) {
    try {
      var v = window.KidefSinifVeri;
      if (v && v.veriYillari) return v.veriYillari(sinif) || [];
    } catch (e) {}
    return [];
  }
  function sinifSecKur() {
    var s = $('#sinifSec'); if (!s) return;
    if (!s.options.length) {
      var ic = ['<option value="">Sınıf ve kitap…</option>'];
      [5, 6, 7, 8, 9, 10].forEach(function (x) {
        var ks = kitapListesi(x);
        if (ks.length < 2) { ic.push('<option value="' + x + '|">' + x + '. sınıf</option>'); return; }
        ic.push('<optgroup label="' + x + '. sınıf">');
        ks.forEach(function (k) {
          ic.push('<option value="' + x + '|' + kac(k.yil) + '">' + x + '. sınıf — ' +
                  kac(k.ad || k.yil) + (k.maarif ? ' (Maarif)' : '') + '</option>');
        });
        ic.push('</optgroup>');
      });
      s.innerHTML = ic.join('');
    }
    s.value = ayar.sinifNo ? (ayar.sinifNo + '|' + (ayar.kitapYil || '')) : '';
    if (!s.value && ayar.sinifNo) {                 // kayıtlı kitap listede yoksa ilkine düş
      var ilk = kitapListesi(ayar.sinifNo)[0];
      ayar.kitapYil = ilk ? ilk.yil : '';
      s.value = ayar.sinifNo + '|' + (ayar.kitapYil || '');
    }
    kitabiUygula();
    return uniteSecKur();
  }
  /* Sitenin kitap seçimini de güncelle: dersYolu buna bakıyor. */
  function kitabiUygula() {
    try {
      var v = window.KidefSinifVeri;
      if (v && v.veriYiliSec && ayar.sinifNo && ayar.kitapYil) v.veriYiliSec(ayar.sinifNo, ayar.kitapYil);
    } catch (e) {}
  }
  /* Üniteler SEÇİLİ KİTAPTAN gelir (muhadese.js müfredat ağacı), öğretim
     programından değil: 7. sınıf Mektep kitabı 6 ünite, MEB kitabı 4 ünite.
     Program ünitesi (veri_ciktilar.js) yalnız çıktı ağacı için kullanılır. */
  var son_uniteler = [];
  function uniteSecKur() {
    var u = $('#uniteSec'); if (!u) return;
    if (!ayar.sinifNo || !window.KidefKlasik || !window.KidefKlasik.uniteler) {
      u.innerHTML = '<option value="">—</option>'; u.disabled = true; son_uniteler = []; return;
    }
    return window.KidefKlasik.uniteler(ayar.sinifNo, ayar.kitapYil).then(function (us) {
      son_uniteler = us || [];
      if (!son_uniteler.length) {                    /* ağaç okunamazsa programa düş */
        var n = uniteSayisi(ayar.sinifNo);
        for (var i = 1; i <= n; i++) son_uniteler.push({ no: i, ad: uniteAdi(ayar.sinifNo, i), dersler: [] });
      }
      if (!son_uniteler.length) { u.innerHTML = '<option value="">—</option>'; u.disabled = true; return; }
      u.disabled = false;
      u.innerHTML = son_uniteler.map(function (x) {
        return '<option value="' + x.no + '">' + x.no + '. ünite' + (x.ad ? ' — ' + kac(x.ad) : '') + '</option>';
      }).join('');
      if (+ayar.unite > son_uniteler.length) ayar.unite = '1';
      u.value = ayar.unite;
    });
  }
  function seciliUnite() {
    for (var i = 0; i < son_uniteler.length; i++) if (String(son_uniteler[i].no) === String(ayar.unite)) return son_uniteler[i];
    return null;
  }

  /* --- çıktı ağacı --- */
  /* Çıktı süzgeci UYGULANMADAN, o anki sınıf/ünite/tür/arama süzgeçleriyle
     kalan havuz. Ağaçtaki sayılar bunun üstünden hesaplanıyor; eskiden
     bütün havuz sayılıyordu ve ünitede 107 soru varken başlıkta
     "727 soru" yazıyordu. Odak dışarıda bırakılıyor, yoksa bir çıktı
     seçtiğin an öteki becerilerin sayısı sıfıra düşerdi. */
  function odaksizHavuz() {
    var eski = odaklar;
    odaklar = [];
    try { return suzulmus(); } finally { odaklar = eski; }
  }
  function ciktiSoruSayisi(alanKod) {
    var ad = alanAdi(alanKod), an = '';
    Object.keys(ALAN_KISA).forEach(function (k) { if (!an && ad.indexOf(k) === 0) an = k; });
    if (!an) return 0;
    return odaksizHavuz().filter(function (o) { return soruAlanAnahtari(o) === an; }).length;
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
    /* SINIFIN bütün program üniteleri; seçili üniteye denk geleni başta.
       Kitabın ünite adı programınkiyle tutmadığı için (8/2 "Kültür ve
       Sanat" ↔ program 2 "Sağlıklı Hayatım") ünite başlığı yazılıyor. */
    var uSira = ciktiUniteSirasi();
    if (!uSira.length) { kutu.innerHTML = '<div class="bos">Bu sınıfın program çıktıları bulunamadı.</div>'; return; }
    var cokUnite = uSira.length > 1;
    kutu.innerHTML = uSira.map(function (u, ui) {
      var alanlar = uniteAlanlari(ayar.sinifNo, u);
      /* Kitapta seçtiğin numaraya denk gelen ünite AÇIK; ötekiler katlı.
         Hepsi listelenmese kitabın 5-6. ünitesinde hiç kazanım çıkmıyor,
         listelense de dört ünite alt alta çok uzuyordu. */
      var ic = alanlar.map(function (ak) {
      var sy = ciktiSoruSayisi(ak);
      return '<section class="ag-alan"><h4>' + kac(alanAdi(ak)) +
        '<small>' + (sy ? sy + ' soru' : 'havuzda soru yok') + '</small></h4>' +
        alanCiktilari(ak).map(function (ck) {
          var c = C.cikti[ck], se = ciktiSecimSayisi(ck);
          return '<button type="button" class="ag-cikti' + (odakSecili(ck) ? ' acik' : '') +
            '" aria-pressed="' + odakSecili(ck) + '" data-cikti="' + ck + '">' +
            '<b>' + ck + '</b><span>' + kac(c.m || '') + '</span>' +
            (se ? '<i class="ag-say">' + se + ' soru seçili</i>' : '') + '</button>';
        }).join('') + '</section>';
      }).join('');
      if (!cokUnite) return ic;
      var basAd = kac(ciktiUniteEtiketi(ayar.sinifNo, u));
      var secSay = odaklar.filter(function (ck) { return ck.indexOf(ayar.sinifNo + '.' + u + '.') === 0; }).length;
      return ui
        ? '<details class="ag-unite-kat"' + (secSay ? ' open' : '') + '><summary>' + basAd +
          (secSay ? '<i>' + secSay + ' seçili</i>' : '') + '</summary>' + ic + '</details>'
        : '<h3 class="ag-unite ag-unite-esas">' + basAd +
          '<small>kitapta seçtiğin ünite numarasıyla aynı</small></h3>' + ic;
    }).join('');
    var d = $('#agacDurum');
    if (!d) return;
    if (!odaklar.length) {
      d.innerHTML = '<b>Birden çok çıktı seçebilirsin</b> — bir yazılıda genelde ünitenin ' +
        'birkaç kazanımı ölçülür. Seçtiklerinin alan becerileri havuzu süzer.';
      d.className = 'agac-durum'; return;
    }
    var alanlar = odakSuzgeci(), bos = odakBossuzgec();
    d.className = 'agac-durum' + (alanlar.length ? '' : ' uyari');
    var y = '<b>' + odaklar.length + ' çıktı seçili</b>';
    y += alanlar.length
      ? ' — havuz “' + alanlar.map(function (a) { return kac(ALAN_KISA[a] || a); }).join('”, “') + '” sorularına süzüldü'
      : ' — seçtiğin becerilerin havuzda hazır sorusu yok, liste süzülmedi';
    if (alanlar.length && bos.length) {
      y += '. <i>' + bos.join(', ') + '</i> için havuzda soru yok; o çıktıya uygun bir soru seçip ' +
           'Kâğıdım listesinden elle bağlayabilirsin';
    }
    y += ' · <button type="button" id="odakTemizle">seçimi kaldır</button>';
    d.innerHTML = y;
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
      [kac(okul.ad), kac(okul.yil), kac(ayar.baslik), kac(ayar.sinif),
       okul.ogretmen ? 'Ders Öğretmeni: ' + kac(okul.ogretmen) : ''].filter(Boolean).join(' · ') +
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
      var c = e.target.closest('.cip:not([data-klasik]):not([data-ders])');
      if (c) {
        var alan = c.getAttribute('data-alan'), d = c.getAttribute('data-deger');
        if (alan === 'zorluk') d = +d;
        if (suz[alan].has(d)) suz[alan].delete(d); else suz[alan].add(d);
        gosterilen = LISTE_ADIM; cipler(); liste(); return;
      }
      var yol = e.target.closest('[data-yol-sec]');
      if (yol) { yolKur(yol.getAttribute('data-yol-sec')); window.scrollTo(0, 0); return; }
      var dc = e.target.closest('[data-ders]');
      if (dc) {
        var yeni = dc.getAttribute('data-ders');
        ayar.dersSuz = (ayar.dersSuz === yeni) ? '' : yeni;
        gosterilen = LISTE_ADIM;
        dersCipleri((V.sorular.filter(function (o) { return o.klasik; }).length ? son_dersler : null));
        cipler(); liste(); kaydet(); return;
      }
      var kc = e.target.closest('[data-klasik]');
      if (kc) {
        var tip = kc.getAttribute('data-klasik');
        var acik = klasikAcikTurler().slice();
        var i = acik.indexOf(tip);
        if (i >= 0) acik.splice(i, 1); else acik.push(tip);
        ayar.klasikTur = acik;
        gosterilen = LISTE_ADIM; klasikCipleri(); cipler(); liste(); kaydet(); return;
      }
      var yn = e.target.closest('button[data-yontem]');
      if (yn) { yontemKur(yn.getAttribute('data-yontem')); return; }
      var ag = e.target.closest('.ag-cikti');
      if (ag) {
        var ck = ag.getAttribute('data-cikti');
        var oi = odaklar.indexOf(ck);
        if (oi >= 0) odaklar.splice(oi, 1); else odaklar.push(ck);   /* ÇOKLU */
        gosterilen = LISTE_ADIM; cizAgac(); cipler(); liste(); return;
      }
      if (e.target.closest('#odakTemizle')) {
        odaklar = [];
        gosterilen = LISTE_ADIM; cizAgac(); cipler(); liste(); return;
      }
      var ek = e.target.closest('.ekle');
      if (ek) { ekleCikar(ek.getAttribute('data-a')); return; }
      var dug = e.target.closest('#kagit button[data-is]');
      if (dug) {
        var a = dug.closest('li').getAttribute('data-a'), i = secili.indexOf(a), is = dug.getAttribute('data-is');
        /* Silinen sorunun çıktı ataması ve elle puanı da gitsin: eskiden
           kalıyor, soru yeniden eklenince eski koduyla geri geliyordu. */
        if (is === 'sil' && i >= 0) {
          secili.splice(i, 1);
          delete ciktiAtama[a];
          if (ayar.elPuanlar) delete ayar.elPuanlar[a];
        }
        if (is === 'yukari' && i > 0) { secili.splice(i, 1); secili.splice(i - 1, 0, a); }
        if (is === 'asagi' && i < secili.length - 1) { secili.splice(i, 1); secili.splice(i + 1, 0, a); }
        kagidim(); liste(); if (ayar.yol === 'sinav') cizAgac(); return;
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
      sec.forEach(ciktiyiDoldur);
      liste(); kagidim(); if (ayar.yol === 'sinav') cizAgac();
      durum(sec.length ? sec.length + ' soru rastgele eklendi.' : 'Eklenecek yeni soru kalmadı.', sec.length ? 'ok' : '');
    });
    $('#hepsiniEkle').addEventListener('click', function () {
      var aday = suzulmus().slice(0, gosterilen).filter(function (o) { return secili.indexOf(o.anahtar) < 0; });
      var yeni = aday.map(function (o) { return o.anahtar; });
      secili = secili.concat(yeni);
      yeni.forEach(ciktiyiDoldur);
      liste(); kagidim(); if (ayar.yol === 'sinav') cizAgac();
    });
    $('#kagitTemizle').addEventListener('click', function () {
      if (!secili.length) return;
      if (!window.confirm(secili.length + ' soru kâğıttan çıkarılsın mı?')) return;
      /* Çıktı atamaları ve elle puanlar da gitsin: eskiden ciktiAtama'da
         kalıyor, soru yeniden eklenince eski koduyla geri geliyordu. */
      secili.forEach(function (a) { delete ciktiAtama[a]; if (ayar.elPuanlar) delete ayar.elPuanlar[a]; });
      secili = []; liste(); kagidim(); if (ayar.yol === 'sinav') cizAgac();
    });
    $('#yenidenKaristir').addEventListener('click', function () {
      ayar.tohum = ayar.tohum % 9999 + 1;
      kagidim(); karisimYaz();
      durum('Şıklar yeniden karıştırıldı' + (ayar.kitapcik === 'AB' ? ', B kitapçığının soru sırası da değişti' : '') +
        '. Cevap anahtarı yeni sıraya göre çıkar.', 'ok');
    });
    document.addEventListener('change', function (e) {
      var pg = e.target.closest('.k-puan-gir');
      if (pg) {
        var pa = pg.getAttribute('data-a'), pv = parseInt(pg.value, 10);
        ayar.elPuanlar = ayar.elPuanlar || {};
        if (pv > 0) ayar.elPuanlar[pa] = pv; else delete ayar.elPuanlar[pa];
        kaydet(); kagidim(); return;
      }
      var cs = e.target.closest('.k-cikti');
      if (cs) {
        var a = cs.getAttribute('data-a');
        if (cs.value) ciktiAtama[a] = cs.value; else delete ciktiAtama[a];
        kaydet(); cizAgac(); kagidim(); return;
      }
    });
    var ss = $('#sinifSec');
    if (ss) ss.addEventListener('change', function () {
      var p2 = String(this.value).split('|');
      ayar.sinifNo = p2[0] || ''; ayar.kitapYil = p2[1] || '';
      ayar.dersSuz = ''; odaklar = [];
      kitabiUygula();                       /* dersYolu doğru klasöre baksın */
      anteteAktar(); formDoldur();
      Promise.resolve(uniteSecKur()).then(function () {
        gosterilen = LISTE_ADIM; cizAgac(); cipler(); liste(); kagidim();
        return klasikYukle();
      }).then(function () { cipler(); liste(); cizAgac(); });
    });
    var us = $('#uniteSec');
    if (us) us.addEventListener('change', function () {
      ayar.unite = this.value; ayar.dersSuz = ''; odaklar = [];
      gosterilen = LISTE_ADIM; cizAgac(); cipler(); liste(); kagidim();
      klasikYukle().then(function () { cipler(); liste(); cizAgac(); });
    });
    var st = $('#sepetTog');
    if (st) st.addEventListener('click', function () {
      sepetAc(!document.body.classList.contains('sepet-acik'));
    });
    window.addEventListener('resize', sepetOlc);
    var cd = $('#ciktiDoldur');
    if (cd) cd.addEventListener('click', function () {
      var n = 0;
      eksikCiktilar().forEach(function (a) {
        var o = ciktiOner(a);
        if (o) { ciktiAtama[a] = o; n++; }
      });
      kagidim(); cizAgac();
      durum(n ? n + ' soruya önerilen çıktı atandı; Kâğıdım listesinden değiştirebilirsin.'
              : 'Atanacak çıktı bulunamadı: önce sınıf ve üniteyi seç.', n ? 'ok' : 'hata');
    });
    var bd = $('#btnDagilim'); if (bd) bd.addEventListener('click', dagilimAc);
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
      yolKur(ayar.yol || 'sinav');            /* sekmeli: açılışta Sınav Hazırla */
      /* İlk iş sınıf seçmek; henüz seçilmemişse o panel AÇIK gelsin
         (30.09.2026). Eskiden bütün bölümler kapalı açılıyordu ve sayfa
         "0 soru" yazan, ne yapılacağı belli olmayan bir ekrandı. */
      if (!ayar.sinifNo) { var kp0 = $('#klasikPaneli'); if (kp0) kp0.open = true; }
      /* Sepet ve başlık şeridi yerleşsin (yazı tipi geç gelirse diye
         birkaç kez ölçülüyor). */
      sepetOlc(); [120, 500, 1400].forEach(function (ms) { setTimeout(sepetOlc, ms); });
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
