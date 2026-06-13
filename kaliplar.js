
// ==================================================================
// YENİ KÖK SEÇİM SİSTEMİ (POPUP KLAVYE + TAHMİN)
// ==================================================================
const onemliKokler = ["كتب", "علم", "قدر", "كمل", "ملك","حرم", "سلم", "حكم", "عرف", "رحم"];
const aksamSebaKokleri = ["أمن", "شدد", "أكل", "سأل", "وجد", "قول", "بيع", "دعو", "مشي", "رضي", "وقي", "ضلل"];
const mezidFiilKokleri = ["عدد", "صلي", "سوي", "وصل", "خير", "وضأ", "عون", "وفي", "طوي", "خبر", "نظم", "حقق", "كمل", "شكل"];

const arapcaHarfler = "أ ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" ");
let currentSearchQuery = ""; 

function getRootEmoji(root) {
    if(wordEasterEggs[root]) {
        const keys = Object.keys(wordEasterEggs[root]);
        if (keys.length > 0 && wordEasterEggs[root][keys[0]].base && wordEasterEggs[root][keys[0]].base.emoji) {
            return wordEasterEggs[root][keys[0]].base.emoji;
        }
    }
    return "🔹";
}

function renderVerbMenu() {
    const importantContainer = document.getElementById("important-roots-list");
    const gridContainer = document.getElementById("letters-grid-container");
    
    if(!importantContainer || !gridContainer) return;

    importantContainer.innerHTML = "";
    gridContainer.innerHTML = "";

    // 1. Önemli Kökler
    onemliKokler.forEach(root => {
        if(wordEasterEggs[root]) importantContainer.innerHTML += createFlatRootItem(root);
    });

    // 2. 4 Sütunlu Bağımsız Scroll Sistemi (ص harfi 3. sütuna kaydırıldı)
    const ranges = [
        { title: "أ - ب - ت - ث - ج - ح - خ", start: 0, end: 6 },
        { title: "د - ذ - ر - ز - س - ش", start: 7, end: 12 },
        { title: "ص - ض - ط - ظ - ع - غ - ف - ق", start: 13, end: 20 },
        { title: "ك - ل - م - ن - ه - و - ي", start: 21, end: 27 }
    ];

    const allRoots = Object.keys(wordEasterEggs);
    const rootsByLetter = {};
    arapcaHarfler.forEach(h => rootsByLetter[h] = []);
    allRoots.forEach(root => {
        const firstLetter = root.charAt(0);
        if(rootsByLetter[firstLetter]) rootsByLetter[firstLetter].push(root);
    });

    ranges.forEach(range => {
        let colHTML = `<div class="letter-column"><div class="col-range-header">${range.title}</div>`;
        for(let i = range.start; i <= range.end; i++) {
            let letter = arapcaHarfler[i];
            if (rootsByLetter[letter] && rootsByLetter[letter].length > 0) {
                colHTML += `<div class="letter-group-title">${letter}</div>`;
                colHTML += `<div class="flat-root-list" style="padding: 0 10px; justify-content: center;">`;
                rootsByLetter[letter].forEach(r => { colHTML += createFlatRootItem(r); });
                colHTML += `</div>`;
            }
        }
        colHTML += `</div>`;
        gridContainer.innerHTML += colHTML;
    });

    // 3. İki Klavyeyi de Eş Zamanlı Oluşturur
    renderUniversalKeyboards();
}

function createFlatRootItem(root) {
    return `<div class="flat-root-item root-item" data-root="${root}" onclick="selectRootFromMenu('${root}')">
        <span>${root}</span>
        <span style="margin-right:8px;">${getRootEmoji(root)}</span>
    </div>`;
}

function selectRootFromMenu(root) {
    if (typeof closeSlideMenu === 'function') closeSlideMenu();
    
    // Arama Verilerini Sıfırla (HTML'den sildiğimiz öğelerin JS'yi çökertmesini engeller)
    currentSearchQuery = "";
    
    const searchInput = document.getElementById("root-search");
    if (searchInput) searchInput.value = "";
    
    const predictions = document.getElementById("root-predictions");
    if (predictions) predictions.innerHTML = "";

    // Uygulamanın Orijinal Kök Seçme Komutunu Başlat
    if (typeof selectReadyVerb === 'function') {
        selectReadyVerb(root);
    }
}

// --- POPUP ARAMA KLAVYESİ ---
function openSearchKeyboard(e) {
    if (e) e.stopPropagation();
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    const popup = document.getElementById('integrated-keyboard-popup');
    const backdrop = document.getElementById('keyboard-backdrop'); 
    
    if (popup) popup.classList.add('active');
    if (backdrop) backdrop.classList.add('active'); // Kalkanı aç
}

// --- 3. POPUP KLAVYEYİ ÇARPIYLA KAPATMA ---
function closeSearchKeyboard() {
    const searchInput = document.getElementById('root-search');
    
    if (searchInput && searchInput.value.length > 0) {
        searchInput.value = "";
        if (typeof currentSearchQuery !== 'undefined') currentSearchQuery = "";
        if (typeof updatePredictionsAndFilter === 'function') updatePredictionsAndFilter();
        if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
        if (typeof toggleRootHint === 'function') toggleRootHint(true);
    } else {
        const popup = document.getElementById('integrated-keyboard-popup');
        const backdrop = document.getElementById('keyboard-backdrop'); 
        
        if (popup) popup.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active'); 
        if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
        
        // EKSİKTİ: Klavyeyi boşken kapattığında da ışığı kontrol et!
        if (typeof toggleRootHint === 'function') toggleRootHint(true);
    }
}



function handleSearchKey(char) {
    toggleRootHint(false);
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    if (char === 'BACKSPACE') {
        currentSearchQuery = currentSearchQuery.slice(0, -1);
    } else {
        if (currentSearchQuery.length < 3) { // Kökler max 3 harf olur
            currentSearchQuery += char;
        }
    }

    const searchInput = document.getElementById("root-search");
    if(searchInput) searchInput.value = currentSearchQuery;

    updatePredictionsAndFilter();
}

function updatePredictionsAndFilter() {
    let filter = currentSearchQuery.trim();
    
    // 1. Ekrandaki Kartları Filtrele
    const allItems = document.querySelectorAll('.root-item');
    allItems.forEach(item => {
        if(item.dataset.root.includes(filter)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });

    // 2. Tahmin (Autocomplete) Çubuğunu Güncelle
    const predictionsContainer = document.getElementById("root-predictions");
    predictionsContainer.innerHTML = "";
    
    if (filter.length > 0) {
        const allRoots = Object.keys(wordEasterEggs);
        // Yazılan harflerle BAŞLAYAN kökleri öncelikli getir
        const matches = allRoots.filter(r => r.startsWith(filter)).slice(0, 15);
        
        matches.forEach(r => {
            predictionsContainer.innerHTML += `
                <div class="prediction-chip" onclick="selectRootFromMenu('${r}')">
                    ${r} ${getRootEmoji(r)}
                </div>`;
        });
    }
}


// --- AŞAĞIDAN ÇIKAN SLIDE MENÜ KONTROLLERİ ---
function openSlideMenu(type) {
    closeSearchKeyboard(); // Klavye açıksa menü çakışmasın diye kapat
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    const slideMenu = document.getElementById('slide-up-menu');
    const slideTitle = document.getElementById('slide-title');
    const slideContent = document.getElementById('slide-content');
    const slideBackdrop = document.getElementById('slide-menu-backdrop'); // KALKANI BUL
    
    slideContent.innerHTML = "";
    if (type === 'aksam') {
        slideTitle.innerText = "أقسام السبعة";
        aksamSebaKokleri.forEach(r => { if(wordEasterEggs[r]) slideContent.innerHTML += createFlatRootItem(r); });
    } else {
        slideTitle.innerText = "مزيد";
        mezidFiilKokleri.forEach(r => { if(wordEasterEggs[r]) slideContent.innerHTML += createFlatRootItem(r); });
    }
    
    if (slideMenu) slideMenu.classList.add('active');
    if (slideBackdrop) slideBackdrop.classList.add('active'); // KALKANI AÇ
}

function closeSlideMenu() {
    if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
    
    const slideMenu = document.getElementById('slide-up-menu');
    const slideBackdrop = document.getElementById('slide-menu-backdrop'); // KALKANI BUL
    
    if (slideMenu) slideMenu.classList.remove('active');
    if (slideBackdrop) slideBackdrop.classList.remove('active'); // KALKANI KAPAT
}

// Sayfa Yüklendiğinde Sistemi Başlat
document.addEventListener("DOMContentLoaded", () => {
    renderVerbMenu();
});


const SoundEngine = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },
    
    // 1. Tok ve Ciddi Tıklama (Premium dokunmatik / haptic hissiyatı)
    playClick() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        // Frekans çok daha düşük (pes), bu sayede "bip" değil "tık/tok" sesi çıkarır
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.03);
        
        // Çok düşük ses seviyesi ve anında kesilme (0.03 saniye)
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
    },
    
    // 2. Yumuşak ve Derin Kapatma Sesi (Soft Cancel)
    playClose() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine'; 
        // İptal hissi için çok pes frekanslardan dibe doğru iniş
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);
        
        // Ses seviyesi (volume) çok kısık, kulak yormaz
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    },
    
    // 3. Sıfırlama / Onaylama (Hareketli zil yerine; sıcak, tekil ve soft bir nefes)
    playReset() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        // Sıcak ve güven veren orta-pes bir frekans sabiti (E4 Notası)
        osc.frequency.setValueAtTime(329.63, now); 
        
        // Ses aniden değil, yumuşakça (fade-in) girip çok yumuşakça (fade-out) söner
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 0.05); // Zirve sesi çok kısıldı (0.03)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25); 
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.3);
    }
};


// Temizlik fonksiyonu
function closeAllZoomedBoxes() {
    document.querySelectorAll('.zoom-overlay').forEach(overlay => {
        overlay.classList.remove('active');
    });
    
    // Ekranda açık olan DEV KALIP klonunu sil
    const clone = document.getElementById('crisp-zoom-clone');
    if (clone) clone.remove();

    // Ekranda açık olan KAHVERENGİ KÖK klonunu sil
    const rootClone = document.getElementById('crisp-root-clone');
    if (rootClone) rootClone.remove();
    
    document.querySelectorAll('.glass-box.pulse-highlight').forEach(box => {
        box.classList.remove('pulse-highlight', 'pulse-settled'); 
        box.style.transform = "";
        box.style.borderColor = ""; 
        box.style.boxShadow = "";
    });
}

window.onload = function() {
    // YENİ: Sayfa açıldığında hazır kök butonunun vurgusunu başlat
    toggleRootHint(true);

    const zoomCheckbox = document.getElementById('zoomToggleCheckbox');
    if (zoomCheckbox) {
        zoomCheckbox.checked = false;
    }

    document.querySelectorAll('.glass-box').forEach((box) => {
        const textEl = box.querySelector('.ar, .ar-small');
        if (textEl) {
            // Orijinal düz metni alıyoruz
            if (!textEl.hasAttribute('data-original')) {
                textEl.setAttribute('data-original', textEl.innerText.trim());
            }
            box.style.cursor = "pointer";
            
            // İLK AÇILIŞTA RENKLENDİRME! (Siyah açılma sorununu ebediyen çözer)
            let originalText = textEl.getAttribute('data-original');
            if (originalText && originalText !== "-") {
                textEl.innerHTML = ColorEngine.colorize(originalText, ['ف', 'ع', 'ل']);
            }

            const refSpan = box.querySelector('.ref');
            if (refSpan) {
                const rId = parseInt(refSpan.textContent.trim());
                if ((rId >= 1 && rId <= 16) || [52,53,54,58,59,60,64,65,66,71,72,73,77,78,79,83,84,85,88,89,90,94,95,96,100,101,102].includes(rId)) {
                    box.setAttribute('data-tiklama-sayisi', '0');
                }
            }
            box.onclick = function() { handleBoxClick(this); };
        }
    });

    const sliderContainer = document.querySelector('.window-pencere');
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', (e) => {
            SoundEngine.init(); 
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipeGesture();
        }, { passive: true });

        sliderContainer.addEventListener('wheel', (e) => {
            const now = Date.now();
            if (now - lastWheelTime < wheelCooldown) return; 

            if (Math.abs(e.deltaX) > 25 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                SoundEngine.init();
                if (e.deltaX > 0) {
                    if (currentTabActive === 0) { setTab(1); lastWheelTime = now; }
                } else {
                    if (currentTabActive === 1) { setTab(0); lastWheelTime = now; }
                }
                e.preventDefault();
            }
        }, { passive: false });
    }
};

document.addEventListener('click', closeIfOutside);
document.addEventListener('touchstart', closeIfOutside, { passive: false });

function closeIfOutside(e) {
    // BURASI ÖNEMLİ: '#suffix-dropdown' menüsünü de kutu içi (güvenli) sayıyoruz!
    const isInside = e.target.closest('.conjugation-inline-container') || 
                     e.target.closest('.glass-box') || 
                     e.target.closest('#suffix-dropdown');
                     
    if (!isInside) {
        // Tabloları Kapat
        document.querySelectorAll('.glass-box.matrix-opened').forEach(box => {
            const closeBtn = box.querySelector('.matrix-close-btn');
            if (closeBtn) closeInlineMatrix(null, closeBtn);
        });
        
        // Boşluğa tıklanınca/dokunulunca Büyümüş Kutu (Zoom) Varsa Kapat
        if (typeof closeAllZoomedBoxes === 'function') {
            closeAllZoomedBoxes();
        }
    }
}

function handleSwipeGesture() {
    const distance = touchStartX - touchEndX;
    if (Math.abs(distance) > minSwipeDistance) {
        if (distance > 0 && currentTabActive === 1) { setTab(0); } 
        else if (distance < 0 && currentTabActive === 0) { setTab(1); }
    }
}

// ==================================================================
// 1. TABLO GEÇİŞİ (Sağa Kayma ve Boşluk Hatasının Çözümü)
// ==================================================================
function setTab(tabIndex) {
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick(); 
    const band = document.getElementById('mainSliderBandi');
    const switcher = document.getElementById('tabSwitch');
    
    currentTabActive = tabIndex;

    // KESİN ÇÖZÜM: Tabloların içerik boyutuna göre sınırlarını esnetmesini engelliyoruz (min-width: 0 kuralı)
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.minWidth = "0"; 
        tab.style.overflowX = "auto";
    });

    if (tabIndex === 1) {
        switcher.classList.remove("mucerred-active");
        switcher.classList.add("mezid-active");
        
        band.style.transform = "translateX(50%)"; 
    } else {
        switcher.classList.remove("mezid-active");
        switcher.classList.add("mucerred-active");
        
        band.style.transform = "translateX(0%)";  
    }
}



// --- 1. HAZIR KÖK MENÜSÜNÜ AÇMA (Arka planı sıfırlayarak açma) ---
function openVerbModal() {
    // YENİ EKLENEN: Arkadaki eski tabloyu, renkleri ve kahverengi taşı tamamen temizle!
    currentRoot = "";
    const tempDisp = document.getElementById('temp-root-display');
    if (tempDisp) tempDisp.innerText = "";
    if (typeof updateTempDisplay === 'function') updateTempDisplay();
    if (typeof resetTableOnly === 'function') resetTableOnly(true);
    if (typeof clearDraggableRoots === 'function') clearDraggableRoots();
    if (typeof highlightEasterEggBoxes === 'function') highlightEasterEggBoxes("");

    // Menüyü görünür yap
    const overlay = document.getElementById('verb-overlay');
    if (overlay) overlay.style.display = 'flex';
    
    // Arama kutusunu ve arka plan hafızasını tamamen sıfırla
    const searchInput = document.getElementById('root-search');
    if (searchInput) searchInput.value = "";
    if (typeof currentSearchQuery !== 'undefined') currentSearchQuery = "";
    
    // Doğru filtreleme fonksiyonu (Kayıp kökleri geri getirir)
    if (typeof updatePredictionsAndFilter === 'function') updatePredictionsAndFilter();
    
    // Klavye önceden açık kalmışsa onu aşağı gizle
    const popup = document.getElementById('integrated-keyboard-popup');
    if (popup) popup.classList.remove('active');
    
    // Ses çal
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
}

// --- 2. HAZIR KÖK MENÜSÜNÜ KAPATMA (Önce Sil, Sonra Kapat) ---
function closeVerbModal() {
    const searchInput = document.getElementById('root-search');
    
    if (searchInput && searchInput.value.length > 0) {
        searchInput.value = "";
        if (typeof currentSearchQuery !== 'undefined') currentSearchQuery = "";
        if (typeof updatePredictionsAndFilter === 'function') updatePredictionsAndFilter(); 
        if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
        if (typeof toggleRootHint === 'function') toggleRootHint(true);
    } else {
        // Eğer kutu zaten boşsa menüyü tamamen kapat
        document.getElementById('verb-overlay').style.display = 'none';
        if (typeof closeSearchKeyboard === 'function') closeSearchKeyboard();
        if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
        
        // EKSİKTİ: Menüyü boşken kapattığında da ana ekranda kelime yoksa ışığı geri yak!
        if (typeof toggleRootHint === 'function') toggleRootHint(true);
    }
}

function selectReadyVerb(verb) {
    if (typeof clearDraggableRoots === 'function') clearDraggableRoots();
    if (typeof SoundEngine !== "undefined") SoundEngine.playReset();
    if (typeof resetTableOnly === 'function') resetTableOnly(true); 

    currentEggIndex = 0;
    const trimmedRoot = verb.trim();
    if (trimmedRoot.length !== 3) return;
    
    currentRoot = trimmedRoot;
    
    // KESİN ÇÖZÜM: Tablo sıfırlandıktan ve yeni kök hafızaya alındıktan SONRA vurguyu zorla kapat!
    if (typeof toggleRootHint === 'function') toggleRootHint(false);

    const rootDisplay = document.getElementById('root-text-display');
    if (rootDisplay) rootDisplay.innerText = currentRoot;
    
    if (typeof closeVerbModal === 'function') closeVerbModal();
    if (typeof highlightEasterEggBoxes === 'function') highlightEasterEggBoxes(currentRoot);
    if (typeof autoSpawnRootClone === 'function') autoSpawnRootClone();
    if (typeof currentTabActive !== 'undefined' && currentTabActive === 1 && typeof setTab === 'function') setTab(0);

}

function clearOtherActiveBoxes(currentBox) {
    document.querySelectorAll('.glass-box').forEach(box => {
        if (box !== currentBox) {
            box.classList.add('no-transition'); 
            box.classList.remove("pulse-highlight");
            box.style.transform = "";
            void box.offsetWidth;
            
            if (box.classList.contains('matrix-opened')) {
                const closeBtn = box.querySelector('.matrix-close-btn');
                if (closeBtn) closeInlineMatrix(null, closeBtn);
            }
            
            setTimeout(() => {
                if (box) box.classList.remove('no-transition');
            }, 50);
        }
    });
}

function getBabAndType(refId) {
    let type = "";
    let babNo = 1;

    if (refId >= 1 && refId <= 16) {
        if ([1, 8, 11, 14].includes(refId)) {
            type = "mazi";
            if (refId === 1) babNo = 1; 
            else if (refId === 8) babNo = 4;
            else if (refId === 11) babNo = 5;
            else if (refId === 14) babNo = 6;
        } else if ([2, 4, 6, 9, 12, 15].includes(refId)) {
            type = "muzari";
            if (refId === 2) babNo = 1;
            else if (refId === 4) babNo = 2;
            else if (refId === 6) babNo = 3;
            else if (refId === 9) babNo = 4;
            else if (refId === 12) babNo = 5;
            else if (refId === 15) babNo = 6;
        } else if ([3, 5, 7, 10, 13, 16].includes(refId)) {
            type = "emir";
            if (refId === 3) babNo = 1;
            else if (refId === 5) babNo = 2;
            else if (refId === 7) babNo = 3;
            else if (refId === 10) babNo = 4;
            else if (refId === 13) babNo = 5;
            else if (refId === 16) babNo = 6;
        }
    } 
    else if ([52,53,54,58,59,60,64,65,66,71,72,73,77,78,79,83,84,85,88,89,90,94,95,96,100,101,102].includes(refId)) {
        if ([52,58,64,71,77,83,88,94,100].includes(refId)) type = "mazi";
        else if ([53,59,65,72,78,84,89,95,101].includes(refId)) type = "muzari";
        else if ([54,60,66,73,79,85,90,96,102].includes(refId)) type = "emir";

        if (refId >= 52 && refId <= 54) babNo = 7;
        else if (refId >= 58 && refId <= 60) babNo = 8;
        else if (refId >= 64 && refId <= 66) babNo = 9;
        else if (refId >= 71 && refId <= 73) babNo = 10;
        else if (refId >= 77 && refId <= 79) babNo = 11;
        else if (refId >= 83 && refId <= 85) babNo = 12;
        else if (refId >= 88 && refId <= 90) babNo = 13;
        else if (refId >= 94 && refId <= 96) babNo = 14;
        else if (refId >= 100 && refId <= 102) babNo = 15;
    }
    return { type, babNo };
}

// ==================================================================
// 1. KUTU SIFIRLAMA (Sarı Vurgu Tetiklemesi Kaldırıldı)
// ==================================================================
function resetBox(el) {
    const textEl = el.querySelector('.ar, .ar-small');
    if (!textEl) return;
    
    const originalText = el.getAttribute('data-original') || textEl.innerText;
    textEl.innerHTML = ColorEngine.colorize(originalText, ['ف', 'ع', 'ل']);
    
    el.style.backgroundColor = "";
    el.style.borderColor = "";
    el.style.boxShadow = ""; 
    
    el.classList.remove('matrix-opened');
    const container = el.querySelector('.conjugation-inline-container');
    if (container) {
        container.remove(); 
    }
    
    const triggerBtn = el.querySelector('.easter-egg-trigger');
    if (triggerBtn) {
        triggerBtn.remove();
    }

    const refSpan = el.querySelector('.ref');
    if (refSpan) {
        const rId = refSpan.innerText.trim();
        document.querySelectorAll(`.easter-egg-emoji[data-ref="${rId}"]`).forEach(emoji => emoji.remove());
    }
    
    const plusBtn = document.querySelector('.fa-plus');
    if (plusBtn) plusBtn.classList.remove('plus-highlighted');
    
    if (el.hasAttribute('data-tiklama-sayisi')) {
        el.setAttribute('data-tiklama-sayisi', '0');
    }

 // ==================================================================
    // KESİN ÇÖZÜM 1: Kutu sıfırlandığında emojiyi ve + rozetini tamamen unutur!
    // ==================================================================
    el.removeAttribute('data-active-suffix'); // <--- EKLENEN YENİ SATIR
    el.removeAttribute('data-last-root');
    el.removeAttribute('data-last-emoji');
    el.removeAttribute('data-plus-animated'); // Animasyon hafızasını siler
    
    // YENİ: Kutunun köşesinde kalan saydam + rozetini (HTML olarak) tamamen siler
    const hintBadge = el.querySelector('.plus-hint-badge');
    if (hintBadge) hintBadge.remove();
}

// ==================================================================
// 1. SADECE FİİLLERİN KALIP NUMARASINA TIKLAYINCA TABLO AÇMA
// ==================================================================
document.addEventListener('click', function(e) {
    const refEl = e.target.closest('.ref');
    if (refEl) {
        const boxElement = refEl.closest('.glass-box');
        
        // ŞART EKLENDİ: Kutu hem aktif (kırmızı) OLMALI, hem de "fiil-box" OLMALI
        if (boxElement && boxElement.classList.contains('current-active-red') && boxElement.classList.contains('fiil-box')) {
            e.preventDefault();
            e.stopPropagation();

            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            
            const refId = parseInt(refEl.innerText);
            const mapping = typeof getBabAndType === 'function' ? getBabAndType(refId) : null;
            const kalip = boxElement.getAttribute('data-original');
            const currentRootSafe = (typeof currentRoot !== 'undefined') ? currentRoot : "";
            
            const textEl = boxElement.querySelector('.ar, .ar-small');
            lastClickedBoxTextSpan = textEl; 
            lastOriginalWord = kalip;

            if (mapping && typeof babVezinleri !== 'undefined') {
                const vezinObj = babVezinleri[mapping.babNo];
                let anaVezin = (vezinObj && vezinObj[mapping.type]) ? vezinObj[mapping.type] : kalip;
                
                if (typeof openConjugationPopup === 'function') {
                    openConjugationPopup(currentRootSafe, mapping.babNo, mapping.type, anaVezin);
                }
                
                document.querySelectorAll(`.easter-egg-emoji[data-ref="${refId}"]`).forEach(emoji => emoji.remove());
            }
        }
    }
}, true);

