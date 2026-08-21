
window.isAtlasFullscreen = false;

window.colorizeArabicWord = function(word, root) {
    if (typeof word !== 'string' || typeof root !== 'string') return word || '';
    
    // Extract root letters as array
    let rootChars = root.replace(/[^\u0621-\u064A]/g, '').split('');
    
    // Eğer kök 3 harfli değilse standart renklendirme motorunu kullanılamaz, kelimeyi düz döndür.
    // (ColorEngine genelde 3 harfliler için optimize edilmiştir)
    if (rootChars.length !== 3) {
        // Fallback: eski basit renklendiriciyi sadece 4+ harfli kökler için koru veya düz dön
        return word; 
    }

    // Kelimenin içindeki boşlukları korumak için boşluklara göre bölelim, 
    // her kelimeyi ColorEngine ile renklendirip tekrar boşlukla birleştirelim.
    if (typeof ColorEngine !== 'undefined' && typeof ColorEngine.colorize === 'function') {
        let words = word.split(/\s+/);
        let coloredWords = words.map(w => {
            if (!w) return "";
            // Eğer kelimede hiç Arapça harf yoksa (örn: noktalama işareti), dokunma
            if (!/[\u0600-\u06FF]/.test(w)) return w;
            
            // YENİ: ColorEngine.colorize'ın gerektirdiği font-size sorunlarını aşmak için,
            // srf-word sınıfından gelebilecek sorunları önlemek adına düz HTML döndürecek bir mini sargı yapabiliriz.
            // Fakat ColorEngine.colorize zaten `<span class="srf-word" dir="rtl">...</span>` dönüyor,
            // Bu span inline-flex olduğu için kelime bazında yan yana duracaktır.
            // CSS'de srf-word içindeki font-size miras (inherit) alınır, bu sayede tablo dışındaki
            // clamp(..) vb. font-size tanımları çalışmaya devam eder!
            return ColorEngine.colorize(w, rootChars);
        });
        
        return coloredWords.join(' ');
    }
    
    return word;
};

/* HIZLANDIRMA: colorizeArabicWord saf bir işlev (aynı kelime + aynı kök
   hep aynı HTML'i verir) ama içinde ColorEngine harf harf çalışıyor.
   Sözlük ve liste ekranlarında yüzlerce kart çizilirken aynı kelimeler
   tekrar tekrar renklendiriliyordu; sonucu önbelleğe alıyoruz. */
(function () {
    var ham = window.colorizeArabicWord;
    var onb = new Map();
    window._renkOnbellek = onb;
    window.colorizeArabicWord = function (word, root) {
        if (typeof word !== 'string' || typeof root !== 'string') return ham(word, root);
        var k = root + '' + word;
        var v = onb.get(k);
        if (v === undefined) {
            v = ham(word, root);
            if (onb.size < 60000) onb.set(k, v);
        }
        return v;
    };
})();

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
    'قرأ': 'قَرَأَ',
    'ظنّ': 'ظَنَّ',
    'وجد': 'وَجَدَ',
    'قال': 'قَالَ',
    'نسي': 'نَسِيَ',
    'علّم': 'عَلَّمَ',
    'اعترف': 'اِعْتَرَفَ',
    'انقلب': 'اِنْقَلَبَ',

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

// --- AUTO-FILL TEKIL ID FOR PLURALS ---
(function autoLinkPluralsAndSingulars() {
    if (typeof sozlukVerileri === 'undefined') return;
    for (let root in sozlukVerileri) {
        let entry = sozlukVerileri[root];
        if (!entry) continue;
        
        Object.keys(entry).forEach(k => {
            if (k === 'rootType' || k === 'anlam' || k === 'isDictOnly') return;
            let kalipData = entry[k];
            if (!kalipData || typeof kalipData !== 'object') return;
            
            if (kalipData.cogulId) {
                let pIds = String(kalipData.cogulId).split(',');
                pIds.forEach(pId => {
                    pId = pId.trim();
                    if (entry[pId]) {
                        entry[pId].tekilId = k;
                    } else if (sozlukVerileri[pId]) {
                        sozlukVerileri[pId].tekilId = k;
                    }
                });
            }
            
            Object.keys(kalipData).forEach(sKey => {
                if (sKey === 'base' || sKey === 'ornek' || sKey === 'cogulId' || sKey === 'suggestsPlus' || sKey === 'tekilId' || sKey === 'autoGenerated' || sKey === 'isDictOnly' || sKey === 'tip') return;
                let sufData = kalipData[sKey];
                if (sufData && typeof sufData === 'object' && sufData.cogulId) {
                    let pIds = String(sufData.cogulId).split(',');
                    pIds.forEach(pId => {
                        pId = pId.trim();
                        if (entry[pId]) {
                            entry[pId].tekilId = k + '+' + sKey;
                        } else if (sozlukVerileri[pId]) {
                            sozlukVerileri[pId].tekilId = k + '+' + sKey;
                        }
                    });
                }
            });
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
        <div style="color: #2980b9; font-size: 1.6rem; margin-bottom: 20px; font-weight: normal; text-transform: uppercase; letter-spacing: 1px;"><i class="fas fa-table"></i> Zamir Çekim Tablosu</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            <div style="background: #ffffff; padding: 10px; border-radius: 10px; color: #555; border: 1px solid rgba(0,0,0,0.05); font-weight: normal;">Tekil (Müfred)</div>
            <div style="background: #ffffff; padding: 10px; border-radius: 10px; color: #555; border: 1px solid rgba(0,0,0,0.05); font-weight: normal;">İkil (Müsenna)</div>
            <div style="background: #ffffff; padding: 10px; border-radius: 10px; color: #555; border: 1px solid rgba(0,0,0,0.05); font-weight: normal;">Çoğul (Cemi')</div>
            
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


function getKalipFromRootData(rootData, keyStr) {
    if (!keyStr) return null;
    let keyStrString = keyStr.toString();
    if (keyStrString.includes('+')) {
        let parts = keyStrString.split('+');
        let baseNum = parseInt(parts[0], 10);
        let suffix = parts[1];
        if (rootData[baseNum] && rootData[baseNum][suffix]) {
            let innerObj = rootData[baseNum][suffix];
            return Object.assign({}, innerObj, { base: innerObj });
        }
    }
    return rootData[keyStrString] || rootData[parseInt(keyStrString, 10)];
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
            displayTitle += `<div onclick="document.getElementById('word-details-overlay').style.display='none'; document.getElementById('word-details-modal').style.display='none'; openCategoryFromModal('${tip}')" style="display:inline-flex; align-items:center; background: rgba(255,255,255,0.8); padding: 8px 20px; margin: 0 5px; border-radius: 50px; border: 1px solid rgba(189, 195, 199, 0.5); box-shadow: 0 2px 5px rgba(0,0,0,0.05); cursor:pointer; transition: 0.3s;" onmouseover="this.style.transform='scale(1.05)';" onmouseout="this.style.transform='scale(1)';" title="Bu listeyi aç"><span style="color:#333; font-size:1.3rem; font-weight: normal;  letter-spacing:1px;" dir="ltr">${thematicCategoriesData[tip].icon} ${trT} <i class="fas fa-external-link-alt" style="font-size: 1.0rem; margin-left: 5px;"></i></span></div>`;
        }
    });


    
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
                            onclick="document.getElementById('word-details-overlay').style.display='none'; document.getElementById('word-details-modal').style.display='none'; selectRootFromMainKeyboard('${compactRoot}');" title="Vezin Tablosu">
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
            let muhurHtml = `<div style="position:absolute; top:-15px; left:15px; background-color:#27ae60; color:white; padding:5px 20px; border-radius:20px; font-weight: normal; font-size:1.3rem; box-shadow:0 4px 10px rgba(0,0,0,0.4); border:2px solid rgba(255,255,255,0.8); transform:rotate(-10deg); z-index:20; font-family: 'Arakom', sans-serif; text-shadow:0 1px 2px rgba(0,0,0,0.5); letter-spacing:1px;">FİİL</div>`;
            let rootDisplay = `<div style="position:absolute; top:-15px; right:15px; background-color:#e74c3c; color:white; padding:5px 15px; border-radius:20px; font-weight: normal; font-size:1.1rem; box-shadow:0 4px 10px rgba(0,0,0,0.4); border:2px solid rgba(255,255,255,0.8); transform:rotate(5deg); z-index:20; font-family: 'Inter', sans-serif; text-shadow:0 1px 1px rgba(0,0,0,0.3);">Kök: ${rootKey}</div>`;
            htmlContent += `<div style="position:relative; width:100%;">`;
            htmlContent += muhurHtml;
            htmlContent += rootDisplay;
            htmlContent += `<div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:20px; text-align:center;">`;
            const verbCards = [
                { id: maziId, label: "Mazi", color: "#f39c12" },
                { id: muzariId, label: "Muzari", color: "#3498db" },
                { id: emirId, label: "Emir", color: "#e74c3c" }
            ];
            verbCards.forEach(card => {
                let rData = rootData[card.id] || { base: {} };
                
                let emoji = (rData.base && rData.base.emoji) ? `<div style="font-size:${window.isAtlasFullscreen ? "clamp(2.4rem, 4vh, 4.5rem)" : "clamp(4.0rem, 6.0vw, 8.0rem)"}; margin-bottom:15px;">${rData.base.emoji}</div>` : '';
                let trText = (rData.base && rData.base.trText) ? `<div style="color:#555; font-size:1.2rem; font-weight: normal; margin-top:20px; letter-spacing:0.5px;" dir="ltr">${rData.base.trText}</div>` : '';
                let arText = (rData.base && rData.base.arText) ? rData.base.arText : "";
                
                if (!arText && typeof generateTuremis === "function") {
                    arText = generateTuremis(rootKey, card.id);
                }

                htmlContent += `
                <div style="background:#ffffff; padding:30px 10px; border-radius:15px; border:1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <div style="color:${card.color}; font-size:${window.isAtlasFullscreen ? "clamp(1.2rem, 2vh, 2rem)" : "clamp(1.5rem, 2vw, 2.5rem)"}; font-weight: normal; margin-bottom:15px;" dir="ltr">${card.label}</div>
                    ${emoji}
                    <span style="display:block; font-family:'Arakom', sans-serif; font-size:${window.isAtlasFullscreen ? "clamp(2.4rem, 4vh, 4.5rem)" : "clamp(4.0rem, 6.0vw, 8.0rem)"}; color:#1a1a1a; text-shadow:0 1px 3px rgba(0,0,0,0.1);">${typeof colorizeArabicWord === 'function' ? colorizeArabicWord(arText, rootKey) : arText}</span>
                    ${trText}
                </div>`;
            });
            htmlContent += `</div></div>`;
        } else {
            let itemClicked = getKalipFromRootData(rootData, kalipKeyStr);
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
                    itemCogul = getKalipFromRootData(rootData, itemClicked.cogulId);
                }
            } else if (itemClicked && itemClicked.tekilId) {
                itemTekil = getKalipFromRootData(rootData, itemClicked.tekilId);
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
                muhurHtml = `<div style="position:absolute; top:-15px; left:15px; background-color:${anaRenk}; color:white; padding:5px 20px; border-radius:20px; font-weight: normal; font-size:1.3rem; box-shadow:0 4px 10px rgba(0,0,0,0.4); border:2px solid rgba(255,255,255,0.8); transform:rotate(-10deg); z-index:20; font-family: 'Arakom', sans-serif; text-shadow:0 1px 2px rgba(0,0,0,0.5); letter-spacing:1px;">${anaTur}</div>`;
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
                                        <div style="font-family:'Arakom', sans-serif; font-size:clamp(3.0rem, 4.0vw, 5.0rem); color:#d35400; margin-bottom:15px; line-height:1.4;" dir="rtl">${ornek.ar}</div>
                                        <div style="color:#7f8c8d; font-size:${window.isAtlasFullscreen ? "clamp(1.6rem, 2.5vh, 2.5rem)" : "clamp(1.8rem, 2.5vw, 3.0rem)"}; font-weight: normal;" dir="ltr">${ornek.tr}</div>
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

            let hasSeparator = (tekilAr && secondColAr);
            
            htmlContent += `
            <div style="width:100%; text-align:center; background:#ffffff; padding:40px 20px; border-radius:15px; border:1px solid rgba(0,0,0,0.05); box-shadow: 0 8px 30px rgba(0,0,0,0.1);">
                ${(!hasSeparator && emoji) ? `<div style="font-size:5rem; margin-bottom:15px;">${emoji}</div>` : ''}
                ${titleHtml}
                
                <div style="display:flex; justify-content:center; align-items:flex-start; gap:25px; flex-wrap:wrap; direction:rtl;">
                    ${tekilAr ? `
                    <div style="display:flex; flex-direction:column; align-items:center; max-width:600px; flex: 1; min-width:300px;">
                        ${firstColLabel ? `<div style="background:rgba(0, 0, 0, 0.05); color:#333; padding:6px 18px; border-radius:20px; border:1px solid rgba(0, 0, 0, 0.1); font-size:1.1rem; margin-bottom:15px; font-weight: normal; letter-spacing:1px;  box-shadow:0 2px 5px rgba(0,0,0,0.05);">${firstColLabel.toLocaleUpperCase("tr-TR")}</div>` : ''}
                        <span style="font-family:'Arakom', sans-serif; font-size:clamp(5.0rem, 7.0vw, 9.0rem); color:#1a1a1a; text-shadow:0 1px 3px rgba(0,0,0,0.1); line-height: 1.2;">${typeof colorizeArabicWord === 'function' ? colorizeArabicWord(tekilAr, rootKey) : tekilAr}</span>
                        ${tekilTr ? `<span style="color:#555; font-size: clamp(1.6rem, 2.5vw, 2.2rem); margin-top:10px; text-align:center; line-height: 1.4; font-weight: normal;" dir="ltr">${tekilTr}</span>` : ''}
                    </div>` : ''}
                    
                    ${hasSeparator ? `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:flex-start; margin-top: 10px;">
                        ${emoji ? `<div style="font-size:3.5rem; margin-bottom:5px;">${emoji}</div>` : ''}
                        <span style="font-family:'Arakom', sans-serif; font-size:clamp(5.0rem, 7.0vw, 9.0rem); color:#e1b12c; margin: 0 15px; opacity:0.9; line-height: 1.2;">${separator}</span>
                    </div>` : ''}
                    
                    ${secondColAr ? `
                    <div style="display:flex; flex-direction:column; align-items:center; max-width:600px; flex: 1; min-width:300px;">
                        ${secondColLabel ? `<div style="background:rgba(46,204,113,0.15); color:#27ae60; padding:6px 18px; border-radius:20px; border:1px solid rgba(46,204,113,0.3); font-size:1.1rem; margin-bottom:15px; font-weight: normal; letter-spacing:1px;  box-shadow:0 2px 5px rgba(0,0,0,0.05);">${secondColLabel.toLocaleUpperCase("tr-TR")}</div>` : ((isRenk || isSayi) ? `<div style="color:#c0392b; font-size:1.1rem; margin-bottom:10px; font-weight: normal;">${secondColTr}</div>` : '')}
                        <span style="font-family:'Arakom', sans-serif; font-size:clamp(5.0rem, 7.0vw, 9.0rem); color:#1a1a1a; text-shadow:0 1px 3px rgba(0,0,0,0.1); line-height: 1.2;">${typeof colorizeArabicWord === 'function' ? colorizeArabicWord(secondColAr, rootKey) : secondColAr}</span>
                        ${(!(isRenk || isSayi) && secondColTr) ? `<span style="color:#555; font-size: clamp(1.6rem, 2.5vw, 2.2rem); margin-top:10px; text-align:center; line-height: 1.4; font-weight: normal;" dir="ltr">${secondColTr}</span>` : ''}
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


/* HIZLANDIRMA: stripHarakat sayfanın en sık çağrılan işlevi (sözlük
   taramasında tuş başına on binlerce kez). Saf bir işlev olduğu için
   sonuçları önbelleğe alıyoruz; sözlükteki kelime sayısı sınırlı
   olduğundan önbellek doğal olarak küçük kalır, yine de bir tavan var. */
window._harekeOnbellek = new Map();
window.stripHarakat = function(text) {
    if (!text || typeof text !== "string") return "";
    var c = window._harekeOnbellek;
    var v = c.get(text);
    if (v === undefined) {
        v = text.replace(/[ً-ْٰ]/g, '');
        if (c.size < 120000) c.set(text, v);
    }
    return v;
};

// ==================================================================
// YENİ KÖK SEÇİM SİSTEMİ (POPUP KLAVYE + TAHMİN)
// ==================================================================

let typingTimer;
currentRoot = ""; 
window.activeConfirmedRoot = "";

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
    if (typeof closeSlideMenu === 'function') closeSlideMenu();
    if (typeof closeKeyboard === 'function') closeKeyboard(); // Eski klavyeyi kapat
    
    // YENİ KLAVYEYİ KESİN OLARAK KAPAT
    const popup = document.getElementById('integrated-keyboard-popup');
    const backdrop = document.getElementById('keyboard-backdrop'); 
    if (popup) popup.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove("keyboard-active");

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
        if (currentSearchQuery.length < 15) { // Kullanıcılar artık kelime arayabildiği için sınırı 15 harfe çıkarıyoruz
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
        // Kullanıcı isteği: Sayı ve sıra sayıları sözlük aramasında çıkmasın
        const matches = allRoots.filter(r => r.startsWith(filter) && !r.startsWith("Sayı:") && !r.startsWith("Sıra:")).slice(0, 15);
        
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
    
    /* Yumuşak beliriş: çekim tabloları arka planda hazırlanıp yüzen
       simge ekrana geldiğinde çalıyor. İki hafif sinüs, alçak sesle
       yukarı doğru — dikkat çeker ama dersi bölmez. */
    playYumusak() {
        this.init();
        const now = this.ctx.currentTime;
        [[523.25, 0], [783.99, 0.09]].forEach(([hz, gec]) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(hz, now + gec);
            gain.gain.setValueAtTime(0, now + gec);
            gain.gain.linearRampToValueAtTime(0.035, now + gec + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0008, now + gec + 0.32);
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(now + gec); osc.stop(now + gec + 0.36);
        });
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

/* BÜYÜTMEYİ KAPATAN KIRMIZI ÇARPI — araç çubuğunun hemen altında.
   Büyütme açıkken bir vezne dokununca ekranı dev kelime kaplıyordu ve
   kapatmak için "bir yere" tıklamak gerekiyordu; nereye basılacağı belli
   değildi. Artık tek kapatma yeri bu düğme (Geylani: "araç çubuğunun
   altında bi kırmızı çarpı olsun, sadece oraya basınca büyüme
   kapansın"). */
window.fdmBuyutmeKapatDugmesi = function (goster) {
    var b = document.getElementById('fdm-buyutme-kapat');
    if (!goster) { if (b && b.parentNode) b.parentNode.removeChild(b); return null; }
    if (b) return b;
    b = document.createElement('button');
    b.id = 'fdm-buyutme-kapat';
    b.type = 'button';
    b.className = 'fdm-buyutme-kapat';
    b.title = 'Büyütmeyi kapat';
    b.setAttribute('aria-label', 'Büyütmeyi kapat');
    b.innerHTML = '&#10005;';
    b.onclick = function (e) {
        e.preventDefault(); e.stopPropagation();
        if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();
        window.fdmBuyutmeKapatDugmesi(false);
    };
    var cubuk = document.querySelector('.top-bar') || document.getElementById('tabSwitch');
    var r = cubuk ? cubuk.getBoundingClientRect() : null;
    b.style.top = Math.round((r && r.bottom > 0 ? r.bottom : 66) + 10) + 'px';
    document.body.appendChild(b);
    return b;
};

// Temizlik fonksiyonu
function closeAllZoomedBoxes() {
    document.querySelectorAll('.zoom-overlay').forEach(overlay => {
        overlay.classList.remove('active');
    });
    if (window.fdmBuyutmeKapatDugmesi) window.fdmBuyutmeKapatDugmesi(false);
    
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

        /* Eski surumde lastWheelTime/wheelCooldown hic tanimlanmamisti:
           her yatay tekerlek olayi sessiz ReferenceError firlatiyor ve
           mucerred<->mezid tekerlek gecisi HIC calismiyordu. Tanimlandi. */
        let lastWheelTime = 0;
        const wheelCooldown = 600;
        sliderContainer.addEventListener('wheel', (e) => {
            if (window.isAtlasMode) return;   /* atlas acikken tablo kaydirici karismasin */
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
    if (!e || !e.target || !e.target.closest) return;
    /* BURASI ÖNEMLİ: '#suffix-dropdown' menüsünü de kutu içi (güvenli) sayıyoruz!
       DOKUNMATİK DÜZELTMESİ (Geylani): araç çubuğundaki "+" simgesinin
       onclick'inde event.stopPropagation() var; bu yüzden FARE ile basınca
       bu dinleyici hiç çalışmıyor ve büyütme korunuyordu. Ama touchstart
       durdurulmadığı için PARMAKLA basınca burası tetiklenip büyümeyi
       kapatıyordu. "+" düğmeleri ile büyük klon da artık kutu içi sayılır. */
    const isInside = e.target.closest('.conjugation-inline-container') ||
                     e.target.closest('.glass-box') ||
                     e.target.closest('#suffix-dropdown') ||
                     e.target.closest('.crisp-zoom-clone') ||
                     e.target.closest('#crisp-zoom-clone') ||
                     e.target.closest('#vg-kumanda') ||        /* ileri/geri kumandası */
                     e.target.closest('.fa-plus') ||
                     e.target.closest('#mobile-top-plus');

    /* BÜYÜTMEDE DIŞARI TIKLAMAK KAPATMAZ. Dev kelime yalnız araç
       çubuğunun altındaki kırmızı ✕ ile ya da ileri/geri tuşuyla
       kapanıyor; kumandayı taşımak, boşluğa dokunmak kapatmıyor
       (Geylani: "sadece çarpı veya ileri tuşuyla büyüme kapansın"). */
    const buyutmeKutusu = document.getElementById('zoomToggleCheckbox');
    if (buyutmeKutusu && buyutmeKutusu.checked && document.getElementById('crisp-zoom-clone')) return;

    if (!isInside) {
        // COKLU POPUP: disariya tiklayinca fiil popuplari KAPANMASIN (sadece X ile kapanir).
        // Sadece buyumus kutu (zoom) varsa kapat.
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

/* =========================================================================
   SEKME BANDI YALNIZ GERÇEK SEKME DEĞİŞİMİNDE KAYAR
   -------------------------------------------------------------------------
   Bant iki tabloyu yan yana tutar ve MEZİD'de translateX(50%) ile durur.
   Geçiş her zaman açık olduğu için, transform'u DEĞİŞTİREN her şey 1,5
   saniyelik yatay bir kayma başlatıyordu — sekme değişimi olmasa bile:
     · pencere eni değişince (tam ekrana girip çıkma),
     · body.mezid-odak sınıfı eklenip kalkınca (o sınıf bandı
       `transform:none`a çekiyor; vezin kapanırken sınıf kalkınca bant
       eski yerine KAYARAK dönüyordu — ekranda satırın aşağı inmesi
       yerine sayfanın sola geçmesi olarak görülüyordu).
   Çözüm: geçiş varsayılan olarak KAPALI; yalnız setTab çağrıldığında,
   kayma süresi boyunca açılıyor. Başka hiçbir düzen değişikliği bandı
   oynatamaz.
   ========================================================================= */
var _bandiZaman = null;
function bandiKaydir() {
    var band = document.getElementById('mainSliderBandi');
    var sw = document.getElementById('tabSwitch');
    if (band) band.classList.add('bandi-kayar');
    if (sw) sw.classList.add('bandi-kayar');
    clearTimeout(_bandiZaman);
    _bandiZaman = setTimeout(function () {
        if (band) band.classList.remove('bandi-kayar');
        if (sw) sw.classList.remove('bandi-kayar');
        _bandiZaman = null;
    }, 1700);
}

function setTab(tabIndex, noSound = false) {
    if (!noSound && typeof SoundEngine !== "undefined") SoundEngine.playClick(); 
    bandiKaydir();                 /* geçişi yalnız bu kayma için aç */
    const band = document.getElementById('mainSliderBandi');
    const switcher = document.getElementById('tabSwitch');
    
    currentTabActive = tabIndex;
    /* ÖTEKİ SEKMENİN ÇEKİM TABLOLARI GÖRÜNMESİN.
       Tablo `position: fixed`; sekme bandı da dönüşümle kaydığından
       mücerredde açılmış bir tablo mezide geçilince ekranda kalıyordu
       (Geylani: "mücerred kısmındaki fiil çekim popupları mezid kısmında
       çıkıyor"). Kapatmıyoruz, yalnız gizliyoruz: sekmeye dönünce
       oldukları gibi duruyorlar. */
    document.body.classList.toggle('fdm-mezid-sekme', tabIndex === 1);
    if (window.fdmTahtaSekmeTazele) window.fdmTahtaSekmeTazele();

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
    window.activeConfirmedRoot = trimmedRoot;
    
    // KESİN ÇÖZÜM: Tablo sıfırlandıktan ve yeni kök hafızaya alındıktan SONRA vurguyu zorla kapat!
    if (typeof toggleRootHint === 'function') toggleRootHint(false);

    
    if (typeof closeVerbModal === 'function') closeVerbModal();
    if (typeof highlightEasterEggBoxes === 'function') highlightEasterEggBoxes(currentRoot);
    if (typeof autoSpawnRootClone === 'function') autoSpawnRootClone();
    if (typeof currentTabActive !== 'undefined' && currentTabActive === 1 && typeof setTab === 'function') setTab(0);
    
    // YENİ: Mezid sekmesinde kelime var mı kontrolü
    const mezidBtn = document.querySelector('.mezid-btn');
    if (mezidBtn) {
        mezidBtn.classList.remove('heartbeat-active');
        if (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[currentRoot]) {
            const hasMezid = Object.keys(sozlukVerileri[currentRoot]).some(ref => parseInt(ref) >= 52);
            if (hasMezid && (typeof currentTabActive === 'undefined' || currentTabActive === 0)) {
                mezidBtn.classList.add('heartbeat-active');
            }
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
            
            // COKLU POPUP: baska fiil popuplarini KAPATMA (sadece X ile kapanir).
            
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
    if (window.fdmKokLevhaTazele) window.fdmKokLevhaTazele();
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
    
    /* Çarpı artık HÜCRENİN kendi çarpısı: yalnız o tabloyu kaldırır,
       ızgarayı sıkıştırır, son tablo da kapandıysa tahtayı siler. */
    const hucre = btnElement.closest ? btnElement.closest('.fdm-hucre') : null;
    if (hucre) { fdmHucreKapat(hucre); return; }
    /* Eski yol (kutunun içindeki tablo) — geriye dönük güvence */
    const boxElement = btnElement.closest('.glass-box');
    if (boxElement) {
        boxElement.classList.add('no-transition');
        boxElement.classList.remove('matrix-opened');
        boxElement.style.zIndex = "";
        setTimeout(() => {
            boxElement.classList.remove('no-transition');
        }, 50);
    }
    if (window.fdmKokLevhaTazele) window.fdmKokLevhaTazele();

    // Çarpıya basınca aktif kutu seçimini kaldır ki Hızlı Liste'de + sızıntısı olmasın
    lastClickedBoxTextSpan = null;
    const desktopPlus = document.querySelector('.fa-plus');
    const mobilePlus = document.getElementById('mobile-top-plus');
    if (desktopPlus) desktopPlus.classList.remove('plus-highlighted');
    if (mobilePlus) mobilePlus.classList.remove('plus-highlighted');
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

    // COKLU POPUP: acik fiil popuplari otomatik KAPANMASIN (sadece kendi X'i ile kapanir).
    document.querySelectorAll('.glass-box:not(.matrix-opened)').forEach(box => { box.style.zIndex = "1"; });

    boxElement.classList.add('no-transition'); 
    boxElement.classList.remove("pulse-highlight");
    boxElement.style.transform = "";
    void boxElement.offsetWidth; 
    setTimeout(() => { if (boxElement) boxElement.classList.remove('no-transition'); }, 50);

    // YENİ: Farklı bir kalıba geçildiğinde eski + vurgusunu temizle ve yeni kutu için + kontrolü yap
    const desktopPlus = document.querySelector('.fa-plus');
    const mobilePlus = document.getElementById('mobile-top-plus');
    if (desktopPlus) desktopPlus.classList.remove('plus-highlighted');
    if (mobilePlus) mobilePlus.classList.remove('plus-highlighted');
    if (typeof checkWordEasterEgg === 'function') {
        checkWordEasterEgg(boxElement);
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
    }

    let tablesToRender = [];
    if (isVerb && typeof kelimeListesi[0] !== 'object') {
        if (tip === 'mazi') tablesToRender = ['olumlu', 'ma', 'lam', 'la'];
        else if (tip === 'muzari') tablesToRender = ['olumlu', 'la', 'len'];
        else if (tip === 'emir') tablesToRender = ['olumlu', 'nehiy'];
    }

    let hasCarousel = tablesToRender.length > 1;

    /* HÜCRE BAŞLIĞI: hangi kalıbın hangi çekimi olduğu, kendi tam ekranı
       ve kendi kapatması. Sürükleme, büyütme ve genel kapatma artık
       TAHTANIN işi (aşağıdaki fdmTahta). */
    var TIP_AD = { mazi: 'MÂZÎ', muzari: 'MUZÂRİ', emir: 'EMİR', isim: 'İSİM' };
    /* ROZET: tablo mücerredden mi mezidden mi geldi? Sayfanın kendi
       diliyle: 3 (üç harfli) · 3+ (mezid). Fiil oldukları için dolgu
       YEŞİL — sayfadaki fiil başlıklarının yeşiliyle aynı. */
    var sekmeKabi0 = boxElement.closest ? boxElement.closest('.tab-content') : null;
    var rozet = (sekmeKabi0 && sekmeKabi0.id === 'tab2') ? '3+' : '3';
    var grup = fdmFiilGrubu(boxElement);
    let html = `
        <div class="fdm-hucre-bas">
            <span class="fdm-hucre-rozet" title="${rozet === '3+' ? 'Mezid fiil' : 'Üç harfli (mücerred) fiil'}"><bdi>${rozet}</bdi></span>
            ${grup.ad ? `<span class="fdm-hucre-fiil" title="Bu satırın fiili"><bdi>${grup.ad}</bdi></span>` : ''}
            <span class="fdm-hucre-ad">${refId ? refId + ' · ' : ''}${TIP_AD[tip] || 'ÇEKİM'}</span>
            <span class="fdm-hucre-anlam"></span>
            <span class="fdm-hucre-tus">
                <button type="button" class="fdm-hucre-btn matrix-expand-btn" title="Bu tabloyu tam ekran"
                        aria-label="Bu tabloyu tam ekran" onclick="openMatrixFullscreen(event, this)">&#10530;</button>
                <button type="button" class="fdm-hucre-btn fdm-hucre-x matrix-close-btn" title="Bu tabloyu kapat"
                        aria-label="Bu tabloyu kapat" onclick="closeInlineMatrix(event, this)">&#10005;</button>
            </span>
        </div>
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
                /* Birden fazla tablo varsa şerit elle çekilmiyor: sayfa
                   geçişi oklara ait, sürükleme tahtayı gezmeye. */
                var tk = wrapper.closest('.fdm-tahta');
                if (tk && (tk.classList.contains('fdm-coklu') || tk.classList.contains('fdm-odak'))) return;
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

            /* ---- DİZÜSTÜ DOKUNMATİK YÜZEYİ (touchpad) ile SAĞ/SOL ----
               İki parmakla YANA kaydırmak, sağ/sol oklarına basmakla aynı
               işi yapıyor: tam BİR tablo ilerliyor, yapışma noktasına
               oturuyor (Geylani: "touchbar kısmıyla rahatlıkla sağ sol
               oklarına basar gibi gezebilmeliyiz").
               Yalnız YATAY niyet dinleniyor (|deltaX| > |deltaY|); dikey
               kaydırma uzun tablonun kendi içinde kalıyor. Bir jestte tek
               sayfa: eşik + kilit, savurmanın üç tablo birden atlamasını
               önlüyor. */
            var tekerKilit = false, tekerBirikim = 0, tekerSaat = null;
            wrapper.addEventListener('wheel', function (e) {
                if (e.ctrlKey) return;                                  /* kıstırma: tahtaya bırak */
                /* BİRDEN FAZLA TABLO AÇIKSA yatay kaydırma tablolar arası
                   GEZİNMEYE ayrılıyor; olumlu ↔ olumsuz geçişi yalnız
                   oklarla yapılıyor (Geylani: "diğer tabloya geçmek
                   isteyebilirim; sadece bi fiil çekimi popup açıksa
                   dokunmatikle olumsuzlara geçebilsin"). Yakınlaşılmış
                   tahtada da aynı kural. */
                var tk = wrapper.closest('.fdm-tahta');
                if (tk && (tk.classList.contains('fdm-coklu') || tk.classList.contains('fdm-odak'))) return;
                if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;   /* dikey: tabloya bırak */
                if (wrapper.scrollWidth <= wrapper.clientWidth + 4) return;  /* tek tablo */
                e.preventDefault();                       /* sayfa yana kaymasın */
                if (tekerKilit) return;
                tekerBirikim += e.deltaX;
                clearTimeout(tekerSaat);
                tekerSaat = setTimeout(function () { tekerBirikim = 0; }, 260);
                if (Math.abs(tekerBirikim) < 26) return;
                var yon = tekerBirikim > 0 ? 1 : -1;
                tekerBirikim = 0;
                tekerKilit = true;
                wrapper.style.scrollSnapType = 'x mandatory';
                wrapper.scrollBy({ left: yon * wrapper.clientWidth, behavior: 'smooth' });
                setTimeout(function () { tekerKilit = false; }, 430);
            }, { passive: false });

            /* DOKUNMATİKTE EL SÜRÜKLEMESİ YOK — TARAYICI KAYDIRIR.
               Şerit zaten `overflow-x: auto` + `scroll-snap-type: x
               mandatory`: parmakla kaydırınca tarayıcı hem kendi
               kaydırmasını yürütüyor hem de aşağıdaki elle kaydırma
               `scrollLeft`i aynı anda yazıyordu. İki kaynak birbirini
               eziyor, tablolar arası geçiş takılıyor, kimi zaman iki
               tablonun ortasında kalıyordu (Geylani: "tablolar arası
               dokunmatik geçiş yeterince stabil değil"). Üstelik
               `e.touches[0]` tek parmağı okuduğu için iki tabloyu aynı
               anda kaydırmak da bozuluyordu.
               Fare sürüklemesi (masaüstünde tut-çek) olduğu gibi duruyor;
               dokunmatikte tarayıcının kendi ivmeli kaydırması ve
               yapışma noktaları devrede — hem daha akıcı, hem çok
               parmakla aynı anda birden çok tabloda çalışıyor. */
        };

        window.scrollConjugationCarouselDefined = true;
    }

    /* ================= TEK TAHTA, YAN YANA TABLOLAR =================
       Her çekim tablosu ayrı bir pencere değil; hepsi TEK bir tahtanın
       ızgarasında duruyor (Geylani: "ayrı ayrı iki tablo yerine tek
       konteynır, yan yana olsun").

       SÜTUNLAR — Arapçanın yönünde, sağdan sola:
           MAZİ (en sağ) · MUZÂRİ · EMİR · İSİM
       Hangi kalıptan açılırsa açılsın tablo kendi sütununa gider; aynı
       türden ikinci bir tablo açılırsa BİR ALT SATIRA iner. Böylece
       mezidde "üç bâbın mazisi yan yana, altlarında muzârileri" gibi
       karşılaştırmalar tek ekranda kuruluyor.

       TAHTANIN KENDİSİ tek pencere: bir sürükleme şeridi, iki düğme
       (kapat · ekrana sığdır) ve sekiz büyütme tutamağı ONDA. Tahta
       oransal büyüyor, yani bütün tablolar ve yazılar birlikte. Boş
       alandan tutup sürüklemek de tahtayı gezdiriyor — büyük bir
       görselde gezer gibi. */
    var tahta = fdmTahta();
    var izgara = tahta.querySelector('.fdm-izgara');
    var hucreAnahtar = 'k' + refId + '_' + (boxElement.dataset.fdmNo ||
        (boxElement.dataset.fdmNo = String(++window._fdmKutuNo)));

    let inlineContainer = izgara.querySelector('.fdm-hucre[data-anahtar="' + hucreAnahtar + '"]');
    var yeniHucre = !inlineContainer;
    if (yeniHucre) {
        inlineContainer = document.createElement('div');
        inlineContainer.className = 'conjugation-inline-container fdm-hucre';
        inlineContainer.setAttribute('data-anahtar', hucreAnahtar);
        inlineContainer.setAttribute('data-tip', tip || 'isim');
        /* Hücre hangi sekmeden açıldı? Tahta gövdenin çocuğu olduğu için
           sekme bandıyla birlikte kaymıyor; ama mücerredde açılmış bir
           tablo mezide geçilince ekranda durmasın (Geylani: "mücerred
           kısmındaki fiil çekim popupları mezid kısmında çıkıyor").
           Tahtada iki sekmeden de hücre varsa tahta ikisinde de görünür. */
        var sekmeKabi = boxElement.closest ? boxElement.closest('.tab-content') : null;
        inlineContainer.setAttribute('data-sekme', (sekmeKabi && sekmeKabi.id === 'tab2') ? '1' : '0');
        /* Hangi FİİLE ait? Aynı fiilin mâzîsi, muzârisi ve emri tek bir
           satırda (satır kipinde tek sütunda) toplanıyor. */
        inlineContainer.setAttribute('data-fiil', grup.anahtar);
        if (grup.ad) inlineContainer.setAttribute('data-fiil-ad', grup.ad);
        /* Ortak mâzî (1. kalıp): hangi bâbın kuşağına gireceği dizilimde
           kararlaştırılsın diye aday satırlar taşınıyor. */
        if (grup.adaylar && grup.adaylar.length > 1)
            inlineContainer.setAttribute('data-fiil-adaylar', grup.adaylar.join(','));
        izgara.appendChild(inlineContainer);
    }
    inlineContainer.innerHTML = html;
    fdmIzgaraDiz(izgara);

    /* Şeritteki gezinme okları ve kaydırma tutuşu her hücrede kendi
       başına çalışıyor (her tablonun kendi olumlu/menfî şeridi var). */
    setTimeout(function () {
        var wrapper = inlineContainer.querySelector('.conjugation-carousel');
        if (wrapper) { wrapper.style.cursor = 'grab'; window.initCarouselDrag(wrapper); }
    }, 50);

    /* Hücrenin kendi içi sayfanın kutu işleyicilerine sızmasın.
       Tabloya (düğmeler ve oklar dışında) tıklamak onu ortalayıp
       yakınlaştırıyor; aynı tabloya bir daha tıklamak uzaklaştırıyor. */
    inlineContainer.onmousedown = function (e) { e.stopPropagation(); };
    inlineContainer.onclick = function (e) {
        e.stopPropagation();
        if (e.target.closest && e.target.closest('button, a, input, select, .carousel-nav-btn')) return;
        window.fdmHucreOdakla(inlineContainer);
    };
    inlineContainer.ontouchstart = function (e) { e.stopPropagation(); };
    inlineContainer.ontouchend = function (e) { e.stopPropagation(); };

    /* Yeni hücre eklendiyse tahta ekrana sığmayabilir: ilk açılışta
       ortalanıp sığdırılıyor, sonraki eklemelerde yalnız görüş alanına
       çekiliyor — öğretmenin koyduğu yer bozulmasın. */
    /* Yeni tablo eklenince tahta ekranı aşabilir; aşıyorsa kendiliğinden
       ekrana sığdırılıp ortalanıyor — az önce açtığın tablo hep görünür
       olsun. Sığıyorsa öğretmenin koyduğu yer ve ölçek korunuyor. */
    /* İKİNCİ TABLO AÇILINCA TAM EKRAN: tek bir çekim küçük pencerede
       duruyor, ama yanına ikincisi gelir gelmez (mâzîden sonra muzâri
       gibi) tahta bütün ekranı kaplıyor — karşılaştırma böyle rahat
       oluyor (Geylani: "bir tane daha açılırsa tablolar tam ekrana
       geçsinler; küçük tablo sadece bir fiilin mâzîsi ya da sadece
       muzârisi açıkken olacak"). Arka plandaki hazırlık bu kuralın
       dışında: orada tablolar zaten rıhtıma iniyor. */
    var hucreSayisi = izgara.querySelectorAll('.fdm-hucre').length;
    var ikinciTablo = yeniHucre && hucreSayisi === 2 &&
                      !tahta.classList.contains('fdm-yuzen') &&
                      !tahta.classList.contains('fdm-tam') &&
                      !document.body.classList.contains('fdm-hazirlik');
    if (tahta.classList.contains('fdm-yuzen')) window.fdmYuzenYerlestir();
    else if (ikinciTablo) window.fdmTamAc(tahta);
    else if (tahta.classList.contains('fdm-tam')) window.fdmTamYerlestir();
    else if (hucreSayisi === 1) window.fdmTahtaSigdir(true);
    else {
        /* Ölçek artık `zoom` ile ÇOCUĞA uygulandığı için tahtanın
           offsetWidth/Height'ı zaten son ölçüsü; bir daha k ile çarpmak
           taşmayı gizliyordu (ölçüldü: 1512×860'ta 4 kutuda 17 px alt
           taşma). Doğrudan ekranla karşılaştırılıyor. */
        if (tahta.offsetWidth > window.innerWidth - 20 ||
            tahta.offsetHeight > window.innerHeight - 20) window.fdmTahtaSigdir(true);
        else window.fdmGorunurKil(tahta);
    }

    boxElement.style.zIndex = '';  // kutu stacking context olusturmasin
    boxElement.classList.add('matrix-opened');
    window.fdmKokLevhaTazele();
}

/* ---------------------------------------------------------------
   TAHTA: tek pencere, içinde ızgara
   --------------------------------------------------------------- */
window._fdmKutuNo = window._fdmKutuNo || 0;
/* Sütun sırası: 1 = en sağ (ızgara RTL). */
window.FDM_SUTUN = { mazi: 1, muzari: 2, emir: 3, isim: 4 };

/* ============ FİİL GRUBU ============
   Bir fiilin mâzîsi, muzârisi ve emri AYNI SATIRA (satır kipinde aynı
   sütuna) düşüyor; başka bir fiil o satıra karışamıyor (Geylani:
   "عَلِمَ يَعْلَمُ bi satır veya sütunda olsun... bi tabloyu kapatınca o
   fiilin satırına başka fiil karışamasın").
   Fiilin kimliği kutunun bulunduğu SATIR: kalıplar tablosunda her satır
   bir bâb, yani bir fiil. Satıra bir kez numara veriliyor, o numara
   oturum boyunca değişmiyor. Ad olarak o satırın mâzîsi okunuyor —
   kök yerleştirilmişse gerçek fiil (عَلَّمَ) görünüyor. */
window._fdmFiilNo = window._fdmFiilNo || 0;
/* Bir bâb satırının fiil kimliği. */
function fdmSatirAnahtar(tr) {
    if (!tr) return '';
    if (!tr.dataset.fdmFiilNo) tr.dataset.fdmFiilNo = String(++window._fdmFiilNo);
    return 'f' + tr.dataset.fdmFiilNo;
}

/* Satırın mâzîsi. Kendi satırında yoksa ÜSTTEKİ satırlardan bu satırı
   KAPSAYAN (rowspan) mâzî aranıyor: 1. kalıp (فَعَلَ) birinci, ikinci ve
   üçüncü bâbın ortak mâzîsi olduğu için tabloda üç satırı kaplayan tek
   bir hücre. Böylece 4-5 ve 6-7 kalıplarının başlığında da o fiil
   yazıyor. */
function fdmSatirFiilAdi(tr) {
    if (!tr) return '';
    var b = tr.querySelector('.glass-box[data-type="mazi"] .ar') ||
            tr.querySelector('.glass-box.is-verb .ar');
    if (b) return (b.textContent || '').trim();
    var geri = 1, s = tr.previousElementSibling;
    while (s && geri < 8) {
        var kutu = s.querySelector('td[rowspan] .glass-box[data-type="mazi"]');
        var td = (kutu && kutu.closest) ? kutu.closest('td') : null;
        if (td && parseInt(td.getAttribute('rowspan') || '1', 10) > geri) {
            var a = kutu.querySelector('.ar');
            return a ? (a.textContent || '').trim() : '';
        }
        s = s.previousElementSibling; geri++;
    }
    return '';
}

function fdmFiilGrubu(boxElement) {
    var tr = boxElement && boxElement.closest ? boxElement.closest('tr') : null;
    var td = boxElement && boxElement.closest ? boxElement.closest('td') : null;
    var anahtar, ad = '', adaylar = [];
    if (tr) {
        anahtar = fdmSatirAnahtar(tr);
        ad = fdmSatirFiilAdi(tr);
        /* ORTAK MÂZÎ: 1. kalıp üç bâbın (2-3 · 4-5 · 6-7) tek mâzîsi.
           Hangi fiile ait olduğu SABİT DEĞİL; kapsadığı satırların
           anahtarları aday olarak saklanıyor, karar dizilim sırasında
           veriliyor (fdmEsnekFiilCoz) — muzârisi 4, emri 5 olan bir
           fiilde mâzî onların sütununa katılsın (Geylani: "1. kalıp hem
           2-3 hem 4-5 hem 6-7 için ortak, şu an mazileri farklı
           yerlerde çıkıyor"). */
        var kap = td ? parseInt(td.getAttribute('rowspan') || '1', 10) : 1;
        if (kap > 1) {
            var s = tr;
            for (var i = 0; i < kap && s; i++) {
                adaylar.push(fdmSatirAnahtar(s));
                s = s.nextElementSibling;
            }
        }
    } else {
        anahtar = 'k' + (boxElement.dataset.fdmNo ||
            (boxElement.dataset.fdmNo = String(++window._fdmKutuNo)));
    }
    return { anahtar: anahtar, ad: ad, adaylar: adaylar };
}

/* Ortak mâzî hangi kuşağa girecek? Açık tablolara bakılıyor: adayları
   arasında EN ÇOK tablosu olan bâb kazanıyor, eşitlikte bâb sırası
   (yani kalıbın kendi satırı) öne geçiyor. Hiçbir adayın tablosu yoksa
   mâzî kendi satırında tek başına duruyor. Karar her dizilimde yeniden
   veriliyor: sonradan 6 ve 7 açılırsa mâzî oraya taşınıyor. */
function fdmEsnekFiilCoz(izgara) {
    var hucreler = Array.prototype.slice.call(izgara.querySelectorAll('.fdm-hucre'));
    var sabit = {};
    hucreler.forEach(function (h) {
        if (h.dataset.fiilAdaylar) return;
        var k = h.getAttribute('data-fiil') || 'x';
        sabit[k] = (sabit[k] || 0) + 1;
    });
    hucreler.forEach(function (h) {
        var ham = h.dataset.fiilAdaylar;
        if (!ham) return;
        var adaylar = ham.split(',');
        var en = adaylar[0], enSayi = 0;
        adaylar.forEach(function (a) {
            var n = sabit[a] || 0;
            if (n > enSayi) { enSayi = n; en = a; }
        });
        h.setAttribute('data-fiil', en);
    });
}

/* Başlıktaki fiil adı hep GÜNCEL okunuyor: tablo açıldığında kök daha
   mâzîye girmemiş olabiliyordu; o zaman kutuda hâlâ فَعَلَ yazıyor ve
   aynı fiilin tabloları farklı adlar gösteriyordu (4 · MUZÂRİ'de فَعَلَ,
   1 · MÂZÎ'de كَتَبَ). Dizilimde satırın mâzîsi yeniden okunup yazılıyor. */
/* HER TABLONUN ANLAMI: başlıkta kalıbın Türkçesi (sözlükteki trText)
   duruyor — öğrenci tabloya bakarken kelimenin ne demek olduğunu da
   görsün (Geylani: "her tablonun anlamı olsun, trText kısmı yani").
   Anlam sözlükten vezingezinti üzerinden okunuyor: "+" eki etkinse onun
   karşılığı, yoksa temel anlam. */
function fdmHucreAnlamTazele(h) {
    var kap = h.querySelector('.fdm-hucre-anlam');
    if (!kap) return;
    var parca = (h.getAttribute('data-anahtar') || '').replace(/^k/, '').split('_');
    var ref = parca[0], no = parca[1];
    var kutu = no ? document.querySelector('.glass-box[data-fdm-no="' + no + '"]') : null;
    var a = null;
    try {
        if (window.KidefVezinGezinti && window.KidefVezinGezinti.anlamAl)
            a = window.KidefVezinGezinti.anlamAl(ref, kutu);
    } catch (x) { a = null; }
    var tr = (a && a.tr) ? String(a.tr).trim() : '';
    if (!tr) { kap.textContent = ''; kap.removeAttribute('title'); return; }
    kap.textContent = ((a.emoji ? a.emoji + ' ' : '') + tr);
    kap.title = tr;
}

function fdmFiilAdlariTazele(izgara) {
    izgara.querySelectorAll('.fdm-hucre').forEach(function (h) {
        fdmHucreAnlamTazele(h);
        var k = h.getAttribute('data-fiil') || '';
        if (k.charAt(0) !== 'f') return;
        var tr = document.querySelector('tr[data-fdm-fiil-no="' + k.slice(1) + '"]');
        var ad = fdmSatirFiilAdi(tr);
        if (!ad) return;
        h.setAttribute('data-fiil-ad', ad);
        var kap = h.querySelector('.fdm-hucre-fiil');
        if (!kap) {
            var bas = h.querySelector('.fdm-hucre-bas');
            var rozet = h.querySelector('.fdm-hucre-rozet');
            if (!bas) return;
            kap = document.createElement('span');
            kap.className = 'fdm-hucre-fiil';
            kap.title = 'Bu satırın fiili';
            kap.appendChild(document.createElement('bdi'));
            if (rozet && rozet.nextSibling) bas.insertBefore(kap, rozet.nextSibling);
            else bas.insertBefore(kap, bas.firstChild);
        }
        var et = kap.querySelector('bdi') || kap;
        if (et.textContent !== ad) et.textContent = ad;
    });
}

function fdmTahta() {
    var t = document.getElementById('fdm-tahta');
    if (t) return t;
    t = document.createElement('div');
    t.id = 'fdm-tahta';
    t.className = 'fdm-tahta';
    t.innerHTML =
        '<div class="popup-drag-bar"><span class="fdm-tutus"></span>' +
          '<button type="button" class="fdm-dizim" onclick="fdmDizimDegistir(event)"></button>' +
        '</div>' +
        '<div class="fdm-isiklar">' +
          '<button type="button" class="fdm-nokta fdm-kirmizi" title="Hepsini kapat" ' +
          'aria-label="Hepsini kapat" onclick="fdmTahtaKapat(event)">&#10005;</button>' +
          '<button type="button" class="fdm-nokta fdm-sari" title="Yüzen moda al — küçülüp köşeye ' +
          'park eder" aria-label="Yüzen mod" onclick="fdmTahtaYuzen(event)">&#8722;</button>' +
          '<button type="button" class="fdm-nokta fdm-yesil" title="Tam ekran" ' +
          'aria-label="Tam ekran" onclick="fdmTahtaTamEkran(event)">&#10530;</button>' +
        '</div>' +
        '<div class="fdm-simgeler" dir="rtl"></div>' +
        '<div class="fdm-gorus"><div class="fdm-tuval">' +
          '<div class="fdm-izgara" dir="rtl"></div>' +
        '</div></div>' +
        '<div class="fdm-tut fdm-tut-n" data-yon="n"></div>' +
        '<div class="fdm-tut fdm-tut-s" data-yon="s"></div>' +
        '<div class="fdm-tut fdm-tut-w" data-yon="w"></div>' +
        '<div class="fdm-tut fdm-tut-e" data-yon="e"></div>' +
        '<div class="fdm-tut fdm-kose fdm-tut-nw" data-yon="nw"></div>' +
        '<div class="fdm-tut fdm-kose fdm-tut-ne" data-yon="ne"></div>' +
        '<div class="fdm-tut fdm-kose fdm-tut-sw" data-yon="sw"></div>' +
        '<div class="fdm-tut fdm-kose fdm-tut-se" data-yon="se"></div>';
    document.body.appendChild(t);
    fdmTahtaSurukle(t);
    fdmTahtaOlcekle(t);
    fdmYakinlastirmaKur(t);
    fdmRihtimKur(t);
    fdmDizimYazi(t);
    window.fdmYesilTusYazi();
    return t;
}

/* RIHTIMA TIKLAMA: tablolar geri açılır. Simgeye basılmışsa o tablo
   ortalanır. Sürükleme sonrası gelen tıklama yutuluyor — rıhtımı
   taşırken tablolar açılmasın. */
function fdmRihtimKur(t) {
    var bas = null;
    /* Hangi simgeye basıldığı POINTERDOWN'da saklanıyor: sürükleme
       işaretçiyi tahtaya kilitlediği (setPointerCapture) için tarayıcı
       sonraki `click`i de tahtaya yönlendiriyor, simge kayboluyordu
       (ölçüldü: click hedefi `.fdm-simge` değil `.fdm-tahta` geliyordu). */
    t.addEventListener('pointerdown', function (e) {
        if (!t.classList.contains('fdm-yuzen')) return;
        bas = { x: e.clientX, y: e.clientY, kaydi: false,
                simge: e.target.closest ? e.target.closest('.fdm-simge') : null,
                nokta: e.target.closest ? e.target.closest('.fdm-nokta') : null };
    }, true);
    t.addEventListener('pointermove', function (e) {
        if (!bas) return;
        if (Math.abs(e.clientX - bas.x) + Math.abs(e.clientY - bas.y) > 6) {
            bas.kaydi = true;
            t.dataset.rihtimTasindi = '1';   /* öğretmenin koyduğu yer korunsun */
        }
    }, true);
    t.addEventListener('click', function (e) {
        if (!t.classList.contains('fdm-yuzen')) return;
        var nokta = (bas && bas.nokta) || (e.target.closest && e.target.closest('.fdm-nokta'));
        if (nokta) { bas = null; return; }               /* üç düğme kendi işini yapar */
        if (bas && bas.kaydi) { bas = null; return; }    /* sürüklemeydi */
        var simge = (bas && bas.simge) ||
                    (e.target.closest ? e.target.closest('.fdm-simge') : null);
        window.fdmTahtaYuzen(null, false);
        if (simge) {
            var h = t.querySelector('.fdm-hucre[data-anahtar="' + simge.getAttribute('data-anahtar') + '"]');
            if (h) setTimeout(function () { window.fdmHucreOdakla(h); }, 300);
        }
        bas = null;
    });
}

/* ---- DİZİM KİPİ: TÜRLER SÜTUNDA mı SATIRDA mı? ----
   Öntanımlı kip SÜTUN: mâzîler en sağdaki sütunda alt alta. İkinci kip
   SATIR: aynı türden tablolar YAN YANA — birinci satır mâzîler, ikinci
   muzâriler, üçüncü emirler (Geylani: "mazileri yanyana alabilelim
   veya muzarileri; mazi varsa ilk satırda olsunlar, muzariler ikinci,
   emirler 3"). Bâbları karşılaştırırken satır kipi, tek bir fiilin
   çekimlerini toplarken sütun kipi işe yarıyor. */
/* İKİ KİP VAR, ÜÇÜNCÜSÜ YOK. Düğme yalnız SATIR ile SÜTUN arasında
   gidip geliyor; "OTO" diye bir kip görünmüyor (Geylani: "otomatik mod
   olmasın, sadece satır ve sütun arasında geçiş yapılabilir olmalı").
   Açılış kipini yine kural belirliyor: kökte TEK fiil varsa SATIR
   (mâzî · muzâri · emir yan yana — emre ulaşmak için kaydırmak
   gerekmesin), İKİ ve daha fazlası varsa SÜTUN (her fiil bir sütun;
   karşılaştırma böyle kuruluyor). Öğretmen düğmeye basınca seçim ELLE
   yapılmış sayılıyor ve tahta kapanana kadar korunuyor.
   İç değerler: 'sutun' = tür sütunda (fiil satırda) = ekranda SATIR
   kipi · 'satir' = tür satırda (fiil sütunda) = ekranda SÜTUN kipi. */
window.FDM_DIZIM = 'sutun';
window.FDM_DIZIM_ELLE = false;      /* düğmeye basıldı mı? */
/* Ekranda hangi kip geçerli? Elle seçilmediyse fiil sayısı belirliyor. */
function fdmEtkinDizim(fiilSayisi) {
    if (!window.FDM_DIZIM_ELLE) window.FDM_DIZIM = (fiilSayisi > 1) ? 'satir' : 'sutun';
    return window.FDM_DIZIM;
}
/* KİP ADI FİİLE GÖRE: bir fiilin mâzî/muzâri/emri YAN YANA diziliyorsa
   "SATIR" kipi, ALT ALTA diziliyorsa "SÜTUN" kipi. (Etiketler eskiden
   türün eksenini anlatıyordu, öğretmenin adlandırmasının tersiydi.) */
function fdmDizimYazi(t) {
    var b = t && t.querySelector('.fdm-dizim');
    if (!b) return;
    var d = window.FDM_DIZIM;
    var satirMi = (d === 'sutun');                 /* ekrandaki adıyla SATIR */
    /* SİMGE ADIYLA AYNI YÖNDE: SATIR'da yatay çubuklar, SÜTUN'da DİKEY
       çubuklar (Geylani: "sütunda dikey svg olsun, iki yatay çizgi
       değil"). */
    var ikon = satirMi
        ? '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2.2" width="13" height="2.6" rx="1.3"/>' +
          '<rect x="1.5" y="6.7" width="13" height="2.6" rx="1.3"/>' +
          '<rect x="1.5" y="11.2" width="13" height="2.6" rx="1.3"/></svg>'
        : '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.2" y="1.5" width="2.6" height="13" rx="1.3"/>' +
          '<rect x="6.7" y="1.5" width="2.6" height="13" rx="1.3"/>' +
          '<rect x="11.2" y="1.5" width="2.6" height="13" rx="1.3"/></svg>';
    b.innerHTML = ikon + '<span>' + (satirMi ? 'SATIR' : 'SÜTUN') + '</span>';
    b.title = satirMi
        ? 'SATIR kipi: bir fiilin mâzî · muzâri · emri yan yana. SÜTUN kipine geçmek için bas.'
        : 'SÜTUN kipi: bir fiilin mâzî · muzâri · emri alt alta. SATIR kipine geçmek için bas.';
}
/* KİP DEĞİŞİNCE TABLOLAR KAYARAK YER DEĞİŞTİRİR (FLIP): önce eski
   yerleri ölçülüyor, yeni yerleşimden sonra her tablo eski yerine
   "geri itiliyor" ve oradan yumuşakça yeni yerine kayıyor. Böylece
   satır ↔ sütun geçişi birden olmuyor (Geylani: "yer değiştirme
   animasyonu olsun, birden olmasın"). Ayırıcı çizgiler de yeni
   yönünde belirerek geliyor. */
var FDM_GECIS_SURE = 460;
function fdmDizimGecisOlc(izgara) {
    var liste = [];
    if (!izgara) return liste;
    izgara.querySelectorAll('.fdm-hucre').forEach(function (h) {
        liste.push({ h: h, x: h.offsetLeft, y: h.offsetTop });
    });
    return liste;
}
function fdmDizimGecisOynat(izgara, eskiler) {
    if (!izgara || !eskiler.length) return;
    var oynayan = [];
    eskiler.forEach(function (o) {
        if (!o.h.isConnected) return;
        var dx = o.x - o.h.offsetLeft, dy = o.y - o.h.offsetTop;
        if (!dx && !dy) return;
        /* Kaydırma `transform` ile değil `translate` özelliğiyle
           yapılıyor: hücrenin kendi kuralında `transform: none
           !important` var (kutu düğmelerinin kapsayan bloğu bozulmasın
           diye) ve satır içi dönüşümü eziyordu — ölçüldü: 90 ms'de
           tablolar çoktan yeni yerindeydi, animasyon hiç oynamıyordu. */
        o.h.style.transition = 'none';
        o.h.style.translate = dx + 'px ' + dy + 'px';
        oynayan.push(o.h);
    });
    izgara.querySelectorAll('.fdm-ayirici').forEach(function (c) {
        c.classList.add('fdm-cizgi-belir');
    });
    if (!oynayan.length) return;
    void izgara.offsetWidth;                       /* yerleşim kesinleşsin */
    requestAnimationFrame(function () {
        oynayan.forEach(function (h) {
            h.style.transition = 'translate ' + FDM_GECIS_SURE + 'ms cubic-bezier(.22,.61,.36,1)';
            h.style.translate = '0px 0px';
        });
    });
    setTimeout(function () {
        oynayan.forEach(function (h) { h.style.transition = ''; h.style.translate = ''; });
    }, FDM_GECIS_SURE + 60);
}
window.fdmDizimDegistir = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    /* SATIR ⇄ SÜTUN; başka kip yok. */
    window.FDM_DIZIM = (window.FDM_DIZIM === 'sutun') ? 'satir' : 'sutun';
    window.FDM_DIZIM_ELLE = true;    /* artık fiil sayısı karışmıyor */
    var t = document.getElementById('fdm-tahta');
    if (!t) return;
    fdmDizimYazi(t);
    var izgara = t.querySelector('.fdm-izgara');
    var eskiler = fdmDizimGecisOlc(izgara);
    if (izgara) fdmIzgaraDiz(izgara);
    t.style.setProperty('--fdm-ic-olcek', 1);
    t.classList.remove('fdm-odak');
    t.dataset.odakHucre = '';
    fdmTuvalOlc(t);
    /* Pencerenin kendi ölçüsü ve yeri de yumuşak değişsin. */
    t.classList.add('fdm-gecis');
    setTimeout(function () { t.classList.remove('fdm-gecis'); }, FDM_GECIS_SURE + 60);
    /* TAM EKRANDAN ÇIKMADAN kip değişiyor: `fdmTahtaSigdir` tahtayı
       pencereye döndürüyordu, satır/sütun tuşuna basmak tam ekranı
       kapatmış oluyordu (Geylani: "sütun ve satır tuşlarına basınca tam
       ekrandan çıkmasın"). Tam ekrandaysa yalnız yeni düzene göre
       yeniden yerleştiriliyor. */
    if (t.classList.contains('fdm-tam')) window.fdmTamYerlestir();
    else if (!t.classList.contains('fdm-yuzen')) window.fdmTahtaSigdir(true);
    fdmDizimGecisOynat(izgara, eskiler);
    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
};

/* ================= GÖRÜŞ PENCERESİ (tuval) =================
   Tablolar artık sınırsız uzayan bir ızgarada değil, SABİT BİR GÖRÜŞ
   PENCERESİNİN içinde duruyor. Bir sütunda en çok İKİ tablo alt alta
   görünüyor; üçüncü mâzî açılırsa pencere büyümüyor, aşağısı kaydırma
   ile geliyor (Geylani: "en fazla iki tablo alt alta olsun, sonrakiler
   için scroll olsun"). Pencere iki ölçekli: DIŞ ölçek (--fdm-olcek)
   pencereyi büyütür, İÇ ölçek (--fdm-ic-olcek) pencerenin içindeki
   tabloları — yani bir görselde gezer gibi yaklaşıp uzaklaşmak. Tuval,
   ölçeklenmiş içeriğin gerçek boyunu taşıyan kutudur; kaydırma payları
   ondan doğuyor. */
window.FDM_IC_EN_AZ = 0.5;   /* alt sınır artık içeriğe göre: bkz. fdmIcEnAz */
window.FDM_IC_EN_COK = 3;
var FDM_IZGARA_ARA = 14;   /* .fdm-izgara gap */

function fdmIcOlcek(t) {
    var v = parseFloat(t.style.getPropertyValue('--fdm-ic-olcek'));
    return (v > 0) ? v : 1;
}
/* İçerik `zoom` ile büyüdüğü için yerleşim kendiliğinden genişliyor;
   tuvale ayrıca ölçü yazmaya gerek kalmadı (dönüşümle büyütürken
   kaydırma payları doğmadığından elle yazılıyordu). */
function fdmTuvalOlc(t) {
    var tuval = t.querySelector('.fdm-tuval');
    if (!tuval) return;
    tuval.style.width = '';
    tuval.style.height = '';
}
/* Pencerenin boyu İÇ ÖLÇEKTEN BAĞIMSIZ: iç ölçek 1'ken ölçülen "iki
   satır" boyunda sabitleniyor. Yaklaşınca pencere büyümüyor, içerik
   kayıyor. */
function fdmGorusOlc(t) {
    var izgara = t.querySelector('.fdm-izgara'), gorus = t.querySelector('.fdm-gorus');
    if (!izgara || !gorus) return;
    /* Rıhtımdayken pencere gizli; ölçüler 0 çıkar ve dönüşte bozuk bir
       düzen kalırdı. Ölçüm, tablolar geri açılırken yapılıyor. */
    if (t.classList.contains('fdm-yuzen')) return;
    /* Tam ekranda pencere ölçüsünü fdmTamYerlestir yazıyor. */
    if (t.classList.contains('fdm-tam')) { window.fdmTamYerlestir(); return; }
    /* VARSAYILAN BOY: yan yana ÜÇ, alt alta İKİ tablo (Geylani).
       Dördüncü sütun ve üçüncü satır kaydırma ile geliyor; kenar
       tutamaklarıyla istenirse küçültülüp büyütülebiliyor. */
    var ust = [], sol = [];
    izgara.querySelectorAll('.fdm-hucre').forEach(function (h) {
        if (ust.indexOf(h.offsetTop) < 0) ust.push(h.offsetTop);
        if (sol.indexOf(h.offsetLeft) < 0) sol.push(h.offsetLeft);
    });
    ust.sort(function (a, b) { return a - b; });
    sol.sort(function (a, b) { return b - a; });     /* RTL: sağdaki sütun önce */
    var cokSatir = ust.length > 2, cokSutun = sol.length > 3;
    var boy = cokSatir ? (ust[2] - FDM_IZGARA_ARA) : izgara.offsetHeight;
    /* Üç sütunluk en: en sağdaki sütunun sağ kenarından üçüncü sütunun
       sol kenarına kadar. */
    var en = izgara.offsetWidth;
    if (cokSutun) {
        var sagSutunEn = 0;
        izgara.querySelectorAll('.fdm-hucre').forEach(function (h) {
            if (h.offsetLeft === sol[0]) sagSutunEn = Math.max(sagSutunEn, h.offsetWidth);
        });
        en = (sol[0] + sagSutunEn) - sol[2];
    }
    gorus.style.width = (en + (cokSatir ? 14 : 0)) + 'px';
    gorus.style.height = (boy + (cokSutun ? 14 : 0)) + 'px';
    fdmTuvalOlc(t);
    /* Sütun sayısı değiştiyse Arapçanın başlangıcına, yani SAĞ UCA
       yaslanılıyor: mâzî sütunu hep görünür kalsın. */
    var oncekiSutun = parseInt(t.dataset.sonSutun || '0', 10);
    t.dataset.sonSutun = String(sol.length);
    if (cokSutun && sol.length !== oncekiSutun) {
        requestAnimationFrame(function () {
            gorus.scrollLeft = gorus.scrollWidth - gorus.clientWidth;
        });
    }
}
/* EN ÇOK NE KADAR KÜÇÜLTÜLEBİLİR? Bütün tablolar pencereye sığdığı
   anda küçültme duruyor; ötesi yalnız boşluk büyütürdü (Geylani:
   "sonsuz küçültme olmasın, tabloların hepsi göründükten sonra daha
   fazla küçültme olmasın"). Zaten sığıyorlarsa alt sınır 1'dir. */
function fdmIcEnAz(t) {
    var izgara = t.querySelector('.fdm-izgara'), gorus = t.querySelector('.fdm-gorus');
    if (!izgara || !gorus || !izgara.offsetWidth || !izgara.offsetHeight) return 1;
    var k = Math.min(gorus.clientWidth / izgara.offsetWidth,
                     gorus.clientHeight / izgara.offsetHeight);
    return Math.max(0.25, Math.min(1, k));
}
/* TAM EKRANDA ŞERİTLER: ölçek 1'deyken tablolar kalan genişliği eşit
   bölüşüyor (ekran dolsun); YAKLAŞILDIĞINDA ise doğal enlerine dönüyor
   ki ızgara pencereyi aşabilsin ve kaydırarak gezilebilsin. `1fr`
   şeritler yaklaşınca tabloyu enine kilitliyor, `max-content` ızgara
   ile birleşince de şerit sonsuza gidiyordu (ölçüldü: hücre 4.000.006
   px). Bu yüzden karar tek yerden veriliyor. */
function fdmTamSablonTazele(t, k) {
    if (!t || !t.classList.contains('fdm-tam')) return;
    var iz = t.querySelector('.fdm-izgara');
    if (!iz) return;
    var yakin = k > 1.02;
    t.classList.toggle('fdm-tam-yakin', yakin);
    fdmTamSutunlar(iz, yakin);
}

/* İç ölçeği değiştirir; EKRANDA (mx,my) noktası yerinde kalır. */
window.fdmIcYakinlastir = function (t, k, mx, my) {
    var gorus = t.querySelector('.fdm-gorus');
    if (!gorus) return;
    var k0 = fdmIcOlcek(t);
    k = Math.max(fdmIcEnAz(t), Math.min(window.FDM_IC_EN_COK, k));
    if (Math.abs(k - k0) < 0.002) return;
    fdmTamSablonTazele(t, Math.max(k, k0));   /* geçiş boyunca doğal şerit */
    var dis = parseFloat(t.style.getPropertyValue('--fdm-olcek')) || 1;
    var r = gorus.getBoundingClientRect();
    if (typeof mx !== 'number') { mx = r.left + r.width / 2; my = r.top + r.height / 2; }
    var px = (mx - r.left) / dis, py = (my - r.top) / dis;   /* pencere içi yer */
    var cx = (gorus.scrollLeft + px) / k0, cy = (gorus.scrollTop + py) / k0;
    t.style.setProperty('--fdm-ic-olcek', k);
    fdmTuvalOlc(t);
    gorus.scrollLeft = cx * k - px;
    gorus.scrollTop = cy * k - py;
    t.classList.toggle('fdm-odak', k > 1.02);
    fdmTamSablonTazele(t, k);                 /* yerleşince şeritler tazelensin */
};

/* Bir tabloya tıklanınca o tablo ORTAYA gelip yakınlaşıyor; aynı
   tabloya bir daha tıklanınca hepsi yeniden görünür olacak şekilde
   uzaklaşıyor (Geylani: "fareyle bi kutuya tıklanırsa o ortalansın
   yaklaşılsın"). */
window.fdmHucreOdakla = function (hucre) {
    var t = document.getElementById('fdm-tahta');
    if (!t || !hucre) return;
    var gorus = t.querySelector('.fdm-gorus');
    var izgara = t.querySelector('.fdm-izgara');
    var anahtar = hucre.getAttribute('data-anahtar') || '';
    var k;
    if (t.dataset.odakHucre === anahtar && fdmIcOlcek(t) > 1.02) {
        t.dataset.odakHucre = '';
        k = Math.max(fdmIcEnAz(t), 1);
        /* UZAKLAŞIRKEN DE AYNI TABLOYA BAKILIYOR. Eskiden ızgaranın
           ortasına dönülüyordu; üst satırdaki bir tablodan uzaklaşınca
           pencere ortaya kayıyor ve tablonun ÜSTÜ (başlığı, ilk satırı)
           görünmez oluyordu (Geylani: "küçülünce tablonun yukarısı
           görünmüyor, özellikle üstteki tablolarda"). Hedef tablonun
           kendi ortası; kaydırma ızgara sınırlarına kırpıldığı için üst
           satırda kendiliğinden en başa yaslanıyor. */
        fdmOdakAnim(t, k, hucre.offsetLeft + hucre.offsetWidth / 2,
                          hucre.offsetTop + hucre.offsetHeight / 2);
    } else {
        t.dataset.odakHucre = anahtar;
        /* Tam ekranda şeritler ÖNCE doğal enine dönüyor; hücre ölçüsü
           sonra okunuyor, yoksa hedef nokta eski yerleşimden alınıp
           tablo yanlış yere oturuyordu. */
        fdmTamSablonTazele(t, 2);
        k = Math.max(1, Math.min(window.FDM_IC_EN_COK,
            Math.min(gorus.clientWidth * 0.96 / hucre.offsetWidth,
                     gorus.clientHeight * 0.96 / hucre.offsetHeight)));
        fdmOdakAnim(t, k, hucre.offsetLeft + hucre.offsetWidth / 2,
                          hucre.offsetTop + hucre.offsetHeight / 2);
    }
    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
};

/* YUMUŞAK YAKINLAŞMA: ölçek ile kaydırma TEK BİR ZAMAN ÇİZGİSİNDE
   birlikte yürüyor. Eskiden ölçeği CSS geçişi, kaydırmayı da tarayıcının
   `behavior:'smooth'`u ayrı ayrı yapıyordu; ikisi denk düşmediği için
   tablo yandan kayarak geliyormuş gibi duruyordu (Geylani: "sanki
   sağdan geliyormuş gibi olmasın"). Şimdi bakılan noktanın kendisi
   yumuşatılıyor: görüşün ortası eski merkezden yeni merkeze giderken
   ölçek de onunla büyüyor — gerçek bir yakınlaşma. */
function fdmOdakAnim(t, k1, hedefX, hedefY, sure) {
    var gorus = t.querySelector('.fdm-gorus');
    if (!gorus) return;
    var k0 = fdmIcOlcek(t);
    var mx0 = (gorus.scrollLeft + gorus.clientWidth / 2) / k0;
    var my0 = (gorus.scrollTop + gorus.clientHeight / 2) / k0;
    var t0 = performance.now();
    /* YAKINLAŞMA YAVAŞ VE PÜRÜZSÜZ: 420 ms sert geliyordu. Süre uzatıldı
       ve eğri iki uçtan da yumuşayan biçime çevrildi — hareket başlarken
       ve dururken sarsılmıyor (Geylani: "zoom animasyonu daha pürüzsüz
       ve yumuşak, yavaş olsun"). */
    sure = sure || 720;
    t.classList.add('fdm-canli');
    fdmTamSablonTazele(t, Math.max(k0, k1));   /* geçiş boyunca doğal şerit */
    function adim(simdi) {
        var p = Math.min(1, (simdi - t0) / sure);
        /* easeInOutCubic: iki uçta da yumuşak */
        var e = (p < 0.5) ? (4 * p * p * p) : (1 - Math.pow(-2 * p + 2, 3) / 2);
        var k = k0 + (k1 - k0) * e;
        var mx = mx0 + (hedefX - mx0) * e;
        var my = my0 + (hedefY - my0) * e;
        t.style.setProperty('--fdm-ic-olcek', k);
        fdmTuvalOlc(t);
        gorus.scrollLeft = Math.max(0, Math.min(gorus.scrollWidth - gorus.clientWidth,
                                                mx * k - gorus.clientWidth / 2));
        gorus.scrollTop = Math.max(0, Math.min(gorus.scrollHeight - gorus.clientHeight,
                                               my * k - gorus.clientHeight / 2));
        if (p < 1) requestAnimationFrame(adim);
        else {
            t.classList.remove('fdm-canli');
            t.classList.toggle('fdm-odak', k1 > 1.02);
            fdmTamSablonTazele(t, k1);         /* uzaklaşınca şeritler yeniden paylaşılsın */
        }
    }
    requestAnimationFrame(adim);
}

/* ---- KISTIRMA (iki parmak) ve DOKUNMATİK YÜZEY (ctrl+teker) ----
   Tarayıcı, dizüstü dokunmatik yüzeyinde iki parmakla kıstırmayı
   `ctrlKey`li bir teker olayı olarak veriyor; tablette iki ayrı dokunuş
   geliyor. İKİSİ DE TAHTANIN KENDİSİNİ büyütüp küçültüyor — pencere de
   tablolarla birlikte küçülüyor. Eskiden yalnız İÇERİK küçülüyordu:
   pencere aynı kalıp içi boşalıyordu, küçültmenin sonu gelmiyormuş gibi
   duruyordu (Geylani: "sonsuz küçültme olmasın, daha pratik küçülüp
   büyüsünler"). Parmakların ortasındaki nokta yerinde kalıyor. */
window.fdmDisYakinlastir = function (t, k, mx, my) {
    var tb = fdmTahtaTaban(t);
    if (!tb.lw && !tb.bw) return;
    var k0 = parseFloat(t.style.getPropertyValue('--fdm-olcek')) || 1;
    k = Math.max(0.35, Math.min(3.2, k));
    if (Math.abs(k - k0) < 0.002) return;
    var r = t.getBoundingClientRect();
    if (typeof mx !== 'number') { mx = r.left + r.width / 2; my = r.top + r.height / 2; }
    var fx = r.width ? (mx - r.left) / r.width : 0.5;
    var fy = r.height ? (my - r.top) / r.height : 0.5;
    /* Elle ölçek verildi: kendiliğinden yerleşen kipler bırakılıyor. */
    if (t.classList.contains('fdm-tam')) {
        t.classList.remove('fdm-tam');
        var g0 = t.querySelector('.fdm-gorus'), iz0 = t.querySelector('.fdm-izgara');
        if (g0) { g0.style.width = ''; g0.style.height = ''; }
        if (iz0) { iz0.style.gridTemplateColumns = ''; delete iz0.dataset.tamHucreEn; }
        t.classList.remove('fdm-tam-yakin');
        fdmGorusOlc(t);     /* pencere kipinin kendi ölçüsü geri gelsin: yoksa
                               görüş içeriğe göre şişiyor, yakınlaşınca pencere
                               büyüyordu (ölçüldü: 1049 → 2755 px) */
        fdmGorusOlc(t);
        window.fdmYesilTusYazi();
        tb = fdmTahtaTaban(t);
    }
    t.style.setProperty('--fdm-olcek', k);
    var o = fdmTahtaOlcu(tb, k);
    window.fdmEkranaYerlestir(t, Math.round(mx - fx * o.w), Math.round(my - fy * o.h));
    fdmKaybolmasin(t);
};
/* Kıstırma imlecin altındaki noktayı sabit tuttuğu için tahta çok
   büyürken ekranın dışına kaçabiliyor; hiçbir yeri görünmüyorsa geri
   çekiliyor ki öğretmen onu kaybetmesin. */
function fdmKaybolmasin(t) {
    var r = t.getBoundingClientRect(), pay = 60;
    if (r.right < pay || r.bottom < pay ||
        r.left > window.innerWidth - pay || r.top > window.innerHeight - pay) {
        window.fdmGorunurKil(t);
    }
}
function fdmYakinlastirmaKur(t) {
    t.addEventListener('wheel', function (e) {
        if (!e.ctrlKey) return;                 /* düz kaydırma: pencereye bırak */
        e.preventDefault(); e.stopPropagation();
        var k0 = parseFloat(t.style.getPropertyValue('--fdm-olcek')) || 1;
        /* 260 yerine 150: bir jestte gözle görülür bir değişim olsun. */
        window.fdmDisYakinlastir(t, k0 * (1 - e.deltaY / 150), e.clientX, e.clientY);
    }, { passive: false });

    var par = {}, kis = null;
    function uzaklik(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
    t.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'touch') return;
        par[e.pointerId] = { x: e.clientX, y: e.clientY };
        var id = Object.keys(par);
        if (id.length === 2) {
            var a = par[id[0]], b = par[id[1]];
            kis = { d0: uzaklik(a, b) || 1,
                    k0: parseFloat(t.style.getPropertyValue('--fdm-olcek')) || 1 };
            window._fdmKistirma = true;         /* sürükleme dursun */
        }
    }, true);
    t.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'touch' || !par[e.pointerId]) return;
        par[e.pointerId] = { x: e.clientX, y: e.clientY };
        var id = Object.keys(par);
        if (!kis || id.length !== 2) return;
        e.preventDefault(); e.stopPropagation();
        var a = par[id[0]], b = par[id[1]];
        window.fdmDisYakinlastir(t, kis.k0 * (uzaklik(a, b) / kis.d0),
            (a.x + b.x) / 2, (a.y + b.y) / 2);
    }, true);
    function birak(e) {
        if (e.pointerType !== 'touch') return;
        delete par[e.pointerId];
        if (Object.keys(par).length < 2) { kis = null; window._fdmKistirma = false; }
    }
    t.addEventListener('pointerup', birak, true);
    t.addEventListener('pointercancel', birak, true);
}

/* Hücreleri sütun/satıra yerleştirir: aynı türden ikinci tablo alt
   satıra iner, aradan biri kapanınca kalanlar yukarı kayar. */
function fdmIzgaraDiz(izgara) {
    var sayac = {};
    var satirKipi = false;      /* aşağıda fiil sayısına göre belirleniyor */
    /* İKİDEN ÇOK TABLO VARSA TAM EKRAN YOK: tam ekran tek bir tabloyu
       kaplıyor, yan yana karşılaştırmanın da anlamı kalmıyor. Öğretmen:
       "birden fazla popup açıldığında tam ekran özelliği olmasın, sadece
       her tabloda çarpı olsun". Tek tablo kalınca ⤢ geri geliyor. */
    var tahtaEl = izgara.closest ? izgara.closest('.fdm-tahta') : null;
    if (tahtaEl) tahtaEl.classList.toggle('fdm-coklu', izgara.children.length > 1);
    /* İKİNCİ EKSEN ARTIK SAYAÇ DEĞİL, FİİL: aynı fiilin tabloları tek
       bir satırı (satır kipinde tek sütunu) paylaşıyor. Aynı fiilden
       aynı türde ikinci bir tablo açılırsa ona ayrı bir satır veriliyor
       ki üst üste binmesin. Satırların sırası ilk açılışa göre; bir
       fiilin son tablosu kapanınca satırı boşalıp kendiliğinden
       kapanıyor, komşu fiiller yer değiştirmiyor. */
    var satirlar = [];
    /* Eski ayırıcılar önce siliniyor: sayıma karışırlarsa kendilerine
       satır açtırıp her çağrıda çoğalıyorlardı (ölçüldü: iki fiil için
       dört ayırıcı, ızgara 966 px). */
    izgara.querySelectorAll('.fdm-ayirici').forEach(function (c) { c.remove(); });
    fdmEsnekFiilCoz(izgara);        /* ortak mâzî hangi fiile katılıyor? */
    fdmFiilAdlariTazele(izgara);    /* başlıktaki fiil adı güncellensin */
    var fiiller = [];
    izgara.querySelectorAll('.fdm-hucre').forEach(function (h) {
        var gr = h.getAttribute('data-fiil') || 'x';
        if (fiiller.indexOf(gr) < 0) fiiller.push(gr);
    });
    satirKipi = (fdmEtkinDizim(fiiller.length) === 'satir');
    /* Kip fiil sayısıyla değişmiş olabilir: düğmenin yazısı da güncelleniyor. */
    if (tahtaEl) fdmDizimYazi(tahtaEl);
    izgara.querySelectorAll('.fdm-hucre').forEach(function (h) {
        var tip = h.getAttribute('data-tip') || 'isim';
        var grup = h.getAttribute('data-fiil') || 'x';
        var kt = grup + '|' + tip;
        sayac[kt] = (sayac[kt] || 0) + 1;
        var anahtar = grup + '#' + (sayac[kt] - 1);
        h.dataset.fdmSatir = anahtar;
        if (satirlar.indexOf(anahtar) < 0) satirlar.push(anahtar);
    });
    /* AYIRICI ÇİZGİ: fiil kuşakları arasına ince bir çizgi konuyor
       (Geylani: "ayırıcı çizgi olsun"). Izgarada her fiile İKİ sıra
       ayrılıyor — biri çizgi, biri tablolar; ilk fiilin önünde çizgi
       olmuyor. Satır kipinde çizgi dikey. */
    var turler = [];
    izgara.querySelectorAll('.fdm-hucre').forEach(function (h) {
        var tip = h.getAttribute('data-tip') || 'isim';
        var s = window.FDM_SUTUN[tip] || 4;
        if (turler.indexOf(s) < 0) turler.push(s);
        var i = satirlar.indexOf(h.dataset.fdmSatir);
        h.dataset.fdmSira = String(i + 1);          /* rıhtım simgesi bunu kullanıyor */
        var r = 2 * i + 1;                          /* fiil sırası: 1, 3, 5… */
        var c = 2 * s - 1;                          /* tür sırası:  1, 3, 5… */
        if (satirKipi) {                 /* tür = SATIR, fiil = sütun */
            h.style.gridRow = String(c);
            h.style.gridColumn = String(r);
        } else {                         /* tür = SÜTUN, fiil = satır */
            h.style.gridColumn = String(c);
            h.style.gridRow = String(r);
        }
    });
    /* Çizgi ızgaranın bir ucundan öbür ucuna uzanmalı. `1 / -1` burada
       işe yaramıyor: ızgaranın açık (explicit) şablonu yok, `-1` ilk
       çizgiye düşüyor ve ayırıcı tek sütuna sıkışıyordu (ölçüldü:
       1540 px'lik ızgarada çizgi 466 px). Bu yüzden kapsanacak şerit
       sayısı elle veriliyor: en büyük tür sırası × 2 − 1. */
    var enBuyukTur = 1;
    for (var ti = 0; ti < turler.length; ti++) enBuyukTur = Math.max(enBuyukTur, turler[ti]);
    var serit = 2 * enBuyukTur - 1;
    izgara.dataset.serit = String(serit);
    /* Yatay ve dikey şerit sayıları AYRI: kipe göre eksenler yer
       değiştiriyor. Tam ekranda sütunlar paylaştırılırken bu gerekiyor —
       eskiden tür sayısı (serit) kullanılıyordu, iki fiil açıkken beş
       sütun açılıp biri BOŞ kalıyordu ve tablolar ekranın üçte ikisine
       sıkışıyordu (ölçüldü: 1fr auto 1fr auto 1fr, üçüncü şerit boş;
       Geylani: "iki fiil varsa tam ekranda kutular büyük olsun, illa 3
       fiile gerek yok ekranı doldurmak için"). */
    var fiilSerit = Math.max(1, 2 * satirlar.length - 1);
    izgara.dataset.enSerit = String(satirKipi ? fiilSerit : serit);
    izgara.dataset.boySerit = String(satirKipi ? serit : fiilSerit);
    function ayirici(dikey, hat) {
        var cz = document.createElement('div');
        cz.className = 'fdm-ayirici' + (dikey ? ' fdm-ayirici-dikey' : '');
        if (dikey) { cz.style.gridColumn = String(hat); cz.style.gridRow = '1 / span ' + serit; }
        else { cz.style.gridRow = String(hat); cz.style.gridColumn = '1 / span ' + serit; }
        izgara.appendChild(cz);
    }
    /* ÇİZGİ SAYISI KUTUYA DEĞİL FİİLE BAĞLI: iki fiil varsa bir çizgi,
       üç fiil varsa iki çizgi — o fiilden bir tablo da açılmış olsa üç
       tablo da (Geylani). Çizgi yalnız fiil kuşaklarının ARASINDA,
       ızgaranın bir ucundan öbür ucuna uzanıyor; kutuların çevresinde
       çizgi yok. Bir fiilin tabloları satır boyunca diziliyorsa çizgi
       yatay, sütun boyunca diziliyorsa dikey oluyor. */
    for (var ci = 1; ci < satirlar.length; ci++) ayirici(satirKipi, 2 * ci);
    var t = izgara.closest ? izgara.closest('.fdm-tahta') : null;
    if (t) { fdmGorusOlc(t); window.fdmSimgeleriYenile(t); }
}

/* Tahtayı ekrana sığdır ve ortala (yeşil düğme · ilk açılış). */
/* ============ ÖLÇEK ARTIK YERLEŞİMLE (zoom) ============
   Tahta eskiden `transform: scale()` ile büyüyordu: yazılar bir kez
   çizilip sonra gerdiriliyor, büyüdükçe netlik kaybediliyordu (Geylani:
   "tablo büyüdükçe netleşme azalmasın"). Artık ölçek GÖRÜŞ
   PENCERESİNE `zoom` olarak veriliyor; tarayıcı yazıyı gerçek boyunda
   yeniden diziyor, yani her ölçekte cam gibi net. Tahtanın kendi
   `left/top`u ölçekten etkilenmiyor (zoom çocukta), sürükleme ve
   yerleştirme matematiği olduğu gibi kalıyor.
   Tahtanın ekrandaki ölçüsü artık ölçeğin DOĞRUSAL bir işlevi:
   W(k) = görüşün kendi eni × k + çerçeve payı. */
function fdmTahtaTaban(t) {
    var g = t.querySelector('.fdm-gorus');
    var k0 = parseFloat(t.style.getPropertyValue('--fdm-olcek')) || 1;
    if (!g || !g.offsetWidth) return { lw: 0, lh: 0, bw: t.offsetWidth, bh: t.offsetHeight };
    return { lw: g.offsetWidth, lh: g.offsetHeight,
             bw: t.offsetWidth - g.offsetWidth * k0,
             bh: t.offsetHeight - g.offsetHeight * k0 };
}
function fdmTahtaOlcu(tb, k) { return { w: tb.lw * k + tb.bw, h: tb.lh * k + tb.bh }; }

window.fdmTahtaSigdir = function (ilk) {
    var t = document.getElementById('fdm-tahta');
    if (!t) return;
    t.classList.remove('fdm-yuzen');
    t.classList.remove('fdm-tam');     /* kendiliğinden sığdırma tam ekrandan çıkarır */
    if (window.fdmSariTusYazi) window.fdmSariTusYazi();
    if (window.fdmYesilTusYazi) window.fdmYesilTusYazi();
    var tb = fdmTahtaTaban(t);
    if (!tb.lw && !tb.bw) return;
    var pay = 24;
    var k = Math.min(1, (window.innerWidth - pay - tb.bw) / (tb.lw || 1),
                        (window.innerHeight - pay - tb.bh) / (tb.lh || 1));
    k = Math.max(0.35, Math.min(3.2, k));
    t.style.setProperty('--fdm-olcek', k);
    var o = fdmTahtaOlcu(tb, k);
    window.fdmEkranaYerlestir(t,
        Math.round((window.innerWidth - o.w) / 2),
        Math.round((window.innerHeight - o.h) / 2));
    if (!ilk && typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
};

/* ============ SARI DÜĞME: YÜZEN MOD ============
   MacBook'ta sarı nokta pencereyi Dock'a indirir; burada pencere yok
   olmuyor, KÜÇÜLÜP SOL ALT KÖŞEYE park ediyor — "bi nevi simge haline
   almak ama biz yüzme moduna alacağız" (Geylani). Böylece tahta ekranda
   kalırken kalıp tablosunun üstünden çekiliyor: yandaki kalıbın
   numarasına rahatça basılıp ikinci, üçüncü çekim tahtaya ekleniyor.
   Yüzerken tablo eklenirse mod bozulmuyor, tahta küçük kalıyor; işi
   bitince sarıya bir daha basınca eski ölçeğine ve eski yerine dönüyor.
   (Saydamlaştırma bunun yanında gereksiz kaldığı için kaldırıldı.) */
window.fdmTahtaYuzen = function (e, ac) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    var t = document.getElementById('fdm-tahta');
    if (!t) return;
    var olacak = (typeof ac === 'boolean') ? ac : !t.classList.contains('fdm-yuzen');
    if (olacak) {
        if (!t.classList.contains('fdm-yuzen'))
            t.dataset.eskiOlcek = parseFloat(t.style.getPropertyValue('--fdm-olcek')) || 1;
        t.classList.add('fdm-yuzen');
        /* Rıhtıma inerken tam ekran kipi bırakılıyor: yoksa rıhtımdayken
           yapılan ölçümler tam ekran hesabına düşüp simgenin ölçeğini
           bozuyordu. Rıhtımdan çıkışta zaten yeniden açılıyor. */
        t.classList.remove('fdm-tam');
        t.classList.remove('fdm-tam-yakin');
        t.style.setProperty('--fdm-olcek', 1);   /* rıhtım zaten küçük */
        window.fdmSimgeleriYenile(t);
        window.fdmYuzenYerlestir();
        window.fdmYesilTusYazi();
    } else {
        t.classList.remove('fdm-yuzen');
        var k = parseFloat(t.dataset.eskiOlcek) || 1;
        t.style.setProperty('--fdm-olcek', k);
        fdmGorusOlc(t);                          /* rıhtımdayken ölçülemiyordu */
        /* RIHTIMDAN ÇIKIŞ = TAM EKRAN. Hazır çekimler ya simge hâlinde
           duruyor ya da bütün ekranı kaplıyor; arada bir pencere yok
           (Geylani: "hazır fiiller kısmına tıklanırsa direkt tam ekran
           olarak açılsın, ya tamamen küçültülsün ya da tam ekran
           olsun"). Önce ekrana sığdırılıp ortalanıyor: tam ekrandan
           çıkınca tahta düzgün bir yerde belirsin. */
        window.fdmTahtaSigdir(true);
        window.fdmTamAc(t);
    }
    window.fdmSariTusYazi();
    /* Rıhtıma inince kök levhası geri gelsin, ⓘ ve başlık kilidi açılsın;
       tablolar açılınca yeniden çekilsin. */
    window.fdmKokLevhaTazele();
    if (e && typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
};

/* ---- RIHTIM SİMGELERİ ----
   Küçültme modunda tablolar KÜÇÜLTÜLMÜŞ HÂLDE değil, her tablo için
   BİR SİMGE olarak duruyor (Geylani: "kaç tablo varsa her tablo için bi
   svg olsun, tablolar arasında gezilme vs olmayacak"). Simge: minik bir
   çekim tablosu çizimi, üstünde kalıp numarası; dolgu fiillerde yeşil,
   isimlerde mavi — sayfanın kendi renkleri. Simgeye basınca tablolar
   açılıp o tablo ortalanıyor. */
window.fdmSimgeleriYenile = function (t) {
    t = t || document.getElementById('fdm-tahta');
    if (!t) return;
    var kap = t.querySelector('.fdm-simgeler');
    if (!kap) return;
    var hucreler = t.querySelectorAll('.fdm-hucre');
    if (!hucreler.length) { kap.innerHTML = ''; return; }

    /* TEK BİR TABLO SİMGESİ. Kaç tablo açıksa simgenin içinde o kadar
       GÖZ var ve gözler tabloların dizilişini birebir taşıyor: 2 mâzî +
       2 muzâri + 2 emir → 2 satır 3 sütunluk göz; üç mâzî → 1 sütun
       3 satır (Geylani: "kaç tablo açılırsa açılsın sadece bi tane
       yüzen tablo svg olacak, açılan tablo sayısında da göz olacak").
       Göz rengi türün rengi: fiil yeşil, isim mavi. */
    var yer = [], sutunlar = [], satirlar = [];
    var satirKipi0 = (window.FDM_DIZIM === 'satir');
    Array.prototype.forEach.call(hucreler, function (h) {
        /* Izgarada fiil kuşakları arasında ayırıcı satırlar var; simgede
           onlar yok, bu yüzden sıralama `fdmSira`dan okunuyor. */
        var tur = window.FDM_SUTUN[h.getAttribute('data-tip') || 'isim'] || 4;
        var fiilSira = parseInt(h.dataset.fdmSira, 10) || 1;
        var s = satirKipi0 ? fiilSira : tur;
        var r = satirKipi0 ? tur : fiilSira;
        var tip = h.getAttribute('data-tip') || 'isim';
        yer.push({ s: s, r: r, tip: tip });
        if (sutunlar.indexOf(s) < 0) sutunlar.push(s);
        if (satirlar.indexOf(r) < 0) satirlar.push(r);
    });
    sutunlar.sort(function (a, b) { return a - b; });   /* 1 = mâzî = EN SAĞ */
    satirlar.sort(function (a, b) { return a - b; });

    var GEN = 26, YUK = 20, ARA = 5, PAY = 7;
    var en = sutunlar.length * GEN + (sutunlar.length - 1) * ARA + 2 * PAY;
    var boy = satirlar.length * YUK + (satirlar.length - 1) * ARA + 2 * PAY;
    var gozler = '';
    yer.forEach(function (v) {
        /* RTL: 1 numaralı sütun sağda */
        var si = sutunlar.length - 1 - sutunlar.indexOf(v.s);
        var ri = satirlar.indexOf(v.r);
        gozler += '<rect x="' + (PAY + si * (GEN + ARA)) + '" y="' + (PAY + ri * (YUK + ARA)) +
                  '" width="' + GEN + '" height="' + YUK + '" rx="4" fill="' +
                  (v.tip === 'isim' ? '#3b82f6' : '#22c55e') + '"/>';
    });
    /* SVG'ye açık ölçü veriliyor: yalnız viewBox'la bırakılınca kap
       küçücük kalıyordu (ölçüldü: rıhtım 24×24 px). */
    var kOl = Math.min(112 / en, 96 / boy, 3.2);
    var svg = '<svg width="' + Math.round(en * kOl) + '" height="' + Math.round(boy * kOl) +
              '" viewBox="0 0 ' + en + ' ' + boy + '" aria-hidden="true">' +
              '<rect x="1" y="1" width="' + (en - 2) + '" height="' + (boy - 2) +
              '" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>' + gozler + '</svg>';
    kap.innerHTML =
        '<button type="button" class="fdm-simge" title="' + hucreler.length +
        ' çekim tablosu — açmak için tıkla" aria-label="Çekim tablolarını aç">' +
        svg + '</button>';
};

/* Sarı düğmenin ipucu metni her zaman gerçek durumu söylesin (yeşil
   düğme de yüzen moddan çıkarabiliyor). */
window.fdmSariTusYazi = function () {
    var t = document.getElementById('fdm-tahta');
    var btn = t && t.querySelector('.fdm-sari');
    if (!btn) return;
    btn.title = t.classList.contains('fdm-yuzen')
        ? 'Eski boyuna döndür'
        : 'Yüzen moda al — küçülüp köşeye park eder';
};

/* ============ YEŞİL DÜĞME: TAHTANIN TAM EKRANI ============
   Tam ekran yalnız tek bir tabloya değil, HEPSİNİ TAŞIYAN TAHTAYA da
   var (Geylani: "sadece bi tablo için değil, hepsini kapsayan konteynır
   için de"). Tahta sayfanın tamamına oranını bozmadan yayılıyor —
   gerekirse 1'in üstüne de büyüyerek. İkinci basış eski ölçeğe ve eski
   yere döndürüyor. */
window.fdmTahtaTamEkran = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    var t = document.getElementById('fdm-tahta');
    if (!t) return;
    if (t.classList.contains('fdm-tam')) {
        t.classList.remove('fdm-tam');
        var g0 = t.querySelector('.fdm-gorus'), iz0 = t.querySelector('.fdm-izgara');
        if (g0) { g0.style.width = ''; g0.style.height = ''; }
        if (iz0) { iz0.style.gridTemplateColumns = ''; delete iz0.dataset.tamHucreEn; }
        t.classList.remove('fdm-tam-yakin');
        fdmGorusOlc(t);     /* pencere kipinin kendi ölçüsü geri gelsin: yoksa
                               görüş içeriğe göre şişiyor, yakınlaşınca pencere
                               büyüyordu (ölçüldü: 1049 → 2755 px) */
        var k = parseFloat(t.dataset.tamEskiOlcek) || 1;
        t.style.setProperty('--fdm-olcek', k);
        if (t.dataset.tamEskiSol !== undefined) {
            t.style.left = t.dataset.tamEskiSol + 'px';
            t.style.top = t.dataset.tamEskiUst + 'px';
        }
        /* Tam ekrana girerken kaydedilen ölçü artık küçük gelebilir:
           ikinci tablo tam ekranı kendiliğinden açıyor, sonra üçüncü,
           dördüncü tablo ekleniyor. Çıkışta tahta ekrana sığmıyorsa
           sığdırılıp ortalanıyor (ölçüldü: 1075×940 tahta 860 px'lik
           ekranda 88 px taşıyordu). */
        setTimeout(function () {
            if (t.offsetWidth > window.innerWidth - 20 ||
                t.offsetHeight > window.innerHeight - 20) window.fdmTahtaSigdir(true);
            else window.fdmGorunurKil(t);
        }, 240);
    } else {
        window.fdmTamAc(t);
    }
    window.fdmYesilTusYazi();
    window.fdmSariTusYazi();
    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
};
/* Tam ekranı SESSİZCE açar (rıhtımdan çıkış ve ikinci tablo bunu
   kullanıyor; kendi tık sesleri zaten var). */
window.fdmTamAc = function (t) {
    if (!t || t.classList.contains('fdm-tam')) return;
    t.dataset.tamEskiOlcek = parseFloat(t.style.getPropertyValue('--fdm-olcek')) || 1;
    t.dataset.tamEskiSol = window.fdmYer(t).l;
    t.dataset.tamEskiUst = window.fdmYer(t).t;
    t.classList.remove('fdm-yuzen');
    t.classList.add('fdm-tam');
    window.fdmTamYerlestir();
    window.fdmYesilTusYazi();
    window.fdmSariTusYazi();
    window.fdmKokLevhaTazele();
};
/* TAM EKRAN: EKRANIN %100'Ü. Tahta ölçeklenip ortalanmıyor — görüş
   penceresi ekran kadar açılıyor ve tablolar SÜTUNLARI PAYLAŞARAK
   genişliyor. Böylece kenarlarda boşluk kalmıyor, ekranda tablodan
   başka bir şey görünmüyor (Geylani: "ekranın %100'ünü kullanalım…
   özellikle yatay olarak kenarlarda çok boşluk olmasın"). Tarayıcının
   kendi tam ekran kipi istenmiyor. */
var FDM_TAM_EN_COK = 2.2;      /* tam ekranda içerik en çok bu kadar büyür */
window.fdmTamYerlestir = function () {
    var t = document.getElementById('fdm-tahta');
    if (!t || !t.classList.contains('fdm-tam')) return;
    var g = t.querySelector('.fdm-gorus'), iz = t.querySelector('.fdm-izgara');
    if (!g || !iz) return;
    var a = fdmTamAlan();
    t.style.setProperty('--fdm-olcek', 1);
    g.style.width = ''; g.style.height = '';
    t.classList.remove('fdm-tam-yakin');
    delete iz.dataset.tamHucreEn;
    fdmTamSutunlar(iz, true);                 /* önce DOĞAL ölçü (500 px şerit) */
    var cerceveEn = t.offsetWidth - g.offsetWidth;
    var cerceveBoy = t.offsetHeight - g.offsetHeight;
    var enUygun = Math.max(240, window.innerWidth - cerceveEn);
    var boyUygun = Math.max(160, a.boy - cerceveBoy);
    /* ÖLÇEK EKRANI DOLDURACAK KADAR: tablolar kendi doğal ölçüsünde ne
       kadar yer kaplıyorsa, ekranın eni ve boyu hangisi önce dolarsa o
       oran seçiliyor. Böylece iki fiil açıkken de kutular büyüyor —
       ekranı doldurmak için üç fiil gerekmiyor. Eskiden ölçek 1'i
       geçemiyordu, iki fiilde tablolar küçücük kalıyordu. */
    var dogalEn = Math.max(1, iz.offsetWidth);
    /* BÜTÜN SATIRLAR EKRANA SIĞSIN. Eskiden yalnız İKİ satırlık boy
       ölçülüyordu; sütun düzeninde bir fiilin mâzî-muzâri-emri alt
       alta geldiği için üçüncü satır ekranın altından taşıyordu
       (ölçüldü: iki fiil / altı tablo, taşma 212 px). Artık en alttaki
       tablonun altı esas alınıyor. */
    var boyOl = fdmTamIcerikBoyu(iz);
    var ikiKip = false;
    var dogalBoy = Math.max(1, boyOl.tum);
    var k = fdmTamOlcek(enUygun, boyUygun, dogalEn, dogalBoy);
    /* Satır çok olduğunda hepsini sığdırmak yazıyı okunmaz hâle
       getirir; o zaman iki satırlık ölçüye dönülüyor, gerisi
       kaydırılarak geziliyor. */
    if (k < FDM_TAM_EN_AZ && boyOl.iki < boyOl.tum) {
        ikiKip = true;
        dogalBoy = Math.max(1, boyOl.iki);
        k = fdmTamOlcek(enUygun, boyUygun, dogalEn, dogalBoy);
    }
    t.style.setProperty('--fdm-olcek', k);
    g.style.width = Math.round(enUygun / k) + 'px';
    g.style.height = Math.round(boyUygun / k) + 'px';
    fdmTamSutunlar(iz);
    /* Şeritler eşitlenince satırlar biraz uzayabiliyor; içerik hâlâ
       sığmıyorsa ölçek bir kez düzeltiliyor (alt satır yarım
       kalmasın). */
    var boy2 = fdmTamIcerikBoyu(iz);
    var hedefBoy = Math.max(1, ikiKip ? boy2.iki : boy2.tum);
    if (hedefBoy > boyUygun / k + 1) {
        k = Math.max(0.3, boyUygun / hedefBoy);
        t.style.setProperty('--fdm-olcek', k);
        g.style.width = Math.round(enUygun / k) + 'px';
        g.style.height = Math.round(boyUygun / k) + 'px';
    }
    /* Paylaşılan şerit eni saklanıyor: yaklaşırken tablolar bu enle
       birlikte büyüsün, ekranda gördüğü düzen bozulmasın. */
    var h0 = iz.querySelector('.fdm-hucre');
    if (h0 && h0.offsetWidth) iz.dataset.tamHucreEn = String(h0.offsetWidth);
    window.fdmEkranaYerlestir(t, 0, a.ust);
};
/* Izgaranın ilk İKİ satırının boyu (varsayılan görünür pay). */
var FDM_TAM_EN_AZ = 0.45;      /* bunun altına inecekse iki satır sığdırılır */
function fdmTamOlcek(enUygun, boyUygun, en, boy) {
    return Math.max(0.3, Math.min(FDM_TAM_EN_COK,
                    Math.min(enUygun / en, boyUygun / boy)));
}
/* İki ölçü birden: `tum` en alttaki tablonun altı (hepsi görünsün),
   `iki` yalnız iki satırlık boy (satır çoksa geri düşülen ölçü). */
function fdmTamIcerikBoyu(iz) {
    var ust = [], alt = 0;
    iz.querySelectorAll('.fdm-hucre').forEach(function (h) {
        if (ust.indexOf(h.offsetTop) < 0) ust.push(h.offsetTop);
        alt = Math.max(alt, h.offsetTop + h.offsetHeight);
    });
    ust.sort(function (a, b) { return a - b; });
    if (!alt) alt = iz.offsetHeight;
    return { tum: alt, iki: ust.length > 2 ? (ust[2] - FDM_IZGARA_ARA) : alt };
}
/* İçerik şeritleri eşit pay alsın, ayırıcı şeritleri kendi inceliğinde
   kalsın: tek numaralı şeritler tablolara, çift numaralılar çizgilere
   ait (bkz. fdmIzgaraDiz). */
/* İçerik şeridinin ALT SINIRI tablonun kendi eni: `minmax(0, 1fr)`
   şeritleri ekrana zorla sığdırıyordu, bu yüzden tam ekranda İÇERİK
   YAKINLAŞTIRMASI enine çalışmıyordu — tablo boyuna uzayıp enine
   sıkışıyordu (ölçüldü: ic 2'de hücre 724 → 710 px eninde kalıyor,
   boyu 367 → 728'e çıkıyordu). Alt sınır konunca yaklaşınca ızgara
   pencereyi aşıyor ve normal kipteki gibi kaydırarak geziliyor. */
var FDM_HUCRE_EN = 500;        /* .fdm-hucre'nin doğal eni (CSS) */
function fdmTamSutunlar(iz, sabit) {
    var n = parseInt(iz.dataset.enSerit, 10) || parseInt(iz.dataset.serit, 10) || 1;
    /* Yaklaşırken şerit eni PİKSELE sabitleniyor. `max-content` şeritler
       burada işe yaramıyor: hücrenin içindeki taşıyıcılar yüzdeyle
       ölçüldüğü için belirsiz genişlikte çöküyor (ölçüldü: hücre eni
       4.000.006 px). Sabit en hem yerleşimi bozmuyor hem de ızgaranın
       pencereyi aşmasını sağlıyor — asıl istenen bu. */
    var w = parseFloat(iz.dataset.tamHucreEn) || FDM_HUCRE_EN;
    var p = [];
    for (var i = 1; i <= n; i++) {
        p.push(i % 2 ? (sabit ? (Math.round(w) + 'px') : ('minmax(' + FDM_HUCRE_EN + 'px, 1fr)'))
                     : 'auto');
    }
    iz.style.gridTemplateColumns = p.join(' ');
}
/* Yeşil düğmenin simgesi duruma göre: dışa oklar = tam ekran yap,
   içe köşeler = tam ekrandan çık. */
window.fdmYesilTusYazi = function () {
    var t = document.getElementById('fdm-tahta');
    var b = t && t.querySelector('.fdm-yesil');
    if (!b) return;
    var tam = t.classList.contains('fdm-tam');
    b.innerHTML = tam
        ? '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" ' +
          'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6"/></svg>'
        : '&#10530;';
    b.title = tam ? 'Tam ekrandan çık' : 'Tam ekran';
};

/* Rıhtımı ilk açılışta SOL ALT köşeye park eder; sonra öğretmen onu
   dilediği yere sürükleyebiliyor, o yer korunuyor. */
window.fdmYuzenYerlestir = function () {
    var t = document.getElementById('fdm-tahta');
    if (!t || !t.classList.contains('fdm-yuzen')) return;
    if (t.dataset.rihtimTasindi === '1') { window.fdmGorunurKil(t); return; }
    var h = t.offsetHeight;
    window.fdmEkranaYerlestir(t, 16, Math.round(window.innerHeight - h - 16));
};

/* Kırmızı düğme: bütün tabloları kapatır, tahtayı kaldırır. */
window.fdmTahtaKapat = function (e, zorla) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    /* HAZIR ÇEKİMLER KAPANMAZ, KÜÇÜLÜR. Kök seçilince kendiliğinden
       hazırlanan tabloların ✕'i onları yok etmiyor, rıhtıma indiriyor —
       bir daha hazırlanmalarına gerek kalmasın (Geylani: "tüm
       tabloların çarpısına basınca küçülme olsun, tabloların
       kaybolmasına gerek yok"). Elle açılan tablolarda ✕ eskisi gibi
       kapatıyor. `zorla` yalnız yeni hazırlık kurulurken kullanılıyor. */
    var t0 = document.getElementById('fdm-tahta');
    if (!zorla && t0 && t0.dataset.hazir === '1' && !t0.classList.contains('fdm-yuzen')) {
        window.fdmTahtaYuzen(e || null, true);
        return;
    }
    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClose) SoundEngine.playClose();
    document.querySelectorAll('.glass-box.matrix-opened').forEach(function (b) {
        b.classList.remove('matrix-opened');
        b.style.zIndex = '';
    });
    var t = document.getElementById('fdm-tahta');
    if (t) t.remove();
    /* Tahta kapandı: kip seçimi de sıfırlanıyor, yeni tahta yine kurala
       göre açılsın (tek fiil → SATIR, iki ve fazlası → SÜTUN). */
    window.FDM_DIZIM_ELLE = false;
    window.fdmKokLevhaTazele();
};

/* Tek hücreyi kapatır; sonuncu da kapandıysa tahta gider. */
function fdmHucreKapat(hucre) {
    if (!hucre) return;
    var anahtar = hucre.getAttribute('data-anahtar') || '';
    var no = anahtar.split('_')[1];
    var kutu = no ? document.querySelector('.glass-box[data-fdm-no="' + no + '"]') : null;
    var izgara = hucre.parentElement;
    hucre.remove();
    if (izgara) fdmIzgaraDiz(izgara);
    /* Kutunun başka hücresi kalmadıysa kırmızı vurgusu da kalksın */
    if (kutu && !document.querySelector('.fdm-hucre[data-anahtar$="_' + no + '"]')) {
        kutu.classList.remove('matrix-opened');
        kutu.style.zIndex = '';
    }
    if (izgara && !izgara.children.length) {
        var t = document.getElementById('fdm-tahta');
        if (t) t.remove();
    }
    window.fdmTahtaSekmeTazele();
    window.fdmKokLevhaTazele();
}

/* Tahtayı şeritten ya da BOŞ ALANDAN sürükleme (görselde gezer gibi) */
function fdmTahtaSurukle(t) {
    var bar = t.querySelector('.popup-drag-bar');
    var sur = null;
    function bas(e) {
        /* Boş alandan da tutulabilir; hücrenin İÇİ, tutamaklar ve
           DÜĞMELER hariç. Dizim düğmesi de buraya eklendi: sürükleme
           işaretçiyi şeride kilitlediği için tıklama şeride yönleniyor,
           düğmenin `onclick`i hiç çalışmıyordu (Geylani: "sütun tuşu
           çalışmıyor"). */
        if (e.target.closest('.fdm-hucre') || e.target.closest('.fdm-tut') ||
            e.target.closest('.fdm-nokta') || e.target.closest('.fdm-dizim')) return;
        if (sur) return;
        sur = { id: e.pointerId, x: e.clientX, y: e.clientY,
                l: window.fdmYer(t).l, t: window.fdmYer(t).t, hedef: e.currentTarget };
        e.currentTarget.style.cursor = 'grabbing';
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) {}
        e.stopPropagation();
    }
    function kaydir(e) {
        if (!sur || e.pointerId !== sur.id) return;
        if (window._fdmKistirma) return;        /* iki parmak: kıstırma sürüyor */
        e.stopPropagation();
        t.style.left = (sur.l + (e.clientX - sur.x)) + 'px';
        t.style.top = (sur.t + (e.clientY - sur.y)) + 'px';
    }
    function bitir(e) {
        if (!sur || e.pointerId !== sur.id) return;
        try { sur.hedef.releasePointerCapture(sur.id); } catch (x) {}
        sur.hedef.style.cursor = '';
        sur = null;
        e.stopPropagation();
    }
    [bar, t].forEach(function (el) {
        if (!el) return;
        el.addEventListener('pointerdown', bas);
        el.addEventListener('pointermove', kaydir);
        el.addEventListener('pointerup', bitir);
        el.addEventListener('pointercancel', bitir);
    });
    if (bar) bar.addEventListener('dblclick', function (e) {
        e.stopPropagation();
        window.fdmTahtaSigdir();
    });
}

/* ============ KENARDAN / KÖŞEDEN ORANSAL BÜYÜTME ============
   Sekiz tutamağın hangisinden çekilirse çekilsin tek bir ÖLÇEK
   değişiyor: tahta da içindeki bütün tablolar ve yazılar da aynı
   oranda büyüyüp küçülüyor. Çekilen tutamağın KARŞISINDAKİ nokta
   yerinde çakılı kalır; ölçek `scale`in sol üst başlangıcından
   uygulandığı için çapa `left/top` ölçekle birlikte kaydırılarak
   sabitleniyor: left = l0 + ax·(k0 − k).
   Kenar tutamaklarında tek eksenin, köşelerde başlangıç vektörüne
   İZDÜŞÜMÜN oranı alınıyor — parmak karşıya geçse bile ölçek
   sıçramıyor. */
/* Tam ekrandan PENCEREYE dönüş: ölçek ve yer olduğu gibi korunuyor,
   yalnız kip değişiyor. Kenardan tutup küçültme bunu kullanıyor. */
function fdmTamdanKopar(t) {
    if (!t || !t.classList.contains('fdm-tam')) return false;
    var g = t.querySelector('.fdm-gorus'), iz = t.querySelector('.fdm-izgara');
    var r = t.getBoundingClientRect();
    var k = parseFloat(t.style.getPropertyValue('--fdm-olcek')) || 1;
    t.classList.remove('fdm-tam');
    t.classList.remove('fdm-tam-yakin');
    if (iz) { iz.style.gridTemplateColumns = ''; delete iz.dataset.tamHucreEn; }
    if (g) { g.style.width = ''; g.style.height = ''; }
    fdmGorusOlc(t);                       /* pencere kipinin kendi ölçüsü */
    t.style.setProperty('--fdm-olcek', k);
    window.fdmEkranaYerlestir(t, Math.round(r.left), Math.round(r.top));
    window.fdmYesilTusYazi();
    window.fdmSariTusYazi();
    window.fdmKokLevhaTazele();
    fdmTamCikisUyari(t);
    return true;
}

/* "Tam ekrandan çıkıldı" — şeridin altında kısa bir bilgi şeridi. */
function fdmTamCikisUyari(t) {
    var eski = t.querySelector('.fdm-tam-uyari');
    if (eski) eski.remove();
    var u = document.createElement('div');
    u.className = 'fdm-tam-uyari';
    u.textContent = 'Tam ekrandan çıkıldı';
    t.appendChild(u);
    setTimeout(function () { if (u.parentNode) u.parentNode.removeChild(u); }, 1900);
}

function fdmTahtaOlcekle(t) {
    var YONLER = {
        n:  [0.5, 1, 'y'], s:  [0.5, 0, 'y'],
        w:  [1, 0.5, 'x'], e:  [0, 0.5, 'x'],
        nw: [1, 1, 'xy'],  ne: [0, 1, 'xy'],
        sw: [1, 0, 'xy'],  se: [0, 0, 'xy']
    };
    var EN_KUCUK = 0.35, EN_BUYUK = 3.2;
    function suanOlcek() {
        var v = parseFloat(t.style.getPropertyValue('--fdm-olcek'));
        return (v > 0) ? v : 1;
    }
    t.querySelectorAll('.fdm-tut').forEach(function (tut) {
        var d = null;
        tut.addEventListener('pointerdown', function (e) {
            var y = YONLER[tut.getAttribute('data-yon')];
            if (!y || d) return;
            /* KENARDAN TUTUP KÜÇÜLTMEK TAM EKRANDAN ÇIKARIR. Eskiden
               tahta küçülüyor ama `fdm-tam` üstünde kalıyordu: köşeler
               hâlâ keskin, yeşil düğme hâlâ "Tam ekrandan çık" diyordu,
               yani tam ekrandan çıkılıp çıkılmadığı anlaşılmıyordu
               (Geylani). Artık tutamağa dokunulduğu anda pencere kipine
               dönülüyor ve kısa bir uyarı beliriyor. */
            fdmTamdanKopar(t);
            var r = t.getBoundingClientRect();
            d = { id: e.pointerId, eksen: y[2],
                  fx: y[0], fy: y[1], tb: fdmTahtaTaban(t),
                  Ax: r.left + y[0] * r.width, Ay: r.top + y[1] * r.height,
                  k0: suanOlcek(), l0: window.fdmYer(t).l, t0: window.fdmYer(t).t };
            d.dx0 = e.clientX - d.Ax;
            d.dy0 = e.clientY - d.Ay;
            t.classList.add('fdm-boyutlaniyor');
            tut.classList.add('fdm-etkin');
            try { tut.setPointerCapture(e.pointerId); } catch (x) {}
            e.preventDefault(); e.stopPropagation();
        });
        tut.addEventListener('pointermove', function (e) {
            if (!d || e.pointerId !== d.id) return;
            e.stopPropagation();
            var dx = e.clientX - d.Ax, dy = e.clientY - d.Ay, oran;
            if (d.eksen === 'x') oran = d.dx0 ? dx / d.dx0 : 1;
            else if (d.eksen === 'y') oran = d.dy0 ? dy / d.dy0 : 1;
            else {
                var b = d.dx0 * d.dx0 + d.dy0 * d.dy0;
                oran = b ? (dx * d.dx0 + dy * d.dy0) / b : 1;
            }
            var k = Math.max(EN_KUCUK, Math.min(EN_BUYUK, d.k0 * oran));
            t.style.setProperty('--fdm-olcek', k);
            /* Çekilen tutamağın KARŞISINDAKİ nokta yerinde kalsın:
               tahta artık yerleşimle büyüdüğü için ölçü ölçeğin doğrusal
               işlevi — çapa, iki ölçü arasındaki farkın oranı kadar
               kaydırılıyor. */
            var o0 = fdmTahtaOlcu(d.tb, d.k0), o1 = fdmTahtaOlcu(d.tb, k);
            t.style.left = (d.l0 + d.fx * (o0.w - o1.w)) + 'px';
            t.style.top = (d.t0 + d.fy * (o0.h - o1.h)) + 'px';
        });
        var bitir = function (e) {
            if (!d || e.pointerId !== d.id) return;
            try { tut.releasePointerCapture(d.id); } catch (x) {}
            d = null;
            if (window.fdmGorunurKil) window.fdmGorunurKil(t);
            t.classList.remove('fdm-boyutlaniyor');
            tut.classList.remove('fdm-etkin');
            e.stopPropagation();
        };
        tut.addEventListener('pointerup', bitir);
        tut.addEventListener('pointercancel', bitir);
    });
}

/* KAHVERENGİ KÖK LEVHASI (sürüklenebilir فعل tuğlası) çekim tablosu
   açıkken çekilir: tablo genelde onun üstüne düşüyor, levha da hep
   önde durduğu için tablonun içine giriyordu (Geylani: "fiil popup
   açıkken kahverengi kök levhası kaybolsun"). Ekranda TEK BİR tablo
   bile kalmayınca geri geliyor — üç kapanış yolu da (kırmızı nokta,
   tam ekranın kapanışı, tablonun sıfırlanması) buradan geçiyor. */
window.fdmKokLevhaTazele = function () {
    var t = document.getElementById('fdm-tahta');
    /* TAHTANIN VAR OLMASI YETMİYOR, AÇIK OLMASI GEREKİYOR. Çekimler
       kendiliğinden hazırlandığı için tahta artık hemen her zaman var
       ama çoğu zaman RIHTIMDA (küçük simge) duruyor. O hâlde tablolar
       ekranda değil: kahverengi kök levhası görünmeli, ⓘ düğmeleri ve
       dilbilgisi başlıkları çalışmalı (Geylani: "kahverengi kök levhası
       fiil çekim tabloları açılmamışken görünmeli"). */
    var acik = !!t && !t.classList.contains('fdm-yuzen');
    document.body.classList.toggle('fdm-tablo-acik', acik);
    document.body.classList.toggle('fdm-kilit', acik);
    /* `overscroll-behavior` gövdeden görüntü alanına ancak html'in kendi
       değeri auto ise geçiyor; tarayıcının geri-git jesti bu yüzden
       kapanmıyordu. Sınıf html'e de konuyor. */
    document.documentElement.classList.toggle('fdm-tablo-acik', acik);
};

/* HIZLI LİSTE AÇIKKEN ÇEKİM TAHTASI ÇEKİLİR. Tahta sayfanın en üst
   katmanında durduğu için listenin üstüne biniyordu (Geylani: "hızlı
   liste açıldığında fiil çekim popup kısmı tablonun arkasında olsun
   veya geçici olarak kaybolsun"). Liste kapanınca tahta olduğu gibi
   geri geliyor — yeri, ölçeği, kaydırması korunuyor. */
(function () {
    function durumYaz() {
        var o = document.getElementById('fast-dictionary-overlay');
        var acik = !!(o && getComputedStyle(o).display !== 'none');
        document.body.classList.toggle('hizli-liste-acik', acik);
    }
    function sarmala(ad) {
        if (typeof window[ad] !== 'function' || window[ad]._fdmListe) return;
        var eski = window[ad];
        window[ad] = function () {
            var s = eski.apply(this, arguments);
            durumYaz();
            setTimeout(durumYaz, 60);      /* geçiş animasyonundan sonra da doğrula */
            return s;
        };
        window[ad]._fdmListe = 1;
    }
    function kur() {
        sarmala('openFastDictionaryMode');
        sarmala('closeFastDictionaryMode');
        durumYaz();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();
    window.addEventListener('load', kur);
})();

/* BÜYÜTME anahtarı değişince levha/kilit durumu tazeleniyor: anahtar
   açıkken tahta gizlendiği için levha geri gelmeli, kapanınca yeniden
   çekilmeli. */
(function () {
    function kur() {
        var c = document.getElementById('zoomToggleCheckbox');
        if (!c || c._fdmLevha) return;
        c.addEventListener('change', function () {
            if (window.fdmKokLevhaTazele) window.fdmKokLevhaTazele();
        });
        c._fdmLevha = 1;
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();
    window.addEventListener('load', kur);
})();

/* Çekim tahtası ekranda mı? Tahta açıkken ⓘ düğmeleri ve dilbilgisi
   başlıkları çalışmıyor: bunlar tam ekran örtüler açıyor, tahtanın
   üstüne binip öğretmeni tablolardan koparıyordu (Geylani: "popup
   açıkken infolar, dilbilgisi başlıkları çalışmasın"). Saydam kipte de
   kilit sürüyor — hayalet kipte amaç kalıp numaralarına ulaşmak. */
window.fdmTahtaEkranda = function () {
    return !!document.getElementById('fdm-tahta');
};

/* TAHTA SEKMEYE BAĞLI DEĞİL: mücerredde açılan tablolar mezide
   geçilince kaybolmuyor, YÜZEN bir pencere olarak ekranda kalıyor
   (Geylani: "mezid kısmına geçerken popuplar yüzen bi popup a dönsün").
   Böylece mezidde bir tablo daha açıldığında üç harfli fiille mezid
   fiili yan yana karşılaştırılabiliyor. Hangi hücrenin nereden geldiği
   başlıktaki YEŞİL rozetten okunuyor: 3 = mücerred, 3+ = mezid.
   Sekme bandı dönüşümlü olduğu için geçişten sonra tahtanın görüş
   alanında kaldığı bir kez daha doğrulanıyor. */
window.fdmTahtaSekmeTazele = function () {
    var t = document.getElementById('fdm-tahta');
    if (!t) return;
    window.fdmGorunurKil(t);
    window.fdmKokLevhaTazele();
};

/* Kap `position: fixed`; sabit kapta offsetLeft/offsetTop güvenilir
   değil (offsetParent yok). Yeri her zaman hesaplanmış left/top'tan
   okunuyor — dönüşümden de etkilenmiyor. */
window.fdmYer = function (el) {
    var cs = getComputedStyle(el);
    return { l: parseFloat(cs.left) || 0, t: parseFloat(cs.top) || 0 };
};

/* Tablonun kutusuna göre sapmasını sakla / o sapmayla yeniden yerleştir.
   Sekme bandı dönüşümlü olduğu için `fixed` kabın kapsayan bloğu sekme
   değiştikçe değişiyor; aynı `left` değeri öteki sekmede bambaşka bir
   yere düşüyor (ölçüldü: 620 px, dönüşte −847 px oluyordu). */
window.fdmYerKaydet = function (k) {
    var box = k && k.closest ? k.closest('.glass-box') : null;
    if (!box) return;
    var r = box.getBoundingClientRect();
    if (!r.width) return;
    k.dataset.fdmDx = Math.round(window.fdmYer(k).l - r.left);
    k.dataset.fdmDy = Math.round(window.fdmYer(k).t - r.top);
};
/* Kabı EKRANDA istenen noktaya taşır: `left/top` kapsayan bloğa göre
   olduğundan hedef, ölçülen fark kadar düzeltilerek yazılır. */
window.fdmEkranaYerlestir = function (k, x, y) {
    var r = k.getBoundingClientRect();
    if (!r.width) { k.style.left = x + 'px'; k.style.top = y + 'px'; return; }
    var o = window.fdmYer(k);
    k.style.left = Math.round(o.l + (x - r.left)) + 'px';
    k.style.top = Math.round(o.t + (y - r.top)) + 'px';
};
window.fdmYerlestir = function (k) {
    var box = k && k.closest ? k.closest('.glass-box') : null;
    if (!box) return;
    var r = box.getBoundingClientRect();
    if (!r.width) return;
    window.fdmEkranaYerlestir(k, r.left + parseFloat(k.dataset.fdmDx || '0'),
                                 r.top + parseFloat(k.dataset.fdmDy || '0'));
    window.fdmGorunurKil(k);
};

/* SARI NOKTA: tabloyu özgün boyuna döndürür. Ölçek sol üst köşeden
   uygulandığı için konumu düzeltmeye gerek yok — pencere yerinde kalır,
   yalnız boyu bire döner. */
window.fdmBoyuSifirla = function (e, btn) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    var kap = btn && btn.closest ? btn.closest('.conjugation-inline-container') : null;
    if (!kap && btn && btn.parentElement) kap = btn.parentElement;
    if (!kap) return;
    kap.style.setProperty('--fdm-olcek', 1);
    /* Ölçek 0,15 sn'lik geçişle küçülüyor; ölçüyü hemen alsak eski (büyük)
       dikdörtgeni okurduk. Görüş alanına çekme geçişin ardına bırakılıyor. */
    setTimeout(function () { window.fdmGorunurKil(kap); }, 190);
    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
};

/* Pencere büyürken ekranın dışına taşmış olabilir; küçülünce ya da
   boyutlandırma bitince en azından üst şeridi tutulabilir kalsın diye
   görüş alanına çekilir. Ekrandan geniş kaldıysa soldan hizalanır. */
window.fdmGorunurKil = function (kap) {
    if (!kap) return;
    var r = kap.getBoundingClientRect(), pay = 8, dx = 0, dy = 0;
    if (r.width < window.innerWidth - 2 * pay) {
        if (r.left < pay) dx = pay - r.left;
        else if (r.right > window.innerWidth - pay) dx = (window.innerWidth - pay) - r.right;
    } else if (r.left > pay) dx = pay - r.left;
    /* Dikeyde de yatayın aynısı: sığıyorsa iki kenar da içeri alınıyor,
       ekrandan uzunsa üstten hizalanıyor. Eskiden yalnız "üst kenar
       ekranın dibini geçti mi" bakılıyordu; rıhtım sol alt köşedeyken
       tablolar oradan açılınca tahtanın 750 px'i ekranın altında
       kalıyordu (ölçüldü). */
    if (r.height < window.innerHeight - 2 * pay) {
        if (r.top < pay) dy = pay - r.top;
        else if (r.bottom > window.innerHeight - pay) dy = (window.innerHeight - pay) - r.bottom;
    } else if (r.top > pay) dy = pay - r.top;
    if (dx) kap.style.left = (window.fdmYer(kap).l + dx) + 'px';
    if (dy) kap.style.top = (window.fdmYer(kap).t + dy) + 'px';
};

// COKLU POPUP: bir popup'a (matrix-opened kutu) tiklandiginda EN ONE gelsin
(function(){
    /* TEK TAHTA olduğu için "öne getirme" işi kalmadı; işlev, eski
       kurulumlarla uyum için duruyor ama bir şey yapmıyor. */
    function _raisePopup(){ }
    /* TEK YOL: pointerdown fare · dokunuş · kalem üçünü birden karşılar.
       Eskiden mousedown + touchstart ayrı ayrı dinleniyordu; dokunmatik
       cihazda tarayıcı touchstart'ın ardından sahte bir mousedown daha
       üretiyor, aynı tablo iki kez öne alınıyor ve iki tabloya sırayla
       dokununca hangisinin önde olduğu şaşıyordu. */
    document.addEventListener('pointerdown', _raisePopup, true);
})();

// Global tıklama (kapatma) event listener'ı aynen kalıyor
document.addEventListener('click', function(e) {
    const conjugationContainer = e.target.closest('.conjugation-inline-container');
    const glassBox = e.target.closest('.glass-box');
    
    const fullscreenOverlay = e.target.closest('#matrix-fullscreen-overlay');

    if (!conjugationContainer && !glassBox && !fullscreenOverlay) {
        // COKLU POPUP: disariya tiklayinca fiil popuplari KAPANMASIN (sadece X ile kapanir).
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
    const overlay = document.getElementById('keyboard-overlay');
    if (overlay) overlay.style.display = 'none';
    if (typeof toggleKB === 'function') toggleKB(false);
    if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
    if (typeof toggleRootHint === 'function') toggleRootHint(true);

    // ONAYLANMAMIŞ HARFLER BIRAKILMAZ.
    // Klavyede yazılan her harf currentRoot'a ekleniyor, ama kök ancak bir
    // tahmine/köke dokununca ONAYLANIYOR (window.activeConfirmedRoot).
    // Çarpıyla (ya da Esc ile) çıkınca yarım kalan harfler currentRoot'ta
    // asılı kalıyordu: sonra herhangi bir kalıba dokunmak o üç harfi kök
    // sanıp kutulara yerleştiriyor, kalıp listesi perdesi de "kök seçili"
    // diye açılmıyordu. Kullanıcı hiçbir kök seçmemişti — vazgeçmişti.
    // Onaylı kökle aynıysa dokunmuyoruz (hızlı sözlük gibi akışlar bozulmasın).
    var onayliKok = (typeof window.activeConfirmedRoot === 'string')
        ? window.activeConfirmedRoot.trim() : "";
    if (typeof currentRoot !== 'undefined' && currentRoot && currentRoot !== onayliKok) {
        currentRoot = "";
        const tempDisp = document.getElementById('temp-root-display');
        if (tempDisp) tempDisp.innerText = "";
        if (typeof updateTempDisplay === 'function') updateTempDisplay();
        if (typeof updateMainKeyboardPredictions === 'function') updateMainKeyboardPredictions();
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
        window.activeConfirmedRoot = currentRoot;
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
    // MEZİD SEKMESİNİN ALTINDAKİ KIRMIZI ÇİZGİ (heartbeat-active) DA SİLİNİR.
    // Kök seçilince "bu kökün mezidde de örneği var" diye beliriyordu;
    // animasyonu 4 sn'de bir tekrarlayan sonsuz bir süpürme olduğu için
    // sıfırlamadan SONRA da aralıklarla yeniden görünüyordu — sınıf
    // burada temizlenmediği sürece çizgi ölmüyordu.
    const mezidCizgi = document.querySelector('.mezid-btn.heartbeat-active');
    if (mezidCizgi) mezidCizgi.classList.remove('heartbeat-active');
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
    window.activeConfirmedRoot = "";
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
            if (isDown) {
                const x = e.touches[0].pageX - wrapper.offsetLeft;
                const walk = (x - startX) * 1.5;
                wrapper.scrollLeft = scrollLeft - walk;
            }
        }, { passive: true });
    });
});

/* MENÜ AÇIKKEN BAŞKA HER YERE DOKUNUŞ MENÜYÜ KAPATIR (Geylani:
   "+ ya basıldığında başka herhangi bi yere dokunulursa kapansın").
   YAKALAMA aşamasında dinlenir: kutuların ve araç çubuğu ikonlarının
   kendi işleyicileri stopPropagation çağırıyor, kabarma aşamasındaki
   eski dinleyiciye tıklama HİÇ ulaşmıyordu — menü kutuya basınca açık
   kalıyordu. Muaf tutulanlar yalnız menünün KENDİ içi ve aç/kapa
   görevindeki "+" tuşları. */
document.addEventListener('click', function (e) {
    var menu = document.getElementById('suffix-dropdown');
    if (!menu || menu.style.display === 'none') return;
    if (!e.target || !e.target.closest) return;
    if (menu.contains(e.target)) return;                        /* menünün içi */
    if (e.target.closest('.fa-plus') || e.target.closest('#mobile-top-plus')) return;
    if (e.target.closest('#ek-bilgi-perde')) return;            /* eski bilgi perdesi */
    window.ekMenuKapat();
}, true);

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
   ŞEMA SORUSU ("SOR") — aksâm-ı seb'a şemasını kendi kendini yoklama
   tahtasına çevirir. Kavram şemasındaki eski SOR düğmesinin aynısı, ama
   artık ŞEMANIN HER KOPYASINDA çalışıyor: maraton süzgecinde de, vezin
   örnek listelerindeki süzgeçte de. Bir parça ("Grup?", "Fiil?", "Tanım?",
   "Örnek?") gizlenir; öğrenci cevabı söyleyip kutuya dokununca açılır.
   ========================================================================= */
window.SEMA_SORU_ETIKET = {
    'kl-sema-baslik': 'Grup?',
    'kl-sk-ad':       'Hangi fiil?',
    'kl-sk-tanim':    'Tanımı?',
    'kl-sk-ornek':    'Örnek?'
};

/* =========================================================================
   ODAK KİPİ — şemayı büyütüp öne alır
   -------------------------------------------------------------------------
   Süzgeçteki şema küçüktür; hatırlatma için yetmez. SOR'a basınca ya da
   başlıktaki büyüteç düğmesine dokununca şema olduğu yerden alınıp tam
   ekran bir levhaya taşınır, kartlar büyür. Öğrenci hatırlayıp küçültünce
   şema kendi yerine geri döner ve yine süzgeç olarak çalışır.
   Odakta kartlar SÜZMEZ: burası ara verme yeri, süzme yeri değil.
   ========================================================================= */
window._semaOdak = { sema: null, ebeveyn: null, komsu: null };

function semaOdakPerde() {
    var p = document.getElementById('sema-odak-perde');
    if (p) return p;
    p = document.createElement('div');
    p.id = 'sema-odak-perde';
    p.innerHTML =
        '<div class="so-levha" role="dialog" aria-label="Aksâm-ı Seb\'a hatırlatma">' +
          '<div class="so-tepe">' +
            '<span class="so-baslik">AKSÂM-I SEB\'A</span>' +
            '<span class="so-ip">Kısa bir hatırlatma — bitince küçültüp süzmeye devam et</span>' +
            '<button type="button" class="so-kucult" onclick="semaOdakKapat()" title="Küçült ve süzgece dön">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M9 3v6H3M15 21v-6h6M3 15h6v6M21 9h-6V3"/></svg>Küçült' +
            '</button>' +
          '</div>' +
          '<div class="so-govde"></div>' +
        '</div>';
    p.addEventListener('click', function (e) { if (e.target === p) window.semaOdakKapat(); });
    document.body.appendChild(p);
    return p;
}

window.semaOdakAc = function (sema) {
    if (!sema || window._semaOdak.sema) return;
    var perde = semaOdakPerde();
    window._semaOdak.sema = sema;
    window._semaOdak.ebeveyn = sema.parentNode;
    window._semaOdak.komsu = sema.nextSibling;
    perde.querySelector('.so-govde').appendChild(sema);
    sema.classList.add('kl-sema-odak');
    perde.style.display = 'flex';
    requestAnimationFrame(function () { perde.classList.add('so-acik'); });
    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
};

window.semaOdakKapat = function () {
    var o = window._semaOdak;
    if (!o.sema) return;
    var perde = document.getElementById('sema-odak-perde');
    o.sema.classList.remove('kl-sema-odak');
    /* Açıkta kalan soru varsa geri getir: süzgeçte yarım soru durmasın. */
    o.sema.querySelectorAll('.kl-gizli').forEach(function (e) {
        e.classList.remove('kl-gizli'); e.removeAttribute('data-soru');
    });
    if (o.ebeveyn) o.ebeveyn.insertBefore(o.sema, o.komsu || null);
    window._semaOdak = { sema: null, ebeveyn: null, komsu: null };
    if (perde) {
        perde.classList.remove('so-acik');
        setTimeout(function () { perde.style.display = 'none'; }, 200);
    }
    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClose) SoundEngine.playClose();
};

/* Odakta kart tıklaması süzgeci çalıştırmasın — yalnız gizli cevap açılır. */
document.addEventListener('click', function (e) {
    if (!window._semaOdak.sema) return;
    if (!e.target || !e.target.closest) return;
    if (e.target.closest('.kl-gizli')) return;           /* cevap açma serbest */
    if (e.target.closest('.kl-sor-serit, .so-tepe')) return;  /* düğmeler serbest */
    if (e.target.closest('.kl-sema-odak .kl-sema-kart')) {
        e.preventDefault(); e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }
}, true);

/* Başlığın yanındaki büyüteç: soru sormadan yalnız büyütür. */
window.semaBuyut = function (dugme) {
    var sema = semaBul(dugme);
    if (!sema) return;
    if (window._semaOdak.sema) { window.semaOdakKapat(); return; }
    window.semaOdakAc(sema);
};

function semaBul(dugme) {
    if (!dugme || !dugme.closest) return null;
    var sema = dugme.closest('.kl-sema');
    if (sema) return sema;
    var kap = dugme.closest('.mt-kol-sema, .kl-suzgec, .mt-govde, .kl-pullar');
    sema = kap ? kap.querySelector('.kl-sema') : null;
    if (sema) return sema;
    /* Zaten odaktaysa oradan bul. */
    return window._semaOdak.sema || document.querySelector('.kl-sema');
}

/* Başlık yanına giren büyüteç düğmesi (maraton başlığı, şema başlığı). */
window.semaBuyutecBtn = function () {
    return '<button type="button" class="kl-buyutec" onclick="event.stopPropagation(); semaBuyut(this)" ' +
             'title="Şemayı büyüt — aksâm-ı seb\'ayı hatırla" aria-label="Şemayı büyüt">' +
             '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
               '<path d="M3 9V3h6M21 15v6h-6M15 3h6v6M9 21H3v-6"/></svg></button>';
};

window.semaSor = function (dugme) {
    var sema = semaBul(dugme);
    if (!sema) return;
    /* SOR önce büyütür: küçük şemada hatırlatma iş görmüyor. */
    if (!window._semaOdak.sema) window.semaOdakAc(sema);

    /* Önce açıkta olanı geri getir: her seferinde tek soru sorulur. */
    sema.querySelectorAll('.kl-gizli').forEach(function (e) {
        e.classList.remove('kl-gizli'); e.removeAttribute('data-soru');
    });

    /* Boş (o kalıpta örneği olmayan) kartlar soru olmaz — cevabı yok. */
    var adaylar = [];
    sema.querySelectorAll('.kl-sema-baslik').forEach(function (e) { adaylar.push(e); });
    sema.querySelectorAll('.kl-sema-kart').forEach(function (k) {
        if (k.classList.contains('kl-sema-bos') || k.disabled) return;
        ['kl-sk-ad', 'kl-sk-tanim', 'kl-sk-ornek'].forEach(function (s) {
            var e = k.querySelector('.' + s);
            if (e && e.textContent.trim()) adaylar.push(e);
        });
    });
    if (!adaylar.length) return;

    var sec = adaylar[Math.floor(Math.random() * adaylar.length)];
    var sinif = ['kl-sema-baslik', 'kl-sk-ad', 'kl-sk-tanim', 'kl-sk-ornek']
        .find(function (s) { return sec.classList.contains(s); });
    sec.setAttribute('data-soru', window.SEMA_SORU_ETIKET[sinif] || '?');
    sec.classList.add('kl-gizli');

    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
};

/* Gizli parçaya dokunmak cevabı açar. Yakalama evresinde dinliyoruz:
   şema kartları aynı zamanda süzgeç düğmesi olduğu için, cevabı açan
   tıklama süzgeci ÇALIŞTIRMAMALI. */
document.addEventListener('click', function (e) {
    var g = e.target && e.target.closest ? e.target.closest('.kl-gizli') : null;
    if (!g) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    g.classList.remove('kl-gizli');
    g.removeAttribute('data-soru');
    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
}, true);

/* Şemanın altına giren SOR şeridinin ortak markup'ı. */
window.semaSorSerit = function () {
    return '<div class="kl-sor-serit">' +
             '<button type="button" class="kl-sor-btn" onclick="semaSor(this)">' +
               '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                 '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.2a2.7 2.7 0 1 1 3.4 2.6c-.5.2-.8.7-.8 1.2v.5"/>' +
                 '<circle cx="12" cy="17" r=".9" fill="currentColor" stroke="none"/>' +
               '</svg>SOR' +
             '</button>' +
             '<span class="kl-sor-ip">Bir kutu gizlenir — cevabı söyle, sonra dokunup aç</span>' +
           '</div>';
};

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
        son: "isim", tur: "on", ad: "Harf-i Ta'rîf", altAd: "belirlilik takısı", renk: "#2980B9",
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
        son: "ikisi", tur: "on", ad: "Atıf Vâv'ı", altAd: "«ve»", renk: "#20C997",
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
        son: "ikisi", tur: "on", ad: "Lâm-ı Cer", altAd: "«için, -e ait»", renk: "#F39C12",
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
        son: "ikisi", tur: "on", ad: "Atıf Fâ'sı", altAd: "«ve hemen ardından»", renk: "#20C997",
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
        son: "isim", tur: "on", ad: "Kâf-ı Teşbîh", altAd: "«gibi»", renk: "#A78BFA",
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
        son: "isim", tur: "on", ad: "Bâ-i Cer", altAd: "«ile, -de»", renk: "#F39C12",
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
        son: "isim", tur: "son", ad: "Tenvîn-i Nasb", altAd: "«ـًا»", renk: "#E53935",
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
        son: "isim", tur: "son", ad: "Te'nîs Tâ'sı", altAd: "dişillik", renk: "#EF5350",
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
        son: "isim", tur: "son", ad: "Nisbet Yâ'sı", altAd: "aidiyet", renk: "#7C3AED",
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
        son: "isim", tur: "son", ad: "Nisbet + Te'nîs", altAd: "«ـيَّة»", renk: "#7C3AED",
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
        son: "isim", tur: "son", ad: "Tesniye (İkil)", altAd: "merfû hâli", renk: "#16A085",
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
        son: "isim", tur: "son", ad: "Tesniye (İkil)", altAd: "mansûb / mecrûr hâli", renk: "#16A085",
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
        son: "isim", tur: "son", ad: "Cem'-i Müzekker Sâlim", altAd: "merfû hâli", renk: "#2980B9",
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
        son: "isim", tur: "son", ad: "Cem'-i Müzekker Sâlim", altAd: "mansûb / mecrûr hâli", renk: "#2980B9",
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
        son: "isim", tur: "son", ad: "Cem'-i Müennes Sâlim", altAd: "düzenli dişil çoğul", renk: "#EF5350",
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
        son: "isim", tur: "son", ad: "Nisbet + Dişil Çoğul", altAd: "«ـيَّات»", renk: "#7C3AED",
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

/* Menünün orta sütunu açıkken bilgi oraya yazılır: hangi ek düğmesine
   basıldıysa o düğme de işaretlenir. */
function ekSeciliIsaretle(menu, ek) {
    if (!menu) return;
    var l = menu.querySelectorAll('.suffix-btn');
    for (var i = 0; i < l.length; i++) {
        var o = l[i].getAttribute('onclick') || '';
        l[i].classList.toggle('ek-secili', o.indexOf("('" + ek + "')") >= 0);
    }
}
/* "+" menüsünü çapasına (tıklanan tuşun dikdörtgeni) göre yeniden yaslar.
   İçerik değişince (başka bir ekin bilgisi açılınca) genişlik oynayabildiği
   için dışarıdan da çağrılabilir. */
window._ekMenuCapa = null;
window.ekMenuYerlestir = function () {
    var menu = document.getElementById('suffix-dropdown');
    var r = window._ekMenuCapa;
    if (!menu || !r) return;
    var d = menu.style.display;
    if (!d || d === 'none') return;
    /* GENİŞ HÂL ekranı kaplıyor (CSS'te fixed + inset): yaslamaya gerek yok */
    if (menu.classList.contains('ek-genis')) return;
    /* DİKKAT — ÖLÇÜ offsetWidth'ten OKUNMAZ: menüde "büyütme" ölçeği var
       (transform: scale(1.1)). offsetWidth ölçeksiz genişliği verdiği için
       menü geniş hâlde ekranın 40px dışına taşıyordu (ölçüldü: 904 okunup
       994 çizildi). Gerçek kutu getBoundingClientRect'ten alınır; style.left
       ile kutunun sol kenarı arasındaki sabit fark (ölçek merkezden
       büyüttüğü için oluşan kayma + kaydırma) hesaba katılır. */
    var mevcut = parseFloat(menu.style.left);
    if (!isFinite(mevcut)) { menu.style.left = '0px'; mevcut = 0; }
    var q = menu.getBoundingClientRect();
    var fark = q.left - mevcut;              /* style.left → gerçek sol kenar */
    var en = q.width;
    var sol = r.left + 80 - en - fark;       /* sağ kenar "+" tuşunun sağına */
    if (sol + fark + en > window.innerWidth - 10) sol = window.innerWidth - 10 - en - fark;
    if (sol + fark < 10) sol = 10 - fark;
    menu.style.left = Math.round(sol) + 'px';
};
/* ---- "+" MENÜSÜ: DAR ↔ TAM EKRAN ----
   Menü hep DAR açılır (yalnız ek listeleri). Bir eke dokunulunca — ve
   ortada eklenecek bir kelime yoksa — kutu bulunduğu yerden tam ekrana
   BÜYÜR, bilgi kartı da hemen ardından belirir.
   Ölçüler piksel piksel veriliyor: menünün genişliği CSS'te
   `max-content !important`, tam ekran hedefi ise viewport — ikisi
   arasında geçiş ancak sayısal değerlerle akar. */
function ekMenuHedef() {
    var pay = 14;
    return { sol: pay, ust: pay,
             en: Math.max(320, window.innerWidth - pay * 2),
             boy: Math.max(260, window.innerHeight - pay * 2) };
}
function ekMenuOlcuVer(menu, sol, ust, en, boy) {
    menu.style.setProperty('left', Math.round(sol) + 'px', 'important');
    menu.style.setProperty('top', Math.round(ust) + 'px', 'important');
    menu.style.setProperty('width', Math.round(en) + 'px', 'important');
    menu.style.setProperty('height', Math.round(boy) + 'px', 'important');
}
window.ekMenuDaralt = function () {
    var menu = document.getElementById('suffix-dropdown');
    if (!menu) return;
    /* DİKKAT: menünün dolgusu HTML'de satır içi yazılı. `removeProperty`
       onu kalıcı olarak siliyordu — menü ilk açılıştan sonra dolgusuz
       kalıyor, kapanış animasyonu da 22px'e inip sonda 0'a düşünce içerik
       bir anda genişliyordu (Geylani'nin gördüğü sıçrama). İlk değer bir
       kez saklanıp her seferinde geri yazılıyor. */
    if (window._ekDolguIlk === undefined) window._ekDolguIlk = menu.style.padding || '';
    menu.classList.remove('ek-genis', 'ek-buyuyor', 'ek-icerik-acik', 'ek-kart-yok');
    ['left', 'top', 'width', 'height'].forEach(function (a) { menu.style.removeProperty(a); });
    if (window._ekDolguIlk) menu.style.setProperty('padding', window._ekDolguIlk);
    else menu.style.removeProperty('padding');
    if (window._ekBuyumeZaman) { clearTimeout(window._ekBuyumeZaman); window._ekBuyumeZaman = null; }
    if (window._ekKartZaman) { clearTimeout(window._ekKartZaman); window._ekKartZaman = null; }
    window._ekAcikEk = null;
};
/* TEK KAPATICI: menü nerede kapatılırsa kapatılsın aynı yoldan geçsin.
   ekMenuDaralt() geniş kartı ANINDA bırakır (kapanırken dar hâle doğru
   animasyon yapmanın anlamı yok) ve sınıflarla zamanlayıcıları temizler;
   böylece bir sonraki açılış tertemiz başlar. "+" tuşundaki vurgu da
   burada silinir. */
window.ekMenuKapat = function () {
    var menu = document.getElementById('suffix-dropdown');
    if (!menu) return;
    if (typeof window.ekMenuDaralt === 'function') window.ekMenuDaralt();
    menu.style.display = 'none';
    var a = document.querySelector('.fa-plus');
    var b = document.getElementById('mobile-top-plus');
    if (a) a.classList.remove('plus-highlighted');
    if (b) b.classList.remove('plus-highlighted');
};

/* AYNI EKE TEKRAR BASILINCA (Geylani): kutu dar listeye geri küçülür,
   kart soluklaşıp gider. Büyümenin birebir aynası. */
window.ekMenuKucult = function () {
    var menu = document.getElementById('suffix-dropdown');
    if (!menu || !menu.classList.contains('ek-genis')) return;
    var d = window._ekDarKutu, s = window._ekDarStil;
    menu.classList.remove('ek-icerik-acik');       /* kart önce solar */
    if (!d) { window.ekMenuDaralt(); return; }
    menu.classList.add('ek-buyuyor');
    ekMenuOlcuVer(menu, d.left, d.top, d.width, d.height);
    menu.style.setProperty('padding', window._ekDolguIlk || '0px', 'important');  /* dolgu dar hâle akar */
    /* Kart söndükten sonra akıştan da çıkar: kalan yol sıkışmasız geçsin */
    if (window._ekKartZaman) clearTimeout(window._ekKartZaman);
    window._ekKartZaman = setTimeout(function () {
        window._ekKartZaman = null;
        if (menu.classList.contains('ek-genis')) menu.classList.add('ek-kart-yok');
    }, 190);
    if (window._ekBuyumeZaman) clearTimeout(window._ekBuyumeZaman);
    window._ekBuyumeZaman = setTimeout(function () {
        window._ekBuyumeZaman = null;
        window.ekMenuDaralt();                     /* sınıflar + piksel ölçüler kalkar */
        if (s) { menu.style.left = s.left; menu.style.top = s.top; }   /* dar yerine dön */
        if (typeof window.ekBosOrta === 'function') window.ekBosOrta();
        ekSeciliIsaretle(menu, ' ');
    }, 480);
};
window.ekMenuBuyut = function () {
    var menu = document.getElementById('suffix-dropdown');
    if (!menu || menu.classList.contains('ek-genis')) return;
    /* 1) DAR kutunun ekrandaki gerçek yeri (ölçek dahil) sabitlenir.
          Küçülürken geri dönülecek yer de burada saklanır. */
    var r = menu.getBoundingClientRect();
    window._ekDarKutu = { left: r.left, top: r.top, width: r.width, height: r.height };
    window._ekDarStil = { left: menu.style.left, top: menu.style.top };
    menu.classList.add('ek-genis');
    ekMenuOlcuVer(menu, r.left, r.top, r.width, r.height);
    menu.style.setProperty('padding', window._ekDolguIlk || '0px', 'important');  /* dar dolgudan başla */
    void menu.offsetWidth;                 /* bu ölçüler yerine otursun */
    /* 2) Geçiş açılır ve hedefe gidilir (dolgu da geçişe dahil) */
    var h = ekMenuHedef();
    menu.classList.add('ek-buyuyor');
    ekMenuOlcuVer(menu, h.sol, h.ust, h.en, h.boy);
    menu.style.removeProperty('padding');                     /* geniş dolguya akar */
    /* 3) Büyüme yerleşirken kart süzülerek gelir */
    if (window._ekBuyumeZaman) clearTimeout(window._ekBuyumeZaman);
    window._ekBuyumeZaman = setTimeout(function () {
        window._ekBuyumeZaman = null;
        menu.classList.add('ek-icerik-acik');
    }, 90);
};
/* Pencere ölçüsü değişirse tam ekran kutu da uysun */
window.addEventListener('resize', function () {
    var menu = document.getElementById('suffix-dropdown');
    if (!menu || !menu.classList.contains('ek-genis')) return;
    if (!menu.style.display || menu.style.display === 'none') return;
    var h = ekMenuHedef();
    ekMenuOlcuVer(menu, h.sol, h.ust, h.en, h.boy);
});
window.ekBosOrta = function () {
    var orta = document.getElementById('ek-orta');
    if (!orta) return;
    orta.innerHTML =
        '<div class="ekb-bos">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
          'stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle>' +
          '<path d="M12 16v-5"></path><path d="M12 8h.01"></path></svg>' +
          '<p>Soldaki son eklerden ya da sağdaki ön eklerden birine dokun —<br>' +
          'o ekin bilgisi burada açılır.</p>' +
        '</div>';
    orta.style.removeProperty('--ekb-renk');
};

/* ---------- EKİN KELİME SONUNA ETKİSİ ----------
   Geylani: "ekler kelimenin sonunu etkilediği için tamlamavecumleler'deki
   sonlar tablolarını buraya da gömelim; sadece isimlerin başına gelen
   eklerde yalnız isim sonu, hem isme hem fiile gelenlerde ikisi de
   ulaşılabilsin."
   Tablolar HTML'de <template> olarak duruyor (kt-son-isim / kt-son-fiil),
   tamlamavecumleler.html'den birebir alındı. Burada yalnız hangisinin
   gösterileceği seçiliyor:
     son: "isim"  → yalnız ismin i'râb sonları
     son: "fiil"  → yalnız muzâri fiilin sonları
     son: "ikisi" → iki sekme, ikisine de ulaşılır (وَ, فَ, لِ gibi hem
                    isme hem fiile gelen harflerde). */
function ekbKalip(id) {
    var t = document.getElementById(id);
    return (t && t.innerHTML) ? t.innerHTML : '';
}
function ekbSonlarHtml(d) {
    var s = d && d.son;
    if (!s) return '';
    var isim = (s === 'isim' || s === 'ikisi');
    var fiil = (s === 'fiil' || s === 'ikisi');
    var ikisi = isim && fiil;
    var bas = ikisi ? 'İsmin ve fiilin i\'râb sonları'
                    : (isim ? 'İsmin i\'râb sonları' : 'Muzâri fiilin i\'râb sonları');
    var giris = ikisi
        ? 'Bu harf hem ismin hem fiilin başına gelir; ikisinin de sonunu değiştirir. Sekmelerden birine dokun.'
        : (isim ? 'Gövde <span dir="rtl">ـ ـ ـ</span> aynı kalır, değişen yalnız <b>son</b>dur. İsim <b>meczum olmaz</b>.'
                : 'Fiilde <b>mecrur yoktur</b>, yerine <b>meczum</b> vardır. Üstü çizili nûnlar o hâlde <b>düşer</b>.');
    var sekme = ikisi
        ? '<div class="ekb-son-sekme" role="tablist">' +
            '<button type="button" class="ekb-ss aktif" data-hedef="isim" onclick="ekbSonSec(this,\'isim\')">İSİM</button>' +
            '<button type="button" class="ekb-ss" data-hedef="fiil" onclick="ekbSonSec(this,\'fiil\')">FİİL</button>' +
          '</div>'
        : '';
    var govde = '';
    if (isim) govde += '<div class="ekb-son-kutu" data-hedef="isim">' + ekbKalip('kt-son-isim') + '</div>';
    if (fiil) govde += '<div class="ekb-son-kutu" data-hedef="fiil"' + (ikisi ? ' hidden' : '') + '>' +
                       ekbKalip('kt-son-fiil') + '</div>';
    if (!govde) return '';
    return '<div class="ekb-sonlar">' +
             '<div class="ekb-son-bas"><span class="ekb-son-etiket">KELİMENİN SONU</span>' + bas + '</div>' +
             '<p class="ekb-son-giris">' + giris + '</p>' + sekme + govde +
           '</div>';
}
window.ekbSonSec = function (tus, hedef) {
    var kap = tus.closest('.ekb-sonlar');
    if (!kap) return;
    kap.querySelectorAll('.ekb-ss').forEach(function (b) {
        b.classList.toggle('aktif', b.getAttribute('data-hedef') === hedef);
    });
    kap.querySelectorAll('.ekb-son-kutu').forEach(function (k) {
        k.hidden = (k.getAttribute('data-hedef') !== hedef);
    });
};

window.ekBilgiAc = function (ek) {
    var d = window.EK_BILGI[ek];
    if (!d) return false;
    var perde = document.getElementById('ek-bilgi-perde');
    if (!perde) return false;

    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();

    var ikon = window.EK_IKON[d.ikon] || window.EK_IKON.belirli;
    var ornekHtml = d.ornekler.map(function (o) {
        /* SIRA (CSS'te order ile): solda Türkçe · sağda Arapça ikili.
           Arapça ikili sağdan sola okunur: YALIN sağda, ok sola bakar,
           EKLİ solda (Geylani: "arapça ek almamış hâli sağa, ekli hâli
           sola al, oku da sol ok yap"). */
        return '<div class="ekb-ornek">' +
               '<span class="ekb-o-yalin" dir="rtl">' + o.yalin + '</span>' +
               '<span class="ekb-o-ok">←</span>' +
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

    var govdeHtml =
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
        '<div class="ekb-dikkat"><b>Dikkat</b><span>' + ekbArYalit(d.dikkat) + '</span></div>' +
        ekbSonlarHtml(d);

    /* "+" MENÜSÜ GENİŞ HÂLDEYSE (kök tanımlı değil): bilgi ayrı bir
       perdede değil, menünün tam ortasında — son eklerle ön eklerin
       arasında — açılır. Menü kapanmaz, başka bir eke dokununca içerik
       yerinde değişir. */
    var menu = document.getElementById('suffix-dropdown');
    var orta = document.getElementById('ek-orta');
    if (orta && menu && menu.style.display && menu.style.display !== 'none') {
        /* AÇIK OLAN EKE TEKRAR BASILDI → kapat (Geylani: "tekrar o eke
           basınca popup kapansın"). Kutu dar listeye geri küçülür. */
        if (menu.classList.contains('ek-genis') && window._ekAcikEk === ek) {
            window.ekMenuKucult();
            return true;
        }
        /* Menü açıkken bilgi ayrı bir perdede değil MENÜNÜN İÇİNDE açılır:
           kutu dar listeden tam ekrana büyür, kart ardından belirir. */
        window._ekAcikEk = ek;
        orta.style.setProperty('--ekb-renk', d.renk);
        orta.innerHTML = govdeHtml;
        orta.scrollTop = 0;
        ekSeciliIsaretle(menu, ek);
        window.ekMenuBuyut();
        return true;
    }

    perde.querySelector('.ekb-kart').style.setProperty('--ekb-renk', d.renk);
    perde.querySelector('.ekb-govde').innerHTML = govdeHtml;

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

/* ---------- KULLANIM KILAVUZU ----------
   Üst çubuğun en sağındaki ⓘ açar. İçerik HTML'de duruyor (görseller
   `loading="lazy"`, yani kılavuz açılmadan indirilmiyor); burada yalnız
   açılış/kapanış var. */
window.kilavuzAc = function () {
    var p = document.getElementById('kt-kilavuz');
    if (!p) return;
    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
    if (window._ktkKapatZaman) { clearTimeout(window._ktkKapatZaman); window._ktkKapatZaman = null; }
    p.style.display = 'block';
    p.scrollTop = 0;
    requestAnimationFrame(function () { p.classList.add('ktk-acik'); });
};
/* İLK ZİYARET: kılavuz kendiliğinden açılır. Sayfa tanıtımsız açıldığında
   öğretmen tabloyu nereden çekeceğini bilemiyordu; ⓘ'yi arayan da olmuyordu.
   localStorage'a bir işaret bırakılır, ikinci açılıştan itibaren bir daha
   kendi kendine açılmaz — ⓘ düğmesi zaten üst çubukta duruyor.
   Aynı ziyarette "Günün Kökü" penceresi bastırılır (aşağıda showRootOfDay
   başında kontrol var) ki iki pencere üst üste binmesin. */
(function () {
    var ANAHTAR = 'kidef_kt_kilavuz_v1';
    var ilk = false;
    try { ilk = !localStorage.getItem(ANAHTAR); } catch (e) { ilk = false; }
    if (!ilk) return;
    window._ktkIlkZiyaret = true;
    try { localStorage.setItem(ANAHTAR, '1'); } catch (e) {}
    function ac() {
        setTimeout(function () {
            var o = document.getElementById('rootOfDayOverlay');
            if (o && o.parentNode) o.parentNode.removeChild(o);
            if (typeof window.kilavuzAc === 'function') window.kilavuzAc();
        }, 900);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ac);
    else ac();
})();

window.kilavuzKapat = function () {
    var p = document.getElementById('kt-kilavuz');
    if (!p) return;
    p.classList.remove('ktk-acik');
    if (window._ktkKapatZaman) clearTimeout(window._ktkKapatZaman);
    window._ktkKapatZaman = setTimeout(function () {
        p.style.display = 'none'; window._ktkKapatZaman = null;
    }, 220);
};

/* Escape ile de kapansın — önce kılavuz, sonra ek perdesi, en son geniş menü */
document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var kil = document.getElementById('kt-kilavuz');
    if (kil && kil.style.display === 'block') { window.kilavuzKapat(); return; }
    var perde = document.getElementById('ek-bilgi-perde');
    if (perde && perde.style.display === 'flex') { window.ekBilgiKapat(); return; }
    var menu = document.getElementById('suffix-dropdown');
    if (menu && menu.classList.contains('ek-genis') &&
        menu.style.display && menu.style.display !== 'none') {
        menu.style.display = 'none';
    }
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
    
    /* MENÜ HEP DAR AÇILIR: "+"a basınca yalnız ek listeleri görünür
       (Geylani: "normalde + ya basınca popup görünmesin"). Bilgi kartı
       ancak bir eke dokunulunca — ve ortada eklenecek bir kelime yoksa —
       kutu bulunduğu yerden tam ekrana BÜYÜYEREK belirir. Kelime
       türetilmişse ek doğrudan kelimeye eklenir, kart hiç açılmaz.
       DİKKAT: daraltma, aşağıdaki top/left yerleşiminden ÖNCE olmalı —
       büyümeden kalan piksel ölçüleri temizleniyor. */
    window.ekMenuDaralt();
    ekSeciliIsaretle(menu, ' ');               /* önceki seçim izi kalmasın */
    if (typeof window.ekBosOrta === 'function') window.ekBosOrta();

    let topPos = Math.round(rect.bottom + window.scrollY + 8);
    menu.style.top = `${topPos}px`;

    // GEÇİCİ GÖRÜNÜM: Menünün genişliğini okuyabilmek için önce görünmez olarak açıyoruz
    menu.style.visibility = "hidden";
    menu.style.display = "block";

    /* YERLEŞTİRME: menü "+" tuşunun soluna yaslanır, ekranın sağından
       taşmaz. GENİŞ hâlde ölçü ilk karede henüz oturmamış olabiliyordu
       (ölçüldü: 934 okunup 994 çizildi, menü 41px dışarı taşıyordu);
       bu yüzden bir kare sonra ölçü tazelenip yeniden yaslanıyor. */
    window._ekMenuCapa = rect;
    window.ekMenuYerlestir();
    menu.style.visibility = "visible";
    requestAnimationFrame(window.ekMenuYerlestir);

    if (lastClickedBoxTextSpan) {
        const currentBox = lastClickedBoxTextSpan.closest('.glass-box');
        if (currentBox) updateSuffixHighlights(currentBox);
    }
}

// ===============================================================
// 3. ÖN EK MOTORU (Tetikleyicileri ve Örnek Cümle (!) Butonu Eklenmiş)
// ===============================================================
function applyPrefix(prefix) {
    /* Hiçbir kutu seçili değilken "+" menüsündeki ek, kelimeye eklenecek
       bir parça değil; öğrenilecek bir konudur. Ek bilgi perdesini açar. */
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
    
    /* Ek eklendikten sonra menü kapanır (Geylani). Ortak kapatıcı
       kullanılıyor ki geniş kart açık kaldıysa o da bırakılsın. */
    if (typeof window.ekMenuKapat === 'function') window.ekMenuKapat();
    else { var _m = document.getElementById("suffix-dropdown"); if (_m) _m.style.display = "none"; }
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
    
    /* Ek eklendikten sonra menü kapanır (Geylani). Ortak kapatıcı
       kullanılıyor ki geniş kart açık kaldıysa o da bırakılsın. */
    if (typeof window.ekMenuKapat === 'function') window.ekMenuKapat();
    else { var _m = document.getElementById("suffix-dropdown"); if (_m) _m.style.display = "none"; }
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
        currentBox.style.transition = "transform 0.1s ease";
        currentBox.style.transform = "scale(1.05)";
        setTimeout(() => { currentBox.style.transform = ""; }, 150);

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

        // Klonu en son güncelle ki checkWordEasterEgg'in yaptığı değişiklikler klona da yansısın
        const clone = document.getElementById('crisp-zoom-clone');
        if (clone) {
            const cloneTextEl = clone.querySelector('.ar, .ar-small');
            if (cloneTextEl) cloneTextEl.innerHTML = lastClickedBoxTextSpan.innerHTML;
        }
    }
    
    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
    
    /* Ek eklendikten sonra menü kapanır (Geylani). Ortak kapatıcı
       kullanılıyor ki geniş kart açık kaldıysa o da bırakılsın. */
    if (typeof window.ekMenuKapat === 'function') window.ekMenuKapat();
    else { var _m = document.getElementById("suffix-dropdown"); if (_m) _m.style.display = "none"; }
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
            if (window.fdmKokLevhaTazele) window.fdmKokLevhaTazele();
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
    let hasSuffixes = Object.keys(eggObj).some(k => k !== 'base' && k !== 'ornek' && k !== 'cekimi' && k !== 'suggestsPlus' && k !== 'tip' && k !== 'isDictOnly' && k !== 'cogulId' && k !== 'tekilId' && k !== 'autoGenerated' && k !== 'not' && k !== 'kuralliCogul' && k !== 'isHiddenInList' && k !== 'hasZamirCekimi' && k !== 'zamirBase' && k !== 'cogulTr' && k !== 'isNotVerb' && k !== 'tekil' && k !== 'cogul');
    if (!activeSuffix && (eggObj.suggestsPlus || hasSuffixes)) {
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
            /* PERDEYE DOKUNMAK ARTIK KAPATMIYOR: büyütme yalnız araç
               çubuğunun altındaki kırmızı çarpıyla kapanıyor (Geylani).
               Dokunuş yine yutuluyor ki arkadaki kutulara geçmesin. */
            const closeLocalOverlay = function(e) {
                e.preventDefault();
                e.stopPropagation();
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

        /* Kapatma çarpısı ekrana gelsin. */
        if (window.fdmBuyutmeKapatDugmesi) window.fdmBuyutmeKapatDugmesi(true);

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
    
    /* Kaynak artık TAHTADAKİ HÜCRE; eski yol (kutu içi) yedekte. */
    const hucre = btnElement.closest ? btnElement.closest('.fdm-hucre') : null;
    const boxElement = hucre || btnElement.closest('.glass-box');
    if (!boxElement) return;
    
    document.body.classList.add('matrix-active');
    
    let fullscreenOverlay = document.getElementById('matrix-fullscreen-overlay');
    if (!fullscreenOverlay) {
        fullscreenOverlay = document.createElement('div');
        fullscreenOverlay.id = 'matrix-fullscreen-overlay';
        fullscreenOverlay.className = 'matrix-fullscreen-overlay';
        
        const content = document.createElement('div');
        content.className = 'matrix-fullscreen-content';
        
        /* TAM EKRANDAN ÇIKIŞ: aynı düğme, ama simgesi artık İÇE DOĞRU
           oklar — "küçült" (Geylani: "tam ekran olunca oklar küçültme
           olarak değişsin, ikinci basışta tam ekrandan çıksın"). */
        const closeBtn = document.createElement('div');
        closeBtn.className = 'matrix-fullscreen-close';
        closeBtn.innerHTML =
            '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" ' +
            'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6"/></svg>';
        closeBtn.title = 'Tam ekrandan çık';
        closeBtn.setAttribute('aria-label', 'Tam ekrandan çık');
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
    fdmTamEkranSinir(fullscreenOverlay);
    fullscreenOverlay.style.display = 'flex';
}

/* Örtünün sınırları: sayfanın tamamı. */
/* TAM EKRAN ALANI = SAYFANIN TAMAMI. Tarayıcının kendi sekme çubuğu
   zaten sayfanın dışında; onun altındaki her yer kaplanıyor (Geylani:
   "tam ekran tüm sayfayı kaplamalı, tarayıcı sekmeleri hariç").
   Tarayıcının tam ekran kipi (F11) istenmiyor. */
function fdmTamAlan() {
    return { ust: 0, boy: window.innerHeight };
}
function fdmTamEkranSinir(ortu) {
    var a = fdmTamAlan();
    ortu.style.top = a.ust + 'px';
    ortu.style.height = 'calc(100vh - ' + a.ust + 'px)';
}
window.addEventListener('resize', function () {
    var o = document.getElementById('matrix-fullscreen-overlay');
    if (o && getComputedStyle(o).display !== 'none') fdmTamEkranSinir(o);
    var t = document.getElementById('fdm-tahta');
    if (t && t.classList.contains('fdm-tam')) window.fdmTamYerlestir();
});

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
    /* Tam ekrandan çıkınca ARKADAKİ TAHTA DURUYOR: öğretmen yan yana
       dizdiği tablolara geri dönsün (eskiden hepsi kapanıyordu, tek
       tablo varken mantıklıydı; artık tahta bir çalışma alanı). */
    if (window.fdmKokLevhaTazele) window.fdmKokLevhaTazele();
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

    // YENİ (مَأْمُور DÜZELTMESİ): charsOnly[start] konumundan itibaren
    // rootArray[rStart..2] kök harfleri SIRAYLA hâlâ bulunabiliyor mu?
    // Aşağıdaki "zayıf kök harfi düşmüş" kestirmesi ancak kök ileride
    // gerçekten TAMAMLANAMIYORSA doğrudur. Bu kontrol olmadan مَأْمُور'da
    // baştaki zâid م kök م sanılıyor (أ zayıf sayılıp "düştü" varsayılıyor),
    // gerçek kök harfleri (أمر) kırmızı, zâidler siyah kalıyordu.
    kokSiraylaBulunur: function(charsOnly, start, rootArray, rStart) {
        let p = start;
        for (let k = rStart; k < 3; k++) {
            let bulundu = false;
            for (let j = p; j < charsOnly.length; j++) {
                if (this.isEquivalent(charsOnly[j].char, rootArray[k], k)) {
                    p = j + 1;
                    bulundu = true;
                    break;
                }
            }
            if (!bulundu) return false;
        }
        return true;
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
            
            // YENİ: Misal Fiil (Vavlı) Muzari 'ي' Harfi Hatası
            // Kök 'و' ile başlıyorsa ve kelimedeki harf 'ي' ise, bu 'ي' genellikle Muzaraat harfidir (örn: يَقَعُ).
            // Sadece 'م', 'إ', 'ا', 'أ', 'ت' harflerinden sonra gelen 'ي' kök harfi (dönüşmüş vav) olabilir.
            let isMisalMuzariPrefix = false;
            if (rIndex === 0 && c === 'ي' && rootArray[0] === 'و') {
                let prevChar = i > 0 ? charsOnly[i - 1].char : '';
                if (!['م', 'إ', 'ا', 'أ', 'ت'].includes(prevChar)) {
                    isMisalMuzariPrefix = true;
                }
            }

            if (!isMisalMuzariPrefix && rIndex < 3 && this.isEquivalent(c, rootArray[rIndex], rIndex)) {
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
            else if (rIndex + 1 < 3 && this.isEquivalent(c, rootArray[rIndex + 1], rIndex + 1) && this.isWeak(rootArray[rIndex])
                     && !(rIndex === 0 && this.kokSiraylaBulunur(charsOnly, i, rootArray, 0))) {
                // Zayıf kök harfi kelimede gerçekten yoksa (عِدْ، قُلْ gibi) bu
                // harf bir SONRAKİ kök harfidir. Ama daha HİÇ kök harfi
                // bulunmamışken (rIndex===0) kökün tamamı ileride sırayla
                // mevcutsa (مَأْمُور: أ,م,ر duruyor) buraya GİRME — bu harf
                // zâid bir ön ektir. Not: rIndex>0 durumlarına dokunmuyoruz;
                // orada bu kestirme تَعَاوَنُونَ gibi çekimlerde gerekli.
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

/* ==================================================================
   SÖZLÜK ARAMA DİZİNİ  (performans)
   ------------------------------------------------------------------
   Sözlük paneli eskiden HER TUŞ VURUŞUNDA bütün sözlüğü baştan
   tarıyor, her öğede harekeleri ve hemzeleri regex ile yeniden
   temizliyordu. Ölçüm (masaüstü, 1004 kök / 5735 kalıp öğesi):
       tuş başına ~39.000 stripHarakat + ~45.000 normalizeArabic
       ~25-40 ms masaüstü, 4x yavaş CPU'da (tablet) ~90-190 ms.
   Bu ön işlem artık BİR KEZ yapılıp saklanıyor; arama hazır diziler
   üzerinde düz startsWith ile ilerliyor. Üretilen sonuç eskisiyle
   birebir aynıdır (bkz. altın kopya karşılaştırması).
   ================================================================== */
window.KidefSozlukDizin = (function () {
    var _dizin = null;        // düz öğe listesi
    var _taban = null;        // sıralı taban kelimeler (birebir eşleşme testi)
    var _bab = new Map();     // kalıpNo -> getBabAndType sonucu

    /* Eski koddaki "ek değil, alan adı" listesiyle birebir aynı */
    var OZEL = { base: 1, ornek: 1, cekimi: 1, suggestsPlus: 1, tip: 1,
                 isDictOnly: 1, cogulId: 1, tekilId: 1, autoGenerated: 1 };

    var RE_HAREKE = /[ً-ْٰ]/g;
    var RE_HEMZE = /[أإآ]/g;
    var RE_BOSLUK = /\s+/;

    function hrk(s) { return s ? String(s).replace(RE_HAREKE, '') : ''; }
    function nrm(s) { return s ? String(s).replace(RE_HEMZE, 'ا') : ''; }

    /* "el-" ön eki olan parçanın eksiz hali de saklanır: eski koddaki
       (pt.startsWith('ال') && pt.substring(2).startsWith(v)) kuralı. */
    function parcala(sn) {
        var ps = sn.split('/'), out = [];
        for (var i = 0; i < ps.length; i++) {
            var pt = ps[i].trim();
            out.push({ p: pt, p2: (pt.lastIndexOf('ال', 0) === 0 ? pt.substring(2) : null) });
        }
        return out;
    }

    function kur() {
        var d = [], tabanlar = [], g = 0;
        var SV = (typeof sozlukVerileri !== 'undefined' && sozlukVerileri) ? sozlukVerileri : {};
        var sahip = Object.prototype.hasOwnProperty;
        for (var rootKey in SV) {
            if (!sahip.call(SV, rootKey)) continue;
            if (rootKey.lastIndexOf('Sayı:', 0) === 0) continue;
            if (rootKey.lastIndexOf('Sıra:', 0) === 0) continue;
            var rootData = SV[rootKey];
            if (!rootData || typeof rootData !== 'object') continue;
            for (var kalipKey in rootData) {
                if (!sahip.call(rootData, kalipKey)) continue;
                var kd = rootData[kalipKey];
                if (!kd || typeof kd !== 'object') continue;
                var grup = g++;
                /* Eski sıra: önce base, sonra ekler (itemsToProcess) */
                var oge = [];
                if (kd.base && kd.base.arText) {
                    tabanlar.push(nrm(hrk(kd.base.arText)));
                    oge.push([kalipKey, kd.base, true]);
                }
                for (var sfx in kd) {
                    if (!sahip.call(kd, sfx)) continue;
                    if (OZEL[sfx]) continue;
                    var sd = kd[sfx];
                    if (sd && sd.arText) oge.push([kalipKey + '+' + sfx, sd, false]);
                }
                for (var i = 0; i < oge.length; i++) {
                    var kk = oge[i][0], b = oge[i][1], tabanMi = oge[i][2];
                    var ar = b.arText;
                    if (!ar || ar.trim() === '') continue;
                    var sAr = hrk(ar);
                    if (sAr.trim().split(RE_BOSLUK).length > 3) continue;
                    var mu = b.muennes || null;
                    d.push({
                        rk: rootKey, kk: kk, g: grup, kn: parseInt(kk, 10),
                        ar: ar, tr: b.trText, mu: mu,
                        sAr: sAr, sMu: mu ? hrk(mu) : null,
                        pAr: parcala(nrm(sAr)),
                        pMu: mu ? parcala(nrm(hrk(mu))) : null,
                        trl: b.trText ? String(b.trText).toLowerCase() : '',
                        kd: kd, tabanMi: tabanMi,
                        _cl: null, _cn: null      // çekim önbelleği
                    });
                }
            }
        }
        tabanlar.sort();
        _dizin = d;
        _taban = tabanlar;
        return d;
    }

    function babBilgi(kn) {
        if (_bab.has(kn)) return _bab.get(kn);
        var m = null;
        if (typeof getBabAndType === 'function' && !isNaN(kn)) m = getBabAndType(kn);
        _bab.set(kn, m);
        return m;
    }

    function uretCekim(e) {
        if (typeof VerbGenerator === 'undefined') return null;
        if (typeof getBabAndType !== 'function') return null;
        if (isNaN(e.kn)) return null;
        var m = babBilgi(e.kn);
        if (!m) return null;
        if (m.type !== 'mazi' && m.type !== 'muzari' && m.type !== 'emir') return null;
        var vObj = (typeof babVezinleri !== 'undefined') ? babVezinleri[m.babNo] : null;
        var anaVezin = 'فَعَلَ';
        if (vObj) {
            if (m.type === 'mazi') anaVezin = vObj.mazi;
            else if (m.type === 'muzari') anaVezin = vObj.muzari;
            else anaVezin = vObj.emir;
        }
        return VerbGenerator.generateVerbList(e.rk, m.babNo, m.type, anaVezin, e.kn);
    }

    function normListe(lst) {
        var o = new Array(lst.length);
        for (var i = 0; i < lst.length; i++) {
            var c = lst[i];
            o[i] = (c && typeof c === 'string') ? nrm(hrk(c)) : null;
        }
        return o;
    }

    /* Eski davranışın birebir kopyası:
       - taban öğesi: veride hazır 'cekimi' varsa o kullanılır; yoksa
         (ve arama >= 2 harfse) üretilip VERİYE yazılır (eski kod da
         kalipData.cekimi = ... yapıyordu).
       - ek öğesi: eski kod her seferinde geçici bir nesne kurduğu için
         hazır 'cekimi'yi hiç görmez, hep üretirdi. Aynısı korunuyor,
         yalnız sonuç önbelleğe alınıyor. */
    function cekimler(e, uret) {
        if (e.tabanMi) {
            var kd = e.kd;
            if (kd.cekimi && Array.isArray(kd.cekimi)) {
                if (e._cl !== kd.cekimi) { e._cl = kd.cekimi; e._cn = normListe(kd.cekimi); }
                return e;
            }
            if (!uret) return null;
            var lst = e._cl || uretCekim(e);      // ısıtmada hazırlanmış olabilir
            if (!lst) return null;
            kd.cekimi = lst;                       // eski koddaki yazma, aynı anda
            if (e._cl !== lst) { e._cl = lst; e._cn = normListe(lst); }
            return e;
        }
        /* SIRA ÖNEMLİ: tek harflik aramada eski kod ek öğeleri için çekim
           üretmediğinden hiç eşleşme bulmazdı; ısıtılmış önbellek buraya
           sızmasın diye önce 'uret' kapısına bakılıyor. */
        if (!uret) return null;
        if (e._cl) return e;
        var l2 = uretCekim(e);
        if (!l2) return null;
        e._cl = l2; e._cn = normListe(l2);
        return e;
    }

    /* ---- ÇEKİM ISITMASI --------------------------------------------
       İlk 2 harflik aramada 2652 çekim listesi birden üretiliyor ve
       sayfa ~370 ms donuyordu (yavaş tablette ~1,5 sn). Aynı iş burada
       boş zamanda, küçük parçalar hâlinde yapılıyor. ÖNEMLİ: ısıtma
       sozlukVerileri'ne DOKUNMAZ (kd.cekimi yazılmaz) — o yazma eskiden
       olduğu gibi yalnız gerçek arama sırasında olur; böylece tablo ve
       liste ekranlarının davranışı hiç değişmez. */
    var _isiIdx = -1;
    function isit(e) {
        if (e._cl) return;
        if (e.tabanMi && e.kd.cekimi && Array.isArray(e.kd.cekimi)) {
            e._cl = e.kd.cekimi; e._cn = normListe(e.kd.cekimi); return;
        }
        var l = uretCekim(e);
        if (l) { e._cl = l; e._cn = normListe(l); }
    }
    function isitParca(deadline) {
        var d = _dizin || kur();
        var i = _isiIdx;
        var tavan = (deadline && deadline.timeRemaining) ? -1 : i + 60;
        while (i < d.length) {
            isit(d[i]); i++;
            if (tavan >= 0) { if (i >= tavan) break; }
            else if ((i & 7) === 0 && deadline.timeRemaining() < 4) break;
        }
        _isiIdx = i;
        if (i < d.length) planla();
    }
    function planla() {
        if (window.requestIdleCallback) window.requestIdleCallback(isitParca, { timeout: 1200 });
        else setTimeout(isitParca, 24);
    }
    function isitBaslat() {
        if (_isiIdx >= 0) return;
        _isiIdx = 0;
        planla();
    }

    /* Sözlükte bu önekle başlayan bir TABAN kelime var mı?
       (eski koddaki hasExactMatchInDict taraması) — ikili arama. */
    function tabanOneki(pre) {
        if (!pre) return false;
        if (!_taban) kur();
        var lo = 0, hi = _taban.length;
        while (lo < hi) { var mid = (lo + hi) >> 1; if (_taban[mid] < pre) lo = mid + 1; else hi = mid; }
        return lo < _taban.length && _taban[lo].lastIndexOf(pre, 0) === 0;
    }

    return {
        dizin: function () { return _dizin || kur(); },
        tabanOneki: tabanOneki,
        cekimler: cekimler,
        isitBaslat: isitBaslat,
        isindiMi: function () { return _isiIdx >= 0 && _dizin && _isiIdx >= _dizin.length; },
        hazirMi: function () { return !!_dizin; },
        tazele: function () { _dizin = null; _taban = null; _bab.clear(); _isiIdx = -1;
                              window._cachedAllRoots = null; window._cachedAllRootsNorm = null; }
    };
})();


/* Dizini ve çekim ısıtmasını sayfa boştayken sessizce hazırla: bedeli
   ilk arama değil, boş zaman ödesin. Kurulum ~20-30 ms; ısıtma küçük
   parçalara bölünmüş hâlde arkadan akar ve sayfayı hiç kilitlemez. */
(function () {
    function kurArka() {
        try {
            if (typeof sozlukVerileri === 'undefined') return;
            if (!window.KidefSozlukDizin.hazirMi()) window.KidefSozlukDizin.dizin();
            window.KidefSozlukDizin.isitBaslat();
        } catch (e) { }
    }
    if (window.requestIdleCallback) window.requestIdleCallback(kurArka, { timeout: 4000 });
    else setTimeout(kurArka, 2000);
})();

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
                /* HIZLANDIRMA: köklerin normalize hâli de bir kez hazırlanır
                   (eskiden her tuş vuruşunda 1004 kez normalizeArabic). */
                window._cachedAllRootsNorm = window._cachedAllRoots.map(r => normalizeArabic(r));
            }
            const normFilter = normalizeArabic(filter);
            const searchVariants = typeof getSearchVariants === 'function' ? getSearchVariants(normFilter) : [normFilter];

            const _kokler = window._cachedAllRoots;
            const _kokNorm = window._cachedAllRootsNorm || _kokler;
            rootMatches = [];
            for (let _ri = 0; _ri < _kokler.length && rootMatches.length < 50; _ri++) {
                const _nr = _kokNorm[_ri];
                for (let _vi = 0; _vi < searchVariants.length; _vi++) {
                    if (_nr.lastIndexOf(searchVariants[_vi], 0) === 0) { rootMatches.push(_kokler[_ri]); break; }
                }
            }

            // Dinamik Kök Oluşturma Çipi: 
            // Sadece yazdığı şey (tam olarak) 3 harfliyse ve ekrandaki kök sonuçlarında yoksa öner!
            if (filter.length === 3) {
                // Kök listesinde birebir kendisi var mı? (zaten tanımlı bir fiil kökü mü?)
                const exactExists = rootMatches.some(r => normalizeArabic(r) === normFilter);
                
                // Zaten bir fiil kökü değilse, (sözlükte isim olsa bile) kök oluşturmasına izin ver
                if (!exactExists) {
                    if (!rootMatches.includes(filter)) {
                        rootMatches.unshift(filter);
                        if (rootMatches.length > 50) rootMatches.pop();
                    }
                }
            }
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
            // Sözlükte hiç yoksa veya sadece isim olarak (isDictOnly) varsa bu dinamik köktür (sihirli değnek)
            const isDynamic = typeof sozlukVerileri === 'undefined' || !sozlukVerileri[r] || sozlukVerileri[r].isDictOnly;
            
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
                            <span style="font-family: 'Arakom', sans-serif; font-size: 2.2rem; color: #ffffff; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); line-height: 1;">
                                ${spacedRoot}
                            </span>
                        </div>
                    </div>`;
            } else {
                const emoji = getRootEmoji(r);
                predHtml += `
                    <div class="prediction-chip" onclick="selectRootFromMainKeyboard('${r}')" style="flex: 0 0 calc(50% - 5px); max-width: calc(50% - 5px); box-sizing: border-box;">
                        ${r} ${emoji}
                    </div>`;
            }
        });
        predictionsContainer.innerHTML = predHtml;

        // 2. Sözlük Sonuçları (Türevler)
        /* HIZLANDIRMA: burada eskiden Object.entries(sozlukVerileri)
           üzerinde üç iç içe döngü dönüyor, her öğede stripHarakat ve
           normalizeArabic yeniden çalışıyordu (tuş başına ~39.000 +
           ~45.000 regex çağrısı). Artık hazır dizin taranıyor;
           matchesByLetter / matchCount ve sıraları eskisiyle aynıdır. */
        let resultsHTML = "";
        let matchCount = 0;
        let matchesByLetter = {};
        const _mbKume = {};                        // yinelenen kayıt testi (eski .some yerine)

        const _DZ = window.KidefSozlukDizin;
        if (_DZ) _DZ.isitBaslat();          // boş zamanda çekim ısıtması (yalnız planlar)
        const _ogeler = _DZ ? _DZ.dizin() : [];
        const isArabicSearch = /[؀-ۿ]/.test(filter);

        // Birebir eşleşen bir taban kelime var mı? (varsa önek koparılmaz)
        let searchFilterExact = window.stripHarakat(filter);
        let hasExactMatchInDict = false;
        if (searchFilterExact.length > 0 && /[؀-ۿ]/.test(searchFilterExact)) {
            hasExactMatchInDict = _DZ ? _DZ.tabanOneki(normalizeArabic(searchFilterExact)) : false;
        }

        // Arama türevleri (eski getSearchVariants ile birebir aynı)
        const _varyant = [];
        if (isArabicSearch) {
            const _norm = normalizeArabic(filter);
            _varyant.push(_norm);
            if (!hasExactMatchInDict) {
                const _onekler = ['وال', 'فال', 'بال', 'كال', 'ال', 'لل', 'و', 'ف', 'ب', 'ك', 'ل'];
                for (let _p of _onekler) {
                    if (_norm.lastIndexOf(_p, 0) === 0 && _norm.length > _p.length) _varyant.push(_norm.substring(_p.length));
                }
            }
        }
        const _vN = _varyant.length;
        const _trFiltre = filter.toLowerCase();
        const _cekimUret = filter.length >= 2;

        const _parcaEsler = function (parcalar) {
            for (let a = 0; a < parcalar.length; a++) {
                const pt = parcalar[a].p, p2 = parcalar[a].p2;
                for (let v = 0; v < _vN; v++) {
                    const vv = _varyant[v];
                    if (pt.lastIndexOf(vv, 0) === 0) return true;
                    if (p2 !== null && p2.lastIndexOf(vv, 0) === 0) return true;
                }
            }
            return false;
        };

        const _push = function (_e, cArText, isConj, pIndex, sHazir) {
            if (!cArText) return;
            const sTx = (sHazir === null || sHazir === undefined) ? window.stripHarakat(cArText) : sHazir;
            let firstLetter = sTx.charAt(0);
            if (firstLetter === "أ" || firstLetter === "إ" || firstLetter === "آ" || firstLetter === "ا") firstLetter = "ا";

            if (!matchesByLetter[firstLetter]) { matchesByLetter[firstLetter] = []; _mbKume[firstLetter] = new Set(); }
            const _im = _e.kk + "" + cArText;
            if (_mbKume[firstLetter].has(_im)) return;
            _mbKume[firstLetter].add(_im);

            matchesByLetter[firstLetter].push({
                rootKey: _e.rk, kalipKey: _e.kk,
                arText: cArText,
                trText: _e.tr,
                strippedAr: sTx,
                isConjugationMatch: isConj,
                matchedPronounIndex: pIndex,
                originalArText: _e.ar
            });
            matchCount++;
        };

        let _sonGrup = -1;
        for (let _i = 0; _i < _ogeler.length; _i++) {
            const _e = _ogeler[_i];
            if (_e.g !== _sonGrup) {            // kalıp sınırı = eski koddaki 300 kesme noktası
                if (matchCount > 300) break;
                _sonGrup = _e.g;
            }

            let matches = false, arMatch = false, muennesMatch = false;
            let matchedConjugations = null;

            if (isArabicSearch) {
                arMatch = _parcaEsler(_e.pAr);
                if (_e.pMu) muennesMatch = _parcaEsler(_e.pMu);
                matches = arMatch || muennesMatch;

                const _ck = _DZ ? _DZ.cekimler(_e, _cekimUret) : null;
                if (_ck && _ck._cn) {
                    const _cn = _ck._cn, _cl = _ck._cl;
                    for (let c = 0; c < _cn.length; c++) {
                        const _nc = _cn[c];
                        if (_nc === null) continue;
                        for (let v = 0; v < _vN; v++) {
                            if (_nc.lastIndexOf(_varyant[v], 0) === 0) {
                                (matchedConjugations || (matchedConjugations = [])).push({ arText: _cl[c], pronounIndex: c });
                                break;
                            }
                        }
                    }
                    if (matchedConjugations) matches = true;
                }
            } else {
                matches = !!(_e.tr && _e.trl.indexOf(_trFiltre) !== -1);
            }

            if (!matches) continue;

            if (matchedConjugations) {
                for (let m = 0; m < matchedConjugations.length; m++) {
                    _push(_e, matchedConjugations[m].arText, true, matchedConjugations[m].pronounIndex, null);
                }
            } else {
                if (!isArabicSearch || arMatch) _push(_e, _e.ar, false, -1, _e.sAr);
                if (_e.mu && (!isArabicSearch || muennesMatch)) _push(_e, _e.mu, false, -1, _e.sMu);
            }
        }
        
        // Arapça alfabetik sıralama
        const arabicAlphabet = "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" ");
        searchFilterExact = window.stripHarakat(filter);
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
            resultsHTML += `<div style="font-family: \'Arakom\', sans-serif; color:#000000; font-size:2.2rem; font-weight:normal; text-align:center; margin: 0 0 15px 0; border-bottom:2px solid rgba(0,0,0,0.05); padding-bottom:10px; width: 100%;">[ ${letter} ]</div>`;
            
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
                let isDictWord = item.rootKey && (item.rootKey.includes(":") || (typeof sozlukVerileri !== 'undefined' && sozlukVerileri[item.rootKey] && sozlukVerileri[item.rootKey].isDictOnly));
                if (!isDictWord && (item.kalipKey === "+" || isNaN(parseInt(item.kalipKey)))) continue;
                const ilkAnlam = (item.trText || "").split('/')[0].trim();
                const kelimeler = ilkAnlam.split(' ');
                // Sadece normal (kök) eşleşmelerinde Türkçe anlamı göster, çekimlerde gösterme çünkü anlam şahsa göre değişiyor
                const kisaltilmisAnlam = kelimeler.slice(0, 3).join(' ') + (kelimeler.length > 3 ? "..." : "");
                const trFontSize = kelimeler.length >= 3 ? "1.4rem" : "1.6rem";
                
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
                    
                    rootBadge = `<div style="color:#e74c3c; font-size:0.9rem; margin-top:4px; font-weight: normal; text-align:center;">Kök: ${item.rootKey}</div>`;
                }
                
                let clickArText = item.isConjugationMatch ? item.originalArText : item.arText;
                let escapedArText = clickArText ? clickArText.replace(/"/g, "&quot;").replace(/'/g, "\\'") : "";
                let escapedTrText = item.trText ? item.trText.replace(/"/g, "&quot;").replace(/'/g, "\\'") : "";
                let escapedRootKey = item.rootKey ? item.rootKey.replace(/"/g, "&quot;").replace(/'/g, "\\'") : "";
                let coloredArText = (typeof colorizeArabicWord === 'function' && item.rootKey) ? colorizeArabicWord(item.arText, item.rootKey) : item.arText;
                
                resultsHTML += `
                    <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; background:#f4f6f7; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); padding:10px 5px 8px 5px; border-radius:12px; flex: 0 0 calc(50% - 5px); max-width: calc(50% - 5px); min-width: 0; box-sizing: border-box; cursor:pointer; position:relative; overflow: hidden;" onclick="showWordDetails('${escapedRootKey}', '${item.kalipKey}', '${escapedArText}', '${escapedTrText}')">
                        
                        <div dir="ltr" style="display:flex; flex-direction:column; width:100%; align-items:center; justify-content:center; position:relative;">
                            <i class="fas fa-layer-group" style="position:absolute; top:0; left:0; color:rgba(0,0,0,0.05); font-size:1.5rem;"></i>
                            <div style="width: 100%; text-align:center; margin-top:2px; margin-bottom:0px;">
                                <span style="font-family: \'Arakom\', sans-serif; font-size:clamp(4.0rem, 6.0vw, 8.0rem); font-weight:normal; color:#000000; line-height:1.4; display:block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 6px 0; margin: -6px 0;">
                                    ${coloredArText}
                                </span>
                            </div>
                            <div style="width: 100%; text-align:center; margin-top: 4px;">
                                <span dir="ltr" style="font-family: \'Inter\', sans-serif; font-size:${trFontSize}; font-weight:500; color:#555555; line-height:1.2; word-break: break-word; display:block; overflow-wrap: break-word; hyphens: auto;">
                                    ${kisaltilmisAnlam}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            }
            resultsHTML += `</div>`;
        }
        const rootDot = document.getElementById("root-status-dot");
        const dictDot = document.getElementById("dict-status-dot");
        if (rootDot) {
            rootDot.style.backgroundColor = rootMatches.length > 0 ? "#4CAF50" : "#F44336";
        }
        if (dictDot) {
            dictDot.style.backgroundColor = (matchCount > 0) ? "#4CAF50" : "#F44336";
        }

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
        const rootDot = document.getElementById("root-status-dot");
        const dictDot = document.getElementById("dict-status-dot");
        let isDataLoaded = typeof sozlukVerileri !== 'undefined' && Object.keys(sozlukVerileri).length > 0;
        let defaultColor = isDataLoaded ? "#4CAF50" : "#F44336";
        
        if (rootDot) rootDot.style.backgroundColor = defaultColor;
        if (dictDot) dictDot.style.backgroundColor = defaultColor;

        dictResults.style.display = "none";
        dictResults.innerHTML = "";
    }

}

function selectRootFromMainKeyboard(root) {
    currentRoot = root;
    updateTempDisplay();
    confirmRoot(); // Kökü onaylar, tabloları açar ve klavyeyi kapatır
}

// --- EVRENSEL BÜYÜTME KAPATICI ---
/* Büyüyen kutuyu kapatan evrensel dinleyici. "+" TUŞLARI DA MUAF
   (Geylani: "büyütme açıkken bir vezne ek eklemek için + ya bastığımda
   büyük olan vezin küçülmesin"): ek eklemek büyütmeyi bozan bir iş
   değil — kutu büyük kalır, ek doğrudan ona işlenir. */
function _ekBuyutmeMuaf(t) {
    /* BÜYÜTME YALNIZ KIRMIZI ÇARPI (ya da ileri/geri) İLE KAPANIR.
       Dev kelime ekrandayken sayfanın hiçbir yerine dokunmak onu
       kapatmıyor — kumanda taşınırken, anlam paneli okunurken kapanması
       en çok şikâyet edilen davranıştı (Geylani: "sadece çarpı veya
       ileri tuşuyla büyüme kapansın"). Çarpının kendi işleyicisi
       closeAllZoomedBoxes'ı doğrudan çağırıyor. */
    if (document.getElementById('crisp-zoom-clone')) {
        var c = document.getElementById('zoomToggleCheckbox');
        if (c && c.checked) return true;
    }
    return !!(t && t.closest && (
        t.closest('.glass-box.pulse-highlight') ||
        t.closest('.crisp-zoom-clone') ||
        t.closest('#suffix-dropdown') ||
        t.closest('#vg-kumanda') ||
        t.closest('.fa-plus') ||
        t.closest('#mobile-top-plus')));
}
document.addEventListener('click', function(e) {
    if (!_ekBuyutmeMuaf(e.target)) {
        if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();
    }
});

document.addEventListener('touchstart', function(e) {
    if (!_ekBuyutmeMuaf(e.target)) {
        if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();
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
    dragEl.dataset.root = currentRoot;
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

// --- KLAVYE VE SUNUM KUMANDASI DİNLEYİCİSİ — İPTAL ---
// Eskiden ileri/geri tuşları veri_kokler'den rastgele kök gezdiriyordu
// (günün kökü kapatılınca kumandanın ilk basışı beklenmedik bir kök
// açıyordu). Özellik kaldırıldı: kumandanın İLERİ tuşu artık yalnız
// BÂB ODAĞI açıkken iş görüyor — sarf/babodak.js dinliyor, her basış
// odaktaki köke tıklama sayılıyor. (nextEasterEgg/prevEasterEgg
// fonksiyonları duruyor; başka çağıran yok.)


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
    if (window.fdmTahtaEkranda && window.fdmTahtaEkranda()) return;   /* tahta açık: ⓘ çalışmaz */
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

document.addEventListener("DOMContentLoaded", () => {
    initBabIcons();
    
    // Otomatik yükleme sayacı (Kullanıcı 3 kez görene kadar 'فعل' kökünü yükler)
    try {
        let loadCount = localStorage.getItem('fialLoadCount');
        if (!loadCount) {
            loadCount = 0;
        } else {
            loadCount = parseInt(loadCount, 10);
        }
        
        if (loadCount < 3) {
            localStorage.setItem('fialLoadCount', loadCount + 1);
            // Kök yükleme için küçük bir gecikme (DOM'un tam hazır olması için)
            setTimeout(() => {
                if (typeof selectRootFromMainKeyboard === 'function' && typeof sozlukVerileri !== 'undefined' && sozlukVerileri['فعل']) {
                    selectRootFromMainKeyboard('فعل');
                }
            }, 300);
        }
    } catch (e) {
        console.error("Otomatik yükleme hatası:", e);
    }
});
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(() => {
        initBabIcons();
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
        const currentRootSafe = typeof window !== 'undefined' && window.activeConfirmedRoot ? window.activeConfirmedRoot : "";
        const canShowTimer = hasVerbsToRead(currentRootSafe);
        const isDraggableOnScreen = document.querySelector('.draggable-root-clone') !== null;

        // Hatasız okunan tek satırlık zarif SVG kodu
        const mySvg = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="#334155" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"></circle><polyline points="12 9 12 13 14 15"></polyline><line x1="10" y1="2" x2="14" y2="2"></line><line x1="12" y1="2" x2="12" y2="5"></line><line x1="18" y1="6" x2="16.5" y2="7.5"></line></svg>';
        const listSvg = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="16" y2="6"></line><line x1="3" y1="12" x2="16" y2="12"></line><line x1="3" y1="18" x2="16" y2="18"></line><line x1="21" y1="6" x2="21.01" y2="6"></line><line x1="21" y1="12" x2="21.01" y2="12"></line><line x1="21" y1="18" x2="21.01" y2="18"></line></svg>';
        
        // A. KAHVERENGİ LEVHA: timer/liste SVG'leri header'a sabitlendi, buradan kaldırıldı
        document.querySelectorAll('.draggable-root-clone').forEach(box => {
            const wrapper = box.querySelector('.root-clone-buttons');
            if (wrapper) wrapper.remove();
            const oldBtn = box.querySelector('.kutu-timer-btn');
            if (oldBtn) oldBtn.remove();
            const oldListBtn = box.querySelector('.kutu-list-btn');
            if (oldListBtn) oldListBtn.remove();
        });

        // Block B was removed to statically keep the icons in the HTML top bar
        // YENİ EKLENEN: Sabit SVG'lerin animasyonu (dalga ve turuncu renk)
        const staticList = document.getElementById('static-list-btn');
        const staticTimer = document.getElementById('static-timer-btn');
        if (staticList) {
            staticList.classList.remove('svg-wave-active');
            staticList.classList.toggle('svg-wave-red', canShowTimer);
            staticList.style.opacity = canShowTimer ? '1' : '0.4';
            staticList.style.pointerEvents = canShowTimer ? 'auto' : 'none';
        }
        if (staticTimer) {
            // Kronometrenin dalga vurgusu YEŞİL: sayfa açılışında (kök seçilmemişken)
            // ve fiilli bir kök seçiliyken de yeşil dalga ile vurgulanır.
            const noRootSelected = !currentRootSafe || currentRootSafe.length !== 3;
            staticTimer.classList.remove('svg-wave-active');
            staticTimer.classList.toggle('svg-wave-green', noRootSelected || canShowTimer);
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
                newListBtnM.onclick = (e) => { e.stopPropagation(); openFastDictionaryMode(); };
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
    const safeRoot = window.activeConfirmedRoot ? window.activeConfirmedRoot.trim() : "";
    if (!safeRoot || !hasVerbsToRead(safeRoot)) {
        if (typeof openTelaffuz === 'function') openTelaffuz();
        return;
    }
    window.isAtlasMode = false;
    document.getElementById('timer-display').style.display = 'block';
    document.getElementById('top-bar-panel').style.display = 'grid'; // CSS'teki grid yapısını bozmamak için flex yerine grid yapıldı
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

    /* KAPSAM: '.important-roots-wrapper' bu sayfada YALNIZ kökler
       penceresinin (#verb-overlay) içinde var; maraton/atlas ekranında
       böyle bir kutu yok. Kapsamsız seçici, maraton ekranı yüzünden
       kökler penceresindeki "çok kullanılan fiiller + ✕ + kök sayısı"
       satırını gizli bırakıyordu (bkz. openAtlasOverlay). */
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
    if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
    clearInterval(window.mTimerInterval);
    clearInterval(window.mCountdownInterval);
    window.mRaceMode = false;
    document.getElementById('marathon-overlay').classList.remove('active');
    document.getElementById('marathon-overlay').classList.remove('atlas-modu');
    clearTimeout(window._atlasUcusZaman);
    document.getElementById('marathon-overlay').classList.remove('atlas-ucus');
    
    // Ekranda "MAZİ" veya süre yazısı asılı kalmasın diye temizlik
    hideMarathonHeaders();
    document.getElementById('chrono-main').style.display = 'none';
    
    if (window.mLaunchedFromTelaffuz) {
        /* 'block' DEĞİL 'flex': perde bir sütun flex kabı (başlık +
           kayan liste). block'a düşünce kayan bölüm `flex:1` ile
           yükseklik alamıyor, boyu bütün içeriğe (ölçüldü: 30782 px)
           uzuyor ve perdenin overflow:hidden'ı altını kesiyordu —
           liste donuyor, aşağıdaki fiillere inilemiyordu (Geylani:
           "bi fiile tıklayıp çıkınca scroll donuyor"). openTelaffuz()
           zaten 'flex' veriyor; dönüşte de aynısı. */
        document.getElementById('telaffuz-overlay').style.display = 'flex';
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
    document.getElementById('top-bar-panel').style.visibility = 'visible';
    document.getElementById('top-bar-panel').style.display = 'grid';
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
    if (stageLabel) stageLabel.innerText = ["MAZİ (Geçmiş Zaman)", "MUZARİ (Şimdiki / Geniş)", "EMİR (Emir Kipi)"][window.mCurrentStage];

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

        /* GÜVENLİK KEMERİ: başka bir ekran (maraton/atlas) üst satıra
           satıriçi display bırakmış olabilir; pencere her açılışta
           temizlensin ki "çok kullanılan fiiller" ve ✕ hep görünsün. */
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

/* KELİME LİSTELERİ MOTORU AYRI DOSYAYA TAŞINDI → sarf/kelimeler.js
   (konu listeleri, Liste Modu, Çalışma Kartları, Hafıza Oyunu).
   Aynı dosyayı kelimeler.html de yüklüyor; davranış tek yerde durur. */
window.openGrammarOverlay = function(stage) {
    /* AYARLARDAKİ "DİLBİLGİSİ BAŞLIKLARI" ANAHTARI — öntanımlı açık.
       Kapalıyken sütun başlığına dokunmak dilbilgisi ekranını açmıyor;
       başlık yalnız bir başlık olarak kalıyor. */
    var _gb = document.getElementById('gramerBaslikCheckbox');
    if (_gb && !_gb.checked) return;
    if (window.fdmTahtaEkranda && window.fdmTahtaEkranda()) return;   /* tahta açık: başlıklar kilitli */
    var kaynak = null;
    if (window.event) {
        window.event.preventDefault();
        window.event.stopPropagation();
        var t = window.event.target;
        kaynak = (t && t.closest) ? t.closest('.th-3d-btn, .block-title') : null;
    }
    var r0 = kaynak ? kaynak.getBoundingClientRect() : null;
    window.openAtlasOverlay(stage);
    if (r0 && r0.width) window._atlasBaslikMorf(r0);
};

/* BASLIK MORFU: tablodaki baslik (MAZI ... TAFDIL, CEMI TEKSIR ...)
   yerinden kalkip dilbilgisi seridindeki AKTIF hapa DONUSEREK ucar;
   ekran da yumusak belirir. "Mazi yazisi birden kaybolup birden
   belirmesin" (Geylani). Hap ucus bitene dek gizli tutulur. */
window._atlasBaslikMorf = function (r0) {
    var overlay = document.getElementById('marathon-overlay');
    var hedef = document.querySelector('#atlasKonuSerit .atlas-konu-hap.aktif');
    if (!overlay) return;
    /* Ekran yumusak belirir (beyaz caka yok) */
    overlay.style.transition = 'none';
    overlay.style.opacity = '0';
    void overlay.offsetHeight;
    overlay.style.transition = 'opacity .38s ease';
    overlay.style.opacity = '1';
    setTimeout(function () { overlay.style.transition = ''; overlay.style.opacity = ''; }, 470);
    if (!hedef) return;
    var r1 = hedef.getBoundingClientRect();
    if (!r1.width) return;
    var cs = getComputedStyle(hedef);
    var klon = document.createElement('div');
    klon.textContent = hedef.textContent;
    klon.style.cssText =
        'position:fixed; z-index:2147483647; display:flex; align-items:center; justify-content:center;' +
        ' left:' + r1.left + 'px; top:' + r1.top + 'px; width:' + r1.width + 'px; height:' + r1.height + 'px;' +
        ' background:' + cs.backgroundColor + '; color:#fff; font-weight:700; font-family:sans-serif;' +
        ' font-size:' + cs.fontSize + '; border-radius:' + cs.borderRadius + ';' +
        ' box-shadow:0 4px 0 rgba(0,0,0,.2), inset 0 2px 0 rgba(255,255,255,.4);' +
        ' pointer-events:none; transform-origin:0 0; white-space:nowrap;';
    klon.style.transform = 'translate(' + (r0.left - r1.left) + 'px,' + (r0.top - r1.top) + 'px)' +
        ' scale(' + (r0.width / r1.width) + ',' + (r0.height / r1.height) + ')';
    document.body.appendChild(klon);
    hedef.style.visibility = 'hidden';
    void klon.offsetHeight;
    klon.style.transition = 'transform .55s cubic-bezier(.22,1,.36,1)';
    klon.style.transform = '';
    setTimeout(function () {
        hedef.style.visibility = '';
        klon.remove();
    }, 600);
};

// ===== ATLAS DATA =====
window.isAtlasMode = false;

window.atlasVerbsData = {
    "قرأ": { trMean: { mazi: "okudu", muzari: "okuyor", emir: "oku" }, mazi: ["قَرَأَ", "قَرَآ", "قَرَأُوا", "قَرَأَتْ", "قَرَأَتَا", "قَرَأْنَ", "قَرَأْتَ", "قَرَأْتُمَا", "قَرَأْتُمْ", "قَرَأْتِ", "قَرَأْتُمَا", "قَرَأْتُنَّ", "قَرَأْتُ", "قَرَأْنَا", "قَرَأْنَا"], muzari: ["يَقْرَأُ", "يَقْرَآنِ", "يَقْرَأُونَ", "تَقْرَأُ", "تَقْرَآنِ", "يَقْرَأْنَ", "تَقْرَأُ", "تَقْرَآنِ", "تَقْرَأُونَ", "تَقْرَئِينَ", "تَقْرَآنِ", "تَقْرَأْنَ", "أَقْرَأُ", "نَقْرَأُ", "نَقْرَأُ"], emir: ["اِقْرَأْ", "اِقْرَآ", "اِقْرَأُوا", "اِقْرَئِي", "اِقْرَآ", "اِقْرَأْنَ"] },
    "ظنّ": { trMean: { mazi: "sandı", muzari: "sanıyor", emir: "san" }, mazi: ["ظَنَّ", "ظَنَّا", "ظَنُّوا", "ظَنَّتْ", "ظَنَّتَا", "ظَنَنَّ", "ظَنَنْتَ", "ظَنَنْتُمَا", "ظَنَنْتُمْ", "ظَنَنْتِ", "ظَنَنْتُمَا", "ظَنَنْتُنَّ", "ظَنَنْتُ", "ظَنَنَّا", "ظَنَنَّا"], muzari: ["يَظُنُّ", "يَظُنَّانِ", "يَظُنُّونَ", "تَظُنُّ", "تَظُنَّانِ", "يَظْنُنَّ", "تَظُنُّ", "تَظُنَّانِ", "تَظُنُّونَ", "تَظُنِّينَ", "تَظُنَّانِ", "تَظْنُنَّ", "أَظُنُّ", "نَظُنُّ", "نَظُنُّ"], emir: ["ظُنَّ", "ظُنَّا", "ظُنُّوا", "ظُنِّي", "ظُنَّا", "اُظْنُنَّ"] },
    "وجد": { trMean: { mazi: "buldu", muzari: "buluyor", emir: "bul" }, mazi: ["وَجَدَ", "وَجَدَا", "وَجَدُوا", "وَجَدَتْ", "وَجَدَتَا", "وَجَدْنَ", "وَجَدْتَ", "وَجَدْتُمَا", "وَجَدْتُمْ", "وَجَدْتِ", "وَجَدْتُمَا", "وَجَدْتُنَّ", "وَجَدْتُ", "وَجَدْنَا", "وَجَدْنَا"], muzari: ["يَجِدُ", "يَجِدَانِ", "يَجِدُونَ", "تَجِدُ", "تَجِدَانِ", "يَجِدْنَ", "تَجِدُ", "تَجِدَانِ", "تَجِدُونَ", "تَجِدِينَ", "تَجِدَانِ", "تَجِدْنَ", "أَجِدُ", "نَجِدُ", "نَجِدُ"], emir: ["جِدْ", "جِدَا", "جِدُوا", "جِدِي", "جِدَا", "جِدْنَ"] },
    "قال": { trMean: { mazi: "söyledi", muzari: "söylüyor", emir: "söyle" }, mazi: ["قَالَ", "قَالَا", "قَالُوا", "قَالَتْ", "قَالَتَا", "قُلْنَ", "قُلْتَ", "قُلْتُمَا", "قُلْتُمْ", "قُلْتِ", "قُلْتُمَا", "قُلْتُنَّ", "قُلْتُ", "قُلْنَا", "قُلْنَا"], muzari: ["يَقُولُ", "يَقُولَانِ", "يَقُولُونَ", "تَقُولُ", "تَقُولَانِ", "يَقُلْنَ", "تَقُولُ", "تَقُولَانِ", "تَقُولُونَ", "تَقُولِينَ", "تَقُولَانِ", "تَقُلْنَ", "أَقُولُ", "نَقُولُ", "نَقُولُ"], emir: ["قُلْ", "قُولَا", "قُولُوا", "قُولِي", "قُولَا", "قُلْنَ"] },
    "نسي": { trMean: { mazi: "unuttu", muzari: "unutuyor", emir: "unut" }, mazi: ["نَسِيَ", "نَسِيَا", "نَسُوا", "نَسِيَتْ", "نَسِيَتَا", "نَسِينَ", "نَسِيتَ", "نَسِيتُمَا", "نَسِيتُمْ", "نَسِيتِ", "نَسِيتُمَا", "نَسِيتُنَّ", "نَسِيتُ", "نَسِينَا", "نَسِينَا"], muzari: ["يَنْسَى", "يَنْسَيَانِ", "يَنْسَوْنَ", "تَنْسَى", "تَنْسَيَانِ", "يَنْسَيْنَ", "تَنْسَى", "تَنْسَيَانِ", "تَنْسَوْنَ", "تَنْسَيْنَ", "تَنْسَيَانِ", "تَنْسَيْنَ", "أَنْسَى", "نَنْسَى", "نَنْسَى"], emir: ["اِنْسَ", "اِنْسَيَا", "اِنْسَوْا", "اِنْسَيْ", "اِنْسَيَا", "اِنْسَيْنَ"] },
    "علّم": { trMean: { mazi: "öğretti", muzari: "öğretiyor", emir: "öğret" }, mazi: ["عَلَّمَ", "عَلَّمَا", "عَلَّمُوا", "عَلَّمَتْ", "عَلَّمَتَا", "عَلَّمْنَ", "عَلَّمْتَ", "عَلَّمْتُمَا", "عَلَّمْتُمْ", "عَلَّمْتِ", "عَلَّمْتُمَا", "عَلَّمْتُنَّ", "عَلَّمْتُ", "عَلَّمْنَا", "عَلَّمْنَا"], muzari: ["يُعَلِّمُ", "يُعَلِّمَانِ", "يُعَلِّمُونَ", "تُعَلِّمُ", "تُعَلِّمَانِ", "يُعَلِّمْنَ", "تُعَلِّمُ", "تُعَلِّمَانِ", "تُعَلِّمُونَ", "تُعَلِّمِينَ", "تُعَلِّمَانِ", "تُعَلِّمْنَ", "أُعَلِّمُ", "نُعَلِّمُ", "نُعَلِّمُ"], emir: ["عَلِّمْ", "عَلِّمَا", "عَلِّمُوا", "عَلِّمِي", "عَلِّمَا", "عَلِّمْنَ"] },
    "اعترف": { trMean: { mazi: "itiraf etti", muzari: "itiraf ediyor", emir: "itiraf et" }, mazi: ["اِعْتَرَفَ", "اِعْتَرَفَا", "اِعْتَرَفُوا", "اِعْتَرَفَتْ", "اِعْتَرَفَتَا", "اِعْتَرَفْنَ", "اِعْتَرَفْتَ", "اِعْتَرَفْتُمَا", "اِعْتَرَفْتُمْ", "اِعْتَرَفْتِ", "اِعْتَرَفْتُمَا", "اِعْتَرَفْتُنَّ", "اِعْتَرَفْتُ", "اِعْتَرَفْنَا", "اِعْتَرَفْنَا"], muzari: ["يَعْتَرِفُ", "يَعْتَرِفَانِ", "يَعْتَرِفُونَ", "تَعْتَرِفُ", "تَعْتَرِفَانِ", "يَعْتَرِفْنَ", "تَعْتَرِفُ", "تَعْتَرِفَانِ", "تَعْتَرِفُونَ", "تَعْتَرِفِينَ", "تَعْتَرِفَانِ", "تَعْتَرِفْنَ", "أَعْتَرِفُ", "نَعْتَرِفُ", "نَعْتَرِفُ"], emir: ["اِعْتَرِفْ", "اِعْتَرِفَا", "اِعْتَرِفُوا", "اِعْتَرِفِي", "اِعْتَرِفَا", "اِعْتَرِفْنَ"] },
    "انقلب": { trMean: { mazi: "devrildi", muzari: "devriliyor", emir: "devril" }, mazi: ["اِنْقَلَبَ", "اِنْقَلَبَا", "اِنْقَلَبُوا", "اِنْقَلَبَتْ", "اِنْقَلَبَتَا", "اِنْقَلَبْنَ", "اِنْقَلَبْتَ", "اِنْقَلَبْتُمَا", "اِنْقَلَبْتُمْ", "اِنْقَلَبْتِ", "اِنْقَلَبْتُمَا", "اِنْقَلَبْتُنَّ", "اِنْقَلَبْتُ", "اِنْقَلَبْنَا", "اِنْقَلَبْنَا"], muzari: ["يَنْقَلِبُ", "يَنْقَلِبَانِ", "يَنْقَلِبُونَ", "تَنْقَلِبُ", "تَنْقَلِبَانِ", "يَنْقَلِبْنَ", "تَنْقَلِبُ", "تَنْقَلِبَانِ", "تَنْقَلِبُونَ", "تَنْقَلِبِينَ", "تَنْقَلِبَانِ", "تَنْقَلِبْنَ", "أَنْقَلِبُ", "نَنْقَلِبُ", "نَنْقَلِبُ"], emir: ["اِنْقَلِبْ", "اِنْقَلِبَا", "اِنْقَلِبُوا", "اِنْقَلِبِي", "اِنْقَلِبَا", "اِنْقَلِبْنَ"] },

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
    "درس": { trMean: { mazi: "çalıştı", muzari: "çalışıyor", emir: "çalış" }, mazi: ["دَرَسَ", "دَرَسَا", "دَرَسُوا", "دَرَسَتْ", "دَرَسَتَا", "دَرَسْنَ", "دَرَسْتَ", "دَرَسْتُمَا", "دَرَسْتُمْ", "دَرَسْتِ", "دَرَسْتُمَا", "دَرَسْتُنَّ", "دَرَسْتُ", "دَرَسْنَا", "دَرَسْنَا"], muzari: ["يَدْرُسُ", "يَدْرُسَانِ", "يَدْرُسُونَ", "تَدْرُسُ", "تَدْرُسَانِ", "يَدْرُسْنَ", "تَدْرُسُ", "تَدْرُسَانِ", "تَدْرُسُونَ", "تَدْرُسِينَ", "تَدْرُسَانِ", "تَدْرُسْنَ", "أَدْرُسُ", "نَدْرُسُ", "نَدْرُسُ"], emir: ["اُدْرُسْ", "اُدْرُسَا", "اُدْرُسُوا", "اُدْرُسِي", "اُدْرُسَا", "اُدْرُسْنَ"] },
    "nam": { trMean: { mazi: "uyudu", muzari: "uyuyor", emir: "uyu" }, mazi: ["نَامَ", "نَامَا", "نَامُوا", "نَامَتْ", "نَامَتَا", "نِمْنَ", "نِمْتَ", "نِمْتُمَا", "نِمْتُمْ", "نِمْتِ", "نِمْتُمَا", "نِمْتُنَّ", "نِمْتُ", "نِمْنَا", "نِمْنَا"], muzari: ["يَنَامُ", "يَنَامَانِ", "يَنَامُونَ", "تَنَامُ", "تَنَامَانِ", "يَنَامْنَ", "تَنَامُ", "تَنَامَانِ", "تَنَامُونَ", "تَنَامِينَ", "تَنَامَانِ", "تَنَامْنَ", "أَنَامُ", "نَنَامُ", "نَنَامُ"], emir: ["نَمْ", "نَامَا", "نَامُوا", "نَامِي", "نَامَا", "نَمْنَ"] },
    "نظف": { trMean: { mazi: "temizledi", muzari: "temizliyor", emir: "temizle" }, mazi: ["نَظَّفَ", "نَظَّفَا", "نَظَّفُوا", "نَظَّفَتْ", "نَظَّفَتَا", "نَظَّفْنَ", "نَظَّفْتَ", "نَظَّفْتُمَا", "نَظَّفْتُمْ", "نَظَّفْتِ", "نَظَّفْتُمَا", "نَظَّفْتُنَّ", "نَظَّفْتُ", "نَظَّفْنَا", "نَظَّفْنَا"], muzari: ["يُنَظِّفُ", "يُنَظِّفَانِ", "يُنَظِّفُونَ", "تُنَظِّفُ", "تُنَظِّفَانِ", "يُنَظِّفْنَ", "تُنَظِّفُ", "تُنَظِّفَانِ", "تُنَظِّفُونَ", "تُنَظِّفِينَ", "تُنَظِّفَانِ", "تُنَظِّفْنَ", "أُنَظِّفُ", "نُنَظِّفُ", "نُنَظِّفُ"], emir: ["نَظِّفْ", "نَظِّفَا", "نَظِّفُوا", "نَظِّفِي", "نَظِّفَا", "نَظَّفْنَ"] },
    "شرب": { trMean: { mazi: "içti", muzari: "içiyor", emir: "iç" }, mazi: ["شَرِبَ", "شَرِبَا", "شَرِبُوا", "شَرِبَتْ", "شَرِبَتَا", "شَرِبْنَ", "شَرِبْتَ", "شَرِبْتُمَا", "شَرِبْتُمْ", "شَرِبْتِ", "شَرِبْتُمَا", "شَرِبْتُنَّ", "شَرِبْتُ", "شَرِبْنَا", "شَرِبْنَا"], muzari: ["يَشْرَبُ", "يَشْرَبَانِ", "يَشْرَبُونَ", "تَشْرَبُ", "تَشْرَبَانِ", "يَشْرَبْنَ", "تَشْرَبُ", "تَشْرَبُونَ", "تَشْرَبُونَ", "تَشْرَبِينَ", "تَشْرَبَانِ", "تَشْرَبْنَ", "أَشْرَبُ", "نَشْرَبُ", "نَشْرَبُ"], emir: ["اِشْرَبْ", "اِشْرَبَا", "اِشْرَبُوا", "اِشْرَبِي", "اِشْرَبَا", "اِشْرَبْنَ"] },
    "أكل": { trMean: { mazi: "yedi", muzari: "yiyor", emir: "ye" }, mazi: ["أَكَلَ", "أَكَلَا", "أَكَلُوا", "أَكَلَتْ", "أَكَلَتَا", "أكَلْنَ", "أَكَلْتَ", "أَكَلْتُمَا", "أَكَلْتُمْ", "أَكَلْتِ", "أَكَلْتُمَا", "أَكَلْتُنَّ", "أَكَلْتُ", "أَكَلْنَا", "أَكَلْنَا"], muzari: ["يَأْكُلُ", "يَأْكُلَانِ", "يَأْكُلُونَ", "تَأْكُلُ", "تَأْكُلَانِ", "يَأْكُلْنَ", "تَأْكُلُ", "تَأْكُلَانِ", "تَأْكُلُونَ", "تَأْكُلِينَ", "تَأْكُلَانِ", "تَأْكُلْنَ", "آكُلُ", "نَأْكُلُ", "نَأْكُلُ"], emir: ["كُلْ", "كُلَا", "كُلُوا", "كُلِي", "كُلَا", "كُلْنَ"] },
    "أراد": { trMean: { mazi: "istedi", muzari: "istiyor", emir: "iste" }, mazi: ["أَرَادَ", "أَرَادَا", "أَرَادُوا", "أَرَادَتْ", "أَرَادَتَا", "أَرَدْنَ", "أَرَدْتَ", "أَرَدْتُمَا", "أَرَدْتُمْ", "أَرَدْتِ", "أَرَدْتُمَا", "أَرَدْتُنَّ", "أَرَدْتُ", "أَرَدْنَا", "أَرَدْنَا"], muzari: ["يُرِيدُ", "يُرِيدَانِ", "يُرِيدُونَ", "تُرِيدُ", "تُرِيدَانِ", "يُرِيدْنَ", "تُرِيدُ", "تُرِيدَانِ", "تُرِيدُونَ", "تُرِيدِينَ", "تُرِيدَانِ", "تُرِيدْنَ", "أُرِيدُ", "نُرِيدُ", "نُرِيدُ"], emir: ["أَرِدْ", "أَرِيدَا", "أَرِيدُوا", "أَرِيدِي", "أَرِيدَا", "أَرِدْنَ"] },
    "سافر": { trMean: { mazi: "seyahat etti", muzari: "seyahat ediyor", emir: "seyahat et" }, mazi: ["سَافَرَ", "سَافَرَا", "سَافَرُوا", "سَافَرَتْ", "سَافَرَتَا", "سَافَرْنَ", "سَافَرْتَ", "سَافَرْتُمَا", "سَافَرْتُمْ", "سَافَرْتِ", "سَافَرْتُمَا", "سَافَرْتُنَّ", "سَافَرْتُ", "سَافَرْنَا", "سَافَرْنَا"], muzari: ["يُسَافِرُ", "يُسَافِرَانِ", "يُسَافِرُونَ", "تُسَافِرُ", "تُسَافِرَانِ", "يُسَافِرْنَ", "تُسَافِرُ", "تُسَافِرَانِ", "تُسَافِرُونَ", "تُسَافِرِينَ", "تُسَافِرَانِ", "تُسَافِرْنَ", "أُسَافِرُ", "نُسَافِرُ", "نُسَافِرُ"], emir: ["سَافِرْ", "سَافِرَا", "سَافِرُوا", "سَافِرِي", "سَافِرَا", "سَافِرْنَ"] },
    "غسل": { trMean: { mazi: "yıkadı", muzari: "yıkıyor", emir: "yıka" }, mazi: ["غَسَلَ", "غَسَلَا", "غَسَلُوا", "غَسَلَتْ", "غَسَلَتَا", "غَسَلْنَ", "غَسَلْتَ", "غَسَلْتُمَا", "غَسَلْتُمْ", "غَسَلْتِ", "غَسَلْتُمَا", "غَسَلْتُنَّ", "غَسَلْتُ", "غَسَلْنَا", "غَسَلْنَا"], muzari: ["يَغْسِلُ", "يَغْسِلَانِ", "يَغْسِلُونَ", "تَغْسِلُ", "تَغْسِلَانِ", "يَغْسِلْنَ", "تَغْسِلُ", "تَغْسِلَانِ", "تَغْسِلُونَ", "تَغْسِلِينَ", "تَغْسِلَانِ", "تَغْسِلْنَ", "أَغْسِلُ", "نَغْسِلُ", "نَغْسِلُ"], emir: ["اِغْسِلْ", "اِغْسِلَا", "اِغْسِلُوا", "اِغْسِلِي", "اِغْسِلَا", "اِغْسِلْنَ"] }
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
    /* SEKME HAFIZASI: baska sekmeye gecmeden once acik sekmenin durumu
       (secili fiil + turetilen/acilan hucreler) kaydedilir. */
    try { if (window._atlasDurumKaydet) window._atlasDurumKaydet(); } catch (e) { }
    window.isAtlasMode = true;
    window.isAtlasFullscreen = false;
    let _sa = document.getElementById('screen-atlas');
    if(_sa) _sa.classList.remove('atlas-fullscreen');
    let _scrollCont = document.querySelector('#screen-atlas > div:first-of-type');
    if(_scrollCont) _scrollCont.scrollTop = 0;
    let _fsb = document.getElementById('atlas-fs-btn');
    if(_fsb) _fsb.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';

    let mOverlay = document.getElementById('marathon-overlay');
    mOverlay.classList.add('active');
    /* Atlas kipi YARI SAYDAM: arkadaki tablo hafif gorunur (CSS .atlas-modu).
       Maraton oyunu bu sinifi almaz, opak kalir. */
    mOverlay.classList.add('atlas-modu');
    /* AKICILIK: buzlu cam (backdrop-filter) UCUS BOYUNCA KAPALI. Olculdu:
       blur acikken acilis 1.6 sn'de 30 kare (~20 fps, 28 takilan), kapaliyken
       94 kare (60 fps, 3 takilan) — tarayici her karede tum ekrani yeniden
       bulaniklastiriyor. Ekran oturunca blur geri gelir, gorunum degismez. */
    mOverlay.classList.add('atlas-ucus');
    clearTimeout(window._atlasUcusZaman);
    window._atlasUcusZaman = setTimeout(function () {
        mOverlay.classList.remove('atlas-ucus');
    }, 660);
    mOverlay.scrollTop = 0;
    let _t = document.getElementById('timer-display'); if(_t) _t.style.display = 'none';
    let _l = document.getElementById('live-total-score'); if(_l) _l.style.display = 'none';
    let _c = document.getElementById('chrono-main'); if(_c) _c.style.display = 'none';
    let _s = document.getElementById('stage-label'); if(_s) _s.style.display = 'none';
    let _p = document.getElementById('pause-btn'); if(_p) _p.style.display = 'none';

    /* HATA DÜZELTMESİ (Geylani: "kök svg sine basınca bazen çok
       kullanılan fiil ve çarpı görünmüyor"): buradaki seçici kapsamsızdı
       ve atlas açılırken KÖKLER PENCERESİNDEKİ üst satırı (çok kullanılan
       fiiller + ✕ + kök sayısı rozeti) satıriçi display:none ile
       gizliyordu. Atlas kapanınca kimse geri açmadığı için o satır
       kalıcı olarak kayboluyordu. Artık yalnız maraton ekranının içine
       bakılıyor — orada böyle bir kutu yok, dolayısıyla bu satır
       kökler penceresine hiç dokunmuyor. */
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
    
    let gameWrapper = document.getElementById('game-wrapper');
    if (gameWrapper) gameWrapper.style.display = 'flex';
    
    document.getElementById('screen-play').classList.add('active');
    document.getElementById('screen-result').classList.remove('active');
    
    let prevArr = document.getElementById('prev-arr');
    if (prevArr) prevArr.style.display = 'none';
    let nextArr = document.getElementById('next-arr');
    if (nextArr) nextArr.style.display = 'none';
    
    document.getElementById('top-bar-panel').style.display = 'none';
    document.getElementById('screen-play').style.display = '';
    document.getElementById('screen-atlas').style.display = '';
    document.getElementById('screen-result').style.display = '';
    showMarathonScreen('screen-atlas');
    document.getElementById('screen-atlas').style.position = 'relative';
    




    
    
    window._atlasAcikStage = stage;   /* kaydirma gezintisi icin acik baslik */
    window.currentStage = stage.replace('_mezid', '').toLowerCase();
    let arTitle, trTitle, desc, descBottom = "";
    let hasTable = false;

    // Verb Stages (with Tables)
    if (stage === 'mazi' || stage === 'mazi_mezid') {
        arTitle = "الماضي"; trTitle = "Geçmiş Zaman (Mazi)"; 
        desc = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
            <p><strong>Mazi Fiil</strong>, genel olarak geçmişte yapılmış ve tamamlanmış eylemleri ifade eder. Çekimi fiilin sonuna eklenen bitişik zamirlerle (soneklerle) yapılır.</p>
        </div>`;
        descBottom = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
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
        desc = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
            <p><strong>Muzari Fiil</strong>, eylemin şu an yapıldığını (şimdiki zaman), her zaman yapıldığını (geniş zaman) veya gelecekte yapılacağını bildirir. Çekimi fiilin başına getirilen "Eteyne (أتين)" harfleriyle ve soneklerle yapılır.</p>
        </div>`;
        descBottom = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
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
        desc = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
            <p><strong>Emir Fiili</strong>, karşımızdaki kişiden (muhatap/muhataba) bir işi yapmasını istemek için kullanılır.</p>
        </div>`;
        descBottom = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
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
        desc = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
            <p><strong>Mastar</strong>, eylemin kök adıdır (yapmak, etmek gibi). Fiilin bildirdiği işi, zamana veya şahsa bağlı olmadan bağımsız bir "isim" olarak ifade eder.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">كِتَابَة</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">Yazmak</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">دُخُول</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">Girmek</span>
                </div>
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
    } else if (stage === 'ismi_fail') {
        arTitle = "اِسْمُ الفاعِل"; trTitle = "İsmi Fail (Etken Ortaç)"; 
        desc = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
            <p>Fiili yapanı, eylemi gerçekleştireni (özneyi) gösteren türemiş isimdir. Sülasi mücerred (3 harfli) fiillerde <strong>"فَاعِل" (Fâil)</strong> kalıbında gelir.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">كَاتِب</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">Yazan / Kâtip</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">عَالِم</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">Bilen / Âlim</span>
                </div>
            </div>
            <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Türkçe'deki Kullanımı:</h4>
                <p style="margin: 0;">Türkçemizde Arapça kökenli binlerce "İsmi Fail" kalıbı vardır. Sesi <em>-Â -İ</em> şeklinde uzatarak hissetmek çok kolaydır:<br><br>
                <strong>Örnekler:</strong> Câhil, Hâkim, Sâlim, Zâlim, Fâtih, Kâşif, Nâzım, Şâir, Sâbır, Şâkir, Sâdık...</p>
            </div>
        </div>`;
    } else if (stage === 'ismi_meful') {
        arTitle = "اِسْمُ المَفْعول"; trTitle = "İsmi Mef'ul (Edilgen Ortaç)"; 
        desc = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
            <p>Yapılan işten (eylemden) etkilenen kişiyi veya nesneyi gösteren türemiş isimdir. Sülasi mücerred fiillerde <strong>"مَفْعُول" (Mef'ûl)</strong> kalıbında gelir.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">مَكْتُوب</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">Yazılan / Mektup</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">مَعْلُوم</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">Bilinen / Malum</span>
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
        desc = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
            <p>Eylemin yapıldığı <strong>zamanı</strong> veya eylemin gerçekleştiği <strong>yeri (mekan)</strong> ifade etmek için kullanılan kalıplardır.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">مَكْتَب</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">Yazı Yeri (Ofis/Mektep)</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">مَسْجِد</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">Secde Yeri (Mescit)</span>
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
        desc = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
            <p>Bir işin bizzat kendisiyle yapıldığı <strong>aleti, cihazı veya aracı</strong> ifade etmek için türetilen isimlerdir.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">مِفْتَاح</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">Açma Aleti (Anahtar)</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">مِكْنَسَة</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">Süpürme Aleti (Süpürge)</span>
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
        desc = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
            <p>Kelimenin tekil (müfred) yapısının kırılarak (harf eklenip çıkarılarak veya harekeleri değiştirilerek) oluşturulduğu <strong>düzensiz çoğul</strong> türüdür. Kurallı çoğullar gibi (Müslim > Müslimûn) sonuna standart bir ek almaz; ezberlenmesi gerekir.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">أَقْلاَم</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">(Kalem) Kalemler</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">كُتُب</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">(Kitap) Kitaplar</span>
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
        desc = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
            <p>Varlığın küçüklüğünü, azlığını veya ona duyulan <strong>sevgi, şefkat ya da bazen küçümsemeyi</strong> ifade etmek için kullanılan özel kalıptır.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">كُتَيِّب</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">(Kitap) Kitapçık</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">وُلَيْد</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">(Veled) Çocukcağız</span>
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
        desc = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
            <p>Sıfatlarda kıyaslama (<strong>daha</strong>) veya en üstünlük (<strong>en</strong>) bildiren isimdir. Eril (Müzekker) için <strong>أَفْعَل (Ef'al)</strong>, Dişil (Müennes) için <strong>فُعْلَى (Fu'lâ)</strong> kalıbı kullanılır.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">أَكْبَر</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">En Büyük (Eril)</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">كُبْرَى</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">En Büyük (Dişil)</span>
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
    }
    
    // Mezid Nouns (No Tables)
    else if (stage === 'mastar_mezid') {
        arTitle = "المَصْدَر"; trTitle = "Mastar (Mezid)"; 
        desc = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
            <p>Mezid (harf eklenmiş) fiillerin mastarlarıdır. Sülasi Mücerred mastarların aksine, <strong>Mezid mastarlar tamamen kurallıdır (Kıyasîdir)</strong> ve her babın kendine özgü değişmez bir mastar kalıbı vardır.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">تَعْلِيم</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">(Tef'il Babı) Öğretmek</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">اِسْتِغْفار</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">(İstif'al) Bağışlanma Dilemek</span>
                </div>
            </div>
            <div style="background: #eef2ff; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Bab İsimleri Aslında Mastardır!</h4>
                <p style="margin: 0;">Bizim "İf'al, Tef'il, Mufaale" diyerek ezberlediğimiz bab isimleri, aslında o babların <strong>Mastar</strong> kalıplarından başka bir şey değildir. Türkçe'de kullandığımız "İslam, İmtihan, İstikbal, Mücadele, Tekbir, Tevekkül" kelimelerinin hepsi Mezid mastarlardır.</p>
            </div>
        </div>`;
    } else if (stage === 'ismi_fail_mezid') {
        arTitle = "اِسْمُ الفاعِل"; trTitle = "İsmi Fail (Mezid)"; 
        desc = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
            <p>Mezid fiillerde (harf eklenmiş fiillerde) işi yapanı gösterir. Kuralı çok basittir: Muzari fiilin başındaki muzaraat harfi atılır, yerine <strong>ötreli 'MİM' (مُ)</strong> getirilir ve <strong>sondan bir önceki harf ESRELİ</strong> okunur.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">مُعَلِّم</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">(Tef'il) Öğreten/Muallim</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">مُسْتَغْفِر</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">(İstif'al) Bağışlanma Dileyen</span>
                </div>
            </div>
            <div style="background: #f5f3ff; border-left: 4px solid #8b5cf6; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">Türkçe'deki Harika Uyumu:</h4>
                <p style="margin: 0;">Eğer bir kelime Türkçe'de <strong>"MÜ, MU"</strong> ile başlıyorsa ve sondan bir önceki sesli harfi ince (esre gibi i/ı) ise o eylemi yapan kişidir!<br>
                Müsl<strong>i</strong>m (Teslim olan), Mü'm<strong>i</strong>n (İman eden), Münaf<strong>ı</strong>k, Müşr<strong>i</strong>k, Mümteh<strong>i</strong>n, Mütekebb<strong>i</strong>r, Muall<strong>i</strong>m...</p>
            </div>
        </div>`;
    } else if (stage === 'ismi_meful_mezid') {
        arTitle = "اِسْمُ المَفْعول"; trTitle = "İsmi Mef'ul (Mezid)"; 
        desc = `<div style="text-align: left; font-size: clamp(2.0rem, 0.5vw + 1.6rem, 2.3rem); color: #000000; line-height: 1.7;">
            <p>Mezid fiillerde (harf eklenmiş fiillerde) yapılan işten etkileneni gösterir. Kuralı İsmi Fail ile neredeyse aynıdır: Muzari fiilin başına <strong>ötreli 'MİM' (مُ)</strong> getirilir, ancak İsmi Fail'in aksine <strong>sondan bir önceki harf ÜSTÜNLÜ</strong> okunur.</p>
            <div style="display: flex; justify-content: center; gap: 60px; margin: 25px 0;">
                <div style="background: #eff6ff; padding: 20px 40px; border-radius: 15px; border: 2px solid #bfdbfe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #2563eb; display: block; margin-bottom: 5px;">مُعَلَّم</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">Öğretilen (Kişi/Nesne)</span>
                </div>
                <div style="background: #fff7ed; padding: 20px 40px; border-radius: 15px; border: 2px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 4rem; color: #ea580c; display: block; margin-bottom: 5px;">مُسْتَخْرَج</span><br><span style="font-size: 1.8rem; color: #000000; font-weight: normal;">(Maden vb.) Çıkarılan Şey</span>
                </div>
            </div>
            <div style="background: #fff1f2; border-left: 4px solid #f43f5e; padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="margin: 0 0 10px 0; color: #000000;">İsmi Fail - İsmi Mef'ul Ayrımı (Esre mi Üstün mü?):</h4>
                <p style="margin: 0;">Türkçede de aynı kuralı kullanırız! Sondan bir önceki ses:<br>
                <strong>İ / I ise Yapan (İsmi Fail):</strong> Mükr<strong>i</strong>m (İkram eden), Müstakb<strong>i</strong>l (Karşılayan).<br>
                <strong>A / E ise Yapılan (İsmi Mef'ul):</strong> Mükr<strong>e</strong>m (İkram edilen), Müstakb<strong>e</strong>l (Karşılanan / Gelecek zaman).</p>
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
        elAr.style.color = isNoun ? '#2563eb' : '#16a34a'; // Isimler MAVI, fiiller YESIL (tablo ve serit ile ayni dil)
    }

    if(elTr) elTr.innerText = trTitle;
    try { window._atlasKonuSeritCiz(stage); } catch (e) { }
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
        let isMezidStage = stage.includes('_mezid');
        let mucerredKeys = ["كتب", "قرأ", "ظنّ", "أكل", "وجد", "قال", "نسي", "درس", "ذهب"];
        let mucerredIcons = ["✍️", "📖", "🤔", "🍏", "🔍", "🗣️", "🤷", "📚", "🚶"];
        let mezidKeys = ["استيقظ", "توضأ", "صلى", "تناول", "ساعد", "أراد", "علّم", "اعترف", "انقلب"];
        let mezidIcons = ["⏰", "💧", "🤲", "🍽️", "🤝", "🎯", "👨‍🏫", "💬", "🔄"];
        
        let activeKeys = isMezidStage ? mezidKeys : mucerredKeys;
        let activeIcons = isMezidStage ? mezidIcons : mucerredIcons;
        /* SEKME HAFIZASI: bu sekme daha once acildiysa o zamanki fiil secili doner */
        let _hatira = (window._atlasDurum || {})[stage];
        let _seciliFiil = (_hatira && activeKeys.indexOf(_hatira.fiil) >= 0) ? _hatira.fiil : activeKeys[0];
        
        activeKeys.forEach((k, idx) => {
            let icon = activeIcons[idx];
            let voweled = (window.displayVerbsMap[k]) ? window.displayVerbsMap[k] : k;
            
            let btn = document.createElement('button');
            btn.className = 'atlas-verb-btn';
            if (k === _seciliFiil) btn.classList.add('active');
            
            btn.innerHTML = `<span>${icon}</span> <span class="arabic" style="font-family: 'Arakom', sans-serif !important; font-size: 1.4rem;">${voweled}</span>`;
            
            btn.onclick = function() {
                window.changeAtlasVerb(k, this);
            };
            
            verbList.appendChild(btn);
        });
        
        window.currentAtlasVerbKey = _seciliFiil;
    }

    let flexContainer = document.querySelector('#screen-atlas > div:first-of-type');
    
    if (!hasTable) {
        if(tableView) tableView.style.display = 'none';
        if(sidebar) sidebar.style.display = 'none';
        if(flexContainer) {
            // Baslik ASLA kirpilmasin: her tarayicida guvenilir sekilde uste hizala.
            // (safe center bazi gomulu/akilli-tahta tarayicilarinda dogru calismiyor, o yuzden kullanmiyoruz)
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
        /* SEKME HAFIZASI: ayni fiil geri geldiyse turetilen hucreler de geri acilir */
        var _hatira2 = (window._atlasDurum || {})[stage];
        if (_hatira2 && _hatira2.fiil === window.currentAtlasVerbKey &&
            _hatira2.acilan && _hatira2.acilan.length)
            window._atlasGeriYukle = _hatira2.acilan.slice();
        window.handleAtlasVerbChange();
    }

    /* SEKME BAGIMSIZ GERI YUKLEME (her konu icin):
       - Tam ekran YALNIZ o sekmenin kendi hafizasindan doner; baska
         sekmede acilmis olmasi bu sekmeyi ETKILEMEZ.
       - Kaydirma (scroll) konumu da sekmeye ozel geri gelir. */
    var _hat3 = (window._atlasDurum || {})[stage];
    var _cs3 = stage.replace('_mezid', '');
    if (_hat3 && _hat3.tamEkran && !window.isAtlasFullscreen &&
        (_cs3 === 'mazi' || _cs3 === 'muzari')) {
        window.toggleAtlasFullscreen();
    }
    if (_hat3) {
        var _kayan3 = document.querySelector('#screen-atlas > div:first-of-type');
        if (_kayan3 && _hat3.kaydir) _kayan3.scrollTop = _hat3.kaydir;
        var _mo3 = document.getElementById('marathon-overlay');
        if (_mo3 && _hat3.kaydirUst) _mo3.scrollTop = _hat3.kaydirUst;
        if (_hat3.kaydirPencere) {
            /* icerik yerlesimini bekleyip pencereyi eski konuma getir */
            var _hedefY = _hat3.kaydirPencere;
            requestAnimationFrame(function () { window.scrollTo(0, _hedefY); });
        }
    }
};

/* Sekme basina durum: { fiil, acilan[] } — atlas acikken sekme degisiminde yazilir. */
window._atlasDurum = {};
window._atlasDurumKaydet = function () {
    var k = window._atlasAcikStage;
    if (!k || !window.isAtlasMode) return;
    var kap = document.getElementById('atlas-table-view');
    var acilan = [];
    if (kap) kap.querySelectorAll('.marathon-cell').forEach(function (c, i) {
        if (c.classList.contains('atlas-revealed')) acilan.push(i);
    });
    var kayan = document.querySelector('#screen-atlas > div:first-of-type');
    var mo = document.getElementById('marathon-overlay');
    window._atlasDurum[k] = { fiil: window.currentAtlasVerbKey, acilan: acilan,
                              tamEkran: !!window.isAtlasFullscreen,
                              kaydir: kayan ? kayan.scrollTop : 0,
                              kaydirUst: mo ? mo.scrollTop : 0,
                              /* asil kaydirici cogu duzende PENCEREdir */
                              kaydirPencere: (document.scrollingElement || document.documentElement).scrollTop || 0 };
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

    if (window._atlasGeriYukle) {   /* sekme hafizasindan geri acilis */
        window._tempRevealedIndices = window._atlasGeriYukle;
        window._atlasGeriYukle = null;
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
                <span class="arabic" id="arab-text-${i}" style="font-size:${window.isAtlasFullscreen ? "clamp(3rem, 6.5vh, 6rem)" : "clamp(4.0rem, 6.0vw, 8.0rem)"}; pointer-events:none; color: #ea580c; letter-spacing: -2px;">${pats[i].p}</span>
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
                arabSpan.style.fontSize = window.isAtlasFullscreen ? 'clamp(3rem, 6.5vh, 6rem)' : 'clamp(4.0rem, 6.0vw, 8.0rem)';
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
    
    if (!currentRoot || !sozlukVerileri[currentRoot]) return;

    // AÇILIŞ ANİMASYONU YALNIZ YENİ KÖKTE OYNAR. Aynı kökün listesi
    // kapatılıp yeniden açıldığında HAZIR gelir: ders akışında liste →
    // tabloda kalıbın yeri → listeye dönüş sık yapılıyor; her dönüşte
    // listenin 3 saniyede teker teker yeniden kurulması dersi bölüyordu.
    if (fdmSonKok !== currentRoot) {
        fdmAnimated = { mucerred: false, mezid: false };
    }
    fdmSonKok = currentRoot;
    
    // YENİ KLAVYEYİ KESİN OLARAK KAPAT
    // closeKeyboard artık ONAYLANMAMIŞ harfleri siliyor; buraya zaten
    // geçerli bir kökle geliniyor, o yüzden kapatmadan ÖNCE onaylıyoruz
    // ki kök elimizden gitmesin (aşağıdaki confirmRoot yine çalışır).
    if (typeof confirmRoot === 'function') confirmRoot();
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
        // Çarpı (X) butonu ile çakışmaması için sağdan margin verdik (margin-right: 70px)
        const rootPlateHtml = `<div class="fdm-root-plate draggable-root-clone" style="position: relative !important; top: 0 !important; left: 0 !important; transform: none !important; margin: 0 70px 0 0 !important; cursor: default !important; z-index: 10 !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 4.2rem !important; padding: 14px 20px 20px 10px !important; min-width: 250px !important; border-radius: 18px !important; flex-shrink: 0;"><span class="root-text-content">${formattedTitle}</span></div>`;
        
        const infoHtml = `
            <div dir="ltr" style="background: rgba(255,255,255,0.95); border: 1px solid rgba(0,0,0,0.05); border-radius: 16px; padding: 15px 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); font-family: 'Arakom', sans-serif; display: flex; flex-direction: column; justify-content: center; flex: 1; text-align: left;">
                <div style="display: flex; gap: 30px; margin-bottom: 0px; justify-content: flex-start;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="display:inline-block; width: 22px; height: 22px; background: #27ae60; border-radius: 6px;"></span>
                        <span style="font-size: 1.8rem; color: #333; font-weight: normal;">FİİLLER</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="display:inline-block; width: 22px; height: 22px; background: #2980b9; border-radius: 6px;"></span>
                        <span style="font-size: 1.8rem; color: #333; font-weight: normal;">İSİMLER</span>
                    </div>
                </div>
                <div style="font-size: 1.8rem; color: #555; line-height: 1.6;">
                    <span style="font-weight: normal; color: #2980b9; font-size: 1.8rem;">Not:</span> Türkçeye geçen Arapça kelimeler genellikle isimlerdir.
                </div>
            </div>
        `;
        
        // RTL sayfada ilk eleman sağda görünür. Bu yüzden rootPlateHtml'i başa alıyoruz.
        fdmContainer.innerHTML = `<div style="display: flex; align-items: stretch; justify-content: space-between; width: 100%; gap: 30px; padding: 10px;">${rootPlateHtml}${infoHtml}</div>`;
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
            const ignoreKeys = ["base", "cekimi", "isNotVerb", "ornek", "tekil", "cogul", "isDictOnly", "tip", "cogulTr", "suggestsPlus", "hasZamirCekimi", "zamirBase", "autoGenerated"];
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
        let coloredArTextFdm = (typeof colorizeArabicWord === 'function' && currentRoot) ? colorizeArabicWord(arText, currentRoot) : arText;
        
        const html = `
            <div class="fdm-list-row" data-ref="${refId}" style="display: flex; padding: 18px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); border: 1px solid rgba(0,0,0,0.05); align-items: center; opacity: 0; transform: translateY(10px); transition: all 0.4s ease;">
                <div style="width: 65px; text-align: center; font-weight: normal; font-size: 1.8rem; color: #ffffff; background: ${numBg}; border-radius: 6px; padding: 8px;">${refId}</div>
                <div style="flex: 1; text-align: right; padding-right: 20px; font-family: 'Arakom', sans-serif; font-size: 3.4rem; color: #000;">${coloredArTextFdm} ${emoji}</div>
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
    
    // Üst paneli gizleme kodu kaldırıldı; mevcut kök levhası görünür kalacak.

    fdm.style.display = 'flex';
    
    // Varsayılan olarak Mücerred sekmesi açılır
    // (Animasyonların doğru tetiklenmesi için küçük bir gecikme ekliyoruz)
    setTimeout(() => {
        if (mucerredItems.length === 0 && mezidItems.length > 0) {
            triggerFDMTab('mezid');
        } else {
            triggerFDMTab('mucerred');
        }
    }, 50);
}

function closeFastDictionaryMode() {
    const fdm = document.getElementById('fast-dictionary-overlay');
    if (fdm) fdm.style.display = 'none';
    
    const tb = document.querySelector('.top-bar');
    if (tb) tb.style.display = 'flex';
    
    document.querySelectorAll('.draggable-root-clone').forEach(el => el.style.display = 'block');
}

let fdmTimeouts = [];
let fdmAnimated = { mucerred: false, mezid: false };
let fdmSonKok = null;      /* liste en son hangi kök için kuruldu */
function triggerFDMTab(tabType) {
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
        // YENİ: Liste hazır (animasyonsuz) açıldığında MEZİD sütunu da hazır
        // gelsin; mezid sekmesine ayrıca basmak gerekmesin. Mücerred
        // satırları nasıl açıksa mezid satırları da aynı şekilde görünür.
        if (isMucerred) fdmMezidiHazirla();
        fdmSekmeleriGuncelle();   /* her şey açıksa iki sekme de kırmızı */
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
        } else {
            fdmSekmeleriGuncelle();   /* mezid boşsa da "hepsi açık" sayılır */
        }
        return;
    }
    
    const delayStep = totalDuration / count;

    // Animasyon bitince sekme vurgularını tazele: iki liste de tamamsa
    // (mücerred + mezid) iki sekme başlığı birden kırmızı olur.
    let tSekme = setTimeout(fdmSekmeleriGuncelle, totalDuration + 450);
    fdmTimeouts.push(tSekme);

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
        }, totalDuration + 200); // Mücerred animasyonu bittikten hemen sonra
        fdmTimeouts.push(autoMezidTimer);
    }
}

/* Mücerred hazır (animasyonsuz) açıldığında mezid sütununu da sekmeye
   basmaya gerek bırakmadan görünür yapar. Sekme stillerine ve arka plan
   tablosuna DOKUNMAZ: aktif görünüm mücerredde kalır, mezid satırları
   yalnızca görünür hâle getirilir. Mezid animasyonu daha önce hiç
   oynamadıysa (liste, mücerred bitmeden kapatılmıştı) ilk açılıştaki
   akış sürer: kısa gecikmeyle otomatik mezid animasyonu başlar. */
function fdmMezidiHazirla() {
    if (fdmAnimated.mezid) {
        document.querySelectorAll('#tab2 .glass-box.sari-vurgu').forEach(box => {
            box.style.transition = 'all 0.4s ease';
            box.style.transform = 'scale(1)';
            box.style.opacity = '1';
            box.style.zIndex = '30'; box.style.position = 'relative';
        });
        document.querySelectorAll('#fdm-mezid-list .fdm-list-row').forEach(row => {
            row.style.transition = 'all 0.4s ease';
            row.style.transform = 'translateY(0)';
            row.style.opacity = '1';
        });
    } else if (document.querySelector('#fdm-mezid-list .fdm-list-row')) {
        let t = setTimeout(() => triggerFDMTab('mezid'), 250);
        fdmTimeouts.push(t);
    }
}

/* KULLANICI İSTEĞİ: hızlı listede TÜM kelimeler açılınca iki sekme de
   kırmızı vurgulu olsun. Bir liste, bütün satırları görünür kılındıysa
   tamamlanmıştır (boş liste de "tamam" sayılır); İKİSİ de tamamsa iki
   sekme başlığı birden kırmızıya döner. Animasyon sürerken normal
   aktif/pasif görünüm korunur. */
function fdmSekmeleriGuncelle() {
    const tam = sel => [...document.querySelectorAll(sel + ' .fdm-list-row')]
        .every(r => r.style.opacity === '1');
    if (tam('#fdm-mucerred-list') && tam('#fdm-mezid-list')) {
        [document.getElementById('fdm-mucerred-tab'),
         document.getElementById('fdm-mezid-tab')].forEach(tab => {
            if (!tab) return;
            tab.style.background = '#FF3B30';
            tab.style.color = '#ffffff';
            tab.style.boxShadow = '0 4px 10px rgba(255, 59, 48, 0.4)';
        });
    }
}



// --- GÜNÜN KÖKÜ (ROOT OF THE DAY) ---
function showRootOfDay() {
    /* AYARLARDAKİ "GÜNÜN KÖKÜ" ANAHTARI — öntanımlı kapalı. Kapalıyken
       pencere hiç açılmıyor (Geylani). Anahtar tarayıcı belleğinde. */
    var _gk = document.getElementById('gununKokuCheckbox');
    if (!_gk || !_gk.checked) return;
    /* İlk ziyarette ekranı kılavuz kaplıyor — günün kökü o sefer atlanır. */
    if (window._ktkIlkZiyaret) return;
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
    // Soru isareti (kapali) yuzu icin daha yumusak / dinlendirici tonlar
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
        <div id="rod-panel" style="background: #f5f5f7; width: 95%; max-width: 1100px; max-height: 90vh; overflow-y: auto; border-radius: 28px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative; transform: scale(0.95) translateY(20px); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1); text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            
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
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modalOverlay);
    
    setTimeout(() => {
        modalOverlay.style.opacity = "1";
        modalOverlay.firstElementChild.style.transform = "scale(1) translateY(0)";
    }, 50);

    // ==== GUNUN KOKU OYUNU: akici kirmizi kenar geri sayimi (20sn/kelime) + kart cevirme ====
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
        /* Perde 550 ms dolmadan kapatılmışsa panelin ölçüsü sıfırdır;
           w-sw negatife düşer ve tarayıcı <rect> için hata basar. */
        if(!panel.isConnected || w<=sw || h<=sw) return;
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
        rect.style.transition='none';
        rect.style.strokeDashoffset = (P*(1-frac)).toFixed(1);
        void rect.getBoundingClientRect(); // reflow
        rect.style.transition = 'stroke-dashoffset '+rem+'ms linear';
        rect.style.strokeDashoffset = P.toFixed(1);
        drainStart = Date.now();
        if(endTimer) clearTimeout(endTimer);
        endTimer = setTimeout(endGame, rem);
      }
      function endGame(){ if(ended) return; ended=true; if(endTimer) clearTimeout(endTimer);
        if(rect){ rect.style.transition='stroke-dashoffset .3s linear'; rect.style.strokeDashoffset = P.toFixed(1); }
        var rest=cards.filter(function(c){return !isFlipped(c);}); rest.forEach(function(c,i){ setTimeout(function(){ flip(c); }, i*280); }); }
      cards.forEach(function(c){ c.addEventListener('click', function(){
        if(ended){ flip(c); return; }
        if(flip(c)){ var rem=curRemaining()-20000; remaining=Math.max(0,rem); if(remaining<=0){ endGame(); } else { startDrain(); } }
      }); });
      function reposition(){ if(svg && panel && rect){ var w=panel.offsetWidth,h=panel.offsetHeight,sw=6; /* Perde kapanmışsa ölçü sıfırdır: negatif <rect> yazmayalım. */ if(!panel.isConnected || w<=sw || h<=sw) return; svg.style.left=panel.offsetLeft+'px'; svg.style.top=panel.offsetTop+'px'; svg.setAttribute('width',w); svg.setAttribute('height',h); rect.setAttribute('width',w-sw); rect.setAttribute('height',h-sw); } }
      window.addEventListener('resize', reposition);
      setTimeout(function(){ buildTimer(); startDrain(); }, 550);
    })();
}


document.addEventListener('DOMContentLoaded', () => { setTimeout(() => { showRootOfDay(); }, 800); });


window.closeRootOfDay = function() {
    const modalOverlay = document.getElementById("rootOfDayOverlay");
    if (modalOverlay) {
        modalOverlay.style.opacity = "0";
        modalOverlay.firstElementChild.style.transform = "scale(0.95) translateY(-20px)";
        setTimeout(() => modalOverlay.remove(), 400);
    }
}


/* ============================================================================
   MARATON SÜZGECİ — kalıp listesi perdesindeki (kalipliste.js) süzgeç
   tasarımının aynısı. Tek fark: harf klavyesinin yerinde HARF SAYISI
   tuşları (3 · 4 · 5 · 6) duruyor, çünkü maratonda süzülen şey kökün baş
   harfi değil fiilin kaç harfli olduğudur. ÜÇ HARFLİLER DE SÜZÜLEBİLİR
   (Geylani: "rakamlarda 3 te olmalı"): sülâsî mücerred bâbların mazileri
   maraton havuzunda zaten vardı, yalnız süzgeçte tuşları yoktu. Aksâm-ı seb'a şeması birebir aynı:
   solda sahih üçü yeşil, sağda mu'tel dördü turuncu, her kart ad · tanım ·
   örnek fiil taşır. Sayılar canlıdır: o an kaç fiil düştüğünü gösterir.
   ========================================================================= */
window.MARATON_AKSAM = [
    { k: 'Sahih',  ad: 'Sâlim',  grup: 'sahih', kisa: 'Hepsi sağlam harf.', ornek: 'كَتَبَ' },
    { k: 'Mehmuz', ad: 'Mehmûz', grup: 'sahih', kisa: 'Bir harfi hemze.',   ornek: 'أَكَلَ' },
    { k: 'Muzaaf', ad: 'Muzâaf', grup: 'sahih', kisa: 'Son iki harf aynı.', ornek: 'مَدَّ'  },
    { k: 'Misal',  ad: 'Misâl',  grup: 'mutel', kisa: 'İLK harf illetli.',  ornek: 'وَجَدَ' },
    { k: 'Ecvef',  ad: 'Ecvef',  grup: 'mutel', kisa: 'ORTA harf illetli.', ornek: 'قَالَ' },
    { k: 'Nakıs',  ad: 'Nâkıs',  grup: 'mutel', kisa: 'SON harf illetli.',  ornek: 'رَمَى' },
    { k: 'Lefif',  ad: 'Lefîf',  grup: 'mutel', kisa: 'İki harfi illetli.', ornek: 'نَوَى' }
];

/* Süzgeç sayıları: her aksâm ve her harf sayısı için kaç MARATON FİİLİ var.
   applyTelaffuzFilter ile aynı kaynaktan (wordEasterEggs + getAvailableMaziVerbs)
   sayar ki rozetteki sayı ile listedeki fiil sayısı birbirini tutsun. */
/* Kök başındaki hemze biçimleri ve ى · ة klavyede kendi tuşlarında
   toplanmaz; kalıp listesi perdesindekiyle aynı eşleme kullanılır ki
   öğrenci iki ekranda aynı tuşa bassın. */
window.MARATON_HEMZE = { 'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ء': 'ا', 'ؤ': 'ا', 'ئ': 'ا', 'ى': 'ي', 'ة': 'ه' };
function maratonBasHarf(kok) {
    var h = String(kok || '').charAt(0);
    return window.MARATON_HEMZE[h] || h;
}

function maratonSayim() {
    var say = { aksam: {}, harf: {}, bas: {}, toplam: 0 };
    var kaynak = (typeof wordEasterEggs !== 'undefined') ? wordEasterEggs : {};
    Object.keys(kaynak).forEach(function (kok) {
        var aksamList = getAksamIseba(kok);
        var bh = maratonBasHarf(kok);
        var fiiller = (typeof getAvailableMaziVerbs === 'function') ? getAvailableMaziVerbs(kok) : [];
        fiiller.forEach(function (v) {
            var n = getLetterCountFromRefId(v.refId);
            /* Toplam ve aksâm sayıları BÜTÜN fiilleri kapsar; harf sayısı
               tuşları da artık 3'ten 6'ya kadar. Böylece "Hepsi" rozetiyle
               dört rakamın toplamı birbirini tutar. */
            say.toplam++;
            aksamList.forEach(function (a) { say.aksam[a] = (say.aksam[a] || 0) + 1; });
            say.bas[bh] = (say.bas[bh] || 0) + 1;
            if (n >= 3 && n <= 6) say.harf[n] = (say.harf[n] || 0) + 1;
        });
    });
    return say;
}

function maratonSuzgecCiz() {
    var yuva = document.getElementById('maraton-suzgec-yuva');
    if (!yuva) return;
    var say = maratonSayim();
    var f = window.telaffuzFilters || { letter: [], aksam: [], bas: [] };
    var secHarf  = (f.letter && f.letter.length) ? f.letter[0] : null;
    var secAksam = (f.aksam  && f.aksam.length)  ? f.aksam[0]  : null;
    var secBas   = (f.bas    && f.bas.length)    ? f.bas[0]    : null;
    var bosSuzgec = (!secHarf && !secAksam && !secBas);

    /* --- KLAVYE: kalıp perdesindekiyle aynı yerleşim (universalKeyboardLayout).
       Öğrenci kök ararken hangi tuşa basıyorsa burada da aynı yerde bulur.
       Sil tuşunun yerinde "Hepsi" durur: bütün süzgeçleri kaldırır. --- */
    var KLAVYE = (typeof universalKeyboardLayout !== 'undefined' && universalKeyboardLayout.length)
        ? universalKeyboardLayout
        : [['ذ','ض','ص','ث','ق','ف','غ','ع','ه','خ','ح','ج','د'],
           ['ش','س','ي','ب','ل','ا','ت','ن','م','ك','ط'],
           ['ئ','ء','ؤ','ر','ى','ة','و','ز','ظ','BACKSPACE']];
    var klavye = '';
    KLAVYE.forEach(function (satir) {
        klavye += '<div class="kl-kb-satir">';
        satir.forEach(function (h) {
            if (h === 'BACKSPACE') {
                klavye += '<button type="button" class="kl-tus kl-tus-hepsi' + (bosSuzgec ? ' kl-tus-secili' : '') +
                          '" title="Bütün süzgeçleri kaldır" onclick="maratonSec(null, null)">' +
                          '<span class="kl-tus-harf">Hepsi</span>' +
                          '<span class="kl-tus-sayi">' + say.toplam + '</span></button>';
                return;
            }
            var n = say.bas[h] || 0;
            var yazi = (h === 'ه') ? 'هـ' : h;
            if (!n) {
                var nere = window.MARATON_HEMZE[h];
                klavye += '<button type="button" class="kl-tus kl-tus-olu" disabled title="' +
                          (nere ? ('Bu harf ' + nere + ' tuşunda toplanıyor')
                                : ('Bu harfle başlayan maraton fiili yok')) + '">' +
                          '<span class="kl-tus-harf">' + yazi + '</span></button>';
                return;
            }
            klavye += '<button type="button" class="kl-tus' + (secBas === h ? ' kl-tus-secili' : '') +
                      '" title="' + h + ' ile başlayan ' + n + ' fiil"' +
                      ' onclick="maratonSec(\'bas\', \'' + h + '\')">' +
                      '<span class="kl-tus-harf">' + yazi + '</span>' +
                      '<span class="kl-tus-sayi">' + n + '</span></button>';
        });
        klavye += '</div>';
    });

    /* --- HARF SAYISI: en sağdaki dikey sütun (3 · 4 · 5 · 6) --- */
    var rakam = '';
    [3, 4, 5, 6].forEach(function (n) {
        var adet = say.harf[n] || 0;
        var sinif = 'kl-tus mt-tus' + (secHarf === n ? ' kl-tus-secili' : '') + (adet ? '' : ' kl-tus-olu');
        rakam += '<button type="button" class="' + sinif + '"' + (adet ? '' : ' disabled') +
                 ' title="' + n + ' harfli fiiller (' + adet + ')"' +
                 ' onclick="maratonSec(\'letter\', ' + n + ')">' +
                 '<span class="kl-tus-harf">' + n + '</span>' +
                 '<span class="kl-tus-sayi">' + adet + '</span></button>';
    });

    /* --- AKSÂM-I SEB'A ŞEMASI: kalıp perdesindeki şemanın aynısı --- */
    function sutun(grupAd, grup) {
        var uyeler = window.MARATON_AKSAM.filter(function (a) { return a.grup === grup; });
        var iz = '';
        uyeler.forEach(function (a, i) {
            var adet = say.aksam[a.k] || 0;
            var orta = (uyeler.length % 2 === 1 && i === uyeler.length - 1) ? ' kl-sk-orta' : '';
            var sinif = 'kl-sema-kart kl-sk-' + a.grup + orta +
                        (secAksam === a.k ? ' kl-sema-secili' : '') + (adet ? '' : ' kl-sema-bos');
            iz += '<button type="button" class="' + sinif + '"' + (adet ? '' : ' disabled') +
                  ' title="' + a.ad + ' — ' + adet + ' fiil"' +
                  ' onclick="maratonSec(\'aksam\', \'' + a.k + '\')">' +
                  '<span class="kl-sk-sayi">' + adet + '</span>' +
                  '<span class="kl-sk-ad">' + a.ad + '</span>' +
                  '<span class="kl-sk-tanim">' + a.kisa + '</span>' +
                  '<span class="kl-sk-ornek" dir="rtl">' + a.ornek + '</span></button>';
        });
        return '<div class="kl-sema-sutun kl-sema-' + grup + '">' +
               '<div class="kl-sema-baslik">' + grupAd + '</div>' +
               '<div class="kl-sema-izgara">' + iz + '</div></div>';
    }

    /* YERLEŞİM: üç soru, üç AYRI levha, yan yana —
       SOLDA klavye (hangi harfle başlıyor?), ORTADA aksâm-ı seb'a şeması
       (hangi cinsten?), EN SAĞDA harf sayısı (kaç harfli?). Her levha
       kendi başlığını ve kendi alt kenar rengini taşır; renkler sitenin
       renk dilinden: mavi · turuncu · kırmızı. */
    yuva.innerHTML =
        '<div class="mt-govde">' +
          '<div class="mt-kol mt-kol-klavye">' +
            '<div class="mt-kol-baslik mt-b-harf">KÖK HARFİ</div>' +
            '<div class="mt-klavye-sira" dir="rtl"><div class="kl-klavye">' + klavye + '</div></div>' +
          '</div>' +
          '<div class="mt-kol mt-kol-sema">' +
            '<div class="mt-kol-baslik mt-b-aksam">AKSÂM-I SEB\'A' +
              '<i class="fas fa-info-circle mt-bilgi" title="Aksâm-ı Seb\'a nedir?" onclick="showAksamSebaGenelInfo(event)"></i>' +
              semaBuyutecBtn() +
            '</div>' +
            /* SOLDA mu'tel, SAĞDA sahih dursun diye mu'tel önce yazılır. */
            '<div class="mt-sema-alan"><div class="kl-sema"><div class="kl-sema-dallar">' +
               sutun("MU\'TEL", 'mutel') + sutun('SAHİH', 'sahih') +
            '</div>' + semaSorSerit() + '</div></div>' +
          '</div>' +
          '<div class="mt-kol mt-rakam-sutun">' +
            '<div class="mt-kol-baslik mt-b-rakam">HARF</div>' +
            '<div class="mt-rakam-tuslar">' + rakam + '</div>' +
          '</div>' +
        '</div>';
}

/* Tek seçim: harf ile aksâm aynı anda uygulanabilir; aynısına ikinci kez
   basmak o süzgeci kaldırır. Hepsi = ikisini birden temizler. */
function maratonSec(tur, deger) {
    if (!window.telaffuzFilters) window.telaffuzFilters = { letter: [], aksam: [], bas: [] };
    if (!window.telaffuzFilters.bas) window.telaffuzFilters.bas = [];
    if (tur === null) {
        window.telaffuzFilters.letter = []; window.telaffuzFilters.aksam = []; window.telaffuzFilters.bas = [];
    }
    else {
        var mevcut = window.telaffuzFilters[tur];
        window.telaffuzFilters[tur] = (mevcut && mevcut.length && mevcut[0] === deger) ? [] : [deger];
    }
    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
    maratonSuzgecCiz();
    applyTelaffuzFilter();
}

// --- TELAFFUZ FILTRESI VE MARATON ARAMA ---
window.telaffuzFilters = {
    letter: [],   /* fiilin harf sayısı: 3 · 4 · 5 · 6 */
    aksam:  [],   /* aksâm-ı seb'a */
    bas:    []    /* kökün baş harfi (klavye) */
};

function openTelaffuz() {
    document.getElementById('telaffuz-overlay').style.display = 'flex';
    if (typeof maratonSuzgecCiz === 'function') maratonSuzgecCiz();
    applyTelaffuzFilter();
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
    applyTelaffuzFilter();
}

function showAksamSebaGenelInfo(e) {
    if(e) e.stopPropagation();
    if (window.fdmTahtaEkranda && window.fdmTahtaEkranda()) return;   /* tahta açık: ⓘ çalışmaz */
    document.getElementById('aksam-info-title').innerText = "Aksam-ı Seb'a Nedir?";
    document.getElementById('aksam-info-overlay').style.display = 'flex';
    document.getElementById('aksam-info-text').innerHTML = `
<div style="text-align: left; direction: ltr; padding: 25px; font-family: 'Inter', sans-serif;">
    <p style="margin-bottom: 35px; font-size: 2.5rem; color: #1e293b; line-height: 1.8;" dir="ltr">
        <strong style="color: #6c5ce7; font-size: 3rem;">Aksam-ı Seb'a (Yedi Kısım)</strong>, Arapça fiillerin ve kelimelerin içerdikleri temel harflerin (kök harflerin) ses ve yapı özelliklerine göre yedi farklı gruba ayrılmasıdır. Bir kelimenin kökündeki harflerin sahih (sağlam) veya illetli (zayıf) oluşu, o kelimenin nasıl çekimleneceğini doğrudan belirler.
    </p>

    <div style="background: #f0f9ff; border-left: 10px solid #3b82f6; padding: 30px; margin-bottom: 40px; border-radius: 0 16px 16px 0; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);" dir="ltr">
        <h4 style="margin: 0 0 20px 0; color: #1d4ed8; font-size: 3rem; font-weight: normal; border-bottom: 3px solid #bfdbfe; padding-bottom: 12px;" dir="ltr">Telaffuz İçin Önemi</h4>
        <p style="margin: 0; font-size: 2.5rem; color: #334155; line-height: 1.8;" dir="ltr">
            Arapçada illet harfleri (Vav, Ya, Elif) sesli harf işlevi de görebilir. Bu harflerin düşmesi, dönüşmesi veya başka bir harfle kaynaşması kelimenin vurgusunu ve doğal telaffuzunu tamamen değiştirir. Aksam-ı Seb'a'yı bilmek, illetli harflerin nerede uzatılacağını, nerede okunmayacağını öngörmeyi ve akıcı, doğru bir telaffuz (artikülasyon) yakalamayı sağlar.
            <br><br>
            <span style="color: #64748b; font-size: 2.5rem;">Örnek:</span> İkinci harfi illetli olan Ecvef bir kelimede, harfin dönüşümü sesi belirler:
            <br>
            <span dir="rtl" style="font-family: 'Arakom', sans-serif !important; font-size: 3.2rem; color: #3b82f6; margin: 0 10px; display: inline-block;">قَوَلَ</span>
            <span style="font-size: 2.5rem;">(Kavele) ➔</span>
            <span dir="rtl" style="font-family: 'Arakom', sans-serif !important; font-size: 3.2rem; color: #1d4ed8; margin: 0 10px; display: inline-block;">قَالَ</span>
            <span style="font-size: 2.5rem;">(Kâle - Elif'e dönüşüp uzatılır)</span>
        </p>
    </div>

    <div style="background: #fff7ed; border-left: 10px solid #f97316; padding: 30px; margin-bottom: 40px; border-radius: 0 16px 16px 0; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.1);" dir="ltr">
        <h4 style="margin: 0 0 20px 0; color: #c2410c; font-size: 3rem; font-weight: normal; border-bottom: 3px solid #fed7aa; padding-bottom: 12px;" dir="ltr">Dilbilgisi İçin Önemi</h4>
        <p style="margin: 0; font-size: 2.5rem; color: #334155; line-height: 1.8;" dir="ltr">
            Cümle kurulumlarında, özellikle mazi (geçmiş), muzari (şimdiki) ve emir kiplerinde fiil çekimleri çekirdek yapıya göre şekillenir.
            <br><br>
            Örneğin; bir fiil <strong style="color: #c2410c;">Misal</strong> (illet harfi başta) ise emir kipinde ilk harfini kaybedebilir:
            <br>
            <span dir="rtl" style="font-family: 'Arakom', sans-serif !important; font-size: 3.2rem; color: #f97316; margin: 0 10px; display: inline-block;">وَجَدَ</span>
            <span style="font-size: 2.5rem;">(Vecede) ➔ Emir:</span>
            <span dir="rtl" style="font-family: 'Arakom', sans-serif !important; font-size: 3.2rem; color: #c2410c; margin: 0 10px; display: inline-block;">جِدْ</span>
            <span style="font-size: 2.5rem;">(Cid)</span>
            <br><br>
            Veya <strong style="color: #c2410c;">Ecvef</strong> (illet harfi ortada) ise çoğul dişil çekimlerinde ortadaki harf tamamen düşebilir:
            <br>
            <span dir="rtl" style="font-family: 'Arakom', sans-serif !important; font-size: 3.2rem; color: #f97316; margin: 0 10px; display: inline-block;">قَالَ</span>
            <span style="font-size: 2.5rem;">(Kâle) ➔ Dişil Çoğul:</span>
            <span dir="rtl" style="font-family: 'Arakom', sans-serif !important; font-size: 3.2rem; color: #c2410c; margin: 0 10px; display: inline-block;">قُلْنَ</span>
            <span style="font-size: 2.5rem;">(Kulne)</span>
        </p>
    </div>

    <p style="margin-bottom: 0; font-size: 2.2rem; color: #64748b; font-style: italic; line-height: 1.7; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 30px;" dir="ltr">
        Kısacası bu yedi kategori; kelimenin genetik şifresini çözer, doğru telaffuzu garanti eder ve dilbilgisi istisnalarını kurallaştırır.
    </p>
</div>
`;

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
    resContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center;" dir="ltr">
            <i class="fas fa-spinner fa-pulse" style="font-size: 4rem; color: #3498db; margin-bottom: 20px;"></i>
            <div style="font-size: 1.4rem; color: #2c3e50; font-weight: 700; direction: ltr; unicode-bidi: isolate;">Maraton Fiilleri Yükleniyor...</div>
        </div>
    `;
    
    setTimeout(() => {
        let results = [];
        const requiredAksam = window.telaffuzFilters.aksam;
        const requiredLetters = window.telaffuzFilters.letter;
        const requiredBas = window.telaffuzFilters.bas || [];
        
        /* Süzgeç boşken artık uyarı yok: klavyedeki "Hepsi" tuşu ne
           söylüyorsa onu gösterir, yani bütün maraton fiillerini. */

        const sourceObj = typeof wordEasterEggs !== 'undefined' ? wordEasterEggs : {};
        const allRoots = Object.keys(sourceObj);
        allRoots.forEach(root => {
            const aksamList = getAksamIseba(root);
            
            /* Kök baş harfi süzgeci (klavye): hemze biçimleri elif tuşunda,
               ى ye tuşunda, ة he tuşunda toplanır. */
            if (requiredBas.length > 0) {
                if (typeof maratonBasHarf === 'function' && !requiredBas.includes(maratonBasHarf(root))) return;
            }
            
            if (requiredAksam.length > 0) {
                const matchAksam = requiredAksam.some(a => aksamList.includes(a));
                if (!matchAksam) return;
            }
            
            // Kökün tanımlı fiil hallerini al
            const verbs = (typeof getAvailableMaziVerbs === 'function') ? getAvailableMaziVerbs(root) : [];
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
            resContainer.innerHTML = '<div style="text-align:center; color:#7f8c8d; padding: 20px; font-size: 1.2rem;" dir="ltr">Kriterlere uygun fiil bulunamadı.</div>';
        } else {
            // Sonuçları alfabeye göre sırala (Önce Hemzeli vb.)
            results.sort((a, b) => a.verb.localeCompare(b.verb, 'ar'));
            let _mhtml = ''; // PERFORMANS: tek string, tek innerHTML
            results.forEach(r => {
                const escapedRoot = r.root.replace(/"/g, "&quot;").replace(/'/g, "\\'");
                /* MARATON KARTI — site renk dili (amber → turuncu → kırmızı).
                   Kartın tamamı düğmedir: üstüne gelince kalkar ve alt kenarı
                   kırmızıya döner, tıklayınca maraton başlar. Ayrı bir
                   oynatma simgesi yok, fiilin kendisi öne çıksın diye. */
                _mhtml += `
                    <div class="mt-kart" onclick="launchTelaffuzMarathon('${escapedRoot}', ${r.refId})"
                         title="${r.verb} — maratonu başlat" dir="rtl">
                        <span class="mt-kart-fiil">${r.verb}</span>
                        <span class="mt-kart-alt">
                            <span class="mt-kart-kok" dir="rtl">${r.root}</span>
                            <span class="mt-kart-aksam">${r.aksam}</span>
                            <span class="mt-kart-harf">${r.letters} harf</span>
                        </span>
                    </div>
                `;
            });
            resContainer.innerHTML = _mhtml;
        }
    }, 10);
}

function launchTelaffuzMarathon(root, refId) {
    document.getElementById('telaffuz-overlay').style.display = 'none';
    currentRoot = root;
    
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    clearInterval(window.mTimerInterval);
    clearInterval(window.mCountdownInterval); 
    window.mCurrentStage = 0; 
    window.mErrorMemory.clear(); 
    window.mElapsedTime = 0; 
    window.mIsPaused = false;
    window.mRaceMode = false;
    window.mSkippedLobby = true; 
    window.mLaunchedFromTelaffuz = true;
    
    let mOverlay = document.getElementById('marathon-overlay');
    if (mOverlay) {
        mOverlay.classList.add('active');
        mOverlay.scrollTop = 0;
    }
    
    const topBar = document.getElementById('top-bar-panel');
    if(topBar) {
        topBar.style.display = 'grid';
        topBar.style.visibility = 'visible';
    }
    
    document.getElementById('timer-display').style.display = 'block';
    document.getElementById('live-total-score').style.display = 'block';
    document.getElementById('chrono-main').style.display = 'block';
    document.getElementById('stage-label').style.display = 'block';
    document.getElementById('pause-btn').style.display = 'block';
    document.getElementById('game-wrapper').style.display = 'flex';
    
    if (typeof hideMarathonHeaders === 'function') hideMarathonHeaders(); 
    const chronoMain = document.getElementById('chrono-main');
    if(chronoMain) chronoMain.style.display = 'none'; 
    
    if (typeof buildMarathonDataForBab === 'function') buildMarathonDataForBab(refId);
    
    let selArea = document.getElementById('marathon-selection-area');
    if (selArea) selArea.style.display = 'none';
    
    if (typeof prepareMarathonPlay === 'function') prepareMarathonPlay();
}


/* ================= ATLAS KAYDIRMA GEZINTISI =================
   Mavi/yesil baslik detayi (atlas) ACIKKEN ekrani SOLA kaydir ->
   ayni tablonun SIRADAKI basligi; SAGA kaydir -> onceki. Klavye sag/sol
   ok da calisir. IKI DIZI BIRBIRINE GECMEZ:
   - Mucerred: mazi -> ... -> ismi_tafdil (sonda durur, mezide GECMEZ)
   - Mezid   : mazi_mezid -> ... -> ismi_meful_mezid
   Maraton oyunu acikken (isAtlasMode false) kaydirma HIC calismaz. */
window._atlasSiraMucerred = ['mazi', 'muzari', 'emir', 'mastar', 'ismi_fail',
    'zaman_mekan', 'ismi_meful', 'ismi_alet', 'cemi_teksir', 'ismi_tasgir', 'ismi_tafdil'];
window._atlasSiraMezid = ['mazi_mezid', 'muzari_mezid', 'emir_mezid',
    'mastar_mezid', 'ismi_fail_mezid', 'ismi_meful_mezid'];
window.atlasKomsuAc = function (adim) {
    if (!window.isAtlasMode) return;
    var k = window._atlasAcikStage;
    var dizi = null;
    if (window._atlasSiraMucerred.indexOf(k) >= 0) dizi = window._atlasSiraMucerred;
    else if (window._atlasSiraMezid.indexOf(k) >= 0) dizi = window._atlasSiraMezid;
    if (!dizi) return;
    var i = dizi.indexOf(k) + adim;
    if (i < 0 || i >= dizi.length) return;      /* uctan tasilmaz, tablolar birbirine gecmez */
    window._atlasGecisYap(dizi[i], adim);
};

/* YONLU GECIS ANIMASYONU (Arapca sayfa cevirme duzeni):
   - SIRADAKI yonu (adim=+1): eski icerik SAGA cikar, yeni ekran SOLDAN gelir.
   - ONCEKI yonu (adim=-1): eski icerik SOLA cikar, yeni ekran SAGDAN gelir. */
window._atlasGecisYap = function (hedef, adim) {
    /* CIFT KATMANLI KESINTISIZ GECIS:
       - SAHNE (screen-atlas) HIC oynatilmaz -> icindeki sabit carpi ve tam
         ekran tusu yerinden kipirdamaz (transform, fixed ogenin capasini
         degistirdigi icin eski yontem tuslari titretiyordu).
       - Eski sayfanin goruntu kopyasi (klon) ayni yere serilir; yeni sayfa
         hemen kurulur; IKISI AYNI ANDA kayar: eski disari suzulurken yeni
         iceri girer. Arada bos kare / durma ani / beyaz flas olmaz. */
    var sahne = document.getElementById('screen-atlas');
    var sarici = document.querySelector('#screen-atlas > div:first-of-type');
    if (!sahne || !sarici) { window.openAtlasOverlay(hedef); return; }
    var gecisNo = (window._atlasGecisSayac = (window._atlasGecisSayac || 0) + 1);

    /* onceki gecisten kalan klon varsa aninda kaldir (hizli ardisik jest) */
    var eskiKlon = document.getElementById('atlasGecisKlon');
    if (eskiKlon) eskiKlon.remove();

    /* 1) simdiki sayfanin kopyasi tam ayni konuma serilir */
    var klon = sarici.cloneNode(true);
    klon.id = 'atlasGecisKlon';
    var kayS = sarici.scrollTop;
    klon.style.position = 'absolute';
    klon.style.top = sarici.offsetTop + 'px';
    klon.style.left = sarici.offsetLeft + 'px';
    klon.style.width = sarici.clientWidth + 'px';
    klon.style.height = sarici.clientHeight + 'px';
    klon.style.margin = '0';
    klon.style.overflow = 'hidden';
    klon.style.pointerEvents = 'none';
    klon.style.zIndex = '40';   /* icerigin ustunde, sabit tuslarin (60) altinda */
    sahne.appendChild(klon);
    klon.scrollTop = kayS;

    /* 2) yeni sayfa hemen kurulur (sekme hafizasi + serit dahil) */
    window.openAtlasOverlay(hedef);

    /* 3) iki katman BIRLIKTE kayar — siradaki SOLDAN girer (RTL) */
    var E = 'cubic-bezier(.25,.1,.25,1)';
    sarici.style.transition = 'none';
    sarici.style.transform = 'translateX(' + (adim > 0 ? '-84px' : '84px') + ')';
    sarici.style.opacity = '0.55';
    void sarici.offsetWidth;
    sarici.style.transition = 'transform .3s ' + E + ', opacity .3s ' + E;
    klon.style.transition = 'transform .3s ' + E + ', opacity .3s ' + E;
    sarici.style.transform = 'translateX(0)';
    sarici.style.opacity = '1';
    klon.style.transform = 'translateX(' + (adim > 0 ? '84px' : '-84px') + ')';
    klon.style.opacity = '0';

    /* 4) temizlik — yalniz EN SON gecis yapar */
    setTimeout(function () {
        if (window._atlasGecisSayac !== gecisNo) { klon.remove(); return; }
        klon.remove();
        sarici.style.transition = '';
        sarici.style.transform = '';
        sarici.style.opacity = '';
    }, 340);
};

/* KONU SERIDINDEN dogrudan gecis: hedef konum mevcut konumdan ileriyse
   siradaki yonunde, geriyse onceki yonunde animasyonla acilir. */
window.atlasKonuyaGit = function (k) {
    if (!k || k === window._atlasAcikStage) return;
    var dizi = (window._atlasSiraMucerred.indexOf(k) >= 0) ? window._atlasSiraMucerred
             : (window._atlasSiraMezid.indexOf(k) >= 0) ? window._atlasSiraMezid : null;
    if (!dizi) return;
    var eski = dizi.indexOf(window._atlasAcikStage);
    var yeniIdx = dizi.indexOf(k);
    window._atlasGecisYap(k, (eski >= 0 && yeniIdx < eski) ? -1 : 1);
};

/* KONU SERIDI: Turkce basligin altinda YATAY kaydirmali mavi/yesil konu
   haplari — istenen basliga tek dokunusla gidilir. Fiil konulari MAVI,
   isim konulari YESIL (tablodaki baslik renkleriyle ayni dil). */
window._atlasKonuAd = {
    mazi: 'MAZİ', muzari: 'MUZARİ', emir: 'EMİR', mastar: 'MASTAR & S.MÜŞ',
    ismi_fail: 'İSMİ FAİL', zaman_mekan: 'ZAMAN MEKAN', ismi_meful: "İSMİ MEF'UL",
    ismi_alet: 'İSMİ ALET', cemi_teksir: 'CEMİ TEKSİR', ismi_tasgir: 'İSMİ TASGİR',
    ismi_tafdil: 'İSMİ TAFDİL', mazi_mezid: 'MAZİ', muzari_mezid: 'MUZARİ',
    emir_mezid: 'EMİR', mastar_mezid: 'MASTAR', ismi_fail_mezid: 'İSMİ FAİL',
    ismi_meful_mezid: "İSMİ MEF'UL"
};
window._atlasKonuSeritCiz = function (stage) {
    var baslik = document.getElementById('atlas-title-tr');
    if (!baslik) return;
    /* Cift baslik olmasin: renksiz gri Turkce baslik gizlenir —
       seritteki BUYUK renkli aktif hap basligin kendisidir. */
    baslik.style.display = 'none';
    if (!document.getElementById('atlasKonuStil')) {
        var st = document.createElement('style');
        st.id = 'atlasKonuStil';
        st.textContent =
            /* KARUSEL: aktif hap ORTADA ve BUYUK; komsular orta boy, uzaktakiler kucuk.
               Kenar dolgusu sayesinde ilk/son baslik da tam ortaya gelebilir. */
            /* CARPI VE TAM EKRAN TUSU SERIDIN ICINDE, BASLIKLARLA AYNI SIRADA.
               Eskiden ikisi de pencereye sabitlenmis (position:fixed) ayri bir
               katmandi; baslik seridinin kapsayicisi ise z-index:1200 ile butun
               genisligi kapliyordu. Sagda "ornek fiiller" sutunu OLMAYAN
               konularda (mastar, ismi fail, zaman mekan, cemi teksir, tasgir,
               tafdil...) serit carpinin uzerine biniyor, carpi tiklanamaz hale
               geliyordu — olculdu: elementFromPoint carpinin yerinde
               #atlasSeritIc donduruyordu (Geylani: "carpi basliklar
               konteynirinin altinda kaliyor, basligi carpi ile ayni yere
               koyalim, ekstra konteynir tasarimindan kacalim").
               Artik ikisi de seridin kendi cocugu: baslik hangi siradaysa
               carpi da onun yanindadir, binisme imkansiz, ayri bir kapsayici
               tasarimina da gerek kalmaz. */
            '#atlasSeritKap .atlas-ust-tus{position:static !important; top:auto !important;' +
            ' right:auto !important; left:auto !important; bottom:auto !important;' +
            ' flex:none; margin:0 0 0 8px; z-index:2 !important;}' +
            /* SABIT YATAY SERIT: kaymaz (sticky), basliklar ekrana dagilir,
               yalniz ACIK olan buyuktur. Sagdaki sabit carpi/tam ekran
               tuslarina carpmasin diye sagdan pay birakilir. */
            /* SERIT KAPSAYICISI: yapiskan olan bu. Sarici kutunun 20px
               dolgusunu negatif kenarla asar, boylece serit ekranin tam
               ustune yapisir, yanlarda ve ustte bosluk kalmaz. z-index
               yuksek (1200): mazi/muzari/emir tablolarindaki .marathon-cell
               kartlari z-index:1000 tasidigi icin kaydirirken seridin
               ustune cikiyordu. */
            /* top:-20px — sarici kutunun 20px ust dolgusu yapiskan durakta da
   kapansin; yoksa serit ile ekranin tepesi arasinda o kadarlik bir
   bosluk kaliyor ve icerik oradan gorunuyordu. */
            '#atlasSeritKap{position:sticky; top:-20px; z-index:1200; flex:none; display:flex;' +
            ' align-items:center; width:calc(100% + 40px); margin:-20px -20px 6px;' +
            ' padding-right:14px; box-sizing:border-box;' +
            ' background:rgba(241,242,246,.97); -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px);' +
            ' border-radius:0 0 16px 16px; box-shadow:0 6px 18px rgba(15,23,42,.10);}' +
            /* Iki uctaki oklar: basliklar arasinda yatay gecis oldugunu anlatir */
            '.atlas-serit-ok{flex:none; width:34px; height:34px; margin:0 5px; border:0; cursor:pointer;' +
            ' border-radius:50%; display:grid; place-items:center; background:#fff; color:#334155;' +
            ' box-shadow:0 2px 6px rgba(15,23,42,.16); font-size:21px; line-height:1; font-weight:900;' +
            ' font-family:sans-serif; transition:opacity .2s, transform .15s; z-index:2}' +
            '.atlas-serit-ok:hover{transform:translateY(-1px); color:#0f172a}' +
            '.atlas-serit-ok.pasif{opacity:.22; pointer-events:none}' +
            '#atlasKonuSerit{position:relative; z-index:1; flex:1 1 auto; display:flex; align-items:center;' +
            /* TEK SATIR + SAGA YASLI: 11 baslik dar ekranda sigmazsa satir
               kirilmaz, YATAY kaydirilir (cubuk gizli, tekerlek/parmak isler).
               RTL'de flex-start = sag kenar; sagdaki sabit carpi/tam ekran
               tuslari icin 128px pay birakilir. */
            ' flex-wrap:nowrap; direction:rtl; overflow-x:auto; -webkit-overflow-scrolling:touch;' +
            ' scrollbar-width:none; padding:12px 0 14px; margin:0; min-width:0; box-sizing:border-box;' +
            ' background:transparent;}' +
            /* IC SIRA: sigdiginda ORTALANIR, tasarsa kaydirilir. margin:auto
               hilesi kullanildi; justify-content:center tasan icerikte bas
               kismi ulasilmaz yapiyor. Carpi/tam ekran tuslari artik seridin
               KARDESI oldugu icin eskiden birakilan 122px'lik hayalet pay
               kaldirildi — basliklar bos yere sikismiyor. */
            '#atlasSeritIc{display:flex; align-items:center; gap:8px 6px; flex-wrap:nowrap;' +
            ' margin:0 auto; padding:0 6px;}' +
            '#atlasKonuSerit::-webkit-scrollbar{display:none}' +
            /* TAM EKRANDA BASLIK SERIDI YOK: tam ekranin amaci butun cekim
               tablosunu ayni anda gormek. Konular arasinda zaten ekrani
               saga-sola kaydirarak geciliyor, serit yeri bosa yiyordu.
               Ustteki aciklama blogu da (Turkce+Arapca baslik ve paragraf)
               tam ekranda gizlenir; alt aciklama zaten gizleniyordu. */
            /* Tam ekranda seridin KENDISI gizlenir ama kapsayici kalir: carpi
               ve tam ekran tusu artik onun icinde yasiyor. Kapsayici kucuk bir
               kose serifine donusur (sabit, saydam, yer kaplamaz) — eskiden
               tuslarin tek basina durdugu gorunumun aynisi. */
            '#screen-atlas.atlas-fullscreen #atlasSeritKap{position:fixed; top:0; right:0; left:auto;' +
            ' width:auto; margin:0; padding:14px 14px 0 0; background:transparent;' +
            ' -webkit-backdrop-filter:none; backdrop-filter:none; box-shadow:none; border-radius:0;}' +
            '#screen-atlas.atlas-fullscreen #atlasKonuSerit,' +
            '#screen-atlas.atlas-fullscreen .atlas-serit-ok{display:none !important}' +
            '#screen-atlas.atlas-fullscreen #atlas-explanation{display:none !important}' +
            /* KOSELI + DOLGULU + 3D TUS: tablodaki th-3d-btn ile AYNI hissiyat —
               alt kenar golgesi + ust ic isik; basinca 4px coker, golge yatar. */
            '.atlas-konu-hap{flex:none; border-radius:12px; font-family:sans-serif; font-weight:700;' +
            ' cursor:pointer; white-space:nowrap; border:none; color:#fff; user-select:none;' +
            ' box-shadow:0 4px 0 rgba(0,0,0,.2), inset 0 2px 0 rgba(255,255,255,.4);' +
            ' transform:translateY(0);' +
            ' transition:font-size .2s, padding .2s, opacity .2s, transform .1s ease, box-shadow .1s ease, filter .1s;}' +
            '.atlas-konu-hap:hover{filter:brightness(1.1)}' +
            '.atlas-konu-hap:active{transform:translateY(4px);' +
            ' box-shadow:0 0 0 rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.2)}' +
            '.atlas-konu-hap.u0{font-size:1.4rem; padding:12px 24px;}' +
            '.atlas-konu-hap.u1{font-size:.95rem; padding:7px 13px; opacity:.92}' +
            '.atlas-konu-hap.fiil{background:#16a34a}' +
            '.atlas-konu-hap.isim{background:#2563eb}' +
            '.atlas-konu-hap.aktif{opacity:1;' +
            ' box-shadow:0 4px 0 rgba(0,0,0,.25), inset 0 2px 0 rgba(255,255,255,.45), 0 7px 14px rgba(0,0,0,.2)}';
        document.head.appendChild(st);
    }
    var kap = document.getElementById('atlasSeritKap');
    var serit = document.getElementById('atlasKonuSerit');
    var ic = document.getElementById('atlasSeritIc');
    if (!kap) {
        kap = document.createElement('div');
        kap.id = 'atlasSeritKap';
        kap.innerHTML =
            '<button type="button" class="atlas-serit-ok sol" aria-label="Onceki basliklar">\u2039</button>' +
            '<div id="atlasKonuSerit"><div id="atlasSeritIc"></div></div>' +
            '<button type="button" class="atlas-serit-ok sag" aria-label="Sonraki basliklar">\u203A</button>';
        serit = kap.querySelector('#atlasKonuSerit');
        ic = kap.querySelector('#atlasSeritIc');
        var solOk = kap.querySelector('.atlas-serit-ok.sol');
        var sagOk = kap.querySelector('.atlas-serit-ok.sag');
        var kaydir = function (yon) {
            var adim = Math.max(160, serit.clientWidth * 0.6);
            try { serit.scrollBy({ left: yon * adim, behavior: 'smooth' }); }
            catch (e) { serit.scrollLeft += yon * adim; }
        };
        solOk.onclick = function () { kaydir(-1); };
        sagOk.onclick = function () { kaydir(1); };
        var oklariTazele = function () {
            var en = serit.scrollWidth - serit.clientWidth;
            if (en <= 4) { solOk.classList.add('pasif'); sagOk.classList.add('pasif'); return; }
            var x = serit.scrollLeft;              /* RTL: 0 (sag uc) .. -en (sol uc) */
            solOk.classList.toggle('pasif', x <= -en + 4);
            sagOk.classList.toggle('pasif', x >= -4);
        };
        serit.addEventListener('scroll', oklariTazele, { passive: true });
        window.addEventListener('resize', oklariTazele);
        kap._oklariTazele = oklariTazele;
    }
    /* SERIT HEP EN USTTE VE YAPISKAN: icerik dikey kayarken basliklar
       yerinde durur (Geylani: "basliklar scroll olmasin, sabit olsun"). */
    var sarici = document.querySelector('#screen-atlas > div:first-of-type');
    if (sarici && sarici.firstChild !== kap) sarici.insertBefore(kap, sarici.firstChild);
    /* CARPI + TAM EKRAN TUSU SERIDIN ICINE ALINIR (bkz. yukaridaki stil notu):
       baslikla ayni sirada, yan yana kardesler. Boylece hicbir konuda
       ustuste binemezler. Sira: [<][basliklar][>][tam ekran][carpi]. */
    var ustTus = [document.getElementById('atlas-fs-btn'),
                  document.querySelector('#screen-atlas button[onclick="closeMarathon()"]')];
    for (var ti = 0; ti < ustTus.length; ti++) {
        var tb = ustTus[ti];
        if (!tb) continue;
        tb.classList.add('atlas-ust-tus');
        if (tb.parentNode !== kap) kap.appendChild(tb);
    }
    var dizi = (window._atlasSiraMezid.indexOf(stage) >= 0) ? window._atlasSiraMezid : window._atlasSiraMucerred;
    var aktifIdx = dizi.indexOf(stage);
    var html = '';
    for (var i = 0; i < dizi.length; i++) {
        var k = dizi[i];
        var kok = k.replace('_mezid', '');
        var tur = (kok === 'mazi' || kok === 'muzari' || kok === 'emir') ? 'fiil' : 'isim';
        /* Karusel yok: yalniz ACIK baslik buyuk (u0), digerleri tek boy. */
        var uzak = (i === aktifIdx) ? 0 : 1;
        var tik = (k === stage)
            ? 'atlasBasliklaKapat()'
            : "atlasKonuyaGit('" + k + "')";
        var ipucu = (k === stage) ? ' title="Kapat — tabloya d\u00f6n"' : '';
        html += '<button type="button" class="atlas-konu-hap ' + tur + ' u' + uzak +
            (k === stage ? ' aktif' : '') + '"' + ipucu +
            ' onclick="' + tik + '">' + (window._atlasKonuAd[k] || k) + '</button>';
    }
    (ic || serit).innerHTML = html;
    if (kap && kap._oklariTazele) setTimeout(kap._oklariTazele, 60);
    /* CARPI DA AYNI KAPANIS MORFUNDAN gecsin: ozelligi degil yolu
       degistiriyoruz — closeMarathon yine cagrilir, once hap ucar. */
    var carpi = document.querySelector('#screen-atlas button[onclick="closeMarathon()"]');
    if (carpi) carpi.onclick = function (e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        window.atlasBasliklaKapat();
    };
    /* Tek satir kaydirilabilir oldugundan AKTIF hap gorunur kalmali:
       gorunum disindaysa yalniz YATAY kaydirilir (dikey oynatilmaz). */
    /* Aktif baslik ORTAYA alinir: basliklar sigmadiginda "ortali dursun"
       istegi ancak boyle karsilanir; sigdiginda zaten margin:auto ortalar. */
    var aktifGoster = function () {
        var a2 = serit.querySelector('.atlas-konu-hap.aktif');
        if (!a2) return;
        var sr = serit.getBoundingClientRect(), ar = a2.getBoundingClientRect();
        var fark = (ar.left + ar.width / 2) - (sr.left + sr.width / 2);
        if (Math.abs(fark) > 4) serit.scrollLeft += fark;
        if (kap && kap._oklariTazele) kap._oklariTazele();
    };
    aktifGoster();
    setTimeout(aktifGoster, 240);
};
/* ACIK BASLIGA IKINCI BASIS = KAPAT: acilistaki morfun AYNASI —
   aktif hap tablodaki basligina DONUSEREK ucar, ekran ardinda soner.
   (Geylani: "basliklar acik ve kapali halde ayni, degismemeli".)
   Carpi da ayni yoldan gecirilir (serit cizilirken baglanir). */
window.atlasBasliklaKapat = function () {
    var overlay = document.getElementById('marathon-overlay');
    /* Kapanis ucusunda da blur kapali (bkz. openAtlasOverlay notu) */
    clearTimeout(window._atlasUcusZaman);
    if (overlay) overlay.classList.add('atlas-ucus');
    var hap = document.querySelector('#atlasKonuSerit .atlas-konu-hap.aktif');
    var stage = window._atlasAcikStage;
    var hedef = null;
    if (stage) {
        var kap = (stage.indexOf('_mezid') >= 0) ? '#tab2' : '#tab1';
        hedef = document.querySelector(kap + " [onclick*=\"openGrammarOverlay('" + stage + "')\"]");
    }
    /* Tablo, sabit katmanin ALTINDA oldugu gibi duruyor: hedefin
       dikdortgeni kapanmadan once de olculebilir. */
    var r1 = hedef ? hedef.getBoundingClientRect() : null;
    var r0 = hap ? hap.getBoundingClientRect() : null;
    var klon = null;
    if (hap && r0 && r0.width && r1 && r1.width) {
        var cs = getComputedStyle(hap);
        klon = document.createElement('div');
        klon.textContent = hap.textContent;
        klon.style.cssText =
            'position:fixed; z-index:2147483647; display:flex; align-items:center; justify-content:center;' +
            ' left:' + r0.left + 'px; top:' + r0.top + 'px; width:' + r0.width + 'px; height:' + r0.height + 'px;' +
            ' background:' + cs.backgroundColor + '; color:#fff; font-weight:700; font-family:sans-serif;' +
            ' font-size:' + cs.fontSize + '; border-radius:' + cs.borderRadius + ';' +
            ' box-shadow:0 4px 0 rgba(0,0,0,.2), inset 0 2px 0 rgba(255,255,255,.4);' +
            ' pointer-events:none; transform-origin:0 0; white-space:nowrap;';
        document.body.appendChild(klon);
        hap.style.visibility = 'hidden';
    }
    /* Ekran yumusakca soner, hap ayni anda basligina dogru suzulur */
    if (overlay) {
        overlay.style.transition = 'opacity .32s ease';
        overlay.style.opacity = '0';
    }
    if (klon) {
        /* TEKDUZE OLCEK: hap, basligin dikdortgenine yayilarak degil,
           MERKEZINE dogru orantili kuculerek gider — yoksa yatayda
           esneyip harfler sisiyordu (Geylani'nin uyarisi). */
        klon.style.transformOrigin = '50% 50%';
        var oran = Math.max(0.5, Math.min(1.4, r1.height / r0.height));
        var dx = (r1.left + r1.width / 2) - (r0.left + r0.width / 2);
        var dy = (r1.top + r1.height / 2) - (r0.top + r0.height / 2);
        void klon.offsetHeight;
        klon.style.transition = 'transform .55s cubic-bezier(.22,1,.36,1), opacity .25s ease .34s';
        klon.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + oran + ')';
        klon.style.opacity = '0';
    }
    setTimeout(function () {
        if (typeof window.closeMarathon === 'function') window.closeMarathon();
        if (overlay) { overlay.style.transition = ''; overlay.style.opacity = ''; }
    }, 330);
    setTimeout(function () {
        if (klon) klon.remove();
        if (hap) hap.style.visibility = '';
    }, 640);
};
(function () {
    /* DIKKAT: dinleyiciler BELGE duzeyindedir. Atlas acikken dokunus/tekerlek
       olaylari marathon-overlay'in DISINDAKI ust katmanlara (or. verb-overlay)
       dusebiliyor; belge duzeyi hepsini yakalar. Tum yollar isAtlasMode +
       overlay .active kontrolluyle korunur — maraton oyununa karismaz. */
    function atlasAcikMi() {
        if (!window.isAtlasMode) return false;
        var o = document.getElementById('marathon-overlay');
        return !!(o && o.classList.contains('active'));
    }
    /* Icinde YATAY kayabilen bir kutu (or. genis cekim tablosu) varsa
       jest ona birakilir — baslik degistirilmez. */
    function yatayKayanIcinde(el) {
        while (el && el !== document.body && el.nodeType === 1) {
            if (el.scrollWidth - el.clientWidth > 8) {
                var ox = '';
                try { ox = getComputedStyle(el).overflowX; } catch (e) { }
                if (ox === 'auto' || ox === 'scroll') return true;
            }
            el = el.parentElement;
        }
        return false;
    }
    function atlasKaydirmaKur() {
        if (window._atlasKaydirmaKuruldu) return;
        window._atlasKaydirmaKuruldu = 1;

        /* DOKUNMATIK: sola kaydir = siradaki, saga = onceki */
        var dX = 0, dY = 0, dTut = false;
        document.addEventListener('touchstart', function (e) {
            if (!atlasAcikMi() || !e.touches || !e.touches.length) return;
            dX = e.touches[0].clientX; dY = e.touches[0].clientY; dTut = true;
        }, { passive: true });
        document.addEventListener('touchend', function (e) {
            if (!dTut || !atlasAcikMi() || !e.changedTouches || !e.changedTouches.length) return;
            dTut = false;
            var dx = e.changedTouches[0].clientX - dX;
            var dy = e.changedTouches[0].clientY - dY;
            if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.7) return;
            if (yatayKayanIcinde(e.target)) return;
            /* Dokunmatik mantigi: SIRADAKI sayfa SOLDA durur; parmaklar
               SOLDAN SAGA kayinca o sayfa cekilip gelir. */
            window.atlasKomsuAc(dx > 0 ? 1 : -1);
        }, { passive: true });

        /* KLAVYE: sag ok = siradaki, sol ok = onceki */
        document.addEventListener('keydown', function (e) {
            if (!atlasAcikMi()) return;
            /* RTL sayfa duzeni: SIRADAKI sayfa SOLDA -> SOL ok siradakine,
               SAG ok oncekine gider (animasyonla ayni yon). */
            if (e.key === 'ArrowLeft') { e.preventDefault(); window.atlasKomsuAc(1); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); window.atlasKomsuAc(-1); }
        });

        /* TRACKPAD (wheel) JESTI — Mac atalet (momentum) uyumlu:
           Tetikten sonra 450 ms SOGUMA: bu surede gelen tum olaylar yutulur
           (atalet kuyrugu ust uste tetiklemesin). Sogumadan sonra kucuk
           atalet kirintilari (|deltaX| < 8) sayilmaz; 300 ms aralik yeni
           jest sayilip birikim sifirlanir. Boylece pes pese kac kez
           kaydirirsan kaydir, her guclu jest TEK adim atar ve kilitlenmez. */
        var wBirikim = 0, wSonTetik = 0, wSonOlay = 0;
        document.addEventListener('wheel', function (e) {
            if (!atlasAcikMi()) return;
            if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.2) return;   /* dikey okuma */
            if (yatayKayanIcinde(e.target)) return;
            e.preventDefault();
            var simdi = Date.now();
            if (simdi - wSonOlay > 300) wBirikim = 0;      /* yeni jest basladi */
            wSonOlay = simdi;
            if (simdi - wSonTetik < 450) return;           /* soguma: atalet yutulur */
            if (Math.abs(e.deltaX) < 8) return;            /* atalet kirintisi sayilmaz */
            wBirikim += e.deltaX;
            if (Math.abs(wBirikim) >= 110) {
                wSonTetik = simdi;
                /* Dogal kaydirmada parmaklar SOLDAN SAGA gidince deltaX
                   NEGATIF gelir -> SIRADAKI (soldaki sayfa cekilir). */
                var yon = wBirikim < 0 ? 1 : -1;
                wBirikim = 0;
                window.atlasKomsuAc(yon);
            }
        }, { passive: false });

        /* FARE SURUKLEME: basili tutup 80px yatay cekmek de gecis yapar */
        var fX = 0, fY = 0, fTut = false;
        document.addEventListener('pointerdown', function (e) {
            if (!atlasAcikMi() || e.pointerType !== 'mouse') return;
            if (e.target && e.target.closest && e.target.closest('button, a, input, select, textarea')) return;
            fX = e.clientX; fY = e.clientY; fTut = true;
        });
        document.addEventListener('pointerup', function (e) {
            if (!fTut || !atlasAcikMi() || e.pointerType !== 'mouse') return;
            fTut = false;
            var dx = e.clientX - fX, dy = e.clientY - fY;
            if (Math.abs(dx) < 80 || Math.abs(dy) > Math.abs(dx) * 0.7) return;
            if (yatayKayanIcinde(e.target)) return;
            /* Saga surukleme = SIRADAKI (soldaki sayfa cekilir) */
            window.atlasKomsuAc(dx > 0 ? 1 : -1);
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', atlasKaydirmaKur);
    else atlasKaydirmaKur();
})();
/* ================= AYAR MENÜSÜ =================
   Üst çubuktaki dişli. BÜYÜTME ve ANLAM anahtarları buraya taşındı;
   üçüncü seçenek yeni: bir kök seçilince o kökte TANIMLI FİİLLERİN
   çekim tabloları kendiliğinden açılıp rıhtımda (yüzen simge) hazır
   bekliyor — öğretmen tek dokunuşla hepsini ekrana getiriyor. */
window.ayarMenuAc = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    var m = document.getElementById('ayar-menu');
    if (!m) return;
    var acik = m.classList.toggle('acik');
    if (acik && typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
};
/* Başlık satırındaki ✕ */
window.ayarMenuKapat = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    var m = document.getElementById('ayar-menu');
    if (!m || !m.classList.contains('acik')) return;
    m.classList.remove('acik');
    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClose) SoundEngine.playClose();
};
document.addEventListener('click', function (e) {
    var m = document.getElementById('ayar-menu');
    if (!m || !m.classList.contains('acik')) return;
    if (e.target.closest && (e.target.closest('#ayar-menu') || e.target.closest('#static-ayar-btn'))) return;
    m.classList.remove('acik');
}, true);
document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var m = document.getElementById('ayar-menu');
    if (m) m.classList.remove('acik');
});

/* AYAR BELLEĞİ — iki anahtar da ÖNTANIMLI KAPALI, açılırsa tarayıcı
   belleğinde kalıyor: bir tarayıcıda açıldıysa elle kapatılana kadar
   sonraki açılışlarda da açık geliyor (Geylani). Bellek okunamıyorsa
   (gizli sekme, engelli depolama) anahtar kapalı kabul ediliyor. */
(function () {
    function bellek(anahtar, oge, sonra, ontanimli) {
        var c = document.getElementById(oge);
        if (!c) return;
        /* ontanimli true ise "yalnız açıkça kapatıldıysa kapalı",
           değilse "yalnız açıkça açıldıysa açık". */
        try {
            var v = localStorage.getItem(anahtar);
            c.checked = ontanimli ? (v !== '0') : (v === '1');
        } catch (x) { c.checked = !!ontanimli; }
        c.addEventListener('change', function () {
            try { localStorage.setItem(anahtar, c.checked ? '1' : '0'); } catch (x) {}
            if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
            if (sonra) sonra(c.checked);
        });
    }
    function kur() {
        bellek('kidef_cekim_hazir', 'cekimHazirCheckbox', function (acik) {
            if (acik) window.fdmCekimHazirla();
        });
        /* Dilbilgisi başlıkları ÖNTANIMLI AÇIK: eski davranış buydu,
           ayara taşınırken varsayılan korunuyor (Geylani). */
        bellek('kidef_gramer_baslik', 'gramerBaslikCheckbox', null, true);
        bellek('kidef_gunun_koku', 'gununKokuCheckbox', function (acik) {
            /* Anahtar açılınca pencere hemen gelsin, kapanınca açıksa gitsin. */
            if (acik) { if (typeof showRootOfDay === 'function') showRootOfDay(); }
            else { var o = document.getElementById('rootOfDayOverlay'); if (o) o.remove(); }
        });
        bellek('kidef_ornek_liste', 'ornekListeCheckbox', function (acik) {
            /* Anahtar kapatılırken ekranda açık bir örnek listesi varsa
               kapatılıyor; yoksa kapalı ayarla açık liste bir arada kalıyor. */
            if (!acik && window.KalipListe && window.KalipOdak &&
                window.KalipOdak.aktif && window.KalipOdak.aktif()) window.KalipListe.kapat();
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();
})();

/* Örnek listesi açılabilir mi? kalipliste.js dokunuş dinleyicisinde
   buna bakıyor; ayar kapalıyken vezne dokunmak listeyi açmıyor. */
window.kidefOrnekListeAcik = function () {
    var c = document.getElementById('ornekListeCheckbox');
    return !!(c && c.checked);
};

/* Kökte tanımlı FİİL kalıplarını (mâzî · muzâri · emir) sırayla türetip
   çekim tablolarını tahtaya ekler, sonra tahtayı rıhtıma indirir.
   Sesler ve büyütme klonu bu toplu hazırlıkta susturuluyor — ekranda
   bir şey patlamasın, öğretmen kökü seçtiğinde sayfa sakin kalsın. */
/* ============ HAZIRLIK PERDESİ (yükleniyor ekranı) ============
   KÖKE DOKUNULDUĞU ANDA iniyor ve sayfayı kapatıyor: sarı vurgular,
   kahverengi kök levhası, çekim tabloları… hepsi perdenin arkasında
   hazırlanıyor. Perde kalktığında sistem hazır oluyor (Geylani: "bi
   köke tıkladığı anda yükleniyor yazısı çıksın; sarı vurgular, kök
   levhası göründüğünde tüm sistem hazır olmuş olmalı"). Üstünde dönen
   halka, kökün kendisi ve kaç tablonun kurulduğunu gösteren çizgi var;
   tıklamaları da yutuyor ki araya giren bir dokunuş sırayı bozmasın. */
function fdmYuklemeAc(kok, toplam, tur) {
    var y = document.getElementById('fdm-yukleniyor');
    if (!y) {
        y = document.createElement('div');
        y.id = 'fdm-yukleniyor';
        y.className = 'fdm-yukleniyor';
        y.setAttribute('role', 'status');
        y.setAttribute('aria-live', 'polite');
        y.innerHTML =
            '<div class="fdm-yuk-kart">' +
              '<div class="fdm-yuk-cark" aria-hidden="true"></div>' +
              '<div class="fdm-yuk-yazi">Fiil çekimleri hazırlanıyor…</div>' +
              '<div class="fdm-yuk-kok" dir="rtl"></div>' +
              '<div class="fdm-yuk-cizgi"><span></span></div>' +
            '</div>';
        document.body.appendChild(y);
        /* Perde ilk karede açılıyor: kök seçiminin getirdiği değişiklikler
           (vurgular, levha) perdenin ARDINDA olup bitsin. */
        void y.offsetWidth;
    }
    if (tur !== undefined && tur !== null) y.dataset.tur = String(tur);
    else if (!y.dataset.tur) y.dataset.tur = '';       /* daha sahiplenilmedi */
    var k = y.querySelector('.fdm-yuk-kok');
    if (k && kok) k.textContent = kok;
    fdmYuklemeIlerlet(0, toplam);
    clearTimeout(window._fdmYukSaat);
    y.classList.add('acik');
    return y;
}
function fdmYuklemeIlerlet(bitti, toplam) {
    var y = document.getElementById('fdm-yukleniyor');
    if (!y) return;
    /* Tablo sayısı daha bilinmiyorsa çizgi belirsiz kipte akıyor. */
    y.classList.toggle('belirsiz', !toplam);
    var c = y.querySelector('.fdm-yuk-cizgi span');
    if (!c) return;
    c.style.width = toplam ? (Math.round(100 * Math.min(1, bitti / toplam)) + '%') : '';
}
function fdmYuklemeKapat(tur, ani) {
    var y = document.getElementById('fdm-yukleniyor');
    if (!y) return;
    /* Yeni bir hazırlık perdeyi devraldıysa eski tur onu indirmez. */
    if (tur !== undefined && tur !== null && y.dataset.tur !== String(tur)) return;
    clearTimeout(window._fdmYukSaat);
    y.classList.remove('acik');
    /* `ani`: perde daha ekrana çizilmeden kaldırılıyor (hazırlık
       yapılmayacağı aynı iş adımında anlaşıldığında) — yoksa kısa bir
       beyaz parlama görünüyordu. */
    if (ani) { if (y.parentNode) y.parentNode.removeChild(y); return; }
    setTimeout(function () {
        if (y.parentNode && !y.classList.contains('acik')) y.parentNode.removeChild(y);
    }, 300);
}

/* Hazırlıkta tıklanan kutuyu tıklanmamış hâline döndürür. */
function fdmKutuGeriAl(b, yedek) {
    try { if (typeof resetBox === 'function') resetBox(b); } catch (x) { /* yoksay */ }
    try {
        var tr = b.querySelector('.inline-tr-text');
        if (tr) tr.remove();
        /* Emoji izleri: kutunun içindeki uçuşan emoji ve sayfaya
           bırakılmış kopyaları da siliniyor. */
        b.querySelectorAll('.elegant-emoji').forEach(function (x) { x.remove(); });
        var rf = b.querySelector('.ref');
        if (rf) {
            var rid = (rf.textContent || '').trim();
            document.querySelectorAll('.easter-egg-emoji[data-ref="' + rid + '"], ' +
                                      '.elegant-emoji[data-ref="' + rid + '"]')
                .forEach(function (x) { if (!b.contains(x)) x.remove(); });
        }
        b.removeAttribute('data-last-emoji');
        b.removeAttribute('data-last-root');
        b.className = yedek.sinif;
        if (yedek.stil === null) b.removeAttribute('style');
        else b.setAttribute('style', yedek.stil);
        if (yedek.tik === null) b.removeAttribute('data-tiklama-sayisi');
        else b.setAttribute('data-tiklama-sayisi', yedek.tik);
        if (yedek.ek === null) b.removeAttribute('data-active-suffix');
        else b.setAttribute('data-active-suffix', yedek.ek);
        b.removeAttribute('data-modal-closed');
    } catch (x) { /* yoksay */ }
}

/* Kökte tanımlı FİİL kutuları (mâzî · muzâri · emir). Hem hazırlığın
   kendisi hem de "hazırlık olacak mı?" sorusu buradan besleniyor —
   yükleniyor perdesi köke dokunulur dokunulmaz iniyor, o yüzden karar
   hazırlık başlamadan verilebilmeli. */
window.fdmHazirKutulari = function () {
    var anahtar = document.getElementById('cekimHazirCheckbox');
    if (!anahtar || !anahtar.checked) return [];
    var kok = (typeof currentRoot !== 'undefined') ? String(currentRoot || '').trim() : '';
    if (kok.length !== 3 || typeof sozlukVerileri === 'undefined' || !sozlukVerileri[kok]) return [];
    var kayit = sozlukVerileri[kok];
    var kutular = [];
    document.querySelectorAll('#tab1 .glass-box, #tab2 .glass-box').forEach(function (b) {
        var tip = b.getAttribute('data-type');
        if (tip !== 'mazi' && tip !== 'muzari' && tip !== 'emir') return;
        var r = b.querySelector('.ref');
        if (!r) return;
        var no = r.textContent.trim();
        if (!no || (!kayit[no] && !kayit[parseInt(no, 10)])) return;
        kutular.push(b);
    });
    return kutular;
};

window.fdmCekimHazirla = function () {
    var kok = (typeof currentRoot !== 'undefined') ? String(currentRoot || '').trim() : '';
    var kutular = window.fdmHazirKutulari();
    if (!kutular.length) { fdmYuklemeKapat(); return; }
    /* Önceki kökten kalan tablolar karışmasın: tahta sıfırdan kuruluyor
       (hazır tahta ✕ ile küçülüyor, burada gerçekten kapanmalı). */
    if (document.getElementById('fdm-tahta')) window.fdmTahtaKapat(null, true);

    var ses = (typeof SoundEngine !== 'undefined') ? SoundEngine : null;
    var yedek = {};
    if (ses) ['playClick', 'playClose', 'playReset', 'playPop'].forEach(function (ad) {
        if (typeof ses[ad] === 'function') { yedek[ad] = ses[ad]; ses[ad] = function () {}; }
    });
    /* EMOJİ DE PATLAMASIN. Kelime türeyince kutudan bir emoji fırlıyor
       (`elegant-emoji` + pop animasyonu); hazırlık kutulara tıkladığı
       için ekranda emojiler uçuşuyordu (Geylani: "emojiler çıkıyor hazır
       fiiller oluşturulurken"). Hazırlık boyunca emoji SESSİZ kipte
       üretiliyor — veri olarak duruyor ama görünmüyor. */
    var eskiEgg = window.checkWordEasterEgg;
    if (typeof eskiEgg === 'function') {
        window.checkWordEasterEgg = function (kutu, ek, sessiz, ilk) {
            return eskiEgg.call(this, kutu, ek, true, ilk);
        };
    }
    function sesiAc() {
        if (typeof eskiEgg === 'function') window.checkWordEasterEgg = eskiEgg;
        if (!ses) return;
        Object.keys(yedek).forEach(function (ad) { ses[ad] = yedek[ad]; });
    }

    /* TEK SEFERDE TEK HAZIRLIK: kök arka arkaya değişirse eski hazırlık
       yarıda kesiliyor. Kesilmezse iki kökün tabloları aynı tahtada
       karışıyordu (ölçüldü: كتب seçilince 78 · 94 · 95 gibi başka kökün
       kalıpları da açılıyordu). */
    var tur = (window._fdmHazirTur = (window._fdmHazirTur || 0) + 1);
    /* HAZIRLIK ARKA PLANDA: tahta perde arkasında kuruluyor, sayfanın
       sekmesi ve kaydırması bozulmuyor, kutular hazırlık biter bitmez
       eski hâline dönüyor. Sonunda küçük yüzen simge yumuşak bir sesle
       ve animasyonla beliriyor (Geylani). */
    var eskiSekme = (typeof currentTabActive !== 'undefined') ? currentTabActive : 0;
    var eskiKay = window.scrollY || 0;
    document.body.classList.add('fdm-hazirlik');
    fdmYuklemeAc(kok, kutular.length, tur);
    /* Kumanda hemen çekilsin: 700 ms'lik denetim turunu bekleseydi
       yükleniyor ekranının altında bir an görünüyordu (ölçüldü). */
    if (window.KidefVezinGezinti && window.KidefVezinGezinti.kumandaGuncelle) {
        try { window.KidefVezinGezinti.kumandaGuncelle(); } catch (x) { /* yoksay */ }
    }

    var i = 0;
    function bitir() {
        fdmYuklemeKapat(tur);
        if (typeof closeAllZoomedBoxes === 'function') closeAllZoomedBoxes();
        if (window.KidefVezinGezinti && window.KidefVezinGezinti.anlamGizle)
            window.KidefVezinGezinti.anlamGizle();
        sesiAc();
        /* setTab HER ZAMAN çağrılıyor (aynı sekme olsa bile): kalipliste
           bu çağrıyı sarmalayıp açık kalmış BÂB ODAĞINI da kapatıyor.
           Mezidde bir kutuya dokunmak odağı açıyordu, hazırlık bitince
           sayfa öteki sekmede bir bâb listesinde kalıyordu (ölçüldü). */
        if (typeof setTab === 'function') setTab(eskiSekme, true);
        setTimeout(function () { window.scrollTo({ top: eskiKay, behavior: 'auto' }); }, 280);
        document.body.classList.remove('fdm-hazirlik');
        /* Gezinti imleci başa alınıyor: hazırlıktan sonra ileri tuşuna
           ilk basışta kökün EN KÜÇÜK numaralı kalıbı gelsin. */
        if (window.KidefVezinGezinti && window.KidefVezinGezinti.sifirla) {
            try { window.KidefVezinGezinti.sifirla(); } catch (x) { /* yoksay */ }
            /* Perde sönerken kumanda hâlâ "perde açık" sayılıyor; perde
               gidince bir kez daha sorulup hemen beliriyor (yoksa 700
               ms'lik denetim turunu bekliyordu). */
            setTimeout(function () {
                try { window.KidefVezinGezinti.kumandaGuncelle(); } catch (x) { /* yoksay */ }
            }, 380);
        }
        var t = document.getElementById('fdm-tahta');
        if (!t) return;
        /* HAZIR TAHTA İŞARETİ: bu tablolar öğretmenin tek tek açtığı
           tablolar değil, kök seçilince kendiliğinden hazırlananlar.
           Tek tek ✕'leri yok; tahtanın ✕'i de kapatmıyor, küçültüyor. */
        t.dataset.hazir = '1';
        t.dataset.hazirKok = kok;      /* aynı kök için bir daha hazırlanmasın */
        t.querySelectorAll('.fdm-hucre').forEach(function (h) { h.dataset.hazir = '1'; });
        var kirmizi = t.querySelector('.fdm-kirmizi');
        if (kirmizi) {
            kirmizi.title = 'Küçült — hazır çekimler durmaya devam eder';
            kirmizi.setAttribute('aria-label', 'Küçült');
        }
        window.fdmTahtaYuzen(null, true);
        t.classList.remove('fdm-belir');
        void t.offsetWidth;                       /* animasyon yeniden başlasın */
        t.classList.add('fdm-belir');
        setTimeout(function () { t.classList.remove('fdm-belir'); }, 700);
        if (typeof SoundEngine !== 'undefined' && SoundEngine.playYumusak) SoundEngine.playYumusak();
    }
    function sonraki() {
        if (tur !== window._fdmHazirTur) {
            /* Yeni hazırlık perdeyi kendi adına açtı; eski tur perdeyi
               İNDİRMEZ — indirince yeni turun tabloları ekranda tek tek
               belirip duruyordu (ölçüldü: ikinci turda hazirlik=false,
               hücreler 1 → 5 → 8 görünür şekilde ekleniyordu). */
            sesiAc(); return;
        }
        if (i >= kutular.length) { bitir(); return; }
        fdmYuklemeIlerlet(i, kutular.length);
        var b = kutular[i++];
        /* KUTUNUN DOKUNULMAMIŞ HÂLİ: hazırlık kutuya tıklamak zorunda
           (tablo ancak öyle türüyor), ama iş bitince kutu tıklanmamış
           gibi durmalı — öğrenci kendisi tıklayıp keşfetsin (Geylani:
           "otomatik oluşunca vezinlere basılmış görünmemeli"). Bu yüzden
           kutunun sınıfları, satır içi stili ve sayaçları tıklamadan
           ÖNCE saklanıp sonra aynen geri yazılıyor; resetBox tek başına
           yetmiyordu (kok-turendi, current-active-red gibi yeşil/kırmızı
           işaretleri bırakıyordu). */
        var yedek = { sinif: b.className, stil: b.getAttribute('style'),
                      tik: b.getAttribute('data-tiklama-sayisi'),
                      ek: b.getAttribute('data-active-suffix') };
        for (var n = 0; n < 4 && !b.classList.contains('kok-turendi'); n++) {
            try { handleBoxClick(b); } catch (x) { break; }
        }
        if (b.classList.contains('kok-turendi')) {
            var r = b.querySelector('.ref');
            if (r) { try { r.click(); } catch (x) {} }
        }
        /* GERİ ALMA AYNI İŞ ADIMINDA: tarayıcı araya bir kare çizmeden
           kutu eski hâline dönüyor, yani vezin bir an için bile yeşile
           dönmüş görünmüyor (Geylani: "hiç tıklamak benzeri bir şey
           olmasın"). Tablo bu adımda kurulup tahtaya geçtiği için
           içeriği bundan etkilenmiyor. Gecikmeli ikinci geri alma,
           sonradan gelen izler (geç çalışan işleyiciler) içindir. */
        fdmKutuGeriAl(b, yedek);
        setTimeout(function () { fdmKutuGeriAl(b, yedek); }, 30);
        setTimeout(sonraki, 70);
    }
    setTimeout(sonraki, 60);
};

/* Kök seçilir seçilmez (hazır fiil ya da elle girilen kök) hazırlık.
   Yalnız ÖĞRETMEN bir kök seçtiğinde: sayfa ilk açılışlarda kendiliğinden
   فعل kökünü yüklüyor (fialLoadCount < 3), o tanıtım seçimi için rıhtım
   açılmıyor — sayfa açılır açılmaz köşede yüzen bir simge belirmesin,
   üstelik dokunulmadan ses de çalınamaz. İlk dokunuş/tuş/tıklamadan
   sonraki her kök seçimi hazırlığı başlatıyor. */
(function () {
    window._fdmEtkilesim = window._fdmEtkilesim || false;
    ['pointerdown', 'touchstart', 'keydown', 'mousedown'].forEach(function (o) {
        document.addEventListener(o, function () { window._fdmEtkilesim = true; },
                                  { capture: true, passive: true });
    });
    ['selectReadyVerb', 'confirmRoot'].forEach(function (ad) {
        if (typeof window[ad] !== 'function' || window[ad]._fdmHazir) return;
        var eski = window[ad];
        window[ad] = function () {
            /* PERDE KÖKE DOKUNULUR DOKUNULMAZ İNİYOR. Kök seçimi sarı
               vurguları ve kahverengi levhayı hemen çiziyor; öğretmen
               önce onları, sonra hazırlığı görüyordu. Artık ikisi de
               perdenin arkasında oluyor: perde kalktığında sistem hazır
               (Geylani: "bi köke tıkladığı anda yükleniyor yazısı
               çıksın; sarı vurgular, kök levhası göründüğünde tüm
               sistem hazır olmuş olmalı"). */
            var perde = window._fdmEtkilesim;
            if (perde) fdmYuklemeAc('', 0, null);
            var s = eski.apply(this, arguments);
            if (perde) {
                var k = (typeof currentRoot !== 'undefined') ? String(currentRoot || '').trim() : '';
                /* AYNI KÖK İÇİN İKİNCİ KEZ HAZIRLIK YOK. Hızlı Liste
                   açılırken kökü onaylamak için confirmRoot'u iki kez
                   çağırıyor; bu da çekimleri baştan hazırlatıyordu
                   (Geylani: "hızlı listeye basınca fiiller bi daha
                   hazırlanıyor"). Tahtada o kökün hazır tabloları
                   duruyorsa hiçbir şey yapılmıyor. */
                var tv = document.getElementById('fdm-tahta');
                if (tv && tv.dataset.hazir === '1' && tv.dataset.hazirKok === k &&
                    tv.querySelector('.fdm-hucre')) {
                    fdmYuklemeKapat(null, true);
                    return s;
                }
                var olacak = window.fdmHazirKutulari().length > 0;
                if (olacak) {
                    fdmYuklemeAc(k, 0, null);
                    setTimeout(function () { window.fdmCekimHazirla(); }, 700);
                    /* Emniyet: hazırlık bir yerde takılırsa perde inatla
                       kalmasın. */
                    setTimeout(function () {
                        var y = document.getElementById('fdm-yukleniyor');
                        if (y && !y.dataset.tur) fdmYuklemeKapat();
                    }, 6000);
                } else {
                    fdmYuklemeKapat();       /* hazırlanacak fiil yok */
                }
            }
            return s;
        };
        window[ad]._fdmHazir = 1;
    });
})();
