// Emoji System
    
    let currentMode = 'kok';

    function switchMode(mode) {
        currentMode = mode;
        if (mode === 'kok') {
            document.querySelector('.form-row').style.display = 'flex';
            document.getElementById('btn-mode-kok').style.background = 'var(--primary)';
            document.getElementById('btn-mode-kok').style.color = 'white';
            document.getElementById('btn-mode-kok').style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
            
            document.getElementById('btn-mode-isim').style.background = '#e2e8f0';
            document.getElementById('btn-mode-isim').style.color = '#475569';
            document.getElementById('btn-mode-isim').style.boxShadow = 'none';
            
            document.getElementById('kok-mode-controls').style.display = 'flex';
            document.getElementById('kok-container').style.display = 'block';
            document.getElementById('isim-container').style.display = 'none';
        } else {
            document.querySelector('.form-row').style.display = 'none';
            document.getElementById('btn-mode-isim').style.background = '#8e44ad';
            document.getElementById('btn-mode-isim').style.color = 'white';
            document.getElementById('btn-mode-isim').style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
            
            document.getElementById('btn-mode-kok').style.background = '#e2e8f0';
            document.getElementById('btn-mode-kok').style.color = '#475569';
            document.getElementById('btn-mode-kok').style.boxShadow = 'none';
            
            document.getElementById('kok-mode-controls').style.display = 'none';
            document.getElementById('kok-container').style.display = 'none';
            document.getElementById('isim-container').style.display = 'block';
        }
    }

    // Dynamic Form System

    let kalipInstances = {}; // To store active kalips

    function isVerbKalip(id) {
        const num = parseInt(id);
        if (isNaN(num)) return false;
        if (num >= 1 && num <= 16) return true;
        if (num >= 52 && num <= 54) return true;
        if (num >= 58 && num <= 60) return true;
        if (num >= 64 && num <= 66) return true;
        if (num >= 71 && num <= 73) return true;
        if (num >= 77 && num <= 79) return true;
        if (num >= 83 && num <= 85) return true;
        if (num >= 88 && num <= 90) return true;
        if (num >= 94 && num <= 96) return true;
        if (num >= 100 && num <= 102) return true;
        return false;
    }

    function addKalip(customId = null) {
        let id;
        let data;
        
        {
            let idVal = customId || document.getElementById('kalip-id-input').value.trim();
            if (idVal === '?' || idVal.startsWith('?')) {
                id = idVal;
                data = { ar: "Joker", tr: "Ekstra Kalıp" };
            } else {
                id = parseInt(idVal);
                if (!id || !KALIP_DATA[id]) {
                    alert("Lütfen 1 ile 105 arası geçerli bir kalıp numarası girin veya joker için ? yazın.");
                    return;
                }
                data = KALIP_DATA[id];
            }
        }
        
        let safeId = id.toString().replace(/[^a-zA-Z0-9_-]/g, 'joker');
        
        if (document.getElementById(`kalip-card-${safeId}`)) {
            alert("Bu kalıp zaten ekli!");
            return;
        }
        const container = document.getElementById('kalip-container');
        
        const card = document.createElement('div');
        card.className = 'kalip-card';
        card.id = `kalip-card-${safeId}`;
        card.dataset.id = id;
        card.dataset.safeid = safeId;
        
        card.innerHTML = `
            <div class="kalip-header">
                <div class="kalip-title">${id} Numaralı Kalıp <span style="color:#666;">(${data.tr})</span><span class="kalip-ar-title">${data.ar}</span></div>
                <button class="delete-btn" onclick="document.getElementById('kalip-card-${safeId}').remove()">X</button>
            </div>
            
            <div class="entry-grid" id="base-grid-${safeId}">
                <div style="flex:2"><label>Arapça Kelime</label><input type="text" class="ar-input kalip-ar" placeholder="${data.ar}"></div>
                <div style="flex:3"><label>Türkçe Çeviri</label><input type="text" class="tr-input kalip-tr" placeholder="Anlamını yazın..."></div>
                <div style="flex:0.5"><label>Emoji</label><input type="text" class="em-input kalip-em emoji-input" placeholder="Emoji Seç" onclick="openEmojiPicker(this)" readonly style="cursor:pointer; text-align:center; font-size:1.5rem;"></div>
            </div>
            
            ${isVerbKalip(id) ? '' : `
            <div style="display:flex; flex-direction:column; gap:5px; background:#f8fafc; padding:5px 10px; border-radius:8px; border:1px solid #cbd5e1; margin-top:10px; align-items:flex-end;">
                <div style="display:flex; align-items:center;">
                    <label style="font-size:0.9rem; color:#64748b; margin-right:8px; font-weight:normal;">Çoğul Kalıp No:</label>
                    <input type="text" class="cogul-id-input" placeholder="Örn: 43" style="width:70px; padding:4px; font-size:0.9rem; border:1px solid #ccc; border-radius:4px; text-align:center; margin-right:10px;">
                    <button class="action-btn" style="padding:4px 8px; font-size:0.8rem; background:#34495e;" onclick="document.getElementById('ozel-cogul-${safeId}').style.display = document.getElementById('ozel-cogul-${safeId}').style.display === 'none' ? 'flex' : 'none'">+ Özel Çoğul Kelime</button>
                </div>
                <div id="ozel-cogul-${safeId}" style="display:none; gap:10px; width:100%; margin-top:5px; padding-top:5px; border-top:1px dashed #ccc;">
                    <div style="flex:2"><input type="text" class="ozel-cogul-ar ar-input" placeholder="Çoğul Arapça..." style="width:100%; font-size:1rem; padding:4px;"></div>
                    <div style="flex:3"><input type="text" class="ozel-cogul-tr tr-input" placeholder="Çoğul Anlamı..." style="width:100%; font-size:0.9rem; padding:4px;"></div>
                    <div style="flex:1"><input type="text" class="ozel-cogul-em em-input emoji-input" placeholder="Emoji" onclick="openEmojiPicker(this)" readonly style="width:100%; cursor:pointer; text-align:center; font-size:1.2rem; padding:4px;"></div>
                </div>
            </div>
            `}

            <div id="ornekler-container-${safeId}"></div>

            <div class="card-actions" style="margin-top:10px; padding-bottom:10px; border-bottom:1px dashed #ccc;">
                <button class="action-btn" onclick="addOrnek('${safeId}', 'base')">+ Örnek Ekle</button>
                ${isVerbKalip(id) ? 
                  `<span style="color:#94a3b8; font-style:italic; align-self:center; font-size:0.9rem; margin-left:10px;">(Fiiller ek alamaz)</span>` : 
                  `<button class="action-btn" style="margin-left:auto;" onclick="toggleSuffixPicker('${safeId}')">+ Alt Ek Ekle (Suffix)</button>`
                }
            </div>

            <div id="suffixes-container-${safeId}" class="suffix-list" style="display:none;"></div>
            
            <div id="suffix-picker-${safeId}" style="display:none; gap:5px; margin-top:10px; flex-wrap:wrap; background:#f1f5f9; padding:10px; border-radius:8px;">
                <span style="font-weight: normal; color:#666; margin-right:10px; align-self:center;">Ek Seç:</span>
                <button class="action-btn" style="font-family:'Arakom', sans-serif; font-size:1.3rem;" onclick="insertSuffix('${safeId}', 'ة')">ة</button>
                <button class="action-btn" style="font-family:'Arakom', sans-serif; font-size:1.3rem;" onclick="insertSuffix('${safeId}', 'ين')">ين</button>
                <button class="action-btn" style="font-family:'Arakom', sans-serif; font-size:1.3rem;" onclick="insertSuffix('${safeId}', 'ون')">ون</button>
                <button class="action-btn" style="font-family:'Arakom', sans-serif; font-size:1.3rem;" onclick="insertSuffix('${safeId}', 'ان')">ان</button>
                <button class="action-btn" style="font-family:'Arakom', sans-serif; font-size:1.3rem;" onclick="insertSuffix('${safeId}', 'ات')">ات</button>
                <button class="action-btn" onclick="insertSuffix('${safeId}', 'MANUAL')">✍️ Diğer</button>
            </div>
        `;
        
        container.appendChild(card);
        
        
    }

    function addOrnek(containerId, context) {
        // context is 'base' or a suffix name like 'ة'
        const parentId = context === 'base' ? `ornekler-container-${containerId}` : `suffix-ornekler-${containerId}-${context}`;
        const container = document.getElementById(parentId);
        
        const row = document.createElement('div');
        row.className = 'ornek-row';
        row.dataset.type = 'ornek';
        
        row.innerHTML = `
            <input type="text" class="or-ar" placeholder="Arapça Örnek Cümle/Ayet...">
            <input type="text" class="or-tr" placeholder="Türkçe Çevirisi...">
            <button class="delete-btn" style="background:#e74c3c; width:30px; height:30px; margin:auto;" onclick="this.parentElement.remove()">X</button>
        `;
        container.appendChild(row);
    }


    function toggleSuffixPicker(kalipId) {
        const picker = document.getElementById(`suffix-picker-${kalipId}`);
        picker.style.display = picker.style.display === 'none' ? 'flex' : 'none';
    }

    function insertSuffix(kalipId, suffixName) {
        if (suffixName === 'MANUAL') {
            suffixName = prompt("Ekin Arapça adını girin (Örn: ة , ون , ين ):");
            if (!suffixName) return;
            suffixName = suffixName.trim();
        }
        
        const container = document.getElementById(`suffixes-container-${kalipId}`);
        container.style.display = 'block';
        
        if (document.getElementById(`suffix-${kalipId}-${suffixName}`)) {
            alert("Bu ek zaten eklenmiş!");
            return;
        }

        const sufCard = document.createElement('div');
        sufCard.className = 'suffix-card';
        sufCard.id = `suffix-${kalipId}-${suffixName}`;
        sufCard.dataset.suf = suffixName;
        
        sufCard.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <div class="suffix-title">+ Ek: ${suffixName}</div>
                <button class="delete-btn" style="background:#e74c3c; width:25px; height:25px; font-size:12px;" onclick="document.getElementById('suffix-${kalipId}-${suffixName}').remove()">X</button>
            </div>
            <div class="entry-grid">
                <div style="flex:2"><label>Arapça</label><input type="text" class="ar-input suf-ar" placeholder="Ekli kelime..."></div>
                <div style="flex:3"><label>Türkçe</label><input type="text" class="tr-input suf-tr" placeholder="Anlamını yazın..."></div>
                <div style="flex:0.5"><label>Emoji</label><input type="text" class="em-input suf-em emoji-input" placeholder="Emoji Seç" onclick="openEmojiPicker(this)" readonly style="cursor:pointer; text-align:center; font-size:1.5rem;"></div>
            </div>
            <div id="suffix-ornekler-${kalipId}-${suffixName}"></div>
            <div class="card-actions">
                <button class="action-btn" onclick="addOrnek('${kalipId}', '${suffixName}')">+ Örnek Ekle</button>
                <div style="margin-left:auto; display:flex; flex-direction:column; gap:5px; background:#f8fafc; padding:5px 10px; border-radius:8px; border:1px solid #cbd5e1; align-items:flex-end;">
                    <div style="display:flex; align-items:center;">
                        <label style="font-size:0.9rem; color:#64748b; margin-right:8px; font-weight:normal;">Çoğul Kalıp No:</label>
                        <input type="text" class="suf-cogul-id" placeholder="Örn: 43" style="width:70px; padding:4px; font-size:0.9rem; border:1px solid #ccc; border-radius:4px; text-align:center; margin-right:10px;">
                        <button class="action-btn" style="padding:4px 8px; font-size:0.8rem; background:#34495e;" onclick="document.getElementById('suf-ozel-cogul-${kalipId}-${suffixName}').style.display = document.getElementById('suf-ozel-cogul-${kalipId}-${suffixName}').style.display === 'none' ? 'flex' : 'none'">+ Özel Çoğul Kelime</button>
                    </div>
                    <div id="suf-ozel-cogul-${kalipId}-${suffixName}" style="display:none; gap:10px; width:100%; margin-top:5px; padding-top:5px; border-top:1px dashed #ccc;">
                        <div style="flex:2"><input type="text" class="suf-ozel-cogul-ar ar-input" placeholder="Çoğul Arapça..." style="width:100%; font-size:1rem; padding:4px;"></div>
                        <div style="flex:3"><input type="text" class="suf-ozel-cogul-tr tr-input" placeholder="Çoğul Anlamı..." style="width:100%; font-size:0.9rem; padding:4px;"></div>
                        <div style="flex:1"><input type="text" class="suf-ozel-cogul-em em-input emoji-input" placeholder="Emoji" onclick="openEmojiPicker(this)" readonly style="width:100%; cursor:pointer; text-align:center; font-size:1.2rem; padding:4px;"></div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(sufCard);
        
        
        // Hide picker after selection
        document.getElementById(`suffix-picker-${kalipId}`).style.display = 'none';
    }

    function loadExistingRoot() {
        const root = document.getElementById('root-ar').value.trim();
        if (!root) {
            alert("Lütfen önce yüklenecek Kök Harflerini girin!");
            return;
        }
        
        if (typeof sozlukVerileri === 'undefined') {
            alert("Sözlük veritabanı (veri_sozluk.js) yüklenemedi.");
            return;
        }

        if (!sozlukVerileri[root]) {
            alert(`Sistemde "${root}" kökü bulunamadı. Yepyeni bir kök oluşturabilirsiniz.`);
            return;
        }

        const rootData = sozlukVerileri[root];
        
        // Clear existing kalips
        document.getElementById('kalip-container').innerHTML = '';
        
        alert(`✅ "${root}" kökü bulundu! İçindeki veriler formlara yükleniyor... \n\n⚠️ Not: Kayıtlı kökün en üstteki Türkçe "Anlam" yorum satırı koddan okunamadığı için, kodu üretirken üst kısımda çıkması adına Kök Anlamı kutusunu manuel doldurabilirsiniz.`);

        // Kodu Doğrudan Metin Kutusuna Dökme
        let rawCode = `    "${root}": {\n`;
        Object.keys(rootData).forEach((k, i, arr) => {
            let strVal = JSON.stringify(rootData[k], null, 4).replace(/\n/g, '\n        ');
            // Remove quotes from simple keys if desired, but standard JSON is fine too.
            // We will do a basic replacement for aesthetic reasons to match the codebase:
            strVal = strVal.replace(/"([^"]+)":/g, function(match, p1) {
                if (/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(p1) || /^[0-9]+$/.test(p1)) {
                    return p1 + ':';
                }
                return match;
            });
            let keyFormat = /^[0-9]+$/.test(k) ? k : `"${k}"`;
            rawCode += `        ${keyFormat}: ${strVal}${i < arr.length - 1 ? ',' : ''}\n`;
        });
        rawCode += `    },`;
        document.getElementById('code-output').value = rawCode;
        document.getElementById('code-container').style.display = 'block';

        Object.keys(rootData).forEach(kId => {
            if (kId === 'isDictOnly' || kId === 'rootType' || kId === 'anlam') return; // Skip non-data keys
            if (String(kId).endsWith('_cogul')) return; // Skip special plurals as they are populated by their parent
            
            const kData = rootData[kId];
            
            // 1. Create Kalıp Card
            if (kId === 'tekil') {
                if (!document.getElementById('kalip-card-bagimsiz_isim')) {
                    addKalip('isim');
                }
                const card = document.getElementById('kalip-card-bagimsiz_isim');
                if (kData.base) {
                    if (kData.base.arText) card.querySelector('.ar-input').value = kData.base.arText;
                    if (kData.base.trText) card.querySelector('.tr-input').value = kData.base.trText;
                    if (kData.base.emoji) card.querySelector('.kalip-em').value = kData.base.emoji;
                }
                return; // Custom hydration handled
            }
            if (kId === 'cogul') {
                if (!document.getElementById('kalip-card-bagimsiz_isim')) {
                    addKalip('isim');
                }
                const card = document.getElementById('kalip-card-bagimsiz_isim');
                if (kData.base && kData.base.arText) {
                    card.querySelector('.cogul-input').value = kData.base.arText;
                }
                return; // Custom hydration handled
            }
            if (String(kId).startsWith('isim')) {
                // Fallback for old ones if they still exist
                addKalip('isim');
            }
            else {
                document.getElementById('kalip-id-input').value = kId;
                addKalip();
            }
            
            let safeId = kId.toString().replace(/[^a-zA-Z0-9_-]/g, 'joker');
            const card = document.getElementById(`kalip-card-${safeId}`);
            if (!card) return;
            
            // 2. Populate Base
            if (kData.base) {
                card.querySelector('.kalip-ar').value = kData.base.arText || '';
                card.querySelector('.kalip-tr').value = kData.base.trText || '';
                card.querySelector('.kalip-em').value = kData.base.emoji || '';
                
                // Populate Base Ornekler
                if (kData.base.ornek) {
                    let ornekler = Array.isArray(kData.base.ornek) ? kData.base.ornek : [kData.base.ornek];
                    ornekler.forEach(orn => {
                        addOrnek(safeId, 'base');
                        const rows = card.querySelectorAll(`#ornekler-container-${safeId} .ornek-row`);
                        const lastRow = rows[rows.length - 1];
                        lastRow.querySelector('.or-ar').value = orn.ar || '';
                        lastRow.querySelector('.or-tr').value = orn.tr || '';
                    });
                }
            }
            if (kData.cogulId) {
                const cogulInput = card.querySelector('.cogul-id-input');
                if (cogulInput) {
                    cogulInput.value = kData.cogulId;
                    
                    if (String(kData.cogulId).endsWith('_cogul')) {
                        const ozelCogulContainer = document.getElementById(`ozel-cogul-${safeId}`);
                        if (ozelCogulContainer) ozelCogulContainer.style.display = 'flex';
                        
                        const scData = rootData[kData.cogulId];
                        if (scData && scData.base) {
                            card.querySelector('.ozel-cogul-ar').value = scData.base.arText || '';
                            card.querySelector('.ozel-cogul-tr').value = scData.base.trText || '';
                            card.querySelector('.ozel-cogul-em').value = scData.base.emoji || '';
                        }
                    }
                }
            }
            
            // 3. Populate Suffixes
            Object.keys(kData).forEach(sKey => {
                if (sKey === 'base' || sKey === 'suggestsPlus' || sKey === 'cogulId') return;
                
                // sKey is a suffix like 'ة'
                insertSuffix(safeId, sKey);
                const sufData = kData[sKey];
                const sufCard = document.getElementById(`suffix-${safeId}-${sKey}`);
                
                if (sufCard) {
                    sufCard.querySelector('.suf-ar').value = sufData.arText || '';
                    sufCard.querySelector('.suf-tr').value = sufData.trText || '';
                    sufCard.querySelector('.suf-em').value = sufData.emoji || '';
                    
                    if (sufData.cogulId) {
                        sufCard.querySelector('.suf-cogul-id').value = sufData.cogulId;
                        
                        if (String(sufData.cogulId).endsWith('_cogul')) {
                            const scContainer = document.getElementById(`suf-ozel-cogul-${safeId}-${sKey}`);
                            if (scContainer) scContainer.style.display = 'flex';
                            
                            const scData = rootData[sufData.cogulId];
                            if (scData && scData.base) {
                                sufCard.querySelector('.suf-ozel-cogul-ar').value = scData.base.arText || '';
                                sufCard.querySelector('.suf-ozel-cogul-tr').value = scData.base.trText || '';
                                sufCard.querySelector('.suf-ozel-cogul-em').value = scData.base.emoji || '';
                            }
                        }
                    }
                    
                    // Populate Suffix Ornekler
                    if (sufData.ornek) {
                        let sufOrnekler = Array.isArray(sufData.ornek) ? sufData.ornek : [sufData.ornek];
                        sufOrnekler.forEach(orn => {
                            addOrnek(safeId, sKey);
                            const rows = sufCard.querySelectorAll(`#suffix-ornekler-${safeId}-${sKey} .ornek-row`);
                            const lastRow = rows[rows.length - 1];
                            lastRow.querySelector('.or-ar').value = orn.ar || '';
                            lastRow.querySelector('.or-tr').value = orn.tr || '';
                        });
                    }
                }
            });
        });
        
        document.getElementById('kalip-id-input').value = ''; // clear input
    }

    // Code Generator
    function generateCustomCode() {
        let rootAr, rootTr = "", rootType = "";
        
        if (currentMode === 'kok') {
            rootAr = document.getElementById('root-ar').value.trim();
            rootTr = document.getElementById('root-tr').value.trim();
            rootType = document.getElementById('root-type').value.trim();
        } else {
            rootAr = document.getElementById('isim-tekil-ar').value.trim();
        }
        
        if (!rootAr) {
            alert(currentMode === 'kok' ? "Lütfen Kök Harflerini giriniz!" : "Lütfen Tekil Arapça metni girin!");
            return;
        }

        let code = `    // ==================================================================\n`;
        const titleSuffix = currentMode === 'kok' ? 'KÖKÜ' : 'KELİMESİ';
        if (rootTr || rootType) {
            code += `    // ${rootAr} ${titleSuffix} - ${rootTr || 'Anlam girilmedi'}\n`;
            if (rootType) code += `    // ${rootType}\n`;
        } else {
            code += `    // ${rootAr} ${titleSuffix}\n`;
        }
        code += `    // ==================================================================\n`;
        code += `    "${rootAr}": {\n`;
        
        if (currentMode === 'isim') {
            const tAr = document.getElementById('isim-tekil-ar').value.trim();
            const tTr = document.getElementById('isim-tekil-tr').value.trim();
            const tEm = document.getElementById('isim-tekil-em').value.trim();
            const cAr = document.getElementById('isim-cogul-ar').value.trim();
            const cTr = document.getElementById('isim-cogul-tr').value.trim();
            

            code += `        "isDictOnly": true,\n`;
            code += `        "tekil": { \n`;
            code += `            base: { emoji: "${tEm}", arText: "${tAr}", trText: "${tTr}" }\n`;
            code += `        }`;
            
            if (cAr) {
                code += `,\n        "cogul": { \n`;
                code += `            base: { emoji: "${tEm}", arText: "${cAr}", trText: "${cTr || 'Çoğul: ' + tTr}" }\n`;
                code += `        }\n`;
            } else {
                code += `\n`;
            }
            
            let fullCode = code + `    },`;
            document.getElementById('code-output').value = fullCode;
            document.getElementById('code-container').style.display = 'block';
            return;
        }

        const cards = document.querySelectorAll('#kalip-container .kalip-card');
        
        cards.forEach((card, index) => {
            const id = card.dataset.id;
            const safeId = card.dataset.safeid || id.toString().replace(/[^a-zA-Z0-9_-]/g, 'joker');
            const data = KALIP_DATA[id] || { ar: 'Joker', tr: 'Ekstra Kalıp' };
            
            const arText = card.querySelector('.kalip-ar').value.trim();
            const trText = card.querySelector('.kalip-tr').value.trim();
            const emoji = card.querySelector('.kalip-em').value.trim();
            const cogulInput = card.querySelector('.cogul-id-input');
            let cogulId = cogulInput ? cogulInput.value.trim() : "";
            
            // Check for special plural
            const ozelCogulArInput = card.querySelector('.ozel-cogul-ar');
            let ozelCogulAr = "", ozelCogulTr = "", ozelCogulEm = "";
            if (ozelCogulArInput) {
                ozelCogulAr = ozelCogulArInput.value.trim();
                ozelCogulTr = card.querySelector('.ozel-cogul-tr').value.trim();
                ozelCogulEm = card.querySelector('.ozel-cogul-em').value.trim();
                
                if (ozelCogulAr) {
                    cogulId = `${id}_cogul`; // Override cogulId if special plural is provided
                }
            }
            let titleLine = `${id} Numaralı Kalıp`;
            if (data && (data.ar || data.tr)) titleLine += ` (${data.ar || ''} - ${data.tr || ''})`;
            
            let keyFormat = /^[0-9]+$/.test(id) ? id : `"${id}"`;
            let suffixSpecialPlurals = [];
            
            code += `
        // ✦ ──────────────────────────────────────────────────────── ✦
        //             ${titleLine}
        // ✦ ──────────────────────────────────────────────────────── ✦
`;
            code += `        ${keyFormat}: { 
`;
            
            // Base object
            if (cogulId) {
                code += `            cogulId: "${cogulId}",\n`;
            }
            code += `            base: { 
`;
            code += `                emoji: "${emoji}", 
`;
            code += `                arText: "${arText}", 
`;
            code += `                trText: "${trText}"`;
            
            // Ornekler for Base
            const ornekRows = card.querySelectorAll(`#ornekler-container-${safeId} .ornek-row`);
            if (ornekRows.length > 0) {
                code += `,
                ornek: `;
                if (ornekRows.length === 1) {
                    let o_ar = ornekRows[0].querySelector('.or-ar').value.trim();
                    let o_tr = ornekRows[0].querySelector('.or-tr').value.trim();
                    code += `{ ar: "${o_ar}", tr: "${o_tr}" }
`;
                } else {
                    code += `[
`;
                    ornekRows.forEach((row, oIdx) => {
                        let o_ar = row.querySelector('.or-ar').value.trim();
                        let o_tr = row.querySelector('.or-tr').value.trim();
                        code += `                    { ar: "${o_ar}", tr: "${o_tr}" }${oIdx < ornekRows.length - 1 ? ',' : ''}
`;
                    });
                    code += `                ]
`;
                }
            } else {
                code += ` 
`;
            }
            code += `            }`;
            
            // Suffixes
            const suffixes = card.querySelectorAll('.suffix-card');
            if (suffixes.length > 0) {
                code += `,
            suggestsPlus: true,
`;
                suffixes.forEach((sufCard, sIdx) => {
                    const sufName = sufCard.dataset.suf;
                    const s_ar = sufCard.querySelector('.suf-ar').value.trim();
                    const s_tr = sufCard.querySelector('.suf-tr').value.trim();
                    const s_em = sufCard.querySelector('.suf-em').value.trim();
                    
                    const s_cogulInput = sufCard.querySelector('.suf-cogul-id');
                    let s_cogulId = s_cogulInput ? s_cogulInput.value.trim() : "";
                    
                    const s_ozelCogulArInput = sufCard.querySelector('.suf-ozel-cogul-ar');
                    let s_ozelCogulAr = "", s_ozelCogulTr = "", s_ozelCogulEm = "";
                    if (s_ozelCogulArInput) {
                        s_ozelCogulAr = s_ozelCogulArInput.value.trim();
                        s_ozelCogulTr = sufCard.querySelector('.suf-ozel-cogul-tr').value.trim();
                        s_ozelCogulEm = sufCard.querySelector('.suf-ozel-cogul-em').value.trim();
                        if (s_ozelCogulAr) {
                            s_cogulId = `${id}_${sufName}_cogul`;
                            suffixSpecialPlurals.push({
                                id: s_cogulId,
                                ar: s_ozelCogulAr,
                                tr: s_ozelCogulTr,
                                em: s_ozelCogulEm
                            });
                        }
                    }
                    code += `            "${sufName}": { \n`;
                    if (s_cogulId) {
                        code += `                cogulId: "${s_cogulId}", \n`;
                    }
                    code += `                emoji: "${s_em}", \n`;
                    code += `                arText: "${s_ar}", \n`;
                    code += `                trText: "${s_tr}"`;

                    // Ornekler for Suffix
                    const sOrnekRows = sufCard.querySelectorAll(`#suffix-ornekler-${safeId}-${sufName} .ornek-row`);
                    if (sOrnekRows.length > 0) {
                        code += `,
                ornek: `;
                        if (sOrnekRows.length === 1) {
                            let o_ar = sOrnekRows[0].querySelector('.or-ar').value.trim();
                            let o_tr = sOrnekRows[0].querySelector('.or-tr').value.trim();
                            code += `{ ar: "${o_ar}", tr: "${o_tr}" }
`;
                        } else {
                            code += `[
`;
                            sOrnekRows.forEach((row, oIdx) => {
                                let o_ar = row.querySelector('.or-ar').value.trim();
                                let o_tr = row.querySelector('.or-tr').value.trim();
                                code += `                    { ar: "${o_ar}", tr: "${o_tr}" }${oIdx < sOrnekRows.length - 1 ? ',' : ''}
`;
                            });
                            code += `                ]
`;
                        }
                    } else {
                        code += ` 
`;
                    }
                    
                    code += `            }${sIdx < suffixes.length - 1 ? ',' : ''}
`;
                });
            } else {
                code += `
`;
            }
            
            code += `        }`;


            // Append special plural object if it exists
            if (typeof ozelCogulAr !== 'undefined' && ozelCogulAr) {
                code += `,
        "${id}_cogul": {
            "isHiddenInList": true,
            "base": { "emoji": "${ozelCogulEm}", "arText": "${ozelCogulAr}", "trText": "${ozelCogulTr}" }
        }`;
            }

            suffixSpecialPlurals.forEach(sP => {
                code += `,
        "${sP.id}": {
            "isHiddenInList": true,
            "base": { "emoji": "${sP.em}", "arText": "${sP.ar}", "trText": "${sP.tr}" }
        }`;
            });

            code += `${index < cards.length - 1 ? ',' : ''}

`;
        });

        code += `    },
`;

        document.getElementById('code-container').style.display = 'block';
        document.getElementById('code-output').value = code;
    }

    function copyCode() {
        const textarea = document.getElementById('code-output');
        textarea.select();
        document.execCommand('copy');
        
        const btn = document.querySelector('.copy-btn');
        btn.innerText = 'Kopyalandı! ✅';
        setTimeout(() => { btn.innerText = 'Kopyala'; }, 2000);
    }

