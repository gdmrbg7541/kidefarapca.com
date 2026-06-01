

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
    // 1. K-T-B (ك ت ب) KÖKÜ - Yazmak
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
                    ar: "فَاعْلَمْ أَنَّهُ لَا إِلَٰهَ إِلَّا اللَّهُ",
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
                    ar: "عَائِشَةُ رَضِيَ اللَّهُ عَنْهَا كَانَتْ عَالِمَةً جَلِيلَةً",
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
                    ar: "وَيُعَلِّمُكُمُ اللَّهُ ۗ وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ",
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
                ornek: { ar: "الْكَمَالُ لِلَّهِ وَحْدَهُ", tr: "Kemal (kusursuzluk) sadece Allah'a mahsustur." }
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
                ornek: { ar: "وَاللَّهُ يَحْكُمُ لَا مُعَقِّبَ لِحُكْمِهِ", tr: "Allah hükmeder, O'nun hükmünü bozacak kimse yoktur. (Ra'd Suresi, 41)" }
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
                ornek: { ar: "إِنِ الْحُكْمُ إِلَّا لِلَّهِ", tr: "Hüküm ancak Allah'ındır. (Yusuf Suresi, 40)" }
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
                ornek: { ar: "يَعْرِفُونَ نِعْمَتَ اللَّهِ ثُمَّ يُنكِرُونَهَا", tr: "Allah'ın nimetini bilirler (tanırlar), sonra da onu inkar ederler. (Nahl Suresi, 83)" }
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
                ornek: { ar: "فَقَدْ رَحِمَهُ اللَّهُ", tr: "Allah ona kesinlikle merhamet etmiştir." }
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
            base: { emoji: "🌧️", arText: "رَحْم", trText: "Rahmet (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🌧️", 
                arText: "رَحْمَة", 
                trText: "Rahmet / Merhamet.",
                ornek: { ar: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ", tr: "Biz seni ancak âlemlere rahmet olarak gönderdik. (Enbiyâ Suresi, 107)" } 
            } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { 
                emoji: "🤍", 
                arText: "رَحِيم", 
                trText: "Çok merhamet eden (Rahim).",
                ornek: { ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", tr: "Rahman ve Rahim olan Allah'ın adıyla." }
            } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { 
                emoji: "🤲", 
                arText: "مَرْحُوم", 
                trText: "Kendisine merhamet edilen (Merhum / Vefat etmiş kişi).",
                ornek: { ar: "رَحِمَهُ اللَّهُ رَحْمَةً وَاسِعَةً", tr: "Allah ona geniş bir rahmetle merhamet etsin (Merhum / Vefat etmiş kişi)." }
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
                ornek: { ar: "إِنَّ الدِّينَ عِنْدَ اللَّهِ الْإِسْلَامُ", tr: "Şüphesiz Allah katında din İslam'dır. (Âl-i İmrân Suresi, 19)" }
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
                ornek: { ar: "وَلِلَّهِ يَسْجُدُ مَنْ فِي السَّمَاوَاتِ وَالْأَرْضِ", tr: "Göklerde ve yerde olan herkes Allah'a secde eder. (Ra'd Suresi, 15)" }
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
                ornek: { ar: "تَرَاهُمْ رُكَّعًا سُجَّدًا يَبْتَغُونَ فَضْلًا مِّنَ اللَّهِ", tr: "Onları, Allah'tan bir lütuf isteyerek rükû ve secde eder (sâcid/sücced) hâlde görürsün. (Fetih Suresi, 29)" }
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
                ornek: { ar: "قَدْ عَلِمَ كُلُّ أُنَاسٍ مَّشْرَبَهُمْ", tr: "Her topluluk kendi içeceği yeri (pınarını) bildi. (Bakara Suresi, 60)" }
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
                ornek: { ar: "لَا عَاصِمَ الْيَوْمَ مِنْ أَمْرِ اللَّهِ", tr: "Bugün Allah'ın emrinden koruyacak hiçbir güç yoktur. (Hûd Suresi, 43)" }
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
                ornek: { ar: "إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ", tr: "Şüphesiz Allah'ın rahmeti iyilik edenlere çok yakındır. (A'râf Suresi, 56)" }
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
                ornek: { ar: "فَأَنْزَلَ اللَّهُ سَكِينَتَهُ عَلَيْهِ", tr: "Allah onun üzerine sekinetini (huzur ve güvenini) indirdi. (Tevbe Suresi, 40)" }
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
                ornek: { ar: "وَاللَّهُ جَعَلَ لَكُمْ مِنْ بُيُوتِكُمْ سَكَنًا", tr: "Allah, evlerinizi sizin için bir huzur ve dinlenme yeri (mesken/sakan) kıldı. (Nahl Suresi, 80)" }
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
                ornek: { ar: "وَجَاهِدُوا فِي اللَّهِ حَقَّ جِهَادِهِ", tr: "Allah uğrunda hakkıyla cihad edin (gayret gösterin). (Hac Suresi, 78)" }
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
                ornek: { ar: "إِلَى اللَّهِ مَرْجِعُكُمْ جَمِيعًا", tr: "Hepinizin dönüşü (mercii/kaynağı) Allah'adır. (Mâide Suresi, 48)" }
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
            base: { emoji: "🌾", arText: "بَرَك", trText: "Bereket (Yalın)." },
            suggestsPlus: true, 
            "ة": { 
                emoji: "🌾", 
                arText: "بَرَكَة", 
                trText: "Bereket.",
                ornek: { ar: "الْبَرَكَةُ فِي الْبُكُورِ", tr: "Bereket, sabahın erken vakitlerindedir. (Hadis-i Şerif)" }
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
                ornek: { ar: "مُحَمَّدٌ رَسُولُ اللَّهِ", tr: "Muhammed Allah'ın resulüdür (elçisidir). (Fetih Suresi, 29)" }
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
                ornek: { ar: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", tr: "Allah'ın yardımı (nasrı) ve fetih geldiğinde. (Nasr Suresi, 1)" }
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
                ornek: { ar: "أَمْرٌ مُحَقَّقٌ بِإِذْنِ اللَّهِ", tr: "Allah'ın izniyle muhakkak (kesinleşmiş/gerçekleşmiş) bir durum." }
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

    // 52. J-M-' (ج م ع) KÖKÜ - Toplamak / Bir Araya Getirmek / Topluluk
    "جمع": {
        19: { base: { emoji: "🔢", arText: "جَمْع", trText: "Toplama." }, suggestsPlus: true, "يَّة": { emoji: "🏢", arText: "جَمْعِيَّةٌ خَيْرِيَّةٌ لِمُسَاعَدَةِ الْمُحْتَاجِينَ", trText: "İhtiyaç sahiplerine yardım için bir hayır cemiyeti (derneği)." } }, // جَمْع + يَّة = جَمْعِيَّة
        22: { suggestsPlus: true, "ة": { emoji: "👥", arText: "صَلَاةُ الْجَمَاعَةِ أَفْضَلُ مِنْ صَلَاةِ الْفَذِّ", trText: "Cemaatle kılınan namaz, tek başına kılınan namazdan daha faziletlidir. (Hadis-i Şerif)" } }, // جَمَاع + ة = جَمَاعَة
        33: { base: { emoji: "🕌", arText: "أَحَبُّ الْبِلَادِ إِلَى اللهِ مَسَاجِدُهَا", trText: "Allah'a beldelerin en sevimlisi mescitlerdir (camilerdir). (Hadis-i Şerif)" }, suggestsPlus: true, "ة": { emoji: "🎓", arText: "الْحَيَاةُ الْجَامِعِيَّةُ مَلِيئَةٌ بِالتَّجَارِبِ", trText: "Üniversite hayatı tecrübelerle doludur." } }, // جَامِع + ة = جَامِعَة
        36: { suggestsPlus: true, "ة": { emoji: "📂", arText: "مَجْمُوعَةٌ جَدِيدَةٌ مِنَ الطُّلَّابِ", trText: "Yeni bir öğrenci grubu (kümesi)." } }, // مَجْمُوع + ة = مَجْمُوعَة
        42: { suggestsPlus: true, "ة": { emoji: "🕋", arText: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِنْ يَوْمِ الْجُمُعَةِ...", trText: "Ey iman edenler! Cuma günü namaz için çağrı yapıldığında... (Cuma Suresi)" } }, // جُمُع + ة = جُمُعَة
        80: { base: { emoji: "💼", arText: "لَدَيْنَا اِجْتِمَاعٌ مُهِمٌّ الْيَوْمَ", trText: "Bugün önemli bir toplantımız (içtimamız) var." } } // اِجْتِمَاع
    },

    // 53. H-M-D (ح م د) KÖKÜ - Övmek / Şükretmek
    "حمد": {
        19: { base: { emoji: "🤲", arText: "الْحَمْدُ لِلهِ رَبِّ الْعَالَمِينَ", trText: "Hamd (övgü ve şükür), alemlerin Rabbi olan Allah'a mahsustur. (Fâtiha Suresi)" }, suggestsPlus: true, "يَّة": { emoji: "🌸", arText: "حَمْدِيَّة", trText: "Hamdiye (İsim)." } }, // حَمْد + يَّة = حَمْدِيَّة
        30: { base: { emoji: "🌟", arText: "وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ", trText: "Benden sonra gelecek 'Ahmet' (çok övülen) adındaki bir peygamberi müjdeleyici olarak... (Saf Suresi)" } }, // أَحْمَد
        35: { base: { emoji: "💎", arText: "إِنَّ الله هُوَ الْغَنِيُّ الْحَمِيدُ", trText: "Şüphesiz Allah, hiçbir şeye muhtaç değildir, her türlü övgüye layıktır (Hamit'tir). (Lokmân Suresi)" } }, // حَمِيد
        36: { base: { emoji: "🏅", arText: "عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا", trText: "Umulur ki Rabbin seni Makam-ı Mahmud'a (övülmüş bir makama) ulaştırır. (İsrâ Suresi)" } }, // مَحْمُود
        63: { base: { emoji: "🌹", arText: "مُحَمَّدٌ رَّسُولُ اللهِ", trText: "Muhammed (s.a.v), Allah'ın elçisidir. (Fetih Suresi)" } } // مُحَمَّد
    },

    // 54. Sh-H-R (ش ه ر) KÖKÜ - Belirmek / İlan Etmek / Ay / Şöhret
    "شهر": {
        19: { base: { emoji: "📅", arText: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ", trText: "Ramazan ayı, içinde Kur'an'ın indirildiği aydır. (Bakara Suresi)" } }, // شَهْر
        21: { suggestsPlus: true, "ة": { emoji: "🌟", arText: "النَّجَاحُ يَجْلِبُ الشُّهْرَةَ عَبْرَ الْعَمَلِ", trText: "Başarı, çalışmayla birlikte şöhreti (tanınmışlığı) getirir." } }, // شُهْر + ة = شُهْرَة
        36: { base: { emoji: "🎤", arText: "هُوَ كَاتِبٌ مَشْهُورٌ فِي الْعَالَمِ", trText: "O, dünyada meşhur (tanınmış) bir yazardır." } }, // مَشْهُور
        61: { base: { emoji: "📢", arText: "تَشْهِيرُ الْأَخْبَارِ الْكَاذِبَةِ مَمْنُوعٌ", trText: "Yalan haberlerin teşhir edilmesi (ifşa edilmesi/yayılması) yasaktır." } } // تَشْهِير
    },

    // 55. Sh-K-R (ش ك ر) KÖKÜ - Teşekkür Etmek / Şükretmek
    "شكر": {
        21: { base: { emoji: "🙏", arText: "مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ الله", trText: "İnsanlara teşekkür etmeyen, Allah'a da şükretmez. (Hadis-i Şerif)" }, suggestsPlus: true, "يّ": { emoji: "👨", arText: "شُكْرِيّ", trText: "Şükrü." }, "يَّة": { emoji: "👩", arText: "شُكْرِيَّة", trText: "Şükriye." } }, // شُكْر + ekler
        27: { base: { emoji: "🌹", arText: "شُكْرَانًا جَزِيلًا عَلَى حُسْنِ صَنِيعِكُمْ", trText: "Güzel davranışınız için çok şükran (teşekkür) ederim." } }, // شُكْرَان
        33: { base: { emoji: "😇", arText: "أَنَا شَاكِرٌ لَكَ عَلَى مَعْرُوفِكَ", trText: "İyiliğin için sana şâkirim (teşekkür ederim/minnettarım)." } }, // شَاكِر
        91: { base: { emoji: "🤝", arText: "تَشَكُّرَاتِي الْقَلْبِيَّةُ لَكُمْ جَمِيعًا", trText: "Hepinize kalbi teşekkürlerimi (teşekkürlerimi) sunarım." } }, // تَشَكُّر
        92: { base: { emoji: "👔", arText: "أَنَا مُتَشَكِّرٌ جِدًّا لِمُسَاعَدَتِكُمْ", trText: "Yardımınız için çok müteşekkirim (minnettarım)." } } // مُتَشَكِّر
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
        61: { base: { emoji: "🕌", arText: "نُرَدِّدُ التَّكْبِيرَ فِي أَيَّامِ الْعِيدِ", trText: "Bayram günlerinde tekbir getiririz." } } // تَكْبِير
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
            cekimi: ["قَالَ", "قَالَا", "قَالُوا", "قَالَتْ", "قَالَتَا", "قُلْنَ", "قُلْتَ", "قُلْتُمَا", "قُلْتُمْ", "قُلْتِ", "قُلْتُمَا", "قُلْتُنَّ", "قُلْتُ", "قُلْنَا", "قُلْنَا"]
        },
        2: { 
            base: { emoji: "💬", arText: "يَقُولُ", trText: "Der / Söylüyor." },
            cekimi: ["يَقُولُ", "يَقُولَانِ", "يَقُولُونَ", "تَقُولُ", "تَقُولَانِ", "يَقُلْنَ", "تَقُولُ", "تَقُولَانِ", "تَقُولُونَ", "تَقُولِينَ", "تَقُولَانِ", "تَقُلْنَ", "أَقُولُ", "نَقُولُ", "نَقُولُ"]
        },
        3: { 
            base: { emoji: "❗", arText: "قُلْ", trText: "De / Söyle!" },
            cekimi: ["قُلْ", "قُولَا", "قُولُوا", "قُولِي", "قُولَا", "قُلْنَ"]
        }
    },

    "بيع": {
        1: { 
            base: { emoji: "🤝", arText: "بَاعَ", trText: "Sattı." },
            cekimi: ["بَاعَ", "بَاعَا", "بَاعُوا", "بَاعَتْ", "بَاعَتَا", "بِعْنَ", "بِعْتَ", "بِعْتُمَا", "بِعْتُمْ", "بِعْتِ", "بِعْتُمَا", "بِعْتُنَّ", "بِعْتُ", "بِعْنَا", "بِعْنَا"]
        },
        4: { 
            base: { emoji: "💰", arText: "يَبِيعُ", trText: "Satar / Satıyor." },
            cekimi: ["يَبِيعُ", "يَبِيعَانِ", "يَبِيعُونَ", "تَبِيعُ", "تَبِيعَانِ", "يَبِعْنَ", "تَبِيعُ", "تَبِيعَانِ", "تَبِيعُونَ", "تَبِيعِينَ", "تَبِيعَانِ", "تَبِعْنَ", "أَبِيعُ", "نَبِيعُ", "نَبِيعُ"]
        },
        5: { 
            base: { emoji: "❗", arText: "بِعْ", trText: "Sat!" },
            cekimi: ["بِعْ", "بِيعَا", "بِيعُوا", "بِيعِي", "بِيعَا", "بِعْنَ"]
        },
        19: { 
            base: { emoji: "📜", arText: "بَيْع", trText: "Satış / Satmak (Masdar)." },
        },
        33: { 
            base: { emoji: "🛒", arText: "بَائِع", trText: "Satan / Satıcı (İsm-i Fail)." },
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
    },

    "رضي": {
        8: { 
            base: { emoji: "😌", arText: "رَضِيَ", trText: "Razı oldu." },
            cekimi: ["رَضِيَ", "رَضِيَا", "رَضُوا", "رَضِيَتْ", "رَضِيَتَا", "رَضِينَ", "رَضِيتَ", "رَضِيتُمَا", "رَضِيتُمْ", "رَضِيتِ", "رَضِيتُمَا", "رَضِيتُنَّ", "رَضِيتُ", "رَضِينَا", "رَضِينَا"]
        },
        9: { 
            base: { emoji: "❤️", arText: "يَرْضَى", trText: "Razı olur / Razı oluyor." },
            cekimi: ["يَرْضَى", "يَرْضَيَانِ", "يَرْضَوْنَ", "تَرْضَى", "تَرْضَيَانِ", "يَرْضَيْنَ", "تَرْضَى", "تَرْضَيَانِ", "تَرْضَوْنَ", "تَرْضَيْنَ", "تَرْضَيَانِ", "تَرْضَيْنَ", "أَرْضَى", "نَرْضَى", "نَرْضَى"]
        },
        10: { 
            base: { emoji: "❗", arText: "اِرْضَ", trText: "Razı ol!" },
            cekimi: ["اِرْضَ", "اِرْضَيَا", "اِرْضَوْا", "اِرْضَيْ", "اِرْضَيَا", "اِرْضَيْنَ"]
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

    "ضلل": {
        1: { 
            base: { emoji: "🌑", arText: "ضَلَّ", trText: "Saptı / Yolunu kaybetti." },
            cekimi: ["ضَلَّ", "ضَلَّا", "ضَلُّوا", "ضَلَّتْ", "ضَلَّتَا", "ضَلَلْنَ", "ضَلَلْتَ", "ضَلَلْتُمَا", "ضَلَلْتُمْ", "ضَلَلْتِ", "ضَلَلْتُمَا", "ضَلَلْتُنَّ", "ضَلَلْتُ", "ضَلَلْنَا", "ضَلَلْنَا"]
        },
        4: { 
            base: { emoji: "❓", arText: "يَضِلُّ", trText: "Sapıyor / Sapar." },
            cekimi: ["يَضِلُّ", "يَضِلَّانِ", "يَضِلُّونَ", "تَضِلُّ", "تَضِلَّانِ", "يَضْلِلْنَ", "تَضِلُّ", "تَضِلَّانِ", "تَضِلُّونَ", "تَضِلِّينَ", "تَضِلَّانِ", "تَضْلِلْنَ", "أَضِلُّ", "نَضِلُّ", "نَضِلُّ"]
        },
        5: { 
            base: { emoji: "🚫", arText: "اِضْلِلْ", trText: "Sap!" },
            cekimi: ["اِضْلِلْ", "اِضْلِلَا", "اِضْلِلُوا", "اِضْلِلِي", "اِضْلِلَا", "اِضْلِلْنَ"]
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
    },
    "عدد": {
        52: { 
            base: { emoji: "⚙️", arText: "أَعَدَّ", trText: "Hazırladı." },
            cekimi: ["أَعَدَّ", "أَعَدَّا", "أَعَدُّوا", "أَعَدَّتْ", "أَعَدَّتَا", "أَعْدَدْنَ", "أَعْدَدْتَ", "أَعْدَدْتُمَا", "أَعْدَدْتُمْ", "أَعْدَدْتِ", "أَعْدَدْتُمَا", "أَعْدَدْتُنَّ", "أَعْدَدْتُ", "أَعْدَدْنَا", "أَعْدَدْنَا"]
        },
        53: { 
            base: { emoji: "🔄", arText: "يُعِدُّ", trText: "Hazırlar / Hazırlıyor." },
            cekimi: ["يُعِدُّ", "يُعِدَّانِ", "يُعِدُّونَ", "تُعِدُّ", "تُعِدَّانِ", "يُعْدِدْنَ", "تُعِدُّ", "تُعِدَّانِ", "تُعِدُّونَ", "تُعِدِّينَ", "تُعِدَّانِ", "تُعْدِدْنَ", "أُعِدُّ", "نُعِدُّ", "نُعِدُّ"]
        },
        54: { 
            base: { emoji: "❗", arText: "أَعِدَّ", trText: "Hazırla!" },
            cekimi: ["أَعِدَّ", "أَعِدَّا", "أَعِدُّوا", "أَعِدِّي", "أَعِدَّا", "أَعْدِدْنَ"]
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
        64: { 
            base: { emoji: "⚖️", arText: "سَاوَى", trText: "Eşitledi." },
            cekimi: ["سَاوَى", "سَاوَيَا", "سَاوَوْا", "سَاوَتْ", "سَاوَتَا", "سَاوَيْنَ", "سَاوَيْتَ", "سَاوَيْتُمَا", "سَاوَيْتُمْ", "سَاوَيْتِ", "سَاوَيْتُمَا", "سَاوَيْتُنَّ", "سَاوَيْتُ", "سَاوَيْنَا", "سَاوَيْنَا"]
        },
        65: { 
            base: { emoji: "🟰", arText: "يُسَاوِي", trText: "Eşitler / Eşit oluyor." },
            cekimi: ["يُسَاوِي", "يُسَاوِيَانِ", "يُسَاوُونَ", "تُسَاوِي", "تُسَاوِيَانِ", "يُسَاوِينَ", "تُسَاوِي", "تُسَاوِيَانِ", "تُسَاوُونَ", "تُسَاوِينَ", "تُسَاوِيَانِ", "تُسَاوِينَ", "أُسَاوِي", "نُسَاوِي", "نُسَاوِي"]
        },
        66: { 
            base: { emoji: "❗", arText: "سَاوِ", trText: "Eşitle!" },
            cekimi: ["سَاوِ", "سَاوِيَا", "سَاوُوا", "سَاوِي", "سَاوِيَا", "سَاوِينَ"]
        }
    },
    "وصل": {
        77: { 
            base: { emoji: "🔗", arText: "اِتَّصَلَ", trText: "Bağlandı / İletişim kurdu." },
            cekimi: ["اِتَّصَلَ", "اِتَّصَلَا", "اِتَّصَلُوا", "اِتَّصَلَتْ", "اِتَّصَلَتَا", "اِتَّصَلْنَ", "اِتَّصَلْتَ", "اِتَّصَلْتُمَا", "اِتَّصَلْتُمْ", "اِتَّصَلْتِ", "اِتَّصَلْتُمَا", "اِتَّصَلْتُنَّ", "اِتَّصَلْتُ", "اِتَّصَلْنَا", "اِتَّصَلْنَا"]
        },
        78: { 
            base: { emoji: "📞", arText: "يَتَّصِلُ", trText: "Bağlanır / İletişim kuruyor." },
            cekimi: ["يَتَّصِلُ", "يَتَّصِلَانِ", "يَتَّصِلُونَ", "تَتَّصِلُ", "تَتَّصِلَانِ", "يَتَّصِلْنَ", "تَتَّصِلُ", "تَتَّصِلَانِ", "تَتَّصِلُونَ", "تَتَّصِلِينَ", "تَتَّصِلَانِ", "تَتَّصِلْنَ", "أَتَّصِلُ", "نَتَّصِلُ", "نَتَّصِلُ"]
        },
        79: { 
            base: { emoji: "❗", arText: "اِتَّصِلْ", trText: "Bağlan / İletişim kur!" },
            cekimi: ["اِتَّصِلْ", "اِتَّصِلَا", "اِتَّصِلُوا", "اِتَّصِلِي", "اِتَّصِلَا", "اِتَّصِلْنَ"]
        }
    },
    "خير": {
        77: { 
            base: { emoji: "🎯", arText: "اِخْتَارَ", trText: "Seçti." },
            cekimi: ["اِخْتَارَ", "اِخْتَارَا", "اِخْتَارُوا", "اِخْتَارَتْ", "اِخْتَارَتَا", "اِخْتَرْنَ", "اِخْتَرْتَ", "اِخْتَرْتُمَا", "اِخْتَرْتُمْ", "اِخْتَرْتِ", "اِخْتَرْتُمَا", "اِخْتَرْتُنَّ", "اِخْتَرْتُ", "اِخْتَرْنَا", "اِخْتَرْنَا"]
        },
        78: { 
            base: { emoji: "✅", arText: "يَخْتَارُ", trText: "Seçer / Seçiyor." },
            cekimi: ["يَخْتَارُ", "يَخْتَارَانِ", "يَخْتَارُونَ", "تَخْتَارُ", "تَخْتَارَانِ", "يَخْتَرْنَ", "تَخْتَارُ", "تَخْتَارَانِ", "تَخْتَارُونَ", "تَخْتَارِينَ", "تَخْتَارَانِ", "تَخْتَرْنَ", "أَخْتَارُ", "نَخْتَارُ", "نَخْتَارُ"]
        },
        79: { 
            base: { emoji: "❗", arText: "اِخْتَرْ", trText: "Seç!" },
            cekimi: ["اِخْتَرْ", "اِخْتَارَا", "اِخْتَارُوا", "اِخْتَارِي", "اِخْتَارَا", "اِخْتَرْنَ"]
        }
    },
    "وضأ": {
        88: { 
            base: { emoji: "💧", arText: "تَوَضَّأَ", trText: "Abdest aldı." },
            cekimi: ["تَوَضَّأَ", "تَوَضَّأَا", "تَوَضَّأُوا", "تَوَضَّأَتْ", "تَوَضَّأَتَا", "تَوَضَّأْنَ", "تَوَضَّأْتَ", "تَوَضَّأْتُمَا", "تَوَضَّأْتُمْ", "تَوَضَّأْتِ", "تَوَضَّأْتُمَا", "تَوَضَّأْتُنَّ", "تَوَضَّأْتُ", "تَوَضَّأْنَا", "تَوَضَّأْنَا"]
        },
        89: { 
            base: { emoji: "💦", arText: "يَتَوَضَّأُ", trText: "Abdest alır / Alıyor." },
            cekimi: ["يَتَوَضَّأُ", "يَتَوَضَّأَانِ", "يَتَوَضَّأُونَ", "تَتَوَضَّأُ", "تَتَوَضَّأَانِ", "يَتَوَضَّأْنَ", "تَتَوَضَّأُ", "تَتَوَضَّأَانِ", "تَتَوَضَّأُونَ", "تَتَوَضَّئِينَ", "تَتَوَضَّأَانِ", "تَتَوَضَّأْنَ", "أَتَوَضَّأُ", "نَتَوَضَّأُ", "نَتَوَضَّأُ"]
        },
        90: { 
            base: { emoji: "❗", arText: "تَوَضَّأْ", trText: "Abdest al!" },
            cekimi: ["تَوَضَّأْ", "تَوَضَّأَا", "تَوَضَّأُوا", "تَوَضَّئِي", "تَوَضَّأَا", "تَوَضَّأْنَ"]
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
            base: { emoji: "🔍", arText: "وَجَدَ", trText: "Buldu." },
            cekimi: ["وَجَدَ", "وَجَدَا", "وَجَدُوا", "وَجَدَتْ", "وَجَدَتَا", "وَجَدْنَ", "وَجَدْتَ", "وَجَدْتُمَا", "وَجَدْتُمْ", "وَجَدْتِ", "وَجَدْتُمَا", "وَجَدْتُنَّ", "وَجَدْتُ", "وَجَدْنَا", "وَجَدْنَا"]
        },
        4: { 
            base: { emoji: "🔎", arText: "يَجِدُ", trText: "Bulur / Buluyor." },
            cekimi: ["يَجِدُ", "يَجِدَانِ", "يَجِدُونَ", "تَجِدُ", "تَجِدَانِ", "يَجِدْنَ", "تَجِدُ", "تَجِدَانِ", "تَجِدُونَ", "تَجِدِينَ", "تَجِدَانِ", "تَجِدْنَ", "أَجِدُ", "نَجِدُ", "نَجِدُ"]
        },
        5: { 
            base: { emoji: "❗", arText: "جِدْ", trText: "Bul!" },
            cekimi: ["جِدْ", "جِدَا", "جِدُوا", "جِدِي", "جِدَا", "جِدْنَ"]
        },

        25: { base: { emoji: "🌌", arText: "وُجُود", trText: "Varlık / Vücud." } }, 
        29: { base: { emoji: "❤️", arText: "صَوْتُ الْوِجْدَانِ", trText: "Vicdanın sesi." } }, 
        36: { base: { emoji: "✅", arText: "الْبَضَاعَةُ مَوْجُودَةٌ فِي الْمَخْزَنِ", trText: "Mal depoda mevcut (bulunmaktadır)." } }, 
        
        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı - أَوَجَدَ -> أَوْجَدَ) ---
        52: { 
            base: { emoji: "✨", arText: "أَوْجَدَ", trText: "Var etti / İcat etti." },
            cekimi: ["أَوْجَدَ", "أَوْجَدَا", "أَوْجَدُوا", "أَوْجَدَتْ", "أَوْجَدَتَا", "أَوْجَدْنَ", "أَوْجَدْتَ", "أَوْجَدْتُمَا", "أَوْجَدْتُمْ", "أَوْجَدْتِ", "أَوْجَدْتُمَا", "أَوْجَدْتُنَّ", "أَوْجَدْتُ", "أَوْجَدْنَا", "أَوْجَدْنَا"]
        },
        53: { 
            base: { emoji: "💡", arText: "يُوجِدُ", trText: "Var eder / İcat ediyor." },
            cekimi: ["يُوجِدُ", "يُوجِدَانِ", "يُوجِدُونَ", "تُوجِدُ", "تُوجِدَانِ", "يُوجِدْنَ", "تُوجِدُ", "تُوجِدَانِ", "تُوجِدُونَ", "تُوجِدِينَ", "تُوجِدَانِ", "تُوجِدْنَ", "أُوجِدُ", "نُوجِدُ", "نُوجِدُ"]
        },
        54: { 
            base: { emoji: "❗", arText: "أَوْجِدْ", trText: "Var et / İcat et!" },
            cekimi: ["أَوْجِدْ", "أَوْجِدَا", "أَوْجِدُوا", "أَوْجِدِي", "أَوْجِدَا", "أَوْجِدْنَ"]
        },

        // --- 55: İcat (Masdar) Tenvinsiz ---
        55: { 
            base: { emoji: "📜", arText: "إِيجَاد", trText: "İcat / Var etme (Masdar)." },
            cekimi: ["إِيجَاد"]
        }, 
        
        // --- 56: Mucit (İsm-i Fail) Tenvinsiz ve Örnek Cümlesiyle ---
        56: { 
            base: { emoji: "🧠", arText: "مُوجِد", trText: "Mucit / İcat eden (İsm-i Fail)." },
            cekimi: ["مُوجِد"]
        },
        
        // --- 57: İsm-i Meful (Tenvinsiz Çekimleriyle Birlikte Eklendi) ---
        57: { 
            base: { emoji: "📦", arText: "مُوجَد", trText: "Var edilen / İcat edilen (İsm-i Meful)." },
            cekimi: ["مُوجَد"]
        }
    },
    "امن": {
        // "امن" fiiline Mazi, Muzari ve Emir (İf'al Babı - 52, 53, 54) çekimlerini ekliyoruz
        19: { base: { emoji: "👮", arText: "أَمْن", trText: "Güvenlik." } },
        22: { base: { emoji: "🛡️", arText: "الْأَمَانُ وَالصِّحَّةُ نِعْمَتَانِ", trText: "Aman (güvenlik) ve sağlık iki büyük nimettir." }, suggestsPlus: true, "ة": { emoji: "📦", arText: "الأَمَانَةُ تَجْلِبُ الرِّزْقَ", trText: "Emaneti korumak (güvenilir olmak) rızık getirir." } },
        35: { base: { emoji: "🤝", arText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ وَالْمُؤْمِنُ مَنْ أَمِنَهُ النَّاسُ", trText: "Müslüman, diğer Müslümanların elinden ve dilinden emin olduğu kimsedir." } },
        55: { base: { emoji: "❤️", arText: "الْإِيمَانُ مَا وَقَرَ فِي الْقَلْبِ", trText: "İman, kalbe yerleşen (inanılan) şeydir." } },
        56: { base: { emoji: "🕌", arText: "الْمُؤْمِنُ مِرْآةُ الْمُؤْمِنِ", trText: "Mümin, müminin aynasıdır. (Hadis-i Şerif)" } },
        61: { base: { emoji: "📝", arText: "شَرِكَةُ التَّأْمِينِ الصِّحِّيِّ", trText: "Sağlık sigortası (güvencesi/tamini) şirketi." } },
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
        }
    }
};

// ==================================================================
// YENİ KÖK SEÇİM SİSTEMİ (POPUP KLAVYE + TAHMİN)
// ==================================================================
const onemliKokler = ["كتب", "علم", "قدر", "كمل", "ملك", "سلم", "حكم", "عرف", "رحم"];
const aksamSebaKokleri = ["نصر", "ضرب", "فتح", "علم", "حسب", "كرم", "أمن", "شدد", "أكل", "سأل", "وجد", "قول", "بيع", "دعو", "مشي", "رضي", "وقي", "ضلل"];
const mezidFiilKokleri = ["عدد", "صلي", "سوي", "وصل", "خير", "وضأ", "عون", "وفي", "طوي", "خبر", "نظم", "حقق", "كمل", "شكل"];

const arapcaHarfler = "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" ");
let currentSearchQuery = ""; 

function getRootEmoji(root) {
    if(wordEasterEggs[root]) {
        const keys = Object.keys(wordEasterEggs[root]);
        if (keys.length > 0 && wordEasterEggs[root][keys[0]].base && wordEasterEggs[root][keys[0]].base.emoji) {
            return wordEasterEggs[root][keys[0]].base.emoji;
        }
    }
    return "🔹";
}

function renderVerbMenu() {
    const importantContainer = document.getElementById("important-roots-list");
    const gridContainer = document.getElementById("letters-grid-container");
    
    if(!importantContainer || !gridContainer) return;

    importantContainer.innerHTML = "";
    gridContainer.innerHTML = "";

    // 1. Önemli Kökler
    onemliKokler.forEach(root => {
        if(wordEasterEggs[root]) importantContainer.innerHTML += createFlatRootItem(root);
    });

    // 2. 4 Sütunlu Bağımsız Scroll Sistemi
    const ranges = [
        { title: "ا - خ", start: 0, end: 6 },
        { title: "د - ص", start: 7, end: 13 },
        { title: "ض - ق", start: 14, end: 20 },
        { title: "ك - ي", start: 21, end: 27 }
    ];

    const allRoots = Object.keys(wordEasterEggs);
    const rootsByLetter = {};
    arapcaHarfler.forEach(h => rootsByLetter[h] = []);
    allRoots.forEach(root => {
        const firstLetter = root.charAt(0);
        if(rootsByLetter[firstLetter]) rootsByLetter[firstLetter].push(root);
    });

    ranges.forEach(range => {
        let colHTML = `<div class="letter-column"><div class="col-range-header">${range.title}</div>`;
        for(let i = range.start; i <= range.end; i++) {
            let letter = arapcaHarfler[i];
            if (rootsByLetter[letter] && rootsByLetter[letter].length > 0) {
                colHTML += `<div class="letter-group-title">${letter}</div>`;
                colHTML += `<div class="flat-root-list" style="padding: 0 10px; justify-content: center;">`;
                rootsByLetter[letter].forEach(r => { colHTML += createFlatRootItem(r); });
                colHTML += `</div>`;
            }
        }
        colHTML += `</div>`;
        gridContainer.innerHTML += colHTML;
    });

    // 3. Popup Klavyeyi Oluştur
    renderSearchKeyboard();
}

function createFlatRootItem(root) {
    return `<div class="flat-root-item root-item" data-root="${root}" onclick="selectRootFromMenu('${root}')">
        <span>${root}</span>
        <span style="margin-right:8px;">${getRootEmoji(root)}</span>
    </div>`;
}

function selectRootFromMenu(root) {
    closeSlideMenu();
    closeSearchKeyboard();
    // Arama Verilerini Sıfırla
    currentSearchQuery = "";
    const searchInput = document.getElementById("root-search");
    if(searchInput) searchInput.value = "";
    document.getElementById("root-predictions").innerHTML = "";
    
    // Uygulamanın Orijinal Kök Seçme Komutunu Başlat
    if (typeof selectReadyVerb === 'function') {
        selectReadyVerb(root);
    }
}

// --- POPUP ARAMA KLAVYESİ ---
function openSearchKeyboard(e) {
    if (e) e.stopPropagation();
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    const popup = document.getElementById('integrated-keyboard-popup');
    const backdrop = document.getElementById('keyboard-backdrop'); 
    
    if (popup) popup.classList.add('active');
    if (backdrop) backdrop.classList.add('active'); // Kalkanı aç
}

function closeSearchKeyboard() {
    if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
    
    const popup = document.getElementById('integrated-keyboard-popup');
    const backdrop = document.getElementById('keyboard-backdrop'); 
    
    if (popup) popup.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active'); // Kalkanı kapat
}

function renderSearchKeyboard() {
    const kbContainer = document.getElementById("integrated-keyboard");
    if(!kbContainer) return;

    // Sizin Orijinal Klavyenizle Birebir Aynı Dizilim (LTR Yönünde)
    const kbRows = [
        ['ذ', 'ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
        ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
        ['ئ', 'ء', 'ؤ', 'ر', 'ى', 'ة', 'و', 'ز', 'ظ', 'BACKSPACE']
    ];

    let kbHTML = "";
    kbRows.forEach(row => {
        kbHTML += `<div class="search-kb-row">`;
        row.forEach(char => {
            if (char === 'BACKSPACE') {
                kbHTML += `<div class="search-key backspace" onclick="handleSearchKey('BACKSPACE')">⌫</div>`;
            } else {
                kbHTML += `<div class="search-key" onclick="handleSearchKey('${char}')">${char}</div>`;
            }
        });
        kbHTML += `</div>`;
    });

    kbContainer.innerHTML = kbHTML;
}

function handleSearchKey(char) {
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    if (char === 'BACKSPACE') {
        currentSearchQuery = currentSearchQuery.slice(0, -1);
    } else {
        if (currentSearchQuery.length < 3) { // Kökler max 3 harf olur
            currentSearchQuery += char;
        }
    }

    const searchInput = document.getElementById("root-search");
    if(searchInput) searchInput.value = currentSearchQuery;

    updatePredictionsAndFilter();
}

function updatePredictionsAndFilter() {
    let filter = currentSearchQuery.trim();
    
    // 1. Ekrandaki Kartları Filtrele
    const allItems = document.querySelectorAll('.root-item');
    allItems.forEach(item => {
        if(item.dataset.root.includes(filter)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });

    // 2. Tahmin (Autocomplete) Çubuğunu Güncelle
    const predictionsContainer = document.getElementById("root-predictions");
    predictionsContainer.innerHTML = "";
    
    if (filter.length > 0) {
        const allRoots = Object.keys(wordEasterEggs);
        // Yazılan harflerle BAŞLAYAN kökleri öncelikli getir
        const matches = allRoots.filter(r => r.startsWith(filter)).slice(0, 15);
        
        matches.forEach(r => {
            predictionsContainer.innerHTML += `
                <div class="prediction-chip" onclick="selectRootFromMenu('${r}')">
                    ${r} ${getRootEmoji(r)}
                </div>`;
        });
    }
}


// --- AŞAĞIDAN ÇIKAN SLIDE MENÜ KONTROLLERİ ---
function openSlideMenu(type) {
    closeSearchKeyboard(); // Klavye açıksa menü çakışmasın diye kapat
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    const slideMenu = document.getElementById('slide-up-menu');
    const slideTitle = document.getElementById('slide-title');
    const slideContent = document.getElementById('slide-content');
    const slideBackdrop = document.getElementById('slide-menu-backdrop'); // KALKANI BUL
    
    slideContent.innerHTML = "";
    if (type === 'aksam') {
        slideTitle.innerText = "أقسام السبعة";
        aksamSebaKokleri.forEach(r => { if(wordEasterEggs[r]) slideContent.innerHTML += createFlatRootItem(r); });
    } else {
        slideTitle.innerText = "مزيد";
        mezidFiilKokleri.forEach(r => { if(wordEasterEggs[r]) slideContent.innerHTML += createFlatRootItem(r); });
    }
    
    if (slideMenu) slideMenu.classList.add('active');
    if (slideBackdrop) slideBackdrop.classList.add('active'); // KALKANI AÇ
}

function closeSlideMenu() {
    if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
    
    const slideMenu = document.getElementById('slide-up-menu');
    const slideBackdrop = document.getElementById('slide-menu-backdrop'); // KALKANI BUL
    
    if (slideMenu) slideMenu.classList.remove('active');
    if (slideBackdrop) slideBackdrop.classList.remove('active'); // KALKANI KAPAT
}

// Sayfa Yüklendiğinde Sistemi Başlat
document.addEventListener("DOMContentLoaded", () => {
    renderVerbMenu();
});


const SoundEngine = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },
    
    // 1. Tok ve Ciddi Tıklama (Premium dokunmatik / haptic hissiyatı)
    playClick() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        // Frekans çok daha düşük (pes), bu sayede "bip" değil "tık/tok" sesi çıkarır
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.03);
        
        // Çok düşük ses seviyesi ve anında kesilme (0.03 saniye)
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
    },
    
    // 2. Yumuşak ve Derin Kapatma Sesi (Soft Cancel)
    playClose() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine'; 
        // İptal hissi için çok pes frekanslardan dibe doğru iniş
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);
        
        // Ses seviyesi (volume) çok kısık, kulak yormaz
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    },
    
    // 3. Sıfırlama / Onaylama (Hareketli zil yerine; sıcak, tekil ve soft bir nefes)
    playReset() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        // Sıcak ve güven veren orta-pes bir frekans sabiti (E4 Notası)
        osc.frequency.setValueAtTime(329.63, now); 
        
        // Ses aniden değil, yumuşakça (fade-in) girip çok yumuşakça (fade-out) söner
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 0.05); // Zirve sesi çok kısıldı (0.03)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25); 
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.3);
    }
};


// Temizlik fonksiyonu
function closeAllZoomedBoxes() {
    document.querySelectorAll('.zoom-overlay').forEach(overlay => {
        overlay.classList.remove('active');
    });
    
    // Ekranda açık olan DEV KALIP klonunu sil
    const clone = document.getElementById('crisp-zoom-clone');
    if (clone) clone.remove();

    // Ekranda açık olan KAHVERENGİ KÖK klonunu sil
    const rootClone = document.getElementById('crisp-root-clone');
    if (rootClone) rootClone.remove();
    
    document.querySelectorAll('.glass-box.pulse-highlight').forEach(box => {
        box.classList.remove('pulse-highlight', 'pulse-settled'); 
        box.style.transform = "";
        box.style.borderColor = ""; 
        box.style.boxShadow = "";
    });
}

window.onload = function() {
    const zoomCheckbox = document.getElementById('zoomToggleCheckbox');
    if (zoomCheckbox) {
        zoomCheckbox.checked = false;
    }

    document.querySelectorAll('.glass-box').forEach((box) => {
        const textEl = box.querySelector('.ar, .ar-small');
        if (textEl) {
            // Orijinal düz metni alıyoruz
            if (!textEl.hasAttribute('data-original')) {
                textEl.setAttribute('data-original', textEl.innerText.trim());
            }
            box.style.cursor = "pointer";
            
            // İLK AÇILIŞTA RENKLENDİRME! (Siyah açılma sorununu ebediyen çözer)
            let originalText = textEl.getAttribute('data-original');
            if (originalText && originalText !== "-") {
                textEl.innerHTML = ColorEngine.colorize(originalText, ['ف', 'ع', 'ل']);
            }

            const refSpan = box.querySelector('.ref');
            if (refSpan) {
                const rId = parseInt(refSpan.textContent.trim());
                if ((rId >= 1 && rId <= 16) || [52,53,54,58,59,60,64,65,66,71,72,73,77,78,79,83,84,85,88,89,90,94,95,96,100,101,102].includes(rId)) {
                    box.setAttribute('data-tiklama-sayisi', '0');
                }
            }
            box.onclick = function() { handleBoxClick(this); };
        }
    });

    const sliderContainer = document.querySelector('.window-pencere');
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', (e) => {
            SoundEngine.init(); 
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipeGesture();
        }, { passive: true });

        sliderContainer.addEventListener('wheel', (e) => {
            const now = Date.now();
            if (now - lastWheelTime < wheelCooldown) return; 

            if (Math.abs(e.deltaX) > 25 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                SoundEngine.init();
                if (e.deltaX > 0) {
                    if (currentTabActive === 0) { setTab(1); lastWheelTime = now; }
                } else {
                    if (currentTabActive === 1) { setTab(0); lastWheelTime = now; }
                }
                e.preventDefault();
            }
        }, { passive: false });
    }
};

document.addEventListener('click', closeIfOutside);
document.addEventListener('touchstart', closeIfOutside, { passive: false });

function closeIfOutside(e) {
    const isInside = e.target.closest('.conjugation-inline-container') || e.target.closest('.glass-box');
    if (!isInside) {
        // Tabloları Kapat
        document.querySelectorAll('.glass-box.matrix-opened').forEach(box => {
            const closeBtn = box.querySelector('.matrix-close-btn');
            if (closeBtn) closeInlineMatrix(null, closeBtn);
        });
        
        // Boşluğa tıklanınca/dokunulunca Büyümüş Kutu (Zoom) Varsa Kapat
        if (typeof closeAllZoomedBoxes === 'function') {
            closeAllZoomedBoxes();
        }
    }
}

function handleSwipeGesture() {
    const distance = touchStartX - touchEndX;
    if (Math.abs(distance) > minSwipeDistance) {
        if (distance > 0 && currentTabActive === 1) { setTab(0); } 
        else if (distance < 0 && currentTabActive === 0) { setTab(1); }
    }
}

// ==================================================================
// 1. TABLO GEÇİŞİ (Sağa Kayma ve Boşluk Hatasının Çözümü)
// ==================================================================
function setTab(tabIndex) {
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick(); 
    const band = document.getElementById('mainSliderBandi');
    const switcher = document.getElementById('tabSwitch');
    
    currentTabActive = tabIndex;

    // KESİN ÇÖZÜM: Tabloların içerik boyutuna göre sınırlarını esnetmesini engelliyoruz (min-width: 0 kuralı)
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.minWidth = "0"; 
        tab.style.overflowX = "auto";
    });

    if (tabIndex === 1) {
        switcher.classList.remove("mucerred-active");
        switcher.classList.add("mezid-active");
        
        band.style.transform = "translateX(50%)"; 
    } else {
        switcher.classList.remove("mezid-active");
        switcher.classList.add("mucerred-active");
        
        band.style.transform = "translateX(0%)";  
    }
}

