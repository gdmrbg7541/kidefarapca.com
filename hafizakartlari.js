// Konu bazlı veri yapısı (Buraya sürekli yeni veri ekleyebilirsiniz)
const topics = {
    // --- 9. SINIF KONULARI ---
    selamlasma: {
        title: "Selamlaşma",
        icon: "👋",
        words: [
            { tr: "Selam üzerinize olsun!", ar: "السَّلام عَلَيْكُمْ" },
            { tr: "Selam sizin de üzerinize olsun!", ar: "وَعَلَيْكُم السَّلام" },
            { tr: "Hayırlı Sabahlar", ar: "صَباح الخَيْر" },
            { tr: "Günaydın", ar: "صَباح النّور" },
            { tr: "Hayırlı akşamlar", ar: "مَساء الخَيْر" },
            { tr: "Nurlu akşamlar", ar: "مَساء النّور" },
            { tr: "Merhaba!", ar: "مَرْحَبًا" },
            { tr: "Hoş geldiniz!", ar: "أَهْلًا وَسَهْلًا" },
            { tr: "Hoş bulduk!", ar: "أَهْلًا بِك" },
            { tr: "Nasılsın?", ar: "كَيْفَ حالُك؟" },
            { tr: "İyiyim!", ar: "أَنا بِخَيْر" },
            { tr: "Görüşmek üzere!", ar: "إِلى اللِّقاء" },
            { tr: "Hoşça kal", ar: "مَع السَّلامَة" },
            { tr: "Allah’a emanet ol", ar: "في أَمان الّٰلهِ" },
            { tr: "Oku!", ar: "اِقْرَأْ" },
            { tr: "Yaz!", ar: "اُكْتُبْ" },
            { tr: "Tekrar et!", ar: "أَعِدْ" },
            { tr: "Dinle!", ar: "اِسْتَمِعْ" }
        ]
    },
    tanisma: {
        title: "Tanışma",
        icon: "🤝",
        words: [
            { tr: "Erkek öğrenci", ar: "طالِب" },
            { tr: "Erkek öğretmen", ar: "مُدَرِّس" },
            { tr: "Erkek arkadaş", ar: "صَديق" },
            { tr: "O (erkek)", ar: "هُوَ" },
            { tr: "O (kadın)", ar: "هِيَ" },
            { tr: "Sen (erkek)", ar: "أَنْتَ" },
            { tr: "Ben", ar: "أَنا" },
            { tr: "Adın ne?", ar: "ما اسْمُك؟" },
            { tr: "Benim adım", ar: "اِسْمي" },
            { tr: "Nereli?", ar: "مِن أَيْن؟" },
            { tr: "Evet", ar: "نَعَم" },
            { tr: "Hayır", ar: "لا" },
            { tr: "Konuş", ar: "تَكَلَّمْ" },
            { tr: "Sus", ar: "اُسْكُتْ" },
            { tr: "Gel", ar: "تَعالَ" },
            { tr: "Git", ar: "اِذْهَبْ" },
            { tr: "Tanıştığıma memnun oldum", ar: "تَشَرَّفْتُ" },
            { tr: "Memnun oldum", ar: "فُرْصَة سَعيدَة" },
            { tr: "Teşekkür ederim", ar: "شُكْرًا" },
            { tr: "Rica ederim", ar: "عَفْوًا" }
        ]
    },
    sinif_esyaları: {
        title: "Sınıf Eşyaları",
        icon: "🎒",
        words: [
            { tr: "Okul", ar: "مَدْرَسَة" },
            { tr: "Sınıf", ar: "صَفّ" },
            { tr: "Kitap", ar: "كِتاب" },
            { tr: "Defter", ar: "دَفْتَر" },
            { tr: "Kalem", ar: "قَلَم" },
            { tr: "Tahta", ar: "سَبّورة" },
            { tr: "Sandalye", ar: "كُرْسِيّ" },
            { tr: "Masa", ar: "مَكْتَب" },
            { tr: "Silgi", ar: "مِمْحاة" },
            { tr: "Cetvel", ar: "مِسْطَرَة" },
            { tr: "Çanta", ar: "حَقيبَة" },
            { tr: "Kapı", ar: "باب" },
            { tr: "Pencere", ar: "نافِذَة" }
        ]
    },
    yonler_eylemler: {
        title: "Yönler ve Eylemler",
        icon: "📍",
        words: [
            { tr: "Nerede?", ar: "أَيْن؟" },
            { tr: "Burada", ar: "هُنا" },
            { tr: "Orada", ar: "هُناك" },
            { tr: "Üstünde", ar: "عَلى" },
            { tr: "Altında", ar: "تَحْت" },
            { tr: "Önünde", ar: "أَمام" },
            { tr: "Arkasında", ar: "خَلْفَ" },
            { tr: "Üzerinde", ar: "فَوْقَ" },
            { tr: "Yanında", ar: "جانِبَ" },
            { tr: "İçinde", ar: "في" },
            { tr: "Dışında", ar: "خارِجَ" },
            { tr: "Kitabı aç", ar: "اِفْتَح" },
            { tr: "Otur", ar: "اِجْلِسْ" },
            { tr: "Sınıfa gir", ar: "اُدْخُلِ الصَّفَّ" }
        ]
    },
    evdeyim: {
        title: "Evdeyim",
        icon: "🏠",
        words: [
            { tr: "Ev", ar: "بَيْت" },
            { tr: "Oda", ar: "غُرْفَة" },
            { tr: "Yatak odası", ar: "غُرْفَة النَّوْم" },
            { tr: "Oturma odası", ar: "غُرْفَة جُلوس" },
            { tr: "Mutfak", ar: "مَطْبَخ" },
            { tr: "Banyo", ar: "حَمّام" },
            { tr: "Yatak", ar: "سَرير" },
            { tr: "Masa", ar: "طاوِلَة" },
            { tr: "Sandalye", ar: "كُرْسِيّ" },
            { tr: "Televizyon", ar: "تِلْفاز" },
            { tr: "Buzdolabı", ar: "ثَلّاجة" },
            { tr: "Fırın", ar: "فُرْن" },
            { tr: "Halı", ar: "سَجّادَة" },
            { tr: "Telefon", ar: "هَاتِف" },
            { tr: "Lamba", ar: "مِصْباح" }
        ]
    },
    odamda: {
        title: "Odamda",
        icon: "🛏️",
        words: [
            { tr: "Odam", ar: "غُرْفَتي" },
            { tr: "Yatak", ar: "سَرير" },
            { tr: "Çalışma masası", ar: "مَكْتَب" },
            { tr: "Sandalye", ar: "كُرْسِيّ" },
            { tr: "Perde", ar: "سِتارَة" },
            { tr: "Lamba", ar: "مِصْباح" },
            { tr: "Ayna", ar: "مِرْآة" },
            { tr: "Halı", ar: "سَجّادَة" },
            { tr: "Dolap", ar: "دُولاب" },
            { tr: "Temiz", ar: "نَظيف" },
            { tr: "Düzenli", ar: "مُرَتَّب" },
            { tr: "Kirli", ar: "وَسِخ" },
            { tr: "Temizliyor", ar: "يُنَظِّفُ" },
            { tr: "Düzenliyor", ar: "يُرَتِّبُ" }
        ]
    },
    gunluk_rutin: {
        title: "Günlük Rutin",
        icon: "📅",
        words: [
            { tr: "Erken uyanıyorum", ar: "أَسْتَيْقِظُ مُبَكِّرًا" },
            { tr: "Okula gidiyorum", ar: "أَذْهَبُ إِلى المَدْرَسَة" },
            { tr: "Öğle namazı kılıyorum", ar: "أُصَلّي صَلاة الظُّهْر" },
            { tr: "Ailemle öğle yemeği yiyorum", ar: "أَتَغَدّى مَع أُسْرَتي" },
            { tr: "Derslerimi okuyorum", ar: "أَقْرَأُ دروسي" },
            { tr: "Ödev yazıyorum", ar: "أَكْتُبُ واجِباتي" },
            { tr: "Bahçede oynuyorum", ar: "أَلْعَبُ في السّاحَة" },
            { tr: "Anneme yardım ediyorum", ar: "أُساعِدُ أُمّي" },
            { tr: "Dedemi ziyaret ediyorum", ar: "أَزورُ جَدِي" },
            { tr: "Camiye gidiyorum", ar: "أَذْهَبُ إِلى المَسْجِد" },
            { tr: "Yatağımı düzeltiyorum", ar: "أُرَتِّبُ سَريري" },
            { tr: "Odamı temizliyorum", ar: "أُنَظِّفُ غُرْفَتي" },
            { tr: "Derslerimi tekrar ediyorum", ar: "أُراجِعُ دروسي" },
            { tr: "Geç yatıyorum", ar: "أَنامُ مُتَأَخِّرًا" }
        ]
    },

    // --- 10. SINIF KONULARI ---
    guzel_davranislar: {
        title: "Güzel Davranışlar",
        icon: "✨",
        words: [
            { tr: "Doğruluk", ar: "صِدْق" },
            { tr: "Güvenilirlik", ar: "أَمانَة" },
            { tr: "Samimiyet", ar: "إِخْلاص" },
            { tr: "Yardımlaşma", ar: "تَعاوُن" },
            { tr: "Saygı", ar: "اِحْتِرام" },
            { tr: "Sevgi", ar: "مَحَبَّة" },
            { tr: "Teşekkür", ar: "شُكْر" },
            { tr: "Özür dileme", ar: "الِاعْتِذار" },
            { tr: "Merhamet", ar: "رَحْمَة" },
            { tr: "Sabır", ar: "صَبْر" },
            { tr: "Adalet", ar: "عَدْل" },
            { tr: "Alçakgönüllülük", ar: "تَواضُع" },
            { tr: "Yardım ediyor", ar: "يُساعِدُ" },
            { tr: "Seviyor", ar: "يُحِبُّ" },
            { tr: "Gülümsüyor", ar: "يَبْتَسِمُ" }
        ]
    },
    mutlu_aile: {
        title: "Mutlu Aile",
        icon: "👨‍👩‍👧‍👦",
        words: [
            { tr: "Aile", ar: "أُسْرَة" },
            { tr: "Baba", ar: "أَب" },
            { tr: "Anne", ar: "أُمّ" },
            { tr: "Erkek kardeş", ar: "أَخ" },
            { tr: "Kız kardeş", ar: "أُخْت" },
            { tr: "Dede", ar: "جَدّ" },
            { tr: "Nine", ar: "جَدَّة" },
            { tr: "Amca", ar: "عَمّ" },
            { tr: "Hala", ar: "عَمَّة" },
            { tr: "Dayı", ar: "خال" },
            { tr: "Teyze", ar: "خالَة" },
            { tr: "Akrabalar", ar: "أَقارِب" },
            { tr: "Akrabaları ziyaret ediyor", ar: "يَزورُ الأَقارِب" },
            { tr: "Büyüklere saygı gösteriyor", ar: "يَحْتَرِمُ الكِبار" },
            { tr: "Küçüklere merhamet ediyor", ar: "يَرْحَمُ الصِّغار" }
        ]
    },
    hobilerim: {
        title: "Hobilerim",
        icon: "🎨",
        words: [
            { tr: "Okuma", ar: "قِراءَة" },
            { tr: "Yazma", ar: "كِتابَة" },
            { tr: "Resim yapma", ar: "رَسْم" },
            { tr: "Yemek pişirme", ar: "طَبْخ" },
            { tr: "Fotoğrafçılık", ar: "تَصْوير" },
            { tr: "Spor", ar: "رِياضَة" },
            { tr: "Futbol", ar: "كُرَة القَدَم" },
            { tr: "Basketbol", ar: "كُرَة السَّلَّة" },
            { tr: "Seyahat", ar: "سَفَر" },
            { tr: "Doğa", ar: "طَبيعَة" },
            { tr: "Filmler", ar: "أَفْلام" },
            { tr: "Müzik", ar: "موسيقى" },
            { tr: "Kütüphane", ar: "مَكْتَبَة" },
            { tr: "Boş zamanlarda", ar: "في الوَقْت الفارِغ" },
            { tr: "Faydalı", ar: "مُفيد" },
            { tr: "Eğlenceli", ar: "مُمْتِع" }
        ]
    },
    saglikli_beslenme: {
        title: "Sağlıklı Beslenme",
        icon: "🥦",
        words: [
            { tr: "Meyveler", ar: "فَواكِه" },
            { tr: "Sebzeler", ar: "خُضْراوات" },
            { tr: "Et", ar: "لَحْم" },
            { tr: "Balık", ar: "سَمَك" },
            { tr: "Süt", ar: "لَبَن" },
            { tr: "Peynir", ar: "جُبْن" },
            { tr: "Yumurta", ar: "بَيْض" },
            { tr: "Ekmek", ar: "خُبْز" },
            { tr: "Su", ar: "ماء" },
            { tr: "Meyve suyu", ar: "عَصير" },
            { tr: "Kahvaltı", ar: "فَطور" },
            { tr: "Öğle yemeği", ar: "غَداء" },
            { tr: "Akşam yemeği", ar: "عَشاء" }
        ]
    },
       meslekler_10: {
        title: "Meslekler",
        icon: "💼",
        words: [
            { tr: "Doktor", ar: "طَبيب" },
            { tr: "Mühendis", ar: "مُهَنْدِس" },
            { tr: "Öğretmen", ar: "مُعَلِّم" }, 
            { tr: "Polis", ar: "شُرْطِيّ" },
            { tr: "Aşçı", ar: "طَبّاخ" },
            { tr: "Çiftçi", ar: "فَلّاح" },
            { tr: "Pilot", ar: "طَيّار" },
            { tr: "Marangoz", ar: "نَجّار" },
            { tr: "Terzi", ar: "خَيّاط" },
            { tr: "Kasap", ar: "جَزّار" }
        ]
    },
    hava_durumu_10: {
        title: "Hava Durumu",
        icon: "⛅",
        words: [
            { tr: "Sıcak", ar: "حارّ" },
            { tr: "Soğuk", ar: "بارِد" },
            { tr: "Güneşli", ar: "مُشْمِس" },
            { tr: "Yağmurlu", ar: "مُمْطِر" },
            { tr: "Karlı", ar: "مُثْلِج" },
            { tr: "Bulutlu", ar: "غائِم" },
            { tr: "Rüzgarlı", ar: "عاصِف" },
            { tr: "Ilıman", ar: "مُعْتَدِل" }
        ]
    },
    vucudumuz_10: {
        title: "Vücudumuz",
        icon: "🧍",
        words: [
            { tr: "Baş / Kafa", ar: "رَأْس" },
            { tr: "Göz", ar: "عَيْن" },
            { tr: "Burun", ar: "أَنْف" },
            { tr: "Ağız", ar: "فَم" },
            { tr: "Kulak", ar: "أُذُن" },
            { tr: "El", ar: "يَد" },
            { tr: "Ayak", ar: "رِجْل" },
            { tr: "Kalp", ar: "قَلْب" },
            { tr: "Yüz", ar: "وَجْه" },
            { tr: "Dil", ar: "لِسان" }
        ]
    }
};

