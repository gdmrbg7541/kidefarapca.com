// Tamamen Arapça harflerden oluşan temiz veritabanı
const RED_CARDS = [
    { root: "حـ ـكـ ـم", num: "17", pattern: "فَعَل", hint: "👉🏼 Maçı yönetir:", ar: "حَكَم", tr: "Hakem" },
    { root: "نـ ـقـ ـل", num: "36", pattern: "مَفْعُول", hint: "👉🏼 Taşınabilir, nakledilebilir:", ar: "مَنْقُول", tr: "Menkûl" },
    { root: "عـ ـمـ ـل", num: "55", pattern: "إِفْعَال", hint: "👉🏼 Üretmek:", ar: "إِعْمَال", tr: "İ’mâl etmek" },
    { root: "حـ ـفـ ـظ", num: "67", pattern: "مُفَاعَلَة", hint: "👉🏼 Korumak:", ar: "مُحَافَظَة", tr: "Muhafaza etmek" },
    { root: "عـ ـر ـف", num: "21", pattern: "فُعْل", hint: "👉🏼 Gelenek-görenek:", ar: "عُرْف", tr: "Örf" },
    { root: "حـ ـفـ ـظـ + ـة", num: "33", pattern: "فَاعِلَة", hint: "👉🏼 Anılarımızın saklandığı yer:", ar: "حَافِظَة", tr: "Hâfıza" },
    { root: "ر ـحـ ـم", num: "103", pattern: "اِسْتِفْعَال", hint: "👉🏼 Rica etmek:", ar: "اِسْتِرْحَام", tr: "İstirham etmek" },
    { root: "لـ ـفـ ـت", num: "80", pattern: "اِفْتِعَال", hint: "👉🏼 Övmek:", ar: "اِلْتِفَات", tr: "İltifat" },
    { root: "حـ ـر ـب", num: "67", pattern: "مُفَاعَلَة", hint: "👉🏼 Savaş:", ar: "مُحَارَبَة", tr: "Muharebe" },
    { root: "ر ـحـ ـم", num: "28", pattern: "فَعْلَان", hint: "👉🏼 Merhamet sahibi:", ar: "رَحْمَان", tr: "Rahmân" },
    { root: "لـ ـطـ ـف", num: "35", pattern: "فَعِيل", hint: "👉🏼 Bir isim, nazik, yumuşak huylu:", ar: "لَطِيف", tr: "Latîf" },
    { root: "حـ ـكـ ـم", num: "21", pattern: "فُعْل", hint: "👉🏼 Yargılamak, karar vermek:", ar: "حُكْم", tr: "Hüküm" },
    { root: "عـ ـر ـف", num: "33", pattern: "فَاعِل", hint: "👉🏼 Bir erkek ismi:", ar: "عَارِف", tr: "Ârif" },
    { root: "نـ ـظـ ـر + ـة", num: "38", pattern: "مَفْعَلَة", hint: "👉🏼 Seyir yeri:", ar: "مَنْظَرَة", tr: "Manzara" },
    { root: "فـ ـطـ ـر", num: "55", pattern: "إِفْعَال", hint: "👉🏼 Ramazanda orucu açma:", ar: "إِفْطَار", tr: "İftâr" },
    { root: "حـ ـفـ ـظ", num: "69", pattern: "مُفَاعِل", hint: "👉🏼 Koruyan:", ar: "مُحَافِظ", tr: "Muhâfız" },
    { root: "عـ ـر ـض", num: "80", pattern: "اِفْتِعَال", hint: "👉🏼 Karşı çıkmak:", ar: "اِعْتِرَاض", tr: "İ’tirâz" },
    { root: "حـ ـكـ ـم", num: "35", pattern: "فَعِيل", hint: "👉🏼 Doktor:", ar: "حَكِيم", tr: "Hekîm" },
    { root: "لـ ـطـ ـفـ + ـًا", num: "21", pattern: "فُعْلًا", hint: "👉🏼 Rica etmek:", ar: "لُطْفًا", tr: "Lütfen" },
    { root: "حـ ـكـ ـم", num: "36", pattern: "مَفْعُول", hint: "👉🏼 Hüküm giyen kişi:", ar: "مَحْكُوم", tr: "Mahkûm" },
    { root: "عـ ـر ـف", num: "61", pattern: "تَفْعِيل", hint: "👉🏼 Tanıtma, açıklama yapma:", ar: "تَعْرِيف", tr: "Ta’rîf" },
    { root: "نـ ـظـ ـر", num: "67", pattern: "مُفَاعَلَة", hint: "👉🏼 Farklı görüşleri tartışma:", ar: "مُنَاظَرَة", tr: "Münâzara" },
    { root: "عـ ـر ـفـ + ـة", num: "37", pattern: "مَفْعِلَة", hint: "👉🏼 Tanımak, yetenek:", ar: "مَعْرِفَة", tr: "Ma’rifet" },
    { root: "قـ ـبـ ـل", num: "103", pattern: "اِسْتِفْعَال", hint: "👉🏼 Gelecek:", ar: "اِسْتِقْبَال", tr: "İstikbâl" },
    { root: "ر ـحـ ـم", num: "36", pattern: "مَفْعُول", hint: "👉🏼 Rahmetli:", ar: "مَرْحُوم", tr: "Merhûm" },
    { root: "عـ ـر ـض", num: "36", pattern: "مَفْعُول", hint: "👉🏼 Bir olay ya da duruma uğramak:", ar: "مَعْرُوض", tr: "Ma’rûz" },
    { root: "عـ ـمـ ـل", num: "17", pattern: "فَعَل", hint: "👉🏼 Davranış:", ar: "عَمَل", tr: "‘Amel" },
    { root: "حـ ـكـ ـمـ + ـة", num: "38", pattern: "مَفْعَلَة", hint: "👉🏼 İnsanların yargılandığı yer:", ar: "مَحْكَمَة", tr: "Mahkeme" },
    { root: "ر ـحـ ـم", num: "35", pattern: "فَعِيل", hint: "👉🏼 Şefkat ve merhamet sahibi:", ar: "رَحِيم", tr: "Rahîm" },
    { root: "حـ ـر ـب", num: "61", pattern: "تَفْعِيل", hint: "👉🏼 Yıkım, imha:", ar: "تَحْرِيب", tr: "Tahrîb" },
    { root: "حـ ـكـ ـم", num: "33", pattern: "فَاعِل", hint: "👉🏼 Hüküm veren, yönetici:", ar: "حَاكِم", tr: "Hâkim" },
    { root: "ر ـحـ ـمـ + ـة", num: "19", pattern: "فَعْلَة", hint: "👉🏼 Merhamet, şefkat:", ar: "رَحْمَة", tr: "Rahmet" },
    { root: "عـ ـمـ ـل", num: "36", pattern: "مَفْعُول", hint: "👉🏼 Üretilen, işlenmiş:", ar: "مَعْمُول", tr: "Ma’mûl" },
    { root: "حـ ـكـ ـم", num: "41", pattern: "أَفْعَال", hint: "👉🏼 Hükümler, ……. Kesmek:", ar: "أَحْكَام", tr: "Ahkâm" },
    { root: "نـ ـظـ ـر", num: "17", pattern: "فَعَل", hint: "👉🏼 Bakış, anlayış:", ar: "نَظَر", tr: "Nazar" },
    { root: "حـ ـفـ ـظ", num: "33", pattern: "فَاعِل", hint: "👉🏼 Ezberleyen, koruyan:", ar: "حَافِظ", tr: "Hâfız" },
    { root: "قـ ـبـ ـل", num: "26", pattern: "فَعُول", hint: "👉🏼 Onamak:", ar: "قَبُول", tr: "Kabûl" }
];

