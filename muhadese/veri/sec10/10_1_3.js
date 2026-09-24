/* 10. sınıf SEÇMELİ ARAPÇA — 1. Ünite (مِن الحَياة) 3. Ders: نِهاية الأُسْبوع
   Kaynak: Ortaöğretim Seçmeli Arapça ders kitabı, basılı s.36-48.
   Dersin konusu: alışveriş (البِقالة), 1-10 sayıları ve sayılan isim, tesniye
   (ikil) fiil çekimi, لكِنْ ile olumlu-olumsuz cümle, lokantada sipariş.
   Diyalog kitabın في البِقالة (s.38) ve في المَطْعَم (s.42) metinlerindendir. */
window.data = {
    sentence: [
        /* Bunlar babam ve amcam, onlar iki öğretmendir. (s.37) */
        {
            words: [
                { tr: "Bunlar", order: 1, ar: "هذانِ" },
                { tr: "babam ve amcam,", order: 2, ar: "أَبي وَعَمّي،" },
                { tr: "onlar", order: 3, ar: "هُما" },
                { tr: "iki öğretmendir.", order: 4, ar: "مُدَرِّسانِ." }
            ]
        },

        /* Bunlar annem ve teyzem, onlar iki öğretmendir. (s.37) */
        {
            words: [
                { tr: "Bunlar", order: 1, ar: "هاتانِ" },
                { tr: "annem ve teyzem,", order: 2, ar: "أُمّي وَخالَتي،" },
                { tr: "onlar", order: 3, ar: "هُما" },
                { tr: "iki öğretmendir.", order: 4, ar: "مُدَرِّسَتانِ." }
            ]
        },

        /* İki kız öğrenci dersi çalışıyor. (s.39) */
        {
            words: [
                { tr: "İki kız öğrenci", order: 2, ar: "طالِبَتانِ" },
                { tr: "dersi", order: 3, ar: "الدَّرْسَ." },
                { tr: "çalışıyor.", order: 1, ar: "تَدْرُسُ" }
            ]
        },

        /* Beş öğrenci bahçede oynuyor. (s.39) */
        {
            words: [
                { tr: "Beş öğrenci", order: 2, ar: "خَمْسةُ طُلّابٍ" },
                { tr: "bahçede", order: 3, ar: "في الحَديقة." },
                { tr: "oynuyor.", order: 1, ar: "يَلْعَبُ" }
            ]
        },

        /* Üç kız öğrenci eve dönüyor. (s.39) */
        {
            words: [
                { tr: "Üç kız öğrenci", order: 2, ar: "ثَلاثُ طالِباتٍ" },
                { tr: "eve", order: 3, ar: "إِلى البَيْت." },
                { tr: "dönüyor.", order: 1, ar: "تَرْجِعُ" }
            ]
        },

        /* Üç mühendis çalışıyor. (s.39) */
        {
            words: [
                { tr: "Üç mühendis", order: 2, ar: "ثَلاثةُ مُهَنْدِسينَ." },
                { tr: "çalışıyor.", order: 1, ar: "يَعْمَلُ" }
            ]
        },

        /* Bahçede iki çocuk var. (s.41) */
        {
            words: [
                { tr: "Bahçede", order: 1, ar: "في الحَديقةِ" },
                { tr: "iki çocuk var.", order: 2, ar: "طِفْلانِ اثْنانِ." }
            ]
        },

        /* Pazartesi günü sıcaklık altı derecedir. (s.40) */
        {
            words: [
                { tr: "Pazartesi günü", order: 3, ar: "في يَوْمِ الإِثْنَيْن." },
                { tr: "sıcaklık", order: 1, ar: "دَرَجةُ الحَرارةِ" },
                { tr: "altı derecedir.", order: 2, ar: "سِتُّ دَرَجاتٍ" }
            ]
        },

        /* Siz ikiniz tavuk yiyorsunuz. (s.43) */
        {
            words: [
                { tr: "Siz ikiniz", order: 1, ar: "أَنْتُما" },
                { tr: "tavuk", order: 3, ar: "الدَّجاج." },
                { tr: "yiyorsunuz.", order: 2, ar: "تَأْكُلانِ" }
            ]
        },

        /* O ikisi süt içiyor. (s.43) */
        {
            words: [
                { tr: "O ikisi", order: 1, ar: "هُما" },
                { tr: "süt", order: 3, ar: "الحَليب." },
                { tr: "içiyor.", order: 2, ar: "يَشْرَبانِ" }
            ]
        },

        /* Ben balığı tercih ederim ama tavuğu tercih etmem. (s.44) */
        {
            words: [
                { tr: "Ben", order: 1, ar: "أَنا" },
                { tr: "balığı", order: 3, ar: "السَّمَكَ" },
                { tr: "tercih ederim", order: 2, ar: "أُفَضِّلُ" },
                { tr: "ama", order: 4, ar: "لكِنْ" },
                { tr: "tavuğu", order: 6, ar: "الدَّجاج." },
                { tr: "tercih etmem.", order: 5, ar: "لا أُفَضِّلُ" }
            ]
        },

        /* O çorba istiyor ama salata istemiyor. (s.44) */
        {
            words: [
                { tr: "O", order: 1, ar: "هُوَ" },
                { tr: "çorba", order: 3, ar: "الحَساءَ" },
                { tr: "istiyor", order: 2, ar: "يُريدُ" },
                { tr: "ama", order: 4, ar: "لكِنْ" },
                { tr: "salata", order: 6, ar: "السَّلَطة." },
                { tr: "istemiyor.", order: 5, ar: "لا يُريدُ" }
            ]
        }
    ],

    /* Diyalog: في البِقالة (s.38) ve في المَطْعَم (s.42) */
    dialog: [
        {
            p1: [
                { tr: "Günaydın", order: 1, ar: "صَباحُ الخَيْرِ" },
                { tr: "Süleyman amca!", order: 2, ar: "يا عَمّي سُلَيْمان!" }
            ],
            p2: [
                { tr: "Günaydın", order: 1, ar: "صَباحُ النّورِ" },
                { tr: "Muhammed!", order: 2, ar: "يا مُحَمَّد!" },
                { tr: "Ne", order: 3, ar: "ماذا" },
                { tr: "istersin?", order: 4, ar: "تُريدُ؟" }
            ]
        },
        {
            p1: [
                { tr: "Bir kilo", order: 2, ar: "كيلو" },
                { tr: "pirinç", order: 3, ar: "مِنَ الأُرْزِ،" },
                { tr: "ve bir kutu", order: 4, ar: "وَعُلْبةً" },
                { tr: "çay", order: 5, ar: "مِنَ الشّاي." },
                { tr: "istiyorum.", order: 1, ar: "أُريدُ" }
            ],
            p2: [
                { tr: "Başka bir şey", order: 2, ar: "شَيْئًا آخَر؟" },
                { tr: "ister misin?", order: 1, ar: "هَلْ تُريدُ" }
            ]
        },
        {
            p1: [
                { tr: "Çikolatanın tanesi", order: 2, ar: "قِطْعةُ الشّوكولاتة؟" },
                { tr: "kaça?", order: 1, ar: "بِكَمْ" }
            ],
            p2: [
                { tr: "Tanesi", order: 1, ar: "قِطْعَتُها" },
                { tr: "beş lira.", order: 2, ar: "بِخَمْسِ ليرات." }
            ]
        },
        {
            p1: [
                { tr: "Dört tane", order: 2, ar: "أَرْبَعَ قِطَعٍ" },
                { tr: "istiyorum,", order: 1, ar: "أُريدُ" },
                { tr: "lütfen.", order: 3, ar: "مِنْ فَضْلِك." }
            ],
            p2: [
                { tr: "Buyurun.", order: 1, ar: "تَفَضَّلْ." }
            ]
        },
        {
            p1: [
                { tr: "İçeceklerden", order: 3, ar: "مِنَ المَشْروبات؟" },
                { tr: "ne", order: 1, ar: "ماذا" },
                { tr: "istersiniz?", order: 2, ar: "تُريدانِ" }
            ],
            p2: [
                { tr: "Ben", order: 1, ar: "أَنا" },
                { tr: "ayran", order: 3, ar: "اللَّبَن." },
                { tr: "istiyorum.", order: 2, ar: "أُريدُ" }
            ]
        },
        {
            p1: [
                { tr: "Tatlılardan", order: 3, ar: "مِنَ الحَلَوِيّات؟" },
                { tr: "ne", order: 1, ar: "ماذا" },
                { tr: "tercih edersiniz?", order: 2, ar: "تُفَضِّلانِ" }
            ],
            p2: [
                { tr: "Baklava", order: 2, ar: "البَقْلاوة" },
                { tr: "tercih ederiz,", order: 1, ar: "نُفَضِّلُ" },
                { tr: "lütfen.", order: 3, ar: "مِنْ فَضْلِك." }
            ]
        }
    ]
};

