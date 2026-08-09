/* ==========================================
   3. FIREBASE & AUTH (GİRİŞ/KAYIT)
   ========================================== */
const firebaseConfig = {
    apiKey: "AIzaSyBGIQPJ_Bjm5I3-QmrrGpLR5MqmG3S5F8w",
    authDomain: "kidefarapca-98f9c.firebaseapp.com",
    projectId: "kidefarapca-98f9c",
    storageBucket: "kidefarapca-98f9c.firebasestorage.app",
    messagingSenderId: "503317118211",
    appId: "1:503317118211:web:a9c8cf15b854597e0b3d36",
    measurementId: "G-HYY6T2EDKY"
};

let isFirebaseReady = true;
let db = null;
let isRegistering = false; // kayit sirasinda onAuthStateChanged yaris kosulunu onler

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
db = firebase.firestore();

(function loadAppData() {
    // Versiyon kontrolü: Eğer paketler güncellenmişse eskisini silip yeni paketleri yükle
    const PACKAGE_VERSION = "vArapca-1.1";
    if (localStorage.getItem('packageVersion') !== PACKAGE_VERSION) {
        localStorage.removeItem('mockOfflinePackages');
        localStorage.removeItem('mockOnlinePackages');
        localStorage.setItem('packageVersion', PACKAGE_VERSION);
    }

    // Öğretmen verilerini sıfırlama (Sadece Geylani hoca ve Farketmez kalsın diye)
    const TEACHER_VERSION = "vTeacher-1.2";
    if (localStorage.getItem('teacherVersion') !== TEACHER_VERSION) {
        localStorage.removeItem('mockTeachers');
        localStorage.removeItem('mockSchedules');
        localStorage.setItem('teacherVersion', TEACHER_VERSION);
    }

    const savedA = localStorage.getItem('mockTeacherApps');
    if (savedA) appState.teacherApplications = JSON.parse(savedA);
    
    const savedAlarms = localStorage.getItem('mockTeacherAlarms');
    const savedProgress = localStorage.getItem('mockStudentProgress');
    if (savedAlarms) appState.teacherAlarms = JSON.parse(savedAlarms);
    if (savedProgress) appState.studentProgress = JSON.parse(savedProgress);
})();

function saveTeachers() {
    localStorage.setItem('mockTeacherApps', JSON.stringify(appState.teacherApplications));
    localStorage.setItem('mockTeacherAlarms', JSON.stringify(appState.teacherAlarms));
    localStorage.setItem('mockStudentProgress', JSON.stringify(appState.studentProgress));

    if (typeof firebase !== 'undefined' && isFirebaseReady) {
        // studentProgress'ten "self" HARİÇ yaz: kullanıcıların kendi ilerlemesi zaten
        // kullanicilar/{uid}.progress içinde tutuluyor. Böylece global/appState dokümanı
        // kullanıcı sayısıyla sınırsız büyümez (Firestore 1MB doküman limiti korunur).
        var _spSave = {};
        for (var _k in appState.studentProgress) { if (_k !== 'self') _spSave[_k] = appState.studentProgress[_k]; }
        // kazanimData YAZILMIYOR: global'den hiç geri okunmuyor (paketlerden yeniden kuruluyor) — ölü yük.
        db.collection('global').doc('appState').set({
            teacherApplications: appState.teacherApplications,
            teacherAlarms: appState.teacherAlarms,
            studentProgress: _spSave
        }).catch(function(e){ console.warn('global/appState yazılamadı:', e && e.code); });
        
    }
}

