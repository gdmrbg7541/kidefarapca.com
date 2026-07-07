const kategoriTanimlari = {
    "harficer": { title: "Harf-i Cerler", arTitle: "حُروف الجَرّ", icon: "🔤", items: [] },
    "baglac": { title: "Bağlaçlar", arTitle: "حُروف العَطْف", icon: "🔗", items: [] },
    "soru": { title: "Soru Edatları", arTitle: "أَدَوات الاسْتِفْهام", icon: "❓", items: [] },
    "zaman": { title: "Zaman İfadeleri", arTitle: "ظُروف الزَّمان", icon: "⏱️", items: [] },
    "zarf": { title: "Mekân Zarfları", arTitle: "ظُروف المَكان", icon: "📍", items: [] },
    "zamir": { title: "Kişi Zamirleri", arTitle: "الضَّمائِر", icon: "👤", items: [] },
    "isaret": { title: "İşaret Zamirleri", arTitle: "أَسْماء الإِشارَة", icon: "👇", items: [] },
    "mevsul": { title: "İsmi Mevsuller", arTitle: "الأَسْماء المَوْصولَة", icon: "🔗", items: [] },
    "renk": { title: "Renkler", arTitle: "الأَلْوان", icon: "🎨", items: [] },
    "sayi": { title: "Sayılar", arTitle: "الأَرْقام", icon: "🔢", items: [] },
    "sirasayi": { title: "Sıra Sayıları", arTitle: "الأَعْداد التَّرْتيبِيَّة", icon: "📊", items: [] },
    "gun": { title: "Haftanın Günleri", arTitle: "أَيّام الأُسْبوع", icon: "📅", items: [] },
    "tasgir": { title: "İsm-i Tasgir", arTitle: "التَّصْغير", icon: "🔍", items: [] },
    "tafdil": { title: "İsm-i Tafdil", arTitle: "التَّفْضيل", icon: "🏆", items: [] },
    "meyve": { title: "Meyveler", arTitle: "الفَواكِه", icon: "🍎", items: [] },
    "sebze": { title: "Sebzeler", arTitle: "الخُضْرَوات", icon: "🥦", items: [] },
    "yiyecek": { title: "Yiyecekler", arTitle: "الأَطْعِمَة", icon: "🍔", items: [] },
    "icecek": { title: "İçecekler", arTitle: "المَشْروبات", icon: "☕", items: [] },
    "ulasim": { title: "Ulaşım Araçları", arTitle: "وَسائِل النَّقْل", icon: "🚗", items: [] },
    "meslek": { title: "Meslekler", arTitle: "المِهَن", icon: "💼", items: [] },
    "aile": { title: "Aile Bireyleri", arTitle: "أَفْراد الأُسْرَة", icon: "👨‍👩‍👧‍👦", items: [] }
};

