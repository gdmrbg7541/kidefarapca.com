// ===== listelerim.js (index'e birlestirildi, tek firebase) =====
function llRootEl(){ return document.getElementById('ll-root') || document.body; }
function initListelerim(){ try{ var b=document.getElementById('login-nav-btn'); if(b) b.style.display='none'; var u=(window.firebase&&firebase.auth&&firebase.auth().currentUser); if(u && typeof verileriGetir==='function' && window._llLoadedUid !== u.uid){ window._llLoadedUid = u.uid; verileriGetir(u.uid); } setTimeout(function(){ if(typeof syncLevelActions==='function') syncLevelActions(); }, 900); }catch(e){console.error('initListelerim',e);} }
window.initListelerim=initListelerim;

const mufredatVerisi = {
    "9": [
        "Okula uyum ve Arapça harflerin telaffuzu", "Harflerin başta-ortada-sonda yazılışı", "Selamlaşma ifadeleri (Merhaba, Ehlen)", 
        "Tanışma diyalogları", "Şahıs zamirleri (Ana, Anta, Anti)", "İşaret isimleri (Hâzâ, Hâzihî)", 
        "Sayılar (1-10)", "Sınıf içi yönergeler", "1. ARA TATİL", "Aile bireyleri (Ümm, Eb)", 
        "İyelik zamirleri", "Evin bölümleri", "Varlıkların konumları (Altında, üstünde)", "Meslekler", 
        "Fiziksel özellikler", "Renklere giriş", "Günlük rutinler", "1. DÖNEM SONU", 
        "Müzari fiil girişi", "Müzari fiil çekimi", "Saatler (Tam/Yarım)", "Hobiler", "Spor dalları", 
        "Mevsimler ve Hava", "Kıyafetler", "Yiyecek ve İçecekler", "Meyveler-Sebzeler", "2. ARA TATİL", 
        "Ulaşım araçları", "Yer-Yön tarifleri", "Hayvanlar alemi", "Vücudun bölümleri", 
        "Gelecek zaman kipi", "Ülkeler ve Milliyetler", "Genel Müfredat Özeti", "Yıl Sonu Değerlendirmesi"
    ],
    // Buraya 5, 6, 7, 8. sınıfları da aynı formatta ekleyebilirsin.
};
    
function openDefter() {
    document.getElementById('defterModal').style.display = 'flex';
}

// Bu fonksiyon her zaman çalışabilmesi için global alanda olmalıdır

// Kazanım Takibi İçin render fonksiyonu
function renderPlan() {
    if (curLId === null || !data.levels[curLId]) return;
    const body = document.getElementById('planBody');
    if (!body) return;
    
    // Seviye verisine ulaşıyoruz (Örn: 9. Sınıflar Genel Planı)
    let level = data.levels[curLId];
    // Sınıf verisi sadece "check" durumları için lazım
    let cls = (curCId !== null) ? level.classes[curCId] : null;

    body.innerHTML = '<div class="plan-container"><div id="period1" class="period-column"></div><div id="period2" class="period-column"></div></div>';
    
    const p1 = document.getElementById('period1');
    const p2 = document.getElementById('period2');
    
    // Plan metinleri artık LEVEL bazında saklanıyor
    if(!level.planText) level.planText = {};
    // Checkbox durumları hala CLASS bazında (isteğe bağlı)
    if(cls && !cls.planStatus) cls.planStatus = {};

    let startDate = new Date("2026-09-14");
    let today = new Date();

    const longBreaks = {
        9:  { name: "1. Ara Tatil", range: "16-20 Kas", weeks: 1 },
        18: { name: "Sömestr Tatili", range: "25 Oca-5 Şub", weeks: 2 },
        22: { name: "2. Ara Tatil", range: "8-12 Mar", weeks: 1 }
    };

    let totalOffsetDays = 0;

    for (let i = 1; i <= 36; i++) {
        let weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + (i - 1) * 7 + totalOffsetDays);
        let weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        let dStart = String(weekStart.getDate()).padStart(2, '0') + "." + String(weekStart.getMonth() + 1).padStart(2, '0');
        let dEnd = String(weekEnd.getDate()).padStart(2, '0') + "." + String(weekEnd.getMonth() + 1).padStart(2, '0');
        
        let isCurrentWeek = (today >= weekStart && today <= weekEnd);
        let activeClass = isCurrentWeek ? 'is-current-week' : '';
        
        // DİKKAT: updateLevelPlanText fonksiyonunu çağırıyoruz
        let weekHtml = `
            <div class="plan-card ${activeClass}">
                <div class="week-info">
                    <div class="week-number">${i}</div>
                    <span class="date-start">${dStart}</span>
                    <span class="date-end">${dEnd}</span>
                </div>
                <div class="gain-input-area">
                    <textarea onchange="updateLevelPlanText(${i}, this.value)" 
                        placeholder="Bu seviye için ortak kazanım...">${level.planText[i] || ''}</textarea>
                </div>
                <div class="check-container">
                    ${cls ? `<input type="checkbox" ${cls.planStatus[i] ? 'checked' : ''} onchange="togglePlanStatus(${i}, this.checked)">` : ''}
                </div>
            </div>`;

        let targetColumn = (i <= 18) ? p1 : p2;
        targetColumn.innerHTML += weekHtml;

        if (longBreaks[i]) {
            totalOffsetDays += (longBreaks[i].weeks * 7);
            targetColumn.innerHTML += `
                <div class="holiday-separator">
                    <div class="holiday-content">
                        <span class="holiday-icon">🚩</span>
                        <span class="holiday-title">${longBreaks[i].name}</span>
                        <span class="holiday-dates">(${longBreaks[i].range})</span>
                    </div>
                </div>`;
        }
    }
}
function updateLevelPlanText(weekIndex, value) {
    if (curLId === null || !data.levels[curLId]) return;
    
    // Veriyi seviye (level) altına kaydediyoruz
    data.levels[curLId].planText[weekIndex] = value;
    
    // LocalStorage veya Database kaydını burada tetikleyin
    save(); 
}



function togglePlanStatus(week, status) {
    let cls = data.levels[curLId].classes[curCId];
    if(!cls.planStatus) cls.planStatus = {};
    cls.planStatus[week] = status;
    save();
}

function updatePlanText(week, text) {
    let cls = data.levels[curLId].classes[curCId];
    if(!cls.planText) cls.planText = {};
    cls.planText[week] = text;
    save();
}

// Benzersiz 6 haneli kod üretme fonksiyonu
function generateStudentCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Okunurluk için 0, O, 1, I hariç
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function showTab(tabIndex) {
    // 1. Tüm sekmelerin 'active' sınıfını kaldır
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // 2. Tüm panellerin 'active' sınıfını kaldır
    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(panel => panel.classList.remove('active'));

    // 3. Tıklanan sekmeyi aktif yap
    if (tabs[tabIndex - 1]) {
        tabs[tabIndex - 1].classList.add('active');
    }

    // 4. İlgili paneli göster
    const activePanel = document.getElementById('tab' + tabIndex);
    if (activePanel) {
        activePanel.classList.add('active');
        
        // Eğer Görev Gönder sekmesi (9) açıldıysa listeyi yükle
        if (tabIndex === 9) {
            renderMissions();
        }
    }
}

// 10 Adet Arapça Ödev Başlığı
const arabicMissions = [
    "Harflerin Yazılış Pratiği", "Tanışma Diyaloğu Ezberi", "Sayılar (1-20) Çalışması",
    "Mutfak Gereçleri Eşleştirme", "Saatler ve Zaman Kavramı", "Vücudun Bölümleri Testi",
    "Günlük Rutin Yazma", "Aile Bireyleri Tanıtımı", "Mevsimler ve Hava Durumu", "Meslekler Görsel Seti"
];

let activePatchIdx = null;

