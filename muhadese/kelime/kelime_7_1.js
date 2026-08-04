const allWords = [
     { tr: "Uyanıyorum", ar: "أَسْتَيْقِظُ" },
    { tr: "Abdest alıyorum", ar: "أَتَوَضَّأُ" },
    { tr: "Namaz kılıyorum", ar: "أُصَلِّي" },
    { tr: "Yiyorum / Kahvaltı yapıyorum", ar: "أَتَناوَلُ" },
    { tr: "Giyiniyorum", ar: "أَلْبَسُ" },
    { tr: "Gidiyorum", ar: "أَذْهَبُ" },
    { tr: "Dönüyorum", ar: "أَرْجِعُ" },
    { tr: "Yardım ediyorum", ar: "أُساعِدُ" },
    { tr: "Ders çalışıyorum", ar: "أَدْرُسُ" },
    { tr: "Uyuyorum", ar: "أَنامُ" },
    { tr: "Temizliyorum", ar: "أُنَظِّفُ" },
    { tr: "İçiyorum", ar: "أَشْرَبُ" },
    { tr: "Yiyorum", ar: "آكُلُ" },
    { tr: "İstiyorum", ar: "أُريدُ" },
    { tr: "Seviyorum", ar: "أُحِبُّ" },
    { tr: "Yıkıyorum", ar: "أَغْسِلُ" },
    { tr: "Geliyor", ar: "يَأْتي" },

    // Zaman Dilimleri ve Zarflar
    { tr: "Sabah", ar: "صَباحًا" },
    { tr: "Erken", ar: "مُبَكِّرًا" },
    { tr: "Öğle", ar: "ظُهْرًا" },
    { tr: "Akşam", ar: "مَساءً" },
    { tr: "Gece", ar: "لَيْلًا" },
    { tr: "Sonra", ar: "ثُمَّ / بَعْدَ" },
    { tr: "Önce", ar: "قَبْلَ" },
    { tr: "Çok", ar: "كَثيرًا" },
    { tr: "Şimdi / Saat", ar: "السّاعَة" },

    // Yiyecek ve İçecekler
    { tr: "Kahvaltı", ar: "الفَطور" },
    { tr: "Öğle yemeği", ar: "الغَداء" },
    { tr: "Akşam yemeği", ar: "العَشاء" },
    { tr: "Zeytin", ar: "الزَّيْتون" },
    { tr: "Peynir", ar: "الجُبْن" },
    { tr: "Süt", ar: "الحَليب" },
    { tr: "Et", ar: "اللَّحْم" },
    { tr: "Pirinç / Pilav", ar: "الأُرْز" },
    { tr: "Kahve", ar: "القَهْوَة" },
    { tr: "Balık", ar: "السَّمَك" },
    { tr: "Salata", ar: "السَّلَطَة" },
    { tr: "Meyve suyu", ar: "العَصير" },
    { tr: "Bal", ar: "العَسَل" },
    { tr: "Tereyağı", ar: "الزُّبْدَة" },
    { tr: "Tavuk", ar: "الدَّجاج" },
    { tr: "Ekmek", ar: "خُبْز" },
    { tr: "Çay", ar: "الشّاي" },
    { tr: "Köfte", ar: "الكُفْتَة" },
    { tr: "Makarna", ar: "المَكَرونَة" },

    // Mekan ve Eşya
    { tr: "Ev", ar: "البَيْت" },
    { tr: "Okul", ar: "المَدْرَسَة" },
    { tr: "Mescid / Cami", ar: "المَسْجِد" },
    { tr: "Elbiseler", ar: "مَلابِس" },
    { tr: "Dişler", ar: "أَسْنان" },
    { tr: "Oda", ar: "غُرْفَة" },

    // Namaz Vakitleri
    { tr: "Sabah namazı", ar: "الفَجْر" },
    { tr: "Yatsı namazı", ar: "العِشاء" },
    { tr: "İkindi namazı", ar: "العَصْر" },
     { tr: "Öğle namazı", ar: "الظُّهْر" },
    { tr: "Akşam namazı", ar: "المَغْرِب" },
    

    // Sayılar (Saatler için)
    
    { tr: "Üçüncü", ar: "الثّالِثَة" },
    { tr: "On ikinci", ar: "الثّانِيَة عَشْرَة" },
    { tr: "Beşinci", ar: "الخامِسَة" },
    { tr: "On birinci", ar: "الحادِيَة عَشْرَة" },
    { tr: "Altıncı", ar: "السّادِسَة" },
    { tr: "Yedinci", ar: "السّابِعَة" },
    { tr: "İkinci", ar: "الثّانِيَة" },
    { tr: "Sekizinci", ar: "الثّامِنَة" },
    { tr: "Birinci", ar: "الواحِدَة" },
    { tr: "Dokuzuncu", ar: "التّاسِعَة" },
    { tr: "Onuncu", ar: "العاشِرَة" },
    { tr: "Dördüncü", ar: "الرّابِعَة" },
    
    // Günler
    { tr: "Pazartesi", ar: "الاِثْنَيْن" },
    { tr: "Cumartesi", ar: "السَّبْت" },
    { tr: "Çarşamba", ar: "الأَرْبِعاء" },
    { tr: "Salı", ar: "الثُّلاثاء" },
    { tr: "Cuma", ar: "الجُمُعَة" },
    { tr: "Pazar", ar: "الأَحَد" },
    { tr: "Perşembe", ar: "الخَميس" }
];

    const cardColors = ["#364fc7", "#63e6be", "#ff922b", "#f06595", "#845ef7", "#51cf66", "#fcc419", "#339af0"];
    let mode = 'study', isAr = true, scores = [0, 0], currentPlayer = 1, activeFlipped = [];

    function playSound(id) {
    const s = document.getElementById(id);
    if (!s) return;
    s.pause();          // Eğer çalıyorsa durdur
    s.currentTime = 0;  // Sesi en başa sar
    s.volume = 0.15;
    s.play().catch(e => console.log("Ses oynatılamadı:", e));
}

    function toggleLang() {
        playSound('snd-click'); // Dil değiştiğinde çal
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
    // 1. Durum Kontrolü: Eşleşmiş kart veya hafıza modunda 2'den fazla kart çevrilmişse işlem yapma
    if (card.classList.contains('matched') || (mode !== 'study' && activeFlipped.length >= 2)) return;

    // --- KARTLAR (STUDY) MODU ---
    if (mode === 'study') {
        if (card.classList.contains('flipped')) {
            // El ile kapatma
            playSound('snd-flip'); // Kapanırken de ses ver
            clearTimeout(card.studyTimer);
            card.classList.remove('flipped');
        } else {
            // Açma
            playSound('snd-flip');
            card.classList.add('flipped');
            // Otomatik kapatma zamanlayıcısı
            card.studyTimer = setTimeout(() => {
                // Eğer kart hala açıksa ve kullanıcı kapatmamışsa sesi çalarak kapat
                if(card.classList.contains('flipped')) {
                    playSound('snd-flip'); 
                    card.classList.remove('flipped');
                }
            }, 3000);
        }
        return;
    }

    // --- HAFIZA OYUNU MODU ---
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
            // EŞLEŞME DOĞRU
            playSound('snd-match');
            a.classList.add('matched');
            b.classList.add('matched');
            
            // Skor güncelleme (Çift kişilik modda ilgili oyuncuya, tek kişilikte genel skora)
            if (mode === 'mem2') {
                scores[currentPlayer - 1]++;
            } else {
                scores[0]++; // Tek kişilik modda puanı s1'de tutabilirsiniz
            }
        } else {
            // EŞLEŞME YANLIŞ
            // Not: snd-wrong eklediyseniz playSound('snd-wrong') burada kalmalı
            if (typeof playSound !== 'undefined') playSound('snd-wrong'); 
            
            a.classList.remove('flipped');
            b.classList.remove('flipped');
            
            // Sıra değiştirme (Sadece çift kişilik modda)
            if (mode === 'mem2') {
                currentPlayer = (currentPlayer === 1) ? 2 : 1;
            }
        }
        
        // Diziyi sıfırla ve arayüzü güncelle
        activeFlipped = [];
        updateUI();
        
        // Oyun bitti mi kontrolü buraya eklenebilir
        checkGameOver(); 
    }, 800);
}

    function updateUI() {
        document.getElementById('s1').innerText = scores[0];
        document.getElementById('s2').innerText = scores[1];
        document.getElementById('p1-box').classList.toggle('active-p', currentPlayer === 1);
        document.getElementById('p2-box').classList.toggle('active-p', currentPlayer === 2);
    }

    function setMode(m) {
       playSound('snd-click'); // Mod değiştiğinde çal
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