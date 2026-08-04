/* 7_3 dersinin cümleleri/diyaloğu (ortak muhadese.html + simultane.js kullanır) */
window.data = {
sentence: [
    // --- التعريف والروتين اليومي ---
    {
        words: [
            { tr: "Adım", order: 1, ar: "اِسْمي" },
            { tr: "Ömer,", order: 2, ar: "عُمَر،" },
            { tr: "ben", order: 3, ar: "أَنا" },
            { tr: "İstanbul'da", order: 5, ar: "في إِسْطَنْبول." },
            { tr: "oturuyorum.", order: 4, ar: "أَسْكُنُ" }
        ]
    },
    {
        words: [
            { tr: "Bisiklete", order: 2, ar: "الدَّرّاجَة،" },
            { tr: "biniyorum,", order: 1, ar: "أَرْكَبُ" },
            { tr: "sonra", order: 3, ar: "ثُمَّ" },
            { tr: "okula", order: 5, ar: "إِلى المَدْرَسَة." },
            { tr: "yöneliyorum.", order: 4, ar: "أَتَّجِهُ" }
        ]
    },
    {
        words: [
            { tr: "Babam", order: 1, ar: "أَبي" },
            { tr: "tüccardır,", order: 2, ar: "تاجِر،" },
            { tr: "O", order: 3, ar: "هُو" },
            { tr: "Ankara'ya", order: 5, ar: "إِلى أَنْقَرَة" },
            { tr: "uçakla", order: 6, ar: "بِالطّائِرَة." },
            { tr: "yolculuk yapar.", order: 4, ar: "يُسافِرُ" }
        ]
    },
    {
        words: [
            { tr: "Annem", order: 1, ar: "أُمّي" },
            { tr: "doktordur,", order: 2, ar: "طَبيبَة،" },
            { tr: "o", order: 3, ar: "هِي" },
            { tr: "arabayla", order: 6, ar: "بِالسَّيّارَة." },
            { tr: "hastaneye", order: 5, ar: "إِلى المُسْتَشْفى" },
            { tr: "gidiyor.", order: 4, ar: "تَذْهَبُ" }
        ]
    },
    {
        words: [
            { tr: "Kız kardeşim", order: 1, ar: "أُخْتي" },
            { tr: "mühendistir,", order: 2, ar: "مُهَنْدِسَة،" },
            { tr: "o", order: 3, ar: "هِي" },
            { tr: "trenle", order: 6, ar: "بِالقِطار." },
            { tr: "İstanbul'da", order: 5, ar: "إِلى إِسْطَنْبول" },
            { tr: "dönüyor.", order: 4, ar: "تَرْجِعُ" }
        ]
    },
    {
        words: [
            { tr: "Ben", order: 1, ar: "أَنا" },
            { tr: "tatilde", order: 4, ar: "في العُطْلَة" },
            { tr: "gemiyle", order: 5, ar: "بِالسَّفينَة." },
            { tr: "Bursa'ya", order: 3, ar: "إِلى بورْصَة" },
            { tr: "yolculuk yaparım.", order: 2, ar: "أُسافِرُ" }
        ]
    },
    {
        words: [
            { tr: "Her sabah", order: 3, ar: "كُلّ صَباح." },
            { tr: "bisiklete", order: 2, ar: "الدَّرّاجَة" },
            { tr: "binerim.", order: 1, ar: "أَنا أَرْكَبُ" }
        ]
    },

    // --- العائلة والمدن ---
    {
        words: [
            { tr: "Ayşe", order: 1, ar: "عائِشَة" },
            { tr: "trenle", order: 4, ar: "بِالقِطار." },
            { tr: "Kayseri'ye", order: 3, ar: "إِلى قَيْصَري" },
            { tr: "yolculuk yapıyor.", order: 2, ar: "تُسافِرُ" }
        ]
    },
    {
        words: [
            { tr: "Hasan", order: 1, ar: "حَسَن" },
            { tr: "gemiyle", order: 4, ar: "بِالسَّفينَة." },
            { tr: "Antalya'ya", order: 3, ar: "إِلى أَنْطالِيا" },
            { tr: "dönüyor.", order: 2, ar: "يَرْجِعُ" }
        ]
    },
    {
        words: [
            { tr: "Dedem", order: 1, ar: "جَدّي" },
            { tr: "arabayla", order: 4, ar: "بِالسَّيّارَة." },
            { tr: "camiye", order: 3, ar: "إِلى المَسْجِد" },
            { tr: "yöneliyor.", order: 2, ar: "يَتَّجِهُ" }
        ]
    },
    {
        words: [
            { tr: "Sen (E)", order: 1, ar: "أَنْتَ" },
            { tr: "uçakla", order: 4, ar: "بِالطّائِرَة." },
            { tr: "İstanbul'da", order: 3, ar: "إِلى إِسْطَنْبول" },
            { tr: "ulaşıyorsun.", order: 2, ar: "تَصِلُ" }
        ]
    },
    {
        words: [
            { tr: "Sen (K)", order: 1, ar: "أَنْتِ" },
            { tr: "metroyla", order: 4, ar: "بِالمِتْرو." },
            { tr: "kütüphaneye", order: 3, ar: "إِلى المَكْتَبَة" },
            { tr: "gidiyorsun.", order: 2, ar: "تَذْهَبينَ" }
        ]
    },

    // --- مسارات السفر (بحراً، براً، جواً) ---
    {
        words: [
            { tr: "Kütüphaneye", order: 2, ar: "إِلى المَكْتَبَة" },
            { tr: "yürüyerek", order: 3, ar: "مَشْيًا." },
            { tr: "gidiyorum.", order: 1, ar: "أَذْهَبُ" }
        ]
    },
    {
        words: [
            { tr: "Erkek kardeşim", order: 1, ar: "أَخي" },
            { tr: "deniz yoluyla", order: 4, ar: "بَحْرًا." },
            { tr: "İzmir'e", order: 3, ar: "إِلى إِزْمير" },
            { tr: "yolculuk yapıyor.", order: 2, ar: "يُسافِرُ" }
        ]
    },
    {
        words: [
            { tr: "Kız kardeşim", order: 1, ar: "أُخْتي" },
            { tr: "kara yoluyla", order: 4, ar: "بَرًّا." },
            { tr: "Mardin'e", order: 3, ar: "إِلى مارْدين" },
            { tr: "ulaşıyor.", order: 2, ar: "تَصِلُ" }
        ]
    },
    {
        words: [
            { tr: "Amcam", order: 1, ar: "عَمّي" },
            { tr: "hava yoluyla", order: 4, ar: "جَوًّا." },
            { tr: "Sivas'tan", order: 3, ar: "مِن سيواس" },
            { tr: "dönüyor.", order: 2, ar: "يَرْجِعُ" }
        ]
    },

    // --- الصفات والمقارنات ---
    { words: [{ tr: "Otobüs", order: 1, ar: "الحافِلَة" }, { tr: "eskidir.", order: 2, ar: "قَديمَة." }] },
    { words: [{ tr: "Araba", order: 1, ar: "السَّيّارَة" }, { tr: "yenidir.", order: 2, ar: "حَديثَة." }] },
    {
        words: [
            { tr: "Tren", order: 1, ar: "القِطار" },
            { tr: "otobüsten", order: 3, ar: "مِن الحافِلَة." },
            { tr: "daha eskidir.", order: 2, ar: "أَقْدَم" }
        ]
    },
    {
        words: [
            { tr: "Metro", order: 1, ar: "المِتْرو" },
            { tr: "arabadan", order: 3, ar: "مِن السَّيّارَة." },
            { tr: "daha yenidir.", order: 2, ar: "أَحْدَث" }
        ]
    },
    { words: [{ tr: "Bisiklet", order: 1, ar: "الدَّرّاجَة" }, { tr: "yavaştır.", order: 2, ar: "بَطيئَة." }] },
    { words: [{ tr: "Uçak", order: 1, ar: "الطّائِرَة" }, { tr: "hızlıdır.", order: 2, ar: "سَريعَة." }] },
    {
        words: [
            { tr: "Bisiklet", order: 1, ar: "الدَّرّاجَة" },
            { tr: "trenden", order: 3, ar: "مِن القِطار." },
            { tr: "daha yavaştır.", order: 2, ar: "أَبْطأ" }
        ]
    },
    {
        words: [
            { tr: "Uçak", order: 1, ar: "الطّائِرَة" },
            { tr: "gemiden", order: 3, ar: "مِن السَّفينَة." },
            { tr: "daha hızlıdır.", order: 2, ar: "أَسْرَع" }
        ]
    },

    // --- الاتجاهات والإرشادات ---
    {
        words: [
            { tr: "Eski çarşıya", order: 3, ar: "إِلى السّوق القَديم؟" },
            { tr: "nasıl", order: 1, ar: "كَيْف" },
            { tr: "giderim?", order: 2, ar: "أَذْهَبُ" }
        ]
    },
    {
        words: [
            { tr: "Yolu", order: 2, ar: "الطَّريق،" },
            { tr: "geç,", order: 1, ar: "اُعْبُر" },
            { tr: "sonra", order: 3, ar: "ثُمَّ" },
            { tr: "biraz", order: 6, ar: "قَليلًا." },
            { tr: "öne doğru", order: 5, ar: "إِلى الأَمام" },
            { tr: "yürü.", order: 4, ar: "اِمْشِ" }
        ]
    },
    {
        words: [
            { tr: "Duraktan", order: 3, ar: "مِن المَوْقِف." },
            { tr: "otobüse", order: 2, ar: "الحافِلَة" },
            { tr: "bin.", order: 1, ar: "ارْكَبْ" }
        ]
    },
    {
        words: [
            { tr: "Hastane", order: 3, ar: "المُسْتَشْفى." },
            { tr: "önünde", order: 2, ar: "أَمام" },
            { tr: "in.", order: 1, ar: "اِنْزلْ" }
        ]
    },
   {
    words: [
      { tr: "Çarşı", order: 1, ar: "السّوق" },
      { tr: "soldadır.", order: 2, ar: "عَلى اليَسار." }
    ]
  },
  {
    words: [
      { tr: "Öne doğru", order: 2, ar: "إِلى الأَمام." },
      { tr: "yürü. (E/K)", order: 1, ar: "اِمْشِ / اِمْشي" }
    ]
  },
  {
    words: [
      { tr: "Okul önünde", order: 2, ar: "أَمام المَدْرَسَة." },
      { tr: "dur. (E/K)", order: 1, ar: "قِفْ / قِفي" }
    ]
  },
  {
    words: [
      { tr: "Yolu", order: 2, ar: "الطَّريق." },
      { tr: "geç. (E/K)", order: 1, ar: "اُعْبُرْ / اُعْبُري" }
    ]
  },
  {
    words: [
      { tr: "Uçağa", order: 2, ar: "الطّائِرَة." },
      { tr: "bin. (E/K)", order: 1, ar: "اِرْكَبْ / اِرْكَبي" }
    ]
  },
  {
    words: [
      { tr: "Otobüsten", order: 2, ar: "مِن الحافِلَة." },
      { tr: "in. (E/K)", order: 1, ar: "اِنْزِلْ / اِنْزِلي" }
    ]
  },
  {
    words: [
      { tr: "Bu", order: 3, ar: "هَذا" },
      { tr: "adrese", order: 4, ar: "العُنْوان‫.‬" },
      { tr: "(e) doğru", order: 2, ar: "إِلى" },
      { tr: "git.", order: 1, ar: "اِذْهَبْ" }
    ]
  },
  {
    words: [
      { tr: "Caddeyi", order: 2, ar: "الشّارِع." },
      { tr: "geç. (K)", order: 1, ar: "اُعْبُري" }
    ]
  },
  {
    words: [
      { tr: "Okul", order: 1, ar: "المَدْرَسَة" },
      { tr: "sağdadır.", order: 2, ar: "عَلى اليَمين." }
    ]
  },
  {
    words: [
      { tr: "Hastane", order: 1, ar: "المُسْتَشْفى" },
      { tr: "soldadır.", order: 2, ar: "عَلى اليَسار." }
    ]
  },
  {
    words: [
      { tr: "Trafik", order: 2, ar: "المُرور" },
      { tr: "ışıkları (işaretleri)", order: 1, ar: "إِشارات" },
      { tr: "önemlidir.", order: 3, ar: "مُهِمَّة." }
    ]
  },
  {
    words: [
      { tr: "Sarı", order: 4, ar: "الأَصْفَر." },
      { tr: "ışık(ta)", order: 3, ar: "الضَّوْء" },
      { tr: "sırasında", order: 2, ar: "عِنْد" },
      { tr: "geçmem.", order: 1, ar: "لا أَعْبُرُ" }
    ]
  },
  {
    words: [
      { tr: "Kırmızı", order: 4, ar: "الأَحْمَر." },
      { tr: "ışık(ta)", order: 3, ar: "الضَّوْء" },
      { tr: "sırasında", order: 2, ar: "عِنْد" },
      { tr: "dur.", order: 1, ar: "قِفْ" }
    ]
  },
  {
    words: [
      { tr: "Yeşil", order: 4, ar: "الأَخْضَر." },
      { tr: "ışık(ta)", order: 3, ar: "الضَّوْء" },
      { tr: "sırasında", order: 2, ar: "عِنْد" },
      { tr: "geç.", order: 1, ar: "اُعْبُرْ" }
    ]
  }
],
dialog: [
    // الحوار 1: مراد وشيماء (الطريق إلى السوق)
    {
        p1: [
            { tr: "Merhaba", order: 1, ar: "مَرْحَبًا" },
            { tr: "Şeyma,", order: 2, ar: "يا شَيْماء،" },
            { tr: "eski", order: 7, ar: "القَديم؟" },
            { tr: "çarşıya", order: 6, ar: "السّوق" },
            { tr: "(e) doğru", order: 5, ar: "إِلى" },
            { tr: "nasıl", order: 3, ar: "كَيْف" },
            { tr: "giderim?", order: 4, ar: "أَذْهَبُ" }
        ],
        p2: [
            // 1. Cümle: Merhaba Murat
// 1. Merhaba Murat
{ tr: "Merhaba", order: 1, ar: "مَرْحَبًا بِك" },
{ tr: "Murat,", order: 2, ar: "يا مُراد،" },

// 2. Yolu geç
{ tr: "yolu", order: 4, ar: "الطَّريقَ،" },
{ tr: "geç,", order: 3, ar: "اُعْبُرْ" },

// 3. Biraz öne doğru yürü
{ tr: "biraz", order: 8, ar: "قَلِيلًا،" },
{ tr: "öne", order: 7, ar: "الأَمَامِ" },
{ tr: "doğru", order: 6, ar: "إِلَى" }, // Arapçada 'ila' hem e hem doğru anlamını karşılar
{ tr: "yürü", order: 5, ar: "اِمْشِ" },

// 4. Ve sola yönel
{ tr: "ve", order: 9, ar: "وَاتَّجِهْ" },
{ tr: "sola", order: 10, ar: "إِلَى اليَسَارِ" },
{ tr: "yönel", order: 9, ar: "وَاتَّجِهْ" },

// 5. Sonra duraktan otobüse bin
{ tr: "sonra", order: 11, ar: "ثُمَّ" },
{ tr: "duraktan", order: 14, ar: "مِنَ المَوْقِفِ‫.‬" },
{ tr: "otobüse", order: 13, ar: "الحَافِلَةَ" },
{ tr: "bin.", order: 12, ar: "ارْكَبْ" }
        ]
    },
    {
        p1: [
            { tr: "Otobüsten", order: 3, ar: "مِن الحافِلَة؟" },
            { tr: "nerede", order: 1, ar: "أَيْن" },
            { tr: "inerim?", order: 2, ar: "أَنْزِلُ" }
        ],
        p2: [
            { tr: "Hastane", ar: "المُسْتَشْفى", order: 3 },
    { tr: "önünde", ar: "أَمام", order: 2 },
    { tr: "in,", ar: "اِنْزِلْ", order: 1 },
    { tr: "çarşı", ar: "السّوق", order: 4 },
    { tr: "soldadır.", ar: "عَلى اليَسار.", order: 5 }
        ]
    },
   {
        p1: [
            { tr: "Teşekkürler", ar: "شُكْرًا", order: 1 },
            { tr: "sana", ar: "لَك", order: 2 },
            { tr: "Şeyma,", ar: "يا شَيْماء،", order: 3 },
            { tr: "görüşmek üzere.", ar: "إِلى اللِّقاء.", order: 4 }
        ],
        p2: [
            { tr: "Rica ederim,", ar: "عَفْوًا،", order: 1 },
            { tr: "selametle.", ar: "مَع السَّلامَة.", order: 2 }
        ]
    },

    // Diyalog 2
    {
        p1: [
            { tr: "Nereye", ar: "إِلى أَيْن", order: 1 },
            { tr: "yolculuk yapıyorsun?", ar: "تُسافِرينَ؟", order: 2 }
        ],
        p2: [
            { tr: "Yolculuk yapıyorum", ar: "أُسافِرُ", order: 1 },
            { tr: "Ankara'ya.", ar: "إِلى أَنْقَرَة.", order: 2 }
        ]
    },
    {
        p1: [
            { tr: "Nereden", ar: "مِن أَيْن", order: 1 },
            { tr: "dönüyorsun?", ar: "تَرْجِعُ؟", order: 2 }
        ],
        p2: [
            { tr: "Dönüyorum", ar: "أَرْجِعُ", order: 1 },
            { tr: "kütüphaneden.", ar: "مِن المَكْتَبَة.", order: 2 }
        ]
    },
    {
        p1: [
            { tr: "Ne ile", ar: "بِماذا", order: 1 },
            { tr: "dönüyorsun", ar: "تَرْجِعينَ", order: 2 },
            { tr: "eve?", ar: "إِلى البَيْت؟", order: 3 }
        ],
        p2: [
            { tr: "Dönüyorum", ar: "أَرْجِعُ", order: 1 },
            { tr: "eve", ar: "إِلى البَيْت", order: 2 },
            { tr: "otobüsle.", ar: "بِالحافِلَة.", order: 3 }
        ]
    },

    // Diyalog 3
    {
        p1: [
            { tr: "Merhaba Selma,", ar: "مَرْحَبًا يا سَلْمى،", order: 1 },
            { tr: "ne ile", ar: "بِماذا", order: 2 },
            { tr: "gidiyorsun", ar: "تَذْهَبينَ", order: 3 },
            { tr: "okula?", ar: "إِلى المَدْرَسَة؟", order: 4 }
        ],
        p2: [
            { tr: "Merhaba Sadık.", ar: "مَرْحَبًا بَك يا صادِق.", order: 1 },
            { tr: "Gidiyorum", ar: "أَذْهَبُ", order: 2 },
            { tr: "okula", ar: "إِلى المَدْرَسَة", order: 3 },
            { tr: "yürüyerek,", ar: "مَشْيًا،", order: 4 },
            { tr: "ya sen", ar: "وَأَنْت", order: 5 },
            { tr: "nasıl", ar: "كَيْف", order: 6 },
            { tr: "gidersin?", ar: "تَذْهَبُ؟", order: 7 }
        ]
    },

    // Diyalog 4
    {
        p1: [
            { tr: "Nasıl", ar: "كَيْف", order: 1 },
            { tr: "giderim", ar: "أَذْهَبُ", order: 2 },
            { tr: "yeni", ar: "الجَديد؟", order: 4 },
            { tr: "hastaneye?", ar: "إِلى المُسْتَشْفى", order: 3 },
        ],
        p2: [
            { tr: "Yönel", ar: "اِتَّجِهي", order: 1 },
            { tr: "sağa,", ar: "إِلى اليَمين،", order: 2 },
            { tr: "yürü", ar: "اِمْشي", order: 3 },
            { tr: "biraz,", ar: "قَليلًا،", order: 4 },
            { tr: "sonra", ar: "ثُمَّ", order: 5 },
            { tr: "bin", ar: "ارْكَبي", order: 6 },
            { tr: "otobüse", ar: "الحافِلَة", order: 7 },
            { tr: "duraktan.", ar: "مِن المَوْقِف.", order: 8 }
        ]
    },

    // Paragraf 5: Selim
    {
        p1: [
            { tr: "Merhaba,", ar: "مَرْحَبًا،", order: 1 },
            { tr: "adım", ar: "اِسْمي", order: 2 },
            { tr: "Selim.", ar: "سَليم،", order: 3 },
            { tr: "Okula", ar: "إِلى المَدْرَسَة", order: 5 },
            { tr: "metroyla", ar: "بِالمِتْرو‫.‬", order: 6 },
            { tr: "gidiyorum.", ar: "أَذْهَبُ", order: 4 }
            
        ],
       p2: [
            { tr: "Okuldan", ar: "مِن المَدْرَسَة", order: 2 },
            { tr: "saat ikide", ar: "في السّاعَة الثّانِيَة،", order: 3 },
            { tr: "çıkıyorum,", ar: "أَخْرُجُ", order: 1 },
            { tr: "sonra", ar: "ثُمَّ", order: 4 },
            { tr: "arkadaşımla", ar: "مَع صَديقي", order: 7 },
            { tr: "kütüphaneye", ar: "إِلى المَكْتَبَة", order: 6 },
            { tr: "yürüyerek", ar: "مَشْيًا‫.‬", order: 8 },
            { tr: "gidiyorum.", ar: "أَذْهَبُ", order: 5 }
        ]
    },
    {
        p1: [
            { tr: "Kütüphaneden", ar: "مِن المَكْتَبَة", order: 2 },
            { tr: "saat beşte", ar: "في السّاعَة الخامِسَة‫.‬", order: 3 },
            { tr: "çıkıyorum.", ar: "أَخْرُجُ", order: 1 }
        ],
        p2: [
            { tr: "Akşam", ar: "مَساءً", order: 3 },
            { tr: "eve", ar: "إِلى البَيْت", order: 2 },
            { tr: "otobüsle", ar: "بالحافِلَة.", order: 4 },
            { tr: "dönüyorum.", ar: "أَرْجِعُ", order: 1 }
        ]
    }
]
};
/* kelimeler (kart + hafıza oyunu) */
window.data.words = [
   // --- Fiiller (Eylemler) ---
    { tr: "Yaşıyorum / Oturuyorum", ar: "أَسْكُنُ" },
    { tr: "Biniyorum", ar: "أَرْكَبُ" },
    { tr: "Yöneliyorum", ar: "أَتَّجِهُ" },
    { tr: "Yolculuk yapıyorum", ar: "يُسافِرُ" },
    { tr: "Gidiyor / Gidiyorum", ar: "تَذْهَبُ / أَذْهَبُ" },
    { tr: "Dönüyor / Dönüyorum", ar: "تَرْجِعُ / أَرْجِعُ" },
    { tr: "Ulaşıyor / Varıyor", ar: "تَصِلُ" },
    { tr: "Çıkıyorum", ar: "أَخْرُجُ" },
    { tr: "(Yolu) Geç", ar: "اُعْبُرْ" },
    { tr: "Yürü", ar: "اِمْشِ" },
    { tr: "İn", ar: "اِنْزِلْ" },
    { tr: "Dur", ar: "قِفْ" },

    // --- Meslekler ve Kişiler ---
    { tr: "Tüccar", ar: "تاجِر" },
    { tr: "Doktor", ar: "طَبيبَة" },
    { tr: "Mühendis", ar: "مُهَنْدِسَة" },
    { tr: "Dede", ar: "جَدّ" },
    { tr: "Amca", ar: "عَمّ" },
    { tr: "Arkadaş", ar: "صَديق" },

    // --- Ulaşım Araçları ---
    { tr: "Bisiklet", ar: "الدَّرّاجَة" },
    { tr: "Uçak", ar: "الطّائِرَة" },
    { tr: "Araba", ar: "السَّيّارَة" },
    { tr: "Tren", ar: "القِطار" },
    { tr: "Gemi", ar: "السَّفينَة" },
    { tr: "Otobüs", ar: "الحافِلَة" },
    { tr: "Metro", ar: "المِتْرو" },

    // --- Yerler ve Mekanlar ---
    { tr: "Hastane", ar: "المُسْتَشْفى" },
    { tr: "Kütüphane", ar: "المَكْتَبَة" },
    { tr: "Çarşı / Pazar", ar: "السّوق" },
    { tr: "Durak", ar: "المَوْقِف" },
    { tr: "İstasyon", ar: "مَحَطَّة" },
    { tr: "Yol / Cadde", ar: "الطَّريق / الشّارِع" },
    { tr: "Adres", ar: "العُنْنوان" },

    // --- Yönler ve Zarflar ---
    { tr: "Sağ", ar: "اليَمين" },
    { tr: "Sol", ar: "اليَسار" },
    { tr: "Öne doğru", ar: "إِلى الأَمام" },
    { tr: "Yürüyerek", ar: "مَشْيًا" },
    { tr: "Deniz yoluyla", ar: "بَحْرًا" },
    { tr: "Kara yoluyla", ar: "بَرًّا" },
    { tr: "Hava yoluyla", ar: "جَوًّا" },
    { tr: "Az / Biraz", ar: "قَليلًا" },
    { tr: "Önünde", ar: "أَمام" },

    // --- Sıfatlar ve Karşılaştırma ---
    { tr: "Eski", ar: "قَديم" },
    { tr: "Yeni", ar: "حَديث / جَديد" },
    { tr: "Daha eski", ar: "أَقْدَم" },
    { tr: "Daha yeni", ar: "أَحْدَث" },
    { tr: "Yavaş", ar: "بَطيئَة" },
    { tr: "Hızlı", ar: "سَريعَة" },
    { tr: "Daha yavaş", ar: "أَبْطأ" },
    { tr: "Daha hızlı", ar: "أَسْرَع" },

    // --- Trafik ve Diğer ---
    { tr: "Tatil", ar: "العُطْلَة" },
    { tr: "Trafik ışıkları", ar: "إِشارات المُرور" },
    { tr: "Sarı ışık", ar: "الضَّوْء الأَصْفَر" },
    { tr: "Kırmızı ışık", ar: "الضَّوء الأَحْمَر" },
    { tr: "Yeşil ışık", ar: "الضَّوء الأَخْضَر" },
    { tr: "Önemli", ar: "مُهِمَّة" }
];
