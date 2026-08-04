function showTab(tabId) {
        document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        event.currentTarget.classList.add('active');
        if(tabId === 'planner') initGrid();
    }

    const storySlides = [
    // Giriş: 24 Altın Hikayesi
    "👋 Merhaba küçük dostum! Hayal et ki cebinde harcaman için sana verilmiş tam <span class='highlight'>24 altın</span> var. 💰✨",
    "Bir bakkal amca çıkıyor ve diyor ki: 🏪 'Bana bu altınlardan <span class='highlight'>sadece 1 tanesini</span> ver, sana sarayın kapısını açacak <span class='highlight'>sihirli bir bilet</span> vereyim.' 🎫🗝️",
    "Geriye kalan 23 altını dondurmaya 🍦 veya oyunlara 🎮 harcayabilirsin. Ama o 1 saati namaza ayırmak, işte o <span class='highlight'>sihirli bileti</span> almak gibidir. 🕌",
    
    // Neden 5 Vakit? (Günün Renkleri)
    "🌅 <strong>Sabah Namazı:</strong> Güneş doğarken her şey uyanır. <br>Bu, Rabbimize <span class='highlight'>'Yeni gün için teşekkür ederim'</span> demektir. 🐦",
    "☀️ <strong>Öğle Namazı:</strong> Güneş en tepede, işler yoğun. <br>'Dünya işlerinden yoruldum, <span class='highlight'>Senin huzurunda dinlenmeye geldim</span>' molasıdır. 💆‍♂️",
    "🌇 <strong>İkindi Namazı:</strong> Güneş yavaşça batar. <br>Giden güne veda ederken, sonsuz olan <span class='highlight'>Allah'a sığınmaktır.</span> 🤲",
    "🌆 <strong>Akşam Namazı:</strong> Her yer kararır, gün biter. <br>Biz korkmayız, çünkü <span class='highlight'>'Sen varsın, Sen bakisin'</span> deriz. 🕯️",
    "🌌 <strong>Yatsı Namazı:</strong> Herkes uyur, dünya sessizleşir. <br>'Bugünü bitirdim, <span class='highlight'>huzurla uyumaya hazırım</span>' demektir. 😴💤",

 "Karnın zil çalınca 'Of, yine mi yemek yiyeceğim!' der misin? 😋 Asla! En sevdiğin yemeği görünce gözlerin parlar, lezzet alırsın. 🍔🍕",
    "İşte namaz da <span class='highlight'>kalbimizin ve ruhumuzun yemeğidir.</span> 🍯 Bedenin yemekle lezzet alır, ruhun da namazla doyar ve tatlanır! 🍬✨",

    // Nefise İkazlar
    "Bazen canın istemezse şunu hatırla: 🧸 Namaz yük değil, <span class='highlight'>büyük bir rahatlıktır.</span>",
    "Kocaman bir çantayı tek başına taşımak mı 🎒, yoksa onu çok güçlü bir babaya vermek mi? 💪 <br>Namaz, dertleri Allah’a emanet edip <span class='highlight'>hafiflemektir.</span> 🪶",
    "Oyun saatleri uçup gider ⏳ ama namazda geçirdiğin o kısacık zaman, senin için <span class='highlight'>sonsuz bir hazineye</span> dönüşür. 💎✨",

    // Namazın Anlamı ve Kapanış
    "Hareketlerin sırrı: <br>El bağlamak 🧍 <strong>'Huzurundayım'</strong>, Eğilmek 🙇 <strong>'Sen büyüksün'</strong>, Secde ise <strong>'Sana en yakın benim'</strong> demektir. ❤️",
    "Tıpkı bir çiçeğin güneşe dönmesi gibi 🌻, namazla kalbimizi Allah'a açarız. <br>İşte o zaman <span class='highlight'>dünyanın en mutlu çocuğu</span> oluruz. 🥰🎈"
];
    let currentSlide = 0;

    function updateSlide() {
        const slideBox = document.getElementById('slide-box');
        slideBox.classList.remove('fade-in');
        void slideBox.offsetWidth;
        slideBox.classList.add('fade-in');
        slideBox.innerHTML = storySlides[currentSlide];
    }

    function changeSlide(n) {
        let next = currentSlide + n;
        if (next >= 0 && next < storySlides.length) {
            currentSlide = next;
            updateSlide();
        }
    }
    updateSlide();

    let filled = 0;
    function initGrid() {
        const grid = document.getElementById('jetonGrid');
        if(grid.children.length > 0) return;
        for(let i=1; i<=24; i++) {
            let div = document.createElement('div');
            div.className = 'hour-jeton';
            div.innerText = i;
            grid.appendChild(div);
        }
    }

    function fillTime(num, color, label, btnId) {
        const boxes = document.querySelectorAll('.hour-jeton');
        let count = 0;
        for (let box of boxes) {
            if (count < num && !box.classList.contains('filled')) {
                box.classList.add('filled');
                box.style.background = color;
                box.innerText = label;
                box.style.fontSize = "0.8rem";
                count++;
                filled++;
            }
        }
        document.getElementById(btnId).classList.add('disabled');
        updateDisplay();
    }

    function updateDisplay() {
        const rem = 24 - filled;
        document.getElementById('remainder').innerText = rem + " Jeton Boşta";
        const status = document.getElementById('footer-status');
        if(filled >= 24) status.innerHTML = "<span style='color:var(--danger)'>GÜN BİTTİ! Zırhını alabildin mi?</span>";
    }

    function resetPlanner() {
        filled = 0;
        document.getElementById('jetonGrid').innerHTML = '';
        document.querySelectorAll('.act-card').forEach(c => c.classList.remove('disabled'));
        initGrid();
        updateDisplay();
    }