function renderMissions() {
    const container = document.getElementById('mission-list');
    const stuList = document.getElementById('m-student-list');
    if (!container) return;
    container.innerHTML = '';

    // Öğrenci listesini güncelle (Tekil öğrenci seçimi için)
    if (curLId && curCId && data.levels[curLId].classes[curCId]) {
        stuList.innerHTML = data.levels[curLId].classes[curCId].students.map((s, i) => 
            `<option value="${i}">${s.name}</option>`
        ).join('');
    }

    // 10 Başlığı Döngüyle Oluştur
    arabicMissions.forEach((title, i) => {
        const patchKey = `mission_patch_${i}`;
        const hasPatch = (localStorage.getItem(patchKey) || "").length > 0;
        
        const card = document.createElement('div');
        card.className = 'mission-card'; // CSS'teki mission-card stilini kullanır
        card.style.padding = '15px';
        card.style.position = 'relative';

        card.innerHTML = `
            <h4 class="marhey-text" style="font-size:1rem; margin-bottom:5px;">${title}</h4>
            <p style="font-size:0.75rem; color:${hasPatch ? '#27ae60' : '#7f8c8d'}; margin-bottom:10px;">
                ${hasPatch ? '✅ Yama Hazır' : '📝 Yama Bekliyor'}
            </p>
            <div style="display:flex; gap:5px;">
                <button onclick="openPatchModal(${i})" class="tool-btn btn-reset" style="flex:1; padding:5px; font-size:11px;">🛠️ Yama</button>
                <button onclick="sendMissionFinal(${i}, '${title}')" class="tool-btn btn-start" style="flex:1.5; padding:5px; font-size:11px;">📤 Gönder</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function toggleMTarget() {
    const type = document.getElementById('m-target-type').value;
    document.getElementById('m-student-select-wrap').style.display = (type === 'student') ? 'block' : 'none';
}

function sendMissionFinal(idx, title) {
    // 1. Arayüzdeki form verilerini al
    const deadline = document.getElementById('m-deadline').value;
    const duration = document.getElementById('m-duration').value;
    const target = document.getElementById('m-target-type').value;
    // Yerel hafızadaki yama (kod) bilgisini al
    const patch = localStorage.getItem(`mission_patch_${idx}`) || "";

    // 2. Güvenlik kontrolü
    if (!deadline) {
        alert("Lütfen son teslim tarihini seçin!");
        return;
    }

    // 3. Görev objesini oluştur (Paketle)
    const newMission = {
        id: Date.now(), // Takip için benzersiz ID
        title: title,
        deadline: deadline,
        duration: duration || "Belirtilmedi",
        target: target,
        patchCode: patch,
        status: "Bekliyor", // Başlangıç durumu
        sentDate: new Date().toLocaleDateString('tr-TR')
    };

    // 4. Hedef kitleye göre veriyi dağıt (Adrese teslim)
    if (target === 'student') {
        // Sadece seçilen tek bir öğrenciye gönder
        const sIdx = document.getElementById('m-student-list').value;
        let stu = data.levels[curLId].classes[curCId].students[sIdx];
        
        if (!stu.personalMissions) stu.personalMissions = [];
        stu.personalMissions.push(newMission);
        
    } else if (target === 'class') {
        // Mevcut sınıftaki TÜM öğrencilere tek tek ekle
        let students = data.levels[curLId].classes[curCId].students;
        students.forEach(stu => {
            if (!stu.personalMissions) stu.personalMissions = [];
            stu.personalMissions.push({...newMission}); // Her öğrenciye kopyasını gönder
        });
        
    } else if (target === 'level') {
        // Bu seviyedeki (Örn: tüm 9'lar) tüm sınıfların tüm öğrencilerine gönder
        let allOpenClasses = data.levels[curLId].classes;
        for (let classId in allOpenClasses) {
            allOpenClasses[classId].students.forEach(stu => {
                if (!stu.personalMissions) stu.personalMissions = [];
                stu.personalMissions.push({...newMission});
            });
        }
    }

    // 5. Değişiklikleri hem Local'e hem Firebase'e kaydet
    save(); 
    
    // 6. Başarı mesajı ve tabloyu güncelleme (varsa)
    alert(`"${title}" görevi başarıyla kodlandı ve hedeflere gönderildi!`);
    
    // Eğer varsa gönderilenler tablosunu tazele
    if (typeof updateSentMissionsTable === "function") {
        updateSentMissionsTable();
    }
}

function generateUniqueCode(prefix = "TCH") {
    const numbers = Math.floor(1000 + Math.random() * 9000); // 4 haneli rastgele sayı
    return `${prefix}-${numbers}`;
}

// Yama (Patch) İşlemleri
function openPatchModal(idx) {
    activePatchIdx = idx;
    const savedPatch = localStorage.getItem(`mission_patch_${idx}`) || "";
    document.getElementById('patchCodeInput').value = savedPatch;
    document.getElementById('patchTitle').innerText = arabicMissions[idx] + " Yaması";
    document.getElementById('patchModal').style.display = 'block';
}

function closePatchModal() {
    document.getElementById('patchModal').style.display = 'none';
}

function savePatch() {
    const code = document.getElementById('patchCodeInput').value;
    localStorage.setItem(`mission_patch_${activePatchIdx}`, code);
    closePatchModal();
    renderMissions(); // Görünümü tazele
}
// Eski switchTab ve showTab fonksiyonlarını SİLİP bunu yapıştırın
function switchTab(idx) {
    // 1. Tüm butonlardan ve panellerden 'active' sınıfını kaldır
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    // 2. Tıklanan butonu aktif yap
    if (tabs[idx]) {
        tabs[idx].classList.add('active');
    }

    // 3. Butonun onclick içindeki ID'yi bul veya index ile eşleştir
    // HTML'deki sıranıza göre manuel eşleştirme (Kaymayı önleyen kesin çözüm):
    let panelId = "";
    switch(idx) {
        case 0: panelId = "tab0"; break; // Öğrenciler
        case 1: panelId = "tab1"; break; // Performans
        case 2: panelId = "tab2"; break; // Sınavlar
        case 3: panelId = "tab3"; break; // Genel Sonuç
        case 4: panelId = "tab4"; break; // Kurayla Seç
        case 5: panelId = "tab9"; break; // Görev Gönder (Sıralamadaki yeri 5)
        case 6: panelId = "tab5"; break; // Geri Sayım
        case 7: panelId = "tab6"; break; // Kronometre
        case 8: panelId = "tab7"; break; // Takım Oluştur
        case 9: panelId = "tab8"; break; // Haftalık Plan
    }

    const targetPanel = document.getElementById(panelId);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }

    // 4. Veri render işlemlerini tetikle
    if(panelId === 'tab0') renderStudents();
    if(panelId === 'tab1') renderGrades('hw');
    if(panelId === 'tab2') renderGrades('ex');
    if(panelId === 'tab3') renderResults();
    if(panelId === 'tab4') renderActivityStatus();
    if(panelId === 'tab8') renderPlan();
    if(panelId === 'tab9') renderMissions(); // Görevler listesini yükle
}


function selectClass(lId, cId, element) {
    if (!data || !data.levels[lId]) return;

    // 1. Önce sidebar'daki TÜM sınıflardan aktiflik sınıfını temizle
    document.querySelectorAll('.class-item').forEach(item => {
        item.classList.remove('active-class');
    });

    // 2. Eğer bir HTML elementi (tıklanan link) gelmişse, onun kapsayıcısına vurgu ekle
    if (element) {
        const parentItem = element.closest('.class-item');
        if (parentItem) parentItem.classList.add('active-class');
    } else {
        // Eğer element gelmemişse (otomatik seçim durumunda), DOM üzerinden bulmaya çalış
        const allLinks = document.querySelectorAll('.class-link');
        allLinks.forEach(link => {
            // Linkin içindeki onclick metni kontrol ederek doğru sınıfı bul
            if (link.getAttribute('onclick').includes(`'${cId}'`)) {
                link.closest('.class-item').classList.add('active-class');
            }
        });
    }

    // --- Mevcut seçim mantığınız (başlık güncelleme, tablo çizme vb.) ---
    const viewTitle = document.getElementById('viewTitle');
    const content = document.getElementById('content');
    if (content) content.style.display = 'block';
    var _h=document.getElementById('ll-select-hint'); if(_h) _h.style.display='none';
    var _t=document.querySelector('#content .tabs'); if(_t) _t.style.display='';

    curLId = lId; 
    curCId = cId;
    
    if (viewTitle) {
    const className = data.levels[lId].classes[cId].name;
    // Yazı boyutunu 2.5rem (yaklaşık 40px) yaparak çok daha büyük bir başlık oluşturduk
    viewTitle.innerHTML = `<span id="active-class-title" style="font-size: 2.5rem; display: block;">${className}</span>`;
}

    switchTab(0); 
    renderStudents();
    renderActivityButtons();

    // Kaldığımız yer bilgisini yükle
    const stayedPoint = document.getElementById('stayedPoint');
    if (stayedPoint) {
        stayedPoint.value = data.levels[lId].classes[cId].stayedPoint || "";
    }
}


// Kaldığımız yer bilgisini kaydetme fonksiyonu
function updateStayedPoint(val) {
    // Güvenlik: Sadece bir sınıf seçiliyse ve veri yapısı hazırsa kaydet
    if (curLId && curCId && data.levels[curLId] && data.levels[curLId].classes[curCId]) {
        data.levels[curLId].classes[curCId].stayedPoint = val;
        console.log("Kaldığımız yer kaydedildi: " + val);
        save(); // Veriyi yerel ve bulut hafızaya gönder
    } else {
        console.warn("Hata: Veri kaydedilecek sınıf seçili değil!");
    }
}

// renderPlan fonksiyonunu da güncellemek gerekebilir (daha önce eklemediysen)
function updateActivityTable() {
    const table = document.getElementById('activityStatusTable');
    if (!table) return;
    table.innerHTML = '';

    const header = table.insertRow();
    ['Etkinlik', 'Seçilen Öğrenciler'].forEach(text => {
        const th = document.createElement('th');
        th.innerText = text;
        header.appendChild(th);
    });

    for (const activity in activityPools) {
        const row = table.insertRow();
        row.insertCell(0).innerText = activity;
        const td = row.insertCell(1);

        activityPools[activity].forEach(name => {
            const box = document.createElement('div');
            
            // CSS'in çalışması için bu sınıfı mutlaka ekliyoruz
            box.classList.add('student-box');
            
            box.style.backgroundColor = getActivityColor(activity);
            box.style.padding = '5px 12px';
            box.style.borderRadius = '4px';
            box.style.color = 'white';
            box.style.display = 'inline-block';
            box.style.margin = '3px';
            box.style.position = 'relative'; 
            box.style.cursor = 'pointer';
            box.innerText = name;

            // Silme işlemi
            box.onclick = function() {
                if (confirm(name + " kaydını silmek istiyor musunuz?")) {
                    const index = activityPools[activity].indexOf(name);
                    if (index > -1) {
                        activityPools[activity].splice(index, 1);
                        if (typeof saveData === "function") saveData(); 
                        updateActivityTable(); 
                    }
                }
            };

            td.appendChild(box);
        });
    }
}
function modalAc() {
    var m=document.getElementById('login-modal'); if(m) m.style.display='flex';
}


// Modalın dışına tıklanarak kapanmasını engelleyen yapı
window.onclick = function(event) {
    let modal = document.getElementById("login-modal");
    // Bu kısmı boş bırakıyoruz veya dış tıklama kontrolünü siliyoruz.
    // Böylece sadece modalKapat() fonksiyonu tetiklendiğinde kapanacaktır.
}

function modalKapat() {
    var m=document.getElementById('login-modal'); if(m) m.style.display='none';
}

async function login() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const hata = document.getElementById('hata-mesaji');

    if(email === "" || pass === "") {
        hata.innerText = "Lütfen tüm alanları doldurun.";
        hata.style.display = "block";
        return;
    }

    // Firebase entegrasyonu yapıldığında burası güncellenecek
    // Şimdilik simülasyon yapalım:
    if(email && pass) {
        alert("Giriş başarılı! Verileriniz senkronize ediliyor...");
        modalKapat();
        document.getElementById('login-nav-btn').innerText = "✅ " + email;
        // document.getElementById('main-app').style.display = 'block';
    }
}

   // --- TEMEL VERİ YAPILARI ---
let data;

// Veriyi tazelemek için bu fonksiyonu kullanacağız
function loadDataFromLocal() {
    const localData = localStorage.getItem('schoolData');
    if (localData) {
        data = JSON.parse(localData);
        if (!data.levels) data.levels = {};
        console.log("Veriler hafızadan yüklendi.");
    }
    return localData;
}

// Sayfa ilk açıldığında kontrol et
const ilkKontrol = loadDataFromLocal();

// Eğer tarayıcıda kayıtlı veri yoksa örnekleri oluştur
if (!ilkKontrol) {
    let varsayilanVeri = { levels: {}, levelOrder: [] };
    for (let i = 1; i <= 3; i++) {
        let lId = 'L' + i;
        varsayilanVeri.levelOrder.push(lId);
        varsayilanVeri.levels[lId] = {
            name: i + ". Seviye",
            classes: {},
            config: { 
                hw: [{n: '1. Ödev', w: 25}, {n: '2. Ödev', w: 25}, {n: '3. Ödev', w: 25}, {n: '4. Ödev', w: 25}], 
                ex: [{n: 'Dinleme', w: 25}, {n: 'Konuşma', w: 25}, {n: 'Yazılı', w: 50}] 
            }
        };

        ['A', 'B', 'C'].forEach(letter => {
            let cId = 'C' + i + letter;
            let students = [];
            for (let s = 1; s <= 10; s++) {
                students.push({
                    name: i + "-" + letter + " Öğrencisi " + s,
                    hw: [0, 0, 0, 0], ex: [0, 0, 0], history: [],
                    skills: { 'Konuşma': 5, 'Yazma': 5, 'Okuma': 5, 'Vezin': 5, 'Sözlük': 5, 'Tercüme': 5 },
                    notes: ""
                });
            }
            varsayilanVeri.levels[lId].classes[cId] = {
                name: i + "-" + letter + " Şubesi",
                students: students,
                planStatus: {}, planText: {}, stayedPoint: ""
            };
        });
    }
    localStorage.setItem('schoolData', JSON.stringify(varsayilanVeri));
    data = varsayilanVeri;
}

// Global Değişkenler
let curLId = null, curCId = null;
let pools = {}; 
let alertCallback = null;
let audioCtx = null;

function openTatiller() {
    const modal = document.getElementById('tatilModal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        console.error("Tatil modalı HTML içinde bulunamadı!");
    }
}

    // --- SES SİSTEMİ ---
    function initAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    function playBeep(freq = 523, dur = 200) {
        initAudio();
        if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        setTimeout(() => osc.stop(), dur);
    }

    // --- UYARI SİSTEMİ ---
    function showConfirm(title, text, icon, callback) {
        document.getElementById('alertTitle').innerText = title;
        document.getElementById('alertText').innerText = text;
        document.getElementById('alertIcon').innerText = icon;
        document.getElementById('customAlertModal').style.display = 'flex';
        alertCallback = callback;
    }
    function closeAlert(result) {
        document.getElementById('customAlertModal').style.display = 'none';
        if(result && alertCallback) alertCallback();
    }

    // --- VERİ YÖNETİMİ ---
// save() fonksiyonunu şu şekilde güncelleyin
function save() {
    // 1. Önce bilgisayara (Local) kaydet
    localStorage.setItem('schoolData', JSON.stringify(data));
    renderSidebar();

    // 2. Eğer giriş yapılmışsa buluta (Firebase) gönder
    const user = firebase.auth().currentUser;
    if (user) {
        db.collection("kullanicilar").doc(user.uid).set({
            userData: JSON.stringify(data),
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true })
        .then(() => console.log("Bulutla eşleşti ✅"))
        .catch((error) => console.error("Bulut kayıt hatası:", error));
    }
}

function addLevel() {
    let name = prompt("Yeni Seviye Adı (Örn: 10. Sınıflar):");
    if(name) {
        let id = 'L' + Date.now();
        data.levels[id] = { 
            name: name, 
            classes: {}, 
            planText: {},
            config: { 
                // Yeni seviyede otomatik 4 ödev %25
                hw: [
                    {n: '1. Ödev', w: 25}, {n: '2. Ödev', w: 25}, 
                    {n: '3. Ödev', w: 25}, {n: '4. Ödev', w: 25}
                ], 
                // Yeni seviyede otomatik Sınav Ağırlıkları
                ex: [
                    {n: 'Dinleme', w: 25}, 
                    {n: 'Konuşma', w: 25}, 
                    {n: 'Yazılı', w: 50}
                ] 
            } 
        };
        if(!data.levelOrder) data.levelOrder = [];
        data.levelOrder.push(id);
        save();
    }
}

    function addClass(lId) {
        let name = prompt("Yeni Sınıf Adı (Örn: 10A):");
        if(name && data.levels[lId]) {
            let id = 'C' + Date.now();
            if(!data.levels[lId].classes) data.levels[lId].classes = {};
            data.levels[lId].classes[id] = { name: name, students: [] };
            save();
        }
    }
    
    // Silme ve Düzenleme Fonksiyonları
    function editLevelName(lId) {
        let n = prompt("Yeni İsim:", data.levels[lId].name);
        if(n) { data.levels[lId].name = n; save(); }
    }
    function deleteLevel(lId) {
        if(confirm("Seviyeyi ve tüm sınıfları silmek istiyor musunuz?")) {
            delete data.levels[lId];
            data.levelOrder = data.levelOrder.filter(id => id !== lId);
            if(curLId === lId) document.getElementById('content').style.display='none';
            save();
        }
    }
    function editClassName(lId, cId) {
        let n = prompt("Yeni İsim:", data.levels[lId].classes[cId].name);
        if(n) { data.levels[lId].classes[cId].name = n; save(); }
    }
    function deleteClass(lId, cId) {
        if(confirm("Sınıfı silmek istiyor musunuz?")) {
            delete data.levels[lId].classes[cId];
            if(curCId === cId) document.getElementById('content').style.display='none';
            save();
        }
    }

function renderSidebar() {
    const nav = document.getElementById('levelNav');
    if (!nav) return; // Nav elementi yoksa çık
    nav.innerHTML = '';

    // KRİTİK HATA KORUMASI: data veya data.levels tanımsızsa fonksiyonu durdur
    if (!data || !data.levels) {
        console.warn("Sidebar render edilemedi: Veri henüz hazır değil.");
        return; 
    }

    // --- 1. ÖĞRETMEN KODU GÖSTERİMİ (YENİ) ---
    const staticCode = localStorage.getItem('teacher_static_code');
    if (staticCode) {
        let codeHtml = `
        <div class="teacher-code-area" style="
            background: rgba(255, 255, 255, 0.05);
            border: 1px dashed rgba(255, 255, 255, 0.5);
            margin: 0 5px 15px 5px;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
        ">
            <div style="font-size: 0.7rem; color: rgba(255,255,255,0.9); text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Öğretmen Kodu</div>
            <div style="font-size: 1.1rem; color: #fff; font-family: 'Nunito', sans-serif; font-weight: 700; margin-top: 3px;">
                ${staticCode}
            </div>
        </div>`;
        nav.innerHTML += codeHtml;
    }

    // --- 2. SEVİYE VE SINIF LİSTESİ ---
    let levelIds = data.levelOrder || Object.keys(data.levels);
    
    levelIds.forEach(lId => {
        let lvl = data.levels[lId];
        if(!lvl) return;
        
        let html = `
        <div class="level-container" draggable="true" data-id="${lId}" ondragstart="drag(event)" ondragover="allowDrop(event)" ondrop="drop(event)">
            <div class="level-head">
                <span onclick="handleLevelNameClick('${lId}', this)" title="Tek tik: ac/kapa · Cift tik: ismi degistir" style="cursor:pointer; flex:1; font-weight:bold;">📁 ${lvl.name}</span>
                <div class="level-actions">
                    <button onclick="openLvlConfig('${lId}')">⚙️</button>
                    <button onclick="editLevelName('${lId}')">✏️</button>
                    <button onclick="deleteLevel('${lId}')">🗑️</button>
                    <button onclick="addClass('${lId}')" title="Sınıf Ekle" style="color:#ffffff;">+</button>
                </div>
            </div>
            <div class="class-list" id="list-${lId}">`;
        
        if (lvl.classes) {
            for(let cId in lvl.classes) {
                html += `
                <div class="class-item">
                    <a class="class-link" onclick="selectClass('${lId}','${cId}')">📂 ${lvl.classes[cId].name}</a>
                    <div class="class-actions">
                        <button onclick="editClassName('${lId}','${cId}')">✏️</button>
                        <button onclick="deleteClass('${lId}','${cId}')">🗑️</button>
                    </div>
                </div>`;
            }
        }
        
        html += `</div></div>`;
        nav.innerHTML += html;
    });
}
// Sidebar çizildikten sonra ilk sınıfı otomatik seçen fonksiyon
function selectFirstClassAutomatically() {
    // 1. İlk seviye konteynerini bul
    const firstLevel = document.querySelector('.level-container');
    if (!firstLevel) return;

    // 2. İlk seviyenin altındaki sınıf listesini (class-list) görünür yap
    const firstClassList = firstLevel.querySelector('.class-list');
    if (firstClassList) {
        firstClassList.classList.add('active');
    }

    // 3. İlk sınıfın linkini (class-link) bul ve ona tıkla
    const firstClassLink = firstLevel.querySelector('.class-link');
    if (firstClassLink) {
        firstClassLink.click();
    }
}

// Mevcut class seçme fonksiyonunuzu (muhtemelen showClass gibi bir isimdedir) 
// aktiflik sınıfını ekleyecek şekilde güncelleyin:
function updateActiveClassUI(clickedElement) {
    // Önce tüm aktif sınıfları temizle
    document.querySelectorAll('.class-item').forEach(item => {
        item.classList.remove('active-class');
    });
    
    // Tıklanan elemanın kapsayıcısına (class-item) aktiflik sınıfı ekle
    const classItem = clickedElement.closest('.class-item');
    if (classItem) {
        classItem.classList.add('active-class');
    }
}

let currentRole = 'teacher';
let llIsLoginMode = true;

function llSetRole(role) {
    currentRole = role;
    llIsLoginMode = true; 
    
    // UI Güncelleme: Butonların aktiflik durumunu değiştir
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active-role'));
    
    // HTML'deki buton ID'sine göre seçim
    const targetBtn = document.getElementById(role === 'student' ? 'btn-student' : 'btn-teacher');
    if(targetBtn) targetBtn.classList.add('active-role');
    
    const footer = document.getElementById('auth-footer-links');
    const passGroup = document.getElementById('password-main-group');
    const rePassGroup = document.getElementById('re-password-group');
    const primaryLabel = document.getElementById('primary-label');
    const actionBtn = document.getElementById('auth-action-btn');
    const authTitle = document.getElementById('auth-title');
    const guestArea = document.getElementById('guest-access-area');

    // Başlangıç ayarları
    if(rePassGroup) rePassGroup.style.display = 'none';
    actionBtn.innerText = "Giriş Yap";

    if (role === 'student') {
        authTitle.innerText = "Öğrenci Dünyası Girişi";
        primaryLabel.innerText = "Öğrenci Kodun";
        if(passGroup) passGroup.style.display = 'none';
        if(footer) footer.style.display = 'none';
        if(guestArea) guestArea.style.display = 'none';
        actionBtn.innerText = "Derslere Başla";
    } else {
        authTitle.innerText = "Öğretmen Yönetim Paneli";
        primaryLabel.innerText = "E-posta Adresi";
        if(passGroup) passGroup.style.display = 'flex';
        if(footer) footer.style.display = 'block';
        if(guestArea) guestArea.style.display = 'block';
        actionBtn.innerText = "Sisteme Gir";
    }
}

// Birden fazla öğretmen karmaşasını önlemek için veri çekme mantığı (Firebase Örneği)
function getMyData() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    if (currentRole === 'teacher') {
        // Sadece bu öğretmene (UID) ait sınıfları getir
        return db.collection("classes").where("ogretmenId", "==", user.uid);
    } else if (currentRole === 'parent') {
        // Velinin eşleştiği öğrenciyi ve o öğrencinin öğretmeninin ödevlerini getir
        // Veri yapısında: { veliUid: "...", ogrenciId: "...", ogretmenId: "..." }
        return db.collection("homeworks").where("targetOgrenciId", "==", myChildId);
    }
}

// llAuthIslemi() fonksiyonunuzun en başına currentRole kontrolü eklemeyi unutmayın
// Örn: localStorage.setItem('user_role', currentRole);
let curNoteStuIdx = null;

function openNoteModal(idx) {
    curNoteStuIdx = idx;
    let s = data.levels[curLId].classes[curCId].students[idx];
    
    // Başlık ve içeriği doldur
    const titleEl = document.getElementById('noteModalTitle');
    if (titleEl) {
        titleEl.style.fontSize = "1.5rem"; // Başlığı büyüt
        titleEl.innerText = "📝 " + s.name;
    }
    
    const textarea = document.getElementById('studentNoteText');
    if (textarea) {
        textarea.value = s.notes || "";
        textarea.placeholder = "Öğrenciye dair özel notlarınızı buraya büyük ve okunaklı şekilde yazabilirsiniz...";
    }
    
    document.getElementById('noteModal').style.display = 'flex';
}
function closeNoteModal() {
    let note = document.getElementById('studentNoteText').value;
    data.levels[curLId].classes[curCId].students[curNoteStuIdx].notes = note;
    save();
    document.getElementById('noteModal').style.display = 'none';
}

    function toggleClasses(lId) {
    const targetList = document.getElementById(`list-${lId}`);
    
    // Tıklanan listenin şu anki durumunu kontrol et (Açık mı kapalı mı?)
    const isAlreadyOpen = targetList.style.display === "block";

    // 1. Önce sayfadaki TÜM sınıf listelerini kapat
    document.querySelectorAll('.class-list').forEach(el => {
        el.style.display = 'none';
    });

    // 2. Eğer tıkladığımız liste önceden kapalıysa, şimdi aç
    // (Eğer zaten açıksa, yukarıdaki kodla kapandı ve öyle kalacak)
    if (!isAlreadyOpen) {
        targetList.style.display = "block";
    }
    if(typeof syncLevelActions==='function') syncLevelActions();
}

    // --- SÜRÜKLE BIRAK (SEVİYE SIRALAMA) ---
    function allowDrop(ev) { ev.preventDefault(); }
    function drag(ev) { ev.dataTransfer.setData("text", ev.target.getAttribute('data-id')); }
    function drop(ev) {
        ev.preventDefault();
        let draggedId = ev.dataTransfer.getData("text");
        let targetId = ev.target.closest('.level-container').getAttribute('data-id');
        if(draggedId === targetId) return;
        
        let order = data.levelOrder;
        order.splice(order.indexOf(draggedId), 1);
        order.splice(order.indexOf(targetId), 0, draggedId);
        data.levelOrder = order;
        save();
    }

function renderStudents() {
    if (!curLId || !curCId || !data.levels[curLId] || !data.levels[curLId].classes[curCId]) return;
    
    let students = data.levels[curLId].classes[curCId].students || [];
    let table = document.getElementById('stuTable');
    if (!table) return;
    
    table.innerHTML = `
        <thead>
            <tr>
                <th width="50">#</th>
                <th style="text-align:left; padding-left:15px;">Öğrenci Adı</th>
                <th width="140" style="text-align:center;">Giriş Kodu</th>
                <th width="160" style="text-align:center;">İşlemler</th>
                <th width="80" style="text-align:center;">Sil</th>
            </tr>
        </thead>
        <tbody id="stuTableBody"></tbody>`;
    
    const tableBody = document.getElementById('stuTableBody');

    students.forEach((s, i) => {
        let row = tableBody.insertRow();
        
        row.setAttribute('draggable', 'true');
        row.ondragstart = (e) => e.dataTransfer.setData("text/plain", i);
        row.ondragover = (e) => e.preventDefault();
        row.ondrop = (e) => {
            e.preventDefault();
            let from = parseInt(e.dataTransfer.getData("text/plain"));
            let moved = students.splice(from, 1)[0];
            students.splice(i, 0, moved);
            save(); renderStudents();
        };

        row.innerHTML = `
            <td style="text-align:center; font-weight:bold; font-size:1.2rem;">${i + 1}</td>
            <td>
                <input type="text" value="${s.name || ''}" 
                       onchange="updateStudentName(${i}, this.value)" 
                       class="student-name-input"
                       placeholder="Öğrenci Adı">
            </td>
            <td style="text-align:center;">
                <code class="secure-code" 
                      onclick="this.classList.toggle('revealed')" 
                      title="Görmek için tıklayın"
                      style="background:#eee; color:#eee; padding:6px 12px; border-radius:8px; cursor:pointer; font-family:monospace; user-select:none; transition:0.3s; display:inline-block; min-width:100px; font-weight:bold;">
                    ${s.loginCode || '---'}
                </code>
            </td>
            <td>
                <div class="action-cell">
                    <button class="big-action-btn" onclick="openNoteModal(${i})" title="Özel Notlar">📝</button>
                    <button class="big-action-btn" onclick="openSkillModal(${i})" title="Beceriler">📊</button>
                </div>
            </td>
            <td>
                <div class="action-cell">
                    <button class="big-action-btn delete-btn" onclick="deleteStu(${i})" title="Sil">🗑️</button>
                </div>
            </td>
        `;
    });
}

function addSingleStudent() {
    let val = document.getElementById('singleStuName').value.trim();
    
    // Öğretmenin sabit kodunu alıyoruz (Örn: TCH-4582)
    const teacherCode = localStorage.getItem('teacher_static_code') || "TCH";

    if (val) {
        const currentClass = data.levels[curLId].classes[curCId];
        
        // --- GÜVENLİK GÜNCELLEMESİ: Rastgele Karma Kod Üretimi ---
        // Okunabilirliği artırmak için benzer karakterleri (0, O, 1, I, L) hariç tuttuk
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
        let secureHash = '';
        for (let i = 0; i < 4; i++) {
            secureHash += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        // Yeni format: ÖğretmenKodu-RastgeleKod (Örn: TCH-4582-X8B2)
        const sCode = `${teacherCode}-${secureHash}`; 

        // Yeni öğrenci objesini oluştur
        const newStudent = { 
            name: val, 
            loginCode: sCode.toUpperCase(), 
            hw: [], 
            ex: [], 
            history: [], 
            personalMissions: [], 
            skills: { 'Konuşma': 5, 'Yazma': 5, 'Okuma': 5, 'Vezin': 5, 'Sözlük': 5, 'Tercüme': 5 },
            notes: ""
        };

        currentClass.students.push(newStudent);

        // Giriş kutusunu temizle
        document.getElementById('singleStuName').value = "";
        
        // Veriyi kaydet ve listeyi yenile
        save(); 
        renderStudents();
        
        console.log(`Güvenli Kod Oluşturuldu: ${val} -> ${sCode}`);
    } else {
        alert("Lütfen öğrenci adı giriniz!");
    }
}

function updateStudentName(i, val) {
    if (val.trim()) { 
        data.levels[curLId].classes[curCId].students[i].name = val.trim(); 
        save(); 
    }
}

function deleteStu(i) {
    showConfirm("Öğrenci Sil", "Bu öğrenciyi silmek istediğinize emin misiniz?", "🗑️", () => {
        data.levels[curLId].classes[curCId].students.splice(i, 1);
        save(); 
        renderStudents();
    });
}

// --- NOTLAR VE SONUÇLAR ---
function renderGrades(type) {
    let config = data.levels[curLId].config[type];
    let table = document.getElementById(type + 'Table');
    if (!table) return;
    
    // Tablo başlıklarını oluştur
    table.innerHTML = `<tr><th>Öğrenci</th>${config.map(c => `<th>${c.n} (%${c.w})</th>`).join('')} <th>Ağ. ORT</th></tr>`;
    
    data.levels[curLId].classes[curCId].students.forEach((s, si) => {
        let row = table.insertRow();
        row.insertCell().innerText = s.name;
        
        let weightedTotal = 0;
        
        config.forEach((c, ci) => {
            // Veri varsa al, yoksa 0 kabul et
            let val = (s[type] && s[type][ci]) ? parseFloat(s[type][ci]) : 0;
            let weight = parseFloat(c.w || 0) / 100;
            weightedTotal += (val * weight);
            
            row.insertCell().innerHTML = `
                <input type="number" 
                       value="${val}" 
                       onfocus="if(this.value=='0'){this.value='';} this.select();" 
                       onblur="if(this.value.trim()==''){this.value='0';}" 
                       onchange="updateGrade('${type}',${si},${ci},this.value)" 
                       style="width:60px; text-align:center; border-radius:4px; border:1px solid #ddd;">`;
        });
        
        // Ağırlıklı ortalamayı hücreye yaz
        let avgCell = row.insertCell();
        avgCell.style.fontWeight = "bold";
        avgCell.style.color = "var(--primary)";
        avgCell.innerText = weightedTotal.toFixed(2);
    });
}

    function updateGrade(t, si, ci, v) {
        let s = data.levels[curLId].classes[curCId].students[si];
        if(!s[t]) s[t] = [];
        s[t][ci] = v; save(); renderGrades(t);
    }


    // --- BECERİ (SKILLS) YÖNETİMİ ---
    const skillTypes = [
        {n: 'Konuşma', c: '#3498db'}, {n: 'Yazma', c: '#e74c3c'}, 
        {n: 'Okuma', c: '#2ecc71'}, {n: 'Vezin', c: '#f1c40f'}, 
        {n: 'Sözlük', c: '#9b59b6'}, {n: 'Tercüme', c: '#e67e22'}
    ];
    let curSkillStuIdx = null;

    function openSkillModal(idx) {
        curSkillStuIdx = idx;
        let s = data.levels[curLId].classes[curCId].students[idx];
        if(!s.skills) s.skills = {};
        document.getElementById('skillModalTitle').innerText = s.name + " - Beceriler";
        let c = document.getElementById('skillSliders');
        c.innerHTML = '';
        skillTypes.forEach(sk => {
            let val = s.skills[sk.n] || 1;
            c.innerHTML += `
                <div style="margin-bottom:15px;">
                    <div style="display:flex; justify-content:space-between;">
                        <span>${sk.n}</span><span style="color:${sk.c}; font-weight:bold;">${val}/10</span>
                    </div>
                    <input type="range" min="1" max="10" value="${val}" class="skill-slider"
                    style="background: linear-gradient(to right, ${sk.c} ${(val-1)*11.1}%, #e0e0e0 ${(val-1)*11.1}%);"
                    oninput="this.previousElementSibling.children[1].innerText=this.value+'/10'; this.style.background='linear-gradient(to right, ${sk.c} '+(this.value-1)*11.1+'%, #e0e0e0 '+(this.value-1)*11.1+'%)'; updateSkillVal('${sk.n}', this.value)">
                </div>`;
        });
        document.getElementById('skillModal').style.display = 'flex';
    }
    
    function updateSkillVal(n, v) {
        data.levels[curLId].classes[curCId].students[curSkillStuIdx].skills[n] = parseInt(v);
    }
    function closeSkillModal() { save(); document.getElementById('skillModal').style.display = 'none'; }

    // --- ETKİNLİK VE KURA ---
    function pick(type, color) {
        if(!curCId) return alert("Sınıf seçin!");
        let cls = data.levels[curLId].classes[curCId];
        if(!cls.students.length) return alert("Öğrenci yok!");

        if(!pools[type] || !pools[type].length) pools[type] = [...Array(cls.students.length).keys()];
        
        let disp = document.getElementById('luckyStudent');
        let count = 0;
        let int = setInterval(() => {
            disp.innerText = cls.students[Math.floor(Math.random()*cls.students.length)].name;
            if(++count > 20) {
                clearInterval(int);
                let pIdx = Math.floor(Math.random()*pools[type].length);
                let sIdx = pools[type].splice(pIdx, 1)[0];
                let stu = cls.students[sIdx];
                disp.innerText = stu.name;
                document.getElementById('activityType').innerText = "🎯 " + type;
                if(!stu.history) stu.history = [];
                stu.history.push(color);
                playBeep(880, 150);
                save(); renderActivityStatus();
            }
        }, 80);
    }

function renderActivityButtons() {
    const grid = document.querySelector('.activity-grid'); 
    if (!grid || !curLId || !data.levels[curLId]) return;

    let level = data.levels[curLId];
    
    // Eğer kura listesi boşsa (ilk kez açılıyorsa) varsayılanları kullan
    let kuraList = level.config.kura || [
        {n: 'Konuşma'}, {n: 'Yazma'}, {n: 'Okuma'},
        {n: 'Vezin'}, {n: 'Sözlük'}, {n: 'Tercüme'}
    ];

    grid.innerHTML = ''; 
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];

    kuraList.forEach((item, index) => {
        const color = colors[index % colors.length];
        const wrapper = document.createElement('div');
        wrapper.className = 'act-btn-wrapper';
        wrapper.style.width = "100%";
        
        wrapper.innerHTML = `
            <button class="act-btn" style="background:${color}; width:100%; min-height:95px; border-radius:12px; border:none; color:white; font-weight:bold; cursor:pointer; font-family:'Marhey', sans-serif; font-size:1.1rem;" 
                    onclick="pick('${item.n}', '${color}')">
                ${item.n}
            </button>
        `;
        grid.appendChild(wrapper);
    });
}


function addKuraRow(name = "") {
    const container = document.getElementById('lvlKuraList');
    const div = document.createElement('div');
    div.style = "margin-bottom:8px; display:flex; gap:5px;";
    div.innerHTML = `
        <input type="text" class="kura-n" value="${name}" placeholder="Kura Başlığı" style="flex:1; padding:8px; border:1px solid #ddd; border-radius:8px;">
        <button onclick="this.parentElement.remove()" style="background:var(--danger); color:white; border:none; border-radius:8px; padding:0 12px; cursor:pointer;">🗑️</button>
    `;
    container.appendChild(div);
}

    function renderActivityStatus() {
        if(!curCId) return;
        let table = document.getElementById('activityStatusTable');
        table.innerHTML = `<tr><th>Öğrenci</th><th>Geçmiş (Silmek için tıkla)</th><th>Havuz Durumu</th></tr>`;
        data.levels[curLId].classes[curCId].students.forEach((s, idx) => {
            let hist = (s.history||[]).map((c, hi) => `<span class="marker" style="background:${c}; cursor:pointer;" onclick="delHist(${idx},${hi})"></span>`).join('');
            let poolSt = skillTypes.map(st => {
                let exist = !pools[st.n] || pools[st.n].includes(idx);
                return `<span style="font-size:0.8em; color:${exist?'#2ecc71':'#e74c3c'}; ${!exist?'text-decoration:line-through':''}">● ${st.n}</span>`;
            }).join(' ');
            table.insertRow().innerHTML = `<td>${s.name}</td><td>${hist}</td><td>${poolSt}</td>`;
        });
    }

    function delHist(si, hi) {
        if(confirm("Silinsin mi?")) {
            data.levels[curLId].classes[curCId].students[si].history.splice(hi, 1);
            save(); renderActivityStatus();
        }
    }
    function resetPools() {
        if(confirm("Tüm geçmiş ve havuzlar sıfırlansın mı?")) {
            pools = {};
            data.levels[curLId].classes[curCId].students.forEach(s => s.history = []);
            save(); renderActivityStatus();
        }
    }

    // --- SEVİYE AYARLARI ---
// 1. Ayar Penceresini Açan Ana Fonksiyon
function openLvlConfig(lId) {
    curLId = lId; 
    const lvl = data.levels[lId];
    if (!lvl) return;

    const modal = document.getElementById('lvlModal');
    if (!modal) return;

    modal.style.display = 'block';

    // Modal içeriğini her açılışta sıfırdan ve düzenli bir yapıyla kuralım
    modal.innerHTML = `
        <h3 style="margin-top:0; color:var(--primary); font-family:'Marhey';">⚙️ Seviye Ayarları</h3>
        
        <div style="background: #e3f2fd; color: #1565c0; padding: 12px; border-radius: 10px; margin-bottom: 20px; font-size: 0.9rem; line-height: 1.4; border-left: 5px solid #1565c0; font-family: sans-serif;">
            <div style="font-weight: bold; margin-bottom: 3px;">📢 Kapsam Bilgilendirmesi:</div>
            Bu seviyede yapacağınız isim ve ağırlık (%) değişiklikleri, bu seviyeye bağlı <strong>tüm sınıflarda</strong> otomatik olarak güncellenir. Değişiklikler Ödev, Sınav ve Kura sekmelerinin tamamını etkiler.
        </div>
        
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px;">
                <h4 style="border-bottom: 2px solid var(--accent); color:var(--secondary);">Ödevler (Ağırlık %)</h4>
                <div id="lvlHwList"></div>
                <button class="btn-add" onclick="addConfigRow('hw')" style="width:100%; margin-top:10px;">+ Ödev Ekle</button>
            </div>
            <div style="flex: 1; min-width: 200px;">
                <h4 style="border-bottom: 2px solid var(--danger); color:var(--secondary);">Sınavlar (Ağırlık %)</h4>
                <div id="lvlExList"></div>
                <button class="btn-add" onclick="addConfigRow('ex')" style="width:100%; margin-top:10px; background:var(--secondary);">+ Sınav Ekle</button>
            </div>
        </div>

        <div style="margin-top:25px; border-top:2px solid #eee; padding-top:15px;">
            <h4 style="color:var(--accent); font-family:'Marhey'; margin-bottom:10px;">🎯 Kura Kategorileri</h4>
            <div id="lvlKuraList"></div>
            <button class="btn-add" onclick="addKuraRow()" style="width:100%; margin-top:10px; background:#2ecc71;">+ Yeni Kura Kutusu Ekle</button>
        </div>

        <div style="text-align: right; margin-top:30px; padding-top:15px; border-top:1px solid #eee; display: flex; align-items: center; justify-content: flex-end; gap: 15px;">
            <span style="font-size: 0.8rem; color: #7f8c8d; font-style: italic;">* Tüm sınıflar ve sekmeler güncellenecektir.</span>
            <button onclick="document.getElementById('lvlModal').style.display='none'" style="padding:10px 15px; cursor:pointer; border:none; background:#eee; border-radius:8px; font-weight:bold;">İptal</button>
            <button onclick="saveLvlConfig()" style="background:var(--success); color:white; border:none; padding:10px 25px; border-radius:8px; cursor:pointer; font-weight:bold;">Değişiklikleri Kaydet</button>
        </div>
    `;

    // 1. Veri Yapısı Kontrolü (Eğer yoksa varsayılanları ata)
    if (!lvl.config) lvl.config = {};
    if (!lvl.config.hw) lvl.config.hw = [{n: '1. Ödev', w: 25}, {n: '2. Ödev', w: 25}, {n: '3. Ödev', w: 25}, {n: '4. Ödev', w: 25}];
    if (!lvl.config.ex) lvl.config.ex = [{n: 'Dinleme', w: 25}, {n: 'Konuşma', w: 25}, {n: 'Yazılı', w: 50}];
    if (!lvl.config.kura) lvl.config.kura = [{n: 'Konuşma'}, {n: 'Yazma'}, {n: 'Okuma'}, {n: 'Vezin'}, {n: 'Sözlük'}, {n: 'Tercüme'}];

    // 2. Ödevleri yükle
    lvl.config.hw.forEach(item => addConfigRowWithData('hw', item.n, item.w));
    
    // 3. Sınavları yükle
    lvl.config.ex.forEach(item => addConfigRowWithData('ex', item.n, item.w));

    // 4. Kura başlıklarını yükle (Sınavdan bağımsız kendi dizisinden çeker)
    lvl.config.kura.forEach(item => {
        addKuraRowWithData(item.n); 
    });
}

// Yardımcı Fonksiyon: Kura satırını veriyle ekler
function addKuraRowWithData(name) {
    const kuraList = document.getElementById('lvlKuraList');
    if (!kuraList) return;
    const row = document.createElement('div');
    row.style = "margin-bottom:8px; display:flex; gap:5px;";
    row.innerHTML = `
        <input type="text" class="kura-n" value="${name}" placeholder="Kura Adı" style="flex:1; padding:8px; border:1px solid #ddd; border-radius:8px;">
        <button onclick="this.parentElement.remove()" style="background:var(--danger); color:white; border:none; border-radius:8px; padding:0 12px; cursor:pointer;">🗑️</button>
    `;
    kuraList.appendChild(row);
}


function addKuraRow() {
    addKuraRowWithData(""); // Boş satır ekler
}

// 2. Yeni Satır Ekleme (Manuel + butonu için)
function addConfigRow(t) {
    addConfigRowWithData(t, '', 0);
}

// 3. Veriyle Satır Oluşturma (Sistemin ihtiyaç duyduğu asıl parça)
function addConfigRowWithData(t, name, weight) {
    const container = document.getElementById(t === 'hw' ? 'lvlHwList' : 'lvlExList');
    if (!container) return;
    
    const div = document.createElement('div');
    div.style = "margin-bottom:8px; display:flex; gap:5px; align-items:center;";
    div.innerHTML = `
        <input type="text" class="${t}-n" value="${name}" placeholder="Ad" style="flex:2; padding:5px; border:1px solid #ddd; border-radius:4px;">
        <input type="number" class="${t}-w" value="${weight}" placeholder="%" style="flex:1; padding:5px; border:1px solid #ddd; border-radius:4px;">
        <button onclick="this.parentElement.remove()" style="background:var(--danger); color:white; border:none; border-radius:4px; padding:5px 8px; cursor:pointer;">✖</button>
    `;
    container.appendChild(div);
}

// 4. Kaydetme Fonksiyonu
function saveLvlConfig() {
    if (!curLId || !data.levels[curLId]) return;

    // 1. Ödevleri topla
    let newHw = [];
    document.querySelectorAll('.hw-n').forEach((el, i) => {
        let wInputs = document.querySelectorAll('.hw-w');
        let w = wInputs[i] ? wInputs[i].value : 0;
        if (el.value.trim() !== "") {
            newHw.push({ n: el.value.trim(), w: parseInt(w) || 0 });
        }
    });

    // 2. Sınavları topla (Sadece .ex-n ve .ex-w sınıfından alır)
    let newEx = [];
    document.querySelectorAll('.ex-n').forEach((el, i) => {
        let wInputs = document.querySelectorAll('.ex-w');
        let w = wInputs[i] ? wInputs[i].value : 0;
        if (el.value.trim() !== "") {
            newEx.push({ n: el.value.trim(), w: parseInt(w) || 0 });
        }
    });

    // 3. Kura Başlıklarını topla (Sadece .kura-n sınıfından alır)
    let newKura = [];
    document.querySelectorAll('.kura-n').forEach((el) => {
        if (el.value.trim() !== "") {
            newKura.push({ n: el.value.trim() }); // Kura için ağırlık gerekmez
        }
    });

    // Verileri birbirinden bağımsız dizilere mühürle
    data.levels[curLId].config.hw = newHw;
    data.levels[curLId].config.ex = newEx;
    data.levels[curLId].config.kura = newKura; // Yeni bağımsız kura dizisi

    save(); 

    // Arayüzü kapat ve güncelle
    document.getElementById('lvlModal').style.display = 'none';
    
    // Kura butonlarını sadece 'kura' dizisinden çizecek şekilde tetikle
    renderActivityButtons();

    if (curCId) {
        renderGrades('hw');
        renderGrades('ex');
        renderResults();
    }
    
    alert("Tüm ayarlar (Ödev, Sınav ve Kura) bağımsız olarak kaydedildi!");
}

function renderConfRows(t, items) {
    const id = (t === 'hw' ? 'lvlHwList' : 'lvlExList');
    const container = document.getElementById(id);
    
    if (!container) return; // Eğer modal henüz DOM'da tam oluşmadıysa hata verme.
    
    container.innerHTML = '';
    const list = items || [];
    
    list.forEach(item => {
        container.innerHTML += `
            <div style="margin-bottom:8px; display:flex; gap:5px; align-items:center;">
                <input type="text" class="${t}-n" value="${item.n}" style="flex:2; padding:5px; border:1px solid #ddd; border-radius:4px;">
                <input type="number" class="${t}-w" value="${item.w}" style="flex:1; padding:5px; border:1px solid #ddd; border-radius:4px;">
                <button onclick="this.parentElement.remove()" style="background:var(--danger); color:white; border:none; border-radius:4px; padding:5px 8px; cursor:pointer;">✖</button>
            </div>`;
    });
}


function addConfigRow(t) {
    const container = document.getElementById(t === 'hw' ? 'lvlHwList' : 'lvlExList');
    if (!container) return;
    
    const rowHtml = `
        <div style="margin-bottom:8px; display:flex; gap:5px; align-items:center;">
            <input type="text" class="${t}-n" placeholder="Yeni Ad..." style="flex:2; padding:5px; border:1px solid #ddd; border-radius:4px;">
            <input type="number" class="${t}-w" value="0" style="flex:1; padding:5px; border:1px solid #ddd; border-radius:4px;">
            <button onclick="this.parentElement.remove()" style="background:var(--danger); color:white; border:none; border-radius:4px; padding:5px 8px; cursor:pointer;">✖</button>
        </div>`;
    
    container.insertAdjacentHTML('beforeend', rowHtml);
}

// ======================================================
    // === YENİ ÖZELLİKLER (GERİ SAYIM, KRONOMETRE, TAKIM) ===
    // ======================================================

    // --- GERİ SAYIM SİSTEMİ (Özel Değişken İsimleri ile) ---
    var cdTimer = null;
    var cdTotalSeconds = 0;

    function adjustCountdown(amount) {
        if (cdTimer) return; 
        let currentMins = Math.floor(cdTotalSeconds / 60);
        currentMins += amount;
        if (currentMins < 0) currentMins = 0; 
        cdTotalSeconds = currentMins * 60;
        
        const minDisplay = document.getElementById('manual-min-val');
        if (minDisplay) minDisplay.innerText = currentMins;
        renderCdTime();
    }

    function startCountdown() {
        if (cdTimer) return; 
        if (cdTotalSeconds <= 0) {
            alert("Lütfen önce süre belirleyin!");
            return;
        }
        cdTimer = setInterval(() => {
            cdTotalSeconds--;
            if (cdTotalSeconds <= 0) {
                cdTotalSeconds = 0;
                renderCdTime();
                stopCountdown();
                alert("Süre doldu!");
                return;
            }
            renderCdTime();
        }, 1000);
    }

    function stopCountdown() {
        clearInterval(cdTimer);
        cdTimer = null;
    }

    function resetCountdown() {
        stopCountdown();
        cdTotalSeconds = 0;
        const minDisplay = document.getElementById('manual-min-val');
        if (minDisplay) minDisplay.innerText = "0";
        renderCdTime();
    }

    function renderCdTime() {
        let m = Math.floor(cdTotalSeconds / 60);
        let s = cdTotalSeconds % 60;
        const el = document.getElementById('countdown-display');
        if (el) {
            el.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
    }

    // --- KRONOMETRE SİSTEMİ ---
    let sw_interval = null;
    let sw_start = 0;
    let sw_elapsed = 0;
    let lap_counter = 0;

    function startStopwatch() {
        if(!sw_interval) {
            sw_start = Date.now() - sw_elapsed;
            sw_interval = setInterval(() => {
                sw_elapsed = Date.now() - sw_start;
                document.getElementById('stopwatch-display').innerText = formatMs(sw_elapsed);
            }, 10);
        }
    }

    function stopStopwatch() {
        clearInterval(sw_interval);
        sw_interval = null;
    }

    function resetStopwatch() {
        stopStopwatch();
        sw_elapsed = 0;
        lap_counter = 0;
        document.getElementById('stopwatch-display').innerText = "00:00:00";
        const lapListEl = document.getElementById('lapList');
        if (lapListEl) lapListEl.innerHTML = "";
    }

    // Giriş/Çıkış butonunu yöneten yardımcı fonksiyon
function loginButonTikla() {
    const user = firebase.auth().currentUser;
    if (user) {
        // Eğer kullanıcı varsa çıkış onayı iste
        if(confirm("Çıkış yapmak istediğinize emin misiniz?")) {
            firebase.auth().signOut().then(() => {
                alert("Başarıyla çıkış yapıldı.");
                location.reload(); // Sayfayı yenileyerek temiz bir başlangıç yapın
            });
        }
    } else {
        // Kullanıcı yoksa giriş modalını aç
        modalAc(); 
    }
}
   
    function recordLap() {
        const lapListEl = document.getElementById('lapList');
        if(sw_elapsed > 0 && lapListEl) {
            lap_counter++;
            let d = document.createElement('div');
            d.style.padding = "5px";
            d.style.borderBottom = "1px solid #eee";
            d.innerText = `Tur ${lap_counter}: ${formatMs(sw_elapsed)}`;
            lapListEl.prepend(d);
        }
    }

    // --- TAKIM OLUŞTURMA ---
    function createTeams(size) {
        if(typeof curLId === 'undefined' || curLId === null) return alert("Lütfen önce bir sınıf seçin!");
        let students = data.levels[curLId].classes[curCId].students;
        if(!students || students.length === 0) return alert("Sınıfta öğrenci yok!");

        let names = students.map(s => s.name);
        names.sort(() => Math.random() - 0.5);

        let teams = [];
        while(names.length) {
            teams.push(names.splice(0, size));
        }

        if(teams.length > 1 && teams[teams.length-1].length < size) {
            let leftovers = teams.pop();
            let i = 0;
            while(leftovers.length) {
                teams[i].push(leftovers.pop());
                i = (i + 1) % teams.length;
            }
        }

        let container = document.getElementById('teamContainer');
        if(container) {
            container.innerHTML = '';
            teams.forEach((team, i) => {
                let card = document.createElement('div');
                card.className = 'team-card';
                card.innerHTML = `<div class="team-title">Takım ${i+1}</div>`;
                team.forEach(member => {
                    card.innerHTML += `<div class="team-member">${member}</div>`;
                });
                container.appendChild(card);
            });
        }
    }
    
    function clearTeams() {
        const container = document.getElementById('teamContainer');
        if(container) container.innerHTML = '';
    }

    // --- YARDIMCI FONKSİYONLAR ---
    function formatMs(ms) {
        let date = new Date(ms);
        let m = String(date.getUTCMinutes()).padStart(2, '0');
        let s = String(date.getUTCSeconds()).padStart(2, '0');
        let cs = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
        return `${m}:${s}:${cs}`;
    }

    // İlk Çalıştırma
    if(typeof renderSidebar === 'function') renderSidebar();

    // ==========================================
    // SAYFA YÜKLENDİĞİNDE ÇALIŞACAKLAR
    // ==========================================
    document.addEventListener('DOMContentLoaded', function() {
       
    });
function llToggleSidebar() {
    llRootEl().classList.toggle('sidebar-closed');
    window.dispatchEvent(new Event('resize'));
}

// Sınav/Ödev hesaplamasını ağırlıklara göre yapan fonksiyon
function renderResults() {
    let table = document.getElementById('resTable');
    if (!table || !curLId || !curCId) return;
    
    let lvl = data.levels[curLId];
    table.innerHTML = `<tr><th>Öğrenci</th><th>Ödev Ort. (%100)</th><th>Sınav Ort. (%100)</th></tr>`;
    
    lvl.classes[curCId].students.forEach(s => {
        let hwScore = 0;
        let exScore = 0;
        
        // Ödev Ağırlıklı Hesaplama
        lvl.config.hw.forEach((c, i) => {
            let val = parseFloat((s.hw || [])[i] || 0);
            let weight = parseFloat(c.w || 0) / 100; // Yüzdelik ağırlık (25/100 = 0.25)
            hwScore += (val * weight);
        });
        
        // Sınav Ağırlıklı Hesaplama
        lvl.config.ex.forEach((c, i) => {
            let val = parseFloat((s.ex || [])[i] || 0);
            let weight = parseFloat(c.w || 0) / 100; // Yüzdelik ağırlık (50/100 = 0.50)
            exScore += (val * weight);
        });
        
        table.insertRow().innerHTML = `
            <td>${s.name}</td>
            <td style="font-weight:bold;">${hwScore.toFixed(2)}</td>
            <td style="font-weight:bold; color:var(--accent);">${exScore.toFixed(2)}</td>
        `;
    });
}
function addConfigRow(type, name = "", weight = 0) {
    const container = document.getElementById(type === "hw" ? "lvlHwList" : "lvlExList");
    if (!container) return;

    const row = document.createElement("div");
    row.style = "margin-bottom:8px; display:flex; gap:5px; align-items:center;";
    row.innerHTML = `
        <input type="text" class="${type}-n" value="${name}" placeholder="Ad" style="flex:2; padding:5px; border:1px solid #ddd; border-radius:4px;">
        <input type="number" class="${type}-w" value="${weight}" placeholder="%" style="flex:1; padding:5px; border:1px solid #ddd; border-radius:4px;">
        <button onclick="this.parentElement.remove()" style="background:#e74c3c; color:white; border:none; border-radius:4px; padding:5px 8px; cursor:pointer;">✖</button>
    `;
    container.appendChild(row);
}

let mevcutMod = 'login'; // Varsayılan mod giriş

function llModuDegistir() {
    const title = document.getElementById('auth-title');
    const subTitle = document.querySelector('.auth-header-area p'); // Açıklama metnini seçer
    const btn = document.getElementById('auth-action-btn');
    const link = document.getElementById('auth-switch-link');
    const text = document.getElementById('auth-switch-text');
    const passLabel = document.getElementById('password-label');
    const rePassGroup = document.getElementById('re-password-group');
    const hata = document.getElementById('hata-mesaji');

    if (hata) hata.style.display = "none";

    if (mevcutMod === 'login') {
        // --- KAYIT OLMA MODUNA GEÇİŞ ---
        mevcutMod = 'signup';
        title.innerText = "Yeni Hesap Oluştur";
        if (subTitle) subTitle.innerText = "Verilerinizi senkronize etmek için kayıt olun."; // İSTEDİĞİN DEĞİŞİKLİK
        
        if (passLabel) passLabel.innerText = "Şifre Oluştur";
        if (rePassGroup) rePassGroup.style.display = "flex"; 
        
        btn.innerText = "Kayıt Ol";
        text.innerText = "Zaten hesabınız var mı?";
        link.innerText = "Giriş Yapın";
    } else {
        // --- GİRİŞ YAPMA MODUNA GEÇİŞ ---
        mevcutMod = 'login';
        title.innerText = "Öğretmen Girişi";
        if (subTitle) subTitle.innerText = "Verilerinizi senkronize etmek için giriş yapın.";
        
        if (passLabel) passLabel.innerText = "Şifre";
        if (rePassGroup) rePassGroup.style.display = "none";
        
        btn.innerText = "Giriş Yap";
        text.innerText = "Hesabınız yok mu?";
        link.innerText = "Kayıt Olun";
    }
}


async function llAuthIslemi() {
    const emailInput = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    const rePass = document.getElementById('re-password') ? document.getElementById('re-password').value : ""; 
    const hata = document.getElementById('hata-mesaji');

    if (hata) hata.style.display = "none";

    // --- ÖĞRENCİ GİRİŞ KONTROLÜ ---
    if (currentRole === 'student') {
        const inputCode = emailInput.toUpperCase();
        if (!inputCode) {
            hata.innerText = "Lütfen giriş kodunu yazın.";
            hata.style.display = "block";
            return;
        }

        // KRİTİK YAMA: Eğer global 'data' boşsa, yerel hafızadan yükle
        if (!window.data || !window.data.levels) {
            const localData = localStorage.getItem('schoolData');
            if (localData) window.data = JSON.parse(localData);
        }

        let foundStudent = null;
        let coords = null;

        // Veri yapısı hala yoksa hata ver
        if (!window.data || !window.data.levels) {
            hata.innerText = "Sistem verileri yüklenemedi. Lütfen sayfayı yenileyin.";
            hata.style.display = "block";
            return;
        }

        // Tüm Seviyeleri ve Sınıfları Tara
        for (let lId in window.data.levels) {
            for (let cId in window.data.levels[lId].classes) {
                const students = window.data.levels[lId].classes[cId].students || [];
                const sIdx = students.findIndex(s => 
                    (s.loginCode || "").toString().trim().toUpperCase() === inputCode
                );

                if (sIdx !== -1) {
                    foundStudent = students[sIdx];
                    coords = { lId, cId, sIdx };
                    break;
                }
            }
            if (foundStudent) break;
        }

        if (foundStudent) {
            // Giriş bilgilerini kaydet
            localStorage.setItem('logged_student', JSON.stringify({ ...coords, name: foundStudent.name, role: 'student' }));
            
            alert("Hoş geldin, " + foundStudent.name);
            modalKapat();
            
            // Görünümü güncelle
            llRootEl().classList.add('logged-in');
            
            // Öğrenci panelini otomatik aç
            if (typeof switchView === "function") {
                switchView('student');
            }
            return;
        } else {
            hata.innerText = "Geçersiz giriş kodu!";
            hata.style.display = "block";
            return;
        }
    }

    // --- ÖĞRETMEN (FIREBASE) GİRİŞİ ---
    if (!emailInput || !pass) {
        hata.innerText = "Lütfen e-posta ve şifre giriniz.";
        hata.style.display = "block";
        return;
    }

    try {
        hata.style.display = "none";
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

        let userCredential;
        if (mevcutMod === 'login') {
            userCredential = await firebase.auth().signInWithEmailAndPassword(emailInput, pass);
            
            const doc = await db.collection("kullanicilar").doc(userCredential.user.uid).get();
            if (doc.exists && doc.data().teacherStaticCode) {
                localStorage.setItem('teacher_static_code', doc.data().teacherStaticCode);
            }
        } else {
            // YENİ KAYIT MODU
            if (pass !== rePass) { throw new Error("Şifreler eşleşmiyor."); }
            userCredential = await firebase.auth().createUserWithEmailAndPassword(emailInput, pass);
            
            const staticCode = "TCH-" + Math.floor(1000 + Math.random() * 9999);
            localStorage.setItem('teacher_static_code', staticCode);

            let dataToUpload = localStorage.getItem('schoolData') || JSON.stringify({ levels: {}, levelOrder: [] });
            
            await db.collection("kullanicilar").doc(userCredential.user.uid).set({
                userData: dataToUpload,
                teacherStaticCode: staticCode,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            alert("Hesap oluşturuldu! Sabit Kodunuz: " + staticCode);
        }
        
        modalKapat();
        llRootEl().classList.add('logged-in');
        
        // Öğretmen verilerini çek
        if (typeof verileriGetir === "function") {
            verileriGetir(userCredential.user.uid);
        }
    } catch (error) {
        hata.innerText = "Hata: " + error.message;
        hata.style.display = "block";
    }
}

// --- ENTER TUŞU ÖZELLİĞİ ---
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('login-modal');
    if (modal && modal.style.display !== 'none' && event.key === 'Enter') {
        if (event.target.tagName !== 'TEXTAREA') {
            event.preventDefault();
            llAuthIslemi();
        }
    }
});

function llTogglePassword(id) {
    const input = document.getElementById(id);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}


/* firebaseConfig kaldirildi - paylasilan firebase kullaniliyor */

// Firebase Config zaten sizde var...

/* listelerim kendi login onAuthStateChanged'i kaldirildi - index unified auth yonetiyor. Veri yukleme initListelerim() ile view acilinca yapilir. */

function verileriGetir(uid) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'flex';

    // Sayfa yenilendiğinde eski ID'leri temizle ki taze veri yüklensin
    curLId = null; 
    curCId = null;

    db.collection("kullanicilar").doc(uid).get()
    .then((doc) => {
        // Her zaman bu hesabin KENDI verisini yukle; baska hesaptan kalan yerel veri asla gorunmesin
        if (doc.exists && doc.data().userData) {
            try {
                data = JSON.parse(doc.data().userData); 
                if (!data || typeof data !== 'object') data = { levels: {}, levelOrder: [] };
                if (!data.levels) data.levels = {};
                console.log("Bulut verileri başarıyla senkronize edildi! 🔄");
            } catch (e) {
                console.error("JSON ayrıştırma hatası:", e);
                data = { levels: {}, levelOrder: [] };
            }
        } else {
            // Bu hesabin kendi listesi yok -> bos basla (onceki ogretmenin listeleri gorunmesin)
            data = { levels: {}, levelOrder: [] };
        }
        // Yerel kopyayi ve ogretmen kodunu da bu hesaba gore guncelle (hesaplar arasi sizinti engellenir)
        try { localStorage.setItem('schoolData', JSON.stringify(data)); } catch(e){}
        try {
            var _sc = (doc.exists && doc.data().teacherStaticCode) ? doc.data().teacherStaticCode : null;
            if (_sc) localStorage.setItem('teacher_static_code', _sc);
            else localStorage.removeItem('teacher_static_code');
        } catch(e){}

        // 1. Sidebar'ı oluştur
        renderSidebar(); 
        llRootEl().classList.add('logged-in'); 

        // 2. Otomatik secim YOK - kullanici secene kadar placeholder goster
        if (typeof showLLPlaceholder === "function") showLLPlaceholder();

        // 3. Yükleme ekranını kaldır
        setTimeout(() => {
            if (overlay) overlay.style.display = 'none';
        }, 300);
    })
    .catch((err) => {
        console.error("Veritabanı bağlantı hatası:", err);
        if (overlay) overlay.style.display = 'none';
        renderSidebar();
    });
}

function misafirGiris() {
    // 1. Önce hafızadaki (varsa misafir modunda girilen) veriyi tazeleyelim
    loadDataFromLocal();
    
    // 2. Modalı gizle ve kilitleri aç
    document.getElementById('login-modal').style.display = 'none';
    llRootEl().classList.add('logged-in');
    
    // 3. Misafir modunu hafızaya al
    localStorage.setItem('auth_status', 'guest');
    
    // 4. Sidebar'ı çiz ve ilk sınıfı seç
    if (typeof renderSidebar === "function") {
        renderSidebar();
        setTimeout(() => {
            const firstLevel = document.querySelector('.level-container');
            if (firstLevel) {
                const firstClassList = firstLevel.querySelector('.class-list');
                if (firstClassList) firstClassList.style.display = "block";
                const firstClassLink = firstLevel.querySelector('.class-link');
                if (firstClassLink) firstClassLink.click();
            }
        }, 300);
    }
}
  

// --- ÖĞRENCİ MODÜLÜ ---

let isStudentViewOpen = false;

function switchView(role) {
    const overlay = document.getElementById('student-overlay');
    const studentContent = document.getElementById('student-dynamic-content');
    const emailInput = document.getElementById('email'); 

    if (role === 'student') {
        // --- ÖĞRENCİ PANELİNİ AÇ ---
        overlay.style.display = 'block';
        isStudentViewOpen = true; // Global değişkeni güncelle
        llRootEl().classList.add('role-student');
        
        // Öğrenciye özel kartları yerleştir
        studentContent.innerHTML = `
            <div class="student-card" onclick="alert('Satranç Dünyam Açılıyor...')" style="background: #FFF9C4; padding: 40px; border-radius: 25px; cursor: pointer; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div style="font-size: 50px;">♟️</div>
                <h3 style="margin-top:15px;">Satranç Dünyam</h3>
            </div>
            
            <div class="student-card" style="background: #C8E6C9; padding: 40px; border-radius: 25px; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div style="font-size: 50px;">🏆</div>
                <h3 style="margin-top:15px;">Puan Durumum</h3>
                <p style="font-size: 32px; font-weight: bold; color: #2E7D32;">Giriş Başarılı ✅</p>
            </div>

            <div class="student-card" style="background: #E3F2FD; padding: 40px; border-radius: 25px; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div style="font-size: 50px;">📅</div>
                <h3 style="margin-top:15px;">Haftalık Görevler</h3>
                <p style="font-size: 14px; color: #666;">Görevlerini buradan takip edebilirsin.</p>
            </div>
        `;
    } else {
        // --- ÇIKIŞ MANTIĞI ---
        
        // localStorage'da kayıtlı bir öğrenci var mı kontrol et
        const loggedStudent = localStorage.getItem('logged_student');

        if (loggedStudent) {
            // DURUM 1: GERÇEK ÖĞRENCİ GİRİŞİ YAPILMIŞSA
            overlay.style.display = 'none';
            isStudentViewOpen = false;
            
            // Tamamen sistemden çıkar ve giriş ekranına at
            llRootEl().classList.remove('role-student');
            llRootEl().classList.remove('logged-in'); 
            localStorage.removeItem('logged_student'); 
            
            if (emailInput) emailInput.value = "";
            
            if (typeof modalAc === "function") {
                modalAc(); 
                if (typeof llSetRole === "function") llSetRole('student');
            }
        } else {
            // DURUM 2: ÖĞRETMEN SADECE GÖRÜNÜME BAKIP KAPATIYORSA
            overlay.style.display = 'none';
            isStudentViewOpen = false;
            
            // Sadece öğrenci rolü sınıfını kaldır, logged-in (öğretmen oturumu) kalsın
            llRootEl().classList.remove('role-student');
            
            // Not: modalAc() çağrılmaz, öğretmen kaldığı yerden devam eder.
        }
    }
}


function renderStudentDashboard(container) {
    container.innerHTML = `
        <div class="student-card marhey-text" style="padding: 20px; background: #fffde7; border-radius: 15px;">
            <h2 style="color: #fbc02d;">Benim Dünyam</h2>
            <div class="game-links" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                <div class="game-item" style="background: white; padding: 15px; border-radius: 10px; text-align: center; border: 2px solid #fff9c4;">
                    <span>♟️</span><br>Satranç Dünyam
                </div>
                <div class="game-item" style="background: white; padding: 15px; border-radius: 10px; text-align: center; border: 2px solid #fff9c4;">
                    <span>📝</span><br>Ödevlerim
                </div>
            </div>
        </div>
    `;
} 

function renderStudentDashboardContent() {
    const studentContent = document.getElementById('student-dynamic-content');
    if (!studentContent) return;

    studentContent.innerHTML = `
        <div class="student-card" onclick="alert('Satranç Dünyam Açılıyor...')" style="background: #FFF9C4; padding: 40px; border-radius: 25px; cursor: pointer; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="font-size: 50px;">♟️</div>
            <h3 style="margin-top:15px;">Satranç Dünyam</h3>
        </div>
        
        <div class="student-card" style="background: #C8E6C9; padding: 40px; border-radius: 25px; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="font-size: 50px;">🏆</div>
            <h3 style="margin-top:15px;">Puan Durumum</h3>
            <p style="font-size: 32px; font-weight: bold; color: #2E7D32;">Giriş Yapıldı ✅</p>
        </div>

        <div class="student-card" style="background: #E3F2FD; padding: 40px; border-radius: 25px; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="font-size: 50px;">📅</div>
            <h3 style="margin-top:15px;">Haftalık Görevler</h3>
            <p style="font-size: 14px; color: #666;">Görevlerini buradan takip edebilirsin.</p>
        </div>
    `;
}

function syncLevelActions(){ try{ document.querySelectorAll('#ll-root .level-container').forEach(function(lc){ var list=lc.querySelector('.class-list'); var acts=lc.querySelector('.level-actions'); if(acts) acts.style.display=(list && list.style.display==='block')?'flex':'none'; }); }catch(e){} }
window.syncLevelActions=syncLevelActions;

// --- Seviye ismi: tek tik ac/kapa, cift tik yerinde duzenle ---
var _lvlClickTimer={};
function handleLevelNameClick(lId, spanEl){
  try{
    if(_lvlClickTimer[lId]){ clearTimeout(_lvlClickTimer[lId]); _lvlClickTimer[lId]=null; inlineRenameLevel(lId, spanEl); }
    else { _lvlClickTimer[lId]=setTimeout(function(){ _lvlClickTimer[lId]=null; if(typeof toggleClasses==='function') toggleClasses(lId); }, 220); }
  }catch(e){ if(typeof toggleClasses==='function') toggleClasses(lId); }
}
window.handleLevelNameClick=handleLevelNameClick;
function inlineRenameLevel(lId, spanEl){
  if(!spanEl || spanEl.querySelector('input')) return;
  if(!data.levels || !data.levels[lId]) return;
  var cur=data.levels[lId].name||'';
  spanEl.textContent='';
  var inp=document.createElement('input'); inp.type='text'; inp.value=cur;
  inp.setAttribute('style','width:88%; font-weight:bold; font-family:inherit; font-size:inherit; border:1px solid rgba(255,255,255,0.7); border-radius:4px; padding:2px 6px; background:rgba(255,255,255,0.2); color:#fff;');
  inp.onclick=function(e){ e.stopPropagation(); };
  spanEl.appendChild(inp); inp.focus(); inp.select();
  var done=false;
  function finish(sv){ if(done) return; done=true; var v=(inp.value||'').trim(); var name=(sv&&v)?v:cur; if(sv&&v&&v!==cur){ data.levels[lId].name=v; if(typeof save==='function') save(); } spanEl.textContent='📁 '+name; }
  inp.onblur=function(){ finish(true); };
  inp.onkeydown=function(e){ if(e.key==='Enter'){ e.preventDefault(); finish(true); inp.blur(); } else if(e.key==='Escape'){ finish(false); } };
}
window.inlineRenameLevel=inlineRenameLevel;

function showLLPlaceholder(){ try{ var content=document.getElementById('content'); if(!content) return; content.style.display='block'; var hint=document.getElementById('ll-select-hint'); if(hint) hint.style.display='block'; var tabs=content.querySelector('.tabs'); if(tabs) tabs.style.display='none'; content.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); }); var vt=document.getElementById('viewTitle'); if(vt) vt.innerHTML=''; }catch(e){} }
window.showLLPlaceholder=showLLPlaceholder;
