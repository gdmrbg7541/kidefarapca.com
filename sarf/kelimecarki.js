/* ======================================================================
   KELİME ÇARKI (عَجَلَةُ الْكَلِمَاتِ) — vezin mantığı simülasyonu
   ----------------------------------------------------------------------
   Kitabın iki sayfası ALT ALTA durur: ÜSTTE Arapça (sağdan sola 10
   teker), ALTTA Türkçe (soldan sağa 10 teker). Ekran dikey kaydırma
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
   HİZA SİSTEMİ: 11 SÜTUN vardır; j. sütunda ÜSTTE Arapça (12-j). poz,
   ALTTA Türkçe j. poz durur (Arapça şerit ters dizildiği için). 1.
   sütunun üstü ve 11. sütunun altı HİZA PAYIDIR; teker arası boşluk
   sabittir ve her şerit ortalanır. Böylece 3 önek / 2 sonek farkına
   rağmen üstteki (sağdan sola) ve alttaki (soldan sağa) 4-6-8. KÖK
   tekerleri aynı düşey hizada buluşur.
   SÜTUN ENİ DEĞİŞKENDİR (kcSutunOlc): dolu sütun harfin gerçek eni
   kadar geniş, BOŞ sütun (çoğunlukla 1-3 ve 9-10) dardır. Sütunun eni
   iki taraftaki harflerin GENİŞ OLANINDAN gelir — geniş bir Arapça kök
   harfinin altındaki Türkçe kutu kendiliğinden aynı ende olur. Boş
   sütunlardan kazanılan yer HARF PUNTOSUNA gider: akıllı tahtada
   harfler 12rem çıkar.
   Teker = yola değen yüzü ekrana bakan açık renkli ahşap/kâğıt
   SİLİNDİR; daire görünmez, harf kutusuz, doğrudan yüzeyin üstünde
   durur. Kök ve ek tekerleri AYNI boydadır; ayrım renktedir.
   4-6-8. tekerlerde KÖK harfleri SİYAH ve SABİT durur; oklarla çark
   döndükçe yalnız aradaki KIRMIZI ek harfler değişir ve aynı kökten
   yeni kelimeler türer (kitap → kâtip → mektep → mektup).
   Üstte yatay kayan kök şeridi vardır; bir köke tıklanınca o kök
   aşağıdaki 4-6-8. tekerlere iner.
   sarf.js'e DOKUNMAZ: kart tıklaması App'in genel yönlendirmesiyle
   ekranı gösterir (data-goto="kc-screen"), içerik burada kurulur.
   ====================================================================== */