function handleBoxClick(boxElement) {
    const textEl = boxElement.querySelector('.ar, .ar-small');
    const refEl = boxElement.querySelector('.ref');
    if (!textEl || !refEl) return;

    const currentRootSafe = (typeof currentRoot !== 'undefined') ? currentRoot : "";
    const refId = parseInt(refEl.innerText);
    const kalip = boxElement.getAttribute('data-original');

    lastClickedBoxTextSpan = textEl;
    lastOriginalWord = kalip;

    if (typeof wordEasterEggs !== 'undefined' && wordEasterEggs[currentRootSafe]) {
        const sortedRefs = getSortedRefsForRoot(currentRootSafe);
        const idx = sortedRefs.indexOf(refId);
        if (idx !== -1) currentEggIndex = idx;
    }

    if (boxElement.getAttribute('data-modal-closed') === 'true') {
        boxElement.removeAttribute('data-modal-closed');
    }

    let tiklama = parseInt(boxElement.getAttribute('data-tiklama-sayisi') || '0');
    const mapping = getBabAndType(refId);
    
    // =======================================================
    // MOBİLDE BÜYÜTMEYİ (ZOOM) ZORLA İPTAL ET
    // (Çift tanımlama hatası giderildi, tek satırda birleştirildi)
    // =======================================================
    const isZoomEnabled = window.innerWidth <= 1024 ? false : (document.getElementById('zoomToggleCheckbox') ? document.getElementById('zoomToggleCheckbox').checked : false);

  
    // KELİMEYİ TÜRETEN FONKSİYON (Tek Veri Kaynağı: wordEasterEggs)
    const applyWordTransformation = () => {
        const vezinObj = babVezinleri[mapping.babNo];
        let kalipMetni = (vezinObj && vezinObj[mapping.type]) ? vezinObj[mapping.type] : kalip;
        
        let plainWord = kalipMetni;
        let hasMultipleUses = false; // YENİ: Çoklu kullanım kontrolü
        
       if (currentRootSafe.length === 3) {
            // ÖZEL ÇEKİM LİSTESİNDE VAR MI KONTROL ET (TEK VERİ KAYNAĞI)
            if (typeof wordEasterEggs !== 'undefined' && 
                wordEasterEggs[currentRootSafe] && 
                wordEasterEggs[currentRootSafe][refId]) {
                
                let eggObj = wordEasterEggs[currentRootSafe][refId];
                
                // 1. Önce tek kelimelik arText var mı diye bak (Cümleyi kutuya sığdırmaya çalışmasını engeller!)
                if (eggObj.base && eggObj.base.arText && eggObj.base.arText.trim().split(/\s+/).length === 1) {
                    plainWord = eggObj.base.arText;
                } 
                // 2. Yoksa çekim dizisinin ilk elemanını al
                else if (eggObj.cekimi && eggObj.cekimi.length > 0) {
                    let ilkEleman = eggObj.cekimi[0];
                    plainWord = typeof ilkEleman === 'object' ? ilkEleman.ar : ilkEleman;
                } 
                else if (eggObj.base && eggObj.base.cekimi && eggObj.base.cekimi.length > 0) {
                    let ilkEleman = eggObj.base.cekimi[0];
                    plainWord = typeof ilkEleman === 'object' ? ilkEleman.ar : ilkEleman;
                }
                // 3. Eğer CÜMLE girilmişse, standart sarf motoruyla sadece asıl kelimeyi türetip kutuya koy
                else {
                    plainWord = applyRootToKalip(currentRootSafe, kalipMetni);
                }
                
                // Çoklu kullanım (Alt Tablo) kontrolü
                if ((eggObj.cekimi && eggObj.cekimi.length > 1) || (eggObj.base && eggObj.base.cekimi && eggObj.base.cekimi.length > 1)) {
                    hasMultipleUses = true;
                }
            } else {
                // Yoksa normal algoritma ile oluştur
                plainWord = applyRootToKalip(currentRootSafe, kalipMetni);
            }
        }

        let activeRootArray = (currentRootSafe.length === 3) ? currentRootSafe.split("") : ['ف', 'ع', 'ل'];
        const coloredHTML = ColorEngine.colorize(plainWord, activeRootArray);
        
        textEl.innerHTML = coloredHTML;
        lastOriginalWord = plainWord; 


       // === YENİ EKLENEN KISIM: Kutuya "Kök Türetildi" ve "Çoklu Kullanım" etiketi ver ===
        const currentBox = textEl.closest('.glass-box');
        if (currentBox) {
            currentBox.classList.add('kok-turendi');
            
            if (!currentBox.classList.contains('fiil-box') && hasMultipleUses) {
                currentBox.classList.add('coklu-kullanim');
                const refBtn = currentBox.querySelector('.ref');
                
                if (refBtn) {
                    // ÇÖZÜM: Tıklanan kutuyu (lastClickedBoxTextSpan) sisteme zorla tanıtıyoruz ki hafıza karışmasın!
                    refBtn.setAttribute('onclick', `event.preventDefault(); event.stopPropagation(); const box = this.closest('.glass-box'); lastClickedBoxTextSpan = box.querySelector('.ar, .ar-small'); lastOriginalWord = box.getAttribute('data-original'); openConjugationPopup('${currentRootSafe}', ${refId}, 'isim', '');`);
                }
            }
        }
        // ==============================================================
        // ==============================================================
        // ==============================================================

        // Ekranda dev klon varsa onu da anında türet ve yeşile boya
        const clone = document.getElementById('crisp-zoom-clone');
        if (clone) {
            const cloneTextEl = clone.querySelector('.ar, .ar-small');
            if (cloneTextEl) cloneTextEl.innerHTML = coloredHTML;
            clone.style.setProperty("background-color", "#bfffdf", "important");
            clone.style.borderColor = "#000000";
        }
        
        if (typeof checkWordEasterEgg === 'function') checkWordEasterEgg(boxElement); 
    };

    if (isZoomEnabled) {
        if (tiklama === 0) {
            // 1. AŞAMA: Sadece Kırmızı Vurgu
            document.querySelectorAll('.glass-box').forEach(b => b.classList.remove('current-active-red'));
            boxElement.classList.add('current-active-red');
            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            boxElement.setAttribute('data-tiklama-sayisi', '1');
            
        } else if (tiklama === 1) {
            // 2. AŞAMA: Türemeden Büyüt
            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            if (typeof triggerAreaPulse === 'function') triggerAreaPulse(boxElement);
            boxElement.setAttribute('data-tiklama-sayisi', '2');
            
        } else if (tiklama === 2) {
            // 3. AŞAMA: Türet ve Yeşil Yap
            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            boxElement.style.setProperty("background-color", "#bfffdf", "important"); 
            boxElement.style.borderColor = "#000000"; 
            applyWordTransformation(); 
            boxElement.setAttribute('data-tiklama-sayisi', '3');
            
        } else if (tiklama === 3) {
            // 4. AŞAMA: Büyümeyi kapat, Kelimeyi tabloda bırak
            if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
            boxElement.classList.remove('current-active-red'); 
            boxElement.setAttribute('data-tiklama-sayisi', '4'); 
            if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();

        } else {
            // 5. AŞAMA: Manuel Tıklamada Sıfırla
            if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
            if (typeof resetBox === 'function') resetBox(boxElement); 
            boxElement.removeAttribute('data-tiklama-sayisi');
            boxElement.classList.remove('current-active-red', 'kok-turendi', 'coklu-kullanim'); 
            boxElement.style.setProperty("background-color", "", "important");
            if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();
            
            // Sıfırlamada tıklama olayını temizle ki karışıklık olmasın
            if (refEl && refEl.hasAttribute('onclick')) {
                refEl.removeAttribute('onclick');
            }
        }
    } else {
        // Zoom Kapalı Sistemi 
        if (window.innerWidth <= 1024) {
            // MOBİL HIZLI SİSTEM: İLK TIKLAMADA TÜRET, İKİNCİDE SİL
            if (tiklama === 0) {
                document.querySelectorAll('.glass-box').forEach(b => b.classList.remove('current-active-red'));
                boxElement.classList.add('current-active-red');
                if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
                boxElement.style.setProperty("background-color", "#bfffdf", "important"); 
                boxElement.style.borderColor = "#000000"; 
                applyWordTransformation(); 
                boxElement.setAttribute('data-tiklama-sayisi', '1');
            } else {
                if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
                if (typeof resetBox === 'function') resetBox(boxElement);
                boxElement.removeAttribute('data-tiklama-sayisi');
                boxElement.classList.remove('current-active-red', 'kok-turendi', 'coklu-kullanim'); 
                boxElement.style.setProperty("background-color", "", "important");
                if (refEl && refEl.hasAttribute('onclick')) refEl.removeAttribute('onclick');
                
                // Artı işaretinin ışığını da söndür
                const mobilePlus = document.getElementById('mobile-top-plus');
                if (mobilePlus) mobilePlus.classList.remove('plus-highlighted');
            }
        } else {
            // MASAÜSTÜ KADEMELİ SİSTEM
            if (tiklama === 0) {
                // 1. Tıklama: Kırmızı Vurgu
                document.querySelectorAll('.glass-box').forEach(b => b.classList.remove('current-active-red'));
                boxElement.classList.add('current-active-red');
                if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
                boxElement.setAttribute('data-tiklama-sayisi', '1');
            } else if (tiklama === 1) {
                // 2. Tıklama: Türet ve Yeşil Yap
                if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
                boxElement.style.setProperty("background-color", "#bfffdf", "important"); 
                boxElement.style.borderColor = "#000000"; 
                applyWordTransformation(); 
                boxElement.setAttribute('data-tiklama-sayisi', '2');
            } else {
                // 3. Tıklama ve sonrası: Kökü, dolguyu ve çerçeveyi tamamen sıfırla
                if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
                if (typeof resetBox === 'function') resetBox(boxElement);
                boxElement.removeAttribute('data-tiklama-sayisi');
                boxElement.classList.remove('current-active-red', 'kok-turendi', 'coklu-kullanim'); 
                boxElement.style.setProperty("background-color", "", "important");
                if (refEl && refEl.hasAttribute('onclick')) refEl.removeAttribute('onclick');
            }
        }
    }
}
function closeInlineMatrix(e, btnElement) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    SoundEngine.playClose();
    
    const boxElement = btnElement.closest('.glass-box');
    if (boxElement) {
        boxElement.classList.add('no-transition');
        boxElement.classList.remove('matrix-opened');
        boxElement.style.zIndex = "";
        
        const container = boxElement.querySelector('.conjugation-inline-container');
        if (container) {
            // ÇÖZÜM: 'none' yerine boş bırakıyoruz ki CSS dosyasındaki açma/kapama kurallarını ezmesin!
            container.style.display = ''; 
        }

        setTimeout(() => {
            boxElement.classList.remove('no-transition');
        }, 50);
    }
}

function applyToSpecificBox(boxElement) {
    const targetEl = boxElement.querySelector('.ar, .ar-small');
    if (!targetEl) return;
    const kalip = targetEl.getAttribute('data-original');

    clearOtherActiveBoxes(boxElement);

    if (boxElement.style.backgroundColor) {
        SoundEngine.playClose();
        
        // Kutu seçimi iptal edildiğinde de varsayılan kalıbı (فعل) renkli bırak
        targetEl.innerHTML = ColorEngine.colorize(kalip, ['ف', 'ع', 'ل']); 
        
        boxElement.style.backgroundColor = "";
        boxElement.style.borderColor = "";
        boxElement.style.boxShadow = ""; 
        lastOriginalWord = kalip;
        
        const triggerBtn = boxElement.querySelector('.easter-egg-trigger');
        if (triggerBtn) {
            triggerBtn.remove();
        }
        
        // YENİ: İsim kutusuna tekrar basılıp iptal edildiğinde tepedeki emojiyi sil
        const refSpan = boxElement.querySelector('.ref');
        if (refSpan) {
            const rId = refSpan.innerText.trim();
            document.querySelectorAll(`.easter-egg-emoji[data-ref="${rId}"]`).forEach(emoji => emoji.remove());
        }
        
        const plusBtn = document.querySelector('.fa-plus');
        if (plusBtn) plusBtn.classList.remove('plus-highlighted');
        
        if (currentRoot && currentRoot.length === 3) {
            highlightEasterEggBoxes(currentRoot);
        }
        return;
    }

    SoundEngine.playClick();
    const currentRootSafe = (typeof currentRoot !== 'undefined') ? currentRoot : "";
    let plainWord = (currentRootSafe.length === 3) ? applyRootToKalip(currentRootSafe, kalip) : kalip;
    
    // Her zaman renklendir: Kök girilmişse o kökü, girilmemişse 'فعل' harflerini baz al
    let activeRootArray = (currentRootSafe.length === 3) ? currentRootSafe.split("") : ['ف', 'ع', 'ل'];
    targetEl.innerHTML = ColorEngine.colorize(plainWord, activeRootArray);
    
    lastOriginalWord = plainWord;
    triggerAreaPulse(boxElement); 
    checkWordEasterEgg(boxElement);
}

// ==============================================================================
// 1. HAM YERLEŞTİRME VE SARF MOTORUNU (SarfEngine) ÇAĞIRMA
// ==============================================================================
function applyRootToKalip(root, kalip) {
    if (!root || root.length !== 3) return kalip;
    const r = root.split("");
    
    // Ham yerleştirme (Arakom fontuna uygun style dahil)
    let result = kalip;
    result = result.replace(/ف/g, "===F===");
    result = result.replace(/ع/g, "===A===");
    result = result.replace(/ل/g, "===L===");
    
    result = result.replace(/===F===/g, r[0]);
    result = result.replace(/===A===/g, r[1]);
    result = result.replace(/===L===/g, r[2]);
    
    // Bütün muazzam kuralları (Ecvef, Misal, Şedde vb.) SarfEngine üzerinden tek seferde uygula!
    if (typeof SarfEngine !== 'undefined' && SarfEngine.applyRules) {
        result = SarfEngine.applyRules(result, r);
    }
    
    return result;
}

function openConjugationPopup(kok, babNo, tip, anaVezin) {
    if (!lastClickedBoxTextSpan) return;
    const boxElement = lastClickedBoxTextSpan.closest('.glass-box');
    if (!boxElement) return;
    if (!boxElement.classList.contains('kok-turendi')) return; 

    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    if (!kok || kok.length !== 3) kok = "فعل"; 

    const numBab = Number(babNo); 
    const refEl = boxElement.querySelector('.ref');
    const refId = refEl ? parseInt(refEl.innerText) : 0;

    document.querySelectorAll('.glass-box').forEach(box => { box.style.zIndex = "1"; });
    document.querySelectorAll('.glass-box.matrix-opened').forEach(openBox => {
        if (openBox !== boxElement) {
            const openCloseBtn = openBox.querySelector('.matrix-close-btn');
            if (openCloseBtn) closeInlineMatrix(null, openCloseBtn);
        }
    });

    boxElement.classList.add('no-transition'); 
    boxElement.classList.remove("pulse-highlight");
    boxElement.style.transform = "";
    void boxElement.offsetWidth; 
    setTimeout(() => { if (boxElement) boxElement.classList.remove('no-transition'); }, 50);

    let inlineContainer = boxElement.querySelector('.conjugation-inline-container');
    if (!inlineContainer) {
        inlineContainer = document.createElement('div');
        inlineContainer.className = 'conjugation-inline-container';
        boxElement.appendChild(inlineContainer);
    }

    if (!anaVezin) anaVezin = boxElement.getAttribute('data-original') || '';

    
// ===============================================================
    // EVRENSEL MOTORU (VerbGenerator) KULLANARAK ÇEKİMLERİ ÜRET
    // ===============================================================
    let activeSuffix = boxElement.getAttribute('data-active-suffix'); 
    let kelimeListesi = VerbGenerator.generateVerbList(kok, numBab, tip, anaVezin, refId, activeSuffix);
    
    if (kelimeListesi.length === 0) return;
    
    let muzariListesi = [];
    const isColorActive = kok && kok.length === 3;
    const isVerb = boxElement.classList.contains('fiil-box');
    const pastelColors = ['#fce4ec', '#e3f2fd', '#e8f5e9', '#fff3e0', '#f3e5f5', '#e0f7fa', '#fbe9e7', '#f1f8e9', '#fffde7', '#eceff1'];

    if (isVerb && tip === 'mazi') {
        let muKalip = "يَفْعُلُ"; 
        if (typeof babVezinleri !== 'undefined' && babVezinleri[numBab]) muKalip = babVezinleri[numBab].muzari || "يَفْعُلُ";
        
        let targetMuzariRef = refId + 1;
        if (refId === 1) {
            let poss = [2, 4, 6];
            for (let p of poss) {
                if (typeof wordEasterEggs !== 'undefined' && wordEasterEggs[kok] && wordEasterEggs[kok][p]) { 
                    targetMuzariRef = p; 
                    break; 
                }
            }
        } else if (refId === 8) targetMuzariRef = 9;
        else if (refId === 11) targetMuzariRef = 12;
        else if (refId === 14) targetMuzariRef = 15;
        
        muzariListesi = VerbGenerator.generateVerbList(kok, numBab, 'muzari', muKalip, targetMuzariRef, activeSuffix);
        if (muzariListesi.length === 0) muzariListesi = kelimeListesi;
    }







    function generateCellContent(w, tip, numBab, tableType, isColorActive, kok, wordIndex) {
        if (!w) return "";
        let clean = (typeof w === 'object' ? w.ar : w).replace(/[\u200C\u200D\uFEFF]/g, ''); 
        let prefix = "";
        let coreWord = clean;

        if (tableType === 'ma') prefix = "مَا";
        else if (tableType === 'la') prefix = "لَا";
        else if (tableType === 'lam') {
            prefix = "لَمْ";
            const duals = [1, 4, 7, 10];
            const pluralMasc = [2, 8];
            const singFem = [9];
            const pluralFem = [5, 11];

            if (duals.includes(wordIndex)) coreWord = clean.replace(/نِ?$/, ''); 
            else if (pluralMasc.includes(wordIndex)) coreWord = clean.replace(/نَ?$/, 'ا'); 
            else if (singFem.includes(wordIndex)) coreWord = clean.replace(/نَ?$/, ''); 
            else if (pluralFem.includes(wordIndex)) coreWord = clean; 
            else {
                if (/[\u0651]/.test(clean.slice(-2))) {
                    coreWord = clean.replace(/[\u064B-\u0652]+$/, '\u0651\u064E'); // Kusursuz لَمْ يَضُرَّ
                }
                else if (/ُ$/.test(clean)) {
                    coreWord = clean.replace(/ُ$/, 'ْ');
                    coreWord = coreWord.replace(/ُ?و([\u0621-\u064A])ْ$/, 'ُ$1ْ'); 
                    coreWord = coreWord.replace(/ِ?ي([\u0621-\u064A])ْ$/, 'ِ$1ْ'); 
                    coreWord = coreWord.replace(/َ?ا([\u0621-\u064A])ْ$/, 'َ$1ْ'); 
                }
                else if (/ِي$/.test(clean)) coreWord = clean.replace(/ِي$/, 'ِ');
                else if (/ُو$/.test(clean)) coreWord = clean.replace(/ُو$/, 'ُ');
                else if (/َى$/.test(clean)) coreWord = clean.replace(/َى$/, 'َ');
                else if (/ا$/.test(clean)) coreWord = clean.replace(/ا$/, 'َ');
            }
        }
        else if (tableType === 'nehiy') {
            prefix = "لَا";
            
            // 1. Görünmez karakterleri, boşlukları ve HTML kalıntılarını temizler
            let cleanWord = clean.replace(/^[\s\u200B-\u200D\uFEFF]+/, ''); 
            
            // 2. İŞTE SİHİRLİ SATIR: Emir fiilin başındaki Elif/Hemze harfini ve üzerindeki TÜM harekeleri (Görünmez \u0654 Üst Hemzeler dahil) KESİNLİKLE yok eder!
            let strippedWord = cleanWord.replace(/^[اأإآء][\u064B-\u065F]*/, '');
            
            // 3. İf'al grubu (7,8,9. Bab) için ötreli (تُ), diğerleri için üstünlü (تَ) harfi ekler
            let taPrefix = (numBab === 7 || numBab === 8 || numBab === 9) ? "تُ" : "تَ";
            coreWord = taPrefix + strippedWord;
            
            // 4. İSTİSNA: Emir kipinde düşen hemzeyi, Nehiy tablosu oluşturulurken geri getiriyoruz
            if (kok === "أخذ" && coreWord.startsWith("تَخُذ")) {
                coreWord = coreWord.replace("تَخُذ", "تَأْخُذ");
            } else if (kok === "أكل" && coreWord.startsWith("تَكُل")) {
                coreWord = coreWord.replace("تَكُل", "تَأْكُل");
            } else if (kok === "أمر" && coreWord.startsWith("تَمُر")) {
                coreWord = coreWord.replace("تَمُر", "تَأْمُر");
            }
        }

        let coloredCore = (isColorActive && !coreWord.includes('<')) ? ColorEngine.colorize(coreWord, kok.split("")) : coreWord;
        
        if (prefix) return `<span style="color: #64748b; font-weight: bold; margin-left: 6px; display: inline-block; direction: rtl;">${prefix}</span><span style="display: inline-block; direction: rtl;">${coloredCore}</span>`;
        return `<span style="display: inline-block; direction: rtl;">${coloredCore}</span>`;
    }

    let html = `
        <div class="popup-drag-bar" style="position: absolute; top: 0; left: 0; width: 100%; height: 35px; background: #f1f5f9; border-top-left-radius: 13px; border-top-right-radius: 13px; border-bottom: 2px solid #e2e8f0; display: flex; justify-content: center; align-items: center; cursor: grab; z-index: 10; touch-action: none;">
            <div style="width: 50px; height: 6px; background: #cbd5e1; border-radius: 10px; pointer-events: none;"></div>
        </div>
        <div class="matrix-close-btn" style="z-index: 11; top: 2px;" onclick="closeInlineMatrix(event, this)">✕</div>
    `;

    html += `<div class="popup-scroll-wrapper" style="max-height: 60vh; overflow-y: auto; overflow-x: hidden; margin-top: 35px; padding: 0; box-sizing: border-box;">`;
    html += `<table class="conjugation-table" style="margin: 0; width: 100%; border-collapse: collapse;">`;

    let totalItems = kelimeListesi.length;

    if (isVerb) {
        if (typeof kelimeListesi[0] === 'object') {
            html += `<thead style="position: sticky; top: -1px; z-index: 5;"><tr><th style="background-color: #2B88D9 !important; text-align: center;">Kullanım Varyasyonları</th></tr></thead><tbody>`;
            for (let i = 0; i < totalItems; i++) {
                let bgColor = pastelColors[i % 10]; 
                let item = kelimeListesi[i];
                let wAr = item.ar || ''; let wTr = item.tr || ''; let ornek = item.ornek; 
                if (isColorActive && wAr && !wAr.includes('<')) wAr = ColorEngine.colorize(wAr, kok.split(""));
                let ornekHtml = ornek ? `<div class="ornek-box"><div style="font-family:'Arakom', sans-serif; font-size:20px; color:#000; text-align: center;">${ornek.ar}</div><div style="font-size:15px; color:#333; margin-top:6px; text-align: center; direction: ltr;">${ornek.tr}</div></div>` : '';
                let trHtml = wTr ? `<span class="siga-tr-text" style="display: block; margin-top: 15px; font-size: 16px; color: #555; direction: ltr;">${wTr}</span>` : '';
                html += `<tr><td style="background-color: ${bgColor} !important; padding: 25px 15px;"><span class="siga-text">${wAr}</span>${trHtml}${ornekHtml}</td></tr>`;
            }
        } 
        else {
            let tablesToRender = [];
            
            if (tip === 'mazi') tablesToRender = ['olumlu', 'ma', 'lam', 'la'];
            else if (tip === 'muzari') tablesToRender = ['olumlu', 'la'];
            else if (tip === 'emir') tablesToRender = ['olumlu', 'nehiy'];

            tablesToRender.forEach((tableType, tIndex) => {
                let theadText = ""; let headBg = ""; let subBg = ""; let subColor = "";
                
                if (tableType === 'olumlu') {
                    theadText = tip === 'mazi' ? "Malum Mazi (Olumlu)" : (tip === 'muzari' ? "Malum Muzari (Olumlu)" : "Emir (Olumlu)");
                    headBg = "#2B88D9"; subBg = "#f1f5f9"; subColor = "#333";
                } else if (tableType === 'ma') {
                    theadText = "Menfi Mazi (مَا)";
                    headBg = "#e74c3c"; subBg = "#fcf1f1"; subColor = "#a94442";
                } else if (tableType === 'la') {
                    theadText = tip === 'mazi' ? "İnkari Mazi / Dua (لَا)" : "Menfi Muzari (Olumsuz)";
                    headBg = tip === 'mazi' ? "#9b59b6" : "#e74c3c"; 
                    subBg = tip === 'mazi' ? "#f5eef8" : "#fcf1f1";
                    subColor = tip === 'mazi' ? "#7d3c98" : "#a94442";
                } else if (tableType === 'lam') {
                    theadText = "Cehd-i Mutlak (لَمْ / Geçmiş Anlamı)";
                    headBg = "#d35400"; 
                    subBg = "#fdf2e9";
                    subColor = "#ba4a00";
                } else if (tableType === 'nehiy') {
                    theadText = "Nehiy (Olumsuz Emir)";
                    headBg = "#e74c3c"; subBg = "#fcf1f1"; subColor = "#a94442";
                }
                
                if (tIndex > 0) {
                    html += `<tbody class="spacer-body"><tr class="spacer-row"><td colspan="3" style="height: 35px; background: transparent !important; border: none !important;"></td></tr></tbody>`;
                }

                html += `<thead style="z-index: ${10 + tIndex}; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <tr><th colspan="3" style="background-color: ${headBg} !important; color: white; padding: 8px; font-size: 15px; border-top: 2px solid #cbd5e1; border-radius: 8px 8px 0 0;">${theadText}</th></tr>
                            <tr style="background-color: ${subBg};"><th style="padding: 4px; font-size: 13px; color: ${subColor}; border-bottom: 2px solid #cbd5e1;">Müfred</th><th style="padding: 4px; font-size: 13px; color: ${subColor}; border-bottom: 2px solid #cbd5e1;">Tesniye</th><th style="padding: 4px; font-size: 13px; color: ${subColor}; border-bottom: 2px solid #cbd5e1;">Cemi</th></tr>
                         </thead><tbody style="border-bottom: 4px solid #cbd5e1;">`;
                         
                for (let i = 0; i < totalItems; i += 3) {
                    let rowIndex = Math.floor(i / 3);
                    let bgColor = '#ffffff';
                    
                    // YENİ EKLENEN: 5. Satır (Ben/Biz) her zaman Nötr/Gri olsun!
                    if (rowIndex === 4) {
                        bgColor = '#f8fafc';
                    } else if (tableType === 'olumlu') {
                        bgColor = (rowIndex % 2 === 0) ? '#e3f2fd' : '#fce4ec';
                    } else if (tableType === 'ma' || tableType === 'nehiy' || (tableType === 'la' && tip === 'muzari')) {
                        bgColor = (rowIndex % 2 === 0) ? '#ffebee' : '#fbe9e7';
                    } else if (tableType === 'la' && tip === 'mazi') {
                        bgColor = (rowIndex % 2 === 0) ? '#f4ecf7' : '#f5eef8';
                    } else if (tableType === 'lam') {
                        bgColor = (rowIndex % 2 === 0) ? '#fdf2e9' : '#fae5d3';
                    }
                    
                    let currentList = (tableType === 'lam') ? muzariListesi : kelimeListesi;
                    
                    let w1 = generateCellContent(currentList[i], tip, numBab, tableType, isColorActive, kok, i);
                    let w2 = generateCellContent(currentList[i+1], tip, numBab, tableType, isColorActive, kok, i+1);
                    let w3 = generateCellContent(currentList[i+2], tip, numBab, tableType, isColorActive, kok, i+2);
                    
                    html += `<tr>
                                <td style="background-color: ${bgColor} !important; padding: 10px 5px;"><div class="siga-text" style="display: flex; justify-content: center; align-items: center;">${w1}</div></td>
                                <td style="background-color: ${bgColor} !important; padding: 10px 5px;"><div class="siga-text" style="display: flex; justify-content: center; align-items: center;">${w2}</div></td>
                                <td style="background-color: ${bgColor} !important; padding: 10px 5px;"><div class="siga-text" style="display: flex; justify-content: center; align-items: center;">${w3}</div></td>
                             </tr>`;
                }
                html += `</tbody>`;
            });
        }
    } else {
        html += `<thead style="position: sticky; top: -1px; z-index: 5;"><tr><th style="background-color: #2B88D9 !important; text-align: center;">Kullanım Varyasyonları</th></tr></thead><tbody>`;
        for (let i = 0; i < totalItems; i++) {
            let bgColor = pastelColors[i % 10]; let item = kelimeListesi[i];
            let wAr = typeof item === 'object' ? (item.ar || '') : (item || '');
            let wTr = typeof item === 'object' ? (item.tr || '') : '';
            let ornek = item.ornek; 
            if (isColorActive && wAr && !wAr.includes('<')) wAr = ColorEngine.colorize(wAr, kok.split(""));
            let ornekHtml = ornek ? `<div class="ornek-box"><div style="font-family:'Arakom', sans-serif; font-size:20px; color:#000; text-align: center;">${ornek.ar}</div><div style="font-size:15px; color:#333; margin-top:6px; text-align: center; direction: ltr;">${ornek.tr}</div></div>` : '';
            let trHtml = wTr ? `<span class="siga-tr-text" style="display: block; margin-top: 15px; font-size: 16px; color: #555; direction: ltr;">${wTr}</span>` : '';
            html += `<tr><td style="background-color: ${bgColor} !important; padding: 25px 15px;"><span class="siga-text">${wAr}</span>${trHtml}${ornekHtml}</td></tr>`;
        }
    }

    html += `</tbody></table></div>`;
    inlineContainer.innerHTML = html;
    inlineContainer.style.overflowY = 'hidden'; 
    inlineContainer.style.paddingTop = '15px'; 

    const popupWidth = 420;  const popupHeight = 410; 
    const boxWidth = boxElement.offsetWidth; const rect = boxElement.getBoundingClientRect();
    let targetTop = (window.innerHeight / 2) - (popupHeight / 2) - rect.top;
    let targetLeft = isVerb ? -popupWidth - 40 : boxWidth + 20;

    let globalLeft = rect.left + targetLeft; let globalRight = globalLeft + popupWidth;
    let globalTop = rect.top + targetTop; let globalBottom = globalTop + popupHeight;

    if (globalLeft < 10) targetLeft += (10 - globalLeft); 
    if (globalRight > window.innerWidth - 10) targetLeft -= (globalRight - (window.innerWidth - 10)); 
    if (globalTop < 10) targetTop += (10 - globalTop); 
    if (globalBottom > window.innerHeight - 10) targetTop -= (globalBottom - (window.innerHeight - 10)); 

    inlineContainer.style.left = `${targetLeft}px`; inlineContainer.style.top = `${targetTop}px`;
    inlineContainer.style.right = 'auto'; inlineContainer.style.display = 'block'; 
    inlineContainer.onmousedown = function(e) { e.stopPropagation(); }; inlineContainer.onclick = function(e) { e.stopPropagation(); };
    inlineContainer.ontouchstart = function(e) { e.stopPropagation(); }; inlineContainer.ontouchmove = function(e) { e.stopPropagation(); }; 
    inlineContainer.ontouchend = function(e) { e.stopPropagation(); };  
    
    const expandBtn = document.createElement('div'); expandBtn.className = 'matrix-expand-btn';
    expandBtn.title = 'Tam Ekran'; expandBtn.innerHTML = '<i class="fas fa-expand"></i>';
    expandBtn.style.zIndex = '11'; expandBtn.style.top = '2px';
    expandBtn.onclick = function(event) { event.stopPropagation(); openMatrixFullscreen(event, this); };
    inlineContainer.appendChild(expandBtn);
    
    const dragBar = inlineContainer.querySelector('.popup-drag-bar');
    let isDraggingPopup = false; let pStartX, pStartY, pInitialLeft, pInitialTop;
    const onPopupDragStart = (e) => {
        e.stopPropagation(); isDraggingPopup = true; dragBar.style.cursor = 'grabbing';
        pStartX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        pStartY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        pInitialLeft = inlineContainer.offsetLeft; pInitialTop = inlineContainer.offsetTop;
        inlineContainer.style.right = 'auto'; 
        document.addEventListener('mousemove', onPopupDragMove); document.addEventListener('mouseup', onPopupDragEnd);
        document.addEventListener('touchmove', onPopupDragMove, { passive: false }); document.addEventListener('touchend', onPopupDragEnd);
    };
    const onPopupDragMove = (e) => {
        if (!isDraggingPopup) return; e.preventDefault(); e.stopPropagation(); 
        let x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX; let y = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        inlineContainer.style.left = (pInitialLeft + (x - pStartX)) + 'px'; inlineContainer.style.top = (pInitialTop + (y - pStartY)) + 'px';
    };
    const onPopupDragEnd = (e) => {
        if (e) e.stopPropagation(); isDraggingPopup = false; dragBar.style.cursor = 'grab';
        document.removeEventListener('mousemove', onPopupDragMove); document.removeEventListener('mouseup', onPopupDragEnd);
        document.removeEventListener('touchmove', onPopupDragMove); document.removeEventListener('touchend', onPopupDragEnd);
    };
    dragBar.addEventListener('mousedown', onPopupDragStart); dragBar.addEventListener('touchstart', onPopupDragStart, { passive: false });
    boxElement.style.zIndex = "999999"; boxElement.classList.add('matrix-opened');
}

