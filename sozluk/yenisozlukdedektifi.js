// ============================================================================
// SÖZLÜK DEDEKTİFİ (YENİ) - VERİ: veri_kokler.js | ÇEKİM: SARF MOTORU
// Fiil verileri wordEasterEggs (veri_kokler.js) üzerinden okunur;
// mazi/muzari/emir tabloları sarf motoru ile anlık üretilir.
// ============================================================================

// ============================================================================
// SARF MOTORU (kaliplartablosu.js'den alınmıştır - VerbGenerator + SarfEngine)
// ============================================================================
function applyRootToKalip(root, kalip, extraOptions) {
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
    if (extraOptions) Object.assign(options, extraOptions); // (OYUN YAMASI)

    // (OYUN YAMASI) Hareke-şedde sırasını normalle
    result = result.replace(/([ً-ِْ])(ّ)/g, "$2$1");

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

// ============================================================================
// SON TEMİZLİK (Motor çıktısı normalizasyonu)
// ============================================================================
function sarfTemizle(w) {
    if (!w) return w;
    let res = w.replace(/([ً-ِْ])(ّ)/g, "$2$1");      // hareke-şedde sırası (كَِّ -> كِّ)
    res = res.replace(/([ً-ْ])\1+/g, "$1");             // yinelenen aynı hareke (دَعََا -> دَعَا)
    res = res.replace(/(?<![ِ])أَا/g, "آ");   // kesreden sonra medde olmaz: يُبْدِئَانِ                      // medde birleşimi (أَا -> آ)
    res = res.replace(/ُوْ/g, "ُو");                     // uzun u'daki gereksiz sükun (يَدْعُوْنَ)
    res = res.replace(/ِيْ/g, "ِي");                     // uzun i'deki gereksiz sükun (يَرْمِيْنَ)
    return res;
}

// --- REF ID HARİTALARI (veri_vezin_numaralari.js / KALIP_DATA numaraları) ---
const MAZI_REF  = {1:1, 2:1, 3:1, 4:8, 5:11, 6:14, 7:52, 8:58, 9:64, 10:71, 11:77, 12:83, 13:88, 14:94, 15:100};
const MUZ_REF   = {1:2, 2:4, 3:6, 4:9, 5:12, 6:15, 7:53, 8:59, 9:65, 10:72, 11:78, 12:84, 13:89, 14:95, 15:101};
const EMIR_REF  = {1:3, 2:5, 3:7, 4:10, 5:13, 6:16, 7:54, 8:60, 9:66, 10:73, 11:79, 12:85, 13:90, 14:96, 15:102};
const MUZARI_MUC_BAB = {2:1, 4:2, 6:3, 9:4, 12:5, 15:6};

// --- TAM SİGA ÇEKİM LİSTESİ (Sarf Motoru üzerinden) ---
function cekimListesi(kok, babNo, tip) {
    const anaVezin = babVezinleri[babNo][tip];
    const refId = (tip === 'mazi' ? MAZI_REF : tip === 'muzari' ? MUZ_REF : EMIR_REF)[babNo];
    let list = VerbGenerator.generateVerbList(kok, babNo, tip, anaVezin, refId) || [];
    list = list.slice(0, tip === 'emir' ? 6 : 14).map(sarfTemizle);

    // Nakıs müennes müfred emir düzeltmesi (اِنْسَ -> اِنْسَيْ)
    if (tip === 'emir') {
        const r3 = kok[2];
        if ((r3 === 'و' || r3 === 'ي') && list[3] && /َ$/.test(list[3])) list[3] += 'يْ';
    }

    // Mehmuz (bağımsız hemzeli ء kökler) kürsü düzeltmeleri: أَبْرَءَ -> أَبْرَأَ
    if (kok.includes('ء')) {
        list = list.map(w => w
            .replace(/َءُ/g, "َؤُ")
            .replace(/َء/g, "َأ")
            .replace(/ءِ/g, "ئِ"));
    }
    return list;
}

// ============================================================================
// FİİL LİSTESİ (VERİ KAYNAĞI: veri_kokler.js -> wordEasterEggs)
// ============================================================================
function fiilListesiKur() {
    const verbs = [];
    Object.keys(wordEasterEggs).forEach(kok => {
        if (kok.length !== 3) return;
        const ids = Object.keys(wordEasterEggs[kok]).map(Number);

        // 1) Mücerred (3 harfli) fiil: bab tespiti öncelikle muzari numarasından
        let mucBab = null;
        for (const id of [2, 4, 6, 9, 12, 15]) {
            if (ids.includes(id)) { mucBab = MUZARI_MUC_BAB[id]; break; }
        }
        if (!mucBab) {
            if (ids.includes(8)) mucBab = 4;
            else if (ids.includes(11)) mucBab = 5;
            else if (ids.includes(14)) mucBab = 6;
            else if (ids.includes(5)) mucBab = 2;
            else if (ids.includes(7)) mucBab = 3;
            else if (ids.includes(1) || ids.includes(3)) mucBab = 1;
        }
        if (mucBab) verbs.push({ kok: kok, babNo: mucBab });

        // 2) Mezid fiiller (3+ harfli): fiil numaraları (mazi/muzari/emir üçlüleri)
        const babsSeen = new Set();
        ids.forEach(id => {
            let b = null;
            if (id >= 52 && id <= 54) b = 7;
            else if (id >= 58 && id <= 60) b = 8;
            else if (id >= 64 && id <= 66) b = 9;
            else if (id >= 71 && id <= 73) b = 10;
            else if (id >= 77 && id <= 79) b = 11;
            else if (id >= 83 && id <= 85) b = 12;
            else if (id >= 88 && id <= 90) b = 13;
            else if (id >= 94 && id <= 96) b = 14;
            else if (id >= 100 && id <= 102) b = 15;
            if (b && !babsSeen.has(b)) { babsSeen.add(b); verbs.push({ kok: kok, babNo: b }); }
        });
    });

    // Sözlük halleri (mazi 3. tekil = oyunun cevabı) + mazi emojisi
    verbs.forEach(v => {
        v.dict = cekimListesi(v.kok, v.babNo, 'mazi')[0];
        v.emoji = fiilEmojisi(v.kok, v.babNo);
    });
    return verbs;
}

// Fiilin emojisi: önce mazi numarasına, yoksa aynı bâbın muzari/emir numarasına bakılır
function fiilEmojisi(kok, babNo) {
    const egg = wordEasterEggs[kok] || {};
    const idAdaylari = [MAZI_REF[babNo], MUZ_REF[babNo], EMIR_REF[babNo]];
    for (const id of idAdaylari) {
        const e = egg[id];
        if (e) {
            const em = (e.base && e.base.emoji) || e.emoji;
            if (em) return em;
        }
    }
    return "";
}

let VERBS = [];
let ROOT_DICTS = {};       // kok -> o kökün tüm bâblarının sözlük halleri

function veriTabaniniKur() {
    VERBS = fiilListesiKur();
    ROOT_DICTS = {};
    VERBS.forEach(v => {
        if (!ROOT_DICTS[v.kok]) ROOT_DICTS[v.kok] = [];
        ROOT_DICTS[v.kok].push(v.dict);
    });
}

// --- YARDIMCI: Gerçek karıştırma (Fisher-Yates) ---
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// --- SENARYOLAR ---
function generateScenarios() {
    // Hem 3 harfli (mücerred) hem 3+ harfli (mezid) fiiller karışık sırada
    return shuffleArray(VERBS);
}

let scenarios = [];
let currentIdx = 0;

// Fiilin tam tablolarını (tembel) üret ve önbellekle
function fiilTablolariniKur(v) {
    if (v.tables) return;
    const mazi = cekimListesi(v.kok, v.babNo, 'mazi');
    const muzari = cekimListesi(v.kok, v.babNo, 'muzari');
    const emir = cekimListesi(v.kok, v.babNo, 'emir');
    v.forms = { mazi: mazi, muzari: muzari, emir: emir };
    v.allForms = [...mazi, ...muzari, ...emir];
    v.tables = {
        mazi: [
            mazi.slice(0, 3), mazi.slice(3, 6), mazi.slice(6, 9), mazi.slice(9, 12),
            [mazi[12], mazi[13], mazi[13]]
        ],
        muzari: [
            muzari.slice(0, 3), muzari.slice(3, 6), muzari.slice(6, 9), muzari.slice(9, 12),
            [muzari[12], muzari[13], muzari[13]]
        ],
        emir: [
            emir.slice(0, 3), emir.slice(3, 6)
        ]
    };
}

// --- ŞIKLAR ---
// KURAL: Şıklarda BAŞKA KÖKTEN FİİL OLMAZ! (Mücerred ve mezid fark etmez.)
// Havuz: aynı kökün diğer bâblarının sözlük halleri + aynı fiilin çekimleri.
function buildOptions(v, target) {
    const options = new Set();
    options.add(v.dict); // Doğru cevap: fiilin sözlük hâli
    const conj = shuffleArray(v.allForms.filter(w => w !== v.dict && w !== target));

    // Aynı kökün diğer bâblarının sözlük halleri (en fazla 2 tanesini garantile)
    const sameRootDicts = shuffleArray((ROOT_DICTS[v.kok] || []).filter(d => d !== v.dict));
    sameRootDicts.slice(0, 2).forEach(d => options.add(d));

    // Kalanı karışık havuzdan doldur (yine hep aynı kök)
    const pool = shuffleArray([...sameRootDicts.slice(2), ...conj]);
    for (const w of pool) { if (options.size >= 5) break; options.add(w); }

    // Güvence: hâlâ 5 şık yoksa aynı fiilin çekimleriyle doldur
    for (const w of conj) { if (options.size >= 5) break; options.add(w); }
    return shuffleArray(Array.from(options));
}

// ============================================================================
// ŞIK ANALİZ SATIRI (Bâb adı + fiil özellikleri) ve İLERİ/GERİ
// ============================================================================
const BAB_ADLARI = {
    7: "İf'âl", 8: "Tef'îl", 9: "Mufâ'ale", 10: "İnfi'âl", 11: "İfti'âl",
    12: "İf'ilâl", 13: "Tefe''ul", 14: "Tefâ'ul", 15: "İstif'âl"
};

function fiilOzellikleri(kok) {
    const props = [];
    if (kok.split("").some(h => h === 'و' || h === 'ي' || h === 'ا')) props.push("İlletli");
    if (kok.split("").some(h => ['أ', 'ء', 'إ', 'ؤ', 'ئ', 'آ'].includes(h))) props.push("Hemzeli");
    if (kok[1] === kok[2]) props.push("Şeddeli");
    return props;
}

function showAnalysis(selected, isCorrect) {
    // Bilgiler HER ZAMAN doğru cevabın (sorulan fiilin) bilgileridir:
    // yanlış şıkta ipucu olur, doğru şıkta doğrulama olur.
    const v = scenarios[currentIdx];
    const correctIsMuc = (v.babNo <= 6);

    // Tıklanan şık hangi sınıfta? (aynı kökün bir sözlük hâli mi, çekim mi?)
    const dictVerb = VERBS.find(x => x.kok === v.kok && x.dict === selected);
    const clickedIsMuc = dictVerb ? (dictVerb.babNo <= 6) : correctIsMuc;
    const clickedIsBareMazi = dictVerb ? true : (selected === v.dict);

    // 3 / 3+ rozeti: SADECE harf sınıfı uyuşmazlığında ipucu olarak çıkar
    // (cevap 3 harfli iken 4-6 harfliye tıklanırsa "3", tersinde "3+")
    document.getElementById('analysis-harf').innerText =
        (clickedIsMuc !== correctIsMuc) ? (correctIsMuc ? "3" : "3+") : "";

    // "Mazi yalın" rozeti: muzari/emir veya çekimli bir mazi şıkkına tıklanırsa çıkar
    // (doğru cevap her zaman fiilin yalın mazi hâlidir)
    document.getElementById('analysis-mazi').innerText = clickedIsBareMazi ? "" : "Mazi yalın";

    // Bâb rozeti: SADECE tıklanan kelimenin bâbı cevabın bâbından farklıysa ipucu olarak çıkar
    // (cevabın kendi çekimlerine tıklanınca bâb zaten doğrudur -> ipucu gösterilmez)
    const clickedBabNo = dictVerb ? dictVerb.babNo : v.babNo;
    const babEl = document.getElementById('analysis-bab');
    babEl.innerText = (clickedBabNo !== v.babNo) ? (BAB_ADLARI[v.babNo] || "") : "";
    babEl.dataset.bab = v.babNo;

    // Özellik rozetleri de benzer şekilde: tıklanan kelimede o özellik zaten
    // görünüyorsa ipucu çıkmaz; kelimede görünmüyorsa cevabın özelliği ipucu olur.
    const props = fiilOzellikleri(v.kok).filter(p => {
        if (p === "İlletli") return !/[اويى]/.test(selected);
        if (p === "Hemzeli") return !/[أءإؤئآ]/.test(selected);
        if (p === "Şeddeli") return !selected.includes('ّ');
        return true;
    });
    document.getElementById('analysis-props').innerHTML = props
        .map(p => `<span class="an-chip">${p}</span>`).join("");

    // Hatalı şıkta tüm rozetler kırmızı dolgulu olur
    document.getElementById('analysis-bar').classList.toggle('wrong', !isCorrect);
}

function clearAnalysis() {
    document.getElementById('analysis-harf').innerText = "";
    document.getElementById('analysis-mazi').innerText = "";
    document.getElementById('analysis-bab').innerText = "";
    document.getElementById('analysis-props').innerHTML = "";
    document.getElementById('analysis-bar').classList.remove('wrong');
}

// ============================================================================
// RENK MOTORU (kaliplartablosu.js'den - kök siyah, zâid harfler kırmızı)
// ============================================================================
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

// ============================================================================
// BÂB DETAY SÜTUNU (kaliplartablosu'ndaki bâb başlığı tasarımı - info hariç)
// ============================================================================
const BAB_ZAID = {
    7:  { harf: "أَ ـ ـ ـ",        num: 4 },
    8:  { harf: "ـ ـّ ـ",          num: 4 },
    9:  { harf: "ـ ـا ـ ـ",        num: 4 },
    10: { harf: "اِنْـ ـ ـ ـ",     num: 5 },
    11: { harf: "اِ ـ ـتَـ ـ ـ",   num: 5 },
    12: { harf: "اِ ـ ـ ـّ",       num: 5 },
    13: { harf: "تَـ ـ ـّ ـ",      num: 5 },
    14: { harf: "تَـ ـ ـا ـ ـ",    num: 5 },
    15: { harf: "اِسْتَـ ـ ـ ـ",   num: 6 }
};

function openBabSheet(babNo) {
    const z = BAB_ZAID[babNo];
    if (!z) return;
    document.getElementById('bab-sheet-title').innerText = BAB_ADLARI[babNo] || "";
    document.getElementById('bab-sheet-harf').innerText = z.harf;
    document.getElementById('bab-sheet-num').innerText = z.num;

    const bv = babVezinleri[babNo];
    const renkli = w => ColorEngine.colorize(w, ['ف', 'ع', 'ل']); // zâid harfler kırmızı
    document.getElementById('bab-sheet-kaliplar').innerHTML = `
        <div class="bs-row"><span class="bs-label">Mazi</span><span class="bs-ar" dir="rtl">${renkli(bv.mazi)}</span></div>
        <div class="bs-row"><span class="bs-label">Muzari</span><span class="bs-ar" dir="rtl">${renkli(bv.muzari)}</span></div>
        <div class="bs-row"><span class="bs-label">Emir</span><span class="bs-ar" dir="rtl">${renkli(bv.emir)}</span></div>`;

    document.getElementById('bab-sheet-overlay').classList.add('open');
    document.getElementById('bab-sheet').classList.add('open');
}

function closeBabSheet() {
    document.getElementById('bab-sheet-overlay').classList.remove('open');
    document.getElementById('bab-sheet').classList.remove('open');
}

function nextScenario() {
    currentIdx = (currentIdx + 1) % scenarios.length;
    loadScenario();
}

function prevScenario() {
    currentIdx = (currentIdx - 1 + scenarios.length) % scenarios.length;
    loadScenario();
}

// --- TABLO HTML OLUŞTURUCU ---
// (Hücreler kaliplartablosu'ndaki renk motoruna bağlı: kök siyah, zâid harfler kırmızı)
function generateTableHTML(dataRows, type, targetWord, kokArr) {
    let html = `<table class="verb-table">
        <tr>
            <th>Müfred</th>
            <th>Tesniye</th>
            <th>Cemi</th>
        </tr>`;

    dataRows.forEach((row, rowIndex) => {
        html += "<tr>";
        row.forEach((word, colIndex) => {
            let cellClass = "";

            // Buzlu Hücre: SADECE Mazi tablosunun ilk hücresi (Sözlük Hâli / Cevap)
            if (type === 'mazi' && rowIndex === 0 && colIndex === 0) {
                cellClass = "frozen-cell";
            }

            // Vurgulu Hücre: Aranan (Sorulan) kelime
            if (word === targetWord) {
                cellClass += " highlight-cell";
            }

            const gorunen = (typeof ColorEngine !== 'undefined' && kokArr)
                ? ColorEngine.colorize(word, kokArr)
                : word;

            if (cellClass.includes("frozen-cell")) {
                html += `<td class="${cellClass}" data-clicks="0" onclick="crackIce(this)">${gorunen}</td>`;
            } else {
                html += `<td class="${cellClass}">${gorunen}</td>`;
            }
        });
        html += "</tr>";
    });
    html += "</table>";
    return html;
}

// --- OYUN YÖNETİMİ ---
function loadScenario() {
    if (scenarios.length === 0) scenarios = generateScenarios();

    const v = scenarios[currentIdx];
    fiilTablolariniKur(v);
    clearAnalysis();

    // 1. Soru Kelimesi (sözlük hâli dışındaki çekimlerden rastgele)
    // (Soru ve şıklar senaryoya bir kez sabitlenir; geri dönünce aynı soru görünür)
    if (!v.target) {
        const possibleTargets = v.allForms.filter(w => w !== v.dict);
        v.target = possibleTargets.length > 0
            ? possibleTargets[Math.floor(Math.random() * possibleTargets.length)]
            : v.dict;
        v.opts = buildOptions(v, v.target);
    }
    const target = v.target;

    document.getElementById('target-word-display').innerHTML =
        (v.emoji ? `<span class="target-emoji">${v.emoji}</span>` : "") + target;

    // 2. Şıklar
    const optsArea = document.getElementById('options-area');
    optsArea.innerHTML = "";
    v.opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'det-opt-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, v.dict, btn);
        optsArea.appendChild(btn);
    });

    // 3. Tablolar (kök harfleri siyah, zâid harfler kırmızı)
    const kokArr = v.kok.split("");
    document.getElementById('table-mazi-area').innerHTML = generateTableHTML(v.tables.mazi, 'mazi', target, kokArr);
    document.getElementById('table-muzari-area').innerHTML = generateTableHTML(v.tables.muzari, 'muzari', target, kokArr);
    document.getElementById('table-emir-area').innerHTML = generateTableHTML(v.tables.emir, 'emir', target, kokArr);

    // 4. İpucu Dosyasını Aç (Vurgulu kelime hangi tablodaysa onu aç)
    closeAllPanels();
    let foundType = null;
    if (checkIfWordInTable(v.tables.mazi, target)) foundType = 'mazi';
    else if (checkIfWordInTable(v.tables.muzari, target)) foundType = 'muzari';
    else if (checkIfWordInTable(v.tables.emir, target)) foundType = 'emir';
    if (foundType) toggleTable(foundType);
}

