/* 10. sınıf SEÇMELİ ARAPÇA — 2. Ünite (قِيَمي) 3. Ders: أُحِبُّ وَطَني
   Kaynak: Ortaöğretim Seçmeli Arapça ders kitabı, basılı s.74-86.
   Dersin konusu: Türkiye'nin coğrafyası ve bölgeleri, yönler (شَمال/جَنوب/شَرْق/غَرْب),
   vatan sevgisi, سـ/سَوْفَ ile gelecek zaman ve seyahat saatleri. */
window.data = {
    sentence: [
        /* Türkiye'de dört deniz vardır. (s.75) */
        {
            words: [
                { tr: "Türkiye'de", order: 1, ar: "في تُرْكِيا" },
                { tr: "dört deniz vardır.", order: 2, ar: "أَرْبَعةُ بِحار." }
            ]
        },

        /* Marmara Denizi Türkiye'nin batısında yer alır. (s.75) */
        {
            words: [
                { tr: "Marmara Denizi", order: 2, ar: "بَحْرُ مَرْمَرة" },
                { tr: "Türkiye'nin batısında", order: 3, ar: "في غَرْبِ تُرْكِيا." },
                { tr: "yer alır.", order: 1, ar: "يَقَعُ" }
            ]
        },

        /* Karadeniz Türkiye'nin kuzeyinde yer alır. (s.75) */
        {
            words: [
                { tr: "Karadeniz", order: 2, ar: "البَحْرُ الأَسْوَدُ" },
                { tr: "Türkiye'nin kuzeyinde", order: 3, ar: "في شَمالِ تُرْكِيا." },
                { tr: "yer alır.", order: 1, ar: "يَقَعُ" }
            ]
        },

        /* Akdeniz Türkiye'nin güneyinde yer alır. (s.75) */
        {
            words: [
                { tr: "Akdeniz", order: 2, ar: "البَحْرُ الأَبْيَضُ المُتَوَسِّطُ" },
                { tr: "Türkiye'nin güneyinde", order: 3, ar: "في جَنوبِ تُرْكِيا." },
                { tr: "yer alır.", order: 1, ar: "يَقَعُ" }
            ]
        },

        /* İstanbul şehri Marmara bölgesinde yer alır. (s.75) */
        {
            words: [
                { tr: "İstanbul şehri", order: 2, ar: "مَدينةُ إِسْطَنْبول" },
                { tr: "Marmara bölgesinde", order: 3, ar: "في مِنْطَقةِ مَرْمَرة." },
                { tr: "yer alır.", order: 1, ar: "تَقَعُ" }
            ]
        },

        /* Ankara şehri Türkiye'nin ortasında yer alır, orası onun başkentidir. (s.75) */
        {
            words: [
                { tr: "Ankara şehri", order: 2, ar: "مَدينةُ أَنْقَرة" },
                { tr: "Türkiye'nin ortasında", order: 3, ar: "في وَسَطِ تُرْكِيا،" },
                { tr: "yer alır,", order: 1, ar: "تَقَعُ" },
                { tr: "orası onun başkentidir.", order: 4, ar: "وَهِيَ عاصِمَتُها." }
            ]
        },

        /* Vatanımızı doğusundan batısına severiz. (s.77) */
        {
            words: [
                { tr: "Vatanımızı", order: 2, ar: "وَطَنَنا" },
                { tr: "doğusundan", order: 3, ar: "مِنْ شَرْقِهِ" },
                { tr: "batısına", order: 4, ar: "إِلى غَرْبِهِ." },
                { tr: "severiz.", order: 1, ar: "نُحِبُّ" }
            ]
        },

        /* Vatanı koruruz. (s.77) */
        {
            words: [
                { tr: "Vatanı", order: 2, ar: "عَلى الوَطَن." },
                { tr: "koruruz.", order: 1, ar: "نُحافِظُ" }
            ]
        },

        /* Vatan, şehitlerimizden bize emanettir. (s.77) */
        {
            words: [
                { tr: "Vatan,", order: 1, ar: "الوَطَنُ" },
                { tr: "şehitlerimizden", order: 4, ar: "مِنْ شُهَدائِنا." },
                { tr: "bize", order: 3, ar: "لَنا" },
                { tr: "emanettir.", order: 2, ar: "أَمانةٌ" }
            ]
        },

        /* Bayrağın rengi kırmızı ve beyazdır. (s.77) */
        {
            words: [
                { tr: "Bayrağın rengi", order: 1, ar: "لَوْنُ العَلَمِ" },
                { tr: "kırmızı ve beyazdır.", order: 2, ar: "هُوَ الأَحْمَرُ وَالأَبْيَض." }
            ]
        },

        /* Vatandaşlar vatan için çalışır. (s.77) */
        {
            words: [
                { tr: "Vatandaşlar", order: 2, ar: "المُواطِنونَ" },
                { tr: "vatan için", order: 3, ar: "مِنْ أَجْلِ الوَطَن." },
                { tr: "çalışır.", order: 1, ar: "يَعْمَلُ" }
            ]
        },

        /* Vatan sevgisi imandandır. (s.77) */
        {
            words: [
                { tr: "Vatan sevgisi", order: 1, ar: "حُبُّ الوَطَنِ" },
                { tr: "imandandır.", order: 2, ar: "مِن الإيمان." }
            ]
        },

        /* Birinci otobüs sabah saat onda kalkacak. (s.79) */
        {
            words: [
                { tr: "Birinci otobüs", order: 2, ar: "الحافِلةُ الأُولى" },
                { tr: "sabah", order: 4, ar: "صَباحًا." },
                { tr: "saat onda", order: 3, ar: "في السّاعةِ العاشِرةِ" },
                { tr: "kalkacak.", order: 1, ar: "سَتُغادِرُ" }
            ]
        },

        /* İkinci otobüs akşam saat beşte Bursa'ya varacak. (s.79) */
        {
            words: [
                { tr: "İkinci otobüs", order: 2, ar: "الحافِلةُ الثّانيةُ" },
                { tr: "akşam", order: 5, ar: "مَساءً." },
                { tr: "saat beşte", order: 4, ar: "في السّاعةِ الخامِسةِ" },
                { tr: "Bursa'ya", order: 3, ar: "إِلى بورصة" },
                { tr: "varacak.", order: 1, ar: "سَتَصِلُ" }
            ]
        }
    ],

    /* Diyalog: سَأَزورُ تُرْكِيا ve في أَنْقَرة (s.74), yaz planı (s.80) */
    dialog: [
        {
            p1: [
                { tr: "Günaydın", order: 1, ar: "صَباحُ الخَيْر،" },
                { tr: "Semah,", order: 2, ar: "يا سَماح،" },
                { tr: "yazın", order: 5, ar: "في الصَّيْف؟" },
                { tr: "ne", order: 3, ar: "ماذا" },
                { tr: "yapacaksın?", order: 4, ar: "تَفْعَلينَ" }
            ],
            p2: [
                { tr: "Günaydın,", order: 1, ar: "صَباحُ النّور،" },
                { tr: "Türkiye'yi", order: 3, ar: "تُرْكِيا." },
                { tr: "ziyaret edeceğim.", order: 2, ar: "سَأَزورُ" }
            ]
        },
        {
            p1: [
                { tr: "Türkiye", order: 3, ar: "تُرْكِيا؟" },
                { tr: "nerede", order: 1, ar: "أَيْن" },
                { tr: "yer alır?", order: 2, ar: "تَقَعُ" }
            ],
            p2: [
                { tr: "O", order: 1, ar: "هِيَ" },
                { tr: "Asya ve Avrupa kıtaları arasında", order: 3, ar: "بَيْنَ قارّةِ آسِيا وَأُوربا." },
                { tr: "yer alır.", order: 2, ar: "تَقَعُ" }
            ]
        },
        {
            p1: [
                { tr: "Ankara'ya", order: 2, ar: "في أَنْقَرة" },
                { tr: "hoş geldin", order: 1, ar: "أَهْلًا بِكِ" },
                { tr: "Havle.", order: 3, ar: "يا خَوْلة." }
            ],
            p2: [
                { tr: "Merhaba,", order: 1, ar: "مَرْحَبًا،" },
                { tr: "Ali.", order: 2, ar: "يا عَلِيّ." }
            ]
        },
        {
            p1: [
                { tr: "Ankara güzel bir şehirdir,", order: 1, ar: "أَنْقَرة مَدينةٌ جَميلة،" },
                { tr: "Türkiye'nin ortasında", order: 3, ar: "في وَسَطِ تُرْكِيا." },
                { tr: "yer alır.", order: 2, ar: "هِيَ تَقَعُ" },
                { tr: "Bu hafta", order: 7, ar: "في هذا الأُسْبوع." },
                { tr: "birlikte", order: 5, ar: "مَعًا" },
                { tr: "önemli yerleri", order: 6, ar: "الأَماكِنَ المُهِمّةَ" },
                { tr: "ziyaret edeceğiz.", order: 4, ar: "سَنَزورُ" }
            ],
            p2: [
                { tr: "Teşekkürler.", order: 1, ar: "شُكْرًا." }
            ]
        },
        {
            p1: [
                { tr: "Bu yaz", order: 3, ar: "هذا الصَّيْف؟" },
                { tr: "köyüne", order: 2, ar: "إِلى قَرْيَتِكَ" },
                { tr: "gidecek misin?", order: 1, ar: "هَلْ سَتَذْهَبُ" }
            ],
            p2: [
                { tr: "Hayır,", order: 1, ar: "لا،" },
                { tr: "bu yıl", order: 2, ar: "هذِهِ السَّنة" },
                { tr: "İzmir'deki dayıma", order: 4, ar: "إِلى خالي في إِزْمير" },
                { tr: "gideceğim", order: 3, ar: "سَأَذْهَبُ" },
                { tr: "ama", order: 5, ar: "وَلكِنْ" },
                { tr: "gelecek yıl", order: 8, ar: "في السَّنةِ القادِمة." },
                { tr: "köyümü", order: 7, ar: "قَرْيَتي" },
                { tr: "ziyaret edeceğim.", order: 6, ar: "سَأَزورُ" }
            ]
        },
        {
            p1: [
                { tr: "Köyün", order: 2, ar: "قَرْيَتُكَ؟" },
                { tr: "nerede?", order: 1, ar: "أَيْن" }
            ],
            p2: [
                { tr: "Köyüm", order: 1, ar: "قَرْيَتي" },
                { tr: "Türkiye'nin doğusundaki", order: 3, ar: "في شَرْقِ تُرْكِيا." },
                { tr: "Van şehrindedir.", order: 2, ar: "في مَدينةِ وان" }
            ]
        }
    ]
};

