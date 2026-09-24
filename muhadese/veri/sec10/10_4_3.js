/* 10. sınıf SEÇMELİ ARAPÇA — 4. Ünite (الأَماكِن المُهِمّة) 3. Ders:
   الأَماكِن المُهِمّة في تُرْكِيا
   Kaynak: Ortaöğretim Seçmeli Arapça ders kitabı, basılı s.156-169.
   Dersin konusu: Türkiye'deki önemli mekânlar, çoğul fiil çekimi
   (يَعْبُرونَ / يَعْبُرْنَ), saatin kesirleri (وَالنِّصْف، وَالرُّبْع، إِلّا رُبْعًا) ve günlük plan.
   Diyaloğun son iki sorusu, kitabın s.162'deki metin sorularından
   ikinci şahsa çevrilerek düzenlenmiştir. */
window.data = {
    sentence: [
        /* Yarın cuma namazını Bursa'daki Ulu Cami'de kılacağız. (s.158) */
        {
            words: [
                { tr: "Yarın", order: 1, ar: "غَدًا" },
                { tr: "Bursa'daki", order: 5, ar: "في بورصة." },
                { tr: "Ulu Cami'de", order: 4, ar: "في مَسْجِدِ أولو" },
                { tr: "cuma namazını", order: 3, ar: "الجُمُعةَ" },
                { tr: "kılacağız.", order: 2, ar: "سَنُصَلّي" }
            ]
        },

        /* Gelecek ay İstanbul'daki Ayasofya Camii'ni ziyaret edeceğim. (s.158) */
        {
            words: [
                { tr: "Gelecek ay", order: 1, ar: "في الشَّهْرِ القادِمِ" },
                { tr: "İstanbul'daki", order: 4, ar: "في إِسْطَنْبول." },
                { tr: "Ayasofya Camii'ni", order: 3, ar: "مَسْجِدَ آيا صوفيا" },
                { tr: "ziyaret edeceğim.", order: 2, ar: "سَأَزورُ" }
            ]
        },

        /* Ziyaretçiler Batman'daki Hasankeyf'i gezmek için köprüyü geçiyorlar. (s.158) */
        {
            words: [
                { tr: "Ziyaretçiler", order: 1, ar: "الزّائِرونَ" },
                { tr: "Batman'daki", order: 5, ar: "في بَطْمان." },
                { tr: "Hasankeyf'i gezmek için", order: 4, ar: "لِزِيارةِ حِصْنِ كيفى" },
                { tr: "köprüyü", order: 3, ar: "الجِسْرَ" },
                { tr: "geçiyorlar.", order: 2, ar: "يَعْبُرونَ" }
            ]
        },

        /* Kadın ziyaretçiler Diyarbakır'daki tarihî surları gezmek için otobüse biniyorlar. (s.158) */
        {
            words: [
                { tr: "Kadın ziyaretçiler", order: 1, ar: "الزّائِراتُ" },
                { tr: "Diyarbakır'daki", order: 5, ar: "في دِيار بَكْر." },
                { tr: "tarihî surları gezmek için", order: 4, ar: "لِزِيارةِ الأَسْوارِ التّاريخِيّةِ" },
                { tr: "otobüse", order: 3, ar: "الحافِلةَ" },
                { tr: "biniyorlar.", order: 2, ar: "يَرْكَبْنَ" }
            ]
        },

        /* Bugün Antalya'ya gitmek için uçağa bineceğiz. (s.158) */
        {
            words: [
                { tr: "Bugün", order: 1, ar: "اليَوْمَ" },
                { tr: "Antalya'ya gitmek için", order: 4, ar: "لِلذَّهابِ إِلى أَنْطاليا" },
                { tr: "uçağa", order: 3, ar: "الطّائِرةَ" },
                { tr: "bineceğiz.", order: 2, ar: "سَنَرْكَبُ" }
            ]
        },

        /* Erkekler vatanları için çalışıyorlar. (s.159) */
        {
            words: [
                { tr: "Erkekler", order: 1, ar: "الرِّجالُ" },
                { tr: "vatanları için", order: 3, ar: "مِنْ أَجْلِ وَطَنِهِم." },
                { tr: "çalışıyorlar.", order: 2, ar: "يَعْمَلونَ" }
            ]
        },

        /* Kadınlar vatanları için çalışıyorlar. (s.159) */
        {
            words: [
                { tr: "Kadınlar", order: 1, ar: "النِّساءُ" },
                { tr: "vatanları için", order: 3, ar: "مِنْ أَجْلِ وَطَنِهِنّ." },
                { tr: "çalışıyorlar.", order: 2, ar: "يَعْمَلْنَ" }
            ]
        },

        /* Ziyaretçiler yolu geçiyorlar ama köprüyü geçmiyorlar. (s.163) */
        {
            words: [
                { tr: "Ziyaretçiler", order: 1, ar: "الزّائِرونَ" },
                { tr: "yolu", order: 3, ar: "الطَّريقَ،" },
                { tr: "geçiyorlar", order: 2, ar: "يَعْبُرونَ" },
                { tr: "ama", order: 4, ar: "وَلكِنْ" },
                { tr: "köprüyü", order: 6, ar: "الجِسْر." },
                { tr: "geçmiyorlar.", order: 5, ar: "لا يَعْبُرونَ" }
            ]
        },

        /* Onlar (hanımlar) otobüse biniyorlar ama arabaya binmiyorlar. (s.163) */
        {
            words: [
                { tr: "Onlar (hanımlar)", order: 1, ar: "هُنَّ" },
                { tr: "otobüse", order: 3, ar: "الحافِلةَ" },
                { tr: "biniyorlar", order: 2, ar: "يَرْكَبْنَ" },
                { tr: "ama", order: 4, ar: "وَلكِنْ" },
                { tr: "arabaya", order: 6, ar: "السَّيّارة." },
                { tr: "binmiyorlar.", order: 5, ar: "لا يَرْكَبْنَ" }
            ]
        },

        /* Saat beş buçukta abdest alıyorum. (s.165) */
        {
            words: [
                { tr: "Saat beş buçukta", order: 2, ar: "في السّاعةِ الخامِسةِ وَالنِّصْف." },
                { tr: "abdest alıyorum.", order: 1, ar: "أَتَوَضَّأُ" }
            ]
        },

        /* Park kütüphaneye yakındır. (s.167) */
        {
            words: [
                { tr: "Park", order: 1, ar: "الحَديقةُ" },
                { tr: "kütüphaneye", order: 3, ar: "مِن المَكْتَبة." },
                { tr: "yakındır.", order: 2, ar: "قَريبةٌ" }
            ]
        },

        /* Sabah saat yedide okuluma gideceğim. (s.162) */
        {
            words: [
                { tr: "Sabah", order: 4, ar: "صَباحًا." },
                { tr: "saat yedide", order: 3, ar: "في السّاعةِ السّابِعةِ" },
                { tr: "okuluma", order: 2, ar: "إِلى مَدْرَسَتي" },
                { tr: "gideceğim.", order: 1, ar: "سَأَذْهَبُ" }
            ]
        },

        /* Gece saat onda uyuyacağım. (s.162) */
        {
            words: [
                { tr: "Gece", order: 3, ar: "لَيْلًا." },
                { tr: "saat onda", order: 2, ar: "في السّاعةِ العاشِرةِ" },
                { tr: "uyuyacağım.", order: 1, ar: "سَأَنامُ" }
            ]
        }
    ],

    /* Diyalog: زِيارة قَصْر طوب قابي (s.156) ve günlük plan soruları (s.162) */
    dialog: [
        {
            p1: [
                { tr: "Ben", order: 1, ar: "أَنا" },
                { tr: "Topkapı Sarayı'nı", order: 3, ar: "زِيارةَ قَصْرِ طوب قابي،" },
                { tr: "ziyaret etmek istiyorum,", order: 2, ar: "أُريدُ" },
                { tr: "saray nerede", order: 4, ar: "أَيْن القَصْرُ" },
                { tr: "arkadaşım?", order: 5, ar: "يا صَديقَتي؟" }
            ],
            p2: [
                { tr: "Saray", order: 1, ar: "القَصْرُ" },
                { tr: "büyük Ayasofya Camii'ne", order: 3, ar: "مِنْ مَسْجِدِ آيا صوفيا الكَبير." },
                { tr: "yakındır.", order: 2, ar: "قَريبٌ" }
            ]
        },
        {
            p1: [
                { tr: "Saray", order: 2, ar: "القَصْرُ" },
                { tr: "ne zaman", order: 1, ar: "مَتى" },
                { tr: "açık?", order: 3, ar: "مَفْتوح؟" }
            ],
            p2: [
                { tr: "Saray", order: 1, ar: "القَصْرُ" },
                { tr: "sabah saat dokuzdan", order: 3, ar: "مِن السّاعةِ التّاسِعةِ صَباحًا" },
                { tr: "akşam saat altıya kadar", order: 4, ar: "إِلى السّاعةِ السّادِسةِ مَساءً." },
                { tr: "açıktır.", order: 2, ar: "مَفْتوحٌ" }
            ]
        },
        {
            p1: [
                { tr: "Sabah namazını", order: 3, ar: "الفَجْر؟" },
                { tr: "ne zaman", order: 1, ar: "مَتى" },
                { tr: "kılacaksın?", order: 2, ar: "سَتُصَلّي" }
            ],
            p2: [
                { tr: "Saat beşte", order: 2, ar: "في السّاعةِ الخامِسةِ" },
                { tr: "kalkacağım", order: 1, ar: "سَأَنْهَضُ" },
                { tr: "ve sabah namazını kılacağım.", order: 3, ar: "وَسَأُصَلّي الفَجْر." }
            ]
        },
        {
            p1: [
                { tr: "Akşam", order: 3, ar: "في المَساء؟" },
                { tr: "ne", order: 1, ar: "ماذا" },
                { tr: "yapacaksın?", order: 2, ar: "سَتَفْعَلُ" }
            ],
            p2: [
                { tr: "Akşam saat altıda", order: 3, ar: "في السّاعةِ السّادِسةِ مَساءً." },
                { tr: "basketbol", order: 2, ar: "كُرةَ السَّلّة" },
                { tr: "oynayacağım.", order: 1, ar: "سَأَلْعَبُ" }
            ]
        },
        {
            p1: [
                { tr: "Güzel bir vakit", order: 2, ar: "وَقْتًا جَميلًا!" },
                { tr: "geçireceğiz!", order: 1, ar: "سَنَقْضي" }
            ],
            p2: [
                { tr: "Göreme Açık Hava Müzesi'ni de", order: 2, ar: "مُتْحَفَ غوريم المَفْتوح." },
                { tr: "ziyaret edeceğiz.", order: 1, ar: "سَنَزورُ" }
            ]
        }
    ]
};

