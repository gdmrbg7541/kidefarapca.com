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
        { tr: 'mektep',  ar: 'مكتب',   tam: 'مَكْتَب',   vezinAr: 'مَفْعَل',  vezinTr: 'mefʿal',  anlam: 'yazı yeri · okul' },
        { tr: 'mektup',  ar: 'مكتوب',  tam: 'مَكْتُوب',  vezinAr: 'مَفْعُول', vezinTr: 'mefʿûl',  anlam: 'yazılmış şey' } ] },
    { arKok: ['ح', 'ك', 'م'], trKok: ['h', 'k', 'm'], arGoster: 'حـ ـكـ ـم', anlam: 'hükmetmek',
      kelimeler: [
        { tr: 'hüküm',   ar: 'حكم',    tam: 'حُكْم',     vezinAr: 'فُعْل',    vezinTr: 'fuʿl',    anlam: 'karar' },
        { tr: 'hâkim',   ar: 'حاكم',   tam: 'حَاكِم',    vezinAr: 'فَاعِل',   vezinTr: 'fâil',    anlam: 'hükmeden kişi' },
        { tr: 'hikmet',  ar: 'حكمة',   tam: 'حِكْمَة',   vezinAr: 'فِعْلَة',  vezinTr: 'fiʿle',   anlam: 'derin kavrayış' },
        { tr: 'mahkeme', ar: 'محكمة',  tam: 'مَحْكَمَة', vezinAr: 'مَفْعَلَة', vezinTr: 'mefʿale', anlam: 'hüküm yeri' } ] },
    { arKok: ['س', 'ل', 'م'], trKok: ['s', 'l', 'm'], arGoster: 'سـ ـلـ ـم', anlam: 'esen olmak',
      kelimeler: [
        { tr: 'selam',   ar: 'سلام',   tam: 'سَلَام',    vezinAr: 'فَعَال',   vezinTr: 'feʿâl',   anlam: 'esenlik dileği' },
        { tr: 'islam',   ar: 'إسلام',  tam: 'إِسْلَام',  vezinAr: 'إِفْعَال', vezinTr: 'ifʿâl',   anlam: 'teslim oluş' },
        { tr: 'teslim',  ar: 'تسليم',  tam: 'تَسْلِيم',  vezinAr: 'تَفْعِيل', vezinTr: 'tefʿîl',  anlam: 'emanet etme' },
        { tr: 'selamet', ar: 'سلامة',  tam: 'سَلَامَة',  vezinAr: 'فَعَالَة', vezinTr: 'feʿâle',  anlam: 'kurtuluş' } ] },
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
        { tr: 'kudret',   ar: 'قدرة',   tam: 'قُدْرَة',    vezinAr: 'فُعْلَة',      vezinTr: 'fuʿle',    anlam: 'güç · yetenek' },
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
        { tr: 'hürmet',   ar: 'حرمة',   tam: 'حُرْمَة',    vezinAr: 'فُعْلَة',   vezinTr: 'fuʿle',    anlam: 'saygı · dokunulmazlık' },
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

function kcHarfler(s) { return Array.from(s); }

/* Kelimenin TÜRKÇE kutuları. Kural olarak her harf kendi kutusunda
   durur; ama bazı kelimelerde tek Arap harfine iki Türkçe harf düşer
   (şedde, ya da zâid ت + yardımcı ünlü). O kelimelerde veri kendi
   kutulanmasını `trKutu` ile söyler. Tek yerden okunuyor ki iskelet
   ile çizim asla farklı kutulama görmesin. */
