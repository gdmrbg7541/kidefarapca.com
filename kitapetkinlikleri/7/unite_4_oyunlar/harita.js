// 1. Şehir Verileri
const cityData = [
    { id: "TR34", ar: "إِسْطَنْبول" },
    { id: "TR06", ar: "أَنْقَرَة" },
    { id: "TR33", ar: "مَرْسين" },
    { id: "TR16", ar: "بورْصَة" },
    { id: "TR57", ar: "سينوب" },
    { id: "TR65", ar: "وان" },
    { id: "TR35", ar: "إِزْمير" },
    { id: "TR42", ar: "قونْيا" },
    { id: "TR72", ar: "باطْمان" },
    { id: "TR21", ar: "دِيارْ بَكْر" },
    { id: "TR25", ar: "أَرْضُروم" },
    { id: "TR38", ar: "قَيْصَري" },
    { id: "TR03", ar: "أَفْيون" },
    { id: "TR61", ar: "طِرابْزون" },
    { id: "TR58", ar: "سيواس" },
    { id: "TR55", ar: "سامْسون" },
    { id: "TR07", ar: "أَنْطالْيا" },
    { id: "TR47", ar: "مارْدين" }
];

let currentStep = 0;
let shuffledCities = [];
const limit = 18;

const audioFiles = {
    "TR34": "istanbul", "TR06": "ankara", "TR33": "mersin",
    "TR16": "bursa", "TR57": "sinop", "TR65": "van",
    "TR35": "izmir", "TR42": "konya", "TR72": "batman",
    "TR21": "diyarbakir", "TR25": "erzurum", "TR38": "kayseri",
    "TR03": "afyon", "TR61": "trabzon", "TR58": "sivas",
    "TR55": "samsun", "TR07": "antalya", "TR47": "mardin"
};

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').classList.remove('hidden');

    // Harita SVG dosyasını HTML içine basıyoruz
    document.getElementById('map-container').innerHTML = haritaSVGContent;

    const navBtn = document.getElementById('nav-btn');
    if (navBtn) navBtn.onclick = function(e) { e.preventDefault(); location.reload(); };

    shuffledCities = [...cityData].sort(() => 0.5 - Math.random()).slice(0, limit);

    const paths = document.querySelectorAll('path');
    paths.forEach(path => {
        path.onclick = function() { handleCityClick(this.id); };
        path.classList.remove('highlight-city', 'answered-correct-fixed', 'wrong-answer');
        path.style.fill = ""; 

        const isKnownCity = cityData.some(city => city.id === path.id);
        if (isKnownCity) path.classList.add('highlight-city');
    });

    currentStep = 0;
    showQuestion();
}

function showQuestion() {
    if (currentStep >= shuffledCities.length) {
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('end-screen').classList.remove('hidden');
        document.getElementById('end-screen').style.display = 'flex';
        document.getElementById('final-score').innerText = `18 / 18 إِجابَة صَحيحَة`;
        return;
    }
    
    const currentCity = shuffledCities[currentStep];
    if (!currentCity) return;

    const targetWordElem = document.getElementById('target-word');
    if (targetWordElem) targetWordElem.innerText = `أَيْن تَقَعُ مَدينَة ${currentCity.ar}؟`;
    
    const fileName = audioFiles[currentCity.id];
    if (fileName) {
        setTimeout(() => {
            const audio = new Audio(`${fileName}.mp3`);
            audio.play().catch(e => console.log("Ses çalınamadı"));
        }, 800);
    }

    const progressBar = document.getElementById('progress');
    if (progressBar) {
        const progressWidth = (currentStep / limit) * 100;
        progressBar.style.width = progressWidth + "%";
    }
}

function handleCityClick(clickedId) {
    const currentCity = shuffledCities[currentStep];
    if (!currentCity) return;

    const element = document.getElementById(clickedId);
    if (!element) return;

    const mapFeatures = document.getElementById('features');
    if (mapFeatures) mapFeatures.style.pointerEvents = 'none';

    const isCorrect = (clickedId === currentCity.id);

    if (isCorrect) {
        playSound('success');
        element.classList.remove('highlight-city');
        element.classList.add('answered-correct-fixed'); 
    } else {
        playSound('error');
        element.classList.add('wrong-answer');
        // Show the correct city in green
        const correctElement = document.getElementById(currentCity.id);
        if (correctElement) {
            correctElement.classList.add('answered-correct-fixed');
            correctElement.classList.remove('highlight-city');
        }
    }

    setTimeout(() => { 
        if (!isCorrect) element.classList.remove('wrong-answer'); 
        
        showStudentOverlay(
            isCorrect ? "!أَحْسَنْت" : "لِلْأَسَف", 
            isCorrect ? "إِجابَة صَحيحَة" : "إِجابَة خاطِئَة"
        ); 
        
        currentStep++;
    }, 600);
}

