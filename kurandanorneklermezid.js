/* --- YAMA KODU: Mevcut script bloklarını bunlarla değiştirin --- */
    let currentIdx = 0;
const definitions = {
    "İfal": "Mazisi (أَفْعَلَ) kalıbındadır. Genelde geçişsiz fiili geçişli yapar.",
    "Tefil": "Mazisi (فَعَّلَ) kalıbındadır. Çokluk veya tedricilik bildirir.",
    "Müfaale": "Mazisi (فَاعَلَ) kalıbındadır. Genelde işteşlik bildirir.",
    "Tefeul": "Mazisi (تَفَعَّلَ) kalıbındadır. Dönüşlülük veya tekellüf bildirir.",
    "Tefaul": "Mazisi (تَفَاعَلَ) kalıbındadır. Genelde ortaklık veya yapmacıklık bildirir.",
    "İftial": "Mazisi (اِفْتَعَلَ) kalıbındadır. Dönüşlülük ve çaba bildirir.",
    "İnfial": "Mazisi (اِنْفَعَلَ) kalıbındadır. Mutavaat (edilgenlik/dönüşlülük) bildirir.",
    "İstifal": "Mazisi (اِسْتَفْعَلَ) kalıbındadır. Genelde isteme veya bir hal üzere bulma bildirir."
};