/* Dersin kelimeleri (Kelime Listeleri bölümü bu diziyi okur) */
window.data.words = [
    { tr: "Vatan", ar: "الوَطَن" }, { tr: "Bayrak", ar: "العَلَم" },
    { tr: "Vatandaş", ar: "المُواطِن" }, { tr: "Şehitler", ar: "شُهَداء" },
    { tr: "Emanet", ar: "أَمانة" }, { tr: "İman", ar: "الإيمان" },
    { tr: "Sevgi", ar: "حُبّ" }, { tr: "Kıta", ar: "قارّة" },
    { tr: "Bölge", ar: "مِنْطَقة" }, { tr: "Başkent", ar: "عاصِمة" },
    { tr: "Şehir", ar: "مَدينة" }, { tr: "Köy", ar: "قَرْية" },
    { tr: "Deniz", ar: "بَحْر" }, { tr: "Kuzey", ar: "شَمال" },
    { tr: "Güney", ar: "جَنوب" }, { tr: "Doğu", ar: "شَرْق" },
    { tr: "Batı", ar: "غَرْب" }, { tr: "Orta", ar: "وَسَط" },
    { tr: "Yer alıyor (eril)", ar: "يَقَعُ" }, { tr: "Yer alıyor (dişil)", ar: "تَقَعُ" },
    { tr: "Koruyoruz", ar: "نُحافِظُ" }, { tr: "Ziyaret edeceğim", ar: "سَأَزورُ" },
    { tr: "Ziyaret edeceğiz", ar: "سَنَزورُ" }, { tr: "Gelecek yıl", ar: "السَّنة القادِمة" },
    { tr: "Kalkış", ar: "المُغادَرة" }, { tr: "Varış", ar: "الوُصول" },
    { tr: "Otobüs saatleri", ar: "مَواعِد الحافِلات" }, { tr: "Sefer numarası", ar: "رَقَم السَّفَر" },
    { tr: "Önemli yerler", ar: "الأَماكِن المُهِمّة" }, { tr: "Turistik", ar: "سِياحِيّة" },
    { tr: "Huzur ve barış", ar: "أَمْن وَسَلام" }, { tr: "Hizmet", ar: "خِدْمة" },
    { tr: "Renk", ar: "لَوْن" }, { tr: "Kırmızı", ar: "الأَحْمَر" },
    { tr: "Beyaz", ar: "الأَبْيَض" }, { tr: "Yolculuk", ar: "السَّفَر" }
];