function openVerbModal() {
    SoundEngine.playClick();
    document.getElementById('verb-overlay').style.display = 'flex';
}

function closeVerbModal() {
    SoundEngine.playClose();
    document.getElementById('verb-overlay').style.display = 'none';
}



function selectReadyVerb(verb) {
    if (typeof clearDraggableRoots === 'function') clearDraggableRoots();
    if (typeof SoundEngine !== "undefined") SoundEngine.playReset();
    if (typeof resetTableOnly === 'function') resetTableOnly(true); 
    
    // HATA ÇÖZÜMÜ: Başında "let" olmadan global değişkeni güncelliyoruz
    currentEggIndex = 0; 
    
    const trimmedRoot = verb.trim();
    if (trimmedRoot.length !== 3) return;
    currentRoot = trimmedRoot;
    
    const rootDisplay = document.getElementById('root-text-display');
    if (rootDisplay) rootDisplay.innerText = currentRoot;
    
    if (typeof closeVerbModal === 'function') closeVerbModal();
    if (typeof highlightEasterEggBoxes === 'function') highlightEasterEggBoxes(currentRoot);
    
    if (typeof autoSpawnRootClone === 'function') autoSpawnRootClone();
    if (typeof currentTabActive !== 'undefined' && currentTabActive === 1 && typeof setTab === 'function') setTab(0);

    // ==================================================================
    // MOBİL İÇİN SABİT ÜST BAR VE 2 SÜTUN MANTIĞI
    // ==================================================================
    if (window.innerWidth <= 1024) {
        let topBar = document.getElementById('mobile-top-bar');
        if (!topBar) {
            topBar = document.createElement('div');
            topBar.id = 'mobile-top-bar';
            
            // 1. Geri Tuşu (Sağda duracak ama SOL OK olacak)
            const backBtn = document.createElement('div');
            backBtn.className = 'mobile-back-btn';
            backBtn.innerHTML = '<i class="fas fa-arrow-left"></i>'; 
            backBtn.onclick = () => { if (typeof openVerbModal === 'function') openVerbModal(); };
            
            // 2. Orta: Kök Gösterimi
            const rootDisp = document.createElement('div');
            rootDisp.className = 'mobile-root-display';
            
            // 3. Artı Tuşu (Solda duracak, ekler için)
            const plusBtn = document.createElement('div');
            plusBtn.className = 'mobile-top-plus';
            plusBtn.id = 'mobile-top-plus';
            plusBtn.innerHTML = '<i class="fas fa-plus"></i>';
            plusBtn.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (typeof toggleSuffixMenu === 'function') toggleSuffixMenu(e);
            };
            
            // Sıralama: Önce Artı (Sol), sonra Kök (Orta), en son Geri (Sağ)
            topBar.appendChild(plusBtn); 
            topBar.appendChild(rootDisp);
            topBar.appendChild(backBtn); 
            
            const mGrid = document.getElementById('mobile-grid');
            if (mGrid) document.body.insertBefore(topBar, mGrid);
        }
        
        // Üst bardaki metni güncelle ve artı butonunun ışığını söndür
        const mobileRootDisplay = topBar.querySelector('.mobile-root-display');
        if (mobileRootDisplay) mobileRootDisplay.innerText = currentRoot;
        
        const mobilePlusBtn = topBar.querySelector('.mobile-top-plus');
        if (mobilePlusBtn) mobilePlusBtn.classList.remove('plus-highlighted');

        // Mobildeki alt grid kısmına sadece o kökün kutularını klonla
        const mGrid = document.getElementById('mobile-grid');
        if (mGrid) {
            mGrid.innerHTML = ''; 
            if (typeof getSortedRefsForRoot === 'function') {
                const refs = getSortedRefsForRoot(currentRoot); 
                
                refs.forEach(refId => {
                    const origBox = Array.from(document.querySelectorAll('.window-pencere .glass-box')).find(b => {
                        const refEl = b.querySelector('.ref');
                        return refEl && parseInt(refEl.innerText.trim()) === refId;
                    });
                    
                    if (origBox) {
                        const clone = origBox.cloneNode(true);
                        clone.className = 'glass-box sari-vurgu fiil-box'; 
                        if (clone.hasAttribute('data-tiklama-sayisi')) clone.setAttribute('data-tiklama-sayisi', '0');
                        clone.onclick = function() { if (typeof handleBoxClick === 'function') handleBoxClick(this); };
                        mGrid.appendChild(clone);
                    }
                });
            }
        }
    }
}
function clearOtherActiveBoxes(currentBox) {
    document.querySelectorAll('.glass-box').forEach(box => {
        if (box !== currentBox) {
            box.classList.add('no-transition'); 
            box.classList.remove("pulse-highlight");
            box.style.transform = "";
            void box.offsetWidth;
            
            if (box.classList.contains('matrix-opened')) {
                const closeBtn = box.querySelector('.matrix-close-btn');
                if (closeBtn) closeInlineMatrix(null, closeBtn);
            }
            
            setTimeout(() => {
                if (box) box.classList.remove('no-transition');
            }, 50);
        }
    });
}