const BLUE_CARDS = [
    { root: "عـ ـبـ ـر", num: "80", pattern: "اِفْتِعَال", hint: "👉🏼 Saygınlık, var sayma:", ar: "اِعْتِبَار", tr: "İ’tibâr" },
    { root: "حـ ـسـ ـن", num: "17", pattern: "فَعَل", hint: "👉🏼 Bir erkek ismi:", ar: "حَسَن", tr: "Hasan" },
    { root: "عـ ـبـ ـر", num: "61", pattern: "تَفْعِيل", hint: "👉🏼 İfade, yorumlamak:", ar: "تَعْبِير", tr: "Ta’bîr" },
    { root: "عـ ـظـ ـم", num: "63", pattern: "مُفَعَّل", hint: "👉🏼 Harika, yüce:", ar: "مُعَظَّم", tr: "Muazzam" },
    { root: "حـ ـسـ ـن", num: "49", pattern: "فُعَيْل", hint: "👉🏼 Bir erkek ismi:", ar: "حُسَيْن", tr: "Hüseyin" },
    { root: "و جـ ـد", num: "29", pattern: "فِعْلَان", hint: "👉🏼 Duyarlılık, niyet, algı:", ar: "وِجْدَان", tr: "Vicdan" },
    { root: "سـ ـلـ ـم", num: "32", pattern: "فَعْلَى", hint: "👉🏼 Bir kız ismi:", ar: "سَلْمَى", tr: "Selma" },
    { root: "عـ ـبـ ـر", num: "82", pattern: "مُفْتَعَل", hint: "👉🏼 İtibar edilen, saygın:", ar: "مُعْتَبَر", tr: "Mu’teber" },
    { root: "سـ ـكـ ـن", num: "61", pattern: "تَفْعِيل", hint: "👉🏼 Sakinleştirmek:", ar: "تَسْكِين", tr: "Teskîn etmek" },
    { root: "و  جـ ـد", num: "56", pattern: "مُفْعِل", hint: "👉🏼 İcat eden:", ar: "مُوجِد", tr: "Mûcit" },
    { root: "أ مـ ـر", num: "36", pattern: "مَفْعُول", hint: "👉🏼 Emredilen, görevli:", ar: "مَأْمُور", tr: "Me’mûr" },
    { root: "عـ ـمـ ـر", num: "55", pattern: "إِفْعَال", hint: "👉🏼 Yapı, onarma, bayındırlık:", ar: "إِعْمَار", tr: "İ’mâr" },
    { root: "حـ ـسـ ـن", num: "56", pattern: "مُفْعِل", hint: "👉🏼 Bir erkek ismi:", ar: "مُحْسِن", tr: "Muhsin" },
    { root: "قـ ـد رَ + ة", num: "21", pattern: "فُعْلَة", hint: "👉🏼 Güç, kuvvet, otorite:", ar: "قُدْرَة", tr: "Kudret" },
    { root: "و جـ ـد", num: "25", pattern: "فُعُول", hint: "👉🏼 Beden:", ar: "وُجُود", tr: "Vücut" },
    { root: "قـ ـد ر", num: "80", pattern: "اِفْتِعَال", hint: "👉🏼 Yönetim, egemenlik:", ar: "اِقْتِدَار", tr: "İktidâr" },
    { root: "عـ ـمـ ـر", num: "61", pattern: "تَفْعِيل", hint: "👉🏼 Onarmak:", ar: "تَعْمِير", tr: "Ta’mîr" },
    { root: "سـ ـلـ ـم", num: "61", pattern: "تَفْعِيل", hint: "👉🏼 Takdim etmek, boyun eğmek:", ar: "تَسْلِيم", tr: "Teslîm ..." },
    { root: "أ مـ ـر", num: "33", pattern: "فَاعِل", hint: "👉🏼 Emreden:", ar: "آمِر", tr: "Âmir" },
    { root: "قـ ـد ر", num: "81", pattern: "مُفْتَعِل", hint: "👉🏼 Gücü yeten:", ar: "مُقْتَدِر", tr: "Muktedir" },
    { root: "حـ ـسـ ـن", num: "50", pattern: "أَفْعَل", hint: "👉🏼 En güzel:", ar: "أَحْسَن", tr: "Ahsen" },
    { root: "سـ ـلـ ـم", num: "55", pattern: "إِفْعَال", hint: "👉🏼 Müslümanların inandığı inanç:", ar: "إِسْلَام", tr: "İslâm" },
    { root: "و جـ ـد", num: "55", pattern: "إِفْعَال", hint: "👉🏼 Keşfedilen, bulma:", ar: "إِيجَاد", tr: "Îcâd" },
    { root: "قـ ـد ر", num: "17", pattern: "فَعَل", hint: "👉🏼 Ölçü, alın yazısı:", ar: "قَدَر", tr: "Kader" },
    { root: "سـ ـكـ ـن", num: "38", pattern: "مَفْعَل", hint: "👉🏼 Yer, ikamet edilen yer:", ar: "مَسْكَن", tr: "Mesken" },
    { root: "سـ ـلـ ـم", num: "22", pattern: "فَعَال", hint: "👉🏼 Barış, esenlik:", ar: "سَلَام", tr: "Selâm" },
    { root: "سـ ـلـ ـم", num: "33", pattern: "فَاعِل", hint: "👉🏼 Bir erkek ismi, sağ ………:", ar: "سَالِم", tr: "Sâlim" },
    { root: "حـ ـسـ ـن", num: "51", pattern: "فُعْلَى", hint: "👉🏼 En güzel, bir kız ismi:", ar: "حُسْنَى", tr: "Hüsnâ" },
    { root: "سـ ـكـ ـنـ + ـة", num: "25", pattern: "فُعُولَة", hint: "👉🏼 Sakinlik, sessizlik:", ar: "سُكُونَة", tr: "Sukûnet" },
    { root: "حـ ـسـ ـن", num: "61", pattern: "تَفْعِيل", hint: "👉🏼 Bir erkek ismi:", ar: "تَحْسِين", tr: "Tahsin" },
    { root: "أ مـ ـر", num: "35", pattern: "فَعِيل", hint: "👉🏼 Bir erkek ismi:", ar: "أَمِير", tr: "Emîr" },
    { root: "حـ ـسـ ـن", num: "55", pattern: "إِفْعَال", hint: "👉🏼 Bir erkek ismi:", ar: "إِحْسَان", tr: "İhsân" },
    { root: "سـ ـلـ ـم", num: "35", pattern: "فَعِيل", hint: "👉🏼 Bir erkek ismi:", ar: "سَلِيم", tr: "Selîm" },
    { root: "قـ ـد ر", num: "61", pattern: "تَفْعِيل", hint: "👉🏼 Değerlendirmek, ... belgesi:", ar: "تَقْدِير", tr: "Takdîr" },
    { root: "سـ ـلـ ـم", num: "56", pattern: "مُفْعِل", hint: "👉🏼 İslam dinine inanan:", ar: "مُسْلِم", tr: "Müslim" },
    { root: "قـ ـد ر", num: "35", pattern: "فَعِيل", hint: "👉🏼 Gücü yeten, kuvvetli:", ar: "قَدِير", tr: "Kadîr" },
    { root: "سـ ـلـ ـم", num: "33", pattern: "فَاعِل", hint: "👉🏼 Sağlam, sağ ………….. :", ar: "سَالِم", tr: "Sâlim" }
];

