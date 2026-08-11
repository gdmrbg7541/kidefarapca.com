/* ======================================================================
   KELİME ÇARKI (عَجَلَةُ الْكَلِمَاتِ) — vezin mantığı simülasyonu
   ----------------------------------------------------------------------
   Kitabın iki sayfası ALT ALTA durur: ÜSTTE Arapça (sağdan sola),
   ALTTA Türkçe (soldan sağa). Ekran dikey kaydırma
   OLMADAN sığar: sayfalarda açıklama/kelime etiketi YOKTUR — kelime
   zaten kocaman harflerle tekerlerin üstündedir. Başlık geri tuşuyla
   AYNI hizada en üsttedir; VEZİN bilgisi kök satırının sağındaki koyu
   mürekkep kutusundadır (kök tuşlarından farklı tasarım).
   ADIM DÜZENİ (2N+1 durumlu çark): kök seçilince İKİ tarafta da
   yalnız üç KÖK harfi durur (harekesiz). İleri ok 1. basışta yalnız
   ARAPÇA kelimeyi türetir (kök harflere HAREKELER de gelir), 2.
   basışta TÜRKÇESİ türer, 3. basışta SONRAKİ vezne geçilir (Arapça
   yeni kelimeye yuvarlanır, Türkçe köke döner)... Geri ok aynı yolu
   tersine yürür: önce Türkçe köke döner, sonra Arapça soyunur.
   Kelime değiştirme okları TEK ÇİFTTİR ve kitabın SOLUNDA, teker
   kabının DIŞINDA alt alta durur (akıllı tahtada ekranın önüne
   geçmeden dokunmak için); tek basışta iki sayfa birlikte işler.
   TEKER SAYISI KÖKE GÖRE DEĞİŞİR (kcIskelet): her kök, kendi EN UZUN
   kelimesinin gerektirdiği kadar teker açar — "ktb" ve "kml" 8, geri
   kalanı 10. Tavan 10'dur; hiçbir kelime 10 kutuyu geçmez. Kökler
   arasında TEK boşluk yeter, çünkü tek Arap harfine düşen iki Türkçe
   harf tek kutuda durur (bkz. kcTaban / trKutu). Böylece kısa
   kelimeler boş teker taşımaz, punto büyür.
   HİZA SİSTEMİ: N teker + 1 pay = N+1 SÜTUN vardır; j. sütunda ÜSTTE
   Arapça (N-j). poz, ALTTA Türkçe j. poz durur (Arapça şerit ters
   dizildiği için). İlk sütunun üstü ve son sütunun altı HİZA PAYIDIR;
   teker arası boşluk sabittir ve her şerit ortalanır. Kökler her iki
   şeritte de AYNI ÜÇ SÜTUNA düşsün diye iskelet iki kurala uyar:
   önek yuvası = sonek yuvası + 1, ve iki kök arasındaki yuva sayıları
   birbirine eşittir. Böylece kök sütunları {p, N/2, N-p} kümesi olur
   ve şerit ters çevrilince küme değişmez.
   SÜTUN ENİ DEĞİŞKENDİR (kcSutunOlc): dolu sütun harfin gerçek eni
   kadar geniş, BOŞ sütun dardır. Sütunun eni
   iki taraftaki harflerin GENİŞ OLANINDAN gelir — geniş bir Arapça kök
   harfinin altındaki Türkçe kutu kendiliğinden aynı ende olur. Boş
   sütunlardan kazanılan yer HARF PUNTOSUNA gider: akıllı tahtada
   harfler 12rem çıkar.
   Teker = yola değen yüzü ekrana bakan açık renkli ahşap/kâğıt
   SİLİNDİR; daire görünmez, harf kutusuz, doğrudan yüzeyin üstünde
   durur. Kök ve ek tekerleri AYNI boydadır; ayrım renktedir.
   KÖK tekerlerinde harfler SİYAH ve SABİT durur; oklarla çark
   döndükçe yalnız aradaki KIRMIZI ek harfler değişir ve aynı kökten
   yeni kelimeler türer (kitap → kâtip → mektep → mektup).
   Üstte yatay kayan kök şeridi vardır; bir köke tıklanınca o kök
   aşağıdaki 4-6-8. tekerlere iner.
   sarf.js'e DOKUNMAZ: kart tıklaması App'in genel yönlendirmesiyle
   ekranı gösterir (data-goto="kc-screen"), içerik burada kurulur.
   ====================================================================== */