function kcTrKutular(kel) { return kel.trKutu || kcHarfler(kel.tr); }

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
     on  → kökten önceki boş yuva sayısı
     ara → iki kök harfi arasındaki yuva sayısı (ikisinde de aynı)
     son → kökten sonraki yuva sayısı
     n   → toplam teker
     kokPoz → kök tekerlerinin sırası (0 tabanlı)
   İKİ ZORUNLU KURAL — kökler iki şeritte de aynı sütunlara düşsün diye:
     · on = son + 1        (kök sütunları N'e göre simetrik olsun)
     · iki ara EŞİT olsun  (orta kök tam ortada dursun)
   Arapça şerit ters dizildiği için kök sütunları {p, n/2, n-p}
   kümesidir; küme ters çevrilince değişmediğinden hiza kendiliğinden
   tutar. Sonuç kökün üstünde saklanır (bir kez hesaplanır). */
function kcIskelet(kok) {
    if (kok._isk) return kok._isk;
    var onG = 0, araG = 0, sonG = 0;
    kok.kelimeler.forEach(function (kel) {
        var trH = kcTrKutular(kel);
        var seg = kcArParcala(kel.tam);
        var arH = seg.map(function (s) { return s.b; });
        if (arH.join('') !== kel.ar) arH = kcHarfler(kel.ar);
        [kcOlcu(trH, kel.trKok || kok.trKok), kcOlcu(arH, kok.arKok)]
            .forEach(function (o) {
                if (!o) return;
                onG = Math.max(onG, o.on);
                araG = Math.max(araG, o.a1, o.a2);
                sonG = Math.max(sonG, o.son);
            });
    });
    var on = Math.max(onG, sonG + 1), son = on - 1, ara = araG;
    var p0 = on, p1 = on + 1 + ara, p2 = p1 + 1 + ara;
    kok._isk = { on: on, ara: ara, son: son, n: p2 + 1 + son, kokPoz: [p0, p1, p2] };
    return kok._isk;
}

/* Kelimenin harflerini iskeletin tekerlerine yerleştirir: kök harfler
   kokPoz'a, kökten öncekiler sağa yaslı, aralar ortalanmadan soldan,
   kökten sonrakiler sırayla. Dönen dizi: teker → harf sırası (yoksa
   -1). Sığmayan kelime null döner (veri hatasına karşı sigorta). */
function kcYerles(harfler, kok, isk) {
    var o = kcOlcu(harfler, kok);
    if (!o) return null;
    if (!isk) isk = { on: 3, ara: 1, son: 2, kokPoz: [3, 5, 7], n: 10 };
    if (o.on > isk.on || o.a1 > isk.ara || o.a2 > isk.ara || o.son > isk.son) return null;
    var d = [], i;
    for (i = 0; i < isk.n; i++) d.push(-1);
    for (i = 0; i < o.on; i++) d[isk.kokPoz[0] - o.on + i] = i;
    d[isk.kokPoz[0]] = o.ki[0];
    for (i = 0; i < o.a1; i++) d[isk.kokPoz[0] + 1 + i] = o.ki[0] + 1 + i;
    d[isk.kokPoz[1]] = o.ki[1];
    for (i = 0; i < o.a2; i++) d[isk.kokPoz[1] + 1 + i] = o.ki[1] + 1 + i;
    d[isk.kokPoz[2]] = o.ki[2];
    for (i = 0; i < o.son; i++) d[isk.kokPoz[2] + 1 + i] = o.ki[2] + 1 + i;
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

/* adim: 0 = iki tarafta yalnız KÖK (harekesiz). Sonra kelime başına
   iki adım: tek sayı = yalnız Arapça türedi (harekeli), çift sayı =
   Türkçesi de türedi. Toplam 2N+1 durum, çark gibi döner. */
/* birlesik: kelimenin hem Arapçası hem Türkçesi ekrana geldikten sonra
   açılan SÖZ KARESİ. Tekerler usulca söner ve yerlerinde, her sayfanın
   ortasında YUVARLAK bir söz madalyonu belirir: kelime tek parça,
   doğal bağlı yazımıyla okunur. bTok, geciken birleştirme
   zamanlayıcısının biletidir: kullanıcı birleşme olgunlaşmadan tuşa
   basarsa bilet değişir, eski zamanlayıcı artık geçersiz duruma
   dokunamaz. */
var S = { kok: 0, adim: 0, kilit: false, kurulu: false, son: null, bekleyen: 0,
          birlesik: false, bTok: 0 };

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

/* Verilen "boş göz eni" (dar) için iki şeridin 11 gözünü de hesaplar.
   Dönüş: { t: [11], a: [11], toplam } — hepsi punto=1 birimindedir.
     t[j] → Türkçe şeritte j. sütun (j=0..9 rulo, j=10 görünmez pay)
     a[j] → Arapça şeritte j. sütun (j=0 görünmez pay, j=1..10 rulo)
   Kural: 3..7 (yani 4-8. sütun) çiftler halinde eşitlenir; 0..2 ve
   8..10 blokları serbesttir, yalnız blok toplamları eşitlenir. */
function kcOlcHesap(nT, nA, dar, isk) {
    var S1 = isk.n + 1, p0 = isk.kokPoz[0], p2 = isk.kokPoz[2];
    var t = [], a = [], j, tt, at, h;
    for (j = 0; j < S1; j++) {
        t.push(nT[j] > 0 ? nT[j] + 2 * KC_YAN : dar);
        a.push(nA[j] > 0 ? nA[j] + 2 * KC_YAN : dar);
    }
    /* ORTA KUŞAK: kök sütunları (p0..p2) — simetri burada zorunlu */
    for (j = p0; j <= p2; j++) { h = Math.max(t[j], a[j]); t[j] = a[j] = h; }
    /* SOL blok (0..p0-1): yalnız toplam eşitlenir, fazlalık en soldaki göze */
    tt = at = 0;
    for (j = 0; j < p0; j++) { tt += t[j]; at += a[j]; }
    h = Math.max(tt, at); t[0] += h - tt; a[0] += h - at;
    /* SAĞ blok (p2+1..n): yalnız toplam eşitlenir, fazlalık en sağdaki göze */
    tt = at = 0;
    for (j = p2 + 1; j < S1; j++) { tt += t[j]; at += a[j]; }
    h = Math.max(tt, at); t[S1 - 1] += h - tt; a[S1 - 1] += h - at;
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
function kcTekerHtml(isk) {
    var s = '', p;
    for (p = 0; p < isk.n; p++) {
        var kokMu = isk.kokPoz.indexOf(p) >= 0;
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
    var html = kcTekerHtml(isk);
    arS.innerHTML = html;
    trS.innerHTML = html;
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
    var tekerler = kcTekerHtml(kcSonIsk);
    /* Başlık AKIŞ DIŞINDA, geri tuşuyla aynı üst hizada durur. Kök
       satırı: solda kayan kök tuşları + sağda KOYU MÜREKKEP tasarımlı
       vezin kutusu. Gövde: SOLDA tek ok çifti (teker kabının dışında),
       sağda kitap. Kelime etiketi yok — kelime tekerlerde kocamandır. */
    ekran.innerHTML =
        '<div class="back-btn" id="kc-back">' + BACK_SVG + '</div>' +
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
        '          <div class="kc-yol"><div class="kc-tekerler kc-rtl" id="kcArTeker">' + tekerler + '</div>' +
        '          <div class="kc-soz kc-rtl" id="kcArSoz" aria-hidden="true"><span class="kc-soz-sar">' +
        '            <span class="kc-soz-olcek"><span class="kc-soz-ic"></span></span></span></div>' +
        '          <div class="kc-zemin"></div></div>' +
        '        </section>' +
        '        <section class="kc-sayfa kc-turkce">' +
        '          <div class="kc-yol"><div class="kc-tekerler" id="kcTrTeker">' + tekerler + '</div>' +
        '          <div class="kc-soz" id="kcTrSoz" aria-hidden="true"><span class="kc-soz-sar">' +
        '            <span class="kc-soz-olcek"><span class="kc-soz-ic"></span>' +
        '            <span class="kc-balon" id="kcBalon"><b id="kcBalonEmoji">🎈</b><i id="kcBalonYazi"></i></span>' +
        '            </span></span></div>' +
        '          <div class="kc-zemin"></div></div>' +
        '        </section>' +
        '      </div>' +
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
    S.kurulu = true;
}

/* ---------------- TEKER DÖNÜŞÜ ----------------
   Harf silindirin yüzeyine YAPIŞIKTIR: teker dönerken harf de yüzeyle
   birlikte kıvrılır — çıkan harf üst kenara sarılıp arkaya yatar
   (translateY + rotateX), yeni harf alt kenardan yatık gelip düzleşir.
   Aynı anda yüzey damarı da (CSS ::before) aynı yönde akar. Kök
   tekerlerinde harf DÖNMEZ; yalnız bağlı biçim değişirse yumuşak
   geçişle tazelenir. */
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
        if (!yuvarlan) {                     /* kök: sadece biçim tazelenir */
            harfEl.style.transition = 'opacity .14s ease';
            harfEl.style.opacity = '0.25';
            setTimeout(function () { koy(); harfEl.style.opacity = '1'; }, 150);
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
        }, 180);
    }, gecikme);
    return true;
}