const PURPLE_CARDS = [
    { root: "شـ ـكـ ـر", num: "91", pattern: "تَفَعُّل", hint: "👉🏼 Sağol, eyvallah:", ar: "تَشَكُّر", tr: "Teşekkür" },
    { root: "حـ ـمـ ـل", num: "80", pattern: "اِفْتِعَال", hint: "👉🏼 Olasılık:", ar: "اِحْتِمَال", tr: "İhtimâl" },
    { root: "كـ ـر ـم", num: "50", pattern: "أَفْعَل", hint: "👉🏼 Bir erkek ismi:", ar: "أَكْرَم", tr: "Ekrem" },
    { root: "ر ـشـ ـد", num: "35", pattern: "فَعِيل", hint: "👉🏼 Bir erkek ismi, erişkin:", ar: "رَشِيد", tr: "Reşit" },
    { root: "خـ ـبـ ـر + ات", num: "103", pattern: "اِسْتِفْعَالَات", hint: "👉🏼 İnceleme, sorgu, haber alma:", ar: "اِسْتِخْبَارَات", tr: "İstihbârât" },
    { root: "مـ ـلـ ـك", num: "41", pattern: "أَفْعَال", hint: "👉🏼 Evi kiralayan veya satan meslek:", ar: "أَمْلَاك", tr: "Emlâk" },
    { root: "حـ ـر ـم", num: "55", pattern: "إِفْعَال", hint: "👉🏼 Kabe’de giyilir:", ar: "إِحْرَام", tr: "İhrâm" },
    { root: "كـ ـر ـر", num: "91", pattern: "تَفَعُّل", hint: "👉🏼 Tarih ……den ibarettir :", ar: "تَكَرُّر", tr: "Tekerrür" },
    { root: "مـ ـلـ ـك", num: "17", pattern: "فَعَل", hint: "👉🏼 Bir kız ismi:", ar: "مَلَك", tr: "Melek" },
    { root: "ر ـجـ ـع", num: "80", pattern: "اِفْتِعَال", hint: "👉🏼 Gerici, reaksiyonizm:", ar: "اِرْتِجَاع", tr: "İrticâ’" },
    { root: "حـ ـمـ ـل", num: "34", pattern: "فَعَّال", hint: "👉🏼 Taşıyıcı:", ar: "حَمَّال", tr: "Hammal" },
    { root: "ر ـكـ ـب", num: "63", pattern: "مُفَعَّل", hint: "👉🏼 Bileşik, bir kalem türü:", ar: "مُرَكَّب", tr: "Mürekkep" },
    { root: "حـ ـر ـم", num: "38", pattern: "مَفْعَل", hint: "👉🏼 Yasak kısım, özel:", ar: "مَحْرَم", tr: "Mahrem" },
    { root: "شـ ـكـ ـر", num: "27", pattern: "فُعْلَان", hint: "👉🏼 Bir kız ismi, minnettarlık:", ar: "شُكْرَان", tr: "Şükrân" },
    { root: "كـ ـر ـم", num: "35", pattern: "فَعِيل", hint: "👉🏼 Cömert, bir erkek ismi:", ar: "كَرِيم", tr: "Kerîm" },
    { root: "مـ ـلـ ـك", num: "21", pattern: "فُعْل", hint: "👉🏼 Sahiplik, mal:", ar: "مُلْك", tr: "Mülk" },
    { root: "حـ ـر ـم", num: "82", pattern: "مُفْتَعَل", hint: "👉🏼 Saygın:", ar: "مُحْتَرَم", tr: "Muhterem" },
    { root: "شـ ـكـ ـر", num: "21", pattern: "فُعْل", hint: "👉🏼 Hamd, minnet:", ar: "شُكْر", tr: "Şükür" },
    { root: "مـ ـلـ ـك", num: "35", pattern: "فَعِيل", hint: "👉🏼 Bir erkek ismi, hakan, kral:", ar: "مَلِيك", tr: "Melîk" },
    { root: "حـ ـر ـم", num: "63", pattern: "مُفَعَّل", hint: "👉🏼 Hicri bir ayın ismi:", ar: "مُحَرَّم", tr: "Muharrem" },
    { root: "ر ـجـ ـح", num: "61", pattern: "تَفْعِيل", hint: "👉🏼 Seçmek, üstün tutmak:", ar: "تَرْجِيح", tr: "Tercîh" },
    { root: "ر ـشـ ـد", num: "33", pattern: "فَاعِل", hint: "👉🏼 Bir erkek ismi:", ar: "رَاشِد", tr: "Râşit" },
    { root: "مـ ـلـ ـك + ـة", num: "38", pattern: "مَفْعَلَة", hint: "👉🏼 Anavatan:", ar: "مَمْلَكَة", tr: "Memleket" },
    { root: "ر ـجـ ـع", num: "67", pattern: "مُفَاعَلَة", hint: "👉🏼 Başvurmak:", ar: "مُرَاجَعَة", tr: "Mürâca’at" },
    { root: "حـ ـر ـم + ـي", num: "22", pattern: "فَعَالِي", hint: "👉🏼 Gasp eden, talancı:", ar: "حَرَامِي", tr: "Harâmî" },
    { root: "كـ ـر ـم", num: "55", pattern: "إِفْعَال", hint: "👉🏼 Sunmak, ağırlamak:", ar: "إِكْرَام", tr: "İkrâm etmek" },
    { root: "حـ ـر ـم", num: "36", pattern: "مَفْعُول", hint: "👉🏼 Yoksun, yasaklanmış:", ar: "مَحْرُوم", tr: "Mahrûm" },
    { root: "ر ـشـ ـد", num: "22", pattern: "فَعَال", hint: "👉🏼 Bir erkek ismi:", ar: "رَشَاد", tr: "Reşât" },
    { root: "مـ ـلـ ـك", num: "36", pattern: "مَفْعُول", hint: "👉🏼 Mısır ve Suriyede hüküm sürmüş bir devlet:", ar: "مَمْلُوك", tr: "Memlük" },
    { root: "ر ـشـ ـد", num: "56", pattern: "مُفْعِل", hint: "👉🏼 Doğru yolu gösteren:", ar: "مُرْشِد", tr: "Mürşid" },
    { root: "حـ ـمـ ـل", num: "82", pattern: "مُفْتَعَل", hint: "👉🏼 Olası, mümkün:", ar: "مُحْتَمَل", tr: "Muhtemel" },
    { root: "ر ـكـ ـب", num: "38", pattern: "مَفْعَل", hint: "👉🏼 Binilen; sandal, eşek:", ar: "مَرْكَب", tr: "Merkeb" },
    { root: "ر ـجـ ـع", num: "37", pattern: "مَفْعِل", hint: "👉🏼 Başvuru yeri, yetkin makam:", ar: "مَرْجِع", tr: "Merci’" },
    { root: "ر ـشـ ـد", num: "55", pattern: "إِفْعَال", hint: "👉🏼 Aydınlatmak, rehberlik:", ar: "إِرْشَاد", tr: "İrşâd" },
    { root: "حـ ـر ـم", num: "80", pattern: "اِفْتِعَال", hint: "👉🏼 Saygı göstermek:", ar: "اِحْتِرَام", tr: "İhtirâm" }
];

