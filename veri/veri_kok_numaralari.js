/* ============================================================================
   KIDEF ARAPÇA — KÖK VE ÇEKİM NUMARALARI
   ----------------------------------------------------------------------------
   Sitedeki her çekimli kelimeye TEK bir adres veren numara sistemi:

          كَتَبْتُ   →   014 · 001 · 13
                         │     │     └── SIGA  : Müfred Mütekellim (ben)
                         │     └──────── KALIP : فَعَلَ (1. bab mazi) — KALIP_DATA
                         └────────────── KÖK   : ك ت ب

   ÜÇ NUMARA, ÜÇ KAYNAK
   --------------------
   KÖK   : bu dosyadaki KOK_NO tablosu (001–250).
           Sıra, veri_kokler.js içindeki YAZIM sırasıdır. Bu numaralar
           SABİTTİR: yeni kök eklendiğinde listenin SONUNA eklenir, aradaki
           hiçbir numara kaymaz. Çünkü numaralar basılı materyalde (berat
           PDF'i, sınıf etkinlikleri) yer alacak; kayarsa kâğıt geçersizleşir.
   KALIP : veri_vezin_numaralari.js içindeki KALIP_DATA (1–105). Zaten vardı.
   SIGA  : sigaSablonlari sırasıdır (1–15); هُوَ=1 … أَنَا=13.

   EBCED (hesab-ı cümel)
   ---------------------
   Kökün ikinci, "gizli" değeri. ك20 + ت400 + ب2 = 422.
   DİKKAT: ebced harf SIRASINI görmez, bu yüzden BENZERSİZ DEĞİLDİR —
   250 kökün 97'si çakışır (39 ayrı değerde) (علم/عمل ikisi de 140; ملك/كمل/كلم üçü de 90).
   Bu yüzden ebced kimlik numarası olarak KULLANILMAZ; yalnızca bulmaca
   katmanıdır ve çakışma orada kusur değil, kasıtlı tuzaktır.
   Köklerde hemze hangi kürsüde olursa olsun (ء أ إ آ ؤ ئ) elif sayılır (=1),
   çünkü kökün aslî harfi hemzedir, kürsü yalnızca imlâdır.
   ============================================================================ */

/* Kök numaraları — veri_kokler.js yazım sırası (250 kök).
   Liste, veri_kokler.js içindeki wordEasterEggs nesnesinin BİRİNCİ SEVİYE
   anahtarları taranarak üretildi (girinti değil, süslü parantez derinliği
   esas alındı; dosyada girinti tutarsız). SONA EKLE, ARAYA GİRME. */