/* Adımın hangi tarafta hangi kelimeyi gösterdiğini çözer:
   adim 0 → iki taraf da çıplak kök; tek sayı → yalnız Arapça kelime;
   çift sayı → aynı kelimenin Türkçesi de türemiş. */
function kcDurumCoz() {
    var kok = KC_VERI[S.kok], arKel = null, trKel = null;
    if (S.adim > 0) {
        arKel = kok.kelimeler[Math.ceil(S.adim / 2) - 1];
        if (S.adim % 2 === 0) trKel = arKel;
    }
    return { kok: kok, ar: arKel, tr: trKel };
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

/* Söz karesini KAPATIR ve bekleyen zamanlayıcının biletini yakar.
   Her adım değişiminde ilk iş budur: kullanıcı ileri/geri bastığında
   ekran önce teker karesine dönsün, sonra yeni harfler yuvarlansın. */
function kcBirlesikKapat() {
    S.bTok++;
    if (!S.birlesik) return;
    S.birlesik = false;
    var kitap = document.querySelector('.kc-kitap');
    if (kitap) kitap.classList.remove('kc-birlesik');
}

/* Harfler yerine oturduktan sonra çağrılır. Bilet hâlâ geçerliyse
   (arada tuşa basılmadıysa) tekerler söner, söz madalyonu belirir. */
function kcBirlestir(bilet) {
    if (bilet !== S.bTok || !S.son || !S.son.arSoz) return;
    S.birlesik = true;
    kcSozSigdir();
    var kitap = document.querySelector('.kc-kitap');
    if (kitap) kitap.classList.add('kc-birlesik');
}

function kcGuncelle(ilk, yon) {
    kcBirlesikKapat();
    var d = kcDurumCoz(), kok = d.kok;
    var isk = kcIskelet(kok), P = isk.kokPoz;
    if (kcTekerKur(isk)) ilk = true;      /* şerit yenilendiyse hepsi yuvarlansın */
    var trHedef = [], arHedef = [], trSert = [], i;
    for (i = 0; i < isk.n; i++) { trHedef.push(''); arHedef.push(''); trSert.push(false); }
    if (d.tr) {
        var trK = d.tr.trKok || kok.trKok;
        var trH = kcTrKutular(d.tr);
        var trYer = kcYerles(trH, trK, isk);
        if (!trYer) return;                                  /* veri sigortası */
        for (i = 0; i < isk.n; i++) if (trYer[i] >= 0) trHedef[i] = trH[trYer[i]];
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
        var arYer = kcYerles(seg.map(function (s) { return s.b; }), kok.arKok, isk);
        if (!arYer) return;                                  /* veri sigortası */
        var arB = kcArBicimli(seg);
        for (i = 0; i < isk.n; i++) if (arYer[i] >= 0) arHedef[i] = arB[arYer[i]];
    } else {
        var kb = kcArBicim(kok.arKok);
        arHedef[P[0]] = kb[0]; arHedef[P[1]] = kb[1]; arHedef[P[2]] = kb[2];
    }
    /* SÖZ MADALYONU İÇERİĞİ: yalnız kelimenin hem Arapçası hem
       Türkçesi ekrandayken (çift adım) anlamlıdır. Harfler kelimenin
       kendi sırasındadır; kök / zâid / sertleşen ayrımı tekerlerdeki
       renklerin birebir aynısıdır. Arapça yüz "tam" (harekeli, doğal)
       yazımdan gelir: tarayıcı harfleri kendisi bağlar, kaşide yok. */
    var arSoz = '', trSoz = '', anlam = '', emoji = '';
    if (d.ar && d.tr && arYer && trYer) {
        var arKokIdx = [arYer[P[0]], arYer[P[1]], arYer[P[2]]];
        arSoz = seg.map(function (s, idx) {
            return '<span class="kc-sz' + (arKokIdx.indexOf(idx) >= 0 ? ' kok' : '') +
                   '">' + s.b + s.m + '</span>';
        }).join('');
        var trKokIdx = [trYer[P[0]], trYer[P[1]], trYer[P[2]]];
        trSoz = trH.map(function (h, idx) {
            var kk = trKokIdx.indexOf(idx);
            return '<span class="kc-sz' +
                   (kk < 0 ? '' : (trO && trO.sert[kk] ? ' kok sert' : ' kok')) +
                   '">' + h + '</span>';
        }).join('');
        anlam = d.ar.anlam || '';
        emoji = KC_BALON[(Math.ceil(S.adim / 2) - 1 + S.kok) % KC_BALON.length];
    }
    kcSozYaz(arSoz, trSoz, emoji, anlam);

    /* Harfler yazılmadan ÖNCE sütun enleri ayarlanır: kutu genişliği ile
       harf puntosu aynı karede değişsin, iki aşamalı zıplama olmasın. */
    S.son = { ar: arHedef, tr: trHedef, isk: isk, arSoz: arSoz };
    kcSutunOlc(arHedef, trHedef, isk);
    var trT = document.getElementById('kcTrTeker').children;
    var arT = document.getElementById('kcArTeker').children;
    var g = 0, kokMu;
    for (i = 0; i < isk.n; i++) {
        kokMu = P.indexOf(i) >= 0;
        if (kcTekerYaz(trT[i], trHedef[i], yon, g * 26, ilk || !kokMu, trSert[i])) g++;
        if (kcTekerYaz(arT[i], arHedef[i], yon, g * 26, ilk || !kokMu)) g++;
    }
    /* HEM ARAPÇASI HEM TÜRKÇESİ ekrandaysa kelime tamamlanmıştır:
       tekerler durduktan hemen sonra boşluklar kapanır, kelime birleşik
       hâliyle okunur. Bekleme, en geç dönen tekerin duruşuna göre
       hesaplanır (g*26 gecikme + kcTekerYaz'ın 180+250'lik dönüşü).
       Bilet (S.bTok) sayesinde arada tuşa basılırsa bu kare hiç açılmaz. */
    if (d.ar && d.tr) {
        var bilet = S.bTok;
        setTimeout(function () { kcBirlestir(bilet); }, g * 26 + 620);
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
    S.kilit = true;
    kcSes();
    var n = KC_VERI[S.kok].kelimeler.length * 2 + 1;
    S.adim = (S.adim + yon + n) % n;
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
            yon = e.shiftKey ? -1 : 1;
        }
        if (!yon) return;
        e.preventDefault();
        kcDondur(yon);
    }, false);
}

