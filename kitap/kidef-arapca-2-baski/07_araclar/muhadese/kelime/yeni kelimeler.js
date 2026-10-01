const allWords = [
        { ar: "بَيْت", tr: "Ev" }, { ar: "غُرْفَة", tr: "Oda" }, { ar: "بَاب", tr: "Kapı" },
        { ar: "نَافِذَة", tr: "Pencere" }, { ar: "مَطْبَخ", tr: "Mutfak" }, { ar: "حَمَّام", tr: "Banyo" },
        { ar: "حَدِيقَة", tr: "Bahçe" }, { ar: "سَطْح", tr: "Çatı" }, { ar: "دَرَج", tr: "Merdiven" },
        { ar: "مِصْعَد", tr: "Asansör" }, { ar: "سَرِير", tr: "Yatak" }, { ar: "خِزَانَة", tr: "Dolap" },
        { ar: "طَاوِلَة", tr: "Masa" }, { ar: "كُرْسِيّ", tr: "Sandalye" }, { ar: "أَرِيكَة", tr: "Koltuk" },
        { ar: "سِجَّادَة", tr: "Halı" }, { ar: "رَفّ", tr: "Raf" }, { ar: "مَكْتَب", tr: "Masa" },
        { ar: "وِسَادَة", tr: "Yastık" }, { ar: "سِتَارَة", tr: "Perde" }
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
        
        // Mobilde otomatik 9 çifti ayarla
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

        p1Box.style.display = isMem2 ? 'flex' : 'none';
        p2Box.style.display = isMem2 ? 'flex' : 'none';

        grid.className = `grid ${isStudy ? '' : 'memory-mode'}`;

        let selectedWords = isStudy ? allWords : allWords.slice(0, pairCount);
        let displayList = [];

        if (isStudy) {
            displayList = selectedWords;
            grid.setAttribute('data-total', selectedWords.length);
        } else {
            selectedWords.forEach(w => {
                displayList.push({ text: w.ar, pairId: w.ar });
                displayList.push({ text: w.tr, pairId: w.ar });
            });
            displayList.sort(() => Math.random() - 0.5);
            grid.setAttribute('data-total', displayList.length);
        }

        displayList.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.id = isStudy ? item.ar : item.pairId;
            
            const frontText = isStudy ? (isAr ? item.ar : item.tr) : "";
            const backText = isStudy ? (isAr ? item.tr : item.ar) : item.text;
            const color = isStudy ? cardColors[index % cardColors.length] : cardColors[0];

            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-face card-front" style="background-color: ${color}">${frontText}</div>
                    <div class="card-face card-back">${backText}</div>
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