// Global tıklama (kapatma) event listener'ı aynen kalıyor
document.addEventListener('click', function(e) {
    const conjugationContainer = e.target.closest('.conjugation-inline-container');
    const glassBox = e.target.closest('.glass-box');
    
    const fullscreenOverlay = e.target.closest('#matrix-fullscreen-overlay');

    if (!conjugationContainer && !glassBox && !fullscreenOverlay) {
        const openedBoxes = document.querySelectorAll('.glass-box.matrix-opened');
        if (openedBoxes.length > 0) {
            openedBoxes.forEach(box => {
                const closeBtn = box.querySelector('.matrix-close-btn');
                if (closeBtn) closeInlineMatrix(e, closeBtn);
            });
            e.preventDefault();
            e.stopPropagation();
        }
    }
}, true);

function closeConjugationModal() {
    SoundEngine.playClose();
    document.getElementById('conjugation-overlay').style.display = 'none';
    
    document.querySelectorAll('.glass-box').forEach(box => {
        if (box.style.backgroundColor) { 
            box.setAttribute('data-modal-closed', 'true');
        }
    });
}

function toggleKB(show) {
    const overlay = document.getElementById('keyboard-overlay');
    const tempDisplay = document.getElementById('temp-root-display');
    if (show) {
        currentRoot = ""; 
        if (tempDisplay) tempDisplay.innerText = "";
    }
    if (overlay) overlay.style.display = show ? 'flex' : 'none';
}



// --- ANA KLAVYEYİ KAPATMA VE SİLME ---
function closeKeyboard() {
    if (typeof currentRoot !== 'undefined' && currentRoot.length > 0) {
        currentRoot = "";
        const tempDisp = document.getElementById('temp-root-display');
        if (tempDisp) tempDisp.innerText = "";
        
        if (typeof updateTempDisplay === 'function') updateTempDisplay();
        if (typeof highlightEasterEggBoxes === 'function') highlightEasterEggBoxes(""); 
        if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
        if (typeof toggleRootHint === 'function') toggleRootHint(true);
    } else {
        if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
        if (typeof toggleKB === 'function') {
            toggleKB(false);
        } else {
            const overlay = document.getElementById('keyboard-overlay');
            if (overlay) overlay.style.display = 'none';
        }
        
        // EKSİKTİ: Ana klavyeyi hiçbir şey yazmadan kapatırsa da ışığı geri yak!
        if (typeof toggleRootHint === 'function') toggleRootHint(true);
    }
}

function addLetter(char) {
    if (currentRoot.length < 3) {
        toggleRootHint(false);
        SoundEngine.playClick(); 
        currentRoot += char;
        updateTempDisplay();
        highlightKey(char);
        
        updateMainKeyboardPredictions(); // YENİ: Harfe basıldıkça öneri getirir
        
        if (currentRoot.length === 3) {
            setTimeout(() => { confirmRoot(); }, 300);
        }
    }
}

function handleBackspace() {
    SoundEngine.playClose(); 
    if (currentRoot.length > 0) {
        currentRoot = currentRoot.slice(0, -1);
        updateTempDisplay();
        
        updateMainKeyboardPredictions(); // YENİ: Harf silindikçe önerileri günceller
    }
}

// Ana klavye her açıldığında önceki tahminleri temizler
const originalOpenKeyboard = window.openKeyboard;
window.openKeyboard = function() {
    if (typeof originalOpenKeyboard === "function") {
        originalOpenKeyboard();
    }
    updateMainKeyboardPredictions();
}

function updateTempDisplay() {
    const display = document.getElementById('temp-root-display');
    if (display) {
        display.innerText = currentRoot.trim(); 
        display.style.direction = "rtl";
    }
}

function highlightKey(char) {
    const keys = document.querySelectorAll('.key');
    keys.forEach(k => {
        if (k.innerText.trim() === char) {
            k.classList.add('active-key');
            setTimeout(() => k.classList.remove('active-key'), 150);
        }
    });
}

function confirmRoot() {
    if (currentRoot.length === 3) {
        SoundEngine.playReset();
        const rootTextSpan = document.getElementById('root-text-display');
        if (rootTextSpan) {
            rootTextSpan.innerText = currentRoot;
        }
        toggleKB(false);
        currentEggIndex = 0;
        
        // KESİN ÇÖZÜM: Klavyeden 3 harfli kök girilip onaylanınca vurguyu zorla kapat!
        if (typeof toggleRootHint === 'function') toggleRootHint(false);

        highlightEasterEggBoxes(currentRoot);
        if (typeof autoSpawnRootClone === 'function') autoSpawnRootClone();
        if (currentTabActive === 1) {
            setTab(0);
        }
    }
}

document.addEventListener('keydown', function(e) {
    const overlay = document.getElementById('keyboard-overlay');
    if (!overlay || overlay.style.display === 'none' || overlay.style.display === '') return;
    const key = e.key.toLocaleLowerCase('tr-TR');
    if (key === 'backspace') {
        handleBackspace();
        e.preventDefault();
    } else if (key === 'escape') {
        closeKeyboard();
    } else if (arabicKeyMap[key]) {
        SoundEngine.playClick(); 
        addLetter(arabicKeyMap[key]);
        e.preventDefault();
    }
});

function resetTableOnly(isSilent = false) {
    if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes(); // Ekran sıfırlanırken tüm zoomları ve overlayi kapatır
    if (typeof clearDraggableRoots === 'function') {
        clearDraggableRoots();
    }

    if (!isSilent) {
        if(typeof SoundEngine !== "undefined") SoundEngine.playReset(); 
    }
    isReadyVerbMode = false;
    targetStates = {};
    
    document.querySelectorAll('.glass-box').forEach(box => {
        // === İŞTE BURASI: Kutuya ait tüm renk, vurgu ve etiketleri tek kalemde temizler ===
        box.classList.remove(
            'hidden-mode', 
            'pulse-highlight', 
            'matrix-opened', 
            'current-active-red', 
            'sari-vurgu', 
            'kok-turendi' // Kök türedi etiketini de sıfırlar!
        );
        
        box.removeAttribute('data-modal-closed');
        box.removeAttribute('data-active-suffix');
        box.style.transform = "";
        box.style.backgroundColor = ""; 
        box.style.borderColor = "";
        box.style.background = "";
        box.style.zIndex = "";
        box.style.boxShadow = ""; 
        if (box.hasAttribute('data-tiklama-sayisi')) box.setAttribute('data-tiklama-sayisi', '0');

        const el = box.querySelector('.ar, .ar-small');
        if (el) {
            el.style.visibility = 'visible';
            const original = el.getAttribute('data-original');
            if (original) {
                // --- YENİ: Sıfırlandığında da varsayılan kalıbı (فعل) renkli getir ---
                if (original !== "-") {
                    if (typeof ColorEngine !== 'undefined') {
                        el.innerHTML = ColorEngine.colorize(original, ['ف', 'ع', 'ل']);
                    } else {
                        el.innerText = original;
                    }
                } else {
                    el.innerText = original;
                }
                // --------------------------------------------------------------------
            }
        }
        const container = box.querySelector('.conjugation-inline-container');
        if (container) container.innerHTML = '';
    });
    
    const rootDisplay = document.getElementById('root-text-display');
    if (rootDisplay) {
        rootDisplay.innerText = "Kök Yaz";
    }
    currentRoot = "";
    lastClickedBoxTextSpan = null;
    lastOriginalWord = "";
    
    const plusBtn = document.querySelector('.fa-plus');
    if (plusBtn) plusBtn.classList.remove('plus-highlighted');

    const mobilePlus = document.getElementById('mobile-top-plus');
    if (mobilePlus) mobilePlus.classList.remove('plus-highlighted');

    if (typeof highlightEasterEggBoxes === 'function') highlightEasterEggBoxes(""); 
}

document.addEventListener('DOMContentLoaded', function() {
    const wrappers = document.querySelectorAll('.responsive-table-wrapper');

    wrappers.forEach(wrapper => {
        let isDown = false;
        let startX;
        let scrollLeft;

        const startDragging = (e) => {
            isDown = true;
            wrapper.classList.add('active');
            startX = (e.pageX || e.touches[0].pageX) - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
        };

        const stopDragging = () => {
            isDown = false;
            wrapper.classList.remove('active');
        };

        const move = (e) => {
            if (!isDown) return;
            e.preventDefault(); 
            const x = (e.pageX || e.touches[0].pageX) - wrapper.offsetLeft;
            const walk = (x - startX) * 1.5;
            wrapper.scrollLeft = scrollLeft - walk;
        };

        wrapper.addEventListener('mousedown', startDragging);
        wrapper.addEventListener('mouseleave', stopDragging);
        wrapper.addEventListener('mouseup', stopDragging);
        wrapper.addEventListener('mousemove', move);

        wrapper.addEventListener('touchstart', startDragging, { passive: true });
        wrapper.addEventListener('touchend', stopDragging, { passive: true });
        wrapper.addEventListener('touchmove', (e) => {
            if (isDown) {
                const x = e.touches[0].pageX - wrapper.offsetLeft;
                const walk = (x - startX) * 1.5;
                wrapper.scrollLeft = scrollLeft - walk;
            }
        }, { passive: true });
    });
});

// SAYFA BOŞLUĞUNA TIKLANINCA MENÜYÜ KAPATAN KISIM (GÜNCELLENDİ)
document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (e) => {
        const menu = document.getElementById("suffix-dropdown");
        if (menu && menu.style.display !== "none") {
            // Mobil butona tıklanma durumu da engellendi
            if (!menu.contains(e.target) && !e.target.closest('.fa-plus') && !e.target.closest('#mobile-top-plus')) {
                menu.style.display = "none";
            }
        }
    });
});

// ===============================================================
// 1. CANLI SARI VURGU MOTORU (SON HAREKE SİLİNME HATASI ÇÖZÜLDÜ)
// ===============================================================
function updateSuffixHighlights(currentBox) {
    const menu = document.getElementById("suffix-dropdown");
    if (!menu || menu.style.display === "none") return;

    const refEl = currentBox.querySelector('.ref');
    if (!refEl) return;
    
    const refId = parseInt(refEl.innerText);
    if (typeof currentRoot === 'undefined' || currentRoot.length !== 3) return;
    if (typeof wordEasterEggs === 'undefined' || !wordEasterEggs[currentRoot]) return;
    
    const eggObj = wordEasterEggs[currentRoot][refId];
    if (!eggObj) return;

    const availableSuffixes = Object.keys(eggObj).filter(k => 
        k !== 'base' && k !== 'ornek' && k !== 'cekimi' && k !== 'suggestsPlus'
    );

    function standardize(t) {
        if (!t) return "";
        let original = t.replace(/[\u200B-\u200D\uFEFF]/g, '').trim(); 
        original = original.replace(/[یى]/g, 'ي');
        let pure = original.replace(/[\u0640\u064B-\u0652]/g, ''); 
        if (pure === 'ا') return 'ا';
        if (pure === 'ية' || pure === 'يه') return 'يَّة';
        if (pure === 'يات') return 'يَّات';
        if (pure === 'ي') return 'يّ';
        if (pure === 'يا') return 'يًّا'; 
        return original.replace(/\u064E\u0651/g, '\u0651\u064E');
    }

    let currentWordText = currentBox.querySelector('.ar, .ar-small').innerText;
    let currentWord = currentWordText.replace(/[\u200B-\u200D\uFEFF\n\r]/g, '').trim();
    
    let baseWordAr = eggObj.base ? eggObj.base.arText : "";
    let isBase = false;
    if (baseWordAr) {
        if (standardize(currentWord) === standardize(baseWordAr)) {
            isBase = true;
        }
    }

    const possibleSuffixes = [
        'يَّتَانِ', 'يَّتَيْنِ', 'تَانِ', 'تَيْنِ', 'يَّانِ', 'يَّيْنِ', 
        'يُّونَ', 'يِّينَ', 'يَّات', 'يَّة', 'يًّا', 
        'انِ', 'يْنِ', 'ونَ', 'ينَ', 'ات', 'يّ', 'ة', 'ا'
    ];

    let existingSuffix = "";
    if (!isBase) {
        for (let ps of possibleSuffixes) {
            if (currentWord.endsWith(ps)) {
                existingSuffix = ps;
                break;
            }
        }
    }

    const targetMap = {
        'يَّة': ['يّ', 'ة'],
        'يَّات': ['يّ', 'ات'],
        'يًّا': ['يّ', 'ا'], 
        'يَّانِ': ['يّ', 'انِ'],
        'يَّيْنِ': ['يّ', 'يْنِ'],
        'يُّونَ': ['يّ', 'ونَ'],
        'يِّينَ': ['يّ', 'ينَ'],
        'تَانِ': ['ة', 'انِ'],
        'تَيْنِ': ['ة', 'يْنِ'],
        'يَّتَانِ': ['يّ', 'ة', 'انِ'],
        'يَّتَيْنِ': ['يّ', 'ة', 'يْنِ']
    };

    let fulfilledSuffixes = [existingSuffix];
    if (targetMap[existingSuffix]) {
        fulfilledSuffixes.push(...targetMap[existingSuffix]);
    }

    const remainingTargets = availableSuffixes.filter(k => !fulfilledSuffixes.includes(standardize(k)));

    const suffixBtns = menu.querySelectorAll('button');
    suffixBtns.forEach(btn => {
        btn.classList.remove('suggested-suffix');
        let btnText = standardize(btn.textContent); 
        let isMatch = false;

        if (fulfilledSuffixes.includes(btnText)) {
            isMatch = false; 
        } else {
            for (let key of remainingTargets) {
                let stdKey = standardize(key);
                if (stdKey === btnText) {
                    isMatch = true; break;
                } else if (targetMap[stdKey] && targetMap[stdKey].includes(btnText)) {
                    isMatch = true; break;
                }
            }
        }

        if (isMatch) btn.classList.add('suggested-suffix');
    });
}