(function () {
'use strict';

/* ---------------- VERİ: 7 kök ----------------
   Her kelimede vezin (Arap kalıbı + Türkçe okunuşu) ve kısa anlam var;
   böylece aynı kökte vezin değişince anlamın nasıl değiştiği görülür.
   Kelime sayısı kökten köke değişebilir; çark 2N+1 durumla döner.

   trKok: kökün Türkçe okunuşu. HER ZAMAN Arapça kökün gerçek
   harfleridir (ك ت ب → k · t · b); Türkçede sertleşen sesler burada
   DEĞİŞTİRİLMEZ, çünkü "k · t · p" ya da "k · t · r" diye bir kök
   yoktur. Sertleşme kelime yazılırken kendiliğinden bulunur ve o harf
   çarkta MOR renkle işaretlenir (bkz. KC_SERT). */
var KC_VERI = [
    { arKok: ['ك', 'ت', 'ب'], trKok: ['k', 't', 'b'], arGoster: 'كـ ـتـ ـب', anlam: 'yazmak',
      kelimeler: [
        { tr: 'kitap',   ar: 'كتاب',   tam: 'كِتَاب',    vezinAr: 'فِعَال',   vezinTr: 'fiâl',    anlam: 'yazılan şey' },
        { tr: 'kâtip',   ar: 'كاتب',   tam: 'كَاتِب',    vezinAr: 'فَاعِل',   vezinTr: 'fâil',    anlam: 'yazan kişi' },
        { tr: 'mektep',  ar: 'مكتب',   tam: 'مَكْتَب',   vezinAr: 'مَفْعَل',  vezinTr: 'mefʿal',  anlam: 'yazı yeri · büro, çalışma masası' },
        { tr: 'mektup',  ar: 'مكتوب',  tam: 'مَكْتُوب',  vezinAr: 'مَفْعُول', vezinTr: 'mefʿûl',  anlam: 'yazılmış şey' } ] },
    { arKok: ['ح', 'ك', 'م'], trKok: ['h', 'k', 'm'], arGoster: 'حـ ـكـ ـم', anlam: 'hükmetmek',
      kelimeler: [
        { tr: 'hüküm',   ar: 'حكم',    tam: 'حُكْم',     vezinAr: 'فُعْل',    vezinTr: 'fuʿl',    anlam: 'karar' },
        { tr: 'hâkim',   ar: 'حاكم',   tam: 'حَاكِم',    vezinAr: 'فَاعِل',   vezinTr: 'fâil',    anlam: 'hükmeden kişi' },
        { tr: 'hikmet',  ar: 'حكمة',   tam: 'حِكْمَة',   vezinAr: 'فِعْلَة',  vezinTr: 'fiʿle',   anlam: 'derin kavrayış',
          trKutu: ['h', 'i', 'k', 'm', 'et'] },
        { tr: 'mahkeme', ar: 'محكمة',  tam: 'مَحْكَمَة', vezinAr: 'مَفْعَلَة', vezinTr: 'mefʿale', anlam: 'hüküm yeri' } ] },
    { arKok: ['س', 'ل', 'م'], trKok: ['s', 'l', 'm'], arGoster: 'سـ ـلـ ـم', anlam: 'esen olmak',
      kelimeler: [
        { tr: 'selam',   ar: 'سلام',   tam: 'سَلَام',    vezinAr: 'فَعَال',   vezinTr: 'feʿâl',   anlam: 'esenlik dileği' },
        { tr: 'islam',   ar: 'إسلام',  tam: 'إِسْلَام',  vezinAr: 'إِفْعَال', vezinTr: 'ifʿâl',   anlam: 'teslim oluş' },
        { tr: 'teslim',  ar: 'تسليم',  tam: 'تَسْلِيم',  vezinAr: 'تَفْعِيل', vezinTr: 'tefʿîl',  anlam: 'emanet etme' },
        { tr: 'selamet', ar: 'سلامة',  tam: 'سَلَامَة',  vezinAr: 'فَعَالَة', vezinTr: 'feʿâle',  anlam: 'kurtuluş',
          trKutu: ['s', 'e', 'l', 'a', 'm', 'et'] } ] },
    { arKok: ['خ', 'ب', 'ر'], trKok: ['h', 'b', 'r'], arGoster: 'خـ ـبـ ـر', anlam: 'haber vermek',
      kelimeler: [
        { tr: 'haber',      ar: 'خبر',        tam: 'خَبَر',           vezinAr: 'فَعَل',          vezinTr: 'feʿal',      anlam: 'bildirilen şey' },
        { tr: 'ihbar',      ar: 'إخبار',      tam: 'إِخْبَار',        vezinAr: 'إِفْعَال',       vezinTr: 'ifʿâl',      anlam: 'haber verme' },
        { tr: 'muhbir',     ar: 'مخبر',       tam: 'مُخْبِر',         vezinAr: 'مُفْعِل',        vezinTr: 'mufʿil',     anlam: 'haber veren' },
        { tr: 'muhabir',    ar: 'مخابر',      tam: 'مُخَابِر',        vezinAr: 'مُفَاعِل',       vezinTr: 'mufâʿil',    anlam: 'haberleşen kişi' },
        /* Arapça اِسْتِخْبَارَات'ta zâid ت tektir; Türkçede yanına yardımcı
           ünlü alıp "ti" olur. Tek Arap harfi = tek kutu: ['...','ti',...] */
        { tr: 'istihbarat', ar: 'استخبارات',  tam: 'اِسْتِخْبَارَات', vezinAr: 'اِسْتِفْعَالَات', vezinTr: 'istifʿâlât', anlam: 'haber alma · bilgi toplama',
          trKutu: ['i', 's', 'ti', 'h', 'b', 'a', 'r', 'a', 't'] } ] },
    { arKok: ['ق', 'د', 'ر'], trKok: ['k', 'd', 'r'], arGoster: 'قـ ـد ر', anlam: 'ölçmek · gücü yetmek',
      kelimeler: [
        { tr: 'kader',    ar: 'قدر',    tam: 'قَدَر',      vezinAr: 'فَعَل',        vezinTr: 'feʿal',    anlam: 'ilahi ölçü · yazgı' },
        { tr: 'kadir',    ar: 'قادر',   tam: 'قَادِر',     vezinAr: 'فَاعِل',       vezinTr: 'fâil',     anlam: 'gücü yeten' },
        /* Arapçada kök ر'sından sonra TEK harf (ة) var; Türkçedeki "et"
           de tek kutuda dursun ki iki şerit alt alta hizalanabilsin. */
        { tr: 'kudret',   ar: 'قدرة',   tam: 'قُدْرَة',    vezinAr: 'فُعْلَة',      vezinTr: 'fuʿle',    anlam: 'güç · yetenek',
          trKutu: ['k', 'u', 'd', 'r', 'et'] },
        /* Kök yine k · d · r'dir; Türkçede dâl sertleşip t okunur, o
           harf çarkta mor çıkar (kök değişmez, yalnız sesi değişir). */
        { tr: 'miktar',   ar: 'مقدار',  tam: 'مِقْدَار',   vezinAr: 'مِفْعَال',     vezinTr: 'mifʿâl',   anlam: 'ölçü · nicelik' },
        { tr: 'takdir',   ar: 'تقدير',  tam: 'تَقْدِير',   vezinAr: 'تَفْعِيل',     vezinTr: 'tefʿîl',   anlam: 'değer biçme' },
        /* اِفْتِعَال / مُفْتَعِل vezninin zâid ت'si Türkçede "ti"/"te" diye
           okunur; Arapçada tek harf olduğu için tek kutuda durur. */
        { tr: 'iktidar',  ar: 'اقتدار', tam: 'اِقْتِدَار', vezinAr: 'اِفْتِعَال',   vezinTr: 'iftiʿâl',  anlam: 'güç sahibi olma',
          trKutu: ['i', 'k', 'ti', 'd', 'a', 'r'] },
        { tr: 'muktedir', ar: 'مقتدر',  tam: 'مُقْتَدِر',  vezinAr: 'مُفْتَعِل',    vezinTr: 'muftaʿil', anlam: 'gücü elinde tutan',
          trKutu: ['m', 'u', 'k', 'te', 'd', 'i', 'r'] } ] },
    { arKok: ['ح', 'ر', 'م'], trKok: ['h', 'r', 'm'], arGoster: 'حـ ـر م', anlam: 'yasak · dokunulmaz olmak',
      kelimeler: [
        { tr: 'harem',    ar: 'حرم',    tam: 'حَرَم',      vezinAr: 'فَعَل',     vezinTr: 'feʿal',    anlam: 'dokunulmaz alan' },
        { tr: 'haram',    ar: 'حرام',   tam: 'حَرَام',     vezinAr: 'فَعَال',    vezinTr: 'feʿâl',    anlam: 'yasak kılınan' },
        { tr: 'hürmet',   ar: 'حرمة',   tam: 'حُرْمَة',    vezinAr: 'فُعْلَة',   vezinTr: 'fuʿle',    anlam: 'saygı · dokunulmazlık',
          trKutu: ['h', 'ü', 'r', 'm', 'et'] },
        { tr: 'mahrem',   ar: 'محرم',   tam: 'مَحْرَم',    vezinAr: 'مَفْعَل',   vezinTr: 'mefʿal',   anlam: 'gizli · yakın akraba' },
        { tr: 'mahrum',   ar: 'محروم',  tam: 'مَحْرُوم',   vezinAr: 'مَفْعُول',  vezinTr: 'mefʿûl',   anlam: 'yoksun bırakılmış' },
        { tr: 'ihram',    ar: 'إحرام',  tam: 'إِحْرَام',   vezinAr: 'إِفْعَال',  vezinTr: 'ifʿâl',    anlam: 'hacda yasaklara girme' },
        /* ŞEDDE: مُحَرَّم'de ر tek yazılır, iki kez okunur. Kutu yine KÖK
           harfidir (r), bu yüzden mor değil siyah yanar. */
        { tr: 'muharrem', ar: 'محرم',   tam: 'مُحَرَّم',   vezinAr: 'مُفَعَّل',  vezinTr: 'mufaʿʿal', anlam: 'haram kılınmış · ay adı',
          trKutu: ['m', 'u', 'h', 'a', 'rr', 'e', 'm'] } ] },
    { arKok: ['ك', 'م', 'ل'], trKok: ['k', 'm', 'l'], arGoster: 'كـ ـمـ ـل', anlam: 'tamam olmak',
      kelimeler: [
        { tr: 'kemal',    ar: 'كمال',   tam: 'كَمَال',     vezinAr: 'فَعَال',    vezinTr: 'feʿâl',    anlam: 'olgunluk · eksiksizlik' },
        { tr: 'kamil',    ar: 'كامل',   tam: 'كَامِل',     vezinAr: 'فَاعِل',    vezinTr: 'fâil',     anlam: 'olgun · eksiksiz' },
        { tr: 'ikmal',    ar: 'إكمال',  tam: 'إِكْمَال',   vezinAr: 'إِفْعَال',  vezinTr: 'ifʿâl',    anlam: 'tamamlama' },
        { tr: 'tekmil',   ar: 'تكميل',  tam: 'تَكْمِيل',   vezinAr: 'تَفْعِيل',  vezinTr: 'tefʿîl',   anlam: 'eksiksiz bitirme' },
        /* ŞEDDE: مُكَمَّل'de م tek yazılır, iki kez okunur. */
        { tr: 'mükemmel', ar: 'مكمل',   tam: 'مُكَمَّل',   vezinAr: 'مُفَعَّل',  vezinTr: 'mufaʿʿal', anlam: 'tamamlanmış · kusursuz',
          trKutu: ['m', 'ü', 'k', 'e', 'mm', 'e', 'l'] } ] }
];

/* Arapçada kendinden SONRAKİ harfe bitişmeyen harfler (sağdan bitişir,
   sola el vermez). Teker yüzündeki bağlı biçimler bununla hesaplanır. */
var KC_BITISMEZ = 'اأإآدذرزوؤةىء';

var KC_OK_YUKARI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.6l7.4 8.5h-4.5v6.3H9.1v-6.3H4.6z"/></svg>';
var KC_OK_ASAGI  = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19.4L4.6 10.9h4.5V4.6h5.8v6.3h4.5z"/></svg>';

/* ================= GÖRÜNÜM SEÇENEĞİ: ŞIK / SADE =================
   Bazı okul tahtaları ve eski tabletler bu sayfayı zorlanarak çiziyor:
   her tekerde ahşap damar (iki katmanlı gradient), iç/dış gölge,
   harflerde kabartma, dönerken de perspektif altında kıvrılan harf
   var. Bunların hepsi doğru çalışan ama PAHALI işlerdir.

   Bu yüzden sayfanın İKİ GÖRÜNÜMÜ vardır ve ikisi de kalıcıdır:
     · ŞIK  — bugüne kadarki tasarım, hiçbir şeyi eksilmedi.
     · SADE — aynı düzen, aynı ölçüler, aynı üç renk; ama gölgeler,
              gradient damarlar, kabartmalar ve döngülü animasyonlar
              kapalı. Harfler yuvarlanmak yerine yerinde tazelenir.
   Seçim tarayıcıda saklanır (localStorage), bir daha sorulmaz.
   HİÇ SEÇİM YAPILMAMIŞSA: cihaz zayıf görünüyorsa (çekirdek ≤ 4 ya da
   bellek ≤ 4 GB) ya da kullanıcı "hareketi azalt" demişse SADE, aksi
   hâlde ŞIK açılır. Aynı karar sayfanın <head>'inde de bir kez
   verilir — ilk boyamadan ÖNCE, ki ekran zıplamasın. */
var KC_GORUNUM_ANAHTAR = 'kidefKcGorunum';

function kcSadeMi() {
    return document.documentElement.classList.contains('kc-sade');
}

function kcGorunumYaz(mod, kaydet) {
    var sade = mod === 'sade';
    document.documentElement.classList.toggle('kc-sade', sade);
    if (kaydet !== false) {
        try { localStorage.setItem(KC_GORUNUM_ANAHTAR, sade ? 'sade' : 'sik'); } catch (e) { }
    }
    var tuslar = document.querySelectorAll('.kc-gorunum .kc-gr');
    for (var i = 0; i < tuslar.length; i++) {
        var secili = (tuslar[i].dataset.mod === 'sade') === sade;
        tuslar[i].classList.toggle('secili', secili);
        tuslar[i].setAttribute('aria-pressed', secili ? 'true' : 'false');
    }
    return sade ? 'sade' : 'sik';
}

/* <head>'deki erken betikle AYNI karar. İkisi ayrı yerde durur çünkü
   biri boyamadan önce (sayfa içinde), öteki dosya yüklendikten sonra
   çalışır; mantık tek satırlık olduğu için kopya maliyeti yok. */
function kcGorunumSec() {
    var m = null;
    try { m = localStorage.getItem(KC_GORUNUM_ANAHTAR); } catch (e) { }
    if (m !== 'sade' && m !== 'sik') {
        var cek = navigator.hardwareConcurrency || 8;
        var bel = navigator.deviceMemory || 8;
        var az = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        m = (cek <= 4 || bel <= 4 || az) ? 'sade' : 'sik';
        return kcGorunumYaz(m, false);      /* otomatik karar SAKLANMAZ */
    }
    return kcGorunumYaz(m, false);
}

var KC_SIK_SVG  = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l1.9 5.1 5.1 1.9-5.1 1.9L12 16.6l-1.9-5.1L5 9.6l5.1-1.9zM18.5 15l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9zM5.2 15.4l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/></svg>';
var KC_SADE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.3 2L5 13.4h5.1L9.6 22 18 10.6h-5.1z"/></svg>';

function kcGorunumTusuHtml() {
    return '<div class="kc-gorunum" id="kcGorunum" role="group" aria-label="Görünüm seçimi">' +
        '<button type="button" class="kc-gr" data-mod="sik" aria-pressed="true"' +
        ' title="Şık görünüm: ahşap damar, gölge ve dönen harfler">' +
        KC_SIK_SVG + '<span>Şık</span></button>' +
        '<button type="button" class="kc-gr" data-mod="sade" aria-pressed="false"' +
        ' title="Sade görünüm: güçsüz cihazlarda kasmayan yalın çizim">' +
        KC_SADE_SVG + '<span>Sade</span></button></div>';
}

function kcHarfler(s) { return Array.from(s); }

/* Kelimenin TÜRKÇE kutuları. Kural olarak her harf kendi kutusunda
   durur; ama bazı kelimelerde tek Arap harfine iki Türkçe harf düşer
   (şedde, ya da zâid ت + yardımcı ünlü). O kelimelerde veri kendi
   kutulanmasını `trKutu` ile söyler. Tek yerden okunuyor ki iskelet
   ile çizim asla farklı kutulama görmesin. */
function kcTrKutular(kel) { return kel.trKutu || kcHarfler(kel.tr); }

/* ROUND X — Türkçe kelimenin İLK KUTUSU büyük harfle yazılır. Yalnız
   GÖSTERİM içindir: ölçüm, kök bulma ve sertleşme hep küçük harfli
   dizi üstünden yürür, yoksa "Kader"in K'si kök k ile eşleşmez.
   Türkçe kurallı büyütme: "islam" → "İslam", "ihbar" → "İhbar". */
function kcTrBas(h) {
    if (!h) return h;
    var ilk = h.charAt(0), b;
    try { b = ilk.toLocaleUpperCase('tr'); } catch (e) { b = ilk.toUpperCase(); }
    if (ilk === 'i' && b !== 'İ') b = 'İ';        /* eski motor sigortası */
    return b + h.slice(1);
}

/* Çift harfli kutu YALNIZ Türkçe şeritte olur ("rr", "mm", "ti", "te").
   Arapça yüzlerde bağlı biçim + hareke yüzünden metin uzunluğu da 2
   olabildiği için uzunluğa değil, iki LATİN harfi olmasına bakıyoruz. */
var KC_CIFT_RE = /^[a-zçğışöüâîû]{2}$/i;
function kcCiftMi(m) { return !!m && KC_CIFT_RE.test(m); }
/* İki harf tek kutuya sığsın diye punto bu oranla küçülür; sütun eni
   de aynı oranla ölçülür (kcEn) ki teker dizisi düzgün kalsın. */
var KC_CIFT_ORAN = 0.58;

/* ---------------- SES SERTLEŞMESİ ----------------
   Arapçadan Türkçeye geçen kelimelerde kökün YUMUŞAK harfi çoğu kez
   sert karşılığıyla okunur:  ب→p (kitap, mektep),  د→t (miktar),
   ج→ç,  غ/ج→k.  Bu bir KÖK DEĞİŞİKLİĞİ DEĞİLDİR — kök yine k·t·b,
   k·d·r'dir; yalnız o harfin sesi değişmiştir. Onun için kökü asla
   bozmayız; kelimeyi yerleştirirken sertleşmiş harfi tanır, çarkta
   MOR renkle işaretleriz (kırmızı ZÂİD harflere ayrılmıştır). */
var KC_SERT = { b: 'p', c: 'ç', d: 't', g: 'k' };

/* ---------------- ÇİFT HARFLİ KUTU ----------------
   Bir tekerde TEK Arapça harfe karşılık gelen İKİ Türkçe harf
   durabilir. İki hâli var:
     · ŞEDDE — Arapçada harf bir kez yazılır, Türkçede iki kez okunur:
       محرّم → muha[rr]em,  مكمّل → müke[mm]el.  Çift harf tek kutuda
       durur, çünkü Arapçada da tek harftir; kutu yine KÖK harfidir.
     · ZÂİD + yardımcı ünlü — Arapçadaki tek zâid ت, Türkçede yanına
       bir ünlü alır: اقتدار → ik[ti]dar,  مقتدر → muk[te]dir.  O ünlü
       Arapçada yazılmadığı için ayrı kutu hak etmez.
   Kazanç yalnız görsel değil: bu sayede kökler arasında TEK boşluk
   yetiyor ve hiçbir kökte 10'dan fazla kutu kalmıyor. */
function kcTaban(kutu) {
    return (kutu && kutu.length === 2 && kutu[0] === kutu[1]) ? kutu[0] : kutu;
}

/* Kelimenin ÜÇ KÖK HARFİNİ bulur ve çevresindeki harf sayılarını
   döndürür: { on, a1, a2, son } — kökten önce kaç harf, birinci ve
   ikinci kök arasında kaç, ikinci ve üçüncü arasında kaç, kökten sonra
   kaç. Kök harfleri sırayla bulunamazsa null döner.
   esnek=true ise sertleşmiş karşılık da kök harfi sayılır. */
function kcOlcuBul(harfler, kok, esnek) {
    var ki = [], j = 0, i, t;
    for (i = 0; i < harfler.length && j < 3; i++) {
        t = kcTaban(harfler[i]);
        if (t === kok[j] || (esnek && t === KC_SERT[kok[j]])) { ki.push(i); j++; }
    }
    if (j < 3) return null;
    /* Sertleşme ölçütü TABANA bakar: "rr" kutusu şeddedir, ses
       değişikliği değil — mor yanmamalı. */
    return { on: ki[0], a1: ki[1] - ki[0] - 1, a2: ki[2] - ki[1] - 1,
             son: harfler.length - 1 - ki[2], ki: ki,
             sert: [kcTaban(harfler[ki[0]]) !== kok[0], kcTaban(harfler[ki[1]]) !== kok[1],
                    kcTaban(harfler[ki[2]]) !== kok[2]] };
}

/* İKİ AŞAMALI ARAMA — sırası önemlidir:
   önce harfi harfine ara, bulunamazsa sertleşmeye izin ver.
   Tersi olsaydı "muktedir"de (م ق ت د ر) zâid tê, dâl sanılır ve
   kök harfi yanlış sütuna düşerdi; harfi harfine arama bunu önler. */
function kcOlcu(harfler, kok) {
    return kcOlcuBul(harfler, kok, false) || kcOlcuBul(harfler, kok, true);
}

/* Bir KÖKÜN İSKELETİ: o kökün bütün kelimelerini (hem Arapça hem
   Türkçe yazımıyla) taşıyabilecek EN DAR teker düzeni.
     ara    → iki kök harfi arasındaki yuva sayısı (İKİ ŞERİTTE DE AYNI)
     on/son → Türkçe şeritte kökten önceki / sonraki yuva sayısı
     arOn/arSon → Arapça şeritte kökten önceki / sonraki yuva sayısı
     kokPoz → Türkçe kök tekerlerinin sırası (0 tabanlı)
     arPoz  → Arapça kök tekerlerinin sırası (0 tabanlı)
     n      → toplam teker (iki şeritte de aynı; sütunlar hizalansın)

   ROUND V — ŞERİT BAŞINA ÖLÇÜ:
   Eskiden tek bir "on" vardı ve simetri uğruna on = son + 1 diye
   şişiriliyordu; böylece Arapça şeridin kök harfinden önce boşuna 3 boş
   kutu duruyordu (KDR, HRM). Artık her şerit KENDİ gerçek en küçük
   ölçüsünü alır: KDR/HRM'de Arapça 1, Türkçe 2 boş kutu; KML/KTB'de
   Arapça 1, Türkçe 2. Toplam teker sayısı yine ortaktır — kısa kalan
   şeridin ARTAN yuvası kelimenin SONUNA (yani ekranın dış kenarına)
   eklenir, kök harfleri öne kaymasın diye.

   HİZA KURALI (ROUND X): iki şerit N+1 sütunluk ORTAK bir ızgaraya
   oturur — Türkçe teker k → sütun k, Arapça teker k → sütun N-k
   (bkz. kcSutunOlc; Arapçanın payı ilk, Türkçenin payı son sütundur).
   Üç kök sütununun da çakışması için tek şart vardır:
       trOn + arOn = yan + 1,  yani  arOn = trSon + 1  ve  trOn = arSon + 1.
   Eskiden ön paylar serbest bırakılıyordu; KDR, HRM, HKM ve SLM'de
   kök sütunları bir adım kayıyordu (öğretmenin bildirdiği kusur).
   Artık her şeridin ön payı KARŞI şeridin son payına göre belirlenir;
   formül kendi içinde tutarlıdır, çünkü
       trOn + trSon = (arSon+1) + (arOn-1) = arOn + arSon.
   KDR/HRM/HKM/SLM'de ة'li kelimeler tek kutuya alındığı için toplam
   teker 9'dan 8'e düştü: hem hiza tam, hem harfler daha büyük. */
function kcIskelet(kok) {
    if (kok._isk) return kok._isk;
    var trOn = 0, trSon = 0, arOn = 0, arSon = 0, araG = 0;
    kok.kelimeler.forEach(function (kel) {
        var trH = kcTrKutular(kel);
        var seg = kcArParcala(kel.tam);
        var arH = seg.map(function (s) { return s.b; });
        if (arH.join('') !== kel.ar) arH = kcHarfler(kel.ar);
        var to = kcOlcu(trH, kel.trKok || kok.trKok);
        var ao = kcOlcu(arH, kok.arKok);
        if (to) {
            trOn = Math.max(trOn, to.on); trSon = Math.max(trSon, to.son);
            araG = Math.max(araG, to.a1, to.a2);
        }
        if (ao) {
            arOn = Math.max(arOn, ao.on); arSon = Math.max(arSon, ao.son);
            araG = Math.max(araG, ao.a1, ao.a2);
        }
    });
    /* İki şerit aynı sayıda teker taşır VE kök sütunları çakışır. */
    var trOnEn = trOn, trSonEn = trSon, arOnEn = arOn, arSonEn = arSon;
    arOn = Math.max(arOnEn, trSonEn + 1); trSon = arOn - 1;
    trOn = Math.max(trOnEn, arSonEn + 1); arSon = trOn - 1;
    var yan = trOn + trSon;
    var ara = araG, adim = ara + 1, n = yan + 3 + 2 * ara;
    var poz = function (on) { return [on, on + adim, on + 2 * adim]; };
    kok._isk = { n: n, ara: ara,
                 on: trOn, son: trSon, kokPoz: poz(trOn),
                 arOn: arOn, arSon: arSon, arPoz: poz(arOn) };
    return kok._isk;
}

/* Kelimenin harflerini iskeletin tekerlerine yerleştirir: kök harfler
   kokPoz'a, kökten öncekiler sağa yaslı, aralar ortalanmadan soldan,
   kökten sonrakiler sırayla. Dönen dizi: teker → harf sırası (yoksa
   -1). Sığmayan kelime null döner (veri hatasına karşı sigorta). */
function kcYerles(harfler, kok, isk, arapca) {
    var o = kcOlcu(harfler, kok);
    if (!o) return null;
    if (!isk) isk = { on: 3, ara: 1, son: 2, kokPoz: [3, 5, 7],
                      arOn: 3, arSon: 2, arPoz: [3, 5, 7], n: 10 };
    /* ROUND V: iki şeridin ölçüsü ayrıdır; hangisini yerleştirdiğimizi
       "arapca" bayrağı söyler. Eski üç argümanlı çağrılar (sınama
       betikleri) Türkçe ölçüsünü alır — davranış değişmez. */
    var on = arapca && isk.arOn != null ? isk.arOn : isk.on;
    var son = arapca && isk.arSon != null ? isk.arSon : isk.son;
    var P = arapca && isk.arPoz ? isk.arPoz : isk.kokPoz;
    if (o.on > on || o.a1 > isk.ara || o.a2 > isk.ara || o.son > son) return null;
    var d = [], i;
    for (i = 0; i < isk.n; i++) d.push(-1);
    for (i = 0; i < o.on; i++) d[P[0] - o.on + i] = i;
    d[P[0]] = o.ki[0];
    for (i = 0; i < o.a1; i++) d[P[0] + 1 + i] = o.ki[0] + 1 + i;
    d[P[1]] = o.ki[1];
    for (i = 0; i < o.a2; i++) d[P[1] + 1 + i] = o.ki[1] + 1 + i;
    d[P[2]] = o.ki[2];
    for (i = 0; i < o.son; i++) d[P[2] + 1 + i] = o.ki[2] + 1 + i;
    return d;
}

/* Harekeli yazımı (tam) parçalara ayırır: her parça = taban harf +
   üstündeki hareke(ler). Tekere binen yüz böylece hem bağlı biçimini
   hem harekesini taşır (كِتَاب → كِـ ـتَـ ـا ب). */
var KC_HAREKE = /[\u064B-\u065F\u0670]/;   /* fetha…sukun, sedde, tenvin, hancer elif */
function kcArParcala(tam) {
    var seg = [], h = kcHarfler(tam), i;
    for (i = 0; i < h.length; i++) {
        if (KC_HAREKE.test(h[i]) && seg.length) seg[seg.length - 1].m += h[i];
        else seg.push({ b: h[i], m: '' });
    }
    return seg;
}

/* Parçaların kelime içindeki BAĞLI biçimi: komşu taban bitişiyorsa
   uygun yönlere kaşide (ـ) eklenir; hareke tabanın hemen ardından
   gelir. Ayrı tekerlerde dursalar da harfler gerçek şekilleriyle
   (ve varsa harekeleriyle) görünür. */
function kcArBicimli(seg) {
    return seg.map(function (s, i) {
        var oncekiBaglar = i > 0 && KC_BITISMEZ.indexOf(seg[i - 1].b) === -1;
        var kendiBaglar = i < seg.length - 1 && KC_BITISMEZ.indexOf(s.b) === -1;
        return (oncekiBaglar ? 'ـ' : '') + s.b + s.m + (kendiBaglar ? 'ـ' : '');
    });
}
function kcArBicim(harfler) {              /* harekesiz kısayol */
    return kcArBicimli(harfler.map(function (h) { return { b: h, m: '' }; }));
}

/* adim: HER KELİME DÖRT EVRELİDİR ve her yeni kelime yine KÖKTEN başlar.
     evre 0 → iki tarafta yalnız çıplak kök (harekesiz)
     evre 1 → Arapça kelime türedi (harekeli)
     evre 2 → Türkçesi de türedi
     evre 3 → harfler kaynaşıp kelime tek parça okundu
   Beşinci basış sıradaki kelimenin 0. evresidir: öğrenci her kelimeye
   aynı yerden, kökten girer. Toplam 4N durum, çark gibi döner.
   i = adim/4 (kelime sırası), f = adim%4 (evre). */
/* birlesik: kelimenin hem Arapçası hem Türkçesi ekrana geldikten sonra
   açılan SÖZ KARESİ. Tekerler usulca söner ve yerlerinde, her sayfanın
   ortasında YUVARLAK bir söz madalyonu belirir: kelime tek parça,
   doğal bağlı yazımıyla okunur. bTok, geciken birleştirme
   zamanlayıcısının biletidir: kullanıcı birleşme olgunlaşmadan tuşa
   basarsa bilet değişir, eski zamanlayıcı artık geçersiz duruma
   dokunamaz.
   hazir: kelime tamamlandı, artık BİRLEŞTİRİLEBİLİR. Birleşme
   kendiliğinden olmaz; kitaba dokunmak (ya da boşluk/Enter) gerekir —
   "şimdi bakın, kelime bütünleşiyor" ânı öğretmenin elinde kalsın. */
var S = { kok: 0, adim: 0, kilit: false, kurulu: false, son: null, bekleyen: 0,
          birlesik: false, bTok: 0, hazir: false };

/* Kelime birleşince madalyonun yanında beliren balon. Emoji kelimeye
   göre değişir ki her vezin ayrı bir sürpriz gibi dursun. */
var KC_BALON = ['🎈', '✨', '🌟', '🎉', '🪄', '💫', '🎊', '🌈', '📚', '🍯'];

function kcSes() { try { App.playSound('click'); } catch (e) { } }

/* ---------------- SÜTUN ÖLÇÜSÜ (değişken teker eni) ----------------
   Amaç: harfler AKILLI TAHTADA 12rem çıksın. Bunun için kutular harfi
   kısıtlamaz, harf kutuyu belirler:
     · DOLU sütun = harfin gerçek eni + iki yana nefes payı,
     · BOŞ sütun  = dar bir yedek rulo (yer kaplamasın, punto büyüsün).

   HİZA HARİTASI: Arapça şerit ters (row-reverse) dizildiği için, soldan
   sağa 11 sütunda j. sütun ALTTA Türkçe j. pozu, ÜSTTE Arapça (12-j).
   pozu taşır. Kökler her iki şeritte de 4, 6 ve 8. pozdadır; yani kök
   sütunları 4, 6 ve 8'dir ve hepsi 4-8 aralığına düşer.

   ÜÇ BLOK KURALI (kullanıcı isteği):
     · ORTA KUŞAK (4-8. sütunlar): kökleri ve aralarını taşır. Burada
       kutu eni İKİ ŞERİTTEKİ harflerin genişine göre seçilir; Arapça
       kök harfi genişse altındaki Türkçe kutu da aynı ende olur.
     · SOL blok (1-3) ve SAĞ blok (9-11): her şerit KENDİ harfine göre
       ölçülür. Arapça'da geniş bir harf varken (ör. مَكْتَب'in mîm'i)
       altında Türkçe harf yoksa, Türkçe kutu boşuna genişlemez; dar
       kalır ve kazanılan yer puntoya gider.
       Kökler yine de hizada kalsın diye yalnızca blokların TOPLAM eni
       eşitlenir; artan boşluk bloğun EN DIŞTAKİ gözüne verilir (bir
       şeritte bu göz zaten görünmez "pay", diğerinde soluk boş rulo).
   SIĞDIRMA SIRASI: önce boş sütunlar daraltılır (KC_DAR → KC_DAR_ALT),
   yine sığmazsa punto küçülür. Yani punto en son feda edilir. */
var KC_YAN     = 0.14;   /* harfin iki yanındaki nefes payı (punto oranı) */
var KC_DAR     = 0.46;   /* boş sütunun hedef eni (punto oranı) */
var KC_DAR_ALT = 0.24;   /* sığmazsa boş sütun buraya kadar daralabilir */
var KC_BOY     = 1.40;   /* teker boyu (punto oranı) — tüm tekerlerde aynı */
var kcEnBellek = {};

function kcKalip() { return document.getElementById('kcOlcu'); }

/* metnin, punto=1 biriminde ölçülmüş eni (0 = boş) */
function kcEn(metin) {
    if (!metin) return 0;
    if (kcEnBellek[metin] != null) return kcEnBellek[metin];
    var pr = kcKalip();
    if (!pr) return 0.5;
    pr.textContent = metin;
    var f = parseFloat(getComputedStyle(pr).fontSize) || 1;
    var w = pr.getBoundingClientRect().width / f;
    pr.textContent = '';
    if (!(w > 0)) w = 0.5;
    /* Çift harfli kutu ekranda küçültülerek yazılır (bkz. KC_CIFT_ORAN);
       eni de aynı oranda ölçülmeli, yoksa o sütun boşuna şişer. */
    if (kcCiftMi(metin)) w *= KC_CIFT_ORAN;
    kcEnBellek[metin] = w;
    return w;
}

/* Verilen "boş göz eni" (dar) için iki şeridin bütün gözlerini
   hesaplar. Dönüş: { t: [n+1], a: [n+1], toplam } — punto=1 birimiyle.
     t[j] → Türkçe şeritte j. sütun (son sütun görünmez paydır)
     a[j] → Arapça şeritte j. sütun (ilk sütun görünmez paydır)

   ROUND V: kök sütunları artık iki şeritte aynı yerde olmayabilir.
   Türkçe kökler kokPoz sütunlarında, Arapça şerit ters dizildiği için
   Arapça kökler (n - arPoz) sütunlarındadır. Genişlik eşitlemesi bu iki
   kuşağın ÇAKIŞAN bölümünde göz göze yapılır (kök harfi geniş yazılmışsa
   alt/üst kutusu da genişler); dışarıda kalan sol ve sağ bloklarda
   yalnız blok TOPLAMI eşitlenir, artan pay dış kenardaki göze yazılır.
   Böylece iki şerit aynı toplam eni tutar ama boş kutular boşuna
   şişmez. Çakışma hiç yoksa (veri değişirse) tek blok gibi davranılır. */
function kcOlcHesap(nT, nA, dar, isk) {
    var S1 = isk.n + 1, N = isk.n;
    var t = [], a = [], j, h;
    for (j = 0; j < S1; j++) {
        t.push(nT[j] > 0 ? nT[j] + 2 * KC_YAN : dar);
        a.push(nA[j] > 0 ? nA[j] + 2 * KC_YAN : dar);
    }
    /* blok: [b..s] arasında yalnız toplamı eşitle; fark "kenar" gözüne. */
    function blok(b, s, kenar) {
        if (s < b) return;
        var i, tt = 0, at = 0;
        for (i = b; i <= s; i++) { tt += t[i]; at += a[i]; }
        var h = Math.max(tt, at);
        t[kenar] += h - tt; a[kenar] += h - at;
    }
    var aP = isk.arPoz || isk.kokPoz;
    var tS = isk.kokPoz[0], tE = isk.kokPoz[2];
    var aS = N - aP[2], aE = N - aP[0];
    var L = Math.max(tS, aS), R = Math.min(tE, aE);
    if (L <= R) {
        for (j = L; j <= R; j++) { h = Math.max(t[j], a[j]); t[j] = a[j] = h; }
        blok(0, L - 1, 0);
        blok(R + 1, S1 - 1, S1 - 1);
    } else {
        blok(0, S1 - 1, 0);
    }
    var toplam = 0;
    for (j = 0; j < S1; j++) toplam += t[j];
    return { t: t, a: a, toplam: toplam };
}

function kcSutunOlc(arHedef, trHedef, isk) {
    var kitap = document.querySelector('.kc-kitap');
    var arS = document.getElementById('kcArTeker');
    var trS = document.getElementById('kcTrTeker');
    var pr = kcKalip();
    if (!kitap || !arS || !trS || !pr) return;
    if (!isk) isk = kcIskelet(KC_VERI[S.kok]);
    var N = isk.n;
    var F = parseFloat(getComputedStyle(pr).fontSize) || 0;
    var g = parseFloat(getComputedStyle(trS).columnGap) || 0;
    var alan = trS.clientWidth - 4 - N * g;       /* N+1 sütuna kalan net en */
    if (!(F > 0) || !(alan > 0)) return;

    /* İki ayrı ihtiyaç dizisi: artık şeritler birbirini şişirmiyor.
       Türkçe: sütun j → trHedef[j]; son sütun paydır (0).
       Arapça: sütun j → arHedef[N-j]; ilk sütun paydır (0). */
    var nT = [], nA = [], j;
    for (j = 0; j <= N; j++) {
        nT.push(j <= N - 1 ? kcEn(trHedef[j] || '') : 0);
        nA.push(j >= 1 ? kcEn(arHedef[N - j] || '') : 0);
    }

    var punto = F, dar = KC_DAR, o = kcOlcHesap(nT, nA, KC_DAR, isk);
    if (o.toplam * F > alan) {                    /* sığmıyor: önce boşları daralt */
        if (kcOlcHesap(nT, nA, KC_DAR_ALT, isk).toplam * F > alan) {
            dar = KC_DAR_ALT;                     /* yetmedi: punto küçülsün */
            o = kcOlcHesap(nT, nA, dar, isk);
            punto = alan / o.toplam;
        } else {                                  /* aradaki en geniş "dar"ı bul */
            var lo = KC_DAR_ALT, hi = KC_DAR, i, m;
            for (i = 0; i < 24; i++) {
                m = (lo + hi) / 2;
                if (kcOlcHesap(nT, nA, m, isk).toplam * F <= alan) lo = m; else hi = m;
            }
            dar = lo;
            o = kcOlcHesap(nT, nA, dar, isk);
        }
    }
    if (!(punto > 0)) return;

    /* NOT: Söz karesinde (kelime birleşince) sütunlara HİÇ dokunulmaz.
       Eskiden boş gözlerin eni sıfırlanıp harfler birbirine itiliyordu;
       ortaya köşeli, kutulu bir şerit çıkıyordu. Artık tekerler olduğu
       gibi durup söner, kelime ayrı bir YUVARLAK madalyonda belirir —
       hem çark tasarımına yakışır hem de kaşideye (ـ) gerek kalmaz. */
    var boy = KC_BOY * punto;
    kitap.style.setProperty('--kc-punto', punto.toFixed(2) + 'px');
    kitap.style.setProperty('--kc-cift', String(KC_CIFT_ORAN));   /* CSS ile JS aynı oranı kullansın */
    /* pay = Arapça şeritte ilk sütun, Türkçe şeritte son sütun */
    arS.style.setProperty('--kc-pay', (o.a[0] * punto).toFixed(2) + 'px');
    trS.style.setProperty('--kc-pay', (o.t[N] * punto).toFixed(2) + 'px');
    var a = arS.children, t = trS.children, k;
    for (k = 0; k < N && k < t.length && k < a.length; k++) {
        t[k].style.width = (o.t[k] * punto).toFixed(2) + 'px';       /* Türkçe poz k → sütun k */
        t[k].style.height = boy.toFixed(2) + 'px';
        a[k].style.width = (o.a[N - k] * punto).toFixed(2) + 'px';   /* Arapça poz k → sütun N-k */
        a[k].style.height = boy.toFixed(2) + 'px';
    }
}

/* Ekran döndüğünde / yazı tipi geç yüklendiğinde son duruma göre tazele */
function kcOlcTazele() {
    if (!S.son) return;
    kcSutunOlc(S.son.ar, S.son.tr, S.son.isk);
    kcSozSigdir();
    /* Ekran döndüyse kaynaşmış harflerin hedefi de kaymıştır */
    if (S.birlesik) kcKaynastir();
}
var kcOlcZaman = null;
window.addEventListener('resize', function () {
    clearTimeout(kcOlcZaman);
    kcOlcZaman = setTimeout(kcOlcTazele, 160);
});
try {
    if (document.fonts && document.fonts.ready)
        document.fonts.ready.then(function () { kcEnBellek = {}; kcOlcTazele(); });
} catch (e) { }

/* ---------------- EKRAN KURULUMU ----------------
   Teker şeridinin HTML'i iskeletten üretilir; kök değişip iskelet
   değişince şerit yeniden kurulur (kcTekerKur). Kök tekerleri
   iskeletin kokPoz'undadır, gerisi "ek" tekeridir. */
function kcTekerHtml(isk, arapca) {
    var s = '', p;
    var P = arapca && isk.arPoz ? isk.arPoz : isk.kokPoz;
    for (p = 0; p < isk.n; p++) {
        var kokMu = P.indexOf(p) >= 0;
        s += '<div class="kc-teker ' + (kokMu ? 'kok' : 'ek') +
             (p === isk.n - 1 ? ' kc-son' : '') + ' kc-bos" data-poz="' + (p + 1) + '">' +
             '<div class="kc-yuz"><span class="kc-harf" data-h=""></span></div></div>';
    }
    return s;
}

/* İskelet değiştiyse iki şeridi de yeniden kurar. Değişmediyse hiç
   dokunmaz — aynı kök içinde çark dönerken tekerler yerinde kalsın,
   yalnız harfler yuvarlansın. true dönerse şerit sıfırlanmıştır. */
var kcSonIsk = null;
function kcTekerKur(isk) {
    var arS = document.getElementById('kcArTeker');
    var trS = document.getElementById('kcTrTeker');
    if (!arS || !trS) return false;
    if (kcSonIsk === isk && arS.children.length === isk.n) return false;
    kcSonIsk = isk;
    /* ROUND V: iki şeridin kök sütunları farklı olabilir, tek HTML
       yetmez — her şerit kendi iskelet ölçüsüyle kurulur. */
    arS.innerHTML = kcTekerHtml(isk, true);
    trS.innerHTML = kcTekerHtml(isk, false);
    return true;
}

function kcKur() {
    if (S.kurulu) return;
    var ekran = document.getElementById('kc-screen');
    if (!ekran) return;
    /* Kök tuşu: yalnız Arapça kök + Türkçe harf karşılığı. Anlam yazmayız;
       anlamı öğrenci tekerler dönerken oluşan kelimelerden çıkarır. */
    var kokTus = KC_VERI.map(function (k, i) {
        return '<button type="button" class="kc-kok" data-i="' + i + '">' +
            '<span class="kc-kok-ar">' + k.arGoster + '</span>' +
            '<span class="kc-kok-tr">' + k.trKok.join(' · ').toUpperCase() + '</span></button>';
    }).join('');
    kcSonIsk = kcIskelet(KC_VERI[S.kok || 0]);
    var arTekerler = kcTekerHtml(kcSonIsk, true);
    var trTekerler = kcTekerHtml(kcSonIsk, false);
    /* Başlık AKIŞ DIŞINDA, geri tuşuyla aynı üst hizada durur. Kök
       satırı: solda kayan kök tuşları + sağda KOYU MÜREKKEP tasarımlı
       vezin kutusu. Gövde: SOLDA tek ok çifti (teker kabının dışında),
       sağda kitap. Kelime etiketi yok — kelime tekerlerde kocamandır. */
    ekran.innerHTML =
        '<div class="back-btn" id="kc-back">' + BACK_SVG + '</div>' +
        /* Görünüm anahtarı geri tuşunun tam karşısında (sağ üst) durur;
           kök satırının yerleşimine hiç karışmaz. */
        kcGorunumTusuHtml() +
        '<div class="kc-baslik"><span class="kc-baslik-ar">عَجَلَةُ الْكَلِمَاتِ</span>' +
        '<span class="kc-baslik-tr">Kelime Çarkı</span></div>' +
        '<div class="kc-kap">' +
        '  <div class="kc-ustsatir">' +
        '    <div class="kc-kokler" id="kcKokler">' + kokTus + '</div>' +
        /* Vezin kutusu artık BİR TUŞ: dokununca en çok kullanılan
           vezinlerin tablosu (ism-i fâil, mefʿûl, mekân, âlet, tasgîr,
           tafdîl, çoğul, ifʿâl, tefʿîl) animasyonlu olarak açılır. */
        '    <button type="button" class="kc-vezinkutu kc-vk-bos" id="kcVezinKutu"' +
        '            title="Vezinler tablosunu aç" aria-label="Vezinler tablosunu aç" aria-haspopup="dialog">' +
        '      <b id="kcVzAr"></b><i id="kcVzTr"></i>' +
        '      <span class="kc-vk-ipucu" aria-hidden="true">vezinler ⤢</span></button>' +
        '  </div>' +
        '  <div class="kc-govde">' +
        '    <div class="kc-oklar">' +
        '      <button type="button" class="kc-ok" data-yon="-1" title="Önceki kelime (geri)" aria-label="Önceki kelime">' + KC_OK_YUKARI + '</button>' +
        '      <button type="button" class="kc-ok" data-yon="1" title="Sonraki kelime (ileri)" aria-label="Sonraki kelime">' + KC_OK_ASAGI + '</button>' +
        '    </div>' +
        '    <div class="kc-kitap">' +
        '      <span class="kc-olcu" id="kcOlcu" aria-hidden="true"></span>' +
        '      <div class="kc-sayfalar">' +
        /* SÖZ MADALYONU: kelime tamamlanınca tekerler söner ve her
           sayfanın ortasında yuvarlak bir madalyon belirir; kelime
           orada TEK PARÇA, doğal bağlı yazımıyla (kaşidesiz) durur.
           Türkçe madalyonun yanına anlamı taşıyan balon gelir. */
        '        <section class="kc-sayfa kc-arapca">' +
        '          <div class="kc-yol"><div class="kc-tekerler kc-rtl" id="kcArTeker">' + arTekerler + '</div>' +
        '          <div class="kc-soz kc-rtl" id="kcArSoz" aria-hidden="true"><span class="kc-soz-sar">' +
        '            <span class="kc-soz-olcek"><span class="kc-soz-ic"></span></span></span></div>' +
        '          <div class="kc-zemin"></div></div>' +
        '        </section>' +
        '        <section class="kc-sayfa kc-turkce">' +
        '          <div class="kc-yol"><div class="kc-tekerler" id="kcTrTeker">' + trTekerler + '</div>' +
        '          <div class="kc-soz" id="kcTrSoz" aria-hidden="true"><span class="kc-soz-sar">' +
        '            <span class="kc-soz-olcek"><span class="kc-soz-ic"></span>' +
        '            <span class="kc-balon" id="kcBalon"><b id="kcBalonEmoji">🎈</b><i id="kcBalonYazi"></i></span>' +
        '            </span></span></div>' +
        '          <div class="kc-zemin"></div></div>' +
        '        </section>' +
        '      </div>' +
        /* NOT: Eskiden burada "dokun · kelimeyi birleştir / harflere dön"
           yazan bir ipucu hapı dururdu. Kaynaşma artık çarkın olağan
           dördüncü evresi olduğu ve HER kelimede kendiliğinden sıraya
           geldiği için o uyarı gereksizdi; kaldırıldı. Kitaba dokunma
           kısayolu yerinde duruyor, yalnızca yazısı yok. */
        '    </div>' +
        '  </div>' +
        '</div>';
    document.getElementById('kc-back').addEventListener('click', function () {
        kcSes();
        App.showScreen('start-screen');
    });
    var oklar = ekran.querySelectorAll('.kc-ok');
    for (var o = 0; o < oklar.length; o++) {
        oklar[o].addEventListener('click', function () { kcDondur(parseInt(this.dataset.yon, 10)); });
    }
    document.getElementById('kcKokler').addEventListener('click', function (e) {
        var t = e.target.closest('.kc-kok');
        if (t) kcKokSec(parseInt(t.dataset.i, 10));
    });
    document.getElementById('kcVezinKutu').addEventListener('click', kcVezinPopAc);
    /* Görünüm anahtarı: iki tuş, tek seçim. Seçim anında uygulanır ve
       tarayıcıda saklanır; sayfa bir daha açıldığında aynı görünüm gelir. */
    var grKap = document.getElementById('kcGorunum');
    if (grKap) grKap.addEventListener('click', function (e) {
        var t = e.target.closest('.kc-gr');
        if (!t) return;
        kcSes();
        kcGorunumYaz(t.dataset.mod, true);
        /* Sade'ye geçince kutu ölçüleri değişmez ama gölge/damar
           kalktığı için yeniden ölçmek zararsızdır; şerit tazelensin. */
        try { kcSozSigdir(); } catch (e2) { }
    });
    kcGorunumSec();
    /* Kitabın her yeri birleştirme düğmesidir: akıllı tahtada öğretmen
       küçük bir hedefi aramasın, kelimenin kendisine dokunsun yeter. */
    var kitapTus = ekran.querySelector('.kc-kitap');
    if (kitapTus) kitapTus.addEventListener('click', kcSozDegis);
    S.kurulu = true;
}

/* ---------------- TEKER DÖNÜŞÜ ----------------
   Harf silindirin yüzeyine YAPIŞIKTIR: teker dönerken harf de yüzeyle
   birlikte kıvrılır — çıkan harf üst kenara sarılıp arkaya yatar
   (translateY + rotateX), yeni harf alt kenardan yatık gelip düzleşir.
   Aynı anda yüzey damarı da (CSS ::before) aynı yönde akar. Kök
   tekerlerinde harf DÖNMEZ; yalnız bağlı biçim değişirse yumuşak
   geçişle tazelenir. */
/* Devir bittikten sonra harfin üstündeki satır-içi biçimler silinir.
   Silinmezse satır-içi opacity, kaynaşma kuralını (.kc-birlesik .kc-harf)
   ezer ve teker harfleri birleşen kelimenin üstünde asılı kalır. */
function kcHarfSerbest(harfEl, gec) {
    setTimeout(function () {
        harfEl.style.transition = '';
        harfEl.style.transform = '';
        harfEl.style.opacity = '';
    }, gec);
}

function kcTekerYaz(el, yeni, yon, gecikme, yuvarlan, sert) {
    var harfEl = el.querySelector('.kc-harf');
    var eski = harfEl.dataset.h || '';
    yeni = yeni || '';
    sert = !!sert;
    /* Harf değişmese de sertleşme işareti tazelenmeli (kitap → kâtip:
       ikisinde de p vardır, ikisinde de mor kalmalı). */
    if (eski === yeni) { el.classList.toggle('kc-sert', sert); return false; }
    var koy = function () {
        harfEl.textContent = yeni;
        harfEl.dataset.h = yeni;
        harfEl.classList.toggle('kc-cift', kcCiftMi(yeni));
        el.classList.toggle('kc-bos', !yeni);
        el.classList.toggle('kc-sert', sert);   /* renk harfle aynı karede değişsin */
    };
    setTimeout(function () {
        /* SADE GÖRÜNÜM: harf silindirin yüzeyinde kıvrılarak dönmez.
           rotateX + perspective + akan damar üçlüsü zayıf cihazlarda
           kare düşürüyor; burada harf yalnızca yerinde tazelenir.
           Ders akışı aynıdır — kelime yine adım adım türer. */
        if (!yuvarlan || kcSadeMi()) {       /* kök: sadece biçim tazelenir */
            harfEl.style.transition = 'opacity .14s ease';
            harfEl.style.opacity = '0.25';
            setTimeout(function () { koy(); harfEl.style.opacity = '1'; kcHarfSerbest(harfEl, 220); }, 150);
            return;
        }
        el.classList.toggle('kc-ters', yon < 0);   /* damar akışı da yön değiştirsin */
        el.classList.add('kc-donuyor');
        harfEl.style.transition = 'transform .17s ease-in, opacity .17s ease-in';
        harfEl.style.transform = 'translateY(' + (yon > 0 ? -88 : 88) + '%) rotateX(' + (yon > 0 ? 76 : -76) + 'deg)';
        harfEl.style.opacity = '0';
        setTimeout(function () {
            koy();
            harfEl.style.transition = 'none';
            harfEl.style.transform = 'translateY(' + (yon > 0 ? 88 : -88) + '%) rotateX(' + (yon > 0 ? -76 : 76) + 'deg)';
            void harfEl.offsetWidth;
            harfEl.style.transition = 'transform .22s cubic-bezier(.2,.85,.35,1.12), opacity .22s ease-out';
            harfEl.style.transform = 'translateY(0) rotateX(0)';
            harfEl.style.opacity = yeni ? '1' : '0';
            setTimeout(function () { el.classList.remove('kc-donuyor'); }, 250);
            kcHarfSerbest(harfEl, 300);
        }, 180);
    }, gecikme);
    return true;
}

/* Adımın hangi tarafta hangi kelimeyi gösterdiğini çözer. Dört evreli
   model: 0 çıplak kök · 1 Arapça · 2 Arapça+Türkçe · 3 kaynaşmış. */
function kcDurumCoz() {
    var kok = KC_VERI[S.kok];
    var i = Math.floor(S.adim / 4), f = S.adim % 4;
    var kel = kok.kelimeler[i] || null;
    return { kok: kok, ar: f >= 1 ? kel : null, tr: f >= 2 ? kel : null,
             bir: f === 3, sira: i, evre: f };
}

/* Seçili adımı 20 tekere uygular. Kelime türememiş taraf yalnız kök
   harflerini gösterir (Türkçe düz, Arapça harekesiz bağlı biçim);
   Arapça kelime türeyince HAREKELİ yazım (tam) tekerlere biner —
   kök tekerlerine de harekeleri gelir. ilk=true (kök yeni seçildi)
   ise kök tekerleri de yuvarlanarak yerine oturur. */
/* SÖZ MADALYONUNU DOLDUR: her sayfanın kelimesi tek parça, doğal
   yazımıyla yazılır. Harfler ayrı <span>'lardadır ki ÜÇ RENK
   (siyah kök · kırmızı zâid · mor sertleşen) korunsun; tarayıcı
   Arapça bağlamayı span sınırları boyunca sürdürür, bu yüzden
   tekerlerdeki gibi kaşide (ـ) eklemeye GEREK YOKTUR. */
function kcSozYaz(arHtml, trHtml, emoji, anlam) {
    var a = document.getElementById('kcArSoz'), t = document.getElementById('kcTrSoz');
    if (a) a.querySelector('.kc-soz-ic').innerHTML = arHtml || '';
    if (t) t.querySelector('.kc-soz-ic').innerHTML = trHtml || '';
    var e = document.getElementById('kcBalonEmoji'), y = document.getElementById('kcBalonYazi');
    if (e) e.textContent = emoji || '🎈';
    if (y) y.textContent = anlam || '';
    var b = document.getElementById('kcBalon');
    if (b) b.style.display = anlam ? '' : 'none';
}

/* Madalyon + balon şeride sığmıyorsa hepsi birlikte küçültülür.
   Ölçek transition'sız bir katmandadır (.kc-soz-olcek), böylece
   ölçüm anında animasyonun ara değerine takılmaz. */
function kcSozSigdir() {
    var ids = ['kcArSoz', 'kcTrSoz'], i;
    for (i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]);
        if (!el) continue;
        var ol = el.querySelector('.kc-soz-olcek');
        if (!ol) continue;
        var alan = el.clientWidth - 6;
        /* offsetWidth YERLEŞİM enidir: üstündeki scale() onu değiştirmez,
           dolayısıyla ölçmeden önce ölçeği 1'e çekmeye gerek kalmaz ve
           fazladan bir yerleşim hesabı yapılmaz. */
        var w = ol.offsetWidth;
        /* Balon akıştan çıkarıldı; madalyon ortada durur, balon yalnız
           bir yana taşar. Ortalama bozulmasın diye taşan payı İKİ yana
           birden sayarız: gereken kutu = kelime + 2 × (balon + boşluk). */
        var bal = ol.querySelector('.kc-balon'), pay = 0;
        if (bal && bal.style.display !== 'none' && bal.offsetWidth) {
            pay = bal.offsetWidth + (parseFloat(getComputedStyle(bal).marginLeft) || 0);
        }
        var gerek = w + 2 * pay;
        var k = (gerek > 0 && alan > 0 && gerek > alan) ? alan / gerek : 1;
        ol.style.setProperty('--kc-soz-k', k.toFixed(3));
    }
}