const KOK_NO = {
    "نول": 1,
    "نصف": 2,
    "كفر": 3,
    "برء": 4,
    "عهد": 5,
    "عشر": 6,
    "تسع": 7,
    "ثمن": 8,
    "ثني": 9,
    "ثلث": 10,
    "أثر": 11,
    "ألف": 12,
    "أذن": 13,
    "كتب": 14,
    "علم": 15,
    "قدر": 16,
    "كمل": 17,
    "ملك": 18,
    "حكم": 19,
    "عرف": 20,
    "رحم": 21,
    "سلم": 22,
    "خبر": 23,
    "فتح": 24,
    "نظم": 25,
    "شهد": 26,
    "خلق": 27,
    "سجد": 28,
    "صدق": 29,
    "حسد": 30,
    "دخل": 31,
    "ركب": 32,
    "نقل": 33,
    "شرب": 34,
    "روع": 35,
    "سفر": 36,
    "سيح": 37,
    "عقل": 38,
    "عصم": 39,
    "قرب": 40,
    "طبق": 41,
    "خلف": 42,
    "خرج": 43,
    "عمل": 44,
    "يقظ": 45,
    "درس": 46,
    "حفظ": 47,
    "نظر": 48,
    "مكن": 49,
    "حسن": 50,
    "سدس": 51,
    "سعد": 52,
    "جهل": 53,
    "سكن": 54,
    "جهد": 55,
    "رجع": 56,
    "شكل": 57,
    "نسب": 58,
    "حصل": 59,
    "برك": 60,
    "بقي": 61,
    "بصر": 62,
    "رسل": 63,
    "نصر": 64,
    "حمل": 65,
    "حقق": 66,
    "خلص": 67,
    "خمس": 68,
    "رشد": 69,
    "أمن": 70,
    "جمع": 71,
    "حمد": 72,
    "شهر": 73,
    "شكر": 74,
    "فكر": 75,
    "وكل": 76,
    "قدم": 77,
    "كبر": 78,
    "عدل": 79,
    "فعل": 80,
    "شدد": 81,
    "أكل": 82,
    "سأل": 83,
    "قول": 84,
    "بيع": 85,
    "دعو": 86,
    "مشي": 87,
    "رضي": 88,
    "وقي": 89,
    "عدد": 90,
    "صلي": 91,
    "سوي": 92,
    "وصل": 93,
    "خير": 94,
    "وضأ": 95,
    "عون": 96,
    "وفي": 97,
    "وجد": 98,
    "قرأ": 99,
    "حرم": 100,
    "عرض": 101,
    "قبل": 102,
    "كرم": 103,
    "عبر": 104,
    "عمر": 105,
    "لزم": 106,
    "لبس": 107,
    "لفظ": 108,
    "هدي": 109,
    "هجر": 110,
    "همم": 111,
    "يقن": 112,
    "يسر": 113,
    "يتم": 114,
    "بحث": 115,
    "ترك": 116,
    "تبع": 117,
    "تجر": 118,
    "ثبت": 119,
    "ثمر": 120,
    "ثقل": 121,
    "ذكر": 122,
    "ذهب": 123,
    "ذوق": 124,
    "زرع": 125,
    "صور": 126,
    "رتب": 127,
    "زور": 128,
    "نفع": 129,
    "نطق": 130,
    "سرع": 131,
    "نور": 132,
    "ظلم": 133,
    "نفس": 134,
    "جري": 135,
    "حضر": 136,
    "صحب": 137,
    "لحق": 138,
    "طلب": 139,
    "صلح": 140,
    "بين": 141,
    "وقف": 142,
    "خدم": 143,
    "غفل": 144,
    "حزن": 145,
    "موت": 146,
    "طرد": 147,
    "خصص": 148,
    "شعر": 149,
    "حبب": 150,
    "حسب": 151,
    "عود": 152,
    "قوم": 153,
    "رسم": 154,
    "نصح": 155,
    "سبع": 156,
    "سبق": 157,
    "صوب": 158,
    "رزق": 159,
    "لعب": 160,
    "صبر": 161,
    "غيب": 162,
    "ضرر": 163,
    "ظنن": 164,
    "نتج": 165,
    "ثقف": 166,
    "وجه": 167,
    "ضرب": 168,
    "جمل": 169,
    "حيي": 170,
    "طلع": 171,
    "عمم": 172,
    "ضلل": 173,
    "حرك": 174,
    "روح": 175,
    "عبد": 176,
    "صنع": 177,
    "ضمن": 178,
    "شغل": 179,
    "وزن": 180,
    "قسم": 181,
    "عقد": 182,
    "دفع": 183,
    "غلب": 184,
    "غفر": 185,
    "جلس": 186,
    "قطع": 187,
    "وثق": 188,
    "شرك": 189,
    "عفو": 190,
    "ظفر": 191,
    "قدس": 192,
    "زحم": 193,
    "سمع": 194,
    "نسي": 195,
    "صفو": 196,
    "غرب": 197,
    "قلب": 198,
    "وصي": 199,
    "نزل": 200,
    "رجو": 201,
    "كلم": 202,
    "ظهر": 203,
    "رفع": 204,
    "فضل": 205,
    "فرد": 206,
    "فهم": 207,
    "سمح": 208,
    "أمر": 209,
    "بدأ": 210,
    "أخذ": 211,
    "خطأ": 212,
    "شرق": 213,
    "صغر": 214,
    "خفف": 215,
    "غلو": 216,
    "رخص": 217,
    "طير": 218,
    "سير": 219,
    "قطر": 220,
    "طبب": 221,
    "حدث": 222,
    "بطأ": 223,
    "طرق": 224,
    "قلل": 225,
    "كثر": 226,
    "ضوء": 227,
    "مرر": 228,
    "سوق": 229,
    "نوع": 230,
    "نوم": 231,
    "طعم": 232,
    "رحب": 233,
    "ربع": 234,
    "وحد": 235,
    "عين": 236,
    "أنف": 237,
    "شمل": 238,
    "جنب": 239,
    "وسط": 240,
    "وقع": 241,
    "قلع": 242,
    "أرخ": 243,
    "سور": 244,
    "ركز": 245,
    "بعد": 246,
    "دور": 247,
    "قشط": 248,
    "عرج": 249,
    "جدد": 250,

    /* 251 – 300 · ikinci parti (sâlim kökler) */
    "كسب": 251,
    "غضب": 252,
    "فرح": 253,
    "ضحك": 254,
    "عجب": 255,
    "ندم": 256,
    "رغب": 257,
    "رهب": 258,
    "خشع": 259,
    "نفق": 260,
    "بخل": 261,
    "كنز": 262,
    "سرق": 263,
    "كذب": 264,
    "غرق": 265,
    "سبح": 266,
    "عجل": 267,
    "كسل": 268,
    "نشط": 269,
    "هرب": 270,
    "نجح": 271,
    "شرح": 272,
    "كشف": 273,
    "درك": 274,
    "سطر": 275,
    "رقم": 276,
    "خطب": 277,
    "فقد": 278,
    "جهر": 279,
    "همس": 280,
    "عرب": 281,
    "صرف": 282,
    "نصب": 283,
    "خفض": 284,
    "جزم": 285,
    "صمت": 286,
    "فرق": 287,
    "بدل": 288,
    "حذف": 289,
    "ضبط": 290,
    "فصح": 291,
    "برد": 292,
    "سخن": 293,
    "زهر": 294,
    "نبت": 295,
    "حصد": 296,
    "حرث": 297,
    "غرس": 298,
    "لمس": 299,
    "طهر": 300,
    "رود": 301
};