// YEŞİL KARTLAR VERİTABANI
const GREEN_CARDS = [
    { root: "خـ ـبـ ـر", num: "69", pattern: "مُفَاعِل", hint: "👉🏼 Haberleşen:", ar: "مُخَابِر", tr: "Muhâbir" },
    { root: "نـ ـسـ ـب", num: "36", pattern: "مَفْعُول", hint: "👉🏼 ... ait, … ilişkin:", ar: "مَنْسُوب", tr: "Mensup" },
    { root: "حـ ـمـ ـد", num: "63", pattern: "مُفَعَّل", hint: "👉🏼 Övülmüş olan:", ar: "مُحَمَّد", tr: "Muhammed" },
    { root: "حـ ـقـ ـق", num: "25", pattern: "فُعُول", hint: "👉🏼 Hak kelimesinin çoğulu, bir fakülte ismi:", ar: "حُقُوق", tr: "Hukuk" },
    { root: "خـ ـر ـج + ات", num: "55", pattern: "إِفْعَالَات", hint: "👉🏼 Yurtdışına satış yapmak:", ar: "إِخْرَاجَات", tr: "İhrâcât" },
    { root: "خـ ـطـ ـب", num: "70", pattern: "مُفَاعَل", hint: "👉🏼 Alıcı, konuşulan kişi:", ar: "مُخَاطَب", tr: "Muhâtap" },
    { root: "سـ ـعـ ـد", num: "35", pattern: "فَعِيل", hint: "👉🏼 Bir erkek ismi:", ar: "سَعِيد", tr: "Sa’ît" },
    { root: "خـ ـلـ ـف", num: "67", pattern: "مُفَاعَلَة", hint: "👉🏼 Karşıtlık, düşünce ayrılığı:", ar: "مُخَالَفَة", tr: "Muhalefet" },
    { root: "حـ ـصـ ـل + ات", num: "61", pattern: "تَفْعِيلَات", hint: "👉🏼 Kazanç, gelir, hasılat:", ar: "تَحْصِيلَات", tr: "Tahsîlât" },
    { root: "خـ ـلـ ـف + ـة", num: "23", pattern: "فِعَالَة", hint: "👉🏼 Halifelik makamı, veraset:", ar: "خِلَافَة", tr: "Hilâfet" },
    { root: "خـ ـر ـج", num: "33", pattern: "فَاعِل", hint: "👉🏼 Dış, dışında:", ar: "خَارِج", tr: "Hâriç" },
    { root: "سـ ـعـ ـد", num: "67", pattern: "مُفَاعَلَة", hint: "👉🏼 Yardım etmek, izin vermek:", ar: "مُسَاعَدَة", tr: "Müsâ’ade etmek" },
    { root: "نـ ـسـ ـب + ـة", num: "20", pattern: "فِعْلَة", hint: "👉🏼 Oran, bağ, ilgi:", ar: "نِسْبَة", tr: "Nisbet" },
    { root: "حـ ـقـ ـق", num: "63", pattern: "مُفَعَّل", hint: "👉🏼 Kesinlikle:", ar: "مُحَقَّق", tr: "Muhakkak" },
    { root: "خـ ـبـ ـر", num: "55", pattern: "إِفْعَال", hint: "👉🏼 Haber vermek, bildirme, raporlamak:", ar: "إِخْبَار", tr: "İhbâr etmek" },
    { root: "سـ ـعـ ـد + ـة", num: "22", pattern: "فَعَالَة", hint: "👉🏼 Mutluluk:", ar: "سَعَادَة", tr: "Sa’âdet" },
    { root: "خـ ـلـ ـف", num: "80", pattern: "اِفْتِعَال", hint: "👉🏼 Farklılık, anlaşmazlık:", ar: "اِخْتِلَاف", tr: "İhtilâf" },
    { root: "حـ ـمـ ـد", num: "36", pattern: "مَفْعُول", hint: "👉🏼 Bir erkek ismi:", ar: "مَحْمُود", tr: "Mahmut" },
    { root: "خـ ـر ـج", num: "38", pattern: "مَفْعَل", hint: "👉🏼 Çıkış yeri:", ar: "مَخْرَج", tr: "Mahreç" },
    { root: "سـ ـعـ ـد", num: "24", pattern: "فُعَال", hint: "👉🏼 Bir isim:", ar: "سُعَاد", tr: "Su’ât" },
    { root: "نـ ـسـ ـب", num: "69", pattern: "مُفَاعِل", hint: "👉🏼 Uygun, elverişli:", ar: "مُنَاسِب", tr: "Münâsip" },
    { root: "حـ ـقـ ـق + ـة", num: "35", pattern: "فَعِيلَة", hint: "👉🏼 Gerçek, doğru:", ar: "حَقِيقَة", tr: "Hakikat" },
    { root: "حـ ـسـ ـب", num: "67", pattern: "مُفَاعَلَة", hint: "👉🏼 Saymanlık, hesaplaşma:", ar: "مُحَاسَبَة", tr: "Muhâsebe" },
    { root: "خـ ـر ـج", num: "55", pattern: "إِفْعَال", hint: "👉🏼 Çıkarma, sürgün:", ar: "إِخْرَاج", tr: "İhrâç" },
    { root: "خـ ـلـ ـف", num: "81", pattern: "مُفْتَعِل", hint: "👉🏼 Farklı, çeşitli:", ar: "مُخْتَلِف", tr: "Muhtelif" },
    { root: "حـ ـمـ ـد", num: "50", pattern: "أَفْعَل", hint: "👉🏼 Bir erkek ismi:", ar: "أَحْمَد", tr: "Ahmet" },
    { root: "خـ ـر ـج", num: "22", pattern: "فَعَال", hint: "👉🏼 Vergi, cizye:", ar: "خَرَاج", tr: "Haraç" },
    { root: "سـ ـعـ ـد", num: "69", pattern: "مُفَاعِل", hint: "👉🏼 Yardımcı, (uygun):", ar: "مُسَاعِد", tr: "Müsâ’id" },
    { root: "خـ ـلـ ـف + ـة", num: "35", pattern: "فَعِيلَة", hint: "👉🏼 Mü’minlerin Emiri:", ar: "خَلِيفَة", tr: "Halîfe" },
    { root: "سـ ـعـ ـد", num: "36", pattern: "مَفْعُول", hint: "👉🏼 Mutlu:", ar: "مَسْعُود", tr: "Mes’ûd" },
    { root: "خـ ـطـ ـب", num: "35", pattern: "فَعِيل", hint: "👉🏼 Konuşmacı:", ar: "خَطِيب", tr: "Hatîp" },
    { root: "نـ ـسـ ـب", num: "67", pattern: "مُفَاعَلَة", hint: "👉🏼 Uygunluk, ilişki:", ar: "مُنَاسَبَة", tr: "Münâsebet" },
    { root: "حـ ـمـ ـد", num: "35", pattern: "فَعِيل", hint: "👉🏼 Bir erkek ismi:", ar: "حَمِيد", tr: "Hamit" },
    { root: "خـ ـلـ ـف", num: "69", pattern: "مُفَاعِل", hint: "👉🏼 Karşı çıkan, uymayan:", ar: "مُخَالِف", tr: "Muhalif" }
];