/* ---------------- KAYNAŞMA (harflerin yer değiştirmesi) ----------------
   Birleşme YENİ BİR KATMANIN AÇILMASI DEĞİLDİR. Ekranda hâlihazırda
   duran harflerin kendisi yürür: her tekerdeki harf, birleşik kelimede
   kendisine düşen harfin TAM ÜSTÜNE kayar. Kutu kaplaması (ahşap zemin,
   kenarlık, gölge) bu yolculuk sırasında erir; harfler hedefe varınca
   iki katman üst üste bindiği için çapraz geçiş göze "harfler kaynaştı"
   diye görünür — hiçbir yerden bir pencere açılmaz.

   EŞLEME NEDEN BİREBİRDİR? Arapça sözde her <span class="kc-sz"> bir
   "seg" (harf + hareke) parçasıdır; Arapça tekerlere de aynı parçalar
   binmiştir. Türkçede de her span bir KUTU'dur (şeddeli "rr" gibi çift
   harfli kutular dâhil). S.son.arYer / S.son.trYer dizileri teker
   pozisyonundan harf sırasına gider; ters yönde dizilen Arapça şeridi
   ayrıca sıralamaya gerek kalmaz. */
function kcKaynastir() {
    if (!S.son) return;
    var takim = [['kcArTeker', 'kcArSoz', S.son.arYer], ['kcTrTeker', 'kcTrSoz', S.son.trYer]], q;
    for (q = 0; q < takim.length; q++) {
        var serit = document.getElementById(takim[q][0]);
        var soz = document.getElementById(takim[q][1]);
        var yer = takim[q][2];
        if (!serit || !soz || !yer) continue;
        /* visibility:hidden katman da YERLEŞİR: madalyon henüz görünmezken
           harflerinin gerçek yeri ölçülebilir. */
        var hedef = soz.querySelectorAll('.kc-sz'), i, olcum = [];
        for (i = 0; i < serit.children.length; i++) {
            var t = serit.children[i], h = t.querySelector('.kc-harf');
            var j = yer[i], hd = (j >= 0 && hedef[j]) ? hedef[j] : null;
            if (!hd || !h || !h.textContent) { olcum.push(null); continue; }
            var a = h.getBoundingClientRect(), b = hd.getBoundingClientRect();
            if (!a.width || !b.width) { olcum.push(null); continue; }
            olcum.push({ t: t,
                         dx: (b.left + b.width / 2) - (a.left + a.width / 2),
                         dy: (b.top + b.height / 2) - (a.top + a.height / 2) });
        }
        for (i = 0; i < olcum.length; i++) {
            var o = olcum[i];
            if (!o) { serit.children[i].classList.add('kc-bosal'); serit.children[i].style.transform = ''; continue; }
            o.t.classList.remove('kc-bosal');
            o.t.style.transform = 'translate(' + o.dx.toFixed(2) + 'px,' + o.dy.toFixed(2) + 'px)';
        }
    }
}