const sozlukVerileri = {



    // =================================================================================================
    // ZAMAN İFADELERİ, ZARFLAR, SORU EDATLARI, HARF-İ CERLER
    // =================================================================================================
    
    // --- Zaman İfadeleri ---
    "Zaman: Bugün": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "📅", arText: "الْيَوْمَ", trText: "Bugün" } } },
    "Zaman: Dün": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏪", arText: "أَمْسِ", trText: "Dün" } } },
    "Zaman: Yarın": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏩", arText: "غَداً", trText: "Yarın" } } },
    "Zaman: Şimdi": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏱️", arText: "الْآنَ", trText: "Şimdi / Şu an" } } },
    "Zaman: Sabah": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌅", arText: "صَبَاحاً", trText: "Sabah" } } },
    "Zaman: Akşam": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌆", arText: "مَسَاءً", trText: "Akşam" } } },
    "Zaman: Gece": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌃", arText: "لَيْلاً", trText: "Gece" } } },
    "Zaman: Gündüz": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "☀️", arText: "نَهَاراً", trText: "Gündüz" } } },
    "Zaman: Önce": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏮️", arText: "قَبْلَ", trText: "Önce" } } },
    "Zaman: Sonra": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏭️", arText: "بَعْدَ", trText: "Sonra" } } },

    // --- Zarflar (Mekan vs) ---
    "Zarf: Üstünde": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "⬆️", arText: "فَوْقَ", trText: "Üzerinde / Üstünde" } } },
    "Zarf: Altında": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "⬇️", arText: "تَحْتَ", trText: "Altında" } } },
    "Zarf: Önünde": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "➡️", arText: "أَمَامَ", trText: "Önünde" } } },
    "Zarf: Arkasında": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "⬅️", arText: "خَلْفَ / وَرَاءَ", trText: "Arkasında / Gerisinde" } } },
    "Zarf: Yanında": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, zamirBase: "عِنْدَ / لَدَى", tekil: { base: { emoji: "👥", arText: "عِنْدَ / لَدَى", trText: "Yanında / Katında / Sahip" } } },
    "Zarf: Arasında": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "↔️", arText: "بَيْنَ", trText: "Arasında" } } },
    "Zarf: Etrafında": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "🔄", arText: "حَوْلَ", trText: "Çevresinde / Etrafında" } } },
    "Zarf: İçinde": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "📥", arText: "دَاخِلَ", trText: "İçinde" } } },
    "Zarf: Dışında": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "📤", arText: "خَارِجَ", trText: "Dışında" } } },
    "Zarf: Burada": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "📍", arText: "هُنَا", trText: "Burada" } } },
    "Zarf: Orada": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "🗺️", arText: "هُنَاكَ / هُنَالِكَ", trText: "Orada / Şurada" } } },

    // --- Soru Edatları ---
    "Soru: Ne": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "❓", arText: "مَا / مَاذَا", trText: "Ne? / Neler?" } } },
    "Soru: Kim": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🧑‍⚖️", arText: "مَنْ", trText: "Kim? / Kimler?" } } },
    "Soru: Nerede": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "📍", arText: "أَيْنَ", trText: "Nerede?" } } },
    "Soru: Ne Zaman": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "⏰", arText: "مَتَى", trText: "Ne Zaman?" } } },
    "Soru: Nasıl": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🤷", arText: "كَيْفَ", trText: "Nasıl?" } } },
    "Soru: Neden": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🤔", arText: "لِمَاذَا", trText: "Neden? / Niçin?" } } },
    "Soru: Hangi": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🔀", arText: "أَيُّ", trText: "Hangi?" } } },
    "Soru: Kaç": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🔢", arText: "كَمْ", trText: "Kaç? / Ne Kadar?" } } },
    "Soru: Mi 1": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "❔", arText: "هَلْ", trText: "Mı? / Mi? (Soru edatı)" } } },
    "Soru: Mi 2": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "❔", arText: "أَ", trText: "Mı? / Mi? (Soru harfi)" } } },

    "Soru: Bimaza": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🤷‍♂️", arText: "بِمَاذَا", trText: "Ne ile? / Neye?" } } },
    "Soru: Ila eyne": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "➡️", arText: "إِلَى أَيْنَ", trText: "Nereye?" } } },
    "Soru: Min eyne": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "⬅️", arText: "مِنْ أَيْنَ", trText: "Nereden?" } } },
    "Soru: Bima": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🧩", arText: "بِمَ / بِمَا", trText: "Neyle? / Neye?" } } },
    "Soru: Mimma": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🤔", arText: "مِمَّ / مِمَّا", trText: "Neden? / Neyden?" } } },
    "Soru: Amma": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "💬", arText: "عَمَّ / عَمَّا", trText: "Ne hakkında?" } } },
    "Soru: Limen": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "👤", arText: "لِمَنْ", trText: "Kimin? / Kimin için?" } } },
    "Soru: Mea men": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "👥", arText: "مَعَ مَنْ", trText: "Kiminle?" } } },
    "Soru: Bikem": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "💰", arText: "بِكَمْ", trText: "Kaça? / Ne kadara?" } } },
    "Soru: Fi Eyyi": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "📦", arText: "فِي أَيِّ", trText: "Hangi ...de / Hangi ...da?" } } },


    // --- Harf-i Cerler ---
    "Harficer: Min": { isDictOnly: true, tip: "harficer", hasZamirCekimi: true, tekil: { base: { emoji: "📤", arText: "مِنْ", trText: "-den / -dan (Ayrılma)" } } },
    "Harficer: İla": { isDictOnly: true, tip: "harficer", hasZamirCekimi: true, tekil: { base: { emoji: "➡️", arText: "إِلَى", trText: "-e / -a (Yönelme)" } } },
    "Harficer: Fi": { isDictOnly: true, tip: "harficer", hasZamirCekimi: true, tekil: { base: { emoji: "📥", arText: "فِي", trText: "-de / -da (İçinde bulunma)" } } },
    "Harficer: An": { isDictOnly: true, tip: "harficer", hasZamirCekimi: true, tekil: { base: { emoji: "⬅️", arText: "عَنْ", trText: "-den / Hakkında (Uzaklaşma)" } } },
    "Harficer: Ala": { isDictOnly: true, tip: "harficer", hasZamirCekimi: true, tekil: { base: { emoji: "⬆️", arText: "عَلَى", trText: "Üzerine / Üzerinde" } } },
    "Harficer: Li": { isDictOnly: true, tip: "harficer", hasZamirCekimi: true, tekil: { base: { emoji: "🏷️", arText: "لِ", trText: "İçin / Ait" } } },
    "Harficer: Bi": { isDictOnly: true, tip: "harficer", hasZamirCekimi: true, tekil: { base: { emoji: "🤝", arText: "بِ", trText: "İle / Birlikte" } } },
    "Harficer: Ke": { isDictOnly: true, tip: "harficer", hasZamirCekimi: true, tekil: { base: { emoji: "👯", arText: "كَ", trText: "Gibi (Benzetme)" } } },
    "Harficer: Hatta": { isDictOnly: true, tip: "harficer", tekil: { base: { emoji: "🛑", arText: "حَتَّى", trText: "-e kadar (Sınır/Gaye)" } } },
    "Harficer: Kasem": { isDictOnly: true, tip: "harficer", tekil: { base: { emoji: "✋", arText: "وَ / تَ / بِ", trText: "Yemin harfleri (Vallahi vb.)" } } },


    // =================================================================================================
    // ZAMİRLER (Kişi, İşaret, İsmi Mevsul)
    // =================================================================================================
    
    // --- Kişi Zamirleri ---
    "Zamir: Ben": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👤", arText: "أَنَا", trText: "Ben" } } },
    "Zamir: Biz": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👥", arText: "نَحْنُ", trText: "Biz" } } },
    "Zamir: Sen (E)": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👨", arText: "أَنْتَ", trText: "Sen (Eril)" } } },
    "Zamir: Sen (D)": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👩", arText: "أَنْتِ", trText: "Sen (Dişil)" } } },
    "Zamir: Siz İkiniz": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "🧑‍🤝‍🧑", arText: "أَنْتُمَا", trText: "Siz İkiniz" } } },
    "Zamir: Sizler (E)": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👨‍👨‍👦", arText: "أَنْتُمْ", trText: "Sizler (Eril)" } } },
    "Zamir: Sizler (D)": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👩‍👩‍👧", arText: "أَنْتُنَّ", trText: "Sizler (Dişil)" } } },
    "Zamir: O (E)": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👉👨", arText: "هُوَ", trText: "O (Eril)" } } },
    "Zamir: O (D)": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👉👩", arText: "هِيَ", trText: "O (Dişil)" } } },
    "Zamir: O İkisi": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👉🧑‍🤝‍🧑", arText: "هُمَا", trText: "O İkisi" } } },
    "Zamir: Onlar (E)": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👉👨‍👨‍👦", arText: "هُمْ", trText: "Onlar (Eril)" } } },
    "Zamir: Onlar (D)": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👉👩‍👩‍👧", arText: "هُنَّ", trText: "Onlar (Dişil)" } } },

    // --- İşaret Zamirleri ---
    "İşaret: Bu (E)": { isDictOnly: true, tip: "isaret", tekil: { base: { emoji: "👇", arText: "هَذَا", trText: "Bu (Eril)" } } },
    "İşaret: Bu (D)": { isDictOnly: true, tip: "isaret", tekil: { base: { emoji: "👇", arText: "هَذِهِ", trText: "Bu (Dişil)" } } },
    "İşaret: Bu İkisi (E)": { isDictOnly: true, tip: "isaret", tekil: { base: { emoji: "👇👇", arText: "هَذَانِ", trText: "Bu İkisi (Eril)" } } },
    "İşaret: Bu İkisi (D)": { isDictOnly: true, tip: "isaret", tekil: { base: { emoji: "👇👇", arText: "هَاتَانِ", trText: "Bu İkisi (Dişil)" } } },
    "İşaret: Bunlar": { isDictOnly: true, tip: "isaret", tekil: { base: { emoji: "👇👇👇", arText: "هَؤُلَاءِ", trText: "Bunlar (Ortak)" } } },
    "İşaret: Şu/O (E)": { isDictOnly: true, tip: "isaret", tekil: { base: { emoji: "👉", arText: "ذَلِكَ", trText: "Şu / O (Eril)" } } },
    "İşaret: Şu/O (D)": { isDictOnly: true, tip: "isaret", tekil: { base: { emoji: "👉", arText: "تِلْكَ", trText: "Şu / O (Dişil)" } } },
    "İşaret: Şunlar/Onlar": { isDictOnly: true, tip: "isaret", tekil: { base: { emoji: "👉👉👉", arText: "أُولَئِكَ", trText: "Şunlar / Onlar (Ortak)" } } },

    // --- İsmi Mevsuller (Bağlaç Zamirleri) ---
    "Mevsul: O Kimse ki (E)": { isDictOnly: true, tip: "mevsul", tekil: { base: { emoji: "🔗", arText: "اَلَّذِي", trText: "O kimse ki (Eril / Tekil)" } } },
    "Mevsul: O Kimse ki (D)": { isDictOnly: true, tip: "mevsul", tekil: { base: { emoji: "🔗", arText: "اَلَّتِي", trText: "O kimse ki (Dişil / Tekil)" } } },
    "Mevsul: O İki Kimse ki (E)": { isDictOnly: true, tip: "mevsul", tekil: { base: { emoji: "🔗🔗", arText: "اَللَّذَانِ", trText: "O iki kimse ki (Eril / İkil)" } } },
    "Mevsul: O İki Kimse ki (D)": { isDictOnly: true, tip: "mevsul", tekil: { base: { emoji: "🔗🔗", arText: "اَللَّتَانِ", trText: "O iki kimse ki (Dişil / İkil)" } } },
    "Mevsul: O Kimseler ki (E)": { isDictOnly: true, tip: "mevsul", tekil: { base: { emoji: "🔗👥", arText: "اَلَّذِينَ", trText: "O kimseler ki (Eril / Çoğul)" } } },
    "Mevsul: O Kimseler ki (D)": { isDictOnly: true, tip: "mevsul", tekil: { base: { emoji: "🔗👥", arText: "اَللَّاتِي / اَللَّوَاتِي", trText: "O kimseler ki (Dişil / Çoğul)" } } },
    "Mevsul: Cansızlar için (Şey)": { isDictOnly: true, tip: "mevsul", tekil: { base: { emoji: "📦", arText: "مَا", trText: "O şey ki (Cansızlar/Kavramlar için)" } } },
    "Mevsul: Canlılar için (Kimse)": { isDictOnly: true, tip: "mevsul", tekil: { base: { emoji: "🧍", arText: "مَنْ", trText: "O kimse ki (Akıllılar/İnsanlar için)" } } },

    // Büyük sözlük veritabanını buraya dahil ediyoruz
    ...eski_sozlukVerileri,

    // ==================================================================
    // يَوْم KELİMESİ
    // ==================================================================
    "يَوْم": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🌍", arText: "يَوْم", trText: "Gün" }
        },
        "cogul": { 
            base: { emoji: "🌍", arText: "أَيّام", trText: "Günler" }
        }
    },

    // ==================================================================
    // KALEM KELİMESİ
    // ==================================================================
    "قلم": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🖊️", arText: "قَلَم", trText: "Kalem" }
        },
        "cogul": { 
            base: { emoji: "🖊️", arText: "أَقْلام", trText: "Kalemler" }
        }
    },

    // ==================================================================
    // DEFTER KELİMESİ
    // ==================================================================
    "دفتر": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "📓", arText: "دَفْتَر", trText: "Defter" }
        },
        "cogul": { 
            base: { emoji: "📓", arText: "دَفاتِر", trText: "Defterler" }
        }
    },

    // ==================================================================
    // OKUL KELİMESİ
    // ==================================================================
    "مدرسة": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🏫", arText: "مَدْرَسَة", trText: "Okul" }
        },
        "cogul": { 
            base: { emoji: "🏫", arText: "مَدارِس", trText: "Okullar" }
        }
    },

    // ==================================================================
    // EV KELİMESİ
    // ==================================================================
    "بيت": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🏠", arText: "بَيْت", trText: "Ev" }
        },
        "cogul": { 
            base: { emoji: "🏠", arText: "بُيوت", trText: "Evler" }
        }
    },

    // ==================================================================
    // KAPI KELİMESİ
    // ==================================================================
    "باب": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🚪", arText: "باب", trText: "Kapı" }
        },
        "cogul": { 
            base: { emoji: "🚪", arText: "أَبْواب", trText: "Kapılar" }
        }
    },

    // ==================================================================
    // PENCERE KELİMESİ
    // ==================================================================
    "نافذة": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🪟", arText: "نافِذَة", trText: "Pencere" }
        },
        "cogul": { 
            base: { emoji: "🪟", arText: "نَوافِذ", trText: "Pencereler" }
        }
    },

    // ==================================================================
    // ODA KELİMESİ
    // ==================================================================
    "غرفة": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🛋️", arText: "غُرْفَة", trText: "Oda" }
        },
        "cogul": { 
            base: { emoji: "🛋️", arText: "غُرَف", trText: "Odalar" }
        }
    },

    // ==================================================================
    // ARABA KELİMESİ
    // ==================================================================
    "سيارة": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🚗", arText: "سَيّارَة", trText: "Araba" }
        },
        "cogul": { 
            base: { emoji: "🚗", arText: "سَيّارات", trText: "Arabalar" }
        }
    },

    // ==================================================================
    // SOKAK KELİMESİ
    // ==================================================================
    "شارع": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🛣️", arText: "شارِع", trText: "Sokak" }
        },
        "cogul": { 
            base: { emoji: "🛣️", arText: "شَوارِع", trText: "Sokaklar" }
        }
    },

    // ==================================================================
    // ŞEHIR KELİMESİ
    // ==================================================================
    "مدينة": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🏙️", arText: "مَدينَة", trText: "Şehir" }
        },
        "cogul": { 
            base: { emoji: "🏙️", arText: "مُدُن", trText: "Şehirler" }
        }
    },

    // ==================================================================
    // KÖY KELİMESİ
    // ==================================================================
    "قرية": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🏘️", arText: "قَرْيَة", trText: "Köy" }
        },
        "cogul": { 
            base: { emoji: "🏘️", arText: "قُرًى", trText: "Köyler" }
        }
    },

    // ==================================================================
    // ÜLKE KELİMESİ
    // ==================================================================
    "بلد": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🗺️", arText: "بَلَد", trText: "Ülke" }
        },
        "cogul": { 
            base: { emoji: "🗺️", arText: "بِلاد", trText: "Ülkeler" }
        }
    },

    // ==================================================================
    // DENIZ KELİMESİ
    // ==================================================================
    "بحر": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🌊", arText: "بَحْر", trText: "Deniz" }
        },
        "cogul": { 
            base: { emoji: "🌊", arText: "بِحار", trText: "Denizler" }
        }
    },

    // ==================================================================
    // DAĞ KELİMESİ
    // ==================================================================
    "جبل": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "⛰️", arText: "جَبَل", trText: "Dağ" }
        },
        "cogul": { 
            base: { emoji: "⛰️", arText: "جِبال", trText: "Dağlar" }
        }
    },

    // ==================================================================
    // AĞAÇ KELİMESİ
    // ==================================================================
    "شجرة": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🌳", arText: "شَجَرَة", trText: "Ağaç" }
        },
        "cogul": { 
            base: { emoji: "🌳", arText: "أَشْجار", trText: "Ağaçlar" }
        }
    },

    // ==================================================================
    // ÇIÇEK KELİMESİ
    // ==================================================================
    "زهرة": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🌸", arText: "زَهْرَة", trText: "Çiçek" }
        },
        "cogul": { 
            base: { emoji: "🌸", arText: "أَزْهار", trText: "Çiçekler" }
        }
    },

    // ==================================================================
    // HAYVAN KELİMESİ
    // ==================================================================
    "حيوان": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🐾", arText: "حَيَوان", trText: "Hayvan" }
        },
        "cogul": { 
            base: { emoji: "🐾", arText: "حَيَوانات", trText: "Hayvanlar" }
        }
    },

    // ==================================================================
    // KUŞ KELİMESİ
    // ==================================================================
    "طائر": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🐦", arText: "طائِر", trText: "Kuş" }
        },
        "cogul": { 
            base: { emoji: "🐦", arText: "طُيور", trText: "Kuşlar" }
        }
    },

    // ==================================================================
    // BALIK KELİMESİ
    // ==================================================================
    "سمكة": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🐟", arText: "سَمَكَة", trText: "Balık" }
        },
        "cogul": { 
            base: { emoji: "🐟", arText: "أَسْماك", trText: "Balıklar" }
        }
    },

    // ==================================================================
    // KÖPEK KELİMESİ
    // ==================================================================
    "كلب": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🐕", arText: "كَلْب", trText: "Köpek" }
        },
        "cogul": { 
            base: { emoji: "🐕", arText: "كِلاب", trText: "Köpekler" }
        }
    },

    // ==================================================================
    // KEDI KELİMESİ
    // ==================================================================
    "قطة": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🐈", arText: "قِطَّة", trText: "Kedi" }
        },
        "cogul": { 
            base: { emoji: "🐈", arText: "قِطَط", trText: "Kediler" }
        }
    },

    // ==================================================================
    // AT KELİMESİ
    // ==================================================================
    "حصان": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🐎", arText: "حِصان", trText: "At" }
        },
        "cogul": { 
            base: { emoji: "🐎", arText: "أَحْصِنَة", trText: "Atlar" }
        }
    },

    // ==================================================================
    // ÇOCUK (OĞLAN) KELİMESİ
    // ==================================================================
    "ولد": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "👦", arText: "وَلَد", trText: "Çocuk (Oğlan)" }
        },
        "cogul": { 
            base: { emoji: "👦", arText: "أَوْلاد", trText: "Çocuklar" }
        }
    },

    // ==================================================================
    // KIZ KELİMESİ
    // ==================================================================
    "بنت": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "👧", arText: "بِنْت", trText: "Kız" }
        },
        "cogul": { 
            base: { emoji: "👧", arText: "بَنات", trText: "Kızlar" }
        }
    },

    // ==================================================================
    // ADAM KELİMESİ
    // ==================================================================
    "رجل": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "👨", arText: "رَجُل", trText: "Adam" }
        },
        "cogul": { 
            base: { emoji: "👨", arText: "رِجال", trText: "Adamlar" }
        }
    },

    // ==================================================================
    // KADIN KELİMESİ
    // ==================================================================
    "امرأة": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "👩", arText: "اِمْرَأَة", trText: "Kadın" }
        },
        "cogul": { 
            base: { emoji: "👩", arText: "نِساء", trText: "Kadınlar" }
        }
    },

    // ==================================================================
    // GÖZ KELİMESİ
    // ==================================================================
    "عين": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "👁️", arText: "عَيْن", trText: "Göz" }
        },
        "cogul": { 
            base: { emoji: "👁️", arText: "عُيون", trText: "Gözler" }
        }
    },

    // ==================================================================
    // KULAK KELİMESİ
    // ==================================================================
    "أذن": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "👂", arText: "أُذُن", trText: "Kulak" }
        },
        "cogul": { 
            base: { emoji: "👂", arText: "آذان", trText: "Kulaklar" }
        }
    },

    // ==================================================================
    // EL KELİMESİ
    // ==================================================================
    "يد": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "✋", arText: "يَد", trText: "El" }
        },
        "cogul": { 
            base: { emoji: "✋", arText: "أَيْدٍ", trText: "Eller" }
        }
    },

    // ==================================================================
    // AYAK KELİMESİ
    // ==================================================================
    "قدم": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🦶", arText: "قَدَم", trText: "Ayak" }
        },
        "cogul": { 
            base: { emoji: "🦶", arText: "أَقْدام", trText: "Ayaklar" }
        }
    },

    // ==================================================================
    // KALP KELİMESİ
    // ==================================================================
    "قلب": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "❤️", arText: "قَلْب", trText: "Kalp" }
        },
        "cogul": { 
            base: { emoji: "❤️", arText: "قُلوب", trText: "Kalpler" }
        }
    },

    // ==================================================================
    // BAŞ KELİMESİ
    // ==================================================================
    "رأس": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "👤", arText: "رَأْس", trText: "Baş" }
        },
        "cogul": { 
            base: { emoji: "👤", arText: "رُؤوس", trText: "Başlar" }
        }
    },

    // ==================================================================
    // AY KELİMESİ
    // ==================================================================
    "قمر": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🌙", arText: "قَمَر", trText: "Ay" }
        },
        "cogul": { 
            base: { emoji: "🌙", arText: "أَقْمار", trText: "Aylar" }
        }
    },

    // ==================================================================
    // GÜNEŞ KELİMESİ
    // ==================================================================
    "شمس": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "☀️", arText: "شَمْس", trText: "Güneş" }
        },
        "cogul": { 
            base: { emoji: "☀️", arText: "شُموس", trText: "Güneşler" }
        }
    },

    // ==================================================================
    // YILDIZ KELİMESİ
    // ==================================================================
    "نجم": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "⭐", arText: "نَجْم", trText: "Yıldız" }
        },
        "cogul": { 
            base: { emoji: "⭐", arText: "نُجوم", trText: "Yıldızlar" }
        }
    },

    // ==================================================================
    // GÖKYÜZÜ KELİMESİ
    // ==================================================================
    "سماء": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🌌", arText: "سَماء", trText: "Gökyüzü" }
        },
        "cogul": { 
            base: { emoji: "🌌", arText: "سَماوات", trText: "Gökyüzleri" }
        }
    },

    // ==================================================================
    // YER/TOPRAK KELİMESİ
    // ==================================================================
    "أرض": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🌍", arText: "أَرْض", trText: "Yer/Toprak" }
        },
        "cogul": { 
            base: { emoji: "🌍", arText: "أَراضٍ", trText: "Yerler/Topraklar" }
        }
    },

    // ==================================================================
    // SU KELİMESİ
    // ==================================================================
    "ماء": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "💧", arText: "ماء", trText: "Su" }
        },
        "cogul": { 
            base: { emoji: "💧", arText: "مِياه", trText: "Sular" }
        }
    },

    // ==================================================================
    // ATEŞ KELİMESİ
    // ==================================================================
    "نار": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🔥", arText: "نار", trText: "Ateş" }
        },
        "cogul": { 
            base: { emoji: "🔥", arText: "نيران", trText: "Ateşler" }
        }
    },

    // ==================================================================
    // EKMEK KELİMESİ
    // ==================================================================
    "خبز": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🍞", arText: "خُبْز", trText: "Ekmek" }
        },
        "cogul": { 
            base: { emoji: "🍞", arText: "أَخْباز", trText: "Ekmekler" }
        }
    },

    // ==================================================================
    // ET KELİMESİ
    // ==================================================================
    "لحم": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "🥩", arText: "لَحْم", trText: "Et" }
        },
        "cogul": { 
            base: { emoji: "🥩", arText: "لُحوم", trText: "Etler" }
        }
    },

    // ==================================================================
    // ELBISE KELİMESİ
    // ==================================================================
    "لباس": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "👗", arText: "لِباس", trText: "Elbise" }
        },
        "cogul": { 
            base: { emoji: "👗", arText: "مَلابِس", trText: "Elbiseler" }
        }
    },

    // ==================================================================
    // AYAKKABI KELİMESİ
    // ==================================================================
    "حذاء": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "👞", arText: "حِذاء", trText: "Ayakkabı" }
        },
        "cogul": { 
            base: { emoji: "👞", arText: "أَحْذِيَة", trText: "Ayakkabılar" }
        }
    },

    // ==================================================================
    // ÇANTA KELİMESİ
    // ==================================================================
    "حقيبة": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "👜", arText: "حَقيبَة", trText: "Çanta" }
        },
        "cogul": { 
            base: { emoji: "👜", arText: "حَقائِب", trText: "Çantalar" }
        }
    },

    // ==================================================================
    // SAAT KELİMESİ
    // ==================================================================
    "ساعة": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "⌚", arText: "ساعَة", trText: "Saat" }
        },
        "cogul": { 
            base: { emoji: "⌚", arText: "ساعات", trText: "Saatler" }
        }
    },

    // ==================================================================
    // TELEFON KELİMESİ
    // ==================================================================
    "هاتف": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "📱", arText: "هاتِف", trText: "Telefon" }
        },
        "cogul": { 
            base: { emoji: "📱", arText: "هَواتِف", trText: "Telefonlar" }
        }
    },

    // ==================================================================
    // BILGISAYAR KELİMESİ
    // ==================================================================
    "حاسوب": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "💻", arText: "حاسوب", trText: "Bilgisayar" }
        },
        "cogul": { 
            base: { emoji: "💻", arText: "حَواسيب", trText: "Bilgisayarlar" }
        }
    },

    // ==================================================================
    
    // =================================================================================================
    // AI_PROMPT: RENKLER İÇİN YÖNERGE (Sistemin Otomatik Kılavuzu)
    // 1. Yeni bir renk eklendiğinde `isDictOnly: true` ve `tip: "renk"` kullanılmalıdır.
    // 2. Renkler Müzekker ve Müennes formda gelir. Müzekker arText içine, Müennes ise muennes içine yazılır.
    // 3. Yapı: { base: { emoji: "🎨", arText: "أَحْمَر", trText: "Kırmızı", muennes: "حَمْرَاء", ornek: { ar: "...", tr: "..." } } }
    // =================================================================================================
        "Sayı: 0": {
        isDictOnly: true,
        tip: "sayi",
        tekil: { base: { emoji: "٠", arText: "صِفْر", trText: "Sıfır" } }
    },
    "Sayı: 1": {
        isDictOnly: true,
        tip: "sayi",
        tekil: { base: { emoji: "١", arText: "وَاحِد", trText: "Bir", muennes: "وَاحِدَة" } }
    },
    "Sayı: 2": {
        isDictOnly: true,
        tip: "sayi",
        tekil: { base: { emoji: "٢", arText: "اِثْنَان", trText: "İki", muennes: "اِثْنَتَان" } }
    },
    "Sayı: 3": {
        isDictOnly: true,
        tip: "sayi",
        tekil: { base: { emoji: "٣", arText: "ثَلَاثَة", trText: "Üç", muennes: "ثَلَاث" } }
    },
    "Sayı: 4": {
        isDictOnly: true,
        tip: "sayi",
        tekil: { base: { emoji: "٤", arText: "أَرْبَعَة", trText: "Dört", muennes: "أَرْبَع" } }
    },
    "Sayı: 5": {
        isDictOnly: true,
        tip: "sayi",
        tekil: { base: { emoji: "٥", arText: "خَمْسَة", trText: "Beş", muennes: "خَمْس" } }
    },
    "Sayı: 6": {
        isDictOnly: true,
        tip: "sayi",
        tekil: { base: { emoji: "٦", arText: "سِتَّة", trText: "Altı", muennes: "سِتّ" } }
    },
    "Sayı: 7": {
        isDictOnly: true,
        tip: "sayi",
        tekil: { base: { emoji: "٧", arText: "سَبْعَة", trText: "Yedi", muennes: "سَبْع" } }
    },
    "Sayı: 8": {
        isDictOnly: true,
        tip: "sayi",
        tekil: { base: { emoji: "٨", arText: "ثَمَانِيَة", trText: "Sekiz", muennes: "ثَمَانٍ" } }
    },
    "Sayı: 9": {
        isDictOnly: true,
        tip: "sayi",
        tekil: { base: { emoji: "٩", arText: "تِسْعَة", trText: "Dokuz", muennes: "تِسْع" } }
    },
    "Sayı: 10": {
        isDictOnly: true,
        tip: "sayi",
        tekil: { base: { emoji: "١٠", arText: "عَشَرَة", trText: "On", muennes: "عَشْر" } }
    },
    "Sayı: 11": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١١", "arText": "أَحَدَ عَشَرَ", "trText": "On Bir", "muennes": "إِحْدَى عَشْرَةَ" } } },
    "Sayı: 12": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٢", "arText": "اِثْنَا عَشَرَ", "trText": "On İki", "muennes": "اِثْنَتَا عَشْرَةَ" } } },
    "Sayı: 13": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٣", "arText": "ثَلَاثَةَ عَشَرَ", "trText": "On Üç", "muennes": "ثَلَاثَ عَشْرَةَ" } } },
    "Sayı: 14": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٤", "arText": "أَرْبَعَةَ عَشَرَ", "trText": "On Dört", "muennes": "أَرْبَعَ عَشْرَةَ" } } },
    "Sayı: 15": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٥", "arText": "خَمْسَةَ عَشَرَ", "trText": "On Beş", "muennes": "خَمْسَ عَشْرَةَ" } } },
    "Sayı: 16": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٦", "arText": "سِتَّةَ عَشَرَ", "trText": "On Altı", "muennes": "سِتَّ عَشْرَةَ" } } },
    "Sayı: 17": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٧", "arText": "سَبْعَةَ عَشَرَ", "trText": "On Yedi", "muennes": "سَبْعَ عَشْرَةَ" } } },
    "Sayı: 18": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٨", "arText": "ثَمَانِيَةَ عَشَرَ", "trText": "On Sekiz", "muennes": "ثَمَانِيَ عَشْرَةَ" } } },
    "Sayı: 19": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٩", "arText": "تِسْعَةَ عَشَرَ", "trText": "On Dokuz", "muennes": "تِسْعَ عَشْرَةَ" } } },
    "Sayı: 20": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٢٠", "arText": "عِشْرُونَ", "trText": "Yirmi" } } },
    "Sayı: 30": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٣٠", "arText": "ثَلَاثُونَ", "trText": "Otuz" } } },
    "Sayı: 40": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٤٠", "arText": "أَرْبَعُونَ", "trText": "Kırk" } } },
    "Sayı: 50": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٥٠", "arText": "خَمْسُونَ", "trText": "Elli" } } },
    "Sayı: 60": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٦٠", "arText": "سِتُّونَ", "trText": "Altmış" } } },
    "Sayı: 70": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٧٠", "arText": "سَبْعُونَ", "trText": "Yetmiş" } } },
    "Sayı: 80": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٨٠", "arText": "ثَمَانُونَ", "trText": "Seksen" } } },
    "Sayı: 90": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٩٠", "arText": "تِسْعُونَ", "trText": "Doksan" } } },
    "Sayı: 100": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٠٠", "arText": "مِائَة", "trText": "Yüz" } } },
    "Sayı: 1,000": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٠٠٠", "arText": "أَلْف", "trText": "Bin" } } },
    "Sayı: 10,000": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٠٠٠٠", "arText": "عَشَرَةُ آلَافٍ", "trText": "On Bin" } } },
    "Sayı: 100,000": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٠٠٠٠٠", "arText": "مِائَةُ أَلْفٍ", "trText": "Yüz Bin" } } },
    "Sayı: 1,000,000": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٠٠٠٠٠٠", "arText": "مِلْيُون", "trText": "Bir Milyon" } } },
    "Sayı: 1,000,000,000": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٠٠٠٠٠٠٠٠٠", "arText": "مِلْيَار", "trText": "Bir Milyar" } } },
    
    "Sıra: 1.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١.", "arText": "الْأَوَّل", "trText": "1. Birinci", "muennes": "الْأُولَى" } } },
    "Sıra: 2.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٢.", "arText": "الثَّانِي", "trText": "2. İkinci", "muennes": "الثَّانِيَة" } } },
    "Sıra: 3.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٣.", "arText": "الثَّالِث", "trText": "3. Üçüncü", "muennes": "الثَّالِثَة" } } },
    "Sıra: 4.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٤.", "arText": "الرَّابِع", "trText": "4. Dördüncü", "muennes": "الرَّابِعَة" } } },
    "Sıra: 5.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٥.", "arText": "الْخَامِس", "trText": "5. Beşinci", "muennes": "الْخَامِسَة" } } },
    "Sıra: 6.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٦.", "arText": "السَّادِس", "trText": "6. Altıncı", "muennes": "السَّادِسَة" } } },
    "Sıra: 7.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٧.", "arText": "السَّابِع", "trText": "7. Yedinci", "muennes": "السَّابِعَة" } } },
    "Sıra: 8.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٨.", "arText": "الثَّامِن", "trText": "8. Sekizinci", "muennes": "الثَّامِنَة" } } },
    "Sıra: 9.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٩.", "arText": "التَّاسِع", "trText": "9. Dokuzuncu", "muennes": "التَّاسِعَة" } } },
    "Sıra: 10.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٠.", "arText": "الْعَاشِر", "trText": "10. Onuncu", "muennes": "الْعَاشِرَة" } } },
    "Sıra: 11.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١١.", "arText": "الْحَادِيَ عَشَرَ", "trText": "11. On Birinci", "muennes": "الْحَادِيَةَ عَشْرَةَ" } } },
    "Sıra: 12.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٢.", "arText": "الثَّانِيَ عَشَرَ", "trText": "12. On İkinci", "muennes": "الثَّانِيَةَ عَشْرَةَ" } } },
    "Sıra: 13.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٣.", "arText": "الثَّالِثَ عَشَرَ", "trText": "13. On Üçüncü", "muennes": "الثَّالِثَةَ عَشْرَةَ" } } },
    "Sıra: 14.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٤.", "arText": "الرَّابِعَ عَشَرَ", "trText": "14. On Dördüncü", "muennes": "الرَّابِعَةَ عَشْرَةَ" } } },
    "Sıra: 15.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٥.", "arText": "الْخَامِسَ عَشَرَ", "trText": "15. On Beşinci", "muennes": "الْخَامِسَةَ عَشْرَةَ" } } },
    "Sıra: 16.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٦.", "arText": "السَّادِسَ عَشَرَ", "trText": "16. On Altıncı", "muennes": "السَّادِسَةَ عَشْرَةَ" } } },
    "Sıra: 17.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٧.", "arText": "السَّابِعَ عَشَرَ", "trText": "17. On Yedinci", "muennes": "السَّابِعَةَ عَشْرَةَ" } } },
    "Sıra: 18.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٨.", "arText": "الثَّامِنَ عَشَرَ", "trText": "18. On Sekizinci", "muennes": "الثَّامِنَةَ عَشْرَةَ" } } },
    "Sıra: 19.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "١٩.", "arText": "التَّاسِعَ عَشَرَ", "trText": "19. On Dokuzuncu", "muennes": "التَّاسِعَةَ عَشْرَةَ" } } },
    "Sıra: 20.": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "٢٠.", "arText": "الْعِشْرُونَ", "trText": "20. Yirminci" } } },

    "Renk: Kırmızı": {
        isDictOnly: true,
        tip: "renk",
        tekil: { base: { emoji: "🔴", arText: "أَحْمَر", trText: "Kırmızı", muennes: "حَمْرَاء" } }
    },
    "Renk: Siyah": {
        isDictOnly: true,
        tip: "renk",
        tekil: { base: { emoji: "⚫", arText: "أَسْوَد", trText: "Siyah", muennes: "سَوْدَاء" } }
    },
    "Renk: Beyaz": {
        isDictOnly: true,
        tip: "renk",
        tekil: { base: { emoji: "⚪", arText: "أَبْيَض", trText: "Beyaz", muennes: "بَيْضَاء" } }
    },
    "Renk: Yeşil": {
        isDictOnly: true,
        tip: "renk",
        tekil: { base: { emoji: "🟢", arText: "أَخْضَر", trText: "Yeşil", muennes: "خَضْرَاء" } }
    },
    "Renk: Mavi": {
        isDictOnly: true,
        tip: "renk",
        tekil: { base: { emoji: "🔵", arText: "أَزْرَق", trText: "Mavi", muennes: "زَرْقَاء" } }
    },
    "Renk: Sarı": {
        isDictOnly: true,
        tip: "renk",
        tekil: { base: { emoji: "🟡", arText: "أَصْفَر", trText: "Sarı", muennes: "صَفْرَاء" } }
    },

    // AI_PROMPT: HAFTANIN GÜNLERİ, SAYILAR, İSM-İ TASGİR, İSM-İ TAFDİL İÇİN YÖNERGE
    // Haftanın günleri için: tip: "gun" (Örn: "Pazartesi": { isDictOnly: true, tip: "gun", tekil: { ... } })
    // Sayılar için: tip: "sayi" (Örn: "Sayı 1": { isDictOnly: true, tip: "sayi", tekil: { ... } })
    // İsm-i Tasgir için: tip: "tasgir", İsm-i Tafdil için: tip: "tafdil" kullanılmalıdır.

    // HAFTANIN GÜNLERİ (أيام الأسبوع)
    // ==================================================================
    "أحد": {
        "isDictOnly": true,
        "tip": "gun",
        "tekil": { base: { emoji: "🌞", arText: "الْأَحَد", trText: "Pazar (Haftanın 1. günü)." } }
    },
    "اثنين": {
        "isDictOnly": true,
        "tip": "gun",
        "tekil": { base: { emoji: "🌙", arText: "الِاثْنَيْن", trText: "Pazartesi (Haftanın 2. günü)." } }
    },
    "ثلاثاء": {
        "isDictOnly": true,
        "tip": "gun",
        "tekil": { base: { emoji: "🔥", arText: "الثُّلَاثَاء", trText: "Salı (Haftanın 3. günü)." } }
    },
    "أربعاء": {
        "isDictOnly": true,
        "tip": "gun",
        "tekil": { base: { emoji: "💧", arText: "الْأَرْبِعَاء", trText: "Çarşamba (Haftanın 4. günü)." } }
    },
    "خميس": {
        "isDictOnly": true,
        "tip": "gun",
        "tekil": { base: { emoji: "🌳", arText: "الْخَمِيس", trText: "Perşembe (Haftanın 5. günü)." } }
    },
    "جمعة": {
        "isDictOnly": true,
        "tip": "gun",
        "tekil": { base: { emoji: "🕌", arText: "الْجُمُعَة", trText: "Cuma (Toplanma günü)." } }
    },
    "سبت": {
        "isDictOnly": true,
        "tip": "gun",
        "tekil": { base: { emoji: "🛑", arText: "السَّبْت", trText: "Cumartesi (Dinlenme/Tatil günü)." } }
    },

    // ==================================================================
    // İSM-İ TAFDİL & İSM-İ TASGİR ÖRNEKLERİ (İSİM KÖKENLİ)
    // ==================================================================
    "أكبر": {
        "isDictOnly": true,
        "tip": "tafdil",
        "tekil": { base: { emoji: "🐘", arText: "أَكْبَر", trText: "En büyük / Daha büyük (İsm-i Tafdil)." } }
    },
    "أصغر": {
        "isDictOnly": true,
        "tip": "tafdil",
        "tekil": { base: { emoji: "🐜", arText: "أَصْغَر", trText: "En küçük / Daha küçük (İsm-i Tafdil)." } }
    },
    "كتيب": {
        "isDictOnly": true,
        "tip": "tasgir",
        "tekil": { base: { emoji: "📓", arText: "كُتَيِّب", trText: "Kitapçık (İsm-i Tasgir)." } },
        "cogul": { base: { emoji: "📚", arText: "كُتَيِّبَات", trText: "Kitapçıklar." } }
    },
    "رجيل": {
        "isDictOnly": true,
        "tip": "tasgir",
        "tekil": { base: { emoji: "🧍‍♂️", arText: "رُجَيْل", trText: "Adamcağız (İsm-i Tasgir)." } }
    },

    // --- MEYVELER ---
    "Meyve: Elma": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍎", arText: "تُفَّاح", trText: "Elma", ornek: { ar: "أَكَلْتُ تُفَّاحَةً", tr: "Bir elma yedim." } } } },
    "Meyve: Portakal": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍊", arText: "بُرْتُقَال", trText: "Portakal", ornek: { ar: "عَصِيرُ الْبُرْتُقَالِ", tr: "Portakal suyu." } } } },
    "Meyve: Muz": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍌", arText: "مَوْز", trText: "Muz" } } },
    "Meyve: Üzüm": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍇", arText: "عِنَب", trText: "Üzüm" } } },
    "Meyve: Çilek": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍓", arText: "فَرَاوِلَة", trText: "Çilek" } } },
    "Meyve: Karpuz": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍉", arText: "بِطِّيخ", trText: "Karpuz" } } },
    "Meyve: Kavun": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍈", arText: "شَمَّام", trText: "Kavun" } } },
    "Meyve: Nar": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🏺", arText: "رُمَّان", trText: "Nar" } } },
    "Meyve: İncir": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍃", arText: "تِين", trText: "İncir" } } },
    "Meyve: Kiraz": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍒", arText: "كَرَز", trText: "Kiraz" } } },
    "Meyve: Limon": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍋", arText: "لَيْمُون", trText: "Limon" } } },
    "Meyve: Şeftali": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍑", arText: "خَوْخ", trText: "Şeftali" } } },

    // --- SEBZELER ---
    "Sebze: Domates": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🍅", arText: "طَمَاطِم", trText: "Domates" } } },
    "Sebze: Salatalık": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🥒", arText: "خِيَار", trText: "Salatalık" } } },
    "Sebze: Soğan": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🧅", arText: "بَصَل", trText: "Soğan" } } },
    "Sebze: Sarımsak": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🧄", arText: "ثُوم", trText: "Sarımsak" } } },
    "Sebze: Patates": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🥔", arText: "بَطَاطِس", trText: "Patates" } } },
    "Sebze: Havuç": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🥕", arText: "جَزَر", trText: "Havuç" } } },
    "Sebze: Patlıcan": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🍆", arText: "بَاذِنْجَان", trText: "Patlıcan" } } },
    "Sebze: Biber": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🌶️", arText: "فُلْفُل", trText: "Biber" } } },
    "Sebze: Kabak": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🥒", arText: "كُوسَا", trText: "Kabak" } } },
    "Sebze: Marul": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🥬", arText: "خَسّ", trText: "Marul" } } },

    "Meslek: Mühendis": { isDictOnly: true, tip: "meslek", tekil: { base: { emoji: "👷", arText: "مُهَنْدِس", trText: "Mühendis" } }, cogul: { base: { emoji: "👷‍♂️", arText: "مُهَنْدِسُونَ", trText: "Mühendisler" } } },
    "Meslek: Kasap": { isDictOnly: true, tip: "meslek", tekil: { base: { emoji: "🥩", arText: "جَزَّار", trText: "Kasap" } }, cogul: { base: { emoji: "🥩", arText: "جَزَّارُونَ", trText: "Kasaplar" } } },
    "Meslek: Bakkal": { isDictOnly: true, tip: "meslek", tekil: { base: { emoji: "🏪", arText: "بَقَّال", trText: "Bakkal" } }, cogul: { base: { emoji: "🏪", arText: "بَقَّالُونَ", trText: "Bakkallar" } } },
    "Meslek: Terzi": { isDictOnly: true, tip: "meslek", tekil: { base: { emoji: "🧵", arText: "خَيَّاط", trText: "Terzi" } }, cogul: { base: { emoji: "🧵", arText: "خَيَّاطُونَ", trText: "Terziler" } } },
    "Sebze: Mısır": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🌽", arText: "ذُرَة", trText: "Mısır" } } },


    // --- YİYECEKLER ---
    "Yiyecek: Ekmek": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🍞", arText: "خُبْز", trText: "Ekmek", ornek: { ar: "خُبْزٌ طَازَجٌ", tr: "Taze ekmek." } } } },
    "Yiyecek: Et": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🥩", arText: "لَحْم", trText: "Et", ornek: { ar: "أَكَلْتُ اللَّحْمَ", tr: "Et yedim." } } } },
    "Yiyecek: Tavuk": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🍗", arText: "دَجَاج", trText: "Tavuk" } } },
    "Yiyecek: Balık": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🐟", arText: "سَمَك", trText: "Balık" } } },
    "Yiyecek: Peynir": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🧀", arText: "جُبْن", trText: "Peynir" } } },
    "Yiyecek: Yumurta": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🥚", arText: "بَيْض", trText: "Yumurta" } } },
    "Yiyecek: Yoğurt": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🥣", arText: "زَبَادِي", trText: "Yoğurt (Leben Zebâdî)" } } },
    "Yiyecek: Tereyağı": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🧈", arText: "زُبْدَة", trText: "Tereyağı" } } },
    "Yiyecek: Zeytin": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🫒", arText: "زَيْتُون", trText: "Zeytin" } } },
    "Yiyecek: Zeytinyağı": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🫙", arText: "زَيْتُ زَيْتُون", trText: "Zeytinyağı" } } },
    "Yiyecek: Bal": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🍯", arText: "عَسَل", trText: "Bal" } } },
    "Yiyecek: Reçel": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🥫", arText: "مُرَبَّى", trText: "Reçel" } } },
    "Yiyecek: Çorba": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🍲", arText: "حَسَاء", trText: "Çorba / Şorba (شُورْبَة)" } } },
    "Yiyecek: Pirinç": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🍚", arText: "أَرُزّ", trText: "Pirinç" } } },
    "Yiyecek: Makarna": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🍝", arText: "مَعْكَرُونَة", trText: "Makarna" } } },
    "Yiyecek: Salata": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🥗", arText: "سَلَطَة", trText: "Salata" } } },
    "Yiyecek: Tuz": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🧂", arText: "مِلْح", trText: "Tuz" } } },
    "Yiyecek: Şeker": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🍬", arText: "سُكَّر", trText: "Şeker" } } },
    "Yiyecek: Un": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🌾", arText: "دَقِيق", trText: "Un / Tahin (طَحِين)" } } },
    "Yiyecek: Tatlı": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🍮", arText: "حَلْوَى", trText: "Tatlı" } } },
    "Yiyecek: Kek": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🍰", arText: "كَعْكَة", trText: "Kek / Pasta (كِيك)" } } },
    "Yiyecek: Dondurma": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🍦", arText: "مُثَلَّجَات", trText: "Dondurma" } } },
    "Yiyecek: Bisküvi": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🍪", arText: "بَسْكَوِيت", trText: "Bisküvi" } } },

    // --- İÇECEKLER ---
    "İçecek: Su": { isDictOnly: true, tip: "icecek", tekil: { base: { emoji: "💧", arText: "مَاء", trText: "Su", ornek: { ar: "شَرِبْتُ الْمَاءَ", tr: "Su içtim." } } } },
    "İçecek: Çay": { isDictOnly: true, tip: "icecek", tekil: { base: { emoji: "🍵", arText: "شَاي", trText: "Çay" } } },
    "İçecek: Kahve": { isDictOnly: true, tip: "icecek", tekil: { base: { emoji: "☕", arText: "قَهْوَة", trText: "Kahve" } } },
    "İçecek: Süt": { isDictOnly: true, tip: "icecek", tekil: { base: { emoji: "🥛", arText: "حَلِيب", trText: "Süt" } } },
    "İçecek: Meyve Suyu": { isDictOnly: true, tip: "icecek", tekil: { base: { emoji: "🧃", arText: "عَصِير", trText: "Meyve Suyu", ornek: { ar: "عَصِيرُ التُّفَّاحِ", tr: "Elma suyu." } } } }

