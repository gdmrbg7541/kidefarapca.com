/* =====================================================================
   KIDEF · OKUMA — ARAPÇA DİZİLİM ↔ TÜRKÇE DİZİLİM
   (okumayazma/okuma-cevir.js · alfabe.html "Okuma" sekmesi)
   ---------------------------------------------------------------------
   NE YAPAR — adım adım, "İleri" ile ilerleyen bir gösteri:

     1. Latin harfler hazırda durur, ARAPÇA MANTIKLA dizilmiş:
        sessiz harfler ÇİZGİNİN üstünde sağdan sola (çizgideki harfler
        önce okunur), sesliler çizginin altında-üstünde.
     2. Her "İleri" basışında BİR Arapça harf, harekesiyle birlikte,
        kendi Latin karşılığının altına gelir — yani HECE HECE ilerlenir.
        Açılan hecenin Latin sütunu ve altındaki çizgi renklenir, altta
        o hecenin okunuşu yazar (مُ = mu).
     3. ŞEDDELİ kelimede araya iki basış girer: önce cezimli harf yerini
        yalnız ŞEDDE işaretine bırakır (işaret havada durur, henüz öbür
        harfe eklenmemiştir), sonraki basışta şedde ikinci harfin üstüne
        oturur ve iki hücre tek şeddeli harfe döner.
     4. Harfler kelime içindeki BAĞLI biçimlerini alır (ـنَّـ), bir basış
        daha: ortada birleşip bitişik Arapça kelime olurlar.
     5. Son basış: Latin harflerin bir KLONU, Arapça kelimenin altına
        TEK TEK (aralarında gecikmeyle) süzülür ve Türkçe yazılış gibi
        dizilir: soldan sağa, sesli harf sessizin yanında.

   NEREDEN GELİYOR
   Kelimeler okumayazma/okuma.js dosyasındaki OK_KELIMELER listesinden
   alındı; konu başlıkları da oradaki sıraya uyar (hece · uzatma ·
   cezim · şedde). HARF KARŞILIKLARI ise öğretmenin çalışma kâğıdındaki
   (okuma-calisma-kagitlari.pdf) tabloya göre yazıldı: ث = ṯ · ذ = ḏ ·
   ق = q · ص = ṣ · ظ = ẓ … Bu üç harfte okuma.js'ten ayrılıyoruz;
   okuma.html güncellenecekse oradaki OK_HARFLER de buna çekilmeli.

   ÇALIŞMA MANTIĞI
     coz(kelime)  : Arapça'yı (sessiz + hareke) birimlerine ayırır ve her
                    birime kendi Arapça parçasını (harf + hareke) iliştirir.
                    Uzatma harfi kendinden önceki sesliyi â/î/û yapar,
                    şedde harfi ikiye böler (biri cezimli), KELİME BAŞINDAKİ
                    elif-hemze sesi kendi taşır, fethalı tenvinin elifi düşer,
                    harekeli ة "t" okunur.
     birimler(k)  : o listeye kelimenin küçük düzeltmelerini uygular.
     Üst satır ile Arapça satır tek bir CSS ızgarasında durur; sütunlar
     bu yüzden birebir hizalıdır. Bir HECE = bir Arapça harf + harekesi;
     şeddeli harf tek Arapça harf ama iki Latin harf olduğu için hücresi
     iki sütunu birden kaplar.

   KULLANIM
     <script src="okumayazma/okuma-cevir.js"></script>
     KidefOkumaCevir.kur('ocSar');      // ya da sekmeden: ocAc()
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefOkumaCevir) return;

  /* ---------------------------------------------------------------- veri
     Harf karşılıkları ve kelimeler okumayazma/okuma.js dosyasındaki
     OK_HARFLER / OK_KELIMELER ile AYNIDIR; iki sayfa aynı okunuşu
     göstersin diye buraya birebir kopyalandı. Orada bir harf değişirse
     burayı da güncelle. */
  var HARF = {
    /* ÖĞRETMENİN ÇALIŞMA KÂĞIDINDAKİ (PDF) HARF TABLOSU esas alındı:
         ث = ṯ (t, altı çizgili)   ذ = ḏ (d, altı çizgili)   ق = q
         ص = ṣ   ض = ḍ   ط = ṭ   ظ = ẓ   ح = ḥ   خ = ḫ   غ = ġ   ع = ʿ
       Not: okuma.js'te ث "s̱", ذ "ẕ", ق "ḳ" yazıyor; kâğıttaki yazım
       esas alındığı için burada farklılar. okuma.html güncellenirse
       oradaki OK_HARFLER da buna çekilmeli. */
    'ب': 'b', 'ت': 't', 'ث': 'ṯ', 'ج': 'c', 'ح': 'ḥ', 'خ': 'ḫ', 'د': 'd',
    'ذ': 'ḏ', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'ş', 'ص': 'ṣ', 'ض': 'ḍ',
    'ط': 'ṭ', 'ظ': 'ẓ', 'ع': 'ʿ', 'غ': 'ğ', 'ف': 'f', 'ق': 'q', 'ك': 'k',
    'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v', 'ه': 'h', 'ي': 'y',
    'ة': '',                      /* harekeliyse "t" okunur, aşağıda */
    'ء': 'ʾ'                      /* kelime başında değilse sessiz harf */
  };
  var KALIN = 'خرصضطظغق';            /* okuma.js'teki kalin:true harfler */
  var TASIYICI = 'اأإآء';            /* elif/hemze: KELİME BAŞINDA sesi taşır */
  var BIRLESMEZ = 'اأإآٱدذرزوؤةىء';  /* kendinden sonrakine bağlanmayan harfler */
  var TATVIL = '\u0640';             /* kaşide (uzatma çizgisi) */
  var ZWJ = '\u200D';                /* bitişme isteği. Kaşidenin yanına konunca
                                        harfin ORTA biçimi her yazı tipinde garanti
                                        olur: ـنَّـ gerçekten ـنـ gibi bitişik çıkar. */

  /* Kelimeler: okuma.js'teki OK_KELIMELER. Hepsi TENVİNLE bitiyor ve üç
     tenvin de örneklerde var: ً = an/en · ٌ = un · ٍ = ın/in. Tenvin
     okunduğu için kelimeler tam (vasıl) okunuşuyla veriliyor — okuma.js'in
     durak (vakf) yazımından farkı budur: يَدٌ orada "yed", burada "yedun".
     Fethalı tenvinden sonra yazılan elif okunmaz, düşürülür (وَلَدًا). */
  var KELIME = {
    hece: { ad: 'Hece', not: 'Bir sessiz harf + bir hareke: en küçük okuma birimi.', renk: '#2563EB', yardim: [['\u064E', 'e, a'], ['\u0650', 'i, ı'], ['\u064F', 'u, o']], liste: [
      { ar: 'يَدٌ', tr: 'el', e: '✋' },
      { ar: 'وَلَدًا', tr: 'çocuk', e: '🧒' },
      { ar: 'قَلَمٍ', tr: 'kalem', e: '🖊️' },
      { ar: 'رَجُلٌ', tr: 'adam', e: '🧔' },
      { ar: 'قَمَرٌ', tr: 'ay', e: '🌙' }
    ]},
    uzatma: { ad: 'Uzatma', not: 'Uzatma harfinin kendi sesi yoktur; ayrı yazılır ama önceki harekeyi uzatır.', renk: '#059669', yardim: [['\u064E\u0627', 'â'], ['\u064F\u0648', 'û'], ['\u0650\u064A', 'î']], liste: [
      { ar: 'بَابٌ', tr: 'kapı', e: '🚪' },
      { ar: 'كِتَابٌ', tr: 'kitap', e: '📗' },
      { ar: 'نُورٌ', tr: 'ışık', e: '💡' },
      { ar: 'طَالِبٍ', tr: 'öğrenci', e: '🎒' },
      { ar: 'كَبِيرٌ', tr: 'büyük', e: '🐘' },
      { ar: 'صَغِيرًا', tr: 'küçük', e: '🐜' },
      { ar: 'سَمَاءٌ', tr: 'gökyüzü', e: '🌤️' },
      { ar: 'مَاءً', tr: 'su', e: '💧' }
    ]},
    cezim: { ad: 'Cezim', not: 'Cezimli harf hareke almaz; kendinden önceki sesliye yapışır.', renk: '#E67E22', yardim: [['\u0652', 'ses yok']], liste: [
      { ar: 'بَيْتٌ', tr: 'ev', e: '🏠' },
      { ar: 'شَمْسٌ', tr: 'güneş', e: '☀️' },
      { ar: 'عِلْمٍ', tr: 'ilim', e: '🔬' },
      { ar: 'مُسْلِمٌ', tr: 'müslüman', e: '🕌' },
      { ar: 'مَدْرَسَةً', tr: 'okul', e: '🏫', d: [[2, 's', 'e']] },
      { ar: 'مَسْجِدٍ', tr: 'mescit', e: '🕌' }
    ]},
    sedde: { ad: 'Şedde', not: 'Şeddeli harf iki kez okunur: biri cezimli, biri harekeli.', renk: '#7C3AED', yardim: [['\u0651', 'harf iki kez']], liste: [
      { ar: 'رَبٌّ', tr: 'rab', e: '🤲' },
      { ar: 'أُمٌّ', tr: 'anne', e: '👩' },
      { ar: 'حَقٌّ', tr: 'hak', e: '⚖️', d: [[0, 's', 'a']] },
      { ar: 'جَنَّةً', tr: 'cennet', e: '🌴' },
      { ar: 'مُعَلِّمٌ', tr: 'öğretmen', e: '👨‍🏫', d: [[1, 's', 'a']] },
      { ar: 'سَيَّارَةٍ', tr: 'araba', e: '🚗', d: [[4, 's', 'e']] }
    ]}
  };
  var SIRA = ['hece', 'uzatma', 'cezim', 'sedde'];
  /* Her konuda ortak: kelimeler tenvinle bittiği için tenvin satırları
     yardım tablosunun altında hep durur. */
  var TENVIN = [['\u064B', 'en, an'], ['\u064C', 'un, on'], ['\u064D', 'in, ın']];

  /* ------------------------------------------------------- harf/hareke */
  var FTH = 'َ', DMM = 'ُ', KSR = 'ِ', SKN = 'ْ', SDD = 'ّ';
  var TNF = 'ً', TND = 'ٌ', TNK = 'ٍ';
  var ISARET = FTH + DMM + KSR + SKN + SDD + TNF + TND + TNK + 'ٰ';

  function sesli(harf, m) {
    var k = KALIN.indexOf(harf) >= 0;
    if (m.indexOf(TNF) >= 0) return { s: k ? 'an' : 'en', yer: 'ust' };
    if (m.indexOf(TND) >= 0) return { s: 'un', yer: 'ust' };
    if (m.indexOf(TNK) >= 0) return { s: k ? 'ın' : 'in', yer: 'alt' };
    if (m.indexOf(FTH) >= 0) return { s: k ? 'a' : 'e', yer: 'ust' };
    if (m.indexOf(DMM) >= 0) return { s: 'u', yer: 'ust' };
    if (m.indexOf(KSR) >= 0) return { s: k ? 'ı' : 'i', yer: 'alt' };
    if (m.indexOf(SKN) >= 0) return { s: '', yer: 'ust', sukun: true };
    return { s: '', yer: 'ust' };
  }

  /* Kelimeyi birimlere ayırır. Her birim: bir sessiz + (varsa) bir sesli,
     bir de o birimin Arapça parçası (arTam: harf + harekeleri). Ayrı harf
     sayılmayan parçalar (uzatma harfi, düşen ة / ء) kendinden önceki
     birimin Arapça parçasına eklenir; hiçbir işaret kaybolmaz. */
  function coz(kelime) {
    var ham = [], i, c, m, j;
    for (i = 0; i < kelime.length;) {
      c = kelime.charAt(i);
      if (c >= 'ء' && c <= 'ي') {
        m = ''; j = i + 1;
        while (j < kelime.length && ISARET.indexOf(kelime.charAt(j)) >= 0) { m += kelime.charAt(j); j++; }
        ham.push({ h: c, m: m }); i = j;
      } else i++;
    }
    var b = [], k;
    for (k = 0; k < ham.length; k++) {
      var h = ham[k].h, m = ham[k].m, son = (k === ham.length - 1);
      /* harekesiz kapanış harfleri (ة, durakta okunmayan hemze) düşüyor */
      if (!m && son && (h === 'ة' || h === 'ء')) {
        if (b.length) b[b.length - 1].arTam += h;
        continue;
      }
      /* Fethalı tenvinden sonraki elif yalnız yazılır, okunmaz: وَلَدًا */
      if (!m && son && h === 'ا' && k > 0 && ham[k - 1].m.indexOf(TNF) >= 0) {
        if (b.length) b[b.length - 1].arTam += h;
        continue;
      }
      /* Uzatma (med) harfi mi? Önceki hareke ile aynı cinsten, kendisi
         harekesiz. Kendi sesi YOKTUR, önceki harekeyi uzatır — ama Arapça
         tarafta ayrı bir harftir, o yüzden önceki harfe yapıştırılmaz:
         kendi sütununda, kendi adımında gelir. Latin tarafta karşılığı
         yoktur; çizgisi kesik çizilir, uzayan ses (â/î/û) önceki harfin
         üstünde durur. */
      if (!m && k > 0 && b.length) {
        var onc = ham[k - 1].m;
        if ((h === 'ا' && onc.indexOf(FTH) >= 0) || (h === 'و' && onc.indexOf(DMM) >= 0) || (h === 'ي' && onc.indexOf(KSR) >= 0)) {
          var u = b[b.length - 1];
          u.sesli = (h === 'ا') ? 'â' : (h === 'و' ? 'û' : 'î');
          u.uzun = true;
          b.push({ harf: '', arTam: h, sesli: '', yer: 'ust', uzatma: true, uzunSes: u.sesli });
          continue;
        }
      }
      var v = sesli(h, m);
      /* Elif/hemze kendi sesi olmayan bir taşıyıcıdır: أَب'ın "e"si onun
         HAREKESİDİR, harfi değil. Arapça düzende bu yüzden çizginin
         üstünde durur; çizgideki yeri boş kalır (yalnız genişlik tutar).
         Türkçe düzende satıra inip yanındaki sessize yapışır: "e"+"b". */
      if (TASIYICI.indexOf(h) >= 0 && b.length === 0) {
        if (!v.s) continue;
        b.push({ harf: '', arTam: h + m, sesli: v.s, yer: v.yer, tasiyici: true });
        continue;
      }
      /* ة harekeliyse "t" okunur (مَدْرَسَةً = medreseten), harekesizse düşer */
      var lat = (h === 'ة') ? (m ? 't' : '') : (HARF[h] != null ? HARF[h] : h);
      if (!lat) continue;
      if (m.indexOf(SDD) >= 0) {
        /* Şedde: harf iki kez okunur — birincisi CEZİMLİ, ikincisi HAREKELİ.
           Gösteride önce bu iki harf ayrı ayrı gelir (بْ + بٌ), sonra
           birleşip şeddeli tek harfe döner (بٌّ). arSedde o birleşik hâli
           tutar; arTam'lar ise ayrı ayrı hâlleridir. */
        var msz = m.split(SDD).join('');          /* şeddesiz harekeler */
        b.push({ harf: lat, arTam: h + SKN, arSedde: h + m, sesli: '', yer: 'ust',
                 sukun: true, seddeIlk: true });
        b.push({ harf: lat, arTam: h + msz, sesli: v.s, yer: v.yer, sukun: !!v.sukun,
                 sedde: true });
      } else {
        b.push({ harf: lat, arTam: h + m, sesli: v.s, yer: v.yer, sukun: !!v.sukun });
      }
    }
    return b;
  }

  /* Kelimenin kendi küçük düzeltmeleri: okuma.js'teki Latin yazımla
     birebir aynı olsun diye (örn. قَلَم "ḳalem" değil "kalem" okunuyor).
       d: [[birim, 'h'|'s', yeni]]   ek: sona eklenecek sessiz (ة'nin t'si) */
  function birimler(k) {
    var b = coz(k.ar), i, t;
    if (k.d) for (i = 0; i < k.d.length; i++) {
      t = k.d[i];
      if (b[t[0]]) b[t[0]][t[1] === 'h' ? 'harf' : 'sesli'] = t[2];
    }
    if (k.ek) b.push({ harf: k.ek, arTam: '', sesli: '', yer: 'ust' });
    return b;
  }

  function baglanir(h) { return h && BIRLESMEZ.indexOf(h) < 0; }
  function sonHarf(t) {
    for (var i = t.length - 1; i >= 0; i--) {
      var c = t.charAt(i);
      if (c >= '\u0621' && c <= '\u064A') return c;
    }
    return '';
  }

  function okunus(b) {
    return b.map(function (x) { return x.harf + (x.sesli || ''); }).join('');
  }

  /* ------------------------------------------------------------- stil */
  function stil() {
    if (document.getElementById('ocStil')) return;
    var s = document.createElement('style');
    s.id = 'ocStil';
    s.textContent =
      /* yazı tipi: sayfanın kendi yazı tipi (site geneli arakom.css) */
      /* Genis ekranda (tahta/projeksiyon) harfler daha da buyusun diye
         calisma alani genisliyor. */
      '.oc-sar{position:relative;max-width:min(1700px,96vw);margin:0 auto;' +
        'padding:6px 10px 26px;font-family:inherit}' +
      /* KONU SEÇİMİ — sarf/kaliplartablosu.css'teki mücerred/mezid anahtarının
         aynısı: gri bir yuvanın içinde KIRMIZI bir kaydırak, seçilen konunun
         altına KAYARAK gider; yazı o an beyaza döner. Kaydırağın yeri ve eni
         JS'te seçili düğmeden ölçülüyor (kaydiragiOynat) — konu adları farklı
         uzunlukta olduğu için yüzdeyle hesap tutmuyor. */
      '.oc-serit{position:relative;display:flex;gap:4px;align-items:stretch;' +
        'background:#f1f5f9;border:2px solid #e2e8f0;padding:4px;border-radius:14px;' +
        'width:max-content;max-width:100%;margin:0 auto 14px;box-sizing:border-box}' +
      '.oc-kaydirak{position:absolute;top:4px;bottom:4px;left:0;width:0;' +
        'transform:translateX(0);background:#FF3B30;border-radius:10px;z-index:1;' +
        'pointer-events:none;' +
        'transition:transform .32s cubic-bezier(.25,1,.5,1),width .32s cubic-bezier(.25,1,.5,1)}' +
      '.oc-hap{position:relative;z-index:2;flex:1 1 auto;border:0;background:none;' +
        'color:#0F2A43;border-radius:10px;white-space:nowrap;' +
        'padding:clamp(6px,.9vw,14px) clamp(12px,1.9vw,30px);' +
        'font:inherit;font-weight:800;cursor:pointer;letter-spacing:.3px;' +
        'font-size:clamp(1.1rem,2.7vw,2.4rem);transition:color .22s ease}' +
      '.oc-hap:hover{color:#FF3B30}' +
      '.oc-hap.aktif,.oc-hap.aktif:hover{color:#fff}' +
      '@media (prefers-reduced-motion:reduce){.oc-kaydirak{transition:none}}' +
      '.oc-not{text-align:center;color:#64748B;font-size:clamp(.88rem,1.35vw,1.15rem);margin:0 0 14px;line-height:1.5}' +
      /* GÖVDE: solda çalışma alanı, SAĞDA dikey yardım tablosu */
      /* Alt sag kosedeki kumanda tuslari icin serit ayrilir: yardim tablosu
         uzun oldugunda tuslarin ustune binmesin. */
      '.oc-govde{display:grid;grid-template-columns:minmax(0,1fr) auto;' +
        'gap:clamp(12px,2vw,30px);align-items:start;padding-bottom:clamp(58px,6vw,78px)}' +
      /* Yardım tablosu — dikey, konuya göre değişir. Kutu değil: ince
         satır çizgileri ve kırmızı bir başlık. */
      '.oc-yardim{display:flex;flex-direction:column;align-self:start;' +
        'min-width:clamp(140px,15vw,250px);color:#8A7A5E;' +
        'font-size:clamp(.78rem,1.1vw,1.02rem);font-weight:700}' +
      '.oc-yardim-bas{color:#C0392B;font-weight:800;font-size:1.05em;text-align:right;' +
        'padding:0 12px 6px 0;border-bottom:2px solid rgba(192,57,43,.45);white-space:nowrap}' +
      '.oc-yy{display:flex;align-items:center;justify-content:space-between;gap:12px;' +
        'padding:9px 14px 9px 2px;border-bottom:1px solid rgba(140,120,80,.22);white-space:nowrap;' +
        'overflow:hidden}' +
      '.oc-yy i{font-style:normal}' +
      '.oc-yy-ara{justify-content:flex-end;color:#B9A98A;font-size:.85em;font-weight:800;' +
        'letter-spacing:1px;text-transform:uppercase;border-bottom:0;padding:14px 14px 4px 2px}' +
      /* İşaretler SAĞDA ve BÜYÜK: uzaktan da okunsun diye */
      '.oc-yy b{font-family:"arakom","Noto Naskh Arabic","Amiri",serif;' +
        'font-size:clamp(2.8rem,min(5.2vw,6.6vh),5.4rem);' +
        'font-weight:400;color:#B03A2E;direction:rtl;display:inline-block;line-height:1.2;' +
        'min-width:1.7em;text-align:center}' +
      '.oc-yy b.yk{transform:translateY(-.2em)}' +
      /* KUTUSUZ DÜZEN: çerçeve, zemin, gölge yok — her şey sayfanın kendi
         boşluğunda akar. Kâğıt hissini tek başına YAZI ÇİZGİSİ ve kalem
         renkleri (mavi harf, kırmızı hareke) veriyor. */
      /* position:static — kumanda tuslari .oc-sar'in kosesine yaslansin */
      '.oc-kart{position:static;background:none;border:0;border-radius:0;box-shadow:none;padding:0}' +
      '.oc-emoji{font-size:clamp(1.3rem,2.1vw,1.9rem);line-height:1;margin-inline-end:8px;' +
        'vertical-align:-.12em}' +
      '.oc-sayfa{position:relative;padding:0}' +

      /* ---- sahne: üstte Latin, ortada Arapça, altta Latin klonu ---- */
      '.oc-sahne{display:flex;flex-direction:column;align-items:center;' +
        'gap:clamp(4px,.9vw,12px);padding:clamp(6px,1.1vw,14px) 0 clamp(2px,.6vw,8px)}' +

      /* Izgara: 1. satır Latin birimleri, 2. satır Arapça harfler.
         direction:rtl ile 1. sütun EN SAĞDA olur; iki satır hizalı kalır. */
      '.oc-cizelge{display:grid;grid-auto-columns:max-content;justify-content:center;' +
        'direction:rtl;position:relative;row-gap:clamp(6px,1vw,14px)}' +

      '.oc-birim{grid-row:1;position:relative;display:block;text-align:center;' +
        'padding:calc(var(--ocharf,7rem) * .54) 0 calc(var(--ocharf,7rem) * .56)}' +
      /* ÇİZGİ: sessiz harfler bu çizginin üstünde durur — önce onlar okunur. */
      /* Yazı çizgisi harflerin TABANINDA: satır kutusu kısaltıldı, harf
         kutudan taşar; böylece çizgi ile harf arasında boşluk kalmaz. */
      '.oc-ray{display:block;padding:0 calc(var(--ocharf,7rem) * .12) 0;line-height:.74;' +
        'border-bottom:clamp(1.5px,.16vw,3px) solid #DEE4EB;transition:border-color .25s}' +
      '.oc-harf{display:inline-block;position:relative;font-weight:700;' +
        'font-size:var(--ocharf,7rem);color:#1B4EA8;line-height:.74;' +
        'transition:transform .55s cubic-bezier(.4,0,.2,1),opacity .3s ease,color .25s}' +
      '.oc-bos{visibility:hidden}' +
      '.oc-yuva{position:absolute;left:0;right:0;line-height:1}' +
      '.oc-yuva.ust{top:0}' +
      '.oc-yuva.alt{bottom:0}' +
      '.oc-ses{display:inline-block;font-weight:700;color:#CF3A2E;line-height:1.08;' +
        'font-size:var(--ocharf,7rem);' +
        'transition:transform .55s cubic-bezier(.4,0,.2,1),opacity .3s ease}' +
      /* üst satırda hareke, harften küçük durur */
      '.oc-cizelge .oc-ses{font-size:calc(var(--ocharf,7rem) * .5)}' +
      /* okunan hece: altındaki çizgi ve harf renklenir */
      '.oc-birim.vurgu .oc-ray{border-bottom-color:var(--ocr,#2563EB)}' +
      '.oc-birim.vurgu .oc-harf{color:var(--ocr,#2563EB)}' +
      '.oc-birim.vurgu .oc-ses{color:var(--ocr,#2563EB)}' +
      /* uzatma harfinin sütunu: Latin karşılığı yok, çizgi kesik */
      '.oc-birim.uzt .oc-ray{border-bottom-style:dashed}' +
      /* şeddeli ikili tek harften geldiği için ortak zemin */
      '.oc-birim.sd1 .oc-ray,.oc-birim.sd2 .oc-ray{background:rgba(15,42,67,.055)}' +
      '.oc-birim.sd1 .oc-ray{border-radius:0 10px 0 0}' +
      '.oc-birim.sd2 .oc-ray{border-radius:10px 0 0 0}' +

      '.oc-ar{grid-row:2;font-family:"arakom","Noto Naskh Arabic","Amiri",serif;direction:rtl;' +
        'font-size:calc(var(--ocharf,7rem) * .8);color:#0F2A43;line-height:1.35;text-align:center;' +
        'opacity:0;transform:translateY(16px);' +
        'transition:opacity .42s ease,transform .42s cubic-bezier(.34,1.3,.5,1)}' +
      '.oc-sed{grid-row:2;font-family:"arakom","Noto Naskh Arabic","Amiri",serif;direction:rtl;' +
        'font-size:calc(var(--ocharf,7rem) * .8);color:#0F2A43;line-height:1.35;text-align:center;' +
        'opacity:0;transform:scale(.9);' +
        'transition:opacity .4s ease,transform .4s cubic-bezier(.34,1.3,.5,1)}' +
      /* Şeddenin BİRİNCİ adımı: cezimli harf yerini yalnız şedde işaretine
         bırakır — henüz öbür harfe eklenmemiştir, havada durur. Sayfanın
         hareke rengini (kırmızı) alır: bu artık harf değil, işarettir.
         Punto DEĞİŞMEZ; ikinci adımda harfin üstüne aynı boyda oturacak. */
      '.oc-ar.oc-sdd{color:#B03A2E}' +
      '@keyframes ocDon{0%{transform:scale(.88)}60%{transform:scale(1.06)}100%{transform:none}}' +
      '.oc-don{animation:ocDon .34s cubic-bezier(.34,1.42,.5,1)}' +
      '.oc-tam{grid-row:2;align-self:center;justify-self:center;pointer-events:none;' +
        'font-family:"arakom","Noto Naskh Arabic","Amiri",serif;direction:rtl;' +
        'font-size:calc(var(--ocharf,7rem) * .88);color:#0F2A43;line-height:1.35;white-space:nowrap;' +
        'opacity:0;transform:scale(.92);transition:opacity .45s ease .12s,transform .45s cubic-bezier(.34,1.3,.5,1) .12s}' +
      '.s2 .oc-tam,.s3 .oc-tam{opacity:1;transform:none}' +

      /* Latin klonu: Arapça kelimenin altında, Türkçe yazılış gibi */
      '.oc-klon{opacity:0;transition:opacity .3s;margin-top:clamp(0px,.4vw,6px);line-height:1.15}' +
      '.oc-klon .oc-satir{display:flex;align-items:baseline;justify-content:center;direction:ltr}' +
      '.oc-klon .oc-birim{grid-row:auto;display:inline-flex;align-items:baseline;padding:0}' +
      '.oc-klon .oc-ray{display:inline;padding:0;border:0}' +
      '.oc-klon .oc-yuva{position:static;display:inline}' +
      '.oc-klon .oc-bos{display:none}' +
      '.oc-klon .oc-ses,.oc-klon .oc-harf{font-size:calc(var(--ocharf,7rem) * .72)}' +
      /* klonda zemin yerine ince alt çizgi: iki harfin tek Arapça harften
         geldiği belli olsun ama satır arasına kutu girmesin */
      '.oc-klon .oc-birim.sd1 .oc-ray,.oc-klon .oc-birim.sd2 .oc-ray{background:none;' +
        'box-shadow:inset 0 -.07em 0 rgba(15,42,67,.28)}' +


      '.oc-alt{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;' +
        'border-top:1px solid rgba(120,100,60,.14);margin:clamp(6px,1vw,14px) 0 0;padding-top:12px;' +
        'min-height:clamp(52px,5vw,64px);padding-right:clamp(240px,26vw,340px)}' +
      '.oc-anlam{display:inline-flex;align-items:center;font-size:clamp(1.02rem,1.7vw,1.5rem);' +
        'color:#334155;font-weight:800;opacity:0;transition:opacity .4s}' +
      '.oc-anlam.gorun{opacity:1}' +
      '.oc-anlam i{font-style:normal;color:var(--ocr,#2563EB)}' +
      /* Kumanda tuşları sağ ALT KÖŞEDE: akıştan çıkar, sayfanın köşesine
         oturur; tahtada hep aynı yerde durduğu için el aramaz. */
      '.oc-tuslar{display:flex;gap:8px;position:absolute;right:10px;bottom:10px;z-index:3}' +
      '.oc-tus{border:0;border-radius:12px;padding:clamp(11px,1.2vw,15px) clamp(20px,2.4vw,32px);font:inherit;' +
        'font-size:clamp(.92rem,1.35vw,1.15rem);font-weight:800;cursor:pointer;' +
        'background:var(--ocr,#2563EB);color:#fff;transition:filter .16s,transform .16s}' +
      '.oc-tus:hover{filter:brightness(1.07);transform:translateY(-1px)}' +
      '.oc-tus.ikincil{background:#EEF2F7;color:#334155}' +

      '@media (max-width:860px){.oc-govde{grid-template-columns:1fr}' +
        '.oc-yardim{flex-direction:row;flex-wrap:wrap;justify-content:center;' +
          'align-items:center;gap:0 clamp(8px,2vw,18px);min-width:0;margin-top:6px}' +
        '.oc-yardim-bas{border-bottom:0;padding:0}' +
        '.oc-yy{border-bottom:0;padding:4px 2px}.oc-yy-ara{display:none}}' +
      '@media (max-width:860px){.oc-tuslar{position:static;margin-left:auto}' +
        '.oc-govde{padding-bottom:0}' +
        '.oc-alt{padding-right:0;min-height:0}}' +
      '@media (max-width:640px){.oc-tuslar{width:100%;margin-left:0}.oc-tus{flex:1}' +
        '.oc-birim{padding:34px 0 34px}}' +
      '@media (prefers-reduced-motion:reduce){.oc-harf,.oc-ses,.oc-ar,.oc-tam,.oc-klon{transition:none}}' +

      /* ---- Kendini Dene katmanı (#ak-tam) için ----
         Soru kökü (Arapça hece/kelime/işaret) ve şıklar. Katman
         alfabe_akordiyon.js'in; buradaki kurallar yalnız Okuma'nın
         kendi ögelerine dokunur. */
      '#ak-tam .oc-sor{font-family:"arakom","Noto Naskh Arabic","Amiri",serif;direction:rtl;' +
        'text-align:center;font-size:clamp(3.4rem,13vh,8.5rem);line-height:1.45;color:#0F2A43;' +
        'font-weight:400;margin:2px 0 10px;padding:.10em 0 .26em}' +
      /* Tek başına bir işaretin mürekkebi harfinkinin beşte biri kadar;
         kaşideli de olsa aynı puntoda nokta gibi kalıyor — bu yüzden
         işaret sorusunda kök iki katına yakın büyütülüyor. */
      '#ak-tam .oc-sor.oc-sor-is{font-size:clamp(6rem,24vh,15rem);padding:.06em 0 .30em}' +
      '#ak-tam .oc-sik-ar{font-family:"arakom","Noto Naskh Arabic","Amiri",serif;direction:rtl;' +
        'font-size:clamp(2rem,6.4vh,4.4rem);line-height:1.5;color:#1f2937;font-weight:400}' +
      '#ak-tam .oc-sik-lat{direction:ltr;font-weight:800;letter-spacing:.4px;' +
        'font-size:clamp(1.3rem,3.8vh,2.5rem);color:#1f2937}' +
      '#ak-tam .oc-metin-lat{direction:ltr;unicode-bidi:isolate;color:#0E6655}';
    (document.head || document.documentElement).appendChild(s);
  }

  /* ------------------------------------------------------------- kur */
  function kur(mount) {
    if (typeof mount === 'string') mount = document.getElementById(mount);
    if (!mount || mount.__ocKuruldu) return;
    mount.__ocKuruldu = 1;
    stil();

    var grup = SIRA[0], sira = 0, asama = 0, b = [], heceler = [], son = 2, bagAdimi = 0;

    mount.innerHTML =
      '<div class="oc-sar">' +
        '<div class="oc-serit"></div>' +
        '<p class="oc-not"></p>' +
        /* KÂĞIT: çalışma kâğıdının (PDF'in) ekrandaki hâli. Tepede konu bandı,
           altında öğretmenin "Yardım tablosu!"nun aynısı, sonra defter payı
           (soldaki kırmızı çizgi) ve yazı çizgisi. Cevaplar bu kâğıdın
           ÜSTÜNE yazılıyormuş gibi görünür: harfler mavi, harekeler kırmızı. */
        '<div class="oc-govde">' +
        '<div class="oc-kart">' +
          '<div class="oc-sayfa">' +
            '<div class="oc-sahne s0">' +
              '<div class="oc-cizelge"></div>' +
              '<div class="oc-klon"><div class="oc-satir"></div></div>' +
            '</div>' +
          '</div>' +
          '<div class="oc-alt">' +
            '<span class="oc-anlam"><span class="oc-emoji"></span>' +
              '<span class="oc-anlam-yazi"></span></span>' +
            '<span class="oc-tuslar">' +
              '<button type="button" class="oc-tus ikincil oc-geri">◂ Geri</button>' +
              '<button type="button" class="oc-tus oc-ileri">İleri ▸</button>' +
            '</span>' +
          '</div>' +
        '</div>' +
        /* Yardım tablosu: sağda, DİKEY, konuya göre değişir */
        '<aside class="oc-yardim"></aside>' +
        '</div>' +
      '</div>';

    var sar = mount.querySelector('.oc-sar'),
        serit = mount.querySelector('.oc-serit'),
        not = mount.querySelector('.oc-not'),
        yardim = mount.querySelector('.oc-yardim'),
        kart = mount.querySelector('.oc-kart'),
        emoji = mount.querySelector('.oc-emoji'),
        anlamYazi = mount.querySelector('.oc-anlam-yazi'),
        sahne = mount.querySelector('.oc-sahne'),
        cizelge = mount.querySelector('.oc-cizelge'),
        klon = mount.querySelector('.oc-klon'),
        klonSatir = klon.querySelector('.oc-satir'),
        anlam = mount.querySelector('.oc-anlam'),
        ileri = mount.querySelector('.oc-ileri'),
        geri = mount.querySelector('.oc-geri');

    serit.innerHTML = '<span class="oc-kaydirak" aria-hidden="true"></span>' +
      SIRA.map(function (g) {
        return '<button type="button" class="oc-hap" data-g="' + g + '">' + KELIME[g].ad + '</button>';
      }).join('');
    var kaydirak = serit.querySelector('.oc-kaydirak');

    /* Kırmızı kaydırağı seçili konunun üstüne getirir. Ölçü DÜĞMEDEN
       alınıyor: konu adları farklı uzunlukta, yüzde tutmuyor. Yazı tipi
       geç yüklenirse genişlik değişeceği için bir kez daha ölçülür. */
    function kaydiragiOynat() {
      var a = serit.querySelector('.oc-hap.aktif');
      if (!a || !kaydirak) return;
      if (!a.offsetWidth) { requestAnimationFrame(kaydiragiOynat); return; }
      kaydirak.style.width = a.offsetWidth + 'px';
      kaydirak.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    }
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(kaydiragiOynat);
    }

    serit.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('.oc-hap') : null;
      if (!t) return;
      grup = t.getAttribute('data-g'); sira = 0; kelimeCiz();
    });
    ileri.addEventListener('click', function () {
      if (asama >= son) { sira = (sira + 1) % KELIME[grup].liste.length; kelimeCiz(); }
      else adimaGec(asama + 1);
    });
    geri.addEventListener('click', function () {
      if (asama === 0) { var n = KELIME[grup].liste.length; sira = (sira - 1 + n) % n; kelimeCiz(); }
      else adimaGec(asama - 1);
    });

    /* ---------------------------------------------- harf boyutu
       Harfler OLABİLDİĞİNCE BÜYÜK (14rem'e kadar) ama hem satıra hem
       ekrana sığacak kadar: genişlik SÜTUN SAYISINA, yükseklik pencere
       boyuna göre sınırlanır. Bütün puntolar (hareke, Arapça satır,
       klon, boşluklar) bu tek değerden türer: --ocharf. */
    var ENBUYUK = 14 * 16;                       /* 14rem tavan */
    function boyutla() {
      var n = Math.max(1, b.length);
      var kap = (kart && kart.clientWidth) || mount.clientWidth || 700;
      var yh = window.innerHeight || 800;
      var yatay = (kap * 0.96) / (n * 1.22);     /* n sütun yan yana sığsın */
      var dikey = (yh - 412) / 4.05;             /* üç satır + kumanda sığsın.
                                                    Adım açıklaması ve sayaç
                                                    kaldırıldı, konu şeridi ise
                                                    iki katına çıktı */
      var px = Math.min(ENBUYUK, yatay, dikey);
      if (!(px > 24)) px = 24;
      sar.style.setProperty('--ocharf', px.toFixed(1) + 'px');
    }
    var olcZaman = 0;
    window.addEventListener('resize', function () {
      clearTimeout(olcZaman);
      olcZaman = setTimeout(function () { boyutla(); kaydiragiOynat(); }, 150);
    });

    /* ---------------------------------------------- kelimeyi kur */
    function kelimeCiz() {
      var g = KELIME[grup], k = g.liste[sira];
      b = birimler(k);
      sar.style.setProperty('--ocr', g.renk);
      boyutla();
      [].forEach.call(serit.querySelectorAll('.oc-hap'), function (h) {
        h.classList.toggle('aktif', h.getAttribute('data-g') === grup);
      });
      kaydiragiOynat();
      not.textContent = g.not;
      emoji.textContent = k.e || '';
      /* Yardım tablosu konuya göre: önce konunun kendi işaretleri, altında
         her kelimede geçen tenvin satırları. İşaretler tek başına görünmez,
         çalışma kâğıdındaki gibi bir kaşide üstünde gösterilir (ـَ ـُ …). */
      /* Tenvin satırları YALNIZ Hece konusunda durur: tenvin orada
         öğretiliyor, öbür konularda tablo sade kalsın. */
      yardim.innerHTML = '<span class="oc-yardim-bas">Yardım tablosu!</span>' +
        (g.yardim || []).map(function (y) {
          return yySatir(y);
        }).join('') +
        (grup === 'hece'
          ? '<span class="oc-yy oc-yy-ara">tenvin</span>' + TENVIN.map(yySatir).join('')
          : '');

      /* 1. satır: Latin birimleri (sessizler çizginin üstünde) */
      var latin = b.map(function (x, i) {
        return birimHtml(x, 'grid-column:' + (i + 1));
      }).join('');

      /* 2. satır: Arapça harfler. Her hücre bir HECE: bir Arapça harf +
         harekesi ve onun Latin karşılığı. Şeddeli harfin hücresi kendinden
         sonraki "Arapçası olmayan" birimleri de kapsar (iki Latin harf,
         tek Arapça harf) — sütunlar böylece hizalı kalır. */
      heceler = [];
      var hucreler = [], i, j, sp, lat;
      for (i = 0; i < b.length; i++) {
        if (!b[i].arTam) continue;
        sp = 1; j = i + 1;
        while (j < b.length && !b[j].arTam) { sp++; j++; }
        lat = '';
        for (j = i; j < i + sp; j++) lat += b[j].harf + (b[j].sesli || '');
        heceler.push({ ar: b[i].arTam, lat: lat, ilk: i, sp: sp,
                       uzatma: !!b[i].uzatma, uzunSes: b[i].uzunSes || '' });
        hucreler.push({ sut: i + 1, sp: sp, ar: b[i].arTam, sd: !!(b[i].seddeIlk || b[i].sedde),
                        sedIlk: !!b[i].seddeIlk, arSedde: b[i].arSedde || '' });
      }

      /* KELİMEDEKİ GERÇEK HARF SIRASI — şeddeli ikili burada TEK harftir.
         Her harfin kelime içindeki BAĞLI biçimi (kaşideli) hesaplanır:
         Harf Birleştirme sekmesindeki gibi, harfler birleşmeden önce
         bağlanma biçimlerini alsın diye. */
      var gercek = [], u;
      for (i = 0; i < hucreler.length; i++) {
        u = hucreler[i];
        if (u.sd && !u.sedIlk) continue;                 /* şeddenin ikinci yarısı */
        gercek.push({ hucre: i, ar: u.sedIlk ? u.arSedde : u.ar, sedIlk: u.sedIlk });
      }
      for (i = 0; i < gercek.length; i++) {
        var gb = i > 0 && baglanir(sonHarf(gercek[i - 1].ar));
        var ib = i < gercek.length - 1 && baglanir(sonHarf(gercek[i].ar));
        /* Kaşidenin yanına ZWJ konuyor: şeddeli harfte (ن + ّ + َ) işaretler
           araya girdiği için bazı yazı tipleri harfi YALIN biçimde çizip
           kaşideyi ayrı bir çizgi gibi bırakabiliyordu. ZWJ ile harf orta
           biçimini kesin alır: ـنَّـ tam ـنـ gibi bitişir. */
        gercek[i].bag = (gb ? TATVIL + ZWJ : '') + gercek[i].ar + (ib ? ZWJ + TATVIL : '');
      }

      var ar = '', sed = '', g, hd;
      for (i = 0; i < hucreler.length; i++) {
        u = hucreler[i];
        hd = '';
        for (j = 0; j < gercek.length; j++) if (gercek[j].hucre === i && !u.sedIlk) hd = gercek[j].bag;
        ar += '<span class="oc-ar"' + (u.sd ? ' data-sd="1"' : '') +
              (u.sedIlk ? ' data-sdd="' + SDD + '"' : '') +
              ' data-yalin="' + u.ar + '" data-bag="' + (hd || u.ar) + '"' +
              ' style="grid-column:' + u.sut + ' / span ' + u.sp + '">' + u.ar + '</span>';
        if (u.arSedde) {
          g = '';
          for (j = 0; j < gercek.length; j++) if (gercek[j].hucre === i) g = gercek[j].bag;
          sed += '<span class="oc-sed" data-yalin="' + u.arSedde + '" data-bag="' + (g || u.arSedde) + '"' +
                 ' style="grid-column:' + u.sut + ' / span 2">' + u.arSedde + '</span>';
        }
      }
      /* Hiçbir harf biçim değiştirmiyorsa (hepsi zaten yalın yazılıyorsa)
         bağlanma adımı gereksizdir — atlanır. */
      bagAdimi = gercek.some(function (x) { return x.bag !== x.ar; }) ? 1 : 0;

      cizelge.innerHTML = latin + ar + sed +
        '<span class="oc-tam" style="grid-column:1 / span ' + b.length + '">' + k.ar + '</span>';

      /* alt satır: aynı harflerin klonu, Türkçe dizilim */
      klonSatir.innerHTML = b.map(function (x) { return birimHtml(x, ''); }).join('');

      adimaGec(0);
    }

    /* Yardım tablosunun bir satırı: solda Latin karşılık, sağda işaret.
       İşaret ÇİFT KAŞİDE üstünde duruyor — tek başına hareke çok küçük
       kalıyor, çift kaşide taban çizgisini genişletip okunur kılıyor. */
    function yySatir(y) {
      /* Esre ve esre-tenvini kaşidenin ALTINA çizilir; mürekkebi satırın
         dibine kaçmasın diye o işaretler biraz yukarı alınır. */
      var alta = y[0].indexOf('\u0650') >= 0 || y[0].indexOf('\u064D') >= 0;
      return '<span class="oc-yy"><i>' + y[1] + '</i>' +
             '<b dir="rtl"' + (alta ? ' class="yk"' : '') + '>' +
             TATVIL + TATVIL + y[0] + '</b></span>';
    }

    function birimHtml(x, stil2) {
      var sn = 'oc-birim' + (x.seddeIlk ? ' sd1' : '') + (x.sedde ? ' sd2' : '') +
               (x.uzatma ? ' uzt' : '');
      var harf = (x.tasiyici || x.uzatma)
        ? '<span class="oc-harf oc-bos" aria-hidden="true">' + (x.sesli || x.uzunSes || 'a') + '</span>'
        : '<span class="oc-harf">' + (x.harf || '') + '</span>';
      /* Cezimli harfin Latin tarafında işaret YOKTUR: hareke almadığı
         için üstü boş kalır — cezmin anlamı da budur. Arapça satırdaki
         harfte ْ işareti zaten görünüyor. */
      var isaret = (!x.sukun && x.sesli)
        ? '<span class="oc-yuva ' + x.yer + '"><span class="oc-ses">' + x.sesli + '</span></span>'
        : '';
      return '<span class="' + sn + '"' + (stil2 ? ' style="' + stil2 + '"' : '') + '>' +
             '<span class="oc-ray">' + harf + '</span>' + isaret + '</span>';
    }

    /* ---------------------------------------------- adımlar
         0            Latin hazır, Arapça yok
         1 .. H       her basışta BİR Arapça harf (hece) açılır; o hecenin
                      Latin sütunu ve altındaki çizgi renklenir
         H+1          harfler ortada birleşir, bitişik kelime oluşur
         H+2          Latin klonu tek tek aşağı iner (Türkçe dizilim)     */
    function adimaGec(n) {
      var hucre = [].slice.call(cizelge.querySelectorAll('.oc-ar'));
      var sedH = [].slice.call(cizelge.querySelectorAll('.oc-sed'));
      var birimEl = [].slice.call(cizelge.querySelectorAll('.oc-birim'));
      var H = hucre.length;                 /* tek tek gelen Arapça harf sayısı */
      /* ŞEDDE İKİ ADIMDA olur:
           1. adım  cezimli harf yerini ŞEDDE işaretine bırakır — işaret
                    havada durur, henüz öbür harfe EKLENMEZ.
           2. adım  şedde ikinci harfin üstüne oturur: iki hücre tek
                    şeddeli harfe dönüşür. */
      var SD = sedH.length ? 2 : 0;
      var BG = bagAdimi;                    /* bağlanma biçimi adımı var mı     */
      son = H + SD + BG + 2;                /* + tam kelime + Latin klonu       */
      if (n < 0) n = 0; if (n > son) n = son;
      asama = n;
      var sddAdim = (SD === 2 && n === H + 1);   /* şeddenin birinci adımı */
      var evre = n === 0 ? 's0' : n <= H ? 's1' : n <= H + SD ? 'ss'
               : n <= H + SD + BG ? 'sb' : n === H + SD + BG + 1 ? 's2' : 's3';
      sahne.className = 'oc-sahne ' + evre;
      /* Harfler birleşmeden ÖNCE bağlanma biçimlerini alır (Harf Birleştirme
         sekmesindeki gibi): كِ تَ ا بٌ  →  كِـ ـتَـ ـا ـبٌ  →  كِتَابٌ */
      metinAyarla(sddAdim ? 'sdd' : ((n >= H + SD + BG && BG === 1) ? 'bag' : 'yalin'));

      birimEl.forEach(function (el) { el.classList.remove('vurgu'); });

      if (n <= H) {
        /* harfler tek tek açılır */
        hucre.forEach(function (c, i) {
          var acik = i < n;
          c.style.transform = acik ? 'none' : 'translateY(18px)';
          c.style.opacity = acik ? '1' : '0';
        });
        sedH.forEach(function (c) { c.style.opacity = '0'; c.style.transform = 'scale(.9)'; });
        if (n >= 1 && heceler[n - 1]) {
          var h = heceler[n - 1], t;
          for (t = h.ilk; t < h.ilk + h.sp; t++) if (birimEl[t]) birimEl[t].classList.add('vurgu');
        }
      } else if (n <= H + SD + BG) {
        /* şedde adımı ve/veya bağlanma adımı. Birinci şedde adımında ikili
           hâlâ ayrı durur (biri artık yalnız şedde işaretidir); ikinci
           adımda ikili söner, yerini şeddeli tek harf alır. */
        hucre.forEach(function (c) {
          var sd = c.getAttribute('data-sd');
          var gizli = sd && !sddAdim;
          c.style.transform = gizli ? 'scale(.9)' : 'none';
          c.style.opacity = gizli ? '0' : '1';
          if (sd && n <= H + SD) birimEl.forEach(function (el) {
            if (el.classList.contains('sd1') || el.classList.contains('sd2')) el.classList.add('vurgu');
          });
        });
        sedH.forEach(function (c) {
          c.style.opacity = sddAdim ? '0' : '1';
          c.style.transform = sddAdim ? 'scale(.9)' : 'none';
        });
      } else {
        /* Harfler DURDUKLARI YERDE söner; bitişik kelime ortada belirir.
           Yatay kaydırma yok: sağdan sola okunan bir satırda soldaki harfin
           sağa doğru süzülmesi, harf yer değiştiriyormuş gibi görünüyordu. */
        hucre.forEach(function (c) { c.style.transform = 'scale(.9)'; c.style.opacity = '0'; });
        sedH.forEach(function (c) { c.style.transform = 'scale(.9)'; c.style.opacity = '0'; });
      }

      if (n === son && H) klonUcur(); else klonuGizle();

      /* Ekranda yalnız kelimenin kendisi durur: adım açıklaması, yön uyarısı
         ve sayaç yok — tahtada sade görünsün diye. Altta yalnız kelime
         tamamlanınca okunuşu ve anlamı çıkar. */
      var k = KELIME[grup].liste[sira];
      var bitti = n > H + SD + BG;
      anlamYazi.innerHTML = bitti ? ('<i>' + okunus(b) + '</i> &nbsp;&middot;&nbsp; ' + k.tr) : '';
      anlam.classList.toggle('gorun', bitti);
      ileri.textContent = n >= son ? 'Sonraki kelime ▸' : 'İleri ▸';
    }

    /* Hücrelerin yazısını üç biçim arasında değiştirir:
         'yalin'  harf tek başına        (نْ)
         'sdd'    şeddeye dönüşmüş hâli  ( ّ )  — yalnız cezimli hücrede
         'bag'    kelime içindeki bağlı biçim (ـنَّـ) */
    function metinAyarla(kip) {
      [].forEach.call(cizelge.querySelectorAll('.oc-ar, .oc-sed'), function (c) {
        var t = (kip === 'sdd') ? c.getAttribute('data-sdd') : null;
        var sdd = t != null;
        if (t == null) t = (kip === 'bag') ? c.getAttribute('data-bag') : c.getAttribute('data-yalin');
        c.classList.toggle('oc-sdd', sdd);
        if (t == null || c.textContent === t) return;
        c.textContent = t;
        c.classList.remove('oc-don'); void c.offsetWidth; c.classList.add('oc-don');
      });
    }

    function klonuGizle() {
      klon.style.opacity = '0';
      [].forEach.call(klonSatir.querySelectorAll('.oc-harf, .oc-ses'), function (p) {
        p.style.transition = ''; p.style.transitionDelay = ''; p.style.transform = ''; p.style.opacity = '';
      });
    }

    /* Klon: üstteki harflerin durduğu yerden, TEK TEK (aralarında gecikmeyle)
       aşağı süzülür. Soldan sağa, yani Türkçe okuma sırasıyla iner. */
    function klonUcur() {
      var ustP = [].slice.call(cizelge.querySelectorAll('.oc-harf, .oc-ses'));
      var altP = [].slice.call(klonSatir.querySelectorAll('.oc-harf, .oc-ses'));
      klon.style.opacity = '1';
      if (ustP.length !== altP.length) return;
      var u = ustP.map(function (p) { return p.getBoundingClientRect(); });
      var a = altP.map(function (p) { return p.getBoundingClientRect(); });
      altP.forEach(function (p, i) {
        if (!a[i].width || !u[i].width) return;
        p.style.transition = 'none';
        p.style.opacity = '0';
        p.style.transform = 'translate(' + (u[i].left - a[i].left).toFixed(1) + 'px,' +
                            (u[i].top - a[i].top).toFixed(1) + 'px)';
      });
      void klonSatir.offsetWidth;
      var sayi = 0;
      altP.forEach(function (p, i) {
        if (!a[i].width || !u[i].width) return;
        p.style.transition = '';
        p.style.transitionDelay = (sayi * 0.22).toFixed(2) + 's';
        p.style.transform = '';
        p.style.opacity = '1';
        sayi++;
      });
    }

    /* ---------------------------------------------- klavye / sunum kumandası
       Tahtada fareye gitmeden ilerlemek için: sağ ok · boşluk · Enter ·
       PageDown ileri; sol ok · Backspace · PageUp geri. Uzaktan kumandalı
       sunum tıklayıcıları da bu tuşları gönderir. Yalnız Okuma sekmesi
       (p8) açıkken ve bir yazı alanına yazılmıyorken çalışır. */
    document.addEventListener('keydown', function (e) {
      var p8 = document.getElementById('p8');
      if (!p8 || !p8.classList.contains('active')) return;
      if (!mount.offsetParent && mount.offsetHeight === 0) return;
      var ov = document.getElementById('hd-overlay');
      if (ov && ov.style.display === 'flex') return;
      var h = e.target;
      if (h && /^(INPUT|TEXTAREA|SELECT)$/.test(h.tagName || '')) return;
      if (h && h.isContentEditable) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var k = e.key;
      if (k === 'ArrowRight' || k === ' ' || k === 'Spacebar' || k === 'PageDown' || k === 'Enter') {
        ileri.click(); e.preventDefault();
      } else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') {
        geri.click(); e.preventDefault();
      }
    });

    kelimeCiz();
  }

  /* ================================================================
     KENDİNİ DENE — Okuma konusunun soruları
     ----------------------------------------------------------------
     alfabe_akordiyon.js'teki katman bu soruları çizer; biçim
     alfabe_sinav.js'in ürettiğiyle AYNI olmak zorunda:
         { tip, bicim:'test', metin, ustlik, siklar:[{html,dogru}] }

     Dört soru tipi var ve hepsi BU SAYFANIN kendi kelimelerinden
     üretilir — çocuk gösteride ne gördüyse onu yoklar:
       1. hece    Arapça hece gösterilir, okunuşu sorulur
       2. kelime  Arapça kelime gösterilir, okunuşu sorulur
       3. işaret  hareke/tenvin/cezim/şedde gösterilir, ne yaptığı sorulur
       4. ters    okunuş verilir, hangi kelime olduğu sorulur

     ÇELDİRİCİLER RASTGELE DEĞİL: konunun kendi hatasından türetiliyor —
     uzatmayı yutmak (kitâbun→kitabun), şeddeyi teklemek (cennetetn→
     cenneten değil "ceneten"), tenvini karıştırmak (‑un/‑in), hareke
     şaşırmak. Yanlış şık da bu yüzden öğretici oluyor.
     ================================================================ */

  function rast(n) { return Math.floor(Math.random() * n); }
  function sec(a) { return a[rast(a.length)]; }
  function karistir(a) {
    var i, j, t;
    for (i = a.length - 1; i > 0; i--) { j = rast(i + 1); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function kacis(t) {
    return String(t).split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;');
  }

  /* Bütün kelimeler tek listede: {grup, k, b, oku} — bir kez kurulur. */
  var TUMU = null;
  function tumu() {
    if (TUMU) return TUMU;
    TUMU = [];
    SIRA.forEach(function (g) {
      KELIME[g].liste.forEach(function (k) {
        var b = birimler(k);
        TUMU.push({ grup: g, k: k, b: b, oku: okunus(b) });
      });
    });
    return TUMU;
  }

  /* ---- çeldirici üreticileri: doğru okunuştan YANLIŞ okunuş türetir ---- */
  var SESLI = 'aeıiouâîû';
  var KISASESLI = ['a', 'e', 'ı', 'i', 'u'];
  var TENVINSES = ['un', 'en', 'an', 'in', 'ın', 'on'];

  function sesliMi(c) { return SESLI.indexOf(c) >= 0; }

  function ykisalt(t) {                     /* uzatmayı yutmak */
    var y = t.split('â').join('a').split('î').join('i').split('û').join('u');
    return y === t ? null : y;
  }
  function yuzat(t) {                       /* olmayan uzatmayı okumak */
    var yer = [], i;
    for (i = 0; i < t.length - 2; i++) if ('aeiu'.indexOf(t.charAt(i)) >= 0) yer.push(i);
    if (!yer.length) return null;
    var p = sec(yer), c = t.charAt(p);
    var u = (c === 'i') ? 'î' : (c === 'u' ? 'û' : 'â');
    return t.slice(0, p) + u + t.slice(p + 1);
  }
  function ytekle(t) {                      /* şeddeyi teklemek */
    var i;
    for (i = 1; i < t.length; i++) {
      if (t.charAt(i) === t.charAt(i - 1) && !sesliMi(t.charAt(i))) return t.slice(0, i) + t.slice(i + 1);
    }
    return null;
  }
  function yciftle(t) {                     /* olmayan şeddeyi okumak */
    var yer = [], i, c;
    for (i = 1; i < t.length - 2; i++) {
      c = t.charAt(i);
      if (!sesliMi(c) && c !== t.charAt(i - 1) && c !== t.charAt(i + 1)) yer.push(i);
    }
    if (!yer.length) return null;
    var p = sec(yer);
    return t.slice(0, p) + t.charAt(p) + t.slice(p);
  }
  function ytenvin(t) {                     /* tenvini karıştırmak */
    var i, son = null;
    for (i = 0; i < TENVINSES.length; i++) {
      if (t.slice(-TENVINSES[i].length) === TENVINSES[i]) { son = TENVINSES[i]; break; }
    }
    if (!son) return null;
    var baska = TENVINSES.filter(function (x) { return x !== son; });
    return t.slice(0, t.length - son.length) + sec(baska);
  }
  function yhareke(t) {                     /* harekeyi şaşırmak */
    var yer = [], i;
    for (i = 0; i < t.length - 2; i++) if ('aeıiuo'.indexOf(t.charAt(i)) >= 0) yer.push(i);
    if (!yer.length) return null;
    var p = sec(yer), c = t.charAt(p);
    var baska = KISASESLI.filter(function (x) { return x !== c; });
    return t.slice(0, p) + sec(baska) + t.slice(p + 1);
  }

  /* Konuya göre ÖNCE o konunun hatası denenir. */
  var CELDIRICI = {
    hece:   [yhareke, yuzat, ytenvin, yciftle],
    uzatma: [ykisalt, yhareke, ytenvin, yuzat],
    cezim:  [yhareke, yuzat, ytenvin, yciftle],
    sedde:  [ytekle, yhareke, ytenvin, yuzat]
  };

  function celdiriciler(dogru, grup, kac) {
    var fn = (CELDIRICI[grup] || CELDIRICI.hece).concat([yhareke, ytenvin, yciftle]);
    var liste = [], gorulen = {}, i = 0, deneme = 0, y;
    gorulen[dogru] = 1;
    while (liste.length < kac && deneme++ < 160) {
      y = fn[i++ % fn.length](dogru);
      if (!y || gorulen[y]) continue;
      gorulen[y] = 1; liste.push(y);
    }
    return liste;
  }

  /* ---- şık kurma ---- */
  function latHtml(t) { return '<span class="oc-sik-lat" dir="ltr">' + kacis(t) + '</span>'; }
  function arHtml(t) { return '<span class="oc-sik-ar" dir="rtl">' + kacis(t) + '</span>'; }
  function siklar(dogru, yanlis, ciz) {
    var hepsi = [{ t: dogru, d: true }];
    yanlis.forEach(function (y) { hepsi.push({ t: y, d: false }); });
    return karistir(hepsi).map(function (x) { return { html: ciz(x.t), dogru: x.d }; });
  }
  function kok(t, sinif) {
    return '<div class="oc-sor' + (sinif ? ' ' + sinif : '') + '" dir="rtl">' + kacis(t) + '</div>';
  }

  /* ---- 1. HECE: Arapça hece → okunuşu ---- */
  function soruHece() {
    var kl = tumu(), aday = [], kac = 0, k;
    while (kac++ < 60 && !aday.length) {
      k = sec(kl);
      aday = k.b.filter(function (x) {
        return x.harf && x.sesli && !x.uzatma && !x.sukun && !x.seddeIlk && !x.sedde &&
               /^[\u0621-\u064A][\u064B-\u0652]+$/.test(x.arTam || '');
      });
    }
    if (!aday.length) return null;
    var u = sec(aday);
    /* Çeldirici: AYNI HARF, başka hareke — yoklanan tam da hareke. */
    var kalinMi = KALIN.indexOf(u.arTam.charAt(0)) >= 0;
    var sesler = kalinMi ? ['a', 'ı', 'u', 'an', 'un', 'ın'] : ['e', 'i', 'u', 'en', 'un', 'in'];
    var yanlis = karistir(sesler.filter(function (x) { return x !== u.sesli; }))
                   .slice(0, 3).map(function (x) { return u.harf + x; });
    if (yanlis.length < 3) return null;
    return { tip: 'oku-hece', bicim: 'test', metin: 'Bu hece nasıl okunur?',
             ustlik: kok(u.arTam), siklar: siklar(u.harf + u.sesli, yanlis, latHtml) };
  }

  /* ---- 2. KELİME: Arapça kelime → okunuşu ---- */
  function soruKelime() {
    var k = sec(tumu());
    var yanlis = celdiriciler(k.oku, k.grup, 3);
    if (yanlis.length < 3) return null;
    return { tip: 'oku-kelime', bicim: 'test', metin: 'Bu kelime nasıl okunur?',
             ustlik: kok(k.k.ar), siklar: siklar(k.oku, yanlis, latHtml) };
  }

  /* ---- 3. İŞARET: hareke/tenvin/cezim/şedde → ne yapar ---- */
  var ISARETLER = [
    ['\u064E', 'e, a'], ['\u0650', 'i, ı'], ['\u064F', 'u, o'], ['\u0652', 'ses yok'],
    ['\u064B', 'en, an'], ['\u064C', 'un, on'], ['\u064D', 'in, ın'], ['\u0651', 'harf iki kez']
  ];
  function soruIsaret() {
    var d = sec(ISARETLER);
    var yanlis = karistir(ISARETLER.filter(function (x) { return x[1] !== d[1]; }))
                   .slice(0, 3).map(function (x) { return x[1]; });
    /* İşaret tek başına neredeyse görünmez; yardım tablosundaki gibi
       ÇİFT KAŞİDE üstünde gösteriliyor. */
    return { tip: 'oku-isaret', bicim: 'test', metin: 'Bu işaret ne yapar?',
             ustlik: kok(TATVIL + TATVIL + d[0], 'oc-sor-is'),
             siklar: siklar(d[1], yanlis, latHtml) };
  }

  /* ---- 4. TERS: okunuş verilir, kelime seçilir ---- */
  function soruTers() {
    var kl = tumu(), k = sec(kl);
    var ayni = kl.filter(function (x) { return x.grup === k.grup && x.oku !== k.oku; });
    var kaynak = (ayni.length >= 3) ? ayni : kl.filter(function (x) { return x.oku !== k.oku; });
    var yanlis = karistir(kaynak.slice()).slice(0, 3).map(function (x) { return x.k.ar; });
    if (yanlis.length < 3) return null;
    return { tip: 'oku-ters', bicim: 'test',
             metin: '<b class="oc-metin-lat">' + kacis(k.oku) + '</b> diye okunan hangisi?',
             ustlik: '', siklar: siklar(k.k.ar, yanlis, arHtml) };
  }

  var SORUCULAR = [soruHece, soruKelime, soruIsaret, soruTers];

  /* Katmanın istediği kadar soru: dört tip sırayla dönerek gelir, aynı
     soru iki kez çıkmaz. Stil de burada basılıyor — Okuma sekmesi hiç
     açılmadan Dene'ye basılabilir. */
  function sinavHavuzu(adet) {
    stil();
    if (!(adet > 0)) adet = 8;
    var tipler = karistir(SORUCULAR.slice()), liste = [], gorulen = {}, i = 0, kac = 0, s, imza;
    while (liste.length < adet && kac++ < adet * 50) {
      s = tipler[i++ % tipler.length]();
      if (!s) continue;
      imza = s.tip + '|' + s.metin + '|' + s.ustlik;
      if (gorulen[imza]) continue;
      gorulen[imza] = 1;
      liste.push(s);
    }
    return liste;
  }

  window.KidefOkumaCevir = { kur: kur, coz: coz, birimler: birimler, okunus: okunus,
                             veri: KELIME, sinavHavuzu: sinavHavuzu };
  /* alfabe.html'deki Okuma sekmesi ilk açılışta bunu çağırır (tembel kurulum) */
  window.ocAc = function () { kur('ocSar'); };
})();