/* Kaynaşma bittikten sonra tekerleri ilk hâllerine bırakır. */
function kcKaynasCoz() {
    var ids = ['kcArTeker', 'kcTrTeker'], q, i;
    for (q = 0; q < ids.length; q++) {
        var serit = document.getElementById(ids[q]);
        if (!serit) continue;
        for (i = 0; i < serit.children.length; i++) {
            serit.children[i].style.transform = '';
            serit.children[i].classList.remove('kc-bosal');
        }
    }
}

/* Söz karesini KAPATIR ve bekleyen zamanlayıcının biletini yakar.
   Her adım değişiminde ilk iş budur: kullanıcı ileri/geri bastığında
   harfler önce yerlerine dönsün, sonra yeni harfler yuvarlansın.
   .kc-kaynas sınıfı (uzun geçiş süresi) dönüş yolu bitene kadar
   üzerinde kalır; erken sökülürse harfler yerine ZIPLAR. */
function kcBirlesikKapat() {
    S.bTok++;
    if (!S.birlesik) return;
    S.birlesik = false;
    var kitap = document.querySelector('.kc-kitap');
    if (kitap) kitap.classList.remove('kc-birlesik');
    kcKaynasCoz();
    var bilet = S.bTok;
    setTimeout(function () {
        if (bilet !== S.bTok || S.birlesik) return;
        var k = document.querySelector('.kc-kitap');
        if (k) k.classList.remove('kc-kaynas');
    }, 980);
}