// ===============================================================
// 2. MENÜYÜ AÇAN MOTOR (YENİDEN EKLENDİ)
// ===============================================================
function toggleSuffixMenu(e) {
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
    
    const menu = document.getElementById("suffix-dropdown");
    if (!menu) return;

    if (lastClickedBoxTextSpan) {
        const currentBox = lastClickedBoxTextSpan.closest('.glass-box');
        if (currentBox && (currentBox.classList.contains("fiil-box") || currentBox.classList.contains("is-verb"))) {
            if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
            currentBox.style.setProperty("border-color", "#FF3B30", "important");
            currentBox.style.setProperty("box-shadow", "0 0 10px #FF3B30", "important");
            setTimeout(() => {
                currentBox.style.borderColor = ""; 
                currentBox.style.boxShadow = "";
            }, 400);
            return; 
        }
    }

    const desktopPlus = document.querySelector('.fa-plus');
    const mobilePlus = document.getElementById('mobile-top-plus');
    if (desktopPlus) desktopPlus.classList.remove('plus-highlighted');
    if (mobilePlus) mobilePlus.classList.remove('plus-highlighted');
    
    if (menu.style.display === "flex" || menu.style.display === "grid") {
        menu.style.display = "none";
        return;
    }

    const rect = e.target.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY + 8}px`;
    let leftPos = rect.left + window.scrollX - 150; 
    if (leftPos < 10) leftPos = 10; 
    menu.style.left = `${leftPos}px`;
    menu.style.display = "grid"; 

    if (lastClickedBoxTextSpan) {
        const currentBox = lastClickedBoxTextSpan.closest('.glass-box');
        if (currentBox) updateSuffixHighlights(currentBox);
    }
}

// ===============================================================
// 3. EKLERİ UYGULAYAN MOTOR (GÜVENLİ VERSİYON)
// ===============================================================
function applySuffix(rawSuffix) {
    if (!lastClickedBoxTextSpan) {
        if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
        return; 
    }

    const currentBox = lastClickedBoxTextSpan.closest(".glass-box");
    if (currentBox && (currentBox.classList.contains("fiil-box") || currentBox.classList.contains("is-verb"))) {
        if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
        return; 
    }

    function standardize(t) {
        if (!t) return "";
        let original = t.replace(/[\u200B-\u200D\uFEFF]/g, '').trim(); 
        original = original.replace(/[یى]/g, 'ي');
        let pure = original.replace(/[\u0640\u064B-\u0652]/g, ''); 
        if (pure === 'ا') return 'ا';
        if (pure === 'ية' || pure === 'يه') return 'يَّة';
        if (pure === 'يات') return 'يَّات';
        if (pure === 'ي') return 'يّ';
        if (pure === 'يا') return 'يًّا'; 
        return original.replace(/\u064E\u0651/g, '\u0651\u064E');
    }

    let suffix = standardize(rawSuffix); 
    let currentWordText = lastClickedBoxTextSpan.innerText;
    let currentWord = currentWordText.replace(/[\u200B-\u200D\uFEFF\n\r]/g, '').trim();

    let baseWordAr = "";
    if (currentBox && typeof currentRoot !== 'undefined' && currentRoot.length === 3) {
        const refEl = currentBox.querySelector('.ref');
        if (refEl) {
            const refId = parseInt(refEl.innerText);
            if (typeof wordEasterEggs !== 'undefined' && wordEasterEggs[currentRoot] && wordEasterEggs[currentRoot][refId]) {
                // HATA BURADAYDI ÇÖZÜLDÜ: Eğer kelimenin base'i (yalın hali) yoksa çökmesini engelleyen güvenlik kontrolü eklendi.
                const eggObj = wordEasterEggs[currentRoot][refId];
                baseWordAr = (eggObj && eggObj.base) ? eggObj.base.arText : "";
            }
        }
    }

    let isBase = false;
    if (baseWordAr) {
        if (standardize(currentWord) === standardize(baseWordAr)) {
            isBase = true;
        }
    }

    const possibleSuffixes = [
        'يَّتَانِ', 'يَّتَيْنِ', 'تَانِ', 'تَيْنِ', 'يَّانِ', 'يَّيْنِ', 
        'يُّونَ', 'يِّينَ', 'يَّات', 'يَّة', 'يًّا', 
        'انِ', 'يْنِ', 'ونَ', 'ينَ', 'ات', 'يّ', 'ة', 'ا'
    ];

    let existingSuffix = "";
    if (!isBase) {
        for (let ps of possibleSuffixes) {
            if (currentWord.endsWith(ps)) {
                existingSuffix = ps;
                currentWord = currentWord.slice(0, -ps.length);
                break;
            }
        }
    }

    if (existingSuffix) {
        currentWord = currentWord.replace(/[\u064B-\u0650\u0652]$/, '');
    }

    // ===============================================================
    // MANTIKSAL KURALLAR
    // ===============================================================
    if (existingSuffix === 'ا') { }
    else if (existingSuffix === 'ة') {
        if (suffix === 'انِ') suffix = 'تَانِ'; 
        else if (suffix === 'يْنِ') suffix = 'تَيْنِ';
    }
    else if (existingSuffix === 'يّ') {
        if (suffix === 'ة') suffix = 'يَّة';
        else if (suffix === 'ات') suffix = 'يَّات';
        else if (suffix === 'انِ') suffix = 'يَّانِ';
        else if (suffix === 'يْنِ') suffix = 'يَّيْنِ';
        else if (suffix === 'ونَ') suffix = 'يُّونَ';
        else if (suffix === 'ينَ') suffix = 'يِّينَ';
        else if (suffix === 'ا') suffix = 'يًّا'; 
    }
    else if (existingSuffix === 'يَّة' || existingSuffix === 'يَّات') {
        if (suffix === 'انِ') suffix = 'يَّتَانِ';
        else if (suffix === 'يْنِ') suffix = 'يَّتَيْنِ';
        else if (suffix === 'ونَ') suffix = 'يُّونَ';
        else if (suffix === 'ينَ') suffix = 'يِّينَ';
        else if (suffix === 'ة') suffix = 'يَّة';
        else if (suffix === 'ات') suffix = 'يَّات';
        else if (suffix === 'يّ') suffix = 'يّ';
    }
    else if (['انِ', 'يْنِ', 'تَانِ', 'تَيْنِ', 'يَّانِ', 'يَّيْنِ', 'يَّتَانِ', 'يَّتَيْنِ'].includes(existingSuffix)) {
        if (suffix === 'انِ' || suffix === 'يْنِ') {
            if (existingSuffix.includes('يَّتَ')) suffix = suffix === 'انِ' ? 'يَّتَانِ' : 'يَّتَيْنِ';
            else if (existingSuffix.includes('يَّ')) suffix = suffix === 'انِ' ? 'يَّانِ' : 'يَّيْنِ';
            else if (existingSuffix.includes('تَ')) suffix = suffix === 'انِ' ? 'تَانِ' : 'تَيْنِ';
        } else if (suffix === 'ة') {
            if (existingSuffix.includes('يَّ')) suffix = existingSuffix.includes('انِ') ? 'يَّتَانِ' : 'يَّتَيْنِ';
            else suffix = existingSuffix.includes('انِ') ? 'تَانِ' : 'تَيْنِ';
        } else if (suffix === 'يّ') { 
            if (existingSuffix.includes('تَ')) suffix = existingSuffix.includes('انِ') ? 'يَّتَانِ' : 'يَّتَيْنِ';
            else suffix = existingSuffix.includes('انِ') ? 'يَّانِ' : 'يَّيْنِ';
        }
    }
    else if (['ونَ', 'ينَ', 'يُّونَ', 'يِّينَ'].includes(existingSuffix)) {
        if (suffix === 'ونَ' || suffix === 'ينَ') {
            if (existingSuffix.includes('يُّ') || existingSuffix.includes('يِّ')) {
                suffix = suffix === 'ونَ' ? 'يُّونَ' : 'يِّينَ';
            }
        } else if (suffix === 'يّ') {
            suffix = existingSuffix.includes('ونَ') ? 'يُّونَ' : 'يِّينَ';
        }
    }
    else if (existingSuffix === 'يًّا') { 
        if (suffix === 'ا') suffix = 'يًّا'; 
    }

    // ===============================================================
    // SON HAREKEYİ AYARLAMA
    // ===============================================================
    function setLastVowel(word, targetVowel) {
        const vowelRegex = /[\u064B-\u0650\u0652]$/; 
        if (vowelRegex.test(word)) word = word.replace(vowelRegex, ''); 
        return word + targetVowel; 
    }

    let vowelToSet = '';
    if (suffix === 'يْنِ') vowelToSet = 'َ'; 
    else if (suffix.startsWith('ي')) vowelToSet = 'ِ'; 
    else if (suffix.startsWith('ة') || suffix.startsWith('ات') || suffix.startsWith('انِ') || suffix.startsWith('تَ')) vowelToSet = 'َ'; 
    else if (suffix.startsWith('ونَ')) vowelToSet = 'ُ'; 
    else if (suffix === 'ا') {
        vowelToSet = 'ً'; 
        const pureWord = currentWord.replace(/[\u064B-\u0650\u0652]/g, '');
        if (pureWord.endsWith('ة') || pureWord.endsWith('اء') || pureWord.endsWith('ى') || pureWord.endsWith('ا')) suffix = ''; 
    }

    if (vowelToSet !== '') currentWord = setLastVowel(currentWord, vowelToSet);
    let updatedWord = currentWord + suffix;
    
    // ===============================================================
    // EKRAN GÜNCELLEME SİSTEMİ
    // ===============================================================
    let activeRootArray = (typeof currentRoot !== 'undefined' && currentRoot.length === 3) ? currentRoot.split("") : ['ف', 'ع', 'ل'];
    let coloredResult = ColorEngine.colorize(updatedWord, activeRootArray);
    
    lastClickedBoxTextSpan.innerHTML = coloredResult;

    const clone = document.getElementById('crisp-zoom-clone');
    if (clone) {
        const cloneTextEl = clone.querySelector('.ar, .ar-small');
        if (cloneTextEl) cloneTextEl.innerHTML = coloredResult;
    }
    
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();

    if (currentBox) {
        updateSuffixHighlights(currentBox);
    }

    // ===============================================================
    // JSON'DAKİ TAM KELİMEYİ BULMA VE KORUMA KALKANI
    // ===============================================================
    let dictSuffix = standardize(suffix);
    let actualJsonKey = dictSuffix; 
    let hasEasterEggInfo = false;

    if (currentBox && typeof currentRoot !== 'undefined' && currentRoot.length === 3) {
        const refEl = currentBox.querySelector('.ref');
        if (refEl) {
            const refId = parseInt(refEl.innerText);
            if (typeof wordEasterEggs !== 'undefined' && wordEasterEggs[currentRoot] && wordEasterEggs[currentRoot][refId]) {
                const eggObj = wordEasterEggs[currentRoot][refId];
                for (let k in eggObj) {
                    if (standardize(k) === dictSuffix) {
                        actualJsonKey = k; 
                        hasEasterEggInfo = true; 
                        break;
                    }
                }
            }
        }
    }

    if (hasEasterEggInfo && typeof checkWordEasterEgg === "function") {
        checkWordEasterEgg(currentBox, actualJsonKey);
        
        const menu = document.getElementById("suffix-dropdown");
        if (menu) menu.style.display = "none";
    }

    if (currentBox) {
        currentBox.style.setProperty("border-color", "#00FF00", "important");
        currentBox.style.setProperty("box-shadow", "0 0 10px #00FF00", "important");
        setTimeout(() => {
            currentBox.style.borderColor = ""; 
            currentBox.style.boxShadow = "";
        }, 1500);
    }
}

const originalResetTableOnly = window.resetTableOnly;
window.resetTableOnly = function() {
    if (typeof originalResetTableOnly === "function") {
        originalResetTableOnly();
    }
    toggleRootHint(true);
    lastClickedBoxTextSpan = null;
    lastOriginalWord = "";
    const menu = document.getElementById("suffix-dropdown");
    if (menu) menu.style.display = "none";

    document.querySelectorAll('.easter-egg-trigger').forEach(btn => btn.remove());
    
    // YENİ EKLENEN KOD: Sıfırlama yapıldığında tepede biriken tüm emojileri temizler
    document.querySelectorAll('.easter-egg-emoji').forEach(el => el.remove());

// ==================================================================
    // KESİN ÇÖZÜM 2: Tüm tablo temizlendiğinde bütün kutuların hafızası ve rozetleri silinir!
    // ==================================================================
    document.querySelectorAll('.glass-box').forEach(box => {
        box.removeAttribute('data-last-root');
        box.removeAttribute('data-last-emoji');
        box.removeAttribute('data-plus-animated'); // Animasyon hafızasını siler
        
        // YENİ: Tüm kutulardaki saydam + rozetlerini bulup ekrandan siler
        const hintBadge = box.querySelector('.plus-hint-badge');
        if (hintBadge) hintBadge.remove();
    });
};

const modalOverlays = [
    { id: "verb-overlay", closeFn: window.closeVerbModal },
    { id: "conjugation-overlay", closeFn: window.closeConjugationModal },
    { id: "keyboard-overlay", closeFn: window.closeKeyboard }
];

modalOverlays.forEach(modal => {
    const overlayEl = document.getElementById(modal.id);
    if (overlayEl) {
        overlayEl.addEventListener("click", function(event) {
            if (event.target === overlayEl) {
                if (typeof modal.closeFn === "function") {
                    modal.closeFn();
                } else {
                    overlayEl.style.display = "none";
                }
            }
        });
    }
});

document.querySelectorAll('.matrix-close-btn').forEach(btn => {
    btn.addEventListener('click', function(event) {
        event.stopPropagation(); 
        const currentBox = this.closest('.glass-box');
        if (currentBox) {
            currentBox.classList.remove('matrix-opened');
        }
    });
});

document.querySelectorAll('.glass-box').forEach(box => {
    if (!box.hasAttribute('data-original')) {
        const text = box.querySelector('.ar, .ar-small').innerText.trim();
        box.setAttribute('data-original', text);
    }
});


function checkWordEasterEgg(boxElement, incomingSuffix = null) {
    const desktopPlus = document.querySelector('.fa-plus');
    const mobilePlus = document.getElementById('mobile-top-plus');

    if (!boxElement || !currentRoot || currentRoot.length !== 3) return;
    if (!boxElement.classList.contains('kok-turendi')) return;

    const refEl = boxElement.querySelector('.ref');
    if (!refEl) return;
    const refId = parseInt(refEl.innerText);
    const isVerb = boxElement.classList.contains('fiil-box');

    // ===============================================================
    // 1. HAFIZA SİSTEMİ
    // ===============================================================
    if (incomingSuffix) {
        boxElement.setAttribute('data-active-suffix', incomingSuffix);
    }
    let activeSuffix = boxElement.getAttribute('data-active-suffix');

    if (typeof wordEasterEggs === 'undefined' || !wordEasterEggs[currentRoot] || !wordEasterEggs[currentRoot][refId]) {
        if (!isVerb) {
            boxElement.classList.remove('coklu-kullanim');
            refEl.removeAttribute('onclick');
        }
        return;
    }

    const eggObj = wordEasterEggs[currentRoot][refId];
    const textEl = boxElement.querySelector('.ar, .ar-small');

    // ===============================================================
    // 4. SES OLAYLARINI EZME SİSTEMİ
    // ===============================================================
    let searchKey = activeSuffix;
    if (activeSuffix === "يَّة" && (!eggObj["يَّة"]) && eggObj["ة"]) {
        searchKey = "ة";
    } else if (activeSuffix === "يَّات" && (!eggObj["يَّات"]) && eggObj["ات"]) {
        searchKey = "ات";
    }

    let activeKey = (searchKey && eggObj[searchKey]) ? searchKey : "base";
    let targetText = eggObj[activeKey] ? eggObj[activeKey].arText : null;
    
    if (targetText) {
        let wordCount = targetText.trim().split(/\s+/).length;
        if (wordCount === 1) {
            textEl.innerHTML = ColorEngine.colorize(targetText, currentRoot.split(""));
        }
    } else if (!searchKey) {
        let baseText = eggObj.base ? eggObj.base.arText : null;
        if (baseText && baseText.trim().split(/\s+/).length === 1) {
            textEl.innerHTML = ColorEngine.colorize(baseText, currentRoot.split(""));
        }
    }

    // ===============================================================
    // 5. DİNAMİK KIRMIZI BUTON VE ÖRNEK KONTROLÜ
    // ===============================================================
    let hasTableData = false;
    
    if (activeKey !== "base" && eggObj[activeKey] && eggObj[activeKey].cekimi && eggObj[activeKey].cekimi.length > 0) {
        hasTableData = true;
    } else if (activeKey === "base") {
        if ((eggObj.cekimi && eggObj.cekimi.length > 0) || (eggObj.base && eggObj.base.cekimi && eggObj.base.cekimi.length > 0)) {
            hasTableData = true;
        }
    }

    let selectedData = eggObj[activeKey];
    let data = selectedData ? { ...selectedData, ornek: eggObj.ornek || selectedData.ornek } : null;

    boxElement.classList.remove('coklu-kullanim', 'has-ornek');
    if (!isVerb) refEl.removeAttribute('onclick');

    if (hasTableData && !isVerb) {
        boxElement.classList.add('coklu-kullanim');
        refEl.setAttribute('onclick', `
            event.preventDefault(); 
            event.stopPropagation(); 
            const box = this.closest('.glass-box'); 
            lastClickedBoxTextSpan = box.querySelector('.ar, .ar-small'); 
            lastOriginalWord = box.getAttribute('data-original'); 
            openConjugationPopup('${currentRoot}', ${refId}, 'isim', '');
        `);
    }

    // ===============================================================
    // 6. GÖRSEL ANİMASYONLAR VE EMOJİLER
    // ===============================================================
    if (!activeSuffix && eggObj.suggestsPlus) {
        if (desktopPlus) desktopPlus.classList.add('plus-highlighted');
        if (mobilePlus) mobilePlus.classList.add('plus-highlighted');
        
        if (!boxElement.hasAttribute('data-plus-animated')) {
            if (typeof flyEmojiToPlus === "function") flyEmojiToPlus(boxElement);
            boxElement.setAttribute('data-plus-animated', 'true');
        }
        
        let hintBadge = boxElement.querySelector('.plus-hint-badge');
        if (!hintBadge) {
            hintBadge = document.createElement('div');
            hintBadge.className = 'plus-hint-badge';
            hintBadge.innerHTML = '+'; 
            hintBadge.style.fontWeight = 'bold'; 
            hintBadge.style.fontSize = '18px'; 
            boxElement.appendChild(hintBadge);
        }
    } else {
        if (desktopPlus) desktopPlus.classList.remove('plus-highlighted');
        if (mobilePlus) mobilePlus.classList.remove('plus-highlighted');
        
        let hintBadge = boxElement.querySelector('.plus-hint-badge');
        if (hintBadge) hintBadge.remove();
        
        boxElement.removeAttribute('data-plus-animated');
    }

    if (!data) return;

    boxElement.style.position = 'relative';

    // ==========================================================
    // KESİN ÇÖZÜM: AKILLI YÖN BULUCU VE TEK EMOJİ MOTORU
    // ==========================================================
    if (data.emoji) {
        let existingEmoji = boxElement.querySelector('.elegant-emoji');
        let rememberedRoot = boxElement.getAttribute('data-last-root');
        let rememberedEmoji = boxElement.getAttribute('data-last-emoji');

        if (rememberedRoot !== currentRoot || rememberedEmoji !== data.emoji) {
            if (existingEmoji) existingEmoji.remove();

            const emojiDiv = document.createElement('div');
            emojiDiv.setAttribute('data-ref', refId);
            emojiDiv.innerText = data.emoji;

            const zoomClone = document.getElementById('crisp-zoom-clone');

            // EĞER BÜYÜTME (ZOOM) AÇIKSA:
            if (zoomClone) {
                // 1. Orijinal kutudaki emojiyi görünmez yap (Çift emoji çıkmasını engeller)
                emojiDiv.className = 'elegant-emoji'; 
                emojiDiv.style.opacity = '0'; 

                // 2. Sadece Dev Klonun içine yeni bir emoji patlat
                const cloneEmoji = document.createElement('div');
                cloneEmoji.className = 'elegant-emoji pop-zoom-right'; 
                cloneEmoji.innerText = data.emoji;
                zoomClone.appendChild(cloneEmoji);
                
                cloneEmoji.addEventListener('animationend', (e) => {
                    e.target.style.display = 'none'; 
                    cloneEmoji.remove(); // Temizlik
                });
            } 
            // EĞER BÜYÜTME KAPALIYSA (NORMAL MOD):
            else {
                const boxRect = boxElement.getBoundingClientRect();
                const isTop = boxRect.top < 250; 
                const isLeft = (boxRect.left + boxRect.width / 2) < (window.innerWidth / 2); 

                let animClass = 'pop-up-right'; 
                if (isTop && isLeft) animClass = 'pop-down-right';
                else if (isTop && !isLeft) animClass = 'pop-down-left';
                else if (!isTop && isLeft) animClass = 'pop-up-right';
                else if (!isTop && !isLeft) animClass = 'pop-up-left';

                emojiDiv.className = `elegant-emoji ${animClass}`; 
                emojiDiv.addEventListener('animationend', (e) => {
                    e.target.style.display = 'none'; 
                });
            }

            // Orijinal kutunun hafızasını güncelle ve gizli emojiyi ekle (veri için gerekli)
            boxElement.appendChild(emojiDiv);
            boxElement.setAttribute('data-last-root', currentRoot);
            boxElement.setAttribute('data-last-emoji', data.emoji);
        } 
        else if (!existingEmoji) {
            const emojiDiv = document.createElement('div');
            emojiDiv.className = 'elegant-emoji'; 
            emojiDiv.style.display = 'none'; 
            emojiDiv.setAttribute('data-ref', refId);
            emojiDiv.innerText = data.emoji;
            boxElement.appendChild(emojiDiv);
        }
    }

    // ===============================================================
    // 7. BİLGİ BUTONU (!) KONTROLÜ
    // ===============================================================
    let wordCount = data.arText ? data.arText.trim().split(/\s+/).length : 0;
    
    if (data.arText && (wordCount > 1 || (data.trText && data.trText.length > 0) || data.ornek)) {
        let existingTrigger = boxElement.querySelector('.easter-egg-trigger');
        
        let combinedHtml = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 25px;">
                <div style="font-family: 'Arakom', sans-serif; font-size: 90px; color: #000; direction: rtl; line-height: 1.2;">${data.arText || ""}</div>
                <div style="font-family: 'Arakom', sans-serif; font-size: 55px; color: #FF3B30; direction: ltr; line-height: 1.2;">${data.trText || ""}</div>
            </div>
        `;
        
        if (data.ornek) {
            let ornekler = Array.isArray(data.ornek) ? data.ornek : [data.ornek];
            combinedHtml += `<div style="width: 100%; border-top: 2px dashed rgba(0,0,0,0.15); padding-top: 25px; display: flex; flex-direction: column; gap: 20px;">`;
            
            ornekler.forEach(orn => {
                combinedHtml += `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; background: #f8f9fa; padding: 25px 20px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                        <div style="font-family: 'Arakom', sans-serif; font-size: 55px; color: #000; direction: rtl; line-height: 1.4; text-align: center;">${orn.ar}</div>
                        <div style="font-family: 'Arakom', sans-serif; font-size: 30px; color: #475569; direction: ltr; line-height: 1.4; text-align: center;">${orn.tr}</div>
                    </div>
                `;
            });
            combinedHtml += `</div>`;
        }
        
        if (!existingTrigger) {
            const triggerBtn = document.createElement('div');
            triggerBtn.className = 'easter-egg-trigger';
            triggerBtn.innerHTML = '!'; 
            triggerBtn.title = 'Bilgiyi Gör';

            triggerBtn.onclick = function(e) {
                e.stopPropagation(); 
                showEasterEggOverlay(combinedHtml, "");
            };
            boxElement.appendChild(triggerBtn);
        } else {
            existingTrigger.onclick = function(e) {
                e.stopPropagation(); 
                showEasterEggOverlay(combinedHtml, "");
            };
        }
    } else {
        let existingTrigger = boxElement.querySelector('.easter-egg-trigger');
        if (existingTrigger) existingTrigger.remove();
    }
}

// ==================================================================
// FİİLLERİN VEYA ÇOKLU KULLANIM İSİMLERİN KALIP NUMARASINA TIKLAYINCA TABLO AÇMA
// ==================================================================
document.addEventListener('click', function(e) {
    const refEl = e.target.closest('.ref');
    if (refEl) {
        if (window.innerWidth <= 1024) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        const boxElement = refEl.closest('.glass-box');
        
        // ÇÖZÜM: Kutu yeşilse (kok-turendi) VE (fiil kutusuysa YADA coklu-kullanim ise) tablo aç!
        if (boxElement && boxElement.classList.contains('kok-turendi') && (boxElement.classList.contains('fiil-box') || boxElement.classList.contains('coklu-kullanim'))) {
            e.preventDefault();
            e.stopPropagation();

            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            
            const refId = parseInt(refEl.innerText);
            const mapping = typeof getBabAndType === 'function' ? getBabAndType(refId) : null;
            const kalip = boxElement.getAttribute('data-original');
            const currentRootSafe = (typeof currentRoot !== 'undefined') ? currentRoot : "";
            
            const textEl = boxElement.querySelector('.ar, .ar-small');
            lastClickedBoxTextSpan = textEl; 
            lastOriginalWord = kalip;

            let tip = 'isim'; 
            let babNo = 1;
            
            if (mapping) {
                if (boxElement.classList.contains('fiil-box')) {
                    tip = mapping.type;
                }
                babNo = mapping.babNo;
            }

            if (typeof babVezinleri !== 'undefined') {
                const vezinObj = babVezinleri[babNo];
                let anaVezin = (vezinObj && vezinObj[tip]) ? vezinObj[tip] : kalip;
                
                if (typeof openConjugationPopup === 'function') {
                    openConjugationPopup(currentRootSafe, babNo, tip, anaVezin);
                }
                
                document.querySelectorAll(`.easter-egg-emoji[data-ref="${refId}"]`).forEach(emoji => emoji.remove());
            }
        }
    }
}, true);


let currentPulseTimeout = null;

function triggerAreaPulse(boxElement) {
    if (!boxElement) return;
    if (currentPulseTimeout) clearTimeout(currentPulseTimeout);

    const isZoomEnabled = document.getElementById('zoomToggleCheckbox') ? document.getElementById('zoomToggleCheckbox').checked : false;
    if (!isZoomEnabled) return;

    currentPulseTimeout = setTimeout(() => {
        if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();

        const parentContainer = boxElement.closest('.container') || document.body;
        let localOverlay = parentContainer.querySelector('.zoom-overlay');
        if (!localOverlay) {
            localOverlay = document.createElement('div');
            localOverlay.className = 'zoom-overlay';
            const closeLocalOverlay = function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();
            };
            localOverlay.onclick = closeLocalOverlay;
            localOverlay.ontouchstart = closeLocalOverlay;
            parentContainer.appendChild(localOverlay);
        }
        localOverlay.classList.add('active');

        // 1. ASIL KALIBIN KLONU (Türememiş halde)
        const cloneBox = boxElement.cloneNode(true);
        cloneBox.id = 'crisp-zoom-clone';
        cloneBox.classList.add('crisp-zoom-clone'); // YENİ: Var olan .coklu-kullanim gibi sınıfları silmez, üzerine ekler!
        
        // KLONA DOKUNULDUĞUNDA AŞAMALARI İLERLETEN GÜÇ
        const advanceState = function(e) { 
            e.stopPropagation(); 
            e.preventDefault(); 
            if (typeof handleBoxClick === 'function') {
                handleBoxClick(boxElement); 
            }
        };
        cloneBox.onclick = advanceState;
        cloneBox.ontouchstart = advanceState;

        // Yıldız butonu için
        const trigger = cloneBox.querySelector('.easter-egg-trigger');
        if (trigger) {
            trigger.onclick = function(e) {
                e.stopPropagation();
                const origTrigger = boxElement.querySelector('.easter-egg-trigger');
                if (origTrigger) origTrigger.click();
                
            };
        }

        // =======================================================
        // YENİ: + (ARTİ) BUTONUNA BASILINCA İLERLEMEYİ DURDUR
        // =======================================================
        const plusBtn = cloneBox.querySelector('.fa-plus');
        if (plusBtn) {
            const handlePlus = function(e) {
                e.stopPropagation(); // Klonun türemesini (ilerlemesini) engeller
                e.preventDefault();
                if (typeof toggleSuffixMenu === 'function') {
                    toggleSuffixMenu(e); // Ek menüsünü dev klonun üzerinde açar!
                }
            };
            plusBtn.onclick = handlePlus;
            plusBtn.ontouchstart = handlePlus;
        }

        document.body.appendChild(cloneBox);

        // =======================================================
        // 2. KAHVERENGİ KÖK KUTUSU KLONU (Sadece kök varsa açılır)
        // =======================================================
        const currentRootSafe = (typeof currentRoot !== 'undefined') ? currentRoot : "";
        
        // Eğer seçili olan bir kök varsa (uzunluğu 3 harf ise) kahverengi kutuyu yarat!
        if (currentRootSafe.length === 3) {
            const rootClone = document.createElement('div');
            rootClone.id = 'crisp-root-clone';
            rootClone.className = 'crisp-root-clone';
            
            // YENİ: Akıllı kök formatlayıcıyı kullanarak "kendinden sonra birleşmeyen harf" sorununu çözer
            let displayRoot = (typeof formatArabicRoot === 'function') ? formatArabicRoot(currentRootSafe) : currentRootSafe;
            
            rootClone.innerHTML = `<span class="ar-root">${displayRoot}</span>`;
            document.body.appendChild(rootClone);
        }

    }, 10); 
}

function showEasterEggOverlay(arText, trText) {
    let overlay = document.getElementById('easter-egg-overlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'easter-egg-overlay';
        overlay.className = 'easter-egg-overlay';
        
        overlay.onclick = function(e) { 
            if(e.target === this) {
                this.style.display = 'none'; 
                SoundEngine.playClose(); 
            }
        };
        
        const content = document.createElement('div');
        content.className = 'easter-egg-content';

        const closeBtn = document.createElement('div');
        closeBtn.className = 'easter-egg-close-btn';
        closeBtn.innerText = '✕';
        closeBtn.onclick = function(e) {
            e.stopPropagation();
            overlay.style.display = 'none';
            SoundEngine.playClose();
        };
        
        const arDiv = document.createElement('div');
        arDiv.className = 'easter-egg-ar';
        
        const trDiv = document.createElement('div');
        trDiv.className = 'easter-egg-tr';
        
        content.appendChild(closeBtn);
        content.appendChild(arDiv);
        content.appendChild(trDiv);
        overlay.appendChild(content);
        document.body.appendChild(overlay);
    }
    
const arDiv = overlay.querySelector('.easter-egg-ar');
    const trDiv = overlay.querySelector('.easter-egg-tr');
    
    if (arText) { 
        arDiv.innerHTML = arText; // innerText yerine innerHTML yapıldı
        arDiv.style.display = 'block'; 
    } else { 
        arDiv.style.display = 'none'; 
    }
    
    if (trText) { 
        trDiv.innerHTML = trText; // innerText yerine innerHTML yapıldı
        trDiv.style.display = 'block'; 
    } else { 
        trDiv.style.display = 'none'; 
    }
    
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    overlay.style.display = 'flex';
}

function openMatrixFullscreen(e, btnElement) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    const boxElement = btnElement.closest('.glass-box');
    if (!boxElement) return;
    
    document.body.classList.add('matrix-active');
    
    let fullscreenOverlay = document.getElementById('matrix-fullscreen-overlay');
    if (!fullscreenOverlay) {
        fullscreenOverlay = document.createElement('div');
        fullscreenOverlay.id = 'matrix-fullscreen-overlay';
        fullscreenOverlay.className = 'matrix-fullscreen-overlay';
        
        const content = document.createElement('div');
        content.className = 'matrix-fullscreen-content';
        
        const closeBtn = document.createElement('div');
        closeBtn.className = 'matrix-fullscreen-close';
        closeBtn.innerText = '✕';
        closeBtn.addEventListener('click', closeMatrixFullscreen);
        
        content.appendChild(closeBtn);
        fullscreenOverlay.appendChild(content);
        document.body.appendChild(fullscreenOverlay);
        
        // FULLSCREEN ÖZEL ÖLÇEKLENDİRME CSS'İ
        const style = document.createElement('style');
        style.innerHTML = `
            .matrix-fullscreen-table th { font-size: 28px !important; padding: 18px !important; }
            .matrix-fullscreen-table td { padding: 4vh 1vw !important; }
            .matrix-fullscreen-table .siga-text { font-size: 60px !important; }
            .matrix-fullscreen-table .siga-text span { margin-left: 10px; }
            .matrix-fullscreen-table .ornek-box { margin-top: 40px; padding: 35px; border-radius: 20px; }
            .matrix-fullscreen-table .ornek-box div:first-child { font-size: 50px !important; line-height: 1.5; }
            .matrix-fullscreen-table .ornek-box div:last-child { font-size: 35px !important; margin-top: 20px; }
            .matrix-fullscreen-table .siga-tr-text { font-size: 35px !important; margin-top: 30px !important; }
            .matrix-fullscreen-table .spacer-row td { height: 60px !important; }
        `;
        document.head.appendChild(style);
    }
    
    const contentArea = fullscreenOverlay.querySelector('.matrix-fullscreen-content');
    const oldWrapper = contentArea.querySelector('.matrix-fullscreen-table-wrapper');
    if (oldWrapper) oldWrapper.remove();
    
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'matrix-fullscreen-table-wrapper';
    tableWrapper.style.width = '95%'; 
    tableWrapper.style.margin = '0 auto'; 
    tableWrapper.style.maxWidth = '1200px';
    tableWrapper.style.maxHeight = '85vh'; 
    tableWrapper.style.overflowY = 'auto'; 
    tableWrapper.style.overflowX = 'hidden'; 
    tableWrapper.style.borderRadius = '12px';
    tableWrapper.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    tableWrapper.style.backgroundColor = '#ffffff';

    // ========================================================
    // ORİJİNAL TABLOYU DİREKT KLONLA VE ÖLÇEKLENDİR!
    // ========================================================
    const originalTable = boxElement.querySelector('.conjugation-table');
    if (originalTable) {
        const table = document.createElement('table');
        table.className = 'conjugation-table matrix-fullscreen-table';
        table.style.margin = '0'; 
        table.style.height = 'auto'; 
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        
        // Küçük tablodaki HTML yapısını birebir içine yapıştırıyoruz.
        table.innerHTML = originalTable.innerHTML;
        tableWrapper.appendChild(table);
    }
    
    contentArea.appendChild(tableWrapper);
    fullscreenOverlay.style.display = 'flex';
}

function closeMatrixFullscreen(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
    
    // Kapatırken sayfayı serbest bırak (Scroll sorunu için)
    document.body.classList.remove('matrix-active'); 
    
    const fullscreenOverlay = document.getElementById('matrix-fullscreen-overlay');
    if (fullscreenOverlay) {
        fullscreenOverlay.style.display = 'none';
    }

    // YENİ: Tam ekran kapatıldığında arkadaki açık küçük popup'ı (tabloyu) da otomatik kapat
    document.querySelectorAll('.glass-box.matrix-opened').forEach(box => {
        const closeBtn = box.querySelector('.matrix-close-btn');
        if (closeBtn) closeInlineMatrix(null, closeBtn);
    });
}