function showStudentOverlay(title, subtitle) {
    const overlay = document.getElementById('student-overlay');
    const msgElem = document.getElementById('overlay-msg');
    const subElem = document.getElementById('overlay-sub'); 
    
    if (overlay) {
        if (msgElem) {
            msgElem.innerText = title;
            msgElem.style.color = (title === "!أَحْسَنْت") ? "var(--success)" : "var(--danger)";
        }
        if (subElem) subElem.innerText = subtitle;
        overlay.classList.remove('hidden');
    } else {
        closeOverlay();
    }
}

function closeOverlay() {
    const overlay = document.getElementById('student-overlay');
    if (overlay) overlay.classList.add('hidden');
    
    const mapFeatures = document.getElementById('features');
    if (mapFeatures) mapFeatures.style.pointerEvents = 'all'; 
    
    showQuestion();
}

function playSound(type) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        if (type === 'success') {
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
            oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.2);
        } else {
            oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.3);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
            oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.4);
        }
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
    } catch(e) { console.log("Ses sistemi hatası."); }
}


// ==========================================
// DOĞRU/YANLIŞ MODU
// ==========================================

const tfData = [
    { q: "إِزْمير تَقَعُ في غَرْب تُرْكِيا.", a: true },
    { q: "أَنْطالْيا تَقَعُ في جَنوب تُرْكِيا.", a: true },
    { q: "أَرْضُروم تَقَعُ في شَرْق تُرْكِيا.", a: true },
    { q: "سامْسون تَقَعُ في شَمال تُرْكِيا.", a: true },
    { q: "أَنْقَرَة تَقَعُ في وَسَط تُرْكِيا.", a: true },
    { q: "سينوب تَقَعُ في شَمال تُرْكِيا.", a: true },
    { q: "مارْدين تَقَعُ في جَنوب تُرْكِيا.", a: true },
    { q: "قَيْصَري تَقَعُ في وَسَط تُرْكِيا.", a: true },
    
    { q: "وان تَقَعُ في غَرْب تُرْكِيا.", a: false },
    { q: "طِرابْزون تَقَعُ في جَنوب تُرْكِيا.", a: false },
    { q: "إِسْطَنْبول تَقَعُ في شَرْق تُرْكِيا.", a: false },
    { q: "مَرْسين تَقَعُ في شَمال تُرْكِيا.", a: false },
    { q: "دِيار بَكْر تَقَعُ في غَرْب تُرْكِيا.", a: false },
    { q: "بورْصَة تَقَعُ في شَرْق تُرْكِيا.", a: false },
    { q: "قونْيا تَقَعُ في شَمال تُرْكِيا.", a: false },
    { q: "باطْمان تَقَعُ في غَرْب تُرْكِيا.", a: false }
];

let tfMode = 2;
let currentTFIndex = 0;
let p1Choice = null;
let p2Choice = null;
let tfHistory = {}; 


function splitTFButtons(container) {
    if (!container) return;
    const mainText = document.getElementById('tf-main-text');
    const subBtns = document.getElementById('tf-sub-btns');
    if (mainText) mainText.style.display = 'none';
    if (subBtns) subBtns.style.display = 'flex';
    
    container.style.cursor = 'default';
    container.onclick = null;
}

function startTFGame(mode) {
    tfMode = mode || 2;

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('tf-screen').classList.remove('hidden');
    
    const p1Panel = document.getElementById('p1-panel');
    const p2Panel = document.getElementById('p2-panel');
    if (tfMode === 1) {
        if (p2Panel) p2Panel.style.display = 'none';
        if (p1Panel) {
            p1Panel.style.flex = '0 1 800px';
            p1Panel.style.margin = '0 auto';
        }
    } else {
        if (p2Panel) p2Panel.style.display = 'flex';
        if (p1Panel) {
            p1Panel.style.flex = '1';
            p1Panel.style.margin = '0';
        }
    }
    
    const yonetgeSesi = document.getElementById('tf-ses');
    if (yonetgeSesi) {
        yonetgeSesi.currentTime = 0; 
        yonetgeSesi.play().catch(e => console.log("Ses çalınamadı. Detay:", e));
    }

    const navBtn = document.getElementById('nav-btn');
    if (navBtn) navBtn.onclick = function(e) { e.preventDefault(); location.reload(); };

    tfData.sort(() => 0.5 - Math.random());
    currentTFIndex = 0;
    tfHistory = {}; 
    loadTFQuestions();
}