,
    "Araba": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚗", arText: "سَيَّارَة", trText: "Araba" } } },
    "Otobüs": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚌", arText: "حَافِلَة", trText: "Otobüs" } } },
    "Kamyon": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚚", arText: "شَاحِنَة", trText: "Kamyon" } } },
    "Tren": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚂", arText: "قِطَار", trText: "Tren" } } },
    "Uçak": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "✈️", arText: "طَائِرَة", trText: "Uçak" } } },
    "Gemi": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚢", arText: "سَفِينَة", trText: "Gemi" } } },
    "Kayık": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "⛵", arText: "قَارِب", trText: "Kayık / Sandal" } } },
    "Bisiklet": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚲", arText: "دَرَّاجَة", trText: "Bisiklet" } } },
    "Motosiklet": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🏍️", arText: "دَرَّاجَة نَارِيَّة", trText: "Motosiklet" } } },
    "Helikopter": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚁", arText: "مِرْوَحِيَّة", trText: "Helikopter" } } },
    "Taksi": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚕", arText: "سَيَّارَة أُجْرَة", trText: "Taksi" } } },
    "Traktör": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚜", arText: "جَرَّار", trText: "Traktör" } } },
    "Minibüs": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚐", arText: "حَافِلَة صَغِيرَة", trText: "Minibüs" } } },
    "Ambulans": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚑", arText: "سَيَّارَة إِسْعَاف", trText: "Ambulans" } } },
    "İtfaiye": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚒", arText: "سَيَّارَة إِطْفَاء", trText: "İtfaiye Arabası" } } },
    "Polis": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚓", arText: "سَيَّارَة شُرْطَة", trText: "Polis Arabası" } } },
    "Metro": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚇", arText: "مِتْرُو", trText: "Metro" } } },
    "Tramvay": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚋", arText: "تِرَام", trText: "Tramvay" } } },
    "Teleferik": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚠", arText: "تِلِفْرِيك", trText: "Teleferik" } } },
    "Denizaltı": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚤", arText: "غَوَّاصَة", trText: "Denizaltı" } } },
    "Uzay_Mekiği": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚀", arText: "مَرْكَبَة فَضَائِيَّة", trText: "Uzay Mekiği" } } },
    "Savaş_Uçağı": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🛩️", arText: "طَائِرَة حَرْبِيَّة", trText: "Savaş Uçağı" } } },
    "Scooter": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🛴", arText: "سْكُوتَر", trText: "Scooter" } } },
    "At_Arabası": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🐎", arText: "عَرَبَة خَيْل", trText: "At Arabası" } } },
    "Vapur": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "⛴️", arText: "عَبَّارَة", trText: "Vapur" } } }
