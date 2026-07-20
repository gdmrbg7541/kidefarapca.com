/* ==========================================
   7. UNIFIED CHECKOUT FLOW (ÖDEME VE KAYIT TEK SAYFADA)
   ========================================== */
function openCheckoutFlow(type, packageId) {
    appState.paymentType = type; // Ne tür bir ödeme yapıldığını takip edelim
    
    const checkoutInfo = document.getElementById('checkout-package-info');
    if (!checkoutInfo) return;

    if (type === 'online_multiple') {
        appState.selectedPackageForPayment = null; 
        const pkgs = appState.selectedOnlinePackages;
        const total = pkgs.reduce((sum, p) => sum + p.price, 0);
        
        checkoutInfo.innerHTML = `
            <h3>Seçilen Paketler (Canlı Ders)</h3>
            <div class="checkout-pkg-card">
                ${pkgs.map(p => `<div style="margin-bottom: 10px;"><strong>${p.name}</strong><br><span style="font-size:0.9rem; color:#555;">${p.price.toLocaleString('tr-TR')} ₺</span></div>`).join('')}
                <hr style="border-color:rgba(0,0,0,0.1); margin: 15px 0;">
                <div class="checkout-price" style="color:#20C997;">Toplam: ${total.toLocaleString('tr-TR')} ₺</div>
            </div>
            <div id="reusable-slots-table-container">
                ${getCheckoutSlotsHtml()}
            </div>
            <div class="iban-box glass-card mt-20">
                <h4>Banka Havalesi / EFT</h4>
                <p>Aşağıdaki IBAN'a ödemeyi yaptıktan sonra işlemi onaylayın. Açıklama kısmına ad-soyadınızı ve aldığınız paketi yazınız.</p>
                <div class="iban-number">TR 8600 0100 2588 6536 4918 5007</div>
                <div style="margin-top:8px; font-weight:bold; color:#333;">Ad Soyad: Geylani Demirbağ</div>
                <button class="btn btn-secondary mt-10" onclick="copyIban()">IBAN Kopyala</button>
            </div>
        `;
    } else if (type === 'offline_multiple') {
        appState.selectedPackageForPayment = null; 
        const pkgs = appState.selectedOfflinePackages.map(id => appState.packages.find(p => p.id === id)).filter(Boolean);
        let total = 0;
        pkgs.forEach(p => {
            total += typeof p.price === 'number' ? p.price : parseInt(p.price.replace(/[^0-9]/g, ''));
        });
        
        checkoutInfo.innerHTML = `
            <h3>Seçilen Paketler (Özel Eğitim)</h3>
            <div class="checkout-pkg-card">
                ${pkgs.map(p => `<div style="margin-bottom: 10px;"><strong>${p.title}</strong><br><span style="font-size:0.9rem; color:#555;">${p.price}</span></div>`).join('')}
                <hr style="border-color:rgba(0,0,0,0.1); margin: 15px 0;">
                <div class="checkout-price" style="color:#20C997;">Toplam: ${total.toLocaleString('tr-TR')} ₺</div>
            </div>
            <div class="iban-box glass-card mt-20">
                <h4>Banka Havalesi / EFT</h4>
                <p>Aşağıdaki IBAN'a ödemeyi yaptıktan sonra işlemi onaylayın. Açıklama kısmına ad-soyadınızı ve aldığınız paketi yazınız.</p>
                <div class="iban-number">TR 8600 0100 2588 6536 4918 5007</div>
                <div style="margin-top:8px; font-weight:bold; color:#333;">Ad Soyad: Geylani Demirbağ</div>
                <button class="btn btn-secondary mt-10" onclick="copyIban()">IBAN Kopyala</button>
            </div>
        `;
    } else {
        let pkg;
        if (type === 'offline') {
            pkg = appState.packages.find(p => p.id === packageId);
        } else {
            pkg = appState.onlinePackages.find(p => p.id === packageId);
        }

        if(!pkg) return;
        appState.selectedPackageForPayment = pkg;
        
        checkoutInfo.innerHTML = `
            <h3>Seçilen Paket</h3>
            <div class="checkout-pkg-card">
                <h4>${pkg.title || pkg.name}</h4>
                <p>${pkg.description || pkg.desc || ''}</p>
                <div class="checkout-price">${typeof pkg.price === 'number' ? pkg.price.toLocaleString('tr-TR') + ' ₺' : pkg.price}</div>
            </div>
            <div class="iban-box glass-card mt-20">
                <h4>Banka Havalesi / EFT</h4>
                <p>Aşağıdaki IBAN'a ödemeyi yaptıktan sonra işlemi onaylayın. Açıklama kısmına ad-soyadınızı ve aldığınız paketi yazınız.</p>
                <div class="iban-number">TR 8600 0100 2588 6536 4918 5007</div>
                <div style="margin-top:8px; font-weight:bold; color:#333;">Ad Soyad: Geylani Demirbağ</div>
                <button class="btn btn-secondary mt-10" onclick="copyIban()">IBAN Kopyala</button>
            </div>
        `;
    }

    // Sol Taraf (Auth veya Giriş Yapıldı bilgisi)
    renderCheckoutAuthView();
    prefillEmail();
    changeView('checkout-section');
}

function renderCheckoutAuthView() {
    const authForm = document.getElementById('checkout-auth-form');
    const loggedInView = document.getElementById('checkout-logged-in-view');

    if (appState.currentUser !== "Misafir Öğrenci") {
        // Zaten giriş yapmış
        if(authForm) authForm.style.display = 'none';
        if(loggedInView) {
            loggedInView.style.display = 'block';
            document.getElementById('checkout-user-email').innerText = appState.currentUser;
        }
    } else {
        // Misafir
        if(authForm) authForm.style.display = 'block';
        if(loggedInView) loggedInView.style.display = 'none';
    }
}