function checkIfWordInTable(tableData, word) {
    return tableData.some(row => row.includes(word));
}

// --- ARAYÜZ ---
function toggleTable(type) {
    const content = document.getElementById(`content-${type}`);
    const btn = document.getElementById(`btn-${type}`);
    const isOpen = content.classList.contains('open');

    closeAllPanels();

    if (!isOpen) {
        content.classList.add('open');
        btn.classList.add('active');
    }
}

function closeAllPanels() {
    document.querySelectorAll('.accordion-content').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.accordion-btn').forEach(el => el.classList.remove('active'));
}

function crackIce(element) {
    let clicks = parseInt(element.getAttribute('data-clicks') || 0);
    clicks++;
    if (clicks === 1) element.classList.add('crack-1');
    else if (clicks === 2) element.classList.add('crack-2');
    element.setAttribute('data-clicks', clicks);
}

function checkAnswer(selected, correct, btnElement) {
    showAnalysis(selected, selected === correct);
    if (selected === correct) {
        // Doğru cevaptan sonra hiçbir şıkka tıklanamaz
        document.querySelectorAll('.det-opt-btn').forEach(b => b.disabled = true);
        btnElement.style.background = "#20C997";
        btnElement.style.color = "white";
        btnElement.style.borderColor = "#16A085";
        setTimeout(() => {
            currentIdx++;
            if (currentIdx < scenarios.length) loadScenario();
            else {
                alert("Harika! Tüm kökleri buldun. Oyun yeniden başlıyor.");
                currentIdx = 0;
                scenarios = generateScenarios();
                loadScenario();
            }
        }, 2500);
    } else {
        btnElement.style.background = "#EE5253";
        btnElement.style.color = "white";
        btnElement.style.borderColor = "#C4302B";
        btnElement.disabled = true;
    }
}

window.onload = function() {
    veriTabaniniKur();
    loadScenario();

    // Bâb rozetine tıklanınca detay sütunu açılır (popup)
    document.getElementById('analysis-bab').onclick = function() {
        const b = parseInt(this.dataset.bab || "0");
        if (this.innerText && BAB_ZAID[b]) openBabSheet(b);
    };
};