function getBabAndType(refId) {
    let type = "";
    let babNo = 1;

    if (refId >= 1 && refId <= 16) {
        if ([1, 8, 11, 14].includes(refId)) {
            type = "mazi";
            if (refId === 1) babNo = 1; 
            else if (refId === 8) babNo = 4;
            else if (refId === 11) babNo = 5;
            else if (refId === 14) babNo = 6;
        } else if ([2, 4, 6, 9, 12, 15].includes(refId)) {
            type = "muzari";
            if (refId === 2) babNo = 1;
            else if (refId === 4) babNo = 2;
            else if (refId === 6) babNo = 3;
            else if (refId === 9) babNo = 4;
            else if (refId === 12) babNo = 5;
            else if (refId === 15) babNo = 6;
        } else if ([3, 5, 7, 10, 13, 16].includes(refId)) {
            type = "emir";
            if (refId === 3) babNo = 1;
            else if (refId === 5) babNo = 2;
            else if (refId === 7) babNo = 3;
            else if (refId === 10) babNo = 4;
            else if (refId === 13) babNo = 5;
            else if (refId === 16) babNo = 6;
        }
    } 
    else if ([52,53,54,58,59,60,64,65,66,71,72,73,77,78,79,83,84,85,88,89,90,94,95,96,100,101,102].includes(refId)) {
        if ([52,58,64,71,77,83,88,94,100].includes(refId)) type = "mazi";
        else if ([53,59,65,72,78,84,89,95,101].includes(refId)) type = "muzari";
        else if ([54,60,66,73,79,85,90,96,102].includes(refId)) type = "emir";

        if (refId >= 52 && refId <= 54) babNo = 7;
        else if (refId >= 58 && refId <= 60) babNo = 8;
        else if (refId >= 64 && refId <= 66) babNo = 9;
        else if (refId >= 71 && refId <= 73) babNo = 10;
        else if (refId >= 77 && refId <= 79) babNo = 11;
        else if (refId >= 83 && refId <= 85) babNo = 12;
        else if (refId >= 88 && refId <= 90) babNo = 13;
        else if (refId >= 94 && refId <= 96) babNo = 14;
        else if (refId >= 100 && refId <= 102) babNo = 15;
    }
    return { type, babNo };
}

// ==================================================================
// 1. KUTU SIFIRLAMA (Sarı Vurgu Tetiklemesi Kaldırıldı)
// ==================================================================
function resetBox(el) {
    const textEl = el.querySelector('.ar, .ar-small');
    if (!textEl) return;
    
    const originalText = el.getAttribute('data-original') || textEl.innerText;
    textEl.innerHTML = ColorEngine.colorize(originalText, ['ف', 'ع', 'ل']);
    
    el.style.backgroundColor = "";
    el.style.borderColor = "";
    el.style.boxShadow = ""; 
    
    el.classList.remove('matrix-opened');
    const container = el.querySelector('.conjugation-inline-container');
    if (container) {
        container.remove(); 
    }
    
    const triggerBtn = el.querySelector('.easter-egg-trigger');
    if (triggerBtn) {
        triggerBtn.remove();
    }

    const refSpan = el.querySelector('.ref');
    if (refSpan) {
        const rId = refSpan.innerText.trim();
        document.querySelectorAll(`.easter-egg-emoji[data-ref="${rId}"]`).forEach(emoji => emoji.remove());
    }
    
    const plusBtn = document.querySelector('.fa-plus');
    if (plusBtn) plusBtn.classList.remove('plus-highlighted');
    
    if (el.hasAttribute('data-tiklama-sayisi')) {
        el.setAttribute('data-tiklama-sayisi', '0');
    }

 // ==================================================================
    // KESİN ÇÖZÜM 1: Kutu sıfırlandığında emojiyi ve + rozetini tamamen unutur!
    // ==================================================================
    el.removeAttribute('data-last-root');
    el.removeAttribute('data-last-emoji');
    el.removeAttribute('data-plus-animated'); // Animasyon hafızasını siler
    
    // YENİ: Kutunun köşesinde kalan saydam + rozetini (HTML olarak) tamamen siler
    const hintBadge = el.querySelector('.plus-hint-badge');
    if (hintBadge) hintBadge.remove();
}

// ==================================================================
// 1. SADECE FİİLLERİN KALIP NUMARASINA TIKLAYINCA TABLO AÇMA
// ==================================================================
document.addEventListener('click', function(e) {
    const refEl = e.target.closest('.ref');
    if (refEl) {
        const boxElement = refEl.closest('.glass-box');
        
        // ŞART EKLENDİ: Kutu hem aktif (kırmızı) OLMALI, hem de "fiil-box" OLMALI
        if (boxElement && boxElement.classList.contains('current-active-red') && boxElement.classList.contains('fiil-box')) {
            e.preventDefault();
            e.stopPropagation();

            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            
            const refId = parseInt(refEl.innerText);
            const mapping = typeof getBabAndType === 'function' ? getBabAndType(refId) : null;
            const kalip = boxElement.getAttribute('data-original');
            const currentRootSafe = (typeof currentRoot !== 'undefined') ? currentRoot : "";
            
            const textEl = boxElement.querySelector('.ar, .ar-small');
            lastClickedBoxTextSpan = textEl; 
            lastOriginalWord = kalip;

            if (mapping && typeof babVezinleri !== 'undefined') {
                const vezinObj = babVezinleri[mapping.babNo];
                let anaVezin = (vezinObj && vezinObj[mapping.type]) ? vezinObj[mapping.type] : kalip;
                
                if (typeof openConjugationPopup === 'function') {
                    openConjugationPopup(currentRootSafe, mapping.babNo, mapping.type, anaVezin);
                }
                
                document.querySelectorAll(`.easter-egg-emoji[data-ref="${refId}"]`).forEach(emoji => emoji.remove());
            }
        }
    }
}, true);

function handleBoxClick(boxElement) {
    const textEl = boxElement.querySelector('.ar, .ar-small');
    const refEl = boxElement.querySelector('.ref');
    if (!textEl || !refEl) return;

    const currentRootSafe = (typeof currentRoot !== 'undefined') ? currentRoot : "";
    const refId = parseInt(refEl.innerText);
    const kalip = boxElement.getAttribute('data-original');

    lastClickedBoxTextSpan = textEl;
    lastOriginalWord = kalip;

    if (typeof wordEasterEggs !== 'undefined' && wordEasterEggs[currentRootSafe]) {
        const sortedRefs = getSortedRefsForRoot(currentRootSafe);
        const idx = sortedRefs.indexOf(refId);
        if (idx !== -1) currentEggIndex = idx;
    }

    if (boxElement.getAttribute('data-modal-closed') === 'true') {
        boxElement.removeAttribute('data-modal-closed');
    }

    let tiklama = parseInt(boxElement.getAttribute('data-tiklama-sayisi') || '0');
    const mapping = getBabAndType(refId);
    
    // =======================================================
    // MOBİLDE BÜYÜTMEYİ (ZOOM) ZORLA İPTAL ET
    // (Çift tanımlama hatası giderildi, tek satırda birleştirildi)
    // =======================================================
    const isZoomEnabled = window.innerWidth <= 1024 ? false : (document.getElementById('zoomToggleCheckbox') ? document.getElementById('zoomToggleCheckbox').checked : false);

  
    // KELİMEYİ TÜRETEN FONKSİYON (Tek Veri Kaynağı: wordEasterEggs)
    const applyWordTransformation = () => {
        const vezinObj = babVezinleri[mapping.babNo];
        let kalipMetni = (vezinObj && vezinObj[mapping.type]) ? vezinObj[mapping.type] : kalip;
        
        let plainWord = kalipMetni;
        let hasMultipleUses = false; // YENİ: Çoklu kullanım kontrolü
        
       if (currentRootSafe.length === 3) {
            // ÖZEL ÇEKİM LİSTESİNDE VAR MI KONTROL ET (TEK VERİ KAYNAĞI)
            if (typeof wordEasterEggs !== 'undefined' && 
                wordEasterEggs[currentRootSafe] && 
                wordEasterEggs[currentRootSafe][refId]) {
                
                let eggObj = wordEasterEggs[currentRootSafe][refId];
                
                // 1. Önce tek kelimelik arText var mı diye bak (Cümleyi kutuya sığdırmaya çalışmasını engeller!)
                if (eggObj.base && eggObj.base.arText && eggObj.base.arText.trim().split(/\s+/).length === 1) {
                    plainWord = eggObj.base.arText;
                } 
                // 2. Yoksa çekim dizisinin ilk elemanını al
                else if (eggObj.cekimi && eggObj.cekimi.length > 0) {
                    let ilkEleman = eggObj.cekimi[0];
                    plainWord = typeof ilkEleman === 'object' ? ilkEleman.ar : ilkEleman;
                } 
                else if (eggObj.base && eggObj.base.cekimi && eggObj.base.cekimi.length > 0) {
                    let ilkEleman = eggObj.base.cekimi[0];
                    plainWord = typeof ilkEleman === 'object' ? ilkEleman.ar : ilkEleman;
                }
                // 3. Eğer CÜMLE girilmişse, standart sarf motoruyla sadece asıl kelimeyi türetip kutuya koy
                else {
                    plainWord = applyRootToKalip(currentRootSafe, kalipMetni);
                }
                
                // Çoklu kullanım (Alt Tablo) kontrolü
                if ((eggObj.cekimi && eggObj.cekimi.length > 1) || (eggObj.base && eggObj.base.cekimi && eggObj.base.cekimi.length > 1)) {
                    hasMultipleUses = true;
                }
            } else {
                // Yoksa normal algoritma ile oluştur
                plainWord = applyRootToKalip(currentRootSafe, kalipMetni);
            }
        }

        let activeRootArray = (currentRootSafe.length === 3) ? currentRootSafe.split("") : ['ف', 'ع', 'ل'];
        const coloredHTML = ColorEngine.colorize(plainWord, activeRootArray);
        
        textEl.innerHTML = coloredHTML;
        lastOriginalWord = plainWord; 


       // === YENİ EKLENEN KISIM: Kutuya "Kök Türetildi" ve "Çoklu Kullanım" etiketi ver ===
        const currentBox = textEl.closest('.glass-box');
        if (currentBox) {
            currentBox.classList.add('kok-turendi');
            
            if (!currentBox.classList.contains('fiil-box') && hasMultipleUses) {
                currentBox.classList.add('coklu-kullanim');
                const refBtn = currentBox.querySelector('.ref');
                
                if (refBtn) {
                    // ÇÖZÜM: Tıklanan kutuyu (lastClickedBoxTextSpan) sisteme zorla tanıtıyoruz ki hafıza karışmasın!
                    refBtn.setAttribute('onclick', `event.preventDefault(); event.stopPropagation(); const box = this.closest('.glass-box'); lastClickedBoxTextSpan = box.querySelector('.ar, .ar-small'); lastOriginalWord = box.getAttribute('data-original'); openConjugationPopup('${currentRootSafe}', ${refId}, 'isim', '');`);
                }
            }
        }
        // ==============================================================
        // ==============================================================
        // ==============================================================

        // Ekranda dev klon varsa onu da anında türet ve yeşile boya
        const clone = document.getElementById('crisp-zoom-clone');
        if (clone) {
            const cloneTextEl = clone.querySelector('.ar, .ar-small');
            if (cloneTextEl) cloneTextEl.innerHTML = coloredHTML;
            clone.style.setProperty("background-color", "#bfffdf", "important");
            clone.style.borderColor = "#000000";
        }
        
        if (typeof checkWordEasterEgg === 'function') checkWordEasterEgg(boxElement); 
    };

    if (isZoomEnabled) {
        if (tiklama === 0) {
            // 1. AŞAMA: Sadece Kırmızı Vurgu
            document.querySelectorAll('.glass-box').forEach(b => b.classList.remove('current-active-red'));
            boxElement.classList.add('current-active-red');
            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            boxElement.setAttribute('data-tiklama-sayisi', '1');
            
        } else if (tiklama === 1) {
            // 2. AŞAMA: Türemeden Büyüt
            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            if (typeof triggerAreaPulse === 'function') triggerAreaPulse(boxElement);
            boxElement.setAttribute('data-tiklama-sayisi', '2');
            
        } else if (tiklama === 2) {
            // 3. AŞAMA: Türet ve Yeşil Yap
            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            boxElement.style.setProperty("background-color", "#bfffdf", "important"); 
            boxElement.style.borderColor = "#000000"; 
            applyWordTransformation(); 
            boxElement.setAttribute('data-tiklama-sayisi', '3');
            
        } else if (tiklama === 3) {
            // 4. AŞAMA: Büyümeyi kapat, Kelimeyi tabloda bırak
            if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
            boxElement.classList.remove('current-active-red'); 
            boxElement.setAttribute('data-tiklama-sayisi', '4'); 
            if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();

        } else {
            // 5. AŞAMA: Manuel Tıklamada Sıfırla
            if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
            if (typeof resetBox === 'function') resetBox(boxElement); 
            boxElement.removeAttribute('data-tiklama-sayisi');
            boxElement.classList.remove('current-active-red', 'kok-turendi', 'coklu-kullanim'); 
            boxElement.style.setProperty("background-color", "", "important");
            if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();
            
            // Sıfırlamada tıklama olayını temizle ki karışıklık olmasın
            if (refEl && refEl.hasAttribute('onclick')) {
                refEl.removeAttribute('onclick');
            }
        }
    } else {
        // Zoom Kapalı Sistemi 
        if (window.innerWidth <= 1024) {
            // MOBİL HIZLI SİSTEM: İLK TIKLAMADA TÜRET, İKİNCİDE SİL
            if (tiklama === 0) {
                document.querySelectorAll('.glass-box').forEach(b => b.classList.remove('current-active-red'));
                boxElement.classList.add('current-active-red');
                if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
                boxElement.style.setProperty("background-color", "#bfffdf", "important"); 
                boxElement.style.borderColor = "#000000"; 
                applyWordTransformation(); 
                boxElement.setAttribute('data-tiklama-sayisi', '1');
            } else {
                if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
                if (typeof resetBox === 'function') resetBox(boxElement);
                boxElement.removeAttribute('data-tiklama-sayisi');
                boxElement.classList.remove('current-active-red', 'kok-turendi', 'coklu-kullanim'); 
                boxElement.style.setProperty("background-color", "", "important");
                if (refEl && refEl.hasAttribute('onclick')) refEl.removeAttribute('onclick');
                
                // Artı işaretinin ışığını da söndür
                const mobilePlus = document.getElementById('mobile-top-plus');
                if (mobilePlus) mobilePlus.classList.remove('plus-highlighted');
            }
        } else {
            // MASAÜSTÜ KADEMELİ SİSTEM
            if (tiklama === 0) {
                // 1. Tıklama: Kırmızı Vurgu
                document.querySelectorAll('.glass-box').forEach(b => b.classList.remove('current-active-red'));
                boxElement.classList.add('current-active-red');
                if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
                boxElement.setAttribute('data-tiklama-sayisi', '1');
            } else if (tiklama === 1) {
                // 2. Tıklama: Türet ve Yeşil Yap
                if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
                boxElement.style.setProperty("background-color", "#bfffdf", "important"); 
                boxElement.style.borderColor = "#000000"; 
                applyWordTransformation(); 
                boxElement.setAttribute('data-tiklama-sayisi', '2');
            } else {
                // 3. Tıklama ve sonrası: Kökü, dolguyu ve çerçeveyi tamamen sıfırla
                if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
                if (typeof resetBox === 'function') resetBox(boxElement);
                boxElement.removeAttribute('data-tiklama-sayisi');
                boxElement.classList.remove('current-active-red', 'kok-turendi', 'coklu-kullanim'); 
                boxElement.style.setProperty("background-color", "", "important");
                if (refEl && refEl.hasAttribute('onclick')) refEl.removeAttribute('onclick');
            }
        }
    }
}
function closeInlineMatrix(e, btnElement) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    SoundEngine.playClose();
    
    const boxElement = btnElement.closest('.glass-box');
    if (boxElement) {
        boxElement.classList.add('no-transition');
        boxElement.classList.remove('matrix-opened');
        boxElement.style.zIndex = "";
        
        const container = boxElement.querySelector('.conjugation-inline-container');
        if (container) {
            // ÇÖZÜM: 'none' yerine boş bırakıyoruz ki CSS dosyasındaki açma/kapama kurallarını ezmesin!
            container.style.display = ''; 
        }

        setTimeout(() => {
            boxElement.classList.remove('no-transition');
        }, 50);
    }
}

