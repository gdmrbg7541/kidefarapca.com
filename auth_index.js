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
            await firebase.auth().signInWithEmailAndPassword(email, pass);
            // Başarılı giriş
            alert("Giriş Başarılı!");
            if (window.pendingRedirectUrl) {
                window.location.href = window.pendingRedirectUrl;
                window.pendingRedirectUrl = null;
            }
        } else {
            const rePass = document.getElementById('re-password').value;
            if (pass !== rePass) {
                errEl.innerText = "Şifreler eşleşmiyor!";
                return;
            }
            const cred = await firebase.auth().createUserWithEmailAndPassword(email, pass);
            await db.collection("users").doc(cred.user.uid).set({
                email: email,
                role: selectedRole,
                packages: [],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert("Kayıt Başarılı!");
            if (window.pendingRedirectUrl) {
                window.location.href = window.pendingRedirectUrl;
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

    if (user) {
        document.getElementById('login-modal').style.display = 'none';
        
        if (authBtn) {
            authBtn.innerText = "Çıkış Yap";
            authBtn.style.background = "#e74c3c";
            authBtn.onclick = cikisYap;
        }
    } else {
        // Misafir Kullanıcı
        if (authBtn) {
            authBtn.innerText = "Giriş Yap / Kayıt";
            authBtn.style.background = "#3498db";
            authBtn.onclick = function() { document.getElementById('login-modal').style.display = 'flex'; };
        }
    }
});

function cikisYap() {
    firebase.auth().signOut();
}

// Öğretmen Araçları (Listelerim) kontrolü
async function checkTeacherAccess(targetUrl) {
    const user = firebase.auth().currentUser;
    const errEl = document.getElementById('hata-mesaji');
    const modal = document.getElementById('login-modal');

    if (!user) {
        setRole('teacher');
        errEl.innerText = "Lütfen Öğretmen olarak giriş yapın.";
        window.pendingRedirectUrl = targetUrl;
        modal.style.display = 'flex';
        return;
    }
    
    try {
        const doc = await db.collection("users").doc(user.uid).get();
        if (doc.exists) {
            const userData = doc.data();
            if (userData.role === 'teacher') {
                window.location.href = targetUrl;
            } else {
                setRole('teacher');
                errEl.innerText = "Sadece öğretmen hesapları bu alana girebilir. Öğretmen misiniz?";
                modal.style.display = 'flex';
                // Kullanıcıyı çıkarmıyoruz ki diğer alanları gezebilsin, ama bu butona basarsa uyarı görüyor.
            }
        } else {
            setRole('teacher');
            errEl.innerText = "Kullanıcı bilgisi bulunamadı.";
            modal.style.display = 'flex';
        }
    } catch(e) {
        console.error("Öğretmen kontrol hatası:", e);
    }
}

// Kurs / Paket kontrolü
async function checkPackageAccess(packageId, targetUrl) {
    const user = firebase.auth().currentUser;
    if (!user) {
        window.pendingRedirectUrl = targetUrl;
        document.getElementById('login-modal').style.display = 'flex';
        return;
    }
    
    try {
        const doc = await db.collection("users").doc(user.uid).get();
        if (doc.exists) {
            const userData = doc.data();
            const packages = userData.packages || [];
            
            if (packages.includes(packageId) || userData.role === 'teacher') {
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