/* Harfler yerine oturduktan sonra çağrılır. Bilet hâlâ geçerliyse
   (arada tuşa basılmadıysa) harfler birleşik kelimedeki yerlerine
   yürür, kutular erir, söz katmanı üstlerinde belirir. */
function kcBirlestir(bilet) {
    if (bilet !== S.bTok || !S.son || !S.son.arSoz) return;
    S.birlesik = true;
    kcSozSigdir();
    var kitap = document.querySelector('.kc-kitap');
    /* Önce uzun geçiş süresi (.kc-kaynas) ve erime (.kc-birlesik)
       yazılır, HEMEN ardından yeni konumlar. İkisi aynı iş parçasında
       olduğu için tarayıcı tek stil hesabında görür: harfler yeni
       süreyle yumuşakça yürür. */
    if (kitap) { kitap.classList.add('kc-kaynas'); kitap.classList.add('kc-birlesik'); }
    kcKaynastir();
}

/* KİTABA DOKUNUŞ = 4. evreye geç / 3. evreye dön.
   Dokunuş artık ayrı bir durum tutmaz; doğrudan çarkın bir adımıdır,
   böylece ok tuşlarıyla dokunuş aynı sayacı paylaşır ve sunum
   kumandasıyla dokunmatik tahta asla farklı yerlere düşmez. */
function kcSozDegis() {
    var f = S.adim % 4;
    if (f === 2) kcDondur(1);
    else if (f === 3) kcDondur(-1);
}

function kcGuncelle(ilk, yon) {
    kcBirlesikKapat();
    var d = kcDurumCoz(), kok = d.kok;
    /* ROUND V: P = Türkçe kök sütunları, PA = Arapça kök sütunları.
       İki şerit artık ayrı ölçüdedir, hepsinde ayrımı korumak gerekir. */
    var isk = kcIskelet(kok), P = isk.kokPoz, PA = isk.arPoz || isk.kokPoz;
    if (kcTekerKur(isk)) ilk = true;      /* şerit yenilendiyse hepsi yuvarlansın */
    var trHedef = [], arHedef = [], trSert = [], i;
    for (i = 0; i < isk.n; i++) { trHedef.push(''); arHedef.push(''); trSert.push(false); }
    if (d.tr) {
        var trK = d.tr.trKok || kok.trKok;
        var trH = kcTrKutular(d.tr);
        var trYer = kcYerles(trH, trK, isk, false);
        if (!trYer) return;                                  /* veri sigortası */
        /* Ekrana çıkan dizi: ilk kutusu büyük harfli KOPYA (kcTrBas).
           Ölçüm/kök bulma aşağıda hâlâ küçük harfli trH ile yapılır. */
        var trG = trH.slice(); trG[0] = kcTrBas(trG[0]);
        for (i = 0; i < isk.n; i++) if (trYer[i] >= 0) trHedef[i] = trG[trYer[i]];
        /* Sertleşen kök harfini işaretle: kökün d'si kelimede t olmuşsa
           (miktar) o teker mor yansın — kök yerinde, ses değişmiş. */
        var trO = kcOlcu(trH, trK);
        if (trO) for (i = 0; i < 3; i++) trSert[P[i]] = !!trO.sert[i];
    } else {
        var tk = kok.trKok;
        trHedef[P[0]] = tk[0]; trHedef[P[1]] = tk[1]; trHedef[P[2]] = tk[2];
    }
    if (d.ar) {
        var seg = kcArParcala(d.ar.tam);
        var bazlar = seg.map(function (s) { return s.b; });
        if (bazlar.join('') !== d.ar.ar)                     /* hareke sigortası */
            seg = kcHarfler(d.ar.ar).map(function (h) { return { b: h, m: '' }; });
        var arYer = kcYerles(seg.map(function (s) { return s.b; }), kok.arKok, isk, true);
        if (!arYer) return;                                  /* veri sigortası */
        var arB = kcArBicimli(seg);
        for (i = 0; i < isk.n; i++) if (arYer[i] >= 0) arHedef[i] = arB[arYer[i]];
    } else {
        var kb = kcArBicim(kok.arKok);
        arHedef[PA[0]] = kb[0]; arHedef[PA[1]] = kb[1]; arHedef[PA[2]] = kb[2];
    }
    /* SÖZ MADALYONU İÇERİĞİ: yalnız kelimenin hem Arapçası hem
       Türkçesi ekrandayken (çift adım) anlamlıdır. Harfler kelimenin
       kendi sırasındadır; kök / zâid / sertleşen ayrımı tekerlerdeki
       renklerin birebir aynısıdır. Arapça yüz "tam" (harekeli, doğal)
       yazımdan gelir: tarayıcı harfleri kendisi bağlar, kaşide yok. */
    var arSoz = '', trSoz = '', anlam = '', emoji = '';
    if (d.ar && d.tr && arYer && trYer) {
        var arKokIdx = [arYer[PA[0]], arYer[PA[1]], arYer[PA[2]]];
        arSoz = seg.map(function (s, idx) {
            return '<span class="kc-sz' + (arKokIdx.indexOf(idx) >= 0 ? ' kok' : '') +
                   '">' + s.b + s.m + '</span>';
        }).join('');
        var trKokIdx = [trYer[P[0]], trYer[P[1]], trYer[P[2]]];
        trSoz = trG.map(function (h, idx) {
            var kk = trKokIdx.indexOf(idx);
            return '<span class="kc-sz' +
                   (kk < 0 ? '' : (trO && trO.sert[kk] ? ' kok sert' : ' kok')) +
                   '">' + h + '</span>';
        }).join('');
        anlam = d.ar.anlam || '';
        emoji = KC_BALON[(d.sira + S.kok) % KC_BALON.length];
    }
    kcSozYaz(arSoz, trSoz, emoji, anlam);

    /* Harfler yazılmadan ÖNCE sütun enleri ayarlanır: kutu genişliği ile
       harf puntosu aynı karede değişsin, iki aşamalı zıplama olmasın. */
    /* arYer/trYer: teker pozisyonu → harf sırası. Kaynaşma bunlarla
       her tekeri birleşik kelimedeki kendi harfine eşler. */
    S.son = { ar: arHedef, tr: trHedef, isk: isk, arSoz: arSoz,
              arYer: arYer || null, trYer: trYer || null };
    kcSutunOlc(arHedef, trHedef, isk);
    var trT = document.getElementById('kcTrTeker').children;
    var arT = document.getElementById('kcArTeker').children;
    var g = 0;
    for (i = 0; i < isk.n; i++) {
        /* Kök tekerleri yerinde durur (yuvarlanmaz); bu ayrım her şeritte
           KENDİ kök sütunlarına göre yapılır. */
        if (kcTekerYaz(trT[i], trHedef[i], yon, g * 26, ilk || P.indexOf(i) < 0, trSert[i])) g++;
        if (kcTekerYaz(arT[i], arHedef[i], yon, g * 26, ilk || PA.indexOf(i) < 0)) g++;
    }
    /* HEM ARAPÇASI HEM TÜRKÇESİ ekrandaysa kelime tamamlanmıştır ve
       artık BİRLEŞTİRİLEBİLİR. Eskiden bu kare kendiliğinden açılırdı;
       artık açılmıyor: kitap "hazır" damgasını alır, üstünde ipucu
       yanıp söner ve birleşmeyi DOKUNUŞ başlatır (bkz. kcSozDegis).
       Böylece öğretmen önce harfleri gösterip sonra "şimdi birleşiyor"
       diyebilir; ekran onun önünden kaçmaz. */
    S.hazir = !!(d.ar && d.tr && arSoz);
    var kitapEl = document.querySelector('.kc-kitap');
    if (kitapEl) kitapEl.classList.toggle('kc-hazir', S.hazir);
    /* 4. EVREYE DIŞARIDAN GİRİŞ: geri tuşuyla sıradaki kelimenin
       kökünden bu kelimenin kaynaşmış hâline dönülürse (ya da çark
       başa sararsa) tekerler yeniden kurulur; harfler yuvarlanıp
       yerine oturmadan ölçüm alınamaz, bu yüzden kaynaşma geciktirilir.
       Bilet arada tuşa basılırsa yanar, eski zamanlayıcı iş yapmaz. */
    if (d.bir && S.hazir) {
        var bBilet = S.bTok;
        setTimeout(function () { kcBirlestir(bBilet); }, 660);
    }
    /* vezin kutusu (kök satırında): kelime yokken çıplak kökü söyler */
    setTimeout(function () {
        var vAr = document.getElementById('kcVzAr');
        var vTr = document.getElementById('kcVzTr');
        var kutu = document.getElementById('kcVezinKutu');
        if (!vAr || !vTr || !kutu) return;
        if (d.ar) {
            vAr.textContent = d.ar.vezinAr;
            vTr.textContent = 'vezin: ' + d.ar.vezinTr;
            kutu.classList.remove('kc-vk-bos');
        } else {
            vAr.textContent = 'الْجَذْرُ';
            vTr.textContent = 'kök';
            kutu.classList.add('kc-vk-bos');
        }
    }, 190);
}

