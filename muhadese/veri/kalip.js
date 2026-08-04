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
