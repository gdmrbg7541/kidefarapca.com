/* 10_2_2 dersinin cümleleri/diyaloğu (ortak muhadese.html + simultane.js kullanır) */
window.data = {
sentence: [
    // 1. Cümle: Ben futbol oynuyorum.
    {
        words: [
            { tr: "Futbol", order: 2, ar: "كُرَة القَدَم‫.‬" },
            { tr: "oynuyorum.", order: 1, ar: "أَلْعَبُ" }
        ]
    },

    // 2. Cümle: Arkadaşlarımla basketbol oynuyorum.
    {
        words: [
            { tr: "Arkadaşlarım", order: 4, ar: "أَصْدِقائي‫.‬" },
            { tr: "ile", order: 3, ar: "مَع" },
            { tr: "basketbol", order: 2, ar: "كُرَة السَّلَّة" },
            { tr: "oynuyorum.", order: 1, ar: "أَلْعَبُ" }
        ]
    },

    // 3. Cümle: Kitap okumayı seviyorum.
    {
        words: [
            { tr: "Kitap", order: 3, ar: "الكُتُب‫.‬" },
            { tr: "okumayı", order: 2, ar: "قِراءَة" },
            { tr: "seviyorum.", order: 1, ar: "أُحِبُّ" }
        ]
    },

    // 4. Cümle: Müzik dinliyorum.
    {
        words: [
            { tr: "Müzik", order: 2, ar: "إِلى الموسيقى‫.‬" },
            { tr: "dinliyorum.", order: 1, ar: "أَسْتَمِعُ" }
        ]
    },

    // 5. Cümle: Hobiler arasından resmi tercih ederim.
    {
        words: [
            { tr: "Hobilerden", order: 3, ar: "مِن الهِوايات‫.‬" },
            { tr: "resmi", order: 2, ar: "الرَّسْم" },
            { tr: "tercih ederim.", order: 1, ar: "أُفَضِّلُ" }
        ]
    },

    // 6. Cümle: Kız arkadaşlarımla tiyatro izliyorum.
    {
        words: [
            { tr: "Kız arkadaşlarım", order: 4, ar: "صَديقاتي‫.‬" },
            { tr: "ile", order: 3, ar: "مَع" },
            { tr: "tiyatro", order: 2, ar: "المَسْرَح" },
            { tr: "izliyorum.", order: 1, ar: "أُشاهِدُ" }
        ]
    },

    // 7. Cümle: Aileyle gezintide vakit geçiriyoruz.
    {
        words: [
            { tr: "Aile", order: 5, ar: "العائِلَة‫.‬" },
            { tr: "ile", order: 4, ar: "مَع" },
            { tr: "gezintide", order: 3, ar: "في التَّنَزُّه" },
            { tr: "vakit", order: 2, ar: "الوَقْت" },
            { tr: "geçiriyoruz.", order: 1, ar: "نَقْضي" }
        ]
    },

    // 8. Cümle: Yüzme ve okçuluk yapıyoruz.
    {
        words: [
            { tr: "Yüzme", order: 2, ar: "السِّباحَة" },
            { tr: "ve okçuluk", order: 3, ar: "وَالرِّمايَة‫.‬" },
            { tr: "yapıyoruz.", order: 1, ar: "نُمارِسُ" }
        ]
    },

    // 9. Cümle: Ahmet futbol oynuyor.
    {
        words: [
            { tr: "Ahmet", order: 2, ar: "أَحْمَد" },
            { tr: "futbol", order: 3, ar: "كُرَة القَدَم‫.‬" },
            { tr: "oynuyor.", order: 1, ar: "يَلْعَبُ" }
        ]
    },

    // 10. Cümle: Zeynep müziği sevmiyor.
    {
        words: [
            { tr: "Zeynep", order: 1, ar: "زَيْنَب" },
            { tr: "müziği", order: 3, ar: "الموسيقى‫.‬" },
            { tr: "sevmiyor.", order: 2, ar: "لا تُحِبُّ" }
        ]
    },

    // 11. Cümle: Anne resmi tercih ediyor.
    {
        words: [
            { tr: "Anne", order: 1, ar: "الأُمّ" },
            { tr: "resmi", order: 3, ar: "الرَّسْم‫.‬" },
            { tr: "tercih ediyor.", order: 2, ar: "تُفَضِّلُ" }
        ]
    },

    // 12. Cümle: Baba sinema izlemek istiyor.
    {
        words: [
            { tr: "Baba", order: 1, ar: "الأَب" },
            { tr: "sinema", order: 4, ar: "السّينَما‫.‬" },
            { tr: "izlemeyi", order: 3, ar: "مُشاهَدَة" },
            { tr: "istiyor.", order: 2, ar: "يُريدُ" }
        ]
    },

    // 13. Cümle: Ben akşamları genellikle kitap okurum.
    {
        words: [
            { tr: "Akşamları", order: 3, ar: "في المَساء" },
            { tr: "genellikle", order: 4, ar: "غالِبًا‫.‬" },
            { tr: "kitap", order: 2, ar: "الكُتُب" },
            { tr: "okurum.", order: 1, ar: "أَقْرَأُ" }
        ]
    },

    // 14. Cümle: Spor sağlık için faydalıdır.
    {
        words: [
            { tr: "Spor", order: 1, ar: "الرِّياضَة" },
            { tr: "sağlık için", order: 3, ar: "لِلصِّحَّة‫.‬" },
            { tr: "faydalıdır.", order: 2, ar: "مُفيدَة" }
        ]
    },

    // 15. Cümle: Manzaraları güzel olduğu için.
    {
        words: [
            { tr: "Çünkü", order: 1, ar: "لِأَنَّ" },
            { tr: "manzaraları", order: 2, ar: "مَناظِرَها" },
            { tr: "güzeldir.", order: 3, ar: "جَميلَة‫.‬" }
        ]
    }
],
dialog: [
    // --- 1. DİYALOG: LÜTFEN ONUN SEVİYORUM (Selim ve Öğretmen) ---
    {
        p1: [
            { tr: "Selim,", order: 5, ar: "يا سَليم‫.‬" },
            { tr: "yüzmeyi", order: 2, ar: "السِّباحَة" },
            { tr: "mi", order: 3, ar: "أَمْ" },
            { tr: "futbolu", order: 4, ar: "كُرَة القَدَم" },
            { tr: "mu", order: 1, ar: "أَتُفَضِّلُ" },
            { tr: "tercih edersin?", order: 1, ar: "أَتُفَضِّلُ" }
        ],
        p2: [
            { tr: "Yüzmeyi", order: 2, ar: "السِّباحَة." },
            { tr: "tercih ederim.", order: 1, ar: "أُفَضِّلُ" }
        ]
    },
    {
        p1: [
            { tr: "Neden", order: 1, ar: "لِماذا" },
            { tr: "yüzmeyi", order: 3, ar: "السِّباحَة؟" },
            { tr: "tercih ediyorsun?", order: 2, ar: "تُفَضِّلُ" }
        ],
        p2: [
            { tr: "Çünkü (o)", order: 1, ar: "لِأَنَّها" },
            { tr: "sağlığa", order: 3, ar: "لِلصِّحَّة." },
            { tr: "faydalıdır.", order: 2, ar: "مُفيدة" }
        ]
    },

    // --- 2. DİYALOG: HOBİN NEDİR? (Osman ve Yusuf) ---
    {
        p1: [
            { tr: "Merhaba", order: 1, ar: "مَرْحَبًا" },
            { tr: "Yusuf,", order: 2, ar: "يوسُف،" },
            { tr: "hobin", order: 4, ar: "هِوايتُكَ؟" },
            { tr: "nedir?", order: 3, ar: "ما" }
            
        ],
        p2: [
            { tr: "Benim hobim", order: 1, ar: "هِوايتي" },
            { tr: "futboldur.", order: 2, ar: "كُرَة القَدَم." }
        ]
    },
    {
        p1: [
            { tr: "Boş", order: 4, ar: "فَراغِك‫.‬" },
            { tr: "vaktinde", order: 3, ar: "في وَقْتِ" },
            { tr: "ne", order: 1, ar: "ماذا" },
            { tr: "yaparsın?", order: 2, ar: "تَفْعَلُ" },
            
        ],
        p2: [
            { tr: "Ben", order: 1, ar: "أَنا" },
            { tr: "kitap", order: 4, ar: "الكُتُب" },   
            { tr: "okumayı", order: 3, ar: "قِراءةَ" },
            { tr: "ve", order: 5, ar: "وَالاِسْتِماع" },
            { tr: "müzik", order: 6, ar: "إلى الموسيقى." },
            { tr: "dinlemeyi", order: 5, ar: "وَالاِسْتِماع" },
            { tr: "severim.", order: 2, ar: "أُحِبُّ" }
            
        ]
    },

    // --- 3. DİYALOG: HAJER VE ÖĞRETMEN ---
    {
        p1: [
            { tr: "Boş", order: 4, ar: "فَراغِكِ؟" },
            { tr: "vaktinde", order: 3, ar: "في وَقْتِ" },
            { tr: "ne", order: 1, ar: "ماذا" },
            { tr: "yaparsın?", order: 2, ar: "تَفْعَلينَ" },
           
            
        ],
        p2: [
            { tr: "Resim", order: 2, ar: "الرَّسْم" },
            { tr: "yaparım", order: 1, ar: "أُمارِسُ" },
            { tr: "ve", order: 3, ar: "وَأُحِبُّ" },
            { tr: "gezintiyi", order: 4, ar: "التَّنَزُّه" },
            { tr: "de", order: 5, ar: "أَيْضًا." },
            { tr: "severim.", order: 3, ar: "وَأُحِبُّ" },
        ]
    },
    {
        p1: [
            { tr: "Hangi", order: 2, ar: "أَيَّ" },
            { tr: "sporu", order: 3, ar: "رِياضة؟" },
            { tr: "tercih edersin?", order: 1, ar: "تُفَضِّلينَ" }
        ],
        p2: [
            { tr: "Yüzmeyi", order: 2, ar: "السِّباحَة" },
            { tr: "ve", order: 3, ar: "وَالرِّمايَة." },
            { tr: "okçuluğu", order: 3, ar: "وَالرِّمايَة." },
            { tr: "tercih ederim.", order: 1, ar: "أُفَضِّلُ" },
        ]
    },
    {
        p1: [
            { tr: "Futbol", order: 3, ar: "كُرَة القَدَم؟" },
            { tr: "oynayabilir(sin)", order: 2, ar: "تَسْتَطيعينَ أَنْ تَلْعَبي" },
            { tr: "misin?", order: 1, ar: "هَلْ" },
            
            
        ],
        p2: [
            { tr: "Hayır,", order: 1, ar: "لا،" },
            { tr: "yapamam.", order: 2, ar: "لا أَسْتَطيعُ." }
        ]
    }
]
};
/* kelimeler (kart + hafıza oyunu) */
window.data.words = [
    // Hobiler ve Sporlar
    { tr: "Futbol", ar: "كُرَة القَدَم" },
    { tr: "Basketbol", ar: "كُرَة السَّلَّة" },
    { tr: "Yüzme", ar: "السِّباحَة" },
    { tr: "Atıcılık / Okçuluk", ar: "الرِّمايَة" },
    { tr: "Resim çizme", ar: "الرَّسْم" },
    { tr: "Okuma", ar: "قِراءَة" },
    { tr: "Müzik", ar: "الموسيقى" },
    { tr: "Tiyatro", ar: "المَسْرَح" },
    { tr: "Sinema", ar: "السّينَما" },
    { tr: "Gezinti / Yürüyüş", ar: "التَّنَزُّه" },
    { tr: "Seyahat", ar: "السَّفَر" },
    { tr: "Hobi", ar: "هِوايَة" },
    { tr: "Spor", ar: "رِياضَة" },

    // Sık Kullanılan Fiiller (Şimdiki Zaman - Ben)
    { tr: "Oynuyorum", ar: "أَلْعَبُ" },
    { tr: "Seviyorum", ar: "أُحِبُّ" },
    { tr: "Dinliyorum", ar: "أَسْتَمِعُ" },
    { tr: "Tercih ediyorum", ar: "أُفَضِّلُ" },
    { tr: "İzliyorum", ar: "أُشاهِدُ" },
    { tr: "Uyguluyorum / Yapıyorum", ar: "أُمارِسُ" },
    { tr: "Vakit geçiriyorum", ar: "أَقْضي" },
    { tr: "Okuyorum", ar: "أَقْرَأُ" },
    { tr: "Yapabilirim (Edebilirim)", ar: "أَسْتَطيعُ" },

    // Zaman ve Sıklık Zarfları
    { tr: "Vakit", ar: "وَقْت" },
    { tr: "Boş vakit", ar: "وَقْت فَراغ" },
    { tr: "Akşam", ar: "المَساء" },
    { tr: "Tatil", ar: "عُطْلَة" },
    { tr: "Hafta", ar: "أُسْبوع" },
    { tr: "Yıl / Sene", ar: "سَنَة" },
    { tr: "Bazen", ar: "أَحْيانًا" },
    { tr: "Çoğunlukla", ar: "غالِبًا" },
    { tr: "Genellikle", ar: "عادَةً" },
    { tr: "Bir kez", ar: "مَرَّة" },
    { tr: "İki kez", ar: "مَرَّتَيْن" },

    // İnsanlar, Mekanlar ve Diğer İsimler
    { tr: "Aile", ar: "عائِلَة / أُسْرَة" },
    { tr: "Arkadaşlar", ar: "أَصْدِقاء" },
    { tr: "Bahçe / Park", ar: "حَديقَة" },
    { tr: "Ormanlar", ar: "غابات" },
    { tr: "Kitaplar", ar: "كُتُب" },
    { tr: "Sağlık", ar: "الصِّحَّة" },
    { tr: "Beden / Vücut", ar: "جَسَد" },
    { tr: "Ruh", ar: "رّوح" },

    // Sıfatlar
    { tr: "Faydalı", ar: "مُفيدَة" },
    { tr: "Eğlenceli", ar: "مُمْتِعَة" },
    { tr: "Farklı / Çeşitli", ar: "مُخْتَلِفَة" },
    { tr: "Güzel", ar: "جَميلَة" },
    { tr: "Birlikte", ar: "مَعًا" }
];
