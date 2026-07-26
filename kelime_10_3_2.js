const allWords = [
   // Ulaşım Araçları ve Mekanlar
    { tr: "Gemi", ar: "سَفِينَة" },
    { tr: "Uçak", ar: "طَائِرَة" },
    { tr: "Otobüs", ar: "حَافِلَة" },
    { tr: "Araba", ar: "سَيَّارَة" },
    { tr: "Kamyon", ar: "شَاحِنَة" },
    { tr: "Tren", ar: "قِطَار" },
    { tr: "Hızlı Tren", ar: "القِطَار السَّرِيع" },
    { tr: "Ulaşım Araçları", ar: "مُوَاصَلَات" },
    { tr: "Havalimanı", ar: "مَطَار" },
    { tr: "İstasyon / Durak", ar: "مَحَطَّة" },
    { tr: "Otobüs Durağı", ar: "مَوْقِف الحَافِلَات" },
    { tr: "Bilet", ar: "تَذْكِرَة" },
    { tr: "Otel", ar: "فُنْدُق" },
    { tr: "Oda", ar: "غُرْفَة" },
    { tr: "Eczane", ar: "صَيْدَلِيَّة" },
    { tr: "Hastane", ar: "مُسْتَشْفَى" },
    { tr: "Merkez Çarşı", ar: "السُّوق المَرْكَزِيّ" },

    // Trafik ve Yönler
    { tr: "Sağ", ar: "يَمِين" },
    { tr: "Sol", ar: "يَسَار" },
    { tr: "Arkasında", ar: "خَلْفَ" },
    { tr: "Önünde", ar: "أَمَامَ" },
    { tr: "Yanında / -de", ar: "عِنْدَ" },
    { tr: "Yakın", ar: "قَرِيب" },
    { tr: "Uzak", ar: "بَعِيد" },
    { tr: "Cadde / Sokak", ar: "شَارِع" },
    { tr: "Yol", ar: "طَرِيق" },
    { tr: "Adres", ar: "عُنْوَان" },
    { tr: "Sürücü / Şoför", ar: "سَائِق" },
    { tr: "Yaya Geçidi", ar: "مَمَرّ المُشَاة" },
    { tr: "Yayalar", ar: "مُشَاة" },
    { tr: "Kırmızı Işık", ar: "الضَّوْء الأَحْمَر" },
    { tr: "Sarı Işık", ar: "الضَّوْء الأَصْفَر" },
    { tr: "Yeşil Işık", ar: "الضَّوْء الأَخْضَر" },

    // Fiiller (Eylemler)
    { tr: "Gitti", ar: "ذَهَبَ" },
    { tr: "Ziyaret edeyim / ediyorum", ar: "أَزُورَ" },
    { tr: "Döneceğim", ar: "سَأَرْجِعُ" },
    { tr: "Ulaşacağım / Varacağım", ar: "سَأَصِلُ" },
    { tr: "Gidiyor / İlerliyor", ar: "تَسِيرُ" },
    { tr: "Bindi", ar: "رَكِبَتْ" },
    { tr: "İndi", ar: "نَزَلَ" },
    { tr: "Yürü", ar: "اِمْشِ" },
    { tr: "Yönel", ar: "اِتَّجِهْ" },
    { tr: "Geçiyor (Karşıya)", ar: "يَعْبُرُ" },
    { tr: "Hazırlanıyor", ar: "يَسْتَعِدُّ" },
    { tr: "Duruyor", ar: "تَقِفُ" },
    { tr: "Kalacağım (Konaklayacağım)", ar: "سَأُقِيمُ" },
    { tr: "Sürüyor / Zaman alıyor", ar: "تَسْتَغْرِقُ" },

    // Sıfatlar, Zıt Anlamlılar ve Kıyaslamalar
    { tr: "Yeni", ar: "حَدِيثَة" },
    { tr: "Daha yeni", ar: "أَحْدَث" },
    { tr: "Eski", ar: "قَدِيمَة" },
    { tr: "Daha eski", ar: "أَقْدَم" },
    { tr: "Hızlı", ar: "سَرِيع" },
    { tr: "Daha hızlı", ar: "أَسْرَع" },
    { tr: "Güzel", ar: "جَمِيلَة" },
    { tr: "Daha güzel", ar: "أَجْمَل" },
    { tr: "Geniş", ar: "وَاسِع" },
    { tr: "Uygun", ar: "مُنَاسِبَة" },
    { tr: "Hazır", ar: "جَاهِزَة" },
    { tr: "Kalabalık", ar: "مُزْدَحِم" },
    { tr: "Yürüyerek", ar: "مَشْيًا" },

    // Zaman ve Saatler ile İlgili İfadeler
    { tr: "Çeyrek", ar: "الرُّبْع" },
    { tr: "Üçte bir (Yirmi kala/geçe)", ar: "الثُّلُث" },
    { tr: "Kala / Var (Saat)", ar: "إِلَّا" },
    { tr: "Geçe (Saat)", ar: "وَ" },
    { tr: "Yarın", ar: "غَدًا" },
    { tr: "Gelecek Hafta", ar: "الأُسْبُوع القَادِم" },
    { tr: "Biraz sonra", ar: "بَعْدَ قَلِيل" }
];

    const cardColors = ["#364fc7", "#63e6be", "#ff922b", "#f06595", "#845ef7", "#51cf66", "#fcc419", "#339af0"];
    let mode = 'study', isAr = true, scores = [0, 0], currentPlayer = 1, activeFlipped = [];

    function playSound(id) {
        const s = document.getElementById(id);
        s.volume = 0.15; s.currentTime = 0;
        s.play().catch(() => {});
    }

    function toggleLang() {
        isAr = !isAr;
        init();
    }

