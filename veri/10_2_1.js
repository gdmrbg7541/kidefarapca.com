/* 10_2_1 dersinin cümleleri/diyaloğu (ortak muhadese.html + simultane.js kullanır) */
window.data = {
    sentence: [
        // 1. Cümle: Ben hastayım.
        {
            words: [
                { tr: "Ben", order: 1, ar: "أَنا" },
                { tr: "hastayım.", order: 2, ar: "مَريض." }
            ]
        },

        // 2. Cümle: Şiddetli baş ağrım var.
        {
            words: [
                { tr: "Bende", order: 1, ar: "عِنْدي" },
                { tr: "şiddetli", order: 3, ar: "شَديد." },
                { tr: "baş ağrısı", order: 2, ar: "صُداع" },
                { tr: "var.", order: 1, ar: "عِنْدي" } 
            ]
        },

        // 3. Cümle: Öksürüğüm var.
        {
            words: [
                { tr: "Öksürüğüm", order: 2, ar: "كُحَّة." },
                { tr: "var.", order: 1, ar: "عِنْدي" }
            ]
        },

        // 4. Cümle: Kulağımda ağrı hissediyorum.
        {
            words: [
                { tr: "Kulağımda", order: 3, ar: "في أُذُني." },
                { tr: "ağrı", order: 2, ar: "بِأَلَم" },
                { tr: "hissediyorum.", order: 1, ar: "أَشْعُرُ" }
            ]
        },

        // 5. Cümle: Boğazımda ağrı hissediyorum.
        {
            words: [
                { tr: "Boğazımda", order: 3, ar: "في حَلْقي." },
                { tr: "ağrı", order: 2, ar: "بِأَلَم" },
                { tr: "hissediyorum.", order: 1, ar: "أَشْعُرُ" }
            ]
        },

        // 6. Cümle: Yüksek ateşim var.
        {
            words: [
                { tr: "Yüksek", order: 3, ar: "مُرْتَفِعَة." },
                { tr: "ateşim", order: 2, ar: "حَرارَة" },
                { tr: "var.", order: 1, ar: "عِنْدي" }
            ]
        },

        // 7. Cümle: Karnımda sancı yok.
        {
            words: [
                { tr: "Karnımda", order: 3, ar: "في بَطْني." },
                { tr: "sancı", order: 2, ar: "مَغْص" },
                { tr: "yok.", order: 1, ar: "ما عِنْدي" }
            ]
        },

        // 8. Cümle: İlacı alman gerekir.
        {
            words: [
                { tr: "İlacı", order: 3, ar: "الدَّواء." },
                { tr: "kullanman/tüketmen", order: 2, ar: "أَنْ تَتَناوَلَ" },
                { tr: "gerekir.", order: 1, ar: "يَجِبُ عَلَيْكَ" }
            ]
        },

        // 9. Cümle: Ben hastayım, baş ağrım var.
        {
            words: [
                { tr: "Ben", order: 1, ar: "أَنا" },
                { tr: "hastayım,", order: 2, ar: "مَريض،" },
                { tr: "baş ağrım", order: 4, ar: "صُداع." },
                { tr: "var.", order: 3, ar: "عِنْدي" }
            ]
        },

        // 10. Cümle: Ben hastayım (kadın), kulağımda ağrı var.
        {
            words: [
                { tr: "Ben", order: 1, ar: "أَنا" },
                { tr: "hastayım,", order: 2, ar: "مَريضَة،" },
                { tr: "kulağımda", order: 5, ar: "في أُذُني." },
                { tr: "ağrı", order: 4, ar: "أَلَم" },
                { tr: "var.", order: 3, ar: "عِنْدي" }
            ]
        },

        // 11. Cümle: Sen hastasın, öksürüğün var.
        {
            words: [
                { tr: "Sen", order: 1, ar: "أَنْتَ" },
                { tr: "hastasın,", order: 2, ar: "مَريض،" },
                { tr: "öksürüğün", order: 4, ar: "كُحَّة." },
                { tr: "var.", order: 3, ar: "عِنْدَكَ" }
            ]
        },

        // 12. Cümle: Sen hastasın (kadın), baş ağrın var.
        {
            words: [
                { tr: "Sen", order: 1, ar: "أَنْتِ" },
                { tr: "hastasın,", order: 2, ar: "مَريضَة،" },
                { tr: "başında", order: 5, ar: "في رَأْسِكِ." },
                { tr: "ağrı", order: 4, ar: "أَلَم" },
                { tr: "var.", order: 3, ar: "عِنْدَكِ" }
            ]
        },

        // 13. Cümle: O hasta, karnında sancı var.
        {
            words: [
                { tr: "O", order: 1, ar: "هُو" },
                { tr: "hasta,", order: 2, ar: "مَريض،" },
                { tr: "karnında", order: 5, ar: "في بَطْنِه." },
                { tr: "sancı", order: 4, ar: "مَغْص" },
                { tr: "var. (onun)", order: 3, ar: "عِنْدَهُ" }
            ]
        },

        // 14. Cümle: O hasta (kadın), nezlesi var.
        {
            words: [
                { tr: "O", order: 1, ar: "هِي" },
                { tr: "hasta,", order: 2, ar: "مَريضَة،" },
                { tr: "nezlesi", order: 4, ar: "زُكام." },
                { tr: "var.(onun)", order: 3, ar: "عِنْدَها" }
            ]
        },

        // 15. Cümle: Dedem hasta, tansiyonu yüksek.
        {
            words: [
                { tr: "Dedem", order: 1, ar: "جَدّي" },
                { tr: "hasta,", order: 2, ar: "مَريض،" },
                { tr: "onun tansiyonu", order: 3, ar: "ضَغْطُهُ" },
                { tr: "yüksek.", order: 4, ar: "مُرْتَفِع." }
            ]
        },

        // 16. Cümle: Kız kardeşim hasta, ateşi yüksek.
        {
            words: [
                { tr: "Kız kardeşim", order: 1, ar: "أُخْتي" },
                { tr: "hasta,", order: 2, ar: "مَريضَة،" },
                { tr: "ateşi", order: 3, ar: "حَرارَتُها" },
                { tr: "yüksek.", order: 4, ar: "مُرْتَفِعَة." }
            ]
        },

        // 17. Cümle: Sağlık her insan için çok önemlidir.
        {
            words: [
                { tr: "Sağlık", order: 1, ar: "الصِّحَّة" },
                { tr: "her", order: 3, ar: "لِكُلّ" },
                { tr: "insan", order: 4, ar: "إِنْسان" },
                { tr: "için", order: 3, ar: "لِكُلّ" },
                { tr: "çok", order: 5, ar: "جِدًّا." },
                { tr: "önemlidir.", order: 2, ar: "مُهِمَّة" }
            ]
        },

        // 18. Cümle: Vücudun organları vardır, mesela: Baş...
        {
            words: [
                { tr: "Vücudun", order: 2, ar: "لِلْجِسْم" },
                { tr: "organları", order: 1, ar: "أَعْضاء" },
                { tr: "vardır,", order: 1, ar: "لِلْجِسْم" },
                { tr: "mesela:", order: 3, ar: "مِثْل:" },
                { tr: "Baş,", order: 4, ar: "الرَّأْس،" }
            ]
        },

        // 19. Cümle: Göz, kulak, burun, dil, dişler ve el.
        {
            words: [
                { tr: "Göz,", order: 1, ar: "وَالعَيْن،" },
                { tr: "kulak,", order: 2, ar: "وَالأُذُن،" },
                { tr: "burun,", order: 3, ar: "وَالأَنْف،" },
                { tr: "dil,", order: 4, ar: "وَاللِّسان،" },
                { tr: "dişler,", order: 5, ar: "وَالأَسْنان،" },
                { tr: "ve el.", order: 6, ar: "وَاليَد." }
            ]
        },

        // 20. Cümle: Gözümle görürüm, kulağımla duyarım.
        {
            words: [
                { tr: "Gözümle", order: 2, ar: "بِعَيْني،" },
                { tr: "görürüm,", order: 1, ar: "أَنا أَرى" },
                { tr: "kulağımla", order: 4, ar: "بِأُذُني." },
                { tr: "ve duyarım.", order: 3, ar: "وَأَسْمَعُ" }
            ]
        },

        // 21. Cümle: Burnumla koklarım, dilimle tadarım.
        {
            words: [
                { tr: "Burnumla", order: 2, ar: "بِأَنْفي،" },
                { tr: "koklarım,", order: 1, ar: "وَأَشُمُّ" },
                { tr: "dilimle", order: 4, ar: "بِلِساني." },
                { tr: "ve tadarım.", order: 3, ar: "وَأَذوقُ" }
            ]
        },

        // 22. Cümle: ve elimle dokunurum.
        {
            words: [
                { tr: "ve", order: 1, ar: "وَأَلْمِسُ" },
                { tr: "elimle", order: 2, ar: "بِيَدي." },
                { tr: "dokunurum.", order: 1, ar: "وَأَلْمِسُ" },
            ]
        },

        // 23. Cümle: Bazen hastalanırım.
        {
            words: [
                { tr: "Bazen", order: 1, ar: "أَحْيانًا" },
                { tr: "hastalanırım.", order: 2, ar: "أَمْرَضُ." }
            ]
        },

        // 24. Cümle: Ağrı hissettiğim zaman hastaneye doktora giderim.
        {
            words: [
                { tr: "Ağrı", order: 3, ar: "بِالأَلَم،" },
                { tr: "hissettiğim", order: 2, ar: "أَشْعُرُ" },
                { tr: "zaman,", order: 1, ar: "عِنْدَما" },
                { tr: "hastaneye", order: 6, ar: "في المُسْتَشْفى." },
                { tr: "doktora", order: 5, ar: "إِلى الطَّبيب" },
                { tr: "giderim.", order: 4, ar: "أَذْهَبُ" },
            ]
        },

        // 25. Cümle: Doktor beni muayene eder ve tedavi eder.
        {
            words: [
                { tr: "Doktor", order: 1, ar: "الطَّبيب" },
                { tr: "beni muayene eder", order: 2, ar: "يَفْحَصُني" },
                { tr: "ve tedavi eder,", order: 3, ar: "وَيُعالِجُني." }
            ]
        },

        // 26. Cümle: Sonra eczaneden ilacı alırım.
        {
            words: [
                { tr: "Sonra", order: 1, ar: "ثُمَّ" },
                { tr: "eczaneden", order: 4, ar: "مِن الصَّيْدَلِيَّة." },
                { tr: "ilacı", order: 3, ar: "الدَّواء" },
                { tr: "alırım.", order: 2, ar: "آخُذُ	" }
            ]
        },

        // 27. Cümle: Sağlıklı gıda almam gerekir.
        {
            words: [
                { tr: "Sağlıklı", order: 4, ar: "الصِّحِّيّ،" },
                { tr: "gıda", order: 3, ar: "الغِذاء" },
                { tr: "almam", order: 2, ar: "أَنْ أَتَناوَلَ" },
                { tr: "gerekir...", order: 1, ar: "يَجِبُ عَلَيَّ" }
            ]
        },

        // 28. Cümle: Sebze ve meyveler gibi.
        {
            words: [
                { tr: "Sebze", order: 2, ar: "الخَضْرَوات" },
                { tr: "ve meyveler", order: 3, ar: "وَالفَواكِه." },
                { tr: "gibi.", order: 1, ar: "مِثْل" }
            ]
        },

        // 29. Cümle: Yemekten önce ve sonra ellerimi su ve sabunla yıkamam gerekir.
        {
            words: [
                { tr: "Yemekten", order: 7, ar: "الطَّعام" },
                { tr: "önce", order: 6, ar: "قَبْلَ" },
                { tr: "ve sonrasında", order: 8, ar: "وَبَعْدَه." },
                { tr: "su (ile)", order: 4, ar: "بِالماء" },
                { tr: "ve sabunla", order: 5, ar: "وَالصّابون" },
                { tr: "ellerimi", order: 3, ar: "يَدَيّ" },
                { tr: "yıkamam", order: 2, ar: " أَنْ أَغْسِلَ" },
                { tr: "gerekir.", order: 1, ar: "عَلَيّ" }
            ]
        },

        // 30. Cümle: Her gün dişlerimi diş fırçasıyla temizlemem gerekir.
        {
            words: [
                { tr: "Her", order: 6, ar: "كُلّ" },
                { tr: "gün", order: 7, ar: "يَوْم." },
                { tr: "diş", order: 5, ar: "الأَسْنان" },
                { tr: "fırçasıyla", order: 4, ar: "بِفُرْشاة " },
                { tr: "dişlerimi", order: 3, ar: "أَسْناني" },
                { tr: "temizlemem", order: 2, ar: "أَنْ أُنَظِّفَ" },
                { tr: "gerekir.", order: 1, ar: "عَلَيّ" }
            ]
        },

        // 31. Cümle: Doktora giderim.
        {
            words: [
                { tr: "Doktora", order: 2, ar: "إِلى الطَّبيب." },
                { tr: "giderim.", order: 1, ar: "أَذْهَبُ" }
            ]
        },

        // 32. Cümle: Eczaneden ilaç alırım.
        {
            words: [
                { tr: "Eczaneden", order: 3, ar: "مِن الصَّيْدَلِيّة." },
                { tr: "ilacı", order: 2, ar: "الدَّواء" },
                { tr: "alırım.", order: 1, ar: "آخُذُ" }
            ]
        },

       
        // 34. Cümle: Günde üç kez ilaç alıyorum.
        {
            words: [
                { tr: "Günde", order: 5, ar: "في اليَوْم." },
                { tr: "üç", order: 3, ar: "ثَلاث" },
                { tr: "kez", order: 4, ar: "مَرّات" },
                { tr: "ilaç", order: 2, ar: "الدَّواء" },
                { tr: "alıyorum.", order: 1, ar: "أَتَناوَلُ" }
            ]
        },

        // 35. Cümle: Ben sebze ve meyve yiyorum.
        {
            words: [
                { tr: "Sebze", order: 2, ar: "الخَضْرَوات" },
                { tr: "ve meyve", order: 3, ar: "وَالفَواكِه." },
                { tr: "yiyorum.", order: 1, ar: "آكُلُ" }
            ]
        },

        // 37. Cümle: Hastalıkta soğuk su içmem.
        {
            words: [
                { tr: "Ben", order: 1, ar: "أَنا" },
                { tr: "Hastalıkta", order: 5, ar: "عِنْد المَرَض." },
                { tr: "soğuk", order: 4, ar: "بارِدًا" },
                { tr: "su", order: 3, ar: "ماءً" },
                { tr: "içmem.", order: 2, ar: "أَنا لا أَشْرَبُ" }
            ]
        },

        // 38. Cümle: Ağrı varken doktora giderim.
        {
            words: [
                { tr: "Ben", order: 1, ar: "أَنا" },
                { tr: "ağrı varken (ağrıda)", order: 4, ar: "عِنْد الأَلَم." },
                { tr: "doktora", order: 3, ar: "إِلى الطَّبيب" },
                { tr: "giderim.", order: 2, ar: "أَذْهَبُ" }
            ]
        },

        // 39. Cümle: Hızlı yemekler yeme.
        {
            words: [
                { tr: "Hızlı", order: 3, ar: "سَريعَة." },
                { tr: "yemekler", order: 2, ar: "وَجَبات" },
                { tr: "yeme.", order: 1, ar: "لا تَتَناوَلْ" }
            ]
        },

        // 40. Cümle: Zararlı içecekler içme.
        {
            words: [
                { tr: "Zararlı", order: 3, ar: "مُضِرَّة." },
                { tr: "içecekler", order: 2, ar: "مَشْروبات" },
                { tr: "içme.", order: 1, ar: "لا تَشْرَبْ" }
            ]
        },

        // 41. Cümle: Çok ağrı kesici alma.
        {
            words: [
                { tr: "Çok", order: 3, ar: "كَثيرًا." },
                { tr: "ağrı kesici", order: 2, ar: "مُسَكِّنًا" },
                { tr: "alma.", order: 1, ar: "لا تَتَناوَلْ" }
            ]
        },

        // 42. Cümle: Çok yeme.
        {
            words: [
                { tr: "Çok", order: 2, ar: "كَثيرًا." },
                { tr: "yeme.", order: 1, ar: "لا تَأْكُلْ" }
            ]
        }
    ],
dialog: [
    // --- 1. GÖRSEL: DOKTOR VE AHMED DİYALOĞU ---
    {
        p1: [
            { tr: "Ahmet,", order: 3, ar: "يا أَحْمَد؟" },
            { tr: "senin", order: 2, ar: "بِكَ" },
            { tr: "neyin var?", order: 1, ar: "ما" }
            
        ],
        p2: [
            { tr: "Ben hastayım,", order: 1, ar: "أَنا مَريض،" },
            { tr: "şiddetli", order: 4, ar: "شَديد" },
            { tr: "baş ağrım", order: 3, ar: "صُداع" }, // Boşluk görseldeki kelime bankasından tamamlandı
            { tr: "ve öksürüğüm", order: 5, ar: "وَكُحَّة." },
            { tr: "var.", order: 2, ar: "عِنْدي" }
        ]
    },
    {
        p1: [
            { tr: "Ayrıca", order: 3, ar: "أَيْضًا؟" },
            { tr: "ne", order: 1, ar: "بِماذا" },
            { tr: "hissediyorsun?", order: 2, ar: "تَشْعُرُ" }
        ],
        p2: [
            { tr: "Kulağımda", order: 3, ar: "في أُذُني" },
            { tr: "ve boğazımda", order: 4, ar: "وَحَلْقي." },
            { tr: "ağrı", order: 2, ar: "بِأَلَم" }, // Boşluk tamamlandı
            { tr: "hissediyorum.", order: 1, ar: "أَشْعُرُ" }
        ]
    },
    {
        p1: [
            { tr: "Ateşin", order: 3, ar: "حَرارَة؟" }, // Boşluk tamamlandı
            { tr: "var", order: 2, ar: "عِنْدَكَ" },
            { tr: "mı?", order: 1, ar: "هَل" }
        ],
        p2: [
            { tr: "Evet,", order: 1, ar: "نَعَم،" },
            { tr: "yüksek", order: 4, ar: "مُرْتَفِعَة." },
            { tr: "ateşim", order: 3, ar: "حَرارَة" },
            { tr: "var.", order: 2, ar: "عِنْدي" }
        ]
    },
    {
        p1: [
            { tr: "Tansiyon", order: 1, ar: "الضَّغْط" },
            { tr: "normal,", order: 2, ar: "طَبيعي،" }, // Kelime bankasından tahmin
            { tr: "karnında", order: 6, ar: "في بَطْنِك؟" },
            { tr: "sancı", order: 5, ar: "مَغْص" },
            { tr: "var", order: 4, ar: "عِنْدَكَ" },
            { tr: "mı?", order: 3, ar: "هَل" }
        ],
        p2: [
            { tr: "Hayır,", order: 1, ar: "لا،" },
            { tr: "karnımda", order: 4, ar: "في بَطْني." },
            { tr: "sancı", order: 3, ar: "مَغْص" }, // Boşluk tamamlandı
            { tr: "yok.", order: 2, ar: "ما عِنْدي" }
        ]
    },
    {
        p1: [
            { tr: "Bu", order: 1, ar: "هذا" },
            { tr: "nezle,", order: 2, ar: "زُكام،" }, // Boşluk tamamlandı
            { tr: "bu ilacı", order: 5, ar: "هذا الدَّواء." },
            { tr: "alman", order: 4, ar: "أَنْ تَتَناوَلَ" },
            { tr: "gerekir.", order: 3, ar: "يَجِبُ عَلَيْكَ" }
        ],
        p2: [
            { tr: "Günde", order: 3, ar: "في اليَوْم؟" },
            { tr: "kaç", order: 1, ar: "كَم" },
            { tr: "kez?", order: 2, ar: "مَرَّة" } // Boşluk tamamlandı
        ]
    },
    {
        p1: [
            { tr: "Yemekten", order: 4, ar: "الطَّعام،" },
            { tr: "sonra", order: 3, ar: "بَعْد" },
            { tr: "üç", order: 1, ar: "ثَلاثَة" },
            { tr: "kez,", order: 2, ar: "مَرّات" },
            { tr: "soğuk", order: 7, ar: "بارِدًا‫.‬" },
            { tr: "su", order: 6, ar: "ماءً" },
            { tr: "içme.", order: 5, ar: "وَلا تَشْرَبْ" },
            { tr: "Allah şifa versin.", order: 8, ar: "شَفاكَ الله." }
        ],
        p2: [ { tr: "Teşekkürler.", order: 1, ar: "شُكْرًا‫.‬" } ]
    },

    // --- 2. GÖRSEL: DOKTOR VE SALMAN DİYALOĞU ---
    {
        p1: [
            { tr: "Selman,", order: 3, ar: "يا سَلْمان؟" },
            { tr: "şikayetin", order: 2, ar: "بِكَ" },
            { tr: "nedir?", order: 1, ar: "ما" }
        ],
        p2: [
            { tr: "Baş ağrım", order: 2, ar: "صُداع" },
            { tr: "ve öksürüğüm", order: 3, ar: "وَكُحَّة." },
            { tr: "var.", order: 1, ar: "عِنْدي" }
        ]
    },
    {
        p1: [
            { tr: "Bu", order: 1, ar: "هذا" },
            { tr: "nezle,", order: 2, ar: "زُكام،" },
            { tr: "endişeye gerek yok.", order: 3, ar: "لا داعِي لِلْقَلَق." }
        ],
        p2: [
            { tr: "Ne", order: 1, ar: "ماذا" },
            { tr: "yapmam", order: 3, ar: "أَنْ أَفْعَل؟" },
            { tr: "gerekir?", order: 2, ar: "يَجِبُ" }
        ]
    },
    {
        p1: [
            { tr: "Soğuk", order: 3, ar: "بارِدًا،" },
            { tr: "su", order: 2, ar: "ماءً" },
            { tr: "içme,", order: 1, ar: "لا تَشْرَبْ" },
            { tr: "ayrıca", order: 8, ar: "أَيْضًا." },
            { tr: "bu", order: 6, ar: "هذا" },
            { tr: "ilacı", order: 7, ar: "الدَّواء" },
            { tr: "alman", order: 5, ar: "أَنْ تَتَناوَلَ" },
            { tr: "gerekir.", order: 4, ar: "وَيَجِبُ عَلَيْكَ" }
        ],
        p2: [
            { tr: "Günde", order: 3, ar: "في اليَوْم؟" },
            { tr: "kaç", order: 1, ar: "كَم" },
            { tr: "kez?", order: 2, ar: "مَرَّة" }
        ]
    },
    {
        p1: [
            { tr: "İki kez.", order: 1, ar: "مَرَّتَيْن." }
        ],
        p2: [
            { tr: "Teşekkürler.", order: 1, ar: "شُكْرًا." }
        ]
    },

    // --- 3. GÖRSEL GRUBU: HASTALIKLAR VE HİSLER (Kısa Diyaloglar) ---
    {
        p1: [
            { tr: "Neyin", order: 1, ar: "ما" },
            { tr: "var?", order: 2, ar: "بِكِ؟" }
        ],
        p2: [
            { tr: "Ben", order: 1, ar: "أَنا" },
            { tr: "hastayım,", order: 2, ar: "مَريضَة" },
            { tr: "boğazımda", order: 5, ar: "في حَلْقي." },
            { tr: "ağrı", order: 4, ar: "أَلَم" },
            { tr: "var.", order: 3, ar: "عِنْدي" }
        ]
    },
    {
        p1: [
            { tr: "Neyin", order: 1, ar: "ما" },
            { tr: "var?", order: 2, ar: "بِكَ؟" }
        ],
        p2: [
            { tr: "Ben", order: 1, ar: "أَنا" },
            { tr: "hastayım,", order: 2, ar: "مَريض،" },
            { tr: "baş ağrım", order: 4, ar: "صُداع." },
            { tr: "var.", order: 3, ar: "عِنْدي" }
        ]
    },
    {
        p1: [
            { tr: "Onun", order: 2, ar: "بِهِ؟" },
            { tr: "neyi var?", order: 1, ar: "ما" }
        ],
        p2: [
            { tr: "O", order: 1, ar: "هُو" },
            { tr: "hasta,", order: 2, ar: "مَريض،" },
            { tr: "onun", order: 3, ar: "عِنْدَهُ" },
            { tr: "tansiyonu", order: 4, ar: "ضَغْط" },
            { tr: "yüksektir.", order: 5, ar: "مُرْتَفِع." }
        ]
    },
    {
        p1: [
            { tr: "Onun", order: 2, ar: "بِها؟" },
            { tr: "neyi var?", order: 1, ar: "ما" }
        ],
        p2: [
            { tr: "O", order: 1, ar: "هِي" },
            { tr: "hasta,", order: 2, ar: "مَريضَة،" },
            { tr: "nezlesi", order: 4, ar: "زُكام." },
            { tr: "var.", order: 3, ar: "عِنْدَها" }
        ]
    },
    {
        p1: [
            { tr: "Sen", order: 3, ar: "أَنْتَ؟" },
            { tr: "ne", order: 1, ar: "بِماذا" },
            { tr: "hissediyorsun?", order: 2, ar: "تَشْعُرُ " }
        ],
        p2: [
            { tr: "Ben", order: 1, ar: "أَنا" },
            { tr: "kulağımda", order: 4, ar: "في أُذُني." },
            { tr: "ağrı", order: 3, ar: "بِأَلَم" },
            { tr: "hissediyorum.", order: 2, ar: "أَشْعُرُ" }
        ]
    },

    // --- 4. GÖRSEL: DOKTOR VE HASTA (Kısa) ---
    {
        p1: [
            { tr: "Neyin", order: 2, ar: "بِكَ؟" },
            { tr: "var?", order: 1, ar: "ما" }
        ],
        p2: [
            { tr: "Başımda", order: 3, ar: "في رَأْسي." },
            { tr: "ağrı", order: 2, ar: "بِأَلَم" },
            { tr: "hissediyorum.", order: 1, ar: "أَشْعُرُ" }
        ]
    },
    {
        p1: [
            { tr: "Şimdi", order: 3, ar: "الآن." },
            { tr: "tansiyonunu", order: 2, ar: "ضَغْطَكَ" },
            { tr: "ölçeceğim.", order: 1, ar: "سَأَفْحَصُ" }
        ],
        p2: [
            { tr: "Tansiyonum", order: 2, ar: "ضَغْطي" },
            { tr: "yüksek ", order: 3, ar: "مُرْتَفِع؟" },
            { tr: "mi?", order: 1, ar: "هَل" }
        ]
    },
    {
        p1: [
            { tr: "Evet,", order: 1, ar: "نَعَم،" },
            { tr: "biraz", order: 3, ar: "قَليلًا،" },
            { tr: "yüksek", order: 2, ar: "مُرْتَفِع" },
            { tr: "fakat", order: 4, ar: "وَلَكِنْ" },
            { tr: "endişeye gerek yok.", order: 5, ar: "لا داعِي لِلْقَلَق." }
        ],
        p2: [
            { tr: "Ne", order: 1, ar: "ماذا" },
            { tr: "yapmam", order: 3, ar: "أَنْ أَفْعَل؟" },
            { tr: "gerekir?", order: 2, ar: "يَجِبُ" }
        ]
    },
    {
        p1: [
            { tr: "Bu", order: 3, ar: "هذا" },
            { tr: "ilacı", order: 4, ar: "الدَّواء." },
            { tr: "alman (tüketmen)", order: 2, ar: "أَنْ تَتَناوَلَ" },
            { tr: "gerekir.", order: 1, ar: "يَجِبُ عَلَيْكَ" }
        ],
        p2: [
            { tr: "Geçmiş olsun (Allah şifa versin).", order: 2, ar: "شَفاكَ الله." }, // Doktor söylüyor aslında ama format gereği buraya aldım
            { tr: "Affedersiniz/Rica ederim.", order: 1, ar: "عَفْوًا،" }
        ]
    }
]
};
/* kelimeler (kart + hafıza oyunu) */
window.data.words = [
     // Hastalıklar ve Semptomlar
    { tr: "Ben hastayım", ar: "أَنا مَريض" },
    { tr: "Şiddetli baş ağrısı", ar: "صُداع شَديد" },
    { tr: "Öksürük", ar: "كُحَّة" },
    { tr: "Ağrı / Acı", ar: "أَلَم" },
    { tr: "Yüksek ateş", ar: "حَرارَة مُرْتَفِعَة" },
    { tr: "Karın ağrısı / Sancı", ar: "مَغْص" },
    { tr: "Nezle / Grip", ar: "زُكام" },
    { tr: "Tansiyon", ar: "ضَغْط" },
    { tr: "Ağrı hissediyorum", ar: "أَشْعُرُ بِأَلَم" },

// Vücut Organları
    { tr: "Vücut", ar: "جِسْم" },
    { tr: "Baş", ar: "رَأْس" },
    { tr: "Göz", ar: "عَيْن" },
    { tr: "Kulak", ar: "أُذُن" },
    { tr: "Burun", ar: "أَنْف" },
    { tr: "Dil", ar: "لِسان" },
    { tr: "Dişler", ar: "أَسْنان" },
    { tr: "El", ar: "يَد" },
    { tr: "Boğaz / Hançere", ar: "حَلْق" },
    { tr: "Karın / Mide", ar: "بَطْن" },

    // Duyular ve Eylemler
    { tr: "Görüyorum", ar: "أَرى" },
    { tr: "Duyuyorum", ar: "أَسْمَعُ" },
    { tr: "Kokluyorum", ar: "أَشُمُّ" },
    { tr: "Tadıyorum", ar: "أَذوقُ" },
    { tr: "Dokunuyorum", ar: "أَلْمِسُ" },
    { tr: "Yıkıyorum", ar: "أَغْسِلُ" },
    { tr: "Temizliyorum", ar: "أُنَظِّفُ" },

    // Tıbbi Terimler ve Tedavi
    { tr: "Sağlık", ar: "الصِّحَّة" },
    { tr: "Doktor", ar: "طَّبيب" },
    { tr: "Hastane", ar: "مُسْتَشْفى" },
    { tr: "İlaç", ar: "دَّواء" },
    { tr: "Eczane", ar: "صَّيْدَلِيَّة" },
    { tr: "Muayene ediyor", ar: "يَفْحَصُ" },
    { tr: "Tedavi ediyor", ar: "يُعالِجُ" },
    { tr: "Ağrı kesici", ar: "مُسَكِّنًا" },

    // Sağlık Tavsiyeleri ve Beslenme
    { tr: "Sağlıklı gıda", ar: "غِذاء صِحِّيّ" },
    { tr: "Sebze ve meyveler", ar: "الخَضْرَوات وَالفَواكِه" },
    { tr: "Hızlı yemekler (Fast food)", ar: "وَجَبات سَريعَة" },
    { tr: "Zararlı içecekler", ar: "مَشْروبات مُضِرَّة" },
    { tr: "Sabun", ar: "صابون" },
    { tr: "Diş fırçası", ar: "فُرْشاة الأَسْنان" },

    // Örnek Cümle Kalıpları
    { tr: "İlaç alıyorum", ar: "أَتَناوَلُ الدَّواء" },
    { tr: "Doktora gidiyorum", ar: "أَذْهَبُ إِلى الطَّبيب" },
    { tr: "Ellerimi yıkıyorum", ar: "أَغْسِلُ يَدَيّ" },
    { tr: "Dişlerimi temizliyorum", ar: "أُنَظِّفُ أَسْناني" },
    { tr: "Çok yeme", ar: "لا تَأْكُلْ كَثيرًا" }
];