/* Dersin kelimeleri (Kelime Listeleri bölümü bu diziyi okur) */
window.data.words = [
    { tr: "Topkapı Sarayı", ar: "قَصْر طوب قابي" }, { tr: "Ayasofya Camii", ar: "مَسْجِد آيا صوفيا" },
    { tr: "Sultan Ahmet Camii", ar: "مَسْجِد السُّلْطان أَحْمَد" }, { tr: "Ulu Cami", ar: "مَسْجِد أولو" },
    { tr: "Hasankeyf", ar: "حِصْن كيفى" }, { tr: "Diyarbakır surları", ar: "أَسْوار دِيار بَكْر" },
    { tr: "Aspendos Tiyatrosu", ar: "مَسْرَح أَسْبَنْدوس" }, { tr: "Balıklı Göl", ar: "بُحَيرة الأَسْماك" },
    { tr: "Göreme Açık Hava Müzesi", ar: "مُتْحَف غوريم المَفْتوح" },
    { tr: "Türkiye Büyük Millet Meclisi", ar: "المَجْلِس الوَطَنِيّ التُّرْكِيّ الكَبير" },
    { tr: "Saray", ar: "القَصْر" }, { tr: "Tiyatro", ar: "مَسْرَح" },
    { tr: "Duvar, sur", ar: "الأَسْوار" }, { tr: "Köprü", ar: "الجِسْر" },
    { tr: "Açık", ar: "مَفْتوح" }, { tr: "Vakit, zaman", ar: "وَقْت" },
    { tr: "Erkekler", ar: "الرِّجال" }, { tr: "Kadınlar", ar: "النِّساء" },
    { tr: "Yarın", ar: "غَدًا" }, { tr: "Bugün", ar: "اليَوْم" },
    { tr: "Gelecek ay", ar: "الشَّهْر القادِم" }, { tr: "Gece", ar: "لَيْلًا" },
    { tr: "Geçiyor", ar: "يَعْبُرُ" }, { tr: "Giriyor", ar: "يَدْخُلُ" },
    { tr: "Vakit geçiriyor", ar: "يَقْضي" }, { tr: "Biniyor", ar: "يَرْكَبُ" },
    { tr: "Saat bir", ar: "السّاعة الواحِدة" }, { tr: "Buçuk", ar: "وَالنِّصْف" },
    { tr: "Çeyrek geçe", ar: "وَالرُّبُع" }, { tr: "Yirmi geçe", ar: "وَالثُّلُث" },
    { tr: "Çeyrek kala", ar: "إِلّا رُبْعًا" }, { tr: "Yirmi kala", ar: "إِلّا ثُلْثًا" },
    { tr: "On birinci (saat on bir)", ar: "الحادِية عَشْرة" }, { tr: "On ikinci (saat on iki)", ar: "الثّانِية عَشْرة" }
];
