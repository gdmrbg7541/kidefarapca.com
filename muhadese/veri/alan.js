/* ============================================================
   ALAN KONULARI — tek dosya, iki iş görür
   ------------------------------------------------------------
   1) LİSTE MODU  (muhadese.html)
      window.KIDEF_ALAN ile başlıkları verir.
   2) OYNATICI MODU (muhadese.html?ders=alan_saglik)
      Dosyanın sonundaki küçük seçici, istenen başlığın verisini
      window.data'ya yerleştirir; simultane.js onu okur.

   YENİ BAŞLIK EKLEMEK
      konular dizisine bir satır yaz:
        { id:'ornek', ad:'Türkçe Ad', ar:'العَرَبِيَّة',
          words:[], sentence:[], dialog:[] }

   İÇERİK DOLDURMAK
      words    : kelime kartları  -> { tr:'...', ar:'...' }
      sentence : cümle pratiği    -> { words:[ {tr, order, ar}, ... ] }
      dialog   : diyalog pratiği  -> { p1:[...], p2:[...] }
      "order" Arapça dizilişteki sırasıdır; Türkçe parçalar Türkçe sırayla yazılır.

   Üç dizi de boşsa başlık listede pasif ("yakında") görünür.
   ============================================================ */

window.KIDEF_ALAN = {

    ad: 'Alan Konuları',

    /* Tek grup: başlıklar düz bir sırada gösterilir */
    gruplar: [ { id: 'genel', baslik: '' } ],

    konular: [

        /* ---------------------------------------------------------
           ÖRNEK BAŞLIK — doldurulmuş hâli buradaki gibi olacak.
           --------------------------------------------------------- */
        {
            id: 'saglik', grup: 'genel',
            ad: 'Sağlık', ar: 'الصِّحَّة',

            words: [
                { tr: 'Sağlık',      ar: 'الصِّحَّة' },
                { tr: 'Hastalık',    ar: 'المَرَض',
                  lh: { mis: 'المَرَض', sam: 'المَرَض', hic: 'المَرَض', kor: 'المَرَض', irk: 'المَرَض', mag: 'المْرَض' } },
                { tr: 'Hasta',       ar: 'المَريض',
                  lh: { mis: 'العَيّان', sam: 'المَريض', hic: 'المَريض', kor: 'المَريض', irk: 'المَريض', mag: 'المْريض' } },
                { tr: 'Doktor',      ar: 'الطَّبيب',
                  lh: { mis: 'الدُّكْتور', sam: 'الحَكيم', hic: 'الدُّكْتور', kor: 'الدُّكْتور', irk: 'الدُّكْتور', mag: 'الطْبيب' } },
                { tr: 'Hastane',     ar: 'المُسْتَشْفى',
                  lh: { mis: 'المُسْتَشْفى', sam: 'المُسْتَشْفى', hic: 'المُسْتَشْفى', kor: 'المُسْتَشْفى', irk: 'المُسْتَشْفى', mag: 'السْبيطار' } },
                { tr: 'Eczane',      ar: 'الصَّيْدَلِيَّة',
                  lh: { mis: 'الأَجْزَخانَة', sam: 'الصَّيْدَلِيِّة', hic: 'الصَّيْدَلِيَّة', kor: 'الصَّيْدَلِيَّة', irk: 'الصَّيْدَلِيَّة', mag: 'الفَرْماسْيان' } },
                { tr: 'İlaç',        ar: 'الدَّواء',
                  lh: { mis: 'الدَّوا', sam: 'الدَّوا', hic: 'الدَّوا', kor: 'الدَّوا', irk: 'الدَّوا', mag: 'الدْوا' } },
                { tr: 'Ateş',        ar: 'الحَرارَة',
                  lh: { mis: 'السُّخونِيَّة', sam: 'الحَرارَة', hic: 'الحَرارَة', kor: 'الحَرارَة', irk: 'الحَرارَة', mag: 'السْخانَة' } },
                { tr: 'Baş ağrısı',  ar: 'صُداع',
                  lh: { mis: 'صُداع', sam: 'وَجَع راس', hic: 'صُداع', kor: 'صُداع', irk: 'وَجَع راس', mag: 'حْريق الراس' } },
                { tr: 'Muayene',     ar: 'الفَحْص',
                  lh: { mis: 'الكَشْف', sam: 'الفَحِص', hic: 'الفَحْص', kor: 'الفَحْص', irk: 'الفَحِص', mag: 'الفَحْص' } },
                { tr: 'Tedavi',      ar: 'العِلاج',
                  lh: { mis: 'العِلاج', sam: 'العِلاج', hic: 'العِلاج', kor: 'العِلاج', irk: 'العِلاج', mag: 'التّْداوي' } },
                { tr: 'Şifa',        ar: 'الشِّفاء' }
            ],

            sentence: [
                { words: [
                    { tr: 'Sağlık',       order: 1, ar: 'الصِّحَّةُ',
                  lh: { mis: 'الصِّحَّة', sam: 'الصِّحَّة', hic: 'الصِّحَّة', kor: 'الصِّحَّة', irk: 'الصِّحَّة', mag: 'الصِّحَّة' } },
                    { tr: 'büyük bir',    order: 2, ar: 'نِعْمَةٌ',
                  lh: { mis: 'نِعْمَة', sam: 'نِعْمِة', hic: 'نِعْمَة', kor: 'نِعْمَة', irk: 'نِعْمَة', mag: 'نِعْمَة' } },
                    { tr: 'nimettir.',    order: 3, ar: 'عَظيمَةٌ.',
                  lh: { mis: 'كْبيرَة.', sam: 'كْبيرِة.', hic: 'كْبيرَة.', kor: 'كْبيرَة.', irk: 'كْبيرَة.', mag: 'كْبيرَة.' } }
                ] },
                { words: [
                    { tr: 'Bugün',        order: 3, ar: 'اليَوْمَ.',
                  lh: { mis: 'النَّهارْدَه.', sam: 'اليَوْم.', hic: 'اليَوْم.', kor: 'اليَوْم.', irk: 'اليَوْم.', mag: 'اليوم.' } },
                    { tr: 'kendimi',      order: 2, ar: 'بِخَيْرٍ',
                  lh: { mis: 'كُوَيِّس', sam: 'مْنيح', hic: 'بِخير', kor: 'زين', irk: 'زين', mag: 'لاباس' } },
                    { tr: 'iyi hissetmiyorum.', order: 1, ar: 'لَسْتُ',
                  lh: { mis: 'مِش', sam: 'مِش', hic: 'مو', kor: 'مو', irk: 'مو', mag: 'ماشي' } }
                ] },
                { words: [
                    { tr: 'Başım',        order: 2, ar: 'رَأْسي.',
                  lh: { mis: 'راسي.', sam: 'راسي.', hic: 'راسي.', kor: 'راسي.', irk: 'راسي.', mag: 'راسي.' } },
                    { tr: 'ağrıyor.',     order: 1, ar: 'يُؤْلِمُني',
                  lh: { mis: 'بْيِوْجَعْني', sam: 'عَمْ يوجَعْني', hic: 'يوجَعْني', kor: 'يوجَعْني', irk: 'يوجَعْني', mag: 'كَيْضَرّْني' } }
                ] },
                { words: [
                    { tr: 'Doktora',      order: 2, ar: 'إِلى الطَّبيبِ.',
                  lh: { mis: 'لِلدُّكْتور.', sam: 'عَالحَكيم.', hic: 'لِلدُّكْتور.', kor: 'لِلدُّكْتور.', irk: 'لِلدُّكْتور.', mag: 'لْلطْبيب.' } },
                    { tr: 'gitmeliyim.',  order: 1, ar: 'يَجِبُ أَنْ أَذْهَبَ',
                  lh: { mis: 'لازِم أَروح', sam: 'لازِم روح', hic: 'لازِم أَروح', kor: 'لازِم أَروح', irk: 'لازِم أَروح', mag: 'خَصّْني نْمْشي' } }
                ] },
                { words: [
                    { tr: 'Doktor',       order: 1, ar: 'فَحَصَ',
                  lh: { mis: 'كَشَف', sam: 'فَحَص', hic: 'فَحَص', kor: 'فَحَص', irk: 'فَحَص', mag: 'فْحَص' } },
                    { tr: 'hastayı',      order: 2, ar: 'الطَّبيبُ',
                  lh: { mis: 'الدُّكْتور', sam: 'الحَكيم', hic: 'الدُّكْتور', kor: 'الدُّكْتور', irk: 'الدُّكْتور', mag: 'الطْبيب' } },
                    { tr: 'muayene etti.', order: 3, ar: 'المَريضَ.',
                  lh: { mis: 'العَيّان.', sam: 'المَريض.', hic: 'المَريض.', kor: 'المَريض.', irk: 'المَريض.', mag: 'المْريض.' } }
                ] },
                { words: [
                    { tr: 'İlacı',        order: 2, ar: 'الدَّواءَ',
                  lh: { mis: 'الدَّوا', sam: 'الدَّوا', hic: 'الدَّوا', kor: 'الدَّوا', irk: 'الدَّوا', mag: 'الدْوا' } },
                    { tr: 'günde üç kez', order: 3, ar: 'ثَلاثَ مَرّاتٍ في اليَوْمِ.',
                  lh: { mis: 'تَلات مَرّات في اليوم.', sam: 'تْلات مَرّات بِاليوم.', hic: 'ثَلاث مَرّات في اليوم.', kor: 'ثَلاث مَرّات في اليوم.', irk: 'تْلاث مَرّات بِاليوم.', mag: 'تْلات مَرّات فْالنّهار.' } },
                    { tr: 'al.',          order: 1, ar: 'خُذِ',
                  lh: { mis: 'خُد', sam: 'خود', hic: 'خُذ', kor: 'خُذ', irk: 'خُذ', mag: 'دّي' } }
                ] },
                { words: [
                    { tr: 'Spor',         order: 2, ar: 'الرِّياضَةُ',
                  lh: { mis: 'الرِّياضَة', sam: 'الرِّياضَة', hic: 'الرِّياضَة', kor: 'الرِّياضَة', irk: 'الرِّياضَة', mag: 'الرِّياضَة' } },
                    { tr: 'bedeni',       order: 3, ar: 'الجِسْمَ.',
                  lh: { mis: 'الجِسْم.', sam: 'الجِسِم.', hic: 'الجِسْم.', kor: 'الجِسْم.', irk: 'الجِسِم.', mag: 'الجْسْم.' } },
                    { tr: 'güçlendirir.', order: 1, ar: 'تُقَوّي',
                  lh: { mis: 'بِتْقَوّي', sam: 'بِتْقَوّي', hic: 'تْقَوّي', kor: 'تْقَوّي', irk: 'تْقَوّي', mag: 'كَتْقَوّي' } }
                ] },
                { words: [
                    { tr: 'Allah',        order: 2, ar: 'اللهُ.' },
                    { tr: 'sana şifa versin.', order: 1, ar: 'شَفاكَ' }
                ] }
            ],

            dialog: [
                {
                    p1: [
                        { tr: 'Neyin',    order: 2, ar: 'بِكَ',
                  lh: { mis: 'بيك', sam: 'فيك', hic: 'فيك', kor: 'فيك', irk: 'بيك', mag: 'بيك' } },
                        { tr: 'var?',     order: 1, ar: 'ماذا',
                  lh: { mis: 'إيه', sam: 'شو', hic: 'إيش', kor: 'شِنو', irk: 'شْنو', mag: 'شْنو' } },
                        { tr: 'kardeşim?', order: 3, ar: 'يا أَخي؟',
                  lh: { mis: 'يا أَخويا؟', sam: 'يا أَخي؟', hic: 'يا أَخوي؟', kor: 'يا أَخوي؟', irk: 'يا أَخويَ؟', mag: 'آ خويا؟' } }
                    ],
                    p2: [
                        { tr: 'Karnım',   order: 2, ar: 'بَطْني',
                  lh: { mis: 'بَطْني', sam: 'بَطْني', hic: 'بَطْني', kor: 'بَطْني', irk: 'بَطْني', mag: 'كَرْشي' } },
                        { tr: 'ağrıyor',  order: 1, ar: 'يُؤْلِمُني',
                  lh: { mis: 'بْيِوْجَعْني', sam: 'عَمْ يوجَعْني', hic: 'يوجَعْني', kor: 'يوجَعْني', irk: 'يوجَعْني', mag: 'كَيْضَرّْني' } },
                        { tr: 've ateşim var.', order: 3, ar: 'وَعِنْدي حَرارَةٌ.',
                  lh: { mis: 'وَعَنْدي سُخونِيَّة.', sam: 'وَعِنْدي حَرارَة.', hic: 'وَعِنْدي حَرارَة.', kor: 'وَعِنْدي حَرارَة.', irk: 'وَعِدّي حَرارَة.', mag: 'وَعَنْدي السْخانَة.' } }
                    ]
                },
                {
                    p1: [
                        { tr: 'Doktora',  order: 2, ar: 'إِلى الطَّبيبِ؟',
                  lh: { mis: 'لِلدُّكْتور؟', sam: 'عَالحَكيم؟', hic: 'لِلدُّكْتور؟', kor: 'لِلدُّكْتور؟', irk: 'لِلدُّكْتور؟', mag: 'لْلطْبيب؟' } },
                        { tr: 'gittin mi?', order: 1, ar: 'هَلْ ذَهَبْتَ',
                  lh: { mis: 'رُحْت', sam: 'رِحْت', hic: 'رِحْت', kor: 'رِحْت', irk: 'رِحِت', mag: 'مْشيتي' } }
                    ],
                    p2: [
                        { tr: 'Evet,',    order: 1, ar: 'نَعَمْ،',
                  lh: { mis: 'أَيْوَه،', sam: 'أَيْ،', hic: 'أَيْوَه،', kor: 'إِي،', irk: 'إي،', mag: 'إيه،' } },
                        { tr: 'bana',     order: 3, ar: 'لي',
                  lh: { mis: 'لي', sam: 'إِلي', hic: 'لي', kor: 'لي', irk: 'إِلي', mag: 'لِيَّ' } },
                        { tr: 'bir ilaç', order: 4, ar: 'دَواءً.',
                  lh: { mis: 'دَوا.', sam: 'دَوا.', hic: 'دَوا.', kor: 'دَوا.', irk: 'دَوا.', mag: 'دْوا.' } },
                        { tr: 'yazdı.',   order: 2, ar: 'وَصَفَ',
                  lh: { mis: 'كَتَب', sam: 'كَتَب', hic: 'كَتَب', kor: 'كَتَب', irk: 'كِتَب', mag: 'كْتَب' } }
                    ]
                },
                {
                    p1: [
                        { tr: 'Allah',    order: 2, ar: 'اللهُ،' },
                        { tr: 'şifa versin.', order: 1, ar: 'شَفاكَ' },
                        { tr: 'Dinlen.',  order: 3, ar: 'اِسْتَرِحْ.',
                  lh: { mis: 'اِرْتاح.', sam: 'اِرْتاح.', hic: 'اِرْتاح.', kor: 'اِرْتاح.', irk: 'اِرْتاح.', mag: 'رْتاح.' } }
                    ],
                    p2: [
                        { tr: 'Teşekkür ederim,', order: 1, ar: 'شُكْرًا لَكَ،',
                  lh: { mis: 'مُتْشَكِّر،', sam: 'مِرْسي إِلَك،', hic: 'مَشْكور،', kor: 'مَشْكور،', irk: 'شُكْرًا إِلَك،', mag: 'شُكْرًا لِيك،' } },
                        { tr: 'sen de sağlıklı ol.', order: 2, ar: 'وَأَنْتَ بِصِحَّةٍ وَعافِيَةٍ.',
                  lh: { mis: 'وَإِنْتَ بِصِحَّة وَعافْيَة.', sam: 'وَإِنْتَ بْصِحَّة وَعافْيِة.', hic: 'وَإِنْتَ بِصِحَّة وَعافْيَة.', kor: 'وَإِنْتَ بِصِحَّة وَعافْيَة.', irk: 'وَإِنْتَ بْصِحَّة وَعافْيَة.', mag: 'وَنْتَ بْصِحَّة وَراحَة.' } }
                    ]
                }
            ]
        },

        /* --- Diğer alanlar (içerik bekliyor) --- */
        {
            id: 'egitim', grup: 'genel',
            ad: 'Eğitim', ar: 'التَّعْليم',

            words: [
                { tr: 'Eğitim', ar: 'التَّعْليم' },
                { tr: 'Öğrenci', ar: 'الطّالِب' },
                { tr: 'Öğretmen', ar: 'المُعَلِّم' },
                { tr: 'Okul', ar: 'المَدْرَسَة' },
                { tr: 'Üniversite', ar: 'الجامِعَة' },
                { tr: 'Ders', ar: 'الدَّرْس' },
                { tr: 'Sınav', ar: 'الاِمْتِحان' },
                { tr: 'Kitap', ar: 'الكِتاب' },
                { tr: 'Kütüphane', ar: 'المَكْتَبَة' },
                { tr: 'Diploma', ar: 'الشَّهادَة' },
                { tr: 'Araştırma', ar: 'البَحْث' },
                { tr: 'Bilgi', ar: 'المَعْرِفَة' }
            ],

            sentence: [
                { words: [
                    { tr: 'Eğitim', order: 1, ar: 'التَّعْليمُ' },
                    { tr: 'milletlerin temelidir.', order: 2, ar: 'أَساسُ الأُمَمِ.' }
                ] },
                { words: [
                    { tr: 'Öğrenci', order: 1, ar: 'الطّالِبُ' },
                    { tr: 'kütüphanede okuyor.', order: 2, ar: 'يَقْرَأُ في المَكْتَبَةِ.' }
                ] },
                { words: [
                    { tr: 'Öğretmen', order: 1, ar: 'المُعَلِّمُ' },
                    { tr: 'dersi açıkladı.', order: 2, ar: 'شَرَحَ الدَّرْسَ.' }
                ] },
                { words: [
                    { tr: 'Sınav', order: 1, ar: 'الاِمْتِحانُ' },
                    { tr: 'gelecek hafta.', order: 2, ar: 'في الأُسْبوعِ القادِمِ.' }
                ] },
                { words: [
                    { tr: 'Üniversitede', order: 2, ar: 'في الجامِعَةِ.' },
                    { tr: 'edebiyat okuyorum', order: 1, ar: 'أَدْرُسُ الأَدَبَ' }
                ] },
                { words: [
                    { tr: 'İlim', order: 1, ar: 'العِلْمُ' },
                    { tr: 'beşikten mezara kadar.', order: 2, ar: 'مِنَ المَهْدِ إِلى اللَّحْدِ.' }
                ] },
                { words: [
                    { tr: 'Bu araştırma', order: 1, ar: 'هٰذا البَحْثُ' },
                    { tr: 'yeni bilgi veriyor.', order: 2, ar: 'يُقَدِّمُ مَعْرِفَةً جَديدَةً.' }
                ] },
                { words: [
                    { tr: 'Okul', order: 1, ar: 'المَدْرَسَةُ' },
                    { tr: 'sabah açılıyor.', order: 2, ar: 'تَفْتَحُ صَباحًا.' }
                ] }
            ],
            dialog: [
                {
                    p1: [
                        { tr: "Şimdi", order: 3, ar: "الآنَ؟" },
                        { tr: "nerede", order: 1, ar: "أَيْنَ" },
                        { tr: "okuyorsun?", order: 2, ar: "تَدْرُسُ" }
                    ],
                    p2: [
                        { tr: "Üniversitede", order: 2, ar: "في الجامِعَةِ." },
                        { tr: "okuyorum.", order: 1, ar: "أَدْرُسُ" }
                    ]
                },
                {
                    p1: [
                        { tr: "Sınav", order: 2, ar: "الاِمْتِحانُ؟" },
                        { tr: "ne zaman başlıyor?", order: 1, ar: "مَتى يَبْدَأُ" }
                    ],
                    p2: [
                        { tr: "Gelecek hafta.", order: 1, ar: "في الأُسْبوعِ القادِمِ." }
                    ]
                },
                {
                    p1: [
                        { tr: "Kitabı", order: 2, ar: "الكِتابَ؟" },
                        { tr: "okudun mu?", order: 1, ar: "هَلْ قَرَأْتَ" }
                    ],
                    p2: [
                        { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
                        { tr: "kütüphanede", order: 3, ar: "في المَكْتَبَةِ." },
                        { tr: "okudum.", order: 2, ar: "قَرَأْتُهُ" }
                    ]
                },
                {
                    p1: [
                        { tr: "Öğretmen", order: 2, ar: "المُعَلِّمُ؟" },
                        { tr: "ne anlattı?", order: 1, ar: "ماذا شَرَحَ" }
                    ],
                    p2: [
                        { tr: "Yeni dersi", order: 2, ar: "الدَّرْسَ الجَديدَ." },
                        { tr: "anlattı.", order: 1, ar: "شَرَحَ" }
                    ]
                }
            ]
        },
        {
            id: 'tarih', grup: 'genel',
            ad: 'Tarih', ar: 'التّاريخ',

            words: [
                { tr: 'Tarih', ar: 'التّاريخ' },
                { tr: 'Medeniyet', ar: 'الحَضارَة' },
                { tr: 'Devlet', ar: 'الدَّوْلَة' },
                { tr: 'Halife', ar: 'الخَليفَة' },
                { tr: 'Savaş', ar: 'الحَرْب' },
                { tr: 'Barış', ar: 'السَّلام' },
                { tr: 'Fetih', ar: 'الفَتْح' },
                { tr: 'Asır', ar: 'القَرْن' },
                { tr: 'Miras', ar: 'التُّراث' },
                { tr: 'Belge', ar: 'الوَثيقَة' },
                { tr: 'Kaynak', ar: 'المَصْدَر' },
                { tr: 'Olay', ar: 'الحادِثَة' }
            ],

            sentence: [
                { words: [
                    { tr: 'Tarih', order: 1, ar: 'التّاريخُ' },
                    { tr: 'milletlerin hafızasıdır.', order: 2, ar: 'ذاكِرَةُ الشُّعوبِ.' }
                ] },
                { words: [
                    { tr: 'İslam medeniyeti', order: 1, ar: 'الحَضارَةُ الإِسْلامِيَّةُ' },
                    { tr: 'insanlığa katkı sundu.', order: 2, ar: 'أَسْهَمَتْ في الإِنْسانِيَّةِ.' }
                ] },
                { words: [
                    { tr: 'Bu olay', order: 1, ar: 'هٰذِهِ الحادِثَةُ' },
                    { tr: 'yedinci asırda oldu.', order: 2, ar: 'وَقَعَتْ في القَرْنِ السّابِعِ.' }
                ] },
                { words: [
                    { tr: 'Tarihçi', order: 1, ar: 'المُؤَرِّخُ' },
                    { tr: 'kaynakları inceler.', order: 2, ar: 'يَدْرُسُ المَصادِرَ.' }
                ] },
                { words: [
                    { tr: 'Mirasımızı', order: 2, ar: 'تُراثَنا.' },
                    { tr: 'korumalıyız', order: 1, ar: 'يَجِبُ أَنْ نَحْفَظَ' }
                ] },
                { words: [
                    { tr: 'Savaş', order: 1, ar: 'الحَرْبُ' },
                    { tr: 'sona erdi', order: 2, ar: 'اِنْتَهَتْ' },
                    { tr: 'barışla.', order: 3, ar: 'بِالسَّلامِ.' }
                ] },
                { words: [
                    { tr: 'Bu belge', order: 1, ar: 'هٰذِهِ الوَثيقَةُ' },
                    { tr: 'çok eskidir.', order: 2, ar: 'قَديمَةٌ جِدًّا.' }
                ] },
                { words: [
                    { tr: 'Devlet', order: 1, ar: 'الدَّوْلَةُ' },
                    { tr: 'geniş bir bölgeye yayıldı.', order: 2, ar: 'اِتَّسَعَتْ في مِنْطَقَةٍ واسِعَةٍ.' }
                ] }
            ],
            dialog: [
                {
                    p1: [
                        { tr: "Bu olay", order: 2, ar: "هٰذِهِ الحادِثَةُ؟" },
                        { tr: "ne zaman oldu?", order: 1, ar: "مَتى وَقَعَتْ" }
                    ],
                    p2: [
                        { tr: "Yedinci", order: 1, ar: "في القَرْنِ" },
                        { tr: "asırda.", order: 2, ar: "السّابِعِ." }
                    ]
                },
                {
                    p1: [
                        { tr: "Tarihçi", order: 2, ar: "المُؤَرِّخُ؟" },
                        { tr: "neyi inceler?", order: 1, ar: "ماذا يَدْرُسُ" }
                    ],
                    p2: [
                        { tr: "Kaynakları ve belgeleri", order: 2, ar: "المَصادِرَ وَالوَثائِقَ." },
                        { tr: "inceler.", order: 1, ar: "يَدْرُسُ" }
                    ]
                },
                {
                    p1: [
                        { tr: "Savaş", order: 2, ar: "الحَرْبُ؟" },
                        { tr: "nasıl sona erdi?", order: 1, ar: "كَيْفَ انْتَهَتِ" }
                    ],
                    p2: [
                        { tr: "Barışla", order: 2, ar: "بِالسَّلامِ." },
                        { tr: "sona erdi.", order: 1, ar: "انْتَهَتْ" }
                    ]
                },
                {
                    p1: [
                        { tr: "Mirası", order: 2, ar: "التُّراثَ؟" },
                        { tr: "niçin koruruz?", order: 1, ar: "لِماذا نَحْفَظُ" }
                    ],
                    p2: [
                        { tr: "Çünkü o", order: 1, ar: "لِأَنَّهُ" },
                        { tr: "milletin hafızasıdır.", order: 2, ar: "ذاكِرَةُ الأُمَّةِ." }
                    ]
                }
            ]
        },
        {
            id: 'felsefe', grup: 'genel',
            ad: 'Felsefe', ar: 'الفَلْسَفَة',

            words: [
                { tr: 'Felsefe', ar: 'الفَلْسَفَة' },
                { tr: 'Akıl', ar: 'العَقْل' },
                { tr: 'Düşünce', ar: 'الفِكْر' },
                { tr: 'Hakikat', ar: 'الحَقيقَة' },
                { tr: 'Varlık', ar: 'الوُجود' },
                { tr: 'Bilgi (epistemik)', ar: 'المَعْرِفَة' },
                { tr: 'Delil', ar: 'الدَّليل' },
                { tr: 'Mantık', ar: 'المَنْطِق' },
                { tr: 'Ahlak', ar: 'الأَخْلاق' },
                { tr: 'Hikmet', ar: 'الحِكْمَة' },
                { tr: 'Şüphe', ar: 'الشَّكّ' },
                { tr: 'Yakîn (kesin bilgi)', ar: 'اليَقين' }
            ],

            sentence: [
                { words: [
                    { tr: 'Felsefe', order: 1, ar: 'الفَلْسَفَةُ' },
                    { tr: 'hakikati arar.', order: 2, ar: 'تَبْحَثُ عَنِ الحَقيقَةِ.' }
                ] },
                { words: [
                    { tr: 'Akıl', order: 1, ar: 'العَقْلُ' },
                    { tr: 'insanın süsüdür.', order: 2, ar: 'زينَةُ الإِنْسانِ.' }
                ] },
                { words: [
                    { tr: 'Şüphe', order: 1, ar: 'الشَّكُّ' },
                    { tr: 'yakîne giden yoldur.', order: 2, ar: 'طَريقٌ إِلى اليَقينِ.' }
                ] },
                { words: [
                    { tr: 'Filozof', order: 1, ar: 'الفَيْلَسوفُ' },
                    { tr: 'varlık üzerine düşünür.', order: 2, ar: 'يُفَكِّرُ في الوُجودِ.' }
                ] },
                { words: [
                    { tr: 'Bu görüşün', order: 2, ar: 'دَليلٌ' },
                    { tr: 'delili var mı?', order: 1, ar: 'هَلْ لِهٰذا الرَّأْيِ' }
                ] },
                { words: [
                    { tr: 'Ahlak', order: 1, ar: 'الأَخْلاقُ' },
                    { tr: 'bilgiden önce gelir.', order: 2, ar: 'تَسْبِقُ العِلْمَ.' }
                ] },
                { words: [
                    { tr: 'Mantık', order: 1, ar: 'المَنْطِقُ' },
                    { tr: 'doğru düşünmenin ölçüsüdür.', order: 2, ar: 'ميزانُ التَّفْكيرِ الصَّحيحِ.' }
                ] },
                { words: [
                    { tr: 'Hikmet', order: 1, ar: 'الحِكْمَةُ' },
                    { tr: 'müminin yitiğidir.', order: 2, ar: 'ضالَّةُ المُؤْمِنِ.' }
                ] }
            ],
            dialog: [
                {
                    p1: [
                        { tr: "Felsefe", order: 2, ar: "الفَلْسَفَةُ؟" },
                        { tr: "neyi arar?", order: 1, ar: "عَنْ ماذا تَبْحَثُ" }
                    ],
                    p2: [
                        { tr: "Hakikati", order: 2, ar: "عَنِ الحَقيقَةِ." },
                        { tr: "arar.", order: 1, ar: "تَبْحَثُ" }
                    ]
                },
                {
                    p1: [
                        { tr: "Bu görüşün", order: 1, ar: "هَلْ لِهٰذا الرَّأْيِ" },
                        { tr: "delili var mı?", order: 2, ar: "دَليلٌ؟" }
                    ],
                    p2: [
                        { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
                        { tr: "delili mantıktır.", order: 2, ar: "دَليلُهُ المَنْطِقُ." }
                    ]
                },
                {
                    p1: [
                        { tr: "Filozof", order: 2, ar: "الفَيْلَسوفُ؟" },
                        { tr: "ne üzerine düşünür?", order: 1, ar: "في ماذا يُفَكِّرُ" }
                    ],
                    p2: [
                        { tr: "Varlık ve bilgi üzerine", order: 2, ar: "في الوُجودِ وَالمَعْرِفَةِ." },
                        { tr: "düşünür.", order: 1, ar: "يُفَكِّرُ" }
                    ]
                },
                {
                    p1: [
                        { tr: "Hangisi önce gelir,", order: 1, ar: "أَيُّهُما أَسْبَقُ،" },
                        { tr: "ilim mi ahlak mı?", order: 2, ar: "العِلْمُ أَمِ الأَخْلاقُ؟" }
                    ],
                    p2: [
                        { tr: "Ahlak", order: 1, ar: "الأَخْلاقُ" },
                        { tr: "ilimden önce gelir.", order: 2, ar: "تَسْبِقُ العِلْمَ." }
                    ]
                }
            ]
        },
        {
            id: 'din', grup: 'genel',
            ad: 'Din', ar: 'الدّين',

            words: [
                { tr: 'Din', ar: 'الدّين' },
                { tr: 'İman', ar: 'الإيمان' },
                { tr: 'Namaz', ar: 'الصَّلاة' },
                { tr: 'Oruç', ar: 'الصَّوْم' },
                { tr: 'Zekât', ar: 'الزَّكاة' },
                { tr: 'Hac', ar: 'الحَجّ' },
                { tr: 'Kur\'an', ar: 'القُرْآن' },
                { tr: 'Sünnet', ar: 'السُّنَّة' },
                { tr: 'Cami', ar: 'المَسْجِد' },
                { tr: 'İbadet', ar: 'العِبادَة' },
                { tr: 'Takva', ar: 'التَّقْوى' },
                { tr: 'Dua', ar: 'الدُّعاء' }
            ],

            sentence: [
                { words: [
                    { tr: 'Namaz', order: 1, ar: 'الصَّلاةُ' },
                    { tr: 'dinin direğidir.', order: 2, ar: 'عِمادُ الدّينِ.' }
                ] },
                { words: [
                    { tr: 'Müslümanlar', order: 1, ar: 'المُسْلِمونَ' },
                    { tr: 'ramazanda oruç tutar.', order: 2, ar: 'يَصومونَ في رَمَضانَ.' }
                ] },
                { words: [
                    { tr: 'Kur\'an', order: 1, ar: 'القُرْآنُ' },
                    { tr: 'hidayet kitabıdır.', order: 2, ar: 'كِتابُ هِدايَةٍ.' }
                ] },
                { words: [
                    { tr: 'Camiye', order: 2, ar: 'إِلى المَسْجِدِ' },
                    { tr: 'gidiyorum', order: 1, ar: 'أَذْهَبُ' },
                    { tr: 'her cuma.', order: 3, ar: 'كُلَّ جُمُعَةٍ.' }
                ] },
                { words: [
                    { tr: 'Zekât', order: 1, ar: 'الزَّكاةُ' },
                    { tr: 'malı temizler.', order: 2, ar: 'تُطَهِّرُ المالَ.' }
                ] },
                { words: [
                    { tr: 'Dua', order: 1, ar: 'الدُّعاءُ' },
                    { tr: 'ibadetin özüdür.', order: 2, ar: 'مُخُّ العِبادَةِ.' }
                ] },
                { words: [
                    { tr: 'Hac', order: 1, ar: 'الحَجُّ' },
                    { tr: 'gücü yetene farzdır.', order: 2, ar: 'فَرْضٌ عَلى المُسْتَطيعِ.' }
                ] },
                { words: [
                    { tr: 'Takva', order: 1, ar: 'التَّقْوى' },
                    { tr: 'kalpte bulunur.', order: 2, ar: 'في القَلْبِ.' }
                ] }
            ],
            dialog: [
                {
                    p1: [
                        { tr: "Camiye", order: 2, ar: "إِلى المَسْجِدِ؟" },
                        { tr: "ne zaman gidersin?", order: 1, ar: "مَتى تَذْهَبُ" }
                    ],
                    p2: [
                        { tr: "Her cuma", order: 2, ar: "كُلَّ جُمُعَةٍ." },
                        { tr: "giderim.", order: 1, ar: "أَذْهَبُ" }
                    ]
                },
                {
                    p1: [
                        { tr: "Dinin direği", order: 1, ar: "ما عِمادُ" },
                        { tr: "nedir?", order: 2, ar: "الدّينِ؟" }
                    ],
                    p2: [
                        { tr: "Namaz", order: 1, ar: "الصَّلاةُ" },
                        { tr: "dinin direğidir.", order: 2, ar: "عِمادُ الدّينِ." }
                    ]
                },
                {
                    p1: [
                        { tr: "Ramazan orucunu", order: 2, ar: "رَمَضانَ؟" },
                        { tr: "tuttun mu?", order: 1, ar: "هَلْ صُمْتَ" }
                    ],
                    p2: [
                        { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
                        { tr: "tam olarak", order: 3, ar: "كامِلًا." },
                        { tr: "tuttum.", order: 2, ar: "صُمْتُهُ" }
                    ]
                },
                {
                    p1: [
                        { tr: "Hac", order: 2, ar: "الحَجُّ؟" },
                        { tr: "kime farzdır?", order: 1, ar: "عَلى مَنْ يَجِبُ" }
                    ],
                    p2: [
                        { tr: "Gücü yetene.", order: 1, ar: "عَلى المُسْتَطيعِ." }
                    ]
                }
            ]
        },
        {
            id: 'bilim', grup: 'genel',
            ad: 'Bilim & Teknoloji', ar: 'العِلْم والتِّقْنِيَة',

            words: [
                { tr: 'Bilim', ar: 'العِلْم' },
                { tr: 'Teknoloji', ar: 'التِّكْنولوجْيا' },
                { tr: 'Bilgisayar', ar: 'الحاسوب' },
                { tr: 'İnternet', ar: 'الإِنْتَرْنِت' },
                { tr: 'Deney', ar: 'التَّجْرِبَة' },
                { tr: 'Laboratuvar', ar: 'المُخْتَبَر' },
                { tr: 'Keşif', ar: 'الاِكْتِشاف' },
                { tr: 'İcat', ar: 'الاِخْتِراع' },
                { tr: 'Enerji', ar: 'الطّاقَة' },
                { tr: 'Yapay zekâ', ar: 'الذَّكاءُ الاِصْطِناعِيّ' },
                { tr: 'Uygulama', ar: 'التَّطْبيق' },
                { tr: 'Veri', ar: 'البَيانات' }
            ],

            sentence: [
                { words: [
                    { tr: 'Bilim', order: 1, ar: 'العِلْمُ' },
                    { tr: 'hayatı değiştirdi.', order: 2, ar: 'غَيَّرَ الحَياةَ.' }
                ] },
                { words: [
                    { tr: 'Bilgisayar', order: 1, ar: 'الحاسوبُ' },
                    { tr: 'işi kolaylaştırıyor.', order: 2, ar: 'يُسَهِّلُ العَمَلَ.' }
                ] },
                { words: [
                    { tr: 'Bilim adamı', order: 1, ar: 'العالِمُ' },
                    { tr: 'laboratuvarda deney yapıyor.', order: 2, ar: 'يُجْري تَجْرِبَةً في المُخْتَبَرِ.' }
                ] },
                { words: [
                    { tr: 'İnternet', order: 1, ar: 'الإِنْتَرْنِتُ' },
                    { tr: 'dünyayı birleştirdi.', order: 2, ar: 'رَبَطَ العالَمَ.' }
                ] },
                { words: [
                    { tr: 'Yapay zekâ', order: 1, ar: 'الذَّكاءُ الاِصْطِناعِيُّ' },
                    { tr: 'hızla gelişiyor.', order: 2, ar: 'يَتَطَوَّرُ بِسُرْعَةٍ.' }
                ] },
                { words: [
                    { tr: 'Yenilenebilir enerji', order: 1, ar: 'الطّاقَةُ المُتَجَدِّدَةُ' },
                    { tr: 'çevreyi korur.', order: 2, ar: 'تَحْمي البيئَةَ.' }
                ] },
                { words: [
                    { tr: 'Bu icat', order: 1, ar: 'هٰذا الاِخْتِراعُ' },
                    { tr: 'insanlığa fayda sağladı.', order: 2, ar: 'نَفَعَ الإِنْسانِيَّةَ.' }
                ] },
                { words: [
                    { tr: 'Veriyi', order: 2, ar: 'البَياناتِ' },
                    { tr: 'dikkatle analiz ediyoruz.', order: 1, ar: 'نُحَلِّلُ' },
                    { tr: 'dikkatle.', order: 3, ar: 'بِعِنايَةٍ.' }
                ] }
            ],
            dialog: [
                {
                    p1: [
                        { tr: "Bilim adamı", order: 2, ar: "العالِمُ" },
                        { tr: "deneyini", order: 3, ar: "تَجْرِبَتَهُ؟" },
                        { tr: "nerede yapar?", order: 1, ar: "أَيْنَ يُجْري" }
                    ],
                    p2: [
                        { tr: "Laboratuvarda.", order: 1, ar: "في المُخْتَبَرِ." }
                    ]
                },
                {
                    p1: [
                        { tr: "Bilim", order: 2, ar: "العِلْمُ" },
                        { tr: "hayatı", order: 3, ar: "الحَياةَ؟" },
                        { tr: "nasıl değiştirdi?", order: 1, ar: "كَيْفَ غَيَّرَ" }
                    ],
                    p2: [
                        { tr: "İşi kolaylaştırdı", order: 1, ar: "سَهَّلَ العَمَلَ" },
                        { tr: "ve dünyayı birleştirdi.", order: 2, ar: "وَرَبَطَ العالَمَ." }
                    ]
                },
                {
                    p1: [
                        { tr: "Yapay zekâyı", order: 2, ar: "الذَّكاءَ الاِصْطِناعِيَّ؟" },
                        { tr: "kullanıyor musun?", order: 1, ar: "هَلْ تَسْتَخْدِمُ" }
                    ],
                    p2: [
                        { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
                        { tr: "veri analizinde.", order: 2, ar: "في تَحْليلِ البَياناتِ." }
                    ]
                },
                {
                    p1: [
                        { tr: "Yenilenebilir enerjiye", order: 2, ar: "الطّاقَةَ المُتَجَدِّدَةَ؟" },
                        { tr: "niçin ihtiyaç duyarız?", order: 1, ar: "لِماذا نَحْتاجُ" }
                    ],
                    p2: [
                        { tr: "Çünkü o", order: 1, ar: "لِأَنَّها" },
                        { tr: "çevreyi korur.", order: 2, ar: "تَحْمي البيئَةَ." }
                    ]
                }
            ]
        },
        {
            id: 'ekonomi', grup: 'genel',
            ad: 'Ekonomi & Ticaret', ar: 'الاقْتِصاد والتِّجارَة',

            words: [
                { tr: 'Ekonomi', ar: 'الاِقْتِصاد' },
                { tr: 'Ticaret', ar: 'التِّجارَة' },
                { tr: 'Pazar', ar: 'السّوق' },
                { tr: 'Sermaye', ar: 'رَأْسُ المالِ' },
                { tr: 'Kâr', ar: 'الرِّبْح' },
                { tr: 'Zarar', ar: 'الخَسارَة' },
                { tr: 'Şirket', ar: 'الشَّرِكَة' },
                { tr: 'Banka', ar: 'البَنْك' },
                { tr: 'Yatırım', ar: 'الاِسْتِثْمار' },
                { tr: 'Bütçe', ar: 'الميزانِيَّة' },
                { tr: 'Enflasyon', ar: 'التَّضَخُّم' },
                { tr: 'İthalat', ar: 'الاِسْتيراد' }
            ],

            sentence: [
                { words: [
                    { tr: 'Ekonomi', order: 1, ar: 'الاِقْتِصادُ' },
                    { tr: 'bu yıl büyüdü.', order: 2, ar: 'نَما هٰذا العامَ.' }
                ] },
                { words: [
                    { tr: 'Tüccar', order: 1, ar: 'التّاجِرُ' },
                    { tr: 'pazarda mal satıyor.', order: 2, ar: 'يَبيعُ البَضائِعَ في السّوقِ.' }
                ] },
                { words: [
                    { tr: 'Şirket', order: 1, ar: 'الشَّرِكَةُ' },
                    { tr: 'büyük kâr elde etti.', order: 2, ar: 'حَقَّقَتْ رِبْحًا كَبيرًا.' }
                ] },
                { words: [
                    { tr: 'Banka', order: 1, ar: 'البَنْكُ' },
                    { tr: 'tüccarlara kredi veriyor.', order: 2, ar: 'يُقْرِضُ التُّجّارَ.' }
                ] },
                { words: [
                    { tr: 'Yatırım', order: 1, ar: 'الاِسْتِثْمارُ' },
                    { tr: 'iş imkânı doğurur.', order: 2, ar: 'يَخْلُقُ فُرَصَ عَمَلٍ.' }
                ] },
                { words: [
                    { tr: 'Fiyatlar', order: 1, ar: 'الأَسْعارُ' },
                    { tr: 'enflasyon sebebiyle yükseldi.', order: 2, ar: 'اِرْتَفَعَتْ بِسَبَبِ التَّضَخُّمِ.' }
                ] },
                { words: [
                    { tr: 'Devlet', order: 1, ar: 'الدَّوْلَةُ' },
                    { tr: 'yıllık bütçeyi hazırladı.', order: 2, ar: 'أَعَدَّتِ الميزانِيَّةَ السَّنَوِيَّةَ.' }
                ] },
                { words: [
                    { tr: 'İhracat', order: 1, ar: 'التَّصْديرُ' },
                    { tr: 'ithalattan fazla.', order: 2, ar: 'أَكْثَرُ مِنَ الاِسْتيرادِ.' }
                ] }
            ],
            dialog: [
                {
                    p1: [
                        { tr: "Bu yıl", order: 2, ar: "هٰذا العامَ؟" },
                        { tr: "ekonominin durumu nasıl?", order: 1, ar: "كَيْفَ حالُ الاِقْتِصادِ" }
                    ],
                    p2: [
                        { tr: "İyi bir oranda", order: 2, ar: "بِنِسْبَةٍ جَيِّدَةٍ." },
                        { tr: "büyüdü.", order: 1, ar: "نَما" }
                    ]
                },
                {
                    p1: [
                        { tr: "Şirket", order: 2, ar: "الشَّرِكَةُ؟" },
                        { tr: "kâr etti mi?", order: 1, ar: "هَلْ رَبِحَتِ" }
                    ],
                    p2: [
                        { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
                        { tr: "büyük bir kâr elde etti.", order: 2, ar: "حَقَّقَتْ رِبْحًا كَبيرًا." }
                    ]
                },
                {
                    p1: [
                        { tr: "Fiyatlar", order: 2, ar: "الأَسْعارُ؟" },
                        { tr: "niçin yükseldi?", order: 1, ar: "لِماذا ارْتَفَعَتِ" }
                    ],
                    p2: [
                        { tr: "Enflasyon sebebiyle.", order: 1, ar: "بِسَبَبِ التَّضَخُّمِ." }
                    ]
                },
                {
                    p1: [
                        { tr: "Paranı", order: 2, ar: "مالَكَ؟" },
                        { tr: "nereye yatırıyorsun?", order: 1, ar: "أَيْنَ تَسْتَثْمِرُ" }
                    ],
                    p2: [
                        { tr: "Ticarete ve sanayiye.", order: 1, ar: "في التِّجارَةِ وَالصِّناعَةِ." }
                    ]
                }
            ]
        },
        {
            id: 'hukuk', grup: 'genel',
            ad: 'Hukuk', ar: 'القانون',

            words: [
                { tr: 'Hukuk', ar: 'القانون' },
                { tr: 'Adalet', ar: 'العَدالَة' },
                { tr: 'Hâkim', ar: 'القاضي' },
                { tr: 'Avukat', ar: 'المُحامي' },
                { tr: 'Mahkeme', ar: 'المَحْكَمَة' },
                { tr: 'Dava', ar: 'القَضِيَّة' },
                { tr: 'Hak', ar: 'الحَقّ' },
                { tr: 'Görev', ar: 'الواجِب' },
                { tr: 'Ceza', ar: 'العُقوبَة' },
                { tr: 'Şahit', ar: 'الشّاهِد' },
                { tr: 'Delil (hukuk)', ar: 'الدَّليل' },
                { tr: 'Anayasa', ar: 'الدُّسْتور' }
            ],

            sentence: [
                { words: [
                    { tr: 'Adalet', order: 1, ar: 'العَدالَةُ' },
                    { tr: 'mülkün temelidir.', order: 2, ar: 'أَساسُ المُلْكِ.' }
                ] },
                { words: [
                    { tr: 'Hâkim', order: 1, ar: 'القاضي' },
                    { tr: 'davada hüküm verdi.', order: 2, ar: 'حَكَمَ في القَضِيَّةِ.' }
                ] },
                { words: [
                    { tr: 'Avukat', order: 1, ar: 'المُحامي' },
                    { tr: 'müvekkilini savundu.', order: 2, ar: 'دافَعَ عَنْ مُوَكِّلِهِ.' }
                ] },
                { words: [
                    { tr: 'Kanun', order: 1, ar: 'القانونُ' },
                    { tr: 'herkese eşit uygulanır.', order: 2, ar: 'يُطَبَّقُ عَلى الجَميعِ.' }
                ] },
                { words: [
                    { tr: 'Şahit', order: 1, ar: 'الشّاهِدُ' },
                    { tr: 'mahkemede doğruyu söyledi.', order: 2, ar: 'قالَ الصِّدْقَ في المَحْكَمَةِ.' }
                ] },
                { words: [
                    { tr: 'Her hakkın', order: 1, ar: 'لِكُلِّ حَقٍّ' },
                    { tr: 'bir görevi vardır.', order: 2, ar: 'واجِبٌ.' }
                ] },
                { words: [
                    { tr: 'Anayasa', order: 1, ar: 'الدُّسْتورُ' },
                    { tr: 'vatandaşın haklarını korur.', order: 2, ar: 'يَحْمي حُقوقَ المُواطِنِ.' }
                ] },
                { words: [
                    { tr: 'Ceza', order: 1, ar: 'العُقوبَةُ' },
                    { tr: 'suçla orantılıdır.', order: 2, ar: 'بِقَدْرِ الجُرْمِ.' }
                ] }
            ],
            dialog: [
                {
                    p1: [
                        { tr: "Davada", order: 2, ar: "في القَضِيَّةِ؟" },
                        { tr: "kim hüküm verdi?", order: 1, ar: "مَنْ حَكَمَ" }
                    ],
                    p2: [
                        { tr: "Hâkim", order: 2, ar: "القاضي" },
                        { tr: "adaletle", order: 3, ar: "بِالعَدْلِ." },
                        { tr: "hüküm verdi.", order: 1, ar: "حَكَمَ" }
                    ]
                },
                {
                    p1: [
                        { tr: "Şahit", order: 2, ar: "الشّاهِدُ؟" },
                        { tr: "geldi mi?", order: 1, ar: "هَلْ حَضَرَ" }
                    ],
                    p2: [
                        { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
                        { tr: "ve doğruyu söyledi.", order: 2, ar: "وَقالَ الصِّدْقَ." }
                    ]
                },
                {
                    p1: [
                        { tr: "Anayasa", order: 2, ar: "الدُّسْتورُ؟" },
                        { tr: "neyi korur?", order: 1, ar: "ماذا يَحْمي" }
                    ],
                    p2: [
                        { tr: "Vatandaşların haklarını", order: 2, ar: "حُقوقَ المُواطِنينَ." },
                        { tr: "korur.", order: 1, ar: "يَحْمي" }
                    ]
                },
                {
                    p1: [
                        { tr: "Kanun", order: 2, ar: "القانونُ؟" },
                        { tr: "kime uygulanır?", order: 1, ar: "عَلى مَنْ يُطَبَّقُ" }
                    ],
                    p2: [
                        { tr: "Herkese", order: 2, ar: "عَلى الجَميعِ." },
                        { tr: "uygulanır.", order: 1, ar: "يُطَبَّقُ" }
                    ]
                }
            ]
        },
        {
            id: 'siyaset', grup: 'genel',
            ad: 'Siyaset & Medya', ar: 'السِّياسَة والإعْلام',

            words: [
                { tr: 'Siyaset', ar: 'السِّياسَة' },
                { tr: 'Hükümet', ar: 'الحُكومَة' },
                { tr: 'Başkan', ar: 'الرَّئيس' },
                { tr: 'Parlamento', ar: 'البَرْلَمان' },
                { tr: 'Seçim', ar: 'الاِنْتِخابات' },
                { tr: 'Parti', ar: 'الحِزْب' },
                { tr: 'Haber', ar: 'الخَبَر' },
                { tr: 'Gazete', ar: 'الجَريدَة' },
                { tr: 'Kanal', ar: 'القَناة' },
                { tr: 'Basın', ar: 'الصَّحافَة' },
                { tr: 'Kamuoyu', ar: 'الرَّأْيُ العامّ' },
                { tr: 'Anlaşma', ar: 'الاِتِّفاقِيَّة' }
            ],

            sentence: [
                { words: [
                    { tr: 'Hükümet', order: 1, ar: 'الحُكومَةُ' },
                    { tr: 'yeni bir karar aldı.', order: 2, ar: 'اِتَّخَذَتْ قَرارًا جَديدًا.' }
                ] },
                { words: [
                    { tr: 'Seçimler', order: 1, ar: 'الاِنْتِخاباتُ' },
                    { tr: 'gelecek ay yapılacak.', order: 2, ar: 'سَتُجْرى الشَّهْرَ القادِمَ.' }
                ] },
                { words: [
                    { tr: 'Gazete', order: 1, ar: 'الجَريدَةُ' },
                    { tr: 'haberi yayımladı.', order: 2, ar: 'نَشَرَتِ الخَبَرَ.' }
                ] },
                { words: [
                    { tr: 'Basın', order: 1, ar: 'الصَّحافَةُ' },
                    { tr: 'kamuoyunu etkiler.', order: 2, ar: 'تُؤَثِّرُ في الرَّأْيِ العامِّ.' }
                ] },
                { words: [
                    { tr: 'İki devlet', order: 1, ar: 'الدَّوْلَتانِ' },
                    { tr: 'bir anlaşma imzaladı.', order: 2, ar: 'وَقَّعَتا اتِّفاقِيَّةً.' }
                ] },
                { words: [
                    { tr: 'Başkan', order: 1, ar: 'الرَّئيسُ' },
                    { tr: 'parlamentoda konuştu.', order: 2, ar: 'تَحَدَّثَ في البَرْلَمانِ.' }
                ] },
                { words: [
                    { tr: 'Bu kanal', order: 1, ar: 'هٰذِهِ القَناةُ' },
                    { tr: 'haberleri canlı yayımlıyor.', order: 2, ar: 'تَنْقُلُ الأَخْبارَ مُباشَرَةً.' }
                ] },
                { words: [
                    { tr: 'Siyaset', order: 1, ar: 'السِّياسَةُ' },
                    { tr: 'mümkünün sanatıdır.', order: 2, ar: 'فَنُّ المُمْكِنِ.' }
                ] }
            ],
            dialog: [
                {
                    p1: [
                        { tr: "Seçimler", order: 2, ar: "الاِنْتِخاباتُ؟" },
                        { tr: "ne zaman yapılacak?", order: 1, ar: "مَتى تُجْرى" }
                    ],
                    p2: [
                        { tr: "Gelecek ay.", order: 1, ar: "في الشَّهْرِ القادِمِ." }
                    ]
                },
                {
                    p1: [
                        { tr: "Haberi", order: 2, ar: "الخَبَرَ؟" },
                        { tr: "nerede okudun?", order: 1, ar: "أَيْنَ قَرَأْتَ" }
                    ],
                    p2: [
                        { tr: "Gazetede ve kanalda.", order: 1, ar: "في الجَريدَةِ وَالقَناةِ." }
                    ]
                },
                {
                    p1: [
                        { tr: "Hükümet", order: 2, ar: "الحُكومَةُ؟" },
                        { tr: "ne karar aldı?", order: 1, ar: "ماذا اتَّخَذَتِ" }
                    ],
                    p2: [
                        { tr: "Yeni bir karar", order: 2, ar: "قَرارًا جَديدًا." },
                        { tr: "aldı.", order: 1, ar: "اتَّخَذَتْ" }
                    ]
                },
                {
                    p1: [
                        { tr: "Anlaşma", order: 2, ar: "الاِتِّفاقِيَّةُ؟" },
                        { tr: "imzalandı mı?", order: 1, ar: "هَلْ وُقِّعَتِ" }
                    ],
                    p2: [
                        { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
                        { tr: "iki devlet imzaladı.", order: 2, ar: "وَقَّعَتْها الدَّوْلَتانِ." }
                    ]
                }
            ]
        },
        {
            id: 'edebiyat', grup: 'genel',
            ad: 'Edebiyat & Sanat', ar: 'الأَدَب والفَنّ',

            words: [
                { tr: 'Edebiyat', ar: 'الأَدَب' },
                { tr: 'Şiir', ar: 'الشِّعْر' },
                { tr: 'Şair', ar: 'الشّاعِر' },
                { tr: 'Roman', ar: 'الرِّوايَة' },
                { tr: 'Hikâye', ar: 'القِصَّة' },
                { tr: 'Yazar', ar: 'الكاتِب' },
                { tr: 'Nesir', ar: 'النَّثْر' },
                { tr: 'Tiyatro', ar: 'المَسْرَح' },
                { tr: 'Sanat', ar: 'الفَنّ' },
                { tr: 'Resim', ar: 'اللَّوْحَة' },
                { tr: 'Hat sanatı', ar: 'الخَطّ' },
                { tr: 'Musiki', ar: 'الموسيقى' }
            ],

            sentence: [
                { words: [
                    { tr: 'Arap edebiyatı', order: 1, ar: 'الأَدَبُ العَرَبِيُّ' },
                    { tr: 'köklü ve zengindir.', order: 2, ar: 'عَريقٌ وَغَنِيٌّ.' }
                ] },
                { words: [
                    { tr: 'Şair', order: 1, ar: 'الشّاعِرُ' },
                    { tr: 'güzel bir kaside yazdı.', order: 2, ar: 'كَتَبَ قَصيدَةً جَميلَةً.' }
                ] },
                { words: [
                    { tr: 'Bu roman', order: 1, ar: 'هٰذِهِ الرِّوايَةُ' },
                    { tr: 'toplumu anlatıyor.', order: 2, ar: 'تَصِفُ المُجْتَمَعَ.' }
                ] },
                { words: [
                    { tr: 'Hikâyeyi', order: 2, ar: 'القِصَّةَ' },
                    { tr: 'bir gecede okudum.', order: 1, ar: 'قَرَأْتُ' },
                    { tr: 'bir gecede.', order: 3, ar: 'في لَيْلَةٍ واحِدَةٍ.' }
                ] },
                { words: [
                    { tr: 'Hat sanatı', order: 1, ar: 'الخَطُّ العَرَبِيُّ' },
                    { tr: 'İslam sanatlarındandır.', order: 2, ar: 'مِنَ الفُنونِ الإِسْلامِيَّةِ.' }
                ] },
                { words: [
                    { tr: 'Tiyatro', order: 1, ar: 'المَسْرَحُ' },
                    { tr: 'yeni bir oyun sundu.', order: 2, ar: 'قَدَّمَ مَسْرَحِيَّةً جَديدَةً.' }
                ] },
                { words: [
                    { tr: 'Yazar', order: 1, ar: 'الكاتِبُ' },
                    { tr: 'sade bir üslupla yazar.', order: 2, ar: 'يَكْتُبُ بِأُسْلوبٍ بَسيطٍ.' }
                ] },
                { words: [
                    { tr: 'Sanat', order: 1, ar: 'الفَنُّ' },
                    { tr: 'ruhun dilidir.', order: 2, ar: 'لُغَةُ الرّوحِ.' }
                ] }
            ],
            dialog: [
                {
                    p1: [
                        { tr: "Şimdi", order: 2, ar: "الآنَ؟" },
                        { tr: "ne okuyorsun?", order: 1, ar: "ماذا تَقْرَأُ" }
                    ],
                    p2: [
                        { tr: "Arapça bir roman", order: 2, ar: "رِوايَةً عَرَبِيَّةً." },
                        { tr: "okuyorum.", order: 1, ar: "أَقْرَأُ" }
                    ]
                },
                {
                    p1: [
                        { tr: "Bu kasideyi", order: 2, ar: "هٰذِهِ القَصيدَةَ؟" },
                        { tr: "kim yazdı?", order: 1, ar: "مَنْ كَتَبَ" }
                    ],
                    p2: [
                        { tr: "Onu tanınmış bir şair", order: 2, ar: "شاعِرٌ مَعْروفٌ." },
                        { tr: "yazdı.", order: 1, ar: "كَتَبَها" }
                    ]
                },
                {
                    p1: [
                        { tr: "Arap hattını", order: 2, ar: "الخَطَّ العَرَبِيَّ؟" },
                        { tr: "sever misin?", order: 1, ar: "هَلْ تُحِبُّ" }
                    ],
                    p2: [
                        { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
                        { tr: "o sanatların en güzelindendir.", order: 2, ar: "هُوَ مِنْ أَجْمَلِ الفُنونِ." }
                    ]
                },
                {
                    p1: [
                        { tr: "Tiyatro", order: 2, ar: "المَسْرَحُ" },
                        { tr: "dün", order: 3, ar: "أَمْسِ؟" },
                        { tr: "ne sundu?", order: 1, ar: "ماذا قَدَّمَ" }
                    ],
                    p2: [
                        { tr: "Yeni bir oyun", order: 2, ar: "مَسْرَحِيَّةً جَديدَةً." },
                        { tr: "sundu.", order: 1, ar: "قَدَّمَ" }
                    ]
                }
            ]
        },
        {
            id: 'cevre', grup: 'genel',
            ad: 'Çevre', ar: 'البيئَة',

            words: [
                { tr: 'Çevre', ar: 'البيئَة' },
                { tr: 'Doğa', ar: 'الطَّبيعَة' },
                { tr: 'Ağaç', ar: 'الشَّجَرَة' },
                { tr: 'Orman', ar: 'الغابَة' },
                { tr: 'Kirlilik', ar: 'التَّلَوُّث' },
                { tr: 'Hava', ar: 'الهَواء' },
                { tr: 'İklim', ar: 'المُناخ' },
                { tr: 'Geri dönüşüm', ar: 'إِعادَةُ التَّدْويرِ' },
                { tr: 'Çöp', ar: 'النُّفايات' },
                { tr: 'Su kaynakları', ar: 'مَواردُ المِياهِ' },
                { tr: 'Çöl', ar: 'الصَّحْراء' },
                { tr: 'Koruma', ar: 'الحِمايَة' }
            ],

            sentence: [
                { words: [
                    { tr: 'Çevreyi', order: 2, ar: 'البيئَةَ.' },
                    { tr: 'korumalıyız', order: 1, ar: 'يَجِبُ أَنْ نَحْمِيَ' }
                ] },
                { words: [
                    { tr: 'Ağaçlar', order: 1, ar: 'الأَشْجارُ' },
                    { tr: 'havayı temizler.', order: 2, ar: 'تُنَقّي الهَواءَ.' }
                ] },
                { words: [
                    { tr: 'Kirlilik', order: 1, ar: 'التَّلَوُّثُ' },
                    { tr: 'sağlığa zarar veriyor.', order: 2, ar: 'يَضُرُّ بِالصِّحَّةِ.' }
                ] },
                { words: [
                    { tr: 'İklim', order: 1, ar: 'المُناخُ' },
                    { tr: 'son yıllarda değişti.', order: 2, ar: 'تَغَيَّرَ في السَّنَواتِ الأَخيرَةِ.' }
                ] },
                { words: [
                    { tr: 'Çöpü', order: 2, ar: 'النُّفاياتِ' },
                    { tr: 'geri dönüştürüyoruz.', order: 1, ar: 'نُعيدُ تَدْويرَ' }
                ] },
                { words: [
                    { tr: 'Su', order: 1, ar: 'الماءُ' },
                    { tr: 'hayatın kaynağıdır.', order: 2, ar: 'مَصْدَرُ الحَياةِ.' }
                ] },
                { words: [
                    { tr: 'Ormanlar', order: 1, ar: 'الغاباتُ' },
                    { tr: 'birçok canlıyı barındırır.', order: 2, ar: 'تَأْوي كائِناتٍ كَثيرَةً.' }
                ] },
                { words: [
                    { tr: 'Her yıl', order: 2, ar: 'كُلَّ عامٍ.' },
                    { tr: 'bir ağaç dikiyorum', order: 1, ar: 'أَزْرَعُ شَجَرَةً' }
                ] }
            ],
            dialog: [
                {
                    p1: [
                        { tr: "Çevreyi", order: 2, ar: "البيئَةَ؟" },
                        { tr: "nasıl koruruz?", order: 1, ar: "كَيْفَ نَحْمي" }
                    ],
                    p2: [
                        { tr: "Ağaç dikeriz", order: 1, ar: "نَزْرَعُ الأَشْجارَ" },
                        { tr: "ve çöpü azaltırız.", order: 2, ar: "وَنُقَلِّلُ النُّفاياتِ." }
                    ]
                },
                {
                    p1: [
                        { tr: "Kirliliğin", order: 1, ar: "ما ضَرَرُ" },
                        { tr: "zararı nedir?", order: 2, ar: "التَّلَوُّثِ؟" }
                    ],
                    p2: [
                        { tr: "Sağlığa ve havaya", order: 2, ar: "بِالصِّحَّةِ وَالهَواءِ." },
                        { tr: "zarar verir.", order: 1, ar: "يَضُرُّ" }
                    ]
                },
                {
                    p1: [
                        { tr: "İklim", order: 2, ar: "المُناخُ؟" },
                        { tr: "değişti mi?", order: 1, ar: "هَلْ تَغَيَّرَ" }
                    ],
                    p2: [
                        { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
                        { tr: "çok değişti.", order: 2, ar: "تَغَيَّرَ كَثيرًا." }
                    ]
                },
                {
                    p1: [
                        { tr: "Geri dönüşümü", order: 2, ar: "التَّدْويرَ؟" },
                        { tr: "niçin yaparız?", order: 1, ar: "لِماذا نُعيدُ" }
                    ],
                    p2: [
                        { tr: "Kaynakları korumak için.", order: 1, ar: "لِنَحْفَظَ المَواردَ." }
                    ]
                }
            ]
        },
        {
            id: 'seyahat', grup: 'genel',
            ad: 'Seyahat & Turizm', ar: 'السَّفَر والسِّياحَة',

            words: [
                { tr: 'Seyahat', ar: 'السَّفَر' },
                { tr: 'Uçak', ar: 'الطّائِرَة',
                  lh: { mis: 'الطَّيّارَة', sam: 'الطَّيّارَة', hic: 'الطَّيّارَة', kor: 'الطَّيّارَة', irk: 'الطَّيّارَة', mag: 'الطّيّارَة' } },
                { tr: 'Havaalanı', ar: 'المَطار' },
                { tr: 'Otel', ar: 'الفُنْدُق',
                  lh: { mis: 'الفُنْدُق', sam: 'الأوتيل', hic: 'الفُنْدُق', kor: 'الفُنْدُق', irk: 'الفُنْدُق', mag: 'الأوطيل' } },
                { tr: 'Pasaport', ar: 'جَوازُ السَّفَرِ' },
                { tr: 'Bilet', ar: 'التَّذْكِرَة',
                  lh: { mis: 'التَّذْكَرَة', sam: 'التَّذْكَرَة', hic: 'التَّذْكَرَة', kor: 'التَّذْكَرَة', irk: 'التَّذْكَرَة', mag: 'الوَرْقَة' } },
                { tr: 'Bavul', ar: 'الحَقيبَة',
                  lh: { mis: 'الشَّنْطَة', sam: 'الشَّنْتا', hic: 'الشَّنْطَة', kor: 'الجُنْطَة', irk: 'الجُنْطَة', mag: 'الساك' } },
                { tr: 'Yolculuk / gezi', ar: 'الرِّحْلَة' },
                { tr: 'Turist', ar: 'السّائِح' },
                { tr: 'Müze', ar: 'المُتْحَف' },
                { tr: 'Deniz', ar: 'البَحْر' },
                { tr: 'Rezervasyon', ar: 'الحَجْز' }
            ],

            sentence: [
                { words: [
                    { tr: 'Yaz tatilinde', order: 2, ar: 'في العُطْلَةِ الصَّيْفِيَّةِ.',
                  lh: { mis: 'في الأَجازَة الصَّيْفي.', sam: 'بِالعُطْلِة الصَّيْفِيِّة.', hic: 'في الإِجازَة الصَّيْفِيَّة.', kor: 'في الإِجازَة الصَّيْفِيَّة.', irk: 'بِالعُطْلَة الصَّيْفِيَّة.', mag: 'فْالعُطْلَة دْيال الصّيف.' } },
                    { tr: 'seyahat ederim', order: 1, ar: 'أُسافِرُ',
                  lh: { mis: 'بَسافِر', sam: 'بْسافِر', hic: 'أَسافِر', kor: 'أَسافِر', irk: 'أَسافِر', mag: 'كَنْسافَر' } }
                ] },
                { words: [
                    { tr: 'Uçak', order: 1, ar: 'الطّائِرَةُ',
                  lh: { mis: 'الطَّيّارَة', sam: 'الطَّيّارَة', hic: 'الطَّيّارَة', kor: 'الطَّيّارَة', irk: 'الطَّيّارَة', mag: 'الطّيّارَة' } },
                    { tr: 'sabah kalkıyor.', order: 2, ar: 'تُقْلِعُ صَباحًا.',
                  lh: { mis: 'بِتْقوم الصُّبْح.', sam: 'بِتْقَلِّع الصُّبِح.', hic: 'تْقَلِّع الصُّبْح.', kor: 'تْقَلِّع الصُّبْح.', irk: 'تْقَلِّع الصُّبُح.', mag: 'كَتْقْلَع فْالصْباح.' } }
                ] },
                { words: [
                    { tr: 'Otelde', order: 2, ar: 'في الفُنْدُقِ',
                  lh: { mis: 'في الفُنْدُق', sam: 'بِالأوتيل', hic: 'في الفُنْدُق', kor: 'في الفُنْدُق', irk: 'بِالفُنْدُق', mag: 'فْالأوطيل' } },
                    { tr: 'bir oda', order: 3, ar: 'غُرْفَةً.',
                  lh: { mis: 'أوضَة.', sam: 'غُرْفِة.', hic: 'غُرْفَة.', kor: 'غُرْفَة.', irk: 'غُرْفَة.', mag: 'بيت.' } },
                    { tr: 'rezerve ettim.', order: 1, ar: 'حَجَزْتُ',
                  lh: { mis: 'حَجَزْت', sam: 'حَجَزِت', hic: 'حَجَزْت', kor: 'حَجَزْت', irk: 'حَجَزِت', mag: 'حْجَزْت' } }
                ] },
                { words: [
                    { tr: 'Pasaportum', order: 1, ar: 'جَوازُ سَفَري',
                  lh: { mis: 'باسْبورْتي', sam: 'جَواز سَفَري', hic: 'جَواز سَفَري', kor: 'جَواز سَفَري', irk: 'باسْبورْتي', mag: 'الباسْبور دْيالي' } },
                    { tr: 'çantamda.', order: 2, ar: 'في حَقيبَتي.',
                  lh: { mis: 'في الشَّنْطَة.', sam: 'بِالشَّنْتا.', hic: 'في الشَّنْطَة.', kor: 'في الجُنْطَة.', irk: 'بِالجُنْطَة.', mag: 'فْالساك.' } }
                ] },
                { words: [
                    { tr: 'Müzeyi', order: 2, ar: 'المُتْحَفَ.',
                  lh: { mis: 'المَتْحَف.', sam: 'المَتْحَف.', hic: 'المَتْحَف.', kor: 'المَتْحَف.', irk: 'المَتْحَف.', mag: 'المَتْحَف.' } },
                    { tr: 'ziyaret ettik.', order: 1, ar: 'زُرْنا',
                  lh: { mis: 'زُرْنا', sam: 'زُرْنا', hic: 'زُرْنا', kor: 'زُرْنا', irk: 'زِرْنا', mag: 'زْرْنا' } }
                ] },
                { words: [
                    { tr: 'Bu şehir', order: 1, ar: 'هٰذِهِ المَدينَةُ',
                  lh: { mis: 'المَدينَة دي', sam: 'هَالمَدينِة', hic: 'هٰذِهِ المَدينَة', kor: 'هٰذِهِ المَدينَة', irk: 'هَاي المَدينَة', mag: 'هاد المْدينَة' } },
                    { tr: 'turistleri çekiyor.', order: 2, ar: 'تَجْذِبُ السُّيّاحَ.',
                  lh: { mis: 'بِتِجْذِب السُّيّاح.', sam: 'بِتِجْذِب السُّيّاح.', hic: 'تِجْذِب السُّيّاح.', kor: 'تِجْذِب السُّيّاح.', irk: 'تِجْذِب السُّيّاح.', mag: 'كَتْجْذَب السّْياح.' } }
                ] },
                { words: [
                    { tr: 'Denizin kıyısında', order: 2, ar: 'عَلى شاطِئِ البَحْرِ.',
                  lh: { mis: 'عَلى شَطّ البَحْر.', sam: 'عَ شَطّ البَحِر.', hic: 'عَلى شاطِئ البَحْر.', kor: 'عَلى شاطِئ البَحْر.', irk: 'عَلى شَطّ البَحَر.', mag: 'عْلى شاطئ البْحَر.' } },
                    { tr: 'yürüdük', order: 1, ar: 'مَشَيْنا',
                  lh: { mis: 'مِشينا', sam: 'مْشينا', hic: 'مِشينا', kor: 'مِشينا', irk: 'مْشينا', mag: 'تْمْشينا' } }
                ] },
                { words: [
                    { tr: 'Yolculuk', order: 1, ar: 'الرِّحْلَةُ',
                  lh: { mis: 'الرِّحْلَة', sam: 'الرِّحْلِة', hic: 'الرِّحْلَة', kor: 'الرِّحْلَة', irk: 'الرِّحْلَة', mag: 'الرِّحْلَة' } },
                    { tr: 'çok güzeldi.', order: 2, ar: 'كانَتْ جَميلَةً جِدًّا.',
                  lh: { mis: 'كانِت حِلْوَة أَوي.', sam: 'كانِت كْتير حِلْوِة.', hic: 'كانَت حِلْوَة مَرَّة.', kor: 'كانَت حِلْوَة وايِد.', irk: 'كانَت حِلْوَة كُلِّش.', mag: 'كانَت زْوينَة بِزّاف.' } }
                ] }
            ],
            dialog: [
                {
                    p1: [
                        { tr: 'Bu yaz', order: 1, ar: 'إِلى أَيْنَ تُسافِرُ',
                  lh: { mis: 'هَتْسافِر فين', sam: 'لَوين رَح تْسافِر', hic: 'وين بْتْسافِر', kor: 'وين بْتْسافِر', irk: 'لَوين راح تْسافِر', mag: 'لْفين غادي تْسافَر' } },
                        { tr: 'nereye seyahat edeceksin?', order: 2, ar: 'هٰذا الصَّيْفَ؟',
                  lh: { mis: 'الصِّيْف دَه؟', sam: 'هَالصّيْف؟', hic: 'هٰذا الصَّيْف؟', kor: 'هٰذا الصَّيْف؟', irk: 'هٰذا الصّيْف؟', mag: 'هاد الصّيف؟' } }
                    ],
                    p2: [
                        { tr: 'Mısır\'a,', order: 1, ar: 'إِلى مِصْرَ،',
                  lh: { mis: 'لِمَصْر،', sam: 'عَ مِصِر،', hic: 'لِمِصْر،', kor: 'لِمِصْر،', irk: 'لِمِصِر،', mag: 'لْمَصْر،' } },
                        { tr: 'bir hafta kalacağım.', order: 2, ar: 'سَأَبْقى أُسْبوعًا.',
                  lh: { mis: 'هَقْعُد أُسْبوع.', sam: 'رَح ضَلّ جُمْعَة.', hic: 'بَقْعُد أُسْبوع.', kor: 'بَقْعُد أُسْبوع.', irk: 'راح أَبْقى أُسْبوع.', mag: 'غادي نْبْقى سيمانَة.' } }
                    ]
                },
                {
                    p1: [
                        { tr: 'Otelde', order: 1, ar: 'هَلْ حَجَزْتَ',
                  lh: { mis: 'حَجَزْت', sam: 'حَجَزِت', hic: 'حَجَزْت', kor: 'حَجَزْت', irk: 'حَجَزِت', mag: 'حْجَزْتي' } },
                        { tr: 'rezervasyon yaptın mı?', order: 2, ar: 'في الفُنْدُقِ؟',
                  lh: { mis: 'في الفُنْدُق؟', sam: 'بِالأوتيل؟', hic: 'في الفُنْدُق؟', kor: 'في الفُنْدُق؟', irk: 'بِالفُنْدُق؟', mag: 'فْالأوطيل؟' } }
                    ],
                    p2: [
                        { tr: 'Evet,', order: 1, ar: 'نَعَمْ،',
                  lh: { mis: 'أَيْوَه،', sam: 'أَيْ،', hic: 'أَيْوَه،', kor: 'إِي،', irk: 'إي،', mag: 'إيه،' } },
                        { tr: 'bir oda rezerve ettim.', order: 2, ar: 'حَجَزْتُ غُرْفَةً.',
                  lh: { mis: 'حَجَزْت أوضَة.', sam: 'حَجَزِت غُرْفِة.', hic: 'حَجَزْت غُرْفَة.', kor: 'حَجَزْت غُرْفَة.', irk: 'حَجَزِت غُرْفَة.', mag: 'حْجَزْت بيت.' } }
                    ]
                },
                {
                    p1: [
                        { tr: 'Pasaportun', order: 1, ar: 'أَيْنَ',
                  lh: { mis: 'فين', sam: 'وين', hic: 'وين', kor: 'وين', irk: 'وين', mag: 'فين' } },
                        { tr: 'nerede?', order: 2, ar: 'جَوازُ سَفَرِكَ؟',
                  lh: { mis: 'باسْبورْتَك؟', sam: 'جَواز سَفَرَك؟', hic: 'جَواز سَفَرَك؟', kor: 'جَواز سَفَرَك؟', irk: 'باسْبورْتَك؟', mag: 'الباسْبور دْيالَك؟' } }
                    ],
                    p2: [
                        { tr: 'Bavulumda,', order: 1, ar: 'في حَقيبَتي،',
                  lh: { mis: 'في الشَّنْطَة،', sam: 'بِالشَّنْتا،', hic: 'في الشَّنْطَة،', kor: 'في الجُنْطَة،', irk: 'بِالجُنْطَة،', mag: 'فْالساك،' } },
                        { tr: 'biletle birlikte.', order: 2, ar: 'مَعَ التَّذْكِرَةِ.',
                  lh: { mis: 'مَعَ التَّذْكَرَة.', sam: 'مَعَ التَّذْكَرَة.', hic: 'مَعَ التَّذْكَرَة.', kor: 'مَعَ التَّذْكَرَة.', irk: 'وِيَّ التَّذْكَرَة.', mag: 'مْعَ الوَرْقَة.' } }
                    ]
                },
                {
                    p1: [
                        { tr: 'Uçak', order: 1, ar: 'مَتى تُقْلِعُ',
                  lh: { mis: 'إِمْتى هَتْقوم', sam: 'إيمْتى بِتْقَلِّع', hic: 'مَتى تْقَلِّع', kor: 'مَتى تْقَلِّع', irk: 'شْوَكِت تْقَلِّع', mag: 'إيمْتى كَتْقْلَع' } },
                        { tr: 'ne zaman kalkıyor?', order: 2, ar: 'الطّائِرَةُ؟',
                  lh: { mis: 'الطَّيّارَة؟', sam: 'الطَّيّارَة؟', hic: 'الطَّيّارَة؟', kor: 'الطَّيّارَة؟', irk: 'الطَّيّارَة؟', mag: 'الطّيّارَة؟' } }
                    ],
                    p2: [
                        { tr: 'Sabah', order: 1, ar: 'صَباحًا،',
                  lh: { mis: 'الصُّبْح،', sam: 'الصُّبِح،', hic: 'الصُّبْح،', kor: 'الصُّبْح،', irk: 'الصُّبُح،', mag: 'فْالصْباح،' } },
                        { tr: 'saat yedide.', order: 2, ar: 'في السّاعَةِ السّابِعَةِ.',
                  lh: { mis: 'السّاعَة سَبْعَة.', sam: 'السّاعَة سَبْعَة.', hic: 'السّاعَة سَبْعَة.', kor: 'السّاعَة سَبْعَة.', irk: 'السّاعَة سَبْعَة.', mag: 'فْالسّاعَة سَبْعَة.' } }
                    ]
                }
            ]
        },
        {
            id: 'spor', grup: 'genel',
            ad: 'Spor', ar: 'الرِّياضَة',

            words: [
                { tr: 'Spor', ar: 'الرِّياضَة' },
                { tr: 'Futbol', ar: 'كُرَةُ القَدَمِ',
                  lh: { mis: 'الكورَة', sam: 'الطّابِة', hic: 'الكورَة', kor: 'الكورَة', irk: 'الطوبَة', mag: 'الكورَة' } },
                { tr: 'Takım', ar: 'الفَريق' },
                { tr: 'Oyuncu', ar: 'اللاعِب' },
                { tr: 'Maç', ar: 'المُباراة',
                  lh: { mis: 'الماتْش', sam: 'المَتْش', hic: 'المُباراة', kor: 'المُباراة', irk: 'المُباراة', mag: 'الماتْش' } },
                { tr: 'Stadyum', ar: 'المَلْعَب' },
                { tr: 'Antrenman', ar: 'التَّدْريب' },
                { tr: 'Kazanmak', ar: 'الفَوْز' },
                { tr: 'Kaybetmek', ar: 'الخَسارَة' },
                { tr: 'Yüzme', ar: 'السِّباحَة' },
                { tr: 'Koşu', ar: 'الجَرْي' },
                { tr: 'Şampiyon', ar: 'البَطَل' }
            ],

            sentence: [
                { words: [
                    { tr: 'Spor', order: 1, ar: 'الرِّياضَةُ',
                  lh: { mis: 'الرِّياضَة', sam: 'الرِّياضَة', hic: 'الرِّياضَة', kor: 'الرِّياضَة', irk: 'الرِّياضَة', mag: 'الرِّياضَة' } },
                    { tr: 'bedeni güçlendirir.', order: 2, ar: 'تُقَوّي الجِسْمَ.',
                  lh: { mis: 'بِتْقَوّي الجِسْم.', sam: 'بِتْقَوّي الجِسِم.', hic: 'تْقَوّي الجِسْم.', kor: 'تْقَوّي الجِسْم.', irk: 'تْقَوّي الجِسِم.', mag: 'كَتْقَوّي الجْسْم.' } }
                ] },
                { words: [
                    { tr: 'Kardeşim', order: 1, ar: 'أَخي',
                  lh: { mis: 'أَخويا', sam: 'أَخي', hic: 'أَخوي', kor: 'أَخوي', irk: 'أَخويَ', mag: 'خويا' } },
                    { tr: 'futbol oynuyor.', order: 2, ar: 'يَلْعَبُ كُرَةَ القَدَمِ.',
                  lh: { mis: 'بْيِلْعَب كورَة.', sam: 'بْيِلْعَب طابِة.', hic: 'يِلْعَب كورَة.', kor: 'يِلْعَب كورَة.', irk: 'يِلْعَب طوبَة.', mag: 'كَيْلْعَب الكورَة.' } }
                ] },
                { words: [
                    { tr: 'Takımımız', order: 1, ar: 'فَريقُنا',
                  lh: { mis: 'فَريقْنا', sam: 'فَريقْنا', hic: 'فَريقْنا', kor: 'فَريقْنا', irk: 'فَريقْنا', mag: 'الفْريق دْيالْنا' } },
                    { tr: 'maçı kazandı.', order: 2, ar: 'فازَ بِالمُباراةِ.',
                  lh: { mis: 'كِسِب الماتْش.', sam: 'رِبِح المَتْش.', hic: 'فاز بِالمُباراة.', kor: 'فاز بِالمُباراة.', irk: 'فاز بِالمُباراة.', mag: 'رْبَح الماتْش.' } }
                ] },
                { words: [
                    { tr: 'Her sabah', order: 2, ar: 'كُلَّ صَباحٍ.',
                  lh: { mis: 'كُلّ يوم الصُّبْح.', sam: 'كُلّ يوم الصُّبِح.', hic: 'كُلّ صَباح.', kor: 'كُلّ صُبْح.', irk: 'كُلّ يوم الصُّبُح.', mag: 'كُلّ صْباح.' } },
                    { tr: 'parkta koşuyorum', order: 1, ar: 'أَجْري في الحَديقَةِ',
                  lh: { mis: 'بَجْري في الجِنينَة', sam: 'بِرْكُض بِالحَديقَة', hic: 'أَجْري في الحَديقَة', kor: 'أَجْري في الحَديقَة', irk: 'أَركُض بِالحَديقَة', mag: 'كَنْجْري فْالعَرْصَة' } }
                ] },
                { words: [
                    { tr: 'Oyuncular', order: 1, ar: 'اللاعِبونَ',
                  lh: { mis: 'اللاعِبين', sam: 'اللاعِبين', hic: 'اللاعِبين', kor: 'اللاعِبين', irk: 'اللاعِبين', mag: 'اللاعْبين' } },
                    { tr: 'sahaya girdiler.', order: 2, ar: 'دَخَلوا المَلْعَبَ.',
                  lh: { mis: 'دَخَلوا المَلْعَب.', sam: 'فاتوا عَالمَلْعَب.', hic: 'دَخَلوا المَلْعَب.', kor: 'دَخَلوا المَلْعَب.', irk: 'دَخْلوا المَلْعَب.', mag: 'دْخْلوا لْلمَلْعَب.' } }
                ] },
                { words: [
                    { tr: 'Yüzmeyi', order: 2, ar: 'السِّباحَةَ',
                  lh: { mis: 'العوم', sam: 'السِّباحَة', hic: 'السِّباحَة', kor: 'السِّباحَة', irk: 'السِّباحَة', mag: 'العومَة' } },
                    { tr: 'çok seviyorum.', order: 1, ar: 'أُحِبُّ',
                  lh: { mis: 'بَحِبّ', sam: 'بْحِبّ', hic: 'أُحِبّ', kor: 'أُحِبّ', irk: 'أَحِبّ', mag: 'كَنْبْغي' } },
                    { tr: 'çok.', order: 3, ar: 'كَثيرًا.',
                  lh: { mis: 'أَوي.', sam: 'كْتير.', hic: 'مَرَّة.', kor: 'وايِد.', irk: 'كُلِّش.', mag: 'بِزّاف.' } }
                ] },
                { words: [
                    { tr: 'Antrenman', order: 1, ar: 'التَّدْريبُ',
                  lh: { mis: 'التَّدْريب', sam: 'التَّدْريب', hic: 'التَّدْريب', kor: 'التَّدْريب', irk: 'التَّدْريب', mag: 'التَّدْريب' } },
                    { tr: 'her gün sürüyor.', order: 2, ar: 'مُسْتَمِرٌّ كُلَّ يَوْمٍ.',
                  lh: { mis: 'مُسْتَمِرّ كُلّ يوم.', sam: 'مُسْتَمِرّ كُلّ يوم.', hic: 'مُسْتَمِرّ كُلّ يوم.', kor: 'مُسْتَمِرّ كُلّ يوم.', irk: 'مُسْتَمِرّ كُلّ يوم.', mag: 'مُسْتَمِرّ كُلّ نْهار.' } }
                ] },
                { words: [
                    { tr: 'Şampiyon', order: 1, ar: 'البَطَلُ',
                  lh: { mis: 'البَطَل', sam: 'البَطَل', hic: 'البَطَل', kor: 'البَطَل', irk: 'البَطَل', mag: 'البْطَل' } },
                    { tr: 'kupayı aldı.', order: 2, ar: 'أَخَذَ الكَأْسَ.',
                  lh: { mis: 'خَد الكاس.', sam: 'خَد الكاس.', hic: 'أَخَذ الكاس.', kor: 'أَخَذ الكاس.', irk: 'خِذَ الكاس.', mag: 'دّا الكاس.' } }
                ] }
            ],
            dialog: [
                {
                    p1: [
                        { tr: 'Futbol', order: 1, ar: 'هَلْ تَلْعَبُ',
                  lh: { mis: 'بِتِلْعَب', sam: 'بْتِلْعَب', hic: 'تِلْعَب', kor: 'تِلْعَب', irk: 'تِلْعَب', mag: 'كَتْلْعَب' } },
                        { tr: 'oynar mısın?', order: 2, ar: 'كُرَةَ القَدَمِ؟',
                  lh: { mis: 'كورَة؟', sam: 'طابِة؟', hic: 'كورَة؟', kor: 'كورَة؟', irk: 'طوبَة؟', mag: 'الكورَة؟' } }
                    ],
                    p2: [
                        { tr: 'Evet,', order: 1, ar: 'نَعَمْ،',
                  lh: { mis: 'أَيْوَه،', sam: 'أَيْ،', hic: 'أَيْوَه،', kor: 'إِي،', irk: 'إي،', mag: 'إيه،' } },
                        { tr: 'her cuma oynarım.', order: 2, ar: 'أَلْعَبُ كُلَّ جُمُعَةٍ.',
                  lh: { mis: 'بَلْعَب كُلّ جُمْعَة.', sam: 'بِلْعَب كُلّ جُمْعَة.', hic: 'أَلْعَب كُلّ جُمْعَة.', kor: 'أَلْعَب كُلّ جُمْعَة.', irk: 'أَلْعَب كُلّ جُمْعَة.', mag: 'كَنْلْعَب كُلّ جْمْعَة.' } }
                    ]
                },
                {
                    p1: [
                        { tr: 'Takımın', order: 1, ar: 'هَلْ فازَ',
                  lh: { mis: 'كِسِب', sam: 'رِبِح', hic: 'فاز', kor: 'فاز', irk: 'فاز', mag: 'رْبَح' } },
                        { tr: 'kazandı mı?', order: 2, ar: 'فَريقُكَ؟',
                  lh: { mis: 'فَريقَك؟', sam: 'فَريقَك؟', hic: 'فَريقَك؟', kor: 'فَريقَك؟', irk: 'فَريقَك؟', mag: 'الفْريق دْيالَك؟' } }
                    ],
                    p2: [
                        { tr: 'Evet,', order: 1, ar: 'نَعَمْ،',
                  lh: { mis: 'أَيْوَه،', sam: 'أَيْ،', hic: 'أَيْوَه،', kor: 'إِي،', irk: 'إي،', mag: 'إيه،' } },
                        { tr: 'maçı kazandı.', order: 2, ar: 'فازَ بِالمُباراةِ.',
                  lh: { mis: 'كِسِب الماتْش.', sam: 'رِبِح المَتْش.', hic: 'فاز بِالمُباراة.', kor: 'فاز بِالمُباراة.', irk: 'فاز بِالمُباراة.', mag: 'رْبَح الماتْش.' } }
                    ]
                },
                {
                    p1: [
                        { tr: 'Her sabah', order: 1, ar: 'أَجْري',
                  lh: { mis: 'بَجْري', sam: 'بِرْكُض', hic: 'أَجْري', kor: 'أَجْري', irk: 'أَركُض', mag: 'كَنْجْري' } },
                        { tr: 'koşuyorum.', order: 2, ar: 'كُلَّ صَباحٍ.',
                  lh: { mis: 'كُلّ يوم الصُّبْح.', sam: 'كُلّ يوم الصُّبِح.', hic: 'كُلّ صَباح.', kor: 'كُلّ صُبْح.', irk: 'كُلّ يوم الصُّبُح.', mag: 'كُلّ صْباح.' } }
                    ],
                    p2: [
                        { tr: 'Spor', order: 1, ar: 'الرِّياضَةُ',
                  lh: { mis: 'الرِّياضَة', sam: 'الرِّياضَة', hic: 'الرِّياضَة', kor: 'الرِّياضَة', irk: 'الرِّياضَة', mag: 'الرِّياضَة' } },
                        { tr: 'bedeni güçlendirir.', order: 2, ar: 'تُقَوّي الجِسْمَ.',
                  lh: { mis: 'بِتْقَوّي الجِسْم.', sam: 'بِتْقَوّي الجِسِم.', hic: 'تْقَوّي الجِسْم.', kor: 'تْقَوّي الجِسْم.', irk: 'تْقَوّي الجِسِم.', mag: 'كَتْقَوّي الجْسْم.' } }
                    ]
                },
                {
                    p1: [
                        { tr: 'Antrenman', order: 1, ar: 'مَتى يَبْدَأُ',
                  lh: { mis: 'إِمْتى هَيِبْدَأ', sam: 'إيمْتى بْيِبْدا', hic: 'مَتى يِبْدَأ', kor: 'مَتى يِبْدَأ', irk: 'شْوَكِت يِبْدي', mag: 'إيمْتى غادي يْبْدا' } },
                        { tr: 'ne zaman başlıyor?', order: 2, ar: 'التَّدْريبُ؟',
                  lh: { mis: 'التَّدْريب؟', sam: 'التَّدْريب؟', hic: 'التَّدْريب؟', kor: 'التَّدْريب؟', irk: 'التَّدْريب؟', mag: 'التَّدْريب؟' } }
                    ],
                    p2: [
                        { tr: 'Stadyumda', order: 1, ar: 'في المَلْعَبِ',
                  lh: { mis: 'في المَلْعَب', sam: 'بِالمَلْعَب', hic: 'في المَلْعَب', kor: 'في المَلْعَب', irk: 'بِالمَلْعَب', mag: 'فْالمَلْعَب' } },
                        { tr: 'saat beşte.', order: 2, ar: 'في السّاعَةِ الخامِسَةِ.',
                  lh: { mis: 'السّاعَة خَمْسَة.', sam: 'السّاعَة خَمْسِة.', hic: 'السّاعَة خَمْسَة.', kor: 'السّاعَة خَمْسَة.', irk: 'السّاعَة خَمْسَة.', mag: 'فْالسّاعَة خَمْسَة.' } }
                    ]
                }
            ]
        },
        {
            id: 'yemek', grup: 'genel',
            ad: 'Yemek & Mutfak', ar: 'الطَّعام والمَطْبَخ',

            words: [
                { tr: 'Yemek', ar: 'الطَّعام',
                  lh: { mis: 'الأَكْل', sam: 'الأَكِل', hic: 'الأَكْل', kor: 'الأَكِل', irk: 'الأَكِل', mag: 'الماكْلَة' } },
                { tr: 'Ekmek', ar: 'الخُبْز',
                  lh: { mis: 'العيش', sam: 'الخُبِز', hic: 'العيش', kor: 'الخُبِز', irk: 'الخُبُز', mag: 'الخُبْز' } },
                { tr: 'Su', ar: 'الماء',
                  lh: { mis: 'المَيَّة', sam: 'المَيّ', hic: 'المَيَّة', kor: 'الماي', irk: 'المايّ', mag: 'الما' } },
                { tr: 'Et', ar: 'اللَّحْم' },
                { tr: 'Pirinç', ar: 'الأَرُزّ',
                  lh: { mis: 'الرُّزّ', sam: 'الرِّزّ', hic: 'الرُّزّ', kor: 'العيش', irk: 'التِّمَّن', mag: 'الروز' } },
                { tr: 'Sebze', ar: 'الخُضار' },
                { tr: 'Meyve', ar: 'الفاكِهَة',
                  lh: { mis: 'الفاكْهَة', sam: 'الفَواكِه', hic: 'الفَواكِه', kor: 'الفَواكِه', irk: 'الفاكْهَة', mag: 'الفاكْيَة' } },
                { tr: 'Çay', ar: 'الشّاي' },
                { tr: 'Kahve', ar: 'القَهْوَة',
                  lh: { mis: 'القَهْوَة', sam: 'القَهْوِة', hic: 'القَهْوَة', kor: 'القَهْوَة', irk: 'الگَهْوَة', mag: 'القَهْوَة' } },
                { tr: 'Tatlı', ar: 'الحَلْوى',
                  lh: { mis: 'الحَلَويّات', sam: 'الحِلِو', hic: 'الحَلا', kor: 'الحَلا', irk: 'الحِلُو', mag: 'الحْلو' } },
                { tr: 'Lezzetli', ar: 'لَذيذٌ',
                  lh: { mis: 'حِلْو أَوي', sam: 'طَيِّب', hic: 'لَذيذ', kor: 'زين', irk: 'لَذيذ', mag: 'بْنين' } },
                { tr: 'Acıktım', ar: 'أَنا جائِعٌ',
                  lh: { mis: 'أَنا جَعان', sam: 'أَنا جوعان', hic: 'أَنا جَوْعان', kor: 'أَنا يوعان', irk: 'آني جوعان', mag: 'أَنا فيَّ الجوع' } }
            ],

            sentence: [
                { words: [
                    { tr: 'Annem', order: 1, ar: 'أُمّي',
                  lh: { mis: 'أُمّي', sam: 'إِمّي', hic: 'أُمّي', kor: 'أُمّي', irk: 'أُمّي', mag: 'يُمّا' } },
                    { tr: 'lezzetli yemek pişiriyor.', order: 2, ar: 'تَطْبُخُ طَعامًا لَذيذًا.',
                  lh: { mis: 'بِتِطْبُخ أَكْل حِلْو.', sam: 'بِتِطْبُخ أَكِل طَيِّب.', hic: 'تِطْبُخ أَكْل لَذيذ.', kor: 'تِطْبُخ أَكِل زين.', irk: 'تِطْبُخ أَكِل لَذيذ.', mag: 'كَتْطَيَّب ماكْلَة بْنينَة.' } }
                ] },
                { words: [
                    { tr: 'Sabah', order: 2, ar: 'صَباحًا.',
                  lh: { mis: 'الصُّبْح.', sam: 'الصُّبِح.', hic: 'الصُّبْح.', kor: 'الصُّبْح.', irk: 'الصُّبُح.', mag: 'فْالصْباح.' } },
                    { tr: 'ekmek ve peynir yerim.', order: 1, ar: 'آكُلُ الخُبْزَ وَالجُبْنَ',
                  lh: { mis: 'باكُل عيش وَجِبْنَة', sam: 'بآكُل خُبِز وَجِبْنِة', hic: 'آكُل عيش وَجِبْنَة', kor: 'آكِل خُبِز وَجِبْنَة', irk: 'آكُل خُبُز وَجِبِن', mag: 'كَناكُل خُبْز وَجْبَن' } }
                ] },
                { words: [
                    { tr: 'Bir bardak', order: 2, ar: 'كوبَ ماءٍ.',
                  lh: { mis: 'كوبّايِة مَيَّة.', sam: 'كاسِة مَيّ.', hic: 'كوب مَيَّة.', kor: 'كوب ماي.', irk: 'گلاص مايّ.', mag: 'كاس دْيال الما.' } },
                    { tr: 'su içtim.', order: 1, ar: 'شَرِبْتُ',
                  lh: { mis: 'شِرِبْت', sam: 'شْرِبْت', hic: 'شِرِبْت', kor: 'شِرَبْت', irk: 'شِرَبِت', mag: 'شْرَبْت' } }
                ] },
                { words: [
                    { tr: 'Bu yemek', order: 1, ar: 'هٰذا الطَّعامُ',
                  lh: { mis: 'الأَكْل دَه', sam: 'هَالأَكِل', hic: 'هٰذا الأَكْل', kor: 'هٰذا الأَكِل', irk: 'هٰذا الأَكِل', mag: 'هاد الماكْلَة' } },
                    { tr: 'çok lezzetli.', order: 2, ar: 'لَذيذٌ جِدًّا.',
                  lh: { mis: 'حِلْو أَوي.', sam: 'كْتير طَيِّب.', hic: 'لَذيذ مَرَّة.', kor: 'زين وايِد.', irk: 'لَذيذ كُلِّش.', mag: 'بْنينَة بِزّاف.' } }
                ] },
                { words: [
                    { tr: 'Öğle yemeğini', order: 2, ar: 'الغَداءَ',
                  lh: { mis: 'الغَدا', sam: 'الغَدا', hic: 'الغَدا', kor: 'الغَدا', irk: 'الغَدا', mag: 'الغْدا' } },
                    { tr: 'ailemle yerim.', order: 1, ar: 'أَتَناوَلُ',
                  lh: { mis: 'باكُل', sam: 'بآكُل', hic: 'آكُل', kor: 'آكِل', irk: 'آكُل', mag: 'كَناكُل' } },
                    { tr: 'ailemle.', order: 3, ar: 'مَعَ أُسْرَتي.',
                  lh: { mis: 'مَعَ عيلْتي.', sam: 'مَعَ أَهْلي.', hic: 'مَعَ أَهْلي.', kor: 'مَعَ أَهْلي.', irk: 'وِيَّ أَهْلي.', mag: 'مْعَ العائِلَة دْيالي.' } }
                ] },
                { words: [
                    { tr: 'Meyve', order: 1, ar: 'الفاكِهَةُ',
                  lh: { mis: 'الفاكْهَة', sam: 'الفَواكِه', hic: 'الفَواكِه', kor: 'الفَواكِه', irk: 'الفاكْهَة', mag: 'الفاكْيَة' } },
                    { tr: 'sağlık için faydalıdır.', order: 2, ar: 'مُفيدَةٌ لِلصِّحَّةِ.',
                  lh: { mis: 'مُفيدَة لِلصِّحَّة.', sam: 'مْفيدِة لِلصِّحَّة.', hic: 'مُفيدَة لِلصِّحَّة.', kor: 'مُفيدَة لِلصِّحَّة.', irk: 'مُفيدَة لِلصِّحَّة.', mag: 'مْفيدَة لِلصِّحَّة.' } }
                ] },
                { words: [
                    { tr: 'Acıktım,', order: 1, ar: 'أَنا جائِعٌ،',
                  lh: { mis: 'أَنا جَعان،', sam: 'أَنا جوعان،', hic: 'أَنا جَوْعان،', kor: 'أَنا يوعان،', irk: 'آني جوعان،', mag: 'أَنا فيَّ الجوع،' } },
                    { tr: 'yiyecek bir şey var mı?', order: 2, ar: 'هَلْ يوجَدُ طَعامٌ؟',
                  lh: { mis: 'في أَكْل؟', sam: 'في أَكِل؟', hic: 'في أَكْل؟', kor: 'في أَكِل؟', irk: 'أَكو أَكِل؟', mag: 'كايْن شي ماكْلَة؟' } }
                ] },
                { words: [
                    { tr: 'Bize', order: 2, ar: 'لَنا',
                  lh: { mis: 'لينا', sam: 'إِلْنا', hic: 'لَنا', kor: 'لَنا', irk: 'إِلْنا', mag: 'لينا' } },
                    { tr: 'bir fincan kahve hazırla.', order: 1, ar: 'أَعِدَّ',
                  lh: { mis: 'اِعْمِل', sam: 'اِعْمِل', hic: 'سَوّي', kor: 'سَوّي', irk: 'سَوّي', mag: 'دير' } },
                    { tr: 'kahve.', order: 3, ar: 'فِنْجانَ قَهْوَةٍ.',
                  lh: { mis: 'فِنْجان قَهْوَة.', sam: 'فِنْجان قَهْوِة.', hic: 'فِنْجان قَهْوَة.', kor: 'فِنْيان قَهْوَة.', irk: 'فِنْجان گَهْوَة.', mag: 'كاس دْيال القَهْوَة.' } }
                ] }
            ],
            dialog: [
                {
                    p1: [
                        { tr: 'Acıktım,', order: 1, ar: 'أَنا جائِعٌ،',
                  lh: { mis: 'أَنا جَعان،', sam: 'أَنا جوعان،', hic: 'أَنا جَوْعان،', kor: 'أَنا يوعان،', irk: 'آني جوعان،', mag: 'أَنا فيَّ الجوع،' } },
                        { tr: 'yiyecek bir şey var mı?', order: 2, ar: 'هَلْ يوجَدُ طَعامٌ؟',
                  lh: { mis: 'في أَكْل؟', sam: 'في أَكِل؟', hic: 'في أَكْل؟', kor: 'في أَكِل؟', irk: 'أَكو أَكِل؟', mag: 'كايْن شي ماكْلَة؟' } }
                    ],
                    p2: [
                        { tr: 'Evet,', order: 1, ar: 'نَعَمْ،',
                  lh: { mis: 'أَيْوَه،', sam: 'أَيْ،', hic: 'أَيْوَه،', kor: 'إِي،', irk: 'إي،', mag: 'إيه،' } },
                        { tr: 'annem yemek pişirdi.', order: 2, ar: 'طَبَخَتْ أُمّي.',
                  lh: { mis: 'أُمّي طَبَخِت.', sam: 'إِمّي طَبْخِت.', hic: 'أُمّي طَبَخَت.', kor: 'أُمّي طَبَخَت.', irk: 'أُمّي طِبْخَت.', mag: 'يُمّا طَيّْبات.' } }
                    ]
                },
                {
                    p1: [
                        { tr: 'Bu yemek', order: 1, ar: 'هٰذا الطَّعامُ',
                  lh: { mis: 'الأَكْل دَه', sam: 'هَالأَكِل', hic: 'هٰذا الأَكْل', kor: 'هٰذا الأَكِل', irk: 'هٰذا الأَكِل', mag: 'هاد الماكْلَة' } },
                        { tr: 'çok lezzetli.', order: 2, ar: 'لَذيذٌ جِدًّا.',
                  lh: { mis: 'حِلْو أَوي.', sam: 'كْتير طَيِّب.', hic: 'لَذيذ مَرَّة.', kor: 'زين وايِد.', irk: 'لَذيذ كُلِّش.', mag: 'بْنينَة بِزّاف.' } }
                    ],
                    p2: [
                        { tr: 'Afiyet olsun,', order: 1, ar: 'بِالهَناءِ،',
                  lh: { mis: 'بِالهَنا،', sam: 'صَحْتين،', hic: 'بِالهَنا،', kor: 'بِالعافْيَة،', irk: 'بِالعافْيَة،', mag: 'بْصَحّْتَك،' } },
                        { tr: 'biraz daha al.', order: 2, ar: 'خُذْ قَليلًا آخَرَ.',
                  lh: { mis: 'خُد كَمان شْوَيَّة.', sam: 'خود كَمان شْوَيّ.', hic: 'خُذ كَمان شْوَيّ.', kor: 'خُذ بَعَد شْوَيّ.', irk: 'خُذ هَمّ شْوَيَّة.', mag: 'دّي شْوِيَّة أُخْرى.' } }
                    ]
                },
                {
                    p1: [
                        { tr: 'Ne içersin,', order: 1, ar: 'ماذا تَشْرَبُ،',
                  lh: { mis: 'هَتِشْرَب إيه،', sam: 'شو بِدَّك تِشْرَب،', hic: 'إيش تِشْرَب،', kor: 'شِنو تِشْرَب،', irk: 'شْتِشْرَب،', mag: 'شْنو غادي تْشْرَب،' } },
                        { tr: 'çay mı kahve mi?', order: 2, ar: 'شايًا أَمْ قَهْوَةً؟',
                  lh: { mis: 'شاي وَلّا قَهْوَة؟', sam: 'شاي وَلّا قَهْوِة؟', hic: 'شاي وَلّا قَهْوَة؟', kor: 'شاي وَلّا قَهْوَة؟', irk: 'چاي لو گَهْوَة؟', mag: 'أَتاي وَلّا قَهْوَة؟' } }
                    ],
                    p2: [
                        { tr: 'Bir fincan kahve', order: 1, ar: 'فِنْجانَ قَهْوَةٍ',
                  lh: { mis: 'فِنْجان قَهْوَة', sam: 'فِنْجان قَهْوِة', hic: 'فِنْجان قَهْوَة', kor: 'فِنْيان قَهْوَة', irk: 'فِنْجان گَهْوَة', mag: 'كاس دْيال القَهْوَة' } },
                        { tr: 'lütfen.', order: 2, ar: 'مِنْ فَضْلِكَ.',
                  lh: { mis: 'مِنْ فَضْلَك.', sam: 'بَلا زَحْمِة.', hic: 'لَوْ سَمَحْت.', kor: 'لَوْ سَمَحْت.', irk: 'بَلا زَحْمَة.', mag: 'عافاك.' } }
                    ]
                },
                {
                    p1: [
                        { tr: 'Kahvaltıda', order: 1, ar: 'ماذا تَأْكُلُ',
                  lh: { mis: 'بْتاكُل إيه', sam: 'شو بْتاكُل', hic: 'إيش تاكُل', kor: 'شِنو تاكِل', irk: 'شْتاكُل', mag: 'شْنو كَتاكُل' } },
                        { tr: 'ne yersin?', order: 2, ar: 'في الفُطورِ؟',
                  lh: { mis: 'في الفِطار؟', sam: 'عَالفْطور؟', hic: 'في الفُطور؟', kor: 'في الرّيوق؟', irk: 'بِالفُطور؟', mag: 'فْالفْطور؟' } }
                    ],
                    p2: [
                        { tr: 'Ekmek', order: 1, ar: 'آكُلُ الخُبْزَ',
                  lh: { mis: 'باكُل عيش', sam: 'بآكُل خُبِز', hic: 'آكُل عيش', kor: 'آكِل خُبِز', irk: 'آكُل خُبُز', mag: 'كَناكُل خُبْز' } },
                        { tr: 've peynir yerim.', order: 2, ar: 'وَالجُبْنَ.',
                  lh: { mis: 'وَجِبْنَة.', sam: 'وَجِبْنِة.', hic: 'وَجِبْنَة.', kor: 'وَجِبْنَة.', irk: 'وَجِبِن.', mag: 'وَجْبَن.' } }
                    ]
                }
            ]
        },
    ]
};

/* ------------------------------------------------------------
   OYNATICI SEÇİCİSİ
   Adres  muhadese.html?ders=alan_saglik  ise, "saglik" başlığının
   verisi window.data'ya yazılır. Liste modunda hiçbir şey yapmaz.
   ------------------------------------------------------------ */
(function () {
    var d = String(window.KIDEF_DERS || '');
    var e = /^alan_(.+)$/.exec(d);
    if (!e) return;
    var id = e[1], k = null, L = window.KIDEF_ALAN.konular;
    for (var i = 0; i < L.length; i++) if (L[i].id === id) { k = L[i]; break; }
    if (!k) return;
    window.data = {
        words:    k.words    || [],
        sentence: k.sentence || [],
        dialog:   k.dialog   || []
    };
    try { document.title = k.ad + ' — Alan Konuları'; } catch (_) {}
})();