/* ================================ */

const EMOJI_CATEGORIES = {
            "Gülümseyenler ve İnsanlar": ["😀","😃","😄","😁","😆","😅","😂","🤣","🥲","☺️","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥸","🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","☹️","😣","😖","😫","😩","🥺","😢","😭","😮‍💨","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🫣","🤗","🫡","🤔","🫢","🤭","🤫","🤥","😶","😶‍🌫️","😐","😑","😬","🫨","🫠","🙄","😯","😦","😧","😮","😲","🥱","😴","🤤","😪","😵","😵‍💫","🫥","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠","😈","👿","👹","👺","🤡","💩","👻","💀","☠️","👽","👾","🤖","🎃","😺","😸","😹","😻","😼","😽","🙀","😿","😾","🧑","👨","👩","🧔","👦","👧","🧒","👶","👵","👴","👮","👷","🕵","👩‍⚕️","👨‍⚕️","👩‍🏫","👨‍🏫","👰","🤵","👸","🤴","🥷","🦸","🦹","🤶","🎅","🧙","🧝","🧛","🧟","🧞","🧜","🧚","👼","🤰","🤱"],
            "El Hareketleri": ["👋","🤚","🖐","✋","🖖","🫱","🫲","🫳","🫴","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦿","🦵","🦶"],
            "Hayvanlar": ["🐶","🐕","🦮","🐕‍🦺","🐩","🐺","🦊","🦝","🐱","🐈","🐈‍⬛","🦁","🐯","🐅","🐆","🐴","🐎","🦄","🦓","🦌","🦬","🐮","🐂","🐃","🐄","🐷","🐖","🐗","🐽","🐏","🐑","🐐","🐪","🐫","🦙","🦒","🐘","🦣","🦏","🦛","🐭","🐁","🐀","🐹","🐰","🐇","🐿","🦫","🦔","🦇","🐻","🐻‍❄️","🐨","🐼","🦥","🦦","🦨","🦘","🦡","🐾","🦃","🐔","🐓","🐣","🐤","🐥","🐦","🐧","🕊","🦅","🦆","🦢","🦉","🦤","🪶","🦩","🦚","🦜","🐸","🐊","🐢","🦎","🐍","🐲","🐉","🦕","🦖","🐳","🐋","🐬","🦭","🐟","🐠","🐡","🦈","🐙","🐚","🐌","🦋","🐛","🐜","🐝","🪲","🐞","🦗","🪳","🕷","🕸","🦂","🦟","🪰","🪱","🦠"],
            "Doğa ve Hava": ["💐","🌸","💮","🏵","🌹","🥀","🌺","🌻","🌼","🌷","🌱","🪴","🌲","🌳","🌴","🌵","🌾","🌿","☘️","🍀","🍁","🍂","🍃","🍄","🌰","🌍","🌎","🌏","🌐","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌙","🌚","🌛","🌜","☀️","🌝","🌞","⭐","🌟","🌠","☁️","⛅","⛈","🌤","🌥","🌦","🌧","🌨","🌩","🌪","🌫","🌬","🌀","🌈","🌂","☂️","☔","⛱","⚡","❄️","☃️","⛄","☄️","🔥","💧","🌊"],
            "Yiyecek ve İçecek": ["🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶","🫑","🌽","🥕","🫒","🧄","🧅","🥔","🍠","🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🌭","🍔","🍟","🍕","🫓","🥪","🥙","🧆","🌮","🌯","🫔","🥗","🥘","🫕","🥫","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🦪","🍤","🍙","🍚","🍘","🍥","🥠","🥮","🍢","🍡","🍧","🍨","🍦","🥧","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍿","🍩","🍪","🌰","🥜","🍯","🥛","🍼","🫖","☕","🍵","🧃","🥤","🧋","🍶","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧉","🍾","🧊"],
            "Aktiviteler": ["⚽","⚾","🥎","🏀","🏐","🏈","🏉","🎾","🥏","🎳","🏏","🏑","🏒","🥍","🏓","🏸","🥊","🥋","🥅","⛳","⛸","🎣","🤿","🎽","🎿","🛷","🥌","🎯","🪀","🪁","🎱","🔮","🪄","🧿","🎮","🕹","🎰","🎲","🧩","🧸","🪅","🪆","♠️","♥️","♦️","♣️","♟","🃏","🀄","🎴","🎭","🖼","🎨","🧵","🪡","🧶","🪢"],
            "Nesneler": ["📱","📲","☎️","📞","📟","📠","🔋","🔌","💻","🖥","🖨","⌨️","🖱","🖲","💽","💾","💿","📀","🧮","🎥","🎞","📽","🎬","📺","📷","📸","📹","📼","🔍","🔎","🕯","💡","🔦","🏮","🪔","📔","📕","📖","📗","📘","📙","📚","📓","📒","📃","📜","📄","📰","🗞","📑","🔖","🏷","💰","🪙","💴","💵","💶","💷","💸","💳","🧾","💹","✉️","📧","📨","📩","📤","📥","📦","📫","📪","📬","📭","📮","🗳","✏️","✒️","🖋","🖊","🖌","🖍","📝","💼","📁","📂","🗂","📅","📆","🗒","🗓","📇","📈","📉","📊","📋","📌","📍","📎","🖇","📏","📐","✂️","🗃","🗄","🗑","🔒","🔓","🔏","🔐","🔑","🗝","🔨","🪓","⛏","⚒","🛠","🗡","⚔️","🔫","🪃","🏹","🛡","🪚","🔧","🪛","⚙️","🗜","⚖️","🦯","🔗","⛓","🪝","🧰","🧲","🪜","⚗","🧪","🧫","🧬","🔬","🔭","📡","💉","🩸","💊","🩹","🩺","🚪","🛗","🪞","🪟","🛏","🛋","🪑","🚽","🪠","🚿","🛁","🪤","🪒","🧴","🧷","🧹","🧺","🧻","🪣","🧼","🪥","🧽","🧯","🛒","🚬","⚰️","🪦","⚱️","🗿","🪧"],
            "Giyim ve Moda": ["👓","🕶","🥽","🥼","🦺","👔","👕","👖","🧣","🧤","🧥","🧦","👗","👘","🥻","🩱","🩲","🩳","👙","👚","👛","👜","👝","🛍","🎒","🩴","👞","👟","🥾","🥿","👠","👡","👢","👑","👒","🎩","🎓","🧢","🪖","⛑","📿","💄","💍","💎"],
            "Semboller ve Oklar": ["🏧","🚮","🚰","♿","🚹","🚺","🚻","🚼","🚾","🛂","🛃","🛄","🛅","⚠️","🚸","⛔","🚫","🚳","🚭","🚯","🚱","🚷","📵","🔞","☢️","☣️","⬆️","↗️","➡️","↘️","⬇️","↙️","⬅️","↖️","↕️","↔️","↩️","↪️","⤴️","⤵️","🔃","🔄","🔙","🔚","🔛","🔜","🔝","🛐","⚛️","🕉","✡️","☸️","☯️","✝️","☦️","☪️","☮️","🕎","🔯","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","⛎","🔀","🔁","🔂","▶️","⏩","⏭","⏯","◀️","⏪","⏮","🔼","⏫","🔽","⏬","⏸","⏹","⏺","⏏️","🎦","🔅","🔆","📶","📳","📴","♀️","♂️","⚧","✖️","➕","➖","➗","♾","‼️","⁉️","❓","❔","❕","❗","〰️","💱","💲","⚕️","♻️","⚜️","🔱","📛","🔰","⭕","✅","☑️","✔️","❌","❎","➰","➿","〽️","✳️","✴️","❇️","©️","®️","™️","#️⃣","*️⃣","0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟","🔠","🔡","🔢","🔣","🔤","🅰️","🆎","🅱️","🆑","🆒","🆓","ℹ️","🆔","Ⓜ️","🆕","🆖","🅾️","🆗","🅿️","🆘","🆙","🆚","🈁","🈂️","🈷️","🈶","🈯","🉐","🈹","🈚","🈲","🉑","🈸","🈴","🈳","㊗️","㊙️","🈺","🈵","🔴","🟠","🟡","🟢","🔵","🟣","🟤","⚫","⚪","🟥","🟧","🟨","🟩","🟦","🟪","🟫","⬛","⬜","◼️","◻️","◾","◽","▪️","▫️","🔶","🔷","🔸","🔹","🔺","🔻","💠","🔘","🔳","🔲","🏁","🚩","🎌","🏴","🏳","🏳️‍🌈","🏳️‍⚧️","🏴‍☠️"]
        };

        let activeEmojiInput = null;

        function openEmojiPicker(inputEl) {
            activeEmojiInput = inputEl;
            const container = document.getElementById('emoji-container');
            const nav = document.getElementById('emoji-nav');
            
            // Sadece bir kere doldur
            if (container.children.length === 0) {
                let htmlNav = "";
                let htmlContent = "";
                
                Object.keys(EMOJI_CATEGORIES).forEach((cat, index) => {
                    // Nav Button
                    htmlNav += `<button onclick="document.getElementById('cat-${index}').scrollIntoView({behavior:'smooth', block:'start'});" style="background:#f1f5f9; color:#475569; border:none; padding:10px 20px; border-radius:20px; font-weight: normal; cursor:pointer; white-space:nowrap; transition:0.2s;" onmouseover="this.style.background='var(--primary)'; this.style.color='white';" onmouseout="this.style.background='#f1f5f9'; this.style.color='#475569';">${cat}</button>`;
                    
                    // Section content
                    htmlContent += `<div id="cat-${index}" style="margin-top:20px; margin-bottom:15px; padding-top:10px;">
                        <h3 style="margin-bottom:15px; color:#64748b; font-size:1.5rem; border-bottom:2px solid #e2e8f0; padding-bottom:10px;">${cat}</h3>
                        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(70px, 1fr)); gap:15px; text-align:center;">`;
                    
                    EMOJI_CATEGORIES[cat].forEach(em => {
                        htmlContent += `<div style="font-size:3.5rem; cursor:pointer; padding:15px; border-radius:15px; transition:transform 0.1s, background 0.2s; background:#f8fafc;" onmouseover="this.style.background='#e2e8f0'; this.style.transform='scale(1.15)';" onmouseout="this.style.background='#f8fafc'; this.style.transform='scale(1)';" onclick="selectEmoji('${em}')">${em}</div>`;
                    });
                    
                    htmlContent += `</div></div>`;
                });
                
                nav.innerHTML = htmlNav;
                container.innerHTML = htmlContent;
            }
            
            document.getElementById('emoji-modal-overlay').style.display = 'block';
            document.getElementById('emoji-modal').style.display = 'flex';
        }

        function closeEmojiPicker() {
            document.getElementById('emoji-modal-overlay').style.display = 'none';
            document.getElementById('emoji-modal').style.display = 'none';
        }

        function selectEmoji(em) {
            if (activeEmojiInput) {
                activeEmojiInput.value = em;
            }
            closeEmojiPicker();
        }

/* ================================ */

document.addEventListener('DOMContentLoaded', function() {
        const loader = document.getElementById('global-loading-screen');
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 300);
        }
    });