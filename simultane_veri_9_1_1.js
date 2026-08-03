/* 9. sınıf — 9_1_1 (Selamlaşma | التَّحِيَّة) */
/* Cümle & diyalog: komisyon Arapça cümleleri temel alınarak Türkçe okuma sırasına göre hizalandı. */
window.data = {
    sentence: [
        {
            words: [
                { tr: "Selam", order: 1, ar: "السَّلام" },
                { tr: "size olsun", order: 2, ar: "عَلَيْكُم" },
            ]
        },
        {
            words: [
                { tr: "Size de", order: 1, ar: "وَعَلَيْكُم" },
                { tr: "selam olsun", order: 2, ar: "السَّلام" },
            ]
        },
        {
            words: [
                { tr: "Hayırlı", order: 2, ar: "الخَيْر" },
                { tr: "sabahlar", order: 1, ar: "صَباح" },
            ]
        },
        {
            words: [
                { tr: "Nurlu", order: 2, ar: "النّور" },
                { tr: "sabahlar", order: 1, ar: "صَباح" },
            ]
        },
        {
            words: [
                { tr: "Hayırlı", order: 2, ar: "الخَيْر" },
                { tr: "akşamlar", order: 1, ar: "مَساء" },
            ]
        },
        {
            words: [
                { tr: "Nurlu", order: 2, ar: "النّور" },
                { tr: "akşamlar", order: 1, ar: "مَساء" },
            ]
        },
        {
            words: [
                { tr: "Merhaba", order: 1, ar: "مَرْحَبًا" },
                { tr: "sana", order: 2, ar: "بِك" },
            ]
        },
        {
            words: [
                { tr: "Hoş", order: 1, ar: "أَهْلًا" },
                { tr: "geldin", order: 2, ar: "وَسَهْلًا" },
            ]
        },
        {
            words: [
                { tr: "Halin", order: 2, ar: "حالُكَ؟" },
                { tr: "nasıl?", order: 1, ar: "كَيْفَ" },
            ]
        },
        {
            words: [
                { tr: "Ben", order: 1, ar: "أَنا" },
                { tr: "iyiyim,", order: 2, ar: "بِخَيْر،" },
                { tr: "Allah'a şükür.", order: 3, ar: "الـحَمْد لِلّٰه" },
            ]
        },
        {
            words: [
                { tr: "Görüşmek üzere", order: 1, ar: "إِلى اللِّقاء" },
            ]
        },
        {
            words: [
                { tr: "Güle güle", order: 1, ar: "مَع السَّلامَة" },
            ]
        },
        {
            words: [
                { tr: "Allah'a emanet ol", order: 1, ar: "في أَمان اللّٰه" },
            ]
        },
        {
            words: [
                { tr: "Öğretmeni", order: 2, ar: "إِلى المُعَلِّم" },
                { tr: "dinle", order: 1, ar: "اِسْتَمِعْ" },
            ]
        },
        {
            words: [
                { tr: "Kelimeyi", order: 2, ar: "الكَلِمَة" },
                { tr: "deftere", order: 3, ar: "في الدَّفْتَر" },
                { tr: "yaz", order: 1, ar: "اُكْتُب" },
            ]
        },
        {
            words: [
                { tr: "Benden sonra", order: 2, ar: "بَعْدي" },
                { tr: "tekrarla", order: 1, ar: "أَعِدْ" },
            ]
        },
        {
            words: [
                { tr: "Cümleyi", order: 2, ar: "الجُمْلَة" },
                { tr: "yüksek sesle", order: 3, ar: "بِصَوْت عال" },
                { tr: "oku", order: 1, ar: "اِقْرَأْ" },
            ]
        }
    ],
    dialog: [
        {
            p1: [
                { tr: "Selam", order: 1, ar: "السَّلام" },
                { tr: "size olsun", order: 2, ar: "عَلَيْكُم" },
            ],
            p2: [
                { tr: "Size de", order: 1, ar: "وَعَلَيْكُم" },
                { tr: "selam olsun", order: 2, ar: "السَّلام" },
            ]
        },
        {
            p1: [
                { tr: "Hayırlı", order: 2, ar: "الخَيْر" },
                { tr: "sabahlar", order: 1, ar: "صَباح" },
            ],
            p2: [
                { tr: "Nurlu", order: 2, ar: "النّور" },
                { tr: "sabahlar", order: 1, ar: "صَباح" },
            ]
        },
        {
            p1: [
                { tr: "Halin", order: 2, ar: "حالُكَ؟" },
                { tr: "nasıl?", order: 1, ar: "كَيْفَ" },
            ],
            p2: [
                { tr: "Ben", order: 1, ar: "أَنا" },
                { tr: "iyiyim,", order: 2, ar: "بِخَيْر،" },
                { tr: "Allah'a şükür.", order: 3, ar: "الـحَمْد لِلّٰه" },
            ]
        },
        {
            p1: [
                { tr: "Merhaba", order: 1, ar: "مَرْحَبًا" },
                { tr: "sana", order: 2, ar: "بِك" },
            ],
            p2: [
                { tr: "Hoş", order: 1, ar: "أَهْلًا" },
                { tr: "geldin", order: 2, ar: "وَسَهْلًا" },
            ]
        },
        {
            p1: [
                { tr: "Görüşmek üzere", order: 1, ar: "إِلى اللِّقاء" },
            ],
            p2: [
                { tr: "Güle güle", order: 1, ar: "مَع السَّلامَة" },
            ]
        }
    ]
};

window.data.words = [
    { tr: "Selam üzerinize olsun", ar: "السَّلام عَلَيْكُمْ" },
    { tr: "Selam, sizin de üzerinize olsun", ar: "وَعَلَيْكُم السَّلام" },
    { tr: "Hayırlı Sabahlar", ar: "صَباح الخَيْر" },
    { tr: "Günaydın", ar: "صَباح النّور" },
    { tr: "İyi akşamlar", ar: "مَساء الْخَيْر" },
    { tr: "İyi akşamlar (cevap olarak)", ar: "مَساء النّور" },
    { tr: "Merhaba!", ar: "مَرْحَبًا" },
    { tr: "Hoş geldiniz!", ar: "أَهْلًا وَسَهْلًا" },
    { tr: "Hoş Bulduk!", ar: "أَهْلًا بِك" },
    { tr: "Nasılsın?", ar: "كَيْفَ حالُك؟" },
    { tr: "İyiyim!", ar: "أَنا بِخَيْر!" },
    { tr: "Allah’a hamdolsun!", ar: "الْـحَمْد لِلّٰه" },
    { tr: "Görüşmek üzere", ar: "إِلى اللِّقاء" },
    { tr: "Hoşça kal", ar: "مَع السَّلامَة" },
    { tr: "Allah’a emanet ol", ar: "في أَمان اللهِ" },
    { tr: "Oku", ar: "اِقْرَأْ" },
    { tr: "Oku (kız)", ar: "اِقْرَئي" },
    { tr: "Yaz", ar: "اكْتُبْ" },
    { tr: "Yaz (kız)", ar: "اكْتُبي" },
    { tr: "Tekrar et", ar: "أَعِدْ" },
    { tr: "Tekrar et (kız)", ar: "أَعِيدي" },
    { tr: "Dinle", ar: "اِسْتَمِعْ" },
    { tr: "Dinle (kız)", ar: "اِسْتَمِعي" },
];
