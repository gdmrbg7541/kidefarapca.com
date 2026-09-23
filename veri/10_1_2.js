/* 10_1_2 dersinin cümleleri/diyaloğu (ortak muhadese.html + simultane.js kullanır) */
window.data = {
    sentence: [
        // 1. Cümle: Müslümanlar komşularına daima yardım ederler.
        {
            words: [
                { tr: "Müslümanlar", order: 1, ar: "المُسْلِمون" },
                { tr: "komşularına", order: 3, ar: "جيرانَهُم" },
                { tr: "daima", order: 4, ar: "دائِمًا." },
                { tr: "yardım ederler.", order: 2, ar: "يُساعِدونَ" }
            ]
        },

        // 2. Cümle: Müslümanlar muhtaçlara ve yaşlılara daima yardım ederler.
        {
            words: [
                { tr: "Müslümanlar", order: 1, ar: "المُسْلِمون" },
                { tr: "muhtaçlara", order: 3, ar: "المُحْتاجين" },
                { tr: "ve yaşlılara", order: 4, ar: "وَالمُسِنّين" },
                { tr: "daima", order: 5, ar: "دائِمًا." },
                { tr: "yardım ederler.", order: 2, ar: "يُساعِدونَ" }
            ]
        },

        // 3. Cümle: Onlar küçükleri severler.
        {
            words: [
                { tr: "Onlar", order: 1, ar: "هُم" },
                { tr: "küçükleri", order: 3, ar: "الصِّغار‫.‬" },
                { tr: "severler.", order: 2, ar: "يُحِبّونَ" }
            ]
        },

        // 4. Cümle: Onlar büyüklere saygı duyarlar.
        {
            words: [
                { tr: "Onlar", order: 1, ar: "هُم" },
                { tr: "büyüklere", order: 3, ar: "الكِبار‫.‬" },
                { tr: "saygı duyarlar.", order: 2, ar: "يَحْتَرِمونَ" }
            ]
        },

        // 5. Cümle: Onlar misafirlerine ikramda bulunurlar.
        {
            words: [
                { tr: "Onlar", order: 1, ar: "هُم" },
                { tr: "misafirlerine", order: 3, ar: "ضُيوفَهُم‫.‬" },
                { tr: "ikram ederler.", order: 2, ar: "يُكْرِمونَ" }
            ]
        },

        // 6. Cümle: Müslümanın güler yüzlü olması gerekir.
        {
            words: [
                { tr: "Müslümanın", order: 2, ar: "المُسْلِم" },
                { tr: "güler yüzlü", order: 4, ar: "مُبْتَسِمًا‫.‬" },
                { tr: "olması", order: 3, ar: "أَنْ يَكونَ" },
                { tr: "gerekir.", order: 1, ar: "يَجِبُ عَلى" }
            ]
        },

        // 7. Cümle: Müslümanın öfkeli olmaması gerekir.
        {
            words: [
                { tr: "Müslümanın", order: 2, ar: " المُسْلِم" },
                { tr: "öfkeli", order: 4, ar: "غَضْبان‫.‬" },
                { tr: "olmaması", order: 3, ar: "أَلّا يَكونَ" },
                { tr: "gerekir.", order: 1, ar: "يَجِبُ عَلى" }
            ]
        },

        // 8. Cümle: Mutlu ol.
        {
            words: [
                { tr: "Mutlu", order: 2, ar: "مَبْسوطًا‫.‬" },
                { tr: "ol.", order: 1, ar: "كُنْ" }
            ]
        },

        // 9. Cümle: Kızgın olma.
        {
            words: [
                { tr: "Kızgın", order: 2, ar: "غاضِبًا‫.‬" },
                { tr: "olma.", order: 1, ar: "لا تَكُنْ" }
            ]
        },

        // 10. Cümle: Güler yüzlü ol. (Kadın)
        {
            words: [
                { tr: "Güler yüzlü", order: 2, ar: "مُبْتَسِمَة‫.‬" },
                { tr: "ol.", order: 1, ar: "كوني" }
            ]
        },

        // 11. Cümle: Üzgün olma. (Kadın)
        {
            words: [
                { tr: "Üzgün", order: 2, ar: "حَزينَة‫.‬" },
                { tr: "olma.", order: 1, ar: "لا تَكوني" }
            ]
        },

        // 12. Cümle: Senin daima dürüst olman gerekir.
        {
            words: [
                { tr: "Daima", order: 4, ar: "دائِمًا‫.‬" },
                { tr: "dürüst", order: 3, ar: "صادِقًا" },
                { tr: "olman", order: 2, ar: "أَنْ تَكونَ" },
                { tr: "gerekir.", order: 1, ar: "يَجِبُ عَلَيْكَ" }
            ]
        },

        // 13. Cümle: Senin asla yalancı olmaman gerekir.
        {
            words: [
                { tr: "Asla", order: 4, ar: "أَبَدًا‫.‬" },
                { tr: "yalancı", order: 3, ar: "كاذِبًا" },
                { tr: "olmaman", order: 2, ar: "أَلّا تَكونَ" },
                { tr: "gerekir.", order: 1, ar: "يَجِبُ عَلَيْكَ" }
            ]
        },

        // 14. Cümle: Senin sabırlı olman gerekir. (Kadın)
        {
            words: [
                { tr: "Sabırlı", order: 3, ar: "صَبورَة‫.‬" },
                { tr: "olman", order: 2, ar: "أَنْ تَكوني" },
                { tr: "gerekir.", order: 1, ar: "يَجِبُ عَلَيْكِ" }
            ]
        },

        // 15. Cümle: Senin aceleci olmaman gerekir. (Kadın)
        {
            words: [
                { tr: "Aceleci", order: 3, ar: "عَجولَة‫.‬" },
                { tr: "olmaman", order: 2, ar: "أَلّا تَكوني" },
                { tr: "gerekir.", order: 1, ar: "يَجِبُ عَلَيْكِ" }
            ]
        },

        // 16. Cümle: O şaşkındır.
        {
            words: [
                { tr: "O", order: 1, ar: "هُو" },
                { tr: "şaşkındır.", order: 2, ar: "مُتَعَجِّب‫.‬" }
            ]
        },

        // 17. Cümle: O endişelidir.
        {
            words: [
                { tr: "O", order: 1, ar: "هِي" },
                { tr: "endişelidir.", order: 2, ar: "قَلِقَة‫.‬" }
            ]
        },

        // 18. Cümle: İslam'da iki bayram vardır...
        {
            words: [
                { tr: "İslam'da", order: 1, ar: "في الإِسْلام" },
                { tr: "iki bayram vardır,", order: 2, ar: "عيدان،" },
                { tr: "onlar:", order: 3, ar: "هُما" },
                { tr: "Ramazan Bayramı", order: 4, ar: "عيد الفِطْر" },
                { tr: "ve Kurban Bayramıdır.", order: 5, ar: "وَعيد الأَضْحى‫.‬" }
            ]
        },

        // 19. Cümle: Bayramlarda Müslümanlar yemekten önce bayram namazı kılarlar.
        {
            words: [
                { tr: "Bayramlarda", order: 1, ar: "في الأَعْياد" },
                { tr: "Müslümanlar", order: 2, ar: "المُسْلِمون" },
                { tr: "yemekten önce", order: 4, ar: "قَبْل الطَّعام" },
                { tr: "bayram namazı", order: 5, ar: "صَلاة العيد‫.‬" },
                { tr: "kılarlar.", order: 3, ar: "يُصَلّونَ" }
            ]
        },

        // 20. Cümle: Sonra aileyle birlikte bayram yemeği yerler.
        {
            words: [
                { tr: "Sonra", order: 1, ar: "ثُمَّ" },
                { tr: "aileyle birlikte", order: 4, ar: "مَع العائِلَة‫.‬" },
                { tr: "bayram yemeği", order: 3, ar: "طَعام العيد" },
                { tr: "yerler.", order: 2, ar: "يَتَناوَلونَ" }
            ]
        },

        // 21. Cümle: Yemekten sonra akrabalarını ve komşularını ziyaret ederler.
        {
            words: [
                { tr: "Yemekten sonra", order: 1, ar: "بَعْد الطَّعام" },
                { tr: "akrabalarını", order: 3, ar: "أَقارِبَهُم" },
                { tr: "ve komşularını", order: 4, ar: "وَجيرانَهُم‫.‬" },
                { tr: "ziyaret ederler.", order: 2, ar: "يَزُورونَ" }
            ]
        },

        // 22. Cümle: Misafirlerine ikram ederler ve birbirlerine teşekkür ederler.
        

        // 23. Cümle: Müslümanlar bayramları büyük bir sevinçle kutlarlar.
        {
            words: [
                { tr: "Müslümanlar", order: 2, ar: "المُسْلِمون" },
                { tr: "bayramları", order: 3, ar: "بِالأَعْياد" },
                { tr: "büyük bir sevinçle", order: 4, ar: "بِفَرَح كَبير‫.‬" },
                { tr: "kutlarlar.", order: 1, ar: "يَحْتَفِلُ" }
            ]
        },

        // 24. Cümle: Bayramlarda Müslümanlar arasında yardımlaşma daha çok artar.
        {
            words: [
                { tr: "Bayramlarda", order: 7, ar: "في الأَعْياد‫.‬" },
                { tr: "Müslümanlar", order: 5, ar: "المُسْلِمين" },
                { tr: "arasında", order: 4, ar: "بَيْن" },
                { tr: "dayanışma", order: 2, ar: "التَّعاوُن" },
                { tr: "ve yardımlaşma", order: 3, ar: "وَالمُساعَدَة" },
                { tr: "daha çok", order: 6, ar: "أَكْثَر" },
                { tr: "artar.", order: 1, ar: "يَزْدادُ" }
            ]
        },

        // 25. Cümle: Ve birbirlerine şöyle derler...
        {
            words: [
                { tr: "Ve birbirlerine", order: 2, ar: " بَعْضُهُم لِبَعْض:" },
                { tr: "şöyle derler:", order: 1, ar: "وَيَقولُ" }, // Bu kelime Arapçada yukarıdaki kalıba dahil
                { tr: "Bayramınız kutlu olsun.", order: 3, ar: "كُلّ عام وَأَنْتُم بِخَيْر‫.‬" }
            ]
        }
    ],
       
 dialog: [
    // --- 1. GÖRSEL: ÖĞRETMEN VE HALİD DİYALOĞU ---
    {
        p1: [
            { tr: "Halid,", order: 4, ar: "يا خالِد؟" },
            { tr: "Müslümanların", order: 3, ar: "المُسْلِمين" },
            { tr: "sıfatları", order: 2, ar: "صِفات" },
            { tr: "nedir?", order: 1, ar: "ما" }
        ],
        p2: [
            { tr: "Müslümanlar", order: 1, ar: "الْمُسْلِمُون" },
            { tr: "her zaman", order: 5, ar: "دائِمًا." },
            { tr: "ihtiyaç sahiplerine", order: 3, ar: "المُحْتاجِين" },
            { tr: "ve yaşlılara", order: 4, ar: "وَالمُسِنّين" },
            { tr: "yardım ederler.", order: 2, ar: "يُساعِدُون" }
        ]
    },
    {
        p1: [
            { tr: "Doğru,", order: 1, ar: "صحيح،" },
            { tr: "ayrıca", order: 7, ar: "أَيْضًا." },
            { tr: "onlar", order: 2, ar: "وَهُم" },
            { tr: "küçükleri", order: 4, ar: "الصِّغار" },
            { tr: "sever", order: 3, ar: "يُحِبّون" },
            { tr: "ve büyüklere", order: 6, ar: "الكِبار" },
            { tr: "saygı duyarlar.", order: 5, ar: "وَيَحْتَرِمُون" }
            
        ],
        p2: [
            { tr: "Ve Müslümanın", order: 3, ar: "الْمُسْلِم" },
            { tr: "dürüst", order: 4, ar: "صادِقًا" },
            { tr: "ve sabırlı", order: 5, ar: "وَصَبُورًا." },
            { tr: "olması", order: 2, ar: "يَكونَ" },
            { tr: "gerekir.", order: 1, ar: "وَيَجِبُ أَنْ" }
        ]
    },
    {
        p1: [
            { tr: "Evet,", order: 1, ar: "نَعَم،" },
            { tr: "ve güler yüzlü", order: 2, ar: "وَمُبْتَسِمًا" },
            { tr: "ayrıca.", order: 3, ar: "أَيْضًا." }
        ],
        p2: [
            { tr: "Ve Müslümanın", order: 3, ar: "المُسْلِم" },
            { tr: "yalancı", order: 4, ar: "كاذِبًا" },
            { tr: "ve öfkeli", order: 5, ar: "وَغاضِبًا." },
            { tr: "olmaması", order: 2, ar: "أَلَّا يَكُون " },
            { tr: "gerekir.", order: 1, ar: "وَيَجِبُ" }
        ]
    },
    {
        p1: [
            { tr: "Aferin", order: 1, ar: "أَحْسَنْت" },
            { tr: "Halid.", order: 2, ar: "يا خالِد." }
        ],
        p2: [ { tr: "Teşekkürler", order: 1, ar: "شُكْرًا" }, ] 
    },

    // --- 2. GÖRSEL: SARE VE HACER DİYALOĞU (Boşluklar Dolduruldu) ---
    {
        p1: [
            { tr: "Allah'ın selamı", order: 1, ar: "السَّلام" },
            { tr: "üzerinize olsun.", order: 2, ar: "عَلَيْكُم." }
        ],
        p2: [
            { tr: "Allah'ın selamı", order: 1, ar: "وَعَلَيْكُم" },
            { tr: "sizin de üzerinize olsun.", order: 2, ar: "السَّلام." }
        ]
    },
    {
        p1: [
            { tr: "Ey Hacer,", order: 5, ar: "يا هاجَر،" },
            { tr: "Müslümanların bazı sıfatlarını", order: 4, ar: "المُسْلِمين" },
            { tr: "bazı", order: 2, ar: "بَعْض" },
            { tr: "sıfatlarını", order: 3, ar: "صِفات" },
            { tr: "say (zikret)?", order: 1, ar: "اُذْكُري" }
        ],
        p2: [
            { tr: "Müslümanlar", order: 1, ar: "الْمُسْلِمُون" },
            { tr: "her zaman", order: 4, ar: "دائِمًا." },
            { tr: "ihtiyaç sahiplerine", order: 3, ar: "الْمُحْتاجِين" }, // Boşluk Dolduruldu
            { tr: "yardım ederler.", order: 2, ar: "يُساعِدُون" }
        ]
    },
    {
        p1: [
            { tr: "Doğru,", order: 1, ar: "صَحيح،" },
            { tr: "onlar", order: 3, ar: "وَهُم." },
            { tr: "onlar küçükleri", order: 3, ar: "الصِّغار." },
            { tr: "ayrıca", order: 2, ar: " أَيْضًا" },
            { tr: "severler.", order: 4, ar: "يُحِبّون" } // Boşluk Dolduruldu
        ],
        p2: [
            { tr: "Ve Müslümanın", order: 3, ar: "المُسْلِم" },
            { tr: "dürüst (sadık)", order: 4, ar: "صادِقًا." },
            { tr: "olması", order: 2, ar: "يَكون" },
            { tr: "gerekir.", order: 1, ar: "وَيَجِبُ أَن" }
        ]
    },
    {
        p1: [
            { tr: "Evet,", order: 1, ar: "نَعَم،" },
            { tr: "ve sabırlı", order: 2, ar: "وَصَبُورًا" },
            { tr: "ayrıca.", order: 3, ar: "أَيْضًا." }
        ],
        p2: [
            { tr: "Müslümanın", order: 1, ar: "المُسْلِم" },
            { tr: "yalancı", order: 2, ar: "كاذِبًا." },
            { tr: "olmaması", order: 1, ar: "أَلَّا يَكونَ" },
            { tr: "gerekir.", order: 1, ar: "وَيَجِبُ" },
        ]
    },

    // --- 3. GÖRSEL: ZEYNEP VE ZEHRA DİYALOĞU (Boşluklar Dolduruldu) ---
    {
        p1: [
            { tr: "Bayramın mübarek olsun!", order: 1, ar: "عيد مُبارَك!" },
            { tr: "Bayram günü", order: 3, ar: "يَوْم العيد؟" },
            { tr: "ne yaptın?", order: 2, ar: "ماذا فَعَلْتِ" }
        ],
        p2: [
            { tr: "Bayramın mübarek olsun!", order: 1, ar: "عيد مُبارَك!" },
            { tr: "Bayram namazını", order: 3, ar: "صَلاة العيد." },
            { tr: "kıldım.", order: 2, ar: "صَلَّيْتُ" } // Boşluk Dolduruldu
        ]
    },
    {
        p1: [
            { tr: "Sonra", order: 1, ar: "ثُمَّ" },
            { tr: "ne yaptın?", order: 2, ar: "ماذا فَعَلْتِ؟" }
        ],
        p2: [
            { tr: "Ailemle", order: 3, ar: "مَعَ أُسْرَتِي." }, // Boşluk Dolduruldu
            { tr: "bayram yemeği", order: 2, ar: "طَعام العيد" },
            { tr: "yedim.", order: 1, ar: "تَناوَلْتُ" }
        ]
    },
    {
        p1: [
            { tr: "Peki ya öğleden", order: 2, ar: "الظُّهْر؟" },
            { tr: "sonra?", order: 1, ar: "وَبَعْد" }
        ],
        p2: [
            { tr: "Arkadaşlarımı", order: 2, ar: "أَصْدِقائي" }, // Boşluk Dolduruldu
            { tr: "ve akrabalarımızı", order: 3, ar: "وَأَقارِبَنا." },
            { tr: "ziyaret ettim.", order: 1, ar: "زُرْتُ" }
        ]
    },
    {
        p1: [
            { tr: "Nice senelere (Her yılınız hayır olsun).", order: 1, ar: "كُلُّ عامٍ وَأَنْتُم بِخَيْر." } 
        ],
        p2: [ { tr: "Teşekkürler.", order: 1, ar: "شُكْرًا" }]
    }
]
};
/* kelimeler (kart + hafıza oyunu) */
window.data.words = [
    { tr: "Müslümanlar", ar: "مُسْلِمون" },
    { tr: "Komşular", ar: "جيران" },
    { tr: "Muhtaçlar", ar: "مُحْتاجين" },
    { tr: "Yaşlılar", ar: "مُسِنّين" },
    { tr: "Küçükler / Çocuklar", ar: "صِغار" },
    { tr: "Büyükler / Yetişkinler", ar: "كِبار" },
    { tr: "Misafirler", ar: "ضُيوف" },
    { tr: "Akrabalar", ar: "أَقارِب" },
    { tr: "Aile", ar: "عائِلَة" },
    { tr: "Güler yüzlü", ar: "مُبْتَسِمًا" },
    { tr: "Kızgın / Öfkeli", ar: "غَضْبان" },
    { tr: "Mutlu", ar: "مَبْسوطًا" },
    { tr: "Üzgün", ar: "حَزينَة" },
    { tr: "Dürüst", ar: "صادِقًا" },
    { tr: "Yalancı", ar: "كاذِبًا" },
    { tr: "Sabırlı", ar: "صَبورَة" },
    { tr: "Aceleci", ar: "عَجولَة" },
    { tr: "Şaşkın", ar: "مُتَعَجِّب" },
    { tr: "Endişeli", ar: "قَلِقَة" },
    { tr: "Sevinç / Neşe", ar: "فَرَح" },
    { tr: "Yardım ediyorlar", ar: "يُساعِدونَ" },
    { tr: "Seviyorlar", ar: "يُحِبّونَ" },
    { tr: "Saygı duyuyorlar", ar: "يَحْتَرِمونَ" },
    { tr: "İkram ediyorlar", ar: "يُكْرِمونَ" },
    { tr: "Namaz kılıyorlar", ar: "يُصَلّونَ" },
    { tr: "Yiyorlar / Alıyorlar", ar: "يَتَناوَلونَ" },
    { tr: "Ziyaret ediyorlar", ar: "يَزُورونَ" },
    { tr: "Teşekkür ediyorlar", ar: "يَشْكُرونَ" },
    { tr: "Kutluyor", ar: "يَحْتَفِلُ" },
    { tr: "Artıyor", ar: "يَزْدادُ" },
    { tr: "Bayram", ar: "عيد" },
    { tr: "Ramazan Bayramı", ar: "عيد الفِطْر" },
    { tr: "Kurban Bayramı", ar: "عيد الأَضْحى" },
    { tr: "Bayram Namazı", ar: "صَلاة عيد" },
    { tr: "Yemek", ar: "طَعام" },
    { tr: "Yardımlaşma", ar: "تَعاوُن" },
    { tr: "Yardım", ar: "مُساعَدَة" },
    { tr: "Daima / Her zaman", ar: "دائِمًا" },
    { tr: "Asla / Hiçbir zaman", ar: "أَبَدًا" },
    { tr: "Bayramınız kutlu olsun", ar: "كُلّ عام وَأَنْتُم بِخَيْر" }
    ];