function loadTFQuestions() {
    p1Choice = null;
    p2Choice = null;

    if (tfMode === 1) {
        const q1 = tfData[currentTFIndex % tfData.length];
        document.getElementById('p1-question').innerText = q1.q;
        document.getElementById('p1-question').dataset.ans = q1.a;

        const currentRound = currentTFIndex % 3; 
        const blockStartIdx = Math.floor(currentTFIndex / 3) * 3;

        for(let i = 0; i < 3; i++) {
            const historyData = tfHistory[blockStartIdx + i];
            // HTML defines p1-panel's bars as p2-bar-1 etc.
            const b1 = document.getElementById(`p2-bar-${i + 1}`);
            
            if (b1) {
                if (historyData) {
                    const qAns = tfData[(blockStartIdx + i) % tfData.length].a;
                    b1.style.background = (historyData.p1 === qAns) ? "var(--success)" : "var(--danger)";
                    b1.style.boxShadow = (historyData.p1 === qAns) ? "0 0 10px rgba(39, 174, 96, 0.4)" : "0 0 10px rgba(231, 76, 60, 0.4)";
                } else if (i === currentRound) {
                    b1.style.background = "var(--primary)";
                    b1.style.boxShadow = "0 2px 8px rgba(44, 62, 80, 0.3)";
                } else {
                    b1.style.background = "#e2e8f0";
                    b1.style.boxShadow = "none";
                }
            }
        }
    } else {
        const q1 = tfData[currentTFIndex % tfData.length];
        const q2 = tfData[(currentTFIndex + 1) % tfData.length];
        
        document.getElementById('p1-question').innerText = q1.q;
        document.getElementById('p1-question').dataset.ans = q1.a;
        
        document.getElementById('p2-question').innerText = q2.q;
        document.getElementById('p2-question').dataset.ans = q2.a;

        const currentRound = (currentTFIndex / 2) % 3; 
        const blockStartIdx = Math.floor(currentTFIndex / 6) * 6;

        for(let i = 0; i < 3; i++) {
            const historyData = tfHistory[blockStartIdx + (i * 2)];
            const b1 = document.getElementById(`p1-bar-${i + 1}`);
            const b2 = document.getElementById(`p2-bar-${i + 1}`);
            
            if (b1 && b2) {
                if (historyData) {
                    const q1Ans = tfData[(blockStartIdx + (i*2)) % tfData.length].a;
                    const q2Ans = tfData[(blockStartIdx + (i*2) + 1) % tfData.length].a;
                    b1.style.background = (historyData.p1 === q1Ans) ? "var(--success)" : "var(--danger)";
                    b1.style.boxShadow = (historyData.p1 === q1Ans) ? "0 0 10px rgba(39, 174, 96, 0.4)" : "0 0 10px rgba(231, 76, 60, 0.4)";
                    b2.style.background = (historyData.p2 === q2Ans) ? "var(--success)" : "var(--danger)";
                    b2.style.boxShadow = (historyData.p2 === q2Ans) ? "0 0 10px rgba(39, 174, 96, 0.4)" : "0 0 10px rgba(231, 76, 60, 0.4)";
                } else if (i === currentRound) {
                    b1.style.background = "var(--primary)";
                    b1.style.boxShadow = "0 2px 8px rgba(44, 62, 80, 0.3)";
                    b2.style.background = "var(--primary)";
                    b2.style.boxShadow = "0 2px 8px rgba(44, 62, 80, 0.3)";
                } else {
                    b1.style.background = "#e2e8f0";
                    b1.style.boxShadow = "none";
                    b2.style.background = "#e2e8f0";
                    b2.style.boxShadow = "none";
                }
            }
        }
    }

    document.querySelectorAll('.tf-btn').forEach(btn => {
        btn.classList.remove('tf-correct', 'tf-wrong');
        btn.style.background = "";
        btn.style.borderColor = "";
        btn.style.opacity = "1";
        btn.disabled = false;
    });

    const nextBtn = document.getElementById('tf-next-btn');
    const prevBtn = document.getElementById('tf-prev-btn');
    
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) {
        nextBtn.style.display = "none";
        nextBtn.disabled = true;
        nextBtn.classList.remove('active');
    }
}