const questions = [
  {
    verse: "إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
    target: "أَنْزَلْنَاهُ",
    tr_target: "onu indirdik",
    translation: "Şüphesiz, biz onu (Kur'an'ı) Kadir gecesinde indirdik.",
    correct: "İfal",
    conjugation: { mazi: "أَنْزَلَ", muzari: "يُنْزِلُ", emir: "أَنْزِلْ", mastar: "إِنْزَالٌ" }
  },
  {
    verse: "وَ أَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ",
    target: "أَرْسَلَ",
    tr_target: "gönderdi",
    translation: "Onların üzerine sürü sürü kuşlar gönderdi.",
    correct: "İfal",
    conjugation: { mazi: "أَرْسَلَ", muzari: "يُرْسِلُ", emir: "أَرْسِلْ", mastar: "إِرْسَالٌ" }
  },
  {
    verse: "فَ أَطْعَمَهُمْ مِنْ جُوعٍ",
    target: "أَطْعَمَهُمْ",
    tr_target: "onları doyurdu",
    translation: "Onları açlıktan kurtarıp doyurdu.",
    correct: "İfal",
    conjugation: { mazi: "أَطْعَمَ", muzari: "يُطْعِمُ", emir: "أَطْعِمْ", mastar: "إِطْعَامٌ" }
  },
  {
    verse: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
    target: "أَعْطَيْنَاكَ",
    tr_target: "sana verdik",
    translation: "Şüphesiz biz sana Kevser'i verdik.",
    correct: "İfal",
    conjugation: { mazi: "أَعْطَى", muzari: "يُعْطِي", emir: "أَعْطِ", mastar: "إِعْطَاءٌ" }
  },
  {
    verse: "وَ أَقِيمُوا الصَّلَاةَ",
    target: "أَقِيمُوا",
    tr_target: "namazı kılın",
    translation: "Namazı kılın.",
    correct: "İfal",
    conjugation: { mazi: "أَقَامَ", muzari: "يُقِيمُ", emir: "أَقِمْ", mastar: "إِقَامَةٌ" }
  },
  {
    verse: "الَّذِي عَلَّمَ بِالْقَلَمِ",
    target: "عَلَّمَ",
    tr_target: "öğretti",
    translation: "O, kalemle yazmayı öğretendir.",
    correct: "Tefil",
    conjugation: { mazi: "عَلَّمَ", muzari: "يُعَلِّمُ", emir: "عَلِّمْ", mastar: "تَعْلِيمٌ" }
  },
  {
    verse: "فَ سَبِّحْ بِحَمْدِ رَبِّكَ",
    target: "سَبِّحْ",
    tr_target: "tesbih et",
    translation: "Rabbini hamd ile tesbih et.",
    correct: "Tefil",
    conjugation: { mazi: "سَبَّحَ", muzari: "يُسَبِّحُ", emir: "سَبِّحْ", mastar: "تَسْبِيحٌ" }
  },
  {
    verse: "وَ صَدَّقَ بِالْحُسْنَى",
    target: "صَدَّقَ",
    tr_target: "tasdik etti",
    translation: "Ve en güzel olanı (tevhidi) tasdik ederse.",
    correct: "Tefil",
    conjugation: { mazi: "صَدَّقَ", muzari: "يُصَدِّقُ", emir: "صَدِّقْ", mastar: "تَصْدِيقٌ" }
  },
  {
    verse: "فَ ذَكِّرْ إِنَّمَا أَنْتَ مُذَكِّرٌ",
    target: "ذَكِّرْ",
    tr_target: "öğüt ver",
    translation: "Artık sen öğüt ver! Sen ancak bir öğüt vericisin.",
    correct: "Tefil",
    conjugation: { mazi: "ذَكَّرَ", muzari: "يُذَكِّرُ", emir: "ذَكِّرْ", mastar: "تَذْكِيرٌ" }
  },
  {
    verse: "نَزَّلَ عَلَيْكَ الْكِتَابَ",
    target: "نَزَّلَ",
    tr_target: "indirdi",
    translation: "Sana kitabı indirdi.",
    correct: "Tefil",
    conjugation: { mazi: "نَزَّلَ", muzari: "يُنَزِّلُ", emir: "نَزِّلْ", mastar: "تَنْزِيلٌ" }
  },
  {
    verse: "وَلَا تُقَاتِلُوهُمْ عِنْدَ الْمَسْجِدِ الْحَرَامِ",
    target: "تُقَاتِلُوهُمْ",
    tr_target: "onlarla savaşmayın",
    translation: "Mescid-i Haram yanında onlarla savaşmayın.",
    correct: "Müfaale",
    conjugation: { mazi: "قَاتَلَ", muzari: "يُقَاتِلُ", emir: "قَاتِلْ", mastar: "مُقَاتَلَةٌ / قِتَالٌ" }
  },
  {
    verse: "فَ نَادَى رَبَّهُ أَنِّي مَغْلُوبٌ",
    target: "نَادَى",
    tr_target: "nida etti / seslendi",
    translation: "Rabbine: 'Ben yenik düştüm' diye nida etti.",
    correct: "Müfaale",
    conjugation: { mazi: "نَادَى", muzari: "يُنَادِي", emir: "نَادِ", mastar: "مُنَادَاةٌ / نِدَاءٌ" }
  },
  {
    verse: "وَمَا يُخَادِعُونَ إِلَّا أَنْفُسَهُمْ",
    target: "يُخَادِعُونَ",
    tr_target: "aldatırlar",
    translation: "Onlar ancak kendilerini aldatırlar.",
    correct: "Müfaale",
    conjugation: { mazi: "خَادَعَ", muzari: "يُخَادِعُ", emir: "خَادِعْ", mastar: "مُخَادَعَةٌ / خِدَاعٌ" }
  },
  {
    verse: "وَ جَاهِدُوا فِي اللَّهِ حَقَّ جِهَادِهِ",
    target: "جَاهِدُوا",
    tr_target: "cihad edin",
    translation: "Allah yolunda hakkıyla cihad edin.",
    correct: "Müfaale",
    conjugation: { mazi: "جَاهَدَ", muzari: "يُجَاهِدُ", emir: "جَاهِدْ", mastar: "مُجَاهَدَةٌ / جِهَادٌ" }
  },
  {
    verse: "إِنَّما يُبَايِعُونَ اللَّهَ",
    target: "يُبَايِعُونَ",
    tr_target: "biat ediyorlar",
    translation: "Onlar ancak Allah'a biat etmektedirler.",
    correct: "Müfaale",
    conjugation: { mazi: "بَايَعَ", muzari: "يُبَايِعُ", emir: "بَايِعْ", mastar: "مُبَايَعَةٌ" }
  },
  {
    verse: "لَعَلَّكُمْ تَتَفَكَّرُونَ",
    target: "تَتَفَكَّرُونَ",
    tr_target: "düşünürsünüz",
    translation: "Umulur ki düşünürsünüz.",
    correct: "Tefeul",
    conjugation: { mazi: "تَفَكَّرَ", muzari: "يَتَفَكَّرُ", emir: "تَفَكَّرْ", mastar: "تَفَكُّرٌ" }
  },
  {
    verse: "فَأَمَّا مَنْ تَزَكَّى",
    target: "تَزَكَّى",
    tr_target: "temizlendi",
    translation: "Temizlenen (iman eden) kimseye gelince.",
    correct: "Tefeul",
    conjugation: { mazi: "تَزَكَّى", muzari: "يَتَزَكَّى", emir: "تَزَكَّ", mastar: "تَزَكٍّ" }
  },
  {
    verse: "تَنَزَّلُ الْمَلَائِكَةُ",
    target: "تَنَزَّلُ",
    tr_target: "inerler",
    translation: "Melekler inerler.",
    correct: "Tefeul",
    conjugation: { mazi: "تَنَزَّلَ", muzari: "يَتَنَزَّلُ", emir: "تَنَزَّلْ", mastar: "تَنَزُّلٌ" }
  },
  {
    verse: "فَ تَبَسَّمَ ضَاحِكًا",
    target: "تَبَسَّمَ",
    tr_target: "gülümsedi",
    translation: "Gülümseyerek tebessüm etti.",
    correct: "Tefeul",
    conjugation: { mazi: "تَبَسَّمَ", muzari: "يَتَبَسَّمُ", emir: "تَبَسَّمْ", mastar: "تَبَسُّمٌ" }
  },
  {
    verse: "فَ تَقَبَّلَهَا رَبُّهَا",
    target: "تَقَبَّلَهَا",
    tr_target: "onu kabul etti",
    translation: "Rabbi onu kabul buyurdu.",
    correct: "Tefeul",
    conjugation: { mazi: "تَقَبَّلَ", muzari: "يَتَقَبَّلُ", emir: "تَقَبَّلْ", mastar: "تَقَبُّلٌ" }
  },
  {
    verse: "وَ تَعَاوَنُوا عَلَى الْبِرِّ",
    target: "تَعَاوَنُوا",
    tr_target: "yardımlaşın",
    translation: "İyilik üzerinde yardımlaşın.",
    correct: "Tefaul",
    conjugation: { mazi: "تَعَاوَنَ", muzari: "يَتَعَاوَنُ", emir: "تَعَاوَنُ", mastar: "تَعَاوُنٌ" }
  },
  {
    verse: "أَلْهَاكُمُ التَّكَاثُرُ",
    target: "التَّكَاثُرُ",
    tr_target: "çokluk yarışı",
    translation: "Çokluk yarışı (övünmesi) sizi oyaladı.",
    correct: "Tefaul",
    conjugation: { mazi: "تَكَاثَرَ", muzari: "يَتَكَاثَرُ", emir: "تَكَاثَرْ", mastar: "تَكَاثُرٌ" }
  },
  {
    verse: "وَ تَوَاصَوْا بِالصَّبْرِ",
    target: "تَوَاصَوْا",
    tr_target: "tavsiyeleştiler",
    translation: "Sabrı tavsiye ettiler.",
    correct: "Tefaul",
    conjugation: { mazi: "تَوَاصَى", muzari: "يَتَوَاصَى", emir: "تَوَاصَ", mastar: "تَوَاصٍ" }
  },
  {
    verse: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ",
    target: "تَبَارَكَ",
    tr_target: "yücedir",
    translation: "Hükümranlık elinde olan Allah ne yücedir.",
    correct: "Tefaul",
    conjugation: { mazi: "تَبَارَكَ", muzari: "يَتَبَارَكُ", emir: "تَبَارَكْ", mastar: "تَبَارُكٌ" }
  },
  {
    verse: "أَمْ تَسَاءَلُونَ",
    target: "تَسَاءَلُونَ",
    tr_target: "soruşuyorsunuz",
    translation: "Yoksa birbirinize mi soruyorsunuz?",
    correct: "Tefaul",
    conjugation: { mazi: "تَسَاءَلَ", muzari: "يَتَسَاءَلُ", emir: "تَسَاءَلْ", mastar: "تَسَاؤُلٌ" }
  },
  {
    verse: "وَ اعْتَصِمُوا بِحَبْلِ اللَّهِ",
    target: "اعْتَصِمُوا",
    tr_target: "sımsıkı sarılın",
    translation: "Allah'ın ipine sımsıkı sarılın.",
    correct: "İftial",
    conjugation: { mazi: "اِعْتَصَمَ", muzari: "يَعْتَصِمُ", emir: "اِعْتَصِمْ", mastar: "اِعْتِصَامٌ" }
  },
  {
    verse: "قَدِ اخْتَلَطَ بِمَائِهَا",
    target: "اخْتَلَطَ",
    tr_target: "karıştı",
    translation: "Onun suyuna karışmıştır.",
    correct: "İftial",
    conjugation: { mazi: "اِخْتَلَطَ", muzari: "يَخْتَلِطُ", emir: "اِخْتَلِطْ", mastar: "اِخْتِلَاطٌ" }
  },
  {
    verse: "فَ انْتَصِرْ",
    target: "انْتَصِرْ",
    tr_target: "yardım et",
    translation: "Artık bana yardım et.",
    correct: "İftial",
    conjugation: { mazi: "اِنْتَصَرَ", muzari: "يَنْتَصِرُ", emir: "اِنْتَصِرْ", mastar: "اِنْتِصَارٌ" }
  },
  {
    verse: "فَ انْتَقَمْنَا مِنْهُمْ",
    target: "انْتَقَمْنَا",
    tr_target: "intikam aldık",
    translation: "Biz de onlardan intikam aldık.",
    correct: "İftial",
    conjugation: { mazi: "اِنْتَقَمَ", muzari: "يَنْتَقِمُ", emir: "اِنْتَقَمْ", mastar: "اِنْتِقَامٌ" }
  },
  {
    verse: "وَ انْتَظِرُوا إِنَّا مُنْتَظِرُونَ",
    target: "انْتَظِرُوا",
    tr_target: "bekleyin",
    translation: "Bekleyin, biz de beklemekteyiz.",
    correct: "İftial",
    conjugation: { mazi: "اِنْتَظَرَ", muzari: "يَنْتَظِرُ", emir: "اِنْتَظِرْ", mastar: "اِنْتِظَارٌ" }
  },
  {
    verse: "إِذَا السَّمَاءُ انْفَطَرَتْ",
    target: "انْفَطَرَتْ",
    tr_target: "yarıldı",
    translation: "Gök yarıldığı zaman.",
    correct: "İnfial",
    conjugation: { mazi: "اِنْفَطَرَ", muzari: "يَنْفَطِرُ", emir: "اِنْفَطِرْ", mastar: "اِنْفِطَارٌ" }
  },
  {
    verse: "إِذَا السَّمَاءُ انْشَقَّتْ",
    target: "انْشَقَّتْ",
    tr_target: "yarıldı",
    translation: "Gök yarıldığı zaman.",
    correct: "İnfial",
    conjugation: { mazi: "اِنْشَقَّ", muzari: "يَنْشَقُّ", emir: "اِنْشَقَّ", mastar: "اِنْشِقَاقٌ" }
  },
  {
    verse: "فَ انْفَجَرَتْ مِنْهُ عَيْنًا",
    target: "انْفَجَرَتْ",
    tr_target: "fışkırdı",
    translation: "Ondan pınarlar fışkırdı.",
    correct: "İnfial",
    conjugation: { mazi: "اِنْفَجَرَ", muzari: "يَنْفَجِرُ", emir: "اِنْفَجِرْ", mastar: "اِنْفِجَارٌ" }
  },
  {
    verse: "إِذَا انْفَضُّوا إِلَيْهَا",
    target: "انْفَضُّوا",
    tr_target: "dağıldılar",
    translation: "Oraya dağıldıkları zaman.",
    correct: "İnfial",
    conjugation: { mazi: "اِنْفَضَّ", muzari: "يَنْفَضُّ", emir: "اِنْفَضَّ", mastar: "اِنْفِضَاضٌ" }
  },
  {
    verse: "فَ انْكَبَّتْ وُجُوهُهُمْ",
    target: "انْكَبَّتْ",
    tr_target: "yüzüstü kapandı",
    translation: "Yüzüstü kapandılar.",
    correct: "İnfial",
    conjugation: { mazi: "اِنْكَبَّ", muzari: "يَنْكَبُّ", emir: "اِنْكَبَّ", mastar: "اِنْكِبَابٌ" }
  },
  {
    verse: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    target: "نَسْتَعِينُ",
    tr_target: "yardım dileriz",
    translation: "Yalnız Senden yardım dileriz.",
    correct: "İstifal",
    conjugation: { mazi: "اِسْتَعَانَ", muzari: "يَسْتَعِينُ", emir: "اِسْتَعِنْ", mastar: "اِسْتِعَانَةٌ" }
  },
  {
    verse: "وَ اسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا",
    target: "اسْتَغْفِرْهُ",
    tr_target: "bağışlanma dile",
    translation: "Ondan bağışlanma dile.",
    correct: "İstifal",
    conjugation: { mazi: "اِسْتَغْفَرَ", muzari: "يَسْتَغْفِرُ", emir: "اِسْتَغْفِرْ", mastar: "اِسْتِغْفَارٌ" }
  },
  {
    verse: "فَ اسْتَجَابَ لَهُمْ رَبُّهُمْ",
    target: "اسْتَجَابَ",
    tr_target: "cevap verdi / icabet etti",
    translation: "Rableri onlara icabet etti.",
    correct: "İstifal",
    conjugation: { mazi: "اِسْتَجَابَ", muzari: "يَسْتَجِيبُ", emir: "اِسْتَجِبْ", mastar: "اِسْتِجَابَةٌ" }
  },
  {
    verse: "وَ اسْتَكْبَرَ هُوَ وَجُنُودُهُ",
    target: "اسْتَكْبَرَ",
    tr_target: "büyüklük tasladı",
    translation: "O ve orduları büyüklük tasladılar.",
    correct: "İstifal",
    conjugation: { mazi: "اِسْتَكْبَرَ", muzari: "يَسْتَكْبِرُ", emir: "اِسْتَكْبِرْ", mastar: "اِسْتِكْبَارٌ" }
  },
  {
    verse: "لَا تَسْتَفْتِحُوا عَلَى اللَّهِ",
    target: "تَسْتَفْتِحُوا",
    tr_target: "fetih istemeyin",
    translation: "Allah'tan fetih (başarı) istemeyin.",
    correct: "İstifal",
    conjugation: { mazi: "اِسْتَفْتَحَ", muzari: "يَسْتَفْتِحُ", emir: "اِسْتَفْتِحْ", mastar: "اِسْتِفْتَاحٌ" }
  }
];