/* ---------------------------------------------------------------------------
   Ebced (hesab-ı cümel) harf değerleri — meşrikî (Anadolu'da öğretilen) dizim.
   --------------------------------------------------------------------------- */
const EBCED_HARF = {
    'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
    'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80,
    'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600,
    'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
    /* Hemze her kürsüde elif sayılır; ة → ه, ى → ي. */
    'ء': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ؤ': 1, 'ئ': 1, 'ة': 5, 'ى': 10
};

/* ---------------------------------------------------------------------------
   Bab (VERB_FORMS) → KALIP_DATA numarası.
   Mücerret bablarda numara mazi/muzari harekesine göre değişir; bu yüzden
   anahtar "I-a-u" biçiminde kurulur. Mezid bablar tek anahtardır.
   Şu an sarf.js yalnız I, II ve V kullanıyor; kalanlar ileride kök
   eklendiğinde hazır dursun diye baştan yazıldı.
   --------------------------------------------------------------------------- */
const BAB_KALIP = {
    'I-a-u': { madi: 1, mudari: 2, amr: 3 },      /* فَعَلَ – يَفْعُلُ – أُفْعُلْ  */
    'I-a-i': { madi: 1, mudari: 4, amr: 5 },      /* فَعَلَ – يَفْعِلُ – اِفْعِلْ  */
    'I-a-a': { madi: 1, mudari: 6, amr: 7 },      /* فَعَلَ – يَفْعَلُ – اِفْعَلْ  */
    'I-i-a': { madi: 8, mudari: 9, amr: 10 },     /* فَعِلَ – يَفْعَلُ – اِفْعَلْ  */
    'I-u-u': { madi: 11, mudari: 12, amr: 13 },   /* فَعُلَ – يَفْعُلُ – أُفْعُلْ  */
    'I-i-i': { madi: 14, mudari: 15, amr: 16 },   /* فَعِلَ – يَفْعِلُ – اِفْعِلْ  */
    'IV':    { madi: 52, mudari: 53, amr: 54 },   /* إِفْعَال    */
    'II':    { madi: 58, mudari: 59, amr: 60 },   /* تَفْعِيل    */
    'III':   { madi: 64, mudari: 65, amr: 66 },   /* مُفَاعَلَة   */
    'VII':   { madi: 71, mudari: 72, amr: 73 },   /* اِنْفِعَال   */
    'VIII':  { madi: 77, mudari: 78, amr: 79 },   /* اِفْتِعَال   */
    'IX':    { madi: 83, mudari: 84, amr: 85 },   /* اِفْعِلَال   */
    'V':     { madi: 88, mudari: 89, amr: 90 },   /* تَفَعُّل     */
    'VI':    { madi: 94, mudari: 95, amr: 96 },   /* تَفَاعُل    */
    'X':     { madi: 100, mudari: 101, amr: 102 } /* اِسْتِفْعَال */
};