if (typeof firebase !== 'undefined' && isFirebaseReady) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            if (isRegistering) return; // kayit akisi rolu kendisi ayarlar
            db.collection('kullanicilar').doc(user.uid).get().then(doc => {
                const data = doc.exists ? doc.data() : { role: 'student', packages: [], phone: '', name: '' };
                /* Rol tamamen Firestore'dan gelir (ogrenci/ogretmen aninda, yonetici rol ile).
                   ⚠️ ORTAK COZUCU: sistem/rol.js. "role" alani hic yazilmamis eski
                   ogretmen hesaplarinda eskiden 'student'e dusuluyordu; bu yuzden
                   basliktaki rozet ogrenci gorunuyor ve bilgi yarismasi girise
                   yonlendiriyordu. KidefRol ogretmen izlerine de bakar ve eksik
                   "role" alanini kullanicinin KENDI belgesinde onarir. */
                if (window.KidefRol) {
                    selectedRole = KidefRol.rolCoz(data);
                    try {
                        KidefRol.onbellekYaz(user.uid, {
                            rol: selectedRole,
                            ogretmen: (selectedRole === 'teacher' || selectedRole === 'admin'),
                            isim: KidefRol.isimCoz(data, user),
                            iz: data.role ? '' : KidefRol.ogretmenIzi(data)
                        });
                        if (!user.isAnonymous) KidefRol.onar(user, db, data);
                    } catch (e) { }
                } else {
                    selectedRole = data.role || 'student';
                }
                appState.currentUserGender = data.cinsiyet || '';
                appState.currentUserMeslek = data.meslek || data.profession || '';

                appState.purchasedPackages = data.packages || [];
                // Yönetici onaylı canlı dersler (siparişten tanımlanan) profil takvimine yüklensin
                appState.approvedLessons = Array.isArray(data.dersler) ? data.dersler : [];
                if (!appState.studentProgress["self"]) appState.studentProgress["self"] = {};
                if (user.email) appState.studentProgress["self"][user.email] = data.progress || {};

                const fallbackName = user.isAnonymous && appState.currentUserName && appState.currentUserName !== "Misafir Öğrenci" ? appState.currentUserName : (user.displayName || "Öğrenci");
                const finalName = data.name && data.name !== "Belirtilmedi" ? data.name : fallbackName;

                basariliGiris(user.email || "anonim", data.phone || "", finalName);
            }).catch(err => {
                console.error("Firestore okuma hatası:", err);
                const fallbackName = user.isAnonymous && appState.currentUserName && appState.currentUserName !== "Misafir Öğrenci" ? appState.currentUserName : (user.displayName || "Öğrenci");
                basariliGiris(user.email || "anonim", "", fallbackName);
            });
        } else {
            initAppAsGuest();
        }
    });

    // Sayfa yüklendiğinde global verileri Firestore'dan al
    db.collection('global').doc('appState').get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            if (data.teacherApplications) appState.teacherApplications = data.teacherApplications;
            if (data.teacherAlarms) appState.teacherAlarms = data.teacherAlarms;
            if (data.studentProgress) {
                // Global'den yalnızca öğretmen notları alınır; "self" (kişisel ilerleme) global'de tutulmaz
                var _spLoad = {};
                for (var _k in data.studentProgress) { if (_k !== 'self') _spLoad[_k] = data.studentProgress[_k]; }
                if (appState.studentProgress && appState.studentProgress['self']) _spLoad['self'] = appState.studentProgress['self'];
                appState.studentProgress = _spLoad;
            }
            
            // Re-render UI if dashboard is active since we got new data
            if(appState.currentView === 'dashboard-section') {
                renderPackages();
                renderOnlinePackages();
            } else if (appState.userRole === 'admin' && document.getElementById('admin-section')) {
                if (typeof renderAdminPanel === 'function') renderAdminPanel();
            }
        }
    }).catch(err => console.log(err));

    

} else {
    // Firebase yokken (simülasyon)
    window.addEventListener('DOMContentLoaded', () => {
        const sessionStr = localStorage.getItem('mockSession');
        if (sessionStr) {
            try {
                const session = JSON.parse(sessionStr);
                selectedRole = session.role || 'student';
                basariliGiris(session.email, session.phone, session.name);
            } catch(e) {
                initAppAsGuest();
            }
        } else {
            initAppAsGuest();
        }
    });
}

