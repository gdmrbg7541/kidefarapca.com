/* --- WEB AUDIO API SES SİSTEMİ --- */
        let audioCtx;
        function initAudio() { if (audioCtx) { if (audioCtx.state === 'suspended') audioCtx.resume(); return; } try { if (window.__audioCtx) { audioCtx = window.__audioCtx; if (audioCtx.state === 'suspended') audioCtx.resume(); } else { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); window.__audioCtx = audioCtx; } console.log("AudioContext başlatıldı/devam ettirildi. Durum:", audioCtx.state); } catch(e) { console.error("Web Audio API desteklenmiyor", e); } }
        function playCorrectSound() { if (!audioCtx) return; try { const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(600, audioCtx.currentTime); g.gain.setValueAtTime(0.4, audioCtx.currentTime); o.connect(g); g.connect(audioCtx.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3); o.stop(audioCtx.currentTime + 0.3); } catch(e) { console.error("playCorrectSound hatası", e); } }
        function playIncorrectSound() { if (!audioCtx) return; try { const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(200, audioCtx.currentTime); g.gain.setValueAtTime(0.4, audioCtx.currentTime); o.connect(g); g.connect(audioCtx.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5); o.stop(audioCtx.currentTime + 0.5); } catch(e) { console.error("playIncorrectSound hatası", e); } }
        function playClickSound() { if (!audioCtx) return; try { const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(800, audioCtx.currentTime); g.gain.setValueAtTime(0.3, audioCtx.currentTime); o.connect(g); g.connect(audioCtx.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1); o.stop(audioCtx.currentTime + 0.1); } catch(e) { console.error("playClickSound hatası", e); } }
        function playTimerTickSound() { if (!audioCtx) return; try { const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(1200, audioCtx.currentTime); g.gain.setValueAtTime(0.1, audioCtx.currentTime); o.connect(g); g.connect(audioCtx.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.05); o.stop(audioCtx.currentTime + 0.05); } catch(e) { console.error("playTimerTickSound hatası", e); } }
        /* --- SES SİSTEMİ BİTİŞİ --- */

        // --- Diğer JavaScript kodları ---
        const Q4_ANSWERS = { Q4_1: `Merfu <span class="ar">ـُ ـٌ</span>`, Q4_2: `Mansub <span class="ar">ـَ ـً</span>`, Q4_3: `Mecrur <span class="ar">ـِ ـٍ</span>`, Q4_4: `Merfu <span class="ar">ـانِ</span>`, Q4_5: `Mansub-Mecrur <span class="ar">ـيْنِ</span>`, Q4_6: `Merfu <span class="ar">ـونَ</span>`, Q4_7: `Mansub-Mecrur <span class="ar">ـينَ</span>`, Q4_8: `Merfu <span class="ar">ـاتُ ـاتٌ</span>`, Q4_9: `Mansub-Mecrur <span class="ar">ـاتِ ـاتٍ</span>` };
        
        const finalList = [ 
            { html: 'مُزَارِعَاتٌ', turkish: 'Çiftçiler', answers: ['Nekra', 'Müennes', 'Cem\'', Q4_ANSWERS.Q4_8] }, 
            { html: 'سَيَّارَتَيْنِ', turkish: 'İki Araba', answers: ['Nekra', 'Müennes', 'Tesniye', Q4_ANSWERS.Q4_5] }, 
            { html: 'مُدِيرَاتٍ', turkish: 'Müdürler', answers: ['Nekra', 'Müennes', 'Cem\'', Q4_ANSWERS.Q4_9] }, 
            { html: 'اَلْمُدِيرَتَانِ', turkish: 'İki Müdür', answers: ['Marife', 'Müennes', 'Tesniye', Q4_ANSWERS.Q4_4] }, 
            { html: 'حَلَّاقُونَ', turkish: 'Berberler', answers: ['Nekra', 'Müzekker', 'Cem\'', Q4_ANSWERS.Q4_6] }, 
            { html: 'اَلصَّدِيقُ', turkish: 'Arkadaş', answers: ['Marife', 'Müzekker', 'Müfret', Q4_ANSWERS.Q4_1] }, 
            { html: 'اَلْخَالَةِ', turkish: 'Teyze', answers: ['Marife', 'Müennes', 'Müfret', Q4_ANSWERS.Q4_3] }, 
            { html: 'اَلْفَلَّاحَانِ', turkish: 'İki Çiftçi', answers: ['Marife', 'Müzekker', 'Tesniye', Q4_ANSWERS.Q4_4] }, 
            { html: 'اَلسَّبُّورَةِ', turkish: 'Sınıf Tahtası', answers: ['Marife', 'Müennes', 'Müfret', Q4_ANSWERS.Q4_3] }, 
            { html: 'جُهَلَـاءَ', turkish: 'Cahiller', answers: ['Nekra', 'Müzekker', 'Cem\'', Q4_ANSWERS.Q4_2] }, 
            { html: 'عَمٍّ', turkish: 'Amca', answers: ['Nekra', 'Müzekker', 'Müfret', Q4_ANSWERS.Q4_3] }, 
            { html: 'مُعَلِّمٌ', turkish: 'Öğretmen', answers: ['Nekra', 'Müzekker', 'Müfret', Q4_ANSWERS.Q4_1] }, 
            { html: 'اَلْمُزَارِعَتَيْنِ', turkish: 'İki çiftçi', answers: ['Marife', 'Müennes', 'Tesniye', Q4_ANSWERS.Q4_5] }, 
            { html: 'اَلطَّالِبَاتُ', turkish: 'Öğrenciler', answers: ['Marife', 'Müennes', 'Cem\'', Q4_ANSWERS.Q4_8] }, 
            { html: 'اَلْمُعَلِّمُونَ', turkish: 'Öğretmenler', answers: ['Marife', 'Müzekker', 'Cem\'', Q4_ANSWERS.Q4_6] }, 
            { html: 'طَالِبَةٌ', turkish: 'Öğrenci', answers: ['Nekra', 'Müennes', 'Müfret', Q4_ANSWERS.Q4_1] }, 
            { html: 'اَلْمُهَنْدِسِينَ', turkish: 'Mühendisler', answers: ['Marife', 'Müzekker', 'Cem\'', Q4_ANSWERS.Q4_7] }, 
            { html: 'طُلَّـابًا', turkish: 'Öğrenciler', answers: ['Nekra', 'Müzekker', 'Cem\'', Q4_ANSWERS.Q4_2] }, 
            { html: 'جُنْدِيَّتَيْنِ', turkish: 'İki asker', answers: ['Nekra', 'Müennes', 'Tesniye', Q4_ANSWERS.Q4_5] }, 
            { html: 'اَلْكِتَابَ', turkish: 'Kitap', answers: ['Marife', 'Müzekker', 'Müfret', Q4_ANSWERS.Q4_2] }, 
            { html: 'مُدَرِّسِينَ', turkish: 'Öğretmenler', answers: ['Nekra', 'Müzekker', 'Cem\'', Q4_ANSWERS.Q4_7] }, 
            { html: 'اَلنَّافِذَةِ', turkish: 'Pencere', answers: ['Marife', 'Müennes', 'Müfret', Q4_ANSWERS.Q4_3] } 
        ];
        const questionTitles = [ "1. Tür?", "2. Cinsiyet?", "3. Sayı?", "4. İ'rab?" ];
        const questionOptions = [ ['Marife', 'Nekra'], ['Müzekker', 'Müennes'], ['Müfret', 'Tesniye', 'Cem\''], [ Q4_ANSWERS.Q4_1, Q4_ANSWERS.Q4_2, Q4_ANSWERS.Q4_3, Q4_ANSWERS.Q4_4, Q4_ANSWERS.Q4_5, Q4_ANSWERS.Q4_6, Q4_ANSWERS.Q4_7, Q4_ANSWERS.Q4_8, Q4_ANSWERS.Q4_9 ] ];
        
        // --- Element Tanımlamaları ---
        const selectionScreenEl = document.getElementById('selection-screen'); const difficultyButtons = document.querySelectorAll('#difficulty-buttons button'); const playerModeButtons = document.querySelectorAll('#player-mode-buttons button'); const startGameButton = document.getElementById('start-game-button'); const gameArea = document.getElementById('game-area'); const mainGameContentEl = document.getElementById('main-game-content'); const timerDisplayEl = document.getElementById('timer-display'); const player1AreaEl = document.getElementById('player1-area'); const arabicWordElP1 = document.getElementById('arabic-word-p1'); const turkishMeaningElP1 = document.getElementById('turkish-meaning-p1'); const questionTitleElP1 = document.getElementById('question-title-p1'); const optionsContainerP1 = document.getElementById('options-container-p1'); const player2AreaEl = document.getElementById('player2-area'); const arabicWordElP2 = document.getElementById('arabic-word-p2'); const turkishMeaningElP2 = document.getElementById('turkish-meaning-p2'); const questionTitleElP2 = document.getElementById('question-title-p2'); const optionsContainerP2 = document.getElementById('options-container-p2'); 
        var _SARF_H=(function(){var c='';for(var i=0x064B;i<=0x0652;i++)c+=String.fromCharCode(i);return '['+c+String.fromCharCode(0x0670)+']';})();
        function colorizeSarf(w){
          if(typeof w!=='string'||!w) return w;
          var H=_SARF_H, al='', ek='', mid=w;
          var mAl=mid.match(new RegExp('^([اأٱ]'+H+'*ل'+H+'*)'));
          if(mAl){ al='<span class="sarf-al">'+mAl[1]+'</span>'; mid=mid.slice(mAl[1].length); }
          var mF=mid.match(new RegExp('(ا'+H+'*ت'+H+'*)$'));
          if(mF){ ek='<span class="sarf-ta">'+mF[1]+'</span>'; mid=mid.slice(0,mid.length-mF[1].length); }
          else { var mM=mid.match(new RegExp('(و'+H+'*ن'+H+'*|ي'+H+'*ن'+H+'*|ا'+H+'*ن'+H+'*)$')); if(mM){ ek='<span class="sarf-ek">'+mM[1]+'</span>'; mid=mid.slice(0,mid.length-mM[1].length); } }
          mid=mid.replace(new RegExp('(ة'+H+'*)$'),'<span class="sarf-ta">$1</span>');
          return al+mid+ek;
        }
        window.colorizeSarf=colorizeSarf;
        
        const backButton = document.getElementById('back-button');
        const homeButton = document.getElementById('home-button');
        
        const proceedContainerEl = document.getElementById('proceed-container');
        const proceedButtonEl = document.getElementById('proceed-button');
        const progressBarP1 = document.getElementById('progress-bar-p1');
        const progressBarP2 = document.getElementById('progress-bar-p2');
        
        // --- Değişkenler ---
        let currentWordP1, currentWordP2; let currentQuestionIndex; let shuffledWords = []; let gameMode = 0; let timeLimit = 0; let timeLeft = 0; let timerInterval = null; let mistakesP1 = [], mistakesP2 = []; let player1Answered = false, player2Answered = false; let selectedDifficultyButton = null; let selectedPlayerModeButton = null; let feedbackDataP1 = null; feedbackDataP2 = null;
        
        // --- Olay Dinleyicileri ---
        difficultyButtons.forEach(button => button.addEventListener('click', selectDifficulty)); playerModeButtons.forEach(button => button.addEventListener('click', selectPlayerMode)); startGameButton.addEventListener('click', startGame); 
        
        backButton.addEventListener('click', goToDifficultySelection);
        homeButton.addEventListener('click', () => {
            playClickSound();
            kidefGeriDon();
        });
        
        
        proceedButtonEl.addEventListener('click', () => {
            playClickSound();
            proceedContainerEl.classList.add('hidden'); 
            mainGameContentEl.style.opacity = 1; 
            mainGameContentEl.style.pointerEvents = 'auto';
            
            if (currentQuestionIndex < 4) {
                displayQuestion(); 
                timerInterval = setInterval(updateTimer, 1000);
            } else {
                loadNextWord(); 
            }
        });

        // --- Fonksiyonlar ---
        function checkSelections() { startGameButton.disabled = !(timeLimit > 0 && gameMode > 0); }
        function selectDifficulty(event) { initAudio(); playClickSound(); timeLimit = parseInt(event.target.dataset.time); if (selectedDifficultyButton) { selectedDifficultyButton.classList.remove('button-selected'); } selectedDifficultyButton = event.target; selectedDifficultyButton.classList.add('button-selected'); checkSelections(); }
        function selectPlayerMode(event) { initAudio(); playClickSound(); gameMode = parseInt(event.target.dataset.mode); if (selectedPlayerModeButton) { selectedPlayerModeButton.classList.remove('button-selected'); } selectedPlayerModeButton = event.target; selectedPlayerModeButton.classList.add('button-selected'); checkSelections(); }
        
        function startGame() { 
            initAudio(); 
            playClickSound(); 
            selectionScreenEl.classList.add('hidden'); 
            homeButton.classList.add('hidden'); 
            gameArea.classList.remove('hidden'); 
            backButton.classList.remove('hidden'); 
            if (gameMode === 1) { document.body.classList.remove('mode-2p'); document.body.classList.add('mode-1p'); player2AreaEl.classList.add('hidden'); } else { document.body.classList.remove('mode-1p'); document.body.classList.add('mode-2p'); player2AreaEl.classList.remove('hidden'); } 
            loadNextWord(); 
        }
        
        // GÜNCELLENDİ (HATA DÜZELTMESİ): Solukluk sıfırlama eklendi
        function goToDifficultySelection() { 
            playClickSound(); 
            gameArea.classList.add('hidden'); 
            selectionScreenEl.classList.remove('hidden'); 
            backButton.classList.add('hidden'); 
            homeButton.classList.remove('hidden'); 
            proceedContainerEl.classList.add('hidden'); 
            
            // YENİ (HATA DÜZELTMESİ): Soluklaşan oyun alanını sıfırla
            mainGameContentEl.style.opacity = 1;
            mainGameContentEl.style.pointerEvents = 'auto';
            
            if (selectedDifficultyButton) { selectedDifficultyButton.classList.remove('button-selected'); selectedDifficultyButton = null; } 
            if (selectedPlayerModeButton) { selectedPlayerModeButton.classList.remove('button-selected'); selectedPlayerModeButton = null; } 
            timeLimit = 0; gameMode = 0; 
            checkSelections(); 
            clearInterval(timerInterval); 
            timerInterval = null; 
            document.body.classList.remove('mode-1p', 'mode-2p'); 
        }
        
        function shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array;}
        
        function loadNextWord() { 
            playClickSound(); 
            proceedContainerEl.classList.add('hidden'); 
            if (shuffledWords.length < gameMode) { shuffledWords = [...finalList]; shuffleArray(shuffledWords); if (shuffledWords.length < gameMode && gameMode > 1) { alert("2 farklı kelime için yeterli kelime listesi yok!"); goToDifficultySelection(); return; } } 
            currentQuestionIndex = 0; mistakesP1 = []; mistakesP2 = []; player1Answered = false; player2Answered = false; feedbackDataP1 = null; feedbackDataP2 = null; 
            mainGameContentEl.style.opacity = 1; 
            mainGameContentEl.style.pointerEvents = 'auto'; 
            backButton.classList.remove('hidden'); 
            currentWordP1 = shuffledWords.pop(); 
            arabicWordElP1.innerHTML = colorizeSarf(currentWordP1.html); 
            turkishMeaningElP1.textContent = currentWordP1.turkish; 
            if (gameMode === 2) { currentWordP2 = shuffledWords.pop(); while(currentWordP1.html === currentWordP2.html && shuffledWords.length > 0) { shuffledWords.unshift(currentWordP2); currentWordP2 = shuffledWords.pop(); } if (currentWordP1.html === currentWordP2.html) { alert("Listede kalan son iki kelime aynı."); goToDifficultySelection(); return; } arabicWordElP2.innerHTML = colorizeSarf(currentWordP2.html); turkishMeaningElP2.textContent = currentWordP2.turkish; player2AreaEl.classList.remove('hidden'); } else { player2AreaEl.classList.add('hidden'); } 
            optionsContainerP1.innerHTML = ''; 
            if (optionsContainerP2) optionsContainerP2.innerHTML = ''; 
            optionsContainerP1.style.pointerEvents = 'auto'; 
            if(optionsContainerP2) optionsContainerP2.style.pointerEvents = 'auto'; 
            
            updateProgressBar(1, -1, 'reset');
            updateProgressBar(2, -1, 'reset');
            
            timeLeft = timeLimit; 
            updateTimerDisplay(); 
            clearInterval(timerInterval); 
            timerInterval = setInterval(updateTimer, 1000); 
            displayQuestion(); 
        }
        
        function updateTimer() { timeLeft--; updateTimerDisplay(); if (timeLeft <= 5 && timeLeft > 0) { playTimerTickSound(); } if (timeLeft <= 0) { clearInterval(timerInterval); handleTimeUp('timeup'); } }
        function updateTimerDisplay() { timerDisplayEl.textContent = `Süre: ${timeLeft}s`; timerDisplayEl.style.color = timeLeft <= 5 ? '#dc3545' : 'var(--text-light)'; }
        
        function handleTimeUp(reason = 'timeup') { 
            playIncorrectSound(); 
            mainGameContentEl.style.opacity = 0.5; 
            mainGameContentEl.style.pointerEvents = 'none'; 
            backButton.classList.remove('hidden'); 
            prepareAndRedirectToResults(reason); 
        }
        
        function displayQuestion() { 
            const questionText = questionTitles[currentQuestionIndex]; 
            questionTitleElP1.textContent = questionText; 
            optionsContainerP1.innerHTML = ''; 
            optionsContainerP1.className = 'options-container'; 
            if (currentQuestionIndex === 3) optionsContainerP1.classList.add('q4-grid'); 
            
            if (gameMode === 2) { 
                questionTitleElP2.textContent = questionText; 
                optionsContainerP2.innerHTML = ''; 
                optionsContainerP2.className = 'options-container'; 
                if (currentQuestionIndex === 3) optionsContainerP2.classList.add('q4-grid'); 
            } 
            
            const options = questionOptions[currentQuestionIndex]; 
            options.forEach(option => { 
                const buttonP1 = createOptionButton(option, 1); 
                optionsContainerP1.appendChild(buttonP1); 
                if (gameMode === 2 && optionsContainerP2) { 
                    const buttonP2 = createOptionButton(option, 2); 
                    optionsContainerP2.appendChild(buttonP2); 
                } 
            }); 
            
            player1Answered = false; 
            player2Answered = false; 
            feedbackDataP1 = null; 
            feedbackDataP2 = null; 
            optionsContainerP1.style.pointerEvents = 'auto'; 
            if(gameMode === 2 && optionsContainerP2) optionsContainerP2.style.pointerEvents = 'auto'; 
            
            updateProgressBar(1, currentQuestionIndex, 'active');
            if(gameMode === 2) updateProgressBar(2, currentQuestionIndex, 'active');
        }
        
        function createOptionButton(option, player) { 
            const button = document.createElement('button'); 
            button.dataset.value = option;
            button.innerHTML = option; 
            
            if (currentQuestionIndex === 3) { 
                button.classList.add('q4-option'); 
                if (option.includes('ـونَ') || option.includes('ـينَ')) button.classList.add('hint-q4-blue'); 
                else if (option.includes('ـاتُ') || option.includes('ـاتِ')) button.classList.add('hint-q4-pink'); 
                else button.classList.add('hint-q4-green'); 
            } else { 
                let hintHTML = ''; 
                switch (option) { 
                    case 'Marife': hintHTML = ' <span class="hint-icon"><span class="al-hint">ال</span> ✓</span>'; button.innerHTML = option + hintHTML; break; 
                    case 'Nekra': hintHTML = ' <span class="hint-icon"><span class="al-hint">ال</span> ✗</span>'; button.innerHTML = option + hintHTML; break; 
                    case 'Müennes': button.classList.add('hint-pink'); break; 
                    case 'Müzekker': button.classList.add('hint-blue'); break; 
                    case 'Müfret': hintHTML = ' <span class="hint-icon"><span class="num-hint">1</span></span>'; button.innerHTML = option + hintHTML; break; 
                    case 'Tesniye': hintHTML = ' <span class="hint-icon"><span class="num-hint">2</span></span>'; button.innerHTML = option + hintHTML; break; 
                    case 'Cem\'': hintHTML = ' <span class="hint-icon"><span class="num-hint">3+</span></span>'; button.innerHTML = option + hintHTML; break; 
                } 
            } 
            
            button.addEventListener('click', (event) => { 
                playClickSound(); 
                checkAnswer(button.dataset.value, button, player); 
            }); 
            return button; 
        }
        
        function checkAnswer(selectedOption, clickedButton, player) {
            const currentWord = (player === 1) ? currentWordP1 : currentWordP2;
            const optionsContainer = (player === 1) ? optionsContainerP1 : optionsContainerP2;
            const mistakes = (player === 1) ? mistakesP1 : mistakesP2;
            const correctAnswer = currentWord.answers[currentQuestionIndex];
            let allCorrectAnswers = [correctAnswer]; 
            
            if (currentQuestionIndex === 3) {
                if (correctAnswer === Q4_ANSWERS.Q4_8) { 
                    allCorrectAnswers.push(Q4_ANSWERS.Q4_1); 
                } else if (correctAnswer === Q4_ANSWERS.Q4_9) { 
                    allCorrectAnswers.push(Q4_ANSWERS.Q4_3); 
                }
            }
            
            let isCorrect = allCorrectAnswers.includes(selectedOption);
            
            if(player === 1) {
                feedbackDataP1 = { button: clickedButton, correct: isCorrect, allAnswers: allCorrectAnswers }; 
            } else {
                feedbackDataP2 = { button: clickedButton, correct: isCorrect, allAnswers: allCorrectAnswers };
            }

            if (!isCorrect) {
                mistakes.push({ question: questionTitles[currentQuestionIndex], expected: correctAnswer, given: selectedOption });
            }

            optionsContainer.style.pointerEvents = 'none';
            clickedButton.style.opacity = '1';
            Array.from(optionsContainer.children).forEach(btn => {
                if(btn !== clickedButton) btn.style.opacity = '0.6';
            });

            if (player === 1) player1Answered = true;
            if (player === 2) player2Answered = true;

            if (gameMode === 1 || (player1Answered && player2Answered)) {
                optionsContainerP1.style.pointerEvents = 'none';
                if(optionsContainerP2) optionsContainerP2.style.pointerEvents = 'none';
                showFeedback();
                proceedToNextQuestion();
            }
        }

        function showFeedback() {
            if (feedbackDataP1) {
                if (feedbackDataP1.correct) {
                    playCorrectSound();
                } else {
                    playIncorrectSound();
                    if (navigator.vibrate) { navigator.vibrate(150); }
                }
                
                updateProgressBar(1, currentQuestionIndex, feedbackDataP1.correct ? 'completed' : 'incorrect');
                
                Array.from(optionsContainerP1.children).forEach(btn => {
                    if (feedbackDataP1.allAnswers.includes(btn.dataset.value)) {
                        btn.classList.add('button-correct'); 
                    } else if (btn === feedbackDataP1.button && !feedbackDataP1.correct) {
                         btn.classList.add('button-incorrect'); 
                    }
                    btn.style.opacity = '1'; 
                });
            }
            
            if (gameMode === 2 && feedbackDataP2) {
                if (feedbackDataP2.correct) {
                    if (!feedbackDataP1 || !feedbackDataP1.correct) playCorrectSound(); 
                } else {
                    if (!feedbackDataP1 || feedbackDataP1.correct) playIncorrectSound(); 
                    if (navigator.vibrate && feedbackDataP1?.correct) { navigator.vibrate(150); }
                }

                updateProgressBar(2, currentQuestionIndex, feedbackDataP2.correct ? 'completed' : 'incorrect');

                Array.from(optionsContainerP2.children).forEach(btn => {
                    if (feedbackDataP2.allAnswers.includes(btn.dataset.value)) {
                        btn.classList.add('button-correct');
                    } else if (btn === feedbackDataP2.button && !feedbackDataP2.correct) {
                         btn.classList.add('button-incorrect');
                    }
                    btn.style.opacity = '1';
                });
            }
        }
        
        function proceedToNextQuestion() { 
            currentQuestionIndex++; 
            
            setTimeout(() => { 
                if (currentQuestionIndex < 4) { 
                    showProceedScreen('question');
                } else { 
                    showProceedScreen('word');
                } 
            }, 1000); 
        }

        function endGame(reason = 'completed') { 
            clearInterval(timerInterval); 
            mainGameContentEl.style.opacity = 0.5; 
            mainGameContentEl.style.pointerEvents = 'none'; 
            backButton.classList.remove('hidden'); 
            prepareAndRedirectToResults(reason); 
        }

        function showProceedScreen(type) { 
            clearInterval(timerInterval); 
            mainGameContentEl.style.opacity = 0.5; 
            mainGameContentEl.style.pointerEvents = 'none'; 
            backButton.classList.remove('hidden'); 
            
            if (type === 'question') {
                proceedButtonEl.textContent = 'Sonraki Soru'; 
            } else { 
                proceedButtonEl.textContent = 'Yeni Kelime'; 
            }
            proceedContainerEl.classList.remove('hidden'); 
        }
        
        function updateProgressBar(player, questionIndex, status) {
            const progressBar = (player === 1) ? progressBarP1 : progressBarP2;
            if (!progressBar) return;

            if (status === 'reset') {
                const steps = progressBar.querySelectorAll('.progress-step');
                const lines = progressBar.querySelectorAll('.progress-line');
                steps.forEach(step => {
                    step.className = 'progress-step'; 
                });
                lines.forEach(line => {
                    line.style.backgroundColor = 'var(--progress-inactive)';
                });
                return;
            }

            if (status === 'active') {
                const activeStep = progressBar.querySelector(`.progress-step[data-step="${questionIndex + 1}"]`);
                if (activeStep) {
                    progressBar.querySelectorAll('.progress-step.active').forEach(s => s.classList.remove('active'));
                    activeStep.classList.add('active');
                }
                return;
            }
            
            const currentStep = progressBar.querySelector(`.progress-step[data-step="${questionIndex + 1}"]`);
            if (currentStep) {
                currentStep.classList.remove('active'); 
                currentStep.classList.add(status); 
                
                const nextLine = currentStep.nextElementSibling;
                if (nextLine && nextLine.classList.contains('progress-line')) {
                    if (status === 'completed') {
                        nextLine.style.backgroundColor = 'var(--accent-green)';
                    } else if (status === 'incorrect') {
                        nextLine.style.backgroundColor = 'var(--accent-red)';
                    }
                }
            }
        }
        
        
        function prepareAndRedirectToResults(reason) {
            console.log("Oyun bitti, sebep:", reason);
            goToDifficultySelection();
        }

        (function() {
            function primeAudioOnce(){
                console.log("İlk etkileşim algılandı. initAudio() çağrılıyor.");
                if(typeof initAudio === 'function') {
                    initAudio();
                }
                window.removeEventListener('touchstart', primeAudioOnce, {passive:true});
                window.removeEventListener('click', primeAudioOnce, {passive:true});
            }
            window.addEventListener('touchstart', primeAudioOnce, {passive:true, once:true});
            window.addEventListener('click', primeAudioOnce, {passive:true, once:true});
        })();