// ==================================================================
// 1. SARI VURGU (Hedefleri Belirleme)
// ==================================================================
function highlightEasterEggBoxes(root) {
    document.querySelectorAll('.glass-box').forEach(b => {
        b.classList.remove('sari-vurgu', 'current-active-red');
    });

    if (!root || root.length !== 3 || !wordEasterEggs[root]) return;

    const refs = getSortedRefsForRoot(root);
    refs.forEach(refId => {
        const targetBox = Array.from(document.querySelectorAll('.glass-box')).find(b => {
            const refEl = b.querySelector('.ref');
            return refEl && parseInt(refEl.innerText.trim()) === refId;
        });
        if (targetBox) {
            targetBox.classList.add('sari-vurgu');
        }
    });
}

// ==============================================================================
// EVRENSEL ÇEKİM ÜRETİCİ (DRY PRENSİBİ - TÜM SİSTEMLER BURAYI KULLANIR)
// ==============================================================================
const VerbGenerator = {
    getDynamicAynHareke: function(kokArr, bNo, vezin, rId) {
        let h = "ُ"; 
        if ([2, 6, 7, 8, 9, 10, 11, 15].includes(bNo) || vezin.includes("يَفْعِلُ") || vezin.includes("يُفْعِلُ") || vezin.includes("يُفَعِّلُ") || vezin.includes("يُفَاعِلُ") || vezin.includes("يَنْفَعِلُ") || vezin.includes("يَفْتَعِلُ") || vezin.includes("يَسْتَفْعِلُ")) h = "ِ"; 
        else if ([3, 4, 12, 13, 14].includes(bNo) || vezin.includes("يَفْعَلُ") || vezin.includes("يَفْعَلُّ") || vezin.includes("يَتَفَعَّلُ") || vezin.includes("يَتَفَاعَلُ")) h = "َ"; 

        let foundInJson = false;
        if (typeof wordEasterEggs !== 'undefined' && wordEasterEggs[kokArr.join("")]) {
            let muzari = "";
            let data = wordEasterEggs[kokArr.join("")];
            let possibles = (rId === 1) ? [2, 4, 6] : (rId === 8 ? [9] : (rId === 11 ? [12] : (rId === 14 ? [15] : [rId, rId + 1, rId + 2, rId + 3, 2, 4]))); 
            for (let p of possibles) {
                if (data[p]) {
                    let txt = data[p].base ? data[p].base.arText : (data[p].arText || "");
                    if (txt && (txt.startsWith('يَ') || txt.startsWith('يُ') || txt.startsWith('يَتَ'))) { muzari = txt; break; }
                }
            }
            if (muzari) {
                let regex = new RegExp(kokArr[1] + "(?:[\\u0651])?([\\u064E\\u064F\\u0650])");
                let match = muzari.match(regex);
                if (match && match[1]) { h = match[1]; foundInJson = true; }
            }
        }
        if (!foundInJson && rId === 1) {
            let activeBoxes = document.querySelectorAll('.glass-box.kok-turendi');
            for (let box of activeBoxes) {
                let refSpan = box.querySelector('.ref');
                if (refSpan) {
                    let id = parseInt(refSpan.innerText);
                    if (id === 6) return "َ"; 
                    if (id === 4) return "ِ"; 
                    if (id === 2) return "ُ"; 
                }
            }
        }
        return h;
    },

    getIftialCore: function(kokArr, aynHareke) {
        let r1 = kokArr[0], r2 = kokArr[1], r3 = kokArr[2];
        let i_r1 = r1 + "ْ";
        let i_t = "تَ";

        if (r1 === 'و' || r1 === 'ي' || r1 === 'ث' || r1 === 'ت') {
            i_r1 = ""; i_t = "تَّ";
        } else if (['ص', 'ض', 'ط', 'ظ'].includes(r1)) {
            if (r1 === 'ط') { i_r1 = ""; i_t = "طَّ"; }
            else { i_t = "طَ"; }
        } else if (['د', 'ذ', 'ز'].includes(r1)) {
            if (r1 === 'د' || r1 === 'ذ') { i_r1 = ""; i_t = "دَّ"; }
            else { i_t = "دَ"; } 
        }
        return i_r1 + i_t + r2 + aynHareke + r3;
    },

    generateVerbList: function(kok, babNo, tip, anaVezin, refId, activeSuffix = null) {
        let kelimeListesi = [];
        let ozelCekimBulundu = false;
        
        if (typeof wordEasterEggs !== 'undefined' && wordEasterEggs[kok] && wordEasterEggs[kok][refId]) {
            let eggObj = wordEasterEggs[kok][refId];
            if (activeSuffix && eggObj[activeSuffix] && eggObj[activeSuffix].cekimi) {
                kelimeListesi = [...eggObj[activeSuffix].cekimi];
                ozelCekimBulundu = true;
            } else if (!activeSuffix) {
                if (eggObj.base && eggObj.base.cekimi) {
                    kelimeListesi = [...eggObj.base.cekimi];
                    ozelCekimBulundu = true;
                } else if (eggObj.cekimi) {
                    kelimeListesi = [...eggObj.cekimi];
                    ozelCekimBulundu = true;
                }
            }
        }

        if (!ozelCekimBulundu && typeof sigaSablonlari !== 'undefined' && sigaSablonlari[tip]) {
            const list = sigaSablonlari[tip];
            let kokArr = kok.split("");
            let r1 = kokArr[0], r2 = kokArr[1], r3 = kokArr[2];
            let dynamicAynHareke = this.getDynamicAynHareke(kokArr, babNo, anaVezin, refId);
            let isMuzaaf = (kokArr[1] === kokArr[2] && babNo <= 6);

            list.forEach((siga, index) => {
                let cekilmisKelime = "";
                if (tip === 'muzari') {
                    let coreWord = "";
                    if (babNo === 11) {
                        coreWord = this.getIftialCore(kokArr, "ِ"); 
                    } else if (isMuzaaf) {
                        if (index === 5 || index === 11) coreWord = r1 + "ْ" + r2 + dynamicAynHareke + r3; 
                        else coreWord = r1 + dynamicAynHareke + r2 + "ّ"; 
                    } else {
                        coreWord = r1 + "ْ" + r2 + dynamicAynHareke + r3;
                    }
                    
                    if (babNo === 7) coreWord = r1 + "ْ" + r2 + dynamicAynHareke + r3; 
                    else if (babNo === 8) coreWord = r1 + "َ" + r2 + "ِّ" + r3;
                    else if (babNo === 9) coreWord = r1 + "َ" + "ا" + r2 + "ِ" + r3;
                    else if (babNo === 10) coreWord = "نْ" + r1 + "َ" + r2 + "ِ" + r3; 
                    else if (babNo === 12) {
                        if (index === 5 || index === 11) coreWord = r1 + "ْ" + r2 + "َ" + r3 + "ِ" + r3; 
                        else coreWord = r1 + "ْ" + r2 + "َ" + r3 + "ّ"; 
                    } 
                    else if (babNo === 13) coreWord = "تَ" + r1 + "َ" + r2 + "َّ" + r3; 
                    else if (babNo === 14) coreWord = "تَ" + r1 + "َ" + "ا" + r2 + "َ" + r3;
                    else if (babNo === 15) coreWord = "سْتَ" + r1 + "ْ" + r2 + "ِ" + r3;
                    
                    let currentPrefix = siga.prefix; 
                    if ([7, 8, 9].includes(babNo)) {
                        if (currentPrefix === 'يَ') currentPrefix = "يُ";
                        else if (currentPrefix === 'تَ') currentPrefix = "تُ";
                        else if (currentPrefix === 'أَ') currentPrefix = "أُ";
                        else if (currentPrefix === 'نَ') currentPrefix = "نُ";
                    }
                    cekilmisKelime = currentPrefix + coreWord + siga.suffix;
                } 
                else if (tip === 'mazi') {
                    if (babNo === 12) {
                        let baseSeddeli = `اِ${r1}ْ${r2}َ${r3}`; 
                        let baseAcik = `اِ${r1}ْ${r2}َ${r3}َ${r3}`; 
                        let seddeliEkler = ["َّ", "َّا", "ُّوا", "َّتْ", "َّتَا"]; 
                        if (index < 5) cekilmisKelime = baseSeddeli + seddeliEkler[index]; 
                        else cekilmisKelime = baseAcik + siga.ek; 
                    } else if (babNo === 11) {
                        cekilmisKelime = "اِ" + this.getIftialCore(kokArr, "َ") + siga.ek;
                    } else if (isMuzaaf) {
                        if (index < 5) {
                            let maziEkleri = ["َّ", "َّا", "ُّوا", "َّتْ", "َّتَا"]; 
                            cekilmisKelime = r1 + "َ" + r2 + maziEkleri[index]; 
                        } else {
                            let aynMazi = "َ"; 
                            if (babNo === 4 || babNo === 6) aynMazi = "ِ"; 
                            else if (babNo === 5) aynMazi = "ُ";
                            cekilmisKelime = r1 + "َ" + r2 + aynMazi + r3 + siga.ek; 
                        }
                    } else {
                        let tabanKelime = (typeof applyRootToKalip === 'function') ? applyRootToKalip(kok, anaVezin) : "";
                        let stem = tabanKelime ? tabanKelime.replace(/[َُِّْ]$/, "") : "";
                        
                        // YENİ EKLENEN KORUMA: Nakıs fiillerde aslına döndürür
                        if (r3 === 'و') stem = stem.replace(/[اى]$/, "و");
                        if (r3 === 'ي') stem = stem.replace(/[اى]$/, "ي");
                        
                        cekilmisKelime = stem + siga.ek; 
                    }
                } 
                else if (tip === 'emir') {
                    if (babNo === 12) {
                        if (index === 5) cekilmisKelime = `اِ${r1}ْ${r2}َ${r3}ِ${r3}ْنَ`; 
                        else {
                            let emirEkleri = ["َّ", "َّا", "ُّوا", "ِّي", "َّا"];
                            cekilmisKelime = `اِ${r1}ْ${r2}َ${r3}${emirEkleri[index]}`; 
                        }
                    } else if (babNo === 11) {
                        cekilmisKelime = "اِ" + this.getIftialCore(kokArr, "ِ") + siga.suffix;
                    } else if (isMuzaaf) {
                        if (index === 5) {
                            let emirPrefix = (dynamicAynHareke === "ُ") ? "اُ" : "اِ";
                            cekilmisKelime = emirPrefix + r1 + "ْ" + r2 + dynamicAynHareke + r3 + "ْنَ";
                        } else {
                            let coreEmir = r1 + dynamicAynHareke + r2; 
                            let emirEkleri = ["َّ", "َّا", "ُّوا", "ِّي", "َّا"];
                            cekilmisKelime = coreEmir + emirEkleri[index];
                        }
                    } else {
                        let emirPrefix = "اِ";
                        if (dynamicAynHareke === "ُ") emirPrefix = "اُ"; 
                        if (anaVezin.startsWith("أُ")) emirPrefix = "أُ";
                        else if (anaVezin.startsWith("أَ")) emirPrefix = "أَ";
                        else if ([8, 9, 13, 14].includes(babNo)) emirPrefix = ""; 
                        
                        let coreEmir = r1 + "ْ" + r2 + dynamicAynHareke + r3;
                        if (babNo === 8) coreEmir = r1 + "َ" + r2 + "ِّ" + r3;
                        else if (babNo === 9) coreEmir = r1 + "َ" + "ا" + r2 + "ِ" + r3;
                        else if (babNo === 10) coreEmir = "نْ" + r1 + "َ" + r2 + "ِ" + r3;
                        else if (babNo === 13) coreEmir = "تَ" + r1 + "َ" + r2 + "َّ" + r3;
                        else if (babNo === 14) coreEmir = "تَ" + r1 + "َ" + "ا" + r2 + "َ" + r3;
                        else if (babNo === 15) coreEmir = "سْتَ" + r1 + "ْ" + r2 + "ِ" + r3;

                        cekilmisKelime = emirPrefix + coreEmir + siga.suffix;
                    }
                }
                if (typeof SarfEngine !== 'undefined') cekilmisKelime = SarfEngine.applyRules(cekilmisKelime, kokArr);
                kelimeListesi.push(cekilmisKelime);
            });
        }
        return kelimeListesi;
    }
};

// ==============================================================================
// ULTIMATE SARF ENGINE (İdğam, İbdal, İ'lâl, İlletli Harfler ve Hemze Motoru)
// ==============================================================================
const SarfEngine = {
    applyRules: function(word, r) {
        if (!r || r.length !== 3) return word;
        let res = word;
        let [r1, r2, r3] = r; 

        // 1. İFTİAL BABI (11. BAB) İBDAL VE İDĞAM KURALLARI
        if (r1 === 'و' || r1 === 'ي' || r1 === 'ث' || r1 === 'ت') {
            res = res.replace(new RegExp(r1 + "ْت", "g"), "تّ");
        } else if (['ص', 'ض', 'ط', 'ظ'].includes(r1)) {
            res = res.replace(new RegExp(r1 + "ْت", "g"), r1 + "ْط");
            res = res.replace(/طْط/g, "طّ");
        } else if (['د', 'ذ', 'ز'].includes(r1)) {
            res = res.replace(new RegExp(r1 + "ْت", "g"), r1 + "ْد");
            res = res.replace(/دْد/g, "دّ");
        }

        // 1.5. İNFİ'AL BABI VE MUTEMASİLEYN (EKLER) ÇARPIŞMASI
        if (r1 === 'ن') {
            res = res.replace(/نْن/g, "نّ");
        }
        res = res.replace(/تْت/g, "تّ"); 
        res = res.replace(/نْن/g, "نّ"); 

        // 2. MUZAAF (ŞEDDELİ) FİİLLER
        if (r2 === r3) {
            let X = r2;
            let regexSukun = new RegExp(`ْ${X}([َُِ])${X}([ًٌٍَُِ])`, 'g');
            res = res.replace(regexSukun, `$1${X}ّ$2`);
            let regexNormal = new RegExp(`${X}[َُِ]${X}([ًٌٍَُِ])`, 'g');
            res = res.replace(regexNormal, `${X}ّ$1`);
            res = res.replace(new RegExp(`([\\u0621-\\u064A])َا${X}ِ${X}`, 'g'), `$1َا${X}ّ`);
            res = res.replace(new RegExp(`مَ([\\u0621-\\u064A])ْ${X}[َِ]${X}`, 'g'), `مَ$1َ${X}ّ`);
            res = res.replace(/^أِ/g, "إِ");
            res = res.replace(/(^|\s)أِ/g, "$1إِ");
        }

        // 3. MİSÂL FİİLLER (İLK HARF İLLETİ)
        if (r1 === 'و') {
            let muzariRegex = new RegExp(`([يتاأن])َوْ(${r2}[َِ]${r3}.*)`, 'g');
            res = res.replace(muzariRegex, "$1َ$2");
            let emirRegex = new RegExp(`اِوْ(${r2}[َِ]${r3}.*)`, 'g');
            res = res.replace(emirRegex, "$1");
        }
// 4. ECVEF FİİLLER
        if ((r2 === 'و' || r2 === 'ي') && (r3 !== 'و' && r3 !== 'ي')) {
            let ayn = r2;
            let maziHareke = (ayn === 'و') ? 'ُ' : 'ِ';
            if (typeof numBab !== 'undefined' && numBab === 4) maziHareke = 'ِ'; // Bab 4 istisnası (خاف -> خِفْنَ)

            // İF'AL VE DİĞER MEZİD BABLAR İÇİN STANDART ÇEVİRİLER
            res = res.replace(/أَ([\u0621-\u064A])ْ[وي]َ([\u0621-\u064A].*)/g, "أَ$1َا$2");
            res = res.replace(/(يُ|تُ|نُ|أُ|مُ)([\u0621-\u064A])ْ[وي]ِ([\u0621-\u064A].*)/g, "$1$2ِي$3");
            res = res.replace(/اِسْتَ([\u0621-\u064A])ْ[وي]َ([\u0621-\u064A].*)/g, "اِسْتَ$1َا$2");
            res = res.replace(/(يَ|تَ|نَ|أَ|مُ)سْتَ([\u0621-\u064A])ْ[وي]ِ([\u0621-\u064A].*)/g, "$1سْتَ$2ِي$3");

            // ==========================================
            // 1. İLTİKA-İ SAKİNEYN (SÜKUN ÇARPIŞMASI KESİN ÇÖZÜMLERİ)
            // ==========================================
            // MAZİ Sükunlar (Kadın Çoğul, Sen, Ben vb. -> عُدْنَ, بِعْنَ, خِفْنَ)
            // Hatalı Uzatmalı Gelişler (عَادْنَ, بَاعْنَ) veya Ham Gelişler (عَوَدْنَ, بَيَعْنَ)
            res = res.replace(/([\u0621-\u064A])َا([\u0621-\u064A])ْ/g, `$1${maziHareke}$2ْ`);
            res = res.replace(/([\u0621-\u064A])َوَ([\u0621-\u064A])ْ/g, `$1${maziHareke}$2ْ`);
            res = res.replace(/([\u0621-\u064A])َيَ([\u0621-\u064A])ْ/g, `$1ِ$2ْ`);
            res = res.replace(/([\u0621-\u064A])َ[وي]ِ([\u0621-\u064A])ْ/g, `$1ِ$2ْ`);

            // MUZARİ Sükunlar (Kadın Çoğul -> يَعُدْنَ, يَبِعْنَ, يَخَفْنَ)
            // Hatalı Uzatmalı Gelişler (يَعُودْنَ, يَبِيعْنَ, يَخَافْنَ)
            res = res.replace(/([يتاأن][َُِ][\u0621-\u064A])ُو([\u0621-\u064A])ْ/g, "$1ُ$2ْ");
            res = res.replace(/([يتاأن][َُِ][\u0621-\u064A])ِي([\u0621-\u064A])ْ/g, "$1ِ$2ْ");
            res = res.replace(/([يتاأن][َُِ][\u0621-\u064A])َا([\u0621-\u064A])ْ/g, "$1َ$2ْ");
            // Ham Gelişler (يَعْوُدْنَ, يَبْيِعْنَ, يَخْوَفْنَ)
            res = res.replace(/([يتاأن][َُِ][\u0621-\u064A])ْوُ([\u0621-\u064A])ْ/g, "$1ُ$2ْ");
            res = res.replace(/([يتاأن][َُِ][\u0621-\u064A])ْيِ([\u0621-\u064A])ْ/g, "$1ِ$2ْ");
            res = res.replace(/([يتاأن][َُِ][\u0621-\u064A])ْ[وي]َ([\u0621-\u064A])ْ/g, "$1َ$2ْ");

            // EMİR Sükunlar (Kadın Çoğul, Erkek Tekil -> عُدْ, عُدْنَ)
            res = res.replace(/[اأإآء]ُ([\u0621-\u064A])ْوُ([\u0621-\u064A])ْ(.*)/g, "$1ُ$2ْ$3");
            res = res.replace(/[اأإآء]ِ([\u0621-\u064A])ْيِ([\u0621-\u064A])ْ(.*)/g, "$1ِ$2ْ$3");
            res = res.replace(/[اأإآء]ِ([\u0621-\u064A])ْ[وي]َ([\u0621-\u064A])ْ(.*)/g, "$1َ$2ْ$3");


            // ==========================================
            // 2. NORMAL HAREKELİ DURUMLAR (UZATMALAR: عادَ, يَعُودُ, عُودُوا)
            // ==========================================
            // Mazi Harekeli: عَوَدَ -> عَادَ
            res = res.replace(/([\u0621-\u064A])َ[وي][َِ]([\u0621-\u064A])(?![ْ])/g, "$1َا$2");
            
            // Muzari Harekeli: يَعْوُدُ -> يَعُودُ / يَبْيِعُ -> يَبِيعُ / يَخْوَفُ -> يَخَافُ
            res = res.replace(/([يتاأن][َُِ][\u0621-\u064A])ْوُ([\u0621-\u064A])(?![ْ])/g, "$1ُو$2"); 
            res = res.replace(/([يتاأن][َُِ][\u0621-\u064A])ْيِ([\u0621-\u064A])(?![ْ])/g, "$1ِي$2"); 
            res = res.replace(/([يتاأن][َُِ][\u0621-\u064A])ْ[وي]َ([\u0621-\u064A])(?![ْ])/g, "$1َا$2"); 

            // Emir Harekeli: اُعْوُدُوا -> عُودُوا
            res = res.replace(/[اأإآء]ُ([\u0621-\u064A])ْوُ([\u0621-\u064A])([َُِ].*)/g, "$1ُو$2$3");
            res = res.replace(/[اأإآء]ِ([\u0621-\u064A])ْيِ([\u0621-\u064A])([َُِ].*)/g, "$1ِي$2$3");
            res = res.replace(/[اأإآء]ِ([\u0621-\u064A])ْ[وي]َ([\u0621-\u064A])([َُِ].*)/g, "$1َا$2$3");

            // ==========================================
            // 3. İSİM TAMLAMALARI VE MEF'ULLER
            // ==========================================
            res = res.replace(/([\u0621-\u064A])َا[وي]ِ([\u0621-\u064A])/g, "$1َائِ$2");
            res = res.replace(/مَ([\u0621-\u064A])ْوُو([\u0621-\u064A])/g, "مَ$1ُو$2");
            res = res.replace(/مَ([\u0621-\u064A])ْيُو([\u0621-\u064A])/g, "مَ$1ِي$2");
            res = res.replace(/مَ([\u0621-\u064A])ْ[وي]َ([\u0621-\u064A])/g, "مَ$1َا$2");
            res = res.replace(/مَ([\u0621-\u064A])ْ[وي]ِ([\u0621-\u064A])/g, "مَ$1ِي$2");
            res = res.replace(/إِ([\u0621-\u064A])ْ[وي]َا([\u0621-\u064A])(?!َة)/g, "إِ$1َا$2َة");
            res = res.replace(/اِسْتِ([\u0621-\u064A])ْ[وي]َا([\u0621-\u064A])(?!َة)/g, "اِسْتِ$1َا$2َة");
        }

        // 5. NÂKIS (SON HARF İLLETİ) ve LEFİF FİİLLER (örn: نوى)
        if (r3 === 'و' || r3 === 'ي') {
            let lam = r3;

            // Mezid Bablarda Telaffuz Ağırlıklarının Atılması
            res = res.replace(/ِيُ$/g, "ِي"); // يُزَكِّيُ -> يُزَكِّي 
            res = res.replace(/ُوُ$/g, "ُو"); // يَدْعُوُ -> يَدْعُو 
            
            // Mazi 3. Tekil Şahıs Dönüşümü (Şedde Korumalı)
            if (lam === 'و') {
                res = res.replace(/^([\u0621-\u064A][\u064B-\u0652]+[\u0621-\u064A][\u064B-\u0652]+)وَ$/g, "$1َا");
            }
            res = res.replace(/([\u0621-\u064A][\u064B-\u0652]*َ[\u064B-\u0652]*)[وي]َ$/g, "$1ى");

            // Çoğul ve Zamir Düşmeleri
            res = res.replace(/َ[وي][َُ]?وا$/g, "َوْا"); 
            res = res.replace(/ِ[وي][َُ]?وا$/g, "ُوا");  
            res = res.replace(/َ[وي]َتْ$/g, "َتْ");   
            res = res.replace(/َ[وي]َتَا$/g, "َتَا"); 

            res = res.replace(/ِيُ?ونَ$/g, "ُونَ"); 
            res = res.replace(/ِيُ?وا$/g, "ُوا");
            res = res.replace(/ُوُ?ونَ$/g, "ُونَ"); 
            res = res.replace(/ُوُ?وا$/g, "ُوا");    
            res = res.replace(/َيُ?ونَ$/g, "َوْنَ"); 
            res = res.replace(/َيُ?وا$/g, "َوْا");    

            res = res.replace(/ِيِ?ينَ$/g, "ِينَ"); 
            res = res.replace(/ِيِ?ي$/g, "ِي");      
            res = res.replace(/ُوِ?ينَ$/g, "ِينَ"); 
            res = res.replace(/ُوِ?ي$/g, "ِي");      
            res = res.replace(/َيِ?ينَ$/g, "َيْنَ"); 
            res = res.replace(/َيِ?ي$/g, "َيْ"); 
            
            // --- MUZARİ STANDART DÖNÜŞÜMLER (MUTLAK UNICODE ŞEDDE ZIRHLI) ---
            // Şedde ve Hareke hangi sırayla yazılırsa yazılsın fethayı/esreyi/ötreyi affetmez!
            res = res.replace(/([\u0621-\u064A][\u064B-\u0652]*ُ[\u064B-\u0652]*)[وي]ُ$/g, "$1و");
            res = res.replace(/([\u0621-\u064A][\u064B-\u0652]*ِ[\u064B-\u0652]*)[وي]ُ$/g, "$1ي");
            res = res.replace(/([\u0621-\u064A][\u064B-\u0652]*َ[\u064B-\u0652]*)[وي]ُ$/g, "$1ى"); // يَتَزَكَّيُ -> يَتَزَكَّى

            // --- EMİR KİPİ İLLET DÜŞMESİ (MUTLAK UNICODE ŞEDDE ZIRHLI) ---
            // Sükunlu gelen illetleri koparır.
            res = res.replace(/([\u0621-\u064A][\u064B-\u0652]*[َُِ][\u064B-\u0652]*)[ويىا]ْ$/g, "$1"); // تَزَكَّيْ -> تَزَكَّ

           // --- MECZUM (لَمْ) KİPİ İLLET DÜŞMESİ VE KADIN ZAMİR KORUMASI ---
            // (İçindeki harekeler yüzünden kelimeyi bölen eski regex yerine mutlak yakalayıcı eklendi)
            res = res.replace(/(لَمْ|لَمَّا|لِ)(\s*\S+)[وى]$/g, "$1$2"); // لَمْ أَتَزَكَّى -> لَمْ أَتَزَكَّ
            res = res.replace(/(لَمْ|لَمَّا|لِ)(\s*[يأن]\S*)ي$/g, "$1$2"); // لَمْ يَرْمِي -> لَمْ يَرْمِ

            // İsim Türetmeleri
            res = res.replace(new RegExp(`([\\u0621-\\u064A])َا([\\u0621-\\u064A])ِ[وي]$`, 'g'), `$1َا$2ِي`);
            if (lam === 'و') {
                res = res.replace(new RegExp(`مَ([\\u0621-\\u064A])ْ([\\u0621-\\u064A])ُو[وي]$`, 'g'), `مَ$1ْ$2ُوّ`);
            } else {
                res = res.replace(new RegExp(`مَ([\\u0621-\\u064A])ْ([\\u0621-\\u064A])ُو[وي]$`, 'g'), `مَ$1ْ$2ِيّ`);
            }
            res = res.replace(new RegExp(`مَ([\\u0621-\\u064A])ْ([\\u0621-\\u064A])َ[وي]$`, 'g'), `مَ$1ْ$2َى`);
        }
        // 6. MEHMÛZ FİİLLER (HEMZE KURALLARI VE KÜRSÜ DEĞİŞİMLERİ)
        if (r.includes('أ') || r.includes('ء') || r.includes('إ') || r.includes('ؤ') || r.includes('ئ')) {
           // ==================================================================
            // ÖZEL İSTİSNA: أخذ (Almak), أكل (Yemek) ve أمر (Emretmek)
            // ==================================================================
            if (r[0] === 'أ' && ((r[1] === 'خ' && r[2] === 'ذ') || (r[1] === 'ك' && r[2] === 'ل') || (r[1] === 'م' && r[2] === 'ر'))) {
                // 1. Emir kipinde baştaki hemzeler tamamen düşer: (اُأْخُذ veya أُأْخُذ -> خُذ)
                // KESİN ÇÖZÜM: Sadece Ötre (ُ) veya Esre (ِ) alan Emir eklerini hedefler. 
                // Üstün (َ) alan Muzari Ene (أَ) ekine dokunmaz!
                res = res.replace(/^[اأإ][ُِ]أْ/g, "");
                
                // 2. Muzari/Nehiy kiplerindeki hatalı kürsü/hareke dizilimlerini aslına döndür:
                res = res.replace(/([يتاأن])َ[أإؤُ]+ْ?(خ|ك|م)/g, "$1َأْ$2");
            }
            res = res.replace(/أَأْ/g, "آ"); 
            res = res.replace(/اُأْ/g, "أُو"); 
            res = res.replace(/اِأْ/g, "إِي"); 
            res = res.replace(/أَا/g, "آ"); 
            res = res.replace(/ءَا/g, "آ"); 
            
            res = res.replace(/ْأِ/g, "ْئِ"); 
            res = res.replace(/َأِ/g, "َئِ"); 
            res = res.replace(/ُأِ/g, "ُئِ"); 
            res = res.replace(/ِأَ/g, "ِئَ"); 
            res = res.replace(/ِأْ/g, "ِئْ"); 
            res = res.replace(/ِأُ/g, "ِئُ"); 
            
            res = res.replace(/ْأُ/g, "ْؤُ"); 
            res = res.replace(/َأُ/g, "َؤُ"); 
            res = res.replace(/ُأَ/g, "ُؤَ"); 
            res = res.replace(/ُأْ/g, "ُؤْ"); 
            // --- BURADAN İTİBAREN YENİ EKLENEN KISIM ---
            // C. SON HARF HEMZE (Hemze-i Mutatarrife) VE UZATMA KURALLARI
            // 1. Hemze kelimenin sonundaysa ve öncesinde uzatma (Elif) varsa satıra (ء) oturur.
            res = res.replace(/ا[أإؤئ]([\u064B-\u0652]*)$/g, "اء$1"); // يَشَاأُ -> يَشَاءُ , جَاأَ -> جَاءَ
            
            // 2. Hemze kelimenin sonundaysa ve öncesinde Sakin (Cezimli) Vav/Ye varsa satıra (ء) oturur.
            res = res.replace(/([وي]ْ)[أإؤئ]([\u064B-\u0652]*)$/g, "$1ء$2"); // يَسُووْأُ -> يَسُوءُ , يَجِييْأُ -> يَجِيءُ
            
            // 3. Kelime ortasında olsa bile Elif'ten sonra gelen FETHALI hemze her zaman satıra oturur!
            res = res.replace(/اأَ/g, "اءَ"); // تَسَاأَلَ -> تَسَاءَلَ , قِرَاأَة -> قِرَاءَة
            // -------------------------------------------
        }
        return res;
    }
};