// --- DEĞİŞKENLER VE AYARLAR ---
const cardColors = ["#364fc7", "#63e6be", "#ff922b", "#f06595", "#845ef7", "#51cf66", "#fcc419", "#339af0"];
let mode = 'study', isAr = true, scores = [0, 0], currentPlayer = 1, activeFlipped = [];
let currentWords = []; // Seçilen konunun kelimeleri

// --- SİSTEM BAŞLATICI ---
window.onload = () => {
    renderMenu(); 
};

// --- MENÜ YÖNETİMİ ---
function renderMenu() {
    const list = document.getElementById('topics-list');
    if (!list) return;
    list.innerHTML = '';
    
    Object.keys(topics).forEach(key => {
        const topic = topics[key];
        const card = document.createElement('div');
        card.style = "background:white; padding:25px; border-radius:20px; box-shadow:0 12px 25px rgba(0,0,0,0.1); cursor:pointer; border:3px solid transparent; transition:0.3s;";
        card.innerHTML = `<div style="font-size:3rem;">${topic.icon}</div><h3>${topic.title}</h3><span>${topic.words.length} Kelime</span>`;
        
        card.onclick = () => {
            currentWords = [...topic.words]; // Referans hatasını önlemek için kopya al
            document.getElementById('menu-screen').style.display = 'none';
            document.getElementById('game-screen').style.display = 'flex';
            setMode('study'); // Varsayılan olarak çalışma moduyla başla
        };
        list.appendChild(card);
    });
}