/* Dersin kelimeleri (Kelime Listeleri bölümü bu diziyi okur) */
window.data.words = [
    { tr: "Bakkal", ar: "البَقّالة" }, { tr: "Lokanta", ar: "المَطْعَم" },
    { tr: "Garson", ar: "النّادِل" }, { tr: "Menü", ar: "قائِمة الطَّعام" },
    { tr: "Pirinç", ar: "الأُرْز" }, { tr: "Çorba", ar: "الحَساء" },
    { tr: "Balık", ar: "السَّمَك" }, { tr: "Tavuk", ar: "الدَّجاج" },
    { tr: "Salata", ar: "السَّلَطة" }, { tr: "Ayran, yoğurt", ar: "اللَّبَن" },
    { tr: "Meyve suyu", ar: "العَصير" }, { tr: "Çikolata", ar: "الشّوكولاتة" },
    { tr: "Baklava", ar: "البَقْلاوة" }, { tr: "Tatlılar", ar: "الحَلَوِيّات" },
    { tr: "İçecekler", ar: "المَشْروبات" }, { tr: "Kutu, paket", ar: "عُلْبة" },
    { tr: "Parça, tane", ar: "قِطْعة" }, { tr: "Liralar", ar: "ليرات" },
    { tr: "Derece", ar: "دَرَجة" }, { tr: "Sıcaklık", ar: "الحَرارة" },
    { tr: "Hava durumu", ar: "الطَّقْس" }, { tr: "Yağmurlu", ar: "مُمْطِر" },
    { tr: "Bir", ar: "واحِد" }, { tr: "İki", ar: "اثْنانِ" },
    { tr: "Üç", ar: "ثَلاثة" }, { tr: "Dört", ar: "أَرْبَعة" },
    { tr: "Beş", ar: "خَمْسة" }, { tr: "Altı", ar: "سِتّة" },
    { tr: "Yedi", ar: "سَبْعة" }, { tr: "Sekiz", ar: "ثَمانية" },
    { tr: "Dokuz", ar: "تِسْعة" }, { tr: "On", ar: "عَشَرة" },
    { tr: "Kaça?", ar: "بِكَمْ" }, { tr: "Lütfen", ar: "مِنْ فَضْلِك" },
    { tr: "Buyurun", ar: "تَفَضَّلْ" }, { tr: "Ama, fakat", ar: "لكِنْ" },
    { tr: "Başka, diğer", ar: "آخَر" }, { tr: "Çocuk", ar: "طِفْل" }
];