/* Çark adımı: ileri = kök → Arapça → +Türkçe → sonraki vezin...
   geri aynı yolu tersine yürür (önce Türkçe soyunur, sonra Arapça).

   BASIŞ YUTULMAZ: teker dönerken (S.kilit) gelen yeni basış eskiden
   sessizce düşürülüyordu; akıllı tahtada arka arkaya dokunan öğretmene
   tuş "ölü" geliyordu. Artık basış SIRAYA alınır, dönüş biter bitmez
   kendiliğinden uygulanır. En çok 2 adım biriktirilir ki uzun basılı
   tutmada çark kontrolden çıkıp uçmasın. */
function kcDondur(yon) {
    if (S.kilit) {
        S.bekleyen = Math.max(-2, Math.min(2, (S.bekleyen || 0) + yon));
        return;
    }
    var n = KC_VERI[S.kok].kelimeler.length * 4;
    /* KÖK BİTİNCE KENDİLİĞİNDEN SIRADAKİ KÖKE.
       Eskiden bir kökün son kelimesinden sonra ileri tuşu aynı kökün
       başına sarıyordu; ders akışında öğretmen o noktada zaten kök
       şeridine uzanıp elle geçiyordu. Artık ileri tuşu tek başına
       yetiyor: son örnek bitince sıradaki kök baştan açılır. Geri tuşu
       da simetriktir — ilk adımdan geriye basmak önceki kökün SON
       örneğine götürür, yoksa "ileri gidiyor ama geri gitmiyor" olurdu.
       Son kökten sonra baştaki köke dönülür: çark kapanmaz. */
    var ham = S.adim + yon;
    if (KC_VERI.length > 1 && (ham >= n || ham < 0)) {
        var ileri = (ham >= n);
        kcKokSec((S.kok + (ileri ? 1 : -1) + KC_VERI.length) % KC_VERI.length,
                 ileri ? 'bas' : 'son');
        return;
    }
    S.kilit = true;
    kcSes();
    var yeni = (S.adim + yon + n) % n;
    var eskiF = S.adim % 4, yeniF = yeni % 4;
    var ayni = Math.floor(S.adim / 4) === Math.floor(yeni / 4);
    S.adim = yeni;
    /* 3. ↔ 4. EVRE: harfler zaten ekranda ve DEĞİŞMİYOR. Tekerleri
       yeniden yuvarlamak "her şey baştan kuruldu" hissi verirdi; oysa
       istenen, var olan harflerin dönüşerek kaynaşmasıdır. Bu yüzden
       bu geçişte kcGuncelle'ye hiç uğranmaz, yalnız kaynaşma oynatılır. */
    if (ayni && eskiF + yeniF === 5) {
        if (yeniF === 3) kcBirlestir(S.bTok); else kcBirlesikKapat();
        setTimeout(kcKilitAc, 780);       /* kaynaşma yolu daha uzun sürer */
        return;
    }
    kcGuncelle(false, yon);
    setTimeout(kcKilitAc, 620);
}

/* Kilidi açan TEK kapı. Kilit hangi işlem yüzünden kapanmış olursa olsun
   (çark adımı ya da kök seçimi), açılırken sırada bekleyen basış varsa
   onu hemen uygular. Kök seçiminin 820 ms'lik kilidi sırasında dokunulan
   ok/klavye basışları eskiden buharlaşıyordu — "tuş çalışmıyor" hissinin
   asıl kaynağı buydu. */
function kcKilitAc() {
    S.kilit = false;
    var b = S.bekleyen || 0;
    if (!b) return;
    S.bekleyen = b > 0 ? b - 1 : b + 1;   /* kalan basışlar sırada bekler */
    kcDondur(b > 0 ? 1 : -1);
}

/* KLAVYE / SUNUM KUMANDASI — akıllı tahtaya bağlı kumandaların "ileri
   geri" tuşları (çoğu PageDown/PageUp gönderir) ve klavye ok tuşları da
   çarkı çevirsin; öğretmen tahtaya uzanmadan da kelime türetebilsin.
   Yalnız çark ekranı açıkken çalışır, başka ekranlara karışmaz. */
var kcTusBagli = false;
function kcTuslariBagla() {
    if (kcTusBagli) return;
    kcTusBagli = true;
    document.addEventListener('keydown', function (e) {
        var ekr = document.getElementById('kc-screen');
        if (!ekr || !ekr.classList.contains('active')) return;
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        var k = e.key;
        /* Vezin tablosu penceresi açıkken tuşlar ARKADAKİ çarkı çevirmesin.
           Escape iki kademelidir: önce büyüyen kartı küçültür, kart yoksa
           pencereyi kapatır — öğrenci yanlışlıkla tabloyu kaybetmesin. */
        if (kcVezinPopAcik()) {
            if (k === 'Escape' || k === 'Esc') {
                e.preventDefault();
                var pv = document.getElementById('kcVezinPop');
                kcvOynatDur();
                if (pv && pv.querySelector('.kcv-kart.buyuk')) kcvKucult(pv);
                else kcVezinPopKapat();
                return;
            }
            /* Sunum kumandası tabloyu da yürütsün: ileri/geri vezni
               değiştirir, boşluk sunumu başlatıp durdurur. */
            if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown') { e.preventDefault(); kcvAdim(1); }
            else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); kcvAdim(-1); }
            else if (k === ' ' || k === 'Spacebar') {
                var ae = document.activeElement;
                if (ae && ae.tagName === 'BUTTON') return;   /* tarayıcı zaten tıklar */
                e.preventDefault(); kcvOynatDegis();
            }
            return;
        }
        var yon = 0;
        if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'PageDown') yon = 1;
        else if (k === 'ArrowUp' || k === 'ArrowLeft' || k === 'PageUp') yon = -1;
        else if (k === ' ' || k === 'Spacebar' || k === 'Enter') {
            /* Odakta bir tuş varsa tarayıcı onu zaten tıklar: çift adım olmasın */
            var a = document.activeElement;
            if (a && (a.tagName === 'BUTTON' || a.tagName === 'A')) return;
            /* Kaynaşma artık çarkın 4. evresidir; boşluk için ayrı bir
               kural gerekmez, sıradaki adım zaten birleşmedir. */
            yon = e.shiftKey ? -1 : 1;
        }
        if (!yon) return;
        e.preventDefault();
        kcDondur(yon);
    }, false);
}

/* nere: 'bas' (ya da boş) → kökün ilk adımı; 'son' → son adımı.
   Kök şeridinden seçmek hep baştan başlatır; çarkın kendiliğinden
   geçtiği durumda yön korunur — ileri giderken baştan, geri giderken
   sondan devam edilir. */
function kcKokSec(i, nere) {
    if (S.kilit || !KC_VERI[i]) return;
    S.kilit = true;
    S.bekleyen = 0;          /* yeni kök = temiz sayfa; eski basışlar taşınmaz */
    kcSes();
    S.kok = i;
    S.adim = (nere === 'son') ? (KC_VERI[i].kelimeler.length * 4 - 1) : 0;
    var tus = document.querySelectorAll('#kcKokler .kc-kok');
    for (var j = 0; j < tus.length; j++) tus[j].classList.toggle('secili', j === i);
    /* Kök şeridi yatay kayabiliyor: kendiliğinden geçilen kök şeridin
       dışında kalırsa öğretmen hangi kökte olduğunu göremezdi. */
    if (tus[i] && tus[i].scrollIntoView) {
        try { tus[i].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }
        catch (e) { tus[i].scrollIntoView(); }
    }
    kcGuncelle(true, (nere === 'son') ? -1 : 1);
    setTimeout(kcKilitAc, 820);   /* kök kurulurken basılan oklar da işlensin */
}

function kcAc() {
    kcKur();
    if (!S.kurulu) return;
    S.kilit = false;
    S.bekleyen = 0;
    kcTuslariBagla();
    kcKokSec(S.kok || 0);
}

/* ---------------- MENÜ KARTI ÖNİZLEMESİ ----------------
   Mini sahne: yol üstünde 5 teker (كتاب'ın 4-8. tekerleri). Kırmızı
   elif iki teker arasında gidip gelir; altta كِتَاب ⇄ كَاتِب yazısı
   aynı ritimle değişir — kart daha menüdeyken vezin fikrini anlatır. */
function kcOnizlemeKur() {
    var kap = document.getElementById('kcOnizleme');
    if (!kap) return;
    var mini = function (sinif, ic) {
        return '<div class="kco-teker ' + sinif + '"><span class="kco-yuz">' + ic + '</span></div>';
    };
    kap.innerHTML =
        '<div class="kco-sahne">' +
        '  <div class="kco-oklar"><span class="kco-ok-yukari">' + KC_OK_YUKARI + '</span>' +
        '  <span class="kco-ok-asagi">' + KC_OK_ASAGI + '</span></div>' +
        '  <div class="kco-tekerler">' +
             mini('kok', 'كـ') +
             mini('ek',  '<i class="kco-f2">ـا</i>') +
             mini('kok', '<i class="kco-f1">ـتـ</i><i class="kco-f2">تـ</i>') +
             mini('ek',  '<i class="kco-f1">ـا</i>') +
             mini('kok', '<i class="kco-f1">ب</i><i class="kco-f2">ـب</i>') +
        '  </div>' +
        '  <div class="kco-zemin"></div>' +
        '  <div class="kco-kelime"><span class="kco-f1">كِتَاب</span><span class="kco-f2">كَاتِب</span></div>' +
        '</div>';
}

/* ================= VEZİN TABLOSU PENCERESİ =================
   Kök satırındaki VEZİN KUTUSUNA dokununca açılır. Tek amacı vardır:
   ZÂİD HARFLERİN KÖKE EKLENİŞİNİ gözle göstermek. Onun için kart
   sade tutuldu ve yalnız dört basamak bırakıldı:

       1) vezin başlığı            İsm-i Fâil
       2) veznin Arapçası          فَاعِل      (zâid harfler KIRMIZI)
       3) kök                      كـ ـتـ ـب   (bağlanma yüzleriyle)
       4) zâid harfler köke iner → kök KELİMEYE dönüşür → Türkçesi çıkar

   Vezin ve kelime BİTİŞİK yazılır (harfler sütunlara ayrılmaz); zâid
   harf kırmızıyla ayırt edilir. Arapçanın üç satırı (vezin, kök,
   kelime) TEK PUNTODADIR: --kcv-ar. Türkçe karşılık ancak Arapça
   animasyon bittikten sonra belirir — öğrenci önce harflerin yolunu
   izlesin, sonucu sonra okusun.

   AKIŞ TIKLAMAYA BAĞLIDIR: ızgarada kartlar durur, bir vezne dokununca
   o kartın konteynırı büyür ve animasyon BİR KEZ oynar. Zâid harf
   düz aşağı düşmez; vezindeki yerinden kopar ve KELİMEDE ekleneceği
   noktaya uçar. Uçuşun başlangıç/bitiş noktası JS'te ölçülür
   (kcvUcur), CSS'e --dx/--dy olarak verilir.

   slot: her harf bir kayıt.  v = vezindeki harf, w = kelimedeki
   karşılığı, z = 1 ise ZÂİD (kökte yoktur, vezinden gelir). */