const ColorEngine = {
    isHaraka: function(char) {
        return /[\u064B-\u0652\u0670]/.test(char);
    },

    isWeak: function(char) {
        return ['و', 'ي', 'ا', 'أ', 'إ', 'آ', 'ء', 'ى'].includes(char);
    },

    isEquivalent: function(char1, char2) {
        const hamzas = ['ا', 'أ', 'إ', 'آ', 'ؤ', 'ئ', 'ء'];
        const weaks = ['و', 'ي', 'ا', 'ى']; 
        
        if (char1 === char2) return true;
        if (hamzas.includes(char1) && hamzas.includes(char2)) return true;
        if (weaks.includes(char1) && weaks.includes(char2)) return true; 
        return false;
    },

    colorize: function(finalWord, rootArray = ['ف', 'ع', 'ل']) {
        // Harfleri temizle
        finalWord = finalWord.replace(/[\s\u200C\u200D\uFEFFـ]/g, '');

        let pureChars = finalWord.replace(/[\u064B-\u0652\u0670]/g, '');
        if (pureChars.match(/ف.*ع.*ل/)) {
            rootArray = ['ف', 'ع', 'ل'];
        } else if (typeof currentRoot !== 'undefined') {
            if (!currentRoot || currentRoot.trim() === "") {
                rootArray = ['ف', 'ع', 'ل'];
            }
        } else if (!rootArray || rootArray.length !== 3) {
            rootArray = ['ف', 'ع', 'ل'];
        }
        
        finalWord = finalWord.replace(/\uFEFB([\u064B-\u0652\u0670]?)/g, 'ل$1ا')
                             .replace(/\uFEF7([\u064B-\u0652\u0670]?)/g, 'ل$1أ')
                             .replace(/\uFEF9([\u064B-\u0652\u0670]?)/g, 'ل$1إ')
                             .replace(/\uFEF5([\u064B-\u0652\u0670]?)/g, 'ل$1آ');
        
        let charsOnly = [];
        for (let i = 0; i < finalWord.length; i++) {
            if (!this.isHaraka(finalWord[i])) {
                charsOnly.push({ char: finalWord[i], isRoot: false });
            }
        }

        let rIndex = 0;
        for (let i = 0; i < charsOnly.length; i++) {
            let c = charsOnly[i].char;
            
            if (rIndex < 3 && this.isEquivalent(c, rootArray[rIndex])) {
                let isZiyade = false;
                
                if (rIndex < 2 && ['س', 'أ', 'إ', 'آ', 'ل', 'ت', 'م', 'و', 'ن', 'ي', 'ه', 'ا', 'ء'].includes(c)) {
                    let searchPointer = i + 1;
                    let rootMatchCount = 0;
                    let requiredMatches = 3 - rIndex; 

                    for (let k = rIndex; k < 3; k++) {
                        let found = false;
                        for (let j = searchPointer; j < charsOnly.length; j++) {
                            if (this.isEquivalent(charsOnly[j].char, rootArray[k])) {
                                found = true;
                                searchPointer = j + 1;
                                break;
                            }
                        }
                        if (found) rootMatchCount++;
                    }

                    if (rootMatchCount === requiredMatches) {
                        isZiyade = true; 
                    }
                }

                // =========================================================
                // YENİ KESİN ÇÖZÜM: NAKIS FİİL "تَا" (Gâibe Tesniye) HATASI
                // =========================================================
                // Eğer 3. kök harfini arıyorsak, o harf zayıf bir harfse,
                // ve şu an baktığımız harften bir önceki harf ek olan (kırmızı) 'ت' ise:
                // Bu harf kök değil, Tesniye ekidir! Kırmızı kalmalıdır!
                if (rIndex === 2 && this.isWeak(rootArray[2])) {
                    if (i > 0 && charsOnly[i - 1].char === 'ت' && charsOnly[i - 1].isRoot === false) {
                        isZiyade = true;
                    }
                }

                if (!isZiyade) {
                    charsOnly[i].isRoot = true; 
                    rIndex++;
                }
            } 
            else if (rIndex + 1 < 3 && this.isEquivalent(c, rootArray[rIndex + 1]) && this.isWeak(rootArray[rIndex])) {
                charsOnly[i].isRoot = true;
                rIndex += 2;
            }
        }

        // KELİMEYİ ATOMİK PARÇALARA BÖLME
        let parsedWord = [];
        let i = 0;
        let charIdx = 0;
        while (i < finalWord.length) {
            let char = finalWord[i];
            if (this.isHaraka(char)) { i++; continue; }
            
            let isRoot = false;
            if (charIdx < charsOnly.length && charsOnly[charIdx].char === char) {
                isRoot = charsOnly[charIdx].isRoot;
                charIdx++;
            }
            
            let harekeler = "";
            let j = i + 1;
            while (j < finalWord.length && this.isHaraka(finalWord[j])) {
                harekeler += finalWord[j];
                j++;
            }
            parsedWord.push({ base: char, hareke: harekeler, isRoot: isRoot });
            i = j;
        }

        // ATOMİK KUTULARI VE BAĞLAYICILARI (ZWJ) İNŞA ETME
        let resultHtml = "";
        const nonConnectors = ['ا', 'أ', 'إ', 'آ', 'د', 'ذ', 'ر', 'ز', 'و', 'ؤ', 'ء', 'ى', 'ة'];

        for (let k = 0; k < parsedWord.length; k++) {
            let current = parsedWord[k];
            let prev = k > 0 ? parsedWord[k - 1] : null;
            let next = k < parsedWord.length - 1 ? parsedWord[k + 1] : null;
            
            let connectRight = false; // Sağdaki harfe (Öncekine) birleşecek mi?
            let connectLeft = false;  // Soldaki harfe (Sonrakine) birleşecek mi?
            
            if (prev && !nonConnectors.includes(prev.base) && current.base !== 'ء') {
                connectRight = true;
            }
            if (next && !nonConnectors.includes(current.base) && next.base !== 'ء') {
                connectLeft = true;
            }
            
            let prefix = connectRight ? "&zwj;" : "";
            let suffix = connectLeft ? "&zwj;" : "";
            let color = current.isRoot ? "#000000" : "#E53935";
            
            // Her harf tek başına bir zırhın içinde!
            resultHtml += `<span class="srf-char" style="color: ${color} !important;">${prefix}${current.base}${current.hareke}${suffix}</span>`;
        }

        return `<span class="srf-word" dir="rtl">${resultHtml}</span>`;
    }
};

// SİHİRLİ ATOMİK HİZALAMA VE LİGATÜR ENGELLEYİCİ CSS
if (!document.getElementById('srf-color-fix')) {
    const style = document.createElement('style');
    style.id = 'srf-color-fix';
    style.innerHTML = `
        .srf-word {
            display: inline-flex !important; 
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            direction: rtl !important;
            white-space: nowrap !important;
        }
        
        .srf-char {
            display: block !important; 
            margin: 0 !important;
            padding: 0 !important;
            font-variant-ligatures: none !important;
            font-family: 'Arakom', sans-serif !important;
            font-weight: normal !important;
        }

        .glass-box .ar, .glass-box .ar-small, .siga-text {
            display: block !important;
            text-align: center !important;
            width: 100% !important;
            direction: rtl !important;
        }
        .conjugation-table td, .conjugation-table th {
            text-align: center !important;
            vertical-align: middle !important;
        }
    `;
    document.head.appendChild(style);
}

// ==================================================================
// MERKEZİ KLAVYE VE TAHMİN (ÖNERİ) MOTORU
// ==================================================================
const universalKeyboardLayout = [
    ['ذ', 'ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
    ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
    ['ئ', 'ء', 'ؤ', 'ر', 'ى', 'ة', 'و', 'ز', 'ظ', 'BACKSPACE']
];

function renderUniversalKeyboards() {
    // A. Arama Klavyesi (Açılır Menüdeki)
    const searchKbContainer = document.getElementById("integrated-keyboard");
    if (searchKbContainer) {
        let searchHtml = "";
        universalKeyboardLayout.forEach(row => {
            searchHtml += `<div class="search-kb-row">`;
            row.forEach(char => {
                if (char === 'BACKSPACE') {
                    searchHtml += `<div class="search-key uni-key backspace" onclick="handleSearchKey('BACKSPACE')">⌫</div>`;
                } else {
                    searchHtml += `<div class="search-key uni-key" onclick="handleSearchKey('${char}')">${char}</div>`;
                }
            });
            searchHtml += `</div>`;
        });
        searchKbContainer.innerHTML = searchHtml;
    }

    // B. Ana Klavye (Kök Yazma Ekranı)
    const mainKbContainer = document.getElementById("main-keyboard-inner");
    if (mainKbContainer) {
        let mainHtml = "";
        universalKeyboardLayout.forEach(row => {
            mainHtml += `<div class="kb-row">`;
            row.forEach(char => {
                if (char === 'BACKSPACE') {
                    mainHtml += `<div class="key uni-key key-special" onclick="handleBackspace()" style="min-width: 80px; background: #600;">⌫</div>`;
                } else {
                    mainHtml += `<div class="key uni-key" onclick="addLetter('${char}')">${char}</div>`;
                }
            });
            mainHtml += `</div>`;
        });
        mainKbContainer.innerHTML = mainHtml;
    }
    
    // Her iki klavye de çizildikten sonra Elif (ا) tuşlarına Uzun Basma zekasını ekle
    initLongPress();
}

function initLongPress() {
    const keys = document.querySelectorAll('.uni-key'); 
    keys.forEach(key => {
        const char = key.innerText.trim();
        if (char === 'ا') {
            const variations = ['أ', 'إ', 'آ'];
            const isSearchMode = key.classList.contains('search-key');

            const startPress = (e) => {
                if (document.getElementById('key-variations-menu')) return;
                window.isLongPress = false;
                window.keyPressTimer = setTimeout(() => {
                    window.isLongPress = true;
                    showKeyVariations(key, variations, isSearchMode);
                    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
                }, 400); 
            };

            const endPress = () => {
                if (window.keyPressTimer) clearTimeout(window.keyPressTimer);
            };

            key.addEventListener('touchstart', startPress, { passive: true });
            key.addEventListener('touchend', endPress);
            key.addEventListener('touchcancel', endPress);
            key.addEventListener('mousedown', startPress);
            key.addEventListener('mouseup', endPress);
            key.addEventListener('mouseleave', endPress);
            
            key.removeAttribute('onclick'); 
            key.addEventListener('click', (e) => {
                if (window.isLongPress) {
                    e.preventDefault(); e.stopPropagation();
                    window.isLongPress = false;
                } else {
                    if (isSearchMode) handleSearchKey('ا');
                    else addLetter('ا');
                    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
                }
            });
        }
    });
}

function showKeyVariations(keyElement, variations, isSearchMode) {
    let existingMenu = document.getElementById('key-variations-menu');
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement('div');
    menu.id = 'key-variations-menu';
    menu.className = 'key-variations-menu';

    variations.forEach(v => {
        const btn = document.createElement('div');
        btn.className = 'var-key';
        btn.innerText = v;
        
        const handleVarClick = (e) => {
            e.preventDefault(); e.stopPropagation();
            if (isSearchMode) handleSearchKey(v);
            else addLetter(v);
            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            menu.remove();
        };

        btn.addEventListener('click', handleVarClick);
        btn.addEventListener('touchstart', handleVarClick, { passive: false });
        menu.appendChild(btn);
    });

    document.body.appendChild(menu);
    const rect = keyElement.getBoundingClientRect();
    menu.style.left = (rect.left + window.scrollX - (menu.offsetWidth / 2) + (rect.width / 2)) + 'px';
    menu.style.top = (rect.top + window.scrollY - menu.offsetHeight - 10) + 'px';
}

// ANA KLAVYE İÇİN "HAZIR KÖK TAHMİN" SİSTEMİ
function updateMainKeyboardPredictions() {
    const predictionsContainer = document.getElementById("main-keyboard-predictions");
    if (!predictionsContainer) return;
    
    predictionsContainer.innerHTML = "";
    let filter = currentRoot.trim();
    
    if (filter.length > 0) {
        const allRoots = Object.keys(wordEasterEggs);
        // Yazılan harflerle başlayan hazır köklerden en fazla 4 tanesini öner
        const matches = allRoots.filter(r => r.startsWith(filter)).slice(0, 4); 
        
        matches.forEach(r => {
            predictionsContainer.innerHTML += `
                <div class="prediction-chip" onclick="selectRootFromMainKeyboard('${r}')">
                    ${r} ${getRootEmoji(r)}
                </div>`;
        });
    }
}

function selectRootFromMainKeyboard(root) {
    currentRoot = root;
    updateTempDisplay();
    confirmRoot(); // Kökü onaylar, tabloları açar ve klavyeyi kapatır
}

// --- EVRENSEL BÜYÜTME KAPATICI ---
document.addEventListener('click', function(e) {
    // Eğer tıklanan yer büyüyen kutu, dev klon veya EK MENÜSÜ değilse kapat
    if (!e.target.closest('.glass-box.pulse-highlight') && 
        !e.target.closest('.crisp-zoom-clone') && 
        !e.target.closest('#suffix-dropdown')) { 
        if (typeof closeAllZoomedBoxes === 'function') {
            closeAllZoomedBoxes();
        }
    }
});

document.addEventListener('touchstart', function(e) {
    if (!e.target.closest('.glass-box.pulse-highlight') && 
        !e.target.closest('.crisp-zoom-clone') && 
        !e.target.closest('#suffix-dropdown')) {
        if (typeof closeAllZoomedBoxes === 'function') {
            closeAllZoomedBoxes();
        }
    }
}, { passive: true });

// --- SÜRÜKLENEBİLİR VE PARÇALI KÖK SİSTEMİ ---

// Kök harflerini kurallara göre ayırır
function formatArabicRoot(root) {
    if (!root || root.length !== 3) return root;
    const nonConnecting = ['ا','د','ذ','ر','ز','و','أ','إ','آ','ؤ','ء'];
    const l1 = root[0]; 
    const l2 = root[1]; 
    const l3 = root[2]; 
    
    const res1 = nonConnecting.includes(l1) ? l1 : l1 + 'ـ';
    const prefix2 = nonConnecting.includes(l1) ? '' : 'ـ';
    const suffix2 = nonConnecting.includes(l2) ? '' : 'ـ';
    const res2 = prefix2 + l2 + suffix2;
    const prefix3 = nonConnecting.includes(l2) ? '' : 'ـ';
    const res3 = prefix3 + l3;
    
    return `${res1}  ${res2}  ${res3}`;
}

// Yeni kök girilince eski tahtaları temizleyen fonksiyon
function clearDraggableRoots() {
    document.querySelectorAll('.draggable-root-clone').forEach(el => el.remove());
}

// Bırakılmış bir tahtayı yeniden sürüklenebilir yapan fonksiyon
function makeElementDraggable(el) {
    let isDragging = false;

    function onMouseDown(e) {
        e.preventDefault();
        isDragging = true;
        el.style.zIndex = 1000000;
        
        let startX = e.pageX || (e.touches && e.touches[0].pageX);
        let startY = e.pageY || (e.touches && e.touches[0].pageY);
        let rect = el.getBoundingClientRect();
        let offsetX = startX - rect.left - window.scrollX;
        let offsetY = startY - rect.top - window.scrollY;

        function onMouseMove(moveEvent) {
            if (!isDragging) return;
            let x = moveEvent.pageX || (moveEvent.touches && moveEvent.touches[0].pageX);
            let y = moveEvent.pageY || (moveEvent.touches && moveEvent.touches[0].pageY);
            el.style.left = (x - offsetX) + 'px';
            el.style.top = (y - offsetY) + 'px';
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchmove', onMouseMove);
            document.removeEventListener('touchend', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchmove', onMouseMove, { passive: false });
        document.addEventListener('touchend', onMouseUp);
    }

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('touchstart', onMouseDown, { passive: false });
}

// --- KLAVYE DIŞINA TIKLAYINCA KAPATMA SİSTEMİ ---
document.addEventListener("click", function(event) {
    const popup = document.getElementById('integrated-keyboard-popup');
    const searchInput = document.getElementById('root-search');
    
    // Eğer popup açıksa, tıklanan yer popup'ın içi değilse ve arama çubuğu da değilse klavyeyi kapat
    if (popup && popup.classList.contains('active')) {
        if (!popup.contains(event.target) && event.target !== searchInput) {
            closeSearchKeyboard();
        }
    }
});

// Ana kutudan yeni klon çıkartma işlemini başlatan yapı
document.addEventListener('DOMContentLoaded', () => {
    // HATA BURADAYDI: Hedefi 'root-display-box' yerine sadece yazının olduğu 'root-text-display' yaptık!
    const rootTextTarget = document.getElementById('root-text-display');
    
    if(rootTextTarget) {
        rootTextTarget.style.cursor = 'grab';
        
        // Animasyonun (👇 Sürükle) doğru yerde çıkması için relative yapıyoruz
        rootTextTarget.style.position = 'relative';
        
        const handleDragStart = (e) => {
            // Artık hedef sadece yazı olduğu için buton veya SVG kontrolüne gerek kalmadı.
            if (e.type === 'touchstart') e.preventDefault();

            if (!currentRoot || currentRoot.length !== 3) return;
            
            // Ekranda sadece TEK BİR klon olmasını garantilemek için eskileri temizle
            clearDraggableRoots();
            
            // Yeni tahta klonunu oluştur
            const formattedText = formatArabicRoot(currentRoot);
            const dragEl = document.createElement('div');
            dragEl.className = 'draggable-root-clone';
            dragEl.innerText = formattedText;
            document.body.appendChild(dragEl);

            // Yeni elemanı sürüklenebilir yap
            makeElementDraggable(dragEl);

            // Fare/Parmak pozisyonunu al
            const startX = e.pageX || (e.touches && e.touches[0].pageX);
            const startY = e.pageY || (e.touches && e.touches[0].pageY);
            
            // İlk çıktığında tam farenin ortasına hizala
            dragEl.style.left = (startX - dragEl.offsetWidth / 2) + 'px';
            dragEl.style.top = (startY - dragEl.offsetHeight / 2) + 'px';

            // Çıkar çıkmaz sürüklenmeye devam etmesi için mousedown olayını elemana devret
            const simulateClick = new MouseEvent('mousedown', {
                bubbles: true, cancelable: true, view: window,
                clientX: startX, clientY: startY
            });
            dragEl.dispatchEvent(simulateClick);
        };

        // Event dinleyicilerini sadece kök metnine bağlıyoruz
        rootTextTarget.addEventListener('mousedown', handleDragStart);
        rootTextTarget.addEventListener('touchstart', handleDragStart, { passive: false });
    }
});
// Kök girildiğinde veya seçildiğinde tahtayı otomatik olarak sahneye çıkartan fonksiyon
// Kök girildiğinde veya seçildiğinde tahtayı otomatik olarak sahneye çıkartan fonksiyon
function autoSpawnRootClone() {
    // MOBİLDE İPTAL EDEN KOD (if window.innerWidth <= 1024) BURADAN SİLİNDİ

    if (!currentRoot || currentRoot.length !== 3) return;
    
    clearDraggableRoots(); 
    
    const formattedText = formatArabicRoot(currentRoot);
    const dragEl = document.createElement('div');
    dragEl.className = 'draggable-root-clone';
    dragEl.innerText = formattedText;
    document.body.appendChild(dragEl);

    makeElementDraggable(dragEl);

    const rootBox = document.getElementById('root-display-box');
    if (rootBox) {
        const rect = rootBox.getBoundingClientRect();
        const spawnX = rect.left + window.scrollX + (rect.width / 2) - 60; 
        const spawnY = rect.bottom + window.scrollY + 25; 
        
        dragEl.style.left = spawnX + 'px';
        dragEl.style.top = spawnY + 'px';
    } else {
        dragEl.style.left = '50%';
        dragEl.style.top = '150px';
    }
    
    dragEl.style.transform = 'scale(0)';
    dragEl.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    setTimeout(() => {
        dragEl.style.transform = 'scale(1)';
    }, 50);
    
    setTimeout(() => {
        dragEl.style.transition = 'none';
    }, 350);
}

// ==================================================================
// SUNUM KUMANDASI VE KLAVYE İLE OTOMATİK GEÇİŞ SİSTEMİ
// ==================================================================
currentEggIndex = -1;
let isPresentationLocked = false; // YENİ: Geçişler sırasında çakışmayı önleyen kilit

function getReadyRoots() {
    return Object.keys(wordEasterEggs); 
}

function getSortedRefsForRoot(root) {
    if (!wordEasterEggs[root]) return [];
    return Object.keys(wordEasterEggs[root])
        .map(Number)
        .sort((a, b) => a - b);
}

// ==================================================================
// 2. OTOMATİK GEÇİŞ SİSTEMİ (Büyütme Kapatma ve Cümle Engelleme)
// ==================================================================
function activateBoxByRef(refId) {
    const boxes = Array.from(document.querySelectorAll('.glass-box'));
    const targetBox = boxes.find(b => {
        const refEl = b.querySelector('.ref');
        return refEl && parseInt(refEl.innerText.trim()) === refId;
    });

    if (targetBox) {
        const isTab1 = targetBox.closest('#tab1');
        const isTab2 = targetBox.closest('#tab2');
        let tabSwitched = false;

        if (isTab1 && currentTabActive !== 0) { setTab(0); tabSwitched = true; }
        if (isTab2 && currentTabActive !== 1) { setTab(1); tabSwitched = true; }

        const islemGecikmesi = tabSwitched ? 1000 : 0; 
        
        if (tabSwitched) {
            isPresentationLocked = true; 
        }

        setTimeout(() => {
            const rect = targetBox.getBoundingClientRect();
            const absoluteTop = window.scrollY + rect.top;
            const middle = absoluteTop - (window.innerHeight / 2) + (rect.height / 2);
            window.scrollTo({ top: middle, behavior: 'smooth' });

            // Kutunun kaçıncı tıklamada olduğunu artık handleBoxClick kendi çözecek
            handleBoxClick(targetBox);
            
            if (tabSwitched) {
                isPresentationLocked = false;
            }
        }, islemGecikmesi);
    }
}

// ==================================================================
// 4. İLERİ KUMANDA (İlk Tık: Sadece Sarı Vurgular | İkinci Tık: İlk Kutu)
// ==================================================================
function nextEasterEgg() {
    if (typeof isPresentationLocked !== 'undefined' && isPresentationLocked) return; 
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    let waitTime = 0;
    const activeZoom = document.getElementById('crisp-zoom-clone');
    const roots = typeof getReadyRoots === 'function' ? getReadyRoots() : [];
    if (roots.length === 0) return;

    if (activeZoom) {
        waitTime = 10; 
    }

    setTimeout(() => {
        if (!currentRoot || currentRoot.length !== 3 || (typeof wordEasterEggs !== 'undefined' && !wordEasterEggs[currentRoot])) {
            if (typeof selectReadyVerb === 'function') selectReadyVerb(roots[0]);
            return; 
        }

        const refs = typeof getSortedRefsForRoot === 'function' ? getSortedRefsForRoot(currentRoot) : [];

        if (currentEggIndex >= 0 && currentEggIndex < refs.length) {
            const currentRefId = refs[currentEggIndex];
            const currentBox = Array.from(document.querySelectorAll('.glass-box')).find(b => {
                const refEl = b.querySelector('.ref');
                return refEl && parseInt(refEl.innerText.trim()) === currentRefId;
            });
            
            if (currentBox) {
                let tiklama = parseInt(currentBox.getAttribute('data-tiklama-sayisi') || '0');
                const isZoomEnabled = window.innerWidth <= 1024 ? false : (document.getElementById('zoomToggleCheckbox') ? document.getElementById('zoomToggleCheckbox').checked : false);

                if (tiklama === 0) {
                    if (typeof activateBoxByRef === 'function') activateBoxByRef(currentRefId);
                    return;
                }

                if (isZoomEnabled) {
                    if (tiklama === 1 || tiklama === 2) {
                        if (typeof activateBoxByRef === 'function') activateBoxByRef(currentRefId);
                        return; 
                    }
                    if (tiklama === 3) {
                        // Zoom açıkken 4. adıma geçer (Büyütmeyi kapatır, tabloda yeşil bırakır)
                        if (typeof handleBoxClick === 'function') handleBoxClick(currentBox); 
                    }
                } else {
                    if (window.innerWidth <= 1024) {
                        // Mobil davranış
                        if (tiklama === 1) {
                            currentBox.classList.remove('current-active-red');
                            currentBox.setAttribute('data-tiklama-sayisi', '2'); 
                        }
                    } else {
                        // MASAÜSTÜ ZOOM KAPALI DAVRANIŞI (HATA BURADA ÇÖZÜLDÜ)
                        if (tiklama === 1) {
                            if (typeof activateBoxByRef === 'function') activateBoxByRef(currentRefId);
                            return; 
                        }
                        if (tiklama === 2) {
                            // Eskiden burada kutuyu tamamen sıfırlayan bir komut çalışıyordu.
                            // Artık sadece kırmızı vurguyu kaldırıp, kelimeyi yeşil haliyle masada bırakıyoruz!
                            currentBox.classList.remove('current-active-red');
                            currentBox.setAttribute('data-tiklama-sayisi', '3'); // Bir sonraki tıklamada sıfırlansın diye 3 yaptık
                        }
                    }
                }
            }
        }

        // Bir sonraki kutuya geçiş yap
        currentEggIndex++;

        if (currentEggIndex >= refs.length) {
            let rootIndex = roots.indexOf(currentRoot);
            rootIndex++;
            if (rootIndex >= roots.length) rootIndex = 0; 
            if (typeof selectReadyVerb === 'function') selectReadyVerb(roots[rootIndex]);
            return; 
        }

        if (typeof activateBoxByRef === 'function') activateBoxByRef(refs[currentEggIndex]);
    }, waitTime);
}
// ==================================================================
// 5. GERİ KUMANDA (Geri Dönüşlerde de Sarı Vurgu Beklemesi Eklendi)
// ==================================================================
function prevEasterEgg() {
    if (isPresentationLocked) return; 
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    // Zoom ekranı açıksa sadece zoomu kapat, kelime yeşilse yeşil kalsın diye durumu bozma
    const activeZoom = document.getElementById('crisp-zoom-clone');
    if (activeZoom) {
        if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();
        return; 
    }

    const roots = getReadyRoots();
    if (!currentRoot || currentRoot.length !== 3 || !wordEasterEggs[currentRoot] || roots.length === 0) return;

    const refs = getSortedRefsForRoot(currentRoot);

    // 1) ŞU AN BULUNULAN KUTUYU ANINDA TEMİZLE
    if (currentEggIndex >= 0 && currentEggIndex < refs.length) {
        const currentRefId = refs[currentEggIndex];
        const currentBox = Array.from(document.querySelectorAll('.glass-box')).find(b => {
            const refEl = b.querySelector('.ref');
            return refEl && parseInt(refEl.innerText.trim()) === currentRefId;
        });
        
        if (currentBox) {
            if (typeof resetBox === 'function') resetBox(currentBox);
            currentBox.removeAttribute('data-tiklama-sayisi');
            currentBox.classList.remove('current-active-red'); 
            currentBox.classList.add('sari-vurgu');
            currentBox.style.setProperty("background-color", "", "important");
        }
    }

    // 2) BİR ÖNCEKİ KUTUYA GEÇ
    currentEggIndex--;

    if (currentEggIndex === -1) {
        highlightEasterEggBoxes(currentRoot);
        return; 
    }

    if (currentEggIndex < -1) {
        let rootIndex = roots.indexOf(currentRoot);
        rootIndex--;
        if (rootIndex < 0) rootIndex = roots.length - 1; 

        selectReadyVerb(roots[rootIndex]);
        setTimeout(() => {
            const newRefs = getSortedRefsForRoot(roots[rootIndex]);
            currentEggIndex = newRefs.length - 1;
            if (newRefs.length > 0) {
                // GERİ GİDİŞ KOMUTU: TRUE
                activateBoxByRef(newRefs[currentEggIndex], true); 
            }
        }, 600);
        return;
    }

    // Normal önceki kutuya geçerken GERİ GİDİŞ KOMUTU: TRUE
    activateBoxByRef(refs[currentEggIndex], true); 
}

// --- KLAVYE VE SUNUM KUMANDASI DİNLEYİCİSİ ---
document.addEventListener('keydown', function(e) {
    // Ekranda kök girmek için açılan siyah sanal klavye aktifse kumanda tuşlarını yoksay
    const kbOverlay = document.getElementById('keyboard-overlay');
    if (kbOverlay && (kbOverlay.style.display === 'flex' || kbOverlay.style.display === 'block')) {
        return;
    }

    // Sunum kumandaları donanımsal olarak genelde PageDown/PageUp veya Yön Tuşları gibi davranır
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault(); // Boşluk (Space) tuşunun sayfayı aşağı kaydırmasını engeller
        nextEasterEgg();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevEasterEgg();
    }
});



// İkinci parametre olarak 'isBackward' eklendi
function activateBoxByRef(refId, isBackward = false) {
    // MOBİL İSE SADECE MOBİL GRİDDEN BUL
    const containerSelector = window.innerWidth <= 1024 ? '#mobile-grid .glass-box' : '.window-pencere .glass-box';
    const boxes = Array.from(document.querySelectorAll(containerSelector));
    const targetBox = boxes.find(b => {
        const refEl = b.querySelector('.ref');
        return refEl && parseInt(refEl.innerText.trim()) === refId;
    });

    if (targetBox) {
        let tabSwitched = false;
        
        // SEKME DEĞİŞTİRME SADECE MASAÜSTÜNDE ÇALIŞIR
        if (window.innerWidth > 1024) {
            const isTab1 = targetBox.closest('#tab1');
            const isTab2 = targetBox.closest('#tab2');

            if (isTab1 && currentTabActive !== 0) { setTab(0); tabSwitched = true; }
            if (isTab2 && currentTabActive !== 1) { setTab(1); tabSwitched = true; }
        }

        const islemGecikmesi = tabSwitched ? 1000 : 0; 
        
        if (tabSwitched) {
            isPresentationLocked = true; 
        }

        setTimeout(() => {
            const rect = targetBox.getBoundingClientRect();
            const absoluteTop = window.scrollY + rect.top;
            const middle = absoluteTop - (window.innerHeight / 2) + (rect.height / 2);
            window.scrollTo({ top: middle, behavior: 'smooth' });

            if (isBackward) {
                document.querySelectorAll(containerSelector).forEach(b => b.classList.remove('current-active-red'));
                targetBox.classList.add('current-active-red');
                targetBox.classList.remove('sari-vurgu');

                // MOBİLDE ZOOM OLMADIĞI İÇİN 3'TE BEKLER
                const isZoomEnabled = window.innerWidth <= 1024 ? false : (document.getElementById('zoomToggleCheckbox') ? document.getElementById('zoomToggleCheckbox').checked : false);
                if (isZoomEnabled) {
                    targetBox.setAttribute('data-tiklama-sayisi', '4'); 
                } else {
                    targetBox.setAttribute('data-tiklama-sayisi', '3'); 
                }
            } else {
                handleBoxClick(targetBox);
            }
            
            if (tabSwitched) {
                isPresentationLocked = false;
            }
        }, islemGecikmesi);
    }
}

// ==================================================================
// MOBİL ARAYÜZ ENJEKSİYONU
// ==================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Sadece Mobil 2 Sütunlu Izgarayı yarat (Mavi buton kaldırıldı)
    if (!document.getElementById('mobile-grid')) {
        const grid = document.createElement('div');
        grid.id = 'mobile-grid';
        document.body.appendChild(grid);
    }
});

