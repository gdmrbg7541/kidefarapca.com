/* ===== Renklendirme motoru (kaliplartablosu.html'den) — kök harfleri siyah,
   eklenen (mezîd) harfleri kırmızı yapar. ===== */
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



const vezinData = {
    "İf'al": {
        labels: ["أَفْعَلَ", "يُفْعِلُ", "أَفْعِلْ", "إِفْعَال", "مُفْعِل", "مُفْعَل"],
        roots: [
            { word: 'كرم', mean: ['İkram etti', 'İkram ediyor', 'İkram et', 'İkram', 'İkram eden', 'İkram edilen'], derived: ["أَكْرَمَ", "يُكْرِمُ", "أَكْرِمْ", "إِكْرَامٌ", "مُكْرِمٌ", "مُكْرَمٌ"] },
            { word: 'حسن', mean: ['Güzelleştirdi', 'Güzelleştiriyor', 'Güzelleştir', 'İhsan', 'Muhsin', 'İhsan edilen'], derived: ["أَحْسَنَ", "يُحْسِنُ", "أَحْسِنْ", "إِحْسَانٌ", "مُحْسِنٌ", "مُحْسَنٌ"] },
            { word: 'علن', mean: ['İlan etti', 'İlan ediyor', 'İlan et', 'İlan', 'İlan eden', 'İlan edilen'], derived: ["أَعْلَنَ", "يُعْلِنُ", "أَعْلِنْ", "إِعْلَانٌ", "مُعْلِنٌ", "مُعْلَنٌ"] }
        ],
        patterns: [
            r => `<span class="zaid-drop">أَ</span>${r[0]}ْ${r[1]}َ${r[2]}َ`,
            r => `<span class="zaid-drop">يُ</span>${r[0]}ْ${r[1]}ِ${r[2]}ُ`,
            r => `<span class="zaid-drop">أَ</span>${r[0]}ْ${r[1]}ِ${r[2]}ْ`,
            r => `<span class="zaid-drop">إِ</span>${r[0]}ْ${r[1]}<span class="zaid-drop">َا</span>${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُ</span>${r[0]}ْ${r[1]}ِ${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُ</span>${r[0]}ْ${r[1]}َ${r[2]}ٌ`
        ]
    },
    "Tef'îl": {
        labels: ["فَعَّلَ", "يُفَعِّلُ", "فَعِّلْ", "تَفْعِيل", "مُفَعِّل", "مُفَعَّل"],
        roots: [
            { word: 'علم', mean: ['Öğretti', 'Öğretiyor', 'Öğret', 'Eğitim', 'Öğretmen', 'Öğretilen'], derived: ["عَلَّمَ", "يُعَلِّمُ", "عَلِّمْ", "تَعْلِيمٌ", "مُعَلِّمٌ", "مُعَلَّمٌ"] },
            { word: 'ذكر', mean: ['Hatırlattı', 'Hatırlatıyor', 'Hatırlat', 'Zikir', 'Hatırlatan', 'Hatırlatılan'], derived: ["ذَكَّرَ", "يُذَكِّرُ", "ذَكِّرْ", "تَذْكِيرٌ", "مُذَكِّرٌ", "مُذَكَّرٌ"] },
            { word: 'قدم', mean: ['Takdim etti', 'Sunuyor', 'Sun', 'Takdim', 'Sunan', 'Sunulan'], derived: ["قَدَّمَ", "يُقَدِّمُ", "قَدِّمْ", "تَقْدِيمٌ", "مُقَدِّمٌ", "مُقَدَّمٌ"] }
        ],
        patterns: [
            r => `${r[0]}َ${r[1]}<span class="zaid-drop">ّ</span>َ${r[2]}َ`,
            r => `<span class="zaid-drop">يُ</span>${r[0]}َ${r[1]}<span class="zaid-drop">ّ</span>ِ${r[2]}ُ`,
            r => `${r[0]}َ${r[1]}<span class="zaid-drop">ّ</span>ِ${r[2]}ْ`,
            r => `<span class="zaid-drop">تَ</span>${r[0]}ْ${r[1]}<span class="zaid-drop">ِي</span>${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُ</span>${r[0]}َ${r[1]}<span class="zaid-drop">ّ</span>ِ${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُ</span>${r[0]}َ${r[1]}<span class="zaid-drop">ّ</span>َ${r[2]}ٌ`
        ]
    },
    "Müfâale": {
        labels: ["فَاعَلَ", "يُفَاعِلُ", "فَاعِلْ", "مُفَاعَلَة", "مُفَاعِل", "مُفَاعَل"],
        roots: [
            { word: 'كتب', mean: ['Yazıştı', 'Yazışıyor', 'Yazış', 'Yazışma', 'Yazışan', 'Yazışılan'], derived: ["كَاتَبَ", "يُكَاتِبُ", "كَاتِبْ", "مُكَاتَبَةٌ", "مُكَاتِبٌ", "مُكَاتَبٌ"] },
            { word: 'قتل', mean: ['Savaştı', 'Savaşıyor', 'Savaş', 'Savaşmak', 'Savaşan', '-'], derived: ["قَاتَلَ", "يُقَاتِلُ", "قَاتِلْ", "مُقَاتَلَةٌ", "مُقَاتِلٌ", "مُقَاتَلٌ"] },
            { word: 'شرك', mean: ['Paylaştı', 'Paylaşıyor', 'Paylaş', 'Ortaklık', 'Ortak', '-'], derived: ["شَارَكَ", "يُشَارِكُ", "شَارِكْ", "مُشَارَكَةٌ", "مُشَارِكٌ", "مُشَارَكٌ"] }
        ],
        patterns: [
            r => `${r[0]}<span class="zaid-drop">ا</span>${r[1]}َ${r[2]}َ`,
            r => `<span class="zaid-drop">يُ</span>${r[0]}<span class="zaid-drop">ا</span>${r[1]}ِ${r[2]}ُ`,
            r => `${r[0]}<span class="zaid-drop">ا</span>${r[1]}ِ${r[2]}ْ`,
            r => `<span class="zaid-drop">مُ</span>${r[0]}<span class="zaid-drop">ا</span>${r[1]}َ${r[2]}<span class="zaid-drop">َة</span>`,
            r => `<span class="zaid-drop">مُ</span>${r[0]}<span class="zaid-drop">ا</span>${r[1]}ِ${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُ</span>${r[0]}<span class="zaid-drop">ا</span>${r[1]}َ${r[2]}ٌ`
        ]
    },
    "İnfiâl": {
        labels: ["اِنْفَعَلَ", "يَنْفَعِلُ", "اِنْفَعِلْ", "اِنْفِعَال", "مُنْفَعِل", "مُنْفَعَل"],
        roots: [
            { word: 'كسر', mean: ['Kırıldı', 'Kırılıyor', 'Kırıl', 'İnkisar', 'Münkesir', '-'], derived: ["اِنْكَسَرَ", "يَنْكَسِرُ", "اِنْكَسِرْ", "اِنْكِسَارٌ", "مُنْكَسِرٌ", "مُنْكَسَرٌ"] },
            { word: 'قلب', mean: ['Ters döndü', 'Dönüyor', 'Dön', 'İnkilap', 'Münkalib', '-'], derived: ["اِنْقَلَبَ", "يَنْقَلِبُ", "اِنْقَلِبْ", "اِنْقِلَابٌ", "مُنْقَلِبٌ", "مُنْقَلَبٌ"] },
            { word: 'قطع', mean: ['Kesildi', 'Kesiliyor', 'Kesil', 'İnkita', 'Münkati', '-'], derived: ["اِنْقَطَعَ", "يَنْقَطِعُ", "اِنْقَطِعْ", "اِنْقِطَاعٌ", "مُنْقَطِعٌ", "مُنْقَطَعٌ"] }
        ],
        patterns: [
            r => `<span class="zaid-drop">اِنْ</span>${r[0]}َ${r[1]}َ${r[2]}َ`,
            r => `<span class="zaid-drop">يَنْ</span>${r[0]}َ${r[1]}ِ${r[2]}ُ`,
            r => `<span class="zaid-drop">اِنْ</span>${r[0]}َ${r[1]}ِ${r[2]}ْ`,
            r => `<span class="zaid-drop">اِنْ</span>${r[0]}ِ${r[1]}<span class="zaid-drop">ا</span>${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُنْ</span>${r[0]}َ${r[1]}ِ${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُنْ</span>${r[0]}َ${r[1]}َ${r[2]}ٌ`
        ]
    },
    "İftiâl": {
        labels: ["اِفْتَعَلَ", "يَفْتَعِلُ", "اِفْتَعِلْ", "اِفْتِعَال", "مُفْتَعِل", "مُفْتَعَل"],
        roots: [
            { word: 'جمع', mean: ['Toplandı', 'Toplanıyor', 'Toplan', 'İçtima', 'Müçtemi', '-'], derived: ["اِجْتَمَعَ", "يَجْتَمِعُ", "اِجْتَمِعْ", "اِجْتِمَاعٌ", "مُجْتَمِعٌ", "مُجْتَمَعٌ"] },
            { word: 'نشر', mean: ['Yayıldı', 'Yayılıyor', 'Yayıl', 'İntişar', 'Münteşir', '-'], derived: ["اِنْتَشَرَ", "يَنْتَشِرُ", "اِنْتَشِرْ", "اِنْتِشَارٌ", "مُنْتَشِرٌ", "مُنْتَشَرٌ"] },
            { word: 'نظر', mean: ['Bekledi', 'Bekliyor', 'Bekle', 'İntizar', 'Müntezir', 'Müntezar'], derived: ["اِنْتَظَرَ", "يَنْتَظِرُ", "اِنْتَظِرْ", "اِنْتِظَارٌ", "مُنْتَظِرٌ", "مُنْتَظَرٌ"] }
        ],
        patterns: [
            r => `<span class="zaid-drop">اِ</span>${r[0]}<span class="zaid-drop">ْتَ</span>${r[1]}َ${r[2]}َ`,
            r => `<span class="zaid-drop">يَ</span>${r[0]}<span class="zaid-drop">ْتَ</span>${r[1]}ِ${r[2]}ُ`,
            r => `<span class="zaid-drop">اِ</span>${r[0]}<span class="zaid-drop">ْتَ</span>${r[1]}ِ${r[2]}ْ`,
            r => `<span class="zaid-drop">اِ</span>${r[0]}<span class="zaid-drop">ْتِ</span><span class="zaid-drop">ا</span>${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُ</span>${r[0]}<span class="zaid-drop">ْتَ</span>${r[1]}ِ${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُ</span>${r[0]}<span class="zaid-drop">ْتَ</span>${r[1]}َ${r[2]}ٌ`
        ]
    },
    "İf'ilâl": {
        labels: ["اِفْعَلَّ", "يَفْعَلُّ", "اِفْعَلِّلْ", "اِفْعِلَال", "مُفْعَلّ", "مُفْعَلّ"],
        roots: [
            { word: 'حمر', mean: ['Kızardı', 'Kızarıyor', 'Kızar', 'İhmirar', 'Muhmerr', '-'], derived: ["اِحْمَرَّ", "يَحْمَرُّ", "اِحْمَرِّلْ", "اِحْمِرَارٌ", "مُحْمَرٌّ", "مُحْمَرٌّ"] },
            { word: 'صفر', mean: ['Sarardı', 'Sararıyor', 'Sarar', 'İsfirar', 'Musferr', '-'], derived: ["اِصْفَرَّ", "يَصْفَرُّ", "اِصْفَرِّلْ", "اِصْفِرَارٌ", "مُصْفَرٌّ", "مُصْفَرٌّ"] },
            { word: 'بيض', mean: ['Beyazladı', 'Beyazlıyor', 'Beyazla', 'İbyizaz', 'Mubyezz', '-'], derived: ["اِبْيَضَّ", "يَبْيَضُّ", "اِب_يَضِّلْ", "اِبْيِضَاضٌ", "مُبْيَضٌّ", "مُب_يَضٌّ"] }
        ],
        patterns: [
            r => `<span class="zaid-drop">اِ</span>${r[0]}ْ${r[1]}َ${r[2]}<span class="zaid-drop">َّ</span>`,
            r => `<span class="zaid-drop">يَ</span>${r[0]}ْ${r[1]}َ${r[2]}<span class="zaid-drop">ُّ</span>`,
            r => `<span class="zaid-drop">اِ</span>${r[0]}ْ${r[1]}َ${r[2]}<span class="zaid-drop">ِّلْ</span>`,
            r => `<span class="zaid-drop">اِ</span>${r[0]}ْ${r[1]}ِ<span class="zaid-drop">ا</span>${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُ</span>${r[0]}ْ${r[1]}َ${r[2]}<span class="zaid-drop">ٌّ</span>`,
            r => `<span class="zaid-drop">مُ</span>${r[0]}ْ${r[1]}َ${r[2]}<span class="zaid-drop">ٌّ</span>`
        ]
    },
    "Tefe'ul": {
        labels: ["تَفَعَّلَ", "يَتَفَعَّلُ", "تَفَعَّلْ", "تَفَعُّل", "مُتَفَعِّل", "مُتَفَعَّل"],
        roots: [
            { word: 'علم', mean: ['Öğrendi', 'Öğreniyor', 'Öğren', 'Taallüm', 'Müteallim', '-'], derived: ["تَعَلَّمَ", "يَتَعَلَّمُ", "تَعَلَّمْ", "تَعَلُّمٌ", "مُتَعَلِّمٌ", "مُتَعَلَّمٌ"] },
            { word: 'ذكر', mean: ['Düşündü', 'Düşünüyor', 'Düşün', 'Tezekkür', 'Mütezekkir', '-'], derived: ["تَذَكَّرَ", "يَتَذَكَّرُ", "تَذَكَّرْ", "تَذَكُّرٌ", "مُتَذَكِّرٌ", "مُتَذَكَّرٌ"] },
            { word: 'كلم', mean: ['Konuştu', 'Konuşuyor', 'Konuş', 'Tekellüm', 'Mütekellim', '-'], derived: ["تَكَلَّمَ", "يَتَكَلَّمُ", "تَكَلَّمْ", "تَكَلُّمٌ", "مُتَكَلِّمٌ", "مُتَكَلَّمٌ"] }
        ],
        patterns: [
            r => `<span class="zaid-drop">تَ</span>${r[0]}َ${r[1]}<span class="zaid-drop">ّ</span>َ${r[2]}َ`,
            r => `<span class="zaid-drop">يَتَ</span>${r[0]}َ${r[1]}<span class="zaid-drop">ّ</span>َ${r[2]}ُ`,
            r => `<span class="zaid-drop">تَ</span>${r[0]}َ${r[1]}<span class="zaid-drop">ّ</span>َ${r[2]}ْ`,
            r => `<span class="zaid-drop">تَ</span>${r[0]}َ${r[1]}<span class="zaid-drop">ّ</span>ُ${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُتَ</span>${r[0]}َ${r[1]}<span class="zaid-drop">ّ</span>ِ${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُتَ</span>${r[0]}َ${r[1]}<span class="zaid-drop">ّ</span>َ${r[2]}ٌ`
        ]
    },
    "Tefâul": {
        labels: ["تَفَاعَلَ", "يَتَفَاعَلُ", "تَفَاعَلْ", "تَفَاعُل", "مُتَفَاعِل", "مُتَفَاعَل"],
        roots: [
            { word: 'نصر', mean: ['Yardımlaştı', 'Yardımlaşıyor', 'Yardımlaş', 'Tenâsur', 'Mütenasir', '-'], derived: ["تَنَاصَرَ", "يَتَنَاصَرُ", "تَنَاصَرْ", "تَنَاصُرٌ", "مُتَنَاصِرٌ", "مُتَنَاصَرٌ"] },
            { word: 'كتب', mean: ['Yazıştılar', 'Yazışıyorlar', 'Yazışın', 'Tekatüb', 'Mütekatib', '-'], derived: ["تَكَاتَبَ", "يَتَكَاتَبُ", "تَكَاتَبْ", "تَكَاتُبٌ", "مُتَكَاتِبٌ", "مُتَكَاتَبٌ"] },
            { word: 'باعد', mean: ['Uzaklaştı', 'Uzaklaşıyor', 'Uzaklaş', 'Tebaüd', 'Mütebaid', '-'], derived: ["تَبَاعَدَ", "يَتَبَاعَدُ", "تَبَاعَدْ", "تَبَاعُدٌ", "مُتَبَاعِدٌ", "مُتَبَاعَدٌ"] }
        ],
        patterns: [
            r => `<span class="zaid-drop">تَ</span>${r[0]}<span class="zaid-drop">ا</span>${r[1]}َ${r[2]}َ`,
            r => `<span class="zaid-drop">يَتَ</span>${r[0]}<span class="zaid-drop">ا</span>${r[1]}َ${r[2]}ُ`,
            r => `<span class="zaid-drop">تَ</span>${r[0]}<span class="zaid-drop">ا</span>${r[1]}َ${r[2]}ْ`,
            r => `<span class="zaid-drop">تَ</span>${r[0]}<span class="zaid-drop">ا</span>${r[1]}ُ${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُتَ</span>${r[0]}<span class="zaid-drop">ا</span>${r[1]}ِ${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُتَ</span>${r[0]}<span class="zaid-drop">ا</span>${r[1]}َ${r[2]}ٌ`
        ]
    },
    "İstif'âl": {
        labels: ["اِسْتَفْعَلَ", "يَسْتَفْعِلُ", "اِسْتَفْعِلْ", "اِسْتِفْعَال", "مُسْتَفْعِل", "مُسْتَفْعَل"],
        roots: [
            { word: 'غفر', mean: ['Af diledi', 'Af diliyor', 'Af dile', 'İstiğfar', 'Müstağfir', '-'], derived: ["اِسْتَغْفَرَ", "يَسْتَغْفِرُ", "اِسْتَغْفِرْ", "اِسْتِغْفَارٌ", "مُسْتَغْفِرٌ", "مُسْتَغْفَرٌ"] },
            { word: 'خرج', mean: ['Çıkardı', 'Çıkarıyor', 'Çıkar', 'İstihraç', 'Müstahriç', 'Müstahraç'], derived: ["اِسْتَخْرَجَ", "يَسْتَخْرِجُ", "اِسْتَخْرِجْ", "اِسْتِخْرَاجٌ", "مُسْتَخْرِجٌ", "مُسْتَخْرَجٌ"] },
            { word: 'خدم', mean: ['Çalıştırdı', 'Çalıştırıyor', 'Çalıştır', 'İstihdam', 'Müstahdim', 'Müstahdam'], derived: ["اِسْتَخْدَمَ", "يَسْتَخْدِمُ", "اِسْتَخْدِمْ", "اِسْتِخْدَامٌ", "مُسْتَخْدِمٌ", "مُسْتَخْدَمٌ"] }
        ],
        patterns: [
            r => `<span class="zaid-drop">اِسْتَ</span>${r[0]}ْ${r[1]}َ${r[2]}َ`,
            r => `<span class="zaid-drop">يَسْتَ</span>${r[0]}ْ${r[1]}ِ${r[2]}ُ`,
            r => `<span class="zaid-drop">اِسْتَ</span>${r[0]}ْ${r[1]}ِ${r[2]}ْ`,
            r => `<span class="zaid-drop">اِسْتِ</span>${r[0]}ْ${r[1]}<span class="zaid-drop">ا</span>${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُسْتَ</span>${r[0]}ْ${r[1]}ِ${r[2]}ٌ`,
            r => `<span class="zaid-drop">مُسْتَ</span>${r[0]}ْ${r[1]}َ${r[2]}ٌ`
        ]
    }
};

    let activeVezin = "İf'al";
    let rowStates = [0, 0, 0];// Dinamik olması için obje yaptık


    function buildGrid() {
    const grid = document.getElementById('mainGrid');
    const data = vezinData[activeVezin];
    grid.innerHTML = "";
    rowStates = [0, 0, 0];

    // 1. Başlıkları Oluştur
    const headers = ["Kökler", "Mazi", "Muzari", "Emir", "Mastar", "İsmi Fail", "İsmi Meful"];
   headers.forEach((h, i) => {
    const headerCell = document.createElement('div');
    headerCell.className = "cell header-sub";
    
    // Yazı içeriği aynı; kalıp şablonunu renklendirme motoruyla boyuyoruz
    // (ف ع ل kökü siyah, eklenen mezîd harfleri kırmızı)
    const labelHtml = (i > 0 && typeof ColorEngine !== 'undefined')
        ? ColorEngine.colorize(data.labels[i-1], ['ف','ع','ل'])
        : (i > 0 ? data.labels[i-1] : "");
    const sub = i > 0 ? `<div class="pattern-label">${labelHtml}</div>` : "";
    
    // 'h' (Mazi vb.) yazısını bir span içine alarak satır yüksekliğini kontrol ediyoruz
    headerCell.innerHTML = `<span style="line-height:1; display:block;">${h}</span>${sub}`;
    
    grid.appendChild(headerCell);
});

    // 2. Satırları Oluştur
    data.roots.forEach((root, rIdx) => {
        // Kök Hücresi (Event listener kaybolmaması için createElement ile yapıyoruz)
        const rCell = document.createElement('div');
        rCell.className = 'cell root-word';
        rCell.innerText = root.word;
        
        // ÖNEMLİ: e.target yerine e.currentTarget kullanmak daha sağlıklıdır
        rCell.onclick = (e) => startAnim(rIdx, root, e.currentTarget);
        grid.appendChild(rCell);

        // Boş Hedef Hücreleri
        for (let i = 0; i < 6; i++) {
            const cell = document.createElement('div');
            cell.className = "cell";
            cell.id = `cell-${rIdx}-${i}`; // startAnim bu ID'yi arar
            // Anlam popup'ı başlangıçta boş ve gizli
            cell.innerHTML = `<div class="meaning-popup"></div>`; 
            grid.appendChild(cell);
        }
    });

    
}
    function startAnim(row, rootObj, sourceElem) {
    let col = rowStates[row];
    if (col >= 6) return;

    const target = document.getElementById(`cell-${row}-${col}`);
    if (target.dataset.animating === "true") return;
    target.dataset.animating = "true";

    // 1. Kök Kelime Uçuşu (Mavi Kök)
    const flyingRoot = document.createElement('div');
    flyingRoot.className = 'flying-text';
    flyingRoot.innerText = rootObj.word;
    
   // ... startAnim içindeki ilgili kısım ...
const sRect = sourceElem.getBoundingClientRect();
const tRect = target.getBoundingClientRect();

Object.assign(flyingRoot.style, {
    left: sRect.left + 'px',
    top: sRect.top + 'px',
    width: sRect.width + 'px',
    height: sRect.height + 'px',
    position: 'fixed',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent', // Arkaplanı temizledik
    pointerEvents: 'none'
});
    document.body.appendChild(flyingRoot);

    setTimeout(() => {
        flyingRoot.style.left = tRect.left + 'px';
        flyingRoot.style.top = tRect.top + 'px';
    }, 50);

    // 2. Kök Varınca Zaid Harfleri Uçur
    setTimeout(() => {
        if(flyingRoot.parentNode) document.body.removeChild(flyingRoot);
        
        const patternFn = vezinData[activeVezin].patterns[col];
        target.innerHTML = `
            <div class="temp-layer">${patternFn(rootObj.word)}</div>
            <div class="meaning-popup">${rootObj.mean[col]}</div>
        `;

        // Zaid harfleri yukarıdan SIRAYLA yaylanarak süzülür (canlı görsel şov)
        const zaidElements = target.querySelectorAll('.zaid-drop');
        zaidElements.forEach((zaid, zi) => {
            zaid.style.transform = 'translateY(-55px) scale(1.35)';
            zaid.style.opacity = '0';
            setTimeout(() => {
                zaid.style.transition = 'transform .55s cubic-bezier(.34,1.6,.5,1), opacity .35s ease-out';
                zaid.style.transform = 'translateY(0) scale(1)';
                zaid.style.opacity = '1';
            }, 90 + zi * 90);
        });

        // 3. ASIL ÇÖZÜM: Harfler birleşsin (İllüzyon)
        // 3. Harfler Varınca: Bitişik Kelimeyi ve Türkçe Anlamı Göster
        setTimeout(() => {
            // Veriden o vezne, o satıra ve o sütuna ait TAM BİTİŞİK KELİMEYİ çekiyoruz
            const fullWord = vezinData[activeVezin].roots[row].derived[col];
            const turkishMean = rootObj.mean[col]; // Türkçe anlamı buradan alıyoruz

            // Renklendirme motoru: kök harfleri siyah, eklenen (mezîd) harfleri kırmızı
            const rootChars = (rootObj.word || '').replace(/[^ء-ي]/g, '').split('');
            const coloredWord = (typeof ColorEngine !== 'undefined')
                ? ColorEngine.colorize(fullWord, rootChars)
                : fullWord;

            target.innerHTML = `
                <div style="display:flex; justify-content:center; align-items:center; width:100%; height:100%;">
                    <div class="final-word">${coloredWord}</div>
                </div>
                <div class="meaning-popup" style="display: block; opacity: 1; transform: translateY(0);">
                    ${turkishMean}
                </div>`;

            target.classList.add('word-complete');
            delete target.dataset.animating; // Animasyon kilidi açıldı
        }, 900);

        rowStates[row]++;
    }, 1500);
}


