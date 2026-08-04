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
                { tr: 'Hastalık',    ar: 'المَرَض' },
                { tr: 'Hasta',       ar: 'المَريض' },
                { tr: 'Doktor',      ar: 'الطَّبيب' },
                { tr: 'Hastane',     ar: 'المُسْتَشْفى' },
                { tr: 'Eczane',      ar: 'الصَّيْدَلِيَّة' },
                { tr: 'İlaç',        ar: 'الدَّواء' },
                { tr: 'Ateş',        ar: 'الحَرارَة' },
                { tr: 'Baş ağrısı',  ar: 'صُداع' },
                { tr: 'Muayene',     ar: 'الفَحْص' },
                { tr: 'Tedavi',      ar: 'العِلاج' },
                { tr: 'Şifa',        ar: 'الشِّفاء' }
            ],

            sentence: [
                { words: [
                    { tr: 'Sağlık',       order: 1, ar: 'الصِّحَّةُ' },
                    { tr: 'büyük bir',    order: 2, ar: 'نِعْمَةٌ' },
                    { tr: 'nimettir.',    order: 3, ar: 'عَظيمَةٌ.' }
                ] },
                { words: [
                    { tr: 'Bugün',        order: 3, ar: 'اليَوْمَ.' },
                    { tr: 'kendimi',      order: 2, ar: 'بِخَيْرٍ' },
                    { tr: 'iyi hissetmiyorum.', order: 1, ar: 'لَسْتُ' }
                ] },
                { words: [
                    { tr: 'Başım',        order: 2, ar: 'رَأْسي.' },
                    { tr: 'ağrıyor.',     order: 1, ar: 'يُؤْلِمُني' }
                ] },
                { words: [
                    { tr: 'Doktora',      order: 2, ar: 'إِلى الطَّبيبِ.' },
                    { tr: 'gitmeliyim.',  order: 1, ar: 'يَجِبُ أَنْ أَذْهَبَ' }
                ] },
                { words: [
                    { tr: 'Doktor',       order: 1, ar: 'فَحَصَ' },
                    { tr: 'hastayı',      order: 2, ar: 'الطَّبيبُ' },
                    { tr: 'muayene etti.', order: 3, ar: 'المَريضَ.' }
                ] },
                { words: [
                    { tr: 'İlacı',        order: 2, ar: 'الدَّواءَ' },
                    { tr: 'günde üç kez', order: 3, ar: 'ثَلاثَ مَرّاتٍ في اليَوْمِ.' },
                    { tr: 'al.',          order: 1, ar: 'خُذِ' }
                ] },
                { words: [
                    { tr: 'Spor',         order: 2, ar: 'الرِّياضَةُ' },
                    { tr: 'bedeni',       order: 3, ar: 'الجِسْمَ.' },
                    { tr: 'güçlendirir.', order: 1, ar: 'تُقَوّي' }
                ] },
                { words: [
                    { tr: 'Allah',        order: 2, ar: 'اللّٰهُ' },
                    { tr: 'sana',         order: 3, ar: 'لَكَ.' },
                    { tr: 'şifa versin.', order: 1, ar: 'شَفاكَ' }
                ] }
            ],

            dialog: [
                {
                    p1: [
                        { tr: 'Neyin',    order: 2, ar: 'بِكَ' },
                        { tr: 'var?',     order: 1, ar: 'ماذا' },
                        { tr: 'kardeşim?', order: 3, ar: 'يا أَخي؟' }
                    ],
                    p2: [
                        { tr: 'Karnım',   order: 2, ar: 'بَطْني' },
                        { tr: 'ağrıyor',  order: 1, ar: 'يُؤْلِمُني' },
                        { tr: 've ateşim var.', order: 3, ar: 'وَعِنْدي حَرارَةٌ.' }
                    ]
                },
                {
                    p1: [
                        { tr: 'Doktora',  order: 2, ar: 'إِلى الطَّبيبِ؟' },
                        { tr: 'gittin mi?', order: 1, ar: 'هَلْ ذَهَبْتَ' }
                    ],
                    p2: [
                        { tr: 'Evet,',    order: 1, ar: 'نَعَمْ،' },
                        { tr: 'bana',     order: 3, ar: 'لي' },
                        { tr: 'bir ilaç', order: 4, ar: 'دَواءً.' },
                        { tr: 'yazdı.',   order: 2, ar: 'وَصَفَ' }
                    ]
                },
                {
                    p1: [
                        { tr: 'Allah',    order: 2, ar: 'اللّٰهُ,' },
                        { tr: 'şifa versin.', order: 1, ar: 'شَفاكَ' },
                        { tr: 'Dinlen.',  order: 3, ar: 'اِسْتَرِحْ.' }
                    ],
                    p2: [
                        { tr: 'Teşekkür ederim,', order: 1, ar: 'شُكْرًا لَكَ،' },
                        { tr: 'sen de',   order: 3, ar: 'أَنْتَ' },
                        { tr: 'sağlıklı ol.', order: 2, ar: 'دُمْتَ بِصِحَّةٍ يا' }
                    ]
                }
            ]
        },

        /* --- Diğer alanlar (içerik bekliyor) --- */
        { id: 'egitim',   grup: 'genel', ad: 'Eğitim',            ar: 'التَّعْليم',              words: [], sentence: [], dialog: [] },
        { id: 'tarih',    grup: 'genel', ad: 'Tarih',             ar: 'التّاريخ',               words: [], sentence: [], dialog: [] },
        { id: 'felsefe',  grup: 'genel', ad: 'Felsefe',           ar: 'الفَلْسَفَة',             words: [], sentence: [], dialog: [] },
        { id: 'din',      grup: 'genel', ad: 'Din',               ar: 'الدّين',                 words: [], sentence: [], dialog: [] },
        { id: 'bilim',    grup: 'genel', ad: 'Bilim & Teknoloji', ar: 'العِلْم والتِّقْنِيَة',    words: [], sentence: [], dialog: [] },
        { id: 'ekonomi',  grup: 'genel', ad: 'Ekonomi & Ticaret', ar: 'الاقْتِصاد والتِّجارَة',  words: [], sentence: [], dialog: [] },
        { id: 'hukuk',    grup: 'genel', ad: 'Hukuk',             ar: 'القانون',                words: [], sentence: [], dialog: [] },
        { id: 'siyaset',  grup: 'genel', ad: 'Siyaset & Medya',   ar: 'السِّياسَة والإعْلام',     words: [], sentence: [], dialog: [] },
        { id: 'edebiyat', grup: 'genel', ad: 'Edebiyat & Sanat',  ar: 'الأَدَب والفَنّ',         words: [], sentence: [], dialog: [] },
        { id: 'cevre',    grup: 'genel', ad: 'Çevre',             ar: 'البيئَة',                words: [], sentence: [], dialog: [] },
        { id: 'seyahat',  grup: 'genel', ad: 'Seyahat & Turizm',  ar: 'السَّفَر والسِّياحَة',     words: [], sentence: [], dialog: [] },
        { id: 'spor',     grup: 'genel', ad: 'Spor',              ar: 'الرِّياضَة',              words: [], sentence: [], dialog: [] },
        { id: 'yemek',    grup: 'genel', ad: 'Yemek & Mutfak',    ar: 'الطَّعام والمَطْبَخ',      words: [], sentence: [], dialog: [] }
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