function copyIban() {
    navigator.clipboard.writeText("TR860001002588653649185007").then(() => {
        showCustomAlert("IBAN panoya kopyalandı!");
    });
}

function confirmPurchase() {
    if (appState.currentUser === "Misafir Öğrenci") {
        showCustomAlert("Lütfen önce giriş yapın veya kayıt olun.");
        return;
    }

    const _goHome = () => changeView(document.getElementById('home-hub-section') ? 'home-hub-section' : 'dashboard-section');

    // ÖDEME ONAY AKIŞI: Havale sonrası sipariş "onay bekliyor" olarak YÖNETİCİYE düşer.
    // Yönetici onaylayınca paket/dersler öğrencinin hesabına tanımlanır.
    if (appState.paymentType === 'online_multiple') {
        const teacherSel = document.getElementById('teacher-select');
        const selectedTeacherId = teacherSel ? teacherSel.value : 'any';
        const pkgs = appState.selectedOnlinePackages || [];
        if (pkgs.length === 0) { showCustomAlert("Seçili paket bulunamadı."); return; }
        const total = pkgs.reduce((s, p) => s + (typeof p.price === 'number' ? p.price : 0), 0);
        const ok = _submitOrder({
            type: 'online',
            packages: pkgs.map(p => ({ id: p.id, name: p.name, price: p.price, hours: p.hours || '' })),
            packageNames: pkgs.map(p => p.name).join(', '),
            slots: [...(appState.selectedSlots || [])],
            teacherId: selectedTeacherId || 'any',
            total: total
        }, "Ödeme bildiriminiz alındı ✅\nYönetici onayladıktan sonra dersleriniz takviminize tanımlanacaktır.");
        if (ok) {
            appState.selectedOnlinePackages = [];
            appState.selectedSlots = [];
            appState.customLessonCount = 0;
            _goHome();
        }
        return;
    }

    if (appState.paymentType === 'offline_multiple') {
        const ids = [...(appState.selectedOfflinePackages || [])];
        if (ids.length === 0) { showCustomAlert("Seçili paket bulunamadı."); return; }
        const titles = ids.map(id => { const p = appState.packages.find(x => x.id === id); return p ? p.title : ('Paket ' + id); });
        const total = ids.reduce((s, id) => { const p = appState.packages.find(x => x.id === id); return s + (p && typeof p.price === 'number' ? p.price : 0); }, 0);
        const ok = _submitOrder({
            type: 'offline',
            packageIds: ids,
            packageNames: titles.join(', '),
            total: total
        }, "Ödeme bildiriminiz alındı ✅\nYönetici onayladıktan sonra paketleriniz hesabınıza tanımlanacaktır.");
        if (ok) { appState.selectedOfflinePackages = []; _goHome(); }
        return;
    }

    // Tekli paket (eski sistem fallback) — o da onaya düşsün
    const pkg = appState.selectedPackageForPayment;
    if (!pkg) return;
    const isOffline = !!appState.packages.find(p => p.id === pkg.id);
    const ok = isOffline
        ? _submitOrder({ type: 'offline', packageIds: [pkg.id], packageNames: pkg.title || ('Paket ' + pkg.id), total: (typeof pkg.price === 'number' ? pkg.price : 0) },
            "Ödeme bildiriminiz alındı ✅\nYönetici onayladıktan sonra \"" + (pkg.title || '') + "\" hesabınıza tanımlanacaktır.")
        : _submitOrder({ type: 'online', packages: [{ id: pkg.id, name: pkg.name || pkg.title, price: pkg.price, hours: pkg.hours || '' }], packageNames: pkg.name || pkg.title || '', slots: [...(appState.selectedSlots || [])], teacherId: 'any', total: (typeof pkg.price === 'number' ? pkg.price : 0) },
            "Ödeme bildiriminiz alındı ✅\nYönetici onayladıktan sonra hesabınıza tanımlanacaktır.");
    if (ok) _goHome();
}

// Ödeme sonrası siparişi Firestore'a "onay bekliyor" olarak yaz (yönetici onaylar)
function _submitOrder(order, successMsg) {
    const fbUser = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
    if (!fbUser || typeof db === 'undefined' || !db) {
        showCustomAlert("Sipariş oluşturulamadı. Lütfen giriş yaptığınızdan emin olun.");
        return false;
    }
    order.uid = fbUser.uid;
    order.email = appState.currentUser;
    order.name = appState.currentUserName || "Öğrenci";
    order.phone = appState.currentUserPhone || "";
    order.status = 'pending';
    order.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    db.collection('siparisler').add(order)
        .then(function () { showCustomAlert(successMsg); })
        .catch(function (e) { showCustomAlert("Sipariş kaydedilemedi: " + (e.message || e)); });
    return true;
}

function saveStudentData() {
    // Birlesik: paket sahipligi kullanicilar/{uid}.packages icinde tutulur
    if (appState.userRole !== 'student' && appState.userRole !== 'teacher') return;
    const fbUser = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
    if (!fbUser) return;
    db.collection('kullanicilar').doc(fbUser.uid).set({
        packages: appState.purchasedPackages,
        progress: appState.studentProgress["self"] ? appState.studentProgress["self"][appState.currentUser] : {}
    }, { merge: true }).catch(err => console.error("Kullanıcı verisi kaydedilemedi:", err));
}
