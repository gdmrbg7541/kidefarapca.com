/* ============================================================
   KALIP İFADELER — tek dosya, iki iş görür
   ------------------------------------------------------------
   1) LİSTE MODU  (muhadese.html)
      window.KIDEF_KALIP ile başlıkları ve grupları verir.
   2) OYNATICI MODU (muhadese.html?ders=kalip_selam)
      Dosyanın sonundaki küçük seçici, istenen başlığın verisini
      window.data'ya yerleştirir; simultane.js onu okur.

   YENİ BAŞLIK EKLEMEK
      konular dizisine bir satır yaz:
        { id:'ornek', grup:'islev', ad:'Türkçe Ad', ar:'العَرَبِيَّة',
          words:[], sentence:[], dialog:[] }

   İÇERİK DOLDURMAK
      words    : kelime kartları           -> { tr:'...', ar:'...' }
      sentence : cümle pratiği             -> { words:[ {tr, order, ar}, ... ] }
      dialog   : diyalog pratiği           -> { p1:[...], p2:[...] }
      "order" Arapça dizilişteki sırasıdır; Türkçe parçalar Türkçe sırayla yazılır.

   Üç dizi de boşsa başlık listede pasif ("yakında") görünür.
   ============================================================ */

window.KIDEF_KALIP = {

    ad: 'Kalıp İfadeler',

    /* Başlıklar bu gruplar altında toplanır */
    gruplar: [
        { id: 'islev', baslik: 'İşleve Göre' },
        { id: 'yapi',  baslik: 'Yapı Kalıpları' }
    ],

    konular: [

        /* ---------------------------------------------------------
           ÖRNEK BAŞLIK — doldurulmuş hâli buradaki gibi olacak.
           İçeriği dilediğin gibi değiştirebilir/genişletebilirsin.
           --------------------------------------------------------- */
        {
            id: 'selam', grup: 'islev',
            ad: 'Selamlaşma & Tanışma', ar: 'التَّحِيَّة والتَّعارُف',

            words: [
                { tr: 'Merhaba',                    ar: 'مَرْحَبًا' },
                { tr: 'Selamün aleyküm',            ar: 'السَّلامُ عَلَيْكُمْ' },
                { tr: 'Ve aleykümselam',            ar: 'وَعَلَيْكُمُ السَّلامُ' },
                { tr: 'Günaydın',                   ar: 'صَباحَ الخَيْرِ' },
                { tr: 'İyi akşamlar',               ar: 'مَساءَ الخَيْرِ' },
                { tr: 'Hoş geldin',                 ar: 'أَهْلًا وَسَهْلًا' },
                { tr: 'Nasılsın?',                  ar: 'كَيْفَ حالُكَ؟' },
                { tr: 'İyiyim',                     ar: 'أَنا بِخَيْرٍ' },
                { tr: 'Adın ne?',                   ar: 'مَا اسْمُكَ؟' },
                { tr: 'Tanıştığımıza memnun oldum', ar: 'تَشَرَّفْتُ بِمَعْرِفَتِكَ' },
                { tr: 'Görüşmek üzere',             ar: 'إِلى اللِّقاءِ' },
                { tr: 'Allah\'a emanet',            ar: 'مَعَ السَّلامَةِ' }
            ],

            sentence: [
                { words: [
                    { tr: 'Merhaba,', order: 1, ar: 'مَرْحَبًا،' },
                    { tr: 'adım',     order: 2, ar: 'اسْمي' },
                    { tr: 'Ahmet.',   order: 3, ar: 'أَحْمَدُ.' }
                ] },
                { words: [
                    { tr: 'Seninle tanıştığıma', order: 2, ar: 'بِمَعْرِفَتِكَ.' },
                    { tr: 'memnun oldum.',       order: 1, ar: 'تَشَرَّفْتُ' }
                ] },
                { words: [
                    { tr: 'Bugün',    order: 2, ar: 'اليَوْمَ؟' },
                    { tr: 'nasılsın?', order: 1, ar: 'كَيْفَ حالُكَ' }
                ] },
                { words: [
                    { tr: 'Allah\'a hamdolsun,', order: 1, ar: 'الحَمْدُ لِلّٰهِ،' },
                    { tr: 'ben',                 order: 2, ar: 'أَنا' },
                    { tr: 'iyiyim.',             order: 3, ar: 'بِخَيْرٍ.' }
                ] },
                { words: [
                    { tr: 'Sen',        order: 2, ar: 'أَنْتَ؟' },
                    { tr: 'nerelisin?', order: 1, ar: 'مِنْ أَيْنَ' }
                ] },
                { words: [
                    { tr: 'Ben',            order: 1, ar: 'أَنا' },
                    { tr: 'Türkiye\'denim.', order: 2, ar: 'مِنْ تُرْكِيا.' }
                ] },
                { words: [
                    { tr: 'Buyurun,',       order: 1, ar: 'تَفَضَّلْ،' },
                    { tr: 'hoş geldiniz.',  order: 2, ar: 'أَهْلًا وَسَهْلًا.' }
                ] },
                { words: [
                    { tr: 'Yarın',           order: 2, ar: 'غَدًا،' },
                    { tr: 'görüşmek üzere,', order: 1, ar: 'إِلى اللِّقاءِ' },
                    { tr: 'Allah\'a emanet.', order: 3, ar: 'مَعَ السَّلامَةِ.' }
                ] }
            ],

            dialog: [
                {
                    p1: [
                        { tr: 'Selamün aleyküm,', order: 1, ar: 'السَّلامُ عَلَيْكُمْ،' },
                        { tr: 'nasılsın?',        order: 2, ar: 'كَيْفَ حالُكَ؟' }
                    ],
                    p2: [
                        { tr: 'Ve aleykümselam,', order: 1, ar: 'وَعَلَيْكُمُ السَّلامُ،' },
                        { tr: 'ben iyiyim,',      order: 2, ar: 'أَنا بِخَيْرٍ،' },
                        { tr: 'hamdolsun.',       order: 3, ar: 'الحَمْدُ لِلّٰهِ.' }
                    ]
                },
                {
                    p1: [
                        { tr: 'Senin',    order: 2, ar: 'اسْمُكَ؟' },
                        { tr: 'adın ne?', order: 1, ar: 'ما' }
                    ],
                    p2: [
                        { tr: 'Benim adım', order: 1, ar: 'اسْمي' },
                        { tr: 'Halid.',     order: 2, ar: 'خالِدٌ.' }
                    ]
                },
                {
                    p1: [
                        { tr: 'Tanıştığımıza', order: 2, ar: 'بِمَعْرِفَتِكَ.' },
                        { tr: 'memnun oldum.', order: 1, ar: 'تَشَرَّفْتُ' }
                    ],
                    p2: [
                        { tr: 'Ben de',        order: 3, ar: 'أَيْضًا.' },
                        { tr: 'memnun',        order: 1, ar: 'تَشَرَّفْتُ' },
                        { tr: 'oldum.',        order: 2, ar: 'أَنا' }
                    ]
                }
            ]
        },

        /* --- İşleve göre kalıplar (içerik bekliyor) --- */
        { id: 'rica',      grup: 'islev', ad: 'Rica & İzin',      ar: 'الطَّلَب والاسْتِئْذان', words: [], sentence: [], dialog: [] },
        { id: 'tesekkur',  grup: 'islev', ad: 'Teşekkür & Özür',  ar: 'الشُّكْر والاعْتِذار',   words: [], sentence: [], dialog: [] },
        { id: 'kabul',     grup: 'islev', ad: 'Kabul & Ret',      ar: 'المُوافَقَة والرَّفْض',  words: [], sentence: [], dialog: [] },
        { id: 'soru',      grup: 'islev', ad: 'Soru Sorma',       ar: 'الاسْتِفْهام',           words: [], sentence: [], dialog: [] },
        { id: 'yon',       grup: 'islev', ad: 'Yön Tarifi',       ar: 'الاتِّجاهات',            words: [], sentence: [], dialog: [] },
        { id: 'zaman',     grup: 'islev', ad: 'Zaman İfadeleri',  ar: 'عِبارات الزَّمَن',       words: [], sentence: [], dialog: [] },
        { id: 'duygu',     grup: 'islev', ad: 'Duygu Anlatma',    ar: 'التَّعْبير عَنِ المَشاعِر', words: [], sentence: [], dialog: [] },
        { id: 'telefon',   grup: 'islev', ad: 'Telefonda',        ar: 'عَلى الهاتِف',           words: [], sentence: [], dialog: [] },
        { id: 'alisveris', grup: 'islev', ad: 'Alışverişte',      ar: 'في السُّوق',             words: [], sentence: [], dialog: [] },

        /* --- Yapı kalıpları: TEMEL DÖRTLÜ ---
           Örneklerin tamamı 5/7/9/10. sınıf ders verilerinden (muhadese/veri)
           birebir alındı; elle Arapça yazılmadı. --- */
        {
            id: 'izafet', grup: 'yapi',
            ad: "İsim Tamlaması (İzafet)", ar: "الإِضافَة",

            /* Cümlelerde tamlama yalın hâliyle geçiyor: muzâf ال almıyor,
               muzâfun ileyh mecrur kalıyor.
               Kaynak: muhadese/veri — her öge yanında ders dosyası yazılı. */

            words: [
                { tr: "Cuma günü", ar: "يَوْم الجُمُعَة" },
                { tr: "Salı günü", ar: "يَوْم الثُّلاثاء" },
                { tr: "Futbol (ayak topu)", ar: "كُرَة القَدَم" },
                { tr: "Yaya geçidi", ar: "مَمَرّ المُشاة" },
                { tr: "Oturma odası", ar: "غُرْفَةُ الجُلوسِ" },
                { tr: "Ev hanımı", ar: "رَبَّة البَيْت" },
                { tr: "Kız Kalesi", ar: "قَلْعَة الْفَتَاة" },
                { tr: "Mevlana Müzesi", ar: "مُتْحَف مَوْلَانَا" },
                { tr: "Türkiye başkenti", ar: "عاصِمَة تُرْكِيا" },
                { tr: "Kitap okuma", ar: "قِراءَة الكُتُب" },
                { tr: "Konya şehri", ar: "مَدِينَة قُونْيَا" },
                { tr: "Sinema izleme", ar: "مُشاهَدَة السّينَما" }
            ],

            sentence: [
                { words: [                      /* 10_1_1 #8 */
                    { tr: "Annem", order: 1, ar: "والِدَتي" },
                    { tr: "ev", order: 2, ar: "رَبَّة" },
                    { tr: "hanımıdır", order: 3, ar: "البَيْت،" },
                    { tr: "ve o", order: 4, ar: "وَهِيَ" },
                    { tr: "ailemizle", order: 6, ar: "بِعائِلَتِنا." },
                    { tr: "ilgilenir.", order: 5, ar: "تَهْتَمُّ" }
                ] },
                { words: [                      /* 10_1_2 #19 */
                    { tr: "Bayramlarda", order: 1, ar: "في الأَعْياد" },
                    { tr: "Müslümanlar", order: 2, ar: "المُسْلِمون" },
                    { tr: "yemekten önce", order: 4, ar: "قَبْل الطَّعام" },
                    { tr: "bayram namazı", order: 5, ar: "صَلاة العيد‫.‬" },
                    { tr: "kılarlar.", order: 3, ar: "يُصَلّونَ" }
                ] },
                { words: [                      /* 10_1_2 #20 */
                    { tr: "Sonra", order: 1, ar: "ثُمَّ" },
                    { tr: "aileyle birlikte", order: 4, ar: "مَع العائِلَة‫.‬" },
                    { tr: "bayram yemeği", order: 3, ar: "طَعام العيد" },
                    { tr: "yerler.", order: 2, ar: "يَتَناوَلونَ" }
                ] },
                { words: [                      /* 10_2_1 #30 */
                    { tr: "Her", order: 6, ar: "كُلّ" },
                    { tr: "gün", order: 7, ar: "يَوْم." },
                    { tr: "diş", order: 5, ar: "الأَسْنان" },
                    { tr: "fırçasıyla", order: 4, ar: "بِفُرْشاة " },
                    { tr: "dişlerimi", order: 3, ar: "أَسْناني" },
                    { tr: "temizlemem", order: 2, ar: "أَنْ أُنَظِّفَ" },
                    { tr: "gerekir.", order: 1, ar: "عَلَيّ" }
                ] },
                { words: [                      /* 10_2_2 #2 */
                    { tr: "Arkadaşlarım", order: 4, ar: "أَصْدِقائي‫.‬" },
                    { tr: "ile", order: 3, ar: "مَع" },
                    { tr: "basketbol", order: 2, ar: "كُرَة السَّلَّة" },
                    { tr: "oynuyorum.", order: 1, ar: "أَلْعَبُ" }
                ] },
                { words: [                      /* 10_2_2 #3 */
                    { tr: "Kitap", order: 3, ar: "الكُتُب‫.‬" },
                    { tr: "okumayı", order: 2, ar: "قِراءَة" },
                    { tr: "seviyorum.", order: 1, ar: "أُحِبُّ" }
                ] },
                { words: [                      /* 10_2_2 #12 */
                    { tr: "Baba", order: 1, ar: "الأَب" },
                    { tr: "sinema", order: 4, ar: "السّينَما‫.‬" },
                    { tr: "izlemeyi", order: 3, ar: "مُشاهَدَة" },
                    { tr: "istiyor.", order: 2, ar: "يُريدُ" }
                ] },
                { words: [                      /* 10_3_1 #17 */
                    { tr: "Urfa'daki", order: 4, ar: "فِي أُورْفَة." },
                    { tr: "Balıklı", order: 3, ar: "الْأَسْمَاك" },
                    { tr: "gölde", order: 2, ar: "فِي بُحَيْرَة" },
                    { tr: "gezindim.", order: 1, ar: "تَجَوَّلْتُ" }
                ] },
                { words: [                      /* 10_3_1 #18 */
                    { tr: "Mersin", order: 2, ar: "مَرْسِين" },
                    { tr: "kız", order: 4, ar: "الْفَتَاة." },
                    { tr: "kalesi ile", order: 3, ar: "بِقَلْعَة" },
                    { tr: "meşhurdur.", order: 1, ar: "تَشْتَهِرُ" }
                ] },
                { words: [                      /* 10_3_2 #35 */
                    { tr: "Öğrenci", order: 2, ar: "الطّالِب" },
                    { tr: "yaya", order: 4, ar: "المُشاة." },
                    { tr: "geçidinden", order: 3, ar: "مِن مَمَرّ" },
                    { tr: "geçiyor.", order: 1, ar: "يَعْبُرُ" }
                ] }
            ],

            dialog: [
                {                              /* 10_1_2 #9 */
                    p1: [
                        { tr: "Bayramın mübarek olsun!", order: 1, ar: "عيد مُبارَك!" },
                        { tr: "Bayram günü", order: 3, ar: "يَوْم العيد؟" },
                        { tr: "ne yaptın?", order: 2, ar: "ماذا فَعَلْتِ" }
                    ],
                    p2: [
                        { tr: "Bayramın mübarek olsun!", order: 1, ar: "عيد مُبارَك!" },
                        { tr: "Bayram namazını", order: 3, ar: "صَلاة العيد." },
                        { tr: "kıldım.", order: 2, ar: "صَلَّيْتُ" }
                    ]
                },
                {                              /* 10_1_2 #10 */
                    p1: [
                        { tr: "Sonra", order: 1, ar: "ثُمَّ" },
                        { tr: "ne yaptın?", order: 2, ar: "ماذا فَعَلْتِ؟" }
                    ],
                    p2: [
                        { tr: "Ailemle", order: 3, ar: "مَعَ أُسْرَتِي." },
                        { tr: "bayram yemeği", order: 2, ar: "طَعام العيد" },
                        { tr: "yedim.", order: 1, ar: "تَناوَلْتُ" }
                    ]
                },
                {                              /* 10_2_2 #3 */
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
                {                              /* 10_3_1 #9 */
                    p1: [
                        { tr: "Hangi", order: 1, ar: "أَيَّ" },
                        { tr: "tarihi", order: 3, ar: "تَارِيخِيٍّ" },
                        { tr: "mekanı", order: 2, ar: "مَكَانٍ" },
                        { tr: "ziyaret ettiniz?", order: 4, ar: "زُرْتُنَّ؟" }
                    ],
                    p2: [
                        { tr: "Balıklı", order: 3, ar: "الْأَسْمَاكِ." },
                        { tr: "gölü", order: 2, ar: "بُحَيْرَةَ" },
                        { tr: "ziyaret ettik.", order: 1, ar: "زُرْنَا" }
                    ]
                },
                {                              /* 10_3_2 #6 */
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
                        { tr: "mı?", order: 2, ar: "هَلْ" }
                    ]
                }
            ]
        },

        {
            id: 'sifattam', grup: 'yapi',
            ad: "Sıfat Tamlaması", ar: "النَّعْت",

            /* Sıfat, mevsûfuna dört yönden uyar: marifelik, hareke,
               cinsiyet, sayı. Örneklerde dördü de görünüyor.
               Kaynak: muhadese/veri — her öge yanında ders dosyası yazılı. */

            words: [
                { tr: "Kırmızı ışık", ar: "الضَّوْء الأَحْمَر" },
                { tr: "Yeşil ışık", ar: "الضَّوْء الأَخْضَر" },
                { tr: "Hızlı tren", ar: "القِطار السَّريع" },
                { tr: "Geniş cadde", ar: "الشّارِع الواسِع" },
                { tr: "Yeni eczane", ar: "الصَّيْدَلِيَّة الجَديدَة" },
                { tr: "Eski çarşı", ar: "السّوق القَديم" },
                { tr: "Sağlıklı gıda", ar: "الغِذاء الصِّحِّيّ" },
                { tr: "Gelecek hafta", ar: "الأُسْبوع القادِم" },
                { tr: "Yedinci saat", ar: "السّاعَة السّابِعَة" },
                { tr: "Büyük kardeşim", ar: "أَخي الكَبيرُ" }
            ],

            sentence: [
                { words: [                      /* 10_2_1 #27 */
                    { tr: "Sağlıklı", order: 4, ar: "الصِّحِّيّ،" },
                    { tr: "gıda", order: 3, ar: "الغِذاء" },
                    { tr: "almam", order: 2, ar: "أَنْ أَتَناوَلَ" },
                    { tr: "gerekir...", order: 1, ar: "يَجِبُ عَلَيَّ" }
                ] },
                { words: [                      /* 10_3_1 #16 */
                    { tr: "Yakutiye", order: 2, ar: "الْيَاكُوتِيَّة" },
                    { tr: "Medresesi", order: 1, ar: "الْمَدْرَسَة" },
                    { tr: "Erzurum'dadır.", order: 3, ar: "فِي أَرْضُرُوم." }
                ] },
                { words: [                      /* 10_3_2 #3 */
                    { tr: "Gelecek", order: 3, ar: "القادِم" },
                    { tr: "hafta", order: 2, ar: "الأُسْبوع" },
                    { tr: "otobüsle", order: 4, ar: "بِالحافِلَة." },
                    { tr: "döneceğim.", order: 1, ar: "سَأَرْجِعُ" }
                ] },
                { words: [                      /* 10_3_2 #12 */
                    { tr: "Hatice", order: 2, ar: "خَديجَة" },
                    { tr: "hızlı", order: 4, ar: "السَّريع" },
                    { tr: "trene", order: 3, ar: "القِطار" },
                    { tr: "saat", order: 5, ar: "في السّاعَة" },
                    { tr: "onu", order: 6, ar: "العاشِرَة" },
                    { tr: "yirmi geçe", order: 7, ar: "وَالثُّلُث." },
                    { tr: "bindi.", order: 1, ar: "ركِبَتْ" }
                ] },
                { words: [                      /* 10_3_2 #32 */
                    { tr: "Araba", order: 2, ar: "السَّيّارَة" },
                    { tr: "kırmızı", order: 4, ar: "الأَحْمَر." },
                    { tr: "ışıkta", order: 3, ar: "عِنْد الضَّوْء" },
                    { tr: "duruyor.", order: 1, ar: "تَقِفُ" }
                ] },
                { words: [                      /* 10_3_2 #33 */
                    { tr: "Sürücü", order: 2, ar: "السّائِق" },
                    { tr: "sarı", order: 5, ar: "الأَصْفَر." },
                    { tr: "ışıkta", order: 4, ar: "عِنْد الضَّوْء" },
                    { tr: "gitmek için", order: 3, ar: "لِلسَّيْر" },
                    { tr: "hazırlanıyor.", order: 1, ar: "يَسْتَعِدُّ" }
                ] },
                { words: [                      /* 10_3_2 #34 */
                    { tr: "Yayalar", order: 2, ar: "المُشاة" },
                    { tr: "yeşil", order: 4, ar: "الأَخْضَر." },
                    { tr: "ışıkta", order: 3, ar: "عِنْد الضَّوْء" },
                    { tr: "geçiyor.", order: 1, ar: "يَعْبُرُ" }
                ] },
                { words: [                      /* 10_3_2 #43 */
                    { tr: "Yeni", order: 5, ar: "الجَديدَة." },
                    { tr: "eczanenin", order: 4, ar: "الصَّيْدَلِيَّة" },
                    { tr: "önünde", order: 3, ar: "أَمام" },
                    { tr: "otobüsten", order: 2, ar: "مِن الحافِلَة" },
                    { tr: "iniyorum.", order: 1, ar: "أَنْزِلُ" }
                ] },
                { words: [                      /* 10_3_2 #44 */
                    { tr: "Geniş", order: 3, ar: "الواسِع" },
                    { tr: "caddede", order: 2, ar: "في الشّارِع" },
                    { tr: "biraz", order: 4, ar: "قَليلًا." },
                    { tr: "yürüyorum.", order: 1, ar: "أَمْشي" }
                ] },
                { words: [                      /* 10_4_2 #15 */
                    { tr: "Süpermarkette", order: 3, ar: "فِي السّوقِ المَرْكَزِيِّ." },
                    { tr: "indirim", order: 2, ar: "تَنْزيلاتٌ" },
                    { tr: "var.", order: 1, ar: "هُناكَ" }
                ] }
            ],

            dialog: [
                {                              /* 10_3_2 #1 */
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
                {                              /* 7_3 #8 */
                    p1: [
                        { tr: "Nasıl", order: 1, ar: "كَيْف" },
                        { tr: "giderim", order: 2, ar: "أَذْهَبُ" },
                        { tr: "yeni", order: 4, ar: "الجَديد؟" },
                        { tr: "hastaneye?", order: 3, ar: "إِلى المُسْتَشْفى" }
                    ],
                    p2: [
                        { tr: "Yönel", order: 1, ar: "اِتَّجِهي" },
                        { tr: "sağa,", order: 2, ar: "إِلى اليَمين،" },
                        { tr: "yürü", order: 3, ar: "اِمْشي" },
                        { tr: "biraz,", order: 4, ar: "قَليلًا،" },
                        { tr: "sonra", order: 5, ar: "ثُمَّ" },
                        { tr: "bin", order: 6, ar: "ارْكَبي" },
                        { tr: "otobüse", order: 7, ar: "الحافِلَة" },
                        { tr: "duraktan.", order: 8, ar: "مِن المَوْقِف." }
                    ]
                },
                {                              /* 10_3_2 #15 */
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
                {                              /* 7_1 #4 */
                    p1: [
                        { tr: "Ey", order: 4, ar: "يا" },
                        { tr: "Fatih,", order: 5, ar: "فاتِح؟" },
                        { tr: "ne zaman", order: 1, ar: "مَتى" },
                        { tr: "kahvaltı", order: 3, ar: "الفَطور" },
                        { tr: "yaparsın?", order: 2, ar: "تَتَناوَلُ" }
                    ],
                    p2: [
                        { tr: "Sabah", order: 5, ar: "صَباحًا." },
                        { tr: "saat", order: 3, ar: "في السّاعَة" },
                        { tr: "yedide", order: 4, ar: "السّابِعَة" },
                        { tr: "kahvaltı", order: 2, ar: "الفَطور" },
                        { tr: "yaparım.", order: 1, ar: "أَتَناوَلُ" }
                    ]
                }
            ]
        },

        {
            id: 'isimcum', grup: 'yapi',
            ad: "İsim Cümlesi", ar: "الجُمْلَة الاسْمِيَّة",

            /* Mübteda ile haber: ikisi de merfu. Kartların ilk bölüğü
               mübteda olabilecek isimler, ikinci bölüğü haber sıfatları.
               Kaynak: muhadese/veri — her öge yanında ders dosyası yazılı. */

            words: [
                { tr: "Hava durumu", ar: "طَقْس" },                          /* 10_4_1 */
                { tr: "Hava", ar: "جَوّ" },                                  /* 10_4_1 */
                { tr: "Okul", ar: "مَدْرَسَةٌ" },                            /* 10_1_1 */
                { tr: "Cadde / Sokak", ar: "شَارِع" },                       /* 10_3_2 */
                { tr: "Otel", ar: "فُنْدُق" },                               /* 10_3_2 */
                { tr: "Spor", ar: "رِياضَة" },                               /* 10_2_2 */
                { tr: "ev", ar: "بَيْت" },                                   /* 5_1_1 */
                { tr: "Ben hastayım", ar: "أَنا مَريض" },                    /* 10_2_1 */
                { tr: "Yakın", ar: "قَرِيب" },                               /* 10_3_2 */
                { tr: "Uzak", ar: "بَعِيد" },                                /* 10_3_2 */
                { tr: "Kalabalık", ar: "مُزْدَحِم" },                        /* 10_3_2 */
                { tr: "Sıcak", ar: "حارّ" },                                 /* 10_4_1 */
                { tr: "güzel", ar: "جَميل" },                                /* 5_4_1 */
                { tr: "Faydalı", ar: "مُفيدَة" },                            /* 10_2_2 */
                { tr: "Endişeli", ar: "قَلِقَة" },                           /* 10_1_2 */
                { tr: "Şaşkın", ar: "مُتَعَجِّب" },                          /* 10_1_2 */
                { tr: "Emekli", ar: "مُتَقَاعِدٌ" },                         /* 10_1_1 */
                { tr: "temiz (erkek)", ar: "نَظيف" },                        /* 5_4_3 */
            ],

            sentence: [
                { words: [
                    { tr: "Sen", order: 1, ar: "أَنْتَ" },
                    { tr: "emeklisin.", order: 2, ar: "مُتَقاعِد." }
                ] },
                { words: [
                    { tr: "O", order: 1, ar: "هُو" },
                    { tr: "şaşkındır.", order: 2, ar: "مُتَعَجِّب." }
                ] },
                { words: [
                    { tr: "O", order: 1, ar: "هِي" },
                    { tr: "endişelidir.", order: 2, ar: "قَلِقَة." }
                ] },
                { words: [
                    { tr: "Spor", order: 1, ar: "الرِّياضَة" },
                    { tr: "sağlık için", order: 3, ar: "لِلصِّحَّة." },
                    { tr: "faydalıdır.", order: 2, ar: "مُفيدَة" }
                ] },
                { words: [
                    { tr: "Otel", order: 1, ar: "الفُنْدُق" },
                    { tr: "buraya", order: 3, ar: "مِنْ هُنا." },
                    { tr: "yakındır.", order: 2, ar: "قَريب" }
                ] },
                { words: [
                    { tr: "Okulum", order: 1, ar: "مَدْرَسَتي" },
                    { tr: "evimden", order: 3, ar: "عَن بَيْتي." },
                    { tr: "uzaktır.", order: 2, ar: "بَعيدَة" }
                ] },
                { words: [
                    { tr: "Yazın", order: 3, ar: "فِي الصَّيْفِ." },
                    { tr: "hava", order: 1, ar: "الطَّقْسُ" },
                    { tr: "sıcaktır.", order: 2, ar: "حارٌّ" }
                ] },
                { words: [
                    { tr: "İlkbaharda", order: 3, ar: "فِي الرَّبيعِ." },
                    { tr: "hava", order: 1, ar: "الجَوُّ" },
                    { tr: "güzeldir.", order: 2, ar: "جَميلٌ" }
                ] },
                { words: [
                    { tr: "Cadde", order: 1, ar: "الشّارِع" },
                    { tr: "ulaşım araçlarıyla", order: 3, ar: "بِالمُواصَلات." },
                    { tr: "kalabalıktır.", order: 2, ar: "مُزْدَحِم" }
                ] },
                { words: [
                    { tr: "Okulum", order: 1, ar: "مَدْرَسَتي" },
                    { tr: "caminin", order: 3, ar: "المَسْجِد." },
                    { tr: "arkasındadır.", order: 2, ar: "خَلْف" }
                ] }
            ],

            dialog: [
                {                              /* 9_2_1 #1 */
                    p1: [
                        { tr: "Öğretmen", order: 2, ar: "الْمُدَرِّس؟" },
                        { tr: "nerede?", order: 1, ar: "أَيْن" }
                    ],
                    p2: [
                        { tr: "Öğretmen", order: 1, ar: "المُدَرِّس" },
                        { tr: "sınıfta.", order: 2, ar: "في الفَصْل." }
                    ]
                },
                {                              /* 9_2_1 #3 */
                    p1: [
                        { tr: "Kitap", order: 2, ar: "الكِتاب؟" },
                        { tr: "nerede?", order: 1, ar: "أَيْن" }
                    ],
                    p2: [
                        { tr: "Kitap", order: 1, ar: "الكِتاب" },
                        { tr: "sıranın üstünde.", order: 2, ar: "عَلى المَكْتَب." }
                    ]
                },
                {                              /* 9_2_1 #4 */
                    p1: [
                        { tr: "Kalem", order: 2, ar: "القَلَم؟" },
                        { tr: "nerede?", order: 1, ar: "أَيْن" }
                    ],
                    p2: [
                        { tr: "Kalem", order: 1, ar: "القَلَم" },
                        { tr: "kitabın altında.", order: 2, ar: "تَحْت الْكِتاب." }
                    ]
                },
                {                              /* 5_4_1 #1 */
                    p1: [
                        { tr: "Mutfak nerede?", order: 1, ar: "أَيْنَ المَطْبَخُ؟" }
                    ],
                    p2: [
                        { tr: "Mutfak", order: 1, ar: "اَلْمَطْبَخُ" },
                        { tr: "salonun yanındadır.", order: 2, ar: "بِجانِبِ الصّالَةِ." }
                    ]
                },
                {                              /* 5_4_3 #4 */
                    p1: [
                        { tr: "Ev", order: 1, ar: "كَيْفَ" },
                        { tr: "nasıl?", order: 2, ar: "البَيْتُ؟" }
                    ],
                    p2: [
                        { tr: "Ev", order: 1, ar: "اَلْبَيْتُ" },
                        { tr: "güzel ve temizdir.", order: 2, ar: "جَميلٌ وَنَظيفٌ." }
                    ]
                },
                {                              /* 10_3_2 #7 */
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
                }
            ]
        },

        {
            id: 'fiilcum', grup: 'yapi',
            ad: "Fiil Cümlesi", ar: "الجُمْلَة الفِعْلِيَّة",

            /* Fiil başta, fâil ardından. Kartlar fiilin kendisidir: cümle
               kurarken önce bunlardan biri gelir.
               Kaynak: muhadese/veri — her öge yanında ders dosyası yazılı. */

            words: [
                { tr: "Oynuyorum", ar: "أَلْعَبُ" },                         /* 10_2_2 */
                { tr: "Yiyorum", ar: "آكُلُ" },                              /* 7_1 */
                { tr: "İçiyorum", ar: "أَشْرَبُ" },                          /* 7_1 */
                { tr: "Dönüyorum", ar: "أَرْجِعُ" },                         /* 10_3_1 */
                { tr: "Ders çalışıyorum", ar: "أَدْرُسُ" },                  /* 7_1 */
                { tr: "Uyuyorum", ar: "أَنامُ" },                            /* 7_1 */
                { tr: "Uyanıyorum", ar: "أَسْتَيْقِظُ" },                    /* 7_1 */
                { tr: "Temizliyorum", ar: "أُنَظِّفُ" },                     /* 10_2_1 */
                { tr: "Dinliyorum", ar: "أَسْتَمِعُ" },                      /* 10_2_2 */
                { tr: "Okuyorum", ar: "أَقْرَأُ" },                          /* 10_2_2 */
                { tr: "İzliyorum", ar: "أُشاهِدُ" },                         /* 10_2_2 */
                { tr: "Yardım ediyorum", ar: "أُساعِدُ" },                   /* 7_1 */
                { tr: "Oynuyor", ar: "يَلْعَبُ" },                           /* 9_4_1 */
                { tr: "Yazıyor", ar: "يَكْتُبُ" },                           /* 9_3_1 */
                { tr: "Ders anlatıyor / öğretiyor", ar: "يُدَرِّسُ" },       /* 9_2_2 */
            ],

            sentence: [
                { words: [
                    { tr: "Ahmet", order: 2, ar: "أَحْمَد" },
                    { tr: "futbol", order: 3, ar: "كُرَة القَدَم." },
                    { tr: "oynuyor.", order: 1, ar: "يَلْعَبُ" }
                ] },
                { words: [
                    { tr: "Merve", order: 2, ar: "مَرْوَة" },
                    { tr: "İstanbulda", order: 3, ar: "في إِسْطَنْبُول." },
                    { tr: "gezindi.", order: 1, ar: "تَجَوَّلَتْ" }
                ] },
                { words: [
                    { tr: "Yunus", order: 2, ar: "يُونُس" },
                    { tr: "Konya'da", order: 3, ar: "فِي قُونْيَا." },
                    { tr: "yaşıyor.", order: 1, ar: "يَعِيشُ" }
                ] },
                { words: [
                    { tr: "Boğazımda", order: 3, ar: "في حَلْقي." },
                    { tr: "ağrı", order: 2, ar: "بِأَلَم" },
                    { tr: "hissediyorum.", order: 1, ar: "أَشْعُرُ" }
                ] },
                { words: [
                    { tr: "Sebze", order: 2, ar: "الخَضْرَوات" },
                    { tr: "ve meyve", order: 3, ar: "وَالفَواكِه." },
                    { tr: "yiyorum.", order: 1, ar: "آكُلُ" }
                ] },
                { words: [
                    { tr: "Futbol", order: 2, ar: "كُرَة القَدَم." },
                    { tr: "oynuyorum.", order: 1, ar: "أَلْعَبُ" }
                ] },
                { words: [
                    { tr: "Odamı", order: 2, ar: "غُرْفَتي." },
                    { tr: "temizlerim.", order: 1, ar: "أُنَظِّفُ" }
                ] },
                { words: [
                    { tr: "Doktora", order: 2, ar: "إِلى الطَّبيب." },
                    { tr: "giderim.", order: 1, ar: "أَذْهَبُ" }
                ] },
                { words: [
                    { tr: "Müzik", order: 2, ar: "إِلى الموسيقى." },
                    { tr: "dinliyorum.", order: 1, ar: "أَسْتَمِعُ" }
                ] },
                { words: [
                    { tr: "Konya", order: 3, ar: "قُونْيَا." },
                    { tr: "şehrinde", order: 2, ar: "فِي مَدِينَة" },
                    { tr: "yaşıyorum.", order: 1, ar: "أَعِيشُ" }
                ] }
            ],

            dialog: [
                {                              /* 9_4_1 #1 */
                    p1: [
                        { tr: "Ne zaman", order: 1, ar: "مَتى" },
                        { tr: "uyanıyorsun?", order: 2, ar: "تَسْتَيْقِظُ؟" }
                    ],
                    p2: [
                        { tr: "Sabahleyin", order: 3, ar: "صَباحًا." },
                        { tr: "saat altıda", order: 2, ar: "في السّاعَة السَّادِسَة" },
                        { tr: "uyanırım.", order: 1, ar: "أَسْتَيْقِظُ" }
                    ]
                },
                {                              /* 9_4_1 #2 */
                    p1: [
                        { tr: "Okula", order: 3, ar: "إِلى المَدْرَسَة؟" },
                        { tr: "ne zaman", order: 1, ar: "مَتى" },
                        { tr: "gidiyorsun?", order: 2, ar: "تَذْهَبُ" }
                    ],
                    p2: [
                        { tr: "Saat yedide", order: 3, ar: "في السّاعَة السّابِعَة." },
                        { tr: "okula", order: 2, ar: "إِلى المَدْرَسَة" },
                        { tr: "giderim.", order: 1, ar: "أَذْهَبُ" }
                    ]
                },
                {                              /* 9_4_1 #5 */
                    p1: [
                        { tr: "Akşam", order: 3, ar: "في المَساء؟" },
                        { tr: "ne", order: 1, ar: "ماذا" },
                        { tr: "yapıyorsun?", order: 2, ar: "تَفْعَلُ" }
                    ],
                    p2: [
                        { tr: "Akşam", order: 3, ar: "في المَساء." },
                        { tr: "arkadaşlarımla", order: 2, ar: "مَع أَصْدِقائي" },
                        { tr: "oynarım.", order: 1, ar: "أَلْعَبُ" }
                    ]
                },
                {                              /* 7_1 #5 */
                    p1: [
                        { tr: "Kahvaltıda", order: 3, ar: "في الفَطور؟" },
                        { tr: "ne", order: 1, ar: "ماذا" },
                        { tr: "yersin?", order: 2, ar: "تَأْكُلُ" }
                    ],
                    p2: [
                        { tr: "Bal", order: 2, ar: "العَسَل" },
                        { tr: "ve tereyağı", order: 3, ar: "وَالزُّبْدَة." },
                        { tr: "yerim.", order: 1, ar: "آكُلُ" }
                    ]
                },
                {                              /* 7_3 #5 */
                    p1: [
                        { tr: "Nereden", order: 1, ar: "مِن أَيْن" },
                        { tr: "dönüyorsun?", order: 2, ar: "تَرْجِعُ؟" }
                    ],
                    p2: [
                        { tr: "Dönüyorum", order: 1, ar: "أَرْجِعُ" },
                        { tr: "kütüphaneden.", order: 2, ar: "مِن المَكْتَبَة." }
                    ]
                },
                {                              /* 10_2_2 #7 */
                    p1: [
                        { tr: "Futbol", order: 3, ar: "كُرَة القَدَم؟" },
                        { tr: "oynayabilir(sin)", order: 2, ar: "تَسْتَطيعينَ أَنْ تَلْعَبي" },
                        { tr: "misin?", order: 1, ar: "هَلْ" }
                    ],
                    p2: [
                        { tr: "Hayır,", order: 1, ar: "لا،" },
                        { tr: "yapamam.", order: 2, ar: "لا أَسْتَطيعُ." }
                    ]
                }
            ]
        },

        /* --- Yapı kalıpları (içerik bekliyor) --- */
        { id: 'sart',      grup: 'yapi', ad: 'Şart Cümleleri', ar: 'أُسْلوب الشَّرْط',     words: [], sentence: [], dialog: [] },
        { id: 'istisna',   grup: 'yapi', ad: 'İstisna',        ar: 'أُسْلوب الاسْتِثْناء', words: [], sentence: [], dialog: [] },
        { id: 'taaccub',   grup: 'yapi', ad: 'Taaccüb',        ar: 'أُسْلوب التَّعَجُّب',  words: [], sentence: [], dialog: [] },
        { id: 'kasem',     grup: 'yapi', ad: 'Kasem',          ar: 'أُسْلوب القَسَم',      words: [], sentence: [], dialog: [] },
        { id: 'nida',      grup: 'yapi', ad: 'Nidâ',           ar: 'أُسْلوب النِّداء',     words: [], sentence: [], dialog: [] },
        { id: 'emirnehiy', grup: 'yapi', ad: 'Emir & Nehiy',   ar: 'الأَمْر والنَّهْي',    words: [], sentence: [], dialog: [] }
    ]
};

/* ------------------------------------------------------------
   OYNATICI SEÇİCİSİ
   Adres  muhadese.html?ders=kalip_selam  ise, "selam" başlığının
   verisi window.data'ya yazılır. Liste modunda hiçbir şey yapmaz.
   ------------------------------------------------------------ */
(function () {
    var d = String(window.KIDEF_DERS || '');
    var e = /^kalip_(.+)$/.exec(d);
    if (!e) return;
    var id = e[1], k = null, L = window.KIDEF_KALIP.konular;
    for (var i = 0; i < L.length; i++) if (L[i].id === id) { k = L[i]; break; }
    if (!k) return;
    window.data = {
        words:    k.words    || [],
        sentence: k.sentence || [],
        dialog:   k.dialog   || []
    };
    try { document.title = k.ad + ' — Kalıp İfadeler'; } catch (_) {}
})();
