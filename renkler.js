document.addEventListener('DOMContentLoaded', () => {

    // --- DATA MODULE ---
    const Data = {
        colors: {
            title: "Seviye 1: Renkler",
            words: {
                unit1: {
                    title: { tr: "Ünite 1" }, description: { tr: "Temel Renkler" },
                    lessons: {
                        lesson1: {
                            description: { tr: "Renkler Testi" },
                            words: [
                                { id: 1, arabic: 'أَحْمَر', turkish: 'Kırmızı', cssColor: '#E74C3C' },
                                { id: 2, arabic: 'أَزْرَق', turkish: 'Mavi', cssColor: '#3498DB' },
                                { id: 3, arabic: 'أَصْفَر', turkish: 'Sarı', cssColor: '#F1C40F' },
                                { id: 4, arabic: 'أَخْضَر', turkish: 'Yeşil', cssColor: '#2ECC71' },
                                { id: 5, arabic: 'بُنِّيّ', turkish: 'Kahverengi', cssColor: '#A0522D' },
                                { id: 6, arabic: 'وَرْدِيّ', turkish: 'Pembe', cssColor: '#FFC0CB' },
                                { id: 7, arabic: 'بُرتُقَالِيّ', turkish: 'Turuncu', cssColor: '#E67E22' },
                                { id: 8, arabic: 'بَنَفْسَجِيّ', turkish: 'Mor', cssColor: '#8E44AD' }, // Yazım düzeltildi
                                { id: 9, arabic: 'أَبْيَض', turkish: 'Beyaz', cssColor: '#FFFFFF' }, // Daha canlı beyaz
                                { id: 10, arabic: 'أَسْوَد', turkish: 'Siyah', cssColor: '#000000' }  // Daha canlı siyah
                            ]
                        }
                    }
                }
            }
        }
    };
    // --- DATA MODULE SONU ---

    // --- UTILS MODULE ---
    const Utils = { shuffleArray: (arr) => [...arr].sort(() => 0.5 - Math.random()) };

    // --- APP MODULE ---
    const App = {
        state: { selectedPlayers: null, selectedLessonId: null, isAudioInitialized: false, audioCtx: null, theOnlyLessonId: 'colors-unit1-lesson1' },
        dom: { screens: document.querySelectorAll('.screen'), startScreen: document.getElementById('start-screen'), gameScreen: document.getElementById('quiz-screen'), resultsScreen: document.getElementById('results-screen'), playerSelect: document.getElementById('player-select'), startGameBtn: document.getElementById('start-game-btn'), },
        init() { this.initStartScreenListeners(); QuizGame.init(); this.showScreen('start-screen'); },
        showScreen(screenId) { this.dom.screens.forEach(s => s.classList.remove('active')); const tS = document.getElementById(screenId); if (tS) { tS.classList.add('active'); tS.scrollTop = 0; } if (screenId === 'start-screen') { this.state.selectedPlayers = null; this.state.selectedLessonId = null; this.updateSelection(this.dom.playerSelect, null); this.checkStartButtonState(); } },
        initAudio() { if(this.state.audioCtx&&this.state.audioCtx.state==='running'){this.state.isAudioInitialized=true;return Promise.resolve();}if(this.state.isAudioInitialized&&this.state.audioCtx&&this.state.audioCtx.state==='suspended'){return this.state.audioCtx.resume();}this.state.isAudioInitialized=true;try{if(!this.state.audioCtx){this.state.audioCtx=new(window.AudioContext||window.webkitAudioContext)();}if(this.state.audioCtx.state==='suspended'){return this.state.audioCtx.resume();}else{return Promise.resolve();}}catch(e){console.error("Web Audio API desteklenmiyor.");this.state.isAudioInitialized=false;return Promise.reject(e);} },
        playSound(key) { if(!this.state.isAudioInitialized||!this.state.audioCtx||this.state.audioCtx.state!=='running'){return;}const sounds={menuClick:{f:600,t:'square',d:0.08},touch:{f:300,t:'sine',d:0.05},correct:{f:523.25,t:'sine',d:0.2},incorrect:{f:164.81,t:'square',d:0.2},countdown:{f:880,t:'sine',d:0.15}};const s=sounds[key];if(!s)return;const g=this.state.audioCtx.createGain();g.connect(this.state.audioCtx.destination);g.gain.setValueAtTime(0,this.state.audioCtx.currentTime);g.gain.linearRampToValueAtTime(0.1,this.state.audioCtx.currentTime+0.01);g.gain.linearRampToValueAtTime(0,this.state.audioCtx.currentTime+s.d);const o=this.state.audioCtx.createOscillator();o.type=s.t;o.frequency.value=s.f;o.connect(g);o.start(0);o.stop(this.state.audioCtx.currentTime+s.d); },
        initStartScreenListeners() {
            this.dom.playerSelect.addEventListener('click', async e => { const btn=e.target.closest('.player-button'); if(!btn)return; try{await this.initAudio();}catch(err){console.warn("Ses başlatılamadı.");} this.playSound('touch'); this.state.selectedPlayers=parseInt(btn.dataset.players,10); this.updateSelection(this.dom.playerSelect,btn); this.state.selectedLessonId=this.state.theOnlyLessonId; this.checkStartButtonState(); });
            this.dom.startGameBtn.onclick=async()=>{ try{await this.initAudio();}catch(e){console.error("Ses başlatılamadı:",e);} this.playSound('menuClick'); const{selectedPlayers,selectedLessonId}=this.state; if(!selectedPlayers||!selectedLessonId){console.error("HATA: Oyuncu/Ders seçilmedi!");this.checkStartButtonState();return;} const words=this.getWords(selectedLessonId); let wordsForGame; if(selectedPlayers===1){if(!words||words.length<4){alert(`Yeterli (en az 4) kelime yok.`);return;} wordsForGame=Utils.shuffleArray(words);}else{const qC=5;if(!words||words.length<10){alert(`2P için yeterli (en az 10) kelime yok. (Mevcut: ${words.length})`);return;} wordsForGame=Utils.shuffleArray(words).slice(0,qC);} if(wordsForGame.length===0){alert("Kelime bulunamadı.");return;} QuizGame.start(wordsForGame,selectedPlayers); this.showScreen('quiz-screen'); };
        },
        updateSelection(cont,selBtn){cont?.querySelectorAll('.selected').forEach(b=>b.classList.remove('selected'));selBtn?.classList.add('selected');},
        checkStartButtonState(){const isDisabled=!(this.state.selectedPlayers&&this.state.selectedLessonId);if(this.dom.startGameBtn){this.dom.startGameBtn.disabled=isDisabled;}else{console.error("Başla butonu bulunamadı!");}},
        loadProgress(){/*Gerek yok*/}, saveProgress(){/*Gerek yok*/}, getAllLessonIdsOrdered(){return[this.state.theOnlyLessonId];}, unlockNextLesson(id){return false;}, populateLessonSelector(){/*Gerek yok*/},
        getWords(id){if(!id)return[];try{const p=id.split('-');const g=p[0];const u=p[1];const l=p[2];return Data[g]?.words[u]?.lessons[l]?.words||[];}catch(e){console.error("Kelime alınırken hata:",e);return[];}},
        getAllWords(){if(Data.colors&&Data.colors.words){return Object.values(Data.colors.words).flatMap(u=>Object.values(u.lessons).flatMap(l=>l.words||[]));}return[];},
        initNavigation(){/*Gerek yok*/},
        showResults(data){const rS=document.getElementById('results-screen');let h=`<div class="header-navigation"><button class="back-btn" title="Ana Menü"><svg viewBox="0 0 24 24"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"></path></svg></button></div>`;const iS=`<svg viewBox="0 0 24 24"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>`;if(data.playerMode===1){const fS=Math.round(data.score);let sC=0;if(fS>=85){sC=3;}else if(fS>50){sC=2;}else if(fS===50){sC=1;}const gSH=(c,s="clamp(40px, 8vw, 60px)")=>{const svg=`<svg viewBox="0 0 24 24" style="width:${s};height:${s};" fill="%s"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>`;const f=svg.replace('%s','var(--accent-color)');const e=svg.replace('%s','#eceff4');let h='';for(let i=0;i<3;i++){h+=(i<c)?f:e;}return `<div id="quiz-winner-icon-container" class="star-rating">${h}</div>`;};let t='';let m='';const sz=(sC===3)?"clamp(60px,12vw,90px)":"clamp(40px,8vw,60px)";const sH=gSH(sC,sz);if(sC===3){t="Mükemmel!";m=`<p class="unlocked-message">Tebrikler! Mükemmel bir iş çıkardın!</p>`;}else if(sC===2){t="İyi İş!";m=`<p>Biraz daha gayretle 3 yıldıza ulaşabilirsin!</p>`;}else if(sC===1){t="Fena Değil!";m=`<p>Tekrar deneyerek puanını yükseltebilirsin.</p>`;}else{t="Tekrar Deneyin!";m=`<p>Daha iyi bir sonuç için tekrar oyna.</p>`;}h+=` <h2 id="quiz-win-text">${t}</h2> ${sH} <h3>Skor: ${fS} Puan</h3> ${m} <div class="win-buttons"> <button class="icon-btn" id="play-again-btn" title="Tekrar Oyna"><svg viewBox="0 0 24 24"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"></path></svg></button> <button class="icon-btn" id="back-to-start-btn" title="Ana Menü"><svg viewBox="0 0 24 24"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"></path></svg></button> </div>`;rS.innerHTML=h;rS.querySelector('.back-btn').onclick=()=>{App.playSound('menuClick');App.showScreen('start-screen');};rS.querySelector('#play-again-btn').onclick=async()=>{await App.initAudio();App.playSound('menuClick');const w=App.getWords(App.state.selectedLessonId);if(!w||w.length<4){App.showScreen('start-screen');return;}QuizGame.start(Utils.shuffleArray(w),1);App.showScreen('quiz-screen');};rS.querySelector('#back-to-start-btn').onclick=()=>{App.playSound('menuClick');App.showScreen('start-screen');};}else{let txt,wCls,iHtml='';if(data.winner===1){txt='1. Oyuncu Kazandı!';wCls='p1-win';iHtml=iS;}else if(data.winner===2){txt='2. Oyuncu Kazandı!';wCls='p2-win';iHtml=iS;}else{txt='Berabere!';wCls='draw';iHtml=iS+iS;}h+=` <div id="quiz-winner-icon-container" class="${wCls}">${iHtml}</div> <h2 id="quiz-win-text" class="${wCls}">${txt}</h2> <h3>Skor: ${data.score1} - ${data.score2}</h3> <div class="win-buttons"> <button class="icon-btn" id="play-again-btn" title="Tekrar Oyna"><svg viewBox="0 0 24 24"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"></path></svg></button> <button class="icon-btn" id="back-to-start-btn" title="Ana Menü"><svg viewBox="0 0 24 24"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"></path></svg></button> </div>`;rS.innerHTML=h;rS.querySelector('.back-btn').onclick=()=>{App.playSound('menuClick');App.showScreen('start-screen');};rS.querySelector('#play-again-btn').onclick=async()=>{await App.initAudio();App.playSound('menuClick');const w=App.getWords(App.state.selectedLessonId);const qC=5;if(!w||w.length<10){App.showScreen('start-screen');return;}QuizGame.start(Utils.shuffleArray(w).slice(0,qC),2);App.showScreen('quiz-screen');};rS.querySelector('#back-to-start-btn').onclick=()=>{App.playSound('menuClick');App.showScreen('start-screen');};}this.showScreen('results-screen');}
    };

    // --- QUIZ GAME MODULE ---
    const QuizGame = {
        screenId: 'quiz-screen',
        state: { allColorObjects: [], pointsPerQuestion: 0, currentQuestionType: 'textToColor', p1Questions: [], p1Index: 0, p1Score: 0, p1Finished: false, p2Questions: [], p2Index: 0, p2Score: 0, p2Finished: false, playerMode: 1, questionsPerRound: 0, answerLog: {}, p1StartTime: 0, p2StartTime: 0, p1Timeout: null, p2Timeout: null },
        dom: { p1: {}, p2: {}, countdownOverlay: null },
        init() { 
            this.state.allColorObjects = App.getAllWords();
            // allWordsPool kaldırıldı
        },
        start(questions, playerMode) { /* ... (start kodu değişmedi) ... */ this.stop(); this.state.playerMode = playerMode; this.state.questionsPerRound = questions.length; this.state.p1Questions = Utils.shuffleArray([...questions]); this.state.p1Index = 0; this.state.p1Score = 0; this.state.p1Finished = false; this.state.answerLog = {}; if (playerMode === 1) { this.state.pointsPerQuestion = 100 / this.state.questionsPerRound; } else { this.state.pointsPerQuestion = 0; } let p2_html = ''; if (playerMode === 2) { const allW = this.state.allColorObjects; const remW = allW.filter(w => !this.state.p1Questions.some(p1w => p1w.id === w.id)); if (remW.length >= this.state.questionsPerRound) { this.state.p2Questions = Utils.shuffleArray(remW).slice(0, this.state.questionsPerRound); } else { let pQs=Utils.shuffleArray([...this.state.p1Questions]); let c=true; while(c){c=false; for(let i=0;i<pQs.length;i++){if(pQs[i].id===this.state.p1Questions[i].id){c=true; const n=(i+1)%pQs.length; [pQs[i],pQs[n]]=[pQs[n],pQs[i]];}}} if(pQs.length>1&&pQs.every((q,i)=>q.id===this.state.p1Questions[i].id)){pQs=Utils.shuffleArray([...pQs]);} this.state.p2Questions=pQs; } this.state.p2Index = 0; this.state.p2Score = 0; this.state.p2Finished = false; p2_html = ` <div class="quiz-player-area p2"><div class="score-effects-container"></div><div class="quiz-game-content hidden"><div class="quiz-top-bar"><div class="quiz-progress" id="quiz-progress-p2"></div><div class="progress-bar" id="quiz-progress-bar-p2"></div></div><div class="quiz-question" id="quiz-question-p2">...</div><div class="quiz-options" id="quiz-options-p2"></div></div></div>`; } const qS = document.getElementById('quiz-screen'); qS.className = "screen active"; qS.classList.add(playerMode === 1 ? 'single-player-mode' : 'two-player-mode'); qS.innerHTML = ` <div class="countdown-overlay" id="quiz-countdown-overlay"></div> <div class="header-navigation"><button class="back-btn" title="Ana Menü"><svg viewBox="0 0 24 24"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"></path></svg></button></div> <div id="quiz-container"> <div class="quiz-player-area p1"> <div class="score-effects-container"></div> <div class="quiz-game-content hidden"> <div class="quiz-top-bar"> <div class="quiz-progress" id="quiz-progress-p1"></div> <div class="progress-bar" id="quiz-progress-bar-p1"></div> </div> <div class="quiz-question" id="quiz-question-p1">...</div> <div class="quiz-options" id="quiz-options-p1"></div> </div> </div> ${p2_html} </div>`; this.dom.p1 = { area: qS.querySelector('.quiz-player-area.p1'), progress: document.getElementById('quiz-progress-p1'), progressBar: document.getElementById('quiz-progress-bar-p1'), question: document.getElementById('quiz-question-p1'), options: document.getElementById('quiz-options-p1'), content: qS.querySelector('.quiz-player-area.p1 .quiz-game-content'), effectsContainer: qS.querySelector('.quiz-player-area.p1 .score-effects-container'), }; if (playerMode === 2) { this.dom.p2 = { area: qS.querySelector('.quiz-player-area.p2'), progress: document.getElementById('quiz-progress-p2'), progressBar: document.getElementById('quiz-progress-bar-p2'), question: document.getElementById('quiz-question-p2'), options: document.getElementById('quiz-options-p2'), content: qS.querySelector('.quiz-player-area.p2 .quiz-game-content'), effectsContainer: qS.querySelector('.quiz-player-area.p2 .score-effects-container'), }; this.createProgressBar(2); } else { this.dom.p2 = {}; } this.dom.countdownOverlay = document.getElementById('quiz-countdown-overlay'); qS.querySelector('.back-btn').onclick = () => { App.playSound('menuClick'); App.showScreen('start-screen'); this.stop(); }; if (this.state.playerMode === 1) { this.startGameLoop(); } else { this.startCountdown(); } this.createProgressBar(1); },
        stop() { if (this.state.p1Timeout) clearTimeout(this.state.p1Timeout); this.state.p1Timeout = null; if (this.state.p2Timeout) clearTimeout(this.state.p2Timeout); this.state.p2Timeout = null; },
        startCountdown() { if(!this.dom.countdownOverlay) return; this.dom.countdownOverlay.style.display = 'flex'; let c = 3; this.dom.countdownOverlay.textContent = c; App.playSound('countdown'); const cI = setInterval(() => { c--; if (c > 0) { if(this.dom.countdownOverlay) this.dom.countdownOverlay.textContent = c; App.playSound('countdown'); } else { clearInterval(cI); if(this.dom.countdownOverlay) this.dom.countdownOverlay.style.display = 'none'; this.startGameLoop(); } }, 1000); },
        startGameLoop() { if(this.dom.p1.content) this.dom.p1.content.classList.remove('hidden'); this.showQuestion(1); if (this.state.playerMode === 2 && this.dom.p2.content) { this.dom.p2.content.classList.remove('hidden'); this.showQuestion(2); } },
        createProgressBar(pN) { const pD = (pN === 1) ? this.dom.p1 : this.dom.p2; if(!pD || !pD.progressBar) return; pD.progressBar.innerHTML = ''; for (let i = 0; i < this.state.questionsPerRound; i++) { const s = document.createElement('div'); s.className = 'progress-segment'; pD.progressBar.appendChild(s); } },
        
        showQuestion(playerNum) {
            const pS = (playerNum === 1) ? { q: this.state.p1Questions, i: this.state.p1Index, s: this.state.p1Score } : { q: this.state.p2Questions, i: this.state.p2Index, s: this.state.p2Score };
            const pD = (playerNum === 1) ? this.dom.p1 : this.dom.p2;
            if(!pD || !pD.question) return;

            if (pS.i >= pS.q.length) { /* Bitiş */ if(playerNum===1)this.state.p1Finished=true;else this.state.p2Finished=true; pD.question.textContent='Bitti!';pD.options.innerHTML=''; const sI=`<svg viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>`; let dS; if(this.state.playerMode===1&&playerNum===1){dS=Math.round(pS.s);}else{dS=pS.s;} if(pD.progress)pD.progress.innerHTML=`<div class="quiz-score-display">${sI}<span>${dS}</span></div>`; if(this.state.playerMode===1||(this.state.p1Finished&&this.state.p2Finished)){this.endGame();} return; }

            const word = pS.q[pS.i];
            if(pD.options) pD.options.classList.remove('answered');

            const sI = `<svg viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>`;
            let dS; if (this.state.playerMode === 1 && playerNum === 1) { dS = Math.round(pS.s); } else { dS = pS.s; } if(pD.progress) pD.progress.innerHTML = `<div class="quiz-score-display">${sI}<span>${dS}</span></div>`;
            const segments = pD.progressBar?.children; if(segments) { Array.from(segments).forEach(s => s.classList.remove('active')); if(segments[pS.i]) segments[pS.i].classList.add('active'); }

            let qT; if(this.state.playerMode === 2) { qT = this.state.answerLog[pS.i]?.questionType; if (!qT) { qT = Math.random() < 0.5 ? 'textToColor' : 'colorToText'; if (!this.state.answerLog[pS.i]) this.state.answerLog[pS.i] = {}; this.state.answerLog[pS.i].questionType = qT; } } else { qT = Math.random() < 0.5 ? 'textToColor' : 'colorToText'; } this.state.currentQuestionType = qT; 

            let oC = 4; const wAC = oC - 1;
            if(pD.options) { pD.options.innerHTML = ''; pD.options.classList.remove('five-options', 'four-options'); if (oC === 4) { pD.options.classList.add('four-options'); } }
            
            if (qT === 'textToColor') { // Soru Yazı (Arapça) -> Cevap Renk
                pD.question.textContent = word.arabic; pD.question.style.backgroundColor = 'var(--surface-color)'; pD.question.classList.remove('color-question');
                const wOs = Utils.shuffleArray(this.state.allColorObjects.filter(c => c.id !== word.id)).slice(0, wAC); const opts = Utils.shuffleArray([word, ...wOs]);
                opts.forEach((cO) => { const btn = document.createElement('button'); btn.className = 'quiz-option-btn color-swatch'; btn.textContent = cO.arabic; btn.style.backgroundColor = cO.cssColor; btn.dataset.colorId = cO.id; if (cO.cssColor === '#FFFFFF') { btn.classList.add('white-swatch'); } btn.onclick = (e) => this.checkAnswer(e.currentTarget, word.id, playerNum, qT); if(pD.options) pD.options.appendChild(btn); });
            } else { // Soru Renk -> Cevap Yazı (Arapça)
                pD.question.textContent = ''; pD.question.style.backgroundColor = word.cssColor; pD.question.classList.add('color-question');
                
                // Yanlış cevapları Arapça kelimelerden seç
                const wrongAnswersObjs = Utils.shuffleArray(this.state.allColorObjects.filter(c => c.id !== word.id)).slice(0, wAC);
                const optionsObjs = Utils.shuffleArray([word, ...wrongAnswersObjs]);
                
                optionsObjs.forEach((obj) => { 
                    const btn = document.createElement('button'); 
                    btn.className = 'quiz-option-btn'; 
                    btn.textContent = obj.arabic; // Seçenek metni Arapça
                    btn.onclick = (e) => this.checkAnswer(e.currentTarget, word.arabic, playerNum, qT); // Doğru cevap da Arapça
                    if(pD.options) pD.options.appendChild(btn); 
                });
            }
            if(playerNum === 1) this.state.p1StartTime = Date.now(); else this.state.p2StartTime = Date.now();
        },

        _createFeedbackIcon(isCorrect) {
            const iconDiv = document.createElement('div');
            iconDiv.className = 'feedback-icon ' + (isCorrect ? 'tick-icon' : 'cross-icon');
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("viewBox", "0 0 24 24");
            const path = document.createElementNS(svgNS, "path");
            if (isCorrect) { path.setAttribute("d", "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"); } 
            else { path.setAttribute("d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"); }
            svg.appendChild(path); iconDiv.appendChild(svg);
            return iconDiv;
        },

        checkAnswer(button, correctAnswer, playerNum, questionType) {
            const type = (this.state.playerMode === 1) ? this.state.currentQuestionType : questionType; App.playSound('touch');
            const tT = (playerNum === 1) ? (Date.now() - this.state.p1StartTime) : (Date.now() - this.state.p2StartTime); const pD = (playerNum === 1) ? this.dom.p1 : this.dom.p2; const pI = (playerNum === 1) ? this.state.p1Index : this.state.p2Index; if(!pD || !pD.options) return;
            Array.from(pD.options.children).forEach(btn => { btn.disabled = true; }); button.classList.add('selected');

            let isCorrect = (type === 'textToColor') ? (parseInt(button.dataset.colorId, 10) === correctAnswer) : (button.textContent.trim() === correctAnswer); 

            const feedbackIcon = this._createFeedbackIcon(isCorrect);
            button.appendChild(feedbackIcon); 
            setTimeout(() => { if (feedbackIcon.parentNode) feedbackIcon.remove(); }, 1400); // Güvenlik kontrolü eklendi

            if (this.state.playerMode === 1) {
                if (isCorrect) { App.playSound('correct'); this.state.p1Score += this.state.pointsPerQuestion; this.showScoreEffect(1, Math.round(this.state.pointsPerQuestion)); } 
                else { 
                    App.playSound('incorrect'); 
                    Array.from(pD.options.children).forEach(btn => { 
                        let isBtnCorrect = (type === 'textToColor') ? (parseInt(btn.dataset.colorId, 10) === correctAnswer) : (btn.textContent.trim() === correctAnswer);
                        if(isBtnCorrect && btn !== button) { 
                            const correctIcon = this._createFeedbackIcon(true);
                            btn.appendChild(correctIcon);
                            setTimeout(() => { if (correctIcon.parentNode) correctIcon.remove(); }, 1400); // Güvenlik kontrolü
                        }
                    });
                }
                const s = pD.progressBar?.children; if(s?.[pI]) s[pI].classList.add(isCorrect ? 'correct' : 'incorrect'); 
                this.updateScoreDisplay(1); if(s?.[pI]) s[pI].classList.remove('active');
                this.state.p1Timeout = setTimeout(() => { this.state.p1Index++; this.showQuestion(1); }, 1500);
            
            } else { if (!this.state.answerLog[pI]) { this.state.answerLog[pI] = {}; } this.state.answerLog[pI].questionType = type; this.state.answerLog[pI][playerNum] = { isCorrect, timeTaken: tT, button }; if (this.state.answerLog[pI]?.[1] && this.state.answerLog[pI]?.[2]) { this.processRoundResults(pI); } }
        },
        
        processRoundResults(roundIndex) {
            const p1A=this.state.answerLog[roundIndex]?.[1]; const p2A=this.state.answerLog[roundIndex]?.[2]; const p1D=this.dom.p1; const p2D=this.dom.p2; const type=this.state.answerLog[roundIndex]?.questionType; if(!p1A||!p2A||!p1D||!p2D||!type)return;
            p1A.button.classList.remove('selected'); p2A.button.classList.remove('selected');
            const p1W=this.state.p1Questions[roundIndex]; const p2W=this.state.p2Questions[roundIndex];
            
            // Doğru cevapları gösterme (checkAnswer zaten yapıyor)
            if(p1D.options) p1D.options.classList.add('answered'); if(p2D.options) p2D.options.classList.add('answered');
            
            if(p1A.isCorrect){this.state.p1Score+=10;this.showScoreEffect(1,10);} if(p2A.isCorrect){this.state.p2Score+=10;this.showScoreEffect(2,10);} let bW=0; if(p1A.isCorrect&&p2A.isCorrect){if(p1A.timeTaken<p2A.timeTaken)bW=1;else if(p2A.timeTaken<p1A.timeTaken)bW=2;}else if(p1A.isCorrect)bW=1;else if(p2A.isCorrect)bW=2; if(bW===1){this.state.p1Score+=10;setTimeout(()=>this.showScoreEffect(1,10,true),400);}else if(bW===2){this.state.p2Score+=10;setTimeout(()=>this.showScoreEffect(2,10,true),400);} if(p1A.isCorrect||p2A.isCorrect)App.playSound('correct'); if(!p1A.isCorrect||!p2A.isCorrect)App.playSound('incorrect');
            const p1S=p1D.progressBar?.children; const p2S=p2D.progressBar?.children; if(p1S?.[roundIndex])p1S[roundIndex].classList.add(p1A.isCorrect?'correct':'incorrect'); if(p2S?.[roundIndex])p2S[roundIndex].classList.add(p2A.isCorrect?'correct':'incorrect'); this.updateScoreDisplay(1); this.updateScoreDisplay(2); if(p1S?.[roundIndex])p1S[roundIndex].classList.remove('active'); if(p2S?.[roundIndex])p2S[roundIndex].classList.remove('active');
            this.state.p1Timeout=setTimeout(()=>{this.state.p1Index++;this.state.p2Index++;this.showQuestion(1);this.showQuestion(2);},2000);
        },
        showScoreEffect(pN, pts, isB = false) { const cont=(pN===1)?this.dom.p1?.effectsContainer:this.dom.p2?.effectsContainer;if(!cont)return;const el=document.createElement('div');el.className='score-effect';if(isB){el.classList.add('bonus');const lSVG=`<svg viewBox="0 0 24 24"><path d="M7,2V13H10V22L17,10H13L17,2H7Z" /></svg>`;el.innerHTML=`${lSVG} +${pts}`;el.style.backgroundColor='var(--accent-color)';const bC=document.createElement('div');bC.className='burst-container';for(let i=0;i<12;i++){const p=document.createElement('div');p.className='particle';const a=(i/12)*360;p.style.setProperty('--angle',a+'deg');bC.appendChild(p);}el.appendChild(bC);}else{el.innerHTML=`+${pts}`;el.style.backgroundColor='var(--correct-color)';}cont.appendChild(el);setTimeout(()=>{el.remove();},1950); },
        updateScoreDisplay(pN) { const pD=(pN===1)?this.dom.p1:this.dom.p2;if(!pD||!pD.progress)return;const score=(pN===1)?this.state.p1Score:this.state.p2Score;let dS;if(this.state.playerMode===1&&pN===1){dS=Math.round(score);}else{dS=score;}const sI=`<svg viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>`;pD.progress.innerHTML=`<div class="quiz-score-display">${sI}<span>${dS}</span></div>`; },
        endGame() { if(this.state.playerMode===1){const fS=this.state.p1Score;const iW=fS>=85;App.showResults({playerMode:1,score:fS,totalQuestions:this.state.questionsPerRound,isWin:iW,nextLessonUnlocked:false});}else{let w=0;if(this.state.p1Score>this.state.p2Score)w=1;else if(this.state.p2Score>this.state.p1Score)w=2;App.showResults({playerMode:2,score1:this.state.p1Score,score2:this.state.p2Score,totalQuestions:this.state.questionsPerRound,winner:w});} }
    };

    App.init();

    });