// *** Data (Temizlenmiş) ***
    
    const embeddedGameData = {
            "patterns": {
        "17": { "kalipNo": "17", "arapca": "فَعَلَ", "tur": "İsim/Sıfat", "bab": "Sülâsî İsim", "displayComponents": ["َ", "َ"], "steps": [] },
        "22": { "kalipNo": "22", "arapca": "فَعَال", "tur": "İsim/Sıfat", "bab": "Sülâsî İsim", "displayComponents": ["َ", "َ", "ا"], "steps": [] },
        "33": { "kalipNo": "33", "arapca": "فَاعِل", "tur": "İsm-i Fâil", "bab": "Sülâsî İsim", "displayComponents": ["َ", "ا", "ِ"], "steps": [] },
        "35": { "kalipNo": "35", "arapca": "فَعِيل", "tur": "Sıfat-ı Müş.", "bab": "Sülâsî İsim", "displayComponents": ["َ", "ِ", "ـيـ"], "steps": [] },
        "36": { "kalipNo": "36", "arapca": "مَفْعُول", "tur": "İsm-i Mef'ûl", "bab": "Sülâsî İsim", "displayComponents": ["مَـ", "ْ", "ُ", "و"], "steps": [] },
        "50": { "kalipNo": "50", "arapca": "أَفْعَل", "tur": "İsm-i Tafdîl/Sıfat", "bab": "Sülâsî İsim", "displayComponents": ["أَ", "ْ", "َ"], "steps": [] },
        "55": { "kalipNo": "55", "arapca": "إِفْعَال", "tur": "Masdar", "bab": "İf'âl", "displayComponents": ["إِ", "ْ", "َ", "ا"], "steps": [] },
        "56": { "kalipNo": "56", "arapca": "مُفْعِل", "tur": "İsm-i Fâil", "bab": "İf'âl", "displayComponents": ["مُـ", "ْ", "ِ"], "steps": [] },
        "61": { "kalipNo": "61", "arapca": "تَفْعِيل", "tur": "Masdar", "bab": "Tef'îl", "displayComponents": ["تَـ", "ْ", "ِ", "ـيـ"], "steps": [] },
        "67": { "kalipNo": "67", "arapca": "مُفَاعَلَة", "tur": "Masdar", "bab": "Mufâ'ale", "displayComponents": ["مُـ", "َ", "ا", "َ", "َة"], "steps": [] },
        "80": { "kalipNo": "80", "arapca": "اِفْتِعَال", "tur": "Masdar", "bab": "İfti'âl", "displayComponents": ["اِ", "ْ", "تِ", "َ", "ا"], "steps": [] },
        "103": { "kalipNo": "103", "arapca": "اِسْتِفْعَال", "tur": "Masdar", "bab": "İstif'âl", "displayComponents": ["اِسْتِـ", "ْ", "َ", "ا"], "steps": [] }
      },
       "roots": { /* Kök ve kelime verileri */ 
        "ح-ك-م": { "root": ["ح", "ك", "م"], "words": [ { "arapca": "حَاكِم", "turkce": "Hâkim 🧑‍⚖️", "kalipNo": "33" }, { "arapca": "حَكِيم", "turkce": "Hekîm 👨‍⚕️", "kalipNo": "35" }, { "arapca": "مَحْكُوم", "turkce": "Mahkum ⛓️", "kalipNo": "36" } ] },
        "ع-ر-ف": { "root": ["ع", "ر", "ف"], "words": [ { "arapca": "عِرْفَان", "turkce": "İrfân 💡", "kalipNo": "29" }, { "arapca": "عَارِف", "turkce": "Ârif 🧠", "kalipNo": "33" }, { "arapca": "تَعْرِيف", "turkce": "Tarif 📝", "kalipNo": "61" } ] },
        "ع-ل-م": { "root": ["ع", "ل", "م"], "words": [ { "arapca": "عَالِم", "turkce": "Âlim 🎓", "kalipNo": "33" }, { "arapca": "تَعْلِيم", "turkce": "Talim 🧑‍🏫", "kalipNo": "61" }, { "arapca": "مُعَلِّم", "turkce": "Muallim 👨‍🏫", "kalipNo": "62" } ] },
        "ر-ح-م": { "root": ["ر", "ح", "م"], "words": [ { "arapca": "رَحِيم", "turkce": "Rahîm 💖", "kalipNo": "35" }, { "arapca": "رَحْمَان", "turkce": "Rahmân 💗", "kalipNo": "28" }, { "arapca": "مَرْحُوم", "turkce": "Merhum 🪦", "kalipNo": "36" }, { "arapca": "اِسْتِرْحَام", "turkce": "İstirham 🙏", "kalipNo": "103" } ] },
        "ح-ف-ظ": { "root": ["ح", "ف", "ظ"], "words": [ { "arapca": "حَافِظ", "turkce": "Hâfız 📖", "kalipNo": "33" }, { "arapca": "مُحَافَظَة", "turkce": "Muhafaza 🛡️", "kalipNo": "67" }, { "arapca": "مُحَافِظ", "turkce": "Muhafız 💂", "kalipNo": "69" } ] },
        "ك-ت-ب": { "root": ["ك", "ت", "ب"], "words": [ { "arapca": "كِتَاب", "turkce": "Kitâp 📚", "kalipNo": "23" }, { "arapca": "مَكْتُوب", "turkce": "Mektup ✉️", "kalipNo": "36" }, { "arapca": "كَاتِب", "turkce": "Kâtip ✍️", "kalipNo": "33" }, { "arapca": "مَكْتَب", "turkce": "Mektep 🏫", "kalipNo": "38" } ] },
        "ن-ظ-ر": { "root": ["ن", "ظ", "ر"], "words": [ { "arapca": "نَظَر", "turkce": "Nazar 👀", "kalipNo": "17" }, { "arapca": "مُنَاظَرَة", "turkce": "Münazara 🗣️", "kalipNo": "67" }, { "arapca": "اِنْتِظَار", "turkce": "İntizar ⏳", "kalipNo": "80" } ] },
        "م-ك-ن": { "root": ["م", "ك", "ن"], "words": [ { "arapca": "إِمْكَان", "turkce": "İmkân ✨", "kalipNo": "55" }, { "arapca": "مُمْكِن", "turkce": "Mümkün ✅", "kalipNo": "56" }, { "arapca": "تَمْكِين", "turkce": "Temkin 🧐", "kalipNo": "61" } ] },
        "ح-س-ن": { "root": ["ح", "س", "ن"], "words": [ { "arapca": "حَسَن", "turkce": "Hasan 😊", "kalipNo": "17" }, { "arapca": "حُسَيْن", "turkce": "Hüseyin 🧒", "kalipNo": "49" }, { "arapca": "أَحْسَن", "turkce": "Ahsen 🌟", "kalipNo": "30" }, { "arapca": "حُسْنَى", "turkce": "Hüsna 🌸", "kalipNo": "51" }, { "arapca": "إِحْسَان", "turkce": "İhsan ❤️", "kalipNo": "55" }, { "arapca": "مُحْسِن", "turkce": "Muhsin 🥰", "kalipNo": "56" }, { "arapca": "تَحْسِين", "turkce": "Tahsin 👍", "kalipNo": "61" } ] },
        "س-ع-د": { "root": ["س", "ع", "د"], "words": [ { "arapca": "سَعَادَة", "turkce": "Saâdet 🥳", "kalipNo": "22" }, { "arapca": "سُعَاد", "turkce": "Suâd 😌", "kalipNo": "24" }, { "arapca": "سَعِيد", "turkce": "Saîd 😀", "kalipNo": "35" }, { "arapca": "مَسْعُود", "turkce": "Mesud 😁", "kalipNo": "36" } ] },
        "ج-ه-ل": { "root": ["ج", "ه", "ل"], "words": [ { "arapca": "جَاهِل", "turkce": "Câhil 🤷", "kalipNo": "33" }, { "arapca": "مَجْهُول", "turkce": "Meçhul ❓", "kalipNo": "36" }, { "arapca": "جُهَلَاء", "turkce": "Cühela 👥", "kalipNo": "46" } ] },
        "و-ج-د": { "root": ["و", "ج", "د"], "words": [ { "arapca": "وُجُود", "turkce": "Vücut 🧘", "kalipNo": "25" }, { "arapca": "وِجْدَان", "turkce": "Vicdan 💖", "kalipNo": "29" }, { "arapca": "مَوْجُود", "turkce": "Mevcut 📍", "kalipNo": "36" }, { "arapca": "إِيجَاد", "turkce": "İcât 💡", "kalipNo": "55" }, { "arapca": "مُوجِد", "turkce": "Mucit 👨‍🔬", "kalipNo": "56" } ] },
        "س-ك-ن": { "root": ["س", "ك", "ن"], "words": [ { "arapca": "سَاكِن", "turkce": "Sâkin 🏠", "kalipNo": "33" }, { "arapca": "مَسْكُون", "turkce": "Meskûn 🏘️", "kalipNo": "36" }, { "arapca": "مَسْكَن", "turkce": "Mesken 🏡", "kalipNo": "38" }, { "arapca": "إِسْكَان", "turkce": "İskân 🏗️", "kalipNo": "55" }, { "arapca": "تَسْكِين", "turkce": "Teskin 😌", "kalipNo": "61" } ] },
        "ج-ه-د": { "root": ["ج", "ه", "د"], "words": [ { "arapca": "جَاهِد", "turkce": "Câhit 💪", "kalipNo": "33" }, { "arapca": "جِهَاد", "turkce": "Cihât ⚔️", "kalipNo": "68" }, { "arapca": "مُجَاهِد", "turkce": "Mücâhit 🛡️", "kalipNo": "69" }, { "arapca": "اِجْتِهَاد", "turkce": "İçtihât ⚖️", "kalipNo": "80" }, { "arapca": "مُجْتَهِد", "turkce": "Müçtehid 👨‍⚖️", "kalipNo": "81" } ] },
        "س-ل-م": { "root": ["س", "ل", "م"], "words": [ { "arapca": "سَلَام", "turkce": "Selâm 🕊️", "kalipNo": "22" }, { "arapca": "سَالِم", "turkce": "Sâlim ✅", "kalipNo": "33" }, { "arapca": "سَلِيم", "turkce": "Selîm 😊", "kalipNo": "35" }, { "arapca": "إِسْلَام", "turkce": "İslam ☪️", "kalipNo": "55" }, { "arapca": "مُسْلِم", "turkce": "Müslim 🕌", "kalipNo": "56" }, { "arapca": "تَسْلِيم", "turkce": "Teslim 🤝", "kalipNo": "61" } ] },
        "ق-ر-ب": { "root": ["ق", "ر", "ب"], "words": [ { "arapca": "قُرْبَان", "turkce": "Kurban 🐑", "kalipNo": "27" }, { "arapca": "تَقْرِيبًا", "turkce": "Takriben 📐", "kalipNo": "61" } ] },
        "ن-ظ-م": { "root": ["ن", "ظ", "م"], "words": [ { "arapca": "نَظْم", "turkce": "Nazım 📜", "kalipNo": "19" }, { "arapca": "نِظَام", "turkce": "Nizam ⚖️", "kalipNo": "23" }, { "arapca": "نَاظِم", "turkce": "Nâzım ✍️", "kalipNo": "33" }, { "arapca": "مَنْظُوم", "turkce": "Manzum 🎶", "kalipNo": "36" }, { "arapca": "تَنْظِيم", "turkce": "Tanzim 🗂️", "kalipNo": "61" }, { "arapca": "اِنْتِظَام", "turkce": "İntizam 📏", "kalipNo": "80" }, { "arapca": "مُنْتَظَمًا", "turkce": "Muntazam ✨", "kalipNo": "82" } ] },
        "د-خ-ل": { "root": ["د", "خ", "ل"], "words": [ { "arapca": "دَاخِل", "turkce": "Dâhil ➡️", "kalipNo": "33" }, { "arapca": "إِدْخَال", "turkce": "İthâl 📥", "kalipNo": "55" }, { "arapca": "مُدَاخَلَة", "turkce": "Müdahale ✋", "kalipNo": "67" } ] },
        "ر-ك-ب": { "root": ["ر", "ك", "ب"], "words": [ { "arapca": "مَرْكَب", "turkce": "Merkeb 🐴", "kalipNo": "38" }, { "arapca": "تَرْكِيب", "turkce": "Terkib 🧪", "kalipNo": "61" }, { "arapca": "مُرَكَّب", "turkce": "Mürekkeb ✒️", "kalipNo": "63" } ] },
        "ط-ب-ق": { "root": ["ط", "ب", "ق"], "words": [ { "arapca": "طَبَقَة", "turkce": "Tabaka 層", "kalipNo": "17" }, { "arapca": "تَطْبِيقَات", "turkce": "Tatbikat 🏋️", "kalipNo": "61" }, { "arapca": "مُطَابَقَات", "turkce": "Mutabakat 🤝", "kalipNo": "67" }, { "arapca": "مُطَابِق", "turkce": "Mutabık ✅", "kalipNo": "69" } ] },
        "ن-ق-ل": { "root": ["ن", "ق", "ل"], "words": [ { "arapca": "نَقْلِيَّة", "turkce": "Nakliye 🚚", "kalipNo": "19" }, { "arapca": "نَقِيل", "turkce": "Nakîl 🔄", "kalipNo": "35" }, { "arapca": "مَنْقُول", "turkce": "Menkul 🚗", "kalipNo": "36" }, { "arapca": "اِنْتِقَال", "turkce": "İntikal ↪️", "kalipNo": "80" } ] },
        "ش-ر-ب": { "root": ["ش", "ر", "ب"], "words": [ { "arapca": "شَرْبَة", "turkce": "Şerbet 🍹", "kalipNo": "19" }, { "arapca": "شَرَاب", "turkce": "Şarâp 🍷", "kalipNo": "22" }, { "arapca": "شُرُوب", "turkce": "Şurub 🍾", "kalipNo": "25" }, { "arapca": "مَشْرُوبَات", "turkce": "Meşrubat 🥤", "kalipNo": "36" }, { "arapca": "مَشْرَب", "turkce": "Meşreb 🌿", "kalipNo": "38" } ] },
        "ر-ج-ع": { "root": ["ر", "ج", "ع"], "words": [ { "arapca": "مَرْجِع", "turkce": "Merci ↩️", "kalipNo": "37" }, { "arapca": "مُرَاجَعَة", "turkce": "Müracaat 📝", "kalipNo": "67" }, { "arapca": "اِرْتِجَاع", "turkce": "İrtica 🔙", "kalipNo": "80" } ] },
        "ش-ك-ل": { "root": ["ش", "ك", "ل"], "words": [ { "arapca": "شَكْل", "turkce": "Şekil 🧩", "kalipNo": "19" }, { "arapca": "أَشْكَال", "turkce": "Eşkâl 🔶", "kalipNo": "41" }, { "arapca": "مُشْكِل", "turkce": "Müşkil 🤔", "kalipNo": "56" }, { "arapca": "تَشْكِيلات", "turkce": "Teşkilat 👥", "kalipNo": "61" } ] },
        "ن-س-ب": { "root": ["ن", "س", "ب"], "words": [ { "arapca": "نَسَب", "turkce": "Neseb 👨‍👩‍👧‍👦", "kalipNo": "17" }, { "arapca": "نِسْبَة", "turkce": "Nisbet 📊", "kalipNo": "20" }, { "arapca": "مَنْسُوب", "turkce": "Mensub 🔗", "kalipNo": "36" }, { "arapca": "مُنَاسَبَة", "turkce": "Münasebet 🎉", "kalipNo": "67" }, { "arapca": "اِنْتِسَاب", "turkce": "İntisab 🖇️", "kalipNo": "80" } ] },
      "ش-ه-د": { "root": ["ش", "ه", "د"], "words": [ { "arapca": "شَهَادَة", "turkce": "Şehâdet 📜", "kalipNo": "22" }, { "arapca": "شَاهِد", "turkce": "Şâhit 👀", "kalipNo": "33" }, { "arapca": "شَهِيد", "turkce": "Şehît 🌺", "kalipNo": "35" }, { "arapca": "شُهَدَاء", "turkce": "Şühedâ 🌷", "kalipNo": "46" }, { "arapca": "مُشَاهَدَة", "turkce": "Müşahede 🔬", "kalipNo": "67" } ] },
        "ب-ر-ك": { "root": ["ب", "ر", "ك"], "words": [ { "arapca": "بَرَكَة", "turkce": "Bereket 🌾", "kalipNo": "17" }, { "arapca": "تَبْرِيك", "turkce": "Tebrik 🎉", "kalipNo": "61" }, { "arapca": "مُبَارَك", "turkce": "Mübarek ✨", "kalipNo": "70" }, { "arapca": "تَبَرُّك", "turkce": "Teberrük 🙏", "kalipNo": "91" } ] },
        "ق-د-ر": { "root": ["ق", "د", "ر"], "words": [ { "arapca": "مِقْدَار", "turkce": "Miktâr 📏", "kalipNo": "40" }, { "arapca": "قَدَر", "turkce": "Kader 🌌", "kalipNo": "17" }, { "arapca": "تَقْدِير", "turkce": "Takdir 👍", "kalipNo": "61" }, { "arapca": "مُقَدَّرَات", "turkce": "Mukadderat 🌠", "kalipNo": "63" }, { "arapca": "قُدْرَة", "turkce": "Kudret 💪", "kalipNo": "21" }, { "arapca": "اِقْتِدَار", "turkce": "İktidar 🏛️", "kalipNo": "80" }, { "arapca": "قَادِر", "turkce": "Kâdir ⚡", "kalipNo": "33" }, { "arapca": "مُقْتَدِر", "turkce": "Muktedir 🌟", "kalipNo": "81" }, { "arapca": "قَدِير", "turkce": "Kadîr ✨", "kalipNo": "35" } ] },
        "م-ل-ك": { "root": ["م", "ل", "ك"], "words": [ { "arapca": "مَلَك", "turkce": "Melek 😇", "kalipNo": "17" }, { "arapca": "مُلْك", "turkce": "Mülk 👑", "kalipNo": "21" }, { "arapca": "مَالِك", "turkce": "Mâlik 🔑", "kalipNo": "33" }, { "arapca": "مَلِيك", "turkce": "Melîk 🤴", "kalipNo": "35" }, { "arapca": "مَمْلُوك", "turkce": "Memlük 💂", "kalipNo": "36" }, { "arapca": "مَمْلَكَة", "turkce": "Memleket 🇹🇷", "kalipNo": "38" }, { "arapca": "أَمْلَاك", "turkce": "Emlâk 🏘️", "kalipNo": "41" } ] },
        "ر-س-ل": { "root": ["ر", "س", "ل"], "words": [ { "arapca": "رِسَالَة", "turkce": "Risâle 📜", "kalipNo": "23" }, { "arapca": "رَسُول", "turkce": "Resul 🗣️", "kalipNo": "26" }, { "arapca": "إِرْسَالِيَّة", "turkce": "İrsaliye 🧾", "kalipNo": "55" }, { "arapca": "مُرْسَل", "turkce": "Mürsel 📨", "kalipNo": "57" } ] },
        "ن-ص-ر": { "root": ["ن", "ص", "ر"], "words": [ { "arapca": "نُصْرَة", "turkce": "Nusret ✌️", "kalipNo": "21" }, { "arapca": "نَاصِر", "turkce": "Nâsır 🛡️", "kalipNo": "33" }, { "arapca": "مَنْصُور", "turkce": "Mansur 🥇", "kalipNo": "36" } ] },
        "ح-م-ل": { "root": ["ح", "م", "ل"], "words": [ { "arapca": "حَمْلَة", "turkce": "Hamle ♟️", "kalipNo": "19" }, { "arapca": "حَامِلَة", "turkce": "Hâmile 🤰", "kalipNo": "33" }, { "arapca": "حَمَّال", "turkce": "Hammâl 🎒", "kalipNo": "34" }, { "arapca": "اِحْتِمَال", "turkce": "İhtimal 🎲", "kalipNo": "80" }, { "arapca": "مُحْتَمَل", "turkce": "Muhtemel ✅", "kalipNo": "82" }, { "arapca": "تَحَمُّل", "turkce": "Tahammül 🏋️", "kalipNo": "91" } ] },
        "ح-ق-ق": { "root": ["ح", "ق", "ق"], "words": [ { "arapca": "حَقّ", "turkce": "Hak ⚖️", "kalipNo": "19" }, { "arapca": "حُقُوق", "turkce": "Hukuk 🏛️", "kalipNo": "43" }, { "arapca": "حَقِيقة", "turkce": "Hakîkat 💎", "kalipNo": "35" }, { "arapca": "تَحْقِيق", "turkce": "Tahkik 🕵️", "kalipNo": "61" }, { "arapca": "مُحَقَّق", "turkce": "Muhakkak ✅", "kalipNo": "63" }, { "arapca": "اِسْتِحْقَاق", "turkce": "İstihkak 🏅", "kalipNo": "103" }, { "arapca": "مُسْتَحَقّ", "turkce": "Müstehak 👍", "kalipNo": "105" } ] },
        "خ-ل-ص": { "root": ["خ", "ل", "ص"], "words": [ { "arapca": "خَالِص", "turkce": "Hâlis 💧", "kalipNo": "33" }, { "arapca": "إِخْلَاص", "turkce": "İhlâs 💖", "kalipNo": "55" }, { "arapca": "مُخْلِص", "turkce": "Muhlis 😊", "kalipNo": "56" } ] },
        "ك-م-ل": { "root": ["ك", "م", "ل"], "words": [ { "arapca": "كَمَال", "turkce": "Kemâl ✨", "kalipNo": "22" }, { "arapca": "كَامِل", "turkce": "Kâmil 🌟", "kalipNo": "33" }, { "arapca": "إِكْمَال", "turkce": "İkmâl 🏁", "kalipNo": "55" }, { "arapca": "تَكْمِيل", "turkce": "Tekmil ✅", "kalipNo": "61" }, { "arapca": "مُكَمَّل", "turkce": "Mükemmel 💯", "kalipNo": "63" } ] },
        "ر-ش-د": { "root": ["ر", "ش", "د"], "words": [ { "arapca": "رَشِيد", "turkce": "Reşît 🧠", "kalipNo": "35" }, { "arapca": "رُشْد", "turkce": "Rüşt 🧑", "kalipNo": "21" }, { "arapca": "إِرْشَاد", "turkce": "İrşât 🧭", "kalipNo": "55" }, { "arapca": "رَشَاد", "turkce": "Reşât ✨", "kalipNo": "22" }, { "arapca": "مُرْشِد", "turkce": "Mürşid 🧑‍🏫", "kalipNo": "56" }, { "arapca": "رَاشِد", "turkce": "Râşid 🚶", "kalipNo": "33" } ] },
        "أ-م-ن": { "root": ["أ", "م", "ن"], "words": [ { "arapca": "أَمَان", "turkce": "Emân 🛡️", "kalipNo": "22" }, { "arapca": "أَمِين", "turkce": "Emîn 🔒", "kalipNo": "35" }, { "arapca": "إِيمَان", "turkce": "İman 💖", "kalipNo": "55" }, { "arapca": "مُؤْمِن", "turkce": "Mümin 🙏", "kalipNo": "56" }, { "arapca": "تَأْمِين", "turkce": "Temin 🤝", "kalipNo": "61" } ] },
        "ج-م-ع": { "root": ["ج", "م", "ع"], "words": [ { "arapca": "جَمْع", "turkce": "Cem 👥", "kalipNo": "19" }, { "arapca": "جَمْعِيَّة", "turkce": "Cemiyet 🏛️", "kalipNo": "19" }, { "arapca": "جَمَاعة", "turkce": "Cemâat 👨‍👩‍👧‍👦", "kalipNo": "22" }, { "arapca": "جَامِع", "turkce": "Câmi 🕌", "kalipNo": "33" }, { "arapca": "مَجْمُوعَة", "turkce": "Mecmua 📚", "kalipNo": "36" }, { "arapca": "اِجْتِمَاع", "turkce": "İçtima 🤝", "kalipNo": "80" } ] },
        "ح-م-د": { "root": ["ح", "م", "د"], "words": [ { "arapca": "حَمْد", "turkce": "Hamd 🙏", "kalipNo": "19" }, { "arapca": "أَحْمَد", "turkce": "Ahmet 🌟", "kalipNo": "30" }, { "arapca": "حَمِيد", "turkce": "Hamît 😊", "kalipNo": "35" }, { "arapca": "مَحْمُود", "turkce": "Mahmut ✨", "kalipNo": "36" }, { "arapca": "مُحَمَّد", "turkce": "Muhammet 💖", "kalipNo": "63" } ] },
        "ش-ه-ر": { "root": ["ش", "ه", "ر"], "words": [ { "arapca": "شَهْر", "turkce": "Şehir (Ay) 📅", "kalipNo": "19" }, { "arapca": "شُهْرَة", "turkce": "Şöhret 🌟", "kalipNo": "21" }, { "arapca": "مَشْهُور", "turkce": "Meşhur 🤩", "kalipNo": "36" }, { "arapca": "تَشْهِير", "turkce": "Teşhir 🎨", "kalipNo": "61" } ] },
        "ش-ك-ر": { "root": ["ش", "ك", "ر"], "words": [ { "arapca": "شُكْر", "turkce": "Şükür 🙏", "kalipNo": "21" }, { "arapca": "شُكْرَان", "turkce": "Şükrân 💖", "kalipNo": "27" }, { "arapca": "شَاكِر", "turkce": "Şâkir 😊", "kalipNo": "33" }, { "arapca": "تَشَكُّر", "turkce": "Teşekkür 🙌", "kalipNo": "91" }, { "arapca": "مُتَشَكِّر", "turkce": "Müteşekkir 🥰", "kalipNo": "92" } ] },
        "ف-ك-ر": { "root": ["ف", "ك", "ر"], "words": [ { "arapca": "فِكْر", "turkce": "Fikir 🧠", "kalipNo": "20" }, { "arapca": "تَفَكُّر", "turkce": "Tefekkür 🤔", "kalipNo": "91" }, { "arapca": "مُتَفَكِّر", "turkce": "Mütefekkir 🧘", "kalipNo": "92" } ] },
        "و-ك-ل": { "root": ["و", "ك", "ل"], "words": [ { "arapca": "وَكَالَة", "turkce": "Vekâlet 📜", "kalipNo": "22" }, { "arapca": "وَكِيل", "turkce": "Vekîl 🧑‍💼", "kalipNo": "35" }, { "arapca": "مُوَكِّل", "turkce": "Müvekkil 👤", "kalipNo": "62" }, { "arapca": "تَوَكُّل", "turkce": "Tevekkül 🤲", "kalipNo": "91" } ] },
        "ك-ب-ر": { "root": ["ك", "ب", "ر"], "words": [ { "arapca": "كِبْر", "turkce": "Kibir 😤", "kalipNo": "20" }, { "arapca": "كِبَار", "turkce": "Kibâr 😊", "kalipNo": "44" }, { "arapca": "أَكْبَر", "turkce": "Ekber ⬆️", "kalipNo": "50" }, { "arapca": "كُبْرَى", "turkce": "Kübra 🌟", "kalipNo": "51" }, { "arapca": "تَكْبِير", "turkce": "Tekbir ☝️", "kalipNo": "61" } ] },
        "ع-ج-ز": { "root": ["ع", "ج", "ز"], "words": [ { "arapca": "عَاجِز", "turkce": "Âciz 😩", "kalipNo": "33" }, { "arapca": "عَجَزَة", "turkce": "Aceze 👥", "kalipNo": "47" }, { "arapca": "مُعْجِزَة", "turkce": "Mucize ✨", "kalipNo": "56" }, { "arapca": "تَعْجِيز", "turkce": "Taciz 🚫", "kalipNo": "61" } ] },
        "ح-ر-م": { "root": ["ح", "ر", "م"], "words": [ { "arapca": "إِحْرَام", "turkce": "İhrâm 🕋", "kalipNo": "55" }, { "arapca": "حَرَم", "turkce": "Harem 🕌", "kalipNo": "17" }, { "arapca": "مُحَرَّم", "turkce": "Muharrem 🌙", "kalipNo": "63" }, { "arapca": "حَرَام", "turkce": "Harâm 🚫", "kalipNo": "22" }, { "arapca": "اِحْتِرَام", "turkce": "İhtiram 🫡", "kalipNo": "80" }, { "arapca": "مَحْرُوم", "turkce": "Mahrum 😔", "kalipNo": "36" }, { "arapca": "مُحْتَرَم", "turkce": "Muhterem 🧐", "kalipNo": "82" }, { "arapca": "مَحْرَم", "turkce": "Mahrem 🤫", "kalipNo": "38" } ] },
        "س-أ-ل": { "root": ["س", "أ", "ل"], "words": [ { "arapca": "سُؤَال", "turkce": "Suâl ❓", "kalipNo": "24" }, { "arapca": "مَسْؤُول", "turkce": "Mesul 👮", "kalipNo": "36" }, { "arapca": "مَسْأَلَة", "turkce": "Mesele ❔", "kalipNo": "38" } ] },
        "خ-ل-ف": { "root": ["خ", "ل", "ف"], "words": [{ "arapca": "خِلَافَة", "turkce": "Hilâfet ☪️", "kalipNo": "23" },{ "arapca": "خَلِيفَة", "turkce": "Halife 👑", "kalipNo": "35" },{ "arapca": "مُخَالَفَة", "turkce": "Muhalefet ❌", "kalipNo": "67" },
{ "arapca": "مُخَالِف", "turkce": "Muhalif 🙅‍♂️", "kalipNo": "69" },{ "arapca": "اِخْتِلَاف", "turkce": "İhtilaf 🔀", "kalipNo": "80" },{ "arapca": "مُخْتَلِف", "turkce": "Muhtelif 🎨", "kalipNo": "81" }] },
        "ع-م-ل": { "root": ["ع", "م", "ل"], "words": [ { "arapca": "عَمَل", "turkce": "Amel 👷", "kalipNo": "17" }, { "arapca": "عَامِل", "turkce": "Âmil 🧑‍🏭", "kalipNo": "33" }, { "arapca": "مَعْمُول", "turkce": "Mamûl 📦", "kalipNo": "36" }, { "arapca": "مُعَامَلَة", "turkce": "Muamele 🤝", "kalipNo": "67" }, { "arapca": "اِسْتِعْمَال", "turkce": "İstimâl 🔄", "kalipNo": "103" } ] },
        "خ-ر-ج": { "root": ["خ", "ر", "ج"], "words": [ { "arapca": "خَارِج", "turkce": "Hâriç 🌏", "kalipNo": "33" }, { "arapca": "مَخْرَج", "turkce": "Mahreç 🔊", "kalipNo": "38" }, { "arapca": "إِخْرَاج", "turkce": "İhrâç 📤", "kalipNo": "55" }] }, 
        "د-ر-س": { "root": ["د", "ر","س"], "words": [ { "arapca": "دَرْس", "turkce": "Ders 📖", "kalipNo": "19" }, { "arapca": "مَدْرَسَة", "turkce": "Medrese 🏫", "kalipNo": "38" }, { "arapca": "تَدْرِيسَات", "turkce": "Tedrisat 🧑‍🏫", "kalipNo": "61" }, { "arapca": "مُدَرِّس", "turkce": "Müderris 👨‍🏫", "kalipNo": "62" } ] },
        "ف-ت-ح": { "root": ["ف", "ت", "ح"], "words": [ { "arapca": "فَتْح", "turkce": "Fetih", "kalipNo": "19" }, { "arapca": "فَاتِح", "turkce": "Fâtih", "kalipNo": "33" }, { "arapca": "اِفْتِتَاح", "turkce": "İftitah 🎊", "kalipNo": "80" } ] },
        "ن-ز-ل": { "root": ["ن", "ز", "ل"], "words": [ { "arapca": "نُزُول", "turkce": "Nüzûl ⬇️", "kalipNo": "25" }, { "arapca": "نَزْلَة", "turkce": "Nezle 🤧", "kalipNo": "19" }, { "arapca": "مَنْزِل", "turkce": "Menzil 📍", "kalipNo": "37" }, { "arapca": "تَنَزُّل", "turkce": "Tenezzül 🙇", "kalipNo": "91" } ] },
        "ق-ت-ل": { "root": ["ق", "ت", "ل"], "words": [ { "arapca": "قَتْل", "turkce": "Katl ☠️", "kalipNo": "19" }, { "arapca": "قَاتِل", "turkce": "Kâtil 👤", "kalipNo": "33" }, { "arapca": "مَقْتُول", "turkce": "Maktül 🪦", "kalipNo": "36" }, { "arapca": "قِتَال", "turkce": "Kıtâl ⚔️", "kalipNo": "68" } ] },
        "ذ-ك-ر": { "root": ["ذ", "ك", "ر"], "words": [ { "arapca": "ذِكْر", "turkce": "Zikir 📿", "kalipNo": "20" }, { "arapca": "ذَاكِر", "turkce": "Zâkir 🗣️", "kalipNo": "33" }, { "arapca": "مَذْكُور", "turkce": "Mezkûr 📝", "kalipNo": "36" } ] }
      }
    };
    // Sabitler
    const rootColors = ["#007bff", "#dc3545", "#ffc107", "#198754", "#6f42c1", "#fd7e14", "#20c997", "#6610f2", "#d63384", "#17a2b8"]; // 10 renk
    
    // *** YENİ: DİNAMİK SABİTLER ***
    // Bu değişkenler artık 'let' ile tanımlanıyor ve DOM yüklendiğinde ayarlanacak
    let ALLOWED_KALIPS;
    let STATIC_PATTERNS_SORTED;
    let PATTERN_COLUMNS;
    let IS_MOBILE_DEVICE = false; // GÜNCELLENDİ: Global cihaz tespiti
    // *** BİTİŞ: DİNAMİK SABİTLER ***


    // OYUN MANTIĞI
    document.addEventListener('DOMContentLoaded', () => {

        // *** YENİ: Cihaz tespiti ve sabitlerin ayarlanması ***
        
        // HATA DÜZELTMESİ (SAMSUNG TARAYICI): Sadece genişliğe değil, tarayıcı kimliğine de bak.
        const isMobile = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
        
        IS_MOBILE_DEVICE = isMobile(); // Global değişkene ata

        
        // HATA DÜZELTMESİ (SYNTAXERROR ve MOBİL GRİD):
        // if/else bloğu eksikti ve mobil için 2 sütunlu grid ayarlanmıyordu.
        if (IS_MOBILE_DEVICE) {
            // --- MOBİL AYARLARI (6 Kalıp, 2 Sütun) ---
            ALLOWED_KALIPS = ['33', '35', '36', '55', '61', '67']; // 6 kalıp
            STATIC_PATTERNS_SORTED = [...ALLOWED_KALIPS].sort((a, b) => parseInt(a) - parseInt(b));
            
            PATTERN_COLUMNS = {
                col1: STATIC_PATTERNS_SORTED.slice(0, 3), // İlk 3
                col2: STATIC_PATTERNS_SORTED.slice(3, 6)  // Son 3
            };
            
            // CSS'e sütun sayısını bildir (2)
            document.documentElement.style.setProperty('--pattern-cols', '2');
            
        } else {
            // --- MASAÜSTÜ AYARLARI (12 Kalıp, 3 Sütun) ---
            ALLOWED_KALIPS = ['17', '22', '33', '35', '36', '50', '55', '56', '61', '67', '80', '103'];
            STATIC_PATTERNS_SORTED = [...ALLOWED_KALIPS].sort((a, b) => parseInt(a) - parseInt(b));
            
            PATTERN_COLUMNS = {
                col1: STATIC_PATTERNS_SORTED.slice(0, 4), 
                col2: STATIC_PATTERNS_SORTED.slice(4, 8), 
                col3: STATIC_PATTERNS_SORTED.slice(8, 12)  
            };
            
            // CSS'e sütun sayısını bildir (3)
            document.documentElement.style.setProperty('--pattern-cols', '3');
           }
        


        // DOM Elementleri
        const startScreen = document.getElementById('start-screen');
        const resultsScreen = document.getElementById('results-screen');
        const resultsDetails = document.getElementById('results-details');
        const playAgainButton = document.getElementById('play-again-button');
        const nextRoundButton = document.getElementById('next-round-button'); // YENİ EKLENDİ
        const startButtons = document.querySelectorAll('.start-button-option');
        const level2Container = document.getElementById('level2-container');
        
        const l2Timer = document.getElementById('l2-timer');
        const l2ScoreValue = document.getElementById('l2-score-value');
        const l2TurkishWordArea = document.getElementById('l2-turkish-word-area');
        const l2RootsSidebar = document.getElementById('l2-roots-sidebar');
        const l2PatternsWrapper = document.getElementById('l2-patterns-wrapper');
        const l2GlobalResult = document.getElementById('l2-global-result');

        const gameBackButton = document.getElementById('game-back-button');
        const startBackButton = document.getElementById('start-back-button'); // YENİ
        const countdownOverlay = document.getElementById('countdown-overlay');
        const countdownText = document.getElementById('countdown-text');

        // Ses Mantiği
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        async function playGenericSound(type) {
            if (!audioContext) { console.warn("AudioContext desteklenmiyor."); return; }
            if (audioContext.state === 'suspended') {
                try { await audioContext.resume(); } 
                catch (e) { console.error("AudioContext resume failed:", e); return; }
            }
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode); gainNode.connect(audioContext.destination);
            let freq, vol, duration, waveType; waveType = 'sine';
            switch(type) {
                case 'correct': freq = 523.25; vol = 0.7; duration = 0.15; waveType = 'triangle'; break;
                case 'incorrect': freq = 164.81; vol = 0.6; duration = 0.3; waveType = 'square'; break;
                case 'touch': freq = 220.00; vol = 0.5; duration = 0.05; waveType = 'sine'; break;
                case 'drop': freq = 349.23; vol = 0.8; duration = 0.1; waveType = 'sine'; break;
                case 'set_complete': freq = 880.00; vol = 0.8; duration = 0.2; waveType = 'sine'; break;
                default: return;
            }
            oscillator.type = waveType;
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            gainNode.gain.setValueAtTime(vol, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
            oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
        }

        // Oyun Durumu
        let gameState = { 
            isGameActive: false, 
            difficulty: 'medium',
            totalWords: 10,
            timeLimit: 120,
            pointsPerWord: 10, // Masaüstü için varsayılan
            bonusTimeLimit: 0, // GÜNCELLENDİ: Yeni puanlama için
            wordStartTime: 0   // GÜNCELLENDİ: Yeni puanlama için
        };
        let score = 0;
        let wordsByRoot = {}; 
        let currentWordQueue = [];
        let currentWordIndex = 0;
        let timerInterval = null; 
        let timeLeft = 60; 
        let draggedRootElement = null;
        let ghostElement = null; 
        let allWordsPool = []; 
        let lastTouchTarget = null; // YENİ: Dokunmatik sürüklemede son hedefi izlemek için
        
     
        
        // Oyunu Başlatma (Sadece 1 kez çalışır)
        function initializeGame() {
            try {
                wordsByRoot = {};
                allWordsPool = [];
                for (const rootKey in embeddedGameData.roots) {
                    const cleanRootKey = rootKey.replace(/[нмр]/g, (match) => {
                        if (match === 'н') return 'ن';
                        if (match === 'м') return 'م';
                        if (match === 'р') return 'ر';
                        return match;
                    });
                    
                    const rootData = embeddedGameData.roots[rootKey];
                    if (rootData.words && rootData.words.length > 0) {
                        
                        // Önce tüm kelimeleri işle (rootKey vb. ekle)
                        const allProcessedWords = rootData.words.map(word => ({
                            ...word,
                            rootKey: cleanRootKey,
                            rootDisplay: rootData.root.join('')
                        }));

                        // *** DÜZELTME (Dinamik): ***
                        // Kelimeleri, sadece kalıp numarası (artık dinamik olan) ALLOWED_KALIPS listesindeyse filtrele
                        const filteredWords = allProcessedWords.filter(word => 
                            ALLOWED_KALIPS.includes(word.kalipNo)
                        );
                        
                        // Sadece filtrelenmiş kelimeleri hem havuza hem de listeye ekle
                        if (filteredWords.length > 0) {
                            wordsByRoot[cleanRootKey] = filteredWords;
                            allWordsPool.push(...filteredWords); 
                        }
                    }
                }
                showScreen('start');
            } catch (error) { console.error("Oyun verisi yüklenemedi veya işlenemedi!", error); }
        }
        
        // Oyunu başlatmadan önce UI'ı hazırlar
        function prepareGameUI() {
            score = 0;
            l2ScoreValue.textContent = "0"; 
            currentWordIndex = 0;
            currentWordQueue = [];
            
            l2GlobalResult.textContent = "";
            drawPatternGrid(); 
            setupNewSet();     
            showScreen('level2'); // DÜZELTME: Geri sayım için önce UI'ı göster
        }

        // Geri Sayım Fonksiyonu
        function startCountdown() {
            prepareGameUI(); // Önce oyun ekranını çiz
            showScreen('countdown'); // Sonra geri sayımı üstüne bindir

            let count = 3;
            countdownText.style.animation = 'countdown-pulse 1s infinite ease-in-out';
            
            function doCount() {
                if (count > 0) {
                    countdownText.textContent = count;
                    playGenericSound('touch');
                    count--;
                    setTimeout(doCount, 1000);
                } else {
                    countdownText.textContent = "BAŞLA!";
                    countdownText.style.animation = 'none'; 
                    playGenericSound('set_complete');
                    setTimeout(() => {
                        countdownOverlay.classList.add('hidden');
                        startGameActions(); // Oyunu gerçekten başlat
                    }, 500); 
                }
            }
            doCount();
        }

        // Geri sayımdan sonra oyunu aktif eden fonksiyon
        function startGameActions() {
            gameState.isGameActive = true; 
            startTimer();
            gameState.wordStartTime = Date.now(); // GÜNCELLENDİ: İlk kelimenin sayacını başlat
        }

        // Zamanlayıcı Fonksiyonları (Seviyeye göre ayarlı)
        function startTimer() {
            if(timerInterval) clearInterval(timerInterval);
            timeLeft = gameState.timeLimit; 
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            l2Timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            l2Timer.style.color = 'var(--primary-color)';
            
            timerInterval = setInterval(() => {
                if (!gameState.isGameActive) {
                    clearInterval(timerInterval);
                    return;
                }
                
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                l2Timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                if (timeLeft <= 10) {
                    l2Timer.style.color = 'var(--error-color)';
                }
                
                if (timeLeft <= 5 && timeLeft > 0) {
                    playGenericSound('touch'); 
                }

                if (timeLeft <= 0) {
                    endGame(true); // 'true' (zaman doldu) ile bitir
                }
            }, 1000);
        }

        function stopTimer() {
            if(timerInterval) clearInterval(timerInterval);
            timerInterval = null;
        }

        // --- RASTGELE SET OLUŞTURMA MANTIĞI ---
        function setupNewSet() {
       // *** DÜZELTME BAŞLANGICI: Önceki turdan kalan işaretleri temizle ***
            allWordsPool.forEach(word => {
                word.found = false;
                word.failed = false;
            });
            // *** DÜZELTME BİTİŞİ ***

            // 1. Tüm kelime havuzunu karıştır
            allWordsPool.sort(() => 0.5 - Math.random());
            
            // 1. Tüm kelime havuzunu karıştır
            allWordsPool.sort(() => 0.5 - Math.random());
            
            currentWordQueue = [];
            const newRootKeys = [];
            const usedPatterns = new Set();
            const usedRoots = new Set();

            // 2. Önce benzersiz kök VE kalıp araması yap
            for (const word of allWordsPool) {
                if (currentWordQueue.length >= gameState.totalWords) break;

                if (!usedRoots.has(word.rootKey) && !usedPatterns.has(word.kalipNo)) {
                    currentWordQueue.push(word);
                    usedRoots.add(word.rootKey);
                    newRootKeys.push(word.rootKey);
                    usedPatterns.add(word.kalipNo);
                }
            }
            
            // 3. (Eğer 3/5/10 kelime bulamazsak) Sadece benzersiz kök araması yaparak doldur
            if (currentWordQueue.length < gameState.totalWords) {
                for (const word of allWordsPool) {
                    if (currentWordQueue.length >= gameState.totalWords) break;

                    // Bu kök zaten eklenmediyse
                    if (!usedRoots.has(word.rootKey)) {
                        currentWordQueue.push(word);
                        usedRoots.add(word.rootKey);
                        newRootKeys.push(word.rootKey);
                        // (Kalıbı burada kontrol etmiyoruz, çakışabilir)
                    }
                }
            }
            
            // 4. (EĞER HALA TAMAMLANMADIYSA) - Havuzdan rastgele doldur (çok nadir bir durum)
            if (currentWordQueue.length < gameState.totalWords) {
                 for (const word of allWordsPool) {
                     if (currentWordQueue.length >= gameState.totalWords) break;
                     // Bu kelime zaten eklenmediyse
                     if (!currentWordQueue.some(w => w.arapca === word.arapca)) {
                         currentWordQueue.push(word);
                         if (!usedRoots.has(word.rootKey)) {
                             newRootKeys.push(word.rootKey);
                             usedRoots.add(word.rootKey);
                         }
                     }
                 }
            }

            // 5. Seti karıştır ve çiz
            currentWordQueue.sort(() => 0.5 - Math.random()); 
            currentWordIndex = 0;
            
            drawWordQueue();
            drawRootOptions(newRootKeys); 
            
            l2PatternsWrapper.querySelectorAll('.l2-derived-word').forEach(el => el.remove());
            l2PatternsWrapper.querySelectorAll('.l2-pattern-number').forEach(el => el.classList.remove('hidden'));
            
            highlightCurrentWord();
        }

        // Kelime Kuyruğunu Çiz (3, 5 veya 10)
        function drawWordQueue() {
            l2TurkishWordArea.innerHTML = '';
            currentWordQueue.forEach((word, index) => {
                const wordElement = document.createElement('div');
                wordElement.className = 'l2-target-word'; 
                wordElement.id = `l2-target-word-${index}`;
                wordElement.textContent = word.turkce;
                
                wordElement.dataset.correctRoot = word.rootKey;
                wordElement.dataset.correctPattern = word.kalipNo;
                wordElement.dataset.correctArapca = word.arapca;
                
                if (word.found) { // Bu, 'failed' durumunu da korur
                    wordElement.classList.add('done');
                }
                
                l2TurkishWordArea.appendChild(wordElement);
            });
        }
        
        // Aktif Kelimeyi Vurgula
        function highlightCurrentWord() {
            l2TurkishWordArea.querySelectorAll('.l2-target-word').forEach(el => el.classList.remove('active'));
            
            // YENİ: Eğer 'failed' değilse bir sonrakini seç
            while(currentWordIndex < currentWordQueue.length && 
                  currentWordQueue[currentWordIndex].failed) {
                currentWordIndex++; // Başarısızları atla
            }

            const activeWordEl = document.getElementById(`l2-target-word-${currentWordIndex}`);
            if(activeWordEl) {
                activeWordEl.classList.add('active');
                gameState.wordStartTime = Date.now(); // GÜNCELLENDİ: Yeni kelimenin sayacını başlat
            }
        }

        // Kökleri Çiz (3, 5 veya 10)
        // *** GÜNCELLENDİ: Mobil/Masaüstü için farklı grid ayarı ***
        function drawRootOptions(rootKeys) {
            l2RootsSidebar.innerHTML = '';
            
            if (IS_MOBILE_DEVICE) {
                // MOBİL: 3 kök için 3 sütun, 1 sıra
                l2RootsSidebar.style.gridTemplateColumns = '1fr 1fr 1fr';
                l2RootsSidebar.style.gridTemplateRows = 'auto'; 
            } else {
                // MASAÜSTÜ: 10 köke kadar 2 sütun, 5 sıra
                l2RootsSidebar.style.gridTemplateColumns = '1fr 1fr';
                l2RootsSidebar.style.gridTemplateRows = 'repeat(5, auto)';
            }

            rootKeys.forEach((rootKey, index) => { 
                const rootElement = document.createElement('div');
                rootElement.className = 'l2-draggable-root';
                rootElement.draggable = true;
                rootElement.dataset.rootKey = rootKey;
                rootElement.dir = 'rtl';

                const color = rootColors[index % rootColors.length];
                rootElement.style.color = color;
                
                const span = document.createElement('span');
                const rootArray = wordsByRoot[rootKey]?.[0]?.rootDisplay; // İlk kelimeden al
                if (rootArray) {
                    span.textContent = rootArray;
                } else {
                    span.textContent = rootKey; 
                }
                rootElement.appendChild(span);
                
                rootElement.addEventListener('dragstart', handleDragStart); 
                rootElement.addEventListener('dragend', handleDragEnd);
                rootElement.addEventListener('touchstart', handleTouchStart, { passive: false });     
                
                l2RootsSidebar.appendChild(rootElement);
            });
        }

        // Kalıp Grubu oluşturucu (Yardımcı - Değişmedi)
        function createPatternGroup(patternId) {
             const groupElement = document.createElement('div');
             groupElement.className = 'l2-pattern-group'; 
             groupElement.dataset.patternId = patternId;
             
             const numberElement = document.createElement('div');
             numberElement.className = 'l2-pattern-number'; 
             const patternData = embeddedGameData.patterns[patternId];
             
             if (patternData && patternData.displayComponents) {
                 patternData.displayComponents.forEach(component => {
                    let processedComponent = component; 
                    if (!component.includes('ـ') && component.length === 2 && !['ا', 'و', 'ي', 'ى', 'ة', 'ء', 'أ', 'إ', 'آ'].includes(component[0])) { 
                        const letter = component[0]; const haraka = component[1];
                        if (letter === 'ت') processedComponent = `ـت${haraka}ـ`;
                        else if (letter === 'ي') processedComponent = `ـي${haraka}ـ`;
                    }
                     const span = document.createElement('span');
                     span.textContent = processedComponent; 
                     numberElement.appendChild(span);
                 });
             } else {
                 const span = document.createElement('span');
                 span.textContent = patternId;
                 numberElement.appendChild(span);
             }
             groupElement.appendChild(numberElement); 
             
             const circleElement = document.createElement('div');
             circleElement.className = 'pattern-number-circle'; 
             circleElement.textContent = patternId;
             groupElement.appendChild(circleElement); 

             groupElement.addEventListener('dragover', handleDragOver);
             groupElement.addEventListener('dragleave', handleDragLeave);
             groupElement.addEventListener('drop', handleDrop);

             return groupElement;
        }

        // *** GÜNCELLENDİ: 6, 9 veya 12 Kalıbı Dinamik Olarak Çiz ***
        function drawPatternGrid() {
            l2PatternsWrapper.innerHTML = '';
            
            // PATTERN_COLUMNS objesindeki (col1, col2, [col3]) key'leri al
            const columnKeys = Object.keys(PATTERN_COLUMNS); 
            
            columnKeys.forEach((key, colIndex) => {
                // O sütundaki kalıpları (array) al
                const patternsInColumn = PATTERN_COLUMNS[key];
                
                // Her kalıp için element oluştur
                patternsInColumn.forEach((kalipId, rowIndex) => {
                    const groupElement = createPatternGroup(kalipId);
                    groupElement.style.gridColumn = `${colIndex + 1}`; // Sütun (1, 2, veya 3)
                    groupElement.style.gridRow = `${rowIndex + 1}`;    // Sıra (1, 2, 3, veya 4)
                    l2PatternsWrapper.appendChild(groupElement);
                });
            });
        }
        
        // Puan Patlaması Animasyonu Fonksiyonu
        function showScoreBurst(targetElement, text) {
            const burst = document.createElement('div');
            burst.className = 'score-burst';
            burst.textContent = text;
            l2PatternsWrapper.appendChild(burst); 
            
            const rect = targetElement.getBoundingClientRect();
            const wrapperRect = l2PatternsWrapper.getBoundingClientRect();
            burst.style.top = `${rect.top - wrapperRect.top + (rect.height / 2)}px`;
            burst.style.left = `${rect.left - wrapperRect.left + (rect.width / 2)}px`;
            
            burst.addEventListener('animationend', () => {
                burst.remove();
            });
        }

      
        
        // --- SÜRÜKLEME MANTIĞI ---

        function handleDragStart(e) {
            if (!gameState.isGameActive) { e.preventDefault(); return; }
            playGenericSound('touch');
            draggedRootElement = e.target.closest('.l2-draggable-root');
            if (!draggedRootElement) return;
            draggedRootElement.classList.add('dragging');
            ghostElement = draggedRootElement.cloneNode(true);
            ghostElement.classList.add('drag-ghost');
            ghostElement.style.position = 'absolute'; 
            ghostElement.style.top = '-1000px';      
            document.body.appendChild(ghostElement); 
            draggedRootElement.style.opacity = '0';
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', draggedRootElement.dataset.rootKey);
            setTimeout(() => {
                if (ghostElement) {
                    const rect = ghostElement.getBoundingClientRect();
                    const offsetX = rect.width / 2;
                    const offsetY = rect.height / 2;
                    e.dataTransfer.setDragImage(ghostElement, offsetX, offsetY);
                }
            }, 0); 
        }

        function handleDragEnd(e) {
            if (ghostElement) ghostElement.remove();
            if (draggedRootElement) {
                draggedRootElement.classList.remove('dragging');
                draggedRootElement.style.opacity = '1';
            }
            draggedRootElement = null;
            ghostElement = null;
            clearHovers();
        }
        
        function handleDragOver(e) { 
            e.preventDefault(); 
            const pg = e.target.closest('.l2-pattern-group'); 
            if (pg && gameState.isGameActive && !pg.querySelector('.l2-derived-word')) { 
                clearHovers(); 
                pg.classList.add('dragover'); 
            } 
        } 
        function handleDragLeave(e) { 
            const pg = e.target.closest('.l2-pattern-group'); 
            if (pg) pg.classList.remove('dragover'); 
        }
        function clearHovers() { 
            l2PatternsWrapper.querySelectorAll('.l2-pattern-group.dragover').forEach(g => g.classList.remove('dragover')); 
        }

        function handleDrop(e) {
             e.preventDefault();
             if (!gameState.isGameActive) return; 
             const patternGroup = e.target.closest('.l2-pattern-group');
             processDrop(patternGroup);
        }
        
        // --- YENİ: DOKUNMATİK SÜRÜKLEME MANTIĞI ---

        // Hayalet elementin pozisyonunu günceller
        function updateGhostPosition(x, y) {
            if (!ghostElement) return;
            // Hayaletin ortasını parmağın altına almak için
            const offsetX = ghostElement.offsetWidth / 2;
            const offsetY = ghostElement.offsetHeight / 2;
            ghostElement.style.left = `${x - offsetX}px`;
            ghostElement.style.top = `${y - offsetY}px`;
        }

        // Dokunma başladığında (dragstart yerine)
        function handleTouchStart(e) {
            if (!gameState.isGameActive) return;
            
            // Sayfanın kaymasını engelle (ÇOK ÖNEMLİ)
            // e.preventDefault() diyebilmek için listener'a { passive: false } eklenmeli
            e.preventDefault(); 
            
            draggedRootElement = e.target.closest('.l2-draggable-root');
            if (!draggedRootElement) return;

            playGenericSound('touch');
            draggedRootElement.classList.add('dragging');
            
            // Hayalet elementi klonla ve ayarla
            ghostElement = draggedRootElement.cloneNode(true);
            ghostElement.classList.add('drag-ghost');
            // YENİ: Orijinalin boyutlarını kopyala
            const rect = draggedRootElement.getBoundingClientRect();
            ghostElement.style.width = `${rect.width}px`;
            ghostElement.style.height = `${rect.height}px`;
            document.body.appendChild(ghostElement); 
            draggedRootElement.style.opacity = '0'; // Orijinali gizle

            // Hayaleti hemen parmağın altına yerleştir
            const touch = e.touches[0];
            updateGhostPosition(touch.pageX, touch.pageY);

            // Taşıma ve bırakma olaylarını tüm belgeye ekle
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        }

        // Parmağı hareket ettirince (dragover ve dragleave yerine)
        function handleTouchMove(e) {
            if (!draggedRootElement || !ghostElement) return;
            
            // Kaydırmayı engelle
            e.preventDefault(); 

            const touch = e.touches[0];
            updateGhostPosition(touch.pageX, touch.pageY);

            // Parmağın altındaki elementi bul
            // Önce hayaleti gizlemeliyiz ki altındaki elementi bulabilelim
            ghostElement.style.display = 'none'; 
            const elementUnderFinger = document.elementFromPoint(touch.clientX, touch.clientY);
            ghostElement.style.display = ''; // Hayaleti geri göster

            const patternGroup = elementUnderFinger ? elementUnderFinger.closest('.l2-pattern-group') : null;

            // Eğer hedef değişmediyse bir şey yapma
            if (patternGroup === lastTouchTarget) return;

            // Eski hedeften ayrılma (dragleave)
            if (lastTouchTarget) {
                lastTouchTarget.classList.remove('dragover');
            }

            // Yeni hedefe girme (dragover) - (ve dolu değilse)
            if (patternGroup && !patternGroup.querySelector('.l2-derived-word')) {
                patternGroup.classList.add('dragover');
                lastTouchTarget = patternGroup;
            } else {
                lastTouchTarget = null; // Geçerli bir hedef değil
            }
        }

        // Parmağı kaldırınca (dragend ve drop yerine)
        function handleTouchEnd(e) {
            if (!draggedRootElement) return;

            // 1. Bırakma (Drop) İşlemi
            if (lastTouchTarget) {
                // 'handleDrop' yerine doğrudan 'processDrop'u çağırıyoruz
                // çünkü hedefi (lastTouchTarget) zaten biliyoruz.
                processDrop(lastTouchTarget); 
                lastTouchTarget.classList.remove('dragover');
            }

            // 2. Bitirme (DragEnd) İşlemi
            // handleDragEnd'deki temizleme mantığını burada da uygula
            if (ghostElement) ghostElement.remove();
            if (draggedRootElement) {
                draggedRootElement.classList.remove('dragging');
                draggedRootElement.style.opacity = '1';
            }
            draggedRootElement = null;
            ghostElement = null;
            lastTouchTarget = null;
            
            // Tüm belgeye eklenen listener'ları temizle
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        }

        // --- DOKUNMATİK SÜRÜKLEME MANTIĞI BİTİŞİ ---
        
        
       
        
        // Bırakma Mantığı (YENİ TEK ATIŞ HAKKI)
        function processDrop(patternGroup) {
             if (!patternGroup || !draggedRootElement) { 
                 if (patternGroup) patternGroup.classList.remove('dragover'); 
                 return; 
             }
             patternGroup.classList.remove('dragover');
             
             if (patternGroup.querySelector('.l2-derived-word')) {
                 if (draggedRootElement) {
                     draggedRootElement.style.animation = "shake 0.5s";
                     setTimeout(() => { draggedRootElement.style.animation = ""; }, 500);
                 }
                 return;
             }

             playGenericSound('drop');
             
             // Kalan kelimeleri kontrol et
             let remainingWords = currentWordQueue.filter(w => !w.found && !w.failed).length;
             if (remainingWords === 0) {
                 // Bu durum olmamalı ama olursa diye
                 endGame(false);
                 return;
             }

             const activeWordEl = document.getElementById(`l2-target-word-${currentWordIndex}`);
             if (!activeWordEl) return;
             
             const correctRootKey = activeWordEl.dataset.correctRoot;
             const correctPatternId = activeWordEl.dataset.correctPattern;
             const correctArapca = activeWordEl.dataset.correctArapca;

             const droppedPatternId = patternGroup.dataset.patternId;
             const draggedRootKey = draggedRootElement.dataset.rootKey;

             const isRootCorrect = (draggedRootKey === correctRootKey);
             const isPatternCorrect = (droppedPatternId === correctPatternId);

             // DOĞRU EŞLEŞME
             if (isRootCorrect && isPatternCorrect) {
                 playGenericSound('correct');
                 
                 // GÜNCELLENDİ: Yeni Puanlama Mantığı
                 let wordScore = 0;
                 let bonusScore = 0;
                 let totalWordScore = 0;

                 if (IS_MOBILE_DEVICE) {
                     wordScore = gameState.pointsPerWord; // ör: 25
                     bonusScore = 0; // Sıfırla
                     let finalBonus = 0; // YENİ: Sıfırla

                     const wordTimeTaken = (Date.now() - gameState.wordStartTime) / 1000;
                     if (wordTimeTaken <= gameState.bonusTimeLimit) {
                         bonusScore = gameState.bonusPoints; // ör: 8
                     }
                     
                     // YENİ: Son kelime mi diye kontrol et (index 2 = total 3 - 1)
                     if (currentWordIndex === (gameState.totalWords - 1)) {
                         finalBonus = gameState.finalWordBonus; // ör: 1
                     }

                     totalWordScore = wordScore + bonusScore + finalBonus;
                 } else {
                     wordScore = gameState.pointsPerWord; // Masaüstü puanı
                     totalWordScore = wordScore; // Masaüstü bonus yok
                 }
                 
                 score += totalWordScore; 
                 l2ScoreValue.textContent = score; 
                 showScoreBurst(patternGroup, "+" + totalWordScore);
                 // --- Puanlama Bitiş ---

                 
                 const patternNumberElement = patternGroup.querySelector('.l2-pattern-number'); 
                 if (patternNumberElement) patternNumberElement.classList.add('hidden');
                 
                 const derivedWordElement = document.createElement('div'); 
                 derivedWordElement.className = 'l2-derived-word'; 
                 derivedWordElement.textContent = correctArapca; 
                 patternGroup.appendChild(derivedWordElement);
                 
                 activeWordEl.classList.remove('active');
                 activeWordEl.classList.add('done');
                 currentWordQueue[currentWordIndex].found = true;
                 
                 currentWordIndex++;
                 remainingWords--; // Kalan kelime sayısını azalt
                 
                 // OYUN BİTİŞ KONTROLÜ
                 if (remainingWords === 0 || currentWordIndex === currentWordQueue.length) {
                     playGenericSound('set_complete');
                     l2GlobalResult.textContent = "Tur Bitti!";
                     
                     setTimeout(() => {
                         endGame(false); // Oyunu bitir (timeout değil)
                     }, 1000); 

                 } else {
                     highlightCurrentWord(); // Sonraki kelimeyi vurgula
                 }
             
             // YANLIŞ EŞLEŞME
             } else { 
                 playGenericSound('incorrect');
                 
                 // YENİ MANTIK: Hata tipini kontrol et
                 
                 // Durum 1: Doğru KÖK, Yanlış KALIP (Tek atış hakkı biter)
                 if (isRootCorrect && !isPatternCorrect) {
                     l2GlobalResult.textContent = 'Yanlış kalıp! Bu kelime hakkı bitti.';
                     activeWordEl.classList.add('failed'); // Kırmızı dolgu yap
                     currentWordQueue[currentWordIndex].failed = true; // Durumu kaydet
                     
                     if (draggedRootElement) {
                         draggedRootElement.style.animation = "shake 0.5s";
                         setTimeout(() => { draggedRootElement.style.animation = ""; }, 500);
                     }
                     
                     currentWordIndex++;
                     remainingWords--; // Kalan kelime sayısını azalt
                     
                     if (remainingWords === 0 || currentWordIndex === currentWordQueue.length) {
                         playGenericSound('set_complete');
                         l2GlobalResult.textContent = "Tur Bitti!";
                         setTimeout(() => {
                             endGame(false); 
                         }, 1000); 
                     } else {
                         highlightCurrentWord(); 
                     }
                     
                 // Durum 2: Yanlış KÖK (Geçici hata, hak bitmez)
                 } else if (!isRootCorrect) {
                     patternGroup.classList.add('incorrect-flash');
                     activeWordEl.classList.add('incorrect-flash'); 
                     
                     if (draggedRootElement) {
                         draggedRootElement.style.animation = "shake 0.5s";
                         setTimeout(() => { draggedRootElement.style.animation = ""; }, 500);
                     }
                     
                     setTimeout(() => { 
                         patternGroup.classList.remove('incorrect-flash'); 
                         activeWordEl.classList.remove('incorrect-flash'); 
                     }, 500);

                     l2GlobalResult.textContent = 'Yanlış kök!';
                     
                     const correctRootEl = l2RootsSidebar.querySelector(`.l2-draggable-root[data-root-key="${correctRootKey}"]`);
                     const correctPatternEl = l2PatternsWrapper.querySelector(`.l2-pattern-group[data-pattern-id="${correctPatternId}"]`);
                     
                     if (correctRootEl) correctRootEl.classList.add('highlight-correct-root');
                     if (correctPatternEl) correctPatternEl.classList.add('highlight-correct-pattern');
                     
                     setTimeout(() => {
                         if (correctRootEl) correctRootEl.classList.remove('highlight-correct-root');
                         if (correctPatternEl) correctPatternEl.classList.remove('highlight-correct-pattern');
                         l2GlobalResult.textContent = ""; 
                     }, 800); 
                 }
             }
        }
        
            function endGame(isTimeOut) {
            // 1. Oyunu ve zamanlayıcıyı durdur
            gameState.isGameActive = false;
            stopTimer();

            // 2. İstatistikleri hesapla
            const totalWords = gameState.totalWords;
            const correctCount = currentWordQueue.filter(w => w.found).length;
            
            // Hatalı kelimeleri bul (failed olarak işaretlenmişler)
            const failedWords = currentWordQueue.filter(w => w.failed);
            const failedCount = failedWords.length;
            
            const finalScore = score;

            // 3. Sonuç HTML'ini oluştur
            let resultsHTML = '';
            
            if (isTimeOut) {
                resultsHTML += `<h2>Süre Doldu! ⌛</h2>`;
            } else {
                resultsHTML += `<h2>Tur Tamamlandı! 🎉</h2>`;
            }

            // Puan ve Özet
            resultsHTML += `<p class="final-score">Puan: <span id="final-score-value">${finalScore}</span></p>`;
            resultsHTML += `<div style="display:flex; justify-content:center; gap:20px;">
                                <p style="color: var(--success-color); font-weight: bold;">Doğru: ${correctCount}</p>
                                <p style="color: var(--error-color); font-weight: bold;">Hata: ${failedCount}</p>
                            </div>`;

            // Yıldız Mantığı
            let starHTML = '⭐'; 
            const percentage = totalWords > 0 ? (correctCount / totalWords) * 100 : 0;
            try{ if(window.KidefGorev && KidefGorev.aktif) KidefGorev.bildir({dogru: correctCount, toplam: totalWords, zorluk: gameState.difficulty || null, mod: '1p', detay: (typeof IS_MOBILE_DEVICE !== 'undefined' && IS_MOBILE_DEVICE) ? 'cihaz:mobil' : 'cihaz:masaustu', sureSn: Math.max(0, Math.round((gameState.timeLimit || 0) - Math.max(0, timeLeft)))}); }catch(e){}

            if (percentage >= 99) starHTML = '⭐⭐⭐';
            else if (percentage >= 60) starHTML = '⭐⭐';
            
            if (correctCount === 0) starHTML = isTimeOut ? '😔' : '🤔';
            
            resultsHTML += `<p class="result-stars">${starHTML}</p>`;

            // --- YENİ EKLENEN KISIM: Hatalı Kelimeler Listesi ---
            if (failedWords.length > 0) {
                resultsHTML += `<div class="mistakes-wrapper">
                                    <div class="mistakes-title">⚠️ Cevap Anahtarı</div>`;
                
                failedWords.forEach(word => {
                    // Kökü düzgün göster (dizi ise birleştir, değilse direkt yaz)
                    const rootDisplay = Array.isArray(word.rootDisplay) ? word.rootDisplay.join('') : (word.rootDisplay || word.rootKey);
                    
                    resultsHTML += `
                        <div class="mistake-item">
                            <div class="mistake-info">
                                <span class="m-turkce">${word.turkce}</span>
                                <span class="m-details">Doğru Kök: <b>${rootDisplay}</b></span>
                                <span class="m-details">Doğru Kalıp: <b>${word.kalipNo}</b></span>
                            </div>
                            <span class="m-arapca">${word.arapca}</span>
                        </div>`;
                });
                
                resultsHTML += `</div>`;
            }
            // --- YENİ KISIM BİTİŞİ ---

            // 4. HTML'i ekrana bas
            resultsDetails.innerHTML = resultsHTML;

            // 5. Sonuç ekranını göster
            showScreen('results');

            // 6. Animasyon
            const scoreValueEl = document.getElementById('final-score-value');
            if (scoreValueEl) {
                scoreValueEl.style.animation = 'final-score-pop 0.5s ease-out';
                scoreValueEl.addEventListener('animationend', () => {
                    scoreValueEl.style.animation = '';
                }, { once: true });
            }
            
            playGenericSound('set_complete');
        }

        // --- Ekran ve Buton Yöneticileri ---
        function showScreen(screenName) {
            startScreen.classList.add('hidden'); 
            resultsScreen.classList.add('hidden'); 
            level2Container.classList.add('hidden'); 
            countdownOverlay.classList.add('hidden'); 

            if (screenName === 'start') { 
                startScreen.classList.remove('hidden'); 
            } 
            else if (screenName === 'results') { 
                resultsScreen.classList.remove('hidden'); 
            } 
            else if (screenName === 'level2') { 
                level2Container.classList.remove('hidden'); 
            }
            else if (screenName === 'countdown') { 
                level2Container.classList.remove('hidden'); 
                countdownOverlay.classList.remove('hidden'); 
            }
        }
        
        // *** GÜNCELLENDİ: Seviye Seçim Butonları (Mobil/Masaüstü Puanlama) ***
        startButtons.forEach(button => {
            button.addEventListener('click', () => { 
                const difficulty = button.dataset.difficulty;
                gameState.difficulty = difficulty;
                
                IS_MOBILE_DEVICE = isMobile(); // YENİ: Tespiti buraya taşıdık (Test için önemli)

                if (IS_MOBILE_DEVICE) {
                    // --- MOBİL AYARLARI (Yeni Puanlama) ---
                    gameState.totalWords = 3; 
                    
                    // YENİ: Puanları gameState'e ata (Maks 100 Puan için)
                    gameState.pointsPerWord = 25; // Temel puan
                    gameState.bonusPoints = 8;     // Bonus puan
                    gameState.finalWordBonus = 1;  // YENİ: Son kelimeye +1 puan
                    // Toplam: (25+8)*2 + (25+8+1) = 33 + 33 + 34 = 100 Puan
                    
                    if (difficulty === 'easy') {
                        gameState.timeLimit = 60; // 1 dakika
                        gameState.bonusTimeLimit = 10; // 10sn bonus/kelime
} else if (difficulty === 'medium') {
                        gameState.timeLimit = 40; // 40 saniye
                        gameState.bonusTimeLimit = 7; // 7sn bonus/kelime
                    } else if (difficulty === 'hard') {
                        gameState.timeLimit = 20; // 20 saniye
                        gameState.bonusTimeLimit = 5; // 5sn bonus/kelime
                    }
                    
                } else {
                    // --- MASAÜSTÜ AYARLARI (Eski Puanlama) ---
                    if (difficulty === 'easy') {
                        gameState.totalWords = 5;
                        gameState.timeLimit = 120; // 2 dakika (İSTEĞİNİZ)
                        } else if (difficulty === 'medium') {
                        gameState.totalWords = 10;
                        gameState.timeLimit = 120; // 2 dakika (Orijinal)
                    } else if (difficulty === 'hard') {
                        gameState.totalWords = 10;
                        gameState.timeLimit = 60; // 1 dakika (Orijinal)
                    }
                    
                    // Puanı kelime sayısına göre ayarla (Maks 100)
                    gameState.pointsPerWord = Math.round(100 / gameState.totalWords);
                    gameState.bonusPoints = 0; // Masaüstünde bonus puan yok
                    gameState.finalWordBonus = 0; // YENİ: Masaüstü için sıfırla
                    gameState.bonusTimeLimit = 0; // Masaüstünde bonus sistemi yok
                }
                

                if (audioContext.state === 'suspended') {
                    audioContext.resume().then(() => {
                        playGenericSound('touch'); 
                        startCountdown(); 
                    });
                } else {
                    playGenericSound('touch'); 
                    startCountdown(); 
                }
            });
        });
        
        // "Seviyeler" Butonu
        playAgainButton.addEventListener('click', () => { 
            playGenericSound('touch'); 
            showScreen('start'); 
        });
        
        // YENİ EKLENDİ: "Sonraki Tur" Butonu
        nextRoundButton.addEventListener('click', () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    playGenericSound('touch');
                    startCountdown(); // Oyunu yeniden başlat (mevcut ayarlarla)
                });
            } else {
                playGenericSound('touch');
                startCountdown(); // Oyunu yeniden başlat (mevcut ayarlarla)
            }
        });


        // Oyun İçi Geri Butonu
        gameBackButton.addEventListener('click', () => {
            playGenericSound('touch');
            gameState.isGameActive = false; 
            stopTimer(); 
            showScreen('start'); 
        });
        
        // YENİ: Başlangıç Ekranı Geri Butonu (Belirtilen sayfaya döner)
        startBackButton.addEventListener('click', () => {
            playGenericSound('touch');
            
            // LÜTFEN "index.html" kısmını,
            // dönmek istediğiniz sayfanın adıyla (örn: "menu.html") değiştirin.
            kidefGeriDon(); 
        });

        // Oyunu başlat
        initializeGame();
    });