function applyToSpecificBox(boxElement) {
    const targetEl = boxElement.querySelector('.ar, .ar-small');
    if (!targetEl) return;
    const kalip = targetEl.getAttribute('data-original');

    clearOtherActiveBoxes(boxElement);

    if (boxElement.style.backgroundColor) {
        SoundEngine.playClose();
        
        // Kutu seçimi iptal edildiğinde de varsayılan kalıbı (فعل) renkli bırak
        targetEl.innerHTML = ColorEngine.colorize(kalip, ['ف', 'ع', 'ل']); 
        
        boxElement.style.backgroundColor = "";
        boxElement.style.borderColor = "";
        boxElement.style.boxShadow = ""; 
        lastOriginalWord = kalip;
        
        const triggerBtn = boxElement.querySelector('.easter-egg-trigger');
        if (triggerBtn) {
            triggerBtn.remove();
        }
        
        // YENİ: İsim kutusuna tekrar basılıp iptal edildiğinde tepedeki emojiyi sil
        const refSpan = boxElement.querySelector('.ref');
        if (refSpan) {
            const rId = refSpan.innerText.trim();
            document.querySelectorAll(`.easter-egg-emoji[data-ref="${rId}"]`).forEach(emoji => emoji.remove());
        }
        
        const plusBtn = document.querySelector('.fa-plus');
        if (plusBtn) plusBtn.classList.remove('plus-highlighted');
        
        if (currentRoot && currentRoot.length === 3) {
            highlightEasterEggBoxes(currentRoot);
        }
        return;
    }

    SoundEngine.playClick();
    const currentRootSafe = (typeof currentRoot !== 'undefined') ? currentRoot : "";
    let plainWord = (currentRootSafe.length === 3) ? applyRootToKalip(currentRootSafe, kalip) : kalip;
    
    // Her zaman renklendir: Kök girilmişse o kökü, girilmemişse 'فعل' harflerini baz al
    let activeRootArray = (currentRootSafe.length === 3) ? currentRootSafe.split("") : ['ف', 'ع', 'ل'];
    targetEl.innerHTML = ColorEngine.colorize(plainWord, activeRootArray);
    
    lastOriginalWord = plainWord;
    triggerAreaPulse(boxElement); 
    checkWordEasterEgg(boxElement);
}

function applyRootToKalip(root, kalip) {
    if (!root || root.length !== 3) return kalip;
    const r = root.split(""); 
    
    // 1. Ham yerleştirme (Arakom fontuna uygun style dahil)
    let result = kalip;
    result = result.replace(/ف/g, "===F===");
    result = result.replace(/ع/g, "===A===");
    result = result.replace(/ل/g, "===L===");
    
    result = result.replace(/===F===/g, r[0]);
    result = result.replace(/===A===/g, r[1]);
    result = result.replace(/===L===/g, r[2]);
    
    // 2. Sarf kurallarını uygula (İ'lâl, İdğâm, Hemze)
    result = SarfEngine.applyRules(result, r);
    
    return result;
}

function openConjugationPopup(kok, babNo, tip, anaVezin) {
    if (!lastClickedBoxTextSpan) return;
    const boxElement = lastClickedBoxTextSpan.closest('.glass-box');
    if (!boxElement) return;
    if (!boxElement.classList.contains('kok-turendi')) return; 

    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    if (!kok || kok.length !== 3) kok = "فعل"; 

    const refEl = boxElement.querySelector('.ref');
    const refId = refEl ? parseInt(refEl.innerText) : 0;

    document.querySelectorAll('.glass-box').forEach(box => { box.style.zIndex = "1"; });
    document.querySelectorAll('.glass-box.matrix-opened').forEach(openBox => {
        if (openBox !== boxElement) {
            const openCloseBtn = openBox.querySelector('.matrix-close-btn');
            if (openCloseBtn) closeInlineMatrix(null, openCloseBtn);
        }
    });

    boxElement.classList.add('no-transition'); 
    boxElement.classList.remove("pulse-highlight");
    boxElement.style.transform = "";
    void boxElement.offsetWidth; 
    setTimeout(() => { if (boxElement) boxElement.classList.remove('no-transition'); }, 50);

    let inlineContainer = boxElement.querySelector('.conjugation-inline-container');
    if (!inlineContainer) {
        inlineContainer = document.createElement('div');
        inlineContainer.className = 'conjugation-inline-container';
        boxElement.appendChild(inlineContainer);
    }

    if (!anaVezin) anaVezin = boxElement.getAttribute('data-original') || '';
    
    const tabanKelime = (typeof applyRootToKalip === 'function') ? applyRootToKalip(kok, anaVezin) : "";
    let stem = tabanKelime ? tabanKelime.replace(/[َُِّْ]$/, "") : "";
    let kelimeListesi = [];
    let ozelCekimBulundu = false;
    let activeSuffix = boxElement.getAttribute('data-active-suffix'); 

    if (typeof wordEasterEggs !== 'undefined' && wordEasterEggs[kok] && wordEasterEggs[kok][refId]) {
        let eggObj = wordEasterEggs[kok][refId];
        if (activeSuffix && eggObj[activeSuffix] && eggObj[activeSuffix].cekimi) {
            kelimeListesi = [...eggObj[activeSuffix].cekimi];
            ozelCekimBulundu = true;
        } else if (!activeSuffix) {
            if (eggObj.base && eggObj.base.cekimi) {
                kelimeListesi = [...eggObj.base.cekimi];
                ozelCekimBulundu = true;
            } else if (eggObj.cekimi) {
                kelimeListesi = [...eggObj.cekimi];
                ozelCekimBulundu = true;
            }
        }
    }

    if (!ozelCekimBulundu) {
        const list = sigaSablonlari[tip];
        if (!list) return;
        
        list.forEach((siga, index) => {
            let cekilmisKelime = "";
            if (tip === 'muzari') {
                let r1 = kok[0]; let r2 = kok[1]; let r3 = kok[2];
                let aynHareke = "ُ"; 
                if (babNo === 7 || anaVezin.includes("يَفْعِلُ")) aynHareke = "ِ";
                else if (anaVezin.includes("يَفْعَلُ") || anaVezin.includes("يَفْتَعِلُ") || anaVezin.includes("يَنْفَعِلُ") || babNo === 12) aynHareke = "َ";
                
                let coreWord = r1 + "ْ" + r2 + aynHareke + r3;
                if (babNo === 7) coreWord = r1 + "ْ" + r2 + aynHareke + r3; 
                else if (babNo === 8) coreWord = r1 + "َ" + r2 + "ِّ" + r3;
                else if (babNo === 9) coreWord = r1 + "َ" + "ا" + r2 + "ِ" + r3;
                else if (babNo === 10) coreWord = "نْ" + r1 + "َ" + r2 + "ِ" + r3; 
                else if (babNo === 11) coreWord = r1 + "ْتَ" + r2 + "ِ" + r3;
                else if (babNo === 12) {
                    if (index === 5 || index === 11) coreWord = r1 + "ْ" + r2 + "َ" + r3 + "ِ" + r3; 
                    else coreWord = r1 + "ْ" + r2 + "َ" + r3 + "ّ"; 
                } 
                else if (babNo === 13) coreWord = "تَ" + r1 + "َ" + r2 + "َّ" + r3; 
                else if (babNo === 14) coreWord = "تَ" + r1 + "َ" + "ا" + r2 + "َ" + r3;
                else if (babNo === 15) coreWord = "سْتَ" + r1 + "ْ" + r2 + "ِ" + r3;
                
                let currentPrefix = siga.prefix; 
                if (babNo === 7 || babNo === 8 || babNo === 9) {
                    if (currentPrefix === 'يَ') currentPrefix = "يُ";
                    else if (currentPrefix === 'تَ') currentPrefix = "تُ";
                    else if (currentPrefix === 'أَ') currentPrefix = "أُ";
                    else if (currentPrefix === 'نَ') currentPrefix = "نُ";
                }
                cekilmisKelime = currentPrefix + coreWord + siga.suffix;
            } 
            else if (tip === 'mazi') {
                if (babNo === 12) {
                    let r1 = kok[0], r2 = kok[1], r3 = kok[2];
                    let baseSeddeli = `اِ${r1}ْ${r2}َ${r3}`; 
                    let baseAcik = `اِ${r1}ْ${r2}َ${r3}َ${r3}`; 
                    let seddeliEkler = ["َّ", "َّا", "ُّوا", "َّتْ", "َّتَا"]; 
                    if (index < 5) cekilmisKelime = baseSeddeli + seddeliEkler[index]; 
                    else cekilmisKelime = baseAcik + siga.ek; 
                } else {
                    cekilmisKelime = stem + siga.ek; 
                }
            } 
            else if (tip === 'emir') {
                if (babNo === 12) {
                    let r1 = kok[0], r2 = kok[1], r3 = kok[2];
                    if (index === 5) cekilmisKelime = `اِ${r1}ْ${r2}َ${r3}ِ${r3}ْنَ`; 
                    else {
                        let emirEkleri = ["َّ", "َّا", "ُّوا", "ِّي", "َّا"];
                        cekilmisKelime = `اِ${r1}ْ${r2}َ${r3}${emirEkleri[index]}`; 
                    }
                } 
                else {
                    let r1 = kok[0]; let r2 = kok[1]; let r3 = kok[2];
                    let emirPrefix = "اِ";
                    if (anaVezin.startsWith("أُ")) emirPrefix = "أُ";
                    else if (anaVezin.startsWith("أَ")) emirPrefix = "أَ";
                    else if (babNo === 8 || babNo === 9 || babNo === 13 || babNo === 14) emirPrefix = ""; 
                    let aynHareke = "ِ";
                    if (anaVezin.includes("أُفْعُلْ")) aynHareke = "ُ";
                    else if (anaVezin.includes("اِفْعَلْ")) aynHareke = "َ"; 

                    let coreEmir = r1 + "ْ" + r2 + aynHareke + r3;
                    if (babNo === 8) coreEmir = r1 + "َ" + r2 + "ِّ" + r3;
                    else if (babNo === 9) coreEmir = r1 + "َ" + "ا" + r2 + "ِ" + r3;
                    else if (babNo === 10) coreEmir = "نْ" + r1 + "َ" + r2 + "ِ" + r3;
                    else if (babNo === 11) coreEmir = r1 + "ْتَ" + r2 + "ِ" + r3;
                    else if (babNo === 13) coreEmir = "تَ" + r1 + "َ" + r2 + "َّ" + r3;
                    else if (babNo === 14) coreEmir = "تَ" + r1 + "َ" + "ا" + r2 + "َ" + r3;
                    else if (babNo === 15) coreEmir = "سْتَ" + r1 + "ْ" + r2 + "ِ" + r3;

                    cekilmisKelime = emirPrefix + coreEmir + siga.suffix;
                }
            }
            cekilmisKelime = SarfEngine.applyRules(cekilmisKelime, kok.split(""));
            kelimeListesi.push(cekilmisKelime);
        });
    }

    if (kelimeListesi.length === 0) return;
    const isColorActive = kok && kok.length === 3;
    const isVerb = boxElement.classList.contains('fiil-box');
    const pastelColors = ['#fce4ec', '#e3f2fd', '#e8f5e9', '#fff3e0', '#f3e5f5', '#e0f7fa', '#fbe9e7', '#f1f8e9', '#fffde7', '#eceff1'];

    let muzariListesi = [];
    if (isVerb && tip === 'mazi') {
        let foundMuzari = false;
        if (typeof wordEasterEggs !== 'undefined' && wordEasterEggs[kok]) {
            let possibleRefs = [refId + 3, refId + 1]; 
            for (let pr of possibleRefs) {
                if (wordEasterEggs[kok][pr]) {
                    let egg = wordEasterEggs[kok][pr];
                    if (egg.cekimi) { muzariListesi = [...egg.cekimi]; foundMuzari = true; break; }
                    if (egg.base && egg.base.cekimi) { muzariListesi = [...egg.base.cekimi]; foundMuzari = true; break; }
                }
            }
            if (!foundMuzari) {
                for (let k in wordEasterEggs[kok]) {
                    let egg = wordEasterEggs[kok][k];
                    let txt = egg.base ? egg.base.arText : (egg.arText || "");
                    if (txt && (txt.startsWith('يَ') || txt.startsWith('يُ') || txt.startsWith('يَتَ'))) {
                        if (egg.cekimi) { muzariListesi = [...egg.cekimi]; foundMuzari = true; break; }
                        if (egg.base && egg.base.cekimi) { muzariListesi = [...egg.base.cekimi]; foundMuzari = true; break; }
                    }
                }
            }
        }
        if (!foundMuzari) {
            const list = sigaSablonlari['muzari'];
            if (list) {
                list.forEach((siga, index) => {
                    let r1 = kok[0]; let r2 = kok[1]; let r3 = kok[2];
                    let aynHareke = "ُ"; 
                    if (babNo === 7 || anaVezin.includes("يَفْعِلُ")) aynHareke = "ِ";
                    else if (anaVezin.includes("يَفْعَلُ") || anaVezin.includes("يَفْتَعِلُ") || anaVezin.includes("يَنْفَعِلُ") || babNo === 12) aynHareke = "َ";
                    
                    let coreWord = r1 + "ْ" + r2 + aynHareke + r3;
                    if (babNo === 7) coreWord = r1 + "ْ" + r2 + aynHareke + r3; 
                    else if (babNo === 8) coreWord = r1 + "َ" + r2 + "ِّ" + r3;
                    else if (babNo === 9) coreWord = r1 + "َ" + "ا" + r2 + "ِ" + r3;
                    else if (babNo === 10) coreWord = "نْ" + r1 + "َ" + r2 + "ِ" + r3; 
                    else if (babNo === 11) coreWord = r1 + "ْتَ" + r2 + "ِ" + r3;
                    else if (babNo === 12) {
                        if (index === 5 || index === 11) coreWord = r1 + "ْ" + r2 + "َ" + r3 + "ِ" + r3; 
                        else coreWord = r1 + "ْ" + r2 + "َ" + r3 + "ّ"; 
                    } 
                    else if (babNo === 13) coreWord = "تَ" + r1 + "َ" + r2 + "َّ" + r3; 
                    else if (babNo === 14) coreWord = "تَ" + r1 + "َ" + "ا" + r2 + "َ" + r3;
                    else if (babNo === 15) coreWord = "سْتَ" + r1 + "ْ" + r2 + "ِ" + r3;
                    
                    let currentPrefix = siga.prefix; 
                    if (babNo === 7 || babNo === 8 || babNo === 9) {
                        if (currentPrefix === 'يَ') currentPrefix = "يُ";
                        else if (currentPrefix === 'تَ') currentPrefix = "تُ";
                        else if (currentPrefix === 'أَ') currentPrefix = "أُ";
                        else if (currentPrefix === 'نَ') currentPrefix = "نُ";
                    }
                    let cekilmisKelime = currentPrefix + coreWord + siga.suffix;
                    cekilmisKelime = SarfEngine.applyRules(cekilmisKelime, kok.split(""));
                    muzariListesi.push(cekilmisKelime);
                });
            }
        }
        if(muzariListesi.length === 0) muzariListesi = kelimeListesi;
    }

    function generateCellContent(w, tip, babNo, tableType, isColorActive, kok, wordIndex) {
        if (!w) return "";
        let clean = (typeof w === 'object' ? w.ar : w).replace(/[\u200C\u200D\uFEFF]/g, ''); 
        let prefix = "";
        let coreWord = clean;

        if (tableType === 'ma') prefix = "مَا";
        else if (tableType === 'la') prefix = "لَا";
        else if (tableType === 'lam') {
            prefix = "لَمْ";
            const duals = [1, 4, 7, 10];
            const pluralMasc = [2, 8];
            const singFem = [9];
            const pluralFem = [5, 11];

            if (duals.includes(wordIndex)) coreWord = clean.replace(/َانِ$/, 'َا'); 
            else if (pluralMasc.includes(wordIndex)) coreWord = clean.replace(/ُونَ$/, 'ُوا'); 
            else if (singFem.includes(wordIndex)) coreWord = clean.replace(/ِينَ$/, 'ِي'); 
            else if (pluralFem.includes(wordIndex)) coreWord = clean; 
            else {
                if (clean.endsWith('ُ')) coreWord = clean.replace(/ُ$/, 'ْ');
                else if (clean.endsWith('ِي')) coreWord = clean.replace(/ِي$/, 'ِ');
                else if (clean.endsWith('ُو')) coreWord = clean.replace(/ُو$/, 'ُ');
                else if (clean.endsWith('َى')) coreWord = clean.replace(/َى$/, 'َ');
                else if (clean.endsWith('ا')) coreWord = clean.replace(/ا$/, 'َ');
            }
        }
        else if (tableType === 'nehiy') {
            prefix = "لَا";
            if (clean.startsWith("اِ") || clean.startsWith("اُ")) coreWord = "تَ" + clean.substring(2);
            else if (clean.startsWith("أَ")) coreWord = "تُ" + clean.substring(2);
            else {
                let taPrefix = (babNo === 7 || babNo === 8 || babNo === 9) ? "تُ" : "تَ";
                coreWord = taPrefix + clean;
            }
        }

        // --- DÜZELTME 2: İçinde HTML (<) varsa ASLA renklendirme motoruna sokma! ---
        let coloredCore = (isColorActive && !coreWord.includes('<')) ? ColorEngine.colorize(coreWord, kok.split("")) : coreWord;
        
        if (prefix) return `<span style="color: #64748b; font-weight: bold; margin-left: 6px; display: inline-block; direction: rtl;">${prefix}</span><span style="display: inline-block; direction: rtl;">${coloredCore}</span>`;
        return `<span style="display: inline-block; direction: rtl;">${coloredCore}</span>`;
    }

    let html = `
        <div class="popup-drag-bar" style="position: absolute; top: 0; left: 0; width: 100%; height: 35px; background: #f1f5f9; border-top-left-radius: 13px; border-top-right-radius: 13px; border-bottom: 2px solid #e2e8f0; display: flex; justify-content: center; align-items: center; cursor: grab; z-index: 10; touch-action: none;">
            <div style="width: 50px; height: 6px; background: #cbd5e1; border-radius: 10px; pointer-events: none;"></div>
        </div>
        <div class="matrix-close-btn" style="z-index: 11; top: 2px;" onclick="closeInlineMatrix(event, this)">✕</div>
    `;

    html += `<div class="popup-scroll-wrapper" style="max-height: 60vh; overflow-y: auto; overflow-x: hidden; margin-top: 35px; padding: 0; box-sizing: border-box;">`;
    html += `<table class="conjugation-table" style="margin: 0; width: 100%; border-collapse: collapse;">`;

    let totalItems = kelimeListesi.length;

    if (isVerb) {
        if (typeof kelimeListesi[0] === 'object') {
            html += `<thead style="position: sticky; top: -1px; z-index: 5;"><tr><th style="background-color: #2B88D9 !important; text-align: center;">Kullanım Varyasyonları</th></tr></thead><tbody>`;
            for (let i = 0; i < totalItems; i++) {
                let bgColor = pastelColors[i % 10]; 
                let item = kelimeListesi[i];
                let wAr = item.ar || ''; let wTr = item.tr || ''; let ornek = item.ornek; 
                // YENİ: İçinde HTML (<) varsa renklendirme motorunu atla ki tasarım bozulmasın
if (isColorActive && wAr && !wAr.includes('<')) wAr = ColorEngine.colorize(wAr, kok.split(""));
                let ornekHtml = ornek ? `<div class="ornek-box"><div style="font-family:'Arakom', sans-serif; font-size:20px; color:#000; text-align: center;">${ornek.ar}</div><div style="font-size:15px; color:#333; margin-top:6px; text-align: center; direction: ltr;">${ornek.tr}</div></div>` : '';
                let trHtml = wTr ? `<span class="siga-tr-text" style="display: block; margin-top: 15px; font-size: 16px; color: #555; direction: ltr;">${wTr}</span>` : '';
                html += `<tr><td style="background-color: ${bgColor} !important; padding: 25px 15px;"><span class="siga-text">${wAr}</span>${trHtml}${ornekHtml}</td></tr>`;
            }
        } 
        else {
            let tablesToRender = [];
            
            // ÇÖZÜM 1: MAZİ SIRALAMASI SENİN İSTEDİĞİN GİBİ GÜNCELLENDİ (La en sonda)
            if (tip === 'mazi') tablesToRender = ['olumlu', 'ma', 'lam', 'la'];
            else if (tip === 'muzari') tablesToRender = ['olumlu', 'la'];
            else if (tip === 'emir') tablesToRender = ['olumlu', 'nehiy'];

            tablesToRender.forEach((tableType, tIndex) => {
                let theadText = ""; let headBg = ""; let subBg = ""; let subColor = "";
                
                if (tableType === 'olumlu') {
                    theadText = tip === 'mazi' ? "Malum Mazi (Olumlu)" : (tip === 'muzari' ? "Malum Muzari (Olumlu)" : "Emir (Olumlu)");
                    headBg = "#2B88D9"; subBg = "#f1f5f9"; subColor = "#333";
                } else if (tableType === 'ma') {
                    theadText = "Menfi Mazi (مَا)";
                    headBg = "#e74c3c"; subBg = "#fcf1f1"; subColor = "#a94442";
                } else if (tableType === 'la') {
                    theadText = tip === 'mazi' ? "İnkari Mazi / Dua (لَا)" : "Menfi Muzari (Olumsuz)";
                    headBg = tip === 'mazi' ? "#9b59b6" : "#e74c3c"; 
                    subBg = tip === 'mazi' ? "#f5eef8" : "#fcf1f1";
                    subColor = tip === 'mazi' ? "#7d3c98" : "#a94442";
                } else if (tableType === 'lam') {
                    theadText = "Cehd-i Mutlak (لَمْ / Geçmiş Anlamı)";
                    headBg = "#d35400"; 
                    subBg = "#fdf2e9";
                    subColor = "#ba4a00";
                } else if (tableType === 'nehiy') {
                    theadText = "Nehiy (Olumsuz Emir)";
                    headBg = "#e74c3c"; subBg = "#fcf1f1"; subColor = "#a94442";
                }
                
                if (tIndex > 0) {
                    html += `<tbody class="spacer-body"><tr class="spacer-row"><td colspan="3" style="height: 35px; background: transparent !important; border: none !important;"></td></tr></tbody>`;
                }

                // ÇÖZÜM 2: Z-INDEX ALGORİTMASI (10 + tIndex). Alttaki tablo üste çıkınca eskisini ezecek!
                html += `<thead style="position: sticky; top: -1px; z-index: ${10 + tIndex}; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <tr><th colspan="3" style="background-color: ${headBg} !important; color: white; padding: 8px; font-size: 15px; border-top: 2px solid #cbd5e1; border-radius: 8px 8px 0 0;">${theadText}</th></tr>
                            <tr style="background-color: ${subBg};"><th style="padding: 4px; font-size: 13px; color: ${subColor}; border-bottom: 2px solid #cbd5e1;">Müfred</th><th style="padding: 4px; font-size: 13px; color: ${subColor}; border-bottom: 2px solid #cbd5e1;">Tesniye</th><th style="padding: 4px; font-size: 13px; color: ${subColor}; border-bottom: 2px solid #cbd5e1;">Cemi</th></tr>
                         </thead><tbody style="border-bottom: 4px solid #cbd5e1;">`;
                         
                for (let i = 0; i < totalItems; i += 3) {
                    let rowIndex = Math.floor(i / 3);
                    let bgColor = '#ffffff';
                    
                    if (tableType === 'olumlu') bgColor = (rowIndex % 2 === 0) ? '#e3f2fd' : '#fce4ec';
                    else if (tableType === 'ma' || tableType === 'nehiy' || (tableType === 'la' && tip === 'muzari')) bgColor = (rowIndex % 2 === 0) ? '#ffebee' : '#fbe9e7';
                    else if (tableType === 'la' && tip === 'mazi') bgColor = (rowIndex % 2 === 0) ? '#f4ecf7' : '#f5eef8';
                    else if (tableType === 'lam') bgColor = (rowIndex % 2 === 0) ? '#fdf2e9' : '#fae5d3';
                    
                    let currentList = (tableType === 'lam') ? muzariListesi : kelimeListesi;
                    
                    let w1 = generateCellContent(currentList[i], tip, babNo, tableType, isColorActive, kok, i);
                    let w2 = generateCellContent(currentList[i+1], tip, babNo, tableType, isColorActive, kok, i+1);
                    let w3 = generateCellContent(currentList[i+2], tip, babNo, tableType, isColorActive, kok, i+2);
                    
                    html += `<tr>
                                <td style="background-color: ${bgColor} !important; padding: 10px 5px;"><div class="siga-text" style="display: flex; justify-content: center; align-items: center;">${w1}</div></td>
                                <td style="background-color: ${bgColor} !important; padding: 10px 5px;"><div class="siga-text" style="display: flex; justify-content: center; align-items: center;">${w2}</div></td>
                                <td style="background-color: ${bgColor} !important; padding: 10px 5px;"><div class="siga-text" style="display: flex; justify-content: center; align-items: center;">${w3}</div></td>
                             </tr>`;
                }
                html += `</tbody>`;
            });
        }
    } else {
        html += `<thead style="position: sticky; top: -1px; z-index: 5;"><tr><th style="background-color: #2B88D9 !important; text-align: center;">Kullanım Varyasyonları</th></tr></thead><tbody>`;
        for (let i = 0; i < totalItems; i++) {
            let bgColor = pastelColors[i % 10]; let item = kelimeListesi[i];
            let wAr = typeof item === 'object' ? (item.ar || '') : (item || '');
            let wTr = typeof item === 'object' ? (item.tr || '') : '';
            let ornek = item.ornek; 
            // YENİ: İçinde HTML (<) varsa renklendirme motorunu atla ki tasarım bozulmasın
if (isColorActive && wAr && !wAr.includes('<')) wAr = ColorEngine.colorize(wAr, kok.split(""));
            let ornekHtml = ornek ? `<div class="ornek-box"><div style="font-family:'Arakom', sans-serif; font-size:20px; color:#000; text-align: center;">${ornek.ar}</div><div style="font-size:15px; color:#333; margin-top:6px; text-align: center; direction: ltr;">${ornek.tr}</div></div>` : '';
            let trHtml = wTr ? `<span class="siga-tr-text" style="display: block; margin-top: 15px; font-size: 16px; color: #555; direction: ltr;">${wTr}</span>` : '';
            html += `<tr><td style="background-color: ${bgColor} !important; padding: 25px 15px;"><span class="siga-text">${wAr}</span>${trHtml}${ornekHtml}</td></tr>`;
        }
    }

    html += `</tbody></table></div>`;
    inlineContainer.innerHTML = html;
    inlineContainer.style.overflowY = 'hidden'; 
    inlineContainer.style.paddingTop = '15px'; 

    const popupWidth = 420;  const popupHeight = 410; 
    const boxWidth = boxElement.offsetWidth; const rect = boxElement.getBoundingClientRect();
    let targetTop = (window.innerHeight / 2) - (popupHeight / 2) - rect.top;
    let targetLeft = isVerb ? -popupWidth - 40 : boxWidth + 20;

    let globalLeft = rect.left + targetLeft; let globalRight = globalLeft + popupWidth;
    let globalTop = rect.top + targetTop; let globalBottom = globalTop + popupHeight;

    if (globalLeft < 10) targetLeft += (10 - globalLeft); 
    if (globalRight > window.innerWidth - 10) targetLeft -= (globalRight - (window.innerWidth - 10)); 
    if (globalTop < 10) targetTop += (10 - globalTop); 
    if (globalBottom > window.innerHeight - 10) targetTop -= (globalBottom - (window.innerHeight - 10)); 

    inlineContainer.style.left = `${targetLeft}px`; inlineContainer.style.top = `${targetTop}px`;
    inlineContainer.style.right = 'auto'; inlineContainer.style.display = 'block'; 
    inlineContainer.onmousedown = function(e) { e.stopPropagation(); }; inlineContainer.onclick = function(e) { e.stopPropagation(); };
    inlineContainer.ontouchstart = function(e) { e.stopPropagation(); }; inlineContainer.ontouchmove = function(e) { e.stopPropagation(); }; 
    inlineContainer.ontouchend = function(e) { e.stopPropagation(); };  
    
    const expandBtn = document.createElement('div'); expandBtn.className = 'matrix-expand-btn';
    expandBtn.title = 'Tam Ekran'; expandBtn.innerHTML = '<i class="fas fa-expand"></i>';
    expandBtn.style.zIndex = '11'; expandBtn.style.top = '2px';
    expandBtn.onclick = function(event) { event.stopPropagation(); openMatrixFullscreen(event, this); };
    inlineContainer.appendChild(expandBtn);
    
    const dragBar = inlineContainer.querySelector('.popup-drag-bar');
    let isDraggingPopup = false; let pStartX, pStartY, pInitialLeft, pInitialTop;
    const onPopupDragStart = (e) => {
        e.stopPropagation(); isDraggingPopup = true; dragBar.style.cursor = 'grabbing';
        pStartX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        pStartY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        pInitialLeft = inlineContainer.offsetLeft; pInitialTop = inlineContainer.offsetTop;
        inlineContainer.style.right = 'auto'; 
        document.addEventListener('mousemove', onPopupDragMove); document.addEventListener('mouseup', onPopupDragEnd);
        document.addEventListener('touchmove', onPopupDragMove, { passive: false }); document.addEventListener('touchend', onPopupDragEnd);
    };
    const onPopupDragMove = (e) => {
        if (!isDraggingPopup) return; e.preventDefault(); e.stopPropagation(); 
        let x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX; let y = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        inlineContainer.style.left = (pInitialLeft + (x - pStartX)) + 'px'; inlineContainer.style.top = (pInitialTop + (y - pStartY)) + 'px';
    };
    const onPopupDragEnd = (e) => {
        if (e) e.stopPropagation(); isDraggingPopup = false; dragBar.style.cursor = 'grab';
        document.removeEventListener('mousemove', onPopupDragMove); document.removeEventListener('mouseup', onPopupDragEnd);
        document.removeEventListener('touchmove', onPopupDragMove); document.removeEventListener('touchend', onPopupDragEnd);
    };
    dragBar.addEventListener('mousedown', onPopupDragStart); dragBar.addEventListener('touchstart', onPopupDragStart, { passive: false });
    boxElement.style.zIndex = "999999"; boxElement.classList.add('matrix-opened');
}

