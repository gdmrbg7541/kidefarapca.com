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

function triggerAreaPulse(boxElement) {
    if (!boxElement) return;
    boxElement.classList.remove("pulse-highlight");

    const isZoomEnabled = document.getElementById('zoomToggleCheckbox').checked;

    if (!isZoomEnabled) {
        boxElement.style.setProperty("background-color", "#bfffdf", "important");
        boxElement.style.borderColor = "#000000";
        return;
    }

    const rect = boxElement.getBoundingClientRect();
    const boxCenterX = rect.left + rect.width / 2;
    const boxCenterY = rect.top + rect.height / 2;
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    const moveX = viewportCenterX - boxCenterX;
    const moveY = viewportCenterY - boxCenterY;

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
    
    if (el.hasAttribute('data-tiklama-sayisi')) {
        el.setAttribute('data-tiklama-sayisi', '0');
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

            checkWordEasterEgg(lastOriginalWord, boxElement);
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
        lastOriginalWord = kalip;
        return;
    }

    SoundEngine.playClick();
    const currentRootSafe = (typeof currentRoot !== 'undefined') ? currentRoot : "";
    targetEl.innerText = (currentRootSafe.length === 3) ? applyRootToKalip(currentRootSafe, kalip) : kalip;
    
    lastOriginalWord = targetEl.innerText.trim();
    triggerAreaPulse(boxElement); 
    checkWordEasterEgg(lastOriginalWord, boxElement);
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

    if (typeof checkWordEasterEgg === "function") {
        checkWordEasterEgg(lastOriginalWord, currentBox);
    }

    if (currentBox) {
        currentBox.style.setProperty("border-color", "#00FF00", "important");
        currentBox.style.setProperty("box-shadow", "0 0 10px #00FF00", "important");
        if (typeof triggerAreaPulse === "function") triggerAreaPulse(currentBox);
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
    "كِتَاب": { 
        emoji: "📖",
        arText: "خَيْرُ جَلِيسٍ فِي الزَّمَانِ كِتَابٌ",
        trText: "Zamanın en hayırlı dostu (arkadaşı) kitaptır."
    },
    "كِتَابَة": { emoji: "✍️" },
    "مَكْتَبَة": { emoji: "📚" },
    "كَاتِب": { emoji: "📝" },
    "مَكْتَب": { emoji: "🏢" },
    "مَكْتُوب": {
        emoji: "✉️",
        arText: "المَكْتُوبُ يُقْرَأُ مِنْ عُنْوَانِهِ",
        trText: "Mektup adresinden belli olur. (Perşembenin gelişi çarşambadan bellidir)"
    },

    // 2. Kh-B-R (خ ب ر) KÖKÜ - Haber Vermek
    "خَبَر": { emoji: "📰" },
    "مُخَابِر": { emoji: "🎤" },
    "أَخْبَار": { emoji: "📺" },
    "إِخْبَار": { emoji: "🫣" },
    "مُخْبِر": { emoji: "🕵️‍♀️" },
    "اِسْتِخْبَارَات": { 
        emoji: "🕵️",
        arText: "اِسْتِخْبَارَاتُ الدَّوْلَةِ قَوِيَّةٌ",
        trText: "Devletin istihbaratı (haber alma teşkilatı) güçlüdür."
    },

    // 3. S-B-R (ص ب ر) KÖKÜ - Sabretmek
    "صَبْر": {
        emoji: "⏳",
        arText: "وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
        trText: "Birbirlerine hakkı ve sabrı tavsiye ettiler. (Asr Suresi)"
    },
    "صَابِر": { emoji: "😌" },
    "صَبُور": { emoji: "🧘" },

    // 4. F-T-H (ف ت ح) KÖKÜ - Açmak / Fethetmek
    "فَتْح": {
        emoji: "🗝️",
        arText: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
        trText: "Allah'ın yardımı ve fetih (zafer) geldiğinde... (Nasr Suresi)"
    },
    "مِفْتَاح": { emoji: "🔑" },
    "فَاتِح": { emoji: "🏇" },
    "مَفْتُوح": { emoji: "🔓" },

    // 5. N-Z-M (ن ظ م) KÖKÜ - Düzenlemek / Sıraya Koymak
    "نَظْم": { emoji: "📜" },
    "نِظَام": {
        emoji: "⚙️",
        arText: "النِّظَامُ أَسَاسُ النَّجَاحِ",
        trText: "Nizam (düzen), başarının temelidir."
    },
    "نَاظِم": { emoji: "✍️" },
    "مَنْظُوم": { emoji: "🎼" },
    "تَنْظِيم": {
        emoji: "📋",
        arText: "تَنْظِيمُ الْوَقْتِ مُهِمٌّ",
        trText: "Zamanın tanzimi (düzenlenmesi) önemlidir."
    },
    "اِنْتِظَام": { emoji: "📏" },
    "مُنْتَظَمًا": {
        emoji: "🔄",
        arText: "يَعْمَلُ بِشَكْلٍ مُنْتَظَمٍ",
        trText: "Muntazaman (düzenli bir şekilde) çalışıyor."
    },

    // 6. Sh-H-D (ش ه د) KÖKÜ - Şahit Olmak / Görmek / Şehadet
    "شَهَادَة": {
        emoji: "📜",
        arText: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ",
        trText: "Kelime-i Şehadet, İslam'ın ilk şartıdır."
    },
    "شَاهِد": {
        emoji: "👁️",
        arText: "الْقَاضِي يَسْتَمِعُ إِلَى الشَّاهِدِ فِي الْمَحْكَمَةِ",
        trText: "Hâkim, mahkemede şahidi dinler."
    },
    "شَهِيد": {
        emoji: "🌹",
        arText: "وَلَا تَحْسَبَنَّ الَّذِينَ قُتِلُوا فِي سَبِيلِ اللَّهِ أَمْوَاتًا",
        trText: "Allah yolunda öldürülenleri sakın ölüler sanma. (Âl-i İmrân Suresi)"
    },
    "شُهَدَاء": {
        emoji: "🇹🇷",
        arText: "شُهَدَاءُ الْوَطَنِ لَا يَمُوتُونَ أَبَدًا",
        trText: "Vatan şehitleri (şüheda) asla ölmez."
    },
    "مُشَاهَدَة": {
        emoji: "📺",
        arText: "مُشَاهَدَةُ الْفِيدْيُوهَاتِ التَّعْلِيمِيَّةِ مُفِيدَةٌ",
        trText: "Eğitici videoların izlenmesi (müşahede edilmesi) faydalıdır."
    },

    // 7. Kh-L-Q (خ ل ق) KÖKÜ - Yaratmak
    "خَلْق": {
        emoji: "🌍",
        arText: "مِنْ شَرِّ مَا خَلَقَ",
        trText: "Yarattığı şeylerin şerrinden... (Felak Suresi)"
    },
    "خَالِق": { emoji: "🌌" },
    "أَخْلَاق": { 
        emoji: "💎",
        arText: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الأَخْلَاقِ",
        trText: "Ben ancak güzel ahlakı tamamlamak için gönderildim. (Hadis-i Şerif)"
    },

    // 8. S-J-D (س ج د) KÖKÜ - Secde Etmek
    "مَسْجِد": { emoji: "🕌" },
    "سَاجِد": { emoji: "🧎" },
    "سُجُود": { emoji: "🙇" },

    // 9. S-D-Q (ص د ق) KÖKÜ - Doğru Olmak
    "صَدِيق": {
        emoji: "🤝",
        arText: "الصَّدِيقُ وَقْتَ الضِّيقِ",
        trText: "Gerçek dost (sadık arkadaş), sıkıntı vaktinde belli olur. (Atasözü)"
    },
    "صَادِق": { emoji: "👯" },
    "صَدَقَة": { emoji: "🪙" },
    "تَصْدِيق": { emoji: "✔️" },

    // 10. H-S-D (ح س د) KÖKÜ - Kıskanmak
    "حَسَدَ": {
        emoji: "🧿",
        arText: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        trText: "Haset ettiği zaman hasetçinin şerrinden (Allah'a sığınırım). (Felak Suresi)"
    },
    "حَاسِد": { emoji: "😒" },

    // 11. D-Kh-L (د خ ل) KÖKÜ - Girmek / Dahil Olmak
    "دُخُول": {
        emoji: "🚪",
        arText: "مَمْنُوعُ الدُّخُولِ",
        trText: "Giriş yasaktır."
    },
    "مَدْخَل": { emoji: "🏢" },
    "دَاخِل": { emoji: "📦" },
    "دَاخِلِيَّة": {
        emoji: "🏛️",
        arText: "وِزَارَةُ الدَّاخِلِيَّةِ",
        trText: "İçişleri Bakanlığı."
    },
    "إِدْخَال": { emoji: "📥" },
    "إِدْخَالَات": { emoji: "📊" },
    "مُدَاخَلَة": {
        emoji: "🛑",
        arText: "الْمُدَاخَلَةُ السَّرِيعَةُ تَمْنَعُ الْمُشْكِلَةَ",
        trText: "Hızlı müdahale (müdahale) sorunun büyümesini engeller."
    },

    // 12. R-K-B (ر ك ب) KÖKÜ - Binmek
    "رَاكِب": { emoji: "💺" },
    "مَرْكَب": { emoji: "⛴️" },
    "رُكُوب": { emoji: "🏇" },

    // 13. N-Q-L (ن ق ل) KÖKÜ - Taşımak / Nakletmek / Aktarmak
    "نَقْل": { emoji: "🚚" },
    "نَقْلًا": {
        emoji: "📺",
        arText: "بُثَّتِ الْمُبَارَاةُ نَقْلًا مُبَاشِرًا",
        trText: "Maç canlı olarak (naklen) yayınlandı."
    },
    "نَقْلِيَّة": { emoji: "📦" },
    "نَقْلِيَّات": {
        emoji: "🚛",
        arText: "شَرِكَةُ النَّقْلِيَّاتِ تَشْحَنُ الْبَضَائِعَ",
        trText: "Nakliyat şirketi malları taşır."
    },
    "نَقِيل": { emoji: "🧳" },
    "مَنْقُول": {
        emoji: "🚗",
        arText: "الأَمْوَالُ غَيْرُ الْمَنْقُولَةِ هِيَ الْعَقَارَاتُ",
        trText: "Gayrimenkul (taşınmaz) mallar ev ve arsalardır."
    },
    "اِنْتِقَال": { emoji: "🔄" },
    "نَاقِل": { emoji: "📡" },

    // 14. Sh-R-B (ش ر ب) KÖKÜ - İçmek
    "شَرْبَة": { emoji: "🍵" },
    "شَرَاب": {
        emoji: "🍹",
        arText: "يَخْرُجُ مِنْ بُطُونِهَا شَرَابٌ مُخْتَلِفٌ أَلْوَانُهُ",
        trText: "Onların karınlarından renkleri çeşitli bir içecek (şerbet) çıkar. (Nahl Suresi)"
    },
    "شُرُوب": { emoji: "🥛" },
    "مَشْرُوبَات": {
        emoji: "🥤",
        arText: "الْمَشْرُوبَاتُ الْبَارِدَةُ لَذِيذَةٌ فِي الصَّيْفِ",
        trText: "Soğuk meşrubatlar (içecekler) yazın lezzetlidir."
    },
    "مَشْرَب": {
        emoji: "⛲",
        arText: "قَدْ عَلِمَ كُلُّ أُنَاسٍ مَّشْرَبَهُمْ",
        trText: "Her topluluk kendi içeceği yeri (meşrebini) bildi. (Bakara Suresi)"
    },

    // 15. Diğer Önemli Ortak Kelimeler
    "عَقْل": {
        emoji: "🧠",
        arText: "العَقْلُ السَّلِيمُ فِي الجِسْمِ السَّلِيمِ",
        trText: "Sağlam akıl (kafa), sağlam vücutta bulunur. (Atasözü)"
    },
    "وَقْت": {
        emoji: "⏱️",
        arText: "الوَقْتُ كَالسَّيْفِ إِنْ لَمْ تَقْطَعْهُ قَطَعَكَ",
        trText: "Vakit kılıç gibidir, sen onu kesmezsen o seni keser. (Atasözü)"
    },
    "مُسَافِر": {
        emoji: "🧳",
        arText: "الضَّيْفُ (المُسَافِرُ) يَأْتِي بِرِزْقِهِ",
        trText: "Misafir rızkıyla gelir. (Atasözü)"
    },
    "مِيزَان": { emoji: "⚖️" },
    "وَزْن": { emoji: "🏋️" },
    "قَلَم": { emoji: "✒️" },
    "أَقْلَام": { emoji: "🖍️" },

    // 16. 'A-S-M (ع ص م) KÖKÜ - Korumak / Günahsızlık
    "عَاصِم": {
        emoji: "🛡️",
        arText: "لَا عَاصِمَ الْيَوْمَ مِنْ أَمْرِ اللَّهِ",
        trText: "Bugün Allah'ın emrinden koruyacak hiçbir güç yoktur. (Hud Suresi)"
    },
    "عِصْمَة": {
        emoji: "🕊️",
        arText: "عِصْمَةُ الْأَنْبِيَاءِ",
        trText: "Peygamberlerin günahsızlığı (İsmet sıfatı)."
    },
    "مَعْصُوم": {
        emoji: "👼",
        arText: "الأَطْفَالُ مَعْصُومُونَ",
        trText: "Çocuklar masumdur (günahsızdır)."
    },

    // 17. Q-R-B (ق ر ب) KÖKÜ - Yakın Olmak (Akraba / Kurban)
    "قَرِيب": { emoji: "🫂" },
    "أَقْرَبَاء": {
        emoji: "👨‍👩‍👧‍👦",
        arText: "زِيَارَةُ الأَقْرَبَاءِ وَاجِبَةٌ",
        trText: "Akrabaları ziyaret etmek (Sıla-i Rahim) bir görevdir."
    },
    "قُرْبَان": {
        emoji: "🐑",
        arText: "إِنَّمَا يَتَقَبَّلُ اللَّهُ مِنَ الْمُتَّقِينَ",
        trText: "Allah ancak takva sahiplerinden (kurbanı) kabul eder. (Maide Suresi)"
    },
    "تَقَرُّب": { emoji: "🚶‍♂️" },
    "مُقَرَّب": { emoji: "⭐" },

    // 18. T-B-Q (ط ب ق) KÖKÜ - Uymak / Katman / Tatbik Etmek
    "طَبَق": { emoji: "🍽️" },
    "طَبَقَة": { 
        emoji: "🥞",
        arText: "طَبَقَةُ الأُوزُون",
        trText: "Ozon tabakası."
    },
    "تَطْبِيق": {
        emoji: "📱",
        arText: "تَطْبِيقُ الْقَوَاعِدِ مُهِمٌّ",
        trText: "Kuralların uygulanması (tatbik edilmesi) önemlidir."
    },
    "تَطْبِيقَات": {
        emoji: "📲",
        arText: "تَطْبِيقَاتُ الْهَاتِفِ",
        trText: "Telefon uygulamaları (tatbikatları)."
    },
    "مُطَابَقَات": {
        emoji: "✅",
        arText: "مُطَابَقَةُ الْحِسَابَاتِ",
        trText: "Hesap mutabakatı (uyuşması)."
    },
    "مُطَابِق": { 
        emoji: "🤝",
        arText: "نَحْنُ مُتَطَابِقُونَ فِي الرَّأْيِ",
        trText: "Biz bu görüşte mutabıkız (aynı fikirdeyiz)."
    },

    // 19. H-K-M (ح ك م) KÖKÜ - Hükmetmek / Yargılamak / Bilgelik
    "حَكَم": {
        emoji: "🏁",
        arText: "فَابْعَثُوا حَكَمًا مِّنْ أَهْلِهِ وَحَكَمًا مِّنْ أَهْلِهَا",
        trText: "Erkeğin ailesinden bir hakem ve kadının ailesinden bir hakem gönderin. (Nisa Suresi)"
    },
    "حُكْم": {
        emoji: "📜",
        arText: "إِنِ الْحُكْمُ إِلَّا لِلَّهِ",
        trText: "Hüküm ancak Allah'ındır. (Yusuf Suresi)"
    },
    "حُكُومَة": { emoji: "🏛️" },
    "حَاكِم": { emoji: "🧑‍⚖️" },
    "حَكِيم": {
        emoji: "🦉",
        arText: "يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ",
        trText: "Allah hikmeti dilediğine verir. (Bakara Suresi)"
    },
    "مَحْكُوم": { emoji: "⛓️" },
    "مَحْكَمَة": { emoji: "⚖️" },

    // 20. '-R-F (ع ر ف) KÖKÜ - Bilmek / Tanımak
    "عَرَفَة": { emoji: "⛰️" },
    "عُرْف": { emoji: "🤝" },
    "عِرْفَان": { emoji: "🌟" },
    "عَارِف": {
        emoji: "🧠",
        arText: "العَارِفُ تَكْفِيهِ الإِشَارَةُ",
        trText: "Ârife tarif gerekmez (Ârif olana bir işaret yeterlidir)."
    },
    "مَعْرُوف": {
        emoji: "👍",
        arText: "وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنْكَرِ",
        trText: "İyiliği emret, kötülükten sakındır. (Lokman Suresi)"
    },
    "مَعْرِفَة": { emoji: "💡" },
    "تَعْرِيف": { emoji: "📋" },

    // 21. '-L-M (ع ل م) KÖKÜ - Bilmek / Öğrenmek
    "عِلْم": {
        emoji: "📖",
        arText: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
        trText: "İlim öğrenmek her Müslüman'a farzdır. (Hadis-i Şerif)"
    },
    "عَالِم": {
        emoji: "🎓",
        arText: "إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ",
        trText: "Kulları içinden ancak âlimler, Allah'tan (gereğince) korkar. (Fatır Suresi)"
    },
    "مَعْلُومات": { emoji: "ℹ️" },
    "عُلَمَاء": {
        emoji: "🧠",
        arText: "الْعُلَمَاءُ وَرَثَةُ الْأَنْبِيَاءِ",
        trText: "Âlimler peygamberlerin varisleridir. (Hadis-i Şerif)"
    },
    "تَعْلِيم": { emoji: "🏫" },
    "مُعَلِّم": {
        emoji: "👨‍🏫",
        arText: "كادَ المُعَلِّمُ أَن يَكونَ رَسولاً",
        trText: "Öğretmen neredeyse bir elçi olacaktı."
    },

    // 22. R-H-M (ر ح م) KÖKÜ - Merhamet Etmek / Acımak
    "رَحْمَة": {
        emoji: "🌧️",
        arText: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِلْعَالَمِينَ",
        trText: "Biz seni ancak âlemlere rahmet olarak gönderdik. (Enbiya Suresi)"
    },
    "رَحِيم": {
        emoji: "🤍",
        arText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        trText: "Rahman ve Rahim olan Allah'ın adıyla."
    },
    "مَرْحَمَة": {
        emoji: "🤝",
        arText: "وَتَوَاصَوْا بِالصَّبْرِ وَتَوَاصَوْا بِالْمَرْحَمَةِ",
        trText: "Birbirlerine sabrı ve merhameti tavsiye edenler... (Beled Suresi)"
    },
    "مَرْحُوم": {
        emoji: "🤲",
        arText: "رَحِمَهُ اللَّهُ رَحْمَةً وَاسِعَةً",
        trText: "Allah ona geniş bir rahmetle merhamet etsin (Merhum / Vefat etmiş kişi)."
    },
    "اِسْتِرْحَام": {
        emoji: "🙏",
        arText: "أَقَدِّمُ إِلَيْكُمْ رِسَالَةَ اسْتِرْحَامٍ",
        trText: "Size bir istirham (merhamet/rica) dilekçesi sunuyorum."
    },

    // 23. Kh-L-F (خ ل ف) KÖKÜ - Arkada kalmak / Halef olmak / İhtilaf etmek
    "خَلَف": { emoji: "👣" },
    "مُخَالَفَة": { 
        emoji: "🚫",
        arText: "يَجِبُ تَجَنُّبُ الْمُخَالَفَةِ",
        trText: "Muhalefetten (kurallara aykırı davranmaktan) kaçınmak gerekir."
    },
    "مُخَالِف": { emoji: "🙅‍♂️" },
    "خِلَافَة": { emoji: "🕌" },
    "اِخْتِلَاف": { 
        emoji: "↔️",
        arText: "اِخْتِلَافُ الرَّأْيِ لَا يُفْسِدُ لِلْوُدِّ قَضِيَّةً",
        trText: "Görüş ayrılığı (ihtilaf), dostluğu bozmaz. (Arap Atasözü)"
    },
    "خَلِيفَة": { 
        emoji: "👑",
        arText: "إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً",
        trText: "Muhakkak ben yeryüzünde bir halife var edeceğim. (Bakara Suresi)"
    },
    "مُخْتَلِف": { emoji: "🌈" },
    "خُلَفَاء": { 
        emoji: "👥",
        arText: "الْخُلَفَاءُ الرَّاشِدُونَ",
        trText: "Hulefa-i Raşidin (Dört Halife)."
    },

    // 24. Kh-R-J (خ ر ج) KÖKÜ - Çıkmak / Çıkarmak
    "خَرَاج": { emoji: "💰" },
    "خَارِج": { emoji: "🏞️" },
    "مَخْرَج": {
        emoji: "🚪",
        arText: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
        trText: "Kim Allah'a karşı gelmekten sakınırsa, Allah ona bir çıkış yolu (mahreç) açar. (Talak Suresi)"
    },
    "إِخْرَاج": {
        emoji: "📤",
        arText: "إِخْرَاجُ الزَّكَاةِ",
        trText: "Zekatın çıkarılması (verilmesi)."
    },
    "إِخْرَاجَات": {
        emoji: "🚢",
        arText: "زَادَتْ إِخْرَاجَاتُ الدَّوْلَةِ",
        trText: "Devletin ihracatı (dışa satımı) arttı."
    },

    // 25. '-M-L (ع م ل) KÖKÜ - Çalışmak / Yapmak / İşlem
    "عَمَل": {
        emoji: "💼",
        arText: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
        trText: "Ameller (işler) niyetlere göredir. (Hadis-i Şerif)"
    },
    "عَمَلَة": { emoji: "👷" },
    "عَمَلِيَّات": { 
        emoji: "🏥",
        arText: "غُرْفَةُ الْعَمَلِيَّاتِ فِي الْمُسْتَشْفَى",
        trText: "Hastanede ameliyathane (operasyon odası)."
    },
    "مَعْمُول": { emoji: "📦" },
    "إِعْمَال": { emoji: "🏭" },
    "مُعَامَلَة": { 
        emoji: "🤝",
        arText: "الدِّينُ الْمُعَامَلَةُ",
        trText: "Din, güzel muameledir (insan ilişkileridir). (Hadis-i Şerif)"
    },
    "مُعَامَلَات": { emoji: "🗂️" },
    "اِسْتِعْمَال": { 
        emoji: "🔄",
        arText: "دَلِيلُ الِاسْتِعْمَالِ",
        trText: "Kullanım kılavuzu (İstimal rehberi)."
    },

    // 26. D-R-S (د ر س) KÖKÜ - Ders / Okumak / Öğrenmek
    "دَرْس": { emoji: "📓" },
    "دِرَاسَة": { emoji: "📚" },
    "مَدْرَسَة": { 
        emoji: "🏫",
        arText: "الْمَدْرَسَةُ بَيْتُنَا الثَّانِي",
        trText: "Okul bizim (öğrencilerin) ikinci evidir."
    },
    "تَدْرِيس": { emoji: "✍️" },
    "مُدَرِّس": {
        emoji: "👨‍🏫",
        arText: "مَنْ عَلَّمَنِي حَرْفاً صِرْتُ لَهُ عَبْداً",
        trText: "Bana bir harf öğretenin kölesi olurum. (Hz. Ali)"
    },

    // 27. H-F-Z (ح ف ظ) KÖKÜ - Korumak / Ezberlemek
    "حِفْظ": { emoji: "💾" },
    "حَافِظ": {
        emoji: "📖",
        arText: "فَاللَّهُ خَيْرٌ حَافِظًا",
        trText: "Allah en hayırlı koruyucudur. (Yusuf Suresi)"
    },
    "حَافِظَة": {
        emoji: "🧠",
        arText: "حَافِظَةٌ قَوِيَّةٌ",
        trText: "Güçlü bir hafıza."
    },
    "مَحْفُوظ": {
        emoji: "🛡️",
        arText: "فِي لَوْحٍ مَحْفُوظٍ",
        trText: "Korunmuş bir levhadadır (Levh-i Mahfuz). (Büruc Suresi)"
    },
    "مُحَافَظَة": {
        emoji: "🏰",
        arText: "حَافِظُوا عَلَى الصَّلَوَاتِ",
        trText: "Namazları koruyun (özen gösterin). (Bakara Suresi)"
    },
    "مُحَافِظ": { emoji: "👔" },

    // 28. N-Z-R (ن ظ ر) KÖKÜ - Bakmak / Görmek / Beklemek
    "نَظَر": {
        emoji: "👁️",
        arText: "الْعَيْنُ حَقٌّ",
        trText: "Nazar (göz değmesi) haktır (gerçektir). (Hadis-i Şerif)"
    },
    "نَاظِر": { emoji: "👀" },
    "مَنْظَرَة": {
        emoji: "🌄",
        arText: "يَا لَهُ مِنْ مَنْظَرٍ جَمِيلٍ!",
        trText: "Ne kadar güzel bir manzara!"
    },
    "مُنَاظَرَة": { emoji: "🗣️" },
    "اِنْتِظَار": {
        emoji: "⏳",
        arText: "اِنْتِظَارُ الْفَرَجِ عِبَادَةٌ",
        trText: "Sıkıntıdan kurtulmayı beklemek (intizar) ibadettir. (Hadis-i Şerif)"
    },

    // 29. M-K-N (م ك ن) KÖKÜ - Mümkün Olmak / Yer / Güç
    "إِمْكَان": {
        emoji: "✨",
        arText: "فِي حُدُودِ الْإِمْكَانِ",
        trText: "İmkânlar dâhilinde."
    },
    "مُمْكِن": {
        emoji: "✔️",
        arText: "كُلُّ شَيْءٍ مُمْكِنٌ بِإِذْنِ اللَّهِ",
        trText: "Allah'ın izniyle her şey mümkündür."
    },
    "تَمْكِين": { emoji: "💪" },
    "مَكَان": {
        emoji: "📍",
        arText: "شَرَفُ الْمَكَانِ بِالْمَكِينِ",
        trText: "Bir mekânın şerefi (değeri), orada bulunanlardan gelir. (Atasözü)"
    },

    // 30. H-S-N (ح س ن) KÖKÜ - Güzellik / İyilik / İhsan
    "حَسَن": {
        emoji: "🌸",
        arText: "الْحَسَنُ وَالْحُسَيْنُ سَيِّدَا شَبَابِ أَهْلِ الْجَنَّةِ",
        trText: "Hasan ve Hüseyin, cennet gençlerinin efendileridir. (Hadis-i Şerif)"
    },
    "حُسَيْن": { emoji: "🌷" },
    "أَحْسَن": {
        emoji: "🥇",
        arText: "لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ",
        trText: "Biz insanı en güzel biçimde (ahsen-i takvim) yarattık. (Tîn Suresi)"
    },
    "حُسْنَى": {
        emoji: "💎",
        arText: "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا",
        trText: "En güzel isimler (Esma-ül Hüsna) Allah'ındır, O'na onlarla dua edin. (A'râf Suresi)"
    },
    "إِحْسَان": {
        emoji: "💖",
        arText: "هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ",
        trText: "İyiliğin (ihsanın) karşılığı, iyilikten başka bir şey midir? (Rahmân Suresi)"
    },
    "مُحْسِن": {
        emoji: "😇",
        arText: "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ",
        trText: "Şüphesiz Allah, iyilik edenleri (muhsinleri) sever. (Bakara Suresi)"
    },
    "تَحْسِين": { emoji: "📈" },

    // 31. S-'-D (س ع د) KÖKÜ - Mutluluk / Saadet
    "سَعَادَة": {
        emoji: "✨",
        arText: "السَّعَادَةُ فِي الْقَنَاعَةِ",
        trText: "Mutluluk (saadet) kanaattedir. (Atasözü)"
    },
    "سُعَاد": { emoji: "🌸" },
    "سَعِيد": {
        emoji: "😊",
        arText: "فَمِنْهُمْ شَقِيٌّ وَسَعِيدٌ",
        trText: "Onlardan kimi bedbaht (mutsuz), kimi de bahtiyar (mutlu - said)dır. (Hûd Suresi)"
    },
    "سَعِيدَة": { emoji: "🥰" },
    "مَسْعُود": { 
        emoji: "🍀",
        arText: "أَيَّامٌ مَسْعُودَةٌ",
        trText: "Mutlu (Mesut) ve uğurlu günler."
    },
    "مَسْعُودَة": { emoji: "🌻" },

    // 32. J-H-L (ج ه ل) KÖKÜ - Bilmemek / Cehalet
    "جَاهِل": {
        emoji: "🙈",
        arText: "النَّاسُ أَعْدَاءُ مَا جَهِلُوا",
        trText: "İnsanlar bilmedikleri şeyin düşmanıdır. (Hz. Ali)"
    },
    "جَاهِلِيَّة": { emoji: "🌑" },
    "مَجْهُول": {
        emoji: "❓",
        arText: "فَاعِلٌ مَجْهُولٌ",
        trText: "Faili meçhul (yapanı bilinmeyen)."
    },
    "جُهَلَاء": {
        emoji: "🙉",
        arText: "وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا",
        trText: "Cahiller onlara laf attığında 'Selam' der (geçerler). (Furkan Suresi)"
    },

    // 33. W-J-D (و ج د) KÖKÜ - Bulmak / Var Olmak
    "وُجُود": { emoji: "🌌" },
    "وِجْدَان": {
        emoji: "❤️",
        arText: "صَوْتُ الْوِجْدَانِ",
        trText: "Vicdanın sesi."
    },
    "مَوْجُود": {
        emoji: "✅",
        arText: "الْبَضَاعَةُ مَوْجُودَةٌ فِي الْمَخْزَنِ",
        trText: "Mal depoda mevcut (bulunmaktadır)."
    },
    "إِيْجَاد": {
        emoji: "🔍",
        arText: "إِيجَادُ حَلٍّ لِلْمُشْكِلَةِ",
        trText: "Probleme bir çözüm bulmak (icad etmek)."
    },
    "مُوجِد": { emoji: "💡" },

    // 34. S-K-N (س ك ن) KÖKÜ - Sakin olmak / İkamet etmek / Huzur
    "سَاكِن": { emoji: "😌" },
    "مَسْكُون": { 
        emoji: "🏘️",
        arText: "مِنْطَقَةٌ مَسْكُونَةٌ",
        trText: "Meskun mahal (yerleşim yeri)."
    },
    "مَسْكَن": {
        emoji: "🏡",
        arText: "وَاللَّهُ جَعَلَ لَكُمْ مِنْ بُيُوتِكُمْ سَكَنًا",
        trText: "Allah, evlerinizi sizin için bir huzur ve dinlenme yeri (mesken) kıldı. (Nahl Suresi)"
    },
    "إِسْكَان": { emoji: "🏢" },
    "تَسْكِين": {
        emoji: "🕊️",
        arText: "تَسْكِينُ الْأَلَمِ",
        trText: "Ağrıyı dindirmek (Teskin etmek)."
    },
    "سَكِينَة": {
        emoji: "✨",
        arText: "فَأَنْزَلَ اللَّهُ سَكِينَتَهُ عَلَيْهِ",
        trText: "Allah onun üzerine sekinetini (huzur ve güvenini) indirdi. (Tevbe Suresi)"
    },

    // 35. J-H-D (ج ه د) KÖKÜ - Çaba Göstermek / Gayret / Mücadele
    "جَاهِد": { emoji: "💪" },
    "جِهَاد": {
        emoji: "🛡️",
        arText: "وَجَاهِدُوا فِي اللَّهِ حَقَّ جِهَادِهِ",
        trText: "Allah uğrunda hakkıyla cihad edin (gayret gösterin). (Hac Suresi)"
    },
    "مُجَاهِد": { emoji: "🏇" },
    "مُجَاهِدَة": { emoji: "🧕" },
    "اِجْتِهَاد": { 
        emoji: "📚",
        arText: "الِاجْتِهَادُ مِفْتَاحُ النَّجَاحِ",
        trText: "Çalışmak (içtihat/gayret), başarının anahtarıdır."
    },
    "مُجْتَهِد": {
        emoji: "🤓",
        arText: "لِكُلِّ مُجْتَهِدٍ نَصِيبٌ",
        trText: "Her çalışanın (gayret edenin) bir nasibi (payı) vardır. (Atasözü)"
    },

    // 36. S-L-M (س ل م) KÖKÜ - Barış / Kurtuluş / Teslim Olmak
    "سَلَام": {
        emoji: "🕊️",
        arText: "أَفْشُوا السَّلَامَ بَيْنَكُمْ",
        trText: "Aranızda selamı yayınız. (Hadis-i Şerif)"
    },
    "سَلَامَة": {
        emoji: "🛡️",
        arText: "فِي التَّأَنِّي السَّلَامَةُ",
        trText: "Acele etmemekte (teennide) selamet vardır. (Atasözü)"
    },
    "سَالِم": { emoji: "😌" },
    "سَلِيم": {
        emoji: "🫀",
        arText: "إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ",
        trText: "Ancak Allah'a temiz (selim) bir kalple gelenler müstesna. (Şuarâ Suresi)"
    },
    "إِسْلَام": {
        emoji: "🌙",
        arText: "إِنَّ الدِّينَ عِندَ اللَّهِ الْإِسْلَامُ",
        trText: "Şüphesiz Allah katında din İslam'dır. (Âl-i İmrân Suresi)"
    },
    "مُسْلِم": {
        emoji: "🤲",
        arText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِن لِّسَانِهِ وَيَدِهِ",
        trText: "Müslüman, diğer Müslümanların onun dilinden ve elinden güvende (salim) olduğu kimsedir. (Hadis-i Şerif)"
    },
    "تَسْلِيم": { emoji: "📦" },

    // 37. R-J-' (ر ج ع) KÖKÜ - Dönmek / Başvurmak / Gözden Geçirmek
    "مَرْجِع": {
        emoji: "📚",
        arText: "إِلَى اللَّهِ مَرْجِعُكُمْ جَمِيعًا",
        trText: "Hepinizin dönüşü (mercii/kaynağı) Allah'adır. (Mâide Suresi)"
    },
    "مُرَاجَعَة": {
        emoji: "📝",
        arText: "مُرَاجَعَةُ الدُّرُوسِ قَبْلَ الِامْتِحَانِ مُفِيدَةٌ",
        trText: "Sınavdan önce derslerin tekrar edilmesi (gözden geçirilmesi) faydalıdır."
    },
    "اِرْتِـجَاع": {
        emoji: "↩️",
        arText: "اِرْتِجَاعُ الْبَضَاعَةِ حَقٌّ لِلْمُشْتَرِي",
        trText: "Malın iadesi (geri verilmesi/artırım) alıcının hakkıdır."
    },

    // 38. Sh-K-L (ش ك ل) KÖKÜ - Biçim / Şekil / Sorun
    "شَكْل": { emoji: "📐" },
    "أَشْكَال": { emoji: "🎨" },
    "مُشْكِل": {
        emoji: "⚠️",
        arText: "لِكُلِّ مُشْكِلٍ حَلٌّ فِي النِّهَايَةِ",
        trText: "Her müşkülün (sorunun) sonunda bir çözümü vardır."
    },
    "تَشْكِيل": { emoji: "🔠" },
    "تَشْكِيلَات": {
        emoji: "🏢",
        arText: "تَشْكِيلَاتُ الدَّوْلَةِ التَّنْظِيمِيَّةِ",
        trText: "Devletin kurumsal teşkilatları (yapılanmaları)."
    },

    // 39. N-S-B (ن س ب) KÖKÜ - İlişki / Soy / Oran / Uygunluk
    "نَسَب": {
        emoji: "🌳",
        arText: "الْمَرْءُ بِأَدَبِهِ لَا بِأَصْلِهِ وَنَسَبِهِ",
        trText: "Kişinin değeri aslı ve nesebiyle (soyuyla) değil, edebiyle ölçülür. (Atasözü)"
    },
    "نِسْبَة": {
        emoji: "📊",
        arText: "نِسْبَةُ النَّجَاحِ عَالِيَةٌ فِي الِامْتِحَانِ",
        trText: "Sınavdaki başarı nispeti (oranı) oldukça yüksektir."
    },
    "مَنْسُوب": { emoji: "👤" },
    "مُنَاسَبَة": {
        emoji: "🎉",
        arText: "نَحْتَفِلُ بِهَذِهِ الْمُنَاسَبَةِ السَّعِيدَةِ",
        trText: "Bu mutlu münasebet (vesile/özel gün) sebebiyle kutlama yapıyoruz."
    },
    "اِنْتِسَاب": { emoji: "📝" },

    // 40. H-S-L (ح ص ل) KÖKÜ - Elde Etmek / Ürün / Sonuç
    "وَالْحَاصِل": {
        emoji: "🎯",
        arText: "وَالْحَاصِلُ أَنَّ الصِّحَّةَ تَاجٌ",
        trText: "Velhasıl (sözün özü/kısacası), sağlık bir taçtır."
    },
    "حَاصِلَات": {
        emoji: "📈",
        arText: "زَادَتْ حَاصِلَاتُ الشَّرِكَةِ هَذَا الْعَامِ",
        trText: "Şirketin hasılatı (gelirleri) bu yıl arttı."
    },
    "مَحْصُول": {
        emoji: "🌾",
        arText: "مَحْصُولُ هَذَا الْعَامِ وَفِيرٌ",
        trText: "Bu yılın mahsulü (ürünü) bereketlidir."
    },
    "تَحْصِيل": {
        emoji: "🎓",
        arText: "تَحْصِيلُ الْعِلْمِ نُورٌ لِلْعَقْلِ",
        trText: "İlim tahsil etmek (eğitim görmek/elde etmek) akıl için nurdur."
    },
    "تَحْصِيلَات": {
        emoji: "🧾",
        arText: "قِسْمُ التَّحْصِيلَاتِ فِي الْبَنْكِ",
        trText: "Bankadaki tahsilat (alacakların toplanması) bölümü."
    },

    // 41. B-R-K (ب ر ك) KÖKÜ - Bereket / Kutlamak / Çoğalmak
    "بَرَكَة": {
        emoji: "🌾",
        arText: "الْبَرَكَةُ فِي الْبُكُورِ",
        trText: "Bereket, sabahın erken vakitlerindedir. (Hadis-i Şerif)"
    },
    "تَبْرِيك": {
        emoji: "🥳",
        arText: "تَبْرِيكَاتِي الْحَارَّةُ بِمُنَاسَبَةِ النَّجَاحِ",
        trText: "Başarı vesilesiyle en samimi tebriklerim."
    },
    "مُبَارَك": {
        emoji: "🌙",
        arText: "شَهْرٌ مُبَارَكٌ وَعِيدٌ سَعِيدٌ",
        trText: "Mübarek bir ay ve mutlu bir bayram."
    },
    "تَبَرُّك": {
        emoji: "🤲",
        arText: "التَّبَرُّكُ بِدُعَاءِ الْوَالِدَيْنِ",
        trText: "Anne babanın duasıyla bereketlenmek (teberrük etmek)."
    },

    // 42. Q-D-R (ق د ر) KÖKÜ - Ölçmek / Güç Yetirmek / Değer / Kader
    "مِقْدَار": {
        emoji: "📊",
        arText: "بِمِقْدَارٍ مُعَيَّنٍ",
        trText: "Belirli bir miktarda."
    },
    "تَقْدِير": {
        emoji: "👏",
        arText: "شَهَادَةُ تَقْدِيرٍ",
        trText: "Takdir (teşekkür) belgesi."
    },
    "قَدَر": {
        emoji: "✨",
        arText: "إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ",
        trText: "Şüphesiz biz her şeyi bir ölçüye göre (kaderle) yarattık. (Kamer Suresi)"
    },
    "مُقَدَّرَات": {
        emoji: "🔮",
        arText: "مُقَدَّرَاتُ الْإِنْسَانِ مَكْتُوبَةٌ",
        trText: "İnsanın mukadderatı (alın yazısı) yazılmıştır."
    },
    "قُدْرَة": {
        emoji: "💪",
        arText: "قُدْرَةُ اللَّهِ لَا حُدُودَ لَهَا",
        trText: "Allah'ın kudretinin (gücünün) sınırı yoktur."
    },
    "اِقْتِدَار": {
        emoji: "👑",
        arText: "حِزْبُ الِاقْتِدَارِ",
        trText: "İktidar partisi (yönetme gücü)."
    },
    "قَادِر": {
        emoji: "🌟",
        arText: "هُوَ قَادِرٌ عَلَى كُلِّ شَيْءٍ",
        trText: "O, her şeye kadirdir (güç yetirendir)."
    },
    "مُقْتَدِر": {
        emoji: "🦁",
        arText: "فِي مَقْعَدِ صِدْقٍ عِندَ مَلِكٍ مُّقْتَدِرٍ",
        trText: "Güçlü bir padişahın (Muktedir olan Allah'ın) katında, doğruluk koltuğundadırlar. (Kamer Suresi)"
    },
    "قَدِير": {
        emoji: "💎",
        arText: "إِنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        trText: "Şüphesiz Allah her şeye kadirdir (sonsuz güç sahibidir). (Bakara Suresi)"
    },

    // 43. M-L-K (م ل ك) KÖKÜ - Sahip Olmak / Yönetmek / Melek
    "مَلَك": {
        emoji: "👼",
        arText: "الْمَلَائِكَةُ عِبَادٌ مُكْرَمُونَ",
        trText: "Melekler (Allah'ın) ikram olunmuş kullarıdır."
    },
    "مُلْك": {
        emoji: "👑",
        arText: "لِلَّهِ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ",
        trText: "Göklerin ve yerin mülkü (hükümranlığı) Allah'ındır. (Şûrâ Suresi)"
    },
    "مَالِك": {
        emoji: "🔑",
        arText: "مَالِكِ يَوْمِ الدِّينِ",
        trText: "Din gününün maliki (sahibi)dir. (Fâtiha Suresi)"
    },
    "مَلِيك": {
        emoji: "🤴",
        arText: "فِي مَقْعَدِ صِدْقٍ عِندَ مَلِيكٍ مُّقْتَدِرٍ",
        trText: "Güçlü bir padişahın (Melik'in) katında, doğruluk koltuğundadırlar. (Kamer Suresi)"
    },
    "مَلِيكَة": { emoji: "👸" },
    "مَمْلُوك": {
        emoji: "🛡️",
        arText: "الدَّوْلَةُ الْمَمْلُوكِيَّةُ فِي التَّارِيخِ",
        trText: "Tarihteki Memlük (köleleştirilmiş asker/hükümdar) Devleti."
    },
    "مَمْلَكَة": {
        emoji: "🏰",
        arText: "الْمَمْلَكَةُ الْعَرَبِيَّةُ السُّعُودِيَّةُ",
        trText: "Suudi Arabistan Krallığı (Arapçada krallık, Türkçede yurt/memleket)."
    },
    "أَمْلَاك": {
        emoji: "🏢",
        arText: "مَكْتَبُ الْأَمْلَاكِ وَالْعَقَارَاتِ",
        trText: "Emlak (mülkler) ve gayrimenkul ofisi."
    },

    // 44. R-S-L (ر س ل) KÖKÜ - Göndermek / Elçi / Mesaj
    "رِسَالَة": {
        emoji: "✉️",
        arText: "أَرْسَلْتُ رِسَالَةً نَصِّيَّةً",
        trText: "Bir kısa mesaj (risale/mektup) gönderdim."
    },
    "رَسُول": {
        emoji: "🌙",
        arText: "مُحَمَّدٌ رَسُولُ اللَّهِ",
        trText: "Muhammed Allah'ın resulüdür (elçisidir). (Fetih Suresi)"
    },
    "أَرْسَل": { emoji: "📤" },
    "إِرْسَالِيَّة": {
        emoji: "🧾",
        arText: "إِرْسَالِيَّةُ الْبَضَائِعِ جَاهِزَةٌ",
        trText: "Malların sevk irsaliyesi (teslimat belgesi) hazırdır."
    },
    "مُرْسَل": { emoji: "👤" },

    // 45. N-S-R (ن ص ر) KÖKÜ - Yardım Etmek / Zafer
    "نَصْر": {
        emoji: "✌️",
        arText: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
        trText: "Allah'ın yardımı (nasrı) ve fetih geldiğinde. (Nasr Suresi)"
    },
    "نُصْرَة": {
        emoji: "🤝",
        arText: "نُصْرَةُ الْمَظْلُومِ وَاجِبَةٌ",
        trText: "Mazluma yardım etmek (nusret/destek) vaciptir."
    },
    "نَاصِر": { emoji: "🛡️" },
    "مَنْصُور": {
        emoji: "🏆",
        arText: "عَادَ الْجَيْشُ مَنْصُورًا",
        trText: "Ordu muzaffer (mansur/yardım görmüş) olarak döndü."
    },

    // 46. H-M-L (ح م ل) KÖKÜ - Taşımak / Yüklenmek / Dayanmak
    "حَمْلَة": {
        emoji: "📣",
        arText: "حَمْلَةٌ تَعْلِيمِيَّةٌ جَدِيدَةٌ",
        trText: "Yeni bir eğitim kampanyası (hamlesi)."
    },
    "حَامِلَة": {
        emoji: "🤰",
        arText: "الْمَرْأَةُ الْحَامِلَةُ",
        trText: "Hamile (gebe) kadın."
    },
    "حَمَّال": {
        emoji: "📦",
        arText: "حَمَّالُ الْمَحَطَّةِ يُسَاعِدُ الْمُسَافِرِينَ",
        trText: "İstasyon hamalı yolculara yardım ediyor."
    },
    "اِحْتَمَال": {
        emoji: "🎲",
        arText: "بِكُلِّ اِحْتَمَالٍ",
        trText: "Her ihtimale karşı."
    },
    "مُحْتَمَل": {
        emoji: "🔮",
        arText: "أَمْرٌ مُحْتَمَلٌ جِدًّا",
        trText: "Çok muhtemel (olası) bir durum."
    },
    "تَحَمُّل": {
        emoji: "⏳",
        arText: "الصَّبْرُ هُوَ تَحَمُّلُ الصِّعَابِ",
        trText: "Sabır, zorluklara tahammül etmektir (dayanmaktır)."
    },

    // 47. H-Q-Q (ح ق ق) KÖKÜ - Hak / Gerçek / Doğruluk
    "حَقّ": {
        emoji: "⚖️",
        arText: "الْحَقُّ يَعْلُو وَلَا يُعْلَى عَلَيْهِ",
        trText: "Hak yücedir ve ondan üstünü yoktur. (Atasözü)"
    },
    "حُقُوق": {
        emoji: "📚",
        arText: "كُلِّيَّةُ الْحُقُوقِ",
        trText: "Hukuk fakültesi."
    },
    "حَقِيقَة": {
        emoji: "💎",
        arText: "هَذِهِ هِيَ الْحَقِيقَةُ",
        trText: "İşte bu hakikattir (gerçektir)."
    },
    "تَحْقِيق": {
        emoji: "🔍",
        arText: "جَارٍ التَّحْقِيقُ فِي الْأَمْرِ",
        trText: "Olayla ilgili tahkikat (inceleme/soruşturma) devam ediyor."
    },
    "مُحَقَّق": {
        emoji: "💯",
        arText: "أَمْرٌ مُحَقَّقٌ بِإِذْنِ اللَّهِ",
        trText: "Allah'ın izniyle muhakkak (kesinleşmiş) bir durum."
    },
    "اِسْتِحْقَاق": { emoji: "🏆" },
    "مُسْتَحَقّ": {
        emoji: "🎖️",
        arText: "الْجَائِزَةُ مُسْتَحَقَّةٌ لَهُ",
        trText: "Ödül ona müstehaktır (hak edilmiştir)."
    },

    // 48. Kh-L-S (خ ل ص) KÖKÜ - Saflık / Samimiyet / İhlas
    "خَالِص": {
        emoji: "💎",
        arText: "عَسَلٌ خَالِصٌ وَذَهَبٌ خَالِصٌ",
        trText: "Halis (saf/katkısız) bal ve halis altın."
    },
    "إِخْلَاص": {
        emoji: "❤️",
        arText: "الْإِخْلَاصُ فِي الْعَمَلِ أَسَاسُ الْقَبُولِ",
        trText: "İşte ihlas (samimiyet/içtenlik), kabulün temelidir."
    },
    "مُخْلِص": {
        emoji: "😇",
        arText: "هُوَ صَدِيقٌ مُخْلِصٌ لَا يَتَغَيَّرُ",
        trText: "O, asla değişmeyen muhlis (samimi/sadık) bir dosttur."
    },

    // 49. K-M-L (ك م ل) KÖKÜ - Tamamlamak / Olgunluk / Kusursuzluk
    "كَمَال": {
        emoji: "🌟",
        arText: "الْكَمَالُ لِلَّهِ وَحْدَهُ",
        trText: "Kemal (kusursuzluk) sadece Allah'a mahsustur."
    },
    "كَامِل": {
        emoji: "🌕",
        arText: "بَدْرٌ كَامِلٌ",
        trText: "Kamil (tam) dolunay."
    },
    "إِكْمَال": {
        emoji: "🧩",
        arText: "إِكْمَالُ النَّقْصِ",
        trText: "Eksiği tamamlama (ikmal)."
    },
    "تَكْمِيل": { emoji: "✅" },
    "مُكَمَّل": {
        emoji: "💯",
        arText: "عَمَلٌ مُكَمَّلٌ وَرَائِعٌ",
        trText: "Mükemmel (eksiksiz) ve harika bir iş."
    },

    // 50. R-Sh-D (ر ش د) KÖKÜ - Doğru Yolda Olmak / Olgunluk / Rehberlik
    "رَشِيد": {
        emoji: "🧠",
        arText: "أَلَيْسَ مِنْكُمْ رَجُلٌ رَشِيدٌ",
        trText: "İçinizde aklı başında (reşit/doğru dürüst) bir adam yok mu? (Hûd Suresi)"
    },
    "رُشْد": {
        emoji: "🌱",
        arText: "قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ",
        trText: "Doğru yol (rüşt), eğri yoldan kesinlikle ayrılmıştır. (Bakara Suresi)"
    },
    "إِرْشَاد": {
        emoji: "ℹ️",
        arText: "إِرْشَادُ النَّاسِ إِلَى الْخَيْرِ",
        trText: "İnsanları hayra yönlendirmek (irşat etmek)."
    },
    "رَشَاد": {
        emoji: "💎",
        arText: "أَهْدِكُمْ سَبِيلَ الرَّشَادِ",
        trText: "Sizi doğru yola (reşat yoluna) ulaştırayım. (Mü'min Suresi)"
    },
    "مُرْشِد": {
        emoji: "🗺️",
        arText: "الْكِتَابُ خَيْرُ مُرْشِدٍ لِلْإِنْسَانِ",
        trText: "Kitap, insan için en iyi mürşittir (yol göstericidir/rehberdir)."
    },
    "رَاشِد": {
        emoji: "🕌",
        arText: "الْخُلَفَاءُ الرَّاشِدُونَ",
        trText: "Hulefâ-yi Râşidîn (Doğru yolda olan râşit halifeler)."
    },

    // 51. A-M-N (أ م ن) KÖKÜ - Güvende Olmak / İnanmak / Güvenilirlik
    "أَمَان": {
        emoji: "🛡️",
        arText: "الْأَمَانُ وَالصِّحَّةُ نِعْمَتَانِ",
        trText: "Aman (güvenlik) ve sağlık iki büyük nimettir."
    },
    "أَمَانَة": {
        emoji: "📦",
        arText: "الأَمَانَةُ تَجْلِبُ الرِّزْقَ",
        trText: "Emaneti korumak (güvenilir olmak) rızık getirir."
    },
    "أَمْن": { emoji: "👮" },
    "أَمِين": {
        emoji: "🤝",
        arText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ وَالْمُؤْمِنُ مَنْ أَمِنَهُ النَّاسُ",
        trText: "Müslüman, diğer Müslümanların elinden ve dilinden emin olduğu kimsedir."
    },
    "إِيمَان": {
        emoji: "❤️",
        arText: "الْإِيمَانُ مَا وَقَرَ فِي الْقَلْبِ",
        trText: "İman, kalbe yerleşen (inanılan) şeydir."
    },
    "مُؤْمِن": {
        emoji: "🕌",
        arText: "الْمُؤْمِنُ مِرْآةُ الْمُؤْمِنِ",
        trText: "Mümin, müminin aynasıdır. (Hadis-i Şerif)"
    },
    "تَأْمِين": {
        emoji: "📝",
        arText: "شَرِكَةُ التَّأْمِينِ الصِّحِّيِّ",
        trText: "Sağlık sigortası (güvencesi/tamini) şirketi."
    },

    // 52. J-M-' (ج م ع) KÖKÜ - Toplamak / Bir Araya Getirmek / Topluluk
    "جَمْع": { emoji: "🔢" },
    "جَمْعِيَّة": {
        emoji: "🏢",
        arText: "جَمْعِيَّةٌ خَيْرِيَّةٌ لِمُسَاعَدَةِ الْمُحْتَاجِينَ",
        trText: "İhtiyaç sahiplerine yardım için bir hayır cemiyeti (derneği)."
    },
    "جَمَاعة": {
        emoji: "👥",
        arText: "صَلَاةُ الْجَمَاعَةِ أَفْضَلُ مِنْ صَلَاةِ الْفَذِّ",
        trText: "Cemaatle kılınan namaz, tek başına kılınan namazdan daha faziletlidir. (Hadis-i Şerif)"
    },
    "جَامِع": {
        emoji: "🕌",
        arText: "أَحَبُّ الْبِلَادِ إِلَى اللَّهِ مَسَاجِدُهَا",
        trText: "Allah'a beldelerin en sevimlisi mescitlerdir (camilerdir). (Hadis-i Şerif)"
    },
    "جُمُعَة": {
        emoji: "🕋",
        arText: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِنْ يَوْمِ الْجُمُعَةِ...",
        trText: "Ey iman edenler! Cuma günü namaz için çağrı yapıldığında... (Cuma Suresi)"
    },
    "جَامِعَة": {
        emoji: "🎓",
        arText: "الْحَيَاةُ الْجَامِعِيَّةُ مَلِيئَةٌ بِالتَّجَارِبِ",
        trText: "Üniversite hayatı tecrübelerle doludur."
    },
    "مَجْمُوعَة": {
        emoji: "📂",
        arText: "مَجْمُوعَةٌ جَدِيدَةٌ مِنَ الطُّلَّابِ",
        trText: "Yeni bir öğrenci grubu (kümesi)."
    },
    "اِجْتِمَاع": {
        emoji: "💼",
        arText: "لَدَيْنَا اِجْتِمَاعٌ مُهِمٌّ الْيَوْمَ",
        trText: "Bugün önemli bir toplantımız (içtimamız) var."
    },

    // 53. H-M-D (ح م د) KÖKÜ - Övmek / Şükretmek
    "حَمْد": {
        emoji: "🤲",
        arText: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        trText: "Hamd (övgü ve şükür), alemlerin Rabbi olan Allah'a mahsustur. (Fâtiha Suresi)"
    },
    "حَمْدِيَّة": { emoji: "🌸" },
    "أَحْمَد": {
        emoji: "🌟",
        arText: "وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ",
        trText: "Benden sonra gelecek 'Ahmet' (çok övülen) adındaki bir peygamberi müjdeleyici olarak... (Saf Suresi)"
    },
    "حَمِيد": {
        emoji: "💎",
        arText: "إِنَّ اللَّهَ هُوَ الْغَنِيُّ الْحَمِيدُ",
        trText: "Şüphesiz Allah, hiçbir şeye muhtaç değildir, her türlü övgüye layıktır (Hamit'tir). (Lokmân Suresi)"
    },
    "مَحْمُود": {
        emoji: "🏅",
        arText: "عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا",
        trText: "Umulur ki Rabbin seni Makam-ı Mahmud'a (övülmüş bir makama) ulaştırır. (İsrâ Suresi)"
    },
    "مُحَمَّد": {
        emoji: "🌹",
        arText: "مُحَمَّدٌ رَّسُولُ اللَّهِ",
        trText: "Muhammed (s.a.v), Allah'ın elçisidir. (Fetih Suresi)"
    },

    // 54. Sh-H-R (ش ه ر) KÖKÜ - Belirmek / İlan Etmek / Ay / Şöhret
    "شَهْر": {
        emoji: "📅",
        arText: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ",
        trText: "Ramazan ayı, içinde Kur'an'ın indirildiği aydır. (Bakara Suresi)"
    },
    "شُهْرَة": {
        emoji: "🌟",
        arText: "النَّجَاحُ يَجْلِبُ الشُّهْرَةَ عَبْرَ الْعَمَلِ",
        trText: "Başarı, çalışmayla birlikte şöhreti (tanınmışlığı) getirir."
    },
    "مَشْهُور": {
        emoji: "🎤",
        arText: "هُوَ كَاتِبٌ مَشْهُورٌ فِي الْعَالَمِ",
        trText: "O, dünyada meşhur (tanınmış) bir yazardır."
    },
    "تَشْهِير": {
        emoji: "📢",
        arText: "تَشْهِيرُ الْأَخْبَارِ الْكَاذِبَةِ مَمْنُوعٌ",
        trText: "Yalan haberlerin teşhir edilmesi (ifşa edilmesi/yayılması) yasaktır."
    },

    // 55. Sh-K-R (ش ك ر) KÖKÜ - Teşekkür Etmek / Şükretmek
    "شُكْر": {
        emoji: "🙏",
        arText: "مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ اللَّهَ",
        trText: "İnsanlara teşekkür etmeyen, Allah'a da şükretmez. (Hadis-i Şerif)"
    },
    "شُكْرِيّ": { emoji: "👨" },
    "شُكْرِيَّة": { emoji: "👩" },
    "شُكْرَان": {
        emoji: "🌹",
        arText: "شُكْرَانًا جَزِيلًا عَلَى حُسْنِ صَنِيعِكُمْ",
        trText: "Güzel davranışınız için çok şükran (teşekkür) ederim."
    },
    "شَاكِر": {
        emoji: "😇",
        arText: "أَنَا شَاكِرٌ لَكَ عَلَى مَعْرُوفِكَ",
        trText: "İyiliğin için sana şâkirim (teşekkür ederim/minnettarım)."
    },
    "تَشَكُّر": {
        emoji: "🤝",
        arText: "تَشَكُّرَاتِي الْقَلْبِيَّةُ لَكُمْ جَمِيعًا",
        trText: "Hepinize kalbi teşekkürlerimi (teşekkürlerimi) sunarım."
    },
    "مُتَشَكِّر": {
        emoji: "👔",
        arText: "أَنَا مُتَشَكِّرٌ جِدًّا لِمُسَاعَدَتِكُمْ",
        trText: "Yardımınız için çok müteşekkirim (minnettarım)."
    },

    // 56. F-K-R (ف ك ر) KÖKÜ - Düşünmek / Fikir
    "فِكْر": {
        emoji: "🧠",
        arText: "الْفِكْرُ حُرٌّ وَلَا يُقَيَّدُ",
        trText: "Fikir özgürdür ve kısıtlanamaz."
    },
    "فِكْرِيّ": {
        emoji: "💡",
        arText: "حُقُوقُ الْمِلْكِيَّةِ الْفِكْرِيَّةِ",
        trText: "Fikri mülkiyet hakları."
    },
    "فِكْرَة": {
        emoji: "💭",
        arText: "هَذِهِ فِكْرَةٌ مُمْتَازَةٌ جِدًّا",
        trText: "Bu, çok mükemmel bir fikir."
    },
    "تَفَكُّر": {
        emoji: "🤔",
        arText: "تَفَكُّرُ سَاعَةٍ خَيْرٌ مِنْ عِبَادَةِ سَنَةٍ",
        trText: "Bir saat tefekkür (derin düşünme), bir yıl ibadetten hayırlıdır."
    },
    "مُتَفَكِّر": {
        emoji: "🧔",
        arText: "هُوَ كَاتِبٌ وَمُتَفَكِّرٌ كَبِيرٌ",
        trText: "O, büyük bir yazar ve mütefekkirdir (düşünürdür)."
    },

    // 57. W-K-L (و ك ل) KÖKÜ - Güvenmek / Vekil Tayin Etmek / Dayanmak
    "وَكَالَة": {
        emoji: "📜",
        arText: "أَعْطَاهُ وَكَالَةً عَامَّةً",
        trText: "Ona genel vekalet (temsil yetkisi) verdi."
    },
    "وَكِيل": {
        emoji: "🛡️",
        arText: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        trText: "Allah bize yeter, O ne güzel vekildir. (Âl-i İmrân Suresi)"
    },
    "مُوَكِّل": {
        emoji: "👤",
        arText: "الْمُحَامِي يُدَافِعُ عَنْ مُوَكِّلِهِ",
        trText: "Avukat müvekkilini (kendisini vekil tayin edeni) savunur."
    },
    "تَوَكُّل": {
        emoji: "🤲",
        arText: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
        trText: "Kim Allah'a tevekkül ederse, O ona yeter. (Talak Suresi)"
    },

    // 58. Q-D-M (ق د م) KÖKÜ - Öne Geçmek / Eski / Sunmak / Adım
    "قَدَمَة": { emoji: "🪜" },
    "قَدِيم": {
        emoji: "🏛️",
        arText: "صَدَاقَتُنَا قَدِيمَةٌ وَقَوِيَّةٌ",
        trText: "Dostluğumuz kadim (eski) ve güçlüdür."
    },
    "تَقْدِيم": {
        emoji: "🎁",
        arText: "تَقْدِيمُ الْهَدَايَا يَزِيدُ الْمَحَبَّةَ",
        trText: "Hediye takdim etmek (sunmak) sevgiyi artırır."
    },
    "مُقَدِّمَة": {
        emoji: "📖",
        arText: "مُقَدِّمَةُ ابْنِ خَلْدُونَ أَثَرٌ تَارِيخِيٌّ عَظِيمٌ",
        trText: "İbn Haldun'un Mukaddime'si (önsözü/giriş eseri) harika bir tarihi eserdir."
    },

    // 59. K-B-R (ك ب ر) KÖKÜ - Büyümek / Büyük Olmak / Yücelik / Kibir
    "كِبْر": {
        emoji: "🦚",
        arText: "الْكِبْرُ مَذْمُومٌ فِي الْأَخْلَاقِ",
        trText: "Kibir, ahlakta kınanmış (kötü) bir davranıştır."
    },
    "كِبَار": {
        emoji: "🧓",
        arText: "اِحْتِرَامُ كِبَارِ السِّنِّ وَاجِبٌ",
        trText: "Yaşça büyük olanlara (büyüklere) saygı göstermek vaciptir."
    },
    "أَكْبَر": {
        emoji: "🌌",
        arText: "اللَّهُ أَكْبَرُ مِنْ كُلِّ شَيْءٍ",
        trText: "Allah her şeyden en büyüktür (ekberdir)."
    },
    "كُبْرَى": {
        emoji: "🌟",
        arText: "الْقِيَامَةُ هِيَ الدَّاهِيَةُ الْكُبْرَى",
        trText: "Kıyamet en büyük (kübra) hadisedir."
    },
    "تَكْبِير": {
        emoji: "🕌",
        arText: "نُرَدِّدُ التَّكْبِيرَ فِي أَيَّامِ الْعِيدِ",
        trText: "Bayram günlerinde tekbir getiririz."
    },

    // 60. '-D-L (ع د ل) KÖKÜ - Adalet / Eşitlik / Düzenleme
    "عَدْلِيَّة": {
        emoji: "🏛️",
        arText: "ذَهَبَ الْمُحَامِي إِلَى الْعَدْلِيَّةِ",
        trText: "Avukat adliyeye (sarayına) gitti."
    },
    "عَدَالَة": {
        emoji: "⚖️",
        arText: "الْعَدَالَةُ أَسَاسُ الْمُلْكِ",
        trText: "Adalet mülkün (devletin) temelidir."
    },
    "عَادِل": {
        emoji: "👨‍⚖️",
        arText: "هُوَ قَاضٍ عَادِلٌ يَحْكُمُ بِالْحَقِّ",
        trText: "O, hakla hükmeden adil bir kadıdır (hakimdir)."
    },
    "تَعْدِيلَات": {
        emoji: "🔧",
        arText: "إِجْرَاءُ تَعْدِيلَاتٍ جَدِيدَةٍ فِي الْقَانُونِ",
        trText: "Kanunda yeni tadilatlar (düzenlemeler/değişiklikler) yapmak."
    },
    "مُعَادِل": {
        emoji: "🟰",
        arText: "هَذَا الدَّوَاءُ مُعَادِلٌ لِلْآخَرِ",
        trText: "Bu ilaç diğeriyle muadildir (eşdeğerdir)."
    },
    "اِعْتِدَال": {
        emoji: "🍃",
        arText: "الِاعْتِدَالُ فِي كُلِّ شَيْءٍ خَيْرٌ",
        trText: "Her şeyde itidal (ölçülülük/dengeli olmak) hayırlıdır."
    },

    // S-J-D (س ج د) KÖKÜ - Secde Etmek / İbadet / Mescid
    "سَجْدَة": {
        emoji: "🧎",
        arText: "سَجْدَةُ الشُّكْرِ تَدُلُّ عَلَى الِامْتِنَانِ",
        trText: "Şükür secdesi, minnettarlığı (şükranı) gösterir."
    },
    "مَسْجِد": {
        emoji: "🕌",
        arText: "أَحَبُّ الْبِلَادِ إِلَى اللَّهِ مَسَاجِدُهَا",
        trText: "Allah'a beldelerin en sevimlisi mescitleridir (camileridir). (Hadis-i Şerif)"
    },
    "سَاجِد": { emoji: "🙇" }, 
    "سُجُود": {
        emoji: "🤲",
        arText: "أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ",
        trText: "Kulun Rabbine en yakın olduğu an secde (sücud) anıdır; orada duayı çok yapın. (Hadis-i Şerif)"
    },
};

function checkWordEasterEgg(word, boxElement) {
    const isZoomEnabled = document.getElementById('zoomToggleCheckbox').checked;
    if (isZoomEnabled) {
        return; 
    }

    if (!word || !boxElement) return;
    
    document.querySelectorAll('.easter-egg-trigger').forEach(btn => btn.remove());

    const data = wordEasterEggs[word];
    if (!data) return;

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

        setTimeout(() => {
            emojiDiv.remove();
        }, 5000);
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