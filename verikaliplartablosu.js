

const letters = "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" ");
let currentRoot = ""; 
let isReadyVerbMode = false; 
let currentEggIndex = 0; 
let lastClickedBoxTextSpan = null;
let lastOriginalWord = "";

const arabicKeyMap = {
    '"': 'ذ', 'q':'ض', 'w':'ص', 'e':'ث', 'r':'ق', 't':'ف', 'y':'غ', 'u':'ع', 'ı':'ه', 'o':'خ', 'p':'ح', 'ğ':'ج', 'ü':'د',
    'a':'ش', 's':'س', 'd':'ي', 'f':'ب', 'g':'ل', 'h':'ا', 'j':'ت', 'k':'ن', 'l':'م', 'ş':'ك', 'i':'ط',
    'z':'ئ', 'x':'ء', 'c':'ؤ', 'v':'ر', 'b':'لا', 'n':'ى', 'm':'ة', 'ö':'ز', 'ç':'ظ'
};

const readyVerbTargets = [21, 17, 50, 56, 61, 51, 55, 49];
let targetStates = {}; 

let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 60; 
let currentTabActive = 0;    

let lastWheelTime = 0;
const wheelCooldown = 600; 


const babVezinleri = {
    1: { mazi: "فَعَلَ", muzari: "يَفْعُلُ", emir: "أُفْعُلْ" },
    2: { mazi: "فَعَلَ", muzari: "يَفْعِلُ", emir: "اِفْعِلْ" },
    3: { mazi: "فَعَلَ", muzari: "يَفْعَلُ", emir: "اِفْعَلْ" },
    4: { mazi: "فَعِلَ", muzari: "يَفْعَلُ", emir: "اِفْعَلْ" },
    5: { mazi: "فَعُلَ", muzari: "يَفْعُلُ", emir: "أُفْعُلْ" },
    6: { mazi: "فَعِلَ", muzari: "يَفْعِلُ", emir: "اِفْعِلْ" },
    7: { mazi: "أَفْعَلَ", muzari: "يُفْعِلُ", emir: "أَفْعِلْ" },      
    8: { mazi: "فَعَّلَ", muzari: "يُفَعِّلُ", emir: "فَعِّلْ" },      
    9: { mazi: "فَاعَلَ", muzari: "يُفَاعِلُ", emir: "فَاعِلْ" },    
    10: { mazi: "اِنْفَعَلَ", muzari: "يَنْفَعِلُ", emir: "اِنْفَعِلْ" },  
    11: { mazi: "اِفْتَعَلَ", muzari: "يَفْتَعِلُ", emir: "اِفْتَعِلْ" },  
    12: { mazi: "اِفْعَلَّ", muzari: "يَفْعَلُّ", emir: "اِفْعَلِلْ" },    
    13: { mazi: "تَفَعَّلَ", muzari: "يَتَفَعَّلُ", emir: "تَفَعَّلْ" },  
    14: { mazi: "تَفَاعَلَ", muzari: "يَتَفَاعَلُ", emir: "تَفَاعَلْ" },  
    15: { mazi: "اِسْتَفْعَلَ", muzari: "يَسْتَفْعِلُ", emir: "اِسْتَفْعِلْ" } 
};

const sigaSablonlari = {
    mazi: [
        { ek: "َ", etiket: "Müfred Müzekker Gâib" },
        { ek: "َا", etiket: "Tesniye Müzekker Gâib" },
        { ek: "ُوا", etiket: "Cemi Müzekker Gâib" },
        { ek: "َتْ", etiket: "Müfred Müennes Gâibe" },
        { ek: "َتَا", etiket: "Tesniye Müennes Gâibe" },
        { ek: "ْنَ", etiket: "Cemi Müennes Gâibe" },
        { ek: "ْتَ", etiket: "Müfred Müzekker Muhâtab" },
        { ek: "ْتُمَا", etiket: "Tesniye Müzekker Muhâtab" },
        { ek: "ْتُمْ", etiket: "Cemi Müzekker Muhâtab" },
        { ek: "ْتِ", etiket: "Müfred Müennes Muhâtabe" },
        { ek: "ْتُمَا", etiket: "Tesniye Müennes Muhâtabe" },
        { ek: "ْتُنَّ", etiket: "Cemi Müennes Muhâtabe" },
        { ek: "ْتُ", etiket: "Müfred Mütekellim (Ben)" },
        { ek: "ْنَا", etiket: "Cemi Mütekellim (Biz)" },
        { ek: "ْنَا", etiket: "Cemi Mütekellim (Biz - Muazzam)" }
    ],
    muzari: [
        { prefix: "يَ", suffix: "ُ", etiket: "Müfred Müzekker Gâib" },
        { prefix: "يَ", suffix: "َانِ", etiket: "Tesniye Müzekker Gâib" },
        { prefix: "يَ", suffix: "ُونَ", etiket: "Cemi Müzekker Gâib" },
        { prefix: "تَ", suffix: "ُ", etiket: "Müfred Müennes Gâibe" },
        { prefix: "تَ", suffix: "َانِ", etiket: "Tesniye Müennes Gâibe" },
        { prefix: "يَ", suffix: "ْنَ", etiket: "Cemi Müennes Gâibe" },
        { prefix: "تَ", suffix: "ُ", etiket: "Müfred Müzekker Muhâtab" },
        { prefix: "تَ", suffix: "َانِ", etiket: "Tesniye Müzekker Muhâtab" },
        { prefix: "تَ", suffix: "ُونَ", etiket: "Cemi Müzekker Muhâtab" },
        { prefix: "تَ", suffix: "ِينَ", etiket: "Müfred Müennes Muhâtabe" },
        { prefix: "تَ", suffix: "َانِ", etiket: "Tesniye Müennes Muhâtabe" },
        { prefix: "تَ", suffix: "ْنَ", etiket: "Cemi Müennes Muhâtabe" },
        { prefix: "أَ", suffix: "ُ", etiket: "Müfred Mütekellim (Ben)" },
        { prefix: "نَ", suffix: "ُ", etiket: "Cemi Mütekellim (Biz)" },
        { prefix: "نَ", suffix: "ُ", etiket: "Cemi Mütekellim (Biz - Muazzam)" }
    ],
    emir: [
        { suffix: "ْ", etiket: "Müfred Müzekker Muhâtab" },
        { suffix: "َا", etiket: "Tesniye Müzekker Muhâtab" },
        { suffix: "ُوا", etiket: "Cemi Müzekker Muhâtab" },
        { suffix: "ِي", etiket: "Müfred Müennes Muhâtabe" },
        { suffix: "َا", etiket: "Tesniye Müennes Muhâtabe" },
        { suffix: "ْنَ", etiket: "Cemi Müennes Muhâtabe" }
    ]
};




const wordEasterEggs = {

// ==================================================================
    // 1. A-Kh-Z (أ خ ذ) KÖKÜ - Almak / Tutmak
    // Mehmûz'ul Fâ (İlk harfi hemzeli)
    // ==================================================================
    "أخذ": {
        1: { 
            base: { emoji: "🤲", arText: "أَخَذَ", trText: "Aldı / Tuttu." } 
        },
        2: { 
            base: { emoji: "📥", arText: "يَأْخُذُ", trText: "Alır / Alıyor." } 
        },
        3: { 
            base: { 
                emoji: "❗", 
                arText: "خُذْ", 
                trText: "Al / Tut!",
                ornek: [
                    { ar: "خُذْ مَا صَفَا وَدَعْ مَا كَدِرَ", tr: "Berrak (saf) olanı al, bulanık (kötü) olanı bırak." },
                    { ar: "💡 قَاعِدَة صَرْفِيَّة", tr: "Sarf Kuralı: 'Ekele, Ehaze, Emera' gibi bazı mehmûz fiillerde emir kipi yapılırken baştaki hemze telaffuz zorluğundan dolayı tamamen düşer (أُأْخُذْ değil, خُذْ olur)." }
                ]
            } 
        },
        19: { 
            base: { emoji: "🤝", arText: "أَخْذ", trText: "Ahz / Almak, tutmak." } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🤲", 
                arText: "آخِذ", 
                 
            },
            suggestsPlus: true, // Öğrenci '+' butonuna basınca Ahize kelimesi çıkacak
            "ة": { 
                emoji: "📞", 
                arText: "آخِذَة", 
                trText: "Ahize / Alan, tutan şey (Alıcı, telefon ahizesi).",
                ornek: [
                    {
                        ar: "💡 مَعْلُومَة لُغَوِيَّة",
                        tr: "Dil Notu: Telefonda sesi 'alan' ve elimizde 'tuttuğumuz' parçaya verilen 'Ahize' kelimesi tam olarak bu kökten (Alan şey / Alıcı) gelir."
                    }
                ]
            } 
        },

        38: { 
            base: { 
                emoji: "📖", 
                arText: "مَأْخَذ", 
                trText: "Me'haz / Kaynak, bilginin veya eşyanın alındığı yer.",
                ornek: { ar: "مَأْخَذُ الْمَعْلُومَاتِ", tr: "Bilgilerin alındığı kaynak." }
            } 
        }
    },

    // ==================================================================
    // 2. A-M-R (أ م ر) KÖKÜ - Emretmek / İş / Durum
    // ==================================================================
    "أمر": {
        1: { 
            base: { emoji: "🗣️", arText: "أَمَرَ", trText: "Emretti / Buyurdu." } 
        },
        2: { 
            base: { emoji: "💬", arText: "يَأْمُرُ", trText: "Emreder / Buyurur." } 
        },
        3: { 
            base: { 
                emoji: "❗", 
                arText: "مُرْ", 
                trText: "Emret!",
                ornek: { ar: "وَأْمُرْ بِالْمَعْرُوفِ", tr: "İyiliği emret. (Lokmân Suresi, 17) - *Başına vav gelince düşen hemze geri döner.*" }
            } 
        },
        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "📋", 
                arText: "أَمْر", 
                trText: "Emir / İş, durum, buyruk.",
                ornek: { 
                    ar: "شَاوِرْهُمْ فِي الْأَمْرِ", 
                    tr: "İş (durum) hakkında onlara danış. (Âl-i İmrân Suresi, 159)" 
                }
            }
        },
        33: { 
            base: { 
                emoji: "👑", 
                arText: "آمِر", 
                trText: "Âmir / Emreden, yetkili.",
                ornek: { ar: "💡 قَاعِدَة إِمْلَائِيَّة", tr: "İmla Kuralı: 'أَأْمِر' (E'mir) şeklindeki iki hemze yan yana gelince uzatma (Med) harfine dönüşür ve 'آمِر' (Âmir) yazılır." }
            } 
        },

         // --- 35 Numaralı Kalıp (فَعِيل - Sıfat-ı Müşebbehe / İsim) ---
        35: {
            base: {
                emoji: "🤴",
                arText: "أَمِير",
                trText: "Emîr / Komutan, prens, yönetici.",
                ornek: { ar: "أَمِيرُ الْمُؤْمِنِينَ", tr: "Müminlerin emiri (halifesi)." }
            },
            suggestsPlus: true, // Öğrenci '+' butonuna basınca 'Emire' çıkacak
            "ة": {
                emoji: "👸",
                arText: "أَمِيرَة",
                trText: "Emîre / Prenses, kadın yönetici (Emir veren kadın)."
            }
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: {
            base: {
                emoji: "👨‍💼",
                arText: "مَأْمُور",
                trText: "Memur / Kendisine emredilen, emir alan görevli.",
                ornek: [
                    { 
                        ar: "اَلْمَأْمُورُ مَعْذُورٌ", 
                        tr: "Emir alan kişi (sadece emri uyguladığı için) mazurdur. (Arap Atasözü)" 
                    },
                    { 
                        ar: "💡 مَعْلُومَة لُغَوِيَّة", 
                        tr: "Dil Notu: Devlet dairesinde amirin emirleri altında çalışan, yani 'emir alan' kişiye tam olarak bu kökten dolayı 'Memur' denir." 
                    }
                ]
            }
        },

        // --- 43 Numaralı Kalıp (فُعُول - Cem-i Mükesser / Kırık Çoğul) ---
        43: { 
            base: { 
                emoji: "📂", 
                arText: "أُمُور", 
                trText: "Umûr / İşler, durumlar, olaylar.",
                ornek: [
                    { 
                        ar: "وَإِلَى اللهِ تُرْجَعُ الْأُمُورُ", 
                        tr: "Ve bütün işler (durumlar) Allah'a döndürülür. (Bakara Suresi, 210)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة قَاعِدِيَّة",
                        tr: "Gramer Notu: Arapçada akılsız varlıkların veya soyut kavramların kırık çoğulları (Cem-i Mükesser) müennes (dişil) tekil hükmündedir. Bu yüzden 'işler' anlamına gelen 'Umûr' kelimesine sıfat getirilirken tekil müennes (örn: أُمُورٌ مُهِمَّةٌ - önemli işler) şeklinde getirilir."
                    }
                ]
            } 
        },
        
    },

    // ==================================================================
    // 3. A-Th-R (أ ث ر) KÖKÜ - İz Bırakmak / Etkilemek
    // ==================================================================
    "أثر": {
        17: { 
            base: { 
                emoji: "👣", 
                arText: "أَثَر", 
                trText: "Eser / İz, kalıntı, bırakılan şey." 
            },
        },
       // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi) ---
        52: { 
            base: { 
                emoji: "🤝", 
                arText: "آثَرَ", 
                trText: "Tercih etti / Kendinden önce başkasını düşündü.",
                ornek: { ar: "وَيُؤْثِرُونَ عَلَى أَنْفُسِهِمْ وَلَوْ كَانَ بِهِمْ خَصَاصَةٌ", tr: "Kendileri zaruret içinde bulunsalar bile onları kendilerine tercih ederler. (Haşr Suresi, 9)" }
            },
            cekimi: ["آثَرَ", "آثَرَا", "آثَرُوا", "آثَرَتْ", "آثَرَتَا", "آثَرْنَ", "آثَرْتَ", "آثَرْتُمَا", "آثَرْتُمْ", "آثَرْتِ", "آثَرْتُمَا", "آثَرْتُنَّ", "آثَرْتُ", "آثَرْنَا", "آثَرْنَا"]
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: {
            base: {
                emoji: "🤲",
                arText: "يُؤْثِرُ",
                trText: "Tercih eder / Başkasını kendine yeğler."
            },
            cekimi: ["يُؤْثِرُ", "يُؤْثِرَانِ", "يُؤْثِرُونَ", "تُؤْثِرُ", "تُؤْثِرَانِ", "يُؤْثِرْنَ", "تُؤْثِرُ", "تُؤْثِرَانِ", "تُؤْثِرُونَ", "تُؤْثِرِينَ", "تُؤْثِرَانِ", "تُؤْثِرْنَ", "أُؤْثِرُ", "نُؤْثِرُ", "نُؤْثِرُ"]
        },

        // --- 54 Numaralı Kalıp (أَفْعِلْ - İf'âl Babı Emir) ---
        54: {
            base: {
                emoji: "❗",
                arText: "آثِرْ",
                trText: "Tercih et! / (Kardeşini nefsine) Yeğle!"
            },
            cekimi: ["آثِرْ", "آثِرَا", "آثِرُوا", "آثِرِي", "آثِرَا", "آثِرْنَ"]
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "❤️", 
                arText: "إِيثَار", 
                trText: "İsar / Kendi ihtiyacı varken başkasını tercih etme (Diğerkâmlık).",
                ornek: [
                    {
                        ar: "💡 قَاعِدَة إِمْلَائِيَّة",
                        tr: "İmla Notu: Kelimenin aslı 'إِئْثَار' şeklindedir. Kesradan (esreden) sonra gelen sakin hemze, okuyuş kolaylığı için 'Ye' harfine dönüşür ve 'إِيثَار' yazılır."
                    }
                ]
            } 
        },
        61: { 
            base: { 
                emoji: "🎯", 
                arText: "تَأْثِير", 
                trText: "Tesir / Etkileme, iz bırakma." 
            } 
        },
        62: { 
            base: { 
                emoji: "✨", 
                arText: "مُؤَثِّر", 
                trText: "Müessir / Etkileyici, etki bırakan (Influencer)." 
            } 
        }
    },

    // ==================================================================
    // 4. A-L-F (أ ل ف) KÖKÜ - Alışmak / Kaynaşmak / Birleştirmek
    // ==================================================================
    "ألف": {
        // --- 1 Numaralı Kalıp (Mücerret 4. Bab Mazi) ---
        8: { 
            base: { emoji: "🤝", arText: "أَلِفَ", trText: "Alıştı / Kaynaştı / Uyum sağladı." } 
        },

        // --- 2 Numaralı Kalıp (Mücerret 4. Bab Muzari) ---
        9: { 
            base: { emoji: "🫂", arText: "يَأْلَفُ", trText: "Alışır / Kaynaşır." } 
        },

        // --- 3 Numaralı Kalıp (Mücerret 4. Bab Emir) ---
        10: { 
            base: { emoji: "❗", arText: "إِيلَفْ", trText: "Alış / Kaynaş!" } 
        },
        21: { 
            base: { 
                emoji: "🤍", 
                arText: "أُلْفَة", 
                trText: "Ülfet / Kaynaşma, samimiyet, alışkanlık." 
            } 
        },
        58: { 
            base: { 
                emoji: "🧩", 
                arText: "أَلَّفَ", 
                trText: "Birleştirdi / Telif etti (Kitap yazdı).",
                ornek: { ar: "أَلَّفَ كِتَابًا مُفِيدًا", tr: "Faydalı bir kitap yazdı (Dağınık bilgileri bir araya getirdi)." }
            } 
        },

        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Tef'îl Babı Muzari) ---
        59: { 
            base: { 
                emoji: "✍️", 
                arText: "يُؤَلِّفُ", 
                trText: "Birleştirir / Telif eder (Kitap yazar)." 
            },
            cekimi: ["يُؤَلِّفُ", "يُؤَلِّفَانِ", "يُؤَلِّفُونَ", "تُؤَلِّفُ", "تُؤَلِّفَانِ", "يُؤَلِّفْنَ", "تُؤَلِّفُ", "تُؤَلِّفَانِ", "تُؤَلِّفُونَ", "تُؤَلِّفِينَ", "تُؤَلِّفَانِ", "تُؤَلِّفْنَ", "أُؤَلِّفُ", "نُؤَلِّفُ", "نُؤَلِّفُ"]
        },

        // --- 60 Numaralı Kalıp (فَعِّلْ - Tef'îl Babı Emir) ---
        60: { 
            base: { 
                emoji: "❗", 
                arText: "أَلِّفْ", 
                trText: "Birleştir / Telif et (Yaz)!" 
            },
            cekimi: ["أَلِّفْ", "أَلِّفَا", "أَلِّفُوا", "أَلِّفِي", "أَلِّفَا", "أَلِّفْنَ"]
        },

        61: { 
            base: { 
                emoji: "📚", 
                arText: "تَأْلِيف", 
                trText: "Telif / Bilgileri bir araya getirip kitap yazma, materyal oluşturma." 
            } 
        },
        62: { 
            base: { 
                emoji: "✍️", 
                arText: "مُؤَلِّف", 
                trText: "Müellif / Yazar, bilgileri bir araya getiren kişi." 
            } 
        },
        80: {
            base: {
                emoji: "🤝",
                arText: "اِئْتِلَاف",
                trText: "İtilaf / Uzlaşma, anlaşma, bir araya gelme.",
                ornek: { ar: "دُوَلُ الْاِئْتِلَافِ", tr: "İtilaf (Anlaşma/Müttefik) Devletleri." }
            }
        }
    },

    // ==================================================================
    // 5. A-Dh-N (أ ذ ن) KÖKÜ - İzin Vermek / Kulak Vermek / Bildirmek
    // ==================================================================
    "أذن": {
        8: { 
            base: { emoji: "✅", arText: "أَذِنَ", trText: "İzin verdi." } 
        },

        // --- 9 Numaralı Kalıp (Mücerret 4. Bab Muzari) ---
        9: { 
            base: { 
                emoji: "💬", 
                arText: "يَأْذَنُ", 
                trText: "İzin verir / İzin veriyor." 
            },
            cekimi: ["يَأْذَنُ", "يَأْذَنَانِ", "يَأْذَنُونَ", "تَأْذَنُ", "تَأْذَنَانِ", "يَأْذَنْنَ", "تَأْذَنُ", "تَأْذَنَانِ", "تَأْذَنُونَ", "تَأْذَنِينَ", "تَأْذَنَانِ", "تَأْذَنْنَ", "آذَنُ", "نَأْذَنُ", "نَأْذَنُ"]
        },

        // --- 10 Numaralı Kalıp (Mücerret 4. Bab Emir) ---
        10: { 
            base: { 
                emoji: "❗", 
                arText: "إِيذَنْ", 
                trText: "İzin ver!",
                ornek: [
                    { 
                        ar: "اِئْذَنْ لِي", 
                        tr: "Bana izin ver." 
                    },
                    {
                        ar: "💡 قَاعِدَة صَرْفِيَّة",
                        tr: "Sarf Kuralı: Emir kipinin aslı 'اِئْذَنْ' (İ'zen) şeklindedir. Kesradan (esreden) sonra cezimli bir hemze gelince okuyuş kolaylığı için ikinci hemze 'Ye' (ي) harfine dönüşür ve 'إِيذَنْ' (İyzen) olur."
                    }
                ]
            },
            cekimi: ["إِيذَنْ", "إِيذَنَا", "إِيذَنُوا", "إِيذَنِي", "إِيذَنَا", "إِيذَنْنَ"]
        },

        21: { 
            base: { 
                emoji: "👂", 
                arText: "أُذُن", 
                trText: "Üzün / Kulak.",
                ornek: { ar: "💡 مَعْلُومَة ثَقَافِيَّة", tr: "Kültürel Not: Duyurmak, dinlemek ve izin vermek (duyup onaylamak) kavramlarının hepsi 'Kulak' kökünden türer." }
            } 
        },
        20: { 
            base: { emoji: "📜", arText: "إِذْن", trText: "İzin / Müsaade, onay." } 
        },
        22: {
            base: {
                emoji: "🕌",
                arText: "أَذَان",
                trText: "Ezan / Bildiri, duyuru, namaza çağrı."
            }
        },
        // --- 58 Numaralı Kalıp (فَعَّلَ - Tef'îl Babı Mazi) ---
        58: { 
            base: { 
                emoji: "📢", 
                arText: "أَذَّنَ", 
                trText: "İlan etti / Yüksek sesle bildirdi (Ezan okudu).",
                ornek: { 
                    ar: "فَأَذَّنَ مُؤَذِّنٌ بَيْنَهُمْ أَنْ لَعْنَةُ اللهِ عَلَى الظَّالِمِينَ", 
                    tr: "Derken aralarında bir münadi (bildirici), 'Allah'ın laneti zalimlerin üzerine olsun' diye seslendi (ilan etti). (A'râf Suresi, 44)" 
                }
            },
            cekimi: ["أَذَّنَ", "أَذَّنَا", "أَذَّنُوا", "أَذَّنَتْ", "أَذَّنَتَا", "أَذَّنَّ", "أَذَّنْتَ", "أَذَّنْتُمَا", "أَذَّنْتُمْ", "أَذَّنْتِ", "أَذَّنْتُمَا", "أَذَّنْتُنَّ", "أَذَّنْتُ", "أَذَّنَّا", "أَذَّنَّا"]
        },

        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Tef'îl Babı Muzari) ---
        59: { 
            base: { 
                emoji: "🗣️", 
                arText: "يُؤَذِّنُ", 
                trText: "İlan eder / Bildirir (Ezan okur)." 
            },
            cekimi: ["يُؤَذِّنُ", "يُؤَذِّنَانِ", "يُؤَذِّنُونَ", "تُؤَذِّنُ", "تُؤَذِّنَانِ", "يُؤَذِّنَّ", "تُؤَذِّنُ", "تُؤَذِّنَانِ", "تُؤَذِّنُونَ", "تُؤَذِّنِينَ", "تُؤَذِّنَانِ", "تُؤَذِّنَّ", "أُؤَذِّنُ", "نُؤَذِّنُ", "نُؤَذِّنُ"]
        },

        // --- 60 Numaralı Kalıp (فَعِّلْ - Tef'îl Babı Emir) ---
        60: { 
            base: { 
                emoji: "❗", 
                arText: "أَذِّنْ", 
                trText: "İlan et / Bildir!",
                ornek: {
                    ar: "وَأَذِّنْ فِي النَّاسِ بِالْحَجِّ",
                    tr: "İnsanlar arasında haccı ilan et (insanları hacca çağır)! (Hac Suresi, 27)"
                }
            },
            cekimi: ["أَذِّنْ", "أَذِّنَا", "أَذِّنُوا", "أَذِّنِي", "أَذِّنَا", "أَذِّنَّ"]
        },
        62: { 
            base: { 
                emoji: "🗣️", 
                arText: "مُؤَذِّن", 
                trText: "Müezzin / Ezan okuyan, insanlara vaktin girdiğini bildiren kişi." 
            } 
        },
        100: { 
            base: { 
                emoji: "🙋‍♂️", 
                arText: "اِسْتَأْذَنَ", 
                trText: "İzin istedi.",
                ornek: { ar: "اِسْتَأْذَنَ الطَّالِبُ لِلْخُرُوجِ", tr: "Öğrenci çıkmak için izin istedi." }
            } 
        }
    },

// ==================================================================
    // K-T-B (ك ت ب) KÖKÜ - Yazmak
    // ==================================================================
    "كتب": {
        
        // --- 1 Numaralı Kalıp (Mazi: فَعَلَ) ---
        1: { 
            base: { // Kök Hali: كَتَبَ
                emoji: "✍️", 
                arText: "كَتَبَ رِسَالَةً", 
                trText: "Bir mektup yazdı." 
            } 
        },

        // --- 2 Numaralı Kalıp (Muzari: يَفْعُلُ) ---
        2: { 
            base: { // Kök Hali: يَكْتُبُ
                emoji: "✏️", 
                arText: "يَكْتُبُ بِالْقَلَمِ", 
                trText: "Kalemle yazıyor." 
            } 
        },

        // --- 3 Numaralı Kalıp (Emir: أُفْعُلْ) ---
        3: { 
            base: { // Kök Hali: اُكْتُبْ
                emoji: "❗", 
                arText: "اُكْتُبْ وَاجِبَكَ", 
                trText: "Ödevini yaz." 
            } 
        },

        // --- 23 Numaralı Kalıp (فِعَال) ---
        23: { 
            base: { // Kök Hali: كِتَاب
                emoji: "📖", 
                arText: "خَيْرُ جَلِيسٍ فِي الزَّمَانِ كِتَابٌ", 
                trText: "Zamanın en hayırlı dostu (arkadaşı) kitaptır." 
            }, 
            suggestsPlus: true, // Öğrenciye '+' butonuna basmasını önerir
            "ة": { // Ek Almış Hali: كِتَابَة
                emoji: "✍️", 
                arText: "كِتَابَة", 
                trText: "Yazı yazmak." 
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { // Kök Hali: كَاتِب
                emoji: "📝", 
                arText: "كَاتِب", 
                trText: "Yazar / Katip." 
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { // Kök Hali: مَكْتُوب
                emoji: "✉️", 
                arText: "المَكْتُوبُ يُقْرَأُ مِنْ عُنْوَانِهِ", 
                trText: "Mektup adresinden belli olur. (Perşembenin gelişi çarşambadan bellidir)" 
            } 
        },

        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { // Kök Hali: مَكْتَب
                emoji: "🏢", 
                arText: "مَكْتَب", 
                trText: "Ofis / Masa." 
            }, 
            suggestsPlus: true, // Öğrenciye '+' butonuna basmasını önerir
            "ة": { // Ek Almış Hali: مَكْتَبَة
                emoji: "📚", 
                arText: "مَكْتَبَة", 
                trText: "Kütüphane." 
            } 
        },

        // --- 42 Numaralı Kalıp (فُعُل - Çoğul İsim) ---
        42: {
            base: {
                emoji: "📚",
                arText: "كُتُب",
                trText: "Kitaplar (Kütüb).",
                ornek: { ar: "الْكُتُبُ تَبْنِي الْعُقُولَ", tr: "Kitaplar zihinleri inşa eder." }
            }
        },

        // --- 45 Numaralı Kalıp (فُعَّال - Çoğul İsm-i Fâil) ---
        45: {
            base: {
                emoji: "👥",
                arText: "كُتَّاب",
                trText: "Kâtipler / Yazarlar (Küttâb).",
                ornek: [
                    { 
                        ar: "كُتَّابُ التَّارِيخِ", 
                        tr: "Tarih yazarları." 
                    },
                    { 
                        ar: "💡 مَعْلُومَة ثَقَافِيَّة", 
                        tr: "Kültürel Bilgi: 'Küttâb' kelimesi İslam medeniyetinde eskiden çocuklara okuma-yazma ve Kur'an öğretilen ilkokul (mektep) anlamında da kullanılırdı." 
                    }
                ]
            }
        }
    },

// ==================================================================
    // 21. '-L-M (ع ل م) KÖKÜ - Bilmek / Öğrenmek / Öğretmek
    // 4. Bab (فَعِلَ - يَفْعَلُ), Tef'îl, Tefe'ul ve İsti'fal Babları
    // ==================================================================
    "علم": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / 4. Bab) ---
        8: { 
            base: { 
                emoji: "💡", 
                arText: "عَلِمَ", 
                trText: "Bildi / Öğrendi.",
                ornek: {
                    ar: "قَدْ عَلِمَ كُلُّ أُنَاسٍ مَشْرَبَهُمْ",
                    tr: "Her topluluk kendi su içeceği yeri (pınarını) bildi. (Bakara Suresi, 60)"
                }
            } 
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { 
            base: { 
                emoji: "🤔", 
                arText: "يَعْلَمُ", 
                trText: "Bilir / Biliyor.",
                ornek: {
                    ar: "وَاللهُ يَعْلَمُ وَأَنْتُمْ لَا تَعْلَمُونَ",
                    tr: "Allah bilir, siz bilmezsiniz. (Bakara Suresi, 216)"
                }
            } 
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { 
            base: { 
                emoji: "❗", 
                arText: "اِعْلَمْ", 
                trText: "Bil!",
                ornek: {
                    ar: "فَاعْلَمْ أَنَّهُ لَا إِلَٰهَ إِلَّا اللهُ",
                    tr: "Bil ki, Allah'tan başka hiçbir ilah yoktur. (Muhammed Suresi, 19)"
                }
            } 
        },

        // --- 20 Numaralı Kalıp (فِعْل - Masdar) ---
        20: { 
            base: { 
                emoji: "📖", 
                arText: "عِلْم", 
                trText: "İlim / Bilgi.",
                ornek: {
                    ar: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
                    tr: "İlim öğrenmek her Müslüman'a farzdır. (Hadis-i Şerif)"
                }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "🎓", 
                arText: "عَالِم", 
                trText: "Bilen / Alim.",
                ornek: {
                    ar: "الْعَالِمُ يَعْرِفُ الْجَاهِلَ لِأَنَّهُ كَانَ جَاهِلًا",
                    tr: "Âlim cahili tanır, çünkü kendisi de (eskiden) cahildi. (Arap Özdeyişi)"
                }
            }, 
            suggestsPlus: true, 
            "ة": { 
                emoji: "🧕", 
                arText: "عَالِمَة", 
                trText: "Kadın âlim.",
                ornek: {
                    ar: "عَائِشَةُ رَضِيَ اللهُ عَنْهَا كَانَتْ عَالِمَةً جَلِيلَةً",
                    tr: "Hz. Aişe (r.a.) büyük ve yüce bir âlimdi."
                }
            }, 
            "ونَ": { 
                emoji: "👨‍🎓", 
                arText: "عَالِمُونَ", 
                trText: "Âlimler / Bilenler (Düzenli Çoğul).",
                ornek: {
                    ar: "وَمَا يَعْقِلُهَا إِلَّا الْعَالِمُونَ",
                    tr: "Bunu (bu misalleri) ancak âlimler (bilenler) akıl edip anlar. (Ankebût Suresi, 43)"
                }
            } 
        },
        
        // --- 34 Numaralı Kalıp (فَعَّالَة - Mübalağa) ---
        34: { 
            suggestsPlus: true, 
            "ة": { 
                emoji: "🧠", 
                arText: "عَلَّامَة", 
                trText: "Çok bilen / Allâme.",
                ornek: {
                    ar: "هُوَ عَلَّامَةُ الْعَصْرِ فِي الْفِقْهِ",
                    tr: "O, fıkıh ilminde asrın allâmesidir (büyük bilginidir)."
                }
            } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "💡", 
                arText: "مَعْلُوم", 
                trText: "Bilinen / Malum.",
                ornek: {
                    ar: "كُلُّ شَيْءٍ مَعْلُومٌ عِنْدَ اللهِ",
                    tr: "Her şey Allah katında malumdur (bilinmektedir)."
                }
            }, 
            suggestsPlus: true, 
            "ات": { 
                emoji: "ℹ️", 
                arText: "مَعْلُومَات", 
                trText: "Bilgiler / Malumat.",
                ornek: {
                    ar: "عَصْرُ الْمَعْلُومَاتِ وَالتِّكْنُولُوجْيَا",
                    tr: "Bilgi (malumat) ve teknoloji çağı."
                }
            } 
        },
        
        // --- 43 Numaralı Kalıp (فُعُول - Çoğul Masdar) ---
        43: { 
            base: { 
                emoji: "🔬", 
                arText: "عُلُوم", 
                trText: "İlimler / Bilimler.",
                ornek: {
                    ar: "الْعُلُومُ النَّافِعَةُ تَبْنِي الْحَضَارَاتِ",
                    tr: "Faydalı ilimler (bilimler) medeniyetleri inşa eder."
                }
            } 
        },
        
        // --- 46 Numaralı Kalıp (فُعَلَاء - Çoğul İsm-i Fail) ---
        46: { 
            base: { 
                emoji: "👥", 
                arText: "عُلَمَاء", 
                trText: "Âlimler.",
                ornek: [
                    {
                        ar: "الْعُلَمَاءُ وَرَثَةُ الْأَنْبِيَاءِ",
                        tr: "Âlimler peygamberlerin varisleridir. (Hadis-i Şerif)"
                    },
                    {
                        ar: "إِنَّمَا يَخْشَى الله مِنْ عِبَادِهِ الْعُلَمَاءُ",
                        tr: "Kulları içinden ancak âlimler, Allah'tan (hakkıyla) korkar. (Fâtır Suresi, 28)"
                    }
                ]
            }
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { 
            base: { 
                emoji: "🗣️", 
                arText: "عَلَّمَ", 
                trText: "Öğretti.",
                ornek: {
                    ar: "الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ",
                    tr: "Rahmân, Kur'an'ı öğretti. (Rahmân Suresi, 1-2)"
                }
            } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { 
            base: { 
                emoji: "📢", 
                arText: "يُعَلِّمُ", 
                trText: "Öğretir / Öğretiyor.",
                ornek: {
                    ar: "وَيُعَلِّمُكُمُ اللهُ ۗ وَاللهُ بِكُلِّ شَيْءٍ عَلِيمٌ",
                    tr: "Allah size öğretiyor. Allah her şeyi hakkıyla bilendir. (Bakara Suresi, 282)"
                }
            } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { 
            base: { 
                emoji: "📝", 
                arText: "عَلِّمْ", 
                trText: "Öğret!",
                ornek: {
                    ar: "عَلِّمْ النَّاسَ الْخَيْرَ",
                    tr: "İnsanlara hayrı (iyiliği) öğret. (Hadis-i Şerif'ten mülhem)"
                }
            } 
        },
        
        // --- 61 Numaralı Kalıp (تَفْعِيل - Masdar / Tef'îl Babı) ---
        61: { 
            base: { 
                emoji: "🏫", 
                arText: "تَعْلِيم", 
                trText: "Eğitim / Öğretim.",
                ornek: {
                    ar: "وِزَارَةُ التَّرْبِيَةِ وَالتَّعْلِيمِ",
                    tr: "Milli Eğitim (Terbiye ve Talim) Bakanlığı."
                }
            },
            suggestsPlus: true, 
            "ات": { 
                emoji: "📋", 
                arText: "تَعْلِيمَات", 
                trText: "Talimatlar / Yönergeler.",
                ornek: {
                    ar: "يَجِبُ اتِّبَاعُ تَعْلِيمَاتِ السَّلَامَةِ",
                    tr: "Güvenlik talimatlarına (kurallarına) uyulması zorunludur."
                }
            } 
        },
        
        // --- 62 Numaralı Kalıp (مُفَعِّل - İsm-i Fail / Tef'îl Babı) ---
        62: { 
            base: { 
                emoji: "👨‍🏫", 
                arText: "مُعَلِّم", 
                trText: "Öğretmen.",
                ornek: [
                    {
                        ar: "مَنْ عَلَّمَنِي حَرْفًا صِرْتُ لَهُ عَبْدًا",
                        tr: "Bana bir harf öğretenin kölesi olurum. (Hz. Ali)"
                    },
                    {
                        ar: "كادَ المُعَلِّمُ أَن يَكونَ رَسولاً",
                        tr: "Öğretmen neredeyse bir elçi (peygamber) olacaktı. (Ahmed Şevki'nin meşhur şiirinden)"
                    }
                ]
            }, 
            suggestsPlus: true, 
            "ة": { 
                emoji: "👩‍🏫", 
                arText: "مُعَلِّمَة", 
                trText: "Kadın öğretmen.",
                ornek: {
                    ar: "هِيَ مُعَلِّمَةٌ مُخْلِصَةٌ فِي عَمَلِهَا",
                    tr: "O, işinde çok ihlaslı (samimi) bir öğretmendir."
                }
            } 
        },

        // --- 88 Numaralı Kalıp (تَفَعَّلَ - Mazi / Tefe'ul Babı) ---
        88: { 
            base: { 
                emoji: "🕋", 
                arText: "تَعَلَّمَ", 
                trText: "Öğrendi.",
                ornek: {
                    ar: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
                    tr: "Sizin en hayırlınız Kur'an'ı öğrenen ve öğreteninizdir. (Hadis-i Şerif)"
                }
            } 
        },
        
        // --- 89 Numaralı Kalıp (يَتَفَعَّلُ - Muzari / Tefe'ul Babı) ---
        89: { 
            base: { 
                emoji: "📚", 
                arText: "يَتَعَلَّمُ", 
                trText: "Öğrenir / Öğreniyor.",
                ornek: {
                    ar: "وَيَتَعَلَّمُونَ مَا يَضُرُّهُمْ وَلَا يَنْفَعُهُمْ",
                    tr: "Onlar, kendilerine zarar verip fayda sağlamayan şeyi öğreniyorlar. (Bakara Suresi, 102)"
                }
            } 
        },
        
        // --- 90 Numaralı Kalıp (تَفَعَّلْ - Emir / Tefe'ul Babı) ---
        90: { 
            base: { 
                emoji: "✍️", 
                arText: "تَعَلَّمْ", 
                trText: "Öğren!",
                ornek: {
                    ar: "تَعَلَّمُوا الْعَرَبِيَّةَ فَإِنَّهَا مِنْ دِينِكُمْ",
                    tr: "Arapçayı öğrenin, çünkü o dininizdendir. (Hz. Ömer r.a.)"
                }
            } 
        },
        
        // --- 91 Numaralı Kalıp (تَفَعُّل - Masdar / Tefe'ul Babı) ---
        91: { 
            base: { 
                emoji: "🎓", 
                arText: "تَعَلُّـم", 
                trText: "Öğrenim / Öğrenme.",
                ornek: {
                    ar: "التَّعَلُّمُ فِي الصِّغَرِ كَالنَّقْشِ عَلَى الْحَجَرِ",
                    tr: "Çocuklukta öğrenmek, taşa kazımak gibidir. (Arap Atasözü)"
                }
            } 
        }
    },

// ==================================================================
    // 42. Q-D-R (ق د ر) KÖKÜ - Ölçmek / Güç Yetirmek / Değer / Kader
    // 2. Bab (فَعَلَ - يَفْعِلُ), Tef'îl ve İfti'âl Babları
    // ==================================================================
    "قدر": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 2. Bab) ---
        1: { 
            base: { 
                emoji: "📏", 
                arText: "قَدَرَ", 
                trText: "Ölçtü / Güç yetirdi.",
                ornek: {
                    ar: "وَمَا قَدَرُوا اللهَ حَقَّ قَدْرِهِ",
                    tr: "Onlar Allah'ı hakkıyla takdir edemediler (kudretini bilemediler). (Zümer Suresi, 67)"
                }
            } 
        },
        
        // --- 4 Numaralı Kalıp (يَفْعِلُ - Muzari / 2. Bab) ---
        4: { 
            base: { 
                emoji: "💪", 
                arText: "يَقْدِرُ", 
                trText: "Güç yetirir / Ölçüyor.",
                ornek: {
                    ar: "وَاللهُ يَقْدِرُ اللَّيْلَ وَالنَّهَارَ",
                    tr: "Geceyi ve gündüzü Allah ölçüp belirler (takdir eder). (Müzzemmil Suresi, 20)"
                }
            } 
        },
        
        // --- 5 Numaralı Kalıp (اِفْعِلْ - Emir / 2. Bab) ---
        5: { 
            base: { emoji: "❗", arText: "اِقْدِرْ", trText: "Güç yetir!" } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { 
                emoji: "✨", 
                arText: "قَدَر", 
                trText: "Kader / Ölçü.",
                ornek: {
                    ar: "إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ",
                    tr: "Şüphesiz biz her şeyi bir ölçüye göre (kaderle) yarattık. (Kamer Suresi, 49)"
                }
            } 
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: {
            base: {
                emoji: "💎",
                arText: "قَدْر",
                trText: "Değer / Kadir / Kıymet.",
                ornek: [
                    {
                        ar: "لَا يَعْرِفُ قَدْرَ النِّعْمَةِ إِلَّا فَاقِدُهَا",
                        tr: "Nimetin kadrini (değerini/kıymetini) ancak onu kaybeden bilir. (Arap Özdeyişi)"
                    },
                    {
                        ar: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ",
                        tr: "Kadir gecesi bin aydan daha hayırlıdır. (Kadir Suresi, 3)"
                    }
                ]
            }
        },
        
        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            suggestsPlus: true, 
            "ة": { 
                emoji: "💪", 
                arText: "قُدْرَة", 
                trText: "Kudret / Güç.",
                ornek: {
                    ar: "قُدْرَةُ اللهِ لَا حُدُودَ لَهَا",
                    tr: "Allah'ın kudretinin (gücünün) sınırı yoktur."
                }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "🌟", 
                arText: "قَادِر", 
                trText: "Kadir / Gücü yeten.",
                ornek: {
                    ar: "وَاللهُ عَلَىٰ كُلِّ شَيْءٍ قَادِرٌ",
                    tr: "Allah her şeye kadirdir (güç yetirendir). (Bakara Suresi, 284)"
                }
            } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "🌌", 
                arText: "قَدِير", 
                trText: "Her şeye gücü yeten (Kadir).",
                ornek: {
                    ar: "إِنَّ اللهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
                    tr: "Şüphesiz Allah her şeye kadirdir (sonsuz güç sahibidir). (Bakara Suresi, 20)"
                }
            } 
        },
        
        // --- 40 Numaralı Kalıp (مِفْعَال) ---
        40: { 
            base: { 
                emoji: "📊", 
                arText: "مِقْدَار", 
                trText: "Miktar / Ölçü.",
                ornek: {
                    ar: "وَكُلُّ شَيْءٍ عِندَهُ بِمِقْدَارٍ",
                    tr: "O'nun katında her şey bir ölçü (miktar) iledir. (Ra'd Suresi, 8)"
                }
            } 
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { 
            base: { 
                emoji: "👏", 
                arText: "قَدَّرَ", 
                trText: "Takdir etti / Değer biçti.",
                ornek: {
                    ar: "فَخَلَقَ فَسَوَّىٰ ۝ وَالَّذِي قَدَّرَ فَهَدَىٰ",
                    tr: "O, yaratıp şekil veren, her şeyi ölçüyle yapıp (takdir edip) yol gösterendir. (A'lâ Suresi, 2-3)"
                }
            } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { 
            base: { emoji: "📝", arText: "يُقَدِّرُ", trText: "Takdir eder / Değer biçiyor." } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { 
            base: { emoji: "❗", arText: "قَدِّرْ", trText: "Takdir et / Değer biç!" } 
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { 
                emoji: "👏", 
                arText: "تَقْدِير", 
                trText: "Takdir / Değer biçme.",
                ornek: {
                    ar: "حَصَلَ عَلَى شَهَادَةِ تَقْدِيرٍ",
                    tr: "Bir takdir (teşekkür) belgesi aldı."
                }
            } 
        },
        
        // --- 63 Numaralı Kalıp (مُفَعَّل - Tef'îl Babı İsm-i Mef'ulü) ---
        63: { 
            suggestsPlus: true, 
            "ات": { 
                emoji: "🔮", 
                arText: "مُقَدَّرَات", 
                trText: "Mukadderat / Alın yazısı.",
                ornek: {
                    ar: "مُقَدَّرَاتُ الْإِنْسَانِ مَكْتُوبَةٌ",
                    tr: "İnsanın mukadderatı (alın yazısı) yazılmıştır."
                }
            } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - Mazi / İfti'âl Babı) ---
        77: { 
            base: { emoji: "👑", arText: "اِقْتَدَرَ", trText: "Güç yetirdi / İktidar sahibi oldu." } 
        },
        
        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - Muzari / İfti'âl Babı) ---
        78: { 
            base: { emoji: "💪", arText: "يَقْتَدِرُ", trText: "Güç yetirir / Muktedir oluyor." } 
        },
        
        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - Emir / İfti'âl Babı) ---
        79: { 
            base: { emoji: "❗", arText: "اِقْتَدِرْ", trText: "Güç yetir!" } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "👑", 
                arText: "اِقْتِدَار", 
                trText: "İktidar / Güç yetirme.",
                ornek: {
                    ar: "حِزْبُ الِاقْتِدَارِ فِي تُرْكِيَا",
                    tr: "Türkiye'de iktidar (yönetme gücünde olan) partisi."
                }
            } 
        },
        
        // --- 81 Numaralı Kalıp (مُفْتَعِل - İfti'âl Babı İsm-i Faili) ---
        81: { 
            base: { 
                emoji: "🦁", 
                arText: "مُقْتَدِر", 
                trText: "Muktedir / Gücü yeten.",
                ornek: {
                    ar: "فِي مَقْعَدِ صِدْقٍ عِندَ مَلِيكٍ مُّقْتَدِرٍ",
                    tr: "Güçlü bir padişahın (Muktedir olan Allah'ın) katında, doğruluk koltuğundadırlar. (Kamer Suresi, 55)"
                }
            } 
        }
    },

    // ==================================================================
    // 49. K-M-L (ك م ل) KÖKÜ - Tamamlamak / Olgunluk / Kusursuzluk
    // 1. Bab (فَعَلَ - يَفْعُلُ), İf'âl ve Tef'îl Babları
    // ==================================================================
    "كمل": {
        // --- 22 Numaralı Kalıp (فَعَال) ---
        22: { 
            base: { 
                emoji: "🌟", 
                arText: "كَمَال", 
                trText: "Kemal / Kusursuzluk.",
                ornek: { ar: "الْكَمَالُ لِلهِ وَحْدَهُ", tr: "Kemal (kusursuzluk) sadece Allah'a mahsustur." }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "🌕", 
                arText: "كَامِل", 
                trText: "Kamil / Tam.",
                ornek: { ar: "بَدْرٌ كَامِلٌ", tr: "Kamil (tam) dolunay." }
            } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - Mazi / İf'âl Babı) ---
        52: { 
            base: { emoji: "✅", arText: "أَكْمَلَ", trText: "Tamamladı (İkmal etti)." },
            suggestsPlus: true,
            "تُ": { 
                emoji: "🤲", 
                arText: "أَكْمَلْتُ", 
                trText: "Ben tamamladım.",
                ornek: { ar: "الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ", tr: "Bugün sizin için dininizi kemale erdirdim (tamamladım). (Mâide Suresi, 3)" }
            }
        },
        
        // --- 53 Numaralı Kalıp (يُفْعِلُ - Muzari / İf'âl Babı) ---
        53: { base: { emoji: "⏳", arText: "يُكْمِلُ", trText: "Tamamlar / Tamamlıyor." } },
        
        // --- 54 Numaralı Kalıp (أَفْعِلْ - Emir / İf'âl Babı) ---
        54: { base: { emoji: "❗", arText: "أَكْمِلْ", trText: "Tamamla!" } },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "🧩", 
                arText: "إِكْمَال", 
                trText: "İkmal / Tamamlama.",
                ornek: { ar: "إِكْمَالُ النَّقْصِ", tr: "Eksiği tamamlama (ikmal)." }
            } 
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { base: { emoji: "🎨", arText: "كَمَّلَ", trText: "Eksiksiz yaptı / Mükemmelleştirdi." } },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { base: { emoji: "🖌️", arText: "يُكَمِّلُ", trText: "Eksiksiz yapar / Mükemmelleştiriyor." } },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { base: { emoji: "💯", arText: "كَمِّلْ", trText: "Eksiksiz yap!" } },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { base: { emoji: "✅", arText: "تَكْمِيل", trText: "Tamamlama." } },
        
        // --- 63 Numaralı Kalıp (مُفَعَّل - Tef'îl Babı İsm-i Mef'ulü) ---
        63: { 
            base: { 
                emoji: "💯", 
                arText: "مُكَمَّل", 
                trText: "Mükemmel / Eksiksiz.",
                ornek: { ar: "عَمَلٌ مُكَمَّلٌ وَرَائِعٌ", tr: "Mükemmel (eksiksiz) ve harika bir iş." }
            } 
        }
    },

     // ==================================================================
    // 43. M-L-K (م ل ك) KÖKÜ - Sahip Olmak / Yönetmek / Melek
    // ==================================================================
    "ملك": {
        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { 
                emoji: "👼", 
                arText: "مَلَك", 
                trText: "Melek.",
                ornek: {
                    ar: "الْمَلَائِكَةُ عِبَادٌ مُكْرَمُونَ",
                    tr: "Melekler (Allah'ın) ikram olunmuş kullarıdır. (Enbiyâ Suresi, 26'dan mülhem)"
                }
            } 
        },
        
        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            base: { 
                emoji: "👑", 
                arText: "مُلْك", 
                trText: "Mülk / Hükümranlık.",
                ornek: {
                    ar: "لِلهِ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ",
                    tr: "Göklerin ve yerin mülkü (hükümranlığı) Allah'ındır. (Şûrâ Suresi, 49)"
                }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "🔑", 
                arText: "مَالِك", 
                trText: "Sahip / Malik.",
                ornek: {
                    ar: "مَالِكِ يَوْمِ الدِّينِ",
                    tr: "Din gününün maliki (sahibi)dir. (Fâtiha Suresi, 4)"
                }
            } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "🤴", 
                arText: "مَلِيك", 
                trText: "Kral / Güçlü Hükümdar.",
                ornek: {
                    ar: "فِي مَقْعَدِ صِدْقٍ عِندَ مَلِيكٍ مُّقْتَدِرٍ",
                    tr: "Güçlü bir padişahın (Melik'in) katında, doğruluk koltuğundadırlar. (Kamer Suresi, 55)"
                }
            }, 
            suggestsPlus: true, 
            "ة": { 
                emoji: "👸", 
                arText: "مَلِيكَة", 
                trText: "Kraliçe.",
                ornek: {
                    ar: "مَلِيكَةُ النَّحْلِ",
                    tr: "Kraliçe arı."
                }
            } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "🛡️", 
                arText: "مَمْلُوك", 
                trText: "Köle / Sahip olunan / Memlük.",
                ornek: {
                    ar: "الدَّوْلَةُ الْمَمْلُوكِيَّةُ فِي التَّارِيخِ",
                    tr: "Tarihteki Memlük (köleleştirilmiş asker/hükümdar) Devleti."
                }
            } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: {
                emoji: "📍",
                arText: "مَمْلَك",
                trText: "Hüküm sürülen yer."
            },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🏰", 
                arText: "مَمْلَكَة", 
                trText: "Krallık / Memleket.",
                ornek: {
                    ar: "الْمَمْلَكَةُ الْعَرَبِيَّةُ السُّعُودِيَّةُ",
                    tr: "Suudi Arabistan Krallığı (Arapçada krallık, Türkçede yurt/memleket)."
                }
            } 
        },
        
        // --- 41 Numaralı Kalıp (أَفْعَال) ---
        41: { 
            base: { 
                emoji: "🏢", 
                arText: "أَمْلَاك", 
                trText: "Mülkler / Emlak.",
                ornek: {
                    ar: "مَكْتَبُ الْأَمْلَاكِ وَالْعَقَارَاتِ",
                    tr: "Emlak (mülkler) ve gayrimenkul ofisi."
                }
            } 
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - İstif'âl Masdarı) ---
        103: {
            base: {
                emoji: "📝",
                arText: "اِسْتِمْلَاك",
                trText: "Kamulaştırma / Mülk edinme (İstimlak).",
                ornek: {
                    ar: "قَرَّرَتِ الْبَلَدِيَّةُ اسْتِمْلَاكَ هَذِهِ الْأَرَاضِي",
                    tr: "Belediye bu arazileri istimlak etme (kamulaştırma) kararı aldı."
                }
            }
        }
    },

     // ==================================================================
    // 19. H-K-M (ح ك م) KÖKÜ - Hükmetmek / Yargılamak / Bilgelik
    // 1. Bab (فَعَلَ - يَفْعُلُ), Müfâ'ale ve Tefe'ul Babları
    // ==================================================================
    "حكم": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { 
            base: { 
                emoji: "⚖️", 
                arText: "حَكَمَ", 
                trText: "Hükmetti / Karar verdi.",
                ornek: { ar: "وَحَكَمَ بَيْنَهُمْ بِالْعَدْلِ", tr: "Ve aralarında adaletle hükmetti." }
            } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { 
            base: { 
                emoji: "🧑‍⚖️", 
                arText: "يَحْكُمُ", 
                trText: "Hükmeder / Karar veriyor.",
                ornek: { ar: "وَاللهُ يَحْكُمُ لَا مُعَقِّبَ لِحُكْمِهِ", tr: "Allah hükmeder, O'nun hükmünü bozacak kimse yoktur. (Ra'd Suresi, 41)" }
            } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { 
            base: { 
                emoji: "🔨", 
                arText: "اُحْكُمْ", 
                trText: "Hükmet / Karar ver!",
                ornek: { ar: "فَاحْكُم بَيْنَنَا بِالْحَقِّ", tr: "Aramızda hak ile hükmet. (Sâd Suresi, 22)" }
            } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { 
                emoji: "🏁", 
                arText: "حَكَم", 
                trText: "Hakem / Karar verici.",
                ornek: { ar: "فَابْعَثُوا حَكَمًا مِّنْ أَهْلِهِ وَحَكَمًا مِّنْ أَهْلِهَا", tr: "Erkeğin ailesinden bir hakem ve kadının ailesinden bir hakem gönderin. (Nisâ Suresi, 35)" }
            } 
        },

        // --- 20 Numaralı Kalıp (فِعْل) ---
        20: { 
            base: { emoji: "📖", arText: "حِكْم", trText: "Hikmet (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🦉", 
                arText: "حِكْمَة", 
                trText: "Hikmet / Bilgelik.",
                ornek: { ar: "يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ", tr: "Allah hikmeti (bilgeliği) dilediğine verir. (Bakara Suresi, 269)" } 
            } 
        },
        
        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            base: { 
                emoji: "📜", 
                arText: "حُكْم", 
                trText: "Hüküm / Karar.",
                ornek: { ar: "إِنِ الْحُكْمُ إِلَّا لِلهِ", tr: "Hüküm ancak Allah'ındır. (Yusuf Suresi, 40)" }
            } 
        },
        
        // --- 25 Numaralı Kalıp (فُعُول) ---
        25: { 
            base: { emoji: "🏛️", arText: "حُكُوم", trText: "Hükümet (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🏛️", 
                arText: "حُكُومَة", 
                trText: "Hükümet.",
                ornek: { ar: "رَئِيسُ الْحُكُومَةِ", tr: "Hükümet başkanı." } 
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "🧑‍⚖️", 
                arText: "حَاكِم", 
                trText: "Hakim / Yönetici.",
                ornek: { ar: "هُوَ حَاكِمٌ عَادِلٌ", tr: "O, adil bir yöneticidir (hakimdir)." }
            } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "💎", 
                arText: "حَكِيم", 
                trText: "Hakîm / Bilge / Hüküm sahibi.",
                ornek: { ar: "وَهُوَ الْعَزِيزُ الْحَكِيمُ", tr: "O, mutlak güç sahibidir, hüküm ve hikmet sahibidir. (İbrahim Suresi, 4)" }
            } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "⛓️", 
                arText: "مَحْكُوم", 
                trText: "Mahkum / Hüküm giymiş.",
                ornek: { ar: "مَحْكُومٌ عَلَيْهِ بِالسِّجْنِ", tr: "Hapse mahkum edilmiştir." }
            } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { emoji: "⚖️", arText: "مَحْكَم", trText: "Mahkeme (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "⚖️", 
                arText: "مَحْكَمَة", 
                trText: "Mahkeme.",
                ornek: { ar: "قَرَارُ الْمَحْكَمَةِ الْعُلْيَا", tr: "Yüksek mahkemenin kararı." } 
            } 
        },

        // --- 64 Numaralı Kalıp (فَاعَلَ - Mazi / Müfâ'ale Babı) ---
        64: { 
            base: { 
                emoji: "👨‍⚖️", 
                arText: "حَاكَمَ", 
                trText: "Yargıladı / Muhakeme etti.",
                ornek: { ar: "حَاكَمَ الْقَاضِي الْمُتَّهَمَ", tr: "Hakim sanığı yargıladı." }
            } 
        },
        
        // --- 65 Numaralı Kalıp (يُفَاعِلُ - Muzari / Müfâ'ale Babı) ---
        65: { 
            base: { 
                emoji: "⚖️", 
                arText: "يُحَاكِمُ", 
                trText: "Yargılar / Yargılıyor.",
                ornek: { ar: "الْمَحْكَمَةُ تُحَاكِمُ الْمُجْرِمِينَ", tr: "Mahkeme suçluları yargılar." }
            } 
        },
        
        // --- 66 Numaralı Kalıp (فَاعِلْ - Emir / Müfâ'ale Babı) ---
        66: { 
            base: { emoji: "❗", arText: "حَاكِمْ", trText: "Yargıla / Muhakeme et!" } 
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Müfâ'ale Masdarı) ---
        67: { 
            base: { 
                emoji: "📝", 
                arText: "مُحَاكَمَة", 
                trText: "Yargılama / Muhakeme.",
                ornek: { ar: "مُحَاكَمَةٌ عَادِلَةٌ", tr: "Adil bir yargılama (muhakeme)." }
            } 
        },

        // --- 88 Numaralı Kalıp (تَفَعَّلَ - Mazi / Tefe'ul Babı) ---
        88: { 
            base: { 
                emoji: "🎮", 
                arText: "تَحَكَّمَ", 
                trText: "Kontrol etti / Hakim oldu.",
                ornek: { ar: "تَحَكَّمَ فِي مَشَاعِرِهِ", tr: "Duygularını kontrol etti (duygularına hakim oldu)." }
            } 
        },
        
        // --- 89 Numaralı Kalıp (يَتَفَعَّلُ - Muzari / Tefe'ul Babı) ---
        89: { 
            base: { emoji: "🕹️", arText: "يَتَحَكَّمُ", trText: "Kontrol eder / Yönetiyor." } 
        },
        
        // --- 90 Numaralı Kalıp (تَفَعَّلْ - Emir / Tefe'ul Babı) ---
        90: { 
            base: { emoji: "🛑", arText: "تَحَكَّمْ", trText: "Kontrol et / Hakim ol!" } 
        },

        // --- 91 Numaralı Kalıp (تَفَعُّل - Tefe'ul Masdarı) ---
        91: { 
            base: { emoji: "🎛️", arText: "تَحَكُّم", trText: "Kontrol / Hakimiyet." },
            suggestsPlus: true,
            "ات": { 
                emoji: "⚙️", 
                arText: "تَحَكُّمَات", 
                trText: "Kontroller / Yönlendirmeler.",
                ornek: { ar: "لَوْحَةُ التَّحَكُّمِ", tr: "Kontrol paneli." } 
            } 
        }
    },


    // ==================================================================
    // 20. '-R-F (ع ر ف) KÖKÜ - Bilmek / Tanımak / İtiraf Etmek
    // 2. Bab (فَعَلَ - يَفْعِلُ), Tef'îl, İfti'âl ve Tefâ'ul Babları
    // ==================================================================
    "عرف": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 2. Bab) ---
        1: { 
            base: { 
                emoji: "🧠", 
                arText: "عَرَفَ", 
                trText: "Bildi / Tanıdı.",
                ornek: { ar: "عَرَفَ الْحَقَّ فَاتَّبَعَهُ", tr: "Hakkı (gerçeği) bildi ve ona uydu." }
            } 
        },
        
        // --- 4 Numaralı Kalıp (يَفْعِلُ - Muzari / 2. Bab) ---
        4: { 
            base: { 
                emoji: "🤔", 
                arText: "يَعْرِفُ", 
                trText: "Bilir / Tanıyor.",
                ornek: { ar: "يَعْرِفُونَ نِعْمَتَ اللهِ ثُمَّ يُنكِرُونَهَا", tr: "Allah'ın nimetini bilirler (tanırlar), sonra da onu inkar ederler. (Nahl Suresi, 83)" }
            } 
        },
        
        // --- 5 Numaralı Kalıp (اِفْعِلْ - Emir / 2. Bab) ---
        5: { 
            base: { 
                emoji: "💡", 
                arText: "اِعْرِفْ", 
                trText: "Bil / Tanı!",
                ornek: { ar: "اِعْرِفْ قَدْرَكَ", tr: "Haddini (değerini) bil!" }
            } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { emoji: "⛰️", arText: "عَرَف", trText: "Arafat (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "⛰️", 
                arText: "عَرَفَة", 
                trText: "Arafat tepesi.",
                ornek: { ar: "الْحَجُّ عَرَفَةُ", tr: "Hac Arafat'tır (Arafat'ta vakfe yapmaktır). (Hadis-i Şerif)" } 
            } 
        },
        
        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            base: { 
                emoji: "🤝", 
                arText: "عُرْف", 
                trText: "Gelenek / Örf.",
                ornek: { ar: "الْعَادَاتُ وَالْعُرْفُ فِي الْمُجْتَمَعِ", tr: "Toplumdaki adetler ve örf." }
            } 
        },
        
        // --- 29 Numaralı Kalıp (فِعْلَان) ---
        29: { 
            base: { 
                emoji: "🌟", 
                arText: "عِرْفَان", 
                trText: "İrfan / Bilgi / Minnet.",
                ornek: { ar: "بِكُلِّ شُكْرٍ وَعِرْفَانٍ", tr: "Sonsuz teşekkür ve irfanla (minnetle)." }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "🧠", 
                arText: "عَارِف", 
                trText: "Bilen / Arif.",
                ornek: { ar: "الْعَارِفُ تَكْفِيهِ الْإِشَارَةُ", tr: "Ârife tarif gerekmez (işaret yeter). (Arap Atasözü)" }
            } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "👍", 
                arText: "مَعْرُوف", 
                trText: "Bilinen / İyilik / Maruf.",
                ornek: { ar: "وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنكَرِ", tr: "İyiliği (marufu) emret, kötülükten (münkerden) sakındır. (Lokman Suresi, 17)" }
            } 
        },
        
        // --- 37 Numaralı Kalıp (مَفْعِل) ---
        37: { 
            base: { emoji: "💡", arText: "مَعْرِف", trText: "Bilgi kaynağı (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "💡", 
                arText: "مَعْرِفَة", 
                trText: "Bilgi / Marifet.",
                ornek: { ar: "الْمَعْرِفَةُ قُوَّةٌ", tr: "Bilgi (marifet) güçtür." } 
            } 
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { 
            base: { emoji: "🗣️", arText: "عَرَّفَ", trText: "Tanıttı / Tarif etti." } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { 
            base: { emoji: "📢", arText: "يُعَرِّفُ", trText: "Tanıtır / Tarif ediyor." } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { 
            base: { emoji: "📝", arText: "عَرِّفْ", trText: "Tanıt / Tarif et!" } 
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Masdar / Tef'îl Babı) ---
        61: { 
            base: { 
                emoji: "📋", 
                arText: "تَعْرِيف", 
                trText: "Tanımlama / Tarif.",
                ornek: { ar: "تَعْرِيفُ الْمُصْطَلَحِ", tr: "Terimin tanımı (tarifi)." }
            } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - Mazi / İfti'âl Babı) ---
        77: { 
            base: { emoji: "🙌", arText: "اِعْتَرَفَ", trText: "İtiraf etti / Kabul etti." } 
        },
        
        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - Muzari / İfti'âl Babı) ---
        78: { 
            base: { emoji: "🗣️", arText: "يَعْتَرِفُ", trText: "İtiraf eder / Kabul ediyor." } 
        },
        
        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - Emir / İfti'âl Babı) ---
        79: { 
            base: { emoji: "❗", arText: "اِعْتَرِفْ", trText: "İtiraf et / Kabul et!" } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - Masdar / İfti'âl Babı) ---
        80: { 
            base: { 
                emoji: "📜", 
                arText: "اِعْتِرَاف", 
                trText: "İtiraf / Tanıma.",
                ornek: { ar: "الِاعْتِرَافُ بِالْخَطَإِ فَضِيلَةٌ", tr: "Hatayı itiraf etmek erdemdir." }
            } 
        },

        // --- 94 Numaralı Kalıp (تَفَاعَلَ - Mazi / Tefâ'ul Babı) ---
        94: { 
            base: { emoji: "🤝", arText: "تَعَارَفَ", trText: "Tanıştı." } 
        },
        
        // --- 95 Numaralı Kalıp (يَتَفَاعَلُ - Muzari / Tefâ'ul Babı) ---
        95: { 
            base: { emoji: "👥", arText: "يَتَعَارَفُ", trText: "Tanışır / Tanışıyor." },
            suggestsPlus: true,
            "ونَ": { 
                emoji: "🌍", 
                arText: "يَتَعَارَفُونَ", 
                trText: "Tanışırlar (Muzari Çoğul).",
                ornek: { ar: "وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا", tr: "Sizi tanışmanız için milletlere ve kabilelere ayırdık. (Hucurât Suresi, 13)" } 
            }
        },
        
        // --- 96 Numaralı Kalıp (تَفَاعَلْ - Emir / Tefâ'ul Babı) ---
        96: { 
            base: { emoji: "👋", arText: "تَعَارَفْ", trText: "Tanış!" } 
        },

        // --- 97 Numaralı Kalıp (تَفَاعُل - Masdar / Tefâ'ul Babı) ---
        97: { 
            base: { emoji: "🫂", arText: "تَعَارُف", trText: "Tanışma / Birbirini tanıma." },
            suggestsPlus: true,
            "ات": { 
                emoji: "🤝", 
                arText: "تَعَارُفَات", 
                trText: "Tanışmalar.",
                ornek: { ar: "لِقَاءَاتٌ وَتَعَارُفَاتٌ جَدِيدَةٌ", tr: "Yeni buluşmalar ve tanışmalar." }
            }
        }
    },


   // ==================================================================
    // 22. R-H-M (ر ح م) KÖKÜ - Merhamet Etmek / Acımak
    // 4. Bab (فَعِلَ - يَفْعَلُ) ve İsti'fal Babı
    // ==================================================================
    "رحم": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / 4. Bab) ---
        8: { 
            base: { 
                emoji: "❤️", 
                arText: "رَحِمَ", 
                trText: "Merhamet etti / Acıdı.",
                ornek: { ar: "فَقَدْ رَحِمَهُ اللهُ", tr: "Allah ona kesinlikle merhamet etmiştir." }
            } 
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { 
            base: { 
                emoji: "🤲", 
                arText: "يَرْحَمُ", 
                trText: "Merhamet eder / Acıyor.",
                ornek: { ar: "مَنْ لَا يَرْحَمْ لَا يُرْحَمْ", tr: "Merhamet etmeyene merhamet edilmez. (Hadis-i Şerif)" }
            } 
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { 
            base: { 
                emoji: "🙏", 
                arText: "اِرْحَمْ", 
                trText: "Merhamet et / Acı!",
                ornek: { ar: "اِرْحَمْ مَنْ فِي الْأَرْضِ يَرْحَمْكَ مَنْ فِي السَّمَاءِ", tr: "Yerdekilere merhamet et ki, gökteki (Allah) da sana merhamet etsin. (Hadis-i Şerif)" }
            } 
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            base: {},
            suggestsPlus: true, 
            "ة": { 
                emoji: "🌧️", 
                arText: "رَحْمَة", 
                trText: "Rahmet / Merhamet.",
                ornek: { ar: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ", tr: "Biz seni ancak âlemlere rahmet olarak gönderdik. (Enbiyâ Suresi, 107)" } 
            } 
        },

         // --- 28 Numaralı Kalıp (فَعْلَان) ---
        28: { 
            base: { 
                emoji: "💖", 
                arText: "رَحْمَان", 
                trText: "Rahman / Sonsuz merhamet sahibi.",
                ornek: [
                    { 
                        ar: "الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ", 
                        tr: "Rahmân, Kur'an'ı öğretti. (Rahmân Suresi, 1-2)" 
                    },
                    {
                        ar: "💡 قَاعِدَة إِمْلَائِيَّة",
                        tr: "İmla Kuralı: Bu kelime genellikle uzun okutulan Elif harfi yazılmadan, harfin üzerinde küçük bir asar (dik üstün) işaretiyle 'الرَّحْمَٰن' şeklinde özel olarak yazılır."
                    }
                ]
            } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "🤍", 
                arText: "رَحِيم", 
                trText: "Çok merhamet eden (Rahim).",
                ornek: { ar: "بِسْمِ اللهِ الرَّحْمَٰنِ الرَّحِيمِ", tr: "Rahman ve Rahim olan Allah'ın adıyla." }
            } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "🤲", 
                arText: "مَرْحُوم", 
                trText: "Kendisine merhamet edilen (Merhum / Vefat etmiş kişi).",
                ornek: { ar: "رَحِمَهُ اللهُ رَحْمَةً وَاسِعَةً", tr: "Allah ona geniş bir rahmetle merhamet etsin (Merhum / Vefat etmiş kişi)." }
            } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { emoji: "🤝", arText: "مَرْحَم", trText: "Merhamet yeri (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🤝", 
                arText: "مَرْحَمَة", 
                trText: "Merhamet.",
                ornek: { ar: "وَتَوَاصَوْا بِالصَّبْرِ وَتَوَاصَوْا بِالْمَرْحَمَةِ", tr: "Birbirlerine sabrı ve merhameti tavsiye edenler... (Beled Suresi, 17)" } 
            } 
        },

        // --- 100 Numaralı Kalıp (اِسْتَفْعَلَ - Mazi / İsti'fal Babı) ---
        100: { 
            base: { emoji: "😔", arText: "اِسْتَرْحَمَ", trText: "Merhamet diledi / İstirham etti." } 
        },
        
        // --- 101 Numaralı Kalıp (يَسْتَفْعِلُ - Muzari / İsti'fal Babı) ---
        101: { 
            base: { emoji: "🥺", arText: "يَسْتَرْحِمُ", trText: "Merhamet diler / İstirham ediyor." } 
        },
        
        // --- 102 Numaralı Kalıp (اِسْتَفْعِلْ - Emir / İsti'fal Babı) ---
        102: { 
            base: { emoji: "🙏", arText: "اِسْتَرْحِمْ", trText: "Merhamet dile / İstirham et!" } 
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - Masdar / İsti'fal Babı) ---
        103: { 
            base: { 
                emoji: "📜", 
                arText: "اِسْتِرْحَام", 
                trText: "Merhamet dileme / İstirham.",
                ornek: { ar: "أَقَدِّمُ إِلَيْكُمْ رِسَالَةَ اسْتِرْحَامٍ", tr: "Size bir istirham (merhamet/rica) dilekçesi sunuyorum." }
            } 
        }
    },

// ==================================================================
    // 36. S-L-M (س ل م) KÖKÜ - Barış / Kurtuluş / Teslim Olmak
    // 4. Bab (فَعِلَ - يَفْعَلُ)
    // ==================================================================
    "سلم": {
        // --- 8, 9, 10 Numaralı Kalıplar (4. Bab) ---
        8: { base: { emoji: "🕊️", arText: "سَلِمَ", trText: "Kurtuldu / Güvende oldu." } },
        9: { base: { emoji: "😌", arText: "يَسْلَمُ", trText: "Kurtulur / Güvende olur." } },
        10: { base: { emoji: "🛡️", arText: "اِسْلَمْ", trText: "Kurtul / Güvende ol!" } },

        // --- 22 Numaralı Kalıp (فَعَال) ---
        22: { 
            base: { 
                emoji: "🕊️", 
                arText: "سَلَام", 
                trText: "Barış / Selam.",
                ornek: { ar: "أَفْشُوا السَّلَامَ بَيْنَكُمْ", tr: "Aranızda selamı yayınız. (Hadis-i Şerif)" }
            }, 
            suggestsPlus: true, 
            "ة": { 
                emoji: "🛡️", 
                arText: "سَلَامَة", 
                trText: "Selamet / Güvenlik.",
                ornek: { ar: "فِي التَّأَنِّي السَّلَامَةُ", tr: "Acele etmemekte (teennide) selamet vardır. (Atasözü)" }
            } 
        }, 
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { base: { emoji: "😌", arText: "سَالِم", trText: "Sağ salim / Güvende." } }, 
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "🫀", 
                arText: "سَلِيم", 
                trText: "Kusursuz / Sağlam (Selim).",
                ornek: { ar: "إِلَّا مَنْ أَتَى الله بِقَلْبٍ سَلِيمٍ", tr: "Ancak Allah'a temiz (selim) bir kalple gelenler müstesna. (Şuarâ Suresi, 89)" }
            } 
        }, 

        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı) ---
        52: { base: { emoji: "🤲", arText: "أَسْلَمَ", trText: "Teslim oldu / Müslüman oldu." } },
        53: { base: { emoji: "☪️", arText: "يُسْلِمُ", trText: "Teslim olur / Müslüman oluyor." } },
        54: { base: { emoji: "❗", arText: "أَسْلِمْ", trText: "Teslim ol / Müslüman ol!" } },

        // --- 55 Numaralı Kalıp (إِفْعَال) ---
        55: { 
            base: { 
                emoji: "🌙", 
                arText: "إِسْلَام", 
                trText: "İslam / Teslimiyet.",
                ornek: { ar: "إِنَّ الدِّينَ عِنْدَ اللهِ الْإِسْلَامُ", tr: "Şüphesiz Allah katında din İslam'dır. (Âl-i İmrân Suresi, 19)" }
            } 
        }, 
        
        // --- 56 Numaralı Kalıp (مُفْعِل) ---
        56: { 
            base: { 
                emoji: "🤲", 
                arText: "مُسْلِم", 
                trText: "Müslüman.",
                ornek: { ar: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِن لِّسَانِهِ وَيَدِهِ", tr: "Müslüman, diğer Müslümanların onun dilinden ve elinden güvende (salim) olduğu kimsedir. (Hadis-i Şerif)" }
            } 
        }, 
        
        // --- 61 Numaralı Kalıp (تَفْعِيل) ---
        61: { base: { emoji: "📦", arText: "تَسْلِيم", trText: "Teslim." } } 
    },


 // ==================================================================
    // 2. Kh-B-R (خ ب ر) KÖKÜ - Haber Vermek / Bildirmek
    // İf'al Babı (أَفْعَلَ - يُفْعِلُ)
    // ==================================================================
    "خبر": {
        // --- 52 Numaralı Kalıp (أَفْعَلَ - Mazi / İf'al Babı) ---
        52: { 
            base: { emoji: "🗣️", arText: "أَخْبَرَ", trText: "Haber verdi / Bildirdi." } 
        },
        
        // --- 53 Numaralı Kalıp (يُفْعِلُ - Muzari / İf'al Babı) ---
        53: { 
            base: { emoji: "📢", arText: "يُخْبِرُ", trText: "Haber verir / Bildiriyor." } 
        },
        
        // --- 54 Numaralı Kalıp (أَفْعِلْ - Emir / İf'al Babı) ---
        54: { 
            base: { emoji: "❗", arText: "أَخْبِرْ", trText: "Haber ver / Bildir!" } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { 
                emoji: "📰", 
                arText: "خَبَر", 
                trText: "Haber.",
                ornek: { ar: "هَذَا خَبَرٌ عَاجِلٌ", tr: "Bu acil (son dakika) bir haberdir." }
            } 
        },
        
        // --- 41 Numaralı Kalıp (أَفْعَال) ---
        41: { 
            base: { 
                emoji: "📺", 
                arText: "أَخْبَار", 
                trText: "Haberler.",
                ornek: { ar: "نَشْرَةُ الْأَخْبَارِ الْمَسَائِيَّةِ", tr: "Akşam haberleri bülteni." }
            } 
        },
        
        // --- 55 Numaralı Kalıp (إِفْعَال) ---
        55: { 
            base: { emoji: "🫣", arText: "إِخْبَار", trText: "Haber vermek / Bildirmek." } 
        },
        
        // --- 56 Numaralı Kalıp (مُفْعِل) ---
        56: { 
            base: { emoji: "🕵️‍♀️", arText: "مُخْبِر", trText: "Haber veren / Muhbir." } 
        },
        
        // --- 67 Numaralı Kalıp (مُفَاعَلَة) ---
        67: { 
            base: { emoji: "📞", arText: "مُخَابَرَة", trText: "Haberleşme / İletişim." }, 
            suggestsPlus: true, 
            "ات": { 
                emoji: "📡", 
                arText: "مُخَابَرَات", 
                trText: "Muhaberat / Haberleşme ve iletişim ağları." 
            } 
        },
        
        // --- 69 Numaralı Kalıp (مُفَاعِل) ---
        69: { 
            base: { emoji: "🎤", arText: "مُخَابِر", trText: "Muhabir." } 
        },
        
        // --- 103 Numaralı Kalıp (اِسْتِفْعَال) ---
        103: { 
            base: { emoji: "🕵️", arText: "اِسْتِخْبَار", trText: "İstihbarat / Bilgi toplama." },
            suggestsPlus: true,
            "ات": { 
                emoji: "🕵️", 
                arText: "اِسْتِخْبَارَات", 
                trText: "İstihbarat teşkilatı / Haber alma.",
                ornek: { ar: "اِسْتِخْبَارَاتُ الدَّوْلَةِ قَوِيَّةٌ", tr: "Devletin istihbaratı (haber alma teşkilatı) güçlüdür." }
            } 
        }
    },

    // ==================================================================
    // 4. F-T-H (ف ت ح) KÖKÜ - Açmak / Fethetmek
    // 3. Bab (فَعَلَ - يَفْعَلُ)
    // ==================================================================
    "فتح": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi) ---
        1: { 
            base: { emoji: "🔓", arText: "فَتَحَ", trText: "Açtı / Fethetti." } 
        },
        
        // --- 6 Numaralı Kalıp (يَفْعَلُ - Muzari) ---
        6: { 
            base: { emoji: "👐", arText: "يَفْتَحُ", trText: "Açar / Açıyor." } 
        },
        
        // --- 7 Numaralı Kalıp (اِفْعَلْ - Emir) ---
        7: { 
            base: { emoji: "🗝️", arText: "اِفْتَحْ", trText: "Aç!" } 
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            base: { 
                emoji: "🗝️", 
                arText: "فَتْح", 
                trText: "Açma / Fetih / Zafer.",
                ornek: { ar: "إِذَا جَاءَ نَصْرُ اللهِ وَالْفَتْحُ", tr: "Allah'ın yardımı ve fetih (zafer) geldiğinde... (Nasr Suresi, 1)" }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🏇", arText: "فَاتِح", trText: "Fetheden / Fatih." } 
        },
        
        // --- 34 Numaralı Kalıp (فَعَّال) ---
        34: { 
            base: { 
                emoji: "🔑", 
                arText: "فَتَّاح", 
                trText: "Çokça açan / Fettah.",
                ornek: { ar: "يَا فَتَّاحُ افْتَحْ لَنَا أَبْوَابَ الْخَيْرِ", tr: "Ey (her türlü zorluğu açan) Fettah! Bize hayır kapılarını aç." }
            } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "🔓", arText: "مَفْتُوح", trText: "Açık." } 
        },
        
        // --- 40 Numaralı Kalıp (مِفْعَال) ---
        40: { 
            base: { emoji: "🔑", arText: "مِفْتَاح", trText: "Anahtar." } 
        },
        
        // --- 80 Numaralı Kalıp (اِفْتِعَال) ---
        80: { 
            base: { 
                emoji: "🧎🏻‍♂️", 
                arText: "اِفْتِتَاح", 
                trText: "Açılış / Başlangıç.",
                ornek: { ar: "تَكْبِيرَةُ الافْتِتَاحِ فِي الصَّلَاةِ", tr: "Namazdaki ilk (açılış) tekbiri." }
            } 
        }
    },

    // ==================================================================
    // 5. N-Z-M (ن ظ م) KÖKÜ - Düzenlemek / Sıraya Koymak / Şiir Yazmak
    // Tef'il Babı (فَعَّلَ - يُفَعِّلُ)
    // ==================================================================
    "نظم": {
        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'il Babı) ---
        58: { 
            base: { emoji: "🗂️", arText: "نَظَّمَ", trText: "Düzenledi / Organize etti." } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'il Babı) ---
        59: { 
            base: { emoji: "🔄", arText: "يُنَظِّمُ", trText: "Düzenler / Organize ediyor." } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'il Babı) ---
        60: { 
            base: { emoji: "📑", arText: "نَظِّمْ", trText: "Düzenle / Organize et!" } 
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            base: { 
                emoji: "🖋️", 
                arText: "نَظْم", 
                trText: "Nazım / Düzen / Şiir.",
                ornek: { ar: "النَّظْمُ وَالنَّثْرُ فِي الْأَدَبِ", tr: "Edebiyatta nazım (şiir) ve nesir (düzyazı)." }
            } 
        },
        
        // --- 23 Numaralı Kalıp (فِعَال) ---
        23: { 
            base: { 
                emoji: "⚙️", 
                arText: "نِظَام", 
                trText: "Nizam / Düzen / Sistem.",
                ornek: { ar: "النِّظَامُ أَسَاسُ النَّجَاحِ", tr: "Nizam (düzen), başarının temelidir." }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "✍️", arText: "نَاظِم", trText: "Düzenleyen / Şair (Nazım)." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "🎼", arText: "مَنْظُوم", trText: "Dizilmiş / Manzum." }, 
            suggestsPlus: true, 
            "ة": { 
                emoji: "📜", 
                arText: "مَنْظُومَة", 
                trText: "Manzume / Şiir dizeleri.",
                ornek: { ar: "مَنْظُومَةٌ شِعْرِيَّةٌ رَائِعَةٌ", tr: "Harika bir şiir manzumesi." }
            } 
        },
        
        // --- 61 Numaralı Kalıp (تَفْعِيل) ---
        61: { 
            base: { 
                emoji: "📋", 
                arText: "تَنْظِيم", 
                trText: "Düzenleme / Tanzim.",
                ornek: { ar: "تَنْظِيمُ الْوَقْتِ مُهِمٌّ", tr: "Zamanın tanzimi (düzenlenmesi) önemlidir." }
            }, 
            suggestsPlus: true, 
            "ات": { 
                emoji: "📜", 
                arText: "تَنْظِيمَات", 
                trText: "Düzenlemeler (Tanzimat).",
                ornek: { ar: "فَتْرَةُ التَّنْظِيمَاتِ فِي الدَّوْلَةِ الْعُثْمَانِيَّةِ", tr: "Osmanlı Devleti'nde Tanzimat (Düzenlemeler) Dönemi." }
            } 
        },
        
        // --- 80 Numaralı Kalıp (اِفْتِعَال) ---
        80: { 
            base: { emoji: "📏", arText: "اِنْتِظَام", trText: "Düzenlilik / İntizam." } 
        },
        
        // --- 82 Numaralı Kalıp (مُفْتَعَل) ---
        82: { 
            base: { emoji: "⚙️", arText: "مُنْتَظَم", trText: "Düzenli / Muntazam." },
            suggestsPlus: true,
            "ا": { 
                emoji: "🔄", 
                arText: "مُنْتَظَمًا", 
                trText: "Düzenli bir şekilde / Muntazaman.",
                ornek: { ar: "يَعْمَلُ الْمُحَرِّكُ بِشَكْلٍ مُنْتَظَمٍ", tr: "Motor muntazaman (düzenli bir şekilde) çalışıyor." }
            } 
        }
    },

    // ==================================================================
    // 6. Sh-H-D (ش ه د) KÖKÜ - Şahit Olmak / Görmek / Şehadet
    // 4. Bab (فَعِلَ - يَفْعَلُ) ve İlgili Mezid Bablar
    // ==================================================================
    "شهد": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / Sülasi 4. Bab) ---
        8: { 
            base: { emoji: "👁️", arText: "شَهِدَ", trText: "Şahit oldu / Gördü." } 
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / Sülasi 4. Bab) ---
        9: { 
            base: { emoji: "👀", arText: "يَشْهَدُ", trText: "Şahit olur / Görüyor." } 
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / Sülasi 4. Bab) ---
        10: { 
            base: { emoji: "✋", arText: "اِشْهَدْ", trText: "Şahit ol!" } 
        },

        // --- 64 Numaralı Kalıp (فَاعَلَ - Mazi / Müfâ'ale Babı) ---
        64: { 
            base: { emoji: "📺", arText: "شَاهَدَ", trText: "İzledi / Müşahede etti." } 
        },
        
        // --- 65 Numaralı Kalıp (يُفَاعِلُ - Muzari / Müfâ'ale Babı) ---
        65: { 
            base: { emoji: "🍿", arText: "يُشَاهِدُ", trText: "İzler / Seyrediyor." } 
        },
        
        // --- 66 Numaralı Kalıp (فَاعِلْ - Emir / Müfâ'ale Babı) ---
        66: { 
            base: { emoji: "🎬", arText: "شَاهِدْ", trText: "İzle / Seyret!" } 
        },

        // --- 88 Numaralı Kalıp (تَفَعَّلَ - Mazi / Tefe'ul Babı) ---
        88: { 
            base: { emoji: "🕌", arText: "تَشَهَّدَ", trText: "Kelime-i Şehadet getirdi." } 
        },
        
        // --- 89 Numaralı Kalıp (يَتَفَعَّلُ - Muzari / Tefe'ul Babı) ---
        89: { 
            base: { emoji: "🤲", arText: "يَتَشَهَّدُ", trText: "Kelime-i Şehadet getirir / getiriyor." } 
        },
        
        // --- 90 Numaralı Kalıp (تَفَعَّلْ - Emir / Tefe'ul Babı) ---
        90: { 
            base: { emoji: "📿", arText: "تَشَهَّدْ", trText: "Kelime-i Şehadet getir!" } 
        },

        // --- 94 Numaralı Kalıp (تَفَاعَلَ - Mazi / Tefâ'ul Babı) ---
        94: { 
            base: { emoji: "🤝", arText: "تَشَاهَدَ", trText: "Birbirini gördü / Karşılaştı." } 
        },
        
        // --- 95 Numaralı Kalıp (يَتَفَاعَلُ - Muzari / Tefâ'ul Babı) ---
        95: { 
            base: { emoji: "👥", arText: "يَتَشَاهَدُ", trText: "Birbirini görür / Karşılaşıyor." } 
        },
        
        // --- 96 Numaralı Kalıp (تَفَاعَلْ - Emir / Tefâ'ul Babı) ---
        96: { 
            base: { emoji: "👀", arText: "تَشَاهَدْ", trText: "Karşılıklı şahit ol / Görüş!" } 
        },

        // --- 22 Numaralı Kalıp (فَعَال) ---
        22: { 
            base: { emoji: "📜", arText: "شَهَاد", trText: "Şahitlik." },
            suggestsPlus: true,
            "ة": { 
                emoji: "📜", 
                arText: "شَهَادَة", 
                trText: "Şehadet / Şahitlik.",
                ornek: { ar: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللهِ", tr: "Kelime-i Şehadet, İslam'ın ilk şartıdır." }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "👁️", 
                arText: "شَاهِد", 
                trText: "Şahit / Gören.",
                ornek: { ar: "الْقَاضِي يَسْتَمِعُ إِلَى الشَّاهِدِ فِي الْمَحْكَمَةِ", tr: "Hâkim, mahkemede şahidi dinler." }
            } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "🌹", 
                arText: "شَهِيد", 
                trText: "Şehit.",
                ornek: { ar: "وَلَا تَحْسَبَنَّ الَّذِينَ قُتِلُوا فِي سَبِيلِ اللهِ أَمْوَاتًا", tr: "Allah yolunda öldürülenleri sakın ölüler sanma. (Âl-i İmrân Suresi, 169)" }
            } 
        },
        
        // --- 46 Numaralı Kalıp (فُعَلَاء) ---
        46: { 
            base: { 
                emoji: "🇹🇷", 
                arText: "شُهَدَاء", 
                trText: "Şehitler (Şüheda).",
                ornek: { ar: "شُهَدَاءُ الْوَطَنِ لَا يَمُوتُونَ أَبَدًا", tr: "Vatan şehitleri (şüheda) asla ölmez." }
            } 
        },
        
        // --- 67 Numaralı Kalıp (مُفَاعَلَة) ---
        67: { 
            base: { 
                emoji: "📺", 
                arText: "مُشَاهَدَة", 
                trText: "İzleme / Müşahede.",
                ornek: { ar: "مُشَاهَدَةُ الْفِيدْيُوهَاتِ التَّعْلِيمِيَّةِ مُفِيدَةٌ", tr: "Eğitici videoların izlenmesi (müşahede edilmesi) faydalıdır." }
            } 
        }
    },

    // ==================================================================
    // 7. Kh-L-Q (خ ل ق) KÖKÜ - Yaratmak / Ahlak
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve İlgili Mezid Bablar
    // ==================================================================
    "خلق": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { 
            base: { emoji: "✨", arText: "خَلَقَ", trText: "Yarattı." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { 
            base: { emoji: "🌟", arText: "يَخْلُقُ", trText: "Yaratır / Yaratıyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { 
            base: { emoji: "⚡", arText: "اُخْلُقْ", trText: "Yarat!" } 
        },

        // --- 19 Numaralı Kalıp (فَعْل - Masdar) ---
        19: { 
            base: { 
                emoji: "🌍", 
                arText: "خَلْق", 
                trText: "Yaratılış / Halk etme.",
                ornek: { ar: "هَذَا خَلْقُ اللهِ", tr: "Bu, Allah'ın yaratmasıdır (yarattığıdır). (Lokman Suresi, 11)" }
            } 
        },

        // --- 21 Numaralı Kalıp (فُعُل) ---
        21: { 
            base: { 
                emoji: "💎", 
                arText: "خُلُق", 
                trText: "Ahlak / Huy.",
                ornek: { ar: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ", tr: "Şüphesiz sen yüce bir ahlak üzeresin. (Kalem Suresi, 4)" }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🌌", arText: "خَالِق", trText: "Yaratan / Halık." } 
        },

        // --- 34 Numaralı Kalıp (فَعَّال - Mübalağalı İsm-i Fail) ---
        34: { 
            base: { emoji: "🎨", arText: "خَلَّاق", trText: "Çokça yaratan / Yaratıcı." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "🧬", arText: "مَخْلُوق", trText: "Yaratılmış / Mahluk." },
            suggestsPlus: true,
            "ات": { 
                emoji: "🐾", 
                arText: "مَخْلُوقَات", 
                trText: "Mahlukat / Yaratılmışlar.",
                ornek: { ar: "كُلُّ الْمَخْلُوقَاتِ تُسَبِّحُ لِلهِ", tr: "Bütün mahlukat (yaratılmışlar) Allah'ı tesbih eder." }
            }
        },
        
        // --- 41 Numaralı Kalıp (أَفْعَال - Çoğul) ---
        41: { 
            base: { 
                emoji: "🤝", 
                arText: "أَخْلَاق", 
                trText: "Ahlak / Huylar.",
                ornek: { ar: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ", tr: "Ben ancak güzel ahlakı tamamlamak için gönderildim. (Hadis-i Şerif)" }
            } 
        },

        // --- 88 Numaralı Kalıp (تَفَعَّلَ - Mazi / Tefe'ul Babı) ---
        88: { 
            base: { emoji: "🌱", arText: "تَخَلَّقَ", trText: "Ahlaklandı / Huy edindi." } 
        },
        
        // --- 89 Numaralı Kalıp (يَتَفَعَّلُ - Muzari / Tefe'ul Babı) ---
        89: { 
            base: { emoji: "🌿", arText: "يَتَخَلَّقُ", trText: "Ahlaklanır / Huy ediniyor." } 
        },
        
        // --- 90 Numaralı Kalıp (تَفَعَّلْ - Emir / Tefe'ul Babı) ---
        90: { 
            base: { emoji: "🌸", arText: "تَخَلَّقْ", trText: "Ahlaklan / Huy edin!" },
            suggestsPlus: true,
            "وا": { 
                emoji: "🌷", 
                arText: "تَخَلَّقُوا", 
                trText: "Ahlaklanın (Siz çoğul).",
                ornek: { ar: "تَخَلَّقُوا بِأَخْلَاقِ اللهِ", tr: "Allah'ın ahlakıyla ahlaklanın." }
            }
        }
    },

    // ==================================================================
    // 8. S-J-D (س ج د) KÖKÜ - Secde Etmek
    // 1. Bab (فَعَلَ - يَفْعُلُ)
    // ==================================================================
    "سجد": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi) ---
        1: { 
            base: { 
                emoji: "🧎", 
                arText: "سَجَدَ", 
                trText: "Secde etti.",
                ornek: { ar: "سَجَدَ لِلهِ شُكْرًا", tr: "Şükür için Allah'a secde etti." }
            } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari) ---
        2: { 
            base: { 
                emoji: "🤲", 
                arText: "يَسْجُدُ", 
                trText: "Secde eder / Ediyor.",
                ornek: { ar: "وَلِلهِ يَسْجُدُ مَنْ فِي السَّمَاوَاتِ وَالْأَرْضِ", tr: "Göklerde ve yerde olan herkes Allah'a secde eder. (Ra'd Suresi, 15)" }
            } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir) ---
        3: { 
            base: { 
                emoji: "⬇️", 
                arText: "اُسْجُدْ", 
                trText: "Secde et!",
                ornek: { ar: "يَا مَرْيَمُ اقْنُتِي لِرَبِّكِ وَاسْجُدِي", tr: "Ey Meryem! Rabbine gönülden itaat et ve secdeye kapan. (Âl-i İmrân Suresi, 43)" }
            } 
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            base: { emoji: "🙇", arText: "سَجْد", trText: "Secde (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🧎", 
                arText: "سَجْدَة", 
                trText: "Bir defa secde etme.",
                ornek: { ar: "سَجْدَةُ الشُّكْرِ تَدُلُّ عَلَى الِامْتِنَانِ", tr: "Şükür secdesi, minnettarlığı (şükranı) gösterir." } 
            } 
        },
        
        // --- 25 Numaralı Kalıp (فُعُول) ---
        25: { 
            base: { 
                emoji: "🤲", 
                arText: "سُجُود", 
                trText: "Secde etmek / Sücud.",
                ornek: { ar: "أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ", tr: "Kulun Rabbine en yakın olduğu an secde (sücud) anıdır; orada duayı çok yapın. (Hadis-i Şerif)" }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "🙇", 
                arText: "سَاجِد", 
                trText: "Secde eden.",
                ornek: { ar: "تَرَاهُمْ رُكَّعًا سُجَّدًا يَبْتَغُونَ فَضْلًا مِنَ اللهِ", tr: "Onları, Allah'tan bir lütuf isteyerek rükû ve secde eder (sâcid/sücced) hâlde görürsün. (Fetih Suresi, 29)" }
            } 
        },
        
        // --- 37 Numaralı Kalıp (مَفْعِل) ---
        37: { 
            base: { 
                emoji: "🕌", 
                arText: "مَسْجِد", 
                trText: "Mescit / Cami.",
                ornek: { ar: "أَحَبُّ الْبِلَادِ إِلَى اللهِ مَسَاجِدُهَا", tr: "Allah'a beldelerin en sevimlisi mescitleridir (camileridir). (Hadis-i Şerif)" }
            } 
        }
    },

    // ==================================================================
    // 9. S-D-Q (ص د ق) KÖKÜ - Doğru Olmak
    // 1. Bab (فَعَلَ - يَفْعُلُ)
    // ==================================================================
    "صدق": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi) ---
        1: { 
            base: { 
                emoji: "🗣️", 
                arText: "صَدَقَ", 
                trText: "Doğru söyledi.",
                ornek: { ar: "صَدَقَ اللهُ الْعَظِيمُ", tr: "Yüce Allah doğru söyledi." }
            } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari) ---
        2: { 
            base: { emoji: "✅", arText: "يَصْدُقُ", trText: "Doğru söyler / Söylüyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir) ---
        3: { 
            base: { 
                emoji: "✔️", 
                arText: "اُصْدُقْ", 
                trText: "Doğru söyle!",
                ornek: { ar: "اُصْدُقْ فِي قَوْلِكَ دَائِمًا", tr: "Sözünde daima doğru söyle!" }
            } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { emoji: "🪙", arText: "صَدَق", trText: "Sadaka (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🪙", 
                arText: "صَدَقَة", 
                trText: "Sadaka / Hayır.",
                ornek: { ar: "الصَّدَقَةُ تَدْفَعُ الْبَلَاءَ", tr: "Sadaka belayı defeder. (Hadis-i Şerif)" } 
            } 
        },

        // --- 20 Numaralı Kalıp (فِعْل) ---
        20: { 
            base: { 
                emoji: "🕊️", 
                arText: "صِدْق", 
                trText: "Doğruluk / Sıdk.",
                ornek: { ar: "الصِّدْقُ صِفَةُ الْأَنْبِيَاءِ", tr: "Doğruluk (sıdk), peygamberlerin ve Ebu Bekir es-Sıddîk'ın sıfatıdır." }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "👯", 
                arText: "صَادِق", 
                trText: "Doğru söyleyen / Sadık.",
                ornek: { ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا الله وَكُونُوا مَعَ الصَّادِقِينَ", tr: "Ey iman edenler! Allah'tan sakının ve doğrularla (sadıklarla) beraber olun. (Tevbe Suresi, 119)" }
            } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "🤝", 
                arText: "صَدِيق", 
                trText: "Gerçek dost.",
                ornek: { ar: "الصَّدِيقُ وَقْتَ الضِّيقِ", tr: "Gerçek dost (sadık arkadaş), sıkıntı vaktinde belli olur. (Arap Atasözü)" }
            } 
        },
        
        // --- 61 Numaralı Kalıp (تَفْعِيل) ---
        61: { 
            base: { 
                emoji: "✔️", 
                arText: "تَصْدِيق", 
                trText: "Onaylamak / Tasdik etmek.",
                ornek: { ar: "تَصْدِيقُ الشَّهَادَةِ مِنَ الْجَامِعَةِ", tr: "Diplomanın üniversiteden tasdik edilmesi." }
            } 
        }
    },

    // ==================================================================
    // 10. H-S-D (ح س د) KÖKÜ - Kıskanmak
    // ==================================================================
    "حسد": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi) ---
        1: { 
            base: { 
                emoji: "🧿", 
                arText: "حَسَدَ", 
                trText: "Kıskandı / Haset etti.",
                ornek: { ar: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ", tr: "Haset ettiği zaman hasetçinin şerrinden (Allah'a sığınırım). (Felak Suresi, 5)" }
            } 
        }, 
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "😒", 
                arText: "حَاسِد", 
                trText: "Kıskanan / Hasetçi.",
                ornek: { ar: "الْحَاسِدُ لَا يَنَالُ رَاحَةً", tr: "Haset eden kişi asla rahata eremez." }
            } 
        } 
    },

    // ==================================================================
    // 11. D-Kh-L (د خ ل) KÖKÜ - Girmek / Dahil Olmak
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve Müfâ'ale Babı
    // ==================================================================
    "دخل": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { 
            base: { 
                emoji: "🚶", 
                arText: "دَخَلَ", 
                trText: "Girdi.",
                ornek: { ar: "دَخَلَ الْجَنَّةَ بِمَغْفِرَةِ اللهِ", tr: "Allah'ın mağfiretiyle cennete girdi." }
            } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { 
            base: { emoji: "🚶‍♂️", arText: "يَدْخُلُ", trText: "Girer / Giriyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { 
            base: { 
                emoji: "🚪", 
                arText: "اُدْخُلْ", 
                trText: "Gir!",
                ornek: { ar: "اُدْخُلُوهَا بِسَلَامٍ آمِنِينَ", tr: "Oraya (Cennete) esenlikle ve güven içinde girin! (Hicr Suresi, 46)" }
            } 
        },

        // --- 25 Numaralı Kalıp (فُعُول) ---
        25: { 
            base: { 
                emoji: "🚪", 
                arText: "دُخُول", 
                trText: "Giriş / Girmek.",
                ornek: { ar: "مَمْنُوعُ الدُّخُولِ", tr: "Giriş yasaktır." }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "📦", arText: "دَاخِل", trText: "İç / Dahil." }, 
            suggestsPlus: true, 
            "يَّة": { 
                emoji: "🏛️", 
                arText: "دَاخِلِيَّة", 
                trText: "İç / İçişleri.",
                ornek: { ar: "وِزَارَةُ الدَّاخِلِيَّةِ", tr: "İçişleri Bakanlığı." } 
            } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { 
                emoji: "🏢", 
                arText: "مَدْخَل", 
                trText: "Giriş yeri.",
                ornek: { ar: "مَدْخَلُ الْمَبْنَى وَاسِعٌ جِدًّا", tr: "Binanın girişi oldukça geniştir." }
            } 
        },
        
        // --- 55 Numaralı Kalıp (إِفْعَال) ---
        55: { 
            base: { emoji: "📥", arText: "إِدْخَال", trText: "Girdi / İçeri sokmak." }, 
            suggestsPlus: true, 
            "ات": { 
                emoji: "📊", 
                arText: "إِدْخَالَات", 
                trText: "Girdiler.",
                ornek: { ar: "إِدْخَالَاتُ الْبَيَانَاتِ فِي الْحَاسُوبِ", tr: "Bilgisayara veri girdileri (girişleri)." } 
            } 
        },

        // --- 64 Numaralı Kalıp (فَاعَلَ - Mazi / Müfâ'ale Babı) ---
        64: { 
            base: { emoji: "🛑", arText: "دَاخَلَ", trText: "Müdahale etti / Araya girdi." } 
        },
        
        // --- 65 Numaralı Kalıp (يُفَاعِلُ - Muzari / Müfâ'ale Babı) ---
        65: { 
            base: { emoji: "✋", arText: "يُدَاخِلُ", trText: "Müdahale eder / Araya giriyor." } 
        },
        
        // --- 66 Numaralı Kalıp (فَاعِلْ - Emir / Müfâ'ale Babı) ---
        66: { 
            base: { emoji: "❗", arText: "دَاخِلْ", trText: "Müdahale et / Araya gir!" } 
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة) ---
        67: { 
            base: { 
                emoji: "🛑", 
                arText: "مُدَاخَلَة", 
                trText: "Müdahale.",
                ornek: { ar: "الْمُدَاخَلَةُ السَّرِيعَةُ تَمْنَعُ الْمُشْكِلَةَ", tr: "Hızlı müdahale (araya girme) sorunun büyümesini engeller." }
            } 
        },
        
        // --- 69 Numaralı Kalıp (مُفَاعِل) ---
        69: { 
            base: { emoji: "🧑‍⚖️", arText: "مُدَاخِل", trText: "Müdahil olan / Araya giren." } 
        }
    },

    // ==================================================================
    // 12. R-K-B (ر ك ب) KÖKÜ - Binmek / Birleştirmek (Terkip etmek)
    // 4. Bab (فَعِلَ - يَفْعَلُ) ve Tef'îl Babı
    // ==================================================================
    "ركب": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / 4. Bab) ---
        8: { 
            base: { emoji: "🐎", arText: "رَكِبَ", trText: "Bindi." } 
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { 
            base: { emoji: "🏇", arText: "يَرْكَبُ", trText: "Biner / Biniyor." } 
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { 
            base: { emoji: "🐴", arText: "اِرْكَبْ", trText: "Bin!" } 
        },

        // --- 25 Numaralı Kalıp (فُعُول - Masdar) ---
        25: { 
            base: { 
                emoji: "🏇", 
                arText: "رُكُوب", 
                trText: "Binmek.",
                ornek: { ar: "رُكُوبُ الْخَيْلِ رِيَاضَةٌ مُمْتَازَةٌ", tr: "Ata binmek mükemmel bir spordur." }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fail) ---
        33: { 
            base: { emoji: "💺", arText: "رَاكِب", trText: "Yolcu / Binen." } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekan/Zaman) ---
        38: { 
            base: { emoji: "⛴️", arText: "مَرْكَب", trText: "Gemi / Binek." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🛸", 
                arText: "مَرْكَبَة", 
                trText: "Araç / Binek.",
                ornek: { ar: "مَرْكَبَةٌ فَضَائِيَّةٌ", tr: "Uzay aracı (Binek)." } 
            }
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { 
            base: { emoji: "🧩", arText: "رَكَّبَ", trText: "Birleştirdi / Terkip etti." } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { 
            base: { emoji: "🔧", arText: "يُرَكِّبُ", trText: "Birleştirir / Monte ediyor." } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { 
            base: { emoji: "🛠️", arText: "رَكِّبْ", trText: "Birleştir / Monte et!" } 
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { emoji: "🧪", arText: "تَرْكِيب", trText: "Bileşim / Terkip." },
            suggestsPlus: true,
            "ات": { 
                emoji: "🧬", 
                arText: "تَرْكِيبَات", 
                trText: "Bileşimler (Terkibler).",
                ornek: { ar: "تَرْكِيبَاتٌ كِيمْيَائِيَّةٌ دَقِيقَةٌ", tr: "Hassas kimyasal terkipler (bileşimler)." }
            }
        },
        
        // --- 63 Numaralı Kalıp (مُفَعَّل - Tef'îl Babı İsm-i Mef'ulü) ---
        63: { 
            base: { 
                emoji: "✒️", 
                arText: "مُرَكَّب", 
                trText: "Birleşik / Mürekkep.",
                ornek: { ar: "جُمْلَةٌ مُرَكَّبَةٌ", tr: "Birleşik (mürekkep) cümle." }
            } 
        }
    },

    // ==================================================================
    // 13. N-Q-L (ن ق ل) KÖKÜ - Taşımak / Nakletmek / Aktarmak
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve İfti'âl Babı
    // ==================================================================
    "نقل": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { 
            base: { emoji: "📦", arText: "نَقَلَ", trText: "Taşıdı / Nakletti." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { 
            base: { emoji: "🚚", arText: "يَنْقُلُ", trText: "Taşır / Naklediyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { 
            base: { emoji: "💪", arText: "اُنْقُلْ", trText: "Taşı / Naklet!" } 
        },

        // --- 19 Numaralı Kalıp (فَعْل - Masdar) ---
        19: { 
            base: { emoji: "🚚", arText: "نَقْل", trText: "Taşıma / Nakil." }, 
            suggestsPlus: true, 
            "ا": { 
                emoji: "📺", 
                arText: "نَقْلًا", 
                trText: "Naklen / Canlı.",
                ornek: { ar: "بُثَّتِ الْمُبَارَاةُ نَقْلًا مُبَاشِرًا", tr: "Maç canlı olarak (naklen) yayınlandı." } 
            }, 
            "يَّة": { 
                emoji: "📦", 
                arText: "نَقْلِيَّة", 
                trText: "Nakliye." 
            }, 
            "يَّات": { 
                emoji: "🚛", 
                arText: "نَقْلِيَّات", 
                trText: "Nakliyat.",
                ornek: { ar: "شَرِكَةُ النَّقْلِيَّاتِ تَشْحَنُ الْبَضَائِعَ", tr: "Nakliyat şirketi malları taşır." } 
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fail) ---
        33: { 
            base: { emoji: "📡", arText: "نَاقِل", trText: "Taşıyan / Aktaran." } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "🧳", arText: "نَقِيل", trText: "Taşınan." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ul) ---
        36: { 
            base: { 
                emoji: "🚗", 
                arText: "مَنْقُول", 
                trText: "Taşınabilir / Menkul.",
                ornek: { ar: "الْأَمْوَالُ غَيْرُ الْمَنْقُولَةِ هِيَ الْعَقَارَاتُ", tr: "Gayrimenkul (taşınmaz) mallar ev ve arsalardır." }
            } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - Mazi / İfti'âl Babı) ---
        77: { 
            base: { emoji: "🛫", arText: "اِنْتَقَلَ", trText: "Geçti / Taşındı (İntikal etti)." } 
        },
        
        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - Muzari / İfti'âl Babı) ---
        78: { 
            base: { emoji: "✈️", arText: "يَنْتَقِلُ", trText: "Geçer / Taşınıyor (İntikal ediyor)." } 
        },
        
        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - Emir / İfti'âl Babı) ---
        79: { 
            base: { emoji: "🧳", arText: "اِنْتَقِلْ", trText: "Geç / Taşın (İntikal et)!" } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { emoji: "🔄", arText: "اِنْتِقَال", trText: "Geçiş / Transfer / İntikal." } 
        }
    },


   // ==================================================================
    // 14. Sh-R-B (ش ر ب) KÖKÜ - İçmek
    // 4. Bab (فَعِلَ - يَفْعَلُ)
    // ==================================================================
    "شرب": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / 4. Bab) ---
        8: { 
            base: { 
                emoji: "🥛", 
                arText: "شَرِبَ", 
                trText: "İçti.",
                ornek: { ar: "شَرِبَ الْمَرِيضُ الدَّوَاءَ", tr: "Hasta ilacı içti." }
            } 
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { 
            base: { 
                emoji: "🥤", 
                arText: "يَشْرَبُ", 
                trText: "İçer / İçiyor.",
                ornek: { ar: "يَشْرَبُ الطِّفْلُ الْحَلِيبَ", tr: "Çocuk süt içiyor." }
            } 
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { 
            base: { 
                emoji: "💧", 
                arText: "اِشْرَبْ", 
                trText: "İç!",
                ornek: { ar: "كُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا", tr: "Yiyin, için fakat israf etmeyin. (A'râf Suresi, 31)" }
            } 
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            base: { emoji: "💧", arText: "شَرْب", trText: "İçme (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🍵", 
                arText: "شَرْبَة", 
                trText: "Bir içimlik / Şerbet.",
                ornek: { ar: "أَعْطِنِي شَرْبَةَ مَاءٍ مِنْ فَضْلِكَ", tr: "Lütfen bana bir içimlik su ver." }
            } 
        },
        
        // --- 22 Numaralı Kalıp (فَعَال) ---
        22: { 
            base: { 
                emoji: "🍹", 
                arText: "شَرَاب", 
                trText: "İçecek / Şerbet.",
                ornek: { ar: "يَخْرُجُ مِنْ بُطُونِهَا شَرَابٌ مُخْتَلِفٌ أَلْوَانُهُ", tr: "Onların karınlarından renkleri çeşitli bir içecek çıkar. (Nahl Suresi, 69)" }
            } 
        },
        
        // --- 25 Numaralı Kalıp (فُعُول) ---
        25: { 
            base: { emoji: "🥛", arText: "شُرُوب", trText: "İçmek." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "🥤", arText: "مَشْرُوب", trText: "İçilen / Meşrubat." },
            suggestsPlus: true, 
            "ات": { 
                emoji: "🥤", 
                arText: "مَشْرُوبَات", 
                trText: "İçecekler / Meşrubatlar.",
                ornek: { ar: "الْمَشْرُوبَاتُ الْبَارِدَةُ لَذِيذَةٌ فِي الصَّيْفِ", tr: "Soğuk meşrubatlar (içecekler) yazın lezzetlidir." }
            } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { 
                emoji: "⛲", 
                arText: "مَشْرَب", 
                trText: "İçilecek yer / Pınar.",
                ornek: { ar: "قَدْ عَلِمَ كُلُّ أُنَاسٍ مَشْرَبَهُمْ", tr: "Her topluluk kendi içeceği yeri (pınarını) bildi. (Bakara Suresi, 60)" }
            } 
        }
    },

    // ==================================================================
    // 15. S-F-R (س ف ر) KÖKÜ - Yolculuk / Açığa Çıkarmak
    // ==================================================================
    "سفر": { 
        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { 
                emoji: "🛤️", 
                arText: "سَفَر", 
                trText: "Yolculuk / Sefer.",
                ornek: { ar: "السَّفَرُ قِطْعَةٌ مِنَ الْعَذَابِ", tr: "Yolculuk azaptan bir parçadır. (Hadis-i Şerif)" }
            } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "👔", arText: "سَفِير", trText: "Büyükelçi (Sefir)." }, 
            suggestsPlus: true, 
            "ة": { 
                emoji: "🏢", 
                arText: "سَفَارَة", 
                trText: "Büyükelçilik (Sefaret).",
                ornek: { ar: "السَّفَارَةُ تُمَثِّلُ الدَّوْلَةَ فِي الْخَارِجِ", tr: "Büyükelçilik devleti yurtdışında temsil eder." }
            } 
        },
        
        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı) ---
        64: { 
            base: { emoji: "✈️", arText: "سَافَرَ", trText: "Yolculuk yaptı / Sefere çıktı." } 
        },
        65: { 
            base: { emoji: "🌍", arText: "يُسَافِرُ", trText: "Yolculuk yapıyor." } 
        },
        66: { 
            base: { emoji: "🎒", arText: "سَافِرْ", trText: "Yolculuk yap!" } 
        },
        
        // --- 69 Numaralı Kalıp (مُفَاعِل) ---
        69: { 
            base: { 
                emoji: "🧳", 
                arText: "مُسَافِر", 
                trText: "Yolcu / Misafir.",
                ornek: { ar: "الضَّيْفُ (المُسَافِرُ) يَأْتِي بِرِزْقِهِ", tr: "Misafir (yolcu) rızkıyla gelir. (Atasözü)" }
            } 
        }
    }, 

    // ==================================================================
    // 16. '-Q-L (ع ق ل) KÖKÜ - Akıl / Anlamak / Bağlamak
    // 2. Bab (فَعَلَ - يَفْعِلُ)
    // ==================================================================
    "عقل": { 
        // --- 1, 4, 5 Numaralı Kalıplar (2. Bab) ---
        1: { 
            base: { emoji: "🧠", arText: "عَقَلَ", trText: "Akıl etti / Anladı." } 
        },
        4: { 
            base: { 
                emoji: "🤔", 
                arText: "يَعْقِلُ", 
                trText: "Akıl eder / Düşünüyor.",
                ornek: { ar: "أَفَلَا تَعْقِلُونَ", tr: "Hâlâ aklınızı kullanmıyor musunuz? (Bakara Suresi, 44)" }
            } 
        },
        5: { 
            base: { 
                emoji: "💡", 
                arText: "اِعْقِلْ", 
                trText: "Akıl et / Bağla!",
                ornek: { ar: "اِعْقِلْهَا وَتَوَكَّلْ", tr: "Onu (deveni) bağla ve tevekkül et. (Hadis-i Şerif)" }
            } 
        },
        
        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            base: { 
                emoji: "🧠", 
                arText: "عَقْل", 
                trText: "Akıl.",
                ornek: { ar: "الْعَقْلُ السَّلِيمُ فِي الْجِسْمِ السَّلِيمِ", tr: "Sağlam akıl (kafa), sağlam vücutta bulunur. (Atasözü)" }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "🤓", 
                arText: "عَاقِل", 
                trText: "Akıllı / Mantıklı.",
                ornek: { ar: "الْعَاقِلُ مَنْ دَانَ نَفْسَهُ", tr: "Akıllı kimse nefsini hesaba çekendir. (Hadis-i Şerif)" }
            } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "✅", 
                arText: "مَعْقُول", 
                trText: "Makul / Akla yatkın.",
                ornek: { ar: "سِعْرٌ مَعْقُولٌ", tr: "Makul (akla yatkın / mantıklı) bir fiyat." }
            }, 
            suggestsPlus: true, 
            "ات": { 
                emoji: "💬", 
                arText: "مَعْقُولَات", 
                trText: "Akla yatkın şeyler / Felsefi-Mantıki konular." 
            } 
        }
    },

    // ==================================================================
    // 17. 'A-S-M (ع ص م) KÖKÜ - Korumak / Günahsızlık
    // ==================================================================
    "عصم": {
        // --- 20 Numaralı Kalıp (فِعْل) ---
        20: { 
            base: { emoji: "🛡️", arText: "عِصْم", trText: "Koruma (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🕊️", 
                arText: "عِصْمَة", 
                trText: "İsmet / Günahsızlık.",
                ornek: { ar: "عِصْمَةُ الْأَنْبِيَاءِ", tr: "Peygamberlerin günahsızlığı (İsmet sıfatı)." }
            } 
        }, 
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "🛡️", 
                arText: "عَاصِم", 
                trText: "Koruyan.",
                ornek: { ar: "لَا عَاصِمَ الْيَوْمَ مِنْ أَمْرِ اللهِ", tr: "Bugün Allah'ın emrinden koruyacak hiçbir güç yoktur. (Hûd Suresi, 43)" }
            } 
        }, 
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "👼", 
                arText: "مَعْصُوم", 
                trText: "Masum / Korunmuş.",
                ornek: { ar: "الْأَطْفَالُ مَعْصُومُونَ", tr: "Çocuklar masumdur (günahsızdır)." }
            } 
        }
    },

    // ==================================================================
    // 18. Q-R-B (ق ر ب) KÖKÜ - Yakın Olmak (Akraba / Kurban)
    // 5. Bab (فَعُلَ - يَفْعُلُ) ve İfti'âl Babı
    // ==================================================================
    "قرب": {
        // --- 11 Numaralı Kalıp (فَعُلَ - Mazi / 5. Bab) ---
        11: { 
            base: { emoji: "📏", arText: "قَرُبَ", trText: "Yakın oldu." } 
        },
        
        // --- 12 Numaralı Kalıp (يَفْعُلُ - Muzari / 5. Bab) ---
        12: { 
            base: { emoji: "🚶", arText: "يَقْرُبُ", trText: "Yakın olur / Yaklaşıyor." } 
        },
        
        // --- 13 Numaralı Kalıp (اُفْعُلْ - Emir / 5. Bab) ---
        13: { 
            base: { emoji: "🫂", arText: "اُقْرُبْ", trText: "Yakın ol / Yaklaş!" } 
        },

        // --- 27 Numaralı Kalıp (فُعْلَان) ---
        27: { 
            base: { 
                emoji: "🐑", 
                arText: "قُرْبَان", 
                trText: "Kurban.",
                ornek: { ar: "إِذْ قَرَّبَا قُرْبَانًا فَتُقُبِّلَ مِنْ أَحَدِهِمَا", tr: "Hani ikisi (Habil ve Kabil) birer kurban sunmuşlardı da birinden kabul edilmişti. (Mâide Suresi, 27)" }
            } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "🫂", 
                arText: "قَرِيب", 
                trText: "Yakın.",
                ornek: { ar: "إِنَّ رَحْمَتَ اللهِ قَرِيبٌ مِنَ الْمُحْسِنِينَ", tr: "Şüphesiz Allah'ın rahmeti iyilik edenlere çok yakındır. (A'râf Suresi, 56)" }
            } 
        },
        
        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - Mazi / İfti'âl Babı) ---
        77: { 
            base: { 
                emoji: "🌙", 
                arText: "اِقْتَرَبَ", 
                trText: "Yaklaştı.",
                ornek: { ar: "اقْتَرَبَتِ السَّاعَةُ وَانشَقَّ الْقَمَرُ", tr: "Kıyamet vakti (saat) yaklaştı ve ay yarıldı. (Kamer Suresi, 1)" }
            } 
        },
        
        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - Muzari / İfti'âl Babı) ---
        78: { 
            base: { emoji: "⏳", arText: "يَقْتَرِبُ", trText: "Yaklaşır / Yaklaşıyor." } 
        },
        
        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - Emir / İfti'âl Babı) ---
        79: { 
            base: { 
                emoji: "🏃", 
                arText: "اِقْتَرِبْ", 
                trText: "Yaklaş!",
                ornek: { ar: "وَاسْجُدْ وَاقْتَرِبْ", tr: "Secde et ve (Rabbine) yaklaş! (Alak Suresi, 19)" }
            } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "🚶‍♂️", 
                arText: "اِقْتِرَاب", 
                trText: "Yaklaşma.",
                ornek: { ar: "مَعَ اقْتِرَابِ مَوْعِدِ الِامْتِحَانِ", tr: "Sınav vaktinin yaklaşmasıyla birlikte." }
            } 
        }
    },

    // ==================================================================
    // 19. T-B-Q (ط ب ق) KÖKÜ - Uymak / Katman / Tatbik Etmek
    // ==================================================================
    "طبق": {
        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { emoji: "🍽️", arText: "طَبَق", trText: "Tabak / Katman." }, 
            suggestsPlus: true, 
            "ة": { 
                emoji: "🥞", 
                arText: "طَبَقَة", 
                trText: "Tabaka / Katman.",
                ornek: { ar: "طَبَقَةُ الْأُوزُونِ تَحْمِي الْأَرْضَ", tr: "Ozon tabakası dünyayı korur." } 
            } 
        },
        
        // --- 61 Numaralı Kalıp (تَفْعِيل) ---
        61: { 
            base: { 
                emoji: "📱", 
                arText: "تَطْبِيق", 
                trText: "Uygulama / Tatbik.",
                ornek: { ar: "تَطْبِيقُ الْقَوَاعِدِ مُهِمٌّ", tr: "Kuralların uygulanması (tatbik edilmesi) önemlidir." }
            }, 
            suggestsPlus: true, 
            "ات": { 
                emoji: "📲", 
                arText: "تَطْبِيقَات", 
                trText: "Uygulamalar.",
                ornek: { ar: "تَطْبِيقَاتُ الْهَوَاتِفِ الذَّكِيَّةِ", tr: "Akıllı telefon uygulamaları." } 
            } 
        },
        
        // --- 67 Numaralı Kalıp (مُفَاعَلَة) ---
        67: { 
            base: { emoji: "✅", arText: "مُطَابَقَة", trText: "Uyma / Mutabakat." },
            suggestsPlus: true, 
            "ات": { 
                emoji: "✅", 
                arText: "مُطَابَقَات", 
                trText: "Mutabakatlar.",
                ornek: { ar: "مُطَابَقَةُ الْحِسَابَاتِ", tr: "Hesap mutabakatı (uyuşması)." } 
            } 
        },
        
        // --- 69 Numaralı Kalıp (مُفَاعِل) ---
        69: { 
            base: { 
                emoji: "🤝", 
                arText: "مُطَابِق", 
                trText: "Mutabık / Uygun.",
                ornek: { ar: "هَذَا مُطَابِقٌ لِلْمُوَاصَفَاتِ", tr: "Bu (ürün) standartlara mutabıktır (uygundur)." }
            } 
        }
    },





   // ==================================================================
    // 23. Kh-L-F (خ ل ف) KÖKÜ - Arkada kalmak / Halef olmak / İhtilaf etmek
    // 1. Bab (فَعَلَ - يَفْعُلُ), Müfâ'ale ve İfti'âl Babları
    // ==================================================================
    "خلف": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { 
            base: { emoji: "🔙", arText: "خَلَفَ", trText: "Arkada kaldı / Halef oldu." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { 
            base: { emoji: "🚶", arText: "يَخْلُفُ", trText: "Arkada kalır / Halef oluyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { 
            base: { emoji: "❗", arText: "اُخْلُفْ", trText: "Arkada kal / Halef ol!" } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { 
                emoji: "👣", 
                arText: "خَلَف", 
                trText: "Gelen / Halef.",
                ornek: { ar: "خَيْرُ خَلَفٍ لِخَيْرِ سَلَفٍ", tr: "Hayırlı selefin (geçmişin) hayırlı halefi (geleceği)." }
            } 
        }, 
        
        // --- 23 Numaralı Kalıp (فِعَال) ---
        23: { 
            base: { emoji: "🕌", arText: "خِلَاف", trText: "Anlaşmazlık / Hilaf (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🕌", 
                arText: "خِلَافَة", 
                trText: "Hilafet.",
                ornek: { ar: "الْخِلَافَةُ الْعُثْمَانِيَّةُ فِي التَّارِيخِ", tr: "Tarihteki Osmanlı Hilafeti." } 
            } 
        }, 
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "👑", arText: "خَلِيف", trText: "Halife (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "👑", 
                arText: "خَلِيفَة", 
                trText: "Halife / Temsilci.",
                ornek: { ar: "إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً", tr: "Muhakkak ben yeryüzünde bir halife var edeceğim. (Bakara Suresi, 30)" } 
            } 
        }, 
        
        // --- 46 Numaralı Kalıp (فُعَلَاء) ---
        46: { 
            base: { 
                emoji: "👥", 
                arText: "خُلَفَاء", 
                trText: "Halifeler.",
                ornek: { ar: "الْخُلَفَاءُ الرَّاشِدُونَ", tr: "Hulefa-yi Raşidin (Dört Halife)." }
            } 
        }, 
        
        // --- 64 Numaralı Kalıp (فَاعَلَ - Mazi / Müfâ'ale Babı) ---
        64: { 
            base: { emoji: "🙅", arText: "خَالَفَ", trText: "Muhalefet etti / Karşı çıktı." } 
        },
        
        // --- 65 Numaralı Kalıp (يُفَاعِلُ - Muzari / Müfâ'ale Babı) ---
        65: { 
            base: { emoji: "🗣️", arText: "يُخَالِفُ", trText: "Muhalefet eder / Karşı çıkıyor." } 
        },
        
        // --- 66 Numaralı Kalıp (فَاعِلْ - Emir / Müfâ'ale Babı) ---
        66: { 
            base: { emoji: "✋", arText: "خَالِفْ", trText: "Muhalefet et / Karşı çık!" } 
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Müfâ'ale Masdarı) ---
        67: { 
            base: { 
                emoji: "🚫", 
                arText: "مُخَالَفَة", 
                trText: "Muhalefet / İhlal.",
                ornek: { ar: "مُخَالَفَةُ الْمُرُورِ مَمْنُوعَةٌ", tr: "Trafik kuralı ihlali (muhalefeti) yasaktır." }
            } 
        }, 
        
        // --- 69 Numaralı Kalıp (مُفَاعِل - Müfâ'ale İsm-i Fail) ---
        69: { 
            base: { 
                emoji: "🙅‍♂️", 
                arText: "مُخَالِف", 
                trText: "Muhalif / Karşı çıkan.",
                ornek: { ar: "رَأْيٌ مُخَالِفٌ", tr: "Muhalif (zıt) görüş." }
            } 
        }, 
        
        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - Mazi / İfti'âl Babı) ---
        77: { 
            base: { emoji: "↔️", arText: "اِخْتَلَفَ", trText: "İhtilafa düştü / Ayrılığa düştü." } 
        },
        
        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - Muzari / İfti'âl Babı) ---
        78: { 
            base: { emoji: "🤷", arText: "يَخْتَلِفُ", trText: "İhtilafa düşer / Farklılık gösteriyor." } 
        },
        
        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - Emir / İfti'âl Babı) ---
        79: { 
            base: { emoji: "❗", arText: "اِخْتَلِفْ", trText: "Ayrılığa düş!" } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "↔️", 
                arText: "اِخْتِلَاف", 
                trText: "İhtilaf / Görüş ayrılığı.",
                ornek: { ar: "اِخْتِلَافُ الرَّأْيِ لَا يُفْسِدُ لِلْوُدِّ قَضِيَّةً", tr: "Görüş ayrılığı (ihtilaf), dostluğu bozmaz. (Arap Atasözü)" }
            } 
        }, 
        
        // --- 81 Numaralı Kalıp (مُفْتَعِل / مُفْتَعَل) ---
        81: { 
            base: { 
                emoji: "🌈", 
                arText: "مُخْتَلِف", 
                trText: "Farklı / Muhtelif.",
                ornek: { ar: "أَلْوَانٌ مُخْتَلِفَةٌ", tr: "Muhtelif (çeşitli) renkler." }
            } 
        } 
    },


 // ==================================================================
    // 24. Kh-R-J (خ ر ج) KÖKÜ - Çıkmak / Çıkarmak
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve İf'âl Babı
    // ==================================================================
    "خرج": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { 
            base: { emoji: "🚶", arText: "خَرَجَ", trText: "Çıktı." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { 
            base: { emoji: "🚪", arText: "يَخْرُجُ", trText: "Çıkar / Çıkıyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { 
            base: { emoji: "🏃", arText: "اُخْرُجْ", trText: "Çık!" } 
        },

        // --- 22 Numaralı Kalıp (فَعَال) ---
        22: { 
            base: { emoji: "💰", arText: "خَرَاج", trText: "Vergi / Haraç." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🏞️", arText: "خَارِج", trText: "Dış / Hariç." } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { 
                emoji: "🚪", 
                arText: "مَخْرَج", 
                trText: "Çıkış yolu / Mahreç.",
                ornek: { ar: "وَمَن يَتَّقِ الله يَجْعَل لَّهُ مَخْرَجًا", tr: "Kim Allah'a karşı gelmekten sakınırsa, Allah ona bir çıkış yolu (mahreç) açar. (Talak Suresi, 2)" }
            } 
        },
        
        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı) ---
        52: { 
            base: { emoji: "📤", arText: "أَخْرَجَ", trText: "Çıkardı." } 
        },
        53: { 
            base: { emoji: "📦", arText: "يُخْرِجُ", trText: "Çıkarır / Çıkarıyor." } 
        },
        54: { 
            base: { emoji: "❗", arText: "أَخْرِجْ", trText: "Çıkar!" } 
        },

        // --- 55 Numaralı Kalıp (إِفْعَال) ---
        55: { 
            base: { 
                emoji: "📤", 
                arText: "إِخْرَاج", 
                trText: "Çıkarmak / İhraç etmek.",
                ornek: { ar: "إِخْرَاجُ الزَّكَاةِ وَاجِبٌ", tr: "Zekatın çıkarılması (verilmesi) vaciptir." }
            }, 
            suggestsPlus: true, 
            "ات": { 
                emoji: "🚢", 
                arText: "إِخْرَاجَات", 
                trText: "İhracat / Dışa satım.",
                ornek: { ar: "زَادَتْ إِخْرَاجَاتُ الدَّوْلَةِ", tr: "Devletin ihracatı (dışa satımı) arttı." } 
            } 
        }
    },

    // ==================================================================
    // 25. '-M-L (ع م ل) KÖKÜ - Çalışmak / Yapmak / İşlem
    // 4. Bab (فَعِلَ - يَفْعَلُ)
    // ==================================================================
    "عمل": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / 4. Bab) ---
        8: { 
            base: { emoji: "🛠️", arText: "عَمِلَ", trText: "Çalıştı / Yaptı." } 
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { 
            base: { emoji: "⚙️", arText: "يَعْمَلُ", trText: "Çalışır / Yapıyor." } 
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { 
            base: { emoji: "💪", arText: "اِعْمَلْ", trText: "Çalış / Yap!" } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { 
                emoji: "💼", 
                arText: "عَمَل", 
                trText: "İş / Amel.",
                ornek: { ar: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", tr: "Ameller (işler) niyetlere göredir. (Hadis-i Şerif)" }
            }, 
            suggestsPlus: true, 
            "يَّات": { 
                emoji: "🏥", 
                arText: "عَمَلِيَّات", 
                trText: "Operasyonlar / Ameliyatlar.",
                ornek: { ar: "غُرْفَةُ الْعَمَلِيَّاتِ فِي الْمُسْتَشْفَى", tr: "Hastanede ameliyathane (operasyon odası)." } 
            } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "📦", arText: "مَعْمُول", trText: "Yapılmış / Mamul." } 
        },
        
        // --- 47 Numaralı Kalıp (فَعَلَة) ---
        47: { 
            base: { emoji: "👷", arText: "عَمَلَة", trText: "İşçiler (Cemi Teksir)." } 
        },
        
        // --- 55 Numaralı Kalıp (إِفْعَال) ---
        55: { 
            base: { emoji: "🏭", arText: "إِعْمَال", trText: "İşletme / Yürütme." } 
        },
        
        // --- 67 Numaralı Kalıp (مُفَاعَلَة) ---
        67: { 
            base: { 
                emoji: "🤝", 
                arText: "مُعَامَلَة", 
                trText: "Muamele / Davranış.",
                ornek: { ar: "الدِّينُ الْمُعَامَلَةُ", tr: "Din, güzel muameledir (insan ilişkileridir). (Hadis-i Şerif)" }
            }, 
            suggestsPlus: true, 
            "ات": { 
                emoji: "🗂️", 
                arText: "مُعَامَلَات", 
                trText: "İşlemler / Muameleler." 
            } 
        },
        
        // --- 103 Numaralı Kalıp (اِسْتِفْعَال) ---
        103: { 
            base: { 
                emoji: "🔄", 
                arText: "اِسْتِعْمَال", 
                trText: "Kullanım / İstimal.",
                ornek: { ar: "دَلِيلُ الِاسْتِعْمَالِ", tr: "Kullanım kılavuzu (İstimal rehberi)." }
            } 
        }
    },

    // ==================================================================
    // 26. D-R-S (د ر س) KÖKÜ - Ders / Okumak / Öğrenmek
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve Tef'îl Babı
    // ==================================================================
    "درس": {
        // --- 1, 2, 3 Numaralı Kalıplar (1. Bab) ---
        1: { base: { emoji: "📖", arText: "دَرَسَ", trText: "Ders çalıştı / Okudu." } },
        2: { base: { emoji: "✍️", arText: "يَدْرُسُ", trText: "Ders çalışır / Okuyor." } },
        3: { base: { emoji: "📚", arText: "اُدْرُسْ", trText: "Ders çalış / Oku!" } },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            base: { emoji: "📓", arText: "دَرْس", trText: "Ders." } 
        },
        
        // --- 23 Numaralı Kalıp (فِعَال) ---
        23: { 
            base: { emoji: "📚", arText: "دِرَاس", trText: "Öğrenim (Yalın)." },
            suggestsPlus: true, 
            "ة": { emoji: "📚", arText: "دِرَاسَة", trText: "Öğrenim / Eğitim." } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { emoji: "🏫", arText: "مَدْرَس", trText: "Eğitim yeri (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🏫", 
                arText: "مَدْرَسَة", 
                trText: "Okul / Medrese.",
                ornek: { ar: "الْمَدْرَسَةُ بَيْتُنَا الثَّانِي", tr: "Okul bizim (öğrencilerin) ikinci evidir." }
            } 
        },

        // --- 58, 59, 60 Numaralı Kalıplar (Tef'îl Babı) ---
        58: { base: { emoji: "👨‍🏫", arText: "دَرَّسَ", trText: "Ders verdi / Öğretti." } },
        59: { base: { emoji: "🗣️", arText: "يُدَرِّسُ", trText: "Ders verir / Öğretiyor." } },
        60: { base: { emoji: "❗", arText: "دَرِّسْ", trText: "Ders ver / Öğret!" } },

        // --- 61 Numaralı Kalıp (تَفْعِيل) ---
        61: { 
            base: { emoji: "✍️", arText: "تَدْرِيس", trText: "Öğretmek / Tedrisat." } 
        },
        
        // --- 62 Numaralı Kalıp (مُفَعِّل) ---
        62: { 
            base: { 
                emoji: "👨‍🏫", 
                arText: "مُدَرِّس", 
                trText: "Öğretmen / Müderris.",
                ornek: { ar: "هُوَ مُدَرِّسٌ نَاجِحٌ فِي الْمَدْرَسَةِ", tr: "O, okulda başarılı bir öğretmendir (müderristir)." }
            } 
        }
    },

    // ==================================================================
    // 27. H-F-Z (ح ف ظ) KÖKÜ - Korumak / Ezberlemek
    // 4. Bab (فَعِلَ - يَفْعَلُ) ve Müfâ'ale Babı
    // ==================================================================
    "حفظ": {
        // --- 8, 9, 10 Numaralı Kalıplar (4. Bab) ---
        8: { base: { emoji: "🛡️", arText: "حَفِظَ", trText: "Korudu / Ezberledi." } },
        9: { base: { emoji: "🧠", arText: "يَحْفَظُ", trText: "Korur / Ezberliyor." } },
        10: { base: { emoji: "📖", arText: "اِحْفَظْ", trText: "Koru / Ezberle!" } },

        // --- 20 Numaralı Kalıp (فِعْل) ---
        20: { 
            base: { emoji: "💾", arText: "حِفْظ", trText: "Koruma / Hıfz." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "📖", 
                arText: "حَافِظ", 
                trText: "Koruyan / Ezberleyen.",
                ornek: { ar: "فَاللهُ خَيْرٌ حَافِظًا", tr: "Allah en hayırlı koruyucudur. (Yusuf Suresi, 64)" }
            }, 
            suggestsPlus: true, 
            "ة": { 
                emoji: "🧠", 
                arText: "حَافِظَة", 
                trText: "Hafıza / Bellek.",
                ornek: { ar: "لَدَيْهِ حَافِظَةٌ قَوِيَّةٌ", tr: "Onun güçlü bir hafızası var." }
            } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "🛡️", 
                arText: "مَحْفُوظ", 
                trText: "Korunmuş / Mahfuz.",
                ornek: { ar: "فِي لَوْحٍ مَحْفُوظٍ", tr: "Korunmuş bir levhadadır (Levh-i Mahfuz). (Büruc Suresi, 22)" }
            } 
        },

        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı) ---
        64: { base: { emoji: "🏰", arText: "حَافَظَ", trText: "Özen gösterdi / Muhafaza etti." } },
        65: { base: { emoji: "🤲", arText: "يُحَافِظُ", trText: "Özen gösterir / Muhafaza ediyor." } },
        66: { base: { emoji: "❗", arText: "حَافِظْ", trText: "Özen göster / Muhafaza et!" } },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة) ---
        67: { 
            base: { 
                emoji: "🏰", 
                arText: "مُحَافَظَة", 
                trText: "Koruma / Muhafaza.",
                ornek: { ar: "حَافِظُوا عَلَى الصَّلَوَاتِ", tr: "Namazları koruyun (özen gösterin). (Bakara Suresi, 238)" }
            } 
        },
        
        // --- 69 Numaralı Kalıp (مُفَاعِل) ---
        69: { 
            base: { emoji: "👔", arText: "مُحَافِظ", trText: "Koruyan / Vali (Muhafız)." } 
        }
    },

    // ==================================================================
    // 28. N-Z-R (ن ظ ر) KÖKÜ - Bakmak / Görmek / Beklemek
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve İfti'âl Babı
    // ==================================================================
    "نظر": {
        // --- 1, 2, 3 Numaralı Kalıplar (1. Bab) ---
        1: { base: { emoji: "👁️", arText: "نَظَرَ", trText: "Baktı." } },
        2: { base: { emoji: "👀", arText: "يَنْظُرُ", trText: "Bakar / Bakıyor." } },
        3: { base: { emoji: "🔭", arText: "اُنْظُرْ", trText: "Bak!" } },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { 
                emoji: "👁️", 
                arText: "نَظَر", 
                trText: "Bakış / Nazar.",
                ornek: { ar: "الْعَيْنُ حَقٌّ", tr: "Nazar (göz değmesi) haktır (gerçektir). (Hadis-i Şerif)" }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "👀", arText: "نَاظِر", trText: "Bakan / Nazır." } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { emoji: "🌄", arText: "مَنْظَر", trText: "Manzara / Görünüm." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🌄", 
                arText: "مَنْظَرَة", 
                trText: "Manzara yeri.",
                ornek: { ar: "يَا لَهُ مِنْ مَنْظَرٍ جَمِيلٍ!", tr: "Ne kadar güzel bir manzara!" }
            } 
        },
        
        // --- 67 Numaralı Kalıp (مُفَاعَلَة) ---
        67: { 
            base: { emoji: "🗣️", arText: "مُنَاظَرَة", trText: "Münazara (Karşılıklı tartışma)." } 
        },

        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı) ---
        77: { base: { emoji: "⏳", arText: "اِنْتَظَرَ", trText: "Bekledi (İntizar etti)." } },
        78: { base: { emoji: "⌚", arText: "يَنْتَظِرُ", trText: "Bekler / Bekliyor." } },
        79: { base: { emoji: "✋", arText: "اِنْتَظِرْ", trText: "Bekle!" } },

        // --- 80 Numaralı Kalıp (اِفْتِعَال) ---
        80: { 
            base: { 
                emoji: "⏳", 
                arText: "اِنْتِظَار", 
                trText: "Beklemek / İntizar.",
                ornek: { ar: "اِنْتِظَارُ الْفَرَجِ عِبَادَةٌ", tr: "Sıkıntıdan kurtulmayı beklemek (intizar) ibadettir. (Hadis-i Şerif)" }
            } 
        }
    },

    // ==================================================================
    // 29. M-K-N (م ك ن) KÖKÜ - Mümkün Olmak / Yer / Güç
    // 5. Bab (فَعُلَ - يَفْعُلُ) ve Tef'îl Babı
    // ==================================================================
    "مكن": {
        // --- 11, 12, 13 Numaralı Kalıplar (5. Bab) ---
        11: { base: { emoji: "💪", arText: "مَكُنَ", trText: "Güçlü / Sağlam oldu." } },
        12: { base: { emoji: "🛡️", arText: "يَمْكُنُ", trText: "Güçlü / Sağlam olur." } },
        13: { base: { emoji: "❗", arText: "اُمْكُنْ", trText: "Güçlü ol!" } },

        // --- 22 Numaralı Kalıp (فَعَال) ---
        22: { 
            base: { 
                emoji: "📍", 
                arText: "مَكَان", 
                trText: "Yer / Mekan.",
                ornek: { ar: "شَرَفُ الْمَكَانِ بِالْمَكِينِ", tr: "Bir mekânın şerefi (değeri), orada bulunanlardan gelir. (Atasözü)" }
            } 
        },
        
        // --- 55 Numaralı Kalıp (إِفْعَال) ---
        55: { 
            base: { 
                emoji: "✨", 
                arText: "إِمْكَان", 
                trText: "İmkan / Olasılık.",
                ornek: { ar: "فِي حُدُودِ الْإِمْكَانِ", tr: "İmkânlar dâhilinde." }
            } 
        },
        
        // --- 56 Numaralı Kalıp (مُفْعِل) ---
        56: { 
            base: { 
                emoji: "✔️", 
                arText: "مُمْكِن", 
                trText: "Mümkün / Olası.",
                ornek: { ar: "كُلُّ شَيْءٍ مُمْكِنٌ بِإِذْنِ اللهِ", tr: "Allah'ın izniyle her şey mümkündür." }
            } 
        },

        // --- 58, 59, 60 Numaralı Kalıplar (Tef'îl Babı) ---
        58: { base: { emoji: "🏗️", arText: "مَكَّنَ", trText: "Güçlendirdi / İmkan verdi." } },
        59: { base: { emoji: "⚙️", arText: "يُمَكِّنُ", trText: "Güçlendirir / İmkan verir." } },
        60: { base: { emoji: "✅", arText: "مَكِّنْ", trText: "Güçlendir / İmkan ver!" } },

        // --- 61 Numaralı Kalıp (تَفْعِيل) ---
        61: { 
            base: { emoji: "💪", arText: "تَمْكِين", trText: "Güçlendirmek." } 
        }
    },

  // ==================================================================
    // 30. H-S-N (ح س ن) KÖKÜ - Güzellik / İyilik / İhsan
    // 5. Bab (فَعُلَ - يَفْعُلُ) ve İf'âl Babı
    // ==================================================================
    "حسن": {
        // --- 11, 12, 13 Numaralı Kalıplar (5. Bab) ---
        11: { base: { emoji: "🌸", arText: "حَسُنَ", trText: "Güzel oldu." } },
        12: { base: { emoji: "✨", arText: "يَحْسُنُ", trText: "Güzel olur." } },
        13: { base: { emoji: "💖", arText: "اُحْسُنْ", trText: "Güzel ol!" } },

        // --- 17 Numaralı Kalıp (Sıfat-ı Müşebbehe / İsim) ---
        17: { 
            base: { 
                emoji: "🌸", 
                arText: "حَسَن", 
                trText: "Güzel / İyi.",
                ornek: { 
                    ar: "الْحَسَنُ وَالْحُسَيْنُ سَيِّدَا شَبَابِ أَهْلِ الْجَنَّةِ", 
                    tr: "Hasan ve Hüseyin, cennet gençlerinin efendileridir. (Hadis-i Şerif)" 
                }
            } 
        }, 
        
        // --- 21 Numaralı Kalıp (فُعْل) ve Hüsniye İsmi ---
        21: { 
            base: { emoji: "✨", arText: "حُسْن", trText: "Güzellik / İyilik." },
            suggestsPlus: true,
            "يّ": { emoji: "👨", arText: "حُسْنِيّ", trText: "Hüsnü (Erkek ismi)." },
            "يَّة": { emoji: "🧕", arText: "حُسْنِيَّة", trText: "Hüsniye (Kadın ismi)." }
        },

        // --- 49 Numaralı Kalıp (İsm-i Tasgir) ---
        49: { base: { emoji: "🌷", arText: "حُسَيْن", trText: "Hüseyin (Küçük güzellik)." } }, 
        
        // --- 50 Numaralı Kalıp (İsm-i Tafdil) ---
        50: { 
            base: { 
                emoji: "🥇", 
                arText: "أَحْسَن", 
                trText: "En güzel / Daha güzel.",
                ornek: { 
                    ar: "لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ", 
                    tr: "Biz insanı en güzel biçimde (ahsen-i takvim) yarattık. (Tîn Suresi, 4)" 
                }
            } 
        }, 
        
        // --- 51 Numaralı Kalıp (İsm-i Tafdil Müennes) ---
        51: { 
            base: { 
                emoji: "💎", 
                arText: "حُسْنَى", 
                trText: "En güzel (Müennes).",
                ornek: { 
                    ar: "وَلِلهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا", 
                    tr: "En güzel isimler (Esma-ül Hüsna) Allah'ındır, O'na onlarla dua edin. (A'râf Suresi, 180)" 
                }
            } 
        }, 

        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı) ---
        52: { base: { emoji: "🎁", arText: "أَحْسَنَ", trText: "İyilik yaptı (İhsan etti)." } },
        53: { base: { emoji: "🤝", arText: "يُحْسِنُ", trText: "İyilik yapar / İhsan ediyor." } },
        54: { base: { emoji: "❤️", arText: "أَحْسِنْ", trText: "İyilik yap / İhsan et!" } },

        // --- 55 Numaralı Kalıp (İf'âl Masdarı) ---
        55: { 
            base: { 
                emoji: "💖", 
                arText: "إِحْسَان", 
                trText: "İyilik etmek / Lütuf.",
                ornek: { 
                    ar: "هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ", 
                    tr: "İyiliğin (ihsanın) karşılığı, iyilikten başka bir şey midir? (Rahmân Suresi, 60)" 
                }
            } 
        }, 
        
        // --- 56 Numaralı Kalıp (İf'âl İsm-i Faili) ---
        56: { 
            base: { emoji: "😇", arText: "مُحْسِن", trText: "İyilik eden (Muhsin)." },
            suggestsPlus: true,
            "ينَ": {
                emoji: "👥",
                arText: "مُحْسِنِينَ",
                trText: "İyilik edenler (Çoğul / Mansub-Mecrur).",
                ornek: { 
                    ar: "إِنَّ اللهَ يُحِبُّ الْمُحْسِنِينَ", 
                    tr: "Şüphesiz Allah, iyilik edenleri (muhsinleri) sever. (Bakara Suresi, 195)" 
                } 
            }
        }, 
        
        // --- 61 Numaralı Kalıp (Tef'il Masdarı) ---
        61: { base: { emoji: "📈", arText: "تَحْسِين", trText: "İyileştirmek (Tahsin)." } } 
    },

// ==================================================================
    // 31. S-'-D (س ع د) KÖKÜ - Mutluluk / Saadet / Yardım
    // 4. Bab (فَعِلَ - يَفْعَلُ) ve Mufâ'ale Babı
    // ==================================================================
    "سعد": {
        // --- 8, 9, 10 Numaralı Kalıplar (4. Bab - Sülasi Mücerred) ---
        8: { 
            base: { emoji: "😊", arText: "سَعِدَ", trText: "Mutlu oldu." } 
        },
        9: { 
            base: { emoji: "😁", arText: "يَسْعَدُ", trText: "Mutlu olur / Mutlu oluyor." } 
        },
        10: { 
            base: { emoji: "✨", arText: "اِسْعَدْ", trText: "Mutlu ol!" } 
        },

        // --- 22 Numaralı Kalıp (فَعَال) ---
        22: { 
            base: { emoji: "✨", arText: "سَعَاد", trText: "Mutluluk (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "✨", 
                arText: "سَعَادَة", 
                trText: "Saadet / Mutluluk.",
                ornek: { ar: "السَّعَادَةُ فِي الْقَنَاعَةِ", tr: "Mutluluk (saadet) kanaattedir. (Atasözü)" } 
            } 
        }, 
        
        // --- 24 Numaralı Kalıp (فُعَال) ---
        24: { 
            base: { emoji: "🌸", arText: "سُعَاد", trText: "Suad (Mutluluk/Kadın ismi)." } 
        }, 
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "😊", 
                arText: "سَعِيد", 
                trText: "Mutlu / Mesut.",
                ornek: { ar: "فَمِنْهُمْ شَقِيٌّ وَسَعِيدٌ", tr: "Onlardan kimi bedbaht (mutsuz), kimi de bahtiyar (mutlu - said)dır. (Hûd Suresi, 105)" }
            }, 
            suggestsPlus: true, 
            "ة": { 
                emoji: "🥰", 
                arText: "سَعِيدَة", 
                trText: "Mutlu (Kadın).",
                ornek: { ar: "أُسْرَةٌ سَعِيدَةٌ", tr: "Mutlu bir aile." }
            } 
        }, 
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "🍀", 
                arText: "مَسْعُود", 
                trText: "Mutlu edilmiş / Mesut.",
                ornek: { ar: "أَيَّامٌ مَسْعُودَةٌ", tr: "Mutlu (Mesut) ve uğurlu günler." }
            }, 
            suggestsPlus: true, 
            "ة": { emoji: "🌻", arText: "مَسْعُودَة", trText: "Mesude (Mutlu kadın)." } 
        },
  
        // --- 64 Numaralı Kalıp (فَاعَلَ - Mazi / Mufâ'ale Babı) ---
        64: { 
            base: { emoji: "🤝", arText: "سَاعَدَ", trText: "Yardım etti / Destek oldu." } 
        },

        // --- 65 Numaralı Kalıp (يُفَاعِلُ - Muzari / Mufâ'ale Babı) ---
        65: { 
            base: { emoji: "🤝", arText: "يُسَاعِدُ", trText: "Yardım eder / Yardım ediyor." } 
        },
        
        // --- 66 Numaralı Kalıp (فَاعِلْ - Emir / Mufâ'ale Babı) ---
        66: { 
            base: { emoji: "🔄", arText: "سَاعِدْ", trText: "Yardım et / Destek ol!" } 
        },
        
        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Mufâ'ale Masdarı) ---
        67: { 
            base: { 
                emoji: "❗", 
                arText: "مُسَاعَدَة", 
                trText: "Yardım / Müsaade.",
                ornek: { ar: "طَلَبَ الْمُسَاعَدَةَ مِنِّي", tr: "Benden yardım (müsaade) istedi." }
            } 
        },
        
        // --- 69 Numaralı Kalıp (مُفَاعِل - Mufâ'ale Babı İsm-i Faili) ---
        69: { 
            base: { 
                emoji: "👍", 
                arText: "مُسَاعِد", 
                trText: "Yardımcı / Müsait.",
                ornek: { ar: "هَذَا الْوَقْتُ مُسَاعِدٌ جِدًّا", tr: "Bu vakit çok müsaittir (yardımcı/elverişlidir)." }
            } 
        }
    },

    // ==================================================================
    // 32. J-H-L (ج ه ل) KÖKÜ - Bilmemek / Cehalet
    // 4. Bab (فَعِلَ - يَفْعَلُ)
    // ==================================================================
    "جهل": {
        // --- 8, 9, 10 Numaralı Kalıplar (4. Bab) ---
        8: { base: { emoji: "🤷", arText: "جَهِلَ", trText: "Bilmedi / Cahil kaldı." } },
        9: { base: { emoji: "❓", arText: "يَجْهَلُ", trText: "Bilmez / Bilmiyor." } },
        10: { base: { emoji: "❗", arText: "اِجْهَلْ", trText: "Bilme!" } },

        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "🙈", 
                arText: "جَاهِل", 
                trText: "Bilmeyen / Cahil.",
                ornek: { ar: "النَّاسُ أَعْدَاءُ مَا جَهِلُوا", tr: "İnsanlar bilmedikleri şeyin düşmanıdır. (Hz. Ali)" }
            }, 
            suggestsPlus: true, 
            "يَّة": { 
                emoji: "🌑", 
                arText: "جَاهِلِيَّة", 
                trText: "Cahiliye (dönemi).",
                ornek: { ar: "عَادَاتُ الْجَاهِلِيَّةِ الْقَدِيمَةِ", tr: "Eski cahiliye dönemi adetleri." }
            } 
        }, 
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "❓", 
                arText: "مَجْهُول", 
                trText: "Bilinmeyen / Meçhul.",
                ornek: { ar: "فَاعِلٌ مَجْهُولٌ", tr: "Faili meçhul (yapanı bilinmeyen)." }
            } 
        }, 
        
        // --- 46 Numaralı Kalıp (فُعَلَاء) ---
        46: { 
            base: { 
                emoji: "🙉", 
                arText: "جُهَلَاء", 
                trText: "Cahiller (Cühelâ).",
                ornek: { ar: "وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا", tr: "Cahiller onlara laf attığında 'Selam' der (geçerler). (Furkan Suresi, 63)" }
            } 
        } 
    },

    // ==================================================================
    // 34. S-K-N (س ك ن) KÖKÜ - Sakin olmak / İkamet etmek / Huzur
    // 1. Bab (فَعَلَ - يَفْعُلُ)
    // ==================================================================
    "سكن": {
        // --- 1, 2, 3 Numaralı Kalıplar (1. Bab) ---
        1: { base: { emoji: "😌", arText: "سَكَنَ", trText: "Sakinleşti / İkamet etti." } },
        2: { base: { emoji: "🏡", arText: "يَسْكُنُ", trText: "Sakinleşir / İkamet ediyor." } },
        3: { base: { emoji: "🛑", arText: "اُسْكُنْ", trText: "Sakinleş / İkamet et!" } },

        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { base: { emoji: "😌", arText: "سَاكِن", trText: "Sakin / Oturan." } }, 
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "🕊️", arText: "سَكِين", trText: "Huzur (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "✨", 
                arText: "سَكِينَة", 
                trText: "Sekinet / Huzur ve güven.",
                ornek: { ar: "فَأَنْزَلَ اللهُ سَكِينَتَهُ عَلَيْهِ", tr: "Allah onun üzerine sekinetini (huzur ve güvenini) indirdi. (Tevbe Suresi, 40)" }
            } 
        }, 
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "🏘️", 
                arText: "مَسْكُون", 
                trText: "İkamet edilen / Meskun.",
                ornek: { ar: "مِنْطَقَةٌ مَسْكُونَةٌ", tr: "Meskun mahal (yerleşim yeri)." }
            } 
        }, 
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { 
                emoji: "🏡", 
                arText: "مَسْكَن", 
                trText: "İkamet yeri / Mesken.",
                ornek: { ar: "وَاللهُ جَعَلَ لَكُمْ مِنْ بُيُوتِكُمْ سَكَنًا", tr: "Allah, evlerinizi sizin için bir huzur ve dinlenme yeri (mesken/sakan) kıldı. (Nahl Suresi, 80)" }
            } 
        }, 
        
        // --- 55 Numaralı Kalıp (إِفْعَال) ---
        55: { base: { emoji: "🏢", arText: "إِسْكَان", trText: "İskan / Yerleştirme." } }, 
        
        // --- 61 Numaralı Kalıp (تَفْعِيل) ---
        61: { 
            base: { 
                emoji: "🕊️", 
                arText: "تَسْكِين", 
                trText: "Teskin / Yatıştırma.",
                ornek: { ar: "تَسْكِينُ الْأَلَمِ", tr: "Ağrıyı dindirmek (Teskin etmek)." }
            } 
        } 
    },

    // ==================================================================
    // 35. J-H-D (ج ه د) KÖKÜ - Çaba Göstermek / Gayret / Mücadele
    // 3. Bab (فَعَلَ - يَفْعَلُ)
    // ==================================================================
    "جهد": {
        // --- 1, 6, 7 Numaralı Kalıplar (3. Bab) ---
        1: { base: { emoji: "💦", arText: "جَهَدَ", trText: "Çaba gösterdi." } },
        6: { base: { emoji: "💪", arText: "يَجْهَدُ", trText: "Çaba gösterir / Çabalıyor." } },
        7: { base: { emoji: "🏃", arText: "اِجْهَدْ", trText: "Çaba göster!" } },

        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı) ---
        64: { base: { emoji: "⚔️", arText: "جَاهَدَ", trText: "Mücadele etti / Cihad etti." } },
        65: { base: { emoji: "🛡️", arText: "يُجَاهِدُ", trText: "Mücadele eder / Cihad ediyor." } },
        66: { base: { emoji: "❗", arText: "جَاهِدْ", trText: "Mücadele et / Cihad et!" } },

        // --- 23 Numaralı Kalıp (فِعَال) ---
        23: { 
            base: { 
                emoji: "🛡️", 
                arText: "جِهَاد", 
                trText: "Mücadele / Cihad.",
                ornek: { ar: "وَجَاهِدُوا فِي اللهِ حَقَّ جِهَادِهِ", tr: "Allah uğrunda hakkıyla cihad edin (gayret gösterin). (Hac Suresi, 78)" }
            } 
        }, 
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { base: { emoji: "💪", arText: "جَاهِد", trText: "Çaba gösteren." } }, 
        
        // --- 69 Numaralı Kalıp (مُفَاعِل) ---
        69: { 
            base: { emoji: "🏇", arText: "مُجَاهِد", trText: "Mücahit / Mücadele eden." }, 
            suggestsPlus: true, 
            "ة": { emoji: "🧕", arText: "مُجَاهِدَة", trText: "Kadın mücahit." } 
        }, 

        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı) ---
        77: { base: { emoji: "📚", arText: "اِجْتَهَدَ", trText: "Çabaladı / İçtihat etti." } },
        78: { base: { emoji: "✍️", arText: "يَجْتَهِدُ", trText: "Çabalar / İçtihat ediyor." } },
        79: { base: { emoji: "❗", arText: "اِجْتَهِدْ", trText: "Çabala / İçtihat et!" } },

        // --- 80 Numaralı Kalıp (اِفْتِعَال) ---
        80: { 
            base: { 
                emoji: "📚", 
                arText: "اِجْتِهَاد", 
                trText: "İçtihat / Gayret.",
                ornek: { ar: "الِاجْتِهَادُ مِفْتَاحُ النَّجَاحِ", tr: "Çalışmak (içtihat/gayret), başarının anahtarıdır." }
            } 
        }, 
        
        // --- 81 Numaralı Kalıp (مُفْتَعِل) ---
        81: { 
            base: { 
                emoji: "🤓", 
                arText: "مُجْتَهِد", 
                trText: "Çalışkan / Müçtehit.",
                ornek: { ar: "لِكُلِّ مُجْتَهِدٍ نَصِيبٌ", tr: "Her çalışanın (gayret edenin) bir nasibi (payı) vardır. (Atasözü)" }
            } 
        } 
    },

    
    // ==================================================================
    // 37. R-J-' (ر ج ع) KÖKÜ - Dönmek / Başvurmak / Gözden Geçirmek
    // 2. Bab (فَعَلَ - يَفْعِلُ)
    // ==================================================================
    "رجع": {
        // --- 1, 4, 5 Numaralı Kalıplar (2. Bab) ---
        1: { base: { emoji: "↩️", arText: "رَجَعَ", trText: "Döndü." } },
        4: { base: { emoji: "🔙", arText: "يَرْجِعُ", trText: "Döner / Dönüyor." } },
        5: { base: { emoji: "❗", arText: "اِرْجِعْ", trText: "Dön!" } },

        // --- 37 Numaralı Kalıp (مَفْعِل) ---
        37: { 
            base: { 
                emoji: "📚", 
                arText: "مَرْجِع", 
                trText: "Dönüş yeri / Kaynak (Merci).",
                ornek: { ar: "إِلَى اللهِ مَرْجِعُكُمْ جَمِيعًا", tr: "Hepinizin dönüşü (mercii/kaynağı) Allah'adır. (Mâide Suresi, 48)" }
            } 
        }, 

        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı) ---
        64: { base: { emoji: "📝", arText: "رَاجَعَ", trText: "Gözden geçirdi / Müracaat etti." } },
        65: { base: { emoji: "📖", arText: "يُرَاجِعُ", trText: "Gözden geçirir / Müracaat ediyor." } },
        66: { base: { emoji: "❗", arText: "رَاجِعْ", trText: "Gözden geçir / Müracaat et!" } },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة) ---
        67: { 
            base: { 
                emoji: "📝", 
                arText: "مُرَاجَعَة", 
                trText: "Gözden geçirme / Müracaat.",
                ornek: { ar: "مُرَاجَعَةُ الدُّرُوسِ قَبْلَ الِامْتِحَانِ مُفِيدَةٌ", tr: "Sınavdan önce derslerin tekrar edilmesi (gözden geçirilmesi) faydalıdır." }
            } 
        }, 
        
        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı) ---
        77: { base: { emoji: "🔄", arText: "اِرْتَجَعَ", trText: "Geri döndü / İade etti." } },
        78: { base: { emoji: "🔁", arText: "يَرْتَجِعُ", trText: "Geri döner / İade ediyor." } },
        79: { base: { emoji: "❗", arText: "اِرْتَجِعْ", trText: "Geri dön / İade et!" } },

        // --- 80 Numaralı Kalıp (اِفْتِعَال) ---
        80: { 
            base: { 
                emoji: "↩️", 
                arText: "اِرْتِجَاع", 
                trText: "İade / Geri verme.",
                ornek: { ar: "اِرْتِجَاعُ الْبَضَاعَةِ حَقٌّ لِلْمُشْتَرِي", tr: "Malın iadesi (geri verilmesi) alıcının hakkıdır." }
            } 
        } 
    },

    // ==================================================================
    // 38. Sh-K-L (ش ك ل) KÖKÜ - Biçim / Şekil / Sorun
    // 2. Bab (فَعَلَ - يَفْعِلُ)
    // ==================================================================
    "شكل": {
        // --- 1, 4, 5 Numaralı Kalıplar (2. Bab) ---
        1: { base: { emoji: "📏", arText: "شَكَلَ", trText: "Şekillendirdi." } },
        4: { base: { emoji: "📐", arText: "يَشْكِلُ", trText: "Şekillendirir." } },
        5: { base: { emoji: "❗", arText: "اِشْكِلْ", trText: "Şekillendir!" } },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { base: { emoji: "📐", arText: "شَكْل", trText: "Şekil / Biçim." } }, 
        
        // --- 41 Numaralı Kalıp (أَفْعَال) ---
        41: { base: { emoji: "🎨", arText: "أَشْكَال", trText: "Şekiller." } }, 
        
        // --- 56 Numaralı Kalıp (مُفْعِل) ---
        56: { 
            base: { emoji: "⚠️", arText: "مُشْكِل", trText: "Sorun (Yalın)." },
            suggestsPlus: true,
            "ة": {
                emoji: "⚠️",
                arText: "مُشْكِلَة",
                trText: "Sorun / Problem / Müşkül.",
                ornek: { ar: "لِكُلِّ مُشْكِلَةٍ حَلٌّ فِي النِّهَايَةِ", tr: "Her müşkülün (sorunun) sonunda bir çözümü vardır." }
            }
        }, 
        
        // --- 58, 59, 60 Numaralı Kalıplar (Tef'îl Babı) ---
        58: { base: { emoji: "🏺", arText: "شَكَّلَ", trText: "Oluşturdu / Teşkil etti." } },
        59: { base: { emoji: "🛠️", arText: "يُشَكِّلُ", trText: "Oluşturur / Teşkil ediyor." } },
        60: { base: { emoji: "❗", arText: "شَكِّلْ", trText: "Oluştur / Teşkil et!" } },

        // --- 61 Numaralı Kalıp (تَفْعِيل) ---
        61: { 
            base: { emoji: "🔠", arText: "تَشْكِيل", trText: "Şekillendirme." }, 
            suggestsPlus: true, 
            "ات": { 
                emoji: "🏢", 
                arText: "تَشْكِيلَات", 
                trText: "Teşkilatlar / Kurumlar.",
                ornek: { ar: "تَشْكِيلَاتُ الدَّوْلَةِ التَّنْظِيمِيَّةِ", tr: "Devletin kurumsal teşkilatları (yapılanmaları)." }
            } 
        } 
    },

    // ==================================================================
    // 39. N-S-B (ن س ب) KÖKÜ - İlişki / Soy / Oran / Uygunluk
    // 2. Bab (فَعَلَ - يَفْعِلُ)
    // ==================================================================
    "نسب": {
        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { 
                emoji: "🌳", 
                arText: "نَسَب", 
                trText: "Soy / Nesep.",
                ornek: { ar: "الْمَرْءُ بِأَدَبِهِ لَا بِأَصْلِهِ وَنَسَبِهِ", tr: "Kişinin değeri aslı ve nesebiyle (soyuyla) değil, edebiyle ölçülür. (Atasözü)" }
            } 
        }, 
        
        // --- 20 Numaralı Kalıp (فِعْل) ---
        20: { 
            base: { emoji: "📊", arText: "نِسْب", trText: "Oran (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "📊", 
                arText: "نِسْبَة", 
                trText: "Nispet / Oran.",
                ornek: { ar: "نِسْبَةُ النَّجَاحِ عَالِيَةٌ فِي الِامْتِحَانِ", tr: "Sınavdaki başarı nispeti (oranı) oldukça yüksektir." }
            } 
        }, 
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { base: { emoji: "👤", arText: "مَنْسُوب", trText: "Mensup / İlişkili." } }, 
        
        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı) ---
        64: { base: { emoji: "🧩", arText: "نَاسَبَ", trText: "Uygun oldu." } },
        65: { base: { emoji: "✅", arText: "يُنَاسِبُ", trText: "Uygun olur / Yakışıyor." } },
        66: { base: { emoji: "❗", arText: "نَاسِبْ", trText: "Uygun ol!" } },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة) ---
        67: { 
            base: { 
                emoji: "🎉", 
                arText: "مُنَاسَبَة", 
                trText: "Münasebet / Vesile / İlişki.",
                ornek: { ar: "نَحْتَفِلُ بِهَذِهِ الْمُنَاسَبَة السَّعِيدَةِ", tr: "Bu mutlu münasebet (vesile/özel gün) sebebiyle kutlama yapıyoruz." }
            } 
        }, 
        
        // --- 69 Numaralı Kalıp (مُفَاعِل) ---
        69: { base: { emoji: "👍🏼", arText: "مُنَاسِب", trText: "Uygun / Münasip." } },
        
        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı) ---
        77: { base: { emoji: "📝", arText: "اِنْتَسَبَ", trText: "Kayıt oldu / İntisap etti." } },
        78: { base: { emoji: "✍️", arText: "يَنْتَسِبُ", trText: "Kayıt olur / İntisap ediyor." } },
        79: { base: { emoji: "❗", arText: "اِنْتَسِبْ", trText: "Kayıt ol / İntisap et!" } },

        // --- 80 Numaralı Kalıp (اِفْتِعَال) ---
        80: { base: { emoji: "📝", arText: "اِنْتِسَاب", trText: "Kayıt olma / İntisap." } } 
    },

    // ==================================================================
    // 40. H-S-L (ح ص ل) KÖKÜ - Elde Etmek / Ürün / Sonuç
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve Tef'îl Babı
    // ==================================================================
    "حصل": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { base: { emoji: "🎯", arText: "حَصَلَ", trText: "Meydana geldi / Elde etti." } },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { base: { emoji: "🔄", arText: "يَحْصُلُ", trText: "Meydana gelir / Elde ediyor." } },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { base: { emoji: "❗", arText: "اُحْصُلْ", trText: "Elde et!" } },

        // --- 25 Numaralı Kalıp (فُعُول - Masdar) ---
        25: { 
            base: { emoji: "✨", arText: "حُصُول", trText: "Meydana gelme / Elde etme." }, 
            suggestsPlus: true,
            "ا": { 
                emoji: "🤲", 
                arText: "حُصُولًا", 
                trText: "Elde ederek.",
                ornek: { ar: "حُصُولًا عَلَى رِضَا اللهِ", tr: "Allah'ın rızasını elde etmek için." }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "🎯", 
                arText: "حَاصِل", 
                trText: "Elde edilen / Hasıla.",
                ornek: { ar: "وَالْحَاصِلُ أَنَّ الصِّحَّةَ تَاجٌ", tr: "Velhasıl (sözün özü/kısacası), sağlık bir taçtır." }
            }, 
            suggestsPlus: true, 
            "ات": { 
                emoji: "📈", 
                arText: "حَاصِلَات", 
                trText: "Hasılat / Gelirler.",
                ornek: { ar: "زَادَتْ حَاصِلَاتُ الشَّرِكَةِ هَذَا الْعَامِ", tr: "Şirketin hasılatı (gelirleri) bu yıl arttı." }
            } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "🌾", 
                arText: "مَحْصُول", 
                trText: "Mahsul / Ürün.",
                ornek: { ar: "مَحْصُولُ هَذَا الْعَامِ وَفِيرٌ", tr: "Bu yılın mahsulü (ürünü) bereketlidir." }
            } 
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { base: { emoji: "💰", arText: "حَصَّلَ", trText: "Tahsil etti / Topladı / Kazandı." } },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { base: { emoji: "🧾", arText: "يُحَصِّلُ", trText: "Tahsil eder / Topluyor." } },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { base: { emoji: "❗", arText: "حَصِّلْ", trText: "Tahsil et / Topla!" } },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Masdar / Tef'îl Babı) ---
        61: { 
            base: { 
                emoji: "🎓", 
                arText: "تَحْصِيل", 
                trText: "Tahsil / Elde etme.",
                ornek: { ar: "تَحْصِيلُ الْعِلْمِ نُورٌ لِلْعَقْلِ", tr: "İlim tahsil etmek (eğitim görmek/elde etmek) akıl için nurdur." }
            }, 
            suggestsPlus: true, 
            "ات": { 
                emoji: "🧾", 
                arText: "تَحْصِيلَات", 
                trText: "Tahsilatlar / Toplananlar.",
                ornek: { ar: "قِسْمُ التَّحْصِيلَاتِ فِي الْبَنْكِ", tr: "Bankadaki tahsilat (alacakların toplanması) bölümü." }
            } 
        }
    },

    // ==================================================================
    // 41. B-R-K (ب ر ك) KÖKÜ - Bereket / Kutlamak / Çoğalmak
    // ==================================================================
    "برك": {
        // --- 17 Numaralı Kalıp (فَعَل) ---
       17: { 
            base: { 
                emoji: "🌱", 
                arText: "بَرَكَة", 
                trText: "Bereket / İlahi lütuf, çoğalma, kalıcı hayır." 
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "✨", 
                arText: "بَرَكَات", 
                trText: "Bereketler." 
            }
        },
        
        // --- 61 Numaralı Kalıp (تَفْعِيل) ---
        61: { 
            base: { emoji: "🥳", arText: "تَبْرِيك", trText: "Tebrik / Kutlama." },
            suggestsPlus: true,
            "ات": { 
                emoji: "🥳", 
                arText: "تَبْرِيكَات", 
                trText: "Tebrikler.",
                ornek: { ar: "تَبْرِيكَاتِي الْحَارَّةُ بِمُنَاسَبَةِ النَّجَاحِ", tr: "Başarı vesilesiyle en samimi tebriklerim." }
            }
        }, 
        
        // --- 70 Numaralı Kalıp (مُفَاعَل) ---
        70: { 
            base: { 
                emoji: "🌙", 
                arText: "مُبَارَك", 
                trText: "Mübarek / Bereketli.",
                ornek: { ar: "شَهْرٌ مُبَارَكٌ وَعِيدٌ سَعِيدٌ", tr: "Mübarek bir ay ve mutlu bir bayram." }
            } 
        }, 
        
        // --- 91 Numaralı Kalıp (تَفَعُّل) ---
        91: { 
            base: { 
                emoji: "🤲", 
                arText: "تَبَرُّك", 
                trText: "Bereketlenme / Teberrük.",
                ornek: { ar: "التَّبَرُّكُ بِدُعَاءِ الْوَالِدَيْنِ", tr: "Anne babanın duasıyla bereketlenmek (teberrük etmek)." }
            } 
        } 
    },

    // ==================================================================
    // 2. B-Q-Y (ب ق ي) KÖKÜ - Kalmak / Devam Etmek / Geriye Kalmak
    // Nakıs Fiil (Son harfi illetli).
    // ==================================================================
    "بقي": {
        // --- 1 Numaralı Kalıp (Mücerret 4. Bab Mazi) ---
       8: { 
            base: { 
                emoji: "⏳", 
                arText: "بَقِيَ", 
                trText: "Kaldı / Devam etti / Sona ermedi." 
            } 
        },

        // --- 2 Numaralı Kalıp (Mücerret 4. Bab Muzari) ---
        9: { 
            base: { 
                emoji: "🔄", 
                arText: "يَبْقَى", 
                trText: "Kalır / Devam eder." 
            } 
        },

        // --- 21 Numaralı Kalıp (فَعَال - Masdar) ---
        22: { 
            base: { 
                emoji: "♾️", 
                arText: "بَقَاء", 
                trText: "Beka / Kalıcılık, varlığını sürdürme, son bulmama.",
                ornek: [
                    {
                        ar: "💡 مَعْلُومَة ثَقَافِيَّة",
                        tr: "Kültürel Not: Gündelik hayatta veya siyasette duyduğumuz 'Beka sorunu', aslında bir devletin, milletin veya kurumun 'varlığını sürdürebilme, ayakta kalabilme' meselesidir."
                    }
                ]
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🏛️", 
                arText: "بَاقٍ", 
                trText: "Bâki / Kalıcı olan, ölümsüz, sona ermeyen.",
                ornek: { ar: "وَاللهُ خَيْرٌ وَأَبْقَى", tr: "Allah (mükafatı) daha hayırlı ve daha kalıcıdır (bâkidir). (Tâhâ Suresi, 73)" }
            },
            suggestsPlus: true, // Öğrenci + butonuna basınca "Bakiye" çıkacak
            "ة": { 
                emoji: "💰", 
                arText: "بَاقِيَة", 
                trText: "Bakiye / Geriye kalan şey, kalıntı, (hesapta) kalan miktar.",
                ornek: { 
                    ar: "رَصِيدُ الْبَاقِيَةِ", 
                    tr: "Kalan bakiye (Hesap bakiyesi). Türkçedeki 'Bakiye' kelimesi tam olarak bir işlemden 'geriye kalan miktar' anlamına geldiği için bu kökten türemiştir." 
                }
            } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi) ---
        52: { 
            base: { 
                emoji: "🤲", 
                arText: "أَبْقَى", 
                trText: "Bıraktı / Kalıcı kıldı / Muhafaza etti.",
                ornek: { ar: "أَبْقَاهُ حَيًّا", tr: "Onu hayatta bıraktı (yaşattı)." }
            } 
        },

        // --- 100 Numaralı Kalıp (اِسْتَفْعَلَ - İstif'âl Babı Mazi) ---
        100: {
            base: {
                emoji: "✋",
                arText: "اِسْتَبْقَى",
                trText: "Alıkoydu / Kalmasını istedi.",
                ornek: { ar: "اِسْتَبْقَى الضَّيْفَ", tr: "Misafiri (biraz daha kalması için) alıkoydu." }
            }
        }
    },

    // ==================================================================
    // 3. B-S-R (ب ص ر) KÖKÜ - Görmek / İçyüzünü Kavramak
    // ==================================================================
    "بصر": {
        
        // --- 1 Numaralı Kalıp (Mücerret 4. Bab Mazi) ---
        8: { 
            base: { 
                emoji: "👁️", 
                arText: "بَصِرَ", 
                trText: "Gördü / İdrak etti / Farkına vardı.",
                ornek: { 
                    ar: "بَصِرَ بِالْحَقِيقَةِ بَعْدَ حِينٍ", 
                    tr: "Bir süre sonra gerçeği idrak etti (farkına vardı)." 
                }
            },
            cekimi: ["بَصِرَ", "بَصِرَا", "بَصِرُوا", "بَصِرَتْ", "بَصِرَتَا", "بَصِرْنَ", "بَصِرْتَ", "بَصِرْتُمَا", "بَصِرْتُمْ", "بَصِرْتِ", "بَصِرْتُمَا", "بَصِرْتُنَّ", "بَصِرْتُ", "بَصِرْنَا", "بَصِرْنَا"]
        },

        // --- 2 Numaralı Kalıp (Mücerret 4. Bab Muzari) ---
       9: { 
            base: { 
                emoji: "🔍", 
                arText: "يَبْصَرُ", 
                trText: "Görür / İdrak eder.",
                ornek: {
                    ar: "مَنْ يَبْصَرُ عَيْبَهُ يَعْمَ عَنْ عَيْبِ غَيْرِهِ",
                    tr: "Kendi kusurunu (içyüzünü) gören kişi, başkasının kusuruna kör olur. (Arap Özdeyişi)"
                }
            },
            cekimi: ["يَبْصَرُ", "يَبْصَرَانِ", "يَبْصَرُونَ", "تَبْصَرُ", "تَبْصَرَانِ", "يَبْصَرْنَ", "تَبْصَرُ", "تَبْصَرَانِ", "تَبْصَرُونَ", "تَبْصَرِينَ", "تَبْصَرَانِ", "تَبْصَرْنَ", "أَبْصَرُ", "نَبْصَرُ", "نَبْصَرُ"]
        },

        // --- 3 Numaralı Kalıp (Mücerret 4. Bab Emir) ---
       10: { 
            base: { 
                emoji: "❗", 
                arText: "اِبْصَرْ", 
                trText: "Gör / Fark et!",
                ornek: {
                    ar: "اِبْصَرْ مَوْضِعَ قَدَمِكَ",
                    tr: "Adımını attığın yeri gör (fark et/dikkatli ol)."
                }
            },
            cekimi: ["اِبْصَرْ", "اِبْصَرَا", "اِبْصَرُوا", "اِبْصَرِي", "اِبْصَرَا", "اِبْصَرْنَ"]
        },
 
          // --- 21 Numaralı Kalıp (فَعَل - İsim/Masdar) ---
       // --- 17 Numaralı Kalıp (فَعَل - İsim/Masdar) ---
        17: { 
            base: { 
                emoji: "👁️", 
                arText: "بَصَر", 
                trText: "Basar / Görme duyusu, göz.",
                ornek: {
                    ar: "وَمَا أَمْرُ السَّاعَةِ إِلَّا كَلَمْحِ الْبَصَرِ",
                    tr: "Kıyamet işi, ancak bir göz açıp kapama süresi kadardır. (Nahl Suresi, 77)"
                }
            }
        },

        // --- 35 Numaralı Kalıp (فَعِيل - Sıfat-ı Müşebbehe / İsim) ---
        35: { 
            base: { 
                emoji: "🔍", 
                arText: "بَصِير", 
                trText: "Basîr / Her şeyi hakkıyla gören, içyüzünü kavrayan (Allah'ın isimlerindendir).",
                ornek: {
                    ar: "إِنَّ اللهَ بَصِيرٌ بِالْعِبَادِ",
                    tr: "Şüphesiz Allah, kullarını hakkıyla görendir. (Mü'min Suresi, 44)"
                }
            },
            suggestsPlus: true, // + ة ile Basîret
            "ة": { 
                emoji: "💡", 
                arText: "بَصِيرَة", 
                trText: "Basîret / Kalp gözü, derin kavrayış, sezgi.",
                ornek: [
                    { 
                        ar: "قُلْ هَذِهِ سَبِيلِي أَدْعُو إِلَى اللهِ عَلَى بَصِيرَةٍ", 
                        tr: "De ki: İşte bu benim yolumdur. Ben (insanları) Allah'a bir basîret (kesin bir bilgi ve kavrayış) üzere çağırıyorum. (Yûsuf Suresi, 108)" 
                    },
                    { 
                        ar: "💡 مَعْلُومَة ثَقَافِيَّة", 
                        tr: "Kültürel Not: 'Basar' başımızdaki gözle maddi olanı görmek iken; 'Basiret', kalp gözüyle işin içyüzünü ve hakikatini kavramaktır." 
                    }
                ]
            }
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "🌅", 
                arText: "إِبْصَار", 
                trText: "İbsar / Görme, farkına varma.",
                ornek: {
                    ar: "نِعْمَةُ الْإِبْصَارِ",
                    tr: "Görme nimeti (Göz nuru)."
                }
            } 
        }
    },

    // --- 41 Numaralı Kalıp (أَفْعَال - Cemi Mükesser / Kırık Çoğul) ---
        41: { 
            base: { 
                emoji: "👀", 
                arText: "أَبْصَار", 
                trText: "Ebsâr / Gözler, bakışlar.",
                ornek: {
                    ar: "قُلْ لِلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ",
                    tr: "Mümin erkeklere söyle, gözlerini (haramdan) sakınsınlar. (Nûr Suresi, 30)"
                }
            }
        },

     

    // ==================================================================
    // 44. R-S-L (ر س ل) KÖKÜ - Göndermek / Elçi / Mesaj
    // İf'âl Babı (أَفْعَلَ - يُفْعِلُ)
    // ==================================================================
    "رسل": {
        // --- 23 Numaralı Kalıp (فِعَال) ---
        23: { 
            base: { emoji: "✉️", arText: "رِسَال", trText: "Mesaj (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "✉️", 
                arText: "رِسَالَة", 
                trText: "Mesaj / Risale / Mektup.",
                ornek: { ar: "أَرْسَلْتُ رِسَالَةً نَصِّيَّةً", tr: "Bir kısa mesaj (risale/mektup) gönderdim." }
            } 
        },
        
        // --- 26 Numaralı Kalıp (فَعُول) ---
        26: { 
            base: { 
                emoji: "🌙", 
                arText: "رَسُول", 
                trText: "Elçi / Resul.",
                ornek: { ar: "مُحَمَّدٌ رَسُولُ اللهِ", tr: "Muhammed Allah'ın resulüdür (elçisidir). (Fetih Suresi, 29)" }
            } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - Mazi / İf'âl Babı) ---
        52: { base: { emoji: "📤", arText: "أَرْسَلَ", trText: "Gönderdi." } },
        
        // --- 53 Numaralı Kalıp (يُفْعِلُ - Muzari / İf'âl Babı) ---
        53: { base: { emoji: "📡", arText: "يُرْسِلُ", trText: "Gönderir / Gönderiyor." } },
        
        // --- 54 Numaralı Kalıp (أَفْعِلْ - Emir / İf'âl Babı) ---
        54: { base: { emoji: "❗", arText: "أَرْسِلْ", trText: "Gönder!" } },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { emoji: "📦", arText: "إِرْسَال", trText: "Gönderme / İrsal." },
            suggestsPlus: true, 
            "يَّة": { 
                emoji: "🧾", 
                arText: "إِرْسَالِيَّة", 
                trText: "İrsaliye / Gönderi.",
                ornek: { ar: "إِرْسَالِيَّةُ الْبَضَائِعِ جَاهِزَةٌ", tr: "Malların sevk irsaliyesi (teslimat belgesi) hazırdır." }
            } 
        },

        // --- 56 Numaralı Kalıp (مُفْعِل - İf'âl Babı İsm-i Faili) ---
        56: { base: { emoji: "📨", arText: "مُرْسِل", trText: "Gönderen (Mürsil)." } },

        // --- 57 Numaralı Kalıp (مُفْعَل - İf'âl Babı İsm-i Mef'ulü) ---
        57: { 
            base: { emoji: "👤", arText: "مُرْسَل", trText: "Gönderilen (Mürsel)." },
            suggestsPlus: true,
            "ينَ": { 
                emoji: "🕊️", 
                arText: "مُرْسَلِينَ", 
                trText: "Elçiler / Gönderilenler.",
                ornek: { ar: "وَسَلَامٌ عَلَى الْمُرْسَلِينَ", tr: "Gönderilen elçilere (peygamberlere) selam olsun. (Sâffât Suresi, 181)" }
            }
        }
    },

    // ==================================================================
    // 45. N-S-R (ن ص ر) KÖKÜ - Yardım Etmek / Zafer
    // ==================================================================
    "نصر": {
        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            base: { 
                emoji: "✌️", 
                arText: "نَصْر", 
                trText: "Yardım / Zafer.",
                ornek: { ar: "إِذَا جَاءَ نَصْرُ اللهِ وَالْفَتْحُ", tr: "Allah'ın yardımı (nasrı) ve fetih geldiğinde. (Nasr Suresi, 1)" }
            } 
        }, 
        
        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            base: { emoji: "🤝", arText: "نُصْر", trText: "Yardım (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🤝", 
                arText: "نُصْرَة", 
                trText: "Yardım etme / Nusret.",
                ornek: { ar: "نُصْرَةُ الْمَظْلُومِ وَاجِبَةٌ", tr: "Mazluma yardım etmek (nusret/destek) vaciptir." }
            } 
        }, 
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { base: { emoji: "🛡️", arText: "نَاصِر", trText: "Yardım eden / Nasır." } }, 
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "🏆", 
                arText: "مَنْصُور", 
                trText: "Muzaffer / Yardım edilmiş.",
                ornek: { ar: "عَادَ الْجَيْشُ مَنْصُورًا", tr: "Ordu muzaffer (mansur/yardım görmüş) olarak döndü." }
            } 
        } 
    },

    // ==================================================================
    // 46. H-M-L (ح م ل) KÖKÜ - Taşımak / Yüklenmek / Dayanmak
    // ==================================================================
    "حمل": {
        
         // --- 1, 4, 5 Numaralı Kalıplar (2. Bab) ---
        1: { 
            base: { 
                emoji: "🎒", 
                arText: "حَمَلَ", 
                trText: "Taşıdı / Yüklendi.",
                ornek: { ar: "حَمَلَ الرَّجُلُ الْأَمَانَةَ", tr: "Adam emaneti yüklendi (taşıdı)." }
            },
            cekimi: ["حَمَلَ", "حَمَلَا", "حَمَلُوا", "حَمَلَتْ", "حَمَلَتَا", "حَمَلْنَ", "حَمَلْتَ", "حَمَلْتُمَا", "حَمَلْتُمْ", "حَمَلْتِ", "حَمَلْتُمَا", "حَمَلْتُنَّ", "حَمَلْتُ", "حَمَلْنَا", "حَمَلْنَا"]
        },
        4: { 
            base: { 
                emoji: "🏋️", 
                arText: "يَحْمِلُ", 
                trText: "Taşır / Taşıyor.",
                ornek: { ar: "يَحْمِلُ الْحَقِيبَةَ الثَّقِيلَةَ", tr: "Ağır çantayı taşıyor." }
            },
            cekimi: ["يَحْمِلُ", "يَحْمِلَانِ", "يَحْمِلُونَ", "تَحْمِلُ", "تَحْمِلَانِ", "يَحْمِلْنَ", "تَحْمِلُ", "تَحْمِلَانِ", "تَحْمِلُونَ", "تَحْمِلِينَ", "تَحْمِلَانِ", "تَحْمِلْنَ", "أَحْمِلُ", "نَحْمِلُ", "نَحْمِلُ"]
        },
        5: { 
            base: { 
                emoji: "❗", 
                arText: "اِحْمِلْ", 
                trText: "Taşı / Yüklen!",
                ornek: { ar: "اِحْمِلْ هَذَا الصُّنْدُوقَ مِنْ فَضْلِكَ", tr: "Lütfen bu kutuyu taşı." }
            },
            cekimi: ["اِحْمِلْ", "اِحْمِلَا", "اِحْمِلُوا", "اِحْمِلِي", "اِحْمِلَا", "اِحْمِلْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            base: { emoji: "📣", arText: "حَمْل", trText: "Yük / Taşıma (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "📣", 
                arText: "حَمْلَة", 
                trText: "Kampanya / Hamle.",
                ornek: { ar: "حَمْلَةٌ تَعْلِيمِيَّةٌ جَدِيدَةٌ", tr: "Yeni bir eğitim kampanyası (hamlesi)." }
            } 
        }, 
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🤰", arText: "حَامِل", trText: "Taşıyan / Hamile." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🤰", 
                arText: "حَامِلَة", 
                trText: "Hamile kadın.",
                ornek: { ar: "الْمَرْأَةُ الْحَامِلَةُ", tr: "Hamile (gebe) kadın." }
            } 
        }, 
        
        // --- 34 Numaralı Kalıp (فَعَّال) ---
        34: { 
            base: { 
                emoji: "📦", 
                arText: "حَمَّال", 
                trText: "Hamal / Çokça taşıyan.",
                ornek: { ar: "حَمَّالُ الْمَحَطَّةِ يُسَاعِدُ الْمُسَافِرِينَ", tr: "İstasyon hamalı yolculara yardım ediyor." }
            } 
        }, 
        
        // --- 80 Numaralı Kalıp (اِفْتِعَال) ---
        80: { 
            base: { 
                emoji: "🎲", 
                arText: "اِحْتِمَال", 
                trText: "İhtimal / Olasılık.",
                ornek: { ar: "بِكُلِّ اِحْتِمَالٍ", tr: "Her ihtimale karşı." }
            } 
        }, 
        
        // --- 82 Numaralı Kalıp (مُفْتَعَل) ---
        82: { 
            base: { 
                emoji: "🔮", 
                arText: "مُحْتَمَل", 
                trText: "Muhtemel / Olası.",
                ornek: { ar: "أَمْرٌ مُحْتَمَلٌ جِدًّا", tr: "Çok muhtemel (olası) bir durum." }
            } 
        }, 
        
        // --- 91 Numaralı Kalıp (تَفَعُّل) ---
        91: { 
            base: { 
                emoji: "⏳", 
                arText: "تَحَمُّل", 
                trText: "Tahammül / Dayanma.",
                ornek: { ar: "الصَّبْرُ هُوَ تَحَمُّلُ الصِّعَابِ", tr: "Sabır, zorluklara tahammül etmektir (dayanmaktır)." }
            } 
        } 
    },

    // ==================================================================
    // 47. H-Q-Q (ح ق ق) KÖKÜ - Hak / Gerçek / Doğruluk
    // Tef'îl Babı (فَعَّلَ - يُفَعِّلُ) ve İlgili Kalıplar
    // ==================================================================
    "حقق": {
        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            base: { 
                emoji: "⚖️", 
                arText: "حَقّ", 
                trText: "Hak / Gerçek.",
                ornek: { ar: "الْحَقُّ يَعْلُو وَلَا يُعْلَى عَلَيْهِ", tr: "Hak yücedir ve ondan üstünü yoktur. (Atasözü)" }
            } 
        }, 
        
        // --- 25 Numaralı Kalıp (فُعُول) ---
        25: { 
            base: { 
                emoji: "📚", 
                arText: "حُقُوق", 
                trText: "Haklar / Hukuk.",
                ornek: { ar: "كُلِّيَّةُ الْحُقُوقِ", tr: "Hukuk fakültesi." }
            } 
        }, 
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "💎", arText: "حَقِيق", trText: "Gerçek (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "💎", 
                arText: "حَقِيقَة", 
                trText: "Hakikat / Gerçek.",
                ornek: { ar: "هَذِهِ هِيَ الْحَقِيقَةُ", tr: "İşte bu hakikattir (gerçektir)." }
            } 
        }, 

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { 
            base: { 
                emoji: "🎯", 
                arText: "حَقَّقَ", 
                trText: "Gerçekleştirdi.",
                ornek: { ar: "حَقَّقَ أَهْدَافَهُ", tr: "Hedeflerini gerçekleştirdi." }
            } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { 
            base: { 
                emoji: "📈", 
                arText: "يُحَقِّقُ", 
                trText: "Gerçekleştirir / Gerçekleştiriyor.",
                ornek: { ar: "يُحَقِّقُ النَّجَاحَ", tr: "Başarıyı gerçekleştiriyor / Elde ediyor." }
            } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { 
            base: { 
                emoji: "🚀", 
                arText: "حَقِّقْ", 
                trText: "Gerçekleştir!",
                ornek: { ar: "حَقِّقْ أَحْلَامَكَ", tr: "Hayallerini gerçekleştir!" }
            } 
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { 
                emoji: "🔍", 
                arText: "تَحْقِيق", 
                trText: "Soruşturma / Tahkikat.",
                ornek: { ar: "جَارٍ التَّحْقِيقُ فِي الْأَمْرِ", tr: "Olayla ilgili inceleme / soruşturma devam ediyor." }
            }, 
            suggestsPlus: true,
            "ات": { 
                emoji: "📂", 
                arText: "تَحْقِيقَات", 
                trText: "Tahkikat / Derinlemesine incelemeler." 
            }
        },
        
        // --- 62 Numaralı Kalıp (مُفَعِّل - Tef'îl Babı İsm-i Faili) ---
        62: { 
            base: { emoji: "🕵️‍♂️", arText: "مُحَقِّق", trText: "Soruşturmacı / Muhakkik." } 
        },
        
        // --- 63 Numaralı Kalıp (مُفَعَّل - Tef'îl Babı İsm-i Mef'ulü) ---
        63: { 
            base: { 
                emoji: "💯", 
                arText: "مُحَقَّق", 
                trText: "Muhakkak / Kesinleşmiş.",
                ornek: { ar: "أَمْرٌ مُحَقَّقٌ بِإِذْنِ اللهِ", tr: "Allah'ın izniyle muhakkak (kesinleşmiş/gerçekleşmiş) bir durum." }
            } 
        },
        
        // --- 103 Numaralı Kalıp (اِسْتِفْعَال) ---
        103: { 
            base: { emoji: "🏆", arText: "اِسْتِحْقَاق", trText: "Hak etme." } 
        }, 
        
        // --- 105 Numaralı Kalıp (مُسْتَفْعَل) ---
        105: { 
            base: { 
                emoji: "🎖️", 
                arText: "مُسْتَحَقّ", 
                trText: "Müstehak / Hak edilmiş.",
                ornek: { ar: "الْجَائِزَةُ مُسْتَحَقَّةٌ لَهُ", tr: "Ödül ona müstehaktır (hak edilmiştir)." }
            } 
        } 
    },

    // ==================================================================
    // 48. Kh-L-S (خ ل ص) KÖKÜ - Saflık / Samimiyet / İhlas
    // ==================================================================
    "خلص": {
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "💎", 
                arText: "خَالِص", 
                trText: "Halis / Saf / Katkısız.",
                ornek: { ar: "عَسَلٌ خَالِصٌ وَذَهَبٌ خَالِصٌ", tr: "Halis (saf/katkısız) bal ve halis altın." }
            } 
        }, 
        
        // --- 55 Numaralı Kalıp (إِفْعَال) ---
        55: { 
            base: { 
                emoji: "❤️", 
                arText: "إِخْلَاص", 
                trText: "İhlas / Samimiyet.",
                ornek: { ar: "الْإِخْلَاصُ فِي الْعَمَلِ أَسَاسُ الْقَبُولِ", tr: "İşte ihlas (samimiyet/içtenlik), kabulün temelidir." }
            } 
        }, 
        
        // --- 56 Numaralı Kalıp (مُفْعِل) ---
        56: { 
            base: { 
                emoji: "😇", 
                arText: "مُخْلِص", 
                trText: "Muhlis / Samimi.",
                ornek: { ar: "هُوَ صَدِيقٌ مُخْلِصٌ لَا يَتَغَيَّرُ", tr: "O, asla değişmeyen muhlis (samimi/sadık) bir dosttur." }
            } 
        } 
    },



    // ==================================================================
    // 50. R-Sh-D (ر ش د) KÖKÜ - Doğru Yolda Olmak / Olgunluk / Rehberlik
    // ==================================================================
    "رشد": {
        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            base: { 
                emoji: "🌱", 
                arText: "رُشْد", 
                trText: "Rüşt / Doğru yol.",
                ornek: { ar: "قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ", tr: "Doğru yol (rüşt), eğri yoldan kesinlikle ayrılmıştır. (Bakara Suresi, 256)" }
            } 
        }, 
        
        // --- 22 Numaralı Kalıp (فَعَال) ---
        22: { 
            base: { 
                emoji: "💎", 
                arText: "رَشَاد", 
                trText: "Reşat / Doğru yol.",
                ornek: { ar: "أَهْدِكُمْ سَبِيلَ الرَّشَادِ", tr: "Sizi doğru yola (reşat yoluna) ulaştırayım. (Mü'min Suresi, 29)" }
            } 
        }, 
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🕌", arText: "رَاشِد", trText: "Raşit / Doğru yolda olan." },
            suggestsPlus: true,
            "ونَ": { 
                emoji: "👥", 
                arText: "رَاشِدُونَ", 
                trText: "Raşitler / Doğru yolda olanlar.",
                ornek: { ar: "الْخُلَفَاءُ الرَّاشِدُونَ", tr: "Hulefâ-yi Râşidîn (Doğru yolda olan râşit halifeler)." }
            }
        }, 
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "🧠", 
                arText: "رَشِيد", 
                trText: "Reşit / Aklı başında.",
                ornek: { ar: "أَلَيْسَ مِنكُمْ رَجُلٌ رَّشِيدٌ", tr: "İçinizde aklı başında (reşit/doğru dürüst) bir adam yok mu? (Hûd Suresi, 78)" }
            } 
        }, 
        
        // --- 55 Numaralı Kalıp (إِفْعَال) ---
        55: { 
            base: { 
                emoji: "ℹ️", 
                arText: "إِرْشَاد", 
                trText: "İrşat / Yönlendirme.",
                ornek: { ar: "إِرْشَادُ النَّاسِ إِلَى الْخَيْرِ", tr: "İnsanları hayra yönlendirmek (irşat etmek)." }
            } 
        }, 
        
        // --- 56 Numaralı Kalıp (مُفْعِل) ---
        56: { 
            base: { 
                emoji: "🗺️", 
                arText: "مُرْشِد", 
                trText: "Mürşit / Yol gösterici.",
                ornek: { ar: "الْكِتَابُ خَيْرُ مُرْشِدٍ لِلْإِنْسَانِ", tr: "Kitap, insan için en iyi mürşittir (yol göstericidir/rehberdir)." }
            } 
        } 
    },


"أمن": {
        // --- 8, 9, 10 Numaralı Kalıplar (4. Bab - Sülasi Mücerred) ---
        8: { 
            base: { 
                emoji: "😌", 
                arText: "أَمِنَ", 
                trText: "Güvende oldu / Emin oldu.",
                ornek: { 
                    ar: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ، وَالْمُؤْمِنُ مَنْ أَمِنَهُ النَّاسُ عَلَى دِمَائِهِمْ وَأَمْوَالِهِمْ", 
                    tr: "Müslüman, diğer Müslümanların elinden ve dilinden güvende olduğu kimsedir. Mümin ise insanların canları ve malları hususunda kendisine güvendiği (emin olduğu) kimsedir. (Hadis-i Şerif)" 
                }
            },
            cekimi: ["أَمِنَ", "أَمِنَا", "أَمِنُوا", "أَمِنَتْ", "أَمِنَتَا", "أَمِنَّ", "أَمِنْتَ", "أَمِنْتُمَا", "أَمِنْتُمْ", "أَمِنْتِ", "أَمِنْتُمَا", "أَمِنْتُنَّ", "أَمِنْتُ", "أَمِنَّا", "أَمِنَّا"]
        },
        9: { 
            base: { emoji: "🛡️", arText: "يَأْمَنُ", trText: "Güvende olur / Emin oluyor." },
            cekimi: ["يَأْمَنُ", "يَأْمَنَانِ", "يَأْمَنُونَ", "تَأْمَنُ", "تَأْمَنَانِ", "يَأْمَنَّ", "تَأْمَنُ", "تَأْمَنَانِ", "تَأْمَنُونَ", "تَأْمَنِينَ", "تَأْمَنَانِ", "تَأْمَنَّ", "آمَنُ", "نَأْمَنُ", "نَأْمَنُ"]
        },
        10: { 
            base: { emoji: "❗", arText: "إِيمَنْ", trText: "Güvende ol / Emin ol!" },
            cekimi: [
                {
                    ar: "<div style='display:flex; justify-content:center; align-items:center; gap:15px; direction:rtl;'><span>اِأْمَنْ</span> <i class='fas fa-arrow-left' style='color:#e74c3c; font-size:18px;'></i> <span style='color:#27ae60;'>إِيمَنْ</span></div>",
                    tr: "Ses Olayı: Aslı (اِأْمَنْ) şeklindedir. İki hemze yan yana gelince, ikinci hemze birincinin harekesine (esreye) uyumlu olarak 'Ye' harfine dönüşür." 
                },
                "إِيمَنْ", "إِيمَنَا", "إِيمَنُوا", "إِيمَنِي", "إِيمَنَا", "إِيمَنَّ"
            ]
        },

        // --- İsimler ve Mastarlar ---
        19: { 
            base: { 
                emoji: "👮", 
                arText: "أَمْن", 
                trText: "Güvenlik.",
                ornek: [
                    {
                        ar: "الَّذِينَ آمَنُوا وَلَمْ يَلْبِسُوا إِيمَانَهُم بِظُلْمٍ أُولَٰئِكَ لَهُمُ الْأَمْنُ",
                        tr: "İman edip imanlarına zulmü bulaştırmayanlar; işte emniyet onlarındır. (En'âm Suresi, 82)"
                    },
                    {
                        ar: "يَعِيشُ النَّاسُ فِي بَلَدِنَا فِي أَمْنٍ وَسَلَامٍ",
                        tr: "İnsanlar ülkemizde güvenlik ve barış içinde yaşar."
                    }
                ]
            },
            suggestsPlus: true, 
            "يَّة": { 
                emoji: "📦", 
                arText: "أَمْنِيَّة", 
                trText: "Emniyet / Güvenlik (ile ilgili).",
                ornek: {
                    ar: "الْقُوَّاتُ الْأَمْنِيَّةُ تَسْهَرُ عَلَى رَاحَةِ الْمُوَاطِنِينَ",
                    tr: "Emniyet (güvenlik) güçleri vatandaşların rahatı için nöbet tutar."
                }
            } 
        },
        
        22: { 
            base: { emoji: "🛡️", arText: "أَمَان", trText: "Güvenlik / Aman." },
            ornek: { ar: "الْأَمَانُ وَالصِّحَّةُ نِعْمَتَانِ", tr: "Aman (güvenlik) ve sağlık iki büyük nimettir." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "📦", 
                arText: "أَمَانَة", 
                trText: "Emanet.",
                ornek: { ar: "الأَمَانَةُ تَجْلِبُ الرِّزْقَ", tr: "Emaneti korumak (güvenilir olmak) rızık getirir." } 
            } 
        },
        
        35: { 
            base: { emoji: "🤝", arText: "أَمِين", trText: "Emin / Güvenilir." },
            ornek: { ar: "إِنِّي لَكُمْ رَسُولٌ أَمِينٌ", tr: "Şüphesiz ben size gönderilmiş güvenilir (emin) bir elçiyim. (Şuarâ Suresi, 107)" } 
        },
        
        // --- 52, 53, 54 Numaralı Kalıplar (İf'al Babı) ---
        52: { 
            base: { emoji: "🤲", arText: "آمَنَ", trText: "İman etti." },
            cekimi: ["آمَنَ", "آمَنَا", "آمَنُوا", "آمَنَتْ", "آمَنَتَا", "آمَنَّ", "آمَنْتَ", "آمَنْتُمَا", "آمَنْتُمْ", "آمَنْتِ", "آمَنْتُمَا", "آمَنْتُنَّ", "آمَنْتُ", "آمَنَّا", "آمَنَّا"]
        },
        53: { 
            base: { emoji: "❤️", arText: "يُؤْمِنُ", trText: "İman eder / İnanıyor." },
            cekimi: ["يُؤْمِنُ", "يُؤْمِنَانِ", "يُؤْمِنُونَ", "تُؤْمِنُ", "تُؤْمِنَانِ", "يُؤْمِنَّ", "تُؤْمِنُ", "تُؤْمِنَانِ", "تُؤْمِنُونَ", "تُؤْمِنِينَ", "تُؤْمِنَانِ", "تُؤْمِنَّ", "أُؤْمِنُ", "نُؤْمِنُ", "نُؤْمِنُ"]
        },
        54: { 
            base: { emoji: "❗", arText: "آمِنْ", trText: "İman et!" },
            cekimi: ["آمِنْ", "آمِنَا", "آمِنُوا", "آمِنِي", "آمِنَا", "آمِنَّ"]
        },

        // --- 55: İman (İf'al Masdarı - Hemze Kuralı) ---
        55: { 
            base: { emoji: "❤️", arText: "إِيمَان", trText: "İman / İnanmak." },
            ornek: { ar: "الْإِيمَانُ مَا وَقَرَ فِي الْقَلْبِ", tr: "İman, kalbe yerleşen (inanılan) şeydir." },
            cekimi: [
                {
                    ar: "<div style='display:flex; justify-content:center; align-items:center; gap:15px; direction:rtl;'><span>إِأْمَان</span> <i class='fas fa-arrow-left' style='color:#e74c3c; font-size:18px;'></i> <span style='color:#27ae60;'>إِيمَان</span></div>", 
                    tr: "Ses Olayı: Kelimenin aslı (<span dir='rtl'>إِأْمَان</span>) şeklindedir. Kural gereği peş peşe gelen iki hemzeden ilki esreli, ikincisi sakin ise okuyuşu kolaylaştırmak için ikinci hemze 'Ye' (<span dir='rtl'>ي</span>) harfine dönüşür." 
                }
            ]
        },
        
        // --- 56: Mümin (İf'al İsm-i Faili - Hemze Kuralı) ---
        56: { 
            base: { emoji: "🕌", arText: "مُؤْمِن", trText: "Mümin / İnanan." },
            ornek: { ar: "الْمُؤْمِنُ مِرْآةُ الْمُؤْمِنِ", tr: "Mümin, müminin aynasıdır. (Hadis-i Şerif)" },
            cekimi: [
                {
                    ar: "<div style='display:flex; justify-content:center; align-items:center; gap:15px; direction:rtl;'><span> مُأْمِن </span> <i class='fas fa-arrow-left' style='color:#e74c3c; font-size:18px;'></i> <span style='color:#27ae60;'> مُؤْمِن </span></div>",
                    tr: "Yazım Kuralı: Hemze sakin (cezimli) ve kendinden önceki harf ötreli olduğu için, kural gereği hemze 'Vav' (<span dir='rtl'>و</span>) harfinin üzerine yazılır." 
                }
            ],
            suggestsPlus: true,
            "ونَ": {  
                emoji: "👥",
                arText: "مُؤْمِنُونَ", 
                trText: "Müminler (Çoğul).",
                ornek: { ar: "قَدْ أَفْلَحَ الْمُؤْمِنُونَ", tr: "Müminler gerçekten kurtuluşa ermiştir. (Mü'minûn Suresi, 1)" }
            }
        },
        
        61: { 
            base: { emoji: "📝", arText: "تَأْمِين", trText: "Sigorta / Güvence." },
            ornek: { ar: "شَرِكَةُ التَّأْمِينِ الصِّحِّيِّ", tr: "Sağlık sigortası (güvencesi/tamini) şirketi." }
        }
    },

// ==================================================================
    // 52. J-M-' (ج م ع) KÖKÜ - Toplamak / Bir Araya Getirmek / Topluluk
    // 3. Bab (فَعَلَ - يَفْعَلُ) ve İfti'âl Babı
    // ==================================================================
    "جمع": {
        // --- 1 Numaralı Kalıp (Mücerret 3. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🤲", 
                arText: "جَمَعَ", 
                trText: "Topladı / Bir araya getirdi.",
                ornek: { 
                    ar: "جَمَعَ مَالًا وَعَدَّدَهُ", 
                    tr: "Mal toplayıp onu tekrar tekrar sayan... (Hümeze Suresi, 2)" 
                }
            },
            cekimi: ["جَمَعَ", "جَمَعَا", "جَمَعُوا", "جَمَعَتْ", "جَمَعَتَا", "جَمَعْنَ", "جَمَعْتَ", "جَمَعْتُمَا", "جَمَعْتُمْ", "جَمَعْتِ", "جَمَعْتُمَا", "جَمَعْتُنَّ", "جَمَعْتُ", "جَمَعْنَا", "جَمَعْنَا"]
        },

        // --- 4 Numaralı Kalıp (Mücerret 3. Bab Muzari) ---
        6: { 
            base: { 
                emoji: "🧲", 
                arText: "يَجْمَعُ", 
                trText: "Toplar / Bir araya getirir.",
                ornek: { 
                    ar: "يَوْمَ يَجْمَعُكُمْ لِيَوْمِ الْجَمْعِ", 
                    tr: "Sizi toplanma gününde (kıyamette) bir araya getireceği gün... (Tegâbün Suresi, 9)" 
                }
            },
            cekimi: ["يَجْمَعُ", "يَجْمَعَانِ", "يَجْمَعُونَ", "تَجْمَعُ", "تَجْمَعَانِ", "يَجْمَعْنَ", "تَجْمَعُ", "تَجْمَعَانِ", "تَجْمَعُونَ", "تَجْمَعِينَ", "تَجْمَعَانِ", "تَجْمَعْنَ", "أَجْمَعُ", "نَجْمَعُ", "نَجْمَعُ"]
        },

        // --- 5 Numaralı Kalıp (Mücerret 3. Bab Emir) ---
        7: { 
            base: { 
                emoji: "❗", 
                arText: "اِجْمَعْ", 
                trText: "Topla / Bir araya getir!" 
            },
            cekimi: ["اِجْمَعْ", "اِجْمَعَا", "اِجْمَعُوا", "اِجْمَعِي", "اِجْمَعَا", "اِجْمَعْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "🔢", 
                arText: "جَمْع", 
                trText: "Toplama / Çoğul (Gramer).",
                ornek: {
                    ar: "💡 مَعْلُومَة ثَقَافِيَّة",
                    tr: "Kültürel Not: 'Cem' (جَمْع) kelimesi doğrudan bir araya gelme ve toplanma anlamındadır. Alevi-Bektaşi inancında insanların ibadet ve sohbet için bir araya geldikleri mekâna 'Cemevi' (Toplanma Evi) denmesi tam olarak bu kökten gelir."
                }
            },
            suggestsPlus: true,
            "يَّة": { 
                emoji: "🏢", 
                arText: "جَمْعِيَّة", 
                trText: "Cemiyet / Dernek.",
                ornek: { 
                    ar: "جَمْعِيَّةٌ خَيْرِيَّةٌ لِمُسَاعَدَةِ الْمُحْتَاجِينَ", 
                    tr: "İhtiyaç sahiplerine yardım için bir hayır cemiyeti (derneği)." 
                }
            } 
        },

        // --- 22 Numaralı Kalıp (فَعَال / +ة ile İsim) ---
        22: { 
            base: { arText: "جَمَاع", trText: "Topluluk (kök form)." },
            suggestsPlus: true,
            "ة": { 
                emoji: "👥", 
                arText: "جَمَاعَة", 
                trText: "Cemaat / Topluluk, grup.",
                ornek: [
                    { 
                        ar: "صَلَاةُ الْجَمَاعَةِ أَفْضَلُ مِنْ صَلَاةِ الْفَذِّ", 
                        tr: "Cemaatle kılınan namaz, tek başına kılınan namazdan daha faziletlidir. (Hadis-i Şerif)" 
                    },
                    {
                        ar: "يَدُ اللهِ مَعَ الْجَمَاعَةِ",
                        tr: "Allah'ın eli (yardımı ve rahmeti) cemaatle (toplulukla) beraberdir. (Hadis-i Şerif)"
                    }
                ]
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🕌", 
                arText: "جَامِع", 
                trText: "Cami / Toplayan, bir araya getiren.",
                ornek: { 
                    ar: "أَحَبُّ الْبِلَادِ إِلَى اللهِ مَسَاجِدُهَا", 
                    tr: "Allah'a beldelerin en sevimlisi mescitlerdir (camilerdir). (Hadis-i Şerif)" 
                }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🎓", 
                arText: "جَامِعَة", 
                trText: "Üniversite.",
                ornek: { 
                    ar: "الْحَيَاةُ الْجَامِعِيَّةُ مَلِيئَةٌ بِالتَّجَارِبِ", 
                    tr: "Üniversite hayatı tecrübelerle doludur." 
                }
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "📦", 
                arText: "مَجْمُوع", 
                trText: "Mecmu / Toplanmış olan, toplam." 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "📰", 
                arText: "مَجْمُوعَة", 
                trText: "Mecmua / Grup, küme, koleksiyon, dergi.",
                ornek: [
                    { 
                        ar: "مَجْمُوعَةٌ جَدِيدَةٌ مِنَ الطُّلَّابِ", 
                        tr: "Yeni bir öğrenci grubu (kümesi)." 
                    },
                    {
                        ar: "💡 مَعْلُومَة ثَقَافِيَّة وَلُغَوِيَّة",
                        tr: "Kültürel Not: Türkçede eskiden 'Dergi' anlamında kullanılan 'Mecmua' kelimesi tam olarak budur. Çeşitli makale ve yazıların 'toplandığı, derlendiği' basılı eser (koleksiyon) olduğu için bu kökten türemiştir. (Modern Arapçada dergi için genellikle 'مَجَلَّة' [Mecelle] kullanılır)."
                    }
                ]
            } 
        },

        // --- 42 Numaralı Kalıp (فُعُل + ة) ---
        42: { 
            base: { arText: "جُمُع" },
            suggestsPlus: true,
            "ة": { 
                emoji: "🕋", 
                arText: "جُمُعَة", 
                trText: "Cuma / Toplanma günü.",
                ornek: { 
                    ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِنْ يَوْمِ الْجُمُعَةِ...", 
                    tr: "Ey iman edenler! Cuma günü namaz için çağrı yapıldığında... (Cuma Suresi, 9)" 
                }
            } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi) ---
        77: { 
            base: { 
                emoji: "🤝", 
                arText: "اِجْتَمَعَ", 
                trText: "Toplandı / Bir araya geldi." 
            },
            cekimi: ["اِجْتَمَعَ", "اِجْتَمَعَا", "اِجْتَمَعُوا", "اِجْتَمَعَتْ", "اِجْتَمَعَتَا", "اِجْتَمَعْنَ", "اِجْتَمَعْتَ", "اِجْتَمَعْتُمَا", "اِجْتَمَعْتُمْ", "اِجْتَمَعْتِ", "اِجْتَمَعْتُمَا", "اِجْتَمَعْتُنَّ", "اِجْتَمَعْتُ", "اِجْتَمَعْنَا", "اِجْتَمَعْنَا"]
        },

        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - İfti'âl Babı Muzari) ---
        78: { 
            base: { 
                emoji: "🔄", 
                arText: "يَجْتَمِعُ", 
                trText: "Toplanır / Bir araya gelir." 
            },
            cekimi: ["يَجْتَمِعُ", "يَجْتَمِعَانِ", "يَجْتَمِعُونَ", "تَجْتَمِعُ", "تَجْتَمِعَانِ", "يَجْتَمِعْنَ", "تَجْتَمِعُ", "تَجْتَمِعَانِ", "تَجْتَمِعُونَ", "تَجْتَمِعِينَ", "تَجْتَمِعَانِ", "تَجْتَمِعْنَ", "أَجْتَمِعُ", "نَجْتَمِعُ", "نَجْتَمِعُ"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "💼", 
                arText: "اِجْتِمَاع", 
                trText: "İçtima / Toplantı, bir araya gelme.",
                ornek: [
                    { 
                        ar: "لَدَيْنَا اِجْتِمَاعٌ مُهِمٌّ الْيَوْمَ", 
                        tr: "Bugün önemli bir toplantımız (içtimamız) var." 
                    },
                    {
                        ar: "💡 مَعْلُومَة ثَقَافِيَّة (فِي الْعَسْكَرِيَّةِ)",
                        tr: "Kültürel Not: Türkçede 'İçtima' kelimesi özellikle askerlik jargonunda çok yaygındır. Askerlerin sayım, yoklama ve görev dağılımı için sabah ve akşam saatlerinde tören alanında bir araya toplanmasına 'İçtima' (Toplanma) denir."
                    }
                ]
            } 
        }
    },

    // 53. H-M-D (ح م د) KÖKÜ - Övmek / Şükretmek
    "حمد": {
        19: { base: { emoji: "🤲", arText: "الْحَمْدُ لِلهِ رَبِّ الْعَالَمِينَ", trText: "Hamd (övgü ve şükür), alemlerin Rabbi olan Allah'a mahsustur. (Fâtiha Suresi)" }, suggestsPlus: true, "يَّة": { emoji: "🌸", arText: "حَمْدِيَّة", trText: "Hamdiye (İsim)." } }, // حَمْد + يَّة = حَمْدِيَّة
        30: { base: { emoji: "🌟", arText: "وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ", trText: "Benden sonra gelecek 'Ahmet' (çok övülen) adındaki bir peygamberi müjdeleyici olarak... (Saf Suresi)" } }, // أَحْمَد
        35: { base: { emoji: "💎", arText: "إِنَّ الله هُوَ الْغَنِيُّ الْحَمِيدُ", trText: "Şüphesiz Allah, hiçbir şeye muhtaç değildir, her türlü övgüye layıktır (Hamit'tir). (Lokmân Suresi)" } }, // حَمِيد
        36: { base: { emoji: "🏅", arText: "عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَحْمُودًا", trText: "Umulur ki Rabbin seni Makam-ı Mahmud'a (övülmüş bir makama) ulaştırır. (İsrâ Suresi)" } }, // مَحْمُود
        63: { base: { emoji: "🌹", arText: "مُحَمَّدٌ رَّسُولُ اللهِ", trText: "Muhammed (s.a.v), Allah'ın elçisidir. (Fetih Suresi)" } } // مُحَمَّد
    },

    // 54. Sh-H-R (ش ه ر) KÖKÜ - Belirmek / İlan Etmek / Ay / Şöhret
    "شهر": {
        19: { base: { emoji: "📅", arText: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ", trText: "Ramazan ayı, içinde Kur'an'ın indirildiği aydır. (Bakara Suresi)" } }, // شَهْر
        21: { suggestsPlus: true, "ة": { emoji: "🌟", arText: "النَّجَاحُ يَجْلِبُ الشُّهْرَةَ عَبْرَ الْعَمَلِ", trText: "Başarı, çalışmayla birlikte şöhreti (tanınmışlığı) getirir." } }, // شُهْر + ة = شُهْرَة
        36: { base: { emoji: "🎤", arText: "هُوَ كَاتِبٌ مَشْهُورٌ فِي الْعَالَمِ", trText: "O, dünyada meşhur (tanınmış) bir yazardır." } }, // مَشْهُور
        61: { base: { emoji: "📢", arText: "تَشْهِيرُ الْأَخْبَارِ الْكَاذِبَةِ مَمْنُوعٌ", trText: "Yalan haberlerin teşhir edilmesi (ifşa edilmesi/yayılması) yasaktır." } } // تَشْهِير
    },

    // ==================================================================
    // Ş-K-R (ش ك ر) KÖKÜ - Şükretmek / Teşekkür Etmek
    // 1. Bab (فَعَلَ - يَفْعُلُ)
    // ==================================================================
    "شكر": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🗣️", 
                arText: "شَكَرَ", 
                trText: "Şükretti / Teşekkür etti." 
            },
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        // (Sistemindeki يَفْعُلُ kalıp numaran farklıysa güncelleyebilirsin)
        2: { 
            base: { 
                emoji: "🤲", 
                arText: "يَشْكُرُ", 
                trText: "Şükreder / Teşekkür ediyor.",
                ornek: { 
                    ar: "وَمَنْ يَشْكُرْ فَإِنَّمَا يَشْكُرُ لِنَفْسِهِ", 
                    tr: "Kim şükrederse, ancak kendi lehine şükretmiş olur. (Lokman Suresi, 12)" 
                }
            },
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { 
                emoji: "❗", 
                arText: "اُشْكُرْ", 
                trText: "Şükret / Teşekkür et!",
                ornek: { 
                    ar: "وَاشْكُرُوا لِلهِ إِنْ كُنْتُمْ إِيَّاهُ تَعْبُدُونَ", 
                    tr: "Eğer yalnız O'na kulluk ediyorsanız, Allah'a şükredin. (Bakara Suresi, 172)" 
                }
            },
            cekimi: ["اُشْكُرْ", "اُشْكُرَا", "اُشْكُرُوا", "اُشْكُرِي", "اُشْكُرَا", "اُشْكُرْنَ"]
        },

        

        // --- 21 Numaralı Kalıp (فُعْل - Masdar ve İsim Ekleri) ---
        21: { 
            base: { 
                emoji: "🙏", 
                arText: "شُكْر", 
                trText: "Şükür / Minnet, teşekkür etme.",
              
            }, 
            suggestsPlus: true, 
            "ًا": { 
                emoji: "✨", 
                arText: "شُكْرًا", 
                trText: "Şükran / Teşekkür ederim (Teşekkürler).",
                ornek: { ar: "شُكْرًا جَزِيلًا", tr: "Çok teşekkür ederim." }
            },
            "يّ": { 
                emoji: "👨", 
                arText: "شُكْرِيّ", 
                trText: "Şükrü (Erkek ismi / Şükre ait)." 
            }, 
            "يَّة": { 
                emoji: "👩", 
                arText: "شُكْرِيَّة", 
                trText: "Şükriye (Kadın ismi)." 
            } 
        },

        // --- 26 Numaralı Kalıp (فَعُول - Mübalağalı İsm-i Fâil / Sıfat-ı Müşebbehe) ---
        26: { 
            base: { 
                emoji: "🤲", 
                arText: "شَكُور", 
                trText: "Şekûr / Çok şükreden, iyiliğe bolca karşılık veren.",
                ornek: [
                    { 
                        ar: "إِنَّ رَبَّنَا لَغَفُورٌ شَكُورٌ", 
                        tr: "Şüphesiz Rabbimiz çok bağışlayandır (Ğafûr'dur), şükrün karşılığını bol bol verendir (Şekûr'dur). (Fâtır Suresi, 34)" 
                    },
                    { 
                        ar: "💡 مَعْلُومَة صَرْفِيَّة", 
                        tr: "Sarf Notu: 'Fa'ûl' (فَعُول) kalıbı, geçişli fiillerden (شَكَرَ gibi) türediğinde eylemin çokluğunu bildiren 'Mübalağalı İsm-i Fâil' olur. Geçişsiz (lâzım) fiillerden türediğinde ise kişinin kalıcı tabiatını bildiren 'Sıfat-ı Müşebbehe' (Örn: وَقُور - ağırbaşlı) olarak görev yapar." 
                    }
                ]
            } 
        },

       // --- 27 Numaralı Kalıp (فُعْلَان - Masdar) ---
        27: { 
            base: { 
                emoji: "🌹", 
                arText: "شُكْرَان", 
                trText: "Şükran / Minnettarlık.",
                ornek: { ar: "شُكْرَانًا جَزِيلًا عَلَى حُسْنِ صَنِيعِكُمْ", tr: "Güzel davranışınız için çok şükran (teşekkür) ederim." }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "😇", 
                arText: "شَاكِر", 
                trText: "Şâkir / Şükreden, minnettar eden.",
                ornek: { ar: "أَنَا شَاكِرٌ لَكَ عَلَى مَعْرُوفِكَ", tr: "İyiliğin için sana şâkirim (teşekkür ederim/minnettarım)." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🌸", 
                arText: "شَاكِرَة", 
                trText: "Şükreden (Kadın formu)." 
            }
        },

        // --- 91 Numaralı Kalıp (تَفَعُّل - Tefe'ul Babı Masdarı) ---
        91: { 
            base: { 
                emoji: "🤝", 
                arText: "تَشَكُّر", 
                trText: "Teşekkür / Şükretme eylemi, minnet duyma."
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "💐", 
                arText: "تَشَكُّرَات", 
                trText: "Teşekkürler (Çoğul formu).",
                ornek: { ar: "تَشَكُّرَاتِي الْقَلْبِيَّةُ لَكُمْ جَمِيعًا", tr: "Hepinize kalbi teşekkürlerimi sunarım." }
            }
        },

        // --- 92 Numaralı Kalıp (مُتَفَعِّل - Tefe'ul Babı İsm-i Fâili) ---
        92: { 
            base: { 
                emoji: "👔", 
                arText: "مُتَشَكِّر", 
                trText: "Müteşekkir / Teşekkür eden, minnettar.",
                ornek: { ar: "أَنَا مُتَشَكِّرٌ جِدًّا لِمُسَاعَدَتِكُمْ", tr: "Yardımınız için çok müteşekkirim (minnettarım)." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "👗", 
                arText: "مُتَشَكِّرَة", 
                trText: "Müteşekkir (Kadın formu)." 
            }
        }
},

    // 56. F-K-R (ف ك ر) KÖKÜ - Düşünmek / Fikir
    "فكر": {
        20: { base: { emoji: "🧠", arText: "الْفِكْرُ حُرٌّ وَلَا يُقَيَّدُ", trText: "Fikir özgürdür ve kısıtlanamaz." }, suggestsPlus: true, "يّ": { emoji: "💡", arText: "حُقُوقُ الْمِلْكِيَّةِ الْفِكْرِيَّةِ", trText: "Fikri mülkiyet hakları." }, "ة": { emoji: "💭", arText: "هَذِهِ فِكْرَةٌ مُمْتَازَةٌ جِدًّا", trText: "Bu, çok mükemmel bir fikir." } }, // فِكْر + ekler
        91: { base: { emoji: "🤔", arText: "تَفَكُّرُ سَاعَةٍ خَيْرٌ مِنْ عِبَادَةِ سَنَةٍ", trText: "Bir saat tefekkür (derin düşünme), bir yıl ibadetten hayırlıdır." } }, // تَفَكُّر
        92: { base: { emoji: "🧔", arText: "هُوَ كَاتِبٌ وَمُتَفَكِّرٌ كَبِيرٌ", trText: "O, büyük bir yazar ve mütefekkirdir (düşünürdür)." } } // مُتَفَكِّر
    },

    // 57. W-K-L (و ك ل) KÖKÜ - Güvenmek / Vekil Tayin Etmek / Dayanmak
    "وكل": {
        22: { suggestsPlus: true, "ة": { emoji: "📜", arText: "أَعْطَاهُ وَكَالَةً عَامَّةً", trText: "Ona genel vekalet (temsil yetkisi) verdi." } }, // وَكَال + ة = وَكَالَة
        35: { base: { emoji: "🛡️", arText: "حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ", trText: "Allah bize yeter, O ne güzel vekildir. (Âl-i İmrân Suresi)" } }, // وَكِيل
        62: { base: { emoji: "👤", arText: "الْمُحَامِي يُدَافِعُ عَنْ مُوَكِّلِهِ", trText: "Avukat müvekkilini (kendisini vekil tayin edeni) savunur." } }, // مُوَكِّل
        91: { base: { emoji: "🤲", arText: "وَمَنْ يَتَوَكَّلْ عَلَى اللهِ فَهُوَ حَسْبُهُ", trText: "Kim Allah'a tevekkül ederse, O ona yeter. (Talak Suresi)" } } // تَوَكُّل
    },

    // 58. Q-D-M (ق د م) KÖKÜ - Öne Geçmek / Eski / Sunmak / Adım
    "قدم": {
        17: { suggestsPlus: true, "ة": { emoji: "🪜", arText: "قَدَمَة", trText: "Adım / Basamak." } }, // قَدَم + ة = قَدَمَة
        35: { base: { emoji: "🏛️", arText: "صَدَاقَتُنَا قَدِيمَةٌ وَقَوِيَّةٌ", trText: "Dostluğumuz kadim (eski) ve güçlüdür." } }, // قَدِيم
        61: { base: { emoji: "🎁", arText: "تَقْدِيمُ الْهَدَايَا يَزِيدُ الْمَحَبَّةَ", trText: "Hediye takdim etmek (sunmak) sevgiyi artırır." } }, // تَقْدِيم
        62: { suggestsPlus: true, "ة": { emoji: "📖", arText: "مُقَدِّمَةُ ابْنِ خَلْدُونَ أَثَرٌ تَارِيخِيٌّ عَظِيمٌ", trText: "İbn Haldun'un Mukaddime'si (önsözü/giriş eseri) harika bir tarihi eserdir." } } // مُقَدِّم + ة = مُقَدِّمَة
    },

    // 59. K-B-R (ك ب ر) KÖKÜ - Büyümek / Büyük Olmak / Yücelik / Kibir
    "كبر": {
        20: { base: { emoji: "🦚", arText: "الْكِبْرُ مَذْمُومٌ فِي الْأَخْلَاقِ", trText: "Kibir, ahlakta kınanmış (kötü) bir davranıştır." } }, // كِبْر
        23: { base: { emoji: "🧓", arText: "اِحْتِرَامُ كِبَارِ السِّنِّ وَاجِبٌ", trText: "Yaşça büyük olanlara (büyüklere) saygı göstermek vaciptir." } }, // كِبَار
        50: { base: { emoji: "🌌", arText: "اللهُ أَكْبَرُ مِنْ كُلِّ شَيْءٍ", trText: "Allah her şeyden en büyüktür (ekberdir)." } }, // أَكْبَر
        51: { base: { emoji: "🌟", arText: "الْقِيَامَةُ هِيَ الدَّاهِيَةُ الْكُبْرَى", trText: "Kıyamet en büyük (kübra) hadisedir." } }, // كُبْرَى
        61: { base: { emoji: "☝️", arText: "نُرَدِّدُ التَّكْبِيرَ فِي أَيَّامِ الْعِيدِ", trText: "Bayram günlerinde tekbir getiririz." } } // تَكْبِير
    },

    // 60. '-D-L (ع د ل) KÖKÜ - Adalet / Eşitlik / Düzenleme
    "عدل": {
        19: { suggestsPlus: true, "يَّة": { emoji: "🏛️", arText: "ذَهَبَ الْمُحَامِي إِلَى الْعَدْلِيَّةِ", trText: "Avukat adliyeye (sarayına) gitti." } }, // عَدْل + يَّة = عَدْلِيَّة
        22: { suggestsPlus: true, "ة": { emoji: "⚖️", arText: "الْعَدَالَةُ أَسَاسُ الْمُلْكِ", trText: "Adalet mülkün (devletin) temelidir." } }, // عَدَال + ة = عَدَالَة
        33: { base: { emoji: "👨‍⚖️", arText: "هُوَ قَاضٍ عَادِلٌ يَحْكُمُ بِالْحَقِّ", trText: "O, hakla hükmeden adil bir kadıdır (hakimdir)." } }, // عَادِل
        61: { suggestsPlus: true, "ات": { emoji: "🔧", arText: "إِجْرَاءُ تَعْدِيلَاتٍ جَدِيدَةٍ فِي الْقَانُونِ", trText: "Kanunda yeni tadilatlar (düzenlemeler/değişiklikler) yapmak." } }, // تَعْدِيل + ات = تَعْدِيلَات
        69: { base: { emoji: "🟰", arText: "هَذَا الدَّوَاءُ مُعَادِلٌ لِلْآخَرِ", trText: "Bu ilaç diğeriyle muadildir (eşdeğerdir)." } }, // مُعَادِل
        80: { base: { emoji: "🍃", arText: "الِاعْتِدَالُ فِي كُلِّ شَيْءٍ خَيْرٌ", trText: "Her şeyde itidal (ölçülülük/dengeli olmak) hayırlıdır." } } // اِعْتِدَال
    },

// ==================================================================
    // F-A-L (ف ع ل) KÖKÜ - Yapmak / Eylemek / Etkinleştirmek / Uydurmak
    // 3. Bab (فَعَلَ - يَفْعَلُ), Tef'îl ve İfti'âl Babları
    // Not: Tüm kalıpların temel şablonudur ancak kendi başına da aktif kullanılır.
    // ==================================================================
    "فعل": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 3. Bab) ---
        1: { 
            base: { emoji: "🛠️", arText: "فَعَلَ", trText: "Yaptı / Eyledi." } 
        },
        
        // --- 4 Numaralı Kalıp (يَفْعَلُ - Muzari / 3. Bab) ---
        6: { 
            base: { emoji: "⚙️", arText: "يَفْعَلُ", trText: "Yapar / Ediyor." } 
        },
        
        // --- 5 Numaralı Kalıp (اِفْعَلْ - Emir / 3. Bab) ---
        7: { 
            base: { emoji: "❗", arText: "اِفْعَلْ", trText: "Yap / Eyle!" } 
        },

        20: { 
            
            base: { emoji: "🎬", arText: "رَدُّ فِعْلٍ", trText: "Tepki / Reaksiyon (Geri eylem)." },
 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fail) ---
        33: { 
            base: { emoji: "👤", arText: "فَاعِلُ خَيْرٍ", trText: "İyilik yapan (hayırsever) / İşin öznesi." } 
        },
        
        // --- 34 Numaralı Kalıp (فَعَّال - Mübalağalı İsm-i Fail) ---
        34: { 
            base: { emoji: "⚡", arText: "دَوْرٌ فَعَّالٌ", trText: "Çok etkili (aktif) rol." } 
        },
        
       

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { 
            base: { emoji: "✅", arText: "فَعَّلَ", trText: "Aktifleştirdi / Etkin hale getirdi." } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { 
            base: { emoji: "🔄", arText: "يُفَعِّلُ", trText: "Aktifleştirir / Etkinleştiriyor." } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { 
            base: { emoji: "▶️", arText: "فَعِّلْ", trText: "Aktifleştir / Etkinleştir!" } 
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { emoji: "📲", arText: "تَفْعِيلُ الْحِسَابِ", trText: "Hesabın aktifleştirilmesi (onaylanması)." } 
        },
        
        // --- 63 Numaralı Kalıp (مُفَعَّل - Tef'îl Babı İsm-i Mef'ulü) ---
        63: { 
            suggestsPlus: true, 
            "ات": { emoji: "🟢", arText: "حِسَابٌ مُفَعَّلٌ", trText: "Aktifleştirilmiş (onaylı/etkin) hesap." } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - Mazi / İfti'âl Babı) ---
        77: { 
            base: { emoji: "🎭", arText: "اِفْتَعَلَ", trText: "Uydurdu / Suni olarak çıkardı (özellikle kriz/sorun)." } 
        },
        
        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - Muzari / İfti'âl Babı) ---
        78: { 
            base: { emoji: "🤥", arText: "يَفْتَعِلُ", trText: "Uydurur / Bahane veya suni kriz üretir." } 
        },
        
        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - Emir / İfti'âl Babı) ---
        79: { 
            base: { emoji: "❗", arText: "اِفْتَعِلْ", trText: "Uydur / Bahane üret!" } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { emoji: "🌪️", arText: "اِفْتِعَالُ الْأَزَمَات", trText: "Krizler uydurma (suni kriz çıkarma işi)." } 
        },
        
        // --- 81 Numaralı Kalıp (مُفْتَعَل - İfti'âl Babı İsm-i Mef'ulü) ---
        81: { 
            base: { emoji: "🚧", arText: "مُشْكِلَةٌ مُفْتَعَلَةٌ", trText: "Suni (yapay / kasıtlı çıkarılmış) sorun." } 
        }
    },


// ==================================================================
    // DÜZENSİZ FİİLLER (Tek Veri Kaynağı: Emojiler + Çekim Tabloları)
    // ==================================================================
    "شدد": {
        1: { 
            base: { emoji: "🪢", arText: "شَدَّ", trText: "Sıktı / Bağladı." },
            cekimi: ["شَدَّ", "شَدَّا", "شَدُّوا", "شَدَّتْ", "شَدَّتَا", "شَدَدْنَ", "شَدَدْتَ", "شَدَدْتُمَا", "شَدَدْتُمْ", "شَدَدْتِ", "شَدَدْتُمَا", "شَدَدْتُنَّ", "شَدَدْتُ", "شَدَدْنَا", "شَدَدْنَا"]
        },
        2: { 
            base: { emoji: "🔗", arText: "يَشُدُّ", trText: "Sıkar / Bağlıyor." },
            cekimi: ["يَشُدُّ", "يَشُدَّانِ", "يَشُدُّونَ", "تَشُدُّ", "تَشُدَّانِ", "يَشْدُدْنَ", "تَشُدُّ", "تَشُدَّانِ", "تَشُدُّونَ", "تَشُدِّينَ", "تَشُدَّانِ", "تَشْدُدْنَ", "أَشُدُّ", "نَشُدُّ", "نَشُدُّ"]
        },
        3: { 
            base: { emoji: "❗", arText: "شُدَّ", trText: "Sık / Bağla!" },
            cekimi: ["شُدَّ", "شُدَّا", "شُدُّوا", "شُدِّي", "شُدَّا", "اُشْدُدْنَ"]
        },
        20: { 
            suggestsPlus: true, 
            "ة": { 
                emoji: "⚡️", 
                arText: "شِدَّة", 
                trText: "Şiddet" 
            },
            cekimi: ["شِدّ"]
        },
        35: { 
            base: { emoji: "⚠️", arText: "شَدِيد", trText: "Çetin / Şiddetli." },
            ornek: { ar: "وَاللهُ شَدِيدُ الْعِقَابِ", tr: "Allah, cezası çetin olandır. (Bakara Suresi, 196)" }
        }
    },
        
    "أكل": {
        1: { 
            base: { emoji: "🍽️", arText: "أَكَلَ", trText: "Yedi." },
            cekimi: ["أَكَلَ", "أَكَلَا", "أَكَلُوا", "أَكَلَتْ", "أَكَلَتَا", "أَكَلْنَ", "أَكَلْتَ", "أَكَلْتُمَا", "أَكَلْتُمْ", "أَكَلْتِ", "أَكَلْتُمَا", "أَكَلْتُنَّ", "أَكَلْتُ", "أَكَلْنَا", "أَكَلْنَا"]
        },
        2: { 
            base: { emoji: "😋", arText: "يَأْكُلُ", trText: "Yer / Yiyor." },
            cekimi: ["يَأْكُلُ", "يَأْكُلَانِ", "يَأْكُلُونَ", "تَأْكُلُ", "تَأْكُلَانِ", "يَأْكُلْنَ", "تَأْكُلُ", "تَأْكُلَانِ", "تَأْكُلُونَ", "تَأْكُلِينَ", "تَأْكُلَانِ", "تَأْكُلْنَ", "آكُلُ", "نَأْكُلُ", "نَأْكُلُ"]
        },
        3: { 
            base: { emoji: "❗", arText: "كُلْ", trText: "Ye!" },
            ornek: {
                ar: "وَكُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا",
                tr: "Yiyin, için fakat israf etmeyin. (A'râf Suresi, 31)"
            },
            cekimi: ["كُلْ", "كُلَا", "كُلُوا", "كُلِي", "كُلَا", "كُلْنَ"]
        },
        19: { 
            base: { emoji: "🍎", arText: "أَكْل", trText: "Yemek (Masdar)." },
        },
        33: { 
            base: { emoji: "🙋", arText: "آكِل", trText: "Yiyen, Obur (İsm-i Fail)." },
        },
        36: { 
            suggestsPlus: true,
            "ات": { 
                emoji: "💬", 
                arText: "مَأْكُولَات", 
                trText: "Yiyecekler" 
            }
        }
    },
    
    "سأل": {
        1: { 
            base: { emoji: "❓", arText: "سَأَلَ", trText: "Sordu / İstedi." },
            cekimi: ["سَأَلَ", "سَأَلَا", "سَأَلُوا", "سَأَلَتْ", "سَأَلَتَا", "سَأَلْنَ", "سَأَلْتَ", "سَأَلْتُمَا", "سَأَلْتُمْ", "سَأَلْتِ", "سَأَلْتُمَا", "سَأَلْتُنَّ", "سَأَلْتُ", "سَأَلْنَا", "سَأَلْنَا"]
        },
        6: { 
            base: { emoji: "🗣️", arText: "يَسْأَلُ", trText: "Sorar / Soruyor." },
            cekimi: ["يَسْأَلُ", "يَسْأَلَانِ", "يَسْأَلُونَ", "تَسْأَلُ", "تَسْأَلَانِ", "يَسْأَلْنَ", "تَسْأَلُ", "تَسْأَلَانِ", "تَسْأَلُونَ", "تَسْأَلِينَ", "تَسْأَلَانِ", "تَسْأَلْنَ", "أَسْأَلُ", "نَسْأَلُ", "نَسْأَلُ"]
        },
        7: { 
            base: { emoji: "❗", arText: "اِسْأَلْ", trText: "Sor / İste!" },
            cekimi: ["اِسْأَلْ", "اِسْأَلَا", "اِسْأَلُوا", "اِسْأَلِي", "اِسْأَلَا", "اِسْأَلْنَ"]
        },
        24: { 
            base: { emoji: "❓", arText: "سُؤَال", trText: "Soru / Sual." },
        },
        33: { 
            base: { emoji: "🙋‍♂️", arText: "سَائِل", trText: "Soran / İsteyen (Dilenci)." },
            ornek: {
                ar: "وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ",
                tr: "İsteyeni (dilenciyi) azarlama. (Duhâ Suresi, 10)"
            }
        },
        36: { 
            base: { emoji: "👤", arText: "مَسْؤُول", trText: "Sorumlu / Mesul (İsm-i Meful)." },
        },
        38: { 
            suggestsPlus: true,
            "ة": { 
                emoji: "📄", 
                arText: "مَسْأَلَة", 
                trText: "Mesele / Sorun." 
            }
        }
    },

    "قول": {
        1: { 
            base: { emoji: "🗣️", arText: "قَالَ", trText: "Dedi / Söyledi." },
        },
        2: { 
            base: { emoji: "💬", arText: "يَقُولُ", trText: "Der / Söylüyor." },
        },
        3: { 
            base: { emoji: "❗", trText: "De / Söyle!" },
        }
    },

    "بيع": {
        1: { 
            base: { emoji: "🤝", arText: "بَاعَ", trText: "Sattı." },
        },
        4: { 
            base: { emoji: "💰", arText: "يَبِيعُ", trText: "Satar / Satıyor." },
        },
        5: { 
            base: { emoji: "❗", arText: "بِعْ", trText: "Sat!" },
        },
        19: { 
            base: { emoji: "📜", arText: "بَيْع", trText: "Satış / Satmak (Masdar)." },
        },
        33: { 
            base: { emoji: "🛒", arText: "بَائِع", trText: "Satan / Satıcı / Bayi (İsm-i Fail)." },
        },
        36: { 
            base: { emoji: "📦", arText: "مَبِيع", trText: "Satılan (İsm-i Meful)." },
        }
    },

    "دعو": {
        1: { 
            base: { emoji: "🤲", arText: "دَعَا", trText: "Davet etti / Dua etti." },
            cekimi: ["دَعَا", "دَعَوَا", "دَعَوْا", "دَعَتْ", "دَعَتَا", "دَعَوْنَ", "دَعَوْتَ", "دَعَوْتُمَا", "دَعَوْتُمْ", "دَعَوْتِ", "دَعَوْتُمَا", "دَعَوْتُنَّ", "دَعَوْتُ", "دَعَوْنَا", "دَعَوْنَا"]
        },
        2: { 
            base: { emoji: "🙏", arText: "يَدْعُو", trText: "Davet eder / Dua ediyor." },
            cekimi: ["يَدْعُو", "يَدْعُوَانِ", "يَدْعُونَ", "تَدْعُو", "تَدْعُوَانِ", "يَدْعُونَ", "تَدْعُو", "تَدْعُوَانِ", "تَدْعُونَ", "تَدْعِينَ", "تَدْعُوَانِ", "تَدْعُونَ", "أَدْعُو", "نَدْعُو", "نَدْعُو"]
        },
        3: { 
            base: { emoji: "❗", arText: "اُدْعُ", trText: "Davet et / Dua et!" },
            cekimi: ["اُدْعُ", "اُدْعُوَا", "اُدْعُوا", "اُدْعِي", "اُدْعُوَا", "اُدْعُونَ"]
        },
        19: { 
            suggestsPlus: true, 
            "ة": { 
                emoji: "💌", 
                arText: "دَعْوَة", 
                trText: "Davet / Çağrı." 
            } 
        },
        24: { 
            base: { emoji: "❗", arText: "دُعَاء", trText: "Dua etmek." },
        },
        33: { 
            base: { emoji: "🗣️", arText: "دَاعٍ", trText: "Davet eden." },
            cekimi: [
                { ar: "دَاعٍ", tr: "Belirsiz (Nekra) Kullanım" },
                { ar: "اَلدَّاعِي", tr: "Belirli (Marife) Kullanım" }
            ]
        },
        77: { 
            base: { emoji: "⚖️", arText: "اِدَّعَى", trText: "İddia etti." },
            cekimi: ["اِدَّعَى", "اِدَّعَيَا", "اِدَّعَوْا", "اِدَّعَتْ", "اِدَّعَتَا", "اِدَّعَيْنَ", "اِدَّعَيْتَ", "اِدَّعَيْتُمَا", "اِدَّعَيْتُمْ", "اِدَّعَيْتِ", "اِدَّعَيْتُمَا", "اِدَّعَيْتُنَّ", "اِدَّعَيْتُ", "اِدَّعَيْنَا", "اِدَّعَيْنَا"]
        },
        78: { 
            base: { emoji: "⚖️", arText: "يَدَّعِي", trText: "İddia eder / İddia ediyor." },
            cekimi: ["يَدَّعِي", "يَدَّعِيَانِ", "يَدَّعُونَ", "تَدَّعِي", "تَدَّعِيَانِ", "يَدَّعِينَ", "تَدَّعِي", "تَدَّعِيَانِ", "تَدَّعُونَ", "تَدَّعِينَ", "تَدَّعِيَانِ", "تَدَّعِينَ", "أَدَّعِي", "نَدَّعِي", "نَدَّعِي"]
        },
        79: { 
            base: { emoji: "❗", arText: "اِدَّعِ", trText: "İddia et!" },
            cekimi: ["اِدَّعِ", "اِدَّعِيَا", "اِدَّعُوا", "اِدَّعِي", "اِدَّعِيَا", "اِدَّعِينَ"]
        },
        80: { 
            base: { emoji: "📜", arText: "إِدِّعَاء", trText: "İddia / İddia etmek." },
        },
        81: { 
            base: { emoji: "🧑‍⚖️", arText: "مُدَّعٍ", trText: "İddia eden / Müddei." },
            cekimi: [
                { ar: "مُدَّعٍ", tr: "Belirsiz (Nekra) Kullanım" },
                { ar: "اَلْمُدَّعِي", tr: "Belirli (Marife) Kullanım" }
            ]
        }
    },

    "مشي": {
        1: { 
            base: { emoji: "🚶", arText: "مَشَى", trText: "Yürüdü." },
            cekimi: ["مَشَى", "مَشَيَا", "مَشَوْا", "مَشَتْ", "مَشَتَا", "مَشَيْنَ", "مَشَيْتَ", "مَشَيْتُمَا", "مَشَيْتُمْ", "مَشَيْتِ", "مَشَيْتُمَا", "مَشَيْتُنَّ", "مَشَيْتُ", "مَشَيْنَا", "مَشَيْنَا"]
        },
        4: { 
            base: { emoji: "👟", arText: "يَمْشِي", trText: "Yürür / Yürüyor." },
            cekimi: ["يَمْشِي", "يَمْشِيَانِ", "يَمْشُونَ", "تَمْشِي", "تَمْشِيَانِ", "يَمْشِينَ", "تَمْشِي", "تَمْشِيَانِ", "تَمْشُونَ", "تَمْشِينَ", "تَمْشِيَانِ", "تَمْشِينَ", "أَمْشِي", "نَمْشِي", "نَمْشِي"]
        },
        5: { 
            base: { 
                emoji: "🛑", 
                arText: "اِمْشِ", 
                trText: "Yürü!" 
            },
            ornek: {
                ar: "وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا",
                tr: "Yeryüzünde böbürlenerek (gururla) yürüme! (İsrâ Suresi, 37)"
            },
            cekimi: ["اِمْشِ", "اِمْشِيَا", "اِمْشُوا", "اِمْشِي", "اِمْشِيَا", "اِمْشِينَ"]
        },
        19: {
            base: { 
                emoji: "🚶‍♂️", 
                arText: "مَشْي", 
                trText: "Yürüyüş / Gidişat." 
            },
            ornek: {
                ar: "وَاقْصِدْ فِي مَشْيِكَ",
                tr: "Yürüyüşünde (gidişatında) ölçülü / mütevazı ol. (Lokmân Suresi, 19)"
            }
        },
        33: {
            base: { 
                emoji: "🚶‍♀️", 
                arText: "مَاشٍ", 
                trText: "Yürüyen / Yaya." 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🐑", 
                arText: "مَاشِيَة", 
                trText: "Yürüyen (Kadın) / Küçükbaş Hayvan Sürüsü.",
                ornek: { ar: "ذَهَبْتُ إِلَى الْمَدْرَسَةِ مَاشِيًا", tr: "Okula yürüyerek (yaya olarak) gittim." } 
            }
        },
        38: {
            base: { 
                emoji: "🛤️", 
                arText: "مَمْشًى", 
                trText: "Yürüyüş yolu / Koridor / Yaya kaldırımı." 
            }
        }
    },"رضي": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / 4. Bab) ---
        8: { 
            base: { 
                emoji: "😌", 
                arText: "رَضِيَ", 
                trText: "Razı oldu.",
                ornek: { 
                    ar: "رَضِيَ اللهُ عَنْهُمْ وَرَضُوا عَنْهُ", 
                    tr: "Allah onlardan razı oldu, onlar da O'ndan razı oldular. (Mâide Suresi, 119)" 
                }
            },
            cekimi: ["رَضِيَ", "رَضِيَا", "رَضُوا", "رَضِيَتْ", "رَضِيَتَا", "رَضِينَ", "رَضِيتَ", "رَضِيتُمَا", "رَضِيتُمْ", "رَضِيتِ", "رَضِيتُمَا", "رَضِيتُنَّ", "رَضِيتُ", "رَضِينَا", "رَضِينَا"]
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { 
            base: { 
                emoji: "❤️", 
                arText: "يَرْضَى", 
                trText: "Razı olur / Razı oluyor.",
                ornek: { 
                    ar: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", 
                    tr: "Rabbin sana verecek ve sen razı olacaksın (hoşnut olacaksın). (Duhâ Suresi, 5)" 
                }
            },
            cekimi: ["يَرْضَى", "يَرْضَيَانِ", "يَرْضَوْنَ", "تَرْضَى", "تَرْضَيَانِ", "يَرْضَيْنَ", "تَرْضَى", "تَرْضَيَانِ", "تَرْضَوْنَ", "تَرْضَيْنَ", "تَرْضَيَانِ", "تَرْضَيْنَ", "أَرْضَى", "نَرْضَى", "نَرْضَى"]
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { 
            base: { emoji: "❗", arText: "اِرْضَ", trText: "Razı ol!" },
            cekimi: ["اِرْضَ", "اِرْضَيَا", "اِرْضَوْا", "اِرْضَيْ", "اِرْضَيَا", "اِرْضَيْنَ"]
        },

        // --- 29 Numaralı Kalıp (فِعْلَان) ---
        29: {
            base: {
                emoji: "✨",
                arText: "رِضْوَان",
                trText: "Rıdvan / Büyük hoşnutluk.",
                ornek: { 
                    ar: "يَبْتَغُونَ فَضْلًا مِنَ اللهِ وَرِضْوَانًا", 
                    tr: "Allah'ın lütfunu ve rızasını (hoşnutluğunu) isterler. (Fetih Suresi, 29)" 
                }
            }
        },

        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: {
            base: { 
                emoji: "😊", 
                arText: "رَاضٍ", 
                trText: "Razı olan." 
            },
            cekimi: [
                { ar: "رَاضٍ", tr: "Belirsiz (Nekra) Kullanım - Ye harfi düşer." },
                { ar: "اَلرَّاضِي", tr: "Belirli (Marife) Kullanım - Ye harfi geri gelir." }
            ],
            suggestsPlus: true,
            "ة": {
                emoji: "😌",
                arText: "رَاضِيَة",
                trText: "Razı olan (Dişil).",
                ornek: { 
                    ar: "ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَرْضِيَّةً", 
                    tr: "Razı olmuş ve kendisinden razı olunmuş olarak Rabbine dön! (Fecr Suresi, 28)" 
                }
            }
        },

        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: {
            base: { 
                emoji: "🥰", 
                arText: "مَرْضِيّ", 
                trText: "Kendisinden razı olunan (Nakıs fiil olduğu için marduyy yerine mardiyy olur)." 
            },
            suggestsPlus: true,
            "ة": {
                emoji: "💖",
                arText: "مَرْضِيَّة",
                trText: "Kendisinden razı olunan (Dişil).",
                ornek: { 
                    ar: "ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَرْضِيَّةً", 
                    tr: "Razı olmuş ve kendisinden razı olunmuş olarak Rabbine dön! (Fecr Suresi, 28)" 
                }
            }
        },

        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: {
            base: {
                emoji: "📍",
                arText: "مَرْضَى",
                trText: "Rıza yeri (Yalın)."
            },
            suggestsPlus: true,
            "ة": {
                emoji: "🤲",
                arText: "مَرْضَاة",
                trText: "Rıza / Hoşnutluk kazanılacak şey.",
                cekimi: [
                    {
                        ar: "<div style='display:flex; justify-content:center; align-items:center; gap:15px; direction:rtl;'><span>مَرْضَيَة</span> <i class='fas fa-arrow-left' style='color:#e74c3c; font-size:18px;'></i> <span style='color:#27ae60;'>مَرْضَاة</span></div>",
                        tr: "Ses Olayı (İ'lâl): 'Ye' (ي) harfi harekeli, bir önceki harf fethalı olduğu için kural gereği 'Elif'e (ا) dönüşür."
                    }
                ],
                ornek: { 
                    ar: "وَمِنَ النَّاسِ مَن يَشْرِي نَفْسَهُ ابْتِغَاءَ مَرْضَاةِ اللهِ", 
                    tr: "İnsanlardan öyleleri de vardır ki, Allah'ın rızasını (hoşnutluğunu) kazanmak için kendini feda eder. (Bakara Suresi, 207)" 
                }
            }
        }
    },
    "وقي": {
        1: { 
            base: { emoji: "🛡️", arText: "وَقَى", trText: "Korudu." },
            cekimi: ["وَقَى", "وَقَيَا", "وَقَوْا", "وَقَتْ", "وَقَتَا", "وَقَيْنَ", "وَقَيْتَ", "وَقَيْتُمَا", "وَقَيْتُمْ", "وَقَيْتِ", "وَقَيْتُمَا", "وَقَيْتُنَّ", "وَقَيْتُ", "وَقَيْنَا", "وَقَيْنَا"]
        },
        4: { 
            base: { emoji: "🏰", arText: "يَقِي", trText: "Korur / Koruyor." },
            cekimi: ["يَقِي", "يَقِيَانِ", "يَقُونَ", "تَقِي", "تَقِيَانِ", "يَقِينَ", "تَقِي", "تَقِيَانِ", "تَقُونَ", "تَقِينَ", "تَقِيَانِ", "تَقِينَ", "أَقِي", "نَقِي", "نَقِي"]
        },
        5: { 
            base: { emoji: "❗", arText: "قِ", trText: "Koru!" },
            cekimi: ["قِ", "قِيَا", "قُوا", "قِي", "قِيَا", "قِينَ"]
        },
        23: { 
            base: { 
                emoji: "🛡️", 
                arText: "وِقَاي", 
                trText: "Koruma (Yalın Hâl)" 
            },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🚧", 
                arText: "وِقَايَة", 
                trText: "Koruma / Önlem.",
                ornek: [
                    {
                        ar: "الْوِقَايَةُ خَيْرٌ مِنَ الْعِلَاجِ", 
                        tr: "Önlem almak, tedavi olmaktan hayırlıdır." 
                    },
                    {
                        ar: "يَجِبُ اتِّخَاذُ وِقَايَاتٍ صِحِّيَّةٍ", 
                        tr: "Sağlık önlemleri (tedbirleri) almak gerekir." 
                    }
                ]
            }
        },
        // --- 32 Numaralı Kalıp: فَعْلَى (Fa'lâ) ---
        32: { 
            base: { 
                emoji: "❤️", 
                arText: "تَقْوَى", 
                trText: "Takva / Sakınma." 
            },
            // 1. KONU ANLATIMI (Kalıp Numarasını kırmızı yapar ve tablo olarak açar)
            cekimi: [
                {
                    ar: "<div style='display:flex; justify-content:center; align-items:center; gap:15px; direction:rtl;'><span>وَقْيَى</span> <i class='fas fa-arrow-left' style='color:#e74c3c; font-size:18px;'></i> <span>تَقْيَى</span> <i class='fas fa-arrow-left' style='color:#e74c3c; font-size:18px;'></i> <span style='color:#27ae60;'>تَقْوَى</span></div>", 
                    tr: "Kelimenin aslı 'Wakyâ' (<span dir='rtl'>وَقْيَى</span>) şeklindedir. Kural gereği baştaki Vav (<span dir='rtl'>و</span>) harfi Te'ye (<span dir='rtl'>ت</span>), ortadaki Ye (<span dir='rtl'>ي</span>) harfi Vav'a (<span dir='rtl'>و</span>) dönüşerek 'Takva' olmuştur." 
                }
            ],
            // 2. ÖRNEK AYET (Sadece ünlem ! butonunda, kelime anlamının altında çıkar)
            ornek: {
                ar: "وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَى", 
                tr: "Ahiret için azık toplayın. Kuşkusuz, azığın en hayırlısı takvadır. (Bakara Suresi, 197)" 
            }
        },

        35: { 
            base: { 
                emoji: "😇", 
                arText: "تَقِيّ", 
                trText: "Takva sahibi / Allah'tan sakınan (Yalın)." 
            },
            
        },
        77: { 
            base: { emoji: "🤲", arText: "اِتَّقَى", trText: "Sakındı / Korundu (Takva gösterdi)." },
            cekimi: ["اِتَّقَى", "اِتَّقَيَا", "اِتَّقَوْا", "اِتَّقَتْ", "اِتَّقَتَا", "اِتَّقَيْنَ", "اِتَّقَيْتَ", "اِتَّقَيْتُمَا", "اِتَّقَيْتُمْ", "اِتَّقَيْتِ", "اِتَّقَيْتُمَا", "اِتَّقَيْتُنَّ", "اِتَّقَيْتُ", "اِتَّقَيْنَا", "اِتَّقَيْنَا"]
        },
        78: { 
            base: { emoji: "✨", arText: "يَتَّقِي", trText: "Sakınır / Korunur." },
            cekimi: ["يَتَّقِي", "يَتَّقِيَانِ", "يَتَّقُونَ", "تَتَّقِي", "تَتَّقِيَانِ", "يَتَّقِينَ", "تَتَّقِي", "تَتَّقِيَانِ", "تَتَّقُونَ", "تَتَّقِينَ", "تَتَّقِيَانِ", "تَتَّقِينَ", "أَتَّقِي", "نَتَّقِي", "نَتَّقِي"]
        },
        79: { 
            base: { emoji: "❗", arText: "اِتَّقِ", trText: "Sakın! (Örn: اِتَّقِ الله - Allah'tan sakın/kork!)" },
            cekimi: ["اِتَّقِ", "اِتَّقِيَا", "اِتَّقُوا", "اِتَّقِي", "اِتَّقِيَا", "اِتَّقِينَ"]
        },
        80: { 
            base: { emoji: "🛡️", arText: "اِتِّقَاء", trText: "Sakınma / Korunma (Kurallı Masdar)." },
            ornek: { 
                ar: "اِتِّقَاءُ الشُّبُهَاتِ خَيْرٌ مِنَ الْوُقُوعِ فِيهَا", 
                tr: "Şüpheli şeylerden sakınmak, onlara düşmekten hayırlıdır." 
            }
        },
        81: { 
            base: { emoji: "🕌", arText: "مُتَّقٍ", trText: "Sakınan / Müttaki (Yalın)." },
            suggestsPlus: true,
            "ينَ": { 
                emoji: "📖", 
                arText: "مُتَّقِينَ", 
                trText: "Takva sahipleri (Çoğul / Mansub-Mecrur).",
                ornek: [
                    { ar: "إِنَّهُ كَانَ عَبْدًا مُتَّقِيًا", tr: "Şüphesiz o, takva sahibi (müttaki) bir kuldu." },
                    { ar: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ", tr: "Bu, kendisinde şüphe olmayan kitaptır. Allah'a karşı gelmekten sakınanlar (müttakiler) için bir hidayettir. (Bakara Suresi, 2)" }
                ]
            }
        }
    }, 

  
    "عدد": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab - Muzaaf) ---
        1: { 
            base: { emoji: "🧮", arText: "عَدَّ", trText: "Saydı." },
            cekimi: ["عَدَّ", "عَدَّا", "عَدُّوا", "عَدَّتْ", "عَدَّتَا", "عَدَدْنَ", "عَدَدْتَ", "عَدَدْتُمَا", "عَدَدْتُمْ", "عَدَدْتِ", "عَدَدْتُمَا", "عَدَدْتُنَّ", "عَدَدْتُ", "عَدَدْنَا", "عَدَدْنَا"]
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { 
            base: { emoji: "🔢", arText: "يَعُدُّ", trText: "Sayar / Sayıyor." },
            cekimi: ["يَعُدُّ", "يَعُدَّانِ", "يَعُدُّونَ", "تَعُدُّ", "تَعُدَّانِ", "يَعْدُدْنَ", "تَعُدُّ", "تَعُدَّانِ", "تَعُدُّونَ", "تَعُدِّينَ", "تَعُدَّانِ", "تَعْدُدْنَ", "أَعُدُّ", "نَعُدُّ", "نَعُدُّ"]
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { 
            base: { emoji: "❗", arText: "عُدَّ", trText: "Say!" },
            cekimi: ["عُدَّ", "عُدَّا", "عُدُّوا", "عُدِّي", "عُدَّا", "اُعْدُدْنَ"]
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { 
                emoji: "🔢", 
                arText: "عَدَد", 
                trText: "Sayı / Adet.",
                ornek: { ar: "عَدَدُ الطُّلَّابِ فِي الْفَصْلِ عِشْرُونَ", tr: "Sınıftaki öğrencilerin sayısı yirmidir." }
            } 
        },


        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            base: { 
                emoji: "🔢", 
                arText: "عُدّ", 
                trText: "Hazırlık"},
            
            suggestsPlus: true, 
            "ة": { 
                emoji: "🎒", 
                arText: "عُدَّة", 
                trText: "Hazırlık / Teçhizat (İddet).",
                ornek: { ar: "وَلَوْ أَرَادُوا الْخُرُوجَ لَأَعَدُّوا لَهُ عُدَّةً", tr: "Eğer (savaşa) çıkmak isteselerdi, elbette bunun için bir hazırlık (teçhizat) yaparlardı. (Tevbe Suresi, 46)" }
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "🗓️", arText: "مَعْدُود", trText: "Sayılmış / Sayılı." },
            suggestsPlus: true,
            "ات": { 
                emoji: "📅", 
                arText: "مَعْدُودَات", 
                trText: "Sayılı şeyler (günler).",
                ornek: { ar: "أَيَّامًا مَّعْدُودَاتٍ", tr: "Sayılı günler. (Bakara Suresi, 184)" } 
            }
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - Mazi / İf'âl Babı) ---
        52: { 
            base: { emoji: "⚙️", arText: "أَعَدَّ", trText: "Hazırladı." },
            cekimi: ["أَعَدَّ", "أَعَدَّا", "أَعَدُّوا", "أَعَدَّتْ", "أَعَدَّتَا", "أَعْدَدْنَ", "أَعْدَدْتَ", "أَعْدَدْتُمَا", "أَعْدَدْتُمْ", "أَعْدَدْتِ", "أَعْدَدْتُمَا", "أَعْدَدْتُنَّ", "أَعْدَدْتُ", "أَعْدَدْنَا", "أَعْدَدْنَا"]
        },
        
        // --- 53 Numaralı Kalıp (يُفْعِلُ - Muzari / İf'âl Babı) ---
        53: { 
            base: { emoji: "🔄", arText: "يُعِدُّ", trText: "Hazırlar / Hazırlıyor." },
            cekimi: ["يُعِدُّ", "يُعِدَّانِ", "يُعِدُّونَ", "تُعِدُّ", "تُعِدَّانِ", "يُعْدِدْنَ", "تُعِدُّ", "تُعِدَّانِ", "تُعِدُّونَ", "تُعِدِّينَ", "تُعِدَّانِ", "تُعْدِدْنَ", "أُعِدُّ", "نُعِدُّ", "نُعِدُّ"]
        },
        
        // --- 54 Numaralı Kalıp (أَفْعِلْ - Emir / İf'âl Babı) ---
        // --- 54 Numaralı Kalıp (أَفْعِلْ - Emir / İf'âl Babı) ---
        54: { 
            base: { 
                emoji: "⚔️", 
                arText: "أَعِدَّ", 
                trText: "Hazırla!",
                ornek: { 
                    ar: "وَأَعِدُّوا لَهُم مَّا اسْتَطَعْتُم مِّن قُوَّةٍ", 
                    tr: "Onlara karşı gücünüz yettiği kadar kuvvet (savaş teçhizatı) hazırlayın. (Enfâl Suresi, 60)" 
                }
            },
            cekimi: ["أَعِدَّ", "أَعِدَّا", "أَعِدُّوا", "أَعِدِّي", "أَعِدَّا", "أَعْدِدْنَ"]
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'al Masdarı) ---
        55: { 
            base: { emoji: "📋", arText: "إِعْدَاد", trText: "Hazırlama." },
            suggestsPlus: true,
            "ات": { 
                emoji: "⚙️", 
                arText: "إِعْدَادَات", 
                trText: "Ayarlar / Hazırlıklar.",
                ornek: { ar: "إِعْدَادَاتُ الْهَاتِفِ", tr: "Telefon ayarları." } 
            }
        },

        // --- 92 Numaralı Kalıp (مُتَفَعِّل - Tefe'ul İsm-i Faili) ---
        92: { 
            base: { 
                emoji: "🔀", 
                arText: "مُتَعَدِّد", 
                trText: "Çeşitli / Çoklu.",
                ornek: { ar: "أَسْئِلَةٌ مُتَعَدِّدَةُ الْخِيَارَاتِ", tr: "Çoktan seçmeli sorular." } 
            } 
        },

        // --- 100 Numaralı Kalıp (اِسْتَفْعَلَ - Mazi / İstif'al Babı) ---
        100: { 
            base: { emoji: "🏃", arText: "اِسْتَعَدَّ", trText: "Hazırlandı (Kendini hazırladı)." },
            cekimi: ["اِسْتَعَدَّ", "اِسْتَعَدَّا", "اِسْتَعَدُّوا", "اِسْتَعَدَّتْ", "اِسْتَعَدَّتَا", "اِسْتَعْدَدْنَ", "اِسْتَعْدَدْتَ", "اِسْتَعْدَدْتُمَا", "اِسْتَعْدَدْتُمْ", "اِسْتَعْدَدْتِ", "اِسْتَعْدَدْتُمَا", "اِسْتَعْدَدْتُنَّ", "اِسْتَعْدَدْتُ", "اِسْتَعْدَدْنَا", "اِسْتَعْدَدْنَا"]
        },
        
        // --- 101 Numaralı Kalıp (يَسْتَفْعِلُ - Muzari / İstif'al Babı) ---
        101: { 
            base: { emoji: "⏳", arText: "يَسْتَعِدُّ", trText: "Hazırlanır / Hazırlanıyor." },
            cekimi: ["يَسْتَعِدُّ", "يَسْتَعِدَّانِ", "يَسْتَعِدُّونَ", "تَسْتَعِدُّ", "تَسْتَعِدَّانِ", "يَسْتَعْدِدْنَ", "تَسْتَعِدُّ", "تَسْتَعِدَّانِ", "تَسْتَعِدُّونَ", "تَسْتَعِدِّينَ", "تَسْتَعِدَّانِ", "تَسْتَعْدِدْنَ", "أَسْتَعِدُّ", "نَسْتَعِدُّ", "نَسْتَعِدُّ"]
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - İstif'al Masdarı) ---
        103: { 
            base: { 
                emoji: "🎒", 
                arText: "اِسْتِعْدَاد", 
                trText: "Hazırlık / Yetenek / İstidat.",
                ornek: { ar: "لَدَيْهِ اسْتِعْدَادٌ لِتَعَلُّـمِ اللُّغَاتِ", tr: "Diller öğrenmeye yeteneği (istidadı/hazırlığı) var." } 
            } 
        }
    },

"صلي": {
        58: { 
            base: { emoji: "🧎", arText: "صَلَّى", trText: "Namaz kıldı / Dua etti." },
            cekimi: ["صَلَّى", "صَلَّيَا", "صَلَّوْا", "صَلَّتْ", "صَلَّتَا", "صَلَّيْنَ", "صَلَّيْتَ", "صَلَّيْتُمَا", "صَلَّيْتُمْ", "صَلَّيْتِ", "صَلَّيْتُمَا", "صَلَّيْتُنَّ", "صَلَّيْتُ", "صَلَّيْنَا", "صَلَّيْنَا"]
        },
        59: { 
            base: { emoji: "🤲", arText: "يُصَلِّي", trText: "Namaz kılar / Kılıyor." },
            cekimi: ["يُصَلِّي", "يُصَلِّيَانِ", "يُصَلُّونَ", "تُصَلِّي", "تُصَلِّيَانِ", "يُصَلِّينَ", "تُصَلِّي", "تُصَلِّيَانِ", "تُصَلُّونَ", "تُصَلِّينَ", "تُصَلِّيَانِ", "تُصَلِّينَ", "أُصَلِّي", "نُصَلِّي", "نُصَلِّي"]
        },
        60: { 
            base: { emoji: "❗", arText: "صَلِّ", trText: "Namaz kıl!" },
            cekimi: ["صَلِّ", "صَلِّيَا", "صَلُّوا", "صَلِّي", "صَلِّيَا", "صَلِّينَ"]
        }
    },
"سوي": {
           8: {
            base: {
                emoji: "💎",
                arText: "سَوِيَ",
                trText: "Düzgün oldu / Değerinde oldu.",
                ornek: { ar: "هَذَا سَوِيَ بِذَاكَ", tr: "Bu şuna eşit (denk) oldu." }
            },
            cekimi: ["سَوِيَ", "سَوِيَا", "سَوُوا", "سَوِيَتْ", "سَوِيَتَا", "سَوِينَ", "سَوِيتَ", "سَوِيتُمَا", "سَوِيتُمْ", "سَوِيتِ", "سَوِيتُمَا", "سَوِيتُنَّ", "سَوِيتُ", "سَوِينَا", "سَوِينَا"]
        },

            // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: {
            base: {
                emoji: "⚖️",
                arText: "يَسْوَى",
                trText: "Değer / Eder / Değerindedir.",
                ornek: [
                    { 
                        ar: "هَذَا لَا يَسْوَى شَيْئًا", 
                        tr: "Bu hiçbir şeye değmez (beş para etmez)." 
                    },
                    { 
                        ar: "💡 مَعْلُومَة ثَقَافِيَّة", 
                        tr: "Arap dünyasında bir şeyin değersiz olduğunu veya bir zahmete girmeye değmeyeceğini belirtmek için \"لَا يَسْوَى\" (Lâ yesvâ - Değmez / Beş para etmez) kalıbı kalıplaşmış bir deyim olarak her yerde kullanılır." 
                    }
                ]
            }
        },

         10: {
            base: {
                emoji: "❗",
                arText: "اِسْوَ",
                trText: "Değerinde ol!"
            },
            cekimi: ["اِسْوَ", "اِسْوَيَا", "اِسْوَوْا", "اِسْوَيْ", "اِسْوَيَا", "اِسْوَيْنَ"]
        },
            // --- 35 Numaralı Kalıp (فَعِيل - İsim/Sıfat) ---
        35: {
            base: {
                emoji: "➖",
                arText: "سَوِيّ",
                trText: "Düz / Eşit / Normal.",
                ornek: { ar: "صِرَاطٌ سَوِيٌّ", tr: "Düz (doğru) bir yol." }
            },
            suggestsPlus: true,
            "ة": {
                emoji: "📏",
                arText: "سَوِيَّة",
                trText: "Seviye / Düzey / Eşitlik.",
                ornek: { ar: "هُمْ عَلَى سَوِيَّةٍ وَاحِدَةٍ", tr: "Onlar aynı seviyededirler." }
            }
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: {
            base: { 
                emoji: "✨", 
                arText: "سَوَّى", 
                trText: "Düzenledi / Düzeltip kusursuzlaştırdı.",
                ornek: { ar: "الَّذِي خَلَقَ فَسَوَّىٰ", tr: "O ki, yarattı ve düzene koydu (kusursuzca şekillendirdi). (A'lâ Suresi, 2)" }
            },
            cekimi: ["سَوَّى", "سَوَّيَا", "سَوَّوْا", "سَوَّتْ", "سَوَّتَا", "سَوَّيْنَ", "سَوَّيْتَ", "سَوَّيْتُمَا", "سَوَّيْتُمْ", "سَوَّيْتِ", "سَوَّيْتُمَا", "سَوَّيْتُنَّ", "سَوَّيْتُ", "سَوَّيْنَا", "سَوَّيْنَا"]
        },

        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: {
            base: { 
                emoji: "🛠️", 
                arText: "يُسَوِّي", 
                trText: "Düzenler / Düzeltiyor / Eşitliyor." 
            },
            cekimi: ["يُسَوِّي", "يُسَوِّيَانِ", "يُسَوُّونَ", "تُسَوِّي", "تُسَوِّيَانِ", "يُسَوِّينَ", "تُسَوِّي", "تُسَوِّيَانِ", "تُسَوُّونَ", "تُسَوِّينَ", "تُسَوِّيَانِ", "تُسَوِّينَ", "أُسَوِّي", "نُسَوِّي", "نُسَوِّي"]
        },

        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: {
            base: { 
                emoji: "❗", 
                arText: "سَوِّ", 
                trText: "Düzenle / Düzelt!",
                not: "Not: Nakıs (sonu illetli) fiillerin emir kipi yapılırken, meczumluk alameti olarak sondaki illet harfi (Ye) kural gereği düşer (سَوِّي değil, سَوِّ olur)."
            },
            cekimi: ["سَوِّ", "سَوِّيَا", "سَوُّوا", "سَوِّي", "سَوِّيَا", "سَوِّينَ"]
        },

        // --- 61 Numaralı Kalıp (تَفْعِلَة / تَفْعِيل - Masdar / Tef'îl Babı) ---
        61: {
            base: {
                emoji: "📐",
                arText: "تَسْوِيَة",
                trText: "Düzeltme / Eşitleme (Tesviye).",
                ornek: { ar: "تَسْوِيَةُ الْأَرْضِ", tr: "Araziyi düzeltmek (tesviye etmek)." }
            }
        },

        // --- 64 Numaralı Kalıp (فَاعَلَ - Mazi / Mufâ'ale Babı) ---
        64: {
            base: { emoji: "⚖️", arText: "سَاوَى", trText: "Eşitledi / Denk oldu." },
            cekimi: ["سَاوَى", "سَاوَيَا", "سَاوَوْا", "سَاوَتْ", "سَاوَتَا", "سَاوَيْنَ", "سَاوَيْتَ", "سَاوَيْتُمَا", "سَاوَيْتُمْ", "سَاوَيْتِ", "سَاوَيْتُمَا", "سَاوَيْتُنَّ", "سَاوَيْتُ", "سَاوَيْنَا", "سَاوَيْنَا"]
        },

        // --- 65 Numaralı Kalıp (يُفَاعِلُ - Muzari / Mufâ'ale Babı) ---
        65: {
            base: { emoji: "🟰", arText: "يُسَاوِي", trText: "Eşitler / Eşit oluyor." },
            cekimi: ["يُسَاوِي", "يُسَاوِيَانِ", "يُسَاوُونَ", "تُسَاوِي", "تُسَاوِيَانِ", "يُسَاوِينَ", "تُسَاوِي", "تُسَاوِيَانِ", "تُسَاوُونَ", "تُسَاوِينَ", "تُسَاوِيَانِ", "تُسَاوِينَ", "أُسَاوِي", "نُسَاوِي", "نُسَاوِي"]
        },

        // --- 66 Numaralı Kalıp (فَاعِلْ - Emir / Mufâ'ale Babı) ---
        66: {
            base: { 
                emoji: "❗", 
                arText: "سَاوِ", 
                trText: "Eşitle / Denk tut!",
                ornek: { 
                    ar: "💡 قَاعِدَة صَرْفِيَّة", 
                    tr: "Sarf Kuralı: Nakıs (sonu illetli) fiillerin emir kipi yapılırken, meczumluk alameti olarak sondaki illet harfi (Ye) kural gereği düşer (سَاوِي değil, سَاوِ olur)." 
                }
            },
            cekimi: ["سَاوِ", "سَاوِيَا", "سَاوُوا", "سَاوِي", "سَاوِيَا", "سَاوِينَ"]
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Masdar / Mufâ'ale Babı) ---
        67: {
            base: {
                emoji: "🤝",
                arText: "مُسَاوَاة",
                trText: "Eşitlik / Denklik (Müsâvât).",
                ornek: { ar: "الْمُسَاوَاةُ بَيْنَ النَّاسِ", tr: "İnsanlar arası eşitlik." }
            }
        },

        // --- 68 Numaralı Kalıp (مُفَاعِل - İsm-i Fâil / Mufâ'ale Babı) ---
        69: {
            base: {
                emoji: "♊",
                arText: "مُسَاوٍ",
                trText: "Eşit / Denk olan (Müsâvi).",
                ornek: { 
                    ar: "💡 قَاعِدَة صَرْفِيَّة", 
                    tr: "Sarf Kuralı: Kelimenin aslı 'مُسَاوِي' şeklindedir. Ancak Arapçada İsm-i Mankus (sonu illetli) isimler, başında Elif-Lam takısı yoksa sondaki 'Ye' harfini düşürür ve ivaz tenvini alırlar (مُسَاوٍ)." 
                }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "♊", 
                arText: "مُسَاوِيَة", 
                trText: "Eşit olan (Kadın)." 
            }
        },
// --- 77 Numaralı Kalıp (اِفْتَعَلَ - Mazi / İfti'âl Babı) ---
        77: {
            base: {
                emoji: "✨",
                arText: "اسْتَوَى",
                trText: "Düz oldu / Karar kıldı / İstivâ etti.",
                ornek: {
                    ar: "الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ",
                    tr: "Rahmân, Arş'a istivâ etti (kuruldu/hükümran oldu). (Tâhâ Suresi, 5)"
                }
            },
            cekimi: ["اسْتَوَى", "اسْتَوَيَا", "اسْتَوَوْا", "اسْتَوَتْ", "اسْتَوَتَا", "اسْتَوَيْنَ", "اسْتَوَيْتَ", "اسْتَوَيْتُمَا", "اسْتَوَيْتُمْ", "اسْتَوَيْتِ", "اسْتَوَيْتُمَا", "اسْتَوَيْتُنَّ", "اسْتَوَيْتُ", "اسْتَوَيْنَا", "اسْتَوَيْنَا"]
        },

        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - Muzari / İfti'âl Babı) ---
        78: {
            base: {
                emoji: "⚖️",
                arText: "يَسْتَوِي",
                trText: "Eşit olur / Bir olur / Düzlenir.",
                ornek: [
                    
                    {
                        ar: "لَا يَسْتَوِي أَصْحَابُ النَّارِ وَأَصْحَابُ الْجَنَّةِ",
                        tr: "Cehennem ehli ile cennet ehli bir (eşit) olmaz. (Haşr Suresi, 20)"
                        
                    },
                    {
                        ar: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ",
                        tr: "De ki: Hiç bilenlerle bilmeyenler bir olur mu? (Zümer Suresi, 9)"
                    }
                ]
            },
            cekimi: ["يَسْتَوِي", "يَسْتَوِيَانِ", "يَسْتَوُونَ", "تَسْتَوِي", "تَسْتَوِيَانِ", "يَسْتَوِينَ", "تَسْتَوِي", "تَسْتَوِيَانِ", "تَسْتَوُونَ", "تَسْتَوِينَ", "تَسْتَوِيَانِ", "تَسْتَوِينَ", "أَسْتَوِي", "نَسْتَوِي", "نَسْتَوِي"]
        },

        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - Emir / İfti'âl Babı) ---
        79: {
            base: {
                emoji: "❗",
                arText: "اسْتَوِ",
                trText: "Düz ol / Karar kıl!"
            },
            cekimi: ["اسْتَوِ", "اسْتَوِيَا", "اسْتَوُوا", "اسْتَوِي", "اسْتَوِيَا", "اسْتَوِينَ"],
            not: "Not: Nakıs (sonu illetli) fiillerin emir kipi yapılırken، meczumluk alameti olarak sondaki illet harfi (Ye) kural gereği düşer (اسْتَوِي değil، اسْتَوِ olur)."
        },
        // --- 80 Numaralı Kalıp (اِفْتِعَال - Masdar / İfti'âl Babı) ---
        80: {
            base: {
                emoji: "🌍",
                arText: "اِسْتِوَاء",
                trText: "Düz olma / Eşitlenme / Karar kılma (İstivâ).",
                ornek: [
                     { 
                        ar: "خَطُّ الِاسْتِوَاءِ", 
                        tr: "Ekvator çizgisi (Eşitlik hattı)." 
                    }
                    
                ]
            }
        }
    },

   "وصل": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { 
            base: { 
                emoji: "🚶‍♂️", 
                arText: "وَصَلَ", 
                trText: "Ulaştı / Vardı.",
                ornek: { ar: "وَصَلَ الْمُسَافِرُ إِلَى الْمَدِينَةِ", tr: "Yolcu şehre ulaştı." }
            },
            cekimi: ["وَصَلَ", "وَصَلَا", "وَصَلُوا", "وَصَلَتْ", "وَصَلَتَا", "وَصَلْنَ", "وَصَلْتَ", "وَصَلْتُمَا", "وَصَلْتُمْ", "وَصَلْتِ", "وَصَلْتُمَا", "وَصَلْتُنَّ", "وَصَلْتُ", "وَصَلْنَا", "وَصَلْنَا"]
        },

        // --- 4 Numaralı Kalıp (يَفْعِلُ - Muzari / 1. Bab) ---
        4: { 
            base: { 
                emoji: "🎯", 
                arText: "يَصِلُ", 
                trText: "Ulaşır / Varıyor.",
                ornek: { ar: "يَصِلُ الْقِطَارُ فِي الْمَوْعِدِ", tr: "Tren vaktinde ulaşır." }
            },
            cekimi: ["يَصِلُ", "يَصِلَانِ", "يَصِلُونَ", "تَصِلُ", "تَصِلَانِ", "يَصِلْنَ", "تَصِلُ", "تَصِلَانِ", "تَصِلُونَ", "تَصِلِينَ", "تَصِلَانِ", "تَصِلْنَ", "أَصِلُ", "نَصِلُ", "نَصِلُ"],
            not: "Not: 'Misal Vavi' (ilk harfi vav olan) bir fiil olduğu için muzaride 'Vav' harfi düşer (يَوْصِلُ değil, يَصِلُ olur)."
        },

        // --- 5 Numaralı Kalıp (اِفْعِلْ - Emir) ---
        5: { 
            base: { emoji: "❗", arText: "صِلْ", trText: "Ulaş / Bağ kur!" },
            cekimi: ["صِلْ", "صِلَا", "صِلُوا", "صِلِي", "صِلَا", "صِلْنَ"],
            not: "Not: Muzaride düşen 'Vav' harfi emir kipinde de geri gelmez."
        },

        // --- 20 Numaralı Kalıp (فِعْل - İsim / +ة ile Sıla) ---
        20: { 
            base: { 
                emoji: "🧩", 
                arText: "صِل", 
                trText: "Bağ (Kök form)." 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🤝", 
                arText: "صِلَة", 
                trText: "Bağ / İlişki / Sıla.",
                ornek: { ar: "صِلَةُ الرَّحِمِ", tr: "Akrabalık bağlarını gözetmek (Sıla-i Rahim)." },
                not: "Not: Arapçada baştaki illet harfi (Vav) düştüğünde, genellikle kelimenin sonuna bedel olarak Tâ-i Merbûta (ة) eklenir."
            }
        },

        // --- 21 Numaralı Kalıp (فُعْل - İsim / +ة ile Vuslat) ---
        21: { 
            base: { 
                emoji: "🧩", 
                arText: "وُصْل", 
                trText: "Kavuşma (Kök form)." 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "❤️", 
                arText: "وُصْلَة", 
                trText: "Kavuşma / Bağ / Vuslat.",
                ornek: { ar: "شَوْقُ الْوُصْلَةِ", tr: "Kavuşma (Vuslat) hasreti." }
            }
        },

        // --- 25 Numaralı Kalıp (فُعُول - Masdar) ---
        25: { 
            base: { 
                emoji: "🏁", 
                arText: "وُصُول", 
                trText: "Ulaşmak / Varmak." 
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil / Vâsıl) ---
        33: { 
            base: { 
                emoji: "🙋‍♂️", 
                arText: "وَاصِل", 
                trText: "Ulaşan / Kavuşturan / Vâsıl.",
                ornek: { ar: "اَللَّهُمَّ صَلِّ عَلَى النَّبِيِّ الْوَاصِلِ", tr: "Allah'ım, ulaştıran (kavuşturan) Peygambere salat et." }
            }
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "📦", 
                arText: "مَوْصُول", 
                trText: "Ulaşılan / Bağlanan.",
                ornek: { ar: "اَلِاسْمُ الْمَوْصُولُ", tr: "İlgi zamiri (Arapçada اَلَّذِي gibi bağlayıcı kelimeler)." }
            }
            
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - Mazi / İfti'âl Babı) ---
        77: { 
            base: { 
                emoji: "🔗", 
                arText: "اِتَّصَلَ", 
                trText: "Bağlandı / İletişim kurdu / Aradı.",
                ornek: { ar: "اِتَّصَلَ بِصَدِيقِهِ بِالْهَاتِفِ", tr: "Arkadaşını telefonla aradı (onunla iletişim kurdu)." }
            },
            cekimi: ["اِتَّصَلَ", "اِتَّصَلَا", "اِتَّصَلُوا", "اِتَّصَلَتْ", "اِتَّصَلَتَا", "اِتَّصَلْنَ", "اِتَّصَلْتَ", "اِتَّصَلْتُمَا", "اِتَّصَلْتُمْ", "اِتَّصَلْتِ", "اِتَّصَلْتُمَا", "اِتَّصَلْتُنَّ", "اِتَّصَلْتُ", "اِتَّصَلْنَا", "اِتَّصَلْنَا"],
            not: "Not: Fiilin aslı 'اِوْتَصَلَ' (İvtasala) idi. Dile zor geldiği için 'Vav' harfi 'Te'ye dönüştü ve şeddeli okundu."
        },
        
        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - Muzari / İfti'âl Babı) ---
        78: { 
            base: { 
                emoji: "📞", 
                arText: "يَتَّصِلُ", 
                trText: "Bağlanır / İletişim kuruyor / Arıyor." 
            },
            cekimi: ["يَتَّصِلُ", "يَتَّصِلَانِ", "يَتَّصِلُونَ", "تَتَّصِلُ", "تَتَّصِلَانِ", "يَتَّصِلْنَ", "تَتَّصِلُ", "تَتَّصِلَانِ", "تَتَّصِلُونَ", "تَتَّصِلِينَ", "تَتَّصِلَانِ", "تَتَّصِلْنَ", "أَتَّصِلُ", "نَتَّصِلُ", "نَتَّصِلُ"]
        },
        
        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - Emir / İfti'âl Babı) ---
        79: { 
            base: { emoji: "❗", arText: "اِتَّصِلْ", trText: "Bağlan / İletişim kur / Ara!" },
            cekimi: ["اِتَّصِلْ", "اِتَّصِلَا", "اِتَّصِلُوا", "اِتَّصِلِي", "اِتَّصِلَا", "اِتَّصِلْنَ"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - Masdar / İfti'âl Babı) ---
        80: {
            base: { 
                emoji: "📡", 
                arText: "اِتِّصَال", 
                trText: "Bağlantı / İletişim." 
            },
            suggestsPlus: true,
            "ات": { emoji: "📶", arText: "اِتِّصَالَات", trText: "İletişim (sektörü) / Bağlantılar." }
        },

        // --- 81 Numaralı Kalıp (مُفْتَعِل - İsm-i Fâil / İfti'âl Babı) ---
        81: {
            base: { 
                emoji: "🟢", 
                arText: "مُتَّصِل", 
                trText: "Bağlı / Bitişik / Çevrimiçi (Online)." 
            }
        }
    },


          "خير": {
        // --- 19 Numaralı Kalıp (فَعْل / İsim) ---
        19: { 
            base: { 
                emoji: "🤍", 
                arText: "خَيْر", 
                trText: "İyilik / Hayır / Daha iyi.",
                ornek: { 
                    ar: "فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ", 
                    tr: "Kim zerre ağırlığınca bir hayır (iyilik) işlerse, onu görecektir. (Zilzâl Suresi, 7)" 
                }
            } 
        },

        // --- 23 Numaralı Kalıp (فِعَال) ---
        23: { 
            base: { emoji: "🤔", arText: "خِيَار", trText: "Seçenek / Tercih." },
            suggestsPlus: true,
            "ات": { 
                emoji: "✅", 
                arText: "خِيَارَات", 
                trText: "Seçenekler.",
                ornek: { ar: "أَسْئِلَةٌ مُتَعَدِّدَةُ الْخِيَارَاتِ", tr: "Çoktan seçmeli sorular." } 
            }
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - Mazi / İfti'âl Babı) ---
        77: { 
            base: { 
                emoji: "🎯", 
                arText: "اِخْتَارَ", 
                trText: "Seçti.",
                ornek: { ar: "وَاخْتَارَ مُوسَىٰ قَوْمَهُ سَبْعِينَ رَجُلًا", tr: "Musa, kavminden yetmiş adam seçti. (A'râf Suresi, 155)" }
            },
            cekimi: ["اِخْتَارَ", "اِخْتَارَا", "اِخْتَارُوا", "اِخْتَارَتْ", "اِخْتَارَتَا", "اِخْتَرْنَ", "اِخْتَرْتَ", "اِخْتَرْتُمَا", "اِخْتَرْتُمْ", "اِخْتَرْتِ", "اِخْتَرْتُمَا", "اِخْتَرْتُنَّ", "اِخْتَرْتُ", "اِخْتَرْنَا", "اِخْتَرْنَا"]
        },
        
        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - Muzari / İfti'âl Babı) ---
        78: { 
            base: { 
                emoji: "✅", 
                arText: "يَخْتَارُ", 
                trText: "Seçer / Seçiyor.",
                ornek: { ar: "وَرَبُّكَ يَخْلُقُ مَا يَشَاءُ وَيَخْتَارُ", tr: "Rabbin dilediğini yaratır ve (dilediğini) seçer. (Kasas Suresi, 68)" }
            },
            cekimi: ["يَخْتَارُ", "يَخْتَارَانِ", "يَخْتَارُونَ", "تَخْتَارُ", "تَخْتَارَانِ", "يَخْتَرْنَ", "تَخْتَارُ", "تَخْتَارَانِ", "تَخْتَارُونَ", "تَخْتَارِينَ", "تَخْتَارَانِ", "تَخْتَرْنَ", "أَخْتَارُ", "نَخْتَارُ", "نَخْتَارُ"]
        },
        
        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - Emir / İfti'âl Babı) ---
        79: { 
            base: { emoji: "❗", arText: "اِخْتَرْ", trText: "Seç!" },
            cekimi: ["اِخْتَرْ", "اِخْتَارَا", "اِخْتَارُوا", "اِخْتَارِي", "اِخْتَارَا", "اِخْتَرْنَ"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - Masdar) ---
        80: { 
            base: { 
                emoji: "⚖️", 
                arText: "اِخْتِيَار", 
                trText: "Seçim / Tercih (İhtiyar).",
                ornek: { ar: "حُرِّيَّةُ الِاخْتِيَارِ", tr: "Seçim (tercih) özgürlüğü." }
            } 
        },

        // --- 81 Numaralı Kalıp (مُفْتَعِل - İsm-i Fâil) ---
        81: { 
            base: { 
                emoji: "🙋‍♂️", 
                arText: "مُخْتَار", 
                trText: "Seçen / Tercih eden (İsm-i Fâil).",
                ornek: { ar: "هُوَ مُخْتَارٌ لِهَذَا الطَّرِيقِ", tr: "O, bu yolu seçen kişidir." }
            },
            // İsm-i Fail ve Mef'ulün aynı olduğunu belirten not
            not: "Not: Bu kök Ecvef olduğu için İsm-i Fail ve İsm-i Mef'ûl yazılışları aynıdır (مُخْتَار)."
        }, 
        
        // --- 82 Numaralı Kalıp (مُفْتَعَل - İsm-i Mef'ûl) ---
        82: { 
            base: { 
                emoji: "⭐", 
                arText: "مُخْتَار", 
                trText: "Seçilmiş / Muhtar (İsm-i Mef'ûl).",
                ornek: { ar: "اَلنَّبِيُّ الْمُصْطَفَى الْمُخْتَارُ", tr: "Seçkin ve seçilmiş olan Peygamber." }
            }, 
            suggestsPlus: true, 
            "ة": { 
                emoji: "🏡", 
                arText: "مُخْتَارَة",
                trText: "Seçilmiş (Kadın) / Kadın Muhtar." 
            },
            not: "Not: Bu kök Ecvef olduğu için İsm-i Fail ve İsm-i Mef'ûl yazılışları aynıdır (مُخْتَار)."
        }
      
       },
    "وضأ": {
        88: { 
            base: { emoji: "💧", arText: "تَوَضَّأَ", trText: "Abdest aldı." },
            cekimi: ["تَوَضَّأَ", "تَوَضَّأَا", "تَوَضَّأُوا", "تَوَضَّأَتْ", "تَوَضَّأَتَا", "تَوَضَّأْنَ", "تَوَضَّأْتَ", "تَوَضَّأْتُمَا", "تَوَضَّأْتُمْ", "تَوَضَّأْتِ", "تَوَضَّأْتُمَا", "تَوَضَّأْتُنَّ", "تَوَضَّأْتُ", "تَوَضَّأْنَا", "تَوَضَّأْنَا"]
        },
        89: { 
            base: { emoji: "💦", arText: "يَتَوَضَّأُ", trText: "Abdest alır / Alıyor." },
            cekimi: ["يَتَوَضَّأُ", "يَتَوَضَّآنِ", "يَتَوَضَّؤُونَ", "تَتَوَضَّأُ", "تَتَوَضَّآنِ", "يَتَوَضَّأْنَ", "تَتَوَضَّأُ", "تَتَوَضَّآنِ", "تَتَوَضَّؤُونَ", "تَتَوَضَّئِينَ", "تَتَوَضَّآنِ", "تَتَوَضَّأْنَ", "أَتَوَضَّأُ", "نَتَوَضَّأُ", "نَتَوَضَّأُ"]
        },
        90: { 
            base: { emoji: "❗", arText: "تَوَضَّأْ", trText: "Abdest al!" },
            cekimi: ["تَوَضَّأْ", "تَوَضَّآ", "تَوَضَّؤُوا", "تَوَضَّئِي", "تَوَضَّآ", "تَوَضَّأْنَ"]
        }
    },
    "عون": {
        94: { 
            base: { emoji: "🤝", arText: "تَعَاوَنَ", trText: "Yardımlaştı." },
            cekimi: ["تَعَاوَنَ", "تَعَاوَنَا", "تَعَاوَنُوا", "تَعَاوَنَتْ", "تَعَاوَنَتَا", "تَعَاوَنَّ", "تَعَاوَنْتَ", "تَعَاوَنْتُمَا", "تَعَاوَنْتُمْ", "تَعَاوَنْتِ", "تَعَاوَنْتُمَا", "تَعَاوَنْتُنَّ", "تَعَاوَنْتُ", "تَعَاوَنَّا", "تَعَاوَنَّا"]
        },
        95: { 
            base: { emoji: "🫂", arText: "يَتَعَاوَنُ", trText: "Yardımlaşır / Yardımlaşıyor." },
            cekimi: ["يَتَعَاوَنُ", "يَتَعَاوَنَانِ", "يَتَعَاوَنُونَ", "تَتَعَاوَنُ", "تَتَعَاوَنَانِ", "يَتَعَاوَنَّ", "تَتَعَاوَنُ", "تَتَعَاوَنَانِ", "تَتَعَاوَنُونَ", "تَتَعَاوَنِينَ", "تَتَعَاوَنَانِ", "تَتَعَاوَنَّ", "أَتَعَاوَنُ", "نَتَعَاوَنُ", "نَتَعَاوَنُ"]
        },
        96: { 
            base: { emoji: "❗", arText: "تَعَاوَنْ", trText: "Yardımlaş!" },
            cekimi: ["تَعَاوَنْ", "تَعَاوَنَا", "تَعَاوَنُوا", "تَعَاوَنِي", "تَعَاوَنَا", "تَعَاوَنَّ"]
        }
    },
    "وفي": {
        100: { 
            base: { emoji: "✅", arText: "اِسْتَوْفَى", trText: "Tamamını aldı / Yerine getirdi." },
            cekimi: ["اِسْتَوْفَى", "اِسْتَوْفَيَا", "اِسْتَوْفَوْا", "اِسْتَوْفَتْ", "اِسْتَوْفَتَا", "اِسْتَوْفَيْنَ", "اِسْتَوْفَيْتَ", "اِسْتَوْفَيْتُمَا", "اِسْتَوْفَيْتُمْ", "اِسْتَوْفَيْتِ", "اِسْتَوْفَيْتُمَا", "اِسْتَوْفَيْتُنَّ", "اِسْتَوْفَيْتُ", "اِسْتَوْفَيْنَا", "اِسْتَوْفَيْنَا"]
        },
        101: { 
            base: { emoji: "📦", arText: "يَسْتَوْفِي", trText: "Tamamını alır / Yerine getiriyor." },
            cekimi: ["يَسْتَوْفِي", "يَسْتَوْفِيَانِ", "يَسْتَوْفُونَ", "تَسْتَوْفِي", "تَسْتَوْفِيَانِ", "يَسْتَوْفِينَ", "تَسْتَوْفِي", "تَسْتَوْفِيَانِ", "تَسْتَوْفُونَ", "تَسْتَوْفِينَ", "تَسْتَوْفِيَانِ", "تَسْتَوْفِينَ", "أَسْتَوْفِي", "نَسْتَوْفِي", "نَسْتَوْفِي"]
        },
        102: { 
            base: { emoji: "❗", arText: "اِسْتَوْفِ", trText: "Tamamını al!" },
            cekimi: ["اِسْتَوْفِ", "اِسْتَوْفِيَا", "اِسْتَوْفُوا", "اِسْتَوْفِي", "اِسْتَوْفِيَا", "اِسْتَوْفِينَ"]
        }
    },

    // ==================================================================
    // 33. W-J-D (و ج د) KÖKÜ - Bulmak / Var Olmak
    // 2. Bab (وَجَدَ - يَجِدُ) Misal Fiil
    // ==================================================================
    "وجد": {
        // --- 1, 4, 5 Numaralı Kalıplar (2. Bab - Misal fiil olduğu için muzaride vav düşer) ---
        1: { 
            base: { 
                emoji: "🔍", 
                arText: "وَجَدَ", 
                trText: "Buldu.",
                ornek: { ar: "مَنْ جَدَّ وَجَدَ", tr: "Çalışan (çabalayan) bulur. (Arap Atasözü)" }
            },
            cekimi: ["وَجَدَ", "وَجَدَا", "وَجَدُوا", "وَجَدَتْ", "وَجَدَتَا", "وَجَدْنَ", "وَجَدْتَ", "وَجَدْتُمَا", "وَجَدْتُمْ", "وَجَدْتِ", "وَجَدْتُمَا", "وَجَدْتُنَّ", "وَجَدْتُ", "وَجَدْنَا", "وَجَدْنَا"]
        },
        4: { 
            base: { 
                emoji: "🔎", 
                arText: "يَجِدُ", 
                trText: "Bulur / Buluyor.",
                ornek: [
                    { 
                        ar: "يَجِدُ الطَّالِبُ الْكِتَابَ عَلَى الطَّاوِلَةِ", 
                        tr: "Öğrenci kitabı masada buluyor." 
                    },
                    { 
                        ar: "💡 قَاعِدَة صَرْفِيَّة", 
                        tr: "Sarf Kuralı: Kökün başındaki 'Vav' (و) harfi, 'Misal Fiil' kuralı gereği muzaride düşer (يَوْجِدُ değil, يَجِدُ olur)." 
                    }
                ]
            },
            cekimi: ["يَجِدُ", "يَجِدَانِ", "يَجِدُونَ", "تَجِدُ", "تَجِدَانِ", "يَجِدْنَ", "تَجِدُ", "تَجِدَانِ", "تَجِدُونَ", "تَجِدِينَ", "تَجِدَانِ", "تَجِدْنَ", "أَجِدُ", "نَجِدُ", "نَجِدُ"]
        },
        5: { 
            base: { 
                emoji: "❗", 
                arText: "جِدْ", 
                trText: "Bul!",
                ornek: [
                    { 
                        ar: "جِدْ حَلًّا لِهَذِهِ الْمُشْكِلَةِ", 
                        tr: "Bu soruna bir çözüm bul!" 
                    },
                    { 
                        ar: "💡 قَاعِدَة صَرْفِيَّة", 
                        tr: "Sarf Kuralı: Muzaride düşen 'Vav' harfi, emir kipinde de geri gelmez." 
                    }
                ]
            },
            cekimi: ["جِدْ", "جِدَا", "جِدُوا", "جِدِي", "جِدَا", "جِدْنَ"]
        },

        // --- İsim ve Masdar Kalıpları ---
        25: { 
            base: { 
                emoji: "🌌", 
                arText: "وُجُود", 
                trText: "Varlık / Vücud.",
                ornek: { ar: "نُؤْمِنُ بِوُجُودِ اللهِ", tr: "Allah'ın varlığına (vücuduna) inanıyoruz." }
            } 
        }, 
        29: { 
            base: { 
                emoji: "❤️", 
                arText: "وِجْدَان", 
                trText: "Vicdan.",
                ornek: { ar: "اسْتَمِعْ إِلَى صَوْتِ الْوِجْدَانِ", tr: "Vicdanın sesini dinle." }
            } 
        }, 
        36: { 
            base: { 
                emoji: "✅", 
                arText: "مَوْجُود", 
                trText: "Mevcut / Bulunan.",
                ornek: { ar: "الْبَضَاعَةُ مَوْجُودَةٌ فِي الْمَخْزَنِ", tr: "Mal depoda mevcut (bulunmaktadır)." }
            } 
        }, 
        
        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı - أَوَجَدَ -> أَوْجَدَ) ---
        52: { 
            base: { 
                emoji: "✨", 
                arText: "أَوْجَدَ", 
                trText: "Var etti / İcat etti.",
                ornek: { ar: "أَوْجَدَ الْعَالِمُ عِلَاجًا جَدِيدًا", tr: "Bilim insanı yeni bir tedavi var etti (icat etti)." }
            },
            cekimi: ["أَوْجَدَ", "أَوْجَدَا", "أَوْجَدُوا", "أَوْجَدَتْ", "أَوْجَدَتَا", "أَوْجَدْنَ", "أَوْجَدْتَ", "أَوْجَدْتُمَا", "أَوْجَدْتُمْ", "أَوْجَدْتِ", "أَوْجَدْتُمَا", "أَوْجَدْتُنَّ", "أَوْجَدْتُ", "أَوْجَدْنَا", "أَوْجَدْنَا"]
        },
        53: { 
            base: { 
                emoji: "💡", 
                arText: "يُوجِدُ", 
                trText: "Var eder / İcat ediyor.",
                ornek: { ar: "اللهُ يُوجِدُ الْأَشْيَاءَ مِنَ الْعَدَمِ", tr: "Allah eşyaları yoktan var eder." }
            },
            cekimi: ["يُوجِدُ", "يُوجِدَانِ", "يُوجِدُونَ", "تُوجِدُ", "تُوجِدَانِ", "يُوجِدْنَ", "تُوجِدُ", "تُوجِدَانِ", "تُوجِدُونَ", "تُوجِدِينَ", "تُوجِدَانِ", "تُوجِدْنَ", "أُوجِدُ", "نُوجِدُ", "نُوجِدُ"]
        },
        54: { 
            base: { 
                emoji: "❗", 
                arText: "أَوْجِدْ", 
                trText: "Var et / İcat et!",
                ornek: { ar: "أَوْجِدْ طَرِيقَةً أَسْهَلَ", tr: "Daha kolay bir yöntem icat et (bul/var et)!" }
            },
            cekimi: ["أَوْجِدْ", "أَوْجِدَا", "أَوْجِدُوا", "أَوْجِدِي", "أَوْجِدَا", "أَوْجِدْنَ"]
        },

        // --- 55: İcat (Masdar) Tenvinsiz ---
        55: { 
            base: { 
                emoji: "📜", 
                arText: "إِيجَاد", 
                trText: "İcat / Var etme (Masdar).",
                ornek: [
                    { 
                        ar: "تَمَّ إِيجَادُ الْحَلِّ", 
                        tr: "Çözüm bulundu (çözümün var edilmesi tamamlandı)." 
                    },
                    { 
                        ar: "💡 قَاعِدَة إِمْلَائِيَّة", 
                        tr: "İ'lâl Kuralı: Aslı (إِوْجَاد) şeklindedir. Kökün ilk harfi olan 'Vav' (و), kesradan (esre) sonra sakin geldiği için okuyuş kolaylığı sağlamak adına 'Ye' (ي) harfine dönüşmüştür." 
                    }
                ]
            },
        }, 
        
        // --- 56: Mucit (İsm-i Fail) Tenvinsiz ve Örnek Cümlesiyle ---
        56: { 
            base: { 
                emoji: "🧠", 
                arText: "مُوجِد", 
                trText: "Mucit / İcat eden (İsm-i Fail).",
                ornek: { ar: "مُوجِدُ هَذَا الْجِهَازِ مَعْرُوفٌ", tr: "Bu cihazın mucidi (var edeni) bilinmektedir." }
            },
        }
    },

 // ==================================================================
    // Q-R-A (ق ر أ) KÖKÜ - Okumak / Toplamak
    // 3. Bab (قَرَأَ - يَقْرَأُ) Mehmuz-ul Lâm (Sonu hemzeli fiil)
    // ==================================================================
    "قرأ": {
        // --- 1, 4, 5 Numaralı Kalıplar (3. Bab - Mazi: Fetha, Muzari: Fetha) ---
        1: { 
            base: { 
                emoji: "📖", 
                arText: "قَرَأَ", 
                trText: "Okudu.",
                ornek: { ar: "قَرَأَ الطَّالِبُ الدَّرْسَ", tr: "Öğrenci dersi okudu." }
            },
            cekimi: ["قَرَأَ", "قَرَأَا", "قَرَأُوا", "قَرَأَتْ", "قَرَأَتَا", "قَرَأْنَ", "قَرَأْتَ", "قَرَأْتُمَا", "قَرَأْتُمْ", "قَرَأْتِ", "قَرَأْتُمَا", "قَرَأْتُنَّ", "قَرَأْتُ", "قَرَأْنَا", "قَرَأْنَا"]
        },
        6: { 
            base: { 
                emoji: "🗣️", 
                arText: "يَقْرَأُ", 
                trText: "Okur / Okuyor.",
                ornek: [
                    { 
                        ar: "هُوَ يَقْرَأُ الْقُرْآنَ كُلَّ يَوْمٍ", 
                        tr: "O her gün Kur'an okur." 
                    },
                    { 
                        ar: "💡 قَاعِدَة إِمْلَائِيَّة", 
                        tr: "İmla Kuralı: Hemze, kendinden önceki harfin harekesi fetha (üstün) olduğu için 'Elif' (أ) kürsüsü üzerine yazılır." 
                    }
                ]
            },
            cekimi: ["يَقْرَأُ", "يَقْرَءَانِ", "يَقْرَءُونَ", "تَقْرَأُ", "تَقْرَءَانِ", "يَقْرَأْنَ", "تَقْرَأُ", "تَقْرَءَانِ", "تَقْرَءُونَ", "تَقْرَئِينَ", "تَقْرَءَانِ", "تَقْرَأْنَ", "أَقْرَأُ", "نَقْرَأُ", "نَقْرَأُ"]
        },
        7: { 
            base: { 
                emoji: "❗", 
                arText: "اِقْرَأْ", 
                trText: "Oku!",
                ornek: { ar: "اِقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ", tr: "Yaratan Rabbinin adıyla oku! (Alak Suresi, 1)" }
            },
            cekimi: ["اِقْرَأْ", "اِقْرَءَا", "اِقْرَءُوا", "اِقْرَئِي", "اِقْرَءَا", "اِقْرَأْنَ"]
        },

       
        // --- 23 Numaralı Kalıp (فِعَال) ---
        23: { 
            base: { 
                emoji: "📖", 
                arText: "قِرَاء", 
                trText: "Okuma (Yalın)." 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "📜", 
                arText: "قِرَاءَة", 
                trText: "Okumak / Kıraat (Masdar).",
                ornek: { ar: "قِرَاءَةُ الْكُتُبِ مُفِيدَةٌ", tr: "Kitap okumak faydalıdır." }
            } 
        },
        27: { 
            base: { 
                emoji: "🕋", 
                arText: "قُرْآن", 
                trText: "Çok okunan / Kur'an (Mübalağalı İsim/Masdar).",
                ornek: { ar: "شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ", tr: "Ramazan ayı ki Kur'an onda indirilmiştir. (Bakara Suresi, 185)" }
            } 
        },
        33: { 
            base: { 
                emoji: "👤", 
                arText: "قَارِئ", 
                trText: "Okuyan / Kâri (İsm-i Fail).",
                ornek: [
                    { 
                        ar: "صَوْتُ الْقَارِئِ جَمِيلٌ جِدًّا", 
                        tr: "Okuyucunun (kârinin) sesi çok güzel." 
                    },
                    { 
                        ar: "💡 قَاعِدَة إِمْلَائِيَّة", 
                        tr: "İmla Kuralı: Hemzeden önceki harfin harekesi kesra (esre) olduğu için, hemze 'Ye' (ئ) kürsüsü üzerine yazılmıştır." 
                    }
                ]
            }
        },
        36: { 
            base: { 
                emoji: "✅", 
                arText: "مَقْرُوء", 
                trText: "Okunan / Makrû (İsm-i Meful).",
                ornek: { ar: "هَذَا النَّصُّ مَقْرُوءٌ", tr: "Bu metin okunan (okunabilen/okunmuş) bir metindir." }
            }
        }
    },

     // ==================================================================
    // 61. H-R-M (ح ر م) KÖKÜ - Yasak / Kutsal / Saygı
    // ==================================================================
    "حرم": {
        // --- 11, 12, 13 Numaralı Kalıplar (5. Bab - حَرُمَ / Haram oldu - Kutsal oldu) ---
        11: { 
            base: { emoji: "🚫", arText: "حَرُمَ", trText: "Haram oldu / Yasaklandı." },
            cekimi: ["حَرُمَ", "حَرُمَا", "حَرُمُوا", "حَرُمَتْ", "حَرُمَتَا", "حَرُمْنَ", "حَرُمْتَ", "حَرُمْتُمَا", "حَرُمْتُمْ", "حَرُمْتِ", "حَرُمْتُمَا", "حَرُمْتُنَّ", "حَرُمْتُ", "حَرُمْنَا", "حَرُمْنَا"]
        },
        12: { 
            base: { emoji: "🛑", arText: "يَحْرُمُ", trText: "Haram olur / Yasaktır." },
            cekimi: ["يَحْرُمُ", "يَحْرُمَانِ", "يَحْرُمُونَ", "تَحْرُمُ", "تَحْرُمَانِ", "يَحْرُمْنَ", "تَحْرُمُ", "تَحْرُمَانِ", "تَحْرُمُونَ", "تَحْرُمِينَ", "تَحْرُمَانِ", "تَحْرُمْنَ", "أَحْرُمُ", "نَحْرُمُ", "نَحْرُمُ"]
        },
        13: { 
            base: { emoji: "❗", arText: "اُحْرُمْ", trText: "Haram ol!" },
            cekimi: ["اُحْرُمْ", "اُحْرُمَا", "اُحْرُمُوا", "اُحْرُمِي", "اُحْرُمَا", "اُحْرُمْنَ"]
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { 
                emoji: "🕋", 
                arText: "حَرَم", 
                trText: "Harem / Kutsal ve yasak bölge.",
                ornek: { ar: "الْحَرَمَانِ الشَّرِيفَانِ", tr: "İki şerefli Harem (Mekke ve Medine)." }
            } 
        },

        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            base: { 
                emoji: "🛡️", 
                arText: "حُرْم", 
                trText: "Kutsallık / Yasaklık (Yalın)." 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🙌", 
                arText: "حُرْمَة", 
                trText: "Hürmet / Saygı / Dokunulmazlık.",
                ornek: { ar: "لَهُ حُرْمَةٌ كَبِيرَةٌ فِي الْمُجْتَمَعِ", tr: "Toplumda onun büyük bir hürmeti (saygınlığı) vardır." }
            } 
        },

        // --- 22 Numaralı Kalıp (فَعَال) ---
        22: { 
            base: { 
                emoji: "🚫", 
                arText: "حَرَام", 
                trText: "Haram / Yasaklanmış.",
                ornek: { ar: "الْحَلَالُ بَيِّنٌ وَالْحَرَامُ بَيِّنٌ", tr: "Helal bellidir, haram da bellidir. (Hadis-i Şerif)" }
            } 
        },

        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "🏡", 
                arText: "حَرِيم", 
                trText: "Harim / Girilmesi yasak olan özel alan / Aile.",
                ornek: { ar: "حَرِيمُ الدَّارِ", tr: "Evin özel (mahrem) alanı." }
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "😔", 
                arText: "مَحْرُوم", 
                trText: "Mahrum / Yoksun bırakılmış.",
                ornek: { ar: "وَفِي أَمْوَالِهِمْ حَقٌّ لِلسَّائِلِ وَالْمَحْرُومِ", tr: "Mallarında isteyenin ve mahrumun (yoksulun) bir hakkı vardır. (Zâriyât Suresi, 19)" }
            } 
        },

        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { 
                emoji: "🔒", 
                arText: "مَحْرَم", 
                trText: "Mahrem / Evlenilmesi haram olan / Sırdaş.",
                ornek: { ar: "هَذَا سِرٌّ مَحْرَمٌ", tr: "Bu gizli (mahrem) bir sırdır." }
            } 
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Masdarı) ---
        55: { 
            base: { 
                emoji: "🕋", 
                arText: "إِحْرَام", 
                trText: "İhram / Hac veya umreye niyetlenme.",
                ornek: { ar: "لَبِسَ الْحَاجُّ مَلَابِسَ الْإِحْرَامِ", tr: "Hacı ihram kıyafetlerini giydi." }
            },
            cekimi: ["إِحْرَام"]
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Masdarı) ---
        61: { 
            base: { 
                emoji: "🛑", 
                arText: "تَحْرِيم", 
                trText: "Tahrim / Haram kılma (Tahrim Suresi).",
                ornek: { ar: "سُورَةُ التَّحْرِيمِ فِي الْقُرْآنِ", tr: "Kur'an'da Tahrim (Haram kılma) Suresi." }
            } 
        },

        // --- 63 Numaralı Kalıp (مُفَعَّل - Tef'îl İsm-i Mef'ulü) ---
        63: { 
            base: { 
                emoji: "🌙", 
                arText: "مُحَرَّم", 
                trText: "Muharrem (Haram kılınmış ay).",
                ornek: { ar: "شَهْرُ الْمُحَرَّمِ هُوَ الشَّهْرُ الْأَوَّلُ فِي التَّقْوِيمِ الْهِجْرِيِّ", tr: "Muharrem ayı, Hicri takvimin ilk ayıdır." }
            } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Masdarı) ---
        80: { 
            base: { 
                emoji: "🤝", 
                arText: "اِحْتِرَام", 
                trText: "İhtiram / Saygı göstermek.",
                ornek: { ar: "يَجِبُ احْتِرَامُ الْقَوَانِينِ", tr: "Kanunlara saygı göstermek (ihtiram) gerekir." }
            } 
        },

        // --- 82 Numaralı Kalıp (مُفْتَعَل - İfti'âl İsm-i Mef'ulü) ---
        82: { 
            base: { 
                emoji: "🎩", 
                arText: "مُحْتَرَم", 
                trText: "Muhterem / Saygıdeğer.",
                ornek: { ar: "ضَيْفٌ مُحْتَرَمٌ", tr: "Saygıdeğer (muhterem) bir misafir." }
            } 
        }
    },
      
    // ==================================================================
    // 62. '-R-D (ع ر ض) KÖKÜ - Sunmak / Göstermek / Genişlik / Karşı Çıkmak
    // 2. Bab (فَعَلَ - يَفْعِلُ) ve Zengin Mezid Bablar
    // ==================================================================
    "عرض": {
        // --- 1, 4, 5 Numaralı Kalıplar (2. Bab) ---
        1: { 
            base: { 
                emoji: "📺", 
                arText: "عَرَضَ", 
                trText: "Sunduk / Gösterdi (Arz etti).",
                ornek: { ar: "عَرَضَ الْبَائِعُ بَضَائِعَهُ", tr: "Satıcı mallarını sundu (sergiledi/arz etti)." }
            },
            cekimi: ["عَرَضَ", "عَرَضَا", "عَرَضُوا", "عَرَضَتْ", "عَرَضَتَا", "عَرَضْنَ", "عَرَضْتَ", "عَرَضْتُمَا", "عَرَضْتُمْ", "عَرَضْتِ", "عَرَضْتُمَا", "عَرَضْتُنَّ", "عَرَضْتُ", "عَرَضْنَا", "عَرَضْنَا"]
        },
        4: { 
            base: { 
                emoji: "🎞️", 
                arText: "يَعْرِضُ", 
                trText: "Sunar / Gösteriyor.",
                ornek: { ar: "الشَّاشَةُ تَعْرِضُ فِيلْمًا جَدِيدًا", tr: "Ekran yeni bir film gösteriyor (sunuyor/arz ediyor)." }
            },
            cekimi: ["يَعْرِضُ", "يَعْرِضَانِ", "يَعْرِضُونَ", "تَعْرِضُ", "تَعْرِضَانِ", "يَعْرِضْنَ", "تَعْرِضُ", "تَعْرِضَانِ", "تَعْرِضُونَ", "تَعْرِضِينَ", "تَعْرِضَانِ", "تَعْرِضْنَ", "أَعْرِضُ", "نَعْرِضُ", "نَعْرِضُ"]
        },
        5: { 
            base: { 
                emoji: "❗", 
                arText: "اِعْرِضْ", 
                trText: "Sun / Göster / Arz et!"
            },
            cekimi: ["اِعْرِضْ", "اِعْرِضَا", "اِعْرِضُوا", "اِعْرِضِي", "اِعْرِضَا", "اِعْرِضْنَ"]
        },

        // --- İsim ve Masdar Kalıpları ---
        17: { 
            base: { 
                emoji: "🍂", 
                arText: "عَرَض", 
                trText: "Geçici durum / Belirti (Araz).",
                ornek: { ar: "مَتَاعُ الدُّنْيَا عَرَضٌ زَائِلٌ", tr: "Dünya malı geçici bir arazdır (tükenen bir belirtidir)." }
            } 
        }, 
      
        // --- 19 Numaralı Kalıp (فَعْل - Masdar/İsim) ---
        19: { 
            base: { 
                emoji: "📏", 
                arText: "عَرْض", 
                trText: "Genişlik (En) / Teklif (Arz).",
                ornek: [
                    { ar: "طُولٌ وَعَرْضٌ", tr: "Boy ve en (genişlik)." },
                    { ar: "عَرْضٌ خَاصٌّ لِلزَّبَائِنِ", tr: "Müşteriler için özel teklif (arz)." }
                ]
            } 
        },

        // --- 26 Numaralı Kalıp (فَعُول - İsim / Edebi Terim) ---
        // (Sistemindeki فَعُول kalıp numaran farklıysa numarayı kendi sistemine göre güncelleyebilirsin)
        26: { 
            base: { 
                emoji: "📜", 
                arText: "عَرُوض", 
                trText: "Aruz / Şiir ölçüsü bilimi, vezin kuralları.",
                ornek: [
                    { 
                        ar: "عِلْمُ الْعَرُوضِ", 
                        tr: "Aruz ilmi (Şiirin vezinlerini ve ritmini inceleyen edebi bilim dalı)." 
                    },
                    { 
                        ar: "💡 مَعْلُومَة اشْتِقَاقِيَّة (١): عَرْضُ الشِّعْرِ", 
                        tr: "1. Şiiri Ölçüye 'Arz Etmek': Şairin yazdığı şiir, doğru mu yoksa hatalı mı (kırık mı) olduğunu anlamak için bu ölçü kurallarına 'arz edilir' (sunulur). Yani Aruz, şiirin doğruluğunun test edildiği bir mihenk taşıdır." 
                    },
                    { 
                        ar: "💡 مَعْلُومَة اشْتِقَاقِيَّة (٢): عَمُودُ الْخَيْمَةِ", 
                        tr: "2. Çadırın 'Enine' Konan Ana Direği: Bedevi kültüründe, çadırı ayakta tutan ve enine uzanan sağlam ana direğe 'Aruz' denir. Şiir de kelimelerden örülmüş bir çadır (Beyt) gibidir. Şiirin çökmesini engelleyen ana direk onun veznidir." 
                    },
                    { 
                        ar: "💡 مَعْلُومَة اشْتِقَاقِيَّة (٣): الظُّهُورُ وَالْبُرُوزُ", 
                        tr: "3. Önüne Çıkan, Görünen Şey (Engel): Kökün bir diğer anlamı 'karşıya çıkan, beliren' şeydir. Şiir okunduğunda, ritimdeki müzikalite kulağa 'arz olur' (kendini gösterir). Aruz ilmi de kulağa çarpan bu ritmik engellerin ve durakların matematiğidir." 
                    }
                ]
            } 
        },
    
        33: { 
            base: { 
                emoji: "🌩️", 
                arText: "عَارِض", 
                trText: "Engel / Arız olan şey.",
                ornek: { ar: "حَدَثَ لَهُ عَارِضٌ صِحِّيٌّ", tr: "Başına bir sağlık engeli geldi." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "⚠️", 
                arText: "عَارِضَة", 
                trText: "Arıza / Beklenmedik engel." 
            },
            "يّ": {
                emoji: "🍂",
                arText: "عَارِضِيّ",
                trText: "Arızi / Geçici / Tesadüfi."
            }
        },
        35: { 
            base: { 
                emoji: "🛣️", 
                arText: "عَرِيض", 
                trText: "Geniş / Yayvan.",
                ornek: { ar: "شَارِعٌ طَوِيلٌ وَعَرِيضٌ", tr: "Uzun ve geniş bir cadde." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "📝", 
                arText: "عَرِيضَة", 
                trText: "Dilekçe (Geniş çaplı arz/sunum)."
            }
        }, 
        36: {
            base: {
                emoji: "🎯",
                arText: "مَعْرُوض",
                trText: "Sunulan / Arz edilen / Mâruz.",
                ornek: { ar: "الْمُشْكِلَةُ مَعْرُوضَةٌ عَلَى الْمُدِيرِ", tr: "Sorun müdüre sunulmuştur (maruzdur/arz edilmiştir)." }
            }
        },
        37: { 
            base: { 
                emoji: "🖼️", 
                arText: "مَعْرِض", 
                trText: "Sergi / Fuar.",
                ornek: { ar: "مَعْرِضُ الْكِتَابِ الدَّوْلِيِّ", tr: "Uluslararası kitap fuarı (sergisi)." }
            }
        }, 
        
        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı - Yüz çevirmek) ---
        52: { 
            base: { 
                emoji: "撇", 
                arText: "أَعْرَضَ", 
                trText: "Yüz çevirdi / İlgilenmedi.",
                ornek: { ar: "أَعْرَضَ عَنِ الْجَاهِلِينَ", tr: "Cahillerden yüz çevirdi." }
            },
            cekimi: ["أَعْرَضَ", "أَعْرَضَا", "أَعْرَضُوا", "أَعْرَضَتْ", "أَعْرَضَتَا", "أَعْرَضْنَ", "أَعْرَضْتَ", "أَعْرَضْتُمَا", "أَعْرَضْتُمْ", "أَعْرَضْتِ", "أَعْرَضْتُمَا", "أَعْرَضْتُنَّ", "أَعْرَضْتُ", "أَعْرَضْنَا", "أَعْرَضْنَا"]
        },
        53: { 
            base: { 
                emoji: "🚶‍♂️", 
                arText: "يُعْرِضُ", 
                trText: "Yüz çevirir / İlgilenmiyor."
            },
            cekimi: ["يُعْرِضُ", "يُعْرِضَانِ", "يُعْرِضُونَ", "تُعْرِضُ", "تُعْرِضَانِ", "يُعْرِضْنَ", "تُعْرِضُ", "تُعْرِضَانِ", "تُعْرِضُونَ", "تُعْرِضِينَ", "تُعْرِضَانِ", "تُعْرِضْنَ", "أُعْرِضُ", "نُعْرِضُ", "نُعْرِضُ"]
        },
        54: { 
            base: { 
                emoji: "❗", 
                arText: "أَعْرِضْ", 
                trText: "Yüz çevir!"
            },
            cekimi: ["أَعْرِضْ", "أَعْرِضَا", "أَعْرِضُوا", "أَعْرِضِي", "أَعْرِضَا", "أَعْرِضْنَ"]
        },
        55: { 
            base: { 
                emoji: "🚫", 
                arText: "إِعْرَاض", 
                trText: "Yüz çevirme / Sırt dönme.",
                ornek: { ar: "الْإِعْرَاضُ عَنِ اللَّغْوِ صِفَةُ الْمُؤْمِنِ", tr: "Boş sözden yüz çevirmek (i'raz etmek) müminin sıfatıdır." }
            }
        },

        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı - Muhalefet etmek) ---
        64: {
            base: { emoji: "🙅", arText: "عَارَضَ", trText: "Karşı çıktı / Muhalefet etti." },
            cekimi: ["عَارَضَ", "عَارَضَا", "عَارَضُوا", "عَارَضَتْ", "عَارَضَتَا", "عَارَضْنَ", "عَارَضْتَ", "عَارَضْتُمَا", "عَارَضْتُمْ", "عَارَضْتِ", "عَارَضْتُمَا", "عَارَضْتُنَّ", "عَارَضْتُ", "عَارَضْنَا", "عَارَضْنَا"]
        },
        65: {
            base: { emoji: "🗣️", arText: "يُعَارِضُ", trText: "Karşı çıkar / Muhalefet ediyor." },
            cekimi: ["يُعَارِضُ", "يُعَارِضَانِ", "يُعَارِضُونَ", "تُعَارِضُ", "تُعَارِضَانِ", "يُعَارِضْنَ", "تُعَارِضُ", "تُعَارِضَانِ", "تُعَارِضُونَ", "تُعَارِضِينَ", "تُعَارِضَانِ", "تُعَارِضْنَ", "أُعَارِضُ", "نُعَارِضُ", "نُعَارِضُ"]
        },
        66: {
            base: { emoji: "❗", arText: "عَارِضْ", trText: "Karşı çık / Muhalefet et!" },
            cekimi: ["عَارِضْ", "عَارِضَا", "عَارِضُوا", "عَارِضِي", "عَارِضَا", "عَارِضْنَ"]
        },
        67: {
            base: {
                emoji: "⚔️",
                arText: "مُعَارَضَة",
                trText: "Muhalefet / Karşı çıkma.",
                ornek: { ar: "حِزْبُ الْمُعَارَضَةِ يَنْتَقِدُ الْقَرَارَ", tr: "Muhalefet partisi kararı eleştiriyor." }
            }
        },
        69: {
            base: { emoji: "👤", arText: "مُعَارِض", trText: "Muhalif / Karşı çıkan." }
        },

        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı - İtiraz etmek / Engel olmak) ---
        77: {
            base: {
                emoji: "✋",
                arText: "اِعْتَرَضَ",
                trText: "İtiraz etti / Karşı durdu.",
                ornek: { ar: "اِعْتَرَضَ عَلَى الْحُكْمِ", tr: "Hükme (karara) itiraz etti." }
            },
            cekimi: ["اِعْتَرَضَ", "اِعْتَرَضَا", "اِعْتَرَضُوا", "اِعْتَرَضَتْ", "اِعْتَرَضَتَا", "اِعْتَرَضْنَ", "اِعْتَرَضْتَ", "اِعْتَرَضْتُمَا", "اِعْتَرَضْتُمْ", "اِعْتَرَضْتِ", "اِعْتَرَضْتُمَا", "اِعْتَرَضْتُنَّ", "اِعْتَرَضْتُ", "اِعْتَرَضْنَا", "اِعْتَرَضْنَا"]
        },
        78: {
            base: { emoji: "🛑", arText: "يَعْتَرِضُ", trText: "İtiraz eder / Engel olur." },
            cekimi: ["يَعْتَرِضُ", "يَعْتَرِضَانِ", "يَعْتَرِضُونَ", "تَعْتَرِضُ", "تَعْتَرِضَانِ", "يَعْتَرِضْنَ", "تَعْتَرِضُ", "تَعْتَرِضَانِ", "تَعْتَرِضُونَ", "تَعْتَرِضِينَ", "تَعْتَرِضَانِ", "تَعْتَرِضْنَ", "أَعْتَرِضُ", "نَعْتَرِضُ", "نَعْتَرِضُ"]
        },
        79: {
            base: { emoji: "❗", arText: "اِعْتَرِضْ", trText: "İtiraz et!" },
            cekimi: ["اِعْتَرِضْ", "اِعْتَرِضَا", "اِعْتَرِضُوا", "اِعْتَرِضِي", "اِعْتَرِضَا", "اِعْتَرِضْنَ"]
        },
        80: {
            base: {
                emoji: "📜",
                arText: "اِعْتِرَاض",
                trText: "İtiraz / Karşı gelme.",
                ornek: { ar: "قَدَّمَ الْمُحَامِي لَائِحَةَ اعْتِرَاضٍ", tr: "Avukat bir itiraz dilekçesi sundu." }
            }
        },

        // --- 88, 89, 90, 91 Numaralı Kalıplar (Tefe'ul Babı - Maruz kalmak / Taarruz etmek) ---
        88: {
            base: { 
                emoji: "⚔️", 
                arText: "تَعَرَّضَ", 
                trText: "Maruz kaldı / Taarruz etti.",
                ornek: { ar: "تَعَرَّضَ لِحَادِثِ سَيْرٍ", tr: "Trafik kazasına maruz kaldı." }
            },
            cekimi: ["تَعَرَّضَ", "تَعَرَّضَا", "تَعَرَّضُوا", "تَعَرَّضَتْ", "تَعَرَّضَتَا", "تَعَرَّضْنَ", "تَعَرَّضْتَ", "تَعَرَّضْتُمَا", "تَعَرَّضْتُمْ", "تَعَرَّضْتِ", "تَعَرَّضْتُمَا", "تَعَرَّضْتُنَّ", "تَعَرَّضْتُ", "تَعَرَّضْنَا", "تَعَرَّضْنَا"]
        },
        89: {
            base: { emoji: "🛡️", arText: "يَتَعَرَّضُ", trText: "Maruz kalır / Taarruz ediyor." },
            cekimi: ["يَتَعَرَّضُ", "يَتَعَرَّضَانِ", "يَتَعَرَّضُونَ", "تَتَعَرَّضُ", "تَتَعَرَّضَانِ", "يَتَعَرَّضْنَ", "تَتَعَرَّضُ", "تَتَعَرَّضَانِ", "تَتَعَرَّضُونَ", "تَتَعَرَّضِينَ", "تَتَعَرَّضَانِ", "تَتَعَرَّضْنَ", "أَتَعَرَّضُ", "نَتَعَرَّضُ", "نَتَعَرَّضُ"]
        },
        90: {
            base: { emoji: "❗", arText: "تَعَرَّضْ", trText: "Maruz kal / Taarruz et!" },
            cekimi: ["تَعَرَّضْ", "تَعَرَّضَا", "تَعَرَّضُوا", "تَعَرَّضِي", "تَعَرَّضَا", "تَعَرَّضْنَ"]
        },
        91: {
            base: {
                emoji: "🎯",
                arText: "تَعَرُّض",
                trText: "Taarruz / Maruz kalma.",
                ornek: { ar: "التَّعَرُّضُ لِأَشِعَّةِ الشَّمْسِ مُفِيدٌ", tr: "Güneş ışınlarına maruz kalmak faydalıdır." }
            }
        },

        // --- 100, 101 Numaralı Kalıplar (İstif'âl Babı - Gözden geçirmek / Geçit töreni yapmak) ---
        100: {
            base: { emoji: "👁️", arText: "اِسْتَعْرَضَ", trText: "Gözden geçirdi / Teftiş etti." },
            cekimi: ["اِسْتَعْرَضَ", "اِسْتَعْرَضَا", "اِسْتَعْرَضُوا", "اِسْتَعْرَضَتْ", "اِسْتَعْرَضَتَا", "اِسْتَعْرَضْنَ", "اِسْتَعْرَضْتَ", "اِسْتَعْرَضْتُمَا", "اِسْتَعْرَضْتُمْ", "اِسْتَعْرَضْتِ", "اِسْتَعْرَضْتُمَا", "اِسْتَعْرَضْتُنَّ", "اِسْتَعْرَضْتُ", "اِسْتَعْرَضْنَا", "اِسْتَعْرَضْنَا"]
        },
        101: {
            base: { emoji: "📋", arText: "يَسْتَعْرِضُ", trText: "Gözden geçirir." },
            cekimi: ["يَسْتَعْرِضُ", "يَسْتَعْرِضَانِ", "يَسْتَعْرِضُونَ", "تَسْتَعْرِضُ", "تَسْتَعْرِضَانِ", "يَسْتَعْرِضْنَ", "تَسْتَعْرِضُ", "تَسْتَعْرِضَانِ", "تَسْتَعْرِضُونَ", "تَسْتَعْرِضِينَ", "تَسْتَعْرِضَانِ", "تَسْتَعْرِضْنَ", "أَسْتَعْرِضُ", "نَسْتَعْرِضُ", "نَسْتَعْرِضُ"]
        },
        103: {
            base: {
                emoji: "🎖️",
                arText: "اِسْتِعْرَاض",
                trText: "Geçit töreni / Gözden geçirme.",
                ornek: { ar: "اِسْتِعْرَاضٌ عَسْكَرِيٌّ", tr: "Askeri geçit töreni." }
            }
        }
    },

     // ==================================================================
    // 63. Q-B-L (ق ب ل) KÖKÜ - Kabul Etmek / Yönelmek / Karşılamak / Gelecek
    // (Sadece en çok kullanılan türemeler eklenmiştir)
    // ==================================================================
    "قبل": {
        // --- 8, 9, 10 Numaralı Kalıplar (4. Bab - Sülasi Mücerred) ---
        8: { 
            base: { emoji: "✅", arText: "قَبِلَ", trText: "Kabul etti." },
            cekimi: ["قَبِلَ", "قَبِلَا", "قَبِلُوا", "قَبِلَتْ", "قَبِلَتَا", "قَبِلْنَ", "قَبِلْتَ", "قَبِلْتُمَا", "قَبِلْتُمْ", "قَبِلْتِ", "قَبِلْتُمَا", "قَبِلْتُنَّ", "قَبِلْتُ", "قَبِلْنَا", "قَبِلْنَا"]
        },
        9: { 
            base: { emoji: "🤝", arText: "يَقْبَلُ", trText: "Kabul eder / Kabul ediyor." },
            cekimi: ["يَقْبَلُ", "يَقْبَلَانِ", "يَقْبَلُونَ", "تَقْبَلُ", "تَقْبَلَانِ", "يَقْبَلْنَ", "تَقْبَلُ", "تَقْبَلَانِ", "تَقْبَلُونَ", "تَقْبَلِينَ", "تَقْبَلَانِ", "تَقْبَلْنَ", "أَقْبَلُ", "نَقْبَلُ", "نَقْبَلُ"]
        },
        10: { 
            base: { emoji: "❗", arText: "اِقْبَلْ", trText: "Kabul et!" },
            cekimi: ["اِقْبَلْ", "اِقْبَلَا", "اِقْبَلُوا", "اِقْبَلِي", "اِقْبَلَا", "اِقْبَلْنَ"]
        },

        // --- 26 Numaralı Kalıp (فَعُول) ---
        26: { 
            base: { 
                emoji: "✔️", 
                arText: "قَبُول", 
                trText: "Kabul / Onay.",
                ornek: { ar: "تَمَّ قَبُولُ الطَّلَبِ", tr: "Başvuru kabul edildi." }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { 
                emoji: "👍", 
                arText: "قَابِل", 
                trText: "Kabul eden / Mümkün (Kabil)." 
            },
            suggestsPlus: true,
            "يَّة": { 
                emoji: "🧠", 
                arText: "قَابِلِيَّة", 
                trText: "Kabiliyet / Yetenek.",
                ornek: { ar: "لَدَيْهِ قَابِلِيَّةٌ لِتَعَلُّـمِ اللُّغَاتِ", tr: "Diller öğrenmeye kabiliyeti var." }
            }
        },

        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "👥", 
                arText: "قَبِيل", 
                trText: "Kategori / Tür / Taraf." 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "⛺", 
                arText: "قَبِيلَة", 
                trText: "Kabile / Boy.",
                ornek: { 
                    ar: "وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا", 
                    tr: "Sizi tanışmanız için milletlere ve kabilelere ayırdık. (Hucurât Suresi, 13)" 
                }
            }
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Masdarı) ---
        55: { 
            base: { 
                emoji: "🌟", 
                arText: "إِقْبَال", 
                trText: "İkbal / Yönelme / İlgi.",
                ornek: { ar: "هُنَاكَ إِقْبَالٌ كَبِيرٌ عَلَى الْمَعْرِضِ", tr: "Fuara büyük bir ilgi (ikbal / yönelme) var." }
            } 
        },

          // --- 67 Numaralı Kalıp (مُفَاعَلَة - Müfâ'ale Masdarı) ---
        67: { 
            base: { 
                emoji: "📖", 
                arText: "مُقَابَلَة", 
                trText: "Karşılık verme / Röportaj / Mukabele.",
                ornek: [
                    { 
                        ar: "نَقْرَأُ الْقُرْآنَ بِطَرِيقَةِ الْمُقَابَلَةِ فِي شَهْرِ رَمَضَانَ", 
                        tr: "Ramazan ayında Kur'an'ı mukabele (karşılıklı okuma) usulüyle okuruz." 
                    },
                    { 
                        ar: "أَجْرَى مُقَابَلَةً صَحَفِيَّةً", 
                        tr: "Bir gazete röportajı (mukabelesi) yaptı." 
                    }
                ]
            } 
        },

        // --- 69 Numaralı Kalıp (مُفَاعِل - Müfâ'ale İsm-i Faili) ---
        69: { 
            base: { 
                emoji: "🔄", 
                arText: "مُقَابِل", 
                trText: "Karşılık / Mukabil.",
                ornek: { ar: "عَمِلَ ذَٰلِكَ بِمُقَابِلٍ مَادِّيٍّ", tr: "Bunu maddi bir karşılıkla (mukabille) yaptı." }
            } 
        },

        // --- 88, 89, 90 Numaralı Kalıplar (Tefe'ul Babı - Lütfedip kabul etmek / Tekabbel) ---
        88: { 
            base: { 
                emoji: "🤲", 
                arText: "تَقَبَّلَ", 
                trText: "Kabul etti (Lütfedip kabul buyurdu).",
                ornek: { 
                    ar: "تَقَبَّلَ اللهُ مِنَّا وَمِنْكُمْ", 
                    tr: "Allah bizden ve sizden kabul etsin (Tekabbelallah)." 
                }
            },
            cekimi: ["تَقَبَّلَ", "تَقَبَّلَا", "تَقَبَّلُوا", "تَقَبَّلَتْ", "تَقَبَّلَتَا", "تَقَبَّلْنَ", "تَقَبَّلْتَ", "تَقَبَّلْتُمَا", "تَقَبَّلْتُمْ", "تَقَبَّلْتِ", "تَقَبَّلْتُمَا", "تَقَبَّلْتُنَّ", "تَقَبَّلْتُ", "تَقَبَّلْنَا", "تَقَبَّلْنَا"]
        },
        89: { 
            base: { 
                emoji: "✨", 
                arText: "يَتَقَبَّلُ", 
                trText: "Kabul eder / Kabul buyurur.",
                ornek: { 
                    ar: "إِنَّمَا يَتَقَبَّلُ اللهُ مِنَ الْمُتَّقِينَ", 
                    tr: "Allah ancak takva sahiplerinden (müttakilerden) kabul eder. (Mâide Suresi, 27)" 
                }
            },
            cekimi: ["يَتَقَبَّلُ", "يَتَقَبَّلَانِ", "يَتَقَبَّلُونَ", "تَتَقَبَّلُ", "تَتَقَبَّلَانِ", "يَتَقَبَّلْنَ", "تَتَقَبَّلُ", "تَتَقَبَّلَانِ", "تَتَقَبَّلُونَ", "تَتَقَبَّلِينَ", "تَتَقَبَّلَانِ", "تَتَقَبَّلْنَ", "أَتَقَبَّلُ", "نَتَقَبَّلُ", "نَتَقَبَّلُ"]
        },
        90: { 
            base: { 
                emoji: "❗", 
                arText: "تَقَبَّلْ", 
                trText: "Kabul et / Kabul buyur!",
                ornek: { 
                    ar: "رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ", 
                    tr: "Rabbimiz! Bizden kabul buyur. Şüphesiz sen hakkıyla işitensin, hakkıyla bilensin. (Bakara Suresi, 127)" 
                }
            },
            cekimi: ["تَقَبَّلْ", "تَقَبَّلَا", "تَقَبَّلُوا", "تَقَبَّلِي", "تَقَبَّلَا", "تَقَبَّلْنَ"]
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - İstif'âl Masdarı) ---
        103: { 
            base: { 
                emoji: "🚀", 
                arText: "اِسْتِقْبَال", 
                trText: "Karşılama / Gelecek (İstikbal).",
                ornek: { ar: "اِسْتِقْبَالُ الضُّيُوفِ بِحَفَاوَةٍ", tr: "Misafirleri sıcak bir şekilde karşılama (istikbal etme)." }
            } 
        },

        // --- 105 Numaralı Kalıp (مُسْتَفْعَل - İstif'âl İsm-i Mef'ûlü) ---
        105: { 
            base: { 
                emoji: "🔮", 
                arText: "مُسْتَقْبَل", 
                trText: "Müstakbel / Gelecek zaman.",
                ornek: { ar: "نَتَمَنَّى لَكُمْ مُسْتَقْبَلًا بَاهِرًا", tr: "Size parlak bir gelecek (müstakbel) dileriz." }
            } 
        }
    },
        // ==================================================================
    // 64. K-R-M (ك ر م) KÖKÜ - Cömert Olmak / Onur / İkram
    // 5. Bab (فَعُلَ - يَفْعُلُ) ve İlgili Mezid Bablar
    // ==================================================================
    "كرم": {
        // --- 11, 12, 13 Numaralı Kalıplar (5. Bab - حَرُمَ gibi) ---
        11: { 
            base: { emoji: "🤲", arText: "كَرُمَ", trText: "Cömert oldu / Değerli oldu." },
            cekimi: ["كَرُمَ", "كَرُمَا", "كَرُمُوا", "كَرُمَتْ", "كَرُمَتَا", "كَرُمْنَ", "كَرُمْتَ", "كَرُمْتُمَا", "كَرُمْتُمْ", "كَرُمْتِ", "كَرُمْتُمَا", "كَرُمْتُنَّ", "كَرُمْتُ", "كَرُمْنَا", "كَرُمْنَا"]
        },
        12: { 
            base: { emoji: "✨", arText: "يَكْرُمُ", trText: "Cömert olur / Değerlidir." },
            cekimi: ["يَكْرُمُ", "يَكْرُمَانِ", "يَكْرُمُونَ", "تَكْرُمُ", "تَكْرُمَانِ", "يَكْرُمْنَ", "تَكْرُمُ", "تَكْرُمَانِ", "تَكْرُمُونَ", "تَكْرُمِينَ", "تَكْرُمَانِ", "تَكْرُمْنَ", "أَكْرُمُ", "نَكْرُمُ", "نَكْرُمُ"]
        },
        13: { 
            base: { emoji: "❗", arText: "اُكْرُمْ", trText: "Cömert ol / Değerli ol!" },
            cekimi: ["اُكْرُمْ", "اُكْرُمَا", "اُكْرُمُوا", "اُكْرُمِي", "اُكْرُمَا", "اُكْرُمْنَ"]
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { 
                emoji: "💎", 
                arText: "كَرَم", 
                trText: "Kerem / Cömertlik / Lütuf.",
                ornek: { ar: "هَذَا مِنْ كَرَمِ أَخْلَاقِكَ", tr: "Bu senin ahlakının cömertliğindendir (keremindendir)." }
            } 
        },

        // --- 22 Numaralı Kalıp (فَعَال) ---
        22: { 
            base: { 
                emoji: "👑", 
                arText: "كَرَام", 
                trText: "Değer / Yücelik (Yalın)." 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🌟", 
                arText: "كَرَامَة", 
                trText: "Keramet / Onur / Saygınlık.",
                ornek: { ar: "كَرَامَةُ الْإِنْسَانِ فَوْقَ كُلِّ شَيْءٍ", tr: "İnsan onuru (kerameti) her şeyin üstündedir." }
            } 
        },

        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "🤍", 
                arText: "كَرِيم", 
                trText: "Kerim / Cömert / Değerli.",
                ornek: [
                    
                    { ar: "إِنَّهُ قُرْآنٌ كَرِيمٌ", tr: "Şüphesiz o, değerli (kerim) bir Kur'an'dır. (Vâkıa Suresi, 77)" }
                ]
            },
            suggestsPlus: true,
            "ة": {
                emoji: "🧕",
                arText: "كَرِيمَة",
                trText: "Kerime / Değerli (Kadın) / Kız evlat.",
                ornek: { ar: "هِيَ ابْنَتِي الْكَرِيمَةُ", tr: "O benim değerli kızımdır (kerimemdir)." }
            }
        },

        // --- 50 Numaralı Kalıp (أَفْعَل - İsm-i Tafdil) ---
        50: { 
            base: { 
                emoji: "🥇", 
                arText: "أَكْرَم", 
                trText: "Ekrem / En cömert / En şerefli.",
                ornek: { ar: "اِقْرَأْ وَرَبُّكَ الْأَكْرَمُ", tr: "Oku! Senin Rabbin en cömert olandır (Ekrem'dir). (Alak Suresi, 3)" }
            } 
        },

        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı - İkram Etmek) ---
        52: { 
            base: { emoji: "🎁", arText: "أَكْرَمَ", trText: "İkram etti / Ağırladı." },
            cekimi: ["أَكْرَمَ", "أَكْرَمَا", "أَكْرَمُوا", "أَكْرَمَتْ", "أَكْرَمَتَا", "أَكْرَمْنَ", "أَكْرَمْتَ", "أَكْرَمْتُمَا", "أَكْرَمْتُمْ", "أَكْرَمْتِ", "أَكْرَمْتُمَا", "أَكْرَمْتُنَّ", "أَكْرَمْتُ", "أَكْرَمْنَا", "أَكْرَمْنَا"]
        },
        53: { 
            base: { emoji: "☕", arText: "يُكْرِمُ", trText: "İkram eder / Ağırlıyor." },
            cekimi: ["يُكْرِمُ", "يُكْرِمَانِ", "يُكْرِمُونَ", "تُكْرِمُ", "تُكْرِمَانِ", "يُكْرِمْنَ", "تُكْرِمُ", "تُكْرِمَانِ", "تُكْرِمُونَ", "تُكْرِمِينَ", "تُكْرِمَانِ", "تُكْرِمْنَ", "أُكْرِمُ", "نُكْرِمُ", "نُكْرِمُ"]
        },
        54: { 
            base: { emoji: "❗", arText: "أَكْرِمْ", trText: "İkram et / Değer ver!" },
            cekimi: ["أَكْرِمْ", "أَكْرِمَا", "أَكْرِمُوا", "أَكْرِمِي", "أَكْرِمَا", "أَكْرِمْنَ"]
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Masdarı) ---
        55: { 
            base: { 
                emoji: "🍰", 
                arText: "إِكْرَام", 
                trText: "İkram / Ağırlama / Saygı gösterme.",
                ornek: { ar: "إِكْرَامُ الضَّيْفِ وَاجِبٌ", tr: "Misafire ikram etmek görevdir." }
            },
            suggestsPlus: true,
            "يَّة": { 
                emoji: "💰", 
                arText: "إِكْرَامِيَّة", 
                trText: "Bahşiş / İkramiye." 
            }
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Masdarı) ---
        61: { 
            base: { 
                emoji: "🎖️", 
                arText: "تَكْرِيم", 
                trText: "Tekrim / Onurlandırma / Saygı.",
                ornek: { ar: "حَفْلُ تَكْرِيمٍ لِلنَّاجِحِينَ", tr: "Başarılı olanlar için onurlandırma (ödül/tekrim) töreni." }
            } 
        },

        // --- 63 Numaralı Kalıp (مُفَعَّل - Tef'îl İsm-i Mef'ulü) ---
        63: { 
            base: { 
                emoji: "🏆", 
                arText: "مُكَرَّم", 
                trText: "Mükerrem / Saygıdeğer / Onurlandırılmış.",
                ornek: { ar: "ضَيْفٌ مُكَرَّمٌ", tr: "Saygıdeğer (mükerrem) misafir." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🕋", 
                arText: "مُكَرَّمَة", 
                trText: "Saygıdeğer / Mükerreme (Dişil).",
                ornek: { ar: "الْكَعْبَةُ الْمُكَرَّمَةُ", tr: "Kâbe-i Mükerreme (Saygıdeğer Kâbe)." }
            }
        }
    },


      // ==================================================================
    // 65. '-B-R (ع ب ر) KÖKÜ - Geçmek / İfade Etmek / İbret Almak
    // 1. Bab (فَعَلَ - يَفْعُلُ), Tef'îl ve İfti'âl Babları
    // ==================================================================
    "عبر": {
        // --- 1, 2, 3 Numaralı Kalıplar (1. Bab - Karşıya Geçmek) ---
        1: { 
            base: { 
                emoji: "🚶‍♂️", 
                arText: "عَبَرَ", 
                trText: "Geçti / Karşıya geçti.",
                ornek: { ar: "عَبَرَ النَّهْرَ", tr: "Nehri (karşıya) geçti." }
            },
            cekimi: ["عَبَرَ", "عَبَرَا", "عَبَرُوا", "عَبَرَتْ", "عَبَرَتَا", "عَبَرْنَ", "عَبَرْتَ", "عَبَرْتُمَا", "عَبَرْتُمْ", "عَبَرْتِ", "عَبَرْتُمَا", "عَبَرْتُنَّ", "عَبَرْتُ", "عَبَرْنَا", "عَبَرْنَا"]
        },
        2: { 
            base: { 
                emoji: "🌉", 
                arText: "يَعْبُرُ", 
                trText: "Geçer / Karşıya geçiyor.",
                ornek: { ar: "يَعْبُرُ الطَّرِيقَ بِحَذَرٍ", tr: "Yolu dikkatlice geçiyor." }
            },
            cekimi: ["يَعْبُرُ", "يَعْبُرَانِ", "يَعْبُرُونَ", "تَعْبُرُ", "تَعْبُرَانِ", "يَعْبُرْنَ", "تَعْبُرُ", "تَعْبُرَانِ", "تَعْبُرُونَ", "تَعْبُرِينَ", "تَعْبُرَانِ", "تَعْبُرْنَ", "أَعْبُرُ", "نَعْبُرُ", "نَعْبُرُ"]
        },
        3: { 
            base: { emoji: "❗", arText: "اُعْبُرْ", trText: "Geç!" },
            cekimi: ["اُعْبُرْ", "اُعْبُرَا", "اُعْبُرُوا", "اُعْبُرِي", "اُعْبُرَا", "اُعْبُرْنَ"]
        },

        // --- İsim ve Masdar Kalıpları ---
        20: { 
            base: { 
                emoji: "💡", 
                arText: "عِبْر", 
                trText: "İbret (Yalın)." 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "📖", 
                arText: "عِبْرَة", 
                trText: "İbret / Ders.",
                ornek: { ar: "إِنَّ فِي ذَٰلِكَ لَعِبْرَةً لِمَن يَخْشَىٰ", tr: "Şüphesiz bunda korkan kimse için bir ibret vardır. (Nâziât Suresi, 26)" }
            } 
        },
        23: { 
            base: { 
                emoji: "💬", 
                arText: "عِبَار", 
                trText: "İfade (Yalın)." 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "📝", 
                arText: "عِبَارَة", 
                trText: "İbare / Cümle / Söz.",
                ornek: { ar: "هَذِهِ عِبَارَةٌ جَمِيلَةٌ", tr: "Bu güzel bir ibaredir (cümledir)." }
            } 
        },
        25: { 
            base: { 
                emoji: "🚶‍♂️", 
                arText: "عُبُور", 
                trText: "Geçiş / Geçmek.",
                ornek: { ar: "مَمْنُوعُ الْعُبُورِ", tr: "Geçiş yasaktır." }
            } 
        },
        33: { 
            base: { 
                emoji: "🌬️", 
                arText: "عَابِر", 
                trText: "Geçen / Geçici.",
                ornek: { ar: "نَحْنُ فِي الدُّنْيَا عَابِرُو سَبِيلٍ", tr: "Biz dünyada yolcuyuz (yoldan geçenleriz)." }
            } 
        },
        38: { 
            base: { 
                emoji: "🌉", 
                arText: "مَعْبَر", 
                trText: "Geçit / Sınır kapısı.",
                ornek: { ar: "مَعْبَرٌ حُدُودِيٌّ", tr: "Sınır kapısı (geçidi)." }
            } 
        },

        // --- 58, 59, 60 Numaralı Kalıplar (Tef'îl Babı - İfade etmek / Tabir etmek) ---
        58: { 
            base: { 
                emoji: "🗣️", 
                arText: "عَبَّرَ", 
                trText: "İfade etti / Tabir etti.",
                ornek: { ar: "عَبَّرَ عَنْ مَشَاعِرِهِ", tr: "Duygularını ifade etti." }
            },
            cekimi: ["عَبَّرَ", "عَبَّرَا", "عَبَّرُوا", "عَبَّرَتْ", "عَبَّرَتَا", "عَبَّرْنَ", "عَبَّرْتَ", "عَبَّرْتُمَا", "عَبَّرْتُمْ", "عَبَّرْتِ", "عَبَّرْتُمَا", "عَبَّرْتُنَّ", "عَبَّرْتُ", "عَبَّرْنَا", "عَبَّرْنَا"]
        },
        59: { 
            base: { emoji: "💬", arText: "يُعَبِّرُ", trText: "İfade eder / Tabir ediyor." },
            cekimi: ["يُعَبِّرُ", "يُعَبِّرَانِ", "يُعَبِّرُونَ", "تُعَبِّرُ", "تُعَبِّرَانِ", "يُعَبِّرْنَ", "تُعَبِّرُ", "تُعَبِّرَانِ", "تُعَبِّرُونَ", "تُعَبِّرِينَ", "تُعَبِّرَانِ", "تُعَبِّرْنَ", "أُعَبِّرُ", "نُعَبِّرُ", "نُعَبِّرُ"]
        },
        60: { 
            base: { emoji: "❗", arText: "عَبِّرْ", trText: "İfade et / Tabir et!" },
            cekimi: ["عَبِّرْ", "عَبِّرَا", "عَبِّرُوا", "عَبِّرِي", "عَبِّرَا", "عَبِّرْنَ"]
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Masdarı) ---
        61: { 
            base: { 
                emoji: "💭", 
                arText: "تَعْبِير", 
                trText: "Tabir / İfade.",
                ornek: { ar: "حُرِّيَّةُ التَّعْبِيرِ", tr: "İfade (kendini tabir etme) özgürlüğü." }
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "💬", 
                arText: "تَعْبِيرَات", 
                trText: "İfadeler / Tabirler." 
            }
        },

        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı - İtibar Etmek / Dikkate Almak) ---
        77: { 
            base: { 
                emoji: "🤔", 
                arText: "اِعْتَبَرَ", 
                trText: "Dikkate aldı / İtibar etti / İbret aldı." 
            },
            cekimi: ["اِعْتَبَرَ", "اِعْتَبَرَا", "اِعْتَبَرُوا", "اِعْتَبَرَتْ", "اِعْتَبَرَتَا", "اِعْتَبَرْنَ", "اِعْتَبَرْتَ", "اِعْتَبَرْتُمَا", "اِعْتَبَرْتُمْ", "اِعْتَبَرْتِ", "اِعْتَبَرْتُمَا", "اِعْتَبَرْتُنَّ", "اِعْتَبَرْتُ", "اِعْتَبَرْنَا", "اِعْتَبَرْنَا"]
        },
        78: { 
            base: { 
                emoji: "🧠", 
                arText: "يَعْتَبِرُ", 
                trText: "Dikkate alır / İtibar ediyor.",
                ornek: { ar: "يَعْتَبِرُ النَّاسُ هَذَا الْقَرَارَ مُهِمًّا", tr: "İnsanlar bu kararı önemli sayıyor (itibar ediyor / dikkate alıyor)." }
            },
            cekimi: ["يَعْتَبِرُ", "يَعْتَبِرَانِ", "يَعْتَبِرُونَ", "تَعْتَبِرُ", "تَعْتَبِرَانِ", "يَعْتَبِرْنَ", "تَعْتَبِرُ", "تَعْتَبِرَانِ", "تَعْتَبِرُونَ", "تَعْتَبِرِينَ", "تَعْتَبِرَانِ", "تَعْتَبِرْنَ", "أَعْتَبِرُ", "نَعْتَبِرُ", "نَعْتَبِرُ"]
        },
        79: { 
            base: { 
                emoji: "❗", 
                arText: "اِعْتَبِرْ", 
                trText: "İbret al / Dikkate al!",
                ornek: { ar: "فَاعْتَبِرُوا يَا أُولِي الْأَبْصَارِ", tr: "Ey akıl (basiret) sahipleri, ibret alın! (Haşr Suresi, 2)" }
            },
            cekimi: ["اِعْتَبِرْ", "اِعْتَبِرَا", "اِعْتَبِرُوا", "اِعْتَبِرِي", "اِعْتَبِرَا", "اِعْتَبِرْنَ"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Masdarı) ---
        80: { 
            base: { 
                emoji: "⚖️", 
                arText: "اِعْتِبَار", 
                trText: "İtibar / Saygı / Dikkate alma.",
                ornek: { ar: "هَذَا الْأَمْرُ قَيْدُ الِاعْتِبَارِ", tr: "Bu konu dikkate alınmaktadır (itibar edilmektedir)." }
            },
            suggestsPlus: true,
            "ا": { 
                emoji: "📅", 
                arText: "اعْتِبَارًا", 
                trText: "İtibaren.",
                ornek: { ar: "اعْتِبَارًا مِنْ يَوْمِ غَدٍ", tr: "Yarından itibaren." }
            }
        },

        // --- 82 Numaralı Kalıp (مُفْتَعَل - İfti'âl İsm-i Mef'ulü) ---
        82: { 
            base: { 
                emoji: "🎩", 
                arText: "مُعْتَبَر", 
                trText: "Muteber / Saygın / Geçerli.",
                ornek: { ar: "شَخْصٌ مُعْتَبَرٌ فِي الْمُجْتَمَعِ", tr: "Toplumda muteber (saygın/itibarlı) bir kişi." }
            } 
        }
    },

    // ==================================================================
    // 66. '-M-R (ع م ر) KÖKÜ - Yaşamak / İnşa Etmek / Şenlendirmek
    // 1. Bab (فَعَلَ - يَفْعُلُ), Tef'îl ve İstif'âl Babları
    // ==================================================================
    "عمر": {
        // --- 1, 2, 3 Numaralı Kalıplar (1. Bab - İmar Etmek / Şenlendirmek) ---
        1: { 
            base: { 
                emoji: "🏗️", 
                arText: "عَمَرَ", 
                trText: "İmar etti / Şenlendirdi.",
                ornek: { ar: "عَمَرَ النَّاسُ الْأَرْضَ", tr: "İnsanlar yeryüzünü imar etti (şenlendirdi)." }
            },
            cekimi: ["عَمَرَ", "عَمَرَا", "عَمَرُوا", "عَمَرَتْ", "عَمَرَتَا", "عَمَرْنَ", "عَمَرْتَ", "عَمَرْتُمَا", "عَمَرْتُمْ", "عَمَرْتِ", "عَمَرْتُمَا", "عَمَرْتُنَّ", "عَمَرْتُ", "عَمَرْنَا", "عَمَرْنَا"]
        },
        2: { 
            base: { emoji: "🔨", arText: "يَعْمُرُ", trText: "İmar eder / Şenlendiriyor." },
            cekimi: ["يَعْمُرُ", "يَعْمُرَانِ", "يَعْمُرُونَ", "تَعْمُرُ", "تَعْمُرَانِ", "يَعْمُرْنَ", "تَعْمُرُ", "تَعْمُرَانِ", "تَعْمُرُونَ", "تَعْمُرِينَ", "تَعْمُرَانِ", "تَعْمُرْنَ", "أَعْمُرُ", "نَعْمُرُ", "نَعْمُرُ"]
        },
        3: { 
            base: { emoji: "❗", arText: "اُعْمُرْ", trText: "İmar et / Şenlendir!" },
            cekimi: ["اُعْمُرْ", "اُعْمُرَا", "اُعْمُرُوا", "اُعْمُرِي", "اُعْمُرَا", "اُعْمُرْنَ"]
        },

        // --- İsim ve Masdar Kalıpları ---
        21: { 
            base: { 
                emoji: "⏳", 
                arText: "عُمْر", 
                trText: "Ömür / Yaşam.",
                ornek: { ar: "أَطَالَ اللهُ عُمْرَكَ", tr: "Allah ömrünü uzatsın." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🕋", 
                arText: "عُمْرَة", 
                trText: "Umre / Ziyaret (Kutsal mekanı şenlendirme).",
                ornek: { ar: "الْحَجُّ وَالْعُمْرَةُ لِلهِ", tr: "Hac ve Umre Allah içindir." }
            } 
        },

        23: { 
            base: { 
                emoji: "🏛️", 
                arText: "عِمَار", 
                trText: "İmar etme (Yalın)." 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🏢", 
                arText: "عِمَارَة", 
                trText: "Bina / Apartman / Mimari.",
                ornek: { ar: "فَنُّ الْعِمَارَةِ الْإِسْلَامِيَّةِ", tr: "İslam mimarisi sanatı." }
            } 
        },

        36: { 
            base: { 
                emoji: "🌆", 
                arText: "مَعْمُور", 
                trText: "Mamur / İmar edilmiş / Bayındır.",
                ornek: { ar: "بَلَدٌ مَعْمُورٌ بِالْخَيْرَاتِ", tr: "İyiliklerle mamur (şenlenmiş/bayındır) bir belde." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🌍", 
                arText: "مَعْمُورَة", 
                trText: "Mamure / Yeryüzü."
            }
        },

        40: { 
            base: { 
                emoji: "📐", 
                arText: "مِعْمَار", 
                trText: "Mimar / Mimari.",
                ornek: { ar: "الْمِعْمَارُ سِنَان", tr: "Mimar Sinan." }
            },
            suggestsPlus: true,
            "يّ": { 
                emoji: "👷‍♂️", 
                arText: "مِعْمَارِيّ", 
                trText: "Mimar (Meslek) / Mimariyle ilgili."
            }
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Masdarı) ---
        55: { 
            base: { 
                emoji: "🏗️", 
                arText: "إِعْمَار", 
                trText: "İmar / Kalkındırma / Bayındır hale getirme.",
                ornek: { ar: "إِعْمَارُ الْمَدِينَةِ بَعْدَ الزِّلْزَالِ", tr: "Depremden sonra şehrin imar edilmesi." }
            } 
        },

        // --- 58, 59, 60 Numaralı Kalıplar (Tef'îl Babı - Tamir Etmek / Uzun yaşatmak) ---
        58: { 
            base: { emoji: "🔧", arText: "عَمَّرَ", trText: "Tamir etti / Ömür verdi." },
            cekimi: ["عَمَّرَ", "عَمَّرَا", "عَمَّرُوا", "عَمَّرَتْ", "عَمَّرَتَا", "عَمَّرْنَ", "عَمَّرْتَ", "عَمَّرْتُمَا", "عَمَّرْتُمْ", "عَمَّرْتِ", "عَمَّرْتُمَا", "عَمَّرْتُنَّ", "عَمَّرْتُ", "عَمَّرْنَا", "عَمَّرْنَا"]
        },
        59: { 
            base: { emoji: "⚙️", arText: "يُعَمِّرُ", trText: "Tamir eder / Ömür verir." },
            cekimi: ["يُعَمِّرُ", "يُعَمِّرَانِ", "يُعَمِّرُونَ", "تُعَمِّرُ", "تُعَمِّرَانِ", "يُعَمِّرْنَ", "تُعَمِّرُ", "تُعَمِّرَانِ", "تُعَمِّرُونَ", "تُعَمِّرِينَ", "تُعَمِّرَانِ", "تُعَمِّرْنَ", "أُعَمِّرُ", "نُعَمِّرُ", "نُعَمِّرُ"]
        },
        60: { 
            base: { emoji: "❗", arText: "عَمِّرْ", trText: "Tamir et!" },
            cekimi: ["عَمِّرْ", "عَمِّرَا", "عَمِّرُوا", "عَمِّرِي", "عَمِّرَا", "عَمِّرْنَ"]
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Masdarı) ---
        61: { 
            base: { 
                emoji: "🛠️", 
                arText: "تَعْمِير", 
                trText: "Tamir / Onarım.",
                ornek: { ar: "تَعْمِيرُ السَّيَّارَةِ فِي الْوَرْشَةِ", tr: "Arabanın atölyede tamir edilmesi." }
            } 
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - İstif'âl Masdarı) ---
        103: { 
            base: { 
                emoji: "🌍", 
                arText: "اِسْتِعْمَار", 
                trText: "Sömürgecilik.",
                ornek: [
                    { 
                        ar: "اِنْتَهَى عَصْرُ الِاسْتِعْمَارِ", 
                        tr: "Sömürgecilik (istismar/istimar) çağı sona erdi." 
                    },
                    { 
                        ar: "💡 مَعْلُومَة لُغَوِيَّة", 
                        tr: "Kelime Bilgisi: İstif'al babı 'istek' bildirir. 'İsti'mar' kelimesi aslen 'bir yeri imar etmeyi (bayındırlaştırmayı) istemek' demektir. Ancak zamanla Batılı devletlerin bu bahaneyle ülkeleri işgal etmesi sebebiyle 'Sömürgecilik' anlamında kalıplaşmıştır." 
                    }
                ]
            } 
        }
    },

     // ==================================================================
    // 68. L-Z-M (ل ز م) KÖKÜ - Gerekli Olmak / Ayrılmamak
    // 4. Bab (فَرِحَ - يَفْرَحُ) ve İlgili Mezid Bablar
    // ==================================================================
    "لزم": {
        // --- 8, 9, 10 Numaralı Kalıplar (4. Bab) ---
        8: { 
            base: { emoji: "📌", arText: "لَزِمَ", trText: "Gerekti / (Bir yerden) Ayrılmadı." },
            cekimi: ["لَزِمَ", "لَزِمَا", "لَزِمُوا", "لَزِمَتْ", "لَزِمَتَا", "لَزِمْنَ", "لَزِمْتَ", "لَزِمْتُمَا", "لَزِمْتُمْ", "لَزِمْتِ", "لَزِمْتُمَا", "لَزِمْتُنَّ", "لَزِمْتُ", "لَزِمْنَا", "لَزِمْنَا"]
        },
        9: { 
            base: { 
                emoji: "⏳", 
                arText: "يَلْزَمُ", 
                trText: "Gerekiyor / Lazım olur.",
                ornek: { ar: "مَاذَا يَلْزَمُ لِلسَّفَرِ؟", tr: "Yolculuk için ne gerekiyor (lazım)?" }
            },
            cekimi: ["يَلْزَمُ", "يَلْزَمَانِ", "يَلْزَمُونَ", "تَلْزَمُ", "تَلْزَمَانِ", "يَلْزَمْنَ", "تَلْزَمُ", "تَلْزَمَانِ", "تَلْزَمُونَ", "تَلْزَمِينَ", "تَلْزَمَانِ", "تَلْزَمْنَ", "أَلْزَمُ", "نَلْزَمُ", "نَلْزَمُ"]
        },
        10: { 
            base: { 
                emoji: "❗", 
                arText: "اِلْزَمْ", 
                trText: "Sıkı tut / Ayrılma!",
                ornek: { ar: "اِلْزَمْ مَكَانَكَ", tr: "Yerinden ayrılma (yerini sıkı tut)." }
            },
            cekimi: ["اِلْزَمْ", "اِلْزَمَا", "اِلْزَمُوا", "اِلْزَمِي", "اِلْزَمَا", "اِلْزَمْنَ"]
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fail) ---
        33: { 
            base: { 
                emoji: "✅", 
                arText: "لَازِم", 
                trText: "Gerekli / Lazım.",
                ornek: { ar: "هَذَا الشَّيْءُ لَازِمٌ جِدًّا", tr: "Bu şey çok gereklidir (lazımdır)." }
            } 
        },

        // --- 50 Numaralı Kalıp (أَفْعَل - İsm-i Tafdil) ---
        50: { 
            base: { 
                emoji: "⚠️", 
                arText: "أَلْزَم", 
                trText: "En gerekli / Çok gerekli / Elzem.",
                ornek: { ar: "الْمَاءُ أَلْزَمُ لِلْحَيَاةِ", tr: "Su, hayat için çok gereklidir (elzemdir)." }
            } 
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Masdarı) ---
        55: { 
            base: { 
                emoji: "⚖️", 
                arText: "إِلْزَام", 
                trText: "Zorunlu kılma / İlzam." 
            },
            suggestsPlus: true,
            "يَّة": { 
                emoji: "📜", 
                arText: "إِلْزَامِيَّة", 
                trText: "Zorunluluk.",
                ornek: { ar: "الْخِدْمَةُ الْعَسْكَرِيَّةُ إِلْزَامِيَّةٌ", tr: "Askerlik hizmeti zorunludur (ilzamidir)." }
            }
        },

        // --- 69 Numaralı Kalıp (مُفَاعِل - Müfâ'ale İsm-i Faili) ---
        69: { 
            base: { 
                emoji: "🎖️", 
                arText: "مُلَازِم", 
                trText: "Ayrılmayan / Teğmen (Mülazım).",
                ornek: { ar: "هُوَ مُلَازِمٌ فِي الْجَيْشِ", tr: "O, orduda teğmendir (mülazımdır)." }
            } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Masdarı) ---
        80: { 
            base: { 
                emoji: "🤝", 
                arText: "اِلْتِزَام", 
                trText: "Sorumluluk alma / Bağlılık / İltizam.",
                ornek: { ar: "الِالْتِزَامُ بِالْقَوَانِينِ وَاجِبٌ", tr: "Kanunlara uymak (iltizam etmek) görevdir." }
            } 
        }
    },

    // ==================================================================
    // 69. L-B-S (ل ب س) KÖKÜ - Giymek / Örtmek / Karışmak
    // 4. Bab (فَرِحَ - يَفْرَحُ)
    // ==================================================================
    "لبس": {
        // --- 8, 9, 10 Numaralı Kalıplar (4. Bab - Giymek) ---
        8: { 
            base: { emoji: "👕", arText: "لَبِسَ", trText: "Giydi." },
            cekimi: ["لَبِسَ", "لَبِسَا", "لَبِسُوا", "لَبِسَتْ", "لَبِسَتَا", "لَبِسْنَ", "لَبِسْتَ", "لَبِسْتُمَا", "لَبِسْتُمْ", "لَبِسْتِ", "لَبِسْتُمَا", "لَبِسْتُنَّ", "لَبِسْتُ", "لَبِسْنَا", "لَبِسْنَا"]
        },
        9: { 
            base: { emoji: "👔", arText: "يَلْبَسُ", trText: "Giyer / Giyiyor." },
            cekimi: ["يَلْبَسُ", "يَلْبَسَانِ", "يَلْبَسُونَ", "تَلْبَسُ", "تَلْبَسَانِ", "يَلْبَسْنَ", "تَلْبَسُ", "تَلْبَسَانِ", "تَلْبَسُونَ", "تَلْبَسِينَ", "تَلْبَسَانِ", "تَلْبَسْنَ", "أَلْبَسُ", "نَلْبَسُ", "نَلْبَسُ"]
        },
        10: { 
            base: { emoji: "❗", arText: "اِلْبَسْ", trText: "Giy!" },
            cekimi: ["اِلْبَسْ", "اِلْبَسَا", "اِلْبَسُوا", "اِلْبَسِي", "اِلْبَسَا", "اِلْبَسْنَ"]
        },

        // --- 23 Numaralı Kalıp (فِعَال) ---
        23: { 
            base: { 
                emoji: "👗", 
                arText: "لِبَاس", 
                trText: "Libas / Giysi.",
                ornek: [
                    { 
                        ar: "هُنَّ لِبَاسٌ لَكُمْ", 
                        tr: "Onlar sizin için birer elbisedir (libastır). (Bakara Suresi, 187)" 
                    },
                    { 
                        ar: "💡 مَعْلُومَة لُغَوِيَّة", 
                        tr: "Kelime Bilgisi: Türkçede tekil olarak kullandığımız 'Elbise' (أَلْبِسَة) kelimesi, aslında Arapçada 'Libas' (لِبَاس) kelimesinin çoğul formudur." 
                    }
                ]
            } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Masdarı) ---
        80: { 
            base: { 
                emoji: "😵‍💫", 
                arText: "اِلْتِبَاس", 
                trText: "İltibas / Karışıklık / Anlam karmaşası.",
                ornek: { ar: "حَصَلَ اِلْتِبَاسٌ فِي الْمَوْضُوعِ", tr: "Konuda bir karışıklık (iltibas) meydana geldi." }
            } 
        }
    },

      // ==================================================================
    // 70. L-F-Z (ل ف ظ) KÖKÜ - Söylemek / Telaffuz Etmek
    // 2. Bab (ضَرَبَ - يَضْرِبُ)
    // ==================================================================
    "لفظ": {
        // --- 1, 2, 3 Numaralı Kalıplar (2. Bab) ---
        1: { 
            base: { emoji: "🗣️", arText: "لَفَظَ", trText: "Ağzından çıkardı / Söyledi." },
            cekimi: ["لَفَظَ", "لَفَظَا", "لَفَظُوا", "لَفَظَتْ", "لَفَظَتَا", "لَفَظْنَ", "لَفَظْتَ", "لَفَظْتُمَا", "لَفَظْتُمْ", "لَفَظْتِ", "لَفَظْتُمَا", "لَفَظْتُنَّ", "لَفَظْتُ", "لَفَظْنَا", "لَفَظْنَا"]
        },
        2: { 
            base: { emoji: "💬", arText: "يَلْفِظُ", trText: "Söyler / Telaffuz eder." },
            cekimi: ["يَلْفِظُ", "يَلْفِظَانِ", "يَلْفِظُونَ", "تَلْفِظُ", "تَلْفِظَانِ", "يَلْفِظْنَ", "تَلْفِظُ", "تَلْفِظَانِ", "تَلْفِظُونَ", "تَلْفِظِينَ", "تَلْفِظَانِ", "تَلْفِظْنَ", "أَلْفِظُ", "نَلْفِظُ", "نَلْفِظُ"]
        },
        3: { 
            base: { emoji: "❗", arText: "اِلْفِظْ", trText: "Söyle / Telaffuz et!" },
            cekimi: ["اِلْفِظْ", "اِلْفِظَا", "اِلْفِظُوا", "اِلْفِظِي", "اِلْفِظَا", "اِلْفِظْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
    base: { 
        emoji: "🔤", 
        arText: "لَفْظ", 
        trText: "Lafız / Sözcük / İfade.",
        ornek: { ar: "لَفْظُ الْجَلَالَةِ", tr: "Allah lafzı (Yücelik ifadesi)." }
    },
    suggestsPlus: true,
    "يّ": { 
        emoji: "🗣️", 
        arText: "لَفْظِيّ", 
        trText: "Lafzi / Sözel." 
    },
    "يًّا": { 
        emoji: "🗣️", 
        arText: "لَفْظِيًّا", 
        trText: "Lafzen / Sözel olarak." 
    }
   },

        // --- 42 Numaralı Kalıp (أَفْعَال - Çoğul Kalıbı) ---
        42: { 
            base: { 
                emoji: "📝", 
                arText: "أَلْفَاظ", 
                trText: "Elfaz / Sözler / Kelimeler.",
                ornek: { ar: "أَلْفَاظٌ جَمِيلَةٌ", tr: "Güzel sözler (elfaz)." }
            } 
        },

        // --- 91 Numaralı Kalıp (تَفَعُّل - Tefe'ul Masdarı) ---
        91: { 
            base: { 
                emoji: "🎙️", 
                arText: "تَلَفُّظ", 
                trText: "Telaffuz / Söyleyiş.",
                ornek: { ar: "تَلَفُّظُ هَذِهِ الْكَلِمَةِ صَعْبٌ", tr: "Bu kelimenin telaffuzu (söylenişi) zordur." }
            } 
        }
    },

     // ==================================================================
    // 71. H-D-Y (ه د ي) KÖKÜ - Doğru Yolu Göstermek / Rehberlik / Hediye
    // 2. Bab (ضَرَبَ - يَضْرِبُ)
    // ==================================================================
    "هدي": {
        // --- 1, 4, 5 Numaralı Kalıplar (2. Bab) ---
        1: { 
            base: { emoji: "🧭", arText: "هَدَى", trText: "Doğru yolu gösterdi / Kılavuzluk etti." },
            cekimi: ["هَدَى", "هَدَيَا", "هَدَوْا", "هَدَتْ", "هَدَتَا", "هَدَيْنَ", "هَدَيْتَ", "هَدَيْتُمَا", "هَدَيْتُمْ", "هَدَيْتِ", "هَدَيْتُمَا", "هَدَيْتُنَّ", "هَدَيْتُ", "هَدَيْنَا", "هَدَيْنَا"]
        },
        4: { 
            base: { emoji: "🗺️", arText: "يَهْدِي", trText: "Doğru yolu gösterir / İletir." },
            cekimi: ["يَهْدِي", "يَهْدِيَانِ", "يَهْدُونَ", "تَهْدِي", "تَهْدِيَانِ", "يَهْدِينَ", "تَهْدِي", "تَهْدِيَانِ", "تَهْدُونَ", "تَهْدِينَ", "تَهْدِيَانِ", "تَهْدِينَ", "أَهْدِي", "نَهْدِي", "نَهْدِي"]
        },
        5: { 
            base: { 
                emoji: "❗", 
                arText: "اِهْدِ", 
                trText: "Doğru yola ilet / Göster!",
                ornek: { ar: "اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", tr: "Bizi dosdoğru yola ilet. (Fâtiha Suresi, 6)" }
            },
            cekimi: ["اِهْدِ", "اِهْدِيَا", "اِهْدُوا", "اِهْدِي", "اِهْدِيَا", "اِهْدِينَ"]
        },

        // --- 23 Numaralı Kalıp (فِعَال - Masdar) ---
        23: { 
            base: { arText: "هِدَاي" },
            suggestsPlus: true,
            "ة": { 
                emoji: "✨", 
                arText: "هِدَايَة", 
                trText: "Hidayet / Doğru yolu bulma.",
                ornek: { ar: "نَسْأَلُ اللهَ الْهِدَايَةَ", tr: "Allah'tan hidayet (doğru yolu) dileriz." }
            } 
        },

        // --- 35 Numaralı Kalıp (فَعِيل) ---
35: { 
    // Sadece sistemin kelimenin ilk hali olduğunu anlaması için arText bırakıldı, ekrana bir şey açmaz.
    base: { arText: "هَدِيّ" }, 
    suggestsPlus: true,
    "ة": { 
        emoji: "🎁", 
        arText: "هَدِيَّة", 
        trText: "Hediye / Armağan.",
        ornek: { ar: "هَدِيَّةٌ قَيِّمَةٌ", tr: "Değerli bir hediye." }
    } 
},

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "🕊️", 
                arText: "مَهْدِيّ", 
                trText: "Mehdi / Kendisine doğru yol gösterilmiş kişi.",
                ornek: { 
                    ar: "💡 Gramer Sırrı", 
                    tr: "Kökümüz 'H-D-Y' (ه د ي). 'Mef'ûl' kalıbına girince kelimenin aslı 'مَهْدُوي' (Mehdûy) şeklindedir. Ancak Arapça İ'lâl kurallarına göre; 'Vav' ve 'Ye' yan yana gelip ilki harekesiz olunca 'Vav' harfi 'Ye'ye dönüşür ve şeddelenir. Önceki harfin ötresi de esreye uyarlanarak kelime 'مَهْدِيّ' (Mehdiyy) halini alır." 
                }
            }
        },

        // --- 81 Numaralı Kalıp (مُفْتَعِل - İfti'âl İsm-i Fâili) ---
        81: { 
            base: { 
                emoji: "🚶", 
                arText: "مُهْتَدٍ", 
                trText: "Mühtedi / Doğru yolu bulan / İslam'ı seçen.",
                ornek: [
                    { 
                        ar: "هُوَ مِنَ الْمُهْتَدِينَ", 
                        tr: "O, doğru yolu bulanlardandır (mühtedilerdendir)." 
                    },
                    { 
                        ar: "💡 مَعْلُومَة لُغَوِيَّة", 
                        tr: "Kelime Bilgisi: Bu kelime belirsiz (nekre) haldeyken sonundaki 'Ye' (ي) harfi düşer (مُهْتَدٍ). Ancak başına 'Elif-Lam' (ال) takısı aldığında o düşen harf geri gelir ve 'الْمُهْتَدِي' (El-Mühtedî) şeklinde yazılır." 
                    }
                ]
            } 
        }
    },

    // ==================================================================
    // 72. H-J-R (ه ج ر) KÖKÜ - Terk Etmek / Göçmek / Ayrılmak
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve Müfâ'ale Babı
    // ==================================================================
    "هجر": {
        // --- 1, 2, 3 Numaralı Kalıplar (1. Bab) ---
        1: { 
            base: { emoji: "🚶‍♂️", arText: "هَجَرَ", trText: "Terk etti / Bıraktı." },
        },
        2: { 
            base: { emoji: "🐪", arText: "يَهْجُرُ", trText: "Terk eder / Bırakıyor." },
        },
        3: { 
            base: { emoji: "❗", arText: "اُهْجُرْ", trText: "Terk et!" },
        },

        // --- 20 Numaralı Kalıp (فِعْل) ---
        20: { 
            base: { 
                emoji: "🏜️", 
                arText: "هِجْر", 
                
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🐪", 
                arText: "هِجْرَة", 
                trText: "Hicret / Göç.",
                ornek: { ar: "الْهِجْرَةُ النَّبَوِيَّةُ", tr: "Peygamberin hicreti (göçü)." }
            }
        },

        // --- 29 Numaralı Kalıp (فِعْلَان - Masdar / İsim) ---
        29: {
            base: {
                emoji: "💔",
                arText: "هِجْرَان",
                trText: "Hicran / Ayrılık acısı.",
                ornek: { ar: "شَعَرَ بِلَوْعَةِ الْهِجْرَانِ", tr: "Hicran (ayrılık) ateşini hissetti." }
            }
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Müfâ'ale Masdarı) ---
        67: { 
            base: { 
                emoji: "🌍", 
                arText: "مُهَاجَرَة", 
                trText: "Muhaceret / Karşılıklı göç / Ülke dışına çıkma." 
            } 
        },
    },
 
     // ==================================================================
    // 73. H-M-M (ه م م) KÖKÜ - Dert Edinmek / Önemsemek / Gayret
    // 1. Bab (Şeddeli / Mudâaf Fiil)
    // ==================================================================
    "همم": {
        // --- 1, 2, 3 Numaralı Kalıplar (1. Bab) ---
        1: { 
            base: { emoji: "💭", arText: "هَمَّ", trText: "Niyetlendi / Dert edindi." },
            cekimi: ["هَمَّ", "هَمَّا", "هَمُّوا", "هَمَّتْ", "هَمَّتَا", "هَمَمْنَ", "هَمَمْتَ", "هَمَمْتُمَا", "هَمَمْتُمْ", "هَمَمْتِ", "هَمَمْتُمَا", "هَمَمْتُنَّ", "هَمَمْتُ", "هَمَمْنَا", "هَمَمْنَا"]
        },
        2: { 
            base: { emoji: "🤔", arText: "يَهُمُّ", trText: "İlgilendirir / Dert edinir." },
            cekimi: ["يَهُمُّ", "يَهُمَّانِ", "يَهُمُّونَ", "تَهُمُّ", "تَهُمَّانِ", "يَهْمُمْنَ", "تَهُمُّ", "تَهُمَّانِ", "تَهُمُّونَ", "تَهُمِّينَ", "تَهُمَّانِ", "تَهْمُمْنَ", "أَهُمُّ", "نَهُمُّ", "نَهُمُّ"]
        },
        3: { 
            base: { emoji: "❗", arText: "هُمَّ", trText: "Niyetlen / Dert et! (اُهْمُمْ)" },
            cekimi: ["هُمَّ", "هُمَّا", "هُمُّوا", "هُمِّي", "هُمَّا", "اُهْمُمْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            base: { 
                emoji: "😓", 
                arText: "هَمّ", 
                trText: "Hemm / Dert / Keder.",
                ornek: { ar: "لَا تَحْمِلْ هَمًّا", tr: "Dert etme (keder yüklenme)." }
            } 
        },

        // --- 20 Numaralı Kalıp (فِعْل) ---
        20: { 
            base: { arText: "هِمّ"},
            suggestsPlus: true,
            "ة": { 
                emoji: "🦅", 
                arText: "هِمَّة", 
                trText: "Himmet / Yüksek gayret / Çaba.",
                ornek: { ar: "عَالِي الْهِمَّةِ", tr: "Himmeti (gayreti) yüksek olan." }
            } 
        },

        // --- 50 Numaralı Kalıp (أَفْعَل - İsm-i Tafdil) ---
        50: { 
            base: { emoji: "⚠️", arText: "أَهَمّ", trText: "En önemli / Elzem / Ehem." },
            suggestsPlus: true,
            "يَّة": { 
                emoji: "❗", 
                arText: "أَهَمِّيَّة", 
                trText: "Ehemmiyet / Önem.",
                ornek: { ar: "مَوْضُوعٌ فِي غَايَةِ الْأَهَمِّيَّةِ", tr: "Son derece ehemmiyetli (önemli) bir konu." }
            } 
        },

        // --- 56 Numaralı Kalıp (مُفْعِل - İf'âl İsm-i Fâili) ---
        56: { 
            base: { emoji: "📌", arText: "مُهِمّ", trText: "Mühim / Önemli." },
            suggestsPlus: true,
            "ات": { 
                emoji: "📦", 
                arText: "مُهِمَّات", 
                trText: "Mühimmat / Önemli araç-gereçler / Cephane." 
            } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Masdarı) ---
        80: { 
            base: { 
                emoji: "🔎", 
                arText: "اِهْتِمَام", 
                trText: "İhtimam / Özen gösterme / İlgi.",
                ornek: { ar: "يَحْتَاجُ إِلَى اِهْتِمَامٍ خَاصٍّ", tr: "Özel bir ihtimama (ilgiye/özene) ihtiyaç duyuyor." }
            } 
        }
    },

    // ==================================================================
    // 74. Y-Q-N (ي ق ن) KÖKÜ - Kesin Bilgi / Şüphesiz İnanmak
    // İf'âl Babı
    // ==================================================================
    "يقن": {
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "🎯", 
                arText: "يَقِين", 
                trText: "Yakîn / Kesin bilgi / Şüphesizlik.",
                ornek: { ar: "عِلْمُ الْيَقِينِ", tr: "Kesin bilgi (İlmel yakîn)." }
            },
            suggestsPlus: true,
            "ًا": { 
                emoji: "✅", 
                arText: "يَقِينًا", 
                trText: "Yakînen / Kesin olarak.",
                ornek: { ar: "أَعْرِفُهُ يَقِينًا", tr: "Onu yakinen (kesin olarak) biliyorum." }
            } 
        },

        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı - Kesin İnanmak) ---
        52: { 
            base: { 
                emoji: "💡", 
                arText: "أَيْقَنَ", 
                trText: "Kesin olarak inandı." 
            },
            cekimi: ["أَيْقَنَ", "أَيْقَنَا", "أَيْقَنُوا", "أَيْقَنَتْ", "أَيْقَنَتَا", "أَيْقَنَّ", "أَيْقَنْتَ", "أَيْقَنْتُمَا", "أَيْقَنْتُمْ", "أَيْقَنْتِ", "أَيْقَنْتُمَا", "أَيْقَنْتُنَّ", "أَيْقَنْتُ", "أَيْقَنَّا", "أَيْقَنَّا"]
        },
        53: { 
            base: { 
                emoji: "✨", 
                arText: "يُوقِنُ", 
                trText: "Kesin olarak inanır.",
                ornek: [
                    { 
                        ar: "وَبِالْآخِرَةِ هُمْ يُوقِنُونَ", 
                        tr: "Ahirete de ancak onlar kesin olarak inanırlar. (Bakara Suresi, 4)" 
                    },
                    { 
                        ar: "💡 Gramer Sırrı", 
                        tr: "Kökümüz 'Y-Q-N' (ي ق ن) 'Ya' harfi ile başlamasına rağmen İf'âl babının muzarisinde (يُيْقِنُ) demek zor olduğu için, 'Ya' harfi telaffuz kolaylığı için 'Vav' harfine dönüşür ve 'يُوقِنُ' (Yûkinu) olur." 
                    }
                ]
            },
            cekimi: ["يُوقِنُ", "يُوقِنَانِ", "يُوقِنُونَ", "تُوقِنُ", "تُوقِنَانِ", "يُوقِنَّ", "تُوقِنُ", "تُوقِنَانِ", "تُوقِنُونَ", "تُوقِنِينَ", "تُوقِنَانِ", "تُوقِنَّ", "أُوقِنُ", "نُوقِنُ", "نُوقِنُ"]
        },
        54: { 
            base: { 
                emoji: "❗", 
                arText: "أَيْقِنْ", 
                trText: "Kesin olarak inan!" 
            },
            cekimi: ["أَيْقِنْ", "أَيْقِنَا", "أَيْقِنُوا", "أَيْقِنِي", "أَيْقِنَا", "أَيْقِنَّ"]
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Masdarı) ---
        55: { 
            base: { 
                emoji: "⚓", 
                arText: "إِيقَان", 
                trText: "İykân / Kesin olarak inanma.",
                ornek: { ar: "الْإِيمَانُ وَالْإِيقَانُ", tr: "İman ve kesin inanç (iykan)." }
            } 
        },

        // --- 56 Numaralı Kalıp (مُفْعِل - İf'âl İsm-i Fâili) ---
        56: { 
            base: { 
                emoji: "💯", 
                arText: "مُوقِن", 
                trText: "Mûkin / Şüphesiz, kesin inanan.",
            } 
        }
    },

     // ==================================================================
    // 75. Y-S-R (ي س ر) KÖKÜ - Kolaylık / Kolaylaştırmak
    // Tef'îl Babı (Kolaylaştırmak)
    // ==================================================================
    "يسر": {
        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            base: { 
                emoji: "🍃", 
                arText: "يُسْر", 
                trText: "Yüsr / Kolaylık.",
                ornek: { ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", tr: "Şüphesiz zorlukla beraber bir kolaylık (yüsr) vardır. (İnşirah Suresi, 6)" }
            } 
        },

        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "👌", 
                arText: "يَسِير", 
                trText: "Yesîr / Kolay / Az.",
                ornek: { ar: "هَذَا أَمْرٌ يَسِيرٌ", tr: "Bu kolay bir iştir." }
            } 
        },

        // --- 58, 59, 60 Numaralı Kalıplar (Tef'îl Babı - Kolaylaştırmak) ---
        58: { 
            base: { emoji: "🛤️", arText: "يَسَّرَ", trText: "Kolaylaştırdı." },
            cekimi: ["يَسَّرَ", "يَسَّرَا", "يَسَّرُوا", "يَسَّرَتْ", "يَسَّرَتَا", "يَسَّرْنَ", "يَسَّرْتَ", "يَسَّرْتُمَا", "يَسَّرْتُمْ", "يَسَّرْتِ", "يَسَّرْتُمَا", "يَسَّرْتُنَّ", "يَسَّرْتُ", "يَسَّرْنَا", "يَسَّرْنَا"]
        },
        59: { 
            base: { emoji: "🛣️", arText: "يُيَسِّرُ", trText: "Kolaylaştırır / Kolaylaştırıyor." },
            cekimi: ["يُيَسِّرُ", "يُيَسِّرَانِ", "يُيَسِّرُونَ", "تُيَسِّرُ", "تُيَسِّرَانِ", "يُيَسِّرْنَ", "تُيَسِّرُ", "تُيَسِّرَانِ", "تُيَسِّرُونَ", "تُيَسِّرِينَ", "تُيَسِّرَانِ", "تُيَسِّرْنَ", "أُيَسِّرُ", "نُيَسِّرُ", "نُيَسِّرُ"]
        },
        // --- 60 Numaralı Kalıp (Tef'îl Babı Emir) ---
        60: { 
            base: { 
                emoji: "❗", 
                arText: "يَسِّرْ", 
                trText: "Kolaylaştır!",
                ornek: [
                    { 
                        ar: "رَبِّ يَسِّرْ وَلَا تُعَسِّرْ، رَبِّ تَمِّمْ بِالْخَيْرِ", 
                        tr: "Rabbim, kolaylaştır, zorlaştırma; Rabbim, hayırla tamamla. (Dua)" 
                    },
                    { 
                        ar: "يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا", 
                        tr: "Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz. (Hadis-i Şerif)" 
                    }
                ]
            },
            cekimi: ["يَسِّرْ", "يَسِّرَا", "يَسِّرُوا", "يَسِّرِي", "يَسِّرَا", "يَسِّرْنَ"]
        },

        // --- 64 Numaralı Kalıp (مُفَعَّل - Tef'îl İsm-i Mef'ûlü) ---
        63: { 
            base: { 
                emoji: "🎁", 
                arText: "مُيَسَّر", 
                trText: "Müyesser / Kolaylaştırılmış / Nasip olmuş.",
                ornek: { ar: "كُلٌّ مُيَسَّرٌ لِمَا خُلِقَ لَهُ", tr: "Herkes, ne için yaratıldıysa ona kolaylaştırılmıştır (müyesserdir)." }
            } 
        }
    },

    // ==================================================================
    // 76. Y-T-M (ي ت م) KÖKÜ - Yalnız Kalmak / Yetim
    // ==================================================================
    "يتم": {
        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            base: { 
                emoji: "🥀", 
                arText: "يُتْم", 
                trText: "Yütm / Yetimlik / Kimsesizlik.",
                ornek: { ar: "عَاشَ مَرَارَةَ الْيُتْمِ", tr: "Yetimliğin acısını yaşadı." }
            } 
        },

        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "👤", 
                arText: "يَتِيم", 
                trText: "Yetim / Yalnız olan / Babasını kaybetmiş.",
                ornek: { 
                    ar: "أَنَا وَكَافِلُ اليَتِيمِ فِي الجَنَّةِ هَكَذَا", 
                    tr: "Ben ve yetime kefil olan (kol kanat geren) kimse cennette aynen şu şekilde (yan yana)yız. (Hadis-i Şerif)" 
                }
            } 
        },

        // --- 42 Numaralı Kalıp (أَفْعَال - Çoğul Kalıbı) ---
        42: { 
            base: { 
                emoji: "👥", 
                arText: "أَيْتَام", 
                trText: "Eytâm / Yetimler.",
                ornek: { ar: "دَارُ الْأَيْتَامِ", tr: "Yetimler yurdu (Darül eytam)." }
            } 
        }
    },

    // ==================================================================
    // 77. B-H-TH (ب ح ث) KÖKÜ - Aramak / Araştırmak / Bahsetmek
    // ==================================================================
    "بحث": {
        // --- 1 Numaralı Kalıp (Mücerret 3. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🔎", 
                arText: "بَحَثَ", 
                trText: "Aradı / Araştırdı / Bahsetti.",
                ornek: [
                    { 
                        ar: "بَحَثَ عَنْ ...", 
                        tr: "🔍 'Aramak' anlamındadır (عَنْ harf-i ceriyle). Örn: بَحَثَ عَنِ الْمِفْتَاحِ (Anahtarı aradı)." 
                    },
                    { 
                        ar: "بَحَثَ فِي ...", 
                        tr: "📖 'Derinlemesine incelemek' anlamındadır (فِي harf-i ceriyle). Örn: بَحَثَ فِي الْمَسْأَلَةِ (Meseleyi inceledi)." 
                    },
                    { 
                        ar: "بَحَثَ ...", 
                        tr: "🗣️ 'Bahsetmek / Tartışmak' anlamındadır (Harf-i cersiz, doğrudan nesne alır). Örn: بَحَثْنَا الْمَوْضُوعَ (Konudan bahsettik)." 
                    }
                ]
            },
            cekimi: ["بَحَثَ", "بَحَثَا", "بَحَثُوا", "بَحَثَتْ", "بَحَثَتَا", "بَحَثْنَ", "بَحَثْتَ", "بَحَثْتُمَا", "بَحَثْتُمْ", "بَحَثْتِ", "بَحَثْتُمَا", "بَحَثْتُنَّ", "بَحَثْتُ", "بَحَثْنَا", "بَحَثْنَا"]
        },

        // --- 6 Numaralı Kalıp (Mücerret 3. Bab Muzari) ---
        6: { 
            base: { 
                emoji: "👀", 
                arText: "يَبْحَثُ", 
                trText: "Arar / Araştırır / Bahseder.",
                ornek: { 
                    ar: "يَبْحَثُ عَنِ الْحَقِيقَةِ", 
                    tr: "Gerçeği arıyor (araştırıyor)." 
                }
            },
            cekimi: ["يَبْحَثُ", "يَبْحَثَانِ", "يَبْحَثُونَ", "تَبْحَثُ", "تَبْحَثَانِ", "يَبْحَثْنَ", "تَبْحَثُ", "تَبْحَثَانِ", "تَبْحَثُونَ", "تَبْحَثِينَ", "تَبْحَثَانِ", "تَبْحَثْنَ", "أَبْحَثُ", "نَبْحَثُ", "نَبْحَثُ"]
        },

        // --- 7 Numaralı Kalıp (Mücerret 3. Bab Emir) ---
        7: { 
            base: { 
                emoji: "❗", 
                arText: "اِبْحَثْ", 
                trText: "Ara / Araştır / Bahset!",
                ornek: { 
                    ar: "اِبْحَثْ عَنْ مَعْنَى الْكَلِمَةِ", 
                    tr: "Kelimenin anlamını ara (araştır)!" 
                }
            },
            cekimi: ["اِبْحَثْ", "اِبْحَثَا", "اِبْحَثُوا", "اِبْحَثِي", "اِبْحَثَا", "اِبْحَثْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "🔍", 
                arText: "بَحْث", 
                trText: "Bahis / Araştırma / İnceleme.",
                ornek: { ar: "بَحْثٌ عِلْمِيٌّ", tr: "Bilimsel araştırma." }
            } 
        },

        // --- 34 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        34: { 
            base: { 
                emoji: "🕵️", 
                arText: "بَاحِث", 
                trText: "Bâhis / Araştırmacı.",
                ornek: { ar: "هُوَ بَاحِثٌ فِي التَّارِيخِ", tr: "O, tarih alanında bir araştırmacıdır." }
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "📄", 
                arText: "مَبْحُوث", 
                trText: "Mebhûs / Araştırılan / Sözü edilen.",
                ornek: { ar: "الْمَوْضُوعُ الْمَبْحُوثُ عَنْهُ", tr: "Hakkında araştırma yapılan (sözü edilen) konu." }
            } 
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Müfâ'ale Masdarı) ---
        67: {
            base: {
                emoji: "🗣️",
                arText: "مُبَاحَثَة",
                trText: "Mübahase / Karşılıklı görüşme, müzakere.",
                ornek: { ar: "مُبَاحَثَاتٌ سِيَاسِيَّةٌ", tr: "Siyasi görüşmeler (müzakereler)." }
            }
        }
    },

     // ==================================================================
    // 78. T-R-K (ت ر ك) KÖKÜ - Terk Etmek / Bırakmak
    // ==================================================================
    "ترك": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🚶", 
                arText: "تَرَكَ", 
                trText: "Terk etti / Bıraktı.",
                ornek: { ar: "تَرَكَ الْعَادَاتِ السَّيِّئَةَ", tr: "Kötü alışkanlıkları terk etti (bıraktı)." }
            },
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "👋", 
                arText: "يَتْرُكُ", 
                trText: "Terk eder / Bırakır.",
                ornek: { ar: "يَتْرُكُ الْبَابَ مَفْتُوحًا", tr: "Kapıyı açık bırakıyor." }
            },
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { 
                emoji: "❗", 
                arText: "اُتْرُكْ", 
                trText: "Terk et / Bırak!",
                ornek: { ar: "اُتْرُكْنِي وَشَأْنِي", tr: "Beni kendi halime bırak!" }
            },
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "🚪", 
                arText: "تَرْك", 
                trText: "Terk / Bırakma.",
                ornek: { ar: "تَرْكُ الصَّلَاةِ", tr: "Namazı terk etmek (bırakmak)." }
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "🏚️", 
                arText: "مَتْرُوك", 
                trText: "Metrûk / Terk edilmiş / Bırakılmış.",
                ornek: { ar: "مَنْزِلٌ مَتْرُوكٌ", tr: "Terk edilmiş (metruk) ev." }
            } 
        }
    },

    // ==================================================================
    // 79. T-B-'A (ت ب ع) KÖKÜ - Tabi Olmak / İzlemek / Uymak
    // ==================================================================
    "تبع": {
        // --- 8 Numaralı Kalıp (Mücerret 4. Bab Mazi) ---
        8: { 
            base: { 
                emoji: "👣", 
                arText: "تَبِعَ", 
                trText: "Tabi oldu / İzledi / Uydu.",
                ornek: { ar: "تَبِعَ الْقَائِدَ", tr: "Lidere tabi oldu (onu izledi)." }
            },
            cekimi: ["تَبِعَ", "تَبِعَا", "تَبِعُوا", "تَبِعَتْ", "تَبِعَتَا", "تَبِعْنَ", "تَبِعْتَ", "تَبِعْتُمَا", "تَبِعْتُمْ", "تَبِعْتِ", "تَبِعْتُمَا", "تَبِعْتُنَّ", "تَبِعْتُ", "تَبِعْنَا", "تَبِعْنَا"]
        },

        // --- 9 Numaralı Kalıp (Mücerret 4. Bab Muzari) ---
        9: { 
            base: { 
                emoji: "🚶‍♂️", 
                arText: "يَتْبَعُ", 
                trText: "Tabi olur / İzler / Uyar.",
                ornek: { ar: "يَتْبَعُ الْقَوَانِينَ", tr: "Kanunlara uyar (tabi olur)." }
            },
            cekimi: ["يَتْبَعُ", "يَتْبَعَانِ", "يَتْبَعُونَ", "تَتْبَعُ", "تَتْبَعَانِ", "يَتْبَعْنَ", "تَتْبَعُ", "تَتْبَعَانِ", "تَتْبَعُونَ", "تَتْبَعِينَ", "تَتْبَعَانِ", "تَتْبَعْنَ", "أَتْبَعُ", "نَتْبَعُ", "نَتْبَعُ"]
        },

        // --- 10 Numaralı Kalıp (Mücerret 4. Bab Emir) ---
        10: { 
            base: { 
                emoji: "❗", 
                arText: "اِتْبَعْ", 
                trText: "Tabi ol / İzle / Uy!",
                ornek: { ar: "اِتْبَعْ قَلْبَكَ", tr: "Kalbinin sesini izle (uy)!" }
            },
            cekimi: ["اِتْبَعْ", "اِتْبَعَا", "اِتْبَعُوا", "اِتْبَعِي", "اِتْبَعَا", "اِتْبَعْنَ"]
        },

       // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "👤", 
                arText: "تَابِع", 
                trText: "Tâbi / Uyan / İzleyen / Bağımlı.",
                ornek: { ar: "نَحْنُ تَوَابِعُ لِلْحَقِّ", tr: "Biz hakka tabi olanlarız." }
            },
            suggestsPlus: true,
            "ينَ": { 
                emoji: "👥", 
                arText: "تَابِعِين", 
                trText: "Uyanlar",
                ornek: { 
                    ar: "تَبَعُ التَّابِعِين", 
                    tr: "Tebe-i Tâbiîn / Tâbiîn nesline tabi olanlar." 
                }
            } 
        },

        // --- 47 Numaralı Kalıp (Çoğul İsim Kalıbı - فَعَلَة) ---
        47: { 
            base: { 
                emoji: "🏛️", 
                arText: "تَبَعَة", 
                trText: "Tebaa / Bir devlete veya lidere tabi olan halk, uyruk.",
                ornek: { ar: "تَبَعَةُ الدَّوْلَةِ العُثْمَانِيَّةِ", tr: "Osmanlı Devleti'nin tebaası (vatandaşları)." }
            } 

          },
// --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi) ---
        77: { 
            base: { 
                emoji: "👣", 
                arText: "", 
                trText: "Uydu / Peşinden gitti / Tabi oldu. (💡 Ses Olayı: Kökün ilk harfi 'ت' (Te) olduğu için, İfti'âl babının 'ت' harfiyle birleşerek şeddelenir. Aslı 'اِتْتَبَعَ' iken idğâm ile 'اِتَّبَعَ' olmuştur)." 
            },
        },

        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - İfti'âl Babı Muzari) ---
        78: { 
            base: { 
                emoji: "🚶", 
                arText: "يَتَّبِعُ", 
                trText: "Uyar / Peşinden gider / Tabi olur.",
                ornek: { ar: "يَتَّبِعُ الْقَوَاعِدَ", tr: "Kurallara uyar." }
            },
            cekimi: ["يَتَّبِعُ", "يَتَّبِعَانِ", "يَتَّبِعُونَ", "تَتَّبِعُ", "تَتَّبِعَانِ", "يَتَّبِعْنَ", "تَتَّبِعُ", "تَتَّبِعَانِ", "تَتَّبِعُونَ", "تَتَّبِعِينَ", "تَتَّبِعَانِ", "تَتَّبِعْنَ", "أَتَّبِعُ", "نَتَّبِعُ", "نَتَّبِعُ"]
        },

        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - İfti'âl Babı Emir) ---
        79: { 
            base: { 
                emoji: "❗", 
                arText: "اِتَّبِعْ", 
                trText: "Uy / Peşinden git!",
                ornek: { ar: "اِتَّبِعُوا مَا أُنْزِلَ إِلَيْكُمْ مِنْ رَبِّكُمْ", tr: "Rabbinizden size indirilene uyun. (A'râf Suresi, 3)" }
            },
            cekimi: ["اِتَّبِعْ", "اِتَّبِعَا", "اِتَّبِعُوا", "اِتَّبِعِي", "اِتَّبِعَا", "اِتَّبِعْنَ"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "📜", 
                arText: "اِتِّبَاع", 
                trText: "İttiba / Uyma / Peşinden gitme.",
                ornek: { ar: "اِتِّبَاعُ السُّنَّةِ", tr: "Sünnete uyma (ittiba etme)." }
            } 
        }
        },

    // ==================================================================
    // 80. T-J-R (ت ج ر) KÖKÜ - Ticaret Yapmak
    // ==================================================================
    "تجر": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🤝", 
                arText: "تَجَرَ", 
                trText: "Ticaret yaptı.",
                ornek: { ar: "تَجَرَ فِي السِّلَعِ", tr: "Malların ticaretini yaptı." }
            }
            // Çekimi eklenecek kadar yaygın bir fiil kullanımı olmadığından dizi kaldırıldı.
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "📈", 
                arText: "يَتْجُرُ", 
                trText: "Ticaret yapar.",
                ornek: { ar: "يَتْجُرُ فِي الذَّهَبِ", tr: "Altın ticareti yapıyor." }
            }
            // Dizi kaldırıldı.
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { 
                emoji: "❗", 
                arText: "اُتْجُرْ", 
                trText: "Ticaret yap!",
                ornek: { ar: "اُتْجُرْ بِصِدْقٍ", tr: "Dürüstlükle ticaret yap!" }
            }
            // Dizi kaldırıldı.
        },

        // --- 23 Numaralı Kalıp (Çoğul İsim ve Masdar) ---
        23: { 
            base: { 
                
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "💼", 
                arText: "تِجَارَة", 
                trText: "Ticaret.",
                ornek: { ar: "التِّجَارَةُ رِبْحٌ", tr: "Ticaret kazançtır." }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "👨‍💼", 
                arText: "تَاجِر", 
                trText: "Tâcir / Tüccar (Ticaret yapan).",
                ornek: { ar: "تَاجِرٌ أَمِينٌ", tr: "Güvenilir tüccar." }
            } 
        },

        45: { 
    base: { 
        emoji: "👥", 
        arText: "تُجَّار", 
        trText: "Tüccarlar.",
        ornek: { 
            ar: "التَّاجِرُ الصَّدُوقُ الأَمِينُ مَعَ النَّبِيِّينَ", 
            tr: "Güvenilir, dürüst tüccar peygamberlerle beraberdir. (Hadis-i Şerif)" 
          }
        } 
      },
 
      // --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi) ---
        77: { 
            base: { 
                emoji: "📈", 
                arText: "اِتَّجَرَ", 
                trText: "Ticaret yaptı / Ticarete atıldı. (💡 Ses Olayı: Kökün ilk harfi 'ت' (Te) olduğu için, İfti'âl babının 'ت' harfiyle birleşerek şeddelenir. Aslı 'اِتْتَجَرَ' iken idğâm ile 'اِتَّجَرَ' olmuştur)." 
            },
            cekimi: ["اِتَّجَرَ", "اِتَّجَرَا", "اِتَّجَرُوا", "اِتَّجَرَتْ", "اِتَّجَرَتَا", "اِتَّجَرْنَ", "اِتَّجَرْتَ", "اِتَّجَرْتُمَا", "اِتَّجَرْتُمْ", "اِتَّجَرْتِ", "اِتَّجَرْتُمَا", "اِتَّجَرْتُنَّ", "اِتَّجَرْتُ", "اِتَّجَرْنَا", "اِتَّجَرْنَا"]
        },

        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - İfti'âl Babı Muzari) ---
        78: { 
            base: { 
                emoji: "🔄", 
                arText: "يَتَّجِرُ", 
                trText: "Ticaret yapar / Ticaretle uğraşır.",
                ornek: { ar: "يَتَّجِرُ فِي الْعَقَارَاتِ", tr: "Emlak (gayrimenkul) ticareti yapıyor." }
            },
            cekimi: ["يَتَّجِرُ", "يَتَّجِرَانِ", "يَتَّجِرُونَ", "تَتَّجِرُ", "تَتَّجِرَانِ", "يَتَّجِرْنَ", "تَتَّجِرُ", "تَتَّجِرَانِ", "تَتَّجِرُونَ", "تَتَّجِرِينَ", "تَتَّجِرَانِ", "تَتَّجِرْنَ", "أَتَّجِرُ", "نَتَّجِرُ", "نَتَّجِرُ"]
        },

        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - İfti'âl Babı Emir) ---
        79: { 
            base: { 
                emoji: "❗", 
                arText: "اِتَّجِرْ", 
                trText: "Ticaret yap / Ticarete atıl!"
            },
            cekimi: ["اِتَّجِرْ", "اِتَّجِرَا", "اِتَّجِرُوا", "اِتَّجِرِي", "اِتَّجِرَا", "اِتَّجِرْنَ"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "🤝", 
                arText: "اِتِّجَار", 
                trText: "Ticaret yapma / Alım satım.",
                ornek: { ar: "الِاتِّجَارُ بِالْبَشَرِ جَرِيمَةٌ", tr: "İnsan ticareti yapmak bir suçtur." }
            } 
        }
    },

    // ==================================================================
    // 81. TH-B-T (ث ب ت) KÖKÜ - Sabit Olmak / Kanıtlanmak
    // ==================================================================
    "ثبت": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "📌", 
                arText: "ثَبَتَ", 
                trText: "Sabit oldu / Yerinde durdu / Kanıtlandı.",
                ornek: { ar: "ثَبَتَ الْحَقُّ", tr: "Gerçek sabit oldu (kanıtlandı)." }
            },
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "⏳", 
                arText: "يَثْبُتُ", 
                trText: "Sabit olur / Kanıtlanır.",
                ornek: { ar: "لَا يَبْقَى شَيْءٌ عَلَى حَالِهِ بَلْ يَثْبُتُ", tr: "Hiçbir şey aynı kalmaz, ancak sabit olur." }
            },
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { 
                emoji: "❗", 
                arText: "اُثْبُتْ", 
                trText: "Sabit kal / Diren!",
                ornek: { ar: "اُثْبُتْ مَكَانَكَ", tr: "Yerinde sabit kal!" }
            },
        },

        // --- 22 Numaralı Kalıp (فَعَال - Masdar) ---
        22: { 
            base: { 
                emoji: "🏔️", 
                arText: "ثَبَات", 
                trText: "Sebat kadem olmak/ Sebatkar / Kararlılık / Yerinden oynamama/.",
                ornek: { ar: "الثَّبَاتُ عَلَى الْحَقِّ", tr: "Hak (doğru) üzerinde sebat etmek." }
            } 
        },

        // --- 25 Numaralı Kalıp (فُعُول - Mücerret Masdar) ---
        25: { 
            base: { 
                emoji: "📜", 
                arText: "ثُبُوت", 
                trText: "Sübut / Kesinlik kazanma / Sabit olma (İslam inancındaki 'Sübûtî Sıfatlar' buradan gelir).",
                ornek: { ar: "الصِّفَاتُ الثُّبُوتِيَّةُ", tr: "Sübûtî Sıfatlar (Allah'ın zatında varlığı sabit ve kesin olan sıfatlar)." }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "📍", 
                arText: "ثَابِت", 
                trText: "Sabit / Değişmeyen / Kararlı.",
                ornek: { ar: "هُوَ رَجُلٌ ثَابِتُ الْقَدَمِ", tr: "O, adımı sabit (kararlı) bir adamdır." }
            } 
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "✅", 
                arText: "إِثْبَات", 
                trText: "İspat / Kanıtlama / Doğrulama.",
                ornek: { ar: "إِثْبَاتُ الدَّلِيلِ", tr: "Delilin ispatı (kanıtlanması)." }
            } 
        },

        // --- 57 Numaralı Kalıp (إِفْعَال - İf'âl Babı İsm-i Mef'ûlü) ---
        57: { 
            base: { 
                emoji: "➕", 
                arText: "مُثْبَت", 
                trText: "Müspet / İspatlanmış / Olumlu.",
                ornek: { ar: "نَتِيجَةٌ مُثْبَتَةٌ", tr: "Müspet (olumlu / kanıtlanmış) sonuç." }
            } 
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { 
                emoji: "🎯", 
                arText: "تَثْبِيت", 
                trText: "Tespit / Sabitleme / Sağlamlaştırma / Belirleme.",
                ornek: { ar: "تَثْبِيتُ الْأَسْعَارِ", tr: "Fiyatların tespiti (sabitlenmesi)." }
            } 
        },
    },

    // ==================================================================
    // 82. TH-M-R (ث م ر) KÖKÜ - Meyve Vermek / Sonuç Vermek
    // ==================================================================
    "ثمر": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🌱", 
                arText: "ثَمَرَ", 
                trText: "Meyve verdi / Ürün verdi.",
                ornek: { ar: "ثَمَرَ الشَّجَرُ", tr: "Ağaç meyve verdi." }
            }
            // Çekimi nadir olduğu için dizi kaldırıldı.
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "🌿", 
                arText: "يَثْمُرُ", 
                trText: "Meyve verir.",
                ornek: { ar: "الْعَمَلُ الصَّالِحُ يَثْمُرُ خَيْرًا", tr: "İyi iş hayırlı meyve (sonuç) verir." }
            }
            // Çekimi nadir olduğu için dizi kaldırıldı.
        },

        // --- 17 Numaralı Kalıp (Çoğul İsim ve Tekil Mastar Geçişi) ---
        17: { 
            base: { 
                emoji: "🍎", 
                arText: "ثَمَر", 
                trText: "Meyveler / Ürünler (Cins isim).",
                ornek: { ar: "يَقْطِفُونَ الثَّمَرَ", tr: "Meyveleri (ürünleri) topluyorlar." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🍏", 
                arText: "ثَمَرَة", 
                trText: "Semere / Tek bir meyve / Sonuç.",
                ornek: { ar: "ثَمَرَةُ النَّجَاحِ", tr: "Başarının semeresi (meyvesi)." }
            } 
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - İstif'âl Babı Masdarı) ---
        103: { 
            base: { 
                emoji: "📈", 
                arText: "اِسْتِثْمَار", 
                trText: "Yatırım / Değerlendirme (Yine diller arası anlam kaymasının (semantik değişimin) bir örneği olarak; Arapçada 'Meyve verdirmek / Yatırım yapmak' gibi olumlu bir anlama gelirken, Türkçede 'İstismar / Kötüye kullanıp sömürmek' şeklinde kullanılır).",
                ornek: { ar: "اِسْتِثْمَارُ الْأَمْوَالِ", tr: "Sermaye yatırımı / Parayı değerlendirme." }
            } 
        },
    },

    // ==================================================================
    // 83. TH-Q-L (ث ق ل) KÖKÜ - Ağır Olmak
    // ==================================================================
    "ثقل": {
        // --- 10 Numaralı Kalıp (Mücerret 5. Bab Mazi) ---
        10: { 
            base: { 
                emoji: "⚖️", 
                arText: "ثَقُلَ", 
                trText: "Ağır oldu / Ağır geldi.",
                ornek: { ar: "ثَقُلَ الْحِمْلُ", tr: "Yük ağır oldu." }
            }
            // Çekimi nadir olduğu için dizi kaldırıldı.
        },

        // --- 11 Numaralı Kalıp (Mücerret 5. Bab Muzari) ---
        11: { 
            base: { 
                emoji: "🏋️", 
                arText: "يَثْقُلُ", 
                trText: "Ağır olur / Zor gelir.",
                ornek: { ar: "يَثْقُلُ عَلَيَّ هَذَا الْعَمَلُ", tr: "Bu iş bana ağır geliyor." }
            }
            // Çekimi nadir olduğu için dizi kaldırıldı.
        },

        // --- 20 Numaralı Kalıp (فِعْل ve + ة ile فِعْلَة - Masdar-ı Hey'et) ---
        20: { 
            base: { 
                emoji: "📦", 
                arText: "ثِقْل", 
                trText: "Sıkl / Yük, Ağırlık (Maddi veya manevi).",
                ornek: { ar: "ثِقْلُ الْمَسْؤُولِيَّةِ", tr: "Sorumluluğun yükü (ağırlığı)." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🥊", 
                arText: "ثِقْلَة", 
                trText: "Sıklet / Ağırlık derecesi, ağırlık basması.",
                ornek: { 
                    ar: "بَطَلُ الثِّقْلَةِ الثَّقِيلَةِ", 
                    tr: "Ağır sıklet şampiyonu :) (Modern Arapçada 'Ağır Sıklet' için 'الوَزْن الثَّقِيل' dense de, dilimize geçen tam kök mantığı budur)." 
                }
            } 
        },

        // --- 35 Numaralı Kalıp (فَعِيل - Sıfat) ---
        35: { 
            base: { 
                emoji: "🪨", 
                arText: "ثَقِيل", 
                trText: "Sakil / Ağır.",
                ornek: { ar: "هَذَا حَجَرٌ ثَقِيلٌ", tr: "Bu ağır bir taştır." }
            } 
        }
    },

     // ==================================================================
    // 84. Z-K-R (ذ ك ر) KÖKÜ - Hatırlamak / Anmak
    // ==================================================================
    "ذكر": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🧠", 
                arText: "ذَكَرَ", 
                trText: "Hatırladı / Andı.",
                ornek: { ar: "ذَكَرَ اللهَ كَثِيرًا", tr: "Allah'ı çokça andı." }
            }
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "⏳", 
                arText: "يَذْكُرُ", 
                trText: "Hatırlar / Anar.",
                ornek: { ar: "يَذْكُرُ رَبَّهُ", tr: "Rabbini anar." }
            }
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { 
                emoji: "❗", 
                arText: "اُذْكُرْ", 
                trText: "Hatırla / An!",
                ornek: { ar: "اُذْكُرْ رَبَّكَ", tr: "Rabbini an (hatırla)!" }
            }
        },

        // --- 20 Numaralı Kalıp (فِعْل - Mücerret Masdar) ---
        20: { 
            base: { 
                emoji: "📿", 
                arText: "ذِكْر", 
                trText: "Zikir / Anma / Hatırlama.",
                ornek: { ar: "ذِكْرُ اللهِ", tr: "Allah'ı anmak." }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "👤", 
                arText: "ذَاكِر", 
                trText: "Zâkir / Anan, hatırlayan, zikreden.",
                ornek: { ar: "الذَّاكِرُونَ اللهَ", tr: "Allah'ı (çokça) ananlar." }
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "📌", 
                arText: "مَذْكُور", 
                trText: "Mezkûr / Anılan, adı geçen, zikredilen.",
                ornek: { ar: "الشَّيْءُ الْمَذْكُورُ", tr: "Mezkûr (adı geçen) şey." }
            } 
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Mufâ'ale Babı Masdarı) ---
        67: { 
            base: { 
                emoji: "🗣️", 
                arText: "مُذَاكَرَة", 
                trText: "Müzakere / Karşılıklı konuşup tartışma, birlikte ders çalışma.",
                ornek: { ar: "مُذَاكَرَةُ الدُّرُوسِ", tr: "Dersleri müzakere etmek (birlikte çalışıp hatırlamak)." }
            } 
        },

        // --- 88 Numaralı Kalıp (تَفَعُّل - Tefa'ul Babı Mazi) ---
        88: { 
            base: { 
                emoji: "🤔", 
                arText: "تَذَكَّرَ", 
                trText: "Hatırladı (Düşünüp aklına getirdi).",
                ornek: { ar: "تَذَكَّرَ الْمَاضِيَ", tr: "Geçmişi hatırladı." }
            } 
        },

        // --- 89 Numaralı Kalıp (تَفَعُّل - Tefa'ul Babı Muzari) ---
        89: { 
            base: { 
                emoji: "💭", 
                arText: "يَتَذَكَّرُ", 
                trText: "Hatırlar / Düşünüp aklına getirir.",
                ornek: { ar: "هَلْ تَتَذَكَّرُنِي؟", tr: "Beni hatırlıyor musun?" }
            } 
        },

        // --- 90 Numaralı Kalıp (تَفَعُّل - Tefa'ul Babı Emir) ---
        90: { 
            base: { 
                emoji: "💡", 
                arText: "تَذَكَّرْ", 
                trText: "Hatırla (Düşünüp aklına getir, ibret al)!",
                ornek: { ar: "تَذَكَّرْ وَعْدَكَ", tr: "Sözünü hatırla!" }
            } 
        },

        // --- 91 Numaralı Kalıp (تَفَعُّل - Tefa'ul Babı Masdarı) ---
        91: { 
            base: { 
                emoji: "📚", 
                arText: "تَذَكُّر", 
                trText: "Tezekkür / Hatırlama, üzerinde düşünüp ibret alma.",
                ornek: { ar: "قُوَّةُ التَّذَكُّرِ", tr: "Hatırlama gücü (Hafıza)." }
            } 
        }
    },

    // ==================================================================
    // 85. Z-H-B (ذ ه ب) KÖKÜ - Gitmek
    // ==================================================================
    "ذهب": {
        // --- 1 Numaralı Kalıp (Mücerret 3. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🚶", 
                arText: "ذَهَبَ", 
                trText: "Gitti.",
                ornek: { ar: "ذَهَبَ إِلَى الْمَدْرَسَةِ", tr: "Okula gitti." }
            },
        },

        // --- 6 Numaralı Kalıp (Mücerret 3. Bab Muzari) ---
        6: { 
            base: { 
                emoji: "⏳", 
                arText: "يَذْهَبُ", 
                trText: "Gider / Gidiyor.",
                ornek: { ar: "يَذْهَبُ إِلَى الْعَمَلِ كُلَّ يَوْمٍ", tr: "Her gün işe gider." }
            },
        },

        // --- 7 Numaralı Kalıp (Mücerret 3. Bab Emir) ---
        7: { 
            base: { 
                emoji: "👉", 
                arText: "اِذْهَبْ", 
                trText: "Git!",
                ornek: { ar: "اِذْهَبْ إِلَى فِرْعَوْنَ", tr: "Firavun'a git!" }
            },
        },

        17: { 
            base: { 
                emoji: "🏆", 
                arText: "ذَهَب", 
                trText: "Zeheb / Altın.",
                ornek: { ar: "خَاتَمٌ مِنْ ذَهَبٍ", tr: "Altından bir yüzük." }
            } 
        }, 

        // --- 22 Numaralı Kalıp (فَعَال - Mücerret Masdar) ---
        22: { 
            base: { 
                emoji: "🛤️", 
                arText: "ذَهَاب", 
                trText: "Zehab / Gidiş / Bir düşünceye kapılma.",
                ornek: { ar: "ذَهَابٌ وَإِيَابٌ", tr: "Gidiş ve dönüş." }
            } 
        },

        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekân) ---
        38: { 
            base: { 
                emoji: "🧭", 
                arText: "مَذْهَب", 
                trText: "Mezhep / Gidilen yol, izlenen yöntem, inanç akımı.",
                ornek: { ar: "حُرِّيَّةُ الْمَذْهَبِ", tr: "Mezhep (inanç/görüş) özgürlüğü." }
            } 
        },

       // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { 
                emoji: "✨", 
                arText: "تَذْهِيب", 
                trText: "Tezhip / Altınlamak, yaldız çekmek. (💡 Not: Tef'îl babının çok güzel bir özelliği vardır; bazen isimleri alır ve onlardan 'o nesneyle bir iş yapmak, o maddeyle kaplamak' anlamında kelimeler türetir. İsim: ذَهَب (Altın) ➔ Tef'îl: تَذْهِيب (Altınlamak). Yani Türkçedeki o meşhur el yazmalarını süsleme sanatımız olan Tezhip, doğrudan 'Altın' kelimesinden doğmuştur ve tam kök manası 'Altınlama sanatı' demektir.)",
                ornek: { ar: "فَنُّ التَّذْهِيبِ", tr: "Tezhip (altınla süsleme) sanatı." }
            } 
        }
    },

    // ==================================================================
    // 86. Z-W-Q (ذ و ق) KÖKÜ - Tatmak (Ajvef / İlletli Kök)
    // ==================================================================
    "ذوق": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "👅", 
                arText: "ذَاقَ", 
                trText: "Tattı.",
                ornek: { ar: "ذَاقَ طَعْمَ النَّجَاحِ", tr: "Başarının tadını tattı." }
            },
            cekimi: ["ذَاقَ", "ذَاقَا", "ذَاقُوا", "ذَاقَتْ", "ذَاقَتَا", "ذُقْنَ", "ذُقْتَ", "ذُقْتُمَا", "ذُقْتُمْ", "ذُقْتِ", "ذُقْتُمَا", "ذُقْتُنَّ", "ذُقْتُ", "ذُقْنَا", "ذُقْنَا"]
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "⏳", 
                arText: "يَذُوقُ", 
                trText: "Tadar / Tadıyor.",
                ornek: { ar: "مَنْ يَذُقْ يَعْرِفْ", tr: "Tadan bilir (Meşhur Arapça atasözü)." }
            },
            cekimi: ["يَذُوقُ", "يَذُوقَانِ", "يَذُوقُونَ", "تَذُوقُ", "تَذُوقَانِ", "يَذُقْنَ", "تَذُوقُ", "تَذُوقَانِ", "تَذُوقُونَ", "تَذُوقِينَ", "تَذُوقَانِ", "تَذُقْنَ", "أَذُوقُ", "نَذُوقُ", "نَذُوقُ"]
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { 
                emoji: "🥄", 
                arText: "ذُقْ", 
                trText: "Tat!",
                ornek: { ar: "ذُقْ هَذَا الطَّعَامَ", tr: "Bu yemeği tat!" }
            },
            cekimi: ["ذُقْ", "ذُوقَا", "ذُوقُوا", "ذُوقِي", "ذُوقَا", "ذُقْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "✨", 
                arText: "ذَوْق", 
                trText: "Zevk / Tat alma, haz, ince beğeni.",
                ornek: { ar: "رَجُلٌ ذُو ذَوْقٍ رَفِيعٍ", tr: "İnce zevk sahibi bir adam." }
            } 
        }
    },
// ==================================================================
    // 87. Z-R-A' (ز ر ع) KÖKÜ - Ekmek / Tarım Yapmak
    // ==================================================================
    "زرع": {
        // --- 1 Numaralı Kalıp (Mücerret 3. Bab Mazi) ---
        1: { 
            base: { emoji: "🌱", arText: "زَرَعَ", trText: "Ekti / Biçti." },
            cekimi: ["زَرَعَ", "زَرَعَا", "زَرَعُوا", "زَرَعَتْ", "زَرَعَتَا", "زَرَعْنَ", "زَرَعْتَ", "زَرَعْتُمَا", "زَرَعْتُمْ", "زَرَعْتِ", "زَرَعْتُمَا", "زَرَعْتُنَّ", "زَرَعْتُ", "زَرَعْنَا", "زَرَعْنَا"]
        },

        // --- 6 Numaralı Kalıp (Mücerret 3. Bab Muzari) ---
        6: { 
            base: { emoji: "🌾", arText: "يَزْرَعُ", trText: "Eker / Ekiyor." },
            cekimi: ["يَزْرَعُ", "يَزْرَعَانِ", "يَزْرَعُونَ", "تَزْرَعُ", "تَزْرَعَانِ", "يَزْرَعْنَ", "تَزْرَعُ", "تَزْرَعَانِ", "تَزْرَعُونَ", "تَزْرَعِينَ", "تَزْرَعَانِ", "تَزْرَعْنَ", "أَزْرَعُ", "نَزْرَعُ", "نَزْرَعُ"]
        },

        // --- 7 Numaralı Kalıp (Mücerret 3. Bab Emir) ---
        7: { 
            base: { emoji: "❗", arText: "اِزْرَعْ", trText: "Ek / Biç!" },
            cekimi: ["اِزْرَعْ", "اِزْرَعَا", "اِزْرَعُوا", "اِزْرَعِي", "اِزْرَعَا", "اِزْرَعْنَ"]
        },

        // --- 23 Numaralı Kalıp (فِعَال ve + ة ile Ziraat) ---
        23: { 
            base: { },
            suggestsPlus: true,
            "ة": { 
                emoji: "🌾", 
                arText: "زِرَاعَة", 
                trText: "Ziraat / Tarım.",
                ornek: { ar: "بَنْكُ الزِّرَاعَةِ", tr: "Ziraat Bankası" }
            } 
        },

        // --- 38 Numaralı Kalıp (مَفْعَل ve + ة ile Mezraa) ---
        38: { 
            base: {},
            suggestsPlus: true,
            "ة": { 
                emoji: "🏡", 
                arText: "مَزْرَعَة", 
                trText: "Mezraa / Çiftlik, tarım yapılan yer.",
                ornek: { ar: "مَزْرَعَةُ جَدِّي", tr: "Dedemin çiftliği (mezraası)." }
            } 
        }
    },

// ==================================================================
    // 88. Z-W-R (ز و ر) KÖKÜ - Ziyaret Etmek (Ajvef / İlletli Kök)
    // ==================================================================
    "زور": {
         // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🚶‍♂️", 
                arText: "زَارَ", 
                trText: "Ziyaret etti / Uğradı.",
                ornek: { ar: "زَارَ الْمَرِيضَ", tr: "Hastayı ziyaret etti." }
            },
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "⏳", 
                arText: "يَزُورُ", 
                trText: "Ziyaret eder / Ediyor.",
                ornek: { ar: "يَزُورُ أَقَارِبَهُ", tr: "Akrabalarını ziyaret ediyor." }
            },
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { 
                emoji: "🚪", 
                trText: "Ziyaret et / Uğra!",
                ornek: { ar: "زُرْ غِبًّا تَزْدَدْ حُبًّا", tr: "Seyrek ziyaret et ki sevgin (muhabbetin) artsın. (Meşhur Arap atasözü)" }
            },
        },

        // --- 23 Numaralı Kalıp (فِعَالَة - Mücerret Masdar) ---
        23: { 
            base: { 
                emoji: "🤝", 
                arText: "زِيَارَة", 
                trText: "Ziyaret / Uğrama, görüşme.",
                ornek: { ar: "زِيَارَةُ الْأَقَارِبِ", tr: "Akraba ziyareti." }
            } 
        },

        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekân) ---
        38: { 
            base: { 
                emoji: "🪦", 
                arText: "مَزَار", 
                trText: "Mezar / Ziyaret yeri, türbe. (💡 Not: Arapçada İsm-i Mekân kalıbı 'eylemin yapıldığı yer' demektir. Yani 'Mezar', etimolojik olarak 'ölünün yattığı yer' değil, 'dirilerin onu ziyarete gittiği yer' manasına gelir. Çok zarif bir bakış açısıdır).",
                ornek: { ar: "مَزَارَاتُ الشُّهَدَاءِ", tr: "Şehitlerin mezarları (ziyaretgâhları)." }
            } 
        }
    },

    // ==================================================================
    // 89. Z-H-M (ز ح م) KÖKÜ - Sıkıştırmak / İtmek
    // ==================================================================
    "زحم": {
       

        // --- 19 Numaralı Kalıp (فَعْل ve + ة ile Zahmet) ---
        19: { 
            base: {},
            suggestsPlus: true,
            "ة": { 
                emoji: "😓", 
                arText: "زَحْمَة", 
                trText: "Zahmet / Sıkışıklık. (💡 Semantik Değişim: Kelime Arapçada aslen 'kalabalık, sıkışıklık' anlamına gelirken, Türkçede bu sıkışıklığın doğurduğu 'yorgunluk, meşakkat, zorluk' şeklinde bir anlam kaymasına uğramıştır).",
                ornek: { ar: "زَحْمَةُ السَّيْرِ", tr: "Trafik sıkışıklığı (zahmeti)." }
            } 
        },

        
        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi) ---
        77: { 
            base: { 
                emoji: "🚧", 
                arText: "اِزْدَحَمَ", 
                trText: "İzdiham oldu / Aşırı sıkıştı." 
            },
            cekimi: ["اِزْدَحَمَ", "اِزْدَحَمَا", "اِزْدَحَمُوا", "اِزْدَحَمَتْ", "اِزْدَحَمَتَا", "اِزْدَحَمْنَ", "اِزْدَحَمْتَ", "اِزْدَحَمْتُمَا", "اِزْدَحَمْتُمْ", "اِزْدَحَمْتِ", "اِزْدَحَمْتُمَا", "اِزْدَحَمْتُنَّ", "اِزْدَحَمْتُ", "اِزْدَحَمْنَا", "اِزْدَحَمْنَا"]
        },

        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - İfti'âl Babı Muzari) ---
        78: { 
            base: { emoji: "🚶‍♂️", arText: "يَزْدَحِمُ", trText: "İzdiham olur / Sıkışıyor." },
            cekimi: ["يَزْدَحِمُ", "يَزْدَحِمَانِ", "يَزْدَحِمُونَ", "تَزْدَحِمُ", "تَزْدَحِمَانِ", "يَزْدَحِمْنَ", "تَزْدَحِمُ", "تَزْدَحِمَانِ", "تَزْدَحِمُونَ", "تَزْدَحِمِينَ", "تَزْدَحِمَانِ", "تَزْدَحِمْنَ", "أَزْدَحِمُ", "نَزْدَحِمُ", "نَزْدَحِمُ"]
        },

        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - İfti'âl Babı Emir) ---
        79: { 
            base: { emoji: "❗", arText: "اِزْدَحِمْ", trText: "Sıkış / Yığıl!" },
            cekimi: ["اِزْدَحِمْ", "اِزْدَحِمَا", "اِزْدَحِمُوا", "اِزْدَحِمِي", "اِزْدَحِمَا", "اِزْدَحِمْنَ"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "👥", 
                arText: "اِزْدِحَام", 
                trText: "İzdiham / Aşırı kalabalık, yığılma.",
                ornek: [
                    { 
                        ar: "اِزْدِحَامٌ شَدِيدٌ", 
                        tr: "Şiddetli izdiham (kalabalık)." 
                    },
                    { 
                        ar: "💡 قَاعِدَة صَرْفِيَّة", 
                        tr: "Sarf Kuralı (Ses Olayı): İfti'âl babının kuralı gereği, kökün ilk harfi 'ز' (Ze) olduğunda, telaffuzu kolaylaştırmak için babın 'ت' (Te) harfi 'د' (Dal) harfine dönüşür. Aslı 'اِزْتِحَام' (İztiham) iken dile daha yumuşak gelmesi için 'اِزْدِحَام' (İzdiham) olmuştur." 
                    }
                ]
            } 
        },

        // --- 81 Numaralı Kalıp (مُفْتَعِل - İfti'âl Babı İsm-i Fâili) ---
        81: {
            base: {
                emoji: "🧍",
                arText: "مُزْدَحِم",
                trText: "Kalabalık olan, tıklım tıklım.",
                ornek: { ar: "شَارِعٌ مُزْدَحِمٌ", tr: "Kalabalık (müzdehim) cadde." }
            }
        }
    },

    // ==================================================================
    // 90. S-B-R (ص ب ر) KÖKÜ - Sabretmek / Direnmek
    // 2. Bab (فَعَلَ - يَفْعِلُ) ve İfti'âl Babı
    // ==================================================================
    "صبر": {
        // --- 1 Numaralı Kalıp (Mücerret 2. Bab Mazi) ---
        1: { 
            base: { emoji: "⏳", arText: "صَبَرَ", trText: "Sabretti / Dayandı." },
        },

        // --- 4 Numaralı Kalıp (Mücerret 2. Bab Muzari) ---
        4: { 
            base: { emoji: "🧘", arText: "يَصْبِرُ", trText: "Sabreder / Dayanıyor." },
        },

        // --- 5 Numaralı Kalıp (Mücerret 2. Bab Emir) ---
        5: { 
            base: { 
                emoji: "❗", 
                arText: "اِصْبِرْ", 
                trText: "Sabret!",
                ornek: { ar: "اِصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللهِ", tr: "Sabret! Senin sabrın da ancak Allah'ın yardımıyladır. (Nahl Suresi, 127)" }
            },
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "🧱", 
                arText: "صَبْر", 
                trText: "Sabır / Direnç.",
                ornek: { ar: "الصَّبْرُ مِفْتَاحُ الْفَرَجِ", tr: "Sabır, kurtuluşun (ferahlığın) anahtarıdır." }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🧍", 
                arText: "صَابِر", 
                trText: "Sabreden.",
                ornek: { ar: "إِنَّ اللهَ مَعَ الصَّابِرِينَ", tr: "Şüphesiz Allah, sabredenlerle beraberdir. (Bakara Suresi, 153)" }
            } 
        },

        

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "🏋️", 
                arText: "اِصْطِبَار", 
                trText: "Istıbar / Güçlü sabır, katlanma.",
                ornek: [
                    { 
                        ar: "فَاعْبُدْهُ وَاصْطَبِرْ لِعِبَادَتِهِ", 
                        tr: "O halde O'na kulluk et ve O'na kullukta güçlü bir sabır (ıstıbar) göster. (Meryem Suresi, 65)" 
                    },
                    { 
                        ar: "💡 قَاعِدَة صَرْفِيَّة", 
                        tr: "Sarf Kuralı (Ses Olayı): İfti'âl babının kuralı gereği, kökün ilk harfi kalın olan 'ص' olduğunda, telaffuz zorluğunu aşmak için babın ince 'ت' (Te) harfi kalınlaşarak 'ط' (Ta) harfine dönüşür. Aslı 'اِصْتِبَار' (İstibar) iken 'اِصْطِبَار' (Istıbar) olmuştur." 
                    }
                ]
            } 
        }
    },

    // ==================================================================
    // 91. S-N-A' (ص ن ع) KÖKÜ - Yapmak / Üretmek / Sanat
    // 3. Bab (فَعَلَ - يَفْعَلُ) ve İfti'âl Babı
    // ==================================================================
    "صنع": {
        // --- 1 Numaralı Kalıp (Mücerret 3. Bab Mazi) ---
        1: { 
            base: { emoji: "🛠️", arText: "صَنَعَ", trText: "Yaptı / Üretti." },
        },

        // --- 6 Numaralı Kalıp (Mücerret 3. Bab Muzari) ---
        6: { 
            base: { emoji: "⚙️", arText: "يَصْنَعُ", trText: "Yapar / Üretir." },
        },

        // --- 7 Numaralı Kalıp (Mücerret 3. Bab Emir) ---
        7: { 
            base: { emoji: "❗", arText: "اِصْنَعْ", trText: "Yap / Üret!" },
        },

        // --- 19 Numaralı Kalıp (فُعْل - Fu'l Vezni) ---
        19: { 
            base: { 
                emoji: "🎨", 
                arText: "صُنْع", 
                trText: "Sun' / Yapım, yaratılış sanatı.",
                ornek: { ar: "صُنْعُ اللهِ الَّذِي أَتْقَنَ كُلَّ شَيْءٍ", tr: "Her şeyi sapasağlam (ve sanatlı) yapan Allah'ın sanatıdır (sun'udur). (Neml Suresi, 88)" }
            } 
        },

        // --- 21 Numaralı Kalıp (فَعْل - Fa'l Vezni) ---
        21: { 
            base: { 
                emoji: "🛠️", 
                arText: "صَنْع", 
                trText: "Yapma (Yalın Hâl)." 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🎭", 
                arText: "صَنْعَة", 
                trText: "Sanat / İş, meslek, zanaat.",
                ornek: { ar: "أَرْبَابُ الصَّنْعَةِ", tr: "Sanat erbabı (Sanatkarlar)." }
            } 
        },

        // --- 23 Numaralı Kalıp (فِعَال ve + ة ile Sanayi) ---
        23: { 
            base: { emoji: "🏭", arText: "صِنَاع", trText: "Sanat / Üretim (Yalın Hâl)." },
            suggestsPlus: true,
            "ة": { 
                emoji: "🏭", 
                arText: "صِنَاعَة", 
                trText: "Sanayi / Endüstri / Zanaat.",
                ornek: { ar: "صِنَاعَةُ السَّيَّارَاتِ", tr: "Otomobil sanayisi." }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "👨‍🏭", 
                arText: "صَانِع", 
                trText: "Yapan / Üreten / Sanatkar.",
                ornek: { ar: "الصَّانِعُ الْمَاهِرُ", tr: "Yetenekli sanatkar (usta)." }
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { emoji: "📦", arText: "مَصْنُوع", trText: "Masnu / Yapılmış, üretilmiş." },
            suggestsPlus: true,
            "ات": { 
                emoji: "🏷️", 
                arText: "مَصْنُوعَات", 
                trText: "Masnuat / Üretilmiş mallar, sanayi ürünleri." 
            }
        },

        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekân) ---
        38: { 
            base: { 
                emoji: "🏢", 
                arText: "مَصْنَع", 
                trText: "Masna' / Üretim yeri, Fabrika.",
                ornek: { ar: "عُمَّالُ الْمَصْنَعِ", tr: "Fabrika işçileri." }
            } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "🎭", 
                arText: "اِصْطِنَاع", 
                trText: "Suni (Yapay) olarak üretme / Uydurma.",
                ornek: [
                    {
                        ar: "اِصْطِنَاعُ الْأَعْذَارِ",
                        tr: "Mazeretler uydurma (suni olarak mazeret üretme)."
                    },
                    {
                        ar: "💡 قَاعِدَة صَرْفِيَّة",
                        tr: "Sarf Kuralı (Ses Olayı): Kökün ilk harfi kalın olan 'ص' olduğu için, İfti'âl babının ince 'ت' (Te) harfi kalınlaşarak 'ط' (Ta) harfine dönüşür. Aslı 'اِصْتِنَاع' (İstina') iken telaffuz kolaylığı için 'اِصْطِنَاع' (Istına') olmuştur."
                    }
                ]
            },
            suggestsPlus: true,
            "يّ": { 
                emoji: "🤖", 
                arText: "اِصْطِنَاعِيّ", 
                trText: "Suni / Yapay.",
                ornek: { ar: "الذَّكَاءُ الِاصْطِنَاعِيُّ", tr: "Yapay Zeka." }
            }
        }
    },

    // ==================================================================
    // 92. S-L-H (ص ل ح) KÖKÜ - İyi Olmak / Düzelmek / Barışmak
    // İf'âl Babı Ağırlıklı
    // ==================================================================
    "صلح": {
        // --- 21 Numaralı Kalıp (فُعْل - İsim/Masdar) ---
        21: { 
            base: { 
                emoji: "🕊️", 
                arText: "صُلْح", 
                trText: "Sulh / Barış, uzlaşma.",
                ornek: { ar: "وَالصُّلْحُ خَيْرٌ", tr: "Barış (uzlaşmak) her zaman daha hayırlıdır. (Nisâ Suresi, 128)" }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "😇", 
                arText: "صَالِح", 
                trText: "Salih / İyi, yararlı, ahlaklı insan." 
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "✨", 
                arText: "صَالِحَات", 
                trText: "Salihat / İyi işler, güzel ameller.",
                ornek: { ar: "الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ", tr: "İman edip salih ameller (iyi işler) işleyenler." }
            }
        },

        // --- 38 Numaralı Kalıp (مَفْعَل ve + ة ile Maslahat) ---
        38: { 
            base: {  },
            suggestsPlus: true,
            "ة": { 
                emoji: "⚖️", 
                arText: "مَصْلَحَة", 
                trText: "Maslahat / Genel fayda, kamu yararı, resmi daire.",
                ornek: { ar: "مَصْلَحَةُ الْمُجْتَمَعِ فَوْقَ الْمَصْلَحَةِ الشَّخْصِيَّةِ", tr: "Toplumun maslahatı (faydası), kişisel maslahatın üstündedir." }
            } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi) ---
        52: { 
            base: { emoji: "🔧", arText: "أَصْلَحَ", trText: "Islah etti / Düzeltti / Onardı." },
            cekimi: ["أَصْلَحَ", "أَصْلَحَا", "أَصْلَحُوا", "أَصْلَحَتْ", "أَصْلَحَتَا", "أَصْلَحْنَ", "أَصْلَحْتَ", "أَصْلَحْتُمَا", "أَصْلَحْتُمْ", "أَصْلَحْتِ", "أَصْلَحْتُمَا", "أَصْلَحْتُنَّ", "أَصْلَحْتُ", "أَصْلَحْنَا", "أَصْلَحْنَا"]
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: { 
            base: { emoji: "🛠️", arText: "يُصْلِحُ", trText: "Islah eder / Düzeltiyor." },
            cekimi: ["يُصْلِحُ", "يُصْلِحَانِ", "يُصْلِحُونَ", "تُصْلِحُ", "تُصْلِحَانِ", "يُصْلِحْنَ", "تُصْلِحُ", "تُصْلِحَانِ", "تُصْلِحُونَ", "تُصْلِحِينَ", "تُصْلِحَانِ", "تُصْلِحْنَ", "أُصْلِحُ", "نُصْلِحُ", "نُصْلِحُ"]
        },

        // --- 54 Numaralı Kalıp (أَفْعِلْ - İf'âl Babı Emir) ---
        54: { 
            base: { emoji: "❗", arText: "أَصْلِحْ", trText: "Islah et / Düzelt!" },
            cekimi: ["أَصْلِحْ", "أَصْلِحَا", "أَصْلِحُوا", "أَصْلِحِي", "أَصْلِحَا", "أَصْلِحْنَ"]
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "✨", 
                arText: "إِصْلَاح", 
                trText: "Islah / Düzeltme, iyileştirme.",
                ornek: { ar: "إِصْلَاحُ ذَاتِ الْبَيْنِ", tr: "Küslerin arasını düzeltmek (ıslah etmek)." }
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "📈", 
                arText: "إِصْلَاحَات", 
                trText: "Islahatlar / Reformlar." 
            }
        },

        // --- 56 Numaralı Kalıp (مُفْعِل - İf'âl Babı İsm-i Fâili) ---
        56: { 
            base: { 
                emoji: "🕊️", 
                arText: "مُصْلِح", 
                trText: "Muslih / Islah eden, düzeltici, barıştırıcı.",
                ornek: { ar: "إِنَّمَا نَحْنُ مُصْلِحُونَ", tr: "Bizler ancak ıslah edicileriz (muslihleriz). (Bakara Suresi, 11)" }
            } 
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Müfâ'ale Babı Masdarı) ---
        67: { 
            base: { 
                emoji: "🤝", 
                arText: "مُصَالَحَة", 
                trText: "Musalaha / Karşılıklı barışma, uzlaşma.",
                ornek: { ar: "عَقْدُ مُصَالَحَةٍ", tr: "Barış (uzlaşma) anlaşması." }
            } 
        },
        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi) ---
        77: { 
            base: { 
                emoji: "🤝", 
                arText: "اِصْطَلَحَ", 
                trText: "Uzlaştı / Terim anlamı kazandı." 
            },
            cekimi: ["اِصْطَلَحَ", "اِصْطَلَحَا", "اِصْطَلَحُوا", "اِصْطَلَحَتْ", "اِصْطَلَحَتَا", "اِصْطَلَحْنَ", "اِصْطَلَحْتَ", "اِصْطَلَحْتُمَا", "اِصْطَلَحْتُمْ", "اِصْطَلَحْتِ", "اِصْطَلَحْتُمَا", "اِصْطَلَحْتُنَّ", "اِصْطَلَحْتُ", "اِصْطَلَحْنَا", "اِصْطَلَحْنَا"]
        },

        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - İfti'âl Babı Muzari) ---
        78: { 
            base: { 
                emoji: "🔄", 
                arText: "يَصْطَلِحُ", 
                trText: "Uzlaşır / Terim anlamı kazanır." 
            },
            cekimi: ["يَصْطَلِحُ", "يَصْطَلِحَانِ", "يَصْطَلِحُونَ", "تَصْطَلِحُ", "تَصْطَلِحَانِ", "يَصْطَلِحْنَ", "تَصْطَلِحُ", "تَصْطَلِحَانِ", "تَصْطَلِحُونَ", "تَصْطَلِحِينَ", "تَصْطَلِحَانِ", "تَصْطَلِحْنَ", "أَصْطَلِحُ", "نَصْطَلِحُ", "نَصْطَلِحُ"]
        },

        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - İfti'âl Babı Emir) ---
        79: { 
            base: { 
                emoji: "❗", 
                arText: "اِصْطَلِحْ", 
                trText: "Uzlaş!" 
            },
            cekimi: ["اِصْطَلِحْ", "اِصْطَلِحَا", "اِصْطَلِحُوا", "اِصْطَلِحِي", "اِصْطَلِحَا", "اِصْطَلِحْنَ"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "📖", 
                arText: "اِصْطِلَاح", 
                trText: "Istılah / Terim, üzerinde uzlaşılan özel anlam.",
                ornek: [
                    {
                        ar: "الْمَعْنَى اللُّغَوِيُّ وَالْمَعْنَى الِاصْطِلَاحِيُّ",
                        tr: "Sözlük anlamı ve terim (ıstılah) anlamı."
                    },
                    {
                        ar: "💡 قَاعِدَة صَرْفِيَّة",
                        tr: "Sarf Kuralı (Ses Olayı): Kökün ilk harfi kalın olan 'ص' olduğu için, İfti'âl babının ince 'ت' (Te) harfi kalınlaşarak 'ط' (Ta) harfine dönüşür. Aslı 'اِصْتِلَاح' (İstilah) iken telaffuz kolaylığı için 'اِصْطِلَاح' (Istılah) olmuştur."
                    }
                ]
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "📚", 
                arText: "اِصْطِلَاحَات", 
                trText: "Istılahat / Terimler.",
                ornek: { ar: "مُعْجَمُ الِاصْطِلَاحَاتِ الْعِلْمِيَّةِ", tr: "Bilimsel terimler sözlüğü." }
            }
        }
    },

       // ==================================================================
    // 93. D-L-L (ض ل ل) KÖKÜ - Sapmak / Yolunu Kaybetmek
    // 2. Bab (فَعَلَ - يَفْعِلُ)
    // ==================================================================

    "ضلل": {
        1: { 
            base: { emoji: "🌑", arText: "ضَلَّ", trText: "Saptı / Yolunu kaybetti." },
        },
        4: { 
            base: { emoji: "❓", arText: "يَضِلُّ", trText: "Sapıyor / Sapar." },
        },
        5: { 
            base: { emoji: "🚫", arText: "ضِلَّ", trText: "Sap! (اِضْلِلْ)" },
            cekimi: ["ضِلَّ", "ضِلَّا", "ضِلُّوا", "ضِلِّي", "ضِلَّا", "اِضْلِلْنَ"]
        },
        33: {
            base: { emoji: "📉", arText: "ضَالّ", trText: "Sapan / Doğru yoldan ayrılan." }
        },
        36: {
            base: { emoji: "🌀", arText: "مَضْلُول", trText: "Saptırılmış." }
        },
        50: {
            base: { emoji: "⚠️", arText: "أَضَلُّ", trText: "Daha sapkın / En sapkın." },
            ornek: { 
                ar: "وَمَنْ أَضَلُّ مِمَّنِ اتَّبَعَ هَوَاهُ", 
                tr: "Kendi heva ve hevesine uyandan daha sapkın kim olabilir? (Kasas Suresi, 50)" 
            }
        }
    }, // <-- تم إضافة قوس الإغلاق هنا
// ==================================================================
    // 93. D-R-B (ض ر ب) KÖKÜ - Vurmak / Örnek Vermek / Çalkalanmak
    // 2. Bab (فَعَلَ - يَفْعِلُ) ve İfti'âl Babı
    // ==================================================================
    "ضرب": {
        // --- 1 Numaralı Kalıp (Mücerret 2. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "💥", 
                arText: "ضَرَبَ", 
                trText: "Vurdu / Örnek verdi / Çarptı.",
                ornek: [
                    { 
                        ar: "ضَرَبَ زَيْدٌ عَمْرًا", 
                        tr: "Zeyd Amr'a vurdu. (Klasik Nahiv örneği ve meşhur bir kalıp)." 
                    },
                    {
                        ar: "أَلَمْ تَرَ كَيْفَ ضَرَبَ اللهُ مَثَلًا كَلِمَةً طَيِّبَةً",
                        tr: "Görmedin mi Allah nasıl bir misal (örnek) getirdi: Güzel bir söz... (İbrâhîm Suresi, 24)"
                    }
                ]
            },
            cekimi: ["ضَرَبَ", "ضَرَبَا", "ضَرَبُوا", "ضَرَبَتْ", "ضَرَبَتَا", "ضَرَبْنَ", "ضَرَبْتَ", "ضَرَبْتُمَا", "ضَرَبْتُمْ", "ضَرَبْتِ", "ضَرَبْتُمَا", "ضَرَبْتُنَّ", "ضَرَبْتُ", "ضَرَبْنَا", "ضَرَبْنَا"]
        },

        // --- 4 Numaralı Kalıp (Mücerret 2. Bab Muzari) ---
        4: { 
            base: { 
                emoji: "🎯", 
                arText: "يَضْرِبُ", 
                trText: "Vurur / Örnek veriyor / Dolaşır.",
                ornek: { 
                    ar: "وَيَضْرِبُ اللهُ الْأَمْثَالَ لِلنَّاسِ لَعَلَّهُمْ يَتَذَكَّرُونَ", 
                    tr: "Allah insanlara misaller (örnekler) verir, umulur ki düşünüp öğüt alırlar. (İbrâhîm Suresi, 25)" 
                }
            },
            cekimi: ["يَضْرِبُ", "يَضْرِبَانِ", "يَضْرِبُونَ", "تَضْرِبُ", "تَضْرِبَانِ", "يَضْرِبْنَ", "تَضْرِبُ", "تَضْرِبَانِ", "تَضْرِبُونَ", "تَضْرِبِينَ", "تَضْرِبَانِ", "تَضْرِبْنَ", "أَضْرِبُ", "نَضْرِبُ", "نَضْرِبُ"]
        },

        // --- 5 Numaralı Kalıp (Mücerret 2. Bab Emir) ---
        5: { 
            base: { 
                emoji: "❗", 
                arText: "اِضْرِبْ", 
                trText: "Vur / Örnek ver!",
                ornek: {
                    ar: "فَقُلْنَا اضْرِبُوهُ بِبَعْضِهَا",
                    tr: "Bunun üzerine, 'Kesilen ineğin bir parçasıyla o maktule vurun' dedik. (Bakara Suresi, 73)"
                }
            },
            cekimi: ["اِضْرِبْ", "اِضْرِبَا", "اِضْرِبُوا", "اِضْرِبِي", "اِضْرِبَا", "اِضْرِبْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "🥊", 
                arText: "ضَرْب", 
                trText: "Darp / Vurma",
                ornek: { 
                    ar: "تَعَرَّضَ لِلضَّرْبِ", 
                    tr: "Darba (saldırıya) maruz kaldı." 
                }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "⚠️", 
                arText: "ضَرْبَة", 
                trText: "Darbe / Bir kere vurma (Masdar-ı Merra).",
                ornek: { ar: "ضَرْبَةُ شَمْسٍ", tr: "Güneş çarpması." }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🤺", 
                arText: "ضَارِب", 
                trText: "Dârib / Vuran, çarpan, seyahat eden.",
                ornek: { 
                    ar: "هُوَ ضَارِبٌ فِي الْأَرْضِ", 
                    tr: "O, yeryüzünde seyahat eden (adım atan/rızık arayan) biridir." 
                }
            }
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "🤕", 
                arText: "مَضْرُوب", 
                trText: "Madrûb / Vurulmuş olan, çarpılan.",
                ornek: { 
                    ar: "الرَّقَمُ الْمَضْرُوبُ فِي خَمْسَةٍ", 
                    tr: "Beş ile çarpılan sayı. (Matematiksel kullanım)." 
                }
            }
        },

        // --- 39 Numaralı Kalıp (مِفْعَل - İsm-i Alet) ---
        39: { 
            base: { 
                emoji: "🎸", 
                arText: "مِضْرَب", 
                trText: "Mızrap / Vurma aleti, raket, tellere vurulan çubuk.",
                ornek: { ar: "مِضْرَبُ التِّنِسِ", tr: "Tenis raketi." }
            } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi) ---
        77: { 
            base: { 
                emoji: "🌊", 
                arText: "اِضْطَرَبَ", 
                trText: "Çalkalandı / Sarsıldı / Izdırap çekti." 
            },
            cekimi: ["اِضْطَرَبَ", "اِضْطَرَبَا", "اِضْطَرَبُوا", "اِضْطَرَبَتْ", "اِضْطَرَبَتَا", "اِضْطَرَبْنَ", "اِضْطَرَبْتَ", "اِضْطَرَبْتُمَا", "اِضْطَرَبْتُمْ", "اِضْطَرَبْتِ", "اِضْطَرَبْتُمَا", "اِضْطَرَبْتُنَّ", "اِضْطَرَبْتُ", "اِضْطَرَبْنَا", "اِضْطَرَبْنَا"]
        },

        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - İfti'âl Babı Muzari) ---
        78: { 
            base: { 
                emoji: "🌪️", 
                arText: "يَضْطَرِبُ", 
                trText: "Çalkalanır / Sarsılıyor.",
                ornek: { 
                    ar: "يَضْطَرِبُ الْبَحْرُ فِي الشِّتَاءِ", 
                    tr: "Kışın deniz çalkalanır (dalgalanır)." 
                }
            },
            cekimi: ["يَضْطَرِبُ", "يَضْطَرِبَانِ", "يَضْطَرِبُونَ", "تَضْطَرِبُ", "تَضْطَرِبَانِ", "يَضْطَرِبْنَ", "تَضْطَرِبُ", "تَضْطَرِبَانِ", "تَضْطَرِبُونَ", "تَضْطَرِبِينَ", "تَضْطَرِبَانِ", "تَضْطَرِبْنَ", "أَضْطَرِبُ", "نَضْطَرِبُ", "نَضْطَرِبُ"]
        },

        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - İfti'âl Babı Emir) ---
        79: { 
            base: { 
                emoji: "❗", 
                arText: "اِضْطَرِبْ", 
                trText: "Çalkalan / Sarsıl!" 
            },
            cekimi: ["اِضْطَرِبْ", "اِضْطَرِبَا", "اِضْطَرِبُوا", "اِضْطَرِبِي", "اِضْطَرِبَا", "اِضْطَرِبْنَ"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "😖", 
                arText: "اِضْطِرَاب", 
                trText: "Izdırap / Çalkantı, düzensizlik, acı çekme.",
                ornek: [
                    { 
                        ar: "اِضْطِرَابَاتٌ نَفْسِيَّةٌ", 
                        tr: "Psikolojik rahatsızlıklar (çalkantılar)." 
                    },
                    { 
                        ar: "💡 قَاعِدَة صَرْفِيَّة (إِبْدَال)", 
                        tr: "Sarf Kuralı (Ses Olayı): İfti'âl babının kuralı gereği, kökün ilk harfi kalın olan 'ض' olduğunda, telaffuz zorluğunu aşmak için babın ince 'ت' (Te) harfi kalınlaşarak 'ط' (Ta) harfine dönüşür. Aslı 'اِضْتِرَاب' (İztirap) iken 'اِضْطِرَاب' (Izdırap/Istırap) olmuştur." 
                    }
                ]
            } 
        },

         // --- 81 Numaralı Kalıp (مُفْتَعِل - İfti'âl Babı İsm-i Fâili) ---
        81: { 
            base: { 
                emoji: "🤕", 
                arText: "مُضْطَرِب", 
                trText: "Muzdarip / Izdırap çeken, sıkıntılı, çalkantılı.",
                ornek: { ar: "هُوَ مُضْطَرِبٌ مِنْ هَذَا الْوَضْعِ", tr: "O bu durumdan (halden) muzdariptir." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🤒", 
                arText: "مُضْطَرِبَة", 
                trText: "Muzdarip, çalkantılı, düzensiz.",
                ornek: { ar: "أَوْضَاعٌ جَوِّيَّةٌ مُضْطَرِبَةٌ", tr: "Çalkantılı (düzensiz) hava durumları." }
            }
        }
    },

    // ==================================================================
    // 94. D-R-R (ض ر ر) KÖKÜ - Zarar Vermek (Muzaaf Fiil)
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve İfti'âl Babı
    // ==================================================================
    "ضرر": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi - Muzaaf) ---
        1: { 
            base: { emoji: "📉", arText: "ضَرَّ", trText: "Zarar verdi." },
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { emoji: "⚠️", arText: "يَضُرُّ", trText: "Zarar verir / Veriyor." },
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { emoji: "❗", arText: "ضُرَّ", trText: "Zarar ver! (اِضْرُرْ)" },
        },

        // --- 17 Numaralı Kalıp (فَعَل - Mücerret İsim/Masdar) ---
        17: { 
            base: { 
                emoji: "🔥", 
                arText: "ضَرَر", 
                trText: "Zarar.",
                ornek: { ar: "لَا ضَرَرَ وَلَا ضِرَارَ", tr: "İslam'da zarar vermek de, zarara zararla karşılık vermek de yoktur. (Hadis-i Şerif)" }
            } 
        },

        // --- 38 Numaralı Kalıp (مَفْعَل ve + ة ile Mazarrat) ---
        38: { 
            base: { 
                arText: "مَضَرّ"
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🛑", 
                arText: "مَضَرَّة", 
                trText: "Mazarrat / Zarar veren şey, kötülük.",
                ornek: [
                    { 
                        ar: "دَفْعُ الْمَضَرَّةِ أَوْلَى مِنْ جَلْبِ الْمَنْفَعَةِ", 
                        tr: "Bir zararı (mazarratı) defetmek, bir fayda sağlamaktan önce gelir. (Mecelle Kuralı)" 
                    },
                    { 
                        ar: "💡 مَعْلُومَة صَرْفِيَّة", 
                        tr: "Sarf Kuralı: Gramer olarak 'İsm-i Mekân' (Zarar yeri) kalıbında (مَفْعَل) olsa da, Araplar bu kelimeyi mekan ismi olarak kullanmazlar. Zıddı olan 'Menfaat' (مَنْفَعَة) kelimesiyle ahenkli olması için sonuna 'ة' alarak 'Masdar-ı Mîmî' (Zarar verme eylemi) anlamında kalıplaşmıştır." 
                    }
                ]
            } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi - Muzaaf) ---
        52: { 
            base: { emoji: "🔥", arText: "أَضَرَّ", trText: "Zarar verdi / Kötülük etti." },
            cekimi: ["أَضَرَّ", "أَضَرَّا", "أَضَرُّوا", "أَضَرَّتْ", "أَضَرَّتَا", "أَضْرَرْنَ", "أَضْرَرْتَ", "أَضْرَرْتُمَا", "أَضْرَرْتُمْ", "أَضْرَرْتِ", "أَضْرَرْتُمَا", "أَضْرَرْتُنَّ", "أَضْرَرْتُ", "أَضْرَرْنَا", "أَضْرَرْنَا"]
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: { 
            base: { emoji: "🌪️", arText: "يُضِرُّ", trText: "Zarar verir / Zararlı olur." },
            cekimi: ["يُضِرُّ", "يُضِرَّانِ", "يُضِرُّونَ", "تُضِرُّ", "تُضِرَّانِ", "يُضْرِرْنَ", "تُضِرُّ", "تُضِرَّانِ", "تُضِرُّونَ", "تُضِرِّينَ", "تُضِرَّانِ", "تُضْرِرْنَ", "أُضِرُّ", "نُضِرُّ", "نُضِرُّ"]
        },

        // --- 54 Numaralı Kalıp (أَفْعِلْ - İf'âl Babı Emir) ---
        54: { 
            base: { emoji: "❗", arText: "أَضِرَّ", trText: "Zarar ver! (أَضْرِرْ)" },
            cekimi: ["أَضِرَّ", "أَضِرَّا", "أَضِرُّوا", "أَضِرِّي", "أَضِرَّا", "أَضْرِرْنَ"]
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "📉", 
                arText: "إِضْرَار", 
                trText: "İdrar / Zarar verme.",
                ornek: { ar: "الْإِضْرَارُ بِالْبِيئَةِ", tr: "Çevreye zarar vermek." }
            } 
        },

        // --- 56 Numaralı Kalıp (مُفْعِل - İf'âl Babı İsm-i Fâili) ---
        56: { 
            base: { 
                emoji: "☠️", 
                arText: "مُضِرّ", 
                trText: "Mudırr / Zararlı, zarar veren.",
                ornek: { ar: "التَّدْخِينُ مُضِرٌّ بِالصِّحَّةِ", tr: "Sigara içmek sağlığa zararlıdır (mudırrdır)." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🚫", 
                arText: "مُضِرَّة", 
                trText: "Zararlı (Dişil/Cansız Çoğul).",
                ornek: { ar: "عَادَاتٌ مُضِرَّةٌ", tr: "Zararlı alışkanlıklar." }
            }
        },

        // --- 68 Numaralı Kalıp (فِعَال - Müfâ'ale Babı 2. Masdarı) ---
        68: { 
            base: { 
                emoji: "⚔️", 
                arText: "ضِرَار", 
                trText: "D-Zırar / Zarara zararla karşılık vermek, karşılıklı zarar.",
                ornek: [
                    { 
                        ar: "لَا ضَرَرَ وَلَا ضِرَارَ فِي الْإِسْلَامِ", 
                        tr: "İslam'da zarar vermek de, zarara zararla karşılık vermek (dırar) de yoktur. (Hadis-i Şerif)" 
                    },
                    { 
                        ar: "💡 مَعْلُومَة لُغَوِيَّة", 
                        tr: "Kelime Bilgisi: 'D-Zırar' kelimesi 'Müfâ'ale' babının masdarlarından biridir. Bu bab 'karşılıklı iş yapmayı' bildirdiği için, 'Dırar' kelimesi 'biri sana zarar verdiğinde senin de ona zarar vererek intikam alman' anlamına gelir. Bu yüzden meşhur hadiste 'D-Zarar' (ilk zararı veren) ile 'D-Zırar' (zararla karşılık veren) yan yana kullanılmıştır." 
                    }
                ]
            } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi - Muzaaf) ---
        77: { 
            base: { emoji: "😓", arText: "اِضْطَرَّ", trText: "Zorunlu kaldı / Mecbur oldu." },
            cekimi: ["اِضْطَرَّ", "اِضْطَرَّا", "اِضْطَرُّوا", "اِضْطَرَّتْ", "اِضْطَرَّتَا", "اِضْطَرَرْنَ", "اِضْطَرَرْتَ", "اِضْطَرَرْتُمَا", "اِضْطَرَرْتُمْ", "اِضْطَرَرْتِ", "اِضْطَرَرْتُمَا", "اِضْطَرَرْتُنَّ", "اِضْطَرَرْتُ", "اِضْطَرَرْنَا", "اِضْطَرَرْنَا"]
        },

        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - İfti'âl Babı Muzari) ---
        78: { 
            base: { emoji: "⛓️", arText: "يَضْطَرُّ", trText: "Zorunlu kalır / Mecbur kalıyor." },
            cekimi: ["يَضْطَرُّ", "يَضْطَرَّانِ", "يَضْطَرُّونَ", "تَضْطَرُّ", "تَضْطَرَّانِ", "يَضْطَرِرْنَ", "تَضْطَرُّ", "تَضْطَرَّانِ", "تَضْطَرُّونَ", "تَضْطَرِّينَ", "تَضْطَرَّانِ", "تَضْطَرِرْنَ", "أَضْطَرُّ", "نَضْطَرُّ", "نَضْطَرُّ"]
        },

        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - İfti'âl Babı Emir) ---
        79: { 
            base: { emoji: "❗", arText: "اِضْطَرَّ", trText: "Mecbur kal! (اِضْطَرِرْ)" },
            cekimi: ["اِضْطَرَّ", "اِضْطَرَّا", "اِضْطَرُّوا", "اِضْطَرِّي", "اِضْطَرَّا", "اِضْطَرِرْنَ"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "🚧", 
                arText: "اِضْطِرَار", 
                trText: "Iztırar / Zorunluluk, mecburiyet.",
                ornek: [
                    { 
                        ar: "حَالَةُ الِاضْطِرَارِ", 
                        tr: "Zorunluluk (ıztırar) hali." 
                    },
                    { 
                        ar: "💡 قَاعِدَة صَرْفِيَّة", 
                        tr: "Sarf Kuralı (Ses Olayı): İfti'âl babının kuralı gereği, kökün ilk harfi kalın olan 'ض' olduğunda babın ince 'ت' (Te) harfi kalınlaşarak 'ط' (Ta) harfine dönüşür. Aslı 'اِضْتِرَار' iken 'اِضْطِرَار' (Iztırar) olmuştur." 
                    }
                ]
            } 
        },

        // --- 82 Numaralı Kalıp (مُفْتَعَل - İfti'âl İsm-i Mef'ûlü / İsmi Faili Muzaafta Aynıdır) ---
        82: { 
            base: { 
                emoji: "🥺", 
                arText: "مُضْطَرّ", 
                trText: "Muztar / Çaresiz, mecbur kalmış.",
                ornek: { ar: "أَمَّنْ يُجِيبُ الْمُضْطَرَّ إِذَا دَعَاهُ", tr: "Darda kalan (muztar), O'na dua ettiği zaman kim karşılık verir? (Neml Suresi, 62)" }
            } 
        }
    },

    // ==================================================================
    // 95. D-M-N (ض م ن) KÖKÜ - Garanti Etmek / İçermek
    // 4. Bab (فَعِلَ - يَفْعَلُ) ve Tef'îl Babı
    // ==================================================================
    "ضمن": {
        // --- 8 Numaralı Kalıp (Mücerret 4. Bab Mazi) ---
        8: { 
            base: { emoji: "🤝", arText: "ضَمِنَ", trText: "Garanti etti / Kefil oldu." },
            cekimi: ["ضَمِنَ", "ضَمِنَا", "ضَمِنُوا", "ضَمِنَتْ", "ضَمِنَتَا", "ضَمِنْنَ", "ضَمِنْتَ", "ضَمِنْتُمَا", "ضَمِنْتُمْ", "ضَمِنْتِ", "ضَمِنْتُمَا", "ضَمِنْتُنَّ", "ضَمِنْتُ", "ضَمِنَّا", "ضَمِنَّا"]
        },

        // --- 9 Numaralı Kalıp (Mücerret 4. Bab Muzari) ---
        9: { 
            base: { emoji: "🛡️", arText: "يَضْمَنُ", trText: "Garanti eder / Kefil olur." },
            cekimi: ["يَضْمَنُ", "يَضْمَنَانِ", "يَضْمَنُونَ", "تَضْمَنُ", "تَضْمَنَانِ", "يَضْمَنْنَ", "تَضْمَنُ", "تَضْمَنَانِ", "تَضْمَنُونَ", "تَضْمَنِينَ", "تَضْمَنَانِ", "تَضْمَنْنَ", "أَضْمَنُ", "نَضْمَنُ", "نَضْمَنُ"]
        },

        // --- 10 Numaralı Kalıp (Mücerret 4. Bab Emir) ---
        10: { 
            base: { emoji: "❗", arText: "اِضْمَنْ", trText: "Garanti et!" },
            cekimi: ["اِضْمَنْ", "اِضْمَنَا", "اِضْمَنُوا", "اِضْمَنِي", "اِضْمَنَا", "اِضْمَنْنَ"]
        },

        // --- 20 Numaralı Kalıp (فِعْل - İsim) ---
        20: { 
            base: { 
                emoji: "📦", 
                arText: "ضِمْن", 
                trText: "Zımn / İç, dâhil.",
                ornek: { ar: "هَذَا مِن ضِمْنِ الْقَوَاعِدِ", tr: "Bu, kuralların zımnındadır (içindedir/dâhilindedir)." }
            },
            suggestsPlus: true,
            "يًّا": { 
                emoji: "🤫", 
                arText: "ضِمْنِيًّا", 
                trText: "Zımnen / Kapalı olarak, dolaylı yoldan." 
            } 
        },

        // --- 22 Numaralı Kalıp (فَعَال ve + ة ile Güvence) ---
        22: { 
            base: { 
                emoji: "📜", 
                arText: "ضَمَان", 
                trText: "Garanti.",
                ornek: { ar: "شَهَادَةُ الضَّمَانِ", tr: "Garanti belgesi." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🛡️", 
                arText: "ضَمَانَة", 
                trText: "Güvence / Teminat." 
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "📑", 
                arText: "مَضْمُون", 
                trText: "Mazmun / İçerik, garanti edilen şey.",
                ornek: { ar: "مَضْمُونُ الرِّسَالَةِ", tr: "Mesajın içeriği (mazmunu)." }
            } 
        },

        // --- 58 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Mazi) ---
        58: { 
            base: { emoji: "📝", arText: "ضَمَّنَ", trText: "İçine koydu / Tazmin ettirdi." },
            cekimi: ["ضَمَّنَ", "ضَمَّنَا", "ضَمَّنُوا", "ضَمَّنَتْ", "ضَمَّنَتَا", "ضَمَّنْنَ", "ضَمَّنْتَ", "ضَمَّنْتُمَا", "ضَمَّنْتُمْ", "ضَمَّنْتِ", "ضَمَّنْتُمَا", "ضَمَّنْتُنَّ", "ضَمَّنْتُ", "ضَمَّنَّا", "ضَمَّنَّا"]
        },

        // --- 59 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Muzari) ---
        59: { 
            base: { emoji: "✍️", arText: "يُضَمِّنُ", trText: "İçine koyar / Tazmin ettirir." },
            cekimi: ["يُضَمِّنُ", "يُضَمِّنَانِ", "يُضَمِّنُونَ", "تُضَمِّنُ", "تُضَمِّنَانِ", "يُضَمِّنْنَ", "تُضَمِّنُ", "تُضَمِّنَانِ", "تُضَمِّنُونَ", "تُضَمِّنِينَ", "تُضَمِّنَانِ", "تُضَمِّنْنَ", "أُضَمِّنُ", "نُضَمِّنُ", "نُضَمِّنُ"]
        },

        // --- 60 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Emir) ---
        60: { 
            base: { emoji: "❗", arText: "ضَمِّنْ", trText: "Tazmin et!" },
            cekimi: ["ضَمِّنْ", "ضَمِّنَا", "ضَمِّنُوا", "ضَمِّنِي", "ضَمِّنَا", "ضَمِّنْنَ"]
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { 
                emoji: "💰", 
                arText: "تَضْمِين", 
                trText: "Tazmin / Zararı karşılama." 
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "💸", 
                arText: "تَضْمِينَات", 
                trText: "Tazminat / Zarar karşılıkları.",
                ornek: { ar: "دَفَعَ تَعْوِيضَاتٍ وَتَضْمِينَاتٍ", tr: "Telafiler ve tazminatlar ödedi." }
            } 
        }
    },

    // ==================================================================
    // 96. T-L-A' (ط ل ع) KÖKÜ - Doğmak / Ortaya Çıkmak / Haberdar Olmak
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve İfti'âl Babı
    // ==================================================================
    "طلع": {
       // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🌅", 
                arText: "طَلَعَ", 
                trText: "Doğdu / Ortaya çıktı.",
                ornek: [
                    { 
                        ar: "طَلَعَ الْبَدْرُ عَلَيْنَا<br>مِنْ ثَنِيَّاتِ الْوَدَاعْ<br>وَجَبَ الشُّكْرُ عَلَيْنَا<br>مَا دَعَا لِلهِ دَاعْ",
                        tr: "Dolunay doğdu üzerimize,<br>Veda tepelerinden.<br>Şükür gerekti bizlere,<br>Allah'a davet eden oldukça."
                    },
                    { 
                        ar: "أَيُّهَا الْمَبْعُوثُ فِينَا<br>جِئْتَ بِالْأَمْرِ الْمُطَاعْ<br>جِئْتَ شَرَّفْتَ الْمَدِينَةْ<br>مَرْحَبًا يَا خَيْرَ دَاعْ",
                        tr: "Ey içimizden gönderilen elçi!<br>Sen itaat edilecek bir emirle geldin.<br>Geldin, Medine'yi şereflendirdin,<br>Merhaba ey en hayırlı davetçi!"
                    }
                ]
            }
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "☀️", 
                arText: "يَطْلُعُ", 
                trText: "Doğar / Ortaya çıkar.",
                ornek: { ar: "تَطْلُعُ الشَّمْسُ", tr: "Güneş doğuyor." }
            },
        },

        // --- 25 Numaralı Kalıp (فُعُول - Mücerret Masdar) ---
        25: { 
            base: { 
                emoji: "🌄", 
                arText: "طُلُوع", 
                trText: "Tulu / Doğuş.",
                ornek: { ar: "مِنْ طُلُوعِ الشَّمْسِ إِلَى غُرُوبِهَا", tr: "Güneşin tuluundan (doğuşundan) batışına kadar." }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "⭐", 
                arText: "طَالِع", 
                trText: "Talih / Doğan, yükselen şans, burç.",
                ornek: { ar: "حُسْنُ الطَّالِعِ", tr: "İyi talih (şans)." }
            } 
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Müfâ'ale Babı Masdarı) ---
        67: { 
            base: { 
                emoji: "📖", 
                arText: "مُطَالَعَة", 
                trText: "Mütalaa / Okuma, inceleme, görüş bildirme.",
                ornek: [
                    { 
                        ar: "غُرْفَةُ الْمُطَالَعَةِ", 
                        tr: "Mütalaa (okuma) odası." 
                    },
                    { 
                        ar: "💬 مَوْضُوعٌ لِلْمُطَالَعَةِ: هَلْ تُفَضِّلُ مُطَالَعَةَ الْكُتُبِ الْوَرَقِيَّةِ أَمِ الْإِلِكْتُرُونِيَّةِ؟ وَلِمَاذَا؟", 
                        tr: "Mütalaa (Tartışma) Konusu: Basılı (kağıt) kitapları mı yoksa elektronik kitapları mı mütalaa etmeyi (okumayı) tercih edersin? Neden?" 
                    },
                    { 
                        ar: "💬 مَوْضُوعٌ لِلْمُطَالَعَةِ: مَا هِيَ أَهَمِّيَّةُ مُطَالَعَةِ الْقِصَصِ فِي تَعَلُّمِ اللُّغَةِ الْعَرَبِيَّةِ؟", 
                        tr: "Mütalaa (Tartışma) Konusu: Arapça öğreniminde hikayeler mütalaa etmenin (okuyup incelemenin) önemi nedir?" 
                    }
                ]
            } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi) ---
        77: { 
            base: { emoji: "👀", arText: "اِطَّلَعَ", trText: "Muttali oldu / Haberdar oldu / Bilgi edindi." },
            cekimi: ["اِطَّلَعَ", "اِطَّلَعَا", "اِطَّلَعُوا", "اِطَّلَعَتْ", "اِطَّلَعَتَا", "اِطَّلَعْنَ", "اِطَّلَعْتَ", "اِطَّلَعْتُمَا", "اِطَّلَعْتُمْ", "اِطَّلَعْتِ", "اِطَّلَعْتُمَا", "اِطَّلَعْتُنَّ", "اِطَّلَعْتُ", "اِطَّلَعْنَا", "اِطَّلَعْنَا"]
        },

        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - İfti'âl Babı Muzari) ---
        78: { 
            base: { emoji: "🔍", arText: "يَطَّلِعُ", trText: "Muttali olur / Haberdar olur." },
            cekimi: ["يَطَّلِعُ", "يَطَّلِعَانِ", "يَطَّلِعُونَ", "تَطَّلِعُ", "تَطَّلِعَانِ", "يَطَّلِعْنَ", "تَطَّلِعُ", "تَطَّلِعَانِ", "تَطَّلِعُونَ", "تَطَّلِعِينَ", "تَطَّلِعَانِ", "تَطَّلِعْنَ", "أَطَّلِعُ", "نَطَّلِعُ", "نَطَّلِعُ"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "📰", 
                arText: "اِطِّلَاع", 
                trText: "İttila / Bilgi edinme, haberdar olma, vakıf olma.",
                ornek: [
                    { 
                        ar: "لِلْاِطِّلَاعِ فَقَطْ", 
                        tr: "Sadece bilgi edinmek (ittila) içindir." 
                    },
                    { 
                        ar: "💡 قَاعِدَة صَرْفِيَّة", 
                        tr: "Sarf Kuralı (Ses Olayı): Kökün ilk harfi 'ط' (Ta) olduğu için, İfti'âl babının ince 'ت' (Te) harfi önce kalınlaşarak 'ط' harfine dönüşür (İbdâl). Sonra yan yana gelen iki 'ط' harfi kaynaşarak şeddelenir (İdğâm). Aslı 'اِطْتَلَعَ' iken 'اِطَّلَعَ' olmuştur." 
                    }
                ]
            } 
        },

        // --- 81 Numaralı Kalıp (مُفْتَعِل - İfti'âl Babı İsm-i Fâili) ---
        81: { 
            base: { 
                emoji: "🧠", 
                arText: "مُطَّلِع", 
                trText: "Muttali / Haberdar olan, durumu bilen.",
                ornek: { ar: "أَنَا مُطَّلِعٌ عَلَى الْمَوْضُوعِ", tr: "Ben konuya vakıfım (konudan muttaliyim)." }
            } 
        }
    },

    // ==================================================================
    // 97. T-R-D (ط ر د) KÖKÜ - Kovmak / Peş Peşe ve Düzenli Olmak
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve İfti'âl Babı
    // ==================================================================
    "طرد": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { emoji: "🚪", arText: "طَرَدَ", trText: "Kovdu / Uzaklaştırdı." },
            cekimi: ["طَرَدَ", "طَرَدَا", "طَرَدُوا", "طَرَدَتْ", "طَرَدَتَا", "طَرَدْنَ", "طَرَدْتَ", "طَرَدْتُمَا", "طَرَدْتُمْ", "طَرَدْتِ", "طَرَدْتُمَا", "طَرَدْتُنَّ", "طَرَدْتُ", "طَرَدْنَا", "طَرَدْنَا"]
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { emoji: "👉", arText: "يَطْرُدُ", trText: "Kovar / Uzaklaştırır." },
            cekimi: ["يَطْرُدُ", "يَطْرُدَانِ", "يَطْرُدُونَ", "تَطْرُدُ", "تَطْرُدَانِ", "يَطْرُدْنَ", "تَطْرُدُ", "تَطْرُدَانِ", "تَطْرُدُونَ", "تَطْرُدِينَ", "تَطْرُدَانِ", "تَطْرُدْنَ", "أَطْرُدُ", "نَطْرُدُ", "نَطْرُدُ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar / İsim) ---
        19: { 
            base: { 
                emoji: "📦", 
                arText: "طَرْد", 
                trText: "Tard / Kovma. (Modern Arapçada: Kargo paketi, koli).",
                ornek: { ar: "طَرْدٌ بَرِيدِيٌّ", tr: "Posta kolisi." }
            } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi) ---
        77: { 
            base: { emoji: "🔄", arText: "اِطَّرَدَ", trText: "Peş peşe geldi / Düzenli oldu." },
            cekimi: ["اِطَّرَدَ", "اِطَّرَدَا", "اِطَّرَدُوا", "اِطَّرَدَتْ", "اِطَّرَدَتَا", "اِطَّرَدْنَ", "اِطَّرَدْتَ", "اِطَّرَدْتُمَا", "اِطَّرَدْتُمْ", "اِطَّرَدْتِ", "اِطَّرَدْتُمَا", "اِطَّرَدْتُنَّ", "اِطَّرَدْتُ", "اِطَّرَدْنَا", "اِطَّرَدْنَا"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "📏", 
                arText: "اِطِّرَاد", 
                trText: "İttırat / Düzenlilik, kurala uygunluk, istikrar.",
                ornek: [
                    { 
                        ar: "اِطِّرَادُ الْقَاعِدَةِ", 
                        tr: "Kuralın düzenliliği (şaşmaması)." 
                    },
                    { 
                        ar: "💡 قَاعِدَة صَرْفِيَّة", 
                        tr: "Sarf Kuralı (Ses Olayı): Kök 'ط' ile başladığı için, İfti'âl babının 'ت' harfi 'ط' harfine dönüşür (İbdâl) ve iki aynı harf kaynaşarak şeddelenir (İdğâm). Kelimenin aslı 'اِطْتِرَاد' iken 'اِطِّرَاد' olmuştur." 
                    }
                ]
            } 
        },

        // --- 81 Numaralı Kalıp (مُفْتَعِل - İfti'âl Babı İsm-i Fâili) ---
        81: { 
            base: { 
                emoji: "⚙️", 
                arText: "مُطَّرِد", 
                trText: "Muttarit / Düzenli, sürekli, ahenkli.",
                ornek: { ar: "تَقَدُّمٌ مُطَّرِدٌ", tr: "Sürekli (muttarit) bir ilerleme." }
            } 
        }
    },

    // ==================================================================
    // 98. T-L-B (ط ل ب) KÖKÜ - İstemek / Talep Etmek
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve İfti'âl Babı
    // ==================================================================
    "طلب": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { emoji: "🙋", arText: "طَلَبَ", trText: "İstedi / Talep etti." },
            cekimi: ["طَلَبَ", "طَلَبَا", "طَلَبُوا", "طَلَبَتْ", "طَلَبَتَا", "طَلَبْنَ", "طَلَبْتَ", "طَلَبْتُمَا", "طَلَبْتُمْ", "طَلَبْتِ", "طَلَبْتُمَا", "طَلَبْتُنَّ", "طَلَبْتُ", "طَلَبْنَا", "طَلَبْنَا"]
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { emoji: "🗣️", arText: "يَطْلُبُ", trText: "İster / Talep eder." },
            cekimi: ["يَطْلُبُ", "يَطْلُبَانِ", "يَطْلُبُونَ", "تَطْلُبُ", "تَطْلُبَانِ", "يَطْلُبْنَ", "تَطْلُبُ", "تَطْلُبَانِ", "تَطْلُبُونَ", "تَطْلُبِينَ", "تَطْلُبَانِ", "تَطْلُبْنَ", "أَطْلُبُ", "نَطْلُبُ", "نَطْلُبُ"]
        },

        // --- 17 Numaralı Kalıp (فَعَل - Mücerret Masdar) ---
        17: { 
            base: { 
                emoji: "📝", 
                arText: "طَلَب", 
                trText: "Talep / İstek.",
                ornek: { ar: "طَلَبُ الْعِلْمِ فَرِيضَةٌ", tr: "İlim talebi (istemek) farzdır." }
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "📂", 
                arText: "طَلَبَات", 
                trText: "Talepler / İstekler / Siparişler." 
            }
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "👨‍🎓", 
                arText: "طَالِب", 
                trText: "Talip / İsteyen. (Aynı zamanda 'Erkek Öğrenci' demektir).",
                ornek: { ar: "طَالِبُ جَامِعَةٍ", tr: "Üniversite öğrencisi (ilme talip olan)." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "👩‍🎓", 
                arText: "طَالِبَة", 
                trText: "Kız Öğrenci / İsteyen (Dişil).",
                ornek: { ar: "هِيَ طَالِبَةٌ مُجْتَهِدَةٌ", tr: "O, çalışkan bir kız öğrencidir." }
            }
        },

        // --- 45 Numaralı Kalıp (فُعَّال - İsm-i Fâil Çoğulu 1) ---
        45: { 
            base: { 
                emoji: "🎓", 
                arText: "طُلَّاب", 
                trText: "Tullâb / Öğrenciler (Erkek/Karma), isteyenler.",
                ornek: { ar: "طُلَّابُ الْمَدْرَسَةِ", tr: "Okulun öğrencileri." }
            } 
        },

        // --- 47 Numaralı Kalıp (فَعَلَة - İsm-i Fâil Çoğulu 2) ---
        47: { 
            base: { 
                emoji: "📚", 
                arText: "طَلَبَة", 
                trText: "Talebe / Öğrenciler, ilim arayanlar.",
                ornek: [
                    { 
                        ar: "طَلَبَةُ الْعِلْمِ", 
                        tr: "İlim talebeleri (öğrencileri)." 
                    },
                    { 
                        ar: "💡 مَعْلُومَة لُغَوِيَّة", 
                        tr: "Kelime Bilgisi: Türkçede tekil zannedip 'Talebeler' şeklinde tekrar çoğul yaptığımız 'Talebe' kelimesi, aslında Arapçada 'Tâlib' (Öğrenci) kelimesinin çoğuludur." 
                    }
                ]
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "🎯", 
                arText: "مَطْلُوب", 
                trText: "Matlup / İstenen, aranan şey.",
                ornek: { ar: "هَذَا هُوَ الْمَطْلُوبُ", tr: "İstenen (matlup) olan da budur." }
            } 
        },

        // --- 81 Numaralı Kalıp (مُفْتَعِل - İfti'âl Babı İsm-i Fâili) ---
        81: { 
            base: { 
                emoji: "🔎", 
                arText: "مُطَّلِب", 
                trText: "Muttalip / İsteyen, şiddetle arayan.",
                ornek: [
                    { 
                        ar: "عَبْدُ الْمُطَّلِبِ", 
                        tr: "Abdülmuttalip (Muttalip'in kölesi - Peygamber Efendimizin dedesinin ismidir)." 
                    },
                    { 
                        ar: "💡 قَاعِدَة صَرْفِيَّة", 
                        tr: "Sarf Kuralı: İfti'âl babının 'ت' harfi kökteki 'ط' harfiyle birleşerek şeddelenmiştir. Aslı 'مُطْتَلِب' iken 'مُطَّلِب' (Muttalip) olmuştur." 
                    }
                ]
            } 
        }
    },

    // ==================================================================
    // الغين (Ghayn) Harfi
    // 104. Gh-R-B (غ ر ب) KÖKÜ - Batmak / Uzaklaşmak
    // (ط ل ع kökünün tam zıddıdır)
    // ==================================================================
    "غرب": {
        // --- 1 Numaralı Kalıp (Mücerret Mazi) ---
        1: { 
            base: { emoji: "🌇", arText: "غَرَبَ", trText: "Battı (Güneş vb.) / Uzaklaştı." },
            cekimi: ["غَرَبَ", "غَرَبَا", "غَرَبُوا", "غَرَبَتْ", "غَرَبَتَا", "غَرَبْنَ", "غَرَبْتَ", "غَرَبْتُمَا", "غَرَبْتُمْ", "غَرَبْتِ", "غَرَبْتُمَا", "غَرَبْتُنَّ", "غَرَبْتُ", "غَرَبْنَا", "غَرَبْنَا"]
        },

        // --- 2 Numaralı Kalıp (Mücerret Muzari) ---
        2: { 
            base: { 
                emoji: "🌆", 
                arText: "يَغْرُبُ", 
                trText: "Batar / Uzaklaşır.",
                ornek: { ar: "تَغْرُبُ الشَّمْسُ", tr: "Güneş batıyor." }
            },
            cekimi: ["يَغْرُبُ", "يَغْرُبَانِ", "يَغْرُبُونَ", "تَغْرُبُ", "تَغْرُبَانِ", "يَغْرُبْنَ", "تَغْرُبُ", "تَغْرُبَانِ", "تَغْرُبُونَ", "تَغْرُبِينَ", "تَغْرُبَانِ", "تَغْرُبْنَ", "أَغْرُبُ", "نَغْرُبُ", "نَغْرُبُ"]
        },

        // --- 25 Numaralı Kalıp (فُعُول - Mücerret Masdar) ---
        25: { 
            base: { 
                emoji: "🌃", 
                arText: "غُرُوب", 
                trText: "Gurub / Batış, kayboluş. (Tulu' kelimesinin zıddı).",
                ornek: { ar: "مِنْ طُلُوعِ الشَّمْسِ إِلَى غُرُوبِهَا", tr: "Güneşin doğuşundan (tulu) batışına (gurub) kadar." }
            } 
        },

        // --- 19 Numaralı Kalıp (فَعْل - İsim / Masdar) ---
        19: { 
            base: { 
                emoji: "🧭", 
                arText: "غَرْب", 
                trText: "Garb / Batı yönü. (Aynı zamanda Batı dünyasını ve Avrupa'yı temsil eder).",
                ornek: { 
                    ar: "💡 مِنْ نَشِيدِ الِاسْتِقْلَالِ", 
                    tr: "İstiklal Marşı'mızdan: \"Garb'ın âfâkını sarmışsa çelik zırhlı duvar...\" <br><br> (Açıklama: Mehmet Akif bu mısrada 'Garb' kelimesiyle Batı medeniyetini ve dönemin işgalci güçlerini kasteder. 'Çelik zırhlı duvar' ifadesiyle de Batı'nın sahip olduğu üstün silah, donanım ve maddeci gücü tasvir edilmiştir)." 
                }
            } 
        },

        // --- 38 Numaralı Kalıp (مَفْعِل - İsm-i Mekân / İsm-i Zaman) ---
        38: { 
            base: { 
                emoji: "🇲🇦", 
                arText: "مَغْرِب", 
                trText: "Mağrip / Batı, güneşin battığı yer ve zaman. (Fas ülkesi için de kullanılır).",
                ornek: [
                    { 
                        ar: "صَلَاةُ الْمَغْرِبِ", 
                        tr: "Akşam (güneşin battığı vakit) namazı." 
                    },
                    { 
                        ar: "💡 قَاعِدَة صَرْفِيَّة (اِسْتِثْنَاء)", 
                        tr: "İstisna Kuralı: Muzarisi ötreli (يَغْرُبُ) olan fiillerin İsm-i Mekân kalıbı normalde üstünlü (مَفْعَل) gelir. Yani kurala göre kelimenin 'Mağrab' olması gerekirdi. Ancak 'Mağrib' (مَغْرِب) kelimesi (tıpkı Mescid ve Maşrık gibi) Arapların kural dışı (şâz / kıyasa muhalif) olarak esreli kullandığı çok meşhur istisnai kelimelerden biridir." 
                    }
                ]
            } 
        }
    },

    // ==================================================================
    // 105. Gh-L-B (غ ل ب) KÖKÜ - Yenmek / Üstün Gelmek
    // 2. Bab (فَعَلَ - يَفْعِلُ)
    // ==================================================================
    "غلب": {
        // --- 1 Numaralı Kalıp (Mücerret Mazi) ---
        1: { 
            base: { 
                emoji: "🏆", 
                arText: "غَلَبَ", 
                trText: "Yendi / Üstün geldi.",
                ornek: { 
                    ar: "كَمْ مِنْ فِئَةٍ قَلِيلَةٍ غَلَبَتْ فِئَةً كَثِيرَةً بِإِذْنِ اللهِ", 
                    tr: "Nice az bir topluluk, Allah'ın izniyle çok (kalabalık) bir topluluğa galip gelmiştir (onları yenmiştir). (Bakara Suresi, 249)" 
                }
            },
        },

       // --- 4 Numaralı Kalıp (Mücerret Muzari) ---
        4: { 
            base: { 
                emoji: "🥇", 
                arText: "يَغْلِبُ", 
                trText: "Yener / Üstün gelir.",
                ornek: [
                    {
                        ar: "وَهُمْ مِنْ بَعْدِ غَلَبِهِمْ سَيَغْلِبُونَ",
                        tr: "Onlar (Romalılar) bu yenilgilerinden sonra mutlaka galip geleceklerdir. (Rûm Suresi, 3)"
                    },
                    {
                        ar: "إِنْ يَكُنْ مِنْكُمْ عِشْرُونَ صَابِرُونَ يَغْلِبُوا مِائَتَيْنِ",
                        tr: "İçinizden sabreden yirmi kişi bulunursa, iki yüz kişiye galip gelirler (yenerler). (Enfâl Suresi, 65)"
                    }
                ]
            },
        },

        // --- 17 Numaralı Kalıp (فَعَل - İsim / Masdar) ---
        17: { 
            base: { 
                emoji: "⚔️", 
                arText: "غَلَب",
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🏅", 
                arText: "غَلَبَة", 
                trText: "Galebe / Üstünlük, galibiyet.",
                ornek: { ar: "كَانَتِ الْغَلَبَةُ لَنَا", tr: "Üstünlük (galibiyet) bizimdi." }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "😎", 
                arText: "غَالِب", 
                trText: "Galip / Yenen, üstün gelen.",
                ornek: { ar: "الْفَرِيقُ الْغَالِبُ", tr: "Galip (yenen) takım." }
            },
        },

        // --- 30 Numaralı Kalıp (أَفْعَل - Kalıplaşmış İsim / Masdar-ı Sınâî) ---
        30: { 
            base: { 
                emoji: "📊", 
                arText: "أَغْلَب", 
                trText: "Ağlab / Büyük kısım, geneli.",
                ornek: { ar: "فِي أَغْلَبِ الْأَحْيَانِ", tr: "Çoğu zaman (genellikle)." }
            },
            suggestsPlus: true,
            "يَّة": { 
                emoji: "👥", 
                arText: "أَغْلَبِيَّة", 
                trText: "Ağlebiyye / Çoğunluk.",
                ornek: [
                    { 
                        ar: "الْأَغْلَبِيَّةُ الصَّامِتَةُ", 
                        tr: "Sessiz çoğunluk." 
                    },
                    {
                        ar: "صَوَّتَتِ الْأَغْلَبِيَّةُ لِصَالِحِ الْقَرَارِ",
                        tr: "Çoğunluk, kararın lehine oy kullandı."
                    }
                ]
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "😔", 
                arText: "مَغْلُوب", 
                trText: "Mağlup / Yenilen.",
                ornek: [{ 
                        ar: "فَدَعَا رَبَّهُ أَنِّي مَغْلُوبٌ فَانْتَصِرْ", 
                        tr: "Bunun üzerine (Nuh) Rabbine: 'Şüphesiz ben mağlup oldum (yenik düştüm), artık bana yardım et!' diye dua etti. (Kamer Suresi, 10)" 
                    },
                ]
            } 
        }
    },

    // ==================================================================
    // 106. Gh-F-R (غ ف ر) KÖKÜ - Örtmek / Korumak / Bağışlamak
    // 2. Bab (فَعَلَ - يَفْعِلُ) ve İstif'âl Babı
    // ==================================================================
    "غفر": {
        // --- 1 Numaralı Kalıp (Mücerret Mazi / 2. Bab) ---
        1: { 
            base: { 
                emoji: "🛡️", 
                arText: "غَفَرَ", 
                trText: "Bağışladı / Örttü (günahları).",
                ornek: { 
                    ar: "فَغَفَرَ لَهُ ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ", 
                    tr: "Bunun üzerine (Allah) onu bağışladı. Şüphesiz O, çok bağışlayandır, çok merhamet edendir. (Kasas Suresi, 16)" 
                }
            },
        },

        // --- 4 Numaralı Kalıp (Mücerret Muzari / 2. Bab) ---
        4: { 
            base: { 
                emoji: "🤲", 
                arText: "يَغْفِرُ", 
                trText: "Bağışlar / Örter." 
            },
        },

        // --- 5 Numaralı Kalıp (Mücerret Emir / 2. Bab) ---
        5: { 
            base: { 
                emoji: "🙏", 
                arText: "اِغْفِرْ", 
                trText: "Bağışla / Ört!",
                ornek: { 
                    ar: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ", 
                    tr: "Rabbimiz! Hesap kurulacağı gün beni, anne-babamı ve müminleri bağışla. (İbrahim Suresi, 41)" 
                }
            },
        },

        // --- 26 Numaralı Kalıp (فَعُول - Mübalağalı İsm-i Fâil / Sıfat-ı Müşebbehe) ---
        26: { 
            base: { 
                emoji: "🤍", 
                arText: "غَفُور", 
                trText: "Ğafûr / Çok bağışlayan.",
                ornek: [
                    { 
                        ar: "إِنَّ اللهَ غَفُورٌ رَحِيمٌ", 
                        tr: "Şüphesiz Allah, çok bağışlayandır (Ğafûr'dur), çok merhamet edendir. (Bakara Suresi, 173)" 
                    },
                    { 
                        ar: "💡 مَعْلُومَة صَرْفِيَّة", 
                        tr: "Sarf Notu: 'Fa'ûl' (فَعُول) kalıbı, geçişli fiillerden (غَفَرَ gibi) türediğinde eylemin çokluğunu bildiren 'Mübalağalı İsm-i Fâil' olur. Geçişsiz (lâzım) fiillerden türediğinde ise kişinin kalıcı tabiatını bildiren 'Sıfat-ı Müşebbehe' (Örn: وَقُور - ağırbaşlı) olarak görev yapar." 
                    }
                ]
            } 
        },

        // --- 37 Numaralı Kalıp (مَفْعِل) ---
        37: { 
            base: { 
                emoji: "🛡️", 
                arText: "مَغْفِر", 
                trText: "" 
            },
            suggestsPlus: true,
            "ة": {
                emoji: "✨", 
                arText: "مَغْفِرَة", 
                trText: "Mağfiret / Bağışlama, günahları örtme.",
                ornek: [
                    { 
                        ar: "نَرْجُو مَغْفِرَةَ اللهِ", 
                        tr: "Allah'ın mağfiretini (bağışlamasını) umarız." 
                    },
                    { 
                        ar: "💬 مَوْضُوعٌ لِلْمُطَالَعَةِ: الْغُفْرَانُ فِي اللُّغَةِ يَعْنِي التَّغْطِيَةَ. مَا هُوَ الْفَرْقُ بَيْنَ مَحْوِ الذَّنْبِ وَتَغْطِيَتِهِ (مَغْفِرَتِهِ)؟", 
                        tr: "Mütalaa Konusu: 'Gufran/Mağfiret' kelimesinin sözlük anlamı 'örtmek'tir. Bir günahın tamamen silinmesi (mahvedilmesi) ile örtülmesi (mağfiret edilmesi) arasındaki manevi ve psikolojik fark nedir?" 
                    }
                ]
            }
        },
        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🕊️", 
                arText: "غَافِر", 
                trText: "Gafir / Bağışlayan, örten.",
                ornek: { ar: "غَافِرُ الذَّنْبِ", tr: "Günahı bağışlayan (Allah)." }
            } 
        },

        // --- 34 Numaralı Kalıp (فَعَّال - Mübalağalı İsm-i Fâil) ---
        34: { 
            base: { 
                emoji: "🌊", 
                arText: "غَفَّار", 
                trText: "Gaffâr / Çokça bağışlayan, hataları sürekli örten.",
                ornek: { ar: "هُوَ الْغَفَّارُ الْكَرِيمُ", tr: "O, çokça bağışlayan ve cömert olandır." }
            } 
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - İstif'âl Babı Masdarı) ---
        103: { 
            base: { 
                emoji: "📿", 
                arText: "اِسْتِغْفَار", 
                trText: "İstiğfar / Bağışlanma dileme.",
                ornek: [
                    { 
                        ar: "كَثْرَةُ الِاسْتِغْفَارِ", 
                        tr: "İstiğfarın (tövbenin) çokluğu." 
                    },
                    { 
                        ar: "💡 مَعْلُومَة صَرْفِيَّة", 
                        tr: "Sarf Kuralı: İstif'âl babı (اِسْتِفْعَال) fiile 'talep etme, isteme' anlamı katar. Kök anlamı 'örtmek/bağışlamak' olan 'غفر' (Ğa-fe-ra) bu baba girdiğinde 'Bağışlanma TALEP ETMEK' (İstiğfar) anlamına dönüşür." 
                    }
                ]
            } 
        },

        // --- 39 Numaralı Kalıp (مِفْعَل - İsm-i Âlet) ---
        39: {
            base: {
                emoji: "🪖",
                arText: "مِغْفَر",
                trText: "Miğfer / Başı koruyan zırhlı başlık.",
                ornek: {
                    ar: "💡 رَبْطُ الْكَلِمَاتِ",
                    tr: "Kelime Bağlantısı: Askerlerin başını tehlikelerden korumak için 'örten' başlığa Miğfer denmesi ile, günahları 'örten' Mağfiret kelimesi aynı kökten (غفر) türemiştir."
                }
            }
        }
    },

     // ==================================================================
    // Sh-Gh-L (ش غ ل) KÖKÜ - İş / Uğraş / Meşguliyet
    // (Türkçedeki Meşgul, İşgal ve Meşgale kelimelerinin atası)
    // ==================================================================
    "شغل": {
        // --- 21 Numaralı Kalıp (فُعْل - Masdar/İsim) ---
        21: { 
            base: { 
                emoji: "💼", 
                arText: "شُغْل", 
                trText: "Şuğul / İş, uğraş." 
            } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "⏳", 
                arText: "مَشْغُول", 
                trText: "Meşgul / İşi olan, vakti dolu olan." 
            } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekân) ---
        38: { 
            base: { 
                emoji: "🏭"},
            suggestsPlus: true, 
            "ة": { 
                emoji: "🧵", 
                arText: "مَشْغَلَة", 
                trText: "Meşgale / Uğraşılan, vakit harcanan iş." 
            } 
        },
        
        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Masdarı) ---
        55: { 
            base: { 
                emoji: "🛑", 
                arText: "إِشْغَال", 
                trText: "İşgal / Meşgul etme, bir yeri veya vakti kaplama." 
            } 
        }
    },

    // ==================================================================
    // H-S-B (ح س ب) KÖKÜ - Saymak / Hesap Etmek
    // (Türkçedeki Hesap, Muhasebe ve Muhasebeci kelimelerinin atası)
    // ==================================================================
    "حسب": {
        // --- 23 Numaralı Kalıp (فِعَال - Masdar/İsim) ---
        23: { 
            base: { 
                emoji: "🧮", 
                arText: "حِسَاب", 
                trText: "Hesap / Sayma, matematiksel işlem.",
                ornek: { ar: "يَوْمُ الْحِسَابِ", tr: "Hesap günü." }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "⏱️", },
            suggestsPlus: true, 
            "ة": { 
                emoji: "💻", 
                arText: "حَاسِبَة", 
                trText: "Hesap makinesi / Bilgisayar (Hâsûb da kullanılır)." 
            }
        },
        
        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Müfâ'ale Masdarı) ---
        67: { 
            base: { 
                emoji: "📊", 
                arText: "مُحَاسَبَة", 
                trText: "Muhasebe / Karşılıklı hesaplaşma, hesap tutma." 
            } 
        },

        // --- 69 Numaralı Kalıp (مُفَاعِل - Müfâ'ale İsm-i Fâili) ---
        69: { 
            base: { 
                emoji: "👨‍💼", 
                arText: "مُحَاسِب", 
                trText: "Muhasebeci / Hesapları tutan kişi." 
            } 
        }
    },

    // ==================================================================
    // Z-L-M (ظ ل م) KÖKÜ - Karanlık / Haksızlık Etmek
    // (Türkçedeki Zulüm, Zalim ve Mazlum kelimelerinin atası)
    // ==================================================================
    "ظلم": {
        // --- 21 Numaralı Kalıp (فُعْل - Masdar) ---
        21: { 
            base: { 
                emoji: "🌑", 
                arText: "ظُلْم", 
                trText: "Zulüm / Haksızlık, adaletsizlik.",
                ornek: { ar: "الظُّلْمُ ظُلُمَاتٌ يَوْمَ الْقِيَامَةِ", tr: "Zulüm, kıyamet gününde zifiri karanlıklardır. (Hadis-i Şerif)" }
            } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "😠", 
                arText: "ظَالِم", 
                trText: "Zalim / Haksızlık eden, eziyet eden." 
            } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "🥺", 
                arText: "مَظْلُوم", 
                trText: "Mazlum / Kendisine haksızlık edilen, zulme uğrayan.",
                ornek: { ar: "دَعْوَةُ الْمَظْلُومِ", tr: "Mazlumun bedduası (duası)." }
            } 
        }
    },

     // ==================================================================
    // N-T-J (ن ت ج) KÖKÜ - Sonuç Vermek / Üretmek
    // (Türkçedeki Netice kelimesinin atası)
    // ==================================================================
    "نتج": {
        // --- 35 Numaralı Kalıp (فَعِيل ve + ة ile Netice) ---
        35: { 
            base: { arText: "نَتِيج" }, // Yalın hali sessiz (Ekrana boş açılır)
            suggestsPlus: true,
            "ة": { 
                emoji: "🎯", 
                arText: "نَتِيجَة", 
                trText: "Netice / Sonuç.",
                ornek: { ar: "نَتِيجَةُ الِامْتِحَانِ جَيِّدَةٌ", tr: "Sınavın neticesi (sonucu) iyidir." }
            } 
        },

        // --- 52, 53 Numaralı Kalıplar (İf'âl Babı - Üretmek) ---
        52: { base: { emoji: "🏭", arText: "أَنْتَجَ", trText: "Üretti." } },
        53: { base: { emoji: "⚙️", arText: "يُنْتِجُ", trText: "Üretir / Üretiyor." } },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Masdarı) ---
        55: { 
            base: { 
                emoji: "📦", 
                arText: "إِنْتَاج", 
                trText: "İntac / Üretim.",
                ornek: { ar: "إِنْتَاجٌ مَحَلِّيٌّ", tr: "Yerli üretim." }
            } 
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - İstif'âl Masdarı) ---
        103: { 
            base: { 
                emoji: "🤔", 
                arText: "اِسْتِنْتَاج", 
                trText: "İstintac / Sonuç çıkarma, tümdengelim." 
            } 
        }
    },

    // ==================================================================
    // W-TH-Q (و ث ق) KÖKÜ - Güvenmek / Sağlamlaştırmak
    // (Türkçedeki Vesika kelimesinin atası)
    // ==================================================================
    "وثق": {
        // --- 14 Numaralı Kalıp (Mücerret 4. veya 6. Bab Mazi) ---
        14: { 
            base: { emoji: "🤝", arText: "وَثِقَ", trText: "Güvendi / İtimat etti." } 
        },

        // --- 15 Numaralı Kalıp (Mücerret Muzari - Misal Fiil, Vav düşer) ---
        15: { 
            base: { 
                emoji: "🛡️", 
                arText: "يَثِقُ", 
                trText: "Güvenir / İtimat ediyor." 
            } 
        },

        // --- 35 Numaralı Kalıp (فَعِيل ve + ة ile Vesika) ---
        35: { 
            base: { arText: "وَثِيق" }, // Yalın hali sessiz
            suggestsPlus: true,
            "ة": { 
                emoji: "📜", 
                arText: "وَثِيقَة", 
                trText: "Vesika / Belge, sağlam kanıt.",
                ornek: { ar: "وَثِيقَةٌ رَسْمِيَّةٌ", tr: "Resmi vesika (belge)." }
            } 
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Masdarı) ---
        61: { 
            base: { 
                emoji: "📂", 
                arText: "تَوْثِيق", 
                trText: "Tevsik / Belgelendirme, sağlama alma." 
            } 
        }
    },

    
    // ==================================================================
    // TH-Q-F (ث ق ف) KÖKÜ - Anlayışlı Olmak / Eğitmek
    // (Arapçadaki Kültür kelimesinin kökeni)
    // ==================================================================
    "ثقف": {
        // --- 22 Numaralı Kalıp (فَعَال ve + ة ile Kültür) ---
        22: { 
            base: { arText: "ثَقَاف" }, // Yalın hali sessiz
            suggestsPlus: true,
            "ة": { 
                emoji: "🏛️", 
                arText: "ثَقَافَة", 
                trText: "Sakafa / Kültür, eğitim, birikim.",
                ornek: { ar: "ثَقَافَةٌ عَامَّةٌ", tr: "Genel kültür." }
            } 
        },

        // --- 62 Numaralı Kalıp (مُفَعِّل - Tef'îl İsm-i Fâili) ---
        62: { 
            base: { 
                emoji: "🧠", 
                arText: "مُثَقَّف", 
                trText: "Müsakkaf / Kültürlü, aydın (entelektüel) kişi." 
            } 
        }
    },

    // ==================================================================
    // N-T-J (ن ت ج) KÖKÜ - Sonuç Vermek / Üretmek
    // (Türkçedeki Netice kelimesinin atası)
    // ==================================================================
    "نتج": {
        // --- 35 Numaralı Kalıp (فَعِيل ve + ة ile Netice) ---
        35: { 
            base: { arText: "نَتِيج" }, // Yalın hali sessiz (Ekrana boş açılır)
            suggestsPlus: true,
            "ة": { 
                emoji: "🎯", 
                arText: "نَتِيجَة", 
                trText: "Netice / Sonuç.",
                ornek: { ar: "نَتِيجَةُ الِامْتِحَانِ جَيِّدَةٌ", tr: "Sınavın neticesi (sonucu) iyidir." }
            } 
        },

        // --- 52, 53 Numaralı Kalıplar (İf'âl Babı - Üretmek) ---
        52: { base: { emoji: "🏭", arText: "أَنْتَجَ", trText: "Üretti." } },
        53: { base: { emoji: "⚙️", arText: "يُنْتِجُ", trText: "Üretir / Üretiyor." } },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Masdarı) ---
        55: { 
            base: { 
                emoji: "📦", 
                arText: "إِنْتَاج", 
                trText: "İntac / Üretim.",
                ornek: { ar: "إِنْتَاجٌ مَحَلِّيٌّ", tr: "Yerli üretim." }
            } 
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - İstif'âl Masdarı) ---
        103: { 
            base: { 
                emoji: "🤔", 
                arText: "اِسْتِنْتَاج", 
                trText: "İstintac / Sonuç çıkarma, tümdengelim." 
            } 
        }
    },

    // ==================================================================
    // W-TH-Q (و ث ق) KÖKÜ - Güvenmek / Sağlamlaştırmak
    // (Türkçedeki Vesika kelimesinin atası)
    // ==================================================================
    "وثق": {
        // --- 8 Numaralı Kalıp (Mücerret 4. veya 6. Bab Mazi) ---
        8: { 
            base: { emoji: "🤝", arText: "وَثِقَ", trText: "Güvendi / İtimat etti." } 
        },

        // --- 9 Numaralı Kalıp (Mücerret Muzari - Misal Fiil, Vav düşer) ---
        9: { 
            base: { 
                emoji: "🛡️", 
                arText: "يَثِقُ", 
                trText: "Güvenir / İtimat ediyor." 
            } 
        },

        // --- 35 Numaralı Kalıp (فَعِيل ve + ة ile Vesika) ---
        35: { 
            base: { arText: "وَثِيق" }, // Yalın hali sessiz
            suggestsPlus: true,
            "ة": { 
                emoji: "📜", 
                arText: "وَثِيقَة", 
                trText: "Vesika / Belge, sağlam kanıt.",
                ornek: { ar: "وَثِيقَةٌ رَسْمِيَّةٌ", tr: "Resmi vesika (belge)." }
            } 
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Masdarı) ---
        61: { 
            base: { 
                emoji: "📂", 
                arText: "تَوْثِيق", 
                trText: "Tevsik / Belgelendirme, sağlama alma." 
            } 
        }
    },

    // ==================================================================
    // N-S-H (ن ص ح) KÖKÜ - Öğüt Vermek / Samimi Olmak
    // (Türkçedeki Nasihat kelimesinin atası)
    // 3. Bab (فَعَلَ - يَفْعَلُ)
    // ==================================================================
    "نصح": {
        // --- 1 Numaralı Kalıp (Mücerret 3. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🗣️", 
                arText: "نَصَحَ", 
                trText: "Öğüt verdi / Nasihat etti.",
                ornek: { 
                    ar: "لَقَدْ أَبْلَغْتُكُمْ رِسَالَةَ رَبِّي وَنَصَحْتُ لَكُمْ", 
                    tr: "Andolsun ki, Rabbimin elçiliğini size tebliğ ettim ve size nasihat ettim (öğüt verdim). (A'râf Suresi, 79)" 
                }
            },
            cekimi: ["نَصَحَ", "نَصَحَا", "نَصَحُوا", "نَصَحَتْ", "نَصَحَتَا", "نَصَحْنَ", "نَصَحْتَ", "نَصَحْتُمَا", "نَصَحْتُمْ", "نَصَحْتِ", "نَصَحْتُمَا", "نَصَحْتُنَّ", "نَصَحْتُ", "نَصَحْنَا", "نَصَحْنَا"]
        },

        // --- 6 Numaralı Kalıp (Mücerret 3. Bab Muzari) ---
        6: { 
            base: { 
                emoji: "💬", 
                arText: "يَنْصَحُ", 
                trText: "Öğüt verir / Nasihat ediyor.",
                ornek: { 
                    ar: "وَلَا يَنْفَعُكُمْ نُصْحِي إِنْ أَرَدْتُ أَنْ أَنْصَحَ لَكُمْ", 
                    tr: "Eğer size öğüt vermek (nasihat etmek) istesem de, öğüdüm size fayda vermez. (Hûd Suresi, 34)" 
                }
            },
            cekimi: ["يَنْصَحُ", "يَنْصَحَانِ", "يَنْصَحُونَ", "تَنْصَحُ", "تَنْصَحَانِ", "يَنْصَحْنَ", "تَنْصَحُ", "تَنْصَحَانِ", "تَنْصَحُونَ", "تَنْصَحِينَ", "تَنْصَحَانِ", "تَنْصَحْنَ", "أَنْصَحُ", "نَنْصَحُ", "نَنْصَحُ"]
        },

        // --- 7 Numaralı Kalıp (Mücerret 3. Bab Emir) ---
        7: { 
            base: { 
                emoji: "❗", 
                arText: "اِنْصَحْ", 
                trText: "Öğüt ver / Nasihat et!",
                ornek: {
                    ar: "اِنْصَحْ أَخَاكَ سِرًّا",
                    tr: "Kardeşine gizlice öğüt ver (nasihat et). (İmam Şâfiî'nin sözünden)"
                }
            },
            cekimi: ["اِنْصَحْ", "اِنْصَحَا", "اِنْصَحُوا", "اِنْصَحِي", "اِنْصَحَا", "اِنْصَحْنَ"]
        },

       // --- 21 Numaralı Kalıp (فُعْل - Masdar) ---
        21: {
            base: {
                emoji: "🤝",
                arText: "نُصْح",
                trText: "Nush / Öğüt, samimiyet.",
                ornek: { 
                    ar: "وَلَا يَنْفَعُكُمْ نُصْحِي إِنْ أَرَدْتُ أَنْ أَنْصَحَ لَكُمْ", 
                    tr: "Eğer size öğüt vermek (nasihat etmek) istesem de, benim öğüdüm (nushum) size fayda vermez. (Hûd Suresi, 34)" 
                }
            }
        },

       // --- 26 Numaralı Kalıp (فَعُول - Mübalağalı İsm-i Fâil / Sıfat-ı Müşebbehe) ---
        26: { 
            base: { 
                emoji: "🩹", 
                arText: "نَصُوح", 
                trText: "Nasuh / Çok samimi, saf, onarıcı.",
                ornek: [
                    { 
                        ar: "تُوبُوا إِلَى اللهِ تَوْبَةً نَصُوحًا", 
                        tr: "Allah'a içten, samimi (nasuh) bir tövbe ile tövbe edin. (Tahrîm Suresi, 8)" 
                    },
                    { 
                        ar: "💡 مَعْلُومَة لُغَوِيَّة", 
                        tr: "Dil Notu: 'Nush' (نُصْح) kökü Arapçada 'yırtık elbiseyi dikmek, balı mumundan süzüp saflaştırmak' anlamlarına da gelir. 'Nasuh' tövbe; günahla yırtılan ruhu samimiyetle onaran, tertemiz ve bozulmaz tövbedir." 
                    }
                ]
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: {
            base: {
                emoji: "😇",
                arText: "نَاصِح",
                trText: "Nâsıh / Öğüt veren, samimi olan.",
                ornek: { 
                    ar: "وَأَنَا لَكُمْ نَاصِحٌ أَمِينٌ", 
                    tr: "Ve ben sizin için güvenilir bir öğüt vericiyim (nâsıhım). (A'râf Suresi, 68)" 
                }
            }
        },

        // --- 35 Numaralı Kalıp (فَعِيل ve + ة ile Nasihat) ---
        35: { 
            base: { arText: "نَصِيح" }, // Yalın hali sessiz
            suggestsPlus: true,
            "ة": { 
                emoji: "💡", 
                arText: "نَصِيحَة", 
                trText: "Nasihat / Öğüt.",
                ornek: { ar: "الدِّينُ النَّصِيحَةُ", tr: "Din, nasihattir (samimiyettir). (Hadis-i Şerif)" }
            } 
        }
    },


    // ==================================================================
    // TH-Q-F (ث ق ف) KÖKÜ - Anlayışlı Olmak / Eğitmek
    // (Arapçadaki Kültür kelimesinin kökeni)
    // ==================================================================
    "ثقف": {
        // --- 22 Numaralı Kalıp (فَعَال ve + ة ile Kültür) ---
        22: { 
            base: { arText: "ثَقَاف" }, // Yalın hali sessiz
            suggestsPlus: true,
            "ة": { 
                emoji: "🏛️", 
                arText: "ثَقَافَة", 
                trText: "Sakafa / Kültür, eğitim, birikim.",
                ornek: { ar: "ثَقَافَةٌ عَامَّةٌ", tr: "Genel kültür." }
            } 
        },

        // --- 63 Numaralı Kalıp (مُفَعِّل - Tef'îl İsm-i Fâili) ---
        63: { 
            base: { 
                emoji: "🧠", 
                arText: "مُثَقَّف", 
                trText: "Müsakkaf / Kültürlü, aydın (entelektüel) kişi." 
            } 
        }
    },

     // ==================================================================
    // Sh-R-K (ش ر ك) KÖKÜ - Ortak Olmak / Paylaşmak
    // (Türkçedeki Şirket, Ortak (Şerik), İştirak ve Müşterek kelimelerinin atası)
    // ==================================================================
    "شرك": {
        
        // --- 18 Numaralı Kalıp (فَعِل ve + ة ile Şirket) ---
        18: { 
            base: { arText: "شَرِك" }, // Yalın hali sessiz (Ekrana boş açılır)
            suggestsPlus: true,
            "ة": { 
                emoji: "🏢", 
                arText: "شَرِكَة", 
                trText: "Şirket / Ortaklık kurulan ticari yapı.",
                ornek: { ar: "أَسَّسُوا شَرِكَةً تِجَارِيَّةً", tr: "Ticari bir şirket (ortaklık) kurdular." }
            } 
        },

         // --- 20 Numaralı Kalıp (فِعْل - Masdar/İsim) ---
        20: { 
            base: { 
                emoji: "🔗", 
                arText: "شِرْك", 
                trText: "Şirk / Ortak koşma." 
            }
        },


        // --- 35 Numaralı Kalıp (فَعِيل - Sıfat) ---
        35: { 
            base: { 
                emoji: "🤝", 
                arText: "شَرِيك", 
                trText: "Şerik / Ortak, partner.",
                ornek: { ar: "لَا شَرِيكَ لَهُ", tr: "O'nun hiçbir ortağı (şeriki) yoktur." }
            } 
        },

        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı - Karşılıklı Ortaklık) ---
        64: { base: { emoji: "🙋‍♂️", arText: "شَارَكَ", trText: "Katıldı / Paylaştı." } },
        65: { base: { emoji: "🗣️", arText: "يُشَارِكُ", trText: "Katılır / Paylaşıyor." } },
        66: { base: { emoji: "❗", arText: "شَارِكْ", trText: "Katıl / Paylaş!" } },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Müfâ'ale Masdarı) ---
        67: { 
            base: { 
                emoji: "🔄", 
                arText: "مُشَارَكَة", 
                trText: "Müşareke / Katılım, paylaşım.",
                ornek: { ar: "شُكْرًا عَلَى مُشَارَكَتِكُمْ", tr: "Katılımınız (müşarekeniz) için teşekkürler." }
            } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "📝", 
                arText: "اِشْتِرَاك", 
                trText: "İştirak / Katılım, abonelik.",
                ornek: { ar: "اِشْتِرَاكٌ شَهْرِيٌّ", tr: "Aylık abonelik (iştirak)." }
            } 
        },

        // --- 81 Numaralı Kalıp (مُفْتَعِل - İfti'âl İsm-i Fâili) ---
        81: { 
            base: { 
                emoji: "👤", 
                arText: "مُشْتَرِك", 
                trText: "Müşterik / İştirak eden, katılan, abone.",
                ornek: [
                    { 
                        ar: "مُشْتَرِكٌ جَدِيدٌ فِي الْقَنَاةِ", 
                        tr: "Kanala yeni katılan (abone olan) kişi." 
                    },
                    {
                        ar: "اِرْتَفَعَ عَدَدُ الْمُشْتَرِكِينَ",
                        tr: "Abonelerin (katılımcıların) sayısı arttı."
                    }
                ]
            } 
        },

        // --- 82 Numaralı Kalıp (مُفْتَعَل - İfti'âl İsm-i Mef'ûlü) ---
        82: { 
            base: { 
                emoji: "🤝", 
                arText: "مُشْتَرَك", 
                trText: "Müşterek / Ortak, paylaşılan.",
                ornek: [
                    { 
                        ar: "نُقْطَةٌ مُشْتَرَكَةٌ", 
                        tr: "Müşterek (ortak) nokta." 
                    },
                    {
                        ar: "اِهْتِمَامَاتٌ مُشْتَرَكَةٌ",
                        tr: "Ortak (müşterek) ilgi alanları."
                    }
                ]
            } 
        }
      },

  // ==================================================================
    // H-R-K (ح ر ك) KÖKÜ - Kımıldamak / Devinim
    // (Türkçedeki Hareket, Tahrik ve Muharrik kelimelerinin atası)
    // ==================================================================
    "حرك": {
        // --- 17 Numaralı Kalıp (فَعَل ve + ة ile Hareket) ---
        17: { 
            base: { 
                emoji: "⚡" 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🏃", 
                arText: "حَرَكَة", 
                trText: "Hareket / Kımıldama, devinim, sesli harf işareti.",
                ornek: { ar: "فِي الْحَرَكَةِ بَرَكَةٌ", tr: "Harekette bereket vardır. (Atasözü)" }
            } 
        },

        // --- 58 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Mazi - Geçişli) ---
        58: { 
            base: { 
                emoji: "👉", 
                arText: "حَرَّكَ", 
                trText: "Hareket ettirdi / Kımıldattı." 
            },
        },

        // --- 59 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Muzari) ---
        59: { 
            base: { 
                emoji: "🕹️", 
                arText: "يُحَرِّكُ", 
                trText: "Hareket ettirir / Kımıldatıyor." 
            },
        },

        // --- 60 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Emir / Nehiy) ---
        60: { 
            base: { 
                emoji: "✋", 
                arText: "حَرِّكْ", 
                trText: "Hareket ettir / Kımıldat!",
                ornek: [
                    { 
                        ar: "لَا تُحَرِّكْ بِهِ لِسَانَكَ لِتَعْجَلَ بِهِ", 
                        tr: "Onu (vahyi) çarçabuk almak için dilini kımıldatma (hareket ettirme). (Kıyâme Suresi, 16)" 
                    },
                    {
                        ar: "💬 تَفْسِيرُ الْآيَةِ: كَانَ النَّبِيُّ ﷺ يُحَرِّكُ لِسَانَهُ بِالْوَحْيِ خَشْيَةَ النِّسْيَانِ، فَأَمَرَهُ اللهُ بِالِاسْتِمَاعِ وَطَمْأَنَهُ بِأَنَّ جَمْعَهُ وَقُرْآنَهُ عَلَيْهِ.",
                        tr: "💡 Tefsir Notu: Hz. Peygamber (s.a.v), vahiy inerken unutma endişesiyle acele edip dilini hareket ettirerek Cebrail'i (a.s) tekrar ediyordu. Allah Teâlâ, vahyi onun kalbine yerleştirme garantisi vererek ona sadece dinlemesini emretmiştir. Bu ayet, ilim öğrenirken 'telaşın' değil, 'sükûnetle dinlemenin' önemini vurgular."
                    }
                ]
            },
            cekimi: ["حَرِّكْ", "حَرِّكَا", "حَرِّكُوا", "حَرِّكِي", "حَرِّكَا", "حَرِّكْنَ"]
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { 
                emoji: "🔥", 
                arText: "تَحْرِيك", 
                trText: "Tahrik / Harekete geçirme, kışkırtma.",
                ornek: { ar: "تَحْرِيكُ الْمَشَاعِرِ", tr: "Duyguları harekete geçirme (tahrik etme)." }
            } 
        },

        // --- 62 Numaralı Kalıp (مُفَعِّل - Tef'îl İsm-i Fâili) ---
        62: { 
            base: { 
                emoji: "⚙️", 
                arText: "مُحَرِّك", 
                trText: "Muharrik / Harekete geçiren şey, Motor.",
                ornek: { ar: "مُحَرِّكُ السَّيَّارَةِ", tr: "Arabanın motoru (muharriki)." }
            } 
        },

        // --- 88 Numaralı Kalıp (تَفَعُّل - Tefe'ul Babı Mazi - Geçişsiz) ---
        88: { 
            base: { 
                emoji: "🚶‍♂️", 
                arText: "تَحَرَّكَ", 
                trText: "Hareket etti / Eyleme geçti." 
            },
        },

        // --- 89 Numaralı Kalıp (تَفَعُّل - Tefe'ul Babı Muzari) ---
        89: { 
            base: { 
                emoji: "🏃‍♂️", 
                arText: "يَتَحَرَّكُ", 
                trText: "Hareket ediyor / Eyleme geçiyor." 
            },
        },

        // --- 90 Numaralı Kalıp (تَفَعُّل - Tefe'ul Babı Emir) ---
        90: { 
            base: { 
                emoji: "❗", 
                arText: "تَحَرَّكْ", 
                trText: "Hareket et / Eyleme geç!" 
            },
        },

        // --- 91 Numaralı Kalıp (تَفَعُّل - Tefe'ul Masdarı) ---
        91: { 
            base: { 
                emoji: "🌊", 
                arText: "تَحَرُّك", 
                trText: "Teharruk / Hareketlilik, eyleme geçme.",
                ornek: { ar: "تَحَرُّكَاتٌ سَرِيعَةٌ", tr: "Hızlı hareketlilikler." }
            } 
        }
    },

    // ==================================================================
    // W-Z-N (و ز ن) KÖKÜ - Tartmak / Ölçmek (Misal Fiil)
    // (Türkçedeki Vezin, Mizan ve Tevazün kelimelerinin atası)
    // ==================================================================
    "وزن": {
        // --- 1 Numaralı Kalıp (Mücerret 2. Bab Mazi) ---
        1: { 
            base: { emoji: "⚖️", arText: "وَزَنَ", trText: "Tarttı / Ölçtü." } 
        },

        // --- 4 Numaralı Kalıp (Mücerret 2. Bab Muzari - Vav düşer) ---
        4: { 
            base: { 
                emoji: "⚖️", 
                arText: "يَزِنُ", 
                trText: "Tartar / Ölçüyor.",
                ornek: { 
                    ar: "💡 قَاعِدَة صَرْفِيَّة", 
                    tr: "Sarf Kuralı: Kökün başındaki 'Vav' (و) harfi, 'Misal Fiil' kuralı gereği muzaride düşer (يَوْزِنُ değil, يَزِنُ olur)." 
                }
            } 
        },

        // --- 19 Numaralı Kalıp (فَعْل - Masdar/İsim) ---
        19: { 
            base: { 
                emoji: "📦", 
                arText: "وَزْن", 
                trText: "Vezin / Ağırlık, ölçü, sarf kalıbı.",
                ornek: [
                    { 
                        ar: "الْوَزْنُ الثَّقِيلُ", 
                        tr: "Ağır sıklet (fiziksel ağırlık/ölçü)." 
                    },
                    
                    {
                        ar: "عِلْمُ الْعَرُوضِ يَدْرُسُ أَوْزَانَ الشِّعْرِ",
                        tr: "Aruz ilmi, şiirin vezinlerini inceler. (Edebiyat derslerindeki 'Aruz Vezni' ve 'Hece Vezni' kavramları tam olarak budur)."
                    },
                    {
                        ar: "💡 مَعْلُومَة: نَحْنُ الْآنَ نَقُومُ بِتَصْنِيفِ الْكَلِمَاتِ حَسَبَ «أَوْزَانِهَا».",
                        tr: "💡 Bilgi: Biz şu an tam olarak kelimeleri 'vezinlerine' (morfolojik kalıplarına) göre sınıflandırma işi yapıyoruz."
                    }
                ]
            } 
        },

        // --- 40 Numaralı Kalıp (مِفْعَال - İsm-i Alet) ---
        40: { 
            base: { 
                emoji: "⚖️", 
                arText: "مِيزَان", 
                trText: "Mizan / Terazi, ölçü aleti.",
                ornek: [
                    { 
                        ar: "وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ", 
                        tr: "Ölçüyü (vezni) adaletle tutun ve teraziyi (mizanı) eksik tartmayın. (Rahmân Suresi, 9)" 
                    },
                    { 
                        ar: "💡 مَعْلُومَة إِمْلَائِيَّة", 
                        tr: "İ'lâl Kuralı: İsm-i Alet kalıbı 'مِفْعَال' (Mif'al) veznindedir. Aslı 'مِوْزَان' (Mivzan) şeklindedir. Ancak 'Vav' harfi esreden sonra geldiği için okuyuşu kolaylaştırmak adına 'Ye' harfine dönüşmüş ve 'مِيزَان' (Mizan) olmuştur." 
                    }
                ]
            } 
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Müfâ'ale Masdarı) ---
        67: { 
            base: { 
                emoji: "🧘‍♂️", 
                arText: "مُوَازَنَة", 
                trText: "Muvazene / Denge, denkleştirme.",
                ornek: { ar: "فَقَدَ مُوَازَنَتَهُ", tr: "Dengesini (muvazenesini) kaybetti." }
            } 
        },

        // --- 97 Numaralı Kalıp (تَفَاعُل - Tefâ'ul Masdarı) ---
        97: { 
            base: { 
                emoji: "☯️", 
                arText: "تَوَازُن", 
                trText: "Tevazün / Dengede olma, istikrar.",
                ornek: { ar: "التَّوَازُنُ الطَّبِيعِيُّ", tr: "Doğal denge." }
            } 
        }
    },

     // ==================================================================
    // S-F-W (ص ف و) KÖKÜ - Berrak Olmak / Arınmak / Seçmek
    // 1. Bab (فَعَلَ - يَفْعُلُ), Tef'îl ve İfti'âl Babları
    // ==================================================================
    "صفو": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "💧", 
                arText: "صَفَا", 
                trText: "Berraklaştı / Arındı." 
            },
            cekimi: ["صَفَا", "صَفَوَا", "صَفَوْا", "صَفَتْ", "صَفَتَا", "صَفَوْنَ", "صَفَوْتَ", "صَفَوْتُمَا", "صَفَوْتُمْ", "صَفَوْتِ", "صَفَوْتُمَا", "صَفَوْتُنَّ", "صَفَوْتُ", "صَفَوْنَا", "صَفَوْنَا"]
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "✨", 
                arText: "يَصْفُو", 
                trText: "Berraklaşır / Arınır." 
            },
            cekimi: ["يَصْفُو", "يَصْفُوَانِ", "يَصْفُونَ", "تَصْفُو", "تَصْفُوَانِ", "يَصْفُونَ", "تَصْفُو", "تَصْفُوَانِ", "تَصْفُونَ", "تَصْفِينَ", "تَصْفُوَانِ", "تَصْفُونَ", "أَصْفُو", "نَصْفُو", "نَصْفُو"]
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { 
                emoji: "❗", 
                arText: "اُصْفُ", 
                trText: "Arın! / Berraklaş!",
                ornek: {
                    ar: "💡 قَاعِدَة صَرْفِيَّة",
                    tr: "Sarf Kuralı: Nakıs (sonu illetli) fiillerin emir kipi yapılırken, meczumluk alameti olarak sondaki illet harfi kural gereği düşer (اُصْفُو değil, اُصْفُ olur)."
                }
            },
            cekimi: ["اُصْفُ", "اُصْفُوَا", "اُصْفُوا", "اُصْفِي", "اُصْفُوَا", "اُصْفُونَ"]
        },

        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "💧", 
                arText: "صَفَا", 
                trText: "Berraklaştı / Arındı.",
                ornek: [
                    {
                        ar: "خُذْ مَا صَفَا وَدَعْ مَا كَدِرَ",
                        tr: "Berrak (saf) olanı al, bulanık (kötü) olanı bırak. (Meşhur Arap Atasözü)"
                    }
                ]
            },
            cekimi: ["صَفَا", "صَفَوَا", "صَفَوْا", "صَفَتْ", "صَفَتَا", "صَفَوْنَ", "صَفَوْتَ", "صَفَوْتُمَا", "صَفَوْتُمْ", "صَفَوْتِ", "صَفَوْتُمَا", "صَفَوْتُنَّ", "صَفَوْتُ", "صَفَوْنَا", "صَفَوْنَا"]
        },

        // --- 22 Numaralı Kalıp (فَعَال - Masdar/İsim) ---
        22: { 
            base: { 
                emoji: "💎", 
                arText: "صَفَاء", 
                trText: "Safâ / Berraklık, saflık, huzur.",
                ornek: { ar: "صَفَاءُ الذِّهْنِ", tr: "Zihin berraklığı." }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🤍", 
                arText: "صَافٍ", 
                trText: "Sâfi / Saf, berrak, net, katkısız.",
                ornek: { ar: "مَاءٌ صَافٍ", tr: "Saf (berrak) su." }
            },
            cekimi: [
                { ar: "صَافٍ", tr: "Belirsiz (Nekra) Kullanım - Ye harfi düşer." },
                { ar: "اَلصَّافِي", tr: "Belirli (Marife) Kullanım - Ye harfi geri gelir." }
            ],
            suggestsPlus: true,
            "ة": { 
                emoji: "✨", 
                arText: "صَافِيَة", 
                trText: "Safiye / Saf (Dişil), arınmış kadın." 
            }
        },

        // --- 35 Numaralı Kalıp (فَعِيل - Sıfat) ---
        35: {
            base: {
                emoji: "🤝",
                arText: "صَفِيّ",
                trText: "Safiyy / En saf, seçkin, samimi dost.",
                ornek: { ar: "صَفِيُّ اللهِ", tr: "Allah'ın seçkin ve samimi kulu (Özellikle Hz. Adem için kullanılır)." }
            }
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل / تَفْعِلَة - Tef'îl Babı Masdarı) ---
        61: { 
            base: { 
                emoji: "🧹", 
                arText: "تَصْفِيَة", 
                trText: "Tasfiye / Arıtma, temizleme, süzme.",
                ornek: { ar: "تَصْفِيَةُ الْمِيَاهِ", tr: "Suyun arıtılması (tasfiyesi)." }
            } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi) ---
        77: { 
            base: { 
                emoji: "🎯", 
                arText: "اِصْطَفَى", 
                trText: "Seçti / Süzüp ayırdı.",
                ornek: { ar: "إِنَّ اللهَ اصْطَفَىٰ آدَمَ وَنُوحًا", tr: "Şüphesiz Allah, Âdem'i ve Nûh'u seçti. (Âl-i İmrân Suresi, 33)" }
            },
            cekimi: ["اِصْطَفَى", "اِصْطَفَيَا", "اِصْطَفَوْا", "اِصْطَفَتْ", "اِصْطَفَتَا", "اِصْطَفَيْنَ", "اِصْطَفَيْتَ", "اِصْطَفَيْتُمَا", "اِصْطَفَيْتُمْ", "اِصْطَفَيْتِ", "اِصْطَفَيْتُمَا", "اِصْطَفَيْتُنَّ", "اِصْطَفَيْتُ", "اِصْطَفَيْنَا", "اِصْطَفَيْنَا"]
        },

        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - İfti'âl Babı Muzari) ---
        78: { 
            base: { 
                emoji: "⭐", 
                arText: "يَصْطَفِي", 
                trText: "Seçer / Süzüp ayırır.",
                ornek: { ar: "اللهُ يَصْطَفِي مِنَ الْمَلَائِكَةِ رُسُلًا", tr: "Allah meleklerden (kendi mesajı için) elçiler seçer. (Hac Suresi, 75)" }
            },
            cekimi: ["يَصْطَفِي", "يَصْطَفِيَانِ", "يَصْطَفُونَ", "تَصْطَفِي", "تَصْطَفِيَانِ", "يَصْطَفِينَ", "تَصْطَفِي", "تَصْطَفِيَانِ", "تَصْطَفُونَ", "تَصْطَفِينَ", "تَصْطَفِيَانِ", "تَصْطَفِينَ", "أَصْطَفِي", "نَصْطَفِي", "نَصْطَفِي"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "✨", 
                arText: "اِصْطِفَاء", 
                trText: "Istıfâ / Seçme, süzüp çıkarma.",
                ornek: [
                    { 
                        ar: "الِاصْطِفَاءُ الرَّبَّانِيُّ", 
                        tr: "İlahi seçim (Süzüp arındırarak seçme)." 
                    },
                    { 
                        ar: "💡 قَاعِدَة صَرْفِيَّة", 
                        tr: "Sarf Kuralı (Ses Olayı): Kökün ilk harfi kalın olan 'ص' olduğu için, İfti'âl babının ince 'ت' (Te) harfi kalınlaşarak 'ط' (Ta) harfine dönüşür. Aslı 'اِصْتِفَاء' iken telaffuz kolaylığı için 'اِصْطِفَاء' (Istıfâ) olmuştur." 
                    }
                ]
            } 
        },

        // --- 82 Numaralı Kalıp (مُفْتَعَل - İfti'âl İsm-i Mef'ûlü) ---
        82: { 
            base: { 
                emoji: "👑", 
                arText: "مُصْطَفَى", 
                trText: "Mustafa / Seçilmiş olan, güzide.",
                ornek: { ar: "النَّبِيُّ الْمُصْطَفَى", tr: "Seçilmiş olan Peygamber." }
            } 
        }
    },

    // ==================================================================
    // A-F-W (ع ف و) KÖKÜ - Affetmek / Silmek / İzini Yok Etmek
    // 1. Bab (فَعَلَ - يَفْعُلُ), Müfâ'ale ve İstif'âl Babları
    // ==================================================================
    "عفو": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🕊️", 
                arText: "عَفَا", 
                trText: "Affetti / Bağışladı / Silip yok etti.",
                ornek: { ar: "عَفَا اللهُ عَنْكَ", tr: "Allah seni affetsin. (Tevbe Suresi, 43)" }
            },
            cekimi: ["عَفَا", "عَفَوَا", "عَفَوْا", "عَفَتْ", "عَفَتَا", "عَفَوْنَ", "عَفَوْتَ", "عَفَوْتُمَا", "عَفَوْتُمْ", "عَفَوْتِ", "عَفَوْتُمَا", "عَفَوْتُنَّ", "عَفَوْتُ", "عَفَوْنَا", "عَفَوْنَا"]
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "🤍", 
                arText: "يَعْفُو", 
                trText: "Affeder / Bağışlar.",
                ornek: { ar: "وَيَعْفُو عَنْ كَثِيرٍ", tr: "Çoğunu da affeder (görmezden gelir). (Şûrâ Suresi, 30)" }
            },
            cekimi: ["يَعْفُو", "يَعْفُوَانِ", "يَعْفُونَ", "تَعْفُو", "تَعْفُوَانِ", "يَعْفُونَ", "تَعْفُو", "تَعْفُوَانِ", "تَعْفُونَ", "تَعْفِينَ", "تَعْفُوَانِ", "تَعْفُونَ", "أَعْفُو", "نَعْفُو", "نَعْفُو"]
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { 
                emoji: "🤲", 
                arText: "اُعْفُ", 
                trText: "Affet / Bağışla!",
                ornek: { 
                    ar: "وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا", 
                    tr: "Bizi affet, bizi bağışla, bize merhamet et! (Bakara Suresi, 286)" 
                }
            },
            cekimi: ["اُعْفُ", "اُعْفُوَا", "اُعْفُوا", "اُعْفِي", "اُعْفُوَا", "اُعْفُونَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Masdar) ---
        19: { 
            base: { 
                emoji: "🤝", 
                arText: "عَفْو", 
                trText: "Af / Bağışlama, müsamaha.",
                ornek: { ar: "خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ", tr: "Affı (kolaylık yolunu) tut ve iyiliği emret. (A'râf Suresi, 199)" }
            } 
        },

        // --- 26 Numaralı Kalıp (فَعُول - Mübalağalı İsm-i Fâil / Allah'ın İsmi) ---
        26: { 
            base: { 
                emoji: "✨", 
                arText: "عَفُوّ", 
                trText: "Afüvv / Çok affeden, günahların izini tamamen silen. (İsm-i Fail Mübalağa)",
                ornek: { ar: "إِنَّ اللهَ كَانَ عَفُوًّا غَفُورًا", tr: "Şüphesiz Allah çok affedicidir (Afüvv'dür), çok bağışlayıcıdır. (Nisâ Suresi, 43)" }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🛡️", 
                arText: "عَافٍ", 
                trText: "Affeden / Bağışlayan."
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🍵", 
                arText: "عَافِيَة", 
                trText: "Âfiyet / Sağlık, belalardan korunma.",
                ornek: [
                    { ar: "نَسْأَلُ اللهَ الْعَفْوَ وَالْعَافِيَةَ", tr: "Allah'tan af ve afiyet (sağlık/esenlik) dileriz." },
                    { ar: "💡 مَعْلُومَة ثَقَافِيَّة", tr: "Kültürel Not: 'Afiyet' kelimesi, Allah'ın kulunu hastalıklardan, dertlerden ve belalardan 'affetmesi, uzak tutması' anlamına gelir." }
                ]
            }
        },

        // --- 70 Numaralı Kalıp (مُفَاعَل - Müfâ'ale Babı İsm-i Mef'ûlü) ---
        // (Sistemindeki ism-i mef'ul kalıbı 68 ise bunu kullanabilirsin)
        70: {
            base: {
                emoji: "✅",
                arText: "مُعَافًى",
                trText: "Muaf / Affedilmiş, sorumlu tutulmayan, sağlığına kavuşmuş.",
                ornek: { ar: "هُوَ مُعَافًى مِنَ الضَّرَائِبِ", tr: "O, vergilerden muaftır (muaf tutulmuştur)." }
            }
        },

        // --- 100 Numaralı Kalıp (اِسْتَفْعَلَ - İstif'âl Babı Mazi) ---
        100: { 
            base: { 
                emoji: "✋", 
                arText: "اِسْتَعْفَى", 
                trText: "Görevden affını istedi (İstifa etti).",
                ornek: { ar: "اِسْتَعْفَى الْمُدِيرُ مِنْ مَنْصِبِهِ", tr: "Müdür görevinden affını istedi (istifa etti)." }
            },
            cekimi: ["اِسْتَعْفَى", "اِسْتَعْفَيَا", "اِسْتَعْفَوْا", "اِسْتَعْفَتْ", "اِسْتَعْفَتَا", "اِسْتَعْفَيْنَ", "اِسْتَعْفَيْتَ", "اِسْتَعْفَيْتُمَا", "اِسْتَعْفَيْتُمْ", "اِسْتَعْفَيْتِ", "اِسْتَعْفَيْتُمَا", "اِسْتَعْفَيْتُنَّ", "اِسْتَعْفَيْتُ", "اِسْتَعْفَيْنَا", "اِسْتَعْفَيْنَا"]
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - İstif'âl Babı Masdarı) ---
        103: { 
            base: { 
                emoji: "📜", 
                arText: "اِسْتِعْفَاء", 
                trText: "İstifa / Görevden affını (bağışlanmasını) talep etme.",
                ornek: [
                    { ar: "قَدَّمَ رِسَالَةَ الِاسْتِعْفَاءِ", tr: "İstifa (affını isteme) mektubunu sundu." },
                    { ar: "💡 مَعْلُومَة لُغَوِيَّة", tr: "Dil Notu: Türkçedeki 'İstifa' kelimesi tam olarak buradan gelir. Bir çalışanın, yöneticisinden görev yükünün üzerinden alınmasını, yani 'affedilmeyi' talep etmesidir." }
                ]
            } 
        }
    },

    // ==================================================================
    // W-S-Y (و ص ي) KÖKÜ - Öğüt Vermek / Vasiyet Etmek / Bağlamak
    // Lefîf-i Mefrûk (İlk ve son harfi illetli). İf'âl ve Tef'îl Babları ağırlıklıdır.
    // ==================================================================
    "وصي": {
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: {
            base: {
                emoji: "🛡️",
                arText: "وَصِيّ",
                trText: "Vasi / Koruyucu, vasiyet edilen kişi.",
                ornek: { ar: "عَيَّنَهُ وَصِيًّا عَلَى أَوْلَادِهِ", tr: "Onu çocuklarının üzerine vasi (koruyucu/gözetmen) tayin etti." }
            },
            suggestsPlus: true,
            "ة": {
                emoji: "📜",
                arText: "وَصِيَّة",
                trText: "Vasiyet / Vasiyetname, kesin öğüt.",
                ornek: { 
                    ar: "مِنْ بَعْدِ وَصِيَّةٍ يُوصِي بِهَا أَوْ دَيْنٍ", 
                    tr: "Yapacağı vasiyetten ya da borcundan sonra... (Nisâ Suresi, 11)" 
                }
            }
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi) ---
        52: { 
            base: { 
                emoji: "🗣️", 
                arText: "أَوْصَى", 
                trText: "Vasiyet etti / Tavsiye etti.",
                ornek: { 
                    ar: "وَأَوْصَانِي بِالصَّلَاةِ وَالزَّكَاةِ مَا دُمْتُ حَيًّا", 
                    tr: "Yaşadığım sürece bana namazı ve zekatı vasiyet etti (emretti). (Meryem Suresi, 31)" 
                }
            },
            cekimi: ["أَوْصَى", "أَوْصَيَا", "أَوْصَوْا", "أَوْصَتْ", "أَوْصَتَا", "أَوْصَيْنَ", "أَوْصَيْتَ", "أَوْصَيْتُمَا", "أَوْصَيْتُمْ", "أَوْصَيْتِ", "أَوْصَيْتُمَا", "أَوْصَيْتُنَّ", "أَوْصَيْتُ", "أَوْصَيْنَا", "أَوْصَيْنَا"]
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: { 
            base: { 
                emoji: "💬", 
                arText: "يُوصِي", 
                trText: "Vasiyet eder / Tavsiye ediyor.",
                ornek: { ar: "يُوصِيكُمُ اللهُ فِي أَوْلَادِكُمْ", tr: "Allah size çocuklarınız hakkında (hükmünü) tavsiye eder / emreder. (Nisâ Suresi, 11)" }
            },
            cekimi: ["يُوصِي", "يُوصِيَانِ", "يُوصُونَ", "تُوصِي", "تُوصِيَانِ", "يُوصِينَ", "تُوصِي", "تُوصِيَانِ", "تُوصُونَ", "تُوصِينَ", "تُوصِيَانِ", "تُوصِينَ", "أُوصِي", "نُوصِي", "نُوصِي"]
        },

        // --- 54 Numaralı Kalıp (أَفْعِلْ - İf'âl Babı Emir) ---
        54: { 
            base: { 
                emoji: "❗", 
                arText: "أَوْصِ", 
                trText: "Vasiyet et / Tavsiye et!",
                not: "Not: Nakıs fiil olduğu için emir kipinde sondaki illet harfi (Ye) düşmüştür."
            },
            cekimi: ["أَوْصِ", "أَوْصِيَا", "أَوْصُوا", "أَوْصِي", "أَوْصِيَا", "أَوْصِينَ"]
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "📝", 
                arText: "إِيصَاء", 
                trText: "İysâ / Vasiyet etme.",
                ornek: [
                    { 
                        ar: "إِيصَاءُ الْمَرِيضِ بِالْخَيْرِ", 
                        tr: "Hastanın hayır vasiyet etmesi." 
                    },
                    { 
                        ar: "💡 قَاعِدَة إِمْلَائِيَّة", 
                        tr: "Sarf Kuralı (Ses Olayı): Kelimenin aslı 'إِوْصَاء' (İvsâ) şeklindedir. Kökün ilk harfi olan 'Vav' (و), kesradan (esre) sonra sakin geldiği için okuyuş kolaylığı sağlamak adına 'Ye' (ي) harfine dönüşmüş ve 'إِيصَاء' (İysâ) olmuştur." 
                    }
                ]
            } 
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Tef'îl Babı Mazi) ---
        58: { 
            base: { 
                emoji: "📜", 
                arText: "وَصَّى", 
                trText: "Tavsiye etti / (Şiddetle) Öğütledi.",
                ornek: { 
                    ar: "وَوَصَّيْنَا الْإِنْسَانَ بِوَالِدَيْهِ إِحْسَانًا", 
                    tr: "Biz insana, anne-babasına iyilik etmesini tavsiye ettik (kesin olarak emrettik). (Ahkâf Suresi, 15)" 
                }
            },
            cekimi: ["وَصَّى", "وَصَّيَا", "وَصَّوْا", "وَصَّتْ", "وَصَّتَا", "وَصَّيْنَ", "وَصَّيْتَ", "وَصَّيْتُمَا", "وَصَّيْتُمْ", "وَصَّيْتِ", "وَصَّيْتُمَا", "وَصَّيْتُنَّ", "وَصَّيْتُ", "وَصَّيْنَا", "وَصَّيْنَا"]
        },

        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Tef'îl Babı Muzari) ---
        59: { 
            base: { emoji: "🗣️", arText: "يُوَصِّي", trText: "Tavsiye eder / Öğütler." },
            cekimi: ["يُوَصِّي", "يُوَصِّيَانِ", "يُوَصُّونَ", "تُوَصِّي", "تُوَصِّيَانِ", "يُوَصِّينَ", "تُوَصِّي", "تُوَصِّيَانِ", "تُوَصُّونَ", "تُوَصِّينَ", "تُوَصِّيَانِ", "تُوَصِّينَ", "أُوَصِّي", "نُوَصِّي", "نُوَصِّي"]
        },

        // --- 60 Numaralı Kalıp (فَعِّلْ - Tef'îl Babı Emir) ---
        60: { 
            base: { emoji: "❗", arText: "وَصِّ", trText: "Tavsiye et / Öğütle!" },
            cekimi: ["وَصِّ", "وَصِّيَا", "وَصُّوَا", "وَصِّي", "وَصِّيَا", "وَصِّينَ"]
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل / تَفْعِلَة - Tef'îl Babı Masdarı) ---
        61: { 
            base: { 
                emoji: "👍", 
                arText: "تَوْصِيَة", 
                trText: "Tavsiye / Öneri, öğüt.",
                ornek: [
                    { 
                        ar: "رِسَالَةُ تَوْصِيَةٍ", 
                        tr: "Tavsiye mektubu (Referans)." 
                    },
                    {
                        ar: "💡 قَاعِدَة صَرْفِيَّة",
                        tr: "Sarf Kuralı: Son harfi illetli olan (Nakıs/Lefîf) fiillerde Tef'îl babı masdarı 'تَفْعِيل' (Tevsîy) şeklinde gelmez. Bunun yerine sonuna 'ة' alarak 'تَفْعِلَة' (Tavsiye) kalıbında gelir. (Tıpkı Tasfiye, Terbiye kelimeleri gibi)."
                    }
                ]
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "📋", 
                arText: "تَوْصِيَات", 
                trText: "Tavsiyeler / Öneriler." 
            }
        },

        // --- 100 Numaralı Kalıp (اِسْتَفْعَلَ - İstif'âl Babı Mazi) ---
        100: { 
            base: { emoji: "🤝", arText: "اِسْتَوْصَى", trText: "Tavsiye istedi / Hayırla muamele etmeyi kabul etti." },
            cekimi: ["اِسْتَوْصَى", "اِسْتَوْصَيَا", "اِسْتَوْصَوْا", "اِسْتَوْصَتْ", "اِسْتَوْصَتَا", "اِسْتَوْصَيْنَ", "اِسْتَوْصَيْتَ", "اِسْتَوْصَيْتُمَا", "اِسْتَوْصَيْتُمْ", "اِسْتَوْصَيْتِ", "اِسْتَوْصَيْتُمَا", "اِسْتَوْصَيْتُنَّ", "اِسْتَوْصَيْتُ", "اِسْتَوْصَيْنَا", "اِسْتَوْصَيْنَا"]
        },

        // --- 102 Numaralı Kalıp (اِسْتَفْعِلْ - İstif'âl Babı Emir) ---
        102: { 
            base: { 
                emoji: "❗", 
                arText: "اِسْتَوْصِ", 
                trText: "Tavsiye kabul et / Hayırla muamele et!" 
            },
            cekimi: [
                "اِسْتَوْصِ", "اِسْتَوْصِيَا", 
                {
                    ar: "اِسْتَوْصُوا بِالنِّسَاءِ خَيْرًا",
                    tr: "Kadınlara iyi davranmanızı (onlara hayırla muamele etmenizi) tavsiye ediyorum; bu tavsiyemi kabul edin. (Hadis-i Şerif)"
                }, 
                "اِسْتَوْصِي", "اِسْتَوْصِيَا", "اِسْتَوْصِينَ"
            ]
        }
    },

    // ==================================================================
    // 1. K-L-M (ك ل م) KÖKÜ - Konuşmak / Etkilemek / Söz Söylemek
    // Tef'îl ve Tefe'ul babları ağırlıklıdır.
    // ==================================================================
    "كلم": {
        // --- 18 Numaralı Kalıp (فَعِل - İsim / +ة ile Kelime) ---
        18: { 
            base: { arText: "كَلِم" }, // Yalın hali sessiz
            suggestsPlus: true, 
            "ة": { 
                emoji: "📝", 
                arText: "كَلِمَة", 
                trText: "Kelime / Sözcük.",
                ornek: [
                    { 
                        ar: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ", 
                        tr: "Güzel söz (kelime) sadakadır. (Hadis-i Şerif)" 
                    },
                    {
                        ar: "أَلَمْ تَرَ كَيْفَ ضَرَبَ اللهُ مَثَلًا كَلِمَةً طَيِّبَةً كَشَجَرَةٍ طَيِّبَةٍ",
                        tr: "Görmedin mi Allah nasıl bir misal getirdi: Güzel bir kelime, kökü (yerde) sabit, dalları gökte olan güzel bir ağaç gibidir. (İbrâhîm Suresi, 24)"
                    },
                    {
                        ar: "رُبَّ كَلِمَةٍ سَلَبَتْ نِعْمَةً",
                        tr: "Nice kelimeler (sözler) vardır ki, bir nimeti alıp götürür. (Arap Atasözü - Düşünmeden konuşmanın zararına işaret eder)"
                    }
                ]
            },
            "ات": {
                emoji: "📚",
                arText: "كَلِمَات",
                trText: "Kelimeler.",
                ornek: {
                    ar: "قُلْ لَوْ كَانَ الْبَحْرُ مِدَادًا لِكَلِمَاتِ رَبِّي لَنَفِدَ الْبَحْرُ قَبْلَ أَنْ تَنْفَدَ كَلِمَاتُ رَبِّي",
                    tr: "De ki: Rabbimin kelimeleri(ni yazmak) için deniz mürekkep olsa, Rabbimin kelimeleri tükenmeden önce deniz mutlaka tükenirdi. (Kehf Suresi, 109 - Tefsir Notu: Allah'ın ilminin ve hikmetinin sonsuzluğunu ifade eder.)"
                }
            }
        },

        // --- 22 Numaralı Kalıp (فَعَال - İsim / Masdar) ---
        22: { 
            base: { 
                emoji: "🗣️", 
                arText: "كَلَام", 
                trText: "Kelam / Söz, konuşma.",
                ornek: [
                    { 
                        ar: "كَلَامُ اللهِ", 
                        tr: "Allah'ın kelamı (sözü - Kur'an-ı Kerim için kullanılır)." 
                    },
                    {
                        ar: "خَيْرُ الْكَلَامِ مَا قَلَّ وَدَلَّ",
                        tr: "Sözün (kelamın) en hayırlısı, az ve öz olanı (kısa olup manaya delalet edeni)dır. (Meşhur Arap Atasözü)"
                    },
                    {
                        ar: "إِنَّ الْكَلَامَ لَفِي الْفُؤَادِ وَإِنَّمَا \n جُعِلَ اللِّسَانُ عَلَى الْفُؤَادِ دَلِيلًا",
                        tr: "Şüphesiz asıl kelam (söz) kalptedir. Dil ise, sadece kalpte olana bir delil (tercüman) kılınmıştır. (Ahtal b. el-Hüseyin - Meşhur Şiir Beyti)"
                    }
                ]
            } 
        },

        // --- 35 Numaralı Kalıp (فَعِيل - Sıfat-ı Müşebbehe / İsim) ---
        35: {
            base: {
                emoji: "👑",
                arText: "كَلِيم",
                trText: "Kelîm / Kendisiyle konuşulan kişi.",
                ornek: [
                    {
                        ar: "كَلِيمُ اللهِ",
                        tr: "Kelimullah / Allah'ın kendisiyle doğrudan konuştuğu kişi."
                    },
                    {
                        ar: "💡 مَعْلُومَة ثَقَافِيَّة",
                        tr: "Kültürel Not: 'Kelimullah' ünvanı, Tur Dağı'nda Allah ile vasıtasız bir şekilde konuştuğu için Hz. Musa'ya (a.s.) verilmiş çok şerefli bir lakaptır."
                    }
                ]
            }
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Tef'îl Babı Mazi) ---
        58: { 
            base: { 
                emoji: "🗣️", 
                arText: "كَلَّمَ", 
                trText: "Konuştu / Hitap etti.",
                ornek: [
                    { 
                        ar: "وَكَلَّمَ اللهُ مُوسَىٰ تَكْلِيمًا", 
                        tr: "Ve Allah Musa ile doğrudan konuştu. (Nisâ Suresi, 164)" 
                    },
                    {
                        ar: "الْيَوْمَ نَخْتِمُ عَلَىٰ أَفْوَاهِهِمْ وَتُكَلِّمُنَا أَيْدِيهِمْ",
                        tr: "O gün onların ağızlarını mühürleriz; (yaptıklarını) bize elleri söyler (konuşur). (Yâsîn Suresi, 65)"
                    }
                ]
            },
            cekimi: ["كَلَّمَ", "كَلَّمَا", "كَلَّمُوا", "كَلَّمَتْ", "كَلَّمَتَا", "كَلَّمْنَ", "كَلَّمْتَ", "كَلَّمْتُمَا", "كَلَّمْتُمْ", "كَلَّمْتِ", "كَلَّمْتُمَا", "كَلَّمْتُنَّ", "كَلَّمْتُ", "كَلَّمْنَا", "كَلَّمْنَا"]
        },

        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Tef'îl Babı Muzari) ---
        59: { 
            base: { 
                emoji: "💬", 
                arText: "يُكَلِّمُ", 
                trText: "Konuşur / Hitap ediyor.",
                ornek: {
                    ar: "وَلَا يُكَلِّمُهُمُ اللهُ يَوْمَ الْقِيَامَةِ",
                    tr: "Allah kıyamet gününde onlarla konuşmayacaktır. (Bakara Suresi, 174)"
                }
            },
            cekimi: ["يُكَلِّمُ", "يُكَلِّمَانِ", "يُكَلِّمُونَ", "تُكَلِّمُ", "تُكَلِّمَانِ", "يُكَلِّمْنَ", "تُكَلِّمُ", "تُكَلِّمَانِ", "تُكَلِّمُونَ", "تُكَلِّمِينَ", "تُكَلِّمَانِ", "تُكَلِّمْنَ", "أُكَلِّمُ", "نُكَلِّمُ", "نُكَلِّمُ"]
        },

        // --- 60 Numaralı Kalıp (فَعِّلْ - Tef'îl Babı Emir) ---
        60: { 
            base: { 
                emoji: "❗", 
                arText: "كَلِّمْ", 
                trText: "Konuş!",
                ornek: [
                    {
                        ar: "كَلِّمِ النَّاسَ عَلَى قَدْرِ عُقُولِهِمْ",
                        tr: "İnsanlarla akıllarının seviyesine göre konuş. (Hikmetli Söz)"
                    },
                    {
                        ar: "😁 كَلِّمْ كَلِّمْ لَا يَنْفَعُ",
                        tr: "Kellim kellim lâ yenfa' (Konuş konuş fayda etmez / Anlat anlat heyecanlı oluyor). Halk arasında, laf anlamayan kişiler için kullanılan çok meşhur ve eğlenceli bir tekerlemedir."
                    }
                ]
            },
            cekimi: ["كَلِّمْ", "كَلِّمَا", "كَلِّمُوا", "كَلِّمِي", "كَلِّمَا", "كَلِّمْنَ"]
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { 
                emoji: "🎙️", 
                arText: "تَكْلِيم", 
                trText: "Teklim / Konuşturma, hitap.",
                ornek: [
                    {
                        ar: "وَكَلَّمَ اللهُ مُوسَىٰ تَكْلِيمًا",
                        tr: "Ve Allah Musa ile doğrudan konuştu (kelam etti). (Nisâ Suresi, 164)"
                    },
                    {
                        ar: "💡 مَعْلُومَة نَحْوِيَّة",
                        tr: "Gramer Notu: Ayetteki 'تَكْلِيمًا' (Teklîmen) kelimesi Mef'ûl-i Mutlak'tır. Arapçada bir fiilin kendi masdarı cümlenin sonunda böyle kullanıldığında anlamı pekiştirir. Yani bu ifade 'Musa olayı rüyasında gördü veya ilham aldı' gibi mecaz yorumları engeller, Allah'ın 'bizzat ve doğrudan' konuştuğunu gramatik olarak ispatlar."
                    }
                ]
            } 
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Müfâ'ale Babı Masdarı) ---
        67: { 
            base: { 
                emoji: "📞", 
                arText: "مُكَالَمَة", 
                trText: "Mükaleme / Karşılıklı konuşma, diyalog, telefon görüşmesi.",
                ornek: { ar: "مُكَالَمَةٌ هَاتِفِيَّةٌ", tr: "Telefon görüşmesi (mükalemesi)." }
            } 
        },

        // --- 88 Numaralı Kalıp (تَفَعَّلَ - Tefe'ul Babı Mazi) ---
        88: { 
            base: { 
                emoji: "💬", 
                arText: "تَكَلَّمَ", 
                trText: "Konuştu (Kendini ifade etti).",
                ornek: {
                    ar: "مَنْ تَكَلَّمَ فِيمَا لَا يَعْنِيهِ، سَمِعَ مَا لَا يُرْضِيهِ",
                    tr: "Kim kendisini ilgilendirmeyen (malayani) konularda konuşursa, hoşuna gitmeyecek şeyler işitir. (Arap Atasözü)"
                }
            },
            cekimi: ["تَكَلَّمَ", "تَكَلَّمَا", "تَكَلَّمُوا", "تَكَلَّمَتْ", "تَكَلَّمَتَا", "تَكَلَّمْنَ", "تَكَلَّمْتَ", "تَكَلَّمْتُمَا", "تَكَلَّمْتُمْ", "تَكَلَّمْتِ", "تَكَلَّمْتُمَا", "تَكَلَّمْتُنَّ", "تَكَلَّمْتُ", "تَكَلَّمْنَا", "تَكَلَّمْنَا"]
        },

        // --- 89 Numaralı Kalıp (يَتَفَعَّلُ - Tefe'ul Babı Muzari) ---
        89: { 
            base: { 
                emoji: "🗣️", 
                arText: "يَتَكَلَّمُ", 
                trText: "Konuşur / Konuşuyor.",
                ornek: {
                    ar: "مَنْ كَانَ يُؤْمِنُ بِاللهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
                    tr: "Kim Allah'a ve ahiret gününe iman ediyorsa, ya hayır söylesin (konuşsun) ya da sussun. (Hadis-i Şerif)"
                }
            },
            cekimi: ["يَتَكَلَّمُ", "يَتَكَلَّمَانِ", "يَتَكَلَّمُونَ", "تَتَكَلَّمُ", "تَتَكَلَّمَانِ", "يَتَكَلَّمْنَ", "تَتَكَلَّمُ", "تَتَكَلَّمَانِ", "تَتَكَلَّمُونَ", "تَتَكَلَّمِينَ", "تَتَكَلَّمَانِ", "تَتَكَلَّمْنَ", "أَتَكَلَّمُ", "نَتَكَلَّمُ", "نَتَكَلَّمُ"]
        },

        // --- 90 Numaralı Kalıp (تَفَعَّلْ - Tefe'ul Babı Emir) ---
        90: { 
            base: { 
                emoji: "❗", 
                arText: "تَكَلَّمْ", 
                trText: "Konuş!",
                ornek: {
                    ar: "تَكَلَّمُوا تُعْرَفُوا، فَإِنَّ الْمَرْءَ مَخْبُوءٌ تَحْتَ لِسَانِهِ",
                    tr: "Konuşun ki tanınasınız; zira insan dilinin altında gizlidir. (Hz. Ali)"
                }
            },
            cekimi: ["تَكَلَّمْ", "تَكَلَّمَا", "تَكَلَّمُوا", "تَكَلَّمِي", "تَكَلَّمَا", "تَكَلَّمْنَ"]
        },

        // --- 91 Numaralı Kalıp (تَفَعُّل - Tefe'ul Babı Masdarı) ---
        91: { 
            base: { 
                emoji: "🎙️", 
                arText: "تَكَلُّم", 
                trText: "Tekellüm / Konuşma eylemi." 
            } 
        },

        // --- 92 Numaralı Kalıp (مُتَفَعِّل - Tefe'ul Babı İsm-i Fâili) ---
        92: { 
            base: { 
                emoji: "👤", 
                arText: "مُتَكَلِّم", 
                trText: "Mütekellim / Konuşan kişi.",
                ornek: [
                    { 
                        ar: "ضَمِيرُ الْمُتَكَلِّمِ", 
                        tr: "Mütekellim (1. Şahıs) zamiri." 
                    },
                    { 
                        ar: "💡 مَعْلُومَة نَحْوِيَّة", 
                        tr: "Gramer Notu: Arapçada 'Ben' ve 'Biz' şahıslarına (1. Tekil ve Çoğul) 'Mütekellim' denir. Çünkü sözü söyleyen (tekellüm eden) doğrudan kişinin kendisidir." 
                    }
                ]
            } 
        }
    },

    // ==================================================================
    // 2. B-Y-N (ب ي ن) KÖKÜ - Açık Olmak / Açıklamak
    // İf'âl, Tef'îl ve Tefe'ul Bablarında muazzam anlamlar üretir.
    // ==================================================================
    "بين": {
        // --- 22 Numaralı Kalıp (فَعَال - İsim / Masdar) ---
        22: { 
            base: { 
                emoji: "📜", 
                arText: "بَيَان", 
                trText: "Beyan / Açıklama, bildiri, hitabet.",
                ornek: { ar: "عَلَّمَهُ الْبَيَانَ", tr: "Ona beyanı (açıklamayı/düşüncesini ifade etmeyi) öğretti. (Rahmân Suresi, 4)" }
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "📊", 
                arText: "بَيَانَات", 
                trText: "Beyanatlar / Veriler, datalar." 
            }
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi - Ecvef Uyarlaması) ---
        52: { 
            base: { emoji: "✨", arText: "أَبَانَ", trText: "Açıkladı / Apaçık gösterdi." } 
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: { 
            base: { emoji: "💡", arText: "يُبِينُ", trText: "Açıklar / Gösterir." } 
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { emoji: "📢", arText: "إِبَانَة", trText: "Açıklığa kavuşturma / İfade etme." } 
        },
       // --- 56 Numaralı Kalıp (مُفْعِل - İf'âl Babı İsm-i Fâili) ---
        56: { 
            base: { 
                emoji: "📖", 
                arText: "مُبِين", 
                trText: "Mübin / Apaçık, açıklayıcı.",
                ornek: [
                    { 
                        ar: "كِتَابٌ مُبِينٌ", 
                        tr: "Apaçık (ve açıklayıcı) bir kitap." 
                    },
                    {
                        ar: "إِنَّ الشَّيْطَانَ لِلْإِنْسَانِ عَدُوٌّ مُبِينٌ",
                        tr: "Şüphesiz şeytan insan için apaçık bir düşmandır. (Yûsuf Suresi, 5)"
                    },
                    {
                        ar: "وَمَا عَلَيْنَا إِلَّا الْبَلَاغُ الْمُبِينُ",
                        tr: "Bize düşen ancak apaçık bir tebliğdir. (Yâsîn Suresi, 17)"
                    },
                    {
                        ar: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا",
                        tr: "Şüphesiz biz sana apaçık bir fetih (Feth-i Mübîn) verdik. (Fetih Suresi, 1)"
                    }
                ]
            } 
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Tef'îl Babı Mazi) ---
        58: { 
            base: { emoji: "🔍", arText: "بَيَّنَ", trText: "Açıkladı / Beyan etti." },
            cekimi: ["بَيَّنَ", "بَيَّنَا", "بَيَّنُوا", "بَيَّنَتْ", "بَيَّنَتَا", "بَيَّنْنَ", "بَيَّنْتَ", "بَيَّنْتُمَا", "بَيَّنْتُمْ", "بَيَّنْتِ", "بَيَّنْتُمَا", "بَيَّنْتُنَّ", "بَيَّنْتُ", "بَيَّنَّا", "بَيَّنَّا"]
        },

        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Tef'îl Babı Muzari) ---
        59: { 
            base: { emoji: "🗣️", arText: "يُبَيِّنُ", trText: "Açıklar / Beyan eder." },
            cekimi: ["يُبَيِّنُ", "يُبَيِّنَانِ", "يُبَيِّنُونَ", "تُبَيِّنُ", "تُبَيِّنَانِ", "يُبَيِّنْنَ", "تُبَيِّنُ", "تُبَيِّنَانِ", "تُبَيِّنُونَ", "تُبَيِّنِينَ", "تُبَيِّنَانِ", "تُبَيِّنْنَ", "أُبَيِّنُ", "نُبَيِّنُ", "نُبَيِّنُ"]
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { emoji: "📝", arText: "تَبْيِين", trText: "Tebyin / Açıklığa kavuşturma." } 
        },

        // --- 88 Numaralı Kalıp (تَفَعَّلَ - Tefe'ul Babı Mazi) ---
        88: { 
            base: { 
                emoji: "☀️", 
                arText: "تَبَيَّنَ", 
                trText: "Açıkça ortaya çıktı / Belli oldu.",
                ornek: { ar: "قَدْ تَبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ", tr: "Doğru yol eğri yoldan apaçık belli olmuştur. (Bakara Suresi, 256)" }
            },
            cekimi: ["تَبَيَّنَ", "تَبَيَّنَا", "تَبَيَّنُوا", "تَبَيَّنَتْ", "تَبَيَّنَتَا", "تَبَيَّنْنَ", "تَبَيَّنْتَ", "تَبَيَّنْتُمَا", "تَبَيَّنْتُمْ", "تَبَيَّنْتِ", "تَبَيَّنْتُمَا", "تَبَيَّنْتُنَّ", "تَبَيَّنْتُ", "تَبَيَّنَّا", "تَبَيَّنَّا"]
        },
        
        // --- 89 Numaralı Kalıp (يَتَفَعَّلُ - Tefe'ul Babı Muzari) ---
        89: { 
            base: { emoji: "👀", arText: "يَتَبَيَّنُ", trText: "Açıkça ortaya çıkar / Belli olur." },
            cekimi: ["يَتَبَيَّنُ", "يَتَبَيَّنَانِ", "يَتَبَيَّنُونَ", "تَتَبَيَّنُ", "تَتَبَيَّنَانِ", "يَتَبَيَّنْنَ", "تَتَبَيَّنُ", "تَتَبَيَّنَانِ", "تَتَبَيَّنُونَ", "تَتَبَيَّنِينَ", "تَتَبَيَّنَانِ", "تَتَبَيَّنْنَ", "أَتَبَيَّنُ", "نَتَبَيَّنُ", "نَتَبَيَّنُ"]
        }
    },

    // ==================================================================
    // 3. F-H-M (ف ه م) KÖKÜ - Anlamak / Kavramak
    // ==================================================================
    "فهم": {
        // --- 8 Numaralı Kalıp (Mücerret 4. Bab Mazi) ---
        8: { 
            base: { emoji: "🧠", arText: "فَهِمَ", trText: "Anladı / Kavradı." },
            cekimi: ["فَهِمَ", "فَهِمَا", "فَهِمُوا", "فَهِمَتْ", "فَهِمَتَا", "فَهِمْنَ", "فَهِمْتَ", "فَهِمْتُمَا", "فَهِمْتُمْ", "فَهِمْتِ", "فَهِمْتُمَا", "فَهِمْتُنَّ", "فَهِمْتُ", "فَهِمْنَا", "فَهِمْنَا"]
        },

        // --- 9 Numaralı Kalıp (Mücerret 4. Bab Muzari) ---
        9: { 
            base: { emoji: "💡", arText: "يَفْهَمُ", trText: "Anlar / Anlıyor." },
            cekimi: ["يَفْهَمُ", "يَفْهَمَانِ", "يَفْهَمُونَ", "تَفْهَمُ", "تَفْهَمَانِ", "يَفْهَمْنَ", "تَفْهَمُ", "تَفْهَمَانِ", "تَفْهَمُونَ", "تَفْهَمِينَ", "تَفْهَمَانِ", "تَفْهَمْنَ", "أَفْهَمُ", "نَفْهَمُ", "نَفْهَمُ"]
        },

        // --- 10 Numaralı Kalıp (Mücerret 4. Bab Emir) ---
        10: { 
            base: { emoji: "❗", arText: "اِفْهَمْ", trText: "Anla / Kavra!" },
            cekimi: ["اِفْهَمْ", "اِفْهَمَا", "اِفْهَمُوا", "اِفْهَمِي", "اِفْهَمَا", "اِفْهَمْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { emoji: "💭", arText: "فَهْم", trText: "Fehim / Anlayış." } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { emoji: "🤓", arText: "فَاهِم", trText: "Anlayan." } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "✅", 
                arText: "مَفْهُوم", 
                trText: "Mefhum / Anlaşılan şey, kavram.",
                ornek: { ar: "مَفْهُومٌ خَاطِئٌ", tr: "Hatalı (yanlış anlaşılan) mefhum/kavram." }
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "📚", 
                arText: "مَفَاهِيم", 
                trText: "Kavramlar (Mefhumlar). (Not: Düzenli dişil çoğul eki +ات yerine bazen Mefâîl kırık çoğul kalıbı olan مَفَاهِيم kullanılır)." 
            }
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Tef'îl Babı Mazi) ---
        58: { 
            base: { emoji: "👨‍🏫", arText: "فَهَّمَ", trText: "Anlattı / Kavrattı." },
            cekimi: ["فَهَّمَ", "فَهَّمَا", "فَهَّمُوا", "فَهَّمَتْ", "فَهَّمَتَا", "فَهَّمْنَ", "فَهَّمْتَ", "فَهَّمْتُمَا", "فَهَّمْتُمْ", "فَهَّمْتِ", "فَهَّمْتُمَا", "فَهَّمْتُنَّ", "فَهَّمْتُ", "فَهَّمْنَا", "فَهَّمْنَا"]
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { emoji: "🗣️", arText: "تَفْهِيم", trText: "Tefhim / Anlatma, bildirme." } 
        },

        // --- 100 Numaralı Kalıp (اِسْتَفْعَلَ - İstif'âl Babı Mazi) ---
        100: { 
            base: { emoji: "❓", arText: "اِسْتَفْهَمَ", trText: "Sordu / Anlamak istedi." },
            cekimi: ["اِسْتَفْهَمَ", "اِسْتَفْهَمَا", "اِسْتَفْهَمُوا", "اِسْتَفْهَمَتْ", "اِسْتَفْهَمَتَا", "اِسْتَفْهَمْنَ", "اِسْتَفْهَمْتَ", "اِسْتَفْهَمْتُمَا", "اِسْتَفْهَمْتُمْ", "اِسْتَفْهَمْتِ", "اِسْتَفْهَمْتُمَا", "اِسْتَفْهَمْتُنَّ", "اِسْتَفْهَمْتُ", "اِسْتَفْهَمْنَا", "اِسْتَفْهَمْنَا"]
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - İstif'âl Babı Masdarı) ---
        103: { 
            base: { 
                emoji: "❓", 
                arText: "اِسْتِفْهَام", 
                trText: "İstifham / Soru sorma, anlamaya çalışma.",
                ornek: [
                    { 
                        ar: "أَدَاةُ الِاسْتِفْهَامِ", 
                        tr: "Soru edatı." 
                    },
                    { 
                        ar: "💡 مَعْلُومَة نَحْوِيَّة", 
                        tr: "Gramer Notu: Arapçada 'Soru sorma' eylemine 'İstifham' denir. Çünkü İstif'âl babı 'istek' bildirir. İstifham, karşındakinden bir konuyu sana 'fehm ettirmesini' (anlatmasını) talep etmektir." 
                    }
                ]
            } 
        }
    },

     // ==================================================================
    // 4. S-M-' (س م ع) KÖKÜ - İşitmek / Dinlemek
    // 4. Bab (فَعِلَ - يَفْعَلُ) ve İfti'âl Babı
    // ==================================================================
    "سمع": {
        // --- 8 Numaralı Kalıp (Mücerret 4. Bab Mazi) ---
        // --- 8 Numaralı Kalıp (Mücerret 4. Bab Mazi) ---
        8: { 
            base: { 
                emoji: "👂", 
                arText: "سَمِعَ", 
                trText: "İşitti / Duydu.",
                ornek: [
                    { 
                        ar: "سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ", 
                        tr: "İşittik ve itaat ettik! Rabbimiz, bağışlamanı dileriz, dönüş ancak sanadır. (Bakara Suresi, 285)" 
                    },
                    {
                        ar: "سَمِعَ اللهُ لِمَنْ حَمِدَهُ",
                        tr: "Allah, kendisine hamd edeni işitir (ve duasını kabul eder). (Namazda rükûdan kalkarken söylenen zikir)"
                    }
                ]
            },
        },
        // --- 9 Numaralı Kalıp (Mücerret 4. Bab Muzari) ---
        9: { 
            base: { 
                emoji: "🎵", 
                arText: "يَسْمَعُ", 
                trText: "İşitir / Duyuyor.",
                
            },
        },

        // --- 10 Numaralı Kalıp (Mücerret 4. Bab Emir) ---
        10: { 
            base: { 
                emoji: "❗", 
                arText: "اِسْمَعْ", 
                trText: "İşit / Duy!",
                ornek: { ar: "اِسْمَعْ يَا بُنَيَّ", tr: "İşit (dinle) ey oğulcuğum!" }
            },
            cekimi: ["اِسْمَعْ", "اِسْمَعَا", "اِسْمَعُوا", "اِسْمَعِي", "اِسْمَعَا", "اِسْمَعْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Masdar) ---
        19: { 
            base: { 
                emoji: "👂", 
                arText: "سَمْع", 
                trText: "İşitme / Duyma yetisi.",
                ornek: [
                    {
                        ar: "خَتَمَ اللهُ عَلَى قُلُوبِهِمْ وَعَلَى سَمْعِهِمْ",
                        tr: "Allah onların kalplerini ve kulaklarını (işitme yetilerini) mühürlemiştir. (Bakara Suresi, 7)"
                    },
                    {
                        ar: "💡 مَعْلُومَة عَقَائِدِيَّة",
                        tr: "Akaid Notu: 'Sem' (سَمْع) aynı zamanda Allah'ın Sübûtî sıfatlarından biridir. Yüce Allah'ın gizli, açık, fısıltı veya içten geçen her sesi, hiçbir vasıtaya ihtiyaç duymadan eksiksiz bir şekilde işitmesi demektir."
                    }
                ]
            } 
        },

        // --- 21 Numaralı Kalıp (فُعْل - İsim) ---
        21: { 
            base: { 
                emoji: "🗣️"
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🌟", 
                arText: "سُمْعَة", 
                trText: "Süm'a / Şöhret, itibar, kulaktan kulağa yayılan nam.",
                ornek: [
                    { 
                        ar: "شَرِكَةٌ ذَاتُ سُمْعَةٍ طَيِّبَةٍ", 
                        tr: "İyi itibara (süm'aya) sahip bir şirket." 
                    }
                    
                ]
            }
        },

        // --- 34 Numaralı Kalıp (فَعَّال ve + ة ile İsm-i Alet) ---
        34: { 
            base: { arText: "سَمَّاع" },
            suggestsPlus: true,
            "ة": { 
                emoji: "🎧", 
                arText: "سَمَّاعَة", 
                trText: "Kulaklık / Stetoskop / Ahize.",
                ornek: { ar: "سَمَّاعَةُ الطَّبِيبِ", tr: "Doktorun stetoskobu." }
            }
        },

        // --- 35 Numaralı Kalıp (فَعِيل - Sıfat-ı Müşebbehe) ---
        35: { 
            base: { 
                emoji: "✨", 
                arText: "سَمِيع", 
                trText: "Semî' / Hakkıyla ve her şeyi işiten.",
                ornek: { ar: "وَاللهُ سَمِيعٌ عَلِيمٌ", tr: "Allah hakkıyla işitendir (Semî'dir), hakkıyla bilendir. (Bakara Suresi, 224)" }
            } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi) ---
        77: { 
            base: { 
                emoji: "🤫", 
                arText: "اِسْتَمَعَ", 
                trText: "Kulak verdi / Dinledi.",
                ornek: [
                    { 
                        ar: "اِسْتَمَعَ إِلَى النَّصِيحَةِ", 
                        tr: "Nasihati dinledi (kulak verdi)." 
                    },
                    {
                        ar: "💡 مَعْلُومَة نَحْوِيَّة",
                        tr: "Gramer Notu: 'Dinlemek, bir şeye kulak vermek' anlamındaki bu fiil, nesnesini (dinlenilen şeyi veya kişiyi) genellikle 'إِلَى' (ilâ) harf-i cerri ile alır."
                    }
                ]
            },
        },

        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - İfti'âl Babı Muzari) ---
        78: { 
            base: { emoji: "📻", arText: "يَسْتَمِعُ", trText: "Kulak verir / Dinliyor." },
        },

        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - İfti'âl Babı Emir) ---
        79: { 
            base: { 
                emoji: "❗", 
                arText: "اِسْتَمِعْ", 
                trText: "Kulak ver / Dinle!",
                ornek: [
                    {
                        ar: "وَإِذَا قُرِئَ الْقُرْآنُ فَاسْتَمِعُوا لَهُ وَأَنْصِتُوا لَعَلَّكُمْ تُرْحَمُونَ",
                        tr: "Kur'an okunduğu zaman ona kulak verin (istima edin) ve susun ki size merhamet edilsin. (A'râf Suresi, 204)"
                    },
                    {
                        ar: "💡 مَعْلُومَة لُغَوِيَّة",
                        tr: "Fark Notu: 'Semi'a' (سَمِعَ) istemsizce duymak iken; İfti'âl babındaki 'İstema'a' (اِسْتَمَعَ) iradeyle, odaklanarak ve can kulağıyla dinlemek demektir."
                    }
                ]
            },
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Masdarı) ---
        80: { 
            base: { 
                emoji: "🎧", 
                arText: "اِسْتِمَاع", 
                trText: "İstima / Dinleme, kulak verme.",
                ornek: { ar: "مَهَارَةُ الِاسْتِمَاعِ", tr: "Dinleme (istima) becerisi." }
            } 
        }
    },

    // ==================================================================
    // 6. F-R-D (ف ر د) KÖKÜ - Tek Olmak / Yalnız Olmak / Benzersizlik
    // (Türkçedeki Fert, Efrad, Ferit, Müfred, Müfredat kelimelerinin atası)
    // ==================================================================
    "فرد": {
        // --- 19 Numaralı Kalıp (فَعْل - İsim / Masdar) ---
        19: { 
            base: { 
                emoji: "👤", 
                arText: "فَرْد", 
                trText: "Fert / Birey, tek, yalnız.",
                ornek: [
                    { 
                        ar: "وَكُلُّهُمْ آتِيهِ يَوْمَ الْقِيَامَةِ فَرْدًا", 
                        tr: "Hepsi kıyamet günü O'na tek başına (fert olarak) gelecektir. (Meryem Suresi, 95)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة تَفْسِيرِيَّة",
                        tr: "Tefsir Notu: Ayetteki 'Ferden' (Tek başına) ifadesi, insanın ahiret gününde dünyadaki makamından, aşiretinden, malından ve dostlarından tamamen soyutlanmış olarak, sadece kendi amelleriyle Allah'ın huzuruna çıkacağını çok sarsıcı bir şekilde tasvir eder."
                    }
                ]
            },
            suggestsPlus: true,
            "يّ": { 
                emoji: "🧍", 
                arText: "فَرْدِيّ", 
                trText: "Bireysel / Ferdi (Ferde ait olan)",
                ornek: { 
                    ar: "💡 مَعْلُومَة ثَقَافِيَّة", 
                    tr: "İsim Notu: Türkçede erkek ismi olarak kullandığımız 'Ferdi', kelime kökeni itibarıyla 'Tek, eşsiz, bireysel' anlamlarını taşır." 
                }
            },
            "يَّة": { 
                emoji: "🛡️", 
                arText: "فَرْدِيَّة", 
                trText: "Bireysellik / Ferdiyet ",
                ornek: { 
                    ar: "حُرِّيَّةٌ فَرْدِيَّةٌ", 
                    tr: "Bireysel (ferdi) özgürlük." 
                }
            }
        },

        // --- 41 Numaralı Kalıp (أَفْعَال - Çoğul Kalıbı) ---
        41: { 
            base: { 
                emoji: "👥", 
                arText: "أَفْرَاد", 
                trText: "Efrad / Bireyler, fertler.",
                ornek: { ar: "أَفْرَادُ الْمُجْتَمَعِ", tr: "Toplumun bireyleri (efradı)." }
            } 
        },

        // --- 35 Numaralı Kalıp (فَعِيل - Sıfat-ı Müşebbehe) ---
        35: { 
            base: { 
                emoji: "💎", 
                arText: "فَرِيد", 
                trText: "Ferit / Eşsiz, tek, kendi türünde benzersiz.",
                ornek: { ar: "فَرِيدٌ مِنْ نَوْعِهِ", tr: "Kendi türünde eşsiz (benzersiz / nevi şahsına münhasır)." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🌸", 
                arText: "فَرِيدَة", 
                trText: "Feride / Eşsiz, benzersiz (Kadın ismi).",
                ornek: { ar: "لُؤْلُؤَةٌ فَرِيدَةٌ", tr: "Eşsiz (benzersiz) bir inci." }
            }
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi) ---
        52: { 
            base: { emoji: "✂️", arText: "أَفْرَدَ", trText: "Tek bıraktı / Ayırdı / Tekil (Müfred) yaptı." },
            cekimi: ["أَفْرَدَ", "أَفْرَدَا", "أَفْرَدُوا", "أَفْرَدَتْ", "أَفْرَدَتَا", "أَفْرَدْنَ", "أَفْرَدْتَ", "أَفْرَدْتُمَا", "أَفْرَدْتُمْ", "أَفْرَدْتِ", "أَفْرَدْتُمَا", "أَفْرَدْتُنَّ", "أَفْرَدْتُ", "أَفْرَدْنَا", "أَفْرَدْنَا"]
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: { 
            base: { emoji: "➖", arText: "يُفْرِدُ", trText: "Tek bırakır / Ayırır / Tekil yapar." },
            cekimi: ["يُفْرِدُ", "يُفْرِدَانِ", "يُفْرِدُونَ", "تُفْرِدُ", "تُفْرِدَانِ", "يُفْرِدْنَ", "تُفْرِدُ", "تُفْرِدَانِ", "تُفْرِدُونَ", "تُفْرِدِينَ", "تُفْرِدَانِ", "تُفْرِدْنَ", "أُفْرِدُ", "نُفْرِدُ", "نُفْرِدُ"]
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "📏", 
                arText: "إِفْرَاد", 
                trText: "İfrad / Tekilleştirme, ayırma.",
                ornek: { ar: "اَلْإِفْرَادُ وَالتَّثْنِيَةُ وَالْجَمْعُ", tr: "Tekil (İfrad), İkil (Tesniye) ve Çoğul (Cem') yapma." }
            } 
        },

        // --- 57 Numaralı Kalıp (مُفْعَل - İf'âl Babı İsm-i Mef'ûlü) ---
        57: { 
            base: { 
                emoji: "🧍", 
                arText: "مُفْرَد", 
                trText: "Müfred / Tekil, tek başına bırakılmış.",
                ornek: { ar: "كَلِمَةٌ مُفْرَدَةٌ", tr: "Tekil kelime." }
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "📚", 
                arText: "مُفْرَدَات", 
                trText: "Müfredat / Sözlük, kelime dağarcığı, ders programı (Tekil öğeler bütünü).",
                ornek: [
                    { 
                        ar: "مُفْرَدَاتُ اللُّغَةِ الْعَرَبِيَّةِ", 
                        tr: "Arapça kelime dağarcığı." 
                    },
                    {
                        ar: "💡 مَعْلُومَة نَحْوِيَّة",
                        tr: "Gramer Notu: Türkçede 'Ders Programı' anlamında kullandığımız 'Müfredat' kelimesi, aslen 'Tekiller / Müfredler' demektir. Bir konunun içindeki tek tek başlıkların, ünitelerin ve kelimelerin bir araya gelmesiyle oluştuğu için bu ismi almıştır."
                    }
                ]
            }
        },

        // --- 88 Numaralı Kalıp (تَفَعَّلَ - Tefe'ul Babı Mazi) ---
        88: { 
            base: { 
                emoji: "✨", 
                arText: "تَفَرَّدَ", 
                trText: "Eşsiz oldu / Benzersiz oldu / Tek kaldı.",
                ornek: { ar: "تَفَرَّدَ بِرَأْيِهِ", tr: "Kararında (görüşünde) tek kaldı / Kendi başına hareket etti." }
            },
        },

        // --- 89 Numaralı Kalıp (يَتَفَعَّلُ - Tefe'ul Babı Muzari) ---
        89: { 
            base: { 
                emoji: "🌟", 
                arText: "يَتَفَرَّدُ", 
                trText: "Eşsiz olur / Benzersizdir.",
                ornek: { ar: "اللهُ يَتَفَرَّدُ بِالْكَمَالِ", tr: "Allah kusursuzlukta eşsizdir (teferrüd eder)." }
            },
        },

        // --- 90 Numaralı Kalıp (تَفَعَّلْ - Tefe'ul Babı Emir) ---
        90: { 
            base: { emoji: "❗", arText: "تَفَرَّدْ", trText: "Eşsiz ol / Öne çık!" },
        },

        // --- 91 Numaralı Kalıp (تَفَعُّل - Tefe'ul Babı Masdarı) ---
        91: { 
            base: { 
                emoji: "🌌", 
                arText: "تَفَرُّد", 
                trText: "Teferrüd / Eşsizlik, benzersizlik, tek olma.",
                ornek: [
                    { 
                        ar: "التَّفَرُّدُ بِالْبَقَاءِ لِلهِ وَحْدَهُ", 
                        tr: "Beka (kalıcılık) ile eşsiz olmak (teferrüd), sadece Allah'a mahsustur." 
                    },
                    { 
                        ar: "🎶 مِنْ رَوَائِعِ الْأَنَاشِيدِ (Meşhur Bir İlahi):<br><br>يَا مَنْ تَفَرَّدَ بِالْبَقَاءِ وَالْقِدَمِ<br>وَتَوَحَّدَ بِالْكِبْرِيَاءِ وَالْعِظَمِ", 
                        tr: "🎵 İlahi Tercümesi:<br><br>Ey Beka (Sonsuzluk) ve Kıdem (Başlangıcı olmamak) ile eşsiz olan (Teferrüd eden)!<br>Ve Kibriya (Yücelik) ve Azamet ile Tek olan (Tevahhud eden) Allah!" 
                    }
                ]
            } 
        }
    },

     // ==================================================================
    // 6. N-S-Y (ن س ي) KÖKÜ - Unutmak
    // Nakıs Fiil (Son harfi illetli). 4. Bab (فَعِلَ - يَفْعَلُ) ağırlıklıdır.
    // ==================================================================
    "نسي": {
       // --- 8 Numaralı Kalıp (Mücerret 4. Bab Mazi) ---
        8: { 
            base: { 
                emoji: "🤔", 
                arText: "نَسِيَ", 
                trText: "Unuttu.",
                ornek: [
                    { 
                        ar: "رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا", 
                        tr: "Rabbimiz! Unutursak (nesînâ) veya hataya düşersek bizi sorumlu tutma! (Bakara Suresi, 286)" 
                    },
                    { 
                        ar: "نَسُوا اللهَ فَنَسِيَهُمْ", 
                        tr: "Onlar Allah'ı unuttular, Allah da onları unuttu (kendi hallerine bıraktı). (Tevbe Suresi, 67)" 
                    }
                ]
            },
            cekimi: ["نَسِيَ", "نَسِيَا", "نَسُوا", "نَسِيَتْ", "نَسِيَتَا", "نَسِينَ", "نَسِيتَ", "نَسِيتُمَا", "نَسِيتُمْ", "نَسِيتِ", "نَسِيتُمَا", "نَسِيتُنَّ", "نَسِيتُ", "نَسِينَا", "نَسِينَا"]
        },
        // --- 9 Numaralı Kalıp (Mücerret 4. Bab Muzari) ---
        9: { 
            base: { 
                emoji: "🤷‍♂️", 
                arText: "يَنْسَى", 
                trText: "Unutur / Unutuyor.",
                ornek: { 
                    ar: "وَمَا كَانَ رَبُّكَ نَسِيًّا", 
                    tr: "Senin Rabbin unutkan değildir (asla unutmaz). (Meryem Suresi, 64)" 
                }
            },
            cekimi: ["يَنْسَى", "يَنْسَيَانِ", "يَنْسَوْنَ", "تَنْسَى", "تَنْسَيَانِ", "يَنْسَيْنَ", "تَنْسَى", "تَنْسَيَانِ", "تَنْسَوْنَ", "تَنْسَيْنَ", "تَنْسَيَانِ", "تَنْسَيْنَ", "أَنْسَى", "نَنْسَى", "نَنْسَى"]
        },

        // --- 10 Numaralı Kalıp (Mücerret 4. Bab Emir) ---
        10: { 
            base: { 
                emoji: "❗", 
                arText: "اِنْسَ", 
                trText: "Unut!",
                ornek: [
                    {
                        ar: "اِنْسَ الْمَاضِيَ وَانْظُرْ إِلَى الْمُسْتَقْبَلِ",
                        tr: "Geçmişi unut ve geleceğe bak!"
                    },
                    {
                        ar: "💡 قَاعِدَة صَرْفِيَّة",
                        tr: "Sarf Kuralı: Nakıs (sonu illetli) fiillerin emir kipi yapılırken, kural gereği sondaki illet harfi (Elif Maksura/Ye) düşer. Bu yüzden 'اِنْسَى' değil 'اِنْسَ' şeklinde fetha (üstün) ile biter."
                    }
                ]
            },
            cekimi: ["اِنْسَ", "اِنْسَيَا", "اِنْسَوْا", "اِنْسَيْ", "اِنْسَيَا", "اِنْسَيْنَ"]
        },

        // --- 29 Numaralı Kalıp (فِعْلَان - Masdar) ---
        29: { 
            base: { 
                emoji: "🌫️", 
                arText: "نِسْيَان", 
                trText: "Nisyan / Unutkanlık, unutma eylemi.",
                ornek: [
                    {
                        ar: "حَافِظَةُ الْبَشَرِ مَعْلُولَةٌ بِالنِّسْيَانِ",
                        tr: "Hafıza-i beşer, nisyan ile maluldür. (İnsan hafızası, unutkanlık hastalığıyla kusurludur/sakatlanmıştır - Meşhur Özdeyiş)"
                    },
                    { 
                        ar: "💡 مَعْلُومَة ثَقَافِيَّة وَلُغَوِيَّة: هَلْ كَلِمَةُ (إِنْسَان) مِنْ جَذْرِ النِّسْيَانِ؟", 
                        tr: "Kültürel ve Etimolojik Not: 'İnsan' kelimesinin kökeni hakkında iki muazzam görüş vardır:<br>1. <b>Tasavvufi/Felsefi Görüş:</b> 'Nisyan' (Unutmak) kökünden gelir. Hz. Adem'in verdiği sözü unutmasına ve fıtratımızdaki unutkanlığa dayanır. <i>'İnsana insan denilmesinin tek sebebi, Rabbine verdiği sözü unutmasıdır.'</i><br>2. <b>Dilbilimsel (Gramer) Görüş:</b> 'Ünsiyet' (أ ن س - Alışmak, kaynaşmak) kökünden gelir. Çünkü insan yalnız yaşayamaz, topluma alışan ve sosyalleşen bir varlıktır.<br><b>Özetle:</b> İnsan; hem birbirine muhtaç olup alışan (Üns) hem de çabucak unutan (Nisyan) muazzam bir varlıktır." 
                    }
                ]
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "👤", 
                arText: "نَاسٍ", 
                trText: "Nâsin / Unutan kişi.",
                ornek: { 
                    ar: "أَنَا نَاسٍ لِهَذَا الْمَوْضُوعِ", 
                    tr: "Ben bu konuyu unutan (unutmuş) biriyim." 
                }
            },
            cekimi: [
                { ar: "نَاسٍ", tr: "Belirsiz (Nekra) Kullanım - İllet harfi olan Ye düşer." },
                { ar: "اَلنَّاسِي", tr: "Belirli (Marife) Kullanım - Elif Lam takısı gelince Ye geri döner." }
            ]
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "🍂", 
                arText: "مَنْسِيّ", 
                trText: "Mensiyy / Unutulmuş olan.",
                ornek: [
                    { 
                        ar: "يَا لَيْتَنِي مِتُّ قَبْلَ هَٰذَا وَكُنْتُ نَسْيًا مَنْسِيًّا", 
                        tr: "Keşke bundan önce ölseydim de unutulup gitmiş (mensiyy) biri olsaydım! (Meryem Suresi, 23)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة نَحْوِيَّة",
                        tr: "Gramer Notu: Nakıs fiillerin İsm-i Mef'ulü (مَفْعُول kalıbı) yapılırken aslı olan 'مَنْسُوي' (Mensûy), dil uyumu sebebiyle 'Vav' harfi 'Ye'ye dönüşür ve şeddelenerek 'مَنْسِيّ' (Mensiyy) halini alır."
                    }
                ]
            } 
        },

       // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi - Geçişli Yapma) ---
        52: { 
            base: { 
                emoji: "🪄", 
                arText: "أَنْسَى", 
                trText: "Unutturdu.",
                ornek: [
                    { 
                        ar: "وَمَا أَنْسَانِيهُ إِلَّا الشَّيْطَانُ أَنْ أَذْكُرَهُ", 
                        tr: "Onu hatırlamamı bana şeytandan başkası unutturmadı. (Kehf Suresi, 63)" 
                    },
                    {
                        ar: "اسْتَحْوَذَ عَلَيْهِمُ الشَّيْطَانُ فَأَنْسَاهُمْ ذِكْرَ اللهِ",
                        tr: "Şeytan onları kuşatmış ve onlara Allah'ı anmayı unutturmuştur. (Mücâdele Suresi, 19)"
                    }
                ]
            },
            cekimi: ["أَنْسَى", "أَنْسَيَا", "أَنْسَوْا", "أَنْسَتْ", "أَنْسَتَا", "أَنْسَيْنَ", "أَنْسَيْتَ", "أَنْسَيْتُمَا", "أَنْسَيْتُمْ", "أَنْسَيْتِ", "أَنْسَيْتُمَا", "أَنْسَيْتُنَّ", "أَنْسَيْتُ", "أَنْسَيْنَا", "أَنْسَيْنَا"]
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: { 
            base: { 
                emoji: "🧠", 
                arText: "يُنْسِي", 
                trText: "Unutturur.",
                ornek: { 
                    ar: "وَإِمَّا يُنْسِيَنَّكَ الشَّيْطَانُ فَلَا تَقْعُدْ بَعْدَ الذِّكْرَىٰ مَعَ الْقَوْمِ الظَّالِمِينَ", 
                    tr: "Eğer şeytan sana unutturursa, hatırladıktan sonra o zalimler topluluğu ile oturma. (En'âm Suresi, 68)" 
                }
            },
            cekimi: ["يُنْسِي", "يُنْسِيَانِ", "يُنْسُونَ", "تُنْسِي", "تُنْسِيَانِ", "يُنْسِينَ", "تُنْسِي", "تُنْسِيَانِ", "تُنْسُونَ", "تُنْسِينَ", "تُنْسِيَانِ", "تُنْسِينَ", "أُنْسِي", "نُنْسِي", "نُنْسِي"]
        },

        // --- 94 Numaralı Kalıp (تَفَاعَلَ - Tefâ'ul Babı Mazi - Unutmuş Gibi Yapmak) ---
        94: { 
            base: { 
                emoji: "🙈", 
                arText: "تَنَاسَى", 
                trText: "Unutmuş gibi yaptı / Görmezden geldi.",
                ornek: { 
                    ar: "تَنَاسَى الْأَمْرَ لِتَجَنُّبِ الْمُشْكِلَةِ", 
                    tr: "Sorundan kaçınmak için konuyu unutmuş gibi yaptı (hasıraltı etti)." 
                }
            },
            cekimi: ["تَنَاسَى", "تَنَاسَيَا", "تَنَاسَوْا", "تَنَاسَتْ", "تَنَاسَتَا", "تَنَاسَيْنَ", "تَنَاسَيْتَ", "تَنَاسَيْتُمَا", "تَنَاسَيْتُمْ", "تَنَاسَيْتِ", "تَنَاسَيْتُمَا", "تَنَاسَيْتُنَّ", "تَنَاسَيْتُ", "تَنَاسَيْنَا", "تَنَاسَيْنَا"]
        }
    },

// ==================================================================
    // 7. Ş-'-R (ش ع ر) KÖKÜ - Hissetmek / Şuur / Şiir
    // İnsanın ince farkındalığını ve edebi zekasını temsil eder.
    // ==================================================================
    "شعر": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "✨", 
                arText: "شَعَرَ", 
                trText: "Hissetti / Farkına vardı.",
                ornek: { 
                    ar: "شَعَرَ بِالْبَرْدِ", 
                    tr: "Soğuğu hissetti." 
                }
            },
            cekimi: ["شَعَرَ", "شَعَرَا", "شَعَرُوا", "شَعَرَتْ", "شَعَرَتَا", "شَعَرْنَ", "شَعَرْتَ", "شَعَرْتُمَا", "شَعَرْتُمْ", "شَعَرْتِ", "شَعَرْتُمَا", "شَعَرْتُنَّ", "شَعَرْتُ", "شَعَرْنَا", "شَعَرْنَا"]
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "🧠", 
                arText: "يَشْعُرُ", 
                trText: "Hisseder / Fark eder.",
                ornek: [
                    { 
                        ar: "وَمَا يَشْعُرُونَ أَيَّانَ يُبْعَثُونَ", 
                        tr: "Ne zaman diriltileceklerinin farkında değillerdir (şuurunda değillerdir). (Nahl Suresi, 21)" 
                    },
                    {
                        ar: "يُخَادِعُونَ اللهَ وَالَّذِينَ آمَنُوا وَمَا يَخْدَعُونَ إِلَّا أَنْفُسَهُمْ وَمَا يَشْعُرُونَ",
                        tr: "Allah'ı ve inananları aldatmaya çalışırlar. Oysa sadece kendilerini aldatırlar da farkında (şuurunda) değillerdir. (Bakara Suresi, 9)"
                    }
                ]
            },
            cekimi: ["يَشْعُرُ", "يَشْعُرَانِ", "يَشْعُرُونَ", "تَشْعُرُ", "تَشْعُرَانِ", "يَشْعُرْنَ", "تَشْعُرُ", "تَشْعُرَانِ", "تَشْعُرُونَ", "تَشْعُرِينَ", "تَشْعُرَانِ", "تَشْعُرْنَ", "أَشْعُرُ", "نَشْعُرُ", "نَشْعُرُ"]
        },

        // --- 20 Numaralı Kalıp (فِعْل - İsim / Masdar) ---
        20: { 
            base: { 
                emoji: "📜", 
                arText: "شِعْر", 
                trText: "Şiir / İnce ve kafiyeli söz.",
                ornek: [
                    { 
                        ar: "وَمَا عَلَّمْنَاهُ الشِّعْرَ وَمَا يَنْبَغِي لَهُ", 
                        tr: "Biz ona (Peygamber'e) şiir öğretmedik, bu ona yaraşmaz da. (Yâsîn Suresi, 69)" 
                    },
                    { 
                        ar: "💡 مَعْلُومَة أَدَبِيَّة", 
                        tr: "Edebiyat Notu: Arapçada 'Şiir' kelimesi 'hissetmek' kökünden gelir. Çünkü şair, sıradan insanların fark edemediği ince manaları 'hisseden' (şuurunda olan) ve bunu incelikle söze döken kişidir." 
                    }
                ]
            } 
        },

        // --- 23 Numaralı Kalıp (فِعَال - Masdar / İsim) ---
        23: { 
            base: { 
                emoji: "🚩", 
                arText: "شِعَار", 
                trText: "Şiar / Prensip, sembol, motto, parola.",
                ornek: { 
                    ar: "الْأَذَانُ شِعَارُ الْإِسْلَامِ", 
                    tr: "Ezan, İslam'ın şiarıdır (sembolüdür)." 
                }
            } 
        },

        // --- 25 Numaralı Kalıp (فُعُول - Masdar) ---
        25: { 
            base: { 
                emoji: "🌌", 
                arText: "شُعُور", 
                trText: "Şuur / His, bilinç, farkındalık.",
                ornek: { 
                    ar: "فَقْدَانُ الشُّعُورِ", 
                    tr: "Şuur (bilinç) kaybı." 
                }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "✍️", 
                arText: "شَاعِر", 
                trText: "Şair / Hisseden ve bunu sanata dönüştüren kişi.",
                ornek: { 
                    ar: "قَالَ شَاعِرٌ عَرَبِيٌّ حَكِيمٌ", 
                    tr: "Bilge bir Arap şairi dedi ki..." 
                }
            }
        },

        // --- 35 Numaralı Kalıp (فَعِيل / +ة ile İsim) ---
        35: { 
            base: { arText: "شَعِير" },
            suggestsPlus: true,
            "ة": { 
                emoji: "🕋", 
                arText: "شَعِيرَة", 
                trText: "Şe'îre (Şeâir'in tekili) / İslami sembol, nişan, ibadet alameti.",
                ornek: { 
                    ar: "شَعِيرَةٌ دِينِيَّةٌ", 
                    tr: "Dini bir sembol / ritüel." 
                }
            }
        },

        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekân) ---
        38: { 
            base: { 
                emoji: "📍", 
                arText: "مَشْعَر", 
                trText: "Meş'ar / Hissedilen yer, ibadet ve şuur mekânı.",
                ornek: [
                    { 
                        ar: "فَاذْكُرُوا اللهَ عِنْدَ الْمَشْعَرِ الْحَرَامِ", 
                        tr: "Meş'ar-i Haram'ın (Müzdelife'nin) yanında Allah'ı zikredin. (Bakara Suresi, 198)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة ثَقَافِيَّة",
                        tr: "Kültürel Not: Hac ibadetinde vakfeye durulan 'Müzdelife' bölgesine Kur'an'da 'Meş'ar-i Haram' denir. Orası maneviyatın zirveye ulaştığı, Allah'ın huzurunda olmanın en derinden 'hissedildiği' şuur mekânıdır."
                    }
                ]
            } 
        },

        // --- 46 Numaralı Kalıp (فُعَلَاء - Kırık Çoğul) ---
        46: {
            base: {
                emoji: "🎭", 
                arText: "شُعَرَاء", 
                trText: "Şuarâ / Şairler (Kur'an'da 26. surenin adıdır).",
                ornek: { 
                    ar: "وَالشُّعَرَاءُ يَتَّبِعُهُمُ الْغَاوُونَ", 
                    tr: "Şairlere gelince, onlara sapkınlar uyar. (Şuarâ Suresi, 224)" 
                }
            }
        },

        // --- 48 Numaralı Kalıp (فَعَائِل - Kırık Çoğul) ---
        48: {
            base: {
                emoji: "🕋",
                arText: "شَعَائِر",
                trText: "Şeâir / İslami semboller, dini nişaneler, ibadet alametleri (Şe'îre kelimesinin çoğulu).",
                ornek: {
                    ar: "ذَٰلِكَ وَمَنْ يُعَظِّمْ شَعَائِرَ اللهِ فَإِنَّهَا مِنْ تَقْوَى الْقُلُوبِ",
                    tr: "İşte böyle! Kim Allah'ın şeâirine (nişanlarına/sembollerine) saygı gösterirse, şüphesiz bu, kalplerin takvasındandır. (Hac Suresi, 32)"
                }
            }
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi) ---
        52: { 
            base: { 
                emoji: "🔔", 
                arText: "أَشْعَرَ", 
                trText: "Hissettirdi / Bildirdi / Şuurlandırdı." 
            },
            cekimi: ["أَشْعَرَ", "أَشْعَرَا", "أَشْعَرُوا", "أَشْعَرَتْ", "أَشْعَرَتَا", "أَشْعَرْنَ", "أَشْعَرْتَ", "أَشْعَرْتُمَا", "أَشْعَرْتُمْ", "أَشْعَرْتِ", "أَشْعَرْتُمَا", "أَشْعَرْتُنَّ", "أَشْعَرْتُ", "أَشْعَرْنَا", "أَشْعَرْنَا"]
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: { 
            base: { 
                emoji: "💡", 
                arText: "يُشْعِرُ", 
                trText: "Hissettirir / Bildirir.",
                ornek: { 
                    ar: "وَمَا يُشْعِرُكُمْ أَنَّهَا إِذَا جَاءَتْ لَا يُؤْمِنُونَ", 
                    tr: "Ne bilirsiniz (size ne hissettirir/bildirir) ki, o mucize geldiğinde de inanmayacaklar! (En'âm Suresi, 109)" 
                }
            },
            cekimi: ["يُشْعِرُ", "يُشْعِرَانِ", "يُشْعُرُونَ", "تُشْعِرُ", "تُشْعِرَانِ", "يُشْعُرْنَ", "تُشْعِرُ", "تُشْعِرَانِ", "تُشْعُرُونَ", "تُشْعُرِينَ", "تُشْعِرَانِ", "تُشْعُرْنَ", "أُشْعِرُ", "نُشْعِرُ", "نُشْعِرُ"]
        }
    },

    // ==================================================================
    // 8. G-F-L (غ ف ل) KÖKÜ - Habersiz Olmak / İhmal Etmek / Gaflet
    // Zihinsel süreçlerin "farkındalık eksikliği" ve "görmezden gelme" boyutunu temsil eder.
    // ==================================================================
    "غفل": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🙈", 
                arText: "غَفَلَ", 
                trText: "Habersiz oldu / İhmal etti / Gafil avlandı.",
                ornek: [
                    { 
                        ar: "غَفَلَ عَنْ وَاجِبَاتِهِ", 
                        tr: "Görevlerinden habersiz oldu (sorumluluklarını ihmal etti)." 
                    },
                    {
                        ar: "💡 مَعْلُومَة نَحْوِيَّة",
                        tr: "Gramer Notu: 'Bir şeyden gafil olmak, habersiz kalmak' anlamındaki bu fiil ve tüm türevleri (Gafil, Gaflet vb.), nesnesini daima 'عَنْ' (an) harf-i cerri ile alır."
                    }
                ]
            },
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "🥱", 
                arText: "يَغْفُلُ", 
                trText: "Habersiz olur / Gafil olur / İhmal eder.",
                ornek: { 
                    ar: "الْإِنْسَانُ يَغْفُلُ عَنِ النِّعَمِ حَتَّى يَفْقِدَهَا", 
                    tr: "İnsan, kaybedene kadar nimetlerden gafil olur (kıymetini bilmez)." 
                }
            },
        },

        // --- 19 Numaralı Kalıp (فَعْلَة - Masdar / İsm-i Merra) ---
        19: { 
            base: { 
                emoji: "🌫️", 
                arText: "غَفْلَة", 
                trText: "Gaflet / Dalgınlık, aymazlık, farkındalık yoksunluğu.",
                ornek: [
                    { 
                        ar: "وَأَنْذِرْهُمْ يَوْمَ الْحَسْرَةِ إِذْ قُضِيَ الْأَمْرُ وَهُمْ فِي غَفْلَةٍ", 
                        tr: "İşin bitirileceği o hasret günüyle onları uyar! Çünkü onlar hâlâ gaflet içindedirler. (Meryem Suresi, 39)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة صَرْفِيَّة",
                        tr: "Sarf Notu: Arapçada sonu doğrudan yuvarlak te (ة) ile biten 'فَعْلَة' (Fa'let) vezni, özel olarak 'İsm-i Merra' (eylemin bir anlık veya bir defalık yapılışını bildiren masdar) kalıbıdır. 'Gaflet' de kelime yapısı gereği bir anlık dalgınlık, bir defalık habersizlik halini ifade eder."
                    }
                ]
            } 
        },
        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🚶", 
                arText: "غَافِل", 
                trText: "Gafil / Habersiz olan, umursamayan, gerçekleri görmeyen kişi.",
                ornek: { 
                    ar: "وَمَا اللهُ بِغَافِلٍ عَمَّا تَعْمَلُونَ", 
                    tr: "Allah, yapmakta olduklarınızdan gafil (habersiz) değildir. (Bakara Suresi, 74)" 
                }
            },
            suggestsPlus: true,
            "ونَ": { 
                emoji: "🚶‍♂️🚶‍♂️", 
                arText: "غَافِلُونَ", 
                trText: "Gafiller (Düzenli Eril Çoğul).",
                ornek: {
                    ar: "وَإِنَّ كَثِيرًا مِنَ النَّاسِ عَنْ آيَاتِنَا لَغَافِلُونَ",
                    tr: "Şüphesiz ki insanların çoğu ayetlerimizden habersizdirler (gafildirler). (Yûnus Suresi, 92)"
                }
            }
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "⚠️", 
                arText: "إِغْفَال", 
                trText: "İğfal / İhmal etme, göz ardı etme (Türkçede: Kandırmak, gafil avlamak).",
                ornek: [
                    { 
                        ar: "إِغْفَالُ الْحَقَائِقِ يُؤَدِّي إِلَى مَشَاكِلَ كَبِيرَةٍ", 
                        tr: "Gerçekleri ihmal etmek (göz ardı etmek) büyük sorunlara yol açar." 
                    },
                    {
                        ar: "💡 مَعْلُومَة لُغَوِيَّة وَثَقَافِيَّة",
                        tr: "Kelime Notu: Arapçada 'İğfal', bir şeyi kasıtlı olarak ihmal etmek veya unutturmak demektir. Türkçemizde kalıplaşan 'iğfal etmek' (kandırmak, yoldan çıkarmak) kullanımı ise, bir kişiyi 'gafil avlamak', onun gafletinden (dikkatsizliğinden ve habersizliğinden) yararlanarak tuzağa düşürmek mantığından türemiştir."
                    }
                ]
            } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi) ---
        52: { 
            base: { 
                emoji: "🕳️", 
                arText: "أَغْفَلَ", 
                trText: "İhmal etti / Göz ardı etti / Unutturdu.",
                ornek: { 
                    ar: "وَلَا تُطِعْ مَنْ أَغْفَلْنَا قَلْبَهُ عَنْ ذِكْرِنَا", 
                    tr: "Kalbini bizi anmaktan gafil kıldığımız kimseye itaat etme! (Kehf Suresi, 28)" 
                }
            },
            cekimi: ["أَغْفَلَ", "أَغْفَلَا", "أَغْفَلُوا", "أَغْفَلَتْ", "أَغْفَلَتَا", "أَغْفَلْنَ", "أَغْفَلْتَ", "أَغْفَلْتُمَا", "أَغْفَلْتُمْ", "أَغْفَلْتِ", "أَغْفَلْتُمَا", "أَغْفَلْتُنَّ", "أَغْفَلْتُ", "أَغْفَلْنَا", "أَغْفَلْنَا"]
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: { 
            base: { 
                emoji: "🎯", 
                arText: "يُغْفِلُ", 
                trText: "İhmal eder / Göz ardı eder.",
                ornek: { 
                    ar: "الْمُدِيرُ لَا يُغْفِلُ أَيَّ تَفْصِيلٍ", 
                    tr: "Müdür hiçbir detayı göz ardı etmez (ihmal etmez)." 
                }
            },
            cekimi: ["يُغْفِلُ", "يُغْفِلَانِ", "يُغْفِلُونَ", "تُغْفِلُ", "تُغْفِلَانِ", "يُغْفِلْنَ", "تُغْفِلُ", "تُغْفِلَانِ", "تُغْفِلُونَ", "تُغْفِلِينَ", "تُغْفِلَانِ", "تُغْفِلْنَ", "أُغْفِلُ", "نُغْفِلُ", "نُغْفِلُ"]
        },

        // --- 94 Numaralı Kalıp (تَفَاعَلَ - Tefâ'ul Babı Mazi - "-Miş gibi yapmak") ---
        94: { 
            base: { 
                emoji: "🤫", 
                arText: "تَغَافَلَ", 
                trText: "Görmezden geldi / Bilmezlikten geldi / Gafil göründü.",
                ornek: [
                    { 
                        ar: "تَغَافَلَ عَنْ أَخْطَاءِ أَصْدِقَائِهِ", 
                        tr: "Arkadaşlarının hatalarını görmezden geldi." 
                    },
                    {
                        ar: "💡 مَعْلُومَة أَخْلَاقِيَّة وَلُغَوِيَّة",
                        tr: "Kültürel Not: 'Tegâfül' (تَغَافُل), tasavvufta ve ahlak ilminde çok övülen bir erdemdir. Gaflet (bilmeyerek habersiz kalmak) büyük bir kusurken; Tegâfül (aslında her şeyin farkında olduğu halde karşısındakini mahcup etmemek için 'habersizmiş gibi' davranmak, ayıpları örtmek) yüce bir erdemdir."
                    }
                ]
            },
            cekimi: ["تَغَافَلَ", "تَغَافَلَا", "تَغَافَلُوا", "تَغَافَلَتْ", "تَغَافَلَتَا", "تَغَافَلْنَ", "تَغَافَلْتَ", "تَغَافَلْتُمَا", "تَغَافَلْتُمْ", "تَغَافَلْتِ", "تَغَافَلْتُمَا", "تَغَافَلْتُنَّ", "تَغَافَلْتُ", "تَغَافَلْنَا", "تَغَافَلْنَا"]
        },

        // --- 95 Numaralı Kalıp (يَتَفَاعَلُ - Tefâ'ul Babı Muzari) ---
        95: { 
            base: { 
                emoji: "😌", 
                arText: "يَتَغَافَلُ", 
                trText: "Görmezden gelir / Bilmezlikten gelir.",
                ornek: { 
                    ar: "الْحَكِيمُ يَتَغَافَلُ عَنْ زَلَّاتِ النَّاسِ", 
                    tr: "Bilge kişi, insanların sürçmelerini (hatalarını) görmezden gelir." 
                }
            },
            cekimi: ["يَتَغَافَلُ", "يَتَغَافَلَانِ", "يَتَغَافَلُونَ", "تَتَغَافَلُ", "تَتَغَافَلَانِ", "يَتَغَافَلْنَ", "تَتَغَافَلُ", "تَتَغَافَلَانِ", "تَتَغَافَلُونَ", "تَتَغَافَلِينَ", "تَتَغَافَلَانِ", "تَتَغَافَلْنَ", "أَتَغَافَلُ", "نَتَغَافَلُ", "نَتَغَافَلُ"]
        },

        // --- 97 Numaralı Kalıp (تَفَاعُل - Tefâ'ul Babı Masdarı) ---
        97: { 
            base: { 
                emoji: "🛡️", 
                arText: "تَغَافُل", 
                trText: "Tegâfül / Bilmezden gelme, ayıp örtme, bilinçli görmezden gelme.",
                ornek: { 
                    ar: "التَّغَافُلُ عَنْ زَلَّاتِ الْإِخْوَانِ مِنْ شِيَمِ الْكِرَامِ", 
                    tr: "Dostların hatalarını görmezden gelmek (tegâfül), kerem sahibi yüce insanların ahlakındandır. (Arap Atasözü)" 
                }
            } 
        }
    },

     // ==================================================================
    // X. N-T-Q (ن ط ق) KÖKÜ - Konuşmak / İfade Etmek / Mantık
    // Zihinsel süreçlerin dışa vurumunu ve doğru düşünmeyi temsil eder. (2. Bab)
    // ==================================================================
    "نطق": {
        // --- 1 Numaralı Kalıp (Mücerret 2. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🗣️", 
                arText: "نَطَقَ", 
                trText: "Konuştu / Telaffuz etti / Dile getirdi.",
                ornek: { 
                    ar: "نَطَقَ بِالْحَقِّ", 
                    tr: "Hakkı (doğruyu) konuştu." 
                }
            },
            cekimi: ["نَطَقَ", "نَطَقَا", "نَطَقُوا", "نَطَقَتْ", "نَطَقَتَا", "نَطَقْنَ", "نَطَقْتَ", "نَطَقْتُمَا", "نَطَقْتُمْ", "نَطَقْتِ", "نَطَقْتُمَا", "نَطَقْتُنَّ", "نَطَقْتُ", "نَطَقْنَا", "نَطَقْنَا"]
        },

        // --- 4 Numaralı Kalıp (Mücerret 2. Bab Muzari) ---
        4: { 
            base: { 
                emoji: "🎙️", 
                arText: "يَنْطِقُ", 
                trText: "Konuşur / Söyler.",
                ornek: { 
                    ar: "وَمَا يَنْطِقُ عَنِ الْهَوَىٰ", 
                    tr: "O (Peygamber), kendi heva ve hevesinden konuşmaz. (Necm Suresi, 3)" 
                }
            },
            cekimi: ["يَنْطِقُ", "يَنْطِقَانِ", "يَنْطِقُونَ", "تَنْطِقُ", "تَنْطِقَانِ", "يَنْطِقْنَ", "تَنْطِقُ", "تَنْطِقَانِ", "تَنْطِقُونَ", "تَنْطِقِينَ", "تَنْطِقَانِ", "تَنْطِقْنَ", "أَنْطِقُ", "نَنْطِقُ", "نَنْطِقُ"]
        },

        // --- 5 Numaralı Kalıp (Mücerret 2. Bab Emir) ---
        5: { 
            base: { 
                emoji: "❗", 
                arText: "اِنْطِقْ", 
                trText: "Konuş / Söyle!" 
            },
            cekimi: ["اِنْطِقْ", "اِنْطِقَا", "اِنْطِقُوا", "اِنْطِقِي", "اِنْطِقَا", "اِنْطِقْنَ"]
        },

        // --- 21 Numaralı Kalıp (فُعْل - Mücerret Masdar) ---
        21: { 
            base: { 
                emoji: "📜", 
                arText: "نُطْق", 
                trText: "Nutuk / Konuşma, telaffuz etme eylemi.",
                ornek: {
                    ar: "💡 مَعْلُومَة ثَقَافِيَّة",
                    tr: "Kültürel Not: Atatürk'ün meşhur eseri 'Nutuk' ve Türkçedeki 'Nutku tutuldu' veya 'Nutuk atmak' deyimleri doğrudan bu masdardan gelir."
                }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "👤", 
                arText: "نَاطِق", 
                trText: "Natık / Konuşan, bildiren, söz söyleyen.",
                ornek: { 
                    ar: "الْإِنْسَانُ حَيَوَانٌ نَاطِقٌ", 
                    tr: "İnsan konuşan/düşünen bir canlıdır. (Felsefe ve Mantık ilminde insanın klasik tanımı)." 
                }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🎤", 
                arText: "نَاطِقَة", 
                trText: "Sözcü / Konuşmacı.",
                ornek: { 
                    ar: "النَّاطِقَةُ بِاسْمِ الْوِزَارَةِ", 
                    tr: "Bakanlık sözcüsü." 
                }
            }
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "📑", 
                arText: "مَنْطُوق", 
                trText: "Mantuk / Söylenmiş olan, sözün lafzı, ifade edilen şey.",
                ornek: { 
                    ar: "مَنْطُوقُ الْقَرَارِ", 
                    tr: "Kararın metni (söylenen kısmı)." 
                }
            }
        },

        // --- 37 Numaralı Kalıp (مَفْعِل - Masdar-ı Mîmî / İsim) ---
        37: { 
            base: { 
                emoji: "🧠", 
                arText: "مَنْطِق", 
                trText: "Mantık / Doğru düşünme kuralı, akıl yürütme.",
                ornek: {
                    ar: "💡 مَعْلُومَة لُغَوِيَّة",
                    tr: "Gramer ve Felsefe Notu: 'Mantık' kelimesi 'Konuşmak' (N-T-Q) kökünden türemiştir. Eski Yunan'daki 'Logos' (hem söz hem akıl anlamına gelir) kavramının tam Arapça karşılığıdır. Çünkü doğru düşünce, ancak doğru sözle (nutuk) inşa edilebilir."
                }
            } 
        },

        // --- 39 Numaralı Kalıp (مِفْعَل - İsm-i Âlet ve +ة ile Mekân) ---
        39: { 
            base: { 
                emoji: "🥋", 
                arText: "مِنْطَق", 
                trText: "Mıntak / Kemer, bele bağlanan kuşak." 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🗺️", 
                arText: "مِنْطَقَة", 
                trText: "Mıntıka / Bölge, kuşak, alan.",
                ornek: [
                    { 
                        ar: "مِنْطَقَةٌ عَسْكَرِيَّةٌ", 
                        tr: "Askeri mıntıka (bölge)." 
                    },
                    {
                        ar: "💡 مَعْلُومَة تَارِيخِيَّة",
                        tr: "Etimolojik Not: Aslında 'bele bağlanan kuşak/kemer' demektir (Mıntak). Belirli bir alanı kuşak gibi çevreleyip sınırlandırdığı için zamanla yeryüzündeki belirli bölgelere 'Mıntıka' denilmiştir."
                    }
                ]
            } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi - Ettirgenlik) ---
        52: { 
            base: { 
                emoji: "✨", 
                arText: "أَنْطَقَ", 
                trText: "Konuşturdu / Söyletti.",
                ornek: { 
                    ar: "أَنْطَقَنَا اللهُ الَّذِي أَنْطَقَ كُلَّ شَيْءٍ", 
                    tr: "Her şeyi konuşturduğu gibi bizi de Allah konuşturdu. (Fussilet Suresi, 21)" 
                }
            },
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: { 
            base: { 
                emoji: "🪄", 
                arText: "يُنْطِقُ", 
                trText: "Konuşturur / Söyletir.",
                ornek: { 
                    ar: "اللهُ يُنْطِقُ مَنْ يَشَاءُ", 
                    tr: "Allah dilediğini konuşturur." 
                }
            },
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "🎭", 
                arText: "إِنْطَاق", 
                trText: "İntak / Konuşturma, dile getirtme.",
                ornek: [
                    { 
                        ar: "فَنُّ الْإِنْطَاقِ فِي الْأَدَبِ", 
                        tr: "Edebiyatta konuşturma (intak) sanatı." 
                    },
                    {
                        ar: "💡 مَعْلُومَة أَدَبِيَّة",
                        tr: "Edebiyat Notu: Türk edebiyatında insan dışındaki varlıkları (hayvanları, bitkileri veya cansız nesneleri) 'konuşturma' sanatına doğrudan bu kelimeyle 'İntak Sanatı' denir. Genellikle 'Teşhis' (kişileştirme) sanatı ile ayrılmaz bir ikilidir; çünkü konuşan her varlık önce kişileştirilmiş olur."
                    }
                ]
            } 
        }
    },

    // ==================================================================
    // 12. B-D-A (ب د أ) KÖKÜ - Başlamak / İlk Olmak / Ortaya Çıkarmak
    // Temel hareketlerin başlangıcını temsil eder. (Sonu hemzeli - Mehmuz Fiil / 3. Bab)
    // ==================================================================
    "بدأ": {
        // --- 1 Numaralı Kalıp (Mücerret 3. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🎬", 
                arText: "بَدَأَ", 
                trText: "Başladı.",
                ornek: { 
                    ar: "بَدَأَ الدَّرْسُ فِي الْوَقْتِ الْمُحَدَّدِ", 
                    tr: "Ders belirlenen vakitte başladı." 
                }
            },
            cekimi: ["بَدَأَ", "بَدَأَا", "بَدَأُوا", "بَدَأَتْ", "بَدَأَتَا", "بَدَأْنَ", "بَدَأْتَ", "بَدَأْتُمَا", "بَدَأْتُمْ", "بَدَأْتِ", "بَدَأْتُمَا", "بَدَأْتُنَّ", "بَدَأْتُ", "بَدَأْنَا", "بَدَأْنَا"]
        },

        // --- 4 Numaralı Kalıp (Mücerret 3. Bab Muzari) ---
        6: { 
            base: { 
                emoji: "▶️", 
                arText: "يَبْدَأُ", 
                trText: "Başlar / Başlıyor.",
                ornek: { 
                    ar: "اللهُ يَبْدَأُ الْخَلْقَ ثُمَّ يُعِيدُهُ", 
                    tr: "Allah yaratmaya (önce) başlar, sonra onu tekrarlar. (Rûm Suresi, 11)" 
                }
            },
            cekimi: ["يَبْدَأُ", "يَبْدَآنِ", "يَبْدَءُونَ", "تَبْدَأُ", "تَبْدَآنِ", "يَبْدَأْنَ", "تَبْدَأُ", "تَبْدَآنِ", "تَبْدَءُونَ", "تَبْدَئِينَ", "تَبْدَآنِ", "تَبْدَأْنَ", "أَبْدَأُ", "نَبْدَأُ", "نَبْدَأُ"]
        },

        // --- 5 Numaralı Kalıp (Mücerret 3. Bab Emir) ---
        7: { 
            base: { 
                emoji: "❗", 
                arText: "اِبْدَأْ", 
                trText: "Başla!",
                ornek: {
                    ar: "اِبْدَأْ بِاسْمِ اللهِ",
                    tr: "Allah'ın adıyla başla."
                }
            },
            cekimi: ["اِبْدَأْ", "اِبْدَءَا", "اِبْدَءُوا", "اِبْدَئِي", "اِبْدَءَا", "اِبْدَأْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "🏁", 
                arText: "بَدْء", 
                trText: "Bed' / Başlama, başlangıç, ilk.",
                ornek: {
                    ar: "بَادِئَ ذِي بَدْءٍ",
                    tr: "Her şeyden önce / İlk iş olarak. (Arapçada çok meşhur bir kalıp ifadedir)."
                }
            }
        },

        // --- 23 Numaralı Kalıp (فِعَالَة - Masdar / İsim) ---
        23: { 
            base: { 
                emoji: "🌅", 
                arText: "بِدَايَة", 
                trText: "Bidayet / Başlangıç, ilk an.",
                ornek: [
                    { 
                        ar: "فِي الْبِدَايَةِ", 
                        tr: "Başlangıçta." 
                    },
                    {
                        ar: "💡 مَعْلُومَة أَدَبِيَّة",
                        tr: "Edebiyat Notu: Osmanlıca metinlerde 'nihayet' (son) kelimesinin zıttı olarak çokça kullanılan 'bidayet', tam olarak bir şeyin ortaya çıkıp başladığı an demektir."
                    }
                ]
            } 
        },

        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekân / Zaman ve İsim) ---
        38: { 
            base: { 
                emoji: "🌱", 
                arText: "مَبْدَأ", 
                trText: "Mebde / Başlangıç noktası, ilke, prensip.",
                ornek: { 
                    ar: "رَجُلٌ ذُو مَبَادِئَ", 
                    tr: "Prensipleri (mebdeleri / ilkeleri) olan adam." 
                }
            } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi) ---
        52: { 
            base: { 
                emoji: "✨", 
                arText: "أَبْدَأَ", 
                trText: "İlk kez başlattı / İlk defa yarattı." 
            },
            cekimi: ["أَبْدَأَ", "أَبْدَأَا", "أَبْدَءُوا", "أَبْدَأَتْ", "أَبْدَأَتَا", "أَبْدَأْنَ", "أَبْدَأْتَ", "أَبْدَأْتُمَا", "أَبْدَأْتُمْ", "أَبْدَأْتِ", "أَبْدَأْتُمَا", "أَبْدَأْتُنَّ", "أَبْدَأْتُ", "أَبْدَأْنَا", "أَبْدَأْنَا"]
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: { 
            base: { 
                emoji: "🌌", 
                arText: "يُبْدِئُ", 
                trText: "İlk kez başlatır / Yaratmaya başlar.",
                ornek: { 
                    ar: "إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ", 
                    tr: "Şüphesiz ki O, (yaratmaya) ilk baştan başlar ve (ölümden sonra) tekrar diriltir. (Burûc Suresi, 13)" 
                }
            },
            cekimi: ["يُبْدِئُ", "يُبْدِئَانِ", "يُبْدِئُونَ", "تُبْدِئُ", "تُبْدِئَانِ", "يُبْدِئْنَ", "تُبْدِئُ", "تُبْدِئَانِ", "تُبْدِئُونَ", "تُبْدِئِينَ", "تُبْدِئَانِ", "تُبْدِئْنَ", "أُبْدِئُ", "نُبْدِئُ", "نُبْدِئُ"]
        },

        // --- 54 Numaralı Kalıp (أَفْعِلْ - İf'âl Babı Emir) ---
        54: { 
            base: { 
                emoji: "❗", 
                arText: "أَبْدِئْ", 
                trText: "Başlat / İlk kez yarat!" 
            },
            cekimi: ["أَبْدِئْ", "أَبْدِئَا", "أَبْدِئُوا", "أَبْدِئِي", "أَبْدِئَا", "أَبْدِئْنَ"]
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "🕋", 
                arText: "إِبْدَاء", 
                trText: "İbdâ / İlk kez yaratma, bir şeyi ilk defa başlatma.",
                ornek: {
                    ar: "💡 مَعْلُومَة عَقَائِدِيَّة",
                    tr: "Kelam Notu: İslami literatürde 'İbda' kelimesinin Türkçede birbirine karışan üç ayrı kökü vardır: 1. (ب د أ): İlk yaratış. 2. (ب د ع): Yoktan ve benzersiz yaratış (İbdâ'). 3. (ب د و): Gizli olanı açığa çıkarma. Kur'an'da Allah'ın ilk yaratışı ifade edilirken 'İbdâ' (ب د أ) kökü kullanılır."
                }
            } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi) ---
        77: { 
            base: { 
                emoji: "🚀", 
                arText: "اِبْتَدَأَ", 
                trText: "Başladı / İlkokula başladı." 
            },
            cekimi: ["اِبْتَدَأَ", "اِبْتَدَأَا", "اِبْتَدَأُوا", "اِبْتَدَأَتْ", "اِبْتَدَأَتَا", "اِبْتَدَأْنَ", "اِبْتَدَأْتَ", "اِبْتَدَأْتُمَا", "اِبْتَدَأْتُمْ", "اِبْتَدَأْتِ", "اِبْتَدَأْتُمَا", "اِبْتَدَأْتُنَّ", "اِبْتَدَأْتُ", "اِبْتَدَأْنَا", "اِبْتَدَأْنَا"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "🏫", 
                arText: "اِبْتِدَاء", 
                trText: "İbtida / Başlangıç.",
                ornek: { 
                    ar: "اِبْتِدَاءً مِنْ غَدٍ", 
                    tr: "Yarından itibaren (başlayarak)." 
                }
            },
            suggestsPlus: true,
            "يَّة": { 
                emoji: "🎒", 
                arText: "اِبْتِدَائِيَّة", 
                trText: "İlköğretim / İbtidaiye.",
                ornek: { 
                    ar: "الْمَدْرَسَةُ الِابْتِدَائِيَّةُ", 
                    tr: "İlkokul (Mekteb-i İbtidaiye)." 
                }
            } 
        }
    },

     // ==================================================================
    // 13. Q-W-M (ق و م) KÖKÜ - Kalkmak / Durmak / Doğrulmak
    // Hareketin, duruşun ve istikrarın merkezidir. (Ecvef Fiil / 1. Bab)
    // ==================================================================
    "قوم": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi - Ecvef) ---
        1: { 
            base: { 
                emoji: "🧍", 
                arText: "قَامَ", 
                trText: "Kalktı / Ayağa kalktı / Durdu.",
                ornek: { 
                    ar: "قَامَ مِنْ نَوْمِهِ مُبَكِّرًا", 
                    tr: "Uykusundan erkenden kalktı." 
                }
            },
            cekimi: ["قَامَ", "قَامَا", "قَامُوا", "قَامَتْ", "قَامَتَا", "قُمْنَ", "قُمْتَ", "قُمْتُمَا", "قُمْتُمْ", "قُمْتِ", "قُمْتُمَا", "قُمْتُنَّ", "قُمْتُ", "قُمْنَا", "قُمْنَا"]
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "⏳", 
                arText: "يَقُومُ", 
                trText: "Kalkar / Durur / Yerine getirir.",
                ornek: { 
                    ar: "يَقُومُ بِوَاجِبِهِ", 
                    tr: "Görevini yerine getirir (kalkışır/yapar)." 
                }
            },
            cekimi: ["يَقُومُ", "يَقُومَانِ", "يَقُومُونَ", "تَقُومُ", "تَقُومَانِ", "يَقُمْنَ", "تَقُومُ", "تَقُومَانِ", "تَقُومُونَ", "تَقُومِينَ", "تَقُومَانِ", "تَقُمْنَ", "أَقُومُ", "نَقُومُ", "نَقُومُ"]
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { 
                emoji: "❗", 
                arText: "قُمْ", 
                trText: "Kalk!",
                ornek: {
                    ar: "يَا أَيُّهَا الْمُدَّثِّرُ ۝ قُمْ فَأَنْذِرْ",
                    tr: "Ey örtüsüne bürünen! Kalk ve uyar! (Müddessir Suresi, 1-2)"
                }
            },
            cekimi: ["قُمْ", "قُومَا", "قُومُوا", "قُومِي", "قُومَا", "قُمْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar / İsim) ---
        19: { 
            base: { 
                emoji: "👥", 
                arText: "قَوْم", 
                trText: "Kavim / Topluluk, millet.",
                ornek: {
                    ar: "💡 مَعْلُومَة لُغَوِيَّة",
                    tr: "Etimolojik Not: 'Kavim' kelimesi 'kalkmak' kökündendir. Birlikte hareket eden, zorluklara karşı beraber ayağa kalkan, dayanışma içinde duran insan topluluğuna bu isim verilmiştir."
                }
            },
            suggestsPlus: true,
            "يَّة": { 
                emoji: "🇹🇷", 
                arText: "قَوْمِيَّة", 
                trText: "Kavmiyet / Milliyetçilik, ulusçuluk." 
            }
        },

        // --- 23 Numaralı Kalıp (فِعَال - Masdar) ---
        23: { 
            base: { 
                emoji: "🕋", 
                arText: "قِيَام", 
                trText: "Kıyam / Ayağa kalkma, ayakta durma, diriliş.",
                ornek: { 
                    ar: "قِيَامُ اللَّيْلِ", 
                    tr: "Gece kalkışı (Gece namazı)." 
                }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🌋", 
                arText: "قِيَامَة", 
                trText: "Kıyamet / Diriliş, ölülerin topluca ayağa kalkması.",
                ornek: {
                    ar: "يَوْمُ الْقِيَامَةِ",
                    tr: "Kıyamet Günü (İnsanların dirilip ayağa kalktığı gün)."
                }
            }
        },

        // --- 26 Numaralı Kalıp (فَيْعُول - İstisnai Mübalağa İsm-i Fâili) ---
        26: { 
            base: { 
                emoji: "🌍", 
                arText: "قَيُّوم", 
                trText: "Kayyum (Kayyûm) / Her şeyi ayakta tutan, kendi zatıyla kaim olan.",
                ornek: [
                    { 
                        ar: "اللهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", 
                        tr: "Allah, O'ndan başka ilah yoktur; Diridir, Kayyum'dur (her şeyi ayakta tutandır). (Bakara Suresi, 255 - Âyet el-Kürsî)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة صَرْفِيَّة (إِعْلَال)",
                        tr: "Sarf Notu: Sistemdeki 26. kalıp normalde 'فَعُول' (Fa'ûl) veznidir. Ancak bu kelime, sonsuzluk ve kesintisizlik vurgusu yapmak için o veznin çok özel bir türevi olan 'فَيْعُول' (Fey'ûl) vezninden gelmiştir. Aslı 'قَيْوُوم' (Kayvûm) iken, ses kuralı (Yâ ve Vav'ın yan yana gelip ilkinin cezimli olması) gereği 'Vav' harfi 'Yâ'ya dönüşmüş ve şeddelenerek 'قَيُّوم' (Kayyûm) olmuştur."
                    }
                ]
            } 
        },


        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🏛️", 
                arText: "قَائِم", 
                trText: "Kaim / Ayakta duran, var olan, yerine geçen.",
                ornek: { 
                    ar: "الْقَائِمُ بِالْأَعْمَالِ", 
                    tr: "İşleri yürüten (Maslahatgüzar / birinin yerine kaim olan)." 
                }
            } 
        },

        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekân / Zaman) ---
        38: { 
            base: { 
                emoji: "👑", 
                arText: "مَقَام", 
                trText: "Makam / Durulan yer, mevki, rütbe.",
                ornek: { 
                    ar: "مَقَامٌ مَحْمُودٌ", 
                    tr: "Övülmüş makam (yer). (İsrâ Suresi, 79)" 
                }
            } 
        },

        
        // --- 100 Numaralı Kalıp (اِسْتَفْعَلَ - İstif'âl Babı Mazi - Yönelme/Talep) ---
        100: { 
            base: { 
                emoji: "🛤️", 
                arText: "اِسْتَقَامَ", 
                trText: "Doğruldu / İstikamet üzere oldu." 
            },
            cekimi: ["اِسْتَقَامَ", "اِسْتَقَامَا", "اِسْتَقَامُوا", "اِسْتَقَامَتْ", "اِسْتَقَامَتَا", "اِسْتَقَمْنَ", "اِسْتَقَمْتَ", "اِسْتَقَمْتُمَا", "اِسْتَقَمْتُمْ", "اِسْتَقَمْتِ", "اِسْتَقَمْتُمَا", "اِسْتَقَمْتُنَّ", "اِسْتَقَمْتُ", "اِسْتَقَمْنَا", "اِسْتَقَمْنَا"]
        },

        // --- 101 Numaralı Kalıp (يَسْتَفْعِلُ - İstif'âl Babı Muzari) ---
        101: { 
            base: { 
                emoji: "🚶", 
                arText: "يَسْتَقِيمُ", 
                trText: "Doğrulur / İstikamet üzere olur."
            },
            cekimi: ["يَسْتَقِيمُ", "يَسْتَقِيمَانِ", "يَسْتَقِيمُونَ", "تَسْتَقِيمُ", "تَسْتَقِيمَانِ", "يَسْتَقِمْنَ", "تَسْتَقِيمُ", "تَسْتَقِيمَانِ", "تَسْتَقِيمُونَ", "تَسْتَقِيمِينَ", "تَسْتَقِيمَانِ", "تَسْتَقِمْنَ", "أَسْتَقِيمُ", "نَسْتَقِيمُ", "نَسْتَقِيمُ"]
        },

        // --- 102 Numaralı Kalıp (اِسْتَفْعِلْ - İstif'âl Babı Emir) ---
        102: { 
            base: { 
                emoji: "❗", 
                arText: "اِسْتَقِمْ", 
                trText: "Doğrul / İstikamet üzere ol!",
                ornek: {
                    ar: "فَاسْتَقِمْ كَمَا أُمِرْتَ",
                    tr: "Emrolunduğun gibi dosdoğru ol (istikamet üzere ol). (Hûd Suresi, 112)"
                }
            },
            cekimi: ["اِسْتَقِمْ", "اِسْتَقِيمَا", "اِسْتَقِيمُوا", "اِسْتَقِيمِي", "اِسْتَقِيمَا", "اِسْتَقِمْنَ"]
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - İstif'âl Babı Masdarı / Ecvef Kuralı) ---
        103: { 
            base: { 
                emoji: "🧭", 
                arText: "اِسْتِقَامَة", 
                trText: "İstikamet / Doğruluk, doğru yön, sapmadan ilerleme.",
                ornek: {
                    ar: "💡 مَعْلُومَة صَرْفِيَّة (تَعْوِيض)",
                    tr: "Sarf Notu: İstif'âl babının masdarı normalde 'اِسْتِفْعَال' veznindedir. Ancak Ecvef (ortası illetli) fiillerde (ق-و-م gibi) ses kuralı gereği ortadaki illet harfi düşer ve buna bedel/tazmin olarak masdarın sonuna mecburi bir 'ة' eklenir. Bu 'ة' kelimenin ayrılmaz bir parçasıdır."
                }
            } 
        },

        // --- 104 Numaralı Kalıp (مُسْتَفْعِل - İstif'âl Babı İsm-i Fâili) ---
        104: { 
            base: { 
                emoji: "🎯", 
                arText: "مُسْتَقِيم", 
                trText: "Müstakim / Dosdoğru, istikamet sahibi, sapmayan.",
                ornek: { 
                    ar: "اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", 
                    tr: "Bizi dosdoğru yola (istikametli / müstakim yola) ilet. (Fâtiha Suresi, 6)" 
                }
            } 
        }
     },

     // ==================================================================
    // 14. C-L-S (ج ل س) KÖKÜ - Oturmak / Toplanmak
    // Temel duruş ve bir araya gelme eylemlerini ifade eder. (2. Bab)
    // ==================================================================
    "جلس": {
        // --- 1 Numaralı Kalıp (Mücerret 2. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🪑", 
                arText: "جَلَسَ", 
                trText: "Oturdu.",
                ornek: [
                    { 
                        ar: "جَلَسَ عَلَى الْكُرْسِيِّ", 
                        tr: "Sandalyeye oturdu." 
                    },
                    {
                        ar: "💡 مَعْلُومَة دَلَالِيَّة (فُرُوق اللُّغَة)",
                        tr: "Semantik Notu: Arapçada 'oturmak' anlamına gelen iki meşhur fiil vardır: Cülus (جُلُوس) ve Ku'ud (قُعُود). Dilbilimcilere göre; 'Cülus', yatan/uzanan birinin doğrulup oturmasıdır (Aşağıdan yukarıya). 'Ku'ud' ise ayakta duran birinin oturmasıdır (Yukarıdan aşağıya). Bu yüzden Kur'an'da genellikle 'Ku'ud' (قعد) kökü tercih edilir."
                    }
                ]
            },
        },
        // --- 4 Numaralı Kalıp (Mücerret 2. Bab Muzari) ---
        4: { 
            base: { 
                emoji: "🛋️", 
                arText: "يَجْلِسُ", 
                trText: "Oturur / Oturuyor."
            },
        },

        // --- 5 Numaralı Kalıp (Mücerret 2. Bab Emir) ---
        5: { 
            base: { 
                emoji: "❗", 
                arText: "اِجْلِسْ", 
                trText: "Otur!" 
            },
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "☕", 
                arText: "جَلْس", 
                trText: "Cels / Oturma eylemi." 
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "⚖️", 
                arText: "جَلْسَة", 
                trText: "Celse / Oturum, duruşma, toplantı.",
                ornek: { 
                    ar: "جَلْسَةُ الْمَحْكَمَةِ", 
                    tr: "Mahkeme celsesi (oturumu)." 
                }
            } 
        },

        // --- 25 Numaralı Kalıp (فُعُول - Mücerret Masdar) ---
        25: { 
            base: { 
                emoji: "👑", 
                arText: "جُلُوس", 
                trText: "Cülus / Oturma, tahta çıkma.",
                ornek: [
                    { 
                        ar: "مَمْنُوعُ الْجُلُوسِ", 
                        tr: "Oturmak yasaktır." 
                    },
                    {
                        ar: "💡 مَعْلُومَة تَارِيخِيَّة",
                        tr: "Tarih Notu: Osmanlı'da padişahların tahta çıkma (oturma) törenine 'Cülus', bu törende dağıtılan bahşişe de 'Cülus Bahşişi' denirdi."
                    }
                ]
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "👤", 
                arText: "جَالِس", 
                trText: "Câlis / Oturan, oturmakta olan.",
                ornek: { 
                    ar: "أَنَا جَالِسٌ هُنَا", 
                    tr: "Ben burada oturuyorum (oturanım)." 
                }
            } 
        },

        // --- 37 Numaralı Kalıp (مَفْعِل - İsm-i Mekân / Zaman) ---
        37: { 
          base: { 
                emoji: "🏛️", 
                arText: "مَجْلِس", 
                trText: "Meclis / Oturulan yer, toplantı yeri, parlamento.",
                ornek: [
                    { 
                        ar: "إِذَا قِيلَ لَكُمْ تَفَسَّحُوا فِي الْمَجَالِسِ فَافْسَحُوا", 
                        tr: "Size 'Meclislerde (oturduğunuz yerlerde) yer açın' denildiğinde yer açın. (Mücadele Suresi, 11)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة صَرْفِيَّة",
                        tr: "Sarf Notu: Muzarisi 'esreli' (يَجْلِسُ) olan fiillerin İsm-i Mekân kalıbı 'مَفْعِل' (Mef'il) vezninde gelir. Bu yüzden kelime 'Mecles' değil 'Meclis' olmuştur."
                    }
                ]
            } 
        },

        // --- 64 Numaralı Kalıp (مُفَاعَلَة - Mufâ'ale Babı Masdarı - Karşılıklı Eylem) ---
        67: { 
            base: { 
                emoji: "🤝", 
                arText: "مُجَالَسَة", 
                trText: "Mücalese / Birlikte oturma, sohbet etme.",
                ornek: { 
                    ar: "مُجَالَسَةُ الصَّالِحِينَ", 
                    tr: "Salih (iyi) insanlarla birlikte oturmak." 
                }
            } 
        }
    },

    // ==================================================================
    // 15. W-Q-F (و ق ف) KÖKÜ - Durmak / Vakfetmek
    // Sabit kalmayı, durdurmayı ve bir amaca bağlamayı ifade eder. (Misâl Fiil / 2. Bab)
    // ==================================================================
    "وقف": {
        // --- 1 Numaralı Kalıp (Mücerret 2. Bab Mazi - Misâl Fiil) ---
        1: { 
            base: { 
                emoji: "🛑", 
                arText: "وَقَفَ", 
                trText: "Durdu / Vakfetti.",
                ornek: { 
                    ar: "وَقَفَ أَمَامَ الْبَابِ", 
                    tr: "Kapının önünde durdu." 
                }
            },
        },

        // --- 4 Numaralı Kalıp (Mücerret 2. Bab Muzari) ---
        4: { 
            base: { 
                emoji: "⏳", 
                arText: "يَقِفُ", 
                trText: "Durur / Bekler.",
                ornek: [
                    { 
                        ar: "وَقِفُوهُمْ إِنَّهُمْ مَسْئُولُونَ", 
                        tr: "Onları durdurun (tutuklayın); çünkü onlar sorguya çekilecekler! (Sâffât Suresi, 24)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة صَرْفِيَّة (الْمِثَال)",
                        tr: "Sarf Notu: Başı illetli (Vav) olan bu fiillere 'Misâl Fiil' denir. Muzari (يَقِفُ) ve Emir (قِفْ) kiplerinde, telaffuz zorluğunu aşmak için baştaki 'Vav' harfi tamamen düşer."
                    }
                ]
            },
        },

        // --- 5 Numaralı Kalıp (Mücerret 2. Bab Emir) ---
        5: { 
            base: { 
                emoji: "✋", 
                arText: "قِفْ", 
                trText: "Dur!" 
            },
        },

       // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "🏛️", 
                arText: "وَقْف", 
                trText: "Vakıf / Durdurma, bir malı hayır için bağışlama (vakfetme).",
                ornek: [
                    { 
                        ar: "وَقْفٌ خَيْرِيٌّ", 
                        tr: "Hayır vakfı." 
                    },
                    {
                        ar: "💡 مَعْلُومَة تَجْوِيدِيَّة",
                        tr: "Tecvid Notu: Kur'an okurken anlamı bozmamak için nefesi ve sesi keserek durmaya 'Vakıf' denir. Kur'an'daki duraklama işaretlerine de 'Vakıf İşaretleri' (Secavend) adı verilir."
                    }
                ]
            }
        },

        // --- 25 Numaralı Kalıp (فُعُول - Mücerret Masdar) ---
        25: { 
            base: { 
                emoji: "🧍", 
                arText: "وُقُوف", 
                trText: "Vukuf / Durma, bekleme, bir konuya vâkıf olma (bilme).",
                ornek: {
                    ar: "الْوُقُوفُ بِعَرَفَةَ",
                    tr: "Arafat'ta vakfeye durmak (Haccın temel rüknü)."
                }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "👁️", 
                arText: "وَاقِف", 
                trText: "Vâkıf / Duran, vakfeden, bir konuyu tam olarak bilen.",
                ornek: { 
                    ar: "أَنَا وَاقِفٌ عَلَى التَّفَاصِيلِ", 
                    tr: "Ben detaylara vâkıfım (hakimim/biliyorum)." 
                }
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "🔒", 
                arText: "مَوْقُوف", 
                trText: "Mevkuf / Durdurulmuş, alıkonulmuş, vakfedilmiş mal.",
                ornek: { 
                    ar: "هُوَ مَوْقُوفٌ عَنِ الْعَمَلِ", 
                    tr: "O, işten el çektirilmiş (açığa alınmış / mevkuf) durumdadır." 
                }
            } 
        },

        // --- 37 Numaralı Kalıp (مَفْعِل - İsm-i Mekân / Zaman) ---
        37: { 
            base: { 
                emoji: "🚏", 
                arText: "مَوْقِف", 
                trText: "Mevkıf / Durak, duruş biçimi, tutum, otopark.",
                ornek: [
                    { 
                        ar: "مَوْقِفُ الْحَافِلَاتِ", 
                        tr: "Otobüs durağı." 
                    },
                    {
                        ar: "مَا هُوَ مَوْقِفُكَ مِنْ هَذَا الْأَمْرِ؟",
                        tr: "Bu iş karşısındaki tutumun (duruşun/mevkıfın) nedir?"
                    }
                ]
            } 
        },

        // --- 40 Numaralı Kalıp (أَفْعَال - Cem-i Mükesser / Kırık Çoğul) ---
        41: { 
            base: { 
                emoji: "📜", 
                arText: "أَوْقَاف", 
                trText: "Evkaf / Vakıflar, bağışlanan mallar.",
                ornek: {
                    ar: "💡 مَعْلُومَة تَارِيخِيَّة",
                    tr: "Tarih Notu: Osmanlı Devleti'nde tüm vakıf işlerinden sorumlu olan kuruma 'Evkaf Nezareti' (Vakıflar Bakanlığı) denirdi. Günümüzde 'Vakıflar Genel Müdürlüğü' olarak devam etmektedir."
                }
            } 
        },

     // --- 58 Numaralı Kalıp (فَعَّلَ - Tef'îl Babı Mazi - Ettirgenlik/Geçişlilik) ---
        58: { 
            base: { 
                emoji: "🚧", 
                arText: "وَقَّفَ", 
                trText: "Durdurdu / Tutukladı (Tevkif etti).",
                ornek: { 
                    ar: "الشُّرْطَةُ وَقَّفَتِ السَّيَّارَةَ", 
                    tr: "Polis arabayı durdurdu." 
                }
            },
            cekimi: ["وَقَّفَ", "وَقَّفَا", "وَقَّفُوا", "وَقَّفَتْ", "وَقَّفَتَا", "وَقَّفْنَ", "وَقَّفْتَ", "وَقَّفْتُمَا", "وَقَّفْتُمْ", "وَقَّفْتِ", "وَقَّفْتُمَا", "وَقَّفْتُنَّ", "وَقَّفْتُ", "وَقَّفْنَا", "وَقَّفْنَا"]
        },
       
          // --- 43 Numaralı Kalıp (يُفَعِّلُ - Tef'îl Babı Muzari) ---
        59: { 
            base: { 
                emoji: "✋", 
                arText: "يُوَقِّفُ", 
                trText: "Durdurur / Tutuklar.",
                ornek: {
                    ar: "💡 مَعْلُومَة صَرْفِيَّة",
                    tr: "Sarf Notu: Misâl fiillerin (başı 'Vav' olanların) 1. formda (Mücerret) muzari ve emirlerinde 'Vav' harfi düşerken (يَقِفُ / قِفْ), Tef'il Babı gibi türetilmiş bablarda 'Vav' harfi düşmez, aynen korunur (يُوَقِّفُ / وَقِّفْ)."
                }
            },
            cekimi: ["يُوَقِّفُ", "يُوَقِّفَانِ", "يُوَقِّفُونَ", "تُوَقِّفُ", "تُوَقِّفَانِ", "يُوَقِّفْنَ", "تُوَقِّفُ", "تُوَقِّفَانِ", "تُوَقِّفُونَ", "تُوَقِّفِينَ", "تُوَقِّفَانِ", "تُوَقِّفْنَ", "أُوَقِّفُ", "نُوَقِّفُ", "نُوَقِّفُ"]
        },

        // --- 45 Numaralı Kalıp (فَعِّلْ - Tef'îl Babı Emir) ---
        60: { 
            base: { 
                emoji: "❗", 
                arText: "وَقِّفْ", 
                trText: "Durdur / Tutukla!",
                ornek: { 
                    ar: "وَقِّفِ السَّيَّارَةَ هُنَا", 
                    tr: "Arabayı burada durdur." 
                }
            },
            cekimi: ["وَقِّفْ", "وَقِّفَا", "وَقِّفُوا", "وَقِّفِي", "وَقِّفَا", "وَقِّفْنَ"]
        },
 
        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı - Ettirgenlik) ---
        61: { 
            base: { 
                emoji: "🚓", 
                arText: "تَوْقِيف", 
                trText: "Tevkif / Durdurma, alıkoyma, tutuklama.",
                ornek: { 
                    ar: "أَمْرُ تَوْقِيفٍ", 
                    tr: "Tutuklama emri (Tevkif müzekkeresi)." 
                }
            } 
        }
    },

    // ==================================================================
    // 16. R-F-' (ر ف ع) KÖKÜ - Kaldırmak / Yüceltmek / Yükseltmek
    // Fiziki veya manevi olarak yukarı taşımayı ifade eder. (3. Bab)
    // ==================================================================
    "رفع": {
        // --- 1 Numaralı Kalıp (Mücerret 3. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "⬆️", 
                arText: "رَفَعَ", 
                trText: "Kaldırdı / Yükseltti / Yüceltti.",
                ornek: { 
                    ar: "اللهُ الَّذِي رَفَعَ السَّمَاوَاتِ", 
                    tr: "Allah, gökleri yükseltendir. (Ra'd Suresi, 2)" 
                }
            },
        },

        // --- 4 Numaralı Kalıp (Mücerret 3. Bab Muzari) ---
        6: { 
            base: { 
                emoji: "📈", 
                arText: "يَرْفَعُ", 
                trText: "Kaldırır / Yükseltir.",
                ornek: { 
                    ar: "يَرْفَعِ اللهُ الَّذِينَ آمَنُوا مِنْكُمْ", 
                    tr: "Allah, içinizden iman edenleri (derece olarak) yükseltir. (Mücadele Suresi, 11)" 
                }
            },
        },

        // --- 5 Numaralı Kalıp (Mücerret 3. Bab Emir) ---
        7: { 
            base: { 
                emoji: "🙌", 
                arText: "اِرْفَعْ", 
                trText: "Kaldır / Yükselt!",
                ornek: {
                    ar: "اِرْفَعْ يَدَيْكَ",
                    tr: "Ellerini kaldır."
                }
            },
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "🏗️", 
                arText: "رَفْع", 
                trText: "Raf' / Kaldırma, yükseltme, ortadan kaldırma.",
                ornek: {
                    ar: "رَفْعُ الْحَظْرِ",
                    tr: "Yasağın kaldırılması."
                }
            }
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "👑", 
                arText: "رَافِع", 
                trText: "Râfi' / Kaldıran, yükselten.",
                ornek: [
                    { 
                        ar: "اَلرَّافِعُ", 
                        tr: "Er-Râfi': Allah'ın güzel isimlerinden (Esma-ül Hüsna) olup 'dilediğinin makamını ve derecesini yükselten' demektir." 
                    },
                    {
                        ar: "رَافِعَةٌ",
                        tr: "Râfia: Vinç (Kaldıraç görevindeki aletlere dişil ism-i fail kalıbıyla isim verilmiştir)."
                    }
                ]
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "🚩", 
                arText: "مَرْفُوع", 
                trText: "Merfû' / Kaldırılmış, yükseltilmiş.",
                ornek: { 
                    ar: "💡 مَعْلُومَة نَحْوِيَّة", 
                    tr: "Gramer (Nahiv) Notu: Arapçada cümlenin öznesi (Fâil) ve isim cümlesinin öğeleri (Mübteda-Haber) hareke olarak ötre (damme) alırlar. Ötreli okunan bu kelimelere gramerde 'Merfû' (harekesi yükseltilmiş/ötre yapılmış) kelimeler denir." 
                }
            } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi - Dönüşlülük/Kendi kendine olma) ---
        77: { 
            base: { 
                emoji: "🚀", 
                arText: "اِرْتَفَعَ", 
                trText: "Yükseldi / Arttı.",
                ornek: { 
                    ar: "اِرْتَفَعَتِ الْأَسْعَارُ", 
                    tr: "Fiyatlar yükseldi (arttı)." 
                }
            },
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "🏔️", 
                arText: "اِرْتِفَاع", 
                trText: "İrtifa / Yükseklik, yükselme, rakım.",
                ornek: { 
                    ar: "عَلَى ارْتِفَاعِ أَلْفِ مِتْرٍ", 
                    tr: "Bin metre irtifada (yükseklikte)." 
                }
            } 
        }
    },

  // ==================================================================
    // 17. N-Z-L (ن ز ل) KÖKÜ - İnmek / Konaklamak
    // Yukarıdan aşağıya hareketi ve bir yere yerleşmeyi ifade eder. (2. Bab)
    // ==================================================================
    "نزل": {
        // --- 1 Numaralı Kalıp (Mücerret 2. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "⬇️", 
                arText: "نَزَلَ", 
                trText: "İndi / Konakladı.",
                ornek: { 
                    ar: "نَزَلَ مِنَ السَّيَّارَةِ", 
                    tr: "Arabadan indi." 
                }
            },
        },

        // --- 4 Numaralı Kalıp (Mücerret 2. Bab Muzari) ---
        4: { 
            base: { 
                emoji: "📉", 
                arText: "يَنْزِلُ", 
                trText: "İner / Konaklar.",
                ornek: { 
                    ar: "الْمَطَرُ يَنْزِلُ كَثِيرًا هَذِهِ الْأَيَّامِ", 
                    tr: "Bugünlerde yağmur çok yağıyor (iniyor)." 
                }
            },
        },

        // --- 5 Numaralı Kalıp (Mücerret 2. Bab Emir) ---
        5: { 
            base: { 
                emoji: "❗", 
                arText: "اِنْزِلْ", 
                trText: "İn!",
            },
        },

        // --- 25 Numaralı Kalıp (فُعُول - Mücerret Masdar) ---
        25: { 
            base: { 
                emoji: "🪂", 
                arText: "نُزُول", 
                trText: "Nüzul / İniş, inme.",
                ornek: {
                    ar: "أَسْبَابُ النُّزُولِ",
                    tr: "İniş sebepleri (Kur'an ayetlerinin iniş sebeplerini inceleyen bilim dalı)."
                }
            }
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🧳", 
                arText: "نَازِل", 
                trText: "Nâzil / İnen, konaklayan, misafir.",
                ornek: { 
                    ar: "وَهُوَ نَازِلٌ فِي فُنْدُقٍ", 
                    tr: "O, bir otelde konaklıyor (misafir/inen)." 
                }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "⚠️", 
                arText: "نَازِلَة", 
                trText: "Nâzile / İnen musibet, başa gelen büyük felaket.",
                ornek: {
                    ar: "دُعَاءُ النَّوَازِلِ",
                    tr: "Felaketler (inen musibetler) anında okunan dua."
                }
            }
        },

        // --- 37 Numaralı Kalıp (مَفْعِل - İsm-i Mekân / Zaman) ---
        37: { 
            base: { 
                emoji: "🏕️", 
                arText: "مَنْزِل", 
                trText: "Menzil / İnilen yer, konak, durak, ev.",
                ornek: [
                    { 
                        ar: "اَلْمَنْزِلُ جَدِيدٌ", 
                        tr: "Ev (Menzil) yenidir." 
                    },
                    {
                        ar: "💡 مَعْلُومَة صَرْفِيَّة",
                        tr: "Sarf Notu: Muzarisi 'esreli' (يَنْزِلُ) olan fiillerin İsm-i Mekân kalıbı 'مَفْعِل' (Mef'il) vezninde gelir. (Tıpkı Meclis gibi). Menzil kelimesi de 'inilen ve konaklanılan yer' anlamına gelir."
                    }
                ]
            } 
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Tef'îl Babı Mazi - Aşama Aşama İndirme) ---
        58: { 
            base: { 
                emoji: "📜", 
                arText: "نَزَّلَ", 
                trText: "Aşama aşama (parça parça) indirdi.",
                ornek: {
                    ar: "نَزَّلَ عَلَيْكَ الْكِتَابَ بِالْحَقِّ",
                    tr: "O, sana Kitab'ı hak ile parça parça indirdi. (Âl-i İmrân Suresi, 3)"
                }
            },
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { 
                emoji: "🌧️", 
                arText: "تَنْزِيل", 
                trText: "Tenzil / Kısım kısım indirme, indirim yapma.",
                ornek: [
                    { 
                        ar: "تَنْزِيلُ الْكِتَابِ مِنَ اللهِ الْعَزِيزِ الْحَكِيمِ", 
                        tr: "Bu kitabın indirilmesi (tenzili), Azîz ve Hakîm olan Allah'tandır. (Zümer Suresi, 1)" 
                    },
                    { 
                        ar: "تَنْزِيلَاتٌ خَاصَّةٌ", 
                        tr: "Özel indirimler (Tenzilat)." 
                    },
                    {
                        ar: "💡 مَعْلُومَة دَلَالِيَّة",
                        tr: "Semantik Not: Kur'an'ın 23 yıllık bir sürece yayılarak parça parça indirilmesini ifade etmek için Tef'il babından 'Tenzil' kelimesi kullanılır."
                    }
                ]
            } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi - Toptan İndirme) ---
        52: { 
            base: { 
                emoji: "⚡", 
                arText: "أَنْزَلَ", 
                trText: "Bir kerede (toptan) indirdi.",
                ornek: {
                    ar: "إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
                    tr: "Şüphesiz biz onu Kadir gecesinde (bir kerede/toptan) indirdik. (Kadir Suresi, 1)"
                }
            },
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "📦", 
                arText: "إِنْزَال", 
                trText: "İnzal / Tek seferde (toptan) indirme.",
                ornek: [
                    {
                        ar: "💡 مَعْلُومَة عَقَائِدِيَّة",
                        tr: "İlahiyat Notu: İf'al babı 'bir kerede olan' eylemleri bildirir. Kur'an'ın Levh-i Mahfuz'dan dünya semasına topluca indirilmesine, yağmurun gökten inmesine veya kendisinden önce indirilen Tevrat ve İncil'in inişine 'İnzal' denir."
                    }
                ]
            } 
        }
    },

     
    // ==================================================================
    // 20. C-R-Y (ج ر ي) KÖKÜ - Akmak / Koşmak / Gerçekleşmek
    // Bir şeyin sürekli hareket halinde olmasını ve akışını ifade eder. (Nakıs Fiil / 2. Bab)
    // ==================================================================
    "جري": {
        // --- 1 Numaralı Kalıp (Mücerret 2. Bab Mazi - Nakıs Fiil) ---
        1: { 
            base: { 
                emoji: "🌊", 
                arText: "جَرَى", 
                trText: "Aktı / Koştu / Meydana geldi.",
                ornek: { 
                    ar: "جَرَى الْمَاءُ فِي النَّهْرِ", 
                    tr: "Su nehirde aktı." 
                }
            },
        },

        // --- 4 Numaralı Kalıp (Mücerret 2. Bab Muzari) ---
        4: { 
            base: { 
                emoji: "🏃", 
                arText: "يَجْرِي", 
                trText: "Akar / Koşar / Gerçekleşir.",
                ornek: { 
                    ar: "تَجْرِي مِنْ تَحْتِهَا الْأَنْهَارُ", 
                    tr: "Altından ırmaklar akar. (Kur'an'da cennet tasvirlerinde en sık geçen ifadelerden biri)." 
                }
            },
        },

        // --- 5 Numaralı Kalıp (Mücerret 2. Bab Emir) ---
        5: { 
            base: { 
                emoji: "❗", 
                arText: "اِجْرِ", 
                trText: "Ak / Koş!",
                ornek: {
                    ar: "💡 مَعْلُومَة صَرْفِيَّة (النَّاقِص)",
                    tr: "Sarf Notu: Sonu illetli olan Nakıs fiillerin Emir kiplerinde, telaffuz zorluğunu aşmak ve emir formunu belirtmek için sondaki illet harfi (Yâ) tamamen düşer. Bu yüzden 'İcrî' değil 'İcri' şeklinde yazılır ve okunur."
                }
            },
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "💧", 
                arText: "جَرْي", 
                trText: "Cery / Akma, koşma eylemi." 
            }
        },

        // --- 28 Numaralı Kalıp (فَعَلَان - Hareket Bildiren Masdar) ---
        28: { 
            base: { 
                emoji: "⚡", 
                arText: "جَرَيَان", 
                trText: "Cereyan / Akıntı, akım, olayların gelişimi.",
                ornek: [
                    { 
                        ar: "جَرَيَانُ الْأَحْدَاثِ", 
                        tr: "Olayların akışı (cereyan etmesi)." 
                    },
                    {
                        ar: "تَيَّارٌ كَهْرَبَائِيٌّ",
                        tr: "Elektrik akımı (Günlük dilde 'elektrik cereyanı' buradan gelir)."
                    }
                ]
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "⏳", 
                arText: "جَارٍ", 
                trText: "Câri (Cârin) / Akan, geçerli olan, yürürlükteki.",
                ornek: { 
                    ar: "حِسَابٌ جَارٍ", 
                    tr: "Cari hesap (Akan, sürekli işlem gören hesap)." 
                }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "⛵", 
                arText: "جَارِيَة", 
                trText: "Câriye / Akan şey, gemi, hizmetçi kız.",
                ornek: {
                    ar: "💡 مَعْلُومَة دَلَالِيَّة",
                    tr: "Semantik Not: 'Cariye' kelimesi aslen 'akan, hareket eden şey' demektir. Kur'an'da denizde akıp giden gemiler için kullanılır (Hâkka Suresi, 11). Zamanla sosyal hayatta sürekli hareket halinde olan genç kadın hizmetçiler için kullanılmaya başlanmıştır."
                }
            }
        },

        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekân / Zaman) ---
        38: { 
            base: { 
                emoji: "🛤️", 
                arText: "مَجْرًى", 
                trText: "Mecra / Akış yeri, yatak, kanal.",
                ornek: [
                    { 
                        ar: "بِسْمِ اللهِ مَجْرَاهَا وَمُرْسَاهَا", 
                        tr: "Onun yüzüp gitmesi (mecrası/akışı) de durması da Allah'ın adıyladır. (Hûd Suresi, 41)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة تَجْوِيدِيَّة",
                        tr: "İmâle Kuralı: Yukarıdaki ayette geçen 'Mecrâhâ' kelimesi, Asım Kıraatinde Kur'an'da 'İmâle' (Elif ile Yâ arası bir sesle 'Mecrêhâ' şeklinde) okunan tek yerdir."
                    }
                ]
            } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi - Ettirgenlik) ---
        52: { 
            base: { 
                emoji: "⚙️", 
                arText: "أَجْرَى", 
                trText: "Akıttı / Yürüttü / Uyguladı (İcra etti).",
                ornek: { 
                    ar: "أَجْرَى الْمُدِيرُ تَعْدِيلَاتٍ جَدِيدَةً", 
                    tr: "Müdür yeni düzenlemeler uyguladı (icra etti)." 
                }
            },
            cekimi: ["أَجْرَى", "أَجْرَيَا", "أَجْرَوْا", "أَجْرَتْ", "أَجْرَتَا", "أَجْرَيْنَ", "أَجْرَيْتَ", "أَجْرَيْتُمَا", "أَجْرَيْتُمْ", "أَجْرَيْتِ", "أَجْرَيْتُمَا", "أَجْرَيْتُنَّ", "أَجْرَيْتُ", "أَجْرَيْنَا", "أَجْرَيْنَا"]
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı / Nakıs Kuralı) ---
        55: { 
            base: { 
                emoji: "📋", 
                arText: "إِجْرَاء", 
                trText: "İcra / Yürütme, uygulama, işlem, akıtma.",
                ornek: [
                    { 
                        ar: "السُّلْطَةُ التَّنْفِيذِيَّةُ وَالإِجْرَائِيَّةُ", 
                        tr: "Yürütme ve icra yetkisi." 
                    },
                    {
                        ar: "💡 مَعْلُومَة صَرْفِيَّة",
                        tr: "Sarf Notu: Sonu illetli (Nakıs) olan fiiller, 'İf'al' (إِفْعَال) veya 'İstif'al' (اِسْتِفْعَال) bablarının masdarına aktarıldığında sondaki illet harfi daima 'Hemze'ye (ء) dönüşür. Bu yüzden 'İcray' değil 'İcra' (إِجْرَاء) olmuştur."
                    }
                ]
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "📑", 
                arText: "إِجْرَاءَات", 
                trText: "İcraat / İşlemler, uygulamalar, prosedürler.",
                ornek: {
                    ar: "إِجْرَاءَاتٌ أَمْنِيَّةٌ",
                    tr: "Güvenlik önlemleri (işlemleri/icraatları)."
                }
            }
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Mufâ'ale Babı Masdarı - Uyum / Birliktelik) ---
        67: { 
            base: { 
                emoji: "🤝", 
                arText: "مُجَارَاة", 
                trText: "Mücârât / Biriyle birlikte koşma, ayak uydurma, rekabet etme.",
                ornek: { 
                    ar: "مُجَارَاةُ الْعَصْرِ", 
                    tr: "Çağa ayak uydurmak." 
                }
            } 
        }
    },
    
    // ==================================================================
    // 21. D-F-' (د ف ع) KÖKÜ - İtmek / Savuşturmak / Ödemek
    // Bir şeyi kendinden uzaklaştırmayı, itici gücü veya bedel ödemeyi ifade eder. (3. Bab)
    // ==================================================================
    "دفع": {
        // --- 1 Numaralı Kalıp (Mücerret 3. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "✋", 
                arText: "دَفَعَ", 
                trText: "İtti / Savuşturdu / Ödedi.",
                ornek: { 
                    ar: "دَفَعَ ثَمَنَ الْبِضَاعَةِ", 
                    tr: "Malın bedelini (ücretini) ödedi." 
                }
            },
        },

        // --- 6 Numaralı Kalıp (Mücerret 3. Bab Muzari) ---
        6: { 
            base: { 
                emoji: "🛡️", 
                arText: "يَدْفَعُ", 
                trText: "İter / Savuşturur / Öder.",
                ornek: { 
                    ar: "إِنَّ اللهَ يُدَافِعُ عَنِ الَّذِينَ آمَنُوا", 
                    tr: "(Mufâ'ale babından örnek): Şüphesiz Allah, iman edenleri savunur (onlardan kötülüğü def eder). (Hac Suresi, 38)" 
                }
            },
        },

        // --- 7 Numaralı Kalıp (Mücerret 3. Bab Emir) ---
        7: { 
            base: { 
                emoji: "❗", 
                arText: "اِدْفَعْ", 
                trText: "İt / Savuştur / Öde!",
                ornek: [
                    {
                        ar: "اِدْفَعْ بِالَّتِي هِيَ أَحْسَنُ",
                        tr: "Kötülüğü en güzel olan şeyle (iyilikle) savuştur (def et). (Fussilet Suresi, 34)"
                    },
                    {
                        ar: "💡 مَعْلُومَة صَرْفِيَّة",
                        tr: "Sarf Notu: Muzari fiilin orta harfi 'üstün' (يَدْفَعُ) olduğu için, emir kipinin başına gelen yardımcı 'Elif' harfi kural gereği 'esre' (اِدْفَعْ) almıştır."
                    }
                ]
            },
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "🥊", 
                arText: "دَفْع", 
                trText: "Def / İtme, uzaklaştırma, ödeme.",
                ornek: {
                    ar: "دَفْعُ الْبَلَاءِ",
                    tr: "Belayı uzaklaştırma (Def-i bela)."
                }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🔄", 
                arText: "دَفْعَة", 
                trText: "Defa / Bir kere itme, kerede ödeme, sefer.",
                ornek: {
                    ar: "دَفْعَةً وَاحِدَةً",
                    tr: "Tek seferde (bir defada)."
                }
            }
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🚀", 
                arText: "دَافِع", 
                trText: "Dâfi' / İten, ödeyen, savuşturan, motivasyon (itici güç).",
                ornek: { 
                    ar: "مَا هُوَ دَافِعُكَ؟", 
                    tr: "Senin itici gücün (motivasyonun/sebebin) nedir?" 
                }
            }
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "💰", 
                arText: "مَدْفُوع", 
                trText: "Medfû' / İtilmiş, savuşturulmuş, ücreti ödenmiş.",
                ornek: { 
                    ar: "اَلْحِسَابُ مَدْفُوعٌ", 
                    tr: "Hesap ödenmiştir." 
                }
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "💳", 
                arText: "مَدْفُوعَات", 
                trText: "Medfûât / Ödemeler, harcamalar.",
                ornek: {
                    ar: "مِيزَانُ الْمَدْفُوعَاتِ",
                    tr: "Ödemeler dengesi (İktisat terimi)."
                }
            }
        },

        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Alet) ---
        38: { 
            base: { 
                emoji: "💣", 
                arText: "مَدْفَع", 
                trText: "Medfa' / Gülle iten silah, Top.",
                ornek: { 
                    ar: "مَدْفَعُ الْإِفْطَارِ", 
                    tr: "Ramazan'da atılan iftar topu." 
                }
            } 
        },

        // --- 64 Numaralı Kalıp (فَاعَلَ - Mufâ'ale Babı Mazi - Karşılıklı Eylem/Mücadele) ---
        64: { 
            base: { 
                emoji: "🤺", 
                arText: "دَافَعَ", 
                trText: "Savundu (Müdafaa etti).",
                ornek: { 
                    ar: "دَافَعَ عَنْ حُقُوقِهِ", 
                    tr: "Haklarını savundu." 
                }
            },
            cekimi: ["دَافَعَ", "دَافَعَا", "دَافَعُوا", "دَافَعَتْ", "دَافَعَتَا", "دَافَعْنَ", "دَافَعْتَ", "دَافَعْتُمَا", "دَافَعْتُمْ", "دَافَعْتِ", "دَافَعْتُمَا", "دَافَعْتُنَّ", "دَافَعْتُ", "دَافَعْنَا", "دَافَعْنَا"]
        },

        // --- 64 Numaralı Kalıp (مُفَاعَلَة - Mufâ'ale Babı Masdarı) ---
        67: { 
            base: { 
                emoji: "🛡️", 
                arText: "مُدَافَعَة", 
                trText: "Müdafaa / Savunma, koruma, def etme.",
                ornek: { 
                    ar: "وِزَارَةُ الدِّفَاعِ", 
                    tr: "Savunma (Milli Savunma) Bakanlığı." 
                }
            } 
        },

        // --- 68 Numaralı Kalıp (اِنْفَعَلَ - İnfi'âl Babı Mazi - Dönüşlülük / Etkilenme) ---
        71: { 
            base: { 
                emoji: "🌋", 
                arText: "اِنْدَفَعَ", 
                trText: "İtildi / Atıldı / İleri fırladı / Patladı."
            },
            cekimi: ["اِنْدَفَعَ", "اِنْدَفَعَا", "اِنْدَفَعُوا", "اِنْدَفَعَتْ", "اِنْدَفَعَتَا", "اِنْدَفَعْنَ", "اِنْدَفَعْتَ", "اِنْدَفَعْتُمَا", "اِنْدَفَعْتُمْ", "اِنْدَفَعْتِ", "اِنْدَفَعْتُمَا", "اِنْدَفَعْتُنَّ", "اِنْدَفَعْتُ", "اِنْدَفَعْنَا", "اِنْدَفَعْنَا"]
        },

        // --- 71 Numaralı Kalıp (اِنْفِعَال - İnfi'âl Babı Masdarı) ---
        74: { 
            base: { 
                emoji: "💥", 
                arText: "اِنْدِفَاع", 
                trText: "İndifa / Fışkırma, atılım, itiliş, volkan patlaması.",
                ornek: { 
                    ar: "اِنْدِفَاعُ الْبُرْكَانِ", 
                    tr: "Yanardağın patlaması (İndifa etmesi)." 
                }
            } 
        }
    },    

    // ==================================================================
    // 22. Q-T-' (ق ط ع) KÖKÜ - Kesmek / Koparmak / Karar Vermek
    // Bir bütünü ayırmayı, ilişkiyi kesmeyi veya kesin hüküm vermeyi ifade eder. (3. Bab)
    // ==================================================================
    "قطع": {
        // --- 1 Numaralı Kalıp (Mücerret 3. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "✂️", 
                arText: "قَطَعَ", 
                trText: "Kesti / Kopardı / Aştı.",
                ornek: { 
                    ar: "قَطَعَ الشَّجَرَةَ", 
                    tr: "Ağacı kesti." 
                }
            },
            cekimi: ["قَطَعَ", "قَطَعَا", "قَطَعُوا", "قَطَعَتْ", "قَطَعَتَا", "قَطَعْنَ", "قَطَعْتَ", "قَطَعْتُمَا", "قَطَعْتُمْ", "قَطَعْتِ", "قَطَعْتُمَا", "قَطَعْتُنَّ", "قَطَعْتُ", "قَطَعْنَا", "قَطَعْنَا"]
        },

        // --- 6 Numaralı Kalıp (Mücerret 3. Bab Muzari) ---
        6: { 
            base: { 
                emoji: "🔪", 
                arText: "يَقْطَعُ", 
                trText: "Keser / Koparır.",
                ornek: [
                    { 
                        ar: "يَقْطَعُ الشَّارِعَ", 
                        tr: "Cadeyi keser (Karşıdan karşıya geçer)." 
                    },
                    {
                        ar: "وَيَقْطَعُونَ مَا أَمَرَ اللهُ بِهِ أَنْ يُوصَلَ",
                        tr: "Onlar, Allah'ın birleştirilmesini (sürdürülmesini) emrettiği şeyi keserler. (Bakara Suresi, 27)"
                    },
                    {
                        ar: "💡 مَعْلُومَة تَفْسِيرِيَّة",
                        tr: "Tefsir Notu: Ayetteki 'kat' (kesme) eylemi, 'Kat'-ı Rahim' yani akrabalık ve inananlar arasındaki kardeşlik bağlarını koparmak olarak tefsir edilir. Bu eylem, bağları koruma ve sürdürme anlamına gelen 'Sıla-i Rahim' kavramının tam zıttıdır."
                    }
                ]
            },
            cekimi: ["يَقْطَعُ", "يَقْطَعَانِ", "يَقْطَعُونَ", "تَقْطَعُ", "تَقْطَعَانِ", "يَقْطَعْنَ", "تَقْطَعُ", "تَقْطَعَانِ", "تَقْطَعُونَ", "تَقْطَعِينَ", "تَقْطَعَانِ", "تَقْطَعْنَ", "أَقْطَعُ", "نَقْطَعُ", "نَقْطَعُ"]
        },

        // --- 7 Numaralı Kalıp (Mücerret 3. Bab Emir) ---
        7: { 
            base: { 
                emoji: "❗", 
                arText: "اِقْطَعْ", 
                trText: "Kes / Kopar!",
            },
            cekimi: ["اِقْطَعْ", "اِقْطَعَا", "اِقْطَعُوا", "اِقْطَعِي", "اِقْطَعَا", "اِقْطَعْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "🛑", 
                arText: "قَطْع", 
                trText: "Kat' / Kesme, koparma, kesinlik.",
                ornek: {
                    ar: "قَطْعًا",
                    tr: "Kat'iyen / Kesinlikle."
                }
            },
            suggestsPlus: true,
            "يَّة": { 
                emoji: "⚖️", 
                arText: "قَطْعِيَّة", 
                trText: "Katiyet / Kesinlik, şüpheye yer bırakmama.",
            }
        },

        // --- 20 Numaralı Kalıp (فِعْلَة - İsim Formu) ---
        20: { 
            base: { 
                emoji: "🧩", 
                arText: "قِطْعَة", 
                trText: "Kıta / Parça, bölük, kara parçası.",
                ornek: {
                    ar: "قِطْعَةُ حَلْوَى",
                    tr: "Bir parça tatlı."
                }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "📌", 
                arText: "قَاطِع", 
                trText: "Kati (Kâtı') / Kesen, kesin, şüphe götürmez.",
                ornek: { 
                    ar: "دَلِيلٌ قَاطِعٌ", 
                    tr: "Kati (kesin) delil." 
                }
            }
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "🔖", 
                arText: "مَقْطُوع", 
                trText: "Maktu / Kesilmiş, sabit, belirlenmiş.",
                ornek: { 
                    ar: "سِعْرٌ مَقْطُوعٌ", 
                    tr: "Maktu (sabitlenmiş/kesin) fiyat." 
                }
            }
        },

        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekân / Zaman) ---
        38: { 
            base: { 
                emoji: "🎞️", 
                arText: "مَقْطَع", 
                trText: "Makta / Kesit, kesim yeri, video klibi.",
                ornek: [
                    { 
                        ar: "مَقْطَعُ فِيدْيُو", 
                        tr: "Video kesidi (klibi)." 
                    },
                    {
                        ar: "💡 مَعْلُومَة تَجْوِيدِيَّة",
                        tr: "Tecvid Notu: Harflerin çıkış yerlerine (kesişim/duraklama noktalarına) Mahreç dendiği gibi, şiirlerde veya kıraatte durulan yerlere 'Makta' denir."
                    }
                ]
            } 
        },

        // --- 62 Numaralı Kalıp (فَاعَلَ - Mufâ'ale Babı Mazi - Karşılıklı Eylem / İlişki Kesme) ---
        64: { 
            base: { 
                emoji: "🚫", 
                arText: "قَاطَعَ", 
                trText: "Boykot etti / İlişkiyi kesti / Sözünü kesti.",
                ornek: { 
                    ar: "قَاطَعَ الْمُنْتَجَاتِ", 
                    tr: "Ürünleri boykot etti." 
                }
            },
            cekimi: ["قَاطَعَ", "قَاطَعَا", "قَاطَعُوا", "قَاطَعَتْ", "قَاطَعَتَا", "قَاطَعْنَ", "قَاطَعْتَ", "قَاطَعْتُمَا", "قَاطَعْتُمْ", "قَاطَعْتِ", "قَاطَعْتُمَا", "قَاطَعْتُنَّ", "قَاطَعْتُ", "قَاطَعْنَا", "قَاطَعْنَا"]
        },

        // --- 64 Numaralı Kalıp (مُفَاعَلَة - Mufâ'ale Babı Masdarı) ---
        67: { 
            base: { 
                emoji: "🛑", 
                arText: "مُقَاطَعَة", 
                trText: "Mukataa / Boykot, söz kesme, ilişki koparma.",
                ornek: {
                    ar: "💡 مَعْلُومَة تَارِيخِيَّة",
                    tr: "Tarih Notu: Osmanlı Devleti'nde devlete ait bir gelirin (verginin) toplanma hakkının belirli bir bedel karşılığında (kesin ve maktu olarak) şahıslara bırakılması sistemine 'Mukataa Sistemi' denirdi."
                }
            } 
        },

        // --- 68 Numaralı Kalıp (اِنْفَعَلَ - İnfi'âl Babı Mazi - Dönüşlülük / Edilgenlik) ---
        71: { 
            base: { 
                emoji: "🔌", 
                arText: "اِنْقَطَعَ", 
                trText: "Kesildi / Koptu."
            },
        },

        // --- 71 Numaralı Kalıp (اِنْفِعَال - İnfi'âl Babı Masdarı) ---
        74: { 
            base: { 
                emoji: "⚡", 
                arText: "اِنْقِطَاع", 
                trText: "İnkıta / Kesilme, ara verme, kopma.",
                ornek: { 
                    ar: "اِنْقِطَاعُ الْكَهْرَبَاءِ", 
                    tr: "Elektrik kesintisi (İnkıta etmesi)." 
                }
            } 
        }
    },

    // ==================================================================
    // 23. R-S-M (ر س م) KÖKÜ - Çizmek / Belirlemek / İz Bırakmak
    // Bir şeyin sınırlarını çizmeyi, kurallarını belirlemeyi veya şekillendirmeyi ifade eder. (1. Bab)
    // ==================================================================
    "رسم": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "✏️", 
                arText: "رَسَمَ", 
                trText: "Çizdi / Resmetti / Kural koydu.",
                ornek: { 
                    ar: "رَسَمَ خُطَّةً جَدِيدَةً", 
                    tr: "Yeni bir plan çizdi (belirledi)." 
                }
            },
            cekimi: ["رَسَمَ", "رَسَمَا", "رَسَمُوا", "رَسَمَتْ", "رَسَمَتَا", "رَسَمْنَ", "رَسَمْتَ", "رَسَمْتُمَا", "رَسَمْتُمْ", "رَسَمْتِ", "رَسَمْتُمَا", "رَسَمْتُنَّ", "رَسَمْتُ", "رَسَمْنَا", "رَسَمْنَا"]
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "🎨", 
                arText: "يَرْسُمُ", 
                trText: "Çizer / Resmeder.",
                ornek: { 
                    ar: "الطِّفْلُ يَرْسُمُ شَجَرَةً", 
                    tr: "Çocuk bir ağaç çiziyor." 
                }
            },
            cekimi: ["يَرْسُمُ", "يَرْسُمَانِ", "يَرْسُمُونَ", "تَرْسُمُ", "تَرْسُمَانِ", "يَرْسُمْنَ", "تَرْسُمُ", "تَرْسُمَانِ", "تَرْسُمُونَ", "تَرْسُمِينَ", "تَرْسُمَانِ", "تَرْسُمْنَ", "أَرْسُمُ", "نَرْسُمُ", "نَرْسُمُ"]
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { 
                emoji: "❗", 
                arText: "اُرْسُمْ", 
                trText: "Çiz / Resmet!",
                ornek: {
                    ar: "💡 مَعْلُومَة صَرْفِيَّة",
                    tr: "Sarf Notu: Muzari fiilin orta harfi 'ötre' (يَرْسُمُ) olduğu için, emir kipinin başına gelen yardımcı 'Elif' harfi de ses uyumu gereği kural olarak 'ötre' (اُرْسُمْ) almıştır."
                }
            },
            cekimi: ["اُرْسُمْ", "اُرْسُمَا", "اُرْسُمُوا", "اُرْسُمِي", "اُرْسُمَا", "اُرْسُمْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "🖼️", 
                arText: "رَسْم", 
                trText: "Resm / Çizim, resim, vergi, resmiyet.",
                ornek: [
                    {
                        ar: "رَسْمِيٌّ",
                        tr: "Resmî (Devlete ait, kuralları çizilmiş olan)."
                    },
                    {
                        ar: "💡 مَعْلُومَة دَلَالِيَّة",
                        tr: "Semantik Not: 'Resm' kelimesi sınır çizmektir ve iki kola ayrılır ➔ 1. Sanatsal Kol (Fiziksel Çizim): Sanatçı tuval üzerine figürün sınırlarını çizdiğinde buna 'Resim', yapana 'Ressam' deriz. 2. Hukuki Kol (Mecazi Çizim): Devlet, kuralların çerçevesini ve sınırlarını çizdiğinde buna 'Resmî', bu kurallara harfiyen uyulmasına ise 'Resmiyet' deriz."
                    }
                ]
            },
            suggestsPlus: true,
            "يَّة": { 
                emoji: "👔", 
                arText: "رَسْمِيَّة", 
                trText: "Resmiyet / Kurallara uygunluk, ciddiyet."
            }
        },

        // --- 43 Numaralı Kalıp (فُعُول - Cem-i Mükesser / Çoğul Masdar) ---
        43: { 
            base: { 
                emoji: "📜", 
                arText: "رُسُوم", 
                trText: "Rüsûm / Resimler, vergiler, harçlar, çizgi filmler.",
                ornek: {
                    ar: "رُسُومٌ مُتَحَرِّكَةٌ",
                    tr: "Hareketli resimler (Çizgi film)."
                }
            } 
        },

        // --- 34 Numaralı Kalıp (فَعَّال - Mübalağalı İsm-i Fâil - Meslek Bildirir) ---
        34: { 
            base: { 
                emoji: "👨‍🎨", 
                arText: "رَسَّام", 
                trText: "Ressam / Çok çizen, mesleği çizim/resim olan kişi."
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "📝", 
                arText: "مَرْسُوم", 
                trText: "Mersum / Çizilmiş şey, ferman, kararname.",
                ornek: {
                    ar: "مَرْسُومٌ رِئَاسِيٌّ",
                    tr: "Cumhurbaşkanlığı Kararnamesi (Sınırları kesin olarak çizilmiş yasa)."
                }
            } 
        },

       // --- 38 Numaralı Kalıp (مَفَاعِل - Cem-i Mükesser / Kırık Çoğul) ---
        38: { 
            base: { 
                emoji: "🎪", 
                arText: "مَرَاسِم", 
                trText: "Merasim / Törenler, kuralları önceden çizilmiş ritüeller ve protokoller.",
                ornek: [
                    {
                        ar: "مَرَاسِمُ الزَّفَافِ",
                        tr: "Düğün merasimi (töreni)."
                    },
                    {
                        ar: "💡 مَعْلُومَة صَرْفِيَّة",
                        tr: "Sarf Notu: 'Merasim' kelimesi, 'Mersem' (مَرْسَم - resim çizilen yer, kural, âdet) kelimesinin kırık çoğuludur (Cem-i Mükesser). Türkçede tekil gibi kullanılsa da köken olarak 'kuralları önceden çizilmiş törenler/ritüeller bütünü' anlamına gelir."
                    }
                ]
            } 
        }
     },

     // ==================================================================
    // 24. H-B-B (ح ب ب) KÖKÜ - Sevmek / Hoşlanmak
    // Sevgi duymayı ve kalben bağlanmayı ifade eder. (Muzaaf Fiil)
    // ==================================================================
    "حبب": {
        

        // --- 21 Numaralı Kalıp (فُعْل - Mücerret Masdar) ---
        21: { 
            base: { 
                emoji: "💞", 
                arText: "حُبّ", 
                trText: "Hubb / Sevgi, aşk, hoşlanma.",
                ornek: { 
                    ar: "حُبُّ الْوَطَنِ", 
                    tr: "Vatan sevgisi." 
                }
            }
        },

        // --- 35 Numaralı Kalıp (فَعِيل - Sıfat-ı Müşebbehe / Kalıcı Özellik) ---
        35: { 
            base: { 
                emoji: "🌹", 
                arText: "حَبِيب", 
                trText: "Habîb / Seven, sevilen, dost, sevgili.",
                ornek: { 
                    ar: "حَبِيبُ اللهِ", 
                    tr: "Allah'ın sevgilisi (Hz. Muhammed için kullanılır)." 
                }
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "🥰", 
                arText: "مَحْبُوب", 
                trText: "Mahbûb / Sevilen, popüler, gözde.",
                ornek: { 
                    ar: "هُوَ شَخْصٌ مَحْبُوبٌ جِدًّا", 
                    tr: "O, çok sevilen bir kişidir." 
                }
            }
        },

        // --- 38 Numaralı Kalıp (مَفْعَلَة - Mimli Masdar) ---
        38: { 
            base: { 
                emoji: "☕", 
                arText: "مَحَبَّة", 
                trText: "Mahabbet (Muhabbet) / Sevgi, dostça sohbet, bağlılık.",
                ornek: {
                    ar: "💡 مَعْلُومَة دَلَالِيَّة",
                    tr: "Semantik Not: Kelimenin aslı 'Mahabbet' (مَحَبَّة) şeklinde, مَفْعَلَة vezninde mimli masdardır. Ancak Türkçeye geçerken 'Muhabbet' olarak telaffuz edilmeye başlanmıştır. Sadece 'sevgi' değil, 'sevgiyle yapılan dostane sohbet' anlamına da evrilmiştir."
                }
            } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi - En Sık Kullanılan Form) ---
        52: { 
            base: { 
                emoji: "💖", 
                arText: "أَحَبَّ", 
                trText: "Sevdi (Günlük dilde ve Kur'an'da en çok kullanılan formdur).",
                ornek: { 
                    ar: "يُحِبُّهُمْ وَيُحِبُّونَهُ", 
                    tr: "Allah onları sever, onlar da O'nu severler. (Mâide Suresi, 54)" 
                }
            },
            // İf'al babında şeddenin nasıl kırıldığına (أَحْبَبْتُ) dikkat!
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Tef'îl Babı Mazi - Ettirgenlik) ---
        58: { 
            base: { 
                emoji: "🎁", 
                arText: "حَبَّبَ", 
                trText: "Sevdirdi.",
                ornek: { 
                    ar: "وَلَكِنَّ اللهَ حَبَّبَ إِلَيْكُمُ الْإِيمَانَ", 
                    tr: "Fakat Allah, size imanı sevdirdi... (Hucurât Suresi, 7)" 
                }
            },
        }
    },

// ==================================================================
    // 25. S-H-B (ص ح ب) KÖKÜ - Arkadaş Olmak / Eşlik Etmek
    // Birine yoldaşlık yapmayı, beraberinde olmayı ifade eder. (4. Bab)
    // ==================================================================
    "صحب": {
        // --- 8 Numaralı Kalıp (Mücerret 4. Bab Mazi) ---
        8: { 
            base: { 
                emoji: "🚶‍♂️", 
                arText: "صَحِبَ", 
                trText: "Arkadaş oldu / Eşlik etti.",
                ornek: { 
                    ar: "صَحِبَ أَبَاهُ إِلَى السُّوقِ", 
                    tr: "Babasına çarşıya kadar eşlik etti." 
                }
            },
        },

        // --- 9 Numaralı Kalıp (Mücerret 4. Bab Muzari) ---
        9: { 
            base: { 
                emoji: "🤝", 
                arText: "يَصْحَبُ", 
                trText: "Arkadaş olur / Eşlik eder.",
            },
        },

        // --- 10 Numaralı Kalıp (Mücerret 4. Bab Emir) ---
        10: { 
            base: { 
                emoji: "❗", 
                arText: "اِصْحَبْ", 
                trText: "Arkadaş ol / Eşlik et!",
                ornek: {
                    ar: "وَصَاحِبْهُمَا فِي الدُّنْيَا مَعْرُوفًا 💡 (مَعْلُومَة تَفْسِيرِيَّة)",
                    tr: "Onlara (anne-babana) dünyada iyi davran (güzellikle eşlik/arkadaşlık et). (Lokman Suresi, 15) ➔ Tefsir Notu: Ayette 3. Bab olan Mufa'ale babı (صَاحِبْ) kullanılarak, anne-babaya karşılıklı bir arkadaş ve yoldaş gibi iyi davranılması emredilmiştir."
                }
            },
        },

        // --- 21 Numaralı Kalıp (فُعْلَة - Mücerret Masdar) ---
        21: { 
            base: { 
                emoji: "☕", 
                arText: "صُحْبَة", 
                trText: "Suhbet (Sohbet) / Arkadaşlık, yoldaşlık, beraberlik.",
                ornek: {
                    ar: "💡 مَعْلُومَة دَلَالِيَّة",
                    tr: "Semantik Not: 'Sohbet' kelimesi Arapçada 'arkadaşlık/yoldaşlık etmek' demektir. Türkçeye geçerken 'arkadaşça konuşmak, muhabbet etmek' anlamına evrilmiştir."
                }
            }
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🧑‍🤝‍🧑", 
                arText: "صَاحِب", 
                trText: "Sahip (Sâhib) / Arkadaş, yoldaş, eşlik eden.",
                ornek: [
                    { 
                        ar: "يَا صَاحِبَيِ السِّجْنِ", 
                        tr: "Ey zindan arkadaşlarım (yoldaşlarım)! (Yusuf Suresi, 39)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة دَلَالِيَّة",
                        tr: "Semantik Not: 'Sahip' Arapçada malik/kral değil, 'arkadaş' demektir. Türkçede 'mal sahibi' (mala arkadaş olan, maldan ayrılmayan) şeklinde kullanıla kullanıla mülkiyet bildiren bir kavrama dönüşmüştür."
                    }
                ]
            }
        },

        // --- 41 Numaralı Kalıp (أَفْعَال - Cem-i Mükesser / Kırık Çoğul) ---
        41: { 
            base: { 
                emoji: "🌟", 
                arText: "أَصْحَاب", 
                trText: "Ashâb / Arkadaşlar, yoldaşlar (Sahip kelimesinin kırık çoğuludur).",
                ornek: {
                    ar: "أَصْحَابُ الْكَهْفِ",
                    tr: "Mağara arkadaşları (Ashab-ı Kehf)."
                }
            }
        },

        // --- (Numarayı فَعَالَة kalıbına göre ayarla) (فَعَالَة - Masdar / İsm-i Cem' - Topluluk İsmi) ---
        22: { 
            base: { 
                emoji: "✨", 
                arText: "صَحَابَة", 
                trText: "Sahâbe / Hz. Peygamber'in arkadaşları (yoldaşlar topluluğu).",
                ornek: [
                    { 
                        ar: "اَلصَّحَابَةُ الْكِرَامُ", 
                        tr: "Değerli sahabeler." 
                    },
                    {
                        ar: "💡 مَعْلُومَة صَرْفِيَّة",
                        tr: "Sarf Notu: 'Sahâbe' (صَحَابَة) kelimesi aslen 'Fa'âle' (فَعَالَة) kalıbında bir masdardır. Ancak Arapçada bir gruba (topluluğa) işaret etmek için 'İsm-i Cem' (Topluluk İsmi) olarak kullanılmıştır."
                    }
                ]
            } 
        },
        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "🧳", 
                arText: "مَصْحُوب", 
                trText: "Mashûb / Eşliğinde olan, beraberinde olan.",
                ornek: { 
                    ar: "مَصْحُوبًا بِالسَّلَامَةِ", 
                    tr: "Selametle (esenlik eşliğinde) git." 
                }
            }
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Mufâ'ale Babı Masdarı - Karşılıklı Eylem) ---
        67: { 
            base: { 
                emoji: "🤝", 
                arText: "مُصَاحَبَة", 
                trText: "Musâhabe / Karşılıklı arkadaşlık etme, yoldaşlık yapma.",
                ornek: { 
                    ar: "مُصَاحَبَةُ الْأَخْيَارِ", 
                    tr: "İyi insanlarla arkadaşlık (musahabe) etmek." 
                }
            } 
        },

        // --- 69 Numaralı Kalıp (مُفَاعِل - Mufâ'ale Babı İsm-i Fâil - Eylemi Yapan) ---
        69: { 
            base: { 
                emoji: "🗣️", 
                arText: "مُصَاحِب", 
                trText: "Musahip / Birlikte sohbet edilen arkadaş, yoldaş.",
                ornek: { 
                    ar: "هُوَ مُصَاحِبِي فِي السَّفَرِ", 
                    tr: "O, yolculukta benim yoldaşımdır (musahibimdir)." 
                }
            } 
        }
    },

    // ==================================================================
    // 26. H-D-M (خ د م) KÖKÜ - Hizmet Etmek / Çalışmak
    // Birinin işini görmeyi, ona yardımcı olmayı veya bir işte çalıştırılmayı ifade eder. (2. Bab)
    // ==================================================================
    "خدم": {
        // --- 1 Numaralı Kalıp (Mücerret 2. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🧹", 
                arText: "خَدَمَ", 
                trText: "Hizmet etti / İlgilendi / Çalıştı.",
                ornek: { 
                    ar: "خَدَمَ الشَّعْبَ بِمَحَبَّةٍ", 
                    tr: "Halka sevgiyle hizmet etti." 
                }
            },
        },

        // --- 4 Numaralı Kalıp (Mücerret 2. Bab Muzari) ---
        4: { 
            base: { 
                emoji: "🤝", 
                arText: "يَخْدِمُ", 
                trText: "Hizmet eder.",
                ornek: { 
                    ar: "كَيْفَ يُمْكِنُنِي أَنْ أَخْدِمَكَ؟", 
                    tr: "Sana nasıl hizmet edebilirim? (Size nasıl yardımcı olabilirim?)" 
                }
            },
        },

        // --- 5 Numaralı Kalıp (Mücerret 2. Bab Emir) ---
        5: { 
            base: { 
                emoji: "❗", 
                arText: "اِخْدِمْ", 
                trText: "Hizmet et!",
            },
        },

        // --- 20 Numaralı Kalıp (فِعْلَة - İsim/Masdar Formu) ---
        20: { 
            base: { 
                emoji: "🛎️", 
                arText: "خِدْمَة", 
                trText: "Hizmet / Görev, servis, yardım.",
                ornek: {
                    ar: "خِدْمَةُ الْعُمَلَاءِ",
                    tr: "Müşteri hizmetleri (Modern Arapçada çok sık kullanılır)."
                }
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "⚙️", 
                arText: "خَدَمَات", 
                trText: "Hizmetler / Servisler."
            }
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🤵", 
                arText: "خَادِم", 
                trText: "Hâdim / Hizmet eden, hizmetçi.",
                ornek: { 
                    ar: "خَادِمُ الْحَرَمَيْنِ الشَّرِيفَيْنِ", 
                    tr: "İki şerefli haremin (Mekke ve Medine'nin) hizmetkârı (Tarihi bir unvan)." 
                }
            }
        },

        // --- 47 Numaralı Kalıp (فَعَل - İsm-i Cem' / Topluluk İsmi - Çoğul) ---
        47: { 
               base: { 
                emoji: "👥", 
                arText: "خَدَمَة", 
                trText: "Hademe / Hizmet edenler, görevliler (Hâdim kelimesinin kırık çoğuludur).",
                ornek: {
                    ar: "💡 مَعْلُومَة دَلَالِيَّة",
                    tr: "Semantik Not: 'Hademe' Arapçada 'Hâdim' (hizmet eden) kelimesinin çoğuludur (Tıpkı Tâlib -> Talebe gibi). Ancak Türkçeye geçerken anlam kaymasına uğramış ve kurumlarda çalışan görevliler için tekil bir kelimeymiş gibi kullanılmaya başlanmıştır."
                }
            }
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "👑", 
                arText: "مَخْدُوم", 
                trText: "Mahdûm / Kendisine hizmet edilen kişi, efendi.",
                ornek: {
                    ar: "💡 مَعْلُومَة تَارِيخِيَّة",
                    tr: "Tarih Notu: Osmanlı'da babalarından dolayı kendilerine saygı duyulan ve hizmet edilen erkek çocuklar (oğullar) için kibar bir ifade olarak 'Mahdum' kelimesi kullanılırdı (Örn: Mahdumunuz nasıl?)."
                }
            }
        },

        // --- 102 Numaralı Kalıp (اِسْتَفْعَلَ - İstif'âl Babı Mazi - İstek / Talep / Dönüşüm) ---
        100: { 
            base: { 
                emoji: "🏢", 
                arText: "اِسْتَخْدَمَ", 
                trText: "İstihdam etti / İşe aldı / Kullandı.",
                ornek: { 
                    ar: "اِسْتَخْدَمَ الشَّرِكَةُ عُمَّالًا جُدُدًا", 
                    tr: "Şirket yeni işçiler istihdam etti (işe aldı)." 
                }
            },
        },

        // --- 100 Numaralı Kalıp (اِسْتِفْعَال - İstif'âl Babı Masdarı) ---
        103: { 
            base: { 
                emoji: "💼", 
                arText: "اِسْتِخْدَام", 
                trText: "İstihdam / Birini bir hizmette kullanma, işe alma, kullanım.",
                ornek: { 
                    ar: "دَلِيلُ الِاسْتِخْدَامِ", 
                    tr: "Kullanım kılavuzu." 
                }
            } 
        },

        // --- 103 Numaralı Kalıp (مُسْتَفْعَل - İstif'âl Babı İsm-i Mef'ûl - Etkilenen) ---
        105: { 
            base: { 
                emoji: "👷", 
                arText: "مُسْتَخْدَم", 
                trText: "Müstahdem / Hizmette kullanılan, çalıştırılan, çalışan personel.",
                ornek: {
                    ar: "💡 مَعْلُومَة دَلَالِيَّة",
                    tr: "Semantik Not: 'Müstahdem' kelimesi Arapçada genel anlamda 'çalışan/personel' demektir. Türkçede ise zamanla anlam daralmasına uğrayarak sadece 'odacı, temizlik görevlisi' anlamında kullanılmaya başlanmıştır."
                }
            } 
        }
    },

    // ==================================================================
    // 27. C-M-L (ج م ل) KÖKÜ - Güzel Olmak / Bütünleştirmek / Toplamak
    // Parçaları bir araya getirip bütün oluşturmayı ve estetik güzelliği ifade eder. 
    // ==================================================================
    "جمل": {
        // --- 11 Numaralı Kalıp (Mücerret Mazi - 5. Bab / Güzellik Bildirir) ---
        11: { 
            base: { 
                emoji: "✨", 
                arText: "جَمُلَ", 
                trText: "Güzel oldu / Bütünleşti / Toplandı.",
                ornek: [
                    { 
                        ar: "جَمُلَ خُلُقُهُ", 
                        tr: "Ahlakı güzel oldu." 
                    },
                    {
                        ar: "💡 مَعْلُومَة",
                        tr: "Türkçedeki Kullanımı: Doğrudan mazi fiil olarak geçmese de, bu eylemin ruhu 'Cemil' ve 'Cemal' isimleriyle dilimize yerleşmiştir."
                    }
                ]
            }
        },

        // --- 12 Numaralı Kalıp (Mücerret Muzari) ---
        12: { 
            base: { 
                emoji: "🌟", 
                arText: "يَجْمُلُ", 
                trText: "Güzel olur / Yakışır / Bütünleşir.",
                ornek: {
                    ar: "يَجْمُلُ بِكَ أَنْ تَصْبِرَ",
                    tr: "Sabretmek sana yakışır (sende güzel durur)."
                }
            }
        },

        // --- 17 Numaralı Kalıp (فَعَل - İsim / İsmi Cins) ---
        17: { 
            base: { 
                emoji: "🐪", 
                arText: "جَمَل", 
                trText: "Cemel / Erkek deve.",
                ornek: [
                    {
                        ar: "لَا نَاقَةَ لِي فِيهَا وَلَا جَمَلَ (مَثَلٌ عَرَبِيٌّ)",
                        tr: "Arap Atasözü: 'Benim bu işte ne dişi devem var ne de erkek devem!' (Türkçedeki 'Bu işte hiçbir çıkarım/ilişkim yok' manasında kullanılır)."
                    },
                    {
                        ar: "💡 مَعْلُومَة ثَقَافِيَّة",
                        tr: "Kültür Notu: Çöl şartlarına kusursuz bir uyumla yaratıldığı ve bedeviler için en 'güzel/bütün' varlık olduğu için deveye 'Cemel' denmiştir. İslam tarihindeki meşhur 'Cemel Vakası' (Deve Olayı) adını Hz. Aişe'nin devesinden alır."
                    }
                ]
            }
        },

        // --- 21 Numaralı Kalıp (فُعْلَة - İsim Formu) ---
        21: { 
            base: { 
                emoji: "🧩", 
                arText: "جُمْلَة", 
                trText: "Cümle / Bütün, toplam, kelime grubu.",
                ornek: [
                    { 
                        ar: "جُمْلَةٌ مُفِيدَةٌ", 
                        tr: "Anlamlı cümle." 
                    },
                    {
                        ar: "أَخَذْتُ الْبِضَاعَةَ جُمْلَةً",
                        tr: "Malı toptan (bütün olarak) aldım."
                    },
                    {
                        ar: "💡 مَعْلُومَة دَلَالِيَّة وَاشْتِقَاقِيَّة",
                        tr: "Semantik ve Etimolojik Not: C-M-L kökünün temel anlamı 'dağınık parçaları birleştirip eksiksiz bir bütün oluşturmaktır'. Türkçede 'cümle alem' veya 'cümleten' derken, kelimenin 'hepsi/tamamı' olan orijinal Arapça manasını kullanırız."
                    }
                ]
            }
        },

        // --- 22 Numaralı Kalıp (فَعَال - Masdar / İsim) ---
        22: { 
            base: { 
                emoji: "🪞", 
                arText: "جَمَال", 
                trText: "Cemâl / Güzellik (özellikle yüz, ruh ve görünüm güzelliği).",
                ornek: [
                    { 
                        ar: "إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ", 
                        tr: "Şüphesiz ki Allah güzeldir, güzelliği (cemali) sever. (Hadis-i Şerif)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة",
                        tr: "Türkçedeki Kullanımı: Özellikle tasavvufta ve divan edebiyatında 'Hüsn ü Cemal' (kusursuz güzellik) şeklinde, ilahi ve fiziksel güzelliği ifade etmek için isim olarak çok sık kullanılır."
                    }
                ]
            } 
        },

        // --- 35 Numaralı Kalıp (فَعِيل - Sıfat-ı Müşebbehe / Kalıcı Özellik) ---
        35: { 
            base: { 
                emoji: "🌹", 
                arText: "جَمِيل", 
                trText: "Cemîl / Güzel, estetik, hoşa giden.",
                ornek: [
                    { 
                        ar: "فَصَبْرٌ جَمِيلٌ", 
                        tr: "Artık (bana düşen) güzel bir sabırdır. (Yusuf Suresi, 18)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة",
                        tr: "Türkçedeki Kullanımı: Erkek ismi olarak (Cemil) ve kadın ismi olarak (Cemile) dilimizde oldukça yaygındır."
                    }
                ]
            } 
        },

       // --- 50 Numaralı Kalıp (أَفْعَل - İsm-i Tafdîl / En Üstünlük Derecesi) ---
        50: { 
            base: { 
                emoji: "🏆", 
                arText: "أَجْمَل", 
                trText: "Ecmel / En güzel, daha güzel.",
                ornek: [
                    {
                        ar: "هُوَ أَجْمَلُ مِنْكَ",
                        tr: "O, senden daha güzeldir."
                    },
                     {
                        ar: "💡 مَعْلُومَة",
                        tr: "Türkçedeki Kullanımı: 'En güzel, kusursuz ve eksiksiz' anlamlarına gelen 'Ecmel', dilimizde zarif ve estetik bir kişi ismi (çoğunlukla kız ismi) olarak kullanılmaktadır."
                    },
                    {
                        ar: "💡 مَعْلُومَة صَرْفِيَّة",
                        tr: "Sarf Notu: 'Ecmel-u' (أَجْمَلُ) kelimesi İsm-i Tafdîl'dir (en güzel). İf'âl babının mazi fiili olan 'Ecmel-e' (أَجْمَلَ - özetledi) ile yazılışı aynı, ancak harekesi ve manası tamamen farklıdır."
                    }
                    
                ]
            }
        },
        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi - Geçişlilik/Ettirgenlik) ---
        52: { 
            base: { 
                emoji: "📦", 
                arText: "أَجْمَلَ", 
                trText: "İcmal etti / Özetledi, toparladı, genel hatlarıyla verdi.",
                ornek: [
                    {
                        ar: "💡 مَعْلُومَة",
                        tr: "Türkçedeki Kullanımı: Özellikle eski bürokraside ve muhasebede hesapları veya konuları toparlayıp özetlemeye 'icmal etmek' denirdi."
                    }
                ]
            },
            cekimi: ["أَجْمَلَ", "أَجْمَلَا", "أَجْمَلُوا", "أَجْمَلَتْ", "أَجْمَلَتَا", "أَجْمَلْنَ", "أَجْمَلْتَ", "أَجْمَلْتُمَا", "أَجْمَلْتُمْ", "أَجْمَلْتِ", "أَجْمَلْتُمَا", "أَجْمَلْتُنَّ", "أَجْمَلْتُ", "أَجْمَلْنَا", "أَجْمَلْنَا"]
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: { 
            base: { 
                emoji: "🔄", 
                arText: "يُجْمِلُ", 
                trText: "İcmal eder / Özetler, toparlar."
            },
            cekimi: ["يُجْمِلُ", "يُجْمِلَانِ", "يُجْمِلُونَ", "تُجْمِلُ", "تُجْمِلَانِ", "يُجْمِلْنَ", "تُجْمِلُ", "تُجْمِلَانِ", "تُجْمِلُونَ", "تُجْمِلِينَ", "تُجْمِلَانِ", "تُجْمِلْنَ", "أُجْمِلُ", "نُجْمِلُ", "نُجْمِلُ"]
        },

        // --- 54 Numaralı Kalıp (أَفْعِلْ - İf'âl Babı Emir) ---
        54: { 
            base: { 
                emoji: "❗", 
                arText: "أَجْمِلْ", 
                trText: "İcmal et! / Özetle, (davranışta) ölçülü ol!",
                ornek: [
                    {
                        ar: "فَأَجْمِلُوا فِي الطَّلَبِ",
                        tr: "(Rızkı) ararken güzel/ölçülü davranın (hırsa kapılmayın). (Hadis-i Şerif - İbn Mâce)"
                    }
                ]
            },
            cekimi: ["أَجْمِلْ", "أَجْمِلَا", "أَجْمِلُوا", "أَجْمِلِي", "أَجْمِلَا", "أَجْمِلْنَ"]
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "📋", 
                arText: "إِجْمَال", 
                trText: "İcmâl / Özet, ana hatlarıyla toparlama, toplam.",
                ornek: [
                    { 
                        ar: "إِجْمَالًا لِمَا سَبَقَ", 
                        tr: "Öncekilerin bir özeti (icmali) olarak." 
                    },
                    {
                        ar: "💡 مَعْلُومَة",
                        tr: "Türkçedeki Kullanımı: Muhasebede ana hesapların özetlendiği tablolara 'İcmal tablosu' veya 'İcmal defteri' adı verilir."
                    }
                ]
            } 
        },
        // --- 57 Numaralı Kalıp (مُفْعَل - İf'âl Babı İsm-i Mef'ûl - Etkilenen) ---
        57: { 
            base: { 
                emoji: "📝", 
                arText: "مُجْمَل", 
                trText: "Mücmel / Özetlenmiş, detaya girilmeden ana hatlarıyla verilmiş bütün.",
                ornek: [
                    { 
                        ar: "مُجْمَلُ الْكَلَامِ", 
                        tr: "Sözün özü (Mücmeli)." 
                    },
                    {
                        ar: "💡 مَعْلُومَة أُصُولِيَّة",
                        tr: "Fıkıh Usulü Notu: Kur'an'da manası kapalı olan, ancak başka ayetler veya hadislerle detaylandırılan (Mufassal) kısa ve özet ayetlere 'Mücmel ayetler' denir."
                    }
                ]
            } 
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Mufâ'ale Babı Masdarı - Karşılıklı Eylem) ---
        67: { 
            base: { 
                emoji: "🤝", 
                arText: "مُجَامَلَة", 
                trText: "Mücâmile (Mücamele) / İltifat, nezaket, birbirine güzel davranma.",
                ornek: [
                    { 
                        ar: "عِبَارَاتُ الْمُجَامَلَةِ", 
                        tr: "Nezaket ve iltifat ifadeleri." 
                    },
                    {
                        ar: "مُجَامَلَةً لَهُ قَبِلْتُ الدَّعْوَةَ",
                        tr: "Ona bir nezaket (ayıp olmasın) olsun diye daveti kabul ettim."
                    }
                ]
            } 
        }
    },

    // ==================================================================
    // 28. 'A-W-D (ع و د) KÖKÜ - Dönmek / Tekrarlamak / Alışmak
    // Bir yere geri dönmeyi, bir işi tekrarlamayı ve tekrarlana tekrarlana alışkanlık haline gelmesini ifade eder. (Ecvef Fiil)
    // ==================================================================
    "عود": {
        // --- 1 Numaralı Kalıp (Mücerret Mazi - 1. Bab - Ecvef) ---
        1: { 
            base: { 
                emoji: "↩️", 
                arText: "عَادَ", 
                trText: "Döndü / Geri geldi.",
                ornek: [
                    { 
                        ar: "عَادَ إِلَى بَيْتِهِ", 
                        tr: "Evine döndü." 
                    },
                    {
                        ar: "💡 مَعْلُومَة صَرْفِيَّة (الْأَجْوَف)",
                        tr: "Sarf Notu: Bu bir 'Ecvef' (ortası illetli) fiildir. Kökündeki 'Vav' (و) harfi mazide 'Elif'e (ا) dönüşür. Çekim tablosunda 'Biz, Siz, Onlar (kadınlar)' derken iki sessiz harf yan yana gelemeyeceği için ortadaki illet harfi tamamen düşer (Örn: عُدْتُ - Ud-tu / Döndüm)."
                    }
                ]
            },
        },

        // --- 2 Numaralı Kalıp (Mücerret Muzari) ---
        2: { 
            base: { 
                emoji: "🔄", 
                trText: "Döner / Geri gelir.",
                ornek: {
                    ar: "يَعُودُ إِلَى وَطَنِهِ",
                    tr: "Vatanına döner."
                }
            },
        },

        // --- 3 Numaralı Kalıp (Mücerret Emir) ---
        3: { 
            base: { 
                emoji: "❗", 
                trText: "Dön! / Geri gel!",
                ornek: {
                    ar: "عُدْ إِلَى رَبِّكَ",
                    tr: "Rabbine dön!"
                }
            },
        },

        // --- 19 Numaralı Kalıp (فَعْلَة / فَوْعَلَة - İsim Formu) ---
        19: { 
            base: { 
                emoji: "🚶‍♂️", 
                arText: "عَوْدَة",
                trText: "Avdet / Dönüş, geri gelme.",
                ornek: [
                    { 
                        ar: "رِحْلَةُ الْعَوْدَةِ", 
                        tr: "Dönüş yolculuğu." 
                    },
                    {
                        ar: "💡 مَعْلُومَة",
                        tr: "Türkçedeki Kullanımı: Özellikle edebi dilde veya askeri terminolojide 'Avdet etmek' (geri dönmek) şeklinde sıklıkla kullanılır."
                    }
                ]
            }
        },

        // --- 17 Numaralı Kalıp (فَعَلَة - İsim Formu) ---
        17: { 
            base: { 
                emoji: "🔁", 
                arText: "عَادَة", 
                trText: "Âdet / Alışkanlık, gelenek, görenek.",
                ornek: [
                    { 
                        ar: "عَادَةٌ حَسَنَةٌ", 
                        tr: "Güzel bir alışkanlık (âdet)." 
                    },
                    {
                        ar: "💡 مَعْلُومَة دَلَالِيَّة",
                        tr: "Semantik Not: 'Dönmek' (Avdet) ile 'Âdet' aynı köktendir. Çünkü bir eyleme sürekli geri dönerseniz ve onu tekrarlarsanız, o şey sizin 'alışkanlığınız' (âdetiniz) haline gelir. Türkçedeki 'âdet yerini bulsun' veya 'âdetler' kelimeleri tamamen bu mantıktan doğar."
                    }
                ]
            }
        },

        // --- 21 Numaralı Kalıp (فُعْل - İsim / İsmi Cins) ---
        21: { 
            base: { 
                emoji: "🎸", 
                arText: "عُود", 
                trText: "Ûd / Ağaç dalı, tahta, ud çalgısı.",
                ornek: [
                    {
                        ar: "💡 مَعْلُومَة ثَقَافِيَّة",
                        tr: "Kültür Notu: 'Ud', Arapçada aslında 'tahta parçası, ince ağaç dalı' demektir. Geleneksel telli çalgı ahşaptan (tahtadan) yapıldığı için bu müzik aletine 'Ud' ismi verilmiş, Batı dillerine de 'Lute / Laúd' olarak geçmiştir. Aynı zamanda güzel kokulu 'Öd ağacı' kelimesi de bu kelimenin Türkçeleşmiş halidir."
                    }
                ]
            }
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil - Eylemi Yapan) ---
        33: { 
            base: { 
                emoji: "👉", 
                arText: "عَائِد", 
                trText: "Âid (Ait) / Dönen, geri gelen, bir şeye mensup olan.",
                ornek: [
                    { 
                        ar: "هَذَا الْمَالُ عَائِدٌ لَهُ", 
                        tr: "Bu mal ona aittir (ona dönmektedir)." 
                    },
                    {
                        ar: "💡 مَعْلُومَة",
                        tr: "Türkçedeki Kullanımı: 'Bu kitap bana ait' derken aslında o nesnenin köken olarak bana döndüğünü, bana rücu ettiğini ifade ederiz."
                    }
                ]
            }
        },

        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekân / İsm-i Zaman) ---
        38: { 
            base: { 
                emoji: "🌅", 
                arText: "مَعَاد", 
                trText: "Meâd / Dönülecek yer, dönüş zamanı, ahiret.",
                ornek: [
                    { 
                        ar: "إِلَى اللهِ الْمَعَادُ", 
                        tr: "Dönüş (Meâd) ancak Allah'adır." 
                    },
                    {
                        ar: "💡 مَعْلُومَة",
                        tr: "Türkçedeki Kullanımı: Özellikle tasavvufi metinlerde insanın yaratılmadan önceki haline (Mebde) ve öldükten sonra döneceği yere (Meâd) atfen 'Mebde ve Meâd' kalıbı çok kullanılır."
                    }
                ]
            }
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi - Geçişlilik / Ettirgenlik) ---
        52: { 
            base: { 
                emoji: "📦", 
                arText: "أَعَادَ", 
                trText: "İâde etti / Geri verdi, tekrarladı.",
                ornek: [
                    {
                        ar: "أَعَادَ الْكِتَابَ إِلَى الْمَكْتَبَةِ",
                        tr: "Kitabı kütüphaneye iade etti."
                    }
                ]
            },
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "🤲", 
                arText: "إِعَادَة", 
                trText: "İâde / Geri verme, tekrar etme, eski haline getirme.",
                ornek: [
                    { 
                        ar: "إِعَادَةُ التَّدْوِيرِ", 
                        tr: "Geri dönüşüm (Modern Arapça)." 
                    },
                    {
                        ar: "💡 مَعْلُومَة",
                        tr: "Türkçedeki Kullanımı: Dilimizde çok yaygındır. 'İade-i ziyaret' (ziyaretin tekrarı/karşılığı), 'İade-i itibar' (saygınlığın geri verilmesi) veya markette 'ürün iadesi' gibi."
                    }
                ]
            } 
        },

        // --- 85 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı - Edilgenlik/Süreklilik) ---
        85: { 
            base: { 
                emoji: "🕰️", 
                arText: "اِعْتِيَاد", 
                trText: "İtiyâd (İtiyat) / Bir şeye alışma, huy edinme.",
                ornek: [
                    { 
                        ar: "💡 مَعْلُومَة", 
                        tr: "Türkçedeki Kullanımı: 'İtiyat haline getirmek' (alışkanlık haline getirmek) deyimi doğrudan bu masdardan dilimize geçmiştir." 
                    }
                ]
            } 
        }
    },

    // ==================================================================
    // 3. KATEGORİ: SOSYAL HAYAT, İLİŞKİLER VE İNANÇ
    // N-F-' (ن ف ع) KÖKÜ - Fayda Vermek / Yarar Sağlamak
    // 3. Bab (فَعَلَ - يَفْعَلُ) ve İfti'âl Babı ağırlıklıdır.
    // ==================================================================
    "نفع": {
        // --- 1 Numaralı Kalıp (Mücerret 3. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "✨", 
                arText: "نَفَعَ", 
                trText: "Fayda verdi / Yarar sağladı.",
                ornek: { 
                    ar: "نَفَعَ الْعِلْمُ صَاحِبَهُ", 
                    tr: "İlim sahibine fayda verdi." 
                }
            },
            cekimi: ["نَفَعَ", "نَفَعَا", "نَفَعُوا", "نَفَعَتْ", "نَفَعَتَا", "نَفَعْنَ", "نَفَعْتَ", "نَفَعْتُمَا", "نَفَعْتُمْ", "نَفَعْتِ", "نَفَعْتُمَا", "نَفَعْتُنَّ", "نَفَعْتُ", "نَفَعْنَا", "نَفَعْنَا"]
        },

        // --- 6 Numaralı Kalıp (Mücerret 3. Bab Muzari) ---
        6: { 
            base: { 
                emoji: "📈", 
                arText: "يَنْفَعُ", 
                trText: "Fayda verir / Yarar sağlar.",
                ornek: [
                    { 
                        ar: "يَوْمَ لَا يَنْفَعُ مَالٌ وَلَا بَنُونَ", 
                        tr: "O gün ne mal fayda verir ne de evlatlar. (Şuarâ Suresi, 88)" 
                    }
                ]
            },
            cekimi: ["يَنْفَعُ", "يَنْفَعَانِ", "يَنْفَعُونَ", "تَنْفَعُ", "تَنْفَعَانِ", "يَنْفَعْنَ", "تَنْفَعُ", "تَنْفَعَانِ", "تَنْفَعُونَ", "تَنْفَعِينَ", "تَنْفَعَانِ", "تَنْفَعْنَ", "أَنْفَعُ", "نَنْفَعُ", "نَنْفَعُ"]
        },

        // --- 7 Numaralı Kalıp (Mücerret 3. Bab Emir) ---
        7: { 
            base: { 
                emoji: "❗", 
                arText: "اِنْفَعْ", 
                trText: "Fayda ver / Yararlı ol!",
                ornek: { 
                    ar: "اِنْفَعِ النَّاسَ بِمَا تَعْلَمُ", 
                    tr: "Bildiğin şeylerle insanlara fayda ver!" 
                }
            },
            cekimi: ["اِنْفَعْ", "اِنْفَعَا", "اِنْفَعُوا", "اِنْفَعِي", "اِنْفَعَا", "اِنْفَعْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "🎁", 
                arText: "نَفْع", 
                trText: "Nef' / Fayda, yarar.",
                ornek: { 
                    ar: "النَّفْعُ وَالضَّرَرُ بِيَدِ اللهِ", 
                    tr: "Fayda ve zarar (sadece) Allah'ın elindedir." 
                }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "😇", 
                arText: "نَافِع", 
                trText: "Nâfi' / Fayda veren, yararlı.",
                ornek: [
                    { 
                        ar: "اَلنَّافِعُ", 
                        tr: "En-Nâfi': Dilediğine fayda ve menfaat veren (Allah'ın güzel isimlerinden)." 
                    },
                    { 
                        ar: "عِلْمٌ نَافِعٌ", 
                        tr: "Faydalı ilim." 
                    },
                    {
                        ar: "💡 مَعْلُومَة",
                        tr: "Türkçedeki Kullanımı: 'Nafi' kelimesi dilimizde hem 'faydalı' anlamında bir sıfat hem de yaygın bir erkek ismi olarak kullanılmaktadır."
                    }
                ]
            } 
        },

        // --- 38 Numaralı Kalıp (مَفْعَل ve +ة ile Mimli Masdar / İsim) ---
        38: { 
            base: { arText: "مَنْفَع" },
            suggestsPlus: true,
            "ة": { 
                emoji: "💎", 
                arText: "مَنْفَعَة", 
                trText: "Menfaat / Çıkar, fayda, yarar.",
                ornek: [
                    { 
                        ar: "دَفْعُ الْمَضَرَّةِ أَوْلَى مِنْ جَلْبِ الْمَنْفَعَةِ", 
                        tr: "Bir zararı (mazarratı) defetmek, bir fayda (menfaat) sağlamaktan önce gelir. (Meşhur Mecelle Kuralı)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة دَلَالِيَّة",
                        tr: "Semantik Not: Arapçada 'Menfaat' kelimesi olumlu bir anlama (fayda/yarar) sahipken, Türkçede zamanla bencilce kazanım (şahsi çıkar) anlamına kayarak biraz daha olumsuz bir nüans kazanmıştır."
                    }
                ]
            } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi - Edilgenlik / Kendine Çekme) ---
        77: { 
            base: { 
                emoji: "🤝", 
                arText: "اِنْتَفَعَ", 
                trText: "Faydalandı / Yararlandı (İntifa etti)." 
            },
            cekimi: ["اِنْتَفَعَ", "اِنْتَفَعَا", "اِنْتَفَعُوا", "اِنْتَفَعَتْ", "اِنْتَفَعَتَا", "اِنْتَفَعْنَ", "اِنْتَفَعْتَ", "اِنْتَفَعْتُمَا", "اِنْتَفَعْتُمْ", "اِنْتَفَعْتِ", "اِنْتَفَعْتُمَا", "اِنْتَفَعْتُنَّ", "اِنْتَفَعْتُ", "اِنْتَفَعْنَا", "اِنْتَفَعْنَا"]
        },

        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - İfti'âl Babı Muzari) ---
        78: { 
            base: { 
                emoji: "📈", 
                arText: "يَنْتَفِعُ", 
                trText: "Faydalanır / Yararlanıyor.",
                ornek: { 
                    ar: "يَنْتَفِعُ بِوَقْتِهِ جَيِّدًا", 
                    tr: "Vaktinden çok iyi faydalanıyor." 
                }
            },
            cekimi: ["يَنْتَفِعُ", "يَنْتَفِعَانِ", "يَنْتَفِعُونَ", "تَنْتَفِعُ", "تَنْتَفِعَانِ", "يَنْتَفِعْنَ", "تَنْتَفِعُ", "تَنْتَفِعَانِ", "تَنْتَفِعُونَ", "تَنْتَفِعِينَ", "تَنْتَفِعَانِ", "تَنْتَفِعْنَ", "أَنْتَفِعُ", "نَنْتَفِعُ", "نَنْتَفِعُ"]
        },

        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - İfti'âl Babı Emir) ---
        79: { 
            base: { 
                emoji: "❗", 
                arText: "اِنْتَفِعْ", 
                trText: "Faydalan / Yararlan!" 
            },
            cekimi: ["اِنْتَفِعْ", "اِنْتَفِعَا", "اِنْتَفِعُوا", "اِنْتَفِعِي", "اِنْتَفِعَا", "اِنْتَفِعْنَ"]
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "⚖️", 
                arText: "اِنْتِفَاع", 
                trText: "İntifa / Faydalanma, yararlanma.",
                ornek: [
                    { 
                        ar: "حَقُّ الِانْتِفَاعِ", 
                        tr: "İntifa hakkı (Hukukta bir mülkten yararlanma hakkı)." 
                    },
                    {
                        ar: "💡 مَعْلُومَة نَحْوِيَّة",
                        tr: "Gramer Notu: İfti'âl babındaki bu kelimeler, nesnesini (nelerden faydalanıldığını) genellikle 'بِـ' (Bi) harf-i cerri ile alırlar."
                    }
                ]
            } 
        }
    },

     // ==================================================================
    // 3. KATEGORİ: SOSYAL HAYAT, İLİŞKİLER VE İNANÇ
    // Q-S-M (ق س م) KÖKÜ - Bölmek / Paylaştırmak / Yemin Etmek
    // Bir bütünü parçalara ayırmayı, pay etmeyi ve hakkı belirlemeyi ifade eder. (2. Bab)
    // ==================================================================
    "قسم": {
        // --- 1 Numaralı Kalıp (Mücerret 2. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🔪", 
                arText: "قَسَمَ", 
                trText: "Böldü / Paylaştırdı.",
                ornek: { 
                    ar: "قَسَمَ الْمَالَ بَيْنَهُمْ بِالْعَدْلِ", 
                    tr: "Malı aralarında adaletle paylaştırdı (böldü)." 
                }
            },
        },

        // --- 4 Numaralı Kalıp (Mücerret 2. Bab Muzari) ---
        4: { 
            base: { 
                emoji: "⚖️", 
                arText: "يَقْسِمُ", 
                trText: "Böler / Paylaştırır.",
                ornek: { 
                    ar: "نَحْنُ قَسَمْنَا بَيْنَهُمْ مَعِيشَتَهُمْ فِي الْحَيَاةِ الدُّنْيَا", 
                    tr: "Dünya hayatında onların geçimliklerini aralarında biz paylaştırdık (böleriz). (Zuhruf Suresi, 32)" 
                }
            },
        },

        // --- 5 Numaralı Kalıp (Mücerret 2. Bab Emir) ---
        5: { 
            base: { 
                emoji: "❗", 
                arText: "اِقْسِمْ", 
                trText: "Böl / Paylaştır!",
                ornek: {
                    ar: "اِقْسِمْ هَذِهِ الْكَعْكَةَ إِلَى نِصْفَيْنِ",
                    tr: "Bu keki iki yarıya böl!"
                }
            },
        },

        // --- 17 Numaralı Kalıp (فَعَل - İsim / Masdar) ---
        17: { 
            base: { 
                emoji: "✋", 
                arText: "قَسَم", 
                trText: "Kasem / Yemin.",
                ornek: [
                    { 
                        ar: "أَقْسَمَ بِاللهِ قَسَمًا مُؤَكَّدًا", 
                        tr: "Allah'a kesin bir yeminle yemin etti." 
                    },
                    {
                        ar: "💡 مَعْلُومَة دَلَالِيَّة",
                        tr: "Semantik Not: 'Bölmek' kökünden gelen bu kelime neden 'Yemin' anlamı kazanmıştır? Çünkü yemin eden kişi, sözünü diğer sözlerden 'ayırır/böler' ve o söze özel bir hak/pay tanıyarak onu kesinleştirir."
                    }
                ]
            } 
        },

        // --- 20 Numaralı Kalıp (فِعْل - İsim / +ة ile Masdar-ı Hey'et) ---
        20: { 
            base: { 
                emoji: "🧩", 
                arText: "قِسْم", 
                trText: "Kısım / Bölüm, parça, şube.",
                ornek: { ar: "هَذَا الْكِتَابُ يَتَكَوَّنُ مِنْ ثَلَاثَةِ أَقْسَامٍ", tr: "Bu kitap üç kısımdan (bölümden) oluşmaktadır." }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🤲", 
                arText: "قِسْمَة", 
                trText: "Kısmet / Pay, nasip, bölme işlemi.",
                ornek: [
                    { 
                        ar: "تِلْكَ إِذًا قِسْمَةٌ ضِيزَىٰ", 
                        tr: "Öyleyse bu, haksız bir paylaştırmadır (kısmettir). (Necm Suresi, 22)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة عَقَائِدِيَّة",
                        tr: "İnanç Notu: Türkçede 'Kısmet' dediğimiz kader anlayışı, aslında Allah'ın rızkı ve olayları insanlar arasında adaletle 'bölüştürmesi / pay etmesi' işlemidir."
                    }
                ]
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "👤", 
                arText: "قَاسِم", 
                trText: "Kâsım / Bölen, paylaştıran, taksim eden.",
                ornek: [
                    { 
                        ar: "إِنَّمَا أَنَا قَاسِمٌ وَاللهُ يُعْطِي", 
                        tr: "Ben ancak paylaştırıcıyım (kâsım), veren ise Allah'tır. (Hadis-i Şerif)" 
                    },
                    {
                        ar: "أَبُو الْقَاسِمِ",
                        tr: "Ebu'l-Kâsım (Peygamber Efendimizin künyesidir, 'Kâsım'ın babası' demektir)."
                    }
                ]
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "🍰", 
                arText: "مَقْسُوم", 
                trText: "Maksum / Bölünmüş, pay edilmiş olan şey.",
                ornek: { 
                    ar: "رِزْقُكَ مَقْسُومٌ فَلَا تَحْزَنْ", 
                    tr: "Senin rızkın bölünmüş/pay edilmiştir (maksumdur), o halde üzülme. (Hikmetli Söz)" 
                }
            } 
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Tef'îl Babı Mazi - Çokluk / Parçalara Ayırma) ---
        58: { 
            base: { 
                emoji: "🗂️", 
                arText: "قَسَّمَ", 
                trText: "Kısımlara ayırdı / Taksim etti.",
                ornek: { 
                    ar: "قَسَّمَ الْمُعَلِّمُ الطُّلَّابَ إِلَى مَجْمُوعَاتٍ", 
                    tr: "Öğretmen öğrencileri gruplara (kısımlara) ayırdı." 
                }
            },
        },

        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Tef'îl Babı Muzari) ---
        59: { 
            base: { 
                emoji: "✂️", 
                arText: "يُقَسِّمُ", 
                trText: "Kısımlara ayırır / Taksim ediyor." 
            },
        },

        // --- 60 Numaralı Kalıp (فَعِّلْ - Tef'îl Babı Emir) ---
        60: { 
            base: { 
                emoji: "❗", 
                arText: "قَسِّمْ", 
                trText: "Kısımlara ayır / Taksim et!" 
            },
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { 
                emoji: "📊", 
                arText: "تَقْسِيم", 
                trText: "Taksim / Bölme, kısımlara ayırma.",
                ornek: { ar: "مَيْدَانُ التَّقْسِيمِ", tr: "Taksim Meydanı (Suların şehre bölüştürüldüğü / taksim edildiği tarihi merkez)." }
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "📏", 
                arText: "تَقْسِيمَات", 
                trText: "Taksimatlar / Bölümler." 
            }
        },

        // --- 71 Numaralı Kalıp (اِنْفَعَلَ - İnfi'âl Babı Mazi - Dönüşlülük / Edilgenlik) ---
        71: { 
            base: { 
                emoji: "💔", 
                arText: "اِنْقَسَمَ", 
                trText: "Bölündü / Parçalara ayrıldı (İnkısam etti).",
                ornek: { ar: "اِنْقَسَمَ الْمُجْتَمَعُ إِلَى قِسْمَيْنِ", tr: "Toplum iki kısma bölündü." }
            },
        },

        // --- 72 Numaralı Kalıp (يَنْفَعِلُ - İnfi'âl Babı Muzari) ---
        72: { 
            base: { 
                emoji: "📉", 
                arText: "يَنْقَسِمُ", 
                trText: "Bölünür / Parçalara ayrılıyor." 
            },
        },
 
        // --- 73 Numaralı Kalıp (اِنْفَعِلْ - İnfi'âl Babı Emir) ---
        73: { 
            base: { 
                emoji: "❗", 
                arText: "اِنْقَسِمْ", 
                trText: "Bölün / Parçalara ayrıl!",
                ornek: {
                    ar: "اِنْقَسِمُوا إِلَى مَجْمُوعَتَيْنِ",
                    tr: "İki gruba (kısma) ayrılın / bölünün."
                }
            },
        },

        // --- 74 Numaralı Kalıp (اِنْفِعَال - İnfi'âl Babı Masdarı) ---
        74: { 
            base: { 
                emoji: "⚡", 
                arText: "اِنْقِسَام", 
                trText: "İnkısam / Bölünme, parçalanma.",
                ornek: { ar: "اِنْقِسَامُ الْخَلَايَا", tr: "Hücre bölünmesi." }
            } 
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - İstif'âl Babı Masdarı) ---
        103: { 
            base: { 
                emoji: "🏹", 
                arText: "اِسْتِقْسَام", 
                trText: "İstiksam / Kısmet arama, zar atarak/ok çekerek pay belirleme.",
                ornek: { 
                    ar: "وَأَنْ تَسْتَقْسِمُوا بِالْأَزْلَامِ", 
                    tr: "Ve fal oklarıyla kısmet aramanız (da size haram kılındı). (Mâide Suresi, 3)" 
                }
            } 
        }
    },

     // ==================================================================
    // 3. KATEGORİ: SOSYAL HAYAT, İLİŞKİLER VE İNANÇ
    // S-B-Q (س ب ق) KÖKÜ - Öne Geçmek / Geçmişte Kalmak / Yarışmak
    // Zamanda veya mekânda birinden daha önde/önce olmayı ifade eder. (2. Bab)
    // ==================================================================
    "سبق": {
        // --- 1 Numaralı Kalıp (Mücerret 2. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🏃", 
                arText: "سَبَقَ", 
                trText: "Öne geçti / Geride bıraktı / Önce oldu.",
                ornek: { 
                    ar: "سَبَقَ السَّيْفُ الْعَذَلَ", 
                    tr: "Kılıç kınamayı geçti (İş işten geçti - Meşhur Arap Atasözü)." 
                }
            },
        },

        // --- 4 Numaralı Kalıp (Mücerret 2. Bab Muzari) ---
        4: { 
            base: { 
                emoji: "⏱️", 
                arText: "يَسْبِقُ", 
                trText: "Öne geçer / Geride bırakır.",
                ornek: { 
                    ar: "لَا يَسْبِقُونَهُ بِالْقَوْلِ", 
                    tr: "Onlar sözle O'nun önüne geçmezler. (Enbiyâ Suresi, 27)" 
                }
            },
        },

        // --- 5 Numaralı Kalıp (Mücerret 2. Bab Emir) ---
        5: { 
            base: { 
                emoji: "❗", 
                arText: "اِسْبِقْ", 
                trText: "Öne geç!" 
            },
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "⏳", 
                arText: "سَبْق", 
                trText: "Sebk / Öne geçme, öncelik.",
                ornek: { ar: "لَهُ سَبْقٌ فِي هَذَا الْمَجَالِ", tr: "Onun bu alanda bir öncülüğü (geçmişi/sabıkı) vardır." }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "⏮️", 
                arText: "سَابِق", 
                trText: "Sâbık / Önceki, geçen, öne geçen.",
                ornek: [
                    { 
                        ar: "الرَّئِيسُ السَّابِقُ", 
                        tr: "Önceki (sabık) başkan." 
                    },
                    {
                        ar: "وَالسَّابِقُونَ السَّابِقُونَ",
                        tr: "Öne geçenler (iman ve amelde öncü olanlar) ise, işte onlar öne geçenlerin ta kendileridir. (Vâkıa Suresi, 10)"
                    }
                ]
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "📜", 
                arText: "سَابِقَة", 
                trText: "Sâbıka / Geçmişte olan şey, emsal, suç geçmişi.",
                ornek: [
                    { 
                        ar: "سَجِلُّ السَّوَابِقِ", 
                        tr: "Sabıka kaydı (Geçmişte işlenen suçların kaydı)." 
                    },
                    {
                        ar: "💡 مَعْلُومَة دَلَالِيَّة",
                        tr: "Semantik Not: 'Sabıka' kelimesi Arapçada 'geçmişte yaşanan herhangi bir olay, emsal' demektir. Türkçede ise tamamen hukuki bir terime dönüşerek 'suç geçmişi' anlamında daralmıştır."
                    }
                ]
            } 
        },

        // --- 34 Numaralı Kalıp (فَعَّال - Mübalağalı İsm-i Fâil) ---
        34: { 
            base: { 
                emoji: "🚀", 
                arText: "سَبَّاق", 
                trText: "Sebbâk / Daima öne geçen, sürekli öncü olan.",
                ornek: { ar: "هُوَ سَبَّاقٌ لِلْخَيْرَاتِ", tr: "O, hayırlı işlerde daima öne geçendir (öncüdür)." }
            } 
        },

        // --- 50 Numaralı Kalıp (أَفْعَل - İsm-i Tafdil) ---
        50: { 
            base: { 
                emoji: "⏪", 
                arText: "أَسْبَق", 
                trText: "Esbak / En önceki, daha önceki.",
                ornek: {
                    ar: "💡 مَعْلُومَة",
                    tr: "Türkçedeki Kullanımı: Özellikle Osmanlı diplomasisinde 'bir önceki' görevli için 'Sâbık', 'ondan da önceki' görevli için ise 'Esbak' tabiri kullanılırdı (Örn: Sâbık ve esbak valiler)."
                }
            } 
        },

        // --- 57 Numaralı Kalıp (مُفْعَل - İf'âl Babı İsm-i Mef'ûlü / Zarf formu) ---
        57: { 
            base: { 
                arText: "مُسْبَق"
            },
            suggestsPlus: true,
            "ًا": { 
                emoji: "🎫", 
                arText: "مُسْبَقًا", 
                trText: "Müsbekan / Önceden, peşinen.",
                ornek: { ar: "دَفَعَ الْمَبْلَغَ مُسْبَقًا", tr: "Meblağı önceden (peşinen) ödedi." }
            } 
        },

        // --- 64 Numaralı Kalıp (فَاعَلَ - Mufâ'ale Babı Mazi - Karşılıklı Eylem) ---
        64: { 
            base: { 
                emoji: "🏇", 
                arText: "سَابَقَ", 
                trText: "Yarıştı.",
                ornek: { ar: "سَابَقَ صَدِيقَهُ", tr: "Arkadaşıyla yarıştı." }
            },
        },

        // --- 65 Numaralı Kalıp (يُفَاعِلُ - Mufâ'ale Babı Muzari) ---
        65: { 
            base: { 
                emoji: "🏁", 
                arText: "يُسَابِقُ", 
                trText: "Yarışır.",
            },
        },

        // --- 66 Numaralı Kalıp (فَاعِلْ - Mufâ'ale Babı Emir) ---
        66: { 
            base: { 
                emoji: "❗", 
                arText: "سَابِقْ", 
                trText: "Yarış!" 
            },
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Mufâ'ale Babı Masdarı) ---
        67: { 
            base: { 
                emoji: "🏆", 
                arText: "مُسَابَقَة", 
                trText: "Müsâbaka / Yarışma, müsabaka.",
                ornek: { ar: "مُسَابَقَةٌ رِيَاضِيَّةٌ", tr: "Spor müsabakası (yarışması)." }
            } 
        },

        // --- 69 Numaralı Kalıp (مُفَاعِل - Mufâ'ale Babı İsm-i Fâili) ---
        69: { 
            base: { 
                emoji: "🏃‍♂️", 
                arText: "مُسَابِق", 
                trText: "Müsâbık / Yarışmacı.",
                ornek: { ar: "شَارَكَ مِائَةُ مُسَابِقٍ", tr: "Yüz yarışmacı (müsabık) katıldı." }
            } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - İfti'âl Babı Mazi - Kendi aralarında yarışmak) ---
        77: { 
            base: { 
                emoji: "🏎️", 
                arText: "اِسْتَبَقَ", 
                trText: "Birbirleriyle yarıştılar / Öne geçmeye çalıştılar." 
            },
        },

        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - İfti'âl Babı Muzari) ---
        78: { 
            base: { 
                emoji: "🏇", 
                arText: "يَسْتَبِقُ", 
                trText: "Yarışırlar." 
            },
        },

        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - İfti'âl Babı Emir) ---
        79: { 
            base: { 
                emoji: "❗", 
                arText: "اِسْتَبِقْ", 
                trText: "Yarış (Öne geçmek için)! / Acele et!",
                ornek: { 
                    ar: "فَاسْتَبِقُوا الْخَيْرَاتِ", 
                    tr: "Hayır işlerinde (iyiliklerde) birbirinizle yarışın. (Bakara Suresi, 148)" 
                }
            },
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { 
                emoji: "🏁", 
                arText: "اِسْتِبَاق", 
                trText: "İstibak / Yarışma, ön alma.",
                ornek: { ar: "ضَرْبَةٌ اسْتِبَاقِيَّةٌ", tr: "Önleyici (istibaki/ön alan) vuruş." }
            } 
        }
    },

    // ==================================================================
    // 3. KATEGORİ: SOSYAL HAYAT, İLİŞKİLER VE İNANÇ
    // L-H-Q (ل ح ق) KÖKÜ - Yetişmek / Eklenmek / Peşine Düşmek
    // Bir şeye sonradan katılmayı, peşinden ulaşıp eklenmeyi ifade eder. (4. Bab)
    // ==================================================================
    "لحق": {
        // --- 8 Numaralı Kalıp (Mücerret 4. Bab Mazi) ---
        8: { 
            base: { 
                emoji: "🏃", 
                arText: "لَحِقَ", 
                trText: "Yetişti / Peşine takıldı / Eklendi.",
                ornek: { 
                    ar: "لَحِقَ بِالْقِطَارِ فِي اللَّحْظَةِ الْأَخِيرَةِ", 
                    tr: "Trene son anda yetişti." 
                }
            },
            cekimi: ["لَحِقَ", "لَحِقَا", "لَحِقُوا", "لَحِقَتْ", "لَحِقَتَا", "لَحِقْنَ", "لَحِقْتَ", "لَحِقْتُمَا", "لَحِقْتُمْ", "لَحِقْتِ", "لَحِقْتُمَا", "لَحِقْتُنَّ", "لَحِقْتُ", "لَحِقْنَا", "لَحِقْنَا"]
        },

        // --- 9 Numaralı Kalıp (Mücerret 4. Bab Muzari) ---
        9: { 
            base: { 
                emoji: "🏃‍♂️", 
                arText: "يَلْحَقُ", 
                trText: "Yetişir / Eklenir.",
                ornek: {
                    ar: "💡 مَعْلُومَة نَحْوِيَّة",
                    tr: "Gramer Notu: Bu fiil 'bir şeye yetişmek/ulaşmak' anlamında kullanıldığında, nesnesini (neye yetiştiğini) genellikle 'بِـ' (Bi) harf-i cerri ile alır (Örn: Yelhaku bi'l-Kıtar - Trene yetişir)."
                }
            },
            cekimi: ["يَلْحَقُ", "يَلْحَقَانِ", "يَلْحَقُونَ", "تَلْحَقُ", "تَلْحَقَانِ", "يَلْحَقْنَ", "تَلْحَقُ", "تَلْحَقَانِ", "تَلْحَقُونَ", "تَلْحَقِينَ", "تَلْحَقَانِ", "تَلْحَقْنَ", "أَلْحَقُ", "نَلْحَقُ", "نَلْحَقُ"]
        },

        // --- 10 Numaralı Kalıp (Mücerret 4. Bab Emir) ---
        10: { 
            base: { 
                emoji: "❗", 
                arText: "اِلْحَقْ", 
                trText: "Yetiş / Katıl!" 
            },
            cekimi: ["اِلْحَقْ", "اِلْحَقَا", "اِلْحَقُوا", "اِلْحَقِي", "اِلْحَقَا", "اِلْحَقْنَ"]
        },

        // --- 25 Numaralı Kalıp (فُعُول - Mücerret Masdar) ---
        25: { 
            base: { 
                emoji: "🔗", 
                arText: "لُحُوق", 
                trText: "Luhuk / Yetişme, arkasından ulaşıp eklenme." 
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "➕", 
                arText: "لَاحِق", 
                trText: "Lâhik / Sonradan gelen, peşinden yetişen, eklenen.",
                ornek: [
                    { 
                        ar: "فِي وَقْتٍ لَاحِقٍ", 
                        tr: "İleriki (sonradan gelecek olan / lâhik) bir vakitte." 
                    },
                    {
                        ar: "السَّابِقُ وَاللَّاحِقُ",
                        tr: "Önceki (Sâbık) ve Sonraki (Lâhik)."
                    }
                ]
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "📎", 
                arText: "لَاحِقَة", 
                trText: "Lâhika / Ek, sonek, mektup/belge eki.",
                ornek: { 
                    ar: "لَاحِقَةُ الْجَمْعِ فِي التُّرْكِيَّةِ", 
                    tr: "Türkçedeki çoğul eki (lahikası)." 
                }
            } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi - Geçişli Yapma / Ettirgenlik) ---
        52: { 
            base: { 
                emoji: "🧩", 
                arText: "أَلْحَقَ", 
                trText: "İlhak etti / Kattı / Ekledi.",
                ornek: { 
                    ar: "أَلْحَقَ ضَرَرًا بِالْمُمْتَلَكَاتِ", 
                    tr: "Mallara zarar verdi (zarar eriştirdi/ekledi)." 
                }
            },
            cekimi: ["أَلْحَقَ", "أَلْحَقَا", "أَلْحَقُوا", "أَلْحَقَتْ", "أَلْحَقَتَا", "أَلْحَقْنَ", "أَلْحَقْتَ", "أَلْحَقْتُمَا", "أَلْحَقْتُمْ", "أَلْحَقْتِ", "أَلْحَقْتُمَا", "أَلْحَقْتُنَّ", "أَلْحَقْتُ", "أَلْحَقْنَا", "أَلْحَقْنَا"]
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: { 
            base: { 
                emoji: "🔄", 
                arText: "يُلْحِقُ", 
                trText: "İlhak eder / Katar / Ekler." 
            },
            cekimi: ["يُلْحِقُ", "يُلْحِقَانِ", "يُلْحِقُونَ", "تُلْحِقُ", "تُلْحِقَانِ", "يُلْحِقْنَ", "تُلْحِقُ", "تُلْحِقَانِ", "تُلْحِقُونَ", "تُلْحِقِينَ", "تُلْحِقَانِ", "تُلْحِقْنَ", "أُلْحِقُ", "نُلْحِقُ", "نُلْحِقُ"]
        },

        // --- 54 Numaralı Kalıp (أَفْعِلْ - İf'âl Babı Emir) ---
        54: { 
            base: { 
                emoji: "❗", 
                arText: "أَلْحِقْ", 
                trText: "Kat / Ekle / İlhak et!",
                ornek: { 
                    ar: "رَبِّ هَبْ لِي حُكْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ", 
                    tr: "Rabbim! Bana hikmet (hüküm) ver ve beni salihler (iyiler) arasına kat (ilhak et)! (Şuarâ Suresi, 83)" 
                }
            },
            cekimi: ["أَلْحِقْ", "أَلْحِقَا", "أَلْحِقُوا", "أَلْحِقِي", "أَلْحِقَا", "أَلْحِقْنَ"]
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "🌍", 
                arText: "إِلْحَاق", 
                trText: "İlhak / Bir şeyi başka bir şeye katma, kendi sınırlarına dâhil etme.",
                ornek: { 
                    ar: "إِلْحَاقُ أَرَاضٍ جَدِيدَةٍ", 
                    tr: "Yeni arazilerin ilhak edilmesi (sınırlara dâhil edilmesi)." 
                }
            } 
        },

        // --- 57 Numaralı Kalıp (مُفْعَل - İf'âl Babı İsm-i Mef'ûlü) ---
        57: { 
            base: { 
                emoji: "📎", 
                arText: "مُلْحَق", 
                trText: "Mülhak / Eklenmiş, dâhil edilmiş, eklenti.",
                ornek: { 
                    ar: "اَلْمُعْجَمُ الْمُلْحَقُ بِالْكِتَابِ", 
                    tr: "Kitaba eklenmiş (mülhak) sözlük." 
                }
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "📚", 
                arText: "مُلْحَقَات", 
                trText: "Mülhakat / Ekler, bağlı birimler, eklentiler.",
                ornek: {
                    ar: "مُلْحَقَاتُ الْعَقْدِ",
                    tr: "Sözleşmenin ekleri (mülhakatı)."
                }
            }
        }
    },

    // ==================================================================
    // 3. KATEGORİ: SOSYAL HAYAT, İLİŞKİLER VE İNANÇ
    // '-B-D (ع ب د) KÖKÜ - Kulluk Etmek / Boyun Eğmek
    // İnsanın yaratıcısına veya bir otoriteye tam bir teslimiyetle bağlanmasını ifade eder. (1. Bab)
    // ==================================================================
    "عبد": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🧎", 
                arText: "عَبَدَ", 
                trText: "Kulluk etti / İbadet etti.",
                ornek: { 
                    ar: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنْسَ إِلَّا لِيَعْبُدُونِ", 
                    tr: "Ben cinleri ve insanları, ancak bana kulluk etsinler (ibadet etsinler) diye yarattım. (Zâriyât Suresi, 56)" 
                }
            },
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "🤲", 
                arText: "يَعْبُدُ", 
                trText: "Kulluk eder / İbadet ediyor.",
                ornek: { 
                    ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", 
                    tr: "Yalnız sana kulluk eder (ibadet eder) ve yalnız senden yardım dileriz. (Fâtiha Suresi, 5)" 
                }
            },
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { 
                emoji: "❗", 
                arText: "اُعْبُدْ", 
                trText: "Kulluk et / İbadet et!",
                ornek: {
                    ar: "يَا أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ",
                    tr: "Ey insanlar! Rabbinize kulluk (ibadet) edin. (Bakara Suresi, 21)"
                }
            },
        },

       // --- 19 Numaralı Kalıp (فَعْل - İsim / Masdar) ---
        19: { 
            base: { 
                emoji: "👤", 
                arText: "عَبْد", 
                trText: "Abd / Kul, köle.",
                ornek: [
                    { 
                        ar: "عَبْدُ اللهِ", 
                        tr: "Abdullah (Allah'ın kulu)." 
                    },
                    {
                        ar: "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا",
                        tr: "Kulunu (Muhammed'i) bir gece yürütün Allah, her türlü noksanlıktan münezzehtir. (İsrâ Suresi, 1)"
                    }
                ]
            }
        },

        // --- 25 Numaralı Kalıp (فُعُول - Masdar) ---
        25: { 
            base: { 
                emoji: "🧎‍♂️", 
            },
            suggestsPlus: true,
            "يَّة": { 
                emoji: "⛓️", 
                arText: "عُبُودِيَّة", 
                trText: "Ubûdiyet / Kulluk bilinci, kölelik.",
                ornek: { 
                    ar: "مَقَامُ الْعُبُودِيَّةِ", 
                    tr: "Kulluk (Ubûdiyet) makamı." 
                }
            }
        },

        // --- 44 Numaralı Kalıp (فِعَال - Cem-i Mükesser / Kırık Çoğul) ---
        44: { 
            base: { 
                emoji: "👥", 
                arText: "عِبَاد", 
                trText: "İbâd / Kullar (Abd kelimesinin çoğulu).",
                ornek: { 
                    ar: "وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا", 
                    tr: "Rahmân'ın kulları (ibâdı), yeryüzünde vakar ve tevazu ile yürüyen kimselerdir. (Furkân Suresi, 63)" 
                }
            } 
        },

        // --- 23 Numaralı Kalıp (فِعَالَة - Masdar / İsim) ---
        23: { 
            base: { 
                emoji: "📿", 
                arText: "عِبَادَة", 
                trText: "İbadet / Kulluk etme, tapınma.",
                ornek: { 
                    ar: "اَلصَّلَاةُ مُخُّ الْعِبَادَةِ", 
                    tr: "Namaz, ibadetin özüdür (iliğidir). (Hadis-i Şerif)" 
                }
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "🙏", 
                arText: "عَابِد", 
                trText: "Âbid / İbadet eden, kulluk eden.",
                ornek: { 
                    ar: "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ", 
                    tr: "Benim ibadet ettiğime de siz ibadet edecek (âbid) değilsiniz. (Kâfirûn Suresi, 3)" 
                }
            },
            suggestsPlus: true,
            "ونَ": { 
                emoji: "🕌", 
                arText: "عَابِدُون", 
                trText: "Âbidûn / İbadet edenler." 
            }
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "✨", 
                arText: "مَعْبُود", 
                trText: "Mâbud / Kendisine ibadet edilen, tapılan.",
                ornek: { 
                    ar: "لَا مَعْبُودَ بِحَقٍّ إِلَّا اللهُ", 
                    tr: "Allah'tan başka hakiki hiçbir mâbud (kendisine ibadet edilecek ilah) yoktur." 
                }
            } 
        },

        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekân) ---
        38: { 
            base: { 
                emoji: "🏛️", 
                arText: "مَعْبَد", 
                trText: "Mâbet / İbadet edilen yer, tapınak.",
                ornek: [
                    { 
                        ar: "اَلْمَسْجِدُ مَعْبَدُ الْمُسْلِمِينَ", 
                        tr: "Mescit, Müslümanların mabedidir." 
                    },
                    {
                        ar: "💡 مَعْلُومَة لُغَوِيَّة",
                        tr: "Kelime Bilgisi: Mabet kelimesi genel bir terimdir ve her dinin tapınağını kapsar. Cami, Kilise veya Havra birer 'Mabet'tir."
                    }
                ]
            } 
        },

        // --- 100 Numaralı Kalıp (اِسْتَفْعَلَ - İstif'âl Babı Mazi - İstek / Dönüşüm) ---
        100: { 
            base: { 
                emoji: "⛓️", 
                arText: "اِسْتَعْبَدَ", 
                trText: "Köleleştirdi / Kendisine kul/köle edindi.",
                ornek: { 
                    ar: "مَتَى اسْتَعْبَدْتُمُ النَّاسَ وَقَدْ وَلَدَتْهُمْ أُمَّهَاتُهُمْ أَحْرَارًا", 
                    tr: "Anneleri onları hür olarak doğurmuşken, siz insanları ne zamandan beri köleleştirdiniz? (Hz. Ömer'in meşhur ve evrensel insan hakları sözü)." 
                }
            },
        },

        // --- 101 Numaralı Kalıp (يَسْتَفْعِلُ - İstif'âl Babı Muzari) ---
        101: { 
            base: { 
                emoji: "🔗", 
                arText: "يَسْتَعْبِدُ", 
                trText: "Köleleştirir / İradesini esir alır." 
            },
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - İstif'âl Babı Masdarı) ---
        103: { 
            base: { 
                emoji: "⚖️", 
                arText: "اِسْتِعْبَاد", 
                trText: "İstibad (İsti'bâd) / Köleleştirme, özgürlüğünü elinden alma.",
                ornek: {
                    ar: "إِلْغَاءُ الِاسْتِعْبَادِ",
                    tr: "Köleliğin (köleleştirmenin) kaldırılması."
                }
            } 
        }
    },

    // ==================================================================
    // 3. KATEGORİ: SOSYAL HAYAT, İLİŞKİLER VE İNANÇ (SON KÖK)
    // Q-D-S (ق د س) KÖKÜ - Kutsal Olmak / Arınmış Olmak
    // Manevi yüceliği, her türlü noksanlıktan uzak ve tertemiz olmayı ifade eder. (Tef'îl Babı)
    // ==================================================================
    "قدس": {
        // --- 21 Numaralı Kalıp (فُعْل - İsim / Masdar) ---
        21: { 
            base: { 
                emoji: "🕌", 
                arText: "قُدْس", 
                trText: "Kuds (Kudüs) / Kutsal, temiz, arınmış.",
                ornek: [
                    { 
                        ar: "رُوحُ الْقُدُسِ", 
                        tr: "Rûhu'l-Kudüs (Kutsal Ruh / Cebrail a.s.)." 
                    },
                    {
                        ar: "💡 مَعْلُومَة ثَقَافِيَّة",
                        tr: "Kültür Notu: İslam'ın ilk kıblesi olan Mescid-i Aksa'nın bulunduğu şehre, taşıdığı manevi yücelik ve bereket sebebiyle 'Kudüs' (Kutsal Şehir) adı verilmiştir."
                    }
                ]
            },
            suggestsPlus: true,
            "يَّة": { 
                emoji: "✨", 
                arText: "قُدْسِيَّة", 
                trText: "Kutsiyet / Kutsallık, manevi dokunulmazlık.",
                ornek: { 
                    ar: "لِهَذَا الْمَكَانِ قُدْسِيَّةٌ عَظِيمَةٌ", 
                    tr: "Bu mekânın büyük bir kutsiyeti (kutsallığı) vardır." 
                }
            }
        },

        // --- 26 Numaralı Kalıp (فُعُّول - Mübalağalı İsm-i Fâil / Allah'ın İsmi) ---
        // (Not: Kuddûs ismi yoğunluk ve süreklilik bildiren özel فُعُّول veznindedir)
        26: { 
            base: { 
                emoji: "🌌", 
                arText: "قُدُّوس", 
                trText: "Kuddûs / Her türlü eksiklikten ve kusurdan tamamen arınmış olan, mutlak kutsal.",
                ornek: { 
                    ar: "هُوَ اللهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ", 
                    tr: "O, kendisinden başka hiçbir ilah bulunmayan, mülkün mutlak sahibi, Kuddûs (her türlü eksiklikten arınmış), Selâm olan Allah'tır. (Haşr Suresi, 23)" 
                }
            } 
        },

       // --- 58 Numaralı Kalıp (فَعَّلَ - Tef'îl Babı Mazi) ---
        58: { 
            base: { 
                emoji: "🤲", 
                arText: "قَدَّسَ", 
                trText: "Kutsal kıldı / Noksanlıklardan tenzih etti (Takdis etti).",
                ornek: [
                    {
                    ar: "قَدَّسَ اللهُ سِرَّهُ",
                    tr: "Allah onun sırrını (manevi makamını) takdis etsin / yüceltsin. (Tasavvuf büyüklerinin vefatından sonra isimlerinin ardına eklenen meşhur bir hürmet duasıdır)."
                }
                ]
            }
        },

        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Tef'îl Babı Muzari) ---
        59: { 
            base: { 
                emoji: "✨", 
                arText: "يُقَدِّسُ", 
                trText: "Kutsar / Tenzih eder / Kutsal sayar.",
                ornek: [
                    { 
                        ar: "وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً ۖ قَالُوا أَتَجْعَلُ فِيهَا مَنْ يُفْسِدُ فِيهَا وَيَسْفِكُ الدِّمَاءَ وَنَحْنُ نُسَبِّحُ بِحَمْدِكَ وَنُقَدِّسُ لَكَ ۖ قَالَ إِنِّي أَعْلَمُ مَا لَا تَعْلَمُونَ", 
                        tr: "Hani Rabbin meleklere, 'Ben yeryüzünde bir halife yaratacağım' demişti. Onlar, 'Orada bozgunculuk yapacak, kan dökecek birini mi yaratacaksın? Oysa biz sana hamdederek daima seni tesbih ve takdis ediyoruz (nukaddisu lek).' demişlerdi. (Allah da) 'Ben sizin bilmediğinizi bilirim' demişti. (Bakara Suresi, 30)" 
                    }
                ]
            }
        },

        // --- 60 Numaralı Kalıp (فَعِّلْ - Tef'îl Babı Emir) ---
        60: { 
            base: { 
                emoji: "❗", 
                arText: "قَدِّسْ", 
                trText: "Kutsa / Yücelt / Noksanlıktan uzak tut!" 
            },
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { 
                emoji: "🕊️", 
                arText: "تَقْدِيس", 
                trText: "Takdis / Kutsama, Allah'ı her türlü kusurdan tenzih ederek yüceltme.",
                ornek: { 
                    ar: "تَقْدِيسُ اللهِ تَعَالَى", 
                    tr: "Yüce Allah'ı takdis etmek (kutsayıp noksan sıfatlardan tenzih etmek)." 
                }
            } 
        },

        // --- 63 Numaralı Kalıp (مُفَعَّل - Tef'îl Babı İsm-i Mef'ûlü) ---
        63: { 
            base: { 
                emoji: "📖", 
                arText: "مُقَدَّس", 
                trText: "Mukaddes / Kutsal kılınmış, mübarek.",
                ornek: { 
                    ar: "طُوًى 💡 (الْوَادِي الْمُقَدَّسِ)", 
                    tr: "Mukaddes (Kutsal) Vadi Tuvâ. (Tâhâ Suresi, 12)" 
                }
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🕋", 
                arText: "مُقَدَّسَة", 
                trText: "Mukaddese / Kutsal (Dişil formu).",
                ornek: {
                    ar: "يَا قَوْمِ ادْخُلُوا الْأَرْضَ الْمُقَدَّسَةَ",
                    tr: "Ey kavmim! (Allah'ın size yazıp tahsis ettiği) Mukaddes topraklara girin. (Mâide Suresi, 21)"
                }
            },
            "ات": {
                emoji: "🛡️",
                arText: "مُقَدَّسَات",
                trText: "Mukaddesat / Kutsal değerler, dini emanetler.",
                ornek: {
                    ar: "الدِّفَاعُ عَنِ الْمُقَدَّسَاتِ",
                    tr: "Mukaddesatı (kutsal değerleri) savunmak."
                }
            }
        }
    },

    // ==================================================================
    // L-A'-B (ل ع ب) KÖKÜ - Oynamak / Oyun / Eğlence
    // Eğlenmeyi, oyun oynamayı ve mecazi olarak hile yapmayı veya boş işle uğraşmayı ifade eder. (4. Bab)
    // ==================================================================
    "لعب": {
        // --- 8 Numaralı Kalıp (Mücerret 4. Bab Mazi) ---
        8: { 
            base: { 
                emoji: "⚽", 
                arText: "لَعِبَ", 
                trText: "Oynadı.",
                ornek: { 
                    ar: "لَعِبَ الطِّفْلُ فِي الْحَدِيقَةِ", 
                    tr: "Çocuk bahçede oynadı." 
                }
            },
            cekimi: ["لَعِبَ", "لَعِبَا", "لَعِبُوا", "لَعِبَتْ", "لَعِبَتَا", "لَعِبْنَ", "لَعِبْتَ", "لَعِبْتُمَا", "لَعِبْتُمْ", "لَعِبْتِ", "لَعِبْتُمَا", "لَعِبْتُنَّ", "لَعِبْتُ", "لَعِبْنَا", "لَعِبْنَا"]
        },

        // --- 9 Numaralı Kalıp (Mücerret 4. Bab Muzari) ---
        9: { 
            base: { 
                emoji: "🏃‍♂️", 
                arText: "يَلْعَبُ", 
                trText: "Oynar / Oynuyor.",
                ornek: { 
                    ar: "يَلْعَبُ فَرِيقُنَا الْيَوْمَ", 
                    tr: "Takımımız bugün oynuyor." 
                }
            },
            cekimi: ["يَلْعَبُ", "يَلْعَبَانِ", "يَلْعَبُونَ", "تَلْعَبُ", "تَلْعَبَانِ", "يَلْعَبْنَ", "تَلْعَبُ", "تَلْعَبَانِ", "تَلْعَبُونَ", "تَلْعَبِينَ", "تَلْعَبَانِ", "تَلْعَبْنَ", "أَلْعَبُ", "نَلْعَبُ", "نَلْعَبُ"]
        },

        // --- 10 Numaralı Kalıp (Mücerret 4. Bab Emir) ---
        10: { 
            base: { 
                emoji: "❗", 
                arText: "اِلْعَبْ", 
                trText: "Oyna!",
                ornek: {
                    ar: "أَرْسِلْهُ مَعَنَا غَدًا يَرْتَعْ وَيَلْعَبْ",
                    tr: "Yarın onu (Yusuf'u) bizimle beraber gönder de bol bol yesin, içsin ve oynasın. (Yûsuf Suresi, 12)"
                }
            },
            cekimi: ["اِلْعَبْ", "اِلْعَبَا", "اِلْعَبُوا", "اِلْعَبِي", "اِلْعَبَا", "اِلْعَبْنَ"]
        },

        // --- 18 Numaralı Kalıp (فَعِل - İsim / Masdar) ---
        18: { 
            base: { 
                emoji: "🎮", 
                arText: "لَعِب", 
                trText: "La'ib / Oyun, eğlence.",
                ornek: { 
                    ar: "إِنَّمَا الْحَيَاةُ الدُّنْيَا لَعِبٌ وَلَهْوٌ", 
                    tr: "Dünya hayatı ancak bir oyun ve eğlencedir. (Muhammed Suresi, 36)" 
                }
            }
        },

        // --- 21 Numaralı Kalıp (فُعْل - İsim) ---
        21: { 
            base: { arText: "لُعْب" },
            suggestsPlus: true,
            "ة": { 
                emoji: "🧸", 
                arText: "لُعْبَة", 
                trText: "Lu'be / Oyuncak, oynanan oyun.",
                ornek: { 
                    ar: "لُعْبَةُ الْأَطْفَالِ", 
                    tr: "Çocuk oyuncağı." 
                }
            }
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "⛹️", 
                arText: "لَاعِب", 
                trText: "Lâ'ib / Oyuncu, sporcu.",
                ornek: { 
                    ar: "لَاعِبُ كُرَةِ الْقَدَمِ", 
                    tr: "Futbol oyuncusu (Futbolcu)." 
                }
            },
            suggestsPlus: true,
            "ونَ": { 
                emoji: "👥", 
                arText: "لَاعِبُون", 
                trText: "Lâ'ibûn / Oyuncular." 
            }
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "🃏", 
                arText: "مَلْعُوب", 
                trText: "Mel'ûb / Oynanmış şey, oyun edilmiş, hile.",
                ornek: [
                    { 
                        ar: "هَذَا مَلْعُوبٌ فِيهِ", 
                        tr: "Buna hile karışmış (bununla oynanmış)." 
                    },
                    {
                        ar: "💡 مَعْلُومَة دَلَالِيَّة",
                        tr: "Semantik Not: Türkçede halk arasında 'bunda bir mel'unluk var' denilirken kastedilen aslında lanet anlamındaki 'mel'un' değil, bu işe hile ve oyun karıştığını belirten 'mel'ub' kelimesidir."
                    }
                ]
            } 
        },

        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekân) ---
        38: { 
            base: { 
                emoji: "🏟️", 
                arText: "مَلْعَب", 
                trText: "Mel'ab / Oyun alanı, stadyum, saha.",
                ornek: { 
                    ar: "مَلْعَبُ الْمَدِينَةِ مُزْدَحِمٌ جِدًّا", 
                    tr: "Şehir stadyumu (oyun alanı) çok kalabalıktır." 
                }
            } 
        },

        // --- 41 Numaralı Kalıp (أَفْعَال - Cem-i Mükesser / Kırık Çoğul) ---
        41: { 
            base: { 
                emoji: "🎲", 
                arText: "أَلْعَاب", 
                trText: "El'âb / Oyunlar, eğlenceler.",
                ornek: [
                    { 
                        ar: "دَوْرَةُ الْأَلْعَابِ الْأُولُمْبِيَّةِ", 
                        tr: "Olimpiyat Oyunları." 
                    },
                    {
                        ar: "أَلْعَابٌ نَارِيَّةٌ",
                        tr: "Havai fişekler (Ateşli oyunlar)."
                    }
                ]
            } 
        },

        // --- 94 Numaralı Kalıp (تَفَاعَلَ - Tefâ'ul Babı Mazi - Manipülasyon/Hile) ---
        94: { 
            base: { 
                emoji: "🎭", 
                arText: "تَلَاعَبَ", 
                trText: "Oyun etti / Manipüle etti / Hile yaptı.",
                ornek: { 
                    ar: "تَلَاعَبَ بِالْأَسْعَارِ", 
                    tr: "Fiyatlarla oynadı (manipüle etti)." 
                }
            },
            cekimi: ["تَلَاعَبَ", "تَلَاعَبَا", "تَلَاعَبُوا", "تَلَاعَبَتْ", "تَلَاعَبَتَا", "تَلَاعَبْنَ", "تَلَاعَبْتَ", "تَلَاعَبْتُمَا", "تَلَاعَبْتُمْ", "تَلَاعَبْتِ", "تَلَاعَبْتُمَا", "تَلَاعَبْتُنَّ", "تَلَاعَبْتُ", "تَلَاعَبْنَا", "تَلَاعَبْنَا"]
        },

        // --- 95 Numaralı Kalıp (يَتَفَاعَلُ - Tefâ'ul Babı Muzari) ---
        95: { 
            base: { 
                emoji: "🤹", 
                arText: "يَتَلَاعَبُ", 
                trText: "Oyun eder / Manipüle eder / Oynar.",
                ornek: { 
                    ar: "يَتَلَاعَبُ بِمَشَاعِرِ النَّاسِ", 
                    tr: "İnsanların duygularıyla oynuyor (manipüle ediyor)." 
                }
            },
            cekimi: ["يَتَلَاعَبُ", "يَتَلَاعَبَانِ", "يَتَلَاعَبُونَ", "تَتَلَاعَبُ", "تَتَلَاعَبَانِ", "يَتَلَاعَبْنَ", "تَتَلَاعَبُ", "تَتَلَاعَبَانِ", "تَتَلَاعَبُونَ", "تَتَلَاعَبِينَ", "تَتَلَاعَبَانِ", "تَتَلَاعَبْنَ", "أَتَلَاعَبُ", "نَتَلَاعَبُ", "نَتَلَاعَبُ"]
        },

        // --- 97 Numaralı Kalıp (تَفَاعُل - Tefâ'ul Babı Masdarı) ---
        97: { 
            base: { 
                emoji: "📉", 
                arText: "تَلَاعُب", 
                trText: "Telâ'ub / Manipülasyon, hile, oyun etme.",
                ornek: { 
                    ar: "تَلَاعُبٌ فِي الْأَسْوَاقِ الْمَالِيَّةِ", 
                    tr: "Finansal piyasalarda manipülasyon (oyun)." 
                }
            } 
        }
    },

    // ==================================================================
    // 4. KATEGORİ: VAROLUŞ, DUYGU VE MANEVİYAT
    // H-Y-Y (ح ي ي) KÖKÜ - Yaşamak / Diri Olmak / Hayâ Etmek
    // Hayatı, diriliği, canlanmayı ve mecazi olarak utanmayı ifade eder. (4. Bab)
    // ==================================================================
    "حيي": {
        // --- 8 Numaralı Kalıp (Mücerret 4. Bab Mazi - Muzaaf/İlletli) ---
        8: { 
            base: { 
                emoji: "🌱", 
                arText: "حَيِيَ", 
                trText: "Yaşadı / Diri oldu.",
                ornek: { 
                    ar: "لِيَهْلِكَ مَنْ هَلَكَ عَنْ بَيِّنَةٍ وَيَحْيَى مَنْ حَيَّ عَنْ بَيِّنَةٍ", 
                    tr: "Helak olan apaçık bir delille helak olsun, yaşayan (diri kalan) da apaçık bir delille yaşasın. (Enfâl Suresi, 42)" 
                }
            },
            cekimi: ["حَيِيَ", "حَيِيَا", "حَيُوا", "حَيِيَتْ", "حَيِيَتَا", "حَيِينَ", "حَيِيتَ", "حَيِيتُمَا", "حَيِيتُمْ", "حَيِيتِ", "حَيِيتُمَا", "حَيِيتُنَّ", "حَيِيتُ", "حَيِينَا", "حَيِينَا"]
        },

        // --- 9 Numaralı Kalıp (Mücerret 4. Bab Muzari) ---
        9: { 
            base: { 
                emoji: "🌿", 
                arText: "يَحْيَى", 
                trText: "Yaşar / Diri olur."
            },
            cekimi: ["يَحْيَى", "يَحْيَيَانِ", "يَحْيَوْنَ", "تَحْيَى", "تَحْيَيَانِ", "يَحْيَيْنَ", "تَحْيَى", "تَحْيَيَانِ", "تَحْيَوْنَ", "تَحْيَيْنَ", "تَحْيَيَانِ", "تَحْيَيْنَ", "أَحْيَى", "نَحْيَى", "نَحْيَى"]
        },

        // --- 10 Numaralı Kalıp (Mücerret 4. Bab Emir) ---
        10: {
            base: { 
                emoji: "❗", 
                arText: "اِحْيَ", 
                trText: "Yaşa!"
            },
            cekimi: ["اِحْيَ", "اِحْيَيَا", "اِحْيَوْا", "اِحْيَيْ", "اِحْيَيَا", "اِحْيَيْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Sıfat/İsim) ---
        19: { 
            base: { 
                emoji: "✨", 
                arText: "حَيّ", 
                trText: "Hayy / Diri, yaşayan, canlı.",
                ornek: { 
                    ar: "اللهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", 
                    tr: "Allah, O'ndan başka ilah yoktur; Diridir (Hayy'dır), her şeyi ayakta tutandır. (Bakara Suresi, 255)" 
                }
            } 
        },

        // --- 22 Numaralı Kalıp (فَعَال ve + ة ile Hayat) ---
        22: { 
            base: { arText: "حَيَا" },
            suggestsPlus: true,
            "ة": { 
                emoji: "🌍", 
                arText: "حَيَاة", 
                trText: "Hayat / Yaşam.",
                ornek: { 
                    ar: "الْحَيَاةُ الدُّنْيَا", 
                    tr: "Dünya hayatı." 
                }
            } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi - Can Vermek) ---
        52: { 
            base: { 
                emoji: "🌧️", 
                arText: "أَحْيَا", 
                trText: "Diriltti / Can verdi / İhya etti.",
                ornek: {
                    ar: "أَحْيَا الْأَرْضَ بَعْدَ مَوْتِهَا",
                    tr: "Ölümünden sonra toprağa can verdi (diriltti)."
                }
            },
            cekimi: ["أَحْيَا", "أَحْيَيَا", "أَحْيَوْا", "أَحْيَتْ", "أَحْيَتَا", "أَحْيَيْنَ", "أَحْيَيْتَ", "أَحْيَيْتُمَا", "أَحْيَيْتُمْ", "أَحْيَيْتِ", "أَحْيَيْتُمَا", "أَحْيَيْتُنَّ", "أَحْيَيْتُ", "أَحْيَيْنَا", "أَحْيَيْنَا"]
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: { 
            base: { 
                emoji: "🕊️", 
                arText: "يُحْيِي", 
                trText: "Diriltir / Can verir / Yaşatır.",
                ornek: {
                    ar: "يُحْيِي وَيُمِيتُ",
                    tr: "Diriltir (can verir) ve öldürür."
                }
            },
            cekimi: ["يُحْيِي", "يُحْيِيَانِ", "يُحْيُونَ", "تُحْيِي", "تُحْيِيَانِ", "يُحْيِينَ", "تُحْيِي", "تُحْيِيَانِ", "تُحْيُونَ", "تُحْيِينَ", "تُحْيِيَانِ", "تُحْيِينَ", "أُحْيِي", "نُحْيِي", "نُحْيِي"]
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { 
                emoji: "🎇", 
                arText: "إِحْيَاء", 
                trText: "İhya / Diriltme, canlandırma, yaşatma.",
                ornek: { 
                    ar: "إِحْيَاءُ السُّنَّةِ", 
                    tr: "Sünneti ihya etmek (canlandırmak/yaşatmak)." 
                }
            } 
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل / تَفْعِلَة - Tef'îl Babı Masdarı) ---
        61: { 
            base: { 
                emoji: "👋", 
                arText: "تَحِيَّة", 
                trText: "Tahiyye / Selamlama, esenlik ve hayat dileme.",
                ornek: {
                    ar: "💡 مَعْلُومَة دَلَالِيَّة",
                    tr: "Semantik Not: 'Tahiyye', Arapçada birine 'Allah sana uzun ömür versin, hayat versin' diyerek selam vermektir. Kökü doğrudan 'Hayat/Yaşamak' (ح ي ي) kelimesine dayanır."
                }
            },
            suggestsPlus: true,
            "ات": { 
                emoji: "🤲", 
                arText: "تَحِيَّات", 
                trText: "Tahiyyât / Selamlar, saygılar (Namazdaki oturuş duası).",
                ornek: {
                    ar: "اَلتَّحِيَّاتُ لِلهِ",
                    tr: "Bütün selamlar (hayat ve mülk) Allah'ındır."
                }
            }
        },

        // --- 100 Numaralı Kalıp (اِسْتَفْعَلَ - İstif'âl Babı Mazi - Utanmak) ---
        100: { 
            base: { 
                emoji: "🙈", 
                arText: "اِسْتَحْيَا", 
                trText: "Utandı / Hayâ etti.",
                ornek: {
                    ar: "إِنَّ اللهَ لَا يَسْتَحْيِي أَنْ يَضْرِبَ مَثَلًا",
                    tr: "Şüphesiz Allah, (sivrisinek gibi) bir misal getirmekten çekinmez (hayâ etmez/utanmaz). (Bakara Suresi, 26)"
                }
            },
            cekimi: ["اِسْتَحْيَا", "اِسْتَحْيَيَا", "اِسْتَحْيَوْا", "اِسْتَحْيَتْ", "اِسْتَحْيَتَا", "اِسْتَحْيَيْنَ", "اِسْتَحْيَيْتَ", "اِسْتَحْيَيْتُمَا", "اِسْتَحْيَيْتُمْ", "اِسْتَحْيَيْتِ", "اِسْتَحْيَيْتُمَا", "اِسْتَحْيَيْتُنَّ", "اِسْتَحْيَيْتُ", "اِسْتَحْيَيْنَا", "اِسْتَحْيَيْنَا"]
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - İstif'âl Babı Masdarı) ---
        103: { 
            base: { 
                emoji: "😳", 
                arText: "اِسْتِحْيَاء", 
                trText: "İstihyâ / Utanma, hayâ etme, çekinme.",
                ornek: {
                    ar: "فَجَاءَتْهُ إِحْدَاهُمَا تَمْشِي عَلَى اسْتِحْيَاءٍ",
                    tr: "Derken o iki kadından biri utana utana (istihya üzere) yürüyerek ona geldi. (Kasas Suresi, 25)"
                }
            } 
        }
    },

    // ==================================================================
    // 4. KATEGORİ: VAROLUŞ, DUYGU VE MANEVİYAT
    // M-W-T (م و ت) KÖKÜ - Ölmek / Cansız Olmak
    // Hayatın son bulmasını, hissizliği ve hareketsizliği ifade eder. (Ecvef Fiil / 1. Bab)
    // ==================================================================
    "موت": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi - Ecvef) ---
        1: { 
            base: { 
                emoji: "⚰️", 
                arText: "مَاتَ", 
                trText: "Öldü.",
                ornek: [
                    { 
                        ar: "مَاتَ فِي سَبِيلِ الْوَطَنِ", 
                        tr: "Vatan uğrunda öldü." 
                    },
                    {
                        ar: "💡 قَاعِدَة صَرْفِيَّة (الْأَجْوَف)",
                        tr: "Sarf Notu: Bu bir 'Ecvef' (ortası illetli) fiildir. Kökündeki 'Vav' (و) harfi mazide 'Elif'e (ا) dönüşür. Çekim tablosunda (Biz, Siz, Onlar-Kadınlar) derken iki sessiz harf yan yana gelemeyeceği için ortadaki illet harfi düşer ve baştaki harf ötre alır (Örn: مُتُّ - Mut-tu / Öldüm)."
                    }
                ]
            },
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "🥀", 
                arText: "يَمُوتُ", 
                trText: "Ölür / Ölüyor.",
                ornek: { 
                    ar: "وَلَا تَمُوتُنَّ إِلَّا وَأَنْتُمْ مُسْلِمُونَ", 
                    tr: "Ancak müslümanlar olarak ölün (can verin). (Âl-i İmrân Suresi, 102)" 
                }
            },
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { 
                emoji: "❗", 
                arText: "مُتْ", 
                trText: "Öl!",
                ornek: {
                    ar: "مُوتُوا قَبْلَ أَنْ تَمُوتُوا",
                    tr: "Ölmeden önce ölünüz! (Nefsinizi hesaba çekiniz - Tasavvufta meşhur bir düstur)."
                }
            },
            cekimi: ["مُتْ", "مُوتَا", "مُوتُوا", "مُوتِي", "مُوتَا", "مُتْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Masdar / İsim) ---
        19: { 
            base: { 
                emoji: "🪦", 
                arText: "مَوْت", 
                trText: "Mevt / Ölüm.",
                ornek: { 
                    ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", 
                    tr: "Her can ölümü (mevti) tadacaktır. (Âl-i İmrân Suresi, 185)" 
                }
            },
            suggestsPlus: true,
            "َى": { 
                emoji: "👻", 
                arText: "مَوْتَى", 
                trText: "Mevtâ / Ölüler (Kırık çoğul).",
                ornek: { 
                    ar: "إِحْيَاءُ الْمَوْتَى", 
                    tr: "Ölülerin (mevtanın) diriltilmesi." 
                }
            }
        },

        // --- 33 Numaralı Kalıp (فَيْعِل - Sıfat-ı Müşebbehe / İsm-i Fâil Yerine Kullanılır) ---
        33: { 
            base: { 
                emoji: "💀", 
                arText: "مَيِّت", 
                trText: "Meyyit / Ölü, cansız.",
                ornek: [
                    { 
                        ar: "إِنَّكَ مَيِّتٌ وَإِنَّهُمْ مَيِّتُونَ", 
                        tr: "Şüphesiz sen de öleceksin (meyyitsin), onlar da ölecekler. (Zümer Suresi, 30)" 
                    },
                    {
                        ar: "💡 مَعْلُومَة صَرْفِيَّة",
                        tr: "Sarf Notu: Arapçada M-W-T kökünün kurala uygun İsm-i Fâili 'مَائِت' (Mâit) şeklindedir. Ancak Kur'an'da ve günlük dilde kalıcı sıfat bildiren 'مَيِّت' (Meyyit) kelimesi çok daha fazla kullanılır. Bu kelime aslen 'مَيْوِت' (Meyvit) idi; Yâ ve Vav yan yana gelince Vav Yâ'ya dönüştü ve şeddelendi."
                    }
                ]
            },
            suggestsPlus: true,
            "ة": { 
                emoji: "🥀", 
                arText: "مَيْتَة", 
                trText: "Meyte / Leş, kendiliğinden ölmüş hayvan.",
                ornek: {
                    ar: "حُرِّمَتْ عَلَيْكُمُ الْمَيْتَةُ وَالدَّمُ",
                    tr: "Leş (meyte) ve kan size haram kılındı. (Mâide Suresi, 3)"
                }
            }
        },

        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekân / İsm-i Zaman) ---
        38: { 
            base: { 
                emoji: "⏳", 
                arText: "مَمَات", 
                trText: "Memât / Ölüm zamanı, ölüm yeri, ölüm hali.",
                ornek: [
                    { 
                        ar: "قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلهِ رَبِّ الْعَالَمِينَ", 
                        tr: "De ki: Şüphesiz benim namazım, ibadetlerim, hayatım (mahyây) ve ölümüm (memâtım) alemlerin Rabbi olan Allah içindir. (En'âm Suresi, 162)" 
                    },
                    {
                        ar: "مَسْأَلَةُ حَيَاةٍ أَوْ مَمَاتٍ",
                        tr: "Hayat memat (ölüm kalım) meselesi."
                    }
                ]
            } 
        },

        // --- 41 Numaralı Kalıp (أَفْعَال - Cem-i Mükesser / Kırık Çoğul) ---
        41: { 
            base: { 
                emoji: "🪦", 
                arText: "أَمْوَات", 
                trText: "Emvât / Ölüler.",
                ornek: { 
                    ar: "وَلَا تَحْسَبَنَّ الَّذِينَ قُتِلُوا فِي سَبِيلِ اللهِ أَمْوَاتًا", 
                    tr: "Allah yolunda öldürülenleri sakın ölüler (emvat) sanma. (Âl-i İmrân Suresi, 169)" 
                }
            } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - İf'âl Babı Mazi - Geçişli Yapma) ---
        52: { 
            base: { 
                emoji: "🗡️", 
                arText: "أَمَاتَ", 
                trText: "Öldürdü / Canını aldı.",
                ornek: { 
                    ar: "وَأَنَّهُ هُوَ أَمَاتَ وَأَحْيَا", 
                    tr: "Şüphesiz O'dur öldüren ve dirilten. (Necm Suresi, 44)" 
                }
            },
        },

        // --- 53 Numaralı Kalıp (يُفْعِلُ - İf'âl Babı Muzari) ---
        53: { 
            base: { 
                emoji: "🍂", 
                arText: "يُمِيتُ", 
                trText: "Öldürür / Can alır.",
                ornek: { 
                    ar: "يُحْيِي وَيُمِيتُ", 
                    tr: "Diriltir ve öldürür." 
                }
            },
        },

        // --- 54 Numaralı Kalıp (أَفْعِلْ - İf'âl Babı Emir) ---
        54: { 
            base: { 
                emoji: "❗", 
                arText: "أَمِتْ", 
                trText: "Öldür / Canını al!",
                ornek: { 
                    ar: "اللَّهُمَّ أَحْيِنِي مَا كَانَتِ الْحَيَاةُ خَيْرًا لِي، وَأَمِتْنِي إِذَا كَانَتِ الْوَفَاةُ خَيْرًا لِي", 
                    tr: "Allah'ım! Yaşamak benim için hayırlı olduğu sürece beni yaşat, ölüm benim için hayırlı olduğunda da beni öldür. (Hadis-i Şerif)" 
                }
            },
            cekimi: ["أَمِتْ", "أَمِيتَا", "أَمِيتُوا", "أَمِيتِي", "أَمِيتَا", "أَمِتْنَ"]
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı / Ecvef Kuralı) ---
        55: { 
            base: { 
                emoji: "🥀", 
                arText: "إِمَاتَة", 
                trText: "İmâte / Öldürme, canını alma.",
                ornek: [
                    { 
                        ar: "إِمَاتَةُ النَّفْسِ", 
                        tr: "Nefsi (kötü arzuları) öldürmek." 
                    },
                    {
                        ar: "💡 قَاعِدَة صَرْفِيَّة",
                        tr: "Sarf Notu: İstikamet kelimesinde olduğu gibi, Ecvef fiillerin İf'âl babı masdarında da ortadaki illet harfi düşer ve sonuna bedel olarak bir 'ة' eklenir. Aslı 'إِمْوَات' iken 'إِمَاتَة' olmuştur."
                    }
                ]
            } 
        },

        // --- 100 Numaralı Kalıp (اِسْتَفْعَلَ - İstif'âl Babı Mazi - Ölümü Talep Etmek / Göze Almak) ---
        100: { 
            base: { 
                emoji: "⚔️", 
                arText: "اِسْتَمَاتَ", 
                trText: "Ölümü göze aldı / Ölümüne savaştı.",
                ornek: { 
                    ar: "اِسْتَمَاتَ الْجُنُودُ فِي الدِّفَاعِ عَنِ الْوَطَنِ", 
                    tr: "Askerler vatanı savunurken ölümü göze aldılar (ölümüne savaştılar)." 
                }
            },
            cekimi: ["اِسْتَمَاتَ", "اِسْتَمَاتَا", "اِسْتَمَاتُوا", "اِسْتَمَاتَتْ", "اِسْتَمَاتَتَا", "اِسْتَمَتْنَ", "اِسْتَمَتَّ", "اِسْتَمَتُّمَا", "اِسْتَمَتُّمْ", "اِسْتَمَتِّ", "اِسْتَمَتُّمَا", "اِسْتَمَتُّنَّ", "اِسْتَمَتُّ", "اِسْتَمَتْنَا", "اِسْتَمَتْنَا"]
        }
    },

    // ==================================================================
    // 4. KATEGORİ: VAROLUŞ, DUYGU VE MANEVİYAT
    // R-Z-Q (ر ز ق) KÖKÜ - Rızık Vermek / İhsan Etmek
    // Allah'ın canlılara hayatlarını sürdürmeleri için verdiği maddi ve manevi nimetleri ifade eder. (1. Bab)
    // ==================================================================
    "رزق": {
        // --- 1 Numaralı Kalıp (Mücerret 1. Bab Mazi) ---
        1: { 
            base: { 
                emoji: "🤲", 
                arText: "رَزَقَ", 
                trText: "Rızık verdi / Nimetlendirdi.",
                ornek: { 
                    ar: "رَزَقَهُ اللهُ وَلَدًا صَالِحًا", 
                    tr: "Allah onu salih (hayırlı) bir evlatla rızıklandırdı." 
                }
            },
            cekimi: ["رَزَقَ", "رَزَقَا", "رَزَقُوا", "رَزَقَتْ", "رَزَقَتَا", "رَزَقْنَ", "رَزَقْتَ", "رَزَقْتُمَا", "رَزَقْتُمْ", "رَزَقْتِ", "رَزَقْتُمَا", "رَزَقْتُنَّ", "رَزَقْتُ", "رَزَقْنَا", "رَزَقْنَا"]
        },

        // --- 2 Numaralı Kalıp (Mücerret 1. Bab Muzari) ---
        2: { 
            base: { 
                emoji: "✨", 
                arText: "يَرْزُقُ", 
                trText: "Rızık verir / Nimetlendirir.",
                ornek: { 
                    ar: "وَاللَّهُ يَرْزُقُ مَنْ يَشَاءُ بِغَيْرِ حِسَابٍ", 
                    tr: "Allah dilediğine hesapsız rızık verir. (Bakara Suresi, 212)" 
                }
            },
            cekimi: ["يَرْزُقُ", "يَرْزُقَانِ", "يَرْزُقُونَ", "تَرْزُقُ", "تَرْزُقَانِ", "يَرْزُقْنَ", "تَرْزُقُ", "تَرْزُقَانِ", "تَرْزُقُونَ", "تَرْزُقِينَ", "تَرْزُقَانِ", "تَرْزُقْنَ", "أَرْزُقُ", "نَرْزُقُ", "نَرْزُقُ"]
        },

        // --- 3 Numaralı Kalıp (Mücerret 1. Bab Emir) ---
        3: { 
            base: { 
                emoji: "❗", 
                arText: "اُرْزُقْ", 
                trText: "Rızık ver / Nimetlendir!" 
            },
            cekimi: ["اُرْزُقْ", "اُرْزُقَا", "اُرْزُقُوا", "اُرْزُقِي", "اُرْزُقَا", "اُرْزُقْنَ"]
        },

        // --- 19 Numaralı Kalıp (فَعْل - Mücerret Masdar) ---
        19: { 
            base: { 
                emoji: "🍞", 
                arText: "رِزْق", 
                trText: "Rızık / Geçimlik, nimet, nasip.",
                ornek: [
                    { 
                        ar: "اَلرِّزْقُ عَلَى اللهِ", 
                        tr: "Rızık Allah'tandır." 
                    },
                    {
                        ar: "وَمَا مِنْ دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا",
                        tr: "Yeryüzünde hiçbir canlı yoktur ki, rızkı Allah'ın üzerine olmasın. (Hûd Suresi, 6)"
                    }
                ]
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fâil) ---
        33: { 
            base: { 
                emoji: "👑", 
                arText: "رَازِق", 
                trText: "Râzık / Rızık veren (Allah'ın isimlerinden).",
                ornek: { 
                    ar: "هُوَ الرَّازِقُ الْكَرِيمُ", 
                    tr: "O, çok kerem sahibi olan Rızık Veren'dir." 
                }
            }
        },

        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ûl) ---
        36: { 
            base: { 
                emoji: "👼", 
                arText: "مَرْزُوق", 
                trText: "Merzûk / Rızıklandırılmış olan.",
                ornek: { 
                    ar: "كُلُّنَا مَرْزُوقُونَ بِفَضْلِ اللهِ", 
                    tr: "Hepimiz Allah'ın lütfuyla rızıklandırılmış kimseleriz." 
                }
            } 
        }
    },
};