// Global tıklama (kapatma) event listener'ı aynen kalıyor
document.addEventListener('click', function(e) {
    const conjugationContainer = e.target.closest('.conjugation-inline-container');
    const glassBox = e.target.closest('.glass-box');
    
    const fullscreenOverlay = e.target.closest('#matrix-fullscreen-overlay');

    if (!conjugationContainer && !glassBox && !fullscreenOverlay) {
        const openedBoxes = document.querySelectorAll('.glass-box.matrix-opened');
        if (openedBoxes.length > 0) {
            openedBoxes.forEach(box => {
                const closeBtn = box.querySelector('.matrix-close-btn');
                if (closeBtn) closeInlineMatrix(e, closeBtn);
            });
            e.preventDefault();
            e.stopPropagation();
        }
    }
}, true);

function closeConjugationModal() {
    SoundEngine.playClose();
    document.getElementById('conjugation-overlay').style.display = 'none';
    
    document.querySelectorAll('.glass-box').forEach(box => {
        if (box.style.backgroundColor) { 
            box.setAttribute('data-modal-closed', 'true');
        }
    });
}

function toggleKB(show) {
    const overlay = document.getElementById('keyboard-overlay');
    const tempDisplay = document.getElementById('temp-root-display');
    if (show) {
        currentRoot = ""; 
        if (tempDisplay) tempDisplay.innerText = "";
    }
    if (overlay) overlay.style.display = show ? 'flex' : 'none';
}

function openKeyboard() {
    SoundEngine.playClick(); 
    resetTableOnly(true);     
    toggleKB(true);
}

function closeKeyboard() {
    SoundEngine.playClose(); 
    toggleKB(false);
}

function addLetter(char) {
    if (currentRoot.length < 3) {
        SoundEngine.playClick(); 
        currentRoot += char;
        updateTempDisplay();
        highlightKey(char);
        if (currentRoot.length === 3) {
            setTimeout(() => { confirmRoot(); }, 300);
        }
    }
}

function handleBackspace() {
    SoundEngine.playClose(); 
    if (currentRoot.length > 0) {
        currentRoot = currentRoot.slice(0, -1);
        updateTempDisplay();
    }
}

function updateTempDisplay() {
    const display = document.getElementById('temp-root-display');
    if (display) {
        display.innerText = currentRoot.trim(); 
        display.style.direction = "rtl";
    }
}

function highlightKey(char) {
    const keys = document.querySelectorAll('.key');
    keys.forEach(k => {
        if (k.innerText.trim() === char) {
            k.classList.add('active-key');
            setTimeout(() => k.classList.remove('active-key'), 150);
        }
    });
}

function confirmRoot() {
    if (currentRoot.length === 3) {
        SoundEngine.playReset(); 
        const rootTextSpan = document.getElementById('root-text-display');
        if (rootTextSpan) {
            rootTextSpan.innerText = currentRoot;
        }
        toggleKB(false);
        
        // EKLENEN KISIM: Klavyeden giriş yapıldığında da sayacı temizle
        currentEggIndex = 0; 
        
        highlightEasterEggBoxes(currentRoot); 
        
        // Otomatik olarak tahta bloğu sahneye at!
        if (typeof autoSpawnRootClone === 'function') autoSpawnRootClone();
        
        if (currentTabActive === 1) {
            setTab(0);
        }
    }
}

document.addEventListener('keydown', function(e) {
    const overlay = document.getElementById('keyboard-overlay');
    if (!overlay || overlay.style.display === 'none' || overlay.style.display === '') return;
    const key = e.key.toLocaleLowerCase('tr-TR');
    if (key === 'backspace') {
        handleBackspace();
        e.preventDefault();
    } else if (key === 'escape') {
        closeKeyboard();
    } else if (arabicKeyMap[key]) {
        SoundEngine.playClick(); 
        addLetter(arabicKeyMap[key]);
        e.preventDefault();
    }
});

function resetTableOnly(isSilent = false) {
    if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes(); // Ekran sıfırlanırken tüm zoomları ve overlayi kapatır
    if (typeof clearDraggableRoots === 'function') {
        clearDraggableRoots();
    }

    if (!isSilent) {
        if(typeof SoundEngine !== "undefined") SoundEngine.playReset(); 
    }
    isReadyVerbMode = false;
    targetStates = {};
    
    document.querySelectorAll('.glass-box').forEach(box => {
        // === İŞTE BURASI: Kutuya ait tüm renk, vurgu ve etiketleri tek kalemde temizler ===
        box.classList.remove(
            'hidden-mode', 
            'pulse-highlight', 
            'matrix-opened', 
            'current-active-red', 
            'sari-vurgu', 
            'kok-turendi' // Kök türedi etiketini de sıfırlar!
        );
        
        box.removeAttribute('data-modal-closed');
        box.style.transform = "";
        box.style.backgroundColor = ""; 
        box.style.borderColor = "";
        box.style.background = "";
        box.style.zIndex = "";
        box.style.boxShadow = ""; 
        if (box.hasAttribute('data-tiklama-sayisi')) box.setAttribute('data-tiklama-sayisi', '0');

        const el = box.querySelector('.ar, .ar-small');
        if (el) {
            el.style.visibility = 'visible';
            const original = el.getAttribute('data-original');
            if (original) {
                // --- YENİ: Sıfırlandığında da varsayılan kalıbı (فعل) renkli getir ---
                if (original !== "-") {
                    if (typeof ColorEngine !== 'undefined') {
                        el.innerHTML = ColorEngine.colorize(original, ['ف', 'ع', 'ل']);
                    } else {
                        el.innerText = original;
                    }
                } else {
                    el.innerText = original;
                }
                // --------------------------------------------------------------------
            }
        }
        const container = box.querySelector('.conjugation-inline-container');
        if (container) container.innerHTML = '';
    });
    
    const rootDisplay = document.getElementById('root-text-display');
    if (rootDisplay) {
        rootDisplay.innerText = "Kök Yaz";
    }
    currentRoot = "";
    lastClickedBoxTextSpan = null;
    lastOriginalWord = "";
    
    const plusBtn = document.querySelector('.fa-plus');
    if (plusBtn) plusBtn.classList.remove('plus-highlighted');

    const mobilePlus = document.getElementById('mobile-top-plus');
    if (mobilePlus) mobilePlus.classList.remove('plus-highlighted');

    if (typeof highlightEasterEggBoxes === 'function') highlightEasterEggBoxes(""); 
}

