/* KONU ÖBEKLERİ — kelime listeleri ekranında başlıklar bu öbeklerin
   altında gruplanır. Sıra buradaki tanım sırasıdır. */
const kategoriGruplari = {
    "dilbilgisi": { title: "Dilbilgisi Yapıları", icon: "📘" },
    "sayizaman":  { title: "Sayılar ve Takvim",   icon: "🔢" },
    "insan":      { title: "İnsan ve Yaşam",      icon: "🧑" },
    "yeme":       { title: "Yeme ve İçme",        icon: "🍽️" },
    "doga":       { title: "Doğa ve Canlılar",    icon: "🌿" },
    "dunya":      { title: "Dünya",               icon: "🌍" },
    "genel":      { title: "Genel Kelimeler",     icon: "🏷️" }
};

/* "Genel İsimler" listesi de kaldırıldı: konu başlığı değil, hiçbir
   konuya girmeyen kelimelerin döküldüğü bir torbaydı; öğrenciye ne
   öğreteceğini söylemiyordu. tip: "isim" etiketi verilerde duruyor,
   yalnız kendi listesi açılmıyor.

   İSM-İ TASGİR ve İSM-İ TAFDİL listeleri kaldırıldı: ikisi de birer
   VEZİN, konu değil. Tabloda 49 (فُعَيْل) ve 50/51 (أَفْعَل / فُعْلَى)
   kutularına dokununca aynı kelimeler zaten örnekleriyle listeleniyordu;
   burada ikinci kez durmaları konu listelerini kalabalıklaştırıyordu.
   Sözlük verilerindeki tip: "tasgir" / "tafdil" etiketleri korundu —
   kelime kartı türü yazmaya devam ediyor, yalnız kendi listesi açılmıyor. */