// PDF verilerine dayalı kullanım bilgileri
const usageInfo = {
    "İf'al": `
        <p>• <b>Geçişlilik:</b> Lazım (geçişsiz) fiilleri Müteaddi (geçişli) yapar. 
            <br>Örn: <span class="arabic-sample">ضَحِكَ</span> (Güldü) → <span class="arabic-sample">أَضْحَكَ</span> (Güldürdü)</p>
        
        <p>• <b>Zaman ve Mekan:</b> Eylemin zamanla veya mekanla anlam kurmasını sağlar.
            <br>Örn: <span class="arabic-sample">أَصْبَحَ</span> (Sabaha girdi), <span class="arabic-sample">أَعْرَقَ</span> (Irak'a vardı)</p>
        
        <p>• <b>Durum Bildirme:</b> Bir sıfata veya duruma girmeyi belirtir.
            <br>Örn: <span class="arabic-sample">أَفْقَرَ</span> (Fakirleşti), <span class="arabic-sample">أَغْنَى</span> (Zenginleşti)</p>
        
        <p>• <span style="color:var(--accent); font-weight:bold;">Not:</span> İf'al hemzesi 'kati' hemzedir; her zaman yazılır ve okunur.
            <br>Örn: <span class="arabic-sample">قُلْتُ أَكْرِمْ!</span> (İkram et dedim!)</p>
    `,
    "Tef'îl": `
        <p>• <b>Geçişlilik:</b> Geçişsiz fiilleri geçişli yapar. <br>Örn: <span class="arabic-sample">عَلِمَ</span> (Bildi) → <span class="arabic-sample">عَلَّمَ</span> (Öğretti)</p>
        <p>• <b>Yoğunluk:</b> Aşırılık ve kuvvet bildirir. <br>Örn: <span class="arabic-sample">مَزَقَ</span> (Yırttı) → <span class="arabic-sample">مَزَّقَ</span> (Parçaladı)</p>
        <p>• <b>Türetme:</b> İsimlerden fiil yapar. <br>Örn: <span class="arabic-sample">خَيْمَةٌ</span> (Çadır) → <span class="arabic-sample">خَيَّمَ</span> (Kamp kurdu)</p>
    `, // [cite: 144, 147, 149]
    "Müfâale": `
        <p>• <b>Müşareket:</b> İşteşlik (karşılıklılık) bildirir. <br>Örn: <span class="arabic-sample">كَتَبَ</span> (Yazdı) → <span class="arabic-sample">كـاتَبَ</span> (Yazıştı)</p>
        <p>• <b>Kararlılık:</b> Israr ve davranış biçimi anlatır. <br>Örn: <span class="arabic-sample">طَلَبَ</span> (İstedi) → <span class="arabic-sample">طَالَبَ</span> (Talep etti)</p>
        <p>• <b>Mübalağa:</b> Aşırılık belirtir. <br>Örn: <span class="arabic-sample">ضَعُفَ</span> (Zayıfladı) → <span class="arabic-sample">ضَاعَفَ</span> (Katladı)</p>
    `, // [cite: 155, 158, 161]
    "İnfiâl": `
        <p>• <b>Edilgenlik:</b> Fiili edilgen (yapıldı) hale getirir. <br>Örn: <span class="arabic-sample">كَسَـرَ</span> (Kırdı) → <span class="arabic-sample">اِنْكَسَـرَ</span> (Kırıldı)</p>
        <p>• <b>Dönüşlülük:</b> Eylemin etkisi özneye döner. <br>Örn: <span class="arabic-sample">قَلَبَ</span> (Döndürdü) → <span class="arabic-sample">اِنْقَلَبَ</span> (Ters döndü)</p>
    `, // [cite: 170, 171]
    "İftiâl": `
        <p>• <b>Dönüşlülük:</b> Eylemin sonucunu belirtir. <br>Örn: <span class="arabic-sample">اِجْتَمَعَ</span> (Toplandı), <span class="arabic-sample">اِرْتَفَعَ</span> (Yükseldi)</p>
        <p>• <b>Gayret:</b> Çaba ve edinme manası katar. <br>Örn: <span class="arabic-sample">اِجْتَهَدَ</span> (Çalıştı), <span class="arabic-sample">اِكْتَسَبَ</span> (Kazandı)</p>
        <p>• <b>İşteşlik:</b> Ortaklık bildirir. <br>Örn: <span class="arabic-sample">اِخْتَصَمَ</span> (Tartıştı)</p>
    `, // [cite: 178, 179, 181]
    "İf'ilâl": `
        <p>• <b>Renkler:</b> Renk bildiren fiillerde kullanılır. <br>Örn: <span class="arabic-sample">اِحْمَرَّ</span> (Kızardı), <span class="arabic-sample">اِصْفَرَّ</span> (Sarardı)</p>
        <p>• <b>Kusurlar:</b> Sakatlık ve noksanlık belirtir. <br>Örn: <span class="arabic-sample">اِعْرَجَّ</span> (Topalladı)</p>
    `, // [cite: 194, 196]
    "Tefe'ul": `
        <p>• <b>Çaba:</b> Gayret ve sahiplenme bildirir. <br>Örn: <span class="arabic-sample">تَصَبَّـرَ</span> (Sabretti), <span class="arabic-sample">تَوَسَّدَ</span> (Yastık edindi)</p>
        <p>• <b>Dönüşlülük:</b> Tef'îl vezninin dönüşlü halidir. <br>Örn: <span class="arabic-sample">تَفَرَّقَ</span> (Dağıldı), <span class="arabic-sample">تَكَسَّـرَ</span> (Parçalandı)</p>
        <p>• <b>Kademelilik:</b> İşin aşama aşama yapıldığını belirtir. <br>Örn: <span class="arabic-sample">تَنَـzَّلَ</span> (İndi)</p>
    `, // [cite: 203, 206, 208, 209]
    "Tefâul": `
        <p>• <b>İşteşlik:</b> Ortaklık belirtir. <br>Örn: <span class="arabic-sample">تَعَاوَنَ</span> (Yardımlaştı), <span class="arabic-sample">تَمَازَحَ</span> (Şakalaştı)</p>
        <p>• <b>Yapmacıklık:</b> Olmayan bir şeyi olmuş gibi gösterir. <br>Örn: <span class="arabic-sample">تَمَارِضَ</span> (Hasta numarası yaptı)</p>
        <p>• <b>Peşpeşelik:</b> İşin ardarda gerçekleştiğini bildirir. <br>Örn: <span class="arabic-sample">تَسَاقَطَ</span> (Döküldü)</p>
    `, // [cite: 216, 220, 222, 223]
    "İstif'âl": `
        <p>• <b>İstek:</b> Talep ve bulmak manası verir. <br>Örn: <span class="arabic-sample">اِسْتَغْفَرَ</span> (Af diledi), <span class="arabic-sample">اِسْتَسْهَلَ</span> (Kolay buldu)</p>
        <p>• <b>Değişim:</b> Durum değişikliği veya vakit bildirir. <br>Örn: <span class="arabic-sample">اِسْتَحْجَرَ</span> (Taşlaştı), <span class="arabic-sample">اِسْتَحْصَدَ</span> (Hasat vakti geldi)</p>
        <p>• <b>Geçişlilik:</b> Lazım fiili müteaddi yapar. <br>Örn: <span class="arabic-sample">اِسْتَخْرَجَ</span> (Çıkardı)</p>
    ` // [cite: 229, 230, 231, 232, 234]
};

