// GÜNCELLENDİ: Hatalı kelimeler düzeltildi/kaldırıldı
        const wordsByLetterWithHarakat = { 
            'ب': ['باب', 'خبز', 'كتاب', 'طبيب', 'بيت', 'مكتب', 'سبورة', 'حقيبة', 'شباك', 'ثلاجة', 'مصباح', 'يكتب', 'يطبخ', 'يلبس', 'واجب', 'مبكرا', 'يحب', 'أب', 'أبناء', 'طيب', 'مبتسم', 'غضوب', 'أحب', 'مباريات', 'جبن', 'بيض', 'بطيخ', 'بصل', 'بيضة', 'أبيض'], 
            'ت': ['اكتب', 'اكتبي', 'تحت', 'مكتب', 'دفتر', 'مسطرة', 'بيت', 'مطبخ', 'مرحاض', 'ستارة', 'متى', 'أتغدى', 'أكتب', 'أخت', 'احترام', 'طاعة', 'يتحدثون', 'يتعاونون', 'مستقبل', 'متواضع', 'كتابة', 'مكتبة', 'ممتع', 'وقتي', 'استراحة', 'متأخرا', 'تخطيط', 'وقت', 'عادة', 'أسنان', 'متوازن', 'تمساح', 'تفاح', 'بنت', 'تمر', 'مفتاح', 'ثلاثة', 'أثاث', 'تلميذ'], 
            'ث': ['ثلاجة', 'مثلث', 'ثلاثة', 'أثاث', 'ثوب', 'ثعلب', 'يتحدثون'], 
            'ج': ['جبل', 'دجاجة', 'شجرة', 'مسجد', 'ثلج', 'حاجة', 'خروج', 'جديد', 'يجلس', 'سجادة', 'ثلاجة', 'يخرج', 'راجع', 'مجتهد', 'جنس', 'نجاح', 'جرح', 'وجه', 'جبن', 'وجبة', 'الغداء', 'العشاء', 'جدي', 'جمل', 'خارج', 'يرجع', 'جيد'], 
            'ح': ['مرحبا', 'حقيبة', 'مفتاح', 'تمساح', 'ملح', 'لوح', 'حمام', 'مرحاض', 'سطح', 'يحمل', 'صحة', 'جرح', 'يستحم', 'صحي', 'النصيحة', 'حاضر', 'حكمة', 'الحسنة', 'حالك', 'فطور', 'الحب', 'فرح'],
            'خ': ['أنا', 'بخير', 'خبز', 'خروف', 'نخلة', 'مطبخ', 'خوخ', 'بطيخ', 'خلف', 'خارج', 'يخرج', 'يدخل', 'أخ', 'خال', 'خالة', 'إخلاص', 'آخرين', 'أخي', 'الخبز', 'الخضراوات', 'متأخرا', 'يخطط', 'تخطيط'], 
            'د': ['ديك', 'مدرسة', 'يد', 'جديد', 'أسد', 'أعد', 'أعيدي', 'مدرس', 'صديق', 'والدان', 'جد', 'جدة', 'مجتهد', 'هادئ', 'مهندس', 'عدد', 'دائما', 'جدول', 'يدرس', 'نادرا', 'إبداع', 'جد', 'يدان', 'دواء', 'بأدب', 'دولاب', 'دروس'], 
            'ذ': ['ذرة', 'أذن', 'تلميذ', 'لذيذ', 'ذهب', 'اذهب', 'أخذ', 'اعتذار', 'يؤذي', 'الغذاء', 'يأخذ'], 
            'ر': ['اقرأ', 'اقرئي', 'مرحبا', 'شكرا', 'كرسي', 'أرنب', 'جزر', 'فرس', 'صورة', 'مريض', 'أرض', 'غرفة', 'سرير', 'مروحة', 'يقرأ', 'فرن', 'يرتب', 'مرآة', 'مرتب', 'يرجع', 'يستريح', 'مبكرا', 'احترام', 'رحمة', 'صبر', 'آخرين', 'الكبار', 'الصغار', 'مر', 'أقارب', 'أسرة', 'تراحم', 'عمر', 'قراءة', 'رسم', 'رياضة', 'سفر', 'يقرأ', 'يرسم', 'يسافر', 'يصور', 'الفراغ', 'استراحة', 'يدرس', 'يستريح', 'نادر', 'شرب', 'يرتب', 'سريري', 'مرض', 'رياضة', 'العصير', 'السريع', 'غازية', 'رأس', 'قمر', 'نهر', 'مدرس'], 
            'ز': ['زرافة', 'ميزان', 'خبز', 'موز', 'جزر', 'تلفاز', 'اعتذار', 'يعتذر', 'يزور', 'عزف', 'متوازن', 'غازية', 'فطور'], 
            'س': ['اسمي', 'اسكت', 'مدرس', 'مدرسة', 'كرسي', 'مكتب', 'مسطرة', 'يجلس', 'يغسل', 'مغسلة', 'نفسي', 'كسول', 'مبتسم', 'مستقبل', 'مهندس', 'فنان', 'رسم', 'موسيقى', 'يسافر', 'فسحة', 'يدرس', 'يستريح', 'المساء', 'أسبوع', 'مسابقة', 'ماضي', 'الجسم', 'أسنان', 'يغسل', 'يستحم', 'يمارس', 'السمك', 'العصير', 'الدسم', 'السريع', 'السمنة', 'المسجد', 'لسان', 'سمكة', 'شمس'], 
            'ش': ['شباك', 'شجرة', 'شمس', 'عش', 'فراشة', 'مشمش', 'شكر', 'يشكر', 'شخصية', 'نشيط', 'مشاهدة', 'يشاهد', 'غازية', 'العشاء', 'تشرفت'], 
            'ص': ['صديق', 'صورة', 'قميص', 'بصل', 'مقصف', 'صقر', 'يصلي', 'أصلي', 'صبر', 'يصبر', 'الصغار', 'شخصية', 'صبور', 'تصوير', 'يصور', 'الصباح', 'صحة', 'صحي', 'الصحة', 'الصلاة'], 
            'ض': ['مريض', 'أبيض', 'بيضة', 'أرض', 'غضوب', 'أفضل', 'رياضة', 'مرض', 'أيضا', 'بعض', 'ضابط'], 
            'ا': ['بابا', 'حالك', 'طاولة', 'هاتف', 'ثلاجة', 'دائما', 'نادرا', 'ماذا', 'الله', 'اللقاء'], // Hatalı/gereksiz kelimeler kaldırıldı
            'و': ['هو', 'فوق', 'دولاب', 'وقت', 'يوم', 'اسبوع', 'طاولة', 'ضوء', 'وردة', 'ولد', 'واجب', 'واحد', 'وجه', 'وسخ', 'الوقت', 'نوم', 'صورة', 'خوخ', 'موز', 'عفوا', 'الواجب'], 
            'أ': ['أنا', 'بخير', 'أمان', 'اقرأ', 'اقرئي', 'أعد', 'أعيدي', 'أنت', 'أين', 'أيضا', 'أمام', 'أحيانا', 'أستيقظ', 'أتغدى', 'أقرأ', 'أكتب', 'ألعب', 'أساعد', 'أذهب', 'أرتب', 'أنظف', 'أراجع', 'أنام', 'أمانة', 'أحد', 'أب', 'أم', 'أخ', 'أخت', 'أقارب', 'أبناء', 'أهل', 'أكتشف', 'أحب', 'أكره', 'أفضل', 'أحلامي', 'أهدافي', 'أفلام', 'أسبوع', 'أعمال', 'أجل', 'أسنان', 'أكل', 'أسد', 'أذن', 'أرض', 'أبيض', 'أخي'],
            'ط': ['طاولة', 'طالب', 'طبيب', 'طعام', 'مطبخ', 'مطار', 'بطة', 'خط', 'قطار', 'شرطي', 'طريق', 'بطيخ', 'طماطم', 'مطر', 'نشيط', 'خياط', 'محطة', 'مطعم', 'بطل'],
            'ظ': ['ظهر', 'نظيف', 'منظر', 'حظ', 'نظام', 'محفظة', 'نظارة', 'انتظار', 'عظيم', 'موظف', 'مظلة', 'يحفظ', 'ملاحظة', 'محظوظ', 'ينظف'],
            'ع': ['عين', 'لعب', 'معلم', 'عصير', 'عائلة', 'عنب', 'ملعب', 'عمل', 'سريع', 'جامع', 'أسبوع', 'شارع', 'عسل', 'عصفور', 'معطف', 'نعم', 'طعام', 'شعر', 'عم', 'مطعم', 'عيد', 'جميع'],
            'غ': ['غرفة', 'صغير', 'غداء', 'غابة', 'لغة', 'غزال', 'فراغ', 'مشغول', 'غني', 'بالغ', 'مغسلة', 'غرب', 'مبلغ', 'غيوم', 'ببغاء'],
            'ف': ['فيل', 'فأر', 'فراشة', 'مفتاح', 'هاتف', 'صف', 'فصل', 'دفتر', 'سفينة', 'مستشفى', 'فطور', 'فواكه', 'خفيف', 'نظيف', 'فم', 'فرن', 'عصفور', 'ملف', 'صيف', 'خريف'],
            'ق': ['قلم', 'قمر', 'قرد', 'برتقال', 'سوق', 'قهوة', 'بقرة', 'حقيبة', 'صديق', 'فوق', 'قميص', 'ورق', 'طريق', 'مقص', 'قلب', 'دقيقة', 'قصير', 'حديقة', 'سباق'],
            'ك': ['كتاب', 'كلب', 'كرسي', 'مكتب', 'سمك', 'كبير', 'مكتبة', 'شباك', 'كرة', 'سكين', 'كوب', 'ملك', 'كيف', 'مكان', 'شكرا', 'كم', 'ركبة', 'مشكلة', 'كف'],
            'ل': ['قلم', 'ملعب', 'فلفل', 'جمل', 'فيل', 'ليمون', 'جبل', 'عسل', 'بصل', 'رجل', 'لغة', 'لون', 'لحم', 'ليل', 'ولد', 'بلد', 'طويل', 'جميل', 'قليل', 'عمل', 'لعب', 'كلب', 'قلب', 'مقلمة', 'حليب', 'فصل', 'لسان'],
            'م': ['موز', 'قمر', 'معلم', 'قلم', 'مدرسة', 'حمام', 'ملعب', 'تمساح', 'مفتاح', 'فم', 'أم', 'عم', 'جمل', 'نجم', 'ماء', 'سماء', 'شمس', 'خيمة', 'عالم', 'حمار', 'مطبخ'],
            'ن': ['نجم', 'نهر', 'أنف', 'عنب', 'فنجان', 'بنت', 'نار', 'سنة', 'حصان', 'ليمون', 'عنوان', 'نور', 'نافذة', 'صحن', 'سفينة', 'نحلة', 'منزل', 'نظارة', 'بندورة'],
            'ه': ['هاتف', 'نهر', 'وجه', 'ذهب', 'شهر', 'زهرة', 'هدية', 'نهاية', 'هرم', 'مهندس', 'هواء', 'فواكه', 'سهل', 'ظهر', 'هلال', 'شهادة', 'مياه'],
            'ي': ['يد', 'بيت', 'عين', 'سيارة', 'طيور', 'فيل', 'ليمون', 'بيض', 'صيف', 'عيد', 'جميل', 'حليب', 'سكين', 'يمين', 'حديقة', 'ضيف', 'خيمة', 'رياضة', 'يوم'] 
        };
        const letterForms = { 'ب': ['بـ', 'ـبـ', 'ـب', 'ب'], 'ت': ['تـ', 'ـتـ', 'ـت', 'ت'], 'ث': ['ثـ', 'ـثـ', 'ـث', 'ث'], 'ج': ['جـ', 'ـجـ', 'ـج', 'ج'], 'ح': ['حـ', 'ـحـ', 'ـح', 'ح'], 'خ': ['خـ', 'ـخـ', 'ـخ', 'خ'], 'د': ['د', 'ـد'], 'ذ': ['ذ', 'ـذ'], 'ر': ['ر', 'ـر'], 'ز': ['ز', 'ـز'], 'س': ['سـ', 'ـسـ', 'ـس', 'س'], 'ش': ['شـ', 'ـشـ', 'ـش', 'ش'], 'ص': ['صـ', 'ـصـ', 'ـص', 'ص'], 'ض': ['ضـ', 'ـضـ', 'ـض', 'ض'], 'ط': ['طـ', 'ـطـ', 'ـط', 'ط'], 'ظ': ['ظـ', 'ـظـ', 'ـظ', 'ظ'], 'ع': ['عـ', 'ـعـ', 'ـع', 'ع'], 'غ': ['غـ', 'ـغـ', 'ـغ', 'غ'], 'ف': ['فـ', 'ـفـ', 'ـف', 'ف'], 'ق': ['قـ', 'ـقـ', 'ـق', 'ق'], 'ك': ['كـ', 'ـكـ', 'ـك', 'ك'], 'ل': ['لـ', 'ـلـ', 'ـل', 'ل'], 'م': ['مـ', 'ـمـ', 'ـم', 'م'], 'ن': ['نـ', 'ـنـ', 'ـن', 'ن'], 'ه': ['هـ', 'ـهـ', 'ـه', 'ه'], 'ي': ['يـ', 'ـيـ', 'ـي', 'ي'], 'ا': ['ا', 'ـا'], 'أ': ['أ', 'ـأ'], 'و': ['و', 'ـو'] };
        // <<< GÜNCELLEME 2 (Global nonConnectingChars)
        const nonConnectingChars = ['ا', 'أ', 'د', 'ذ', 'ر', 'ز', 'و'];
        const players = { '1': { el: document.getElementById('player-1'), wordEl: document.getElementById('word-1'), optionsEl: document.getElementById('options-1'), scoreEl: document.getElementById('score-1'), progressEl: document.getElementById('progress-1'), resultsEl: document.getElementById('player-1-results') }, '2': { el: document.getElementById('player-2'), wordEl: document.getElementById('word-2'), optionsEl: document.getElementById('options-2'), scoreEl: document.getElementById('score-2'), progressEl: document.getElementById('progress-2'), resultsEl: document.getElementById('player-2-results') } };
        const modal = document.getElementById('modal'); const winnerText = document.getElementById('winner-text'); const gameWrapper = document.getElementById('game-wrapper'); const rulesScreen = document.getElementById('rules-screen'); const start1PBtn = document.getElementById('start-1p-btn'); const start2PBtn = document.getElementById('start-2p-btn'); const countdownOverlay = document.getElementById('countdown-overlay'); const countdownNumber = document.getElementById('countdown-number'); const resultsWrapper = document.getElementById('results-wrapper'); const backBtn = document.getElementById('back-btn'); const difficultyScreen = document.getElementById('difficulty-screen'); const easyBtn = document.getElementById('easy-btn'); const mediumBtn = document.getElementById('medium-btn'); const hardBtn = document.getElementById('hard-btn'); const topProgressBar = document.getElementById('top-progress-bar'); const p1TimerEl = document.getElementById('p1-timer'); const p1TimerValueEl = document.getElementById('p1-timer-value');
        
        let audioCtx; let gameMode = null; let gameSettings = { words: 10, difficulty: null, timerDuration: 0 }; let state = {}; let introCountdownInterval = null; let gameTimerInterval = null; let totalTimeLeft = 0;
        
        // --- SES FONKSİYONLARI ---
        function initAudio() { 
            if (audioCtx) {
                if (audioCtx.state === 'suspended') audioCtx.resume();
                return; 
            }
            try {
                if (window.__audioCtx) { // 'mobile-boot-v2' tarafından oluşturulanı al
                    audioCtx = window.__audioCtx;
                    if (audioCtx.state === 'suspended') audioCtx.resume();
                } else {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    window.__audioCtx = audioCtx; // Kaydet
                }
            } catch(e) {
                console.error("Web Audio API not supported", e);
            }
        } 

        function playCorrectSound() { 
            if (!audioCtx) return;
            try {
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(600, audioCtx.currentTime); 
                gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime); 
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3); 
                oscillator.stop(audioCtx.currentTime + 0.3);
            } catch(e) {
                console.error("playCorrectSound error", e);
            }
        } 

        function playIncorrectSound() { 
            if (!audioCtx) return;
            try {
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.type = 'sawtooth'; 
                oscillator.frequency.setValueAtTime(200, audioCtx.currentTime); 
                gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
                oscillator.stop(audioCtx.currentTime + 0.5);
            } catch(e) {
                console.error("playIncorrectSound error", e);
            }
        }

        function playClickSound() {
            if (!audioCtx) return;
            try {
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.type = 'triangle'; 
                oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); 
                gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); 
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1); 
                oscillator.stop(audioCtx.currentTime + 0.1);
            } catch(e) {
                console.error("playClickSound error", e);
            }
        }
        // --- Ses fonksiyonları sonu ---

        function showScorePopup(player, points) { if (points <= 0) return; const playerScreen = players[player].el; if (!playerScreen) return; const popup = document.createElement('div'); popup.className = 'score-popup'; popup.textContent = `+${points}`; playerScreen.appendChild(popup); setTimeout(() => { if (popup.parentNode === playerScreen) { playerScreen.removeChild(popup); } }, 1150); } function triggerConfetti(winnerPlayer) { /* ... */ }
        function animateLetterFly(player, optionEl) { if (!optionEl || !optionEl.firstElementChild) return; const playerScreen = players[player].el; if (!playerScreen) return; const letterSpan = optionEl.firstElementChild; const letter = letterSpan.textContent; const rect = optionEl.getBoundingClientRect(); const playerRect = playerScreen.getBoundingClientRect(); const flyingChar = document.createElement('span'); flyingChar.className = 'flying-char'; flyingChar.textContent = letter; flyingChar.lang = 'ar'; const startX = rect.left + rect.width / 2 - playerRect.left; const startY = rect.top + rect.height / 2 - playerRect.top; flyingChar.style.left = `${startX}px`; flyingChar.style.top = `${startY}px`; playerScreen.appendChild(flyingChar); requestAnimationFrame(() => { flyingChar.style.transform = `translate(-50%, -150px) scale(0.8)`; flyingChar.style.opacity = '0'; }); setTimeout(() => { if (flyingChar.parentNode === playerScreen) { playerScreen.removeChild(flyingChar); } }, 600); }
        function generateMasterQuestionSet(targetNumQuestions) { console.log(`Generating questions for target: ${targetNumQuestions}`); const allLetters = Object.keys(wordsByLetterWithHarakat).filter(l => wordsByLetterWithHarakat[l] && wordsByLetterWithHarakat[l].length > 0 && letterForms[l]); let allWordsList = []; allLetters.forEach(l => { if(wordsByLetterWithHarakat[l]){ wordsByLetterWithHarakat[l].forEach(ow => { const cleanOriginal = removeHarakat(ow); if (cleanOriginal.includes(l)) allWordsList.push({ letter: l, originalWord: ow }); }); } }); allWordsList = shuffle(allWordsList); let actualWordCount = allWordsList.length; let numQuestionsToGenerate = Math.min(targetNumQuestions, actualWordCount); console.log(`Available unique words for generation: ${actualWordCount}, generating: ${numQuestionsToGenerate}`); if (numQuestionsToGenerate < gameSettings.words) { console.warn(`Insufficient words (${actualWordCount}) for target ${gameSettings.words}. Setting game words to ${numQuestionsToGenerate}.`); gameSettings.words = numQuestionsToGenerate; } const selectedWords = allWordsList.slice(0, numQuestionsToGenerate); const questions = selectedWords.map(item => { const { letter, originalWord } = item; const cleanWord = removeHarakat(originalWord); const cleanLetterIndex = cleanWord.indexOf(letter); if (cleanLetterIndex === -1) { console.error(`Letter find ERROR: "${cleanWord}", "${letter}", OW:"${originalWord}"`); return null; }
            
            // <<< GÜNCELLEME 3: YENİ GELİŞMİŞ SORU OLUŞTURMA MANTIĞI
            // Harfin kendisi, sağına (önceki harf) bağlanır mı?
            const connectsToRight = cleanLetterIndex > 0 && !nonConnectingChars.includes(cleanWord[cleanLetterIndex - 1]);
            
            // Harfin kendisi, soluna (sonraki harf) bağlanır mı?
            const connectsToLeft = cleanLetterIndex < (cleanWord.length - 1) && !nonConnectingChars.includes(letter);

            let before = cleanWord.substring(0, cleanLetterIndex);
            let after = cleanWord.substring(cleanLetterIndex + 1);

            let placeholder = "..."; // 1. Varsayılan: Hiçbir yere bağlanmaz (örn: 'ا' kelime başında -> ...كل)

            if (connectsToRight && connectsToLeft) {
                placeholder = "ـ ـ ـ"; // 2. Sağa ve sola bağlanır (örn: 'ت' -> كـ ـ ـاب)
            } else if (connectsToRight && !connectsToLeft) {
                placeholder = "ـ..."; // 3. Sadece sağa bağlanır (örn: 'ر' -> يـ...سم)
            } else if (!connectsToRight && connectsToLeft) {
                placeholder = "...ـ"; // 4. Sadece sola bağlanır (örn: 'ب' -> ...ـاب)
            }
            // 5. (!connectsToRight && !connectsToLeft) -> '...' kalır (örn: 'ا' -> ...كل)

            const questionWord = before + placeholder + after;
            // >>> GÜNCELLEME 3: BİTİŞ

            const correctForm = getCorrectForm(cleanWord, letter, cleanLetterIndex); const availableForms = letterForms[letter]; if (!availableForms) { console.error(`Form list ERROR: "${letter}"`); return null; } if (!correctForm) { console.error(`Correct form ERROR: "${cleanWord}", "${letter}", index ${cleanLetterIndex}`); return null; } let options = [correctForm]; const incorrectForms = availableForms.filter(f => f !== correctForm); const shuffledIncorrect = shuffle(incorrectForms); for (let i = 0; i < shuffledIncorrect.length && options.length < 4; i++) if (!options.includes(shuffledIncorrect[i])) options.push(shuffledIncorrect[i]); let attempts = 0; while(options.length < 2 && availableForms.length > 0 && attempts < 10) { let potentialOption = availableForms[Math.floor(Math.random() * availableForms.length)]; if (!options.includes(potentialOption)) options.push(potentialOption); attempts++; } if (options.length < 2) { console.warn(`Could not generate >= 2 options for "${cleanWord}", letter "${letter}". Skipping.`); return null; } return { letter, originalWord, word: cleanWord, questionWord, correctForm, options: shuffle(options) }; }).filter(q => q !== null); if (questions.length < gameSettings.words) { console.warn(`Post-filtering count (${questions.length}) < current game words (${gameSettings.words}). Updating AGAIN.`); gameSettings.words = questions.length; } console.log(`Final generated questions: ${questions.length}`); return questions; }
        function getCorrectForm(cleanWord, cleanLetter, cleanIndex) { const forms = letterForms[cleanLetter]; if (!forms || forms.length === 0) { console.error("getCorrectForm: No forms for letter!", cleanLetter); return cleanLetter; } if (forms.length === 1) return forms[0]; 
            // <<< GÜNCELLEME 2: Yerel nonConnectingChars tanımı SİLİNDİ
            const connectsToRight = cleanIndex > 0 && !nonConnectingChars.includes(cleanWord[cleanIndex - 1]); const connectsToLeft = cleanIndex < cleanWord.length - 1 && !nonConnectingChars.includes(cleanLetter); let targetForm = null; if (nonConnectingChars.includes(cleanLetter)) targetForm = connectsToRight ? (forms.find(f => f.startsWith('ـ')) || forms[1]) : (forms.find(f => !f.startsWith('ـ')) || forms[0]); else { if (connectsToRight && connectsToLeft) targetForm = forms.find(f => f.startsWith('ـ') && f.endsWith('ـ')) || forms[1]; else if (connectsToRight) targetForm = forms.find(f => f.startsWith('ـ') && !f.endsWith('ـ')) || (forms.length > 2 ? forms[2] : forms[0]); else if (connectsToLeft) targetForm = forms.find(f => !f.startsWith('ـ') && f.endsWith('ـ')) || forms[0]; else targetForm = forms.find(f => !f.startsWith('ـ') && !f.endsWith('ـ')) || (forms.length > 3 ? forms[3] : forms[0]); } if (!targetForm) { console.warn(`getCorrectForm: Logic failed! "${cleanWord}", "${cleanLetter}", idx ${cleanIndex}. Fallback.`); targetForm = forms[0] || cleanLetter; } return targetForm; }
        function shuffle(array) { let ci = array.length, ri; while (ci != 0) { ri = Math.floor(Math.random() * ci); ci--; [array[ci], array[ri]] = [array[ri], array[ci]]; } return array; } function removeHarakat(text) { return text.replace(/[\u0617-\u061A\u064B-\u0652]/g, ""); }
        function formatTime(s) { const m = Math.floor(s / 60); const rs = Math.round(s % 60); return `${String(m).padStart(2, '0')}:${String(rs).padStart(2, '0')}`; }
        function stopGameTimer() { if (gameTimerInterval) { clearInterval(gameTimerInterval); gameTimerInterval = null; } }
        function startGameTimer() { stopGameTimer(); if (gameMode !== '1p' || gameSettings.timerDuration <= 0 || gameSettings.words <= 0) { if (p1TimerEl) p1TimerEl.classList.add('hidden'); return; } totalTimeLeft = gameSettings.timerDuration * gameSettings.words; console.log(`Starting timer with ${gameSettings.words} words, total time: ${totalTimeLeft}s`); if(p1TimerValueEl) p1TimerValueEl.textContent = formatTime(totalTimeLeft); if(p1TimerValueEl) p1TimerValueEl.style.color = ''; if(p1TimerEl) p1TimerEl.classList.remove('hidden'); gameTimerInterval = setInterval(() => { totalTimeLeft--; if(p1TimerValueEl) p1TimerValueEl.textContent = formatTime(totalTimeLeft); if (totalTimeLeft <= 10 && totalTimeLeft > 0) if(p1TimerValueEl) p1TimerValueEl.style.color = '#EE5253'; if (totalTimeLeft <= 0) { console.log("Timer expired!"); stopGameTimer(); playIncorrectSound(); endRound('timeup'); } }, 1000); }
        function setupNewGame() { console.log("setupNewGame:", gameMode); let targetWordCount = (gameMode === '1p') ? 20 : 10; gameSettings.words = targetWordCount; console.log("Initial target words:", targetWordCount); if (gameMode === '1p' && p1TimerEl) { p1TimerEl.classList.remove('hidden'); if(p1TimerValueEl) p1TimerValueEl.textContent = formatTime(gameSettings.timerDuration * targetWordCount); } else if (p1TimerEl) p1TimerEl.classList.add('hidden'); const questions1 = generateMasterQuestionSet(targetWordCount); let currentWordCount = gameSettings.words; console.log("P1 Qs generated:", questions1.length, "Current game words:", currentWordCount); if (gameMode === '1p' && currentWordCount < targetWordCount) { totalTimeLeft = gameSettings.timerDuration * currentWordCount; if(p1TimerValueEl) p1TimerValueEl.textContent = formatTime(totalTimeLeft); console.log("Adjusted 1P timer for reduced word count:", totalTimeLeft); } state = { scores: { '1': 0 }, currentRound: -1, playerQuestions: { '1': questions1 }, answers: { '1': [] } }; players['1'].scoreEl.textContent = '0'; players['1'].wordEl.textContent = "..."; if (gameMode === '2p') { state.answers['2'] = []; const questions2 = generateMasterQuestionSet(targetWordCount); currentWordCount = gameSettings.words; console.log("P2 Qs generated:", questions2.length, "Final game words:", currentWordCount); state.playerQuestions['1'] = questions1.slice(0, currentWordCount); state.playerQuestions['2'] = questions2.slice(0, currentWordCount); state.scores['2'] = 0; state.playerResponses = { '1': null, '2': null }; state.responseTimes = { '1': null, '2': null }; players['2'].scoreEl.textContent = '0'; players['2'].wordEl.textContent = "..."; } setupProgressBars(); modal.style.display = 'none'; if (gameSettings.words > 0) { if (gameMode === '1p') startGameTimer(); nextQuestion(); } else { console.error("No questions generated!"); alert("Yeterli kelime bulunamadı, ana menüye dönülüyor."); returnToMenu(); } }
        function setupProgressBars() { const n = gameSettings.words; console.log("Setting up progress bars for", n, "words"); topProgressBar.innerHTML = ''; if (players['1'].progressEl) players['1'].progressEl.innerHTML = ''; if (players['2'].progressEl) players['2'].progressEl.innerHTML = ''; if (n <= 0) { console.warn("No questions for progress bar."); return; } if (gameMode === '1p') { let c = n > 10 ? Math.ceil(n / 2) : n; c = Math.min(10, c); let r = n > 10 ? 2 : 1; topProgressBar.style.display = 'grid'; topProgressBar.style.gridTemplateRows = `repeat(${r}, 1fr)`; topProgressBar.style.gridTemplateColumns = `repeat(${c}, 1fr)`; for (let i = 0; i < n; i++) { const wd = document.createElement('div'); wd.classList.add('progress-word'); topProgressBar.appendChild(wd); } } else { ['1', '2'].forEach(p => { if(players[p].progressEl) { players[p].progressEl.style.gridTemplateColumns = `repeat(${n}, 1fr)`; for (let i = 0; i < n; i++) { const wd = document.createElement('div'); wd.classList.add('progress-word'); players[p].progressEl.appendChild(wd); } } }); } }
        function displayQuestion(p, q) { if (!q || !q.questionWord || !q.options || q.options.length < 2) { console.error(`Invalid Q or Options: P${p}, R${state.currentRound}`, q); endRound('error'); return; } if (!players[p]?.wordEl || !players[p]?.optionsEl) { console.error(`P${p} DOM elements missing!`); return; } players[p].wordEl.textContent = q.questionWord; players[p].optionsEl.innerHTML = ''; const so = shuffle([...q.options]); players[p].optionsEl.style.gridTemplateColumns = 'repeat(2, 1fr)'; so.forEach((opt) => { const od = document.createElement('div'); od.classList.add('option'); const cs = document.createElement('span'); cs.textContent = opt; od.appendChild(cs); od.onclick = (e) => handleAnswer(p, opt, q.correctForm, e.currentTarget); players[p].optionsEl.appendChild(od); }); }
        function handleAnswer(p, selOpt, corrOpt, clickedEl) { if (gameMode === '1p' && state.answers['1'][state.currentRound] !== undefined) return; if (gameMode === '2p' && state.playerResponses[p] !== null) return; initAudio(); if (state.currentRound < 0 || state.currentRound >= gameSettings.words) { console.warn(`handleAnswer called for invalid round: ${state.currentRound}`); return; } const currQ = state.playerQuestions[p]?.[state.currentRound]; if (!currQ) { console.error(`handleAnswer: Q not found for P${p} R${state.currentRound}!`); return; } if (corrOpt === null || corrOpt === undefined) { console.error("handleAnswer: CorrectOption undefined!", currQ); highlightOptions(p, selOpt, null); setTimeout(nextQuestion, 1500); return; } const isCorr = selOpt === corrOpt; const pScreen = players[p].el; if (!pScreen) return; if (isCorr) { playCorrectSound(); pScreen.classList.add('flash-correct'); animateLetterFly(p, clickedEl); if(players[p].wordEl) setTimeout(() => { if(players[p].wordEl) players[p].wordEl.textContent = currQ.word; }, 500); setTimeout(() => pScreen.classList.remove('flash-correct'), 600); } else { playIncorrectSound(); pScreen.classList.add('incorrect-answer-effect'); setTimeout(() => pScreen.classList.remove('incorrect-answer-effect'), 600); } highlightOptions(p, selOpt, corrOpt); if (gameMode === '1p') { state.answers['1'][state.currentRound] = { word: currQ.word, correct: isCorr }; let pts = isCorr ? 5 : 0; if (isCorr) showScorePopup('1', pts); state.scores['1'] += pts; players['1'].scoreEl.textContent = state.scores['1']; const progW = topProgressBar.children; if (state.currentRound >= 0 && state.currentRound < progW.length) progW[state.currentRound].classList.add(isCorr ? 'correct' : 'incorrect'); else console.warn("1P Progress idx out of bounds:", state.currentRound, "len:", progW.length); setTimeout(nextQuestion, 1500); } else { state.playerResponses[p] = selOpt; state.responseTimes[p] = Date.now(); if (!state.answers[p]) state.answers[p] = []; state.answers[p][state.currentRound] = { word: currQ.word, correct: isCorr, time: state.responseTimes[p] }; const oP = p === '1' ? '2' : '1'; if (state.playerResponses[oP] !== null || !state.playerQuestions[oP]?.[state.currentRound]) { updateScores(); setTimeout(nextQuestion, 2000); } } }
        function highlightOptions(p, sel, corr) { const optsCont = players[p].optionsEl; if (!optsCont) return; const opts = optsCont.children; for (let opt of opts) { opt.classList.add('disabled'); if (opt.firstElementChild) { const optTxt = opt.firstElementChild.textContent; if (optTxt === corr) opt.classList.add('correct'); else if (optTxt === sel && corr !== null) opt.classList.add('incorrect'); } } }
        function updateScores() { if (state.currentRound < 0 || state.currentRound >= gameSettings.words) { console.warn("updateScores invalid round:", state.currentRound); return; } const q1 = state.playerQuestions['1']?.[state.currentRound]; const q2 = state.playerQuestions['2']?.[state.currentRound]; if (!q1 || !q2) { console.error("updateScores: Q objects not found!", state.currentRound); return; } const r1 = state.playerResponses['1']; const r2 = state.playerResponses['2']; const c1 = r1 !== null && r1 === q1.correctForm; const c2 = r2 !== null && r2 === q2.correctForm; let pts1 = 0, pts2 = 0; const t1 = state.responseTimes['1']; const t2 = state.responseTimes['2']; if (c1 && c2) { if (t1 !== null && (t2 === null || t1 < t2)) { pts1 = 10; pts2 = 5; } else if (t2 !== null && (t1 === null || t2 < t1)) { pts1 = 5; pts2 = 10; } else { pts1 = 5; pts2 = 5; } } else if (c1) { pts1 = 10; pts2 = 0; } else if (c2) { pts1 = 0; pts2 = 10; } showScorePopup('1', pts1); showScorePopup('2', pts2); state.scores['1'] += pts1; state.scores['2'] += pts2; players['1'].scoreEl.textContent = state.scores['1']; players['2'].scoreEl.textContent = state.scores['2']; const prg1 = players['1'].progressEl?.children; if (prg1 && state.currentRound < prg1.length) prg1[state.currentRound].classList.add(c1 ? 'correct' : 'incorrect'); else console.warn("P1 Progress idx out of bounds:", state.currentRound); const prg2 = players['2'].progressEl?.children; if (prg2 && state.currentRound < prg2.length) prg2[state.currentRound].classList.add(c2 ? 'correct' : 'incorrect'); else console.warn("P2 Progress idx out of bounds:", state.currentRound); }
        function nextQuestion() { state.currentRound++; console.log(`Next Round: ${state.currentRound + 1} / ${gameSettings.words}`); if (state.currentRound >= gameSettings.words) { console.log("Game Over - All questions presented."); endRound('completed'); return; } if (gameMode === '1p') { const q = state.playerQuestions['1']?.[state.currentRound]; if (q) displayQuestion('1', q); else { console.error(`1P Q ${state.currentRound} not loaded!`); endRound('error'); } } else { state.playerResponses = { '1': null, '2': null }; state.responseTimes = { '1': null, '2': null }; const q1 = state.playerQuestions['1']?.[state.currentRound]; const q2 = state.playerQuestions['2']?.[state.currentRound]; if (q1 && q2) { displayQuestion('1', q1); displayQuestion('2', q2); } else { console.error(`2P Q load error! P1:${!!q1}, P2:${!!q2} for R${state.currentRound}`); endRound('error'); } } if (gameMode === '1p' && p1TimerValueEl) p1TimerValueEl.style.color = (totalTimeLeft <= 10 && totalTimeLeft > 0) ? '#EE5253' : ''; }
        function endRound(reason) { console.log("endRound:", reason, "Total words:", gameSettings.words); stopGameTimer(); modal.classList.add(gameMode === '1p' ? 'mode-1p' : 'mode-2p'); modal.classList.remove(gameMode === '1p' ? 'mode-2p' : 'mode-1p'); const totalQuestions = gameSettings.words; if (reason === 'error' || (totalQuestions <= 0 && reason !== 'error')) { winnerText.textContent = (reason === 'error') ? "Oyun Hatası!" : "Yeterli soru bulunamadı!"; if (players['1'].resultsEl) players['1'].resultsEl.innerHTML = ''; if (players['2'].resultsEl) players['2'].resultsEl.innerHTML = ''; if (document.getElementById('result-column-2')) document.getElementById('result-column-2').style.display = 'none'; const grid = document.querySelector('#results-container .results-grid'); if (grid) grid.style.gridTemplateColumns = '1fr'; modal.style.display = 'flex'; return; } const arabicNumerals = Array.from({length: totalQuestions}, (_, i) => (i + 1).toLocaleString('ar-EG')); const score1 = state.scores ? state.scores['1'] : 0; const p1Answers = state.answers['1'] || []; const numQuestionsAnswered1P = p1Answers.filter(a => a !== undefined && a !== null).length; if (players['1'].resultsEl) players['1'].resultsEl.innerHTML = ''; else console.error("P1 results element missing!"); winnerText.lang = 'tr'; winnerText.dir = 'ltr'; if (gameMode === '1p') { const correctCount = p1Answers.filter(a => a?.correct).length; winnerText.textContent = (reason === 'timeup') ? `Süre Bitti! Skor: ${score1}` : `Tebrikler! Skor: ${score1}`; const p1H3 = document.querySelector('#result-column-1 h3'); if (p1H3) { p1H3.textContent = 'Sonuçların'; p1H3.lang = 'tr'; p1H3.dir = 'ltr'; } const scoreDiv1 = document.createElement('div'); scoreDiv1.className = 'flex items-center justify-center gap-2 text-3xl mb-2 w-full'; scoreDiv1.innerHTML = `<span class="text-4xl">⭐</span><span>${score1}</span>`; players['1'].resultsEl.appendChild(scoreDiv1); const countDiv = document.createElement('div'); countDiv.className = 'flex items-center justify-center gap-2 text-2xl mb-4 w-full text-gray-700'; countDiv.dir = 'ltr'; countDiv.innerHTML = (reason === 'timeup') ? `✓ ${correctCount} / ${numQuestionsAnswered1P} (Toplam: ${totalQuestions})` : `✓ ${correctCount} / ${totalQuestions}`; players['1'].resultsEl.appendChild(countDiv); for(let i=0; i < totalQuestions; i++){ const ans1 = p1Answers[i]; const questionWord = state.playerQuestions['1']?.[i]?.word ?? '-'; const wordToShow = ans1?.word ?? questionWord; const isCorrect = ans1?.correct ?? false; const mark1 = ans1 ? (isCorrect ? '✓' : '✗') : '-'; const color = ans1 ? (isCorrect ? 'green' : 'red') : 'grey'; const div1 = document.createElement('div'); div1.classList.add('result-item'); div1.innerHTML = `<span style="color: ${color};">${mark1}</span><span lang="ar">${wordToShow}</span><span lang="ar">${arabicNumerals[i]}</span>`; players['1'].resultsEl.appendChild(div1); } document.getElementById('result-column-2').style.display = 'none'; const grid1P = document.querySelector('#results-container .results-grid'); if (grid1P) grid1P.style.gridTemplateColumns = '1fr'; } else { if (players['2'].resultsEl) players['2'].resultsEl.innerHTML = ''; else console.error("P2 results element missing!"); document.getElementById('result-column-2').style.display = 'block'; const p1H3 = document.querySelector('#result-column-1 h3'); if (p1H3) { p1H3.textContent = 'Oyuncu 2'; p1H3.lang = 'tr'; p1H3.dir = 'ltr'; } const p2H3 = document.querySelector('#result-column-2 h3'); if (p2H3) { p2H3.textContent = 'Oyuncu 1'; p2H3.lang = 'tr'; p2H3.dir = 'ltr'; } const score2 = state.scores ? state.scores['2'] : 0; if (score1 > score2) { triggerConfetti('1'); winnerText.textContent = `Oyuncu 2 Kazandı!`; } else if (score2 > score1) { triggerConfetti('2'); winnerText.textContent = `Oyuncu 1 Kazandı!`; } else { winnerText.textContent = 'Berabere!'; } const p2Answers = state.answers['2'] || []; const scoreDiv1 = document.createElement('div'); scoreDiv1.className = 'flex items-center justify-center gap-2 text-3xl mb-4 w-full'; scoreDiv1.innerHTML = `<span class="text-4xl">⭐</span><span>${score1}</span>`; players['1'].resultsEl.appendChild(scoreDiv1); const scoreDiv2 = document.createElement('div'); scoreDiv2.className = 'flex items-center justify-center gap-2 text-3xl mb-4 w-full'; scoreDiv2.innerHTML = `<span class="text-4xl">⭐</span><span>${score2}</span>`; players['2'].resultsEl.appendChild(scoreDiv2); for(let i=0; i < totalQuestions; i++){ const ans1 = p1Answers[i]; const ans2 = p2Answers[i]; const q1 = state.playerQuestions['1']?.[i]; const q2 = state.playerQuestions['2']?.[i]; const word1 = ans1?.word ?? q1?.word ?? '-'; const correct1 = ans1?.correct ?? false; const time1 = ans1?.time ?? Infinity; const word2 = ans2?.word ?? q2?.word ?? '-'; const correct2 = ans2?.correct ?? false; const time2 = ans2?.time ?? Infinity; let p1Speed = false; let p2Speed = false; if (ans1 && ans2) { if (correct1 && correct2) { if (time1 < time2) p1Speed = true; else if (time2 < time1) p2Speed = true; } else if (correct1) p1Speed = true; else if (correct2) p2Speed = true; } else if (ans1 && correct1) p1Speed = true; else if (ans2 && correct2) p2Speed = true; const icon = '⚡️'; const div1 = document.createElement('div'); div1.classList.add('result-item'); const mark1 = ans1 ? (correct1 ? '✓' : '✗') : '-'; const color1 = ans1 ? (correct1 ? 'green' : 'red') : 'grey'; div1.innerHTML = `${p1Speed ? `<span class="text-yellow-500">${icon}</span>` : ''}<span style="color: ${color1};">${mark1}</span><span lang="ar">${word1}</span><span lang="ar">${arabicNumerals[i]}</span>`; players['1'].resultsEl.appendChild(div1); const div2 = document.createElement('div'); div2.classList.add('result-item'); const mark2 = ans2 ? (correct2 ? '✓' : '✗') : '-'; const color2 = ans2 ? (correct2 ? 'green' : 'red') : 'grey'; div2.innerHTML = `${p2Speed ? `<span class="text-yellow-500">${icon}</span>` : ''}<span style="color: ${color2};">${mark2}</span><span lang="ar">${word2}</span><span lang="ar">${arabicNumerals[i]}</span>`; if (players['2'].resultsEl) players['2'].resultsEl.appendChild(div2); } const resultsGrid = document.querySelector('#modal.mode-2p .results-grid'); if (resultsGrid && window.innerWidth >= 768) resultsGrid.style.gridTemplateColumns = '1fr 1fr'; else if (resultsGrid) resultsGrid.style.gridTemplateColumns = '1fr'; } resultsWrapper.style.display = 'block'; modal.style.display = 'flex'; }
        function startIntroCountdown(callback) { console.log("Intro Countdown"); if (introCountdownInterval) clearInterval(introCountdownInterval); const nums = { '3': '٣', '2': '٢', '1': '١' }; let count = 3; countdownOverlay.classList.remove('hidden'); countdownNumber.textContent = nums[count]; introCountdownInterval = setInterval(() => { count--; if (count > 0) { countdownNumber.textContent = nums[count]; } else { clearInterval(introCountdownInterval); introCountdownInterval = null; countdownOverlay.classList.add('hidden'); if(callback) { callback(); } } }, 1000); }
        function start1PGame(difficulty) { console.log("start1PGame:", difficulty); gameMode = '1p'; let timerDuration = {'easy': 6, 'medium': 4.5, 'hard': 3}[difficulty] || 5; gameSettings.difficulty = difficulty; gameSettings.timerDuration = timerDuration; document.body.classList.remove('mode-2p'); document.body.classList.add('mode-1p'); rulesScreen.classList.add('hidden'); difficultyScreen.classList.add('hidden'); gameWrapper.classList.remove('hidden'); setupNewGame(); }
        function returnToMenu() { console.log("returnToMenu"); if (introCountdownInterval) { clearInterval(introCountdownInterval); introCountdownInterval = null; countdownOverlay.classList.add('hidden'); } stopGameTimer(); state = {}; gameSettings = { words: 10, difficulty: null, timerDuration: 0 }; modal.style.display = 'none'; gameWrapper.classList.add('hidden'); difficultyScreen.classList.add('hidden'); rulesScreen.classList.remove('hidden'); if (players['1'].wordEl) players['1'].wordEl.textContent = "..."; if (players['2'].wordEl) players['2'].wordEl.textContent = "..."; document.body.classList.remove('mode-1p', 'mode-2p'); gameMode = null; }
        function returnToDifficultyScreen() { console.log("returnToDifficultyScreen (birleşik giriş)"); stopGameTimer(); state = {}; modal.style.display = 'none'; gameWrapper.classList.add('hidden'); difficultyScreen.classList.add('hidden'); rulesScreen.classList.remove('hidden'); if (players['1'].wordEl) players['1'].wordEl.textContent = "..."; }
        
        document.addEventListener('DOMContentLoaded', () => { 
            console.log("DOM Loaded"); 
            if(!backBtn || !start1PBtn || !start2PBtn || !easyBtn || !mediumBtn || !hardBtn) console.error("One or more essential buttons are missing!"); 
            
            // <<< GÜNCELLEME 1: YENİ GERİ TUŞU MANTIĞI
            if(backBtn) backBtn.onclick = () => { 
                initAudio(); 
                playClickSound(); 

                // Mevcut ekranın hangisi olduğunu kontrol et
                let onRules = !rulesScreen.classList.contains('hidden'); 
                let onDifficulty = !difficultyScreen.classList.contains('hidden'); 
                let onGame = !gameWrapper.classList.contains('hidden'); 
                let onModal = modal.style.display === 'flex'; 

                console.log(`Back btn: rules=${onRules}, diff=${onDifficulty}, game=${onGame}, modal=${onModal}, mode=${gameMode}`); 

                if (onRules) {
                    // 1. İSTEK: Ana ekrandaysa (rulesScreen), kidefarapca.com'a git
                    console.log("Ana menüde, kidefarapca.com'a yönlendiriliyor...");
                    kidefGeriDon();
                
                } else if (onDifficulty) {
                    // 2. İSTEK: Zorluk seçim ekranındaysa, ana menüye git
                    returnToMenu(); 
                
                } else if (onGame) {
                    // 2. İSTEK: Oyun ekranındaysa...
                    if (gameMode === '1p') {
                        // 1 Kişilik oyunsa, zorluk seçime dön
                        returnToDifficultyScreen(); 
                    } else {
                        // 2 Kişilik oyunsa, ana menüye dön
                        returnToMenu(); 
                    }
                
                } else if (onModal) {
                    // 2. İSTEK: Sonuç ekranındaysa (modal)...
                    if (gameMode === '1p') {
                        // 1 Kişilik sonuçsa, zorluk seçime dön
                        returnToDifficultyScreen(); 
                    } else {
                        // 2 Kişilik sonuçsa, ana menüye dön
                        returnToMenu(); 
                    }
                
                } else {
                    // Herhangi bir beklenmedik durumda ana menüye dön
                    returnToMenu();
                }
            }; 
            // >>> GÜNCELLEME 1 BİTİŞİ
            
            if (start1PBtn) start1PBtn.onclick = () => { 
                initAudio(); 
                playClickSound(); 
                console.log("1P clicked"); 
                gameMode = '1p'; 
                document.body.classList.remove('mode-2p'); 
                document.body.classList.add('mode-1p'); 
                rulesScreen.classList.add('hidden'); 
                difficultyScreen.classList.remove('hidden'); 
            }; 
            
            if (start2PBtn) start2PBtn.onclick = () => { 
                initAudio(); 
                playClickSound(); 
                console.log("2P clicked"); 
                gameMode = '2p'; 
                gameSettings.difficulty = null; 
                gameSettings.timerDuration = 0; 
                document.body.classList.remove('mode-1p'); 
                document.body.classList.add('mode-2p'); 
                rulesScreen.classList.add('hidden'); 
                gameWrapper.classList.remove('hidden'); 
                startIntroCountdown(setupNewGame); 
            }; 
            
            const replayBtn = document.getElementById('replay-btn');
            const menuBtn = document.getElementById('menu-btn');
            if (replayBtn) replayBtn.onclick = () => {
                initAudio(); playClickSound();
                modal.style.display = 'none';
                if (gameMode === '1p' && gameSettings.difficulty) {
                    start1PGame(gameSettings.difficulty);
                } else {
                    state = {};
                    gameWrapper.classList.remove('hidden');
                    startIntroCountdown(setupNewGame);
                }
            };
            if (menuBtn) menuBtn.onclick = () => { initAudio(); playClickSound(); returnToMenu(); };

            if (easyBtn) easyBtn.onclick = () => {
                initAudio(); 
                playClickSound(); 
                start1PGame('easy');
            };
            if (mediumBtn) mediumBtn.onclick = () => {
                initAudio(); 
                playClickSound(); 
                start1PGame('medium');
            };
            if (hardBtn) hardBtn.onclick = () => {
                initAudio(); 
                playClickSound(); 
                start1PGame('hard');
            }; 
        });