document.addEventListener('DOMContentLoaded', function() {
    const wrappers = document.querySelectorAll('.responsive-table-wrapper');

    wrappers.forEach(wrapper => {
        let isDown = false;
        let startX;
        let scrollLeft;

        const startDragging = (e) => {
            isDown = true;
            wrapper.classList.add('active');
            startX = (e.pageX || e.touches[0].pageX) - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
        };

        const stopDragging = () => {
            isDown = false;
            wrapper.classList.remove('active');
        };

        const move = (e) => {
            if (!isDown) return;
            e.preventDefault(); 
            const x = (e.pageX || e.touches[0].pageX) - wrapper.offsetLeft;
            const walk = (x - startX) * 1.5;
            wrapper.scrollLeft = scrollLeft - walk;
        };

        wrapper.addEventListener('mousedown', startDragging);
        wrapper.addEventListener('mouseleave', stopDragging);
        wrapper.addEventListener('mouseup', stopDragging);
        wrapper.addEventListener('mousemove', move);

        wrapper.addEventListener('touchstart', startDragging, { passive: true });
        wrapper.addEventListener('touchend', stopDragging, { passive: true });
        wrapper.addEventListener('touchmove', (e) => {
            if (isDown) {
                const x = e.touches[0].pageX - wrapper.offsetLeft;
                const walk = (x - startX) * 1.5;
                wrapper.scrollLeft = scrollLeft - walk;
            }
        }, { passive: true });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (e) => {
        const menu = document.getElementById("suffix-dropdown");
        if (menu && menu.style.display !== "none") {
            if (!menu.contains(e.target) && !e.target.closest('.fa-plus')) {
                menu.style.display = "none";
            }
        }
    });
});

function toggleSuffixMenu(e) {
    e.stopPropagation();
    const menu = document.getElementById("suffix-dropdown");
    
    // Hem masaüstü hem mobil artı butonlarının ışığını söndür
    const desktopPlus = document.querySelector('.fa-plus');
    const mobilePlus = document.getElementById('mobile-top-plus');
    if (desktopPlus) desktopPlus.classList.remove('plus-highlighted');
    if (mobilePlus) mobilePlus.classList.remove('plus-highlighted');
    
    if (menu.style.display === "flex") {
        menu.style.display = "none";
        return;
    }
    
    // ===============================================================
    // YENİ: HANGİ EKLERİN VURGULANACAĞINI BULMA SİSTEMİ
    // ===============================================================
    const suffixBtns = menu.querySelectorAll('button');
    
    // Önce tüm butonların eski vurgusunu temizle
    suffixBtns.forEach(btn => btn.classList.remove('suggested-suffix'));
    
    // Eğer bir kutuya tıklanmışsa ve kök mevcutsa kontrol et
    if (lastClickedBoxTextSpan && typeof currentRoot !== 'undefined' && currentRoot.length === 3) {
        const box = lastClickedBoxTextSpan.closest('.glass-box');
        if (box) {
            const refEl = box.querySelector('.ref');
            if (refEl) {
                const refId = parseInt(refEl.innerText);
                
                // DÜZELTME: Kök tanımlı değilse çökmesini engelleyen güvenlik kontrolü!
                let eggObj = null;
                if (typeof wordEasterEggs !== 'undefined' && wordEasterEggs[currentRoot]) {
                    eggObj = wordEasterEggs[currentRoot][refId];
                }
                
                if (eggObj) {
                    // Hangi ekler mevcut? (base, ornek, cekimi ve suggestsPlus dışındaki anahtarları bulur)
                    const availableSuffixes = Object.keys(eggObj).filter(k => 
                        k !== 'base' && k !== 'ornek' && k !== 'cekimi' && k !== 'suggestsPlus'
                    );
                    
                    // Mevcut ekleri butonlarda bul ve altın sarısı vurgu (suggested-suffix) sınıfını ekle
                    suffixBtns.forEach(btn => {
                        const btnText = btn.innerText.trim();
                        if (availableSuffixes.includes(btnText)) {
                            btn.classList.add('suggested-suffix');
                        }
                    });
                }
            }
        }
    }
    
    // Menünün Konumlandırılması
    const rect = e.target.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY + 8}px`;
    menu.style.left = `${rect.left + window.scrollX - 40}px`; 
    menu.style.display = "flex";
}

function applySuffix(suffix) {
    const menu = document.getElementById("suffix-dropdown");
    if (menu) menu.style.display = "none";

    if (!lastClickedBoxTextSpan) {
        if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
        return; 
    }

    const currentBox = lastClickedBoxTextSpan.closest(".glass-box");
    
    if (currentBox && currentBox.classList.contains("is-verb")) {
        if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
        return; 
    }

    let currentWord = lastOriginalWord || lastClickedBoxTextSpan.innerText;
    
    const plurals = ['يَّات', 'ينَ', 'ونَ', 'ات', 'ا'];
    const basePlurals = ['ينَ', 'ونَ', 'ات', 'ا']; 
    const nisbaSuffixes = ['يَّات', 'يَّة', 'يّ']; 

    if (nisbaSuffixes.includes(suffix)) {
        const hasPlural = basePlurals.some(p => currentWord.endsWith(p));
        if (hasPlural) {
            if(typeof SoundEngine !== "undefined") SoundEngine.playClose(); 
            return; 
        }
    }

    if (basePlurals.includes(suffix)) {
        for (let n of nisbaSuffixes) {
            if (currentWord.endsWith(n)) {
                currentWord = currentWord.slice(0, -n.length);
                break; 
            }
        }
    }

    if (currentWord.endsWith('يَّة')) {
        currentWord = currentWord.slice(0, -'يَّة'.length);
    } 
    else if (currentWord.endsWith('ة')) {
        currentWord = currentWord.slice(0, -1);
    }
    // YENİ EKLENEN KISIM: Eğer kelimede zaten "يّ" varsa zekice yönet
    else if (currentWord.endsWith('يّ')) {
        // Önce eski "يّ" ekini kesip atıyoruz ki üst üste binmesin
        currentWord = currentWord.slice(0, -'يّ'.length);
        
        // Eğer kullanıcı menüden "ة" seçtiyse veya "يَّة" seçtiyse, 
        // sistem bunun niyetini anlar ve temiz bir şekilde "يَّة" ekler.
        if (suffix === 'ة') {
            suffix = 'يَّة';
        } else if (suffix === 'ات') {
            suffix = 'يَّات';
        }
    }

    if (plurals.includes(suffix) || suffix === 'ة') {
        for (let p of plurals) {
            if (currentWord.endsWith(p)) {
                currentWord = currentWord.slice(0, -p.length);
                break; 
            }
        }
    }

    function setLastVowel(word, targetVowel) {
        const vowelRegex = /[\u064B-\u0650\u0652]$/; 
        if (vowelRegex.test(word)) {
            word = word.replace(vowelRegex, ''); 
        }
        return word + targetVowel; 
    }

    if (suffix === 'ة' || suffix === 'ات') {
        currentWord = setLastVowel(currentWord, 'َ'); 
    } 
    else if (nisbaSuffixes.includes(suffix) || suffix === 'ينَ') {
        currentWord = setLastVowel(currentWord, 'ِ'); 
    }
    else if (suffix === 'ونَ') {
        currentWord = setLastVowel(currentWord, 'ُ'); 
    }
    else if (suffix === 'ا') {
        currentWord = setLastVowel(currentWord, 'ً'); 
    }

    let updatedWord = currentWord + suffix;
    
    // HER ZAMAN RENKLENDİR (Kök yoksa فعل baz alınır)
    let activeRootArray = (typeof currentRoot !== 'undefined' && currentRoot.length === 3) ? currentRoot.split("") : ['ف', 'ع', 'ل'];
    lastClickedBoxTextSpan.innerHTML = ColorEngine.colorize(updatedWord, activeRootArray);
    lastOriginalWord = updatedWord;
    
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();

    // ==============================================================
    // Suffix (ek) kontrolünü BEYİN SİSTEMİNE (checkWordEasterEgg) Yolluyoruz
    // ==============================================================
    if (typeof checkWordEasterEgg === "function") {
        checkWordEasterEgg(currentBox, suffix);
    }

    if (currentBox) {
        currentBox.style.setProperty("border-color", "#00FF00", "important");
        currentBox.style.setProperty("box-shadow", "0 0 10px #00FF00", "important");
        
        // Eklendikten sonra büyütme efektini çalıştır (eğer ekli kelimenin sürprizi varsa)
        let forceDelay = false;
        if (typeof currentRoot !== 'undefined' && currentRoot.length === 3) {
            const refEl = currentBox.querySelector('.ref');
            if (refEl) {
                const refId = parseInt(refEl.innerText);
                if (typeof wordEasterEggs !== 'undefined' && wordEasterEggs[currentRoot] && wordEasterEggs[currentRoot][refId] && wordEasterEggs[currentRoot][refId][suffix]) {
                    forceDelay = true;
                }
            }
        }

        if (typeof triggerAreaPulse === "function") triggerAreaPulse(currentBox, forceDelay);
        
        setTimeout(() => {
            currentBox.style.borderColor = ""; 
            currentBox.style.boxShadow = "";
        }, 1500);
    }
}

const originalResetTableOnly = window.resetTableOnly;
window.resetTableOnly = function() {
    if (typeof originalResetTableOnly === "function") {
        originalResetTableOnly();
    }
    lastClickedBoxTextSpan = null;
    lastOriginalWord = "";
    const menu = document.getElementById("suffix-dropdown");
    if (menu) menu.style.display = "none";

    document.querySelectorAll('.easter-egg-trigger').forEach(btn => btn.remove());
    
    // YENİ EKLENEN KOD: Sıfırlama yapıldığında tepede biriken tüm emojileri temizler
    document.querySelectorAll('.easter-egg-emoji').forEach(el => el.remove());

// ==================================================================
    // KESİN ÇÖZÜM 2: Tüm tablo temizlendiğinde bütün kutuların hafızası ve rozetleri silinir!
    // ==================================================================
    document.querySelectorAll('.glass-box').forEach(box => {
        box.removeAttribute('data-last-root');
        box.removeAttribute('data-last-emoji');
        box.removeAttribute('data-plus-animated'); // Animasyon hafızasını siler
        
        // YENİ: Tüm kutulardaki saydam + rozetlerini bulup ekrandan siler
        const hintBadge = box.querySelector('.plus-hint-badge');
        if (hintBadge) hintBadge.remove();
    });
};

const modalOverlays = [
    { id: "verb-overlay", closeFn: window.closeVerbModal },
    { id: "conjugation-overlay", closeFn: window.closeConjugationModal },
    { id: "keyboard-overlay", closeFn: window.closeKeyboard }
];

modalOverlays.forEach(modal => {
    const overlayEl = document.getElementById(modal.id);
    if (overlayEl) {
        overlayEl.addEventListener("click", function(event) {
            if (event.target === overlayEl) {
                if (typeof modal.closeFn === "function") {
                    modal.closeFn();
                } else {
                    overlayEl.style.display = "none";
                }
            }
        });
    }
});

document.querySelectorAll('.matrix-close-btn').forEach(btn => {
    btn.addEventListener('click', function(event) {
        event.stopPropagation(); 
        const currentBox = this.closest('.glass-box');
        if (currentBox) {
            currentBox.classList.remove('matrix-opened');
        }
    });
});

document.querySelectorAll('.glass-box').forEach(box => {
    if (!box.hasAttribute('data-original')) {
        const text = box.querySelector('.ar, .ar-small').innerText.trim();
        box.setAttribute('data-original', text);
    }
});


function checkWordEasterEgg(boxElement, currentSuffix = null) {
    const desktopPlus = document.querySelector('.fa-plus');
    const mobilePlus = document.getElementById('mobile-top-plus');

    if (!currentSuffix) {
        if (desktopPlus) desktopPlus.classList.remove('plus-highlighted');
        if (mobilePlus) mobilePlus.classList.remove('plus-highlighted');
    }

    if (!boxElement || !currentRoot || currentRoot.length !== 3) return;
    if (!boxElement.classList.contains('kok-turendi')) return;

    const refEl = boxElement.querySelector('.ref');
    if (!refEl) return;
    const refId = parseInt(refEl.innerText);
    const isVerb = boxElement.classList.contains('fiil-box');

    if (currentSuffix) {
        boxElement.setAttribute('data-active-suffix', currentSuffix);
    } else {
        boxElement.removeAttribute('data-active-suffix');
    }

    if (typeof wordEasterEggs === 'undefined' || !wordEasterEggs[currentRoot] || !wordEasterEggs[currentRoot][refId]) {
        if (!isVerb) {
            boxElement.classList.remove('coklu-kullanim');
            refEl.removeAttribute('onclick');
        }
        return;
    }

    const eggObj = wordEasterEggs[currentRoot][refId];
    const textEl = boxElement.querySelector('.ar, .ar-small');
    
    // ===============================================================
    // 4. SES OLAYLARINI EZME SİSTEMİ (SADECE TEK KELİMEYSE ÇALIŞIR)
    // ===============================================================
    if (!currentSuffix && eggObj.base && eggObj.base.arText) {
        let wordCount = eggObj.base.arText.trim().split(/\s+/).length;
        
        // YENİ: Sadece tam olarak 1 kelime ise kutunun orijinal metnini ezer (Örn: تَقْوَى)
        if (wordCount === 1) {
            textEl.innerHTML = ColorEngine.colorize(eggObj.base.arText, currentRoot.split(""));
        }
    }

// ===============================================================
    // 5. DİNAMİK KIRMIZI BUTON (SADECE KONU ANLATIMI / LİSTE KONTROLÜ)
    // ===============================================================
    let hasTableData = false;
    
    if (currentSuffix && eggObj[currentSuffix]) {
        if (eggObj[currentSuffix].cekimi && eggObj[currentSuffix].cekimi.length > 0) {
            hasTableData = true;
        }
    } else if (!currentSuffix) {
        if ((eggObj.cekimi && eggObj.cekimi.length > 0) || (eggObj.base && eggObj.base.cekimi && eggObj.base.cekimi.length > 0)) {
            hasTableData = true;
        }
    }

    let selectedData = currentSuffix ? eggObj[currentSuffix] : eggObj.base;
    
    // ÇÖZÜM BURADA: Eğer selectedData yoksa (sadece suggestsPlus varsa) kodun çökmesini engeller
    let data = selectedData ? { ...selectedData, ornek: eggObj.ornek || selectedData.ornek } : null;

    // Önceki atamaları temizle
    boxElement.classList.remove('coklu-kullanim', 'has-ornek');
    if (!isVerb) refEl.removeAttribute('onclick');

    // YENİ KURAL: Örnek ayetler artık Kalıp Numarasını kırmızı YAPMAZ!
    // Kalıp numarası SADECE 'cekimi' dizisi varsa (konu anlatımı/çoklu liste) kırmızı olur ve tabloyu açar.
    if (hasTableData && !isVerb) {
        boxElement.classList.add('coklu-kullanim');
        refEl.setAttribute('onclick', `
            event.preventDefault(); 
            event.stopPropagation(); 
            const box = this.closest('.glass-box'); 
            lastClickedBoxTextSpan = box.querySelector('.ar, .ar-small'); 
            lastOriginalWord = box.getAttribute('data-original'); 
            openConjugationPopup('${currentRoot}', ${refId}, 'isim', '');
        `);
    }

// ===============================================================
    // 6. GÖRSEL ANİMASYONLAR (EMOJİ / ARTI BUTONU VE İPUCU ROZETİ)
    // ===============================================================
    if (!currentSuffix && eggObj.suggestsPlus) {
        if (desktopPlus) desktopPlus.classList.add('plus-highlighted');
        if (mobilePlus) mobilePlus.classList.add('plus-highlighted');
        
        // 1. Hedefe Uçan Animasyon
        if (!boxElement.hasAttribute('data-plus-animated')) {
            if (typeof flyEmojiToPlus === "function") {
                flyEmojiToPlus(boxElement);
            }
            boxElement.setAttribute('data-plus-animated', 'true');
        }
        
       // 2. YENİ: Kutu köşesine sabitlenen altın sarısı rozet
        let hintBadge = boxElement.querySelector('.plus-hint-badge');
        if (!hintBadge) {
            hintBadge = document.createElement('div');
            hintBadge.className = 'plus-hint-badge';
            hintBadge.innerHTML = '+'; // Siyah emoji yerine düz '+' metni (CSS'teki saydam beyaz rengi alması için)
            hintBadge.style.fontWeight = 'bold'; // Okunaklı olması için kalınlaştırdık
            hintBadge.style.fontSize = '18px'; // Düz metin olduğu için boyutunu 18px ile dengeledik
            boxElement.appendChild(hintBadge);
        }
        
    } else {
        // Eğer bir ek (+) seçildiyse veya özellik yoksa rozeti kaldır ve hafızayı temizle
        let hintBadge = boxElement.querySelector('.plus-hint-badge');
        if (hintBadge) hintBadge.remove();
        
        boxElement.removeAttribute('data-plus-animated');
    }

    if (!data) return; // VERİ YOKSA BUNDAN SONRASINI (EMOJİ VE ÜNLEMİ) ÇALIŞTIRMA, GÜVENLİCE DUR!

    boxElement.style.position = 'relative';

    // Orijinal Kutu İçi Emoji Animasyonu (Senin gönderdiğin kusursuz çalışan kısım)
    if (data.emoji) {
        let existingEmoji = boxElement.querySelector('.elegant-emoji');
        let rememberedRoot = boxElement.getAttribute('data-last-root');
        let rememberedEmoji = boxElement.getAttribute('data-last-emoji');

        if (rememberedRoot !== currentRoot || rememberedEmoji !== data.emoji) {
            if (existingEmoji) existingEmoji.remove();

            const emojiDiv = document.createElement('div');
            emojiDiv.className = 'elegant-emoji animate-pop'; 
            emojiDiv.setAttribute('data-ref', refId);
            emojiDiv.innerText = data.emoji;
            boxElement.appendChild(emojiDiv);

            emojiDiv.addEventListener('animationend', (e) => {
                e.target.style.display = 'none'; 
            });

            boxElement.setAttribute('data-last-root', currentRoot);
            boxElement.setAttribute('data-last-emoji', data.emoji);
        } 
        else if (!existingEmoji) {
            const emojiDiv = document.createElement('div');
            emojiDiv.className = 'elegant-emoji'; 
            emojiDiv.style.display = 'none'; 
            emojiDiv.setAttribute('data-ref', refId);
            emojiDiv.innerText = data.emoji;
            boxElement.appendChild(emojiDiv);
        }
    }


// ===============================================================
    // 7. BİLGİ BUTONU (!) KONTROLÜ (YENİ TASARIM: AR -> TR -> ÖRNEKLER)
    // ===============================================================
    let wordCount = data.arText ? data.arText.trim().split(/\s+/).length : 0;
    
    // Anlam (trText) VEYA Örnek (ornek) varsa ünlem butonunu göster!
    if (data.arText && (wordCount > 1 || (data.trText && data.trText.length > 0) || data.ornek)) {
        let existingTrigger = boxElement.querySelector('.easter-egg-trigger');
        
        // --- MÜKEMMEL HİZALANMIŞ HTML İNŞASI BAŞLIYOR ---
        
        // 1. Ana Kelime (Arapça ve hemen altında Türkçe)
        let combinedHtml = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 25px;">
                <div style="font-family: 'Arakom', sans-serif; font-size: 90px; color: #000; direction: rtl; line-height: 1.2;">${data.arText || ""}</div>
                <div style="font-family: 'Arakom', sans-serif; font-size: 55px; color: #FF3B30; direction: ltr; line-height: 1.2;">${data.trText || ""}</div>
            </div>
        `;
        
        // 2. Örnekler (Birden fazla cümle ihtimaline karşı Akıllı Döngü)
        if (data.ornek) {
            // Eğer ornek düz bir obje ise onu diziye çevirir (İleride birden fazla girmene olanak tanır)
            let ornekler = Array.isArray(data.ornek) ? data.ornek : [data.ornek];
            
            combinedHtml += `<div style="width: 100%; border-top: 2px dashed rgba(0,0,0,0.15); padding-top: 25px; display: flex; flex-direction: column; gap: 20px;">`;
            
            ornekler.forEach(orn => {
                combinedHtml += `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; background: #f8f9fa; padding: 25px 20px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                        <div style="font-family: 'Arakom', sans-serif; font-size: 55px; color: #000; direction: rtl; line-height: 1.4; text-align: center;">${orn.ar}</div>
                        <div style="font-family: 'Arakom', sans-serif; font-size: 30px; color: #475569; direction: ltr; line-height: 1.4; text-align: center;">${orn.tr}</div>
                    </div>
                `;
            });
            
            combinedHtml += `</div>`;
        }
        
        if (!existingTrigger) {
            const triggerBtn = document.createElement('div');
            triggerBtn.className = 'easter-egg-trigger';
            triggerBtn.innerHTML = '!'; 
            triggerBtn.title = 'Bilgiyi Gör';

            triggerBtn.onclick = function(e) {
                e.stopPropagation(); 
                // İkinci parametreyi boş gönderip tüm bloğu Arapça div'inin içine basıyoruz
                showEasterEggOverlay(combinedHtml, "");
            };
            boxElement.appendChild(triggerBtn);
        } else {
            existingTrigger.onclick = function(e) {
                e.stopPropagation(); 
                showEasterEggOverlay(combinedHtml, "");
            };
        }
    } else {
        let existingTrigger = boxElement.querySelector('.easter-egg-trigger');
        if (existingTrigger) existingTrigger.remove();
    }
}

// ==================================================================
// FİİLLERİN VEYA ÇOKLU KULLANIM İSİMLERİN KALIP NUMARASINA TIKLAYINCA TABLO AÇMA
// ==================================================================
document.addEventListener('click', function(e) {
    const refEl = e.target.closest('.ref');
    if (refEl) {
        if (window.innerWidth <= 1024) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        const boxElement = refEl.closest('.glass-box');
        
        // ÇÖZÜM: Kutu yeşilse (kok-turendi) VE (fiil kutusuysa YADA coklu-kullanim ise) tablo aç!
        if (boxElement && boxElement.classList.contains('kok-turendi') && (boxElement.classList.contains('fiil-box') || boxElement.classList.contains('coklu-kullanim'))) {
            e.preventDefault();
            e.stopPropagation();

            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            
            const refId = parseInt(refEl.innerText);
            const mapping = typeof getBabAndType === 'function' ? getBabAndType(refId) : null;
            const kalip = boxElement.getAttribute('data-original');
            const currentRootSafe = (typeof currentRoot !== 'undefined') ? currentRoot : "";
            
            const textEl = boxElement.querySelector('.ar, .ar-small');
            lastClickedBoxTextSpan = textEl; 
            lastOriginalWord = kalip;

            let tip = 'isim'; 
            let babNo = 1;
            
            if (mapping) {
                if (boxElement.classList.contains('fiil-box')) {
                    tip = mapping.type;
                }
                babNo = mapping.babNo;
            }

            if (typeof babVezinleri !== 'undefined') {
                const vezinObj = babVezinleri[babNo];
                let anaVezin = (vezinObj && vezinObj[tip]) ? vezinObj[tip] : kalip;
                
                if (typeof openConjugationPopup === 'function') {
                    openConjugationPopup(currentRootSafe, babNo, tip, anaVezin);
                }
                
                document.querySelectorAll(`.easter-egg-emoji[data-ref="${refId}"]`).forEach(emoji => emoji.remove());
            }
        }
    }
}, true);


let currentPulseTimeout = null;

function triggerAreaPulse(boxElement) {
    if (!boxElement) return;
    if (currentPulseTimeout) clearTimeout(currentPulseTimeout);

    const isZoomEnabled = document.getElementById('zoomToggleCheckbox') ? document.getElementById('zoomToggleCheckbox').checked : false;
    if (!isZoomEnabled) return;

    currentPulseTimeout = setTimeout(() => {
        if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();

        const parentContainer = boxElement.closest('.container') || document.body;
        let localOverlay = parentContainer.querySelector('.zoom-overlay');
        if (!localOverlay) {
            localOverlay = document.createElement('div');
            localOverlay.className = 'zoom-overlay';
            const closeLocalOverlay = function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();
            };
            localOverlay.onclick = closeLocalOverlay;
            localOverlay.ontouchstart = closeLocalOverlay;
            parentContainer.appendChild(localOverlay);
        }
        localOverlay.classList.add('active');

        // 1. ASIL KALIBIN KLONU (Türememiş halde)
        const cloneBox = boxElement.cloneNode(true);
        cloneBox.id = 'crisp-zoom-clone';
        cloneBox.classList.add('crisp-zoom-clone'); // YENİ: Var olan .coklu-kullanim gibi sınıfları silmez, üzerine ekler!
        
        // KLONA DOKUNULDUĞUNDA AŞAMALARI İLERLETEN GÜÇ
        const advanceState = function(e) { 
            e.stopPropagation(); 
            e.preventDefault(); 
            if (typeof handleBoxClick === 'function') {
                handleBoxClick(boxElement); 
            }
        };
        cloneBox.onclick = advanceState;
        cloneBox.ontouchstart = advanceState;

        // Yıldız butonu için
        const trigger = cloneBox.querySelector('.easter-egg-trigger');
        if (trigger) {
            trigger.onclick = function(e) {
                e.stopPropagation();
                const origTrigger = boxElement.querySelector('.easter-egg-trigger');
                if (origTrigger) origTrigger.click();
                
            };
        }

        // =======================================================
        // YENİ: + (ARTİ) BUTONUNA BASILINCA İLERLEMEYİ DURDUR
        // =======================================================
        const plusBtn = cloneBox.querySelector('.fa-plus');
        if (plusBtn) {
            const handlePlus = function(e) {
                e.stopPropagation(); // Klonun türemesini (ilerlemesini) engeller
                e.preventDefault();
                if (typeof toggleSuffixMenu === 'function') {
                    toggleSuffixMenu(e); // Ek menüsünü dev klonun üzerinde açar!
                }
            };
            plusBtn.onclick = handlePlus;
            plusBtn.ontouchstart = handlePlus;
        }

        document.body.appendChild(cloneBox);

        // =======================================================
        // 2. KAHVERENGİ KÖK KUTUSU KLONU (Sadece kök varsa açılır)
        // =======================================================
        const currentRootSafe = (typeof currentRoot !== 'undefined') ? currentRoot : "";
        
        // Eğer seçili olan bir kök varsa (uzunluğu 3 harf ise) kahverengi kutuyu yarat!
        if (currentRootSafe.length === 3) {
            const rootClone = document.createElement('div');
            rootClone.id = 'crisp-root-clone';
            rootClone.className = 'crisp-root-clone';
            
            // YENİ: Akıllı kök formatlayıcıyı kullanarak "kendinden sonra birleşmeyen harf" sorununu çözer
            let displayRoot = (typeof formatArabicRoot === 'function') ? formatArabicRoot(currentRootSafe) : currentRootSafe;
            
            rootClone.innerHTML = `<span class="ar-root">${displayRoot}</span>`;
            document.body.appendChild(rootClone);
        }

    }, 10); 
}

