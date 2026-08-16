
window.isAtlasFullscreen = false;
window.toggleAtlasFullscreen = function() {
    window.isAtlasFullscreen = !window.isAtlasFullscreen;
    let screenAtlas = document.getElementById('screen-atlas');
    let fsBtn = document.getElementById('atlas-fs-btn');
    let descBottom = document.getElementById('atlas-desc-bottom');
    if (window.isAtlasFullscreen) {
        screenAtlas.style.position = 'fixed';
        screenAtlas.classList.add('atlas-fullscreen');
        if (descBottom) descBottom.style.display = 'none';
        if (fsBtn) fsBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>';
    } else {
        screenAtlas.style.position = 'relative';
        screenAtlas.classList.remove('atlas-fullscreen');
        if (descBottom) descBottom.style.display = 'block';
        if (fsBtn) fsBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
    }
    window.handleAtlasVerbChange(true);
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 50);
};


window.colorizeAffixes = function(word, stage, index) {
    let suffix = "";
    let prefix = "";
    
    if (stage.includes('mazi')) {
        const maziSuffixes = [
            "َ", "َا", "ُوا", "َتْ", "َتَا", "ْنَ", "ْتَ", "ْتُمَا", "ْتُمْ", "ْتِ", "ْتُمَا", "ْتُنَّ", "ْتُ", "ْنَا", "ْنَا"
        ];
        suffix = maziSuffixes[index] || "";
    } else if (stage.includes('muzari')) {
        const muzariSuffixes = [
            "ُ", "َانِ", "ُونَ", "ُ", "َانِ", "ْنَ", "ُ", "َانِ", "ُونَ", "ِينَ", "َانِ", "ْنَ", "ُ", "ُ", "ُ"
        ];
        suffix = muzariSuffixes[index] || "";
        if (word.length >= 2) {
            prefix = word.substring(0, 2);
            word = word.substring(2);
        }
    } else if (stage.includes('emir')) {
        const emirSuffixes = [
            "ْ", "َا", "ُوا", "ِي", "َا", "ْنَ"
        ];
        suffix = emirSuffixes[index] || "";
    }
    
    let root = word;
    if (suffix && root.endsWith(suffix)) {
        root = root.substring(0, root.length - suffix.length);
    } else {
        suffix = ""; // Fallback
    }
    
    let rootColor = "#0f172a"; // Siyah (Slate 900)
    let affixColor = "#ea580c"; // Orange
    
    let html = "";
    if (prefix) {
        html += `<span style="color: ${affixColor};">${prefix}</span>`;
    }
    html += `<span style="color: ${rootColor};">${root}</span>`;
    if (suffix) {
        html += `<span style="color: ${affixColor};">${suffix}</span>`;
    }
    
    return html;
};

window.displayVerbsMap = {
    'كتب': 'كَتَبَ',
    'دخل': 'دَخَلَ',
    'خرج': 'خَرَجَ',
    'جلس': 'جَلَسَ',
    'فتح': 'فَتَحَ',
    'لبس': 'لَبِسَ',
    'ذهب': 'ذَهَبَ',
    'رجع': 'رَجَعَ',
    'درس': 'دَرَسَ',
    'nam': 'نامَ',
    'شرب': 'شَرِبَ',
    'أكل': 'أَكَلَ',
    'غسل': 'غَسَلَ',
    'علّم': 'عَلَّمَ',
    'قرأ': 'قَرَأَ',
    'ظنّ': 'ظَنَّ',
    'وجد': 'وَجَدَ',
    'قال': 'قَالَ',
    'نسي': 'نَسِيَ',
    'اعترف': 'اِعْتَرَفَ',
    'انقلب': 'اِنْقَلَبَ',
    'استيقظ': 'اِسْتَيْقَظَ',
    'توضأ': 'تَوَضَّأَ',
    'صلى': 'صَلّى',
    'تناول': 'تَناوَلَ',
    'ساعد': 'ساعَدَ',
    'نظف': 'نَظَّفَ',
    'أراد': 'أَرادَ',
    'سافر': 'سافَرَ'
};
// --- AUTO-FILL MEZID VERBS IF NOUN EXISTS ---
(function autoFillMezidVerbs() {
    if (typeof sozlukVerileri === 'undefined') return;
    const mezidBabRanges = [
        { verbStart: 52, verbEnd: 54, nounStart: 55, nounEnd: 57 }, // Bab 7 İf'al
        { verbStart: 58, verbEnd: 60, nounStart: 61, nounEnd: 63 }, // Bab 8 Tef'il
        { verbStart: 64, verbEnd: 66, nounStart: 67, nounEnd: 70 }, // Bab 9 Mufaale
        { verbStart: 71, verbEnd: 73, nounStart: 74, nounEnd: 76 }, // Bab 10 Infi'al
        { verbStart: 77, verbEnd: 79, nounStart: 80, nounEnd: 82 }, // Bab 11 Ifti'al
        { verbStart: 83, verbEnd: 85, nounStart: 86, nounEnd: 87 }, // Bab 12 If'ilal
        { verbStart: 88, verbEnd: 90, nounStart: 91, nounEnd: 93 }, // Bab 13 Tefa'ul
        { verbStart: 94, verbEnd: 96, nounStart: 97, nounEnd: 99 }, // Bab 14 Tefaul
        { verbStart: 100, verbEnd: 102, nounStart: 103, nounEnd: 105 } // Bab 15 Istif'al
    ];
    for (let root in sozlukVerileri) {
        let entry = sozlukVerileri[root];
        if (!entry) continue;
        mezidBabRanges.forEach(range => {
            let hasNoun = false;
            for (let i = range.nounStart; i <= range.nounEnd; i++) {
                if (entry[i]) { hasNoun = true; break; }
            }
            if (hasNoun) {
                for (let i = range.verbStart; i <= range.verbEnd; i++) {
                    if (!entry[i]) {
                        entry[i] = { base: { arText: "" }, autoGenerated: true };
                    }
                }
            }
        });
    }
})();

// --- KELİME DETAY MODALI ---

function getMuttasilZamirleri(baseWord) {
    let suffixHu = "هُ"; let suffixHuma = "هُمَا"; let suffixHum = "هُمْ";
    let suffixHa = "هَا"; let suffixHumaF = "هُمَا"; let suffixHunne = "هُنَّ";
    let suffixKe = "كَ"; let suffixKuma = "كُمَا"; let suffixKum = "كُمْ";
    let suffixKi = "كِ"; let suffixKumaF = "كُمَا"; let suffixKunne = "كُنَّ";
    let suffixNi = "ي"; let suffixNa = "نَا";

    let base = baseWord.replace(/[‌‍﻿]/g, '').trim();
    
    // Exception Rules
    if (base === "لِ") {
        base = "لَ";
        suffixNi = "ي";
    } else if (base === "بِ") {
        suffixHu = "هِ"; suffixHuma = "هِمَا"; suffixHum = "هِمْ"; suffixHunne = "هِنَّ";
    } else if (base.endsWith("ى") || base.endsWith("َى")) {
        base = base.replace(/َى$/, "َيْ").replace(/ى$/, "يْ");
        suffixHu = "هِ"; suffixHuma = "هِمَا"; suffixHum = "هِمْ"; suffixHunne = "هِنَّ";
    } else if (base.endsWith("ي") || base.endsWith("ِي")) {
        suffixHu = "هِ"; suffixHuma = "هِمَا"; suffixHum = "هِمْ"; suffixHunne = "هِنَّ";
    } else if (base === "مِنْ" || base === "عَنْ" || base === "إِنَّ" || base === "أَنَّ" || base === "لِأَنَّ" || base === "لَكِنَّ") {
        if (base === "مِنْ" || base === "عَنْ") suffixNi = "ِّي";
        else suffixNi = "ِي";
    }
    
    let p1sg = base + suffixNi;
    if (baseWord === "لِ") p1sg = "لِي";
    else if (base === "لِأَنَّ") p1sg = "لِأَنَّنِي"; 
    else if (base === "لَكِنَّ") p1sg = "لَكِنَّنِي"; 
    else if (baseWord === "مِنْ") p1sg = "مِنِّي";
    else if (baseWord === "عَنْ") p1sg = "عَنِّي";
    
    // Fix for words ending in Alif Maqsura or Ya (e.g. في, على, إلى) for 1SG
    p1sg = p1sg.replace(/يْي$/, "يَّ").replace(/ِيي$/, "ِيَّ").replace(/يِي$/, "يَّ").replace(/يي$/, "يَّ");
    
    return [
        {m: base + suffixHu, f: base + suffixHa}, // 3SG
        {m: base + suffixHuma, f: base + suffixHumaF}, // 3DU
        {m: base + suffixHum, f: base + suffixHunne}, // 3PL
        {m: base + suffixKe, f: base + suffixKi}, // 2SG
        {m: base + suffixKuma, f: base + suffixKumaF}, // 2DU
        {m: base + suffixKum, f: base + suffixKunne}, // 2PL
        {m: p1sg, f: p1sg}, // 1SG
        {m: base + suffixNa, f: base + suffixNa} // 1PL
    ];
}

function renderZamirCekimTable(baseWord) {
    let zamirler = getMuttasilZamirleri(baseWord);
    let html = `
    <div style="margin-top: 30px; background: #ffffff; border-radius: 15px; border: 1px solid rgba(0,0,0,0.05); padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); direction: rtl;">
        <div style="color: #2980b9; font-size: 1.6rem; margin-bottom: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;"><i class="fas fa-table"></i> Zamir Çekim Tablosu</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            <div style="background: #ffffff; padding: 10px; border-radius: 10px; color: #555; border: 1px solid rgba(0,0,0,0.05); font-weight: bold;">Tekil (Müfred)</div>
            <div style="background: #ffffff; padding: 10px; border-radius: 10px; color: #555; border: 1px solid rgba(0,0,0,0.05); font-weight: bold;">İkil (Müsenna)</div>
            <div style="background: #ffffff; padding: 10px; border-radius: 10px; color: #555; border: 1px solid rgba(0,0,0,0.05); font-weight: bold;">Çoğul (Cemi')</div>
            
            <!-- 3. Şahıs Eril -->
            <div style="font-family: 'Arakom', sans-serif; font-size: 3.5rem; background: rgba(52, 152, 219, 0.15); border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 10px; padding: 15px; display: flex; align-items: center; justify-content: center; position: relative;">
                <span style="position: absolute; top: 5px; left: 5px; font-family: Arial; font-size: 0.9rem; color: #3498db; opacity: 0.7;">O (E)</span>
                ${zamirler[0].m}
            </div>
            <div style="font-family: 'Arakom', sans-serif; font-size: 3.5rem; background: rgba(52, 152, 219, 0.15); border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 10px; padding: 15px; display: flex; align-items: center; justify-content: center; position: relative;">
                <span style="position: absolute; top: 5px; left: 5px; font-family: Arial; font-size: 0.9rem; color: #3498db; opacity: 0.7;">O İkisi (E)</span>
                ${zamirler[1].m}
            </div>
            <div style="font-family: 'Arakom', sans-serif; font-size: 3.5rem; background: rgba(52, 152, 219, 0.15); border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 10px; padding: 15px; display: flex; align-items: center; justify-content: center; position: relative;">
                <span style="position: absolute; top: 5px; left: 5px; font-family: Arial; font-size: 0.9rem; color: #3498db; opacity: 0.7;">Onlar (E)</span>
                ${zamirler[2].m}
            </div>
            
            <!-- 3. Şahıs Dişil -->
            <div style="font-family: 'Arakom', sans-serif; font-size: 3.5rem; background: rgba(231, 76, 60, 0.15); border: 1px solid rgba(231, 76, 60, 0.3); border-radius: 10px; padding: 15px; display: flex; align-items: center; justify-content: center; position: relative;">
                <span style="position: absolute; top: 5px; left: 5px; font-family: Arial; font-size: 0.9rem; color: #c0392b; opacity: 0.7;">O (D)</span>
                ${zamirler[0].f}
            </div>
            <div style="font-family: 'Arakom', sans-serif; font-size: 3.5rem; background: rgba(231, 76, 60, 0.15); border: 1px solid rgba(231, 76, 60, 0.3); border-radius: 10px; padding: 15px; display: flex; align-items: center; justify-content: center; position: relative;">
                <span style="position: absolute; top: 5px; left: 5px; font-family: Arial; font-size: 0.9rem; color: #c0392b; opacity: 0.7;">O İkisi (D)</span>
                ${zamirler[1].f}
            </div>
            <div style="font-family: 'Arakom', sans-serif; font-size: 3.5rem; background: rgba(231, 76, 60, 0.15); border: 1px solid rgba(231, 76, 60, 0.3); border-radius: 10px; padding: 15px; display: flex; align-items: center; justify-content: center; position: relative;">
                <span style="position: absolute; top: 5px; left: 5px; font-family: Arial; font-size: 0.9rem; color: #c0392b; opacity: 0.7;">Onlar (D)</span>
                ${zamirler[2].f}
            </div>
            
            <!-- 2. Şahıs Eril -->
            <div style="font-family: 'Arakom', sans-serif; font-size: 3.5rem; background: rgba(46, 204, 113, 0.15); border: 1px solid rgba(46, 204, 113, 0.3); border-radius: 10px; padding: 15px; display: flex; align-items: center; justify-content: center; position: relative;">
                <span style="position: absolute; top: 5px; left: 5px; font-family: Arial; font-size: 0.9rem; color: #2ecc71; opacity: 0.7;">Sen (E)</span>
                ${zamirler[3].m}
            </div>
            <div style="font-family: 'Arakom', sans-serif; font-size: 3.5rem; background: rgba(46, 204, 113, 0.15); border: 1px solid rgba(46, 204, 113, 0.3); border-radius: 10px; padding: 15px; display: flex; align-items: center; justify-content: center; position: relative;">
                <span style="position: absolute; top: 5px; left: 5px; font-family: Arial; font-size: 0.9rem; color: #2ecc71; opacity: 0.7;">Siz İkiniz (E)</span>
                ${zamirler[4].m}
            </div>
            <div style="font-family: 'Arakom', sans-serif; font-size: 3.5rem; background: rgba(46, 204, 113, 0.15); border: 1px solid rgba(46, 204, 113, 0.3); border-radius: 10px; padding: 15px; display: flex; align-items: center; justify-content: center; position: relative;">
                <span style="position: absolute; top: 5px; left: 5px; font-family: Arial; font-size: 0.9rem; color: #2ecc71; opacity: 0.7;">Siz (E)</span>
                ${zamirler[5].m}
            </div>
            
            <!-- 2. Şahıs Dişil -->
            <div style="font-family: 'Arakom', sans-serif; font-size: 3.5rem; background: rgba(155, 89, 182, 0.15); border: 1px solid rgba(155, 89, 182, 0.3); border-radius: 10px; padding: 15px; display: flex; align-items: center; justify-content: center; position: relative;">
                <span style="position: absolute; top: 5px; left: 5px; font-family: Arial; font-size: 0.9rem; color: #9b59b6; opacity: 0.7;">Sen (D)</span>
                ${zamirler[3].f}
            </div>
            <div style="font-family: 'Arakom', sans-serif; font-size: 3.5rem; background: rgba(155, 89, 182, 0.15); border: 1px solid rgba(155, 89, 182, 0.3); border-radius: 10px; padding: 15px; display: flex; align-items: center; justify-content: center; position: relative;">
                <span style="position: absolute; top: 5px; left: 5px; font-family: Arial; font-size: 0.9rem; color: #9b59b6; opacity: 0.7;">Siz İkiniz (D)</span>
                ${zamirler[4].f}
            </div>
            <div style="font-family: 'Arakom', sans-serif; font-size: 3.5rem; background: rgba(155, 89, 182, 0.15); border: 1px solid rgba(155, 89, 182, 0.3); border-radius: 10px; padding: 15px; display: flex; align-items: center; justify-content: center; position: relative;">
                <span style="position: absolute; top: 5px; left: 5px; font-family: Arial; font-size: 0.9rem; color: #9b59b6; opacity: 0.7;">Siz (D)</span>
                ${zamirler[5].f}
            </div>
            
            <!-- 1. Şahıs (Ben / Biz) -->
            <div style="font-family: 'Arakom', sans-serif; font-size: 3.5rem; background: rgba(241, 196, 15, 0.15); border: 1px solid rgba(241, 196, 15, 0.3); border-radius: 10px; padding: 15px; display: flex; align-items: center; justify-content: center; position: relative;">
                <span style="position: absolute; top: 5px; left: 5px; font-family: Arial; font-size: 0.9rem; color: #2980b9; opacity: 0.7;">Ben</span>
                ${zamirler[6].m}
            </div>
            <div style="grid-column: span 2; font-family: 'Arakom', sans-serif; font-size: 3.5rem; background: rgba(241, 196, 15, 0.15); border: 1px solid rgba(241, 196, 15, 0.3); border-radius: 10px; padding: 15px; display: flex; align-items: center; justify-content: center; position: relative;">
                <span style="position: absolute; top: 5px; left: 5px; font-family: Arial; font-size: 0.9rem; color: #2980b9; opacity: 0.7;">Biz</span>
                ${zamirler[7].m}
            </div>
        </div>
    </div>
    `;
    return html;
}


window.showWordDetails = function(rootKey, kalipKeyStr, exactArText, exactTrText) {
    try {
        _showWordDetailsImpl(rootKey, kalipKeyStr, exactArText, exactTrText);
    } catch(e) {
        let modal = document.getElementById('wordDetailModal') || document.getElementById('word-details-modal');
        if (modal) {
            modal.innerHTML = '<div style="background:white; padding:20px; color:red; font-size:18px;">ERROR: ' + e.message + '<br>' + e.stack + '</div>';
            modal.style.display = 'block';
            document.getElementById('word-details-overlay').style.display = 'block';
        } else {
            alert('Error: ' + e.message);
        }
    }
}

function _showWordDetailsImpl(rootKey, kalipKeyStr, exactArText, exactTrText) {
    // if (typeof closeKeyboard === 'function') closeKeyboard();

    const kalipKey = parseInt(kalipKeyStr, 10);
    
    let rootData = null;
    let isFromDictionary = false;
    
    if (typeof veriKaliplarTablosu !== 'undefined' && veriKaliplarTablosu[rootKey]) {
        rootData = veriKaliplarTablosu[rootKey];
    } else if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[rootKey]) {
        rootData = sozlukVerileri[rootKey];
        isFromDictionary = true;
    }
    
    if (!rootData) return;
    
    let modal = document.getElementById('word-details-modal');
    let overlay = document.getElementById('word-details-overlay');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'word-details-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.background = '#ffffff';
        modal.style.color = '#333333';
        modal.style.padding = '20px';
        modal.style.borderRadius = '15px';
        modal.style.zIndex = '99999999';
        modal.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
        modal.style.width = '90%';
        modal.style.maxWidth = '1000px';
        modal.style.maxHeight = '90vh';
        modal.style.overflowY = 'auto';
        modal.style.textAlign = 'center';
        modal.style.fontFamily = "'Arakom', 'Arial', sans-serif";
        document.body.appendChild(modal);
        
        overlay = document.createElement('div');
        overlay.id = 'word-details-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '99999998';
        overlay.onclick = function() {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        };
        document.getElementById("marathon-overlay").appendChild(overlay);

    }
    
    let htmlContent = "";
    
    // Header with Title and SVG Button
    const cleanTrText = exactTrText ? exactTrText.replace(/\./g, "").trim() : "";
    // İsimler/Sözlük modunda başlık gizlenecek (zaten kartta var)
    let isDictOnlyTitle = false;
    let rData = sozlukVerileri ? sozlukVerileri[rootKey] : null;
    if (rData && rData.isDictOnly) {
        isDictOnlyTitle = true;
    }
    
    // Early computation of actualTip for header category button
    let earlyActualTip = (rData && rData.tip) ? rData.tip : null;
    if (earlyActualTip === "sayi" && rootKey.includes("Sıra:")) earlyActualTip = "sirasayi";
    let kalipKeyNum = parseInt(kalipKeyStr);
    if (kalipKeyNum === 49) earlyActualTip = "tasgir";
    if (kalipKeyNum === 50 || kalipKeyNum === 51) earlyActualTip = "tafdil";
    // Check if the specific item has a tip
    let itemClickedEarly = rData ? (rData[kalipKeyStr] || rData[kalipKeyNum]) : null;
    if (itemClickedEarly && itemClickedEarly.tip) earlyActualTip = itemClickedEarly.tip;
    
    let displayTitle = "";
    let earlyTipList = Array.isArray(earlyActualTip) ? earlyActualTip : [earlyActualTip];
    
    earlyTipList.forEach(tip => {
        if (tip && typeof thematicCategoriesData !== 'undefined' && thematicCategoriesData[tip]) {
            let trT = thematicCategoriesData[tip].title.toLocaleUpperCase('tr-TR');
            displayTitle += `<div onclick="document.getElementById('word-details-overlay').style.display='none'; document.getElementById('word-details-modal').style.display='none'; openCategoryFromModal('${tip}')" style="display:inline-flex; align-items:center; background: rgba(255,255,255,0.8); padding: 8px 20px; margin: 0 5px; border-radius: 50px; border: 1px solid rgba(189, 195, 199, 0.5); box-shadow: 0 2px 5px rgba(0,0,0,0.05); cursor:pointer; transition: 0.3s;" onmouseover="this.style.transform='scale(1.05)';" onmouseout="this.style.transform='scale(1)';" title="Bu listeyi aç"><span style="color:#333; font-size:1.3rem; font-weight: bold;  letter-spacing:1px;" dir="ltr">${thematicCategoriesData[tip].icon} ${trT} <i class="fas fa-external-link-alt" style="font-size: 1.0rem; margin-left: 5px;"></i></span></div>`;
        }
    });

    if (!displayTitle && exactArText) {
        displayTitle = `
        <div style="display:inline-flex; align-items:center; background: rgba(255,255,255,0.8); padding: 10px 40px; border-radius: 50px; border: 1px solid rgba(189, 195, 199, 0.5); box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <span style="font-size:${window.isAtlasFullscreen ? "clamp(2.8rem, 5.5vh, 5.5rem)" : "clamp(3.5rem, 5vw, 6rem)"}; color:#1a1a1a; font-family: 'Arakom', sans-serif; text-shadow: 0 1px 3px rgba(0,0,0,0.1);">${exactArText}</span>
        </div>`;
    }
    
    htmlContent += `<div style="display:flex; justify-content:center; align-items:center; border-bottom:${displayTitle ? '1px solid rgba(255,255,255,0.2)' : 'none'}; padding-bottom:${displayTitle ? '15px' : '0'}; margin-bottom:20px; position:relative; min-height:50px; width:100%; box-sizing:border-box;">`;
    
    const compactRoot = rootKey.replace(/\s+/g, '');
    // LEFT CORNER: Vezin Tablosu Button
    let isRootValidForTable = false;
    if ((compactRoot.length === 3 || compactRoot.length === 4) && typeof sozlukVerileri !== 'undefined' && sozlukVerileri[compactRoot]) {
        if (!sozlukVerileri[compactRoot].isDictOnly) {
            isRootValidForTable = true;
        }
    }
    
    if (isRootValidForTable) {
        htmlContent += `  <div style="position:absolute; left:15px; cursor:pointer; background:#5cb85c; color: white; width:50px; height:50px; border-radius:50%; font-size:2.0rem; display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index:10;" 
                            onclick="openFastListFromWordDetails('${compactRoot}');" title="Hızlı Liste">
                            <i class="fas fa-sitemap" style="transform: rotate(180deg);"></i>
                          </div>`;
    }
    
    // CENTER: Title
    if (displayTitle) {
        htmlContent += `  <div style="margin:0; text-align:center; z-index:5;" dir="rtl">${displayTitle}</div>`;
    }
    

                      
    // RIGHT CORNER: Close Button
    htmlContent += `  <div style="position:absolute; right:15px; cursor:pointer; background:#e74c3c; color: white; width:50px; height:50px; border-radius:50%; font-size:2.0rem; display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index:10;" 
                        onclick="document.getElementById('word-details-overlay').style.display='none'; document.getElementById('word-details-modal').style.display='none';" title="Kapat">
                        <i class="fas fa-times"></i>
                      </div>`;
                      
    htmlContent += `</div>`;


    // Eski sozlukVerileri Mantığı (Artık tüm kelimeler buradan geçiyor)
        let maziId = -1, muzariId = -1, emirId = -1, masdarId = -1;
        
        if (kalipKey >= 1 && kalipKey <= 30) {
            const keys = Object.keys(rootData).map(Number);
            if ([8, 9, 10, 17, 26, 23, 24].includes(kalipKey) || kalipKey == 8 || kalipKey == 9 || kalipKey == 10) {
                maziId = keys.includes(8) ? 8 : -1;
                muzariId = keys.includes(9) ? 9 : -1;
                emirId = keys.includes(10) ? 10 : -1;
            } else if ([11, 12, 13, 27].includes(kalipKey)) {
                maziId = keys.includes(11) ? 11 : -1;
                muzariId = keys.includes(12) ? 12 : -1;
                emirId = keys.includes(13) ? 13 : -1;
            } else if ([14, 15, 16, 28].includes(kalipKey)) {
                maziId = keys.includes(14) ? 14 : -1;
                muzariId = keys.includes(15) ? 15 : -1;
                emirId = keys.includes(16) ? 16 : -1;
            } else {
                maziId = keys.includes(1) ? 1 : -1;
                muzariId = keys.includes(2) ? 2 : (keys.includes(4) ? 4 : (keys.includes(6) ? 6 : -1));
                emirId = keys.includes(3) ? 3 : (keys.includes(5) ? 5 : (keys.includes(7) ? 7 : -1));
            }
        }
        else if (kalipKey >= 52 && kalipKey <= 55) { maziId = 52; muzariId = 53; emirId = 54; }
        else if (kalipKey >= 58 && kalipKey <= 63) { maziId = 58; muzariId = 59; emirId = 60; }
        else if (kalipKey >= 64 && kalipKey <= 69) { maziId = 64; muzariId = 65; emirId = 66; }
        else if (kalipKey >= 71 && kalipKey <= 74) { maziId = 71; muzariId = 72; emirId = 73; }
        else if (kalipKey >= 77 && kalipKey <= 82) { maziId = 77; muzariId = 78; emirId = 79; }
        else if (kalipKey >= 88 && kalipKey <= 91) { maziId = 88; muzariId = 89; emirId = 90; }
        else if (kalipKey >= 94 && kalipKey <= 97) { maziId = 94; muzariId = 95; emirId = 96; }
        else if (kalipKey >= 100 && kalipKey <= 105) { maziId = 100; muzariId = 101; emirId = 102; }
        
        let isVerb = (maziId !== -1 && (kalipKey <= 16 || [52,53,54, 58,59,60, 64,65,66, 71,72,73, 77,78,79, 88,89,90, 94,95,96, 100,101,102].includes(kalipKey)));
        
        let itemTekil, itemCogul;
        if (isVerb) {
            let muhurHtml = `<div style="position:absolute; top:-15px; left:15px; background-color:#27ae60; color:white; padding:5px 20px; border-radius:20px; font-weight:bold; font-size:1.3rem; box-shadow:0 4px 10px rgba(0,0,0,0.4); border:2px solid rgba(255,255,255,0.8); transform:rotate(-10deg); z-index:20; font-family: 'Arakom', sans-serif; text-shadow:0 1px 2px rgba(0,0,0,0.5); letter-spacing:1px;">FİİL</div>`;
            let rootDisplay = `<div style="position:absolute; top:-15px; right:15px; background-color:#e74c3c; color:white; padding:5px 15px; border-radius:20px; font-weight:bold; font-size:1.1rem; box-shadow:0 4px 10px rgba(0,0,0,0.4); border:2px solid rgba(255,255,255,0.8); transform:rotate(5deg); z-index:20; font-family: 'Inter', sans-serif; text-shadow:0 1px 1px rgba(0,0,0,0.3);">Kök: ${rootKey}</div>`;
            htmlContent += `<div style="position:relative; width:100%;">`;
            htmlContent += muhurHtml;
            htmlContent += rootDisplay;
            const verbCards = [
                { id: maziId, label: "Mazi", color: "#f39c12" },
                { id: muzariId, label: "Muzari", color: "#3498db" },
                { id: emirId, label: "Emir", color: "#e74c3c" }
            ];
            // YENI TASARIM (mobil): her kip AYRI KUTU, dikey dizili. Kutu: baslik ustte (altinda cizgi),
            // altindaki satirda solda ANLAM - ortada EMOJI - sagda ARAPCA.
            let _verbBoxes = '';
            verbCards.forEach((card) => {
                let rData = rootData[card.id] || { base: {} };
                let emoji = (rData.base && rData.base.emoji) ? rData.base.emoji : '';
                let trText = (rData.base && rData.base.trText) ? rData.base.trText : '';
                let arText = (rData.base && rData.base.arText) ? rData.base.arText : "";
                if (!arText && typeof generateTuremis === "function") {
                    arText = generateTuremis(rootKey, card.id);
                }
                _verbBoxes += `
                    <div style="width:100%; box-sizing:border-box; background:#ffffff; padding:12px 14px; border-radius:14px; border:1px solid rgba(0,0,0,0.05); box-shadow:0 3px 12px rgba(0,0,0,0.05);">
                        <div style="color:${card.color}; font-weight:bold; font-size:1.02rem; padding-bottom:6px; border-bottom:2px solid ${card.color}; margin-bottom:10px; letter-spacing:0.3px; text-align:center;" dir="ltr">${card.label}</div>
                        <div style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:10px; width:100%;">
                            <div style="text-align:left; color:#576574; font-weight:600; font-size:0.82rem; line-height:1.3; min-width:0; overflow-wrap:anywhere;" dir="ltr">${trText}</div>
                            <div style="text-align:center; font-size:1.75rem; line-height:1;">${emoji}</div>
                            <div style="text-align:right; font-family:'Arakom', sans-serif; font-size:2rem; color:#1a1a1a; line-height:1.35; min-width:0;">${arText}</div>
                        </div>
                    </div>`;
            });
            htmlContent += `
                <div style="display:flex; flex-direction:column; gap:12px; margin-top:34px; width:100%;">
                    ${_verbBoxes}
                </div>`;
            htmlContent += `</div>`;
        } else {
            let itemClicked = rootData[kalipKeyStr] || rootData[kalipKey];
            if (!itemClicked) itemClicked = { base: { emoji: "", arText: exactArText, trText: exactTrText } };
            


            if (kalipKeyStr === "tekil" || kalipKeyStr === "cogul") {
                itemTekil = rootData["tekil"];
                itemCogul = rootData["cogul"];
                /* SÖZLÜKTE İKİ YAZIM VAR: uzun yazımda çoğul bir nesnedir
                   (cogul: { base: {...} }), kısa yazımda doğrudan metindir
                   (cogul: "خُدُود", cogulTr: "Yanaklar"). Kısa yazımda gelen
                   metni burada nesneye çeviriyoruz; yoksa aşağıda .base
                   okunurken patlıyor ve perdede ERROR yazıyordu (خَدّ). */
                if (typeof itemTekil === 'string') {
                    itemTekil = { base: { emoji: rootData.emoji || "", arText: itemTekil, trText: rootData.tekilTr || "" } };
                }
                if (typeof itemCogul === 'string') {
                    itemCogul = { base: {
                        emoji: (itemTekil && itemTekil.base && itemTekil.base.emoji) || rootData.emoji || "",
                        arText: itemCogul,
                        trText: rootData.cogulTr || ""
                    } };
                }
            } else if (itemClicked && itemClicked.kuralliCogul) {
                itemTekil = itemClicked;
                let type = itemClicked.kuralliCogul;
                let pluralAr = itemTekil.base.arText;
                
                if (type === "disil") {
                    if (pluralAr.endsWith('َة')) pluralAr = pluralAr.slice(0, -2) + 'َات';
                    else if (pluralAr.endsWith('ة')) pluralAr = pluralAr.slice(0, -1) + 'َات';
                    else pluralAr += 'َات';
                } else if (type === "eril") {
                    pluralAr += 'ُونَ';
                }
                
                itemCogul = {
                    isDynamicPlural: true,
                    pluralType: type,
                    base: {
                        emoji: "👥",
                        arText: pluralAr,
                        trText: itemTekil.base.trText + " (Çoğullar)"
                    }
                };
            } else if (itemClicked && itemClicked.kuralliCogul) {
                itemTekil = itemClicked;
                let type = itemClicked.kuralliCogul;
                let pluralAr = itemTekil.base.arText;
                
                if (type === "disil") {
                    if (pluralAr.endsWith('َة')) pluralAr = pluralAr.slice(0, -2) + 'َات';
                    else if (pluralAr.endsWith('ة')) pluralAr = pluralAr.slice(0, -1) + 'َات';
                    else pluralAr += 'َات';
                } else if (type === "eril") {
                    pluralAr += 'ُونَ';
                }
                
                itemCogul = {
                    isDynamicPlural: true,
                    pluralType: type,
                    base: {
                        emoji: "👥",
                        arText: pluralAr,
                        trText: itemTekil.base.trText + " (Çoğullar)"
                    }
                };
            } else if (itemClicked && itemClicked.cogulId) {
                itemTekil = itemClicked;
                let cogulIds = itemClicked.cogulId.toString().split(',');
                if (cogulIds.length > 1) {
                    let arTexts = [];
                    let trTexts = [];
                    cogulIds.forEach(id => {
                        let c = rootData[id.trim()];
                        if (c && c.base) {
                            arTexts.push(c.base.arText);
                            trTexts.push(c.base.trText.replace(/\.$/, '')); // remove trailing dot for cleaner combination
                        }
                    });
                    itemCogul = {
                        base: {
                            arText: arTexts.join(' - '),
                            trText: trTexts.join(' / ') + '.',
                            emoji: rootData[cogulIds[0].trim()] ? rootData[cogulIds[0].trim()].base.emoji : ''
                        }
                    };
                } else {
                    itemCogul = rootData[itemClicked.cogulId.toString()];
                }
            } else if (itemClicked && itemClicked.tekilId) {
                itemTekil = rootData[itemClicked.tekilId.toString()];
                itemCogul = itemClicked;
            } else {
                // Sadece kendisini (tekil olarak) göster
                itemTekil = itemClicked;
                if (itemClicked.base && itemClicked.base.cogul) {
                    itemCogul = { base: { emoji: "", arText: itemClicked.base.cogul, trText: itemClicked.base.cogulTr || "" } };
                } else {
                    itemCogul = null;
                }
            }
            
            // If itemTekil is not found due to math, fallback to itemClicked
            if (!itemTekil && !itemCogul) {
                itemTekil = itemClicked;
                // Check if it has an old inline cogul
                if (itemClicked.base && itemClicked.base.cogul) {
                    itemCogul = { base: { emoji: "", arText: itemClicked.base.cogul, trText: itemClicked.base.cogulTr || "" } };
                }
            }
            
            let tipToUse = (itemTekil && itemTekil.tip) || rootData.tip;
            let tipList = Array.isArray(tipToUse) ? tipToUse : [tipToUse];
            
                        let muhurHtml = "";
            if (tipList && tipList.length > 0) {
                                let anaTur = "İSİM";
                let anaRenk = "#2980b9"; // Mavi
                if (tipList.some(t => ['kalip'].includes(t))) {
                    anaTur = "İFADE";
                    anaRenk = "#8e44ad"; // Mor
                } else if (tipList.some(t => ['zaman', 'zarf'].includes(t))) {
                    anaTur = "ZARF";
                    anaRenk = "#16a085"; // Turkuaz
                } else if (tipList.some(t => ['harficer', 'baglac', 'soru', 'olumsuz', 'sart'].includes(t))) {
                    anaTur = "EDAT";
                    anaRenk = "#d35400"; // Turuncu
                }
                muhurHtml = `<div style="position:absolute; top:-15px; left:15px; background-color:${anaRenk}; color:white; padding:5px 20px; border-radius:20px; font-weight:bold; font-size:1.3rem; box-shadow:0 4px 10px rgba(0,0,0,0.4); border:2px solid rgba(255,255,255,0.8); transform:rotate(-10deg); z-index:20; font-family: 'Arakom', sans-serif; text-shadow:0 1px 2px rgba(0,0,0,0.5); letter-spacing:1px;">${anaTur}</div>`;
            }
            htmlContent += `<div style="position:relative; width:100%;">`;
            htmlContent += muhurHtml;
            htmlContent += `<div style="display:flex; justify-content:center; align-items:center; width:100%; text-align:center;">`;
            /* Kalkan: veri hangi biçimde gelirse gelsin perde ERROR yazmasın,
               olmayan alan boş geçilsin. */
            let tekilAr = (itemTekil && itemTekil.base) ? (itemTekil.base.arText || '') : '';
            let cogulAr = (itemCogul && itemCogul.base) ? (itemCogul.base.arText || '') : '';
            let tekilTr = (itemTekil && itemTekil.base && itemTekil.base.trText) ? itemTekil.base.trText : '';
            let cogulTr = (itemCogul && itemCogul.base && itemCogul.base.trText) ? itemCogul.base.trText : '';
            let allOrnekler = [];
            if (itemTekil && itemTekil.base && itemTekil.base.ornek) {
                allOrnekler = allOrnekler.concat(Array.isArray(itemTekil.base.ornek) ? itemTekil.base.ornek : [itemTekil.base.ornek]);
            }
            if (itemCogul && itemCogul.base && itemCogul.base.ornek && itemCogul !== itemTekil) {
                allOrnekler = allOrnekler.concat(Array.isArray(itemCogul.base.ornek) ? itemCogul.base.ornek : [itemCogul.base.ornek]);
            }

            let ornekHtml = '';
            if (allOrnekler.length > 0) {
                ornekHtml += `<div style="margin-top:25px; padding:15px; background:#ffffff; border-radius:10px; border:1px solid rgba(0,0,0,0.05); box-shadow: 0 2px 10px rgba(0,0,0,0.02);">`;
                allOrnekler.forEach((ornek, index) => {
                    if (ornek.ar && ornek.tr) {
                        let isLast = index === allOrnekler.length - 1;
                        let borderStyle = isLast ? "" : "border-bottom:1px solid rgba(189, 195, 199, 0.3); margin-bottom:15px; padding-bottom:10px;";
                        ornekHtml += `<div style="${borderStyle}">
                                        <div style="font-family:'Arakom', sans-serif; font-size:2rem; color:#d35400; margin-bottom:10px;" dir="rtl">${ornek.ar}</div>
                                        <div style="color:#7f8c8d; font-size:${window.isAtlasFullscreen ? "clamp(1.2rem, 2vh, 2rem)" : "clamp(1.5rem, 2vw, 2.5rem)"}; font-weight:500;" dir="ltr">${ornek.tr}</div>
                                      </div>`;
                    }
                });
                ornekHtml += `</div>`;
                if (!ornekHtml.includes('dir="rtl"')) ornekHtml = '';
            }
            let emoji = (itemTekil && itemTekil.base.emoji) ? itemTekil.base.emoji : ((itemCogul && itemCogul.base.emoji) ? itemCogul.base.emoji : '');
            
            let tip = (itemTekil && itemTekil.tip) || rootData.tip;
            let isRenk = tipList.includes("renk");
            let isSayi = tipList.includes("sayi");
            let actualTip = tipList[0] || "isim"; // Varsayılan tip ilk eleman olsun
            if (tipList.includes("sayi") && rootKey.includes("Sıra:")) actualTip = "sirasayi";
            if (kalipKey === 49) actualTip = "tasgir";
            if (kalipKey === 50 || kalipKey === 51) actualTip = "tafdil";
            
            let titleText = "";
            if (actualTip && typeof thematicCategoriesData !== 'undefined' && thematicCategoriesData[actualTip]) {
                let trT = thematicCategoriesData[actualTip].title.toLocaleUpperCase('tr-TR');
                titleText = thematicCategoriesData[actualTip].icon + " <span style='font-size:2.0rem;'>" + trT + "</span>";
            }
            
            let secondColAr = "";
            let secondColTr = "";
            let secondColLabel = "";
            let separator = "ج";
            let firstColLabel = "";
            
            if ((isRenk || isSayi) && itemTekil && itemTekil.base.muennes) {
                secondColAr = itemTekil.base.muennes;
                secondColLabel = "Müennes (Dişil)";
                firstColLabel = "Müzekker (Eril)";
                separator = "♀/♂";
            } else if (cogulAr) {
                secondColAr = cogulAr;
                secondColTr = cogulTr;
                firstColLabel = "Tekil (Müfred)";
                secondColLabel = "Çoğul (Cem')";
            }
            
            let titleHtml = '';

            htmlContent += `
            <div style="width:100%; text-align:center; background:#ffffff; padding:40px 20px; border-radius:15px; border:1px solid rgba(0,0,0,0.05); box-shadow: 0 8px 30px rgba(0,0,0,0.1);">
                ${emoji ? `<div style="font-size:5rem; margin-bottom:15px;">${emoji}</div>` : ''}
                ${titleHtml}
                
                <div style="display:flex; justify-content:center; align-items:flex-start; gap:25px; flex-wrap:wrap; direction:rtl;">
                    ${tekilAr ? `
                    <div style="display:flex; flex-direction:column; align-items:center; max-width:300px;">
                        ${firstColLabel ? `<div style="background:rgba(0, 0, 0, 0.05); color:#333; padding:6px 18px; border-radius:20px; border:1px solid rgba(0, 0, 0, 0.1); font-size:1.1rem; margin-bottom:15px; font-weight:bold; letter-spacing:1px;  box-shadow:0 2px 5px rgba(0,0,0,0.05);">${firstColLabel.toLocaleUpperCase("tr-TR")}</div>` : ''}
                        <span style="font-family:'Arakom', sans-serif; font-size:clamp(2.5rem, 4.5vw, 5.5rem); color:#1a1a1a; text-shadow:0 1px 3px rgba(0,0,0,0.1); line-height: 1.2;">${tekilAr}</span>
                        ${tekilTr ? `<span style="color:#576574; font-size: 1.6rem; margin-top:10px; text-align:center; line-height: 1.4; font-weight:bold; color: #555;" dir="ltr">${tekilTr}</span>` : ''}
                    </div>` : ''}
                    
                    ${(tekilAr && secondColAr) ? `
                    <div style="display:flex; align-items:center; justify-content:center; margin-top: 45px;">
                        <span style="font-family:'Arakom', sans-serif; font-size:clamp(2.5rem, 4.5vw, 5.5rem); color:#e1b12c; margin: 0 15px; opacity:0.9; line-height: 1.2;">${separator}</span>
                    </div>` : ''}
                    
                    ${secondColAr ? `
                    <div style="display:flex; flex-direction:column; align-items:center; max-width:300px;">
                        ${secondColLabel ? `<div style="background:rgba(46,204,113,0.15); color:#27ae60; padding:6px 18px; border-radius:20px; border:1px solid rgba(46,204,113,0.3); font-size:1.1rem; margin-bottom:15px; font-weight:bold; letter-spacing:1px;  box-shadow:0 2px 5px rgba(0,0,0,0.05);">${secondColLabel.toLocaleUpperCase("tr-TR")}</div>` : ((isRenk || isSayi) ? `<div style="color:#c0392b; font-size:1.1rem; margin-bottom:10px; font-weight:bold;">${secondColTr}</div>` : '')}
                        <span style="font-family:'Arakom', sans-serif; font-size:clamp(2.5rem, 4.5vw, 5.5rem); color:#1a1a1a; text-shadow:0 1px 3px rgba(0,0,0,0.1); line-height: 1.2;">${secondColAr}</span>
                        ${(!(isRenk || isSayi) && secondColTr) ? `<span style="color:#576574; font-size: 1.6rem; margin-top:10px; text-align:center; line-height: 1.4; font-weight:bold; color: #555;" dir="ltr">${secondColTr}</span>` : ''}
                    </div>` : ''}
                </div>
                ${ornekHtml}
            </div>`;
            htmlContent += `</div></div>`;
        }
    
    // --- Zamir Çekimi Eklemesi ---
    if (rootData && rootData.hasZamirCekimi) {
        let zBase = rootData.zamirBase || (itemTekil && itemTekil.base.arText) || exactArText;
        if (zBase) {
            // Eğer "عِنْدَ / لَدَى" gibi çoklu yapı varsa parçala ve ilkini al (veya her ikisine de yap)
            let bases = zBase.split("/").map(b => b.trim());
            bases.forEach(b => {
                if (b) {
                    htmlContent += renderZamirCekimTable(b);
                }
            });
        }
    }
    
    modal.innerHTML = htmlContent;
    modal.style.display = 'block';
    overlay.style.display = 'block';
};

// --- SÖZLÜK MODU DEĞİŞKENLERİ VE FONKSİYONLARI ---


window.stripHarakat = function(text) {
    if (!text || typeof text !== "string") return "";
    return text.replace(/[ً-ْٰ]/g, '');
};

// ==================================================================
// YENİ KÖK SEÇİM SİSTEMİ (POPUP KLAVYE + TAHMİN)
// ==================================================================

const PRONOUN_MAP = [
    "Müfred Müzekker Gaib", "Tesniye Müzekker Gaib", "Cemi Müzekker Gaib",
    "Müfred Müennes Gaibe", "Tesniye Müennes Gaibe", "Cemi Müennes Gaibe",
    "Müfred Müzekker Muhatab", "Tesniye Müzekker Muhatab", "Cemi Müzekker Muhatab",
    "Müfred Müennes Muhataba", "Tesniye Müennes Muhataba", "Cemi Müennes Muhataba",
    "Nefs-i Müt. Vahdeh", "Nefs-i Müt. Maal Gayr", "Nefs-i Müt. Maal Gayr"
];

const onemliKokler = ["كتب", "علم", "قدر", "كمل", "ملك","حرم", "سلم", "حكم", "عرف", "رحم"];
const aksamSebaKokleri = ["أمن", "شدد", "أكل", "سأل", "وجد", "قول", "بيع", "دعو", "مشي", "رضي", "وقي", "ضلل"];
const mezidFiilKokleri = ["عدد", "صلي", "سوي", "وصل", "خير", "وضأ", "عون", "وفي", "طوي", "خبر", "نظم", "حقق", "كمل", "شكل"];

const arapcaHarfler = "أ ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" ");
let currentSearchQuery = ""; 

function getRootEmoji(root) {
    if(sozlukVerileri[root]) {
        const keys = Object.keys(sozlukVerileri[root]);
        
        // Önce "sayi" tipine sahip bir kalıp var mı diye kontrol et (Örn: ثلث, ربع)
        for (let i = 0; i < keys.length; i++) {
            let kalip = sozlukVerileri[root][keys[i]];
            if (kalip && kalip.tip === "sayi" && kalip.base && kalip.base.emoji) {
                return kalip.base.emoji;
            }
        }
        
        // Yoksa eskisi gibi ilk geçerli kalıbın emojisini al
        if (keys.length > 0 && sozlukVerileri[root][keys[0]].base && sozlukVerileri[root][keys[0]].base.emoji) {
            return sozlukVerileri[root][keys[0]].base.emoji;
        }
    }
    return "🔹";
}

function renderVerbMenu() {
    // Kökler dosyasındaki eski sözlük verilerini yeni sözlük verileriyle birleştir (Önbellek sorunlarını aşmak için burada)
    if (typeof wordEasterEggs !== 'undefined') {
        Object.assign(sozlukVerileri, wordEasterEggs);
    }
    const importantContainer = document.getElementById("important-roots-list");
    const gridContainer = document.getElementById("letters-grid-container");
    
    if(!importantContainer || !gridContainer) return;

    importantContainer.innerHTML = "";
    gridContainer.innerHTML = "";

    // 1. Önemli Kökler (Manuel sıralama korunur)
    let importantHtml = "";
    onemliKokler.forEach(root => {
        if(sozlukVerileri[root]) importantHtml += createFlatRootItem(root);
    });
    importantContainer.innerHTML = importantHtml;

    // 2. 4 Sütunlu Bağımsız Scroll Sistemi
    const ranges = [
        { title: "أ - ب - ت - ث - ج - ح - خ", start: 0, end: 6 },
        { title: "د - ذ - ر - ز - س - ش", start: 7, end: 12 },
        { title: "ص - ض - ط - ظ - ع - غ - ف - ق", start: 13, end: 20 },
        { title: "ك - ل - م - ن - ه - و - ي", start: 21, end: 27 }
    ];

    const allRoots = Object.keys(sozlukVerileri);
    const rootsByLetter = {};
    arapcaHarfler.forEach(h => rootsByLetter[h] = []);
    let totalRootsCount = 0;
    /* SÖZLÜK-ONLY KÖKLER SAYILMAZ.
       isDictOnly bayrağı iki yerde durabiliyor: kökün KENDİSİNDE ya da
       kökün her bir kalıp girdisinde. İkincisi eskiden gözden kaçıyordu:
       bütün girdileri isDictOnly olan "شيم" gibi bir kök, tam kök gibi
       sayılıyor ve "sistemdeki kök sayısı" rozeti veri_kokler.js'teki
       gerçek sayıdan fazla gösteriyordu. Artık iki hâl de eleniyor. */
    const _yalnizSozluk = (v) => {
        if (!v || typeof v !== 'object') return false;
        if (v.isDictOnly) return true;
        const girdi = Object.keys(v).filter(a => v[a] && typeof v[a] === 'object' && (v[a].base || v[a].tekil));
        return girdi.length > 0 && girdi.every(a => v[a].isDictOnly);
    };
    allRoots.forEach(root => {
        if (_yalnizSozluk(sozlukVerileri[root])) return;
        const firstLetter = root.charAt(0);
        if(rootsByLetter[firstLetter]) {
            rootsByLetter[firstLetter].push(root);
            totalRootsCount++;
        }
    });

    const importantContainerRef = document.getElementById("important-roots-list");
    if (importantContainerRef) {
        let closeBtnHtml = `<div onclick="closeVerbModal()" style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; margin: 0; align-self: center; background: rgba(255, 255, 255, 0.6); border: 2px dashed #e74c3c; border-radius: 50%; cursor: pointer; flex-shrink: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: all 0.2s ease;" title="Kapat" onmouseover="this.style.background='rgba(231, 76, 60, 0.1)'; this.style.transform='scale(1.1)';" onmouseout="this.style.background='rgba(255, 255, 255, 0.6)'; this.style.transform='scale(1)';">
            <i class="fas fa-times" style="color: #e74c3c; font-size: 1.2rem;"></i>
        </div>`;
        
        let countHtml = `<div style="display: flex; align-items: center; justify-content: center; padding: 6px 20px; margin: 0; align-self: center; background: rgba(255, 255, 255, 0.6); border: 2px dashed #95a5a6; border-radius: 30px; cursor: default; gap: 10px; flex-shrink: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);" title="Sistemdeki Toplam Kök Sayısı">
            <span dir="ltr" style="font-family: 'Inter', sans-serif !important; font-weight: 900; font-size: 1.4rem; color: #2c3e50; letter-spacing: 1px;">${totalRootsCount}</span>
            <i class="fas fa-sitemap" style="color: #27ae60; font-size: 1.3rem;"></i>
        </div>`;
        
        importantContainerRef.innerHTML = closeBtnHtml + importantContainerRef.innerHTML + countHtml;
    }

    let gridContainerHTML = "";
    ranges.forEach(range => {
        let colHTML = `<div class="letter-column"><div class="col-range-header">${range.title}</div>`;
        for(let i = range.start; i <= range.end; i++) {
            let letter = arapcaHarfler[i];
            if (rootsByLetter[letter] && rootsByLetter[letter].length > 0) {
                
                // ==============================================================
                // İŞTE SİHİRLİ SATIR: ARAPÇA SÖZLÜK MANTIĞIYLA TAM ALFABETİK SIRALAMA
                // ==============================================================
                rootsByLetter[letter].sort((a, b) => a.localeCompare(b, 'ar'));

                colHTML += `<div class="letter-group-title">${letter}</div>`;
                colHTML += `<div class="flat-root-list" style="padding: 0 10px; justify-content: center;">`;
                rootsByLetter[letter].forEach(r => { colHTML += createFlatRootItem(r); });
                colHTML += `</div>`;
            }
        }
        colHTML += `</div>`;
        gridContainerHTML += colHTML;
    });
    gridContainer.innerHTML = gridContainerHTML;

    // --- 2.5 MOBİL İÇİN KÖK LİSTESİ OLUŞTURMA ---
    const mobileContainer = document.getElementById("mobile-roots-list");
    if (mobileContainer) {
        let mobileHTML = `
            <div class="mobile-roots-content" id="mobile-roots-content-area" dir="rtl">
                <div class="mobile-roots-header">
                    <h2>Kökler Listesi</h2>
                    <button class="mobile-roots-close" onclick="closeVerbModal()"><i class="fas fa-times"></i></button>
                </div>
                <div style="padding-top: 20px;">
        `;
        
        let scrubberHTML = `<div class="mobile-alphabet-scrubber" id="mobile-scrubber">`;
        
        // Sadece simge olarak kullanılacak 10 kilometre taşı harfi belirle
        const milestoneLetters = ["ا", "ت", "ج", "د", "س", "ص", "ع", "ف", "م", "ي"];
        
        // Alfabe sırasına göre tüm grupları renderla
        arapcaHarfler.forEach(letter => {
            if (rootsByLetter[letter] && rootsByLetter[letter].length > 0) {
                // Header (Harf Başlığı)
                mobileHTML += `<div class="mobile-letter-group" id="letter-group-${letter}">`;
                mobileHTML += `<div class="mobile-letter-title">${letter}</div>`;
                mobileHTML += `<div class="mobile-root-chips">`;
                
                // Kökleri ekle
                rootsByLetter[letter].sort((a, b) => a.localeCompare(b, 'ar')).forEach(r => {
                    mobileHTML += `<div class="mobile-root-chip" onclick="selectRootFromMenu('${r}')">
                        <span>${r}</span>
                        <span style="font-size: 1.2rem;">${getRootEmoji(r)}</span>
                    </div>`;
                });
                mobileHTML += `</div></div>`;
                
                // Scrubber'a kökü olan HER harfi ekle (tüm harfler görünür)
                scrubberHTML += `<div class="scrubber-letter" data-letter="${letter}">${letter}</div>`;
            }
        });
        
        mobileHTML += `</div></div>`; // Kapat: padding-top div ve mobile-roots-content
        scrubberHTML += `</div>`; // Kapat: mobile-alphabet-scrubber
        
        // İçeriği yerleştir (İçerik + Scrubber yan yana)
        mobileContainer.innerHTML = mobileHTML + scrubberHTML;
        
        // Scrubber Touch Eventlerini Başlat
        initAlphabetScrubber();
    }

    // 3. İki Klavyeyi de Eş Zamanlı Oluşturur
    renderUniversalKeyboards();
}

function createFlatRootItem(root) {
    return `<div class="flat-root-item root-item" data-root="${root}" onclick="selectRootFromMenu('${root}')">
        <span>${root}</span>
        <span>${getRootEmoji(root)}</span>
    </div>`;
}

function selectRootFromMenu(root) {
    window._fdmReturnToRoots = true; // FDM çarpısına basınca kök listesine dönsün
    if (typeof closeSlideMenu === 'function') closeSlideMenu();
    if (typeof closeKeyboard === 'function') closeKeyboard(); // Eski klavyeyi kapat
    
    // YENİ KLAVYEYİ KESİN OLARAK KAPAT
    const popup = document.getElementById('integrated-keyboard-popup');
    const backdrop = document.getElementById('keyboard-backdrop'); 
    if (popup) popup.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove("keyboard-active");
    
    // Kök menüsünü kapat ki işlem bitince 2x2 grid ekranına dönülsün
    if (typeof closeVerbModal === 'function') closeVerbModal();

    currentSearchQuery = "";
    const searchInput = document.getElementById("root-search");
    if (searchInput) searchInput.value = "";
    const predictions = document.getElementById("root-predictions");
    if (predictions) predictions.innerHTML = "";

    // DOĞRUDAN SEÇİM YAP (Search Keyboard mantığını bypass et)
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
    
    // Her durumda inputu temizle
    if (searchInput) searchInput.value = "";
    if (typeof currentSearchQuery !== 'undefined') currentSearchQuery = "";
    if (typeof updatePredictionsAndFilter === 'function') updatePredictionsAndFilter();
    
    // Klavyeyi kesinlikle kapat
    const popup = document.getElementById('integrated-keyboard-popup');
    const backdrop = document.getElementById('keyboard-backdrop'); 
    
    if (popup) popup.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active'); 
    if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
    
    document.body.classList.remove("keyboard-active");
    
    // Çarpıya basıldığında vurguları ZORLA başlat (Kullanıcı talebi)
    if (typeof toggleRootHint === 'function') toggleRootHint(true);
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
    const predictionsContainer = document.getElementById("root-predictions-box") || document.getElementById("root-predictions");
    if (!predictionsContainer) return;
    predictionsContainer.innerHTML = "";
    
    if (filter.length > 0) {
        const allRoots = Object.keys(sozlukVerileri);
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
        aksamSebaKokleri.forEach(r => { if(sozlukVerileri[r]) slideContent.innerHTML += createFlatRootItem(r); });
    } else {
        slideTitle.innerText = "مزيد";
        mezidFiilKokleri.forEach(r => { if(sozlukVerileri[r]) slideContent.innerHTML += createFlatRootItem(r); });
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
    
    // Çarpıya (veya dışarı) basıldığında ikon vurgularını başlat
    if (typeof toggleRootHint === 'function') toggleRootHint(true);
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
            const zoomCheckbox = document.getElementById('zoomToggleCheckbox');
            if (zoomCheckbox && zoomCheckbox.checked) return; // Büyüme açıkken sekme değiştirmeyi iptal et
            
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
    const zoomCheckbox = document.getElementById('zoomToggleCheckbox');
    if (zoomCheckbox && zoomCheckbox.checked) return; // Büyüme açıkken sekme değiştirmeyi iptal et
    
    const distance = touchStartX - touchEndX;
    if (Math.abs(distance) > minSwipeDistance) {
        if (distance > 0 && currentTabActive === 1) { setTab(0); } 
        else if (distance < 0 && currentTabActive === 0) { setTab(1); }
    }
}

// ==================================================================
// 1. TABLO GEÇİŞİ (Sağa Kayma ve Boşluk Hatasının Çözümü)
// ==================================================================
function setTab(tabIndex, noSound = false) {
    if (!noSound && typeof SoundEngine !== "undefined") SoundEngine.playClick(); 
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
        
        const mezidBtn = document.querySelector('.mezid-btn');
        if (mezidBtn) mezidBtn.classList.remove('heartbeat-active');
    } else {
        switcher.classList.remove("mezid-active");
        switcher.classList.add("mucerred-active");
        
        band.style.transform = "translateX(0%)";  
    }
}


// --- 1. HAZIR KÖK MENÜSÜNÜ AÇMA (Arka planı sıfırlayarak açma) ---
function openVerbModal() {
    // YENİ: Kitap ikonu direk Kelimeleri İncele (Akordiyon) açar
    showThematicView();
    
    // YENİ EKLENEN: Arkadaki eski tabloyu, renkleri ve kahverengi taşı tamamen temizle!
    currentRoot = "";
    if (typeof toggleRootHint === 'function') toggleRootHint(true);
    const tempDisp = document.getElementById('temp-root-display');
    if (tempDisp) tempDisp.innerText = "";
    if (typeof updateTempDisplay === 'function') updateTempDisplay();
    if (typeof resetTableOnly === 'function') resetTableOnly(true);
    if (typeof clearDraggableRoots === 'function') clearDraggableRoots();
    if (typeof highlightEasterEggBoxes === 'function') highlightEasterEggBoxes("");

    // Menüyü görünür yap
    const overlay = document.getElementById('verb-overlay');
    if (overlay) overlay.style.display = 'flex';
        document.getElementById("game-wrapper").style.display = "none";

    
    // Arama kutusunu ve arka plan hafızasını tamamen sıfırla
    const searchInput = document.getElementById('root-search');
    if (searchInput) searchInput.value = "";
        if (typeof toggleRootHint === 'function') toggleRootHint(true);
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
    if (searchInput) searchInput.value = "";
    if (typeof currentSearchQuery !== 'undefined') currentSearchQuery = "";
    if (typeof updatePredictionsAndFilter === 'function') updatePredictionsAndFilter(); 
    
    const overlay = document.getElementById('verb-overlay');
    if (overlay) overlay.style.display = 'none';
    
    if (typeof closeSearchKeyboard === 'function') closeSearchKeyboard();
    if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
    if (typeof toggleRootHint === 'function') toggleRootHint(true);
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

    
    if (typeof closeVerbModal === 'function') closeVerbModal();
    if (typeof highlightEasterEggBoxes === 'function') highlightEasterEggBoxes(currentRoot);
    if (typeof autoSpawnRootClone === 'function') autoSpawnRootClone();
    if (typeof currentTabActive !== 'undefined' && currentTabActive === 1 && typeof setTab === 'function') setTab(0);
    
    // YENİ: Mezid sekmesinde kelime var mı kontrolü
    const mezidBtn = document.querySelector('.mezid-btn');
    setTimeout(() => {
        /* Bu işlev mobil sürümde hiç tanımlı değil; her kök seçiminde
           "applyMarathonHeaderColors is not defined" hatası atıyordu.
           Çevredeki kodun diliyle aynı korumaya alındı. */
        if (typeof applyMarathonHeaderColors === 'function') applyMarathonHeaderColors();
    }, 50);
    if (mezidBtn) {
        mezidBtn.classList.remove('heartbeat-active');
        if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[currentRoot]) {
            const hasMezid = Object.keys(sozlukVerileri[currentRoot]).some(ref => parseInt(ref) >= 52);
            if (hasMezid && (typeof currentTabActive === 'undefined' || currentTabActive === 0)) {
                mezidBtn.classList.add('heartbeat-active');
            }
        }
    }
    
    // MOBİL İÇİN OTOMATİK HIZLI LİSTE (FDM) AÇMA
    if (window.innerWidth <= 1024) {
        if (typeof openFastDictionaryMode === 'function') {
            openFastDictionaryMode();
        }
    }
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
            const currentRootSafe = (typeof currentRoot !== 'undefined') ? currentRoot : "";
            
            // YENİ ŞART: Tanımlı olmayan köklerde fiil tabloları AÇILMASIN
            if (typeof sozlukVerileri !== 'undefined' && !sozlukVerileri[currentRootSafe]) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
            
            const refId = parseInt(refEl.innerText);
            const mapping = typeof getBabAndType === 'function' ? getBabAndType(refId) : null;
            const kalip = boxElement.getAttribute('data-original');
            
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
    
    if (typeof sozlukVerileri !== 'undefined' && (!currentRootSafe || !sozlukVerileri[currentRootSafe])) {
        boxElement.classList.add('tanimsiz-kok');
    } else {
        boxElement.classList.remove('tanimsiz-kok');
    }
    
    const refId = parseInt(refEl.innerText);
    const kalip = boxElement.getAttribute('data-original');

    const wasAlreadyActive = (typeof lastClickedBoxTextSpan !== 'undefined' && lastClickedBoxTextSpan === textEl);
    lastClickedBoxTextSpan = textEl;
    lastOriginalWord = kalip;

    if (!wasAlreadyActive) {
        const topPlusDesk = document.querySelector('.fa-plus');
        if (topPlusDesk) topPlusDesk.classList.remove('plus-highlighted');
        const topPlusMob = document.getElementById('mobile-top-plus');
        if (topPlusMob) topPlusMob.classList.remove('plus-highlighted');
    }

    if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[currentRootSafe]) {
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

  
    // KELİMEYİ TÜRETEN FONKSİYON (Tek Veri Kaynağı: sozlukVerileri)
    const applyWordTransformation = () => {
        const vezinObj = babVezinleri[mapping.babNo];
        let kalipMetni = (vezinObj && vezinObj[mapping.type]) ? vezinObj[mapping.type] : kalip;
        
        let plainWord = kalipMetni;
        let hasMultipleUses = false; // YENİ: Çoklu kullanım kontrolü
        
       if (currentRootSafe.length === 3) {
            // ÖZEL ÇEKİM LİSTESİNDE VAR MI KONTROL ET (TEK VERİ KAYNAĞI)
            if (typeof sozlukVerileri !== 'undefined' && 
                sozlukVerileri[currentRootSafe] && 
                sozlukVerileri[currentRootSafe][refId]) {
                
                let eggObj = sozlukVerileri[currentRootSafe][refId];
                
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
            document.querySelectorAll('.glass-box').forEach(b => {
                b.classList.remove('current-active-red');
                if (!b.classList.contains('kok-turendi')) b.removeAttribute('data-tiklama-sayisi');
            });
            if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[currentRootSafe]) {
                boxElement.classList.add('current-active-red');
                
                const badge = boxElement.querySelector('.plus-hint-badge');
                if (badge && !boxElement.hasAttribute('data-active-suffix')) {
                    badge.style.transform = 'scale(1.5)';
                    setTimeout(() => badge.style.transform = '', 300);
                    
                    const topPlusDesk = document.querySelector('.fa-plus');
                    if (topPlusDesk) {
                        topPlusDesk.classList.remove('plus-highlighted');
                        void topPlusDesk.offsetWidth;
                        topPlusDesk.classList.add('plus-highlighted');
                    }
                    const topPlusMob = document.getElementById('mobile-top-plus');
                    if (topPlusMob) {
                        topPlusMob.classList.remove('plus-highlighted');
                        void topPlusMob.offsetWidth;
                        topPlusMob.classList.add('plus-highlighted');
                    }
                }
            }
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
            if (!wasAlreadyActive) {
                document.querySelectorAll('.glass-box').forEach(b => {
                    b.classList.remove('current-active-red');
                    if (b.classList.contains('kok-turendi')) {
                        b.style.setProperty("background-color", "#bfffdf", "important");
                    } else {
                        b.removeAttribute('data-tiklama-sayisi');
                    }
                });
                boxElement.classList.add('current-active-red');
                const badge = boxElement.querySelector('.plus-hint-badge');
                if (badge && !boxElement.hasAttribute('data-active-suffix')) {
                    badge.style.transform = 'scale(1.5)';
                    setTimeout(() => badge.style.transform = '', 300);
                    
                    const topPlusDesk = document.querySelector('.fa-plus');
                    if (topPlusDesk) {
                        topPlusDesk.classList.remove('plus-highlighted');
                        void topPlusDesk.offsetWidth;
                        topPlusDesk.classList.add('plus-highlighted');
                    }
                    const topPlusMob = document.getElementById('mobile-top-plus');
                    if (topPlusMob) {
                        topPlusMob.classList.remove('plus-highlighted');
                        void topPlusMob.offsetWidth;
                        topPlusMob.classList.add('plus-highlighted');
                    }
                }
                if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
                return;
            }
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
                document.querySelectorAll('.glass-box').forEach(b => {
                    b.classList.remove('current-active-red');
                    if (!b.classList.contains('kok-turendi')) b.removeAttribute('data-tiklama-sayisi');
                });
                if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[currentRootSafe]) {
                    boxElement.classList.add('current-active-red');
                }
                if(typeof SoundEngine !== "undefined") SoundEngine.playClick();
                boxElement.style.setProperty("background-color", "#bfffdf", "important"); 
                boxElement.style.borderColor = "#000000"; 
                applyWordTransformation(); 
                boxElement.setAttribute('data-tiklama-sayisi', '1');
            } else {
                if (!wasAlreadyActive) {
                    document.querySelectorAll('.glass-box').forEach(b => {
                        b.classList.remove('current-active-red');
                        if (b.classList.contains('kok-turendi')) {
                            b.style.setProperty("background-color", "#bfffdf", "important");
                        } else {
                            b.removeAttribute('data-tiklama-sayisi');
                        }
                    });
                    boxElement.classList.add('current-active-red');
                    const badge = boxElement.querySelector('.plus-hint-badge');
                    if (badge && !boxElement.hasAttribute('data-active-suffix')) {
                        badge.style.transform = 'scale(1.5)';
                        setTimeout(() => badge.style.transform = '', 300);
                        
                        const topPlusDesk = document.querySelector('.fa-plus');
                        if (topPlusDesk) {
                            topPlusDesk.classList.remove('plus-highlighted');
                            void topPlusDesk.offsetWidth;
                            topPlusDesk.classList.add('plus-highlighted');
                        }
                        const topPlusMob = document.getElementById('mobile-top-plus');
                        if (topPlusMob) {
                            topPlusMob.classList.remove('plus-highlighted');
                            void topPlusMob.offsetWidth;
                            topPlusMob.classList.add('plus-highlighted');
                        }
                    }
                    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
                    return;
                }
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
                document.querySelectorAll('.glass-box').forEach(b => {
                    b.classList.remove('current-active-red');
                    if (!b.classList.contains('kok-turendi')) b.removeAttribute('data-tiklama-sayisi');
                });
                if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[currentRootSafe]) {
                    boxElement.classList.add('current-active-red');
                    
                    const badge = boxElement.querySelector('.plus-hint-badge');
                    if (badge && !boxElement.hasAttribute('data-active-suffix')) {
                        badge.style.transform = 'scale(1.5)';
                        setTimeout(() => badge.style.transform = '', 300);
                        
                        const topPlusDesk = document.querySelector('.fa-plus');
                        if (topPlusDesk) {
                            topPlusDesk.classList.remove('plus-highlighted');
                            void topPlusDesk.offsetWidth;
                            topPlusDesk.classList.add('plus-highlighted');
                        }
                        const topPlusMob = document.getElementById('mobile-top-plus');
                        if (topPlusMob) {
                            topPlusMob.classList.remove('plus-highlighted');
                            void topPlusMob.offsetWidth;
                            topPlusMob.classList.add('plus-highlighted');
                        }
                    }
                }
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
                if (!wasAlreadyActive) {
                    document.querySelectorAll('.glass-box').forEach(b => {
                        b.classList.remove('current-active-red');
                        if (b.classList.contains('kok-turendi')) {
                            b.style.setProperty("background-color", "#bfffdf", "important");
                        } else {
                            b.removeAttribute('data-tiklama-sayisi');
                        }
                    });
                    boxElement.classList.add('current-active-red');
                    const badge = boxElement.querySelector('.plus-hint-badge');
                    if (badge && !boxElement.hasAttribute('data-active-suffix')) {
                        badge.style.transform = 'scale(1.5)';
                        setTimeout(() => badge.style.transform = '', 300);
                        
                        const topPlusDesk = document.querySelector('.fa-plus');
                        if (topPlusDesk) {
                            topPlusDesk.classList.remove('plus-highlighted');
                            void topPlusDesk.offsetWidth;
                            topPlusDesk.classList.add('plus-highlighted');
                        }
                        const topPlusMob = document.getElementById('mobile-top-plus');
                        if (topPlusMob) {
                            topPlusMob.classList.remove('plus-highlighted');
                            void topPlusMob.offsetWidth;
                            topPlusMob.classList.add('plus-highlighted');
                        }
                    }
                    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
                    return;
                }
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

function applyToSpecificBox(boxElement, noSound = false) {
    const targetEl = boxElement.querySelector('.ar, .ar-small');
    if (!targetEl) return;
    const kalip = targetEl.getAttribute('data-original');

    clearOtherActiveBoxes(boxElement);

    if (boxElement.style.backgroundColor) {
        if (!noSound && typeof SoundEngine !== "undefined") SoundEngine.playClose();
        
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

    if (!noSound && typeof SoundEngine !== "undefined") SoundEngine.playClick();
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
    
    // Tafdil ve Sifat Zırhı (Bu kalıplar İf'al babı mazi/muzari gibi İ'lal görmemeli)
    let options = {};
    if (kalip === "أَفْعَل" || kalip === "فُعْلَى" || kalip === "أَفْعَال") {
        options.skipIfalEcvef = true;
    }

    // Vezinden bâb numarasını çıkar: misal vâvının düşüp düşmeyeceği buna bağlı.
    // (İsim kalıplarında numBab boş kalır; motor da vâvı korur: مَوْعِد, تَوْعِيد)
    if (typeof babVezinleri !== 'undefined') {
        for (const b in babVezinleri) {
            const v = babVezinleri[b];
            if (v.mazi === kalip || v.muzari === kalip || v.emir === kalip) { options.numBab = Number(b); break; }
        }
    }

    // Bütün muazzam kuralları (Ecvef, Misal, Şedde vb.) SarfEngine üzerinden tek seferde uygula!
    if (typeof SarfEngine !== 'undefined' && SarfEngine.applyRules) {
        result = SarfEngine.applyRules(result, r, options);
    }
    
    return result;
}

function openConjugationPopup(kok, babNo, tip, anaVezin) {
    // Kök sözlükte (sozlukVerileri'de) tanımlı değilse tabloyu KESİNLİKLE açma!
    if (typeof sozlukVerileri !== 'undefined' && (!kok || !sozlukVerileri[kok])) {
        return;
    }

    if (!lastClickedBoxTextSpan) return;
    const boxElement = lastClickedBoxTextSpan.closest('.glass-box');
    if (!boxElement) return;
    if (!boxElement.classList.contains('kok-turendi')) return; 

    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    if (!kok || kok.length !== 3) kok = "فعل"; 

    let numBab = Number(babNo); 
    const refEl = boxElement.querySelector('.ref');
    const refId = refEl ? parseInt(refEl.innerText) : 0;

    if (refId === 1 && typeof sozlukVerileri !== 'undefined' && sozlukVerileri[kok]) {
        if (sozlukVerileri[kok][4]) numBab = 2;
        else if (sozlukVerileri[kok][6]) numBab = 3;
    }

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
        // ÇÖZÜM: Hesaplama yapılmadan önce sayfa dışına taşmasını ve scroll çıkarmasını engelle
        // Sadece visibility: hidden yapmak veya top: 0 atamak sayfa sonundaki öğelerde aşağı taşmaya neden olabilir.
        // display: none ile DOM'a eklenirken hiç alan kaplamamasını sağlıyoruz.
        inlineContainer.style.display = 'none'; 
        boxElement.appendChild(inlineContainer);
    } else {
        inlineContainer.style.display = 'none'; 
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
                if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[kok] && sozlukVerileri[kok][p]) { 
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
        return window.buildConjCell(w, tip, numBab, tableType, isColorActive, kok, wordIndex);
    }

    let tablesToRender = [];
    if (isVerb && typeof kelimeListesi[0] !== 'object') {
        if (tip === 'mazi') tablesToRender = ['olumlu', 'ma', 'lam', 'la'];
        else if (tip === 'muzari') tablesToRender = ['olumlu', 'la', 'len'];
        else if (tip === 'emir') tablesToRender = ['olumlu', 'nehiy'];
    }

    let hasCarousel = tablesToRender.length > 1;

    let html = `
        <div class="popup-drag-bar" style="position: absolute; top: 0; left: 0; width: 100%; height: 35px; background: #f1f5f9; border-top-left-radius: 13px; border-top-right-radius: 13px; border-bottom: 2px solid #e2e8f0; display: flex; justify-content: center; align-items: center; cursor: grab; z-index: 10; touch-action: none;">
            <div style="width: 50px; height: 6px; background: #cbd5e1; border-radius: 10px; pointer-events: none;"></div>
        </div>
        <div class="matrix-close-btn" style="z-index: 11; top: 2px;" onclick="closeInlineMatrix(event, this)">✕</div>
    `;
    
    html += `<div class="carousel-container-outer" style="position: relative; margin-top: 25px; width: 100%; display: flex; align-items: center; justify-content: center; height: calc(100% - 25px);">`;
    
    if (hasCarousel) {
        // Okların yerini değiştirdik: İçeriye aldık ve ortaladık
        html += `<button class="carousel-nav-btn right-btn" onclick="scrollConjugationCarousel(1, this)" style="position: absolute; right: -15px; top: 50%; transform: translateY(-50%); z-index: 12; background: rgba(255,255,255,0.9); border: 2px solid #ccc; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; color: #333; box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: flex; justify-content: center; align-items: center; padding: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>`;
        html += `<button class="carousel-nav-btn left-btn" onclick="scrollConjugationCarousel(-1, this)" style="position: absolute; left: -15px; top: 50%; transform: translateY(-50%); z-index: 12; background: rgba(255,255,255,0.9); border: 2px solid #ccc; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; color: #333; box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: flex; justify-content: center; align-items: center; padding: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>`;
    }

    html += `<div class="popup-scroll-wrapper conjugation-carousel hide-scrollbars" style="flex: 0 0 calc(100% - 80px); max-height: 60vh; overflow-y: hidden; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; display: flex; flex-direction: row; scrollbar-width: none; padding: 0; box-sizing: border-box; width: calc(100% - 80px);">`;

    let totalItems = kelimeListesi.length;

    if (isVerb) {
        if (typeof kelimeListesi[0] === 'object') {
            html += `<div class="hide-scrollbars" style="flex: 0 0 100%; width: 100%; scroll-snap-align: center; max-height: 60vh; overflow-y: auto; scrollbar-width: none;">`;
            html += `<table class="conjugation-table" style="margin: 0; width: 100%; border-collapse: collapse;">`;
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
            html += `</tbody></table></div>`;
        } 
        else {
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
                } else if (tableType === 'len') {
                    theadText = "Nefy-i İstikbal (لَنْ / Gelecek Olumsuz)";
                    headBg = "#16a085";
                    subBg = "#e8f8f5";
                    subColor = "#0e6655";
                } else if (tableType === 'nehiy') {
                    theadText = "Nehiy (Olumsuz Emir)";
                    headBg = "#e74c3c"; subBg = "#fcf1f1"; subColor = "#a94442";
                }
                
                html += `<div class="hide-scrollbars" style="flex: 0 0 100%; width: 100%; scroll-snap-align: center; max-height: 60vh; overflow-y: auto; padding-bottom: 20px; scrollbar-width: none;">`;
                html += `<table class="conjugation-table" style="margin: 0; width: 100%; border-collapse: collapse;">`;

                html += `<thead style="position: sticky; top: -1px; z-index: ${10 + tIndex}; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <tr><th colspan="3" style="background-color: ${headBg} !important; color: white; padding: 8px; font-size: 15px; border-top: 2px solid #cbd5e1; border-radius: 8px 8px 0 0;">🏷️ ${theadText}</th></tr>
                            <tr style="background-color: ${subBg};"><th style="padding: 4px; font-size: 13px; color: ${subColor}; border-bottom: 2px solid #cbd5e1;">Müfred</th><th style="padding: 4px; font-size: 13px; color: ${subColor}; border-bottom: 2px solid #cbd5e1;">Tesniye</th><th style="padding: 4px; font-size: 13px; color: ${subColor}; border-bottom: 2px solid #cbd5e1;">Cemi</th></tr>
                         </thead><tbody style="border-bottom: 4px solid #cbd5e1;">`;
                         
                for (let i = 0; i < totalItems; i += 3) {
                    let rowIndex = Math.floor(i / 3);
                    let bgColor = '#ffffff';
                    
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
                    } else if (tableType === 'len') {
                        bgColor = (rowIndex % 2 === 0) ? '#e8f8f5' : '#d1f2eb';
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
                html += `</tbody></table></div>`;
            });
        }
    } else {
        html += `<div class="hide-scrollbars" style="flex: 0 0 100%; width: 100%; scroll-snap-align: center; max-height: 60vh; overflow-y: auto; scrollbar-width: none;">`;
        html += `<table class="conjugation-table" style="margin: 0; width: 100%; border-collapse: collapse;">`;
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
        html += `</tbody></table></div>`;
    }

    html += `</div></div>`; // End of carousel and its wrapper

    // Add JS function for carousel scrolling and dragging if not exists
    if (!window.scrollConjugationCarouselDefined) {
        window.scrollConjugationCarousel = function(direction, btnEl) {
            const wrapper = btnEl.parentElement.querySelector('.conjugation-carousel');
            if (wrapper) {
                const scrollAmount = wrapper.clientWidth;
                wrapper.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
            }
        };

        window.initCarouselDrag = function(wrapper) {
            let isDown = false;
            let startX;
            let scrollLeft;

            const startDrag = (e) => {
                isDown = true;
                wrapper.style.cursor = 'grabbing';
                wrapper.style.scrollSnapType = 'none'; // Disable snap while dragging
                wrapper.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
                startX = (e.pageX || e.touches[0].pageX) - wrapper.offsetLeft;
                scrollLeft = wrapper.scrollLeft;
            };

            const stopDrag = () => {
                if (!isDown) return;
                isDown = false;
                wrapper.style.cursor = 'grab';
                wrapper.style.scrollSnapType = 'x mandatory';
                wrapper.style.scrollBehavior = 'smooth';
                // Trigger snap by a tiny scroll
                wrapper.scrollBy({ left: 1 });
                wrapper.scrollBy({ left: -1 });
            };

            const moveDrag = (e) => {
                if (!isDown) return;
                // prevent text selection while dragging
                if (e.type !== 'touchmove') e.preventDefault(); 
                const x = (e.pageX || e.touches[0].pageX) - wrapper.offsetLeft;
                const walk = (x - startX) * 1.5; // Scroll-fast
                wrapper.scrollLeft = scrollLeft - walk;
            };
            
            const updateButtons = () => {
                const rightBtn = wrapper.parentElement.querySelector('.right-btn');
                const leftBtn = wrapper.parentElement.querySelector('.left-btn');
                if (!rightBtn || !leftBtn) return;
                
                // Sağ buton (❯) başlangıca (scrollLeft = 0) götürür. Başlangıçtaysa pasif yap.
                if (Math.abs(wrapper.scrollLeft) <= 5) {
                    rightBtn.style.opacity = '0.5';
                    rightBtn.style.pointerEvents = 'none';
                    rightBtn.style.backgroundColor = 'rgba(255, 200, 200, 0.9)'; // Açık Kırmızı
                } else {
                    rightBtn.style.opacity = '1';
                    rightBtn.style.pointerEvents = 'auto';
                    rightBtn.style.backgroundColor = 'rgba(200, 255, 200, 0.9)'; // Açık Yeşil
                }
                
                // Sol buton (❮) sona götürür. Sondayken pasif yap.
                const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
                // scrollWidth <= clientWidth ise tablo tek sayfadır, ikisi de pasif olsun
                if (maxScroll <= 5 || Math.abs(wrapper.scrollLeft) >= maxScroll - 5) {
                    leftBtn.style.opacity = '0.5';
                    leftBtn.style.pointerEvents = 'none';
                    leftBtn.style.backgroundColor = 'rgba(255, 200, 200, 0.9)'; // Açık Kırmızı
                } else {
                    leftBtn.style.opacity = '1';
                    leftBtn.style.pointerEvents = 'auto';
                    leftBtn.style.backgroundColor = 'rgba(200, 255, 200, 0.9)'; // Açık Yeşil
                }
            };

            wrapper.addEventListener('scroll', updateButtons);
            // İlk açılışta buton durumlarını güncelle
            setTimeout(updateButtons, 50);
            setTimeout(updateButtons, 200);

            wrapper.addEventListener('mousedown', startDrag);
            wrapper.addEventListener('mouseleave', stopDrag);
            wrapper.addEventListener('mouseup', stopDrag);
            wrapper.addEventListener('mousemove', moveDrag);

            // Touch events
            wrapper.addEventListener('touchstart', startDrag, {passive: true});
            wrapper.addEventListener('touchend', stopDrag);
            wrapper.addEventListener('touchmove', moveDrag, {passive: false});
        };

        window.scrollConjugationCarouselDefined = true;
    }

    setTimeout(() => {
        const wrapper = inlineContainer.querySelector('.conjugation-carousel');
        if (wrapper) {
            wrapper.style.cursor = 'grab';
            window.initCarouselDrag(wrapper);
        }
    }, 50);
    inlineContainer.innerHTML = html;
    inlineContainer.style.overflowY = 'hidden'; 
    inlineContainer.style.paddingTop = '15px'; 

    // Ölçüm için geçici olarak fixed yapıp ekrana koyalım (böylece sayfa boyunu uzatmaz)
    inlineContainer.style.position = 'fixed';
    inlineContainer.style.visibility = 'hidden';
    inlineContainer.style.display = 'block';
    inlineContainer.style.top = '0px';
    inlineContainer.style.left = '0px';
    
    const popupWidth = inlineContainer.offsetWidth || 600;  
    const popupHeight = inlineContainer.offsetHeight || 410; 

    // Ölçüm bitti. DOM hesaplamaları (getBoundingClientRect) sırasında sayfayı germemesi için gizle
    inlineContainer.style.display = 'none'; 
    inlineContainer.style.position = 'absolute'; 
    
    const boxWidth = boxElement.offsetWidth; const rect = boxElement.getBoundingClientRect();
    let targetTop = (window.innerHeight / 2) - (popupHeight / 2) - rect.top;
    let targetLeft = -popupWidth - 40;

    let globalLeft = rect.left + targetLeft; let globalRight = globalLeft + popupWidth;
    let globalTop = rect.top + targetTop; let globalBottom = globalTop + popupHeight;

    if (globalLeft < 10) targetLeft += (10 - globalLeft); 
    if (globalRight > window.innerWidth - 10) targetLeft -= (globalRight - (window.innerWidth - 10)); 
    if (globalTop < 10) targetTop += (10 - globalTop); 
    if (globalBottom > window.innerHeight - 10) targetTop -= (globalBottom - (window.innerHeight - 10)); 

    inlineContainer.style.left = `${targetLeft}px`; inlineContainer.style.top = `${targetTop}px`;
    inlineContainer.style.right = 'auto'; inlineContainer.style.display = 'block'; 
    inlineContainer.style.visibility = 'visible'; 
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
    // Yazılanları silmiyoruz, sadece kapatıyoruz.
    const overlay = document.getElementById('keyboard-overlay');
    if (overlay) { overlay.style.display = 'none'; overlay.classList.remove('native-search-mode'); }
    if (typeof window._msUnlockScroll === 'function') window._msUnlockScroll();
    if (typeof toggleKB === 'function') toggleKB(false);
    if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
    if (typeof toggleRootHint === 'function') toggleRootHint(true);
    return;

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
    if (true) {
        toggleRootHint(false);
        SoundEngine.playClick(); 
        currentRoot += char;
        updateTempDisplay();
        highlightKey(char);
        
        updateMainKeyboardPredictions(); // YENİ: Harfe basıldıkça öneri getirir
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
    
    // Mobil cihazsa yerel arama kutusuna odaklan ve temizle
    if (window.innerWidth <= 1024) {
        const nativeInput = document.getElementById('mobile-native-search');
        if (nativeInput) {
            nativeInput.value = '';
            currentRoot = '';
            updateTempDisplay();
            updateMainKeyboardPredictions();
            
            // UI yüklendikten hemen sonra klavyeyi tetiklemek için focus
            setTimeout(() => {
                nativeInput.focus();
            }, 150);
        }
    }
}

// Mobil yerel klavye dinleyicisini bağla
setTimeout(() => {
    const nativeSearchInput = document.getElementById('mobile-native-search');
    if (nativeSearchInput) {
        nativeSearchInput.addEventListener('input', function(e) {
            // Arapça karakterleri filtreleyebiliriz veya serbest bırakabiliriz. Serbest bırakıyoruz.
            currentRoot = this.value;
            if (typeof currentSearchQuery !== 'undefined') currentSearchQuery = this.value;
            updateMainKeyboardPredictions();
        });
        // Inputa odaklaninca/dokununca sayfa yukari kaymasin (telefon klavyesi alttan cikar,
        // yerimiz zaten ayrilmis). Herhangi bir kaymayi aninda geri al.
        var _msPin = function() {
            if (!window._msScrollLocked) return;
            try { window.scrollTo(0, window._msSavedScrollY || 0); } catch (e) {}
            var ov = document.getElementById('keyboard-overlay');
            if (ov) ov.scrollTop = 0;
        };
        nativeSearchInput.addEventListener('focus', function() {
            _msPin();
            setTimeout(_msPin, 50);
            setTimeout(_msPin, 250);
        });
    }
}, 500);

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

        toggleKB(false);
        currentEggIndex = 0;
        
        // KESİN ÇÖZÜM: Klavyeden 3 harfli kök girilip onaylanınca vurguyu zorla kapat!
        if (typeof toggleRootHint === 'function') toggleRootHint(false);

        highlightEasterEggBoxes(currentRoot);
        if (typeof autoSpawnRootClone === 'function') autoSpawnRootClone();
        // Akıllı Sekme Geçişi: Kök sadece Mezid'de varsa Mezid'e geç
        let shouldGoToMezid = false;
        let hasMezid = false;
        
        if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[currentRoot]) {
            const rootKeys = Object.keys(sozlukVerileri[currentRoot]).filter(k => !isNaN(parseInt(k)));
            hasMezid = rootKeys.some(ref => parseInt(ref) >= 52);
            const hasMucerretData = rootKeys.some(ref => parseInt(ref) >= 1 && parseInt(ref) <= 51);
            
            if (hasMezid && !hasMucerretData) {
                shouldGoToMezid = true;
            }
        }

        if (shouldGoToMezid) {
            if (currentTabActive === 0) setTab(1);
        } else {
            if (currentTabActive === 1) setTab(0);
        }
        
        // YENİ: Mezid sekmesinde kelime var mı kontrolü
        const mezidBtn = document.querySelector('.mezid-btn');
        if (mezidBtn) {
            mezidBtn.classList.remove('heartbeat-active');
            if (hasMezid && currentTabActive === 0) {
                mezidBtn.classList.add('heartbeat-active');
            }
        }
    }
}

document.addEventListener('keydown', function(e) {
    const overlay = document.getElementById('keyboard-overlay');
    if (!overlay || overlay.style.display === 'none' || overlay.style.display === '') return;
    // TELEFON KLAVYESI FIX: yerel arama inputu odakliysa karisma.
    // Input kendi siler/yazar; 'input' event'i currentRoot'u zaten guncelliyor.
    // (Eskiden Backspace burada preventDefault ile yutuluyordu: sonuclar degisiyor
    //  ama inputtaki harfler silinmiyormus gibi kaliyordu.)
    if (document.activeElement && document.activeElement.id === 'mobile-native-search') return;
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
        
        let inlineTr = box.querySelector('.inline-tr-text');
        if (inlineTr) inlineTr.remove();

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
        rootDisplay.innerHTML = '<i class="fas fa-sitemap root-icon sitemap-wave-hint" title="Kökler Listesi"></i>';
    }
    // tableBoard ghost mantığı tamamen silindi
    currentRoot = "";
    lastClickedBoxTextSpan = null;
    lastOriginalWord = "";
    
    const plusBtn = document.querySelector('.fa-plus');
    if (plusBtn) plusBtn.classList.remove('plus-highlighted');

    const mobilePlus = document.getElementById('mobile-top-plus');
    if (mobilePlus) mobilePlus.classList.remove('plus-highlighted');

    if (typeof highlightEasterEggBoxes === 'function') highlightEasterEggBoxes(""); 
    
    // YENİ EKLENEN: Sıfırlama bitince (herhangi bir kök açık değilken) vurguları/animasyonları yeniden başlat!
    if (typeof toggleRootHint === 'function') toggleRootHint(true);
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
            let hasSuffixes = Object.keys(eggObj).some(k => k !== 'base' && k !== 'ornek' && k !== 'cekimi' && k !== 'suggestsPlus' && k !== 'tip' && k !== 'isDictOnly' && k !== 'cogulId' && k !== 'tekilId' && k !== 'autoGenerated' && k !== 'not' && k !== 'kuralliCogul' && k !== 'isHiddenInList' && k !== 'hasZamirCekimi' && k !== 'zamirBase' && k !== 'cogulTr' && k !== 'isNotVerb' && k !== 'tekil' && k !== 'cogul');
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
// 1. CANLI SARI VURGU MOTORU (Ön Ekleri Destekleyen Sürüm)
// ===============================================================
function updateSuffixHighlights(currentBox) {
    const menu = document.getElementById("suffix-dropdown");
    if (!menu || menu.style.display === "none") return;

    // YENİ: Başlangıçta tüm vurguları temizle (erken dönsek bile eski kalıntı kalmasın)
    const suffixBtns = menu.querySelectorAll('button');
    suffixBtns.forEach(btn => btn.classList.remove('suggested-suffix'));

    const refEl = currentBox.querySelector('.ref');
    if (!refEl) return;
    
    const refId = parseInt(refEl.innerText);
    if (typeof currentRoot === 'undefined' || currentRoot.length !== 3) return;
    if (typeof sozlukVerileri === 'undefined' || !sozlukVerileri[currentRoot]) return;
    
    const eggObj = sozlukVerileri[currentRoot][refId];
    if (!eggObj) return;

    const availableSuffixes = Object.keys(eggObj).filter(k => 
        k !== 'base' && k !== 'ornek' && k !== 'cekimi' && k !== 'suggestsPlus' && k !== 'tip' && k !== 'isDictOnly' && k !== 'cogulId' && k !== 'tekilId' && k !== 'autoGenerated' && k !== 'not' && k !== 'kuralliCogul' && k !== 'isHiddenInList' && k !== 'hasZamirCekimi' && k !== 'zamirBase' && k !== 'cogulTr' && k !== 'isNotVerb' && k !== 'tekil' && k !== 'cogul'
    );

    function standardize(t) {
        if (!t) return "";
        let original = t.replace(/[\u200B-\u200D\uFEFF]/g, '').trim(); 
        original = original.replace(/[یى]/g, 'ي');
        let pure = original.replace(/[\u0640\u064B-\u0652]/g, ''); 
        if (pure === 'ا') return 'ا';
        if (pure === 'ية' || pure === 'يه' || pure === 'يّة') return 'يَّة';
        if (pure === 'يات' || pure === 'يَّات') return 'يَّات';
        if (pure === 'ي') return 'يّ';
        if (pure === 'يا') return 'يًّا'; 
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
        'يَّتَانِ', 'يَّتَيْنِ', 'تَانِ', 'تَيْنِ', 'يَّانِ', 'يَّيْنِ', 
        'يُّونَ', 'يِّينَ', 'يَّات', 'يَّة', 'يًّا', 
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

    // YENİ EKLENEN KISIM: Ön Ekleri (Prefix) Tespit Et
    let existingPrefix = "";
    let prefixSpan = currentBox.querySelector('.added-prefix');
    if (prefixSpan && prefixSpan.dataset.prefix) {
        existingPrefix = prefixSpan.dataset.prefix;
    }

    const targetMap = {
        'يَّة': ['يّ', 'ة'],
        'يَّات': ['يّ', 'ات'],
        'يًّا': ['يّ', 'ا'], 
        'يَّانِ': ['يّ', 'انِ'],
        'يَّيْنِ': ['يّ', 'يْنِ'],
        'يُّونَ': ['يّ', 'ونَ'],
        'يِّينَ': ['يّ', 'ينَ'],
        'تَانِ': ['ة', 'انِ'],
        'تَيْنِ': ['ة', 'يْنِ'],
        'يَّتَانِ': ['يّ', 'ة', 'انِ'],
        'يَّتَيْنِ': ['يّ', 'ة', 'يْنِ']
    };

    let fulfilledSuffixes = [];
    if (existingSuffix) fulfilledSuffixes.push(existingSuffix);
    
    // YENİ: Ön Eki Zekaya Dahil Ettik
    if (existingPrefix) fulfilledSuffixes.push(existingPrefix); 
    
    if (targetMap[existingSuffix]) {
        fulfilledSuffixes.push(...targetMap[existingSuffix]);
    }

    const remainingTargets = availableSuffixes.filter(k => !fulfilledSuffixes.includes(standardize(k)));

    suffixBtns.forEach(btn => {
        
        let exactParam = "";
        let onclickVal = btn.getAttribute('onclick');
        if (onclickVal) {
            let match = onclickVal.match(/'([^']+)'/); 
            if (match && match[1]) {
                exactParam = match[1];
            }
        }

        let btnText = standardize(exactParam || btn.textContent); 
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
// 2. MENÜYÜ AÇAN MOTOR (4K Netlik Yaması ve Sola Yaslama)
// ===============================================================
/* =========================================================================
   EK BİLGİ PERDELERİ — "+" düğmesi, kök seçilmemişken bir öğretmen olur
   -------------------------------------------------------------------------
   Tabloda bir kutu seçiliyken "+" menüsündeki bir ek o kelimeye eklenir.
   Hiçbir kutu seçili DEĞİLKEN aynı eke basmak, o ekin ne işe yaradığını
   anlatan küçük bir perde açar: büyük harf, tek cümlelik tanım, canlı
   şema (yalın ➜ ekli), iki örnek ve bir "dikkat" satırı. Fazlası yok;
   amaç öğrenciyi boğmadan çekirdek bilgiyi vermek.
   ========================================================================= */
window.EK_BILGI = {
    /* ---------------- ÖN EKLER ---------------- */
    "ال": {
        tur: "on", ad: "Harf-i Ta'rîf", altAd: "belirlilik takısı", renk: "#2980B9",
        ozet: "Belirsiz ismi belirli yapar: «bir kitap» ➜ «o kitap».",
        sema: { once: "كِتَابٌ", onceTr: "bir kitap", ek: "الْ", govde: "كِتَاب", sonra: "الْكِتَابُ", sonraTr: "kitap" },
        ornekler: [
            { yalin: "بَيْتٌ", ekli: "الْبَيْتُ", tr: "bir ev ➜ ev" },
            { yalin: "شَمْسٌ", ekli: "الشَّمْسُ", tr: "bir güneş ➜ güneş" }
        ],
        dikkat: "الْ gelince TENVİN gider. Ay harflerinde لْ okunur (الْقَمَر), güneş harflerinde okunmaz, sonraki harf şeddelenir (الشَّمْس).",
        ikon: "belirli"
    },
    "وَ": {
        tur: "on", ad: "Atıf Vâv'ı", altAd: "«ve»", renk: "#20C997",
        ozet: "İki kelimeyi ya da iki cümleyi birbirine bağlar; sırası önemli değildir.",
        sema: { once: "قَلَمٌ", onceTr: "kalem", ek: "وَ", govde: "قَلَم", sonra: "وَقَلَمٌ", sonraTr: "ve kalem" },
        ornekler: [
            { yalin: "الْكِتَابُ", ekli: "الْكِتَابُ وَالْقَلَمُ", tr: "kitap ve kalem" },
            { yalin: "جَاءَ", ekli: "جَاءَ وَجَلَسَ", tr: "geldi ve oturdu" }
        ],
        dikkat: "Bağladığı kelime, öncekiyle AYNI hâli (i'râbı) alır: مَرَرْتُ بِزَيْدٍ وَعَمْرٍو.",
        ikon: "baglac"
    },
    "لِ": {
        tur: "on", ad: "Lâm-ı Cer", altAd: "«için, -e ait»", renk: "#F39C12",
        ozet: "Aitlik ve amaç bildirir; kendinden sonraki ismi ESRELİ (mecrûr) yapar.",
        sema: { once: "الْمُعَلِّمُ", onceTr: "öğretmen", ek: "لِ", govde: "لْمُعَلِّم", sonra: "لِلْمُعَلِّمِ", sonraTr: "öğretmen için" },
        ornekler: [
            { yalin: "اللهُ", ekli: "لِلَّهِ", tr: "Allah'a ait" },
            { yalin: "وَلَدٌ", ekli: "لِوَلَدٍ", tr: "bir çocuk için" }
        ],
        dikkat: "الْ ile birleşince ELİF DÜŞER: لِ + الْبَيْت ➜ لِلْبَيْتِ.",
        ikon: "cer"
    },
    "فَ": {
        tur: "on", ad: "Atıf Fâ'sı", altAd: "«ve hemen ardından»", renk: "#20C997",
        ozet: "وَ gibi bağlar, ama SIRA ve SEBEP bildirir: önce o oldu, hemen ardından bu.",
        sema: { once: "جَلَسَ", onceTr: "oturdu", ek: "فَ", govde: "جَلَسَ", sonra: "فَجَلَسَ", sonraTr: "ve hemen oturdu" },
        ornekler: [
            { yalin: "جَاءَ", ekli: "جَاءَ فَجَلَسَ", tr: "geldi ve hemen oturdu" },
            { yalin: "قَرَأَ", ekli: "قَرَأَ فَفَهِمَ", tr: "okudu, böylece anladı" }
        ],
        dikkat: "وَ ile farkı: وَ sadece bağlar, فَ «arada boşluk yok, hemen ardından» der.",
        ikon: "baglac"
    },
    "كَ": {
        tur: "on", ad: "Kâf-ı Teşbîh", altAd: "«gibi»", renk: "#A78BFA",
        ozet: "Benzetme yapar; harf-i cerdir, sonraki ismi ESRELİ yapar.",
        sema: { once: "الْأَسَدُ", onceTr: "aslan", ek: "كَ", govde: "لْأَسَد", sonra: "كَالْأَسَدِ", sonraTr: "aslan gibi" },
        ornekler: [
            { yalin: "الْقَمَرُ", ekli: "كَالْقَمَرِ", tr: "ay gibi" },
            { yalin: "الثَّلْجُ", ekli: "كَالثَّلْجِ", tr: "kar gibi" }
        ],
        dikkat: "Fiile bitişmez, yalnız İSMİN başına gelir.",
        ikon: "cer"
    },
    "بِ": {
        tur: "on", ad: "Bâ-i Cer", altAd: "«ile, -de»", renk: "#F39C12",
        ozet: "Çoğunlukla ALET/VASITA bildirir: neyle yapıldı? Sonraki ismi ESRELİ yapar.",
        sema: { once: "الْقَلَمُ", onceTr: "kalem", ek: "بِ", govde: "لْقَلَم", sonra: "بِالْقَلَمِ", sonraTr: "kalemle" },
        ornekler: [
            { yalin: "اسْمُ", ekli: "بِسْمِ اللهِ", tr: "Allah'ın adıyla" },
            { yalin: "الْمِفْتَاحُ", ekli: "بِالْمِفْتَاحِ", tr: "anahtarla" }
        ],
        dikkat: "Harf-i cerler ismi ESRELİ yapar; fiilin başına gelmez.",
        ikon: "cer"
    },

    /* ---------------- SON EKLER ---------------- */
    "ا": {
        tur: "son", ad: "Tenvîn-i Nasb", altAd: "«ـًا»", renk: "#E53935",
        ozet: "Kelimeyi mef'ûl, hâl ya da zarf yapar; sonuna iki üstün + elif gelir.",
        sema: { once: "شُكْرٌ", onceTr: "teşekkür", ek: "ـًا", govde: "شُكْر", sonra: "شُكْرًا", sonraTr: "teşekkürler" },
        ornekler: [
            { yalin: "كَثِيرٌ", ekli: "كَثِيرًا", tr: "çokça" },
            { yalin: "أَهْلٌ", ekli: "أَهْلًا وَسَهْلًا", tr: "hoş geldin" }
        ],
        dikkat: "Kelimenin sonu ة veya ء ise ELİF YAZILMAZ: مَدْرَسَةً, مَاءً.",
        ikon: "tenvin"
    },
    "ة": {
        tur: "son", ad: "Te'nîs Tâ'sı", altAd: "dişillik", renk: "#EF5350",
        ozet: "Eril kelimeyi dişil yapar; ayrıca bir cinsin TEK tanesini gösterir.",
        sema: { once: "مُعَلِّمٌ", onceTr: "öğretmen (erkek)", ek: "ة", govde: "مُعَلِّم", sonra: "مُعَلِّمَةٌ", sonraTr: "öğretmen (kadın)" },
        ornekler: [
            { yalin: "طَالِبٌ", ekli: "طَالِبَةٌ", tr: "öğrenci ➜ kız öğrenci" },
            { yalin: "شَجَرٌ", ekli: "شَجَرَةٌ", tr: "ağaçlar ➜ bir ağaç" }
        ],
        dikkat: "Durunca «h» okunur (مُعَلِّمَهْ), devam edilince «t» okunur (مُعَلِّمَتُنَا).",
        ikon: "disil"
    },
    "يّ": {
        tur: "son", ad: "Nisbet Yâ'sı", altAd: "aidiyet", renk: "#7C3AED",
        ozet: "«O yere, o soya, o şeye ait» anlamı verir; sıfat yapar.",
        sema: { once: "تُرْكِيَا", onceTr: "Türkiye", ek: "ـيّ", govde: "تُرْك", sonra: "تُرْكِيٌّ", sonraTr: "Türk" },
        ornekler: [
            { yalin: "الْعَرَب", ekli: "عَرَبِيٌّ", tr: "Araplar ➜ Arap (olan)" },
            { yalin: "مَكَّة", ekli: "مَكِّيٌّ", tr: "Mekke ➜ Mekkeli" }
        ],
        dikkat: "Sondaki ة ve uzatma harfleri DÜŞER: مَكَّة ➜ مَكِّيّ.",
        ikon: "nisbet"
    },
    "يّة": {
        tur: "son", ad: "Nisbet + Te'nîs", altAd: "«ـيَّة»", renk: "#7C3AED",
        ozet: "Nisbetin dişili; ayrıca SOYUT İSİM (kavram adı) yapar.",
        sema: { once: "حُرّ", onceTr: "hür", ek: "ـيَّة", govde: "حُرّ", sonra: "حُرِّيَّةٌ", sonraTr: "hürriyet" },
        ornekler: [
            { yalin: "تُرْكِيٌّ", ekli: "تُرْكِيَّةٌ", tr: "Türk ➜ Türk (kadın)" },
            { yalin: "إِنْسَان", ekli: "إِنْسَانِيَّةٌ", tr: "insan ➜ insanlık" }
        ],
        dikkat: "Kavram adı yaptığında artık sıfat değil, İSİMDİR: حُرِّيَّة «hürriyet».",
        ikon: "nisbet"
    },
    "انِ": {
        tur: "son", ad: "Tesniye (İkil)", altAd: "merfû hâli", renk: "#16A085",
        ozet: "Arapçada «iki tane» için ayrı bir sayı vardır: ne tekil ne çoğul.",
        sema: { once: "كِتَابٌ", onceTr: "bir kitap", ek: "ـانِ", govde: "كِتَاب", sonra: "كِتَابَانِ", sonraTr: "iki kitap" },
        ornekler: [
            { yalin: "مُسْلِمٌ", ekli: "مُسْلِمَانِ", tr: "iki müslüman" },
            { yalin: "مُعَلِّمَةٌ", ekli: "مُعَلِّمَتَانِ", tr: "iki kadın öğretmen" }
        ],
        dikkat: "Bu ek ÖZNE olduğunda kullanılır (merfû). Nesne/mecrur olunca ـَيْنِ olur.",
        ikon: "ikil"
    },
    "يْنِ": {
        tur: "son", ad: "Tesniye (İkil)", altAd: "mansûb / mecrûr hâli", renk: "#16A085",
        ozet: "İkilin nesne ve harf-i cerden sonraki hâli.",
        sema: { once: "كِتَابَانِ", onceTr: "iki kitap (özne)", ek: "ـَيْنِ", govde: "كِتَاب", sonra: "كِتَابَيْنِ", sonraTr: "iki kitabı" },
        ornekler: [
            { yalin: "قَرَأْتُ", ekli: "قَرَأْتُ كِتَابَيْنِ", tr: "iki kitap okudum" },
            { yalin: "فِي", ekli: "فِي يَدَيْنِ", tr: "iki elde" }
        ],
        dikkat: "ـانِ ➜ ـَيْنِ değişimi, tekildeki ötre ➜ üstün/esre değişiminin ikildeki karşılığıdır.",
        ikon: "ikil"
    },
    "ونَ": {
        tur: "son", ad: "Cem'-i Müzekker Sâlim", altAd: "merfû hâli", renk: "#2980B9",
        ozet: "Akıllı ERKEKLER için düzenli çoğul; kelimenin yapısı bozulmaz, sona ek gelir.",
        sema: { once: "مُسْلِمٌ", onceTr: "bir müslüman", ek: "ـونَ", govde: "مُسْلِم", sonra: "مُسْلِمُونَ", sonraTr: "müslümanlar" },
        ornekler: [
            { yalin: "مُعَلِّمٌ", ekli: "مُعَلِّمُونَ", tr: "öğretmenler" },
            { yalin: "مُؤْمِنٌ", ekli: "الْمُؤْمِنُونَ", tr: "mü'minler" }
        ],
        dikkat: "Yalnız AKILLI VARLIKLARIN erkekleri için kullanılır. Özne olunca ـُونَ, değilse ـِينَ.",
        ikon: "cogul"
    },
    "ينَ": {
        tur: "son", ad: "Cem'-i Müzekker Sâlim", altAd: "mansûb / mecrûr hâli", renk: "#2980B9",
        ozet: "Düzenli eril çoğulun nesne ve harf-i cerden sonraki hâli.",
        sema: { once: "مُسْلِمُونَ", onceTr: "müslümanlar (özne)", ek: "ـينَ", govde: "مُسْلِم", sonra: "مُسْلِمِينَ", sonraTr: "müslümanları" },
        ornekler: [
            { yalin: "رَأَيْتُ", ekli: "رَأَيْتُ الْمُعَلِّمِينَ", tr: "öğretmenleri gördüm" },
            { yalin: "مَعَ", ekli: "مَعَ الصَّادِقِينَ", tr: "sadıklarla beraber" }
        ],
        dikkat: "ونَ ➜ ينَ değişimi cümledeki GÖREV değişikliğini gösterir, anlamı değiştirmez.",
        ikon: "cogul"
    },
    "ات": {
        tur: "son", ad: "Cem'-i Müennes Sâlim", altAd: "düzenli dişil çoğul", renk: "#EF5350",
        ozet: "Dişil kelimeler için düzenli çoğul; ة düşer, yerine ـَات gelir.",
        sema: { once: "مُعَلِّمَةٌ", onceTr: "bir kadın öğretmen", ek: "ـَات", govde: "مُعَلِّم", sonra: "مُعَلِّمَاتٌ", sonraTr: "kadın öğretmenler" },
        ornekler: [
            { yalin: "طَالِبَةٌ", ekli: "طَالِبَاتٌ", tr: "kız öğrenciler" },
            { yalin: "سَاعَةٌ", ekli: "سَاعَاتٌ", tr: "saatler" }
        ],
        dikkat: "Önce ة ATILIR, sonra ـَات eklenir: مُعَلِّمَة ➜ مُعَلِّم ➜ مُعَلِّمَات.",
        ikon: "cogul"
    },
    "يَّات": {
        tur: "son", ad: "Nisbet + Dişil Çoğul", altAd: "«ـيَّات»", renk: "#7C3AED",
        ozet: "Nisbet ekli dişil kelimelerin çoğulu; soyut isimleri de çoğullar.",
        sema: { once: "حُرِّيَّةٌ", onceTr: "hürriyet", ek: "ـيَّات", govde: "حُرّ", sonra: "حُرِّيَّاتٌ", sonraTr: "hürriyetler" },
        ornekler: [
            { yalin: "عَرَبِيَّةٌ", ekli: "عَرَبِيَّاتٌ", tr: "Arap kadınlar" },
            { yalin: "شَخْصِيَّةٌ", ekli: "شَخْصِيَّاتٌ", tr: "şahsiyetler" }
        ],
        dikkat: "ـيَّة ➜ ـيَّات: ة atılır, ـَات gelir. Kural ـَات ekiyle aynıdır.",
        ikon: "cogul"
    }
};

/* Her ek ailesinin küçük şematik simgesi — hepsi tek stroke diliyle çizildi. */
window.EK_IKON = {
    belirli: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>',
    baglac:  '<path d="M4 12h5a3 3 0 0 0 3-3V8"/><path d="M20 12h-5a3 3 0 0 1-3-3V8"/><circle cx="12" cy="17" r="2.4"/>',
    cer:     '<path d="M5 8v8"/><path d="M19 8v8"/><path d="M5 12h14"/><path d="M16 9l3 3-3 3"/>',
    tenvin:  '<path d="M6 15h12"/><circle cx="9" cy="9" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1.4" fill="currentColor" stroke="none"/>',
    disil:   '<circle cx="12" cy="9" r="4.5"/><path d="M12 13.5V20"/><path d="M9 17.5h6"/>',
    nisbet:  '<path d="M12 4v6"/><circle cx="12" cy="13" r="3"/><path d="M7 20c1.6-2.2 8.4-2.2 10 0"/>',
    ikil:    '<rect x="3.5" y="7" width="7" height="10" rx="2"/><rect x="13.5" y="7" width="7" height="10" rx="2"/>',
    cogul:   '<rect x="2.5" y="8" width="5.5" height="8" rx="1.6"/><rect x="9.2" y="8" width="5.5" height="8" rx="1.6"/><rect x="16" y="8" width="5.5" height="8" rx="1.6"/>'
};

/* Perdeyi kurar ve doldurur. tur bilgisi ok yönünü belirler:
   ön ek Arapçada kelimenin SAĞINA, son ek SOLUNA yapışır. */
/* Türkçe cümlenin içindeki Arapça parçaları yalıtır: yalıtılmazsa
   iki yönlü (bidi) metin karışıyor, cümle sonundaki nokta ve parantez
   yer değiştiriyor. */
window.ekbArYalit = function (metin) {
    return String(metin || '').replace(
        /([\u0621-\u064A][\u0621-\u065F\u0670\u06D6-\u06ED\u0640 ]*)/g,
        function (m) {
            var son = m.match(/[ ]+$/);
            var oz = son ? m.slice(0, -son[0].length) : m;
            return '<i class="ekb-ar" dir="rtl">' + oz + '</i>' + (son ? son[0] : '');
        }
    );
};

window.ekBilgiAc = function (ek) {
    var d = window.EK_BILGI[ek];
    if (!d) return false;
    var perde = document.getElementById('ek-bilgi-perde');
    if (!perde) return false;

    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();

    var ikon = window.EK_IKON[d.ikon] || window.EK_IKON.belirli;
    var ornekHtml = d.ornekler.map(function (o) {
        return '<div class="ekb-ornek">' +
               '<span class="ekb-o-yalin" dir="rtl">' + o.yalin + '</span>' +
               '<span class="ekb-o-ok">➜</span>' +
               '<span class="ekb-o-ekli" dir="rtl">' + o.ekli + '</span>' +
               '<span class="ekb-o-tr">' + o.tr + '</span></div>';
    }).join('');

    /* ŞEMA: solda yalın hâl, ortada uçup gelen ek, sağda sonuç.
       Ok RTL yönünde akar; ek kutusu her turda yerine oturur. */
    var semaHtml =
        '<div class="ekb-sema" dir="rtl">' +
          '<div class="ekb-adim">' +
            '<div class="ekb-kutu ekb-yalin" dir="rtl">' + d.sema.once + '</div>' +
            '<small>yalın hâl</small>' +
          '</div>' +
          '<div class="ekb-gecis">' +
            '<div class="ekb-ucan" dir="rtl">' + d.sema.ek + '</div>' +
            '<svg class="ekb-ok-svg" viewBox="0 0 72 18" aria-hidden="true">' +
              '<path class="ekb-ok-yol" d="M68 9 H10"/>' +
              '<path class="ekb-ok-uc" d="M16 4 L8 9 L16 14"/>' +
            '</svg>' +
            '<small>' + (d.tur === 'on' ? 'başa gelir' : 'sona gelir') + '</small>' +
          '</div>' +
          '<div class="ekb-adim">' +
            '<div class="ekb-kutu ekb-ekli" dir="rtl">' + d.sema.sonra + '</div>' +
            '<small>ekli hâl</small>' +
          '</div>' +
        '</div>' +
        '<div class="ekb-sema-tr"><span>' + d.sema.onceTr + '</span><b>➜</b><span>' + d.sema.sonraTr + '</span></div>';

    perde.querySelector('.ekb-kart').style.setProperty('--ekb-renk', d.renk);
    perde.querySelector('.ekb-govde').innerHTML =
        '<div class="ekb-tepe">' +
          '<div class="ekb-harf" dir="rtl">' + (d.tur === 'on' ? ek + 'ـ' : 'ـ' + ek) + '</div>' +
          '<div class="ekb-kimlik">' +
            '<div class="ekb-rozet">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ikon + '</svg>' +
              (d.tur === 'on' ? 'ÖN EK' : 'SON EK') +
            '</div>' +
            '<h3>' + d.ad + '</h3>' +
            '<p class="ekb-alt">' + d.altAd + '</p>' +
          '</div>' +
        '</div>' +
        '<p class="ekb-ozet">' + ekbArYalit(d.ozet) + '</p>' +
        semaHtml +
        '<div class="ekb-ornekler">' + ornekHtml + '</div>' +
        '<div class="ekb-dikkat"><b>Dikkat</b><span>' + ekbArYalit(d.dikkat) + '</span></div>';

    /* Kapanış animasyonu sürerken yeni bir ek açılırsa, eski kapanışın
       zamanlayıcısı yeni perdeyi gizlemesin diye iptal edilir. */
    if (window._ekbKapatZaman) { clearTimeout(window._ekbKapatZaman); window._ekbKapatZaman = null; }
    perde.style.display = 'flex';
    requestAnimationFrame(function () { perde.classList.add('ekb-acik'); });
    return true;
};

window.ekBilgiKapat = function () {
    var perde = document.getElementById('ek-bilgi-perde');
    if (!perde) return;
    perde.classList.remove('ekb-acik');
    if (window._ekbKapatZaman) clearTimeout(window._ekbKapatZaman);
    window._ekbKapatZaman = setTimeout(function () {
        perde.style.display = 'none'; window._ekbKapatZaman = null;
    }, 200);
};

/* Escape ile de kapansın */
document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var perde = document.getElementById('ek-bilgi-perde');
    if (perde && perde.style.display === 'flex') window.ekBilgiKapat();
});

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
    
    if (menu.style.display === "flex" || menu.style.display === "grid" || menu.style.display === "block") {
        menu.style.display = "none";
        return;
    }

    const rect = e.target.getBoundingClientRect();
    
    let topPos = Math.round(rect.bottom + window.scrollY + 8);
    menu.style.top = `${topPos}px`;
    
    // GEÇİCİ GÖRÜNÜM: Menünün genişliğini okuyabilmek için önce görünmez olarak açıyoruz
    menu.style.visibility = "hidden";
    menu.style.display = "block";
    
    // EKRANIN SAĞINDAN TAŞMAMASI İÇİN MENÜYÜ BUTONUN SOLUNA YASLIYORUZ
    let leftPos = Math.round(rect.left + window.scrollX - menu.offsetWidth + 80); 
    
    // AKILLI SINIR KONTROLÜ
    if (leftPos + menu.offsetWidth > window.innerWidth) {
        leftPos = Math.round(window.innerWidth - menu.offsetWidth - 20);
    }
    if (leftPos < 10) leftPos = 10; 
    
    menu.style.left = `${leftPos}px`;
    menu.style.visibility = "visible";

    if (lastClickedBoxTextSpan) {
        const currentBox = lastClickedBoxTextSpan.closest('.glass-box');
        if (currentBox) updateSuffixHighlights(currentBox);
    }
}

// ===============================================================
// 3. ÖN EK MOTORU (Tetikleyicileri ve Örnek Cümle (!) Butonu Eklenmiş)
// ===============================================================
function applyPrefix(prefix) {
    /* Kutu seçili değilse ekin kendisini anlatan perdeyi aç. */
    if (!lastClickedBoxTextSpan) {
        if (typeof ekBilgiAc === 'function' && ekBilgiAc(prefix)) return;
        return;
    }

    const currentBox = lastClickedBoxTextSpan.closest('.glass-box');

    if (prefix === 'ال' && currentBox && (currentBox.classList.contains("fiil-box") || currentBox.classList.contains("is-verb"))) {
        if(typeof SoundEngine !== "undefined" && SoundEngine.playClose) SoundEngine.playClose();
        currentBox.style.setProperty("border-color", "#FF3B30", "important");
        currentBox.style.setProperty("box-shadow", "0 0 10px #FF3B30", "important");
        setTimeout(() => {
            currentBox.style.borderColor = ""; 
            currentBox.style.boxShadow = "";
        }, 400);
        return;
    }

    let srfWord = lastClickedBoxTextSpan.querySelector('.srf-word');
    if (!srfWord) {
        lastClickedBoxTextSpan.innerHTML = `<span class="srf-word" dir="rtl">${lastClickedBoxTextSpan.innerHTML}</span>`;
        srfWord = lastClickedBoxTextSpan.querySelector('.srf-word');
    }

    if (prefix === 'ال') {
        let existingSuffixSpan = srfWord.querySelector('.added-suffix');
        if (existingSuffixSpan && existingSuffixSpan.dataset.suffix === 'ا') { 
            if(typeof SoundEngine !== "undefined" && SoundEngine.playClose) SoundEngine.playClose();
            if (currentBox) {
                currentBox.style.setProperty("border-color", "#FF3B30", "important");
                currentBox.style.setProperty("box-shadow", "0 0 10px #FF3B30", "important");
                setTimeout(() => {
                    currentBox.style.borderColor = ""; 
                    currentBox.style.boxShadow = "";
                }, 400);
            }
            return; 
        }
    }

    let rawText = srfWord.textContent.replace(/[\s\u200C\u200D\uFEFF]/g, "");
    let existingPrefixSpan = srfWord.querySelector('.added-prefix');
    let displayPrefix = prefix; 

    if (existingPrefixSpan) {
        let oldPrefix = existingPrefixSpan.dataset.prefix;
        existingPrefixSpan.remove(); 
        
        if ((oldPrefix === 'لِ' || oldPrefix === 'لَ') && rawText.replace(oldPrefix, "").match(/^ل[\u064B-\u0652]*[\u0621-\u064A]/)) {
            srfWord.insertAdjacentHTML('afterbegin', '<span class="srf-char restored-elif" style="color: #000000 !important;">ا&zwj;</span>');
        }
        
        if (oldPrefix === 'ال') {
            let firstSpan = srfWord.querySelector('.srf-char');
            if (firstSpan) {
                firstSpan.innerHTML = firstSpan.innerHTML.replace(/\u0651/g, ''); 
            }
        }

        let cleanupChar = srfWord.querySelector('.srf-char:not(.added-suffix)');
        if (cleanupChar) {
            cleanupChar.innerHTML = cleanupChar.innerHTML.replace(/^(&zwj;|‍|ـ)+/, '');
        }

        if (oldPrefix === prefix) {
            // AYNI BUTONA TIKLANDIYSA EKLENTİ İPTAL OLDU. SARI VURGUYU GERİ GETİR
            if (currentBox) updateSuffixHighlights(currentBox);
            return; 
        }

        rawText = srfWord.textContent.replace(/[\s\u200C\u200D\uFEFF]/g, "");
    }

    if (prefix === 'ال' && rawText.startsWith('ال')) return; 

    if ((prefix === 'لِ' || prefix === 'لَ') && rawText.match(/^ا[\u064B-\u0652]*ل/)) {
        let firstCharSpan = srfWord.querySelector('.srf-char:not(.added-suffix)');
        if (firstCharSpan && firstCharSpan.textContent.includes('ا')) firstCharSpan.remove();
        else {
            let restoredElif = srfWord.querySelector('.restored-elif');
            if (restoredElif) restoredElif.remove();
        }
    }

    if (prefix === 'ال') {
        let allChars = srfWord.querySelectorAll('.srf-char');
        if (allChars.length > 0) {
            let lastCharSpan = allChars[allChars.length - 1]; 
            let txt = lastCharSpan.innerHTML;
            txt = txt.replace(/\u064C/g, '\u064F'); 
            txt = txt.replace(/\u064D/g, '\u0650'); 
            txt = txt.replace(/\u064Bا?/g, '\u064E'); 
            lastCharSpan.innerHTML = txt;
        }
    }

    if (prefix === 'ال') {
        let firstLetter = rawText.replace(/[\u064B-\u0652\u0670]/g, '').charAt(0);
        const semsiHarfler = ['ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن'];
        let firstSpan = srfWord.querySelector('.srf-char:not(.added-suffix)');

        if (semsiHarfler.includes(firstLetter)) {
            displayPrefix = 'اَل'; 
            if (firstSpan && !firstSpan.innerHTML.includes('\u0651')) {
                firstSpan.innerHTML = firstSpan.innerHTML.replace(/^([^\u064B-\u0652\u0670]+)/, '$1\u0651');
            }
        } else {
            displayPrefix = 'اَلْ'; 
        }
    }

    let connectsLeft = (prefix !== 'وَ'); 
    let prefixZwj = connectsLeft ? "&zwj;" : "";

    let greenPrefixHTML = `<span class="srf-char added-prefix" data-prefix="${prefix}" style="color: #007AFF !important;">${displayPrefix}${prefixZwj}</span>`;
    srfWord.insertAdjacentHTML('afterbegin', greenPrefixHTML);

    if (connectsLeft) {
        let allCharsNow = srfWord.querySelectorAll('.srf-char');
        if (allCharsNow.length > 1) {
            let actualFirstChar = allCharsNow[1]; 
            if (!actualFirstChar.innerHTML.startsWith('&zwj;') && !actualFirstChar.innerHTML.startsWith('‍')) {
                actualFirstChar.innerHTML = '&zwj;' + actualFirstChar.innerHTML;
            }
        }
    }

    // =============================================================
    // KUTU EFEKTLERİ, SARI VURGU TEMİZLİĞİ VE BİLGİ BUTONU (!)
    // =============================================================
    lastClickedBoxTextSpan.style.whiteSpace = "nowrap";
    lastClickedBoxTextSpan.style.wordBreak = "keep-all";
    if (currentBox) {
        currentBox.style.minWidth = "max-content"; 
        currentBox.style.transition = "transform 0.1s ease";
        currentBox.style.transform = "scale(1.05)";
        setTimeout(() => { currentBox.style.transform = ""; }, 150);

        const clone = document.getElementById('crisp-zoom-clone');
        if (clone) {
            const cloneTextEl = clone.querySelector('.ar, .ar-small');
            if (cloneTextEl) cloneTextEl.innerHTML = lastClickedBoxTextSpan.innerHTML;
        }

        // İŞTE BURASI: Ek eklendikten sonra sarı vurguyu anında günceller/kapatır
        if (typeof updateSuffixHighlights === 'function') updateSuffixHighlights(currentBox);

        // Eklenen eke ait bir Örnek Cümle (!) varsa onu da getirir
        if (typeof checkWordEasterEgg === "function") {
            let standardize = (t) => {
                if (!t) return "";
                return t.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().replace(/[یى]/g, 'ي').replace(/[\u0640\u064B-\u0652]/g, '').replace(/\u064E\u0651/g, '\u0651\u064E');
            };
            checkWordEasterEgg(currentBox, standardize(prefix));
        }
    }
    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
    
    // YENİ: Ek eklendikten sonra + menüsünü otomatik kapatır
    const menu = document.getElementById("suffix-dropdown");
    if (menu) menu.style.display = "none";
}

// ===============================================================
// 3. EKLERİ UYGULAYAN MOTOR (GÜVENLİ VERSİYON)
// ===============================================================
function applySuffix(rawSuffix) {
    if (!lastClickedBoxTextSpan) {
        if (typeof ekBilgiAc === 'function' && ekBilgiAc(rawSuffix)) return;
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
        if (pure === 'ية' || pure === 'يه') return 'يَّة';
        if (pure === 'يات') return 'يَّات';
        if (pure === 'ي') return 'يّ';
        if (pure === 'يا') return 'يًّا'; 
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
            if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[currentRoot] && sozlukVerileri[currentRoot][refId]) {
                // HATA BURADAYDI ÇÖZÜLDÜ: Eğer kelimenin base'i (yalın hali) yoksa çökmesini engelleyen güvenlik kontrolü eklendi.
                const eggObj = sozlukVerileri[currentRoot][refId];
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
        'يَّتَانِ', 'يَّتَيْنِ', 'تَانِ', 'تَيْنِ', 'يَّانِ', 'يَّيْنِ', 
        'يُّونَ', 'يِّينَ', 'يَّات', 'يَّة', 'يًّا', 
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
        if (suffix === 'ة') suffix = 'يَّة';
        else if (suffix === 'ات') suffix = 'يَّات';
        else if (suffix === 'انِ') suffix = 'يَّانِ';
        else if (suffix === 'يْنِ') suffix = 'يَّيْنِ';
        else if (suffix === 'ونَ') suffix = 'يُّونَ';
        else if (suffix === 'ينَ') suffix = 'يِّينَ';
        else if (suffix === 'ا') suffix = 'يًّا'; 
    }
    else if (existingSuffix === 'يَّة' || existingSuffix === 'يَّات') {
        if (suffix === 'انِ') suffix = 'يَّتَانِ';
        else if (suffix === 'يْنِ') suffix = 'يَّتَيْنِ';
        else if (suffix === 'ونَ') suffix = 'يُّونَ';
        else if (suffix === 'ينَ') suffix = 'يِّينَ';
        else if (suffix === 'ة') suffix = 'يَّة';
        else if (suffix === 'ات') suffix = 'يَّات';
        else if (suffix === 'يّ') suffix = 'يّ';
    }
    else if (['انِ', 'يْنِ', 'تَانِ', 'تَيْنِ', 'يَّانِ', 'يَّيْنِ', 'يَّتَانِ', 'يَّتَيْنِ'].includes(existingSuffix)) {
        if (suffix === 'انِ' || suffix === 'يْنِ') {
            if (existingSuffix.includes('يَّتَ')) suffix = suffix === 'انِ' ? 'يَّتَانِ' : 'يَّتَيْنِ';
            else if (existingSuffix.includes('يَّ')) suffix = suffix === 'انِ' ? 'يَّانِ' : 'يَّيْنِ';
            else if (existingSuffix.includes('تَ')) suffix = suffix === 'انِ' ? 'تَانِ' : 'تَيْنِ';
        } else if (suffix === 'ة') {
            if (existingSuffix.includes('يَّ')) suffix = existingSuffix.includes('انِ') ? 'يَّتَانِ' : 'يَّتَيْنِ';
            else suffix = existingSuffix.includes('انِ') ? 'تَانِ' : 'تَيْنِ';
        } else if (suffix === 'يّ') { 
            if (existingSuffix.includes('تَ')) suffix = existingSuffix.includes('انِ') ? 'يَّتَانِ' : 'يَّتَيْنِ';
            else suffix = existingSuffix.includes('انِ') ? 'يَّانِ' : 'يَّيْنِ';
        }
    }
    else if (['ونَ', 'ينَ', 'يُّونَ', 'يِّينَ'].includes(existingSuffix)) {
        if (suffix === 'ونَ' || suffix === 'ينَ') {
            if (existingSuffix.includes('يُّ') || existingSuffix.includes('يِّ')) {
                suffix = suffix === 'ونَ' ? 'يُّونَ' : 'يِّينَ';
            }
        } else if (suffix === 'يّ') {
            suffix = existingSuffix.includes('ونَ') ? 'يُّونَ' : 'يِّينَ';
        }
    }
    else if (existingSuffix === 'يًّا') { 
        if (suffix === 'ا') suffix = 'يًّا'; 
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
            if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[currentRoot] && sozlukVerileri[currentRoot][refId]) {
                const eggObj = sozlukVerileri[currentRoot][refId];
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
    
    // YENİ: Ek eklendikten sonra + menüsünü otomatik kapatır
    const menu = document.getElementById("suffix-dropdown");
    if (menu) menu.style.display = "none";
}

// ===============================================================
// 4. SON EK (SUFFIX) MOTORU (Bağlanmayan Harflerde Doğru Form Zekası)
// ===============================================================
function applySuffix(suffix) {
    /* Kutu seçili değilse ekin kendisini anlatan perdeyi aç. */
    if (!lastClickedBoxTextSpan) {
        if (typeof ekBilgiAc === 'function' && ekBilgiAc(suffix)) return;
        return;
    }
    const currentBox = lastClickedBoxTextSpan.closest('.glass-box');

    // FİİL ZIRHI
    if (currentBox && (currentBox.classList.contains("fiil-box") || currentBox.classList.contains("is-verb"))) {
        if(typeof SoundEngine !== "undefined" && SoundEngine.playClose) SoundEngine.playClose();
        return;
    }

    // RENK MOTORU (COLORENGINE) KILIFINA SIZMA
    let srfWord = lastClickedBoxTextSpan.querySelector('.srf-word');
    if (!srfWord) {
        lastClickedBoxTextSpan.innerHTML = `<span class="srf-word" dir="rtl">${lastClickedBoxTextSpan.innerHTML}</span>`;
        srfWord = lastClickedBoxTextSpan.querySelector('.srf-word');
    }

    // GRAMER ZIRHI 2: "ال" TAKISI İLE TENVİN YAN YANA GELEMEZ!
    let hasAl = false;
    let existingPrefixSpan = srfWord.querySelector('.added-prefix');
    
    if (existingPrefixSpan && existingPrefixSpan.dataset.prefix === 'ال') {
        hasAl = true;
    } else {
        let rawTxt = srfWord.textContent.replace(/[\s\u200C\u200D\uFEFF\u064B-\u0652\u0670]/g, "");
        if (rawTxt.startsWith('ال')) hasAl = true;
    }

    if (suffix === 'ا' && hasAl) {
        if(typeof SoundEngine !== "undefined" && SoundEngine.playClose) SoundEngine.playClose();
        if (currentBox) {
            currentBox.style.setProperty("border-color", "#FF3B30", "important");
            currentBox.style.setProperty("box-shadow", "0 0 10px #FF3B30", "important");
            setTimeout(() => {
                currentBox.style.borderColor = ""; 
                currentBox.style.boxShadow = "";
            }, 400);
        }
        return; 
    }

    let existingSuffixSpan = srfWord.querySelector('.added-suffix');

    // ZATEN BİR SON EK VARSA: TEMİZLE VE GERİ AL
    if (existingSuffixSpan) {
        let oldSuffix = existingSuffixSpan.dataset.suffix;
        existingSuffixSpan.remove(); 
        
        let changedTe = srfWord.querySelector('.changed-te');
        if (changedTe) {
            changedTe.innerHTML = changedTe.innerHTML.replace('ت', 'ة');
            changedTe.classList.remove('changed-te');
        }
        
        let hiddenTe = srfWord.querySelector('.hidden-te');
        if (hiddenTe) {
            hiddenTe.style.display = 'inline';
            hiddenTe.classList.remove('hidden-te');
        }

        let coreCharsForCleanup = srfWord.querySelectorAll('.srf-char:not(.added-prefix):not(.added-suffix)');
        if (coreCharsForCleanup.length > 0) {
            let lastRealChar = coreCharsForCleanup[coreCharsForCleanup.length - 1];
            lastRealChar.innerHTML = lastRealChar.innerHTML.replace(/(&zwj;|‍|ـ)+(\s*)$/, '$2');
        }

        if (oldSuffix === suffix) {
            if (typeof updateSuffixHighlights === 'function') updateSuffixHighlights(currentBox);
            return; 
        }
    }

    // İŞTE SİHİRLİ KISIM: SON HARFİ BUL VE HAREKESİNİ/DURUMUNU DEĞİŞTİR
    let coreChars = srfWord.querySelectorAll('.srf-char:not(.added-prefix):not(.added-suffix)');
    let actualLastChar = coreChars.length > 0 ? coreChars[coreChars.length - 1] : null;
    let displaySuffix = suffix;

    if (actualLastChar) {
        let baseCharText = actualLastChar.textContent.replace(/[\u064B-\u0652\u0670\u200C\u200D\uFEFF]/g, '').trim();
        
        if (baseCharText === 'ة') {
            if (suffix === 'انِ' || suffix === 'يْنِ') {
                actualLastChar.innerHTML = actualLastChar.innerHTML.replace('ة', 'ت');
                actualLastChar.classList.add('changed-te');
            } else if (suffix === 'ات' || suffix === 'يَّة' || suffix === 'يَّات') {
                actualLastChar.style.display = 'none';
                actualLastChar.classList.add('hidden-te');
                actualLastChar = coreChars.length > 1 ? coreChars[coreChars.length - 2] : actualLastChar;
            }
        }

        let vowelToSet = '';
        if (suffix === 'يْنِ') vowelToSet = 'َ'; 
        else if (suffix.startsWith('ي')) vowelToSet = 'ِ'; 
        else if (suffix.startsWith('ة') || suffix.startsWith('ات') || suffix.startsWith('انِ') || suffix.startsWith('تَ')) vowelToSet = 'َ'; 
        else if (suffix.startsWith('ونَ')) vowelToSet = 'ُ'; 
        else if (suffix === 'ا') {
            vowelToSet = 'ً'; 
            let pureWord = srfWord.textContent.replace(/[\u064B-\u0650\u0652\s\u200C\u200D\uFEFF]/g, '');
            if (pureWord.endsWith('ة') || pureWord.endsWith('اء') || pureWord.endsWith('ى') || pureWord.endsWith('ا')) {
                displaySuffix = ''; 
            }
        }

        if (vowelToSet !== '') {
            let html = actualLastChar.innerHTML;
            html = html.replace(/[\u064B-\u0650\u0652]/g, ''); 
            html = html.replace(/([^\s>])(\s*(?:<\/span>)?\s*)$/, '$1' + vowelToSet + '$2');
            actualLastChar.innerHTML = html;
        }
    }

    // =============================================================
    // YENİ: BAĞLANABİLİRLİK KONTROLÜ (Zorunlu köprüyü iptal eder)
    // =============================================================
    let connectsRight = true;
    if (actualLastChar) {
        let finalCharText = actualLastChar.textContent.replace(/[\u064B-\u0652\u0670\u200C\u200D\uFEFF]/g, '').trim();
        const nonConnecting = ['د', 'ذ', 'ر', 'ز', 'و', 'ا', 'أ', 'إ', 'آ', 'ؤ', 'ى', 'ء'];
        if (finalCharText.length > 0 && nonConnecting.includes(finalCharText.slice(-1))) {
            connectsRight = false; // Son harf bağlanmıyorsa köprüyü iptal et
        }
    }

    // MAVİ SON EK OLUŞTUR VE KELİMENİN SONUNA EKLE
    if (displaySuffix !== '') {
        // Eğer bağlanıyorsa &zwj; koy, bağlanmıyorsa koyma!
        let suffixZwj = connectsRight ? "&zwj;" : "";
        let blueSuffixHTML = `<span class="srf-char added-suffix" data-suffix="${suffix}" style="color: #007AFF !important;">${suffixZwj}${displaySuffix}</span>`;
        srfWord.insertAdjacentHTML('beforeend', blueSuffixHTML);
    }

    // BAĞLANAN HARF İSE ZWJ KÖPRÜSÜ ZERK ET
    if (actualLastChar && displaySuffix !== '' && connectsRight) {
         if (!actualLastChar.innerHTML.endsWith('&zwj;') && !actualLastChar.innerHTML.endsWith('‍')) {
             actualLastChar.innerHTML = actualLastChar.innerHTML + '&zwj;';
         }
    }

    // =============================================================
    // KUTU EFEKTLERİ, SARI VURGU TEMİZLİĞİ VE BİLGİ BUTONU (!)
    // =============================================================
    lastClickedBoxTextSpan.style.whiteSpace = "nowrap";
    lastClickedBoxTextSpan.style.wordBreak = "keep-all";
    
    if (currentBox) {
        currentBox.style.minWidth = "max-content"; 
        currentBox.style.paddingLeft = "8px"; 
        currentBox.style.paddingRight = "8px";
        currentBox.style.paddingRight = "8px";
        currentBox.style.transition = "transform 0.1s ease";
        currentBox.style.transform = "scale(1.05)";
        setTimeout(() => { currentBox.style.transform = ""; }, 150);

        const clone = document.getElementById('crisp-zoom-clone');
        if (clone) {
            const cloneTextEl = clone.querySelector('.ar, .ar-small');
            if (cloneTextEl) cloneTextEl.innerHTML = lastClickedBoxTextSpan.innerHTML;
        }

        if (typeof updateSuffixHighlights === 'function') updateSuffixHighlights(currentBox);

        if (typeof checkWordEasterEgg === "function") {
            let standardize = (t) => {
                if (!t) return "";
                let original = t.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().replace(/[یى]/g, 'ي');
                let pure = original.replace(/[\u0640\u064B-\u0652]/g, '');
                if (pure === 'ا') return 'ا';
                if (pure === 'ية' || pure === 'يه' || pure === 'يّة') return 'يَّة';
                if (pure === 'يات' || pure === 'يَّات') return 'يَّات';
                if (pure === 'ي') return 'يّ';
                if (pure === 'يا') return 'يًّا';
                return original.replace(/\u064E\u0651/g, '\u0651\u064E');
            };
            checkWordEasterEgg(currentBox, standardize(suffix));
        }
    }
    
    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
    
    // YENİ: Ek eklendikten sonra + menüsünü otomatik kapatır
    const menu = document.getElementById("suffix-dropdown");
    if (menu) menu.style.display = "none";
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
    // { id: "keyboard-overlay", closeFn: window.closeKeyboard }
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

function checkWordEasterEgg(boxElement, incomingSuffix = null, silentEmoji = false, isInitialLoad = false) {
    const desktopPlus = document.querySelector('.fa-plus');
    const mobilePlus = document.getElementById('mobile-top-plus');

    if (!boxElement || !currentRoot || currentRoot.length !== 3) return;
    if (!boxElement.classList.contains('kok-turendi')) return;

    const refEl = boxElement.querySelector('.ref');
    if (!refEl) return;
    let refId = parseInt(refEl.innerText);
    if (isNaN(refId)) refId = (refEl.innerText || '').trim();
    const isVerb = boxElement.classList.contains('fiil-box');

    // ===============================================================
    // 1. HAFIZA SİSTEMİ
    // ===============================================================
    if (incomingSuffix) {
        boxElement.setAttribute('data-active-suffix', incomingSuffix);
    }
    let activeSuffix = boxElement.getAttribute('data-active-suffix');

    if (typeof sozlukVerileri === 'undefined' || !sozlukVerileri[currentRoot] || !sozlukVerileri[currentRoot][refId]) {
        if (!isVerb) {
            boxElement.classList.remove('coklu-kullanim');
            refEl.removeAttribute('onclick');
        }
        return;
    }

    const eggObj = sozlukVerileri[currentRoot][refId];
    const textEl = boxElement.querySelector('.ar, .ar-small');

    // ===============================================================
    // 4. SES OLAYLARINI EZME SİSTEMİ
    // ===============================================================
    let searchKey = activeSuffix;
    
    let stdFn = (t) => {
        if (!t) return "";
        let original = t.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().replace(/[یى]/g, 'ي');
        let pure = original.replace(/[\u0640\u064B-\u0652]/g, '');
        if (pure === 'ا') return 'ا';
        if (pure === 'ية' || pure === 'يه' || pure === 'يّة') return 'يَّة';
        if (pure === 'يات' || pure === 'يَّات') return 'يَّات';
        if (pure === 'ي') return 'يّ';
        if (pure === 'يا') return 'يًّا';
        return original.replace(/\u064E\u0651/g, '\u0651\u064E');
    };

    let matchedKey = null;
    if (activeSuffix) {
        for (let k in eggObj) {
            if (k !== 'base' && k !== 'ornek' && k !== 'cekimi' && k !== 'suggestsPlus' && k !== 'tip' && k !== 'isDictOnly' && k !== 'cogulId' && k !== 'tekilId' && k !== 'autoGenerated' && k !== 'not' && k !== 'kuralliCogul' && k !== 'isHiddenInList' && k !== 'hasZamirCekimi' && k !== 'zamirBase' && k !== 'cogulTr' && k !== 'isNotVerb' && k !== 'tekil' && k !== 'cogul') {
                if (stdFn(k) === activeSuffix) {
                    matchedKey = k;
                    break;
                }
            }
        }
    }
    
    if (matchedKey) {
        searchKey = matchedKey;
    } else if (activeSuffix === "يَّة" && eggObj["ة"]) {
        searchKey = "ة";
    } else if (activeSuffix === "يَّات" && eggObj["ات"]) {
        searchKey = "ات";
    }

    let activeKey = (searchKey && eggObj[searchKey]) ? searchKey : "base";
    let targetText = eggObj[activeKey] ? eggObj[activeKey].arText : null;
    
    let shouldOverwriteText = true;
    if (activeSuffix && activeKey === "base") {
        shouldOverwriteText = false; // Ekin sözlükte karşılığı yoksa, görsel olarak eklenen eki ezme!
    }
    
    if (targetText && shouldOverwriteText) {
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

    if (hasTableData) {
        if (!isInitialLoad) {
            boxElement.classList.add('coklu-kullanim');
        }
        if (!isVerb) {
            refEl.setAttribute('onclick', `
                event.preventDefault(); 
                event.stopPropagation(); 
                const box = this.closest('.glass-box'); 
                lastClickedBoxTextSpan = box.querySelector('.ar, .ar-small'); 
                lastOriginalWord = box.getAttribute('data-original'); 
                openConjugationPopup('${currentRoot}', ${refId}, 'isim', '');
            `);
        }
    }

    // ===============================================================
    // 6. GÖRSEL ANİMASYONLAR VE EMOJİLER
    // ===============================================================
    if (!activeSuffix && eggObj.suggestsPlus) {
        if (typeof lastClickedBoxTextSpan !== 'undefined' && lastClickedBoxTextSpan === textEl) {
            if (desktopPlus) desktopPlus.classList.add('plus-highlighted');
            if (mobilePlus) mobilePlus.classList.add('plus-highlighted');
        }
        
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
        if (typeof lastClickedBoxTextSpan !== 'undefined' && lastClickedBoxTextSpan === textEl) {
            if (desktopPlus) desktopPlus.classList.remove('plus-highlighted');
            if (mobilePlus) mobilePlus.classList.remove('plus-highlighted');
        }
        
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
                if (silentEmoji) {
                    emojiDiv.className = 'elegant-emoji'; 
                    emojiDiv.style.display = 'none';
                } else {
                    const boxRect = boxElement.getBoundingClientRect();
                    const isTop = boxRect.top < 250; 
                    const isLeft = (boxRect.left + boxRect.width / 2) < (window.innerWidth / 2); 

                    let animClass = 'pop-up-right'; 
                    if (isTop && isLeft) animClass = 'pop-down-right';
                    else if (isTop && !isLeft) animClass = 'pop-down-left';
                    else if (!isTop && isLeft) animClass = 'pop-up-right';
                    else if (!isTop && !isLeft) animClass = 'pop-up-left';

                    emojiDiv.className = `elegant-emoji ${animClass}`; 
                    
                    boxElement.style.zIndex = "999999";
                    
                    emojiDiv.addEventListener('animationend', (e) => {
                        e.target.style.display = 'none'; 
                        boxElement.style.zIndex = ""; 
                    });
                }
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
                        <div style="font-family: 'Arakom', sans-serif; font-size: 30px; color: #000000; direction: ltr; line-height: 1.4; text-align: center;">${orn.tr}</div>
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

        const currentRootSafe = (typeof currentRoot !== 'undefined') ? currentRoot : "";
        if (currentRootSafe.length === 3) {
            const rootClone = document.createElement('div');
            rootClone.id = 'crisp-root-clone';
            rootClone.className = 'crisp-root-clone draggable-root-clone';
            rootClone.style.setProperty('pointer-events', 'auto', 'important');
            rootClone.style.setProperty('cursor', 'grab', 'important');
            
            let displayRoot = (typeof formatArabicRoot === 'function') ? formatArabicRoot(currentRootSafe) : currentRootSafe;
            rootClone.innerHTML = `<span class="ar-root">${displayRoot}</span>`;
            
            document.body.appendChild(rootClone);
            
            // Sürüklenebilir yap
            setTimeout(() => {
                if (typeof makeElementDraggable === 'function') {
                    makeElementDraggable(rootClone);
                }
            }, 50);
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
            .matrix-fullscreen-table th { font-size: 28px !important; padding: 8px !important; }
            .matrix-fullscreen-table td { padding: 0 1vw !important; height: auto !important; }
            .matrix-fullscreen-table .siga-text { font-size: 80px !important; }
            .matrix-fullscreen-table .siga-text span { margin-right: 10px; }
            .matrix-fullscreen-table .ornek-box { margin-top: 20px; padding: 25px; border-radius: 20px; }
            .matrix-fullscreen-table .ornek-box div:first-child { font-size: 55px !important; line-height: 1.5; }
            .matrix-fullscreen-table .ornek-box div:last-child { font-size: 35px !important; margin-top: 15px; }
            .matrix-fullscreen-table .siga-tr-text { font-size: 35px !important; margin-top: 5px !important; }
            .matrix-fullscreen-table .spacer-row td { height: 20px !important; }
            .matrix-fullscreen-overlay .carousel-nav-btn { width: 70px !important; height: 70px !important; font-size: 35px !important; }
            .matrix-fullscreen-overlay .right-btn { right: 30px !important; }
            .matrix-fullscreen-overlay .left-btn { left: 30px !important; }
        `;
        document.head.appendChild(style);
    }
    
    const contentArea = fullscreenOverlay.querySelector('.matrix-fullscreen-content');
    const oldWrapper = contentArea.querySelector('.matrix-fullscreen-table-wrapper');
    if (oldWrapper) oldWrapper.remove();
    
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'matrix-fullscreen-table-wrapper';
    tableWrapper.style.width = '100%'; 
    tableWrapper.style.margin = '15px 0'; 
    tableWrapper.style.maxWidth = '100%';
    tableWrapper.style.height = 'calc(100% - 30px)'; 
    tableWrapper.style.maxHeight = 'calc(100% - 30px)'; 
    tableWrapper.style.overflow = 'hidden'; 
    tableWrapper.style.borderRadius = '0';
    tableWrapper.style.boxShadow = 'none';
    tableWrapper.style.backgroundColor = 'transparent';

    // ========================================================
    // YENİ CAROUSEL SİSTEMİNİ KLONLA VE ÖLÇEKLENDİR!
    // ========================================================
    const originalCarouselOuter = boxElement.querySelector('.carousel-container-outer');
    if (originalCarouselOuter) {
        const outerClone = originalCarouselOuter.cloneNode(true);
        outerClone.style.marginTop = '0';
        outerClone.style.height = '100%';
        
        // Tabloları büyütmek için sınıflarını güncelle
        const tables = outerClone.querySelectorAll('.conjugation-table');
        tables.forEach(table => {
            table.className = 'conjugation-table matrix-fullscreen-table';
            table.style.margin = '0'; 
            table.style.height = '100%'; 
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
        });
        
        // Sadece dikey scroll kısıtlamalarını kaldır ki 14 satır dikeyde sığsın
        const scrollContainers = outerClone.querySelectorAll('.hide-scrollbars');
        scrollContainers.forEach(container => {
            container.style.height = '100%';
            container.style.maxHeight = 'none';
            container.style.overflowY = 'visible';
            container.style.scrollbarWidth = 'none';
        });
        
        // Carousel yatay kaydırma özelliklerini KORU
        const carouselInner = outerClone.querySelector('.conjugation-carousel');
        if (carouselInner) {
            carouselInner.style.height = '100%';
            carouselInner.style.maxHeight = 'none';
            carouselInner.style.overflowY = 'visible';
        }

        // Sürükleme fonksiyonunu yeniden bağla
        const newCarousel = outerClone.querySelector('.conjugation-carousel');
        if (newCarousel && window.initCarouselDrag) {
            // Butonları da güncelle (this referansları bozulmasın diye innerHTML vs gerekmez, 
            // onclick zaten 'scrollConjugationCarousel(-1, this)' string olduğu için çalışır).
            // Fakat inline container referansı wrapper üzerinden bulunur.
            setTimeout(() => { window.initCarouselDrag(newCarousel); }, 50);
        }

        tableWrapper.appendChild(outerClone);

        // Hangi tabloda kalındıysa onu tam ekranda da aç:
        const origCarousel = originalCarouselOuter.querySelector('.conjugation-carousel');
        if (origCarousel && newCarousel) {
            let activeIndex = Math.round(origCarousel.scrollLeft / origCarousel.clientWidth);
            if (isNaN(activeIndex)) activeIndex = 0;
            setTimeout(() => {
                newCarousel.scrollLeft = activeIndex * newCarousel.clientWidth;
            }, 60);
        }
    } else {
        // Eski fallback
        const originalTable = boxElement.querySelector('.conjugation-table');
        if (originalTable) {
            const table = document.createElement('table');
            table.className = 'conjugation-table matrix-fullscreen-table';
            table.style.margin = '0'; 
            table.style.height = '100%'; 
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.innerHTML = originalTable.innerHTML;
            tableWrapper.appendChild(table);
        }
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

    const wildcardContainer = document.getElementById('wildcard-container');
    if (wildcardContainer) wildcardContainer.innerHTML = ''; // Önceki joker kutuları temizle

    if (!root || root.length !== 3 || !sozlukVerileri[root]) return;

    const refs = getSortedRefsForRoot(root);
    refs.forEach(refId => {
        let targetBox = Array.from(document.querySelectorAll('.glass-box')).find(b => {
            const refEl = b.querySelector('.ref');
            return refEl && parseInt(refEl.innerText.trim()) === refId;
        });

        // -------------------------------------------------------------
        // JOKER KUTU MANTIĞI: Eğer bu kalıp ID'si HTML'de yoksa, 
        // dinamik bir Joker (Extra) kutu oluştur!
        // -------------------------------------------------------------
        if (!targetBox && wildcardContainer) {
            const newBox = document.createElement('div');
            newBox.className = 'glass-box wildcard-box';
            newBox.setAttribute('data-ref', refId);
            newBox.setAttribute('data-original', '?');
            newBox.style.paddingBottom = '8px'; // Ayn harfi vb. taşmasını önlemek için
            
            // handleBoxClick fonksiyonunun çalışabilmesi için standart iç yapı
            newBox.innerHTML = `
                <div class="ref" style="opacity: 0; pointer-events: none;">${refId}</div>
                <div class="ar-small" style="font-family: 'Inter', sans-serif; color: #d35400;">?</div>
            `;
            
            // Tüm tıklama ve animasyon mantığını standart sisteme devret!
            newBox.onclick = function(e) {
                if (typeof handleBoxClick === 'function') {
                    handleBoxClick(this);
                }
            };
            
            wildcardContainer.appendChild(newBox);
            targetBox = newBox; // Aşağıdaki 'sari-vurgu' vs. eklenebilmesi için referansı targetBox yap
        }
        // -------------------------------------------------------------

        if (targetBox) {
            targetBox.classList.add('sari-vurgu');
            
            // KULLANICI İSTEĞİ: Sadece فعل kökü için kutuları tam "tıklanmış" (türetilmiş, yeşil) durumuna getir
            if (root === "فعل") {
                targetBox.classList.remove('sari-vurgu');
                targetBox.classList.add('kok-turendi');
                targetBox.style.setProperty("background-color", "#bfffdf", "important");
                targetBox.style.borderColor = "#000000";
                targetBox.setAttribute('data-tiklama-sayisi', '3'); // Tıklanmış aşamasında kalsın (bir sonraki tık sıfırlar)
                
                const targetEl = targetBox.querySelector('.ar, .ar-small');
                if (targetEl) {
                    const kalip = targetBox.getAttribute('data-original');
                    let plainWord = kalip;
                    const mapping = typeof getBabAndType === 'function' ? getBabAndType(refId) : null;
                    
                    if (mapping && typeof applyRootToKalip === 'function') {
                        let bNo = mapping.babNo || 1;
                        let kalipMetni = kalip.replace(/[\u064B-\u0652]/g, ""); 
                        plainWord = applyRootToKalip(root, kalipMetni, bNo, refId);
                    } else if (typeof applyRootToKalip === 'function') {
                        let kalipMetni = kalip.replace(/[\u064B-\u0652]/g, "");
                        plainWord = applyRootToKalip(root, kalipMetni);
                    }
                    
                    targetEl.innerHTML = typeof ColorEngine !== 'undefined' ? ColorEngine.colorize(plainWord, root.split("")) : plainWord;
                }
                
                if (typeof checkWordEasterEgg === 'function') {
                    checkWordEasterEgg(targetBox, null, true);
                }
            }
        }
    });
}

// ==============================================================================
// EVRENSEL ÇEKİM ÜRETİCİ (DRY PRENSİBİ - TÜM SİSTEMLER BURAYI KULLANIR)
// ==============================================================================
window.buildConjCell = function(w, tip, numBab, tableType, isColorActive, kok, wordIndex) {
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
                    coreWord = clean.replace(/[\u064B-\u0652]+$/, '\u0651\u064E'); // Kusursuz لَمْ يَضُرَّ
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
        else if (tableType === 'len') {
            prefix = "لَنْ";
            const duals = [1, 4, 7, 10];
            const pluralMasc = [2, 8];
            const singFem = [9];
            const pluralFem = [5, 11];
            if (duals.includes(wordIndex)) coreWord = clean.replace(/نِ?$/, '');
            else if (pluralMasc.includes(wordIndex)) coreWord = clean.replace(/نَ?$/, 'ا');
            else if (singFem.includes(wordIndex)) coreWord = clean.replace(/نَ?$/, '');
            else if (pluralFem.includes(wordIndex)) coreWord = clean;
            else {
                if (/[\u0651]/.test(clean.slice(-2))) coreWord = clean.replace(/[\u064B-\u0652]+$/, '\u0651\u064E');
                else if (/ُ$/.test(clean)) coreWord = clean.replace(/ُ$/, 'َ');
                else if (/ِي$/.test(clean)) coreWord = clean + 'َ';
                else if (/ُو$/.test(clean)) coreWord = clean + 'َ';
                else if (/َى$/.test(clean)) coreWord = clean;
                else coreWord = clean;
            }
        }

        let coloredCore = (isColorActive && !coreWord.includes('<')) ? ColorEngine.colorize(coreWord, kok.split("")) : coreWord;
        
        if (prefix) return `<span style="color: #000000; font-weight: normal; margin-left: 15px; display: inline-block; direction: rtl;">${prefix}</span><span style="display: inline-block; direction: rtl;">${coloredCore}</span>`;
        return `<span style="display: inline-block; direction: rtl;">${coloredCore}</span>`;
    };

const VerbGenerator = {
    getDynamicAynHareke: function(kokArr, bNo, vezin, rId) {
        // ==========================================
        // KESİN ÇÖZÜM: MUZARİ (CEHD-İ MUTLAK) HAREKE ZIRHI
        // Eğer "lam" (لم) tablosu için 2. Bab (rId=4) gibi spesifik bir Muzari ID'si
        // gönderilmişse, Bab 1 kutusundan gelinmiş olsa bile diğer tüm kuralları ezip
        // orta harfin harekesini doğrudan kendi Muzari aslına sabitler! (يَبُعْ hatasını önler)
        // ==========================================
        // ==========================================
        // 0. MEZİD BÂBLAR: ayn harekesi kökün mücerred harekesine DEĞİL, bâbın
        // kendi veznine bağlıdır. (أَخْرَجَ → أَخْرِجْ; kökün يَخْرُجُ olması etkilemez.)
        // ==========================================
        const nbSabit = Number(bNo);
        if (nbSabit >= 7) {
            if (nbSabit === 12 || nbSabit === 13 || nbSabit === 14) return "َ";
            return "ِ";
        }

        // ==========================================
        // 0.5. VERİ ÖNCELİĞİ: İlgili muzâri kutusu sözlükte tanımlıysa harekeyi
        // doğrudan o kelimeden oku. Böylece "لَفَظَ → يَلْفِظُ" gibi, kutusu
        // 1. bâb görünse de esre alan istisnalar doğru çekilir.
        // ==========================================
        const MUZARI_KARSILIK = { 1: 2, 2: 2, 3: 2, 4: 4, 5: 4, 6: 6, 7: 6, 8: 9, 9: 9, 10: 9, 11: 12, 12: 12, 13: 12, 14: 15, 15: 15, 16: 15 };
        if (MUZARI_KARSILIK[rId] && typeof sozlukVerileri !== 'undefined') {
            const kokVeri = sozlukVerileri[kokArr.join("")];
            const hedef = kokVeri && kokVeri[MUZARI_KARSILIK[rId]];
            const metin = hedef ? (hedef.base ? hedef.base.arText : hedef.arText) : "";
            if (metin) {
                // ECVEF: harekeyi ayn taşımaz, FÂ taşır (يَسِيحُ → سِ, يَقُومُ → قُ, يَخَافُ → خَ)
                if (kokArr[1] === 'و' || kokArr[1] === 'ي' || kokArr[1] === kokArr[2]) {
                    const ecv = metin.match(new RegExp(kokArr[0] + "(?:\u0651)?([\u064E\u064F\u0650])"));
                    if (ecv && ecv[1]) return ecv[1];
                }
                // SÂLİM/DİĞER: ayn'ı FÂ'dan sonra ara ki baştaki muzâri harfi (يَ) yanlış okunmasın
                const eslesme = metin.match(new RegExp(kokArr[0] + "[\u064B-\u0652]*" + kokArr[1] + "(?:\u0651)?([\u064E\u064F\u0650])"));
                if (eslesme && eslesme[1]) return eslesme[1];
            }
        }

        if (rId === 4 || rId === 15) return "ِ"; // 2. ve 6. Bab Muzari -> Kesin Esre (يَبِيعُ, يَحْسِبُ)
        if (rId === 6 || rId === 9)  return "َ"; // 3. ve 4. Bab Muzari -> Kesin Fetha (يَخَافُ, يَعْلَمُ)
        if (rId === 2 || rId === 12) return "ُ"; // 1. ve 5. Bab Muzari -> Kesin Ötre (يَقُولُ, يَعْظُمُ)

        let h = "ُ"; 
        if ([2, 6, 7, 8, 9, 10, 11, 15].includes(bNo) || vezin.includes("يَفْعِلُ") || vezin.includes("يُفْعِلُ") || vezin.includes("يُفَعِّلُ") || vezin.includes("يُفَاعِلُ") || vezin.includes("يَنْفَعِلُ") || vezin.includes("يَفْتَعِلُ") || vezin.includes("يَسْتَفْعِلُ")) h = "ِ"; 
        else if ([3, 4, 12, 13, 14].includes(bNo) || vezin.includes("يَفْعَلُ") || vezin.includes("يَفْعَلُّ") || vezin.includes("يَتَفَعَّلُ") || vezin.includes("يَتَفَاعَلُ")) h = "َ"; 

        let foundInJson = false;
        if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[kokArr.join("")]) {
            let muzari = "";
            let data = sozlukVerileri[kokArr.join("")];
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
            i_r1 = ""; i_t = "تَّ";
        } else if (['ص', 'ض', 'ط', 'ظ'].includes(r1)) {
            if (r1 === 'ط') { i_r1 = ""; i_t = "طَّ"; }
            else { i_t = "طَ"; }
        } else if (['د', 'ذ', 'ز'].includes(r1)) {
            if (r1 === 'د' || r1 === 'ذ') { i_r1 = ""; i_t = "دَّ"; }
            else { i_t = "دَ"; } 
        }
        return i_r1 + i_t + r2 + aynHareke + r3;
    },

    generateVerbList: function(kok, babNo, tip, anaVezin, refId, activeSuffix = null) {
        let kelimeListesi = [];
        let ozelCekimBulundu = false;
        
        if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[kok] && sozlukVerileri[kok][refId]) {
            let eggObj = sozlukVerileri[kok][refId];
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

            // NÂKIS + MEZİD BÂB: fiil üç harften uzunsa lâm-ı fiil daima YÂ olur.
            // دَعَا (mücerred, vâv) → اِدَّعَى / يَدَّعِي / اِدَّعَيْتُ (mezîd, yâ)
            // Mücerredde vâv korunduğu için bu dönüşüm sadece 7+ bâblarda yapılır.
            if (babNo >= 7 && r3 === 'و') { r3 = 'ي'; kokArr = [r1, r2, 'ي']; }

            let isMuzaaf = (kokArr[1] === kokArr[2] && 'ويا'.indexOf(kokArr[1]) === -1 && babNo <= 6);

            list.forEach((siga, index) => {
                let cekilmisKelime = "";
                if (tip === 'muzari') {
                    let coreWord = "";
                    if (babNo === 11) {
                        // İFTİAL + ECVEF: orta harf elife döner → يَخْتَارُ / يَخْتَرْنَ (esre değil fetha)
                        coreWord = this.getIftialCore(kokArr, ((r2 === 'و' || r2 === 'ي') && r3 !== 'و' && r3 !== 'ي') ? "َ" : "ِ"); 
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
                    } else if (babNo === 15 && r2 === r3 && 'ويا'.indexOf(r2) === -1) {
                        // İstif'al babı muzaaf (حقق): idğam (şedde) sakin ekli şahıslarda açılır (fekk-i idğam)
                        let baseSeddeli = `اِسْتَ${r1}َ${r2}`;
                        let baseAcik = `اِسْتَ${r1}ْ${r2}َ${r3}`;
                        let seddeliEkler = ["َّ", "َّا", "ُّوا", "َّتْ", "َّتَا"];
                        if (index < 5) cekilmisKelime = baseSeddeli + seddeliEkler[index];
                        else cekilmisKelime = baseAcik + siga.ek;
                    } else {
                        // MUZAAF + MEZİD BÂB (أَعَدَّ, اِسْتَعَدَّ, تَعَدَّدَ ...):
                        // applyRootToKalip idğamı zaten yapıp "أَعَدَّ" döndürüyor; buna ek
                        // eklenince şedde bozuluyordu. Bu yüzden muzaaf köklerde HAM yerleştirme
                        // (أَعْدَدَ) kullanılır; idğam kararını sonda SarfEngine verir:
                        //   vokalli ek → أَعَدَّتْ · sâkin ek → أَعْدَدْتَ (fekk-i idğam)
                        let tabanKelime;
                        if (r2 === r3 && 'ويا'.indexOf(r2) === -1) {
                            tabanKelime = anaVezin.replace(/ف/g, "\u0000F").replace(/ع/g, "\u0000A").replace(/ل/g, "\u0000L")
                                                  .replace(/\u0000F/g, r1).replace(/\u0000A/g, r2).replace(/\u0000L/g, r3);
                        } else {
                            tabanKelime = (typeof applyRootToKalip === 'function') ? applyRootToKalip(kokArr.join(""), anaVezin) : "";
                        }
                        let stem = tabanKelime ? tabanKelime.replace(/[َُِّْ]$/, "") : "";
                        
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
                        cekilmisKelime = "اِ" + this.getIftialCore(kokArr, ((r2 === 'و' || r2 === 'ي') && r3 !== 'و' && r3 !== 'ي') ? "َ" : "ِ") + siga.suffix;
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
                        // EMİR HEMZESİ:
                        //  • Mücerred bâblarda vasıl hemzesidir ve harekesini ayn'dan alır:
                        //    ayn ötreliyse اُكْتُبْ, esreli/üstünse اِلْفِظْ / اِفْتَحْ.
                        //    (Vezin tablosunda "أُفْعُلْ" yazsa da çekimde vasıl hemzesi kullanılır.)
                        //  • İf'âl bâbında (أَفْعِلْ) ise kat' hemzesidir, üstünlüdür.
                        let emirPrefix = (dynamicAynHareke === "ُ") ? "اُ" : "اِ";
                        if (anaVezin.startsWith("أَ")) emirPrefix = "أَ";
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

                let callOptions = { numBab: babNo, sigaIndex: index, tip: tip };
                if (anaVezin === "أَفْعَل" || anaVezin === "فُعْلَى" || anaVezin === "أَفْعَال") {
                    callOptions.skipIfalEcvef = true;
                }
                
                // KULLANICI İSTİSNASI: Bazı kökler her durumda (Bab belirtilmese bile) esre alır
                const maziKasraIstisnalari = ["نوم", "خوف", "موت"];
                if (maziKasraIstisnalari.includes(kok)) {
                     callOptions.forceMaziKasra = true;
                }

                if (typeof SarfEngine !== 'undefined') cekilmisKelime = SarfEngine.applyRules(cekilmisKelime, kokArr, callOptions);
                kelimeListesi.push(cekilmisKelime);
            });
        }

        // ==============================================================================
        // POPUP EMİR TEKİL MUHATAP KORUMA FİLTRESİ (Ecvef İstif'al Zırhı)
        // ==============================================================================
        // DİKKAT: kokArr yerine doğrudan "kok" stringini kullanıyoruz!
        if (tip === 'emir' && babNo === 15 && (kok[1] === 'و' || kok[1] === 'ي')) {
            // Emir tablosunun 0. indeksi Müfred Müzekker Muhatap (Sen - Erkek) kipidir.
            if (kelimeListesi[0]) {
                // Kelime içindeki hatalı "اِسْتَرْوِحْ" veya "اِسْتَرْيِحْ" kalıplarını ayıklar
                // ve iki sakinin çarpışması (İltika-i Sakineyn) kuralına göre doğrudan "اِسْتَرِحْ" yapar.
                kelimeListesi[0] = kelimeListesi[0].replace(/اِسْتَ([^\u064B-\u0652]*)ْ[وي][َُِ]([^\u064B-\u0652]*)ْ/g, "اِسْتَ$1ِ$2ْ");
                
                // Eğer "روح" köküne özel sert bir takılma varsa tam eşleşmeyle garantiye alalım:
                if (kok === "روح") {
                    kelimeListesi[0] = "اِسْتَرِحْ";
                }
            }
        }

        return kelimeListesi;
    }
};

// ==============================================================================
// ULTIMATE SARF ENGINE (İdğam, İbdal, İ'lal, İlletli Harfler ve Hemze Motoru)
// ==============================================================================
const SarfEngine = {
    /* Misal (ilk harfi vâv) fiilde muzâride vâv düşer mi? */
    misalVaviDuser: function(r, options) {
        if (r[0] !== 'و') return false;
        if (options.skipMisalDrop) return false;
        const nb = Number(options.numBab || 0);
        if (nb === 0) return false;   // isim kalıbı / bilinmiyor → vâv korunur
        if (nb >= 7) return false;    // mezîd bâb → vâv korunur
        if (typeof sozlukVerileri !== 'undefined') {
            const kokVeri = sozlukVerileri[r.join('')];
            if (kokVeri) {
                for (const id of [2, 4, 6, 9, 12, 15]) {
                    const e = kokVeri[id];
                    const t = e ? (e.base ? e.base.arText : e.arText) : '';
                    if (t && /^[يتأن]/.test(t)) return t.indexOf('و') === -1;
                }
            }
        }
        return true;                  // veri yoksa klasik varsayım: düşer (يَعِدُ)
    },

    applyRules: function(word, r, options = {}) {
        if (!r || r.length !== 3) return word;
        let res = word;
        let [r1, r2, r3] = r; 
        
        let skipIfalEcvef = options.skipIfalEcvef || false;

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
        // Ecvef + lâm harfi ن olan köklerde (كون) نْن birleşmesi ERTELENİR:
        // önce ecvef i'lâli çalışsın (يَكْوُنْنَ → يَكُنْنَ), birleşme en sonda olsun (→ يَكُنَّ).
        const nunBirlesmeErtele = ((r2 === 'و' || r2 === 'ي') && r3 === 'ن');
        res = res.replace(/تْت/g, "تّ"); 
        if (!nunBirlesmeErtele) res = res.replace(/نْن/g, "نّ"); 

        // 2. MUZAAF (ŞEDDELİ) FİİLLER
        // DİKKAT: حيي / حوو gibi ayn'ı da lâm'ı da illetli kökler MUZAAF DEĞİLDİR;
        // nâkıs kurallarına tâbidir (حَيِيَ / يَحْيَى / أَحْيَا). Bu yüzden illet harfleri dışlanır.
        if (r2 === r3 && 'ويا'.indexOf(r2) === -1) {
            let X = r2;
            let regexSukun = new RegExp(`ْ${X}([َُِ])${X}([ًٌٍَُِ])`, 'g');
            res = res.replace(regexSukun, `$1${X}ّ$2`);
            let regexNormal = new RegExp(`${X}[َُِ]${X}([ًٌٍَُِ])`, 'g');
            res = res.replace(regexNormal, `${X}ّ$1`);
            res = res.replace(new RegExp(`([\\u0621-\\u064A])َا${X}ِ${X}`, 'g'), `$1َا${X}ّ`);
            res = res.replace(new RegExp(`مَ([\\u0621-\\u064A])ْ${X}[َِ]${X}`, 'g'), `مَ$1َ${X}ّ`);
            // Mezîd bâblarda emir/meczum tekil: أَعْدِدْ → أَعِدَّ , اِسْتَعْدِدْ → اِسْتَعِدَّ
            res = res.replace(new RegExp(`([\\u0621-\\u064A])ْ${X}([َُِ])${X}ْ$`), `$1$2${X}َّ`);
            // Öncesindeki harf zaten harekeliyse hareke yerinde kalır: اِضْطَرِرْ → اِضْطَرَّ
            res = res.replace(new RegExp(`([\u064E\u064F\u0650])${X}[\u064E\u064F\u0650]${X}\u0652$`), `$1${X}\u064E\u0651`);
            res = res.replace(/^أِ/g, "إِ");
            res = res.replace(/(^|\s)أِ/g, "$1إِ");
        }

        // 3. MİSAL FİİLLER (İLK HARF İLLETİ)
        // Vâv YALNIZCA mücerred muzâri/emirde düşer: وَعَدَ → يَعِدُ / عِدْ.
        // Mezîd bâblarda (أَوْعَدَ, اِسْتَوْفَى, تَوْجِيه) ve isim kalıplarında (مَوْعِد,
        // مَوْعُود) vâv KORUNUR. 4. bâb misallerde de düşmez: وَجِلَ → يَوْجَلُ.
        // Kararı veri belirler: kökün mücerred muzârisi sözlükte tanımlıysa
        // içinde vâv olup olmadığına bakılır.
        if (r1 === 'و' && this.misalVaviDuser(r, options)) {
            let muzariRegex = new RegExp(`^([يتاأن])َوْ(${r2}[َِ]${r3}.*)`);
            res = res.replace(muzariRegex, "$1َ$2");
            let emirRegex = new RegExp(`^اِوْ(${r2}[َِ]${r3}.*)`);
            res = res.replace(emirRegex, "$1");
        }

        // 3.5. MİSAL YÂÎ + İF'AL: ötreden sonra sâkin yâ vâv'a döner (أَيْقَنَ → يُوقِنُ, مُوقِن)
        if (r1 === 'ي') {
            res = res.replace(/^([يتنأم])ُيْ/g, "$1ُو");
        }

       // 4. ECVEF FİİLLER
        // DİKKAT: İf'ilâl bâbı (اِفْعَلَّ / اِفْعَالَّ — renk ve kusur fiilleri) ecvef i'lâli
        // GÖRMEZ: اِبْيَضَّ, اِسْوَدَّ, اِعْوَرَّ. Ayn harfi sâkin ve şeddeli lâm'a bitişik
        // olduğu için elife dönüşmez.
        const ifilalBabi = (Number(options.numBab) === 12);
        if ((r2 === 'و' || r2 === 'ي') && (r3 !== 'و' && r3 !== 'ي') && !ifilalBabi) {
            let ayn = r2;
            let maziHareke = (ayn === 'و') ? 'ُ' : 'ِ';
            let nb = Number(options.numBab);
            if (nb === 3 || nb === 4 || nb === 6 || options.forceMaziKasra) maziHareke = 'ِ'; // Bab 3, 4 ve 6 istisnası (خاف -> خِفْنَ, نام -> نِمْنَ)
            // MEZİD BÂBLARDA elif'ten kısalan hareke her zaman fethadır:
            // أَقَامَ → أَقَمْتُ · اِخْتَارَ → اِخْتَرْتُ · اِسْتَقَامَ → اِسْتَقَمْتُ · اِنْقَادَ → اِنْقَدْتُ
            if (nb >= 7) maziHareke = 'َ';

            // İSMİ FAİL (33. Kalıp vb.) (نَاوِم / بَايِع -> نَائِم / بَائِع)
            let ismiFailRegex = new RegExp(`^${r1}َا[وي]ِ${r3}(.*)`, 'g');
            res = res.replace(ismiFailRegex, `${r1}َائِ${r3}$1`);

            // İF'AL VE DİĞER MEZİD BABLAR İÇİN STANDART ÇEVİRİLER
            if (!skipIfalEcvef) {
                res = res.replace(/أَ([\u0621-\u064A])ْ[وي]َ([\u0621-\u064A].*)/g, "أَ$1َا$2");
            }
            res = res.replace(/(يُ|تُ|نُ|أُ|مُ)([\u0621-\u064A])ْ[وي]ِ([\u0621-\u064A].*)/g, "$1$2ِي$3");
            res = res.replace(/اِسْتَ([\u0621-\u064A])ْ[وي]َ([\u0621-\u064A].*)/g, "اِسْتَ$1َا$2");
            // İF'AL EMİR (ecvef): أَمْوِتْ → أَمِتْ , أَقْوِمْ → أَقِمْ
            res = res.replace(/^أَ([\u0621-\u064A])ْ[وي]ِ([\u0621-\u064A])ْ/g, "أَ$1ِ$2ْ");
            res = res.replace(/^أَ([\u0621-\u064A])ْ[وي]ِ([\u0621-\u064A])(?![ْ])/g, "أَ$1ِي$2");
            res = res.replace(/(يَ|تَ|نَ|أَ|مُ)سْتَ([\u0621-\u064A])ْ[وي]ِ([\u0621-\u064A].*)/g, "$1سْتَ$2ِي$3");

            // 4.1. EVRENSEL MEZİD-ECVEF ZIRHI (İstifal, İf'al, İnfi'al vb.)
            // Bu blok, ortası 'و' veya 'ي' olan fiillerin Mezid bablarda 
            // hatalı üretilen "استرويح" gibi formlarını "استرح" haline getirir.
            if ((r2 === 'و' || r2 === 'ي')) {
                // İSTİF'AL BABI ZIRHI (اِسْتَرْوِحْ -> اِسْتَرِحْ)
                res = res.replace(/اِسْتَرْ[وي]حْ/g, "اِسْتَرِحْ");
                res = res.replace(/يَسْتَرْ[وي]حُ/g, "يَسْتَرِيحُ");
                res = res.replace(/مُسْتَرْ[وي]ح/g, "مُسْتَرِيح");

                // ==================================================================
                // YENİ EK: EVRENSEL İSTİF'AL EMİR MUHATAP ZIRHI (Tüm Ecvef Fiiller İçin)
                // ==================================================================
                res = res.replace(/([اأإآ]سْتَ[\u0621-\u064A])ْ[وي][َُِ]([\u0621-\u064A])ْ$/g, "$1ِ$2ْ");
                res = res.replace(/([يتاأإن]سْتَ[\u0621-\u064A])ْ[وي][َُِ]([\u0621-\u064A])ْ$/g, "$1ِ$2ْ");
                res = res.replace(/([اأإآيتن][َُِ]?سْتَ[\u0621-\u064A])ْ[وي][َُِ]([\u0621-\u064A])ْنَ$/g, "$1ِ$2ْنَ"); // اِسْتَقْوِمْنَ → اِسْتَقِمْنَ

                // İNFİ'AL BABI ZIRHI (اِنْفِعَال)
                // Örn: اِنْقِوَا (Hatalı) -> اِنْقِوَاء (Doğru) -> اِنْقِيَاء
                res = res.replace(/اِنْقِ[وي]َا/g, "اِنْقِيَاء");
                
                // GENEL: Ecvef fiillerde ortadaki illet harfini...
                res = res.replace(/([اأإآ]سْتَ[^\u064B-\u0652]*)ْ[وي]([^\u064B-\u0652]*)/g, "$1$2");
            }

           

            // ==========================================
            // 1. İLTİKA-İ SAKİNEYN (SÜKUN ÇARPIŞMASI KESİN ÇÖZÜMLERİ)
            // ==========================================

            // ==========================================
            // EMİR KİPİ KESİN ÇÖZÜMLERİ (BAŞA ALINDI!)
            // ==========================================
            // Sükunlu sonlar (Müfred, Kadın Çoğul -> عُدْ, عُدْنَ, نَمْ)
            res = res.replace(/^[اأإآء][ُِ]([\u0621-\u064A])[َْ]?وُ([\u0621-\u064A])ْ(.*)/g, "$1ُ$2ْ$3");
            res = res.replace(/^[اأإآء][ُِ]([\u0621-\u064A])[َْ]?يِ([\u0621-\u064A])ْ(.*)/g, "$1ِ$2ْ$3");
            res = res.replace(/^[اأإآء][ُِ]([\u0621-\u064A])[َْ]?[وي]َ([\u0621-\u064A])ْ(.*)/g, "$1َ$2ْ$3");
            
            // Harekeli sonlar (Tesniye, Cemi -> عُودُوا, بِيعِي)
            res = res.replace(/^[اأإآء][ُِ]([\u0621-\u064A])[َْ]?وُ(?!\u0627)([\u0621-\u064A])(?![ْ])(.*)/g, "$1ُو$2$3");
            res = res.replace(/^[اأإآء][ُِ]([\u0621-\u064A])[َْ]?يِ(?!\u0627)([\u0621-\u064A])(?![ْ])(.*)/g, "$1ِي$2$3");
            res = res.replace(/^[اأإآء][ُِ]([\u0621-\u064A])[َْ]?[وي]َ(?!\u0627)([\u0621-\u064A])(?![ْ])(.*)/g, "$1َا$2$3");

            // (MUZARİ KURALLARI MAZİDEN ÖNCEYE ALINDI!)
            
            // MUZARİ Sükunlar (Kadın Çoğul -> يَعُدْنَ, يَبِعْنَ, يَخَفْنَ)
            res = res.replace(/([يتاأإن][َُِ]?(?!\u0627)[\u0621-\u064A])[َْ]?ُو([\u0621-\u064A])ْ/g, "$1ُ$2ْ");
            res = res.replace(/([يتاأإن][َُِ]?(?!\u0627)[\u0621-\u064A])[َْ]?ِي([\u0621-\u064A])ْ/g, "$1ِ$2ْ");
            res = res.replace(/([يتاأإن][َُِ]?(?!\u0627)[\u0621-\u064A])[َْ]?َا([\u0621-\u064A])ْ/g, "$1َ$2ْ");
            
            // Ham Gelişler (يَعْوُدْنَ -> يَعُدْنَ)
            res = res.replace(/([يتاأإن][َُِ]?(?!\u0627)[\u0621-\u064A])[َْ]?وُ([\u0621-\u064A])ْ/g, "$1ُ$2ْ");
            res = res.replace(/([يتاأإن][َُِ]?(?!\u0627)[\u0621-\u064A])[َْ]?يِ([\u0621-\u064A])ْ/g, "$1ِ$2ْ");
            res = res.replace(/([يتاأإن][َُِ]?(?!\u0627)[\u0621-\u064A])[َْ]?[وي]َ([\u0621-\u064A])ْ/g, "$1َ$2ْ");

            // MAZİ Şeddeli Ekler
            res = res.replace(/([\u0621-\u064A])َا([\u0621-\u064A])ّ/g, `$1${maziHareke}$2ّ`);
            res = res.replace(/([\u0621-\u064A])َوَ([\u0621-\u064A])ّ/g, `$1${maziHareke}$2ّ`);
            res = res.replace(/([\u0621-\u064A])َيَ([\u0621-\u064A])ّ/g, `$1ِّ`);
            res = res.replace(/([\u0621-\u064A])َ[وي]ِ([\u0621-\u064A])ّ/g, `$1ِّ`);

            // MAZİ Sükunlar (Kadın Çoğul, Sen, Ben vb. -> عُدْنَ, بِعْنَ, خِفْنَ)
            res = res.replace(/([\u0621-\u064A])َا([\u0621-\u064A])ْ/g, `$1${maziHareke}$2ْ`);
            res = res.replace(/([\u0621-\u064A])َوَ([\u0621-\u064A])ْ/g, `$1${maziHareke}$2ْ`);
            res = res.replace(/([\u0621-\u064A])َيَ([\u0621-\u064A])ْ/g, `$1${maziHareke}$2ْ`); // اِخْتَيَرْتَ → اِخْتَرْتَ
            res = res.replace(/([\u0621-\u064A])َ[وي]ِ([\u0621-\u064A])ْ/g, `$1ِ$2ْ`);
            // ==========================================
            // 2. NORMAL HAREKELİ DURUMLAR (UZATMALAR)
            // ==========================================
            
            // MUZARİ HAREKELİ (MAZİDEN ÖNCE ÇALIŞIR, BÖYLECE YANLIŞLIKLA "يَبَاعُ" OLMAZ!)
            if (!skipIfalEcvef) {
                res = res.replace(/([يتاأإن][َُِ]?(?!\u0627)[\u0621-\u064A])[َْ]?وُ(?!\u0627)([\u0621-\u064A])(?![ّْ])/g, "$1ُو$2"); // 1. Bab -> يَعُودُ
                res = res.replace(/([يتاأإن][َُِ]?(?!\u0627)[\u0621-\u064A])[َْ]?يِ(?!\u0627)([\u0621-\u064A])(?![ّْ])/g, "$1ِي$2"); // 2. Bab -> يَبِيعُ
                res = res.replace(/([يتاأإن][َُِ]?(?!\u0627)[\u0621-\u064A])[َْ]?[وي]َ(?!\u0627)([\u0621-\u064A])(?![ّْ])/g, "$1َا$2"); // 3/4. Bab -> يَخَافُ
                
                // Yanlış Bab eşleşmeleri için tablo görünüm düzeltici
                res = res.replace(/([يتاأإن][َُِ]?(?!\u0627)[\u0621-\u064A])[َْ]?وِ([\u0621-\u064A])(?![ّْ])/g, "$1ِي$2");
                res = res.replace(/([يتاأإن][َُِ]?(?!\u0627)[\u0621-\u064A])[َْ]?يُ([\u0621-\u064A])(?![ّْ])/g, "$1ُو$2");
            }

            // MAZİ HAREKELİ (Artık Muzari formları güvende olduğu için Mazi kuralları rahatça çalışabilir)
            res = res.replace(/([\u0621-\u064A])َ[وي][َُِ]([\u0621-\u064A])(?![ّْ])/g, "$1َا$2"); // عَوَدَ → عَادَ , طَوُلَ → طَالَ (5. bâb ecvef)

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

        // 5. NAKIS (SON HARF İLLETİ) ve LEFİF FİİLLER (örn: نوى)
        if (r3 === 'و' || r3 === 'ي') {
            let lam = r3;

            // Mezid Bablarda Telaffuz Ağırlıklarının Atılması
            res = res.replace(/ِيُ$/g, "ِي"); // يُزَكِّيُ -> يُزَكِّي 
            res = res.replace(/ُوُ$/g, "ُو"); // يَدْعُوُ -> يَدْعُو 
            
            // Mazi 3. Tekil Şahıs Dönüşümü (Şedde Korumalı)
            if (lam === 'و') {
                res = res.replace(/^([\u0621-\u064A][\u064B-\u0652]+[\u0621-\u064A][\u064B-\u0652]+)وَ$/g, "$1ا");
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

            // (Yukarıdaki kurallar şedde araya girince kaçıyordu — şeddeli eşlenikleri:
            //  سَوَّيَتْ → سَوَّتْ · يُسَوِّيُونَ → يُسَوُّونَ · سَوِّيِي → سَوِّي)
            res = res.replace(/([َُِ])ّ[وي][َُ]?وا$/g, (m, h) => (h === "َ" ? "َّوْا" : "ُّوا"));
            res = res.replace(/([َُِ])ّ[وي][َُ]?ونَ$/g, (m, h) => (h === "َ" ? "َّوْنَ" : "ُّونَ"));
            res = res.replace(/([َُِ])ّ[وي]َتْ$/g, "$1ّتْ");
            res = res.replace(/([َُِ])ّ[وي]َتَا$/g, "$1ّتَا");
            res = res.replace(/([َُِ])ّ[وي]ِ?ينَ$/g, "$1ّينَ");
            res = res.replace(/([َُِ])ّ[وي]ِ?ي$/g, "$1ّي");
            
            // --- MUZARİ STANDART DÖNÜŞÜMLER (MUTLAK UNICODE ŞEDDE ZIRHLI) ---
            // Şedde ve Hareke hangi sırayla yazılırsa yazılsın fethayı/esreyi/ötreyi affetmez!
            res = res.replace(/([\u0621-\u064A][\u064B-\u0652]*ُ[\u064B-\u0652]*)[وي]ُ$/g, "$1و");
            res = res.replace(/([\u0621-\u064A][\u064B-\u0652]*ِ[\u064B-\u0652]*)[وي]ُ$/g, "$1ي");
            res = res.replace(/([\u0621-\u064A][\u064B-\u0652]*َ[\u064B-\u0652]*)[وي]ُ$/g, "$1ى"); // يَتَزَكَّيُ -> يَتَزَكَّى

            // --- EMİR KİPİ İLLET DÜŞMESİ (MUTLAK UNICODE ŞEDDE ZIRHLI) ---
            // Sükunlu gelen illetleri koparır.
            // DİKKAT: Emir müfred MÜENNES (اِرْضَيْ) illet harfini KORUR;
            // düşme yalnızca müzekker muhatab ve meczum kiplerde olur.
            if (options.sigaIndex !== 3) {
                res = res.replace(/([\u0621-\u064A][\u064B-\u0652]*[َُِ][\u064B-\u0652]*)[ويىا]ْ$/g, "$1"); // تَزَكَّيْ -> تَزَكَّ
            }

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

        // 5.5. ŞÂZZ (KURAL DIŞI) HEMZE DÜŞMESİ — رَأَى
        // Muzâri ve emirde hemze tamamen düşer: يَرْأَى → يَرَى , أَرْأَى → أَرَى , اِرْأَ → رَ
        // Bu genel bir kural değil, Arapçanın meşhur bir şâzzıdır; sözlükte tutulur.
        if (r[0] === 'ر' && r[1] === 'أ' && r[2] === 'ي') {
            res = res.replace(/^([يتنأ])َ([\u0621-\u064A])ْأ/g, "$1َ$2");
            res = res.replace(/^[اأإ][ُِ]رْأ\u064E?/g, "رَ");
        }

        // 6. MEHMUZ FİİLLER (HEMZE KURALLARI VE KÜRSÜ DEĞİŞİMLERİ)
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
           res = res.replace(/(?<![ِ])أَا/g, "آ");   // kesreden sonra medde olmaz: يُبْدِئَانِ
            
            res = res.replace(/ْ[أء]ِ/g, "ْئِ"); 
            res = res.replace(/َ[أء]ِ/g, "َئِ"); 
            res = res.replace(/ُ[أء]ِ/g, "ُئِ"); 
            res = res.replace(/ِ[أء]َ/g, "ِئَ"); 
            res = res.replace(/ِ[أء]ْ/g, "ِئْ"); 
            res = res.replace(/ِ[أء]ُ/g, "ِئُ"); 
            
            res = res.replace(/ْ[أء]ُ/g, "ْؤُ"); 
            res = res.replace(/َ[أء]ُو/g, "َؤُو"); 
            res = res.replace(/ُ[أء]َ/g, "ُؤَ"); 
            res = res.replace(/ُ[أء]ْ/g, "ُؤْ"); 
            // --- BURADAN İTİBAREN YENİ EKLENEN KISIM ---
            // C. SON HARF HEMZE (Hemze-i Mutatarrife) VE UZATMA KURALLARI
            // 1. Hemze kelimenin sonundaysa ve öncesinde uzatma (Elif) varsa satıra (ء) oturur.
            res = res.replace(/ا[أإؤئ]([\u064B-\u0652]*)$/g, "اء$1"); // يَشَاأُ -> يَشَاءُ , جَاأَ -> جَاءَ
            
            // 2. Hemze kelimenin sonundaysa ve öncesinde Sakin (Cezimli) Vav/Ye varsa satıra (ء) oturur.
            res = res.replace(/([وي]ْ)[أإؤئ]([\u064B-\u0652]*)$/g, "$1ء$2"); // يَسُووْأُ -> يَسُوءُ , يَجِييْأُ -> يَجِيءُ
            
            // 3. Kelime ortasında olsa bile Elif'ten sonra gelen FETHALI hemze her zaman satıra oturur!
            res = res.replace(/اأَ/g, "اءَ"); // تَسَاأَلَ -> تَسَاءَلَ , قِرَاأَة -> قِرَاءَة
            // 3. Kelime ortasında olsa bile Elif'ten sonra gelen FETHALI hemze her zaman satıra oturur!
            res = res.replace(/اأَ/g, "اءَ"); // تَسَاأَلَ -> تَسَاءَلَ , قِرَاأَة -> قِرَاءَة

            // ==================================================================
            // TESNİYE (ELİF) ZIRHI: Hemzeli Nakıs fiiller için tesniye elifi kontrolü
            // ==================================================================
            res = res.replace(/(?<![ِ])أَا/g, "آ");   // kesreden sonra medde olmaz: يُبْدِئَانِ
            res = res.replace(/ئَا/g, "ئَا");   // Ye kürsüsündeki hemze + Tesniye Elifi (koru)
            res = res.replace(/ؤَا/g, "ؤَا");   // Vav kürsüsündeki hemze + Tesniye Elifi (koru)
            
            // -------------------------------------------
        }

        // (Ertelenen نْن birleşmesi en sonda uygulanır: يَكُنْنَ → يَكُنَّ)
        if (nunBirlesmeErtele) res = res.replace(/نْن/g, "نّ");

        // ==================================================================
        // 7. GENEL TEMİZLİK
        // ==================================================================
        // 7a-0. YÂ'DAN SONRA ELİF-İ MAKSÛRE YAZILMAZ: yan yana iki yâ olmasın diye
        // elif-i maksûre normal elife döner: أَحْيَى → أَحْيَا , اِسْتَحْيَى → اِسْتَحْيَا , أَعْيَى → أَعْيَا
        // (yalnız mezîd bâblarda: mücerred muzâri يَحْيَى imlâsını korur)
        if (Number(options.numBab || 0) >= 7) res = res.replace(/ي([\u064B-\u0652]*)ى$/g, "ي$1ا");

        // 7a. Med harfinin üzerinde cezm olmaz: يُوْعِدُ → يُوعِدُ, يَقِيْنَ → يَقِينَ
        res = res.replace(/ُ(ّ?)وْ/g, "ُ$1و");
        res = res.replace(/ِ(ّ?)يْ/g, "ِ$1ي");
        res = res.replace(/َاْ/g, "َا");

        // 7a-2. İ'LÂL Bİ'L-KALB: KESRADAN SONRAKİ SÂKİN وَاو YÂ'YA DÖNER.
        // Arapçada esreli harften sonra cezimli و duramaz, ي olur:
        // مِوْزَان ⬅️ مِيزَان · مِوْرَاث ⬅️ مِيرَاث · جِوْرَان ⬅️ جِيرَان · إِوْمَان ⬅️ إِيمَان
        // (Şeddeli و bu kuralın dışındadır: o zaten harekelidir.)
        res = res.replace(/ِوْ/g, "ِي");

        // 7b. HEMZE KÜRSÜSÜ (şedde araya girse de çalışan tamamlayıcılar)
        // Kendi harekesi ötre/esre olan hemze, önünde uzatma elifi YOKSA
        // vâv/yâ kürsüsüne oturur: يَتَوَضَّأُونَ → يَتَوَضَّؤُونَ, تَوَضَّأِي → تَوَضَّئِي
        res = res.replace(/([\u064B-\u0652])[أء]ُو/g, "$1ؤُو");
        res = res.replace(/([\u064B-\u0652])[أء]ِ/g, "$1ئِ");

        // 7c. Unicode kanonik sıra (şedde/hareke dizilişi tek biçim olsun)
        res = res.normalize('NFC');

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

    isEquivalent: function(char1, char2, rIndex = -1) {
    const hamzas = ['ا', 'أ', 'إ', 'آ', 'ؤ', 'ئ', 'ء']; // 'آ' burada mevcut
    const weaks = ['و', 'ي', 'ا', 'ى']; 
    
    // YENİ: İlk kök harfinde (rIndex === 0) yalın Elif (ا) asla vav veya ya'nın dönüşümü olamaz. 
    // Aksi halde وَاحِد kelimesindeki ilk Vav'ı bağlaç sanıp Elif'i kök zannediyor!
    if (rIndex === 0) {
        if (char1 === 'ا' && (char2 === 'و' || char2 === 'ي')) return false;
        if (char2 === 'ا' && (char1 === 'و' || char1 === 'ي')) return false;
    }

    // YENİ: Eğer karşılaştırılanlardan biri 'آ' ise, bunu 'أ' (kök hemzesi) ile denk kabul et
    if (char1 === 'آ' && char2 === 'أ') return true;
    if (char1 === 'أ' && char2 === 'آ') return true;

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
        } else if (!rootArray || rootArray.length !== 3 || (rootArray[0] === 'ف' && rootArray[1] === 'ع' && rootArray[2] === 'ل')) {
            if (typeof currentRoot !== 'undefined' && currentRoot && currentRoot.trim() !== "") {
                let tempArr = currentRoot.replace(/[^\u0621-\u064A]/g, '').split('');
                if (tempArr.length === 3) rootArray = tempArr;
                else rootArray = ['ف', 'ع', 'ل'];
            } else {
                rootArray = ['ف', 'ع', 'ل'];
            }
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
            
            if (rIndex < 3 && this.isEquivalent(c, rootArray[rIndex], rIndex)) {
                let isZiyade = false;
                
                if (rIndex < 2 && ['س', 'أ', 'إ', 'آ', 'ل', 'ت', 'م', 'و', 'ن', 'ي', 'ه', 'ا', 'ء'].includes(c)) {
                    let searchPointer = i + 1;
                    let rootMatchCount = 0;
                    let requiredMatches = 3 - rIndex; 

                    for (let k = rIndex; k < 3; k++) {
                        let found = false;
                        for (let j = searchPointer; j < charsOnly.length; j++) {
                            if (this.isEquivalent(charsOnly[j].char, rootArray[k], k)) {
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
                // YENİ KESİN ÇÖZÜM: NAKIS FİİL "تَا" (Gaibe Tesniye) HATASI
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
            else if (rIndex + 1 < 3 && this.isEquivalent(c, rootArray[rIndex + 1], rIndex + 1) && this.isWeak(rootArray[rIndex])) {
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
            display: flex !important; align-items: center !important; justify-content: center !important; 
            margin: 0 !important;
            padding: 0 !important;
            font-variant-ligatures: none !important;
            font-family: 'Arakom', sans-serif !important;
            font-weight: normal !important;
        }

        .glass-box .ar, .glass-box .ar-small, .siga-text {
            display: flex !important; align-items: center !important; justify-content: center !important;
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

function getLetterColor(char) {
    const colorMap = {
        'ب': '#d4efdf', 'ت': '#d4efdf', 'ث': '#d4efdf',
        'ج': '#fadbd8', 'ح': '#fadbd8', 'خ': '#fadbd8',
        'د': '#fae5d3', 'ذ': '#fae5d3',
        'ر': '#fcf3cf', 'ز': '#fcf3cf',
        'س': '#d6eaf8', 'ش': '#d6eaf8',
        'ص': '#e8daef', 'ض': '#e8daef',
        'ط': '#d1f2eb', 'ظ': '#d1f2eb',
        'ع': '#f5b7b1', 'غ': '#f5b7b1',
        'ف': '#d4e6f1', 'ق': '#d4e6f1',
        'ا': '#ebedef', 'ء': '#ebedef', 'ؤ': '#ebedef', 'ئ': '#ebedef',
        'ي': '#d7bde2', 'ى': '#d7bde2'
    };
    return colorMap[char] || '#ffffff'; 
}

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
                    let displayChar = char === 'ه' ? 'هـ' : char;
                    searchHtml += `<div class="search-key uni-key" onclick="handleSearchKey('${char}')">${displayChar}</div>`;
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
                    mainHtml += `<div class="key uni-key key-special" onclick="handleBackspace()" style="min-width: 80px; background: #b0bec5; color: #000; box-shadow: 0 1px 2px rgba(0,0,0,0.3);">⌫</div>`;
                } else {
                    let bg = getLetterColor(char);
                    let styleAttr = bg ? `style="--key-bg: ${bg};"` : "";
                    let displayChar = char === 'ه' ? 'هـ' : char;
                    mainHtml += `<div class="key uni-key" onclick="addLetter('${char}')" ${styleAttr}>${displayChar}</div>`;
                }
            });
            mainHtml += `</div>`;
        });
        
        mainHtml += `<div class="kb-row" style="margin-top: 5px;">`;
        mainHtml += `<div class="key uni-key" onclick="addLetter(' ')" style="flex: 0 0 50%; max-width: 300px; background: #ffffff; box-shadow: 0 1px 2px rgba(0,0,0,0.3); height: 60px; border-radius: 10px;"></div>`;
        mainHtml += `</div>`;
        
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

function normalizeArabic(text) {
    if (!text) return "";
    return text.replace(/[أإآ]/g, 'ا');
}

function updateMainKeyboardPredictions() {
    const predictionsContainer = document.getElementById("root-predictions-box");
    const dictResults = document.getElementById("dictionary-results");
    
    if (!predictionsContainer || !dictResults) return;
    
    let filter = currentRoot.trim();
    predictionsContainer.innerHTML = "";
    dictResults.innerHTML = "";
    
    if (filter.length > 0) {
        // 1. Kök Çipleri (Orijinal)
        const hasSpace = currentRoot.includes(" ");
        let rootMatches = [];
        
        if (!hasSpace) {
            if (!window._cachedAllRoots) {
                window._cachedAllRoots = Object.keys(sozlukVerileri).filter(r => {
                    if (sozlukVerileri[r] && sozlukVerileri[r].isDictOnly) return false;
                    const stripped = window.stripHarakat ? window.stripHarakat(r) : r;
                    return stripped.length === 3 || stripped.length === 4;
                });
            }
            rootMatches = window._cachedAllRoots.filter(r => normalizeArabic(r).startsWith(normalizeArabic(filter))).slice(0, 50);

            // KOK OLUSTURMA OZELLIGI KALDIRILDI (mobil): tanimsiz kokler icin dinamik "Kok Olustur" onerisi eklenmez.
        }
        
        if (!window.startDynamicRootGenerationDefined) {
            window.startDynamicRootGeneration = function(r, element) {
                element.onclick = null;
                element.className = "prediction-chip dynamic-root-chip";
                element.style.background = "";
                element.style.color = "";
                element.innerHTML = `
                    <span class="dynamic-root-loading">
                        <span class="dynamic-root-countdown"></span>
                    </span>
                    <div class="dynamic-root-progress"></div>
                    <div style="position: relative; display: inline-flex; align-items: center; justify-content: center;">
                        <div class="welding-spark-emitter"></div>
                        <span class="dynamic-root-text">${r.split('').join(' ')}</span>
                    </div>
                `;
                
                setTimeout(() => {
                    selectRootFromMainKeyboard(r);
                }, 3450);
            };
            window.startDynamicRootGenerationDefined = true;
        }

        let predHtml = "";
        rootMatches.forEach(r => {
            const isDynamic = !sozlukVerileri[r];
            if (isDynamic) {
                let spacedRoot = r.split('').join(' ');
                predHtml += `
                    <div class="prediction-chip" onclick="window.startDynamicRootGeneration('${r}', this)" style="
                        background: linear-gradient(145deg, #8b5a2b, #6b4226) !important; 
                        border: 2px solid #a0522d !important;
                        border-radius: 12px;
                        padding: 10px 5px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        box-shadow: inset 0 2px 4px rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.4);
                        flex: 0 0 calc(50% - 5px); 
                        max-width: calc(50% - 5px); 
                        box-sizing: border-box;
                    ">
                        <div style="font-size: 14px; font-weight: normal; color: #f1c40f; margin-bottom: 5px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
                            Kök Oluştur
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.5rem; color: #f1c40f;"><i class="fas fa-hammer"></i></span>
                            <span class="prediction-chip-text" style="font-family: 'Arakom', sans-serif; font-size: 2.2rem; color: #ffffff; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); line-height: 1;">
                                ${spacedRoot}
                            </span>
                        </div>
                    </div>`;
            } else {
                const emoji = getRootEmoji(r);
                predHtml += `
                    <div class="prediction-chip" onclick="selectRootFromMainKeyboard('${r}')" style="flex: 0 0 calc(50% - 5px); max-width: calc(50% - 5px); box-sizing: border-box; display:flex; align-items:center; justify-content:center; gap:8px; direction:ltr;">
                        <span class="prediction-chip-text" dir="rtl">${r}</span><span class="prediction-chip-emoji">${emoji}</span>
                    </div>`;
            }
        });
        predictionsContainer.innerHTML = predHtml;

        // 2. Sözlük Sonuçları (Türevler)
        let resultsHTML = "";
        let matchCount = 0;
        let matchesByLetter = {};
        
        // Kök veya kelimelerde %100 birebir eşleşen bir şey var mı kontrolü (masaüstünden port)
        let hasExactMatchInDict = false;
        let _exactSearchStr = window.stripHarakat(filter);
        if (_exactSearchStr.length > 0 && /[\u0600-\u06FF]/.test(_exactSearchStr)) {
            let normFilter = window.normalizeArabic ? normalizeArabic(_exactSearchStr) : _exactSearchStr;
            for (const [rootK, rootD] of Object.entries(typeof sozlukVerileri !== 'undefined' ? sozlukVerileri : {})) {
                if (rootK.startsWith('Sayı:') || rootK.startsWith('Sıra:')) continue;
                for (const kData of Object.values(rootD)) {
                    if (kData.base && kData.base.arText) {
                        let normItem = window.normalizeArabic ? normalizeArabic(window.stripHarakat(kData.base.arText)) : window.stripHarakat(kData.base.arText);
                        if (normItem.startsWith(normFilter)) {
                            hasExactMatchInDict = true;
                            break;
                        }
                    }
                }
                if (hasExactMatchInDict) break;
            }
        }

        for (const [rootKey, rootData] of Object.entries(typeof sozlukVerileri !== 'undefined' ? sozlukVerileri : {})) {
            if (matchCount > 60) break;
            for (const [kalipKey, kalipData] of Object.entries(rootData)) {
                if (matchCount > 60) break;
                if (kalipData.base && kalipData.base.arText) {
                    // GUARD: Boş arText'li otomatik oluşturulmuş nesneleri atla (NaN önleme)
                    if (kalipData.base.arText.trim() === "") continue;
                    const strippedAr = window.stripHarakat(kalipData.base.arText);
                    
                    // Sözlükte en fazla 3 kelimeye kadar olan özel tamlamaları göster (uzun örnek cümleleri filtrele)
                    if (strippedAr.trim().split(/\s+/).length > 3) continue;

                    // Kullanıcının İsteği: "Çoğullar ve fiil çekimleri liste taramasında gizlenir" kuralı iptal edildi. 
                    // Artık hiçbir kelime gizlenmeyecek.
                    // if (kalipData.isHiddenInList) {
                    //     continue;
                    // }

                    // Kullanıcı İsteği: Anlamı girilmiş (trText) tüm kelimeler sözlükte gösterilsin.
                    // Herhangi bir filtreleme yapmıyoruz.

                    // Eğer aranan kelime kökün içinde geçiyorsa veya tam eşleşiyorsa
                    const isArabicSearch = /[\u0600-\u06FF]/.test(filter);
                    let matches = false;
                    let matchedConjugation = null;
                    let matchedPronounIndex = -1;
                    
                    let matchedConjugations = [];
                    
                    let arMatch = false;
                    let muennesMatch = false;
                    
                    if (isArabicSearch) {
                        let getSearchVariants = (rawFilter) => {
                            let norm = normalizeArabic(rawFilter);
                            let variants = [norm];
                            if (hasExactMatchInDict) return variants;

                            const prefixes = ['وال', 'فال', 'بال', 'كال', 'ال', 'لل', 'و', 'ف', 'ب', 'ك', 'ل'];
                            for (let p of prefixes) {
                                if (norm.startsWith(p) && norm.length > p.length) {
                                    variants.push(norm.substring(p.length));
                                }
                            }
                            return variants;
                        };
                        
                        let searchVariants = getSearchVariants(filter);
                        
                        arMatch = normalizeArabic(strippedAr).split('/').some(part => {
                            let pt = part.trim();
                            return searchVariants.some(v => pt.startsWith(v) || (pt.startsWith('ال') && pt.substring(2).startsWith(v)));
                        });
                        
                        if (kalipData.base.muennes) {
                            const strippedMuennes = window.stripHarakat(kalipData.base.muennes);
                            muennesMatch = normalizeArabic(strippedMuennes).split('/').some(part => {
                                let pt = part.trim();
                                return searchVariants.some(v => pt.startsWith(v) || (pt.startsWith('ال') && pt.substring(2).startsWith(v)));
                            });
                        }
                        matches = arMatch || muennesMatch;
                        
                        // DEEP CONJUGATION SEARCH
                        if (filter.length >= 2 && !kalipData.cekimi && typeof VerbGenerator !== 'undefined' && typeof getBabAndType === 'function') {
                            let mapping = getBabAndType(parseInt(kalipKey));
                            if (mapping && ['mazi', 'muzari', 'emir'].includes(mapping.type)) {
                                let vObj = typeof babVezinleri !== 'undefined' ? babVezinleri[mapping.babNo] : null;
                                let anaVezin = "فَعَلَ";
                                if (vObj) {
                                    if (mapping.type === 'mazi') anaVezin = vObj.mazi;
                                    else if (mapping.type === 'muzari') anaVezin = vObj.muzari;
                                    else if (mapping.type === 'emir') anaVezin = vObj.emir;
                                }
                                kalipData.cekimi = VerbGenerator.generateVerbList(rootKey, mapping.babNo, mapping.type, anaVezin, parseInt(kalipKey));
                            }
                        }
                        
                        if (kalipData.cekimi && Array.isArray(kalipData.cekimi)) {
                            kalipData.cekimi.forEach((c, cIndex) => {
                                if (c && typeof c === 'string' && normalizeArabic(window.stripHarakat(c)).startsWith(normalizeArabic(filter))) {
                                    matchedConjugations.push({
                                        arText: c,
                                        pronounIndex: cIndex
                                    });
                                }
                            });
                            
                            if (matchedConjugations.length > 0) {
                                matches = true;
                            }
                        }
                    } else {
                        matches = kalipData.base.trText && kalipData.base.trText.toLowerCase().includes(filter.toLowerCase());
                    }

                    if (matches) {
                        const pushMatch = (cArText, isConj, pIndex) => {
                            if (!cArText) return;
                            let firstLetter = window.stripHarakat(cArText).charAt(0);
                            if (["أ", "إ", "آ", "ا"].includes(firstLetter)) firstLetter = "ا";
                            
                            if (!matchesByLetter[firstLetter]) matchesByLetter[firstLetter] = [];
                            
                            // Prevent identical pronoun entries (e.g. 1st person plural duplicate)
                            const isDuplicate = matchesByLetter[firstLetter].some(m => m.kalipKey === kalipKey && m.arText === cArText);
                            if (!isDuplicate) {
                                matchesByLetter[firstLetter].push({
                                    rootKey, kalipKey, 
                                    arText: cArText, 
                                    trText: kalipData.base.trText,
                                    strippedAr: window.stripHarakat(cArText),
                                    isConjugationMatch: isConj,
                                    matchedPronounIndex: pIndex,
                                    originalArText: kalipData.base.arText
                                });
                                matchCount++;
                            }
                        };

                        if (matchedConjugations.length > 0) {
                            matchedConjugations.forEach(mc => {
                                pushMatch(mc.arText, true, mc.pronounIndex);
                            });
                        } else {
                            // Sadece eşleşenleri veya arama yoksa/Türkçe aramaysa hepsini ekle
                            if (!isArabicSearch || arMatch) {
                                pushMatch(kalipData.base.arText, false, -1);
                            }
                            if (kalipData.base.muennes && (!isArabicSearch || muennesMatch)) {
                                pushMatch(kalipData.base.muennes, false, -1);
                            }
                        }
                    }
                }
            }
        }
        
        // Arapça alfabetik sıralama
        const arabicAlphabet = "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" ");
        let searchFilterExact = window.stripHarakat(filter);
        let trSearchExact = filter.toLowerCase();
        const sortedLetters = Object.keys(matchesByLetter).sort((a, b) => {
            let aExact = matchesByLetter[a].some(item => (item.strippedAr && item.strippedAr === searchFilterExact) || (item.trText && item.trText.toLowerCase().split(/[ \/.,()]+/).includes(trSearchExact)));
            let bExact = matchesByLetter[b].some(item => (item.strippedAr && item.strippedAr === searchFilterExact) || (item.trText && item.trText.toLowerCase().split(/[ \/.,()]+/).includes(trSearchExact)));
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            let aStarts = searchFilterExact.length > 0 && matchesByLetter[a].some(item => item.strippedAr && item.strippedAr.startsWith(searchFilterExact));
            let bStarts = searchFilterExact.length > 0 && matchesByLetter[b].some(item => item.strippedAr && item.strippedAr.startsWith(searchFilterExact));
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            let indexA = arabicAlphabet.indexOf(a);
            let indexB = arabicAlphabet.indexOf(b);
            if (indexA === -1) indexA = 999;
            if (indexB === -1) indexB = 999;
            return indexA - indexB;
        });

        for (const letter of sortedLetters) {
            // Harf başlığı ve Kelimeleri Saran Kutu
            resultsHTML += `<div style="background: rgba(255,255,255,0.8); border-radius: 16px; border: 2px solid rgba(0,0,0,0.05); padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); width: 100%; box-sizing: border-box;">`;
            resultsHTML += `<div style="font-family: \'Arakom\', sans-serif; color:#000000; font-size:1.5rem; font-weight:normal; text-align:center; margin: 0 0 10px 0; border-bottom:2px solid rgba(0,0,0,0.05); padding-bottom:7px; width: 100%;">[ ${letter} ]</div>`;
            
            // Harf içindeki kelimeleri sırala (Tam eşleşen ve kısa olanlar ÖNCE)
            matchesByLetter[letter].sort((a, b) => {
                let aExact = (a.strippedAr === searchFilterExact || (a.trText && a.trText.toLowerCase().split(/[ \/.,()]+/).includes(trSearchExact))) ? 1 : 0;
                let bExact = (b.strippedAr === searchFilterExact || (b.trText && b.trText.toLowerCase().split(/[ \/.,()]+/).includes(trSearchExact))) ? 1 : 0;
                if (aExact !== bExact) return bExact - aExact;
                
                let aStarts = a.strippedAr.startsWith(searchFilterExact) ? 1 : 0;
                let bStarts = b.strippedAr.startsWith(searchFilterExact) ? 1 : 0;
                if (aStarts !== bStarts) return bStarts - aStarts;
                
                if (a.strippedAr.length !== b.strippedAr.length) {
                    return a.strippedAr.length - b.strippedAr.length;
                }
                return a.strippedAr.localeCompare(b.strippedAr, 'ar');
            });
            
            resultsHTML += `<div style="display:flex; flex-wrap:wrap; justify-content:space-between; gap:10px; width:100%; box-sizing:border-box;">`;
            
            for (const item of matchesByLetter[letter]) {
                // GUARD: Geçersiz/boş girdileri ekrana yazdırma (NaN önleme)
                if (!item.arText || item.arText.trim() === "" || !item.trText) continue;
                // USER REQUEST: Hide unpatterned plurals and + items from quick list (NaN fix)
                if (item.kalipKey === "+" || isNaN(parseInt(item.kalipKey))) continue;
                const ilkAnlam = (item.trText || "").split('/')[0].trim();
                const kelimeler = ilkAnlam.split(' ');
                // Sadece normal (kök) eşleşmelerinde Türkçe anlamı göster, çekimlerde gösterme çünkü anlam şahsa göre değişiyor
                const kisaltilmisAnlam = kelimeler.slice(0, 3).join(' ') + (kelimeler.length > 3 ? "..." : "");
                
                let conjugationBadge = "";
                let rootBadge = "";
                
                let kalipNum = parseInt(item.kalipKey);
                let isVerbKalip = !isNaN(kalipNum) && kalipNum > 0;
                
                if (isVerbKalip && item.rootKey && !item.rootKey.includes(":")) {
                    let verbType = "Kelime";
                    if ([8,11,14, 52,58,64,71,77,88,94,100].includes(kalipNum) || kalipNum === 1) verbType = "Mazi";
                    else if ([9,12,15, 53,59,65,72,78,89,95,101].includes(kalipNum) || kalipNum === 2 || kalipNum === 4 || kalipNum === 6) verbType = "Muzari";
                    else if ([10,13,16, 54,60,66,73,79,90,96,102].includes(kalipNum) || kalipNum === 3 || kalipNum === 5 || kalipNum === 7) verbType = "Emir";
                    
                    if (item.isConjugationMatch) {
                        let pronounIndex = item.matchedPronounIndex;
                        if (verbType === "Emir") {
                            pronounIndex += 6; 
                        }
                        // Conjugation badge removed by user request
                    } else if (verbType !== "Kelime") {
                        // Root verb badge removed by user request
                    }
                    
                    rootBadge = `<div style="color:#e74c3c; font-size:0.9rem; margin-top:4px; font-weight:bold; text-align:center;">Kök: ${item.rootKey}</div>`;
                }
                
                let clickArText = item.isConjugationMatch ? item.originalArText : item.arText;
                let escapedArText = clickArText ? clickArText.replace(/"/g, "&quot;").replace(/'/g, "\\'") : "";
                let escapedTrText = item.trText ? item.trText.replace(/"/g, "&quot;").replace(/'/g, "\\'") : "";
                let escapedRootKey = item.rootKey ? item.rootKey.replace(/"/g, "&quot;").replace(/'/g, "\\'") : "";
                
                resultsHTML += `
                    <div class="dict-result-item" style="display:flex; flex-direction:column; justify-content:center; align-items:center; background:#f4f6f7; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); padding:15px; border-radius:12px; flex: 0 0 calc(50% - 5px); max-width: calc(50% - 5px); min-width: 0; box-sizing: border-box; cursor:pointer; position:relative; overflow: hidden;" onclick="showWordDetails('${escapedRootKey}', '${item.kalipKey}', '${escapedArText}', '${escapedTrText}')">
                        
                        <div dir="ltr" style="display:flex; flex-direction:row; width:100%; align-items:center; justify-content:space-between;">
                            
                            <div style="flex: 0 0 35px; display:flex; justify-content:center; align-items:center; color:rgba(0,0,0,0.15); font-size:2.2rem; margin-right: 15px;" title="Detayları Görüntüle">
                                <i class="fas fa-layer-group"></i>
                            </div>

                            <div style="flex: 1 1 0; min-width:0; text-align:left; padding-right: 15px; border-right: 2px solid rgba(0,0,0,0.1);">
                                <span class="dict-result-tr" dir="ltr" style="font-family: 'Inter', sans-serif; font-size:1.6rem; font-weight:bold; color:#555555; line-height:1.2; word-break: break-word; display:block; overflow-wrap: break-word; hyphens: auto;">
                                    ${kisaltilmisAnlam}
                                </span>
                            </div>
                            
                            <div style="flex: 1 1 0; min-width:0; text-align:right; padding-left: 15px;">
                                <span class="dict-result-ar" style="font-family: 'Arakom', sans-serif; font-size:clamp(3.0rem, 4vw, 4.8rem); font-weight:normal; color:#000000; line-height:1.5; padding: 10px 0; display:block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    ${item.arText}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            }
            resultsHTML += `</div>`;
        }
        
        const _rootDot = document.getElementById("root-status-dot");
        const _dictDot = document.getElementById("dict-status-dot");
        if (_rootDot) _rootDot.style.backgroundColor = rootMatches.length > 0 ? "#4CAF50" : "#F44336";
        if (_dictDot) _dictDot.style.backgroundColor = (matchCount > 0) ? "#4CAF50" : "#F44336";

        if (matchCount === 0 && rootMatches.length === 0) {
            dictResults.style.display = "block";
            dictResults.innerHTML = "<div dir='ltr' style='direction:ltr; text-align:center; opacity:0.7; color:#000;'>Sonuç bulunamadı...</div>";
        } else {
            if (resultsHTML === "") {
                dictResults.style.display = "none";
                dictResults.innerHTML = "";
            } else {
                dictResults.style.display = "block";
                dictResults.innerHTML = resultsHTML;
            }
        }
    } else {
        const _rootDot2 = document.getElementById("root-status-dot");
        const _dictDot2 = document.getElementById("dict-status-dot");
        let _isDataLoaded = typeof sozlukVerileri !== 'undefined' && Object.keys(sozlukVerileri).length > 0;
        let _defColor = _isDataLoaded ? "#4CAF50" : "#F44336";
        if (_rootDot2) _rootDot2.style.backgroundColor = _defColor;
        if (_dictDot2) _dictDot2.style.backgroundColor = _defColor;
        dictResults.style.display = "none";
        dictResults.innerHTML = "";
    }

}

function selectRootFromMainKeyboard(root) {
    var prevRoot = (typeof currentRoot !== 'undefined') ? currentRoot : '';
    // Arama modundan mi geliniyor? (hizli liste kapatilinca aramada kalinan yere donmek icin)
    var _ovSearch = document.getElementById('keyboard-overlay');
    var _fromSearch = !!(_ovSearch && _ovSearch.classList.contains('native-search-mode'));
    var _niSearch = document.getElementById('mobile-native-search');
    var _prevQuery = _niSearch ? _niSearch.value : '';

    currentRoot = root;
    updateTempDisplay();
    confirmRoot(); // Kökü onaylar, tabloları açar ve klavyeyi kapatır

    // KULLANICI İSTEĞİ: Kök seçilince (arama önerisi çipi veya kelime detayındaki
    // kök butonu) o kökün HIZLI LİSTESİ acilsin.
    var fdm = document.getElementById('fast-dictionary-overlay');
    var fdmAcik = fdm && fdm.style.display === 'flex';
    if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[root] && typeof openFastDictionaryMode === 'function') {
        if (fdmAcik && prevRoot === root) {
            // Liste zaten bu kok icin acik: oldugu gibi birak
        } else {
            if (fdmAcik && typeof closeFastDictionaryMode === 'function') {
                var _rwTmp = window._fdmReturnToWordDetails, _rsTmp = window._fdmReturnToSearch;
                window._fdmReturnToWordDetails = false; window._fdmReturnToSearch = false;
                closeFastDictionaryMode();
            }
            if (_fromSearch) {
                window._lastMobileSearchQuery = _prevQuery;
                if (!window._fdmReturnToWordDetails) window._fdmReturnToSearch = true;
            }
            // FLASH ONLEME: eskiden setTimeout(80) vardi; o boslukta tarayici arama kapaninca
            // ana sayfayi cizip flash yapiyordu. Artik SENKRON aciyoruz: arama gizleme + hizli
            // liste gosterme ayni JS calismasinda olur, arada hic paint (bosluk) olmaz.
            openFastDictionaryMode();
        }
    }
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
    let hasMoved = false;

    function onMouseDown(e) {
        if (e.target.closest('.kutu-timer-btn') || e.target.closest('.kutu-list-btn')) return; // butonlara basılmışsa sürükleme
        
        e.preventDefault();
        isDragging = true;
        hasMoved = false;
        el.style.zIndex = 1000000;
        
        let startX = e.pageX || (e.touches && e.touches[0].pageX);
        let startY = e.pageY || (e.touches && e.touches[0].pageY);
        let rect = el.getBoundingClientRect();
        let offsetX = startX - rect.left - window.scrollX;
        let offsetY = startY - rect.top - window.scrollY;

        function onMouseMove(moveEvent) {
            if (!isDragging) return;
            hasMoved = true;
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
            dragEl.innerHTML = `<span class="root-text-content">${formattedText}</span>`;
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

        // İPTAL: Artık menüyü açması için SVG'den sürüklemeyi kapatıyoruz. Tahta otomatik ortada çıkıyor zaten.
        // rootTextTarget.addEventListener('mousedown', handleDragStart);
        // rootTextTarget.addEventListener('touchstart', handleDragStart, { passive: false });
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
    dragEl.innerHTML = `<span class="root-text-content">${formattedText}</span>`;
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
    return Object.keys(sozlukVerileri); 
}

function getSortedRefsForRoot(root) {
    if (!sozlukVerileri[root]) return [];
    const keys = Object.keys(sozlukVerileri[root]);
    const nums = keys.map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
    const extras = keys.filter(k => isNaN(Number(k)) && !(sozlukVerileri[root][k] && sozlukVerileri[root][k].isHiddenInList));  // joker anahtarlar (ör. "?"), gizli anahtarlar hariç
    return nums.concat(extras);
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
        if (!currentRoot || currentRoot.length !== 3 || (typeof sozlukVerileri !== 'undefined' && !sozlukVerileri[currentRoot])) {
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
    if (!currentRoot || currentRoot.length !== 3 || !sozlukVerileri[currentRoot] || roots.length === 0) return;

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
                document.querySelectorAll(containerSelector).forEach(b => {
                    b.classList.remove('current-active-red');
                    if (!b.classList.contains('kok-turendi')) b.removeAttribute('data-tiklama-sayisi');
                });
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
    // Arama kutusunda yazı varsa animasyonu KAPAT! 
    // NOT: Kullanıcı talebi üzerine 'hasRootText' kontrolü kaldırıldı, kök seçili olsa bile çarpıya basılınca ikonlar yanacak.
    const searchInput = document.getElementById('root-search');
    const hasSearchText = searchInput && searchInput.value.length > 0;
    const hasRootText = typeof currentRoot !== 'undefined' && currentRoot.length === 3;

    if (hasSearchText || hasRootText) {
        shouldShow = false;
    }

    // İkonları bul ve uygula
    const bookIcon = document.querySelector('.fa-book'); 
    const sitemapIcon = document.querySelector('#root-text-display .fa-sitemap'); 
    const mobileMenuBtn = document.querySelector('.mobile-back-btn'); 
    
    if (bookIcon) {
        if (shouldShow) bookIcon.classList.add('ready-root-hint');
        else bookIcon.classList.remove('ready-root-hint');
    }
    
    if (sitemapIcon) {
        if (shouldShow) sitemapIcon.classList.add('sitemap-wave-hint');
        else sitemapIcon.classList.remove('sitemap-wave-hint');
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
            keys: ["if'al", "if'al", "ifal", "ifal"], 
            title: "İf'al", 
            harf: "أَ ـ ـ ـ", num: 4,
            desc: `
            <p>• <b>Geçişlilik:</b> Lazım (geçişsiz) fiilleri Müteaddi (geçişli) yapar. <br>Örn: <span class="arabic-sample">ضَحِكَ</span> (Güldü) → <span class="arabic-sample">أَضْحَكَ</span> (Güldürdü)</p>
            <p>• <b>Zaman ve Mekan:</b> Eylemin zamanla veya mekanla anlam kurmasını sağlar.<br>Örn: <span class="arabic-sample">أَصْبَحَ</span> (Sabaha girdi), <span class="arabic-sample">أَعْرَقَ</span> (Irak'a vardı)</p>
            <p>• <b>Durum Bildirme:</b> Bir sıfata veya duruma girmeyi belirtir.<br>Örn: <span class="arabic-sample">أَفْقَرَ</span> (Fakirleşti), <span class="arabic-sample">أَغْنَى</span> (Zenginleşti)</p>
            <p>• <span style="color:#ef4444; font-weight: normal;">Not:</span> İf'al hemzesi 'kat-i' hemzedir; her zaman yazılır ve okunur.<br>Örn: <span class="arabic-sample">قُلْتُ أَكْرِمْ!</span> (İkram et dedim!)</p>
            ` 
        },
        { 
            keys: ["tef'il", "tef'il", "tefil", "tefil"], 
            title: "Tef'il", 
            harf: "ـ ـّ ـ", num: 4,
            desc: `
            <p>• <b>Geçişlilik:</b> Geçişsiz fiilleri geçişli yapar. <br>Örn: <span class="arabic-sample">عَلِمَ</span> (Bildi) → <span class="arabic-sample">عَلَّمَ</span> (Öğretti)</p>
            <p>• <b>Yoğunluk:</b> Aşırılık ve kuvvet bildirir. <br>Örn: <span class="arabic-sample">مَزَقَ</span> (Yırttı) → <span class="arabic-sample">مَزَّقَ</span> (Parçaladı)</p>
            <p>• <b>Türetme:</b> İsimlerden fiil yapar. <br>Örn: <span class="arabic-sample">خَيْمَةٌ</span> (Çadır) → <span class="arabic-sample">خَيَّمَ</span> (Kamp kurdu)</p>
            ` 
        },
        { 
            keys: ["mufa'ale", "mufa'ale", "müfa'ale", "müfa'ale", "mufaale", "müfaale"], 
            title: "Mufa'ale", 
            harf: "ـ ـا ـ ـ", num: 4,
            desc: `
            <p>• <b>Müşareket:</b> İşteşlik (karşılıklılık) bildirir. <br>Örn: <span class="arabic-sample">كَتَبَ</span> (Yazdı) → <span class="arabic-sample">كَاتَبَ</span> (Yazıştı)</p>
            <p>• <b>Kararlılık:</b> Israr ve davranış biçimi anlatır. <br>Örn: <span class="arabic-sample">طَلَبَ</span> (İstedi) → <span class="arabic-sample">طَالَبَ</span> (Talep etti)</p>
            <p>• <b>Mübalağa:</b> Aşırılık belirtir. <br>Örn: <span class="arabic-sample">ضَعُفَ</span> (Zayıfladı) → <span class="arabic-sample">ضَاعَفَ</span> (Katladı)</p>
            ` 
        },
        { 
            keys: ["infi'al", "infi'al", "infial", "infial"], 
            title: "İnfi'al", 
            harf: "اِنْـ ـ ـ ـ", num: 5,
            desc: `
            <p>• <b>Edilgenlik:</b> Fiili edilgen (yapıldı) hale getirir. <br>Örn: <span class="arabic-sample">كَسَرَ</span> (Kırdı) → <span class="arabic-sample">اِنْكَسَرَ</span> (Kırıldı)</p>
            <p>• <b>Dönüşlülük:</b> Eylemin etkisi özneye döner. <br>Örn: <span class="arabic-sample">قَلَبَ</span> (Döndürdü) → <span class="arabic-sample">اِنْقَلَبَ</span> (Ters döndü)</p>
            ` 
        },
        { 
            keys: ["ifti'al", "ifti'al", "iftial", "iftial"], 
            title: "İfti'al", 
            harf: "اِ ـ ـتَـ ـ ـ", num: 5,
            desc: `
            <p>• <b>Dönüşlülük:</b> Eylemin sonucunu belirtir. <br>Örn: <span class="arabic-sample">اِجْتَمَعَ</span> (Toplandı), <span class="arabic-sample">اِرْتَفَعَ</span> (Yükseldi)</p>
            <p>• <b>Gayret:</b> Çaba ve edinme manası katar. <br>Örn: <span class="arabic-sample">اِجْتَهَدَ</span> (Çalıştı), <span class="arabic-sample">اِكْتَسَبَ</span> (Kazandı)</p>
            <p>• <b>İşteşlik:</b> Ortaklık bildirir. <br>Örn: <span class="arabic-sample">اِخْتَصَمَ</span> (Tartıştı)</p>
            ` 
        },
        { 
            keys: ["if'ılal", "if'ılal", "if'ilal", "if'ilal", "ifılal", "ifilal", "ifılal"], 
            title: "İf'ılal", 
            harf: "اِ ـ ـ ـّ", num: 5,
            desc: `
            <p>• <b>Renkler:</b> Renk bildiren fiillerde kullanılır. <br>Örn: <span class="arabic-sample">اِحْمَرَّ</span> (Kızardı), <span class="arabic-sample">اِصْفَرَّ</span> (Sarardı)</p>
            <p>• <b>Kusurlar:</b> Sakatlık ve noksanlık belirtir. <br>Örn: <span class="arabic-sample">اِعْرَجَّ</span> (Topalladı)</p>
            ` 
        },
        { 
            keys: ["tefe'ul", "tefeul", "tefe'ül", "tefeül"], 
            title: "Tefe'ul", 
            harf: "تَـ ـ ـّ ـ", num: 5,
            desc: `
            <p>• <b>Çaba:</b> Gayret ve sahiplenme bildirir. <br>Örn: <span class="arabic-sample">تَصَبَّرَ</span> (Sabretti), <span class="arabic-sample">تَوَسَّدَ</span> (Yastık edindi)</p>
            <p>• <b>Dönüşlülük:</b> Tef'il vezninin dönüşlü halidir. <br>Örn: <span class="arabic-sample">تَفَرَّقَ</span> (Dağıldı), <span class="arabic-sample">تَكَسَّرَ</span> (Parçalandı)</p>
            <p>• <b>Kademelilik:</b> İşin aşama aşama yapıldığını belirtir. <br>Örn: <span class="arabic-sample">تَنَزَّلَ</span> (İndi)</p>
            ` 
        },
        { 
            keys: ["tefa'ul", "tefaul", "tefa'ül", "tefaül"], 
            title: "Tefa'ul", 
            harf: "تَـ ـ ـا ـ ـ", num: 5,
            desc: `
            <p>• <b>İşteşlik:</b> Ortaklık belirtir. <br>Örn: <span class="arabic-sample">تَعَاوَنَ</span> (Yardımlaştı), <span class="arabic-sample">تَمَازَحَ</span> (Şakalaştı)</p>
            <p>• <b>Yapmacıklık:</b> Olmayan bir şeyi olmuş gibi gösterir. <br>Örn: <span class="arabic-sample">تَمَارِضَ</span> (Hasta numarası yaptı)</p>
            <p>• <b>Peşpeşelik:</b> İşin ardarda gerçekleştiğini bildirir. <br>Örn: <span class="arabic-sample">تَسَاقَطَ</span> (Döküldü)</p>
            ` 
        },
        { 
            keys: ["istif'al", "istif'al", "istifal", "istifal"], 
            title: "İstif'al", 
            harf: "اِسْتَـ ـ ـ ـ", num: 6,
            desc: `
            <p>• <b>İstek:</b> Talep ve bulmak manası verir. <br>Örn: <span class="arabic-sample">اِسْتَغْفَرَ</span> (Af diledi), <span class="arabic-sample">اِسْتَسْهَلَ</span> (Kolay buldu)</p>
            <p>• <b>Değişim:</b> Durum değişikliği veya vakit bildirir. <br>Örn: <span class="arabic-sample">اِسْتَحْجَرَ</span> (Taşlaştı), <span class="arabic-sample">اِسْتَحْصَدَ</span> (Hasat vakti geldi)</p>
            <p>• <b>Geçişlilik:</b> Lazım fiili müteaddi yapar. <br>Örn: <span class="arabic-sample">اِسْتَخْرَجَ</span> (Çıkardı)</p>
            ` 
        }
    ];

    for (let bab of babs) {
        if (bab.keys.includes(cleanName)) return { title: bab.title, desc: bab.desc, harf: bab.harf, num: bab.num };
    }
    return null; 
}

window.showBabInfo = function(rawName) {
    const overlay = document.getElementById('bab-info-overlay');
    const titleEl = document.getElementById('bab-info-title');
    const textEl = document.getElementById('bab-info-text');
    
    let info = getBabInfo(rawName);

    if(overlay && titleEl && textEl && info) {
        titleEl.innerText = info.title + " Babı";
        textEl.innerHTML = info.desc; 
        
        overlay.style.display = 'flex';
        document.getElementById("game-wrapper").style.display = "none";

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
    // Renklerin daha koyu, tok ve okunaklı pastel tonları
    const pastelColors = ['#f87171', '#fb923c', '#eab308', '#4ade80', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '#a78bfa', '#c084fc', '#f472b6', '#fb7185'];
    
    // 'align="center"' olan td'leri bul (Masdar Tablosundaki Hücreler)
    const tdElements = document.querySelectorAll('td[align="center"]');
    let colorIndex = 0;
    tdElements.forEach(td => {
        // Hücre içindeki yazıyı (ikon html'i olmadan) saf metin olarak çekiyoruz
        let rawText = td.innerText || td.textContent;
        let originalText = rawText.replace(/ⓘ/g, '').trim(); 
        
        // Bu yazı gerçekten bir Bab adı mı diye soruyoruz
        let info = getBabInfo(originalText);
        
        if (info) {
            let iconColor = pastelColors[colorIndex % pastelColors.length];
            colorIndex++;
            // 1. Eğer hücrede henüz (i) ikonu yoksa, JS ile biz ekleyelim
            if (!td.querySelector('.info-icon')) {
                let leftBadgeHtml = '';
                if (info.harf && info.num) {
                    let harfDisplay = info.harf;
                    // Şedde hack'leri kaldırıldı çünkü artık tüm şeddeler çizgilere (tatweel) bağlı ve native olarak sorunsuz render ediliyor.
                    leftBadgeHtml = `<span class="ar" style="line-height: 1; color: #FF3B30 !important; white-space: nowrap;" dir="rtl">${harfDisplay}</span>
                        <span style="font-family: 'Arakom', sans-serif; font-weight: normal; font-size: 1.25rem; color: #94a3b8; justify-self: start; padding-left: 5px;">${info.num}</span>`;
                }
                
                td.style.position = 'relative';
                td.style.padding = '0';
                td.innerHTML = `
                <div style="display: grid; grid-template-columns: 110px 25px 75px 25px; justify-content: space-evenly; justify-items: center; align-items: center; width: 100%; height: 100%;" dir="ltr">
                    ${leftBadgeHtml}
                    <span style="font-family: 'Arakom', sans-serif; font-size: 1.15rem; font-weight: normal; color: #FF3B30; white-space: nowrap;">${originalText}</span>
                    <span class="info-icon" style="position: relative !important; top: auto !important; transform: none !important; right: auto !important; margin: 0 !important; color: ${iconColor} !important; cursor: pointer;" title="${info.title} Özellikleri"><i class="fas fa-info-circle"></i></span>
                </div>`;
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
document.addEventListener("DOMContentLoaded", () => {
    initBabIcons();
    setTimeout(() => { if (typeof selectReadyVerb === 'function' && window.innerWidth > 1024) selectReadyVerb("فعل"); }, 300);
});
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(() => {
        initBabIcons();
        if (typeof selectReadyVerb === 'function' && window.innerWidth > 1024) selectReadyVerb("فعل");
    }, 200);
}
// ===============================================================
// 1. KRONOMETRE BUTONU EKLEYİCİ VE FİİL DEDEKTÖRÜ (SVG VERSİYONU)
// ===============================================================

// Sadece fiili olanları tespit eden motor (Eksikti, geri eklendi!)
function hasVerbsToRead(root) {
    if (!root || root.length !== 3) return false;
    if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[root]) {
        const verbRefs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16, 52,53,54,58,59,60,64,65,66,71,72,73,77,78,79,83,84,85,88,89,90,94,95,96,100,101,102];
        const existingRefs = Object.keys(sozlukVerileri[root]).map(Number);
        return existingRefs.some(r => verbRefs.includes(r));
    }
    return false; 
}

setInterval(() => {
    try {
        const currentRootSafe = typeof currentRoot !== 'undefined' ? currentRoot : "";
        const canShowTimer = hasVerbsToRead(currentRootSafe);
        const isDraggableOnScreen = document.querySelector('.draggable-root-clone') !== null;

        // Hatasız okunan tek satırlık zarif SVG kodu
        const mySvg = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#334155" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"></circle><polyline points="12 9 12 13 14 15"></polyline><line x1="10" y1="2" x2="14" y2="2"></line><line x1="12" y1="2" x2="12" y2="5"></line><line x1="18" y1="6" x2="16.5" y2="7.5"></line></svg>';
        const listSvg = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="16" y2="6"></line><line x1="3" y1="12" x2="16" y2="12"></line><line x1="3" y1="18" x2="16" y2="18"></line><line x1="21" y1="6" x2="21.01" y2="6"></line><line x1="21" y1="12" x2="21.01" y2="12"></line><line x1="21" y1="18" x2="21.01" y2="18"></line></svg>';
        
        // A. TAŞINABİLİR TAHTALAR İÇİN (Kahverengi Kutu)
        document.querySelectorAll('.draggable-root-clone').forEach(box => {
            let wrapper = box.querySelector('.root-clone-buttons');
            let btn = box.querySelector('.kutu-timer-btn');
            let listBtn = box.querySelector('.kutu-list-btn');
            
            if (canShowTimer && (!btn || !listBtn)) {
                if(btn) btn.remove();
                if(listBtn) listBtn.remove();
                if(!wrapper) {
                    wrapper = document.createElement('div');
                    wrapper.className = 'root-clone-buttons';
                    box.appendChild(wrapper);
                } else {
                    wrapper.innerHTML = ''; // Clear contents
                }
                
                let newBtn = document.createElement('div');
                newBtn.className = 'kutu-timer-btn';
                newBtn.innerHTML = mySvg;
                newBtn.title = 'Hız ve Telaffuz Testi';
                
                newBtn.onmousedown = (e) => { e.stopPropagation(); };
                newBtn.ontouchstart = (e) => { e.stopPropagation(); };
                newBtn.onclick = (e) => { e.stopPropagation(); window.openMarathon(); };

                let newListBtn = document.createElement('div');
                newListBtn.className = 'kutu-list-btn';
                newListBtn.innerHTML = listSvg;
                newListBtn.title = 'Hızlı Sözlük Modu';
                newListBtn.onmousedown = (e) => { e.stopPropagation(); };
                newListBtn.ontouchstart = (e) => { e.stopPropagation(); };
                newListBtn.onclick = (e) => { e.stopPropagation(); window._fdmReturnToRoots=false; openFastDictionaryMode(); };
                
                // Üstte liste, altta kronometre
                wrapper.appendChild(newListBtn);
                wrapper.appendChild(newBtn);
                
            } else if (!canShowTimer && wrapper) {
                wrapper.remove();
            } else if (!canShowTimer && btn) {
                // Eger wrapper yoksa ama butonlar varsa (eski yapi kalmissa)
                btn.remove();
                if(listBtn) listBtn.remove();
            }
        });

        // B. ANA SABİT KUTU İÇİN (Yukarıdaki Header)
        const textEl = document.getElementById('root-text-display');
        if (textEl) {
            const desktopBox = textEl.parentElement; 
            let btnMain = desktopBox.querySelector('.kutu-timer-btn');
            let listBtnMain = desktopBox.querySelector('.kutu-list-btn');
            
            if (canShowTimer && (!btnMain || !listBtnMain) && !isDraggableOnScreen) {
                if(btnMain) btnMain.remove();
                if(listBtnMain) listBtnMain.remove();
                desktopBox.style.position = 'relative'; 
                let newBtnMain = document.createElement('div');
                newBtnMain.className = 'kutu-timer-btn';
                newBtnMain.innerHTML = mySvg;
                newBtnMain.title = 'Hız ve Telaffuz Testi';
                newBtnMain.onclick = (e) => { e.stopPropagation(); window.openMarathon(); };
                desktopBox.appendChild(newBtnMain);

                let newListBtnMain = document.createElement('div');
                newListBtnMain.className = 'kutu-list-btn';
                newListBtnMain.innerHTML = listSvg;
                newListBtnMain.title = 'Hızlı Sözlük Modu';
                newListBtnMain.onclick = (e) => { e.stopPropagation(); window._fdmReturnToRoots=false; openFastDictionaryMode(); };
                desktopBox.appendChild(newListBtnMain);

                
            } else if ((!canShowTimer || isDraggableOnScreen) && btnMain) {
                btnMain.remove();
                let listBtnMain = desktopBox.querySelector('.kutu-list-btn');
                if(listBtnMain) listBtnMain.remove();
                
            }
        }

        // C. MOBİL ÜST BAR İÇİN
        const mobileRootDisplay = document.querySelector('.mobile-root-display');
        if (mobileRootDisplay) {
            const mobileBox = mobileRootDisplay.parentElement;
            let btnM = mobileBox.querySelector('.kutu-timer-btn-mobile');
            let listBtnM = mobileBox.querySelector('.kutu-list-btn-mobile');

            if (canShowTimer && (!btnM || !listBtnM)) {
                if(btnM) btnM.remove();
                if(listBtnM) listBtnM.remove();
                mobileBox.style.position = 'relative';
                let newBtnM = document.createElement('div');
                newBtnM.className = 'kutu-timer-btn kutu-timer-btn-mobile';
                newBtnM.innerHTML = mySvg;
                newBtnM.onclick = (e) => { e.stopPropagation(); window.openMarathon(); };
                mobileBox.appendChild(newBtnM);

                let newListBtnM = document.createElement('div');
                newListBtnM.className = 'kutu-list-btn kutu-list-btn-mobile';
                newListBtnM.innerHTML = listSvg;
                newListBtnM.onclick = (e) => { e.stopPropagation(); window._fdmReturnToRoots=false; openFastDictionaryMode(); };
                mobileBox.appendChild(newListBtnM);

                
            } else if (!canShowTimer && btnM) {
                btnM.remove();
                let listBtnM = mobileBox.querySelector('.kutu-list-btn-mobile');
                if(listBtnM) listBtnM.remove();
                
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
window.mErrorMemory = new Map();
window.mTimerInterval = null;
window.mStartTime = 0;
window.mElapsedTime = 0;
window.mIsPaused = false;
window.mRaceMode = false; // Yarışmanın başlayıp başlamadığını takip eder
window.mAudioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSfx(f, t, d) { try {
    if (window.mAudioCtx.state === 'suspended') window.mAudioCtx.resume();
    const o = window.mAudioCtx.createOscillator(); const g = window.mAudioCtx.createGain();
    o.type = t; o.frequency.setValueAtTime(f, window.mAudioCtx.currentTime);
    g.gain.setValueAtTime(0.05, window.mAudioCtx.currentTime);
    o.connect(g); g.connect(window.mAudioCtx.destination);
    o.start(); o.stop(window.mAudioCtx.currentTime + d); } catch(e) { console.warn("Sfx error", e); }
}

// O KÖKTEKİ TÜM MAZİ FİİLLERİ VE ÖRNEK CÜMLELERİNİ BULAN FONKSİYON
function getAvailableMaziVerbs(root) {
    const maziRefs = [1, 8, 11, 14, 52, 58, 64, 71, 77, 83, 88, 94, 100];
    let list = [];
    
    if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[root]) {
        const rootData = sozlukVerileri[root];
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
    window.isAtlasMode = false;
    document.getElementById('timer-display').style.display = 'block';
    document.getElementById('top-bar-panel').style.display = 'flex';
    document.getElementById('screen-play').style.display = '';
    document.getElementById('screen-atlas').style.display = '';
    document.getElementById('screen-result').style.display = '';
    showMarathonScreen('screen-play');
    document.getElementById('live-total-score').style.display = 'block';
    document.getElementById('chrono-main').style.display = 'block';
    document.getElementById('stage-label').style.display = 'block';
    document.getElementById('pause-btn').style.display = 'block';
    let atlasSel = document.getElementById('atlas-selector-container');
    if(atlasSel) atlasSel.style.display = 'none';
    
    const gw = document.getElementById("game-wrapper");
    if (gw) gw.style.display = "flex";
    
    let prevArr = document.getElementById('prev-arr');
    if (prevArr) prevArr.style.display = 'flex';
    let nextArr = document.getElementById('next-arr');
    if (nextArr) nextArr.style.display = 'flex';

    /* KAPSAM: '.important-roots-wrapper' yalnız kökler penceresinin
       (#verb-overlay) içinde var; maraton/atlas ekranında yok. */
    let rootContainer = document.querySelector('#marathon-overlay .important-roots-wrapper');
    if (rootContainer) rootContainer.style.display = 'flex';
    let verbDisplay = document.getElementById('verb-root-display');
    if (verbDisplay) verbDisplay.style.display = 'flex';
    let scoreBar = document.getElementById('score-bar');
    if(scoreBar) scoreBar.style.display = 'flex';

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

    let mOverlay = document.getElementById('marathon-overlay');
    mOverlay.classList.add("telaffuz-mode");
    mOverlay.classList.add('active');
    mOverlay.scrollTop = 0;
    
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
        let btnHtml = `<div style="font-family: 'Arakom', serif; font-size: 4.8rem; font-weight: normal; color: #000000; text-align: center;">${wordHtml}</div>`;
        
 
       
        // Profesyonel Örnek Cümle Kutusu (Dizi/Obje Akıllı Seçici)
        if (v.ornek) {
            // Eğer birden fazla örnek (dizi) girilmişse ilkini seç, tekilse kendisini al
            let seciliOrnek = Array.isArray(v.ornek) ? v.ornek[0] : v.ornek;
            
            let ornekAr = seciliOrnek.ar || "";
            let ornekTr = seciliOrnek.tr || "";
            
            if (ornekAr || ornekTr) {
                btnHtml += `
                    <div style="background: #f3f0ff; border-right: 5px solid #6c5ce7; border-radius: 16px; padding: 20px 25px; width: 100%; box-sizing: border-box; text-align: center; display: flex; flex-direction: column; gap: 15px; position: relative;">
                        <div style="position: absolute; top: 12px; right: 18px; color: #cbd5e1; font-size: 1.5rem;"><i class="fas fa-quote-right"></i></div>
                        <div style="font-family: 'Arakom', serif; font-size: 2.8rem; color: #0f172a; line-height: 1.5; direction: rtl;">${ornekAr}</div>
                        <div style="font-family: 'Segoe UI', sans-serif; font-size: 1.3rem; color: #000000; font-weight: normal; direction: ltr; letter-spacing: 0.3px;">${ornekTr}</div>
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
    document.getElementById("marathon-overlay").classList.remove("telaffuz-mode");
    if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
    clearInterval(window.mTimerInterval);
    clearInterval(window.mCountdownInterval);
    window.mRaceMode = false;
    document.getElementById('marathon-overlay').classList.remove('active');
    
    // Ekranda "MAZİ" veya süre yazısı asılı kalmasın diye temizlik
    hideMarathonHeaders();
    document.getElementById('chrono-main').style.display = 'none';

    // Dilbilgisi listesinden gelindiyse çarpıya basınca o listeye geri dön
    if (window._atlasFromGrammar) {
        window._atlasFromGrammar = false;
        const gwg = document.getElementById("game-wrapper");
        if (gwg) gwg.style.display = "flex";
        const gmenu = document.getElementById('mobile-grammar-menu-overlay');
        if (gmenu) gmenu.style.display = 'flex';
    } else
    // Telaffuz ekranından başlatıldıysa oraya geri dön; değilse ana araca dön
    if (window.mLaunchedFromTelaffuz) {
        const tel = document.getElementById('telaffuz-overlay');
        if (tel) tel.style.display = 'block';
        document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
        window.mLaunchedFromTelaffuz = false;
    } else {
        const gw = document.getElementById("game-wrapper");
        if (gw) gw.style.display = "flex";
    }
};

// 5. OYUN İÇİNDEKİ ⏱️ BUTONUNA BASILINCA 'BAŞLA' EKRANINI GETİRİR
window.handleMarathonChronoClick = function() {
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    if (!window.mRaceMode) {
        window.mRaceMode = true;
        document.getElementById('chrono-main').classList.add('active'); 
        
        const overlay = document.getElementById('marathon-countdown-overlay');
        document.getElementById("marathon-overlay").appendChild(overlay);

        overlay.style.cssText = "position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; background: #ffffff !important; z-index: 2147483647 !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-direction: column !important;";

        overlay.style.display = 'flex';
        document.getElementById("game-wrapper").style.display = "none";

        
        const startBtn = document.getElementById('start-btn-ui');
        startBtn.style.zIndex = "2147483647";

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
        document.getElementById("game-wrapper").style.display = "flex";
        
        window.mErrorMemory.clear();
        loadMarathonTable();
    }
};

// 6. "BAŞLA" BUTONUNA TIKLANINCA ÇALIŞIR (3-2-1 KUSURSUZ GÜVENLİ SAYIM)
window.startMarathonCountdown = function() {
    const startBtn = document.getElementById('start-btn-ui');
        startBtn.style.zIndex = "2147483647";

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
            document.getElementById("game-wrapper").style.display = "flex";
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
        if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[rootSafe]) {
            if (sozlukVerileri[rootSafe][4]) { 
                muzariRef = 4; emirRef = 5; babNo = 2;
                if (typeof babVezinleri !== 'undefined' && babVezinleri[2]) { muKalip = babVezinleri[2].muzari; eKalip = babVezinleri[2].emir; }
            }
            else if (sozlukVerileri[rootSafe][6]) { 
                muzariRef = 6; emirRef = 7; babNo = 3;
                if (typeof babVezinleri !== 'undefined' && babVezinleri[3]) { muKalip = babVezinleri[3].muzari; eKalip = babVezinleri[3].emir; }
            }
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
// === MARATON TABLOLARI: KAYDIRARAK (SWIPE) GEÇİŞ — mazi/muzari/emir ===
// Hem dokunmatik (mobil) hem fare-sürükleme (masaüstü) için Pointer Events.
window.attachMarathonSwipe = window.attachMarathonSwipe || function(el) {
    if (!el || el._mSwipeAttached) return;
    el._mSwipeAttached = true;
    el.style.touchAction = 'pan-y'; // dikey scroll korunur, yatay jest JS'e gelir
    let sx = 0, sy = 0, down = false, swiped = false;
    const THRESH = 55;
    el.addEventListener('pointerdown', function(e) {
        if (window.isAtlasMode) { down = false; return; }
        if (e.pointerType === 'mouse' && e.button !== 0) { down = false; return; }
        sx = e.clientX; sy = e.clientY; down = true; swiped = false;
    });
    el.addEventListener('pointermove', function(e) {
        if (!down || swiped) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) > THRESH && Math.abs(dx) > Math.abs(dy) * 1.3) {
            swiped = true;
            // Yon ters cevrildi (kullanici istegi): sola kaydir = geri (dir=-1), saga kaydir = ileri (dir=1)
            if (dx < 0) { if (window.mCurrentStage > 0) window.changeMarathonStage(-1); }
            else { if (window.mCurrentStage < 2) window.changeMarathonStage(1); }
        }
    });
    el.addEventListener('pointerup', function() { down = false; });
    el.addEventListener('pointercancel', function() { down = false; });
    el.addEventListener('pointerleave', function() { down = false; });
    // Kaydirma sonrasi yanlislikla hucre tiklamasini (hata isaretleme) engelle
    el.addEventListener('click', function(e) {
        if (swiped) { e.stopPropagation(); e.preventDefault(); swiped = false; }
    }, true);
};

window.loadMarathonTable = function() {
    const table = document.getElementById('table-view');
    if (!table) return;
    table.innerHTML = '';
    if (typeof window.attachMarathonSwipe === 'function') window.attachMarathonSwipe(document.getElementById('screen-play'));
    
    const start = window.mRanges[window.mCurrentStage][0];
    const end = window.mRanges[window.mCurrentStage][1];
    
    const stageLabel = document.getElementById('stage-label');
    if (stageLabel) {
        if (window.innerWidth <= 1024) {
            stageLabel.innerText = ["MAZİ", "MUZARİ", "EMİR"][window.mCurrentStage];
        } else {
            stageLabel.innerText = ["MAZİ", "MUZARİ", "EMİR"][window.mCurrentStage];
        }
    }

    window.mActiveSet.slice(start, end).forEach((w, i) => {
        const absoluteIdx = start + i;
        const div = document.createElement('div');
        
        // YENİ EKLENEN: Maraton için Ben/Biz satırı kontrolü
        let rowIndex = Math.floor(i / 3);
        let rowClass = (rowIndex === 4) ? 'mutekellim-row' : ((rowIndex % 2 === 0) ? 'muez-row' : 'mue-row');
        
        div.className = 'marathon-cell ' + rowClass;
        const errorKey = window.mCurrentStage + '_' + absoluteIdx;
        if(window.mErrorMemory.has(errorKey)) div.classList.add('error-active');
        
        div.innerHTML = typeof ColorEngine !== 'undefined' ? ColorEngine.colorize(w, currentRoot.split("")) : w;
        
        div.onclick = function() {
            if (window.mErrorMemory.has(errorKey)) {
                window.mErrorMemory.delete(errorKey);
                this.classList.remove('error-active');
                if (typeof playSfx === 'function') playSfx(400, 'sine', 0.1); 
            } else {
                window.mErrorMemory.set(errorKey, w);
                this.classList.add('error-active');
                if (typeof playSfx === 'function') playSfx(150, 'sawtooth', 0.2); 
            }
        };
        table.appendChild(div);
    });

    const prevArr = document.getElementById('prev-arr');
    const nextArr = document.getElementById('next-arr');
    // Sol ok (İleri)
    if (prevArr) {
        prevArr.disabled = false;
        prevArr.innerText = (window.mCurrentStage === 2) ? "✓" : "❮";
    }
    // Sağ ok (Geri)
    if (nextArr) {
        nextArr.disabled = (window.mCurrentStage === 0);
        nextArr.innerText = "❯";
    }
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
        window.mErrorMemory.forEach((word) => {
            const item = document.createElement('div');
            item.className = 'error-item'; 
            item.innerHTML = typeof ColorEngine !== 'undefined' ? ColorEngine.colorize(word, currentRoot.split("")) : word;
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
    if (typeof toggleRootHint === 'function') toggleRootHint(true);
    const tempDisp = document.getElementById('temp-root-display');
    if (tempDisp) tempDisp.innerText = "";
    if (typeof updateTempDisplay === 'function') updateTempDisplay();
    if (typeof resetTableOnly === 'function') resetTableOnly(true);
    if (typeof clearDraggableRoots === 'function') clearDraggableRoots();
    if (typeof highlightEasterEggBoxes === 'function') highlightEasterEggBoxes("");

    // Klavyeyi ve Siyah Ekranı Aç
    const overlay = document.getElementById('keyboard-overlay');
    if (overlay) overlay.style.display = 'flex';
        document.getElementById("game-wrapper").style.display = "none";

    
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

// Sağ tıklamayı (Context Menu) engelle
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Klavye kısayollarını engelle
document.addEventListener('keydown', function(e) {
    // Kopyalama (Cmd+C / Ctrl+C), Kesme (Cmd+X / Ctrl+X), Kaynağı Görüntüleme (Cmd+U / Ctrl+U)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
    }
    
    // Geliştirici Araçlarını Açmayı Engelleme (F12, Cmd+Option+I, Ctrl+Shift+I)
    if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c'))) {
        e.preventDefault();
    }
});

// Sürükleyip bırakarak metin/eleman dışa aktarımını engelle (Oyun mekaniğindeki kendi draggable öğelerin haricindeki iskelet için)
document.addEventListener('DOMContentLoaded', function() {
    const tableView = document.getElementById('table-view');
    if (tableView) {
        tableView.addEventListener('dragstart', function(e) {
            if (!e.target.classList.contains('draggable-root-clone')) {
                e.preventDefault();
            }
        });
    }
});

// --- KÖKLER VE KELİMELER İNCELEME (CHOICE MENU) MANTIĞI ---

function openRootsModal() {

    // Her zaman aç (SVG sürekli ikon olarak kaldığı için)
    if (true) {
        const rootsContent = document.getElementById('roots-main-content');
        const thematicContent = document.getElementById('thematic-words-content');
        
        if (rootsContent) rootsContent.classList.remove('hidden');
        if (thematicContent) thematicContent.classList.add('hidden');
        
        const rootHeader = document.querySelector('.root-header');
        if (rootHeader) rootHeader.style.display = 'none';

        /* GÜVENLİK KEMERİ: başka bir ekran üst satıra satıriçi display
           bırakmış olabilir; her açılışta temizlensin. */
        const onemliSargi = document.querySelector('.important-roots-wrapper');
        if (onemliSargi) onemliSargi.style.removeProperty('display');

        const overlay = document.getElementById('verb-overlay');
        if (overlay) overlay.style.display = 'flex';
        document.getElementById("game-wrapper").style.display = "none";

        
        // Tabloyu vs sıfırla
        if (typeof updateTempDisplay === 'function') updateTempDisplay();
        if (typeof resetTableOnly === 'function') resetTableOnly(true);
        if (typeof clearDraggableRoots === 'function') clearDraggableRoots();
        if (typeof highlightEasterEggBoxes === 'function') highlightEasterEggBoxes("");
        
        const searchInput = document.getElementById('root-search');
        if (searchInput) searchInput.value = "";
        if (typeof toggleRootHint === 'function') toggleRootHint(true);
        if (typeof currentSearchQuery !== 'undefined') currentSearchQuery = "";
        if (typeof updatePredictionsAndFilter === 'function') updatePredictionsAndFilter();
        
        const popup = document.getElementById('integrated-keyboard-popup');
        if (popup) popup.classList.remove('active');
        
        if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    }
}

function showThematicView() {
    const rootsContent = document.getElementById('roots-main-content');
    const thematicContent = document.getElementById('thematic-words-content');
    
    if (rootsContent) rootsContent.classList.add('hidden');
    if (thematicContent) {
        thematicContent.classList.remove('hidden');
        thematicContent.style.display = 'block';
        
        const rootHeader = document.querySelector('.root-header');
        if (rootHeader) rootHeader.style.display = 'flex';
        renderThematicLists();
    }
}

function toggleThematicAccordion(element, key) {
    // If it's already active, close it
    if (element.classList.contains('active')) {
        element.classList.remove('active');
        const content = document.getElementById(`content-${key}`);
        if(content) content.style.display = 'none';
        const icon = element.querySelector('.thematic-accordion-icon');
        if(icon) icon.className = 'fas fa-chevron-down thematic-accordion-icon';
        
        // Hide the viewer container completely if nothing is active
        const tvc = document.getElementById('thematic-viewer-container');
        if (tvc) tvc.style.display = 'none';
    } else {
        // Close all headers and contents
        const allItems = document.querySelectorAll('.thematic-accordion-item');
        allItems.forEach(item => {
            item.classList.remove('active');
            const icon = item.querySelector('.thematic-accordion-icon');
            if(icon) icon.className = 'fas fa-chevron-down thematic-accordion-icon';
        });
        const allContents = document.querySelectorAll('.thematic-accordion-panel');
        allContents.forEach(c => c.style.display = 'none');
        
        // Open the clicked one
        element.classList.add('active');
        const content = document.getElementById(`content-${key}`);
        if(content) content.style.display = 'block';
        const targetIcon = element.querySelector('.thematic-accordion-icon');
        if(targetIcon) targetIcon.className = 'fas fa-chevron-up thematic-accordion-icon';
        
        // Optional: Show external viewer if exists
        const viewer = document.getElementById('thematic-viewer-container');
        if (viewer) {
            viewer.style.display = 'block';
            setTimeout(() => {
                viewer.scrollIntoView({behavior: 'smooth', block: 'nearest'});
            }, 50);
        } else {
            // If no external viewer, scroll to the accordion item itself
            setTimeout(() => {
                element.scrollIntoView({behavior: 'smooth', block: 'start'});
            }, 50);
        }
    }
}
let thematicCategoriesData = (typeof kategoriTanimlari !== 'undefined') ? JSON.parse(JSON.stringify(kategoriTanimlari)) : {};
let activeMemoryGames = {};

function renderThematicLists() {
    const container = document.getElementById('thematic-accordion-container');
    if (!container) return;
    
    if (typeof sozlukVerileri === 'undefined') return;
    
    for (const key in thematicCategoriesData) {
        thematicCategoriesData[key].items = [];
    }
    const categories = thematicCategoriesData;
    
    for (const rootKey in sozlukVerileri) {
        const rootData = sozlukVerileri[rootKey];
        
        if (rootData.isDictOnly && rootData.tip) {
            let tipList = Array.isArray(rootData.tip) ? rootData.tip : [rootData.tip];
            tipList.forEach(tip => {
                let actualTip = tip;
                if (tip === "sayi" && rootKey.includes("Sıra:")) actualTip = "sirasayi";
                /* Tasgir/Tafdil birer VEZİN: kendi konu listeleri kaldırıldı.
                   kategoriTanimlari'nda yoklar; buradaki otomatik algılama
                   onları geri diriltmesin diye açıkça eleniyorlar. */
                if (actualTip === "tasgir" || actualTip === "tafdil" || actualTip === "isim") return;
                
                if (!categories[actualTip]) {
                // OTOMATİK ALGILAMA: Kullanıcı sozlukverileri.js'ye tip eklemiş ama kategoriTanimlari'na eklemeyi unutmuşsa,
                // sistem çökmesin diye otomatik olarak geçici bir liste başlığı oluşturuyoruz.
                let autoTitle = actualTip.replace(/_/g, " ");
                autoTitle = autoTitle.charAt(0).toUpperCase() + autoTitle.slice(1);
                categories[actualTip] = { title: autoTitle, icon: "📌", items: [] };
            }
            
            if (categories[actualTip]) {
                const tekilData = rootData.tekil || rootData["1"] || rootData; 
                if (tekilData && tekilData.base) {
                    categories[actualTip].items.push({
                        rootKey: rootKey,
                        arText: tekilData.base.arText || rootKey,
                        trText: tekilData.base.trText || "",
                        emoji: tekilData.base.emoji || ""
                    });
                }
            }
            });
        } else if (rootKey.length === 3) {
            // Tıpkı 'isDictOnly' gibi, kalıpların içindeki 'tip' özelliklerini tarayarak listelere ekle
            for (const kalipNo in rootData) {
                const kData = rootData[kalipNo];
                if (kData && kData.tip) {
                    let tipList = Array.isArray(kData.tip) ? kData.tip : [kData.tip];
                    tipList.forEach(tip => {
                        /* Tasgir/Tafdil vezin, konu değil — kendi listeleri yok. */
                        if (tip === "tasgir" || tip === "tafdil" || tip === "isim") return;
                        if (!categories[tip]) {
                        let autoTitle = tip.replace(/_/g, " ");
                        autoTitle = autoTitle.charAt(0).toUpperCase() + autoTitle.slice(1);
                        categories[tip] = { title: autoTitle, icon: "📌", items: [] };
                    }
                    if (kData.base && kData.base.arText) {
                        categories[tip].items.push({
                            rootKey: rootKey,
                            kalipId: kalipNo,
                            arText: kData.base.arText,
                            trText: kData.base.trText || "",
                            emoji: kData.base.emoji || ""
                        });
                    }
                    });
                }
            }

            /* 49 (İsm-i Tasgir) ile 50-51 (İsm-i Tafdil) kalıplarını konu
               listesine toplayan blok KALDIRILDI: ikisi de vezin, konu değil.
               Bu kelimeler tabloda ilgili kutuya dokununca zaten örnekleriyle
               listeleniyor. */
        }
    }
    
    
    // Kullanıcı talebi: Sayı kartları listelerde karışık görünsün
    if (categories["sayi"] && categories["sayi"].items) {
        categories["sayi"].items.sort(() => Math.random() - 0.5);
    }
    if (categories["sirasayi"] && categories["sirasayi"].items) {
        categories["sirasayi"].items.sort(() => Math.random() - 0.5);
    }

    thematicCategoriesData = categories;
    let html = "";

    
    // Kategorileri önem sırasına göre (kategoriTanimlari'ndaki tanımlanma sırasıyla) diz
    const originalKeys = typeof kategoriTanimlari !== 'undefined' ? Object.keys(kategoriTanimlari) : [];
    const sortedKeys = Object.keys(categories).filter(key => categories[key].items.length > 0).sort((a, b) => {
        let idxA = originalKeys.indexOf(a);
        let idxB = originalKeys.indexOf(b);
        if (idxA === -1) idxA = 999;
        if (idxB === -1) idxB = 999;
        return idxA - idxB;
    });

    /* ÖBEKLEME: kırktan fazla liste düz bir ızgarada alt alta dizilince
       aranan başlık gözle taranıyordu. Artık kategoriler konu öbeklerine
       ayrılıyor (veri_sozluk.js'teki `grup` alanı + kategoriGruplari);
       her öbek kendi başlığının altında, kendi bloğunda durur. Grubu
       tanımsız bir liste çıkarsa en sona "Diğer" öbeğine düşer. */
    const isMobile = window.innerWidth <= 1024;
    const cols = isMobile ? 1 : 3;
    const _gruplar = (typeof kategoriGruplari !== 'undefined') ? kategoriGruplari : null;
    const _grupAdi = (k) => ((typeof kategoriTanimlari !== 'undefined' && kategoriTanimlari[k]) ? kategoriTanimlari[k].grup : null);
    const _obekler = [];
    if (_gruplar) {
        for (const _gk in _gruplar) {
            const _uye = sortedKeys.filter(k => _grupAdi(k) === _gk);
            if (_uye.length) _obekler.push({ bilgi: _gruplar[_gk], anahtar: _uye });
        }
        const _kalan = sortedKeys.filter(k => !_gruplar[_grupAdi(k)]);
        if (_kalan.length) _obekler.push({ bilgi: { title: "Diğer", icon: "📌" }, anahtar: _kalan });
    } else {
        _obekler.push({ bilgi: null, anahtar: sortedKeys });
    }

    html = "";
    
    var colorIndex = 0;
    for (const _obek of _obekler) {
    const obekKeys = _obek.anahtar;
    const L = obekKeys.length;
    const rows = Math.ceil(L / cols);
    if (_obek.bilgi) {
        html += '<div class="ktl-obek" dir="ltr"><span class="ktl-obek-ik">' + (_obek.bilgi.icon || '') +
                '</span><span class="ktl-obek-ad">' + _obek.bilgi.title +
                '</span><span class="ktl-obek-say">' + L + ' liste</span></div>';
    }
    // Satır Satır DOM oluşturuyoruz
    for(let r = 0; r < rows; r++) {
        
    /* SİTE PALETİ — kelime listesi başlıkları.
       On renk var; satır başına ÜÇ kart düşüyor ve indeks birer birer
       artıyor. 10 ile 3 birbirini bölmediği için ne yatay komşular
       (fark 1) ne de dikey komşular (fark 3) aynı renge düşer — eski
       altı renkli dizide her sütun iki renk arasında gidip geliyor,
       liste çizgili görünüyordu. Renkler koyu uçtan seçildi ki üstteki
       BEYAZ yazı her kartta okunsun. */
    const siteColors = [
        'linear-gradient(135deg,#2ECC71 0%,#27AE60 100%)',   /* yeşil      */
        'linear-gradient(135deg,#20C997 0%,#16A085 100%)',   /* turkuaz    */
        'linear-gradient(135deg,#F39C12 0%,#E67E22 100%)',   /* turuncu    */
        'linear-gradient(135deg,#5DADE2 0%,#2980B9 100%)',   /* mavi       */
        'linear-gradient(135deg,#EF5350 0%,#E53935 100%)',   /* kırmızı    */
        'linear-gradient(135deg,#A78BFA 0%,#7C3AED 100%)',   /* mor        */
        'linear-gradient(135deg,#22B8CF 0%,#0B7285 100%)',   /* camgöbeği  */
        'linear-gradient(135deg,#EFA00B 0%,#D97706 100%)',   /* amber      */
        'linear-gradient(135deg,#5C7CFA 0%,#3B5BDB 100%)',   /* çivit      */
        'linear-gradient(135deg,#F06595 0%,#D6336C 100%)'    /* gül        */
    ];
    let rowKeys = [];

        for(let c = 0; c < cols; c++) {
            /* SATIR SIRALI: sütun sıralı dağıtımda 3'ün katı olmayan
               öbeklerde ızgara satırı ile JS satırı örtüşmüyordu. */
            const i = r * cols + c;
            if (i < L) rowKeys.push(obekKeys[i]);
        }
        
        // 1. Bu satırın başlıkları (Sırayla sütunlara yerleşir)
        
        for (const key of rowKeys) {
            const cat = categories[key];
            if (!cat) continue;
            
            let shuffledList = cat.items ? [...cat.items] : [];
            shuffledList.sort(() => Math.random() - 0.5);
            activeMemoryGames[key] = {
                mode: 'list',
                scores: [0, 0],
                currentPlayer: 1,
                activeFlipped: [],
                isProcessing: false,
                matches: 0,
                shuffledItems: shuffledList,
                roundIndex: 0
            };
            
            html += `
                <div class="thematic-accordion-item site-renk" style="background: ${siteColors[colorIndex++ % siteColors.length]}; color: #fff;" onclick="toggleThematicAccordion(this, '${key}')" id="header-${key}">
                    <div class="thematic-accordion-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <i class="fas fa-chevron-down thematic-accordion-icon" id="icon-${key}"></i>
                            <h3 class="thematic-accordion-title" style="margin: 0; display: flex; align-items: center; gap: 8px; font-size: 1.7rem;">
                                ${cat.icon} 
                                <div style="display:flex; flex-direction:column; align-items:flex-start;">
                                    <span>${cat.title}</span>
                                    ${cat.arTitle ? `<span style="font-family:'Arakom', sans-serif; font-weight:normal; font-size:2.3rem; color:rgba(255,255,255,.92); line-height:1; margin-top:6px;">${cat.arTitle}</span>` : ''}
                                </div>
                            </h3>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // 2. Bu satırın İçerikleri (Tıklandığında tüm satırı kaplayacak şekilde başlıkların altına yerleşir)
        
        for (const key of rowKeys) {
            const cat = categories[key];
            if (!cat) continue;
            
            let pairOptions = "";
            let maxPairs = cat.items ? cat.items.length : 0;
            if (maxPairs < 6) {
                pairOptions += `<option value="${maxPairs}" selected>${maxPairs} Çift</option>`;
                pairOptions += `<option value="6" disabled>6 Çift</option>`;
            } else {
                pairOptions += `<option value="6" selected>6 Çift</option>`;
            }
            pairOptions += `<option value="8" ${maxPairs < 8 ? 'disabled' : ''}>8 Çift</option>`;
            pairOptions += `<option value="10" ${maxPairs < 10 ? 'disabled' : ''}>10 Çift</option>`;
            pairOptions += `<option value="12" ${maxPairs < 12 ? 'disabled' : ''}>12 Çift</option>`;

            html += `
                <div id="content-${key}" class="thematic-accordion-panel" style="display:none; grid-column: 1 / -1; background: #f8f9fa; border: 2px solid #5c7cfa; border-radius: 15px; padding: 20px; margin-bottom: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <div class="thematic-accordion-content" style="display:block;">
                        <div class="memory-game-controls" id="controls-${key}" style="display: flex; justify-content: center; align-items: center; width: 100%; direction: ltr !important; margin-bottom: 30px; gap: 10px;">
                            <button class="memory-btn active" id="btn-list-${key}" onclick="setMemoryMode('${key}', 'list')">Liste Modu</button>
                            <button class="memory-btn" id="btn-study-${key}" onclick="setMemoryMode('${key}', 'study')">Çalışma Kartları</button>
                        </div>
                        
                        <div class="thematic-words-grid" id="grid-${key}"></div>
                    </div>
                </div>
            `;
        }
    }
    
}   /* öbek döngüsü */
    
        container.innerHTML = html;
    
    let viewer = document.getElementById('thematic-viewer-container');
    if(viewer) viewer.remove();
    
    for (const key in categories) {
        if (categories[key].items.length > 0) {
            initMemoryGrid(key);
        }
    }
}

function openMemorySetup(key) {
    const btnStart = document.getElementById(`btn-start-${key}`);
    const btnCancel = document.getElementById(`btn-cancel-${key}`);
    if (btnStart) btnStart.style.display = 'inline-block';
    if (btnCancel) btnCancel.style.display = 'none';
    if (activeMemoryGames[key]) activeMemoryGames[key].gameStarted = false;
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    // Tüm butonları pasif yap ama kaybolmasın
    const btnList = document.getElementById(`btn-list-${key}`);
    if (btnList) {
        btnList.classList.remove('active');
        btnList.style.opacity = '0.6';
        btnList.style.display = 'block';
    }
    const btnStudy = document.getElementById(`btn-study-${key}`);
    if (btnStudy) {
        btnStudy.classList.remove('active');
        btnStudy.style.opacity = '0.6';
        btnStudy.style.display = 'block';
    }
    
    document.getElementById(`btn-mem-${key}`).style.display = 'none';
    document.getElementById(`mem-settings-${key}`).style.display = 'flex';
        
    // Grid'i başlatmıyoruz, sadece ayar panelini açıyoruz.
}

function cancelMemorySetup(key) {
    if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
    
    if (activeMemoryGames[key]) activeMemoryGames[key].gameStarted = false;
    
    const btnStart = document.getElementById(`btn-start-${key}`);
    const btnCancel = document.getElementById(`btn-cancel-${key}`);
    
    if (btnStart) btnStart.style.display = 'inline-block';
    if (btnCancel) btnCancel.style.display = 'none';
    
    const toggle = document.getElementById(`mode-toggle-${key}`);
    if (toggle) toggle.disabled = false;
    
    const pairCount = document.getElementById(`pairCount-${key}`);
    if (pairCount) pairCount.disabled = false;
    

    const item = document.getElementById(`content-${key}`);
    if (item && item.classList.contains('fullscreen-accordion')) {
        toggleAccordionFullscreen(key, null);
    }

    startMemoryGameFlow(key);
}

function toggleMultiplayer(key) {
    const toggle = document.getElementById(`mode-toggle-${key}`);
    if (toggle) {
        setMemoryMode(key, toggle.checked ? 'mem2' : 'mem1');
    }
}

function startMemoryGameFlow(key) {
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    const toggle = document.getElementById(`mode-toggle-${key}`);
    const isMultiplayer = toggle ? toggle.checked : true;
    const mode = isMultiplayer ? 'mem2' : 'mem1';
    
    // Set Memory Mode
    setMemoryMode(key, mode);
    initMemoryGrid(key);
}



function setMemoryMode(key, mode) {
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    let state = activeMemoryGames[key];
    
    // Hafıza oyununda kartların sığması için boşluğu azalt, çalışma kartlarında ferah bırak
    const controls = document.getElementById(`controls-${key}`);
    if (controls) {
        if (mode === 'study') {
            controls.style.marginBottom = '30px';
        } else {
            controls.style.marginBottom = '20px';
        }
    }

    state.mode = mode;
    state.scores = [0, 0];
    state.currentPlayer = 1;
    state.activeFlipped = [];
    
    const listBtn = document.getElementById(`btn-list-${key}`);
    const studyBtn = document.getElementById(`btn-study-${key}`);
    const memBtn = document.getElementById(`btn-mem-${key}`);
    const memSettings = document.getElementById(`mem-settings-${key}`);
    const toggle = document.getElementById(`mode-toggle-${key}`);
    const p1Box = document.getElementById(`p1-box-${key}`);
    const p2Box = document.getElementById(`p2-box-${key}`);
    
    if (listBtn) listBtn.classList.remove('active');
    if (studyBtn) studyBtn.classList.remove('active');
    if (memBtn) memBtn.classList.remove('active');
    
    if (listBtn) { listBtn.style.display = 'block'; listBtn.style.opacity = '1'; }
    if (studyBtn) { studyBtn.style.display = 'block'; studyBtn.style.opacity = '1'; }
    if (memBtn) { memBtn.style.display = 'block'; memBtn.style.opacity = '1'; }

    if (mode === 'list') {
        if (listBtn) listBtn.classList.add('active');
        if (memSettings) memSettings.style.display = 'none';
        if (p1Box) p1Box.style.display = 'none';
        if (p2Box) p2Box.style.display = 'none';
    } else if (mode === 'study') {
        if (studyBtn) studyBtn.classList.add('active');
        if (memSettings) memSettings.style.display = 'none';
        if (p1Box) p1Box.style.display = 'none';
        if (p2Box) p2Box.style.display = 'none';
    } else {
        if (memBtn) memBtn.classList.add('active');
        if (memSettings) memSettings.style.display = 'flex';
        
        if (toggle) toggle.checked = (mode === 'mem2');
        if (mode === 'mem2') {
            if (p1Box) p1Box.style.display = 'flex';
            if (p2Box) p2Box.style.display = 'flex';
        } else {
            if (p1Box) p1Box.style.display = 'none';
            if (p2Box) p2Box.style.display = 'none';
        }
    }
    
    initMemoryGrid(key);
}

function initMemoryGrid(key, forceShuffle = false) {
    let state = activeMemoryGames[key];
    let cat = thematicCategoriesData[key];
    if (!cat || !cat.items) return;
    
    const grid = document.getElementById(`grid-${key}`);
    if (!grid) return;
    
    const pairCountInput = document.getElementById(`pairCount-${key}`);
    const pairCount = pairCountInput ? parseInt(pairCountInput.value) : 6;
    const isMobile = window.innerWidth <= 768;
    
    grid.innerHTML = '';
    const isStudy = state.mode === 'study';
    const isList = state.mode === 'list';
    
    grid.className = `thematic-words-grid ${isList ? 'list-mode-grid' : (isStudy ? '' : ('memory-mode pairs-' + pairCount))}`;
    
    // Fallback if state.shuffledItems is missing
    if (!state.shuffledItems) {
        state.shuffledItems = [...cat.items].sort(() => Math.random() - 0.5);
        state.roundIndex = 0;
    }
    
    let wordsCopy = [...cat.items];
    let selectedWords = (isStudy || isList) ? wordsCopy : state.shuffledItems.slice(state.roundIndex, state.roundIndex + pairCount);
    
    // If somehow we selected less than pairCount (end of array), we wrap around or reshuffle
    if (!isStudy && !isList && selectedWords.length < pairCount) {
        state.shuffledItems = [...cat.items].sort(() => Math.random() - 0.5);
        state.roundIndex = 0;
        selectedWords = state.shuffledItems.slice(state.roundIndex, state.roundIndex + pairCount);
    }
    
    let displayList = [];

    if (isStudy || isList) {
        displayList = selectedWords;
        if (forceShuffle) {
            displayList.sort(() => Math.random() - 0.5);
        }
        grid.style.height = "auto";
        grid.style.gridTemplateColumns = ""; 
        grid.style.gridTemplateRows = "";
        grid.style.gridAutoRows = "";
        grid.removeAttribute('data-total');
    } else {
        selectedWords.forEach(w => {
            displayList.push({ text: w.arText, pairId: w.rootKey, lang: 'ar' });
            displayList.push({ text: w.trText, pairId: w.rootKey, lang: 'tr' });
        });
        displayList.sort(() => Math.random() - 0.5);
        
        let colCount = 4;
        let rowCount = 3;
        
        if (pairCount === 6) { colCount = 4; rowCount = 3; }
        else if (pairCount === 8) { colCount = 4; rowCount = 4; }
        else if (pairCount === 10) { colCount = 5; rowCount = 4; }
        else if (pairCount === 12) { colCount = 6; rowCount = 4; }
        
        grid.style.height = "100%"; 
        grid.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${rowCount}, 1fr)`; 
        grid.style.gridAutoRows = "none";
        grid.setAttribute('data-total', displayList.length);
    }

    
    // LİSTE MODU: masaüstü ile aynı "kağıt" formatı (mobilde CSS ile tek sütun)
    let listColumnsContainer = null;
    if (isList) {
        const titleText = (thematicCategoriesData[key] && thematicCategoriesData[key].title) ? thematicCategoriesData[key].title : 'Kelime Listesi';
        const iconText = (thematicCategoriesData[key] && thematicCategoriesData[key].icon) ? thematicCategoriesData[key].icon : '📝';
        const paper = document.createElement('div');
        paper.className = 'list-mode-paper';
        paper.innerHTML = `
            <div class="list-mode-title">${iconText} ${titleText}</div>
            <div class="list-mode-columns"></div>
        `;
        grid.appendChild(paper);
        listColumnsContainer = paper.querySelector('.list-mode-columns');
    }

    displayList.forEach((item, index) => {
        if (isList) {
            const row = document.createElement('div');
            row.className = 'list-mode-item';
            let arContent = typeof colorizeArabicWord === 'function' ? colorizeArabicWord(item.arText, item.rootKey) : item.arText;
            row.innerHTML = `
                <div class="list-mode-num">${index + 1}.</div>
                <div class="list-mode-tr" dir="ltr">${item.trText}</div>
                <div class="list-mode-emoji">${item.emoji || '✨'}</div>
                <div class="list-mode-ar" dir="rtl">${arContent}</div>
            `;
            if (listColumnsContainer) listColumnsContainer.appendChild(row);
            else grid.appendChild(row);
            return;
        }

        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.id = isStudy ? item.rootKey : item.pairId;
        
        if (isStudy) {
            let kalipAction = item.kalipId ? `, '${item.kalipId}'` : "";
            card.innerHTML = `
                <div class="memory-card-inner">
                    <!-- ÖN YÜZ: Sadece Arapça (Büyük ve Ortalanmış) -->
                    <div class="memory-card-face memory-card-front" style="display: flex; align-items: center; justify-content: center;">
                        <div class="lang-ar" style="text-align: center; margin: 0; padding: 0; ${thematicCategoriesData[key]?.arFontSize ? `font-size: ${thematicCategoriesData[key].arFontSize} !important;` : ''}">${item.arText}</div>
                    </div>
                    <!-- ARKA YÜZ: Türkçe ve Emoji -->
                    <div class="memory-card-face memory-card-back" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <div style="font-size: 4rem; margin-bottom: 5px;">${item.emoji || '✨'}</div>
                        <div class="lang-tr" style="font-weight: bold; color: #333; text-align: center; ${thematicCategoriesData[key]?.trFontSize ? `font-size: ${thematicCategoriesData[key].trFontSize} !important;` : ''}" dir="ltr">${item.trText}</div>
                    </div>
                </div>
            `;
            card.onclick = () => card.classList.toggle('flipped');
        } else {
            card.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-face memory-card-front"></div>
                    <div class="memory-card-face memory-card-back lang-${item.lang}">
                        <span>${item.text}</span>
                    </div>
                </div>
            `;
            card.onclick = () => handleMemoryFlip(key, card);
        }
        grid.appendChild(card);
    });
    
    // Skorları sıfırla
    state.scores = [0, 0];
    state.currentPlayer = 1;
    state.activeFlipped = [];
    state.isProcessing = false;
    state.matches = 0;
    
    updateScoreUI(key);
}

function handleMemoryFlip(key, card) {
    let state = activeMemoryGames[key];
    if (!state.gameStarted) return;
    if (state.isProcessing) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    card.classList.add('flipped');
    state.activeFlipped.push(card);

    if (state.activeFlipped.length === 2) {
        state.isProcessing = true;
        setTimeout(() => checkMemoryMatch(key), 800);
    }
}

function checkMemoryMatch(key) {
    let state = activeMemoryGames[key];
    const [card1, card2] = state.activeFlipped;
    const match = card1.dataset.id === card2.dataset.id;
    if (match) {
        if (typeof SoundEngine !== "undefined") {
            try { SoundEngine.playMatch(); } catch(e) {}
        }
        card1.classList.add('matched');
        card2.classList.add('matched');
    } else {
        if (typeof SoundEngine !== "undefined") {
            try { SoundEngine.playMismatch(); } catch(e) {}
        }
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);
    }
    
    state.activeFlipped = [];
    state.isProcessing = false;
}

function updateScoreUI(key) {
    let state = activeMemoryGames[key];
    
    const s1 = document.getElementById(`s1-${key}`);
    const s2 = document.getElementById(`s2-${key}`);
    const p1Box = document.getElementById(`p1-box-${key}`);
    const p2Box = document.getElementById(`p2-box-${key}`);
    const grid = document.getElementById(`grid-${key}`);
    
    if (s1) s1.innerText = state.scores[0];
    if (s2) s2.innerText = state.scores[1];
    
    if (p1Box && p2Box) {
        if (state.currentPlayer === 1) {
            p1Box.classList.add('active-p', 'pulse-anim');
            p2Box.classList.remove('active-p', 'pulse-anim');
            setTimeout(() => { if (p1Box) p1Box.classList.remove('pulse-anim'); }, 500);
            
            if (grid) {
                if (state.mode === 'mem2') {
                    grid.classList.add('active-p1-grid');
                    grid.classList.remove('active-p2-grid');
                } else {
                    grid.classList.remove('active-p1-grid', 'active-p2-grid');
                }
            }
        } else {
            p2Box.classList.add('active-p', 'pulse-anim');
            p1Box.classList.remove('active-p', 'pulse-anim');
            setTimeout(() => { if (p2Box) p2Box.classList.remove('pulse-anim'); }, 500);
            
            if (grid && state.mode === 'mem2') {
                grid.classList.add('active-p2-grid');
                grid.classList.remove('active-p1-grid');
            }
        }
    }
}

function toggleAccordionFullscreen(key, btnElement) {
    const item = document.getElementById(`content-${key}`);
    if (!item) return;
    
    if (item.classList.contains('fullscreen-accordion')) {
        item.classList.remove('fullscreen-accordion');
        document.body.classList.remove('has-fullscreen-accordion');
        if (btnElement) btnElement.innerHTML = '<i class=\"fas fa-expand\"></i>'; // Maximize icon
        
        
    } else {
        item.classList.add('fullscreen-accordion');
        document.body.classList.add('has-fullscreen-accordion');
        if (btnElement) btnElement.innerHTML = '<i class=\"fas fa-compress\"></i>'; // Minimize icon
    }
}

window.openCategoryFromModal = function(categoryKey) {
    const modal = document.getElementById('word-details-modal');
    const overlay = document.getElementById('word-details-overlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    
    // Arama kutusunu (search-input) SIFIRLAMIYORUZ.
    // Böylece kullanıcı kapatınca kaldığı yere dönebilir.
    
    // Listelerin bulunduğu ana katmanı (verb-overlay) görünür yap
    const verbOverlay = document.getElementById('verb-overlay');
    if (verbOverlay) verbOverlay.style.display = 'flex';
    
    // Listeler sekmesini aktif et
    showThematicView();
    
    setTimeout(() => {
        const items = document.querySelectorAll('.thematic-accordion-item');
        for (let item of items) {
            if (item.getAttribute('onclick') && item.getAttribute('onclick').includes("'" + categoryKey + "'")) {
                if (!item.classList.contains('active')) {
                    toggleThematicAccordion(item, categoryKey);
                }
                setTimeout(() => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
                break;
            }
        }
    }, 100);
};
document.addEventListener('DOMContentLoaded', () => { setTimeout(() => { renderThematicLists(); }, 500); });

window.openFromStudyCard = function(rootKey, kalipId) {
    if (typeof selectRootFromMenu === 'function') {
        selectRootFromMenu(rootKey);
        
        // Modalın kapatılması (açıksa)
        const theModal = document.getElementById('thematic-accordion-modal');
        if(theModal) theModal.style.display = 'none';
        
        // Eğer kalipId varsa, o kutuyu bulup tıklat (kırmızı aktif yapmak için)
        if (kalipId) {
            setTimeout(() => {
                const boxes = document.querySelectorAll('.glass-box');
                boxes.forEach(box => {
                    const dataId = box.getAttribute('data-id');
                    if (dataId === kalipId) {
                        box.classList.add('current-active-red');
                        // İsterseniz otomatik tıklatıp türetebilirsiniz de:
                        // handleBoxClick(box);
                    }
                });
            }, 300);
        }
    }
};

function startGameAndFullscreen(key) {
    const btnStart = document.getElementById(`btn-start-${key}`);
    const btnCancel = document.getElementById(`btn-cancel-${key}`);
    if (btnStart) btnStart.style.display = 'none';
    if (btnCancel) btnCancel.style.display = 'inline-block';
    startMemoryGameFlow(key);
    if (activeMemoryGames[key]) activeMemoryGames[key].gameStarted = true;
    const toggle = document.getElementById(`mode-toggle-${key}`);
    if (toggle) toggle.disabled = true;
    const pairCount = document.getElementById(`pairCount-${key}`);
    if (pairCount) pairCount.disabled = true;
    const btnFs = document.getElementById(`btn-fs-${key}`);
    const item = document.getElementById(`content-${key}`);
    if (item && !item.classList.contains('fullscreen-accordion')) {
        toggleAccordionFullscreen(key, btnFs);
    }
}


window.openGrammarOverlay = function(stage) {
    window.openAtlasOverlay(stage);
};

// ===== ATLAS DATA =====
window.isAtlasMode = false;

window.atlasVerbsData = {
        "استيقظ": {"trMean": {"mazi": "uyandı", "muzari": "uyanıyor", "emir": "uyan"}, "mazi": ["اِسْتَيْقَظَ", "اِسْتَيْقَظَا", "اِسْتَيْقَظُوا", "اِسْتَيْقَظَتْ", "اِسْتَيْقَظَتَا", "اِسْتَيْقَظْنَ", "اِسْتَيْقَظْتَ", "اِسْتَيْقَظْتُمَا", "اِسْتَيْقَظْتُمْ", "اِسْتَيْقَظْتِ", "اِسْتَيْقَظْتُمَا", "اِسْتَيْقَظْتُنَّ", "اِسْتَيْقَظْتُ", "اِسْتَيْقَظْنَا", "اِسْتَيْقَظْنَا"], "muzari": ["يَسْتَيْقِظُ", "يَسْتَيْقِظَانِ", "يَسْتَيْقِظُونَ", "تَسْتَيْقِظُ", "تَسْتَيْقِظَانِ", "يَسْتَيْقِظْنَ", "تَسْتَيْقِظُ", "تَسْتَيْقِظَانِ", "تَسْتَيْقِظُونَ", "تَسْتَيْقِظِينَ", "تَسْتَيْقِظَانِ", "تَسْتَيْقِظْنَ", "أَسْتَيْقِظُ", "نَسْتَيْقِظُ", "نَسْتَيْقِظُ"], "emir": ["اِسْتَيْقِظْ", "اِسْتَيْقِظَا", "اِسْتَيْقِظُوا", "اِسْتَيْقِظِي", "اِسْتَيْقِظَا", "اِسْتَيْقِظْنَ"]},
    "توضأ": {"trMean": {"mazi": "abdest aldı", "muzari": "abdest alıyor", "emir": "abdest al"}, "mazi": ["تَوَضَّأَ", "تَوَضَّآ", "تَوَضَّؤُوا", "تَوَضَّأَتْ", "تَوَضَّأَتَا", "تَوَضَّأْنَ", "تَوَضَّأْتَ", "تَوَضَّأْتُمَا", "تَوَضَّأْتُمْ", "تَوَضَّأْتِ", "تَوَضَّأْتُمَا", "تَوَضَّأْتُنَّ", "تَوَضَّأْتُ", "تَوَضَّأْنَا", "تَوَضَّأْنَا"], "muzari": ["يَتَوَضَّأُ", "يَتَوَضَّآنِ", "يَتَوَضَّأُونَ", "تَتَوَضَّأُ", "تَتَوَضَّآنِ", "يَتَوَضَّأْنَ", "تَتَوَضَّأُ", "تَتَوَضَّآنِ", "تَتَوَضَّأُونَ", "تَتَوَضَّأِينَ", "تَتَوَضَّآنِ", "تَتَوَضَّأْنَ", "أَتَوَضَّأُ", "نَتَوَضَّأُ", "نَتَوَضَّأُ"], "emir": ["تَوَضَّأْ", "تَوَضَّآ", "تَوَضَّؤُوا", "تَوَضَّئِي", "تَوَضَّآ", "تَوَضَّأْنَ"]},
    "صلى": {"trMean": {"mazi": "namaz kıldı", "muzari": "namaz kılıyor", "emir": "namaz kıl"}, "mazi": ["صَلَّى", "صَلَّيَا", "صَلَّوْا", "صَلَّتْ", "صَلَّتَا", "صَلَّيْنَ", "صَلَّيْتَ", "صَلَّيْتُمَا", "صَلَّيْتُمْ", "صَلَّيْتِ", "صَلَّيْتُمَا", "صَلَّيْتُنَّ", "صَلَّيْتُ", "صَلَّيْنَا", "صَلَّيْنَا"], "muzari": ["يُصَلِّي", "يُصَلِّياَنِ", "يُصَلُّونَ", "تُصَلِّي", "تُصَلِّياَنِ", "يُصَلِّينَ", "تُصَلِّي", "تُصَلِّياَنِ", "تُصَلُّونَ", "تُصَلِّينَ", "تُصَلِّياَنِ", "تُصَلِّينَ", "أُصَلِّي", "نُصَلِّي", "نُصَلِّي"], "emir": ["صَلِّ", "صَلِّياَ", "صَلُّوا", "صَلِّي", "صَلِّياَ", "صَلِّينَ"]},
    "تناول": {"trMean": {"mazi": "yedi", "muzari": "yiyor", "emir": "ye"}, "mazi": ["تَنَاوَلَ", "تَنَاوَلَا", "تَنَاوَلُوا", "تَنَاوَلَتْ", "تَنَاوَلَتَا", "تَنَاوَلْنَ", "تَنَاوَلْتَ", "تَنَاوَلْتُمَا", "تَنَاوَلْتُمْ", "تَنَاوَلْتِ", "تَنَاوَلْتُمَا", "تَنَاوَلْتُنَّ", "تَنَاوَلْتُ", "تَنَاوَلْنَا", "تَنَاوَلْنَا"], "muzari": ["يَتَنَاوَلُ", "يَتَنَاوَلَانِ", "يَتَنَاوَلُونَ", "تَتَنَاوَلُ", "تَتَنَاوَلَانِ", "يَتَنَاوَلْنَ", "تَتَنَاوَلُ", "تَتَنَاوَلَانِ", "تَتَنَاوَلُونَ", "تَتَنَاوَلِينَ", "تَتَنَاوَلَانِ", "تَتَنَاوَلْنَ", "أَتَنَاوَلُ", "نَتَنَاوَلُ", "نَتَنَاوَلُ"], "emir": ["تَنَاوَلْ", "تَنَاوَلَا", "تَنَاوَلُوا", "تَنَاوَلِي", "تَنَاوَلَا", "تَنَاوَلْنَ"]},
    "ساعد": {"trMean": {"mazi": "yardım etti", "muzari": "yardım ediyor", "emir": "yardım et"}, "mazi": ["سَاعَدَ", "سَاعَدَا", "سَاعَدُوا", "سَاعَدَتْ", "سَاعَدَتَا", "سَاعَدْنَ", "سَاعَدْتَ", "سَاعَدْتُمَا", "سَاعَدْتُمْ", "سَاعَدْتِ", "سَاعَدْتُمَا", "سَاعَدْتُنَّ", "سَاعَدْتُ", "سَاعَدْنَا", "سَاعَدْنَا"], "muzari": ["يُسَاعِدُ", "يُسَاعِدَانِ", "يُسَاعِدُونَ", "تُسَاعِدُ", "تُسَاعِدَانِ", "يُسَاعِدْنَ", "تُسَاعِدُ", "تُسَاعِدَانِ", "تُسَاعِدُونَ", "تُسَاعِدِينَ", "تُسَاعِدَانِ", "تُسَاعِدْنَ", "أُسَاعِدُ", "نُسَاعِدُ", "نُسَاعِدُ"], "emir": ["سَاعِدْ", "سَاعِدَا", "سَاعِدُوا", "سَاعِدِي", "سَاعِدَا", "سَاعِدْنَ"]},
    "نظف": {"trMean": {"mazi": "temizledi", "muzari": "temizliyor", "emir": "temizle"}, "mazi": ["نَظَّفَ", "نَظَّفَا", "نَظَّفُوا", "نَظَّفَتْ", "نَظَّفَتَا", "نَظَّفْنَ", "نَظَّفْتَ", "نَظَّفْتُمَا", "نَظَّفْتُمْ", "نَظَّفْتِ", "نَظَّفْتُمَا", "نَظَّفْتُنَّ", "نَظَّفْتُ", "نَظَّفْنَا", "نَظَّفْنَا"], "muzari": ["يُنَظِّفُ", "يُنَظِّفَانِ", "يُنَظِّفُونَ", "تُنَظِّفُ", "تُنَظِّفَانِ", "يُنَظِّفْنَ", "تُنَظِّفُ", "تُنَظِّفَانِ", "تُنَظِّفُونَ", "تُنَظِّفِينَ", "تُنَظِّفَانِ", "تُنَظِّفْنَ", "أُنَظِّفُ", "نُنَظِّفُ", "نُنَظِّفُ"], "emir": ["نَظِّفْ", "نَظِّفَا", "نَظِّفُوا", "نَظِّفِي", "نَظِّفَا", "نَظِّفْنَ"]},
    "أراد": {"trMean": {"mazi": "istedi", "muzari": "istiyor", "emir": "iste"}, "mazi": ["أَرَادَ", "أَرَادَا", "أَرَادُوا", "أَرَادَتْ", "أَرَادَتَا", "أَرَدْنَ", "أَرَدْتَ", "أَرَدْتُمَا", "أَرَدْتُمْ", "أَرَدْتِ", "أَرَدْتُمَا", "أَرَدْتُنَّ", "أَرَدْتُ", "أَرَدْنَا", "أَرَدْنَا"], "muzari": ["يُرِيدُ", "يُرِيدَانِ", "يُرِيدُونَ", "تُرِيدُ", "تُرِيدَانِ", "يُرِدْنَ", "تُرِيدُ", "تُرِيدَانِ", "تُرِيدُونَ", "تُرِيدِينَ", "تُرِيدَانِ", "تُرِدْنَ", "أُرِيدُ", "نُرِيدُ", "نُرِيدُ"], "emir": ["أَرِدْ", "أَرِيدَا", "أَرِيدُوا", "أَرِيدِي", "أَرِيدَا", "أَرِدْنَ"]},
    "سافر": {"trMean": {"mazi": "yolculuk yaptı", "muzari": "yolculuk yapıyor", "emir": "yolculuk yap"}, "mazi": ["سَافَرَ", "سَافَرَا", "سَافَرُوا", "سَافَرَتْ", "سَافَرَتَا", "سَافَرْنَ", "سَافَرْتَ", "سَافَرْتُمَا", "سَافَرْتُمْ", "سَافَرْتِ", "سَافَرْتُمَا", "سَافَرْتُنَّ", "سَافَرْتُ", "سَافَرْنَا", "سَافَرْنَا"], "muzari": ["يُسَافِرُ", "يُسَافِرَانِ", "يُسَافِرُونَ", "تُسَافِرُ", "تُسَافِرَانِ", "يُسَافِرْنَ", "تُسَافِرُ", "تُسَافِرَانِ", "تُسَافِرُونَ", "تُسَافِرِينَ", "تُسَافِرَانِ", "تُسَافِرْنَ", "أُسَافِرُ", "نُسَافِرُ", "نُسَافِرُ"], "emir": ["سَافِرْ", "سَافِرَا", "سَافِرُوا", "سَافِرِي", "سَافِرَا", "سَافِرْنَ"]},
"كتب": { trMean: { mazi: "yazdı", muzari: "yazıyor", emir: "yaz" }, mazi: ["كَتَبَ", "كَتَبَا", "كَتَبُوا", "كَتَبَتْ", "كَتَبَتَا", "كَتَبْنَ", "كَتَبْتَ", "كَتَبْتُمَا", "كَتَبْتُمْ", "كَتَبْتِ", "كَتَبْتُمَا", "كَتَبْتُنَّ", "كَتَبْتُ", "كَتَبْنَا", "كَتَبْنَا"], muzari: ["يَكْتُبُ", "يَكْتُبَانِ", "يَكْتُبُونَ", "تَكْتُبُ", "تَكْتُبَانِ", "يَكْتُبْنَ", "تَكْتُبُ", "تَكْتُبَانِ", "تَكْتُبُونَ", "تَكْتُبِينَ", "تَكْتُبَانِ", "تَكْتُبْنَ", "أَكْتُبُ", "نَكْتُبُ", "نَكْتُبُ"], emir: ["اُكْتُبْ", "اُكْتُبَا", "اُكْتُبُوا", "اُكْتُبِي", "اُكْتُبَا", "اُكْتُبْنَ"] },
    "دخل": { trMean: { mazi: "girdi", muzari: "giriyor", emir: "gir" }, mazi: ["دَخَلَ", "دَخَلَا", "دَخَلُوا", "دَخَلَتْ", "دَخَلَتَا", "دَخَلْنَ", "دَخَلْتَ", "دَخَلْتُمَا", "دَخَلْتُمْ", "دَخَلْتِ", "دَخَلْتُمَا", "دَخَلْتُنَّ", "دَخَلْتُ", "دَخَلْنَا", "دَخَلْنَا"], muzari: ["يَدْخُلُ", "يَدْخُلَانِ", "يَدْخُلُونَ", "تَدْخُلُ", "تَدْخُلَانِ", "يَدْخُلْنَ", "تَدْخُلُ", "تَدْخُلَانِ", "تَدْخُلُونَ", "تَدْخُلِينَ", "تَدْخُلَانِ", "تَدْخُلْنَ", "أَدْخُلُ", "نَدْخُلُ", "نَدْخُلُ"], emir: ["اُدْخُلْ", "اُدْخُلَا", "اُدْخُلُوا", "اُدْخُلِي", "اُدْخُلَا", "اُدْخُلْنَ"] },
    "خرج": { trMean: { mazi: "çıktı", muzari: "çıkıyor", emir: "çık" }, mazi: ["خَرَجَ", "خَرَجَا", "خَرَجُوا", "خَرَجَتْ", "خَرَجَتَا", "خَرَجْنَ", "خَرَجْتَ", "خَرَجْتُمَا", "خَرَجْتُمْ", "خَرَجْتِ", "خَرَجْتُمَا", "خَرَجْتُنَّ", "خَرَجْتُ", "خَرَجْنَا", "خَرَجْنَا"], muzari: ["يَخْرُجُ", "يَخْرُجَانِ", "يَخْرُجُونَ", "تَخْرُجُ", "تَخْرُجَانِ", "يَخْرُجْنَ", "تَخْرُجُ", "تَخْرُجَانِ", "تَخْرُجُونَ", "تَخْرُجِينَ", "تَخْرُجَانِ", "تَخْرُجْنَ", "أَخْرُجُ", "نَخْرُجُ", "نَخْرُجُ"], emir: ["اُخْرُجْ", "اُخْرُجَا", "اُخْرُجُوا", "اُخْرُجِي", "اُخْرُجَا", "اُخْرُجْنَ"] },
    "جلس": { trMean: { mazi: "oturdu", muzari: "oturuyor", emir: "otur" }, mazi: ["جَلَسَ", "جَلَسَا", "جَلَسُوا", "جَلَسَتْ", "جَلَسَتَا", "جَلَسْنَ", "جَلَسْتَ", "جَلَسْتُمَا", "جَلَسْتُمْ", "جَلَسْتِ", "جَلَسْتُمَا", "جَلَسْتُنَّ", "جَلَسْتُ", "جَلَسْنَا", "جَلَسْنَا"], muzari: ["يَجْلِسُ", "يَجْلِسَانِ", "يَجْلِسُونَ", "تَجْلِسُ", "تَجْلِسَانِ", "يَجْلِسْنَ", "تَجْلِسُ", "تَجْلِسَانِ", "تَجْلِسُونَ", "تَجْلِسِينَ", "تَجْلِسَانِ", "تَجْلِسْنَ", "أَجْلِسُ", "نَجْلِسُ", "نَجْلِسُ"], emir: ["اِجْلِسْ", "اِجْلِسَا", "اِجْلِسُوا", "اِجْلِسِي", "اِجْلِسَا", "اِجْلِسْنَ"] },
    "فتح": { trMean: { mazi: "açtı", muzari: "açıyor", emir: "aç" }, mazi: ["فَتَحَ", "فَتَحَا", "فَتَحُوا", "فَتَحَتْ", "فَتَحَتَا", "فَتَحْنَ", "فَتَحْتَ", "فَتَحْتُمَا", "فَتَحْتُمْ", "فَتَحْتِ", "فَتَحْتُمَا", "فَتَحْتُنَّ", "فَتَحْتُ", "فَتَحْنَا", "فَتَحْنَا"], muzari: ["يَفْتَحُ", "يَفْتَحَانِ", "يَفْتَحُونَ", "تَفْتَحُ", "تَفْتَحَانِ", "يَفْتَحْنَ", "تَفْتَحُ", "تَفْتَحَانِ", "تَفْتَحُونَ", "تَفْتَحِينَ", "تَفْتَحَانِ", "تَفْتَحْنَ", "أَفْتَحُ", "نَفْتَحُ", "نَفْتَحُ"], emir: ["اِفْتَحْ", "اِفْتَحَا", "اِفْتَحُوا", "اِفْتَحِي", "اِفْتَحَا", "اِفْتَحْنَ"] },
    "استيقظ": { trMean: { mazi: "uyandı", muzari: "uyanıyor", emir: "uyan" }, mazi: ["اِسْتَيْقَظَ", "اِسْتَيْقَظَا", "اِسْتَيْقَظُوا", "اِسْتَيْقَظَتْ", "اِسْتَيْقَظَتَا", "اِسْتَيْقَظْنَ", "اِسْتَيْقَظْتَ", "اِسْتَيْقَظْتُمَا", "اِسْتَيْقَظْتُمْ", "اِسْتَيْقَظْتِ", "اِسْتَيْقَظْتُمَا", "اِسْتَيْقَظْتُنَّ", "اِسْتَيْقَظْتُ", "اِسْتَيْقَظْنَا", "اِسْتَيْقَظْنَا"], muzari: ["يَسْتَيْقِظُ", "يَسْتَيْقِظَانِ", "يَسْتَيْقِظُونَ", "تَسْتَيْقِظُ", "تَسْتَيْقِظَانِ", "يَسْتَيْقِظْنَ", "تَسْتَيْقِظُ", "تَسْتَيْقِظَانِ", "تَسْتَيْقِظُونَ", "تَسْتَيْقِظِينَ", "تَسْتَيْقِظَانِ", "تَسْتَيْقِظْنَ", "أَسْتَيْقِظُ", "نَسْتَيْقِظُ", "نَسْتَيْقِظُ"], emir: ["اِسْتَيْقِظْ", "اِسْتَيْقِظَا", "اِسْتَيْقِظُوا", "اِسْتَيْقِظِي", "اِسْتَيْقِظَا", "اِسْتَيْقِظْنَ"] },
    "توضأ": { trMean: { mazi: "abdest aldı", muzari: "abdest alıyor", emir: "abdest al" }, mazi: ["تَوَضَّأَ", "تَوَضَّآ", "تَوَضَّؤُوا", "تَوَضَّأَتْ", "تَوَضَّأَتَا", "تَوَضَّأْنَ", "تَوَضَّأْتَ", "تَوَضَّأْتُمَا", "تَوَضَّأْتُمْ", "تَوَضَّأْتِ", "تَوَضَّأْتُمَا", "تَوَضَّأْتُنَّ", "تَوَضَّأْتُ", "تَوَضَّأْنَا", "تَوَضَّأْنَا"], muzari: ["يَتَوَضَّأُ", "يَتَوَضَّآنِ", "يَتَوَضَّأُونَ", "تَتَوَضَّأُ", "تَتَوَضَّآنِ", "يَتَوَضَّأْنَ", "تَتَوَضَّأُ", "تَتَوَضَّآنِ", "تَتَوَضَّأُونَ", "تَتَوَضَّأِينَ", "تَتَوَضَّآنِ", "تَتَوَضَّأْنَ", "أَتَوَضَّأُ", "نَتَوَضَّأُ", "نَتَوَضَّأُ"], emir: ["تَوَضَّأْ", "تَوَضَّآ", "تَوَضَّؤُوا", "تَوَضَّئِي", "تَوَضَّآ", "تَوَضَّأْنَ"] },
    "صلى": { trMean: { mazi: "namaz kıldı", muzari: "namaz kılıyor", emir: "namaz kıl" }, mazi: ["صَلَّى", "صَلَّيَا", "صَلَّوْا", "صَلَّتْ", "صَلَّتَا", "صَلَّيْنَ", "صَلَّيْتَ", "صَلَّيْتُمَا", "صَلَّيْتُمْ", "صَلَّيْتِ", "صَلَّيْتُمَا", "صَلَّيْتُنَّ", "صَلَّيْتُ", "صَلَّيْنَا", "صَلَّيْنَا"], muzari: ["يُصَلِّي", "يُصَلِّياَنِ", "يُصَلُّونَ", "تُصَلِّي", "تُصَلِّياَنِ", "يُصَلِّينَ", "تُصَلِّي", "تُصَلِّياَنِ", "تُصَلُّونَ", "تُصَلِّيلِينَ", "تُصَلِّياَنِ", "يُصَلِّينَ", "أُصَلِّي", "نُصَلِّي", "نُصَلِّي"], emir: ["صَلِّ", "صَلِّياَ", "صَلُّوا", "صَلِّي", "صَلِّياَ", "صَلِّينَ"] },
    "تناول": { trMean: { mazi: "yedi/aldı", muzari: "yiyor/alıyor", emir: "ye/al" }, mazi: ["تَنَاوَلَ", "تَنَاوَلَا", "تَنَاوَلُوا", "تَنَاوَلَتْ", "تَنَاوَلَتَا", "تَنَاوَلْنَ", "تَنَاوَلْتَ", "تَنَاوَلْتُمَا", "تَنَاوَلْتُمْ", "تَنَاوَلْتِ", "تَنَاوَلْتُمَا", "تَنَاوَلْتُنَّ", "تَنَاوَلْتُ", "تَنَاوَلْنَا", "تَنَاوَلْنَا"], muzari: ["يَتَنَاوَلُ", "يَتَنَاوَلَانِ", "يَتَنَاوَلُونَ", "تَتَنَاوَلُ", "تَتَنَاوَلَانِ", "يَتَنَاوَلْنَ", "تَتَنَاوَلُ", "تَتَنَاوَلَانِ", "تَتَنَاوَلُونَ", "تَتَنَاوَلِينَ", "تَتَنَاوَلَانِ", "تَتَنَاوَلْنَ", "أَتَنَاوَلُ", "نَتَنَاوَلُ", "نَتَنَاوَلُ"], emir: ["تَنَاوَلْ", "تَنَاوَلَا", "تَنَاوَلُوا", "تَنَاوَلِي", "تَنَاوَلَا", "تَنَاوَلْنَ"] },
    "لبس": { trMean: { mazi: "giydi", muzari: "giyiyor", emir: "giy" }, mazi: ["لَبِسَ", "لَبِسَا", "لَبِسُوا", "لَبِسَتْ", "لَبِسَتَا", "لَبِسْنَ", "لَبِسْتَ", "لَبِسْتُمَا", "لَبِسْتُمْ", "لَبِسْتِ", "لَبِسْتُمَا", "لَبِسْتُنَّ", "لَبِسْتُ", "لَبِسْنَا", "لَبِسْنَا"], muzari: ["يَلْبَسُ", "يَلْبَسَانِ", "يَلْبَسُونَ", "تَلْبَسُ", "تَلْبَسَانِ", "يَلْبَسْنَ", "تَلْبَسُ", "تَلْبَسَانِ", "تَلْبَسُونَ", "تَلْبَسِينَ", "تَلْبَسَانِ", "تَلْبَسْنَ", "أَلْبَسُ", "نَلْبَسُ", "نَلْبَسُ"], emir: ["اِلْبَسْ", "اِلْبَسَا", "اِلْبَسُوا", "اِلْبَسِي", "اِلْبَسَا", "اِلْبَسْنَ"] },
    "ذهب": { trMean: { mazi: "gitti", muzari: "gidiyor", emir: "git" }, mazi: ["ذَهَبَ", "ذَهَبَا", "ذَهَبُوا", "ذَهَبَتْ", "ذَهَبَتَا", "ذَهَبْنَ", "ذَهَبْتَ", "ذَهَبْتُمَا", "ذَهَبْتُمْ", "ذَهَبْتِ", "ذَهَبْتُمَا", "ذَهَبْتُنَّ", "ذَهَبْتُ", "ذَهَبْنَا", "ذَهَبْنَا"], muzari: ["يَذْهَبُ", "يَذْهَبَانِ", "يَذْهَبُونَ", "تَذْهَبُ", "تَذْهَبَانِ", "يَذْهَبْنَ", "تَذْهَبُ", "تَذْهَبَانِ", "تَذْهَبُونَ", "تَذْهَبِينَ", "تَذْهَبَانِ", "تَذْهَبْنَ", "أَذْهَبُ", "نَذْهَبُ", "نَذْهَبُ"], emir: ["اِذْهَبْ", "اِذْهَبَا", "اِذْهَبُوا", "اِذْهَبِي", "اِذْهَبَا", "اِذْهَبْنَ"] },
    "رجع": { trMean: { mazi: "döndü", muzari: "dönüyor", emir: "dön" }, mazi: ["رَجَعَ", "رَجَعَا", "رَجَعُوا", "رَجَعَتْ", "رَجَعَتَا", "رَجَعْنَ", "رَجَعْتَ", "رَجَعْتُمَا", "رَجَعْتُمْ", "رَجَعْتِ", "رَجَعْتُمَا", "رَجَعْتُنَّ", "رَجَعْتُ", "رَجَعْنَا", "رَجَعْنَا"], muzari: ["يَرْجِعُ", "يَرْجِعَانِ", "يَرْجِعُونَ", "تَرْجِعُ", "تَرْجِعَانِ", "يَرْجِعْنَ", "تَرْجِعُ", "تَرْجِعَانِ", "تَرْجِعُونَ", "تَرْجِعِينَ", "تَرْجِعَانِ", "تَرْجِعْنَ", "أَرْجِعُ", "نَرْجِعُ", "نَرْجِعُ"], emir: ["اِرْجِعْ", "اِرْجِعَا", "اِرْجِعُوا", "اِرْجِعِي", "اِرْجِعَا", "اِرْجِعْنَ"] },
    "ساعد": { trMean: { mazi: "yardım etti", muzari: "yardım ediyor", emir: "yardım et" }, mazi: ["سَاعَدَ", "سَاعَدَا", "سَاعَدُوا", "سَاعَدَتْ", "سَاعَدَتَا", "سَاعَدْنَ", "سَاعَدْتَ", "سَاعَدْتُمَا", "سَاعَدْتُمْ", "سَاعَدْتِ", "سَاعَدْتُمَا", "سَاعَدْتُنَّ", "سَاعَدْتُ", "سَاعَدْنَا", "سَاعَدْنَا"], muzari: ["يُسَاعِدُ", "يُسَاعِدَانِ", "يُسَاعِدُونَ", "تُسَاعِدُ", "تُسَاعِدَانِ", "يُسَاعِدْنَ", "تُسَاعِدُ", "تُسَاعِدَانِ", "تُسَاعِدُونَ", "تُسَاعِدِينَ", "تُسَاعِدَانِ", "يُسَاعِدْنَ", "أُسَاعِدُ", "نُسَاعِدُ", "نُسَاعِدُ"], emir: ["سَاعِدْ", "سَاعِدَا", "سَاعَدُوا", "سَاعِدِي", "سَاعِدَا", "سَاعَدْنَ"] },
    "ساعد": { trMean: { mazi: "yardım etti", muzari: "yardım ediyor", emir: "yardım et" }, mazi: ["سَاعَدَ", "سَاعَدَا", "سَاعَدُوا", "سَاعَدَتْ", "سَاعَدَتَا", "سَاعَدْنَ", "سَاعَدْتَ", "سَاعَدْتُمَا", "سَاعَدْتُمْ", "سَاعَدْتِ", "سَاعَدْتُمَا", "سَاعَدْتُنَّ", "سَاعَدْتُ", "سَاعَدْنَا", "سَاعَدْنَا"], muzari: ["يُسَاعِدُ", "يُسَاعِدَانِ", "يُسَاعِدُونَ", "تُسَاعِدُ", "تُسَاعِدَانِ", "يُسَاعِدْنَ", "تُسَاعِدُ", "تُسَاعِدَانِ", "تُسَاعِدُونَ", "تُسَاعِدِينَ", "تُسَاعِدَانِ", "يُسَاعِدْنَ", "أُسَاعِدُ", "نُسَاعِدُ", "نُسَاعِدُ"], emir: ["سَاعِدْ", "سَاعِدَا", "سَاعَدُوا", "سَاعِدِي", "سَاعِدَا", "سَاعِدْنَ"] },
    "درس": { trMean: { mazi: "çalıştı", muzari: "çalışıyor", emir: "çalış" }, mazi: ["دَرَسَ", "دَرَسَا", "دَرَسُوا", "دَرَسَتْ", "دَرَسَتَا", "دَرَسْنَ", "دَرَسْتَ", "دَرَسْتُمَا", "دَرَسْتُمْ", "دَرَسْتِ", "دَرَسْتُمَا", "دَرَسْتُنَّ", "دَرَسْتُ", "دَرَسْنَا", "دَرَسْنَا"], muzari: ["يَدْرُسُ", "يَدْرُسَانِ", "يَدْرُسُونَ", "تَدْرُسُ", "تَدْرُسَانِ", "يَدْرُسْنَ", "تَدْرُسُ", "تَدْرُسَانِ", "تَدْرُسُونَ", "تَدْرُسِينَ", "تَدْرُسَانِ", "تَدْرُسْنَ", "أَدْرُسُ", "نَدْرُسُ", "نَدْرُسُ"], emir: ["اُدْرُسْ", "اُدْرُسَا", "اُدْرُسُوا", "اُدْرُسِي", "اُدْرُسَا", "اُدْرُسْنَ"] },
    "nam": { trMean: { mazi: "uyudu", muzari: "uyuyor", emir: "uyu" }, mazi: ["نَامَ", "نَامَا", "نَامُوا", "نَامَتْ", "نَامَتَا", "نِمْنَ", "نِمْتَ", "نِمْتُمَا", "نِمْتُمْ", "نِمْتِ", "نِمْتُمَا", "نِمْتُنَّ", "نِمْتُ", "نِمْنَا", "نِمْنَا"], muzari: ["يَنَامُ", "يَنَامَانِ", "يَنَامُونَ", "تَنَامُ", "تَنَامَانِ", "يَنَامْنَ", "تَنَامُ", "تَنَامَانِ", "تَنَامُونَ", "تَنَامِينَ", "تَنَامَانِ", "تَنَامْنَ", "أَنَامُ", "نَنَامُ", "نَنَامُ"], emir: ["نَمْ", "نَامَا", "نَامُوا", "نَامِي", "نَامَا", "نَمْنَ"] },
    "نظف": { trMean: { mazi: "temizledi", muzari: "temizliyor", emir: "temizle" }, mazi: ["نَظَّفَ", "نَظَّفَا", "نَظَّفُوا", "نَظَّفَتْ", "نَظَّفَتَا", "نَظَّفْنَ", "نَظَّفْتَ", "نَظَّفْتُمَا", "نَظَّفْتُمْ", "نَظَّفْتِ", "نَظَّفْتُمَا", "نَظَّفْتُنَّ", "نَظَّفْتُ", "نَظَّفْنَا", "نَظَّفْنَا"], muzari: ["يُنَظِّفُ", "يُنَظِّفَانِ", "يُنَظِّفُونَ", "تُنَظِّفُ", "تُنَظِّفَانِ", "يُنَظِّفْنَ", "تُنَظِّفُ", "تُنَظِّفَانِ", "تُنَظِّفُونَ", "تُنَظِّفِينَ", "تُنَظِّفَانِ", "تُنَظِّفْنَ", "أُنَظِّفُ", "نُنَظِّفُ", "نُنَظِّفُ"], emir: ["نَظِّفْ", "نَظِّفَا", "نَظِّفُوا", "نَظِّفِي", "نَظِّفَا", "نَظَّفْنَ"] },
    "شرب": { trMean: { mazi: "içti", muzari: "içiyor", emir: "iç" }, mazi: ["شَرِبَ", "شَرِبَا", "شَرِبُوا", "شَرِبَتْ", "شَرِبَتَا", "شَرِبْنَ", "شَرِبْتَ", "شَرِبْتُمَا", "شَرِبْتُمْ", "شَرِبْتِ", "شَرِبْتُمَا", "شَرِبْتُنَّ", "شَرِبْتُ", "شَرِبْنَا", "شَرِبْنَا"], muzari: ["يَشْرَبُ", "يَشْرَبَانِ", "يَشْرَبُونَ", "تَشْرَبُ", "تَشْرَبَانِ", "يَشْرَبْنَ", "تَشْرَبُ", "تَشْرَبُونَ", "تَشْرَبُونَ", "تَشْرَبِينَ", "تَشْرَبَانِ", "تَشْرَبْنَ", "أَشْرَبُ", "نَشْرَبُ", "نَشْرَبُ"], emir: ["اِشْرَبْ", "اِشْرَبَا", "اِشْرَبُوا", "اِشْرَبِي", "اِشْرَبَا", "اِشْرَبْنَ"] },
    "أكل": { trMean: { mazi: "yedi", muzari: "yiyor", emir: "ye" }, mazi: ["أَكَلَ", "أَكَلَا", "أَكَلُوا", "أَكَلَتْ", "أَكَلَتَا", "أكَلْنَ", "أَكَلْتَ", "أَكَلْتُمَا", "أَكَلْتُمْ", "أَكَلْتِ", "أَكَلْتُمَا", "أَكَلْتُنَّ", "أَكَلْتُ", "أَكَلْنَا", "أَكَلْنَا"], muzari: ["يَأْكُلُ", "يَأْكُلَانِ", "يَأْكُلُونَ", "تَأْكُلُ", "تَأْكُلَانِ", "يَأْكُلْنَ", "تَأْكُلُ", "تَأْكُلَانِ", "تَأْكُلُونَ", "تَأْكُلِينَ", "تَأْكُلَانِ", "تَأْكُلْنَ", "آكُلُ", "نَأْكُلُ", "نَأْكُلُ"], emir: ["كُلْ", "كُلَا", "كُلُوا", "كُلِي", "كُلَا", "كُلْنَ"] },
    "أراد": { trMean: { mazi: "istedi", muzari: "istiyor", emir: "iste" }, mazi: ["أَرَادَ", "أَرَادَا", "أَرَادُوا", "أَرَادَتْ", "أَرَادَتَا", "أَرَدْنَ", "أَرَدْتَ", "أَرَدْتُمَا", "أَرَدْتُمْ", "أَرَدْتِ", "أَرَدْتُمَا", "أَرَدْتُنَّ", "أَرَدْتُ", "أَرَدْنَا", "أَرَدْنَا"], muzari: ["يُرِيدُ", "يُرِيدَانِ", "يُرِيدُونَ", "تُرِيدُ", "تُرِيدَانِ", "يُرِيدْنَ", "تُرِيدُ", "تُرِيدَانِ", "تُرِيدُونَ", "تُرِيدِينَ", "تُرِيدَانِ", "تُرِيدْنَ", "أُرِيدُ", "نُرِيدُ", "نُرِيدُ"], emir: ["أَرِدْ", "أَرِيدَا", "أَرِيدُوا", "أَرِيدِي", "أَرِيدَا", "أَرِدْنَ"] },
    "سافر": { trMean: { mazi: "seyahat etti", muzari: "seyahat ediyor", emir: "seyahat et" }, mazi: ["سَافَرَ", "سَافَرَا", "سَافَرُوا", "سَافَرَتْ", "سَافَرَتَا", "سَافَرْنَ", "سَافَرْتَ", "سَافَرْتُمَا", "سَافَرْتُمْ", "سَافَرْتِ", "سَافَرْتُمَا", "سَافَرْتُنَّ", "سَافَرْتُ", "سَافَرْنَا", "سَافَرْنَا"], muzari: ["يُسَافِرُ", "يُسَافِرَانِ", "يُسَافِرُونَ", "تُسَافِرُ", "تُسَافِرَانِ", "يُسَافِرْنَ", "تُسَافِرُ", "تُسَافِرَانِ", "تُسَافِرُونَ", "تُسَافِرِينَ", "تُسَافِرَانِ", "تُسَافِرْنَ", "أُسَافِرُ", "نُسَافِرُ", "نُسَافِرُ"], emir: ["سَافِرْ", "سَافِرَا", "سَافِرُوا", "سَافِرِي", "سَافِرَا", "سَافِرْنَ"] },
    "غسل": { trMean: { mazi: "yıkadı", muzari: "yıkıyor", emir: "yıka" }, mazi: ["غَسَلَ", "غَسَلَا", "غَسَلُوا", "غَسَلَتْ", "غَسَلَتَا", "غَسَلْنَ", "غَسَلْتَ", "غَسَلْتُمَا", "غَسَلْتُمْ", "غَسَلْتِ", "غَسَلْتُمَا", "غَسَلْتُنَّ", "غَسَلْتُ", "غَسَلْنَا", "غَسَلْنَا"], muzari: ["يَغْسِلُ", "يَغْسِلَانِ", "يَغْسِلُونَ", "تَغْسِلُ", "تَغْسِلَانِ", "يَغْسِلْنَ", "تَغْسِلُ", "تَغْسِلَانِ", "تَغْسِلُونَ", "تَغْسِلِينَ", "تَغْسِلَانِ", "تَغْسِلْنَ", "أَغْسِلُ", "نَغْسِلُ", "نَغْسِلُ"], emir: ["اِغْسِلْ", "اِغْسِلَا", "اِغْسِلُوا", "اِغْسِلِي", "اِغْسِلَا", "اِغْسِلْنَ"] },
    "علّم": { trMean: { mazi: "öğretti", muzari: "öğretiyor", emir: "öğret" }, mazi: ["عَلَّمَ", "عَلَّمَا", "عَلَّمُوا", "عَلَّمَتْ", "عَلَّمَتَا", "عَلَّمْنَ", "عَلَّمْتَ", "عَلَّمْتُمَا", "عَلَّمْتُمْ", "عَلَّمْتِ", "عَلَّمْتُمَا", "عَلَّمْتُنَّ", "عَلَّمْتُ", "عَلَّمْنَا", "عَلَّمْنَا"], muzari: ["يُعَلِّمُ", "يُعَلِّمَانِ", "يُعَلِّمُونَ", "تُعَلِّمُ", "تُعَلِّمَانِ", "يُعَلِّمْنَ", "تُعَلِّمُ", "تُعَلِّمَانِ", "تُعَلِّمُونَ", "تُعَلِّمِينَ", "تُعَلِّمَانِ", "تُعَلِّمْنَ", "أُعَلِّمُ", "نُعَلِّمُ", "نُعَلِّمُ"], emir: ["عَلِّمْ", "عَلِّمَا", "عَلِّمُوا", "عَلِّمِي", "عَلِّمَا", "عَلِّمْنَ"] },
    "قرأ": { trMean: { mazi: "okudu", muzari: "okuyor", emir: "oku" }, mazi: ["قَرَأَ", "قَرَآ", "قَرَأُوا", "قَرَأَتْ", "قَرَأَتَا", "قَرَأْنَ", "قَرَأْتَ", "قَرَأْتُمَا", "قَرَأْتُمْ", "قَرَأْتِ", "قَرَأْتُمَا", "قَرَأْتُنَّ", "قَرَأْتُ", "قَرَأْنَا", "قَرَأْنَا"], muzari: ["يَقْرَأُ", "يَقْرَآنِ", "يَقْرَأُونَ", "تَقْرَأُ", "تَقْرَآنِ", "يَقْرَأْنَ", "تَقْرَأُ", "تَقْرَآنِ", "تَقْرَأُونَ", "تَقْرَئِينَ", "تَقْرَآنِ", "تَقْرَأْنَ", "أَقْرَأُ", "نَقْرَأُ", "نَقْرَأُ"], emir: ["اِقْرَأْ", "اِقْرَآ", "اِقْرَأُوا", "اِقْرَئِي", "اِقْرَآ", "اِقْرَأْنَ"] },
    "ظنّ": { trMean: { mazi: "sandı", muzari: "sanıyor", emir: "san" }, mazi: ["ظَنَّ", "ظَنَّا", "ظَنُّوا", "ظَنَّتْ", "ظَنَّتَا", "ظَنَنَّ", "ظَنَنْتَ", "ظَنَنْتُمَا", "ظَنَنْتُمْ", "ظَنَنْتِ", "ظَنَنْتُمَا", "ظَنَنْتُنَّ", "ظَنَنْتُ", "ظَنَنَّا", "ظَنَنَّا"], muzari: ["يَظُنُّ", "يَظُنَّانِ", "يَظُنُّونَ", "تَظُنُّ", "تَظُنَّانِ", "يَظْنُنَّ", "تَظُنُّ", "تَظُنَّانِ", "تَظُنُّونَ", "تَظُنِّينَ", "تَظُنَّانِ", "تَظْنُنَّ", "أَظُنُّ", "نَظُنُّ", "نَظُنُّ"], emir: ["ظُنَّ", "ظُنَّا", "ظُنُّوا", "ظُنِّي", "ظُنَّا", "اُظْنُنَّ"] },
    "وجد": { trMean: { mazi: "buldu", muzari: "buluyor", emir: "bul" }, mazi: ["وَجَدَ", "وَجَدَا", "وَجَدُوا", "وَجَدَتْ", "وَجَدَتَا", "وَجَدْنَ", "وَجَدْتَ", "وَجَدْتُمَا", "وَجَدْتُمْ", "وَجَدْتِ", "وَجَدْتُمَا", "وَجَدْتُنَّ", "وَجَدْتُ", "وَجَدْنَا", "وَجَدْنَا"], muzari: ["يَجِدُ", "يَجِدَانِ", "يَجِدُونَ", "تَجِدُ", "تَجِدَانِ", "يَجِدْنَ", "تَجِدُ", "تَجِدَانِ", "تَجِدُونَ", "تَجِدِينَ", "تَجِدَانِ", "تَجِدْنَ", "أَجِدُ", "نَجِدُ", "نَجِدُ"], emir: ["جِدْ", "جِدَا", "جِدُوا", "جِدِي", "جِدَا", "جِدْنَ"] },
    "قال": { trMean: { mazi: "söyledi", muzari: "söylüyor", emir: "söyle" }, mazi: ["قَالَ", "قَالَا", "قَالُوا", "قَالَتْ", "قَالَتَا", "قُلْنَ", "قُلْتَ", "قُلْتُمَا", "قُلْتُمْ", "قُلْتِ", "قُلْتُمَا", "قُلْتُنَّ", "قُلْتُ", "قُلْنَا", "قُلْنَا"], muzari: ["يَقُولُ", "يَقُولَانِ", "يَقُولُونَ", "تَقُولُ", "تَقُولَانِ", "يَقُلْنَ", "تَقُولُ", "تَقُولَانِ", "تَقُولُونَ", "تَقُولِينَ", "تَقُولَانِ", "تَقُلْنَ", "أَقُولُ", "نَقُولُ", "نَقُولُ"], emir: ["قُلْ", "قُولَا", "قُولُوا", "قُولِي", "قُولَا", "قُلْنَ"] },
    "نسي": { trMean: { mazi: "unuttu", muzari: "unutuyor", emir: "unut" }, mazi: ["نَسِيَ", "نَسِيَا", "نَسُوا", "نَسِيَتْ", "نَسِيَتَا", "نَسِينَ", "نَسِيتَ", "نَسِيتُمَا", "نَسِيتُمْ", "نَسِيتِ", "نَسِيتُمَا", "نَسِيتُنَّ", "نَسِيتُ", "نَسِينَا", "نَسِينَا"], muzari: ["يَنْسَى", "يَنْسَيَانِ", "يَنْسَوْنَ", "تَنْسَى", "تَنْسَيَانِ", "يَنْسَيْنَ", "تَنْسَى", "تَنْسَيَانِ", "تَنْسَوْنَ", "تَنْسَيْنَ", "تَنْسَيَانِ", "تَنْسَيْنَ", "أَنْسَى", "نَنْسَى", "نَنْسَى"], emir: ["اِنْسَ", "اِنْسَيَا", "اِنْسَوْا", "اِنْسَيْ", "اِنْسَيَا", "اِنْسَيْنَ"] },
    "اعترف": { trMean: { mazi: "itiraf etti", muzari: "itiraf ediyor", emir: "itiraf et" }, mazi: ["اِعْتَرَفَ", "اِعْتَرَفَا", "اِعْتَرَفُوا", "اِعْتَرَفَتْ", "اِعْتَرَفَتَا", "اِعْتَرَفْنَ", "اِعْتَرَفْتَ", "اِعْتَرَفْتُمَا", "اِعْتَرَفْتُمْ", "اِعْتَرَفْتِ", "اِعْتَرَفْتُمَا", "اِعْتَرَفْتُنَّ", "اِعْتَرَفْتُ", "اِعْتَرَفْنَا", "اِعْتَرَفْنَا"], muzari: ["يَعْتَرِفُ", "يَعْتَرِفَانِ", "يَعْتَرِفُونَ", "تَعْتَرِفُ", "تَعْتَرِفَانِ", "يَعْتَرِفْنَ", "تَعْتَرِفُ", "تَعْتَرِفَانِ", "تَعْتَرِفُونَ", "تَعْتَرِفِينَ", "تَعْتَرِفَانِ", "تَعْتَرِفْنَ", "أَعْتَرِفُ", "نَعْتَرِفُ", "نَعْتَرِفُ"], emir: ["اِعْتَرِفْ", "اِعْتَرِفَا", "اِعْتَرِفُوا", "اِعْتَرِفِي", "اِعْتَرِفَا", "اِعْتَرِفْنَ"] },
    "انقلب": { trMean: { mazi: "devrildi", muzari: "devriliyor", emir: "devril" }, mazi: ["اِنْقَلَبَ", "اِنْقَلَبَا", "اِنْقَلَبُوا", "اِنْقَلَبَتْ", "اِنْقَلَبَتَا", "اِنْقَلَبْنَ", "اِنْقَلَبْتَ", "اِنْقَلَبْتُمَا", "اِنْقَلَبْتُمْ", "اِنْقَلَبْتِ", "اِنْقَلَبْتُمَا", "اِنْقَلَبْتُنَّ", "اِنْقَلَبْتُ", "اِنْقَلَبْنَا", "اِنْقَلَبْنَا"], muzari: ["يَنْقَلِبُ", "يَنْقَلِبَانِ", "يَنْقَلِبُونَ", "تَنْقَلِبُ", "تَنْقَلِبَانِ", "يَنْقَلِبْنَ", "تَنْقَلِبُ", "تَنْقَلِبَانِ", "تَنْقَلِبُونَ", "تَنْقَلِبِينَ", "تَنْقَلِبَانِ", "تَنْقَلِبْنَ", "أَنْقَلِبُ", "نَنْقَلِبُ", "نَنْقَلِبُ"], emir: ["اِنْقَلِبْ", "اِنْقَلِبَا", "اِنْقَلِبُوا", "اِنْقَلِبِي", "اِنْقَلِبَا", "اِنْقَلِبْنَ"] }
};

window.atlasMPats = [
    {p: "ـ ـ ـ", m: "O #"}, {p: "ـ ـ ـ ا", m: "O ikisi #"}, {p: "ـ ـ ـ ُوا", m: "Onlar #lar"},
    {p: "ـ ـ ـ تْ", m: "O #"}, {p: "ـ ـ ـ تَا", m: "O ikisi #"}, {p: "ـ ـ ـْ نَ", m: "Onlar #lar"},
    {p: "ـ ـ ـْ تَ", m: "Sen #n"}, {p: "ـ ـ ـْ تُمَا", m: "Siz ikiniz #nız"}, {p: "ـ ـ ـْ تُـمْ", m: "Siz #nız"},
    {p: "ـ ـ ـْ تِ", m: "Sen #n"}, {p: "ـ ـ ـْ تُمَا", m: "Siz ikiniz #nız"}, {p: "ـ ـ ـْ تُـنَّ", m: "Siz #nız"},
    {p: "ـ ـ ـْ تُ", m: "Ben #m"}, {p: "ـ ـ ـْ نَا", m: "Biz #k"}, {p: "ـ ـ ـْ نَا", m: "Biz #k"}
];

window.atlasMuzPats = [
    {p: "يـ ـ ـ ـ", m: "#"}, {p: "يـ ـ ـ ـ ان", m: "#lar"}, {p: "يـ ـ ـ ـ ون", m: "#lar"},
    {p: "تـ ـ ـ ـ", m: "#"}, {p: "تـ ـ ـ ـ ان", m: "#lar"}, {p: "يـ ـ ـ ـ ن", m: "#lar"},
    {p: "تـ ـ ـ ـ", m: "#sun"}, {p: "تـ ـ ـ ـ ان", m: "#sunuz"}, {p: "تـ ـ ـ ـ ون", m: "#sunuz"},
    {p: "تـ ـ ـ ـ ين", m: "#sun"}, {p: "تـ ـ ـ ـ ان", m: "#sunuz"}, {p: "تـ ـ ـ ـ ن", m: "#sunuz"},
    {p: "أـ ـ ـ ـ", m: "#um"}, {p: "نـ ـ ـ ـ", m: "#uz"}, {p: "نـ ـ ـ ـ", m: "#uz"}
];

window.atlasEPats = [
    {p: "ا  ـ ـ", m: "#"}, {p: "ا  ـ ـ ا", m: "#ın"}, {p: "ا  ـ ـ وا", m: "#ın"},
    {p: "ا  ـ ـ ي", m: "#"}, {p: "ا  ـ ـ ا", m: "#ın"}, {p: "ا  ـ ـ ن", m: "#ın"}
];

window.openAtlasOverlay = function(stage) {
    window.isAtlasMode = true;
    window.isAtlasFullscreen = false;
    let _sa = document.getElementById('screen-atlas');
    if(_sa) _sa.classList.remove('atlas-fullscreen');
    let _scrollCont = document.querySelector('#screen-atlas > div:first-of-type');
    if(_scrollCont) _scrollCont.scrollTop = 0;
    let _fsb = document.getElementById('atlas-fs-btn');
    if(_fsb) _fsb.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';

    let mOverlay = document.getElementById('marathon-overlay');
    mOverlay.classList.add("telaffuz-mode");
    mOverlay.classList.add('active');
    mOverlay.scrollTop = 0;
    document.getElementById('timer-display').style.display = 'none';
    document.getElementById('live-total-score').style.display = 'none';
    document.getElementById('chrono-main').style.display = 'none';
    document.getElementById('stage-label').style.display = 'none';
    document.getElementById('pause-btn').style.display = 'none';

    /* HATA DÜZELTMESİ: kapsamsız seçici, atlas açılırken KÖKLER
       PENCERESİNDEKİ üst satırı (çok kullanılan fiiller + ✕ + kök
       sayısı) satıriçi display:none ile gizliyor, atlas kapanınca da
       kimse geri açmıyordu. Artık yalnız maraton ekranına bakılıyor. */
    let rootContainer = document.querySelector('#marathon-overlay .important-roots-wrapper');
    if (rootContainer) rootContainer.style.display = 'none';
    
    let verbDisplay = document.getElementById('verb-root-display');
    if (verbDisplay) verbDisplay.style.display = 'none';
    
    let scoreBar = document.getElementById('score-bar');
    if(scoreBar) scoreBar.style.display = 'none';
    
    document.getElementById('atlas-selector-container').style.display = 'flex';
    
    let selectionArea = document.getElementById('marathon-selection-area');
    if (selectionArea) selectionArea.style.display = 'none';
    
    let countdownArea = document.getElementById('marathon-countdown-overlay');
    if (countdownArea) countdownArea.style.display = 'none';
    
    let gameContainer = document.getElementById('game-container');
    if (gameContainer) gameContainer.style.display = 'flex';
    
    document.getElementById('screen-play').classList.add('active');
    document.getElementById('screen-result').classList.remove('active');
    
    let prevArr = document.getElementById('prev-arr');
    if (prevArr) prevArr.style.display = 'none';
    let nextArr = document.getElementById('next-arr');
    if (nextArr) nextArr.style.display = 'none';
    
    document.getElementById('top-bar-panel').style.display = 'none';
    let _gwOpen = document.getElementById('game-wrapper');
    if (_gwOpen) _gwOpen.style.display = 'flex';
    document.getElementById('screen-play').style.display = '';
    document.getElementById('screen-atlas').style.display = '';
    document.getElementById('screen-result').style.display = '';
    showMarathonScreen('screen-atlas');
    document.getElementById('screen-atlas').style.position = 'relative';
    




    
    
    window.currentStage = stage.replace('_mezid', '').toLowerCase();
    let arTitle, trTitle, desc, descBottom = "";
    let hasTable = false;

    // Verb Stages (with Tables)
    if (stage === 'mazi' || stage === 'mazi_mezid') {
        arTitle = "الماضي"; trTitle = "Geçmiş Zaman (Mazi)"; 
        desc = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <p><strong>Mazi Fiil</strong>, genel olarak geçmişte yapılmış ve tamamlanmış eylemleri ifade eder. Çekimi fiilin sonuna eklenen bitişik zamirlerle (soneklerle) yapılır.</p>
        </div>`;
        descBottom = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 0 0 20px 0; border-radius: 0 10px 10px 0; margin-bottom: 40px;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Kur'an'da ve Klasik Arapça'da Farklı Kullanımları:</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;"><strong>1. Dua ve Beddua (Temenni):</strong> Mazi fiil çok sık olarak dua veya beddua bildirmek için kullanılır. "رَضِيَ اللهُ عَنْهُ" (Allah ondan razı olsun - Geçmiş zaman değil duadır). Veya "تَبَّتْ يَدَا أَبِي لَهَبٍ" (Ebu Leheb'in elleri kurusun).</li>
                    <li style="margin-bottom: 8px;"><strong>2. Kesin Gelecek Zaman (Mazi-i Muhakkak):</strong> Kur'an'da kıyamet sahneleri veya Allah'ın kesin vaatleri, <em>"gerçekleşmesi o kadar kesindir ki sanki geçmişte olmuş bitmiş gibidir"</em> vurgusu vermek için Mazi kipiyle anlatılır. Örn: "أَتَىٰ أَمْرُ اللَّهِ" (Allah'ın emri geldi/gelecek).</li>
                    <li><strong>3. Şart (Koşul) Cümlelerinde:</strong> Şart edatlarından sonra mazi fiil gelse de anlam geleceğe dönüktür. Örn: "مَنْ دَخَلَ..." (Kim girerse...).</li>
                </ul>
            </div>
        </div>`; hasTable = true;
    } else if (stage === 'muzari' || stage === 'muzari_mezid') {
        arTitle = "المُضارِع"; trTitle = "Geniş / Şimdiki Zaman (Muzari)"; 
        desc = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <p><strong>Muzari Fiil</strong>, eylemin şu an yapıldığını (şimdiki zaman), her zaman yapıldığını (geniş zaman) veya gelecekte yapılacağını bildirir. Çekimi fiilin başına getirilen "Eteyne (أتين)" harfleriyle ve soneklerle yapılır.</p>
        </div>`;
        descBottom = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <div style="background: #f5f3ff; border-left: 4px solid #8b5cf6; padding: 15px; margin: 0 0 20px 0; border-radius: 0 10px 10px 0; margin-bottom: 40px;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Muzari'nin Anlamını Değiştiren Edatlar:</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;"><strong>سَ / سَوْفَ (Gelecek Zaman):</strong> Muzarinin başına gelerek anlamı kesin olarak geleceğe taşır. "سَـ" yakın gelecek (Örn: سَيَعْلَمُونَ - Yakında bilecekler), "سَوْفَ" uzak gelecek bildirir.</li>
                    <li style="margin-bottom: 8px;"><strong>لَمْ / لَمَّا (Cehd-i Mutlak/Mustağrak):</strong> Muzariyi meczum (cezimli) yapar ve anlamını <em>kesin olarak geçmiş zamana ve olumsuza</em> çevirir. Örn: "لَمْ يَلِدْ" (Doğurmadı).</li>
                    <li style="margin-bottom: 8px;"><strong>لَنْ (Tekid-i Nefy-i İstikbal):</strong> Muzariyi mansub (üstünlü) yapar ve <em>gelecekte kesinlikle olmayacak</em> anlamı katar. Örn: "لَنْ تَرَانِي" (Beni asla göremeyeceksin).</li>
                    <li><strong>كَانَ ile Kullanımı:</strong> Başına "Kâne" geldiğinde <em>Şimdiki Zamanın Hikayesi</em> veya <em>Süreklilik</em> bildirir (Yapıyordu, Yapardı).</li>
                </ul>
            </div>
        </div>`; hasTable = true;
    } else if (stage === 'emir' || stage === 'emir_mezid') {
        arTitle = "الأَمْر"; trTitle = "Emir Kipi"; 
        desc = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <p><strong>Emir Fiili</strong>, karşımızdaki kişiden (muhatap/muhataba) bir işi yapmasını istemek için kullanılır.</p>
        </div>`;
        descBottom = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 0 0 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Edebi ve Kur'an'i Nüanslar (Emrin Mertebeleri):</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;"><strong>1. Gerçek Emir (Üstten Alta):</strong> Amirin memura, babanın çocuğa, efendinin köleye verdiği talimatlardır. Gerçek manada emirdir.</li>
                    <li style="margin-bottom: 8px;"><strong>2. Dua ve Niyaz (Alttan Üste):</strong> Kulun Allah'a veya astın üste söylediği "Emir" kipleri teknik olarak emir kalıbında olsa da asla emir sayılmaz, <strong>Dua ve Yakarış</strong> kabul edilir. Kur'an'da ve dualarda çok sık geçer: <em>"رَبَّنَا اغْفِرْ لَنَا" (Rabbimiz, bizi bağışla!)</em>, <em>"ارْحَمْنَا" (Bize merhamet et)</em>.</li>
                    <li style="margin-bottom: 8px;"><strong>3. İltimas / Rica (Eşitler Arası):</strong> Arkadaşın arkadaşa söylediği emir kipleri rica (iltimas) kabul edilir. (Örn: Lütfen bana şu kitabı ver.)</li>
                </ul>
            </div>
            <p style="margin-top:15px; font-size: 1.3rem; margin-bottom: 40px;"><strong>Not:</strong> Emrin olumsuzu (Nehiy) "لَا" (Lâ) edatı ile yapılır ve muzari fiilin sonu cezimlenir. (Örn: لَا تَحْزَنْ - Üzülme, لَا تَخَفْ - Korkma).</p>
        </div>`; hasTable = true;
    } 
    // Mücerred Nouns (No Tables)
    else if (stage === 'mastar') {
        arTitle = "المَصْدَر"; trTitle = "Mastar"; 
        desc = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <p><strong>Mastar</strong>, eylemin kök adıdır (yapmak, etmek gibi). Fiilin bildirdiği işi, zamana veya şahsa bağlı olmadan bağımsız bir "isim" olarak ifade eder.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">كِتَابَة</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">Yazmak</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">دُخُول</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">Girmek</span>
                </div>
            </div>
        </div>`;
        descBottom = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <div style="background: #eef2ff; border-left: 4px solid #6366f1; padding: 15px; margin: 10px 0 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Mezîd (Artırılmış) Mastarlar & Fark</h4>
                <p style="margin: 0;"><strong>Sülâsî Mücerred</strong> (3 harfli) mastarlar <strong>semâîdir</strong> (kalıpsızdır, sözlükten öğrenilir). <strong>Mezîd</strong> (harf eklenmiş) mastarlar ise <strong>kıyâsîdir</strong> — her babın değişmez bir mastar kalıbı vardır, kurala göre türetilir.</p>
            </div>
            <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; margin: 20px 0;">
                <div style="background: #eff6ff; padding: 18px 30px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 3.4rem; color: #2563eb; display: block; margin-bottom: 5px;">تَعْلِيم</span><span style="font-size: 1.5rem; color: #000000; font-weight: bold;">(Tef'îl) Öğretmek</span>
                </div>
                <div style="background: #fff7ed; padding: 18px 30px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 3.4rem; color: #ea580c; display: block; margin-bottom: 5px;">اِسْتِغْفار</span><span style="font-size: 1.5rem; color: #000000; font-weight: bold;">(İstif'âl) Bağışlanma Dilemek</span>
                </div>
            </div>
            <div style="background: #eef2ff; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Bab İsimleri Aslında Mastardır!</h4>
                <p style="margin: 0;">"İf'âl, Tef'îl, Mufâale" diye ezberlediğimiz bab isimleri, aslında o babların <strong>Mastar</strong> kalıplarıdır. Türkçedeki "İslâm, İmtihân, İstikbâl, Mücâdele, Tekbîr, Tevekkül" gibi kelimelerin hepsi Mezîd mastardır.</p>
            </div>
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Mastar Çeşitleri:</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 6px;"><strong>Mastar-ı Gayr-i Mîmî:</strong> Asıl mastarlardır (Semâi). Örn: ذَهَاب (Gitmek).</li>
                    <li style="margin-bottom: 6px;"><strong>Mastar-ı Mîmî:</strong> Başında zait bir "mim (م)" bulunan mastardır. Örn: مَحَبَّة (Sevmek), مَوْت (Ölmek), مَطْلَب (Taleb etmek).</li>
                    <li style="margin-bottom: 6px;"><strong>Bina-i Merra:</strong> İşin kaç kere yapıldığını (sayısını) bildirir. <em>فَعْلَة (Fa'let)</em> kalıbındadır. Örn: ضَرْبَة (Bir kere vurmak), جَلْسَة (Bir oturum/celse).</li>
                    <li style="margin-bottom: 6px;"><strong>Bina-i Nev'i:</strong> İşin yapılış şeklini (türünü) bildirir. <em>فِعْلَة (Fi'let)</em> kalıbındadır. Örn: جِلْسَة (Oturuş tarzı), مِشْيَة (Yürüyüş stili).</li>
                    <li><strong>Sınaî (Yapma) Mastar:</strong> İsmin sonuna şeddeli ye ve yuvarlak ta (يّة) getirilerek yapılır. Örn: إِنْسَانِيَّة (İnsanlık), حُرِّيَّة (Özgürlük), مَسْؤُولِيَّة (Mesuliyet).</li>
                </ul>
            </div>
        </div>`;
    } else if (stage === 'ismi_fail' || stage === 'ismi_fail_mezid') {
        arTitle = "اِسْمُ الفاعِل"; trTitle = "İsmi Fail (Etken Ortaç)"; 
        desc = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <p><strong>1. Mücerred (3 Harfli) Fiillerde:</strong> Fiili yapanı (özneyi) gösterir. <strong>"فَاعِل" (Fâil)</strong> kalıbında gelir.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 15px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">كَاتِب</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">Yazan / Kâtip</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">عَالِم</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">Bilen / Âlim</span>
                </div>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;">
            
            <p><strong>2. Mezid (Ekli) Fiillerde:</strong> Muzari fiilin başındaki muzaraat harfi atılır, yerine <strong>ötreli 'MİM' (مُ)</strong> getirilir ve <strong>sondan bir önceki harf ESRELİ</strong> okunur.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 15px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">مُعَلِّم</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">(Tef'il) Öğreten/Muallim</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">مُسْتَغْفِر</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">(İstif'al) Bağışlanma Dileyen</span>
                </div>
            </div>
            
            <div style="background: #f5f3ff; border-left: 4px solid #8b5cf6; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Türkçe'deki Harika Uyumu:</h4>
                <p style="margin: 0;">Türkçemizde "İsmi Fail" kalıbı çok yaygındır:<br>
                <strong>Mücerred (-Â -İ):</strong> Câhil, Hâkim, Zâlim, Şâir, Sâdık...<br>
                <strong>Mezid (MÜ/MU ve sondan bir önceki esre):</strong> Müsl<strong>i</strong>m (Teslim olan), Mü'm<strong>i</strong>n (İman eden), Münaf<strong>ı</strong>k, Müşr<strong>i</strong>k, Muall<strong>i</strong>m...</p>
            </div>
        </div>`;
    } else if (stage === 'ismi_meful' || stage === 'ismi_meful_mezid') {
        arTitle = "اِسْمُ المَفْعول"; trTitle = "İsmi Mef'ul (Edilgen Ortaç)"; 
        desc = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <p>Yapılan işten (eylemden) etkilenen kişiyi veya nesneyi gösteren türemiş isimdir. Sülasi mücerred fiillerde <strong>"مَفْعُول" (Mef'ûl)</strong> kalıbında gelir.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">مَكْتُوب</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">Yazılan / Mektup</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">مَعْلُوم</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">Bilinen / Malum</span>
                </div>
            </div>
            <div style="background: #eef2ff; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Türkçe'deki Kullanımı:</h4>
                <p style="margin: 0;">Faili (yapanı) ve Mef'ulü (yapılanı) Türkçede ikili olarak sıkça kullanırız:<br>
                Hâkim (hüküm veren) -> <strong>Mahkûm</strong> (Hüküm yemiş)<br>
                Zâlim (zulmeden) -> <strong>Mazlûm</strong> (Zulme uğrayan)<br>
                Hâlık (Yaratan) -> <strong>Mahlûk</strong> (Yaratılmış)<br>
                Diğer örnekler: <strong>Meşhûr, Mevcûd, Masnû', Ma'kûl, Matlûb, Mensûr...</strong></p>
            </div>
        </div>`;
    } else if (stage === 'zaman_mekan') {
        arTitle = "اِسْمُ الزَّمان والمَكان"; trTitle = "Zaman ve Mekan İsmi"; 
        desc = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <p>Eylemin yapıldığı <strong>zamanı</strong> veya eylemin gerçekleştiği <strong>yeri (mekan)</strong> ifade etmek için kullanılan kalıplardır.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">مَكْتَب</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">Yazı Yeri (Ofis/Mektep)</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">مَسْجِد</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">Secde Yeri (Mescit)</span>
                </div>
            </div>
            <div style="background: #fdf2f8; border-left: 4px solid #ec4899; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Temel Kalıplar ve Türkçe Kullanımı:</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 6px;"><strong>مَفْعَل (Mef'al):</strong> Mekteb, Meclis, Mahşer, Mağrib (Batı), Meşrik (Doğu), Makber.</li>
                    <li style="margin-bottom: 6px;"><strong>مَفْعِل (Mef'il):</strong> Mescid, Menzil.</li>
                    <li><strong>مَفْعَلَة (Mef'ale):</strong> Mahkeme, Matbaa, Medrese, Mezraa.</li>
                </ul>
            </div>
        </div>`;
    } else if (stage === 'ismi_alet') {
        arTitle = "اِسْمُ الآلَة"; trTitle = "İsmi Alet (Alet İsmi)"; 
        desc = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <p>Bir işin bizzat kendisiyle yapıldığı <strong>aleti, cihazı veya aracı</strong> ifade etmek için türetilen isimlerdir.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">مِفْتَاح</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">Açma Aleti (Anahtar)</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">مِكْنَسَة</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">Süpürme Aleti (Süpürge)</span>
                </div>
            </div>
            <div style="background: #f0fdfa; border-left: 4px solid #14b8a6; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Temel Kalıplar ve Türkçe Kullanımı:</h4>
                <p style="margin-bottom: 10px;">İsmi Alet kalıpları genellikle <strong>Mİ (مِـ)</strong> sesiyle başlar.</p>
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 6px;"><strong>مِفْعَال (Mif'âl):</strong> Miftah (Anahtar), Mizan (Terazi), Mikraz (Makas), Minşar (Testere), Miskal.</li>
                    <li style="margin-bottom: 6px;"><strong>مِفْعَل (Mif'el):</strong> Mincel (Orak), Mibred (Törpü).</li>
                    <li><strong>مِفْعَلَة (Mif'ale):</strong> Miknese (Süpürge), Mimhat (Silgi).</li>
                </ul>
            </div>
        </div>`;
    } else if (stage === 'cemi_teksir') {
        arTitle = "جَمْعُ التَّكْسير"; trTitle = "Kırık Çoğul (Cemi Teksir)"; 
        desc = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <p>Kelimenin tekil (müfred) yapısının kırılarak (harf eklenip çıkarılarak veya harekeleri değiştirilerek) oluşturulduğu <strong>düzensiz çoğul</strong> türüdür. Kurallı çoğullar gibi (Müslim > Müslimûn) sonuna standart bir ek almaz; ezberlenmesi gerekir.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">أَقْلاَم</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">(Kalem) Kalemler</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">كُتُب</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">(Kitap) Kitaplar</span>
                </div>
            </div>
            <div style="background: #ecfeff; border-left: 4px solid #06b6d4; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Türkçe'de Ne Kadar Çok Kullanıyoruz Farkında mısınız?</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 6px;">Âlim -> <strong>Ulema</strong> (Alimler) / Şair -> <strong>Şuara</strong> (Şairler)</li>
                    <li style="margin-bottom: 6px;">Mescid -> <strong>Mesacid</strong> (Mescitler) / Mekteb -> <strong>Mekatib</strong></li>
                    <li style="margin-bottom: 6px;">Haber -> <strong>Ahbar</strong> / Sebep -> <strong>Esbab</strong></li>
                    <li>Sır -> <strong>Esrar</strong> / Evlad, Eşya, Efkar, Etraf, Emir... hepsi aslında düzensiz Arapça çoğullardır!</li>
                </ul>
            </div>
        </div>`;
    } else if (stage === 'ismi_tasgir') {
        arTitle = "اِسْمُ التَّصْغير"; trTitle = "İsmi Tasğir (Küçültme İsmi)"; 
        desc = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <p>Varlığın küçüklüğünü, azlığını veya ona duyulan <strong>sevgi, şefkat ya da bazen küçümsemeyi</strong> ifade etmek için kullanılan özel kalıptır.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">كُتَيِّب</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">(Kitap) Kitapçık</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">وُلَيْد</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">(Veled) Çocukcağız</span>
                </div>
            </div>
            <div style="background: #fff1f2; border-left: 4px solid #f43f5e; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">En Meşhur Kalıp (فُعَيْل / Fu'eyl) ve Hayatımızdaki Yeri:</h4>
                <p style="margin-bottom: 10px;">Türkçede kullandığımız pek çok özel isim aslında birer sevgi sözcüğü olan <strong>İsmi Tasğir</strong> kalıbındadır:</p>
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 6px;">Hasan (Güzel) -> <strong>Hüseyin</strong> (Güzellik, Küçük ve sevimli Hasan)</li>
                    <li style="margin-bottom: 6px;">Abd (Kul) -> <strong>Ubeyd</strong> (Kulcağız)</li>
                    <li style="margin-bottom: 6px;">Ömer -> <strong>Ümeyr</strong> / Aziz -> <strong>Üzeyir</strong></li>
                    <li>Kur'an'da şefkatle hitap: "يَا بُنَيَّ" (Yâ Büneyye / Ey Oğulcağızım!) - İbn (Oğul) kelimesinin tasğiridir.</li>
                </ul>
            </div>
        </div>`;
    } else if (stage === 'ismi_tafdil') {
        arTitle = "اِسْمُ التَّفْضيل"; trTitle = "İsmi Tafdil (Üstünlük İsmi)"; 
        desc = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <p>Sıfatlarda kıyaslama (<strong>daha</strong>) veya en üstünlük (<strong>en</strong>) bildiren isimdir. Eril (Müzekker) için <strong>أَفْعَل (Ef'al)</strong>, Dişil (Müennes) için <strong>فُعْلَى (Fu'lâ)</strong> kalıbı kullanılır.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">أَكْبَر</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">En Büyük (Eril)</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">كُبْرَى</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">En Büyük (Dişil)</span>
                </div>
            </div>
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Bildiğimiz Tüm 'En'ler:</h4>
                <div style="display: flex; gap: 20px;">
                    <div style="flex: 1;">
                        <strong>Eril (أَفْعَل):</strong>
                        <ul style="margin-top: 5px; padding-left: 20px;">
                            <li>Kebir -> <strong>Ekber</strong> (Allahu Ekber)</li>
                            <li>Cemil -> <strong>Ecmel</strong> (En güzel)</li>
                            <li>Hasan -> <strong>Ahsen</strong> (Ahsen-i Takvim)</li>
                            <li>Sefil -> <strong>Esfel</strong> (Esfel-i Safilin)</li>
                        </ul>
                    </div>
                    <div style="flex: 1;">
                        <strong>Dişil (فُعْلَى):</strong>
                        <ul style="margin-top: 5px; padding-left: 20px;">
                            <li>Kebir -> <strong>Kübra</strong> (Hatice-tül Kübra)</li>
                            <li>Hasan -> <strong>Hüsna</strong> (Esma-ül Hüsna)</li>
                            <li>Sağir -> <strong>Suğra</strong> (En küçük)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>`;
    } else if (stage === 'mastar_mezid') {
        arTitle = "المَصْدَر"; trTitle = "Mastar (Mezid)"; 
        desc = `<div style="text-align: left; font-size: 1.4rem; color: #000000; line-height: 1.7;">
            <p>Mezid (harf eklenmiş) fiillerin mastarlarıdır. Sülasi Mücerred mastarların aksine, <strong>Mezid mastarlar tamamen kurallıdır (Kıyasîdir)</strong> ve her babın kendine özgü değişmez bir mastar kalıbı vardır.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">تَعْلِيم</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">(Tef'il Babı) Öğretmek</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">اِسْتِغْفار</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: bold;">(İstif'al) Bağışlanma Dilemek</span>
                </div>
            </div>
            <div style="background: #eef2ff; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Bab İsimleri Aslında Mastardır!</h4>
                <p style="margin: 0;">Bizim "İf'al, Tef'il, Mufaale" diyerek ezberlediğimiz bab isimleri, aslında o babların <strong>Mastar</strong> kalıplarından başka bir şey değildir. Türkçe'de kullandığımız "İslam, İmtihan, İstikbal, Mücadele, Tekbir, Tevekkül" kelimelerinin hepsi Mezid mastarlardır.</p>
            </div>
        </div>`;
    } else {
        arTitle = stage.toUpperCase(); trTitle = "Konu Anlatımı"; desc = "Bu konu ile ilgili açıklamalar eklenecektir.";
    }

    let elAr = document.getElementById('atlas-title-ar');

    let elTr = document.getElementById('atlas-title-tr');
    let elDesc = document.getElementById('atlas-desc');
    let elDescBottom = document.getElementById('atlas-desc-bottom');
    
    if(elAr) {
        elAr.innerText = arTitle;
        let isNoun = ['mastar', 'ismi_fail', 'ismi_meful', 'zaman_mekan', 'ismi_alet', 'cemi_teksir', 'ismi_tasgir', 'ismi_tafdil', 'mastar_mezid', 'ismi_fail_mezid', 'ismi_meful_mezid'].includes(stage);
        elAr.style.color = isNoun ? '#16a34a' : '#2563eb'; // Green for Nouns, Blue for Verbs
    }

    if(elTr) elTr.innerText = trTitle;
    if(elDesc) elDesc.innerHTML = desc;
    if (elDescBottom) elDescBottom.innerHTML = descBottom;
    
    window.hasAtlasTable = hasTable;
    
    let tableView = document.getElementById('atlas-table-view');
    let verbList = document.getElementById('atlas-verb-list');
    let sidebarTitle = document.getElementById('atlas-sidebar-title');
    
    let sidebar = document.getElementById('atlas-right-sidebar');
    
    // Dynamically rebuild the verb list based on whether it is Mezid or Mücerred
    if (verbList) {
        verbList.innerHTML = '';
        // Mobilde mezid/mucerred ayri sekme yok -> ORNEKLERE IKISINDEN DE ver, farki etiketle belirt
        let mucerredKeys = ["كتب", "قرأ", "ظنّ", "أكل", "وجد", "قال", "نسي", "درس", "ذهب"];
        let mucerredIcons = ["✍️", "📖", "🤔", "🍏", "🔍", "🗣️", "🤷", "📚", "🚶"];
        let mezidKeys = ["استيقظ", "توضأ", "صلى", "تناول", "ساعد", "أراد", "علّم", "اعترف", "انقلب"];
        let mezidIcons = ["⏰", "💧", "🤲", "🍽️", "🤝", "🎯", "👨‍🏫", "💬", "🔄"];


        // Ornek fiiller: akordiyon (Mucerred/Mezid kapali gelir)
        window._toggleAtlasGroup = function(groupId, headerEl){
            var open = !headerEl.classList.contains('open');
            headerEl.classList.toggle('open', open);
            var chev = headerEl.querySelector('.atlas-acc-chev');
            if (chev) chev.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
            document.querySelectorAll('.atlas-verb-btn[data-atlas-group="'+groupId+'"]').forEach(function(b){ b.style.display = open ? '' : 'none'; });
        };
        function _atlasSection(label, groupId) {
            let h = document.createElement('div');
            h.className = 'atlas-acc-header';
            h.setAttribute('data-atlas-head', groupId);
            h.style.cssText = "grid-column: 1 / -1; direction: ltr; font-family: system-ui, -apple-system, sans-serif; font-size: 0.95rem; font-weight: 800; color: #475569; letter-spacing: 0.01em; margin: 10px 2px 6px; padding: 11px 14px; border: 2px solid #e2e8f0; border-radius: 12px; background: #f8fafc; text-align: left; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 8px; -webkit-user-select: none; user-select: none;";
            h.innerHTML = '<span>' + label + '</span><span class="atlas-acc-chev" style="transition: transform .25s ease; font-size: 0.9rem; color:#94a3b8;">\u25BE</span>';
            h.onclick = function(){ window._toggleAtlasGroup(groupId, h); };
            verbList.appendChild(h);
        }
        function _atlasVerbBtns(keys, icons, groupId, firstActive) {
            keys.forEach((k, idx) => {
                let icon = icons[idx];
                let voweled = (window.displayVerbsMap[k]) ? window.displayVerbsMap[k] : k;
                let btn = document.createElement('button');
                btn.className = 'atlas-verb-btn';
                btn.setAttribute('data-atlas-group', groupId);
                btn.style.display = 'none';   // baslangicta kapali (akordiyon)
                if (firstActive && idx === 0) btn.classList.add('active');
                btn.innerHTML = `<span>${icon}</span> <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 1.4rem;">${voweled}</span>`;
                btn.onclick = function() { window.changeAtlasVerb(k, this); };
                verbList.appendChild(btn);
            });
        }

        _atlasSection("Sülâsî Mücerred", "mucerred");
        _atlasVerbBtns(mucerredKeys, mucerredIcons, "mucerred", true);
        _atlasSection("Sülâsî Mezîd", "mezid");
        _atlasVerbBtns(mezidKeys, mezidIcons, "mezid", false);

        window.currentAtlasVerbKey = mucerredKeys[0];
    }

    let flexContainer = document.querySelector('#screen-atlas > div:first-of-type');
    
    if (!hasTable) {
        if(tableView) tableView.style.display = 'none';
        if(sidebar) sidebar.style.display = 'none';
        if(flexContainer) {
            // Baslik ASLA kirpilmasin: her tarayicida guvenilir sekilde uste hizala.
            flexContainer.style.justifyContent = 'flex-start';
            flexContainer.style.alignItems = 'center';
        }
        let _fBtn = document.getElementById('atlas-fs-btn');
        if(_fBtn) _fBtn.style.display = 'none';
    } else {
        if(tableView) tableView.style.display = 'grid';
        if(sidebar) sidebar.style.display = 'flex';
        if(flexContainer) {
            flexContainer.style.justifyContent = 'flex-start';
            flexContainer.style.alignItems = 'center';
        }
        // Mobil: örnek fiilleri (sidebar) konu anlatımının hemen altına taşı (scroll'a dahil olsun)
        if (window.innerWidth <= 1024 && flexContainer && sidebar) {
            let _expl = document.getElementById('atlas-explanation');
            if (_expl && sidebar.parentElement !== flexContainer) {
                _expl.insertAdjacentElement('afterend', sidebar);
            }
        }
        window.handleAtlasVerbChange();
    }

    // === İLK AÇILIŞ BEYAZ EKRAN FIX ===
    // Gercek cihazda ilk acilista overlay/font henuz hazir olmadan render olup icerik bos (beyaz) kalabiliyordu.
    // Overlay tam gorunur olduktan (cift rAF) ve fontlar yuklendikten sonra icerigi yeniden ciz.
    try {
        let _gwFix = document.getElementById('game-wrapper');
        if (_gwFix) _gwFix.style.display = 'flex';
        let _moFix = document.getElementById('marathon-overlay');
        if (_moFix) { _moFix.classList.add('active'); void _moFix.offsetHeight; }
        requestAnimationFrame(function(){
            requestAnimationFrame(function(){
                if (!window.isAtlasMode) return;
                if (window.hasAtlasTable) { try { window.handleAtlasVerbChange(true); } catch(e){} }
            });
        });
        if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
            document.fonts.ready.then(function(){
                if (window.isAtlasMode && window.hasAtlasTable) { try { window.handleAtlasVerbChange(true); } catch(e){} }
            });
        }
    } catch(e){}
};

window.changeAtlasVerb = function(key, btnEl) {
    document.querySelectorAll('.atlas-verb-btn').forEach(btn => btn.classList.remove('active'));
    if(btnEl) btnEl.classList.add('active');
    window.currentAtlasVerbKey = key;
    window.handleAtlasVerbChange();
};

window.handleAtlasVerbChange = function(keepState = false) {
    let key = window.currentAtlasVerbKey || "كتب";
    let v = window.atlasVerbsData[key];
    if(!v) return;
    
    let fsBtn = document.getElementById('atlas-fs-btn');
    if (window.currentStage !== 'mazi' && window.currentStage !== 'muzari') {
        if (fsBtn) fsBtn.style.display = 'none';
        if (window.isAtlasFullscreen) {
            window.isAtlasFullscreen = false;
            let screenAtlas = document.getElementById('screen-atlas');
            if(screenAtlas) {
                screenAtlas.style.position = 'relative';
                screenAtlas.classList.remove('atlas-fullscreen');
            }
            if (fsBtn) fsBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
            setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 50);
        }
    } else {
        if (fsBtn) fsBtn.style.display = 'flex';
    }
    
    window.currentAtlasVerbData = v;
    
    let container = document.getElementById('atlas-table-view');

    window._tempRevealedIndices = [];
    if (keepState && container.children.length > 0) {
        let cells = container.querySelectorAll('.marathon-cell');
        cells.forEach((cell, idx) => {
            if (cell.classList.contains('atlas-revealed')) {
                window._tempRevealedIndices.push(idx);
            }
        });
    }

    container.innerHTML = '';
    
    if (window.isAtlasFullscreen) {
        container.style.flex = "1";
        container.style.height = "100%";
        container.style.display = "grid";
        container.style.maxWidth = "100%";
        container.style.width = "100%";
        container.style.margin = "0";
        container.style.gridTemplateRows = (window.currentStage === 'emir') ? "repeat(2, 1fr)" : "repeat(5, 1fr)";
        document.getElementById('atlas-explanation').style.display = 'none'; // Hide header for maximum space
    } else {
        container.style.flex = "none";
        container.style.height = "auto";
        container.style.gridTemplateRows = "auto";
        container.style.maxWidth = "100%";
        document.getElementById('atlas-explanation').style.display = 'block';
    }

    
    let count = (window.currentStage === 'emir') ? 6 : 15;
    let pats = (window.currentStage === 'mazi') ? window.atlasMPats : (window.currentStage === 'muzari') ? window.atlasMuzPats : window.atlasEPats;
    
    let rowClasses = ["#e0f2fe", "#fce7f3", "#e0f2fe", "#fce7f3", "#f1f5f9"];
    
    for (let i = 0; i < count; i++) {
        let btn = document.createElement('button');
        btn.className = 'marathon-cell';
        
        let r = Math.floor(i / 3);
        if (window.currentStage === 'emir') {
            r = (i < 3) ? 0 : 1; 
        }
        btn.style.background = rowClasses[r];
        btn.style.minHeight = window.isAtlasFullscreen ? "auto" : "13rem";
        btn.style.height = window.isAtlasFullscreen ? "100%" : "auto";
        btn.style.fontWeight = "normal";
        btn.style.flexDirection = "column";
        btn.style.justifyContent = "center";
        btn.style.alignItems = "center";
        btn.style.position = "relative";
        
        
        let baseMean = v.trMean[window.currentStage];
        let mean = "";
        if (pats[i].m.includes('#')) {
            let parts = pats[i].m.split('#');
            let prefix = parts[0];
            let suffix = parts[1] || "";
            
            if (suffix) {
                let lastVowelMatch = baseMean.match(/[aıeiöüouAIEIÖÜOU]/g);
                let lastVowel = lastVowelMatch ? lastVowelMatch[lastVowelMatch.length-1].toLowerCase() : 'a';
                let isPalatal = ['e', 'i', 'ö', 'ü'].includes(lastVowel);
                let isRounded = ['o', 'u', 'ö', 'ü'].includes(lastVowel);
                
                if (suffix === "lar") suffix = isPalatal ? "ler" : "lar";
                else if (suffix === "nız") {
                    if (isPalatal && isRounded) suffix = "nüz";
                    else if (isPalatal) suffix = "niz";
                    else if (isRounded) suffix = "nuz";
                    else suffix = "nız";
                }
                else if (suffix === "ın") {
                    // "otur" ends with consonant. "oku" ends with vowel? 
                    // "okuın" -> "okuyun" (kaynaştırma) ? The user said "giyın" -> "giyin", "oturın" -> "oturun".
                    // Let's just fix the basic harmony first.
                    if (isPalatal && isRounded) suffix = "ün";
                    else if (isPalatal) suffix = "in";
                    else if (isRounded) suffix = "un";
                    else suffix = "ın";
                    
                    // Harfle bitiyorsa (ünlü ile bitiyorsa) y ekle? Emirler genelde ünsüzle biter: otur, giy, yaz, sil. "oku" var! "okuun" -> okuyun.
                    if (/[aıeiöüouAIEIÖÜOU]$/.test(baseMean)) suffix = "y" + suffix;
                }
                else if (suffix === "um") {
                    if (isPalatal && isRounded) suffix = "üm";
                    else if (isPalatal) suffix = "im";
                    else if (isRounded) suffix = "um";
                    else suffix = "ım";
                }
                else if (suffix === "uz") {
                    if (isPalatal && isRounded) suffix = "üz";
                    else if (isPalatal) suffix = "iz";
                    else if (isRounded) suffix = "uz";
                    else suffix = "ız";
                }
                else if (suffix === "sun") {
                    if (isPalatal && isRounded) suffix = "sün";
                    else if (isPalatal) suffix = "sin";
                    else if (isRounded) suffix = "sun";
                    else suffix = "sın";
                }
                else if (suffix === "sunuz") {
                    if (isPalatal && isRounded) suffix = "sünüz";
                    else if (isPalatal) suffix = "siniz";
                    else if (isRounded) suffix = "sunuz";
                    else suffix = "sınız";
                }
            }
            mean = prefix + baseMean + suffix;
        } else {
            mean = pats[i].m;
        }

        let fullWord = v[window.currentStage][i];
        let coloredWord = window.colorizeAffixes ? window.colorizeAffixes(fullWord, window.currentStage, i) : fullWord;
        
        // Kutunun içi
        btn.innerHTML = `
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; width: 100%;">
                <span class="arabic" id="arab-text-${i}" style="font-size:${window.isAtlasFullscreen ? "clamp(3rem, 6.5vh, 6rem)" : "clamp(3.5rem, 5vw, 6rem)"}; pointer-events:none; color: #ea580c; letter-spacing: -2px;">${pats[i].p}</span>
            </div>
            <div style="height: ${window.isAtlasFullscreen ? "2rem" : "4rem"}; display: flex; align-items: flex-start; justify-content: center; width: 100%; margin-bottom: 0.5rem;">
                <span style="font-size:${window.isAtlasFullscreen ? "clamp(1.2rem, 2.5vh, 2.2rem)" : "clamp(1.5rem, 2vw, 2.5rem)"}; color:#475569; pointer-events:none; font-family: sans-serif;">${mean}</span>
            </div>
        `;
        
        btn.onclick = function(e) {
            if (e && e.stopPropagation) e.stopPropagation();
            let arabSpan = this.querySelector(`#arab-text-${i}`);
            if (this.classList.contains('atlas-revealed')) {
                this.classList.remove('atlas-revealed');
                arabSpan.innerHTML = pats[i].p;
                arabSpan.style.color = '#ea580c';
                arabSpan.style.fontSize = window.isAtlasFullscreen ? 'clamp(3rem, 6.5vh, 6rem)' : 'clamp(3.5rem, 5vw, 6rem)';
                arabSpan.style.letterSpacing = '-2px';
            } else {
                this.classList.add('atlas-revealed');
                arabSpan.innerHTML = coloredWord;
                arabSpan.style.color = '#0f172a'; // Siyah (Slate 900)
                arabSpan.style.fontSize = window.isAtlasFullscreen ? 'clamp(3.5rem, 8vh, 7rem)' : 'clamp(4.5rem, 7vw, 8rem)';
                arabSpan.style.letterSpacing = 'normal';
            }
        };
        container.appendChild(btn);
        
        if (window._tempRevealedIndices && window._tempRevealedIndices.includes(i)) {
            btn.onclick();
        }
    }
    window._tempRevealedIndices = []; // reset after use
};


// ==========================================
// HIZLI SÖZLÜK (FAST DICTIONARY MODE) MANTIĞI
// ==========================================

function openFastDictionaryMode() {
    const fdm = document.getElementById('fast-dictionary-overlay');
    if (fdm && fdm.style.display === 'flex') {
        closeFastDictionaryMode();
        return;
    }
    
    // Animasyon durumunu sıfırla, böylece her açılışta liste sırayla açılsın
    fdmAnimated = { mucerred: false, mezid: false };
    
    if (!currentRoot || !sozlukVerileri[currentRoot]) return;
    
    // YENİ KLAVYEYİ KESİN OLARAK KAPAT
    if (typeof closeKeyboard === 'function') closeKeyboard();
    const popup = document.getElementById('integrated-keyboard-popup');
    const backdrop = document.getElementById('keyboard-backdrop'); 
    if (popup) popup.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove("keyboard-active");
    
    // Arka planı "Türet" (Onaylanmış) durumuna getir, böylece sözlük vurguları doğru çalışır
    if (typeof confirmRoot === 'function') {
        confirmRoot();
    }
    
    // KULLANICI İSTEĞİ: Sözlükteki kelimeleri arka planda hazır türetilmiş olarak kutulara yerleştir (vurguları bozmadan)
    const refs = getSortedRefsForRoot(currentRoot);
    refs.forEach(refId => {
        const targetBox = Array.from(document.querySelectorAll('.glass-box')).find(b => {
            const refEl = b.querySelector('.ref');
            return refEl && parseInt(refEl.innerText.trim()) === refId;
        });
        
        if (targetBox && !targetBox.classList.contains('kok-turendi')) {
            const targetEl = targetBox.querySelector('.ar, .ar-small');
            if (targetEl) {
                const kalip = targetBox.getAttribute('data-original');
                let plainWord = kalip;
                const mapping = getBabAndType(refId);
                const vezinObj = babVezinleri[mapping.babNo];
                let kalipMetni = (vezinObj && vezinObj[mapping.type]) ? vezinObj[mapping.type] : kalip;
                
                if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[currentRoot] && sozlukVerileri[currentRoot][refId]) {
                    let eggObj = sozlukVerileri[currentRoot][refId];
                    if (eggObj.base && eggObj.base.arText && eggObj.base.arText.trim().split(/\s+/).length === 1) {
                        plainWord = eggObj.base.arText;
                    } else if (eggObj.cekimi && eggObj.cekimi.length > 0) {
                        let ilkEleman = eggObj.cekimi[0];
                        plainWord = typeof ilkEleman === 'object' ? ilkEleman.ar : ilkEleman;
                    } else if (eggObj.base && eggObj.base.cekimi && eggObj.base.cekimi.length > 0) {
                        let ilkEleman = eggObj.base.cekimi[0];
                        plainWord = typeof ilkEleman === 'object' ? ilkEleman.ar : ilkEleman;
                    } else {
                        plainWord = applyRootToKalip(currentRoot, kalipMetni);
                    }
                } else {
                    plainWord = applyRootToKalip(currentRoot, kalipMetni);
                }
                
                let activeRootArray = currentRoot.split("");
                targetEl.innerHTML = ColorEngine.colorize(plainWord, activeRootArray);
                targetBox.classList.add('kok-turendi');
                targetBox.style.setProperty("background-color", "#bfffdf", "important");
                targetBox.style.borderColor = "#000000";
                
                // Anlam vurguları ve ikonları için (kullanıcının istediği asıl vurgu)
                if (typeof checkWordEasterEgg === 'function') {
                    checkWordEasterEgg(targetBox);
                }
            }
        }
    });
    
    // Üst barı ve sürüklenebilir kök levhasını gizle (kök levhası listeye dönüşüyormuş gibi)
    const tb = document.querySelector('.top-bar');
    if (tb) tb.style.display = 'none';
    
    document.querySelectorAll('.draggable-root-clone').forEach(el => {
        if (!el.closest('#fdm-root-container')) {
            el.style.setProperty('display', 'none', 'important');
        }
    });
    
    // Ses patlamasını engellemek için, bir kere toplu ses çal
    if (typeof SoundEngine !== "undefined") {
        SoundEngine.playClick();
    }
    
    
    // Kök başlığını yaz ve yanına bilgi (legend) panelini ekle
    const formattedTitle = formatArabicRoot(currentRoot);
    const fdmContainer = document.getElementById('fdm-root-container');
    if (fdmContainer) {
        const isDesktopFDM = window.innerWidth > 1024;
        
        // Masaüstü için orijinal inline !important kurallarını geri getiriyoruz ki masaüstü bozulmasın.
        const rStyle = isDesktopFDM 
            ? "position: relative !important; top: 0 !important; left: 0 !important; transform: none !important; margin: 0 70px 0 0 !important; cursor: default !important; z-index: 10 !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 4.2rem !important; padding: 14px 20px 20px 0px !important; min-width: 240px !important; border-radius: 18px !important; flex-shrink: 0;" 
            : "position: relative !important; top: 0 !important; left: 0 !important; transform: none !important; margin: 0 70px 0 0; cursor: default !important; z-index: 10 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 14px 20px 20px 0px; min-width: 240px; border-radius: 8px !important; flex-shrink: 0;";
            
        const rootPlateHtml = `<div class="fdm-root-plate draggable-root-clone fdm-mobile-resize" style="${rStyle}"><span class="root-text-content fdm-mobile-text">${formattedTitle}</span></div>`;
        
        const infoHtml = `
            <div dir="ltr" class="fdm-info-box" style="font-family: 'Arakom', sans-serif; display: flex; flex-direction: column; justify-content: center; flex: 1; text-align: left;">
                <div style="display: flex; gap: 30px; margin-bottom: 0px; justify-content: flex-start;" class="fdm-info-row">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="display:inline-block; width: 22px; height: 22px; background: #27ae60; border-radius: 6px;" class="fdm-color-box"></span>
                        <span style="font-size: 2.6rem; color: #333; font-weight: bold;" class="fdm-info-text">FİİLLER</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="display:inline-block; width: 22px; height: 22px; background: #2980b9; border-radius: 6px;" class="fdm-color-box"></span>
                        <span style="font-size: 2.6rem; color: #333; font-weight: bold;" class="fdm-info-text">İSİMLER</span>
                    </div>
                </div>
                <div style="font-size: 2.4rem; color: #555; line-height: 1.6;" class="fdm-info-note">
                    <span style="font-weight: bold; color: #2980b9; font-size: 2.4rem;" class="fdm-info-note-title">Not:</span> Türkçeye geçen Arapça kelimeler genellikle isimlerdir.
                </div>
            </div>
        `;
        
        if (isDesktopFDM) {
            // Masaüstü orijinal görünüm (rootPlate solda, infoHtml sağda, align-items: stretch)
            fdmContainer.innerHTML = `<div style="display: flex; align-items: stretch; justify-content: space-between; width: 100%; gap: 30px; padding: 10px;">${rootPlateHtml}${infoHtml}</div>`;
        } else {
            // Mobil için kök ve not kısmı yer değiştirilmiş, align-items: center
            fdmContainer.innerHTML = `<div style="display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 30px; padding: 10px;">${infoHtml}${rootPlateHtml}</div>`;
        }
    }
    
    // Listeleri temizle
    const mucList = document.getElementById('fdm-mucerred-list');
    const mezList = document.getElementById('fdm-mezid-list');
    if (mucList) mucList.innerHTML = '';
    if (mezList) mezList.innerHTML = '';
    
    // Sözlük verisini ayıkla
    const rootData = sozlukVerileri[currentRoot];
    let mucerredItems = [];
    let mezidItems = [];
    
    Object.keys(rootData).forEach(refStr => {
        if (refStr === 'isDictOnly' || refStr === 'tip') return;
        const refId = parseInt(refStr);
        const refData = rootData[refStr];
        let emoji = "", arText = "", trText = "";
        
        let hasPlus = false;
        let plusObj = null;
        if (refData) {
            const ignoreKeys = ["base", "cekimi", "isNotVerb", "ornek", "tekil", "cogul", "isDictOnly", "tip", "cogulTr", "suggestsPlus", "hasZamirCekimi", "zamirBase"];
            let pKey = Object.keys(refData).find(k => !ignoreKeys.includes(k));
            if (pKey) {
                hasPlus = true;
                plusObj = refData[pKey];
            } else if (refData.tekil) {
                let pKeyTekil = Object.keys(refData.tekil).find(k => !ignoreKeys.includes(k));
                if (pKeyTekil) {
                    hasPlus = true;
                    plusObj = refData.tekil[pKeyTekil];
                }
            }
        }
        
        if (refData.tekil && refData.tekil.base) {
            emoji = refData.tekil.base.emoji || "";
            arText = refData.tekil.base.arText || "";
            trText = refData.tekil.base.trText || "";
        } else if (refData.base) {
            emoji = refData.base.emoji || "";
            arText = refData.base.arText || refData.base.ar || "";
            trText = refData.base.trText || refData.base.tr || "";
        } else {
            emoji = refData.emoji || "";
            arText = refData.arText || refData.ar || "";
            trText = refData.trText || refData.tr || "";
        }
        
        // Eğer temel anlam (trText) boşsa ve + eki varsa, ilk eki varsayılan olarak göster
        if ((!trText || trText.trim() === "") && hasPlus && plusObj) {
            arText = plusObj.arText || plusObj.ar || arText; 
            trText = plusObj.trText || plusObj.tr || "";
            emoji = plusObj.emoji || emoji;
        }
        
        let isVerbListRow = (refId <= 16 || [52,53,54, 58,59,60, 64,65,66, 71,72,73, 77,78,79, 88,89,90, 94,95,96, 100,101,102].includes(refId));
        let numBg = isVerbListRow ? '#27ae60' : '#2980b9';
        
        const html = `
            <div class="fdm-list-row" data-ref="${refId}" style="display: flex; padding: 18px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); border: 1px solid rgba(0,0,0,0.05); align-items: center; opacity: 0; transform: translateY(10px); transition: all 0.4s ease;">
                <div class="${isVerbListRow ? 'fdm-num-btn' : ''}" style="width: 65px; text-align: center; font-weight: bold; font-size: 1.8rem; color: #ffffff; background: ${numBg}; border-radius: 6px; padding: 8px; ${isVerbListRow ? 'cursor:pointer;' : ''}" ${isVerbListRow ? `onclick="event.stopPropagation(); openFdmMazi(${refId});" title="Cekim tablosuna dokun"` : ''}>${refId}</div>
                <div style="flex: 1; text-align: right; padding-right: 20px; font-family: 'Arakom', sans-serif; font-size: 3.4rem; color: #000;">${arText} ${emoji}</div>
                <div style="flex: 1; text-align: left; color: #444; font-size: 1.8rem;" dir="ltr">${trText}</div>
            </div>
        `;
        
        if (refId <= 51) mucerredItems.push({refId, html});
        else mezidItems.push({refId, html});
    });
    
    // Sırala ve ekle
    if (mucList) {
        mucerredItems.sort((a,b) => a.refId - b.refId).forEach(item => mucList.innerHTML += item.html);
    }
    if (mezList) {
        mezidItems.sort((a,b) => a.refId - b.refId).forEach(item => mezList.innerHTML += item.html);
    }
    
    // Mücerred/Mezid örneği yoksa o sekmeyi pasif göster
    window._fdmMucEmpty = (mucerredItems.length === 0);
    window._fdmMezEmpty = (mezidItems.length === 0);
    (function(){
        var tMuc = document.getElementById('fdm-mucerred-tab');
        var tMez = document.getElementById('fdm-mezid-tab');
        function setPassive(el, passive){
            if(!el) return;
            if(passive){ el.style.opacity='0.35'; el.style.pointerEvents='none'; el.style.filter='grayscale(1)'; el.setAttribute('data-fdm-empty','1'); }
            else { el.style.opacity=''; el.style.pointerEvents=''; el.style.filter=''; el.removeAttribute('data-fdm-empty'); }
        }
        setPassive(tMuc, window._fdmMucEmpty);
        setPassive(tMez, window._fdmMezEmpty);
    })();
    
    // Üst paneli gizleme kodu kaldırıldı; mevcut kök levhası görünür kalacak.

    fdm.style.display = 'flex';
    
    // Varsayılan olarak Mücerred sekmesi açılır
    // (Animasyonların doğru tetiklenmesi için küçük bir gecikme ekliyoruz)
    setTimeout(() => {
        triggerFDMTab(window._fdmMucEmpty ? 'mezid' : 'mucerred');
    }, 50);
}

function closeFastDictionaryMode() {
    const fdm = document.getElementById('fast-dictionary-overlay');
    if (fdm) fdm.style.display = 'none';

    // KELIME DETAY KARTINDAN (mazi/muzari/emir, tekil/cogul, mustakil) gelindiyse:
    // carpiya basinca kart KAPANMASIN -> karti geri goster (arama da arkada geri acilir)
    if (window._fdmReturnToWordDetails) {
        window._fdmReturnToWordDetails = false;
        var _ovW = document.getElementById('keyboard-overlay');
        if (_ovW) { _ovW.style.display = 'flex'; _ovW.classList.add('native-search-mode'); }
        var _niW = document.getElementById('mobile-native-search');
        var _qW = window._lastMobileSearchQuery || '';
        if (_niW) _niW.value = _qW;
        try { currentRoot = _qW; } catch (e) {}
        if (typeof updateMainKeyboardPredictions === 'function') updateMainKeyboardPredictions();
        if (typeof window._msLockScroll === 'function') window._msLockScroll();
        var _wo = document.getElementById('word-details-overlay');
        var _wm = document.getElementById('word-details-modal');
        if (_wo) _wo.style.display = 'block';
        if (_wm) _wm.style.display = 'block';
        return;
    }

    // ARAMADAN gelindiyse: carpiya basinca aramada kalinan yere geri don
    if (window._fdmReturnToSearch) {
        window._fdmReturnToSearch = false;
        var _ov = document.getElementById('keyboard-overlay');
        if (_ov) { _ov.style.display = 'flex'; _ov.classList.add('native-search-mode'); }
        var _ni = document.getElementById('mobile-native-search');
        var _q = window._lastMobileSearchQuery || '';
        if (_ni) _ni.value = _q;
        try { currentRoot = _q; } catch (e) {}
        if (typeof updateTempDisplay === 'function') updateTempDisplay();
        if (typeof updateMainKeyboardPredictions === 'function') updateMainKeyboardPredictions();
        if (typeof window._msLockScroll === 'function') window._msLockScroll();
        return;
    }

    // Kök listesinden gelindiyse çarpıya basınca kök listesine geri dön
    if (window._fdmReturnToRoots) {
        window._fdmReturnToRoots = false;
        if (typeof openRootsModal === 'function') { openRootsModal(); return; }
    }
    
    const tb = document.querySelector('.top-bar');
    if (tb) tb.style.display = 'flex';
    
    document.querySelectorAll('.draggable-root-clone').forEach(el => el.style.display = 'block');
}

let fdmTimeouts = [];
let fdmAnimated = { mucerred: false, mezid: false };
function triggerFDMTab(tabType) {
    // Boş sekme istenirse dolu olana yönlendir
    if (tabType === 'mucerred' && window._fdmMucEmpty && !window._fdmMezEmpty) tabType = 'mezid';
    else if (tabType === 'mezid' && window._fdmMezEmpty && !window._fdmMucEmpty) tabType = 'mucerred';
    fdmTimeouts.forEach(clearTimeout);
    fdmTimeouts = [];
    const isMucerred = tabType === 'mucerred';
    
    // Sekme Stilleri
    const tabMuc = document.getElementById('fdm-mucerred-tab');
    const tabMez = document.getElementById('fdm-mezid-tab');
    if (isMucerred) {
        tabMuc.style.background = '#FF3B30';
        tabMuc.style.color = '#ffffff';
        tabMuc.style.boxShadow = '0 4px 10px rgba(255, 59, 48, 0.4)';
        tabMez.style.background = 'rgba(255, 255, 255, 0.5)';
        tabMez.style.color = '#555';
        tabMez.style.boxShadow = 'none';
    } else {
        tabMez.style.background = '#FF3B30';
        tabMez.style.color = '#ffffff';
        tabMez.style.boxShadow = '0 4px 10px rgba(255, 59, 48, 0.4)';
        tabMuc.style.background = 'rgba(255, 255, 255, 0.5)';
        tabMuc.style.color = '#555';
        tabMuc.style.boxShadow = 'none';
    }
    
    // Arka planı değiştir
    if (typeof setTab === 'function') {
        setTab(isMucerred ? 0 : 1, true); // FDM'de sekme değişirken ses çalma (Sessiz)
    }

    // MOBİL İÇİN: Aktif olmayan listeyi gizle
    const mucContainer = document.getElementById('fdm-mucerred-container');
    const mezContainer = document.getElementById('fdm-mezid-container');
    
    if (window.innerWidth <= 1024) {
        if (isMucerred) {
            if (mucContainer) mucContainer.style.display = 'flex';
            if (mezContainer) mezContainer.style.display = 'none';
        } else {
            if (mucContainer) mucContainer.style.display = 'none';
            if (mezContainer) mezContainer.style.display = 'flex';
        }
    } else {
        // Masaüstü için her ikisini de görünür tut
        if (mucContainer) mucContainer.style.display = 'flex';
        if (mezContainer) mezContainer.style.display = 'flex';
    }
    
    // Tablodaki Sarı Vurgulu Kutu (Emojiler) ve Listedeki Satırları Bul
    const activeTableId = isMucerred ? 'tab1' : 'tab2';
    const activeTabEl = document.getElementById(activeTableId);
    if (!activeTabEl) return;
    
    const emojiBoxes = Array.from(activeTabEl.querySelectorAll('.glass-box.sari-vurgu'));
    emojiBoxes.sort((a,b) => {
        const refA = a.querySelector('.ref') ? parseInt(a.querySelector('.ref').innerText) : 0;
        const refB = b.querySelector('.ref') ? parseInt(b.querySelector('.ref').innerText) : 0;
        return refA - refB;
    });
    
    const listId = isMucerred ? 'fdm-mucerred-list' : 'fdm-mezid-list';
    const listRows = Array.from(document.querySelectorAll('#' + listId + ' .fdm-list-row'));
    
    if (fdmAnimated[tabType]) {
        // Zaten animasyon oynatıldıysa, sadece görünür olduklarından emin ol ve çık.
        emojiBoxes.forEach(box => {
            box.style.transition = 'all 0.4s ease';
            box.style.transform = 'scale(1)';
            box.style.opacity = '1';
            box.style.zIndex = '30'; box.style.position = 'relative';
        });
        listRows.forEach(row => {
            row.style.transition = 'all 0.4s ease';
            row.style.transform = 'translateY(0)';
            row.style.opacity = '1';
        });
        return;
    }
    
    fdmAnimated[tabType] = true;

    // Önce hepsini gizle
    emojiBoxes.forEach(box => {
        box.style.transition = 'none'; // Animasyonu sıfırla
        box.style.transform = 'scale(0)';
        box.style.opacity = '0';
        box.style.zIndex = '30'; box.style.position = 'relative'; // Liste üzerine çıkması için
    });
    listRows.forEach(row => {
        row.style.transition = 'none';
        row.style.transform = 'translateY(20px)';
        row.style.opacity = '0';
    });
    
    // Toplam 3 saniye (3000ms) içinde hepsini aç
    const totalDuration = 3000;
    const count = Math.max(emojiBoxes.length, listRows.length);
    if (count === 0) {
        if (isMucerred) {
            triggerFDMTab('mezid');
        }
        return;
    }
    
    const delayStep = 180; // sabit sıralı açılış (3sn toplam sınır kaldırıldı)
    
    // Force reflow
    void activeTabEl.offsetWidth;
    
    for (let i = 0; i < count; i++) {
        let t = setTimeout(() => {
            if (emojiBoxes[i]) {
                emojiBoxes[i].style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                emojiBoxes[i].style.transform = 'scale(1.2)'; // Biraz büyük patlasın
                emojiBoxes[i].style.opacity = '1';
                
                // Patlama efektinden sonra normale dön
                let tInner = setTimeout(() => {
                    if(emojiBoxes[i]) emojiBoxes[i].style.transform = 'scale(1)';
                }, 400);
                fdmTimeouts.push(tInner);
            }
            if (listRows[i]) {
                listRows[i].style.transition = 'all 0.4s ease';
                listRows[i].style.transform = 'translateY(0)';
                listRows[i].style.opacity = '1';
                
                // Listedeki eleman görünür olduğunda scroll oraya kaysın (Opsiyonel: Eğer çok uzunsa)
                listRows[i].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, i * delayStep);
        fdmTimeouts.push(t);
    }
    
    // YENİ İSTEK: "süper mücerred listesi bitince mezid listesi otomatik başlasın"
    if (isMucerred) {
        let autoMezidTimer = setTimeout(() => {
            triggerFDMTab('mezid');
        }, count * delayStep + 400); // kelimeler bitince hemen mezid'e geç (sabit 3sn bekleme yok)
        fdmTimeouts.push(autoMezidTimer);
    }
}

// ==============================================================
// MOBİL ALFABE KAYDIRICISI (SCRUBBER) MANTIĞI
// ==============================================================
function initAlphabetScrubber() {
    const scrubber = document.getElementById("mobile-scrubber");
    const contentArea = document.getElementById("mobile-roots-content-area");
    if (!scrubber || !contentArea) return;

    let lastLetter = null;

    function goToLetter(letter, el) {
        if (!letter) return;
        document.querySelectorAll(".scrubber-letter").forEach(l => l.classList.remove("active"));
        if (el) el.classList.add("active");
        const targetGroup = document.getElementById("letter-group-" + letter);
        if (!targetGroup) return;
        // Sticky header yuksekligi kadar bosluk birak; offsetTop yerine gercek konum farki (saglam)
        const headerEl = contentArea.querySelector(".mobile-roots-header");
        const headerH = headerEl ? headerEl.offsetHeight : 64;
        const cRect = contentArea.getBoundingClientRect();
        const gRect = targetGroup.getBoundingClientRect();
        let newTop = contentArea.scrollTop + (gRect.top - cRect.top) - headerH - 8;
        if (newTop < 0) newTop = 0;
        contentArea.scrollTo({ top: newTop, behavior: "smooth" });
        if (navigator.vibrate) { try { navigator.vibrate(8); } catch (_) {} }
    }

    function letterElFromPoint(x, y) {
        const el = document.elementFromPoint(x, y);
        if (!el) return null;
        if (el.classList && el.classList.contains("scrubber-letter")) return el;
        return el.closest ? el.closest(".scrubber-letter") : null;
    }

    function handleScrub(e) {
        e.preventDefault();
        scrubber.classList.add("is-scrubbing");
        const touch = e.touches ? e.touches[0] : e;
        const letterEl = letterElFromPoint(touch.clientX, touch.clientY);
        if (letterEl) {
            const letter = letterEl.getAttribute("data-letter");
            if (letter !== lastLetter) {
                lastLetter = letter;
                goToLetter(letter, letterEl);
            }
        }
    }

    function resetScrub() {
        scrubber.classList.remove("is-scrubbing");
        lastLetter = null;
        setTimeout(function () {
            document.querySelectorAll(".scrubber-letter").forEach(l => l.classList.remove("active"));
        }, 400);
    }

    // Dokunmatik surukle
    scrubber.addEventListener("touchstart", handleScrub, {passive: false});
    scrubber.addEventListener("touchmove", handleScrub, {passive: false});
    scrubber.addEventListener("touchend", resetScrub);
    scrubber.addEventListener("touchcancel", resetScrub);
    // Tek tik / fare (masaustu + guvenli dokunus)
    scrubber.addEventListener("click", function (e) {
        const letterEl = e.target && e.target.closest ? e.target.closest(".scrubber-letter") : null;
        if (letterEl) {
            goToLetter(letterEl.getAttribute("data-letter"), letterEl);
            setTimeout(function () {
                document.querySelectorAll(".scrubber-letter").forEach(l => l.classList.remove("active"));
            }, 600);
        }
    });
}

// ==========================================
// TELAFFUZ (PRONUNCIATION) FILTER LOGIC
// ==========================================

window.telaffuzFilters = {
    letter: [],
    aksam: []
};

function openTelaffuz() {
    document.getElementById('telaffuz-overlay').style.display = 'flex';
    document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
}

function toggleTFilter(el, type, value) {
    if (el.classList.contains('active')) {
        el.classList.remove('active');
        window.telaffuzFilters[type] = [];
    } else {
        // Remove active class from all sibling chips
        let containerId = type === 'letter' ? 'telaffuz-letter-filters' : 'telaffuz-aksam-filters';
        let container = document.getElementById(containerId);
        if (container) {
            container.querySelectorAll('.t-filter-chip').forEach(chip => chip.classList.remove('active'));
        }
        
        el.classList.add('active');
        window.telaffuzFilters[type] = [value];
    }
    // Cipe basinca OTOMATIK filtrele; hizli tiklamalari debounce ile birlestir (cihaz kasmasin)
    if (window._telFilterTimer) clearTimeout(window._telFilterTimer);
    window._telFilterTimer = setTimeout(function(){ applyTelaffuzFilter(); }, 70);
}

function getAksamIseba(root) {
    const letters = root.replace(/\s/g, '').split('');
    if (letters.length !== 3) return ["Sahih"]; 
    const l1 = letters[0], l2 = letters[1], l3 = letters[2];
    const illats = ['و', 'ي'];
    const hamzas = ['ء', 'أ', 'إ', 'ؤ', 'ئ', 'ا']; 
    
    let isIllat1 = illats.includes(l1);
    let isIllat2 = illats.includes(l2);
    let isIllat3 = illats.includes(l3);
    let hasHamza = hamzas.includes(l1) || hamzas.includes(l2) || hamzas.includes(l3);
    let isMuzaaf = (l2 === l3);
    
    let types = [];
    let illatCount = [isIllat1, isIllat2, isIllat3].filter(Boolean).length;
    
    if (illatCount >= 2) types.push("Lefif");
    else if (isIllat3) types.push("Nakıs");
    else if (isIllat2) types.push("Ecvef");
    else if (isIllat1) types.push("Misal");
    
    if (hasHamza && !isIllat1 && !isIllat2 && !isIllat3) {
        types.push("Mehmuz");
    } else if (hasHamza) {
        types.push("Mehmuz"); 
    }
    
    if (isMuzaaf && !types.includes("Lefif") && !types.includes("Nakıs")) types.push("Muzaaf");
    
    if (types.length === 0) types.push("Sahih");
    
    return types;
}

function getLetterCountFromRefId(refId) {
    refId = parseInt(refId);
    if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].includes(refId)) return 3; 
    if ([52, 53, 54, 58, 59, 60, 64, 65, 66].includes(refId)) return 4; 
    if ([71, 72, 73, 77, 78, 79, 83, 84, 85, 88, 89, 90, 94, 95, 96].includes(refId)) return 5; 
    if ([100, 101, 102].includes(refId)) return 6; 
    return -1;
}

function applyTelaffuzFilter() {
    const resContainer = document.getElementById('telaffuz-results');
    resContainer.innerHTML = '<div style="text-align:center; padding: 20px;">Filtreleniyor...</div>';
    
    setTimeout(() => {
        let results = [];
        const requiredAksam = window.telaffuzFilters.aksam;
        const requiredLetters = window.telaffuzFilters.letter;
        
        if (requiredAksam.length === 0 && requiredLetters.length === 0) {
            resContainer.innerHTML = '<div style="text-align:center; color:#e74c3c; padding: 20px; font-size: 1.2rem;">Lütfen en az bir filtre seçin.</div>';
            return;
        }

        const sourceObj = typeof wordEasterEggs !== 'undefined' ? wordEasterEggs : {};
        const allRoots = Object.keys(sourceObj);
        allRoots.forEach(root => {
            const aksamList = getAksamIseba(root);
            
            if (requiredAksam.length > 0) {
                const matchAksam = requiredAksam.some(a => aksamList.includes(a));
                if (!matchAksam) return;
            }
            
            const verbs = getAvailableMaziVerbs(root);
            verbs.forEach(v => {
                const lCount = getLetterCountFromRefId(v.refId);
                if (requiredLetters.length > 0) {
                    if (!requiredLetters.includes(lCount)) return;
                }
                
                results.push({
                    root: root,
                    verb: v.word,
                    refId: v.refId,
                    aksam: aksamList.join(', '),
                    letters: lCount
                });
            });
        });
        
        if (results.length === 0) {
            resContainer.innerHTML = '<div style="text-align:center; color:#7f8c8d; padding: 20px; font-size: 1.2rem;">Kriterlere uygun fiil bulunamadı.</div>';
        } else {
            // O(n): tek string olustur, innerHTML'i BIR KEZ ata (dongude += = O(n^2) donmaya yol aciyordu)
            let _html = '';
            results.forEach(r => {
                const escapedRoot = r.root.replace(/"/g, "&quot;").replace(/'/g, "\\'");
                _html += `
                    <div class="t-result-item" onclick="launchTelaffuzMarathon('${escapedRoot}', ${r.refId})">
                        <span class="t-result-ar">${r.verb}</span>
                        <div class="t-result-tags">
                            <span class="t-result-tag">${r.aksam}</span>
                            <span class="t-result-tag">${r.letters} Harf</span>
                        </div>
                    </div>
                `;
            });
            resContainer.innerHTML = _html;
            // Yeni sonuclarda scroll'u basa al (ikinci filtrede takili kalmasin)
            if (resContainer.parentElement) resContainer.parentElement.scrollTop = resContainer.offsetTop - 20;
        }
    }, 10);
}

function launchTelaffuzMarathon(root, refId) {
    document.getElementById('telaffuz-overlay').style.display = 'none';
    document.documentElement.style.overflow='';document.body.style.overflow='';
    currentRoot = root;
    
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    // İLK-AÇILIŞ BEYAZ SAYFA DÜZELTMESİ: openMarathon ile aynı görünürlük sıfırlamaları.
    // (telaffuz yolu bunları atlıyordu; soğuk ilk açılışta konteynır boş/beyaz kalabiliyordu)
    window.isAtlasMode = false;
    let _sp = document.getElementById('screen-play'); if (_sp) _sp.style.display = '';
    let _sa = document.getElementById('screen-atlas'); if (_sa) _sa.style.display = '';
    let _sr = document.getElementById('screen-result'); if (_sr) _sr.style.display = '';
    let _gw = document.getElementById('game-wrapper'); if (_gw) _gw.style.display = 'flex';
    let _asel = document.getElementById('atlas-selector-container'); if (_asel) _asel.style.display = 'none';
    
    clearInterval(window.mTimerInterval);
    clearInterval(window.mCountdownInterval); 
    window.mCurrentStage = 0; 
    window.mErrorMemory.clear(); 
    window.mElapsedTime = 0; 
    window.mIsPaused = false;
    window.mRaceMode = false;
    window.mSkippedLobby = true;
    window.mLaunchedFromTelaffuz = true;   // telaffuz ekranından başlatıldı -> çıkışta oraya dön

    let mOverlay = document.getElementById('marathon-overlay');
    mOverlay.classList.add("telaffuz-mode");
    mOverlay.classList.add('active');
    mOverlay.scrollTop = 0;
    
    const topBar = document.getElementById('top-bar-panel');
    if(topBar) topBar.style.visibility = 'visible';
    
    hideMarathonHeaders(); 
    const chronoMain = document.getElementById('chrono-main');
    if(chronoMain) chronoMain.style.display = 'none'; 
    
    buildMarathonDataForBab(refId);
    
    document.getElementById('marathon-selection-area').style.display = 'none';
    prepareMarathonPlay();
    
    // İlk-boya (first-paint) zamanlama düzeltmesi: bir sonraki karede tabloyu yeniden çiz.
    requestAnimationFrame(function() {
        if (window.mLaunchedFromTelaffuz && document.getElementById('marathon-overlay').classList.contains('active')) {
            showMarathonScreen('screen-play');
            if (typeof window.loadMarathonTable === 'function') window.loadMarathonTable();
        }
    });
}



// --- GÜNÜN KÖKÜ (ROOT OF THE DAY) ---
function showRootOfDay() {
    if (typeof wordEasterEggs === 'undefined') return;
    
    // Verbs IDs to exclude
    let verbIds = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16",
                   "52","53","54","58","59","60","64","65","66","71","72","73","77","78","79",
                   "83","84","85","88","89","90","94","95","96","100","101","102"];
    
    // En az 3 isim barındıran kökleri bulalım
    let validRoots = [];
    let allRootKeys = Object.keys(wordEasterEggs);
    
    for (let rKey of allRootKeys) {
        let nounCount = 0;
        let rData = wordEasterEggs[rKey];
        for (let k in rData) {
            if (!verbIds.includes(k) && rData[k].base && rData[k].base.arText) {
                nounCount++;
            }
        }
        if (nounCount >= 3) {
            validRoots.push(rKey);
        }
    }
    
    if (validRoots.length === 0) return;
    
    // Her açılışta rastgele bir kök
    let randomIndex = Math.floor(Math.random() * validRoots.length);
    let selectedRootKey = validRoots[randomIndex];
    let rData = wordEasterEggs[selectedRootKey];
    
    /* GUNUN KOKU KELIMELERI — "+" EKLI BICIMLER DE AYRI KART OLUR.
       Bir kalibin base'inin yaninda ek govdesi (ة, ات, يَّة ...) tanimliysa o da
       basli basina bir kelimedir: سَلَام / سَلَامَة, خِلَاف / خِلَافَة gibi. Eskiden
       yalniz base alinirdi, bu kelimeler Gunun Koku'nde hic gorunmezdi.
       Ek govdesi base'in HEMEN ardina konur ki iki kart yan yana dussun.
       ROD_AYRIK: kelime olmayan, ayar niteligindeki anahtarlar. */
    const ROD_AYRIK = ['base', 'cekimi', 'ornek', 'isNotVerb', 'tekil', 'cogul', 'cogulTr',
                       'isDictOnly', 'tip', 'suggestsPlus', 'hasZamirCekimi', 'zamirBase',
                       'autoGenerated', 'cogulId', 'tekilId', 'isHiddenInList'];
    let wordsArray = [];
    for (let k in rData) {
        if (verbIds.includes(k)) continue;
        let kalip = rData[k];
        if (!kalip || kalip.isHiddenInList) continue;          /* gizli kayit karta cikmaz */
        if (!kalip.base || !kalip.base.arText) continue;
        wordsArray.push(kalip.base);
        for (let ek in kalip) {                                 /* "+" ekli bicimler */
            if (ROD_AYRIK.includes(ek)) continue;
            let govde = kalip[ek];
            if (govde && govde.arText && !govde.isHiddenInList) wordsArray.push(govde);
        }
    }
    
    wordsArray = wordsArray.slice(0, 15); // Max 15 nouns
    
    // 15 Farklı şık iOS/Profesyonel renk paleti (Koyu ve okunabilir)
    const colorPalette = [
        "#FF3B30", // Kırmızı
        "#007AFF", // Mavi
        "#34C759", // Yeşil (Biraz koyulaştırıldı ama okunaklı)
        "#5856D6", // İndigo / Mor
        "#FF9500", // Turuncu
        "#AF52DE", // Mor / Eflatun
        "#FF2D55", // Pembe
        "#0284C7", // Gök Mavisi (Koyu)
        "#16A34A", // Zümrüt Yeşili
        "#D97706", // Koyu Sarı / Altın
        "#7C3AED", // Menekşe
        "#0D9488", // Turkuaz / Deniz Mavisi
        "#E11D48", // Koyu Gül Rengi
        "#4B5563", // Havalı Gri
        "#4338CA"  // Koyu Lacivert
    ];
    const softPalette = [
        "#7E9AB8","#83AB87","#A98CB6","#C09A70","#74A5A2","#BC8794","#8E93A8","#AC9877",
        "#8BA4C0","#95B08C","#B58C9A","#7AA1B2","#BFA079","#9AA6BE","#A6AE8C"
    ];
    
    let derivedWordsHTML = "";
    for (let i = 0; i < wordsArray.length; i++) {
        let w = wordsArray[i];
        // Renklendirme kapatıldı (zaid harf renklendirmesi iptal), kelimenin tamamı tek renk olacak
        let rawArText = w.arText; 
        let cardColor = colorPalette[i % colorPalette.length];
        let softColor = softPalette[i % softPalette.length];
        
        derivedWordsHTML += `
            <div class="rod-card" data-idx="${i}" style="flex: 0 1 200px; min-width: 160px; max-width: 260px; height: 168px; perspective: 900px; cursor: pointer;">
              <div class="rod-card-inner" style="position: relative; width: 100%; height: 100%; transition: transform 0.6s cubic-bezier(0.4,0.2,0.2,1); transform-style: preserve-3d;">
                <div class="rod-face" style="position: absolute; inset: 0; -webkit-backface-visibility: hidden; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; border-radius: 16px; background: ${softColor}; color: rgba(255,255,255,0.95); box-shadow: 0 4px 10px rgba(0,0,0,0.10);">
                  <span style="font-size: 64px; font-weight: 800; text-shadow: 0 2px 6px rgba(0,0,0,0.18);">?</span>
                </div>
                <div class="rod-face" style="position: absolute; inset: 0; -webkit-backface-visibility: hidden; backface-visibility: hidden; transform: rotateY(180deg); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 16px; background: #ffffff; border: 2px solid ${cardColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.06); padding: 10px;">
                  <div style="font-family: 'Arakom', sans-serif; font-size: 46px; color: ${cardColor}; line-height: 1.2;" dir="rtl">${rawArText}</div>
                  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #555555; font-weight: 600; margin-top: 8px;" dir="ltr">${w.trText}</div>
                </div>
              </div>
            </div>
        `;
    }
    
    // Harfleri tatweel (ـ) ile akıllı bir şekilde formatlama (Örn: كـ ـتـ ـب)
    const nonJoining = ['ا', 'د', 'ذ', 'ر', 'ز', 'و', 'ؤ', 'ء', 'أ', 'إ', 'آ'];
    let formattedRootArray = [];
    for (let i = 0; i < selectedRootKey.length; i++) {
        let char = selectedRootKey[i];
        let isLast = (i === selectedRootKey.length - 1);
        let prevNonJoining = (i === 0) || nonJoining.includes(selectedRootKey[i - 1]);
        let currNonJoining = nonJoining.includes(char);
        
        let part = char;
        if (!prevNonJoining) part = 'ـ' + part; // join right
        if (!currNonJoining && !isLast) part = part + 'ـ'; // join left
        
        formattedRootArray.push(part);
    }
    let formattedRootText = formattedRootArray.join(' ');
    
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "rootOfDayOverlay";
    modalOverlay.style.position = "fixed";
    modalOverlay.style.top = "0";
    modalOverlay.style.left = "0";
    modalOverlay.style.width = "100vw";
    modalOverlay.style.height = "100vh";
    modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.4)"; 
    modalOverlay.style.backdropFilter = "blur(10px)";
    modalOverlay.style.WebkitBackdropFilter = "blur(10px)";
    modalOverlay.style.zIndex = "2147483647";
    modalOverlay.style.display = "flex";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.alignItems = "center";
    modalOverlay.style.opacity = "0";
    modalOverlay.style.transition = "opacity 0.4s ease-out";
    
    // iOS/Apple-like professional design
    modalOverlay.innerHTML = `
        <div id="rod-panel" style="background: #f5f5f7; width: 95%; max-width: 1100px; max-height: 90vh; overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; border-radius: 28px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative; transform: scale(0.95) translateY(20px); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1); text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            
            <button onclick="closeRootOfDay()" style="position: absolute; top: 20px; right: 20px; background: #e2e8f0; border: none; border-radius: 50%; width: 36px; height: 36px; font-size: 16px; color: #1d1d1f; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='#cbd5e1'" onmouseout="this.style.background='#e2e8f0'">
                <i class="fas fa-times"></i>
            </button>
            
            <div style="display: inline-block; background: #ffffff; color: #000000; border: 2px solid #e2e8f0; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 25px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                <i class="fas fa-seedling" style="margin-right: 6px; color: #FF3B30;"></i> GÜNÜN KÖKÜ
            </div>
            
            <div style="font-family: 'Arakom', sans-serif; font-size: 100px; color: #1d1d1f; line-height: 1.1; margin-bottom: 25px; text-shadow: 0 2px 10px rgba(0,0,0,0.05);" dir="rtl">
                ${formattedRootText}
            </div>
            
            <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: stretch; gap: 20px; margin-top: 25px; padding: 0 10px;">
                ${derivedWordsHTML}
            </div>
            
        </div>
    `;
    
    // Fallback for mobile devices
    let style = document.createElement('style');
    style.innerHTML = `
        @media (max-width: 900px) {
            #rootOfDayOverlay > div > div:last-child > div {
                flex: 0 1 200px !important;
            }
        }
        @media (max-width: 600px) {
            #rootOfDayOverlay > div > div:last-child > div {
                flex: 0 1 140px !important;
                min-width: 140px !important;
                padding: 12px 8px !important;
            }
            #rootOfDayOverlay > div > div:last-child > div > div:first-child {
                font-size: 38px !important;
            }
            #rootOfDayOverlay > div > div:nth-child(3) {
                font-size: 70px !important;
            }
            #rootOfDayOverlay > div {
                padding: 30px 15px !important;
                border-radius: 20px !important;
            }
        }
        @media (orientation: landscape) and (max-height: 600px) {
            #rootOfDayOverlay > div {
                padding: 14px 20px 46px 20px !important;
                max-height: 96vh !important;
            }
            #rootOfDayOverlay > div > div:nth-child(3) {
                font-size: 46px !important;
                margin-bottom: 12px !important;
            }
            #rootOfDayOverlay > div > div:last-child {
                gap: 10px !important;
                margin-top: 12px !important;
                padding-bottom: 28px !important;
            }
            #rootOfDayOverlay > div > div:last-child > div {
                flex: 0 1 108px !important;
                min-width: 108px !important;
                padding: 8px 6px !important;
            }
            #rootOfDayOverlay > div > div:last-child > div > div:first-child {
                font-size: 26px !important;
            }
        }
        /* MOBIL YATAY: gunun koku TAM EKRAN (harici CSS'e bagimli olmadan, yuksek ozgulluk) */
        @media (orientation: landscape) {
            body #rootOfDayOverlay {
                height: 100vh !important;
                height: 100dvh !important;
                align-items: stretch !important;
                padding: 0 !important;
            }
            body #rootOfDayOverlay > div {
                width: 100vw !important;
                max-width: none !important;
                height: 100vh !important;
                height: 100dvh !important;
                max-height: 100dvh !important;
                min-height: 100dvh !important;
                border-radius: 0 !important;
                box-shadow: none !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modalOverlay);
    // Arka planı kilitle: iOS'ta overflow:hidden yetmez, body'yi position:fixed ile donduruyoruz
    window._rodScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    document.documentElement.style.overflow='hidden';
    document.body.style.overflow='hidden';
    document.body.style.position='fixed';
    document.body.style.top = (-window._rodScrollY) + 'px';
    document.body.style.left='0';
    document.body.style.right='0';
    document.body.style.width='100%';
    
    setTimeout(() => {
        modalOverlay.style.opacity = "1";
        modalOverlay.firstElementChild.style.transform = "scale(1) translateY(0)";
    }, 50);

    // ==== GUNUN KOKU (mobil): geri sayimsiz; karta dokununca cevrilir ====
    (function(){
      var panel = modalOverlay.querySelector('#rod-panel');
      var cards = Array.prototype.slice.call(modalOverlay.querySelectorAll('.rod-card'));
      var n = cards.length; if(n===0 || !panel) return;
      var totalMs = n*20000, remaining = totalMs, ended=false;
      var svg=null, rect=null, P=0, NS='http://www.w3.org/2000/svg';
      var drainStart=0, endTimer=null;
      function isFlipped(c){ return c.getAttribute('data-flipped')==='1'; }
      function flip(c){ if(isFlipped(c)) return false; c.setAttribute('data-flipped','1'); var inner=c.querySelector('.rod-card-inner'); if(inner) inner.style.transform='rotateY(180deg)'; return true; }
      function curRemaining(){ return Math.max(0, remaining - (Date.now()-drainStart)); }
      function buildTimer(){
        var w=panel.offsetWidth, h=panel.offsetHeight, r=26, sw=6;
        svg=document.createElementNS(NS,'svg'); svg.style.position='absolute'; svg.style.pointerEvents='none'; svg.style.zIndex='6';
        rect=document.createElementNS(NS,'rect'); rect.setAttribute('fill','none'); rect.setAttribute('stroke','#FF3B30'); rect.setAttribute('stroke-width',sw); rect.setAttribute('stroke-linecap','round'); rect.style.filter='drop-shadow(0 0 5px rgba(255,59,48,.5))'; rect.style.willChange='stroke-dashoffset';
        svg.appendChild(rect); modalOverlay.appendChild(svg);
        svg.setAttribute('width',w); svg.setAttribute('height',h); svg.style.left=panel.offsetLeft+'px'; svg.style.top=panel.offsetTop+'px';
        rect.setAttribute('x',sw/2); rect.setAttribute('y',sw/2); rect.setAttribute('width',w-sw); rect.setAttribute('height',h-sw); rect.setAttribute('rx',r); rect.setAttribute('ry',r);
        var ww=w-sw, hh=h-sw; P = 2*((ww-2*r)+(hh-2*r)) + 2*Math.PI*r;
        rect.style.strokeDasharray = P; rect.style.strokeDashoffset = '0';
      }
      function startDrain(){
        if(!rect) return; var rem = remaining; var frac = rem/totalMs;
        rect.style.transition='none'; rect.style.strokeDashoffset = (P*(1-frac)).toFixed(1);
        void rect.getBoundingClientRect();
        rect.style.transition = 'stroke-dashoffset '+rem+'ms linear'; rect.style.strokeDashoffset = P.toFixed(1);
        drainStart = Date.now(); if(endTimer) clearTimeout(endTimer); endTimer = setTimeout(endGame, rem);
      }
      function endGame(){ if(ended) return; ended=true; if(endTimer) clearTimeout(endTimer);
        if(rect){ rect.style.transition='stroke-dashoffset .3s linear'; rect.style.strokeDashoffset = P.toFixed(1); }
        var rest=cards.filter(function(c){return !isFlipped(c);}); rest.forEach(function(c,i){ setTimeout(function(){ flip(c); }, i*280); }); }
      cards.forEach(function(c){ c.addEventListener('click', function(){ flip(c); }); });
      function reposition(){ if(svg && panel && rect){ var w=panel.offsetWidth,h=panel.offsetHeight,sw=6; /* Perde kapanmışsa ölçü sıfırdır: negatif <rect> yazmayalım. */ if(!panel.isConnected || w<=sw || h<=sw) return; svg.style.left=panel.offsetLeft+'px'; svg.style.top=panel.offsetTop+'px'; svg.setAttribute('width',w); svg.setAttribute('height',h); rect.setAttribute('width',w-sw); rect.setAttribute('height',h-sw); } }
      window.addEventListener('resize', reposition);
      /* geri sayim (kirmizi kenar) mobilde kaldirildi */
    })();
}


document.addEventListener('DOMContentLoaded', () => { setTimeout(() => { showRootOfDay(); }, 800); });


window.closeRootOfDay = function() {
    // Arka plan kilidini kaldir ve kaydirma konumunu geri yukle
    document.documentElement.style.overflow='';
    document.body.style.overflow='';
    document.body.style.position='';
    document.body.style.top='';
    document.body.style.left='';
    document.body.style.right='';
    document.body.style.width='';
    if (typeof window._rodScrollY === 'number') { window.scrollTo(0, window._rodScrollY); window._rodScrollY = null; }
    const modalOverlay = document.getElementById("rootOfDayOverlay");
    if (modalOverlay) {
        modalOverlay.style.opacity = "0";
        modalOverlay.firstElementChild.style.transform = "scale(0.95) translateY(-20px)";
        setTimeout(() => modalOverlay.remove(), 400);
    }
}



function showAksamSebaGenelInfo(e) {
    if (e) e.stopPropagation();
    var titleEl = document.getElementById('aksam-info-title');
    if (titleEl) titleEl.innerText = "Aksam-ı Seb'a Nedir?";
    var ov = document.getElementById('aksam-info-overlay');
    if (ov) ov.style.display = 'flex';
    var txt = document.getElementById('aksam-info-text');
    if (!txt) return;
    txt.innerHTML = `
<div style="text-align: left; direction: ltr; padding: 18px; font-family: 'Inter', sans-serif;">
    <p style="margin: 0 0 20px 0; font-size: 0.95rem; color: #1e293b; line-height: 1.65;" dir="ltr">
        <strong style="color: #6c5ce7; font-size: 1.1rem;">Aksam-ı Seb'a (Yedi Kısım)</strong>, Arapça fiillerin ve kelimelerin içerdikleri temel harflerin (kök harflerin) ses ve yapı özelliklerine göre yedi farklı gruba ayrılmasıdır. Bir kelimenin kökündeki harflerin sahih (sağlam) veya illetli (zayıf) oluşu, o kelimenin nasıl çekimleneceğini doğrudan belirler.
    </p>

    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 13px 15px;" dir="ltr">
            <div style="font-weight: 700; color: #15803d; font-size: 1rem; margin-bottom: 8px;">Sahih (Sağlam) Fiiller — 3 Kısım</div>
            <div style="font-size: 0.88rem; color: #334155; line-height: 1.85;">Kök harflerinde illet harfi (<span dir="rtl" style="font-family:'Arakom',sans-serif;">و ي ا</span>) <b>bulunmaz</b>.
                <br><b>Salim:</b> İllet, hemze ve şedde yok — <span dir="rtl" style="font-family:'Arakom',sans-serif;font-size:1.25rem;color:#15803d;">نَصَرَ</span>
                <br><b>Mehmuz:</b> Kök harflerinden biri hemze — <span dir="rtl" style="font-family:'Arakom',sans-serif;font-size:1.25rem;color:#15803d;">سَأَلَ</span>
                <br><b>Muzaaf:</b> Son iki harfi aynı (şeddeli) — <span dir="rtl" style="font-family:'Arakom',sans-serif;font-size:1.25rem;color:#15803d;">مَدَّ</span>
            </div>
        </div>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 13px 15px;" dir="ltr">
            <div style="font-weight: 700; color: #b91c1c; font-size: 1rem; margin-bottom: 8px;">Mutel (İlletli) Fiiller — 4 Kısım</div>
            <div style="font-size: 0.88rem; color: #334155; line-height: 1.85;">Kökünde en az bir illet harfi (<span dir="rtl" style="font-family:'Arakom',sans-serif;">و ي ا</span>) <b>bulunur</b>.
                <br><b>Misal:</b> İlk harfi illetli — <span dir="rtl" style="font-family:'Arakom',sans-serif;font-size:1.25rem;color:#b91c1c;">وَجَدَ</span>
                <br><b>Ecvef:</b> Orta harfi illetli — <span dir="rtl" style="font-family:'Arakom',sans-serif;font-size:1.25rem;color:#b91c1c;">قَالَ</span>
                <br><b>Nakıs:</b> Son harfi illetli — <span dir="rtl" style="font-family:'Arakom',sans-serif;font-size:1.25rem;color:#b91c1c;">رَمَى</span>
                <br><b>Lefif:</b> İki harfi illetli — <span dir="rtl" style="font-family:'Arakom',sans-serif;font-size:1.25rem;color:#b91c1c;">نَوَى</span>
            </div>
        </div>
    </div>

    <div style="background: #f0f9ff; border-left: 5px solid #3b82f6; padding: 14px 16px; margin-bottom: 18px; border-radius: 0 12px 12px 0; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);" dir="ltr">
        <h4 style="margin: 0 0 10px 0; color: #1d4ed8; font-size: 1.05rem; font-weight: 600; border-bottom: 2px solid #bfdbfe; padding-bottom: 8px;" dir="ltr">Telaffuz İçin Önemi</h4>
        <p style="margin: 0; font-size: 0.92rem; color: #334155; line-height: 1.65;" dir="ltr">
            Arapçada illet harfleri (Vav, Ya, Elif) sesli harf işlevi de görebilir. Bu harflerin düşmesi, dönüşmesi veya başka bir harfle kaynaşması kelimenin vurgusunu ve doğal telaffuzunu tamamen değiştirir. Aksam-ı Seb'a'yı bilmek, illetli harflerin nerede uzatılacağını, nerede okunmayacağını öngörmeyi ve akıcı, doğru bir telaffuz (artikülasyon) yakalamayı sağlar.
            <br><br>
            <span style="color: #64748b; font-size: 0.9rem;">Örnek:</span> İkinci harfi illetli olan Ecvef bir kelimede, harfin dönüşümü sesi belirler:
            <br>
            <span dir="rtl" style="font-family: 'Arakom', sans-serif !important; font-size: 1.6rem; color: #3b82f6; margin: 0 6px; display: inline-block;">قَوَلَ</span>
            <span style="font-size: 0.9rem;">(Kavele) ➔</span>
            <span dir="rtl" style="font-family: 'Arakom', sans-serif !important; font-size: 1.6rem; color: #1d4ed8; margin: 0 6px; display: inline-block;">قَالَ</span>
            <span style="font-size: 0.9rem;">(Kâle - Elif'e dönüşüp uzatılır)</span>
        </p>
    </div>

    <div style="background: #fff7ed; border-left: 5px solid #f97316; padding: 14px 16px; margin-bottom: 18px; border-radius: 0 12px 12px 0; box-shadow: 0 2px 8px rgba(249, 115, 22, 0.08);" dir="ltr">
        <h4 style="margin: 0 0 10px 0; color: #c2410c; font-size: 1.05rem; font-weight: 600; border-bottom: 2px solid #fed7aa; padding-bottom: 8px;" dir="ltr">Dilbilgisi İçin Önemi</h4>
        <p style="margin: 0; font-size: 0.92rem; color: #334155; line-height: 1.65;" dir="ltr">
            Cümle kurulumlarında, özellikle mazi (geçmiş), muzari (şimdiki) ve emir kiplerinde fiil çekimleri çekirdek yapıya göre şekillenir.
            <br><br>
            Örneğin; bir fiil <strong style="color: #c2410c;">Misal</strong> (illet harfi başta) ise emir kipinde ilk harfini kaybedebilir:
            <br>
            <span dir="rtl" style="font-family: 'Arakom', sans-serif !important; font-size: 1.6rem; color: #f97316; margin: 0 6px; display: inline-block;">وَجَدَ</span>
            <span style="font-size: 0.9rem;">(Vecede) ➔ Emir:</span>
            <span dir="rtl" style="font-family: 'Arakom', sans-serif !important; font-size: 1.6rem; color: #c2410c; margin: 0 6px; display: inline-block;">جِدْ</span>
            <span style="font-size: 0.9rem;">(Cid)</span>
            <br><br>
            Veya <strong style="color: #c2410c;">Ecvef</strong> (illet harfi ortada) ise çoğul dişil çekimlerinde ortadaki harf tamamen düşebilir:
            <br>
            <span dir="rtl" style="font-family: 'Arakom', sans-serif !important; font-size: 1.6rem; color: #f97316; margin: 0 6px; display: inline-block;">قَالَ</span>
            <span style="font-size: 0.9rem;">(Kâle) ➔ Dişil Çoğul:</span>
            <span dir="rtl" style="font-family: 'Arakom', sans-serif !important; font-size: 1.6rem; color: #c2410c; margin: 0 6px; display: inline-block;">قُلْنَ</span>
            <span style="font-size: 0.9rem;">(Kulne)</span>
        </p>
    </div>

    <p style="margin: 0; font-size: 0.88rem; color: #64748b; font-style: italic; line-height: 1.6; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 18px;" dir="ltr">
        Kısacası bu yedi kategori; kelimenin genetik şifresini çözer, doğru telaffuzu garanti eder ve dilbilgisi istisnalarını kurallaştırır.
    </p>
</div>
`;
}


// === ILK SAYFA ARAMA BUTONU (TELEFON KLAVYELI MOD) ===
// Ana ekrandaki buyutec: Sozluk/arama overlay'ini acar.
// Bu modda bizim Arapca klavye GIZLI; telefonun kendi klavyesi kullanilir
// (alttaki inputa odaklaninca acilir). Ustte iki panel: sagda Sozluk, solda Kokler.
// Kelime detay kartindan (mazi/muzari/emir, tekil/cogul, mustakil) kok baglantisi -> hizli liste.
// Carpiya basilinca kart geri gelsin diye isaretle.
// === HIZLI LISTE: yesil kalip numarasina basinca ilgili fiilin MAZI olumlu/olumsuz cekimi (tam ekran) ===
window._fdmMaziPron = ["O", "O ikisi", "Onlar", "O \u2640", "O ikisi \u2640", "Onlar \u2640", "Sen", "Siz ikiniz", "Siz", "Sen \u2640", "Siz ikiniz \u2640", "Siz \u2640", "Ben", "Biz"];

window.openFdmMazi = function(refId) {
    try {
        var root = (typeof currentRoot !== 'undefined' && currentRoot) ? currentRoot : '';
        if (!root) return;
        var rootData = (typeof sozlukVerileri !== 'undefined') ? sozlukVerileri[root] : null;
        if (!rootData || typeof getBabAndType !== 'function' || typeof VerbGenerator === 'undefined' || typeof babVezinleri === 'undefined') return;

        var bt = getBabAndType(refId);
        var tip = (bt && bt.type) ? bt.type : 'mazi';       // mazi / muzari / emir
        var babNo = (bt && bt.babNo) ? bt.babNo : 1;
        var isColor = (root.length === 3);

        var kalip = babVezinleri[babNo] ? babVezinleri[babNo][tip] : '';
        var baseList = VerbGenerator.generateVerbList(root, babNo, tip, kalip, refId) || [];
        if (!baseList.length) return;
        baseList = baseList.slice(0, (tip === 'emir') ? 6 : 15);

        // Mazi icin Cehd-i Mutlak (لَمْ) muzari meczum listesi gerekir
        var muzForLam = null;
        if (tip === 'mazi') {
            var muBab = babNo, muKalip = babVezinleri[babNo] ? babVezinleri[babNo].muzari : 'يَفْعُلُ', muzariRef = refId + 1;
            if (refId === 1) {
                muzariRef = 2;
                if (rootData[4]) { muzariRef = 4; muBab = 2; if (babVezinleri[2]) muKalip = babVezinleri[2].muzari; }
                else if (rootData[6]) { muzariRef = 6; muBab = 3; if (babVezinleri[3]) muKalip = babVezinleri[3].muzari; }
            } else if (refId === 8) muzariRef = 9;
            else if (refId === 11) muzariRef = 12;
            else if (refId === 14) muzariRef = 15;
            muzForLam = (VerbGenerator.generateVerbList(root, muBab, 'muzari', muKalip, muzariRef) || []).slice(0, 15);
        }

        var tables = (tip === 'mazi') ? ['olumlu','ma','lam','la'] : (tip === 'muzari') ? ['olumlu','la','len'] : ['olumlu','nehiy'];
        var SYM = { olumlu:'+', ma:'مَا', la:'لَا', lam:'لَمْ', len:'لَنْ', nehiy:'لَا' };

        function META(tt){
            if (tt === 'olumlu') return { title: (tip==='mazi'?'Malum Mazi (Olumlu)':tip==='muzari'?'Malum Muzari (Olumlu)':'Emir (Olumlu)'), head:'#27ae60', sub:'#eafaf1', subC:'#1e8449' };
            if (tt === 'ma')    return { title:'Menfi Mazi (مَا)', head:'#e74c3c', sub:'#fcf1f1', subC:'#a94442' };
            if (tt === 'lam')   return { title:'Cehd-i Mutlak (لَمْ)', head:'#d35400', sub:'#fdf2e9', subC:'#ba4a00' };
            if (tt === 'len')   return { title:'Nefy-i İstikbal (لَنْ)', head:'#16a085', sub:'#e8f8f5', subC:'#0e6655' };
            if (tt === 'nehiy') return { title:'Nehiy (Olumsuz Emir)', head:'#e74c3c', sub:'#fcf1f1', subC:'#a94442' };
            // la
            return { title:(tip==='mazi'?'İnkari Mazi / Dua (لَا)':'Menfi Muzari (لَا)'), head:(tip==='mazi'?'#9b59b6':'#e74c3c'), sub:(tip==='mazi'?'#f5eef8':'#fcf1f1'), subC:(tip==='mazi'?'#7d3c98':'#a94442') };
        }
        function rowBg(tt, rowIndex){
            if (rowIndex === 4) return '#f8fafc';
            if (tt === 'olumlu') return (rowIndex % 2 === 0) ? '#e3f2fd' : '#fce4ec';
            if (tt === 'ma' || tt === 'nehiy' || (tt === 'la' && tip === 'muzari')) return (rowIndex % 2 === 0) ? '#ffebee' : '#fbe9e7';
            if (tt === 'la' && tip === 'mazi') return (rowIndex % 2 === 0) ? '#f4ecf7' : '#f5eef8';
            if (tt === 'lam') return (rowIndex % 2 === 0) ? '#fdf2e9' : '#fae5d3';
            if (tt === 'len') return (rowIndex % 2 === 0) ? '#e8f8f5' : '#d1f2eb';
            return '#ffffff';
        }
        function buildTable(tt){
            var list = (tt === 'lam') ? muzForLam : baseList;
            var cellTip = (tt === 'lam') ? 'mazi' : tip;
            var meta = META(tt);
            var total = list.length;
            var h = '<table style="margin:0 auto; width:100%; max-width:560px; border-collapse:separate; border-spacing:0; direction:rtl; box-shadow:0 4px 16px rgba(0,0,0,0.06); border-radius:12px; overflow:hidden;">';
            h += '<thead><tr><th colspan="3" style="background:' + meta.head + '; color:#fff; padding:11px; font-size:1rem; font-weight:800;">' + meta.title + '</th></tr>';
            h += '<tr><th style="padding:6px; font-size:0.78rem; color:#222 !important; font-weight:700; background:' + meta.sub + '; border-bottom:2px solid rgba(0,0,0,0.06);">Müfred</th>'
               + '<th style="padding:6px; font-size:0.78rem; color:#222 !important; font-weight:700; background:' + meta.sub + '; border-bottom:2px solid rgba(0,0,0,0.06);">Tesniye</th>'
               + '<th style="padding:6px; font-size:0.78rem; color:#222 !important; font-weight:700; background:' + meta.sub + '; border-bottom:2px solid rgba(0,0,0,0.06);">Cemi</th></tr></thead><tbody>';
            for (var i = 0; i < total; i += 3) {
                var rowIndex = i / 3;
                var bg = rowBg(tt, rowIndex);
                h += '<tr>';
                for (var j = 0; j < 3; j++) {
                    var idx = i + j;
                    var cell = (idx < total && list[idx] != null && list[idx] !== '') ? window.buildConjCell(list[idx], cellTip, babNo, tt, isColor, root, idx) : '';
                    h += '<td style="background:' + bg + '; padding:14px 5px; text-align:center; border:1px solid rgba(0,0,0,0.03);"><div style="font-family:\'Arakom\',sans-serif; font-size:1.5rem; line-height:1.5; display:flex; justify-content:center; align-items:center;">' + cell + '</div></td>';
                }
                h += '</tr>';
            }
            h += '</tbody></table>';
            return h;
        }

        var pagesHtml = '', btnsHtml = '';
        tables.forEach(function(tt, idx){
            pagesHtml += '<div class="fdm-mazi-page" style="flex:0 0 100%; scroll-snap-align:center; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:14px 12px 24px 12px; box-sizing:border-box;">' + buildTable(tt) + '</div>';
            var meta = META(tt);
            btnsHtml += '<button id="fdm-mazi-t' + idx + '" onclick="_fdmMaziGo(' + idx + ')" data-col="' + meta.head + '" style="border:none; cursor:pointer; padding:8px 16px; border-radius:20px; font-weight:800; font-size:1.05rem; min-width:48px; background:' + (idx===0?meta.head:'#eceff4') + '; color:' + (idx===0?'#fff':'#64748b') + '; font-family:\'Arakom\',sans-serif;">' + SYM[tt] + '</button>';
        });

        var titleTr = (tip === 'mazi') ? 'Mazi Çekimi' : (tip === 'muzari') ? 'Muzari Çekimi' : 'Emir Çekimi';
        var old = document.getElementById('fdm-mazi-overlay'); if (old) old.remove();
        var ov = document.createElement('div');
        ov.id = 'fdm-mazi-overlay';
        ov.style.cssText = 'position:fixed; inset:0; width:100vw; height:100dvh; background:#f4f6fa; z-index:2000000000; display:flex; flex-direction:column; font-family:Inter,-apple-system,sans-serif;';
        ov.innerHTML =
            '<div style="flex-shrink:0; background:#fff; box-shadow:0 2px 10px rgba(0,0,0,0.06); padding:12px 14px; position:relative; display:flex; flex-direction:column; align-items:center; gap:10px;">'
          +   '<div style="display:flex; align-items:center; justify-content:center; gap:10px; width:100%;">'
          +     '<span style="font-family:\'Arakom\',sans-serif; font-size:1.6rem; color:#111; direction:rtl;">' + root.split('').join(' ') + '</span>'
          +     '<span style="font-weight:800; color:#334155; font-size:1.02rem;">' + titleTr + '</span>'
          +     '<i class="fas fa-times" onclick="document.getElementById(\'fdm-mazi-overlay\').remove();" style="position:absolute; right:14px; top:12px; font-size:1.6rem; color:#94a3b8; cursor:pointer;"></i>'
          +   '</div>'
          +   '<div id="fdm-mazi-tabs" style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; direction:rtl;">' + btnsHtml + '</div>'
          + '</div>'
          + '<div id="fdm-mazi-carousel" style="flex:1; min-height:0; display:flex; flex-direction:row; direction:rtl; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory; scroll-behavior:smooth; -webkit-overflow-scrolling:touch;">' + pagesHtml + '</div>';
        document.body.appendChild(ov);

        var car = document.getElementById('fdm-mazi-carousel');
        var pageEls = car.querySelectorAll('.fdm-mazi-page');
        var n = tables.length;
        function _setActive(idx){
            for (var t = 0; t < n; t++){ var el = document.getElementById('fdm-mazi-t' + t); if (el){ var col = el.getAttribute('data-col'); el.style.background = (t===idx) ? col : '#eceff4'; el.style.color = (t===idx) ? '#fff' : '#64748b'; } }
        }
        // RTL: sayfalar sagdan sola dizili; yon-bagimsiz kaydirma icin scrollIntoView kullan.
        window._fdmMaziGo = function(idx){ if (!pageEls[idx]) return; pageEls[idx].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' }); _setActive(idx); };
        car.addEventListener('scroll', function(){
            var cr = car.getBoundingClientRect();
            var center = cr.left + cr.width / 2;
            var best = 0, bestDist = Infinity;
            for (var i = 0; i < pageEls.length; i++){
                var r = pageEls[i].getBoundingClientRect();
                var d = Math.abs((r.left + r.width / 2) - center);
                if (d < bestDist){ bestDist = d; best = i; }
            }
            _setActive(best);
        }, { passive: true });
    } catch (e) { try { console.log('openFdmMazi err', e.message); } catch(_){} }
};

window.openFastListFromWordDetails = function(root) {
    window._fdmReturnToWordDetails = true;
    window._fdmReturnToSearch = false;
    var wo = document.getElementById('word-details-overlay');
    var wm = document.getElementById('word-details-modal');
    if (wo) wo.style.display = 'none';
    if (wm) wm.style.display = 'none';
    if (typeof selectRootFromMainKeyboard === 'function') selectRootFromMainKeyboard(root);
};

window.openMobileSearch = function() {
    try {
        var rod = document.getElementById('rootOfDayOverlay');
        if (rod && typeof window.closeRootOfDay === 'function') window.closeRootOfDay();
    } catch (e) {}
    if (typeof window.openKeyboard === 'function') window.openKeyboard();
    var ov = document.getElementById('keyboard-overlay');
    if (ov) ov.classList.add('native-search-mode');
    var ni = document.getElementById('mobile-native-search');
    if (ni) {
        ni.value = '';
        try { currentRoot = ''; } catch (e) {}
        if (typeof updateTempDisplay === 'function') updateTempDisplay();
        if (typeof updateMainKeyboardPredictions === 'function') updateMainKeyboardPredictions();
        // Kullanici dokunusu icinde odaklan -> telefon klavyesi acilir
        try { ni.focus(); } catch (e) {}
        setTimeout(function(){ try { ni.focus(); } catch (e) {} }, 200);
    }
    if (typeof window._msLockScroll === 'function') window._msLockScroll();
};

// Arama acikken sayfa kaymasin: body'yi sabitle (yazılınca yukari kaymayi onler)
window._msLockScroll = function() {
    if (window._msScrollLocked) return;
    window._msSavedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = (-window._msSavedScrollY) + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    window._msScrollLocked = true;
};
window._msUnlockScroll = function() {
    if (!window._msScrollLocked) return;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, window._msSavedScrollY || 0);
    window._msScrollLocked = false;
};