(function () {
'use strict';

/* ---------------- VERİ: 6 kök × 4 kelime ----------------
   Her kelimede vezin (Arap kalıbı + Türkçe okunuşu) ve kısa anlam var;
   böylece aynı kökte vezin değişince anlamın nasıl değiştiği görülür. */
var KC_VERI = [
    { arKok: ['ك', 'ت', 'ب'], trKok: ['k', 't', 'p'], arGoster: 'كـ ـتـ ـب', anlam: 'yazmak',
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
    { arKok: ['ح', 'ف', 'ظ'], trKok: ['h', 'f', 'z'], arGoster: 'حـ ـفـ ـظ', anlam: 'korumak',
      kelimeler: [
        { tr: 'hıfz',    ar: 'حفظ',    tam: 'حِفْظ',     vezinAr: 'فِعْل',    vezinTr: 'fiʿl',    anlam: 'koruma · ezber' },
        { tr: 'hafız',   ar: 'حافظ',   tam: 'حَافِظ',    vezinAr: 'فَاعِل',   vezinTr: 'fâil',    anlam: 'ezberinde tutan' },
        { tr: 'muhafız', ar: 'محافظ',  tam: 'مُحَافِظ',  vezinAr: 'مُفَاعِل', vezinTr: 'mufâʿil', anlam: 'koruyucu' },
        { tr: 'mahfuz',  ar: 'محفوظ',  tam: 'مَحْفُوظ',  vezinAr: 'مَفْعُول', vezinTr: 'mefʿûl',  anlam: 'korunmuş' } ] },
    { arKok: ['ن', 'ظ', 'ر'], trKok: ['n', 'z', 'r'], arGoster: 'نـ ـظـ ـر', anlam: 'bakmak',
      kelimeler: [
        { tr: 'nazar',   ar: 'نظر',    tam: 'نَظَر',     vezinAr: 'فَعَل',    vezinTr: 'feʿal',   anlam: 'bakış' },
        { tr: 'nâzır',   ar: 'ناظر',   tam: 'نَاظِر',    vezinAr: 'فَاعِل',   vezinTr: 'fâil',    anlam: 'bakan kişi' },
        { tr: 'manzara', ar: 'منظرة',  tam: 'مَنْظَرَة', vezinAr: 'مَفْعَلَة', vezinTr: 'mefʿale', anlam: 'bakılan yer' },
        { tr: 'nezaret', ar: 'نظارة',  tam: 'نَظَارَة',  vezinAr: 'فَعَالَة', vezinTr: 'feʿâle',  anlam: 'gözetim' } ] },
    { arKok: ['خ', 'ب', 'ر'], trKok: ['h', 'b', 'r'], arGoster: 'خـ ـبـ ـر', anlam: 'haber vermek',
      kelimeler: [
        { tr: 'haber',   ar: 'خبر',    tam: 'خَبَر',     vezinAr: 'فَعَل',    vezinTr: 'feʿal',   anlam: 'bildirilen şey' },
        { tr: 'ihbar',   ar: 'إخبار',  tam: 'إِخْبَار',  vezinAr: 'إِفْعَال', vezinTr: 'ifʿâl',   anlam: 'haber verme' },
        { tr: 'muhbir',  ar: 'مخبر',   tam: 'مُخْبِر',   vezinAr: 'مُفْعِل',  vezinTr: 'mufʿil',  anlam: 'haber veren' },
        { tr: 'muhabir', ar: 'مخابر',  tam: 'مُخَابِر',  vezinAr: 'مُفَاعِل', vezinTr: 'mufâʿil', anlam: 'haberleşen kişi' } ] }
];

/* Arapçada kendinden SONRAKİ harfe bitişmeyen harfler (sağdan bitişir,
   sola el vermez). Teker yüzündeki bağlı biçimler bununla hesaplanır. */
var KC_BITISMEZ = 'اأإآدذرزوؤةىء';

var KC_OK_YUKARI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.6l7.4 8.5h-4.5v6.3H9.1v-6.3H4.6z"/></svg>';
var KC_OK_ASAGI  = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19.4L4.6 10.9h4.5V4.6h5.8v6.3h4.5z"/></svg>';

function kcHarfler(s) { return Array.from(s); }

/* Kelimenin harflerini 10 tekere yerleştirir: kök harfler 4-6-8'e,
   kökten önceki harfler 1-3'e (sağa yaslı), kök aralarına birer harf
   (5 ve 7), kökten sonrakiler 9-10'a. Dönen dizi: teker → harf sırası
   (yoksa -1). Sığmayan kelime null döner (veri hatasına karşı sigorta). */
function kcYerles(harfler, kok) {
    var ki = [], j = 0, i;
    for (i = 0; i < harfler.length && j < 3; i++)
        if (harfler[i] === kok[j]) { ki.push(i); j++; }
    if (j < 3) return null;
    var once = ki[0], a1 = ki[1] - ki[0] - 1, a2 = ki[2] - ki[1] - 1,
        sonra = harfler.length - 1 - ki[2];
    if (once > 3 || a1 > 1 || a2 > 1 || sonra > 2) return null;
    var d = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    for (i = 0; i < once; i++) d[3 - once + i] = i;
    d[3] = ki[0];
    if (a1) d[4] = ki[0] + 1;
    d[5] = ki[1];
    if (a2) d[6] = ki[1] + 1;
    d[7] = ki[2];
    for (i = 0; i < sonra; i++) d[8 + i] = ki[2] + 1 + i;
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
var S = { kok: 0, adim: 0, kilit: false, kurulu: false, son: null, bekleyen: 0 };

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
    kcEnBellek[metin] = w;
    return w;
}

/* Verilen "boş göz eni" (dar) için iki şeridin 11 gözünü de hesaplar.
   Dönüş: { t: [11], a: [11], toplam } — hepsi punto=1 birimindedir.
     t[j] → Türkçe şeritte j. sütun (j=0..9 rulo, j=10 görünmez pay)
     a[j] → Arapça şeritte j. sütun (j=0 görünmez pay, j=1..10 rulo)
   Kural: 3..7 (yani 4-8. sütun) çiftler halinde eşitlenir; 0..2 ve
   8..10 blokları serbesttir, yalnız blok toplamları eşitlenir. */
function kcOlcHesap(nT, nA, dar) {
    var t = [], a = [], j, tt, at, h;
    for (j = 0; j < 11; j++) {
        t.push(nT[j] > 0 ? nT[j] + 2 * KC_YAN : dar);
        a.push(nA[j] > 0 ? nA[j] + 2 * KC_YAN : dar);
    }
    /* ORTA KUŞAK: kök sütunları — simetri burada zorunlu */
    for (j = 3; j <= 7; j++) { h = Math.max(t[j], a[j]); t[j] = a[j] = h; }
    /* SOL blok: yalnız toplam eşitlenir, fazlalık en soldaki göze */
    tt = t[0] + t[1] + t[2]; at = a[0] + a[1] + a[2]; h = Math.max(tt, at);
    t[0] += h - tt; a[0] += h - at;
    /* SAĞ blok: yalnız toplam eşitlenir, fazlalık en sağdaki göze */
    tt = t[8] + t[9] + t[10]; at = a[8] + a[9] + a[10]; h = Math.max(tt, at);
    t[10] += h - tt; a[10] += h - at;
    var toplam = 0;
    for (j = 0; j < 11; j++) toplam += t[j];
    return { t: t, a: a, toplam: toplam };
}

function kcSutunOlc(arHedef, trHedef) {
    var kitap = document.querySelector('.kc-kitap');
    var arS = document.getElementById('kcArTeker');
    var trS = document.getElementById('kcTrTeker');
    var pr = kcKalip();
    if (!kitap || !arS || !trS || !pr) return;
    var F = parseFloat(getComputedStyle(pr).fontSize) || 0;
    var g = parseFloat(getComputedStyle(trS).columnGap) || 0;
    var alan = trS.clientWidth - 4 - 10 * g;      /* 11 sütuna kalan net en */
    if (!(F > 0) || !(alan > 0)) return;

    /* İki ayrı ihtiyaç dizisi: artık şeritler birbirini şişirmiyor.
       Türkçe: sütun j+1 → trHedef[j]; 11. sütun paydır (0).
       Arapça: sütun j+1 → arHedef[10-j]; 1. sütun paydır (0). */
    var nT = [], nA = [], j;
    for (j = 0; j < 11; j++) {
        nT.push(j <= 9 ? kcEn(trHedef[j] || '') : 0);
        nA.push(j >= 1 ? kcEn(arHedef[10 - j] || '') : 0);
    }

    var punto = F, dar = KC_DAR, o = kcOlcHesap(nT, nA, KC_DAR);
    if (o.toplam * F > alan) {                    /* sığmıyor: önce boşları daralt */
        if (kcOlcHesap(nT, nA, KC_DAR_ALT).toplam * F > alan) {
            dar = KC_DAR_ALT;                     /* yetmedi: punto küçülsün */
            o = kcOlcHesap(nT, nA, dar);
            punto = alan / o.toplam;
        } else {                                  /* aradaki en geniş "dar"ı bul */
            var lo = KC_DAR_ALT, hi = KC_DAR, i, m;
            for (i = 0; i < 24; i++) {
                m = (lo + hi) / 2;
                if (kcOlcHesap(nT, nA, m).toplam * F <= alan) lo = m; else hi = m;
            }
            dar = lo;
            o = kcOlcHesap(nT, nA, dar);
        }
    }
    if (!(punto > 0)) return;

    var boy = KC_BOY * punto;
    kitap.style.setProperty('--kc-punto', punto.toFixed(2) + 'px');
    /* pay = Arapça şeritte 1. sütun, Türkçe şeritte 11. sütun */
    arS.style.setProperty('--kc-pay', (o.a[0] * punto).toFixed(2) + 'px');
    trS.style.setProperty('--kc-pay', (o.t[10] * punto).toFixed(2) + 'px');
    var a = arS.children, t = trS.children, k;
    for (k = 0; k < 10 && k < t.length && k < a.length; k++) {
        t[k].style.width = (o.t[k] * punto).toFixed(2) + 'px';       /* Türkçe poz k+1 → sütun k+1 */
        t[k].style.height = boy.toFixed(2) + 'px';
        a[k].style.width = (o.a[10 - k] * punto).toFixed(2) + 'px';  /* Arapça poz k+1 → sütun 11-k */
        a[k].style.height = boy.toFixed(2) + 'px';
    }
}

/* Ekran döndüğünde / yazı tipi geç yüklendiğinde son duruma göre tazele */
function kcOlcTazele() { if (S.son) kcSutunOlc(S.son.ar, S.son.tr); }
var kcOlcZaman = null;
window.addEventListener('resize', function () {
    clearTimeout(kcOlcZaman);
    kcOlcZaman = setTimeout(kcOlcTazele, 160);
});
try {
    if (document.fonts && document.fonts.ready)
        document.fonts.ready.then(function () { kcEnBellek = {}; kcOlcTazele(); });
} catch (e) { }

/* ---------------- EKRAN KURULUMU ---------------- */
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
    var teker = function (poz) {
        var kokMu = (poz === 4 || poz === 6 || poz === 8);
        return '<div class="kc-teker ' + (kokMu ? 'kok' : 'ek') + ' kc-bos" data-poz="' + poz + '">' +
            '<div class="kc-yuz"><span class="kc-harf" data-h=""></span></div></div>';
    };
    var tekerler = '';
    for (var p = 1; p <= 10; p++) tekerler += teker(p);
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
        '        <section class="kc-sayfa kc-arapca">' +
        '          <div class="kc-yol"><div class="kc-tekerler kc-rtl" id="kcArTeker">' + tekerler + '</div>' +
        '          <div class="kc-zemin"></div></div>' +
        '        </section>' +
        '        <section class="kc-sayfa kc-turkce">' +
        '          <div class="kc-yol"><div class="kc-tekerler" id="kcTrTeker">' + tekerler + '</div>' +
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
function kcTekerYaz(el, yeni, yon, gecikme, yuvarlan) {
    var harfEl = el.querySelector('.kc-harf');
    var eski = harfEl.dataset.h || '';
    yeni = yeni || '';
    if (eski === yeni) return false;
    var koy = function () {
        harfEl.textContent = yeni;
        harfEl.dataset.h = yeni;
        el.classList.toggle('kc-bos', !yeni);
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
function kcGuncelle(ilk, yon) {
    var d = kcDurumCoz(), kok = d.kok;
    var trHedef = ['', '', '', '', '', '', '', '', '', ''];
    var arHedef = ['', '', '', '', '', '', '', '', '', ''];
    var i;
    if (d.tr) {
        var trH = kcHarfler(d.tr.tr);
        var trYer = kcYerles(trH, kok.trKok);
        if (!trYer) return;                                  /* veri sigortası */
        for (i = 0; i < 10; i++) if (trYer[i] >= 0) trHedef[i] = trH[trYer[i]];
    } else {
        trHedef[3] = kok.trKok[0]; trHedef[5] = kok.trKok[1]; trHedef[7] = kok.trKok[2];
    }
    if (d.ar) {
        var seg = kcArParcala(d.ar.tam);
        var bazlar = seg.map(function (s) { return s.b; });
        if (bazlar.join('') !== d.ar.ar)                     /* hareke sigortası */
            seg = kcHarfler(d.ar.ar).map(function (h) { return { b: h, m: '' }; });
        var arYer = kcYerles(seg.map(function (s) { return s.b; }), kok.arKok);
        if (!arYer) return;                                  /* veri sigortası */
        var arB = kcArBicimli(seg);
        for (i = 0; i < 10; i++) if (arYer[i] >= 0) arHedef[i] = arB[arYer[i]];
    } else {
        var kb = kcArBicim(kok.arKok);
        arHedef[3] = kb[0]; arHedef[5] = kb[1]; arHedef[7] = kb[2];
    }
    /* Harfler yazılmadan ÖNCE sütun enleri ayarlanır: kutu genişliği ile
       harf puntosu aynı karede değişsin, iki aşamalı zıplama olmasın. */
    S.son = { ar: arHedef, tr: trHedef };
    kcSutunOlc(arHedef, trHedef);
    var trT = document.getElementById('kcTrTeker').children;
    var arT = document.getElementById('kcArTeker').children;
    var g = 0, kokMu;
    for (i = 0; i < 10; i++) {
        kokMu = (i === 3 || i === 5 || i === 7);
        if (kcTekerYaz(trT[i], trHedef[i], yon, g * 26, ilk || !kokMu)) g++;
        if (kcTekerYaz(arT[i], arHedef[i], yon, g * 26, ilk || !kokMu)) g++;
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
                if (pv && pv.querySelector('.kcv-kart.buyuk')) kcvKucult(pv);
                else kcVezinPopKapat();
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

/* Hareket duyarlılığı: animasyon yerine sonucu doğrudan gösteririz. */
function kcvAzHareket() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

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
        '  </div>' +
        '  <div class="kcv-govde">' + kartlar + '</div>' +
        '</div>';
    document.body.appendChild(per);

    document.getElementById('kcVpKapat').addEventListener('click', kcVezinPopKapat);
    /* Perdenin boşluğu → pencereyi kapat. Pencerenin boşluğu → yalnız
       büyüyen kartı küçült (tablo açık kalsın). */
    per.addEventListener('click', function (e) { if (e.target === per) kcVezinPopKapat(); });
    var pen = per.querySelector('.kcv-pencere');
    if (pen) pen.addEventListener('click', function (e) {
        var k = kcvKartBul(e.target);
        if (k) { kcvKartAc(k); return; }
        if (per.querySelector('.kcv-kart.buyuk')) kcvKucult(per);
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

/* Bir vezne dokunuldu: kartın konteynırı büyür, sonra animasyon BİR KEZ oynar. */
function kcvKartAc(kart) {
    var per = document.getElementById('kcVezinPop');
    if (!per || !kart) return;
    var pen = per.querySelector('.kcv-pencere');
    var eski = per.querySelector('.kcv-kart.buyuk');
    if (eski && eski !== kart) { eski.classList.remove('buyuk'); eski.classList.remove('oynat'); }
    kcSes();
    clearTimeout(KC_VP_ZAM);

    if (!kart.classList.contains('buyuk')) {
        kart.classList.add('buyuk');
        if (pen) pen.classList.add('odak');
        /* Büyüme geçişi bitmeden ölçüm alınırsa harfler eski yerine uçar;
           onun için uçuş, kart son boyutuna oturduktan sonra başlatılır. */
        KC_VP_ZAM = setTimeout(function () { kcvUcur(kart); }, 360);
    } else {
        kcvUcur(kart);              /* büyük karta yeniden dokunmak = tekrar oynat */
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

/* UÇUŞ ÖLÇÜMÜ — işin özü.
   Zâid harf düz aşağı düşmez: vezindeki yerinden kopar ve KELİMEDE
   duracağı noktaya gider. Kelime satırı o an saydamdır ama yerleşimi
   yapılmıştır, dolayısıyla hedef harfin kutusu ölçülebilir.
   Kaynak merkezi → uçan harfin left/top'u, iki merkez farkı → --dx/--dy. */
function kcvUcur(kart) {
    if (!kart) return;
    var ucus = kart.querySelector('.kcv-ucus');
    if (!ucus) return;
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
    kcvKucult(p);
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

window.KelimeCarki = { ac: kcAc, veri: KC_VERI, yerles: kcYerles, bicim: kcArBicim, parcala: kcArParcala };
})();
