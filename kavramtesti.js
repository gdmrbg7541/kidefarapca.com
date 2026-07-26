function switchTab(tabName) {
        // 1. Tüm sekmeleri gizle, isteneni aç
        document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById('tab-' + tabName).classList.add('active');

        // 2. Tüm butonların aktifliğini kaldır
        const buttons = document.querySelectorAll('.menu-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        // 3. Doğru butona aktiflik ver (İndeksleri düzelttik)
        // buttons[0] -> Ev butonu olduğu için 1 ve 2'yi kullanıyoruz.
        
        if(tabName === 'schema') {
            buttons[1].classList.add('active'); // Fiil Şeması
        }
        
        if(tabName === 'hunter') {
            buttons[2].classList.add('active'); // Kavram Avcısı
            loadHunterLevel(); 
        }
    }

    function toggleElement(el) {
        if (el.classList.contains('hidden-content')) {
            el.classList.remove('hidden-content');
        }
    }

    function askSchemaQuestion() {
        document.querySelectorAll('.hidden-content').forEach(el => {
            el.classList.remove('hidden-content');
        });

        const candidates = document.querySelectorAll('.hideable');
        const randomIndex = Math.floor(Math.random() * candidates.length);
        const selectedElement = candidates[randomIndex];
        
        let questionText = "?";
        const type = selectedElement.getAttribute('data-type');

        switch(type) {
            case 'root': questionText = "Konu?"; break;
            case 'group': questionText = "Grup?"; break;
            case 'title': questionText = "Fiil?"; break;
            case 'desc': questionText = "Tanım?"; break;
            case 'example': questionText = "Örnek?"; break;
        }

        selectedElement.setAttribute('data-text', questionText);
        selectedElement.classList.add('hidden-content');
    }

    // --- 20 SORULUK GENİŞ HAVUZ ---
    const hunterLevels = [
        {
            words: [{ t: "كَتَبَ", y: "c" }, { t: "جَلَسَ", y: "c" }, { t: "خَرَجَ", y: "c" }, { t: "ذَهَبَ", y: "c" }, { t: "وَعَدَ", y: "t" }],
            reason: "Diğerleri <b>Salim</b> iken, 'Veade' <b>Misal</b> fiildir."
        },
        {
            words: [{ t: "قَالَ", y: "c" }, { t: "بَاعَ", y: "c" }, { t: "نَامَ", y: "c" }, { t: "صَامَ", y: "c" }, { t: "أَكَلَ", y: "t" }],
            reason: "Diğerleri <b>Ecvef</b> iken, 'Ekele' <b>Mehmuz</b> fiildir."
        },
        {
            words: [{ t: "مَدَّ", y: "c" }, { t: "فَرَّ", y: "c" }, { t: "ظَنَّ", y: "c" }, { t: "مَرَّ", y: "c" }, { t: "سَأَلَ", y: "t" }],
            reason: "Diğerleri <b>Mudaaf</b> iken, 'Seele' <b>Mehmuz</b> fiildir."
        },
        {
            words: [{ t: "رَمَى", y: "c" }, { t: "دَعَا", y: "c" }, { t: "مَشَى", y: "c" }, { t: "جَرَى", y: "c" }, { t: "وَجَدَ", y: "t" }],
            reason: "Diğerleri <b>Nakıs</b> iken, 'Vecede' <b>Misal</b> fiildir."
        },
        {
            words: [{ t: "وَقَفَ", y: "c" }, { t: "وَصَلَ", y: "c" }, { t: "وَضَعَ", y: "c" }, { t: "وَهَبَ", y: "c" }, { t: "قَرَأَ", y: "t" }],
            reason: "Diğerleri <b>Misal</b> iken, 'Karae' <b>Mehmuz</b> fiildir."
        },
        {
            words: [{ t: "وَعَدَ", y: "c" }, { t: "وَجَدَ", y: "c" }, { t: "وَقَفَ", y: "c" }, { t: "وَرِثَ", y: "c" }, { t: "قَالَ", y: "t" }],
            reason: "Diğerleri <b>Misal</b> iken, 'Kale' <b>Ecvef</b> fiildir."
        },
        {
            words: [{ t: "طَوَى", y: "c" }, { t: "شَوَى", y: "c" }, { t: "نَوَى", y: "c" }, { t: "هَوَى", y: "c" }, { t: "كَتَبَ", y: "t" }],
            reason: "Diğerleri <b>Lefif</b> iken, 'Ketebe' <b>Salim</b> fiildir."
        },
        {
            words: [{ t: "أَخَذَ", y: "c" }, { t: "أَكَلَ", y: "c" }, { t: "أَمَرَ", y: "c" }, { t: "سَأَلَ", y: "c" }, { t: "مَدَّ", y: "t" }],
            reason: "Diğerleri <b>Mehmuz</b> iken, 'Medde' <b>Mudaaf</b> fiildir."
        },
        {
            words: [{ t: "عَلِمَ", y: "c" }, { t: "شَرِبَ", y: "c" }, { t: "فَهِمَ", y: "c" }, { t: "سَمِعَ", y: "c" }, { t: "قَالَ", y: "t" }],
            reason: "Diğerleri <b>Salim</b> iken, 'Kale' <b>Ecvef</b> fiildir."
        },
        {
            words: [{ t: "صَامَ", y: "c" }, { t: "عَاشَ", y: "c" }, { t: "كَانَ", y: "c" }, { t: "مَاتَ", y: "c" }, { t: "رَمَى", y: "t" }],
            reason: "Diğerleri <b>Ecvef</b> iken, 'Rema' <b>Nakıs</b> fiildir."
        },
        {
            words: [{ t: "رَجَا", y: "c" }, { t: "بَكَى", y: "c" }, { t: "شَكَا", y: "c" }, { t: "نَسِيَ", y: "c" }, { t: "وَصَلَ", y: "t" }],
            reason: "Diğerleri <b>Nakıs</b> iken, 'Vasale' <b>Misal</b> fiildir."
        },
        {
            words: [{ t: "شَدَّ", y: "c" }, { t: "عَدَّ", y: "c" }, { t: "رَدَّ", y: "c" }, { t: "سَدَّ", y: "c" }, { t: "خَرَجَ", y: "t" }],
            reason: "Diğerleri <b>Mudaaf</b> iken, 'Harace' <b>Salim</b> fiildir."
        },
        {
            words: [{ t: "وَقَعَ", y: "c" }, { t: "وَلَدَ", y: "c" }, { t: "وَعَظَ", y: "c" }, { t: "وَثِقَ", y: "c" }, { t: "طَوَى", y: "t" }],
            reason: "Diğerleri <b>Misal</b> iken, 'Tava' <b>Lefif</b> fiildir."
        },
        {
            words: [{ t: "قَرَأَ", y: "c" }, { t: "بَدَأَ", y: "c" }, { t: "نَشَأَ", y: "c" }, { t: "لَجَأَ", y: "c" }, { t: "صَامَ", y: "t" }],
            reason: "Diğerleri <b>Mehmuz</b> iken, 'Same' <b>Ecvef</b> fiildir."
        },
        {
            words: [{ t: "رَكِبَ", y: "c" }, { t: "لَعِبَ", y: "c" }, { t: "ضَحِكَ", y: "c" }, { t: "طَبَخَ", y: "c" }, { t: "مَدَّ", y: "t" }],
            reason: "Diğerleri <b>Salim</b> iken, 'Medde' <b>Mudaaf</b> fiildir."
        },
        {
            words: [{ t: "زَارَ", y: "c" }, { t: "سَارَ", y: "c" }, { t: "تَابَ", y: "c" }, { t: "فَازَ", y: "c" }, { t: "دَعَا", y: "t" }],
            reason: "Diğerleri <b>Ecvef</b> iken, 'Dea' <b>Nakıs</b> fiildir."
        },
        {
            words: [{ t: "عَفَا", y: "c" }, { t: "غَزَا", y: "c" }, { t: "هَدَى", y: "c" }, { t: "تَلَا", y: "c" }, { t: "أَكَلَ", y: "t" }],
            reason: "Diğerleri <b>Nakıs</b> iken, 'Ekele' <b>Mehmuz</b> fiildir."
        },
        {
            words: [{ t: "حَلَّ", y: "c" }, { t: "دَقَّ", y: "c" }, { t: "شَقَّ", y: "c" }, { t: "مَسَّ", y: "c" }, { t: "بَاعَ", y: "t" }],
            reason: "Diğerleri <b>Mudaaf</b> iken, 'Baa' <b>Ecvef</b> fiildir."
        },
        {
            words: [{ t: "رَوَى", y: "c" }, { t: "لَوَى", y: "c" }, { t: "كَوَى", y: "c" }, { t: "عَوَى", y: "c" }, { t: "وَقَفَ", y: "t" }],
            reason: "Diğerleri <b>Lefif</b> iken, 'Vekafe' <b>Misal</b> fiildir."
        },
        {
            words: [{ t: "دَرَسَ", y: "c" }, { t: "حَمَلَ", y: "c" }, { t: "رَسَمَ", y: "c" }, { t: "قَطَعَ", y: "c" }, { t: "شَكَا", y: "t" }],
            reason: "Diğerleri <b>Salim</b> iken, 'Şeka' <b>Nakıs</b> fiildir."
        }
    ];

    let hunterIdx = 0;
    let hunterScore = 0;

    function loadHunterLevel() {
        if (hunterIdx >= hunterLevels.length) {
            document.getElementById('hunter-area').innerHTML = `
                <div style="width:100%; text-align:center;">
                    <h2 style="font-size:2rem; margin:0;">🏆</h2>
                    <h3>Bitti!</h3>
                    <p>Puan: <span style="color:#27ae60">${hunterScore}</span></p>
                    <button class="next-btn" onclick="location.reload()">Tekrar</button>
                </div>
            `;
            document.getElementById('hunter-feedback').innerText = "";
            document.getElementById('next-level-btn').style.display = "none";
            return;
        }

        const data = hunterLevels[hunterIdx];
        
        document.getElementById('level-indicator').innerText = (hunterIdx + 1) + " / " + hunterLevels.length;
        document.getElementById('score-board').innerText = hunterScore;
        document.getElementById('hunter-feedback').innerHTML = "";
        document.getElementById('next-level-btn').style.display = "none";

        const grid = document.getElementById('hunter-area');
        grid.innerHTML = "";

        const shuffledWords = [...data.words].sort(() => Math.random() - 0.5);
        const options = ["A", "B", "C", "D", "E"]; // Şık Etiketleri

        shuffledWords.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'hunter-card';
            // İKİ SATIRLI YAPI: Üstte Harf, Altta Fiil
            card.innerHTML = `
                <div class="hunter-label">${options[index]}</div>
                <div class="hunter-word">${item.t}</div>
            `;
            
            card.onclick = function() {
                if (document.getElementById('next-level-btn').style.display !== 'none') return;
                const allCards = document.querySelectorAll('.hunter-card');
                const feedback = document.getElementById('hunter-feedback');
                
                if (item.y === 't') {
                    card.classList.add('correct');
                    hunterScore += 5;
                    document.getElementById('score-board').innerText = hunterScore;
                    feedback.innerHTML = `<span style="color:green; font-size:0.9rem;">✅ ${data.reason}</span>`;
                } else {
                    card.classList.add('wrong');
                    allCards.forEach(c => {
                        const targetWord = data.words.find(w => w.y === 't').t;
                        if(c.innerHTML.includes(targetWord)) c.classList.add('correct');
                    });
                    feedback.innerHTML = `<span style="color:#c0392b; font-size:0.9rem;">⚠️ ${data.reason}</span>`;
                }
                document.getElementById('next-level-btn').style.display = 'inline-block';
            };
            grid.appendChild(card);
        });
    }

    function nextHunterLevel() {
        hunterIdx++;
        loadHunterLevel();
    }