,
    "Aile: Baba": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👨", "arText": "أَب", "trText": "Baba" } }, "cogul": { "base": { "emoji": "👨", "arText": "آبَاء", "trText": "Babalar" } } },
    "Aile: Anne": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👩", "arText": "أُمّ", "trText": "Anne" } }, "cogul": { "base": { "emoji": "👩", "arText": "أُمَّهَات", "trText": "Anneler" } } },
    "Aile: Erkek Kardeş": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👦", "arText": "أَخ", "trText": "Erkek Kardeş" } }, "cogul": { "base": { "emoji": "👦", "arText": "إِخْوَة", "trText": "Kardeşler (Erkek)" } } },
    "Aile: Kız Kardeş": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👧", "arText": "أُخْت", "trText": "Kız Kardeş" } }, "cogul": { "base": { "emoji": "👧", "arText": "أَخَوَات", "trText": "Kız Kardeşler" } } },
    "Aile: Oğul": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👱‍♂️", "arText": "اِبْن", "trText": "Oğul" } }, "cogul": { "base": { "emoji": "👱‍♂️", "arText": "أَبْنَاء", "trText": "Oğullar" } } },
    "Aile: Kız Çocuk": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👱‍♀️", "arText": "بِنْت", "trText": "Kız Çocuk" } }, "cogul": { "base": { "emoji": "👱‍♀️", "arText": "بَنَات", "trText": "Kızlar" } } },
    "Aile: Dede": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👴", "arText": "جَدّ", "trText": "Dede" } }, "cogul": { "base": { "emoji": "👴", "arText": "أَجْدَاد", "trText": "Dedeler" } } },
    "Aile: Nine": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👵", "arText": "جَدَّة", "trText": "Nine / Büyükanne" } }, "cogul": { "base": { "emoji": "👵", "arText": "جَدَّات", "trText": "Nineler" } } },
    "Aile: Amca": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "🧔", "arText": "عَمّ", "trText": "Amca (Babanın Kardeşi)" } }, "cogul": { "base": { "emoji": "🧔", "arText": "أَعْمَام", "trText": "Amcalar" } } },
    "Aile: Hala": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "🧕", "arText": "عَمَّة", "trText": "Hala" } }, "cogul": { "base": { "emoji": "🧕", "arText": "عَمَّات", "trText": "Halalar" } } },
    "Aile: Dayı": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👨‍🦰", "arText": "خَال", "trText": "Dayı (Annenin Kardeşi)" } }, "cogul": { "base": { "emoji": "👨‍🦰", "arText": "أَخْوَال", "trText": "Dayılar" } } },
    "Aile: Teyze": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👩‍🦰", "arText": "خَالَة", "trText": "Teyze" } }, "cogul": { "base": { "emoji": "👩‍🦰", "arText": "خَالَات", "trText": "Teyzeler" } } },
    "Aile: Koca": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "🤵", "arText": "زَوْج", "trText": "Eş (Koca)" } }, "cogul": { "base": { "emoji": "🤵", "arText": "أَزْوَاج", "trText": "Eşler (Kocalar)" } } },
    "Aile: Zevce": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👰", "arText": "زَوْجَة", "trText": "Eş (Kadın)" } }, "cogul": { "base": { "emoji": "👰", "arText": "زَوْجَات", "trText": "Eşler (Kadınlar)" } } },
    "Aile: Aile": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👨‍👩‍👧‍👦", "arText": "أُسْرَة", "trText": "Aile" } }, "cogul": { "base": { "emoji": "👨‍👩‍👧‍👦", "arText": "أُسَر", "trText": "Aileler" } } }