// ==================================================================
// HEDEFE UÇAN ARTI (+) ANİMASYONU (SAYDAM VERSİYON)
// ==================================================================
function flyEmojiToPlus(startEl) {
    // Hedef butonu bul (Masaüstü mü yoksa Mobil mi?)
    let targetBtn = document.querySelector('.fa-plus');
    if (window.innerWidth <= 1024) {
        targetBtn = document.getElementById('mobile-top-plus');
    }
    if (!targetBtn) return;

    // Başlangıç ve Bitiş koordinatlarını hesapla
    const startRect = startEl.getBoundingClientRect();
    const targetRect = targetBtn.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

   // Uçacak olan emojiyi yarat
    const particle = document.createElement('div');
    particle.innerText = '+'; // DİKKAT: Siyah emoji yerine gerçek '+' metni koyduk
    particle.style.color = 'rgba(255, 255, 255, 0.8)'; // ÇÖZÜM: Saydam, yumuşak bir beyaz/krem rengi
    particle.style.fontWeight = 'bold';
    particle.style.position = 'fixed'; 
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    particle.style.fontSize = '35px';
    particle.style.zIndex = '9999999';
    particle.style.pointerEvents = 'none'; 
    particle.style.filter = 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))';
    
    // Uçuş animasyonu ayarları (Hızlı başlar, hedefe doğru yavaşlar)
    particle.style.transition = 'all 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
    particle.style.transform = 'translate(-50%, -50%) scale(0.5)';
    
    // İŞTE BURASI: 1 yerine 0.6 yaparak şık bir yarı saydamlık verdik!
    particle.style.opacity = '0.6'; 

    document.body.appendChild(particle);

    // Tarayıcıyı yenilemeye zorla
    void particle.offsetWidth;

    // Hedefe doğru hareketi başlat ve küçülerek kaybolmasını sağla
    particle.style.left = endX + 'px';
    particle.style.top = endY + 'px';
    particle.style.transform = 'translate(-50%, -50%) scale(1.2)';
    
    setTimeout(() => {
        particle.style.opacity = '0';
        particle.style.transform = 'translate(-50%, -50%) scale(0.3)';
    }, 400); 

    // Animasyon bitince elementi DOM'dan temizle
    particle.addEventListener('transitionend', () => {
        particle.remove();
    });
}


// --- YÖNLENDİRME (HINT) KONTROLCÜSÜ ---
function toggleRootHint(showRequest) {
    let shouldShow = showRequest;

    // AKILLI GÜVENLİK DUVARI: 
    // Eğer seçili bir kök (currentRoot) varsa veya arama kutusunda yazı varsa animasyonu ZORLA KAPAT!
    const searchInput = document.getElementById('root-search');
    const hasSearchText = searchInput && searchInput.value.length > 0;
    const hasRootText = typeof currentRoot !== 'undefined' && currentRoot.length > 0;

    if (hasRootText || hasSearchText) {
        shouldShow = false;
    }

    // İkonları bul ve uygula
    const bookIcon = document.querySelector('.fa-book'); 
    const mobileMenuBtn = document.querySelector('.mobile-back-btn'); 
    
    if (bookIcon) {
        if (shouldShow) bookIcon.classList.add('ready-root-hint');
        else bookIcon.classList.remove('ready-root-hint');
    }
    
    if (mobileMenuBtn) {
        if (shouldShow) mobileMenuBtn.classList.add('ready-root-hint');
        else mobileMenuBtn.classList.remove('ready-root-hint');
    }
}

// --- DIŞARI VE KÖKE TIKLAYINCA KLAVYEYİ KAPATMA SİSTEMİ ---
document.addEventListener('click', function(event) {
    const kbPopup = document.getElementById('integrated-keyboard-popup');
    const searchInput = document.getElementById('root-search');
    
    // 1. Eğer klavye açık değilse hiçbir şey yapma
    if (!kbPopup || !kbPopup.classList.contains('active')) return;

    // 2. Eğer tıklanan yer KLAVYENİN KENDİSİ veya ARAMA KUTUSU ise klavyeyi kapatma (açık kalsın)
    if (kbPopup.contains(event.target) || (searchInput && searchInput.contains(event.target))) {
        return;
    }

    // 3. Eğer üstteki şartlar sağlanmadıysa (yani köke veya boşluğa tıklandıysa):
    // Klavyeyi sadece görsel olarak aşağı kaydır (Yazıyı silme!)
    kbPopup.classList.remove('active');
    
    // Güvenlik amacıyla kalkan sınıfı hala bir yerlerde aktifse onu da temizle
    const backdrop = document.getElementById('keyboard-backdrop');
    if (backdrop) backdrop.classList.remove('active');
});

// ===============================================================
// BAB BİLGİ (INFO) EKRANI MOTORU (ZENGİN HTML İÇERİKLİ)
// ===============================================================

function getBabInfo(rawName) {
    // GÜVENLİK: İsimdeki görünmez harfleri (Zero-width) ve gereksiz boşlukları kökünden temizler
    let cleanName = rawName.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase().replace(/[\n\r\s\u200B-\u200D\uFEFFⓘ]+/g, '').trim();

    const babs = [
        { 
            keys: ["if'âl", "if'al", "ifal", "ifâl"], 
            title: "İf'âl", 
            desc: `
            <p>• <b>Geçişlilik:</b> Lâzım (geçişsiz) fiilleri Müteaddi (geçişli) yapar. <br>Örn: <span class="arabic-sample">ضَحِكَ</span> (Güldü) → <span class="arabic-sample">أَضْحَكَ</span> (Güldürdü)</p>
            <p>• <b>Zaman ve Mekan:</b> Eylemin zamanla veya mekanla anlam kurmasını sağlar.<br>Örn: <span class="arabic-sample">أَصْبَحَ</span> (Sabaha girdi), <span class="arabic-sample">أَعْرَقَ</span> (Irak'a vardı)</p>
            <p>• <b>Durum Bildirme:</b> Bir sıfata veya duruma girmeyi belirtir.<br>Örn: <span class="arabic-sample">أَفْقَرَ</span> (Fakirleşti), <span class="arabic-sample">أَغْنَى</span> (Zenginleşti)</p>
            <p>• <span style="color:#ef4444; font-weight:bold;">Not:</span> İf'al hemzesi 'kat-i' hemzedir; her zaman yazılır ve okunur.<br>Örn: <span class="arabic-sample">قُلْتُ أَكْرِمْ!</span> (İkram et dedim!)</p>
            ` 
        },
        { 
            keys: ["tef'îl", "tef'il", "tefil", "tefîl"], 
            title: "Tef'îl", 
            desc: `
            <p>• <b>Geçişlilik:</b> Geçişsiz fiilleri geçişli yapar. <br>Örn: <span class="arabic-sample">عَلِمَ</span> (Bildi) → <span class="arabic-sample">عَلَّمَ</span> (Öğretti)</p>
            <p>• <b>Yoğunluk:</b> Aşırılık ve kuvvet bildirir. <br>Örn: <span class="arabic-sample">مَزَقَ</span> (Yırttı) → <span class="arabic-sample">مَزَّقَ</span> (Parçaladı)</p>
            <p>• <b>Türetme:</b> İsimlerden fiil yapar. <br>Örn: <span class="arabic-sample">خَيْمَةٌ</span> (Çadır) → <span class="arabic-sample">خَيَّمَ</span> (Kamp kurdu)</p>
            ` 
        },
        { 
            keys: ["mufâ'ale", "mufa'ale", "müfâ'ale", "müfa'ale", "mufaale", "müfaale"], 
            title: "Mufâ'ale", 
            desc: `
            <p>• <b>Müşareket:</b> İşteşlik (karşılıklılık) bildirir. <br>Örn: <span class="arabic-sample">كَتَبَ</span> (Yazdı) → <span class="arabic-sample">كَاتَبَ</span> (Yazıştı)</p>
            <p>• <b>Kararlılık:</b> Israr ve davranış biçimi anlatır. <br>Örn: <span class="arabic-sample">طَلَبَ</span> (İstedi) → <span class="arabic-sample">طَالَبَ</span> (Talep etti)</p>
            <p>• <b>Mübalağa:</b> Aşırılık belirtir. <br>Örn: <span class="arabic-sample">ضَعُفَ</span> (Zayıfladı) → <span class="arabic-sample">ضَاعَفَ</span> (Katladı)</p>
            ` 
        },
        { 
            keys: ["infi'âl", "infi'al", "infial", "infiâl"], 
            title: "İnfi'âl", 
            desc: `
            <p>• <b>Edilgenlik:</b> Fiili edilgen (yapıldı) hale getirir. <br>Örn: <span class="arabic-sample">كَسَرَ</span> (Kırdı) → <span class="arabic-sample">اِنْكَسَرَ</span> (Kırıldı)</p>
            <p>• <b>Dönüşlülük:</b> Eylemin etkisi özneye döner. <br>Örn: <span class="arabic-sample">قَلَبَ</span> (Döndürdü) → <span class="arabic-sample">اِنْقَلَبَ</span> (Ters döndü)</p>
            ` 
        },
        { 
            keys: ["ifti'âl", "ifti'al", "iftial", "iftiâl"], 
            title: "İfti'âl", 
            desc: `
            <p>• <b>Dönüşlülük:</b> Eylemin sonucunu belirtir. <br>Örn: <span class="arabic-sample">اِجْتَمَعَ</span> (Toplandı), <span class="arabic-sample">اِرْتَفَعَ</span> (Yükseldi)</p>
            <p>• <b>Gayret:</b> Çaba ve edinme manası katar. <br>Örn: <span class="arabic-sample">اِجْتَهَدَ</span> (Çalıştı), <span class="arabic-sample">اِكْتَسَبَ</span> (Kazandı)</p>
            <p>• <b>İşteşlik:</b> Ortaklık bildirir. <br>Örn: <span class="arabic-sample">اِخْتَصَمَ</span> (Tartıştı)</p>
            ` 
        },
        { 
            keys: ["if'ılâl", "if'ılal", "if'ilâl", "if'ilal", "ifılal", "ifilal", "ifılâl"], 
            title: "İf'ılâl", 
            desc: `
            <p>• <b>Renkler:</b> Renk bildiren fiillerde kullanılır. <br>Örn: <span class="arabic-sample">اِحْمَرَّ</span> (Kızardı), <span class="arabic-sample">اِصْفَرَّ</span> (Sarardı)</p>
            <p>• <b>Kusurlar:</b> Sakatlık ve noksanlık belirtir. <br>Örn: <span class="arabic-sample">اِعْرَجَّ</span> (Topalladı)</p>
            ` 
        },
        { 
            keys: ["tefa'ul", "tefe'ul", "tefeul", "tefaul", "tefa'ül", "tefe'ül", "tefaül", "tefeül"], 
            title: "Tefa'ul", 
            desc: `
            <p>• <b>Çaba:</b> Gayret ve sahiplenme bildirir. <br>Örn: <span class="arabic-sample">تَصَبَّرَ</span> (Sabretti), <span class="arabic-sample">تَوَسَّدَ</span> (Yastık edindi)</p>
            <p>• <b>Dönüşlülük:</b> Tef'îl vezninin dönüşlü halidir. <br>Örn: <span class="arabic-sample">تَفَرَّقَ</span> (Dağıldı), <span class="arabic-sample">تَكَسَّرَ</span> (Parçalandı)</p>
            <p>• <b>Kademelilik:</b> İşin aşama aşama yapıldığını belirtir. <br>Örn: <span class="arabic-sample">تَنَزَّلَ</span> (İndi)</p>
            ` 
        },
        { 
            keys: ["tefâ'ul", "tefâul", "tefâ'ül", "tefâül"], 
            title: "Tefâ'ul", 
            desc: `
            <p>• <b>İşteşlik:</b> Ortaklık belirtir. <br>Örn: <span class="arabic-sample">تَعَاوَنَ</span> (Yardımlaştı), <span class="arabic-sample">تَمَازَحَ</span> (Şakalaştı)</p>
            <p>• <b>Yapmacıklık:</b> Olmayan bir şeyi olmuş gibi gösterir. <br>Örn: <span class="arabic-sample">تَمَارِضَ</span> (Hasta numarası yaptı)</p>
            <p>• <b>Peşpeşelik:</b> İşin ardarda gerçekleştiğini bildirir. <br>Örn: <span class="arabic-sample">تَسَاقَطَ</span> (Döküldü)</p>
            ` 
        },
        { 
            keys: ["istif'âl", "istif'al", "istifal", "istifâl"], 
            title: "İstif'âl", 
            desc: `
            <p>• <b>İstek:</b> Talep ve bulmak manası verir. <br>Örn: <span class="arabic-sample">اِسْتَغْفَرَ</span> (Af diledi), <span class="arabic-sample">اِسْتَسْهَلَ</span> (Kolay buldu)</p>
            <p>• <b>Değişim:</b> Durum değişikliği veya vakit bildirir. <br>Örn: <span class="arabic-sample">اِسْتَحْجَرَ</span> (Taşlaştı), <span class="arabic-sample">اِسْتَحْصَدَ</span> (Hasat vakti geldi)</p>
            <p>• <b>Geçişlilik:</b> Lazım fiili müteaddi yapar. <br>Örn: <span class="arabic-sample">اِسْتَخْرَجَ</span> (Çıkardı)</p>
            ` 
        }
    ];

    for (let bab of babs) {
        if (bab.keys.includes(cleanName)) return { title: bab.title, desc: bab.desc };
    }
    return null; 
}

window.showBabInfo = function(rawName) {
    const overlay = document.getElementById('bab-info-overlay');
    const titleEl = document.getElementById('bab-info-title');
    const textEl = document.getElementById('bab-info-text');
    
    let info = getBabInfo(rawName);

    if(overlay && titleEl && textEl && info) {
        titleEl.innerText = info.title + " Bâbı";
        textEl.innerHTML = info.desc; 
        
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('active'), 10);
        if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
    }
};

window.closeBabInfo = function(event) {
    if (event && event.target && event.target.closest('.bab-info-content') && !event.target.classList.contains('close-info-btn')) return;
    const overlay = document.getElementById('bab-info-overlay');
    if(overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.style.display = 'none', 300);
        if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
    }
};

window.initBabIcons = function() {
    // 'align="center"' olan td'leri bul (Masdar Tablosundaki Hücreler)
    const tdElements = document.querySelectorAll('td[align="center"]');
    
    tdElements.forEach(td => {
        // Hücre içindeki yazıyı (ikon html'i olmadan) saf metin olarak çekiyoruz
        let rawText = td.innerText || td.textContent;
        let originalText = rawText.replace(/ⓘ/g, '').trim(); 
        
        // Bu yazı gerçekten bir Bâb adı mı diye soruyoruz
        let info = getBabInfo(originalText);
        
        if (info) {
            // 1. Eğer hücrede henüz (i) ikonu yoksa, JS ile biz ekleyelim
            if (!td.querySelector('.info-icon')) {
                td.style.position = 'relative'; 
                td.innerHTML = `${originalText} <span class="info-icon" title="${info.title} Özellikleri"><i class="fas fa-info-circle"></i></span>`;
            }
            
            // 2. İkon ister HTML'de hazır olsun ister biz eklemiş olalım, TIKLAMA GÖREVİNİ ZORLA ATA!
            let iconBtn = td.querySelector('.info-icon');
            if (iconBtn) {
                // Her ihtimale karşı eski tıklama fonksiyonlarını temizle
                iconBtn.onclick = null; 
                
                // Güvenli Tıklama (Çakışmayı Engelleyici)
                iconBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation(); // ÇÖZÜM BURASI: Tıklamanın arkaya geçip ekranı kapatmasını engeller
                    showBabInfo(info.title); // Garantili eşleşme için doğrudan veritabanındaki title'ı gönderir
                };
            }
        }
    });
};

// Sayfa yüklendiğinde ve dinamik içerik değiştiğinde motoru çalıştır
document.addEventListener("DOMContentLoaded", initBabIcons);
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initBabIcons, 200);
}
// ===============================================================
// 1. KRONOMETRE BUTONU EKLEYİCİ VE FİİL DEDEKTÖRÜ (SVG VERSİYONU)
// ===============================================================

// Sadece fiili olanları tespit eden motor (Eksikti, geri eklendi!)
function hasVerbsToRead(root) {
    if (!root || root.length !== 3) return false;
    if (typeof wordEasterEggs !== 'undefined' && wordEasterEggs[root]) {
        const verbRefs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16, 52,53,54,58,59,60,64,65,66,71,72,73,77,78,79,83,84,85,88,89,90,94,95,96,100,101,102];
        const existingRefs = Object.keys(wordEasterEggs[root]).map(Number);
        return existingRefs.some(r => verbRefs.includes(r));
    }
    return true; 
}

setInterval(() => {
    try {
        const currentRootSafe = typeof currentRoot !== 'undefined' ? currentRoot : "";
        const canShowTimer = hasVerbsToRead(currentRootSafe);
        const isDraggableOnScreen = document.querySelector('.draggable-root-clone') !== null;

        // Hatasız okunan tek satırlık zarif SVG kodu
        const mySvg = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#334155" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"></circle><polyline points="12 9 12 13 14 15"></polyline><line x1="10" y1="2" x2="14" y2="2"></line><line x1="12" y1="2" x2="12" y2="5"></line><line x1="18" y1="6" x2="16.5" y2="7.5"></line></svg>';

        // A. TAŞINABİLİR TAHTALAR İÇİN (Kahverengi Kutu)
        document.querySelectorAll('.draggable-root-clone').forEach(box => {
            let btn = box.querySelector('.kutu-timer-btn');
            if (canShowTimer && !btn) {
                let newBtn = document.createElement('div');
                newBtn.className = 'kutu-timer-btn';
                newBtn.innerHTML = mySvg;
                newBtn.title = 'Hız ve Telaffuz Testi';
                
                newBtn.onmousedown = (e) => { e.stopPropagation(); };
                newBtn.ontouchstart = (e) => { e.stopPropagation(); };
                newBtn.onclick = (e) => { e.stopPropagation(); window.openMarathon(); };
                
                box.appendChild(newBtn);
            } else if (!canShowTimer && btn) {
                btn.remove();
            }
        });

        // B. ANA SABİT KUTU İÇİN (Yukarıdaki Header)
        const textEl = document.getElementById('root-text-display');
        if (textEl) {
            const desktopBox = textEl.parentElement; 
            let btnMain = desktopBox.querySelector('.kutu-timer-btn');
            
            if (canShowTimer && !btnMain && !isDraggableOnScreen) {
                desktopBox.style.position = 'relative'; 
                let newBtnMain = document.createElement('div');
                newBtnMain.className = 'kutu-timer-btn';
                newBtnMain.innerHTML = mySvg;
                newBtnMain.title = 'Hız ve Telaffuz Testi';
                newBtnMain.onclick = (e) => { e.stopPropagation(); window.openMarathon(); };
                desktopBox.appendChild(newBtnMain);
            } else if ((!canShowTimer || isDraggableOnScreen) && btnMain) {
                btnMain.remove();
            }
        }

        // C. MOBİL ÜST BAR İÇİN
        const mobileRootDisplay = document.querySelector('.mobile-root-display');
        if (mobileRootDisplay) {
            const mobileBox = mobileRootDisplay.parentElement;
            let btnM = mobileBox.querySelector('.kutu-timer-btn-mobile');

            if (canShowTimer && !btnM) {
                mobileBox.style.position = 'relative';
                let newBtnM = document.createElement('div');
                newBtnM.className = 'kutu-timer-btn kutu-timer-btn-mobile';
                newBtnM.innerHTML = mySvg;
                newBtnM.onclick = (e) => { e.stopPropagation(); window.openMarathon(); };
                mobileBox.appendChild(newBtnM);
            } else if (!canShowTimer && btnM) {
                btnM.remove();
            }
        }
    } catch(err) { }
}, 500);