let activeCards = [];
let currentCardIndex = 0;
let score1 = 0, score2 = 0;
let gameState = 0; 

// BLUR HAFIZASI
let blurStates = { num: false, pattern: false, hint: false };

/* GÖSTERİM SEÇENEKLERİ (ilk sayfadaki anahtarlar)
   Hangi ipucu alanı kartta ÇIKSIN? Blur'dan farkı: burada kapatılan
   alan hiç görünmez, oyun sırasında dokunarak da açılmaz. Üçü de açık
   gelir — eski davranış. Seçim tarayıcıda saklanır ki öğretmen her
   derste yeniden ayarlamasın. */
const GOSTERIM_ANAHTAR = 'kidefIkikiGosterim';
const GOSTERIM_ID = { pattern: 'display-pattern-name', num: 'display-pattern-num', hint: 'display-hint' };
/* Önizlemedeki karşılıkları: küçük kart oyun ekranındaki soru kartının
   birebir küçüğü, anahtarla aynı anda değişiyor. */
const GOSTERIM_ONZ = { pattern: 'onz-pattern', num: 'onz-num', hint: 'onz-hint' };
const GOSTERIM_ALAN = ['pattern', 'num', 'hint'];
let gosterim = { pattern: true, num: true, hint: true };

function gosterimAcikSayi() { return GOSTERIM_ALAN.filter(a => gosterim[a]).length; }
/* Bir alan KAPATILABİLİR Mİ? İki kural var:
     1) En az bir ipucu açık kalmalı — hepsi kapanırsa kartta kökten
        başka bir şey kalmaz, soru sorulamaz.
     2) VEZİN ile NUMARA aynı anda kapalı olamaz. İkisi de veznin
        kimliğini söyler; ikisi birden yokken elde yalnız kök kalıyor,
        soru cevaplanamaz hâle geliyordu. (Oyun içindeki "dokun-
        bulanıklaştır" da bu kuralı taşıyor: smartToggleBlur birini
        gizlerken öbürünü açıyor.)
   Kapatılamayan anahtar KİLİTLİ gösterilir. */
