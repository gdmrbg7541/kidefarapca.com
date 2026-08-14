const kategoriTanimlari = {
        "olumsuz": { title: "Olumsuzluk Edatları", arTitle: "أَدَوات النَّفْي", icon: "🚫", items: [] },
    "sart": { title: "Şart Edatları", arTitle: "أَدَوات الشَّرْط", icon: "⚖️", items: [] },
    "harficer": { title: "Harf-i Cerler", arTitle: "حُروف الجَرّ", icon: "🔤", items: [] },
    "baglac": { title: "Bağlaçlar", arTitle: "حُروف العَطْف", icon: "🔗", items: [] },
    "soru": { title: "Soru Edatları", arTitle: "أَدَوات الاسْتِفْهام", icon: "❓", items: [] },
    "zaman": { title: "Zaman İfadeleri", arTitle: "ظُروف الزَّمان", icon: "⏱️", items: [] },
    "zarf": { title: "Mekân Zarfları", arTitle: "ظُروف المَكان", icon: "📍", items: [] },
    "zamir": { title: "Kişi Zamirleri", arTitle: "الضَّمائِر", icon: "👤", items: [] },
    "isaret": { title: "İşaret Zamirleri", arTitle: "أَسْماء الإِشارَة", icon: "👇", items: [] },
    "mevsul": { title: "İsmi Mevsuller", arTitle: "الأَسْماء المَوْصولَة", icon: "🔗", items: [] },
    "renk": { title: "Renkler", arTitle: "الأَلْوان", icon: "🎨", items: [] },
    "sayi": { title: "Sayılar", arTitle: "الأَرْقام وَالأَعْداد", icon: "🔢", items: [] },
    "sirasayi": { title: "Sıra Sayıları", arTitle: "الأَعْداد التَّرْتيبِيَّة", icon: "📊", items: [] },
    "gun": { title: "Haftanın Günleri", arTitle: "أَيّام الأُسْبوع", icon: "📅", items: [] },
    "tasgir": { title: "İsm-i Tasgir", arTitle: "التَّصْغير", icon: "🔍", items: [] },
    "tafdil": { title: "İsm-i Tafdil", arTitle: "التَّفْضيل", icon: "🏆", items: [] },
    "meyve": { title: "Meyveler", arTitle: "الفَواكِه", icon: "🍎", items: [] },
    "sebze": { title: "Sebzeler", arTitle: "الخُضْرَوات", icon: "🥦", items: [] },
    "hayvan": { title: "Hayvanlar", arTitle: "الحَيَوانات", icon: "🐾", items: [] },
    "yiyecek": { title: "Yiyecekler", arTitle: "الأَطْعِمَة", icon: "🍔", items: [] },
    "icecek": { title: "İçecekler", arTitle: "المَشْروبات", icon: "☕", items: [] },
    "ulasim": { title: "Ulaşım Araçları", arTitle: "وَسائِل النَّقْل", icon: "🚗", items: [] },
    "meslek": { title: "Meslekler", arTitle: "المِهَن", icon: "💼", items: [] },
    "aile": { title: "Aile Bireyleri", arTitle: "أَفْراد الأُسْرَة", icon: "👨‍👩‍👧‍👦", items: [] },
    "hayvan": { title: "Hayvanlar", arTitle: "الحَيَوانات", icon: "🐪", items: [] },
    "sifat": { title: "Sıfatlar", arTitle: "الصِّفات", icon: "✨", items: [] },
    "isim": { title: "Genel İsimler", arTitle: "الأَسْماء", icon: "🏷️", items: [] },
    "kalip": { title: "Kalıplar ve İfadeler", arTitle: "التَّعْبيرات وَالقَوالِب", icon: "💬", items: [] }
};