// Soruları karıştır
questions.sort(() => 0.5 - Math.random());

function loadQuestion() {
    const data = questions[currentIdx];
    const nextBtn = document.getElementById('next-btn');
    
    // Feedback ikonlarını sıfırla
    document.getElementById('feedback-left').className = 'feedback-icon icon-left';
    document.getElementById('feedback-right').className = 'feedback-icon icon-right';
    document.getElementById('feedback-left').innerHTML = '';
    document.getElementById('feedback-right').innerHTML = '';

    document.getElementById('progress-bar').style.width = ((currentIdx) / questions.length * 100) + "%";
    document.getElementById('options-container').style.display = 'flex';
    document.getElementById('result-container').style.display = 'none';
    
    nextBtn.disabled = true;
    nextBtn.classList.remove('pulse-active');

    // Arapça Metin (Hedef kelime vurgulu)
    document.getElementById('verse-text').innerHTML = data.verse.replace(
        data.target, 
        `<span class="highlight-word">${data.target}</span>`
    );

    // Türkçe Meal
    document.getElementById('verse-translation').innerHTML = data.translation;

    // Şıklar (5 Şıklı hale getirildi)
    const container = document.getElementById('options-container');
    container.innerHTML = '';

    let opts = [data.correct];
    const allTypes = Object.keys(definitions);
    // 4 adet çeldirici seçiyoruz (Toplam 5 şık için)
    const distractors = allTypes.filter(t => t !== data.correct).sort(() => 0.5 - Math.random()).slice(0, 4); 
    opts = opts.concat(distractors).sort(() => 0.5 - Math.random());

    opts.forEach(type => {
        const btn = document.createElement('div');
        btn.className = 'option-card';
        btn.innerHTML = `
            <div class="opt-title">${type}</div>
            <div class="opt-desc">${definitions[type].split('.')[0]}</div>
        `;
        btn.onclick = () => handleAnswer(type);
        container.appendChild(btn);
    });
}