const questions = [
        ["Cebimizdeki 24 altın aslında nedir?", "Bize her gün hediye edilen 24 saattir."],
        ["1 altın karşılığında bakkal amcadan ne alırız?", "Cennet sarayını açan sihirli bir bilet (Namaz)."],
        ["Karnımız yemekle doyar, peki ruhumuz ne ile doyar?", "Ruhumuzun en lezzetli gıdası namazdır."],
        ["Namaz kılmak ağır bir yük müdür?", "Hayır, sırtımızdaki dert çantasını Allah'a verip hafiflemektir."],
        ["Sabah namazı ne anlama gelir?", "Yeni başlayan gün için Allah'a teşekkür etmektir."],
        ["Secdeye kapandığımızda ne söylemiş oluruz?", "'Allah'ım sana en yakın benim' demiş oluruz."],
        ["Yatsı namazı neyin habercisidir?", "Günü huzurla bitirip uykuya hazır olduğumuzun."],
        ["Akşam güneş batarken neden korkmayız?", "Çünkü 'Allah var, O sonsuzdur' deriz."],
        ["Geriye kalan 23 altını neye harcarız?", "Uykuya, oyuna, okula ve yemeğe."],
        ["Güneş'e dönen çiçek gibi biz kime döneriz?", "Namazda kalbimizle Allah'a döneriz."]
    ];

    const wisdoms = [
        ["Bakara Suresi, 45. Ayet", "Sabır ve namazla Allah'tan yardım isteyin."],
        ["Hadis-i Şerif", "Namaz dinin direğidir."],
        ["Hadis-i Şerif", "Kulun Rabbine en yakın olduğu an secde anıdır."],
        ["Hadis-i Şerif", "Namaz gözümün nurudur."],
        ["Ankebut Suresi, 45. Ayet", "Muhakkak ki namaz, hayasızlıktan ve kötülükten alıkoyar."],
        ["Hadis-i Şerif", "Cennetin anahtarı namazdır."]
    ];

    function loadData() {
        const qList = document.getElementById('quiz-list');
        questions.forEach(q => {
            qList.innerHTML += `<div class="info-card" onclick="toggleInfo(this)">
                <b>${q[0]}</b><div class="answer">${q[1]}</div></div>`;
        });
        const wList = document.getElementById('wisdom-list');
        wisdoms.forEach(w => {
            wList.innerHTML += `<div class="info-card" onclick="toggleInfo(this)">
                <b>${w[0]}</b><div class="meal">${w[1]}</div></div>`;
        });
    }

    function toggleInfo(el) {
        const content = el.querySelector('.answer') || el.querySelector('.meal');
        content.style.maxHeight = content.style.maxHeight === '100px' ? '0' : '100px';
    }

    loadData();