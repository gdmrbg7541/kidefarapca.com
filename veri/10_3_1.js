/* 10_3_1 dersinin cümleleri/diyaloğu (ortak muhadese.html + simultane.js kullanır) */
window.data = {
sentence: [
    // --- BÖLÜM 1: TANIŞMA VE KİMLİK ---

    // 1. Senin uyruğun nedir?
    {
        words: [
            { tr: "Senin uyruğun", order: 2, ar: "جِنْسِيَّتُكَ؟" },
            { tr: "nedir?", order: 1, ar: "مَا" }
        ]
    },
    // 2. Ben Türküm.
    {
        words: [
            { tr: "Ben", order: 1, ar: "أَنَا" },
            { tr: "Türküm.", order: 2, ar: "تُرْكِيٌّ." }
        ]
    },
    // 3. Sen nerelisin? (Kadın)
    // Mantık: Sen (Anti) - Nere (Eyne) -den (Min)
    {
        words: [
            { tr: "Sen", order: 2, ar: "أَنْتِ؟" },
            { tr: "neredensin?", order: 1, ar: "مِنْ أَيْنَ" }
        ]
    },
    // 4. Ben Mısırlıyım.
    // Mantık: Ben (Ena) - Mısır (Misr) -'danım (Min)
    {
        words: [
            { tr: "Ben", order: 1, ar: "أَنَا" },
            { tr: "Mısır'danım.", order: 2, ar: "مِنْ مِصْر." }
        ]
    },
    // 5. Nerede yaşıyorsun?
    {
        words: [
            { tr: "Nerede", order: 1, ar: "أَيْنَ" },
            { tr: "yaşıyorsun?", order: 2, ar: "تَعِيشُ؟" }
        ]
    },
    // 6. Konya şehrinde yaşıyorum.
    // Mantık: Konya (Konya) - şehrin (Medineti) -de (Fi) - yaşıyorum (Eişu)
    {
        words: [
            { tr: "Konya", order: 3, ar: "قُونْيَا." },
            { tr: "şehrinde", order: 2, ar: "فِي مَدِينَة" },
            { tr: "yaşıyorum.", order: 1, ar: "أَعِيشُ" }
        ]
    },

    // --- BÖLÜM 2: ŞEHİRLER VE ÖZELLİKLERİ ---

    // 7. Konya şehri ne ile meşhurdur?
    {
        words: [
            { tr: "Konya", order: 4, ar: "قُونْيَا." },
            { tr: "şehri", order: 3, ar: "مَدِينَة" },
            { tr: "ne ile", order: 1, ar: "بِمَاذَا" },
            { tr: "meşhurdur?", order: 2, ar: "تَشْتَهِرُ" }
        ]
    },
    // 8. Mevlana Müzesi ile meşhurdur.
    {
        words: [
            { tr: "Mevlana", order: 3, ar: "مَوْلَانَا." },
            { tr: "müzesi ile", order: 2, ar: "بِمُتْحَف" },
            { tr: "meşhurdur.", order: 1, ar: "تَشْتَهِرُ" }
        ]
    },
    // 9. Türkiye'de nerede gezindin?
    {
        words: [
            { tr: "Türkiyede", order: 3, ar: "في تُرْكِيا." },
            { tr: "nerede", order: 1, ar: "أَيْنَ" },
            { tr: "gezindin?", order: 2, ar: "تَجَوَّلْتِ" }
        ]
    },
    // 10. İstanbul'da gezindim.
    {
        words: [
            { tr: "İstanbulda", order: 2, ar: "فی إِسْطَنْبُول." },
            { tr: "gezindim.", order: 1, ar: "تَجَوَّلْتُ" }
        ]
    },
    // 11. Şu an nereye gidiyorsun?
    {
        words: [
            { tr: "Şu an", order: 3, ar: "الآن‫.‬" },
            { tr: "nereye", order: 1, ar: "إِلَى أَيْنَ" },
            { tr: "gidiyorsun?", order: 2, ar: "تَذْهَبِينَ" }
        ]
    },
    // 12. Ülkeme dönüyorum.
    {
        words: [
            { tr: "Ülkeme", order: 2, ar: "إِلَى بَلَدِي." },
            { tr: "dönüyorum.", order: 1, ar: "أَرْجِعُ" }
        ]
    },
    // 13. Merve İstanbul'da gezindi.
    {
        words: [
            { tr: "Merve", order: 2, ar: "مَرْوَة" },
            { tr: "İstanbulda", order: 3, ar: "في إِسْطَنْبُول." },
            { tr: "gezindi.", order: 1, ar: "تَجَوَّلَتْ" }
        ]
    },
    // 14. Yunus Konya'da yaşıyor.
{
        words: [
            { tr: "Yunus", order: 2, ar: "يُونُس" },
            { tr: "Konya'da", order: 3, ar: "فِي قُونْيَا." },
            { tr: "yaşıyor.", order: 1, ar: "يَعِيشُ" }
        ]
    },
    // 15. Konya Mevlana Müzesi ile meşhurdur.
    {
        words: [
            { tr: "Konya", order: 1, ar: "قُونْيَا" },
            { tr: "Mevlana", order: 4, ar: "مَوْلَانَا." },
            { tr: "müzesi ile", order: 3, ar: "بِمُتْحَف" },
            { tr: "meşhurdur.", order: 2, ar: "مَشْهُورَة" }
        ]
    },
    // 16. Yakutiye medresesi Erzurum'dadır.
    {
        words: [
            { tr: "Yakutiye", order: 2, ar: "الْيَاكُوتِيَّة" },
            { tr: "Medresesi", order: 1, ar: "الْمَدْرَسَة" },
            { tr: "Erzurum'dadır.", order: 3, ar: "فِي أَرْضُرُوم." }
        ]
    },
    // 17. Urfa'daki Balıklıgöl'de gezindim.
    {
        words: [
            { tr: "Urfa'daki", order: 4, ar: "فِي أُورْفَة." }, 
            { tr: "Balıklı", order: 3, ar: "الْأَسْمَاك" },
            { tr: "gölde", order: 2, ar: "فِي بُحَيْرَة" }, 
            { tr: "gezindim.", order: 1, ar: "تَجَوَّلْتُ" }
        ]
    },
    // 18. Mersin Kız Kalesi ile meşhurdur.
    {
        words: [
            { tr: "Mersin", order: 2, ar: "مَرْسِين" },
            { tr: "kız", order: 4, ar: "الْفَتَاة." },
            { tr: "kalesi ile", order: 3, ar: "بِقَلْعَة" },
            { tr: "meşhurdur.", order: 1, ar: "تَشْتَهِرُ" }
        ]
    },
    // 19. Trabzon'daki Uzungöl'e seyahat ettim.
    {
        words: [
            { tr: "Trabzon'daki", order: 3, ar: "فِي طِرَابْزُون." },
            { tr: "Uzungöl'e", order: 2, ar: "إِلَى أُوزُونْغُول" },
            { tr: "seyahat ettim.", order: 1, ar: "سَافَرْتُ" }
        ]
    },
    // 20. İstanbul'daki büyük Ayasofya camisini ziyaret ettim.
    {
        words: [
            { tr: "İstanbul'daki", order: 5, ar: "فِي إِسْطَنْبُول." },
            { tr: "Büyük", order: 4, ar: "الْكَبير" },
            { tr: "Ayasofya", order: 3, ar: "آيَاصُوفْيَا" },
            { tr: "camisini", order: 2, ar: "مَسْجِد" },
            { tr: "ziyaret ettim.", order: 1, ar: "زُرْتُ" }
        ]
    },

    // --- BÖLÜM 3: FİİL ÇEKİMLERİ (GİTMEK) ---

    // 21. O, deniz kenarına gitti. (Erkek)
    {
        words: [
            { tr: "O", order: 1, ar: "هُوَ" },
            { tr: "deniz", order: 4, ar: "الْبَحْر." },
            { tr: "kenarına", order: 3, ar: "إِلَى شَاطِئ" },
            { tr: "gitti.", order: 2, ar: "ذَهَبَ" }
        ]
    },
    // 22. O ikisi dağa gittiler.
    {
        words: [
            { tr: "O ikisi", order: 1, ar: "هُمَا" },
            { tr: "dağa", order: 3, ar: "إِلَى الْجَبَل." },
            { tr: "gittiler.", order: 2, ar: "ذَهَبَا" }
        ]
    },
    // 23. Onlar camiye gittiler. (Erkek)
    {
        words: [
            { tr: "Onlar", order: 1, ar: "هُمْ" },
            { tr: "camiye", order: 3, ar: "إِلَى الْمَسْجِد." },
            { tr: "gittiler.", order: 2, ar: "ذَهَبُوا" }
        ]
    },
    // 24. O eve gitti. (Kadın)
    {
        words: [
            { tr: "O", order: 1, ar: "هِيَ" },
            { tr: "eve", order: 3, ar: "إِلَى الْبَيْت." },
            { tr: "gitti.", order: 2, ar: "ذَهَبَتْ" }
        ]
    },
    // 25. O ikisi okula gittiler. (Kadın)
    {
        words: [
            { tr: "O ikisi", order: 1, ar: "هُمَا" },
            { tr: "okula", order: 3, ar: "إِلَى الْمَدْرَسَة." },
            { tr: "gittiler.", order: 2, ar: "ذَهَبَتَا" }
        ]
    },
    // 26. Onlar bahçeye gittiler. (Kadın)
    {
        words: [
            { tr: "Onlar", order: 1, ar: "هُنَّ" },
            { tr: "bahçeye", order: 3, ar: "إِلَى الْحَدِيقَة." },
            { tr: "gittiler.", order: 2, ar: "ذَهَبْنَ" }
        ]
    },

    // --- BÖLÜM 4: OKUMA PARÇASI (VATAN SEVGİSİ) ---

    // 27. Merhaba, ismim Murat.
    {
        words: [
            { tr: "Merhaba,", order: 1, ar: "مَرْحَبًا،" },
            { tr: "ismim", order: 2, ar: "اِسْمي" },
            { tr: "Murat'tır.", order: 3, ar: "مُراد." }
        ]
    },
    // 28. Ben Türk vatandaşıyım.
    {
        words: [
            { tr: "Ben", order: 1, ar: "وَأَنَا" },
            { tr: "Türk", order: 3, ar: "تُرْكِيّ." },
            { tr: "vatandaşıyım.", order: 2, ar: "مُواطِن" }
        ]
    },
    // 29. Ailemle Ankara şehrinde yaşıyorum.
    {
        words: [
            { tr: "Ailemle", order: 4, ar: "مَع أُسْرَتي." },
            { tr: "Ankara", order: 3, ar: "أَنْقَرَة" },
            { tr: "şehrinde", order: 2, ar: "فِي مَدينَة" },
            { tr: "yaşıyorum.", order: 1, ar: "أَعيشُ" }
        ]
    },
    // 30. Ankara güzel ve önemli bir şehirdir.
    {
        words: [
            { tr: "Ankara", order: 1, ar: "أَنْقَرَة" },
            { tr: "güzel", order: 3, ar: "جَميلَة" },
            { tr: "ve önemli", order: 4, ar: "ومُهِمَّة." },
            { tr: "şehirdir.", order: 2, ar: "مَدينَة" }
        ]
    },
    // 31. Çünkü o Türkiye'nin başkentidir.
    {
        words: [
            { tr: "Çünkü o", order: 1, ar: "لِأَنَّها" },
            { tr: "Türkiye'nin", order: 3, ar: "تُرْكِيا." },
            { tr: "başkentidir.", order: 2, ar: "عاصِمَة" }
        ]
    },
    // 32. Ayrıca ortasında bulunur.
    {
        words: [
            { tr: "Ayrıca", order: 3, ar: "أَيْضًا." },
            { tr: "ortasında", order: 2, ar: "فِي وَسَطِها" },
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },
    // 33. Vatanımı çok seviyorum.
    {
        words: [
            { tr: "Vatanımı", order: 2, ar: "وَطَني" },
            { tr: "çok", order: 3, ar: "كَثيرًا." },
            { tr: "seviyorum.", order: 1, ar: "أُحِبُّ" }
        ]
    },
    // 34. Çünkü orada bayrak altında özgürce yaşıyorum.
    {
        words: [
            { tr: "Çünkü ben", order: 1, ar: "لِأَنَّني" },
            { tr: "orada", order: 3, ar: "فيه" },
            { tr: "bayrak", order: 6, ar: "العَلَم." },
            { tr: "altında", order: 5, ar: "تَحْت" },
            { tr: "özgürce", order: 4, ar: "حُرًّا" },
            { tr: "yaşıyorum.", order: 2, ar: "أَعيشُ" }
        ]
    },
    // 35. Türkiye tarihi ve turistik mekanlarıyla meşhurdur.
    {
        words: [
            { tr: "Türkiye", order: 2, ar: "تُرْكِيا" },
            { tr: "tarihi", order: 4, ar: "التّاريخِيَّة" },
            { tr: "ve turistik", order: 5, ar: "وَالسِّياحِيَّة." },
            { tr: "mekanlarıyla", order: 3, ar: "بِأَماكِنِها" },
            { tr: "meşhurdur.", order: 1, ar: "تَشْتَهِرُ" }
        ]
    },

// 36. Ayasofya, Topkapı ve Mevlana gibi.
    // Cümle: Büyük Ayasofya camisi ve Topkapı sarayı ve Mevlana müzesi gibi.
    {
        words: [
            { tr: "Büyük", order: 3, ar: "الْكَبير،" }, // Cümle başı büyük
            { tr: "Ayasofya", order: 2, ar: "آياصوفْيا" }, // Özel isim
            { tr: "camisi gibi", order: 1, ar: "كَمَسْجِد" }, // Küçük harf
            { tr: "ve sarayı", order: 4, ar: "وَقَصْر" }, // Küçük harf (ve + saray)
            { tr: "Topkapı", order: 5, ar: "توبْكابي،" }, // Özel isim
            { tr: "ve müzesi", order: 6, ar: "وَمُتْحَف" }, // Küçük harf (ve + müze)
            { tr: "Mevlana", order: 7, ar: "مَوْلانا." } // Özel isim
        ]
    },
    // 37. Türkiye güzel doğasıyla da meşhurdur.
    {
        words: [
            { tr: "ve Türkiye", order: 1, ar: "وَتُرْكِيا" }, // Özel isim büyük, bağlaç küçük
            { tr: "güzel", order: 4, ar: "الجَميلَة" },
            { tr: "doğasıyla", order: 3, ar: "بِطَبيعَتِها" },
            { tr: "da", order: 5, ar: "أَيْضًا." },
            { tr: "meşhurdur.", order: 2, ar: "مَشْهورَة" }
        ]
    },
    // 38. Her zaman vatanımı savunurum.
    {
        words: [
            { tr: "Vatanımı", order: 2, ar: "عَنْ وَطَني" },
            { tr: "her", order: 3, ar: "فِي كُلّ" }, // Cümle başı büyük
            { tr: "zaman", order: 4, ar: "وَقْت." },
            { tr: "savunurum.", order: 1, ar: "أُدافِعُ" }
        ]
    },
    // 39. Ona ilmimle ve işimle hizmet ederim.
    {
        words: [
            { tr: "İlmimle", order: 2, ar: "بِعِلْمي" },
            { tr: "ve amelimle", order: 3, ar: "وَعَمَلي." },
            { tr: "ona hizmet ederim.", order: 1, ar: "أَخْدِمُهُ" }
        ]
    },
    // 40. Onun için işimde daima çabalarım.
    {
        words: [
            { tr: "Onun için", order: 3, ar: "مِنْ أَجْلِه" }, // Cümle başı büyük
            { tr: "işimde", order: 2, ar: "فِي عَمَلي" },
            { tr: "daima", order: 4, ar: "دائِمًا." },
            { tr: "çabalarım.", order: 1, ar: "أَجْتَهِدُ" }
        ]
    },
    // 41. Vatandan daha değerli bir şey yoktur.
    {
        words: [
            { tr: "Vatandan", order: 4, ar: "مِن الوَطَن." }, // Cümle başı büyük
            { tr: "daha değerli", order: 3, ar: "أَغْلى" },
            { tr: "bir şey", order: 2, ar: "شَيْء" },
            { tr: "yoktur.", order: 1, ar: "فَلَا" }
        ]
    },

    // --- BÖLÜM 5: COĞRAFİ KONUM VE YÖNLER ---

    // 42. Türkiye Asya ve Avrupa arasında bulunur.
    {
        words: [
            { tr: "Türkiye", order: 2, ar: "تُرْكِيا" }, // Özel isim
            { tr: "Asya", order: 4, ar: "آسْيا" }, // Özel isim
            { tr: "ve Avrupa", order: 5, ar: "وَأوروبّا." }, // 've' küçük, 'Avrupa' büyük
            { tr: "arasında", order: 3, ar: "بَيْنَ" },
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },
    // 43. Trabzon Türkiye'nin kuzeyindedir.
    {
        words: [
            { tr: "Trabzon", order: 2, ar: "طِرابْزون" }, // Özel isim
            { tr: "Türkiye'nin", order: 4, ar: "تُرْكِيا." }, // Özel isim
            { tr: "kuzeyinde", order: 3, ar: "فِي شَمال" },
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },
    // 44. Mersin Türkiye'nin güneyindedir.
    {
        words: [
            { tr: "Mersin", order: 2, ar: "مَرْسين" },
            { tr: "Türkiye'nin", order: 4, ar: "تُرْكِيا." },
            { tr: "güneyinde", order: 3, ar: "فِي جَنوب" },
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },
    // 45. Erzurum Türkiye'nin doğusundadır.
    {
        words: [
            { tr: "Erzurum", order: 2, ar: "أَرْضُروم" },
            { tr: "Türkiye'nin", order: 4, ar: "تُرْكِيا." },
            { tr: "doğusunda", order: 3, ar: "فِي شَرْق" },
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },
    // 46. İstanbul Türkiye'nin batısındadır.
    {
        words: [
            { tr: "İstanbul", order: 2, ar: "إِسْطَنْبول" },
            { tr: "Türkiye'nin", order: 4, ar: "تُرْكِيا." },
            { tr: "batısında", order: 3, ar: "فِي غَرْب" },
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },
    // 47. Konya Türkiye'nin ortasındadır.
    {
        words: [
            { tr: "Konya", order: 2, ar: "قونْيا" },
            { tr: "Türkiye'nin", order: 4, ar: "تُرْكِيا." },
            { tr: "ortasında", order: 3, ar: "فِي وَسَط" },
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },

    // --- BÖLÜM 6: TREN İSTASYONU DİYALOĞU ---

    // 48. Ne istiyorsun?
    {
        words: [
            { tr: "Ne", order: 1, ar: "مَاذَا" }, // Cümle başı büyük
            { tr: "istiyorsun?", order: 2, ar: "تُرِيدُ؟" }
        ]
    },
    // 49. Hızlı tren için bilet istiyorum.
    {
        words: [
            { tr: "Hızlı", order: 4, ar: "السَّرِيع." }, // Cümle başı büyük
            { tr: "tren için", order: 3, ar: "لِلْقِطَارِ" },
            { tr: "bilet", order: 2, ar: "تَذْكِرَةً" },
            { tr: "istiyorum.", order: 1, ar: "أُرِيدُ" }
        ]
    }
],
dialog : [
    // --- 1. DİYALOG: KİMLİK VE YAŞAM (Temel Soru-Cevaplar) ---
    {
        p1: [
            { tr: "Senin uyruğun", order: 2, ar: "جِنْسِيَّتُكَ" },
            { tr: "nedir?", order: 1, ar: "مَا" }
        ],
        p2: [
            { tr: "Ben", order: 1, ar: "أَنَا" },
            { tr: "Türküm.", order: 2, ar: "تُرْكِيٌّ." } // Özel isim büyük
        ]
    },
    {
        p1: [
            { tr: "Sen", order: 2, ar: "أَنْتِ؟" },
            { tr: "neredensin?", order: 1, ar: "مِنْ أَيْنَ" } // Birleştirildi (Min eyne)
        ],
        p2: [
            { tr: "Ben", order: 1, ar: "أَنَا" },
            { tr: "Mısır'danım.", order: 2, ar: "مِنْ مِصْر." } // Birleştirildi (Min Misr)
        ]
    },
    {
        p1: [
            { tr: "Nerede", order: 1, ar: "أَيْنَ" }, // Cümle başı
            { tr: "yaşıyorsun?", order: 2, ar: "تَعِيشُ؟" } // Küçük harf
        ],
        p2: [
            { tr: "Konya", order: 3, ar: "قُونْيَا." }, // Özel isim
            { tr: "şehrinde", order: 2, ar: "فِي مَدِينَةِ" }, // Birleştirildi (Fi medineti)
            { tr: "yaşıyorum.", order: 1, ar: "أَعِيشُ" } // Ayrı kaldı
        ]
    },

    // --- 2. DİYALOG: ŞEHİR TANITIMI VE SEYAHAT ---
    {
        p1: [
            { tr: "Konya", order: 4, ar: "قُونْيَا؟" },
            { tr: "şehri", order: 3, ar: "مَدِينَة" }, // Küçük harf
            { tr: "ne ile", order: 1, ar: "بِمَاذَا" }, // Küçük harf
            { tr: "meşhurdur?", order: 2, ar: "تَشْتَهِرُ" }
        ],
        p2: [
            { tr: "Mevlana", order: 3, ar: "مَوْلَانَا." }, // Özel isim
            { tr: "müzesi ile", order: 2, ar: "بِمُتْحَفِ" }, // 'Bi' bitişik olduğu için 'ile' birleşik kaldı
            { tr: "meşhurdur.", order: 1, ar: "تَشْتَهِرُ" }
        ]
    },
    {
        p1: [
            { tr: "Türkiye'de", order: 3, ar: "فِي تُرْكِيا" }, // Birleştirildi (Fi Turkiya)
            { tr: "nerede", order: 1, ar: "أَيْنَ" },
            { tr: "gezindin?", order: 2, ar: "تَجَوَّلْتِ" }
        ],
        p2: [
            { tr: "İstanbul'da", order: 2, ar: "فِي إِسْطَنْبُول." }, // Birleştirildi
            { tr: "gezindim.", order: 1, ar: "تَجَوَّلْتُ" }
        ]
    },
    {
        p1: [
            { tr: "Şu an", order: 3, ar: "الآن." }, // Cümle başı büyük
            { tr: "nereye", order: 1, ar: "إِلَى أَيْنَ" }, // Küçük harf
            { tr: "gidiyorsun?", order: 2, ar: "تَذْهَبِينَ" }
        ],
        p2: [
            { tr: "Ülkeme", order: 2, ar: "إِلَى بَلَدِي." }, // Birleştirildi
            { tr: "dönüyorum.", order: 1, ar: "أَرْجِعُ" }
        ]
    },

    // --- 3. DİYALOG: GEÇMİŞ ZAMAN SORULARI (Seyahat Anıları) ---
    {
        p1: [
            { tr: "Nereye", order: 1, ar: "إِلَى أَيْنَ" }, // Birleştirildi, Cümle başı büyük
            { tr: "seyahat ettiniz?", order: 2, ar: "سَافَرْتُمْ؟" } // Küçük harf
        ],
        p2: [
            { tr: "Trabzon'a", order: 2, ar: "إِلَى طِرَابْزُون." }, // Birleştirildi
            { tr: "seyahat ettik.", order: 1, ar: "سَافَرْنَا" }
        ]
    },
    {
        p1: [
            { tr: "Annenle", order: 3, ar: "مَعَ أُمِّكِ؟" }, // Birleştirildi, Cümle başı büyük
            { tr: "nereye", order: 1, ar: "إِلَى أَيْنَ" }, // Birleştirildi, küçük harf
            { tr: "seyahat ettin?", order: 2, ar: "سَافَرْتِ" }
        ],
        p2: [
            { tr: "Onunla", order: 2, ar: "مَعَهَا" }, // Cümle başı büyük
            { tr: "Konya'ya", order: 3, ar: "إِلَى قُونْيَا." }, // Birleştirildi
            { tr: "seyahat ettim.", order: 1, ar: "سَافَرْتُ" }
        ]
    },
    {
        p1: [
            { tr: "Hangi", order: 1, ar: "أَيَّ" }, // Cümle başı büyük
            { tr: "tarihi", order: 3, ar: "تَارِيخِيٍّ" }, // Küçük harf
            { tr: "mekanı", order: 2, ar: "مَكَانٍ" },
            { tr: "ziyaret ettiniz?", order: 4, ar: "زُرْتُنَّ؟" }
        ],
        p2: [
            { tr: "Balıklı", order: 3, ar: "الْأَسْمَاكِ." }, // Özel isim (Balıklıgöl)
            { tr: "gölü", order: 2, ar: "بُحَيْرَةَ" }, // Küçük harf
            { tr: "ziyaret ettik.", order: 1, ar: "زُرْنَا" }
        ]
    },

    // --- 4. DİYALOG: YUSUF VE SALİH (Şam ve Suriye) ---
    {
        p1: [
            { tr: "Merhaba,", order: 1, ar: "مَرْحَبًا،" },
            { tr: "ben", order: 2, ar: "أَنَا" },
            { tr: "Türküm,", order: 3, ar: "تُرْكِيٌّ،" },
            { tr: "nerelisin?", order: 4, ar: "مِنْ أَيْنَ أَنْتَ؟" }
        ],
        p2: [
            { tr: "Hoş geldin,", order: 1, ar: "أَهْلًا،" },
            { tr: "ben", order: 2, ar: "أَنَا" },
            { tr: "Suriyeliyim,", order: 3, ar: "سُورِيٌّ،" },
            { tr: "Şam'da", order: 5, ar: "فِي دِمَشْق." }, // Birleştirildi
            { tr: "yaşıyorum.", order: 4, ar: "أَعِيشُ" }
        ]
    },
    {
        p1: [
            { tr: "Şam mı!", order: 1, ar: "دِمَشْق!" }, // Özel isim
            { tr: "O", order: 3, ar: "هِيَ" }, // Cümle başı
            { tr: "Suriye'nin", order: 5, ar: "سُورِيا؟" }, // Özel isim
            { tr: "başkenti", order: 4, ar: "عَاصِمَةُ" }, // Küçük harf
            { tr: "midir?", order: 2, ar: "هَلْ" }
        ],
        p2: [
            { tr: "Evet,", order: 1, ar: "نَعَمْ،" }, // Cümle başı
            { tr: "Suriye'nin", order: 4, ar: "سُورِيا." }, // 've' küçük, Ülke büyük
            { tr: "güneyinde", order: 3, ar: "فِي جَنُوب" }, // 've tekau fi cenubi' (güneyinde bulunur) - Birleştirildi
            { tr: "bulunur.", order: 2, ar: "وَتَقَعُ" } // Arapçası üstte birleştiği için boş (veya yukarıdaki düzeni koruyabiliriz)
            // Düzeltme: Senin 'order' yapına sadık kalarak:
        ]
    },
    
    {
        p1: [
            { tr: "Şam", order: 3, ar: "دِمَشْق؟" },
            { tr: "ne ile", order: 1, ar: "بِمَاذَا" },
            { tr: "meşhurdur?", order: 2, ar: "تَشْتَهِرُ" }
        ],
        p2: [
            { tr: "Tarihiyle", order: 2, ar: "بِتَارِيخِهَا" }, // Cümle başı büyük
            { tr: "ve güzelliğiyle", order: 3, ar: "وَجَمَالِهَا" }, // Küçük harf, Vav bitişik
            { tr: "İstanbul gibi", order: 4, ar: "كَإِسْطَنْبُول." }, // 'Gibi' (Ka) bitişik, Özel isim büyük
            { tr: "meşhurdur.", order: 1, ar: "تَشْتَهِرُ" }
        ]
    },
    {
        p1: [
            { tr: "Ben", order: 1, ar: "أَنَا" },
            { tr: "onu ziyaret etmeyi", order: 3, ar: "أَنْ أَزُورَهَا." }, // Küçük harf
            { tr: "istiyorum.", order: 2, ar: "أُرِيدُ" }
        ],
        p2: [
            { tr: "İnşallah,", order: 1, ar: "إِنْ شَاءَ الله،" },
            { tr: "birlikte", order: 3, ar: "مَعًا." },
            { tr: "ziyaret ederiz.", order: 2, ar: "نَزُورُهَا" }
        ]
    },

    // --- 5. DİYALOG: RAŞİD VE KAZIM (Mısır ve Kahire) ---
    {
        p1: [
            { tr: "Selamun aleyküm,", order: 1, ar: "السَّلَامُ عَلَيْكُم،" },
            { tr: "sen", order: 3, ar: "أَنْتَ؟" },
            { tr: "neredensin?", order: 2, ar: "مِنْ أَيْنَ" } // Birleştirildi
        ],
        p2: [
            { tr: "Ve aleykum selam,", order: 1, ar: "وَعَلَيْكُم السَّلَام،" },
            { tr: "ben", order: 2, ar: "أَنَا" },
            { tr: "Mısır'danım.", order: 3, ar: "مِنْ مِصْر." } // Birleştirildi
        ]
    },
    {
        p1: [
            { tr: "Mısır", order: 3, ar: "مِصْر؟" }, // Cümle başı ve Özel isim
            { tr: "nerede", order: 1, ar: "أَيْنَ" }, // Küçük harf
            { tr: "bulunur?", order: 2, ar: "تَقَعُ" }
        ],
        p2: [
            { tr: "Afrika'nın", order: 3, ar: "إِفْرِيقْيَا؟" }, // Cümle başı ve Özel isim
            { tr: "kuzeyinde", order: 2, ar: "فِي شَمَال" }, // Birleştirildi
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },
    {
        p1: [
            { tr: "Mısır'ın", order: 3, ar: "مِصْر؟" },
            { tr: "başkenti", order: 2, ar: "عَاصِمَة" },
            { tr: "nedir?", order: 1, ar: "مَا" }
        ],
        p2: [
            { tr: "Başkenti", order: 1, ar: "عَاصِمَتُهَا" }, // Cümle başı
            { tr: "Kahire'dir.", order: 2, ar: "القَاهِرَة." } // Özel isim
        ]
    },
    {
        p1: [
            { tr: "Kahire", order: 3, ar: "القَاهِرَة؟" },
            { tr: "ne ile", order: 1, ar: "بِمَاذَا" },
            { tr: "meşhurdur?", order: 2, ar: "تَشْتَهِرُ" }
        ],
        p2: [
            { tr: "Tarihi", order: 3, ar: "التَّارِيخِيَّة." }, // Cümle başı
            { tr: "mekanlarıyla", order: 2, ar: "بِأَمَاكِنِهَا" }, // Bi-emakiniha (Bi bitişik)
            { tr: "meşhurdur.", order: 1, ar: "تَشْتَهِرُ" }
        ]
    }
]

};
/* kelimeler (kart + hafıza oyunu) */
window.data.words = [
    // Mekanlar ve Coğrafya
    { tr: "Başkent", ar: "عَاصِمَة" },
    { tr: "Şehir", ar: "مَدِينَة" },
    { tr: "Müze", ar: "مُتْحَف" },
    { tr: "Kale", ar: "قَلْعَة" },
    { tr: "Göl", ar: "بُحَيْرَة" },
    { tr: "Deniz Kıyısı / Sahil", ar: "شَاطِئ البَحْر" },
    { tr: "Dağ", ar: "جَبَل" },
    { tr: "Camii / Mescit", ar: "مَسْجِد" },
    { tr: "Park / Bahçe", ar: "حَدِيقَة" },
    { tr: "Vatan / Ülke", ar: "وَطَن / بَلَد" },

    // Yönler ve Konum
    { tr: "Kuzey", ar: "شَمَال" },
    { tr: "Güney", ar: "جَنُوب" },
    { tr: "Doğu", ar: "شَرْق" },
    { tr: "Batı", ar: "غَرْب" },
    { tr: "Orta / Merkez", ar: "وَسَط" },
    { tr: "Nerede?", ar: "أَيْنَ؟" },

    // Fiiller (Eylemler)
    { tr: "Yaşıyorum", ar: "أَعِيشُ" },
    { tr: "Seyahat ettim", ar: "سَافَرْتُ" },
    { tr: "Gezdim / Dolaştım", ar: "تَجَوَّلْتُ" },
    { tr: "Gidiyorum", ar: "أَذْهَبُ" },
    { tr: "Dönüyorum", ar: "أَرْجِعُ" },
    { tr: "Ziyaret ettik", ar: "زُرْنَا" },
    { tr: "Bulunur / Yer alır", ar: "تَقَعُ" },
    { tr: "İstiyorum", ar: "أُرِيدُ" },

    // Sıfatlar ve Diğer Terimler
    { tr: "Milliyet / Uyruk", ar: "جِنْسِيَّة" },
    { tr: "Meşhurdur (Tanınır)", ar: "تَشْتَهِرُ بـ..." },
    { tr: "Tarihi", ar: "تَارِيخِيَّة" },
    { tr: "Turistik", ar: "سِيَاحِيَّة" },
    { tr: "Hızlı Tren", ar: "القِطَار السَّرِيع" },
    { tr: "Bilet", ar: "تَذْكِرَة" },
    { tr: "Yolculuk", ar: "رِحْلَة" },
    { tr: "Yaklaşık", ar: "تَقْرِيبًا" }
];
