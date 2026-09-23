/* 10_1_1 dersinin cümleleri/diyaloğu (ortak muhadese.html + simultane.js kullanır) */
window.data = {
    sentence: [
        // 1. Cümle: Ben hastayım.
   {
        words: [
            { tr: "Ben", order: 1, ar: "أَنا" },
            { tr: "işçiyim,", order: 2, ar: "عامِل،" },
            { tr: "fabrikada", order: 4, ar: "في المَصْنَع." },
            { tr: "çalışıyorum.", order: 3, ar: "أَعْمَلُ" },
            
        ]
    },

    // Cümle: Babam ve kardeşim mühendistirler, şirkette çalışıyorlar.
    {
        words: [
            { tr: "Babam", order: 1, ar: "أَبي" },
            { tr: "ve kardeşim", order: 2, ar: "وَأَخي" },
            { tr: "mühendistirler,", order: 3, ar: "مُهَنْدِسان،" },
            { tr: "ve onlar", order: 4, ar: "وَهُما" },
            { tr: "şirkette", order: 6, ar: "في الشَّرِكَة." },
            { tr: "çalışıyorlar", order: 5, ar: "يَعْمَلانِ" }
           
           
        ]
    },

    // Cümle: Annem doktor ve kız kardeşim hemşiredir, hastanede çalışıyorlar.
    {
        words: [
            { tr: "Annem", order: 1, ar: "أُمّي" },
            { tr: "doktordur", order: 2, ar: "طَبيبَة" },
            { tr: "ve kız kardeşim", order: 3, ar: "وَأُخْتي" },
            { tr: "hemşiredir,", order: 4, ar: "مُمَرِّضَة،" },
            { tr: "onlar", order: 5, ar: "وَهُما" },
            { tr: "hastanede", order: 7, ar: "فِي المُسْتَشْفى." },
            { tr: "çalışıyorlar.", order: 6, ar: "تَعْمَلانِ" }
        ]
    },

    // Cümle: Dayım öğretmendir, okulda ders veriyor.
    {
        words: [
            { tr: "Dayım", order: 1, ar: "خالي" },
            { tr: "öğretmendir", order: 2, ar: "مُدَرِّس،" },
            { tr: "ve o", order: 3, ar: "وَهُو" },
            { tr: "okulda", order: 5, ar: "في المَدْرَسَة." },
            { tr: "ders veriyor.", order: 4, ar: "يُدَرِّسُ" },
        ]
    },

    // Cümle: Teyzem memurdur, ofiste çalışıyor.
    {
        words: [
            { tr: "Teyzem", order: 1, ar: "خالَتي" },
            { tr: "memurdur", order: 2, ar: "مُوَظَّفَة،" },
            { tr: "ve o", order: 3, ar: "وَهِي" },
            { tr: "ofiste", order: 5, ar: "في المَكْتَب." },
            { tr: "çalışıyor.", order: 4, ar: "تَعْمَلُ" }
           
        ]
    },

    // Cümle: Sen emeklisin.
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتَ" },
            { tr: "emeklisin.", order: 2, ar: "مُتَقاعِد." }
        ]
    },

    // Cümle: Babam avukattır, adaleti savunur.
    {
        words: [
            { tr: "Babam", order: 1, ar: "والِدي" },
            { tr: "avukattır", order: 2, ar: "مُحامٍ،" },
            { tr: "ve o", order: 3, ar: "وَهُوَ" },
            { tr: "adaleti", order: 5, ar: "عَنِ العَدالَة." },
            { tr: "savunur.", order: 4, ar: "يُدافِعُ" },
        ]
    },

    // Cümle: Annem ev hanımıdır, ailemizle ilgilenir.
    {
        words: [
            { tr: "Annem", order: 1, ar: "والِدَتي" },
            { tr: "ev", order: 2, ar: "رَبَّة" }, // Tamlama: Rabbe
            { tr: "hanımıdır", order: 3, ar: "البَيْت،" }, 
            { tr: "ve o", order: 4, ar: "وَهِيَ" }, // İle edatı
            { tr: "ailemizle", order: 6, ar: "بِعائِلَتِنا." },
            { tr: "ilgilenir.", order: 5, ar: "تَهْتَمُّ" }
        ]
    },
    
    // Düzenleme notu: 'Rabbetü'l-beyt' tamlamasını daha iyi göstermek için alternatif:
    // { tr: "ev hanımıdır", order: 2, ar: "رَبَّة البَيْت" } şeklinde birleştirilebilir.
    
    // Cümle: Ben şoförüm, taksi sürüyorum.
    {
        words: [
            { tr: "Ben", order: 1, ar: "أَنا" },
            { tr: "şoförüm,", order: 2, ar: "سائِق،" },
            { tr: "ticari/ücretli", order: 5, ar: "أُجْرَة." },
            { tr: "taksi", order: 4, ar: "سَيّارَة" },
            { tr: "sürüyorum.", order: 3, ar: "أَسوقُ" },
        ]
    }
],
 dialog: [
   
    {
        p1: [
            { tr: "Baban", order: 3, ar: "والِدُكِ؟" },
            { tr: "ne", order: 1, ar: "ماذا" },
            { tr: "iş yapıyor?", order: 2, ar: "يَعْمَلُ" }
            
        ],
        p2: [
            { tr: "O", order: 1, ar: "هُو" },
            { tr: "mühendistir.", order: 2, ar: "مُهَنْدِس." }
        ]
    },
    {
        p1: [
            { tr: "Nerede", order: 1, ar: "أَيْن" },
            { tr: "çalışıyor?", order: 2, ar: "يَعْمَلُ؟" }
        ],
        p2: [
            { tr: "O", order: 1, ar: "هُو" },
            { tr: "şirkette", order: 3, ar: "في الشَّرِكَة." },
            { tr: "çalışıyor.", order: 2, ar: "يَعْمَلُ" }
           
        ]
    },
    {
        p1: [
            { tr: "Annen", order: 3, ar: "والِدَتُكِ؟" },
            { tr: "ne", order: 1, ar: "ماذا" },
            { tr: "iş yapıyor?", order: 2, ar: "تَعْمَلُ" }
            
        ],
        p2: [
            { tr: "O", order: 1, ar: "هِي" },
            { tr: "aşçıdır.", order: 2, ar: "طَبّاخَة." }
        ]
    },
    {
        p1: [
            { tr: "Annen", order: 3, ar: "أُمُّك؟" },
            { tr: "nerede", order: 1, ar: "أَيْن" },
            { tr: "çalışıyor?", order: 2, ar: "تَعْمَلُ" }
        ],
        p2: [
            { tr: "O", order: 1, ar: "هِي" },
            { tr: "restoranda", order: 3, ar: "في المَطْعَم." },
            { tr: "çalışıyor.", order: 2, ar: "تَعْمَلُ" }
           
        ]
    },
{
        p1: [
            { tr: "Merhaba", order: 1, ar: "مَرْحَبًا" },
            { tr: "Furkan.", order: 2, ar: "يا فُرْقان." }
        ],
        p2: [
            { tr: "Merhaba", order: 1, ar: "مَرْحَبًا" },
            { tr: "Hasan,", order: 2, ar: "حَسَن،" },
            { tr: "uzun zamandan", order: 5, ar: "زَمَن طَويل‫.‬" },
            { tr: "beridir", order: 4, ar: "مُنْذُ" },
            { tr: "seni görmedim.", order: 3, ar: "ما رَأَيْتُكَ" },
        ]
    },
    {
        p1: [
            { tr: "Ben", order: 1, ar: "أَنا" },
            { tr: "seni", order: 3, ar: "إِلَيْكَ." },
            { tr: "özledim.", order: 2, ar: "مُشْتاق" },
            
        ],
        p2: [
            { tr: "Ben de,", order: 1, ar: "وَأَنا أَيْضًا،" },
            { tr: "şu anki", order: 4, ar: "الآن؟" },
            { tr: "mesleğin", order: 3, ar: "مِهْنَتُكَ" }, 
            { tr: "ne?", order: 2, ar: "ما" }
           
        ]
    },
    {
        p1: [
            { tr: "Ben", order: 1, ar: "أَنا" },
            { tr: "avukatım,", order: 2, ar: "مُحامٍ،" },
            { tr: "adaleti", order: 4, ar: "عَن العَدالَة." },
            { tr: "savunuyorum.", order: 3, ar: "أُدافِعُ" }
            
        ],
        p2: [
            { tr: "Peki sen,", order: 1, ar: "وَأَنْتَ" },
            { tr: "nedir", order: 2, ar: "ما" },
            { tr: "mesleğin", order: 3, ar: "مِهْنَتُكَ" },
            { tr: "şu an?", order: 4, ar: "الآن؟" }
        ]
    },
    {
        p1: [
            { tr: "Ben", order: 1, ar: "أَنا" },
            { tr: "mühendisim,", order: 2, ar: "مُهَنْدِس،" },
            { tr: "çalışıyorum", order: 3, ar: "أَعْمَلُ" },
            { tr: "ofiste.", order: 4, ar: "في المَكْتَب." }
        ],
        p2: [
            { tr: "Maşallah.", order: 1, ar: "ما شاءَ الله." }
        ]
    }
        
    ]
};
/* kelimeler (kart + hafıza oyunu) */
window.data.words = [
     { tr: "Baba", ar: "أَب" }, { tr: "Anne", ar: "أُمّ" }, { tr: "Dede", ar: "جَدّ" }, { tr: "Nine", ar: "جَدَّة" },
        { tr: "Amca", ar: "عَمّ" }, { tr: "Hala", ar: "عَمَّة" }, { tr: "Dayı", ar: "خَال" }, { tr: "Teyze", ar: "خَالَة" },
        { tr: "Erkek Kardeş", ar: "أَخ" }, { tr: "Kız Kardeş", ar: "أُخْت" }, { tr: "Ailem", ar: "أُسْرَتِي" },
        { tr: "Akrabalarım", ar: "أَقَارِبِي" }, { tr: "İşçi", ar: "عَامِلٌ" }, { tr: "Mühendis", ar: "مُهَنْدِسٌ" },
        { tr: "Doktor", ar: "طَبِيبَةٌ" }, { tr: "Hemşire", ar: "مُمَرِّضَةٌ" }, { tr: "Öğretmen", ar: "مُدَرِّسٌ" },
        { tr: "Memur", ar: "مُوَظَّفَةٌ" }, { tr: "Emekli", ar: "مُتَقَاعِدٌ" }, { tr: "Fabrika", ar: "مَصْنَعٌ" },
        { tr: "Şirket", ar: "شَرِكَةٌ" }, { tr: "Hastane", ar: "مُسْتَشْفَى" }, { tr: "Okul", ar: "مَدْرَسَةٌ" },
        { tr: "Ofis / Büro", ar: "مَكْتَبٌ" }, { tr: "Resim", ar: "صُورَةٌ" }, { tr: "Çalışıyor", ar: "يَعْمَلُ" },
        { tr: "Seviyorum", ar: "أُحِبُّ" }, { tr: "Saygı duyuyorum", ar: "أَحْتَرِمُ" }
    ];