const GOSTERIM_ESI = { pattern: 'num', num: 'pattern' };
function gosterimKapanabilir(alan) {
    if (!gosterim[alan]) return true;                 /* zaten kapalı */
    if (gosterimAcikSayi() === 1) return false;       /* 1. kural */
    const es = GOSTERIM_ESI[alan];
    if (es && !gosterim[es]) return false;            /* 2. kural */
    return true;
}
function gosterimUyariMetni(alan) {
    const es = GOSTERIM_ESI[alan];
    return (es && gosterim[alan] && !gosterim[es] && gosterimAcikSayi() > 1)
        ? 'Vezin ile numaradan biri açık kalmalı'
        : 'En az bir ipucu açık kalmalı';
}
/* Anahtarlar YALNIZ ilk ekranda çevrilir: oyun başladıktan sonra karar
   değişmez (oyun içi bulanıklaştırma ayrı bir şey, o duruyor). */
function ilkEkranda() {
    const s = document.getElementById('screen-intro');
    return !!s && s.classList.contains('active');
}

function gosterimOku() {
    try {
        const k = JSON.parse(localStorage.getItem(GOSTERIM_ANAHTAR) || 'null');
        if (k && typeof k === 'object') {
            GOSTERIM_ALAN.forEach(a => { if (typeof k[a] === 'boolean') gosterim[a] = k[a]; });
        }
    } catch (e) { }
    /* Eski kayıtta vezin+numara birlikte (hatta üçü birden) kapalı
       kalmış olabilir — o hâl artık geçersizdi, kartta cevaplanabilir
       bir soru bırakmıyordu. Vezni geri açarak düzelt. */
    if (!gosterim.pattern && !gosterim.num) gosterim.pattern = true;
    if (!gosterimAcikSayi()) gosterim.pattern = true;
}
function gosterimYaz() {
    document.querySelectorAll('.setup-toggle').forEach(b => {
        const a = b.getAttribute('data-alan');
        const acik = !!gosterim[a];
        const kilit = acik && !gosterimKapanabilir(a);
        if (!b.dataset.baslik) b.dataset.baslik = b.getAttribute('title') || '';
        b.classList.toggle('kapali', !acik);
        b.classList.toggle('kilitli', kilit);
        b.setAttribute('aria-pressed', acik ? 'true' : 'false');
        b.setAttribute('aria-disabled', kilit ? 'true' : 'false');
        b.setAttribute('title', kilit ? gosterimUyariMetni(a) : b.dataset.baslik);
    });
    GOSTERIM_ALAN.forEach(a => {
        const e = document.getElementById(GOSTERIM_ONZ[a]);
        if (e) e.classList.toggle('onz-kapali', !gosterim[a]);
    });
    try { localStorage.setItem(GOSTERIM_ANAHTAR, JSON.stringify(gosterim)); } catch (e) { }
}
/* Kapatılamayan anahtar: sallanır, üstünde kısa bir uyarı belirir. */
function gosterimUyar(dugme, metin) {
    if (dugme) {
        dugme.classList.remove('sallan');
        void dugme.offsetWidth;               /* animasyon yeniden başlasın */
        dugme.classList.add('sallan');
    }
    const r = document.getElementById('setup-row');
    if (!r) return;
    const u = document.getElementById('setup-uyari');
    if (u && metin) u.textContent = metin;    /* hangi kural çiğnendiyse onu söyle */
    r.classList.add('uyari');
    clearTimeout(gosterimUyar._zaman);
    gosterimUyar._zaman = setTimeout(() => r.classList.remove('uyari'), 2400);
}
function gosterimCevir(alan) {
    if (!(alan in gosterim)) return;
    if (!ilkEkranda()) return;
    const dugme = document.querySelector('.setup-toggle[data-alan="' + alan + '"]');
    if (!gosterimKapanabilir(alan)) { gosterimUyar(dugme, gosterimUyariMetni(alan)); return; }
    gosterim[alan] = !gosterim[alan];
    gosterimYaz();
    /* Önizleme değiştiğini belli etsin — göz oraya gitsin */
    const k = document.getElementById('onz-kart');
    if (k) {
        k.classList.remove('onz-degisti');
        void k.offsetWidth;
        k.classList.add('onz-degisti');
        clearTimeout(gosterimCevir._zaman);
        gosterimCevir._zaman = setTimeout(() => k.classList.remove('onz-degisti'), 620);
    }
}
document.addEventListener('DOMContentLoaded', function () { gosterimOku(); gosterimYaz(); });

