// --- Web Audio API Ses Sistemi ---
        let audioContext;
        let audioInitialized = false;

        function initAudioContext() {
            if (audioInitialized || !(window.AudioContext || window.webkitAudioContext)) {
                 if (!audioContext && (window.AudioContext || window.webkitAudioContext)) { console.warn("Web Audio API bu tarayıcıda desteklenmiyor."); }
                 return;
            }
            if (!audioContext) {
                try {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    audioInitialized = true; console.log("AudioContext başlatıldı."); unlockAudio();
                } catch (e) { console.error("Web Audio API başlatılamadı.", e); audioInitialized = false; }
            }
        }

        function unlockAudio() {
             if (!audioContext || audioContext.state !== 'suspended') return;
             const buffer = audioContext.createBuffer(1, 1, 22050); const source = audioContext.createBufferSource();
             source.buffer = buffer; source.connect(audioContext.destination); source.start(0);
             audioContext.resume().then(() => { console.log("AudioContext kilidi açıldı (state resumed)."); });
        }

        function playSound(soundKey) {
            if (!audioInitialized || !audioContext || audioContext.state !== 'running') {
                if (audioContext && audioContext.state === 'suspended') {
                    audioContext.resume().then(() => { console.log("AudioContext devam ettirildi:", soundKey); });
                } else { /* console.warn("Ses çalma atlandı", {key: soundKey, init: audioInitialized, state: audioContext?.state}); */ }
                return;
            }
            const sounds = {
                touch:     { f: 300,   t: 'sine',   d: 0.05 },
                correct:   { f: 523.25,t: 'sine',   d: 0.2 },
                incorrect: { f: 164.81,t: 'square', d: 0.2 }
            };
            const sound = sounds[soundKey]; if (!sound) { console.warn("Bilinmeyen ses:", soundKey); return; }
            try {
                const g = audioContext.createGain(); g.connect(audioContext.destination);
                g.gain.setValueAtTime(0, audioContext.currentTime);
                g.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
                g.gain.linearRampToValueAtTime(0, audioContext.currentTime + sound.d);
                const o = audioContext.createOscillator(); o.type = sound.t;
                o.frequency.setValueAtTime(sound.f, audioContext.currentTime);
                o.connect(g); o.start(audioContext.currentTime); o.stop(audioContext.currentTime + sound.d);
            } catch (e) { console.error(`Ses (${soundKey}) hatası:`, e); }
        }
        // --- ---

        // --- GÜNCELLENDİ: TÜM ŞEDDE SIRALAMALARI VE YAZIM HATALARI DÜZELTİLDİ ---
        const gameData = {
             1: { timePerLetter: 8, words: [ { ar: "نَعَمْ", base_ar:"نعم", tr: "Evet" }, { ar: "قَلَمٍ", base_ar:"قلم", tr: "Kalem" }, { ar: "لَعِبَ", base_ar:"لعب", tr: "Oyun oynama" }, { ar: "عَمَلٌ", base_ar:"عمل", tr: "Çalışma" }, { ar: "فَشَلٌ", base_ar:"فشل", tr: "Başarısızlık" }, { ar: "كَسَلٌ", base_ar:"كسل", tr: "Tembellik" }, { ar: "ذَهَبٍ", base_ar:"ذهب", tr: "Altın" }, { ar: "سَمَكٍ", base_ar:"سمك", tr: "Balık" }, { ar: "هُوَ", base_ar:"هو", tr: "O - erkek" }, { ar: "هِيَ", base_ar:"هي", tr: "O - kız" }, { ar: "مِنْ", base_ar:"من", tr: "-den, -dan" } ] },
             2: { timePerLetter: 7, words: [ { ar: "هُوَ", base_ar:"هو", tr: "O" }, { ar: "هِيَ", base_ar:"هي", tr: "O" }, { ar: "عَنْ", base_ar:"عن", tr: "hakkında" }, { ar: "لَمْ", base_ar:"لم", tr: "-medi, -madı" }, { ar: "نَعَمْ", base_ar:"نعم", tr: "Evet" }, { ar: "جَلَسَ", base_ar:"جلس", tr: "Oturdu" }, { ar: "كَتَبَ", base_ar:"كتب", tr: "Yazdı" }, { ar: "ذَهَبٌ", base_ar:"ذهب", tr: "Altın" }, { ar: "بَحْرٌ", base_ar:"بحر", tr: "Deniz" }, { ar: "مَطْبَخٌ", base_ar:"مطبخ", tr: "Mutfak" }, { ar: "يَكْتُبُ", base_ar:"يكتب", tr: "Yazıyor" }, { ar: "يَغْسِلُ", base_ar:"يغسل", tr: "Yıkıyor" } ] },
             3: { timePerLetter: 6, words: [ { ar: "لَا", base_ar:"ل", tr: "Hayır" }, { ar: "أَنَا", base_ar:"انا", tr: "Ben" }, { ar: "بَابٌ", base_ar:"باب", tr: "Kapı" }, { ar: "هُنَا", base_ar:"هن", tr: "Burada" }, { ar: "خَارِجًا", base_ar:"خرج", tr: "Dışında" }, { ar: "يَشْرَبُ", base_ar:"يشرب", tr: "İçiyor" }, { ar: "يَغْسِلُ", base_ar:"يغسل", tr: "Yıkıyor" }, { ar: "غَسَلَ", base_ar:"غسل", tr: "Yıkadı" }, { ar: "نَعَمْ", base_ar:"نعم", tr: "Evet" }, { ar: "قَلَمٍ", base_ar:"قلم", tr: "Kalem" }, { ar: "سَمَكٌ", base_ar:"سمك", tr: "Balık" }, { ar: "أَنْ", base_ar:"ان", tr: "-mek, mak" }, { ar: "إِنْ", base_ar:"ان", tr: "-se, -sa" } ] },
             4: { timePerLetter: 5, words: [ { ar: "فِي", base_ar:"في", tr: "içinde, -da, -da" }, { ar: "مَعًا", base_ar:"مع", tr: "Beraber" }, { ar: "عِنْدَ", base_ar:"عند", tr: "var, yanında" }, { ar: "صَفٌّ", base_ar:"صف", tr: "Sınıf" }, { ar: "مَخْرَجٌ", base_ar:"مخرج", tr: "Çıkış yeri" }, { ar: "يَنَامُ", base_ar:"ينم", tr: "Uyuyor" }, { ar: "هُوَ", base_ar:"هو", tr: "O" }, { ar: "يَجْلِسُ", base_ar:"يجلس", tr: "Oturuyor" }, { ar: "يَقْرَأُ", base_ar:"يقر", tr: "Okuyor" }, { ar: "يَلْعَبُ", base_ar:"يلعب", tr: "Oynuyor" }, { ar: "يَدْرُسُ", base_ar:"يدرس", tr: "Ders Çalışıyor" }, { ar: "يَفْتَحُ", base_ar:"يفتح", tr: "Açıyor" }, { ar: "يَحْمِلُ", base_ar:"يحمل", tr: "Taşıyor" } ] },
             5: { timePerLetter: 4, words: [ { ar: "اِسْتَمِعِي", base_ar:"استمع", tr: "Dinle - kız" }, { ar: "تَشَرَّفْتُ", base_ar:"تشرفت", tr: "Tanıştığıma memnun oldum" }, { ar: "عَلَيْكُمْ", base_ar:"عليكم", tr: "üzerinize olsun" }, { ar: "وَسَهْلًا", base_ar:"وسهل", tr: "Hoş geldiniz" }, { ar: "اَلْحَمْدُ", base_ar:"حمد", tr: "Hamd" }, { ar: "اِحْتَرِمْ", base_ar:"احترم", tr: "Saygı duy!" }, { ar: "اُكْتُبِي", base_ar:"اكتب", tr: "Yaz - kız" }, { ar: "أَعِيدِي", base_ar:"اعيد", tr: "Tekrar et - kız" }, { ar: "تَعَارُف", base_ar:"تعرف", tr: "Tanışma" }, { ar: "صَبَاح", base_ar:"صبح", tr: "Sabah" }, { ar: "مَسَاءً", base_ar:"مس", tr: "Akşam" } ] },
             6: { timePerLetter: 4, words: [ { ar: "يَسْتَيْقِظُ", base_ar:"يستيقظ", tr: "Uyanıyor" }, { ar: "يَسْتَرِيحُ", base_ar:"يسترح", tr: "Dinleniyor" }, { ar: "اُدْرُسِي", base_ar:"ادرس", tr: "Ders çalış!" }, { ar: "اِتَّفَقْنَا", base_ar:"اتفق", tr: "Anlaştık!" }, { ar: "مَرْحَبًا", base_ar:"مرحب", tr: "Merhaba" }, { ar: "سَلَامٍ", base_ar:"سلم", tr: "Esenlik" }, { ar: "اِبْتَعِدْ", base_ar:"ابتعد", tr: "Uzaklaş!" }, { ar: "اُرْسُمِي", base_ar:"ارسم", tr: "Resim yap!" }, { ar: "تَحِيَّة", base_ar:"تحية", tr: "Selamlaşma" }, { ar: "يَقُومُ", base_ar:"يقوم", tr: "Kalkıyor" }, { ar: "دَفْتَرٍ", base_ar:"دفتر", tr: "Defter" }, { ar: "طَبْعًا", base_ar:"طبع", tr: "Peki, tabii!" }, { ar: "مَكْتَبٌ", base_ar:"مكتب", tr: "Masa" } ] },
             7: { timePerLetter: 3, words: [ { ar: "يَتَحَدَّثُون", base_ar:"يتحدث", tr: "Konuşuyorlar" }, { ar: "يَتَعَاوَنُون", base_ar:"يتعاون", tr: "Yardımlaşıyorlar" }, { ar: "يَرْجِعُون", base_ar:"يرجع", tr: "Dönüyorlar" }, { ar: "مَشْرُوبَات", base_ar:"مشروب", tr: "İçecekler" }, { ar: "تَكَلَّمْتُ", base_ar:"تكلم", tr: "Konuştum" }, { ar: "اِسْتَمِعِي", base_ar:"استمع", tr: "Dinle" }, { ar: "لَيْلَة", base_ar:"ليل", tr: "Gece" }, { ar: "ظُهْرٌ", base_ar:"ظهر", tr: "Öğle" }, { ar: "وَجْهٌ", base_ar:"وجه", tr: "Yüz" }, { ar: "أُنَظِّفُ", base_ar:"انظف", tr: "Temizliyorum" }, { ar: "أُرَاجِعُ", base_ar:"اراجع", tr: "Tekrar ediyorum" }, { ar: "اَلْوَدَاع", base_ar:"الوداع", tr: "Vedalaşmak" }, { ar: "طَالِبٌ", base_ar:"طالب", tr: "Erkek öğrenci" }, { ar: "كِتَابٌ", base_ar:"كتب", tr: "Kitap" } ] },
             8: { timePerLetter: 3, words: [ { ar: "مُعَلِّمَات", base_ar:"معلم", tr: "Öğretmenler" }, { ar: "مَأْكُولَات", base_ar:"ماكول", tr: "Yiyecekler" }, { ar: "يَلْعَبُون", base_ar:"يلعب", tr: "Oynuyorlar" }, { ar: "تِلْفَازٌ", base_ar:"تلفز", tr: "Televizyon" }, { ar: "مَلَابِسٍ", base_ar:"ملبس", tr: "Elbiseler" }, { ar: "نِظَامٌ", base_ar:"نظم", tr: "Düzen" }, { ar: "مُبَكِّرًا", base_ar:"مبكر", tr: "Erken" }, { ar: "اِسْتِرَاحَة", base_ar:"استرح", tr: "Dinlenmek" }, { ar: "أَتَنَاوَلُ", base_ar:"اتناول", tr: "Yiyorum" }, { ar: "تَعَلَّمْتُ", base_ar:"تعلم", tr: "Öğrendim" }, { ar: "مُدَرِّسَة", base_ar:"مدرس", tr: "Öğretmen" }, { ar: "يُصَلِّي", base_ar:"يصل", tr: "Namaz kılıyor" }, { ar: "يُنَظِّفُ", base_ar:"ينظف", tr: "Temizliyor" }, { ar: "جَمِيلٌ", base_ar:"جميل", tr: "Güzel" }, { ar: "طَاوِلَة", base_ar:"طاول", tr: "Masa" }, { ar: "يَخْرُجُ", base_ar:"يخرج", tr: "Çıkıyor" } ] }
        };

        const homeScreen = document.getElementById('homeScreen');
        const gameScreen = document.getElementById('gameScreen');
        const scoreScreen = document.getElementById('scoreScreen');
        const levelSelect = document.getElementById('levelSelect');
        const backToHomeButton = document.getElementById('backToHomeButton');
        const scoreToHomeButton = document.getElementById('scoreToHomeButton');
        const timerDisplay = document.getElementById('timerDisplay');
        const gameHeader = document.getElementById('gameHeader');
        const gameMain = document.getElementById('gameMain');
        const gameFooter = document.getElementById('gameFooter');
        const levelScoreDisplay = document.getElementById('levelScoreDisplay');
        const pointsBurst = document.getElementById('pointsBurst');
        const mistakeCounter = document.getElementById('mistakeCounter');
        const playAudioButton = document.getElementById('playAudioButton');
        const nextButton = document.getElementById('nextButton');
        const turkishWordEl = document.getElementById('turkishWord');
        const arabicOutputEl = document.getElementById('arabicOutputDisplay');
        const arabicOutputContainer = document.getElementById('arabicOutputContainer');
        const letterBankContainer = document.getElementById('letterBankContainer');
        const letterBank = document.getElementById('letterBank');
        const audioControl = document.getElementById('audioControl');
        const scoreTitle = document.getElementById('scoreTitle');
        const singlePlayerScoreText = document.getElementById('singlePlayerScoreText');
        const finalScoreValueEl = document.getElementById('finalScoreValue');
        const totalPossibleScoreEl = document.getElementById('totalPossibleScore');
        const incorrectListEl = document.getElementById('incorrectList');
        const incorrectWordsUlEl = document.getElementById('incorrectWordsUl');

        let selectedLevel = null;
        let currentWordIndex = 0;
        let levelWords = [], currentWord = {}, timerInterval, remainingTime = 0;
        let selectedLevelBtn = null;
        let gameActive = false;
        let wordActive = false;
        let autoNextTimeout;
        let audio = new Audio(); // Kelime sesleri için
        let waitingForAudioClick = false;
        let selection = [];
        let expectedFullCharIndex = 0;
        let mistakesMade = 0;
        let mistakesAllowed = 3;
        let currentLevelScore = 0;
        let incorrectWords = [];
        let basePointsPerWord = 0;
        let pointsRemainder = 0;
        const shadda = 'ّ';
        const shortVowels = ['َ', 'ِ', 'ُ', 'ً', 'ٍ', 'ٌ', 'ْ'];
        let fullWordChars = [];

        // Kelime ses dosyası yollarını oluştur
        Object.keys(gameData).forEach(level => {
            const levelData = gameData[level];
            if (levelData.words && Array.isArray(levelData.words)) {
                levelData.words.forEach((word, index) => {
                    const voiceNumber = index + 1;
                    word.audioSrc = `l${level}v${voiceNumber}.wav`;
                });
            }
        });
        console.log("Game data updated with word audio sources:", gameData);

        // Kelime sesini çalmak için fonksiyon (HTML Audio elementi ile)
         function playAudio() {
             console.log("playAudio called for word. Word object:", currentWord);
             if (!currentWord || !currentWord.audioSrc) { console.warn("No currentWord or audioSrc set for word audio."); return; }
             if (!audio.paused) { audio.pause(); audio.currentTime = 0; }
             audio.src = currentWord.audioSrc;
             console.log("Attempting to play word audio:", audio.src);
             const playPromise = audio.play();
             if (playPromise !== undefined) {
                 playPromise.catch(e => console.error("Word audio playback error:", e))
                          .then(() => console.log("Word playback started for:", audio.src));
             }
         }

        function triggerPointsBurst(points) {
            if (!pointsBurst) return;
            pointsBurst.textContent = `+${points} Puan!`;
            pointsBurst.classList.add('active');
            setTimeout(() => pointsBurst.classList.remove('active'), 800);
        }

        // Hata kaydetme ve yanlış sesini çalma
        function registerMistake(buttonRef) {
             if (!wordActive || mistakesMade >= mistakesAllowed) return;
             playSound('incorrect'); // Yanlış sesini çal
             mistakesMade++;
             updateMistakeDisplay();
             if (buttonRef) {
                  buttonRef.classList.add('error-form');
                  setTimeout(() => buttonRef.classList.remove('error-form'), 300);
             }
             if (mistakesMade >= mistakesAllowed) {
                  console.log("Hata hakkı bitti!");
                  checkAnswer(true); // Hata hakkı dolduğunda kontrol et
             }
        }

         function updateMistakeDisplay() {
             let hearts = '';
             for (let i = 0; i < mistakesAllowed - mistakesMade; i++) { hearts += '❤️ '; }
             for (let i = 0; i < mistakesMade; i++) { hearts += '🖤 '; }
             mistakeCounter.textContent = hearts.trim() || '🖤';
         }

        // Seviye seçildiğinde Web Audio bağlamını başlat
        levelSelect.addEventListener('click', (e) => {
            if (e.target.classList.contains('level-btn')) {
                initAudioContext(); // Ses bağlamını başlat/kontrol et
                if (selectedLevelBtn) { selectedLevelBtn.classList.remove('selected'); }
                selectedLevel = e.target.dataset.level;
                selectedLevelBtn = e.target;
                selectedLevelBtn.classList.add('selected');
                console.log("Level selected:", selectedLevel);
                startGame();
            }
        });

        function startGame() {
            const gameMode = 'single';
            console.log(`Starting game - Level: ${selectedLevel}, Mode: ${gameMode}`);
            clearTimeout(autoNextTimeout);
            if (!gameData[selectedLevel] || !gameData[selectedLevel].words) {
                console.error(`Oyun verisi bulunamadı! Seviye: ${selectedLevel}`);
                if (selectedLevelBtn) { selectedLevelBtn.classList.remove('selected'); }
                return;
            }
            levelWords = [...gameData[selectedLevel].words].sort(() => Math.random() - 0.5);
            currentWordIndex = 0;
            currentLevelScore = 0; incorrectWords = [];
            const numWords = levelWords.length;
            basePointsPerWord = Math.floor(100 / numWords);
            pointsRemainder = 100 % numWords;
            levelScoreDisplay.textContent = `Puan: 0`;
            mistakeCounter.style.display = 'block';
            homeScreen.classList.remove('active');
            scoreScreen.classList.remove('active');
            gameScreen.classList.add('active');
            history.pushState({ screen: 'game', mode: gameMode, level: selectedLevel }, '', '#game');
            loadWord();
        }

        function loadWord() {
            clearTimeout(autoNextTimeout); wordActive = false;
            playAudioButton.classList.remove('hidden'); // Ses butonunu göster
            nextButton.classList.add('hidden'); // İlerle butonunu gizle

            if (currentWordIndex >= levelWords.length) { showScoreScreen(); return; }
            currentWord = levelWords[currentWordIndex];
            
            // --- GÜNCELLENDİ: Yeni spesifik satır atlama mantığı ---
            const wordLength = Array.from(currentWord.ar).length;
            letterBankContainer.classList.remove('rows-2', 'rows-3', 'rows-4', 'rows-5', 'rows-11');

            if (wordLength >= 5 && wordLength <= 8) {
                letterBankContainer.classList.add('rows-2'); // 5-8 harf (2 satır)
            } else if ((wordLength >= 9 && wordLength <= 10) || (wordLength >= 12 && wordLength <= 14)) {
                letterBankContainer.classList.add('rows-3'); // 9-10, 12-14 harf (3 satır)
            } else if (wordLength === 11) {
                letterBankContainer.classList.add('rows-11'); // 11 harf (3 satır -> 4-4-3)
            } else if (wordLength === 15) {
                letterBankContainer.classList.add('rows-5'); // 15 harf (5 satır)
            } else if (wordLength >= 16) {
                letterBankContainer.classList.add('rows-4'); // 16+ harf (4 satır)
            }
            // 4 veya daha az harf için sınıf eklenmez (varsayılan 1 satır)
            // --- ---

            originalWord = currentWord.ar;
            fullWordChars = Array.from(originalWord).map((char, index) => ({ char: char, id: `${char}-${index}` }));
            const letterCount = fullWordChars.length;
            remainingTime = letterCount * gameData[selectedLevel].timePerLetter;
            timerDisplay.textContent = `⏱️${remainingTime}s`;
            clearInterval(timerInterval);
            turkishWordEl.textContent = currentWord.tr;
            selection = []; expectedFullCharIndex = 0; mistakesMade = 0;
            arabicOutputEl.textContent = ''; arabicOutputEl.classList.add('empty');
            arabicOutputContainer.style.boxShadow = 'inset 3px 3px 6px var(--color-shadow-dark), inset -3px -3px 6px var(--color-shadow-light)';
            populateLetterBank(); disableLetterBank(true); updateMistakeDisplay();
            playAudioButton.disabled = false; playAudioButton.classList.add('blinking-button');
            waitingForAudioClick = true;
        }

        function populateLetterBank() {
            letterBank.innerHTML = '';
            const allChars = Array.from(originalWord);
            const buttonsData = allChars.map((char, index) => ({ char: char, id: `${char}-${index}` }));
            buttonsData.sort(() => Math.random() - 0.5);
            const buttonElements = buttonsData.map(data => {
                const btn = document.createElement('button'); btn.className = 'letter-bank-btn key-button';
                btn.textContent = data.char; btn.dataset.value = data.char; btn.dataset.id = data.id;
                // YENİ: Butonlara lang="ar" ekle
                btn.setAttribute('lang', 'ar');
                const harekeler = ['َ','ً','ِ','ٍ','ُ','ٌ','ّ','ْ'];
                if(harekeler.includes(data.char)){ btn.classList.add('hareke-char'); }
                else { btn.classList.add('char-only'); }
                return btn;
            });
            buttonElements.forEach(btn => letterBank.appendChild(btn));
        }

        function appendCharToOutput(char) { arabicOutputEl.classList.remove('empty'); arabicOutputEl.textContent += char; }
        function disableLetterBank(disabled) {
            letterBank.querySelectorAll('.letter-bank-btn').forEach(btn => {
                if (btn.classList.contains('correct-form')) { btn.disabled = true; btn.style.opacity = '0.75'; }
                else { btn.disabled = disabled; btn.style.opacity = btn.disabled ? '0.65' : '1'; }
            });
        }
        function disableAllButtons(disabled) {
             disableLetterBank(disabled);
             playAudioButton.disabled = disabled;
        }

        function startTimer() {
            clearInterval(timerInterval); gameActive = true;
            timerInterval = setInterval(() => {
                if (!gameActive) { clearInterval(timerInterval); return; }
                remainingTime--; timerDisplay.textContent = `⏱️${remainingTime}s`;
                if (remainingTime <= 0) {
                    clearInterval(timerInterval); timerDisplay.textContent = '⏱️0s';
                    gameActive = false; wordActive = false;
                    checkAnswer(true); // Zaman bitti
                }
            }, 1000);
        }

        function checkAnswer(timeUp = false) {
             if (!wordActive && !waitingForAudioClick && !timeUp) return;
             wordActive = false; waitingForAudioClick = false;
             playAudioButton.classList.remove('blinking-button');
             clearTimeout(autoNextTimeout); clearInterval(timerInterval);
             gameActive = false; disableAllButtons(true);

             const constructedWord = arabicOutputEl.textContent;
             if(constructedWord === "") arabicOutputEl.classList.add('empty');
             else arabicOutputEl.classList.remove('empty');
             const targetWordForCheck = fullWordChars.map(item => item.char).join('');
             const isCorrect = constructedWord.trim() === targetWordForCheck.trim() && !timeUp && mistakesMade < mistakesAllowed;

             if (isCorrect) {
                 let pointsAwarded = basePointsPerWord; if (currentWordIndex < pointsRemainder) { pointsAwarded++; }
                 currentLevelScore += pointsAwarded; levelScoreDisplay.textContent = `Puan: ${currentLevelScore}`; triggerPointsBurst(pointsAwarded);
                 arabicOutputContainer.style.boxShadow = 'inset 3px 3px 6px #76b198, inset -3px -3px 6px #baffa0';
                 autoNextTimeout = setTimeout(nextWord, 1000); // Doğruysa 1sn sonra otomatik geç
             } else {
                 if (timeUp || mistakesMade >= mistakesAllowed) { playSound('incorrect'); }
                 arabicOutputContainer.style.boxShadow = 'inset 3px 3px 6px #d35f61, inset -3px -3px 6px #ff8386';
                 if (!incorrectWords.some(word => word.ar === currentWord.ar)) {
                     incorrectWords.push({ ar: currentWord.ar, tr: currentWord.tr });
                 }
                 playAudioButton.classList.add('hidden'); // Ses butonunu gizle
                 nextButton.classList.remove('hidden'); // İlerle butonunu göster
             }
        }

        function nextWord() {
            currentWordIndex++;
            loadWord(); // Yeni kelime yükle (loadWord butonları sıfırlar)
        }

        function showScoreScreen() {
            gameActive = false; waitingForAudioClick = false;
            clearTimeout(autoNextTimeout); clearInterval(timerInterval);
            gameScreen.classList.remove('active');
            scoreScreen.classList.add('active');
            finalScoreValueEl.textContent = currentLevelScore; totalPossibleScoreEl.textContent = "100";
            incorrectWordsUlEl.innerHTML = '';
            if (incorrectWords.length > 0) {
                incorrectListEl.style.display = 'block';
                incorrectWords.forEach(word => {
                    const li = document.createElement('li');
                    const spanTr = document.createElement('span'); spanTr.textContent = word.tr || '';
                    const spanAr = document.createElement('span'); spanAr.textContent = word.ar || '';
                    // YENİ: Yanlış listesine de lang="ar" ekle
                    spanAr.setAttribute('dir', 'rtl'); spanAr.setAttribute('lang', 'ar');
                    li.appendChild(spanTr); li.appendChild(spanAr);
                    incorrectWordsUlEl.appendChild(li);
                });
            } else { incorrectListEl.style.display = 'none'; }
        }

        function showHomeScreen() {
            clearTimeout(autoNextTimeout); gameActive = false; wordActive = false; waitingForAudioClick = false; clearInterval(timerInterval);
            gameScreen.classList.remove('active');
            scoreScreen.classList.remove('active');
            homeScreen.classList.add('active');
            history.replaceState({ screen: 'home' }, '', window.location.pathname);
             if (selectedLevelBtn) { selectedLevelBtn.classList.remove('selected'); selectedLevelBtn = null; } selectedLevel = null;
        }

        // Olay Dinleyicileri
        backToHomeButton.addEventListener('click', showHomeScreen);
        scoreToHomeButton.addEventListener('click', showHomeScreen);
        nextButton.addEventListener('click', nextWord);

        playAudioButton.addEventListener('click', () => {
             initAudioContext();
            if (waitingForAudioClick) {
                waitingForAudioClick = false; wordActive = true;
                playAudioButton.classList.remove('blinking-button');
                playAudio(); startTimer(); disableLetterBank(false);
            } else if (wordActive || gameActive) { playAudio();
            } else if (!gameActive && currentWord && currentWord.audioSrc) { playAudio(); }
        });

        letterBank.addEventListener('click', (e) => {
            if (!wordActive) return; initAudioContext();
            const clickedButton = e.target.closest('.letter-bank-btn:not(:disabled)');
            if (!clickedButton) return;

            playSound('touch'); // Dokunma sesini çal

            const clickedChar = clickedButton.dataset.value; const clickedId = clickedButton.dataset.id;
             if (expectedFullCharIndex >= fullWordChars.length) { registerMistake(clickedButton); return; }
             const expectedObj = fullWordChars[expectedFullCharIndex];
             
             // --- BU SATIR DOĞRU MANTIĞI İÇERİYOR ---
             if (clickedChar === expectedObj.char) {
                 // playSound('correct'); // KALDIRILDI
                 appendCharToOutput(clickedChar); clickedButton.disabled = true; clickedButton.classList.add('correct-form');
                 expectedFullCharIndex++;
                 if (expectedFullCharIndex === fullWordChars.length) { checkAnswer(false); }
             } else { registerMistake(clickedButton); }
         });

        window.addEventListener('popstate', (event) => {
             if (gameScreen.classList.contains('active') || scoreScreen.classList.contains('active')) { showHomeScreen(); }
         });

        function initializeApp() {
            document.querySelectorAll('.screen').forEach(screen => { screen.classList.remove('active'); });
            homeScreen.classList.add('active');
            history.replaceState({ screen: 'home' }, '', window.location.pathname);
             selectedLevel = null;
             const modeContainer = document.getElementById('modeSelectContainer');
             if (modeContainer) modeContainer.style.display = 'none';
        }

        initializeApp();