function showEasterEggOverlay(arText, trText) {
    let overlay = document.getElementById('easter-egg-overlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'easter-egg-overlay';
        overlay.className = 'easter-egg-overlay';
        
        overlay.onclick = function(e) { 
            if(e.target === this) {
                this.style.display = 'none'; 
                SoundEngine.playClose(); 
            }
        };
        
        const content = document.createElement('div');
        content.className = 'easter-egg-content';

        const closeBtn = document.createElement('div');
        closeBtn.className = 'easter-egg-close-btn';
        closeBtn.innerText = '✕';
        closeBtn.onclick = function(e) {
            e.stopPropagation();
            overlay.style.display = 'none';
            SoundEngine.playClose();
        };
        
        const arDiv = document.createElement('div');
        arDiv.className = 'easter-egg-ar';
        
        const trDiv = document.createElement('div');
        trDiv.className = 'easter-egg-tr';
        
        content.appendChild(closeBtn);
        content.appendChild(arDiv);
        content.appendChild(trDiv);
        overlay.appendChild(content);
        document.body.appendChild(overlay);
    }
    
const arDiv = overlay.querySelector('.easter-egg-ar');
    const trDiv = overlay.querySelector('.easter-egg-tr');
    
    if (arText) { 
        arDiv.innerHTML = arText; // innerText yerine innerHTML yapıldı
        arDiv.style.display = 'block'; 
    } else { 
        arDiv.style.display = 'none'; 
    }
    
    if (trText) { 
        trDiv.innerHTML = trText; // innerText yerine innerHTML yapıldı
        trDiv.style.display = 'block'; 
    } else { 
        trDiv.style.display = 'none'; 
    }
    
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    overlay.style.display = 'flex';
}

function openMatrixFullscreen(e, btnElement) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    const boxElement = btnElement.closest('.glass-box');
    if (!boxElement) return;
    
    document.body.classList.add('matrix-active');
    
    let fullscreenOverlay = document.getElementById('matrix-fullscreen-overlay');
    if (!fullscreenOverlay) {
        fullscreenOverlay = document.createElement('div');
        fullscreenOverlay.id = 'matrix-fullscreen-overlay';
        fullscreenOverlay.className = 'matrix-fullscreen-overlay';
        
        const content = document.createElement('div');
        content.className = 'matrix-fullscreen-content';
        
        const closeBtn = document.createElement('div');
        closeBtn.className = 'matrix-fullscreen-close';
        closeBtn.innerText = '✕';
        closeBtn.addEventListener('click', closeMatrixFullscreen);
        
        content.appendChild(closeBtn);
        fullscreenOverlay.appendChild(content);
        document.body.appendChild(fullscreenOverlay);
        
        // FULLSCREEN ÖZEL ÖLÇEKLENDİRME CSS'İ
        const style = document.createElement('style');
        style.innerHTML = `
            .matrix-fullscreen-table th { font-size: 28px !important; padding: 18px !important; }
            .matrix-fullscreen-table td { padding: 4vh 1vw !important; }
            .matrix-fullscreen-table .siga-text { font-size: 60px !important; }
            .matrix-fullscreen-table .siga-text span { margin-left: 10px; }
            .matrix-fullscreen-table .ornek-box { margin-top: 40px; padding: 35px; border-radius: 20px; }
            .matrix-fullscreen-table .ornek-box div:first-child { font-size: 50px !important; line-height: 1.5; }
            .matrix-fullscreen-table .ornek-box div:last-child { font-size: 35px !important; margin-top: 20px; }
            .matrix-fullscreen-table .siga-tr-text { font-size: 35px !important; margin-top: 30px !important; }
            .matrix-fullscreen-table .spacer-row td { height: 60px !important; }
        `;
        document.head.appendChild(style);
    }
    
    const contentArea = fullscreenOverlay.querySelector('.matrix-fullscreen-content');
    const oldWrapper = contentArea.querySelector('.matrix-fullscreen-table-wrapper');
    if (oldWrapper) oldWrapper.remove();
    
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'matrix-fullscreen-table-wrapper';
    tableWrapper.style.width = '95%'; 
    tableWrapper.style.margin = '0 auto'; 
    tableWrapper.style.maxWidth = '1200px';
    tableWrapper.style.maxHeight = '85vh'; 
    tableWrapper.style.overflowY = 'auto'; 
    tableWrapper.style.overflowX = 'hidden'; 
    tableWrapper.style.borderRadius = '12px';
    tableWrapper.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    tableWrapper.style.backgroundColor = '#ffffff';

    // ========================================================
    // ORİJİNAL TABLOYU DİREKT KLONLA VE ÖLÇEKLENDİR!
    // ========================================================
    const originalTable = boxElement.querySelector('.conjugation-table');
    if (originalTable) {
        const table = document.createElement('table');
        table.className = 'conjugation-table matrix-fullscreen-table';
        table.style.margin = '0'; 
        table.style.height = 'auto'; 
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        
        // Küçük tablodaki HTML yapısını birebir içine yapıştırıyoruz.
        table.innerHTML = originalTable.innerHTML;
        tableWrapper.appendChild(table);
    }
    
    contentArea.appendChild(tableWrapper);
    fullscreenOverlay.style.display = 'flex';
}

function closeMatrixFullscreen(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
    
    // Kapatırken sayfayı serbest bırak (Scroll sorunu için)
    document.body.classList.remove('matrix-active'); 
    
    const fullscreenOverlay = document.getElementById('matrix-fullscreen-overlay');
    if (fullscreenOverlay) {
        fullscreenOverlay.style.display = 'none';
    }

    // YENİ: Tam ekran kapatıldığında arkadaki açık küçük popup'ı (tabloyu) da otomatik kapat
    document.querySelectorAll('.glass-box.matrix-opened').forEach(box => {
        const closeBtn = box.querySelector('.matrix-close-btn');
        if (closeBtn) closeInlineMatrix(null, closeBtn);
    });
}

// ==================================================================
// 1. SARI VURGU (Hedefleri Belirleme)
// ==================================================================
function highlightEasterEggBoxes(root) {
    document.querySelectorAll('.glass-box').forEach(b => {
        b.classList.remove('sari-vurgu', 'current-active-red');
    });

    if (!root || root.length !== 3 || !wordEasterEggs[root]) return;

    const refs = getSortedRefsForRoot(root);
    refs.forEach(refId => {
        const targetBox = Array.from(document.querySelectorAll('.glass-box')).find(b => {
            const refEl = b.querySelector('.ref');
            return refEl && parseInt(refEl.innerText.trim()) === refId;
        });
        if (targetBox) {
            targetBox.classList.add('sari-vurgu');
        }
    });
}

const SarfEngine = {
    // 1. Adım: Kelimenin kök türünü belirleme
    classifyRoot(root) {
        const r1 = root[0], r2 = root[1], r3 = root[2];
        const weak = ['و', 'ي', 'ا'];
        
        if (r2 === r3) return "muzaaf"; // Örn: ح ق ق
        if (weak.includes(r3)) return "nakis"; // Örn: ر م ي, د ع و
        if (weak.includes(r2)) return "ecvef"; // Örn: ق و ل
        if (weak.includes(r1)) return "misal"; // Örn: و ج د
        if (root.includes('ء') || root.includes('أ') || root.includes('إ') || root.includes('ؤ') || root.includes('ئ')) return "mehmuz";
        
        return "salim";
    },

    // 2. Adım: Kuralları Uygulama
    applyRules(rawWord, rootArray) {
        let result = rawWord;
        const rootType = this.classifyRoot(rootArray);
        const [f, a, l] = rootArray;

        // --- A. MUZAAF (Şedde) KURALLARI ---
        if (rootType === "muzaaf") {
            // İstif'al Babı: اِسْتَفْعَلَ -> اِسْتَحْقَقَ -> اِسْتَحَقَّ
            const istafalMazi = new RegExp(`اِسْتَ${f}ْ${a}َ${l}َ`);
            if (istafalMazi.test(result)) result = result.replace(istafalMazi, `اِسْتَ${f}َ${a}َّ`);
            
            // İstif'al Muzari: يَسْتَفْعِلُ -> يَسْتَحْقِقُ -> يَسْتَحِقُّ
            const istafalMuzari = new RegExp(`يَسْتَ${f}ْ${a}ِ${l}ُ`);
            if (istafalMuzari.test(result)) result = result.replace(istafalMuzari, `يَسْتَ${f}ِ${a}ُّ`);

            // İfti'al Masdarı (İhtimam, İhtilal vb.)
            const iftialMasdar = new RegExp(`اِ${f}ْتِ${a}َا${l}`);
            if (iftialMasdar.test(result)) result = result.replace(iftialMasdar, `اِ${f}ْتِمَام`); // Örnek manipülasyon
        }

        // --- B. NAKIS (Son harfi illetli) KURALLARI ---
        if (rootType === "nakis") {
            // Mazi 1. Bab (فَعَلَ): دَعَوَ -> دَعَا / رَمَيَ -> رَمَى
            if (result === `${f}َ${a}َوَ`) result = `${f}َ${a}َا`;
            if (result === `${f}َ${a}َيَ`) result = `${f}َ${a}َى`;

            // Mazi Çekimler (1. Tekil Şahıs: فَعَلْتُ)
            // ر م ي -> رَمَيْتُ
            if (result === `${f}َ${a}َ${l}ْتُ`) {
                result = `${f}َ${a}َ${l}ْتُ`; // 'y' veya 'w' zaten sakin olarak ekleniyor.
            }

            // Muzari (يَفْعِلُ / يَفْعُلُ)
            // يَدْعُوُ -> يَدْعُو
            const muzariWaw = new RegExp(`يَ${f}ْ${a}ُوَ$`);
            const muzariWaw2 = new RegExp(`يَ${f}ْ${a}ُوُ$`); // Harekeli üretilmişse
            if (muzariWaw.test(result) || muzariWaw2.test(result)) result = `يَ${f}ْ${a}ُو`;

            // يَرْمِيُ -> يَرْمِي
            const muzariYa = new RegExp(`يَ${f}ْ${a}ِيُ$`);
            if (muzariYa.test(result)) result = `يَ${f}ْ${a}ِي`;
            
            // İsm-i Mef'ul: مَدْعُوو -> مَدْعُوّ / مَرْمُوي -> مَرْمِيّ
            if (result === `مَ${f}ْ${a}ُوو`) result = `مَ${f}ْ${a}ُوّ`;
            if (result === `مَ${f}ْ${a}ُوي`) result = `مَ${f}ْ${a}ِيّ`;
        }

        // --- C. HEMZE (İmla) KURALLARI ---
        // 1. Yan yana gelen elif ve hemze (Madda: آ)
        // Örn: فَعْلَان (ق ر ء) -> قَرْءَان -> قُرْآن 
        // Örn: أَأْكُلُ -> آكُلُ
        result = result.replace(/ءَا/g, "آ");
        result = result.replace(/أَا/g, "آ");
        result = result.replace(/أَأْ/g, "آ");
        
        // 2. Ortadaki veya sondaki hemzenin makabline (öncesine) göre yazımı
        // (Burada temel yaygın kurallar işlenmiştir, proje büyüdükçe geliştirilebilir)
        result = result.replace(/ِء/g, "ِئ"); // Kesradan sonra -> ئ
        result = result.replace(/ُء/g, "ُؤ"); // Dammeden sonra -> ؤ
        
        // Sondaki hemzeler sakinse
        result = result.replace(/يء$/g, "يء");
        result = result.replace(/وء$/g, "وء");

        return result;
    }
};

const ColorEngine = {
    isHaraka: function(char) {
        return /[\u064B-\u0652\u0670]/.test(char);
    },

    isWeak: function(char) {
        return ['و', 'ي', 'ا', 'أ', 'إ', 'آ', 'ء', 'ى'].includes(char);
    },

    isEquivalent: function(char1, char2) {
        const hamzas = ['ا', 'أ', 'إ', 'آ', 'ؤ', 'ئ', 'ء'];
        const weaks = ['و', 'ي', 'ا', 'ى']; 
        
        if (char1 === char2) return true;
        if (hamzas.includes(char1) && hamzas.includes(char2)) return true;
        if (weaks.includes(char1) && weaks.includes(char2)) return true; 
        return false;
    },

    colorize: function(finalWord, rootArray = ['ف', 'ع', 'ل']) {
        // Harfleri temizle
        finalWord = finalWord.replace(/[\s\u200C\u200D\uFEFFـ]/g, '');

        let pureChars = finalWord.replace(/[\u064B-\u0652\u0670]/g, '');
        if (pureChars.match(/ف.*ع.*ل/)) {
            rootArray = ['ف', 'ع', 'ل'];
        } else if (typeof currentRoot !== 'undefined') {
            if (!currentRoot || currentRoot.trim() === "") {
                rootArray = ['ف', 'ع', 'ل'];
            }
        } else if (!rootArray || rootArray.length !== 3) {
            rootArray = ['ف', 'ع', 'ل'];
        }
        
        finalWord = finalWord.replace(/\uFEFB([\u064B-\u0652\u0670]?)/g, 'ل$1ا')
                             .replace(/\uFEF7([\u064B-\u0652\u0670]?)/g, 'ل$1أ')
                             .replace(/\uFEF9([\u064B-\u0652\u0670]?)/g, 'ل$1إ')
                             .replace(/\uFEF5([\u064B-\u0652\u0670]?)/g, 'ل$1آ');
        
        let charsOnly = [];
        for (let i = 0; i < finalWord.length; i++) {
            if (!this.isHaraka(finalWord[i])) {
                charsOnly.push({ char: finalWord[i], isRoot: false });
            }
        }

        let rIndex = 0;
        for (let i = 0; i < charsOnly.length; i++) {
            let c = charsOnly[i].char;
            
            if (rIndex < 3 && this.isEquivalent(c, rootArray[rIndex])) {
                let isZiyade = false;
                
                if (rIndex < 2 && ['س', 'أ', 'إ', 'آ', 'ل', 'ت', 'م', 'و', 'ن', 'ي', 'ه', 'ا', 'ء'].includes(c)) {
                    let searchPointer = i + 1;
                    let rootMatchCount = 0;
                    let requiredMatches = 3 - rIndex; 

                    for (let k = rIndex; k < 3; k++) {
                        let found = false;
                        for (let j = searchPointer; j < charsOnly.length; j++) {
                            if (this.isEquivalent(charsOnly[j].char, rootArray[k])) {
                                found = true;
                                searchPointer = j + 1;
                                break;
                            }
                        }
                        if (found) rootMatchCount++;
                    }

                    if (rootMatchCount === requiredMatches) {
                        isZiyade = true; 
                    }
                }

                if (!isZiyade) {
                    charsOnly[i].isRoot = true; 
                    rIndex++;
                }
            } 
            else if (rIndex + 1 < 3 && this.isEquivalent(c, rootArray[rIndex + 1]) && this.isWeak(rootArray[rIndex])) {
                // --- DÜZELTME 3: Zayıf harfi atlamadan önce gerçekten düşmüş mü diye kontrol et! ---
                let weakCharExistsLater = false;
                for (let j = i; j < charsOnly.length; j++) {
                    if (this.isEquivalent(charsOnly[j].char, rootArray[rIndex])) {
                        weakCharExistsLater = true;
                        break;
                    }
                }
                
                if (!weakCharExistsLater) {
                    charsOnly[i].isRoot = true;
                    rIndex += 2;
                }
            }
        }

        // KELİMEYİ ATOMİK PARÇALARA BÖLME
        let parsedWord = [];
        let i = 0;
        let charIdx = 0;
        while (i < finalWord.length) {
            let char = finalWord[i];
            if (this.isHaraka(char)) { i++; continue; }
            
            let isRoot = false;
            if (charIdx < charsOnly.length && charsOnly[charIdx].char === char) {
                isRoot = charsOnly[charIdx].isRoot;
                charIdx++;
            }
            
            let harekeler = "";
            let j = i + 1;
            while (j < finalWord.length && this.isHaraka(finalWord[j])) {
                harekeler += finalWord[j];
                j++;
            }
            parsedWord.push({ base: char, hareke: harekeler, isRoot: isRoot });
            i = j;
        }

        // ATOMİK KUTULARI VE BAĞLAYICILARI (ZWJ) İNŞA ETME
        let resultHtml = "";
        const nonConnectors = ['ا', 'أ', 'إ', 'آ', 'د', 'ذ', 'ر', 'ز', 'و', 'ؤ', 'ء', 'ى', 'ة'];

        for (let k = 0; k < parsedWord.length; k++) {
            let current = parsedWord[k];
            let prev = k > 0 ? parsedWord[k - 1] : null;
            let next = k < parsedWord.length - 1 ? parsedWord[k + 1] : null;
            
            let connectRight = false; // Sağdaki harfe (Öncekine) birleşecek mi?
            let connectLeft = false;  // Soldaki harfe (Sonrakine) birleşecek mi?
            
            if (prev && !nonConnectors.includes(prev.base) && current.base !== 'ء') {
                connectRight = true;
            }
            if (next && !nonConnectors.includes(current.base) && next.base !== 'ء') {
                connectLeft = true;
            }
            
            let prefix = connectRight ? "&zwj;" : "";
            let suffix = connectLeft ? "&zwj;" : "";
            let color = current.isRoot ? "#000000" : "#E53935";
            
            // Her harf tek başına bir zırhın içinde!
            resultHtml += `<span class="srf-char" style="color: ${color} !important;">${prefix}${current.base}${current.hareke}${suffix}</span>`;
        }

        return `<span class="srf-word" dir="rtl">${resultHtml}</span>`;
    }
};

// SİHİRLİ ATOMİK HİZALAMA VE LİGATÜR ENGELLEYİCİ CSS
if (!document.getElementById('srf-color-fix')) {
    const style = document.createElement('style');
    style.id = 'srf-color-fix';
    style.innerHTML = `
        .srf-word {
            display: inline-flex !important; 
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            direction: rtl !important;
            white-space: nowrap !important;
        }
        
        .srf-char {
            display: block !important; 
            margin: 0 !important;
            padding: 0 !important;
            font-variant-ligatures: none !important;
            font-family: 'Arakom', sans-serif !important;
            font-weight: normal !important;
        }

        .glass-box .ar, .glass-box .ar-small, .siga-text {
            display: block !important;
            text-align: center !important;
            width: 100% !important;
            direction: rtl !important;
        }
        .conjugation-table td, .conjugation-table th {
            text-align: center !important;
            vertical-align: middle !important;
        }
    `;
    document.head.appendChild(style);
}
// ==================================================================
// KLAVYE UZUN BASMA (LONG PRESS) ÖZELLİĞİ
// ==================================================================

document.addEventListener("DOMContentLoaded", () => {
    let keyPressTimer = null;
    let isLongPress = false;
    const longPressDelay = 400; // 400ms basılı tutunca açılır

    function initLongPress() {
        // Klavyedeki tüm tuşları al
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            const char = key.innerText.trim();
            // Eğer tuş Elif (ا) ise dinleyicileri ata
            if (char === 'ا') {
                const variations = ['أ', 'إ', 'آ'];

                const startPress = (e) => {
                    // Eğer menü zaten açıksa, kapatmasın diye durdur
                    if (document.getElementById('key-variations-menu')) return;
                    
                    isLongPress = false;
                    keyPressTimer = setTimeout(() => {
                        isLongPress = true;
                        showKeyVariations(key, variations);
                        if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
                    }, longPressDelay);
                };

                const endPress = () => {
                    if (keyPressTimer) clearTimeout(keyPressTimer);
                };

                // Mobil dokunma olayları
                key.addEventListener('touchstart', startPress, { passive: true });
                key.addEventListener('touchend', endPress);
                key.addEventListener('touchcancel', endPress);
                
                // Fare olayları
                key.addEventListener('mousedown', startPress);
                key.addEventListener('mouseup', endPress);
                key.addEventListener('mouseleave', endPress);
                
                // Standart onclick olayını devralıyoruz (ikili tetiklemeyi önlemek için)
                key.removeAttribute('onclick'); // HTML'deki onclick'i kaldır
                key.addEventListener('click', (e) => {
                    if (isLongPress) {
                        // Uzun basıldıysa normal harfi ekleme
                        e.preventDefault();
                        e.stopPropagation();
                        isLongPress = false;
                    } else {
                        // Kısa basıldıysa normal Elif ekle
                        addLetter('ا');
                        if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
                    }
                });
            }
        });
    }

    function showKeyVariations(keyElement, variations) {
        // Varsa eski menüyü temizle
        let existingMenu = document.getElementById('key-variations-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.id = 'key-variations-menu';
        menu.className = 'key-variations-menu';

        // Tuşları oluştur
        variations.forEach(v => {
            const btn = document.createElement('div');
            btn.className = 'var-key';
            btn.innerText = v;
            
            // Mouse ile tıklama
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                addLetter(v);
                menu.remove();
            });
            
            // Mobilde dokunma ile anında tepki
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                addLetter(v);
                if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
                menu.remove();
            });

            menu.appendChild(btn);
        });

        document.body.appendChild(menu);

        // Menüyü basılan tuşun tam üstüne ortala
        const rect = keyElement.getBoundingClientRect();
        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;
        
        menu.style.left = (rect.left + window.scrollX - (menuWidth / 2) + (rect.width / 2)) + 'px';
        menu.style.top = (rect.top + window.scrollY - menuHeight - 10) + 'px';
    }

    // Başka bir yere tıklanırsa veya dokunulursa varyasyon menüsünü kapat
    const closeVariationsMenu = (e) => {
        const menu = document.getElementById('key-variations-menu');
        if (menu && !menu.contains(e.target) && !e.target.classList.contains('key')) {
            menu.remove();
        }
    };

    document.addEventListener('click', closeVariationsMenu);
    document.addEventListener('touchstart', closeVariationsMenu, { passive: true });

    // Sistemi başlat
    initLongPress();
});