var KC_VEZIN_TABLO = [
    { ad: 'İsm-i Fâil', kok: ['ك','ت','ب'], okunus: 'kâtip', anlam: 'yazan',
      slot: [ {v:'فَ', w:'كَ'}, {v:'ا', w:'ا', z:1}, {v:'عِ', w:'تِ'}, {v:'ل', w:'ب'} ] },
    { ad: 'İsm-i Mefʿûl', kok: ['ك','ت','ب'], okunus: 'mektûb', anlam: 'yazılmış olan',
      slot: [ {v:'مَ', w:'مَ', z:1}, {v:'فْ', w:'كْ'}, {v:'عُ', w:'تُ'}, {v:'و', w:'و', z:1}, {v:'ل', w:'ب'} ] },
    /* İsm-i Mekân örneği MECLİS'tir: kök ج ل س (oturmak), vezin مَفْعِل.
       Türkçede yaşayan bir kelime olduğu için "yerin adı" fikri
       öğrenciye ilk bakışta oturur. */
    { ad: 'İsm-i Mekân', kok: ['ج','ل','س'], okunus: 'meclis', anlam: 'oturma yeri, toplantı yeri',
      slot: [ {v:'مَ', w:'مَ', z:1}, {v:'فْ', w:'جْ'}, {v:'عِ', w:'لِ'}, {v:'ل', w:'س'} ] },
    { ad: 'İsm-i Âlet', kok: ['ف','ت','ح'], okunus: 'miftâh', anlam: 'açma aleti, anahtar',
      slot: [ {v:'مِ', w:'مِ', z:1}, {v:'فْ', w:'فْ'}, {v:'عَ', w:'تَ'}, {v:'ا', w:'ا', z:1}, {v:'ل', w:'ح'} ] },
    { ad: 'İsm-i Tasgîr', kok: ['ح','س','ن'], okunus: 'Hüseyin', anlam: 'güzelcik',
      slot: [ {v:'فُ', w:'حُ'}, {v:'عَ', w:'سَ'}, {v:'يْ', w:'يْ', z:1}, {v:'ل', w:'ن'} ] },
    { ad: 'İsm-i Tafdîl', kok: ['ك','ب','ر'], okunus: 'ekber', anlam: 'en büyük',
      slot: [ {v:'أَ', w:'أَ', z:1}, {v:'فْ', w:'كْ'}, {v:'عَ', w:'بَ'}, {v:'ل', w:'ر'} ] },
    { ad: 'İsm-i Tafdîl (dişil)', kok: ['ك','ب','ر'], okunus: 'kübrâ', anlam: 'en büyük',
      slot: [ {v:'فُ', w:'كُ'}, {v:'عْ', w:'بْ'}, {v:'لَ', w:'رَ'}, {v:'ى', w:'ى', z:1} ] },
    { ad: 'Çoğul', kok: ['و','ل','د'], okunus: 'evlâd', anlam: 'çocuklar',
      slot: [ {v:'أَ', w:'أَ', z:1}, {v:'فْ', w:'وْ'}, {v:'عَ', w:'لَ'}, {v:'ا', w:'ا', z:1}, {v:'ل', w:'د'} ] },
    { ad: 'İfʿâl', kok: ['س','ل','م'], okunus: 'islâm', anlam: 'teslim oluş',
      slot: [ {v:'إِ', w:'إِ', z:1}, {v:'فْ', w:'سْ'}, {v:'عَ', w:'لَ'}, {v:'ا', w:'ا', z:1}, {v:'ل', w:'م'} ] },
    { ad: 'Tefʿîl', kok: ['س','ل','م'], okunus: 'teslîm', anlam: 'emanet etme',
      slot: [ {v:'تَ', w:'تَ', z:1}, {v:'فْ', w:'سْ'}, {v:'عِ', w:'لِ'}, {v:'ي', w:'ي', z:1}, {v:'ل', w:'م'} ] }
];

var KC_VP_KURULU = false;
var KC_VP_ZAM = 0;              /* büyüme bitince uçuşu başlatan zamanlayıcı */
var KC_VP_ZINCIR = 0;           /* sunumda sıradaki vezne geçiren zamanlayıcı */
var KC_VP_SIRA = -1;            /* o an açık olan veznin sırası (-1 = yok) */
var KC_VP_OYNAT = false;        /* sunum kendiliğinden akıyor mu */
/* Sunumda BİR VEZNİN EKRANDA KALMA SÜRESİ. Eskiden animasyonun kendi
   uzunluğuna bağlıydı ve sınıfta çok hızlı akıyordu; artık sabit 10
   saniye: öğrenci harflerin uçuşunu izleyip kelimeyi okuyacak vakti
   bulsun. "Sonraki" tuşuna basılırsa beklenmez, hemen geçilir ve bu
   10 saniye yeni vezin için baştan başlar. */
var KC_VP_SURE = 10000;
var KC_VP_KAPAN = 460;          /* kart küçülüp sıradaki açılana dek geçen pay */

/* Hareket duyarlılığı: animasyon yerine sonucu doğrudan gösteririz. */
function kcvAzHareket() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

/* ---------------- KUMANDA SİMGELERİ (SVG) ----------------
   Önceden ileri/geri/oynat tuşları yazı tipi karakteriydi (◀ ▶ ❚❚).
   Akıllı tahtadaki tarayıcılarda bu karakterler yazı tipine göre kimi
   zaman boş kutu, kimi zaman bambaşka boyda çıkıyordu. SVG her ekranda
   aynı çizilir, projeksiyonda büyütülünce bulanıklaşmaz ve fill
   "currentColor" olduğu için tuşun rengini kendiliğinden alır —
   oynat tuşu turuncuya döndüğünde simge de onunla döner. */
function kcvSvg(ic) {
    return '<svg class="kcv-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ic + '</svg>';
}
/* geri: sola bakan üçgen + solda durak çizgisi (slayt kumandası dili) */
var KC_SVG_GERI = kcvSvg(
    '<rect x="4.4" y="4.9" width="2.7" height="14.2" rx="1.35" fill="currentColor"/>' +
    '<path d="M19.4 6.1v11.8a1.1 1.1 0 0 1-1.73.9l-8.4-5.9a1.1 1.1 0 0 1 0-1.8l8.4-5.9a1.1 1.1 0 0 1 1.73.9z" fill="currentColor"/>');
/* ileri: aynısının aynası */
var KC_SVG_ILERI = kcvSvg(
    '<rect x="16.9" y="4.9" width="2.7" height="14.2" rx="1.35" fill="currentColor"/>' +
    '<path d="M4.6 6.1v11.8a1.1 1.1 0 0 0 1.73.9l8.4-5.9a1.1 1.1 0 0 0 0-1.8l-8.4-5.9a1.1 1.1 0 0 0-1.73.9z" fill="currentColor"/>');
/* oynat: tek üçgen */
var KC_SVG_OYNAT = kcvSvg(
    '<path d="M7.6 5.2a1.1 1.1 0 0 1 1.68-.94l10.1 6.8a1.1 1.1 0 0 1 0 1.88l-10.1 6.8A1.1 1.1 0 0 1 7.6 18.8z" fill="currentColor"/>');
/* durdur: iki çubuk */
var KC_SVG_DUR = kcvSvg(
    '<rect x="6.5" y="4.8" width="4" height="14.4" rx="1.5" fill="currentColor"/>' +
    '<rect x="13.5" y="4.8" width="4" height="14.4" rx="1.5" fill="currentColor"/>');

/* Pencereyi bir kez kurar (sonraki açılışlarda hazır DOM kullanılır). */
function kcVezinPopKur() {
    if (document.getElementById('kcVezinPop')) return;

    /* Harf dizisini BİTİŞİK metne çevirir; zâid harfleri kırmızı kutuya alır.
       <b> etiketi Arapça bitiştirmeyi bozmaz: harfler yine kelime gibi
       birleşir, yalnız rengi değişir. Vezindeki i. zâid harf ile kelimedeki
       i. zâid harf AYNI SIRADADIR — uçuşun hedefi buradan bulunur. */
    var birlestir = function (dizi, alan) {
        var m = '';
        for (var i = 0; i < dizi.length; i++) {
            var s = dizi[i], h = s[alan];
            m += s.z ? '<b class="kcv-z">' + h + '</b>' : h;
        }
        return m;
    };

    /* Kökü BAĞLANMA BİÇİMİYLE yazar: harf kelimede hangi yüzüyle
       duracaksa o yüzü gösterilir — كـ ـتـ ـب, و لـ ـد, فـ ـتـ ـح.
       Kural tek: bazı harfler kendinden SONRAKİNE bağlanmaz
       (ا د ذ ر ز و ة ى ء ve hemzeli biçimleri). Bir harfin sağına
       tatvîl (ـ) konur ancak ÖNCEKİ harf bağlanıyorsa; soluna konur
       ancak kendisi bağlanıyorsa ve son harf değilse. */
    var KCV_BAGLANMAZ = 'اأإآدذرزوؤةىءٱ';
    var kcvKokYaz = function (dizi) {
        var cik = [], i;
        for (i = 0; i < dizi.length; i++) {
            var h = dizi[i];
            var oncekiBaglar = i > 0 && KCV_BAGLANMAZ.indexOf(dizi[i - 1]) < 0;
            var kendiBaglar  = i < dizi.length - 1 && KCV_BAGLANMAZ.indexOf(h) < 0;
            /* ROUND X: her kök harfi kendi kutusunda — zâid harfin
               ineceği nokta KÖKÜN harflerine göre ölçülecek (kcvUcur). */
            cik.push('<i class="kcv-kh">' +
                     (oncekiBaglar ? 'ـ' : '') + h + (kendiBaglar ? 'ـ' : '') + '</i>');
        }
        return cik.join(' ');
    };

    var kartHtml = function (k, sira) {
        /* Uçan harfler: kartın üstüne serilen mutlak katmanda dururlar.
           Başlangıç noktaları da, --dx/--dy hedefleri de JS'te ölçülür
           (kcvUcur); burada yalnız harfin kendisi yazılır. */
        var ucus = '', i;
        for (i = 0; i < k.slot.length; i++) {
            if (!k.slot[i].z) continue;
            ucus += '<span class="kcv-dus">' + k.slot[i].v + '</span>';
        }
        return '' +
        '<div class="kcv-yuva">' +
        '<button type="button" class="kcv-kart" data-sira="' + sira + '"' +
        ' style="--gel:' + (sira * .06).toFixed(2) + 's">' +
        '  <span class="kcv-ad">' + k.ad + '</span>' +
        '  <span class="kcv-vezin" dir="rtl">' + birlestir(k.slot, 'v') + '</span>' +
        '  <span class="kcv-sahne">' +
        '    <span class="kcv-yigin">' +
        '      <span class="kcv-kok" dir="rtl">' + kcvKokYaz(k.kok) + '</span>' +
        '      <span class="kcv-kelime" dir="rtl">' + birlestir(k.slot, 'w') + '</span>' +
        '    </span>' +
        '  </span>' +
        '  <span class="kcv-tr"><b>' + kcTrBas(k.okunus) + '</b> · ' + k.anlam + '</span>' +
        '  <span class="kcv-ucus" aria-hidden="true">' + ucus + '</span>' +
        /* Geri sayım şeridi: yalnız sunum akarken görünür, kartın üst
           kenarında 10 saniye boyunca eriyerek biter. */
        '  <span class="kcv-sure" aria-hidden="true"></span>' +
        '</button>' +
        '</div>';
    };

    var kartlar = '';
    for (var c = 0; c < KC_VEZIN_TABLO.length; c++) kartlar += kartHtml(KC_VEZIN_TABLO[c], c);

    var per = document.createElement('div');
    per.className = 'kcv-perde';
    per.id = 'kcVezinPop';
    per.setAttribute('role', 'dialog');
    per.setAttribute('aria-modal', 'true');
    per.setAttribute('aria-label', 'Vezinler tablosu');
    per.innerHTML =
        '<div class="kcv-pencere" role="document">' +
        '  <button type="button" class="kcv-kapat" id="kcVpKapat" aria-label="Kapat">✕</button>' +
        '  <div class="kcv-basrol">' +
        '    <span class="kcv-basrol-ar" dir="rtl">أَشْهَرُ الْأَوْزَانِ</span>' +
        '    <span class="kcv-basrol-tr">En Çok Kullanılan Vezinler</span>' +
        '    <span class="kcv-basrol-not">Kırmızı harfler ZÂİDDİR: kökte yoktur, vezinden gelir — bir vezne dokun, harfler yerine insin.</span>' +
        /* KUMANDA — akıllı tahtada öğretmen ekrana uzanmadan da sunum
           yapabilsin diye: "Oynat" bütün vezinleri sırayla açıp
           oynatır, ileri/geri tuşları tek tek yürütür. Sunum
           kumandalarının PageUp/PageDown'u da bu tuşlara bağlıdır. */
        '    <div class="kcv-kumanda">' +
        '      <button type="button" class="kcv-tus" id="kcVpGeri" title="Önceki vezin (PageUp)" aria-label="Önceki vezin">' +
        '        <span class="kcv-ikon" aria-hidden="true">' + KC_SVG_GERI + '</span></button>' +
        '      <button type="button" class="kcv-tus kcv-tus-oynat" id="kcVpOynat" aria-pressed="false"' +
        '              title="Vezinleri sırayla oynat (boşluk)" aria-label="Vezinleri sırayla oynat">' +
        '        <span class="kcv-ikon" aria-hidden="true">' + KC_SVG_OYNAT + '</span>' +
        '        <span class="kcv-etiket">Oynat</span></button>' +
        '      <button type="button" class="kcv-tus" id="kcVpIleri" title="Sonraki vezin (PageDown)" aria-label="Sonraki vezin">' +
        '        <span class="kcv-ikon" aria-hidden="true">' + KC_SVG_ILERI + '</span></button>' +
        '      <span class="kcv-sayac" id="kcVpSayac" aria-live="polite">— / ' + KC_VEZIN_TABLO.length + '</span>' +
        '    </div>' +
        '  </div>' +
        '  <div class="kcv-govde">' + kartlar + '</div>' +
        '</div>';
    document.body.appendChild(per);

    document.getElementById('kcVpKapat').addEventListener('click', kcVezinPopKapat);
    document.getElementById('kcVpGeri').addEventListener('click', function (e) { e.stopPropagation(); kcvAdim(-1); });
    document.getElementById('kcVpIleri').addEventListener('click', function (e) { e.stopPropagation(); kcvAdim(1); });
    document.getElementById('kcVpOynat').addEventListener('click', function (e) { e.stopPropagation(); kcvOynatDegis(); });
    /* Perdenin boşluğu → pencereyi kapat. Pencerenin boşluğu → yalnız
       büyüyen kartı küçült (tablo açık kalsın). */
    per.addEventListener('click', function (e) { if (e.target === per) kcVezinPopKapat(); });
    var pen = per.querySelector('.kcv-pencere');
    if (pen) pen.addEventListener('click', function (e) {
        var k = kcvKartBul(e.target);
        if (k) { kcvOynatDur(); kcvKartAc(k); return; }
        if (per.querySelector('.kcv-kart.buyuk')) { kcvOynatDur(); kcvKucult(per); }
    });
    KC_VP_KURULU = true;
}