function showMenu() {
    if (typeof playSound === 'function') playSound('snd-click');
    document.getElementById('menu-screen').style.display = 'flex';
    document.getElementById('game-screen').style.display = 'none';
    currentWords = []; // Seçimi temizle[cite: 3]
}

// --- OYUN MODU YÖNETİMİ ---
function setMode(m) {
    if (typeof playSound === 'function') playSound('snd-click');
    mode = m; 
    scores = [0, 0]; 
    currentPlayer = 1; 
    activeFlipped = [];

    const studyBtn = document.getElementById('btn-study');
    const mainLangBtn = document.getElementById('lang-btn-main');
    const memStartBtn = document.getElementById('btn-memory-start');
    const memControls = document.getElementById('memory-controls');
    const toggle = document.getElementById('mode-toggle');

    // "Kartlar" butonu hafıza modundayken de görünür kalmalı (talebiniz üzerine)[cite: 3]
    studyBtn.style.display = 'inline-block';

    if (m === 'study') {
        studyBtn.classList.add('active');
        memStartBtn.classList.remove('active');
        mainLangBtn.style.display = 'inline-block';
        memStartBtn.style.display = 'inline-block';
        memControls.style.display = 'none';
    } else {
        studyBtn.classList.remove('active');
        memStartBtn.classList.add('active');
        mainLangBtn.style.display = 'none';
        memStartBtn.style.display = 'none'; // Hafıza modunda başlat butonunu gizle
        memControls.style.display = 'flex';
        if (toggle) toggle.checked = (m === 'mem2');
    }
    init(); // Kartları yeniden oluştur[cite: 3]
}