const sozlukVerileri = {
    "نصف": {
        20: { word: "نِصْف", meaning: "Yarım / Yarı", type: "İsim", refId: "20", root: "نصف" },
        52: { word: "أَنْصَفَ", meaning: "İnsaflı davrandı / Adil oldu", type: "Mazi", refId: "52", root: "نصف", m: ["55"] },
        53: { word: "يُنْصِفُ", meaning: "İnsaflı davranır / Adil olur", type: "Muzari", refId: "53", root: "نصف" },
        54: { word: "أَنْصِفْ", meaning: "İnsaflı ol / Hakkını ver", type: "Emir", refId: "54", root: "نصف" },
        55: { word: "إِنْصَاف", meaning: "İnsaf / Adalet", type: "Mastar", refId: "55", root: "نصف" },
        56: { word: "مُنْصِف", meaning: "İnsaflı / Adil kimse", type: "İsm-i Fail", refId: "56", root: "نصف" },
        57: { word: "مُنْصَف", meaning: "Kendisine adil davranılan", type: "İsm-i Meful", refId: "57", root: "نصف" },
        64: { word: "نَاصَفَ", meaning: "İkiye böldü / Yarı yarıya paylaştı", type: "Mazi", refId: "64", root: "نصف", m: ["67"] },
        65: { word: "يُنَاصِفُ", meaning: "İkiye böler / Yarı yarıya paylaşır", type: "Muzari", refId: "65", root: "نصف" },
        66: { word: "نَاصِفْ", meaning: "Yarı yarıya paylaş", type: "Emir", refId: "66", root: "نصف" },
        67: { word: "مُنَاصَفَة", meaning: "Yarı yarıya / Eşit şekilde bölüşerek", type: "Mastar", refId: "67", root: "نصف" },
        77: { word: "اِنْتَصَفَ", meaning: "Yarısına ulaştı / Ortasına geldi", type: "Mazi", refId: "77", root: "نصف", m: ["80"] },
        78: { word: "يَنْتَصِفُ", meaning: "Yarısına ulaşır / Ortasına gelir", type: "Muzari", refId: "78", root: "نصف" },
        79: { word: "اِنْتَصِفْ", meaning: "Yarısına ulaş / Öcünü al", type: "Emir", refId: "79", root: "نصف" },
        80: { word: "اِنْتِصَاف", meaning: "Yarılanma / Öç alma (hakkını alma)", type: "Mastar", refId: "80", root: "نصف" },
        81: { word: "مُنْتَصِف", meaning: "Yarıya ulaşan / Öç alan", type: "İsm-i Fail", refId: "81", root: "نصف" },
        82: { word: "مُنْتَصَف", meaning: "Orta / Yarı", type: "İsm-i Meful", refId: "82", root: "نصف" }
    },

    "شيم": {
        "31": {
            "base": {
                "arText": "شَيْمَاء",
                "trText": "Benli (kadın) / Güzel huylu",
                "emoji": "👧🏻"
            },
            "not": "الْوَزْن: فَعْلَاء (Sıfat-ı Müşebbehe / Müennes)",
            "ornek": {
                "ar": "الشَّيْمَاءُ أُخْتُ النَّبِيِّ فِي الرَّضَاعَةِ.",
                "tr": "Şeymâ, Peygamberimizin (s.a.v) süt kardeşidir."
            },
            "isDictOnly": true
        },
        "30": {
            "base": {
                "arText": "أَشْيَم",
                "trText": "Benli (erkek)",
                "emoji": "👦🏻"
            },
            "not": "الْوَزْن: أَفْعَل (Sıfat-ı Müşebbehe / Müzekker)",
            "isDictOnly": true
        },
        "200": {
            "base": {
                "arText": "شِيمَة",
                "trText": "Huy / Karakter / Adet",
                "emoji": "🧬"
            },
            "ornek": {
                "ar": "الْكَرَمُ مِنْ شِيَمِ الْعَرَبِ.",
                "tr": "Cömertlik, Arapların huylarındandır."
            },
            "isDictOnly": true
        }
    },
    "İsim: Hadise": { isDictOnly: true, tekil: { base: { emoji: "💥", arText: "حَادِثَة", trText: "Hadise / Olay" } }, cogul: "حَوَادِث", cogulTr: "Hadiseler" },
    "Kalıp: İyi Akşamlar": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🌙", arText: "مَساء الخَيْر", trText: "İyi Akşamlar", ornek: { ar: "مَساء الخَيْر لِلْجَميع", tr: "Herkese iyi akşamlar." } } } },
    "Kalıp: Nasılsın": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "❓", arText: "كَيْفَ حالُكَ؟", trText: "Nasılsın?", ornek: { ar: "مَرْحَبًا، كَيْفَ حالُكَ اليَوْم؟", tr: "Merhaba, bugün nasılsın?" } } } },
    "Kalıp: Teşekkürler": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "💖", arText: "شُكْرًا جَزيلًا", trText: "Çok teşekkür ederim", ornek: { ar: "شُكْرًا جَزيلًا عَلى مُساعَدَتِك", tr: "Yardımın için çok teşekkür ederim." } } } },
    "Kalıp: Rica Ederim": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "😊", arText: "عَفْوًا", trText: "Rica ederim / Bir şey değil", ornek: { ar: "- شُكْرًا جَزِيلًا. - عَفْوًا.", tr: "- Çok teşekkür ederim. - Rica ederim." } } } },
    "Kalıp: Lütfen": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🙏", arText: "مِنْ فَضْلِك", trText: "Lütfen (Rica minnet)", ornek: { ar: "أَعْطِني قَلَمًا مِنْ فَضْلِك", tr: "Lütfen bana bir kalem ver." } } } },
    "Kalıp: Hoşçakal": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "👋", arText: "مَع السَّلامَة", trText: "Hoşça kal / Güle güle", ornek: { ar: "إِلى اللِّقاء، مَع السَّلامَة", tr: "Görüşmek üzere, hoşça kal." } } } },
    "Kalıp: Memnun Oldum": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🤝", arText: "فُرْصَة سَعيدَة", trText: "Memnun oldum", ornek: { ar: "تَشَرَّفْنا، فُرْصَة سَعيدَة", tr: "Şeref duyduk, tanıştığıma memnun oldum." } } } },
    "Kalıp: İzninizle": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🙇", arText: "لَوْ سَمَحْتَ", trText: "İzninizle / Lütfen (Eğer müsaade edersen)", ornek: { ar: "لَوْ سَمَحْتَ، أَيْن المَحَطَّة؟", tr: "İzninizle (Afedersiniz), istasyon nerede?" } } } },
    "Kalıp: Sorun Değil": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "👍", arText: "لا بَأْس", trText: "Sorun değil / Ziyanı yok", ornek: { ar: "لا بَأْس، يُمْكِنُنا المُحاوَلَة مَرَّة أُخْرى", tr: "Sorun değil, bir daha deneyebiliriz." } } } },


    // =================================================================================================
    // ÖNCEDEN GÖZDEN KAÇAN EKSİK KELİMELER
    "Zarf: İle": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "🤝", arText: "مَعَ", trText: "İle / Birlikte" } } },
    "Zaman: Sabah": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌅", arText: "صَباح", trText: "Sabah" } } },
    "Zaman: Gece": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌃", arText: "لَيْل", trText: "Gece" } } },
    "Zaman: İkindi": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌇", arText: "عَصْر", trText: "İkindi / Yüzyıl" } } },
    "Zarf: Çok": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "💯", arText: "جِدًّا", trText: "Çok" } } },
    "Zarf: Çokça": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "📈", arText: "كَثيرًا", trText: "Çok / Çokça" } } },
    "Cevap: Hayır": { isDictOnly: true, tekil: { base: { emoji: "❌", arText: "لا", trText: "Hayır" } } },
    "Cevap: Evet": { isDictOnly: true, tekil: { base: { emoji: "✅", arText: "نَعَمْ", trText: "Evet" } } },
    "Cevap: Peki": { isDictOnly: true, tekil: { base: { emoji: "👍", arText: "حَسَنًا", trText: "Peki / Tamam" } } },
    "İsim: Bütün": { isDictOnly: true, tekil: { base: { emoji: "⭕", arText: "كُلّ", trText: "Bütün / Her" } } },
    "İsim: Şeyler": { isDictOnly: true, tekil: { base: { emoji: "📦", arText: "شَيْء", trText: "Şey" } }, cogul: "أَشْياء", cogulTr: "Şeyler" },
    "İsim: Sandık": { isDictOnly: true, tekil: { base: { emoji: "🧰", arText: "صُنْدوق", trText: "Sandık / Kutu" } }, cogul: "صَناديق", cogulTr: "Sandıklar" },
    "İsim: Adres": { isDictOnly: true, tekil: { base: { emoji: "📍", arText: "عُنْوَان", trText: "Adres / Başlık" } }, cogul: "عَناوين", cogulTr: "Adresler" },
    "Sıfat: Taze": { isDictOnly: true, tekil: { base: { emoji: "🍃", arText: "طازَج", trText: "Taze" } } },


    // =================================================================================================
    // YENİ EKLENEN KELİMELER (TEKİL / ÇOĞUL EŞLEŞTİRMELİ)
    "İsim: Diş": { isDictOnly: true, tekil: { base: { emoji: "🦷", arText: "سِنّ", trText: "Diş" } }, cogul: "أَسْنان", cogulTr: "Dişler" },
    "İsim: Lira": { isDictOnly: true, tekil: { base: { emoji: "₺", arText: "ليرَة", trText: "Lira" } }, cogul: "ليرات", cogulTr: "Liralar" },
    "İsim: Yumurta": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🥚", arText: "بَيْضَة", trText: "Yumurta" } }, cogul: "بَيْض", cogulTr: "Yumurtalar (Cins)" },
    "İsim: Kiraz": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍒", arText: "كَرَزَة", trText: "Kiraz" } }, cogul: "كَرَز", cogulTr: "Kirazlar (Cins)" },
    "İsim: Portakal": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍊", arText: "بُرْتُقالَة", trText: "Portakal" } }, cogul: "بُرْتُقال", cogulTr: "Portakallar (Cins)" },

    // =================================================================================================
    // YENİ İSİMLER VE ZARFLAR
    "Zarf: Bazı": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "🧩", arText: "بَعْض", trText: "Bazı / Bir kısım" } } },
    "Zarf: Ayrıca": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "➕", arText: "أَيْضًا", trText: "Ayrıca / Dahi" } } },
    "Zarf: Sadece": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "🛑", arText: "فَقَط", trText: "Sadece / Yalnızca" } } },
    "İsim: Bakkal": { isDictOnly: true, tekil: { base: { emoji: "🛒", arText: "بَقّالَة", trText: "Bakkaliye / Bakkal dükkanı" } } },
    "İsim: Kutu": { isDictOnly: true, tekil: { base: { emoji: "📦", arText: "عُلْبَة", trText: "Kutu / Paket" } } },
    "İsim: Kilogram": { isDictOnly: true, tekil: { base: { emoji: "⚖️", arText: "كيلوغْرام", trText: "Kilogram" } } },
    "Zaman: Fecr": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌅", arText: "فَجْر", trText: "Fecr / Şafak" } } },
    "Zaman: Öğle": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🕛", arText: "ظُهْر", trText: "Öğle" } } },
    "İsim: Kayısı": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍑", arText: "مِشْمِش", trText: "Kayısı" } } },
    "İsim: Patates": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🥔", arText: "بَطاطا", trText: "Patates" } } },
    "İsim: Fasulye": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🫘", arText: "فاصولْيا", trText: "Fasulye" } } },
    "İsim: Makarna": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🍝", arText: "مَكَرونَة", trText: "Makarna" } } },
    "İsim: Köfte": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🧆", arText: "كُفْتَة", trText: "Köfte" } } },
    "Yön: Sol": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "⬅️", arText: "يَسار", trText: "Sol" } } },
    "Yön: Sağ": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "➡️", arText: "يَمين", trText: "Sağ" } } },

    // =================================================================================================
    // KALIPLAR VE İFADELER
    "Kalıp: İhtiyacım Var": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🤲", arText: "أَنا بِحاجَة إِلى", trText: "İhtiyacım var", ornek: { ar: "أَنَا بِحَاجَةٍ إِلَى مُسَاعَدَتِكَ.", tr: "Senin yardımına ihtiyacım var." } } } },
    "Kalıp: Hoşgeldiniz": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🤝", arText: "أَهْلًا وَسَهْلًا", trText: "Hoş geldiniz", ornek: { ar: "أَهْلًا وَسَهْلًا بِكُمْ فِي بَيْتِنَا.", tr: "Evimize hoş geldiniz." } } } },
    "Kalıp: Hoşbulduk": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🙏", arText: "أَهْلًا بِكَ", trText: "Hoş bulduk (Sana da hoş geldin)", ornek: { ar: "أَهْلًا بِكَ يَا صَدِيقِي.", tr: "Sana da hoş geldin dostum." } } } },
    "Kalıp: Yardımcı Olayım": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "💁‍♂️", arText: "أَيّ خِدْمَة يا سَيِّدي؟", trText: "Nasıl yardımcı olabilirim efendim?", ornek: { ar: "أَيُّ خِدْمَةٍ يَا سَيِّدِي؟ أَنَا تَحْتَ أَمْرِكَ.", tr: "Nasıl yardımcı olabilirim efendim? Emrinizdeyim." } } } },
    "Kalıp: Yeterli": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "✋", arText: "هَذا كافٍ", trText: "Bu kadarı yeterli", ornek: { ar: "شُكْرًا، هَذَا كَافٍ جِدًّا.", tr: "Teşekkürler, bu kadarı gayet yeterli." } } } },





    // =================================================================================================
    // ZAMAN İFADELERİ, ZARFLAR, SORU EDATLARI, HARF-İ CERLER
    // =================================================================================================
    
    // --- Zaman İfadeleri ---
    "Zaman: Bugün": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "📅", arText: "الْيَوْمَ", trText: "Bugün" } } },
    "Zaman: Dün": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏪", arText: "أَمْسِ", trText: "Dün" } } },
    "Zaman: Yarın": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏩", arText: "غَداً", trText: "Yarın" } } },
    "Zaman: Şimdi": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏱️", arText: "الْآنَ", trText: "Şimdi / Şu an" } } },
    "Zaman: Sabah": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌅", arText: "صَبَاحاً", trText: "Sabah" } } },
    "Zaman: Akşam": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌆", arText: "مَساءً", trText: "Akşam" } } },
    "Zaman: Gece": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌃", arText: "لَيْلاً", trText: "Gece" } } },
    "Zaman: Gündüz": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "☀️", arText: "نَهَاراً", trText: "Gündüz" } } },
    "Zaman: Önce": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏮️", arText: "قَبْلَ", trText: "Önce" } } },


    // --- Zarflar (Mekan vs) ---
    "Zarf: Üstünde": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "⬆️", arText: "فَوْقَ", trText: "Üzerinde / Üstünde" } } },
    "Zarf: Altında": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "⬇️", arText: "تَحْتَ", trText: "Altında" } } },
    "Zarf: Önünde": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "➡️", arText: "أَمَامَ", trText: "Önünde" } } },
    "Zarf: Arkasında": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "⬅️", arText: "خَلْفَ / وَرَاءَ", trText: "Arkasında / Gerisinde" } } },
        "Edat: La": { isDictOnly: true, tip: "olumsuz", tekil: { base: { emoji: "❌", arText: "لَا", trText: "Hayır / Değil (Olumsuzluk)" } } },
    "Edat: Lem": { isDictOnly: true, tip: "olumsuz", tekil: { base: { emoji: "🛑", arText: "لَمْ", trText: "Yapmadı / Etmedi (Mazi Olumsuz)" } } },
    "Edat: Lemma": { isDictOnly: true, tip: ["olumsuz", "zaman", "sart"], tekil: { base: { emoji: "⏳", arText: "لَمَّا", trText: "Henüz değil / ...dığında" } } },
    "Edat: Len": { isDictOnly: true, tip: "olumsuz", tekil: { base: { emoji: "🚧", arText: "لَنْ", trText: "Asla yapmayacak (Gelecek Olumsuz)" } } },
    "Edat: In": { isDictOnly: true, tip: ["sart", "olumsuz"], tekil: { base: { emoji: "⚖️", arText: "إِنْ", trText: "Eğer / Şayet / Değil (Olumsuz)" } } },
    "Edat: Iza": { isDictOnly: true, tip: ["sart", "zaman"], tekil: { base: { emoji: "🕒", arText: "إِذَا", trText: "Zamanında / Eğer / Dığında" } } },
    "Edat: Lev": { isDictOnly: true, tip: "sart", tekil: { base: { emoji: "💭", arText: "لَوْ", trText: "Keşke / Eğer (Gerçekleşmemiş şart)" } } },
    "Edat: Leyse": { isDictOnly: true, tip: "olumsuz", tekil: { base: { emoji: "🚫", arText: "لَيْسَ", trText: "Değil (İsim cümlesi olumsuzu)" } } },
    "Edat: Muz": { isDictOnly: true, tip: ["harficer", "zaman"], tekil: { base: { emoji: "⏳", arText: "مُذْ / مُنْذُ", trText: "-den beri (Zaman / Başlangıç)" } } },
    "Edat: Inde Leda": { isDictOnly: true, tip: ["zaman", "zarf"], hasZamirCekimi: true, zamirBase: "عِنْدَ / لَدَى", tekil: { base: { emoji: "👥", arText: "عِنْدَ / لَدَى", trText: "Yanında / Katında / Sahip" } } },
    "Zarf: Arasında": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "↔️", arText: "بَيْنَ", trText: "Arasında" } } },
    "Zarf: Etrafında": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "🔄", arText: "حَوْلَ", trText: "Çevresinde / Etrafında" } } },
    "Zarf: İçinde": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "📥", arText: "دَاخِلَ", trText: "İçinde" } } },
    "Zarf: Dışında": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "📤", arText: "خَارِجَ", trText: "Dışında" } } },
    "Zarf: Burada": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "📍", arText: "هُنَا", trText: "Burada" } } },
    "Zarf: Orada": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "🗺️", arText: "هُنَاكَ / هُنَالِكَ", trText: "Orada / Şurada" } } },

    // --- Soru Edatları ---
    "Soru: Maza": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "❓", arText: "مَاذَا", trText: "Ne? / Neler?" } } },
    "Edat: Ma": { isDictOnly: true, tip: ["soru", "mevsul", "olumsuz"], tekil: { base: { emoji: "📦", arText: "مَا", trText: "Ne? / O şey ki / Değil (Olumsuzluk)" } } },
    "Soru: Nerede": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "📍", arText: "أَيْنَ", trText: "Nerede?" } } },
    "Soru: Ne Zaman": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "⏰", arText: "مَتَى", trText: "Ne Zaman?" } } },
    "Soru: Nasıl": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🤷", arText: "كَيْفَ", trText: "Nasıl?" } } },
    "Edat: Men": { isDictOnly: true, tip: ["soru", "mevsul", "sart"], tekil: { base: { emoji: "👤", arText: "مَنْ", trText: "Kim? / O kimse ki / Kim ... yaparsa (Şart)" } } },
    "Soru: Neden": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🤔", arText: "لِمَاذَا", trText: "Neden? / Niçin?" } } },
    "Soru: Hangi": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🔀", arText: "أَيُّ", trText: "Hangi?" } } },
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
    "Edat: Ala": { isDictOnly: true, tip: ["harficer", "baglac"], hasZamirCekimi: true, tekil: { base: { emoji: "⬆️", arText: "عَلَى", trText: "Üzerine / Üzerinde" } } },
    "Edat: Li": { isDictOnly: true, tip: ["harficer", "baglac"], hasZamirCekimi: true, tekil: { base: { emoji: "🏷️", arText: "لِ", trText: "İçin / Ait" } } },
    "Harficer: Bi": { isDictOnly: true, tip: "harficer", hasZamirCekimi: true, tekil: { base: { emoji: "🤝", arText: "بِ", trText: "İle / Birlikte" } } },
    "Harficer: Ke": { isDictOnly: true, tip: "harficer", hasZamirCekimi: true, tekil: { base: { emoji: "👯", arText: "كَ", trText: "Gibi (Benzetme)" } } },


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
    "Zamir: Sizler (D)": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👩‍👩‍👧", arText: "أَنْتُنَّ", trText: "Sizler (Dişil)" } } },
    "Zamir: O (E)": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👉👨", arText: "هُوَ", trText: "O (Eril)" } } },
    "Zamir: O (D)": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👉👩", arText: "هِيَ", trText: "O (Dişil)" } } },
    "Zamir: O İkisi": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👉🧑‍🤝‍🧑", arText: "هُمَا", trText: "O İkisi" } } },
    "Zamir: Onlar (E)": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👉👨‍👨‍👦", arText: "هُمْ", trText: "Onlar (Eril)" } } },
    "Zamir: Onlar (D)": { isDictOnly: true, tip: "zamir", tekil: { base: { emoji: "👉👩‍👩‍👧", arText: "هُنَّ", trText: "Onlar (Dişil)" } } },

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
    "Mevsul: O Kimse ki (E)": { isDictOnly: true, tip: "mevsul", tekil: { base: { emoji: "🔗", arText: "اَلَّذِي", trText: "O kimse ki (Eril / Tekil)" } } },
    "Mevsul: O Kimse ki (D)": { isDictOnly: true, tip: "mevsul", tekil: { base: { emoji: "🔗", arText: "اَلَّتِي", trText: "O kimse ki (Dişil / Tekil)" } } },
    "Mevsul: O İki Kimse ki (E)": { isDictOnly: true, tip: "mevsul", tekil: { base: { emoji: "🔗🔗", arText: "اَللَّذَانِ", trText: "O iki kimse ki (Eril / İkil)" } } },
    "Mevsul: O İki Kimse ki (D)": { isDictOnly: true, tip: "mevsul", tekil: { base: { emoji: "🔗🔗", arText: "اَللَّتَانِ", trText: "O iki kimse ki (Dişil / İkil)" } } },
    "Mevsul: O Kimseler ki (E)": { isDictOnly: true, tip: "mevsul", tekil: { base: { emoji: "🔗👥", arText: "اَلَّذِينَ", trText: "O kimseler ki (Eril / Çoğul)" } } },
    "Mevsul: O Kimseler ki (D)": { isDictOnly: true, tip: "mevsul", tekil: { base: { emoji: "🔗👥", arText: "اَللَّاتِي / اَللَّوَاتِي", trText: "O kimseler ki (Dişil / Çoğul)" } } },

    // Büyük sözlük veritabanını buraya dahil ediyoruz


    // ==================================================================
    // TARİH KELİMESİ
    // ==================================================================
    "تاريخ": {
        "isDictOnly": true,
        "tekil": {
            base: { emoji: "📅", arText: "تاريخ", trText: "Tarih" }
        },
        "cogul": { 
            base: { emoji: "📅", arText: "تَواريخ", trText: "Tarihler" }
        }
    },

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
        "tip": "hayvan",
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
        "tip": "hayvan",
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
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐎", arText: "حِصان", trText: "At" }
        },
        "cogul": { 
            base: { emoji: "🐎", arText: "أَحْصِنَة", trText: "Atlar" }
        }
    },

    // ==================================================================
    // ASLAN KELİMESİ
    // ==================================================================
    "أسد": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦁", arText: "أَسَد", trText: "Aslan" }
        },
        "cogul": { 
            base: { emoji: "🦁", arText: "أُسود", trText: "Aslanlar" }
        }
    },

    // ==================================================================
    // KUŞ KELİMESİ
    // ==================================================================
    "طائر": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐦", arText: "طائِر", trText: "Kuş" }
        },
        "cogul": { 
            base: { emoji: "🐦", arText: "طُيور", trText: "Kuşlar" }
        }
    },

    // ==================================================================
    // FARE KELİMESİ
    // ==================================================================
    "فأرة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐭", arText: "فَأْرَة", trText: "Fare" }
        },
        "cogul": { 
            base: { emoji: "🐭", arText: "فِئْران", trText: "Fareler" }
        }
    },

    // ==================================================================
    // İNEK KELİMESİ
    // ==================================================================
    "بقرة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐄", arText: "بَقَرَة", trText: "İnek" }
        },
        "cogul": { 
            base: { emoji: "🐄", arText: "أَبْقار", trText: "İnekler" }
        }
    },

    // ==================================================================
    // EŞEK KELİMESİ
    // ==================================================================
    "حمار": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🫏", arText: "حِمار", trText: "Eşek" }
        },
        "cogul": { 
            base: { emoji: "🫏", arText: "حَمير", trText: "Eşekler" }
        }
    },

    // ==================================================================
    // MAYMUN KELİMESİ
    // ==================================================================
    "قرد": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐒", arText: "قِرْد", trText: "Maymun" }
        },
        "cogul": { 
            base: { emoji: "🐒", arText: "قُرود", trText: "Maymunlar" }
        }
    },

    // ==================================================================
    // FİL KELİMESİ
    // ==================================================================
    "فيل": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐘", arText: "فيل", trText: "Fil" }
        },
        "cogul": { 
            base: { emoji: "🐘", arText: "أَفْيال", trText: "Filler" }
        }
    },

    // ==================================================================
    // KOYUN KELİMESİ
    // ==================================================================
    "خروف": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐑", arText: "خَروف", trText: "Koyun" }
        },
        "cogul": { 
            base: { emoji: "🐑", arText: "خِراف", trText: "Koyunlar" }
        }
    },

    // ==================================================================
    // TAVUK KELİMESİ
    // ==================================================================
    "دجاجة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐔", arText: "دَجاجَة", trText: "Tavuk" }
        },
        "cogul": { 
            base: { emoji: "🐔", arText: "دَجاج", trText: "Tavuklar" }
        }
    },

    // ==================================================================
    // BALIK KELİMESİ
    // ==================================================================
    "سمكة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐟", arText: "سَمَكَة", trText: "Balık" }
        },
        "cogul": { 
            base: { emoji: "🐟", arText: "أَسْماك", trText: "Balıklar" }
        }
    },

    // ==================================================================
    // BÖCEK KELİMESİ
    // ==================================================================
    "حشرة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐛", arText: "حَشَرَة", trText: "Böcek" }
        },
        "cogul": { 
            base: { emoji: "🐛", arText: "حَشَرات", trText: "Böcekler" }
        }
    },

    // ==================================================================
    // KARINCA KELİMESİ
    // ==================================================================
    "نملة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐜", arText: "نَمْلَة", trText: "Karınca" }
        },
        "cogul": { 
            base: { emoji: "🐜", arText: "نَمْل", trText: "Karıncalar" }
        }
    },

    // ==================================================================
    // YILAN KELİMESİ
    // ==================================================================
    "ثعبان": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐍", arText: "ثُعْبان", trText: "Yılan" }
        },
        "cogul": { 
            base: { emoji: "🐍", arText: "ثَعابين", trText: "Yılanlar" }
        }
    },

    // ==================================================================
    // ZÜRAFA KELİMESİ
    // ==================================================================
    "زرافة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦒", arText: "زَرافَة", trText: "Zürafa" }
        },
        "cogul": { 
            base: { emoji: "🦒", arText: "زَرافات", trText: "Zürafalar" }
        }
    },

    // ==================================================================
    // DEVE KELİMESİ
    // ==================================================================
    "جمل": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐪", arText: "جَمَل", trText: "Deve" }
        },
        "cogul": { 
            base: { emoji: "🐪", arText: "جِمال", trText: "Develer" }
        }
    },

    // ==================================================================
    // AYI KELİMESİ
    // ==================================================================
    "دب": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐻", arText: "دُبّ", trText: "Ayı" }
        },
        "cogul": { 
            base: { emoji: "🐻", arText: "دِبَبَة", trText: "Ayılar" }
        }
    },

    // ==================================================================
    // KAPLAN KELİMESİ
    // ==================================================================
    "نمر": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐅", arText: "نَمِر", trText: "Kaplan" }
        },
        "cogul": { 
            base: { emoji: "🐅", arText: "نُمور", trText: "Kaplanlar" }
        }
    },

    // ==================================================================
    // KURT KELİMESİ
    // ==================================================================
    "ذئب": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐺", arText: "ذِئْب", trText: "Kurt" }
        },
        "cogul": { 
            base: { emoji: "🐺", arText: "ذِئاب", trText: "Kurtlar" }
        }
    },

    // ==================================================================
    // DOMUZ KELİMESİ
    // ==================================================================
    "خنزير": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐖", arText: "خِنْزير", trText: "Domuz" }
        },
        "cogul": { 
            base: { emoji: "🐖", arText: "خَنازير", trText: "Domuzlar" }
        }
    },

    // ==================================================================
    // TAVŞAN KELİMESİ
    // ==================================================================
    "أرنب": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐇", arText: "أَرْنَب", trText: "Tavşan" }
        },
        "cogul": { 
            base: { emoji: "🐇", arText: "أَرانِب", trText: "Tavşanlar" }
        }
    },

    // ==================================================================
    // TILKI KELİMESİ
    // ==================================================================
    "ثعلب": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦊", arText: "ثَعْلَب", trText: "Tilki" }
        },
        "cogul": { 
            base: { emoji: "🦊", arText: "ثَعالِب", trText: "Tilkiler" }
        }
    },

    // ==================================================================
    // GEYIK KELİMESİ
    // ==================================================================
    "غزال": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦌", arText: "غَزال", trText: "Geyik" }
        },
        "cogul": { 
            base: { emoji: "🦌", arText: "غِزْلان", trText: "Geyikler" }
        }
    },

    // ==================================================================
    // TIMSAH KELİMESİ
    // ==================================================================
    "تمساح": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐊", arText: "تِمْساح", trText: "Timsah" }
        },
        "cogul": { 
            base: { emoji: "🐊", arText: "تَماسيح", trText: "Timsahlar" }
        }
    },

    // ==================================================================
    // KURBAĞA KELİMESİ
    // ==================================================================
    "ضفدع": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐸", arText: "ضِفْدَع", trText: "Kurbağa" }
        },
        "cogul": { 
            base: { emoji: "🐸", arText: "ضَفادِع", trText: "Kurbağalar" }
        }
    },

    // ==================================================================
    // KAPLUMBAĞA KELİMESİ
    // ==================================================================
    "سلحفاة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐢", arText: "سُلَحْفاة", trText: "Kaplumbağa" }
        },
        "cogul": { 
            base: { emoji: "🐢", arText: "سَلاحِف", trText: "Kaplumbağalar" }
        }
    },

    // ==================================================================
    // ÖRÜMCEK KELİMESİ
    // ==================================================================
    "عنكبوت": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🕷️", arText: "عَنْكَبوت", trText: "Örümcek" }
        },
        "cogul": { 
            base: { emoji: "🕷️", arText: "عَناكِب", trText: "Örümcekler" }
        }
    },

    // ==================================================================
    // AKREP KELİMESİ
    // ==================================================================
    "عقرب": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦂", arText: "عَقْرَب", trText: "Akrep" }
        },
        "cogul": { 
            base: { emoji: "🦂", arText: "عَقارِب", trText: "Akrepler" }
        }
    },

    // ==================================================================
    // KELEBEK KELİMESİ
    // ==================================================================
    "فراشة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦋", arText: "فَراشَة", trText: "Kelebek" }
        },
        "cogul": { 
            base: { emoji: "🦋", arText: "فَراشات", trText: "Kelebekler" }
        }
    },

    // ==================================================================
    // ARI KELİMESİ
    // ==================================================================
    "نحلة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐝", arText: "نَحْلَة", trText: "Arı" }
        },
        "cogul": { 
            base: { emoji: "🐝", arText: "نَحْل", trText: "Arılar" }
        }
    },

    // ==================================================================
    // SINEK KELİMESİ
    // ==================================================================
    "ذبابة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🪰", arText: "ذُبابَة", trText: "Sinek" }
        },
        "cogul": { 
            base: { emoji: "🪰", arText: "ذُباب", trText: "Sinekler" }
        }
    },

    // ==================================================================
    // SIVRISINEK KELİMESİ
    // ==================================================================
    "بعوضة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦟", arText: "بَعوضَة", trText: "Sivrisinek" }
        },
        "cogul": { 
            base: { emoji: "🦟", arText: "بَعوض", trText: "Sivrisinekler" }
        }
    },

    // ==================================================================
    // KARGA KELİMESİ
    // ==================================================================
    "غراب": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐦‍⬛", arText: "غُراب", trText: "Karga" }
        },
        "cogul": { 
            base: { emoji: "🐦‍⬛", arText: "غِرْبان", trText: "Kargalar" }
        }
    },

    // ==================================================================
    // BAYKUŞ KELİMESİ
    // ==================================================================
    "بومة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦉", arText: "بومَة", trText: "Baykuş" }
        },
        "cogul": { 
            base: { emoji: "🦉", arText: "بوم", trText: "Baykuşlar" }
        }
    },

    // ==================================================================
    // ÖRDEK KELİMESİ
    // ==================================================================
    "بطة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦆", arText: "بَطَّة", trText: "Ördek" }
        },
        "cogul": { 
            base: { emoji: "🦆", arText: "بَطّ", trText: "Ördekler" }
        }
    },

    // ==================================================================
    // KAZ KELİMESİ
    // ==================================================================
    "إوزة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🪿", arText: "إِوَزَّة", trText: "Kaz" }
        },
        "cogul": { 
            base: { emoji: "🪿", arText: "إِوَزّ", trText: "Kazlar" }
        }
    },

    // ==================================================================
    // GÜVERCIN KELİMESİ
    // ==================================================================
    "حمامة": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🕊️", arText: "حَمامَة", trText: "Güvercin" }
        },
        "cogul": { 
            base: { emoji: "🕊️", arText: "حَمام", trText: "Güvercinler" }
        }
    },

    // ==================================================================
    // KARTAL KELİMESİ
    // ==================================================================
    "نسر": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦅", arText: "نَسْر", trText: "Kartal" }
        },
        "cogul": { 
            base: { emoji: "🦅", arText: "نُسور", trText: "Kartallar" }
        }
    },

    // ==================================================================
    // PENGUEN KELİMESİ
    // ==================================================================
    "بطريق": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐧", arText: "بِطْريق", trText: "Penguen" }
        },
        "cogul": { 
            base: { emoji: "🐧", arText: "بَطاريق", trText: "Penguenler" }
        }
    },

    // ==================================================================
    // YUNUS KELİMESİ
    // ==================================================================
    "دلفين": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐬", arText: "دُلْفين", trText: "Yunus" }
        },
        "cogul": { 
            base: { emoji: "🐬", arText: "دَلافين", trText: "Yunuslar" }
        }
    },

    // ==================================================================
    // BALINA KELİMESİ
    // ==================================================================
    "حوت": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐳", arText: "حوت", trText: "Balina" }
        },
        "cogul": { 
            base: { emoji: "🐳", arText: "حيتان", trText: "Balinalar" }
        }
    },

    // ==================================================================
    // KÖPEKBALIĞI KELİMESİ
    // ==================================================================
    "قرش": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦈", arText: "قِرْش", trText: "Köpekbalığı" }
        },
        "cogul": { 
            base: { emoji: "🦈", arText: "قُروش", trText: "Köpekbalıkları" }
        }
    },

    // ==================================================================
    // AHTAPOT KELİMESİ
    // ==================================================================
    "أخطبوط": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐙", arText: "أُخْطُبوط", trText: "Ahtapot" }
        },
        "cogul": { 
            base: { emoji: "🐙", arText: "أَخاطِب", trText: "Ahtapotlar" }
        }
    },

    // ==================================================================
    // YENGEÇ KELİMESİ
    // ==================================================================
    "سرطان": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦀", arText: "سَرَطان", trText: "Yengeç" }
        },
        "cogul": { 
            base: { emoji: "🦀", arText: "سَرَطانات", trText: "Yengeçler" }
        }
    },

    // ==================================================================
    // SALYANGOZ KELİMESİ
    // ==================================================================
    "حلزون": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🐌", arText: "حَلَزون", trText: "Salyangoz" }
        },
        "cogul": { 
            base: { emoji: "🐌", arText: "حَلَزونات", trText: "Salyangozlar" }
        }
    },

    // ==================================================================
    // TAVUSKUŞU KELİMESİ
    // ==================================================================
    "طاووس": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦚", arText: "طاووس", trText: "Tavuskuşu" }
        },
        "cogul": { 
            base: { emoji: "🦚", arText: "طَواويس", trText: "Tavuskuşları" }
        }
    },

    // ==================================================================
    // YARASA KELİMESİ
    // ==================================================================
    "خفاش": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦇", arText: "خُفّاش", trText: "Yarasa" }
        },
        "cogul": { 
            base: { emoji: "🦇", arText: "خَفافيش", trText: "Yarasalar" }
        }
    },

    // ==================================================================
    // KANGURU KELİMESİ
    // ==================================================================
    "كنغر": {
        "isDictOnly": true,
        "tip": "hayvan",
        "tekil": {
            base: { emoji: "🦘", arText: "كَنْغَر", trText: "Kanguru" }
        },
        "cogul": { 
            base: { emoji: "🦘", arText: "كَناغِر", trText: "Kangurular" }
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

    // =================================================================================================
    // RAKAM RAKAM SAYILAR
    // =================================================================================================
    "Sayı: 0": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "صِفْر ٠", "trText": "Sıfır - 0" } } },
    "Sayı: 1": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "وَاحِد ١", "trText": "Bir - 1", "muennes": "وَاحِدَة" } } },
    "Sayı: 2": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "اِثْنَان ٢", "trText": "İki - 2", "muennes": "اِثْنَتَان" } } },
    "Sayı: 3": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "ثَلَاثَة ٣", "trText": "Üç - 3", "muennes": "ثَلَاث" } } },
    "Sayı: 4": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "أَرْبَعَة ٤", "trText": "Dört - 4", "muennes": "أَرْبَع" } } },
    "Sayı: 5": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "خَمْسَة ٥", "trText": "Beş - 5", "muennes": "خَمْس" } } },
    "Sayı: 6": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "سِتَّة ٦", "trText": "Altı - 6", "muennes": "سِتّ" } } },
    "Sayı: 7": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "سَبْعَة ٧", "trText": "Yedi - 7", "muennes": "سَبْع" } } },
    "Sayı: 8": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "ثَمَانِيَة ٨", "trText": "Sekiz - 8", "muennes": "ثَمَان" } } },
    "Sayı: 9": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "تِسْعَة ٩", "trText": "Dokuz - 9", "muennes": "تِسْع" } } },
    "Sayı: 10": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "عَشَرَة ١٠", "trText": "On - 10", "muennes": "عَشْر" } } },
    "Sayı: 11": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "أَحَدَ عَشَرَ ١١", "trText": "On Bir - 11", "muennes": "إِحْدَى عَشْرَةَ" } } },
    "Sayı: 12": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "اِثْنَا عَشَرَ ١٢", "trText": "On İki - 12", "muennes": "اِثْنَتَا عَشْرَةَ" } } },
    "Sayı: 13": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "ثَلَاثَةَ عَشَرَ ١٣", "trText": "On Üç - 13", "muennes": "ثَلَاثَ عَشْرَةَ" } } },
    "Sayı: 14": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "أَرْبَعَةَ عَشَرَ ١٤", "trText": "On Dört - 14", "muennes": "أَرْبَعَ عَشْرَةَ" } } },
    "Sayı: 15": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "خَمْسَةَ عَشَرَ ١٥", "trText": "On Beş - 15", "muennes": "خَمْسَ عَشْرَةَ" } } },
    "Sayı: 16": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "سِتَّةَ عَشَرَ ١٦", "trText": "On Altı - 16", "muennes": "سِتَّ عَشْرَةَ" } } },
    "Sayı: 17": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "سَبْعَةَ عَشَرَ ١٧", "trText": "On Yedi - 17", "muennes": "سَبْعَ عَشْرَةَ" } } },
    "Sayı: 18": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "ثَمَانِيَةَ عَشَرَ ١٨", "trText": "On Sekiz - 18", "muennes": "ثَمَانِيَ عَشْرَةَ" } } },
    "Sayı: 19": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "تِسْعَةَ عَشَرَ ١٩", "trText": "On Dokuz - 19", "muennes": "تِسْعَ عَشْرَةَ" } } },
    "Sayı: 20": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "عِشْرُونَ ٢٠", "trText": "Yirmi - 20" } } },
    "Sayı: 30": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "ثَلَاثُونَ ٣٠", "trText": "Otuz - 30" } } },
    "Sayı: 40": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "أَرْبَعُونَ ٤٠", "trText": "Kırk - 40" } } },
    "Sayı: 50": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "خَمْسُونَ ٥٠", "trText": "Elli - 50" } } },
    "Sayı: 60": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "سِتُّونَ ٦٠", "trText": "Altmış - 60" } } },
    "Sayı: 70": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "سَبْعُونَ ٧٠", "trText": "Yetmiş - 70" } } },
    "Sayı: 80": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "ثَمَانُونَ ٨٠", "trText": "Seksen - 80" } } },
    "Sayı: 90": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "تِسْعُونَ ٩٠", "trText": "Doksan - 90" } } },
    "Sayı: 100": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "مِائَة ١٠٠", "trText": "Yüz - 100" } } },
    "Sayı: 1000": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "أَلْف ١٠٠٠", "trText": "Bin - 1000" } } },
    "Sayı: 10000": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "عَشَرَةُ آلَافٍ ١٠٠٠٠", "trText": "On Bin - 10.000" } } },
    "Sayı: 100000": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "مِائَةُ أَلْفٍ ١٠٠٠٠٠", "trText": "Yüz Bin - 100.000" } } },
    "Sayı: 1000000": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "مِلْيُون ١٠٠٠٠٠٠", "trText": "Bir Milyon - 1.000.000" } } },
    "Sayı: 1000000000": { "isDictOnly": true, "tip": "sayi", "tekil": { "base": { "emoji": "🔢", "arText": "مِلْيَار ١٠٠٠٠٠٠٠٠٠", "trText": "Bir Milyar - 1.000.000.000" } } },
    
    "Sıra: 1.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الْأَوَّل", "trText": "1. Birinci", "muennes": "الْأُولَى" } } },




    "Sıra: 2.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الثَّانِي", "trText": "2. İkinci", "muennes": "الثَّانِيَة" } } },
    "Sıra: 3.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الثَّالِث", "trText": "3. Üçüncü", "muennes": "الثَّالِثَة" } } },
    "Sıra: 4.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الرَّابِع", "trText": "4. Dördüncü", "muennes": "الرَّابِعَة" } } },
    "Sıra: 5.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الْخَامِس", "trText": "5. Beşinci", "muennes": "الْخَامِسَة" } } },
    "Sıra: 6.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "السَّادِس", "trText": "6. Altıncı", "muennes": "السَّادِسَة" } } },
    "Sıra: 7.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "السَّابِع", "trText": "7. Yedinci", "muennes": "السَّابِعَة" } } },
    "Sıra: 8.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الثَّامِن", "trText": "8. Sekizinci", "muennes": "الثَّامِنَة" } } },
    "Sıra: 9.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "التَّاسِع", "trText": "9. Dokuzuncu", "muennes": "التَّاسِعَة" } } },
    "Sıra: 10.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الْعَاشِر", "trText": "10. Onuncu", "muennes": "الْعَاشِرَة" } } },
    "Sıra: 11.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الْحَادِيَ عَشَرَ", "trText": "11. On Birinci", "muennes": "الْحَادِيَةَ عَشْرَةَ" } } },
    "Sıra: 12.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الثَّانِيَ عَشَرَ", "trText": "12. On İkinci", "muennes": "الثَّانِيَةَ عَشْرَةَ" } } },
    "Sıra: 13.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الثَّالِثَ عَشَرَ", "trText": "13. On Üçüncü", "muennes": "الثَّالِثَةَ عَشْرَةَ" } } },
    "Sıra: 14.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الرَّابِعَ عَشَرَ", "trText": "14. On Dördüncü", "muennes": "الرَّابِعَةَ عَشْرَةَ" } } },
    "Sıra: 15.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الْخَامِسَ عَشَرَ", "trText": "15. On Beşinci", "muennes": "الْخَامِسَةَ عَشْرَةَ" } } },
    "Sıra: 16.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "السَّادِسَ عَشَرَ", "trText": "16. On Altıncı", "muennes": "السَّادِسَةَ عَشْرَةَ" } } },
    "Sıra: 17.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "السَّابِعَ عَشَرَ", "trText": "17. On Yedinci", "muennes": "السَّابِعَةَ عَشْرَةَ" } } },
    "Sıra: 18.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الثَّامِنَ عَشَرَ", "trText": "18. On Sekizinci", "muennes": "الثَّامِنَةَ عَشْرَةَ" } } },
    "Sıra: 19.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "التَّاسِعَ عَشَرَ", "trText": "19. On Dokuzuncu", "muennes": "التَّاسِعَةَ عَشْرَةَ" } } },
    "Sıra: 20.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الْعِشْرُونَ", "trText": "20. Yirminci" } } },

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

    "جمعة": {
        "isDictOnly": true,
        "tip": "gun",
        "tekil": { base: { emoji: "🕌", arText: "الْجُمُعَة", trText: "Cuma (Toplanma günü)." } }
    },
    "سبت": {
        "isDictOnly": true,
        "tip": "gun",
        "tekil": { base: { emoji: "🛑", arText: "السَّبْت", trText: "Cumartesi (Dinlenme/Tatil günü)." } }
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
        "tekil": { base: { emoji: "📓", arText: "كُتَيِّب", trText: "Kitapçık (İsm-i Tasgir)." } },
        "cogul": { base: { emoji: "📚", arText: "كُتَيِّبَات", trText: "Kitapçıklar." } }
    },
    "رجيل": {
        "isDictOnly": true,
        "tip": "tasgir",
        "tekil": { base: { emoji: "🧍‍♂️", arText: "رُجَيْل", trText: "Adamcağız (İsm-i Tasgir)." } }
    },

    // --- MEYVELER ---
    "Meyve: Elma": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍎", arText: "تُفَّاح", trText: "Elma", ornek: { ar: "أَكَلْتُ تُفَّاحَةً", tr: "Bir elma yedim." } } } },
    "Meyve: Portakal": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍊", arText: "بُرْتُقال", trText: "Portakal", ornek: { ar: "عَصِيرُ الْبُرْتُقَالِ", tr: "Portakal suyu." } } } },
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
    "Meslek: Kasap": { isDictOnly: true, tip: "meslek", tekil: { base: { emoji: "🥩", arText: "جَزَّار", trText: "Kasap" } }, cogul: { base: { emoji: "🥩", arText: "جَزَّارُونَ", trText: "Kasaplar" } } },
    "Meslek: Bakkal": { isDictOnly: true, tip: "meslek", tekil: { base: { emoji: "🏪", arText: "بَقَّال", trText: "Bakkal" } }, cogul: { base: { emoji: "🏪", arText: "بَقَّالُونَ", trText: "Bakkallar" } } },
    "Meslek: Terzi": { isDictOnly: true, tip: "meslek", tekil: { base: { emoji: "🧵", arText: "خَيَّاط", trText: "Terzi" } }, cogul: { base: { emoji: "🧵", arText: "خَيَّاطُونَ", trText: "Terziler" } } },
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
    "Aile: Anne": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👩", "arText": "أُمّ", "trText": "Anne" } }, "cogul": { "base": { "emoji": "👩", "arText": "أُمَّهَات", "trText": "Anneler" } } },
    "Aile: Erkek Kardeş": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👦", "arText": "أَخ", "trText": "Erkek Kardeş" } }, "cogul": { "base": { "emoji": "👦", "arText": "إِخْوَة", "trText": "Kardeşler (Erkek)" } } },
    "Aile: Kız Kardeş": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👧", "arText": "أُخْت", "trText": "Kız Kardeş" } }, "cogul": { "base": { "emoji": "👧", "arText": "أَخَوَات", "trText": "Kız Kardeşler" } } },
    "Aile: Oğul": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👱‍♂️", "arText": "اِبْن", "trText": "Oğul" } }, "cogul": { "base": { "emoji": "👱‍♂️", "arText": "أَبْنَاء", "trText": "Oğullar" } } },
    "Aile: Kız Çocuk": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👱‍♀️", "arText": "بِنْت", "trText": "Kız Çocuk" } }, "cogul": { "base": { "emoji": "👱‍♀️", "arText": "بَنَات", "trText": "Kızlar" } } },
    "Aile: Nine": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👵", "arText": "جَدَّة", "trText": "Nine / Büyükanne" } }, "cogul": { "base": { "emoji": "👵", "arText": "جَدَّات", "trText": "Nineler" } } },
    "Aile: Amca": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "🧔", "arText": "عَمّ", "trText": "Amca (Babanın Kardeşi)" } }, "cogul": { "base": { "emoji": "🧔", "arText": "أَعْمَام", "trText": "Amcalar" } } },
    "Aile: Hala": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "🧕", "arText": "عَمَّة", "trText": "Hala" } }, "cogul": { "base": { "emoji": "🧕", "arText": "عَمَّات", "trText": "Halalar" } } },
    "Aile: Dayı": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👨‍🦰", "arText": "خَال", "trText": "Dayı (Annenin Kardeşi)" } }, "cogul": { "base": { "emoji": "👨‍🦰", "arText": "أَخْوَال", "trText": "Dayılar" } } },
    "Aile: Teyze": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👩‍🦰", "arText": "خَالَة", "trText": "Teyze" } }, "cogul": { "base": { "emoji": "👩‍🦰", "arText": "خَالَات", "trText": "Teyzeler" } } },
    "Aile: Koca": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "🤵", "arText": "زَوْج", "trText": "Eş (Koca)" } }, "cogul": { "base": { "emoji": "🤵", "arText": "أَزْوَاج", "trText": "Eşler (Kocalar)" } } },
    "Aile: Zevce": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👰", "arText": "زَوْجَة", "trText": "Eş (Kadın)" } }, "cogul": { "base": { "emoji": "👰", "arText": "زَوْجَات", "trText": "Eşler (Kadınlar)" } } },
    "Aile: Aile": { "isDictOnly": true, "tip": "aile", "tekil": { "base": { "emoji": "👨‍👩‍👧‍👦", "arText": "أُسْرَة", "trText": "Aile" } }, "cogul": { "base": { "emoji": "👨‍👩‍👧‍👦", "arText": "أُسَر", "trText": "Aileler" } } }
