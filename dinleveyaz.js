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
        const seviyeAkordiyon = document.getElementById('seviyeAkordiyon');
        const seviyeBaslik = document.getElementById('seviyeBaslik');
        const seviyeSecili = document.getElementById('seviyeSecili');
        const saniyeInput = document.getElementById('saniyeInput');
        const tekrarInput = document.getElementById('tekrarInput');
        const baslaButton = document.getElementById('baslaButton');
        // Seviyelerin hazır ayarları (harf başına saniye / harf başına tekrar)
        const SEVIYE_AYAR = { '1':{sn:9,tk:6}, '2':{sn:8,tk:6}, '3':{sn:8,tk:5}, '4':{sn:7,tk:5},
                              '5':{sn:7,tk:4}, '6':{sn:6,tk:4}, '7':{sn:5,tk:3}, '8':{sn:4,tk:3} };
        let saniyePerHarf = 6, tekrarPerHarf = 4;
        let harekeYok = false;   // son 4 seviyede (5-8) harekeler gösterilmez, yalnız harfler yazılır
        const backToHomeButton = document.getElementById('backToHomeButton');
        const scoreToHomeButton = document.getElementById('scoreToHomeButton');
        const timerDisplay = document.getElementById('timerDisplay');
        const timerValueEl = document.getElementById('timerValue');
        const setTimer = (v) => { if (timerValueEl) timerValueEl.textContent = v; };
        const gameHeader = document.getElementById('gameHeader');
        const gameMain = document.getElementById('gameMain');
        const gameFooter = document.getElementById('gameFooter');
        const levelScoreDisplay = document.getElementById('levelScoreDisplay');
        const pointsBurst = document.getElementById('pointsBurst');
        const mistakeCounter = document.getElementById('mistakeCounter');
        const playAudioButton = document.getElementById('playAudioButton');
        const nextButton = document.getElementById('nextButton');
        const prevWordButton = document.getElementById('prevWordButton');
        const nextWordButton = document.getElementById('nextWordButton');
        const kelimeGostergeEl = document.getElementById('kelimeGosterge');
        const geriSayimEl = document.getElementById('geriSayim');
        let tamamlananlar = new Set();   // doğru yazılan kelime indeksleri (serbest gezinme için)
        let countdownTimer = null;
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

        // ================= SLAYT TAHTASI + SINAV MODU + OTOMATİK TEKRAR =================
        const gameMainEl     = document.getElementById('gameMain');
        const kelimeListeEl  = document.getElementById('kelimeListe');
        let   aktifKutu      = null;   // sıradaki kelimenin yazım kutusu (.ks-typed)
        const tusKonteynerEl = document.getElementById('tusKonteyner');
        const harfTuslarEl   = document.getElementById('harfTuslar');
        const harekeTuslarEl = document.getElementById('harekeTuslar');
        const slideAnswerEl  = document.getElementById('slideAnswer');
        const sesCizelgesiEl = document.getElementById('sesCizelgesi');
        const clickCheckbox  = document.getElementById('clickCheckbox');
        const examCheckbox   = document.getElementById('examCheckbox');
        const autoCheckbox   = document.getElementById('autoCheckbox');
        let examMode = false;                 // ana ekrandaki anahtardan gelir
        let autoMode = false;                 // Otomatik Yazım: harfler kendiliğinden çıkar
        let autoRevealTimer = null;
        let paused = false;                   // Duraklat/Devam durumu (Sınav modu hariç)
        const pauseButton = document.getElementById('pauseButton');
        const ZWJ = '‍';                 // birleştirme için sıfır-genişlik joiner
        // Sonraki harfe BAĞLANMAYAN harfler: bunların baş/orta hâli yoktur
        const BAGLANMAYAN = new Set(['ا','أ','إ','آ','ٱ','د','ذ','ر','ز','و','ؤ','ة','ء','ى']);
        const HAREKELER = new Set(['َ','ً','ِ','ٍ','ُ','ٌ','ّ','ْ','ٰ']);
        // İlk seviyelerde gösterilecek hareke cetveli (işaret + Türkçe ad)
        const HAREKE_CETVELI = [
            ['َ','Üstün'], ['ِ','Esre'], ['ُ','Ötre'], ['ْ','Cezm'],
            ['ّ','Şedde'], ['ً','İki üstün'], ['ٍ','İki esre'], ['ٌ','İki ötre']
        ];
        const HAREKE_SEVIYE_SINIRI = 3;       // 1-3. seviyelerde hareke cetveli gösterilir
        // Hareke panelinin grupları (soldan sağa görünecek şekilde):
        //  1) kısa harekeler  2) tenvinler  3) şedde/cezim  4) uzatma harfleri  5) tâ marbûta
        const HAREKE_GRUPLARI = [
            [ ['ُ','Ötre'], ['ِ','Esre'], ['َ','Üstün'] ],
            [ ['ٌ','İki ötre'], ['ٍ','İki esre'], ['ً','İki üstün'] ],
            [ ['ّ','Şedde'], ['ْ','Cezim'] ]
        ];
        const UZATMA_HARFLERI = [ ['ا','Uzatma'], ['و','Uzatma'], ['ي','Uzatma'] ];
        const TA_MARBUTA = [ ['ـة','Bitişik'], ['ة','Ayrı'] ];      // ـة ة (aynı harf: ة)
        const MADD = new Set(['ا','و','ي']);                        // uzatma (med) harfleri
        // Hareke panelinde de bulunan harfler (uzatma + tâ marbûta)
        const HAREKE_PANEL_HARF = new Set(['ا','و','ي','ة']);

        // Sıra vurgusu: bir sonraki harf mi yoksa hareke tarafı mı bekleniyor?
        // Harakat → hareke tarafı; kelime içinde (baş değil) gelen uzatma harfi
        // veya tâ marbûta da hareke tarafı sayılır; diğer harfler → harf tarafı.
        function siradakiHarekeTarafi(){
            if (!wordActive || expectedFullCharIndex >= fullWordChars.length) return null;
            const cur = fullWordChars[expectedFullCharIndex].char;
            if (HAREKELER.has(cur)) return true;   // yalnız harekeler hareke tarafı
            return false;                          // tüm harfler (ا و ي ة dahil) harf gridinde
        }
        function updateSiraVurgusu(){
            if (!harfTuslarEl || !harekeTuslarEl) return;
            // Önceki vurguları temizle (yalnız ilgili tuş/grup vurgulanır, hepsi değil)
            harfTuslarEl.querySelectorAll('.harf-tus.sira-aktif').forEach(el => el.classList.remove('sira-aktif'));
            harekeTuslarEl.querySelectorAll('.hareke-grup.sira-aktif').forEach(el => el.classList.remove('sira-aktif'));
            const t = siradakiHarekeTarafi();
            if (t === null) return;
            const cur = fullWordChars[expectedFullCharIndex].char;
            if (t === true){
                // Sıradaki karakterin bulunduğu HAREKE GRUBUNU vurgula
                const grup = Array.from(harekeTuslarEl.querySelectorAll('.hareke-grup'))
                    .find(g => Array.from(g.querySelectorAll('.slayt-tus')).some(b => b.dataset.value === cur));
                if (grup) grup.classList.add('sira-aktif');
            } else {
                // Sıradaki HARFİN tuşunu vurgula
                const key = Array.from(harfTuslarEl.querySelectorAll('.harf-tus'))
                    .find(b => b.dataset.value === cur);
                if (key) key.classList.add('sira-aktif');
            }
        }

        // Bir harfin dört hâli (yalın / baş / orta / son). Bağlanmayan harflerde
        // baş hâli yalınla, orta hâli son hâliyle aynı görünür (kurala uygun).
        // GÖRÜNÜR birleştirme için ZWJ yerine tatvil (ـ) kullanılır; böylece
        // baş/orta/son hâllerdeki bağlantı çizgisi ekranda net görünür.
        const TATVIL = 'ـ';   // U+0640 kashida/tatweel
        function harfHalleri(ch){
            const T = TATVIL;
            const bag = !BAGLANMAYAN.has(ch);
            return {
                yalin: ch,
                bas:   bag ? ch + T : ch,        // baş: sola bağlanır
                orta:  bag ? T + ch + T : T + ch, // orta: iki yana (bağlanmayanda yalnız sağa)
                son:   T + ch                     // son: sağa bağlanır
            };
        }
        // Kelimeden (harekeleri atarak) benzersiz kök harfleri ilk görülme sırasıyla al
        function kelimeHarfleri(ar){
            const gorulen = new Set(), out = [];
            for (const c of Array.from(ar)){
                if (HAREKELER.has(c)) continue;
                if (gorulen.has(c)) continue;
                gorulen.add(c); out.push(c);
            }
            return out;
        }
        // İki sütun kelime listesi: her satır [Türkçe | Arapça yazım kutusu].
        // Tamamlanan (currentWordIndex'ten küçük) kelimeler listeden çıkarılır;
        // böylece doğru yazıldıkça kelime kaybolur, alttakiler yukarı kayar.
        function renderTurkce(){
            if (!kelimeListeEl) return;
            kelimeListeEl.innerHTML = '';
            aktifKutu = null;
            levelWords.forEach((w, i) => {
                const satir = document.createElement('div');
                let cls = 'kelime-satir';
                if (i === currentWordIndex) cls += ' aktif';
                else if (tamamlananlar.has(i)) cls += ' tamamlandi';  // yazılan kelime kalır
                satir.className = cls;
                satir.dataset.index = i;

                const no = document.createElement('span');
                no.className = 'ks-no';
                no.textContent = (i + 1) + '.';

                const tr = document.createElement('div');
                tr.className = 'ks-turkce';
                tr.textContent = w.tr;

                const box = document.createElement('div');
                box.className = 'ks-arapca';
                box.setAttribute('dir', 'rtl'); box.setAttribute('lang', 'ar');

                const typed = document.createElement('span');
                typed.className = 'ks-typed';
                typed.setAttribute('dir', 'rtl'); typed.setAttribute('lang', 'ar');
                // tamamlanan: cevabı yeşil göster — ama SINAV MODUNDA cevap gizli kalır
                if (tamamlananlar.has(i) && i !== currentWordIndex && !examMode){
                    typed.textContent = harekeYok
                        ? Array.from(w.ar).filter(c => !HAREKELER.has(c)).join('')
                        : w.ar;
                }
                box.appendChild(typed);
                if (i === currentWordIndex) aktifKutu = typed;

                satir.appendChild(no); satir.appendChild(tr); satir.appendChild(box);
                kelimeListeEl.appendChild(satir);
            });
            // Sıradaki kelime listenin EN BAŞINA gelir; tamamlanan kelimeler yukarıda
            // KALIR (kaybolmaz) ve yukarı kaydırınca görülebilir.
            const akt = kelimeListeEl.querySelector('.kelime-satir.aktif');
            if (akt && akt.scrollIntoView) akt.scrollIntoView({ block: 'start' });
        }

        // Birleşik tuş konteynırı: harf tuşları (her biri 4 hâl, TEK buton, tekrar
        // kullanılır) + 8 hareke tuşu. Öğrenci sırayla tıklayarak kelimeyi yazar.
        function renderKeys(word){
            harfTuslarEl.innerHTML = '';
            // Harfler kelimedeki sırayla (karıştırılmadan); RTL dizilim CSS'te
            // sağlanır: kelimenin ilk harfi (ör. قلم'de ق) en sağda görünür.
            const harfler = kelimeHarfleri(word.ar);
            harfler.forEach(ch => {
                const h = harfHalleri(ch);
                const tus = document.createElement('button');
                // Kendinden sonrakiyle BİRLEŞMEYEN harfler kırmızı gösterilir
                tus.className = 'slayt-tus harf-tus key-button'
                              + (BAGLANMAYAN.has(ch) ? ' harf-baglanmaz' : '');
                tus.dataset.value = ch; tus.setAttribute('lang','ar');
                // RTL sıra: baş → orta → son → normal (yalın). Renkler: baş yeşil,
                // orta mavi, son mor, normal siyah (birleşmeyen harflerde hepsi kırmızı).
                tus.innerHTML = ['bas','orta','son','yalin']
                    .map(k => `<span class="ht-form ht-${k}">${h[k]}</span>`).join('');
                harfTuslarEl.appendChild(tus);
            });
            harekeTuslarEl.innerHTML = '';
            // Uzatma ve tâ marbûta grupları kaldırıldı: bütün harfler (ا و ي ة dahil)
            // zaten harf gridinde. Son 4 seviyede (harekeYok) harekeler de gösterilmez.
            if (!harekeYok){
                const yeniGrup = () => {
                    const g = document.createElement('div'); g.className = 'hareke-grup';
                    harekeTuslarEl.appendChild(g); return g;
                };
                HAREKE_GRUPLARI.forEach(grup => {
                    const g = yeniGrup();
                    grup.forEach(([mark, ad]) => {
                        const tus = document.createElement('button');
                        tus.className = 'slayt-tus hareke-tus key-button';
                        tus.dataset.value = mark; tus.setAttribute('lang','ar');
                        // Taşıyıcı yok: hareke tek başına gösterilir (ne tatvil ne daire).
                        // Bu font harekeleri yalın olarak doğru konumlar: üstün/ötre üstte,
                        // esre altta; tenvinler de aynı şekilde. Böylece kutudan taşma olmaz.
                        tus.innerHTML = `<span class="hk-mark">${mark}</span><span class="hk-name">${ad}</span>`;
                        g.appendChild(tus);
                    });
                });
            }
            slideAnswerEl.textContent = word.ar;   // "Doğru:" satırı (sınav modunda gizli)
        }

        // Tuşlar tekrar kullanılır: tıklamada kısa yeşil/kırmızı çakma
        function flashKey(key, tur){
            const cls = tur === 'correct' ? 'dogru-flash' : 'error-form';
            key.classList.add(cls);
            setTimeout(() => key.classList.remove('dogru-flash', 'error-form'), 260);
        }
        function disableKeys(disabled){
            document.querySelectorAll('#tusKonteyner .slayt-tus').forEach(b => {
                b.disabled = disabled; b.style.opacity = disabled ? '0.6' : '1';
            });
        }

        // --- Ses zaman çizelgesi: kaç kez ve ne zaman çalınacağı görsel ---
        function buildSesCizelgesi(total){
            if (!sesCizelgesiEl) return;
            sesCizelgesiEl.innerHTML = '';
            const bar = document.createElement('div'); bar.className = 'sc-bar';
            const bas = document.createElement('div'); bas.className = 'sc-basla';
            bas.innerHTML = '<svg viewBox="0 0 24 24" width="1.6rem" height="1.6rem" fill="currentColor"><path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
            bar.appendChild(bas);
            const track = document.createElement('div'); track.className = 'sc-track'; bar.appendChild(track);
            const prog = document.createElement('div'); prog.className = 'sc-progress'; bar.appendChild(prog);
            for (let i = 1; i <= total; i++){
                const f = (total <= 1) ? 0 : (i - 1) / total;   // çizgi üzerindeki konum (0..1)
                const dot = document.createElement('div');
                dot.className = 'sc-dot'; dot.dataset.i = i;
                dot.style.left = 'calc(2.1rem + ' + f + ' * (100% - 2.4rem))';
                dot.innerHTML = '<span class="sc-num">' + i + '</span>';
                bar.appendChild(dot);
            }
            sesCizelgesiEl.appendChild(bar);
        }
        function markSesCizelgesi(idx){
            if (!sesCizelgesiEl) return;
            sesCizelgesiEl.querySelectorAll('.sc-dot').forEach(d => {
                const i = +d.dataset.i;
                d.classList.toggle('playing', i === idx);
                d.classList.toggle('done', i < idx);
            });
        }
        function finishSesCizelgesi(){
            if (!sesCizelgesiEl) return;
            sesCizelgesiEl.querySelectorAll('.sc-dot').forEach(d => {
                d.classList.remove('playing'); d.classList.add('done');
            });
        }
        // Kırmızı zaman ilerlemesi: süre boyunca soldan sağa dolar
        function sesIlerlemeBaslat(saniye){
            const p = sesCizelgesiEl && sesCizelgesiEl.querySelector('.sc-progress');
            if (!p) return;
            p.style.transition = 'none';
            p.style.transform = 'translateY(-50%) scaleX(0)';
            void p.offsetWidth;   // reflow
            p.style.transition = 'transform ' + Math.max(0.1, saniye) + 's linear';
            p.style.transform = 'translateY(-50%) scaleX(1)';
        }
        function sesIlerlemeDurdur(){
            const p = sesCizelgesiEl && sesCizelgesiEl.querySelector('.sc-progress');
            if (!p) return;
            const t = getComputedStyle(p).transform;   // mevcut ilerlemeyi dondur
            p.style.transition = 'none';
            p.style.transform = (t && t !== 'none') ? t : 'translateY(-50%) scaleX(0)';
        }

        // --- Otomatik tekrar (imla): ses, kırmızı ilerleme her RAKAMA geldiğinde çalar ---
        let dictateTimers = [];
        function stopDictation(){
            dictateTimers.forEach(t => clearTimeout(t)); dictateTimers = [];
            audio.onended = null;
        }
        function dictate(times){
            stopDictation();
            const total = Math.max(1, times);
            buildSesCizelgesi(total);          // çizelgeyi sıfırla/kur
            // Her nokta (rakam) kelimenin süresi boyunca belli bir konumdadır; kırmızı
            // ilerleme o noktaya geldiğinde o tekrarın sesi çalar ve nokta yanar.
            const totalMs = Math.max(1, remainingTime) * 1000;
            for (let i = 1; i <= total; i++){
                const f = (total <= 1) ? 0 : (i - 1) / total;   // noktanın konumu (0..1)
                const son = (i === total);
                const t = setTimeout(() => {
                    markSesCizelgesi(i);
                    try { if (!audio.paused){ audio.pause(); audio.currentTime = 0; } } catch(e){}
                    audio.src = currentWord.audioSrc;
                    const p = audio.play(); if (p) p.catch(()=>{});
                    if (son) { audio.onended = () => finishSesCizelgesi(); }
                }, f * totalMs);
                dictateTimers.push(t);
            }
        }

        // --- 3-2-1 geri sayım (kelime seçilince ekranda) ---
        // Durum modül düzeyinde tutulur ki Duraklat/Devam geri sayımı da dondurabilsin.
        let geriSayimN = 0;
        let geriSayimSonra = null;
        function geriSayimCalisiyor(){ return !!geriSayimSonra; }   // geri sayım sürüyor mu (donmuş da olabilir)
        function stopGeriSayim(){
            if (countdownTimer){ clearTimeout(countdownTimer); countdownTimer = null; }
            geriSayimSonra = null;
            if (geriSayimEl){ geriSayimEl.classList.remove('aktif','pop'); }
        }
        function geriSayimGoster(){
            if (!geriSayimEl) return;
            geriSayimEl.textContent = geriSayimN;
            geriSayimEl.classList.remove('pop'); void geriSayimEl.offsetWidth; geriSayimEl.classList.add('pop');
        }
        function geriSayimTick(){
            geriSayimN--;
            if (geriSayimN >= 1){ geriSayimGoster(); countdownTimer = setTimeout(geriSayimTick, 1000); }
            else {
                geriSayimEl.classList.remove('aktif','pop'); countdownTimer = null;
                const s = geriSayimSonra; geriSayimSonra = null; if (s) s();
            }
        }
        function startGeriSayim(sonra){
            stopGeriSayim();
            if (!geriSayimEl){ sonra(); return; }
            geriSayimSonra = sonra;
            geriSayimN = 3;
            geriSayimEl.classList.add('aktif'); geriSayimGoster();
            countdownTimer = setTimeout(geriSayimTick, 1000);
        }

        // --- Kelime seçme / ileri-geri gezinme ---
        function gotoWord(index){
            if (!levelWords.length) return;
            if (index < 0) index = 0;
            if (index >= levelWords.length) index = levelWords.length - 1;
            stopGeriSayim(); stopDictation(); clearTimeout(autoRevealTimer);
            clearTimeout(autoNextTimeout); clearTimeout(autoStartTimeout); clearInterval(timerInterval);
            gameActive = false; wordActive = false; waitingForAudioClick = false;
            paused = false; setPauseButtonState();
            currentWordIndex = index;
            loadWord();
        }
        function updateKelimeGosterge(){
            if (kelimeGostergeEl) kelimeGostergeEl.textContent = (currentWordIndex + 1) + ' / ' + levelWords.length;
            if (prevWordButton) prevWordButton.disabled = (currentWordIndex <= 0);
            if (nextWordButton) nextWordButton.disabled = (currentWordIndex >= levelWords.length - 1);
        }

        let selectedLevel = null;
        let currentWordIndex = 0;
        let levelWords = [], currentWord = {}, timerInterval, remainingTime = 0;
        let selectedLevelBtn = null;
        let gameActive = false;
        let wordActive = false;
        let autoNextTimeout;
        let autoStartTimeout;
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

        // Kalpler kaldırıldı: yanlış tuş yalnızca kısa kırmızı çakma yapar,
        // oyunu bitirmez. Öğrenci doğru harfe basana kadar devam edebilir.
        function registerMistake(buttonRef) {
             if (!wordActive) return;
             playSound('incorrect'); // Yanlış sesini çal
             if (buttonRef) {
                  buttonRef.classList.add('error-form');
                  setTimeout(() => buttonRef.classList.remove('error-form'), 300);
             }
        }

         function updateMistakeDisplay() { /* kalpler kaldırıldı */ }

        // Seviye seçildiğinde Web Audio bağlamını başlat
        // Seviye seçimi: hazır zaman/tekrar değerlerini yükler (elle değiştirilebilir),
        // oyunu BAŞLATMAZ — "Başla" tuşu başlatır.
        // Seviye akordiyonu: aç/kapa (mobilde etkin; masaüstünde grid CSS ile hep açık)
        function seviyeAkordiyonAyarla(acik){
            if (!seviyeAkordiyon) return;
            seviyeAkordiyon.classList.toggle('acik', acik);
            if (seviyeBaslik) seviyeBaslik.setAttribute('aria-expanded', acik ? 'true' : 'false');
        }
        if (seviyeBaslik) seviyeBaslik.addEventListener('click', () => {
            seviyeAkordiyonAyarla(!seviyeAkordiyon.classList.contains('acik'));
        });
        levelSelect.addEventListener('click', (e) => {
            if (e.target.classList.contains('level-btn')) {
                initAudioContext();
                if (selectedLevelBtn) { selectedLevelBtn.classList.remove('selected'); }
                selectedLevel = e.target.dataset.level;
                selectedLevelBtn = e.target;
                selectedLevelBtn.classList.add('selected');
                const a = SEVIYE_AYAR[selectedLevel];
                if (a){ if (saniyeInput) saniyeInput.value = a.sn; if (tekrarInput) tekrarInput.value = a.tk; }
                if (baslaButton) baslaButton.disabled = false;
                // Seçim yapıldı: başlıkta seçili seviyeyi göster ve akordiyonu kapat (mobil)
                if (seviyeSecili) seviyeSecili.textContent = 'Seviye ' + selectedLevel;
                seviyeAkordiyonAyarla(false);
            }
        });
        // Ayar arttır/azalt (± tuşları)
        document.querySelectorAll('.step-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const inp = document.getElementById(btn.dataset.target);
                if (!inp) return;
                const delta = parseInt(btn.dataset.delta, 10) || 0;
                let v = (parseInt(inp.value, 10) || 0) + delta;
                const mn = parseInt(inp.min, 10), mx = parseInt(inp.max, 10);
                if (!isNaN(mn)) v = Math.max(mn, v);
                if (!isNaN(mx)) v = Math.min(mx, v);
                inp.value = v;
            });
        });
        // Üç mod (Alıştırma / Sınav / Otomatik) birbirini dışlar: her zaman tam biri açık
        const modCheckboxlar = [clickCheckbox, examCheckbox, autoCheckbox].filter(Boolean);
        modCheckboxlar.forEach((cb) => {
            cb.addEventListener('change', () => {
                if (cb.checked) {
                    // Bu mod açıldı: diğer ikisini kapat
                    modCheckboxlar.forEach((o) => { if (o !== cb) o.checked = false; });
                } else {
                    // Açık modu kapatmaya çalıştı: hiçbiri kalmasın diye Alıştırma'ya dön
                    if (!modCheckboxlar.some((o) => o.checked) && clickCheckbox) clickCheckbox.checked = true;
                }
            });
        });
        // Başla: seçilen seviye + güncel (hazır ya da elle değiştirilmiş) ayarlarla başlar
        if (baslaButton) baslaButton.addEventListener('click', () => {
            if (!selectedLevel) return;
            initAudioContext();
            startGame();
        });

        function startGame() {
            const gameMode = 'single';
            console.log(`Starting game - Level: ${selectedLevel}, Mode: ${gameMode}`);
            clearTimeout(autoNextTimeout); clearTimeout(autoStartTimeout);
            if (!gameData[selectedLevel] || !gameData[selectedLevel].words) {
                console.error(`Oyun verisi bulunamadı! Seviye: ${selectedLevel}`);
                if (selectedLevelBtn) { selectedLevelBtn.classList.remove('selected'); }
                return;
            }
            // Zaman/tekrar ayarlarını oku (hazır ya da elle değiştirilmiş)
            saniyePerHarf = Math.max(1, Math.min(60, parseInt(saniyeInput && saniyeInput.value, 10) || 6));
            tekrarPerHarf = Math.max(1, Math.min(20, parseInt(tekrarInput && tekrarInput.value, 10) || 1));
            harekeYok = (parseInt(selectedLevel, 10) >= 5);   // son 4 seviye: harekesiz (yalnız harfler)
            // Sınav modu: ana ekrandaki anahtardan; açıkken slaytın cevap tarafı gizli
            examMode = !!(examCheckbox && examCheckbox.checked);
            autoMode = !!(autoCheckbox && autoCheckbox.checked);
            gameMainEl.classList.toggle('exam-mode', examMode);
            gameMainEl.classList.toggle('auto-mode', autoMode);
            // Duraklat/Devam tuşu: Sınav modu dışındaki iki modda görünür
            paused = false;
            if (pauseButton){ pauseButton.style.display = examMode ? 'none' : 'inline-flex'; setPauseButtonState(); }
            levelWords = [...gameData[selectedLevel].words].sort(() => Math.random() - 0.5);
            currentWordIndex = 0;
            currentLevelScore = 0; incorrectWords = []; tamamlananlar = new Set();
            const numWords = levelWords.length;
            basePointsPerWord = Math.floor(100 / numWords);
            pointsRemainder = 100 % numWords;
            levelScoreDisplay.textContent = `Puan: 0`;
            mistakeCounter.style.display = 'none';
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

            // Son 4 seviyede harekeler yazılmaz: hedef yalnız harflerden oluşur.
            originalWord = harekeYok
                ? Array.from(currentWord.ar).filter(c => !HAREKELER.has(c)).join('')
                : currentWord.ar;
            fullWordChars = Array.from(originalWord).map((char, index) => ({ char: char, id: `${char}-${index}` }));
            // Her harfin bulunduğu yere göre DOĞRU yazılış hâlini hesapla
            // (baş/orta/son/normal). Öğrenci yanlış hâle basarsa hata sayılır.
            (function(){
                const li = [];
                fullWordChars.forEach((o, idx) => { if (!HAREKELER.has(o.char)) li.push(idx); });
                for (let j = 0; j < li.length; j++){
                    const idx  = li[j];
                    const ch   = fullWordChars[idx].char;
                    const prev = j > 0 ? fullWordChars[li[j-1]].char : null;
                    const oncekiBaglar  = (j > 0) && !BAGLANMAYAN.has(prev);          // önceki harf bu harfe bağlanıyor mu
                    const sonrakiBaglar = !BAGLANMAYAN.has(ch) && (j < li.length - 1); // bu harf sonrakine bağlanıyor mu
                    fullWordChars[idx].form =
                        (!oncekiBaglar && !sonrakiBaglar) ? 'yalin' :
                        (!oncekiBaglar &&  sonrakiBaglar) ? 'bas'   :
                        ( oncekiBaglar &&  sonrakiBaglar) ? 'orta'  : 'son';
                    // Uzatma (med): madd harfi (ا/و/ي) ve ÜZERİNDE hareke YOK, kelime başı değil.
                    // Harekesi olan و/ي/ا (ör. هُوَ'deki و) uzatma değil, sıradan harftir.
                    const sonraki = fullWordChars[idx + 1];
                    fullWordChars[idx].uzatma = MADD.has(ch) && j > 0 &&
                        (!sonraki || !HAREKELER.has(sonraki.char));
                }
            })();
            const letterCount = fullWordChars.length;
            // Harf sayısı (harekeler hariç) — zaman ve tekrar bundan hesaplanır
            const harfSayisi = Math.max(1, Array.from(currentWord.ar).filter(c => !HAREKELER.has(c)).length);
            remainingTime = harfSayisi * saniyePerHarf;
            setTimer(remainingTime);
            clearInterval(timerInterval);
            turkishWordEl.textContent = currentWord.tr;
            // Slaytı bu kelimeye göre çiz; sesin kaç kez tekrarlanacağı = kök harf sayısı
            renderTurkce(); renderKeys(currentWord);
            currentWord._tekrar = Math.max(1, tekrarPerHarf);   // toplam tekrar (kelime başına)
            buildSesCizelgesi(currentWord._tekrar);   // ses çalmadan önce çizelgeyi göster
            stopDictation();
            selection = []; expectedFullCharIndex = 0; mistakesMade = 0;
            arabicOutputEl.textContent = ''; arabicOutputEl.classList.add('empty');
            arabicOutputContainer.style.boxShadow = 'inset 3px 3px 6px var(--color-shadow-dark), inset -3px -3px 6px var(--color-shadow-light)';
            disableKeys(true); updateMistakeDisplay(); updateSiraVurgusu();
            updateKelimeGosterge();
            // Kelime seçilince: 3-2-1 geri say → sonra ilk ses + harf sayısı kadar tekrar.
            waitingForAudioClick = true;
            clearTimeout(autoStartTimeout);
            startGeriSayim(startCurrentWord);
        }

        // Sesi otomatik başlat (kulaklık tuşuna gerek yok): imlayı çaldır,
        // sayacı başlat ve tuşları etkinleştir.
        function startCurrentWord() {
            if (!waitingForAudioClick) return;
            initAudioContext();
            waitingForAudioClick = false; wordActive = true;
            paused = false; setPauseButtonState();
            dictate(currentWord._tekrar || 1);
            startTimer();
            disableLetterBank(false);
            updateSiraVurgusu();   // ilk sıra: harf tarafı
            if (autoMode){
                // Otomatik yazım: her harf, süresi (saniyePerHarf) dolunca kendiliğinden çıkar
                clearTimeout(autoRevealTimer);
                autoRevealTimer = setTimeout(autoRevealNext, Math.max(300, saniyePerHarf * 1000));
            }
        }

        // Otomatik yazım: sıradaki HARF ve ona bitişik harekeleri birlikte gösterir
        function autoRevealNext(){
            if (!autoMode || !wordActive) return;
            if (expectedFullCharIndex >= fullWordChars.length){ checkAnswer(false); return; }
            appendCharToOutput(fullWordChars[expectedFullCharIndex].char);
            expectedFullCharIndex++;
            while (expectedFullCharIndex < fullWordChars.length && HAREKELER.has(fullWordChars[expectedFullCharIndex].char)){
                appendCharToOutput(fullWordChars[expectedFullCharIndex].char);
                expectedFullCharIndex++;
            }
            updateSiraVurgusu();
            if (expectedFullCharIndex >= fullWordChars.length){ checkAnswer(false); }
            else { autoRevealTimer = setTimeout(autoRevealNext, Math.max(300, saniyePerHarf * 1000)); }
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

        function appendCharToOutput(char) {
            arabicOutputEl.classList.remove('empty');
            arabicOutputEl.textContent += char;
            if (aktifKutu) aktifKutu.textContent = gorunenYazi();   // sıradaki kelimenin kutusuna yansıt
        }
        // Yazılan yerde son harfin GERÇEK hâli görünsün: son harf ileri bağlanıyorsa
        // (baş/orta hâl) sonuna görünür tatvil (ـ) eklenir. Böylece öğrenci "bu harften
        // sonra harf gelecek mi" bağını yazıya bakarak anlayabilir (Arapça'nın otomatik
        // olarak son harfi sonda/yalın göstermesi yanıltmaz).
        function sonYazilanHarfHali(){
            const n = Math.min(Array.from(arabicOutputEl.textContent).length, fullWordChars.length);
            for (let k = n - 1; k >= 0; k--){
                if (!HAREKELER.has(fullWordChars[k].char)) return fullWordChars[k].form;
            }
            return null;
        }
        function gorunenYazi(){
            let s = arabicOutputEl.textContent;
            const hal = sonYazilanHarfHali();
            if (hal === 'bas' || hal === 'orta') s += TATVIL;   // ileri bağlanıyor → görünür çizgi
            return s;
        }
        function disableLetterBank(disabled) { disableKeys(disabled); }
        function disableAllButtons(disabled) {
             disableLetterBank(disabled);
             playAudioButton.disabled = disabled;
        }

        function startTimer() {
            clearInterval(timerInterval); gameActive = true;
            sesIlerlemeBaslat(remainingTime);   // kırmızı zaman ilerlemesini başlat
            timerInterval = setInterval(() => {
                if (!gameActive) { clearInterval(timerInterval); return; }
                remainingTime--; setTimer(remainingTime);
                if (remainingTime <= 0) {
                    clearInterval(timerInterval); setTimer(0);
                    // Otomatik yazımda süre bitince kelime düşmez; harf gösterimi tamamlar.
                    if (!autoMode){ gameActive = false; wordActive = false; checkAnswer(true); }
                }
            }, 1000);
        }

        // --- Duraklat / Devam (Sınav modu hariç iki modda da) ---
        function setPauseButtonState(){
            // Duraklatınca harf/hareke tuşları tıklanamaz olsun (CSS: pointer-events:none)
            if (gameMainEl) gameMainEl.classList.toggle('duraklatildi', paused);
            if (!pauseButton) return;
            pauseButton.classList.toggle('is-paused', paused);
            pauseButton.title = paused ? 'Devam et' : 'Duraklat';
            pauseButton.setAttribute('aria-label', paused ? 'Devam et' : 'Duraklat');
        }
        function pauseGame(){
            if (paused) return;
            const geriSayimda = geriSayimCalisiyor();
            if (!gameActive && !geriSayimda) return;
            paused = true;
            if (geriSayimda){
                clearTimeout(countdownTimer); countdownTimer = null;   // rakam ekranda donar
            } else {
                clearInterval(timerInterval);
                stopDictation();
                clearTimeout(autoRevealTimer);
                sesIlerlemeDurdur();
                try { audio.pause(); } catch(e){}
            }
            setPauseButtonState();
        }
        function resumeGame(){
            if (!paused) return;
            paused = false;
            setPauseButtonState();
            if (geriSayimCalisiyor()){
                // Geri sayım donmuştu: kaldığı rakamdan devam et
                clearTimeout(countdownTimer);
                countdownTimer = setTimeout(geriSayimTick, 1000);
                return;
            }
            if (remainingTime <= 0) return;
            startTimer();                              // sayaç + kırmızı ilerleme, kalan süreyle
            dictate(currentWord._tekrar || 1);         // sesi kalan süreye yeniden dağıt
            if (autoMode){
                clearTimeout(autoRevealTimer);
                autoRevealTimer = setTimeout(autoRevealNext, Math.max(300, saniyePerHarf * 1000));
            }
        }
        function togglePause(){
            if (examMode) return;
            paused ? resumeGame() : pauseGame();
        }

        function checkAnswer(timeUp = false) {
             if (!wordActive && !waitingForAudioClick && !timeUp) return;
             wordActive = false; waitingForAudioClick = false; stopDictation(); stopGeriSayim(); sesIlerlemeDurdur();
             clearTimeout(autoRevealTimer);
             playAudioButton.classList.remove('blinking-button');
             updateSiraVurgusu();   // sıra vurgusunu temizle
             clearTimeout(autoNextTimeout); clearTimeout(autoStartTimeout); clearInterval(timerInterval);
             gameActive = false; disableAllButtons(true);
             paused = false; setPauseButtonState();

             // SINAV MODU: tuşlara tıklanmaz; süre bitince sıradaki kelimeye geç
             if (examMode) { autoNextTimeout = setTimeout(nextWord, 800); return; }

             const constructedWord = arabicOutputEl.textContent;
             if(constructedWord === "") arabicOutputEl.classList.add('empty');
             else arabicOutputEl.classList.remove('empty');
             const targetWordForCheck = fullWordChars.map(item => item.char).join('');
             const isCorrect = constructedWord.trim() === targetWordForCheck.trim() && !timeUp;

             if (isCorrect) {
                 // Puan yalnızca kelime İLK kez doğru yazıldığında verilir (serbest gezinme)
                 if (!tamamlananlar.has(currentWordIndex)) {
                     let pointsAwarded = basePointsPerWord + (tamamlananlar.size < pointsRemainder ? 1 : 0);
                     currentLevelScore += pointsAwarded; levelScoreDisplay.textContent = `Puan: ${currentLevelScore}`; triggerPointsBurst(pointsAwarded);
                     tamamlananlar.add(currentWordIndex);
                 }
                 arabicOutputContainer.style.boxShadow = 'inset 3px 3px 6px #76b198, inset -3px -3px 6px #baffa0';
                 // Doğru yazılan satır yeşile döner ve LİSTEDE KALIR (kaybolmaz).
                 const aktifSatir = kelimeListeEl.querySelector('.kelime-satir.aktif');
                 if (aktifSatir){ aktifSatir.classList.add('tamamlandi'); }
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
            if (currentWordIndex + 1 < levelWords.length) { gotoWord(currentWordIndex + 1); }
            else if (tamamlananlar.size >= levelWords.length) { showScoreScreen(); }
            // aksi halde son kelimede kal — kullanıcı ileri/geri ile gezinebilir
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
            stopDictation(); stopGeriSayim(); clearTimeout(autoRevealTimer);
            clearTimeout(autoNextTimeout); clearTimeout(autoStartTimeout); gameActive = false; wordActive = false; waitingForAudioClick = false; clearInterval(timerInterval);
            paused = false; setPauseButtonState();
            gameScreen.classList.remove('active');
            scoreScreen.classList.remove('active');
            homeScreen.classList.add('active');
            history.replaceState({ screen: 'home' }, '', window.location.pathname);
             if (selectedLevelBtn) { selectedLevelBtn.classList.remove('selected'); selectedLevelBtn = null; } selectedLevel = null;
             if (baslaButton) baslaButton.disabled = true;
             // Ana menüye dönünce akordiyonu tekrar aç ve seçili rozeti temizle
             if (seviyeSecili) seviyeSecili.textContent = '';
             seviyeAkordiyonAyarla(true);
        }

        // Olay Dinleyicileri
        backToHomeButton.addEventListener('click', showHomeScreen);
        if (pauseButton) pauseButton.addEventListener('click', () => { initAudioContext(); togglePause(); });
        scoreToHomeButton.addEventListener('click', showHomeScreen);
        nextButton.addEventListener('click', nextWord);

        playAudioButton.addEventListener('click', () => {
             initAudioContext();
            if (waitingForAudioClick) {
                waitingForAudioClick = false; wordActive = true;
                playAudioButton.classList.remove('blinking-button');
                dictate(currentWord._tekrar || 1); startTimer(); disableLetterBank(false);
            } else if (wordActive || gameActive) { dictate(currentWord._tekrar || 1);
            } else if (!gameActive && currentWord && currentWord.audioSrc) { playAudio(); }
        });

        // Birleşik tuş konteynırı — tekrar kullanılabilir klavye
        tusKonteynerEl.addEventListener('click', (e) => {
            if (!wordActive) return; initAudioContext();
            const key = e.target.closest('.slayt-tus:not(:disabled)');
            if (!key) return;
            playSound('touch');
            const clickedChar = key.dataset.value;
            if (expectedFullCharIndex >= fullWordChars.length) { registerMistake(key); return; }
            const expectedObj = fullWordChars[expectedFullCharIndex];
            if (clickedChar !== expectedObj.char) { registerMistake(key); return; }

            // HARF HÂLİ KONTROLÜ: doğru yazılış (baş/orta/son/normal) seçilmeli.
            // Aynı görünen hâller (ör. bağlanmayan harfte baş=normal) kabul edilir.
            let tiklananHal = null;
            if (key.classList.contains('harf-tus')) {
                const span = e.target.closest('.ht-form');
                tiklananHal = span
                    ? ['bas','orta','son','yalin'].find(f => span.classList.contains('ht-' + f))
                    : null;
                if (!tiklananHal && expectedObj.form) { registerMistake(key); return; } // hâl belirsiz
            } else if (key.classList.contains('tamarbuta-tus')) {
                tiklananHal = key.dataset.formtype || null;                              // bitişik/ayrı
            }
            if (tiklananHal && expectedObj.form) {
                const h = harfHalleri(clickedChar);
                if (h[tiklananHal] !== h[expectedObj.form]) { registerMistake(key); return; } // yanlış hâl
            }

            appendCharToOutput(clickedChar);
            flashKey(key, 'correct');
            expectedFullCharIndex++;
            updateSiraVurgusu();   // sıra vurgusunu güncelle (harf ↔ hareke)
            if (expectedFullCharIndex === fullWordChars.length) { checkAnswer(false); }
        });

        // Bir kelimeye tıklayınca o kelime seçilir; ilgili harfleri çıkar ve
        // 3-2-1 geri sayımdan sonra sesi çalar.
        kelimeListeEl.addEventListener('click', (e) => {
            const satir = e.target.closest('.kelime-satir');
            if (!satir) return;
            const idx = parseInt(satir.dataset.index, 10);
            if (!isNaN(idx)) { initAudioContext(); gotoWord(idx); }
        });
        // İleri / geri tuşlarıyla kelimeler arası geçiş
        if (prevWordButton) prevWordButton.addEventListener('click', () => { initAudioContext(); gotoWord(currentWordIndex - 1); });
        if (nextWordButton) nextWordButton.addEventListener('click', () => { initAudioContext(); gotoWord(currentWordIndex + 1); });

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