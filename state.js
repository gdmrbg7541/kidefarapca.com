/* ==========================================
   1. GÜVENLİK VE CAYDIRICI ÖNLEMLER (DEVRE DIŞI BIRAKILDI)
   ========================================== */
// (function initSecurity() { ... })();

/* ==========================================
   2. UYGULAMA DURUMU (STATE) VE HAFIZA SİSTEMİ
   ========================================== */
let appState = {
    currentUser: "Misafir Öğrenci",
    currentUserPhone: "",
    userRole: "guest",
    currentView: "dashboard",
    viewHistory: ["dashboard"],
    purchasedPackages: [],
    selectedPackageForPayment: null,
    currentPackageId: null,
    currentKazanim: 1,
    totalKazanimCount: 40,
    wrongAnswerPool: [], 
    localStream: null,
    screenStream: null,
    selectedOnlinePackages: [],
    selectedOfflinePackages: [],
    selectedSlots: [],
    pipWindow: null,
    // Canlı ders (WebRTC) durumu
    activeRoomId: null,
    isRoomHost: false,
    isInviteMode: false,
    unsubscribeChat: null,
    unsubscribeStatus: null,
    unsubscribeAnswer: null,
    unsubscribeIce: null,
    profileScrollPos: 0,
    profileDetailsOpen: false,
    
    // Yeni Eklenenler (Randevu Takibi ve Öğretmen Araçları)
    pendingLessons: [],
    approvedLessons: [],
    teacherAlarms: {},
    studentProgress: {},
    kazanimData: {},
    
    teachers: window.DATA_OGRETMENLER || [],
    packages: window.DATA_PAKETLER || [],
    onlinePackages: window.DATA_CANLI_PAKETLER || [],

    // ====== SİTE AYARI ======
    // "Paketler" ve "Canlı Ders Paketleri" şimdilik PASİF (yalnızca yönetici görür).
    // Paketler hazır olunca burayı true yapın; sekmeler herkese açılır.
    // "Ders Talep Et" bu ayardan etkilenmez, her zaman aktiftir.
    PAKETLER_AKTIF: false
};

// ====== SAAT BAZLI FİYATLANDIRMA ======
// Tüm paket fiyatları saat üzerinden hesaplanır:  fiyat = paketin saati × SAAT_UCRETI.
// Saat ücretini veya bir paketin saatini değiştirmek için SADECE burayı düzenleyin.
var SAAT_UCRETI = 400; // TL / saat
var PAKET_SAATLERI = {
    // Çevrimdışı (Özel Eğitim) paketleri
    1: 1,     // Sarfa Giriş            -> 400 TL
    2: 20,    // Temel Sarf ve Nahiv A2 -> 8.000 TL
    3: 30,    // Kapsamlı Cümle Analizi B1 -> 12.000 TL
    4: 40,    // Haber ve Modern Metin B2  -> 16.000 TL
    5: 50,    // Klasik ve Akademik C1   -> 20.000 TL
    6: 45,    // Belağat ve İfade C2      -> 18.000 TL
    // Canlı Ders paketleri
    101: 10,  // A1-A2 Pratik Konuşma (Muhadese) -> 4.000 TL
    102: 12,  // B1-B2 Aktif Kelime Hafızası     -> 4.800 TL
    103: 16,  // YDS/YÖKDİL Taktikleri           -> 6.400 TL
    104: 20   // C1-C2 İleri Seviye Konuşma       -> 8.000 TL
};
appState.SAAT_UCRETI = SAAT_UCRETI;
// Paket verilerine saat bilgisini ve saat bazlı fiyatı uygula
[appState.packages, appState.onlinePackages].forEach(function(arr){
    (arr || []).forEach(function(pkg){
        if (pkg && PAKET_SAATLERI[pkg.id] != null) {
            pkg.saat = PAKET_SAATLERI[pkg.id];
            pkg.price = pkg.saat * SAAT_UCRETI;
        }
    });
});

let teacherSchedules = window.DATA_TEACHER_SCHEDULES || {};




// Otomatik Kazanım Data Dönüşümü
// paketler.js içindeki 'kazanimlar' alanını tek pencereli (flattened) yapıya dönüştürüyoruz.
if (appState.packages && appState.packages.length > 0) {
    appState.packages.forEach(pkg => {
        if (pkg.kazanimlar && pkg.kazanimlar.length > 0) {
            let stepsObj = {};
            let globalStepNum = 1;
            
            pkg.kazanimlar.forEach(kazanim => {
                // Parça 1: Eğitim Materyali (Video veya Konu Anlatımı)
                if (kazanim.videoUrl || kazanim.konuAnlatimi) {
                    stepsObj[globalStepNum] = {
                        title: kazanim.baslik,
                        text: kazanim.konuAnlatimi,
                        videoUrl: kazanim.videoUrl,
                        question: { type: 'none' },
                        pdfLink: pkg.pdfLink // Video adımında PDF de görünebilsin
                    };
                    globalStepNum++;
                }
                
                // Parça 2..N: Sorular (Her soru ayrı bir adım olur)
                if (kazanim.sorular && kazanim.sorular.length > 0) {
                    kazanim.sorular.forEach((s, idx) => {
                        let qData = { type: 'none' };
                        if (s.tip === 'coktan_secmeli') {
                            let correctIdx = s.secenekler.indexOf(s.dogruCevap);
                            qData = { type: 'multiple_choice', text: s.soru, options: s.secenekler, correctOptionIndex: correctIdx };
                        } else if (s.tip === 'eslestirme') {
                            let pairsArr = [];
                            if (s.ciftler) {
                                for (let key in s.ciftler) {
                                    pairsArr.push({ left: key, right: s.ciftler[key] });
                                }
                            }
                            qData = { type: 'matching', text: s.soru, pairs: pairsArr };
                        } else if (s.tip === 'bosluk_doldurma') {
                            qData = { type: 'multiple_choice', text: s.soru, options: [s.dogruCevap, "Yanlış Seçenek"], correctOptionIndex: 0 };
                        }
                        
                        stepsObj[globalStepNum] = {
                            title: kazanim.baslik + (kazanim.sorular.length > 1 ? ` - Soru ${idx+1}` : " - Soru"),
                            text: "",
                            videoUrl: "",
                            question: qData
                        };
                        globalStepNum++;
                    });
                }
            });
            
            let totalSteps = globalStepNum - 1;
            appState.kazanimData[pkg.id] = {
                total: totalSteps,
                steps: stepsObj
            };
        }
    });
}

