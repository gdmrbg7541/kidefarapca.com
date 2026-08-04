/* 7_1 dersinin cümleleri/diyaloğu (ortak muhadese.html + simultane.js kullanır) */
window.data = {
sentence: [
    {
        words: [
            { tr: "Sabah", order: 2, ar: "في الصَّباح" },
            { tr: "erken", order: 3, ar: "مُبَكِّرًا." },
            { tr: "uyanırım.", order: 1, ar: "أَسْتَيْقِظُ" }
        ]
    },
    {
        words: [
            { tr: "Abdest alırım,", order: 1, ar: "أَتَوَضَّأُ،" },
            { tr: "sonra", order: 2, ar: "ثُمَّ" },
            { tr: "sabah namazını", order: 4, ar: "الفَجْر." },
            { tr: "kılarım.", order: 3, ar: "أُصَلّي" }
        ]
    },
    {
        words: [
            { tr: "Ailemle", order: 3, ar: "مَع عائِلَتي." },
            { tr: "kahvaltı", order: 2, ar: "الفَطور" },
            { tr: "yaparım.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "Elbiselerimi", order: 2, ar: "مَلابِسي." },
            { tr: "giyerim.", order: 1, ar: "أَلْبَسُ" }
        ]
    },
    {
        words: [
            { tr: "Okula", order: 2, ar: "إِلى المَدْرَسَة." },
            { tr: "giderim.", order: 1, ar: "أَذْهَبُ" }
        ]
    },
    {
        words: [
            { tr: "Öğleyin", order: 3, ar: "ظُهْرًا." },
            { tr: "eve", order: 2, ar: "إِلى البَيْت" },
            { tr: "dönerim.", order: 1, ar: "أَرْجِعُ" }
        ]
    },
    {
        words: [
            { tr: "Evde", order: 3, ar: "في البَيْت." },
            { tr: "anneme", order: 2, ar: "أُمّي" },
            { tr: "yardım ederim.", order: 1, ar: "أُساعِدُ" }
        ]
    },
    {
        words: [
            { tr: "Akşam", order: 3, ar: "مَساءً." },
            { tr: "derslerimi", order: 2, ar: "دُروسي" },
            { tr: "çalışırım.", order: 1, ar: "أَدْرُسُ" }
        ]
    },
    {
        words: [
            { tr: "Yatsı namazını", order: 2, ar: "العِشاء." },
            { tr: "kılarım.", order: 1, ar: "أُصَلّي" }
        ]
    },
    {
        words: [
            { tr: "Gece", order: 2, ar: "لَيْلًا." },
            { tr: "uyurum.", order: 1, ar: "أَنامُ" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هُو" },
            { tr: "erken", order: 3, ar: "مُبَكِّرًا." },
            { tr: "uyanıyor.", order: 2, ar: "يَـسْتَيْقِظُ" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هِي" },
            { tr: "erken", order: 3, ar: "مُبَكِّرًا." },
            { tr: "uyanıyor.", order: 2, ar: "تَـسْتَيْقِظُ" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هُو" },
            { tr: "sabah namazı", order: 3, ar: "الفَجْر." },
            { tr: "kılıyor.", order: 2, ar: "يُـصَلّي" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هِي" },
            { tr: "sabah namazı", order: 3, ar: "الفَجْر." },
            { tr: "kılıyor.", order: 2, ar: "تُـصَلّي" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هُو" },
            { tr: "kahvaltı", order: 3, ar: "الفَطور." },
            { tr: "yapıyor.", order: 2, ar: "يَـتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هِي" },
            { tr: "kahvaltı", order: 3, ar: "الفَطور." },
            { tr: "yapıyor.", order: 2, ar: "تَـتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هُو" },
            { tr: "dişlerini", order: 3, ar: "أَسْنانَهُ." },
            { tr: "temizliyor.", order: 2, ar: "يُـنَظِّفُ" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هِي" },
            { tr: "dişlerini", order: 3, ar: "أَسْنانَها." },
            { tr: "temizliyor.", order: 2, ar: "تُـنَظِّفُ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتَ" },
            { tr: "öğleyin", order: 4, ar: "ظُهْرًا." },
            { tr: "eve", order: 3, ar: "إِلى البَيْت" },
            { tr: "dönüyorsun.", order: 2, ar: "تَـرْجِعُ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتِ" },
            { tr: "öğleyin", order: 4, ar: "ظُهْرًا." },
            { tr: "eve", order: 3, ar: "إِلى البَيْت" },
            { tr: "dönüyorsun.", order: 2, ar: "تَـرْجِعينَ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتَ" },
            { tr: "annene", order: 3, ar: "أُمَّكَ." },
            { tr: "yardım ediyorsun.", order: 2, ar: "تُـساعِدُ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتِ" },
            { tr: "annene", order: 3, ar: "أُمَّكِ." },
            { tr: "yardım ediyorsun.", order: 2, ar: "تُـساعِدينَ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتَ" },
            { tr: "akşam", order: 4, ar: "مَساءً." },
            { tr: "dersleri", order: 3, ar: "الدُّروس" },
            { tr: "çalışıyorsun.", order: 2, ar: "تَـدْرُسُ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتِ" },
            { tr: "akşam", order: 4, ar: "مَساءً." },
            { tr: "dersleri", order: 3, ar: "الدُّروس" },
            { tr: "çalışıyorsun.", order: 2, ar: "تَـدْرُسينَ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتَ" },
            { tr: "gece", order: 3, ar: "لَيْلًا." },
            { tr: "uyuyorsun.", order: 2, ar: "تَـنامُ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتِ" },
            { tr: "gece", order: 3, ar: "لَيْلًا." },
            { tr: "uyuyorsun.", order: 2, ar: "تَـنامينَ" }
        ]
    },
    {
        words: [
            { tr: "Kahvaltıda", order: 4, ar: "في الفَطور." },
            { tr: "zeytin", order: 2, ar: "الزَّيْتون" },
            { tr: "ve peynir", order: 3, ar: "وَالجُبْن" },
            { tr: "yiyorum.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "Kahvaltıda", order: 3, ar: "في الفَطور." },
            { tr: "süt", order: 2, ar: "الحَليب" },
            { tr: "içiyorum.", order: 1, ar: "أَشْرَبُ" }
        ]
    },
    {
        words: [
            { tr: "Öğle yemeğinde", order: 4, ar: "في الغَداء." },
            { tr: "et", order: 2, ar: "اللَّحْم" },
            { tr: "ve pirinç", order: 3, ar: "وَالأُرْز" },
            { tr: "yiyorum.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "Öğle yemeğinden", order: 4, ar: "الغَداء." },
            { tr: "sonra", order: 3, ar: "بَعْد" },
            { tr: "kahve", order: 2, ar: "القَهْوَة" },
            { tr: "içiyorum.", order: 1, ar: "أَشْرَبُ" }
        ]
    },
    {
        words: [
            { tr: "Akşam yemeğinde", order: 4, ar: "في العَشاء." },
            { tr: "balık", order: 2, ar: "السَّمَك" },
            { tr: "ve salata", order: 3, ar: "وَالسَّلَطَة" },
            { tr: "yiyorum.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "Akşam yemeğinde", order: 3, ar: "في العَشاء." },
            { tr: "meyve suyu", order: 2, ar: "العَصير" },
            { tr: "içiyorum.", order: 1, ar: "أَشْرَبُ" }
        ]
    },
    {
        words: [
            { tr: "Sabah", order: 5, ar: "صَباحًا." },
            { tr: "saat", order: 3, ar: "في السّاعَة" },
            { tr: "yedide", order: 4, ar: "السّابِعَة" },
            { tr: "kahvaltı", order: 2, ar: "الفَطور" },
            { tr: "yaparım.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "Kahvaltıda", order: 4, ar: "في الفَطور." },
            { tr: "bal", order: 2, ar: "العَسَل" },
            { tr: "ve tereyağı", order: 3, ar: "وَالزُّبْدَة" },
            { tr: "yerim.", order: 1, ar: "آكُلُ"}
        ]
    },
    {
        words: [
            { tr: "Saat", order: 3, ar: "في السّاعَة" },
            { tr: "sekizde", order: 4, ar: "الثّامِنَة." },
            { tr: "okula", order: 2, ar: "إِلى مدْرَسَة" },
            { tr: "giderim.", order: 1, ar: "أَذْهَبُ" }
        ]
    },
    {
        words: [
            { tr: "Akşam yemeğinde", order: 4, ar: "في العَشاء." },
            { tr: "tavuk", order: 2, ar: "الدَّجاج" },
            { tr: "ve pirinç", order: 3, ar: "وَالأُرْز" },
            { tr: "yerim.", order: 1, ar: "آكُلُ" }
        ]
    },
    {
        words: [
            { tr: "Gece", order: 5, ar: "لَيْلًا." },
            { tr: "saat", order: 2, ar: "في السّاعَة" },
            { tr: "on", order: 4, ar: "عَشْرَة" },
            { tr: "birde", order: 3, ar: "الحادِيَة" },
            { tr: "uyurum.", order: 1, ar: "أَنامُ" }
        ]
    },

    // --- Saatler ---

    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "bir.", order: 2, ar: "الواحِدَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "iki.", order: 2, ar: "الثّانِيَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "üç.", order: 2, ar: "الثّالِثَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "dört.", order: 2, ar: "الرّابِعَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "beş.", order: 2, ar: "الخامِسَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "altı.", order: 2, ar: "السّادِسَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "yedi.", order: 2, ar: "السّابِعَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "sekiz.", order: 2, ar: "الثّامِنَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "dokuz.", order: 2, ar: "التّاسِعَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "on.", order: 2, ar: "العاشِرَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "on", order: 3, ar: "عَشْرَة" }, { tr: "bir.", order: 2, ar: "الحادِيَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "on", order: 3, ar: "عَشْرَة" }, { tr: "iki.", order: 2, ar: "الثّانِيَة" }] },
    
// --- Dini Rutinler ---
    {
        words: [
            { tr: "Güneşin", order: 5, ar: "الشَّمْس." },
            { tr: "doğuşundan", order: 4, ar: "شُروق" },
            { tr: "önce", order: 3, ar: "قَبْل" },
            { tr: "sabah namazını", order: 2, ar: "الفَجْر" },
            { tr: "kılarım.", order: 1, ar: "أُصَلّي" }
        ]
    },
    {
        words: [
            { tr: "Muhammed", order: 1, ar: "مُحَمَّد" },
            { tr: "öğle namazını", order: 3, ar: "الظُّهْر" },
            { tr: "cemaatle", order: 4, ar: "مَع الجَماعَة." },
            { tr: "kılıyor.", order: 2, ar: "يُصَلّي" }
        ]
    },
    {
        words: [
            { tr: "Halid", order: 1, ar: "خالِد" },
            { tr: "ikindi namazını", order: 3, ar: "العَصْر" },
            { tr: "camide", order: 4, ar: "في المَسْجِد." },
            { tr: "kılıyor.", order: 2, ar: "يُصَلّي" }
        ]
    },
    {
        words: [
            { tr: "Güneş", order: 5, ar: "الشَّمْس." },
            { tr: "battıktan", order: 4, ar: "غُروب" },
            { tr: "sonra", order: 3, ar: "بَعْد" },
            { tr: "akşam namazını", order: 2, ar: "المَغْرِب" },
            { tr: "kılarım.", order: 1, ar: "أُصَلّي" }
        ]
    },
    {
        words: [
            { tr: "Uyumadan", order: 4, ar: "النَّوْم." },
            { tr: "önce", order: 3, ar: "قَبْل" },
            { tr: "yatsı namazını", order: 2, ar: "العِشاء" },
            { tr: "kılarım.", order: 1, ar: "أُصَلّي" }
        ]
    },
    // --- Günler ---
    
  { words: [{ tr: "Pazartesi", order: 2, ar: "الاِثْنَيْن" }, { tr: "günü", order: 1, ar: "يَوْمُ" }] },
  { words: [{ tr: "Salı", order: 2, ar: "الثُّلاثاء" }, { tr: "günü", order: 1, ar: "يَوْم" }] },
  { words: [{ tr: "Çarşamba", order: 2, ar: "الأَرْبِعاء" }, { tr: "günü", order: 1, ar: "يَوْم" }] },
  { words: [{ tr: "Perşembe", order: 2, ar: "الخَميس" }, { tr: "günü", order: 1, ar: "يَوْم" }] },
  { words: [{ tr: "Cuma", order: 2, ar: "الجُمُعَة" }, { tr: "günü", order: 1, ar: "يَوْم" }] },
  { words: [{ tr: "Cumartesi", order: 2, ar: "السَّبْت" }, { tr: "günü", order: 1, ar: "يَوْم" }] },
  { words: [{ tr: "Pazar", order: 2, ar: "الأَحَد" }, { tr: "günü", order: 1, ar: "يَوْم" }] },

    {
        words: [
  { tr: "Pazar", order: 3, ar: "الأَحَد" },
  { tr: "günü", order: 2, ar: "يَوْم" },
  { tr: "Cumartesi", order: 6, ar: "السَّبْت‫.‬" },
  { tr: "gününden", order: 5, ar: "يَوْم" },
  { tr: "sonra", order: 4, ar: "بَعْد" },
  { tr: "gelir.", order: 1, ar: "يَأْتي" }
        ]
    },
    {
        words: [
           
       { tr: "Pazartesi", order: 3, ar: "الاِثْنَيْن" },
       { tr: "günü", order: 2, ar: "يَوْم" },
       { tr: "Salı", order: 6, ar: "الثُّلاثاء‫.‬" },
       { tr: "gününden", order: 5, ar: "يَوْم" },
       { tr: "önce", order: 4, ar: "قَبْل" },
       { tr: "gelir.", order: 1, ar: "يَأْتي" }
]
       
    },
    {
        words: [
  { tr: "Salı", order: 3, ar: "الثُّلاثاء" },
  { tr: "günü", order: 2, ar: "يَوْم" },
  { tr: "Çarşamba", order: 6, ar: "الأَرْبِعاء‫.‬" },
  { tr: "gününden", order: 5, ar: "يَوْم" },
  { tr: "önce", order: 4, ar: "قَبْل" },
  { tr: "gelir.", order: 1, ar: "يَأْتي" }
        ]
    },
    {
        words: [
            
        { tr: "Cuma", order: 3, ar: "الجُمُعَة" },
        { tr: "günü", order: 2, ar: "يَوْم" },
        { tr: "Perşembe", order: 6, ar: "الخَميس‫.‬" },
        { tr: "gününden", order: 5, ar: "يَوْم" },
        { tr: "sonra", order: 4, ar: "بَعْد" },
        { tr: "gelir.", order: 1, ar: "يَأْتي" }
        ]
        
    },
    // --- Son Eklemeler ---
    {
        words: [
            { tr: "Gece", order: 5, ar: "لَيْلًا." },
            { tr: "saat", order: 2, ar: "في السّاعَة" },
            { tr: "on", order: 4, ar: "عَشْرَة" },
            { tr: "ikide", order: 3, ar: "الثّانِيَة" },
            { tr: "uyurum.", order: 1, ar: "أَنامُ" }
        ]
    },
    {
        words: [
            { tr: "Arkadaşımla", order: 3, ar: "مَع صَديقي." },
            { tr: "kahvaltı", order: 2, ar: "الفَطور" },
            { tr: "yaparım.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "Öğle yemeğinde", order: 3, ar: "في الغَداء." },
            { tr: "balık", order: 2, ar: "السَّمَك" },
            { tr: "yerim.", order: 1, ar: "آكُلُ" }
        ]
    },
    {
        words: [
            { tr: "Akşam yemeğinden", order: 4, ar: "العَشاء." },
            { tr: "sonra", order: 3, ar: "بَعْد" },
            { tr: "kahve", order: 2, ar: "القَهْوَة" },
            { tr: "içerim.", order: 1, ar: "أَشْرَبُ" }
        ]
    },
    {
        words: [
            { tr: "Yemekten", order: 4, ar: "الطَّعام" },
            { tr: "önce", order: 3, ar: "قَبْل" },
            { tr: "ve sonrasında", order: 5, ar: "وَبَعْدَه." },
            { tr: "ellerimi", order: 2, ar: "يَدَيّ" },
            { tr: "yıkarım.", order: 1, ar: "أَغْسِلُ" }
        ]
    },
    {
        words: [
            { tr: "Kahvaltı", order: 2, ar: "الفَطور." },
            { tr: "yaparım.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "Dişlerimi", order: 2, ar: "أَسْناني." },
            { tr: "temizlerim.", order: 1, ar: "أُنَظِّفُ" }
        ]
    },
    {
        words: [
            { tr: "Anneme", order: 2, ar: "أُمّي." },
            { tr: "yardım ederim.", order: 1, ar: "أُساعِدُ" }
        ]
    },
    {
        words: [
            { tr: "Eve", order: 2, ar: "إِلى البَيْت." },
            { tr: "dönerim.", order: 1, ar: "أَرْجِعُ" }
        ]
    }
],
dialog: [
    // Diyalog 1: Yemek ve İçecek İsteği
    {
        p1: [
            { tr: "Yiyeceklerden", order: 3, ar: "مِن المَأْكولات؟" },
            { tr: "ne", order: 1, ar: "ماذا" },
            { tr: "istersin?", order: 2, ar: "تُريدُ" }
        ],
        p2: [
            { tr: "Köfte", order: 2, ar: "الكُفْتَة" },
            { tr: "ve pirinç (pilav)", order: 3, ar: "وَالأُرْز." },
            { tr: "istiyorum.", order: 1, ar: "أُريدُ" }
        ]
    },
    {
        p1: [
            { tr: "İçeceklerden", order: 3, ar: "مِن المَشْروبات؟" },
            { tr: "ne", order: 1, ar: "ماذا" },
            { tr: "istersin (k)?", order: 2, ar: "تُريدينَ" }
        ],
        p2: [
            { tr: "Çay", order: 2, ar: "الشّاي." },
            { tr: "istiyorum.", order: 1, ar: "أُريدُ" }
        ]
    },
    // Diyalog 2: Sevgi/Beğeni Soruları
    {
        p1: [
            { tr: "Köfteyi", order: 3, ar: "الكُفْتَة؟" },
            { tr: "sever", order: 2, ar: "تُحِبُّ" },
            { tr: "misin?", order: 1, ar: "هَلْ"}
        ],
        
        p2: [
            { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
            { tr: "köfteyi", order: 3, ar: "الكُفْتَة" },
            { tr: "çok", order: 4, ar: "كَثيرًا." },
            { tr: "severim.", order: 2, ar: "أُحِبُّ" }
        ]
    },
    // Diyalog 3: Ahmet ve Fatih (Günlük Rutin)
    {
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
    },
    {
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
    {
        p1: [
            { tr: "Akşam yemeğinde", order: 3, ar: "في العَشاء؟" },
            { tr: "ne", order: 1, ar: "ماذا" },
            { tr: "yersin?", order: 2, ar: "تَأْكُلُ" }
        ],
        p2: [
            { tr: "Tavuk", order: 2, ar: "الدَّجاج" },
            { tr: "ve pirinç", order: 3, ar: "وَالأُرْز." },
            { tr: "yerim.", order: 1, ar: "آكُلُ" }
        ]
    },
    // Diyalog 4: Merve ve Zeynep
    {
        p1: [
            { tr: "Öğle yemeğinden", order: 5, ar: "الغَداء؟" },
            { tr: "sonra", order: 4, ar: "بَعْد" },
            { tr: "kahve", order: 3, ar: "القَهْوَة" },
            { tr: "içer", order: 1, ar: "تَشْرَبينَ" },
            { tr: "misin?", order: 2, ar: "هَلْ" }
        ],
        p2: [
            { tr: "Hayır,", order: 1, ar: "لا،" },
            { tr: "çay", order: 3, ar: "الشّاي." },
            { tr: "içerim.", order: 2, ar: "أَشْرَبُ" }
        ]
    },
    {
        p1: [
            { tr: "Evde", order: 4, ar: "في البَيْت؟" },
            { tr: "annene", order: 3, ar: "أُمَّكِ" },
            { tr: "yardım eder", order: 2, ar: "تُساعِدين" },
            { tr: "misin?", order: 1, ar: "هَلْ" }
        ],
        p2: [
            { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
            { tr: "anneme", order: 3, ar: "أُمّي" },
            { tr: "yardım ederim", order: 2, ar: "أُساعِدُ" },
            { tr: "ve", order: 4, ar: "وَأُنَظِّفُ" },
            { tr: "odamı", order: 5, ar: "غُرْفَتي." },
            { tr: "temizlerim.", order: 4, ar: "وَأُنَظِّفُ" }
        ]
    },
    // Diyalog 5: Ömer ve Bilal
    {
        p1: [
            { tr: "İçeceklerden", order: 3, ar: "مِن المَشْروبات؟" },
            { tr: "ne", order: 1, ar: "ماذا" },
            { tr: "seversin?", order: 2, ar: "تُحِبُّ" }
        ],
        p2: [
            { tr: "Çayı", order: 2, ar: "الشّاي" },
            { tr: "çok", order: 3, ar: "كَثيرًا." },
            { tr: "severim.", order: 1, ar: "أُحِبُّ" }
        ]
    },
    // Diyalog 6: İsmail Metni (Diyalog yapısında p1/p2 olarak bölünmüştür)
    {
        p1: [
            { tr: "İsmail", order: 2, ar: "إِسْماعيل" },
            { tr: "sabah", order: 4, ar: "صَباحًا‫.‬" },
            { tr: "altıda", order: 3, ar: "في السّادِسَة" },
            { tr: "uyanır.", order: 1, ar: "يَـسْتَيْقِظُ" }
        ],
        p2: [
            { tr: "Abdest alır,", order: 1, ar: "يَتَوَضَّأُ" },
            { tr: "sonra", order: 2, ar: "ثُمَّ" },
            { tr: "sabah namazını", order: 4, ar: "الفَجْر." },
            { tr: "kılar.", order: 3, ar: "يُصَلّي" }
        ]
    }
]

};
/* kelimeler (kart + hafıza oyunu) */
window.data.words = [
     { tr: "Uyanıyorum", ar: "أَسْتَيْقِظُ" },
    { tr: "Abdest alıyorum", ar: "أَتَوَضَّأُ" },
    { tr: "Namaz kılıyorum", ar: "أُصَلِّي" },
    { tr: "Yiyorum / Kahvaltı yapıyorum", ar: "أَتَناوَلُ" },
    { tr: "Giyiniyorum", ar: "أَلْبَسُ" },
    { tr: "Gidiyorum", ar: "أَذْهَبُ" },
    { tr: "Dönüyorum", ar: "أَرْجِعُ" },
    { tr: "Yardım ediyorum", ar: "أُساعِدُ" },
    { tr: "Ders çalışıyorum", ar: "أَدْرُسُ" },
    { tr: "Uyuyorum", ar: "أَنامُ" },
    { tr: "Temizliyorum", ar: "أُنَظِّفُ" },
    { tr: "İçiyorum", ar: "أَشْرَبُ" },
    { tr: "Yiyorum", ar: "آكُلُ" },
    { tr: "İstiyorum", ar: "أُريدُ" },
    { tr: "Seviyorum", ar: "أُحِبُّ" },
    { tr: "Yıkıyorum", ar: "أَغْسِلُ" },
    { tr: "Geliyor", ar: "يَأْتي" },

    // Zaman Dilimleri ve Zarflar
    { tr: "Sabah", ar: "صَباحًا" },
    { tr: "Erken", ar: "مُبَكِّرًا" },
    { tr: "Öğle", ar: "ظُهْرًا" },
    { tr: "Akşam", ar: "مَساءً" },
    { tr: "Gece", ar: "لَيْلًا" },
    { tr: "Sonra", ar: "ثُمَّ / بَعْدَ" },
    { tr: "Önce", ar: "قَبْلَ" },
    { tr: "Çok", ar: "كَثيرًا" },
    { tr: "Şimdi / Saat", ar: "السّاعَة" },

    // Yiyecek ve İçecekler
    { tr: "Kahvaltı", ar: "الفَطور" },
    { tr: "Öğle yemeği", ar: "الغَداء" },
    { tr: "Akşam yemeği", ar: "العَشاء" },
    { tr: "Zeytin", ar: "الزَّيْتون" },
    { tr: "Peynir", ar: "الجُبْن" },
    { tr: "Süt", ar: "الحَليب" },
    { tr: "Et", ar: "اللَّحْم" },
    { tr: "Pirinç / Pilav", ar: "الأُرْز" },
    { tr: "Kahve", ar: "القَهْوَة" },
    { tr: "Balık", ar: "السَّمَك" },
    { tr: "Salata", ar: "السَّلَطَة" },
    { tr: "Meyve suyu", ar: "العَصير" },
    { tr: "Bal", ar: "العَسَل" },
    { tr: "Tereyağı", ar: "الزُّبْدَة" },
    { tr: "Tavuk", ar: "الدَّجاج" },
    { tr: "Ekmek", ar: "خُبْز" },
    { tr: "Çay", ar: "الشّاي" },
    { tr: "Köfte", ar: "الكُفْتَة" },
    { tr: "Makarna", ar: "المَكَرونَة" },

    // Mekan ve Eşya
    { tr: "Ev", ar: "البَيْت" },
    { tr: "Okul", ar: "المَدْرَسَة" },
    { tr: "Mescid / Cami", ar: "المَسْجِد" },
    { tr: "Elbiseler", ar: "مَلابِس" },
    { tr: "Dişler", ar: "أَسْنان" },
    { tr: "Oda", ar: "غُرْفَة" },

    // Namaz Vakitleri
    { tr: "Sabah namazı", ar: "الفَجْر" },
    { tr: "Yatsı namazı", ar: "العِشاء" },
    { tr: "İkindi namazı", ar: "العَصْر" },
     { tr: "Öğle namazı", ar: "الظُّهْر" },
    { tr: "Akşam namazı", ar: "المَغْرِب" },
    

    // Sayılar (Saatler için)
    
    { tr: "Üçüncü", ar: "الثّالِثَة" },
    { tr: "On ikinci", ar: "الثّانِيَة عَشْرَة" },
    { tr: "Beşinci", ar: "الخامِسَة" },
    { tr: "On birinci", ar: "الحادِيَة عَشْرَة" },
    { tr: "Altıncı", ar: "السّادِسَة" },
    { tr: "Yedinci", ar: "السّابِعَة" },
    { tr: "İkinci", ar: "الثّانِيَة" },
    { tr: "Sekizinci", ar: "الثّامِنَة" },
    { tr: "Birinci", ar: "الواحِدَة" },
    { tr: "Dokuzuncu", ar: "التّاسِعَة" },
    { tr: "Onuncu", ar: "العاشِرَة" },
    { tr: "Dördüncü", ar: "الرّابِعَة" },
    
    // Günler
    { tr: "Pazartesi", ar: "الاِثْنَيْن" },
    { tr: "Cumartesi", ar: "السَّبْت" },
    { tr: "Çarşamba", ar: "الأَرْبِعاء" },
    { tr: "Salı", ar: "الثُّلاثاء" },
    { tr: "Cuma", ar: "الجُمُعَة" },
    { tr: "Pazar", ar: "الأَحَد" },
    { tr: "Perşembe", ar: "الخَميس" }
];