/* Tıklanan düğümden yukarı çıkarak kartı bulur (closest'siz, ES5 güvenli). */
function kcvKartBul(dugum) {
    while (dugum && dugum.nodeType === 1) {
        if (dugum.className && ('' + dugum.className).indexOf('kcv-kart') >= 0) return dugum;
        dugum = dugum.parentNode;
    }
    return null;
}

/* Bir vezne dokunuldu: kartın konteynırı büyür, sonra animasyon BİR KEZ
   oynar. oto=true ise (sunum akışı) animasyon bitince kart kapanır ve
   sıradaki vezne geçilir. */
function kcvKartAc(kart, oto) {
    var per = document.getElementById('kcVezinPop');
    if (!per || !kart) return;
    var pen = per.querySelector('.kcv-pencere');
    var eski = per.querySelector('.kcv-kart.buyuk');
    if (eski && eski !== kart) { eski.classList.remove('buyuk'); eski.classList.remove('oynat'); }
    kcSes();
    clearTimeout(KC_VP_ZAM);
    KC_VP_SIRA = parseInt(kart.dataset.sira, 10);
    kcvSayacYaz();

    if (!kart.classList.contains('buyuk')) {
        kart.classList.add('buyuk');
        if (pen) pen.classList.add('odak');
        /* Büyüme geçişi bitmeden ölçüm alınırsa harfler eski yerine uçar;
           onun için uçuş, kart son boyutuna oturduktan sonra başlatılır. */
        KC_VP_ZAM = setTimeout(function () { kcvUcur(kart); }, 360);
    } else {
        kcvUcur(kart);              /* büyük karta yeniden dokunmak = tekrar oynat */
    }
    /* Geri sayım ve zincir, kartın AÇILDIĞI andan başlar; böylece her
       veznin ekranda kalma süresi animasyon uzunluğundan bağımsız
       olarak tam 10 saniyedir. */
    kcvGeriSayim(kart, !!oto);
    if (oto) kcvZincir();
}

/* GERİ SAYIM ŞERİDİ — büyüyen kartın üst kenarındaki ince kırmızı çizgi
   10 saniye boyunca eriyerek sıradaki vezne ne kadar kaldığını söyler.
   Her açılışta sınıf önce silinir ve akış sıfırlanır (offsetWidth):
   "sonraki"ye basıldığında çizgi baştan dolsun, yarım kalmasın. */
function kcvGeriSayim(kart, ac) {
    var hepsi = kcvKartlar(), i;
    for (i = 0; i < hepsi.length; i++) hepsi[i].classList.remove('sayac');
    if (!ac || !kart) return;
    kart.style.setProperty('--kcv-sure', (KC_VP_SURE / 1000).toFixed(2) + 's');
    void kart.offsetWidth;
    kart.classList.add('sayac');
}

/* Büyüyen kartı ızgaradaki yerine geri gönderir. */
function kcvKucult(per) {
    per = per || document.getElementById('kcVezinPop');
    if (!per) return;
    clearTimeout(KC_VP_ZAM);
    var b = per.querySelectorAll('.kcv-kart.buyuk');
    for (var i = 0; i < b.length; i++) {
        b[i].classList.remove('buyuk'); b[i].classList.remove('oynat'); b[i].classList.remove('sayac');
    }
    var pen = per.querySelector('.kcv-pencere');
    if (pen) pen.classList.remove('odak');
}

/* ---------------- SUNUM AKIŞI (oynat · ileri · geri) ----------------
   Öğretmen tahtaya uzanmadan ders anlatabilsin diye üç yol var:
     · Oynat  → vezinler baştan sona kendiliğinden açılır, oynar, kapanır
     · ileri/geri tuşları → tek tek yürütür
     · sunum kumandası (PageDown/PageUp) → aynı tuşlara bağlıdır
   Kart ölçüsü sabit olmadığı için bekleme süresi uçuş ölçümünden
   (kcvUcur'ün döndürdüğü saniye) hesaplanır; animasyon uzunsa bekleme
   de uzar, kısaysa kısalır. */
function kcvKartlar() {
    var per = document.getElementById('kcVezinPop');
    return per ? per.querySelectorAll('.kcv-kart') : [];
}

function kcvSayacYaz() {
    var s = document.getElementById('kcVpSayac');
    if (!s) return;
    s.textContent = (KC_VP_SIRA >= 0 ? (KC_VP_SIRA + 1) : '—') + ' / ' + KC_VEZIN_TABLO.length;
}

/* n. vezni aç (tur başa sarar). oto=true ise sunum zinciri sürer. */
function kcvGit(n, oto) {
    var k = kcvKartlar();
    if (!k.length) return;
    if (n < 0) n = k.length - 1;
    if (n >= k.length) n = 0;
    kcvKartAc(k[n], oto);
}

/* İleri/geri tuşu.
   SUNUM AKARKEN sunumu DURDURMAZ: istenen vezne hemen atlar ve o vezin
   için 10 saniyelik geri sayım baştan başlar — öğretmen "burayı anladık,
   geç" diyebilsin, ritim de bozulmasın. Sunum kapalıyken eskisi gibi
   tek tek elle yürütür. */
function kcvAdim(yon) {
    var oto = KC_VP_OYNAT;
    if (!oto) kcvOynatDur();
    kcvGit((KC_VP_SIRA < 0 ? (yon > 0 ? -1 : 0) : KC_VP_SIRA) + yon, oto);
}

/* Vezin 10 saniye ekranda kalır, sonra kart kapanır ve sıradakine
   geçilir. Süre animasyonun uzunluğundan bağımsızdır: kısa vezinde de
   uzun vezinde de öğrenci aynı süre bakar. */
function kcvZincir() {
    clearTimeout(KC_VP_ZINCIR);
    if (!KC_VP_OYNAT) return;
    var bekle = Math.max(1200, KC_VP_SURE - KC_VP_KAPAN);
    KC_VP_ZINCIR = setTimeout(function () {
        if (!KC_VP_OYNAT) return;
        kcvKucult();                                   /* vezin kapanır */
        KC_VP_ZINCIR = setTimeout(function () {
            if (!KC_VP_OYNAT) return;
            if (KC_VP_SIRA + 1 >= KC_VEZIN_TABLO.length) { kcvOynatDur(); return; }
            kcvGit(KC_VP_SIRA + 1, true);              /* sıradaki vezin */
        }, KC_VP_KAPAN);
    }, bekle);
}

function kcvOynatBasla() {
    KC_VP_OYNAT = true;
    kcvOynatTusu();
    kcvGit(KC_VP_SIRA < 0 ? 0 : KC_VP_SIRA, true);
}

function kcvOynatDur() {
    KC_VP_OYNAT = false;
    clearTimeout(KC_VP_ZINCIR);
    kcvGeriSayim(null, false);      /* geri sayım çizgisi de sönsün */
    kcvOynatTusu();
}

function kcvOynatDegis() { if (KC_VP_OYNAT) kcvOynatDur(); else kcvOynatBasla(); }

function kcvOynatTusu() {
    var t = document.getElementById('kcVpOynat');
    if (!t) return;
    t.classList.toggle('acik', KC_VP_OYNAT);
    t.setAttribute('aria-pressed', KC_VP_OYNAT ? 'true' : 'false');
    var ik = t.querySelector('.kcv-ikon'), et = t.querySelector('.kcv-etiket');
    /* Simge SVG olduğu için metin değil içerik değişir (bkz. KC_SVG_*) */
    if (ik) ik.innerHTML = KC_VP_OYNAT ? KC_SVG_DUR : KC_SVG_OYNAT;
    if (et) et.textContent = KC_VP_OYNAT ? 'Durdur' : 'Oynat';
    t.setAttribute('aria-label', KC_VP_OYNAT ? 'Sunumu durdur' : 'Vezinleri sırayla oynat');
}

/* UÇUŞ ÖLÇÜMÜ — işin özü.
   Zâid harf düz aşağı düşmez: vezindeki yerinden kopar ve KELİMEDE
   duracağı noktaya gider. Kelime satırı o an saydamdır ama yerleşimi
   yapılmıştır, dolayısıyla hedef harfin kutusu ölçülebilir.
   Kaynak merkezi → uçan harfin left/top'u, iki merkez farkı → --dx/--dy.
   DÖNÜŞ: animasyonun toplam süresi (saniye) — sunum akışı sıradaki
   vezne ne zaman geçeceğini buradan bilir. */
function kcvBosluklar(tab) {
    /* Her zâid harfin ÖNÜNDE kaç kök harfi var (Arapça okuma sırası).
       0 → kelimenin tam başı, kök boyu → tam sonu, arası → ilgili ara. */
    var b = [], sayac = 0, i;
    if (!tab) return b;
    for (i = 0; i < tab.slot.length; i++) {
        if (tab.slot[i].z) b.push(sayac); else sayac++;
    }
    return b;
}

/* Zâid harfin İNECEĞİ NOKTA — ekranda O AN duran KÖKE göre ölçülür.
   Eskiden hedef, henüz görünmeyen kelimedeki yerdi; kelime kökten dar
   olduğu için harf kökün başına değil ortalarına bir yere iniyordu.
   Artık: baştaki zâid ilk kök harfinin SAĞINA (Arapçada başı sağdadır),
   sondaki son kök harfinin SOLUNA, ortadaki iki kök harfinin TAM
   ARASINA iner. Kök ölçülemezse eski davranışa düşülür. */
function kcvInis(kh, g, en, yedek) {
    var n = kh.length, r, sag, sol;
    if (!n) {
        r = yedek ? yedek.getBoundingClientRect() : null;
        return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
    }
    if (g <= 0) {
        r = kh[0].getBoundingClientRect();
        return { x: r.right + en / 2, y: r.top + r.height / 2 };
    }
    if (g >= n) {
        r = kh[n - 1].getBoundingClientRect();
        return { x: r.left - en / 2, y: r.top + r.height / 2 };
    }
    sag = kh[g - 1].getBoundingClientRect();        /* RTL: önceki harf SAĞDA */
    sol = kh[g].getBoundingClientRect();
    return { x: (sag.left + sol.right) / 2,
             y: (sag.top + sag.height / 2 + sol.top + sol.height / 2) / 2 };
}

function kcvUcur(kart) {
    if (!kart) return 0;
    var ucus = kart.querySelector('.kcv-ucus');
    if (!ucus) return 0;
    var vz  = kart.querySelectorAll('.kcv-vezin .kcv-z');
    var kz  = kart.querySelectorAll('.kcv-kelime .kcv-z');
    var kh  = kart.querySelectorAll('.kcv-kok .kcv-kh');
    var dus = ucus.querySelectorAll('.kcv-dus');
    var kr  = kart.getBoundingClientRect();
    var bos = kcvBosluklar(KC_VEZIN_TABLO[+(kart.getAttribute('data-sira') || 0)]);
    var n = Math.min(vz.length, kz.length, dus.length), i;

    for (i = 0; i < n; i++) {
        var a = vz[i].getBoundingClientRect();      /* kaynak: vezindeki harf */
        var d = dus[i];
        var dr = d.getBoundingClientRect();
        var h = kcvInis(kh, i < bos.length ? bos[i] : 0, dr.width || a.width, kz[i]);
        if (!h) continue;
        d.style.left = (a.left - kr.left + a.width  / 2).toFixed(1) + 'px';
        d.style.top  = (a.top  - kr.top  + a.height / 2).toFixed(1) + 'px';
        d.style.setProperty('--dx', (h.x - (a.left + a.width  / 2)).toFixed(1) + 'px');
        d.style.setProperty('--dy', (h.y - (a.top  + a.height / 2)).toFixed(1) + 'px');
        d.style.setProperty('--gec', (i * .42).toFixed(2) + 's');
        vz[i].style.setProperty('--gec', (i * .42).toFixed(2) + 's');
    }
    /* t1: son harf yerine oturduğu an (kök çekilir, kelime belirir)
       t2: Arapça bittikten sonra Türkçesi çıkar */
    var t1 = (n ? (n - 1) * .42 : 0) + 1.22;
    kart.style.setProperty('--t1', t1.toFixed(2) + 's');
    kart.style.setProperty('--t2', (t1 + .55).toFixed(2) + 's');

    kart.classList.remove('oynat');
    void kart.offsetWidth;                          /* akışı sıfırla */
    kart.classList.add('oynat');
    return t1 + .55 + .45;                          /* Türkçe satırı da belirene dek */
}

function kcVezinPopAcik() {
    var p = document.getElementById('kcVezinPop');
    return !!p && p.classList.contains('acik');
}

function kcVezinPopAc() {
    kcVezinPopKur();
    var p = document.getElementById('kcVezinPop');
    if (!p) return;
    kcSes();
    kcvOynatDur();
    kcvKucult(p);
    KC_VP_SIRA = -1;
    kcvSayacYaz();
    p.classList.add('acik');
    /* kart giriş animasyonu baştan oynasın */
    var g = p.querySelectorAll('.kcv-govde');
    for (var i = 0; i < g.length; i++) { g[i].style.animation = 'none'; void g[i].offsetWidth; g[i].style.animation = ''; }
    var k = document.getElementById('kcVpKapat');
    if (k) k.focus();
}

function kcVezinPopKapat() {
    var p = document.getElementById('kcVezinPop');
    if (!p) return;
    kcvOynatDur();
    kcvKucult(p);
    p.classList.remove('acik');
    var kutu = document.getElementById('kcVezinKutu');
    if (kutu) kutu.focus();
}

document.addEventListener('DOMContentLoaded', function () {
    kcOnizlemeKur();
    var kart = document.getElementById('kcKart');
    if (kart) kart.addEventListener('click', kcAc);
});

window.KelimeCarki = { ac: kcAc, veri: KC_VERI, yerles: kcYerles, iskelet: kcIskelet,
                       /* durum: canlı durum nesnesi (kok, adim, kilit...).
                          Sınavlar çarkın nerede olduğunu buradan okur. */
                       durum: S,
                       olcu: kcOlcu, sert: KC_SERT, bicim: kcArBicim, parcala: kcArParcala,
                       /* kutular: bir kelimenin Türkçe KUTULARI (harf ≠ kutu;
                          bkz. trKutu). Testler de buradan okusun ki iskelet ile
                          denetim aynı kutulamayı görsün. */
                       kutular: kcTrKutular,
                       /* gorunum(): görünümü dışarıdan da değiştirilebilsin
                          ('sik' | 'sade'); argümansız çağrılırsa yürürlükteki
                          görünümü döndürür. Sınavlar da bunu kullanır. */
                       gorunum: function (m) {
                           if (m === 'sik' || m === 'sade') return kcGorunumYaz(m, true);
                           return kcSadeMi() ? 'sade' : 'sik';
                       } };
})();