function kcKokSec(i) {
    if (S.kilit || !KC_VERI[i]) return;
    S.kilit = true;
    S.bekleyen = 0;          /* yeni kök = temiz sayfa; eski basışlar taşınmaz */
    kcSes();
    S.kok = i;
    S.adim = 0;
    var tus = document.querySelectorAll('#kcKokler .kc-kok');
    for (var j = 0; j < tus.length; j++) tus[j].classList.toggle('secili', j === i);
    kcGuncelle(true, 1);
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
    { ad: 'İsm-i Mekân', kok: ['ك','ت','ب'], okunus: 'mekteb', anlam: 'yazı yeri, okul',
      slot: [ {v:'مَ', w:'مَ', z:1}, {v:'فْ', w:'كْ'}, {v:'عَ', w:'تَ'}, {v:'ل', w:'ب'} ] },
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
            cik.push((oncekiBaglar ? 'ـ' : '') + h + (kendiBaglar ? 'ـ' : ''));
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
        '  <span class="kcv-tr"><b>' + k.okunus + '</b> · ' + k.anlam + '</span>' +
        '  <span class="kcv-ucus" aria-hidden="true">' + ucus + '</span>' +
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
        KC_VP_ZAM = setTimeout(function () { var s = kcvUcur(kart); if (oto) kcvZincir(s); }, 360);
    } else {
        var s = kcvUcur(kart);      /* büyük karta yeniden dokunmak = tekrar oynat */
        if (oto) kcvZincir(s);
    }
}