// --- GRID VE KART OLUŞTURMA (Hataların Giderildiği Bölüm) ---
function init() {
    if (!currentWords || currentWords.length === 0) {
        console.warn("Lütfen önce bir konu seçin.");
        return;
    }

    const grid = document.getElementById('grid');
    const p1Box = document.getElementById('p1-box');
    const p2Box = document.getElementById('p2-box');
    const pairCountInput = document.getElementById('pairCount');
    const pairCount = pairCountInput ? parseInt(pairCountInput.value) : 9;
    const isMobile = window.innerWidth <= 768;
    
    grid.innerHTML = '';
    const isStudy = mode === 'study';
    const isMem2 = mode === 'mem2';

    if (p1Box) p1Box.style.display = isMem2 ? 'flex' : 'none';
    if (p2Box) p2Box.style.display = isMem2 ? 'flex' : 'none';
    grid.className = `grid ${isStudy ? '' : 'memory-mode'}`;

    let selectedWords = isStudy ? currentWords : currentWords.slice(0, pairCount);
    let displayList = [];

    if (isStudy) {
        displayList = selectedWords;
        grid.style.height = "auto"; 
        grid.style.gridTemplateColumns = isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)";
        grid.style.gridAutoRows = isMobile ? "120px" : "minmax(180px, auto)"; 
    } else {
        selectedWords.forEach(w => {
            displayList.push({ text: w.ar, pairId: w.ar, lang: 'ar' });
            displayList.push({ text: w.tr, pairId: w.ar, lang: 'tr' });
        });
        displayList.sort(() => Math.random() - 0.5);
        
        let colCount = isMobile ? 3 : (displayList.length <= 12 ? 4 : 6);
        let rowCount = Math.ceil(displayList.length / colCount);
        grid.style.height = "100%"; 
        grid.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${rowCount}, 1fr)`; 
        grid.style.gridAutoRows = "none";
    }

    grid.setAttribute('data-total', displayList.length);

    displayList.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = isStudy ? item.ar : item.pairId;
        
        const isBackAr = isStudy ? !isAr : (item.lang === 'ar');
        const color = isStudy ? cardColors[index % cardColors.length] : "#5c7cfa";

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-front" style="background-color: ${color}">
                    <span class="${isStudy && isAr ? 'lang-ar' : 'lang-tr'}">
                        ${isStudy ? (isAr ? item.ar : item.tr) : ""}
                    </span>
                </div>
                <div class="card-face card-back ${isBackAr ? 'lang-ar' : 'lang-tr'}">
                    <span>${isStudy ? (isAr ? item.tr : item.ar) : item.text}</span>
                </div>
            </div>`;
        
        card.onclick = () => handleFlip(card);
        grid.appendChild(card);
    });
    updateUI();
}

