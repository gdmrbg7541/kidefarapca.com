const letters = "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" ");
let currentRoot = ""; 
let isReadyVerbMode = false; 

const arabicKeyMap = {
    '"': 'ذ', 'q':'ض', 'w':'ص', 'e':'ث', 'r':'ق', 't':'ف', 'y':'غ', 'u':'ع', 'ı':'ه', 'o':'خ', 'p':'ح', 'ğ':'ج', 'ü':'د',
    'a':'ش', 's':'س', 'd':'ي', 'f':'ب', 'g':'ل', 'h':'ا', 'j':'ت', 'k':'ن', 'l':'م', 'ş':'ك', 'i':'ط',
    'z':'ئ', 'x':'ء', 'c':'ؤ', 'v':'ر', 'b':'لا', 'n':'ى', 'm':'ة', 'ö':'ز', 'ç':'ظ'
};

const readyVerbTargets = [21, 17, 50, 56, 61, 51, 55, 49];
let targetStates = {}; 

let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 60; 
let currentTabActive = 0;    

let lastWheelTime = 0;
const wheelCooldown = 600; 

let lastClickedBoxTextSpan = null;
let lastOriginalWord = "";

const babVezinleri = {
    1: { mazi: "فَعَلَ", muzari: "يَفْعُلُ", emir: "أُفْعُلْ" },
    2: { mazi: "فَعَلَ", muzari: "يَفْعِلُ", emir: "اِفْعِلْ" },
    3: { mazi: "فَعَلَ", muzari: "يَفْعَلُ", emir: "اِفْعَلْ" },
    4: { mazi: "فَعِلَ", muzari: "يَفْعَلُ", emir: "اِفْعَلْ" },
    5: { mazi: "فَعُلَ", muzari: "يَفْعُلُ", emir: "أُفْعُلْ" },
    6: { mazi: "فَعِلَ", muzari: "يَفْعِلُ", emir: "اِفْعِلْ" },
    7: { mazi: "أَفْعَلَ", muzari: "يُفْعِلُ", emir: "أَفْعِلْ" },      
    8: { mazi: "فَعَّلَ", muzari: "يُفَعِّلُ", emir: "فَعِّلْ" },      
    9: { mazi: "فَاعَلَ", muzari: "يُفَاعِلُ", emir: "فَاعِلْ" },    
    10: { mazi: "انْفَعَلَ", muzari: "يَنْفَعِلُ", emir: "انْفَعِلْ" },  
    11: { mazi: "اِفْتَعَلَ", muzari: "يَفْتَعِلُ", emir: "افْتَعِلْ" },  
    12: { mazi: "افْعَلَّ", muzari: "يَفْعَلُّ", emir: "افْعَلِلْ" },    
    13: { mazi: "تَفَعَّلَ", muzari: "يَتَفَعَّلُ", emir: "تَفَعَّلْ" },  
    14: { mazi: "تَفَاعَلَ", muzari: "يَتَفَاعَلُ", emir: "تَفَاعَلْ" },  
    15: { mazi: "اِسْتَفْعَلَ", muzari: "يَسْتَفْعِلُ", emir: "اسْتَفْعِلْ" } 
};

const sigaSablonlari = {
    mazi: [
        { ek: "َ", etiket: "Müfred Müzekker Gâib" },
        { ek: "َا", etiket: "Tesniye Müzekker Gâib" },
        { ek: "ُوا", etiket: "Cemi Müzekker Gâib" },
        { ek: "َتْ", etiket: "Müfred Müennes Gâibe" },
        { ek: "َتَا", etiket: "Tesniye Müennes Gâibe" },
        { ek: "ْنَ", etiket: "Cemi Müennes Gâibe" },
        { ek: "ْتَ", etiket: "Müfred Müzekker Muhâtab" },
        { ek: "ْتُمَا", etiket: "Tesniye Müzekker Muhâtab" },
        { ek: "ْتُمْ", etiket: "Cemi Müzekker Muhâtab" },
        { ek: "ْتِ", etiket: "Müfred Müennes Muhâtabe" },
        { ek: "ْتُمَا", etiket: "Tesniye Müennes Muhâtabe" },
        { ek: "ْتُنَّ", etiket: "Cemi Müennes Muhâtabe" },
        { ek: "ْتُ", etiket: "Müfred Mütekellim (Ben)" },
        { ek: "ْنَا", etiket: "Cemi Mütekellim (Biz)" },
        { ek: "ْنَا", etiket: "Cemi Mütekellim (Biz - Muazzam)" }
    ],
    muzari: [
        { prefix: "يَ", suffix: "ُ", etiket: "Müfred Müzekker Gâib" },
        { prefix: "يَ", suffix: "َانِ", etiket: "Tesniye Müzekker Gâib" },
        { prefix: "يَ", suffix: "ُونَ", etiket: "Cemi Müzekker Gâib" },
        { prefix: "تَ", suffix: "ُ", etiket: "Müfred Müennes Gâibe" },
        { prefix: "تَ", suffix: "َانِ", etiket: "Tesniye Müennes Gâibe" },
        { prefix: "يَ", suffix: "ْنَ", etiket: "Cemi Müennes Gâibe" },
        { prefix: "تَ", suffix: "ُ", etiket: "Müfred Müzekker Muhâtab" },
        { prefix: "تَ", suffix: "َانِ", etiket: "Tesniye Müzekker Muhâtab" },
        { prefix: "تَ", suffix: "ُونَ", etiket: "Cemi Müzekker Muhâtab" },
        { prefix: "تَ", suffix: "ِينَ", etiket: "Müfred Müennes Muhâtabe" },
        { prefix: "تَ", suffix: "َانِ", etiket: "Tesniye Müennes Muhâtabe" },
        { prefix: "تَ", suffix: "ْنَ", etiket: "Cemi Müennes Muhâtabe" },
        { prefix: "أَ", suffix: "ُ", etiket: "Müfred Mütekellim (Ben)" },
        { prefix: "نَ", suffix: "ُ", etiket: "Cemi Mütekellim (Biz)" },
        { prefix: "نَ", suffix: "ُ", etiket: "Cemi Mütekellim (Biz - Muazzam)" }
    ],
    emir: [
        { suffix: "ْ", etiket: "Müfred Müzekker Muhâtab" },
        { suffix: "َا", etiket: "Tesniye Müzekker Muhâtab" },
        { suffix: "ُوا", etiket: "Cemi Müzekker Muhâtab" },
        { suffix: "ِي", etiket: "Müfred Müennes Muhâtabe" },
        { suffix: "َا", etiket: "Tesniye Müennes Muhâtabe" },
        { suffix: "ْنَ", etiket: "Cemi Müennes Muhâtabe" }
    ]
};

const SoundEngine = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },
    playClick() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    },
    playClose() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    },
    playReset() {
        this.init();
        const now = this.ctx.currentTime;
        [440, 880].forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + (index * 0.04));
            osc.frequency.linearRampToValueAtTime(freq * 1.5, now + 0.15 + (index * 0.04));
            gain.gain.setValueAtTime(0.08, now + (index * 0.04));
            gain.gain.linearRampToValueAtTime(0.001, now + 0.18 + (index * 0.04));
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + (index * 0.04));
            osc.stop(now + 0.18 + (index * 0.04));
        });
    }
};