function handleAnswer(selected) {
    const data = questions[currentIdx];
    const isCorrect = selected === data.correct;
    
    document.getElementById('options-container').style.display = 'none';
    const leftIcon = document.getElementById('feedback-left');
    const rightIcon = document.getElementById('feedback-right');
    
    const icon = isCorrect ? '✓' : '✗';
    const colorClass = isCorrect ? 'icon-success' : 'icon-error';
    
    [leftIcon, rightIcon].forEach(el => {
        el.innerHTML = icon;
        el.className = `feedback-icon show ${colorClass} ${el.classList.contains('icon-left') ? 'icon-left' : 'icon-right'}`;
    });

    // Başlık ve İpucu
    document.getElementById('correct-answer-title').innerText = data.correct;
    document.getElementById('correct-answer-desc').innerText = `(${data.tr_target})`; 

    // Çekim Tablosunu Doldur
    document.getElementById('res-mazi').innerText = data.conjugation.mazi;
    document.getElementById('res-muzari').innerText = data.conjugation.muzari;
    document.getElementById('res-emir').innerText = data.conjugation.emir;
    document.getElementById('res-mastar').innerText = data.conjugation.mastar;
    
    // Tabloyu göster
    document.querySelector('.sarf-table').style.display = 'table'; 
    document.getElementById('result-container').style.display = 'flex';
    
    const nextBtn = document.getElementById('next-btn');
    nextBtn.disabled = false;
    nextBtn.classList.add('pulse-active');
}

function nextQuestion() {
    currentIdx++;
    if (currentIdx < questions.length) {
        loadQuestion();
    } else {
        document.querySelector('.content-scroll-area').innerHTML = `
            <div style="text-align:center; padding:50px;">
                <h1 style="color:var(--success)">Tebrikler!</h1>
                <p style="font-size:1.5rem;">Çalışma tamamlandı.</p>
                <button class="nav-btn" onclick="location.reload()" style="margin:20px auto;">Başa Dön</button>
            </div>
        `;
    }
}

function prevQuestion() {
    if (currentIdx > 0) {
        currentIdx--;
        loadQuestion();
    }
}

function toggleFullScreen() {
    var container = document.getElementById("main-container");
    if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

window.onload = loadQuestion;