function initAppAsGuest() {
    appState.currentUser = "Misafir Öğrenci";
    appState.userRole = "student";
    appState.purchasedPackages = [];
    appState.selectedOfflinePackages = [];
    appState.currentPackageId = null;
    appState.currentKazanim = 1;
    if(appState.studentProgress["self"]) {
        appState.studentProgress["self"][appState.currentUser] = {};
    }
    if (typeof window._stopMsgDot === 'function') window._stopMsgDot();
    updateHeaderUI();
    initApp();
}

let isLoginMode = true;
let selectedRole = 'student';

function setRole(role) {
    selectedRole = role;
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active-role'));
    const btn = document.getElementById('btn-' + role);
    if(btn) btn.classList.add('active-role');
    
    const switchContainer = document.getElementById('auth-switch-container');
    if (role === 'admin') {
        if (switchContainer) switchContainer.style.display = 'none';
        if (!isLoginMode) moduDegistir(); // Yöneticiler kayıt olamaz
    } else {
        if (switchContainer) switchContainer.style.display = 'block';
    }
    
    updateAuthUI();
}

function moduDegistir() {
    isLoginMode = !isLoginMode;
    updateAuthUI();
}

function updateAuthUI() {
    const isCheckout = appState.currentView === 'checkout-section';
    let titlePrefix = isCheckout ? "Satın Almak İçin " : "Sisteme ";
    const errEl = document.getElementById('hata-mesaji'); if (errEl) errEl.innerText = "";
    const setD = (id, v) => { const el = document.getElementById(id); if (el) el.style.display = v; };
    const mc = document.querySelector('.modal-content');

    if (isLoginMode) {
        document.getElementById('auth-title').innerText = titlePrefix + "Giriş Yap";
        document.getElementById('auth-action-btn').innerText = "Giriş Yap";
        document.getElementById('auth-switch-text').innerText = "Hesabınız yok mu?";
        document.getElementById('auth-switch-link').innerText = "Kayıt Ol";
        setD('re-password-group','none'); setD('phone-group','none'); setD('student-extra-group','none');
        setD('teacher-cv-group','none'); setD('teacher-file-group','none');
        if (mc) { mc.style.maxWidth = "450px"; mc.style.width = "90%"; }
    } else {
        document.getElementById('auth-title').innerText = titlePrefix + "Kayıt Ol";
        document.getElementById('auth-action-btn').innerText = "Kayıt Ol";
        document.getElementById('auth-switch-text').innerText = "Zaten hesabınız var mı?";
        document.getElementById('auth-switch-link').innerText = "Giriş Yap";
        setD('re-password-group','flex'); setD('phone-group','block'); setD('student-extra-group','flex');
        setD('teacher-cv-group','none'); setD('teacher-file-group','none');
        if (mc) { mc.style.maxWidth = "450px"; mc.style.width = "90%"; }

        // Öğretmen kaydında meslek otomatik "Eğitmen" (değiştirilemez)
        const profInput = document.getElementById('student-profession');
        if (profInput) {
            if (selectedRole === 'teacher') {
                profInput.value = 'Eğitmen';
                profInput.readOnly = true;
                profInput.style.background = '#F0F4F8';
                profInput.style.color = '#16A085';
                profInput.style.fontWeight = 'bold';
            } else {
                if (profInput.value === 'Eğitmen') profInput.value = '';
                profInput.readOnly = false;
                profInput.style.background = '';
                profInput.style.color = '';
                profInput.style.fontWeight = '';
            }
        }
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if(input) {
        input.type = input.type === "password" ? "text" : "password";
    }
}

function authIslemi() {
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    const errorEl = document.getElementById('hata-mesaji');
    errorEl.innerText = "";

    if (!email || !pass) {
        errorEl.innerText = "Lütfen tüm alanları doldurun.";
        return;
    }

    // E-posta hafızaya kaydedilsin (kolaylik)
    localStorage.setItem('savedEmail', email);

    if (!isFirebaseReady) {
        let users = JSON.parse(localStorage.getItem('mockUsers') || '{}');
        
        if (!isLoginMode) {
            const pass2 = document.getElementById('re-password').value;
            const phone = document.getElementById('phone').value.trim();
            if (pass !== pass2) { errorEl.innerText = "Şifreler uyuşmuyor."; return; }
            if (!phone.match(/^5[0-9]{9}$/)) { errorEl.innerText = "Lütfen 5 ile başlayan 10 haneli bir telefon numarası girin."; return; }
            if (users[email] && selectedRole !== 'teacher') { errorEl.innerText = "Bu e-posta zaten kayıtlı."; return; }
            
            if (selectedRole === 'teacher') {
                const cv = document.getElementById('teacher-cv').value.trim();
                const fileInput = document.getElementById('teacher-file');
                if (!cv || fileInput.files.length === 0) {
                    errorEl.innerText = "Lütfen CV ve belge yükleme alanlarını doldurun.";
                    return;
                }
                const fileName = fileInput.files[0].name;
                
                // Add to teacher applications
                appState.teacherApplications = appState.teacherApplications || [];
                appState.teacherApplications.push({
                    id: 'app_' + Date.now(),
                    email: email,
                    password: pass,
                    phone: "+90" + phone,
                    cv: cv,
                    documentName: fileName,
                    status: "pending",
                    date: new Date().toISOString()
                });
                saveTeachers();
                
                showCustomAlert("Öğretmen başvurunuz başarıyla alındı! CV'niz ve belgeniz incelendikten sonra size dönüş yapılacaktır.");
                closeLoginModal();
                return;
            } else if (selectedRole === 'student') {
                const sName = document.getElementById('student-name').value.trim();
                const sProf = document.getElementById('student-profession').value.trim();
                
                users[email] = { 
                    password: pass, 
                    phone: "+90" + phone, 
                    role: selectedRole,
                    name: sName || "Belirtilmedi",
                    profession: sProf || "Belirtilmedi"
                };
                localStorage.setItem('mockUsers', JSON.stringify(users));
                showCustomAlert("Kayıt başarılı! Lütfen giriş yapın.");
                isLoginMode = true;
                updateAuthUI();
                return;
            }
        } else {
            if (selectedRole === 'teacher') {
                const teacher = appState.teachers.find(t => t.email === email && t.password === pass);
                if (!teacher) {
                    errorEl.innerText = "Yetkisiz giriş veya hatalı şifre. Kaydınız yönetici tarafından henüz onaylanmamış olabilir.";
                    return;
                }
                basariliGiris(teacher.email, teacher.phone || "", teacher.name || "");
                return;
            } else {
                if (!users[email] || users[email].password !== pass) {
                    errorEl.innerText = "Kullanıcı bulunamadı veya şifre hatalı. Lütfen önce kayıt olun."; 
                    return;
                }
                basariliGiris(email, users[email] ? users[email].phone : "", users[email] ? users[email].name : "");
                return;
            }
        }
        return;
    }

    if (isLoginMode) {
        firebase.auth().signInWithEmailAndPassword(email, pass)
        .then((userCredential) => { 
            // onAuthStateChanged verileri Firestore'dan çekecek
        })
        .catch((error) => { errorEl.innerText = "Giriş başarısız: " + error.message; });
    } else {
        const pass2 = document.getElementById('re-password').value;
        const phone = document.getElementById('phone').value.trim();
        const sName = document.getElementById('student-name').value.trim();
        const sProf = document.getElementById('student-profession').value.trim();
        const sGender = document.getElementById('student-gender') ? document.getElementById('student-gender').value : '';

        if (pass !== pass2) { errorEl.innerText = "Şifreler uyuşmuyor."; return; }
        if (!sName) { errorEl.innerText = "Lütfen isminizi girin."; return; }
        if (!sProf) { errorEl.innerText = "Lütfen mesleğinizi girin (zorunlu)."; return; }
        if (!/^5[0-9]{9}$/.test(phone)) { errorEl.innerText = "Geçerli bir telefon numarası girin: 5XX XXX XX XX (zorunlu)."; return; }
        if (!sGender) { errorEl.innerText = "Lütfen cinsiyetinizi seçin (zorunlu)."; return; }

        const regRole = (selectedRole === 'admin' ? 'student' : selectedRole);
        isRegistering = true;
        firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => { 
            // Firestore'a kaydet
            return db.collection('kullanicilar').doc(userCredential.user.uid).set({
                email: email,
                role: regRole,
                name: sName || "Belirtilmedi",
                meslek: sProf || "",
                cinsiyet: sGender || "",
                phone: phone ? ("+90" + phone) : "",
                packages: [],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                // Yaris onleme: dokuman yazildiktan sonra dogru rolle girisi tamamla
                /* Kayit formunda ogretmen kodu girildiyse sakla:
                   giris tamamlaninca ogrencihesap.js otomatik istek gonderir. */
                try {
                    var tkEl = document.getElementById('student-teacher-code');
                    var tkod = tkEl ? tkEl.value.trim() : '';
                    if (regRole === 'student' && tkod) localStorage.setItem('oh_beklenen_kod', tkod);
                } catch (e) { }
                showCustomAlert("Kayıt başarılı!");
                selectedRole = regRole;
                isRegistering = false;
                basariliGiris(email, phone ? ("+90" + phone) : "", sName || "");
            });
        })
        .catch((error) => { isRegistering = false; errorEl.innerText = "Kayıt başarısız: " + error.message; });
    }
}