function answerTF(player, choice) {
    if (tfMode === 1) {
        if (player === 1 && p1Choice !== null) return;
        p1Choice = choice;

        const pPanel = document.getElementById(`p${player}-panel`);
        const qElem = document.getElementById(`p${player}-question`);
        const correctAns = qElem.dataset.ans === "true";
        const isCorrect = (choice === correctAns);

        pPanel.querySelectorAll('.tf-btn').forEach(b => {
            b.disabled = true;
            b.style.opacity = "0.4"; 
            b.style.background = "";
            b.style.borderColor = "";
        });

        const selectedBtn = pPanel.querySelector(choice ? '.tf-true' : '.tf-false');
        selectedBtn.style.opacity = "1";
        
        if (isCorrect) {
            selectedBtn.classList.add('tf-correct');
            playSound('success');
        } else {
            selectedBtn.classList.add('tf-wrong');
            const actualCorrectBtn = pPanel.querySelector(correctAns ? '.tf-true' : '.tf-false');
            actualCorrectBtn.classList.add('tf-correct');
            actualCorrectBtn.style.opacity = "1";
            playSound('error');
        }

        const currentRound = currentTFIndex % 3;
        // p1-panel uses p2-bar-x ids in HTML!
        const pBar = document.getElementById(`p2-bar-${currentRound + 1}`);
        if (pBar) {
            pBar.style.background = isCorrect ? "var(--success)" : "var(--danger)";
            pBar.style.boxShadow = isCorrect ? "0 0 10px rgba(39, 174, 96, 0.4)" : "0 0 10px rgba(231, 76, 60, 0.4)";
        }

        tfHistory[currentTFIndex] = { p1: p1Choice };
        
        if (currentRound < 2) {
            setTimeout(() => {
                nextTFTurn();
            }, 1500);
        } else {
            const nextBtn = document.getElementById('tf-next-btn');
            if (nextBtn) {
                nextBtn.style.display = "block";
                nextBtn.disabled = false;
                nextBtn.classList.add('active');
            }
        }

    } else {
        if (player === 1 && p1Choice !== null) return;
        if (player === 2 && p2Choice !== null) return;

        if (player === 1) p1Choice = choice;
        if (player === 2) p2Choice = choice;

        const pPanel = document.getElementById(`p${player}-panel`);
        const qElem = document.getElementById(`p${player}-question`);
        const correctAns = qElem.dataset.ans === "true";
        const isCorrect = (choice === correctAns);

        pPanel.querySelectorAll('.tf-btn').forEach(b => {
            b.disabled = true;
            b.style.opacity = "0.4"; 
            b.style.background = "";
            b.style.borderColor = "";
        });

        const selectedBtn = pPanel.querySelector(choice ? '.tf-true' : '.tf-false');
        selectedBtn.style.opacity = "1";
        
        if (isCorrect) {
            selectedBtn.classList.add('tf-correct');
            playSound('success');
        } else {
            selectedBtn.classList.add('tf-wrong');
            const actualCorrectBtn = pPanel.querySelector(correctAns ? '.tf-true' : '.tf-false');
            actualCorrectBtn.classList.add('tf-correct');
            actualCorrectBtn.style.opacity = "1";
            playSound('error');
        }

        const currentRound = (currentTFIndex / 2) % 3;
        const pBar = document.getElementById(`p${player}-bar-${currentRound + 1}`);
        if (pBar) {
            pBar.style.background = isCorrect ? "var(--success)" : "var(--danger)";
            pBar.style.boxShadow = isCorrect ? "0 0 10px rgba(39, 174, 96, 0.4)" : "0 0 10px rgba(231, 76, 60, 0.4)";
        }

        if (p1Choice !== null && p2Choice !== null) {
            tfHistory[currentTFIndex] = { p1: p1Choice, p2: p2Choice };
            
            if (currentRound < 2) {
                setTimeout(() => {
                    nextTFTurn();
                }, 1500);
            } else {
                const nextBtn = document.getElementById('tf-next-btn');
                if (nextBtn) {
                    nextBtn.style.display = "block";
                    nextBtn.disabled = false;
                    nextBtn.classList.add('active');
                }
            }
        }
    }
}

function nextTFTurn() {
    if (tfMode === 1) {
        currentTFIndex += 1;
    } else {
        currentTFIndex += 2;
    }
    loadTFQuestions();
}

function prevTFTurn() {
    if (tfMode === 1) {
        if (currentTFIndex >= 1) currentTFIndex -= 1;
    } else {
        if (currentTFIndex >= 2) currentTFIndex -= 2;
    }
    loadTFQuestions();
}