// --- EVRENSEL BÜYÜTME KAPATICI ---
// Sekmeler, üst bar veya sayfanın herhangi bir dış alanına tıklandığında çalışır

document.addEventListener('click', function(e) {
    // Eğer tıklanan yer, o an büyümüş olan kutunun (pulse-highlight) kendisi değilse
    if (!e.target.closest('.glass-box.pulse-highlight')) {
        if (typeof closeAllZoomedBoxes === 'function') {
            closeAllZoomedBoxes();
        }
    }
});

document.addEventListener('touchstart', function(e) {
    // Dokunmatik ekranlar (Mobil/Tablet) için aynı kontrol
    if (!e.target.closest('.glass-box.pulse-highlight')) {
        if (typeof closeAllZoomedBoxes === 'function') {
            closeAllZoomedBoxes();
        }
    }
}, { passive: true });

// --- SÜRÜKLENEBİLİR VE PARÇALI KÖK SİSTEMİ ---

// Kök harflerini kurallara göre ayırır
function formatArabicRoot(root) {
    if (!root || root.length !== 3) return root;
    const nonConnecting = ['ا','د','ذ','ر','ز','و','أ','إ','آ','ؤ','ء'];
    const l1 = root[0]; 
    const l2 = root[1]; 
    const l3 = root[2]; 
    
    const res1 = nonConnecting.includes(l1) ? l1 : l1 + 'ـ';
    const prefix2 = nonConnecting.includes(l1) ? '' : 'ـ';
    const suffix2 = nonConnecting.includes(l2) ? '' : 'ـ';
    const res2 = prefix2 + l2 + suffix2;
    const prefix3 = nonConnecting.includes(l2) ? '' : 'ـ';
    const res3 = prefix3 + l3;
    
    return `${res1}  ${res2}  ${res3}`;
}

// Yeni kök girilince eski tahtaları temizleyen fonksiyon
function clearDraggableRoots() {
    document.querySelectorAll('.draggable-root-clone').forEach(el => el.remove());
}

// Bırakılmış bir tahtayı yeniden sürüklenebilir yapan fonksiyon
function makeElementDraggable(el) {
    let isDragging = false;

    function onMouseDown(e) {
        e.preventDefault();
        isDragging = true;
        el.style.zIndex = 1000000;
        
        let startX = e.pageX || (e.touches && e.touches[0].pageX);
        let startY = e.pageY || (e.touches && e.touches[0].pageY);
        let rect = el.getBoundingClientRect();
        let offsetX = startX - rect.left - window.scrollX;
        let offsetY = startY - rect.top - window.scrollY;

        function onMouseMove(moveEvent) {
            if (!isDragging) return;
            let x = moveEvent.pageX || (moveEvent.touches && moveEvent.touches[0].pageX);
            let y = moveEvent.pageY || (moveEvent.touches && moveEvent.touches[0].pageY);
            el.style.left = (x - offsetX) + 'px';
            el.style.top = (y - offsetY) + 'px';
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchmove', onMouseMove);
            document.removeEventListener('touchend', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchmove', onMouseMove, { passive: false });
        document.addEventListener('touchend', onMouseUp);
    }

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('touchstart', onMouseDown, { passive: false });
}

// --- KLAVYE DIŞINA TIKLAYINCA KAPATMA SİSTEMİ ---
document.addEventListener("click", function(event) {
    const popup = document.getElementById('integrated-keyboard-popup');
    const searchInput = document.getElementById('root-search');
    
    // Eğer popup açıksa, tıklanan yer popup'ın içi değilse ve arama çubuğu da değilse klavyeyi kapat
    if (popup && popup.classList.contains('active')) {
        if (!popup.contains(event.target) && event.target !== searchInput) {
            closeSearchKeyboard();
        }
    }
});

// Ana kutudan yeni klon çıkartma işlemini başlatan yapı
document.addEventListener('DOMContentLoaded', () => {
    // HATA BURADAYDI: Hedefi 'root-display-box' yerine sadece yazının olduğu 'root-text-display' yaptık!
    const rootTextTarget = document.getElementById('root-text-display');
    
    if(rootTextTarget) {
        rootTextTarget.style.cursor = 'grab';
        
        // Animasyonun (👇 Sürükle) doğru yerde çıkması için relative yapıyoruz
        rootTextTarget.style.position = 'relative';
        
        const handleDragStart = (e) => {
            // Artık hedef sadece yazı olduğu için buton veya SVG kontrolüne gerek kalmadı.
            if (e.type === 'touchstart') e.preventDefault();

            if (!currentRoot || currentRoot.length !== 3) return;
            
            // Ekranda sadece TEK BİR klon olmasını garantilemek için eskileri temizle
            clearDraggableRoots();
            
            // Yeni tahta klonunu oluştur
            const formattedText = formatArabicRoot(currentRoot);
            const dragEl = document.createElement('div');
            dragEl.className = 'draggable-root-clone';
            dragEl.innerText = formattedText;
            document.body.appendChild(dragEl);

            // Yeni elemanı sürüklenebilir yap
            makeElementDraggable(dragEl);

            // Fare/Parmak pozisyonunu al
            const startX = e.pageX || (e.touches && e.touches[0].pageX);
            const startY = e.pageY || (e.touches && e.touches[0].pageY);
            
            // İlk çıktığında tam farenin ortasına hizala
            dragEl.style.left = (startX - dragEl.offsetWidth / 2) + 'px';
            dragEl.style.top = (startY - dragEl.offsetHeight / 2) + 'px';

            // Çıkar çıkmaz sürüklenmeye devam etmesi için mousedown olayını elemana devret
            const simulateClick = new MouseEvent('mousedown', {
                bubbles: true, cancelable: true, view: window,
                clientX: startX, clientY: startY
            });
            dragEl.dispatchEvent(simulateClick);
        };

        // Event dinleyicilerini sadece kök metnine bağlıyoruz
        rootTextTarget.addEventListener('mousedown', handleDragStart);
        rootTextTarget.addEventListener('touchstart', handleDragStart, { passive: false });
    }
});
// Kök girildiğinde veya seçildiğinde tahtayı otomatik olarak sahneye çıkartan fonksiyon
function autoSpawnRootClone() {
    // MOBİLDE KLON KÖK İPTAL:
    if (window.innerWidth <= 1024) return; 

    if (!currentRoot || currentRoot.length !== 3) return;
    
    clearDraggableRoots(); 
    
    const formattedText = formatArabicRoot(currentRoot);
    const dragEl = document.createElement('div');
    dragEl.className = 'draggable-root-clone';
    dragEl.innerText = formattedText;
    document.body.appendChild(dragEl);

    makeElementDraggable(dragEl);

    const rootBox = document.getElementById('root-display-box');
    if (rootBox) {
        const rect = rootBox.getBoundingClientRect();
        const spawnX = rect.left + window.scrollX + (rect.width / 2) - 60; 
        const spawnY = rect.bottom + window.scrollY + 25; 
        
        dragEl.style.left = spawnX + 'px';
        dragEl.style.top = spawnY + 'px';
    } else {
        dragEl.style.left = '50%';
        dragEl.style.top = '150px';
    }
    
    dragEl.style.transform = 'scale(0)';
    dragEl.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    setTimeout(() => {
        dragEl.style.transform = 'scale(1)';
    }, 50);
    
    setTimeout(() => {
        dragEl.style.transition = 'none';
    }, 350);
}

// ==================================================================
// SUNUM KUMANDASI VE KLAVYE İLE OTOMATİK GEÇİŞ SİSTEMİ
// ==================================================================
currentEggIndex = -1;
let isPresentationLocked = false; // YENİ: Geçişler sırasında çakışmayı önleyen kilit

function getReadyRoots() {
    return Object.keys(wordEasterEggs); 
}

function getSortedRefsForRoot(root) {
    if (!wordEasterEggs[root]) return [];
    return Object.keys(wordEasterEggs[root])
        .map(Number)
        .sort((a, b) => a - b);
}

// ==================================================================
// 2. OTOMATİK GEÇİŞ SİSTEMİ (Büyütme Kapatma ve Cümle Engelleme)
// ==================================================================
function activateBoxByRef(refId) {
    const boxes = Array.from(document.querySelectorAll('.glass-box'));
    const targetBox = boxes.find(b => {
        const refEl = b.querySelector('.ref');
        return refEl && parseInt(refEl.innerText.trim()) === refId;
    });

    if (targetBox) {
        const isTab1 = targetBox.closest('#tab1');
        const isTab2 = targetBox.closest('#tab2');
        let tabSwitched = false;

        if (isTab1 && currentTabActive !== 0) { setTab(0); tabSwitched = true; }
        if (isTab2 && currentTabActive !== 1) { setTab(1); tabSwitched = true; }

        const islemGecikmesi = tabSwitched ? 1000 : 0; 
        
        if (tabSwitched) {
            isPresentationLocked = true; 
        }

        setTimeout(() => {
            const rect = targetBox.getBoundingClientRect();
            const absoluteTop = window.scrollY + rect.top;
            const middle = absoluteTop - (window.innerHeight / 2) + (rect.height / 2);
            window.scrollTo({ top: middle, behavior: 'smooth' });

            // Kutunun kaçıncı tıklamada olduğunu artık handleBoxClick kendi çözecek
            handleBoxClick(targetBox);
            
            if (tabSwitched) {
                isPresentationLocked = false;
            }
        }, islemGecikmesi);
    }
}

// ==================================================================
// 4. İLERİ KUMANDA (İlk Tık: Sadece Sarı Vurgular | İkinci Tık: İlk Kutu)
// ==================================================================
function nextEasterEgg() {
    if (typeof isPresentationLocked !== 'undefined' && isPresentationLocked) return; 
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    let waitTime = 0;
    const activeZoom = document.getElementById('crisp-zoom-clone');
    const roots = typeof getReadyRoots === 'function' ? getReadyRoots() : [];
    if (roots.length === 0) return;

    if (activeZoom) {
        waitTime = 10; 
    }

    setTimeout(() => {
        if (!currentRoot || currentRoot.length !== 3 || (typeof wordEasterEggs !== 'undefined' && !wordEasterEggs[currentRoot])) {
            if (typeof selectReadyVerb === 'function') selectReadyVerb(roots[0]);
            return; 
        }

        const refs = typeof getSortedRefsForRoot === 'function' ? getSortedRefsForRoot(currentRoot) : [];

        if (currentEggIndex >= 0 && currentEggIndex < refs.length) {
            const currentRefId = refs[currentEggIndex];
            const currentBox = Array.from(document.querySelectorAll('.glass-box')).find(b => {
                const refEl = b.querySelector('.ref');
                return refEl && parseInt(refEl.innerText.trim()) === currentRefId;
            });
            
            if (currentBox) {
                let tiklama = parseInt(currentBox.getAttribute('data-tiklama-sayisi') || '0');
                const isZoomEnabled = window.innerWidth <= 1024 ? false : (document.getElementById('zoomToggleCheckbox') ? document.getElementById('zoomToggleCheckbox').checked : false);

                if (tiklama === 0) {
                    if (typeof activateBoxByRef === 'function') activateBoxByRef(currentRefId);
                    return;
                }

                if (isZoomEnabled) {
                    if (tiklama === 1 || tiklama === 2) {
                        if (typeof activateBoxByRef === 'function') activateBoxByRef(currentRefId);
                        return; 
                    }
                    if (tiklama === 3) {
                        // Zoom açıkken 4. adıma geçer (Büyütmeyi kapatır, tabloda yeşil bırakır)
                        if (typeof handleBoxClick === 'function') handleBoxClick(currentBox); 
                    }
                } else {
                    if (window.innerWidth <= 1024) {
                        // Mobil davranış
                        if (tiklama === 1) {
                            currentBox.classList.remove('current-active-red');
                            currentBox.setAttribute('data-tiklama-sayisi', '2'); 
                        }
                    } else {
                        // MASAÜSTÜ ZOOM KAPALI DAVRANIŞI (HATA BURADA ÇÖZÜLDÜ)
                        if (tiklama === 1) {
                            if (typeof activateBoxByRef === 'function') activateBoxByRef(currentRefId);
                            return; 
                        }
                        if (tiklama === 2) {
                            // Eskiden burada kutuyu tamamen sıfırlayan bir komut çalışıyordu.
                            // Artık sadece kırmızı vurguyu kaldırıp, kelimeyi yeşil haliyle masada bırakıyoruz!
                            currentBox.classList.remove('current-active-red');
                            currentBox.setAttribute('data-tiklama-sayisi', '3'); // Bir sonraki tıklamada sıfırlansın diye 3 yaptık
                        }
                    }
                }
            }
        }

        // Bir sonraki kutuya geçiş yap
        currentEggIndex++;

        if (currentEggIndex >= refs.length) {
            let rootIndex = roots.indexOf(currentRoot);
            rootIndex++;
            if (rootIndex >= roots.length) rootIndex = 0; 
            if (typeof selectReadyVerb === 'function') selectReadyVerb(roots[rootIndex]);
            return; 
        }

        if (typeof activateBoxByRef === 'function') activateBoxByRef(refs[currentEggIndex]);
    }, waitTime);
}
// ==================================================================
// 5. GERİ KUMANDA (Geri Dönüşlerde de Sarı Vurgu Beklemesi Eklendi)
// ==================================================================
function prevEasterEgg() {
    if (isPresentationLocked) return; 
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    // Zoom ekranı açıksa sadece zoomu kapat, kelime yeşilse yeşil kalsın diye durumu bozma
    const activeZoom = document.getElementById('crisp-zoom-clone');
    if (activeZoom) {
        if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();
        return; 
    }

    const roots = getReadyRoots();
    if (!currentRoot || currentRoot.length !== 3 || !wordEasterEggs[currentRoot] || roots.length === 0) return;

    const refs = getSortedRefsForRoot(currentRoot);

    // 1) ŞU AN BULUNULAN KUTUYU ANINDA TEMİZLE
    if (currentEggIndex >= 0 && currentEggIndex < refs.length) {
        const currentRefId = refs[currentEggIndex];
        const currentBox = Array.from(document.querySelectorAll('.glass-box')).find(b => {
            const refEl = b.querySelector('.ref');
            return refEl && parseInt(refEl.innerText.trim()) === currentRefId;
        });
        
        if (currentBox) {
            if (typeof resetBox === 'function') resetBox(currentBox);
            currentBox.removeAttribute('data-tiklama-sayisi');
            currentBox.classList.remove('current-active-red'); 
            currentBox.classList.add('sari-vurgu');
            currentBox.style.setProperty("background-color", "", "important");
        }
    }

    // 2) BİR ÖNCEKİ KUTUYA GEÇ
    currentEggIndex--;

    if (currentEggIndex === -1) {
        highlightEasterEggBoxes(currentRoot);
        return; 
    }

    if (currentEggIndex < -1) {
        let rootIndex = roots.indexOf(currentRoot);
        rootIndex--;
        if (rootIndex < 0) rootIndex = roots.length - 1; 

        selectReadyVerb(roots[rootIndex]);
        setTimeout(() => {
            const newRefs = getSortedRefsForRoot(roots[rootIndex]);
            currentEggIndex = newRefs.length - 1;
            if (newRefs.length > 0) {
                // GERİ GİDİŞ KOMUTU: TRUE
                activateBoxByRef(newRefs[currentEggIndex], true); 
            }
        }, 600);
        return;
    }

    // Normal önceki kutuya geçerken GERİ GİDİŞ KOMUTU: TRUE
    activateBoxByRef(refs[currentEggIndex], true); 
}

// --- KLAVYE VE SUNUM KUMANDASI DİNLEYİCİSİ ---
document.addEventListener('keydown', function(e) {
    // Ekranda kök girmek için açılan siyah sanal klavye aktifse kumanda tuşlarını yoksay
    const kbOverlay = document.getElementById('keyboard-overlay');
    if (kbOverlay && (kbOverlay.style.display === 'flex' || kbOverlay.style.display === 'block')) {
        return;
    }

    // Sunum kumandaları donanımsal olarak genelde PageDown/PageUp veya Yön Tuşları gibi davranır
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault(); // Boşluk (Space) tuşunun sayfayı aşağı kaydırmasını engeller
        nextEasterEgg();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevEasterEgg();
    }
});



// İkinci parametre olarak 'isBackward' eklendi
function activateBoxByRef(refId, isBackward = false) {
    // MOBİL İSE SADECE MOBİL GRİDDEN BUL
    const containerSelector = window.innerWidth <= 1024 ? '#mobile-grid .glass-box' : '.window-pencere .glass-box';
    const boxes = Array.from(document.querySelectorAll(containerSelector));
    const targetBox = boxes.find(b => {
        const refEl = b.querySelector('.ref');
        return refEl && parseInt(refEl.innerText.trim()) === refId;
    });

    if (targetBox) {
        let tabSwitched = false;
        
        // SEKME DEĞİŞTİRME SADECE MASAÜSTÜNDE ÇALIŞIR
        if (window.innerWidth > 1024) {
            const isTab1 = targetBox.closest('#tab1');
            const isTab2 = targetBox.closest('#tab2');

            if (isTab1 && currentTabActive !== 0) { setTab(0); tabSwitched = true; }
            if (isTab2 && currentTabActive !== 1) { setTab(1); tabSwitched = true; }
        }

        const islemGecikmesi = tabSwitched ? 1000 : 0; 
        
        if (tabSwitched) {
            isPresentationLocked = true; 
        }

        setTimeout(() => {
            const rect = targetBox.getBoundingClientRect();
            const absoluteTop = window.scrollY + rect.top;
            const middle = absoluteTop - (window.innerHeight / 2) + (rect.height / 2);
            window.scrollTo({ top: middle, behavior: 'smooth' });

            if (isBackward) {
                document.querySelectorAll(containerSelector).forEach(b => b.classList.remove('current-active-red'));
                targetBox.classList.add('current-active-red');
                targetBox.classList.remove('sari-vurgu');

                // MOBİLDE ZOOM OLMADIĞI İÇİN 3'TE BEKLER
                const isZoomEnabled = window.innerWidth <= 1024 ? false : (document.getElementById('zoomToggleCheckbox') ? document.getElementById('zoomToggleCheckbox').checked : false);
                if (isZoomEnabled) {
                    targetBox.setAttribute('data-tiklama-sayisi', '4'); 
                } else {
                    targetBox.setAttribute('data-tiklama-sayisi', '3'); 
                }
            } else {
                handleBoxClick(targetBox);
            }
            
            if (tabSwitched) {
                isPresentationLocked = false;
            }
        }, islemGecikmesi);
    }
}

// ==================================================================
// MOBİL ARAYÜZ ENJEKSİYONU
// ==================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Sadece Mobil 2 Sütunlu Izgarayı yarat (Mavi buton kaldırıldı)
    if (!document.getElementById('mobile-grid')) {
        const grid = document.createElement('div');
        grid.id = 'mobile-grid';
        document.body.appendChild(grid);
    }

    // Mobilde sayfa açılır açılmaz kök menüsünü (listeyi) göster
    if (window.innerWidth <= 1024) {
        setTimeout(() => {
            if (typeof openVerbModal === 'function') openVerbModal();
        }, 300);
    }
});

// ==================================================================
// HEDEFE UÇAN ARTI (+) ANİMASYONU (SAYDAM VERSİYON)
// ==================================================================
function flyEmojiToPlus(startEl) {
    // Hedef butonu bul (Masaüstü mü yoksa Mobil mi?)
    let targetBtn = document.querySelector('.fa-plus');
    if (window.innerWidth <= 1024) {
        targetBtn = document.getElementById('mobile-top-plus');
    }
    if (!targetBtn) return;

    // Başlangıç ve Bitiş koordinatlarını hesapla
    const startRect = startEl.getBoundingClientRect();
    const targetRect = targetBtn.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

   // Uçacak olan emojiyi yarat
    const particle = document.createElement('div');
    particle.innerText = '+'; // DİKKAT: Siyah emoji yerine gerçek '+' metni koyduk
    particle.style.color = 'rgba(255, 255, 255, 0.8)'; // ÇÖZÜM: Saydam, yumuşak bir beyaz/krem rengi
    particle.style.fontWeight = 'bold';
    particle.style.position = 'fixed'; 
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    particle.style.fontSize = '35px';
    particle.style.zIndex = '9999999';
    particle.style.pointerEvents = 'none'; 
    particle.style.filter = 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))';
    
    // Uçuş animasyonu ayarları (Hızlı başlar, hedefe doğru yavaşlar)
    particle.style.transition = 'all 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
    particle.style.transform = 'translate(-50%, -50%) scale(0.5)';
    
    // İŞTE BURASI: 1 yerine 0.6 yaparak şık bir yarı saydamlık verdik!
    particle.style.opacity = '0.6'; 

    document.body.appendChild(particle);

    // Tarayıcıyı yenilemeye zorla
    void particle.offsetWidth;

    // Hedefe doğru hareketi başlat ve küçülerek kaybolmasını sağla
    particle.style.left = endX + 'px';
    particle.style.top = endY + 'px';
    particle.style.transform = 'translate(-50%, -50%) scale(1.2)';
    
    setTimeout(() => {
        particle.style.opacity = '0';
        particle.style.transform = 'translate(-50%, -50%) scale(0.3)';
    }, 400); 

    // Animasyon bitince elementi DOM'dan temizle
    particle.addEventListener('transitionend', () => {
        particle.remove();
    });
}