/* Büyüyen kartı ızgaradaki yerine geri gönderir. */
function kcvKucult(per) {
    per = per || document.getElementById('kcVezinPop');
    if (!per) return;
    clearTimeout(KC_VP_ZAM);
    var b = per.querySelectorAll('.kcv-kart.buyuk');
    for (var i = 0; i < b.length; i++) { b[i].classList.remove('buyuk'); b[i].classList.remove('oynat'); }
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

/* İleri/geri tuşu: elle yürütme otomatiği durdurur. */
function kcvAdim(yon) {
    kcvOynatDur();
    kcvGit((KC_VP_SIRA < 0 ? (yon > 0 ? -1 : 0) : KC_VP_SIRA) + yon, false);
}

/* Animasyon bitince kartı kapat, bir nefes bekle, sıradakine geç. */
function kcvZincir(sure) {
    clearTimeout(KC_VP_ZINCIR);
    if (!KC_VP_OYNAT) return;
    var bekle = kcvAzHareket() ? 2200 : Math.round((sure + 1.9) * 1000);
    KC_VP_ZINCIR = setTimeout(function () {
        if (!KC_VP_OYNAT) return;
        kcvKucult();                                   /* vezin kapanır */
        KC_VP_ZINCIR = setTimeout(function () {
            if (!KC_VP_OYNAT) return;
            if (KC_VP_SIRA + 1 >= KC_VEZIN_TABLO.length) { kcvOynatDur(); return; }
            kcvGit(KC_VP_SIRA + 1, true);              /* sıradaki vezin */
        }, 460);
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
function kcvUcur(kart) {
    if (!kart) return 0;
    var ucus = kart.querySelector('.kcv-ucus');
    if (!ucus) return 0;
    var vz  = kart.querySelectorAll('.kcv-vezin .kcv-z');
    var kz  = kart.querySelectorAll('.kcv-kelime .kcv-z');
    var dus = ucus.querySelectorAll('.kcv-dus');
    var kr  = kart.getBoundingClientRect();
    var n = Math.min(vz.length, kz.length, dus.length), i;

    for (i = 0; i < n; i++) {
        var a = vz[i].getBoundingClientRect();      /* kaynak: vezindeki harf */
        var h = kz[i].getBoundingClientRect();      /* hedef : kelimedeki yeri */
        var d = dus[i];
        d.style.left = (a.left - kr.left + a.width  / 2).toFixed(1) + 'px';
        d.style.top  = (a.top  - kr.top  + a.height / 2).toFixed(1) + 'px';
        d.style.setProperty('--dx', ((h.left + h.width  / 2) - (a.left + a.width  / 2)).toFixed(1) + 'px');
        d.style.setProperty('--dy', ((h.top  + h.height / 2) - (a.top  + a.height / 2)).toFixed(1) + 'px');
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
                       olcu: kcOlcu, sert: KC_SERT, bicim: kcArBicim, parcala: kcArParcala,
                       /* kutular: bir kelimenin Türkçe KUTULARI (harf ≠ kutu;
                          bkz. trKutu). Testler de buradan okusun ki iskelet ile
                          denetim aynı kutulamayı görsün. */
                       kutular: kcTrKutular };
})();