,

    // ==================================================================
    // BAĞLAÇLAR (Atıf Harfleri)
    // ==================================================================
    "Bağlaç: Ve": { isDictOnly: true, tip: "baglac", tekil: { base: { emoji: "➕", arText: "وَ", trText: "Ve / İle" } } },
    "Bağlaç: Fe": { isDictOnly: true, tip: "baglac", tekil: { base: { emoji: "⏭️", arText: "فَ", trText: "Hemen sonra / Bu yüzden" } } },
    "Bağlaç: Sümme": { isDictOnly: true, tip: "baglac", hasZamirCekimi: true, tekil: { base: { emoji: "⏳", arText: "ثُمَّ", trText: "Sonra / Daha sonra" } } },
    "Bağlaç: Ev": { isDictOnly: true, tip: "baglac", tekil: { base: { emoji: "🔀", arText: "أَوْ", trText: "Veya / Yahut" } } },
    "Bağlaç: Em": { isDictOnly: true, tip: "baglac", tekil: { base: { emoji: "⚖️", arText: "أَمْ", trText: "Yoksa / Veya" } } },
    "Bağlaç: Bel": { isDictOnly: true, tip: "baglac", tekil: { base: { emoji: "🔙", arText: "بَلْ", trText: "Aksine / Bilakis" } } },
    "Bağlaç: Li-enne": { isDictOnly: true, tip: "baglac", hasZamirCekimi: true, tekil: { base: { emoji: "💡", arText: "لِأَنَّ", trText: "Çünkü / -dığı için" } } },
    "Bağlaç: Lakin": { isDictOnly: true, tip: "baglac", hasZamirCekimi: true, zamirBase: "لَكِنَّ", tekil: { base: { emoji: "✋", arText: "لَكِنْ", trText: "Fakat / Ancak" } } },
    "Bağlaç: Hatta": { isDictOnly: true, tip: "baglac", tekil: { base: { emoji: "🏁", arText: "حَتَّى", trText: "Hatta / -e kadar" } } },
};

// Kökler dosyasındaki eski sözlük verilerini yeni sözlük verileriyle birleştir
if (typeof eski_sozlukVerileri !== 'undefined') {
    Object.assign(sozlukVerileri, eski_sozlukVerileri);
}
