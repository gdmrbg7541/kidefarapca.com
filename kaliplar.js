

const letters = "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" ");
let currentRoot = ""; 
let isReadyVerbMode = false; 

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

let lastClickedBoxTextSpan = null;
let lastOriginalWord = "";

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
            base: { emoji: "📰", arText: "خَبَر", trText: "Haber." } 
        },
        
        // --- 41 Numaralı Kalıp (أَفْعَال) ---
        41: { 
            base: { emoji: "📺", arText: "أَخْبَار", trText: "Haberler." } 
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
            "ات": { emoji: "📡", arText: "مُخَابَرَات", trText: "Muhaberat / Haberleşme ve iletişim ağları." } 
        },
        
        // --- 69 Numaralı Kalıp (مُفَاعِل) ---
        69: { 
            base: { emoji: "🎤", arText: "مُخَابِر", trText: "Muhabir." } 
        },
        
        // --- 103 Numaralı Kalıp (اِسْتِفْعَال) ---
        103: { 
            suggestsPlus: true,
            "ات": { emoji: "🕵️", arText: "اِسْتِخْبَارَاتُ الدَّوْلَةِ قَوِيَّةٌ", trText: "Devletin istihbaratı (haber alma teşkilatı) güçlüdür." } 
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
            base: { emoji: "🗝️", arText: "إِذَا جَاءَ نَصْرُ اللهِ وَالْفَتْحُ", trText: "Allah'ın yardımı ve fetih (zafer) geldiğinde... (Nasr Suresi)" } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🏇", arText: "فَاتِح", trText: "Fetheden / Fatih." } 
        },
        
        // --- 34 Numaralı Kalıp (فَعَّال) ---
        34: { 
            base: { emoji: "🔑", arText: "فَتَّاح", trText: "Fettah (Her türlü zorluğu açan/çözen)." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "🔓", arText: "مَفْتُوح", trText: "Açık." } 
        },
        
        // --- 40 Numaralı Kalıp (مِفْعَال) ---
        40: { 
            base: { emoji: "🔑", arText: "مِفْتَاح", trText: "Anahtar." } 
        },
        // --- 80 Numaralı Kalıp (مِفْعَال) ---
        80: { 
            base: { emoji: "🧎🏻‍♂️", arText: "اِفْتِتَاح", trText: "Namazdaki ilk tekbiri getirme, açılış tekbiri." } 
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
            base: { emoji: "🖋️", arText: "النَّظْمُ وَالنَّثْرُ فِي الْأَدَبِ", trText: "Edebiyatta nazım (şiir) ve nesir (düzyazı)." } 
        },
        
        // --- 23 Numaralı Kalıp (فِعَال) ---
        23: { 
            base: { emoji: "⚙️", arText: "النِّظَامُ أَسَاسُ النَّجَاحِ", trText: "Nizam (düzen), başarının temelidir." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "✍️", arText: "نَاظِم", trText: "Düzenleyen / Şair (Nazım)." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "🎼", arText: "مَنْظُوم", trText: "Dizilmiş / Manzum." }, 
            suggestsPlus: true, 
            "ة": { emoji: "📜", arText: "مَنْظُومَةٌ شِعْرِيَّةٌ", trText: "Şiir dizeleri / Manzume." } 
        },
        
        // --- 61 Numaralı Kalıp (تَفْعِيل) ---
        61: { 
            base: { emoji: "📋", arText: "تَنْظِيمُ الْوَقْتِ مُهِمٌّ", trText: "Zamanın tanzimi (düzenlenmesi) önemlidir." }, 
            suggestsPlus: true, 
            "ات": { emoji: "📜", arText: "فَتْرَةُ التَّنْظِيمَاتِ فِي الدَّوْلَةِ الْعُثْمَانِيَّةِ", trText: "Osmanlı Devleti'nde Tanzimat Dönemi (Düzenlemeler)." } 
        },
        
        // --- 80 Numaralı Kalıp (اِفْتِعَال) ---
        80: { 
            base: { emoji: "📏", arText: "اِنْتِظَام", trText: "Düzenlilik / İntizam." } 
        },
        
        // --- 82 Numaralı Kalıp (مُفْتَعَل) ---
        82: { 
            suggestsPlus: true,
            "ا": { emoji: "🔄", arText: "يَعْمَلُ بِشَكْلٍ مُنْتَظَمٍ", trText: "Muntazaman (düzenli bir şekilde) çalışıyor." } 
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
            suggestsPlus: true,
            "ة": { emoji: "📜", arText: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللهِ", trText: "Kelime-i Şehadet, İslam'ın ilk şartıdır." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "👁️", arText: "الْقَاضِي يَسْتَمِعُ إِلَى الشَّاهِدِ فِي الْمَحْكَمَةِ", trText: "Hâkim, mahkemede şahidi dinler." } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "🌹", arText: "وَلَا تَحْسَبَنَّ الَّذِينَ قُتِلُوا فِي سَبِيلِ اللهِ أَمْوَاتًا", trText: "Allah yolunda öldürülenleri sakın ölüler sanma. (Âl-i İmrân Suresi)" } 
        },
        
        // --- 46 Numaralı Kalıp (فُعَلَاء) ---
        46: { 
            base: { emoji: "🇹🇷", arText: "شُهَدَاءُ الْوَطَنِ لَا يَمُوتُونَ أَبَدًا", trText: "Vatan şehitleri (şüheda) asla ölmez." } 
        },
        
        // --- 67 Numaralı Kalıp (مُفَاعَلَة) ---
        67: { 
            base: { emoji: "📺", arText: "مُشَاهَدَةُ الْفِيدْيُوهَاتِ التَّعْلِيمِيَّةِ مُفِيدَةٌ", trText: "Eğitici videoların izlenmesi (müşahede edilmesi) faydalıdır." } 
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
            base: { emoji: "🌍", arText: "هَذَا خَلْقُ اللهِ", trText: "Bu, Allah'ın yaratmasıdır (yarattığıdır). (Lokman Suresi)" } 
        },

        // --- 21 Numaralı Kalıp (فُعُل) ---
        21: { 
            base: { emoji: "💎", arText: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ", trText: "Şüphesiz sen yüce bir ahlak üzeresin. (Kalem Suresi)" } 
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
            "ات": { emoji: "🐾", arText: "كُلُّ الْمَخْلُوقَاتِ تُسَبِّحُ لِلهِ", trText: "Bütün mahlukat (yaratılmışlar) Allah'ı tesbih eder." }
        },
        
        // --- 41 Numaralı Kalıp (أَفْعَال - Çoğul) ---
        41: { 
            base: { emoji: "🤝", arText: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ", trText: "Ben ancak güzel ahlakı tamamlamak için gönderildim. (Hadis-i Şerif)" } 
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
            base: { emoji: "🌸", arText: "تَخَلَّقْ", trText: "Ahlaklan!" },
            suggestsPlus: true,
            "وا": { emoji: "🌷", arText: "تَخَلَّقُوا بِأَخْلَاقِ اللهِ", trText: "Allah'ın ahlakıyla ahlaklanın." }
        }
    },

    // ==================================================================
    // 8. S-J-D (س ج د) KÖKÜ - Secde Etmek
    // 1. Bab (فَعَلَ - يَفْعُلُ)
    // ==================================================================
    "سجد": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi) ---
        1: { 
            base: { emoji: "🧎", arText: "سَجَدَ", trText: "Secde etti." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari) ---
        2: { 
            base: { emoji: "🤲", arText: "يَسْجُدُ", trText: "Secde eder / Ediyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir) ---
        3: { 
            base: { emoji: "⬇️", arText: "اُسْجُدْ", trText: "Secde et!" } 
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            suggestsPlus: true, 
            "ة": { emoji: "🧎", arText: "سَجْدَةُ الشُّكْرِ تَدُلُّ عَلَى الِامْتِنَانِ", trText: "Şükür secdesi, minnettarlığı (şükranı) gösterir." } 
        },
        
        // --- 25 Numaralı Kalıp (فُعُول) ---
        25: { 
            base: { emoji: "🤲", arText: "أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ", trText: "Kulun Rabbine en yakın olduğu an secde (sücud) anıdır; orada duayı çok yapın. (Hadis-i Şerif)" } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🙇", arText: "سَاجِد", trText: "Secde eden." } 
        },
        
        // --- 37 Numaralı Kalıp (مَفْعِل) ---
        37: { 
            base: { emoji: "🕌", arText: "أَحَبُّ الْبِلَادِ إِلَى اللهِ مَسَاجِدُهَا", trText: "Allah'a beldelerin en sevimlisi mescitleridir (camileridir). (Hadis-i Şerif)" } 
        }
    },

    // ==================================================================
    // 9. S-D-Q (ص د ق) KÖKÜ - Doğru Olmak
    // 1. Bab (فَعَلَ - يَفْعُلُ)
    // ==================================================================
    "صدق": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi) ---
        1: { 
            base: { emoji: "🗣️", arText: "صَدَقَ الله العَظِيم", trText: "Yüce Allah C.C. doğru söyledi." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari) ---
        2: { 
            base: { emoji: "✅", arText: "يَصْدُقُ", trText: "Doğru söyler / Söylüyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir) ---
        3: { 
            base: { emoji: "✔️", arText: "اُصْدُقْ", trText: "Doğru söyle!" } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            suggestsPlus: true, 
            "ة": { emoji: "🪙", arText: "صَدَقَة", trText: "Sadaka." } 
        },

        // --- 20 Numaralı Kalıp (فِعْل) ---
        20: { 
            base: { emoji: "🕊️", arText: "الصِّدْقُ صِفَةُ الْأَنْبِيَاءِ", trText: "Doğruluk (sıdk), peygamberlerin ve Ebu Bekir es-Sıddîk'ın sıfatıdır." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "👯", arText: "صَادِق", trText: "Doğru söyleyen / Sadık." } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "🤝", arText: "الصَّدِيقُ وَقْتَ الضِّيقِ", trText: "Gerçek dost (sadık arkadaş), sıkıntı vaktinde belli olur. (Atasözü)" } 
        },
        
        // --- 61 Numaralı Kalıp (تَفْعِيل) ---
        61: { 
            base: { emoji: "✔️", arText: "تَصْدِيق", trText: "Onaylamak / Tasdik etmek." } 
        }
    },



    // 10. H-S-D (ح س د) KÖKÜ - Kıskanmak
    "حسد": {
        1: { base: { emoji: "🧿", arText: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ", trText: "Haset ettiği zaman hasetçinin şerrinden (Allah'a sığınırım). (Felak Suresi)" } }, // حَسَدَ
        33: { base: { emoji: "😒", arText: "حَاسِد", trText: "Kıskanan / Hasetçi." } } // حَاسِد
    },

    // ==================================================================
    // 11. D-Kh-L (د خ ل) KÖKÜ - Girmek / Dahil Olmak
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve Müfâ'ale Babı
    // ==================================================================
    "دخل": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { 
            base: { emoji: "🚶", arText: "دَخَلَ", trText: "Girdi." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { 
            base: { emoji: "🚶‍♂️", arText: "يَدْخُلُ", trText: "Girer / Giriyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { 
            base: { emoji: "🚪", arText: "اُدْخُلْ", trText: "Gir!" } 
        },

        // --- 25 Numaralı Kalıp (فُعُول) ---
        25: { 
            base: { emoji: "🚪", arText: "مَمْنُوعُ الدُّخُولِ", trText: "Giriş yasaktır." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "📦", arText: "دَاخِل", trText: "İç / Dahil." }, 
            suggestsPlus: true, 
            "يَّة": { emoji: "🏛️", arText: "وِزَارَةُ الدَّاخِلِيَّةِ", trText: "İçişleri Bakanlığı." } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { emoji: "🏢", arText: "مَدْخَل", trText: "Giriş yeri." } 
        },
        
        // --- 55 Numaralı Kalıp (إِفْعَال) ---
        55: { 
            base: { emoji: "📥", arText: "إِدْخَال", trText: "Girdi / İçeri sokmak." }, 
            suggestsPlus: true, 
            "ات": { emoji: "📊", arText: "إِدْخَالَات", trText: "Girdiler." } 
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
            base: { emoji: "🛑", arText: "الْمُدَاخَلَةُ السَّرِيعَةُ تَمْنَعُ الْمُشْكِلَةَ", trText: "Hızlı müdahale (müdahale) sorunun büyümesini engeller." } 
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
            base: { emoji: "🏇", arText: "رُكُوب", trText: "Binmek." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fail) ---
        33: { 
            base: { emoji: "💺", arText: "رَاكِب", trText: "Yolcu / Binen." } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekan/Zaman) ---
        38: { 
            base: { emoji: "⛴️", arText: "مَرْكَب", trText: "Gemi / Binek." },
            suggestsPlus: true, 
            "ة": { emoji: "🛸", arText: "مَرْكَبَةٌ فَضَائِيَّةٌ", trText: "Uzay aracı (Binek)." }
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
            "ات": { emoji: "🧬", arText: "تَرْكِيبَاتٌ كِيمْيَائِيَّةٌ", trText: "Kimyasal terkipler (bileşimler)." }
        },
        
        // --- 63 Numaralı Kalıp (مُفَعَّل - Tef'îl Babı İsm-i Mef'ulü) ---
        63: { 
            base: { emoji: "✒️", arText: "مُرَكَّب", trText: "Birleşik (Mürekkep) / Mürekkep." } 
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
            "ا": { emoji: "📺", arText: "بُثَّتِ الْمُبَارَاةُ نَقْلًا مُبَاشِرًا", trText: "Maç canlı olarak (naklen) yayınlandı." }, 
            "يَّة": { emoji: "📦", arText: "نَقْلِيَّة", trText: "Nakliye." }, 
            "يَّات": { emoji: "🚛", arText: "شَرِكَةُ النَّقْلِيَّاتِ تَشْحَنُ الْبَضَائِعَ", trText: "Nakliyat şirketi malları taşır." } 
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
            base: { emoji: "🚗", arText: "الأَمْوَالُ غَيْرُ الْمَنْقُولَةِ هِيَ الْعَقَارَاتُ", trText: "Gayrimenkul (taşınmaz) mallar ev ve arsalardır." } 
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
            base: { emoji: "🥛", arText: "شَرِبَ", trText: "İçti." } 
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { 
            base: { emoji: "🥤", arText: "يَشْرَبُ", trText: "İçer / İçiyor." } 
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { 
            base: { emoji: "💧", arText: "اِشْرَبْ", trText: "İç!" } 
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            suggestsPlus: true, 
            "ة": { emoji: "🍵", arText: "شَرْبَة", trText: "Bir içimlik / Şerbet." } 
        },
        
        // --- 22 Numaralı Kalıp (فَعَال) ---
        22: { 
            base: { emoji: "🍹", arText: "يَخْرُجُ مِنْ بُطُونِهَا شَرَابٌ مُخْتَلِفٌ أَلْوَانُهُ", trText: "Onların karınlarından renkleri çeşitli bir içecek (şerbet) çıkar. (Nahl Suresi)" } 
        },
        
        // --- 25 Numaralı Kalıp (فُعُول) ---
        25: { 
            base: { emoji: "🥛", arText: "شُرُوب", trText: "İçmek." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            suggestsPlus: true, 
            "ات": { emoji: "🥤", arText: "الْمَشْرُوبَاتُ الْبَارِدَةُ لَذِيذَةٌ فِي الصَّيْفِ", trText: "Soğuk meşrubatlar (içecekler) yazın lezzetlidir." } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { emoji: "⛲", arText: "قَدْ عَلِمَ كُلُّ أُنَاسٍ مَّشْرَبَهُمْ", trText: "Her topluluk kendi içeceği yeri (meşrebini) bildi. (Bakara Suresi)" } 
        }
    },

     // --- S-F-R (س ف ر) KÖKÜ - Yolculuk / Açığa Çıkarmak ---
    "سفر": { 
        17: { base: { emoji: "🛤️", arText: "سَفَر", trText: "Yolculuk / Sefer." } },
        35: { base: { emoji: "👔", arText: "سَفِير", trText: "Büyükelçi (Sefir)." }, suggestsPlus: true, "ة": { emoji: "🏢", arText: "سَفَارَة", trText: "Büyükelçilik (Sefaret)." } },
        
        // Müfâ'ale Babı (سَافَرَ - يُسَافِرُ)
        64: { base: { emoji: "✈️", arText: "سَافَرَ", trText: "Yolculuk yaptı / Sefere çıktı." } },
        65: { base: { emoji: "🌍", arText: "يُسَافِرُ", trText: "Yolculuk yapıyor." } },
        66: { base: { emoji: "🎒", arText: "سَافِرْ", trText: "Yolculuk yap!" } },
        69: { base: { emoji: "🧳", arText: "الضَّيْفُ (المُسَافِرُ) يَأْتِي بِرِزْقِهِ", trText: "Misafir (yolcu) rızkıyla gelir. (Atasözü)" } }
    }, 

      // --- '-Q-L (ع ق ل) KÖKÜ - Akıl / Anlamak / Bağlamak ---
    "عقل": { 
        // 2. Bab (فَعَلَ - يَفْعِلُ)
        1: { base: { emoji: "🧠", arText: "عَقَلَ", trText: "Akıl etti / Anladı." } },
        4: { base: { emoji: "🤔", arText: "يَعْقِلُ", trText: "Akıl eder / Düşünüyor." } },
        5: { base: { emoji: "💡", arText: "اِعْقِلْ", trText: "Akıl et / Düşün!" } },
        
        19: { base: { emoji: "🧠", arText: "العَقْلُ السَّلِيمُ فِي الجِسْمِ السَّلِيمِ", trText: "Sağlam akıl (kafa), sağlam vücutta bulunur. (Atasözü)" } },
        33: { base: { emoji: "🤓", arText: "عَاقِل", trText: "Akıllı / Mantıklı." } },
        36: { base: { emoji: "✅", arText: "سِعْرٌ مَعْقُولٌ", trText: "Makul (akla yatkın / mantıklı) bir fiyat." }, suggestsPlus: true, "ات": { emoji: "💬", arText: "مَعْقُولَات", trText: "Akla yatkın şeyler / Mantıklı konular." } }
    },

   

    // 16. 'A-S-M (ع ص م) KÖKÜ - Korumak / Günahsızlık
    "عصم": {
        20: { suggestsPlus: true, "ة": { emoji: "🕊️", arText: "عِصْمَةُ الْأَنْبِيَاءِ", trText: "Peygamberlerin günahsızlığı (İsmet sıfatı)." } }, // عِصْم + ة = عِصْمَة
        33: { base: { emoji: "🛡️", arText: "لَا عَاصِمَ الْيَوْمَ مِنْ أَمْرِ اللهِ", trText: "Bugün Allah'ın emrinden koruyacak hiçbir güç yoktur. (Hud Suresi)" } }, // عَاصِم
        36: { base: { emoji: "👼", arText: "الأَطْفَالُ مَعْصُومُونَ", trText: "Çocuklar masumdur (günahsızdır)." } } // مَعْصُوم
    },

    // ==================================================================
    // 17. Q-R-B (ق ر ب) KÖKÜ - Yakın Olmak (Akraba / Kurban)
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
            base: { emoji: "🐑", arText: "إِنَّمَا يَتَقَبَّلُ اللهُ مِنَ الْمُتَّقِينَ", trText: "Allah ancak takva sahiplerinden (kurbanı) kabul eder. (Maide Suresi)" } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "🫂", arText: "قَرِيب", trText: "Yakın." } 
        },
        
        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - Mazi / İfti'âl Babı) ---
        77: { 
            base: { emoji: "🌙", arText: "اِقْتَرَبَتْ السَّاعَةُ وَانشَقَّ الْقَمَرُ", trText: "Kıyamet vakti (saat) yaklaştı ve ay yarıldı. (Kamer Suresi)" } 
        },
        
        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - Muzari / İfti'âl Babı) ---
        78: { 
            base: { emoji: "⏳", arText: "يَقْتَرِبُ", trText: "Yaklaşır / Yaklaşıyor." } 
        },
        
        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - Emir / İfti'âl Babı) ---
        79: { 
            base: { emoji: "🏃", arText: "اِقْتَرِبْ", trText: "Yaklaş!" } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { emoji: "🚶‍♂️" } 
        }
    },

    // 18. T-B-Q (ط ب ق) KÖKÜ - Uymak / Katman / Tatbik Etmek
    "طبق": {
        17: { base: { emoji: "🍽️", arText: "طَبَق", trText: "Tabak." }, suggestsPlus: true, "ة": { emoji: "🥞", arText: "طَبَقَةُ الأُوزُون", trText: "Ozon tabakası." } }, // طَبَق + ة = طَبَقَة
        61: { base: { emoji: "📱", arText: "تَطْبِيقُ الْقَوَاعِدِ مُهِمٌّ", trText: "Kuralların uygulanması (tatbik edilmesi) önemlidir." }, suggestsPlus: true, "ات": { emoji: "📲", arText: "تَطْبِيقَاتُ الْهَاتِفِ", trText: "Telefon uygulamaları (tatbikatları)." } }, // تَطْبِيق + ات = تَطْبِيقَات
        67: { suggestsPlus: true, "ات": { emoji: "✅", arText: "مُطَابَقَةُ الْحِسَابَاتِ", trText: "Hesap mutabakatı (uyuşması)." } }, // مُطَابَقَة -> مُطَابَقَات
        69: { base: { emoji: "🤝", arText: "نَحْنُ مُتَطَابِقُونَ فِي الرَّأْيِ", trText: "Biz bu görüşte mutabıkız (aynı fikirdeyiz)." } } // مُطَابِق
    },

   // ==================================================================
    // 19. H-K-M (ح ك م) KÖKÜ - Hükmetmek / Yargılamak / Bilgelik
    // 1. Bab (فَعَلَ - يَفْعُلُ), Müfâ'ale ve Tefe'ul Babları
    // ==================================================================
    "حكم": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { 
            base: { emoji: "⚖️", arText: "حَكَمَ", trText: "Hükmetti / Karar verdi." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { 
            base: { emoji: "🧑‍⚖️", arText: "يَحْكُمُ", trText: "Hükmeder / Karar veriyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { 
            base: { emoji: "🔨", arText: "اُحْكُمْ", trText: "Hükmet / Karar ver!" } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { emoji: "🏁", arText: "فَابْعَثُوا حَكَمًا مِّنْ أَهْلِهِ وَحَكَمًا مِّنْ أَهْلِهَا", trText: "Erkeğin ailesinden bir hakem ve kadının ailesinden bir hakem gönderin. (Nisa Suresi)" } 
        },
        
        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            base: { emoji: "📜", arText: "إِنِ الْحُكْمُ إِلَّا لِلهِ", trText: "Hüküm ancak Allah'ındır. (Yusuf Suresi)" } 
        },
        
        // --- 25 Numaralı Kalıp (فُعُول) ---
        25: { 
            suggestsPlus: true, 
            "ة": { emoji: "🏛️", arText: "حُكُومَة", trText: "Hükümet." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🧑‍⚖️", arText: "حَاكِم", trText: "Hakim / Yönetici." } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "🦉", arText: "يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ", trText: "Allah hikmeti dilediğine verir. (Bakara Suresi)" } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "⛓️", arText: "مَحْكُوم", trText: "Mahkum." } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            suggestsPlus: true, 
            "ة": { emoji: "⚖️", arText: "مَحْكَمَة", trText: "Mahkeme." } 
        },

        // --- 64 Numaralı Kalıp (فَاعَلَ - Mazi / Müfâ'ale Babı) ---
        64: { 
            base: { emoji: "👨‍⚖️", arText: "حَاكَمَ", trText: "Yargıladı / Muhakeme etti." } 
        },
        
        // --- 65 Numaralı Kalıp (يُفَاعِلُ - Muzari / Müfâ'ale Babı) ---
        65: { 
            base: { emoji: "⚖️", arText: "يُحَاكِمُ", trText: "Yargılar / Yargılıyor." } 
        },
        
        // --- 66 Numaralı Kalıp (فَاعِلْ - Emir / Müfâ'ale Babı) ---
        66: { 
            base: { emoji: "❗", arText: "حَاكِمْ", trText: "Yargıla / Muhakeme et!" } 
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Müfâ'ale Masdarı) ---
        67: { 
            base: { emoji: "📝", arText: "مُحَاكَمَة", trText: "Yargılama / Muhakeme." } 
        },

        // --- 88 Numaralı Kalıp (تَفَعَّلَ - Mazi / Tefe'ul Babı) ---
        88: { 
            base: { emoji: "🎮", arText: "تَحَكَّمَ", trText: "Kontrol etti / Hakim oldu (Tahakküm etti)." } 
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
            "ات": { emoji: "⚙️", arText: "لَوْحَةُ التَّحَكُّمِ", trText: "Kontrol paneli." } 
        }
    },


    // ==================================================================
    // 20. '-R-F (ع ر ف) KÖKÜ - Bilmek / Tanımak / İtiraf Etmek
    // 2. Bab (فَعَلَ - يَفْعِلُ), Tef'îl, İfti'âl ve Tefâ'ul Babları
    // ==================================================================
    "عرف": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 2. Bab) ---
        1: { 
            base: { emoji: "🧠", arText: "عَرَفَ", trText: "Bildi / Tanıdı." } 
        },
        
        // --- 4 Numaralı Kalıp (يَفْعِلُ - Muzari / 2. Bab) ---
        4: { 
            base: { emoji: "🤔", arText: "يَعْرِفُ", trText: "Bilir / Tanıyor." } 
        },
        
        // --- 5 Numaralı Kalıp (اِفْعِلْ - Emir / 2. Bab) ---
        5: { 
            base: { emoji: "💡", arText: "اِعْرِفْ", trText: "Bil / Tanı!" } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            suggestsPlus: true, 
            "ة": { emoji: "⛰️", arText: "عَرَفَة", trText: "Arafat tepesi." } 
        },
        
        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            base: { emoji: "🤝", arText: "عُرْف", trText: "Gelenek / Örf." } 
        },
        
        // --- 29 Numaralı Kalıp (فِعْلَان) ---
        29: { 
            base: { emoji: "🌟", arText: "عِرْفَان", trText: "İrfan / Bilgi." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🧠", arText: "العَارِفُ تَكْفِيهِ الإِشَارَةُ", trText: "Ârife tarif gerekmez." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "👍", arText: "وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنْكَرِ", trText: "İyiliği emret, kötülükten sakındır. (Lokman Suresi)" } 
        },
        
        // --- 37 Numaralı Kalıp (مَفْعِل) ---
        37: { 
            suggestsPlus: true, 
            "ة": { emoji: "💡", arText: "مَعْرِفَة", trText: "Bilgi / Marifet." } 
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
            base: { emoji: "📋", arText: "تَعْرِيف", trText: "Tanımlama / Tarif." } 
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
            base: { emoji: "📜", arText: "اِعْتِرَاف", trText: "İtiraf / Tanıma." } 
        },

        // --- 94 Numaralı Kalıp (تَفَاعَلَ - Mazi / Tefâ'ul Babı) ---
        94: { 
            base: { emoji: "🤝", arText: "تَعَارَفَ", trText: "Tanıştı." } 
        },
        
        // --- 95 Numaralı Kalıp (يَتَفَاعَلُ - Muzari / Tefâ'ul Babı) ---
        95: { 
            base: { emoji: "👥", arText: "يَتَعَارَفُ", trText: "Tanışır / Tanışıyor." },
            suggestsPlus: true,
            "ونَ": { emoji: "🌍", arText: "وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا", trText: "Sizi tanışmanız için milletlere ve kabilelere ayırdık. (Hucurât Suresi)" }
        },
        
        // --- 96 Numaralı Kalıp (تَفَاعَلْ - Emir / Tefâ'ul Babı) ---
        96: { 
            base: { emoji: "👋", arText: "تَعَارَفْ", trText: "Tanış!" } 
        },

        // --- 97 Numaralı Kalıp (تَفَاعُل - Masdar / Tefâ'ul Babı) ---
        97: { 
            base: { emoji: "🫂", arText: "تَعَارُف", trText: "Tanışma / Birbirini tanıma." },
            suggestsPlus: true,
            "ات": { emoji: "🤝", arText: "تَعَارُفَات", trText: "Tanışmalar." }
        }
    },


   // ==================================================================
    // 21. '-L-M (ع ل م) KÖKÜ - Bilmek / Öğrenmek / Öğretmek
    // 4. Bab (فَعِلَ - يَفْعَلُ), Tef'îl, Tefe'ul ve İsti'fal Babları
    // ==================================================================
    "علم": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / 4. Bab) ---
        8: { 
            base: { emoji: "💡", arText: "عَلِمَ", trText: "Bildi / Öğrendi." } 
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { 
            base: { emoji: "🤔", arText: "يَعْلَمُ", trText: "Bilir / Biliyor." } 
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { 
            base: { emoji: "❗", arText: "اِعْلَمْ", trText: "Bil!" } 
        },

        // --- 20 Numaralı Kalıp (فِعْل - Masdar) ---
        20: { 
            base: { emoji: "📖", arText: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ", trText: "İlim öğrenmek her Müslüman'a farzdır. (Hadis-i Şerif)" } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🎓", arText: "عَالِم", trText: "Bilen / Alim." }, 
            suggestsPlus: true, 
            "ة": { emoji: "🧕", arText: "عَالِمَةٌ جَلِيلَةٌ", trText: "Büyük bir kadın âlim." }, 
            "ونَ": { emoji: "👨‍🎓", arText: "عَالِمُونَ", trText: "Âlimler (Düzenli Çoğul)." } 
        },
        
        // --- 34 Numaralı Kalıp (فَعَّالَة - Mübalağa) ---
        34: { 
            suggestsPlus: true, 
            "ة": { emoji: "🧠", arText: "عَلَّامَةُ الْعَصْرِ", trText: "Asrın büyük âlimi (Allâme)." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "💡", arText: "كُلُّ شَيْءٍ مَعْلُومٌ عِنْدَ اللهِ", trText: "Her şey Allah katında malumdur (bilinmektedir)." }, 
            suggestsPlus: true, 
            "ات": { emoji: "ℹ️", arText: "مَعْلُومَاتٌ مُهِمَّةٌ", trText: "Önemli bilgiler (Malumat)." } 
        },
        
        // --- 43 Numaralı Kalıp (فُعُول - Çoğul Masdar) ---
        43: { 
            base: { emoji: "🔬", arText: "الْعُلُومُ النَّافِعَةُ تَبْنِي الْحَضَارَاتِ", trText: "Faydalı ilimler (bilimler) medeniyetleri inşa eder." } 
        },
        
        // --- 46 Numaralı Kalıp (فُعَلَاء - Çoğul İsm-i Fail) ---
        46: { 
            base: { emoji: "👥", arText: "الْعُلَمَاءُ وَرَثَةُ الْأَنْبِيَاءِ", trText: "Âlimler peygamberlerin varisleridir. (Hadis-i Şerif)" },
            suggestsPlus: true,
            "ا": { emoji: "🤲", arText: "إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ", trText: "Kulları içinden ancak âlimler, Allah'tan korkar. (Fâtır Suresi)" }
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { 
            base: { emoji: "🗣️", arText: "عَلَّمَ", trText: "Öğretti." } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { 
            base: { emoji: "📢", arText: "يُعَلِّمُ", trText: "Öğretir / Öğretiyor." } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { 
            base: { emoji: "📝", arText: "عَلِّمْ", trText: "Öğret!" } 
        },
        
        // --- 61 Numaralı Kalıp (تَفْعِيل - Masdar / Tef'îl Babı) ---
        61: { 
            base: { emoji: "🏫", arText: "تَعْلِيمُ اللُّغَةِ الْعَرَبِيَّةِ", trText: "Arapça eğitimi (öğretimi)." } 
        },
        
        // --- 62 Numaralı Kalıp (مُفَعِّل - İsm-i Fail / Tef'îl Babı) ---
        62: { 
            base: { emoji: "👨‍🏫", arText: "كادَ المُعَلِّمُ أَن يَكونَ رَسولاً", trText: "Öğretmen neredeyse bir elçi olacaktı." }, 
            suggestsPlus: true, 
            "ة": { emoji: "👩‍🏫", arText: "مُعَلِّمَةٌ مُخْلِصَةٌ", trText: "İhlaslı bir kadın öğretmen." } 
        },

        // --- 88 Numaralı Kalıp (تَفَعَّلَ - Mazi / Tefe'ul Babı) ---
        88: { 
            base: { emoji: "🕋", arText: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", trText: "Sizin en hayırlınız Kur'an'ı öğrenen ve öğreteninizdir. (Hadis-i Şerif)" } 
        },
        
        // --- 89 Numaralı Kalıp (يَتَفَعَّلُ - Muzari / Tefe'ul Babı) ---
        89: { 
            base: { emoji: "📚", arText: "يَتَعَلَّمُ", trText: "Öğrenir / Öğreniyor." } 
        },
        
        // --- 90 Numaralı Kalıp (تَفَعَّلْ - Emir / Tefe'ul Babı) ---
        90: { 
            base: { emoji: "✍️", arText: "تَعَلَّمُوا الْعَرَبِيَّةَ فَإِنَّهَا مِنْ دِينِكُمْ", trText: "Arapçayı öğrenin, çünkü o dininizdendir. (Hz. Ömer)" } 
        },
        
        // --- 91 Numaralı Kalıp (تَفَعُّل - Masdar / Tefe'ul Babı) ---
        91: { 
            base: { emoji: "🎓", arText: "تَعَلُّـم", trText: "Öğrenim / Öğrenme." } 
        }
    },


   // ==================================================================
    // 22. R-H-M (ر ح م) KÖKÜ - Merhamet Etmek / Acımak
    // 4. Bab (فَعِلَ - يَفْعَلُ) ve İsti'fal Babı
    // ==================================================================
    "رحم": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / 4. Bab) ---
        8: { 
            base: { emoji: "❤️", arText: "رَحِمَ", trText: "Merhamet etti / Acıdı." } 
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { 
            base: { emoji: "🤲", arText: "يَرْحَمُ", trText: "Merhamet eder / Acıyor." } 
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { 
            base: { emoji: "🙏", arText: "اِرْحَمْ", trText: "Merhamet et / Acı!" } 
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            suggestsPlus: true, 
            "ة": { emoji: "🌧️", arText: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِلْعَالَمِينَ", trText: "Biz seni ancak âlemlere rahmet olarak gönderdik. (Enbiya Suresi)" } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "🤍", arText: "بِسْمِ اللهِ الرَّحْمَٰنِ الرَّحِيمِ", trText: "Rahman ve Rahim olan Allah'ın adıyla." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "🤲", arText: "رَحِمَهُ اللهُ رَحْمَةً وَاسِعَةً", trText: "Allah ona geniş bir rahmetle merhamet etsin (Merhum / Vefat etmiş kişi)." } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            suggestsPlus: true, 
            "ة": { emoji: "🤝", arText: "وَتَوَاصَوْا بِالصَّبْرِ وَتَوَاصَوْا بِالْمَرْحَمَةِ", trText: "Birbirlerine sabrı ve merhameti tavsiye edenler... (Beled Suresi)" } 
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
            base: { emoji: "📜", arText: "أَقَدِّمُ إِلَيْكُمْ رِسَالَةَ اسْتِرْحَامٍ", trText: "Size bir istirham (merhamet/rica) dilekçesi sunuyorum." } 
        }
    },


   // ==================================================================
    // 23. Kh-L-F (خ ل ف) KÖKÜ - Arkada kalmak / Halef olmak / İhtilaf etmek
    // 1. Bab (فَعَلَ - يَفْعُلُ), Müfâ'ale ve İfti'âl Babları
    // ==================================================================
    "خلف": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { base: { emoji: "🔙", arText: "خَلَفَ", trText: "Arkada kaldı / Halef oldu." } },
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { base: { emoji: "🚶", arText: "يَخْلُفُ", trText: "Arkada kalır / Halef oluyor." } },
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { base: { emoji: "❗", arText: "اُخْلُفْ", trText: "Arkada kal / Halef ol!" } },

        17: { base: { emoji: "👣", arText: "خَلَف", trText: "Gelen / Halef." } }, 
        23: { suggestsPlus: true, "ة": { emoji: "🕌", arText: "خِلَافَة", trText: "Hilafet." } }, 
        35: { suggestsPlus: true, "ة": { emoji: "👑", arText: "إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً", trText: "Muhakkak ben yeryüzünde bir halife var edeceğim. (Bakara Suresi)" } }, 
        46: { base: { emoji: "👥", arText: "الْخُلَفَاءُ الرَّاشِدُونَ", trText: "Hulefa-i Raşidin (Dört Halife)." } }, 
        
        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı) ---
        64: { base: { emoji: "🙅", arText: "خَالَفَ", trText: "Muhalefet etti / Karşı çıktı." } },
        65: { base: { emoji: "🗣️", arText: "يُخَالِفُ", trText: "Muhalefet eder / Karşı çıkıyor." } },
        66: { base: { emoji: "✋", arText: "خَالِفْ", trText: "Muhalefet et / Karşı çık!" } },

        67: { base: { emoji: "🚫", arText: "يَجِبُ تَجَنُّبُ الْمُخَالَفَةِ", trText: "Muhalefetten (kurallara aykırı davranmaktan) kaçınmak gerekir." } }, 
        69: { base: { emoji: "🙅‍♂️", arText: "مُخَالِف", trText: "Muhalif / Karşı çıkan." } }, 
        
        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı) ---
        77: { base: { emoji: "↔️", arText: "اِخْتَلَفَ", trText: "İhtilafa düştü / Ayrılığa düştü." } },
        78: { base: { emoji: "🤷", arText: "يَخْتَلِفُ", trText: "İhtilafa düşer / Farklılık gösteriyor." } },
        79: { base: { emoji: "❗", arText: "اِخْتَلِفْ", trText: "Ayrılığa düş!" } },

        80: { base: { emoji: "↔️", arText: "اِخْتِلَافُ الرَّأْيِ لَا يُفْسِدُ لِلْوُدِّ قَضِيَّةً", trText: "Görüş ayrılığı (ihtilaf), dostluğu bozmaz. (Arap Atasözü)" } }, 
        81: { base: { emoji: "🌈", arText: "مُخْتَلِف", trText: "Farklı / Muhtelif." } } 
    },

    // ==================================================================
    // 24. Kh-R-J (خ ر ج) KÖKÜ - Çıkmak / Çıkarmak
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve İf'âl Babı
    // ==================================================================
    "خرج": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { base: { emoji: "🚶", arText: "خَرَجَ", trText: "Çıktı." } },
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { base: { emoji: "🚪", arText: "يَخْرُجُ", trText: "Çıkar / Çıkıyor." } },
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { base: { emoji: "🏃", arText: "اُخْرُجْ", trText: "Çık!" } },

        22: { base: { emoji: "💰", arText: "خَرَاج", trText: "Vergi / Haraç." } }, 
        33: { base: { emoji: "🏞️", arText: "خَارِج", trText: "Dış / Hariç." } }, 
        38: { base: { emoji: "🚪", arText: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", trText: "Kim Allah'a karşı gelmekten sakınırsa, Allah ona bir çıkış yolu (mahreç) açar. (Talak Suresi)" } }, 
        
        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı) ---
        52: { base: { emoji: "📤", arText: "أَخْرَجَ", trText: "Çıkardı." } },
        53: { base: { emoji: "📦", arText: "يُخْرِجُ", trText: "Çıkarır / Çıkarıyor." } },
        54: { base: { emoji: "❗", arText: "أَخْرِجْ", trText: "Çıkar!" } },

        55: { base: { emoji: "📤", arText: "إِخْرَاجُ الزَّكَاةِ", trText: "Zekatın çıkarılması (verilmesi)." }, suggestsPlus: true, "ات": { emoji: "🚢", arText: "زَادَتْ إِخْرَاجَاتُ الدَّوْلَةِ", trText: "Devletin ihracatı (dışa satımı) arttı." } } 
    },

    // ==================================================================
    // 25. '-M-L (ع م ل) KÖKÜ - Çalışmak / Yapmak / İşlem
    // 4. Bab (فَعِلَ - يَفْعَلُ)
    // ==================================================================
    "عمل": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / 4. Bab) ---
        8: { base: { emoji: "🛠️", arText: "عَمِلَ", trText: "Çalıştı / Yaptı." } },
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { base: { emoji: "⚙️", arText: "يَعْمَلُ", trText: "Çalışır / Yapıyor." } },
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { base: { emoji: "💪", arText: "اِعْمَلْ", trText: "Çalış / Yap!" } },

        17: { base: { emoji: "💼", arText: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", trText: "Ameller (işler) niyetlere göredir. (Hadis-i Şerif)" }, suggestsPlus: true, "يَّات": { emoji: "🏥", arText: "غُرْفَةُ الْعَمَلِيَّاتِ فِي الْمُسْتَشْفَى", trText: "Hastanede ameliyathane (operasyon odası)." } }, 
        36: { base: { emoji: "📦", arText: "مَعْمُول", trText: "Yapılmış / Mamul." } }, 
        47: { base: { emoji: "👷", arText: "عَمَلَة", trText: "İşçiler (Cemi Teksir)." } }, 
        55: { base: { emoji: "🏭", arText: "إِعْمَال", trText: "İşletme." } }, 
        67: { base: { emoji: "🤝", arText: "الدِّينُ الْمُعَامَلَةُ", trText: "Din, güzel muameledir (insan ilişkileridir). (Hadis-i Şerif)" }, suggestsPlus: true, "ات": { emoji: "🗂️", arText: "مُعَامَلَات", trText: "İşlemler / Muameleler." } }, 
        103: { base: { emoji: "🔄", arText: "دَلِيلُ الِاسْتِعْمَالِ", trText: "Kullanım kılavuzu (İstimal rehberi)." } } 
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

        19: { base: { emoji: "📓", arText: "دَرْس", trText: "Ders." } }, 
        23: { suggestsPlus: true, "ة": { emoji: "📚", arText: "دِرَاسَة", trText: "Öğrenim." } }, 
        38: { suggestsPlus: true, "ة": { emoji: "🏫", arText: "الْمَدْرَسَةُ بَيْتُنَا الثَّانِي", trText: "Okul bizim (öğrencilerin) ikinci evidir." } }, 

        // --- 58, 59, 60 Numaralı Kalıplar (Tef'îl Babı) ---
        58: { base: { emoji: "👨‍🏫", arText: "دَرَّسَ", trText: "Ders verdi / Öğretti." } },
        59: { base: { emoji: "🗣️", arText: "يُدَرِّسُ", trText: "Ders verir / Öğretiyor." } },
        60: { base: { emoji: "❗", arText: "دَرِّسْ", trText: "Ders ver / Öğret!" } },

        61: { base: { emoji: "✍️", arText: "تَدْرِيس", trText: "Öğretmek / Tedrisat." } }, 
        62: { base: { emoji: "👨‍🏫", arText: "مَنْ عَلَّمَنِي حَرْفاً صِرْتُ لَهُ عَبْداً", trText: "Bana bir harf öğretenin kölesi olurum. (Hz. Ali)" } } 
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

        20: { base: { emoji: "💾", arText: "حِفْظ", trText: "Koruma / Hıfz." } }, 
        33: { base: { emoji: "📖", arText: "فَاللهُ خَيْرٌ حَافِظًا", trText: "Allah en hayırlı koruyucudur. (Yusuf Suresi)" }, suggestsPlus: true, "ة": { emoji: "🧠", arText: "حَافِظَةٌ قَوِيَّةٌ", trText: "Güçlü bir hafıza." } }, 
        36: { base: { emoji: "🛡️", arText: "فِي لَوْحٍ مَحْفُوظٍ", trText: "Korunmuş bir levhadadır (Levh-i Mahfuz). (Büruc Suresi)" } }, 

        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı) ---
        64: { base: { emoji: "🏰", arText: "حَافَظَ", trText: "Özen gösterdi / Muhafaza etti." } },
        65: { base: { emoji: "🤲", arText: "يُحَافِظُ", trText: "Özen gösterir / Muhafaza ediyor." } },
        66: { base: { emoji: "❗", arText: "حَافِظْ", trText: "Özen göster / Muhafaza et!" } },

        67: { base: { emoji: "🏰", arText: "حَافِظُوا عَلَى الصَّلَوَاتِ", trText: "Namazları koruyun (özen gösterin). (Bakara Suresi)" } }, 
        69: { base: { emoji: "👔", arText: "مُحَافِظ", trText: "Koruyan / Vali (Muhafız)." } } 
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

        17: { base: { emoji: "👁️", arText: "الْعَيْنُ حَقٌّ", trText: "Nazar (göz değmesi) haktır (gerçektir). (Hadis-i Şerif)" } }, 
        33: { base: { emoji: "👀", arText: "نَاظِر", trText: "Bakan / Nazır." } }, 
        38: { suggestsPlus: true, "ة": { emoji: "🌄", arText: "يَا لَهُ مِنْ مَنْظَرٍ جَمِيلٍ!", trText: "Ne kadar güzel bir manzara!" } }, 
        67: { base: { emoji: "🗣️", arText: "مُنَاظَرَة", trText: "Münazara (Karşılıklı bakışma/tartışma)." } }, 

        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı) ---
        77: { base: { emoji: "⏳", arText: "اِنْتَظَرَ", trText: "Bekledi (İntizar etti)." } },
        78: { base: { emoji: "⌚", arText: "يَنْتَظِرُ", trText: "Bekler / Bekliyor." } },
        79: { base: { emoji: "✋", arText: "اِنْتَظِرْ", trText: "Bekle!" } },

        80: { base: { emoji: "⏳", arText: "اِنْتِظَارُ الْفَرَجِ عِبَادَةٌ", trText: "Sıkıntıdan kurtulmayı beklemek (intizar) ibadettir. (Hadis-i Şerif)" } } 
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

        22: { base: { emoji: "📍", arText: "شَرَفُ الْمَكَانِ بِالْمَكِينِ", trText: "Bir mekânın şerefi (değeri), orada bulunanlardan gelir. (Atasözü)" } }, 
        55: { base: { emoji: "✨", arText: "فِي حُدُودِ الْإِمْكَانِ", trText: "İmkânlar dâhilinde." } }, 
        56: { base: { emoji: "✔️", arText: "كُلُّ شَيْءٍ مُمْكِنٌ بِإِذْنِ اللهِ", trText: "Allah'ın izniyle her şey mümkündür." } }, 

        // --- 58, 59, 60 Numaralı Kalıplar (Tef'îl Babı) ---
        58: { base: { emoji: "🏗️", arText: "مَكَّنَ", trText: "Güçlendirdi / İmkan verdi." } },
        59: { base: { emoji: "⚙️", arText: "يُمَكِّنُ", trText: "Güçlendirir / İmkan verir." } },
        60: { base: { emoji: "✅", arText: "مَكِّنْ", trText: "Güçlendir / İmkan ver!" } },

        61: { base: { emoji: "💪", arText: "تَمْكِين", trText: "Güçlendirmek." } } 
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

        17: { base: { emoji: "🌸", arText: "الْحَسَنُ وَالْحُسَيْنُ سَيِّدَا شَبَابِ أَهْلِ الْجَنَّةِ", trText: "Hasan ve Hüseyin, cennet gençlerinin efendileridir. (Hadis-i Şerif)" } }, 
        49: { base: { emoji: "🌷", arText: "حُسَيْن", trText: "Hüseyin (Küçük güzellik)." } }, 
        50: { base: { emoji: "🥇", arText: "لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ", trText: "Biz insanı en güzel biçimde (ahsen-i takvim) yarattık. (Tîn Suresi)" } }, 
        51: { base: { emoji: "💎", arText: "وَلِلهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا", trText: "En güzel isimler (Esma-ül Hüsna) Allah'ındır, O'na onlarla dua edin. (A'râf Suresi)" } }, 

        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı) ---
        52: { base: { emoji: "🎁", arText: "أَحْسَنَ", trText: "İyilik yaptı (İhsan etti)." } },
        53: { base: { emoji: "🤝", arText: "يُحْسِنُ", trText: "İyilik yapar / İhsan ediyor." } },
        54: { base: { emoji: "❤️", arText: "أَحْسِنْ", trText: "İyilik yap / İhsan et!" } },

        55: { base: { emoji: "💖", arText: "هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ", trText: "İyiliğin (ihsanın) karşılığı, iyilikten başka bir şey midir? (Rahmân Suresi)" } }, 
        56: { base: { emoji: "😇", arText: "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", trText: "Şüphesiz Allah, iyilik edenleri (muhsinleri) sever. (Bakara Suresi)" } }, 
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

        // --- 22, 24, 35, 36 Numaralı İsim ve Sıfat Kalıpları ---
        22: { 
            suggestsPlus: true, 
            "ة": { emoji: "✨", arText: "السَّعَادَةُ فِي الْقَنَاعَةِ", trText: "Mutluluk (saadet) kanaattedir. (Atasözü)" } 
        }, 
        24: { 
            base: { emoji: "🌸", arText: "سُعَاد", trText: "Suad (Mutluluk)." } 
        }, 
        35: { 
            base: { emoji: "😊", arText: "فَمِنْهُمْ شَقِيٌّ وَسَعِيدٌ", trText: "Onlardan kimi bedbaht (mutsuz), kimi de bahtiyar (mutlu - said)dır. (Hûd Suresi)" }, 
            suggestsPlus: true, 
            "ة": { emoji: "🥰", arText: "سَعِيدَة", trText: "Mutlu (Kadın)." } 
        }, 
        36: { 
            base: { emoji: "🍀", arText: "أَيَّامٌ مَسْعُودَةٌ", trText: "Mutlu (Mesut) ve uğurlu günler." }, 
            suggestsPlus: true, 
            "ة": { emoji: "🌻", arText: "مَسْعُودَة", trText: "Mesude." } 
        },
  
         
       // --- 65 Numaralı Kalıp (فَاعَلَ - Mazi / Mufâ'ale Babı) ---
        64: { 
            base: { emoji: "🤝", arText: "سَاعَدَ", trText: "Yardım etti / Destek oldu." } 
        },


        // --- 65 Numaralı Kalıp (فَاعَلَ - Mazi / Mufâ'ale Babı) ---
        65: { 
            base: { emoji: "🤝", arText: "يُسَاعِدُ", trText: "Yardım eder / Yardım ediyor." } 
        },
        
        // --- 66 Numaralı Kalıp (يُفَاعِلُ - Muzari / Mufâ'ale Babı) ---
        66: { 
            base: { emoji: "🔄", arText: "سَاعِدْ", trText: "Yardım et / Destek ol!" } 
        },
        
        // --- 67 Numaralı Kalıp (فَاعِلْ - Emir / Mufâ'ale Babı) ---
        67: { 
            base: { emoji: "❗", arText: "مُسَاعَدَة", trText: "Yardım / Müsaade (Türkçede: İzin, kolaylık sağlama)." } 
        },
       
        
        // --- 69 Numaralı Kalıp (مُفَاعِل - Mufâ'ale Babı İsm-i Faili) ---
        69: { 
            base: { emoji: "👍", arText: "مُسَاعِد", trText: "Yardımcı / Müsait (Türkçede: Elverişli, durumu uygun kişi/şey)." } 
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

        33: { base: { emoji: "🙈", arText: "النَّاسُ أَعْدَاءُ مَا جَهِلُوا", trText: "İnsanlar bilmedikleri şeyin düşmanıdır. (Hz. Ali)" }, suggestsPlus: true, "يَّة": { emoji: "🌑", arText: "جَاهِلِيَّة", trText: "Cahiliye dönemi." } }, 
        36: { base: { emoji: "❓", arText: "فَاعِلٌ مَجْهُولٌ", trText: "Faili meçhul (yapanı bilinmeyen)." } }, 
        46: { base: { emoji: "🙉", arText: "وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا", trText: "Cahiller onlara laf attığında 'Selam' der (geçerler). (Furkan Suresi)" } } 
    },

    // ==================================================================
    // 33. W-J-D (و ج د) KÖKÜ - Bulmak / Var Olmak
    // 2. Bab (وَجَدَ - يَجِدُ) Misal Fiil
    // ==================================================================
    "وجد": {
        // --- 1, 4, 5 Numaralı Kalıplar (2. Bab - Misal fiil olduğu için muzaride vav düşer) ---
        1: { base: { emoji: "🔍", arText: "وَجَدَ", trText: "Buldu." } },
        4: { base: { emoji: "🔎", arText: "يَجِدُ", trText: "Bulur / Buluyor." } },
        5: { base: { emoji: "❗", arText: "جِدْ", trText: "Bul!" } },

        25: { base: { emoji: "🌌", arText: "وُجُود", trText: "Varlık / Vücud." } }, 
        29: { base: { emoji: "❤️", arText: "صَوْتُ الْوِجْدَانِ", trText: "Vicdanın sesi." } }, 
        36: { base: { emoji: "✅", arText: "الْبَضَاعَةُ مَوْجُودَةٌ فِي الْمَخْزَنِ", trText: "Mal depoda mevcut (bulunmaktadır)." } }, 
        
        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı - أَوَجَدَ -> أَوْجَدَ) ---
        52: { base: { emoji: "✨", arText: "أَوْجَدَ", trText: "Var etti / İcat etti." } },
        53: { base: { emoji: "💡", arText: "يُوجِدُ", trText: "Var eder / İcat ediyor." } },
        54: { base: { emoji: "❗", arText: "أَوْجِدْ", trText: "Var et / İcat et!" } },

        55: { base: { emoji: "🔍", arText: "إِيجَادُ حَلٍّ لِلْمُشْكِلَةِ", trText: "Probleme bir çözüm bulmak (icad etmek)." } }, 
        56: { base: { emoji: "💡", arText: "مُوجِد", trText: "İcat eden / Mucit." } } 
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

        33: { base: { emoji: "😌", arText: "سَاكِن", trText: "Sakin / Oturan." } }, 
        35: { suggestsPlus: true, "ة": { emoji: "✨", arText: "فَأَنْزَلَ اللهُ سَكِينَتَهُ عَلَيْهِ", trText: "Allah onun üzerine sekinetini (huzur ve güvenini) indirdi. (Tevbe Suresi)" } }, 
        36: { base: { emoji: "🏘️", arText: "مِنْطَقَةٌ مَسْكُونَةٌ", trText: "Meskun mahal (yerleşim yeri)." } }, 
        38: { base: { emoji: "🏡", arText: "وَالله جَعَلَ لَكُمْ مِنْ بُيُوتِكُمْ سَكَنًا", trText: "Allah, evlerinizi sizin için bir huzur ve dinlenme yeri (mesken) kıldı. (Nahl Suresi)" } }, 
        55: { base: { emoji: "🏢", arText: "إِسْكَان", trText: "İskan." } }, 
        61: { base: { emoji: "🕊️", arText: "تَسْكِينُ الْأَلَمِ", trText: "Ağrıyı dindirmek (Teskin etmek)." } } 
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

        23: { base: { emoji: "🛡️", arText: "وَجَاهِدُوا فِي اللهِ حَقَّ جِهَادِهِ", trText: "Allah uğrunda hakkıyla cihad edin (gayret gösterin). (Hac Suresi)" } }, 
        33: { base: { emoji: "💪", arText: "جَاهِد", trText: "Çaba gösteren." } }, 
        69: { base: { emoji: "🏇", arText: "مُجَاهِد", trText: "Mücahit." }, suggestsPlus: true, "ة": { emoji: "🧕", arText: "مُجَاهِدَة", trText: "Kadın mücahit." } }, 

        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı) ---
        77: { base: { emoji: "📚", arText: "اِجْتَهَدَ", trText: "Çabaladı / İçtihat etti." } },
        78: { base: { emoji: "✍️", arText: "يَجْتَهِدُ", trText: "Çabalar / İçtihat ediyor." } },
        79: { base: { emoji: "❗", arText: "اِجْتَهِدْ", trText: "Çabala / İçtihat et!" } },

        80: { base: { emoji: "📚", arText: "الِاجْتِهَادُ مِفْتَاحُ النَّجَاحِ", trText: "Çalışmak (içtihat/gayret), başarının anahtarıdır." } }, 
        81: { base: { emoji: "🤓", arText: "لِكُلِّ مُجْتَهِدٍ نَصِيبٌ", trText: "Her çalışanın (gayret edenin) bir nasibi (payı) vardır. (Atasözü)" } } 
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

        22: { base: { emoji: "🕊️", arText: "أَفْشُوا السَّلَامَ بَيْنَكُمْ", trText: "Aranızda selamı yayınız. (Hadis-i Şerif)" }, suggestsPlus: true, "ة": { emoji: "🛡️", arText: "فِي التَّأَنِّي السَّلَامَةُ", trText: "Acele etmemekte (teennide) selamet vardır. (Atasözü)" } }, 
        33: { base: { emoji: "😌", arText: "سَالِم", trText: "Sağ salim / Güvende." } }, 
        35: { base: { emoji: "🫀", arText: "إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ", trText: "Ancak Allah'a temiz (selim) bir kalple gelenler müstesna. (Şuarâ Suresi)" } }, 

        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı) ---
        52: { base: { emoji: "🤲", arText: "أَسْلَمَ", trText: "Teslim oldu / Müslüman oldu." } },
        53: { base: { emoji: "☪️", arText: "يُسْلِمُ", trText: "Teslim olur / Müslüman oluyor." } },
        54: { base: { emoji: "❗", arText: "أَسْلِمْ", trText: "Teslim ol / Müslüman ol!" } },

        55: { base: { emoji: "🌙", arText: "إِنَّ الدِّينَ عِنْدَ اللهِ الْإِسْلَامُ", trText: "Şüphesiz Allah katında din İslam'dır. (Âl-i İmrân Suresi)" } }, 
        56: { base: { emoji: "🤲", arText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِن لِّسَانِهِ وَيَدِهِ", trText: "Müslüman, diğer Müslümanların onun dilinden ve elinden güvende (salim) olduğu kimsedir. (Hadis-i Şerif)" } }, 
        61: { base: { emoji: "📦", arText: "تَسْلِيم", trText: "Teslim." } } 
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

        37: { base: { emoji: "📚", arText: "إِلَى اللهِ مَرْجِعُكُمْ جَمِيعًا", trText: "Hepinizin dönüşü (mercii/kaynağı) Allah'adır. (Mâide Suresi)" } }, 

        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı) ---
        64: { base: { emoji: "📝", arText: "رَاجَعَ", trText: "Gözden geçirdi / Müracaat etti." } },
        65: { base: { emoji: "📖", arText: "يُرَاجِعُ", trText: "Gözden geçirir / Müracaat ediyor." } },
        66: { base: { emoji: "❗", arText: "رَاجِعْ", trText: "Gözden geçir / Müracaat et!" } },

        67: { base: { emoji: "📝", arText: "مُرَاجَعَةُ الدُّرُوسِ قَبْلَ الِامْتِحَانِ مُفِيدَةٌ", trText: "Sınavdan önce derslerin tekrar edilmesi (gözden geçirilmesi) faydalıdır." } }, 
        
        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı) ---
        77: { base: { emoji: "🔄", arText: "اِرْتَجَعَ", trText: "Geri döndü / İade etti." } },
        78: { base: { emoji: "🔁", arText: "يَرْتَجِعُ", trText: "Geri döner / İade ediyor." } },
        79: { base: { emoji: "❗", arText: "اِرْتَجِعْ", trText: "Geri dön / İade et!" } },

        80: { base: { emoji: "↩️", arText: "اِرْتِجَاعُ الْبَضَاعَةِ حَقٌّ لِلْمُشْتَرِي", trText: "Malın iadesi (geri verilmesi/artırım) alıcının hakkıdır." } } 
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

        19: { base: { emoji: "📐", arText: "شَكْل", trText: "Şekil / Biçim." } }, 
        41: { base: { emoji: "🎨", arText: "أَشْكَال", trText: "Şekiller." } }, 
        56: { base: { emoji: "⚠️", arText: "لِكُلِّ مُشْكِلٍ حَلٌّ فِي النِّهَايَةِ", trText: "Her müşkülün (sorunun) sonunda bir çözümü vardır." } }, 
        
        // --- 58, 59, 60 Numaralı Kalıplar (Tef'îl Babı) ---
        58: { base: { emoji: "🏺", arText: "شَكَّلَ", trText: "Oluşturdu / Teşkil etti." } },
        59: { base: { emoji: "🛠️", arText: "يُشَكِّلُ", trText: "Oluşturur / Teşkil ediyor." } },
        60: { base: { emoji: "❗", arText: "شَكِّلْ", trText: "Oluştur / Teşkil et!" } },

        61: { base: { emoji: "🔠", arText: "تَشْكِيل", trText: "Şekillendirme." }, suggestsPlus: true, "ات": { emoji: "🏢", arText: "تَشْكِيلَاتُ الدَّوْلَةِ التَّنْظِيمِيَّةِ", trText: "Devletin kurumsal teşkilatları (yapılanmaları)." } } 
    },

    // ==================================================================
    // 39. N-S-B (ن س ب) KÖKÜ - İlişki / Soy / Oran / Uygunluk
    // 2. Bab (فَعَلَ - يَفْعِلُ)
    // ==================================================================
    "نسب": {
        // --- 1, 4, 5 Numaralı Kalıplar (2. Bab) ---
        

        17: { base: { emoji: "🌳", arText: "الْمَرْءُ بِأَدَبِهِ لَا بِأَصْلِهِ وَنَسَبِهِ", trText: "Kişinin değeri aslı ve nesebiyle (soyuyla) değil, edebiyle ölçülür. (Atasözü)" } }, 
        20: { suggestsPlus: true, "ة": { emoji: "📊", arText: "نِسْبَةُ النَّجَاحِ عَالِيَةٌ فِي الِامْتِحَانِ", trText: "Sınavdaki başarı nispeti (oranı) oldukça yüksektir." } }, 
        36: { base: { emoji: "👤", arText: "مَنْسُوب", trText: "Mensup / İlişkili." } }, 
        
        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı) ---
        64: { base: { emoji: "🧩", arText: "نَاسَبَ", trText: "Uygun oldu." } },
        65: { base: { emoji: "✅", arText: "يُنَاسِبُ", trText: "Uygun olur / Yakışıyor." } },
        66: { base: { emoji: "❗", arText: "نَاسِبْ", trText: "Uygun ol!" } },

        67: { base: { emoji: "🎉", arText: "نَحْتَفِلُ بِهَذِهِ الْمُنَاسَبَة السَّعِيدَةِ", trText: "Bu mutlu münasebet (vesile/özel gün) sebebiyle kutlama yapıyoruz." } }, 
        69: { base: { emoji: "👍🏼", arText: "مُنَاسِب", trText: "Uygun!" } },
        
        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı) ---
        77: { base: { emoji: "📝", arText: "اِنْتَسَبَ", trText: "Kayıt oldu / İntisap etti." } },
        78: { base: { emoji: "✍️", arText: "يَنْتَسِبُ", trText: "Kayıt olur / İntisap ediyor." } },
        79: { base: { emoji: "❗", arText: "اِنْتَسِبْ", trText: "Kayıt ol / İntisap et!" } },

        80: { base: { emoji: "📝", arText: "اِنْتِسَاب", trText: "Kayıt olma / İntisap." } } 
    },
   // ==================================================================
    // 40. H-S-L (ح ص ل) KÖKÜ - Elde Etmek / Ürün / Sonuç
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve Tef'îl Babı
    // ==================================================================
    "حصل": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { 
            base: { emoji: "🎯", arText: "حَصَلَ", trText: "Meydana geldi / Elde etti." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { 
            base: { emoji: "🔄", arText: "يَحْصُلُ", trText: "Meydana gelir / Elde ediyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { 
            base: { emoji: "❗", arText: "اُحْصُلْ", trText: "Elde et!" } 
        },

        // --- 25 Numaralı Kalıp (فُعُول - Masdar) ---
        25: { 
            base: { emoji: "✨", arText: "حُصُول", trText: "Meydana gelme / Elde etme." }, 
           
            "ا": { emoji: "🤲", arText: "حُصُولًا عَلَى رِضَا اللهِ", trText: "Allah'ın rızasını elde etmek için." } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🎯", arText: "وَالْحَاصِلُ أَنَّ الصِّحَّةَ تَاجٌ", trText: "Velhasıl (sözün özü/kısacası), sağlık bir taçtır." }, 
            suggestsPlus: true, 
            "ات": { emoji: "📈", arText: "زَادَتْ حَاصِلَاتُ الشَّرِكَةِ هَذَا الْعَامِ", trText: "Şirketin hasılatı (gelirleri) bu yıl arttı." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "🌾", arText: "مَحْصُولُ هَذَا الْعَامِ وَفِيرٌ", trText: "Bu yılın mahsulü (ürünü) bereketlidir." } 
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { 
            base: { emoji: "💰", arText: "حَصَّلَ", trText: "Tahsil etti / Topladı / Kazandı." } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { 
            base: { emoji: "🧾", arText: "يُحَصِّلُ", trText: "Tahsil eder / Topluyor." } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { 
            base: { emoji: "❗", arText: "حَصِّلْ", trText: "Tahsil et / Topla!" } 
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Masdar / Tef'îl Babı) ---
        61: { 
            base: { emoji: "🎓", arText: "تَحْصِيلُ الْعِلْمِ نُورٌ لِلْعَقْلِ", trText: "İlim tahsil etmek (eğitim görmek/elde etmek) akıl için nurdur." }, 
            suggestsPlus: true, 
            "ات": { emoji: "🧾", arText: "قِسْمُ التَّحْصِيلَاتِ فِي الْبَنْكِ", trText: "Bankadaki tahsilat (alacakların toplanması) bölümü." } 
        }
    },

    // 41. B-R-K (ب ر ك) KÖKÜ - Bereket / Kutlamak / Çoğalmak
    "برك": {
        17: { suggestsPlus: true, "ة": { emoji: "🌾", arText: "الْبَرَكَةُ فِي الْبُكُورِ", trText: "Bereket, sabahın erken vakitlerindedir. (Hadis-i Şerif)" } }, // بَرَك + ة = بَرَكَة
        61: { base: { emoji: "🥳", arText: "تَبْرِيكَاتِي الْحَارَّةُ بِمُنَاسَبَةِ النَّجَاحِ", trText: "Başarı vesilesiyle en samimi tebriklerim." } }, // تَبْرِيك
        70: { base: { emoji: "🌙", arText: "شَهْرٌ مُبَارَكٌ وَعِيدٌ سَعِيدٌ", trText: "Mübarek bir ay ve mutlu bir bayram." } }, // مُبَارَك
        91: { base: { emoji: "🤲", arText: "التَّبَرُّكُ بِدُعَاءِ الْوَالِدَيْنِ", trText: "Anne babanın duasıyla bereketlenmek (teberrük etmek)." } } // تَبَرُّك
    },

    // ==================================================================
    // 42. Q-D-R (ق د ر) KÖKÜ - Ölçmek / Güç Yetirmek / Değer / Kader
    // 2. Bab (فَعَلَ - يَفْعِلُ), Tef'îl ve İfti'âl Babları
    // ==================================================================
    "قدر": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 2. Bab) ---
        1: { 
            base: { emoji: "📏", arText: "قَدَرَ", trText: "Ölçtü / Güç yetirdi." } 
        },
        
        // --- 4 Numaralı Kalıp (يَفْعِلُ - Muzari / 2. Bab) ---
        4: { 
            base: { emoji: "💪", arText: "يَقْدِرُ", trText: "Güç yetirir / Ölçüyor." } 
        },
        
        // --- 5 Numaralı Kalıp (اِفْعِلْ - Emir / 2. Bab) ---
        5: { 
            base: { emoji: "❗", arText: "اِقْدِرْ", trText: "Güç yetir!" } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { emoji: "✨", arText: "إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ", trText: "Şüphesiz biz her şeyi bir ölçüye göre (kaderle) yarattık. (Kamer Suresi)" } 
        },
        
        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            suggestsPlus: true, 
            "ة": { emoji: "💪", arText: "قُدْرَةُ اللهِ لَا حُدُودَ لَهَا", trText: "Allah'ın kudretinin (gücünün) sınırı yoktur." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🌟", arText: "هُوَ قَادِرٌ عَلَى كُلِّ شَيْءٍ", trText: "O, her şeye kadirdir (güç yetirendir)." } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "💎", arText: "إِنَّ اللهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", trText: "Şüphesiz Allah her şeye kadirdir (sonsuz güç sahibidir). (Bakara Suresi)" } 
        },
        
        // --- 40 Numaralı Kalıp (مِفْعَال) ---
        40: { 
            base: { emoji: "📊", arText: "بِمِقْدَارٍ مُعَيَّنٍ", trText: "Belirli bir miktarda." } 
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { 
            base: { emoji: "👏", arText: "قَدَّرَ", trText: "Takdir etti / Değer biçti / Kaderini belirledi." } 
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
            base: { emoji: "👏", arText: "شَهَادَةُ تَقْدِيرٍ", trText: "Takdir (teşekkür) belgesi." } 
        },
        
        // --- 63 Numaralı Kalıp (مُفَعَّل - Tef'îl Babı İsm-i Mef'ulü) ---
        63: { 
            suggestsPlus: true, 
            "ات": { emoji: "🔮", arText: "مُقَدَّرَاتُ الْإِنْسَانِ مَكْتُوبَةٌ", trText: "İnsanın mukadderatı (alın yazısı) yazılmıştır." } 
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
            base: { emoji: "👑", arText: "حِزْبُ الِاقْتِدَارِ", trText: "İktidar partisi (yönetme gücü)." } 
        },
        
        // --- 81 Numaralı Kalıp (مُفْتَعِل - İfti'âl Babı İsm-i Faili) ---
        81: { 
            base: { emoji: "🦁", arText: "فِي مَقْعَدِ صِدْقٍ عِنْدَ مَلِكٍ مُّقْتَدِرٍ", trText: "Güçlü bir padişahın (Muktedir olan Allah'ın) katında, doğruluk koltuğundadırlar. (Kamer Suresi)" } 
        }
    },

    // 43. M-L-K (م ل ك) KÖKÜ - Sahip Olmak / Yönetmek / Melek
    "ملك": {
        17: { base: { emoji: "👼", arText: "الْمَلَائِكَةُ عِبَادٌ مُكْرَمُونَ", trText: "Melekler (Allah'ın) ikram olunmuş kullarıdır." } }, // مَلَك
        21: { base: { emoji: "👑", arText: "لِلهِ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ", trText: "Göklerin ve yerin mülkü (hükümranlığı) Allah'ındır. (Şûrâ Suresi)" } }, // مُلْك
        33: { base: { emoji: "🔑", arText: "مَالِكِ يَوْمِ الدِّينِ", trText: "Din gününün maliki (sahibi)dir. (Fâtiha Suresi)" } }, // مَالِك
        35: { base: { emoji: "🤴", arText: "فِي مَقْعَدِ صِدْقٍ عِنْدَ مَلِيكٍ مُّقْتَدِرٍ", trText: "Güçlü bir padişahın (Melik'in) katında, doğruluk koltuğundadırlar. (Kamer Suresi)" }, suggestsPlus: true, "ة": { emoji: "👸", arText: "مَلِيكَة", trText: "Kraliçe." } }, // مَلِيك + ة = مَلِيكَة
        36: { base: { emoji: "🛡️", arText: "الدَّوْلَةُ الْمَمْلُوكِيَّةُ فِي التَّارِيخِ", trText: "Tarihteki Memlük (köleleştirilmiş asker/hükümdar) Devleti." } }, // مَمْلُوك
        38: { suggestsPlus: true, "ة": { emoji: "🏰", arText: "الْمَمْلَكَةُ الْعَرَبِيَّةُ السُّعُودِيَّةُ", trText: "Suudi Arabistan Krallığı (Arapçada krallık, Türkçede yurt/memleket)." } }, // مَمْلَك + ة = مَمْلَكَة
        41: { base: { emoji: "🏢", arText: "مَكْتَبُ الْأَمْلَاكِ وَالْعَقَارَاتِ", trText: "Emlak (mülkler) ve gayrimenkul ofisi." } } // أَمْلَاك
    },

    // ==================================================================
    // 44. R-S-L (ر س ل) KÖKÜ - Göndermek / Elçi / Mesaj
    // İf'âl Babı (أَفْعَلَ - يُفْعِلُ)
    // ==================================================================
    "رسل": {
        // --- 23 Numaralı Kalıp (فِعَال) ---
        23: { 
            suggestsPlus: true, 
            "ة": { emoji: "✉️", arText: "أَرْسَلْتُ رِسَالَةً نَصِّيَّةً", trText: "Bir kısa mesaj (risale/mektup) gönderdim." } 
        },
        
        // --- 26 Numaralı Kalıp (فَعُول) ---
        26: { 
            base: { emoji: "🌙", arText: "مُحَمَّدٌ رَسُولُ اللهِ", trText: "Muhammed Allah'ın resulüdür (elçisidir). (Fetih Suresi)" } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - Mazi / İf'âl Babı) ---
        52: { 
            base: { emoji: "📤", arText: "أَرْسَلَ", trText: "Gönderdi." } 
        },
        
        // --- 53 Numaralı Kalıp (يُفْعِلُ - Muzari / İf'âl Babı) ---
        53: { 
            base: { emoji: "📡", arText: "يُرْسِلُ", trText: "Gönderir / Gönderiyor." } 
        },
        
        // --- 54 Numaralı Kalıp (أَفْعِلْ - Emir / İf'âl Babı) ---
        54: { 
            base: { emoji: "❗", arText: "أَرْسِلْ", trText: "Gönder!" } 
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { emoji: "📦", arText: "إِرْسَال", trText: "Gönderme / İrsal." },
            suggestsPlus: true, 
            "يَّة": { emoji: "🧾", arText: "إِرْسَالِيَّةُ الْبَضَائِعِ جَاهِزَةٌ", trText: "Malların sevk irsaliyesi (teslimat belgesi) hazırdır." } 
        },

        // --- 56 Numaralı Kalıp (مُفْعِل - İf'âl Babı İsm-i Faili) ---
        56: { 
            base: { emoji: "📨", arText: "مُرْسِل", trText: "Gönderen (Mürsil)." } 
        },

        // --- 57 Numaralı Kalıp (مُفْعَل - İf'âl Babı İsm-i Mef'ulü) ---
        57: { 
            base: { emoji: "👤", arText: "مُرْسَل", trText: "Gönderilen (Mürsel)." },
            suggestsPlus: true,
            "ينَ": { emoji: "🕊️", arText: "وَسَلَامٌ عَلَى الْمُرْسَلِينَ", trText: "Gönderilen elçilere (peygamberlere) selam olsun. (Sâffât Suresi)" }
        }
    },

    // 45. N-S-R (ن ص ر) KÖKÜ - Yardım Etmek / Zafer
    "نصر": {
        19: { base: { emoji: "✌️", arText: "إِذَا جَاءَ نَصْرُ اللهِ وَالْفَتْحُ", trText: "Allah'ın yardımı (nasrı) ve fetih geldiğinde. (Nasr Suresi)" } }, // نَصْر
        21: { suggestsPlus: true, "ة": { emoji: "🤝", arText: "نُصْرَةُ الْمَظْلُومِ وَاجِبَةٌ", trText: "Mazluma yardım etmek (nusret/destek) vaciptir." } }, // نُصْر + ة = نُصْرَة
        33: { base: { emoji: "🛡️", arText: "نَاصِر", trText: "Yardım eden / Nasır" } }, // نَاصِر
        36: { base: { emoji: "🏆", arText: "عَادَ الْجَيْشُ مَنْصُورًا", trText: "Ordu muzaffer (mansur/yardım görmüş) olarak döndü." } } // مَنْصُور
    },

    // 46. H-M-L (ح م ل) KÖKÜ - Taşımak / Yüklenmek / Dayanmak
    "حمل": {
        19: { suggestsPlus: true, "ة": { emoji: "📣", arText: "حَمْلَةٌ تَعْلِيمِيَّةٌ جَدِيدَةٌ", trText: "Yeni bir eğitim kampanyası (hamlesi)." } }, // حَمْل + ة = حَمْلَة
        33: { suggestsPlus: true, "ة": { emoji: "🤰", arText: "الْمَرْأَةُ الْحَامِلَةُ", trText: "Hamile (gebe) kadın." } }, // حَامِل + ة = حَامِلَة
        34: { base: { emoji: "📦", arText: "حَمَّالُ الْمَحَطَّةِ يُسَاعِدُ الْمُسَافِرِينَ", trText: "İstasyon hamalı yolculara yardım ediyor." } }, // حَمَّال
        80: { base: { emoji: "🎲", arText: "بِكُلِّ اِحْتَمَالٍ", trText: "Her ihtimale karşı." } }, // اِحْتَمَال
        82: { base: { emoji: "🔮", arText: "أَمْرٌ مُحْتَمَلٌ جِدًّا", trText: "Çok muhtemel (olası) bir durum." } }, // مُحْتَمَل
        91: { base: { emoji: "⏳", arText: "الصَّبْرُ هُوَ تَحَمُّلُ الصِّعَابِ", trText: "Sabır, zorluklara tahammül etmektir (dayanmaktır)." } } // تَحَمُّل
    },

    // ==================================================================
    // 47. H-Q-Q (ح ق ق) KÖKÜ - Hak / Gerçek / Doğruluk
    // Tef'îl Babı (فَعَّلَ - يُفَعِّلُ) ve İlgili Kalıplar
    // ==================================================================
    "حقق": {
        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            base: { emoji: "⚖️", arText: "الْحَقُw يَعْلُو وَلَا يُعْلَى عَلَيْهِ", trText: "Hak yücedir ve ondan üstünü yoktur. (Atasözü)" } 
        }, 
        
        // --- 25 Numaralı Kalıp (فُعُول) ---
        25: { 
            base: { emoji: "📚", arText: "كُلِّيَّةُ الْحُقُوقِ", trText: "Hukuk fakültesi." } 
        }, 
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            suggestsPlus: true, 
            "ة": { emoji: "💎", arText: "هَذِهِ هِيَ الْحَقِيقَةُ", trText: "İşte bu hakikattir (gerçektir)." } 
        }, 

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { 
            base: { emoji: "🎯", arText: "حَقَّقَ أَهْدَافَهُ", trText: "Hedeflerini gerçekleştirdi." } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { 
            base: { emoji: "📈", arText: "يُحَقِّقُ النَّجَاحَ", trText: "Başarıyı gerçekleştiriyor / Elde ediyor." } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { 
            base: { emoji: "🚀", arText: "حَقِّقْ أَحْلَامَكَ", trText: "Hayallerini gerçekleştir!" } 
        },

       // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { emoji: "🔍", arText: "جَارٍ التَّحْقِيقُ فِي الْأَمْرِ", trText: "Olayla ilgili inceleme / soruşturma devam ediyor." }, 
            suggestsPlus: true,
            "ات": { emoji: "📂", arText: "تَحْقِيقَات", trText: "Tahkikat (soruşturmalar / derinlemesine incelemeler)." }
        },
        
        // --- 62 Numaralı Kalıp (مُفَعِّل - Tef'îl Babı İsm-i Faili) ---
        62: { 
            base: { emoji: "🕵️‍♂️", arText: "مُحَقِّق", trText: "Soruşturmacı / Dedektif / Muhakkik." } 
        },
        
        // --- 63 Numaralı Kalıp (مُفَعَّل - Tef'îl Babı İsm-i Mef'ulü) ---
        63: { 
            base: { emoji: "💯", arText: "أَمْرٌ مُحَقَّقٌ بِإِذْنِ اللَّهِ", trText: "Allah'ın izniyle muhakkak (kesinleşmiş/gerçekleşmiş) bir durum." } 
        },
        
        // --- 103 Numaralı Kalıp (اِسْتِفْعَال) ---
        103: { 
            base: { emoji: "🏆", arText: "اِسْتِحْقَاق", trText: "Hak etme." } 
        }, 
        
        // --- 105 Numaralı Kalıp (مُسْتَفْعَل) ---
        105: { 
            base: { emoji: "🎖️", arText: "الْجَائِزَةُ مُسْتَحَقَّةٌ لَهُ", trText: "Ödül ona müstehaktır (hak edilmiştir)." } 
        } 
    },

    // 48. Kh-L-S (خ ل ص) KÖKÜ - Saflık / Samimiyet / İhlas
    "خلص": {
        33: { base: { emoji: "💎", arText: "عَسَلٌ خَالِصٌ وَذَهَبٌ خَالِصٌ", trText: "Halis (saf/katkısız) bal ve halis altın." } }, // خَالِص
        55: { base: { emoji: "❤️", arText: "الْإِخْلَاصُ فِي الْعَمَلِ أَسَاسُ الْقَبُولِ", trText: "İşte ihlas (samimiyet/içtenlik), kabulün temelidir." } }, // إِخْلَاص
        56: { base: { emoji: "😇", arText: "هُوَ صَدِيقٌ مُخْلِصٌ لَا يَتَغَيَّرُ", trText: "O, asla değişmeyen muhlis (samimi/sadık) bir dosttur." } } // مُخْلِص
    },

    // ==================================================================
    // 49. K-M-L (ك م ل) KÖKÜ - Tamamlamak / Olgunluk / Kusursuzluk
    // 1. Bab (فَعَلَ - يَفْعُلُ), İf'âl ve Tef'îl Babları
    // ==================================================================
    "كمل": {
       

        // --- 22 Numaralı Kalıp (فَعَال) ---
        22: { 
            base: { emoji: "🌟", arText: "الْكَمَالُ لِلهِ وَحْدَهُ", trText: "Kemal (kusursuzluk) sadece Allah'a mahsustur." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🌕", arText: "بَدْرٌ كَامِلٌ", trText: "Kamil (tam) dolunay." } 
        },

        // --- 52 Numaralı Kalıp (أَفْعَلَ - Mazi / İf'âl Babı) ---
        52: { 
            base: { emoji: "✅", arText: "أَكْمَلَ", trText: "Tamamladı (İkmal etti)." },
            suggestsPlus: true,
            "تُ": { emoji: "🤲", arText: "الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ", trText: "Bugün sizin için dininizi kemale erdirdim (tamamladım). (Mâide Suresi)" }
        },
        
        // --- 53 Numaralı Kalıp (يُفْعِلُ - Muzari / İf'âl Babı) ---
        53: { 
            base: { emoji: "⏳", arText: "يُكْمِلُ", trText: "Tamamlar / Tamamlıyor." } 
        },
        
        // --- 54 Numaralı Kalıp (أَفْعِلْ - Emir / İf'âl Babı) ---
        54: { 
            base: { emoji: "❗", arText: "أَكْمِلْ", trText: "Tamamla!" } 
        },

        // --- 55 Numaralı Kalıp (إِفْعَال - İf'âl Babı Masdarı) ---
        55: { 
            base: { emoji: "🧩", arText: "إِكْمَالُ النَّقْصِ", trText: "Eksiği tamamlama (ikmal)." } 
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { 
            base: { emoji: "🎨", arText: "كَمَّلَ", trText: "Eksiksiz yaptı / Mükemmelleştirdi." } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { 
            base: { emoji: "🖌️", arText: "يُكَمِّلُ", trText: "Eksiksiz yapar / Mükemmelleştiriyor." } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { 
            base: { emoji: "💯", arText: "كَمِّلْ", trText: "Eksiksiz yap!" } 
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { emoji: "✅", arText: "تَكْمِيل", trText: "Tamamlama." } 
        },
        
        // --- 63 Numaralı Kalıp (مُفَعَّل - Tef'îl Babı İsm-i Mef'ulü) ---
        63: { 
            base: { emoji: "💯", arText: "عَمَلٌ مُكَمَّلٌ وَرَائِعٌ", trText: "Mükemmel (eksiksiz) ve harika bir iş." } 
        }
    },

    // 50. R-Sh-D (ر ش د) KÖKÜ - Doğru Yolda Olmak / Olgunluk / Rehberlik
    "رشد": {
        21: { base: { emoji: "🌱", arText: "قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ", trText: "Doğru yol (rüşt), eğri yoldan kesinlikle ayrılmıştır. (Bakara Suresi)" } }, // رُشْد
        22: { base: { emoji: "💎", arText: "أَهْدِكُمْ سَبِيلَ الرَّشَادِ", trText: "Sizi doğru yola (reşat yoluna) ulaştırayım. (Mü'min Suresi)" } }, // رَشَاد
        33: { base: { emoji: "🕌", arText: "الْخُلَفَاءُ الرَّاشِدُونَ", trText: "Hulefâ-yi Râşidîn (Doğru yolda olan râşit halifeler)." } }, // رَاشِد
        35: { base: { emoji: "🧠", arText: "أَلَيْسَ مِنْكُمْ رَجُلٌ رَشِيدٌ", trText: "İçinizde aklı başında (reşit/doğru dürüst) bir adam yok mu? (Hûd Suresi)" } }, // رَشِيد
        55: { base: { emoji: "ℹ️", arText: "إِرْشَادُ النَّاسِ إِلَى الْخَيْرِ", trText: "İnsanları hayra yönlendirmek (irşat etmek)." } }, // إِرْشَاد
        56: { base: { emoji: "🗺️", arText: "الْكِتَابُ خَيْرُ مُرْشِدٍ لِلْإِنْسَانِ", trText: "Kitap, insan için en iyi mürşittir (yol göstericidir/rehberdir)." } } // مُرْشِد
    },

    // 51. A-M-N (ا م ن) KÖKÜ - Güvende Olmak / İnanmak / Güvenilirlik
    "امن": {
        19: { base: { emoji: "👮", arText: "أَمْن", trText: "Güvenlik." } }, // أَمْن
        22: { base: { emoji: "🛡️", arText: "الْأَمَانُ وَالصِّحَّةُ نِعْمَتَانِ", trText: "Aman (güvenlik) ve sağlık iki büyük nimettir." }, suggestsPlus: true, "ة": { emoji: "📦", arText: "الأَمَانَةُ تَجْلِبُ الرِّزْقَ", trText: "Emaneti korumak (güvenilir olmak) rızık getirir." } }, // أَمَان + ة = أَمَانَة
        35: { base: { emoji: "🤝", arText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ وَالْمُؤْمِنُ مَنْ أَمِنَهُ النَّاسُ", trText: "Müslüman, diğer Müslümanların elinden ve dilinden emin olduğu kimsedir." } }, // أَمِين
        55: { base: { emoji: "❤️", arText: "الْإِيمَانُ مَا وَقَرَ فِي الْقَلْبِ", trText: "İman, kalbe yerleşen (inanılan) şeydir." } }, // إِيمَان
        56: { base: { emoji: "🕌", arText: "الْمُؤْمِنُ مِرْآةُ الْمُؤْمِنِ", trText: "Mümin, müminin aynasıdır. (Hadis-i Şerif)" } }, // مُؤْمِن
        61: { base: { emoji: "📝", arText: "شَرِكَةُ التَّأْمِينِ الصِّحِّيِّ", trText: "Sağlık sigortası (güvencesi/tamini) şirketi." } } // تَأْمِين
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
        35: { base: { emoji: "💎", arText: "إِنَّ اللَّهَ هُوَ الْغَنِيُّ الْحَمِيدُ", trText: "Şüphesiz Allah, hiçbir şeye muhtaç değildir, her türlü övgüye layıktır (Hamit'tir). (Lokmân Suresi)" } }, // حَمِيد
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
        21: { base: { emoji: "🙏", arText: "مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ اللَّهَ", trText: "İnsanlara teşekkür etmeyen, Allah'a da şükretmez. (Hadis-i Şerif)" }, suggestsPlus: true, "يّ": { emoji: "👨", arText: "شُكْرِيّ", trText: "Şükrü." }, "يَّة": { emoji: "👩", arText: "شُكْرِيَّة", trText: "Şükriye." } }, // شُكْر + ekler
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
    }
};

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

document.addEventListener('DOMContentLoaded', () => {
    // Zoom Overlay'i sisteme entegre ediyoruz
    if (!document.getElementById('zoom-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'zoom-overlay';
        overlay.className = 'zoom-overlay';
        document.body.appendChild(overlay);

        // Overlay'e (ekrandaki herhangi bir boşluğa/flu alana) tıklanınca kapat
        // Overlay'e (ekrandaki herhangi bir boşluğa/flu alana) tıklanınca kapat
        const closeOverlay = (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeAllZoomedBoxes();
        };
        overlay.addEventListener('click', closeOverlay);
        overlay.addEventListener('touchstart', closeOverlay, { passive: false });
    }
});

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
    clearDraggableRoots();
    SoundEngine.playReset();
    resetTableOnly(true); 
    
    currentEggIndex = -1; // <--- EKLENEN: Yeni kök seçildiğinde sırayı başa sarar
    
    const trimmedRoot = verb.trim();
    if (trimmedRoot.length !== 3) return;
    
    currentRoot = trimmedRoot;
    
    // Klavyeden girilmiş gibi ekrana yansıt
    const rootDisplay = document.getElementById('root-text-display');
    if (rootDisplay) {
        rootDisplay.innerText = currentRoot;
    }
    
    // Modalı kapat ve altın sarısı kutuları parlat
    closeVerbModal();
    highlightEasterEggBoxes(currentRoot);
    
    // YENİ EKLENEN: Otomatik olarak ahşap tahta bloğunu sahneye fırlat
    if (typeof autoSpawnRootClone === 'function') {
        autoSpawnRootClone();
    }
    
    // Eğer şu an Mezid (3+) sekmesindeyse, Mücerred sekmesine geri dön
    if (currentTabActive === 1) {
        setTab(0);
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

    // DİKKAT: Buradaki 'highlightEasterEggBoxes(currentRoot)' kodunu sildik.
    // Artık herhangi bir kutu sıfırlandığında her yer tekrar sarı olmayacak!
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
    const isZoomEnabled = document.getElementById('zoomToggleCheckbox') ? document.getElementById('zoomToggleCheckbox').checked : false;

    // KELİMEYİ TÜRETEN FONKSİYON
    const applyWordTransformation = () => {
        const vezinObj = babVezinleri[mapping.babNo];
        let kalipMetni = (vezinObj && vezinObj[mapping.type]) ? vezinObj[mapping.type] : kalip;
        let plainWord = (currentRootSafe.length === 3) ? applyRootToKalip(currentRootSafe, kalipMetni) : kalipMetni;

        let activeRootArray = (currentRootSafe.length === 3) ? currentRootSafe.split("") : ['ف', 'ع', 'ل'];
        const coloredHTML = ColorEngine.colorize(plainWord, activeRootArray);
        
        textEl.innerHTML = coloredHTML;
        lastOriginalWord = plainWord; 

        // Ekranda dev klon varsa onu da anında türet ve yeşile boya!
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
        // =========================================================
        // BÜYÜME AÇIK SİSTEMİ
        // =========================================================
        if (tiklama === 0) {
            // 1. AŞAMA: Sadece Kırmızı Vurgu
            document.querySelectorAll('.glass-box').forEach(b => b.classList.remove('current-active-red'));
            boxElement.classList.add('current-active-red');
            boxElement.classList.remove('sari-vurgu');
            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            boxElement.setAttribute('data-tiklama-sayisi', '1');
            
        } else if (tiklama === 1) {
            // 2. AŞAMA: TÜREMEDEN BÜYÜT VE KÖKÜ GÖSTER
            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            if (typeof triggerAreaPulse === 'function') triggerAreaPulse(boxElement);
            boxElement.setAttribute('data-tiklama-sayisi', '2');
            
        } else if (tiklama === 2) {
            // 3. AŞAMA: BÜYÜK HALDEYKEN TÜRET VE YEŞİL DOLGU VER
            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            boxElement.style.setProperty("background-color", "#bfffdf", "important"); 
            boxElement.style.borderColor = "#000000"; 
            applyWordTransformation(); 
            boxElement.setAttribute('data-tiklama-sayisi', '3');
            
        } else if (tiklama === 3) {
            // 4. AŞAMA: BÜYÜMEYİ KAPAT AMA KELİMEYİ VE YEŞİL DOLGUYU SİLME (Tabloda kalsın)
            if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
            boxElement.classList.remove('current-active-red'); // Kırmızı sınırı kaldır
            boxElement.setAttribute('data-tiklama-sayisi', '4'); // Tamamlanmış olarak işaretle
            if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();

        } else {
            // 5. AŞAMA: Tamamlanmış (yeşil) kutuya fareyle manuel bir daha tıklanırsa SIFIRLA
            if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
            if (typeof resetBox === 'function') resetBox(boxElement); // Kelimeyi sil
            boxElement.removeAttribute('data-tiklama-sayisi');
            boxElement.classList.remove('current-active-red'); 
            boxElement.style.setProperty("background-color", "", "important");
            if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();
        }
    } else {
        // =========================================================
        // BÜYÜME KAPALI SİSTEMİ
        // =========================================================
        if (tiklama === 0) {
            // 1. AŞAMA: Vurgu
            document.querySelectorAll('.glass-box').forEach(b => b.classList.remove('current-active-red'));
            boxElement.classList.add('current-active-red');
            boxElement.classList.remove('sari-vurgu');
            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            boxElement.setAttribute('data-tiklama-sayisi', '1');
        } else if (tiklama === 1) {
            // 2. AŞAMA: Türet ve Yeşil Dolgu
            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            boxElement.style.setProperty("background-color", "#bfffdf", "important"); 
            boxElement.style.borderColor = "#000000"; 
            applyWordTransformation(); 
            boxElement.setAttribute('data-tiklama-sayisi', '2');
        } else if (tiklama === 2) {
            // 3. AŞAMA: Kırmızı vurguyu kaldır ama kelimeyi/yeşili SİLME
            if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
            boxElement.classList.remove('current-active-red'); 
            boxElement.setAttribute('data-tiklama-sayisi', '3'); // Tamamlandı
        } else {
            // 4. AŞAMA: Manuel tıklamada sıfırla
            if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
            if (typeof resetBox === 'function') resetBox(boxElement);
            boxElement.removeAttribute('data-tiklama-sayisi');
            boxElement.classList.remove('current-active-red'); 
            boxElement.style.setProperty("background-color", "", "important");
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
            container.style.display = 'none';
        }

        if (boxElement.hasAttribute('data-tiklama-sayisi')) {
            boxElement.setAttribute('data-tiklama-sayisi', '2');
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
    SoundEngine.playClick();
    
    if (!kok || kok.length !== 3) {
        kok = "فعل"; 
    }

    if (!lastClickedBoxTextSpan) return;
    const boxElement = lastClickedBoxTextSpan.closest('.glass-box');
    if (!boxElement) return;

   document.querySelectorAll('.glass-box').forEach(box => {
        box.style.zIndex = "1";
    });

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

    setTimeout(() => {
        if (boxElement) boxElement.classList.remove('no-transition');
    }, 50);

    let inlineContainer = boxElement.querySelector('.conjugation-inline-container');
    if (!inlineContainer) {
        inlineContainer = document.createElement('div');
        inlineContainer.className = 'conjugation-inline-container';
        boxElement.appendChild(inlineContainer);
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const tableWidth = 420;
    const estimatedTableHeight = 410; 
    
    let rect = boxElement.getBoundingClientRect();
    
    let targetLeft = -tableWidth - 60;
    let globalLeft = rect.left + targetLeft;
    if (globalLeft < 10) {
        targetLeft = 10 - rect.left;
    }
    inlineContainer.style.left = `${targetLeft}px`;

    let targetTop = (windowHeight / 2) - (estimatedTableHeight / 2) - rect.top;
    let globalTop = rect.top + targetTop;
    let globalBottom = globalTop + estimatedTableHeight;
    if (globalTop < 10) {
        targetTop = 10 - rect.top;
    } else if (globalBottom > windowHeight - 10) {
        targetTop = (windowHeight - estimatedTableHeight - 10) - rect.top;
    }

    inlineContainer.style.top = `${targetTop}px`;
    
    const tabanKelime = applyRootToKalip(kok, anaVezin);
    let stem = tabanKelime.replace(/[َُِّْ]$/, "");
    let kelimeListesi = [];

const list = sigaSablonlari[tip];
    list.forEach((siga, index) => {
        let cekilmisKelime = "";
        
        if (tip === 'muzari') {
            let r1 = kok[0]; let r2 = kok[1]; let r3 = kok[2];
            
            let aynHareke = "ُ"; 
            if (babNo === 7 || anaVezin.includes("يَفْعِلُ")) {
                aynHareke = "ِ";
            } else if (anaVezin.includes("يَفْعَلُ") || anaVezin.includes("يَفْتَعِلُ") || anaVezin.includes("يَنْفَعِلُ") || babNo === 12) {
                aynHareke = "َ";
            }
            
            let coreWord = r1 + "ْ" + r2 + aynHareke + r3;
            
            if (babNo === 7) coreWord = r1 + "ْ" + r2 + aynHareke + r3; 
            else if (babNo === 8) coreWord = r1 + "َ" + r2 + "ِّ" + r3;
            else if (babNo === 9) coreWord = r1 + "َ" + "ا" + r2 + "ِ" + r3;
            else if (babNo === 10) coreWord = "نْ" + r1 + "َ" + r2 + "ِ" + r3; 
            else if (babNo === 11) coreWord = r1 + "ْتَ" + r2 + "ِ" + r3;
            else if (babNo === 12) {
                // 84 NUMARA İF'İLAL ÇÖZÜMÜ: Hünne (5) ve Entünne (11) sîgalarında şeddeyi (idğamı) açıyoruz
                if (index === 5 || index === 11) {
                    coreWord = r1 + "ْ" + r2 + "َ" + r3 + "ِ" + r3; // Açık ve esreli form
                } else {
                    coreWord = r1 + "ْ" + r2 + "َ" + r3 + "ّ"; // Şeddeli form
                }
            } 
            else if (babNo === 13) coreWord = "تَ" + r1 + "َ" + r2 + "َّ" + r3; 
            else if (babNo === 14) coreWord = "تَ" + r1 + "َ" + "ا" + r2 + "َ" + r3;
            else if (babNo === 15) coreWord = "سْتَ" + r1 + "ْ" + r2 + "ِ" + r3;
            
            // TEFE'UL FAZLADAN 'T' HATASI ÇÖZÜLDÜ
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
            // İf'ilâl (12. Bab) için Fekkü'l-İdğam (Şeddenin Açılması) Kuralı
            if (babNo === 12) {
                let r1 = kok[0], r2 = kok[1], r3 = kok[2];
                let baseSeddeli = `اِ${r1}ْ${r2}َ${r3}`; // Örn: اِكْمَل
                let baseAcik = `اِ${r1}ْ${r2}َ${r3}َ${r3}`; // Örn: اِكْمَلَل
                
                // İlk 5 sîga için şeddeli özel ekler
                let seddeliEkler = ["َّ", "َّا", "ُّوا", "َّتْ", "َّتَا"]; 
                
                if (index < 5) {
                    // İlk 5 sîgada (Hüve'den Hüma Müennes'e kadar) şedde korunur
                    cekilmisKelime = baseSeddeli + seddeliEkler[index]; 
                } else {
                    // 6. sîgadan (Cemi Müennes/Nun-u Nisve) itibaren şedde açılır
                    cekilmisKelime = baseAcik + siga.ek; 
                }
            } else {
                // Diğer tüm bablar normal mazi mantığıyla çekilmeye devam eder
                cekilmisKelime = stem + siga.ek; 
            }
        } 
        else if (tip === 'emir') {
            // İF'İLAL (12. BAB) EMİR HAZIR ÇEKİMİ İÇİN ÖZEL KORUMA
            if (babNo === 12) {
                let r1 = kok[0], r2 = kok[1], r3 = kok[2];
                if (index === 5) {
                    // Entünne (Cemi Müennes - 6. Sîga) -> Şedde açılır, ilk lam'a esre verilir.
                    cekilmisKelime = `اِ${r1}ْ${r2}َ${r3}ِ${r3}ْنَ`; // Örn: اِحْمَرِرْنَ
                } else {
                    // Diğer 5 sîga şeddeli kalır. Standart emir ekleri ile bağlarız.
                    let emirEkleri = ["َّ", "َّا", "ُّوا", "ِّي", "َّا"];
                    cekilmisKelime = `اِ${r1}ْ${r2}َ${r3}${emirEkleri[index]}`; // Örn: اِحْمَرَّ
                }
            } 
            else {
                // DİĞER TÜM BABLAR İÇİN SİZİN ORİJİNAL EMİR MANTIĞINIZ ÇALIŞIR
                let r1 = kok[0]; let r2 = kok[1]; let r3 = kok[2];
                let emirPrefix = "اِ";
                if (anaVezin.startsWith("أُ")) emirPrefix = "أُ";
                else if (anaVezin.startsWith("أَ")) emirPrefix = "أَ";
                else if (babNo === 8 || babNo === 9 || babNo === 13 || babNo === 14) emirPrefix = ""; 

                let aynHareke = "ِ";
                if (anaVezin.includes("أُفْعُلْ")) aynHareke = "ُ";
                else if (anaVezin.includes("اِفْعَلْ")) aynHareke = "َ"; // (12. babı buradan çıkardık, yukarıya aldık)

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

    let html = `<div class="matrix-close-btn" onclick="closeInlineMatrix(event, this)">✕</div>`;
    html += `<table class="conjugation-table">`;
    html += `<thead><tr><th>Müfred</th><th>Tesniye</th><th>Cemi</th></tr></thead><tbody>`;

    let totalItems = kelimeListesi.length;
    const isColorActive = kok && kok.length === 3;

    for (let i = 0; i < totalItems; i += 3) {
        let rowIndex = i / 3;
        let bgColor = '#ffffff'; 
        
        if (rowIndex === 0 || rowIndex === 2) {
            bgColor = '#e3f2fd'; 
        } else if (rowIndex === 1 || rowIndex === 3) {
            bgColor = '#fce4ec'; 
        }

        let w1 = kelimeListesi[i] || '';
        let w2 = kelimeListesi[i+1] || '';
        let w3 = kelimeListesi[i+2] || '';

        // RENKLENDİRME MOTORU ENTEGRASYONU
      if (isColorActive) {
            w1 = w1 ? ColorEngine.colorize(w1, kok.split("")) : '';
            w2 = w2 ? ColorEngine.colorize(w2, kok.split("")) : '';
            w3 = w3 ? ColorEngine.colorize(w3, kok.split("")) : '';
        }

        // DÜZELTME: Siga hücrelerindeki hatalı inline-flex'ler kaldırıldı!
        html += `<tr>
                    <td style="background-color: ${bgColor} !important;"><span class="siga-text">${w1}</span></td>
                    <td style="background-color: ${bgColor} !important;"><span class="siga-text">${w2}</span></td>
                    <td style="background-color: ${bgColor} !important;"><span class="siga-text">${w3}</span></td>
                 </tr>`;
    }
    html += `</tbody></table>`;
    
    inlineContainer.innerHTML = html;
    const expandBtn = document.createElement('div');
    expandBtn.className = 'matrix-expand-btn';
    expandBtn.title = 'Tam Ekran';
    expandBtn.innerHTML = '<i class="fas fa-expand"></i>';

    expandBtn.onclick = function(event) {
        openMatrixFullscreen(event, this);
    };

    inlineContainer.appendChild(expandBtn);
    
    boxElement.style.zIndex = "999999"; 
    boxElement.classList.add('matrix-opened');
}

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
        highlightEasterEggBoxes(currentRoot); 
        
        // YENİ EKLENEN: Otomatik olarak tahta bloğu sahneye at!
        autoSpawnRootClone();
        
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
     closeAllZoomedBoxes(); // Ekran sıfırlanırken tüm zoomları ve overlayi kapatır
    if (typeof clearDraggableRoots === 'function') {
        clearDraggableRoots();
    }

    if (!isSilent) {
        SoundEngine.playReset(); 
    }
    isReadyVerbMode = false;
    targetStates = {};
    
    document.querySelectorAll('.glass-box').forEach(box => {
        box.classList.remove('hidden-mode');
        box.classList.remove("pulse-highlight"); 
        box.classList.remove('matrix-opened');
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
                    el.innerHTML = ColorEngine.colorize(original, ['ف', 'ع', 'ل']);
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

    highlightEasterEggBoxes(""); 
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
    
    const plusBtn = document.querySelector('.fa-plus');
    if (plusBtn) plusBtn.classList.remove('plus-highlighted');
    
    if (menu.style.display === "flex") {
        menu.style.display = "none";
        return;
    }
    
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

    // Suffix (ek) kontrolünü yolluyoruz
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
    const plusBtn = document.querySelector('.fa-plus');
    if (plusBtn && !currentSuffix) {
        plusBtn.classList.remove('plus-highlighted');
    }

    if (!boxElement || !currentRoot || currentRoot.length !== 3) return;

    const refEl = boxElement.querySelector('.ref');
    if (!refEl) return;
    const refId = parseInt(refEl.innerText);

    const rootData = wordEasterEggs[currentRoot];
    if (!rootData) return;

    const refData = rootData[refId]; 
    if (!refData) return;

    // Eğer bir ek eklendiyse eke ait veriyi al, yoksa 'base' (kök halini) al
    const data = currentSuffix ? refData[currentSuffix] : refData.base;

    // Eğer ek almamış kök haldeysek ve kelime ek öneriyorsa + ikonunu parlat
    if (!currentSuffix && refData.suggestsPlus && plusBtn) {
        plusBtn.classList.add('plus-highlighted');
    }

    if (!data) return;

    document.querySelectorAll('.easter-egg-trigger').forEach(btn => btn.remove());

    if (data.emoji) {
        const rect = boxElement.getBoundingClientRect();
        const emojiDiv = document.createElement('div');
        // Emojiyi sonradan bulup silebilmek için özel sınıf ve KUTU KİMLİĞİ (data-ref) ekliyoruz
        emojiDiv.className = 'floating-emoji easter-egg-emoji';
        emojiDiv.setAttribute('data-ref', refId);
        emojiDiv.innerText = data.emoji;

        // Emojilerin tam üst üste binmemesi için yatay sapma
        let randomOffset = (Math.random() - 0.5) * 60; 
        emojiDiv.style.left = (rect.left + rect.width / 2 - 30 + randomOffset) + 'px'; 
        
        document.body.appendChild(emojiDiv);
    } // <--- İŞTE EKSİK OLAN PARANTEZ BURASIYDI!

    if (data.arText || data.trText) {
        const triggerBtn = document.createElement('div');
        triggerBtn.className = 'easter-egg-trigger';
        triggerBtn.innerHTML = '✨'; 
        triggerBtn.title = 'Bilgiyi Gör';

        triggerBtn.onclick = function(e) {
            e.stopPropagation(); 
            showEasterEggOverlay(data.arText, data.trText);
            this.remove(); 
        };
        boxElement.appendChild(triggerBtn);
    }
}



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
        cloneBox.className = 'glass-box crisp-zoom-clone'; 
        
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
                this.remove();
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
            
            const h1 = currentRootSafe[0];
            const h2 = currentRootSafe[1];
            const h3 = currentRootSafe[2];
            let displayRoot = h1 + 'ـ' + ' ' + 'ـ' + h2 + 'ـ' + ' ' + 'ـ' + h3;
            
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
        arDiv.innerText = arText; 
        arDiv.style.display = 'block'; 
    } else { 
        arDiv.style.display = 'none'; 
    }
    
    if (trText) { 
        trDiv.innerText = trText; 
        trDiv.style.display = 'block'; 
    } else { 
        trDiv.style.display = 'none'; 
    }
    
    SoundEngine.playClick();
    overlay.style.display = 'flex';
}

function openMatrixFullscreen(e, btnElement) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    SoundEngine.playClick();
    
    const boxElement = btnElement.closest('.glass-box');
    if (!boxElement) return;
    
    const sigaCells = boxElement.querySelectorAll('.siga-text');
    let wordsList = [];
    sigaCells.forEach(cell => {
        // innerText yerine innerHTML kullanıyoruz ki renk <span> etiketleri silinmesin
        wordsList.push(cell.innerHTML.trim()); 
    });
    
    if (wordsList.length === 0) return;
    
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
    }
    
    const contentArea = fullscreenOverlay.querySelector('.matrix-fullscreen-content');
    
    const oldTable = contentArea.querySelector('.matrix-fullscreen-table');
    if (oldTable) oldTable.remove();
    
    const table = document.createElement('table');
    table.className = 'matrix-fullscreen-table';
    
    let tbodyHtml = '';
    for (let i = 0; i < wordsList.length; i += 3) {
        let rowIndex = i / 3;
        let bgColor = '#ffffff'; 
        
        if (rowIndex === 0 || rowIndex === 2) {
            bgColor = '#e3f2fd'; 
        } else if (rowIndex === 1 || rowIndex === 3) {
            bgColor = '#fce4ec'; 
        }

        tbodyHtml += `
            <tr>
                <td style="background-color: ${bgColor} !important;"><span class="matrix-fullscreen-text">${wordsList[i] || ''}</span></td>
                <td style="background-color: ${bgColor} !important;"><span class="matrix-fullscreen-text">${wordsList[i+1] || ''}</span></td>
                <td style="background-color: ${bgColor} !important;"><span class="matrix-fullscreen-text">${wordsList[i+2] || ''}</span></td>
            </tr>
        `;
    }
    
    table.innerHTML = `
        <thead>
            <tr>
                <th>Müfred</th>
                <th>Tesniye</th>
                <th>Cemi</th>
            </tr>
        </thead>
        <tbody>
            ${tbodyHtml}
        </tbody>
    `;
    
    contentArea.appendChild(table);
    fullscreenOverlay.style.display = 'flex';
}

function closeMatrixFullscreen(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    SoundEngine.playClose();
    const fullscreenOverlay = document.getElementById('matrix-fullscreen-overlay');
    if (fullscreenOverlay) {
        fullscreenOverlay.style.display = 'none';
    }
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
                charsOnly[i].isRoot = true;
                rIndex += 2;
            } 
            else if (rIndex + 2 < 3 && this.isEquivalent(c, rootArray[rIndex + 2]) && this.isWeak(rootArray[rIndex]) && this.isWeak(rootArray[rIndex + 1])) {
                charsOnly[i].isRoot = true;
                rIndex += 3;
            }
            else if (rIndex > 0 && rIndex <= 3 && this.isEquivalent(rootArray[1], rootArray[2]) && this.isEquivalent(c, rootArray[1])) {
                charsOnly[i].isRoot = true;
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
    if (!currentRoot || currentRoot.length !== 3) return;
    
    clearDraggableRoots(); // Sahnede başka klon varsa temizle (Tek klon kuralı)
    
    const formattedText = formatArabicRoot(currentRoot);
    const dragEl = document.createElement('div');
    dragEl.className = 'draggable-root-clone';
    dragEl.innerText = formattedText;
    document.body.appendChild(dragEl);

    makeElementDraggable(dragEl);

    // Klonu ana kök kutusunun hemen altında, ortalı bir şekilde göster
    const rootBox = document.getElementById('root-display-box');
    if (rootBox) {
        const rect = rootBox.getBoundingClientRect();
        const spawnX = rect.left + window.scrollX + (rect.width / 2) - 60; // Ortalama hesabı
        const spawnY = rect.bottom + window.scrollY + 25; // Kutunun 25px altı
        
        dragEl.style.left = spawnX + 'px';
        dragEl.style.top = spawnY + 'px';
    } else {
        dragEl.style.left = '50%';
        dragEl.style.top = '150px';
    }
    
    // Zıplayarak sahneye çıkış animasyonu (Oyun hissiyatı için)
    dragEl.style.transform = 'scale(0)';
    dragEl.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    setTimeout(() => {
        dragEl.style.transform = 'scale(1)';
    }, 50);
    
    // Sürükleme başladığında takılma olmaması için geçiş efektini kapat
    setTimeout(() => {
        dragEl.style.transition = 'none';
    }, 350);
}

// ==================================================================
// SUNUM KUMANDASI VE KLAVYE İLE OTOMATİK GEÇİŞ SİSTEMİ
// ==================================================================
let currentEggIndex = -1;
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
    if (isPresentationLocked) return; 
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    let waitTime = 0;
    const activeZoom = document.getElementById('crisp-zoom-clone');
    const roots = getReadyRoots();
    if (roots.length === 0) return;

    if (activeZoom) {
        waitTime = 10; 
    }

    setTimeout(() => {
        if (!currentRoot || currentRoot.length !== 3 || !wordEasterEggs[currentRoot]) {
            selectReadyVerb(roots[0]);
            return; 
        }

        const refs = getSortedRefsForRoot(currentRoot);

        if (currentEggIndex >= 0 && currentEggIndex < refs.length) {
            const currentRefId = refs[currentEggIndex];
            const currentBox = Array.from(document.querySelectorAll('.glass-box')).find(b => {
                const refEl = b.querySelector('.ref');
                return refEl && parseInt(refEl.innerText.trim()) === currentRefId;
            });
            
            if (currentBox) {
                let tiklama = parseInt(currentBox.getAttribute('data-tiklama-sayisi') || '0');
                const isZoomEnabled = document.getElementById('zoomToggleCheckbox') ? document.getElementById('zoomToggleCheckbox').checked : false;

                if (isZoomEnabled) {
                    // Zoom açıkken 1. (Vurgu) ve 2. (Kök/Klon) aşamalarda kelimede kalmaya devam et
                    if (tiklama === 1 || tiklama === 2) {
                        activateBoxByRef(currentRefId);
                        return; 
                    }
                    // 3. Aşamadıysa (Yeşil, türemiş ve devasa), tekrar basınca kapat AMA SİLME, sonra sonrakine geç!
                    if (tiklama === 3) {
                        handleBoxClick(currentBox); 
                    }
                } else {
                    // Zoom kapalıysa
                    if (tiklama === 1) {
                        activateBoxByRef(currentRefId);
                        return; 
                    }
                    if (tiklama === 2) {
                        handleBoxClick(currentBox); // Kırmızı vurguyu kaldır ama yeşili silme
                    }
                }
            }
        }

        currentEggIndex++;

        if (currentEggIndex >= refs.length) {
            let rootIndex = roots.indexOf(currentRoot);
            rootIndex++;
            if (rootIndex >= roots.length) rootIndex = 0; 
            selectReadyVerb(roots[rootIndex]);
            return; 
        }

        activateBoxByRef(refs[currentEggIndex]);
    }, waitTime);
}
// ==================================================================
// 5. GERİ KUMANDA (Geri Dönüşlerde de Sarı Vurgu Beklemesi Eklendi)
// ==================================================================
function prevEasterEgg() {
    if (isPresentationLocked) return; // Kilitliyse tuş basımlarını yok say
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    const activeZoom = document.getElementById('crisp-zoom-clone') || document.querySelector('.glass-box.pulse-highlight');
    if (activeZoom) {
        if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();
        activeZoom.setAttribute('data-tiklama-sayisi', '1');
        return; 
    }

    const roots = getReadyRoots();
    if (!currentRoot || currentRoot.length !== 3 || !wordEasterEggs[currentRoot] || roots.length === 0) return;

    const refs = getSortedRefsForRoot(currentRoot);

    // BULUNULAN KUTUYU ANINDA TEMİZLE
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
            
            // Kutu boşaldığı için Sarı Vurguyu (hedef rengini) geri ver
            currentBox.classList.add('sari-vurgu');
            currentBox.style.setProperty("background-color", "", "important");
        }
    }

    // BİR ÖNCEKİ KUTUYA / DURUMA GEÇ
    currentEggIndex--;

    // Eğer ilk kutudan da geriye çıkıyorsak (-1 olduysa) kökün "Sadece Sarı Hedefler" aşamasında bekle
    if (currentEggIndex === -1) {
        highlightEasterEggBoxes(currentRoot);
        return; 
    }

    // Eğer sarı hedeflerden de geriye basılmışsa (< -1), önceki kökün EN SON kelimesine git
    if (currentEggIndex < -1) {
        let rootIndex = roots.indexOf(currentRoot);
        rootIndex--;
        if (rootIndex < 0) rootIndex = roots.length - 1; 

        selectReadyVerb(roots[rootIndex]);
        setTimeout(() => {
            const newRefs = getSortedRefsForRoot(roots[rootIndex]);
            currentEggIndex = newRefs.length - 1;
            if (newRefs.length > 0) {
                activateBoxByRef(newRefs[currentEggIndex]);
            }
        }, 600);
        return;
    }

    // Normal önceki kutuya geç
    activateBoxByRef(refs[currentEggIndex]);
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




