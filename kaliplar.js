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
        23: { base: { emoji: "📖", arText: "خَيْرُ جَلِيسٍ فِي الزَّمَانِ كِتَابٌ", trText: "Zamanın en hayırlı dostu (arkadaşı) kitaptır." }, suggestsPlus: true, "ة": { emoji: "✍️", arText: "كِتَابَة", trText: "Yazı yazmak." } }, // كِتَاب + ة = كِتَابَة
        33: { base: { emoji: "📝", arText: "كَاتِب", trText: "Yazar / Katip." } }, // كَاتِب
        36: { base: { emoji: "✉️", arText: "المَكْتُوبُ يُقْرَأُ مِنْ عُنْوَانِهِ", trText: "Mektup adresinden belli olur. (Perşembenin gelişi çarşambadan bellidir)" } }, // مَكْتُوب
        38: { base: { emoji: "🏢", arText: "مَكْتَب", trText: "Ofis / Masa." }, suggestsPlus: true, "ة": { emoji: "📚", arText: "مَكْتَبَة", trText: "Kütüphane." } } // مَكْتَب + ة = مَكْتَبَة
    },

    // 2. Kh-B-R (خ ب ر) KÖKÜ - Haber Vermek
    "خبر": {
        17: { base: { emoji: "📰", arText: "خَبَر", trText: "Haber." } }, // خَبَر
        41: { base: { emoji: "📺", arText: "أَخْبَار", trText: "Haberler." } }, // أَخْبَار
        55: { base: { emoji: "🫣", arText: "إِخْبَار", trText: "Haber vermek / Bildirmek." } }, // إِخْبَار
        56: { base: { emoji: "🕵️‍♀️", arText: "مُخْبِر", trText: "Haber veren / Muhbir." } }, // مُخْبِر
        67: { base: { emoji: "📞", arText: "مُخَابَرَة", trText: "Haberleşme / İletişim." }, suggestsPlus: true, "ات": { emoji: "📡", arText: "مُخَابَرَات", trText: "Muhaberat / Haberleşme ve iletişim ağları." } }, // مُخَابَرَة + ات = مُخَابَرَات
        69: { base: { emoji: "🎤", arText: "مُخَابِر", trText: "Muhabir." } }, // مُخَابِر
        103: { suggestsPlus: true, "ات": { emoji: "🕵️", arText: "اِسْتِخْبَارَاتُ الدَّوْلَةِ قَوِيَّةٌ", trText: "Devletin istihbaratı (haber alma teşkilatı) güçlüdür." } } // اِسْتِخْبَار + ات = اِسْتِخْبَارَات
    },

    // 4. F-T-H (ف ت ح) KÖKÜ - Açmak / Fethetmek
    "فتح": {
        19: { base: { emoji: "🗝️", arText: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", trText: "Allah'ın yardımı ve fetih (zafer) geldiğinde... (Nasr Suresi)" } }, // فَتْح
        33: { base: { emoji: "🏇", arText: "فَاتِح", trText: "Fetheden / Fatih." } }, // فَاتِح
        34: { base: { emoji: "🔑", arText: "فَتَّاح", trText: "Fettah" } }, // فَتَّاح
        36: { base: { emoji: "🔓", arText: "مَفْتُوح", trText: "Açık." } }, // مَفْتُوح
        40: { base: { emoji: "🔑", arText: "مِفْتَاح", trText: "Anahtar." } } // مِفْتَاح
    },

    // 5. N-Z-M (ن ظ م) KÖKÜ - Düzenlemek / Sıraya Koymak
    "نظم": {
        19: { base: { emoji: "📜", arText: "نَظْم", trText: "Düzen / Nazım." } }, // نَظْم
        23: { base: { emoji: "⚙️", arText: "النِّظَامُ أَسَاسُ النَّجَاحِ", trText: "Nizam (düzen), başarının temelidir." } }, // نِظَام
        33: { base: { emoji: "✍️", arText: "نَاظِم", trText: "Düzenleyen." } }, // نَاظِم
        36: { 
            base: { emoji: "🎼", arText: "مَنْظُوم", trText: "Dizilmiş / Manzum." }, 
            suggestsPlus: true, 
            "ة": { emoji: "📜", arText: "مَنْظُومَةٌ شِعْرِيَّةٌ", trText: "Şiir dizeleri / Manzume." } 
        }, // مَنْظُوم + ة = مَنْظُومَة
        61: { 
            base: { emoji: "📋", arText: "تَنْظِيمُ الْوَقْتِ مُهِمٌّ", trText: "Zamanın tanzimi (düzenlenmesi) önemlidir." }, 
            suggestsPlus: true, 
            "ات": { emoji: "📜", arText: "فَتْرَةُ التَّنْظِيمَاتِ فِي الدَّوْلَةِ الْعُثْمَانِيَّةِ", trText: "Osmanlı Devleti'nde Tanzimat Dönemi (Düzenlemeler)." } 
        }, // تَنْظِيم + ات = تَنْظِيمَات
        80: { base: { emoji: "📏", arText: "اِنْتِظَام", trText: "Düzenlilik / İntizam." } }, // اِنْتِظَام
        82: { suggestsPlus: true, "ا": { emoji: "🔄", arText: "يَعْمَلُ بِشَكْلٍ مُنْتَظَمٍ", trText: "Muntazaman (düzenli bir şekilde) çalışıyor." } } // مُنْتَظَم + ا = مُنْتَظَمًا
    },

    // 6. Sh-H-D (ش ه د) KÖKÜ - Şahit Olmak / Görmek / Şehadet
    "شهد": {
        22: { suggestsPlus: true, "ة": { emoji: "📜", arText: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ", trText: "Kelime-i Şehadet, İslam'ın ilk şartıdır." } }, // شَهَاد + ة = شَهَادَة
        33: { base: { emoji: "👁️", arText: "الْقَاضِي يَسْتَمِعُ إِلَى الشَّاهِدِ فِي الْمَحْكَمَةِ", trText: "Hâkim, mahkemede şahidi dinler." } }, // شَاهِد
        35: { base: { emoji: "🌹", arText: "وَلَا تَحْسَبَنَّ الَّذِينَ قُتِلُوا فِي سَبِيلِ اللَّهِ أَمْوَاتًا", trText: "Allah yolunda öldürülenleri sakın ölüler sanma. (Âl-i İmrân Suresi)" } }, // شَهِيد
        46: { base: { emoji: "🇹🇷", arText: "شُهَدَاءُ الْوَطَنِ لَا يَمُوتُونَ أَبَدًا", trText: "Vatan şehitleri (şüheda) asla ölmez." } }, // شُهَدَاء
        67: { base: { emoji: "📺", arText: "مُشَاهَدَةُ الْفِيدْيُوهَاتِ التَّعْلِيمِيَّةِ مُفِيدَةٌ", trText: "Eğitici videoların izlenmesi (müşahede edilmesi) faydalıdır." } } // مُشَاهَدَة
    },

    // 7. Kh-L-Q (خ ل ق) KÖKÜ - Yaratmak
    "خلق": {
        19: { base: { emoji: "🌍", arText: "مِنْ شَرِّ مَا خَلَقَ", trText: "Yarattığı şeylerin şerrinden... (Felak Suresi)" } }, // خَلْق
        33: { base: { emoji: "🌌", arText: "خَالِق", trText: "Yaratan / Halık." } }, // خَالِق
        41: { base: { emoji: "💎", arText: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الأَخْلَاقِ", trText: "Ben ancak güzel ahlakı tamamlamak için gönderildim. (Hadis-i Şerif)" } } // أَخْلَاق
    },

    // 8. S-J-D (س ج د) KÖKÜ - Secde Etmek
    "سجد": {
        19: { suggestsPlus: true, "ة": { emoji: "🧎", arText: "سَجْدَةُ الشُّكْرِ تَدُلُّ عَلَى الِامْتِنَانِ", trText: "Şükür secdesi, minnettarlığı (şükranı) gösterir." } }, // سَجْد + ة = سَجْدَة
        25: { base: { emoji: "🤲", arText: "أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ", trText: "Kulun Rabbine en yakın olduğu an secde (sücud) anıdır; orada duayı çok yapın. (Hadis-i Şerif)" } }, // سُجُود
        33: { base: { emoji: "🙇", arText: "سَاجِد", trText: "Secde eden." } }, // سَاجِد
        37: { base: { emoji: "🕌", arText: "أَحَبُّ الْبِلَادِ إِلَى اللَّهِ مَسَاجِدُهَا", trText: "Allah'a beldelerin en sevimlisi mescitleridir (camileridir). (Hadis-i Şerif)" } } // مَسْجِد
    },

    // 9. S-D-Q (ص د ق) KÖKÜ - Doğru Olmak
    "صدق": {
        17: { suggestsPlus: true, "ة": { emoji: "🪙", arText: "صَدَقَة", trText: "Sadaka." } }, // صَدَق + ة = صَدَقَة
        33: { base: { emoji: "👯", arText: "صَادِق", trText: "Doğru söyleyen / Sadık." } }, // صَادِق
        35: { base: { emoji: "🤝", arText: "الصَّدِيقُ وَقْتَ الضِّيقِ", trText: "Gerçek dost (sadık arkadaş), sıkıntı vaktinde belli olur. (Atasözü)" } }, // صَدِيق
        61: { base: { emoji: "✔️", arText: "تَصْدِيق", trText: "Onaylamak / Tasdik etmek." } } // تَصْدِيق
    },

    // 10. H-S-D (ح س د) KÖKÜ - Kıskanmak
    "حسد": {
        1: { base: { emoji: "🧿", arText: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ", trText: "Haset ettiği zaman hasetçinin şerrinden (Allah'a sığınırım). (Felak Suresi)" } }, // حَسَدَ
        33: { base: { emoji: "😒", arText: "حَاسِد", trText: "Kıskanan / Hasetçi." } } // حَاسِد
    },

    // 11. D-Kh-L (د خ ل) KÖKÜ - Girmek / Dahil Olmak
    "دخل": {
        25: { base: { emoji: "🚪", arText: "مَمْنُوعُ الدُّخُولِ", trText: "Giriş yasaktır." } }, // دُخُول
        33: { base: { emoji: "📦", arText: "دَاخِل", trText: "İç / Dahil." }, suggestsPlus: true, "يَّة": { emoji: "🏛️", arText: "وِزَارَةُ الدَّاخِلِيَّةِ", trText: "İçişleri Bakanlığı." } }, // دَاخِل + يَّة = دَاخِلِيَّة
        38: { base: { emoji: "🏢", arText: "مَدْخَل", trText: "Giriş yeri." } }, // مَدْخَل
        55: { base: { emoji: "📥", arText: "إِدْخَال", trText: "Girdi / İçeri sokmak." }, suggestsPlus: true, "ات": { emoji: "📊", arText: "إِدْخَالَات", trText: "Girdiler." } }, // إِدْخَال + ات = إِدْخَالَات
        67: { base: { emoji: "🛑", arText: "الْمُدَاخَلَةُ السَّرِيعَةُ تَمْنَعُ الْمُشْكِلَةَ", trText: "Hızlı müdahale (müdahale) sorunun büyümesini engeller." } } // مُدَاخَلَة
    },

    // 12. R-K-B (ر ك ب) KÖKÜ - Binmek
    "ركب": {
        25: { base: { emoji: "🏇", arText: "رُكُوب", trText: "Binmek." } }, // رُكُوب
        33: { base: { emoji: "💺", arText: "رَاكِب", trText: "Yolcu / Binen." } }, // رَاكِب
        38: { base: { emoji: "⛴️", arText: "مَرْكَب", trText: "Gemi / Binek." } } // مَرْكَب
    },

    // 13. N-Q-L (ن ق ل) KÖKÜ - Taşımak / Nakletmek / Aktarmak
    "نقل": {
        19: { base: { emoji: "🚚", arText: "نَقْل", trText: "Taşıma / Nakil." }, suggestsPlus: true, "ا": { emoji: "📺", arText: "بُثَّتِ الْمُبَارَاةُ نَقْلًا مُبَاشِرًا", trText: "Maç canlı olarak (naklen) yayınlandı." }, "يَّة": { emoji: "📦", arText: "نَقْلِيَّة", trText: "Nakliye." }, "يَّات": { emoji: "🚛", arText: "شَرِكَةُ النَّقْلِيَّاتِ تَشْحَنُ الْبَضَائِعَ", trText: "Nakliyat şirketi malları taşır." } }, // نَقْل (Çeşitli ekler)
        33: { base: { emoji: "📡", arText: "نَاقِل", trText: "Taşıyan / Aktaran." } }, // نَاقِل
        35: { base: { emoji: "🧳", arText: "نَقِيل", trText: "Taşınan." } }, // نَقِيل
        36: { base: { emoji: "🚗", arText: "الأَمْوَالُ غَيْرُ الْمَنْقُولَةِ هِيَ الْعَقَارَاتُ", trText: "Gayrimenkul (taşınmaz) mallar ev ve arsalardır." } }, // مَنْقُول
        80: { base: { emoji: "🔄", arText: "اِنْتِقَال", trText: "Geçiş / Transfer." } } // اِنْتِقَال
    },

    // 14. Sh-R-B (ش ر ب) KÖKÜ - İçmek
    "شرب": {
        19: { suggestsPlus: true, "ة": { emoji: "🍵", arText: "شَرْبَة", trText: "Bir içimlik / Şerbet." } }, // شَرْب + ة = شَرْبَة
        22: { base: { emoji: "🍹", arText: "يَخْرُجُ مِنْ بُطُونِهَا شَرَابٌ مُخْتَلِفٌ أَلْوَانُهُ", trText: "Onların karınlarından renkleri çeşitli bir içecek (şerbet) çıkar. (Nahl Suresi)" } }, // شَرَاب
        25: { base: { emoji: "🥛", arText: "شُرُوب", trText: "İçmek." } }, // شُرُوب
        36: { suggestsPlus: true, "ات": { emoji: "🥤", arText: "الْمَشْرُوبَاتُ الْبَارِدَةُ لَذِيذَةٌ فِي الصَّيْفِ", trText: "Soğuk meşrubatlar (içecekler) yazın lezzetlidir." } }, // مَشْرُوب + ات = مَشْرُوبَات
        38: { base: { emoji: "⛲", arText: "قَدْ عَلِمَ كُلُّ أُنَاسٍ مَّشْرَبَهُمْ", trText: "Her topluluk kendi içeceği yeri (meşrebini) bildi. (Bakara Suresi)" } } // مَشْرَب
    },

    // 15. DİĞER ORTAK KELİMELER (Ayrı Kökler)
    "عقل": { 19: { base: { emoji: "🧠", arText: "العَقْلُ السَّلِيمُ فِي الجِسْمِ السَّلِيمِ", trText: "Sağlam akıl (kafa), sağlam vücutta bulunur. (Atasözü)" } } },
    "وقت": { 19: { base: { emoji: "⏱️", arText: "الوَقْتُ كَالسَّيْفِ إِنْ لَمْ تَقْطَعْهُ قَطَعَكَ", trText: "Vakit kılıç gibidir, sen onu kesmezsen o seni keser. (Atasözü)" } } },
    "سفر": { 69: { base: { emoji: "🧳", arText: "الضَّيْفُ (المُسَافِرُ) يَأْتِي بِرِزْقِهِ", trText: "Misafir rızkıyla gelir. (Atasözü)" } } },
    "وزن": { 
        19: { base: { emoji: "🏋️", arText: "وَزْن", trText: "Ağırlık." } }, 
        40: { base: { emoji: "⚖️", arText: "مِيزَان", trText: "Terazi / Mizan." } } // مِوْزَان -> مِيزَان (RefId sistemi sayesinde düzensizler bile sorunsuz çalışır)
    },
    "قلم": { 
        17: { base: { emoji: "✒️", arText: "قَلَم", trText: "Kalem." } },
        41: { base: { emoji: "🖍️", arText: "أَقْلَام", trText: "Kalemler." } }
    },

    // 16. 'A-S-M (ع ص م) KÖKÜ - Korumak / Günahsızlık
    "عصم": {
        20: { suggestsPlus: true, "ة": { emoji: "🕊️", arText: "عِصْمَةُ الْأَنْبِيَاءِ", trText: "Peygamberlerin günahsızlığı (İsmet sıfatı)." } }, // عِصْم + ة = عِصْمَة
        33: { base: { emoji: "🛡️", arText: "لَا عَاصِمَ الْيَوْمَ مِنْ أَمْرِ اللَّهِ", trText: "Bugün Allah'ın emrinden koruyacak hiçbir güç yoktur. (Hud Suresi)" } }, // عَاصِم
        36: { base: { emoji: "👼", arText: "الأَطْفَالُ مَعْصُومُونَ", trText: "Çocuklar masumdur (günahsızdır)." } } // مَعْصُوم
    },

    // 17. Q-R-B (ق ر ب) KÖKÜ - Yakın Olmak (Akraba / Kurban)
    "قرب": {
        27: { base: { emoji: "🐑", arText: "إِنَّمَا يَتَقَبَّلُ اللَّهُ مِنَ الْمُتَّقِينَ", trText: "Allah ancak takva sahiplerinden (kurbanı) kabul eder. (Maide Suresi)" } }, // قُرْبَان
        35: { base: { emoji: "🫂", arText: "قَرِيب", trText: "Yakın." } }, // قَرِيب
        46: { base: { emoji: "👨‍👩‍👧‍👦", arText: "زِيَارَةُ الأَقْرَبَاءِ وَاجِبَةٌ", trText: "Akrabaları ziyaret etmek (Sıla-i Rahim) bir görevdir." } }, // قُرَبَاء (Akraba)
        63: { base: { emoji: "⭐", arText: "مُقَرَّب", trText: "Yakınlaştırılmış." } }, // مُقَرَّب
        91: { base: { emoji: "🚶‍♂️", arText: "تَقَرُّب", trText: "Yakınlaşma." } } // تَقَرُّب
    },

    // 18. T-B-Q (ط ب ق) KÖKÜ - Uymak / Katman / Tatbik Etmek
    "طبق": {
        17: { base: { emoji: "🍽️", arText: "طَبَق", trText: "Tabak." }, suggestsPlus: true, "ة": { emoji: "🥞", arText: "طَبَقَةُ الأُوزُون", trText: "Ozon tabakası." } }, // طَبَق + ة = طَبَقَة
        61: { base: { emoji: "📱", arText: "تَطْبِيقُ الْقَوَاعِدِ مُهِمٌّ", trText: "Kuralların uygulanması (tatbik edilmesi) önemlidir." }, suggestsPlus: true, "ات": { emoji: "📲", arText: "تَطْبِيقَاتُ الْهَاتِفِ", trText: "Telefon uygulamaları (tatbikatları)." } }, // تَطْبِيق + ات = تَطْبِيقَات
        67: { suggestsPlus: true, "ات": { emoji: "✅", arText: "مُطَابَقَةُ الْحِسَابَاتِ", trText: "Hesap mutabakatı (uyuşması)." } }, // مُطَابَقَة -> مُطَابَقَات
        69: { base: { emoji: "🤝", arText: "نَحْنُ مُتَطَابِقُونَ فِي الرَّأْيِ", trText: "Biz bu görüşte mutabıkız (aynı fikirdeyiz)." } } // مُطَابِق
    },

    // 19. H-K-M (ح ك م) KÖKÜ - Hükmetmek / Yargılamak / Bilgelik
    "حكم": {
        17: { base: { emoji: "🏁", arText: "فَابْعَثُوا حَكَمًا مِّنْ أَهْلِهِ وَحَكَمًا مِّنْ أَهْلِهَا", trText: "Erkeğin ailesinden bir hakem ve kadının ailesinden bir hakem gönderin. (Nisa Suresi)" } }, // حَكَم
        21: { base: { emoji: "📜", arText: "إِنِ الْحُكْمُ إِلَّا لِلَّهِ", trText: "Hüküm ancak Allah'ındır. (Yusuf Suresi)" } }, // حُكْم
        25: { suggestsPlus: true, "ة": { emoji: "🏛️", arText: "حُكُومَة", trText: "Hükümet." } }, // حُكُوم + ة = حُكُومَة
        33: { base: { emoji: "🧑‍⚖️", arText: "حَاكِم", trText: "Hakim / Yönetici." } }, // حَاكِم
        35: { base: { emoji: "🦉", arText: "يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ", trText: "Allah hikmeti dilediğine verir. (Bakara Suresi)" } }, // حَكِيم
        36: { base: { emoji: "⛓️", arText: "مَحْكُوم", trText: "Mahkum." } }, // مَحْكُوم
        38: { suggestsPlus: true, "ة": { emoji: "⚖️", arText: "مَحْكَمَة", trText: "Mahkeme." } } // مَحْكَم + ة = مَحْكَمَة
    },

    // 20. '-R-F (ع ر ف) KÖKÜ - Bilmek / Tanımak
    "عرف": {
        17: { suggestsPlus: true, "ة": { emoji: "⛰️", arText: "عَرَفَة", trText: "Arafat tepesi." } }, // عَرَف + ة = عَرَفَة
        21: { base: { emoji: "🤝", arText: "عُرْف", trText: "Gelenek / Örf." } }, // عُرْف
        29: { base: { emoji: "🌟", arText: "عِرْفَان", trText: "İrfan / Bilgi." } }, // عِرْفَان
        33: { base: { emoji: "🧠", arText: "العَارِفُ تَكْفِيهِ الإِشَارَةُ", trText: "Ârife tarif gerekmez." } }, // عَارِف
        36: { base: { emoji: "👍", arText: "وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنْكَرِ", trText: "İyiliği emret, kötülükten sakındır. (Lokman Suresi)" } }, // مَعْرُوف
        37: { suggestsPlus: true, "ة": { emoji: "💡", arText: "مَعْرِفَة", trText: "Bilgi / Marifet." } }, // مَعْرِف + ة = مَعْرِفَة
        61: { base: { emoji: "📋", arText: "تَعْرِيف", trText: "Tanımlama / Tarif." } } // تَعْرِيف
    },

    // 21. '-L-M (ع ل م) KÖKÜ - Bilmek / Öğrenmek
    "علم": {
        20: { base: { emoji: "📖", arText: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ", trText: "İlim öğrenmek her Müslüman'a farzdır." } },
        33: { base: { emoji: "🎓", arText: "إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ", trText: "Kulları içinden ancak âlimler, Allah'tan korkar." }, suggestsPlus: true, "ة": { emoji: "🧕", arText: "عَالِمَةٌ جَلِيلَةٌ", trText: "Büyük bir kadın âlim." }, "ونَ": { emoji: "👨‍🎓", arText: "عَالِمُونَ", trText: "Âlimler (Düzenli Çoğul)." } },
        34: { suggestsPlus: true, "ة": { emoji: "🧠", arText: "عَلَّامَةُ الْعَصْرِ", trText: "Asrın büyük âlimi (Allâme)." } },
        36: { base: { emoji: "💡", arText: "كُلُّ شَيْءٍ مَعْلُومٌ عِنْدَ اللَّهِ", trText: "Her şey Allah katında malumdur (bilinmektedir)." }, suggestsPlus: true, "ات": { emoji: "ℹ️", arText: "مَعْلُومَاتٌ مُهِمَّةٌ", trText: "Önemli bilgiler." } },
        43: { base: { emoji: "🔬", arText: "الْعُلُومُ النَّافِعَةُ تَبْنِي الْحَضَارَاتِ", trText: "Faydalı ilimler (bilimler) medeniyetleri inşa eder." } },
        46: { base: { emoji: "👥", arText: "الْعُلَمَاءُ وَرَثَةُ الْأَنْبِيَاءِ", trText: "Âlimler peygamberlerin varisleridir." } },
        58: { base: { emoji: "🕋", arText: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", trText: "Sizin en hayırlınız Kur'an'ı öğrenen ve öğreteninizdir." } },
        61: { base: { emoji: "🏫", arText: "تَعْلِيمُ اللُّغَةِ الْعَرَبِيَّةِ", trText: "Arapça eğitimi." } },
        62: { base: { emoji: "👨‍🏫", arText: "كادَ المُعَلِّمُ أَن يَكونَ رَسولاً", trText: "Öğretmen neredeyse bir elçi olacaktı." }, suggestsPlus: true, "ة": { emoji: "👩‍🏫", arText: "مُعَلِّمَةٌ مُخْلِصَةٌ", trText: "İhlaslı bir kadın öğretmen." } },
        88: { base: { emoji: "✍️", arText: "تَعَلَّمُوا الْعَرَبِيَّةَ فَإِنَّهَا مِنْ دِينِكُمْ", trText: "Arapçayı öğrenin, çünkü o dininizdendir. (Hz. Ömer)" } }
    },

    // 22. R-H-M (ر ح م) KÖKÜ - Merhamet Etmek / Acımak
    "رحم": {
        19: { suggestsPlus: true, "ة": { emoji: "🌧️", arText: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِلْعَالَمِينَ", trText: "Biz seni ancak âlemlere rahmet olarak gönderdik. (Enbiya Suresi)" } }, // رَحْم + ة = رَحْمَة
        35: { base: { emoji: "🤍", arText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", trText: "Rahman ve Rahim olan Allah'ın adıyla." } }, // رَحِيم
        36: { base: { emoji: "🤲", arText: "رَحِمَهُ اللَّهُ رَحْمَةً وَاسِعَةً", trText: "Allah ona geniş bir rahmetle merhamet etsin (Merhum / Vefat etmiş kişi)." } }, // مَرْحُوم
        38: { suggestsPlus: true, "ة": { emoji: "🤝", arText: "وَتَوَاصَوْا بِالصَّبْرِ وَتَوَاصَوْا بِالْمَرْحَمَةِ", trText: "Birbirlerine sabrı ve merhameti tavsiye edenler... (Beled Suresi)" } }, // مَرْحَم + ة = مَرْحَمَة
        103: { base: { emoji: "🙏", arText: "أَقَدِّمُ إِلَيْكُمْ رِسَالَةَ اسْتِرْحَامٍ", trText: "Size bir istirham (merhamet/rica) dilekçesi sunuyorum." } } // اِسْتِرْحَام
    },

    // 23. Kh-L-F (خ ل ف) KÖKÜ - Arkada kalmak / Halef olmak / İhtilaf etmek
    "خلف": {
        17: { base: { emoji: "👣", arText: "خَلَف", trText: "Gelen / Halef." } }, // خَلَف
        23: { suggestsPlus: true, "ة": { emoji: "🕌", arText: "خِلَافَة", trText: "Hilafet." } }, // خِلَاف + ة = خِلَافَة
        35: { suggestsPlus: true, "ة": { emoji: "👑", arText: "إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً", trText: "Muhakkak ben yeryüzünde bir halife var edeceğim. (Bakara Suresi)" } }, // خَلِيف + ة = خَلِيفَة
        46: { base: { emoji: "👥", arText: "الْخُلَفَاءُ الرَّاشِدُونَ", trText: "Hulefa-i Raşidin (Dört Halife)." } }, // خُلَفَاء
        67: { base: { emoji: "🚫", arText: "يَجِبُ تَجَنُّبُ الْمُخَالَفَةِ", trText: "Muhalefetten (kurallara aykırı davranmaktan) kaçınmak gerekir." } }, // مُخَالَفَة
        69: { base: { emoji: "🙅‍♂️", arText: "مُخَالِف", trText: "Muhalif / Karşı çıkan." } }, // مُخَالِف
        80: { base: { emoji: "↔️", arText: "اِخْتِلَافُ الرَّأْيِ لَا يُفْسِدُ لِلْوُدِّ قَضِيَّةً", trText: "Görüş ayrılığı (ihtilaf), dostluğu bozmaz. (Arap Atasözü)" } }, // اِخْتِلَاف
        81: { base: { emoji: "🌈", arText: "مُخْتَلِف", trText: "Farklı / Muhtelif." } } // مُخْتَلِف
    },

    // 24. Kh-R-J (خ ر ج) KÖKÜ - Çıkmak / Çıkarmak
    "خرج": {
        22: { base: { emoji: "💰", arText: "خَرَاج", trText: "Vergi / Haraç." } }, // خَرَاج
        33: { base: { emoji: "🏞️", arText: "خَارِج", trText: "Dış / Hariç." } }, // خَارِج
        38: { base: { emoji: "🚪", arText: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", trText: "Kim Allah'a karşı gelmekten sakınırsa, Allah ona bir çıkış yolu (mahreç) açar. (Talak Suresi)" } }, // مَخْرَج
        55: { base: { emoji: "📤", arText: "إِخْرَاجُ الزَّكَاةِ", trText: "Zekatın çıkarılması (verilmesi)." }, suggestsPlus: true, "ات": { emoji: "🚢", arText: "زَادَتْ إِخْرَاجَاتُ الدَّوْلَةِ", trText: "Devletin ihracatı (dışa satımı) arttı." } } // إِخْرَاج + ات = إِخْرَاجَات
    },

    // 25. '-M-L (ع م ل) KÖKÜ - Çalışmak / Yapmak / İşlem
    "عمل": {
        17: { base: { emoji: "💼", arText: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", trText: "Ameller (işler) niyetlere göredir. (Hadis-i Şerif)" }, suggestsPlus: true, "يَّات": { emoji: "🏥", arText: "غُرْفَةُ الْعَمَلِيَّاتِ فِي الْمُسْتَشْفَى", trText: "Hastanede ameliyathane (operasyon odası)." } }, // عَمَل + يَّات = عَمَلِيَّات
        36: { base: { emoji: "📦", arText: "مَعْمُول", trText: "Yapılmış / Mamul." } }, // مَعْمُول
        47: { base: { emoji: "👷", arText: "عَمَلَة", trText: "İşçiler (Cemi Teksir)." } }, // عَمَلَة
        55: { base: { emoji: "🏭", arText: "إِعْمَال", trText: "İşletme." } }, // إِعْمَال
        67: { base: { emoji: "🤝", arText: "الدِّينُ الْمُعَامَلَةُ", trText: "Din, güzel muameledir (insan ilişkileridir). (Hadis-i Şerif)" }, suggestsPlus: true, "ات": { emoji: "🗂️", arText: "مُعَامَلَات", trText: "İşlemler / Muameleler." } }, // مُعَامَلَة + ات = مُعَامَلَات
        103: { base: { emoji: "🔄", arText: "دَلِيلُ الِاسْتِعْمَالِ", trText: "Kullanım kılavuzu (İstimal rehberi)." } } // اِسْتِعْمَال
    },

    // 26. D-R-S (د ر س) KÖKÜ - Ders / Okumak / Öğrenmek
    "درس": {
        19: { base: { emoji: "📓", arText: "دَرْس", trText: "Ders." } }, // دَرْس
        23: { suggestsPlus: true, "ة": { emoji: "📚", arText: "دِرَاسَة", trText: "Öğrenim." } }, // دِرَاس + ة = دِرَاسَة
        38: { suggestsPlus: true, "ة": { emoji: "🏫", arText: "الْمَدْرَسَةُ بَيْتُنَا الثَّانِي", trText: "Okul bizim (öğrencilerin) ikinci evidir." } }, // مَدْرَس + ة = مَدْرَسَة
        61: { base: { emoji: "✍️", arText: "تَدْرِيس", trText: "Öğretmek / Tedrisat." } }, // تَدْرِيس
        62: { base: { emoji: "👨‍🏫", arText: "مَنْ عَلَّمَنِي حَرْفاً صِرْتُ لَهُ عَبْداً", trText: "Bana bir harf öğretenin kölesi olurum. (Hz. Ali)" } } // مُدَرِّس
    },

    // 27. H-F-Z (ح ف ظ) KÖKÜ - Korumak / Ezberlemek
    "حفظ": {
        20: { base: { emoji: "💾", arText: "حِفْظ", trText: "Koruma / Hıfz." } }, // حِفْظ
        33: { base: { emoji: "📖", arText: "فَاللَّهُ خَيْرٌ حَافِظًا", trText: "Allah en hayırlı koruyucudur. (Yusuf Suresi)" }, suggestsPlus: true, "ة": { emoji: "🧠", arText: "حَافِظَةٌ قَوِيَّةٌ", trText: "Güçlü bir hafıza." } }, // حَافِظ + ة = حَافِظَة
        36: { base: { emoji: "🛡️", arText: "فِي لَوْحٍ مَحْفُوظٍ", trText: "Korunmuş bir levhadadır (Levh-i Mahfuz). (Büruc Suresi)" } }, // مَحْفُوظ
        67: { base: { emoji: "🏰", arText: "حَافِظُوا عَلَى الصَّلَوَاتِ", trText: "Namazları koruyun (özen gösterin). (Bakara Suresi)" } }, // مُحَافَظَة
        69: { base: { emoji: "👔", arText: "مُحَافِظ", trText: "Koruyan / Vali (Muhafız)." } } // مُحَافِظ
    },

    // 28. N-Z-R (ن ظ ر) KÖKÜ - Bakmak / Görmek / Beklemek
    "نظر": {
        17: { base: { emoji: "👁️", arText: "الْعَيْنُ حَقٌّ", trText: "Nazar (göz değmesi) haktır (gerçektir). (Hadis-i Şerif)" } }, // نَظَر
        33: { base: { emoji: "👀", arText: "نَاظِر", trText: "Bakan / Nazır." } }, // نَاظِر
        38: { suggestsPlus: true, "ة": { emoji: "🌄", arText: "يَا لَهُ مِنْ مَنْظَرٍ جَمِيلٍ!", trText: "Ne kadar güzel bir manzara!" } }, // مَنْظَر + ة = مَنْظَرَة
        67: { base: { emoji: "🗣️", arText: "مُنَاظَرَة", trText: "Münazara (Karşılıklı bakışma/tartışma)." } }, // مُنَاظَرَة
        80: { base: { emoji: "⏳", arText: "اِنْتِظَارُ الْفَرَجِ عِبَادَةٌ", trText: "Sıkıntıdan kurtulmayı beklemek (intizar) ibadettir. (Hadis-i Şerif)" } } // اِنْتِظَار
    },

    // 29. M-K-N (م ك ن) KÖKÜ - Mümkün Olmak / Yer / Güç
    "مكن": {
        22: { base: { emoji: "📍", arText: "شَرَفُ الْمَكَانِ بِالْمَكِينِ", trText: "Bir mekânın şerefi (değeri), orada bulunanlardan gelir. (Atasözü)" } }, // مَكَان
        55: { base: { emoji: "✨", arText: "فِي حُدُودِ الْإِمْكَانِ", trText: "İmkânlar dâhilinde." } }, // إِمْكَان
        56: { base: { emoji: "✔️", arText: "كُلُّ شَيْءٍ مُمْكِنٌ بِإِذْنِ اللَّهِ", trText: "Allah'ın izniyle her şey mümkündür." } }, // مُمْكِن
        61: { base: { emoji: "💪", arText: "تَمْكِين", trText: "Güçlendirmek." } } // تَمْكِين
    },

    // 30. H-S-N (ح س ن) KÖKÜ - Güzellik / İyilik / İhsan
    "حسن": {
        17: { base: { emoji: "🌸", arText: "الْحَسَنُ وَالْحُسَيْنُ سَيِّدَا شَبَابِ أَهْلِ الْجَنَّةِ", trText: "Hasan ve Hüseyin, cennet gençlerinin efendileridir. (Hadis-i Şerif)" } }, // حَسَن
        49: { base: { emoji: "🌷", arText: "حُسَيْن", trText: "Hüseyin (Küçük güzellik)." } }, // حُسَيْن
        50: { base: { emoji: "🥇", arText: "لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ", trText: "Biz insanı en güzel biçimde (ahsen-i takvim) yarattık. (Tîn Suresi)" } }, // أَحْسَن
        51: { base: { emoji: "💎", arText: "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا", trText: "En güzel isimler (Esma-ül Hüsna) Allah'ındır, O'na onlarla dua edin. (A'râf Suresi)" } }, // حُسْنَى
        55: { base: { emoji: "💖", arText: "هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ", trText: "İyiliğin (ihsanın) karşılığı, iyilikten başka bir şey midir? (Rahmân Suresi)" } }, // إِحْسَان
        56: { base: { emoji: "😇", arText: "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", trText: "Şüphesiz Allah, iyilik edenleri (muhsinleri) sever. (Bakara Suresi)" } }, // مُحْسِن
        61: { base: { emoji: "📈", arText: "تَحْسِين", trText: "İyileştirmek (Tahsin)." } } // تَحْسِين
    },

    // 31. S-'-D (س ع د) KÖKÜ - Mutluluk / Saadet
    "سعد": {
        22: { suggestsPlus: true, "ة": { emoji: "✨", arText: "السَّعَادَةُ فِي الْقَنَاعَةِ", trText: "Mutluluk (saadet) kanaattedir. (Atasözü)" } }, // سَعَاد + ة = سَعَادَة
        24: { base: { emoji: "🌸", arText: "سُعَاد", trText: "Suad (Mutluluk)." } }, // سُعَاد
        35: { base: { emoji: "😊", arText: "فَمِنْهُمْ شَقِيٌّ وَسَعِيدٌ", trText: "Onlardan kimi bedbaht (mutsuz), kimi de bahtiyar (mutlu - said)dır. (Hûd Suresi)" }, suggestsPlus: true, "ة": { emoji: "🥰", arText: "سَعِيدَة", trText: "Mutlu (Kadın)." } }, // سَعِيد + ة = سَعِيدَة
        36: { base: { emoji: "🍀", arText: "أَيَّامٌ مَسْعُودَةٌ", trText: "Mutlu (Mesut) ve uğurlu günler." }, suggestsPlus: true, "ة": { emoji: "🌻", arText: "مَسْعُودَة", trText: "Mesude." } } // مَسْعُود + ة = مَسْعُودَة
    },

    // 32. J-H-L (ج ه ل) KÖKÜ - Bilmemek / Cehalet
    "جهل": {
        33: { base: { emoji: "🙈", arText: "النَّاسُ أَعْدَاءُ مَا جَهِلُوا", trText: "İnsanlar bilmedikleri şeyin düşmanıdır. (Hz. Ali)" }, suggestsPlus: true, "يَّة": { emoji: "🌑", arText: "جَاهِلِيَّة", trText: "Cahiliye dönemi." } }, // جَاهِل + يَّة = جَاهِلِيَّة
        36: { base: { emoji: "❓", arText: "فَاعِلٌ مَجْهُولٌ", trText: "Faili meçhul (yapanı bilinmeyen)." } }, // مَجْهُول
        46: { base: { emoji: "🙉", arText: "وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا", trText: "Cahiller onlara laf attığında 'Selam' der (geçerler). (Furkan Suresi)" } } // جُهَلَاء
    },

    // 33. W-J-D (و ج د) KÖKÜ - Bulmak / Var Olmak
    "وجد": {
        25: { base: { emoji: "🌌", arText: "وُجُود", trText: "Varlık / Vücud." } }, // وُجُود
        29: { base: { emoji: "❤️", arText: "صَوْتُ الْوِجْدَانِ", trText: "Vicdanın sesi." } }, // وِجْدَان
        36: { base: { emoji: "✅", arText: "الْبَضَاعَةُ مَوْجُودَةٌ فِي الْمَخْزَنِ", trText: "Mal depoda mevcut (bulunmaktadır)." } }, // مَوْجُود
        55: { base: { emoji: "🔍", arText: "إِيجَادُ حَلٍّ لِلْمُشْكِلَةِ", trText: "Probleme bir çözüm bulmak (icad etmek)." } }, // إِوْجَاد -> إِيجَاد
        56: { base: { emoji: "💡", arText: "مُوجِد", trText: "İcat eden / Mucit." } } // مُوجِد
    },

    // 34. S-K-N (س ك ن) KÖKÜ - Sakin olmak / İkamet etmek / Huzur
    "سكن": {
        33: { base: { emoji: "😌", arText: "سَاكِن", trText: "Sakin / Oturan." } }, // سَاكِن
        35: { suggestsPlus: true, "ة": { emoji: "✨", arText: "فَأَنْزَلَ اللَّهُ سَكِينَتَهُ عَلَيْهِ", trText: "Allah onun üzerine sekinetini (huzur ve güvenini) indirdi. (Tevbe Suresi)" } }, // سَكِين + ة = سَكِينَة
        36: { base: { emoji: "🏘️", arText: "مِنْطَقَةٌ مَسْكُونَةٌ", trText: "Meskun mahal (yerleşim yeri)." } }, // مَسْكُون
        38: { base: { emoji: "🏡", arText: "وَاللَّهُ جَعَلَ لَكُمْ مِنْ بُيُوتِكُمْ سَكَنًا", trText: "Allah, evlerinizi sizin için bir huzur ve dinlenme yeri (mesken) kıldı. (Nahl Suresi)" } }, // مَسْكَن
        55: { base: { emoji: "🏢", arText: "إِسْكَان", trText: "İskan." } }, // إِسْكَان
        61: { base: { emoji: "🕊️", arText: "تَسْكِينُ الْأَلَمِ", trText: "Ağrıyı dindirmek (Teskin etmek)." } } // تَسْكِين
    },

    // 35. J-H-D (ج ه د) KÖKÜ - Çaba Göstermek / Gayret / Mücadele
    "جهد": {
        23: { base: { emoji: "🛡️", arText: "وَجَاهِدُوا فِي اللَّهِ حَقَّ جِهَادِهِ", trText: "Allah uğrunda hakkıyla cihad edin (gayret gösterin). (Hac Suresi)" } }, // جِهَاد
        33: { base: { emoji: "💪", arText: "جَاهِد", trText: "Çaba gösteren." } }, // جَاهِد
        69: { base: { emoji: "🏇", arText: "مُجَاهِد", trText: "Mücahit." }, suggestsPlus: true, "ة": { emoji: "🧕", arText: "مُجَاهِدَة", trText: "Kadın mücahit." } }, // مُجَاهِد + ة = مُجَاهِدَة
        80: { base: { emoji: "📚", arText: "الِاجْتِهَادُ مِفْتَاحُ النَّجَاحِ", trText: "Çalışmak (içtihat/gayret), başarının anahtarıdır." } }, // اِجْتِهَاد
        81: { base: { emoji: "🤓", arText: "لِكُلِّ مُجْتَهِدٍ نَصِيبٌ", trText: "Her çalışanın (gayret edenin) bir nasibi (payı) vardır. (Atasözü)" } } // مُجْتَهِد
    },

    // 36. S-L-M (س ل م) KÖKÜ - Barış / Kurtuluş / Teslim Olmak
    "سلم": {
        22: { base: { emoji: "🕊️", arText: "أَفْشُوا السَّلَامَ بَيْنَكُمْ", trText: "Aranızda selamı yayınız. (Hadis-i Şerif)" }, suggestsPlus: true, "ة": { emoji: "🛡️", arText: "فِي التَّأَنِّي السَّلَامَةُ", trText: "Acele etmemekte (teennide) selamet vardır. (Atasözü)" } }, // سَلَام + ة = سَلَامَة
        33: { base: { emoji: "😌", arText: "سَالِم", trText: "Sağ salim / Güvende." } }, // سَالِم
        35: { base: { emoji: "🫀", arText: "إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ", trText: "Ancak Allah'a temiz (selim) bir kalple gelenler müstesna. (Şuarâ Suresi)" } }, // سَلِيم
        55: { base: { emoji: "🌙", arText: "إِنَّ الدِّينَ عِندَ اللَّهِ الْإِسْلَامُ", trText: "Şüphesiz Allah katında din İslam'dır. (Âl-i İmrân Suresi)" } }, // إِسْلَام
        56: { base: { emoji: "🤲", arText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِن لِّسَانِهِ وَيَدِهِ", trText: "Müslüman, diğer Müslümanların onun dilinden ve elinden güvende (salim) olduğu kimsedir. (Hadis-i Şerif)" } }, // مُسْلِم
        61: { base: { emoji: "📦", arText: "تَسْلِيم", trText: "Teslim." } } // تَسْلِيم
    },

    // 37. R-J-' (ر ج ع) KÖKÜ - Dönmek / Başvurmak / Gözden Geçirmek
    "رجع": {
        37: { base: { emoji: "📚", arText: "إِلَى اللَّهِ مَرْجِعُكُمْ جَمِيعًا", trText: "Hepinizin dönüşü (mercii/kaynağı) Allah'adır. (Mâide Suresi)" } }, // مَرْجِع
        67: { base: { emoji: "📝", arText: "مُرَاجَعَةُ الدُّرُوسِ قَبْلَ الِامْتِحَانِ مُفِيدَةٌ", trText: "Sınavdan önce derslerin tekrar edilmesi (gözden geçirilmesi) faydalıdır." } }, // مُرَاجَعَة
        80: { base: { emoji: "↩️", arText: "اِرْتِجَاعُ الْبَضَاعَةِ حَقٌّ لِلْمُشْتَرِي", trText: "Malın iadesi (geri verilmesi/artırım) alıcının hakkıdır." } } // اِرْتِـجَاع
    },

    // 38. Sh-K-L (ش ك ل) KÖKÜ - Biçim / Şekil / Sorun
    "شكل": {
        19: { base: { emoji: "📐", arText: "شَكْل", trText: "Şekil / Biçim." } }, // شَكْل
        41: { base: { emoji: "🎨", arText: "أَشْكَال", trText: "Şekiller." } }, // أَشْكَال
        56: { base: { emoji: "⚠️", arText: "لِكُلِّ مُشْكِلٍ حَلٌّ فِي النِّهَايَةِ", trText: "Her müşkülün (sorunun) sonunda bir çözümü vardır." } }, // مُشْكِل
        61: { base: { emoji: "🔠", arText: "تَشْكِيل", trText: "Şekillendirme." }, suggestsPlus: true, "ات": { emoji: "🏢", arText: "تَشْكِيلَاتُ الدَّوْلَةِ التَّنْظِيمِيَّةِ", trText: "Devletin kurumsal teşkilatları (yapılanmaları)." } } // تَشْكِيل + ات = تَشْكِيلَات
    },

    // 39. N-S-B (ن س ب) KÖKÜ - İlişki / Soy / Oran / Uygunluk
    "نسب": {
        17: { base: { emoji: "🌳", arText: "الْمَرْءُ بِأَدَبِهِ لَا بِأَصْلِهِ وَنَسَبِهِ", trText: "Kişinin değeri aslı ve nesebiyle (soyuyla) değil, edebiyle ölçülür. (Atasözü)" } }, // نَسَب
        20: { suggestsPlus: true, "ة": { emoji: "📊", arText: "نِسْبَةُ النَّجَاحِ عَالِيَةٌ فِي الِامْتِحَانِ", trText: "Sınavdaki başarı nispeti (oranı) oldukça yüksektir." } }, // نِسْب + ة = نِسْبَة
        36: { base: { emoji: "👤", arText: "مَنْسُوب", trText: "Mensup / İlişkili." } }, // مَنْسُوب
        67: { base: { emoji: "🎉", arText: "نَحْتَفِلُ بِهَذِهِ الْمُنَاسَبَةِ السَّعِيدَةِ", trText: "Bu mutlu münasebet (vesile/özel gün) sebebiyle kutlama yapıyoruz." } }, // مُنَاسَبَة
        80: { base: { emoji: "📝", arText: "اِنْتِسَاب", trText: "Kayıt olma / İntisap." } } // اِنْتِسَاب
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
        35: { base: { emoji: "🛡️", arText: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", trText: "Allah bize yeter, O ne güzel vekildir. (Âl-i İmrân Suresi)" } }, // وَكِيل
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
        50: { base: { emoji: "🌌", arText: "اللَّهُ أَكْبَرُ مِنْ كُلِّ شَيْءٍ", trText: "Allah her şeyden en büyüktür (ekberdir)." } }, // أَكْبَر
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