// YÖNETİCİ her zaman TÜM paketleri (çevrimdışı + online) satın almış sayılır.
// Paket verisi geç yüklense bile render sırasında tekrar çağrılarak garanti altına alınır.
function grantAdminAllPackages() {
    if (appState.userRole !== 'admin') return;
    var ids = [];
    (appState.packages || []).forEach(function(p){ if (p && p.id != null) ids.push(p.id); });
    (appState.onlinePackages || []).forEach(function(p){ if (p && p.id != null) ids.push(p.id); });
    appState.purchasedPackages = ids;
}
window.grantAdminAllPackages = grantAdminAllPackages;

function basariliGiris(userEmail, userPhone = "", userName = "") {
    appState.currentUser = userEmail;
    appState.currentUserPhone = userPhone;
    appState.currentUserName = userName;
    appState.userRole = selectedRole;
    
    if (!isFirebaseReady || selectedRole === 'admin') {
        localStorage.setItem('mockSession', JSON.stringify({ email: userEmail, phone: userPhone, name: userName, role: selectedRole }));
    }

    if (!isFirebaseReady) {
        // Eğer öğrenci giriş yapıyorsa (Firebase yokken) verilerini yükle
        if (selectedRole === 'student') {
            let users = JSON.parse(localStorage.getItem('mockUsers') || '{}');
            if (users[userEmail]) {
                appState.purchasedPackages = users[userEmail].purchasedPackages || [];
                if (!appState.studentProgress["self"]) appState.studentProgress["self"] = {};
                appState.studentProgress["self"][userEmail] = users[userEmail].progress || {};
            }
        }
    }

    // YÖNETİCİ MODU (FIREBASE OLSUN VEYA OLMASIN): Tüm paketlere test amaçlı erişim sağla
    if (selectedRole === 'admin') {
        grantAdminAllPackages();
        if (!appState.studentProgress["self"]) appState.studentProgress["self"] = {};
        appState.studentProgress["self"][userEmail] = {};
    }
    
    // Modal varsa kapat
    const modal = document.getElementById('login-modal');
    if(modal) modal.style.display = 'none';

    updateHeaderUI();

    // Eğer Checkout sayfasındaysa Checkout görünümünü güncelle
    if (appState.currentView === 'checkout-section') {
        renderCheckoutAuthView();
    } else {
        initApp();
    }
}