function init() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const isMobile = window.innerWidth <= 768;
    
    // Mobilde dikey modda otomatik 9 çifti ayarla
    if (isMobile && isPortrait && mode !== 'study') {
        document.getElementById('pairCount').value = "9";
    }

    const grid = document.getElementById('grid');
    const p1Box = document.getElementById('p1-box');
    const p2Box = document.getElementById('p2-box');
    const pairCount = parseInt(document.getElementById('pairCount').value);
    grid.innerHTML = '';
    
    const isStudy = mode === 'study';
    const isMem2 = mode === 'mem2';

    // İki kişilik modda kutuları göster, değilse gizle
    p1Box.style.display = isMem2 ? 'flex' : 'none';
    p2Box.style.display = isMem2 ? 'flex' : 'none';

    grid.className = `grid ${isStudy ? '' : 'memory-mode'}`;

    let selectedWords = isStudy ? allWords : allWords.slice(0, pairCount);
    let displayList = [];

    if (isStudy) {
        displayList = selectedWords;
        // ÇALIŞMA MODU: Aşağı doğru doğal uzayan yapı
        grid.style.height = "auto"; 
        grid.style.gridTemplateColumns = "repeat(5, 1fr)";
        grid.style.gridAutoRows = "minmax(180px, auto)"; 
        grid.style.gridTemplateRows = "none"; 
    } else {
        selectedWords.forEach(w => {
            displayList.push({ text: w.ar, pairId: w.ar, lang: 'ar' });
            displayList.push({ text: w.tr, pairId: w.ar, lang: 'tr' });
        });
        displayList.sort(() => Math.random() - 0.5);
        
        // OYUN MODU: Ekranı tam kaplayan yapı
        let colCount = (displayList.length <= 12) ? 4 : 6;
        let rowCount = Math.ceil(displayList.length / colCount);
        
        grid.style.height = "100%"; 
        grid.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${rowCount}, 1fr)`; 
        grid.style.gridAutoRows = "none";
    }

    grid.setAttribute('data-total', displayList.length);

 displayList.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = isStudy ? item.ar : item.pairId;
        
        // Kart metinlerini belirle
        const frontText = isStudy ? (isAr ? item.ar : item.tr) : "";
        const backText = isStudy ? (isAr ? item.tr : item.ar) : item.text;
        
        // Dil sınıflarını ve font boyutlarını belirle
        let frontLangClass = "";
        let backLangClass = "";
        
        const isFrontAr = isStudy && isAr;
        const isBackAr = isStudy ? !isAr : (item.lang === 'ar');

        if (isStudy) {
            frontLangClass = isAr ? "lang-ar" : "lang-tr";
            backLangClass = isAr ? "lang-tr" : "lang-ar";
        } else {
            // Hafıza modunda ön yüz boş, arka yüz dile göre sınıf alır
            backLangClass = item.lang === 'ar' ? "lang-ar" : "lang-tr";
        }

        // Dinamik font boyutları (JS üzerinden kontrol devam ediyor)
        const baseFontSize = "clamp(1.2rem, 2.3vw, 2.2rem)";
        const arabicFontSize = "clamp(1.5rem, 4.5vw, 3.5rem)";

        const color = isStudy ? cardColors[index % cardColors.length] : "#5c7cfa";

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-front ${frontLangClass}" 
                     style="background-color: ${color}; font-size: ${isFrontAr ? arabicFontSize : baseFontSize}">
                    <span>${frontText}</span>
                </div>
                <div class="card-face card-back ${backLangClass}" 
                     style="font-size: ${isBackAr ? arabicFontSize : baseFontSize}">
                    <span>${backText}</span>
                </div>
            </div>`;
        
        card.onclick = () => handleFlip(card);
        grid.appendChild(card);
    });

    updateUI();
}

    function handleFlip(card) {
        if (card.classList.contains('matched') || (mode !== 'study' && activeFlipped.length >= 2)) return;

        if (mode === 'study') {
            if (card.classList.contains('flipped')) {
                clearTimeout(card.studyTimer);
                card.classList.remove('flipped');
            } else {
                playSound('snd-flip');
                card.classList.add('flipped');
                card.studyTimer = setTimeout(() => card.classList.remove('flipped'), 3000);
            }
            return;
        }

        if (card.classList.contains('flipped')) return;

        playSound('snd-flip');
        card.classList.add('flipped');
        activeFlipped.push(card);
        
        if (activeFlipped.length === 2) checkMatch();
    }

    function checkMatch() {
        const [a, b] = activeFlipped;
        const isMatch = a.dataset.id === b.dataset.id;

        setTimeout(() => {
            if (isMatch) {
                playSound('snd-match');
                a.classList.add('matched');
                b.classList.add('matched');
                if (mode === 'mem2') scores[currentPlayer - 1]++;
            } else {
                a.classList.remove('flipped');
                b.classList.remove('flipped');
                if (mode === 'mem2') currentPlayer = (currentPlayer === 1) ? 2 : 1;
            }
            activeFlipped = [];
            updateUI();
        }, 800);
    }

    function updateUI() {
        document.getElementById('s1').innerText = scores[0];
        document.getElementById('s2').innerText = scores[1];
        document.getElementById('p1-box').classList.toggle('active-p', currentPlayer === 1);
        document.getElementById('p2-box').classList.toggle('active-p', currentPlayer === 2);
    }

    function setMode(m) {
        mode = m; scores = [0, 0]; currentPlayer = 1; activeFlipped = [];
        
        const studyBtn = document.getElementById('btn-study');
        const mainLangBtn = document.getElementById('lang-btn-main');
        const memStartBtn = document.getElementById('btn-memory-start');
        const memControls = document.getElementById('memory-controls');
        const toggle = document.getElementById('mode-toggle');

        if (m === 'study') {
            studyBtn.style.display = 'inline-block';
            studyBtn.classList.add('active');
            mainLangBtn.style.display = 'inline-block';
            memStartBtn.style.display = 'inline-block';
            memControls.style.display = 'none';
        } else {
            studyBtn.style.display = 'none';
            mainLangBtn.style.display = 'none';
            memStartBtn.style.display = 'none';
            memControls.style.display = 'flex';
            if (toggle) toggle.checked = (m === 'mem2');
        }
        init();
    }

    function toggleSwitch(isCheck) {
        const toggle = document.getElementById('mode-toggle');
        toggle.checked = isCheck;
        toggleMemoryMode(toggle);
    }

    function toggleMemoryMode(checkbox) {
        const newMode = checkbox.checked ? 'mem2' : 'mem1';
        setMode(newMode);
    }

    window.onload = init;