// --- OYUN MANTIĞI VE YARDIMCI FONKSİYONLAR ---
function handleFlip(card) {
    if (card.classList.contains('matched') || (mode !== 'study' && activeFlipped.length >= 2)) return;

    if (mode === 'study') {
        if (card.classList.contains('flipped')) {
            playSound('snd-flip');
            clearTimeout(card.studyTimer);
            card.classList.remove('flipped');
        } else {
            playSound('snd-flip');
            card.classList.add('flipped');
            card.studyTimer = setTimeout(() => {
                if(card.classList.contains('flipped')) {
                    playSound('snd-flip'); 
                    card.classList.remove('flipped');
                }
            }, 3000);
        }
        return;
    }

    if (card.classList.contains('flipped')) return;
    playSound('snd-flip');
    card.classList.add('flipped');
    activeFlipped.push(card);
    if (activeFlipped.length === 2) checkMatch();
}

function checkMatch() {
    const [a, b] = activeFlipped;
    const isMatch = a.dataset.id === b.dataset.id;

    setTimeout(() => {
        if (isMatch) {
            playSound('snd-match');
            a.classList.add('matched');
            b.classList.add('matched');
            if (mode === 'mem2') scores[currentPlayer - 1]++; else scores[0]++;
        } else {
            if (typeof playSound !== 'undefined') playSound('snd-wrong'); 
            a.classList.remove('flipped');
            b.classList.remove('flipped');
            if (mode === 'mem2') currentPlayer = (currentPlayer === 1) ? 2 : 1;
        }
        activeFlipped = [];
        updateUI();
    }, 800);
}

function updateUI() {
    const s1 = document.getElementById('s1');
    const s2 = document.getElementById('s2');
    if (s1) s1.innerText = scores[0];
    if (s2) s2.innerText = scores[1];
    document.getElementById('p1-box').classList.toggle('active-p', currentPlayer === 1);
    document.getElementById('p2-box').classList.toggle('active-p', currentPlayer === 2);
}

function playSound(id) {
    const s = document.getElementById(id);
    if (!s) return;
    s.pause();
    s.currentTime = 0;
    s.volume = 0.15;
    s.play().catch(() => {});
}

function toggleLang() {
    playSound('snd-click');
    isAr = !isAr;
    init();
}

function toggleSwitch(isCheck) {
    const toggle = document.getElementById('mode-toggle');
    if (toggle) {
        toggle.checked = isCheck;
        toggleMemoryMode(toggle);
    }
}

function toggleMemoryMode(checkbox) {
    setMode(checkbox.checked ? 'mem2' : 'mem1');
}