/* ======================================================================
   ÇIKIŞ ONAYI  —  başlıktaki çıkış tuşu buraya bağlıdır.
   ----------------------------------------------------------------------
   Öğrenci/öğretmen/yönetici tek dokunuşla oturumunu kaybetmesin diye
   önce "emin misiniz?" sorulur. Onay penceresi sitenin kendi llOnay
   modalıdır (listelerim.js); o yüklenmemişse tarayıcının confirm'ine
   düşülür — hiçbir durumda sorulmadan çıkılmaz.

   DİKKAT: cikisYap() SORMADAN çıkar; router.js canlı derse davetle
   girilince öğretmeni programla düşürmek için onu çağırıyor. Soru
   yalnız KULLANICI tuşa bastığında sorulmalı, o yüzden ayrı fonksiyon.
   ====================================================================== */
function cikisOnayla() {
    var misafir = false;
    try { misafir = (typeof appState !== 'undefined' && appState.currentUser === "Misafir Öğrenci"); } catch (e) { }
    if (misafir) { cikisYap(); return; }   /* misafirin kaybedecek oturumu yok */

    var rol = '';
    try { rol = (typeof appState !== 'undefined' && appState.userRole) || ''; } catch (e) { }
    var rolAdi = rol === 'admin' ? 'Yönetici' : (rol === 'teacher' ? 'Öğretmen' : 'Öğrenci');
    var kisi = '';
    try {
        var a = (typeof appState !== 'undefined') ? appState : {};
        kisi = (a.currentUserName && a.currentUserName !== 'Öğrenci' && a.currentUserName !== 'Belirtilmedi')
            ? a.currentUserName : (a.currentUser || '');
    } catch (e) { }

    var mesaj = rolAdi + ' oturumunu kapatıyorsunuz' + (kisi ? ' (' + kisi + ')' : '') + '.\n' +
        'Çıkınca misafir görünümüne dönersiniz; kayıtlı bilgileriniz silinmez.\n\n' +
        'Çıkış yapmak istediğinize emin misiniz?';

    if (typeof window.llOnay === 'function') {
        window.llOnay(mesaj, cikisYap, { baslik: '⚠️ Emin misiniz?', evet: 'Çıkış Yap' });
        return;
    }
    if (window.confirm(mesaj)) cikisYap();
}

