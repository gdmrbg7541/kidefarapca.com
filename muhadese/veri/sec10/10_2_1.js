/* 10. sınıf SEÇMELİ ARAPÇA — 2. Ünite (قِيَمي) 1. Ders: أُحِبُّ ديني
   Kaynak: Ortaöğretim Seçmeli Arapça ders kitabı, basılı s.50-61.
   Dersin konusu: İslam'ın şartları, beş vakit namaz, sıra sayıları (الأَوَّل-العاشِر),
   imanın şartları, Ramazan ve günlük ibadet programı. */
window.data = {
    sentence: [
        /* Namaz Müslümanlar için önemlidir. (s.52) */
        {
            words: [
                { tr: "Namaz", order: 1, ar: "الصَّلاةُ" },
                { tr: "Müslümanlar için", order: 3, ar: "لِلْمُسْلِمين." },
                { tr: "önemlidir.", order: 2, ar: "مُهِمّةٌ" }
            ]
        },

        /* Oruç her Müslümana farzdır. (s.52) */
        {
            words: [
                { tr: "Oruç", order: 1, ar: "الصَّوْمُ" },
                { tr: "her Müslümana", order: 3, ar: "عَلى كُلِّ مُسْلِم." },
                { tr: "farzdır.", order: 2, ar: "فَرْضٌ" }
            ]
        },

        /* Hac, İslam'ın şartlarından bir şarttır. (s.52) */
        {
            words: [
                { tr: "Hac,", order: 1, ar: "الحَجُّ" },
                { tr: "İslam'ın şartlarından", order: 3, ar: "مِنْ أَرْكانِ الإِسْلام." },
                { tr: "bir şarttır.", order: 2, ar: "رُكْنٌ" }
            ]
        },

        /* Müslümanlar her yıl zekât verir. (s.52) */
        {
            words: [
                { tr: "Müslümanlar", order: 2, ar: "المُسْلِمونَ" },
                { tr: "her yıl", order: 4, ar: "كُلَّ سَنة." },
                { tr: "zekât", order: 3, ar: "الزَّكاةَ" },
                { tr: "verir.", order: 1, ar: "يُؤْتي" }
            ]
        },

        /* Sabah namazı güneşin doğuşundan öncedir. (s.52) */
        {
            words: [
                { tr: "Sabah namazı", order: 1, ar: "صَلاةُ الفَجْرِ" },
                { tr: "güneşin doğuşundan", order: 3, ar: "شُروقِ الشَّمْس." },
                { tr: "öncedir.", order: 2, ar: "قَبْلَ" }
            ]
        },

        /* Akşam namazı güneşin batışından sonradır. (s.52) */
        {
            words: [
                { tr: "Akşam namazı", order: 1, ar: "صَلاةُ المَغْرِبِ" },
                { tr: "güneşin batışından", order: 3, ar: "غُروبِ الشَّمْس." },
                { tr: "sonradır.", order: 2, ar: "بَعْدَ" }
            ]
        },

        /* İslam'daki ilk emir okumaktır. (s.52) */
        {
            words: [
                { tr: "İslam'daki", order: 2, ar: "في الإِسْلامِ" },
                { tr: "ilk emir", order: 1, ar: "الأَمْرُ الأَوَّلُ" },
                { tr: "okumaktır.", order: 3, ar: "هُوَ القِراءة." }
            ]
        },

        /* Öğle namazını mescitte kılıyorum. (s.52) */
        {
            words: [
                { tr: "Öğle namazını", order: 2, ar: "صَلاةَ الظُّهْرِ" },
                { tr: "mescitte", order: 3, ar: "في المَسْجِد." },
                { tr: "kılıyorum.", order: 1, ar: "أُصَلّي" }
            ]
        },

        /* Müslümanlar günde beş vakit namaz kılar. (s.61) */
        {
            words: [
                { tr: "Müslümanlar", order: 2, ar: "المُسْلِمونَ" },
                { tr: "günde", order: 4, ar: "يَوْمِيًّا." },
                { tr: "beş vakit namaz", order: 3, ar: "خَمْسَ صَلَواتٍ" },
                { tr: "kılar.", order: 1, ar: "يُصَلّي" }
            ]
        },

        /* Büşra ikinci katta ve dördüncü dairede oturuyor. (s.55) */
        {
            words: [
                { tr: "Büşra", order: 2, ar: "بُشْرى" },
                { tr: "ikinci katta", order: 3, ar: "في الطّابِقِ الثّاني" },
                { tr: "ve dördüncü dairede", order: 4, ar: "وَفي الشُّقّةِ الرّابِعة." },
                { tr: "oturuyor.", order: 1, ar: "تَسْكُنُ" }
            ]
        },

        /* Büşra dokuzuncu sınıfta okuyor. (s.55) */
        {
            words: [
                { tr: "Büşra", order: 2, ar: "بُشْرى" },
                { tr: "dokuzuncu sınıfta", order: 3, ar: "في الصَّفِّ التّاسِع." },
                { tr: "okuyor.", order: 1, ar: "تَدْرُسُ" }
            ]
        },

        /* Ramazan günlerinde sahura kalkıyorum. (s.58) */
        {
            words: [
                { tr: "Ramazan günlerinde", order: 3, ar: "في أَيّامِ رَمَضان." },
                { tr: "sahura", order: 2, ar: "لِلسَّحورِ" },
                { tr: "kalkıyorum.", order: 1, ar: "أَسْتَيْقِظُ" }
            ]
        },

        /* Teravih namazı için annemle mescide gidiyorum. (s.58) */
        {
            words: [
                { tr: "Teravih namazı için", order: 4, ar: "لِصَلاةِ التَّراويح." },
                { tr: "annemle", order: 3, ar: "مَعَ أُمّي" },
                { tr: "mescide", order: 2, ar: "إِلى المَسْجِدِ" },
                { tr: "gidiyorum.", order: 1, ar: "أَذْهَبُ" }
            ]
        }
    ],

    /* Kitaptaki iki diyalog: أَرْكان الإِسْلام ve الصَّلاة (s.50) */
    dialog: [
        {
            p1: [
                { tr: "İslam'ın şartlarını", order: 2, ar: "أَرْكانَ الإِسْلامِ" },
                { tr: "biliyor musun", order: 1, ar: "هَلْ تَعْرِفينَ" },
                { tr: "Merve?", order: 3, ar: "يا مَرْوة؟" }
            ],
            p2: [
                { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
                { tr: "onun", order: 2, ar: "وَلَهُ" },
                { tr: "beş şartı vardır", order: 3, ar: "خَمْسةُ أَرْكانٍ" },
                { tr: "anneciğim!", order: 4, ar: "يا أُمّي!" }
            ]
        },
        {
            p1: [
                { tr: "Peki", order: 1, ar: "وَما" },
                { tr: "onlar nelerdir?", order: 2, ar: "هِيَ؟" }
            ],
            p2: [
                { tr: "Kelime-i şehadet,", order: 1, ar: "الشَّهادَتانِ،" },
                { tr: "namaz,", order: 2, ar: "وَالصَّلاةُ،" },
                { tr: "hac,", order: 3, ar: "وَالحَجُّ،" },
                { tr: "zekât", order: 4, ar: "وَالزَّكاةُ،" },
                { tr: "ve oruç.", order: 5, ar: "وَالصَّوْمُ." }
            ]
        },
        {
            p1: [
                { tr: "Ne", order: 1, ar: "ماذا" },
                { tr: "yapıyorsun", order: 2, ar: "تَفْعَلُ" },
                { tr: "dedeciğim?", order: 3, ar: "يا جَدّي؟" }
            ],
            p2: [
                { tr: "Öğle namazını", order: 2, ar: "صَلاةَ الظُّهْر." },
                { tr: "kılıyorum.", order: 1, ar: "أُصَلّي" }
            ]
        },
        {
            p1: [
                { tr: "Günde", order: 3, ar: "في اليَوْم؟" },
                { tr: "kaç defa", order: 1, ar: "كَمْ مَرّةً" },
                { tr: "namaz kılıyorsun?", order: 2, ar: "تُصَلّي" }
            ],
            p2: [
                { tr: "Beş defa,", order: 1, ar: "خَمْسَ مَرّاتٍ،" },
                { tr: "ilki", order: 2, ar: "أَوَّلُها" },
                { tr: "sabah namazı,", order: 3, ar: "صَلاةُ الفَجْرِ،" },
                { tr: "sonuncusu da", order: 4, ar: "وَآخِرُها" },
                { tr: "yatsı namazıdır.", order: 5, ar: "صَلاةُ العِشاء." }
            ]
        }
    ]
};

/* Dersin kelimeleri (Kelime Listeleri bölümü bu diziyi okur) */
window.data.words = [
    { tr: "İslam'ın şartları", ar: "أَرْكان الإِسْلام" }, { tr: "İmanın şartları", ar: "أَرْكان الإيمان" },
    { tr: "Kelime-i şehadet", ar: "الشَّهادَتانِ" }, { tr: "Namaz", ar: "الصَّلاة" },
    { tr: "Zekât", ar: "الزَّكاة" }, { tr: "Oruç", ar: "الصَّوْم" },
    { tr: "Hac", ar: "الحَجّ" }, { tr: "Farz", ar: "فَرْض" },
    { tr: "Ödev, görev", ar: "واجِب" }, { tr: "Müslüman", ar: "مُسْلِم" },
    { tr: "Mescit", ar: "المَسْجِد" }, { tr: "Şart, rükün", ar: "رُكْن" },
    { tr: "Güneşin doğuşu", ar: "شُروق الشَّمْس" }, { tr: "Güneşin batışı", ar: "غُروب الشَّمْس" },
    { tr: "Sabah namazı", ar: "صَلاة الفَجْر" }, { tr: "Öğle namazı", ar: "صَلاة الظُّهْر" },
    { tr: "İkindi namazı", ar: "صَلاة العَصْر" }, { tr: "Akşam namazı", ar: "صَلاة المَغْرِب" },
    { tr: "Yatsı namazı", ar: "صَلاة العِشاء" }, { tr: "Teravih", ar: "التَّراويح" },
    { tr: "Sahur", ar: "سَحور" }, { tr: "İftar", ar: "الإِفْطار" },
    { tr: "Ramazan", ar: "رَمَضان" }, { tr: "Hicrî takvim", ar: "التَّقْويم الهِجْرِيّ" },
    { tr: "Kur'an-ı Kerim", ar: "القُرْآن الكَريم" }, { tr: "Melekler", ar: "المَلائِكة" },
    { tr: "Kitaplar", ar: "الكُتُب" }, { tr: "Peygamberler", ar: "الرُّسُل" },
    { tr: "Ahiret günü", ar: "اليَوْم الآخِر" }, { tr: "Kader", ar: "القَدَر" },
    { tr: "Yeniden diriliş", ar: "البَعْث" }, { tr: "Birinci", ar: "الأَوَّل" },
    { tr: "İkinci", ar: "الثّاني" }, { tr: "Üçüncü", ar: "الثّالِث" },
    { tr: "Dördüncü", ar: "الرّابِع" }, { tr: "Beşinci", ar: "الخامِس" },
    { tr: "Altıncı", ar: "السّادِس" }, { tr: "Yedinci", ar: "السّابِع" },
    { tr: "Sekizinci", ar: "الثّامِن" }, { tr: "Dokuzuncu", ar: "التّاسِع" },
    { tr: "Onuncu", ar: "العاشِر" }, { tr: "Kat", ar: "الطّابِق" },
    { tr: "Apartman dairesi", ar: "الشُّقّة" }, { tr: "Önce, birinci olarak", ar: "أَوَّلًا" },
    { tr: "İkinci olarak", ar: "ثانِيًا" }, { tr: "Sonunda", ar: "أَخيرًا" }
];
