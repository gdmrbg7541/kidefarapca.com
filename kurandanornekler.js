const definitions = {
        "Salim": "İlletli veya şeddeli değil",
        "Mehmuz": "Asli harflerinde hemze var",
        "Mudaaf": "Aynı cinsten harf şeddeli",
        "Misal": "İlk harfi illetli",
        "Ecvef": "Ortadaki harfi illetli",
        "Nakıs": "Son harfi illetli",
        "Lefif": "İki harfi birden illetli"
    };

   const questions = [
        // --- FATİHA SURESİ ---
        {
            verse: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
            target: "نَعْبُدُ",
            tr_target: "kulluk ederiz",
            translation: "Yalnız sana kulluk ederiz.",
            correct: "Salim",
            conjugation: { mazi: "عَبَدَ", muzari: "يَعْبُدُ", emir: "اُعْبُدْ", mastar: "عِبَادَةً" }
        },
        {
            verse: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
            target: "اهْدِنَا",
            tr_target: "Bizi ilet",
            translation: "Bizi dosdoğru yola ilet.",
            correct: "Nakıs",
            conjugation: { mazi: "هَدَى", muzari: "يَهْدِي", emir: "اِهْدِ", mastar: "هِدَايَةً" }
        },
        
        {
            verse: "لَا تَأْخُذُهُ سِنَةٌ",
            target: "تَأْخُذُهُ",
            tr_target: "tutmaz",
            translation: "O'nu bir uyuklama tutmaz.",
            correct: "Mehmuz",
            conjugation: { mazi: "أَخَذَ", muzari: "يَأْخُذُ", emir: "خُذْ", mastar: "أَخْذًا" }
        },
        {
            verse: "مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ",
            target: "يَشْفَعُ",
            tr_target: "şefaat edebilir",
            translation: "O'nun katında kim şefaat edebilir?",
            correct: "Salim",
            conjugation: { mazi: "شَفَعَ", muzari: "يَشْفَعُ", emir: "اِشْفَعْ", mastar: "شَفَاعَةً" }
        },

        {
            verse: "أَلَمْ يَجْعَلْ كَيْدَهُمْ",
            target: "يَجْعَلْ",
            tr_target: "kılmadı mı",
            translation: "Onların tuzaklarını boşa çıkarmadı (kılmadı) mı?",
            correct: "Salim",
            conjugation: { mazi: "جَعَلَ", muzari: "يَجْعَلُ", emir: "اِجْعَلْ", mastar: "جَعْلًا" }
        },
        
        {
            verse: "تَرْمِيهِمْ بِحِجَارَةٍ",
            target: "تَرْمِيهِمْ",
            tr_target: "atıyorlardı",
            translation: "Onlara taşlar atıyorlardı.",
            correct: "Nakıs", 
            conjugation: { mazi: "رَمَى", muzari: "يَرْمِي", emir: "اِرْمِ", mastar: "رَمْيًا" }
        },

        // --- KUREYŞ SURESİ ---
        {
            verse: "فَلْيَعْبُدُوا رَبَّ هَذَا الْبَيْتِ",
            target: "فَلْيَعْبُدُوا",
            tr_target: "kulluk etsinler",
            translation: "Şu Ev'in (Kabe'nin) Rabbine kulluk etsinler.",
            correct: "Salim",
            conjugation: { mazi: "عَبَدَ", muzari: "يَعْبُدُ", emir: "اُعْبُدْ", mastar: "عِبَادَةً" }
        },
        
        {
            verse: "فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ",
            target: "يَدُعُّ",
            tr_target: "itip kakan",
            translation: "İşte o, yetimi itip kakan kimsedir.",
            correct: "Mudaaf",
            conjugation: { mazi: "دَعَّ", muzari: "يَدُعُّ", emir: "دُعَّ", mastar: "دَعًّا" }
        },

        {
            verse: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
            target: "فَصَلِّ",
            tr_target: "namaz kıl",
            translation: "O halde Rabbin için namaz kıl.",
            correct: "Nakıs", 
            conjugation: { mazi: "صَلَّى", muzari: "يُصَلِّي", emir: "صَلِّ", mastar: "صَلَاةً" }
        },

        // --- KAFİRUN SURESİ ---
        {
            verse: "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
            target: "قُلْ",
            tr_target: "De ki",
            translation: "De ki: Ey kafirler!",
            correct: "Ecvef",
            conjugation: { mazi: "قَالَ", muzari: "يَقُولُ", emir: "قُلْ", mastar: "قَوْلًا" }
        },
        {
            verse: "لَا أَعْبُدُ مَا تَعْبُدُونَ",
            target: "أَعْبُدُ",
            tr_target: "kulluk etmem",
            translation: "Ben sizin taptıklarınıza kulluk etmem.",
            correct: "Salim",
            conjugation: { mazi: "عَبَدَ", muzari: "يَعْبُدُ", emir: "اُعْبُدْ", mastar: "عِبَادَةً" }
        },

        {
            verse: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ",
            target: "يَدْخُلُونَ",
            tr_target: "girdiğini",
            translation: "İnsanların Allah'ın dinine girdiğini gördüğünde...",
            correct: "Salim",
            conjugation: { mazi: "دَخَلَ", muzari: "يَدْخُلُ", emir: "اُدْخُلْ", mastar: "دُخُولًا" }
        },
        
        {
            verse: "تَبَّتْ يَدَا أَبِي لَهَبٍ",
            target: "تَبَّتْ",
            tr_target: "kurusun",
            translation: "Ebu Leheb'in elleri kurusun!",
            correct: "Mudaaf",
            conjugation: { mazi: "تَبَّ", muzari: "يَتِبُّ", emir: "تِبَّ", mastar: "تَبًّا" }
        },
        
        {
            verse: "سَيَصْلَى نَارًا ذَاتَ لَهَبٍ",
            target: "سَيَصْلَى",
            tr_target: "girecektir",
            translation: "Alevli bir ateşe girecektir.",
            correct: "Nakıs", 
            conjugation: { mazi: "صَلِيَ", muzari: "يَصْلَى", emir: "اِصْلَ", mastar: "صَلْيًا" }
        },

        // --- İHLAS SURESİ ---
        {
            verse: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
            target: "يَلِدْ",
            tr_target: "doğurmamıştır",
            translation: "O doğurmamıştır.",
            correct: "Misal", 
            conjugation: { mazi: "وَلَدَ", muzari: "يَلِدُ", emir: "لِدْ", mastar: "وِلَادَةً" }
        },
        {
            verse: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
            target: "يَكُنْ",
            tr_target: "olmamıştır",
            translation: "O'nun hiçbir dengi olmamıştır.",
            correct: "Ecvef",
            conjugation: { mazi: "كَانَ", muzari: "يَكُونُ", emir: "كُنْ", mastar: "كَوْنًا" }
        },

        {
            verse: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
            target: "أَعُوذُ",
            tr_target: "sığınırım",
            translation: "De ki: Sabahın Rabbine sığınırım.",
            correct: "Ecvef", 
            conjugation: { mazi: "عَاذَ", muzari: "يَعُوذُ", emir: "عُذْ", mastar: "عِيَاذًا" }
        },
        {
            verse: "مِنْ شَرِّ مَا خَلَقَ",
            target: "خَلَقَ",
            tr_target: "yarattığı",
            translation: "Yarattığı şeylerin şerrinden...",
            correct: "Salim",
            conjugation: { mazi: "خَلَقَ", muzari: "يَخْلُقُ", emir: "اُخْلُقْ", mastar: "خَلْقًا" }
        },
        {
            verse: "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ",
            target: "وَقَبَ",
            tr_target: "çöktüğü",
            translation: "Karanlığı çöktüğü zaman gecenin şerrinden...",
            correct: "Misal",
            conjugation: { mazi: "وَقَبَ", muzari: "يَقِبُ", emir: "قِبْ", mastar: "وُقُوبًا" }
        },
        {
            verse: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
            target: "حَسَدَ",
            tr_target: "haset ettiği",
            translation: "Ve haset ettiği zaman hasetçinin şerrinden.",
            correct: "Salim",
            conjugation: { mazi: "حَسَدَ", muzari: "يَحْسِدُ", emir: "اِحْسِدْ", mastar: "حَسَدًا" }
        },

        {
            verse: "اقْرَأْ بِاسْمِ رَبِّكَ",
            target: "اقْرَأْ",
            tr_target: "Oku",
            translation: "Yaratan Rabbinin adıyla oku!",
            correct: "Mehmuz",
            conjugation: { mazi: "قَرَأَ", muzari: "يَقْرَأُ", emir: "اقْرَأْ", mastar: "قِرَاءَةً" }
        },
       
        {
            verse: "وَقِهِ السَّيِّئَاتِ",
            target: "وَقِهِ",
            tr_target: "koru",
            translation: "Ve onu kötülüklerden koru.",
            correct: "Lefif", 
            conjugation: { mazi: "وَقَى", muzari: "يَقِي", emir: "قِ", mastar: "وِقَايَةً" }
        },
        
        {
            verse: "وَاللَّهُ يَقْبِضُ وَيَبْسُطُ",
            target: "يَبْسُطُ",
            tr_target: "açar",
            translation: "Allah (rızkı) daraltır ve açar.",
            correct: "Salim",
            conjugation: { mazi: "بَسَطَ", muzari: "يَبْسُطُ", emir: "اُبْسُطْ", mastar: "بَسْطًا" }
        },
        {
            verse: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
            target: "ذَائِقَةُ", 
            tr_target: "tadacaktır",
            translation: "Her nefis ölümü tadacaktır.",
            correct: "Ecvef", 
            conjugation: { mazi: "ذَاقَ", muzari: "يَذُوقُ", emir: "ذُقْ", mastar: "ذَوْقًا" }
        },
        {
            verse: "وَوَهَبْنَا لَهُ إِسْحَاقَ",
            target: "وَوَهَبْنَا",
            tr_target: "bağışladık",
            translation: "Ve ona İshak'ı bağışladık.",
            correct: "Misal",
            conjugation: { mazi: "وَهَبَ", muzari: "يَهَبُ", emir: "هَبْ", mastar: "وَهْبًا" }
        },
        {
            verse: "وَيَمُدُّهُمْ فِي طُغْيَانِهِمْ",
            target: "وَيَمُدُّهُمْ",
            tr_target: "süre verir",
            translation: "Azgınlıkları içinde onlara süre verir.",
            correct: "Mudaaf",
            conjugation: { mazi: "مَدَّ", muzari: "يَمُدُّ", emir: "مُدَّ", mastar: "مَدًّا" }
        }
    ];
    let currentIdx = 0;

    function loadQuestion() {
        const data = questions[currentIdx];
        const nextBtn = document.getElementById('next-btn');
        
        // --- İkonları ve Arayüzü Sıfırla ---
        document.getElementById('feedback-left').className = 'feedback-icon icon-left';
        document.getElementById('feedback-right').className = 'feedback-icon icon-right';
        document.getElementById('feedback-left').innerHTML = '';
        document.getElementById('feedback-right').innerHTML = '';

        document.getElementById('progress-bar').style.width = ((currentIdx) / questions.length * 100) + "%";
        document.getElementById('options-container').style.display = 'flex'; // Flex ile göster
        document.getElementById('result-container').style.display = 'none';
        
        nextBtn.disabled = true;
        nextBtn.classList.remove('pulse-active');

        // --- ARAPÇA METİN (Renklendirme) ---
        document.getElementById('verse-text').innerHTML = data.verse.replace(
            data.target, 
            `<span class="highlight-word">${data.target}</span>`
        );

        // --- TÜRKÇE MEAL ---
        let trHtml = data.translation;
        if (data.tr_target) {
            trHtml = trHtml.replace(
                data.tr_target, 
                `<span class="highlight-word">${data.tr_target}</span>`
            );
        }
        document.getElementById('verse-translation').innerHTML = trHtml;

        // --- Şıkları Hazırla ---
        const container = document.getElementById('options-container');
        container.innerHTML = '';

        let opts = [data.correct];
        const allTypes = Object.keys(definitions);
        const distractors = allTypes.filter(t => t !== data.correct).sort(() => 0.5 - Math.random()).slice(0, 4); 
        opts = opts.concat(distractors).sort(() => 0.5 - Math.random());

        opts.forEach(type => {
            const btn = document.createElement('div');
            btn.className = 'option-card';
            btn.innerHTML = `
                <div class="opt-title">${type}</div>
                <div class="opt-desc">${definitions[type]}</div>
            `;
            btn.onclick = () => handleAnswer(type);
            container.appendChild(btn);
        });
    }

    function handleAnswer(selected) {
        const data = questions[currentIdx];
        const isCorrect = selected === data.correct;
        
        // Şıkları Gizle
        document.getElementById('options-container').style.display = 'none';

        // İkonlar
        const leftIcon = document.getElementById('feedback-left');
        const rightIcon = document.getElementById('feedback-right');
        
        if (isCorrect) {
            const content = '✓';
            leftIcon.innerHTML = content;
            rightIcon.innerHTML = content;
            leftIcon.classList.add('show', 'icon-success');
            rightIcon.classList.add('show', 'icon-success');
        } else {
            const content = '✗';
            leftIcon.innerHTML = content;
            rightIcon.innerHTML = content;
            leftIcon.classList.add('show', 'icon-error');
            rightIcon.classList.add('show', 'icon-error');
        }

        // Sonuç Ekranı
        document.getElementById('correct-answer-title').innerText = data.correct;
        document.getElementById('correct-answer-desc').innerText = definitions[data.correct];
        
        document.getElementById('res-mazi').innerText = data.conjugation.mazi;
        document.getElementById('res-muzari').innerText = data.conjugation.muzari;
        document.getElementById('res-emir').innerText = data.conjugation.emir;
        document.getElementById('res-mastar').innerText = data.conjugation.mastar;

        document.getElementById('result-container').style.display = 'flex';
        const nextBtn = document.getElementById('next-btn');
        nextBtn.disabled = false;
        nextBtn.classList.add('pulse-active');
    }

    function nextQuestion() {
        currentIdx++;
        if (currentIdx < questions.length) {
            loadQuestion();
        } else {
            document.querySelector('.content-scroll-area').innerHTML = `
                <div style="text-align:center; padding:50px;">
                    <h1 style="color:var(--success)">Tebrikler!</h1>
                    <p style="font-size:1.5rem;">Çalışma tamamlandı.</p>
                    <button class="nav-btn" onclick="location.reload()" style="margin:20px auto;">Başa Dön</button>
                </div>
            `;
        }
    }

    function prevQuestion() {
        if (currentIdx > 0) {
            currentIdx--;
            loadQuestion();
        }
    }

    function toggleFullScreen() {
        var container = document.getElementById("main-container");
        if (!document.fullscreenElement) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    window.onload = loadQuestion;