function cikisYap() {
    window._llLoadedUid = null; // Listelerim'i yeni oturumda tazele
    localStorage.removeItem('mockSession');
    if (isFirebaseReady) {
        firebase.auth().signOut().then(() => {
            initAppAsGuest();
        }).catch((error) => { console.error("Çıkış hatası:", error); });
    } else {
        initAppAsGuest();
    }
}

function updateHeaderUI() {
    const isGuest = appState.currentUser === "Misafir Öğrenci";
    let roleText = isGuest ? "" : (appState.userRole === 'admin' ? 'Yönetici: ' : (appState.userRole === 'teacher' ? 'Öğretmen: ' : 'Öğrenci: '));
    const userInfoEl = document.getElementById('user-info');
    
    if (isGuest) {
        userInfoEl.style.display = 'none';
        userInfoEl.innerText = '';
    } else {
        userInfoEl.style.display = 'flex';
        const _dispName = (appState.currentUserName && appState.currentUserName !== "Öğrenci" && appState.currentUserName !== "Belirtilmedi") ? appState.currentUserName : (appState.currentUser || "");
        /* Baslikta AD-SOYADIN BAS HARFLERI + rol emojisi gorunur:
           yuvarlak rozette bas harfler (orn. GD), kosesinde rolu anlatan
           kucuk emoji (yonetici 😎, ogretmen 🧑‍🏫, ogrenci 🎓 — cinsiyete gore).
           Tek kelime/e-posta ise ilk iki harf alinir. Tam ad fare ipucunda.  */
        var _g = appState.currentUserGender;
        const _rolEmoji = (appState.userRole === 'admin') ? '😎'
            : (appState.userRole === 'teacher') ? (_g === 'kadin' ? '👩‍🏫' : (_g === 'erkek' ? '👨‍🏫' : '🧑‍🏫'))
            : (_g === 'kadin' ? '👩‍🎓' : (_g === 'erkek' ? '👨‍🎓' : '🎓'));
        var _parcalar = String(_dispName).trim().split(/\s+/).filter(Boolean);
        var _bas = '';
        if (_parcalar.length >= 2) _bas = _parcalar[0].charAt(0) + _parcalar[_parcalar.length - 1].charAt(0);
        else if (_parcalar.length === 1) _bas = _parcalar[0].slice(0, 2);
        try { _bas = _bas.toLocaleUpperCase('tr-TR'); } catch (e) { _bas = _bas.toUpperCase(); }
        userInfoEl.title = roleText + _dispName;
        userInfoEl.innerHTML =
            '<span class="uinfo-avatar" style="position:relative; display:inline-flex; align-items:center; justify-content:center;' +
            ' width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.2);' +
            ' border:2px solid rgba(255,255,255,0.85); color:#fff; font-weight:800; font-size:0.92rem;' +
            ' letter-spacing:0.5px; user-select:none;">' + _bas +
            '<span style="position:absolute; right:-7px; bottom:-7px; font-size:15px; line-height:1;' +
            ' filter:drop-shadow(0 1px 2px rgba(0,0,0,0.35)); pointer-events:none;">' + _rolEmoji + '</span></span>';
    }
    
    document.getElementById('logout-btn').style.display = isGuest ? 'none' : 'inline-block';

    /* Basliktaki OKUL tusu: yalniz ogretmen/yonetici gorur. Sitenin her
       yerinden ayni pencereyi acar (llOkulPopupAc) — sinif adi rozeti ve
       sekme cubugundaki tusla birebir ayni icerik. */
    try {
        var _okulBtn = document.getElementById('header-okul-btn');
        if (_okulBtn) {
            var _ogrMi = !isGuest && (appState.userRole === 'teacher' || appState.userRole === 'admin');
            _okulBtn.classList.toggle('gor', !!_ogrMi);
            /* SINIF VERISINI ONDEN ISIT: ogretmen giris yapar yapmaz sinif
               listeleri arka planda yuklenir. Eskiden veri yalnizca
               Listelerim'e (ya da profile) ugraninca geliyordu; bu yuzden
               basliktaki okul tusuna ILK basista pencere bos aciliyor,
               ogretmen "once profile girmem lazim" saniyordu. */
            if (_ogrMi && !window._llVeriIsindi) {
                window._llVeriIsindi = true;
                setTimeout(function () {
                    try { if (typeof initListelerim === 'function') initListelerim(); } catch (e) { }
                }, 400);
            }
        }
    } catch (e) { }
    
    // Eğer Header'da giriş butonu koymak isterseniz
    const headerLoginBtn = document.getElementById('header-login-btn');
    if(headerLoginBtn) headerLoginBtn.style.display = isGuest ? 'inline-block' : 'none';

    // Öğrenci profili butonu
    const profileBtn = document.getElementById('nav-student-profile');
    if (profileBtn) {
        profileBtn.style.display = (!isGuest && (appState.userRole === 'student' || appState.userRole === 'admin')) ? 'inline-block' : 'none';
    }

    // Yonetici degilse yan paneli kaldir
    if (typeof hideAdminDock === 'function' && appState.userRole !== 'admin') hideAdminDock();

    // Aktif ders kontrolünü tetikle
    checkActiveLessonStatus();

    // Mesaj bildirimi (yeşil nokta) kontrolü — girişte hemen bak
    // Mesaj bildirimi: gercek zamanli dinleyiciyi baslat (rol artik yuklu)
    if (typeof window._refreshMsgDot === 'function') window._refreshMsgDot();
    else if (typeof checkUnreadMessages === 'function') setTimeout(checkUnreadMessages, 800);

    // Müfredat (kazanimData) düzenlemelerini Firestore'dan yükle ve tabanın üstüne bindir
    if (typeof loadMufredat === 'function') loadMufredat();
    if (typeof loadTeacherSchedules === 'function') loadTeacherSchedules();
}