// Rastgele Karıştırma (Shuffle)
function shuffleArray(array) {
    let cur = array.length, rnd;
    while (cur !== 0) {
        rnd = Math.floor(Math.random() * cur);
        cur--;
        [array[cur], array[rnd]] = [array[rnd], array[cur]];
    }
    return array;
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    // Geri tuşu HER ekranda görünür kalsın (oyun sırasında da kaybolmasın)
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) homeBtn.style.display = 'flex';
}

function startGame(cat) {
    currentCardIndex = 0;
    
    // Tıklanan kategoriye göre desteyi belirle ve karıştır
    if (cat === 'Kırmızı Kartlar') {
        activeCards = shuffleArray([...RED_CARDS]);
    } else if (cat === 'Mavi Kartlar') {
        activeCards = shuffleArray([...BLUE_CARDS]);
    } else if (cat === 'Mor Kartlar') {
        activeCards = shuffleArray([...PURPLE_CARDS]);
    } else if (cat === 'Yeşil Kartlar') {
        if(GREEN_CARDS.length > 0) {
             activeCards = shuffleArray([...GREEN_CARDS]);
        } else {
             alert("Yeşil kartlar henüz eklenmedi!");
             return; // Boşsa başlatma
        }
    }

    document.getElementById('total-cards').innerText = activeCards.length;
    document.getElementById('active-category').innerText = cat.toUpperCase();
    updateDisplay();
    showScreen('screen-arena');
}

function updateDisplay() {
    const card = activeCards[currentCardIndex];
    const rootEl = document.getElementById('display-root');
    
    rootEl.innerText = card.root;
    document.getElementById('display-pattern-num').innerText = card.num;
    
    // --- YENİ EKLENEN KISIM: Zeki Renklendirme ---
    // Regex: ف, ع veya ل harfini ve peşinden gelen tüm Arapça harekeleri yakalar
    const formattedPattern = card.pattern.replace(/([فعل][\u064B-\u065F]*)/g, '<span style="color: var(--text-dark);">$1</span>');
    
    // innerText yerine innerHTML kullanıyoruz ki span HTML etiketleri çalışsın
    document.getElementById('display-pattern-name').innerHTML = formattedPattern;
    // ----------------------------------------------

    document.getElementById('display-hint').innerText = card.hint;
    document.getElementById('display-ar-answer').innerText = card.ar;
    document.getElementById('display-tr-answer').innerText = card.tr;
    document.getElementById('current-index').innerText = currentCardIndex + 1;
    
    // Mobil uyumlu taşma koruması (Sabit px yerine esnek clamp kullanılır)
    if (card.root.includes('+') || card.root.length > 13) {
        rootEl.style.fontSize = "clamp(40px, 12vmin, 130px)";
    } else {
        rootEl.style.fontSize = "clamp(60px, 17vmin, 250px)";
    }

    resetArenaVisuals();
}