const kategoriTanimlari = {
    "olumsuz":  { title: "Olumsuzluk Edatları", arTitle: "أَدَوات النَّفْي", icon: "🚫", grup: "dilbilgisi", items: [] },
    "sart":     { title: "Şart Edatları", arTitle: "أَدَوات الشَّرْط", icon: "⚖️", grup: "dilbilgisi", items: [] },
    "soru":     { title: "Soru Edatları", arTitle: "أَدَوات الاسْتِفْهام", icon: "❓", grup: "dilbilgisi", items: [] },
    "harficer": { title: "Harf-i Cerler", arTitle: "حُروف الجَرّ", icon: "🔤", grup: "dilbilgisi", items: [] },
    "baglac":   { title: "Bağlaçlar", arTitle: "حُروف العَطْف", icon: "🔗", grup: "dilbilgisi", items: [] },
    "zamir":    { title: "Kişi Zamirleri", arTitle: "الضَّمائِر", icon: "👤", grup: "dilbilgisi", items: [] },
    "isaret":   { title: "İşaret Zamirleri", arTitle: "أَسْماء الإِشارَة", icon: "👇", grup: "dilbilgisi", items: [] },
    "mevsul":   { title: "İsmi Mevsuller", arTitle: "الأَسْماء المَوْصولَة", icon: "🪢", grup: "dilbilgisi", items: [] },
    "zaman":    { title: "Zaman İfadeleri", arTitle: "ظُروف الزَّمان", icon: "⏱️", grup: "dilbilgisi", items: [] },
    "zarf":     { title: "Mekân Zarfları", arTitle: "ظُروف المَكان", icon: "📍", grup: "dilbilgisi", items: [] },

    "sayi":     { title: "Sayılar", arTitle: "الأَرْقام وَالأَعْداد", icon: "🔢", grup: "sayizaman", items: [] },
    "sirasayi": { title: "Sıra Sayıları", arTitle: "الأَعْداد التَّرْتيبِيَّة", icon: "📊", grup: "sayizaman", items: [] },
    "gun":      { title: "Haftanın Günleri", arTitle: "أَيّام الأُسْبوع", icon: "📅", grup: "sayizaman", items: [] },
    "mevsim":   { title: "Mevsimler", arTitle: "الفُصُول", icon: "🍂", grup: "sayizaman", items: [] },

    "uzuv":     { title: "Vücut Organları", arTitle: "أَعْضاء الجِسْم", icon: "🫀", grup: "insan", items: [] },
    "aile":     { title: "Aile Bireyleri", arTitle: "أَفْراد الأُسْرَة", icon: "👨‍👩‍👧‍👦", grup: "insan", items: [] },
    "saglik":   { title: "Sağlık", arTitle: "الصِّحَّة", icon: "🩺", grup: "insan", items: [] },
    "meslek":   { title: "Meslekler", arTitle: "المِهَن", icon: "💼", grup: "insan", items: [] },
    "kiyafet":  { title: "Giysiler", arTitle: "المَلابِس", icon: "👕", grup: "insan", items: [] },
    "esya":     { title: "Ev Eşyaları", arTitle: "أَثاث البَيْت", icon: "🛋️", grup: "insan", items: [] },
    "okul":     { title: "Okul", arTitle: "المَدْرَسَة", icon: "🏫", grup: "insan", items: [] },
    "ulasim":   { title: "Ulaşım Araçları", arTitle: "وَسائِل النَّقْل", icon: "🚗", grup: "insan", items: [] },

    "meyve":    { title: "Meyveler", arTitle: "الفَواكِه", icon: "🍎", grup: "yeme", items: [] },
    "sebze":    { title: "Sebzeler", arTitle: "الخُضْرَوات", icon: "🥦", grup: "yeme", items: [] },
    "yiyecek":  { title: "Yiyecekler", arTitle: "الأَطْعِمَة", icon: "🍔", grup: "yeme", items: [] },
    "icecek":   { title: "İçecekler", arTitle: "المَشْروبات", icon: "☕", grup: "yeme", items: [] },

    "doga":     { title: "Doğa", arTitle: "الطَّبيعَة", icon: "🌿", grup: "doga", items: [] },
    "kus":      { title: "Kuşlar", arTitle: "الطُّيور", icon: "🐦", grup: "doga", items: [] },
    "bocek":    { title: "Böcekler", arTitle: "الحَشَرات", icon: "🐞", grup: "doga", items: [] },
    "deniz":    { title: "Deniz Canlıları", arTitle: "الكائِنات البَحْرِيَّة", icon: "🐟", grup: "doga", items: [] },
    "evcil":    { title: "Evcil ve Çiftlik Hayvanları", arTitle: "الحَيَوانات الأَليفَة", icon: "🐄", grup: "doga", items: [] },
    "yabani":   { title: "Yabani Hayvanlar", arTitle: "الحَيَوانات البَرِّيَّة", icon: "🦁", grup: "doga", items: [] },

    "ulke":     { title: "Ülkeler", arTitle: "البُلْدان", icon: "🌍", grup: "dunya", items: [] },
    "sehir":    { title: "Şehirler", arTitle: "المُدُن", icon: "🏙️", grup: "dunya", items: [] },
    "kita":     { title: "Kıtalar", arTitle: "القارّات", icon: "🌐", grup: "dunya", items: [] },
    /* 6. sınıf 5. ünitesi (الأَماكِن المُقَدَّسَة) buraya dayanıyor: Mekke,
       Medine ve Kudüs'teki mekânlar tek listede toplandı. */
    "mukaddes": { title: "Kutsal Mekânlar", arTitle: "الأَماكِن المُقَدَّسَة", icon: "🕋", grup: "dunya", items: [] },
    /* 7. sınıf Mektep kitabındaki mekân isimleri (dükkân, kilise, kule…) için.
       "zarf" listesi mekân ZARFLARI (أمام/خلف) içindir, mekân İSİMLERİ değil. */
    "mekan":    { title: "Mekânlar", arTitle: "الأَماكِن", icon: "🏛️", grup: "dunya", items: [] },

    "renk":     { title: "Renkler", arTitle: "الأَلْوان", icon: "🎨", grup: "genel", items: [] },
    "sifat":    { title: "Sıfatlar", arTitle: "الصِّفات", icon: "✨", grup: "genel", items: [] },
    "kalip":    { title: "Kalıplar ve İfadeler", arTitle: "التَّعْبيرات وَالقَوالِب", icon: "💬", grup: "genel", items: [] }
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
            "not": "الوَزْن: فَعْلَاء (Sıfat-ı Müşebbehe / Müennes)",
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
            "not": "الوَزْن: أَفْعَل (Sıfat-ı Müşebbehe / Müzekker)",
            "isDictOnly": true
        },
        "200": {
            "base": {
                "arText": "شِيمَة",
                "trText": "Huy / Karakter / Adet",
                "emoji": "🧬"
            },
            "ornek": {
                "ar": "الكَرَمُ مِنْ شِيَمِ العَرَبِ.",
                "tr": "Cömertlik, Arapların huylarındandır."
            },
            "isDictOnly": true
        }
    },
    "İsim: Hadise": { isDictOnly: true, tekil: { base: { emoji: "💥", arText: "حَادِثَة", trText: "Hadise / Olay" } }, cogul: "حَوَادِث", cogulTr: "Hadiseler" },
    "Kalıp: İyi Akşamlar": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🌙", arText: "مَساء الخَيْر", trText: "İyi Akşamlar", ornek: { ar: "مَساء الخَيْر لِلْجَميع", tr: "Herkese iyi akşamlar." } } } },
    "Kalıp: Nasılsın": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "❓", arText: "كَيْف حالُكَ؟", trText: "Nasılsın?", ornek: { ar: "مَرْحَبًا، كَيْف حالُكَ اليَوْم؟", tr: "Merhaba, bugün nasılsın?" } } } },
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
    "Zaman: İkindi": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌇", arText: "عَصْر", trText: "İkindi / Yüzyıl" } } },
    "Zarf: Çok": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "💯", arText: "جِدًّا", trText: "Çok" } } },
    "Zarf: Çokça": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "📈", arText: "كَثيرًا", trText: "Çok / Çokça" } } },
    "Cevap: Evet": { isDictOnly: true, tekil: { base: { emoji: "✅", arText: "نَعَمْ", trText: "Evet" } } },
    "Cevap: Peki": { isDictOnly: true, tekil: { base: { emoji: "👍", arText: "حَسَنًا", trText: "Peki / Tamam" } } },
    "İsim: Bütün": { isDictOnly: true, tekil: { base: { emoji: "⭕", arText: "كُلّ", trText: "Bütün / Her" } } },
    "İsim: Şeyler": { isDictOnly: true, tekil: { base: { emoji: "📦", arText: "شَيْء", trText: "Şey" } }, cogul: "أَشْياء", cogulTr: "Şeyler" },
    "İsim: Sandık": { isDictOnly: true, tekil: { base: { emoji: "🧰", arText: "صُنْدوق", trText: "Sandık / Kutu" } }, cogul: "صَناديق", cogulTr: "Sandıklar" },
    "İsim: Adres": { isDictOnly: true, tekil: { base: { emoji: "📍", arText: "عُنْوَان", trText: "Adres / Başlık" } }, cogul: "عَناوين", cogulTr: "Adresler" },
    "Sıfat: Taze": { isDictOnly: true, tekil: { base: { emoji: "🍃", arText: "طازَج", trText: "Taze" } } },


    // =================================================================================================
    // YENİ EKLENEN KELİMELER (TEKİL / ÇOĞUL EŞLEŞTİRMELİ)
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
    "Zaman: Bugün": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "📅", arText: "اليَوْمَ", trText: "Bugün" } } },
    "Zaman: Dün": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏪", arText: "أَمْسِ", trText: "Dün" } } },
    /* سَنَة câmid isimdir: س ن و diye üretken bir kök yoktur, çoğulu
       ve nisbeti kelimenin kendisinden gider. */
    "Zaman: Yıl": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "📅", arText: "سَنَة", trText: "Yıl, sene", ornek: { ar: "قُلْتَ أَرْبَعونَ قَبْلَ عَشْرِ سَنَواتٍ", tr: "On yıl önce de kırk demiştin." } }, "يّ": { emoji: "📆", arText: "سَنَوِيّ", trText: "Yıllık, senelik (nisbet)." } }, cogul: { base: { emoji: "🗓️", arText: "سَنَوات", trText: "Yıllar, seneler", ornek: { ar: "دَرَسْنا مَعًا ثَلاثَ سَنَواتٍ", tr: "Üç yıl birlikte okuduk." } } } },
    "Zaman: Yarın": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏩", arText: "غَداً", trText: "Yarın" } } },
    "Zaman: Şimdi": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏱️", arText: "الآنَ", trText: "Şimdi / Şu an" } } },
    "Zaman: Sabah": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌅", arText: "صَبَاحاً", trText: "Sabah" } } },
    "Zaman: Akşam": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌆", arText: "مَساءً", trText: "Akşam" } } },
    "Zaman: Gece": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌃", arText: "لَيْلاً", trText: "Gece" } } },
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
    /* عِنْدَ TEK KAYIT. Eskiden bir de "Zarf: Yanında (Sahiplik)" vardı;
       aramada aynı kelime iki kez çıkıyor, birinde zamir çekimi oluyor
       ötekinde olmuyordu. Örnek cümle oradan buraya alındı. */
    "Edat: Inde Leda": { isDictOnly: true, tip: ["zaman", "zarf"], hasZamirCekimi: true, zamirBase: "عِنْدَ / لَدَى", tekil: { base: { emoji: "👥", arText: "عِنْدَ / لَدَى", trText: "Yanında / Katında / Sahip", ornek: { ar: "عِنْدِي كِتَابٌ جَدِيدٌ", tr: "Bende yeni bir kitap var." } } } },
    "Zarf: Arasında": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "↔️", arText: "بَيْنَ", trText: "Arasında" } } },
    "Zarf: Etrafında": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "🔄", arText: "حَوْلَ", trText: "Çevresinde / Etrafında" } } },
    "Zarf: İçinde": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "📥", arText: "دَاخِلَ", trText: "İçinde" } } },
    "Zarf: Dışında": { isDictOnly: true, tip: "zarf", hasZamirCekimi: true, tekil: { base: { emoji: "📤", arText: "خَارِجَ", trText: "Dışında" } } },
    "Zarf: Burada": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "📍", arText: "هُنَا", trText: "Burada" } } },
    "Zarf: Orada": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "🗺️", arText: "هُنَاكَ / هُنَالِكَ", trText: "Orada / Şurada" } } },

    // --- Soru Edatları ---
    "Soru: Maza": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "❓", arText: "مَاذَا", trText: "Ne? / Neler?" } } },
    "Edat: Ma": { isDictOnly: true, tip: ["soru", "mevsul", "olumsuz"], tekil: { base: { emoji: "📦", arText: "مَا", trText: "Ne? / O şey ki / Değil (Olumsuzluk)" } } },
    "Soru: Nerede": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "📍", arText: "أَيْن", trText: "Nerede?" } } },
    "Soru: Ne Zaman": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "⏰", arText: "مَتَى", trText: "Ne Zaman?" } } },
    "Soru: Nasıl": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🤷", arText: "كَيْف", trText: "Nasıl?" } } },
    "Edat: Men": { isDictOnly: true, tip: ["soru", "mevsul", "sart"], tekil: { base: { emoji: "👤", arText: "مَنْ", trText: "Kim? / O kimse ki / Kim ... yaparsa (Şart)" } } },
    "Soru: Neden": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🤔", arText: "لِمَاذَا", trText: "Neden? / Niçin?" } } },
    "Soru: Hangi": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🔀", arText: "أَيُّ", trText: "Hangi?" } } },
    "Soru: Kaç": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🔢", arText: "كَمْ", trText: "Kaç? / Ne Kadar?" } } },
    "Soru: Mi 1": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "❔", arText: "هَلْ", trText: "Mı? / Mi? (Soru edatı)" } } },
    "Soru: Mi 2": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "❔", arText: "أَ", trText: "Mı? / Mi? (Soru harfi)" } } },

    "Soru: Bimaza": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "🤷‍♂️", arText: "بِمَاذَا", trText: "Ne ile? / Neye?" } } },
    "Soru: Ila eyne": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "➡️", arText: "إِلَى أَيْن", trText: "Nereye?" } } },
    "Soru: Min eyne": { isDictOnly: true, tip: "soru", tekil: { base: { emoji: "⬅️", arText: "مِنْ أَيْن", trText: "Nereden?" } } },
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
        "tip": "okul",
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
        "tip": "okul",
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
        "tip": "okul",
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
        "tip": "esya",
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
        "tip": "esya",
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
        "tip": "doga",
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
        "tip": "doga",
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
        "tip": "doga",
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

    // ==================================================================
    // BALIK KELİMESİ
    // ==================================================================

    // ==================================================================
    // KÖPEK KELİMESİ
    // ==================================================================
    "كلب": {
        "isDictOnly": true,
        "tip": "evcil",
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
        "tip": "evcil",
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
        "tip": "evcil",
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
        "tip": "yabani",
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
        "tip": "kus",
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
        "tip": "evcil",
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
        "tip": "evcil",
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
        "tip": "evcil",
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
        "tip": "yabani",
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
        "tip": "yabani",
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
        "tip": "evcil",
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
        "tip": ["kus", "evcil"],
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
        "tip": "deniz",
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
        "tip": "bocek",
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
        "tip": "bocek",
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
        "tip": "yabani",
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
        "tip": "yabani",
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
        "tip": "evcil",
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
        "tip": "yabani",
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
        "tip": "yabani",
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
        "tip": "yabani",
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
        "tip": "yabani",
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
        "tip": "yabani",
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
        "tip": "yabani",
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
        "tip": "yabani",
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
        "tip": "yabani",
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
        "tip": "deniz",
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
        "tip": "deniz",
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
        "tip": "bocek",
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
        "tip": "bocek",
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
        "tip": "bocek",
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
        "tip": "bocek",
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
        "tip": "bocek",
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
        "tip": "bocek",
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
        "tip": "kus",
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
        "tip": "kus",
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
        "tip": "kus",
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
        "tip": "kus",
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
        "tip": "kus",
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
        "tip": "kus",
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
        "tip": "kus",
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
        "tip": "deniz",
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
        "tip": "deniz",
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
        "tip": "deniz",
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
        "tip": "deniz",
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
        "tip": "deniz",
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
        "tip": "bocek",
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
        "tip": "kus",
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
        "tip": "yabani",
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
        "tip": "yabani",
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
    // ADAM KELİMESİ
    // ==================================================================
    "رجل": {
        "isDictOnly": true,
        "tip": "uzuv",
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
        /* يَد câmid bir isimdir (türetilmemiştir); bu yüzden kökler dosyasında
       değil burada durur. Nisbeti يَدَوِيّ ve ikinci çoğulu أَيادي de
       kelimenin kendi girdisine bağlıdır. */
    "يد": {
        "isDictOnly": true,
        "tip": "uzuv",
        "tekil": {
            base: { emoji: "✋", arText: "يَد", trText: "El" },
            "يّ": { emoji: "🖐️", arText: "يَدَوِيّ", trText: "El ile yapılan, el işi (nisbet).", ornek: { ar: "التَّجْليدُ عَمَلٌ يَدَوِيٌّ", tr: "Ciltleme bir el işidir." } },
            "يَّة": { emoji: "🧶", arText: "يَدَوِيَّة", trText: "El ile yapılan (müennes).", ornek: { ar: "مَعْرِضُ الفُنونِ اليَدَوِيَّةِ", tr: "El sanatları fuarı." } }
        },
        "cogul": {
            base: { emoji: "✋", arText: "أَيْدٍ", trText: "Eller" },
            "ثاني": { emoji: "🙌", arText: "أَيادي", trText: "Eller (ikinci çoğul).", ornek: { ar: "تَقْبيلُ الأَيادي", tr: "El öpme." } }
        }
    },

    // ==================================================================
    // AYAK KELİMESİ
    // ==================================================================
    "قدم": {
        "isDictOnly": true,
        "tip": "uzuv",
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
        "tip": "uzuv",
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
        "tip": "doga",
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
        "tip": "doga",
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
    // ATEŞ KELİMESİ
    // ==================================================================
    "نار": {
        "isDictOnly": true,
        "tip": "doga",
        "tekil": {
            base: { emoji: "🔥", arText: "نار", trText: "Ateş" }
        },
        "cogul": { 
            base: { emoji: "🔥", arText: "نيران", trText: "Ateşler" }
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
        "tip": ["okul", "esya"],
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
        "tip": "esya",
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
        "tip": "esya",
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
    
    "Sıra: 1.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الأَوَّل", "trText": "1. Birinci", "muennes": "الأُولَى" } } },




    "Sıra: 2.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الثَّانِي", "trText": "2. İkinci", "muennes": "الثَّانِيَة" } } },
    "Sıra: 3.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الثَّالِث", "trText": "3. Üçüncü", "muennes": "الثَّالِثَة" } } },
    "Sıra: 4.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الرَّابِع", "trText": "4. Dördüncü", "muennes": "الرَّابِعَة" } } },
    "Sıra: 5.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الخَامِس", "trText": "5. Beşinci", "muennes": "الخَامِسَة" } } },
    "Sıra: 6.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "السَّادِس", "trText": "6. Altıncı", "muennes": "السَّادِسَة" } } },
    "Sıra: 7.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "السَّابِع", "trText": "7. Yedinci", "muennes": "السَّابِعَة" } } },
    "Sıra: 8.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الثَّامِن", "trText": "8. Sekizinci", "muennes": "الثَّامِنَة" } } },
    "Sıra: 9.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "التَّاسِع", "trText": "9. Dokuzuncu", "muennes": "التَّاسِعَة" } } },
    "Sıra: 10.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "العَاشِر", "trText": "10. Onuncu", "muennes": "العَاشِرَة" } } },
    "Sıra: 11.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الحَادِيَ عَشَرَ", "trText": "11. On Birinci", "muennes": "الحَادِيَةَ عَشْرَةَ" } } },
    "Sıra: 12.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الثَّانِيَ عَشَرَ", "trText": "12. On İkinci", "muennes": "الثَّانِيَةَ عَشْرَةَ" } } },
    "Sıra: 13.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الثَّالِثَ عَشَرَ", "trText": "13. On Üçüncü", "muennes": "الثَّالِثَةَ عَشْرَةَ" } } },
    "Sıra: 14.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الرَّابِعَ عَشَرَ", "trText": "14. On Dördüncü", "muennes": "الرَّابِعَةَ عَشْرَةَ" } } },
    "Sıra: 15.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الخَامِسَ عَشَرَ", "trText": "15. On Beşinci", "muennes": "الخَامِسَةَ عَشْرَةَ" } } },
    "Sıra: 16.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "السَّادِسَ عَشَرَ", "trText": "16. On Altıncı", "muennes": "السَّادِسَةَ عَشْرَةَ" } } },
    "Sıra: 17.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "السَّابِعَ عَشَرَ", "trText": "17. On Yedinci", "muennes": "السَّابِعَةَ عَشْرَةَ" } } },
    "Sıra: 18.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "الثَّامِنَ عَشَرَ", "trText": "18. On Sekizinci", "muennes": "الثَّامِنَةَ عَشْرَةَ" } } },
    "Sıra: 19.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "التَّاسِعَ عَشَرَ", "trText": "19. On Dokuzuncu", "muennes": "التَّاسِعَةَ عَشْرَةَ" } } },
    "Sıra: 20.": { "isDictOnly": true, "tip": "sirasayi", "tekil": { "base": { "emoji": "🔢", "arText": "العِشْرُونَ", "trText": "20. Yirminci" } } },

    // AI_PROMPT: HAFTANIN GÜNLERİ, SAYILAR, İSM-İ TASGİR, İSM-İ TAFDİL İÇİN YÖNERGE
    // Haftanın günleri için: tip: "gun" (Örn: "Pazartesi": { isDictOnly: true, tip: "gun", tekil: { ... } })
    // Sayılar için: tip: "sayi" (Örn: "Sayı 1": { isDictOnly: true, tip: "sayi", tekil: { ... } })
    // İsm-i Tasgir için: tip: "tasgir", İsm-i Tafdil için: tip: "tafdil" kullanılmalıdır.

    // HAFTANIN GÜNLERİ (أيام الأسبوع)
    // ==================================================================
    "أحد": {
        "isDictOnly": true,
        "tip": "gun",
        "tekil": { base: { emoji: "🌞", arText: "الأَحَد", trText: "Pazar (Haftanın 1. günü)." } }
    },
    "اثنين": {
        "isDictOnly": true,
        "tip": "gun",
        "tekil": { base: { emoji: "🌙", arText: "الاثْنَيْن", trText: "Pazartesi (Haftanın 2. günü)." } }
    },
    /* Salı ve Çarşamba eksikti; hafta yedi günle tamamlansın diye eklendi.
       (Perşembe خمس kökünden فَعِيل kalıbıyla veri_kokler'den geliyor.) */
    "ثلاثاء": {
        "isDictOnly": true,
        "tip": "gun",
        "tekil": { base: { emoji: "3️⃣", arText: "الثُّلَاثَاء", trText: "Salı (Haftanın 3. günü).", ornek: { ar: "عِنْدَنَا امْتِحَانٌ يَوْمَ الثُّلَاثَاءِ", tr: "Salı günü sınavımız var." } } }
    },
    "أربعاء": {
        "isDictOnly": true,
        "tip": "gun",
        "tekil": { base: { emoji: "4️⃣", arText: "الأَرْبِعَاء", trText: "Çarşamba (Haftanın 4. günü).", ornek: { ar: "يَبْدَأُ الدَّرْسُ يَوْمَ الأَرْبِعَاءِ", tr: "Ders çarşamba günü başlıyor." } } }
    },

    "جمعة": {
        "isDictOnly": true,
        "tip": "gun",
        "tekil": { base: { emoji: "🕌", arText: "الجُمُعَة", trText: "Cuma (Toplanma günü)." } }
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
    "Meyve: Portakal": { isDictOnly: true, tip: "meyve", tekil: { base: { emoji: "🍊", arText: "بُرْتُقال", trText: "Portakal", ornek: { ar: "عَصِيرُ البُرْتُقَالِ", tr: "Portakal suyu." } } } },
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
    "Yiyecek: Ekmek": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🍞", arText: "خُبْز", trText: "Ekmek", ornek: { ar: "خُبْزٌ طَازَجٌ", tr: "Taze ekmek." } } }, cogul: { base: { emoji: "🍞", arText: "أَخْبَاز", trText: "Ekmekler" } } },
    "Yiyecek: Et": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🥩", arText: "لَحْم", trText: "Et", ornek: { ar: "أَكَلْتُ اللَّحْمَ", tr: "Et yedim." } } }, cogul: { base: { emoji: "🥩", arText: "لُحُوم", trText: "Etler" } } },
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
    /* ماء da câmiddir; مائِيّ onun nisbetidir. م و ه diye bir kök
       açıp «su sporları»nı oradan türetmek doğru olmaz. */
    "İçecek: Su": { isDictOnly: true, tip: "icecek", tekil: { base: { emoji: "💧", arText: "مَاء", trText: "Su", ornek: { ar: "شَرِبْتُ المَاءَ", tr: "Su içtim." } }, "يّ": { emoji: "🚤", arText: "مائِيّ", trText: "Suya ait, su …ı (nisbet)." }, "يَّة": { emoji: "🏊", arText: "مائِيَّة", trText: "Suya ait (müennes).", ornek: { ar: "السِّباحَةُ رِياضَةٌ مائِيَّةٌ", tr: "Yüzme bir su sporudur." } } }, cogul: { base: { emoji: "💧", arText: "مِيَاه", trText: "Sular" } } },
    "İçecek: Çay": { isDictOnly: true, tip: "icecek", tekil: { base: { emoji: "🍵", arText: "شَاي", trText: "Çay" } } },
    "İçecek: Kahve": { isDictOnly: true, tip: "icecek", tekil: { base: { emoji: "☕", arText: "قَهْوَة", trText: "Kahve" } } },
    "İçecek: Süt": { isDictOnly: true, tip: "icecek", tekil: { base: { emoji: "🥛", arText: "حَلِيب", trText: "Süt" } } },
    "İçecek: Meyve Suyu": { isDictOnly: true, tip: "icecek", tekil: { base: { emoji: "🧃", arText: "عَصِير", trText: "Meyve Suyu", ornek: { ar: "عَصِيرُ التُّفَّاحِ", tr: "Elma suyu." } } } }

,

    "Otobüs": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚌", arText: "حَافِلَة", trText: "Otobüs" } } },
    "Kamyon": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚚", arText: "شَاحِنَة", trText: "Kamyon" } } },
    "Tren": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚂", arText: "قِطَار", trText: "Tren" } } },
    "Uçak": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "✈️", arText: "طَائِرَة", trText: "Uçak" } } },
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
        "Bağlaç: Hatta": { isDictOnly: true, tip: ["baglac", "harficer"], tekil: { base: { emoji: "🏁", arText: "حَتَّى", trText: "Hatta (Bağlaç) / -e kadar (Harf-i Cer)" } } },

    /* ====================================================================
       5. SINIF — KÖK KÖKENLİ OLMAYAN (câmid) İSİMLER
       muhadese/veri/5_*.js müfredatından. Çoğulu olanlar tekil+çoğul
       çifti hâlinde, ilgili liste id'siyle (tip) tanımlandı.
       ==================================================================== */
    "İsim: Masa": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🪑",
                arText: "طاوِلَة",
                trText: "Masa",
                ornek: { ar: "اَلكُرْسِيُّ بِجانِبِ الطّاوِلَةِ", tr: "Sandalye masanın yanındadır." }
            }
        },
        cogul: "طاوِلات",
        cogulTr: "Masalar"
    },

    "İsim: Salon": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🛋️",
                arText: "صالَة",
                trText: "Salon",
                ornek: { ar: "اَلصّالَةُ واسِعَةٌ وَنَظيفَةٌ", tr: "Salon geniş ve temizdir." }
            }
        },
        cogul: "صالات",
        cogulTr: "Salonlar"
    },

    "İsim: Fırın": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🔥",
                arText: "فُرْن",
                trText: "Fırın",
                ornek: { ar: "في المَطْبَخِ فُرْنٌ جَديدٌ", tr: "Mutfakta yeni bir fırın var." }
            }
        },
        cogul: "أَفْران",
        cogulTr: "Fırınlar"
    },

    "İsim: Televizyon": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "📺",
                arText: "تِلْفاز",
                trText: "Televizyon",
                ornek: { ar: "اَلتِّلْفازُ في الصّالَةِ", tr: "Televizyon salondadır." }
            }
        },
        cogul: "تِلْفازات",
        cogulTr: "Televizyonlar"
    },

    "İsim: Koltuk": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🛋️",
                arText: "أَريكَة",
                trText: "Koltuk, kanepe",
                ornek: { ar: "جَلَسْنا عَلَى الأَريكَةِ", tr: "Koltuğa oturduk." }
            }
        },
        cogul: "أَرائِك",
        cogulTr: "Koltuklar"
    },

    "İsim: Tahta": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🖍️",
                arText: "سَبّورَة",
                trText: "Tahta (yazı tahtası)",
                ornek: { ar: "اَلسَّبّورَةُ أَمامَ الطُّلّابِ", tr: "Tahta öğrencilerin önündedir." }
            }
        },
        cogul: "سَبّورات",
        cogulTr: "Tahtalar"
    },

    "İsim: Silgi": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🧽",
                arText: "مِمْحاة",
                trText: "Silgi",
                ornek: { ar: "هَذِهِ مِمْحاتي وَتِلْكَ مِمْحاتُكَ", tr: "Bu benim silgim, şu da senin silgin." }
            }
        },
        cogul: "مَماحٍ",
        cogulTr: "Silgiler"
    },

    "İsim: Yatak": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🛏️",
                arText: "سَرير",
                trText: "Yatak, karyola",
                ornek: { ar: "في غُرْفَتي سَريرانِ", tr: "Odamda iki yatak var." }
            }
        },
        cogul: "أَسِرَّة",
        cogulTr: "Yataklar"
    },

    "İsim: Hastane": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🏥",
                arText: "مُسْتَشْفَى",
                trText: "Hastane",
                ornek: { ar: "أُمّي طَبيبَةٌ في المُسْتَشْفَى", tr: "Annem hastanede doktordur." }
            }
        },
        cogul: "مُسْتَشْفَيات",
        cogulTr: "Hastaneler"
    },

    "İsim: Aile": {
        isDictOnly: true,
        tip: "aile",
        tekil: {
            base: {
                emoji: "👨‍👩‍👧‍👦",
                arText: "عائِلَة",
                trText: "Aile",
                ornek: { ar: "هَذِهِ عائِلَتي وَهِيَ كَبيرَةٌ", tr: "Bu benim ailem ve kalabalıktır." }
            }
        },
        cogul: "عائِلات",
        cogulTr: "Aileler"
    },

    "İsim: Ev Hanımı": {
        isDictOnly: true,
        tip: "meslek",
        tekil: {
            base: {
                emoji: "🏡",
                arText: "رَبَّة بَيْت",
                trText: "Ev hanımı",
                ornek: { ar: "أُمّي رَبَّةُ بَيْتٍ", tr: "Annem ev hanımıdır." }
            }
        },
        cogul: "رَبّات بُيوت",
        cogulTr: "Ev hanımları"
    },

    "İsim: Ağız": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "👄",
                arText: "فَم",
                trText: "Ağız",
                ornek: { ar: "اِفْتَحْ فَمَكَ يا وَلَدي", tr: "Ağzını aç yavrum." }
            }
        },
        cogul: "أَفْواه",
        cogulTr: "Ağızlar"
    },

    "İsim: Misafir": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🫂",
                arText: "ضَيْف",
                trText: "Misafir, konuk",
                ornek: { ar: "اَلضَّيْفُ ضَيْفُ اللهِ", tr: "Misafir Allah'ın misafiridir." }
            }
        },
        cogul: "ضُيوف",
        cogulTr: "Misafirler"
    },

    "İsim: Elbise": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "👕",
                arText: "ثَوْب",
                trText: "Elbise, giysi",
                ornek: { ar: "ثَوْبي نَظيفٌ وَجَميلٌ", tr: "Elbisem temiz ve güzeldir." }
            }
        },
        cogul: "ثِياب",
        cogulTr: "Elbiseler"
    },

    "İsim: Yağ": {
        isDictOnly: true,
        tip: "yiyecek",
        tekil: {
            base: {
                emoji: "🫒",
                arText: "زَيْت",
                trText: "Yağ (sıvı yağ)",
                ornek: { ar: "زَيْتُ الزَّيْتونِ مُفيدٌ لِلصِّحَّةِ", tr: "Zeytinyağı sağlığa faydalıdır." }
            }
        },
        cogul: "زُيوت",
        cogulTr: "Yağlar"
    },

    "İsim: Gölge": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🌳",
                arText: "ظِلّ",
                trText: "Gölge",
                ornek: { ar: "جَلَسْنا في ظِلِّ الشَّجَرَةِ", tr: "Ağacın gölgesinde oturduk." }
            }
        },
        cogul: "ظِلال",
        cogulTr: "Gölgeler"
    },

    "Zaman: Gece (leyl)": {
        isDictOnly: true,
        tip: "zaman",
        tekil: {
            base: {
                emoji: "🌙",
                arText: "لَيْل",
                trText: "Gece",
                ornek: { ar: "اَللَّيْلُ لِلرّاحَةِ وَالنَّهارُ لِلْعَمَلِ", tr: "Gece dinlenmek, gündüz çalışmak içindir." }
            }
        },
        cogul: "لَيالٍ",
        cogulTr: "Geceler"
    },

    "Zaman: Gündüz": {
        isDictOnly: true,
        tip: "zaman",
        tekil: {
            base: {
                emoji: "☀️",
                arText: "نَهار",
                trText: "Gündüz",
                ornek: { ar: "أَدْرُسُ في النَّهارِ وَأَنامُ في اللَّيْلِ", tr: "Gündüz ders çalışır, gece uyurum." }
            }
        },
        cogul: "نُهُر",
        cogulTr: "Gündüzler"
    },

    "Hayvan: İbibik": {
        isDictOnly: true,
        tip: "kus",
        tekil: {
            base: {
                emoji: "🐦",
                arText: "هُدْهُد",
                trText: "İbibik kuşu (hüthüt)",
                ornek: { ar: "وَتَفَقَّدَ الطَّيْرَ فَقالَ ما لِيَ لا أَرَى الهُدْهُدَ", tr: "Kuşları denetledi ve «Hüthüdü niçin göremiyorum?» dedi." }
            }
        },
        cogul: "هَداهِد",
        cogulTr: "İbibik kuşları"
    },

    /* ====================================================================
       7. SINIF — câmid isimler: Türkiye şehirleri, yöresel yemekler ve
       günlük eşya. Şehirler yeni "sehir" listesine bağlandı.
       ==================================================================== */
    "Şehir: İstanbul": {
        isDictOnly: true,
        tip: "sehir",
        tekil: {
            base: {
                emoji: "🕌",
                arText: "إِسْطَنْبُول",
                trText: "İstanbul",
                ornek: { ar: "أَعيشُ في إِسْطَنْبُول", tr: "İstanbul'da yaşıyorum." }
            }
        }
    },

    "Şehir: Ankara": {
        isDictOnly: true,
        tip: "sehir",
        tekil: {
            base: {
                emoji: "🏛️",
                arText: "أَنْقَرَة",
                trText: "Ankara (başkent)",
                ornek: { ar: "أَنْقَرَة عاصِمَةُ تُرْكِيا", tr: "Ankara Türkiye'nin başkentidir." }
            }
        }
    },

    "Şehir: İzmir": {
        isDictOnly: true,
        tip: "sehir",
        tekil: {
            base: {
                emoji: "⛵",
                arText: "إِزْمير",
                trText: "İzmir",
                ornek: { ar: "أُسافِرُ إِلَى إِزْمير بَحْرًا", tr: "İzmir'e deniz yoluyla gidiyorum." }
            }
        }
    },

    "Şehir: Bursa": {
        isDictOnly: true,
        tip: "sehir",
        tekil: {
            base: {
                emoji: "🌳",
                arText: "بورْصَة",
                trText: "Bursa",
                ornek: { ar: "بورْصَة مَشْهورَةٌ بِجِبالِها", tr: "Bursa dağlarıyla meşhurdur." }
            }
        }
    },

    "Şehir: Kayseri": {
        isDictOnly: true,
        tip: "sehir",
        tekil: {
            base: {
                emoji: "⛰️",
                arText: "قَيْصَري",
                trText: "Kayseri",
                ornek: { ar: "تُسافِرُ عائِشَة إِلَى قَيْصَري", tr: "Ayşe Kayseri'ye gidiyor." }
            }
        }
    },

    "Şehir: Antalya": {
        isDictOnly: true,
        tip: "sehir",
        tekil: {
            base: {
                emoji: "🏖️",
                arText: "أَنْطالِيا",
                trText: "Antalya",
                ornek: { ar: "يَتَّجِهُ السّائِحونَ إِلَى أَنْطالِيا", tr: "Turistler Antalya'ya yöneliyor." }
            }
        }
    },

    "Şehir: Mardin": {
        isDictOnly: true,
        tip: "sehir",
        tekil: {
            base: {
                emoji: "🏜️",
                arText: "مارْدين",
                trText: "Mardin",
                ornek: { ar: "مارْدين مَدينَةٌ تاريخِيَّةٌ", tr: "Mardin tarihî bir şehirdir." }
            }
        }
    },

    "Şehir: Sivas": {
        isDictOnly: true,
        tip: "sehir",
        tekil: {
            base: {
                emoji: "🌉",
                arText: "سيواس",
                trText: "Sivas",
                ornek: { ar: "أَنا مِنْ سيواس", tr: "Ben Sivaslıyım." }
            }
        }
    },

    "Yiyecek: İskender": {
        isDictOnly: true,
        tip: "yiyecek",
        tekil: {
            base: {
                emoji: "🍢",
                arText: "إِسْكَنْدَر كَباب",
                trText: "İskender kebap",
                ornek: { ar: "إِسْكَنْدَر كَباب أَكْلَةٌ بورْصِيَّةٌ", tr: "İskender kebap Bursa yemeğidir." }
            }
        }
    },

    "Yiyecek: Cağ Kebabı": {
        isDictOnly: true,
        tip: "yiyecek",
        tekil: {
            base: {
                emoji: "🔥",
                arText: "كَباب جاغ",
                trText: "Cağ kebabı",
                ornek: { ar: "كَبابُ جاغ مَشْهورٌ في أَرْضَروم", tr: "Cağ kebabı Erzurum'da meşhurdur." }
            }
        }
    },

    "Yiyecek: Tantuni": {
        isDictOnly: true,
        tip: "yiyecek",
        tekil: {
            base: {
                emoji: "🌯",
                arText: "التَّنْتوني",
                trText: "Tantuni",
                ornek: { ar: "التَّنْتوني أَكْلَةٌ لَذيذَةٌ مِنْ مَرْسين", tr: "Tantuni Mersin'in lezzetli bir yemeğidir." }
            }
        }
    },

    "İsim: Poşet": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🛍️",
                arText: "كيس",
                trText: "Poşet, torba, kese",
                ornek: { ar: "أَعْطِني كيسًا مِنْ فَضْلِكَ", tr: "Lütfen bana bir poşet ver." }
            }
        },
        cogul: "أَكْياس",
        cogulTr: "Poşetler"
    },

    "İsim: Hava (cev)": {
        isDictOnly: true,
        tip: "zaman",
        tekil: {
            base: {
                emoji: "🌤️",
                arText: "جَوّ",
                trText: "Hava, atmosfer",
                ornek: { ar: "الجَوُّ جَميلٌ اليَوْمَ", tr: "Hava bugün güzel." }
            }
        },
        cogul: "أَجْواء",
        cogulTr: "Havalar"
    },

    "İsim: Durak": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🚏",
                arText: "مَحَطَّة",
                trText: "Durak, istasyon",
                ornek: { ar: "مَحَطَّةُ الحافِلَةِ قَريبَةٌ", tr: "Otobüs durağı yakındır." }
            }
        },
        cogul: "مَحَطّات",
        cogulTr: "Duraklar"
    },

    /* ====================================================================
       9. SINIF — câmid isimler ve zarflar. "Ülkeler" listesi açıldı.
       ==================================================================== */
    "Ülke: Türkiye": {
        isDictOnly: true,
        tip: "ulke",
        tekil: {
            base: {
                emoji: "🇹🇷",
                arText: "تُرْكِيا",
                trText: "Türkiye",
                ornek: { ar: "أَعيشُ في تُرْكِيا", tr: "Türkiye'de yaşıyorum." }
            }
        }
    },

    "İsim: Dolap (dûlâb)": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🚪",
                arText: "دولاب",
                trText: "Dolap, gardırop",
                ornek: { ar: "أَضَعُ مَلابِسي في الدّولابِ", tr: "Elbiselerimi dolaba koyarım." }
            }
        },
        cogul: "دَواليب",
        cogulTr: "Dolaplar"
    },

    "İsim: Ayna": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🪞",
                arText: "مِرْآة",
                trText: "Ayna",
                ornek: { ar: "اَلمِرْآةُ عَلَى الحائِطِ", tr: "Ayna duvardadır." }
            }
        },
        cogul: "مَرايا",
        cogulTr: "Aynalar"
    },

    "İsim: Tuvalet": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🚻",
                arText: "مِرْحاض",
                trText: "Tuvalet, lavabo",
                ornek: { ar: "اَلمِرْحاضُ نَظيفٌ", tr: "Tuvalet temizdir." }
            }
        },
        cogul: "مَراحيض",
        cogulTr: "Tuvaletler"
    },

    "İsim: Futbol": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "⚽",
                arText: "كُرَة القَدَم",
                trText: "Futbol",
                ornek: { ar: "أُحِبُّ كُرَةَ القَدَمِ", tr: "Futbolu severim." }
            }
        }
    },

    "Zarf: Daima": {
        isDictOnly: true,
        tip: "zarf",
        tekil: {
            base: {
                emoji: "♾️",
                arText: "دائِمًا",
                trText: "Daima, her zaman",
                ornek: { ar: "أَسْتَيْقِظُ دائِمًا مُبَكِّرًا", tr: "Daima erken kalkarım." }
            }
        }
    },

    /* ====================================================================
       10. SINIF · 1. PARTİ — sağlık, giysi ve hava. Yeni listeler:
       "saglik" (Sağlık) ve "kiyafet" (Giysiler).
       ==================================================================== */
    "Sağlık: Eczane": {
        isDictOnly: true,
        tip: "saglik",
        tekil: {
            base: {
                emoji: "💊",
                arText: "صَيْدَلِيَّة",
                trText: "Eczane",
                ornek: { ar: "آخُذُ الدَّواءَ مِن الصَّيْدَلِيَّةِ", tr: "İlacı eczaneden alırım." }
            }
        },
        cogul: "صَيْدَلِيّات",
        cogulTr: "Eczaneler"
    },

    "Sağlık: İlaç": {
        isDictOnly: true,
        tip: "saglik",
        tekil: {
            base: {
                emoji: "💉",
                arText: "دَواء",
                trText: "İlaç",
                ornek: { ar: "تَتَناوَلُ الدَّواءَ ثَلاثَ مَرّاتٍ", tr: "İlacı günde üç kez alırsın." }
            }
        },
        cogul: "أَدْوِيَة",
        cogulTr: "İlaçlar"
    },

    "Sağlık: Ateş": {
        isDictOnly: true,
        tip: "saglik",
        tekil: {
            base: {
                emoji: "🌡️",
                arText: "حَرارَة",
                trText: "Ateş, sıcaklık (vücut)",
                ornek: { ar: "حَرارَتُها مُرْتَفِعَةٌ", tr: "Onun ateşi yüksek." }
            }
        }
    },

    "Sağlık: Öksürük": {
        isDictOnly: true,
        tip: "saglik",
        tekil: {
            base: {
                emoji: "🤧",
                arText: "كُحَّة",
                trText: "Öksürük",
                ornek: { ar: "عِنْدي كُحَّةٌ وَزُكامٌ", tr: "Öksürüğüm ve nezlem var." }
            }
        }
    },

    "Sağlık: Nezle": {
        isDictOnly: true,
        tip: "saglik",
        tekil: {
            base: {
                emoji: "🤒",
                arText: "زُكام",
                trText: "Nezle, soğuk algınlığı",
                ornek: { ar: "عِنْدَهُ زُكامٌ خَفيفٌ", tr: "Onun hafif bir nezlesi var." }
            }
        }
    },

    "Sağlık: Sancı": {
        isDictOnly: true,
        tip: "saglik",
        tekil: {
            base: {
                emoji: "😖",
                arText: "مَغْص",
                trText: "Sancı, karın ağrısı",
                ornek: { ar: "أَشْعُرُ بِمَغْصٍ في بَطْني", tr: "Karnımda sancı hissediyorum." }
            }
        }
    },

    "Sağlık: Organ": {
        isDictOnly: true,
        tip: "saglik",
        tekil: {
            base: {
                emoji: "🫁",
                arText: "عُضْو",
                trText: "Organ, uzuv; üye",
                ornek: { ar: "لِلْجِسْمِ أَعْضاءٌ كَثيرَةٌ", tr: "Vücudun birçok organı vardır." }
            }
        },
        cogul: "أَعْضاء",
        cogulTr: "Organlar"
    },

    "Sağlık: Gıda": {
        isDictOnly: true,
        tip: "saglik",
        tekil: {
            base: {
                emoji: "🥗",
                arText: "غِذاء",
                trText: "Gıda, besin",
                ornek: { ar: "الغِذاءُ الصِّحِّيُّ مُهِمٌّ", tr: "Sağlıklı gıda önemlidir." }
            }
        },
        cogul: "أَغْذِيَة",
        cogulTr: "Gıdalar"
    },

    "Giysi: Palto": {
        isDictOnly: true,
        tip: "kiyafet",
        tekil: {
            base: {
                emoji: "🧥",
                arText: "مِعْطَف",
                trText: "Palto, manto",
                ornek: { ar: "اِلْبَسْ مِعْطَفًا فَالْجَوُّ بارِدٌ", tr: "Palto giy, hava soğuk." }
            }
        },
        cogul: "مَعاطِف",
        cogulTr: "Paltolar"
    },

    "Giysi: Gömlek": {
        isDictOnly: true,
        tip: "kiyafet",
        tekil: {
            base: {
                emoji: "👔",
                arText: "قَميص",
                trText: "Gömlek",
                ornek: { ar: "هَذا القَميصُ جَميلٌ", tr: "Bu gömlek güzel." }
            }
        },
        cogul: "قُمْصان",
        cogulTr: "Gömlekler"
    },

    "Giysi: Şapka": {
        isDictOnly: true,
        tip: "kiyafet",
        tekil: {
            base: {
                emoji: "🧢",
                arText: "قُبَّعَة",
                trText: "Şapka",
                ornek: { ar: "لَبِسَ قُبَّعَةً في الشَّمْسِ", tr: "Güneşte şapka taktı." }
            }
        },
        cogul: "قُبَّعات",
        cogulTr: "Şapkalar"
    },

    "Giysi: Atkı": {
        isDictOnly: true,
        tip: "kiyafet",
        tekil: {
            base: {
                emoji: "🧣",
                arText: "وِشاح",
                trText: "Atkı, şal",
                ornek: { ar: "وِشاحُها أَحْمَرُ", tr: "Onun atkısı kırmızı." }
            }
        },
        cogul: "أَوْشِحَة",
        cogulTr: "Atkılar"
    },

    "Giysi: Eldiven": {
        isDictOnly: true,
        tip: "kiyafet",
        tekil: {
            base: {
                emoji: "🧤",
                arText: "قُفّاز",
                trText: "Eldiven",
                ornek: { ar: "أَلْبَسُ قُفّازَيْنِ في الشِّتاءِ", tr: "Kışın eldiven giyerim." }
            }
        },
        cogul: "قَفافيز",
        cogulTr: "Eldivenler"
    },

    "Giysi: Pantolon": {
        isDictOnly: true,
        tip: "kiyafet",
        tekil: {
            base: {
                emoji: "👖",
                arText: "بَنْطَلون",
                trText: "Pantolon",
                ornek: { ar: "بَنْطَلونُهُ أَزْرَقُ", tr: "Onun pantolonu mavi." }
            }
        },
        cogul: "بَناطيل",
        cogulTr: "Pantolonlar"
    },

    "İsim: Şemsiye": {
        isDictOnly: true,
        tip: "kiyafet",
        tekil: {
            base: {
                emoji: "☂️",
                arText: "مِظَلَّة",
                trText: "Şemsiye",
                ornek: { ar: "آخُذُ مِظَلَّةً عِنْدَما تُمْطِرُ", tr: "Yağmur yağınca şemsiye alırım." }
            }
        },
        cogul: "مِظَلّات",
        cogulTr: "Şemsiyeler"
    },

    "İsim: Çevre": {
        isDictOnly: true,
        tip: "isim",
        tekil: {
            base: {
                emoji: "🌍",
                arText: "بيئَة",
                trText: "Çevre, ortam",
                ornek: { ar: "أُحافِظُ عَلَى البيئَةِ", tr: "Çevreyi korurum." }
            }
        },
        cogul: "بيئات",
        cogulTr: "Çevreler"
    },

    "Zaman: Bulut": {
        isDictOnly: true,
        tip: "zaman",
        tekil: {
            base: {
                emoji: "☁️",
                arText: "سَحاب",
                trText: "Bulut",
                ornek: { ar: "السَّحابُ يُغَطّي السَّماءَ", tr: "Bulut gökyüzünü kaplıyor." }
            }
        },
        cogul: "سُحُب",
        cogulTr: "Bulutlar"
    },

    "Zaman: Rüzgâr": {
        isDictOnly: true,
        tip: "zaman",
        tekil: {
            base: {
                emoji: "🌬️",
                arText: "ريح",
                trText: "Rüzgâr",
                ornek: { ar: "الرّيحُ قَوِيَّةٌ اليَوْمَ", tr: "Rüzgâr bugün kuvvetli." }
            }
        },
        cogul: "رِياح",
        cogulTr: "Rüzgârlar"
    },

    /* 5-9. SINIF — câmid isimler: yabancı kökenli olduğu için kök verisine girmeyenler */
    "İsim: Müzik": {
        isDictOnly: true,
        tekil: { base: { emoji: "🎵", arText: "مُوسِيقَى", trText: "Müzik", ornek: { ar: "أُحِبُّ المُوسِيقَى الكْلَاسِيكِيَّةَ", tr: "Klasik müziği severim." } } }
    },

    "İsim: Sinema": {
        isDictOnly: true,
        tekil: { base: { emoji: "🎬", arText: "سِينَمَا", trText: "Sinema", ornek: { ar: "نَذْهَبُ إِلَى السِّينَمَا مَعَ أَصْدِقَائِي", tr: "Arkadaşlarımla sinemaya gideriz." } } }
    },

    "İsim: Kilo": {
        isDictOnly: true,
        tekil: { base: { emoji: "⚖️", arText: "كِيلُو", trText: "Kilo", ornek: { ar: "أُرِيدُ كِيلُو تُفَّاحٍ", tr: "Bir kilo elma istiyorum." } } }
    },

    /* ====================================================================
       GENEL SÖZ VARLIĞI — 1. PARTİ
       Vücut organları · ev eşyası · okul · doğa · içecek · ülkeler
       ==================================================================== */

    "Uzuv: Dil": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "👅", arText: "لِسَان", trText: "Dil (organ); lisan", ornek: { ar: "اللِّسَانُ مِفْتَاحُ القَلْبِ", tr: "Dil, kalbin anahtarıdır." } } }, cogul: "أَلْسِنَة", cogulTr: "Diller" },
    "Uzuv: Kol": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "💪", arText: "ذِرَاع", trText: "Kol; arşın (ölçü)" } }, cogul: "أَذْرُع", cogulTr: "Kollar" },
    "Uzuv: Parmak": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "☝️", arText: "إِصْبَع", trText: "Parmak" } }, cogul: "أَصَابِع", cogulTr: "Parmaklar" },
    "Uzuv: Mide": { isDictOnly: true, tip: ["uzuv", "saglik"], tekil: { base: { emoji: "🫃", arText: "مَعِدَة", trText: "Mide", ornek: { ar: "المَعِدَةُ بَيْتُ الدَّاءِ", tr: "Mide hastalığın evidir. (Meşhur söz)" } } }, cogul: "مِعَد", cogulTr: "Mideler" },
    "Uzuv: Ciğer": { isDictOnly: true, tip: ["uzuv", "saglik"], tekil: { base: { emoji: "🫁", arText: "كَبِد", trText: "Karaciğer" } }, cogul: "أَكْبَاد", cogulTr: "Ciğerler" },
    "Uzuv: Boyun": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "🧣", arText: "رَقَبَة", trText: "Boyun" } }, cogul: "رِقَاب", cogulTr: "Boyunlar" },
    "Uzuv: Omuz": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "🤷", arText: "كَتِف", trText: "Omuz" } }, cogul: "أَكْتَاف", cogulTr: "Omuzlar" },
    "Uzuv: Karın": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "🫄", arText: "بَطْن", trText: "Karın" } }, cogul: "بُطُون", cogulTr: "Karınlar" },
    "Uzuv: Göğüs": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "🫁", arText: "صَدْر", trText: "Göğüs; sadr, baş taraf", ornek: { ar: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", tr: "Senin göğsünü açıp genişletmedik mi? (İnşirâh sûresi, 1)" } } }, cogul: "صُدُور", cogulTr: "Göğüsler" },
    "Uzuv: Kaş": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "👁️", arText: "حَاجِب", trText: "Kaş; perdeci, kapıcı" } }, cogul: "حَوَاجِب", cogulTr: "Kaşlar" },
    "Uzuv: Dudak": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "👄", arText: "شَفَة", trText: "Dudak" } }, cogul: "شِفَاه", cogulTr: "Dudaklar" },
    "Uzuv: Çene": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "🧔", arText: "ذَقْن", trText: "Çene, sakal yeri" } }, cogul: "ذُقُون", cogulTr: "Çeneler" },
    "Uzuv: Alın": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "😀", arText: "جَبِين", trText: "Alın" } }, cogul: "أَجْبِنَة", cogulTr: "Alınlar" },
    "Uzuv: Yanak": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "😊", arText: "خَدّ", trText: "Yanak" } }, cogul: "خُدُود", cogulTr: "Yanaklar" },
    "Uzuv: Kemik": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "🦴", arText: "عَظْم", trText: "Kemik" } }, cogul: "عِظَام", cogulTr: "Kemikler" },
    "Uzuv: Kan": { isDictOnly: true, tip: ["uzuv", "saglik"], tekil: { base: { emoji: "🩸", arText: "دَم", trText: "Kan" } }, cogul: "دِمَاء", cogulTr: "Kanlar" },
    "Uzuv: Deri": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "🧴", arText: "جِلْد", trText: "Deri, cilt" } }, cogul: "جُلُود", cogulTr: "Deriler" },
    "Uzuv: Diz": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "🦵", arText: "رُكْبَة", trText: "Diz" } }, cogul: "رُكَب", cogulTr: "Dizler" },

    "Eşya: Duvar": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🧱", arText: "جِدَار", trText: "Duvar" } }, cogul: "جُدْرَان", cogulTr: "Duvarlar" },
    "Eşya: Tavan": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🏠", arText: "سَقْف", trText: "Tavan, çatı" } }, cogul: "سُقُوف", cogulTr: "Tavanlar" },
    "Eşya: Halı": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🧶", arText: "سَجَّادَة", trText: "Halı, seccade" } }, cogul: "سَجَّاد", cogulTr: "Halılar" },
    "Eşya: Kaşık": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🥄", arText: "مِلْعَقَة", trText: "Kaşık" } }, cogul: "مَلَاعِق", cogulTr: "Kaşıklar" },
    "Eşya: Çatal": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🍴", arText: "شَوْكَة", trText: "Çatal; diken" } }, cogul: "شِوَك", cogulTr: "Çatallar" },
    "Eşya: Bardak": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🥛", arText: "كُوب", trText: "Bardak" } }, cogul: "أَكْوَاب", cogulTr: "Bardaklar" },
    "Eşya: Yastık": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🛏️", arText: "وِسَادَة", trText: "Yastık" } }, cogul: "وَسَائِد", cogulTr: "Yastıklar" },
    "Eşya: Battaniye": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🧣", arText: "بَطَّانِيَّة", trText: "Battaniye" } }, cogul: "بَطَاطِين", cogulTr: "Battaniyeler" },
    "Eşya: Havlu": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🧻", arText: "مِنْشَفَة", trText: "Havlu" } }, cogul: "مَنَاشِف", cogulTr: "Havlular" },
    "Eşya: Sabun": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🧼", arText: "صَابُون", trText: "Sabun" } } },
    "Eşya: Zemin": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🟫", arText: "أَرْضِيَّة", trText: "Zemin, yer döşemesi" } } },

    "Okul: Tebeşir": { isDictOnly: true, tip: "okul", tekil: { base: { emoji: "🖍️", arText: "طَبَاشِير", trText: "Tebeşir" } } },
    "Okul: Sınav": { isDictOnly: true, tip: "okul", tekil: { base: { emoji: "📝", arText: "اِمْتِحَان", trText: "Sınav, imtihan", ornek: { ar: "نَتِيجَةُ الامْتِحَانِ جَيِّدَةٌ", tr: "Sınavın sonucu iyi." } } }, cogul: "اِمْتِحَانَات", cogulTr: "Sınavlar" },
    "Okul: Laboratuvar": { isDictOnly: true, tip: "okul", tekil: { base: { emoji: "🔬", arText: "مُخْتَبَر", trText: "Laboratuvar" } }, cogul: "مُخْتَبَرَات", cogulTr: "Laboratuvarlar" },
    "Okul: Kütüphane": { isDictOnly: true, tip: "okul", tekil: { base: { emoji: "📚", arText: "مَكْتَبَة", trText: "Kütüphane; kitapçı" } }, cogul: "مَكْتَبَات", cogulTr: "Kütüphaneler" },
    "Okul: Teneffüs": { isDictOnly: true, tip: "okul", tekil: { base: { emoji: "⏸️", arText: "اِسْتِرَاحَة", trText: "Teneffüs, mola, dinlenme" } } },

    "Doğa: Dal": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🌿", arText: "غُصْن", trText: "Dal, budak" } }, cogul: "أَغْصَان", cogulTr: "Dallar" },
    "Doğa: Tohum": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🌱", arText: "بَذْرَة", trText: "Tohum" } }, cogul: "بُذُور", cogulTr: "Tohumlar" },
    "Doğa: Çimen": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🌾", arText: "عُشْب", trText: "Ot, çimen" } }, cogul: "أَعْشَاب", cogulTr: "Otlar" },
    "Doğa: Taş": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🪨", arText: "حَجَر", trText: "Taş", ornek: { ar: "الحَجَرُ الأَسْوَدُ فِي الكَعْبَةِ", tr: "Hacerü'l-Esved Kâbe'dedir." } } }, cogul: "أَحْجَار", cogulTr: "Taşlar" },
    "Doğa: Kum": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🏖️", arText: "رَمْل", trText: "Kum" } }, cogul: "رِمَال", cogulTr: "Kumlar" },
    "Doğa: Toprak": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🟤", arText: "تُرَاب", trText: "Toprak" } } },
    "Doğa: Tepe": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "⛰️", arText: "تَلّ", trText: "Tepe, höyük" } }, cogul: "تِلَال", cogulTr: "Tepeler" },
    "Doğa: Vadi": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🏞️", arText: "وَادٍ", trText: "Vadi, dere yatağı" } }, cogul: "أَوْدِيَة", cogulTr: "Vadiler" },
    "Doğa: Nehir": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🏞️", arText: "نَهْر", trText: "Nehir, ırmak" } }, cogul: "أَنْهَار", cogulTr: "Nehirler" },
    "Doğa: Orman": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🌲", arText: "غَابَة", trText: "Orman" } }, cogul: "غَابَات", cogulTr: "Ormanlar" },
    "Doğa: Çöl": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🏜️", arText: "صَحْرَاء", trText: "Çöl, sahra" } }, cogul: "صَحَارَى", cogulTr: "Çöller" },
    "Doğa: Ada": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🏝️", arText: "جَزِيرَة", trText: "Ada; yarımada (شِبْه الجَزِيرَة)" } }, cogul: "جُزُر", cogulTr: "Adalar" },

    "İçecek: Ayran": { isDictOnly: true, tip: "icecek", tekil: { base: { emoji: "🥛", arText: "لَبَن", trText: "Ayran, yoğurt; (Mısır'da) süt" } } },
    "İçecek: Limonata": { isDictOnly: true, tip: "icecek", tekil: { base: { emoji: "🍋", arText: "لَيْمُونَاضَة", trText: "Limonata" } } },
    "İçecek: Şerbet": { isDictOnly: true, tip: "icecek", tekil: { base: { emoji: "🍹", arText: "شَرَاب", trText: "Şerbet, içecek" } }, cogul: "أَشْرِبَة", cogulTr: "İçecekler" },

    "Ülke: Suudi Arabistan": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇸🇦", arText: "السُّعُودِيَّة", trText: "Suudi Arabistan", ornek: { ar: "مَكَّة وَالْمَدِينَةُ فِي السُّعُودِيَّةِ", tr: "Mekke ve Medine Suudi Arabistan'dadır." } } } },
    "Ülke: Ürdün": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇯🇴", arText: "الأُرْدُنّ", trText: "Ürdün" } } },
    "Ülke: Lübnan": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇱🇧", arText: "لُبْنَان", trText: "Lübnan" } } },
    "Ülke: Irak": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇮🇶", arText: "العِرَاق", trText: "Irak" } } },
    "Ülke: Filistin": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇵🇸", arText: "فِلَسْطِين", trText: "Filistin", ornek: { ar: "القُدْس فِي فِلَسْطِينَ", tr: "Kudüs Filistin'dedir." } } } },
    "Ülke: Fas": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇲🇦", arText: "المَغْرِب", trText: "Fas (Mağrib)" } } },
    "Ülke: Cezayir": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇩🇿", arText: "الجَزَائِر", trText: "Cezayir" } } },
    "Ülke: Tunus": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇹🇳", arText: "تُونِس", trText: "Tunus" } } },
    "Ülke: Libya": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇱🇾", arText: "لِيبِيَا", trText: "Libya" } } },
    "Ülke: Sudan": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇸🇩", arText: "السُّودَان", trText: "Sudan" } } },
    "Ülke: Yemen": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇾🇪", arText: "اليَمَن", trText: "Yemen" } } },
    "Ülke: Kuveyt": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇰🇼", arText: "الكُوَيْت", trText: "Kuveyt" } } },
    "Ülke: Katar": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇶🇦", arText: "قَطَر", trText: "Katar" } } },
    "Ülke: Umman": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇴🇲", arText: "عُمَان", trText: "Umman" } } },
    "Ülke: Bahreyn": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇧🇭", arText: "البَحْرَيْن", trText: "Bahreyn (iki deniz)" } } },
    "Ülke: BAE": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇦🇪", arText: "الإِمَارَات", trText: "Birleşik Arap Emirlikleri" } } },
    "Ülke: Almanya": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇩🇪", arText: "أَلْمَانْيَا", trText: "Almanya" } } },
    "Ülke: Fransa": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇫🇷", arText: "فَرَنْسَا", trText: "Fransa" } } },
    "Ülke: İngiltere": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇬🇧", arText: "إِنْجِلْتِرَا", trText: "İngiltere" } } },
    "Ülke: Amerika": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇺🇸", arText: "أَمْرِيكَا", trText: "Amerika" } } },
    "Ülke: Çin": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇨🇳", arText: "الصِّين", trText: "Çin", ornek: { ar: "اُطْلُبُوا العِلْمَ وَلَوْ بِالصِّينِ", tr: "İlmi Çin'de de olsa arayın. (Meşhur söz)" } } } },
    "Ülke: Japonya": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇯🇵", arText: "اليَابَان", trText: "Japonya" } } },
    "Ülke: Rusya": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇷🇺", arText: "رُوسْيَا", trText: "Rusya" } } },
    "Ülke: İtalya": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇮🇹", arText: "إِيطَالْيَا", trText: "İtalya" } } },

    /* ====================================================================
       HAYVANLAR — alt gruplar tamamlanıyor (kuş · böcek · deniz · evcil · yabani)
       ==================================================================== */

    "Hayvan: Dişi Deve": { isDictOnly: true, tip: "evcil", tekil: { base: { emoji: "🐪", arText: "نَاقَة", trText: "Dişi deve", ornek: { ar: "هَذِهِ نَاقَةُ اللهِ لَكُمْ آيَةً", tr: "İşte size bir mucize olarak Allah'ın devesi. (A'râf sûresi, 73)" } } }, cogul: "نُوق", cogulTr: "Dişi develer" },
    "Hayvan: Keçi": { isDictOnly: true, tip: "evcil", tekil: { base: { emoji: "🐐", arText: "مَاعِز", trText: "Keçi" } }, cogul: "مَوَاعِز", cogulTr: "Keçiler" },
    "Hayvan: Horoz": { isDictOnly: true, tip: ["kus", "evcil"], tekil: { base: { emoji: "🐓", arText: "دِيك", trText: "Horoz", ornek: { ar: "يَصِيحُ الدِّيكُ فِي الصَّبَاحِ", tr: "Horoz sabahleyin öter." } } }, cogul: "دِيَكَة", cogulTr: "Horozlar" },
    "Hayvan: Boğa": { isDictOnly: true, tip: "evcil", tekil: { base: { emoji: "🐂", arText: "ثَوْر", trText: "Boğa, öküz" } }, cogul: "ثِيرَان", cogulTr: "Boğalar" },
    "Hayvan: Katır": { isDictOnly: true, tip: "evcil", tekil: { base: { emoji: "🐴", arText: "بَغْل", trText: "Katır" } }, cogul: "بِغَال", cogulTr: "Katırlar" },
    "Hayvan: Kuzu": { isDictOnly: true, tip: "evcil", tekil: { base: { emoji: "🐑", arText: "حَمَل", trText: "Kuzu" } }, cogul: "حُمْلَان", cogulTr: "Kuzular" },

    "Hayvan: Serçe": { isDictOnly: true, tip: "kus", tekil: { base: { emoji: "🐤", arText: "عُصْفُور", trText: "Serçe, küçük kuş" } }, cogul: "عَصَافِير", cogulTr: "Serçeler" },
    "Hayvan: Bülbül": { isDictOnly: true, tip: "kus", tekil: { base: { emoji: "🎶", arText: "بُلْبُل", trText: "Bülbül" } }, cogul: "بَلَابِل", cogulTr: "Bülbüller" },
    "Hayvan: Şahin": { isDictOnly: true, tip: "kus", tekil: { base: { emoji: "🦅", arText: "صَقْر", trText: "Şahin, doğan" } }, cogul: "صُقُور", cogulTr: "Şahinler" },
    "Hayvan: Papağan": { isDictOnly: true, tip: "kus", tekil: { base: { emoji: "🦜", arText: "بَبَّغَاء", trText: "Papağan" } } },
    "Hayvan: Kumru": { isDictOnly: true, tip: "kus", tekil: { base: { emoji: "🕊️", arText: "يَمَامَة", trText: "Kumru, yaban güvercini" } }, cogul: "يَمَام", cogulTr: "Kumrular" },
    "Hayvan: Leylek": { isDictOnly: true, tip: "kus", tekil: { base: { emoji: "🪶", arText: "لَقْلَق", trText: "Leylek" } }, cogul: "لَقَالِق", cogulTr: "Leylekler" },
    "Hayvan: Deve Kuşu": { isDictOnly: true, tip: "kus", tekil: { base: { emoji: "🦤", arText: "نَعَامَة", trText: "Deve kuşu" } }, cogul: "نَعَام", cogulTr: "Deve kuşları" },

    "Hayvan: Çekirge": { isDictOnly: true, tip: "bocek", tekil: { base: { emoji: "🦗", arText: "جَرَادَة", trText: "Çekirge" } }, cogul: "جَرَاد", cogulTr: "Çekirgeler (cins)" },
    "Hayvan: Solucan": { isDictOnly: true, tip: "bocek", tekil: { base: { emoji: "🪱", arText: "دُودَة", trText: "Kurt, solucan" } }, cogul: "دُود", cogulTr: "Kurtlar (cins)" },
    "Hayvan: Hamamböceği": { isDictOnly: true, tip: "bocek", tekil: { base: { emoji: "🪳", arText: "صُرْصُور", trText: "Hamamböceği" } }, cogul: "صَرَاصِير", cogulTr: "Hamamböcekleri" },
    "Hayvan: Kelebek Kurdu": { isDictOnly: true, tip: "bocek", tekil: { base: { emoji: "🐛", arText: "يَرَقَة", trText: "Tırtıl, larva" } }, cogul: "يَرَقَات", cogulTr: "Tırtıllar" },

    "Hayvan: Sincap": { isDictOnly: true, tip: "yabani", tekil: { base: { emoji: "🐿️", arText: "سِنْجَاب", trText: "Sincap" } }, cogul: "سَنَاجِب", cogulTr: "Sincaplar" },
    "Hayvan: Kirpi": { isDictOnly: true, tip: "yabani", tekil: { base: { emoji: "🦔", arText: "قُنْفُذ", trText: "Kirpi" } }, cogul: "قَنَافِذ", cogulTr: "Kirpiler" },
    "Hayvan: Çita": { isDictOnly: true, tip: "yabani", tekil: { base: { emoji: "🐆", arText: "فَهْد", trText: "Çita, pars" } }, cogul: "فُهُود", cogulTr: "Çitalar" },
    "Hayvan: Geyik (Erkek)": { isDictOnly: true, tip: "yabani", tekil: { base: { emoji: "🦌", arText: "أَيِّل", trText: "Erkek geyik" } }, cogul: "أَيَائِل", cogulTr: "Geyikler" },

    "Hayvan: Karides": { isDictOnly: true, tip: "deniz", tekil: { base: { emoji: "🦐", arText: "جَمْبَرِيّ", trText: "Karides" } } },
    "Hayvan: Midye": { isDictOnly: true, tip: "deniz", tekil: { base: { emoji: "🦪", arText: "مَحَار", trText: "Midye, istiridye" } } },
    "Hayvan: Denizyıldızı": { isDictOnly: true, tip: "deniz", tekil: { base: { emoji: "⭐", arText: "نَجْم البَحْر", trText: "Denizyıldızı" } } },
    "Hayvan: Fok": { isDictOnly: true, tip: "deniz", tekil: { base: { emoji: "🦭", arText: "فُقْمَة", trText: "Fok" } }, cogul: "فُقَم", cogulTr: "Foklar" },

    /* ====================================================================
       10. SINIF · 3. ÜNİTE — ülke, şehir ve seyahat: câmid özel isimler.
       Şehirler "sehir", ülkeler "ulke", kıtalar yeni "kita" listesine bağlı.
       ==================================================================== */
    "Şehir: Konya": {
        isDictOnly: true,
        tip: "sehir",
        tekil: { base: { emoji: "🕌", arText: "قُونْيَا", trText: "Konya", ornek: { ar: "تَشْتَهِرُ قُونْيَا بِمَوْلَانَا", tr: "Konya Mevlânâ ile meşhurdur." } } }
    },

    "Şehir: Erzurum": {
        isDictOnly: true,
        tip: "sehir",
        tekil: { base: { emoji: "❄️", arText: "أَرْضُرُوم", trText: "Erzurum", ornek: { ar: "المَدْرَسَةُ اليَاقُوتِيَّةُ فِي أَرْضُرُوم", tr: "Yakutiye Medresesi Erzurum'dadır." } } }
    },

    "Şehir: Trabzon": {
        isDictOnly: true,
        tip: "sehir",
        tekil: { base: { emoji: "🌧️", arText: "طَرَابْزُون", trText: "Trabzon", ornek: { ar: "سَافَرْتُ إِلَى أُوزُونْغُولَ فِي طَرَابْزُون", tr: "Trabzon'daki Uzungöl'e seyahat ettim." } } }
    },

    "Şehir: Urfa": {
        isDictOnly: true,
        tip: "sehir",
        tekil: { base: { emoji: "🐟", arText: "أُورْفَة", trText: "Urfa (Şanlıurfa)", ornek: { ar: "بُحَيْرَةُ الأَسْمَاكِ فِي أُورْفَةَ", tr: "Balıklıgöl Urfa'dadır." } } }
    },

    "Şehir: Mersin": {
        isDictOnly: true,
        tip: "sehir",
        tekil: { base: { emoji: "🍋", arText: "مَرْسِين", trText: "Mersin", ornek: { ar: "مَرْسِين مَدِينَةٌ سَاحِلِيَّةٌ", tr: "Mersin bir sahil şehridir." } } }
    },

    "Şehir: Mekke": {
        isDictOnly: true,
        tip: "sehir",
        tekil: { base: { emoji: "🕋", arText: "مَكَّة", trText: "Mekke", ornek: { ar: "سَنُسَافِرُ إِلَى مَكَّة لِلْعُمْرَةِ", tr: "Umre için Mekke'ye gideceğiz." } } }
    },

    "Şehir: Taif": {
        isDictOnly: true,
        tip: "sehir",
        tekil: { base: { emoji: "🌹", arText: "الطَّائِف", trText: "Taif (Mekke yakınında serin bir şehir)", ornek: { ar: "الطَّائِفُ مَشْهُورَةٌ بِالْوَرْدِ", tr: "Taif gülleriyle meşhurdur." } } }
    },

    "Şehir: Şam": {
        isDictOnly: true,
        tip: "sehir",
        tekil: { base: { emoji: "🏯", arText: "دِمَشْق", trText: "Şam (Dımaşk)", ornek: { ar: "دِمَشْق عَاصِمَةُ سُورِيَا", tr: "Şam, Suriye'nin başkentidir." } } }
    },

    "Şehir: Kahire": {
        isDictOnly: true,
        tip: "sehir",
        tekil: { base: { emoji: "🐫", arText: "القَاهِرَة", trText: "Kahire", ornek: { ar: "القَاهِرَة عَاصِمَةُ مِصْرَ", tr: "Kahire, Mısır'ın başkentidir." } } }
    },

    "Ülke: Mısır": {
        isDictOnly: true,
        tip: "ulke",
        tekil: { base: { emoji: "🇪🇬", arText: "مِصْر", trText: "Mısır", ornek: { ar: "أَنَا مِنْ مِصْرَ", tr: "Ben Mısır'lıyım." } } }
    },

    "Ülke: Suriye": {
        isDictOnly: true,
        tip: "ulke",
        tekil: { base: { emoji: "🇸🇾", arText: "سُورِيَا", trText: "Suriye", ornek: { ar: "تَقَعُ سُورِيَا جَنُوبَ تُرْكِيَا", tr: "Suriye, Türkiye'nin güneyinde bulunur." } } }
    },

    "Ülke: İspanya": {
        isDictOnly: true,
        tip: "ulke",
        tekil: { base: { emoji: "🇪🇸", arText: "إِسْبَانْيَا", trText: "İspanya", ornek: { ar: "ذَهَبَ سَعِيدٌ إِلَى إِسْبَانْيَا بِالسَّفِينَةِ", tr: "Said İspanya'ya gemiyle gitti." } } }
    },

    "Kıta: Asya": {
        isDictOnly: true,
        tip: "kita",
        tekil: { base: { emoji: "🌏", arText: "آسْيَا", trText: "Asya", ornek: { ar: "تَقَعُ تُرْكِيَا بَيْنَ آسْيَا وَأُورُوبَّا", tr: "Türkiye Asya ile Avrupa arasında bulunur." } } }
    },

    "Kıta: Avrupa": {
        isDictOnly: true,
        tip: "kita",
        tekil: { base: { emoji: "🌍", arText: "أُورُوبَّا", trText: "Avrupa", ornek: { ar: "سَافَرْنَا إِلَى أُورُوبَّا بِالطَّائِرَةِ", tr: "Avrupa'ya uçakla seyahat ettik." } } }
    },

    "Kıta: Afrika": {
        isDictOnly: true,
        tip: "kita",
        tekil: { base: { emoji: "🌍", arText: "إِفْرِيقْيَا", trText: "Afrika", ornek: { ar: "مِصْرُ فِي شَمَالِ إِفْرِيقْيَا", tr: "Mısır, Afrika'nın kuzeyindedir." } } }
    },

    /* Liste üç kıtayla kalmıştı; yedi kıta tamamlandı. */
    "Kıta: Kuzey Amerika": {
        isDictOnly: true,
        tip: "kita",
        tekil: { base: { emoji: "🌎", arText: "أَمْرِيكَا الشَّمَالِيَّة", trText: "Kuzey Amerika", ornek: { ar: "كَنَدَا فِي أَمْرِيكَا الشَّمَالِيَّةِ", tr: "Kanada Kuzey Amerika'dadır." } } }
    },

    "Kıta: Güney Amerika": {
        isDictOnly: true,
        tip: "kita",
        tekil: { base: { emoji: "🌎", arText: "أَمْرِيكَا الجَنُوبِيَّة", trText: "Güney Amerika", ornek: { ar: "نَهْرُ الأَمَازُونِ فِي أَمْرِيكَا الجَنُوبِيَّةِ", tr: "Amazon Nehri Güney Amerika'dadır." } } }
    },

    "Kıta: Avustralya": {
        isDictOnly: true,
        tip: "kita",
        tekil: { base: { emoji: "🦘", arText: "أُسْتُرَالِيَا", trText: "Avustralya (Okyanusya)", ornek: { ar: "أُسْتُرَالِيَا قَارَّةٌ وَدَوْلَةٌ فِي آنٍ وَاحِدٍ", tr: "Avustralya hem kıta hem devlettir." } } }
    },

    "Kıta: Antarktika": {
        isDictOnly: true,
        tip: "kita",
        tekil: { base: { emoji: "🧊", arText: "القَارَّة القُطْبِيَّة الجَنُوبِيَّة", trText: "Antarktika (Güney Kutbu kıtası)", ornek: { ar: "القَارَّةُ القُطْبِيَّةُ الجَنُوبِيَّةُ مُغَطَّاةٌ بِالْجَلِيدِ", tr: "Antarktika buzla kaplıdır." } } }
    },


    "İsim: Ayasofya": {
        isDictOnly: true,
        tekil: { base: { emoji: "🕌", arText: "آيَا صُوفْيَا", trText: "Ayasofya", ornek: { ar: "زُرْتُ آيَا صُوفْيَا وَقَصْرَ طُوبْكَابِي", tr: "Ayasofya'yı ve Topkapı Sarayı'nı ziyaret ettim." } } }
    },

    "İsim: Uzungöl": {
        isDictOnly: true,
        tekil: { base: { emoji: "🏞️", arText: "أُوزُونْغُول", trText: "Uzungöl (Trabzon'da bir göl)", ornek: { ar: "أُوزُونْغُولُ جَمِيلَةٌ بِطَبِيعَتِهَا", tr: "Uzungöl doğasıyla güzeldir." } } }
    },

    "İsim: Otel": {
        isDictOnly: true,
        tekil: { base: { emoji: "🏨", arText: "فُنْدُق", trText: "Otel", ornek: { ar: "سَأُقِيمُ فِي الفُنْدُقِ ثَلَاثَةَ أَيَّامٍ", tr: "Otelde üç gün kalacağım." } } },
        cogul: "فَنَادِق",
        cogulTr: "Oteller"
    },

    "İsim: Turist": {
        isDictOnly: true,
        tekil: { base: { emoji: "🎒", arText: "سَائِح", trText: "Turist, gezgin", ornek: { ar: "يَزُورُ السُّيَّاحُ المَدِينَةَ القَدِيمَةَ", tr: "Turistler eski şehri ziyaret ediyor." } } },
        cogul: "سُيَّاح",
        cogulTr: "Turistler"
    },

    "İsim: Pasaport": {
        isDictOnly: true,
        tekil: { base: { emoji: "🛂", arText: "جَوَاز سَفَر", trText: "Pasaport", ornek: { ar: "جَوَازُ سَفَرِي جَاهِزٌ", tr: "Pasaportum hazır." } } },
        cogul: "جَوَازَات سَفَر",
        cogulTr: "Pasaportlar"
    },

    "İsim: Bilet": {
        isDictOnly: true,
        tekil: { base: { emoji: "🎫", arText: "تَذْكِرَة", trText: "Bilet; hatırlatma", ornek: { ar: "اِشْتَرَيْتُ تَذْكِرَةَ الطَّائِرَةِ", tr: "Uçak biletini satın aldım." } } },
        cogul: "تَذَاكِر",
        cogulTr: "Biletler"
    },

    "İsim: Havalimanı": {
        isDictOnly: true,
        tip: "ulasim",
        tekil: { base: { emoji: "🛫", arText: "مَطَار", trText: "Havalimanı", ornek: { ar: "وَصَلْنَا إِلَى المَطَارِ مُبَكِّرًا", tr: "Havalimanına erken vardık." } } },
        cogul: "مَطَارَات",
        cogulTr: "Havalimanları"
    },

    "İsim: Gemi": {
        isDictOnly: true,
        tip: "ulasim",
        tekil: { base: { emoji: "🚢", arText: "سَفِينَة", trText: "Gemi", ornek: { ar: "تَسِيرُ السَّفِينَةُ فِي بَحْرِ مَرْمَرَةَ", tr: "Gemi Marmara Denizi'nde ilerliyor." } } },
        cogul: "سُفُن",
        cogulTr: "Gemiler"
    },

    "İsim: Marmara": {
        isDictOnly: true,
        tekil: { base: { emoji: "🌊", arText: "بَحْر مَرْمَرَة", trText: "Marmara Denizi", ornek: { ar: "بَحْرُ مَرْمَرَةَ بَيْنَ البَحْرِ الأَسْوَدِ وَبَحْرِ إِيجَة", tr: "Marmara Denizi, Karadeniz ile Ege arasındadır." } } }
    },

    /* ==================================================================
       6. SINIF ÜNİTELERİNDEN GELEN CÂMİD KELİMELER (6_1_1 … 6_2_3)
       Kökten türetilmeyen kelimeler: nidâ/zarf edatları, özel isimler,
       yabancı asıllı ve donuk isimler, kalıp ifadeler. Kökü olanlar
       veri_kokler.js'e yazıldı.
       ================================================================== */
    "Edat: Ey (Nida)": { isDictOnly: true, tip: "harficer", tekil: { base: { emoji: "📢", arText: "يَا", trText: "Ey / Hey (seslenme edatı)", ornek: { ar: "يَا أُسْتَاذُ، صَبَاحَ الخَيْرِ", tr: "Öğretmenim, günaydın." } } } },

    "Zarf: -dığı Zaman": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "⏳", arText: "عِنْدَمَا", trText: "...dığı zaman / ...ınca", ornek: { ar: "عِنْدَمَا يَأْتِي أَبِي نَفْرَحُ", tr: "Babam geldiğinde seviniriz." } } } },

    "İsim: Allah": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "☝️", arText: "الله", trText: "Allah", ornek: { ar: "الحَمْدُ لله", tr: "Hamd Allah'a mahsustur." } } } },

    "Kalıp: Elhamdülillah": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🙏", arText: "الحَمْدُ لله", trText: "Elhamdülillah / Çok şükür", ornek: { ar: "كَيْف حَالُكَ؟ الحَمْدُ لله", tr: "Nasılsın? Elhamdülillah." } } } },

    "İsim: Yusuf": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👦", arText: "يُوسُف", trText: "Yusuf (özel isim)", ornek: { ar: "يَا يُوسُف، هَيَّا بِنَا", tr: "Ey Yusuf, haydi gidelim." } } } },

    "İsim: Tarık": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👦", arText: "طَارِق", trText: "Tarık (özel isim)", ornek: { ar: "طَارِقٌ فِي غُرْفَتِهِ", tr: "Tarık odasında." } } } },

    "İsim: Zeynep": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👧", arText: "زَيْنَب", trText: "Zeynep (özel isim)", ornek: { ar: "زَيْنَب تِلْمِيذَةٌ مُجْتَهِدَةٌ", tr: "Zeynep çalışkan bir öğrencidir." } } } },

    "İsim: Zeyd": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👦", arText: "زَيْد", trText: "Zeyd (özel isim)", ornek: { ar: "يَا زَيْدُ، هَلْ أَنْتَ تَعْبَانُ؟", tr: "Ey Zeyd, yorgun musun?" } } } },

    "İsim: Süleyman": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👦", arText: "سُلَيْمَان", trText: "Süleyman (özel isim)", ornek: { ar: "سُلَيْمَان صَدِيقِي", tr: "Süleyman arkadaşımdır." } } } },

    "Meslek: Üstat (Öğretmen)": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👨‍🏫", arText: "أُسْتَاذ", trText: "Üstat / Öğretmen", ornek: { ar: "أُسْتَاذِي فِي المَدْرَسَةِ", tr: "Öğretmenim okulda." } } }, cogul: "أَسَاتِذَة", cogulTr: "Öğretmenler / Üstatlar" },

    "Okul: Öğrenci (Talebe)": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🎒", arText: "تِلْمِيذ", trText: "Öğrenci / Talebe", ornek: { ar: "هُوَ تِلْمِيذٌ فِي الصَّفِّ السَّادِسِ", tr: "O, altıncı sınıfta bir öğrencidir." } } }, cogul: "تَلَامِيذ", cogulTr: "Öğrenciler" },

    "Okul: Öğrenci (Kız)": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🎒", arText: "تِلْمِيذَة", trText: "Öğrenci (kız) / Talebe", ornek: { ar: "زَيْنَب تِلْمِيذَةٌ نَشِيطَةٌ", tr: "Zeynep hareketli bir öğrencidir." } } }, cogul: "تِلْمِيذَات", cogulTr: "Kız öğrenciler" },

    "Meslek: Garson": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🧑‍🍳", arText: "نَادِل", trText: "Garson", ornek: { ar: "النَّادِلُ يُقَدِّمُ الطَّعَامَ", tr: "Garson yemeği getiriyor." } } }, cogul: "نُدُل", cogulTr: "Garsonlar" },

    "Sebze: Mercimek": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🥣", arText: "عَدَس", trText: "Mercimek", ornek: { ar: "أُرِيدُ شُورْبَةَ العَدَسِ", tr: "Mercimek çorbası istiyorum." } } } },

    "Sebze: Sebzeler": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🥗", arText: "خَضْرَوَات", trText: "Sebzeler", ornek: { ar: "أُرِيدُ سَمَكًا مَعَ الخَضْرَوَاتِ", tr: "Sebzeli balık istiyorum." } } } },

    "Eşya: Yüzük": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "💍", arText: "خَاتَم", trText: "Yüzük", ornek: { ar: "هَلْ عِنْدَكَ خَاتَمٌ؟", tr: "Sende yüzük var mı?" } } }, cogul: "خَوَاتِم", cogulTr: "Yüzükler" },

    "Eşya: Gözlük": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👓", arText: "نَظَّارَة", trText: "Gözlük", ornek: { ar: "عِنْدَكَ اثْنَتَا عَشْرَةَ نَظَّارَةً", tr: "Sende on iki gözlük var." } } }, cogul: "نَظَّارَات", cogulTr: "Gözlükler" },

    "Oyun: Misket": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🔵", arText: "دِعْبِلَة", trText: "Misket / Bilye", ornek: { ar: "أَلْعَبُ بِالدِّعْبِلَةِ مَعَ أَخِي", tr: "Kardeşimle misket oynuyorum." } } }, cogul: "دَعَابِل", cogulTr: "Misketler" },

    "Aile: Yavrum": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👶", arText: "بُنَيّ", trText: "Yavrum / Oğulcuğum", ornek: { ar: "يَا بُنَيَّ، اِغْسِلْ يَدَيْكَ", tr: "Yavrum, ellerini yıka." } } } },

    "Edat: Alo": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "☎️", arText: "أَلُو", trText: "Alo", ornek: { ar: "أَلُو، مَنْ مَعِي؟", tr: "Alo, kimsiniz?" } } } },

    "Edat: Haydi": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🏃", arText: "هَيَّا", trText: "Haydi", ornek: { ar: "هَيَّا يَا يُوسُف إِلَى المَقْصَفِ", tr: "Haydi Yusuf, kantine." } } } },

    "Sayı: On İki": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🔢", arText: "اِثْنَا عَشَرَ", trText: "On iki", ornek: { ar: "عِنْدِي اثْنَا عَشَرَ قَلَمًا", tr: "Bende on iki kalem var." } } } },

    "Sayı: On İki (Dişil)": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🔢", arText: "اِثْنَتَا عَشْرَةَ", trText: "On iki (dişil sayılanla)", ornek: { ar: "عِنْدَكَ اثْنَتَا عَشْرَةَ كُرَةً", tr: "Sende on iki top var." } } } },

    "Sıra: On Birinci (Dişil)": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🕚", arText: "الحَادِيَةَ عَشْرَةَ", trText: "On bir / On birinci (dişil)", ornek: { ar: "السَّاعَةُ الآنَ الحَادِيَةَ عَشْرَةَ", tr: "Saat şimdi on bir." } } } },

    "Kalıp: Afiyet Olsun": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "😋", arText: "هَنِيئًا", trText: "Afiyet olsun / Afiyetle", ornek: { ar: "هَنِيئًا مَرِيئًا", tr: "Afiyet olsun." } } } },

    "Kalıp: Afiyet ve Şifa": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🍽️", arText: "بِالْهَنَاءِ وَالشِّفَاءِ", trText: "Afiyet olsun (yemek duası)", ornek: { ar: "بِالْهَنَاءِ وَالشِّفَاءِ يَا وَالِدَتِي", tr: "Afiyet olsun anneciğim." } } } },

    "Kalıp: Eline Sağlık": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "👏", arText: "سَلِمَتْ يَدَاكِ", trText: "Eline sağlık", ornek: { ar: "الطَّعَامُ لَذِيذٌ، سَلِمَتْ يَدَاكِ", tr: "Yemek lezzetli, eline sağlık." } } } },

    "Zarf: Erkenden": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "⏰", arText: "مُبَكِّرًا", trText: "Erkenden / Erken", ornek: { ar: "أَسْتَيْقِظُ مُبَكِّرًا كُلَّ يَوْمٍ", tr: "Her gün erken kalkarım." } } } },

    /* ====================================================================
       6. SINIF · 3-4. ÜNİTE (الصِّحَّة · المَلَابِس) — kitaptaki câmid
       isimler. Bunlar kalıp tablosundan türemiyor, sözlükte durmaları
       gerekiyor: kışlık-yazlık giysiler, temizlik eşyaları, mevsimler.
       ==================================================================== */
    "Giysi: Kazak": { isDictOnly: true, tip: "kiyafet", tekil: { base: { emoji: "🧶", arText: "بُلُوفَر", trText: "Kazak", ornek: { ar: "البُلُوفَرُ قَدِيمٌ", tr: "Kazak eskidir." } } }, cogul: "بُلُوفَرَات", cogulTr: "Kazaklar" },

    "Giysi: Başörtüsü": { isDictOnly: true, tip: "kiyafet", tekil: { base: { emoji: "🧕", arText: "خِمَار", trText: "Başörtüsü", ornek: { ar: "خِمَارُ أُخْتِي أَبْيَضُ", tr: "Kız kardeşimin başörtüsü beyazdır." } } }, cogul: "أَخْمِرَة", cogulTr: "Başörtüleri" },

    "Giysi: Elbise": { isDictOnly: true, tip: "kiyafet", tekil: { base: { emoji: "👗", arText: "فُسْتَان", trText: "Elbise", ornek: { ar: "الفُسْتَانُ بُرْتُقَالِيٌّ", tr: "Elbise turuncudur." } } }, cogul: "فَسَاتِين", cogulTr: "Elbiseler" },

    "Giysi: Çizme": { isDictOnly: true, tip: "kiyafet", tekil: { base: { emoji: "🥾", arText: "جَزْمَة", trText: "Çizme", ornek: { ar: "هَذِهِ الجَزْمَةُ خَفِيفَةٌ", tr: "Bu çizme hafiftir." } } }, cogul: "جَزْمَات", cogulTr: "Çizmeler" },

    "Giysi: Ceket": { isDictOnly: true, tip: "kiyafet", tekil: { base: { emoji: "🧥", arText: "جَاكِيت", trText: "Ceket", ornek: { ar: "الجَاكِيتُ بُنِّيٌّ", tr: "Ceket kahverengidir." } } }, cogul: "جَاكِيتَات", cogulTr: "Ceketler" },

    "Giysi: Kemer": { isDictOnly: true, tip: "kiyafet", tekil: { base: { emoji: "🎗️", arText: "حِزَام", trText: "Kemer", ornek: { ar: "حِزَامُ عَلِيّ أَسْوَدُ", tr: "Ali'nin kemeri siyahtır." } } }, cogul: "أَحْزِمَة", cogulTr: "Kemerler" },

    "Giysi: Çorap": { isDictOnly: true, tip: "kiyafet", tekil: { base: { emoji: "🧦", arText: "جَوْرَب", trText: "Çorap", ornek: { ar: "هَذَا الجَوْرَبُ طَوِيلٌ", tr: "Bu çorap uzundur." } } }, cogul: "جَوَارِب", cogulTr: "Çoraplar" },

    "Giysi: Eteklik": { isDictOnly: true, tip: "kiyafet", tekil: { base: { emoji: "👘", arText: "تَنُّورَة", trText: "Eteklik", ornek: { ar: "أُرِيدُ تَنُّورَةً طَوِيلَةً", tr: "Uzun bir eteklik istiyorum." } } }, cogul: "تَنَانِير", cogulTr: "Eteklikler" },

    "Giysi: Bluz": { isDictOnly: true, tip: "kiyafet", tekil: { base: { emoji: "👚", arText: "بْلُوزَة", trText: "Bluz", ornek: { ar: "هَذِهِ البْلُوزَةُ وَرْدِيَّةٌ", tr: "Bu bluz pembedir." } } }, cogul: "بْلُوزَات", cogulTr: "Bluzlar" },

    "Giysi: Tişört": { isDictOnly: true, tip: "kiyafet", tekil: { base: { emoji: "👕", arText: "تِيشِيرْت", trText: "Tişört", ornek: { ar: "هَذَا تِيشِيرْتٌ أَصْفَرُ", tr: "Bu sarı bir tişörttür." } } }, cogul: "تِيشِيرْتَات", cogulTr: "Tişörtler" },

    "Giysi: Terlik": { isDictOnly: true, tip: "kiyafet", tekil: { base: { emoji: "🩴", arText: "شِبْشِب", trText: "Terlik", ornek: { ar: "الشِّبْشِبُ بُرْتُقَالِيٌّ", tr: "Terlik turuncudur." } } }, cogul: "شَبَاشِب", cogulTr: "Terlikler" },

    "Giysi: Şort": { isDictOnly: true, tip: "kiyafet", tekil: { base: { emoji: "🩳", arText: "شُورْت", trText: "Şort", ornek: { ar: "أَلْبَسُ الشُّورْتَ فِي الصَّيْفِ", tr: "Yazın şort giyerim." } } }, cogul: "شُورْتَات", cogulTr: "Şortlar" },

    "Giysi: Yün": { isDictOnly: true, tip: "kiyafet", tekil: { base: { emoji: "🐑", arText: "صُوف", trText: "Yün", ornek: { ar: "هَذَا البُلُوفَرُ مِن الصُّوفِ", tr: "Bu kazak yündendir." } } } },

    "Giysi: Pamuk": { isDictOnly: true, tip: "kiyafet", tekil: { base: { emoji: "🌱", arText: "قُطْن", trText: "Pamuk", ornek: { ar: "القَمِيصُ مِن القُطْنِ", tr: "Gömlek pamuktandır." } } } },

    "Sağlık: Baş Ağrısı": { isDictOnly: true, tip: "saglik", tekil: { base: { emoji: "🤕", arText: "صُدَاع", trText: "Baş ağrısı", ornek: { ar: "عِنْدَهُ صُدَاعٌ شَدِيدٌ", tr: "Onun şiddetli baş ağrısı var." } } } },

    "Sağlık: Grip": { isDictOnly: true, tip: "saglik", tekil: { base: { emoji: "🤧", arText: "نَزْلَة", trText: "Grip / Nezle", ornek: { ar: "عِنْدَكَ نَزْلَةٌ", tr: "Sende grip var." } } } },

    "Sağlık: Poliklinik": { isDictOnly: true, tip: "saglik", tekil: { base: { emoji: "🏥", arText: "عِيَادَة", trText: "Muayenehane / Poliklinik", ornek: { ar: "أَيْن عِيَادَةُ الطَّبِيبِ؟", tr: "Doktorun muayenehanesi nerede?" } } }, cogul: "عِيَادَات", cogulTr: "Poliklinikler" },

    "Sağlık: Acil Servis": { isDictOnly: true, tip: "saglik", tekil: { base: { emoji: "🚑", arText: "قِسْمُ الطَّوَارِئِ", trText: "Acil servis", ornek: { ar: "العِيَادَةُ مُقَابِلَ قِسْمِ الطَّوَارِئِ", tr: "Poliklinik acil servisin karşısındadır." } } } },

    "Sağlık: Reçete": { isDictOnly: true, tip: "saglik", tekil: { base: { emoji: "📝", arText: "وَصْفَة طِبِّيَّة", trText: "Reçete", ornek: { ar: "يَكْتُبُ الطَّبِيبُ وَصْفَةً طِبِّيَّةً", tr: "Doktor bir reçete yazıyor." } } } },

    "Eşya: Diş Fırçası": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🪥", arText: "فُرْشَاةُ الأَسْنَانِ", trText: "Diş fırçası", ornek: { ar: "أُنَظِّفُ أَسْنَانِي بِفُرْشَاةِ الأَسْنَانِ", tr: "Dişlerimi diş fırçasıyla temizlerim." } } } },

    "Eşya: Süpürge": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🧹", arText: "مِكْنَسَة", trText: "Süpürge", ornek: { ar: "تُنَظِّفُ أُمِّي البَيْتَ بِالْمِكْنَسَةِ", tr: "Annem evi süpürgeyle temizler." } } }, cogul: "مَكَانِس", cogulTr: "Süpürgeler" },

    "Eşya: Çamaşır Makinesi": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🧺", arText: "غَسَّالَة", trText: "Çamaşır makinesi", ornek: { ar: "تَغْسِلُ خَالَتِي المَلَابِسَ بِالْغَسَّالَةِ", tr: "Teyzem çamaşırları makineyle yıkar." } } }, cogul: "غَسَّالَات", cogulTr: "Çamaşır makineleri" },

    "Eşya: Çöp Kutusu": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🗑️", arText: "سَلَّةُ القُمَامَةِ", trText: "Çöp kutusu", ornek: { ar: "اِرْمِ القُمَامَةَ فِي سَلَّةِ القُمَامَةِ", tr: "Çöpü çöp kutusuna at." } } } },

    "Eşya: Tabak": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🍽️", arText: "طَبَق", trText: "Tabak", ornek: { ar: "يَغْسِلُ أَخِي الأَطْبَاقَ", tr: "Kardeşim tabakları yıkıyor." } } }, cogul: "أَطْبَاق", cogulTr: "Tabaklar" },

    "Eşya: Buzdolabı": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🧊", arText: "ثَلَّاجَة", trText: "Buzdolabı", ornek: { ar: "ثَلَّاجَةُ البَيْتِ قَدِيمَةٌ", tr: "Evin buzdolabı eskidir." } } }, cogul: "ثَلَّاجَات", cogulTr: "Buzdolapları" },

    "Doğa: Kar": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "❄️", arText: "ثَلْج", trText: "Kar", ornek: { ar: "يَسْقُطُ الثَّلْجُ فِي الشِّتَاءِ", tr: "Kışın kar yağar." } } }, cogul: "ثُلُوج", cogulTr: "Karlar" },

    "Doğa: Yağmur": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🌧️", arText: "مَطَر", trText: "Yağmur", ornek: { ar: "يَسْقُطُ المَطَرُ فِي كُلِّ الفُصُولِ", tr: "Yağmur bütün mevsimlerde yağar." } } }, cogul: "أَمْطَار", cogulTr: "Yağmurlar" },

    "Doğa: Yaprak": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🍂", arText: "وَرَقَة", trText: "Yaprak", ornek: { ar: "تَتَسَاقَطُ الأَوْرَاقُ فِي الخَرِيفِ", tr: "Sonbaharda yapraklar dökülür." } } }, cogul: "أَوْرَاق", cogulTr: "Yapraklar" },

    "Mevsim: İlkbahar": { isDictOnly: true, tip: "mevsim", tekil: { base: { emoji: "🌸", arText: "الرَّبِيع", trText: "İlkbahar", ornek: { ar: "الجَوُّ مُعْتَدِلٌ فِي الرَّبِيعِ", tr: "İlkbaharda hava ılımandır." } } } },

    "Mevsim: Yaz": { isDictOnly: true, tip: "mevsim", tekil: { base: { emoji: "☀️", arText: "الصَّيْف", trText: "Yaz", ornek: { ar: "الجَوُّ حَارٌّ فِي الصَّيْفِ", tr: "Yazın hava sıcaktır." } } } },

    "Mevsim: Sonbahar": { isDictOnly: true, tip: "mevsim", tekil: { base: { emoji: "🍁", arText: "الخَرِيف", trText: "Sonbahar", ornek: { ar: "تَتَسَاقَطُ الأَوْرَاقُ فِي الخَرِيفِ", tr: "Sonbaharda yapraklar dökülür." } } } },

    "Mevsim: Kış": { isDictOnly: true, tip: "mevsim", tekil: { base: { emoji: "🌨️", arText: "الشِّتَاء", trText: "Kış", ornek: { ar: "الجَوُّ بَارِدٌ فِي الشِّتَاءِ", tr: "Kışın hava soğuktur." } } } },

    "Uzuv: Burun": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "👃", arText: "أَنْف", trText: "Burun", ornek: { ar: "الأَنْفُ يَشُمُّ", tr: "Burun koklar." } } }, cogul: "أُنُوف", cogulTr: "Burunlar" },

    "Uzuv: Göz": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "👁️", arText: "عَيْن", trText: "Göz", ornek: { ar: "العَيْنُ تَرَى وَالْأُذُنُ تَسْمَعُ", tr: "Göz görür, kulak işitir." } } }, cogul: "عُيُون", cogulTr: "Gözler" },

    "Uzuv: Diş": { isDictOnly: true, tip: "uzuv", tekil: { base: { emoji: "🦷", arText: "سِنّ", trText: "Diş", ornek: { ar: "أُنَظِّفُ أَسْنَانِي قَبْلَ النَّوْمِ", tr: "Uyumadan önce dişlerimi temizlerim." } } }, cogul: "أَسْنَان", cogulTr: "Dişler" },

    /* ==================================================================
       6. SINIF 5. ÜNİTE — KUTSAL MEKÂNLAR              (komisyon verisi)
       Kaynak: 6. Sınıf Arapça ders kitabı 2025, 5. Ünite, s. 129-156.
       Ders verileri: muhadese/veri/6_5_1..3.js
       Kökü kalıplar tablosunda bulunan kelimeler (جامِع، حَرَم، فاتِح،
       عاصِمَة، تاريخ، الهِجْرَة، مُسْلِم…) buraya YAZILMADI; onlar kendi
       köklerinden geliyor, ikinci kayıt aramada çift sonuç yapardı.
       ================================================================== */
    "Mekân: Mescid-i Haram": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🕋", arText: "المَسْجِدُ الحَرام", trText: "Mescid-i Haram (Mekke)", ornek: { ar: "المَسْجِدُ الحَرَامُ فِي مَكَّة المُكَرَّمَةِ", tr: "Mescid-i Haram Mekke-i Mükerreme'dedir." } } } },
    "Mekân: Kâbe": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🕋", arText: "الكَعْبَة", trText: "Kâbe / Şerefli Kâbe", ornek: { ar: "الكَعْبَةُ الشَّرِيفَةُ قِبْلَةُ المُسْلِمِينَ", tr: "Şerefli Kâbe Müslümanların kıblesidir." } } } },
    "Mekân: Arafat Dağı": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "⛰️", arText: "جَبَلُ عَرَفات", trText: "Arafat Dağı", ornek: { ar: "يَقِفُ المُسْلِمُونَ عَلَى جَبَلِ عَرَفَاتٍ", tr: "Müslümanlar Arafat Dağı'nda vakfeye durur." } } } },
    "Mekân: Nur Dağı": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🌄", arText: "جَبَلُ النّور", trText: "Nur Dağı", ornek: { ar: "جَبَلُ النُّورِ جَبَلٌ مُهِمٌّ فِي مَكَّة", tr: "Nur Dağı Mekke'de önemli bir dağdır." } } } },
    "Mekân: Hira Mağarası": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🕳️", arText: "غارُ حِراء", trText: "Hira Mağarası", ornek: { ar: "غَارُ حِرَاءَ فِي جَبَلِ النُّورِ", tr: "Hira Mağarası Nur Dağı'ndadır." } } } },
    "Mekân: Safa ve Merve": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🏃", arText: "الصَّفا وَالمَرْوَة", trText: "Safa ve Merve", ornek: { ar: "يَسْعَى المُسْلِمُونَ بَيْنَ الصَّفَا وَالْمَرْوَةِ", tr: "Müslümanlar Safa ile Merve arasında sa'y eder." } } } },
    "Mekân: Mescid-i Nebevî": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🕌", arText: "المَسْجِدُ النَّبَوِيّ", trText: "Mescid-i Nebevî (Medine)", ornek: { ar: "المَسْجِدُ النَّبَوِيُّ فِي المَدِينَةِ المُنَوَّرَةِ", tr: "Mescid-i Nebevî Medine-i Münevvere'dedir." } } } },
    "Mekân: Kuba Mescidi": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🕌", arText: "مَسْجِدُ قُباء", trText: "Kuba Mescidi", ornek: { ar: "أَوَّلُ مَسْجِدٍ فِي الإِسْلَامِ هُوَ مَسْجِدُ قُبَاءَ", tr: "İslam'daki ilk mescit Kuba Mescidi'dir." } } } },
    "Mekân: Kıbleteyn Mescidi": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🕌", arText: "مَسْجِدُ القِبْلَتَيْن", trText: "Kıbleteyn Mescidi", ornek: { ar: "مَسْجِدُ القِبْلَتَيْنِ مَسْجِدٌ قَدِيمٌ وَمُهِمٌّ", tr: "Kıbleteyn Mescidi eski ve önemli bir mescittir." } } } },
    "Mekân: Uhud Dağı": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "⛰️", arText: "جَبَلُ أُحُد", trText: "Uhud Dağı", ornek: { ar: "جَبَلُ أُحُدٍ فِي المَدِينَةِ المُنَوَّرَةِ", tr: "Uhud Dağı Medine-i Münevvere'dedir." } } } },
    "Mekân: Mescid-i Aksâ": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🕌", arText: "المَسْجِدُ الأَقْصى", trText: "Mescid-i Aksâ (Kudüs)", ornek: { ar: "أَوَّلُ قِبْلَةٍ فِي الإِسْلَامِ هُوَ المَسْجِدُ الأَقْصَى", tr: "İslam'daki ilk kıble Mescid-i Aksâ'dır." } } } },
    "Mekân: Kubbetü's-Sahra": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🟡", arText: "قُبَّةُ الصَّخْرَة", trText: "Kubbetü's-Sahra", ornek: { ar: "قُبَّةُ الصَّخْرَةِ فِي وَسَطِ الحَرَمِ القُدْسِيِّ", tr: "Kubbetü's-Sahra Harem-i Kudsî'nin ortasındadır." } } } },
    "Mekân: Harem-i Kudsî": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🕌", arText: "الحَرَمُ القُدْسِيّ", trText: "Harem-i Kudsî", ornek: { ar: "الحَرَمُ القُدْسِيُّ فِي القُدْس الشَّرِيفِ", tr: "Harem-i Kudsî Kudüs-i Şerif'tedir." } } } },
    "Mekân: Kıblî Camii": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🕌", arText: "الجامِعُ القِبْلِيّ", trText: "Kıblî Camii (Mescid-i Aksâ)", ornek: { ar: "الجَامِعُ القِبْلِيُّ دَاخِلَ الحَرَمِ القُدْسِيِّ", tr: "Kıblî Camii Harem-i Kudsî'nin içindedir." } } } },
    "Mekân: Ömer Mescidi": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🕌", arText: "مَسْجِدُ عُمَر", trText: "Ömer Mescidi", ornek: { ar: "مَسْجِدُ عُمَر فِي القُدْس الشَّرِيفِ", tr: "Ömer Mescidi Kudüs-i Şerif'tedir." } } } },
    "Mekân: Burak Duvarı": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🧱", arText: "حائِطُ البُراق", trText: "Burak Duvarı", ornek: { ar: "حَائِطُ البُرَاقِ عَلَى يَسَارِ المَسْجِدِ الأَقْصَى", tr: "Burak Duvarı Mescid-i Aksâ'nın solundadır." } } } },
    "Mekân: Asılı Taş": { isDictOnly: true, tip: "mukaddes", tekil: { base: { emoji: "🪨", arText: "الحَجَرُ المُعَلَّق", trText: "Asılı Taş (Kudüs)", ornek: { ar: "الحَجَرُ المُعَلَّقُ مِنْ مَعَالِمِ الحَرَمِ القُدْسِيِّ", tr: "Asılı Taş, Harem-i Kudsî'nin simgelerindendir." } } } },
    "Şehir: Mekke-i Mükerreme": { isDictOnly: true, tip: "sehir", tekil: { base: { emoji: "🕋", arText: "مَكَّة المُكَرَّمَة", trText: "Mekke-i Mükerreme", ornek: { ar: "مَكَّة المُكَرَّمَةُ فِي السُّعُودِيَّةِ", tr: "Mekke-i Mükerreme Suudi Arabistan'dadır." } } } },
    "Şehir: Medine-i Münevvere": { isDictOnly: true, tip: "sehir", tekil: { base: { emoji: "🕌", arText: "المَدينَةُ المُنَوَّرَة", trText: "Medine-i Münevvere", ornek: { ar: "المَدِينَةُ المُنَوَّرَةُ أَوَّلُ عَاصِمَةٍ لِلْمُسْلِمِينَ", tr: "Medine-i Münevvere Müslümanların ilk başkentidir." } } } },
    "Şehir: Kudüs": { isDictOnly: true, tip: "sehir", tekil: { base: { emoji: "🕌", arText: "القُدْس الشَّريف", trText: "Kudüs-i Şerif", ornek: { ar: "القُدْس تَقَعُ فِي فِلَسْطِينَ", tr: "Kudüs Filistin'dedir." } } } },
    "Şehir: Bolu": { isDictOnly: true, tip: "sehir", tekil: { base: { emoji: "🌲", arText: "بولو", trText: "Bolu", ornek: { ar: "أَنْقَرَة قَرِيبَةٌ مِنْ مَدِينَةِ بُولُو", tr: "Ankara Bolu şehrine yakındır." } } } },
    "İsim: Kıble": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🧭", arText: "قِبْلَة", trText: "Kıble", ornek: { ar: "الكَعْبَةُ قِبْلَةُ المُسْلِمِينَ", tr: "Kâbe Müslümanların kıblesidir." } } } },
    "İsim: Mağara": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🕳️", arText: "غار", trText: "Mağara", ornek: { ar: "غَارُ حِرَاءَ غَارٌ مُهِمٌّ", tr: "Hira Mağarası önemli bir mağaradır." } } } },
    "İsim: Kubbe": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🛕", arText: "قُبَّة", trText: "Kubbe", ornek: { ar: "قُبَّةُ المَسْجِدِ زَرْقَاءُ", tr: "Mescidin kubbesi mavidir." } } } },
    "İsim: Kaya": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🪨", arText: "صَخْرَة", trText: "Kaya", ornek: { ar: "الصَّخْرَةُ كَبِيرَةٌ", tr: "Kaya büyüktür." } } } },
    "İsim: Duvar": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🧱", arText: "حائِط", trText: "Duvar", ornek: { ar: "الصُّورَةُ عَلَى الحَائِطِ", tr: "Resim duvardadır." } } } },
    "İsim: Peygamber": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "☪️", arText: "نَبِيّ", trText: "Peygamber / Nebî", ornek: { ar: "عَاشَ النَّبِيُّ فِي المَدِينَةِ بَعْدَ الهِجْرَةِ", tr: "Peygamber hicretten sonra Medine'de yaşadı." } } } },
    "İsim: Kur'ân-ı Kerîm": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "📖", arText: "القُرْآنُ الكَريم", trText: "Kur'ân-ı Kerîm", ornek: { ar: "يَقْرَأُ المُسْلِمُونَ القُرْآنَ الكَرِيمَ", tr: "Müslümanlar Kur'ân-ı Kerîm okur." } } } },
    "İsim: Selahaddin Eyyubî": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🗡️", arText: "صَلاحُ الدّينِ الأَيّوبِيّ", trText: "Selahaddin Eyyubî", ornek: { ar: "فَتَحَ صَلَاحُ الدِّينِ الأَيُّوبِيُّ القُدْس", tr: "Kudüs'ü Selahaddin Eyyubî fethetti." } } } },
    "Eşya: Sehpa": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🪑", arText: "مِنْضَدَة", trText: "Sehpa / Küçük masa", ornek: { ar: "الحَاسُوبُ عَلَى المِنْضَدَةِ", tr: "Bilgisayar sehpanın üstündedir." } } } },
    "Sıfat: Mükemmel": { isDictOnly: true, tip: "sifat", tekil: { base: { emoji: "⭐", arText: "مُمْتاز", trText: "Mükemmel / Üstün", ornek: { ar: "عَمَلٌ مُمْتَازٌ", tr: "Mükemmel bir iş." } } } },
    "Sıfat: İşgal Altında": { isDictOnly: true, tip: "sifat", tekil: { base: { emoji: "🚧", arText: "مُحْتَلّ", trText: "İşgal altındaki", ornek: { ar: "فِلَسْطِينُ المُحْتَلَّةُ", tr: "İşgal altındaki Filistin." } } } },
    "Kalıp: İnşallah": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🤲", arText: "إِنْ شاءَ الله", trText: "İnşallah / Allah dilerse", ornek: { ar: "سَأُسَافِرُ إِنْ شَاءَ اللهُ", tr: "İnşallah seyahat edeceğim." } } } },
    "Kalıp: Aferin": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "👏", arText: "أَحْسَنْتَ", trText: "Aferin / Ne güzel yaptın", ornek: { ar: "أَحْسَنْتَ يَا صَدِيقِي", tr: "Aferin dostum." } } } },
    "Kalıp: Tam Olarak": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🎯", arText: "بِالضَّبْطِ", trText: "Tam olarak / Tam anlamıyla", ornek: { ar: "أَيْن يَقَعُ بِالضَّبْطِ؟", tr: "Tam olarak nerededir?" } } } },
    "Kalıp: Söyle Bana": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "💬", arText: "قُلْ لي", trText: "Söyle bana", ornek: { ar: "قُلْ لِي مِنْ فَضْلِكَ", tr: "Lütfen bana söyle." } } } },

    /* ==================================================================
       6. SINIF 6. ÜNİTE — ULAŞIM VE TRAFİK             (komisyon verisi)
       Kaynak: 6. Sınıf Arapça ders kitabı 2025, 6. Ünite, s. 157-190.
       Ders verileri: muhadese/veri/6_6_1..3.js
       Kökü kalıplar tablosundan gelen kelimeler (لَوْن، مَمْنوع، يَقودُ،
       يَهْبِطُ، شُجاع، شُرْطِيّ، أُجْرَة، طَيّار، مَعْلومَة، تاريخِيّ،
       يَتَعامَلُ…) buraya YAZILMADI; onlar köklerinden geliyor.
       ================================================================== */
    "Ulaşım: Araçları": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚦", arText: "وَسائِلُ المُواصَلات", trText: "Ulaşım araçları", ornek: { ar: "الحَافِلَةُ وَالْقِطَارُ مِنْ وَسَائِلِ المُوَاصَلَاتِ", tr: "Otobüs ve tren ulaşım araçlarındandır." } } } },
    "Ulaşım: Vasıta": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚌", arText: "وَسيلَة", trText: "Araç / Vasıta", ornek: { ar: "الحَافِلَةُ وَسِيلَةُ مُوَاصَلَاتٍ مُرِيحَةٌ", tr: "Otobüs rahat bir ulaşım aracıdır." } } } },
    "Trafik: Yaya Geçidi": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚸", arText: "عُبورُ المُشاة", trText: "Yaya geçidi", ornek: { ar: "يَعْبُرُ المُشَاةُ مِنْ عُبُورِ المُشَاةِ", tr: "Yayalar yaya geçidinden geçer." } } } },
    "Trafik: Karşıdan Karşıya Geçme": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🚶", arText: "عُبورُ الطَّريق", trText: "Yoldan (karşıdan karşıya) geçme", ornek: { ar: "عُبُورُ الطَّرِيقِ فِي الضَّوْءِ الأَخْضَرِ", tr: "Yoldan yeşil ışıkta geçmek." } } } },
    "Trafik: İşaretleri": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🛑", arText: "إِشاراتُ المُرور", trText: "Trafik işaretleri", ornek: { ar: "هَلْ عِنْدَكَ مَعْلُومَاتٌ عَنْ إِشَارَاتِ المُرُورِ؟", tr: "Trafik işaretleri hakkında bilgin var mı?" } } } },
    "Trafik: Kırmızı Işık": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🔴", arText: "الضَّوْءُ الأَحْمَر", trText: "Kırmızı ışık", ornek: { ar: "يَقِفُ المُشَاةُ فِي الضَّوْءِ الأَحْمَرِ", tr: "Yayalar kırmızı ışıkta durur." } } } },
    "Trafik: Yeşil Işık": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🟢", arText: "الضَّوْءُ الأَخْضَر", trText: "Yeşil ışık", ornek: { ar: "يَعْبُرُ المُشَاةُ فِي الضَّوْءِ الأَخْضَرِ", tr: "Yayalar yeşil ışıkta geçer." } } } },
    "Trafik: Sarı Işık": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🟡", arText: "الضَّوْءُ الأَصْفَر", trText: "Sarı ışık", ornek: { ar: "يَسْتَعِدُّ السَّائِقُ فِي الضَّوْءِ الأَصْفَرِ", tr: "Sürücü sarı ışıkta hazırlanır." } } } },
    "Trafik: Park Yasağı": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "⛔", arText: "مَمْنوعُ الوُقوف", trText: "Park etmek yasaktır", ornek: { ar: "مَمْنُوعُ الوُقُوفِ أَمَامَ المُسْتَشْفَى", tr: "Hastanenin önünde park etmek yasaktır." } } } },
    "Trafik: Kaza": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "💥", arText: "حادِثُ المُرور", trText: "Trafik kazası", ornek: { ar: "أَنْقَذَ الرَّجُلُ الوَلَدَ مِنْ حَادِثِ المُرُورِ", tr: "Adam çocuğu trafik kazasından kurtardı." } } } },
    "Trafik: Emniyet Kemeri": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🔗", arText: "حِزامُ الأَمان", trText: "Emniyet kemeri", ornek: { ar: "يَجِبُ اسْتِخْدَامُ حِزَامِ الأَمَانِ أَثْنَاءَ السَّيْرِ", tr: "Sürüş sırasında emniyet kemeri kullanılmalıdır." } } } },
    "Trafik: Sola Dön": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "⬅️", arText: "اِتَّجِهْ إِلى اليَسار", trText: "Sola dön", ornek: { ar: "اِتَّجِهْ إِلَى اليَسَارِ لَا إِلَى اليَمِينِ", tr: "Sola dön, sağa değil." } } } },
    "Trafik: Sağa Dön": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "➡️", arText: "اِتَّجِهْ إِلى اليَمين", trText: "Sağa dön", ornek: { ar: "اِتَّجِهْ إِلَى اليَمِينِ عِنْدَ المَسْجِدِ", tr: "Camide sağa dön." } } } },
    "Ulaşım: Gidiş-Dönüş": { isDictOnly: true, tip: "ulasim", tekil: { base: { emoji: "🔁", arText: "ذَهاب وَإِياب", trText: "Gidiş-dönüş", ornek: { ar: "أُرِيدُ تَذْكِرَةَ ذَهَابٍ وَإِيَابٍ", tr: "Gidiş-dönüş bileti istiyorum." } } } },
    "Zaman: Yaz Tatili": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🏖️", arText: "العُطْلَةُ الصَّيْفِيَّة", trText: "Yaz tatili", ornek: { ar: "ذَهَبْتُ إِلَى الأُرْدُنِّ فِي العُطْلَةِ الصَّيْفِيَّةِ", tr: "Yaz tatilinde Ürdün'e gittim." } } } },
    "Zaman: Gelecek Hafta": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "📅", arText: "الأُسْبوعُ القادِم", trText: "Gelecek hafta", ornek: { ar: "سَأَلْعَبُ كُرَةَ القَدَمِ فِي الأُسْبُوعِ القَادِمِ", tr: "Gelecek hafta futbol oynayacağım." } } } },
    "Zaman: Geçen Ay": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🗓️", arText: "الشَّهْرُ الماضي", trText: "Geçen ay", ornek: { ar: "ذَهَبُوا إِلَى المَسْجِدِ فِي الشَّهْرِ المَاضِي", tr: "Geçen ay mescide gittiler." } } } },
    "Zaman: Gelecek Yıl": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "📆", arText: "السَّنَةُ القادِمَة", trText: "Gelecek yıl", ornek: { ar: "سَأُسَافِرُ فِي السَّنَةِ القَادِمَةِ", tr: "Gelecek yıl seyahat edeceğim." } } } },
    "Zaman: Esnasında": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏳", arText: "أَثْناءَ", trText: "Sırasında / Esnasında", ornek: { ar: "مَمْنُوعٌ اسْتِخْدَامُ الجَوَّالِ أَثْنَاءَ السَّيْرِ", tr: "Sürüş sırasında cep telefonu kullanmak yasaktır." } } } },
    "Zaman: Geçmiş": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏮️", arText: "ماضٍ", trText: "Geçmiş / Geçen", ornek: { ar: "فِي الأُسْبُوعِ المَاضِي", tr: "Geçen hafta." } } } },
    "Mekân: Deniz Kıyısı": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🏝️", arText: "شاطِئُ البَحْر", trText: "Deniz kıyısı / Sahil", ornek: { ar: "شَاطِئُ البَحْرِ جَمِيلٌ فِي الصَّيْفِ", tr: "Deniz kıyısı yazın güzeldir." } } } },
    "İsim: Tarihî Eserler": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🏺", arText: "الآثارُ التّاريخِيَّة", trText: "Tarihî eserler", ornek: { ar: "رَأَيْتُ الآثَارَ التَّارِيخِيَّةَ فِي بُورْصَة", tr: "Bursa'da tarihî eserleri gördüm." } } } },
    "İsim: Spor Yapma": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🏃", arText: "مُمارَسَةُ الرِّياضَة", trText: "Spor yapma", ornek: { ar: "مُمَارَسَةُ الرِّيَاضَةِ مُفِيدَةٌ لِلصِّحَّةِ", tr: "Spor yapmak sağlığa faydalıdır." } } } },
    "İsim: Cep Telefonu": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "📱", arText: "الهاتِفُ الجَوّال", trText: "Cep telefonu", ornek: { ar: "تَتَكَلَّمُ بِالْهَاتِفِ الجَوَّالِ", tr: "Cep telefonuyla konuşuyor." } } } },
    "İsim: İnsan": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🧍", arText: "إِنْسان", trText: "İnsan", ornek: { ar: "الإِنْسَانُ يَتَعَامَلُ مَعَ النَّاسِ", tr: "İnsan, insanlarla iletişim kurar." } } } },
    "Kalıp: İyi Yolculuklar": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🧳", arText: "رِحْلَةً سَعيدَةً", trText: "İyi yolculuklar", ornek: { ar: "شُكْرًا، رِحْلَةً سَعِيدَةً", tr: "Teşekkürler, iyi yolculuklar." } } } },
    "Kalıp: Yaklaşık": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "≈", arText: "تَقْريبًا", trText: "Yaklaşık / Neredeyse", ornek: { ar: "ثَلَاثُ سَاعَاتٍ تَقْرِيبًا", tr: "Yaklaşık üç saat." } } } },
    "Kalıp: Aferin (Çoğul)": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "👏", arText: "أَحْسَنْتُمْ", trText: "Aferin size / Ne güzel yaptınız", ornek: { ar: "أَحْسَنْتُمْ يَا طُلَّابُ", tr: "Aferin size öğrenciler." } } } },
    "Zarf: Yanında (Bitişik)": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "↔️", arText: "بِجانِبِ", trText: "Yanında / Bitişiğinde", ornek: { ar: "السَّيَّارَةُ بِجَانِبِ البَيْتِ", tr: "Araba evin yanındadır." } } } },
    "Para: Türk Lirası": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "💴", arText: "لِيرَة تُرْكِيَّة", trText: "Türk lirası", ornek: { ar: "ثَمَنُهَا مِئَتَانِ وَعَشْرُ لِيرَاتٍ تُرْكِيَّة", tr: "Fiyatı iki yüz on Türk lirası." } } } },
    /* Kökü tabloda bulunmayan dört kelime (غدر · ضوأ · نقذ · خطط kökleri
       tabloda yok) sözlük kaydı olarak duruyor. */
    "Fiil: Ayrılmak": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🚉", arText: "يُغادِرُ", trText: "(Tren, uçak) kalkar / Ayrılır", ornek: { ar: "مَتَى سَيُغَادِرُ قِطَارُ إِسْطَنْبُول؟", tr: "İstanbul treni ne zaman kalkacak?" } } } },
    "Fiil: Kurtarmak": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🦸", arText: "أَنْقَذَ", trText: "Kurtardı", ornek: { ar: "الرَّجُلُ الشُّجَاعُ أَنْقَذَ الوَلَدَ", tr: "Cesur adam çocuğu kurtardı." } } } },
    "Sıfat: Işıklı": { isDictOnly: true, tip: "sifat", tekil: { base: { emoji: "💡", arText: "ضَوْئِيّ", trText: "Işıklı", ornek: { ar: "إِشَارَاتُ المُرُورِ الضَّوْئِيَّةُ", tr: "Işıklı trafik işaretleri." } } } },
    "İsim: Çizgi": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "➖", arText: "خَطّ", trText: "Çizgi / Hat, yazı", ornek: { ar: "مَا لَوْنُ الخَطِّ؟ لَوْنُهُ أَصْفَرُ", tr: "Çizginin rengi nedir? Rengi sarıdır." } } } },

    /* ── 8. SINIF 1. ÜNİTE 1. DERS (الأَنْدِيَة) ─────────────────────────────
       Türetilemeyen (câmid) ve yabancı asıllı kelimeler ile ders
       kitabındaki özel isimler. نَادٍ ve مُلْصَق kök olarak
       veri_kokler.js'e eklendi, burada tekrar edilmedi. */
    "Oyun: Satranç": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "♟️", arText: "شَطْرَنْج", trText: "Satranç", ornek: { ar: "بُشْرَى تَخْتَارُ نَادِيَ الشَّطْرَنْجِ", tr: "Büşra satranç kulübünü seçiyor." } } } },
    "İsim: Teknoloji": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "💻", arText: "تَكْنُولُوجْيَا", trText: "Teknoloji (yabancı asıllı, çekimsiz)", ornek: { ar: "عُمَر يَخْتَارُ نَادِيَ التَّكْنُولُوجْيَا", tr: "Ömer teknoloji kulübünü seçiyor." } } } },
    "İsim: Meral": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👧", arText: "مَرَال", trText: "Meral (özel isim)", ornek: { ar: "مَرَالُ تُحِبُّ الرِّيَاضَةَ", tr: "Meral sporu seviyor." } } } },
    "İsim: Elif": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👧", arText: "أَلِيف", trText: "Elif (özel isim)", ornek: { ar: "أَلِيفُ مَسْؤُولَةٌ عَنْ نَظَافَةِ الصَّفِّ", tr: "Elif sınıfın temizliğinden sorumludur." } } } },
    "İsim: Merve": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👧", arText: "مَرْوَة", trText: "Merve (özel isim; Mekke'deki Merve tepesi)", ornek: { ar: "صَدِيقَتِي مَرْوَة تَخْتَارُ نَادِيَ المَكْتَبَةِ", tr: "Arkadaşım Merve kütüphane kulübünü seçiyor." } } } },
    "İsim: Sümeyye": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👧", arText: "سُمَيَّة", trText: "Sümeyye (özel isim)", ornek: { ar: "سُمَيَّةُ تُحِبُّ الشَّطْرَنْجَ", tr: "Sümeyye satrancı seviyor." } } } },
    "İsim: Meryem": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👧", arText: "مَرْيَم", trText: "Meryem (özel isim)", ornek: { ar: "صَدِيقَتِي مَرْيَم تُحِبُّ المُوسِيقَى", tr: "Arkadaşım Meryem müziği seviyor." } } } },

    /* ── 8. SINIF (18 DERS) — CÂMİD VE YABANCI KELİMELER, ÖZEL İSİMLER ──
       Türetilemeyen ya da sözlükte kök karşılığı olmayan kelimeler. */
    "Tiyatro: Sahne": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🎬", arText: "مَشْهَد", trText: "Sahne (oyunda)", ornek: { ar: "نُجَهِّزُ الدّيكورَ لِلْمَشْهَدِ", tr: "Sahne için dekoru hazırlıyoruz." } } }, cogul: { emoji: "🎞️", arText: "مَشاهِد", trText: "Sahneler" } },
    "Tiyatro: Senaryo": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "📜", arText: "سيناريو", trText: "Senaryo (yabancı asıllı)", ornek: { ar: "أَقْرَأُ السّيناريو بِدِقّةٍ", tr: "Senaryoyu dikkatle okurum." } } } },
    "Tiyatro: Dekor": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🪑", arText: "ديكور", trText: "Dekor (yabancı asıllı)", ornek: { ar: "هِيَ تُجَهِّزُ الدّيكورَ", tr: "O dekoru hazırlıyor." } } } },
    "Tiyatro: Rol": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🎭", arText: "دَوْر", trText: "Rol; sıra, nöbet", ornek: { ar: "هُوَ يُؤَدّي دَوْرَهُ", tr: "O rolünü oynuyor." } } }, cogul: { emoji: "🎭", arText: "أَدْوار", trText: "Roller" } },
    "İsim: Cuha": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🧔", arText: "جُحا", trText: "Cuha — Türk edebiyatında Nasreddin Hoca", ornek: { ar: "جُحا شَخْصٌ مَشْهورٌ", tr: "Cuha meşhur bir şahsiyettir." } } } },
    "İsim: Alâeddin": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🪔", arText: "عَلاء الدّين", trText: "Alâeddin (masal kahramanı)" } } },
    "İsim: Şehriyar": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👑", arText: "شَهْرِيار", trText: "Şehriyar — Binbir Gece'deki hükümdar" } } },
    "İsim: Şehrazat": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👸", arText: "شَهْرَزاد", trText: "Şehrazat — Binbir Gece'nin anlatıcısı" } } },
    "İsim: Sindbad": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "⛵", arText: "السِّنْدِباد", trText: "Sindbad (masal kahramanı)" } } },
    "İsim: Hâlid": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👦", arText: "خالِد", trText: "Hâlid (özel isim)" } } },
    "İsim: Leylâ": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👧", arText: "لَيْلى", trText: "Leylâ (özel isim)" } } },
    "İsim: Halime": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👩", arText: "حَليمة", trText: "Halime (özel isim)" } } },
    "İsim: Hatice": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👧", arText: "خَديجة", trText: "Hatice (özel isim)" } } },
    "İsim: Aynur": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👧", arText: "آيْنور", trText: "Aynur (özel isim)" } } },
    "İsim: Yasir": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👦", arText: "ياسِر", trText: "Yasir (özel isim)" } } },
    "İsim: Süleyman": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👦", arText: "سُلَيْمان", trText: "Süleyman (özel isim)" } } },
    "İsim: Münir": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👦", arText: "مُنير", trText: "Münir (özel isim)" } } },
    "İsim: Emîre": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👧", arText: "أَميرة", trText: "Emîre (özel isim)" } } },
    "İsim: Cemil": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👦", arText: "جَميل", trText: "Cemil (özel isim)" } } },
    "İsim: Edâ": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👧", arText: "أَداء", trText: "Edâ (özel isim)" } } },
    "İsim: İrem": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👧", arText: "إِرَم", trText: "İrem (özel isim)" } } },
    "İsim: Enes": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👦", arText: "أَنَس", trText: "Enes (özel isim)" } } },
    "İsim: Sâre": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "👧", arText: "سارة", trText: "Sâre (özel isim)" } } },
    "Şehir: Semerkant": { isDictOnly: true, tip: "sehir", tekil: { base: { emoji: "🕌", arText: "سَمَرْقَنْد", trText: "Semerkant (şehir)" } } },
    "Şehir: Sinop": { isDictOnly: true, tip: "sehir", tekil: { base: { emoji: "🏖️", arText: "سينوب", trText: "Sinop" } } },
    "Şehir: Ağrı": { isDictOnly: true, tip: "sehir", tekil: { base: { emoji: "🏔️", arText: "أَغْري", trText: "Ağrı" } } },
    "Ülke: Hindistan": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🇮🇳", arText: "الهِنْد", trText: "Hindistan", ornek: { ar: "ظَهَرَ الشَّطْرَنْجُ في الهِنْدِ", tr: "Satranç Hindistan'da ortaya çıktı." } } } },
    "Ülke: İngiltere": { isDictOnly: true, tip: "ulke", tekil: { base: { emoji: "🏴", arText: "إِنْجِلْتَرا", trText: "İngiltere" } } },
    "İsim: Anadolu": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🗺️", arText: "الأَناضول", trText: "Anadolu", ornek: { ar: "تَقَعُ أَنْقَرة في وَسَطِ الأَناضولِ", tr: "Ankara Anadolu'nun ortasında yer alır." } } } },
    "Mekân: Gülhane Parkı": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🌳", arText: "حَديقة كُلْخانة", trText: "Gülhane Parkı (İstanbul)" } } },
    "Mekân: Topkapı Müzesi": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🏰", arText: "مُتْحَف طوب قابي", trText: "Topkapı Müzesi" } } },
    "Mekân: Yerebatan": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🏛️", arText: "القَصْر المَغْمور", trText: "Yerebatan Sarnıcı (suya gömülü saray)" } } },
    "Mekân: Ayasofya": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🕌", arText: "آيا صوفْيا", trText: "Ayasofya" } } },
    "Mekân: Kapalıçarşı": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🛍️", arText: "البازار الكَبير", trText: "Kapalıçarşı" } } },
    "Mekân: Aspendos": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🏛️", arText: "أَسْبَنْدوس", trText: "Aspendos (antik şehir)" } } },
    "Doğa: Şelale": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "💦", arText: "شَلّال", trText: "Şelale", ornek: { ar: "شَلّالُ دودَن في أَنْطالْيا", tr: "Antalya'daki Düden Şelalesi." } } }, cogul: { emoji: "🌊", arText: "شَلّالات", trText: "Şelaleler" } },
    "Doğa: Mağara": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🕳️", arText: "كَهْف", trText: "Mağara", ornek: { ar: "كَهْفُ دامْلاتاش", tr: "Damlataş Mağarası." } } }, cogul: { emoji: "🕳️", arText: "كُهوف", trText: "Mağaralar" } },
    "İsim: Teknoloji": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "💻", arText: "تَكْنُولُوجْيا", trText: "Teknoloji (yabancı asıllı)" } } },
    "İsim: Video": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "📹", arText: "فيديو", trText: "Video (yabancı asıllı)" } } },
    "Yiyecek: Çikolata": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🍫", arText: "شوكولاتة", trText: "Çikolata", ornek: { ar: "سَأَشْتَري لَهُ عُلْبةَ شوكولاتةٍ", tr: "Ona bir kutu çikolata alacağım." } } } },
    "Kitap: Dram": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🎭", arText: "الدِّراما", trText: "Dram (kitap türü)" } } },
    "Kitap: Bilim Kurgu": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🚀", arText: "الخَيال العِلْمِيّ", trText: "Bilim kurgu" } } },
    "Kitap: Macera": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🗺️", arText: "المُغامَرات", trText: "Maceralar (kitap türü)" } } },
    "Sanat: Çini": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🏺", arText: "الخَزَف", trText: "Çini, seramik", ornek: { ar: "فَنُّ الخَزَفِ التُّرْكِيِّ مُمْتِعٌ", tr: "Türk çini sanatı keyiflidir." } } } },
    "Sanat: Çinici": { isDictOnly: true, tip: "meslek", tekil: { base: { emoji: "👩‍🎨", arText: "الخَزّافة", trText: "Çinici (kadın), seramik ustası" } } },
    "Sanat: Ebru": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🎨", arText: "الأَبْرو", trText: "Ebru — su üzerine resim sanatı" } } },
    "Sanat: Cam": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🪟", arText: "الزُّجاج", trText: "Cam", ornek: { ar: "فَنُّ الزُّجاجِ هُوَ النَّقْشُ عَلى الزُّجاجِ", tr: "Cam sanatı, cam üzerine işlemedir." } } } },
    "Sanat: Nakış": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🖌️", arText: "النَّقْش", trText: "Nakış, işleme" } } },
    "Sanat: Tezhip": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "✨", arText: "التَّذْهيب", trText: "Tezhip — altın yaldızla süsleme" } } },
    "Sanat: Cilt": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "📕", arText: "التَّجْليد", trText: "Ciltleme (kitap)" } } },
    "Spor: Tenis": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🎾", arText: "تَنِس", trText: "Tenis" } } },
    "Spor: Güreş": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🤼", arText: "المُصارَعة", trText: "Güreş", ornek: { ar: "أَقْدَمُ رِياضةٍ في التّاريخِ هِيَ المُصارَعةُ", tr: "Tarihteki en eski spor güreştir." } } } },
    "Spor: Tırmanma": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🧗", arText: "تَسَلُّق", trText: "Tırmanma" } } },
    "Spor: Kayak": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "⛷️", arText: "تَزَلُّج", trText: "Kayak" } } },
    "Doğa: Deprem": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🏚️", arText: "زِلْزال", trText: "Deprem", ornek: { ar: "يَحْدُثُ الزِّلْزالُ كَثيرًا في تُرْكِيا", tr: "Türkiye'de deprem çok olur." } } }, cogul: { emoji: "🌍", arText: "زَلازِل", trText: "Depremler" } },
    "Doğa: Kuraklık": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🏜️", arText: "جَفاف", trText: "Kuraklık" } } },
    "Doğa: Toprak Kayması": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "⛰️", arText: "اِنْهِيار أَرْضِيّ", trText: "Toprak kayması" } } },
    "Doğa: Çığ": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🏔️", arText: "اِنْهِيار ثَلْجِيّ", trText: "Çığ" } } },
    "Doğa: Küresel Isınma": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🌡️", arText: "الاِحْتِباس الحَرارِيّ", trText: "Küresel ısınma (sera etkisi)" } } },
    "Çevre: Gürültü": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "📢", arText: "ضَوْضاء", trText: "Gürültü" } } },
    "Çevre: Atık": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🗑️", arText: "نُفايات", trText: "Atıklar, çöpler" } } },
    "Çevre: Geri Dönüşüm": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "♻️", arText: "إِعادة التَّدْوير", trText: "Geri dönüşüm" } } },
    "Okul: Kamp": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "⛺", arText: "المُخَيَّم", trText: "Kamp", ornek: { ar: "هِيَ سَتَذْهَبُ إِلى المُخَيَّمِ", tr: "O kampa gidecek." } } } },
    "Okul: Sıra": { isDictOnly: true, tip: "okul", tekil: { base: { emoji: "🪑", arText: "مَقْعَد", trText: "Sıra, oturak" } }, cogul: { emoji: "🪑", arText: "مَقاعِد", trText: "Sıralar" } },
    "İsim: Göçmen": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🧳", arText: "نازِح", trText: "Göçmen, yerinden edilmiş" } }, cogul: { emoji: "👨‍👩‍👧", arText: "النّازِحون", trText: "Göçmenler" } },
    "İsim: Afetzede": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🆘", arText: "مَنْكوب", trText: "Afetzede" } }, cogul: { emoji: "🤝", arText: "المَنْكوبون", trText: "Afetzedeler" } },
    "İsim: Bayramlaşma": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🤗", arText: "مُعايَدة", trText: "Bayramlaşma" } } },
    "İsim: Bayram Harçlığı": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "💵", arText: "عيدِيّة", trText: "Bayram harçlığı" } }, cogul: { emoji: "🧧", arText: "عيدِيّات", trText: "Bayram harçlıkları" } },
    "İsim: Mevlânâ": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🕌", arText: "مَوْلانا", trText: "Mevlânâ — Konya'daki Mevlânâ Müzesi bu adı taşır", ornek: { ar: "مُتْحَفُ مَوْلانا في قونْيَة", tr: "Mevlânâ Müzesi Konya'dadır." } } } },

    /* >>> 7. sınıf Mektep kitabından eklenen câmid maddeler (23.09.2026) */
    "Sebze: Maydanoz": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🌿", arText: "بَقْدونِس", trText: "Maydanoz", ornek: { ar: "أنا أُريد البَقْدونِس.", tr: "Ben maydanoz istiyorum." } } } },
    "Sebze: Nane": { isDictOnly: true, tip: "sebze", tekil: { base: { emoji: "🍃", arText: "نَعْناع", trText: "Nane", ornek: { ar: "أنا أُريد النَّعْناع.", tr: "Ben nane istiyorum." } } } },
    "Eşya: Zarf": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "✉️", arText: "ظَرْف", trText: "Zarf (mektup)", ornek: { ar: "كُنْتُ أَضَع الرِّسالة في الظَّرْف وأَلْصَق طابَعًا عَلَيْها.", tr: "Mektubu zarfa koyardım ve üzerine pul yapıştırırdım." } } }, cogul: "ظُروف", cogulTr: "Zarflar" },
    "Eşya: Sim Kart": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "📱", arText: "شَريحة", trText: "SIM kart" } }, cogul: "شَرائِح", cogulTr: "SIM kartlar" },
    "Eşya: Mikrofon": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🎤", arText: "ميكْروفون", trText: "Mikrofon", ornek: { ar: "أَتَكَلَّم مع الآخَرين بِواسِطة المِيكْروفون.", tr: "Başkalarıyla mikrofon aracılığıyla konuşurum." } } } },
    "Eşya: İnternet": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🌐", arText: "إنْتْرَنَت", trText: "İnternet", ornek: { ar: "أَتَراسَل مع الأَصْدِقاء بِواسِطة شَبَكة الإِنْتَرْنَت.", tr: "Arkadaşlarla internet ağı aracılığıyla yazışırım." } } } },
    "Eşya: Sofra": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "🍽️", arText: "مائِدة", trText: "Sofra", ornek: { ar: "يَنْتَظِرُ أَحْمَد وَقْت الإفْطار في المائِدة.", tr: "Ahmet sofrada iftar vaktini bekliyor." } } }, cogul: "مَوائِد", cogulTr: "Sofralar" },
    "Mekân: Dükkân": { isDictOnly: true, tip: "mekan", tekil: { base: { emoji: "🏪", arText: "دُكّان", trText: "Dükkân" } }, cogul: "دَكاكين", cogulTr: "Dükkânlar" },
    "Mekân: Kilise": { isDictOnly: true, tip: "mekan", tekil: { base: { emoji: "⛪", arText: "كَنيسة", trText: "Kilise" } }, cogul: "كَنائِس", cogulTr: "Kiliseler" },
    "Mekân: Kule": { isDictOnly: true, tip: "mekan", tekil: { base: { emoji: "🗼", arText: "بُرْج", trText: "Kule", ornek: { ar: "ونَزور بُرْج الفَتاة، ومَسْجِد فاتِح ونُصَلّي فيه يَوْم الجُمُعة.", tr: "Kız Kulesi'ni ve Fatih Camii'ni ziyaret ederiz, cuma günü orada namaz kılarız." } } }, cogul: "أَبْراج", cogulTr: "Kuleler" },
    "Mekân: Sümela": { isDictOnly: true, tip: "mekan", tekil: { base: { emoji: "🏔️", arText: "سومَلا", trText: "Sümela", ornek: { ar: "سومَلا في طِرابْزون.", tr: "Sümela Trabzon'dadır." } } } },
    "Doğa: Sis": { isDictOnly: true, tip: "doga", tekil: { base: { emoji: "🌫️", arText: "ضَباب", trText: "Sis", ornek: { ar: "سَيَكون الجَوّ ضَبابِيًّا غَدًا.", tr: "Yarın hava sisli olacak." } } } },
    "Zaman: Şevval": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "🌙", arText: "شَوّال", trText: "Şevval (hicrî ay)", ornek: { ar: "عيد الفِطْر في شَهْر شَوّال.", tr: "Ramazan Bayramı Şevval ayındadır." } } } },
    "Zaman: Bazen": { isDictOnly: true, tip: "zaman", tekil: { base: { emoji: "⏱️", arText: "أَحْيانًا", trText: "Bazen", ornek: { ar: "الإِنْتَرْنَت سَريع عِنْدَنا، ولكن يَنْقَطع أَحْيانًا.", tr: "Bizde internet hızlı, ama bazen kesiliyor." } } } },
    "Okul: Satır": { isDictOnly: true, tip: "okul", tekil: { base: { emoji: "📝", arText: "سَطْر", trText: "Satır, dize", ornek: { ar: "مُعَلِّمتي، مِن المُمْكِن أَنْ أَقْرَأ سَطْرًا مِن نَشيد الاسْتِقْلال", tr: "Öğretmenim, İstiklal Marşı'ndan bir dize okuyabilir miyim?" } } }, cogul: "سُطور", cogulTr: "Satırlar" },
    "Meslek: Kaptan": { isDictOnly: true, tip: "meslek", tekil: { base: { emoji: "⚓", arText: "قُبْطان", trText: "Kaptan", ornek: { ar: "ما مِهْنَتُكِ، ماشِطة أم قُبْطانة؟", tr: "Senin mesleğin ne, kuaför mü yoksa kaptan mı?" } } } },
    "Meslek: Asker": { isDictOnly: true, tip: "meslek", tekil: { base: { emoji: "🪖", arText: "جُنْد", trText: "Asker" } }, cogul: "جُنود", cogulTr: "Askerler" },
    "Şehir: Kapadokya": { isDictOnly: true, tip: "sehir", tekil: { base: { emoji: "🎈", arText: "كابادوكْيا", trText: "Kapadokya" } } },
    "Şehir: Efes": { isDictOnly: true, tip: "sehir", tekil: { base: { emoji: "🏛️", arText: "أَفَس", trText: "Efes", ornek: { ar: "أَفَس في إِزْمير.", tr: "Efes İzmir'dedir." } } } },
    "Zarf: Belki": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "🤔", arText: "رُبَّما", trText: "Belki", ornek: { ar: "رُبَّما أنا سَأُصْبِح رَبّة البَيْت وسَأَعْمَل في بَيْتي.", tr: "Belki ben ev hanımı olacağım ve evimde çalışacağım." } } } },
    "Zarf: Önce": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "1️⃣", arText: "أَوَّلًا", trText: "Önce, ilk olarak", ornek: { ar: "أَوَّلًا نَرْسُم السَّماء، ثُمّ الشَّمْس.", tr: "Önce gökyüzünü, sonra güneşi çizeriz." } } } },
    "Zarf: Hemen": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "⚡", arText: "فَوْرًا", trText: "Hemen", ornek: { ar: "أكْتُبُ قائِمة اللَّوازِم فَوْرًا.", tr: "Malzeme listesini hemen yazıyorum." } } } },
    "Zarf: Birlikte": { isDictOnly: true, tip: "zarf", tekil: { base: { emoji: "🤝", arText: "مَعًا", trText: "Birlikte", ornek: { ar: "هل نَلْعَب مَعًا؟", tr: "Birlikte oynayalım mı?" } } } },
    "Kalıp: Elbette": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "✅", arText: "طَبْعًا", trText: "Elbette, tabii ki", ornek: { ar: "طَبْعًا يا حُسَيْن! تَفَضَّلْ!", tr: "Tabii ki Hüseyin! Buyur!" } } } },
    "Kalıp: Aracılığıyla": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "🔗", arText: "بِواسِطة", trText: "Aracılığıyla, ile", ornek: { ar: "أَنْقُر المَلَفّات بِواسِطة الفَأْرة.", tr: "Dosyalara fare ile tıklarım." } } } },
    "Kalıp: Hızlıca": { isDictOnly: true, tip: "kalip", tekil: { base: { emoji: "💨", arText: "بِسُرْعة", trText: "Hızlıca", ornek: { ar: "أُريدُ أَنْ أُرْسِل رِسالة قَصيرة إلى أَصْدِقائي وأَتَجَوَّل في إنْتْرَنَت بِسُرْعة.", tr: "Arkadaşlarıma kısa mesaj göndermek ve internette hızlıca gezinmek istiyorum." } } } },
    "Bağlaç: Bu Yüzden": { isDictOnly: true, tip: "baglac", tekil: { base: { emoji: "➡️", arText: "لِذَلِك", trText: "Bu yüzden", ornek: { ar: "اليَوْم عيد الفِطر لِذَلِك نَزور أَقارِبَنا.", tr: "Bugün Ramazan Bayramı, bu yüzden akrabalarımızı ziyaret ederiz." } } } },
    /* <<< 7. sınıf Mektep câmid maddeleri */

    /* >>> 7. sınıf Mektep kitabından eklenen kelimeler — rubâî/yabancı kök (23.09.2026) */
    "Meslek: Eczacı": { isDictOnly: true, tip: "meslek", tekil: { base: { emoji: "💊", arText: "صَيْدَلانِيّ", trText: "Eczacı" } }, cogul: "صَيادِلة", cogulTr: "Eczacılar" },
    "Meslek: Veteriner": { isDictOnly: true, tip: "meslek", tekil: { base: { emoji: "🐾", arText: "بَيْطَرِيّ", trText: "Veteriner" } }, cogul: "بَياطِرة", cogulTr: "Veterinerler" },
    "Meslek: Kimyager": { isDictOnly: true, tip: "meslek", tekil: { base: { emoji: "🧪", arText: "كيميائِيّ", trText: "Kimyager" } }, cogul: "كيميائِيّون", cogulTr: "Kimyagerler" },
    "Okul: Kırtasiye": { isDictOnly: true, tip: "okul", tekil: { base: { emoji: "✏️", arText: "قِرْطاسِيّة", trText: "Kırtasiye (malzemeleri)" } } },
    "İsim: Sohbet": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "💬", arText: "دَرْدَشة", trText: "Sohbet, yazışma (chat)", ornek: { ar: "أَتَدَرْدَش مع أَصْدِقائي بِواسِطة الجَوّال.", tr: "Arkadaşlarımla telefon aracılığıyla yazışırım." } } } },
    /* <<< 7. sınıf Mektep ek maddeleri */

    /* >>> Sınırda maddeler — sözlükleşmiş sayılanlar (23.09.2026) */
    "Eşya: Pul": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "📮", arText: "طابَع", trText: "Pul (posta)", ornek: { ar: "أَلْصَقْتُ طابَعًا عَلى الظَّرْفِ", tr: "Zarfa bir pul yapıştırdım." } } }, cogul: "طَوابِع", cogulTr: "Pullar" },
    "Eşya: Telgraf": { isDictOnly: true, tip: "esya", tekil: { base: { emoji: "📡", arText: "بَرْقِيّة", trText: "Telgraf" } }, cogul: "بَرْقِيّات", cogulTr: "Telgraflar" },
    "Yiyecek: Un": { isDictOnly: true, tip: "yiyecek", tekil: { base: { emoji: "🌾", arText: "طَحين", trText: "Un" } } },
    "Okul: Dosya": { isDictOnly: true, tip: "okul", tekil: { base: { emoji: "🗂️", arText: "مَلَفّ", trText: "Dosya", ornek: { ar: "أَنْقُرُ المَلَفّاتِ بِواسِطةِ الفَأْرةِ", tr: "Dosyalara fare ile tıklıyorum." } } }, cogul: "مَلَفّات", cogulTr: "Dosyalar" },
    "Okul: Ders (Madde)": { isDictOnly: true, tip: "okul", tekil: { base: { emoji: "📚", arText: "مادّة", trText: "Ders, madde" } }, cogul: "مَوادّ", cogulTr: "Dersler, maddeler" },
    "İsim: Son": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🔚", arText: "نِهايَة", trText: "Son, bitiş", ornek: { ar: "في نِهايةِ الأُسْبوعِ نَزورُ جَدّي", tr: "Hafta sonunda dedemi ziyaret ederiz." } } } },
    "İsim: Örnek Şahsiyet": { isDictOnly: true, tip: "isim", tekil: { base: { emoji: "🌟", arText: "قُدْوة", trText: "Örnek alınan kişi, rol model", ornek: { ar: "الرَّسولُ ﷺ قُدْوةٌ لَنا", tr: "Peygamberimiz ﷺ bizim için örnektir." } } } },
    /* <<< Sınırda maddeler */
};

// Kökler dosyasındaki eski sözlük verilerini yeni sözlük verileriyle birleştir
if (typeof wordEasterEggs !== 'undefined') {
    Object.assign(sozlukVerileri, wordEasterEggs);
}
