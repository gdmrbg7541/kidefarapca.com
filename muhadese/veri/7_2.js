/* 7_2 dersinin cümleleri/diyaloğu (ortak muhadese.html + simultane.js kullanır) */
window.data = {
sentence: [
    {
        words: [
            { tr: "Bir kutu", order: 2, ar: "عُلْبَة" },
            { tr: "tuz", order: 3, ar: "مِلْح." },
            { tr: "ihtiyacım var.", order: 1, ar: "أَنا بِحاجَة إِلى" }
        ]
    },
    {
        words: [
            { tr: "Senden", order: 2, ar: "مِـنْكَ" },
            { tr: "iki kutu", order: 3, ar: "عُلْبَتَيْـن" },
            { tr: "çay", order: 4, ar: "مِـن الشّاي." },
            { tr: "istiyorum.", order: 1, ar: "أَطْلُبُ" }
        ]
    },
    {
        words: [
            { tr: "Taze", order: 3, ar: "طازَجًا." },
            { tr: "ekmek", order: 2, ar: "خُبْزًا" }, // Arapça terkip içinde
            { tr: "istiyorum.", order: 1, ar: "أُريدُ" }
        ]
    },
    {
        words: [
            { tr: "Ömer", order: 1, ar: "عُمَر" },
            { tr: "okula", order: 3, ar: "إِلى الـمَدْرَسَة." },
            { tr: "gidecek.", order: 2, ar: "سَيَذْهَبُ" }
        ]
    },
    {
        words: [
            { tr: "Anne", order: 1, ar: "الأُمّ" },
            { tr: "bakkaldan", order: 3, ar: "مِـن الـبَقّالَة." },
            { tr: "meyveleri", order: 2, ar: "الـفَواكِه" },
            { tr: "istiyor.", order: 4, ar: "تُريدُ" }
        ]
    },
    {
        words: [
            { tr: "Şekere", order: 2, ar: " السُّكَّر." },
            { tr: "ihtiyacım var.", order: 1, ar: "أَنا بِحاجَة إِلى" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتِ" },
            { tr: "süt", order: 3, ar: "الحَليب." },
            { tr: "istiyorsun.", order: 2, ar: "تُريدينَ" }
        ]
    },
    {
        words: [
            { tr: "İki kilo", order: 2, ar: "كيلوغْرامَيْن" },
            { tr: "şekere", order: 3, ar: "مِن السُّكَّر." },
            { tr: "(onun) ihtiyacı var.", order: 1, ar: "هُو بِحاجَة إِلى" }
        ]
    },
    // --- Karşılaştırmalar (Sıfatlar) ---
    {
        words: [
            { tr: "Büyük", order: 2, ar: "كَبیر" },
            { tr: "sandık", order: 1, ar: "صُنْدوق" }
        ]
    },
    {
        words: [
            { tr: "Daha büyük", order: 1, ar: "أَكْبَر" },
            { tr: "sandık", order: 2, ar: "صُنْدوق" }
        ]
    },
    {
        words: [
            { tr: "Ağır", order: 1, ar: "ثَقيل" },
            { tr: "torba", order: 2, ar: "كيس" }
        ]
    },
    {
        words: [
            { tr: "Daha hafif", order: 1, ar: "أَخَفّ" },
            { tr: "torba", order: 2, ar: "كيس" }
        ]
    },
    {
        words: [
            { tr: "Kayısı", order: 1, ar: "المِشْمِش" },
            { tr: "pahalıdır.", order: 2, ar: "غالٍ." }
        ]
    },
    {
        words: [
            { tr: "Kayısı", order: 1, ar: "المِشْمِش" },
            { tr: "soğandan", order: 3, ar: "مِن البَصَل." },
            { tr: "daha pahalıdır.", order: 2, ar: "أَغْلى" }
        ]
    },
    {
        words: [
            { tr: "Soğan", order: 1, ar: "البَصَل" },
            { tr: "ucuzdur.", order: 2, ar: "رَخيص." }
        ]
    },
    {
        words: [
            { tr: "Soğan", order: 1, ar: "البَصَل" },
            { tr: "kayısıdan", order: 3, ar: "مِن المِشْمِش." },
            { tr: "daha ucuzdur.", order: 2, ar: "أَرْخَص" }
        ]
    },
    {
        words: [
            { tr: "Portakal", order: 1, ar: "البُرْتُقالَة" },
            { tr: "kirazdan", order: 3, ar: "مِن الكَرَزَة." },
            { tr: "daha büyüktür.", order: 2, ar: "أَكْبَر" }
        ]
    },
    {
        words: [
            { tr: "Süt", order: 2, ar: "الحَليب" },
            { tr: "kutusu", order: 1, ar: "عُلْبَة" },
            { tr: "tuz kutusundan", order: 4, ar: "مِن عُلْبَة المِلْح." },
            { tr: "daha pahalıdır.", order: 3, ar: "أَغْلى" }
        ]
    }
],
dialog: [
    {
        p1: [
            { tr: "Soğan", order: 2, ar: "البَصَل؟" },
            { tr: "ne kadar?", order: 1, ar: "بِكَم" }
        ],
        p2: [
            { tr: "Dört", order: 1, ar: "بِـأَرْبَع" },
            { tr: "lira.", order: 2, ar: "ليرات." }
        ]
    },
    {
        p1: [
            { tr: "Elmadan", order: 4, ar: "مِن التُّفّاح؟" },
            { tr: "kaç", order: 1, ar: "كَم" },
            { tr: "kilo", order: 2, ar: "كيلوغْرامًا" },
            { tr: "istersin?", order: 3, ar: "تُريدُ" }
        ],
        p2: [
            { tr: "Üç", order: 2, ar: "ثَلاثَة" },
            { tr: "kilo", order: 3, ar: "كيلوغْرامات." },
            { tr: "istiyorum.", order: 1, ar: "أُريدُ" }
        ]
    }
],
    dialog: [
    // Diyalog 1: Anne ve Ömer (Bakkal Alışverişi)
    {
        p1: [
            { tr: "Bakkaldan", order: 4, ar: "مِن البَقّالَة." },
            { tr: "bazı", order: 2, ar: "بَعْض" },
            { tr: "şeylere", order: 3, ar: "الأَشْياء" },
            { tr: "ihtiyacım var.", order: 1, ar: "أَنا بِحاجَة إِلى" }
        ],
        p2: [
            { tr: "Ne", order: 1, ar: "ماذا" },
            { tr: "istiyorsun", order: 2, ar: "تُريدينَ" },
            { tr: "anneciğim?", order: 3, ar: "يا أُمّي؟" }
        ]
    },
    {
        p1: [
            { tr: "Senden", order: 2, ar: "مِنْكَ" },
            { tr: "bir kilo", order: 3, ar: "كيلو" },
            { tr: "şeker,", order: 4, ar: "سُكَّر،" },
            { tr: "bir kutu", order: 5, ar: "وَعُلْبَة" },
            { tr: "tuz", order: 6, ar: "مِلْح،" },
            { tr: "ve iki kutu", order: 7, ar: "وَعُلْبَتَيْن" },
            { tr: "çay(dan)", order: 8, ar: "مِن الشّاي." },
            { tr: "istiyorum.", order: 1, ar: "أَطْلُبُ" }
        ],
        p2: [
            { tr: "Başka", order: 4, ar: "آخَر؟" },
            { tr: "bir şey", order: 3, ar: "شَيْئًا" },
            { tr: "ister", order: 2, ar: "تُريدينَ" },
            { tr: "misin?", order: 1, ar: "هَلْ" }
        ]
    },
    // Diyalog 2: Satıcı ve Meryem (Sebze ve Meyveler)
    {
        p1: [
            { tr: "Hoş geldiniz,", order: 1, ar: "أَهْلًا وَسَهْلًا،" },
            { tr: "nasıl yardımcı olabilirim?", order: 2, ar: "أَيّ خِدْمَة؟" },
            { tr: "Ne", order: 3, ar: "ماذا" },
            { tr: "istersiniz?", order: 4, ar: "تُريدينَ؟" }
        ],
        p2: [
            { tr: "Taze", order: 2, ar: "خَضْراوات " },
            { tr: "sebzelere", order: 3, ar: "طازَجَة." },
            { tr: "ihtiyacım var.", order: 1, ar: "أَنا بِحاجَة إِلى" }
        ]
    },
    {
        p1: [
            { tr: "Çok", order: 2, ar: "جِدًّا!" },
            { tr: "güzel!", order: 1, ar: "جَميل" },
            { tr: "Sende", order: 4, ar: " عِنْدَكَ" },
            { tr: "meyve(ler)", order: 5, ar: "فَواكِه" },
            { tr: "de", order: 6, ar: "أيضًا؟" },
            { tr: "var", order: 4, ar: " عِنْدَكَ" },
            { tr: "mı?", order: 3, ar: "وَهَلْ" },
        ],
        p2: [
            { tr: "Evet,", order: 1, ar: "نَعَمْْ،" },
            { tr: "(bende)", order: 2, ar: "عِنْدي" },
            { tr: "elma,", order: 3, ar: "تُفّاح،" },
            { tr: "portakal,", order: 4, ar: "بُرْتُقال،" },
            { tr: "muz", order: 5, ar: "مَوْز،" },
            { tr: "ve üzüm", order: 6, ar: "وَعِنَب." },
            { tr: "var.", order: 2, ar: "عِنْدي" },
           
        ]
    },
    // Diyalog 3: Satıcı ve Müşteri (Fiyat Karşılaştırması)
    {
        p1: [
            { tr: "Fasulye", order: 2, ar: "الـفاصولْيا؟" },
            { tr: "ne kadar?", order: 1, ar: "بِكَم" }
        ],
        p2: [
            { tr: "Dokuz", order: 1, ar: "بِتِسْع" },
            { tr: "lira.", order: 2, ar: "ليرات." }
        ]
    },
    {
        p1: [
            { tr: "Fakat o", order: 1, ar: "لَكِنَّها" },
            { tr: "pahalı", order: 2, ar: "غالِيَة،" },
            { tr: "ve patatesten", order: 4, ar: "مِن البَطاطا." },
            { tr: "daha pahalı.", order: 3, ar: "وَأَغْلى" }
        ],
        p2: [
            { tr: "Üzüm", order: 1, ar: "الـعِنَب" },
            { tr: "bugün", order: 3, ar: "اليَوْم،" },
            { tr: "ucuz,", order: 2, ar: "رَخيص" },
            { tr: "ve o", order: 4, ar: "وَهُو" },
            { tr: "elmadan", order: 6, ar: "مِن التُّفّاح." },
            { tr: "daha ucuz.", order: 5, ar: "أَرْخَص" }
        ]
    },
    // Diyalog 4: Salih ve Satıcı
    {
        p1: [
            { tr: "Kiraz", order: 2, ar: "الكَرَز؟" },
            { tr: "ne kadar?", order: 1, ar: "بِكَم" }
        ],
        p2: [
            { tr: "Kiraz", order: 1, ar: "الكَرَز" },
            { tr: "elmadan", order: 3, ar: "مِن التُّفّاح." },
            { tr: "daha pahalı.", order: 2, ar: "أَغْلى" }
        ]
    },
    // Diyalog 5: Fatma ve Satıcı
    {
        p1: [
            { tr: "Muz", order: 1, ar: "المَوْز" },
            { tr: "bugün", order: 2, ar: "غالٍ" },
            { tr: "pahalı,", order: 3, ar: "اليَوْم،" },
            { tr: "bir kilo", order: 5, ar: "كيلو" },
            {tr: "elma(dan)", order: 6, ar: "مِن التُّفّاح‫.‬" },
            { tr: "istiyorum.", order: 4, ar: "أُريدُ" }
        ],
        p2: [
            { tr: "Buyur,", order: 1, ar: "تَفَضَّلي،" },
            { tr: "başka", order: 5, ar: "آخَر؟" },
            { tr: "bir şey", order: 4, ar: "شَيْئًا" },
            { tr: "ister", order: 3, ar: "تُريدينَ" },
            { tr: "misin?", order: 2, ar: "هَلْ" }
        ]
    }
]
 };
/* kelimeler (kart + hafıza oyunu) */
window.data.words = [
{ tr: "Uyanıyorum", ar: "أَسْتَيْقِظُ" },
    { tr: "Abdest alıyorum", ar: "أَتَوَضَّأُ" },
    { tr: "Namaz kılıyorum", ar: "أُصَلِّي" },
    { tr: "Yiyorum / Kahvaltı yapıyorum", ar: "أَتَناوَلُ" },
    { tr: "Giyiniyorum", ar: "أَلْبَسُ" },
    { tr: "Gidiyorum", ar: "أَذْهَبُ" },
    { tr: "Dönüyorum", ar: "أَرْجِعُ" },
    { tr: "Yardım ediyorum", ar: "أُساعِدُ" },
    { tr: "Ders çalışıyorum", ar: "أَدْرُسُ" },
    { tr: "Uyuyorum", ar: "أَنامُ" },
    { tr: "Temizliyorum", ar: "أُنَظِّفُ" },
    { tr: "İçiyorum", ar: "أَشْرَبُ" },
    { tr: "Yiyorum", ar: "آكُلُ" },
    { tr: "İstiyorum", ar: "أُريدُ" },
    { tr: "Seviyorum", ar: "أُحِبُّ" },
    { tr: "Yıkıyorum", ar: "أَغْسِلُ" },
    { tr: "Geliyor", ar: "يَأْتي" },

    // Zaman Dilimleri ve Zarflar
    { tr: "Sabah", ar: "صَباحًا" },
    { tr: "Erken", ar: "مُبَكِّرًا" },
    { tr: "Öğle", ar: "ظُهْرًا" },
    { tr: "Akşam", ar: "مَساءً" },
    { tr: "Gece", ar: "لَيْلًا" },
    { tr: "Sonra", ar: "ثُمَّ / بَعْدَ" },
    { tr: "Önce", ar: "قَبْلَ" },
    { tr: "Çok", ar: "كَثيرًا" },
    { tr: "Şimdi / Saat", ar: "السّاعَة" },

    // Yiyecek ve İçecekler
    { tr: "Kahvaltı", ar: "الفَطور" },
    { tr: "Öğle yemeği", ar: "الغَداء" },
    { tr: "Akşam yemeği", ar: "العَشاء" },
    { tr: "Zeytin", ar: "الزَّيْتون" },
    { tr: "Peynir", ar: "الجُبْن" },
    { tr: "Süt", ar: "الحَليب" },
    { tr: "Et", ar: "اللَّحْم" },
    { tr: "Pirinç / Pilav", ar: "الأُرْز" },
    { tr: "Kahve", ar: "القَهْوَة" },
    { tr: "Balık", ar: "السَّمَك" },
    { tr: "Salata", ar: "السَّلَطَة" },
    { tr: "Meyve suyu", ar: "العَصير" },
    { tr: "Bal", ar: "العَسَل" },
    { tr: "Tereyağı", ar: "الزُّبْدَة" },
    { tr: "Tavuk", ar: "الدَّجاج" },
    { tr: "Ekmek", ar: "خُبْز" },
    { tr: "Çay", ar: "الشّاي" },
    { tr: "Köfte", ar: "الكُفْتَة" },
    { tr: "Makarna", ar: "المَكَرونَة" },

    // Mekan ve Eşya
    { tr: "Ev", ar: "البَيْت" },
    { tr: "Okul", ar: "المَدْرَسَة" },
    { tr: "Mescid / Cami", ar: "المَسْجِد" },
    { tr: "Elbiseler", ar: "مَلابِس" },
    { tr: "Dişler", ar: "أَسْنان" },
    { tr: "Oda", ar: "غُرْفَة" },

    // Namaz Vakitleri
    { tr: "Sabah namazı", ar: "الفَجْر" },
    { tr: "Öğle namazı", ar: "الظُّهْر" },
    { tr: "İkindi namazı", ar: "العَصْر" },
    { tr: "Akşam namazı", ar: "المَغْرِب" },
    { tr: "Yatsı namazı", ar: "العِشاء" },

    // Sayılar (Saatler için)
    { tr: "Bir", ar: "الواحِدَة" },
    { tr: "İki", ar: "الثّانِيَة" },
    { tr: "Üç", ar: "الثّالِثَة" },
    { tr: "Dört", ar: "الرّابِعَة" },
    { tr: "Beş", ar: "الخامِسَة" },
    { tr: "Altı", ar: "السّادِسَة" },
    { tr: "Yedi", ar: "السّابِعَة" },
    { tr: "Sekiz", ar: "الثّامِنَة" },
    { tr: "Dokuz", ar: "التّاسِعَة" },
    { tr: "On", ar: "العاشِرَة" },
    { tr: "On bir", ar: "الحادِيَة عَشْرَة" },
    { tr: "On iki", ar: "الثّانِيَة عَشْرَة" },

    // Günler
    { tr: "Pazartesi", ar: "الاِثْنَيْن" },
    { tr: "Salı", ar: "الثُّلاثاء" },
    { tr: "Çarşamba", ar: "الأَرْبِعاء" },
    { tr: "Perşembe", ar: "الخَميس" },
    { tr: "Cuma", ar: "الجُمُعَة" },
    { tr: "Cumartesi", ar: "السَّبْت" },
    { tr: "Pazar", ar: "الأَحَد" }
];