,

    // ==================================================================
    // BAĞLAÇLAR (Atıf Harfleri)
    // ==================================================================
    "Edat: Ve": { isDictOnly: true, tip: ["baglac", "harficer"], tekil: { base: { emoji: "➕", arText: "وَ", trText: "Ve / İle / Yemin harfi (Kasem)" } } },
    "Bağlaç: Fe": { isDictOnly: true, tip: "baglac", tekil: { base: { emoji: "⏭️", arText: "فَ", trText: "Hemen sonra / Bu yüzden" } } },
    "Bağlaç: Sümme": { isDictOnly: true, tip: "baglac", tekil: { base: { emoji: "⏳", arText: "ثُمَّ", trText: "Sonra / Daha sonra" } } },
    "Bağlaç: Ev": { isDictOnly: true, tip: "baglac", tekil: { base: { emoji: "🔀", arText: "أَوْ", trText: "Veya / Yahut" } } },
    "Bağlaç: Em": { isDictOnly: true, tip: "baglac", tekil: { base: { emoji: "⚖️", arText: "أَمْ", trText: "Yoksa / Veya" } } },
    "نول": {
        33: { word: "نَائِل", meaning: "Erişen / Ulaşan / Nâil olan", type: "İsm-i Fail", refId: "33", root: "نول" },
        64: { word: "نَاوَلَ", meaning: "Verdi / Uzattı / Sundu", type: "Mazi", refId: "64", root: "نول", m: ["67", "68"] },
        65: { word: "يُنَاوِلُ", meaning: "Verir / Uzatır / Sunar", type: "Muzari", refId: "65", root: "نول" },
        66: { word: "نَاوِلْ", meaning: "Ver / Uzat / Sun", type: "Emir", refId: "66", root: "نول" },
        67: { word: "مُنَاوَلَة", meaning: "Vermek / Uzatmak", type: "Mastar", refId: "67", root: "نول" },
        68: { word: "نِوَال", meaning: "Vermek / Bahşiş", type: "Mastar", refId: "68", root: "نول" },
        69: { word: "مُنَاوِل", meaning: "Veren / Uzatan", type: "İsm-i Fail", refId: "69", root: "نول" },
        70: { word: "مُنَاوَل", meaning: "Kendisine verilen / Uzatılan", type: "İsm-i Meful", refId: "70", root: "نول" },
        94: { word: "تَنَاوَلَ", meaning: "Aldı / Yedi / Ele aldı", type: "Mazi", refId: "94", root: "نول", m: ["97"] },
        95: { word: "يَتَنَاوَلُ", meaning: "Alır / Yer / Ele alır", type: "Muzari", refId: "95", root: "نول" },
        96: { word: "تَنَاوَلْ", meaning: "Al / Ye / Ele al", type: "Emir", refId: "96", root: "نول" },
        97: { word: "تَنَاوُل", meaning: "Almak / Yemek / Ele almak", type: "Mastar", refId: "97", root: "نول" },
        98: { word: "مُتَنَاوِل", meaning: "Alan / Yiyen / Ele alan", type: "İsm-i Fail", refId: "98", root: "نول" },
        99: { word: "مُتَنَاوَل", meaning: "Alınan / Yenilen / Ele alınan", type: "İsm-i Meful", refId: "99", root: "نول" }
    },
    "Bağlaç: Bel": { isDictOnly: true, tip: "baglac", tekil: { base: { emoji: "🔙", arText: "بَلْ", trText: "Aksine / Bilakis" } } },
    "Bağlaç: Li-enne": { isDictOnly: true, tip: "baglac", hasZamirCekimi: true, tekil: { base: { emoji: "💡", arText: "لِأَنَّ", trText: "Çünkü / -dığı için" } } },
    "Bağlaç: Lakin": { isDictOnly: true, tip: "baglac", hasZamirCekimi: true, zamirBase: "لَكِنَّ", tekil: { base: { emoji: "✋", arText: "لَكِنْ", trText: "Fakat / Ancak" } } },
        "Bağlaç: Hatta": { isDictOnly: true, tip: ["baglac", "harficer"], tekil: { base: { emoji: "🏁", arText: "حَتَّى", trText: "Hatta (Bağlaç) / -e kadar (Harf-i Cer)" } } }
};

// Kökler dosyasındaki eski sözlük verilerini yeni sözlük verileriyle birleştir
if (typeof wordEasterEggs !== 'undefined') {
    Object.assign(sozlukVerileri, wordEasterEggs);
}
