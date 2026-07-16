const firebaseConfig = {
    apiKey: "AIzaSyBGIQPJ_Bjm5I3-QmrrGpLR5MqmG3S5F8w",
    authDomain: "kidefarapca-98f9c.firebaseapp.com",
    projectId: "kidefarapca-98f9c",
    storageBucket: "kidefarapca-98f9c.firebasestorage.app",
    messagingSenderId: "503317118211",
    appId: "1:503317118211:web:a9c8cf15b854597e0b3d36",
    measurementId: "G-HYY6T2EDKY"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

let isLoginMode = true;
let selectedRole = 'student';

function setRole(role) {
    selectedRole = role;
    document.getElementById('btn-teacher').classList.remove('active-role');
    document.getElementById('btn-student').classList.remove('active-role');
    document.getElementById('btn-' + role).classList.add('active-role');
}

function openLoginModal(hideStudent = false) {
    const studentBtn = document.getElementById('btn-student');
    if (studentBtn) {
        studentBtn.style.display = hideStudent ? 'none' : '';
    }
    document.getElementById('login-modal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
    window.pendingRedirectUrl = null;
}

function moduDegistir() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Giriş Paneli" : "Kayıt Paneli";
    document.getElementById('auth-action-btn').innerText = isLoginMode ? "Giriş Yap" : "Kayıt Ol";
    document.getElementById('auth-switch-text').innerText = isLoginMode ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?";
    document.getElementById('auth-switch-link').innerText = isLoginMode ? "Kayıt Ol" : "Giriş Yap";
    
    document.getElementById('re-password-group').style.display = isLoginMode ? "none" : "flex";
    document.getElementById('hata-mesaji').innerText = "";
}

function togglePassword(id) {
    const el = document.getElementById(id);
    if (el.type === "password") {
        el.type = "text";
    } else {
        el.type = "password";
    }
}

async function authIslemi() {
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    const errEl = document.getElementById('hata-mesaji');
    errEl.innerText = "";

    if (!email || !pass) {
        errEl.innerText = "Lütfen tüm alanları doldurun.";
        return;
    }

    try {
        if (isLoginMode) {
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            const cred = await firebase.auth().signInWithEmailAndPassword(email, pass);
            
            // Oturum için seçilen rolü kaydet
            localStorage.setItem('activeSessionRole', selectedRole);

            // Başarılı giriş
            alert("Giriş Başarılı!");
            if (window.pendingRedirectUrl) {
                if (window.pendingRedirectUrl.includes('listelerim.html') || window.pendingRedirectUrl.includes('kaliplartablosu.html')) {
                    let tabName = window.pendingRedirectUrl.includes('listelerim.html') ? 'listelerimTab' : 'kaliplarTab';
                    window.open(window.pendingRedirectUrl, tabName);
                    closeLoginModal();
                } else {
                    window.location.href = window.pendingRedirectUrl;
                }
                window.pendingRedirectUrl = null;
            }
        } else {
            const rePass = document.getElementById('re-password').value;
            if (pass !== rePass) {
                errEl.innerText = "Şifreler eşleşmiyor!";
                return;
            }
            const cred = await firebase.auth().createUserWithEmailAndPassword(email, pass);
            await db.collection("kullanicilar").doc(cred.user.uid).set({
                email: email,
                role: selectedRole,
                packages: [],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            localStorage.setItem('activeSessionRole', selectedRole);
            alert("Kayıt Başarılı!");
            if (window.pendingRedirectUrl) {
                if (window.pendingRedirectUrl.includes('listelerim.html') || window.pendingRedirectUrl.includes('kaliplartablosu.html')) {
                    let tabName = window.pendingRedirectUrl.includes('listelerim.html') ? 'listelerimTab' : 'kaliplarTab';
                    window.open(window.pendingRedirectUrl, tabName);
                    closeLoginModal();
                } else {
                    window.location.href = window.pendingRedirectUrl;
                }
                window.pendingRedirectUrl = null;
            }
        }
    } catch (e) {
        errEl.innerText = e.message;
    }
}

// State Observer
firebase.auth().onAuthStateChanged(async (user) => {
    const authBtn = document.getElementById('header-auth-btn');
    const listelerimBtn = document.getElementById('listelerim-btn');

    if (user) {
        document.getElementById('login-modal').style.display = 'none';
        
        if (authBtn) {
            authBtn.innerText = "Çıkış Yap";
            authBtn.style.background = "#e74c3c";
            authBtn.onclick = cikisYap;
        }

        try {
            const doc = await db.collection("kullanicilar").doc(user.uid).get();
            if (doc.exists) {
                const userData = doc.data();
                const activeRole = localStorage.getItem('activeSessionRole') || 'student';
                const isTeacherAcc = userData.role === 'teacher' || userData.teacherStaticCode || userData.userData;
                
                let isTeacher = false;
                let isStudent = false;

                if (isTeacherAcc) {
                    if (activeRole === 'student') {
                        isStudent = true; // Öğretmen öğrenci olarak girmiş
                    } else {
                        isTeacher = true; // Öğretmen öğretmen olarak girmiş
                    }
                } else {
                    isStudent = true; // Öğrenci hesabı her halükarda öğrencidir (öğretmen seçse bile)
                }
                
                window.hasTeacherAccess = isTeacher;
                
                const roleBadge = document.getElementById('user-role-badge');
                if (roleBadge) {
                    roleBadge.style.display = 'inline-block';
                    if (isTeacher) roleBadge.innerText = '👨‍🏫 Öğretmen';
                    else if (isStudent) roleBadge.innerText = '🎓 Öğrenci';
                    else if (userData.role === 'admin') roleBadge.innerText = '👑 Yönetici';
                    else roleBadge.innerText = userData.role || '🎓 Öğrenci'; // Default to student if unknown
                }

                if (listelerimBtn) {
                    if (isStudent) {
                        listelerimBtn.style.display = 'none';
                    } else {
                        listelerimBtn.style.display = '';
                    }
                }
            }
        } catch(e) {
            console.error("Rol kontrol hatası:", e);
        }

    } else {
        // Misafir Kullanıcı
        const roleBadge = document.getElementById('user-role-badge');
        if (roleBadge) roleBadge.style.display = 'none';

        if (authBtn) {
            authBtn.innerText = "Giriş Yap / Kayıt";
            authBtn.style.background = "#3498db";
            authBtn.onclick = function() { openLoginModal(false); };
        }
        if (listelerimBtn) {
            listelerimBtn.style.display = ''; // Misafirken görünsün
        }
    }
});

function cikisYap() {
    firebase.auth().signOut();
}

// Öğretmen Araçları (Listelerim) Doğal Tıklama Kontrolü
function handleTeacherClick(event, targetUrl) {
    const user = firebase.auth().currentUser;
    const errEl = document.getElementById('hata-mesaji');

    if (!user) {
        event.preventDefault();
        setRole('teacher');
        errEl.innerText = "Lütfen Öğretmen olarak giriş yapın.";
        window.pendingRedirectUrl = targetUrl;
        openLoginModal(true);
        return false;
    }
    
    if (!window.hasTeacherAccess) {
        event.preventDefault();
        setRole('teacher');
        errEl.innerText = "Şu anda Öğrenci olarak giriş yaptınız veya öğretmen yetkiniz yok. Lütfen Öğretmen sekmesinden giriş yapın.";
        openLoginModal(true);
        return false;
    }

    // NATIVE TARAYICI DAVRANIŞINA İZİN VER: <a> etiketindeki target="listelerimTab" çalışacak
    return true;
}

// Kalıplar Tablosu gibi herkese açık (ama giriş gerektiren) alanlar için
function handleAnyLoginClick(event, targetUrl) {
    const user = firebase.auth().currentUser;
    if (!user) {
        event.preventDefault();
        window.pendingRedirectUrl = targetUrl;
        openLoginModal(false);
        return false;
    }
    
    // NATIVE TARAYICI DAVRANIŞINA İZİN VER: <a> etiketindeki target="kaliplarTab" çalışacak
    return true;
}

// Kurs / Paket kontrolü
async function checkPackageAccess(packageId, targetUrl) {
    const user = firebase.auth().currentUser;
    if (!user) {
        window.pendingRedirectUrl = targetUrl;
        openLoginModal(false);
        return;
    }
    
    try {
        const doc = await db.collection("kullanicilar").doc(user.uid).get();
        if (doc.exists) {
            const userData = doc.data();
            const packages = userData.packages || [];
            const isTeacher = userData.role === 'teacher' || userData.teacherStaticCode;
            
            if (packages.includes(packageId) || isTeacher) {
                // Paketi varsa veya öğretmense girebilir
                window.location.href = targetUrl;
            } else {
                openPackageModal();
            }
        } else {
            openPackageModal();
        }
    } catch(e) {
        console.error("Paket kontrol hatası:", e);
        openPackageModal();
    }
}