window.onload = function() {
    const zoomCheckbox = document.getElementById('zoomToggleCheckbox');
    if (zoomCheckbox) {
        zoomCheckbox.checked = false;
    }

    document.querySelectorAll('.glass-box').forEach((box) => {
        const textEl = box.querySelector('.ar, .ar-small');
        if (textEl) {
            if (!textEl.hasAttribute('data-original')) {
                textEl.setAttribute('data-original', textEl.innerText);
            }
            box.style.cursor = "pointer";
            
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
    const isInside = e.target.closest('.conjugation-inline-container') || e.target.closest('.glass-box');
    if (!isInside) {
        document.querySelectorAll('.glass-box.matrix-opened').forEach(box => {
            const closeBtn = box.querySelector('.matrix-close-btn');
            if (closeBtn) closeInlineMatrix(null, closeBtn);
        });
    }
}

function handleSwipeGesture() {
    const distance = touchStartX - touchEndX;
    if (Math.abs(distance) > minSwipeDistance) {
        if (distance > 0 && currentTabActive === 1) { setTab(0); } 
        else if (distance < 0 && currentTabActive === 0) { setTab(1); }
    }
}

function setTab(tabIndex) {
    SoundEngine.playClick(); 
    const band = document.getElementById('mainSliderBandi');
    const switcher = document.getElementById('tabSwitch');
    
    const tab1 = document.getElementById('tab1');
    const tab2 = document.getElementById('tab2');
    
    currentTabActive = tabIndex;

    if (tabIndex === 1) {
        switcher.classList.remove("mucerred-active");
        switcher.classList.add("mezid-active");
        band.style.transform = "translateX(50%)"; 
        band.style.height = tab2.offsetHeight + "px"; 
    } else {
        switcher.classList.remove("mezid-active");
        switcher.classList.add("mucerred-active");
        band.style.transform = "translateX(0%)";  
        band.style.height = tab1.offsetHeight + "px"; 
    }
}

function openVerbModal() {
    SoundEngine.playClick();
    document.getElementById('verb-overlay').style.display = 'flex';
}

function closeVerbModal() {
    SoundEngine.playClose();
    document.getElementById('verb-overlay').style.display = 'none';
}

function selectReadyVerb(verb) {
    SoundEngine.playReset();
    resetTableOnly(true); 
    
    const trimmedRoot = verb.trim();
    if (trimmedRoot.length !== 3) return;
    
    currentRoot = trimmedRoot;
    isReadyVerbMode = true;
    document.getElementById('root-text-display').innerText = verb;
    
    document.querySelectorAll('.glass-box').forEach(box => {
        const refEl = box.querySelector('.ref');
        if (refEl) {
            const refId = parseInt(refEl.innerText);
            
            if (readyVerbTargets.includes(refId)) {
                box.style.backgroundColor = "";
                box.style.borderColor = "";
                box.removeAttribute('data-modal-closed');
                box.classList.add('hidden-mode'); 
                targetStates[refId] = 0; 
                
                const textEl = box.querySelector('.ar, .ar-small');
                if (textEl) {
                    textEl.innerText = textEl.getAttribute('data-original'); 
                }
            }
        }
    });
    closeVerbModal();
    highlightEasterEggBoxes(currentRoot);
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

function resetBox(el) {
    const textEl = el.querySelector('.ar, .ar-small');
    if (!textEl) return;
    
    const originalText = el.getAttribute('data-original') || textEl.innerText;
    textEl.innerText = originalText;
    
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
    
    const plusBtn = document.querySelector('.fa-plus');
    if (plusBtn) plusBtn.classList.remove('plus-highlighted');
    
    if (el.hasAttribute('data-tiklama-sayisi')) {
        el.setAttribute('data-tiklama-sayisi', '0');
    }

    if (currentRoot && currentRoot.length === 3) {
        highlightEasterEggBoxes(currentRoot);
    }
}

function handleBoxClick(boxElement) {
    const textEl = boxElement.querySelector('.ar, .ar-small');
    const refEl = boxElement.querySelector('.ref');
    if (!textEl || !refEl) return;

    const currentRootSafe = (typeof currentRoot !== 'undefined') ? currentRoot : "";
    const refId = parseInt(refEl.innerText);
    const kalip = boxElement.getAttribute('data-original');

    lastClickedBoxTextSpan = textEl;
    lastOriginalWord = textEl.innerText.trim();

    clearOtherActiveBoxes(boxElement);

    if (boxElement.getAttribute('data-modal-closed') === 'true') {
        boxElement.removeAttribute('data-modal-closed');
        SoundEngine.playClose();
        resetBox(boxElement);
        return;
    }

    if (boxElement.hasAttribute('data-tiklama-sayisi')) {
        let tiklama = parseInt(boxElement.getAttribute('data-tiklama-sayisi') || '0');
        const mapping = getBabAndType(refId);

        if (tiklama === 0) {
            SoundEngine.playClick();
            const vezinObj = babVezinleri[mapping.babNo];
            let kalipMetni = (vezinObj && vezinObj[mapping.type]) ? vezinObj[mapping.type] : kalip;
            textEl.innerText = (currentRootSafe.length === 3) ? applyRootToKalip(currentRootSafe, kalipMetni) : kalipMetni;
            lastOriginalWord = textEl.innerText.trim();
            
            triggerAreaPulse(boxElement);
            boxElement.setAttribute('data-tiklama-sayisi', '1');
            checkWordEasterEgg(boxElement);
        } 
        else if (tiklama === 1) {
            const vezinObj = babVezinleri[mapping.babNo];
            let anaVezin = (vezinObj && vezinObj[mapping.type]) ? vezinObj[mapping.type] : kalip;
            openConjugationPopup(currentRootSafe, mapping.babNo, mapping.type, anaVezin);
            boxElement.setAttribute('data-tiklama-sayisi', '2');
        } 
        else {
            SoundEngine.playClose();
            resetBox(boxElement); 
        }
        return;
    }
    applyToSpecificBox(boxElement);
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
            container.style.display = 'none';
        }

        if (boxElement.hasAttribute('data-tiklama-sayisi')) {
            boxElement.setAttribute('data-tiklama-sayisi', '2');
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
        targetEl.innerText = kalip; 
        boxElement.style.backgroundColor = "";
        boxElement.style.borderColor = "";
        boxElement.style.boxShadow = ""; 
        lastOriginalWord = kalip;
        
        const triggerBtn = boxElement.querySelector('.easter-egg-trigger');
        if (triggerBtn) {
            triggerBtn.remove();
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
    targetEl.innerText = (currentRootSafe.length === 3) ? applyRootToKalip(currentRootSafe, kalip) : kalip;
    
    lastOriginalWord = targetEl.innerText.trim();
    triggerAreaPulse(boxElement); 
    checkWordEasterEgg(boxElement);
}

function applyRootToKalip(root, kalip) {
    if (!root || root.length !== 3) return kalip;
    const r = root.split(""); 
    
    let result = kalip;
    result = result.replace(/ف/g, "===F===");
    result = result.replace(/ع/g, "===A===");
    result = result.replace(/ل/g, "===L===");
    
    result = result.replace(/===F===/g, r[0]);
    result = result.replace(/===A===/g, r[1]);
    result = result.replace(/===L===/g, r[2]);
    
    return result;
}

function openConjugationPopup(kok, babNo, tip, anaVezin) {
    SoundEngine.playClick();
    
    if (!kok || kok.length !== 3) {
        kok = "فعل"; 
    }

    if (!lastClickedBoxTextSpan) return;
    const boxElement = lastClickedBoxTextSpan.closest('.glass-box');
    if (!boxElement) return;

   document.querySelectorAll('.glass-box').forEach(box => {
        box.style.zIndex = "1";
    });

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

    setTimeout(() => {
        if (boxElement) boxElement.classList.remove('no-transition');
    }, 50);

    let inlineContainer = boxElement.querySelector('.conjugation-inline-container');
    if (!inlineContainer) {
        inlineContainer = document.createElement('div');
        inlineContainer.className = 'conjugation-inline-container';
        boxElement.appendChild(inlineContainer);
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const tableWidth = 420;
    const estimatedTableHeight = 410; 
    
    let rect = boxElement.getBoundingClientRect();
    
    let targetLeft = -tableWidth - 60;
    let globalLeft = rect.left + targetLeft;
    if (globalLeft < 10) {
        targetLeft = 10 - rect.left;
    }
    inlineContainer.style.left = `${targetLeft}px`;

    let targetTop = (windowHeight / 2) - (estimatedTableHeight / 2) - rect.top;
    let globalTop = rect.top + targetTop;
    let globalBottom = globalTop + estimatedTableHeight;
    if (globalTop < 10) {
        targetTop = 10 - rect.top;
    } else if (globalBottom > windowHeight - 10) {
        targetTop = (windowHeight - estimatedTableHeight - 10) - rect.top;
    }

    inlineContainer.style.top = `${targetTop}px`;
    
    const tabanKelime = applyRootToKalip(kok, anaVezin);
    let stem = tabanKelime.replace(/[َُِّْ]$/, "");
    let kelimeListesi = [];

    const list = sigaSablonlari[tip];
    list.forEach(siga => {
        let cekilmisKelime = "";
        
       if (tip === 'muzari') {
            let r1 = kok[0]; let r2 = kok[1]; let r3 = kok[2];
            
            let aynHareke = "ُ"; 
            if (babNo === 7) {
                aynHareke = "ِ"; 
            } else if (anaVezin.includes("يَفْعِلُ")) {
                aynHareke = "ِ";
            } else if (anaVezin.includes("يَفْعَلُ") || anaVezin.includes("يَفْتَعِلُ") || anaVezin.includes("يَنْفَعِلُ")) {
                aynHareke = "َ";
            }
            
            let prefix = siga.prefix;
            if (babNo === 7) prefix = "يُ";       
            else if (babNo === 8) prefix = "يُ";  
            else if (babNo === 9) prefix = "يُ";  
            else if (babNo === 13) prefix = "يَتَ"; 
            else if (babNo === 14) prefix = "يَتَ"; 

            let coreWord = r1 + "ْ" + r2 + aynHareke + r3;
            
            if (babNo === 7) coreWord = r1 + "ْ" + r2 + aynHareke + r3; 
            else if (babNo === 8) coreWord = r1 + "َ" + r2 + "ِّ" + r3;
            else if (babNo === 9) coreWord = r1 + "َ" + "ا" + r2 + "ِ" + r3;
            else if (babNo === 10) coreWord = "نْ" + r1 + "َ" + r2 + "ِ" + r3; 
            else if (babNo === 11) coreWord = r1 + "ْتَ" + r2 + "ِ" + r3;    
            else if (babNo === 15) coreWord = "سْتَ" + r1 + "ْ" + r2 + "ِ" + r3;
            
            let currentPrefix = prefix;
            if (siga.prefix === 'تَ') {
                currentPrefix = (babNo === 13 || babNo === 14) ? "تَتَ" : ((babNo === 7 || babNo === 8 || babNo === 9) ? "تُ" : "تَ");
            } else if (siga.prefix === 'أَ') {
                currentPrefix = (babNo === 13 || babNo === 14) ? "أَتَ" : ((babNo === 7 || babNo === 8 || babNo === 9) ? "أُ" : "أَ");
            } else if (siga.prefix === 'نَ') {
                currentPrefix = (babNo === 13 || babNo === 14) ? "نَتَ" : ((babNo === 7 || babNo === 8 || babNo === 9) ? "نُ" : "نَ");
            }
            cekilmisKelime = currentPrefix + coreWord + siga.suffix;
        } 
        else if (tip === 'mazi') {
            cekilmisKelime = stem + siga.ek;
        } 
        else if (tip === 'emir') {
            let r1 = kok[0]; let r2 = kok[1]; let r3 = kok[2];
            let emirPrefix = "اِ";
            if (anaVezin.startsWith("أُ")) emirPrefix = "أُ";
            else if (anaVezin.startsWith("أَ")) emirPrefix = "أَ";
            else if (babNo === 8 || babNo === 9 || babNo === 13 || babNo === 14) emirPrefix = ""; 

            let aynHareke = "ِ";
            if (anaVezin.includes("أُفْعُلْ")) aynHareke = "ُ";
            else if (anaVezin.includes("اِفْعَلْ")) aynHareke = "َ";

            let coreEmir = r1 + "ْ" + r2 + aynHareke + r3;
            if (babNo === 8) coreEmir = r1 + "َ" + r2 + "ِّ" + r3;
            else if (babNo === 9) coreEmir = r1 + "َ" + "ا" + r2 + "ِ" + r3;
            else if (babNo === 13) coreEmir = "تَ" + r1 + "َ" + r2 + "َّ" + r3;
            else if (babNo === 14) coreEmir = "تَ" + r1 + "َ" + "ا" + r2 + "َ" + r3;
            else if (babNo === 10) coreEmir = "نْ" + r1 + "َ" + r2 + "ِ" + r3;
            else if (babNo === 11) coreEmir = r1 + "ْتَ" + r2 + "ِ" + r3;
            else if (babNo === 15) coreEmir = "سْتَ" + r1 + "ْ" + r2 + "ِ" + r3;

            cekilmisKelime = emirPrefix + coreEmir + siga.suffix;
        }
        kelimeListesi.push(cekilmisKelime);
    });

    let html = `<div class="matrix-close-btn" onclick="closeInlineMatrix(event, this)">✕</div>`;
    html += `<table class="conjugation-table">`;
    html += `<thead><tr><th>Müfred</th><th>Tesniye</th><th>Cemi</th></tr></thead><tbody>`;

    let totalItems = kelimeListesi.length;
    for (let i = 0; i < totalItems; i += 3) {
        let rowIndex = i / 3;
        let bgColor = '#ffffff'; 
        
        if (rowIndex === 0 || rowIndex === 2) {
            bgColor = '#e3f2fd'; 
        } else if (rowIndex === 1 || rowIndex === 3) {
            bgColor = '#fce4ec'; 
        }

        html += `<tr>
                    <td style="background-color: ${bgColor} !important;"><span class="siga-text">${kelimeListesi[i] || ''}</span></td>
                    <td style="background-color: ${bgColor} !important;"><span class="siga-text">${kelimeListesi[i+1] || ''}</span></td>
                    <td style="background-color: ${bgColor} !important;"><span class="siga-text">${kelimeListesi[i+2] || ''}</span></td>
                 </tr>`;
    }
    html += `</tbody></table>`;
    
    inlineContainer.innerHTML = html;
const expandBtn = document.createElement('div');
expandBtn.className = 'matrix-expand-btn';
expandBtn.title = 'Tam Ekran';
expandBtn.innerHTML = '<i class="fas fa-expand"></i>';

expandBtn.onclick = function(event) {
    openMatrixFullscreen(event, this);
};

inlineContainer.appendChild(expandBtn);
    
    boxElement.style.zIndex = "999999"; 
    boxElement.classList.add('matrix-opened');
}

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

function openKeyboard() {
    SoundEngine.playClick(); 
    resetTableOnly(true);     
    toggleKB(true);
}

function closeKeyboard() {
    SoundEngine.playClose(); 
    toggleKB(false);
}

function addLetter(char) {
    if (currentRoot.length < 3) {
        SoundEngine.playClick(); 
        currentRoot += char;
        updateTempDisplay();
        highlightKey(char);
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
    }
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
        highlightEasterEggBoxes(currentRoot); 
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
    if (!isSilent) {
        SoundEngine.playReset(); 
    }
    isReadyVerbMode = false;
    targetStates = {};

    document.querySelectorAll('.glass-box').forEach(box => {
        box.classList.remove('hidden-mode');
        box.classList.remove("pulse-highlight"); 
        box.classList.remove('matrix-opened');
        box.removeAttribute('data-modal-closed');
        
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
            if (original) el.innerText = original;
        }
        const container = box.querySelector('.conjugation-inline-container');
        if (container) container.innerHTML = '';
    });
    
    const rootDisplay = document.getElementById('root-text-display');
    if (rootDisplay) {
        rootDisplay.innerText = "KÖK GİR";
    }
    currentRoot = "";
    lastClickedBoxTextSpan = null;
    lastOriginalWord = "";
    
    const plusBtn = document.querySelector('.fa-plus');
    if (plusBtn) plusBtn.classList.remove('plus-highlighted');

    highlightEasterEggBoxes(""); 
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

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (e) => {
        const menu = document.getElementById("suffix-dropdown");
        if (menu && menu.style.display !== "none") {
            if (!menu.contains(e.target) && !e.target.closest('.fa-plus')) {
                menu.style.display = "none";
            }
        }
    });
});

function toggleSuffixMenu(e) {
    e.stopPropagation();
    const menu = document.getElementById("suffix-dropdown");
    
    const plusBtn = document.querySelector('.fa-plus');
    if (plusBtn) plusBtn.classList.remove('plus-highlighted');
    
    if (menu.style.display === "flex") {
        menu.style.display = "none";
        return;
    }
    
    const rect = e.target.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY + 8}px`;
    menu.style.left = `${rect.left + window.scrollX - 40}px`; 
    menu.style.display = "flex";
}

function applySuffix(suffix) {
    const menu = document.getElementById("suffix-dropdown");
    if (menu) menu.style.display = "none";

    if (!lastClickedBoxTextSpan) {
        if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
        return; 
    }

    const currentBox = lastClickedBoxTextSpan.closest(".glass-box");
    
    if (currentBox && currentBox.classList.contains("is-verb")) {
        if(typeof SoundEngine !== "undefined") SoundEngine.playClose();
        return; 
    }

    let currentWord = lastOriginalWord || lastClickedBoxTextSpan.innerText;
    
    const plurals = ['يَّات', 'ينَ', 'ونَ', 'ات', 'ا'];
    const basePlurals = ['ينَ', 'ونَ', 'ات', 'ا']; 
    const nisbaSuffixes = ['يَّات', 'يَّة', 'يّ']; 

    if (nisbaSuffixes.includes(suffix)) {
        const hasPlural = basePlurals.some(p => currentWord.endsWith(p));
        if (hasPlural) {
            if(typeof SoundEngine !== "undefined") SoundEngine.playClose(); 
            return; 
        }
    }

    if (basePlurals.includes(suffix)) {
        for (let n of nisbaSuffixes) {
            if (currentWord.endsWith(n)) {
                currentWord = currentWord.slice(0, -n.length);
                break; 
            }
        }
    }

    if (currentWord.endsWith('يَّة')) {
        currentWord = currentWord.slice(0, -'يَّة'.length);
    } 
    else if (currentWord.endsWith('ة')) {
        currentWord = currentWord.slice(0, -1);
    }

    if (plurals.includes(suffix) || suffix === 'ة') {
        for (let p of plurals) {
            if (currentWord.endsWith(p)) {
                currentWord = currentWord.slice(0, -p.length);
                break; 
            }
        }
    }

    function setLastVowel(word, targetVowel) {
        const vowelRegex = /[\u064B-\u0650\u0652]$/; 
        if (vowelRegex.test(word)) {
            word = word.replace(vowelRegex, ''); 
        }
        return word + targetVowel; 
    }

    if (suffix === 'ة' || suffix === 'ات') {
        currentWord = setLastVowel(currentWord, 'َ'); 
    } 
    else if (nisbaSuffixes.includes(suffix) || suffix === 'ينَ') {
        currentWord = setLastVowel(currentWord, 'ِ'); 
    }
    else if (suffix === 'ونَ') {
        currentWord = setLastVowel(currentWord, 'ُ'); 
    }
    else if (suffix === 'ا') {
        currentWord = setLastVowel(currentWord, 'ً'); 
    }

    let updatedWord = currentWord + suffix;
    lastClickedBoxTextSpan.innerText = updatedWord;
    lastOriginalWord = updatedWord;
    
    if(typeof SoundEngine !== "undefined") SoundEngine.playClick();

    // Suffix (ek) kontrolünü yolluyoruz
    if (typeof checkWordEasterEgg === "function") {
        checkWordEasterEgg(currentBox, suffix);
    }

    if (currentBox) {
        currentBox.style.setProperty("border-color", "#00FF00", "important");
        currentBox.style.setProperty("box-shadow", "0 0 10px #00FF00", "important");
        
        // Eklendikten sonra büyütme efektini çalıştır (eğer ekli kelimenin sürprizi varsa)
        let forceDelay = false;
        if (currentRoot && currentRoot.length === 3) {
            const refEl = currentBox.querySelector('.ref');
            if (refEl) {
                const refId = parseInt(refEl.innerText);
                if (wordEasterEggs[currentRoot] && wordEasterEggs[currentRoot][refId] && wordEasterEggs[currentRoot][refId][suffix]) {
                    forceDelay = true;
                }
            }
        }

        if (typeof triggerAreaPulse === "function") triggerAreaPulse(currentBox, forceDelay);
        
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
    lastClickedBoxTextSpan = null;
    lastOriginalWord = "";
    const menu = document.getElementById("suffix-dropdown");
    if (menu) menu.style.display = "none";

    document.querySelectorAll('.easter-egg-trigger').forEach(btn => btn.remove());
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


const wordEasterEggs = {
    // 1. K-T-B (ك ت ب) KÖKÜ - Yazmak
    "كتب": {
        
        // --- 1 Numaralı Kalıp (Mazi: فَعَلَ) ---
        1: { 
            base: { // Kök Hali: كَتَبَ
                emoji: "✍️", 
                arText: "كَتَبَ رِسَالَةً", 
                trText: "Bir mektup yazdı." 
            } 
        },

        // --- 2 Numaralı Kalıp (Muzari: يَفْعُلُ) ---
        2: { 
            base: { // Kök Hali: يَكْتُبُ
                emoji: "✏️", 
                arText: "يَكْتُبُ بِالْقَلَمِ", 
                trText: "Kalemle yazıyor." 
            } 
        },

        // --- 3 Numaralı Kalıp (Emir: أُفْعُلْ) ---
        3: { 
            base: { // Kök Hali: اُكْتُبْ
                emoji: "❗", 
                arText: "اُكْتُبْ وَاجِبَكَ", 
                trText: "Ödevini yaz." 
            } 
        },

        // --- 23 Numaralı Kalıp (فِعَال) ---
        23: { 
            base: { // Kök Hali: كِتَاب
                emoji: "📖", 
                arText: "خَيْرُ جَلِيسٍ فِي الزَّمَانِ كِتَابٌ", 
                trText: "Zamanın en hayırlı dostu (arkadaşı) kitaptır." 
            }, 
            suggestsPlus: true, // Öğrenciye '+' butonuna basmasını önerir
            "ة": { // Ek Almış Hali: كِتَابَة
                emoji: "✍️", 
                arText: "كِتَابَة", 
                trText: "Yazı yazmak." 
            } 
        },

        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { // Kök Hali: كَاتِب
                emoji: "📝", 
                arText: "كَاتِب", 
                trText: "Yazar / Katip." 
            } 
        },

        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { // Kök Hali: مَكْتُوب
                emoji: "✉️", 
                arText: "المَكْتُوبُ يُقْرَأُ مِنْ عُنْوَانِهِ", 
                trText: "Mektup adresinden belli olur. (Perşembenin gelişi çarşambadan bellidir)" 
            } 
        },

        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { // Kök Hali: مَكْتَب
                emoji: "🏢", 
                arText: "مَكْتَب", 
                trText: "Ofis / Masa." 
            }, 
            suggestsPlus: true, // Öğrenciye '+' butonuna basmasını önerir
            "ة": { // Ek Almış Hali: مَكْتَبَة
                emoji: "📚", 
                arText: "مَكْتَبَة", 
                trText: "Kütüphane." 
            } 
        }
    },
  // ==================================================================
    // 2. Kh-B-R (خ ب ر) KÖKÜ - Haber Vermek / Bildirmek
    // İf'al Babı (أَفْعَلَ - يُفْعِلُ)
    // ==================================================================
    "خبر": {
        // --- 52 Numaralı Kalıp (أَفْعَلَ - Mazi / İf'al Babı) ---
        52: { 
            base: { emoji: "🗣️", arText: "أَخْبَرَ", trText: "Haber verdi / Bildirdi." } 
        },
        
        // --- 53 Numaralı Kalıp (يُفْعِلُ - Muzari / İf'al Babı) ---
        53: { 
            base: { emoji: "📢", arText: "يُخْبِرُ", trText: "Haber verir / Bildiriyor." } 
        },
        
        // --- 54 Numaralı Kalıp (أَفْعِلْ - Emir / İf'al Babı) ---
        54: { 
            base: { emoji: "❗", arText: "أَخْبِرْ", trText: "Haber ver / Bildir!" } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { emoji: "📰", arText: "خَبَر", trText: "Haber." } 
        },
        
        // --- 41 Numaralı Kalıp (أَفْعَال) ---
        41: { 
            base: { emoji: "📺", arText: "أَخْبَار", trText: "Haberler." } 
        },
        
        // --- 55 Numaralı Kalıp (إِفْعَال) ---
        55: { 
            base: { emoji: "🫣", arText: "إِخْبَار", trText: "Haber vermek / Bildirmek." } 
        },
        
        // --- 56 Numaralı Kalıp (مُفْعِل) ---
        56: { 
            base: { emoji: "🕵️‍♀️", arText: "مُخْبِر", trText: "Haber veren / Muhbir." } 
        },
        
        // --- 67 Numaralı Kalıp (مُفَاعَلَة) ---
        67: { 
            base: { emoji: "📞", arText: "مُخَابَرَة", trText: "Haberleşme / İletişim." }, 
            suggestsPlus: true, 
            "ات": { emoji: "📡", arText: "مُخَابَرَات", trText: "Muhaberat / Haberleşme ve iletişim ağları." } 
        },
        
        // --- 69 Numaralı Kalıp (مُفَاعِل) ---
        69: { 
            base: { emoji: "🎤", arText: "مُخَابِر", trText: "Muhabir." } 
        },
        
        // --- 103 Numaralı Kalıp (اِسْتِفْعَال) ---
        103: { 
            suggestsPlus: true,
            "ات": { emoji: "🕵️", arText: "اِسْتِخْبَارَاتُ الدَّوْلَةِ قَوِيَّةٌ", trText: "Devletin istihbaratı (haber alma teşkilatı) güçlüdür." } 
        }
    },

    // ==================================================================
    // 4. F-T-H (ف ت ح) KÖKÜ - Açmak / Fethetmek
    // 3. Bab (فَعَلَ - يَفْعَلُ)
    // ==================================================================
    "فتح": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi) ---
        1: { 
            base: { emoji: "🔓", arText: "فَتَحَ", trText: "Açtı / Fethetti." } 
        },
        
        // --- 6 Numaralı Kalıp (يَفْعَلُ - Muzari) ---
        6: { 
            base: { emoji: "👐", arText: "يَفْتَحُ", trText: "Açar / Açıyor." } 
        },
        
        // --- 7 Numaralı Kalıp (اِفْعَلْ - Emir) ---
        7: { 
            base: { emoji: "🗝️", arText: "اِفْتَحْ", trText: "Aç!" } 
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            base: { emoji: "🗝️", arText: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", trText: "Allah'ın yardımı ve fetih (zafer) geldiğinde... (Nasr Suresi)" } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🏇", arText: "فَاتِح", trText: "Fetheden / Fatih." } 
        },
        
        // --- 34 Numaralı Kalıp (فَعَّال) ---
        34: { 
            base: { emoji: "🔑", arText: "فَتَّاح", trText: "Fettah (Her türlü zorluğu açan/çözen)." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "🔓", arText: "مَفْتُوح", trText: "Açık." } 
        },
        
        // --- 40 Numaralı Kalıp (مِفْعَال) ---
        40: { 
            base: { emoji: "🔑", arText: "مِفْتَاح", trText: "Anahtar." } 
        },
        // --- 80 Numaralı Kalıp (مِفْعَال) ---
        80: { 
            base: { emoji: "🧎🏻‍♂️", arText: "اِفْتِتَاح", trText: "Namazdaki ilk tekbiri getirme, açılış tekbiri." } 
        }
    },


    // ==================================================================
    // 5. N-Z-M (ن ظ م) KÖKÜ - Düzenlemek / Sıraya Koymak / Şiir Yazmak
    // Tef'il Babı (فَعَّلَ - يُفَعِّلُ)
    // ==================================================================
    "نظم": {
        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'il Babı) ---
        58: { 
            base: { emoji: "🗂️", arText: "نَظَّمَ", trText: "Düzenledi / Organize etti." } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'il Babı) ---
        59: { 
            base: { emoji: "🔄", arText: "يُنَظِّمُ", trText: "Düzenler / Organize ediyor." } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'il Babı) ---
        60: { 
            base: { emoji: "📑", arText: "نَظِّمْ", trText: "Düzenle / Organize et!" } 
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            base: { emoji: "🖋️", arText: "النَّظْمُ وَالنَّثْرُ فِي الْأَدَبِ", trText: "Edebiyatta nazım (şiir) ve nesir (düzyazı)." } 
        },
        
        // --- 23 Numaralı Kalıp (فِعَال) ---
        23: { 
            base: { emoji: "⚙️", arText: "النِّظَامُ أَسَاسُ النَّجَاحِ", trText: "Nizam (düzen), başarının temelidir." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "✍️", arText: "نَاظِم", trText: "Düzenleyen / Şair (Nazım)." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "🎼", arText: "مَنْظُوم", trText: "Dizilmiş / Manzum." }, 
            suggestsPlus: true, 
            "ة": { emoji: "📜", arText: "مَنْظُومَةٌ شِعْرِيَّةٌ", trText: "Şiir dizeleri / Manzume." } 
        },
        
        // --- 61 Numaralı Kalıp (تَفْعِيل) ---
        61: { 
            base: { emoji: "📋", arText: "تَنْظِيمُ الْوَقْتِ مُهِمٌّ", trText: "Zamanın tanzimi (düzenlenmesi) önemlidir." }, 
            suggestsPlus: true, 
            "ات": { emoji: "📜", arText: "فَتْرَةُ التَّنْظِيمَاتِ فِي الدَّوْلَةِ الْعُثْمَانِيَّةِ", trText: "Osmanlı Devleti'nde Tanzimat Dönemi (Düzenlemeler)." } 
        },
        
        // --- 80 Numaralı Kalıp (اِفْتِعَال) ---
        80: { 
            base: { emoji: "📏", arText: "اِنْتِظَام", trText: "Düzenlilik / İntizam." } 
        },
        
        // --- 82 Numaralı Kalıp (مُفْتَعَل) ---
        82: { 
            suggestsPlus: true,
            "ا": { emoji: "🔄", arText: "يَعْمَلُ بِشَكْلٍ مُنْتَظَمٍ", trText: "Muntazaman (düzenli bir şekilde) çalışıyor." } 
        }
    },

  // ==================================================================
    // 6. Sh-H-D (ش ه د) KÖKÜ - Şahit Olmak / Görmek / Şehadet
    // 4. Bab (فَعِلَ - يَفْعَلُ) ve İlgili Mezid Bablar
    // ==================================================================
    "شهد": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / Sülasi 4. Bab) ---
        8: { 
            base: { emoji: "👁️", arText: "شَهِدَ", trText: "Şahit oldu / Gördü." } 
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / Sülasi 4. Bab) ---
        9: { 
            base: { emoji: "👀", arText: "يَشْهَدُ", trText: "Şahit olur / Görüyor." } 
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / Sülasi 4. Bab) ---
        10: { 
            base: { emoji: "✋", arText: "اِشْهَدْ", trText: "Şahit ol!" } 
        },

        // --- 64 Numaralı Kalıp (فَاعَلَ - Mazi / Müfâ'ale Babı) ---
        64: { 
            base: { emoji: "📺", arText: "شَاهَدَ", trText: "İzledi / Müşahede etti." } 
        },
        
        // --- 65 Numaralı Kalıp (يُفَاعِلُ - Muzari / Müfâ'ale Babı) ---
        65: { 
            base: { emoji: "🍿", arText: "يُشَاهِدُ", trText: "İzler / Seyrediyor." } 
        },
        
        // --- 66 Numaralı Kalıp (فَاعِلْ - Emir / Müfâ'ale Babı) ---
        66: { 
            base: { emoji: "🎬", arText: "شَاهِدْ", trText: "İzle / Seyret!" } 
        },

        // --- 88 Numaralı Kalıp (تَفَعَّلَ - Mazi / Tefe'ul Babı) ---
        88: { 
            base: { emoji: "🕌", arText: "تَشَهَّدَ", trText: "Kelime-i Şehadet getirdi." } 
        },
        
        // --- 89 Numaralı Kalıp (يَتَفَعَّلُ - Muzari / Tefe'ul Babı) ---
        89: { 
            base: { emoji: "🤲", arText: "يَتَشَهَّدُ", trText: "Kelime-i Şehadet getirir / getiriyor." } 
        },
        
        // --- 90 Numaralı Kalıp (تَفَعَّلْ - Emir / Tefe'ul Babı) ---
        90: { 
            base: { emoji: "📿", arText: "تَشَهَّدْ", trText: "Kelime-i Şehadet getir!" } 
        },

        // --- 94 Numaralı Kalıp (تَفَاعَلَ - Mazi / Tefâ'ul Babı) ---
        94: { 
            base: { emoji: "🤝", arText: "تَشَاهَدَ", trText: "Birbirini gördü / Karşılaştı." } 
        },
        
        // --- 95 Numaralı Kalıp (يَتَفَاعَلُ - Muzari / Tefâ'ul Babı) ---
        95: { 
            base: { emoji: "👥", arText: "يَتَشَاهَدُ", trText: "Birbirini görür / Karşılaşıyor." } 
        },
        
        // --- 96 Numaralı Kalıp (تَفَاعَلْ - Emir / Tefâ'ul Babı) ---
        96: { 
            base: { emoji: "👀", arText: "تَشَاهَدْ", trText: "Karşılıklı şahit ol / Görüş!" } 
        },

        // --- 22 Numaralı Kalıp (فَعَال) ---
        22: { 
            suggestsPlus: true,
            "ة": { emoji: "📜", arText: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ", trText: "Kelime-i Şehadet, İslam'ın ilk şartıdır." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "👁️", arText: "الْقَاضِي يَسْتَمِعُ إِلَى الشَّاهِدِ فِي الْمَحْكَمَةِ", trText: "Hâkim, mahkemede şahidi dinler." } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "🌹", arText: "وَلَا تَحْسَبَنَّ الَّذِينَ قُتِلُوا فِي سَبِيلِ اللَّهِ أَمْوَاتًا", trText: "Allah yolunda öldürülenleri sakın ölüler sanma. (Âl-i İmrân Suresi)" } 
        },
        
        // --- 46 Numaralı Kalıp (فُعَلَاء) ---
        46: { 
            base: { emoji: "🇹🇷", arText: "شُهَدَاءُ الْوَطَنِ لَا يَمُوتُونَ أَبَدًا", trText: "Vatan şehitleri (şüheda) asla ölmez." } 
        },
        
        // --- 67 Numaralı Kalıp (مُفَاعَلَة) ---
        67: { 
            base: { emoji: "📺", arText: "مُشَاهَدَةُ الْفِيدْيُوهَاتِ التَّعْلِيمِيَّةِ مُفِيدَةٌ", trText: "Eğitici videoların izlenmesi (müşahede edilmesi) faydalıdır." } 
        }
    },

   // ==================================================================
    // 7. Kh-L-Q (خ ل ق) KÖKÜ - Yaratmak / Ahlak
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve İlgili Mezid Bablar
    // ==================================================================
    "خلق": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { 
            base: { emoji: "✨", arText: "خَلَقَ", trText: "Yarattı." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { 
            base: { emoji: "🌟", arText: "يَخْلُقُ", trText: "Yaratır / Yaratıyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { 
            base: { emoji: "⚡", arText: "اُخْلُقْ", trText: "Yarat!" } 
        },

        // --- 19 Numaralı Kalıp (فَعْل - Masdar) ---
        19: { 
            base: { emoji: "🌍", arText: "هَذَا خَلْقُ اللَّهِ", trText: "Bu, Allah'ın yaratmasıdır (yarattığıdır). (Lokman Suresi)" } 
        },

        // --- 21 Numaralı Kalıp (فُعُل) ---
        21: { 
            base: { emoji: "💎", arText: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ", trText: "Şüphesiz sen yüce bir ahlak üzeresin. (Kalem Suresi)" } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🌌", arText: "خَالِق", trText: "Yaratan / Halık." } 
        },

        // --- 34 Numaralı Kalıp (فَعَّال - Mübalağalı İsm-i Fail) ---
        34: { 
            base: { emoji: "🎨", arText: "خَلَّاق", trText: "Çokça yaratan / Yaratıcı." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "🧬", arText: "مَخْلُوق", trText: "Yaratılmış / Mahluk." },
            suggestsPlus: true,
            "ات": { emoji: "🐾", arText: "كُلُّ الْمَخْلُوقَاتِ تُسَبِّحُ لِلَّهِ", trText: "Bütün mahlukat (yaratılmışlar) Allah'ı tesbih eder." }
        },
        
        // --- 41 Numaralı Kalıp (أَفْعَال - Çoğul) ---
        41: { 
            base: { emoji: "🤝", arText: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ", trText: "Ben ancak güzel ahlakı tamamlamak için gönderildim. (Hadis-i Şerif)" } 
        },

        // --- 88 Numaralı Kalıp (تَفَعَّلَ - Mazi / Tefe'ul Babı) ---
        88: { 
            base: { emoji: "🌱", arText: "تَخَلَّقَ", trText: "Ahlaklandı / Huy edindi." } 
        },
        
        // --- 89 Numaralı Kalıp (يَتَفَعَّلُ - Muzari / Tefe'ul Babı) ---
        89: { 
            base: { emoji: "🌿", arText: "يَتَخَلَّقُ", trText: "Ahlaklanır / Huy ediniyor." } 
        },
        
        // --- 90 Numaralı Kalıp (تَفَعَّلْ - Emir / Tefe'ul Babı) ---
        90: { 
            base: { emoji: "🌸", arText: "تَخَلَّقْ", trText: "Ahlaklan!" },
            suggestsPlus: true,
            "وا": { emoji: "🌷", arText: "تَخَلَّقُوا بِأَخْلَاقِ اللَّهِ", trText: "Allah'ın ahlakıyla ahlaklanın." }
        }
    },

    // ==================================================================
    // 8. S-J-D (س ج د) KÖKÜ - Secde Etmek
    // 1. Bab (فَعَلَ - يَفْعُلُ)
    // ==================================================================
    "سجد": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi) ---
        1: { 
            base: { emoji: "🧎", arText: "سَجَدَ", trText: "Secde etti." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari) ---
        2: { 
            base: { emoji: "🤲", arText: "يَسْجُدُ", trText: "Secde eder / Ediyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir) ---
        3: { 
            base: { emoji: "⬇️", arText: "اُسْجُدْ", trText: "Secde et!" } 
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            suggestsPlus: true, 
            "ة": { emoji: "🧎", arText: "سَجْدَةُ الشُّكْرِ تَدُلُّ عَلَى الِامْتِنَانِ", trText: "Şükür secdesi, minnettarlığı (şükranı) gösterir." } 
        },
        
        // --- 25 Numaralı Kalıp (فُعُول) ---
        25: { 
            base: { emoji: "🤲", arText: "أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ", trText: "Kulun Rabbine en yakın olduğu an secde (sücud) anıdır; orada duayı çok yapın. (Hadis-i Şerif)" } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🙇", arText: "سَاجِد", trText: "Secde eden." } 
        },
        
        // --- 37 Numaralı Kalıp (مَفْعِل) ---
        37: { 
            base: { emoji: "🕌", arText: "أَحَبُّ الْبِلَادِ إِلَى اللَّهِ مَسَاجِدُهَا", trText: "Allah'a beldelerin en sevimlisi mescitleridir (camileridir). (Hadis-i Şerif)" } 
        }
    },

    // ==================================================================
    // 9. S-D-Q (ص د ق) KÖKÜ - Doğru Olmak
    // 1. Bab (فَعَلَ - يَفْعُلُ)
    // ==================================================================
    "صدق": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi) ---
        1: { 
            base: { emoji: "🗣️", arText: "صَدَقَ الله العَظِيم", trText: "Yüce Allah C.C. doğru söyledi." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari) ---
        2: { 
            base: { emoji: "✅", arText: "يَصْدُقُ", trText: "Doğru söyler / Söylüyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir) ---
        3: { 
            base: { emoji: "✔️", arText: "اُصْدُقْ", trText: "Doğru söyle!" } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            suggestsPlus: true, 
            "ة": { emoji: "🪙", arText: "صَدَقَة", trText: "Sadaka." } 
        },

        // --- 20 Numaralı Kalıp (فِعْل) ---
        20: { 
            base: { emoji: "🕊️", arText: "الصِّدْقُ صِفَةُ الْأَنْبِيَاءِ", trText: "Doğruluk (sıdk), peygamberlerin ve Ebu Bekir es-Sıddîk'ın sıfatıdır." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "👯", arText: "صَادِق", trText: "Doğru söyleyen / Sadık." } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "🤝", arText: "الصَّدِيقُ وَقْتَ الضِّيقِ", trText: "Gerçek dost (sadık arkadaş), sıkıntı vaktinde belli olur. (Atasözü)" } 
        },
        
        // --- 61 Numaralı Kalıp (تَفْعِيل) ---
        61: { 
            base: { emoji: "✔️", arText: "تَصْدِيق", trText: "Onaylamak / Tasdik etmek." } 
        }
    },



    // 10. H-S-D (ح س د) KÖKÜ - Kıskanmak
    "حسد": {
        1: { base: { emoji: "🧿", arText: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ", trText: "Haset ettiği zaman hasetçinin şerrinden (Allah'a sığınırım). (Felak Suresi)" } }, // حَسَدَ
        33: { base: { emoji: "😒", arText: "حَاسِد", trText: "Kıskanan / Hasetçi." } } // حَاسِد
    },

    // ==================================================================
    // 11. D-Kh-L (د خ ل) KÖKÜ - Girmek / Dahil Olmak
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve Müfâ'ale Babı
    // ==================================================================
    "دخل": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { 
            base: { emoji: "🚶", arText: "دَخَلَ", trText: "Girdi." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { 
            base: { emoji: "🚶‍♂️", arText: "يَدْخُلُ", trText: "Girer / Giriyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { 
            base: { emoji: "🚪", arText: "اُدْخُلْ", trText: "Gir!" } 
        },

        // --- 25 Numaralı Kalıp (فُعُول) ---
        25: { 
            base: { emoji: "🚪", arText: "مَمْنُوعُ الدُّخُولِ", trText: "Giriş yasaktır." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "📦", arText: "دَاخِل", trText: "İç / Dahil." }, 
            suggestsPlus: true, 
            "يَّة": { emoji: "🏛️", arText: "وِزَارَةُ الدَّاخِلِيَّةِ", trText: "İçişleri Bakanlığı." } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { emoji: "🏢", arText: "مَدْخَل", trText: "Giriş yeri." } 
        },
        
        // --- 55 Numaralı Kalıp (إِفْعَال) ---
        55: { 
            base: { emoji: "📥", arText: "إِدْخَال", trText: "Girdi / İçeri sokmak." }, 
            suggestsPlus: true, 
            "ات": { emoji: "📊", arText: "إِدْخَالَات", trText: "Girdiler." } 
        },

        // --- 64 Numaralı Kalıp (فَاعَلَ - Mazi / Müfâ'ale Babı) ---
        64: { 
            base: { emoji: "🛑", arText: "دَاخَلَ", trText: "Müdahale etti / Araya girdi." } 
        },
        
        // --- 65 Numaralı Kalıp (يُفَاعِلُ - Muzari / Müfâ'ale Babı) ---
        65: { 
            base: { emoji: "✋", arText: "يُدَاخِلُ", trText: "Müdahale eder / Araya giriyor." } 
        },
        
        // --- 66 Numaralı Kalıp (فَاعِلْ - Emir / Müfâ'ale Babı) ---
        66: { 
            base: { emoji: "❗", arText: "دَاخِلْ", trText: "Müdahale et / Araya gir!" } 
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة) ---
        67: { 
            base: { emoji: "🛑", arText: "الْمُدَاخَلَةُ السَّرِيعَةُ تَمْنَعُ الْمُشْكِلَةَ", trText: "Hızlı müdahale (müdahale) sorunun büyümesini engeller." } 
        },
        
        // --- 69 Numaralı Kalıp (مُفَاعِل) ---
        69: { 
            base: { emoji: "🧑‍⚖️", arText: "مُدَاخِل", trText: "Müdahil olan / Araya giren." } 
        }
    },


    // ==================================================================
    // 12. R-K-B (ر ك ب) KÖKÜ - Binmek / Birleştirmek (Terkip etmek)
    // 4. Bab (فَعِلَ - يَفْعَلُ) ve Tef'îl Babı
    // ==================================================================
    "ركب": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / 4. Bab) ---
        8: { 
            base: { emoji: "🐎", arText: "رَكِبَ", trText: "Bindi." } 
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { 
            base: { emoji: "🏇", arText: "يَرْكَبُ", trText: "Biner / Biniyor." } 
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { 
            base: { emoji: "🐴", arText: "اِرْكَبْ", trText: "Bin!" } 
        },

        // --- 25 Numaralı Kalıp (فُعُول - Masdar) ---
        25: { 
            base: { emoji: "🏇", arText: "رُكُوب", trText: "Binmek." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fail) ---
        33: { 
            base: { emoji: "💺", arText: "رَاكِب", trText: "Yolcu / Binen." } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل - İsm-i Mekan/Zaman) ---
        38: { 
            base: { emoji: "⛴️", arText: "مَرْكَب", trText: "Gemi / Binek." },
            suggestsPlus: true, 
            "ة": { emoji: "🛸", arText: "مَرْكَبَةٌ فَضَائِيَّةٌ", trText: "Uzay aracı (Binek)." }
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { 
            base: { emoji: "🧩", arText: "رَكَّبَ", trText: "Birleştirdi / Terkip etti." } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { 
            base: { emoji: "🔧", arText: "يُرَكِّبُ", trText: "Birleştirir / Monte ediyor." } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { 
            base: { emoji: "🛠️", arText: "رَكِّبْ", trText: "Birleştir / Monte et!" } 
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Tef'îl Babı Masdarı) ---
        61: { 
            base: { emoji: "🧪", arText: "تَرْكِيب", trText: "Bileşim / Terkip." },
            suggestsPlus: true,
            "ات": { emoji: "🧬", arText: "تَرْكِيبَاتٌ كِيمْيَائِيَّةٌ", trText: "Kimyasal terkipler (bileşimler)." }
        },
        
        // --- 63 Numaralı Kalıp (مُفَعَّل - Tef'îl Babı İsm-i Mef'ulü) ---
        63: { 
            base: { emoji: "✒️", arText: "مُرَكَّب", trText: "Birleşik (Mürekkep) / Mürekkep." } 
        }
    },



   // ==================================================================
    // 13. N-Q-L (ن ق ل) KÖKÜ - Taşımak / Nakletmek / Aktarmak
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve İfti'âl Babı
    // ==================================================================
    "نقل": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { 
            base: { emoji: "📦", arText: "نَقَلَ", trText: "Taşıdı / Nakletti." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { 
            base: { emoji: "🚚", arText: "يَنْقُلُ", trText: "Taşır / Naklediyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { 
            base: { emoji: "💪", arText: "اُنْقُلْ", trText: "Taşı / Naklet!" } 
        },

        // --- 19 Numaralı Kalıp (فَعْل - Masdar) ---
        19: { 
            base: { emoji: "🚚", arText: "نَقْل", trText: "Taşıma / Nakil." }, 
            suggestsPlus: true, 
            "ا": { emoji: "📺", arText: "بُثَّتِ الْمُبَارَاةُ نَقْلًا مُبَاشِرًا", trText: "Maç canlı olarak (naklen) yayınlandı." }, 
            "يَّة": { emoji: "📦", arText: "نَقْلِيَّة", trText: "Nakliye." }, 
            "يَّات": { emoji: "🚛", arText: "شَرِكَةُ النَّقْلِيَّاتِ تَشْحَنُ الْبَضَائِعَ", trText: "Nakliyat şirketi malları taşır." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل - İsm-i Fail) ---
        33: { 
            base: { emoji: "📡", arText: "نَاقِل", trText: "Taşıyan / Aktaran." } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "🧳", arText: "نَقِيل", trText: "Taşınan." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول - İsm-i Mef'ul) ---
        36: { 
            base: { emoji: "🚗", arText: "الأَمْوَالُ غَيْرُ الْمَنْقُولَةِ هِيَ الْعَقَارَاتُ", trText: "Gayrimenkul (taşınmaz) mallar ev ve arsalardır." } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - Mazi / İfti'âl Babı) ---
        77: { 
            base: { emoji: "🛫", arText: "اِنْتَقَلَ", trText: "Geçti / Taşındı (İntikal etti)." } 
        },
        
        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - Muzari / İfti'âl Babı) ---
        78: { 
            base: { emoji: "✈️", arText: "يَنْتَقِلُ", trText: "Geçer / Taşınıyor (İntikal ediyor)." } 
        },
        
        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - Emir / İfti'âl Babı) ---
        79: { 
            base: { emoji: "🧳", arText: "اِنْتَقِلْ", trText: "Geç / Taşın (İntikal et)!" } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { emoji: "🔄", arText: "اِنْتِقَال", trText: "Geçiş / Transfer / İntikal." } 
        }
    },

   // ==================================================================
    // 14. Sh-R-B (ش ر ب) KÖKÜ - İçmek
    // 4. Bab (فَعِلَ - يَفْعَلُ)
    // ==================================================================
    "شرب": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / 4. Bab) ---
        8: { 
            base: { emoji: "🥛", arText: "شَرِبَ", trText: "İçti." } 
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { 
            base: { emoji: "🥤", arText: "يَشْرَبُ", trText: "İçer / İçiyor." } 
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { 
            base: { emoji: "💧", arText: "اِشْرَبْ", trText: "İç!" } 
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            suggestsPlus: true, 
            "ة": { emoji: "🍵", arText: "شَرْبَة", trText: "Bir içimlik / Şerbet." } 
        },
        
        // --- 22 Numaralı Kalıp (فَعَال) ---
        22: { 
            base: { emoji: "🍹", arText: "يَخْرُجُ مِنْ بُطُونِهَا شَرَابٌ مُخْتَلِفٌ أَلْوَانُهُ", trText: "Onların karınlarından renkleri çeşitli bir içecek (şerbet) çıkar. (Nahl Suresi)" } 
        },
        
        // --- 25 Numaralı Kalıp (فُعُول) ---
        25: { 
            base: { emoji: "🥛", arText: "شُرُوب", trText: "İçmek." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            suggestsPlus: true, 
            "ات": { emoji: "🥤", arText: "الْمَشْرُوبَاتُ الْبَارِدَةُ لَذِيذَةٌ فِي الصَّيْفِ", trText: "Soğuk meşrubatlar (içecekler) yazın lezzetlidir." } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            base: { emoji: "⛲", arText: "قَدْ عَلِمَ كُلُّ أُنَاسٍ مَّشْرَبَهُمْ", trText: "Her topluluk kendi içeceği yeri (meşrebini) bildi. (Bakara Suresi)" } 
        }
    },

     // --- S-F-R (س ف ر) KÖKÜ - Yolculuk / Açığa Çıkarmak ---
    "سفر": { 
        17: { base: { emoji: "🛤️", arText: "سَفَر", trText: "Yolculuk / Sefer." } },
        35: { base: { emoji: "👔", arText: "سَفِير", trText: "Büyükelçi (Sefir)." }, suggestsPlus: true, "ة": { emoji: "🏢", arText: "سَفَارَة", trText: "Büyükelçilik (Sefaret)." } },
        
        // Müfâ'ale Babı (سَافَرَ - يُسَافِرُ)
        64: { base: { emoji: "✈️", arText: "سَافَرَ", trText: "Yolculuk yaptı / Sefere çıktı." } },
        65: { base: { emoji: "🌍", arText: "يُسَافِرُ", trText: "Yolculuk yapıyor." } },
        66: { base: { emoji: "🎒", arText: "سَافِرْ", trText: "Yolculuk yap!" } },
        69: { base: { emoji: "🧳", arText: "الضَّيْفُ (المُسَافِرُ) يَأْتِي بِرِزْقِهِ", trText: "Misafir (yolcu) rızkıyla gelir. (Atasözü)" } }
    }, 

      // --- '-Q-L (ع ق ل) KÖKÜ - Akıl / Anlamak / Bağlamak ---
    "عقل": { 
        // 2. Bab (فَعَلَ - يَفْعِلُ)
        1: { base: { emoji: "🧠", arText: "عَقَلَ", trText: "Akıl etti / Anladı." } },
        4: { base: { emoji: "🤔", arText: "يَعْقِلُ", trText: "Akıl eder / Düşünüyor." } },
        5: { base: { emoji: "💡", arText: "اِعْقِلْ", trText: "Akıl et / Düşün!" } },
        
        19: { base: { emoji: "🧠", arText: "العَقْلُ السَّلِيمُ فِي الجِسْمِ السَّلِيمِ", trText: "Sağlam akıl (kafa), sağlam vücutta bulunur. (Atasözü)" } },
        33: { base: { emoji: "🤓", arText: "عَاقِل", trText: "Akıllı / Mantıklı." } },
        36: { base: { emoji: "✅", arText: "سِعْرٌ مَعْقُولٌ", trText: "Makul (akla yatkın / mantıklı) bir fiyat." }, suggestsPlus: true, "ات": { emoji: "💬", arText: "مَعْقُولَات", trText: "Akla yatkın şeyler / Mantıklı konular." } }
    },

   

    // 16. 'A-S-M (ع ص م) KÖKÜ - Korumak / Günahsızlık
    "عصم": {
        20: { suggestsPlus: true, "ة": { emoji: "🕊️", arText: "عِصْمَةُ الْأَنْبِيَاءِ", trText: "Peygamberlerin günahsızlığı (İsmet sıfatı)." } }, // عِصْم + ة = عِصْمَة
        33: { base: { emoji: "🛡️", arText: "لَا عَاصِمَ الْيَوْمَ مِنْ أَمْرِ اللَّهِ", trText: "Bugün Allah'ın emrinden koruyacak hiçbir güç yoktur. (Hud Suresi)" } }, // عَاصِم
        36: { base: { emoji: "👼", arText: "الأَطْفَالُ مَعْصُومُونَ", trText: "Çocuklar masumdur (günahsızdır)." } } // مَعْصُوم
    },

    // ==================================================================
    // 17. Q-R-B (ق ر ب) KÖKÜ - Yakın Olmak (Akraba / Kurban)
    // 5. Bab (فَعُلَ - يَفْعُلُ) ve İfti'âl Babı
    // ==================================================================
    "قرب": {
        // --- 11 Numaralı Kalıp (فَعُلَ - Mazi / 5. Bab) ---
        11: { 
            base: { emoji: "📏", arText: "قَرُبَ", trText: "Yakın oldu." } 
        },
        
        // --- 12 Numaralı Kalıp (يَفْعُلُ - Muzari / 5. Bab) ---
        12: { 
            base: { emoji: "🚶", arText: "يَقْرُبُ", trText: "Yakın olur / Yaklaşıyor." } 
        },
        
        // --- 13 Numaralı Kalıp (اُفْعُلْ - Emir / 5. Bab) ---
        13: { 
            base: { emoji: "🫂", arText: "اُقْرُبْ", trText: "Yakın ol / Yaklaş!" } 
        },

        // --- 27 Numaralı Kalıp (فُعْلَان) ---
        27: { 
            base: { emoji: "🐑", arText: "إِنَّمَا يَتَقَبَّلُ اللهُ مِنَ الْمُتَّقِينَ", trText: "Allah ancak takva sahiplerinden (kurbanı) kabul eder. (Maide Suresi)" } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "🫂", arText: "قَرِيب", trText: "Yakın." } 
        },
        
        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - Mazi / İfti'âl Babı) ---
        77: { 
            base: { emoji: "🌙", arText: "اِقْتَرَبَتْ السَّاعَةُ وَانشَقَّ الْقَمَرُ", trText: "Kıyamet vakti (saat) yaklaştı ve ay yarıldı. (Kamer Suresi)" } 
        },
        
        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - Muzari / İfti'âl Babı) ---
        78: { 
            base: { emoji: "⏳", arText: "يَقْتَرِبُ", trText: "Yaklaşır / Yaklaşıyor." } 
        },
        
        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - Emir / İfti'âl Babı) ---
        79: { 
            base: { emoji: "🏃", arText: "اِقْتَرِبْ", trText: "Yaklaş!" } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - İfti'âl Babı Masdarı) ---
        80: { 
            base: { emoji: "🚶‍♂️" } 
        }
    },

    // 18. T-B-Q (ط ب ق) KÖKÜ - Uymak / Katman / Tatbik Etmek
    "طبق": {
        17: { base: { emoji: "🍽️", arText: "طَبَق", trText: "Tabak." }, suggestsPlus: true, "ة": { emoji: "🥞", arText: "طَبَقَةُ الأُوزُون", trText: "Ozon tabakası." } }, // طَبَق + ة = طَبَقَة
        61: { base: { emoji: "📱", arText: "تَطْبِيقُ الْقَوَاعِدِ مُهِمٌّ", trText: "Kuralların uygulanması (tatbik edilmesi) önemlidir." }, suggestsPlus: true, "ات": { emoji: "📲", arText: "تَطْبِيقَاتُ الْهَاتِفِ", trText: "Telefon uygulamaları (tatbikatları)." } }, // تَطْبِيق + ات = تَطْبِيقَات
        67: { suggestsPlus: true, "ات": { emoji: "✅", arText: "مُطَابَقَةُ الْحِسَابَاتِ", trText: "Hesap mutabakatı (uyuşması)." } }, // مُطَابَقَة -> مُطَابَقَات
        69: { base: { emoji: "🤝", arText: "نَحْنُ مُتَطَابِقُونَ فِي الرَّأْيِ", trText: "Biz bu görüşte mutabıkız (aynı fikirdeyiz)." } } // مُطَابِق
    },

   // ==================================================================
    // 19. H-K-M (ح ك م) KÖKÜ - Hükmetmek / Yargılamak / Bilgelik
    // 1. Bab (فَعَلَ - يَفْعُلُ), Müfâ'ale ve Tefe'ul Babları
    // ==================================================================
    "حكم": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { 
            base: { emoji: "⚖️", arText: "حَكَمَ", trText: "Hükmetti / Karar verdi." } 
        },
        
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { 
            base: { emoji: "🧑‍⚖️", arText: "يَحْكُمُ", trText: "Hükmeder / Karar veriyor." } 
        },
        
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { 
            base: { emoji: "🔨", arText: "اُحْكُمْ", trText: "Hükmet / Karar ver!" } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            base: { emoji: "🏁", arText: "فَابْعَثُوا حَكَمًا مِّنْ أَهْلِهِ وَحَكَمًا مِّنْ أَهْلِهَا", trText: "Erkeğin ailesinden bir hakem ve kadının ailesinden bir hakem gönderin. (Nisa Suresi)" } 
        },
        
        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            base: { emoji: "📜", arText: "إِنِ الْحُكْمُ إِلَّا لِلَّهِ", trText: "Hüküm ancak Allah'ındır. (Yusuf Suresi)" } 
        },
        
        // --- 25 Numaralı Kalıp (فُعُول) ---
        25: { 
            suggestsPlus: true, 
            "ة": { emoji: "🏛️", arText: "حُكُومَة", trText: "Hükümet." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🧑‍⚖️", arText: "حَاكِم", trText: "Hakim / Yönetici." } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "🦉", arText: "يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ", trText: "Allah hikmeti dilediğine verir. (Bakara Suresi)" } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "⛓️", arText: "مَحْكُوم", trText: "Mahkum." } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            suggestsPlus: true, 
            "ة": { emoji: "⚖️", arText: "مَحْكَمَة", trText: "Mahkeme." } 
        },

        // --- 64 Numaralı Kalıp (فَاعَلَ - Mazi / Müfâ'ale Babı) ---
        64: { 
            base: { emoji: "👨‍⚖️", arText: "حَاكَمَ", trText: "Yargıladı / Muhakeme etti." } 
        },
        
        // --- 65 Numaralı Kalıp (يُفَاعِلُ - Muzari / Müfâ'ale Babı) ---
        65: { 
            base: { emoji: "⚖️", arText: "يُحَاكِمُ", trText: "Yargılar / Yargılıyor." } 
        },
        
        // --- 66 Numaralı Kalıp (فَاعِلْ - Emir / Müfâ'ale Babı) ---
        66: { 
            base: { emoji: "❗", arText: "حَاكِمْ", trText: "Yargıla / Muhakeme et!" } 
        },

        // --- 67 Numaralı Kalıp (مُفَاعَلَة - Müfâ'ale Masdarı) ---
        67: { 
            base: { emoji: "📝", arText: "مُحَاكَمَة", trText: "Yargılama / Muhakeme." } 
        },

        // --- 88 Numaralı Kalıp (تَفَعَّلَ - Mazi / Tefe'ul Babı) ---
        88: { 
            base: { emoji: "🎮", arText: "تَحَكَّمَ", trText: "Kontrol etti / Hakim oldu (Tahakküm etti)." } 
        },
        
        // --- 89 Numaralı Kalıp (يَتَفَعَّلُ - Muzari / Tefe'ul Babı) ---
        89: { 
            base: { emoji: "🕹️", arText: "يَتَحَكَّمُ", trText: "Kontrol eder / Yönetiyor." } 
        },
        
        // --- 90 Numaralı Kalıp (تَفَعَّلْ - Emir / Tefe'ul Babı) ---
        90: { 
            base: { emoji: "🛑", arText: "تَحَكَّمْ", trText: "Kontrol et / Hakim ol!" } 
        },

        // --- 91 Numaralı Kalıp (تَفَعُّل - Tefe'ul Masdarı) ---
        91: { 
            base: { emoji: "🎛️", arText: "تَحَكُّم", trText: "Kontrol / Hakimiyet." },
            suggestsPlus: true,
            "ات": { emoji: "⚙️", arText: "لَوْحَةُ التَّحَكُّمِ", trText: "Kontrol paneli." } 
        }
    },


    // ==================================================================
    // 20. '-R-F (ع ر ف) KÖKÜ - Bilmek / Tanımak / İtiraf Etmek
    // 2. Bab (فَعَلَ - يَفْعِلُ), Tef'îl, İfti'âl ve Tefâ'ul Babları
    // ==================================================================
    "عرف": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 2. Bab) ---
        1: { 
            base: { emoji: "🧠", arText: "عَرَفَ", trText: "Bildi / Tanıdı." } 
        },
        
        // --- 4 Numaralı Kalıp (يَفْعِلُ - Muzari / 2. Bab) ---
        4: { 
            base: { emoji: "🤔", arText: "يَعْرِفُ", trText: "Bilir / Tanıyor." } 
        },
        
        // --- 5 Numaralı Kalıp (اِفْعِلْ - Emir / 2. Bab) ---
        5: { 
            base: { emoji: "💡", arText: "اِعْرِفْ", trText: "Bil / Tanı!" } 
        },

        // --- 17 Numaralı Kalıp (فَعَل) ---
        17: { 
            suggestsPlus: true, 
            "ة": { emoji: "⛰️", arText: "عَرَفَة", trText: "Arafat tepesi." } 
        },
        
        // --- 21 Numaralı Kalıp (فُعْل) ---
        21: { 
            base: { emoji: "🤝", arText: "عُرْف", trText: "Gelenek / Örf." } 
        },
        
        // --- 29 Numaralı Kalıp (فِعْلَان) ---
        29: { 
            base: { emoji: "🌟", arText: "عِرْفَان", trText: "İrfan / Bilgi." } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🧠", arText: "العَارِفُ تَكْفِيهِ الإِشَارَةُ", trText: "Ârife tarif gerekmez." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "👍", arText: "وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنْكَرِ", trText: "İyiliği emret, kötülükten sakındır. (Lokman Suresi)" } 
        },
        
        // --- 37 Numaralı Kalıp (مَفْعِل) ---
        37: { 
            suggestsPlus: true, 
            "ة": { emoji: "💡", arText: "مَعْرِفَة", trText: "Bilgi / Marifet." } 
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { 
            base: { emoji: "🗣️", arText: "عَرَّفَ", trText: "Tanıttı / Tarif etti." } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { 
            base: { emoji: "📢", arText: "يُعَرِّفُ", trText: "Tanıtır / Tarif ediyor." } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { 
            base: { emoji: "📝", arText: "عَرِّفْ", trText: "Tanıt / Tarif et!" } 
        },

        // --- 61 Numaralı Kalıp (تَفْعِيل - Masdar / Tef'îl Babı) ---
        61: { 
            base: { emoji: "📋", arText: "تَعْرِيف", trText: "Tanımlama / Tarif." } 
        },

        // --- 77 Numaralı Kalıp (اِفْتَعَلَ - Mazi / İfti'âl Babı) ---
        77: { 
            base: { emoji: "🙌", arText: "اِعْتَرَفَ", trText: "İtiraf etti / Kabul etti." } 
        },
        
        // --- 78 Numaralı Kalıp (يَفْتَعِلُ - Muzari / İfti'âl Babı) ---
        78: { 
            base: { emoji: "🗣️", arText: "يَعْتَرِفُ", trText: "İtiraf eder / Kabul ediyor." } 
        },
        
        // --- 79 Numaralı Kalıp (اِفْتَعِلْ - Emir / İfti'âl Babı) ---
        79: { 
            base: { emoji: "❗", arText: "اِعْتَرِفْ", trText: "İtiraf et / Kabul et!" } 
        },

        // --- 80 Numaralı Kalıp (اِفْتِعَال - Masdar / İfti'âl Babı) ---
        80: { 
            base: { emoji: "📜", arText: "اِعْتِرَاف", trText: "İtiraf / Tanıma." } 
        },

        // --- 94 Numaralı Kalıp (تَفَاعَلَ - Mazi / Tefâ'ul Babı) ---
        94: { 
            base: { emoji: "🤝", arText: "تَعَارَفَ", trText: "Tanıştı." } 
        },
        
        // --- 95 Numaralı Kalıp (يَتَفَاعَلُ - Muzari / Tefâ'ul Babı) ---
        95: { 
            base: { emoji: "👥", arText: "يَتَعَارَفُ", trText: "Tanışır / Tanışıyor." },
            suggestsPlus: true,
            "ونَ": { emoji: "🌍", arText: "وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا", trText: "Sizi tanışmanız için milletlere ve kabilelere ayırdık. (Hucurât Suresi)" }
        },
        
        // --- 96 Numaralı Kalıp (تَفَاعَلْ - Emir / Tefâ'ul Babı) ---
        96: { 
            base: { emoji: "👋", arText: "تَعَارَفْ", trText: "Tanış!" } 
        },

        // --- 97 Numaralı Kalıp (تَفَاعُل - Masdar / Tefâ'ul Babı) ---
        97: { 
            base: { emoji: "🫂", arText: "تَعَارُف", trText: "Tanışma / Birbirini tanıma." },
            suggestsPlus: true,
            "ات": { emoji: "🤝", arText: "تَعَارُفَات", trText: "Tanışmalar." }
        }
    },


   // ==================================================================
    // 21. '-L-M (ع ل م) KÖKÜ - Bilmek / Öğrenmek / Öğretmek
    // 4. Bab (فَعِلَ - يَفْعَلُ), Tef'îl, Tefe'ul ve İsti'fal Babları
    // ==================================================================
    "علم": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / 4. Bab) ---
        8: { 
            base: { emoji: "💡", arText: "عَلِمَ", trText: "Bildi / Öğrendi." } 
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { 
            base: { emoji: "🤔", arText: "يَعْلَمُ", trText: "Bilir / Biliyor." } 
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { 
            base: { emoji: "❗", arText: "اِعْلَمْ", trText: "Bil!" } 
        },

        // --- 20 Numaralı Kalıp (فِعْل - Masdar) ---
        20: { 
            base: { emoji: "📖", arText: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ", trText: "İlim öğrenmek her Müslüman'a farzdır. (Hadis-i Şerif)" } 
        },
        
        // --- 33 Numaralı Kalıp (فَاعِل) ---
        33: { 
            base: { emoji: "🎓", arText: "عَالِم", trText: "Bilen / Alim." }, 
            suggestsPlus: true, 
            "ة": { emoji: "🧕", arText: "عَالِمَةٌ جَلِيلَةٌ", trText: "Büyük bir kadın âlim." }, 
            "ونَ": { emoji: "👨‍🎓", arText: "عَالِمُونَ", trText: "Âlimler (Düzenli Çoğul)." } 
        },
        
        // --- 34 Numaralı Kalıp (فَعَّالَة - Mübalağa) ---
        34: { 
            suggestsPlus: true, 
            "ة": { emoji: "🧠", arText: "عَلَّامَةُ الْعَصْرِ", trText: "Asrın büyük âlimi (Allâme)." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "💡", arText: "كُلُّ شَيْءٍ مَعْلُومٌ عِنْدَ اللَّهِ", trText: "Her şey Allah katında malumdur (bilinmektedir)." }, 
            suggestsPlus: true, 
            "ات": { emoji: "ℹ️", arText: "مَعْلُومَاتٌ مُهِمَّةٌ", trText: "Önemli bilgiler (Malumat)." } 
        },
        
        // --- 43 Numaralı Kalıp (فُعُول - Çoğul Masdar) ---
        43: { 
            base: { emoji: "🔬", arText: "الْعُلُومُ النَّافِعَةُ تَبْنِي الْحَضَارَاتِ", trText: "Faydalı ilimler (bilimler) medeniyetleri inşa eder." } 
        },
        
        // --- 46 Numaralı Kalıp (فُعَلَاء - Çoğul İsm-i Fail) ---
        46: { 
            base: { emoji: "👥", arText: "الْعُلَمَاءُ وَرَثَةُ الْأَنْبِيَاءِ", trText: "Âlimler peygamberlerin varisleridir. (Hadis-i Şerif)" },
            suggestsPlus: true,
            "ا": { emoji: "🤲", arText: "إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ", trText: "Kulları içinden ancak âlimler, Allah'tan korkar. (Fâtır Suresi)" }
        },

        // --- 58 Numaralı Kalıp (فَعَّلَ - Mazi / Tef'îl Babı) ---
        58: { 
            base: { emoji: "🗣️", arText: "عَلَّمَ", trText: "Öğretti." } 
        },
        
        // --- 59 Numaralı Kalıp (يُفَعِّلُ - Muzari / Tef'îl Babı) ---
        59: { 
            base: { emoji: "📢", arText: "يُعَلِّمُ", trText: "Öğretir / Öğretiyor." } 
        },
        
        // --- 60 Numaralı Kalıp (فَعِّلْ - Emir / Tef'îl Babı) ---
        60: { 
            base: { emoji: "📝", arText: "عَلِّمْ", trText: "Öğret!" } 
        },
        
        // --- 61 Numaralı Kalıp (تَفْعِيل - Masdar / Tef'îl Babı) ---
        61: { 
            base: { emoji: "🏫", arText: "تَعْلِيمُ اللُّغَةِ الْعَرَبِيَّةِ", trText: "Arapça eğitimi (öğretimi)." } 
        },
        
        // --- 62 Numaralı Kalıp (مُفَعِّل - İsm-i Fail / Tef'îl Babı) ---
        62: { 
            base: { emoji: "👨‍🏫", arText: "كادَ المُعَلِّمُ أَن يَكونَ رَسولاً", trText: "Öğretmen neredeyse bir elçi olacaktı." }, 
            suggestsPlus: true, 
            "ة": { emoji: "👩‍🏫", arText: "مُعَلِّمَةٌ مُخْلِصَةٌ", trText: "İhlaslı bir kadın öğretmen." } 
        },

        // --- 88 Numaralı Kalıp (تَفَعَّلَ - Mazi / Tefe'ul Babı) ---
        88: { 
            base: { emoji: "🕋", arText: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", trText: "Sizin en hayırlınız Kur'an'ı öğrenen ve öğreteninizdir. (Hadis-i Şerif)" } 
        },
        
        // --- 89 Numaralı Kalıp (يَتَفَعَّلُ - Muzari / Tefe'ul Babı) ---
        89: { 
            base: { emoji: "📚", arText: "يَتَعَلَّمُ", trText: "Öğrenir / Öğreniyor." } 
        },
        
        // --- 90 Numaralı Kalıp (تَفَعَّلْ - Emir / Tefe'ul Babı) ---
        90: { 
            base: { emoji: "✍️", arText: "تَعَلَّمُوا الْعَرَبِيَّةَ فَإِنَّهَا مِنْ دِينِكُمْ", trText: "Arapçayı öğrenin, çünkü o dininizdendir. (Hz. Ömer)" } 
        },
        
        // --- 91 Numaralı Kalıp (تَفَعُّل - Masdar / Tefe'ul Babı) ---
        91: { 
            base: { emoji: "🎓", arText: "تَعَلُّـم", trText: "Öğrenim / Öğrenme." } 
        }
    },


   // ==================================================================
    // 22. R-H-M (ر ح م) KÖKÜ - Merhamet Etmek / Acımak
    // 4. Bab (فَعِلَ - يَفْعَلُ) ve İsti'fal Babı
    // ==================================================================
    "رحم": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / 4. Bab) ---
        8: { 
            base: { emoji: "❤️", arText: "رَحِمَ", trText: "Merhamet etti / Acıdı." } 
        },
        
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { 
            base: { emoji: "🤲", arText: "يَرْحَمُ", trText: "Merhamet eder / Acıyor." } 
        },
        
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { 
            base: { emoji: "🙏", arText: "اِرْحَمْ", trText: "Merhamet et / Acı!" } 
        },

        // --- 19 Numaralı Kalıp (فَعْل) ---
        19: { 
            suggestsPlus: true, 
            "ة": { emoji: "🌧️", arText: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِلْعَالَمِينَ", trText: "Biz seni ancak âlemlere rahmet olarak gönderdik. (Enbiya Suresi)" } 
        },
        
        // --- 35 Numaralı Kalıp (فَعِيل) ---
        35: { 
            base: { emoji: "🤍", arText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", trText: "Rahman ve Rahim olan Allah'ın adıyla." } 
        },
        
        // --- 36 Numaralı Kalıp (مَفْعُول) ---
        36: { 
            base: { emoji: "🤲", arText: "رَحِمَهُ اللهُ رَحْمَةً وَاسِعَةً", trText: "Allah ona geniş bir rahmetle merhamet etsin (Merhum / Vefat etmiş kişi)." } 
        },
        
        // --- 38 Numaralı Kalıp (مَفْعَل) ---
        38: { 
            suggestsPlus: true, 
            "ة": { emoji: "🤝", arText: "وَتَوَاصَوْا بِالصَّبْرِ وَتَوَاصَوْا بِالْمَرْحَمَةِ", trText: "Birbirlerine sabrı ve merhameti tavsiye edenler... (Beled Suresi)" } 
        },

        // --- 100 Numaralı Kalıp (اِسْتَفْعَلَ - Mazi / İsti'fal Babı) ---
        100: { 
            base: { emoji: "😔", arText: "اِسْتَرْحَمَ", trText: "Merhamet diledi / İstirham etti." } 
        },
        
        // --- 101 Numaralı Kalıp (يَسْتَفْعِلُ - Muzari / İsti'fal Babı) ---
        101: { 
            base: { emoji: "🥺", arText: "يَسْتَرْحِمُ", trText: "Merhamet diler / İstirham ediyor." } 
        },
        
        // --- 102 Numaralı Kalıp (اِسْتَفْعِلْ - Emir / İsti'fal Babı) ---
        102: { 
            base: { emoji: "🙏", arText: "اِسْتَرْحِمْ", trText: "Merhamet dile / İstirham et!" } 
        },

        // --- 103 Numaralı Kalıp (اِسْتِفْعَال - Masdar / İsti'fal Babı) ---
        103: { 
            base: { emoji: "📜", arText: "أَقَدِّمُ إِلَيْكُمْ رِسَالَةَ اسْتِرْحَامٍ", trText: "Size bir istirham (merhamet/rica) dilekçesi sunuyorum." } 
        }
    },


   // ==================================================================
    // 23. Kh-L-F (خ ل ف) KÖKÜ - Arkada kalmak / Halef olmak / İhtilaf etmek
    // 1. Bab (فَعَلَ - يَفْعُلُ), Müfâ'ale ve İfti'âl Babları
    // ==================================================================
    "خلف": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { base: { emoji: "🔙", arText: "خَلَفَ", trText: "Arkada kaldı / Halef oldu." } },
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { base: { emoji: "🚶", arText: "يَخْلُفُ", trText: "Arkada kalır / Halef oluyor." } },
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { base: { emoji: "❗", arText: "اُخْلُفْ", trText: "Arkada kal / Halef ol!" } },

        17: { base: { emoji: "👣", arText: "خَلَف", trText: "Gelen / Halef." } }, 
        23: { suggestsPlus: true, "ة": { emoji: "🕌", arText: "خِلَافَة", trText: "Hilafet." } }, 
        35: { suggestsPlus: true, "ة": { emoji: "👑", arText: "إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً", trText: "Muhakkak ben yeryüzünde bir halife var edeceğim. (Bakara Suresi)" } }, 
        46: { base: { emoji: "👥", arText: "الْخُلَفَاءُ الرَّاشِدُونَ", trText: "Hulefa-i Raşidin (Dört Halife)." } }, 
        
        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı) ---
        64: { base: { emoji: "🙅", arText: "خَالَفَ", trText: "Muhalefet etti / Karşı çıktı." } },
        65: { base: { emoji: "🗣️", arText: "يُخَالِفُ", trText: "Muhalefet eder / Karşı çıkıyor." } },
        66: { base: { emoji: "✋", arText: "خَالِفْ", trText: "Muhalefet et / Karşı çık!" } },

        67: { base: { emoji: "🚫", arText: "يَجِبُ تَجَنُّبُ الْمُخَالَفَةِ", trText: "Muhalefetten (kurallara aykırı davranmaktan) kaçınmak gerekir." } }, 
        69: { base: { emoji: "🙅‍♂️", arText: "مُخَالِف", trText: "Muhalif / Karşı çıkan." } }, 
        
        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı) ---
        77: { base: { emoji: "↔️", arText: "اِخْتَلَفَ", trText: "İhtilafa düştü / Ayrılığa düştü." } },
        78: { base: { emoji: "🤷", arText: "يَخْتَلِفُ", trText: "İhtilafa düşer / Farklılık gösteriyor." } },
        79: { base: { emoji: "❗", arText: "اِخْتَلِفْ", trText: "Ayrılığa düş!" } },

        80: { base: { emoji: "↔️", arText: "اِخْتِلَافُ الرَّأْيِ لَا يُفْسِدُ لِلْوُدِّ قَضِيَّةً", trText: "Görüş ayrılığı (ihtilaf), dostluğu bozmaz. (Arap Atasözü)" } }, 
        81: { base: { emoji: "🌈", arText: "مُخْتَلِف", trText: "Farklı / Muhtelif." } } 
    },

    // ==================================================================
    // 24. Kh-R-J (خ ر ج) KÖKÜ - Çıkmak / Çıkarmak
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve İf'âl Babı
    // ==================================================================
    "خرج": {
        // --- 1 Numaralı Kalıp (فَعَلَ - Mazi / 1. Bab) ---
        1: { base: { emoji: "🚶", arText: "خَرَجَ", trText: "Çıktı." } },
        // --- 2 Numaralı Kalıp (يَفْعُلُ - Muzari / 1. Bab) ---
        2: { base: { emoji: "🚪", arText: "يَخْرُجُ", trText: "Çıkar / Çıkıyor." } },
        // --- 3 Numaralı Kalıp (اُفْعُلْ - Emir / 1. Bab) ---
        3: { base: { emoji: "🏃", arText: "اُخْرُجْ", trText: "Çık!" } },

        22: { base: { emoji: "💰", arText: "خَرَاج", trText: "Vergi / Haraç." } }, 
        33: { base: { emoji: "🏞️", arText: "خَارِج", trText: "Dış / Hariç." } }, 
        38: { base: { emoji: "🚪", arText: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", trText: "Kim Allah'a karşı gelmekten sakınırsa, Allah ona bir çıkış yolu (mahreç) açar. (Talak Suresi)" } }, 
        
        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı) ---
        52: { base: { emoji: "📤", arText: "أَخْرَجَ", trText: "Çıkardı." } },
        53: { base: { emoji: "📦", arText: "يُخْرِجُ", trText: "Çıkarır / Çıkarıyor." } },
        54: { base: { emoji: "❗", arText: "أَخْرِجْ", trText: "Çıkar!" } },

        55: { base: { emoji: "📤", arText: "إِخْرَاجُ الزَّكَاةِ", trText: "Zekatın çıkarılması (verilmesi)." }, suggestsPlus: true, "ات": { emoji: "🚢", arText: "زَادَتْ إِخْرَاجَاتُ الدَّوْلَةِ", trText: "Devletin ihracatı (dışa satımı) arttı." } } 
    },

    // ==================================================================
    // 25. '-M-L (ع م ل) KÖKÜ - Çalışmak / Yapmak / İşlem
    // 4. Bab (فَعِلَ - يَفْعَلُ)
    // ==================================================================
    "عمل": {
        // --- 8 Numaralı Kalıp (فَعِلَ - Mazi / 4. Bab) ---
        8: { base: { emoji: "🛠️", arText: "عَمِلَ", trText: "Çalıştı / Yaptı." } },
        // --- 9 Numaralı Kalıp (يَفْعَلُ - Muzari / 4. Bab) ---
        9: { base: { emoji: "⚙️", arText: "يَعْمَلُ", trText: "Çalışır / Yapıyor." } },
        // --- 10 Numaralı Kalıp (اِفْعَلْ - Emir / 4. Bab) ---
        10: { base: { emoji: "💪", arText: "اِعْمَلْ", trText: "Çalış / Yap!" } },

        17: { base: { emoji: "💼", arText: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", trText: "Ameller (işler) niyetlere göredir. (Hadis-i Şerif)" }, suggestsPlus: true, "يَّات": { emoji: "🏥", arText: "غُرْفَةُ الْعَمَلِيَّاتِ فِي الْمُسْتَشْفَى", trText: "Hastanede ameliyathane (operasyon odası)." } }, 
        36: { base: { emoji: "📦", arText: "مَعْمُول", trText: "Yapılmış / Mamul." } }, 
        47: { base: { emoji: "👷", arText: "عَمَلَة", trText: "İşçiler (Cemi Teksir)." } }, 
        55: { base: { emoji: "🏭", arText: "إِعْمَال", trText: "İşletme." } }, 
        67: { base: { emoji: "🤝", arText: "الدِّينُ الْمُعَامَلَةُ", trText: "Din, güzel muameledir (insan ilişkileridir). (Hadis-i Şerif)" }, suggestsPlus: true, "ات": { emoji: "🗂️", arText: "مُعَامَلَات", trText: "İşlemler / Muameleler." } }, 
        103: { base: { emoji: "🔄", arText: "دَلِيلُ الِاسْتِعْمَالِ", trText: "Kullanım kılavuzu (İstimal rehberi)." } } 
    },

    // ==================================================================
    // 26. D-R-S (د ر س) KÖKÜ - Ders / Okumak / Öğrenmek
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve Tef'îl Babı
    // ==================================================================
    "درس": {
        // --- 1, 2, 3 Numaralı Kalıplar (1. Bab) ---
        1: { base: { emoji: "📖", arText: "دَرَسَ", trText: "Ders çalıştı / Okudu." } },
        2: { base: { emoji: "✍️", arText: "يَدْرُسُ", trText: "Ders çalışır / Okuyor." } },
        3: { base: { emoji: "📚", arText: "اُدْرُسْ", trText: "Ders çalış / Oku!" } },

        19: { base: { emoji: "📓", arText: "دَرْس", trText: "Ders." } }, 
        23: { suggestsPlus: true, "ة": { emoji: "📚", arText: "دِرَاسَة", trText: "Öğrenim." } }, 
        38: { suggestsPlus: true, "ة": { emoji: "🏫", arText: "الْمَدْرَسَةُ بَيْتُنَا الثَّانِي", trText: "Okul bizim (öğrencilerin) ikinci evidir." } }, 

        // --- 58, 59, 60 Numaralı Kalıplar (Tef'îl Babı) ---
        58: { base: { emoji: "👨‍🏫", arText: "دَرَّسَ", trText: "Ders verdi / Öğretti." } },
        59: { base: { emoji: "🗣️", arText: "يُدَرِّسُ", trText: "Ders verir / Öğretiyor." } },
        60: { base: { emoji: "❗", arText: "دَرِّسْ", trText: "Ders ver / Öğret!" } },

        61: { base: { emoji: "✍️", arText: "تَدْرِيس", trText: "Öğretmek / Tedrisat." } }, 
        62: { base: { emoji: "👨‍🏫", arText: "مَنْ عَلَّمَنِي حَرْفاً صِرْتُ لَهُ عَبْداً", trText: "Bana bir harf öğretenin kölesi olurum. (Hz. Ali)" } } 
    },

    // ==================================================================
    // 27. H-F-Z (ح ف ظ) KÖKÜ - Korumak / Ezberlemek
    // 4. Bab (فَعِلَ - يَفْعَلُ) ve Müfâ'ale Babı
    // ==================================================================
    "حفظ": {
        // --- 8, 9, 10 Numaralı Kalıplar (4. Bab) ---
        8: { base: { emoji: "🛡️", arText: "حَفِظَ", trText: "Korudu / Ezberledi." } },
        9: { base: { emoji: "🧠", arText: "يَحْفَظُ", trText: "Korur / Ezberliyor." } },
        10: { base: { emoji: "📖", arText: "اِحْفَظْ", trText: "Koru / Ezberle!" } },

        20: { base: { emoji: "💾", arText: "حِفْظ", trText: "Koruma / Hıfz." } }, 
        33: { base: { emoji: "📖", arText: "فَاللهُ خَيْرٌ حَافِظًا", trText: "Allah en hayırlı koruyucudur. (Yusuf Suresi)" }, suggestsPlus: true, "ة": { emoji: "🧠", arText: "حَافِظَةٌ قَوِيَّةٌ", trText: "Güçlü bir hafıza." } }, 
        36: { base: { emoji: "🛡️", arText: "فِي لَوْحٍ مَحْفُوظٍ", trText: "Korunmuş bir levhadadır (Levh-i Mahfuz). (Büruc Suresi)" } }, 

        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı) ---
        64: { base: { emoji: "🏰", arText: "حَافَظَ", trText: "Özen gösterdi / Muhafaza etti." } },
        65: { base: { emoji: "🤲", arText: "يُحَافِظُ", trText: "Özen gösterir / Muhafaza ediyor." } },
        66: { base: { emoji: "❗", arText: "حَافِظْ", trText: "Özen göster / Muhafaza et!" } },

        67: { base: { emoji: "🏰", arText: "حَافِظُوا عَلَى الصَّلَوَاتِ", trText: "Namazları koruyun (özen gösterin). (Bakara Suresi)" } }, 
        69: { base: { emoji: "👔", arText: "مُحَافِظ", trText: "Koruyan / Vali (Muhafız)." } } 
    },

    // ==================================================================
    // 28. N-Z-R (ن ظ ر) KÖKÜ - Bakmak / Görmek / Beklemek
    // 1. Bab (فَعَلَ - يَفْعُلُ) ve İfti'âl Babı
    // ==================================================================
    "نظر": {
        // --- 1, 2, 3 Numaralı Kalıplar (1. Bab) ---
        1: { base: { emoji: "👁️", arText: "نَظَرَ", trText: "Baktı." } },
        2: { base: { emoji: "👀", arText: "يَنْظُرُ", trText: "Bakar / Bakıyor." } },
        3: { base: { emoji: "🔭", arText: "اُنْظُرْ", trText: "Bak!" } },

        17: { base: { emoji: "👁️", arText: "الْعَيْنُ حَقٌّ", trText: "Nazar (göz değmesi) haktır (gerçektir). (Hadis-i Şerif)" } }, 
        33: { base: { emoji: "👀", arText: "نَاظِر", trText: "Bakan / Nazır." } }, 
        38: { suggestsPlus: true, "ة": { emoji: "🌄", arText: "يَا لَهُ مِنْ مَنْظَرٍ جَمِيلٍ!", trText: "Ne kadar güzel bir manzara!" } }, 
        67: { base: { emoji: "🗣️", arText: "مُنَاظَرَة", trText: "Münazara (Karşılıklı bakışma/tartışma)." } }, 

        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı) ---
        77: { base: { emoji: "⏳", arText: "اِنْتَظَرَ", trText: "Bekledi (İntizar etti)." } },
        78: { base: { emoji: "⌚", arText: "يَنْتَظِرُ", trText: "Bekler / Bekliyor." } },
        79: { base: { emoji: "✋", arText: "اِنْتَظِرْ", trText: "Bekle!" } },

        80: { base: { emoji: "⏳", arText: "اِنْتِظَارُ الْفَرَجِ عِبَادَةٌ", trText: "Sıkıntıdan kurtulmayı beklemek (intizar) ibadettir. (Hadis-i Şerif)" } } 
    },

    // ==================================================================
    // 29. M-K-N (م ك ن) KÖKÜ - Mümkün Olmak / Yer / Güç
    // 5. Bab (فَعُلَ - يَفْعُلُ) ve Tef'îl Babı
    // ==================================================================
    "مكن": {
        // --- 11, 12, 13 Numaralı Kalıplar (5. Bab) ---
        11: { base: { emoji: "💪", arText: "مَكُنَ", trText: "Güçlü / Sağlam oldu." } },
        12: { base: { emoji: "🛡️", arText: "يَمْكُنُ", trText: "Güçlü / Sağlam olur." } },
        13: { base: { emoji: "❗", arText: "اُمْكُنْ", trText: "Güçlü ol!" } },

        22: { base: { emoji: "📍", arText: "شَرَفُ الْمَكَانِ بِالْمَكِينِ", trText: "Bir mekânın şerefi (değeri), orada bulunanlardan gelir. (Atasözü)" } }, 
        55: { base: { emoji: "✨", arText: "فِي حُدُودِ الْإِمْكَانِ", trText: "İmkânlar dâhilinde." } }, 
        56: { base: { emoji: "✔️", arText: "كُلُّ شَيْءٍ مُمْكِنٌ بِإِذْنِ اللَّهِ", trText: "Allah'ın izniyle her şey mümkündür." } }, 

        // --- 58, 59, 60 Numaralı Kalıplar (Tef'îl Babı) ---
        58: { base: { emoji: "🏗️", arText: "مَكَّنَ", trText: "Güçlendirdi / İmkan verdi." } },
        59: { base: { emoji: "⚙️", arText: "يُمَكِّنُ", trText: "Güçlendirir / İmkan verir." } },
        60: { base: { emoji: "✅", arText: "مَكِّنْ", trText: "Güçlendir / İmkan ver!" } },

        61: { base: { emoji: "💪", arText: "تَمْكِين", trText: "Güçlendirmek." } } 
    },

    // ==================================================================
    // 30. H-S-N (ح س ن) KÖKÜ - Güzellik / İyilik / İhsan
    // 5. Bab (فَعُلَ - يَفْعُلُ) ve İf'âl Babı
    // ==================================================================
    "حسن": {
        // --- 11, 12, 13 Numaralı Kalıplar (5. Bab) ---
        11: { base: { emoji: "🌸", arText: "حَسُنَ", trText: "Güzel oldu." } },
        12: { base: { emoji: "✨", arText: "يَحْسُنُ", trText: "Güzel olur." } },
        13: { base: { emoji: "💖", arText: "اُحْسُنْ", trText: "Güzel ol!" } },

        17: { base: { emoji: "🌸", arText: "الْحَسَنُ وَالْحُسَيْنُ سَيِّدَا شَبَابِ أَهْلِ الْجَنَّةِ", trText: "Hasan ve Hüseyin, cennet gençlerinin efendileridir. (Hadis-i Şerif)" } }, 
        49: { base: { emoji: "🌷", arText: "حُسَيْن", trText: "Hüseyin (Küçük güzellik)." } }, 
        50: { base: { emoji: "🥇", arText: "لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ", trText: "Biz insanı en güzel biçimde (ahsen-i takvim) yarattık. (Tîn Suresi)" } }, 
        51: { base: { emoji: "💎", arText: "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا", trText: "En güzel isimler (Esma-ül Hüsna) Allah'ındır, O'na onlarla dua edin. (A'râf Suresi)" } }, 

        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı) ---
        52: { base: { emoji: "🎁", arText: "أَحْسَنَ", trText: "İyilik yaptı (İhsan etti)." } },
        53: { base: { emoji: "🤝", arText: "يُحْسِنُ", trText: "İyilik yapar / İhsan ediyor." } },
        54: { base: { emoji: "❤️", arText: "أَحْسِنْ", trText: "İyilik yap / İhsan et!" } },

        55: { base: { emoji: "💖", arText: "هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ", trText: "İyiliğin (ihsanın) karşılığı, iyilikten başka bir şey midir? (Rahmân Suresi)" } }, 
        56: { base: { emoji: "😇", arText: "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", trText: "Şüphesiz Allah, iyilik edenleri (muhsinleri) sever. (Bakara Suresi)" } }, 
        61: { base: { emoji: "📈", arText: "تَحْسِين", trText: "İyileştirmek (Tahsin)." } } 
    },

    // ==================================================================
    // 31. S-'-D (س ع د) KÖKÜ - Mutluluk / Saadet
    // 4. Bab (فَعِلَ - يَفْعَلُ)
    // ==================================================================
    "سعد": {
        // --- 8, 9, 10 Numaralı Kalıplar (4. Bab) ---
        8: { base: { emoji: "😊", arText: "سَعِدَ", trText: "Mutlu oldu." } },
        9: { base: { emoji: "😁", arText: "يَسْعَدُ", trText: "Mutlu olur / Mutlu oluyor." } },
        10: { base: { emoji: "✨", arText: "اِسْعَدْ", trText: "Mutlu ol!" } },

        22: { suggestsPlus: true, "ة": { emoji: "✨", arText: "السَّعَادَةُ فِي الْقَنَاعَةِ", trText: "Mutluluk (saadet) kanaattedir. (Atasözü)" } }, 
        24: { base: { emoji: "🌸", arText: "سُعَاد", trText: "Suad (Mutluluk)." } }, 
        35: { base: { emoji: "😊", arText: "فَمِنْهُمْ شَقِيٌّ وَسَعِيدٌ", trText: "Onlardan kimi bedbaht (mutsuz), kimi de bahtiyar (mutlu - said)dır. (Hûd Suresi)" }, suggestsPlus: true, "ة": { emoji: "🥰", arText: "سَعِيدَة", trText: "Mutlu (Kadın)." } }, 
        36: { base: { emoji: "🍀", arText: "أَيَّامٌ مَسْعُودَةٌ", trText: "Mutlu (Mesut) ve uğurlu günler." }, suggestsPlus: true, "ة": { emoji: "🌻", arText: "مَسْعُودَة", trText: "Mesude." } } 
    },

    // ==================================================================
    // 32. J-H-L (ج ه ل) KÖKÜ - Bilmemek / Cehalet
    // 4. Bab (فَعِلَ - يَفْعَلُ)
    // ==================================================================
    "جهل": {
        // --- 8, 9, 10 Numaralı Kalıplar (4. Bab) ---
        8: { base: { emoji: "🤷", arText: "جَهِلَ", trText: "Bilmedi / Cahil kaldı." } },
        9: { base: { emoji: "❓", arText: "يَجْهَلُ", trText: "Bilmez / Bilmiyor." } },
        10: { base: { emoji: "❗", arText: "اِجْهَلْ", trText: "Bilme!" } },

        33: { base: { emoji: "🙈", arText: "النَّاسُ أَعْدَاءُ مَا جَهِلُوا", trText: "İnsanlar bilmedikleri şeyin düşmanıdır. (Hz. Ali)" }, suggestsPlus: true, "يَّة": { emoji: "🌑", arText: "جَاهِلِيَّة", trText: "Cahiliye dönemi." } }, 
        36: { base: { emoji: "❓", arText: "فَاعِلٌ مَجْهُولٌ", trText: "Faili meçhul (yapanı bilinmeyen)." } }, 
        46: { base: { emoji: "🙉", arText: "وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا", trText: "Cahiller onlara laf attığında 'Selam' der (geçerler). (Furkan Suresi)" } } 
    },

    // ==================================================================
    // 33. W-J-D (و ج د) KÖKÜ - Bulmak / Var Olmak
    // 2. Bab (وَجَدَ - يَجِدُ) Misal Fiil
    // ==================================================================
    "وجد": {
        // --- 1, 4, 5 Numaralı Kalıplar (2. Bab - Misal fiil olduğu için muzaride vav düşer) ---
        1: { base: { emoji: "🔍", arText: "وَجَدَ", trText: "Buldu." } },
        4: { base: { emoji: "🔎", arText: "يَجِدُ", trText: "Bulur / Buluyor." } },
        5: { base: { emoji: "❗", arText: "جِدْ", trText: "Bul!" } },

        25: { base: { emoji: "🌌", arText: "وُجُود", trText: "Varlık / Vücud." } }, 
        29: { base: { emoji: "❤️", arText: "صَوْتُ الْوِجْدَانِ", trText: "Vicdanın sesi." } }, 
        36: { base: { emoji: "✅", arText: "الْبَضَاعَةُ مَوْجُودَةٌ فِي الْمَخْزَنِ", trText: "Mal depoda mevcut (bulunmaktadır)." } }, 
        
        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı - أَوَجَدَ -> أَوْجَدَ) ---
        52: { base: { emoji: "✨", arText: "أَوْجَدَ", trText: "Var etti / İcat etti." } },
        53: { base: { emoji: "💡", arText: "يُوجِدُ", trText: "Var eder / İcat ediyor." } },
        54: { base: { emoji: "❗", arText: "أَوْجِدْ", trText: "Var et / İcat et!" } },

        55: { base: { emoji: "🔍", arText: "إِيجَادُ حَلٍّ لِلْمُشْكِلَةِ", trText: "Probleme bir çözüm bulmak (icad etmek)." } }, 
        56: { base: { emoji: "💡", arText: "مُوجِد", trText: "İcat eden / Mucit." } } 
    },

    // ==================================================================
    // 34. S-K-N (س ك ن) KÖKÜ - Sakin olmak / İkamet etmek / Huzur
    // 1. Bab (فَعَلَ - يَفْعُلُ)
    // ==================================================================
    "سكن": {
        // --- 1, 2, 3 Numaralı Kalıplar (1. Bab) ---
        1: { base: { emoji: "😌", arText: "سَكَنَ", trText: "Sakinleşti / İkamet etti." } },
        2: { base: { emoji: "🏡", arText: "يَسْكُنُ", trText: "Sakinleşir / İkamet ediyor." } },
        3: { base: { emoji: "🛑", arText: "اُسْكُنْ", trText: "Sakinleş / İkamet et!" } },

        33: { base: { emoji: "😌", arText: "سَاكِن", trText: "Sakin / Oturan." } }, 
        35: { suggestsPlus: true, "ة": { emoji: "✨", arText: "فَأَنْزَلَ اللهُ سَكِينَتَهُ عَلَيْهِ", trText: "Allah onun üzerine sekinetini (huzur ve güvenini) indirdi. (Tevbe Suresi)" } }, 
        36: { base: { emoji: "🏘️", arText: "مِنْطَقَةٌ مَسْكُونَةٌ", trText: "Meskun mahal (yerleşim yeri)." } }, 
        38: { base: { emoji: "🏡", arText: "وَالله جَعَلَ لَكُمْ مِنْ بُيُوتِكُمْ سَكَنًا", trText: "Allah, evlerinizi sizin için bir huzur ve dinlenme yeri (mesken) kıldı. (Nahl Suresi)" } }, 
        55: { base: { emoji: "🏢", arText: "إِسْكَان", trText: "İskan." } }, 
        61: { base: { emoji: "🕊️", arText: "تَسْكِينُ الْأَلَمِ", trText: "Ağrıyı dindirmek (Teskin etmek)." } } 
    },

    // ==================================================================
    // 35. J-H-D (ج ه د) KÖKÜ - Çaba Göstermek / Gayret / Mücadele
    // 3. Bab (فَعَلَ - يَفْعَلُ)
    // ==================================================================
    "جهد": {
        // --- 1, 6, 7 Numaralı Kalıplar (3. Bab) ---
        1: { base: { emoji: "💦", arText: "جَهَدَ", trText: "Çaba gösterdi." } },
        6: { base: { emoji: "💪", arText: "يَجْهَدُ", trText: "Çaba gösterir / Çabalıyor." } },
        7: { base: { emoji: "🏃", arText: "اِجْهَدْ", trText: "Çaba göster!" } },

        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı) ---
        64: { base: { emoji: "⚔️", arText: "جَاهَدَ", trText: "Mücadele etti / Cihad etti." } },
        65: { base: { emoji: "🛡️", arText: "يُجَاهِدُ", trText: "Mücadele eder / Cihad ediyor." } },
        66: { base: { emoji: "❗", arText: "جَاهِدْ", trText: "Mücadele et / Cihad et!" } },

        23: { base: { emoji: "🛡️", arText: "وَجَاهِدُوا فِي اللَّهِ حَقَّ جِهَادِهِ", trText: "Allah uğrunda hakkıyla cihad edin (gayret gösterin). (Hac Suresi)" } }, 
        33: { base: { emoji: "💪", arText: "جَاهِد", trText: "Çaba gösteren." } }, 
        69: { base: { emoji: "🏇", arText: "مُجَاهِد", trText: "Mücahit." }, suggestsPlus: true, "ة": { emoji: "🧕", arText: "مُجَاهِدَة", trText: "Kadın mücahit." } }, 

        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı) ---
        77: { base: { emoji: "📚", arText: "اِجْتَهَدَ", trText: "Çabaladı / İçtihat etti." } },
        78: { base: { emoji: "✍️", arText: "يَجْتَهِدُ", trText: "Çabalar / İçtihat ediyor." } },
        79: { base: { emoji: "❗", arText: "اِجْتَهِدْ", trText: "Çabala / İçtihat et!" } },

        80: { base: { emoji: "📚", arText: "الِاجْتِهَادُ مِفْتَاحُ النَّجَاحِ", trText: "Çalışmak (içtihat/gayret), başarının anahtarıdır." } }, 
        81: { base: { emoji: "🤓", arText: "لِكُلِّ مُجْتَهِدٍ نَصِيبٌ", trText: "Her çalışanın (gayret edenin) bir nasibi (payı) vardır. (Atasözü)" } } 
    },

    // ==================================================================
    // 36. S-L-M (س ل م) KÖKÜ - Barış / Kurtuluş / Teslim Olmak
    // 4. Bab (فَعِلَ - يَفْعَلُ)
    // ==================================================================
    "سلم": {
        // --- 8, 9, 10 Numaralı Kalıplar (4. Bab) ---
        8: { base: { emoji: "🕊️", arText: "سَلِمَ", trText: "Kurtuldu / Güvende oldu." } },
        9: { base: { emoji: "😌", arText: "يَسْلَمُ", trText: "Kurtulur / Güvende olur." } },
        10: { base: { emoji: "🛡️", arText: "اِسْلَمْ", trText: "Kurtul / Güvende ol!" } },

        22: { base: { emoji: "🕊️", arText: "أَفْشُوا السَّلَامَ بَيْنَكُمْ", trText: "Aranızda selamı yayınız. (Hadis-i Şerif)" }, suggestsPlus: true, "ة": { emoji: "🛡️", arText: "فِي التَّأَنِّي السَّلَامَةُ", trText: "Acele etmemekte (teennide) selamet vardır. (Atasözü)" } }, 
        33: { base: { emoji: "😌", arText: "سَالِم", trText: "Sağ salim / Güvende." } }, 
        35: { base: { emoji: "🫀", arText: "إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ", trText: "Ancak Allah'a temiz (selim) bir kalple gelenler müstesna. (Şuarâ Suresi)" } }, 

        // --- 52, 53, 54 Numaralı Kalıplar (İf'âl Babı) ---
        52: { base: { emoji: "🤲", arText: "أَسْلَمَ", trText: "Teslim oldu / Müslüman oldu." } },
        53: { base: { emoji: "☪️", arText: "يُسْلِمُ", trText: "Teslim olur / Müslüman oluyor." } },
        54: { base: { emoji: "❗", arText: "أَسْلِمْ", trText: "Teslim ol / Müslüman ol!" } },

        55: { base: { emoji: "🌙", arText: "إِنَّ الدِّينَ عِندَ اللَّهِ الْإِسْلَامُ", trText: "Şüphesiz Allah katında din İslam'dır. (Âl-i İmrân Suresi)" } }, 
        56: { base: { emoji: "🤲", arText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِن لِّسَانِهِ وَيَدِهِ", trText: "Müslüman, diğer Müslümanların onun dilinden ve elinden güvende (salim) olduğu kimsedir. (Hadis-i Şerif)" } }, 
        61: { base: { emoji: "📦", arText: "تَسْلِيم", trText: "Teslim." } } 
    },

    // ==================================================================
    // 37. R-J-' (ر ج ع) KÖKÜ - Dönmek / Başvurmak / Gözden Geçirmek
    // 2. Bab (فَعَلَ - يَفْعِلُ)
    // ==================================================================
    "رجع": {
        // --- 1, 4, 5 Numaralı Kalıplar (2. Bab) ---
        1: { base: { emoji: "↩️", arText: "رَجَعَ", trText: "Döndü." } },
        4: { base: { emoji: "🔙", arText: "يَرْجِعُ", trText: "Döner / Dönüyor." } },
        5: { base: { emoji: "❗", arText: "اِرْجِعْ", trText: "Dön!" } },

        37: { base: { emoji: "📚", arText: "إِلَى اللَّهِ مَرْجِعُكُمْ جَمِيعًا", trText: "Hepinizin dönüşü (mercii/kaynağı) Allah'adır. (Mâide Suresi)" } }, 

        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı) ---
        64: { base: { emoji: "📝", arText: "رَاجَعَ", trText: "Gözden geçirdi / Müracaat etti." } },
        65: { base: { emoji: "📖", arText: "يُرَاجِعُ", trText: "Gözden geçirir / Müracaat ediyor." } },
        66: { base: { emoji: "❗", arText: "رَاجِعْ", trText: "Gözden geçir / Müracaat et!" } },

        67: { base: { emoji: "📝", arText: "مُرَاجَعَةُ الدُّرُوسِ قَبْلَ الِامْتِحَانِ مُفِيدَةٌ", trText: "Sınavdan önce derslerin tekrar edilmesi (gözden geçirilmesi) faydalıdır." } }, 
        
        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı) ---
        77: { base: { emoji: "🔄", arText: "اِرْتَجَعَ", trText: "Geri döndü / İade etti." } },
        78: { base: { emoji: "🔁", arText: "يَرْتَجِعُ", trText: "Geri döner / İade ediyor." } },
        79: { base: { emoji: "❗", arText: "اِرْتَجِعْ", trText: "Geri dön / İade et!" } },

        80: { base: { emoji: "↩️", arText: "اِرْتِجَاعُ الْبَضَاعَةِ حَقٌّ لِلْمُشْتَرِي", trText: "Malın iadesi (geri verilmesi/artırım) alıcının hakkıdır." } } 
    },

    // ==================================================================
    // 38. Sh-K-L (ش ك ل) KÖKÜ - Biçim / Şekil / Sorun
    // 2. Bab (فَعَلَ - يَفْعِلُ)
    // ==================================================================
    "شكل": {
        // --- 1, 4, 5 Numaralı Kalıplar (2. Bab) ---
        1: { base: { emoji: "📏", arText: "شَكَلَ", trText: "Şekillendirdi." } },
        4: { base: { emoji: "📐", arText: "يَشْكِلُ", trText: "Şekillendirir." } },
        5: { base: { emoji: "❗", arText: "اِشْكِلْ", trText: "Şekillendir!" } },

        19: { base: { emoji: "📐", arText: "شَكْل", trText: "Şekil / Biçim." } }, 
        41: { base: { emoji: "🎨", arText: "أَشْكَال", trText: "Şekiller." } }, 
        56: { base: { emoji: "⚠️", arText: "لِكُلِّ مُشْكِلٍ حَلٌّ فِي النِّهَايَةِ", trText: "Her müşkülün (sorunun) sonunda bir çözümü vardır." } }, 
        
        // --- 58, 59, 60 Numaralı Kalıplar (Tef'îl Babı) ---
        58: { base: { emoji: "🏺", arText: "شَكَّلَ", trText: "Oluşturdu / Teşkil etti." } },
        59: { base: { emoji: "🛠️", arText: "يُشَكِّلُ", trText: "Oluşturur / Teşkil ediyor." } },
        60: { base: { emoji: "❗", arText: "شَكِّلْ", trText: "Oluştur / Teşkil et!" } },

        61: { base: { emoji: "🔠", arText: "تَشْكِيل", trText: "Şekillendirme." }, suggestsPlus: true, "ات": { emoji: "🏢", arText: "تَشْكِيلَاتُ الدَّوْلَةِ التَّنْظِيمِيَّةِ", trText: "Devletin kurumsal teşkilatları (yapılanmaları)." } } 
    },

    // ==================================================================
    // 39. N-S-B (ن س ب) KÖKÜ - İlişki / Soy / Oran / Uygunluk
    // 2. Bab (فَعَلَ - يَفْعِلُ)
    // ==================================================================
    "نسب": {
        // --- 1, 4, 5 Numaralı Kalıplar (2. Bab) ---
        1: { base: { emoji: "🔗", arText: "نَسَبَ", trText: "İlişkilendirdi / Soyunu belirtti." } },
        4: { base: { emoji: "🧬", arText: "يَنْسِبُ", trText: "İlişkilendirir / Mensup kılıyor." } },
        5: { base: { emoji: "❗", arText: "اِنْسِبْ", trText: "İlişkilendir / Soyunu belirt!" } },

        17: { base: { emoji: "🌳", arText: "الْمَرْءُ بِأَدَبِهِ لَا بِأَصْلِهِ وَنَسَبِهِ", trText: "Kişinin değeri aslı ve nesebiyle (soyuyla) değil, edebiyle ölçülür. (Atasözü)" } }, 
        20: { suggestsPlus: true, "ة": { emoji: "📊", arText: "نِسْبَةُ النَّجَاحِ عَالِيَةٌ فِي الِامْتِحَانِ", trText: "Sınavdaki başarı nispeti (oranı) oldukça yüksektir." } }, 
        36: { base: { emoji: "👤", arText: "مَنْسُوب", trText: "Mensup / İlişkili." } }, 
        
        // --- 64, 65, 66 Numaralı Kalıplar (Müfâ'ale Babı) ---
        64: { base: { emoji: "🧩", arText: "نَاسَبَ", trText: "Uygun oldu." } },
        65: { base: { emoji: "✅", arText: "يُنَاسِبُ", trText: "Uygun olur / Yakışıyor." } },
        66: { base: { emoji: "❗", arText: "نَاسِبْ", trText: "Uygun ol!" } },

        67: { base: { emoji: "🎉", arText: "نَحْتَفِلُ بِهَذِهِ الْمُنَاسَبَةِ السَّعِيدَةِ", trText: "Bu mutlu münasebet (vesile/özel gün) sebebiyle kutlama yapıyoruz." } }, 
        
        // --- 77, 78, 79 Numaralı Kalıplar (İfti'âl Babı) ---
        77: { base: { emoji: "📝", arText: "اِنْتَسَبَ", trText: "Kayıt oldu / İntisap etti." } },
        78: { base: { emoji: "✍️", arText: "يَنْتَسِبُ", trText: "Kayıt olur / İntisap ediyor." } },
        79: { base: { emoji: "❗", arText: "اِنْتَسِبْ", trText: "Kayıt ol / İntisap et!" } },

        80: { base: { emoji: "📝", arText: "اِنْتِسَاب", trText: "Kayıt olma / İntisap." } } 
    },
    // 40. H-S-L (ح ص ل) KÖKÜ - Elde Etmek / Ürün / Sonuç
    "حصل": {
        33: { base: { emoji: "🎯", arText: "وَالْحَاصِلُ أَنَّ الصِّحَّةَ تَاجٌ", trText: "Velhasıl (sözün özü/kısacası), sağlık bir taçtır." }, suggestsPlus: true, "ات": { emoji: "📈", arText: "زَادَتْ حَاصِلَاتُ الشَّرِكَةِ هَذَا الْعَامِ", trText: "Şirketin hasılatı (gelirleri) bu yıl arttı." } }, // حَاصِل + ات = حَاصِلَات
        36: { base: { emoji: "🌾", arText: "مَحْصُولُ هَذَا الْعَامِ وَفِيرٌ", trText: "Bu yılın mahsulü (ürünü) bereketlidir." } }, // مَحْصُول
        61: { base: { emoji: "🎓", arText: "تَحْصِيلُ الْعِلْمِ نُورٌ لِلْعَقْلِ", trText: "İlim tahsil etmek (eğitim görmek/elde etmek) akıl için nurdur." }, suggestsPlus: true, "ات": { emoji: "🧾", arText: "قِسْمُ التَّحْصِيلَاتِ فِي الْبَنْكِ", trText: "Bankadaki tahsilat (alacakların toplanması) bölümü." } } // تَحْصِيل + ات = تَحْصِيلَات
    },

    // 41. B-R-K (ب ر ك) KÖKÜ - Bereket / Kutlamak / Çoğalmak
    "برك": {
        17: { suggestsPlus: true, "ة": { emoji: "🌾", arText: "الْبَرَكَةُ فِي الْبُكُورِ", trText: "Bereket, sabahın erken vakitlerindedir. (Hadis-i Şerif)" } }, // بَرَك + ة = بَرَكَة
        61: { base: { emoji: "🥳", arText: "تَبْرِيكَاتِي الْحَارَّةُ بِمُنَاسَبَةِ النَّجَاحِ", trText: "Başarı vesilesiyle en samimi tebriklerim." } }, // تَبْرِيك
        70: { base: { emoji: "🌙", arText: "شَهْرٌ مُبَارَكٌ وَعِيدٌ سَعِيدٌ", trText: "Mübarek bir ay ve mutlu bir bayram." } }, // مُبَارَك
        91: { base: { emoji: "🤲", arText: "التَّبَرُّكُ بِدُعَاءِ الْوَالِدَيْنِ", trText: "Anne babanın duasıyla bereketlenmek (teberrük etmek)." } } // تَبَرُّك
    },

    // 42. Q-D-R (ق د ر) KÖKÜ - Ölçmek / Güç Yetirmek / Değer / Kader
    "قدر": {
        17: { base: { emoji: "✨", arText: "إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ", trText: "Şüphesiz biz her şeyi bir ölçüye göre (kaderle) yarattık. (Kamer Suresi)" } }, // قَدَر
        21: { suggestsPlus: true, "ة": { emoji: "💪", arText: "قُدْرَةُ اللَّهِ لَا حُدُودَ لَهَا", trText: "Allah'ın kudretinin (gücünün) sınırı yoktur." } }, // قُدْر + ة = قُدْرَة
        33: { base: { emoji: "🌟", arText: "هُوَ قَادِرٌ عَلَى كُلِّ شَيْءٍ", trText: "O, her şeye kadirdir (güç yetirendir)." } }, // قَادِر
        35: { base: { emoji: "💎", arText: "إِنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", trText: "Şüphesiz Allah her şeye kadirdir (sonsuz güç sahibidir). (Bakara Suresi)" } }, // قَدِير
        40: { base: { emoji: "📊", arText: "بِمِقْدَارٍ مُعَيَّنٍ", trText: "Belirli bir miktarda." } }, // مِقْدَار
        61: { base: { emoji: "👏", arText: "شَهَادَةُ تَقْدِيرٍ", trText: "Takdir (teşekkür) belgesi." } }, // تَقْدِير
        63: { suggestsPlus: true, "ات": { emoji: "🔮", arText: "مُقَدَّرَاتُ الْإِنْسَانِ مَكْتُوبَةٌ", trText: "İnsanın mukadderatı (alın yazısı) yazılmıştır." } }, // مُقَدَّر + ات = مُقَدَّرَات
        80: { base: { emoji: "👑", arText: "حِزْبُ الِاقْتِدَارِ", trText: "İktidar partisi (yönetme gücü)." } }, // اِقْتِدَار
        81: { base: { emoji: "🦁", arText: "فِي مَقْعَدِ صِدْقٍ عِندَ مَلِكٍ مُّقْتَدِرٍ", trText: "Güçlü bir padişahın (Muktedir olan Allah'ın) katında, doğruluk koltuğundadırlar. (Kamer Suresi)" } } // مُقْتَدِر
    },

    // 43. M-L-K (م ل ك) KÖKÜ - Sahip Olmak / Yönetmek / Melek
    "ملك": {
        17: { base: { emoji: "👼", arText: "الْمَلَائِكَةُ عِبَادٌ مُكْرَمُونَ", trText: "Melekler (Allah'ın) ikram olunmuş kullarıdır." } }, // مَلَك
        21: { base: { emoji: "👑", arText: "لِلَّهِ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ", trText: "Göklerin ve yerin mülkü (hükümranlığı) Allah'ındır. (Şûrâ Suresi)" } }, // مُلْك
        33: { base: { emoji: "🔑", arText: "مَالِكِ يَوْمِ الدِّينِ", trText: "Din gününün maliki (sahibi)dir. (Fâtiha Suresi)" } }, // مَالِك
        35: { base: { emoji: "🤴", arText: "فِي مَقْعَدِ صِدْقٍ عِندَ مَلِيكٍ مُّقْتَدِرٍ", trText: "Güçlü bir padişahın (Melik'in) katında, doğruluk koltuğundadırlar. (Kamer Suresi)" }, suggestsPlus: true, "ة": { emoji: "👸", arText: "مَلِيكَة", trText: "Kraliçe." } }, // مَلِيك + ة = مَلِيكَة
        36: { base: { emoji: "🛡️", arText: "الدَّوْلَةُ الْمَمْلُوكِيَّةُ فِي التَّارِيخِ", trText: "Tarihteki Memlük (köleleştirilmiş asker/hükümdar) Devleti." } }, // مَمْلُوك
        38: { suggestsPlus: true, "ة": { emoji: "🏰", arText: "الْمَمْلَكَةُ الْعَرَبِيَّةُ السُّعُودِيَّةُ", trText: "Suudi Arabistan Krallığı (Arapçada krallık, Türkçede yurt/memleket)." } }, // مَمْلَك + ة = مَمْلَكَة
        41: { base: { emoji: "🏢", arText: "مَكْتَبُ الْأَمْلَاكِ وَالْعَقَارَاتِ", trText: "Emlak (mülkler) ve gayrimenkul ofisi." } } // أَمْلَاك
    },

    // 44. R-S-L (ر س ل) KÖKÜ - Göndermek / Elçi / Mesaj
    "رسل": {
        23: { suggestsPlus: true, "ة": { emoji: "✉️", arText: "أَرْسَلْتُ رِسَالَةً نَصِّيَّةً", trText: "Bir kısa mesaj (risale/mektup) gönderdim." } }, // رِسَال + ة = رِسَالَة
        26: { base: { emoji: "🌙", arText: "مُحَمَّدٌ رَسُولُ اللَّهِ", trText: "Muhammed Allah'ın resulüdür (elçisidir). (Fetih Suresi)" } }, // رَسُول
        52: { base: { emoji: "📤", arText: "أَرْسَلَ", trText: "Gönderdi." } }, // أَفْعَلَ (أَرْسَلَ)
        55: { suggestsPlus: true, "يَّة": { emoji: "🧾", arText: "إِرْسَالِيَّةُ الْبَضَائِعِ جَاهِزَةٌ", trText: "Malların sevk irsaliyesi (teslimat belgesi) hazırdır." } }, // إِرْسَال + يَّة = إِرْسَالِيَّة
        57: { base: { emoji: "👤", arText: "مُرْسَل", trText: "Gönderilen (Mürsel)." } } // مُرْسَل
    },

    // 45. N-S-R (ن ص ر) KÖKÜ - Yardım Etmek / Zafer
    "نصر": {
        19: { base: { emoji: "✌️", arText: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", trText: "Allah'ın yardımı (nasrı) ve fetih geldiğinde. (Nasr Suresi)" } }, // نَصْر
        21: { suggestsPlus: true, "ة": { emoji: "🤝", arText: "نُصْرَةُ الْمَظْلُومِ وَاجِبَةٌ", trText: "Mazluma yardım etmek (nusret/destek) vaciptir." } }, // نُصْر + ة = نُصْرَة
        33: { base: { emoji: "🛡️", arText: "نَاصِر", trText: "Yardım eden / Nasıf." } }, // نَاصِر
        36: { base: { emoji: "🏆", arText: "عَادَ الْجَيْشُ مَنْصُورًا", trText: "Ordu muzaffer (mansur/yardım görmüş) olarak döndü." } } // مَنْصُور
    },

    // 46. H-M-L (ح م ل) KÖKÜ - Taşımak / Yüklenmek / Dayanmak
    "حمل": {
        19: { suggestsPlus: true, "ة": { emoji: "📣", arText: "حَمْلَةٌ تَعْلِيمِيَّةٌ جَدِيدَةٌ", trText: "Yeni bir eğitim kampanyası (hamlesi)." } }, // حَمْل + ة = حَمْلَة
        33: { suggestsPlus: true, "ة": { emoji: "🤰", arText: "الْمَرْأَةُ الْحَامِلَةُ", trText: "Hamile (gebe) kadın." } }, // حَامِل + ة = حَامِلَة
        34: { base: { emoji: "📦", arText: "حَمَّالُ الْمَحَطَّةِ يُسَاعِدُ الْمُسَافِرِينَ", trText: "İstasyon hamalı yolculara yardım ediyor." } }, // حَمَّال
        80: { base: { emoji: "🎲", arText: "بِكُلِّ اِحْتَمَالٍ", trText: "Her ihtimale karşı." } }, // اِحْتَمَال
        82: { base: { emoji: "🔮", arText: "أَمْرٌ مُحْتَمَلٌ جِدًّا", trText: "Çok muhtemel (olası) bir durum." } }, // مُحْتَمَل
        91: { base: { emoji: "⏳", arText: "الصَّبْرُ هُوَ تَحَمُّلُ الصِّعَابِ", trText: "Sabır, zorluklara tahammül etmektir (dayanmaktır)." } } // تَحَمُّل
    },

    // 47. H-Q-Q (ح ق ق) KÖKÜ - Hak / Gerçek / Doğruluk
    "حقق": {
        19: { base: { emoji: "⚖️", arText: "الْحَقُّ يَعْلُو وَلَا يُعْلَى عَلَيْهِ", trText: "Hak yücedir ve ondan üstünü yoktur. (Atasözü)" } }, // حَقّ (حَقْق)
        25: { base: { emoji: "📚", arText: "كُلِّيَّةُ الْحُقُوقِ", trText: "Hukuk fakültesi." } }, // حُقُوق
        35: { suggestsPlus: true, "ة": { emoji: "💎", arText: "هَذِهِ هِيَ الْحَقِيقَةُ", trText: "İşte bu hakikattir (gerçektir)." } }, // حَقِيق + ة = حَقِيقَة
        61: { base: { emoji: "🔍", arText: "جَارٍ التَّحْقِيقُ فِي الْأَمْرِ", trText: "Olayla ilgili tahkikat (inceleme/soruşturma) devam ediyor." } }, // تَحْقِيق
        63: { base: { emoji: "💯", arText: "أَمْرٌ مُحَقَّقٌ بِإِذْنِ اللَّهِ", trText: "Allah'ın izniyle muhakkak (kesinleşmiş) bir durum." } }, // مُحَقَّق
        103: { base: { emoji: "🏆", arText: "اِسْتِحْقَاق", trText: "Hak etme." } }, // اِسْتِحْقَاق
        105: { base: { emoji: "🎖️", arText: "الْجَائِزَةُ مُسْتَحَقَّةٌ لَهُ", trText: "Ödül ona müstehaktır (hak edilmiştir)." } } // مُسْتَحَقّ
    },

    // 48. Kh-L-S (خ ل ص) KÖKÜ - Saflık / Samimiyet / İhlas
    "خلص": {
        33: { base: { emoji: "💎", arText: "عَسَلٌ خَالِصٌ وَذَهَبٌ خَالِصٌ", trText: "Halis (saf/katkısız) bal ve halis altın." } }, // خَالِص
        55: { base: { emoji: "❤️", arText: "الْإِخْلَاصُ فِي الْعَمَلِ أَسَاسُ الْقَبُولِ", trText: "İşte ihlas (samimiyet/içtenlik), kabulün temelidir." } }, // إِخْلَاص
        56: { base: { emoji: "😇", arText: "هُوَ صَدِيقٌ مُخْلِصٌ لَا يَتَغَيَّرُ", trText: "O, asla değişmeyen muhlis (samimi/sadık) bir dosttur." } } // مُخْلِص
    },

    // 49. K-M-L (ك م ل) KÖKÜ - Tamamlamak / Olgunluk / Kusursuzluk
    "كمل": {
        22: { base: { emoji: "🌟", arText: "الْكَمَالُ لِلَّهِ وَحْدَهُ", trText: "Kemal (kusursuzluk) sadece Allah'a mahsustur." } }, // كَمَال
        33: { base: { emoji: "🌕", arText: "بَدْرٌ كَامِلٌ", trText: "Kamil (tam) dolunay." } }, // كَامِل
        55: { base: { emoji: "🧩", arText: "إِكْمَالُ النَّقْصِ", trText: "Eksiği tamamlama (ikmal)." } }, // إِكْمَال
        61: { base: { emoji: "✅", arText: "تَكْمِيل", trText: "Tamamlama." } }, // تَكْمِيل
        63: { base: { emoji: "💯", arText: "عَمَلٌ مُكَمَّلٌ وَرَائِعٌ", trText: "Mükemmel (eksiksiz) ve harika bir iş." } } // مُكَمَّل
    },

    // 50. R-Sh-D (ر ش د) KÖKÜ - Doğru Yolda Olmak / Olgunluk / Rehberlik
    "رشد": {
        21: { base: { emoji: "🌱", arText: "قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ", trText: "Doğru yol (rüşt), eğri yoldan kesinlikle ayrılmıştır. (Bakara Suresi)" } }, // رُشْد
        22: { base: { emoji: "💎", arText: "أَهْدِكُمْ سَبِيلَ الرَّشَادِ", trText: "Sizi doğru yola (reşat yoluna) ulaştırayım. (Mü'min Suresi)" } }, // رَشَاد
        33: { base: { emoji: "🕌", arText: "الْخُلَفَاءُ الرَّاشِدُونَ", trText: "Hulefâ-yi Râşidîn (Doğru yolda olan râşit halifeler)." } }, // رَاشِد
        35: { base: { emoji: "🧠", arText: "أَلَيْسَ مِنْكُمْ رَجُلٌ رَشِيدٌ", trText: "İçinizde aklı başında (reşit/doğru dürüst) bir adam yok mu? (Hûd Suresi)" } }, // رَشِيد
        55: { base: { emoji: "ℹ️", arText: "إِرْشَادُ النَّاسِ إِلَى الْخَيْرِ", trText: "İnsanları hayra yönlendirmek (irşat etmek)." } }, // إِرْشَاد
        56: { base: { emoji: "🗺️", arText: "الْكِتَابُ خَيْرُ مُرْشِدٍ لِلْإِنْسَانِ", trText: "Kitap, insan için en iyi mürşittir (yol göstericidir/rehberdir)." } } // مُرْشِد
    },

    // 51. A-M-N (ا م ن) KÖKÜ - Güvende Olmak / İnanmak / Güvenilirlik
    "امن": {
        19: { base: { emoji: "👮", arText: "أَمْن", trText: "Güvenlik." } }, // أَمْن
        22: { base: { emoji: "🛡️", arText: "الْأَمَانُ وَالصِّحَّةُ نِعْمَتَانِ", trText: "Aman (güvenlik) ve sağlık iki büyük nimettir." }, suggestsPlus: true, "ة": { emoji: "📦", arText: "الأَمَانَةُ تَجْلِبُ الرِّزْقَ", trText: "Emaneti korumak (güvenilir olmak) rızık getirir." } }, // أَمَان + ة = أَمَانَة
        35: { base: { emoji: "🤝", arText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ وَالْمُؤْمِنُ مَنْ أَمِنَهُ النَّاسُ", trText: "Müslüman, diğer Müslümanların elinden ve dilinden emin olduğu kimsedir." } }, // أَمِين
        55: { base: { emoji: "❤️", arText: "الْإِيمَانُ مَا وَقَرَ فِي الْقَلْبِ", trText: "İman, kalbe yerleşen (inanılan) şeydir." } }, // إِيمَان
        56: { base: { emoji: "🕌", arText: "الْمُؤْمِنُ مِرْآةُ الْمُؤْمِنِ", trText: "Mümin, müminin aynasıdır. (Hadis-i Şerif)" } }, // مُؤْمِن
        61: { base: { emoji: "📝", arText: "شَرِكَةُ التَّأْمِينِ الصِّحِّيِّ", trText: "Sağlık sigortası (güvencesi/tamini) şirketi." } } // تَأْمِين
    },

    // 52. J-M-' (ج م ع) KÖKÜ - Toplamak / Bir Araya Getirmek / Topluluk
    "جمع": {
        19: { base: { emoji: "🔢", arText: "جَمْع", trText: "Toplama." }, suggestsPlus: true, "يَّة": { emoji: "🏢", arText: "جَمْعِيَّةٌ خَيْرِيَّةٌ لِمُسَاعَدَةِ الْمُحْتَاجِينَ", trText: "İhtiyaç sahiplerine yardım için bir hayır cemiyeti (derneği)." } }, // جَمْع + يَّة = جَمْعِيَّة
        22: { suggestsPlus: true, "ة": { emoji: "👥", arText: "صَلَاةُ الْجَمَاعَةِ أَفْضَلُ مِنْ صَلَاةِ الْفَذِّ", trText: "Cemaatle kılınan namaz, tek başına kılınan namazdan daha faziletlidir. (Hadis-i Şerif)" } }, // جَمَاع + ة = جَمَاعَة
        33: { base: { emoji: "🕌", arText: "أَحَبُّ الْبِلَادِ إِلَى اللَّهِ مَسَاجِدُهَا", trText: "Allah'a beldelerin en sevimlisi mescitlerdir (camilerdir). (Hadis-i Şerif)" }, suggestsPlus: true, "ة": { emoji: "🎓", arText: "الْحَيَاةُ الْجَامِعِيَّةُ مَلِيئَةٌ بِالتَّجَارِبِ", trText: "Üniversite hayatı tecrübelerle doludur." } }, // جَامِع + ة = جَامِعَة
        36: { suggestsPlus: true, "ة": { emoji: "📂", arText: "مَجْمُوعَةٌ جَدِيدَةٌ مِنَ الطُّلَّابِ", trText: "Yeni bir öğrenci grubu (kümesi)." } }, // مَجْمُوع + ة = مَجْمُوعَة
        42: { suggestsPlus: true, "ة": { emoji: "🕋", arText: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِنْ يَوْمِ الْجُمُعَةِ...", trText: "Ey iman edenler! Cuma günü namaz için çağrı yapıldığında... (Cuma Suresi)" } }, // جُمُع + ة = جُمُعَة
        80: { base: { emoji: "💼", arText: "لَدَيْنَا اِجْتِمَاعٌ مُهِمٌّ الْيَوْمَ", trText: "Bugün önemli bir toplantımız (içtimamız) var." } } // اِجْتِمَاع
    },

    // 53. H-M-D (ح م د) KÖKÜ - Övmek / Şükretmek
    "حمد": {
        19: { base: { emoji: "🤲", arText: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", trText: "Hamd (övgü ve şükür), alemlerin Rabbi olan Allah'a mahsustur. (Fâtiha Suresi)" }, suggestsPlus: true, "يَّة": { emoji: "🌸", arText: "حَمْدِيَّة", trText: "Hamdiye (İsim)." } }, // حَمْد + يَّة = حَمْدِيَّة
        30: { base: { emoji: "🌟", arText: "وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ", trText: "Benden sonra gelecek 'Ahmet' (çok övülen) adındaki bir peygamberi müjdeleyici olarak... (Saf Suresi)" } }, // أَحْمَد
        35: { base: { emoji: "💎", arText: "إِنَّ اللَّهَ هُوَ الْغَنِيُّ الْحَمِيدُ", trText: "Şüphesiz Allah, hiçbir şeye muhtaç değildir, her türlü övgüye layıktır (Hamit'tir). (Lokmân Suresi)" } }, // حَمِيد
        36: { base: { emoji: "🏅", arText: "عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا", trText: "Umulur ki Rabbin seni Makam-ı Mahmud'a (övülmüş bir makama) ulaştırır. (İsrâ Suresi)" } }, // مَحْمُود
        63: { base: { emoji: "🌹", arText: "مُحَمَّدٌ رَّسُولُ اللَّهِ", trText: "Muhammed (s.a.v), Allah'ın elçisidir. (Fetih Suresi)" } } // مُحَمَّد
    },

    // 54. Sh-H-R (ش ه ر) KÖKÜ - Belirmek / İlan Etmek / Ay / Şöhret
    "شهر": {
        19: { base: { emoji: "📅", arText: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ", trText: "Ramazan ayı, içinde Kur'an'ın indirildiği aydır. (Bakara Suresi)" } }, // شَهْر
        21: { suggestsPlus: true, "ة": { emoji: "🌟", arText: "النَّجَاحُ يَجْلِبُ الشُّهْرَةَ عَبْرَ الْعَمَلِ", trText: "Başarı, çalışmayla birlikte şöhreti (tanınmışlığı) getirir." } }, // شُهْر + ة = شُهْرَة
        36: { base: { emoji: "🎤", arText: "هُوَ كَاتِبٌ مَشْهُورٌ فِي الْعَالَمِ", trText: "O, dünyada meşhur (tanınmış) bir yazardır." } }, // مَشْهُور
        61: { base: { emoji: "📢", arText: "تَشْهِيرُ الْأَخْبَارِ الْكَاذِبَةِ مَمْنُوعٌ", trText: "Yalan haberlerin teşhir edilmesi (ifşa edilmesi/yayılması) yasaktır." } } // تَشْهِير
    },

    // 55. Sh-K-R (ش ك ر) KÖKÜ - Teşekkür Etmek / Şükretmek
    "شكر": {
        21: { base: { emoji: "🙏", arText: "مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ اللَّهَ", trText: "İnsanlara teşekkür etmeyen, Allah'a da şükretmez. (Hadis-i Şerif)" }, suggestsPlus: true, "يّ": { emoji: "👨", arText: "شُكْرِيّ", trText: "Şükrü." }, "يَّة": { emoji: "👩", arText: "شُكْرِيَّة", trText: "Şükriye." } }, // شُكْر + ekler
        27: { base: { emoji: "🌹", arText: "شُكْرَانًا جَزِيلًا عَلَى حُسْنِ صَنِيعِكُمْ", trText: "Güzel davranışınız için çok şükran (teşekkür) ederim." } }, // شُكْرَان
        33: { base: { emoji: "😇", arText: "أَنَا شَاكِرٌ لَكَ عَلَى مَعْرُوفِكَ", trText: "İyiliğin için sana şâkirim (teşekkür ederim/minnettarım)." } }, // شَاكِر
        91: { base: { emoji: "🤝", arText: "تَشَكُّرَاتِي الْقَلْبِيَّةُ لَكُمْ جَمِيعًا", trText: "Hepinize kalbi teşekkürlerimi (teşekkürlerimi) sunarım." } }, // تَشَكُّر
        92: { base: { emoji: "👔", arText: "أَنَا مُتَشَكِّرٌ جِدًّا لِمُسَاعَدَتِكُمْ", trText: "Yardımınız için çok müteşekkirim (minnettarım)." } } // مُتَشَكِّر
    },

    // 56. F-K-R (ف ك ر) KÖKÜ - Düşünmek / Fikir
    "فكر": {
        20: { base: { emoji: "🧠", arText: "الْفِكْرُ حُرٌّ وَلَا يُقَيَّدُ", trText: "Fikir özgürdür ve kısıtlanamaz." }, suggestsPlus: true, "يّ": { emoji: "💡", arText: "حُقُوقُ الْمِلْكِيَّةِ الْفِكْرِيَّةِ", trText: "Fikri mülkiyet hakları." }, "ة": { emoji: "💭", arText: "هَذِهِ فِكْرَةٌ مُمْتَازَةٌ جِدًّا", trText: "Bu, çok mükemmel bir fikir." } }, // فِكْر + ekler
        91: { base: { emoji: "🤔", arText: "تَفَكُّرُ سَاعَةٍ خَيْرٌ مِنْ عِبَادَةِ سَنَةٍ", trText: "Bir saat tefekkür (derin düşünme), bir yıl ibadetten hayırlıdır." } }, // تَفَكُّر
        92: { base: { emoji: "🧔", arText: "هُوَ كَاتِبٌ وَمُتَفَكِّرٌ كَبِيرٌ", trText: "O, büyük bir yazar ve mütefekkirdir (düşünürdür)." } } // مُتَفَكِّر
    },

    // 57. W-K-L (و ك ل) KÖKÜ - Güvenmek / Vekil Tayin Etmek / Dayanmak
    "وكل": {
        22: { suggestsPlus: true, "ة": { emoji: "📜", arText: "أَعْطَاهُ وَكَالَةً عَامَّةً", trText: "Ona genel vekalet (temsil yetkisi) verdi." } }, // وَكَال + ة = وَكَالَة
        35: { base: { emoji: "🛡️", arText: "حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ", trText: "Allah bize yeter, O ne güzel vekildir. (Âl-i İmrân Suresi)" } }, // وَكِيل
        62: { base: { emoji: "👤", arText: "الْمُحَامِي يُدَافِعُ عَنْ مُوَكِّلِهِ", trText: "Avukat müvekkilini (kendisini vekil tayin edeni) savunur." } }, // مُوَكِّل
        91: { base: { emoji: "🤲", arText: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", trText: "Kim Allah'a tevekkül ederse, O ona yeter. (Talak Suresi)" } } // تَوَكُّل
    },

    // 58. Q-D-M (ق د م) KÖKÜ - Öne Geçmek / Eski / Sunmak / Adım
    "قدم": {
        17: { suggestsPlus: true, "ة": { emoji: "🪜", arText: "قَدَمَة", trText: "Adım / Basamak." } }, // قَدَم + ة = قَدَمَة
        35: { base: { emoji: "🏛️", arText: "صَدَاقَتُنَا قَدِيمَةٌ وَقَوِيَّةٌ", trText: "Dostluğumuz kadim (eski) ve güçlüdür." } }, // قَدِيم
        61: { base: { emoji: "🎁", arText: "تَقْدِيمُ الْهَدَايَا يَزِيدُ الْمَحَبَّةَ", trText: "Hediye takdim etmek (sunmak) sevgiyi artırır." } }, // تَقْدِيم
        62: { suggestsPlus: true, "ة": { emoji: "📖", arText: "مُقَدِّمَةُ ابْنِ خَلْدُونَ أَثَرٌ تَارِيخِيٌّ عَظِيمٌ", trText: "İbn Haldun'un Mukaddime'si (önsözü/giriş eseri) harika bir tarihi eserdir." } } // مُقَدِّم + ة = مُقَدِّمَة
    },

    // 59. K-B-R (ك ب ر) KÖKÜ - Büyümek / Büyük Olmak / Yücelik / Kibir
    "كبر": {
        20: { base: { emoji: "🦚", arText: "الْكِبْرُ مَذْمُومٌ فِي الْأَخْلَاقِ", trText: "Kibir, ahlakta kınanmış (kötü) bir davranıştır." } }, // كِبْر
        23: { base: { emoji: "🧓", arText: "اِحْتِرَامُ كِبَارِ السِّنِّ وَاجِبٌ", trText: "Yaşça büyük olanlara (büyüklere) saygı göstermek vaciptir." } }, // كِبَار
        50: { base: { emoji: "🌌", arText: "اللهُ أَكْبَرُ مِنْ كُلِّ شَيْءٍ", trText: "Allah her şeyden en büyüktür (ekberdir)." } }, // أَكْبَر
        51: { base: { emoji: "🌟", arText: "الْقِيَامَةُ هِيَ الدَّاهِيَةُ الْكُبْرَى", trText: "Kıyamet en büyük (kübra) hadisedir." } }, // كُبْرَى
        61: { base: { emoji: "🕌", arText: "نُرَدِّدُ التَّكْبِيرَ فِي أَيَّامِ الْعِيدِ", trText: "Bayram günlerinde tekbir getiririz." } } // تَكْبِير
    },

    // 60. '-D-L (ع د ل) KÖKÜ - Adalet / Eşitlik / Düzenleme
    "عدل": {
        19: { suggestsPlus: true, "يَّة": { emoji: "🏛️", arText: "ذَهَبَ الْمُحَامِي إِلَى الْعَدْلِيَّةِ", trText: "Avukat adliyeye (sarayına) gitti." } }, // عَدْل + يَّة = عَدْلِيَّة
        22: { suggestsPlus: true, "ة": { emoji: "⚖️", arText: "الْعَدَالَةُ أَسَاسُ الْمُلْكِ", trText: "Adalet mülkün (devletin) temelidir." } }, // عَدَال + ة = عَدَالَة
        33: { base: { emoji: "👨‍⚖️", arText: "هُوَ قَاضٍ عَادِلٌ يَحْكُمُ بِالْحَقِّ", trText: "O, hakla hükmeden adil bir kadıdır (hakimdir)." } }, // عَادِل
        61: { suggestsPlus: true, "ات": { emoji: "🔧", arText: "إِجْرَاءُ تَعْدِيلَاتٍ جَدِيدَةٍ فِي الْقَانُونِ", trText: "Kanunda yeni tadilatlar (düzenlemeler/değişiklikler) yapmak." } }, // تَعْدِيل + ات = تَعْدِيلَات
        69: { base: { emoji: "🟰", arText: "هَذَا الدَّوَاءُ مُعَادِلٌ لِلْآخَرِ", trText: "Bu ilaç diğeriyle muadildir (eşdeğerdir)." } }, // مُعَادِل
        80: { base: { emoji: "🍃", arText: "الِاعْتِدَالُ فِي كُلِّ شَيْءٍ خَيْرٌ", trText: "Her şeyde itidal (ölçülülük/dengeli olmak) hayırlıdır." } } // اِعْتِدَال
    }
};

function checkWordEasterEgg(boxElement, currentSuffix = null) {
    const plusBtn = document.querySelector('.fa-plus');
    if (plusBtn && !currentSuffix) {
        plusBtn.classList.remove('plus-highlighted');
    }

    if (!boxElement || !currentRoot || currentRoot.length !== 3) return;

    const refEl = boxElement.querySelector('.ref');
    if (!refEl) return;
    const refId = parseInt(refEl.innerText);

    const rootData = wordEasterEggs[currentRoot];
    if (!rootData) return;

    const refData = rootData[refId]; 
    if (!refData) return;

    // Eğer bir ek eklendiyse eke ait veriyi al, yoksa 'base' (kök halini) al
    const data = currentSuffix ? refData[currentSuffix] : refData.base;

    // Eğer ek almamış kök haldeysek ve kelime ek öneriyorsa + ikonunu parlat
    if (!currentSuffix && refData.suggestsPlus && plusBtn) {
        plusBtn.classList.add('plus-highlighted');
    }

    if (!data) return;

    document.querySelectorAll('.easter-egg-trigger').forEach(btn => btn.remove());

    if (data.emoji) {
        const rect = boxElement.getBoundingClientRect();
        const emojiDiv = document.createElement('div');
        emojiDiv.className = 'floating-emoji';
        emojiDiv.innerText = data.emoji;
        
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        emojiDiv.style.left = (rect.left + scrollX + rect.width / 2 - 37.5) + 'px'; 
        emojiDiv.style.top = (rect.top + scrollY - 20) + 'px';
        
        document.body.appendChild(emojiDiv);

        setTimeout(() => { emojiDiv.remove(); }, 5000);
    }

    if (data.arText || data.trText) {
        const triggerBtn = document.createElement('div');
        triggerBtn.className = 'easter-egg-trigger';
        triggerBtn.innerHTML = '✨'; 
        triggerBtn.title = 'Bilgiyi Gör';

        triggerBtn.onclick = function(e) {
            e.stopPropagation(); 
            showEasterEggOverlay(data.arText, data.trText);
            this.remove(); 
        };
        boxElement.appendChild(triggerBtn);
    }
}

let currentPulseTimeout = null;

function triggerAreaPulse(boxElement, forceDelay = false) {
    if (!boxElement) return;
    
    if (currentPulseTimeout) clearTimeout(currentPulseTimeout);

    const isZoomEnabled = document.getElementById('zoomToggleCheckbox').checked;
    
    let hasEgg = forceDelay;
    
    // Eğer doğrudan zorunlu (ek alınca olan) gecikme yoksa Base halini kontrol et
    if (!hasEgg && currentRoot && currentRoot.length === 3) {
        const refEl = boxElement.querySelector('.ref');
        if (refEl) {
            const refId = parseInt(refEl.innerText);
            if (wordEasterEggs[currentRoot] && wordEasterEggs[currentRoot][refId] && wordEasterEggs[currentRoot][refId].base) {
                hasEgg = true;
            }
        }
    }
    
    const delay = (isZoomEnabled && hasEgg) ? 1500 : 0;

    currentPulseTimeout = setTimeout(() => {
        boxElement.classList.remove("pulse-highlight");

        if (!isZoomEnabled) {
            boxElement.style.setProperty("background-color", "#bfffdf", "important");
            boxElement.style.borderColor = "#000000";
            return;
        }

        const rect = boxElement.getBoundingClientRect();
        const moveX = (window.innerWidth / 2) - (rect.left + rect.width / 2);
        const moveY = (window.innerHeight / 2) - (rect.top + rect.height / 2);

        boxElement.style.setProperty('--start-x', '0px');
        boxElement.style.setProperty('--start-y', '0px');
        boxElement.style.setProperty('--move-x', `${moveX}px`);
        boxElement.style.setProperty('--move-y', `${moveY}px`);
        
        boxElement.style.transform = "translateZ(0) rotate(0.001deg)";
        void boxElement.offsetWidth; 
        
        boxElement.style.setProperty("background-color", "#bfffdf", "important");
        boxElement.style.borderColor = "#000000";

        boxElement.classList.add("pulse-highlight");

        setTimeout(() => {
            boxElement.classList.remove("pulse-highlight");
            boxElement.style.transform = "";
            boxElement.style.setProperty("background-color", "#bfffdf", "important");
            boxElement.style.borderColor = "#000000";
        }, 3000);
    }, delay);
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
        arDiv.innerText = arText; 
        arDiv.style.display = 'block'; 
    } else { 
        arDiv.style.display = 'none'; 
    }
    
    if (trText) { 
        trDiv.innerText = trText; 
        trDiv.style.display = 'block'; 
    } else { 
        trDiv.style.display = 'none'; 
    }
    
    SoundEngine.playClick();
    overlay.style.display = 'flex';
}

function openMatrixFullscreen(e, btnElement) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    SoundEngine.playClick();
    
    const boxElement = btnElement.closest('.glass-box');
    if (!boxElement) return;
    
    const sigaCells = boxElement.querySelectorAll('.siga-text');
    let wordsList = [];
    sigaCells.forEach(cell => {
        wordsList.push(cell.innerText.trim());
    });
    
    if (wordsList.length === 0) return;
    
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
    }
    
    const contentArea = fullscreenOverlay.querySelector('.matrix-fullscreen-content');
    
    const oldTable = contentArea.querySelector('.matrix-fullscreen-table');
    if (oldTable) oldTable.remove();
    
    const table = document.createElement('table');
    table.className = 'matrix-fullscreen-table';
    
    let tbodyHtml = '';
    for (let i = 0; i < wordsList.length; i += 3) {
        let rowIndex = i / 3;
        let bgColor = '#ffffff'; 
        
        if (rowIndex === 0 || rowIndex === 2) {
            bgColor = '#e3f2fd'; 
        } else if (rowIndex === 1 || rowIndex === 3) {
            bgColor = '#fce4ec'; 
        }

        tbodyHtml += `
            <tr>
                <td style="background-color: ${bgColor} !important;"><span class="matrix-fullscreen-text">${wordsList[i] || ''}</span></td>
                <td style="background-color: ${bgColor} !important;"><span class="matrix-fullscreen-text">${wordsList[i+1] || ''}</span></td>
                <td style="background-color: ${bgColor} !important;"><span class="matrix-fullscreen-text">${wordsList[i+2] || ''}</span></td>
            </tr>
        `;
    }
    
    table.innerHTML = `
        <thead>
            <tr>
                <th>Müfred</th>
                <th>Tesniye</th>
                <th>Cemi</th>
            </tr>
        </thead>
        <tbody>
            ${tbodyHtml}
        </tbody>
    `;
    
    contentArea.appendChild(table);
    fullscreenOverlay.style.display = 'flex';
}

function closeMatrixFullscreen(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    SoundEngine.playClose();
    const fullscreenOverlay = document.getElementById('matrix-fullscreen-overlay');
    if (fullscreenOverlay) {
        fullscreenOverlay.style.display = 'none';
    }
}

function highlightEasterEggBoxes(root) {
    document.querySelectorAll('.glass-box').forEach(box => {
        if (!box.style.backgroundColor) {
            box.style.borderColor = "";
            box.style.boxShadow = "";
        }
        if (root && root.length === 3) {
            const rootData = wordEasterEggs[root]; 
            if (rootData) {
                const refEl = box.querySelector('.ref');
                if (refEl) {
                    const refId = parseInt(refEl.innerText);
                    // Base varsa veya en azından o kutu için bir ek tanımlıysa kutuyu altın yap
                    if (rootData[refId] && !box.style.backgroundColor) {
                        box.style.setProperty("border-color", "#FFCC00", "important");
                        box.style.setProperty("box-shadow", "0 0 12px rgba(255, 204, 0, 0.8)", "important");
                    }
                }
            }
        }
    });
}