// 1. Bilgi Panelini Açan Fonksiyon (Eksiksiz Hali)
function showUsageInfo(vName) {
    let overlay = document.getElementById('usageOverlay');
    if(!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'usageOverlay';
        overlay.className = 'info-overlay';
        overlay.onclick = (e) => { if(e.target === overlay) overlay.style.display = 'none'; };
        document.body.appendChild(overlay);
    }
    
    overlay.innerHTML = `
        <div class="info-content">
            <button class="close-info" onclick="document.getElementById('usageOverlay').style.display='none'">X</button>
            <div class="info-text">
                <h2>${vName} Bâbı Kullanımı</h2>
                <p>${usageInfo[vName] || "Bu vezin için kullanım bilgisi eklenmemiş."}</p>
            </div>
        </div>
    `;
    overlay.style.display = 'flex';
}

function init() {
    const sel = document.getElementById('selector');
    if (!sel) return;
    sel.innerHTML = ""; 
    
    Object.keys(vezinData).forEach(v => {
        const btn = document.createElement('button');
        // Aktif olan butona 'active' sınıfını ekle
        btn.className = `vezin-btn ${v === activeVezin ? 'active' : ''}`;
        
        if (v === activeVezin) {
            btn.innerHTML = `${v} <span class="info-icon">ⓘ</span>`;
        } else {
            btn.innerText = v;
        }

        btn.onclick = () => { 
            if (activeVezin === v) {
                // Zaten aktifse hem bilgiyi aç hem de kırmızı kalmaya devam et
                showUsageInfo(v); 
            } else {
                // Yeni bir vezne geçiliyorsa
                activeVezin = v; 
                buildGrid(); 
                init(); // Menüyü yeniden çiz ki yeni buton kırmızı olsun
            }
        };
        sel.appendChild(btn);
    });
    buildGrid();
}

init();