// ===============================================================
// 2. OYUN MOTORU (SEÇMELİ, BEKLEMELİ VE DİNAMİK MARATON SİSTEMİ)
// ===============================================================
window.mActiveSet = [];
window.mCurrentStage = 0;
window.mRanges = [[0,0], [0,0], [0,0]];
window.mErrorMemory = new Set();
window.mTimerInterval = null;
window.mStartTime = 0;
window.mElapsedTime = 0;
window.mIsPaused = false;
window.mRaceMode = false; // Yarışmanın başlayıp başlamadığını takip eder
window.mAudioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSfx(f, t, d) {
    if (window.mAudioCtx.state === 'suspended') window.mAudioCtx.resume();
    const o = window.mAudioCtx.createOscillator(); const g = window.mAudioCtx.createGain();
    o.type = t; o.frequency.setValueAtTime(f, window.mAudioCtx.currentTime);
    g.gain.setValueAtTime(0.05, window.mAudioCtx.currentTime);
    o.connect(g); g.connect(window.mAudioCtx.destination);
    o.start(); o.stop(window.mAudioCtx.currentTime + d);
}


// O KÖKTEKİ TÜM MAZİ FİİLLERİ VE ÖRNEK CÜMLELERİNİ BULAN FONKSİYON
function getAvailableMaziVerbs(root) {
    const maziRefs = [1, 8, 11, 14, 52, 58, 64, 71, 77, 83, 88, 94, 100];
    let list = [];
    
    if (typeof wordEasterEggs !== 'undefined' && wordEasterEggs[root]) {
        const rootData = wordEasterEggs[root];
        maziRefs.forEach(ref => {
            if (rootData[ref]) {
                let word = "";
                
                // 1. JSON'da tanımlı olan Arapça metni arar
                if (rootData[ref].base && rootData[ref].base.arText) {
                    word = rootData[ref].base.arText;
                } else if (rootData[ref].arText) {
                    word = rootData[ref].arText;
                } else if (rootData[ref].cekimi && rootData[ref].cekimi.length > 0) {
                    let item = rootData[ref].cekimi[0];
                    word = typeof item === 'object' ? item.ar : item;
                } else if (rootData[ref].base && rootData[ref].base.cekimi && rootData[ref].base.cekimi.length > 0) {
                    let item = rootData[ref].base.cekimi[0];
                    word = typeof item === 'object' ? item.ar : item;
                }

                // Cümleyse ilk kelimeyi ayıklar
                let cleanWord = word.replace(/[\u200B-\u200D\uFEFF\s]/g, '').split(" ")[0]; 
                
                // Örnek cümleyi de hafızaya alır
                let ornekData = rootData[ref].ornek || (rootData[ref].base && rootData[ref].base.ornek);
                
                // =========================================================
                // 2. BULAMADIYSA DOĞRU BABA GÖRE (ÖRNEĞİN İFTİAL) KENDİ ÜRETİR!
                // =========================================================
                if (!cleanWord) {
                    // Ref ID'sinden (Örn: 11) Bab numarasını (Örn: 8. Bab - İftial) bulur
                    let mapping = typeof getBabAndType === 'function' ? getBabAndType(ref) : { babNo: 1 };
                    let babNo = mapping.babNo;
                    let vObj = typeof babVezinleri !== 'undefined' ? babVezinleri[babNo] : null;
                    
                    // İlgili babın MAZİ kalıbını çeker (İftial için 'اِفْتَعَلَ' gibi)
                    let mKalip = vObj ? vObj.mazi : "فَعَلَ";
                    
                    // Kökü kalıba yerleştirip idğam/ibdal kuralları için SarfEngine'e sokar
                    let rawWord = typeof applyRootToKalip === 'function' ? applyRootToKalip(root, mKalip) : root[0]+"َ"+root[1]+"َ"+root[2]+"َ";
                    cleanWord = typeof SarfEngine !== 'undefined' ? SarfEngine.applyRules(rawWord, root.split("")) : rawWord;
                }
                
                // Üretilen kelimeyi listeye ekle
                if (cleanWord) {
                    list.push({ refId: ref, word: cleanWord, ornek: ornekData });
                }
            }
        });
    }
    
    // Eğer sözlükte o köke ait hiç fiil açılmamışsa, boş dönmesin diye 1. Babı zorla üretir
    if (list.length === 0 && root.length === 3) {
        let defaultWord = root[0] + "َ" + root[1] + "َ" + root[2] + "َ";
        if(typeof SarfEngine !== 'undefined') defaultWord = SarfEngine.applyRules(defaultWord, root.split(""));
        list.push({ refId: 1, word: defaultWord, ornek: null });
    }
    
    return list;
}

// ===============================================================
// LOBİ, GERİ DÖNÜŞ VE TEMİZLİK MOTORU
// ===============================================================
window.mCountdownInterval = null; // Geri sayımı durdurabilmek için hafıza
window.mSkippedLobby = false;     // Lobinin atlanıp atlanmadığını tutan hafıza

// 1. LOBİYİ AÇAR VE AKILLI KARAR VERİR
window.openMarathon = function() {
    if (!currentRoot || currentRoot.length !== 3) return;
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    // Tüm sayaçları ve eski verileri sıfırla
    clearInterval(window.mTimerInterval);
    clearInterval(window.mCountdownInterval); 
    window.mCurrentStage = 0; 
    window.mErrorMemory.clear(); 
    window.mElapsedTime = 0; 
    window.mIsPaused = false;
    window.mRaceMode = false;
    window.mSkippedLobby = false; 

    document.getElementById('marathon-overlay').classList.add('active');
    
    // Üst barı HEP GÖRÜNÜR tut ki GERİ tuşu kaybolmasın! Sadece içini temizle.
    document.getElementById('top-bar-panel').style.visibility = 'visible';
    hideMarathonHeaders(); 
    document.getElementById('chrono-main').style.display = 'none'; 
    
    const verbs = getAvailableMaziVerbs(currentRoot);
    
    // 1. DURUM: TEK BİR FİİL VARSA LOBİYİ ATLA VE DİREKT TABLOYU AÇ
    if (verbs.length === 1) {
        window.mSkippedLobby = true; // Lobiyi atladığımızı hafızaya yaz
        buildMarathonDataForBab(verbs[0].refId);
        
        document.getElementById('marathon-selection-area').style.display = 'none'; 
        document.getElementById('marathon-countdown-overlay').style.display = 'none';
        
        prepareMarathonPlay(); // Tabloyu ve Gri Kronometreyi hazırlar
        return;
    }

    // 2. DURUM: BİRDEN FAZLA FİİL VARSA LOBİYİ GÖSTER
    document.getElementById('marathon-selection-area').style.display = 'flex';
    document.getElementById('marathon-countdown-overlay').style.display = 'none';
    document.getElementById('screen-play').classList.remove('active'); // Arkadaki tabloyu gizle
    document.getElementById('screen-result').classList.remove('active'); 

    const btnContainer = document.getElementById('marathon-verb-buttons');
    btnContainer.innerHTML = '';


   // Lobi Butonlarını Zenginleştirerek (Eğitim Kartı Olarak) Üret
    verbs.forEach(v => {
        let btn = document.createElement('div'); // Button yerine div kullanıyoruz ki iç içe tıklamalar sorun olmasın
        
        // Profesyonel Kart Tasarımı (Flashcard Görünümü)
        btn.style.background = "#ffffff";
        btn.style.border = "2px solid #e2e8f0";
        btn.style.boxShadow = "0 10px 25px rgba(0,0,0,0.05)";
        btn.style.padding = "25px 30px";
        btn.style.borderRadius = "24px";
        btn.style.display = "flex";
        btn.style.flexDirection = "column";
        btn.style.alignItems = "center";
        btn.style.gap = "20px";
        btn.style.width = "100%"; 
        btn.style.cursor = "pointer";
        btn.style.transition = "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)";
        
        // Üzerine gelince havaya kalkma ve renklenme efekti
        btn.onmouseenter = () => { 
            btn.style.transform = "translateY(-5px)"; 
            btn.style.boxShadow = "0 20px 40px rgba(108, 92, 231, 0.15)"; 
            btn.style.borderColor = "#6c5ce7"; 
        };
        btn.onmouseleave = () => { 
            btn.style.transform = "translateY(0)"; 
            btn.style.boxShadow = "0 10px 25px rgba(0,0,0,0.05)"; 
            btn.style.borderColor = "#e2e8f0"; 
        };
        
        // Fiil kelimesi (Çok daha büyük ve net)
        let wordHtml = typeof ColorEngine !== 'undefined' ? ColorEngine.colorize(v.word, currentRoot.split("")) : v.word;
        let btnHtml = `<div style="font-family: 'Arakom', serif; font-size: 4.8rem; font-weight: bold; color: #1e293b; text-align: center;">${wordHtml}</div>`;
        
 
       
        // Profesyonel Örnek Cümle Kutusu (Dizi/Obje Akıllı Seçici)
        if (v.ornek) {
            // Eğer birden fazla örnek (dizi) girilmişse ilkini seç, tekilse kendisini al
            let seciliOrnek = Array.isArray(v.ornek) ? v.ornek[0] : v.ornek;
            
            let ornekAr = seciliOrnek.ar || "";
            let ornekTr = seciliOrnek.tr || "";
            
            if (ornekAr || ornekTr) {
                btnHtml += `
                    <div style="background: #f8fafc; border-right: 5px solid #6c5ce7; border-radius: 16px; padding: 20px 25px; width: 100%; box-sizing: border-box; text-align: center; display: flex; flex-direction: column; gap: 15px; position: relative;">
                        <div style="position: absolute; top: 12px; right: 18px; color: #cbd5e1; font-size: 1.5rem;"><i class="fas fa-quote-right"></i></div>
                        <div style="font-family: 'Arakom', serif; font-size: 2.8rem; color: #0f172a; line-height: 1.5; direction: rtl;">${ornekAr}</div>
                        <div style="font-family: 'Segoe UI', sans-serif; font-size: 1.3rem; color: #475569; font-weight: bold; direction: ltr; letter-spacing: 0.3px;">${ornekTr}</div>
                    </div>`;
            }
        }
        
        btn.innerHTML = btnHtml;

        // FİİL SEÇİLDİĞİNDE SADECE TABLOYU HAZIRLA (Sayacı başlatma!)
        btn.onclick = () => {
            if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
            buildMarathonDataForBab(v.refId); 
            
            document.getElementById('marathon-selection-area').style.display = 'none';
            prepareMarathonPlay(); // Tabloyu açıp incelemeye bırakır
        };
        btnContainer.appendChild(btn);
    });
};

// LOBİDEN ÇIKIŞ VEYA OYUNDAN LOBİYE DÖNÜŞ BUTONU
window.goBackFromMarathon = function() {
    if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
    const selectionArea = document.getElementById('marathon-selection-area');
    
    // Eğer Lobideyse tamamen kapat
    if (selectionArea.style.display === 'flex') {
        closeMarathon(); 
    } else {
        // Eğer Oyundaysa Lobiye dön
        clearInterval(window.mTimerInterval);
        window.openMarathon(); 
    }
};

window.closeMarathon = function() {
    if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
    clearInterval(window.mTimerInterval);
    window.mRaceMode = false;
    document.getElementById('marathon-overlay').classList.remove('active');
};

// 2. TABLOYU EKRANA DİZER, HEADER'I AÇAR (YARIŞMA HENÜZ BAŞLAMADI)
function prepareMarathonPlay() {
    document.getElementById('marathon-selection-area').style.display = 'none';
    
    window.mCurrentStage = 0; 
    window.mErrorMemory.clear(); 
    window.mElapsedTime = 0; 
    window.mRaceMode = false;
    clearInterval(window.mTimerInterval);
    clearInterval(window.mCountdownInterval);
    
    showMarathonScreen('screen-play');
    loadMarathonTable();
    
    // Header UI Ayarları: Sadece GERİ, MAZİ ve ⏱️ görünür. Diğerleri (puan vb.) gizli.
    document.getElementById('stage-label').classList.add('ui-visible');
    
    const chronoMain = document.getElementById('chrono-main');
    chronoMain.style.display = 'block'; // Buton görünür
    chronoMain.classList.remove('active'); // Ama gri renkli bekler
    
    document.getElementById('pause-btn').classList.remove('ui-visible');
    document.getElementById('timer-display').classList.remove('ui-visible');
    document.getElementById('live-total-score').classList.remove('ui-visible');
    
    document.getElementById('timer-display').innerText = "0.00";
    document.getElementById('live-total-score').innerText = "100";
}

// 3. LOBİDEN ÇIKIŞ VEYA OYUNDAN LOBİYE DÖNÜŞ BUTONU
window.goBackFromMarathon = function() {
    if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
    const selectionArea = document.getElementById('marathon-selection-area');
    
    // 1. Eğer Lobideysek veya Lobi atlanmış (tek fiilli) bir kökteysek -> Tamamen Kapat
    if (selectionArea.style.display === 'flex' || window.mSkippedLobby) {
        closeMarathon(); 
    } else {
        // 2. Tablodayız ve birden fazla fiil var -> Lobiye dön
        window.openMarathon(); 
    }
};

// 4. SİSTEMİ TAMAMEN KAPATIR VE TEMİZLER
window.closeMarathon = function() {
    if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
    clearInterval(window.mTimerInterval);
    clearInterval(window.mCountdownInterval);
    window.mRaceMode = false;
    document.getElementById('marathon-overlay').classList.remove('active');
    
    // Ekranda "MAZİ" veya süre yazısı asılı kalmasın diye temizlik
    hideMarathonHeaders();
    document.getElementById('chrono-main').style.display = 'none';
};

// 5. OYUN İÇİNDEKİ ⏱️ BUTONUNA BASILINCA 'BAŞLA' EKRANINI GETİRİR
window.handleMarathonChronoClick = function() {
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    if (!window.mRaceMode) {
        window.mRaceMode = true;
        document.getElementById('chrono-main').classList.add('active'); 
        
        const overlay = document.getElementById('marathon-countdown-overlay');
        overlay.style.display = 'flex';
        
        const startBtn = document.getElementById('start-btn-ui');
        startBtn.style.display = 'block';
        startBtn.disabled = false; 
        
        document.getElementById('countdown-text').style.display = 'none';
    } else {
        window.mRaceMode = false;
        clearInterval(window.mTimerInterval);
        clearInterval(window.mCountdownInterval);
        window.mElapsedTime = 0;
        
        document.getElementById('chrono-main').classList.remove('active');
        document.getElementById('pause-btn').classList.remove('ui-visible');
        document.getElementById('timer-display').classList.remove('ui-visible');
        document.getElementById('live-total-score').classList.remove('ui-visible');
        document.getElementById('marathon-countdown-overlay').style.display = 'none';
        
        window.mErrorMemory.clear();
        loadMarathonTable();
    }
};

// 6. "BAŞLA" BUTONUNA TIKLANINCA ÇALIŞIR (3-2-1 KUSURSUZ GÜVENLİ SAYIM)
window.startMarathonCountdown = function() {
    const startBtn = document.getElementById('start-btn-ui');
    startBtn.disabled = true; 
    startBtn.style.display = 'none';
    
    const cd = document.getElementById('countdown-text');
    cd.style.display = 'block';
    
    window.mErrorMemory.clear(); 
    window.mCurrentStage = 0; 
    loadMarathonTable();
    
    let count = 3; 
    cd.innerText = count;
    playSfx(400, 'sine', 0.1); 
    
    // Geri sayımı değişkene atadık ki GERİ tuşuna basılırsa susturabilelim
    window.mCountdownInterval = setInterval(() => {
        count--;
        if (count > 0) { 
            cd.innerText = count; 
            playSfx(400, 'sine', 0.1); 
        } else { 
            clearInterval(window.mCountdownInterval); 
            document.getElementById('marathon-countdown-overlay').style.display = 'none'; 
            startMarathonTimer(); 
        }
    }, 1000);
};
// "BAŞLA" BUTONUNA TIKLANINCA ÇALIŞIR (3-2-1 KUSURSUZ GÜVENLİ SAYIM)
window.startMarathonCountdown = function() {
    const startBtn = document.getElementById('start-btn-ui');
    startBtn.disabled = true; // HATA ÇÖZÜMÜ: Çift tıklanıp sayacın bozulmasını tamamen engeller!
    startBtn.style.display = 'none';
    
    const cd = document.getElementById('countdown-text');
    cd.style.display = 'block';
    
    window.mErrorMemory.clear(); 
    window.mCurrentStage = 0; 
    loadMarathonTable();
    
    let count = 3; 
    cd.innerText = count;
    playSfx(400, 'sine', 0.1); // İlk "3" der demez ses çalar
    
    const interval = setInterval(() => {
        count--;
        if (count > 0) { 
            cd.innerText = count; 
            playSfx(400, 'sine', 0.1); 
        } else { 
            clearInterval(interval); 
            document.getElementById('marathon-countdown-overlay').style.display = 'none'; 
            startMarathonTimer(); 
        }
    }, 1000);
};

// SAYACI VE PUANI BAŞLATIR
function startMarathonTimer() {
    document.getElementById('pause-btn').classList.add('ui-visible');
    document.getElementById('timer-display').classList.add('ui-visible');
    document.getElementById('live-total-score').classList.add('ui-visible');
    
    window.mStartTime = Date.now();
    window.mTimerInterval = setInterval(() => {
        if (!window.mIsPaused) {
            window.mElapsedTime = (Date.now() - window.mStartTime) / 1000;
            document.getElementById('timer-display').innerText = window.mElapsedTime.toFixed(2);
            let score = Math.max(0, Math.round(100 - (window.mElapsedTime > 45 ? (window.mElapsedTime-45)*2 : 0) - (window.mErrorMemory.size * 2)));
            document.getElementById('live-total-score').innerText = score;
        }
    }, 50);
}

window.toggleMarathonPause = function() {
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    window.mIsPaused = !window.mIsPaused;
    if (!window.mIsPaused) {
        window.mStartTime = Date.now() - (window.mElapsedTime * 1000);
    }
};

function buildMarathonDataForBab(maziRef) {
    let rootSafe = currentRoot || "فعل";
    
    let mapping = typeof getBabAndType === 'function' ? getBabAndType(maziRef) : { babNo: 1 };
    let babNo = mapping.babNo;
    let vObj = typeof babVezinleri !== 'undefined' ? babVezinleri[babNo] : null;
    
    let mKalip = vObj ? vObj.mazi : "فَعَلَ";
    let muKalip = vObj ? vObj.muzari : "يَفْعُلُ";
    let eKalip = vObj ? vObj.emir : "اُفْعُلْ";

    let muzariRef = maziRef + 1;
    let emirRef = maziRef + 2;

    if (maziRef === 1) {
        muzariRef = 2; emirRef = 3;
        if (typeof wordEasterEggs !== 'undefined' && wordEasterEggs[rootSafe]) {
            if (wordEasterEggs[rootSafe][4]) { muzariRef = 4; emirRef = 5; }
            else if (wordEasterEggs[rootSafe][6]) { muzariRef = 6; emirRef = 7; }
        }
    }

    // MERKEZİ MOTOR KULLANILIYOR
    let maziList = VerbGenerator.generateVerbList(rootSafe, babNo, 'mazi', mKalip, maziRef);
    let muzariList = VerbGenerator.generateVerbList(rootSafe, babNo, 'muzari', muKalip, muzariRef);
    let emirList = VerbGenerator.generateVerbList(rootSafe, babNo, 'emir', eKalip, emirRef);

    let mLen = maziList.length, muLen = muzariList.length, eLen = emirList.length;
    window.mRanges = [[0, mLen], [mLen, mLen + muLen], [mLen + muLen, mLen + muLen + eLen]];
    
    window.mActiveSet = [...maziList, ...muzariList, ...emirList]
                        .map(w => typeof w === 'object' ? w.ar : w)
                        .map(w => w.replace(/[\u200B-\u200D\uFEFF\s]/g, ''));
}

// ===============================================================
// MARATON (KRONOMETRE) ARAYÜZ YARDIMCI FONKSİYONLARI
// ===============================================================
window.loadMarathonTable = function() {
    const table = document.getElementById('table-view');
    if (!table) return;
    table.innerHTML = '';
    
    const start = window.mRanges[window.mCurrentStage][0];
    const end = window.mRanges[window.mCurrentStage][1];
    
    const stageLabel = document.getElementById('stage-label');
    if (stageLabel) stageLabel.innerText = ["MAZİ", "MUZARİ", "EMİR"][window.mCurrentStage];

    window.mActiveSet.slice(start, end).forEach((w, i) => {
        const absoluteIdx = start + i;
        const div = document.createElement('div');
        
        // YENİ EKLENEN: Maraton için Ben/Biz satırı kontrolü
        let rowIndex = Math.floor(i / 3);
        let rowClass = (rowIndex === 4) ? 'mutekellim-row' : ((rowIndex % 2 === 0) ? 'muez-row' : 'mue-row');
        
        div.className = 'marathon-cell ' + rowClass;
        if(window.mErrorMemory.has(absoluteIdx)) div.classList.add('error-active');
        
        div.innerHTML = typeof ColorEngine !== 'undefined' ? ColorEngine.colorize(w, currentRoot.split("")) : w;
        
        div.onclick = function() {
            if (window.mErrorMemory.has(absoluteIdx)) {
                window.mErrorMemory.delete(absoluteIdx);
                this.classList.remove('error-active');
                if (typeof playSfx === 'function') playSfx(400, 'sine', 0.1); 
            } else {
                window.mErrorMemory.add(absoluteIdx);
                this.classList.add('error-active');
                if (typeof playSfx === 'function') playSfx(150, 'sawtooth', 0.2); 
            }
        };
        table.appendChild(div);
    });

    const prevArr = document.getElementById('prev-arr');
    const nextArr = document.getElementById('next-arr');
    if (prevArr) prevArr.disabled = (window.mCurrentStage === 0);
    if (nextArr) nextArr.innerText = (window.mCurrentStage === 2) ? "✓" : "❯";
};

window.changeMarathonStage = function(dir) {
    if (window.mCurrentStage === 2 && dir === 1) { finishMarathon(); return; }
    window.mCurrentStage += dir;
    window.loadMarathonTable();
};

function finishMarathon() {
    clearInterval(window.mTimerInterval);
    const finalScore = document.getElementById('final-score');
    const liveScore = document.getElementById('live-total-score');
    if (finalScore && liveScore) finalScore.innerText = liveScore.innerText;
    
    const errList = document.getElementById('error-list');
    if (errList) {
        errList.innerHTML = '';
        window.mErrorMemory.forEach(idx => {
            const item = document.createElement('div');
            item.className = 'error-item'; 
            item.innerHTML = typeof ColorEngine !== 'undefined' ? ColorEngine.colorize(window.mActiveSet[idx], currentRoot.split("")) : window.mActiveSet[idx];
            errList.appendChild(item);
        });
    }
    showMarathonScreen('screen-result');
    hideMarathonHeaders();
}

function hideMarathonHeaders() {
    const el1 = document.getElementById('stage-label');
    const el2 = document.getElementById('pause-btn');
    const el3 = document.getElementById('timer-display');
    const el4 = document.getElementById('live-total-score');
    
    if (el1) el1.classList.remove('ui-visible');
    if (el2) el2.classList.remove('ui-visible');
    if (el3) el3.classList.remove('ui-visible');
    if (el4) el4.classList.remove('ui-visible');
}

function showMarathonScreen(id) {
    document.querySelectorAll('.marathon-screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    
    const arrows = document.querySelectorAll('.nav-arrow');
    arrows.forEach(a => a.style.display = (id === 'screen-play' ? 'block' : 'none'));
}

// ==================================================================
// KLAVYE HATA DÜZELTMELERİ (KALEM BUTONU VE HEMZE KAPANMA ZEKASI)
// ==================================================================

// 1. Kalem Butonunun Ana Klavyeyi Hatasız Açmasını Sağlayan Kök Fonksiyon
window.openKeyboard = function() {
    // Hafızayı ve ekranı temizle
    currentRoot = "";
    const tempDisp = document.getElementById('temp-root-display');
    if (tempDisp) tempDisp.innerText = "";
    if (typeof updateTempDisplay === 'function') updateTempDisplay();
    if (typeof resetTableOnly === 'function') resetTableOnly(true);
    if (typeof clearDraggableRoots === 'function') clearDraggableRoots();
    if (typeof highlightEasterEggBoxes === 'function') highlightEasterEggBoxes("");

    // Klavyeyi ve Siyah Ekranı Aç
    const overlay = document.getElementById('keyboard-overlay');
    if (overlay) overlay.style.display = 'flex';
    
    if (typeof toggleKB === 'function') toggleKB(true);
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    // Klavyedeki tahminleri de sıfırlayarak hazır hale getir
    if (typeof updateMainKeyboardPredictions === 'function') updateMainKeyboardPredictions();
};

// 2. Uzun Basma (Hemze) Menüsünü Boşluğa Tıklayınca Kapatan Küresel Gözlemci
const closeVariationsMenu = (e) => {
    const menu = document.getElementById('key-variations-menu');
    // Eğer ekranda hemze menüsü açıksa ve tıklanan yer menünün/tuşların kendisi değilse menüyü yok et!
    if (menu && !menu.contains(e.target) && !e.target.classList.contains('uni-key') && !e.target.classList.contains('key') && !e.target.classList.contains('search-key')) {
        menu.remove();
        window.isLongPress = false; // Basılı tutma hafızasını da sıfırla
    }
};

// Tarayıcıdaki tüm tıklama ve dokunma olaylarına bu gözlemciyi ekliyoruz
document.addEventListener('click', closeVariationsMenu);
document.addEventListener('touchstart', closeVariationsMenu, { passive: true });