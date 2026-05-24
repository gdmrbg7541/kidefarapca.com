// Tamamen Arapça harflerden oluşan temiz veritabanı
const RED_CARDS = [
    { root: "حـ ـكـ ـم", num: "17", pattern: "فَعَلَ", hint: "👉🏼 Maçı yöneten yetkili kişi:", ar: "حَكَم", tr: "Hakem" },
    { root: "نـ ـقـ ـل", num: "36", pattern: "مَفْعُول", hint: "👉🏼 Taşınabilir mülk, nakledilmiş:", ar: "مَنْقُول", tr: "Menkûl" },
    { root: "عـ ـمـ ـل", num: "55", pattern: "إِفْعَال", hint: "👉🏼 Bir kuralı veya sistemi yürürlüğe koyma, üretme:", ar: "إِعْمَال", tr: "İ’mâl etmek" },
    { root: "حـ ـفـ ـظ", num: "67", pattern: "مُفَاعَلَة", hint: "👉🏼 Değerli bir şeyi koruma altına alma, saklama:", ar: "مُحَافَظَة", tr: "Muhafaza etmek" },
    { root: "عـ ـر ـف", num: "21", pattern: "فُعْل", hint: "👉🏼 Toplumca kabul görmüş gelenek ve adetler:", ar: "عُرْف", tr: "Örf" },
    { root: "حـ ـفـ ـظـ + ـة", num: "33", pattern: "فَاعِلَة", hint: "👉🏼 Bilgilerin saklandığı zihinsel depo veya bilgisayar donanımı:", ar: "حَافِظَة", tr: "Hâfıza" },
    { root: "ر ـحـ ـم", num: "103", pattern: "اِسْتِفْعَال", hint: "👉🏼 Merhamet dileme, af ve acıma talep etme:", ar: "اِسْتِرْحَام", tr: "İstirham etmek" },
    { root: "لـ ـفـ ـت", num: "80", pattern: "اِلْتِفَات", hint: "👉🏼 İlgi gösterme, nezaketle yönelme, övgü:", ar: "اِلْتِفَات", tr: "İltifat" },
    { root: "حـ ـر ـب", num: "67", pattern: "مُفَاعَلَة", hint: "👉🏼 Karşılıklı silahlı çatışma, savaş durumu:", ar: "مُحَارَبَة", tr: "Muharebe" },
    { root: "ر ـحـ ـم", num: "28", pattern: "فَعْلَان", hint: "👉🏼 Sonsuz merhamet sahibi olan (Yaratıcı ismi):", ar: "رَحْمَان", tr: "Rahmân" },
    { root: "لـ ـطـ ـف", num: "35", pattern: "فَعِيل", hint: "👉🏼 Hoş, nazik, derin incelikleri olan güzel isim:", ar: "لَطِيف", tr: "Latîf" },
    { root: "حـ ـكـ ـم", num: "21", pattern: "فُعْل", hint: "👉🏼 Karar, otorite, yargı sonucu:", ar: "حُكْم", tr: "Hüküm" }
];

let activeCards = [];
let currentCardIndex = 0;
let score1 = 0, score2 = 0;
let gameState = 0; 

// BLUR HAFIZASI
let blurStates = { num: false, pattern: false, hint: false };

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

    // Anasayfa SVG Tuşu Kontrolü
    const homeBtn = document.getElementById('home-btn');
    if (id === 'screen-intro') {
        homeBtn.style.display = 'flex';
    } else {
        homeBtn.style.display = 'none';
    }
}

function startGame(cat) {
    currentCardIndex = 0;
    activeCards = shuffleArray([...RED_CARDS]);
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
    document.getElementById('display-pattern-name').innerText = card.pattern;
    document.getElementById('display-hint').innerText = card.hint;
    document.getElementById('display-ar-answer').innerText = card.ar;
    document.getElementById('display-tr-answer').innerText = card.tr;
    document.getElementById('current-index').innerText = currentCardIndex + 1;
    
    // Taşma Koruması
    if (card.root.includes('+') || card.root.length > 13) {
        rootEl.style.fontSize = "110px";
    } else {
        rootEl.style.fontSize = "180px";
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
            document.getElementById('display-pattern-num').style.display = 'block';
            document.getElementById('display-pattern-name').style.display = 'block';
            document.getElementById('display-hint').style.display = 'block';
            
            setTimeout(() => {
                document.getElementById('display-pattern-num').classList.add('active');
                document.getElementById('display-pattern-name').classList.add('active');
                document.getElementById('display-hint').classList.add('active');
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

function addScore(p) {
    p === 1 ? score1++ : score2++;
    document.getElementById('score-1').innerText = score1;
    document.getElementById('score-2').innerText = score2;
}

function resetScores() {
    score1 = 0; score2 = 0;
    document.getElementById('score-1').innerText = "0";
    document.getElementById('score-2').innerText = "0";
}

function exitArena() {
    resetScores();
    showScreen('screen-intro');
}

// KLAVYE VE SUNUM KUMANDASI (İleri / Geri fark etmeksizin hep sonraki aşamaya geçer)
window.addEventListener('keydown', (e) => {
    const triggerKeys = [' ', 'Enter', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'PageDown', 'PageUp'];
    if(triggerKeys.includes(e.key)) {
        if(document.getElementById('screen-arena').classList.contains('active')) {
            e.preventDefault(); 
            triggerAction();
        }
    }
});