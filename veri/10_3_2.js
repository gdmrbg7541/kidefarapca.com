/* 10_3_2 dersinin cümleleri/diyaloğu (ortak muhadese.html + simultane.js kullanır) */
window.data = {
sentence :[
    // --- BÖLÜM 1: ULAŞIM ARAÇLARI VE YOLCULUK ---

    // 1. Said İspanya'ya gemiyle gitti.
    {
        words: [
            { tr: "Said", order: 2, ar: "سَعيد" },
            { tr: "İspanya'ya", order: 3, ar: "إِلى إِسْبانْيا" },
            { tr: "gemiyle", order: 4, ar: "بِالسَّفينَة." },
            { tr: "gitti.", order: 1, ar: "ذَهَبَ" }
        ]
    },
    // 2. Kahire'yi uçakla ziyaret etmek istiyorum.
    {
        words: [
            { tr: "Kahire'yi", order: 3, ar: "القاهِرَة" },
            { tr: "uçakla", order: 4, ar: "بِالطّائِرَة." },
            { tr: "ziyaret etmek", order: 2, ar: "أَنْ أَزورَ" },
            { tr: "istiyorum.", order: 1, ar: "أُريدُ" }
        ]
    },
    // 3. Gelecek hafta otobüsle döneceğim.
    {
        words: [
            { tr: "Gelecek", order: 3, ar: "القادِم" },
            { tr: "hafta", order: 2, ar: "الأُسْبوع" },
            { tr: "otobüsle", order: 4, ar: "بِالحافِلَة." },
            { tr: "döneceğim.", order: 1, ar: "سَأَرْجِعُ" }
        ]
    },
    // 4. İzmir'e arabayla ulaşacağım.
    {
        words: [
            { tr: "İzmir'e", order: 2, ar: "إِلى إِزْمير" },
            { tr: "arabayla", order: 3, ar: "بِالسَّيّارَة." },
            { tr: "ulaşacağım.", order: 1, ar: "سَأَصِلُ" }
        ]
    },
    // 5. Kamyon yolda ilerliyor.
    {
        words: [
            { tr: "Kamyon", order: 2, ar: "الشّاحِنَة" },
            { tr: "yolda", order: 3, ar: "في الطَّريق." },
            { tr: "ilerliyor.", order: 1, ar: "تَسيرُ" }
        ]
    },
    // 6. Cadde ulaşım araçlarıyla kalabalıktır.
    {
        words: [
            { tr: "Cadde", order: 1, ar: "الشّارِع" },
            { tr: "ulaşım araçlarıyla", order: 3, ar: "بِالمُواصَلات." },
            { tr: "kalabalıktır.", order: 2, ar: "مُزْدَحِم" }
        ]
    },

    // --- BÖLÜM 2: KARŞILAŞTIRMALAR (İSM-İ TAFDİL) ---

    // 7. Bu tren hızlıdır, ancak şu tren ondan daha hızlıdır.
    {
        words: [
            { tr: "Bu", order: 1, ar: "هَذا" },
            { tr: "tren", order: 2, ar: "القِطار" },
            { tr: "hızlıdır,", order: 3, ar: "سَريع،" },
            { tr: "ancak", order: 4, ar: "وَلَكِنْ" },
            { tr: "şu", order: 5, ar: "ذَلِك" },
            { tr: "tren", order: 6, ar: "القِطار" },
            { tr: "ondan", order: 8, ar: "مِنْه." },
            { tr: "daha hızlıdır.", order: 7, ar: "أَسْرَع" }
        ]
    },
    // 8. Bu araba eskidir, ancak şu araba ondan daha eskidir.
    {
        words: [
            { tr: "Bu", order: 1, ar: "هَذِه" },
            { tr: "araba", order: 2, ar: "السَّيّارَة" },
            { tr: "eskidir,", order: 3, ar: "قَديمَة،" },
            { tr: "ancak", order: 4, ar: "وَلَكِنْ" },
            { tr: "şu", order: 5, ar: "تِلْكَ" },
            { tr: "araba", order: 6, ar: "السَّيّارَة" },
            { tr: "ondan", order: 8, ar: "مِنْها." },
            { tr: "daha eskidir.", order: 7, ar: "أَقْدَم" }
        ]
    },
    // 9. Bu otobüs yenidir, ancak şu otobüs ondan daha yenidir.
    {
        words: [
            { tr: "Bu", order: 1, ar: "هَذِه" },
            { tr: "otobüs", order: 2, ar: "الحافِلَة" },
            { tr: "yenidir,", order: 3, ar: "حَديثَة،" },
            { tr: "ancak", order: 4, ar: "وَلَكِنْ" },
            { tr: "şu", order: 5, ar: "تِلْكَ" },
            { tr: "otobüs", order: 6, ar: "الحافِلَة" },
            { tr: "ondan", order: 8, ar: "مِنْها." },
            { tr: "daha yenidir.", order: 7, ar: "أَحْدَث" }
        ]
    },
    // 10. Bu gemi güzeldir, ancak şu gemi ondan daha güzeldir.
    {
        words: [
            { tr: "Bu", order: 1, ar: "هَذِه" },
            { tr: "gemi", order: 2, ar: "السَّفينَة" },
            { tr: "güzeldir,", order: 3, ar: "جَميلَة،" },
            { tr: "ancak", order: 4, ar: "وَلَكِنْ" },
            { tr: "şu", order: 5, ar: "تِلْكَ" },
            { tr: "gemi", order: 6, ar: "السَّفينَة" },
            { tr: "ondan", order: 8, ar: "مِنْها." },
            { tr: "daha güzeldir.", order: 7, ar: "أَجْمَل" }
        ]
    },

    // --- BÖLÜM 3: SAATLER VE ZAMAN ---

    // 11. Uçak havalimanına saat yediyi çeyrek geçe ulaştı.
    {
        words: [
            { tr: "Uçak", order: 2, ar: "الطّائِرَة" },
            { tr: "havalimanına", order: 3, ar: "إِلى المَطار" },
            { tr: "saat", order: 4, ar: "في السّاعَة" },
            { tr: "yediyi", order: 5, ar: "السّابِعَة" },
            { tr: "çeyrek geçe", order: 6, ar: "وَالرُّبْع." },
            { tr: "ulaştı.", order: 1, ar: "وَصَلَت" }
        ]
    },
    // 12. Hatice hızlı trene saat onu yirmi geçe bindi.
    {
        words: [
            { tr: "Hatice", order: 2, ar: "خَديجَة" },
            { tr: "hızlı", order: 4, ar: "السَّريع" },
            { tr: "trene", order: 3, ar: "القِطار" },
            { tr: "saat", order: 5, ar: "في السّاعَة" },
            { tr: "onu", order: 6, ar: "العاشِرَة" },
            { tr: "yirmi geçe", order: 7, ar: "وَالثُّلُث." },
            { tr: "bindi.", order: 1, ar: "ركِبَتْ" }
        ]
    },
    // 13. Halit gemiden saat üçe çeyrek kala indi.
    {
        words: [
            { tr: "Halit", order: 2, ar: "خالِد" },
            { tr: "gemiden", order: 3, ar: "مِن السَّفينَة" },
            { tr: "saat", order: 4, ar: "في السّاعَة" },
            { tr: "üçe", order: 5, ar: "الثّالِثَة" },
            { tr: "çeyrek kala", order: 6, ar: "إِلّا رُبْعًا." },
            { tr: "indi.", order: 1, ar: "نَزَلَ" }
        ]
    },
    // 14. Hızlı tren istasyona saat üçe yirmi kala ulaştı.
    {
        words: [
            { tr: "Hızlı", order: 3, ar: "السَّريع" },
            { tr: "tren", order: 2, ar: "القِطار" },
            { tr: "istasyona", order: 4, ar: "إِلى المَحَطَّة" },
            { tr: "saat", order: 5, ar: "في السّاعَة" },
            { tr: "üçe", order: 6, ar: "الثّالِثَة" },
            { tr: "yirmi kala", order: 7, ar: "إِلّا ثُلُثًا." },
            { tr: "ulaştı.", order: 1, ar: "وَصَلَ" }
        ]
    },
    // 15. Saat üçe yirmi var.
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "üçe", order: 2, ar: "الثّالِثَة" }, { tr: "yirmi var.", order: 3, ar: "إِلّا ثُلُثًا" }] },
    // 16. Saat beşi yirmi geçiyor.
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "beşi", order: 2, ar: "الخامِسَة" }, { tr: "yirmi geçiyor.", order: 3, ar: "وَالثُّلُث" }] },
    // 17. Saat dokuza çeyrek var.
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "dokuza", order: 2, ar: "التّاسِعَة" }, { tr: "çeyrek var.", order: 3, ar: "إِلّا رُبْعًا" }] },
    // 18. Saat onu çeyrek geçiyor.
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "onu", order: 2, ar: "العاشِرَة" }, { tr: "çeyrek geçiyor.", order: 3, ar: "وَالرُّبْع" }] },
    // 19. Saat beşi çeyrek geçiyor.
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "beşi", order: 2, ar: "الخامِسَة" }, { tr: "çeyrek geçiyor.", order: 3, ar: "وَالرُّبْع" }] },
    // 20. Saat ona çeyrek var.
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "ona", order: 2, ar: "العاشِرَة" }, { tr: "çeyrek var.", order: 3, ar: "إِلّا رُبْعًا" }] },
    // 21. Saat biri yirmi geçiyor.
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "biri", order: 2, ar: "الواحِدَة" }, { tr: "yirmi geçiyor.", order: 3, ar: "وَالثُّلُث" }] },
    // 22. Saat dörde yirmi var.
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "dörde", order: 2, ar: "الرّابِعَة" }, { tr: "yirmi var.", order: 3, ar: "إِلّا ثُلُثًا" }] },
    // 23. Saat üçü yirmi geçiyor.
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "üçü", order: 2, ar: "الثّالِثَة" }, { tr: "yirmi geçiyor.", order: 3, ar: "وَالثُّلُث" }] },
    // 24. Saat altıya çeyrek var.
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "altıya", order: 2, ar: "السّادِسَة" }, { tr: "çeyrek var.", order: 3, ar: "إِلّا رُبْعًا" }] },
    // 25. Saat ikiye yirmi var.
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "ikiye", order: 2, ar: "الثّانِيَة" }, { tr: "yirmi var.", order: 3, ar: "إِلّا ثُلُثًا" }] },
    // 26. Saat yediyi çeyrek geçiyor.
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "yediyi", order: 2, ar: "السّابِعَة" }, { tr: "çeyrek geçiyor.", order: 3, ar: "وَالرُّبْع" }] },

    // --- BÖLÜM 4: YÖNLER, MEKANLAR VE TRAFİK ---

    // 27. Marmara oteline gitmek istiyorum.
    {
        words: [
            { tr: "Marmara", order: 4, ar: "مَرْمَرَة." },
            { tr: "oteline", order: 3, ar: "إِلى فُنْدُق" },
            { tr: "gitmek", order: 2, ar: "الذَّهاب" },
            { tr: "istiyorum.", order: 1, ar: "أُريدُ" }
        ]
    },
    // 28. Otel buraya yakındır.
    {
        words: [
            { tr: "Otel", order: 1, ar: "الفُنْدُق" },
            { tr: "buraya", order: 3, ar: "مِنْ هُنا." },
            { tr: "yakındır.", order: 2, ar: "قَريب" }
        ]
    },
    // 29. Biraz yürü ve sağa yönel.
    {
        words: [
            { tr: "Biraz", order: 2, ar: "قَليلًا،" },
            { tr: "yürü", order: 1, ar: "اِمْشِ" },
            { tr: "ve sağa", order: 4, ar: "إِلى اليَمين." },
            { tr: "yönel.", order: 3, ar: "وَاتَّجَهْ" }
        ]
    },
    // 30. Otelde dört gün kalacağım.
    {
        words: [
            { tr: "Otelde", order: 2, ar: "في الفُنْدُق" },
            { tr: "dört", order: 3, ar: "أَرْبَعَة" },
            { tr: "gün", order: 4, ar: "أَيّام." },
            { tr: "kalacağım.", order: 1, ar: "سَأُقيمُ" }
        ]
    },
    // 31. Oda biraz sonra hazır olacak.
    {
        words: [
            { tr: "Oda", order: 2, ar: "الغُرْفَة" },
            { tr: "biraz sonra", order: 4, ar: "بَعْدَ قَليل." },
            { tr: "hazır", order: 3, ar: "جاهِزَة" },
            { tr: "olacak.", order: 1, ar: "سَتَكونُ" }
        ]
    },
    // 32. Araba kırmızı ışıkta duruyor.
    {
        words: [
            { tr: "Araba", order: 2, ar: "السَّيّارَة" },
            { tr: "kırmızı", order: 4, ar: "الأَحْمَر." },
            { tr: "ışıkta", order: 3, ar: "عِنْد الضَّوْء" },
            { tr: "duruyor.", order: 1, ar: "تَقِفُ" }
        ]
    },
    // 33. Sürücü sarı ışıkta gitmek için hazırlanıyor.
    {
        words: [
            { tr: "Sürücü", order: 2, ar: "السّائِق" },
            { tr: "sarı", order: 5, ar: "الأَصْفَر." },
            { tr: "ışıkta", order: 4, ar: "عِنْد الضَّوْء" },
            { tr: "gitmek için", order: 3, ar: "لِلسَّيْر" },
            { tr: "hazırlanıyor.", order: 1, ar: "يَسْتَعِدُّ" }
        ]
    },
    // 34. Yayalar yeşil ışıkta geçiyor.
    {
        words: [
            { tr: "Yayalar", order: 2, ar: "المُشاة" },
            { tr: "yeşil", order: 4, ar: "الأَخْضَر." },
            { tr: "ışıkta", order: 3, ar: "عِنْد الضَّوْء" },
            { tr: "geçiyor.", order: 1, ar: "يَعْبُرُ" }
        ]
    },
    // 35. Öğrenci yaya geçidinden geçiyor.
    {
        words: [
            { tr: "Öğrenci", order: 2, ar: "الطّالِب" },
            { tr: "yaya", order: 4, ar: "المُشاة." },
            { tr: "geçidinden", order: 3, ar: "مِن مَمَرّ" },
            { tr: "geçiyor.", order: 1, ar: "يَعْبُرُ" }
        ]
    },
    // 36. Kırmızı ışıkta duruyorum.
    {
        words: [
            { tr: "Kırmızı", order: 3, ar: "الأَحْمَر." },
            { tr: "ışıkta", order: 2, ar: "عِنْد الضَّوْء" },
            { tr: "duruyorum.", order: 1, ar: "أَقِفُ" }
        ]
    },
    // 37. Yeşil ışıkta geçiyorum.
    {
        words: [
            { tr: "Yeşil", order: 3, ar: "الأَخْضَر." },
            { tr: "ışıkta", order: 2, ar: "عِنْد الضَّوْء" },
            { tr: "geçiyorum.", order: 1, ar: "أَعْبُرُ" }
        ]
    },
    // 38. Sağa yönel.
    {
        words: [
            { tr: "Sağa", order: 2, ar: "إِلى اليَمين." },
            { tr: "yönel.", order: 1, ar: "اِتَّجِهْ" }
        ]
    },
    // 39. Sola yönel.
    {
        words: [
            { tr: "Sola", order: 2, ar: "إِلى اليَسار." },
            { tr: "yönel.", order: 1, ar: "اِتَّجِهْ" }
        ]
    },
    // 40. Okulum evimden uzaktır.
    {
        words: [
            { tr: "Okulum", order: 1, ar: "مَدْرَسَتي" },
            { tr: "evimden", order: 3, ar: "عَن بَيْتي." },
            { tr: "uzaktır.", order: 2, ar: "بَعيدَة" }
        ]
    },
    // 41. Her sabah saat yediyi çeyrek geçe evimden çıkıyorum.
    {
        words: [
            { tr: "Her", order: 6, ar: "كُلّ" },
            { tr: "sabah", order: 7, ar: "صَباح." },
            { tr: "saat", order: 3, ar: "في السّاعَة" },
            { tr: "yediyi", order: 4, ar: "السّابِعَة" },
            { tr: "çeyrek geçe", order: 5, ar: "وَالرُّبْع" },
            { tr: "evimden", order: 2, ar: "مِن بَيْتي" },
            { tr: "çıkıyorum.", order: 1, ar: "أَخْرُجُ" }
        ]
    },
    // 42. Yaya geçidinden geçiyorum ve otobüse biniyorum.
    {
        words: [
            { tr: "Yaya", order: 3, ar: "المُشاة" },
            { tr: "geçidinden", order: 2, ar: "مِن مَمَرّ" },
            { tr: "geçiyorum", order: 1, ar: "أَعْبُرُ" },
            { tr: "ve biniyorum", order: 4, ar: "وَأَرْكَبُ" },
            { tr: "otobüse.", order: 5, ar: "الحافِلَة." }
        ]
    },
    // 43. Yeni eczanenin önünde otobüsten iniyorum.
    {
        words: [
            { tr: "Yeni", order: 5, ar: "الجَديدَة." },
            { tr: "eczanenin", order: 4, ar: "الصَّيْدَلِيَّة" },
            { tr: "önünde", order: 3, ar: "أَمام" },
            { tr: "otobüsten", order: 2, ar: "مِن الحافِلَة" },
            { tr: "iniyorum.", order: 1, ar: "أَنْزِلُ" }
        ]
    },
    // 44. Geniş caddede biraz yürüyorum.
    {
        words: [
            { tr: "Geniş", order: 3, ar: "الواسِع" },
            { tr: "caddede", order: 2, ar: "في الشّارِع" },
            { tr: "biraz", order: 4, ar: "قَليلًا." },
            { tr: "yürüyorum.", order: 1, ar: "أَمْشي" }
        ]
    },
    // 45. Caminin yanında sola yöneliyorum.
    {
        words: [
            { tr: "Caminin", order: 4, ar: "المسْجِد." },
            { tr: "yanında", order: 3, ar: "عِنْد" },
            { tr: "sola", order: 2, ar: "إِلى اليَسار" },
            { tr: "yöneliyorum.", order: 1, ar: "أَتَّجِهُ" }
        ]
    },
    // 46. Okulum caminin arkasındadır.
    {
        words: [
            { tr: "Okulum", order: 1, ar: "مَدْرَسَتي" },
            { tr: "caminin", order: 3, ar: "المَسْجِد." },
            { tr: "arkasındadır.", order: 2, ar: "خَلْف" }
        ]
    },
    // 47. Saliha yeşil ışıkta geçiyor.
    {
        words: [
            { tr: "Saliha", order: 2, ar: "صالِحَة" },
            { tr: "yeşil", order: 4, ar: "الأَخْضَر." },
            { tr: "ışıkta", order: 3, ar: "عِنْد الضَّوْء" },
            { tr: "geçiyor.", order: 1, ar: "تَعْبُرُ" }
        ]
    },
    // 48. Otobüs kırmızı ışıkta duruyor.
    {
        words: [
            { tr: "Otobüs", order: 2, ar: "الحافِلَة" },
            { tr: "kırmızı", order: 4, ar: "الأَحْمَر." },
            { tr: "ışıkta", order: 3, ar: "عِنْد الضَّوْء" },
            { tr: "duruyor.", order: 1, ar: "تَقِفُ" }
        ]
    },
    // 49. Kız öğrenci yaya geçidinden geçiyor.
    {
        words: [
            { tr: "Kız öğrenci", order: 2, ar: "الطّالِبَة" },
            { tr: "yaya", order: 4, ar: "المُشاة." },
            { tr: "geçidinden", order: 3, ar: "مِن مَمَرّ" },
            { tr: "geçiyor.", order: 1, ar: "تَعْبُرُ" }
        ]
    }
],
dialog :[
    // --- 1. DİYALOG: TREN İSTASYONUNDA BİLET ALMA ---
    {
        p1: [
            { tr: "Ne", order: 1, ar: "مَاذَا" },
            { tr: "istiyorsun?", order: 2, ar: "تُرِيدُ؟" }
        ],
        p2: [
            { tr: "Hızlı", order: 4, ar: "السَّرِيع." },
            { tr: "tren için", order: 3, ar: "لِلْقِطَارِ" },
            { tr: "bilet", order: 2, ar: "تَذْكِرَةً" },
            { tr: "istiyorum.", order: 1, ar: "أُرِيدُ" }
        ]
    },
    {
        p1: [
            { tr: "Nereye", order: 1, ar: "إِلَى أَيْنَ" },
            { tr: "gitmek", order: 3, ar: "الذَّهَاب؟" },
            { tr: "istiyorsun?", order: 2, ar: "تُرِيدُ" }
        ],
        p2: [
            { tr: "İstanbul'a", order: 3, ar: "إِلَى إِسْطَنْبُول." },
            { tr: "gitmek", order: 2, ar: "الذَّهَابَ" },
            { tr: "istiyorum.", order: 1, ar: "أُرِيدُ" }
        ]
    },
    {
        p1: [
            { tr: "Ne zaman", order: 1, ar: "مَتَى" },
            { tr: "yolculuk yapacaksın?", order: 2, ar: "سَتُسَافِرُ؟" }
        ],
        p2: [
            { tr: "Yarın", order: 2, ar: "غَدًا." },
            { tr: "yolculuk yapacağım.", order: 1, ar: "سَأُسَافِرُ" }
        ]
    },
    {
        p1: [
            { tr: "Yolculuk", order: 4, ar: "الرِّحْلَة؟" },
            { tr: "kaç", order: 1, ar: "كَم" },
            { tr: "saat", order: 2, ar: "سَاعَةً" },
            { tr: "sürüyor?", order: 3, ar: "تَسْتَغْرِقُ" }
        ],
        p2: [
            { tr: "Yaklaşık", order: 3, ar: "تَقْرِيبًا." },
            { tr: "beş", order: 1, ar: "خَمْس" },
            { tr: "saat.", order: 2, ar: "سَاعَات" }
        ]
    },
    {
        p1: [
            { tr: "İnşallah,", order: 3, ar: "إِنْ شَاءَ الله." },
            { tr: "sağ salim", order: 2, ar: "بِالسَّلَامَة" },
            { tr: "dönersiniz.", order: 1, ar: "تَرْجِعُون" }
        ],
        p2: [
            { tr: "Teşekkürler.", order: 1, ar: "شُكْرًا." }
        ]
    },

    // --- 2. DİYALOG: OTEL YOL TARİFİ ---
    {
        p1: [
            { tr: "Selamun aleyküm.", order: 1, ar: "السَّلَامُ عَلَيْكُمْ." },
            { tr: "Marmara", order: 5, ar: "مَرْمَرَة." },
            { tr: "oteline", order: 4, ar: "إِلَى فُنْدُقِ" },
            { tr: "gitmek", order: 3, ar: "الذَّهَابَ" },
            { tr: "istiyorum.", order: 2, ar: "أُرِيدُ" }
        ],
        p2: [
            { tr: "Ve aleyküm selam.", order: 1, ar: "وَعَلَيْكُمُ السَّلَام." },
            { tr: "Otel", order: 5, ar: "الْفُنْدُق؟" },
            { tr: "adresi", order: 4, ar: "عُنْوَانُ" },
            { tr: "sende var", order: 3, ar: " عِنْدَكَ" },
            { tr: "mı?", order: 2, ar: "هَلْ" } // Arapçada 'hel indeke' soru yapısını karşılıyor
        ]
    },
    {
        p1: [
            { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
            { tr: "buyur.", order: 2, ar: "تَفَضَّلْ." },
            { tr: "Otel", order: 4, ar: "الْفُنْدُقُ" },
            { tr: "yakın", order: 5, ar: "قَرِيبٌ" },
            { tr: "mı", order: 3, ar: "هَل" },
            { tr: "yoksa", order: 6, ar: "أَمْ" },
            { tr: "uzak mı?", order: 7, ar: "بَعِيد؟" }
        ],
        p2: [
            { tr: "Otel", order: 1, ar: "اَلْفُنْدُقُ" },
            { tr: "yakındır.", order: 2, ar: "قَرِيب." }
        ]
    },
    {
        p1: [
            { tr: "Otele", order: 3, ar: "إِلَى الْفُنْدُق؟" },
            { tr: "nasıl", order: 1, ar: "كَيْفَ" },
            { tr: "giderim?", order: 2, ar: "أَذْهَبُ" }
        ],
        p2: [
            { tr: "Biraz", order: 2, ar: "قَلِيلًا،" },
            { tr: "yürü,", order: 1, ar: "اِمْشِ" },
            { tr: "sağa", order: 4, ar: "إِلَى الْيَمِين." },
            { tr: "yönel.", order: 3, ar: "وَاتَّجِهْ" },
            { tr: "Oteli", order: 6, ar: "الْفُنْدُقَ" },
            { tr: "solda", order: 7, ar: "عَلَى الْيَسَار." },
            { tr: "göreceksin.", order: 5, ar: "سَتَرَى" }
        ]
    },
    {
        p1: [
            { tr: "Teşekkürler.", order: 1, ar: "شُكْرًا." }
        ],
        p2: [
            { tr: "Rica ederim.", order: 1, ar: "عَفْوًا." }
        ]
    },

    // --- 3. DİYALOG: OTELDE ODA KİRALAMA ---
    {
        p1: [
            { tr: "Hoş geldiniz,", order: 1, ar: "أَهْلًا وَسَهْلًا،" },
            { tr: "buyurun,", order: 2, ar: "تَفَضَّلْ،" },
            { tr: "sana", order: 4, ar: "أُسَاعِدُك؟" },
            { tr: "nasıl", order: 3, ar: "كَيْفَ" },
            { tr: "yardımcı olabilirim?", order: 4, ar: "أُسَاعِدُك؟" }
        ],
        p2: [
            { tr: "Uygun", order: 3, ar: "مُنَاسِبَة." },
            { tr: "bir oda", order: 2, ar: "غُرْفَةً" },
            { tr: "istiyorum.", order: 1, ar: "أُرِيدُ" }
        ]
    },
    {
        p1: [
            { tr: "Kaç", order: 1, ar: "كَمْ" },
            { tr: "gün", order: 2, ar: "يَوْمًا" },
            { tr: "kalacaksın?", order: 3, ar: "سَتُقِيمُ؟" }
        ],
        p2: [
            { tr: "Dört", order: 2, ar: "أَرْبَعَةَ" },
            { tr: "gün", order: 3, ar: "أَيَّام." },
            { tr: "kalacağım.", order: 1, ar: "سَأُقِيمُ" }
        ]
    },
    {
        p1: [
            { tr: "Tamam", order: 1, ar: "حَاضِر" },
            { tr: "efendim,", order: 2, ar: "يَا سَيِّدِي،" },
            { tr: "odan", order: 4, ar: "غُرْفَتُكَ" },
            { tr: "biraz sonra", order: 6, ar: "بَعْدَ قَلِيل." },
            { tr: "hazır", order: 5, ar: "جَاهِزَةً" },
            { tr: "olacak.", order: 3, ar: "سَتَكُونُ" }
        ],
        p2: [{ tr: "Rica ederim.", order: 1, ar: "عَفْوًا." }]
    },

    // --- 4. DİYALOG: UMRE YOLCULUĞU (Feride ve Zeynep) ---
    {
        p1: [
            { tr: "Merhaba", order: 1, ar: "مَرْحَبًا" },
            { tr: "Feride,", order: 2, ar: "فَرِيدَة،" },
            { tr: "yarın", order: 5, ar: "غَدًا." },
            { tr: "umreye", order: 4, ar: "إِلَى الْعُمْرَةِ" },
            { tr: "gideceğim.", order: 3, ar: "سَأَذْهَبُ" }
        ],
        p2: [
            { tr: "Merhaba", order: 1, ar: "أَهْلًا" },
            { tr: "Zeynep,", order: 2, ar: "زَيْنَب،" },
            { tr: "nasıl", order: 3, ar: "كَيْفَ" },
            { tr: "yolculuk yapacaksın?", order: 4, ar: "سَتُسَافِرِين؟" }
        ]
    },
    {
        p1: [
            { tr: "Ailemle", order: 2, ar: "مَعَ أُسْرَتِي" },
            { tr: "uçakla", order: 3, ar: "بِالطَّائِرَة." },
            { tr: "yolculuk yapacağım.", order: 1, ar: "سَأُسَافِرُ" },
            { tr: "Ayrıca", order: 7, ar: "أَيْضًا." },
            { tr: "Taif'i", order: 6, ar: "الطَّائِفَ" },
            { tr: "ziyaret etmeyi", order: 5, ar: "أَنْ أَزُورَ" },
            { tr: "istiyorum.", order: 4, ar: "وَأُرِيدُ" }
        ],
        p2: [
            { tr: "Taif", order: 1, ar: "اَلطَّائِفُ" },
            { tr: "Mekke'ye", order: 3, ar: "مِنْ مَكَّة." },
            { tr: "yakındır.", order: 2, ar: "قَرِيبَةٌ" },
            { tr: "Otobüse", order: 5, ar: "الْحَافِلَةَ،" },
            { tr: "bin,", order: 4, ar: "اِرْكَبِي" },
            { tr: "yolculuk", order: 7, ar: "الرِّحْلَةُ" },
            { tr: "yaklaşık", order: 9, ar: "تَقْرِيبًا." },
            { tr: "bir saat", order: 8, ar: "سَاعَةً" },
            { tr: "sürer.", order: 6, ar: "وَتَسْتَغْرِقُ" }
        ]
    },
    {
        p1: [
            { tr: "Sen", order: 1, ar: "أَنْتِ" },
            { tr: "Mekke'yi", order: 3, ar: "مَكَّة." },
            { tr: "biliyorsun.", order: 2, ar: "تَعْرِفِينَ" },
            { tr: "Oradaki", order: 7, ar: "فِيهَا؟" },
            { tr: "otobüs", order: 5, ar: "الْحَافِلَاتِ" },
            { tr: "durağı", order: 6, ar: "مَحَطَّةُ" },
            { tr: "nerede?", order: 4, ar: "أَيْنَ" }
        ],
        p2: [
            { tr: "Mescidi Haram'ın", order: 2, ar: "مِنَ الْمَسْجِدِ الْحَرَامِ" },
            { tr: "Ecyâd", order: 4, ar: "أَجْيَاد،" },
            { tr: "kapısından", order: 3, ar: "مِنْ بَابِ" },
            { tr: "çık,", order: 1, ar: "اُخْرُجِي" },
            { tr: "geniş", order: 7, ar: "الْوَاسِعِ" },
            { tr: "caddede", order: 6, ar: "فِي الشَّارِعِ" },
            { tr: "biraz", order: 8, ar: "قَلِيلًا،" },
            { tr: "yürü,", order: 5, ar: "وَامْشِي" },
            { tr: "sonra", order: 9, ar: "ثُمَّ" },
            { tr: "sola", order: 11, ar: "إِلَى الْيَسَار." },
            { tr: "yönel.", order: 10, ar: "اتَّجِهِي" }
        ]
    },
    {
        p1: [
            { tr: "Çok", order: 2, ar: "جَزِيلًا" },
            { tr: "teşekkürler", order: 1, ar: "شُكْرًا" },
            { tr: "değerli", order: 4, ar: "الْعَزِيزَة." },
            { tr: "arkadaşım.", order: 3, ar: "صَدِيقَتِي" }
        ],
        p2: [{ tr: "Rica ederim.", order: 1, ar: "عَفْوًا." }]
    },

    // --- 5. DİYALOG: CAMİ YOL TARİFİ ---
    {
        p1: [
            { tr: "Selamun aleyküm,", order: 1, ar: "السَّلَامُ عَلَيْكُمْ،" },
            { tr: "büyük", order: 5, ar: "الْكَبِير؟" },
            { tr: "camiye", order: 4, ar: "إِلَى الْمَسْجِدِ" },
            { tr: "nasıl", order: 2, ar: "كَيْفَ" },
            { tr: "giderim?", order: 3, ar: "أَذْهَبُ" }
        ],
        p2: [
            { tr: "Ve aleykum selam,", order: 1, ar: "وَعَلَيْكُمُ السَّلَام،" },
            { tr: "otobüse", order: 3, ar: "الْحَافِلَةَ" },
            { tr: "bin", order: 2, ar: "اِرْكَبِ" },
            { tr: "merkez", order: 6, ar: "السُّوقِ الْمَرْكَزِيّ." },
            { tr: "çarşının", order: 6, ar: "" },
            { tr: "önünde", order: 5, ar: "أَمَامَ" },
            { tr: "in.", order: 4, ar: "وَانْزِلْ" }
        ]
    },
    {
        p1: [
            { tr: "Sonra", order: 1, ar: "ثُمَّ" },
            { tr: "sola", order: 3, ar: "إِلَى الْيَسَار،" },
            { tr: "yönel,", order: 2, ar: "اتَّجِهْ" },
            { tr: "biraz", order: 5, ar: "قَلِيلًا،" },
            { tr: "yürü,", order: 4, ar: "وَامْشِ" },
            { tr: "onu", order: 6, ar: "سَتَجِدُهُ" },
            { tr: "orada", order: 7, ar: "هُنَاك." },
            { tr: "bulacaksın.", order: 6, ar: "سَتَجِدُهُ" }
        ],
        p2: [
            { tr: "Oraya", order: 4, ar: "إِلَيْهِ" },
            { tr: "yürüyerek", order: 5, ar: "مَشْيًا؟" },
            { tr: "gitmem", order: 3, ar: "أَنْ أَذْهَبَ" },
            { tr: "mümkün", order: 2, ar: "الْمُمْكِنِ" },
            { tr: "mü?", order: 1, ar: "هَلْ مِنَ" }
        ]
    },
    {
        p1: [
            { tr: "Hayır,", order: 1, ar: "لَا،" },
            { tr: "çünkü o", order: 2, ar: "لِأَنَّهُ" },
            { tr: "uzak.", order: 3, ar: "بَعِيد." }
        ],
        p2: [{ tr: "Teşekkürler.", order: 1, ar: "شُكْرًا." }]
    },

    // --- 6. DİYALOG: OTOBÜS DURAĞI YOL TARİFİ ---
    {
        p1: [
            { tr: "Selamun aleyküm,", order: 1, ar: "السَّلَامُ عَلَيْكُمْ،" },
            { tr: "otobüs", order: 5, ar: "الْحَافِلَات؟" },
            { tr: "durağına", order: 4, ar: "إِلَى مَوْقِفِ" },
            { tr: "nasıl", order: 2, ar: "كَيْفَ" },
            { tr: "giderim?", order: 3, ar: "أَذْهَبُ" }
        ],
        p2: [
            { tr: "Buradan", order: 2, ar: "مِنْ هُنَا" },
            { tr: "biraz", order: 3, ar: "قَلِيلًا،" },
            { tr: "yürü,", order: 1, ar: "اِمْشِ" },
            { tr: "sonra", order: 4, ar: "ثُمَّ" },
            { tr: "sola", order: 6, ar: "إِلَى الْيَسَار." },
            { tr: "yönel.", order: 5, ar: "اتَّجِهْ" },
            { tr: "Otobüs", order: 9, ar: "الْحَافِلَاتِ" },
            { tr: "durağını", order: 8, ar: "مَوْقِفَ" },
            { tr: "hastanenin", order: 11, ar: "الْمُسْتَشْفَى." },
            { tr: "önünde", order: 10, ar: "أَمَامَ" },
            { tr: "bulacaksın.", order: 7, ar: "سَتَجِدُ" }
        ]
    },
    {
        p1: [
            { tr: "Otobüs", order: 3, ar: "الْحَافِلَاتِ" },
            { tr: "durağı", order: 2, ar: "مَوْقِفُ" },
            { tr: "buraya", order: 5, ar: "مِنْ هُنَا؟" },
            { tr: "yakın", order: 4, ar: "قَرِيبٌ" },
            { tr: "mı?", order: 1, ar: "هَلْ" }
        ],
        p2: [
            { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
            { tr: "o", order: 2, ar: "هُوَ" },
            { tr: "çok", order: 4, ar: "جِدًّا." },
            { tr: "yakındır.", order: 3, ar: "قَرِيبٌ" }
        ]
    }
]
};
/* kelimeler (kart + hafıza oyunu) */
window.data.words = [
   // Ulaşım Araçları ve Mekanlar
    { tr: "Gemi", ar: "سَفِينَة" },
    { tr: "Uçak", ar: "طَائِرَة" },
    { tr: "Otobüs", ar: "حَافِلَة" },
    { tr: "Araba", ar: "سَيَّارَة" },
    { tr: "Kamyon", ar: "شَاحِنَة" },
    { tr: "Tren", ar: "قِطَار" },
    { tr: "Hızlı Tren", ar: "القِطَار السَّرِيع" },
    { tr: "Ulaşım Araçları", ar: "مُوَاصَلَات" },
    { tr: "Havalimanı", ar: "مَطَار" },
    { tr: "İstasyon / Durak", ar: "مَحَطَّة" },
    { tr: "Otobüs Durağı", ar: "مَوْقِف الحَافِلَات" },
    { tr: "Bilet", ar: "تَذْكِرَة" },
    { tr: "Otel", ar: "فُنْدُق" },
    { tr: "Oda", ar: "غُرْفَة" },
    { tr: "Eczane", ar: "صَيْدَلِيَّة" },
    { tr: "Hastane", ar: "مُسْتَشْفَى" },
    { tr: "Merkez Çarşı", ar: "السُّوق المَرْكَزِيّ" },

    // Trafik ve Yönler
    { tr: "Sağ", ar: "يَمِين" },
    { tr: "Sol", ar: "يَسَار" },
    { tr: "Arkasında", ar: "خَلْفَ" },
    { tr: "Önünde", ar: "أَمَامَ" },
    { tr: "Yanında / -de", ar: "عِنْدَ" },
    { tr: "Yakın", ar: "قَرِيب" },
    { tr: "Uzak", ar: "بَعِيد" },
    { tr: "Cadde / Sokak", ar: "شَارِع" },
    { tr: "Yol", ar: "طَرِيق" },
    { tr: "Adres", ar: "عُنْوَان" },
    { tr: "Sürücü / Şoför", ar: "سَائِق" },
    { tr: "Yaya Geçidi", ar: "مَمَرّ المُشَاة" },
    { tr: "Yayalar", ar: "مُشَاة" },
    { tr: "Kırmızı Işık", ar: "الضَّوْء الأَحْمَر" },
    { tr: "Sarı Işık", ar: "الضَّوْء الأَصْفَر" },
    { tr: "Yeşil Işık", ar: "الضَّوْء الأَخْضَر" },

    // Fiiller (Eylemler)
    { tr: "Gitti", ar: "ذَهَبَ" },
    { tr: "Ziyaret edeyim / ediyorum", ar: "أَزُورَ" },
    { tr: "Döneceğim", ar: "سَأَرْجِعُ" },
    { tr: "Ulaşacağım / Varacağım", ar: "سَأَصِلُ" },
    { tr: "Gidiyor / İlerliyor", ar: "تَسِيرُ" },
    { tr: "Bindi", ar: "رَكِبَتْ" },
    { tr: "İndi", ar: "نَزَلَ" },
    { tr: "Yürü", ar: "اِمْشِ" },
    { tr: "Yönel", ar: "اِتَّجِهْ" },
    { tr: "Geçiyor (Karşıya)", ar: "يَعْبُرُ" },
    { tr: "Hazırlanıyor", ar: "يَسْتَعِدُّ" },
    { tr: "Duruyor", ar: "تَقِفُ" },
    { tr: "Kalacağım (Konaklayacağım)", ar: "سَأُقِيمُ" },
    { tr: "Sürüyor / Zaman alıyor", ar: "تَسْتَغْرِقُ" },

    // Sıfatlar, Zıt Anlamlılar ve Kıyaslamalar
    { tr: "Yeni", ar: "حَدِيثَة" },
    { tr: "Daha yeni", ar: "أَحْدَث" },
    { tr: "Eski", ar: "قَدِيمَة" },
    { tr: "Daha eski", ar: "أَقْدَم" },
    { tr: "Hızlı", ar: "سَرِيع" },
    { tr: "Daha hızlı", ar: "أَسْرَع" },
    { tr: "Güzel", ar: "جَمِيلَة" },
    { tr: "Daha güzel", ar: "أَجْمَل" },
    { tr: "Geniş", ar: "وَاسِع" },
    { tr: "Uygun", ar: "مُنَاسِبَة" },
    { tr: "Hazır", ar: "جَاهِزَة" },
    { tr: "Kalabalık", ar: "مُزْدَحِم" },
    { tr: "Yürüyerek", ar: "مَشْيًا" },

    // Zaman ve Saatler ile İlgili İfadeler
    { tr: "Çeyrek", ar: "الرُّبْع" },
    { tr: "Üçte bir (Yirmi kala/geçe)", ar: "الثُّلُث" },
    { tr: "Kala / Var (Saat)", ar: "إِلَّا" },
    { tr: "Geçe (Saat)", ar: "وَ" },
    { tr: "Yarın", ar: "غَدًا" },
    { tr: "Gelecek Hafta", ar: "الأُسْبُوع القَادِم" },
    { tr: "Biraz sonra", ar: "بَعْدَ قَلِيل" }
];