function resetArenaVisuals() {
    gameState = 0;
    const btn = document.getElementById('btn-action-main');
    btn.innerText = "SORUYU GÖSTER";
    btn.style.display = 'block';

    const bar = document.getElementById('timer-bar');
    bar.style.transition = 'none'; bar.style.width = '0%';
    setTimeout(() => { bar.style.transition = 'width 1s linear'; }, 50);

    const els = ['display-root','display-pattern-num','display-pattern-name','display-hint','answer-container'];
    els.forEach(id => { 
        const el = document.getElementById(id);
        el.style.display = 'none'; 
        el.classList.remove('active');
    });

    applyMemoryBlurs();
}

// AKILLI BLUR MANTIĞI
function smartToggleBlur(type) {
    if (gameState !== 1) return;

    if (type === 'num') {
        if (blurStates.num) { 
            blurStates.num = false;
        } else { 
            if (blurStates.pattern) blurStates.pattern = false; 
            blurStates.num = true; 
        }
    } else if (type === 'pattern') {
        if (blurStates.pattern) {
            blurStates.pattern = false;
        } else {
            if (blurStates.num) blurStates.num = false; 
            blurStates.pattern = true; 
        }
    }
    applyMemoryBlurs();
}

function toggleHintBlur() {
    if (gameState !== 1) return;
    blurStates.hint = !blurStates.hint;
    applyMemoryBlurs();
}

function applyMemoryBlurs() {
    const n = document.getElementById('display-pattern-num');
    const p = document.getElementById('display-pattern-name');
    const h = document.getElementById('display-hint');

    blurStates.num ? n.classList.add('blurred') : n.classList.remove('blurred');
    blurStates.pattern ? p.classList.add('blurred') : p.classList.remove('blurred');
    blurStates.hint ? h.classList.add('blurred') : h.classList.remove('blurred');
}

function triggerAction() {
    const btn = document.getElementById('btn-action-main');

    if (gameState === 0) {
        btn.style.display = 'none';
        const rootEl = document.getElementById('display-root');
        rootEl.style.display = 'block';
        setTimeout(() => { rootEl.classList.add('active'); }, 50);
        setTimeout(() => { document.getElementById('timer-bar').style.width = '100%'; }, 100);

        setTimeout(() => {
            /* İlk sayfada kapatılan alan hiç açılmaz */
            const acilacak = Object.keys(GOSTERIM_ID).filter(a => gosterim[a]);
            acilacak.forEach(a => { document.getElementById(GOSTERIM_ID[a]).style.display = 'block'; });

            setTimeout(() => {
                acilacak.forEach(a => { document.getElementById(GOSTERIM_ID[a]).classList.add('active'); });
            }, 50);
            
            btn.innerText = "CEVABI GÖSTER"; btn.style.display = 'block';
            gameState = 1;
        }, 1100);

    } else if (gameState === 1) {
        document.getElementById('question-wrapper').style.display = 'none';
        const ans = document.getElementById('answer-container');
        ans.style.display = 'flex';
        setTimeout(() => {
            document.getElementById('display-ar-answer').classList.add('active');
            document.getElementById('display-tr-answer').classList.add('active');
        }, 50);
        btn.innerText = "SIRADAKİ KART";
        gameState = 2;

    } else if (gameState === 2) {
        document.getElementById('question-wrapper').style.display = 'flex';
        currentCardIndex = (currentCardIndex + 1) % activeCards.length;
        updateDisplay();
    }
}

/* Puan ekle / geri al.
   adim = 1  -> artı tuşu (varsayılan, eski çağrılar bozulmasın diye)
   adim = -1 -> eksi tuşu: yanlışlıkla verilen puanı geri alır.
   Puan hiçbir zaman sıfırın altına inmez. */
function addScore(p, adim) {
    if (adim === undefined) adim = 1;
    if (p === 1) score1 = Math.max(0, score1 + adim);
    else         score2 = Math.max(0, score2 + adim);
    yazPuanlar();
}

/* Skorları ekrana bas; eksi tuşunu geri alınacak puan yoksa kapat. */
function yazPuanlar() {
    document.getElementById('score-1').innerText = score1;
    document.getElementById('score-2').innerText = score2;
    var e1 = document.getElementById('minus-1');
    var e2 = document.getElementById('minus-2');
    if (e1) e1.disabled = (score1 === 0);
    if (e2) e2.disabled = (score2 === 0);
}

function resetScores() {
    score1 = 0; score2 = 0;
    yazPuanlar();
}

function exitArena() {
    resetScores();
    showScreen('screen-intro');
}

// KLAVYE VE SUNUM KUMANDASI (Sadece ileri yönde ilerler)
window.addEventListener('keydown', (e) => {
    const triggerKeys = [' ', 'Enter', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'PageDown', 'PageUp'];
    if(triggerKeys.includes(e.key)) {
        if(document.getElementById('screen-arena').classList.contains('active')) {
            e.preventDefault(); 
            triggerAction();
        }
    }
});