function checkActiveLessonStatus() {
    const interactiveSection = document.getElementById('interactive-class-section');
    if (!interactiveSection) return;

    if (appState.currentUser === "Misafir Öğrenci") {
        interactiveSection.style.display = 'none';
        return;
    }

    if (appState.userRole === 'admin' || appState.userRole === 'teacher') {
        interactiveSection.style.display = 'block';
        const infoEl = document.getElementById('interactive-class-info');
        if(infoEl) infoEl.innerText = "Yönetici / Öğretmen Modu - Ders Ekranı her zaman açık.";
        return;
    }

    const now = new Date();
    const currentTotalM = now.getHours() * 60 + now.getMinutes();
    const dayMap = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    const currentDayStr = dayMap[now.getDay()];

    let hasActiveLesson = false;
    let upcomingTimeStr = "";
    
    const studentLessons = appState.approvedLessons.filter(l => l.studentEmail === appState.currentUser);
    
    for (let lesson of studentLessons) {
        for (let slot of lesson.slots) {
            const parts = slot.split(' ');
            if (parts.length < 2) continue;
            
            const slotDay = parts[0];
            const slotTime = parts[1];
            
            if (slotDay !== currentDayStr) continue;

            const startH = parseInt(slotTime.split(':')[0]);
            const startM = parseInt(slotTime.split(':')[1]);
            const startTotalM = startH * 60 + startM;
            const endTotalM = startTotalM + 40;
            
            if (currentTotalM >= startTotalM - 5 && currentTotalM <= endTotalM) {
                hasActiveLesson = true;
                upcomingTimeStr = slotTime;
                break;
            }
        }
        if (hasActiveLesson) break;
    }

    if (hasActiveLesson) {
        interactiveSection.style.display = 'block';
        const infoEl = document.getElementById('interactive-class-info');
        if(infoEl) infoEl.innerText = `Bugün saat ${upcomingTimeStr} dersiniz için sınıf aktiftir. Derse katılabilirsiniz!`;
    } else {
        interactiveSection.style.display = 'none';
        // Ekran açıksa da kapat
        const videoCont = document.getElementById('lesson-video-container');
        const joinCont = document.getElementById('join-lesson-container');
        if(videoCont) videoCont.style.display = 'none';
        if(joinCont) joinCont.style.display = 'block';
    }
}

// Her 30 saniyede bir ders durumunu kontrol et
setInterval(checkActiveLessonStatus, 30000);

function showLoginModal() {
    const modal = document.getElementById('login-modal');
    if(modal) {
        // Formu temizle ve autofill
        prefillEmail();
        document.getElementById('password').value = "";
        const rep = document.getElementById('re-password');
        if(rep) rep.value = "";
        document.getElementById('hata-mesaji').innerText = "";
        modal.style.display = 'flex';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if(modal) modal.style.display = 'none';
}

function prefillEmail() {
    const saved = localStorage.getItem('savedEmail');
    if(saved) {
        document.getElementById('email').value = saved;
    }
}



// Birlesik sayfa (index kart menusu) icin: hub'in openLoginModal cagrisini kurslar auth'una bagla
if (typeof window.openLoginModal !== 'function') {
    window.openLoginModal = function() { if (typeof showLoginModal === 'function') showLoginModal(); };
}