/* ---------------------------------------------------------------------------
   Zamir → sıga numarası (sigaSablonlari sırası, 1–15).
   Oyun tablosu 5 zamirle çalışıyor ama numaralar TAM listeye göre veriliyor;
   böylece kâğıt ile site arasındaki numara aynı kalıyor.
   --------------------------------------------------------------------------- */
const ZAMIR_SIGA = {
    'هُوَ': 1, 'هِيَ': 4, 'أَنْتَ': 7, 'أَنْتِ': 10, 'أَنا': 13, 'أَنَا': 13,
    'نَحْنُ': 14
};

const KokNo = {

    /* Hareke, tenvin, şedde, tatvil ve boşlukları atar: "ك ت ب" → "كتب" */
    sadelestir(kok) {
        return String(kok || '')
            .replace(/[ً-ٰٟۖ-ۭـ]/g, '')
            .replace(/\s+/g, '');
    },

    /* Kökün sıra numarası. Tabloda yoksa 0 döner (rozet basılmaz). */
    no(kok) {
        return KOK_NO[this.sadelestir(kok)] || 0;
    },

    /* Rozette görünen üç haneli biçim: 14 → "014". Yoksa "" döner. */
    rakam(kok) {
        const n = this.no(kok);
        return n ? String(n).padStart(3, '0') : '';
    },

    /* Ebced (hesab-ı cümel) değeri: كتب → 422 */
    ebced(kok) {
        const s = this.sadelestir(kok);
        let t = 0;
        for (let i = 0; i < s.length; i++) t += (EBCED_HARF[s[i]] || 0);
        return t;
    },

    /* Aynı ebced değerini paylaşan diğer kökler (bulmacadaki tuzak).
       Kökün kendisi listeye girmez. */
    ebcedIkizleri(kok) {
        const hedef = this.ebced(kok), ben = this.sadelestir(kok), liste = [];
        for (const k in KOK_NO) if (k !== ben && this.ebced(k) === hedef) liste.push(k);
        return liste;
    },

    /* Numaradan köke dönüş (bulmaca çözerken lazım): 14 → "كتب" */
    nodanKok(no) {
        const n = parseInt(no, 10);
        for (const k in KOK_NO) if (KOK_NO[k] === n) return k;
        return '';
    },

    /* VERB_FORMS kaydı → BAB_KALIP anahtarı */
    babAnahtari(vf) {
        if (!vf) return '';
        return vf.bab === 'I' ? ('I-' + (vf.past || 'a') + '-' + (vf.pres || 'u')) : vf.bab;
    },

    /* Zamanın kalıp numarası: (VERB_FORMS kaydı, 'madi'|'mudari'|'amr') → 1..105 */
    kalipNo(vf, zaman) {
        const t = BAB_KALIP[this.babAnahtari(vf)];
        return (t && t[zaman]) ? t[zaman] : 0;
    },

    /* Kalıbın Arapça vezni ve Türkçe adı (KALIP_DATA'dan). */
    kalipBilgi(no) {
        if (typeof KALIP_DATA === 'undefined' || !KALIP_DATA[no]) return { ar: '', tr: '' };
        return KALIP_DATA[no];
    },

    /* Bir çekim satırının tam adresi.
       kok: "ك ت ب" · vf: VERB_FORMS[kok] · zaman: 'madi' · zamir: "أَنا"
       →  { kok:14, kalip:1, siga:13, metin:"014·001·13" }
       Numaralardan biri bilinmiyorsa metin "" döner (rozet hiç basılmaz). */
    cekimAdresi(kok, vf, zaman, zamir) {
        const k = this.no(kok);
        const v = this.kalipNo(vf, zaman);
        const s = ZAMIR_SIGA[String(zamir || '').replace(/\s+/g, '')] || 0;
        const tam = (k && v && s)
            ? String(k).padStart(3, '0') + '·' + String(v).padStart(3, '0') + '·' + String(s).padStart(2, '0')
            : '';
        return { kok: k, kalip: v, siga: s, metin: tam };
    }
};

/* Tarayıcı konsolundan da denenebilsin (bulmaca hazırlarken işe yarıyor). */
if (typeof window !== 'undefined') { window.KokNo = KokNo; window.KOK_NO = KOK_NO; }