/* ================================ */

/* Mobile Boot Optimizations (Geliştirilmiş Viewport Düzeltmesi) */ 
    (function(){ 
        function setVhUnit(){ 
            let vh;
            if (window.visualViewport) {
                vh = window.visualViewport.height * 0.01;
            } else {
                vh = window.innerHeight * 0.01;
            }
            document.documentElement.style.setProperty('--vh', `${vh}px`); 
        } 
        setVhUnit(); 
        
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', setVhUnit);
        } else {
            window.addEventListener('resize', setVhUnit);
        }
        window.addEventListener('orientationchange', setVhUnit); 
        
        function primeAudioOnce(){ 
            try{ 
                if (window.AudioContext || window.webkitAudioContext){ 
                    if (!window.__audioCtx) { 
                        window.__audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
                    } 
                    if (window.__audioCtx.state === 'suspended') { 
                        window.__audioCtx.resume && window.__audioCtx.resume(); 
                    } 
                } 
            }catch(e){} 
            window.removeEventListener('touchstart', primeAudioOnce, {passive:true}); 
            window.removeEventListener('click', primeAudioOnce, {passive:true}); 
        } 
        window.addEventListener('touchstart', primeAudioOnce, {passive:true, once:true}); 
        window.addEventListener('click', primeAudioOnce, {passive:true, once:true}); 
        
        /* Intro ekranları için maxHeight ayarı (Gerekli) */
        const modal = document.getElementById('modal'); 
        const rules = document.getElementById('rules-screen'); 
        const difficulty = document.getElementById('difficulty-screen'); 
        [modal, rules, difficulty].forEach(el=>{ 
            if(!el) return; 
            el.style.maxHeight = 'calc(var(--vh, 1vh) * 100)'; 
            el.style.overflowY = 'auto'; 
        }); 
    })();