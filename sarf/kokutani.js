document.addEventListener('DOMContentLoaded', () => {
        
        // --- VERİ SETLERİ ---
       const embeddedGameData = {
          "tr": {
            "h-k-m": { "root": ["h", "k", "m"], "words": [ { "text": "Hâkim 🧑‍⚖️" }, { "text": "Hekîm 👨‍⚕️" }, { "text": "Mahkum ⛓️" }, { "text": "Hakem ⚽" }, { "text": "Hüküm 📜" } ] },
            "a-r-f": { "root": ["a", "r", "f"], "words": [ { "text": "İrfan 💡" }, { "text": "Arif 🧠" }, { "text": "Tarif 📝" } ] },
            "i-l-m": { "root": ["i", "l", "m"], "words": [ { "text": "Âlim 🎓" }, { "text": "Talim 🧑‍🏫" }, { "text": "Muallim 👨‍🏫" }, { "text": "İlim 🧠"}, { "text": "Malum 📌"} ] },
            "r-h-m": { "root": ["r", "h", "m"], "words": [ { "text": "Rahîm 💖" }, { "text": "Merhum 🪦" }, { "text": "İstirham 🙏" } ] },
            "h-f-z": { "root": ["h", "f", "z"], "words": [ { "text": "Hâfız 📖" }, { "text": "Muhafaza 🛡️" }, { "text": "Muhafız 💂" } ] },
            "k-t-b": { "root": ["k", "t", "b"], "words": [ { "text": "Kitap 📚" }, { "text": "Mektup ✉️" }, { "text": "Kâtip ✍️" }, { "text": "Kitabe 📜" }, { "text": "Mektep 🏫 / 🖥️" } ] },
            "n-z-r": { "root": ["n", "z", "r"], "words": [ { "text": "Nazar 👀" }, { "text": "Münazara 🗣️" }, { "text": "İntizar ⏳" }, { "text": "Manzara 🏞️"}, { "text": "Nâzır 🧐"} ] },
            "m-k-n": { "root": ["m", "k", "n"], "words": [ { "text": "İmkân ✨" }, { "text": "Mümkün ✅" }, { "text": "Temkin 🧐" } ] },
            "h-s-n": { "root": ["h", "s", "n"], "words": [ { "text": "Hasan 😊" }, { "text": "Hüseyin 🧒" }, { "text": "Ahsen 🌟" }, { "text": "İhsan ❤️" }, { "text": "Tahsin 👍" } ] },
            "c-h-l": { "root": ["c", "h", "l"], "words": [ { "text": "Câhil 🤷" }, { "text": "Câhiliye 🏺" }, { "text": "Meçhul ❓" }, { "text": "Cühela 👥" } ] },
            "v-c-d": { "root": ["v", "c", "d"], "words": [ { "text": "Vücud 🧘" }, { "text": "Vicdan 💖" }, { "text": "Mevcud 📍" }, { "text": "İcad 💡" }, { "text": "Mucid 👨‍🔬" } ] },
            "s-k-n": { "root": ["s", "k", "n"], "words": [ { "text": "Sakin 🏠" }, { "text": "Meskûn 🏘️" }, { "text": "Mesken 🏡" }, { "text": "İskân 🏗️" }, { "text": "Teskin 😌" } ] },
            "c-h-d": { "root": ["c", "h", "d"], "words": [ { "text": "Câhit 💪" }, { "text": "Cihât ⚔️" }, { "text": "Mücâhit 🛡️" }, { "text": "İçtihât ⚖️" }, { "text": "Müçtehid 👨‍⚖️" } ] },
            "s-l-m": { "root": ["s", "l", "m"], "words": [ { "text": "Selam 🕊️" }, { "text": "Selamet 🛡️" }, { "text": "Salim ✅" }, { "text": "İslam ☪️" }, { "text": "Teslim 🤝" } ] },
            "k-r-b": { "root": ["k", "r", "b"], "words": [ { "text": "Kurban 🐑" }, { "text": "Akreb ➡️" }, { "text": "Takriben 📐" } ] },
            "n-z-m": { "root": ["n", "z", "m"], "words": [ { "text": "Nazım 📜" }, { "text": "Nizam ⚖️" }, { "text": "Nâzım ✍️" }, { "text": "Tanzim 🗂️" }, { "text": "İntizam 📏" } ] },
            "d-h-l": { "root": ["d", "h", "l"], "words": [ { "text": "Dâhil ➡️" }, { "text": "Dâhiliye 🏥" }, { "text": "İthal 📥" }, { "text": "Müdahale ✋" } ] },
            "ş-r-b": { "root": ["ş", "r", "b"], "words": [ { "text": "Şerbet 🍹" }, { "text": "Şarâp 🍷" }, { "text": "Meşrubat 🥤" }, { "text": "Meşreb 🌿" } ] },
            "r-c-a": { "root": ["r", "c", "a"], "words": [ { "text": "Merci ↩️" }, { "text": "Müracaat 📝" }, { "text": "İrtica 🔙" } ] },
            "ş-k-l": { "root": ["ş", "k", "l"], "words": [ { "text": "Şekl 🧩" }, { "text": "Eşkal 🔶" }, { "text": "Müşkil 🤔" }, { "text": "Teşkil 🧬" } ] },
            "n-s-b": { "root": ["n", "s", "b"], "words": [ { "text": "Neseb 👨‍👩‍👧‍👦" }, { "text": "Nisbet 📊" }, { "text": "Mensub 🔗" }, { "text": "Münasebet 🎉" }, { "text": "İntisab 🖇️" } ] },
            "ş-h-d": { "root": ["ş", "h", "d"], "words": [ { "text": "Şehadet 📜" }, { "text": "Şâhit 👀" }, { "text": "Şehît 🌺" }, { "text": "Şüheda 🌷" }, { "text": "Müşahede 🔬" } ] },
            "b-r-k": { "root": ["b", "r", "k"], "words": [ { "text": "Bereket 🌾" }, { "text": "Tebrik 🎉" }, { "text": "Mübarek ✨" }, { "text": "Teberrük 🙏" } ] },
            "k-d-r": { "root": ["k", "d", "r"], "words": [ { "text": "Miktâr 📏" }, { "text": "Kader 🌌" }, { "text": "Takdir 👍" }, { "text": "Kudret 💪" }, { "text": "İktidar 🏛️" }, { "text": "Kâdir ⚡" } ] },
            "m-l-k": { "root": ["m", "l", "k"], "words": [ { "text": "Melek 😇" }, { "text": "Mülk 👑" }, { "text": "Malik 🔑" }, { "text": "Memleket 🇹🇷" } ] },
            "r-s-l": { "root": ["r", "s", "l"], "words": [ { "text": "Risale 📜" }, { "text": "Resul 🗣️" }, { "text": "İrsaliye 🧾" }, { "text": "Mürsel 📨" } ] },
            "n-s-r": { "root": ["n", "s", "r"], "words": [ { "text": "Nasr 🏆" }, { "text": "Nusret ✌️" }, { "text": "Nasır 🛡️" }, { "text": "Mansur 🥇" } ] },
            "h-m-l": { "root": ["h", "m", "l"], "words": [ { "text": "Hamle ♟️" }, { "text": "Hamile 🤰" }, { "text": "Hammal 🎒" }, { "text": "İhtimal 🎲" }, { "text": "Tahammül 🏋️" } ] },
            "h-k-k": { "root": ["h", "k", "k"], "words": [ { "text": "Hak ⚖️" }, { "text": "Hukuk 🏛️" }, { "text": "Hakikat 💎" }, { "text": "Tahkik 🕵️" } ] },
            "h-l-s": { "root": ["h", "l", "s"], "words": [ { "text": "Hâlis 💧" }, { "text": "İhlas 💖" }, { "text": "Muhlis 😊" } ] },
            "k-m-l": { "root": ["k", "m", "l"], "words": [ { "text": "Kemâl ✨" }, { "text": "Kâmil 🌟" }, { "text": "İkmal 🏁" }, { "text": "Mükemmel 💯" } ] },
            "r-ş-d": { "root": ["r", "ş", "d"], "words": [ { "text": "Reşît 🧠" }, { "text": "İrşad 🧭" }, { "text": "Mürşit 🧑‍🏫" }, { "text": "Râşit 🚶" } ] },
            "e-m-n": { "root": ["e", "m", "n"], "words": [ { "text": "Eman 🛡️" }, { "text": "Emin 🔒" }, { "text": "İman 💖" }, { "text": "Mümin 🙏" }, { "text": "Temin 🤝" } ] },
            "c-m-a": { "root": ["c", "m", "a"], "words": [ { "text": "Cem 👥" }, { "text": "Cemiyet 🏛️" }, { "text": "Cemaat 👨‍👩‍👧‍👦" }, { "text": "Cami 🕌" }, { "text": "İçtima 🤝" } ] },
            "h-m-d": { "root": ["h", "m", "d"], "words": [ { "text": "Hamd 🙏" }, { "text": "Ahmet 🌟" }, { "text": "Hamît 😊" }, { "text": "Mahmut ✨" }, { "text": "Muhammet 💖" } ] },
            "ş-h-r": { "root": ["ş", "h", "r"], "words": [ { "text": "Şehir 📅" }, { "text": "Şöhret 🌟" }, { "text": "Meşhur 🤩" }, { "text": "Teşhir 🎨" } ] },
            "ş-k-r": { "root": ["ş", "k", "r"], "words": [ { "text": "Şükür 🙏" }, { "text": "Şükran 💖" }, { "text": "Şakir 😊" }, { "text": "Teşekkür 🙌" } ] },
            "f-k-r": { "root": ["f", "k", "r"], "words": [ { "text": "Fikir 🧠" }, { "text": "Tefekkür 🤔" }, { "text": "Mütefekkir 🧘" } ] },
            "v-k-l": { "root": ["v", "k", "l"], "words": [ { "text": "Vekalet 📜" }, { "text": "Vekil 🧑‍💼" }, { "text": "Müvekkil 👤" }, { "text": "Tevekkül 🤲" } ] },
            "k-b-r": { "root": ["k", "b", "r"], "words": [ { "text": "Kibir 😤" }, { "text": "Ekber ⬆️" }, { "text": "Kübra 🌟" }, { "text": "Tekbir ☝️" } ] },
            "a-c-z": { "root": ["a", "c", "z"], "words": [ { "text": "Âciz 😩" }, { "text": "Aceze 👥" }, { "text": "Mucize ✨" }, { "text": "Taciz 🚫" } ] },
            "h-r-m": { "root": ["h", "r", "m"], "words": [ { "text": "İhram 🕋" }, { "text": "Harem 🕌" }, { "text": "Muharrem 🌙" }, { "text": "İhtiram 🫡" } ] },
            "s-a-l": { "root": ["s", "a", "l"], "words": [ { "text": "Sual ❓" }, { "text": "Mesul 👮" }, { "text": "Mesele ❔" } ] }
          },
          "ar": {
           
"ح-ك-م": { "root": ["ح", "ك", "م"], "words": [ { "text": "حَاكِم 🧑‍⚖️" }, { "text": "حَكِيم 👨‍⚕️" }, { "text": "مَحْكُوم ⛓️" }, { "text": "حَكَم ⚽" }, { "text": "حُكْم 📜" } ] },
            "ع-ر-ف": { "root": ["ع", "ر", "ف"], "words": [ { "text": "عِرْفَان 💡" }, { "text": "عَارِف 🧠" }, { "text": "تَعْرِيف 📝" } ] },
            "ع-ل-م": { "root": ["ع", "ل", "م"], "words": [ { "text": "عَالِم 🎓" }, { "text": "تَعْلِيم 🧑‍🏫" }, { "text": "مُعَلِّم 👨‍🏫" }, { "text": "عِلْم 🧠"}, { "text": "مَعْلُوم 📌"} 
] },
            "ر-ح-م": { "root": ["ر", "ح", "م"], "words": [ { "text": "رَحِيم 💖" }, { "text": "مَرْحُوم 🪦" }, { "text": "اِسْتِرْحَام 🙏" } ] },
            "ح-ف-ظ": { "root": ["ح", "ف", "ظ"], "words": [ { "text": "حَافِظ 📖" }, { "text": "مُحَافَظَة 🛡️" }, { "text": "مُحَافِظ 💂" } ] },
            "ك-ت-ب": { "root": ["ك", "ت", "ب"], "words": [ { "text": "كِتَاب 📚" }, { "text": "مَكْتُوب ✉️" }, { "text": "كَاتِب ✍️" }, { 
"text": "كِتَابَة 📜" }, { "text": "مَكْتَب 🏫 / 🖥️" } ] },
            "ن-ظ-ر": { "root": ["ن", "ظ", "ر"], "words": [ { "text": "نَظَر 👀" }, { "text": "مُنَاظَرَة 🗣️" }, { "text": "اِنْتِظَار ⏳" }, { "text": "مَنْظَر 🏞️"}, { "text": "نَاظِر 🧐"} ] },
            "م-ك-ن": { "root": ["م", "ك", "ن"], "words": [ { "text": "إِمْكَان ✨" }, { "text": "مُمْكِن ✅" }, { "text": "تَمْكِين 🧐" } ] },
            "ح-س-ن": { "root": ["ح", "س", "ن"], "words": [ 
{ "text": "حَسَن 😊" }, { "text": "حُسَيْن 🧒" }, { "text": "أَحْسَن 🌟" }, { "text": "إِحْسَان ❤️" }, { "text": "تَحْسِين 👍" } ] },
            "ج-ه-ل": { "root": ["ج", "ه", "ل"], "words": [ { "text": "جَاهِل 🤷" }, { "text": "جَاهِلِيَّة 🏺" }, { "text": "مَجْهُول ❓" }, { "text": "جُهَلَاء 👥" } ] },
            "و-ج-د": { "root": ["و", "ج", "د"], "words": [ { "text": "وُجُود 🧘" }, { "text": "وِجْدَان 💖" }, { "text": "مَوْجُود 📍" }, { "text": "إِيجَاد 💡" }, { "text": "مُوجِد 👨‍🔬" } ] },
 
           "س-ك-ن": { "root": ["س", "ك", "ن"], "words": [ { "text": "سَاكِن 🏠" }, { "text": "مَسْكُون 🏘️" }, { "text": "مَسْكَن 🏡" }, { "text": "إِسْكَان 🏗️" }, { "text": "تَسْكِين 😌" } ] },
            "ج-ه-د": { "root": ["ج", "ه", "د"], "words": [ { "text": "جَاهِد 💪" }, { "text": "جِهَاد ⚔️" }, { "text": "مُجَاهِد 🛡️" }, { "text": "اِجْتِهَاد ⚖️" }, { "text": "مُجْتَهِد 👨‍⚖️" } ] },
            "س-ل-م": { "root": ["س", "ل", "م"], "words": 
[ { "text": "سَلَام 🕊️" }, { "text": "سَلَامَة 🛡️" }, { "text": "سَالِم ✅" }, { "text": "إِسْلَام ☪️" }, { "text": "تَسْلِيم 🤝" } ] },
            "ق-ر-ب": { "root": ["ق", "ر", "ب"], "words": [ { "text": "قُرْبَان 🐑" }, { "text": "أَقْرَب ➡️" }, { "text": "تَقْرِيبًا 📐" } ] },
            "ن-ظ-م": { "root": ["ن", "ظ", "م"], "words": [ { "text": "نَظْم 📜" }, { "text": "نِظَام ⚖️" }, { "text": "نَاظِم ✍️" }, { "text": "تَنْظِيم 🗂️" }, { "text": "اِنْتِظَام 📏" } ] },
    
        "د-خ-ل": { "root": ["د", "خ", "ل"], "words": [ { "text": "دَاخِل ➡️" }, { "text": "دَاخِلِيَّة 🏥" }, { "text": "إِدْخَال 📥" }, { "text": "مُدَاخَلَة ✋" } ] },
            "ش-ر-ب": { "root": ["ش", "ر", "ب"], "words": [ { "text": "شَرْبَة 🍹" }, { "text": "شَرَاب 🍷" }, { "text": "مَشْرُوبَات 🥤" }, { "text": "مَشْرَب 🌿" } ] },
            "ر-ج-ع": { "root": ["ر", "ج", "ع"], "words": [ { "text": "مَرْجِع ↩️" }, { "text": "مُرَاجَعَة 📝" }, { "text": 
"اِرْتِجَاع 🔙" } ] },
            "ش-ك-ل": { "root": ["ش", "ك", "ل"], "words": [ { "text": "شَكْل 🧩" }, { "text": "أَشْكَال 🔶" }, { "text": "مُشْكِل 🤔" }, { "text": "تَشْكِيل 🧬" } ] },
            "ن-س-ب": { "root": ["ن", "س", "ب"], "words": [ { "text": "نَسَب 👨‍👩‍👧‍👦" }, { "text": "نِسْبَة 📊" }, { "text": "مَنْسُوب 🔗" }, { "text": "مُنَاسَبَة 🎉" }, { "text": "اِنْتِسَاب 🖇️" } ] },
            "ش-ه-د": { "root": ["ش", "ه", "د"], "words": 
[ { "text": "شَهَادَة 📜" }, { "text": "شَاهِد 👀" }, { "text": "شَهِيد 🌺" }, { "text": "شُهَدَاء 🌷" }, { "text": "مُشَاهَدَة 🔬" } ] },
            "ب-ر-ك": { "root": ["ب", "ر", "ك"], "words": [ { "text": "بَرَكَة 🌾" }, { "text": "تَبْرِيك 🎉" }, { "text": "مُبَارَك ✨" }, { "text": "تَبَرُّك 🙏" } ] },
            "ق-د-ر": { "root": ["ق", "د", "ر"], "words": [ { "text": "مِقْدَار 📏" }, { "text": "قَدَر 🌌" }, { "text": "تَقْدِير 👍" }, { "text": "قُدْرَة 💪" }, { "text": "اِقْتِدَار 🏛️" }, { 
"text": "قَدَر ⚡" } ] },
            "م-ل-ك": { "root": ["م", "ل", "ك"], "words": [ { "text": "مَلَك 😇" }, { "text": "مُلْك 👑" }, { "text": "مَالِك 🔑" }, { "text": "مَمْلَكَة 🇹🇷" } ] },
            "ر-س-ل": { "root": ["ر", "س", "ل"], "words": [ { "text": "رِسَالَة 📜" }, { "text": "رَسُول 🗣️" }, { "text": "إِرْسَالِيَّة 🧾" }, { "text": "مُرْسَل 📨" } ] },
            "ن-ص-ر": { "root": ["ن", "ص", "ر"], "words": [ { 
"text": "نَصْر 🏆" }, { "text": "نُصْرَة ✌️" }, { "text": "نَاصِر 🛡️" }, { "text": "مَنْصُور 🥇" } ] },
            "ح-م-ل": { "root": ["ح", "م", "ل"], "words": [ { "text": "حَمْلَة ♟️" }, { "text": "حَامِلَة 🤰" }, { "text": "حَمَّال 🎒" }, { "text": "اِحْتِمَال 🎲" }, { "text": "تَحَمُّل 🏋️" } ] },
            "ح-ق-ق": { "root": ["ح", "ق", "ق"], "words": [ { "text": "حَقّ ⚖️" }, { "text": "حُقُوق 🏛️" }, { "text": "حَقِيقة 💎" }, { "text": "تَحْقِيق 🕵️" } ] },
       
     "خ-ل-ص": { "root": ["خ", "ل", "ص"], "words": [ { "text": "خَالِص 💧" }, { "text": "إِخْلَاص 💖" }, { "text": "مُخْلِص 😊" } ] },
            "ك-م-ل": { "root": ["ك", "م", "ل"], "words": [ { "text": "كَمَال ✨" }, { "text": "كَامِل 🌟" }, { "text": "إِكْمَال 🏁" }, { "text": "مُكَمَّل 💯" } ] },
            "ر-ش-د": { "root": ["ر", "ش", "د"], "words": [ { "text": "رَشِيد 🧠" }, { "text": "إِرْشَاد 🧭" }, { "text": "مُرْشِد 🧑‍🏫" }, { "text": "رَاشِد 🚶" } ] 
},
            "أ-م-ن": { "root": ["أ", "م", "ن"], "words": [ { "text": "أَمَان 🛡️" }, { "text": "أَمِين 🔒" }, { "text": "إِيمَان 💖" }, { "text": "مُؤْمِن 🙏" }, { "text": "تَأْمِين 🤝" } ] },
            "ج-م-ع": { "root": ["ج", "م", "ع"], "words": [ { "text": "جَمْع 👥" }, { "text": "جَمْعِيَّة 🏛️" }, { "text": "جَمَاعة 👨‍👩‍👧‍👦" }, { "text": "جَامِعَة 🕌" }, { "text": "اِجْتِمَاع 🤝" } ] },
            "ح-م-د": { "root": ["ح", "م", "د"], 
"words": [ { "text": "حَمْد 🙏" }, { "text": "أَحْمَد 🌟" }, { "text": "حَمِيد 😊" }, { "text": "مَحْمُود ✨" }, { "text": "مُحَمَّد 💖" } ] },
            "ش-ه-ر": { "root": ["ش", "ه", "ر"], "words": [ { "text": "شَهْر 📅" }, { "text": "شُهْرَة 🌟" }, { "text": "مَشْهُور 🤩" }, { "text": "تَشْهِير 🎨" } ] },
            "ش-ك-ر": { "root": ["ش", "ك", "ر"], "words": [ { "text": "شُكْر 🙏" }, { "text": "شُكْرَان 💖" }, { "text": "شَاكِر 😊" }, { "text": "تَشَكُّر 🙌" } ] },
   
         "ف-ك-ر": { "root": ["ف", "ك", "ر"], "words": [ { "text": "فِكْر 🧠" }, { "text": "فِكْرَة 😂" }, { "text": "تَفَكُّر 🤔" }, { "text": "مُتَفَكِّر 🧘" } ] },
            "و-ك-ل": { "root": ["و", "ك", "ل"], "words": [ { "text": "وَكَالَة 📜" }, { "text": "وَكِيل 🧑‍💼" }, { "text": "مُوَكِّل 👤" }, { "text": "تَوَكُّل 🤲" } ] },
            "ك-ب-ر": { "root": ["ك", "ب", "ر"], "words": [ { "text": "كِبْر 😤" }, { "text": "أَكْبَر ⬆️" }, { 
"text": "كُبْرَى 🌟" }, { "text": "تَكْبِير ☝️" } ] },
            "ع-ج-ز": { "root": ["ع", "ج", "ز"], "words": [ { "text": "عَاجِز 😩" }, { "text": "عَجَz 👥" }, { "text": "مُعْجِزَة ✨" }, { "text": "تَعْجِيز 🚫" } ] },
            "ح-ر-م": { "root": ["ح", "ر", "م"], "words": [ { "text": "إِحْرَام 🕋" }, { "text": "حَرَم 🕌" }, { "text": "مُحَرَّم 🌙" }, { "text": "اِحْتِرَام 🫡" } ] },
            "س-أ-ل": { "root": ["س", "أ", "ل"], 
"words": [ { "text": "سُؤَال ❓" }, { "text": "مَسْؤُول 👮" }, { "text": "مَسْأَلَة ❔" } ] }

          }
        };
        
        const uiText = {
            startTitle: "Kelimenin Serüveni",
            startSubtitle: "Seviye 1: Kökü Tanı",
            donutFeedbackCorrect: "Doğru! 🎉",
            donutFeedbackIncorrect: "Bu kelime bu kökten değil, tekrar dene.",
            donutWinRound: "Harika! Bu kökün bütün kelimelerini buldun.",
            startLangP: "Oyun dilini seçin:",
            startModeP: "Oyun modunu seçin:",
            langBtnTR: "Türkçe",
            langBtnAR: "Arapça",
            modeBtn1P: "Tek Kişilik",
            modeBtn2P: "İki Kişilik",
            startButton: "Başla",

            donutInstruction: "Hangi kelimeler bu kökten türemiştir?",
            nextButton: "İlerle ▶",
            versusQuestionMatch: `<span style="color: var(--success-color);">✓</span> Hangisi {root} kökünden türemiştir?`,
            versusQuestionOddOne: `<span style="color: var(--error-color);">X</span> Hangisi {root} kökünden türememiştir?`,
            versusWaiting: "Oyuncular bekleniyor...",
            versusRoundEnd: "Tur Bitti!",
            versusScorePrefix: "⭐ ",
            resultsTitleDonut: "Kök Tanıma Bitti!",
            resultsTitleVersus: "Yarışma Bitti!",
            resultsWinText: "<p>Harika iş çıkardın!</p>",
            resultsTotalScore: "Toplam Puan: {score}",
            resultsTotalMistakes: "Toplam Hata: {mistakes}",
            resultsP1Won: "<p>🏆 Oyuncu 1 Kazandı! 🏆</p>",
            resultsP2Won: "<p>🏆 Oyuncu 2 Kazandı! 🏆</p>",
            resultsDraw: "<p>🤝 Berabere! 🤝</p>",
            resultsP1Score: "Oyuncu 1: {score} Puan",
            resultsP2Score: "Oyuncu 2: {score} Puan",
            resultsP1Stats: "(Doğru: {correct}, Hata: {mistakes})",
            resultsP2Stats: "(Doğru: {correct}, Hata: {mistakes})",
            playAgainButton: "Ana Menüye Dön",
            orientationTitle: "Lütfen Cihazı Dik Tutun",
            orientationP: "Bu oyun en iyi dikey modda çalışır."
        };

        // --- DOM Elementleri ---
        const body = document.body;
        const startScreen = document.getElementById('start-screen');
        const resultsScreen = document.getElementById('results-screen');
        const resultsTitle = document.getElementById('results-title');
        const resultsDetails = document.getElementById('results-details');
        const playAgainButton = document.getElementById('play-again-button');
        
        const langSelectGroup = document.getElementById('lang-select-group');
        const modeSelectGroup = document.getElementById('mode-select-group');
        const langSelectButtons = langSelectGroup.querySelectorAll('.selection-button');
        const modeSelectButtons = modeSelectGroup.querySelectorAll('.selection-button');
        const startGameButton = document.getElementById('start-game-button');
        const startGameButtonFill = document.getElementById('start-button-fill');
        const startGameButtonText = document.getElementById('start-button-text');
        
        const backButtonDonut = document.getElementById('back-button-donut');
        const backButtonVersus = document.getElementById('back-button-versus');
        
        const backButtonStart = document.getElementById('back-button-start');

        const level1DonutContainer = document.getElementById('level1-donut-container');
        const l1MainInstruction = document.getElementById('l1-main-instruction');
        const l1RootDisplayMobile = document.getElementById('l1-root-display-mobile');
        const l1ChoicesGrid = document.getElementById('l1-choices-grid');
        const l1FeedbackArea = document.getElementById('l1-feedback-area');
        const nextButton = document.getElementById('next-button'); 

        const level1VersusContainer = document.getElementById('level1-versus-container');
        const vsFeedbackArea = document.getElementById('vs-feedback-area');
        const versusProgressBarContainer = document.getElementById('versus-progress-bar-container');
        const playerElements = {
            p1: {
                root: document.getElementById('p1-root'),
                question: document.getElementById('p1-question'),
                options: document.getElementById('p1-options'),
                scoreDisplay: document.getElementById('p1-score-display'),
                animationContainer: document.getElementById('p1-score-animation-container')
            },
            p2: {
                root: document.getElementById('p2-root'),
                question: document.getElementById('p2-question'),
                options: document.getElementById('p2-options'),
                scoreDisplay: document.getElementById('p2-score-display'),
                animationContainer: document.getElementById('p2-score-animation-container')
            }
        };

        // --- Fonksiyonlar ---

        let allWordsFlat = [];
        let allRootKeys = [];
        let allRootKeysWithMin4 = [];
        
        function processEmbeddedData(lang) {
            allWordsFlat = [];
            
            const dataToProcess = embeddedGameData[lang];
            if (!dataToProcess) {
                console.error("Geçersiz dil verisi:", lang);
                return;
            }
            
            allRootKeys = Object.keys(dataToProcess);
            allRootKeysWithMin4 = []; 
            
            allRootKeys.forEach(rootKey => {
                const rootData = dataToProcess[rootKey];
                if (rootData.words && rootData.words.length > 0) {
                    rootData.words.forEach(word => {
                        allWordsFlat.push({
                            root: rootKey,
                            text: word.text 
                        });
                    });
                    if (rootData.words.length >= 4) {
                        allRootKeysWithMin4.push(rootKey);
                    }
                }
            });
        }

        function shuffle(array) {
            let currentIndex = array.length, randomIndex;
            while (currentIndex != 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]];
            }
            return array;
        }

        let level1GameData_generated = [];
        
        // GÜNCELLENDİ: "Bazen açılmıyor" hatasını düzelten kod
        function generateDonutGameData(numRounds) {
            const rounds = [];
            // DÜZELTME: Artık 4 kelime kuralı olmayan tüm kökleri kullanabiliriz (çünkü 10'a tamamlıyoruz)
            const availableRoots = shuffle([...allRootKeys]);
            
            for (let i = 0; i < numRounds && i < availableRoots.length; i++) {
                const rootKey = availableRoots[i];
                const rootData = embeddedGameData[gameState.currentLang][rootKey];
                
                // Hiç kelimesi yoksa bu turu atla (güvenlik)
                if (!rootData.words || rootData.words.length === 0) continue;

                const rootWords = rootData.words.map(w => ({ text: w.text, isCorrect: true }));
                
                // 1. En fazla 5 doğru kelime al
                const correctWords = shuffle(rootWords).slice(0, 5);
                
                // 2. DÜZELTME: Toplam 10 kelimeye tamamlamak için gereken YANLIŞ kelime sayısını hesapla
                const incorrectNeeded = 10 - correctWords.length; // Örn: 10 - 3 = 7
                
                const incorrectWords = [];
                const otherWords = shuffle([...allWordsFlat]);
                
                // 3. DÜZELTME: '5' yerine 'incorrectNeeded' sayısını kullan
                while (incorrectWords.length < incorrectNeeded && otherWords.length > 0) {
                    const randomWord = otherWords.pop();
                    if (randomWord.root !== rootKey) {
                        incorrectWords.push({ text: randomWord.text, isCorrect: false });
                    }
                }

                let displayRootValue = rootKey;
                if (gameState.currentLang === 'ar') {
                    displayRootValue = rootKey.replace(/-/g, ' '); 
                }
                
                rounds.push({
                    root: rootKey,
                    displayRoot: displayRootValue,
                    words: shuffle([...correctWords, ...incorrectWords])
                });
            }
            return rounds;
        }
        
        let level1VersusData_generated = [];
       function generateVersusGameData(numTotalRounds) {
            const questions = [];
            const numRoundsPerType = numTotalRounds;
            
            const findMatchRoots = shuffle([...allRootKeys]);
            const oddOneOutRoots = shuffle([...allRootKeysWithMin4]);

            for (let i = 0; i < numRoundsPerType && i < findMatchRoots.length; i++) {
                const rootKey = findMatchRoots[i];
                if (!rootKey) continue; 
                const rootData = embeddedGameData[gameState.currentLang][rootKey];
                if (!rootData || !rootData.words || rootData.words.length === 0) continue;
                
                const correctWord = shuffle(rootData.words)[0];
                const options = [{ text: correctWord.text, isCorrect: true }];
                
                const otherWords = shuffle([...allWordsFlat]);
                while (options.length < 5 && otherWords.length > 0) {
                    const randomWord = otherWords.pop();
                    if (randomWord.root !== rootKey) {
                        options.push({ text: randomWord.text, isCorrect: false });
                    }
                }
                
                let displayRootValue = rootKey;
                if (gameState.currentLang === 'ar') {
                    displayRootValue = rootKey.replace(/-/g, ' ');
                }

                let questionText = "";
                if (gameState.currentLang === 'ar') {
                    questionText = `<span style="color: var(--success-color);">✓</span> أي واحدة من <span class="arabic-root-highlight">{root}</span>؟`.replace('{root}', displayRootValue);
                } else {
                    questionText = uiText.versusQuestionMatch.replace('{root}', displayRootValue);
                }
                
                questions.push({
                    root: rootKey,
                    displayRoot: displayRootValue,
                    type: "find_match",
                    question: questionText,
                    options: shuffle(options)
                });
            }
            
            for (let i = 0; i < numRoundsPerType && i < oddOneOutRoots.length; i++) {
                const rootKey = oddOneOutRoots[i];
                if (!rootKey) continue;
                const rootData = embeddedGameData[gameState.currentLang][rootKey];
                if (!rootData) continue;
                
                const correctOptions = shuffle(rootData.words).slice(0, 4).map(w => ({ text: w.text, isCorrect: false }));
                
                let incorrectWord = null;
                const otherWords = shuffle([...allWordsFlat]);
                while (incorrectWord === null && otherWords.length > 0) {
                    const randomWord = otherWords.pop();
                    if (randomWord.root !== rootKey) {
                        incorrectWord = { text: randomWord.text, isCorrect: true };
                    }
                }
                if (incorrectWord === null) {
                    console.warn("Odd one out için yanlış kelime bulunamadı.");
                    continue; 
                };
                
                const options = [...correctOptions, incorrectWord];
                
                let displayRootValue = rootKey;
                if (gameState.currentLang === 'ar') {
                    displayRootValue = rootKey.replace(/-/g, ' ');
                }

                let questionTextOddOne = "";
                if (gameState.currentLang === 'ar') {
                    questionTextOddOne = `<span style="color: var(--error-color);">X</span> أي واحدة ليست من <span class="arabic-root-highlight">{root}</span>؟`.replace('{root}', displayRootValue);
                } else {
                    questionTextOddOne = uiText.versusQuestionOddOne.replace('{root}', displayRootValue);
                }
                
                questions.push({
                    root: rootKey,
                    displayRoot: displayRootValue,
                    type: "odd_one_out",
                    question: questionTextOddOne,
                    options: shuffle(options)
                });
            }
            
            return shuffle(questions);
        }

        // --- Ana Kod Başlangıcı ---

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        async function playGenericSound(type) {
            if (!audioContext) { console.warn("AudioContext desteklenmiyor."); return; }
            if (audioContext.state === 'suspended') {
                try { await audioContext.resume(); } 
                catch (e) { console.error("AudioContext resume failed:", e); return; }
            }
            if (audioContext.state === 'running') {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode); gainNode.connect(audioContext.destination);
                let freq, vol, duration, waveType; waveType = 'sine';
                switch(type) {
                    case 'correct': freq = 523.25; vol = 0.7; duration = 0.15; waveType = 'triangle'; break;
                    case 'incorrect': freq = 164.81; vol = 0.6; duration = 0.3; waveType = 'square'; break;
                    case 'touch': freq = 220.00; vol = 0.5; duration = 0.05; waveType = 'sine'; break;
                    case 'win': freq = 659.25; vol = 0.8; duration = 0.4; waveType = 'triangle'; break;
                    case 'bonus': freq = 880.00; vol = 0.6; duration = 0.2; waveType = 'sine'; break;
                    default: return;
                }
                oscillator.type = waveType;
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                gainNode.gain.setValueAtTime(vol, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
                oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
            }
        }

        let gameState = {};

        function initializeGame() {
            
            gameState = {
                currentLang: 'tr', 
                selectedLang: null, 
                selectedMode: null, 
                currentGameMode: null,
                donutRoundIndex: 0,
                donutTotalRounds: 10, 
                donutCorrectNeeded: 5,
                donutCorrectFound: 0,
                donutTotalMistakes: 0,
                donutTotalScore: 0,
                
                versusRoundIndex: 0,
                versusTotalRounds: 10,
                versusQuestions: [],
                roundStartTime: 0,
                player1: { score: 0, correct: 0, mistakes: 0, hasAnswered: false, answerTime: 0, wasCorrect: false, clickedButton: null },
                player2: { score: 0, correct: 0, mistakes: 0, hasAnswered: false, answerTime: 0, wasCorrect: false, clickedButton: null }
            };
            
            body.className = 'lang-tr'; 
            localizeUI();
            
            langSelectButtons.forEach(btn => btn.classList.remove('selected'));
            modeSelectButtons.forEach(btn => btn.classList.remove('selected'));
            startGameButton.disabled = true;
            modeSelectGroup.classList.add('selection-group-disabled');
            
            startGameButton.classList.remove('is-loading');
            
            startGameButtonFill.style.transition = 'transform 0s'; 
            startGameButtonFill.style.transform = 'translateX(-100%)';

            showScreen('start');
        }
        
        function localizeUI() {
            document.getElementById('start-title').textContent = uiText.startTitle;
            document.getElementById('start-subtitle').textContent = uiText.startSubtitle;
            document.getElementById('start-p-lang').textContent = uiText.startLangP;
            document.getElementById('start-p-mode').textContent = uiText.startModeP;
            
            document.getElementById('lang-button-tr').textContent = uiText.langBtnTR;
            document.getElementById('lang-button-ar').textContent = uiText.langBtnAR;
            document.getElementById('mode-button-1p').textContent = uiText.modeBtn1P;
            document.getElementById('mode-button-2p').textContent = uiText.modeBtn2P;
            document.getElementById('start-button-text').textContent = uiText.startButton;

            backButtonDonut.textContent = '◀';
            backButtonVersus.textContent = '◀';
            
            // 'Geri' tuşu metnini ayarla
            backButtonStart.textContent = '◀';
            
            nextButton.textContent = uiText.nextButton;
            playAgainButton.textContent = uiText.playAgainButton;
            
            document.getElementById('orientation-title').textContent = uiText.orientationTitle;
            document.getElementById('orientation-p').textContent = uiText.orientationP;
        }

        // --- Oyun Akışı ---
        
        function checkStartButton() {
            if (gameState.selectedLang && gameState.selectedMode) {
                startGameButton.disabled = false;
                startGameButtonFill.style.transition = 'transform 0.2s ease'; 
                startGameButtonFill.style.transform = 'translateX(0%)';
            } else {
                startGameButton.disabled = true;
                startGameButtonFill.style.transition = 'transform 0s';
                startGameButtonFill.style.transform = 'translateX(-100%)';
            }
        }

        langSelectButtons.forEach(button => {
            button.addEventListener('click', () => { 
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
                
                const lang = button.dataset.lang;

                if (gameState.selectedLang === lang) {
                     playGenericSound('touch');
                     modeSelectGroup.classList.remove('selection-group-disabled');
                     return; 
                }
                
                gameState.selectedLang = lang;
                
                langSelectButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                playGenericSound('touch'); 
                langSelectGroup.classList.add('selection-group-disabled');
                modeSelectGroup.classList.add('selection-group-disabled');
                checkStartButton();
                
                setTimeout(() => {
                    processEmbeddedData(lang); 
                    langSelectGroup.classList.remove('selection-group-disabled');
                    modeSelectGroup.classList.remove('selection-group-disabled');
                }, 50);
            });
        });
        
        modeSelectButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }

                const mode = button.dataset.mode;
                gameState.selectedMode = mode;
                
                modeSelectButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                
                playGenericSound('touch'); 
                checkStartButton();
            });
        });

        // GÜNCELLENDİ: "Başla" butonu (Kasma hatası düzeltildi)
        startGameButton.addEventListener('click', () => {
            if (startGameButton.disabled) return;
            
            gameState.currentLang = gameState.selectedLang;
            body.className = 'lang-' + gameState.currentLang; 
            
            // processEmbeddedData(gameState.currentLang); // <-- SİLİNDİ
            
            playGenericSound('win');
            startGameMode(gameState.selectedMode); 
        });
        
        backButtonDonut.addEventListener('click', () => {
             playGenericSound('touch');
             initializeGame();
        });
        backButtonVersus.addEventListener('click', () => {
             playGenericSound('touch');
             initializeGame();
        });

        
        /* GERİ TUŞU (ana menü)
           Bu oyun İKİ yerden açılıyor: index'teki Oyunlar kategorisi ve
           kalıplar tablosunun oyun paneli. Geri tuşu HANGİSİNDEN gelindiyse
           oraya dönmeli.

           Her iki giriş de target="_blank" rel="opener" kullanıyor; yani
           bizi açan sekme window.opener'da duruyor. En doğrusu kendi
           sekmemizi kapatmak: tarayıcı odağı açan sekmeye geri verir,
           kullanıcı bıraktığı yerde devam eder. Tarayıcı kapatmaya izin
           vermezse (ya da sayfa aynı sekmede açıldıysa) referrer'a bakıp
           doğru sayfaya gidiyoruz. */
        function kokuGeriHedefi() {
            var ref = '';
            try { ref = (document.referrer || '').toLowerCase(); } catch (e) { ref = ''; }

            if (ref.indexOf('kaliplartablosumobil') !== -1) return 'kaliplartablosumobil.html';
            if (ref.indexOf('kaliplartablosu') !== -1) return 'kaliplartablosu.html';
            /* index'ten (Oyunlar kategorisi) gelinmişse ana sayfaya dön */
            if (/(^|\/)(index|indeks)\.html/.test(ref) || /kidefarapca\.com\/?($|[?#])/.test(ref)) return 'index.html';

            var mobil = (window.innerWidth || 0) <= 820 ||
                        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
            return mobil ? 'kaliplartablosumobil.html' : 'kaliplartablosu.html';
        }

        function kokuGeriDon() {
            var yeniSekme = false;
            try { yeniSekme = !!(window.opener && !window.opener.closed); } catch (e) { yeniSekme = false; }
            if (yeniSekme) {
                try { window.close(); } catch (e) {}
                setTimeout(function () {
                    if (!window.closed) window.location.href = kokuGeriHedefi();
                }, 250);
                return;
            }
            window.location.href = kokuGeriHedefi();
        }

        backButtonStart.addEventListener('click', () => {
            playGenericSound('touch');
            kokuGeriDon();
        });

        function startGameMode(mode) {
            gameState.currentGameMode = mode;
            gameState.basZaman = Date.now();   /* gercek oynanis suresi */

            if (mode === 'donut') {
                level1GameData_generated = generateDonutGameData(10);
                gameState.donutTotalRounds = level1GameData_generated.length;
                
                if (gameState.donutTotalRounds === 0) {
                    console.error("Donut modu için hiç veri üretilemedi.");
                    initializeGame();
                    return;
                }
                
                setupDonutRound(0);

            } else if (mode === 'versus') {
                level1VersusData_generated = generateVersusGameData(10);
                gameState.versusQuestions = level1VersusData_generated;
                gameState.versusTotalRounds = 10;
                 
                 let requiredQuestions = gameState.versusTotalRounds * 2;
                 if (level1VersusData_generated.length < requiredQuestions) {
                    console.warn("Versus modu için yetersiz veri üretildi. Gerekli: " + requiredQuestions + ", Bulunan: " + level1VersusData_generated.length);
                    gameState.versusTotalRounds = Math.floor(level1VersusData_generated.length / 2);
                 }

                 if (gameState.versusTotalRounds === 0) {
                    console.error("Versus modu için hiç veri üretilemedi.");
                    initializeGame();
                    return;
                 }
                
                const scoreText = uiText.versusScorePrefix + "0";
                playerElements.p1.scoreDisplay.textContent = scoreText;
                playerElements.p2.scoreDisplay.textContent = scoreText;

                versusProgressBarContainer.innerHTML = '';
                for (let i = 0; i < gameState.versusTotalRounds; i++) {
                    const segment = document.createElement('div');
                    segment.className = 'progress-segment';
                    segment.id = `progress-segment-${i}`;
                    versusProgressBarContainer.appendChild(segment);
                }

                setupVersusRound(0);
            }
        }
        
        // --- MOD 1: Kök Tanıma (Donut) Fonksiyonları ---

        // GÜNCELLENDİ: "Ada" tasarımı için
        function setupDonutRound(roundIndex) {
             if (roundIndex >= gameState.donutTotalRounds) {
                endDonutGame(true);
                return;
             }
             gameState.donutRoundIndex = roundIndex;
             
             const roundData = level1GameData_generated[roundIndex];
             if (!roundData) {
                 console.error("Donut modu için tur verisi bulunamadı:", roundIndex);
                 endDonutGame(false);
                 return;
             }
             
             gameState.donutCorrectNeeded = roundData.words.filter(w => w.isCorrect).length;
             gameState.donutCorrectFound = 0;
             const isArabic = gameState.currentLang === 'ar';

             l1MainInstruction.textContent = uiText.donutInstruction;
             l1FeedbackArea.innerHTML = "&nbsp;"; 
             l1FeedbackArea.style.color = "var(--text-color)";
             nextButton.classList.add('hidden');
             nextButton.classList.remove('pulse-on-appear');
             
             l1ChoicesGrid.innerHTML = '';
             
             const shuffledWords = [...roundData.words];
             
             const isMobile = window.innerWidth <= 768;
             const rootDisplayClass = isArabic ? 'is-arabic' : 'is-turkish-root';

             if (isMobile) {
                // --- MOBİL GÖRÜNÜM (Orijinal) ---
                l1RootDisplayMobile.textContent = roundData.displayRoot;
                l1RootDisplayMobile.className = 'l1-root-display-mobile ' + rootDisplayClass;
                
                shuffledWords.forEach(word => {
                    l1ChoicesGrid.appendChild(createDonutChoiceBox(word, isArabic));
                });
             } else {
                // --- YENİ MASAÜSTÜ "ADA" GÖRÜNÜMÜ ---
                
                // HATA DÜZELTMESİ: 10 kelimenin hepsini (veya varsa daha azını) ekle
                const wordsToAdd = shuffledWords.length >= 10 ? shuffledWords : [...shuffledWords, ...Array(10 - shuffledWords.length).fill(null)];

                l1ChoicesGrid.appendChild(createDonutChoiceBox(wordsToAdd[0], isArabic));
                l1ChoicesGrid.appendChild(createDonutChoiceBox(wordsToAdd[1], isArabic));
                l1ChoicesGrid.appendChild(createDonutChoiceBox(wordsToAdd[2], isArabic));
                l1ChoicesGrid.appendChild(createDonutChoiceBox(wordsToAdd[3], isArabic));
                
                const rootCardPC = document.createElement('div');
                rootCardPC.className = 'l1-static-root-card-pc';
                
                const instructionText = document.createElement('div');
                instructionText.className = 'instruction-text';
                if (isArabic) {
                    instructionText.classList.add('is-arabic');
                    instructionText.textContent = "أي الكلمات من هذا الجذر؟"; // Basit Arapça çeviri
                } else {
                    instructionText.textContent = l1MainInstruction.textContent;
                }
                
                const rootText = document.createElement('div');
                rootText.className = 'root-text ' + rootDisplayClass;
                rootText.textContent = roundData.displayRoot;
                
                rootCardPC.appendChild(instructionText);
                rootCardPC.appendChild(rootText);

                l1ChoicesGrid.appendChild(rootCardPC);
                
                l1ChoicesGrid.appendChild(createDonutChoiceBox(wordsToAdd[4], isArabic));
                l1ChoicesGrid.appendChild(createDonutChoiceBox(wordsToAdd[5], isArabic));
                l1ChoicesGrid.appendChild(createDonutChoiceBox(wordsToAdd[6], isArabic));
                l1ChoicesGrid.appendChild(createDonutChoiceBox(wordsToAdd[7], isArabic));
                l1ChoicesGrid.appendChild(createDonutChoiceBox(wordsToAdd[8], isArabic));
                l1ChoicesGrid.appendChild(createDonutChoiceBox(wordsToAdd[9], isArabic));
             }
             
             showScreen('level1-donut');
             gameState.isGameActive = true;
        }

        function createDonutChoiceBox(wordData, isArabic) {
            // HATA DÜZELTMESİ: Eğer kelime 'null' ise (yani 10'a tamamlanamadıysa) boş, görünmez bir kutu oluştur
            if (!wordData) {
                const emptyBox = document.createElement('div');
                emptyBox.style.visibility = 'hidden';
                return emptyBox;
            }
            
            const choiceBox = document.createElement('div');
            choiceBox.className = 'l1-choice-box';
            if (isArabic) {
                choiceBox.classList.add('is-arabic');
            }
            choiceBox.innerHTML = wordData.text; 
            choiceBox.dataset.isCorrect = wordData.isCorrect;
            choiceBox.addEventListener('click', handleDonutChoiceClick, { once: true }); 
            return choiceBox;
        }

        function handleDonutChoiceClick(e) {
            if (!gameState.isGameActive) return;
            const clickedBox = e.target.closest('.l1-choice-box');
            if (!clickedBox || clickedBox.classList.contains('selected')) return;
            
            const isCorrect = clickedBox.dataset.isCorrect === 'true';
            clickedBox.classList.add('selected'); 

            if (isCorrect) {
                playGenericSound('correct');
                clickedBox.classList.add('correct');
                gameState.donutCorrectFound++;
                gameState.donutTotalScore++;
                l1FeedbackArea.textContent = uiText.donutFeedbackCorrect;
                l1FeedbackArea.style.color = "var(--success-color)";
                if (gameState.donutCorrectFound === gameState.donutCorrectNeeded) {
                    winDonutRound();
                }
            } else {
                playGenericSound('incorrect');
                clickedBox.classList.add('incorrect');
                gameState.donutTotalMistakes++;
                l1FeedbackArea.textContent = uiText.donutFeedbackIncorrect;
                l1FeedbackArea.style.color = "var(--error-color)";
            }
        }
        
        function winDonutRound() {
            gameState.isGameActive = false;
            playGenericSound('win');
            
            l1FeedbackArea.textContent = uiText.donutWinRound;
            l1FeedbackArea.style.color = "var(--success-color)";
            l1ChoicesGrid.querySelectorAll('.l1-choice-box:not(.selected)').forEach(box => {
                box.style.opacity = '0.3';
                box.style.cursor = 'default';
            });
            nextButton.classList.remove('hidden');
            nextButton.classList.add('pulse-on-appear');
            setTimeout(() => nextButton.classList.remove('pulse-on-appear'), 600); 
        }

        function endDonutGame(isWin) {
             gameState.isGameActive = false;
             
             if (isWin) {
                 /* Not: bu oyunda yuzde "tiklama isabeti"dir (dogru/dogru+hata) —
                    turu gecmek icin tum dogrulari bulmak zorunlu oldugundan
                    beceriyi hata sayisi olcer. */
                 try{ if(window.KidefGorev && KidefGorev.aktif) KidefGorev.bildir({dogru: gameState.donutTotalScore, toplam: gameState.donutTotalScore + gameState.donutTotalMistakes, mod: 'donut', detay: 'dil:' + (gameState.currentLang || '?'), sureSn: gameState.basZaman ? Math.round((Date.now() - gameState.basZaman) / 1000) : null}); }catch(e){}
                 resultsTitle.textContent = uiText.resultsTitleDonut;
                 resultsDetails.innerHTML = `
                    ${uiText.resultsWinText}
                    <div>${uiText.resultsTotalScore.replace('{score}', gameState.donutTotalScore)}</div>
                    <p style="font-size: 2em; color: var(--error-color); margin-top: 10px;">
                        ${uiText.resultsTotalMistakes.replace('{mistakes}', gameState.donutTotalMistakes)}
                    </p>
                 `;
             } else { 
                resultsTitle.textContent = "Hata Oluştu";
                resultsDetails.innerHTML = "<p>Oyun verisi yüklenirken bir hata oluştu.</p>";
             }
             showScreen('results');
        }
        
        nextButton.addEventListener('click', () => {
            playGenericSound('touch');
            setupDonutRound(gameState.donutRoundIndex + 1);
        });

        // --- MOD 2: 1v1 Yarışma Fonksiyonları ---

        function setupVersusRound(roundIndex) {

            for (let i = 0; i < gameState.versusTotalRounds; i++) {
                const segment = document.getElementById(`progress-segment-${i}`);
                if (!segment) continue;
                segment.classList.remove('current', 'completed'); 
                if (i < roundIndex) {
                    segment.classList.add('completed');
                } else if (i === roundIndex) {
                    segment.classList.add('current');
                }
            }

            if (roundIndex >= gameState.versusTotalRounds || (roundIndex * 2 + 1) >= gameState.versusQuestions.length) {
                setTimeout(endVersusGame, 500);
                return;
            }
            gameState.versusRoundIndex = roundIndex;
            
            gameState.player1.hasAnswered = false;
            gameState.player1.wasCorrect = false;
            gameState.player1.clickedButton = null;
            gameState.player2.hasAnswered = false;
            gameState.player2.wasCorrect = false;
            gameState.player2.clickedButton = null;
            
            vsFeedbackArea.textContent = `Tur ${roundIndex + 1} / ${gameState.versusTotalRounds}`;
            
            const q1 = gameState.versusQuestions[roundIndex * 2];
            const q2 = gameState.versusQuestions[roundIndex * 2 + 1];
            
            if (!q1 || !q2) {
                console.error("Versus soruları yüklenemedi, tur:", roundIndex);
                endVersusGame();
                return;
            }
            
            populatePlayerScreen('p1', q1);
            populatePlayerScreen('p2', q2);
            
            showScreen('level1-versus');
            gameState.roundStartTime = Date.now();
        }

        function populatePlayerScreen(playerId, questionData) {
            const elements = playerElements[playerId];
            const isArabic = gameState.currentLang === 'ar';
            
            elements.root.textContent = questionData.displayRoot; 
            elements.root.className = 'root-display-vs'; 
            elements.root.classList.add(isArabic ? 'is-arabic' : 'is-turkish-root');
            
            elements.question.innerHTML = questionData.question; 
            elements.question.className = 'question-text-vs';
            if (isArabic) {
                elements.question.classList.add('is-arabic');
            }
            elements.options.innerHTML = '';
            
            const shuffledOptions = [...questionData.options];
            
            shuffledOptions.forEach(option => {
                const button = document.createElement('button');
                button.className = 'option-button-vs';
                if (isArabic) {
                    button.classList.add('is-arabic');
                }
                button.innerHTML = option.text; 
                button.dataset.isCorrect = option.isCorrect;
                button.addEventListener('click', (e) => handleVersusAnswer(e, playerId, option.isCorrect), { once: true });
                elements.options.appendChild(button);
            });
        }
        
        function handleVersusAnswer(e, playerId, isCorrect) {
            const clickedButton = e.target.closest('.option-button-vs');
            const playerState = (playerId === 'p1') ? gameState.player1 : gameState.player2;

            // === DÜZELTME 1: Birden fazla tıklamayı engelle ===
            if (playerState.hasAnswered) return; 
            // === BİTİŞ ===

            const optionsContainer = playerElements[playerId].options;
            
            playerState.hasAnswered = true;
            playerState.wasCorrect = isCorrect;
            playerState.answerTime = Date.now() - gameState.roundStartTime;
            playerState.clickedButton = clickedButton;

            clickedButton.classList.add('selected');
            playGenericSound('touch');

            optionsContainer.querySelectorAll('.option-button-vs').forEach(btn => {
                btn.classList.add('disabled');
            });
            
            checkVersusRoundEnd();
        }
        
        function checkVersusRoundEnd() {
            if (gameState.player1.hasAnswered && gameState.player2.hasAnswered) {
                let p1_bonus = false;
                let p2_bonus = false;

                if (gameState.player1.wasCorrect) {
                    gameState.player1.clickedButton.classList.add('correct');
                    gameState.player1.correct++;
                } else {
                    gameState.player1.clickedButton.classList.add('incorrect');
                    gameState.player1.mistakes++;
                }
                if (gameState.player2.wasCorrect) {
                    gameState.player2.clickedButton.classList.add('correct');
                    gameState.player2.correct++;
                } else {
                    gameState.player2.clickedButton.classList.add('incorrect');
                    gameState.player2.mistakes++;
                }

                playerElements.p1.options.querySelectorAll('.option-button-vs').forEach(btn => {
                    if (btn.dataset.isCorrect === 'true') btn.classList.add('correct');
                });
                playerElements.p2.options.querySelectorAll('.option-button-vs').forEach(btn => {
                    if (btn.dataset.isCorrect === 'true') btn.classList.add('correct');
                });

                if (gameState.player1.wasCorrect || gameState.player2.wasCorrect) {
                    playGenericSound('correct');
                } else {
                    playGenericSound('incorrect');
                }

                if (gameState.player1.wasCorrect) {
                    gameState.player1.score += 5;
                    showScoreAnimation('p1', 'base', 5);
                }
                if (gameState.player2.wasCorrect) {
                    gameState.player2.score += 5;
                    showScoreAnimation('p2', 'base', 5);
                }

                if (gameState.player1.wasCorrect && gameState.player2.wasCorrect) {
                    if (gameState.player1.answerTime < gameState.player2.answerTime) {
                        p1_bonus = true;
                    } else if (gameState.player2.answerTime < gameState.player1.answerTime) {
                        p2_bonus = true;
                    }
                } else if (gameState.player1.wasCorrect) {
                    p1_bonus = true;
                } else if (gameState.player2.wasCorrect) {
                    p2_bonus = true;
                }
                
                setTimeout(() => {
                    if (p1_bonus) {
                        gameState.player1.score += 5;
                        showScoreAnimation('p1', 'bonus', 5);
                        playGenericSound('bonus');
                    }
                    if (p2_bonus) {
                        gameState.player2.score += 5;
                        showScoreAnimation('p2', 'bonus', 5);
                        playGenericSound('bonus');
                    }
                    
                    updateVersusScoreboard();
                    
                    vsFeedbackArea.textContent = uiText.versusRoundEnd;
                    setTimeout(() => {
                        setupVersusRound(gameState.versusRoundIndex + 1);
                    }, 2000);

                }, 750);
            }
        }
        
        function updateVersusScoreboard() {
            const scorePrefix = uiText.versusScorePrefix;
            playerElements.p1.scoreDisplay.textContent = `${scorePrefix}${gameState.player1.score}`;
            
            // === DÜZELTME 2: 'p2' -> 'player2' olarak düzeltildi ===
            playerElements.p2.scoreDisplay.textContent = `${scorePrefix}${gameState.player2.score}`;
        }
        
        function showScoreAnimation(playerId, scoreType, points) {
            const container = playerElements[playerId].animationContainer;
            const popup = document.createElement('div');
            popup.className = `score-popup ${scoreType}-score`;
            
            if (scoreType === 'base') {
                popup.innerHTML = `+${points}`;
            } else {
                popup.innerHTML = `⚡ +${points}`;
            }
            container.appendChild(popup);
            setTimeout(() => { popup.remove(); }, 1400);
        }
        
        function endVersusGame() {
            const t = uiText;
            resultsTitle.textContent = t.resultsTitleVersus;
            let winnerText = "";
            if (gameState.player1.score > gameState.player2.score) {
                winnerText = t.resultsP1Won;
            } else if (gameState.player2.score > gameState.player1.score) {
                winnerText = t.resultsP2Won;
            } else {
                winnerText = t.resultsDraw;
            }
            resultsDetails.innerHTML = `
                ${winnerText}
                <h3 class="results-player-score">${t.resultsP1Score.replace('{score}', gameState.player1.score)}</h3>
                <p class="results-player-stats">${t.resultsP1Stats.replace('{correct}', gameState.player1.correct).replace('{mistakes}', gameState.player1.mistakes)}</p>
                <h3 class="results-player-score">${t.resultsP2Score.replace('{score}', gameState.player2.score)}</h3>
                
                <p class="results-player-stats">${t.resultsP2Stats.replace('{correct}', gameState.player2.correct).replace('{mistakes}', gameState.player2.mistakes)}</p>
            `;
            showScreen('results');
        }

        // === JAVASCRIPT GÜNCELLEMESİ ===
        function showScreen(screenName) {
            startScreen.classList.add('hidden'); 
            resultsScreen.classList.add('hidden'); 
            level1DonutContainer.classList.add('hidden');
            level1VersusContainer.classList.add('hidden');
            
            // Geri tuşlarını da varsayılan olarak gizle
            backButtonDonut.classList.add('hidden');
            backButtonVersus.classList.add('hidden');
            // (start-screen'deki tuş kendi overlay'i ile yönetiliyor)
            
            if (screenName === 'start') {
                startScreen.classList.remove('hidden'); 
            } else if (screenName === 'results') {
                resultsScreen.classList.remove('hidden'); 
            } else if (screenName === 'level1-donut') {
                level1DonutContainer.classList.remove('hidden'); 
                backButtonDonut.classList.remove('hidden'); // Donut tuşunu göster
            } else if (screenName === 'level1-versus') {
                level1VersusContainer.classList.remove('hidden'); 
                backButtonVersus.classList.remove('hidden'); // Versus tuşunu göster
            }
        }
        
        playAgainButton.addEventListener('click', () => { 
            playGenericSound('touch'); 
            initializeGame(); 
        });

        // Oyunu ilk yüklemede başlat
        initializeGame();
    });