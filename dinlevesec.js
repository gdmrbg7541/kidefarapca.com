// --- Web Audio API Ses Sistemi (Öncekiyle Aynı) ---
        let audioContext;
        let audioInitialized = false;

        function initAudioContext() {
            if (audioInitialized || !(window.AudioContext || window.webkitAudioContext)) return;
            if (!audioContext) {
                try {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    audioInitialized = true;
                    const buffer = audioContext.createBuffer(1, 1, 22050); const source = audioContext.createBufferSource();
                    source.buffer = buffer; source.connect(audioContext.destination); source.start(0);
                    audioContext.resume();
                } catch (e) { console.error("Web Audio API başlatılamadı.", e); }
            }
        }
        
        function playSound(soundKey) {
            if (!audioInitialized || !audioContext || audioContext.state !== 'running') {
                 if (audioContext && audioContext.state === 'suspended') audioContext.resume();
                 return;
            }
            const sounds = {
                touch:     { f: 300,   t: 'sine',   d: 0.05 },
                correct:   { f: 523.25,t: 'sine',   d: 0.2 },
                incorrect: { f: 164.81,t: 'square', d: 0.2 }
            };
            const sound = sounds[soundKey]; if (!sound) return;
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
        // --- Ses Sistemi Sonu ---

        // --- OYUN VERİSİ (DÜZELTİLMİŞ) ---
        // GÜNCELLEME: Birleşmeyen harfler için seçenekler 4'ten 2'ye düşürüldü.
        const gameData = {
             1: { 
                 timePerLetter: 10,
                 words: [ 
                    { 
                        tr: "Evet", audioSrc: "l1v1.wav", fullWord: "نَعَمْ",
                        steps: [
                            { correct: 'نَـ', options: ['نَـ', 'ـنَـ', 'ـنَ', 'نَ'] },
                            { correct: 'ـعَـ', options: ['عَـ', 'ـعَـ', 'ـعَ', 'عَ'] },
                            { correct: 'ـمْ', options: ['مـ', 'ـمـ', 'ـمْ', 'مْ'] }
                        ]
                    },
                    { 
                        tr: "Kalem", audioSrc: "l1v2.wav", fullWord: "قَلَمٍ",
                        steps: [
                            { correct: 'قَـ', options: ['قَـ', 'ـقَـ', 'ـقَ', 'قَ'] },
                            { correct: 'ـلَـ', options: ['لَـ', 'ـلَـ', 'ـلَ', 'لَ'] },
                            { correct: 'ـمٍ', options: ['مـ', 'ـمـ', 'ـمٍ', 'مٍ'] }
                        ]
                    },
                    { 
                        tr: "Oyun oynama", audioSrc: "l1v3.wav", fullWord: "لَعِبَ",
                        steps: [
                            { correct: 'لَـ', options: ['لَـ', 'ـلَـ', 'ـلَ', 'لَ'] },
                            { correct: 'ـعِـ', options: ['عِـ', 'ـعِـ', 'ـعِ', 'عِ'] },
                            { correct: 'ـبَ', options: ['بـ', 'ـبـ', 'ـبَ', 'بَ'] }
                        ]
                    },
                    { 
                        tr: "Çalışma", audioSrc: "l1v4.wav", fullWord: "عَمَلٌ",
                        steps: [
                            { correct: 'عَـ', options: ['عَـ', 'ـعَـ', 'ـعَ', 'عَ'] },
                            { correct: 'ـمَـ', options: ['مَـ', 'ـمَـ', 'ـمَ', 'مَ'] },
                            { correct: 'ـلٌ', options: ['لـ', 'ـلـ', 'ـلٌ', 'لٌ'] }
                        ]
                    },
                    { 
                        tr: "Başarısızlık", audioSrc: "l1v5.wav", fullWord: "فَشَلٌ",
                        steps: [
                            { correct: 'فَـ', options: ['فَـ', 'ـفَـ', 'ـفَ', 'فَ'] },
                            { correct: 'ـشَـ', options: ['شَـ', 'ـشَـ', 'ـشَ', 'شَ'] },
                            { correct: 'ـلٌ', options: ['لـ', 'ـلـ', 'ـلٌ', 'لٌ'] }
                        ]
                    },
                    { 
                        tr: "Tembellik", audioSrc: "l1v6.wav", fullWord: "كَسَلٌ",
                        steps: [
                            { correct: 'كَـ', options: ['كَـ', 'ـكَـ', 'ـكَ', 'كَ'] },
                            { correct: 'ـسَـ', options: ['سَـ', 'ـسَـ', 'ـسَ', 'سَ'] },
                            { correct: 'ـلٌ', options: ['لـ', 'ـلـ', 'ـلٌ', 'لٌ'] }
                        ]
                    },
                    { 
                        tr: "Altın", audioSrc: "l1v7.wav", fullWord: "ذَهَبٍ",
                        steps: [
                            { correct: 'ذَ', options: ['ـذَ', 'ذَ'] }, // Düzeltildi
                            { correct: 'هَـ', options: ['هَـ', 'ـهَـ', 'ـهَ', 'هَ'] },
                            { correct: 'ـبٍ', options: ['بـ', 'ـبـ', 'ـبٍ', 'بٍ'] }
                        ]
                    },
                    { 
                        tr: "Balık", audioSrc: "l1v8.wav", fullWord: "سَمَكٍ",
                        steps: [
                            { correct: 'سَـ', options: ['سَـ', 'ـسَـ', 'ـسَ', 'سَ'] },
                            { correct: 'ـمَـ', options: ['مَـ', 'ـمَـ', 'ـمَ', 'مَ'] },
                            { correct: 'ـكٍ', options: ['كـ', 'ـكـ', 'ـكٍ', 'كٍ'] }
                        ]
                    },
                    { 
                        tr: "O - erkek", audioSrc: "l1v9.wav", fullWord: "هُوَ",
                        steps: [
                            { correct: 'هُـ', options: ['هُـ', 'ـهـ', 'ـه', 'ه'] },
                            { correct: 'ـوَ', options: ['ـوَ', 'وَ'] } // Düzeltildi
                        ]
                    },
                    { 
                        tr: "O - kız", audioSrc: "l1v10.wav", fullWord: "هِيَ",
                        steps: [
                            { correct: 'هِـ', options: ['هِـ', 'ـهـ', 'ـه', 'ه'] },
                            { correct: 'ـيَ', options: ['يـ', 'ـيـ', 'ـيَ', 'يَ'] }
                        ]
                    },
                    { 
                        tr: "-den, -dan", audioSrc: "l1v11.wav", fullWord: "مِنْ",
                        steps: [
                            { correct: 'مِـ', options: ['مِـ', 'ـمِـ', 'ـمِ', 'مِ'] },
                            { correct: 'ـنْ', options: ['نـ', 'ـنـ', 'ـنْ', 'نْ'] }
                        ]
                    }
                 ] 
            },
            2: {
                timePerLetter: 7,
                words: [
                  {
                    "tr": "O",
                    "audioSrc": "l2v1.wav",
                    "fullWord": "هُوَ",
                    "steps": [
                      { "correct": "هُـ", "options": ["هُـ", "ـهُـ", "ـهُ", "هُ"] },
                      { "correct": "ـوَ", "options": ["ـوَ", "وَ"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "O",
                    "audioSrc": "l2v2.wav",
                    "fullWord": "هِيَ",
                    "steps": [
                      { "correct": "هِـ", "options": ["هِـ", "ـهِـ", "ـهِ", "هِ"] },
                      { "correct": "ـيَ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] }
                    ]
                  },
                  {
                    "tr": "hakkında",
                    "audioSrc": "l2v3.wav",
                    "fullWord": "عَنْ",
                    "steps": [
                      { "correct": "عَـ", "options": ["عَـ", "ـعَـ", "ـعَ", "عَ"] },
                      { "correct": "ـنْ", "options": ["نْـ", "ـنْـ", "ـنْ", "نْ"] }
                    ]
                  },
                  {
                    "tr": "-medi, -madı",
                    "audioSrc": "l2v4.wav",
                    "fullWord": "لَمْ",
                    "steps": [
                      { "correct": "لَـ", "options": ["لَـ", "ـلَـ", "ـلَ", "لَ"] },
                      { "correct": "ـمْ", "options": ["مـ", "ـمـ", "ـمْ", "مْ"] }
                    ]
                  },
                  {
                    "tr": "Evet",
                    "audioSrc": "l2v5.wav",
                    "fullWord": "نَعَمْ",
                    "steps": [
                      { "correct": "نَـ", "options": ["نَـ", "ـنَـ", "ـنَ", "نَ"] },
                      { "correct": "ـعَـ", "options": ["عَـ", "ـعَـ", "ـعَ", "عَ"] },
                      { "correct": "ـمْ", "options": ["مـ", "ـمـ", "ـمْ", "مْ"] }
                    ]
                  },
                  {
                    "tr": "Oturdu",
                    "audioSrc": "l2v6.wav",
                    "fullWord": "جَلَسَ",
                    "steps": [
                      { "correct": "جَـ", "options": ["جَـ", "ـجَـ", "ـجَ", "جَ"] },
                      { "correct": "ـلَـ", "options": ["لَـ", "ـلَـ", "ـلَ", "لَ"] },
                      { "correct": "ـسَ", "options": ["سَـ", "ـسَـ", "ـسَ", "سَ"] }
                    ]
                  },
                  {
                    "tr": "Yazdı",
                    "audioSrc": "l2v7.wav",
                    "fullWord": "كَتَبَ",
                    "steps": [
                      { "correct": "كَـ", "options": ["كَـ", "ـكَـ", "ـكَ", "كَ"] },
                      { "correct": "ـتَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـبَ", "options": ["بَـ", "ـبَـ", "ـبَ", "بَ"] }
                    ]
                  },
                  {
                    "tr": "Altın",
                    "audioSrc": "l2v8.wav",
                    "fullWord": "ذَهَبٌ",
                    "steps": [
                      { "correct": "ذَ", "options": ["ـذَ", "ذَ"] }, // Düzeltildi
                      { "correct": "هَـ", "options": ["هَـ", "ـهَـ", "ـهَ", "هَ"] },
                      { "correct": "ـبٌ", "options": ["بٌـ", "ـبٌـ", "ـبٌ", "بٌ"] }
                    ]
                  },
                  {
                    "tr": "Deniz",
                    "audioSrc": "l2v9.wav",
                    "fullWord": "بَحْرٌ",
                    "steps": [
                      { "correct": "بَـ", "options": ["بَـ", "ـبَـ", "ـبَ", "بَ"] },
                      { "correct": "ـحْـ", "options": ["حْـ", "ـحْـ", "ـحْ", "حْ"] },
                      { "correct": "ـرٌ", "options": ["ـرٌ", "رٌ"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Mutfak",
                    "audioSrc": "l2v10.wav",
                    "fullWord": "مَطْبَخٌ",
                    "steps": [
                      { "correct": "مَـ", "options": ["مَـ", "ـمَـ", "ـمَ", "مَ"] },
                      { "correct": "ـطْـ", "options": ["طْـ", "ـطْـ", "ـطْ", "طْ"] },
                      { "correct": "ـبَـ", "options": ["بَـ", "ـبَـ", "ـبَ", "بَ"] },
                      { "correct": "ـخٌ", "options": ["خٌـ", "ـخٌـ", "ـخٌ", "خٌ"] }
                    ]
                  },
                  {
                    "tr": "Yazıyor",
                    "audioSrc": "l2v11.wav",
                    "fullWord": "يَكْتُبُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـكْـ", "options": ["كْـ", "ـكْـ", "ـكْ", "كْ"] },
                      { "correct": "ـتُـ", "options": ["تُـ", "ـتُـ", "ـتُ", "تُ"] },
                      { "correct": "ـبُ", "options": ["بُـ", "ـبُـ", "ـبُ", "بُ"] }
                    ]
                  },
                  {
                    "tr": "Yıkıyor",
                    "audioSrc": "l2v12.wav",
                    "fullWord": "يَغْسِلُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـغْـ", "options": ["غْـ", "ـغْـ", "ـغْ", "غْ"] },
                      { "correct": "ـسِـ", "options": ["سِـ", "ـسِـ", "ـسِ", "سِ"] },
                      { "correct": "ـلُ", "options": ["لُـ", "ـلُـ", "ـلُ", "لُ"] }
                    ]
                  }
                ]
            },
            3: {
                timePerLetter: 6,
                words: [
                  {
                    "tr": "Hayır",
                    "audioSrc": "l3v1.wav",
                    "fullWord": "لَا",
                    "steps": [
                      { "correct": "لَـ", "options": ["لَـ", "ـلَـ", "ـلَ", "لَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Ben",
                    "audioSrc": "l3v2.wav",
                    "fullWord": "أَنَا",
                    "steps": [
                      { "correct": "أَ", "options": ["ـأَ", "أَ"] }, // Düzeltildi
                      { "correct": "نَـ", "options": ["نَـ", "ـنَـ", "ـنَ", "نَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Kapı",
                    "audioSrc": "l3v3.wav",
                    "fullWord": "بَابٌ",
                    "steps": [
                      { "correct": "بَـ", "options": ["بَـ", "ـبَـ", "ـبَ", "بَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "بٌ", "options": ["بٌـ", "ـبٌـ", "ـبٌ", "بٌ"] }
                    ]
                  },
                  {
                    "tr": "Burada",
                    "audioSrc": "l3v4.wav",
                    "fullWord": "هُنَا",
                    "steps": [
                      { "correct": "هُـ", "options": ["هُـ", "ـهُـ", "ـهُ", "هُ"] },
                      { "correct": "ـنَـ", "options": ["نَـ", "ـنَـ", "ـنَ", "نَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Dışında",
                    "audioSrc": "l3v5.wav",
                    "fullWord": "خَارِجًا",
                    "steps": [
                      { "correct": "خَـ", "options": ["خَـ", "ـخَـ", "ـخَ", "خَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "رِ", "options": ["ـرِ", "رِ"] }, // Düzeltildi
                      { "correct": "جًا", "options": ["ـجًا", "جًا"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "İçiyor",
                    "audioSrc": "l3v6.wav",
                    "fullWord": "يَشْرَبُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـشْـ", "options": ["شْـ", "ـشْـ", "ـشْ", "شْ"] },
                      { "correct": "ـرَ", "options": ["ـرَ", "رَ"] }, // Düzeltildi
                      { "correct": "بُ", "options": ["بُـ", "ـبُـ", "ـبُ", "بُ"] }
                    ]
                  },
                  {
                    "tr": "Yıkıyor",
                    "audioSrc": "l3v7.wav",
                    "fullWord": "يَغْسِلُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـغْـ", "options": ["غْـ", "ـغْـ", "ـغْ", "غْ"] },
                      { "correct": "ـسِـ", "options": ["سِـ", "ـسِـ", "ـسِ", "سِ"] },
                      { "correct": "ـلُ", "options": ["لُـ", "ـلُـ", "ـلُ", "لُ"] }
                    ]
                  },
                  {
                    "tr": "Yıkadı",
                    "audioSrc": "l3v8.wav",
                    "fullWord": "غَسَلَ",
                    "steps": [
                      { "correct": "غَـ", "options": ["غَـ", "ـغَـ", "ـغَ", "غَ"] },
                      { "correct": "ـسَـ", "options": ["سَـ", "ـسَـ", "ـسَ", "سَ"] },
                      { "correct": "ـلَ", "options": ["لَـ", "ـلَـ", "ـلَ", "لَ"] }
                    ]
                  },
                  {
                    "tr": "Evet",
                    "audioSrc": "l3v9.wav",
                    "fullWord": "نَعَمْ",
                    "steps": [
                      { "correct": "نَـ", "options": ["نَـ", "ـنَـ", "ـنَ", "نَ"] },
                      { "correct": "ـعَـ", "options": ["عَـ", "ـعَـ", "ـعَ", "عَ"] },
                      { "correct": "ـمْ", "options": ["مـ", "ـمـ", "ـمْ", "مْ"] }
                    ]
                  },
                  {
                    "tr": "Kalem",
                    "audioSrc": "l3v10.wav",
                    "fullWord": "قَلَمٍ",
                    "steps": [
                      { "correct": "قَـ", "options": ["قَـ", "ـقَـ", "ـقَ", "قَ"] },
                      { "correct": "ـلَـ", "options": ["لَـ", "ـلَـ", "ـلَ", "لَ"] },
                      { "correct": "ـمٍ", "options": ["مٍـ", "ـمٍـ", "ـمٍ", "مٍ"] }
                    ]
                  },
                  {
                    "tr": "Balık",
                    "audioSrc": "l3v11.wav",
                    "fullWord": "سَمَك",
                    "steps": [
                      { "correct": "سَـ", "options": ["سَـ", "ـسَـ", "ـسَ", "سَ"] },
                      { "correct": "ـمَـ", "options": ["مَـ", "ـمَـ", "ـمَ", "مَ"] },
                      { "correct": "ـك", "options": ["كـ", "ـكـ", "ـك", "ك"] }
                    ]
                  },
                  {
                    "tr": "-mek, mak",
                    "audioSrc": "l3v12.wav",
                    "fullWord": "أَنْ",
                    "steps": [
                      { "correct": "أَ", "options": ["ـأَ", "أَ"] }, // Düzeltildi
                      { "correct": "نْ", "options": ["نْـ", "ـنْـ", "ـنْ", "نْ"] }
                    ]
                  },
                  {
                    "tr": "-se, -sa",
                    "audioSrc": "l3v13.wav",
                    "fullWord": "إِنْ",
                    "steps": [
                      { "correct": "إِ", "options": ["ـإِ", "إِ"] }, // Düzeltildi
                      { "correct": "نْ", "options": ["نْـ", "ـنْـ", "ـنْ", "نْ"] }
                    ]
                  }
                ]
            },
            4: {
                timePerLetter: 5,
                words: [
                  {
                    "tr": "içinde, -da, -da",
                    "audioSrc": "l4v1.wav",
                    "fullWord": "فِي",
                    "steps": [
                      { "correct": "فِـ", "options": ["فِـ", "ـفِـ", "ـفِ", "فِ"] },
                      { "correct": "ـي", "options": ["يـ", "ـيـ", "ـي", "ي"] }
                    ]
                  },
                  {
                    "tr": "Beraber",
                    "audioSrc": "l4v2.wav",
                    "fullWord": "مَعًا",
                    "steps": [
                      { "correct": "مَـ", "options": ["مَـ", "ـمَـ", "ـمَ", "مَ"] },
                      { "correct": "ـعًا", "options": ["ـعًا", "عًا"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "var, yanında",
                    "audioSrc": "l4v3.wav",
                    "fullWord": "عِنْدَ",
                    "steps": [
                      { "correct": "عِـ", "options": ["عِـ", "ـعِـ", "ـعِ", "عِ"] },
                      { "correct": "ـنْـ", "options": ["نْـ", "ـنْـ", "ـنْ", "نْ"] },
                      { "correct": "ـدَ", "options": ["ـدَ", "دَ"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Sınıf",
                    "audioSrc": "l4v4.wav",
                    "fullWord": "صَفٌّ",
                    "steps": [
                      { "correct": "صَـ", "options": ["صَـ", "ـصَـ", "ـصَ", "صَ"] },
                      { "correct": "ـفٌّ", "options": ["فٌّـ", "ـفٌّـ", "ـفٌّ", "فٌّ"] }
                    ]
                  },
                  {
                    "tr": "Çıkış yeri",
                    "audioSrc": "l4v5.wav",
                    "fullWord": "مَخْرَجٌ",
                    "steps": [
                      { "correct": "مَـ", "options": ["مَـ", "ـمَـ", "ـمَ", "مَ"] },
                      { "correct": "ـخْـ", "options": ["خْـ", "ـخْـ", "ـخْ", "خْ"] },
                      { "correct": "ـرَ", "options": ["ـرَ", "رَ"] }, // Düzeltildi
                      { "correct": "جٌ", "options": ["جٌـ", "ـجٌـ", "ـجٌ", "جٌ"] }
                    ]
                  },
                  {
                    "tr": "Uyuyor",
                    "audioSrc": "l4v6.wav",
                    "fullWord": "يَنَامُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـنَـ", "options": ["نَـ", "ـنَـ", "ـنَ", "نَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "مُ", "options": ["مُـ", "ـمُـ", "ـمُ", "مُ"] }
                    ]
                  },
                  {
                    "tr": "O",
                    "audioSrc": "l4v7.wav",
                    "fullWord": "هُوَ",
                    "steps": [
                      { "correct": "هُـ", "options": ["هُـ", "ـهُـ", "ـهُ", "هُ"] },
                      { "correct": "ـوَ", "options": ["ـوَ", "وَ"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Oturuyor",
                    "audioSrc": "l4v8.wav",
                    "fullWord": "يَجْلِسُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـجْـ", "options": ["جْـ", "ـجْـ", "ـجْ", "جْ"] },
                      { "correct": "ـلِـ", "options": ["لِـ", "ـلِـ", "ـلِ", "لِ"] },
                      { "correct": "ـسُ", "options": ["سُـ", "ـسُـ", "ـسُ", "سُ"] }
                    ]
                  },
                  {
                    "tr": "Okuyor",
                    "audioSrc": "l4v9.wav",
                    "fullWord": "يَقْرَأُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـقْـ", "options": ["قْـ", "ـقْـ", "ـقْ", "قْ"] },
                      { "correct": "ـرَ", "options": ["ـرَ", "رَ"] }, // Düzeltildi
                      { "correct": "أُ", "options": ["ـأُ", "أُ"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Oynuyor",
                    "audioSrc": "l4v10.wav",
                    "fullWord": "يَلْعَبُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـلْـ", "options": ["لْـ", "ـلْـ", "ـلْ", "لْ"] },
                      { "correct": "ـعَـ", "options": ["عَـ", "ـعَـ", "ـعَ", "عَ"] },
                      { "correct": "ـبُ", "options": ["بُـ", "ـبُـ", "ـبُ", "بُ"] }
                    ]
                  },
                  {
                    "tr": "Ders Çalışıyor",
                    "audioSrc": "l4v11.wav",
                    "fullWord": "يَدْرُسُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـدْ", "options": ["ـدْ", "دْ"] }, // Düzeltildi
                      { "correct": "رُ", "options": ["ـرُ", "رُ"] }, // Düzeltildi
                      { "correct": "سُ", "options": ["سُـ", "ـسُـ", "ـسُ", "سُ"] }
                    ]
                  },
                  {
                    "tr": "Açıyor",
                    "audioSrc": "l4v12.wav",
                    "fullWord": "يَفْتَحُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـفْـ", "options": ["فْـ", "ـفْـ", "ـفْ", "فْ"] },
                      { "correct": "ـتَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـحُ", "options": ["حُـ", "ـحُـ", "ـحُ", "حُ"] }
                    ]
                  },
                  {
                    "tr": "Taşıyor",
                    "audioSrc": "l4v13.wav",
                    "fullWord": "يَحْمِلُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـحْـ", "options": ["حْـ", "ـحْـ", "ـحْ", "حْ"] },
                      { "correct": "ـمِـ", "options": ["مِـ", "ـمِـ", "ـمِ", "مِ"] },
                      { "correct": "ـلُ", "options": ["لُـ", "ـلُـ", "ـلُ", "لُ"] }
                    ]
                  }
                ]
            },
            5: {
                timePerLetter: 4,
                words: [
                  {
                    "tr": "Dinle - kız",
                    "audioSrc": "l5v1.wav",
                    "fullWord": "اِسْتَمِعي",
                    "steps": [
                      { "correct": "اِ", "options": ["ـاِ", "اِ"] }, // Düzeltildi
                      { "correct": "سْـ", "options": ["سْـ", "ـسْـ", "ـسْ", "سْ"] },
                      { "correct": "ـتَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـمِـ", "options": ["مِـ", "ـمِـ", "ـمِ", "مِ"] },
                      { "correct": "ـعِـ", "options": ["عِـ", "ـعِـ", "ـعِ", "عِ"] },
                      { "correct": "ـي", "options": ["يـ", "ـيـ", "ـي", "ي"] }
                    ]
                  },
                  {
                    "tr": "Tanıştığıma memnun oldum",
                    "audioSrc": "l5v2.wav",
                    "fullWord": "تَشَرَّفْتُ",
                    "steps": [
                      { "correct": "تَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـشَـ", "options": ["شَـ", "ـشَـ", "ـشَ", "شَ"] },
                      { "correct": "ـرَّ", "options": ["ـرَّ", "رَّ"] }, // Düzeltildi
                      { "correct": "فْـ", "options": ["فْـ", "ـفْـ", "ـفْ", "فْ"] },
                      { "correct": "ـتُ", "options": ["تُـ", "ـتُـ", "ـتُ", "تُ"] }
                    ]
                  },
                  {
                    "tr": "üzerinize olsun",
                    "audioSrc": "l5v3.wav",
                    "fullWord": "عَلَيْكُمْ",
                    "steps": [
                      { "correct": "عَـ", "options": ["عَـ", "ـعَـ", "ـعَ", "عَ"] },
                      { "correct": "ـلَـ", "options": ["لَـ", "ـلَـ", "ـلَ", "لَ"] },
                      { "correct": "ـيْـ", "options": ["يْـ", "ـيْـ", "ـيْ", "يْ"] },
                      { "correct": "ـكُـ", "options": ["كُـ", "ـكُـ", "ـكُ", "كُ"] },
                      { "correct": "ـمْ", "options": ["مـ", "ـمـ", "ـمْ", "مْ"] }
                    ]
                  },
                  {
                    "tr": "Hoş geldiniz",
                    "audioSrc": "l5v4.wav",
                    "fullWord": "وَسَهْلًا",
                    "steps": [
                      { "correct": "وَ", "options": ["ـوَ", "وَ"] }, // Düzeltildi
                      { "correct": "سَـ", "options": ["سَـ", "ـسَـ", "ـسَ", "سَ"] },
                      { "correct": "ـهْـ", "options": ["هْـ", "ـهْـ", "ـهْ", "هْ"] },
                      { "correct": "ـلًا", "options": ["ـلًا", "لًا"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Hamd",
                    "audioSrc": "l5v5.wav",
                    "fullWord": "الْـحَمْد",
                    "steps": [
                      { "correct": "اَ", "options": ["ـاَ", "اَ"] }, // Düzeltildi
                      { "correct": "لْـ", "options": ["لْـ", "ـلْـ", "ـلْ", "لْ"] },
                      { "correct": "ـحَـ", "options": ["حَـ", "ـحَـ", "ـحَ", "حَ"] },
                      { "correct": "ـمْـ", "options": ["مْـ", "ـمْـ", "ـمْ", "مْ"] },
                      { "correct": "ـد", "options": ["ـد", "د"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Saygı duy!",
                    "audioSrc": "l5v6.wav",
                    "fullWord": "اِحْتَرِمْ",
                    "steps": [
                      { "correct": "اِ", "options": ["ـاِ", "اِ"] }, // Düzeltildi
                      { "correct": "حْـ", "options": ["حْـ", "ـحْـ", "ـحْ", "حْ"] },
                      { "correct": "ـتَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـرِ", "options": ["ـرِ", "رِ"] }, // Düzeltildi
                      { "correct": "مْ", "options": ["مـ", "ـمـ", "ـمْ", "مْ"] }
                    ]
                  },
                  {
                    "tr": "Yaz - kız",
                    "audioSrc": "l5v7.wav",
                    "fullWord": "اكْتُبي",
                    "steps": [
                      { "correct": "ا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "كْـ", "options": ["كْـ", "ـكْـ", "ـكْ", "كْ"] },
                      { "correct": "ـتُـ", "options": ["تُـ", "ـتُـ", "ـتُ", "تُ"] },
                      { "correct": "ـبِـ", "options": ["بِـ", "ـبِـ", "ـبِ", "بِ"] },
                      { "correct": "ـي", "options": ["يـ", "ـيـ", "ـي", "ي"] }
                    ]
                  },
                  {
                    "tr": "Tekrar et - kız",
                    "audioSrc": "l5v8.wav",
                    "fullWord": "أَعِيدي",
                    "steps": [
                      { "correct": "أَ", "options": ["ـأَ", "أَ"] }, // Düzeltildi
                      { "correct": "عِـ", "options": ["عِـ", "ـعِـ", "ـعِ", "عِ"] },
                      { "correct": "ـيـ", "options": ["يـ", "ـيـ", "ـي", "ي"] },
                      { "correct": "ـدِ", "options": ["ـدِ", "دِ"] }, // Düzeltildi
                      { "correct": "ي", "options": ["يـ", "ـيـ", "ـي", "ي"] }
                    ]
                  },
                  {
                    "tr": "Tanışma",
                    "audioSrc": "l5v9.wav",
                    "fullWord": "تَعارُف",
                    "steps": [
                      { "correct": "تَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـعَـ", "options": ["عَـ", "ـعَـ", "ـعَ", "عَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "رُ", "options": ["ـرُ", "رُ"] }, // Düzeltildi
                      { "correct": "ف", "options": ["فـ", "ـفـ", "ـف", "ف"] }
                    ]
                  },
                  {
                    "tr": "Sabah",
                    "audioSrc": "l5v10.wav",
                    "fullWord": "صَبَاح",
                    "steps": [
                      { "correct": "صَـ", "options": ["صَـ", "ـصَـ", "ـصَ", "صَ"] },
                      { "correct": "ـبَـ", "options": ["بَـ", "ـبَـ", "ـبَ", "بَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "ح", "options": ["حـ", "ـحـ", "ـح", "ح"] }
                    ]
                  },
                  {
                    "tr": "Akşam",
                    "audioSrc": "l5v11.wav",
                    "fullWord": "مَسَاءً",
                    "steps": [
                      { "correct": "مَـ", "options": ["مَـ", "ـمَـ", "ـمَ", "مَ"] },
                      { "correct": "ـسَـ", "options": ["سَـ", "ـسَـ", "ـسَ", "سَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "ءً", "options": ["ـءً", "ءً"] } // Düzeltildi
                    ]
                  }
                ]
            },
            6: {
                timePerLetter: 4,
                words: [
                  {
                    "tr": "Uyanıyor",
                    "audioSrc": "l6v1.wav",
                    "fullWord": "يَسْتَيْقِظُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـسْـ", "options": ["سْـ", "ـسْـ", "ـسْ", "سْ"] },
                      { "correct": "ـتَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـيْـ", "options": ["يْـ", "ـيْـ", "ـيْ", "يْ"] },
                      { "correct": "ـقِـ", "options": ["قِـ", "ـقِـ", "ـقِ", "قِ"] },
                      { "correct": "ـظُ", "options": ["ظُـ", "ـظُـ", "ـظُ", "ظُ"] }
                    ]
                  },
                  {
                    "tr": "Dinleniyor",
                    "audioSrc": "l6v2.wav",
                    "fullWord": "يَسْتَرِيحُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـسْـ", "options": ["سْـ", "ـسْـ", "ـسْ", "سْ"] },
                      { "correct": "ـتَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـرِ", "options": ["ـرِ", "رِ"] }, // Düzeltildi
                      { "correct": "يـ", "options": ["يـ", "ـيـ", "ـي", "ي"] },
                      { "correct": "ـحُ", "options": ["حُـ", "ـحُـ", "ـحُ", "حُ"] }
                    ]
                  },
                  {
                    "tr": "Ders çalış!",
                    "audioSrc": "l6v3.wav",
                    "fullWord": "اُدْرُسِي",
                    "steps": [
                      { "correct": "اُ", "options": ["ـاُ", "اُ"] }, // Düzeltildi
                      { "correct": "دْ", "options": ["ـدْ", "دْ"] }, // Düzeltildi
                      { "correct": "رُ", "options": ["ـرُ", "رُ"] }, // Düzeltildi
                      { "correct": "سِـ", "options": ["سِـ", "ـسِـ", "ـسِ", "سِ"] },
                      { "correct": "ـي", "options": ["يـ", "ـيـ", "ـي", "ي"] }
                    ]
                  },
                  {
                    "tr": "Anlaştık!",
                    "audioSrc": "l6v4.wav",
                    "fullWord": "اِتَّفَقْنَا",
                    "steps": [
                      { "correct": "اِ", "options": ["ـاِ", "اِ"] }, // Düzeltildi
                      { "correct": "تَّـ", "options": ["تَّـ", "ـتَّـ", "ـتَّ", "تَّ"] },
                      { "correct": "ـفَـ", "options": ["فَـ", "ـفَـ", "ـفَ", "فَ"] },
                      { "correct": "ـقْـ", "options": ["قْـ", "ـقْـ", "ـقْ", "قْ"] },
                      { "correct": "ـنَـ", "options": ["نَـ", "ـنَـ", "ـنَ", "نَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Merhaba",
                    "audioSrc": "l6v5.wav",
                    "fullWord": "مَرْحَبًا",
                    "steps": [
                      { "correct": "مَـ", "options": ["مَـ", "ـمَـ", "ـمَ", "مَ"] },
                      { "correct": "ـرْ", "options": ["ـرْ", "رْ"] }, // Düzeltildi
                      { "correct": "حَـ", "options": ["حَـ", "ـحَـ", "ـحَ", "حَ"] },
                      { "correct": "ـبًا", "options": ["ـبًا", "بًا"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Esenlik",
                    "audioSrc": "l6v6.wav",
                    "fullWord": "سَلَامٍ",
                    "steps": [
                      { "correct": "سَـ", "options": ["سَـ", "ـسَـ", "ـسَ", "سَ"] },
                      { "correct": "ـلَـ", "options": ["لَـ", "ـلَـ", "ـلَ", "لَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "مٍ", "options": ["مٍـ", "ـمٍـ", "ـمٍ", "مٍ"] }
                    ]
                  },
                  {
                    "tr": "Uzaklaş!",
                    "audioSrc": "l6v7.wav",
                    "fullWord": "اِبْتَعِدْ",
                    "steps": [
                      { "correct": "اِ", "options": ["ـاِ", "اِ"] }, // Düzeltildi
                      { "correct": "بْـ", "options": ["بْـ", "ـبْـ", "ـبْ", "بْ"] },
                      { "correct": "ـتَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـعِـ", "options": ["عِـ", "ـعِـ", "ـعِ", "عِ"] },
                      { "correct": "ـدْ", "options": ["ـدْ", "دْ"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Resim yap!",
                    "audioSrc": "l6v8.wav",
                    "fullWord": "اُرْسُمِي",
                    "steps": [
                      { "correct": "اُ", "options": ["ـاُ", "اُ"] }, // Düzeltildi
                      { "correct": "رْ", "options": ["ـرْ", "رْ"] }, // Düzeltildi
                      { "correct": "سُـ", "options": ["سُـ", "ـسُـ", "ـسُ", "سُ"] },
                      { "correct": "ـمِـ", "options": ["مِـ", "ـمِـ", "ـمِ", "مِ"] },
                      { "correct": "ـي", "options": ["يـ", "ـيـ", "ـي", "ي"] }
                    ]
                  },
                  {
                    "tr": "Selamlaşma",
                    "audioSrc": "l6v9.wav",
                    "fullWord": "تَحِيَّة",
                    "steps": [
                      { "correct": "تَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـحِـ", "options": ["حِـ", "ـحِـ", "ـحِ", "حِ"] },
                      { "correct": "ـيَّـ", "options": ["يَّـ", "ـيَّـ", "ـيَّ", "يَّ"] },
                      { "correct": "ـة", "options": ["ـة", "ة"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Kalkıyor",
                    "audioSrc": "l6v10.wav",
                    "fullWord": "يَقُومُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـقُـ", "options": ["قُـ", "ـقُـ", "ـقُ", "قُ"] },
                      { "correct": "ـو", "options": ["ـو", "و"] }, // Düzeltildi
                      { "correct": "مُ", "options": ["مُـ", "ـمُـ", "ـمُ", "مُ"] }
                    ]
                  },
                  {
                    "tr": "Defter",
                    "audioSrc": "l6v11.wav",
                    "fullWord": "دَفْتَرٍ",
                    "steps": [
                      { "correct": "دَ", "options": ["ـدَ", "دَ"] }, // Düzeltildi
                      { "correct": "فْـ", "options": ["فْـ", "ـفْـ", "ـفْ", "فْ"] },
                      { "correct": "ـتَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـرٍ", "options": ["ـرٍ", "رٍ"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Peki, tabii!",
                    "audioSrc": "l6v12.wav",
                    "fullWord": "طَبْعًا",
                    "steps": [
                      { "correct": "طَـ", "options": ["طَـ", "ـطَـ", "ـطَ", "طَ"] },
                      { "correct": "ـبْـ", "options": ["بْـ", "ـبْـ", "ـبْ", "بْ"] },
                      { "correct": "ـعًا", "options": ["ـعًا", "عًا"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Masa",
                    "audioSrc": "l6v13.wav",
                    "fullWord": "مَكْتَبٌ",
                    "steps": [
                      { "correct": "مَـ", "options": ["مَـ", "ـمَـ", "ـمَ", "مَ"] },
                      { "correct": "ـكْـ", "options": ["كْـ", "ـكْـ", "ـكْ", "كْ"] },
                      { "correct": "ـتَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـبٌ", "options": ["بٌـ", "ـبٌـ", "ـبٌ", "بٌ"] }
                    ]
                  }
                ]
            },
            7: {
                timePerLetter: 3,
                words: [
                  {
                    "tr": "Konuşuyorlar",
                    "audioSrc": "l7v1.wav",
                    "fullWord": "يَتَحَدَّثُون",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـتَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـحَـ", "options": ["حَـ", "ـحَـ", "ـحَ", "حَ"] },
                      { "correct": "ـدَّ", "options": ["ـدَّ", "دَّ"] }, // Düzeltildi
                      { "correct": "ثُـ", "options": ["ثُـ", "ـثُـ", "ـثُ", "ثُ"] },
                      { "correct": "ـو", "options": ["ـو", "و"] }, // Düzeltildi
                      { "correct": "ن", "options": ["نـ", "ـنـ", "ـن", "ن"] }
                    ]
                  },
                  {
                    "tr": "Yardımlaşıyorlar",
                    "audioSrc": "l7v2.wav",
                    "fullWord": "يَتَعَاوَنُون",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـتَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـعَـ", "options": ["عَـ", "ـعَـ", "ـعَ", "عَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "وَ", "options": ["ـوَ", "وَ"] }, // Düzeltildi
                      { "correct": "نُـ", "options": ["نُـ", "ـنُـ", "ـنُ", "نُ"] },
                      { "correct": "ـو", "options": ["ـو", "و"] }, // Düzeltildi
                      { "correct": "ن", "options": ["نـ", "ـنـ", "ـن", "ن"] }
                    ]
                  },
                  {
                    "tr": "Dönüyorlar",
                    "audioSrc": "l7v3.wav",
                    "fullWord": "يَرْجِعُون",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـرْ", "options": ["ـرْ", "رْ"] }, // Düzeltildi
                      { "correct": "جِـ", "options": ["جِـ", "ـجِـ", "ـجِ", "جِ"] },
                      { "correct": "ـعُـ", "options": ["عُـ", "ـعُـ", "ـعُ", "عُ"] },
                      { "correct": "ـو", "options": ["ـو", "و"] }, // Düzeltildi
                      { "correct": "ن", "options": ["نـ", "ـنـ", "ـن", "ن"] }
                    ]
                  },
                  {
                    "tr": "İçecekler",
                    "audioSrc": "l7v4.wav",
                    "fullWord": "مَشْرُوبَات",
                    "steps": [
                      { "correct": "مَـ", "options": ["مَـ", "ـمَـ", "ـمَ", "مَ"] },
                      { "correct": "ـشْـ", "options": ["شْـ", "ـشْـ", "ـشْ", "شْ"] },
                      { "correct": "ـرُ", "options": ["ـرُ", "رُ"] }, // Düzeltildi
                      { "correct": "و", "options": ["ـو", "و"] }, // Düzeltildi
                      { "correct": "بَـ", "options": ["بَـ", "ـبَـ", "ـبَ", "بَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "ت", "options": ["تـ", "ـتـ", "ـت", "ت"] }
                    ]
                  },
                  {
                    "tr": "Konuştum",
                    "audioSrc": "l7v5.wav",
                    "fullWord": "تَكَلَّمْتُ",
                    "steps": [
                      { "correct": "تَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـكَـ", "options": ["كَـ", "ـكَـ", "ـكَ", "كَ"] },
                      { "correct": "ـلَّـ", "options": ["لَّـ", "ـلَّـ", "ـلَّ", "لَّ"] },
                      { "correct": "ـمْـ", "options": ["مْـ", "ـمْـ", "ـمْ", "مْ"] },
                      { "correct": "ـتُ", "options": ["تُـ", "ـتُـ", "ـتُ", "تُ"] }
                    ]
                  },
                  {
                    "tr": "Dinle",
                    "audioSrc": "l7v6.wav",
                    "fullWord": "اِسْتَمِعِي",
                    "steps": [
                      { "correct": "اِ", "options": ["ـاِ", "اِ"] }, // Düzeltildi
                      { "correct": "سْـ", "options": ["سْـ", "ـسْـ", "ـسْ", "سْ"] },
                      { "correct": "ـتَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـمِـ", "options": ["مِـ", "ـمِـ", "ـمِ", "مِ"] },
                      { "correct": "ـعِـ", "options": ["عِـ", "ـعِـ", "ـعِ", "عِ"] },
                      { "correct": "ـي", "options": ["يـ", "ـيـ", "ـي", "ي"] }
                    ]
                  },
                  {
                    "tr": "Gece",
                    "audioSrc": "l7v7.wav",
                    "fullWord": "لَيْلَة",
                    "steps": [
                      { "correct": "لَـ", "options": ["لَـ", "ـلَـ", "ـلَ", "لَ"] },
                      { "correct": "ـيْـ", "options": ["يْـ", "ـيْـ", "ـيْ", "يْ"] },
                      { "correct": "ـلَـ", "options": ["لَـ", "ـلَـ", "ـلَ", "لَ"] },
                      { "correct": "ـة", "options": ["ـة", "ة"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Öğle",
                    "audioSrc": "l7v8.wav",
                    "fullWord": "ظُهْرٌ",
                    "steps": [
                      { "correct": "ظُـ", "options": ["ظُـ", "ـظُـ", "ـظُ", "ظُ"] },
                      { "correct": "ـهْـ", "options": ["هْـ", "ـهْـ", "ـهْ", "هْ"] },
                      { "correct": "ـرٌ", "options": ["ـرٌ", "رٌ"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Yüz",
                    "audioSrc": "l7v9.wav",
                    "fullWord": "وَجْهٌ",
                    "steps": [
                      { "correct": "وَ", "options": ["ـوَ", "وَ"] }, // Düzeltildi
                      { "correct": "جْـ", "options": ["جْـ", "ـجْـ", "ـجْ", "جْ"] },
                      { "correct": "ـهٌ", "options": ["هٌـ", "ـهٌـ", "ـهٌ", "هٌ"] }
                    ]
                  },
                  {
                    "tr": "Temizliyorum",
                    "audioSrc": "l7v10.wav",
                    "fullWord": "أُنَظِّفُ",
                    "steps": [
                      { "correct": "أُ", "options": ["ـأُ", "أُ"] }, // Düzeltildi
                      { "correct": "نَـ", "options": ["نَـ", "ـنَـ", "ـنَ", "نَ"] },
                      { "correct": "ـظِّـ", "options": ["ظِّـ", "ـظِّـ", "ـظِّ", "ظِّ"] },
                      { "correct": "ـفُ", "options": ["فُـ", "ـفُـ", "ـفُ", "فُ"] }
                    ]
                  },
                  {
                    "tr": "Tekrar ediyorum",
                    "audioSrc": "l7v11.wav",
                    "fullWord": "أُرَاجِعُ",
                    "steps": [
                      { "correct": "أُ", "options": ["ـأُ", "أُ"] }, // Düzeltildi
                      { "correct": "رَ", "options": ["ـرَ", "رَ"] }, // Düzeltildi
                      { "correct": "ا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "جِـ", "options": ["جِـ", "ـجِـ", "ـجِ", "جِ"] },
                      { "correct": "ـعُ", "options": ["عُـ", "ـعُـ", "ـعُ", "عُ"] }
                    ]
                  },
                  {
                    "tr": "Vedalaşmak",
                    "audioSrc": "l7v12.wav",
                    "fullWord": "اَلْوَدَاع",
                    "steps": [
                      { "correct": "اَ", "options": ["ـاَ", "اَ"] }, // Düzeltildi
                      { "correct": "لْـ", "options": ["لْـ", "ـلْـ", "ـلْ", "لْ"] },
                      { "correct": "ـوَد", "options": ["ـوَد", "وَد"] }, // Düzeltildi
                      { "correct": "ا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "ع", "options": ["عـ", "ـعـ", "ـع", "ع"] }
                    ]
                  },
                  {
                    "tr": "Erkek öğrenci",
                    "audioSrc": "l7v13.wav",
                    "fullWord": "طَالِبٌ",
                    "steps": [
                      { "correct": "طَـ", "options": ["طَـ", "ـطَـ", "ـطَ", "طَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "لِـ", "options": ["لِـ", "ـلِـ", "ـلِ", "لِ"] },
                      { "correct": "ـبٌ", "options": ["بٌـ", "ـبٌـ", "ـبٌ", "بٌ"] }
                    ]
                  },
                  {
                    "tr": "Kitap",
                    "audioSrc": "l7v14.wav",
                    "fullWord": "كِتَابٌ",
                    "steps": [
                      { "correct": "كِـ", "options": ["كِـ", "ـكِـ", "ـكِ", "كِ"] },
                      { "correct": "ـتَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "بٌ", "options": ["بٌـ", "ـبٌـ", "ـبٌ", "بٌ"] }
                    ]
                  }
                ]
            },
            8: {
                timePerLetter: 3,
                words: [
                  {
                    "tr": "Öğretmenler",
                    "audioSrc": "l8v1.wav",
                    "fullWord": "مُعَلِّمَات",
                    "steps": [
                      { "correct": "مُـ", "options": ["مُـ", "ـمُـ", "ـمُ", "مُ"] },
                      { "correct": "ـعَـ", "options": ["عَـ", "ـعَـ", "ـعَ", "عَ"] },
                      { "correct": "ـلِّـ", "options": ["لِّـ", "ـلِّـ", "ـلِّ", "لِّ"] },
                      { "correct": "ـمَـ", "options": ["مَـ", "ـمَـ", "ـمَ", "مَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "ت", "options": ["تـ", "ـتـ", "ـت", "ت"] }
                    ]
                  },
                  {
                    "tr": "Yiyecekler",
                    "audioSrc": "l8v2.wav",
                    "fullWord": "مَأْكُولَات",
                    "steps": [
                      { "correct": "مَـ", "options": ["مَـ", "ـمَـ", "ـمَ", "مَ"] },
                      { "correct": "ـأْ", "options": ["ـأْ", "أْ"] }, // Düzeltildi
                      { "correct": "كُـ", "options": ["كُـ", "ـكُـ", "ـكُ", "كُ"] },
                      { "correct": "ـو", "options": ["ـو", "و"] }, // Düzeltildi
                      { "correct": "لَـ", "options": ["لَـ", "ـلَـ", "ـلَ", "لَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "ت", "options": ["تـ", "ـتـ", "ـت", "ت"] }
                    ]
                  },
                  {
                    "tr": "Oynuyorlar",
                    "audioSrc": "l8v3.wav",
                    "fullWord": "يَلْعَبُون",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـلْـ", "options": ["لْـ", "ـلْـ", "ـلْ", "لْ"] },
                      { "correct": "ـعَـ", "options": ["عَـ", "ـعَـ", "ـعَ", "عَ"] },
                      { "correct": "ـبُـ", "options": ["بُـ", "ـبُـ", "ـبُ", "بُ"] },
                      { "correct": "ـو", "options": ["ـو", "و"] }, // Düzeltildi
                      { "correct": "ن", "options": ["نـ", "ـنـ", "ـن", "ن"] }
                    ]
                  },
                  {
                    "tr": "Televizyon",
                    "audioSrc": "l8v4.wav",
                    "fullWord": "تِلْفَازٌ",
                    "steps": [
                      { "correct": "تِـ", "options": ["تِـ", "ـتِـ", "ـتِ", "تِ"] },
                      { "correct": "ـلْـ", "options": ["لْـ", "ـلْـ", "ـلْ", "لْ"] },
                      { "correct": "ـفَـ", "options": ["فَـ", "ـفَـ", "ـفَ", "فَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "زٌ", "options": ["ـزٌ", "زٌ"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Elbiseler",
                    "audioSrc": "l8v5.wav",
                    "fullWord": "مَلَابِسٍ",
                    "steps": [
                      { "correct": "مَـ", "options": ["مَـ", "ـمَـ", "ـمَ", "مَ"] },
                      { "correct": "ـلَـ", "options": ["لَـ", "ـلَـ", "ـلَ", "لَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "بِـ", "options": ["بِـ", "ـبِـ", "ـبِ", "بِ"] },
                      { "correct": "ـسٍ", "options": ["سٍـ", "ـسٍـ", "ـسٍ", "سٍ"] }
                    ]
                  },
                  {
                    "tr": "Düzen",
                    "audioSrc": "l8v6.wav",
                    "fullWord": "نِظَامٌ",
                    "steps": [
                      { "correct": "نِـ", "options": ["نِـ", "ـنِـ", "ـنِ", "نِ"] },
                      { "correct": "ـظَـ", "options": ["ظَـ", "ـظَـ", "ـظَ", "ظَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "مٌ", "options": ["مٌـ", "ـمٌـ", "ـمٌ", "مٌ"] }
                    ]
                  },
                  {
                    "tr": "Erken",
                    "audioSrc": "l8v7.wav",
                    "fullWord": "مُبَكِّرًا",
                    "steps": [
                      { "correct": "مُـ", "options": ["مُـ", "ـمُـ", "ـمُ", "مُ"] },
                      { "correct": "ـبَـ", "options": ["بَـ", "ـبَـ", "ـبَ", "بَ"] },
                      { "correct": "ـكِّـ", "options": ["كِّـ", "ـكِّـ", "ـكِّ", "كِّ"] },
                      { "correct": "ـرًا", "options": ["ـرًا", "رًا"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Dinlenmek",
                    "audioSrc": "l8v8.wav",
                    "fullWord": "اِسْتِرَاحَة",
                    "steps": [
                      { "correct": "اِ", "options": ["ـاِ", "اِ"] }, // Düzeltildi
                      { "correct": "سْـ", "options": ["سْـ", "ـسْـ", "ـسْ", "سْ"] },
                      { "correct": "ـتِـ", "options": ["تِـ", "ـتِـ", "ـتِ", "تِ"] },
                      { "correct": "ـرَ", "options": ["ـرَ", "رَ"] }, // Düzeltildi
                      { "correct": "ا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "حَـ", "options": ["حَـ", "ـحَـ", "ـحَ", "حَ"] },
                      { "correct": "ـة", "options": ["ـة", "ة"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Yiyorum",
                    "audioSrc": "l8v9.wav",
                    "fullWord": "أَتَنَاوَلُ",
                    "steps": [
                      { "correct": "أَ", "options": ["ـأَ", "أَ"] }, // Düzeltildi
                      { "correct": "تَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـنَـ", "options": ["نَـ", "ـنَـ", "ـنَ", "نَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "وَ", "options": ["ـوَ", "وَ"] }, // Düzeltildi
                      { "correct": "لُ", "options": ["لُـ", "ـلُـ", "ـلُ", "لُ"] }
                    ]
                  },
                  {
                    "tr": "Öğrendim",
                    "audioSrc": "l8v10.wav",
                    "fullWord": "تَعَلَّمْتُ",
                    "steps": [
                      { "correct": "تَـ", "options": ["تَـ", "ـتَـ", "ـتَ", "تَ"] },
                      { "correct": "ـعَـ", "options": ["عَـ", "ـعَـ", "ـعَ", "عَ"] },
                      { "correct": "ـلَّـ", "options": ["لَّـ", "ـلَّـ", "ـلَّ", "لَّ"] },
                      { "correct": "ـمْـ", "options": ["مْـ", "ـمْـ", "ـمْ", "مْ"] },
                      { "correct": "ـتُ", "options": ["تُـ", "ـتُـ", "ـتُ", "تُ"] }
                    ]
                  },
                  {
                    "tr": "Öğretmen",
                    "audioSrc": "l8v11.wav",
                    "fullWord": "مُدَرِّسَة",
                    "steps": [
                      { "correct": "مُـ", "options": ["مُـ", "ـمُـ", "ـمُ", "مُ"] },
                      { "correct": "ـدَ", "options": ["ـدَ", "دَ"] }, // Düzeltildi
                      { "correct": "رِّ", "options": ["ـرِّ", "رِّ"] }, // Düzeltildi
                      { "correct": "سَـ", "options": ["سَـ", "ـسَـ", "ـسَ", "سَ"] },
                      { "correct": "ـة", "options": ["ـة", "ة"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Namaz kılıyor",
                    "audioSrc": "l8v12.wav",
                    "fullWord": "يُصَلِّي",
                    "steps": [
                      { "correct": "يُـ", "options": ["يُـ", "ـيُـ", "ـيُ", "يُ"] },
                      { "correct": "ـصَـ", "options": ["صَـ", "ـصَـ", "ـصَ", "صَ"] },
                      { "correct": "ـلِّـ", "options": ["لِّـ", "ـلِّـ", "ـلِّ", "لِّ"] },
                      { "correct": "ـي", "options": ["يـ", "ـيـ", "ـي", "ي"] }
                    ]
                  },
                  {
                    "tr": "Temizliyor",
                    "audioSrc": "l8v13.wav",
                    "fullWord": "يُنَظِّفُ",
                    "steps": [
                      { "correct": "يُـ", "options": ["يُـ", "ـيُـ", "ـيُ", "يُ"] },
                      { "correct": "ـنَـ", "options": ["نَـ", "ـنَـ", "ـنَ", "نَ"] },
                      { "correct": "ـظِّـ", "options": ["ظِّـ", "ـظِّـ", "ـظِّ", "ظِّ"] },
                      { "correct": "ـفُ", "options": ["فُـ", "ـفُـ", "ـفُ", "فُ"] }
                    ]
                  },
                  {
                    "tr": "Güzel",
                    "audioSrc": "l8v14.wav",
                    "fullWord": "جَمِيلٌ",
                    "steps": [
                      { "correct": "جَـ", "options": ["جَـ", "ـجَـ", "ـجَ", "جَ"] },
                      { "correct": "ـمِـ", "options": ["مِـ", "ـمِـ", "ـمِ", "مِ"] },
                      { "correct": "ـيـ", "options": ["يـ", "ـيـ", "ـي", "ي"] },
                      { "correct": "ـلٌ", "options": ["لٌـ", "ـلٌـ", "ـلٌ", "لٌ"] }
                    ]
                  },
                  {
                    "tr": "Masa",
                    "audioSrc": "l8v15.wav",
                    "fullWord": "طَاوِلَة",
                    "steps": [
                      { "correct": "طَـ", "options": ["طَـ", "ـطَـ", "ـطَ", "طَ"] },
                      { "correct": "ـا", "options": ["ـا", "ا"] }, // Düzeltildi
                      { "correct": "وِ", "options": ["ـوِ", "وِ"] }, // Düzeltildi
                      { "correct": "لَـ", "options": ["لَـ", "ـلَـ", "ـلَ", "لَ"] },
                      { "correct": "ـة", "options": ["ـة", "ة"] } // Düzeltildi
                    ]
                  },
                  {
                    "tr": "Çıkıyor",
                    "audioSrc": "l8v16.wav",
                    "fullWord": "يَخْرُجُ",
                    "steps": [
                      { "correct": "يَـ", "options": ["يَـ", "ـيَـ", "ـيَ", "يَ"] },
                      { "correct": "ـخْـ", "options": ["خْـ", "ـخْـ", "ـخْ", "خْ"] },
                      { "correct": "ـرُ", "options": ["ـرُ", "رُ"] }, // Düzeltildi
                      { "correct": "جُ", "options": ["جُـ", "ـجُـ", "ـجُ", "جُ"] }
                    ]
                  }
                ]
            }
        };

        // --- DOM Elementleri ---
        const homeScreen = document.getElementById('homeScreen');
        const gameScreen = document.getElementById('gameScreen');
        const levelSelect = document.getElementById('levelSelect');
        const backToHomeButton = document.getElementById('backToHomeButton');
        
        const playAudioButton = document.getElementById('playAudioButton');
        const turkishWordEl = document.getElementById('turkishWord');
        const arabicOutputEl = document.getElementById('arabicOutputDisplay');
        const choiceBank = document.getElementById('choiceBank');
        
        // YENİ: Tam Ekran Butonları
        const fullscreenBtnHome = document.getElementById('fullscreen-btn-home');
        const fullscreenBtnGame = document.getElementById('fullscreen-btn-game');

        // --- Oyun Değişkenleri ---
        let selectedLevel = null;
        let selectedLevelBtn = null;
        let levelWords = [];
        let currentWord = {};
        let currentWordIndex = 0;
        let currentStepIndex = 0;
        let gameActive = false;
        let waitingForAudioClick = false;
        let audio = new Audio();
        

        // --- Ana Oyun Fonksiyonları ---

        levelSelect.addEventListener('click', (e) => {
            if (e.target.classList.contains('level-btn')) {
                initAudioContext();
                if (selectedLevelBtn) { selectedLevelBtn.classList.remove('selected'); }
                selectedLevel = e.target.dataset.level;
                selectedLevelBtn = e.target;
                selectedLevelBtn.classList.add('selected');
                startGame();
            }
        });

        function startGame() {
            if (!gameData[selectedLevel] || !gameData[selectedLevel].words || gameData[selectedLevel].words.length === 0) {
                console.error(`Oyun verisi bulunamadı! Seviye: ${selectedLevel}`);
                if (selectedLevelBtn) { selectedLevelBtn.classList.remove('selected'); }
                return;
            }
            
            levelWords = [...gameData[selectedLevel].words].sort(() => Math.random() - 0.5);
            currentWordIndex = 0;
            gameActive = true;
            
            homeScreen.classList.remove('active');
            gameScreen.classList.add('active');
            
            loadWord();
        }

        function loadWord() {
            if (currentWordIndex >= levelWords.length) {
                alert("Seviye Tamamlandı!");
                showHomeScreen();
                return;
            }

            currentWord = levelWords[currentWordIndex];
            currentStepIndex = 0; 

            arabicOutputEl.textContent = '';
            arabicOutputEl.classList.add('empty');
            turkishWordEl.textContent = currentWord.tr;
            choiceBank.innerHTML = '';

            playAudioButton.disabled = false;
            playAudioButton.classList.add('blinking-button');
            waitingForAudioClick = true;
            loadAllSteps();
        }

        function loadAllSteps() {
            // .forEach() döngüsü, adımların (satırların) her zaman
            // doğru sırada (0, 1, 2...) eklenmesini sağlar.
            currentWord.steps.forEach((stepData, index) => {
                const row = document.createElement('div');
                row.className = 'choice-row';
                row.dataset.stepIndex = index; 

                // İkili şıkları ortalamak için sınıfı ekle
                if (stepData.options.length < 4) {
                    row.classList.add('choice-row-centered-options');
                }

                // Sadece ilk satırı (index === 0) 'active-step' olarak işaretle
                if (index === 0) {
                    row.classList.add('active-step');
                }

                // Harf seçeneklerini (butonları) satır içinde karıştır
                const shuffledOptions = [...stepData.options].sort(() => Math.random() - 0.5);

                shuffledOptions.forEach(optionText => {
                    const btn = document.createElement('button');
                    btn.className = 'choice-btn';
                    btn.textContent = optionText;
                    btn.dataset.value = optionText;
                    btn.dataset.correct = stepData.correct;
                    btn.setAttribute('lang', 'ar');
                    row.appendChild(btn);
                });
                
                // Satırı doğrudan 'choiceBank'e ekle (karıştırma yok)
                choiceBank.appendChild(row);
            });
        }
        
        function disableAllChoiceBanks(disabled) {
             choiceBank.querySelectorAll('.choice-btn').forEach(btn => {
                btn.disabled = disabled;
            });
        }

        // --- Olay Dinleyicileri ---

        playAudioButton.addEventListener('click', () => {
            initAudioContext();
            if (!currentWord || !currentWord.audioSrc) return;
            
            if (waitingForAudioClick) {
                waitingForAudioClick = false;
                playAudioButton.classList.remove('blinking-button');
                playWordAudio();
            } else {
                playWordAudio();
            }
        });

        function playWordAudio() {
             if (!currentWord || !currentWord.audioSrc) return;
             if (!audio.paused) { audio.pause(); audio.currentTime = 0; }
             audio.src = currentWord.audioSrc;
             audio.play().catch(e => console.error("Kelime sesi çalınamadı:", e));
        }

        choiceBank.addEventListener('click', (e) => {
            if (!gameActive) return;
            
            const clickedButton = e.target.closest('.choice-btn:not(:disabled)');
            if (!clickedButton) return;
            
            const clickedRow = clickedButton.closest('.choice-row');
            if (!clickedRow) return;

            const clickedStepIndex = parseInt(clickedRow.dataset.stepIndex);
            const selectedValue = clickedButton.dataset.value;
            const correctValue = clickedButton.dataset.correct;

            initAudioContext();

            if (clickedStepIndex !== currentStepIndex) {
                playSound('incorrect');
                clickedButton.classList.add('error-form');
                setTimeout(() => clickedButton.classList.remove('error-form'), 300);
                
                const correctRow = choiceBank.querySelector(`.choice-row[data-step-index="${currentStepIndex}"]`);
                if (correctRow) {
                    correctRow.classList.add('error-form');
                    setTimeout(() => correctRow.classList.remove('error-form'), 300);
                }
                return;
            }

            if (selectedValue === correctValue) {
                playSound('correct');
                arabicOutputEl.classList.remove('empty');
                arabicOutputEl.textContent += selectedValue;
                
                clickedRow.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);
                clickedButton.classList.add('correct-form');
                clickedRow.classList.add('disabled');
                clickedRow.classList.remove('active-step');

                currentStepIndex++; 

                if (currentStepIndex >= currentWord.steps.length) {
                    gameActive = false;
                    setTimeout(() => {
                        currentWordIndex++;
                        gameActive = true;
                        loadWord();
                    }, 1500);
                } else {
                    const nextRow = choiceBank.querySelector(`.choice-row[data-step-index="${currentStepIndex}"]`);
                    if (nextRow) {
                        nextRow.classList.add('active-step');
                    }
                }

            } else {
                playSound('incorrect');
                clickedButton.classList.add('error-form');
                setTimeout(() => clickedButton.classList.remove('error-form'), 300);
            }
        });


        // GÜNCELLENDİ: Ana Menüye Dön (preventDefault eklendi)
        backToHomeButton.addEventListener('click', (e) => {
            e.preventDefault(); // Linkin varsayılan eylemini engelle
            showHomeScreen();
        });

        function showHomeScreen() {
            gameActive = false;
            waitingForAudioClick = false;
            gameScreen.classList.remove('active');
            homeScreen.classList.add('active');
            
            if (selectedLevelBtn) { 
                selectedLevelBtn.classList.remove('selected'); 
                selectedLevelBtn = null; 
            }
            selectedLevel = null;
        }

        // --- YENİ: Tam Ekran Fonksiyonları ---
        function toggleFullScreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Tam ekran modu etkinleştirilemedi: ${err.message} (${err.name})`);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        }

        function updateFullscreenState() {
            if (document.fullscreenElement) {
                document.body.classList.add('fullscreen');
            } else {
                document.body.classList.remove('fullscreen');
            }
        }

        document.addEventListener('fullscreenchange', updateFullscreenState);

        // Tam ekran butonlarına tıklama olayı
        if(fullscreenBtnHome) fullscreenBtnHome.addEventListener('click', toggleFullScreen);
        if(fullscreenBtnGame) fullscreenBtnGame.addEventListener('click', toggleFullScreen);
        // --- Bitiş: Tam Ekran Fonksiyonları ---