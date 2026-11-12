
/* ==========================================================================
   BAĞ BELGESİ KİMLİĞİ  —  bir öğrenci birden çok öğretmenin öğrencisi
   olabildiği için ogrenciBaglari / ogrenciOzet belgelerinin kimliği
   ÖĞRENCİ + ÖĞRETMEN çiftidir:  {ogrenciUid}__{ogretmenUid}
   Kuralın tek kaynağı hesap/ogrencihesap.js (OH.bagId). Bu dosya ondan
   önce yüklenebildiği için aynı kural burada yedeklenir — değiştirirsen
   İKİSİNİ de değiştir.
   ========================================================================== */
function taBagKimlik(ogrenciUid, ogretmenUid) {
    try { if (window.OH && OH.bagId) return OH.bagId(ogrenciUid, ogretmenUid); } catch (e) { }
    return String(ogrenciUid || '') + '__' + String(ogretmenUid || '');
}
/* ==========================================
   YÖNETİCİ YAN PANELİ (kalıcı dock)
   ========================================== */
function ensureAdminDock() {
    if (!document.getElementById('admin-dock')) {
        const dock = document.createElement('div');
        dock.id = 'admin-dock';
        dock.innerHTML =
            '<div class="dock-title">' +
                '<h3>👨‍💼 Yönetici Paneli</h3>' +
                '<button id="admin-dock-close" title="Paneli gizle" onclick="toggleAdminDock(false)">&times;</button>' +
            '</div>' +
            '<div id="admin-dock-body"></div>';
        document.body.appendChild(dock);

        const tab = document.createElement('div');
        tab.id = 'admin-dock-tab';
        tab.innerHTML = '⚙️ Panel';
        tab.onclick = function(){ toggleAdminDock(true); };
        document.body.appendChild(tab);

        // Admin girince panel KAPALI başlasın (otomatik açılmaz). Açmak için yandaki "⚙️ Panel" sekmesine tıklanır.
        dock.classList.add('collapsed');
        document.body.classList.add('admin-dock-collapsed');
    }
}

function openAdminDock() {
    const dock = document.getElementById('admin-dock');
    if (!dock) return;
    dock.classList.remove('collapsed');
    document.body.classList.add('admin-dock-open');
    document.body.classList.remove('admin-dock-collapsed');
}

function toggleAdminDock(forceOpen) {
    const dock = document.getElementById('admin-dock');
    if (!dock) return;
    const shouldOpen = (typeof forceOpen === 'boolean') ? forceOpen : dock.classList.contains('collapsed');
    if (shouldOpen) {
        openAdminDock();
    } else {
        dock.classList.add('collapsed');
        document.body.classList.remove('admin-dock-open');
        document.body.classList.add('admin-dock-collapsed');
    }
}

function hideAdminDock() {
    const dock = document.getElementById('admin-dock');
    const tab = document.getElementById('admin-dock-tab');
    if (dock) dock.remove();
    if (tab) tab.remove();
    document.body.classList.remove('admin-dock-open');
    document.body.classList.remove('admin-dock-collapsed');
}

/* ==========================================
   GERİ BİLDİRİM (Öneri/Eleştiri/Soru) — yalnızca yönetici okur
   ========================================== */
function _fbEsc(t){ return String(t==null?'':t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function loadAdminFeedback() {
    const list = document.getElementById('admin-feedback-list');
    if (!list) return;
    list.innerHTML = 'Yükleniyor…';
    try {
        firebase.firestore().collection('mesajlar').orderBy('createdAt','asc').limit(600).get()
        .then(function(snap){
            if (snap.empty) { list.innerHTML = '<p style="color:#888;">Henüz mesaj yok.</p>'; return; }
            var groups = {}, order = [], unreadRefs = [];
            snap.forEach(function(doc){
                var m = doc.data(); var k = m.uid || ('anon-' + doc.id);
                if (!groups[k]) { groups[k] = { uid:m.uid||'', email:m.email||'', ad:m.ad||'Anonim', msgs:[], unread:0 }; order.push(k); }
                var g = groups[k];
                if (m.email) g.email = m.email;
                if (m.ad && m.ad !== 'Anonim') g.ad = m.ad;
                g.msgs.push(m);
                if (m.from === 'user' && !m.readByAdmin) { g.unread++; unreadRefs.push(doc.ref); }
            });
            var html = '';
            order.reverse().forEach(function(k){
                var g = groups[k];
                var canReply = !!g.email;
                html += '<div style="border:1px solid #E9EEF5; border-radius:10px; padding:10px; margin-bottom:12px; background:#fff;">';
                html += '<div style="display:flex; justify-content:space-between; align-items:center;"><strong style="color:#16A085;">' + _fbEsc(g.ad) + '</strong>' + (g.unread ? '<span style="background:#EF5350; color:#fff; border-radius:10px; padding:1px 8px; font-size:11px;">' + g.unread + ' yeni</span>' : '') + '</div>';
                html += '<div style="font-size:12px; color:#888; margin-bottom:6px;">' + (g.email ? _fbEsc(g.email) : 'Anonim ziyaretçi (cevaplanamaz)') + '</div>';
                html += '<div style="max-height:200px; overflow-y:auto; background:#f7f9fc; border-radius:8px; padding:6px;">';
                g.msgs.forEach(function(m){
                    var admin = (m.from === 'admin');
                    html += '<div style="text-align:' + (admin?'right':'left') + '; margin:4px 0;"><span style="display:inline-block; max-width:88%; padding:6px 10px; border-radius:10px; background:' + (admin?'#20C997':'#E9EEF5') + '; color:' + (admin?'#fff':'#333') + '; text-align:left; white-space:pre-wrap; font-size:13px;">' + _fbEsc(m.text||m.mesaj||'') + '</span></div>';
                });
                html += '</div>';
                if (canReply) {
                    var safeAd = _fbEsc(g.ad).replace(/'/g, '');
                    html += '<div style="display:flex; gap:6px; margin-top:8px;"><input id="reply-' + _fbEsc(g.uid) + '" type="text" placeholder="Cevap yazın…" style="flex:1; padding:8px; border:1px solid #E9EEF5; border-radius:8px;"><button onclick="sendAdminReply(\'' + _fbEsc(g.uid) + '\',\'' + _fbEsc(g.email) + '\',\'' + safeAd + '\')" style="background:#20C997; color:#fff; border:none; border-radius:8px; padding:0 14px; cursor:pointer;">Gönder</button></div>';
                }
                html += '</div>';
            });
            list.innerHTML = html;
            unreadRefs.forEach(function(r){ r.update({ readByAdmin:true }).catch(function(){}); });
            if (typeof checkUnreadMessages === 'function') setTimeout(checkUnreadMessages, 900);
        })
        .catch(function(e){ list.innerHTML = '<p style="color:#EF5350;">Yüklenemedi: ' + _fbEsc(e && e.message ? e.message : e) + '</p>'; });
    } catch(e) { list.innerHTML = '<p style="color:#EF5350;">Firebase hazır değil.</p>'; }
}
function sendAdminReply(uid, email, ad) {
    var inp = document.getElementById('reply-' + uid); if (!inp) return;
    var t = (inp.value||'').trim(); if (!t) return; inp.value = '';
    firebase.firestore().collection('mesajlar').add({
        uid: uid, email: email||'', ad: ad||'Kullanıcı',
        from: 'admin', kategori: 'Cevap', text: t,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        readByAdmin: true, readByUser: false
    }).then(function(){ loadAdminFeedback(); }).catch(function(e){ if (typeof showCustomAlert === 'function') showCustomAlert('Gönderilemedi: ' + (e.message||e)); });
}
window.loadAdminFeedback = loadAdminFeedback;
window.sendAdminReply = sendAdminReply;

/* ==========================================
   9. YÖNETİCİ & ÖĞRETMEN PANELLERİ
   ========================================== */
function renderAdminPanel() {
    // Panel artık yandan çıkan dock değil; sayfa içi 'admin-section' bölümüne yazılır
    const adminSection = document.getElementById('admin-section');
    if (!adminSection) return;
    _ogtStil();                                       /* ÖĞRETMENLER BİR ARADA (02.11.2026) */

    adminSection.innerHTML = `
        <div class="glass-card">
            <!-- SAYAÇ KUTUSU (02.11.2026 · 05.11.2026): en üstte, yalnız yönetici; öğretmen ve öğrenci sayısı.
                 Animasyon yok — yönetici: "rakam animasyonunu kaldıralım, en son rakam neyse o görünsün". -->
            ${_aonYoneticiMi() ? _ogsHtml() : ''}
            <!-- ÖĞRETMEN ONAYLARI EN ÜSTTE (27.10.2026): yalnız yönetici; açık başlar,
                 akordiyondan ayrı; liste 30 sn'de bir kendiliğinden yenilenir.
                 ÖĞRETMENLER BİR ARADA (02.11.2026) — yönetici: "öğretmen onayı ve öğretmenler
                 sekmelerini birleştiriyoruz, en yukarda olacaklar, öğretmen onayları açık şekilde
                 kalacak şimdiki gibi". Tek bölüm «👨‍🏫 Öğretmenler»: üstte onaylar (açık), altında
                 öğretmen listesi (açınca okunur, 10 dk önbellek; akordiyonun parçası). -->
            ${_aonYoneticiMi() ? `
            <details class="admin-details aon-ust" id="admin-onay-details" open ontoggle="if(this.open) _aonTik()">
                <summary class="admin-summary">👨‍🏫 Öğretmenler ve Öğrenciler <span id="admin-onay-badge"></span></summary>
                <div style="padding:10px 0 4px;">
                    <!-- AÇIKLAMALAR KALKTI (02.11.2026) — yönetici: "bu açıklamalar olmasın" -->
                    <div class="aon-alt-baslik" style="margin-bottom:10px;">🧑‍🏫 Öğretmen Onayları</div>
                    <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
                        <button class="btn" onclick="loadOgretmenOnaylari()" style="font-size:0.9rem;">🔄 Yenile</button>
                        <span id="admin-onay-zaman" class="aon-zaman">Canlı: yeni kayıt anında düşer</span>
                    </div>
                    <div id="admin-onay-list" style="max-height:400px; overflow-y:auto;">Yükleniyor…</div>
                </div>
                <!-- ÖĞRETMEN LİSTESİ (eski «👨‍🏫 Öğretmenler» bölümü): OKUMA AZALT (27.10.2026) —
                     liste açılınca okunur, 10 dk saklanır. ADLARI DÜZELT (06.10.2026): küçük harfle
                     yazılmış adların baş harfini büyütür. TÜM KAYIT ANKETLERİ (19.10.2026): eski
                     «📋 Kayıt Anketi» akordiyonu burada bir tuş. ÖĞRETMEN TAKVİMİ her öğretmenin
                     penceresinde. 💛 BEKLENEN DESTEK panelin en altında (02.11.2026). -->
                <!-- İKİ SÜTUN (12.11.2026) — yönetici: "masaüstünde iki sekme olarak açılsın, solda öğretmenler sağda öğrenciler".
                     Geniş ekranda bu sarmalayıcı iki eşit sütunlu ızgara olur (_aonIkiKur); dar ekranda düz blok, eski görünüm. -->
                <div class="aog-iki">
                <details class="aog-bolum" id="admin-ogretmen-liste" name="admin-accordion" ontoggle="if(this.open) renderAdminTeacherList('onbellek')">
                    <summary>👥 Öğretmen listesi <small>arama · süzgeç · sıralama</small></summary>
                    <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
                        <button class="btn" onclick="adminAdlariDuzelt()" title="Küçük harfle yazılmış ad ve soyadların baş harflerini büyütür (öğretmen ve öğrenci kayıtlarının hepsinde)"
                                style="background:#EAF4FF; color:#1f5f99; border:1px solid #CFE3F7; border-radius:9px; padding:8px 16px; font-size:.9rem; font-weight:700;">
                            Adları düzelt</button>
                        <button class="btn" onclick="if(window.KidefOgretmenDetay) KidefOgretmenDetay.anketlerAc()"
                                style="background:#F4F0FF; color:#5B3FA8; border:1px solid #E1D8FA; border-radius:9px; padding:8px 16px; font-size:.9rem; font-weight:700;">
                            📋 Tüm kayıt anketleri</button>
                    </div>
                    <div id="admin-teacher-list" style="margin-top: 15px; margin-bottom: 10px; max-height: 560px; overflow-y: auto;">Bölümü açınca yüklenir…</div>
                </details>
                <!-- ÖĞRENCİ LİSTESİ AYRINTILI (05.11.2026) — yönetici: "öğrenciler kısmını öğretmenler kısmındaki
                     benzer şekilde daha detaylı bilgi içeren bi hale getirelim, öğretmenler sekmesinin altında
                     olsun … öğrencilerin hangi öğretmene bağlı olduğu, siteyi ne kadar kullandığı gibi detaylar".
                     Eski «Kayıtlı Öğrenciler (Alfabetik)» bölümü buraya taşındı: büyük sayılar, arama, süzgeç
                     (bağ durumu, öğretmen), sıralama; kartta bağlı öğretmen + sınıf, kullanım süresi, son görülme,
                     gün sayısı. Açılınca okunur (kullanicilar + ogrenciBaglari), 10 dk önbellek. -->
                <details class="aog-bolum" id="admin-ogrenci-liste" name="admin-accordion" ontoggle="if(this.open) renderAdminStudentList('onbellek')">
                    <summary>🎓 Öğrenci listesi <small>arama · süzgeç · sıralama</small></summary>
                    <div id="admin-student-list" style="margin-top: 15px; margin-bottom: 10px; max-height: 560px; overflow-y: auto;">Bölümü açınca yüklenir…</div>
                </details>
                </div>
            </details>` : ''}
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <span></span>
                ${(appState.teacherApplications && appState.teacherApplications.length > 0) ? `
                    <div onclick="openTeacherAppsModal()" style="cursor:pointer; display:flex; align-items:center; background:#ffeaa7; padding:8px 15px; border-radius:20px; box-shadow:0 2px 5px rgba(0,0,0,0.1); animation: blink-animation 1s infinite alternate;">
                        <svg style="width:24px; height:24px; fill:#d35400; margin-right:8px;" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                        <span style="color:#d35400; font-weight:bold;">${appState.teacherApplications.length} Yeni Başvuru!</span>
                    </div>
                ` : ''}
            </div>
            
            <div style="margin-bottom: 25px;">
                <button class="btn btn-primary" style="background-color: #ff3b30; border-color: #ff3b30; font-size: 1.1rem; padding: 12px 24px; box-shadow: 0 4px 10px rgba(255, 59, 48, 0.4);" onclick="window.kidefCanliBaslat?kidefCanliBaslat():openLiveClassRoom()">
                    <span class="live-dot" style="background-color: white;"></span> Canlı Ders Başlat
                </button>
            </div>

            <details class="admin-details" name="admin-accordion" id="admin-orders-details" ontoggle="if(this.open) loadPaymentOrders()">
                <summary class="admin-summary">💳 Ödeme Onayları <span id="admin-orders-badge"></span><span id="admin-destek-badge-odeme"></span></summary>
                <div style="padding:10px 0;">
                    <button class="btn" onclick="loadPaymentOrders()" style="margin-bottom:10px; font-size:0.9rem;">🔄 Yenile</button>
                    <!-- BEKLENEN DESTEK (19.10.2026): öğretmenlerin "ödedim"
                         bildirimleri burada da listelenir (hesap/destek.js). -->
                    <div id="admin-destek-bekleyen"></div>
                    <div id="admin-orders-list" style="max-height:400px; overflow-y:auto;">Bölümü açınca yüklenir…</div>
                </div>
            </details>

            <details class="admin-details" name="admin-accordion" id="admin-messages-details" ontoggle="if(this.open) loadAdminFeedback()">
                <summary class="admin-summary">📨 Gelen Öneriler / Mesajlar</summary>
                <div style="padding:10px 0;">
                    <button class="btn" onclick="loadAdminFeedback()" style="margin-bottom:10px; font-size:0.9rem;">🔄 Yenile</button>
                    <div id="admin-feedback-list" style="max-height:340px; overflow-y:auto;">Bölümü açınca yüklenir…</div>
                </div>
            </details>



            <details class="admin-details" name="admin-accordion" id="admin-baglama-details" ontoggle="if(this.open) adminBaglamaYukle()">
                <summary class="admin-summary">🔗 Öğrenciyi Öğretmene Tanımla <span id="admin-baglama-badge"></span></summary>
                <div style="padding:10px 0;">
                    <p style="font-size:0.86rem; color:#7f8c8d; margin:0 0 12px;">
                        Sisteme e-posta ile giriş yapmış öğrencileri seç, bir öğretmen (istersen sınıfını da) seç
                        ve tanımla. Öğrencilerin <b>öğretmenin “Bekleyen İstekler” penceresine</b> düşer; öğretmen
                        tek tuşla onaylar ve öğrenci sınıf listesine girer.
                    </p>
                    <div id="admin-baglama">Bölümü açınca yüklenir…</div>
                </div>
            </details>

            <!-- «Kayıtlı Öğrenciler» bölümü «👨‍🏫 Öğretmenler» bölümünün içine, öğretmen listesinin altına
                 taşındı (ÖĞRENCİ LİSTESİ AYRINTILI, 05.11.2026). -->

            <!-- ÖĞRETMEN OLABİLECEK ÖĞRENCİLER (02.11.2026): öğretmen gibi kullanan öğrenci hesapları; açınca okunur -->
            ${_aonYoneticiMi() ? `
            <details class="admin-details" name="admin-accordion" id="admin-supheli-details" ontoggle="if(this.open) adminSupheliYukle()">
                <summary class="admin-summary">🔍 Öğretmen olabilecek öğrenciler <span id="admin-supheli-badge"></span></summary>
                <div id="admin-supheli" style="margin-top:12px; margin-bottom:10px; max-height:560px; overflow-y:auto;">Bölümü açınca yüklenir…</div>
            </details>` : ''}

            <details class="admin-details" name="admin-accordion">
                <summary class="admin-summary">
                    <span style="display: inline-flex; align-items: center;">
                        Sistemdeki Tüm Randevu Talepleri
                        ${(appState.pendingLessons && appState.pendingLessons.length > 0) ? `
                            <svg style="width:24px; height:24px; fill:#e74c3c; margin-left: 10px;" viewBox="0 0 24 24">
                                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                            </svg>
                        ` : ''}
                    </span>
                </summary>
                <div id="admin-all-lessons" style="margin-top: 15px; margin-bottom: 10px; max-height: 400px; overflow-y: auto;"></div>
            </details>

            <!-- «👨‍🏫 Öğretmenler» en üste, Öğretmen Onayları ile birleşti; «💛 Beklenen Destek»
                 en altta kendi akordiyonunda (ÖĞRETMENLER BİR ARADA, 02.11.2026). -->

            <details class="admin-details" name="admin-accordion">
                <summary class="admin-summary">📦 Çevrimdışı Paketler ve Müfredat</summary>
                <div id="admin-offline-packages" style="margin-top: 15px; margin-bottom: 10px; max-height: 500px; overflow-y: auto;"></div>
            </details>

            <details class="admin-details" name="admin-accordion">
                <summary class="admin-summary">🎥 Canlı Ders Paketleri ve Müfredat</summary>
                <div id="admin-online-packages" style="margin-top: 15px; margin-bottom: 10px; max-height: 500px; overflow-y: auto;"></div>
            </details>

            <!-- BEKLENEN DESTEK EN ALTTA, AKORDİYONDA (02.11.2026) — yönetici: "bu kısım en altta ve
                 akordiyon sistem olsun". Eskiden Öğretmenler bölümünün içindeydi. İçeriği hesap/destek.js
                 çizer (panel çizilince loadPaymentOrders → rozetleriYenile → ayarCiz). -->
            <details class="admin-details" name="admin-accordion" id="admin-destek-details"
                     ontoggle="if(this.open &amp;&amp; window.KidefDestek &amp;&amp; KidefDestek.ayarCiz &amp;&amp; !document.querySelector('#admin-destek-ayar > *')) KidefDestek.ayarCiz()">
                <summary class="admin-summary">💛 Beklenen Destek <span id="admin-destek-badge"></span></summary>
                <div id="admin-destek-ayar"></div>
            </details>


        </div>
        
        <div id="teacher-apps-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center;">
            <div class="glass-card" style="width:90%; max-width:600px; max-height:80vh; overflow-y:auto; position:relative;">
                <span onclick="closeTeacherAppsModal()" style="position:absolute; top:15px; right:15px; font-size:1.5rem; cursor:pointer;">&times;</span>
                <h3 style="margin-top:0;">Öğretmen Başvuruları</h3>
                <div id="admin-teacher-applications-modal"></div>
            </div>
        </div>
    `;
    
    if (!document.getElementById('blink-style')) {
        const style = document.createElement('style');
        style.id = 'blink-style';
        style.innerHTML = `
            @keyframes blink-animation {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0.7; transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    }
    
    /* TAKVİM DÜZENLEYİCİ ÖĞRETMEN LİSTESİ (06.10.2026) — öğretmen:
       "takvim düzenleyici kısmında mevcut öğretmenlerin ismi çıkmıyor".
       Eskiden burada appState.teachers basılıyordu; o da hesap/ogretmen.js
       içindeki SABİT DATA_OGRETMENLER dizisi (iki demo kayıt). Gerçek
       kayıtlar Firestore'da. Liste artık oradan okunuyor. */
    adminTakvimOgretmenDoldur();
    
    renderTeacherApplications();
    /* OKUMA AZALT (27.10.2026): öğretmen ve öğrenci listeleri panel çizilince değil,
       bölüm açılınca okunur (10 dk önbellek) — eskiden her panel çiziminde bütün
       kullanıcı belgeleri yeniden okunuyordu. */
    renderAdminAllLessons();
    renderAdminOfflinePackages();
    renderAdminOnlinePackages();
    if (typeof loadPaymentOrders === 'function') loadPaymentOrders();
    _aonBaslat();                                    /* öğretmen onayları: ilk yükleme + 30 sn */
    _ogsKur();                                       /* sayaç kutusu: öğretmen + öğrenci (02.11 · 05.11.2026) */
    _aonIkiKur();                                    /* öğretmen + öğrenci listesi yan yana (12.11.2026) */
}

/* ==========================================
   ÖDEME ONAYLARI (Siparişler) — yönetici onaylayınca öğrenciye tanımlanır
   ========================================== */
function _setOrdersBadge(n) {
    var b = document.getElementById('admin-orders-badge');
    if (b) b.innerHTML = n > 0 ? ('<span style="background:#EF5350; color:#fff; border-radius:12px; padding:1px 9px; font-size:0.75rem; margin-left:8px;">' + n + '</span>') : '';
}

function loadPaymentOrders() {
    const list = document.getElementById('admin-orders-list');
    if (!list) return;
    /* Öğretmenlerin destek bildirimleri ayrı listede (status alanı yok,
       aşağıdaki mağaza sorgusuna düşmez) — hesap/destek.js */
    if (window.KidefDestek && KidefDestek.rozetleriYenile) { try { KidefDestek.rozetleriYenile(); } catch (e) { } }
    if (typeof firebase === 'undefined' || !firebase.firestore) { list.innerHTML = '<p>Firebase hazır değil.</p>'; return; }
    list.innerHTML = 'Yükleniyor…';
    firebase.firestore().collection('siparisler').where('status', '==', 'pending').limit(100).get()
        .then(function (snap) {
            var arr = [];
            snap.forEach(function (d) { arr.push({ id: d.id, m: d.data() }); });
            arr.sort(function (a, b) {
                var ta = (a.m.createdAt && a.m.createdAt.toMillis) ? a.m.createdAt.toMillis() : 0;
                var tb = (b.m.createdAt && b.m.createdAt.toMillis) ? b.m.createdAt.toMillis() : 0;
                return tb - ta;
            });
            _setOrdersBadge(arr.length);
            if (arr.length === 0) { list.innerHTML = '<p style="color:#888;">Onay bekleyen ödeme yok.</p>'; return; }
            var html = '';
            arr.forEach(function (x) {
                var o = x.m;
                var slotsHtml = '';
                if (o.type === 'online' && o.slots && o.slots.length) {
                    slotsHtml = '<div style="font-size:0.82rem; color:#555; margin-top:6px;">🗓️ ' + o.slots.length + ' ders saati: ' + o.slots.map(function (s) { return _fbEsc(s); }).join(' &nbsp;•&nbsp; ') + '</div>';
                }
                html += '<div style="border:1px solid #E9EEF5; border-radius:10px; padding:12px; margin-bottom:12px; background:#fff;">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">' +
                        '<strong style="color:#16A085;">' + _fbEsc(o.name || 'Öğrenci') + '</strong>' +
                        '<span style="background:' + (o.type === 'online' ? '#4facfe' : '#20C997') + '; color:#fff; padding:2px 10px; border-radius:12px; font-size:0.72rem;">' + (o.type === 'online' ? 'Canlı Ders' : 'Çevrimdışı Paket') + '</span>' +
                    '</div>' +
                    '<div style="font-size:0.82rem; color:#888;">' + _fbEsc(o.email || '') + (o.phone ? ' • ' + _fbEsc(o.phone) : '') + '</div>' +
                    '<div style="margin-top:6px;"><strong>Paket:</strong> ' + _fbEsc(o.packageNames || '') + '</div>' +
                    slotsHtml +
                    '<div style="margin-top:6px; font-weight:bold; color:#20C997;">Tutar: ' + ((o.total || 0).toLocaleString('tr-TR')) + ' ₺</div>' +
                    '<div style="display:flex; gap:8px; margin-top:10px;">' +
                        '<button class="btn btn-success" style="padding:7px 16px;" onclick="onaylaSiparis(\'' + x.id + '\')">✅ Onayla</button>' +
                        '<button class="btn btn-danger" style="padding:7px 16px;" onclick="reddetSiparis(\'' + x.id + '\')">Reddet</button>' +
                    '</div>' +
                '</div>';
            });
            list.innerHTML = html;
        })
        .catch(function (e) { list.innerHTML = '<p style="color:#EF5350;">Yüklenemedi: ' + _fbEsc(e && e.message ? e.message : e) + '</p>'; });
}

function onaylaSiparis(orderId) {
    if (!confirm("Bu ödemeyi onaylayıp öğrencinin hesabına tanımlansın mı?")) return;
    var fs = firebase.firestore();
    var ref = fs.collection('siparisler').doc(orderId);
    ref.get().then(function (doc) {
        if (!doc.exists) { showCustomAlert("Sipariş bulunamadı."); return; }
        var o = doc.data();
        if (!o.uid) { showCustomAlert("Öğrenci kimliği bulunamadı, tanımlanamadı."); return; }
        var userRef = fs.collection('kullanicilar').doc(o.uid);
        var payload = {};
        if (o.type === 'offline' && Array.isArray(o.packageIds) && o.packageIds.length) {
            payload.packages = firebase.firestore.FieldValue.arrayUnion.apply(null, o.packageIds);
        } else if (o.type === 'online') {
            var lesson = {
                id: 'lesson_' + orderId,
                studentEmail: o.email || '',
                studentName: o.name || 'Öğrenci',
                package: o.packageNames || '',
                slots: o.slots || [],
                teacherId: o.teacherId || 'any',
                status: 'approved',
                approvedAt: new Date().toISOString()
            };
            payload.dersler = firebase.firestore.FieldValue.arrayUnion(lesson);
        }
        userRef.set(payload, { merge: true }).then(function () {
            return ref.update({ status: 'approved', approvedAt: firebase.firestore.FieldValue.serverTimestamp() });
        }).then(function () {
            showCustomAlert("Onaylandı ✅ Öğrencinin hesabına tanımlandı.");
            loadPaymentOrders();
        }).catch(function (e) { showCustomAlert("Onaylanamadı: " + (e.message || e)); });
    }).catch(function (e) { showCustomAlert("Hata: " + (e.message || e)); });
}

function reddetSiparis(orderId) {
    if (!confirm("Bu ödeme talebini reddetmek istiyor musunuz?")) return;
    firebase.firestore().collection('siparisler').doc(orderId)
        .update({ status: 'rejected', rejectedAt: firebase.firestore.FieldValue.serverTimestamp() })
        .then(function () { showCustomAlert("Talep reddedildi."); loadPaymentOrders(); })
        .catch(function (e) { showCustomAlert("İşlem başarısız: " + (e.message || e)); });
}
window.loadPaymentOrders = loadPaymentOrders;
window.onaylaSiparis = onaylaSiparis;
window.reddetSiparis = reddetSiparis;

function openTeacherAppsModal() {
    document.getElementById('teacher-apps-modal').style.display = 'flex';
}

function closeTeacherAppsModal() {
    document.getElementById('teacher-apps-modal').style.display = 'none';
}

function renderAdminAllLessons() {
    const listContainer = document.getElementById('admin-all-lessons');
    if (!listContainer) return;

    let html = '';
    const allPending = appState.pendingLessons || [];
    const allApproved = appState.approvedLessons || [];

    if (allPending.length === 0 && allApproved.length === 0) {
        listContainer.innerHTML = "<p>Sistemde herhangi bir randevu kaydı bulunmuyor.</p>";
        return;
    }

    if (allPending.length > 0) {
        html += `<h4 style="color:#F39C12; margin-bottom: 10px; display:flex; align-items:center;">
                    <svg style="width:24px; height:24px; margin-right:8px; fill:#e74c3c;" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    Bekleyen Talepler (${allPending.length})
                 </h4>`;
        allPending.forEach(l => {
            const t = appState.teachers.find(teacher => teacher.id === l.requestedTeacherId);
            const teacherName = t ? t.name : (l.requestedTeacherId === 'any' ? 'Havuz (Herhangi Biri)' : 'Bilinmeyen');
            html += `
                <div class="glass-card" style="margin-bottom: 10px; border-left: 4px solid #F39C12; padding: 10px;">
                    <strong>Öğrenci:</strong> ${l.studentEmail} (${l.studentPhone})<br>
                    <strong>Paket:</strong> ${l.package}<br>
                    <strong>Tarih/Saat:</strong> ${l.slots.join(', ')}<br>
                    <strong>İstenen Öğretmen:</strong> ${teacherName}
                </div>
            `;
        });
    }

    if (allApproved.length > 0) {
        html += `<h4 style="color:#20C997; margin-top: 20px; margin-bottom: 10px;">Onaylanan / Aktif Dersler</h4>`;
        allApproved.forEach(l => {
            const t = appState.teachers.find(teacher => teacher.id === l.teacherId);
            const teacherName = t ? t.name : 'Bilinmeyen';
            html += `
                <div class="glass-card" style="margin-bottom: 10px; border-left: 4px solid #20C997; padding: 10px;">
                    <strong>Öğrenci:</strong> ${l.studentEmail} (${l.studentPhone})<br>
                    <strong>Paket:</strong> ${l.package}<br>
                    <strong>Tarih/Saat:</strong> ${l.slots.join(', ')}<br>
                    <strong>Onaylayan Öğretmen:</strong> ${teacherName}
                </div>
            `;
        });
    }

    listContainer.innerHTML = html;
}

window.selectTeacherEditorWeek = function(index, isAdmin) {
    if (appState.calendarWeeks[index].isPast) return;
    appState.selectedWeekIndex = index;
    if (isAdmin) {
        renderAdminTeacherScheduleEditor();
    } else {
        renderTeacherScheduleEditor();
    }
};

function getTeacherCalendarEditorHtml(teacherId, isAdmin) {
    if (!appState.calendarWeeks || appState.calendarWeeks.length === 0) {
        generate3MonthWeeks();
    }

    const monthsMap = [];
    appState.calendarWeeks.forEach((week, index) => {
        let lastMonth = monthsMap[monthsMap.length - 1];
        if (!lastMonth || lastMonth.name !== week.monthName) {
            monthsMap.push({ name: week.monthName, weeks: [{...week, index: index}] });
        } else {
            lastMonth.weeks.push({...week, index: index});
        }
    });

    let navHtml = `<div style="display: flex; justify-content: space-between; gap: 15px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 15px; user-select: none;">`;
    monthsMap.forEach(m => {
        const isMonthActive = m.weeks.some(w => w.index === appState.selectedWeekIndex);
        const monthColor = isMonthActive ? '#F39C12' : '#1f5f99';
        const monthScale = isMonthActive ? 'scale(1.1)' : 'scale(1)';
        
        navHtml += `<div style="display: flex; flex: 1; flex-direction: column; align-items: center; min-width: 100px;">
            <div style="font-weight: bold; color: ${monthColor}; margin-bottom: 8px; font-size: 0.95rem; transform: ${monthScale}; transition: 0.2s;">${m.name}</div>
            <div style="display: flex; gap: 6px;">`;
            
        m.weeks.forEach(w => {
            const isSelected = appState.selectedWeekIndex === w.index;
            let bgColor = w.isPast ? '#e0e0e0' : (isSelected ? '#F39C12' : '#4facfe');
            let cursor = w.isPast ? 'not-allowed' : 'pointer';
            let opacity = w.isPast ? '0.5' : (isSelected ? '1' : '0.8');
            let clickAttr = w.isPast ? '' : `onclick="selectTeacherEditorWeek(${w.index}, ${isAdmin})"`;
            let transform = isSelected ? 'scale(1.15)' : 'scale(1)';
            
            navHtml += `<div style="width: 35px; height: 8px; border-radius: 4px; background: ${bgColor}; cursor: ${cursor}; opacity: ${opacity}; transform: ${transform}; transition: 0.2s; margin: 4px 0;" ${clickAttr} title="${w.isPast ? 'Geçmiş Hafta' : 'Haftayı Seç'}"></div>`;
        });
        
        navHtml += `</div></div>`;
    });
    navHtml += `</div>`;

    const groupsRaw = teacherSchedules[teacherId] || [];
    const currentWeek = appState.calendarWeeks[appState.selectedWeekIndex];
    
    const groups = currentWeek.days.map(dayObj => {
        const genericSchedule = groupsRaw.find(g => g.name === dayObj.dayName) || { startH: 9, endH: 17, data: {} };
        return {
            name: dayObj.dayName,
            dateString: dayObj.dateString,
            fullDateString: dayObj.fullDateString,
            dateObj: dayObj.dateObj,
            startH: genericSchedule.startH,
            endH: genericSchedule.endH,
            data: genericSchedule.data,
            slots: generateSlots(genericSchedule.startH, genericSchedule.endH)
        };
    });

    let html = '<p>Saatlerin üzerine tıklayarak <strong>Müsait</strong> veya <strong>Dolu</strong> olarak değiştirebilirsiniz. <br><small style="color:#777;">(Not: Yapacağınız değişiklikler öğretmenin genel haftalık şablonunu günceller.)</small></p>';
    html += navHtml;
    html += `
        <div style="display: flex; overflow-x: auto; gap: 15px; padding-bottom: 15px; margin-top: 15px;">
            ${groups.map(group => {
                const today = new Date();
                today.setHours(0,0,0,0);
                const isPastDay = group.dateObj < today;

                const slotsHtml = group.slots.map(s => {
                    const slotFullString = `${group.fullDateString} ${s.time}`;
                    let durumStr = group.data && group.data[s.time] ? group.data[s.time] : "musait";
                    
                    const bookedLesson = (appState.approvedLessons || []).find(l => l.teacherId === teacherId && l.slots.includes(slotFullString));
                    if (bookedLesson) {
                        durumStr = bookedLesson.studentName || "Öğrenci";
                    }

                    if (s.isBreak) return `<div class="slot break" style="margin-bottom: 8px;">☕ ${s.time}</div>`;
                    
                    const isDolu = durumStr !== "musait" || isPastDay || !!bookedLesson;
                    const cName = isPastDay ? "dolu" : (isDolu ? "dolu" : "musait");
                    const label = isPastDay ? "Geçmiş" : (isDolu ? (durumStr === "musait" ? "Dolu" : `Dolu (${durumStr})`) : "Müsait");
                    const icon = isPastDay ? "⏳" : (isDolu ? "❌" : "✅");
                    
                    const isStudentBooked = !!bookedLesson;
                    const clickAttr = isPastDay ? '' : `onclick="toggleSlotStatus('${teacherId}', '${group.name}', '${s.time}', this, ${isStudentBooked})"`;
                    const cursor = isPastDay ? 'not-allowed' : 'pointer';
                    const opacity = isPastDay ? '0.5' : '1';
                    
                    return `<div class="slot ${cName}" ${clickAttr} style="cursor: ${cursor}; margin-bottom: 8px; opacity: ${opacity};">${icon} ${s.time}<br><small style="font-size:0.7rem;">${label}</small></div>`;
                }).join('');

                return `
                <div style="min-width: 140px; flex: 1; display: flex; flex-direction: column;">
                    <div class="day-title" style="text-align: center; margin-bottom: 10px; padding: 10px; background: #e3f2fd; border-radius: 8px; font-weight: bold; color: #1f5f99; border: 1px solid rgba(31, 95, 153, 0.1);">
                        ${group.dateString} <br>
                        <span style="font-size: 0.85rem; font-weight: normal;">${group.name}</span>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        ${slotsHtml}
                    </div>
                </div>
                `;
            }).join('')}
        </div>
    `;
    
    return html;
}

/* ======================================================================
   TAKVİM DÜZENLEYİCİ — ÖĞRETMEN AÇILIR LİSTESİ      (06.10.2026)
   kullanicilar koleksiyonundan role 'teacher' veya 'admin' olanlar.
   Kimlik = Firestore belge kimliği (uid); takvimler zaten
   takvimler/{teacherId} altında tutuluyor, böylece gerçek hesapla
   eşleşiyor. Çevrimdışıyken eski DATA_OGRETMENLER dizisi yedek.
   ====================================================================== */
/* ======================================================================
   ADLARI DÜZELT  (06.10.2026)
   Öğretmen: "isim veya soyisimlerinin baş harflerini bazen küçük
   yazıyorlar, onları otomatik yapalım, kayıtlı olanları da düzeltelim."
   Yeni kayıtlarda düzeltme hesap/kayitalani.js'te; burası ESKİ kayıtlar
   için. Düzeltici aynı işlev (KidefKayit.adDuzelt), yani iki yer
   birbirinden ayrılmaz.
   Yazmadan önce ne değişeceğini örnekleriyle gösterip soruyor; toplu
   işlem 500'lük parçalara bölünüyor (Firestore sınırı).
   ====================================================================== */
function adminAdlariDuzelt() {
    if (typeof firebase === 'undefined' || typeof isFirebaseReady === 'undefined' || !isFirebaseReady) {
        _abUyar('Bu işlem çevrimdışıyken yapılamaz.');
        return;
    }
    if (!window.KidefKayit || typeof KidefKayit.adDuzelt !== 'function') {
        _abUyar('Ad düzeltici yüklenmemiş (hesap/kayitalani.js).');
        return;
    }
    var db = firebase.firestore();
    _abUyar('Kayıtlar taranıyor…');
    db.collection('kullanicilar').get().then(function (snap) {
        var degisecek = [];
        snap.forEach(function (d) {
            var v = d.data() || {};
            var eski = v.name;
            if (!eski || eski === 'Belirtilmedi') return;
            var yeni = KidefKayit.adDuzelt(eski);
            if (yeni && yeni !== eski) degisecek.push({ id: d.id, eski: eski, yeni: yeni });
        });
        if (!degisecek.length) {
            _abUyar('Düzeltilecek ad yok — hepsi zaten doğru yazılmış.');
            return;
        }
        var ornek = degisecek.slice(0, 10).map(function (x) {
            return '• ' + x.eski + '  →  ' + x.yeni;
        }).join('\n');
        var soru = degisecek.length + ' kaydın adı düzeltilecek:\n\n' + ornek +
            (degisecek.length > 10 ? '\n… ve ' + (degisecek.length - 10) + ' tane daha' : '') +
            '\n\nDevam edilsin mi?';
        _abSor(soru, function () {
            /* Firestore toplu işlemi en çok 500 yazma alır. */
            var parcalar = [], i;
            for (i = 0; i < degisecek.length; i += 450) parcalar.push(degisecek.slice(i, i + 450));
            var sira = Promise.resolve();
            parcalar.forEach(function (p) {
                sira = sira.then(function () {
                    var toplu = db.batch();
                    p.forEach(function (x) {
                        toplu.update(db.collection('kullanicilar').doc(x.id), { name: x.yeni });
                    });
                    return toplu.commit();
                });
            });
            sira.then(function () {
                _abUyar(degisecek.length + ' kaydın adı düzeltildi.');
                try { renderAdminTeacherList(); } catch (e) { }
                try { adminTakvimOgretmenDoldur(); } catch (e) { }
            }).catch(function (e) {
                _abUyar('Yazılamadı: ' + (e && (e.code || e.message)));
            });
        });
    }).catch(function (e) {
        _abUyar('Kayıtlar okunamadı: ' + (e && (e.code || e.message)));
    });
}
window.adminAdlariDuzelt = adminAdlariDuzelt;

function adminTakvimOgretmenDoldur() {
    var sec = document.getElementById('admin-teacher-edit-select');
    if (!sec) return;
    var secili = sec.value;
    var duzenleyici = document.getElementById('admin-teacher-schedule-editor');

    function bas(liste) {
        if (!liste.length) {
            sec.innerHTML = '<option value="">Kayıtlı öğretmen yok</option>';
            if (duzenleyici) {
                duzenleyici.innerHTML = '<p style="color:#7f8c8d;">Takvim açmak için önce ' +
                    'bir öğretmen kaydı gerekiyor. Öğretmen siteye kayıt olup onaylandığında ' +
                    'burada görünür.</p>';
            }
            return;
        }
        sec.innerHTML = liste.map(function (t) {
            var etiket = t.ad || t.email || t.id;
            if (t.ad && t.email) etiket += ' — ' + t.email;
            if (t.onay === 'bekliyor') etiket += '  (onay bekliyor)';
            else if (t.onay === 'reddedildi') etiket += '  (onaylı değil)';
            return '<option value="' + _fbEsc(t.id) + '">' + _fbEsc(etiket) + '</option>';
        }).join('');
        /* Liste yenilenince seçili öğretmen kaybolmasın. */
        if (secili && liste.some(function (t) { return t.id === secili; })) sec.value = secili;
        renderAdminTeacherScheduleEditor();
    }

    /* Çevrimdışı yedek: eski sabit dizi. */
    var yedek = (appState.teachers || []).map(function (t) {
        return { id: t.id, ad: t.name || '', email: t.email || '', onay: '' };
    });

    if (typeof firebase === 'undefined' || typeof isFirebaseReady === 'undefined' || !isFirebaseReady) {
        bas(yedek);
        return;
    }

    sec.innerHTML = '<option value="">Yükleniyor…</option>';
    /* Koleksiyon tek seferde okunup JS'te süzülüyor: 'in' sorgusu eski
       SDK'da ya da dizin eksikken patlayabiliyor, burada o risk yok. */
    firebase.firestore().collection('kullanicilar').get()
        .then(function (snap) {
            var l = [];
            snap.forEach(function (d) {
                var v = d.data() || {};
                if (v.role !== 'teacher' && v.role !== 'admin') return;
                l.push({
                    id: d.id,
                    ad: (v.name && v.name !== 'Belirtilmedi') ? v.name : '',
                    email: v.email || '',
                    onay: v.ogretmenOnay || ''
                });
            });
            l.sort(function (a, b) {
                return String(a.ad || a.email || '').localeCompare(String(b.ad || b.email || ''), 'tr');
            });
            bas(l);
        })
        .catch(function (e) {
            try { console.warn('takvim öğretmen listesi okunamadı:', e && (e.code || e.message)); } catch (x) { }
            bas(yedek);
        });
}
window.adminTakvimOgretmenDoldur = adminTakvimOgretmenDoldur;

function renderAdminTeacherScheduleEditor() {
    /* 19.10.2026: takvim düzenleyici ayrı akordiyon değil; öğretmen
       penceresinin "Takvim" sekmesinde (hesap/ogretmen-detay.js). Hafta
       değiştirince buraya gelinir — pencere açıksa oraya çizilir. */
    const kutu = document.getElementById('ogd-takvim');
    if (kutu && kutu.getAttribute('data-uid')) {
        kutu.innerHTML = getTeacherCalendarEditorHtml(kutu.getAttribute('data-uid'), true);
        return;
    }
    const editor = document.getElementById('admin-teacher-schedule-editor');
    if (!editor) return;
    const teacherId = document.getElementById('admin-teacher-edit-select').value;
    if (!teacherId) return editor.innerHTML = "<p>Lütfen seçin.</p>";

    editor.innerHTML = getTeacherCalendarEditorHtml(teacherId, true);
}

function renderTeacherApplications() {
    const listContainer = document.getElementById('admin-teacher-applications-modal');
    if (!listContainer) return;

    appState.teacherApplications = appState.teacherApplications || [];
    
    if (appState.teacherApplications.length === 0) {
        listContainer.innerHTML = "<p>Bekleyen başvuru bulunmuyor.</p>";
        return;
    }

    let html = '';
    appState.teacherApplications.forEach(app => {
        html += `
            <div class="glass-card" style="margin-bottom: 15px; border-left: 4px solid #F39C12;">
                <p><strong>E-posta:</strong> ${app.email}</p>
                <p><strong>Telefon:</strong> <a href="tel:${app.phone}" style="color: #F39C12;">${app.phone}</a></p>
                <p><strong>Yüklenen Belge:</strong> <span style="background: #e9ecef; padding: 2px 5px; border-radius: 4px;">${app.documentName}</span></p>
                <div style="background: rgba(0,0,0,0.05); padding: 10px; border-radius: 8px; margin: 10px 0;">
                    <strong>Özgeçmiş / Motivasyon:</strong><br>
                    <span style="white-space: pre-wrap;">${app.cv}</span>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button class="btn btn-success" onclick="approveTeacherApplication('${app.id}')">Onayla ve Ekle</button>
                    <button class="btn btn-danger" onclick="rejectTeacherApplication('${app.id}')">Reddet</button>
                </div>
            </div>
        `;
    });
    listContainer.innerHTML = html;
}

function approveTeacherApplication(appId) {
    const appIndex = appState.teacherApplications.findIndex(a => a.id === appId);
    if (appIndex === -1) return;
    const app = appState.teacherApplications[appIndex];
    
    const newId = 'hoca_' + Math.floor(Math.random() * 10000);
    const namePrefix = app.email.split('@')[0];
    
    appState.teachers.push({
        id: newId,
        name: `Eğitmen ${namePrefix} (Yeni)`,
        phone: app.phone,
        email: app.email,
        password: app.password,
        cv: app.cv || 'Belirtilmedi',
        documentName: app.documentName || 'Yok'
    });
    
    teacherSchedules[newId] = getDefaultSchedule();
    
    appState.teacherApplications.splice(appIndex, 1);
    saveTeachers();
    
    renderTeacherApplications();
    renderAdminTeacherList();
    refreshTeacherSelect();
    showCustomAlert("Öğretmen başvurusu onaylandı ve sisteme eklendi! Bilgileri tablodan düzenleyebilirsiniz.");
}

async function rejectTeacherApplication(appId) {
    if (await showCustomConfirm("Bu başvuruyu reddetmek istediğinize emin misiniz?")) {
        appState.teacherApplications = appState.teacherApplications.filter(a => a.id !== appId);
        saveTeachers();
        renderTeacherApplications();
    }
}

/* OKUMA AZALT (27.10.2026): panel listelerinin önbelleği — kaynak 'onbellek' ise ve
   kayıt 10 dk'dan tazeyse Firestore'a gidilmez. Kayıt değiştiren işlemler kaynaksız
   çağırır (taze okur, önbelleği yeniler). */
var _abOnbellek = {}, AB_TTL = 10 * 60e3;
function _abSnap(ad, sorgu, onbellek) {
    var c = _abOnbellek[ad];
    if (onbellek && c && Date.now() - c.t < AB_TTL) return Promise.resolve(c.snap);
    return sorgu().then(function (snap) {
        var docs = [];
        snap.forEach(function (d) { docs.push({ id: d.id, v: d.data() || {} }); });
        var sahte = {
            size: docs.length, empty: !docs.length,
            forEach: function (f) { docs.forEach(function (x) { f({ id: x.id, exists: true, data: function () { return x.v; } }); }); }
        };
        _abOnbellek[ad] = { t: Date.now(), snap: sahte };
        return sahte;
    });
}
/* ==========================================================================
   ÖĞRENCİ LİSTESİ AYRINTILI (05.11.2026) — yönetici: "öğrenciler kısmını öğretmenler kısmındaki
   benzer şekilde daha detaylı bilgi içeren bi hale getirelim, öğretmenler sekmesinin altında olsun
   … öğrencilerin hangi öğretmene bağlı olduğu, siteyi ne kadar kullandığı gibi detaylar".
   · «👨‍🏫 Öğretmenler» bölümünün içinde, öğretmen listesinin altında (#admin-ogrenci-liste).
   · Okuma: kullanicilar ('ogrenci' önbelleği — «öğretmen olabilecek öğrenciler» ile ortak; rolü
     student ya da hiç yazılmamış hesaplar) + ogrenciBaglari ('bag' önbelleği). İkisi de 10 dk
     saklanır; ek sorgu yok. Öğretmen adları aynı kullanicilar okumasından (role teacher/admin),
     yoksa bağdaki ogretmenAd. Bağ: onaylı ya da bekliyor sayılır; kopuk / red bağ yok demektir.
   · Büyük sayılar: öğrenci · öğretmene bağlı (onaylı bağı var) · onay bekliyor · bağlı değil;
     Σ süre · son 7 günde giren · kullanım kaydı yok. Üstteki sayaç kutusuna da öğrenci sayısı
     bildirilir (_ogsBildirOgr).
   · Kart: ad, bağ rozeti, e-posta, bağlı öğretmen + seviye/sınıf, toplam süre · gün · son görülme,
     kayıt tarihi (kayıt sıralamasında). Karta basınca öğrenci penceresi (openStudentCard).
   · Arama: ad, e-posta, telefon, öğretmen adı, sınıf. Süzgeç: Hepsi · Bağlı · Onay bekleyen ·
     Bağlı değil · Son 7 gün; öğretmen seçimi (yalnız o öğretmenin öğrencileri).
   · Sıralama (hatırlanır, kidef_aos_sira): A→Z (harf başlıkları) · En çok kullanan · Son kullanan ·
     Kayıt tarihi (ay başlıkları) · Öğretmen (öğretmen başlıkları; bağsızlar en sonda).
   ========================================================================== */
var _aos = { L: [], veri: {}, ogt: {}, suzgec: 'hepsi', ogtSec: '', bagYok: false,
             sira: (function () { try { var v = localStorage.getItem('kidef_aos_sira'); return /^(ad|sure|son|kayit|ogretmen)$/.test(v || '') ? v : 'ad'; } catch (e) { return 'ad'; } })() };

function renderAdminStudentList(kaynak) {
    var kap = document.getElementById('admin-student-list');
    if (!kap) return;
    if (window.KidefOgretmenDetay && KidefOgretmenDetay.stil) KidefOgretmenDetay.stil();
    _ogtStil();

    if (typeof firebase === 'undefined' || typeof isFirebaseReady === 'undefined' || !isFirebaseReady) {
        /* Firebase yok (yerel deneme): tarayıcıdaki mockUsers */
        var users = {};
        try { users = JSON.parse(localStorage.getItem('mockUsers') || '{}'); } catch (e) { }
        _aosHazirla(kap, Object.keys(users).map(function (k) {
            var v = users[k] || {}; v._docId = v._docId || k; v.email = v.email || k; return v;
        }), null, {});
        return;
    }
    kap.innerHTML = '<p style="color:#7f8c8d;">Yükleniyor…</p>';
    var D = firebase.firestore(), onb = kaynak === 'onbellek';
    Promise.all([
        _abSnap('ogrenci', function () { return D.collection('kullanicilar').get(); }, onb),
        _abSnap('bag', function () { return D.collection('ogrenciBaglari').get(); }, onb).then(null, function () { return null; })
    ]).then(function (r) {
        var L = [], ogtAd = {}, ogtSinif = {};
        r[0].forEach(function (d) {
            var v = d.data() || {};
            if (v.role === 'teacher' || v.role === 'admin') {
                ogtAd[d.id] = _abAd(v, d.id);
                ogtSinif[d.id] = _abSiniflar(v);         /* SINIF SEÇİMİ (05.11.2026): yönetici onayı için sınıf listesi */
                return;
            }
            if (v.role && v.role !== 'student') return;
            v._docId = d.id;
            L.push(v);
        });
        _aosHazirla(kap, L, r[1], ogtAd, ogtSinif);
    }).catch(function (e) {
        kap.innerHTML = '<p style="color:#EF5350;">' + _fbEsc(_abHataMetni(e)) + '</p>' +
            '<button class="btn" onclick="renderAdminStudentList()" style="margin-top:10px; font-size:.9rem;">🔄 Yenile</button>';
    });
}

/* bağ belgeleri → { öğrenciUid: [{ogt, ad, durum, seviye, sinif, t}] }  (null: okunamadı) */
function _aosBaglar(snap, ogtAd) {
    if (!snap) return null;
    var B = {};
    snap.forEach(function (d) {
        var v = d.data() || {}, p = String(d.id).split('__');
        var ogr = v.uid || p[0], ogt = v.ogretmenUid || (p.length > 1 ? p[1] : '');
        var durum = v.durum === 'onayli' ? 'onayli' : (v.durum === 'bekliyor' ? 'bekliyor' : '');
        if (!ogr || !ogt || !durum) return;                                  /* kopuk / red: bağ yok */
        var L = B[ogr] = B[ogr] || [], i;
        var yeni = { ogt: ogt, ad: String(ogtAd[ogt] || v.ogretmenAd || '').trim(), durum: durum,
                     seviye: String(v.seviyeAd || ''), sinif: String(v.sinifAd || ''),
                     t: _aogTms(v.onayTarih) || _aogTms(v.istekTarih) || _aogTms(v.guncelleme) || 0,
                     /* SINIF SEÇİMİ (05.11.2026): bekleyen istekte önerilen sınıf, kim önerdi, yönetici onayı */
                     id: String(d.id), doc: v, satirVar: !!(v.lId && v.cId && v.tur !== 'ogretmen'),
                     onerilenLId: _aoyOneri(v) ? String(v.onerilenLId) : '', onerilenCId: _aoyOneri(v) ? String(v.onerilenCId) : '',
                     onerilenAd: _aoyOneri(v) ? String(v.onerilenAd || '') : '', onerenOgrenci: !!v.onerenOgrenci,
                     /* SINIF TAZELİĞİ (08.11.2026): eskimiş onay ve onunla yazılmış öneri sayılmaz */
                     yoneticiOnay: _aoyOnayGecerli(v), yoneticiTanimli: !!v.yoneticiTanimli };
        if (!yeni.ad) yeni.ad = '(öğretmen ' + String(ogt).slice(0, 6) + '…)';
        for (i = 0; i < L.length; i++) if (L[i].ogt === ogt) break;          /* eski tek kimlikli + yeni belge: onaylı olan kalır */
        if (i < L.length) { if (yeni.durum === 'onayli' && L[i].durum !== 'onayli') L[i] = yeni; }
        else L.push(yeni);
    });
    return B;
}
function _aosGunAd(ms) {
    var t = new Date(ms), a = t.getMonth() + 1, g = t.getDate();
    return t.getFullYear() + '-' + (a < 10 ? '0' : '') + a + '-' + (g < 10 ? '0' : '') + g;
}
/* son 7 günün toplamı (kullanim.gun) */
function _aosHaftaSn(gun, simdi) {
    var top = 0;
    for (var i = 0; i < 7; i++) top += +gun[_aosGunAd(simdi - i * 86400000)] || 0;
    return top;
}
/* sonGoruldu yoksa: sitede görüldüğü son gün */
function _aosSonGun(gun) {
    var k = Object.keys(gun || {}).sort(), s = k[k.length - 1];
    if (!s) return 0;
    var p = s.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]).getTime() || 0;
}
function _aosHazirla(kap, L, bagSnap, ogtAd, ogtSinif) {
    _aos.ogtSinif = ogtSinif || {};
    var B = _aosBaglar(bagSnap, ogtAd), simdi = Date.now(), hafta = simdi - 7 * 86400000;
    var veri = {}, liste = [], ogtler = {};
    L.forEach(function (v) {
        var uid = String(v._docId), kul = v.kullanim || {}, gun = kul.gun || {};
        var baglar = ((B && B[uid]) || []).slice().sort(function (a, b) {
            return ((a.durum === 'onayli' ? 0 : 1) - (b.durum === 'onayli' ? 0 : 1)) || a.ad.localeCompare(b.ad, 'tr');
        });
        var durum = !B ? 'bilinmiyor'
                  : (baglar.some(function (b) { return b.durum === 'onayli'; }) ? 'bagli' : (baglar.length ? 'bekliyor' : 'bagsiz'));
        var son = _aogTms(kul.sonGoruldu) || _aosSonGun(gun);
        var o = { uid: uid, ad: (v.name && v.name !== 'Belirtilmedi') ? String(v.name).trim() : '',
                  email: String(v.email || ''), tel: String(v.phone || ''), meslek: String(v.meslek || v.profession || ''),
                  cinsiyet: String(v.cinsiyet || ''), anket: v.anket || null,
                  paket: Array.isArray(v.packages) ? v.packages.length : 0,
                  sure: +kul.toplamSn || 0, son: son, gun: Object.keys(gun).length, hafta: _aosHaftaSn(gun, simdi),
                  alan: kul.alan || {}, oturum: +kul.oturum || 0, kayit: _aogKayitMs(v),
                  baglar: baglar, durum: durum, aktif: !!son && son >= hafta, doc: v };
        baglar.forEach(function (b) {
            var t = ogtler[b.ogt] = ogtler[b.ogt] || { ad: b.ad, n: 0, bek: 0 };
            if (b.durum === 'onayli') t.n++; else t.bek++;
        });
        veri[uid] = o; liste.push(o);
    });
    _aos.L = liste; _aos.veri = veri; _aos.ogt = ogtler; _aos.bagYok = !B;
    window._adminStudentsData = veri;
    /* üstteki sayaç kutusu: liste okunduğu anın öğrenci sayısı */
    if (typeof _ogsBildirOgr === 'function') _ogsBildirOgr(liste.length, (_abOnbellek.ogrenci && _abOnbellek.ogrenci.t) || Date.now());
    _aosCiz(kap);
}
function _aosAttr(t) { return _fbEsc(t).replace(/"/g, '&quot;'); }
function _aosRozet(durum) {
    var r = durum === 'bagli' ? { renk: '#1E8449', zemin: '#E8F6EF', ad: 'Bağlı' }
          : (durum === 'bekliyor' ? { renk: '#B5670A', zemin: '#FEF3E2', ad: 'Bekliyor' }
          : (durum === 'bagsiz' ? { renk: '#7f8c8d', zemin: '#EDF1F7', ad: 'Bağlı değil' } : null));
    if (!r) return '';
    return '<span class="aos-rozet" style="display:inline-block; padding:3px 10px; border-radius:999px; font-size:.78rem; font-weight:700; color:' +
           r.renk + '; background:' + r.zemin + ';">' + r.ad + '</span>';
}
function _aosOgtYazi(o) {
    if (_aos.bagYok) return '<i>bağ bilgisi okunamadı</i>';
    if (!o.baglar.length) return 'öğretmene bağlı değil';
    var b = o.baglar[0], yer = b.seviye + (b.sinif ? ' / ' + b.sinif : '');
    var y = '👨‍🏫 <b>' + _fbEsc(b.ad) + '</b>' + (yer ? ' · ' + _fbEsc(yer) : '') + (b.durum === 'bekliyor' ? ' · onay bekliyor' : '');
    /* SINIF SEÇİMİ (05.11.2026): bekleyen istekte önerilen sınıf ve yönetici onayı */
    if (b.durum === 'bekliyor' && !yer && b.onerilenAd) y += ' · <i>' + _fbEsc(b.onerilenAd) + '</i>';
    if (b.durum === 'bekliyor' && b.yoneticiOnay) y += ' · <i>yönetici onayladı</i>';
    if (o.baglar.length > 1) y += ' <small>+' + (o.baglar.length - 1) + ' öğretmen</small>';
    return y;
}
function _aosKart(o) {
    var ton = (window.KidefOgretmenDetay && KidefOgretmenDetay.renkTonu) ? KidefOgretmenDetay.renkTonu(o.uid) : 160;
    var harf = (window.KidefOgretmenDetay && KidefOgretmenDetay.basHarf) ? KidefOgretmenDetay.basHarf(o.ad, o.email)
             : (o.ad || o.email || '?').charAt(0).toLocaleUpperCase('tr-TR');
    var kul = [];
    if (o.sure) kul.push('<b>' + _sureBicim(o.sure) + '</b>');
    if (o.gun) kul.push(o.gun + ' gün');
    if (o.son) kul.push('son ' + _aogGun(o.son));
    var ara = (o.ad + ' ' + o.email + ' ' + o.tel + ' ' +
               o.baglar.map(function (b) { return b.ad + ' ' + b.seviye + ' ' + b.sinif; }).join(' ')).toLocaleLowerCase('tr-TR');
    /* isimsizler en sonda, «#» başlığı altında (U+FFFF her harften sonra dizilir) */
    var siraAd = o.ad ? o.ad.toLocaleLowerCase('tr-TR') : ('￿' + o.email.toLocaleLowerCase('tr-TR'));
    var ilkOgt = o.baglar.length ? o.baglar[0].ad : '';          /* «Öğretmen» sıralamasının başlığı */
    return '<button type="button" class="aog-kart aos-kart" data-aos-ara="' + _aosAttr(ara) + '" data-aos-durum="' + o.durum + '"' +
        ' data-aos-ad="' + _aosAttr(siraAd) + '" data-aos-sure="' + o.sure + '" data-aos-son="' + o.son + '" data-aos-kayit="' + o.kayit + '"' +
        ' data-aos-hafta="' + (o.aktif ? 1 : 0) + '" data-aos-ogt=" ' + _aosAttr(o.baglar.map(function (b) { return b.ogt; }).join(' ')) + ' "' +
        ' data-aos-ogtad="' + _aosAttr(ilkOgt) + '"' +
        ' onclick="openStudentCard(\'' + encodeURIComponent(o.uid) + '\')" title="Öğrenci bilgileri ve düzenleme">' +
          '<span class="aog-avatar" style="background:hsl(' + ton + ',60%,92%); color:hsl(' + ton + ',40%,30%);">' + _fbEsc(harf) + '</span>' +
          '<span class="aog-govde">' +
            '<span class="aog-ust"><span class="aog-ad">' + _fbEsc(o.ad || '(isim yok)') + '</span>' + _aosRozet(o.durum) + '</span>' +
            '<span class="aog-eposta">' + _fbEsc(o.email || '—') + '</span>' +
            '<span class="aog-alt aos-ogt-satir">' + _aosOgtYazi(o) + '</span>' +
            '<span class="aog-alt aos-kul-satir">' + (kul.length ? kul.join(' · ') : 'kullanım kaydı yok') + '</span>' +
            '<span class="aog-kayit">' + (o.kayit ? 'kayıt ' + _aogGun(o.kayit) : 'kayıt tarihi yok') + '</span>' +
          '</span>' +
          '<span class="aog-ok" aria-hidden="true">›</span>' +
        '</button>';
}
function _aosCiz(kap) {
    var L = _aos.L;
    if (!L.length) {
        kap.innerHTML = '<p style="color:#7f8c8d;">Kayıtlı öğrenci yok.</p>' +
            '<button class="btn" onclick="renderAdminStudentList()" style="margin-top:10px; font-size:.9rem;">🔄 Yenile</button>';
        return;
    }
    var s = { bagli: 0, bekliyor: 0, bagsiz: 0, hafta: 0, hic: 0, sure: 0 };
    L.forEach(function (o) {
        if (o.durum === 'bagli') s.bagli++; else if (o.durum === 'bekliyor') s.bekliyor++; else if (o.durum === 'bagsiz') s.bagsiz++;
        if (o.aktif) s.hafta++;
        if (!o.sure) s.hic++;
        s.sure += o.sure;
    });
    var suz = function (id, yazi) {
        return '<button type="button" class="aog-suz' + (_aos.suzgec === id ? ' sec' : '') + '" data-aos-suz="' + id + '"' +
               ' onclick="adminOgrenciSuz(\'' + id + '\')">' + yazi + '</button>';
    };
    var sira = function (id, yazi, ip) {
        return '<button type="button" class="aog-suz aog-sir' + (_aos.sira === id ? ' sec' : '') + '" data-aos-sira="' + id + '" title="' + ip + '"' +
               ' onclick="adminOgrenciSirala(\'' + id + '\')">' + yazi + '</button>';
    };
    var ogtler = Object.keys(_aos.ogt).map(function (u) { return { uid: u, ad: _aos.ogt[u].ad, n: _aos.ogt[u].n, bek: _aos.ogt[u].bek }; })
        .sort(function (a, b) { return a.ad.localeCompare(b.ad, 'tr'); });
    var ogtOpt = '<option value="">👨‍🏫 Öğretmen: hepsi</option>' + ogtler.map(function (t) {
        return '<option value="' + _aosAttr(t.uid) + '"' + (_aos.ogtSec === t.uid ? ' selected' : '') + '>' + _fbEsc(t.ad) +
               ' (' + t.n + (t.bek ? ' + ' + t.bek + ' bekleyen' : '') + ')</option>';
    }).join('');
    kap.innerHTML =
        /* BÜYÜK SAYILAR — öğretmen listesindeki gibi */
        '<div class="aog-sayilar">' +
          '<span class="aog-sayi ana"><b>' + L.length + '</b><small>öğrenci</small></span>' +
          (_aos.bagYok
            ? '<span class="aog-sayi sifir" title="ogrenciBaglari okunamadı"><b>?</b><small>bağ bilgisi yok</small></span>'
            : '<span class="aog-sayi ok' + (s.bagli ? '' : ' sifir') + '"><b>' + s.bagli + '</b><small>öğretmene bağlı</small></span>' +
              '<span class="aog-sayi bek' + (s.bekliyor ? '' : ' sifir') + '"><b>' + s.bekliyor + '</b><small>onay bekliyor</small></span>' +
              '<span class="aog-sayi gri' + (s.bagsiz ? '' : ' sifir') + '"><b>' + s.bagsiz + '</b><small>bağlı değil</small></span>') +
          '<span class="aog-sayi-ek">Σ ' + _sureBicim(s.sure) + ' · son 7 günde ' + s.hafta + ' · kullanım kaydı yok ' + s.hic + '</span>' +
          '<button class="btn" onclick="renderAdminStudentList()" style="margin-inline-start:auto; align-self:center; font-size:.85rem;">🔄 Yenile</button>' +
        '</div>' +
        '<div class="aog-ara">' +
          '<input type="search" id="aosAra" placeholder="Ad, e-posta, telefon, öğretmen ya da sınıf ara…" oninput="adminOgrenciSuz()">' +
          suz('hepsi', 'Hepsi') + suz('bagli', 'Bağlı') + suz('bekliyor', 'Onay bekleyen') + suz('bagsiz', 'Bağlı değil') + suz('hafta', 'Son 7 gün') +
          (ogtler.length ? '<select id="aosOgt" class="aos-ogt" onchange="adminOgrenciSuz()" title="Yalnız seçilen öğretmenin öğrencileri">' + ogtOpt + '</select>' : '') +
          '<span class="aog-sira-grup"><span class="aog-sira">Sırala:</span>' +
          sira('ad', 'A → Z', 'Ada göre, baş harf başlıklarıyla') +
          sira('sure', 'En çok kullanan', 'Sitede geçirilen toplam süreye göre, çoktan aza') +
          sira('son', 'Son kullanan', 'Son görülme tarihine göre, yeniden eskiye') +
          sira('kayit', 'Kayıt tarihi', 'Kayıt tarihine göre, yeniden eskiye (ay başlıklarıyla)') +
          sira('ogretmen', 'Öğretmen', 'Bağlı olduğu öğretmene göre (öğretmen başlıklarıyla; bağsızlar en sonda)') + '</span>' +
        '</div>' +
        '<div class="aog-grid" id="aosGrid">' + L.map(_aosKart).join('') +
          '<p class="aog-bos" id="aosBos" style="display:none;">Bu süzgece uyan öğrenci yok.</p></div>';
    adminOgrenciSirala();
}

/* Arama kutusu, süzgeç çipleri ve öğretmen seçimi: kartları gizler/gösterir (yeniden sorgu yok). */
function adminOgrenciSuz(yeni) {
    if (yeni) _aos.suzgec = yeni;
    var ara = ((document.getElementById('aosAra') || {}).value || '').trim().toLocaleLowerCase('tr-TR');
    var sel = document.getElementById('aosOgt');
    _aos.ogtSec = sel ? sel.value : '';
    var gorunen = 0;
    [].forEach.call(document.querySelectorAll('#aosGrid .aos-kart'), function (k) {
        var uy = !ara || (k.getAttribute('data-aos-ara') || '').indexOf(ara) >= 0, d = k.getAttribute('data-aos-durum');
        if (uy && _aos.suzgec === 'bagli') uy = d === 'bagli';
        else if (uy && _aos.suzgec === 'bekliyor') uy = d === 'bekliyor';
        else if (uy && _aos.suzgec === 'bagsiz') uy = d === 'bagsiz';
        else if (uy && _aos.suzgec === 'hafta') uy = k.getAttribute('data-aos-hafta') === '1';
        if (uy && _aos.ogtSec) uy = (k.getAttribute('data-aos-ogt') || '').indexOf(' ' + _aos.ogtSec + ' ') >= 0;
        k.style.display = uy ? '' : 'none';
        if (uy) gorunen++;
    });
    /* başlık: altındaki kartların hepsi gizliyse o da gizli */
    [].forEach.call(document.querySelectorAll('#aosGrid .aog-harf'), function (h) {
        var e = h.nextElementSibling, var_ = false;
        while (e && !e.classList.contains('aog-harf')) { if (e.classList.contains('aos-kart') && e.style.display !== 'none') { var_ = true; break; } e = e.nextElementSibling; }
        h.style.display = var_ ? '' : 'none';
    });
    [].forEach.call(document.querySelectorAll('#admin-student-list [data-aos-suz]'), function (b) {
        b.classList.toggle('sec', b.getAttribute('data-aos-suz') === _aos.suzgec);
    });
    var bos = document.getElementById('aosBos');
    if (bos) bos.style.display = gorunen ? 'none' : '';
}
window.adminOgrenciSuz = adminOgrenciSuz;

/* Kartları yerinde sıralar: ad (A→Z, harf başlıkları) · sure · son · kayit (ay başlıkları) ·
   ogretmen (bağlı öğretmen başlıkları; bağsızlar en sonda). Eşitlikte ada göre. */
function adminOgrenciSirala(yeni) {
    if (yeni) { _aos.sira = yeni; try { localStorage.setItem('kidef_aos_sira', yeni); } catch (e) { } }
    var grid = document.getElementById('aosGrid');
    if (!grid) return;
    var S = _aos.sira;
    var kartlar = [].slice.call(grid.querySelectorAll('.aos-kart'));
    [].forEach.call(grid.querySelectorAll('.aog-harf'), function (h) { h.parentNode.removeChild(h); });
    var ad = function (k) { return k.getAttribute('data-aos-ad') || ''; };
    var say = function (k, n) { return parseFloat(k.getAttribute(n)) || 0; };
    var ogt = function (k) { var v = k.getAttribute('data-aos-ogtad') || ''; return v ? v.toLocaleLowerCase('tr-TR') : '￿'; };
    kartlar.sort(function (a, b) {
        var f = 0;
        if (S === 'sure') f = say(b, 'data-aos-sure') - say(a, 'data-aos-sure');
        else if (S === 'son') f = say(b, 'data-aos-son') - say(a, 'data-aos-son');
        else if (S === 'kayit') f = (say(b, 'data-aos-kayit') || -1) - (say(a, 'data-aos-kayit') || -1);
        else if (S === 'ogretmen') f = ogt(a).localeCompare(ogt(b), 'tr');
        return f || ad(a).localeCompare(ad(b), 'tr');
    });
    var bos = document.getElementById('aosBos'), sonBaslik = null;
    kartlar.forEach(function (k) {
        var baslik = null, sinif = 'aog-harf';
        if (S === 'ad') {
            baslik = (ad(k).charAt(0) || '#').toLocaleUpperCase('tr-TR');
            if (!/[A-ZÇĞİÖŞÜ]/.test(baslik)) baslik = '#';
        } else if (S === 'kayit') { baslik = _aogAy(say(k, 'data-aos-kayit')); sinif = 'aog-harf aog-ay'; }
        else if (S === 'ogretmen') { baslik = k.getAttribute('data-aos-ogtad') || 'Öğretmene bağlı değil'; sinif = 'aog-harf aos-ogt-baslik'; }
        if (baslik !== null && baslik !== sonBaslik) {
            sonBaslik = baslik;
            var b = document.createElement('div');
            b.className = sinif; b.textContent = baslik;
            grid.insertBefore(b, bos);
        }
        grid.insertBefore(k, bos);
    });
    grid.classList.toggle('aog-sira-kayit', S === 'kayit');
    [].forEach.call(document.querySelectorAll('#admin-student-list [data-aos-sira]'), function (b) {
        b.classList.toggle('sec', b.getAttribute('data-aos-sira') === S);
    });
    adminOgrenciSuz();
}
window.adminOgrenciSirala = adminOgrenciSirala;

/* kayıt anketi cevapları → okunur yazı (hesap/kayitanketi.js'in soru listesinden) */
function _aosAnketYazi(anket) {
    if (!anket || typeof anket !== 'object') return '';
    var S = (window.KidefAnket && KidefAnket.sorular && KidefAnket.sorular.student) || [];
    var p = [];
    ['sinif', 'seviye', 'amac'].forEach(function (id) {
        var v = anket[id];
        if (!v) return;
        var soru = S.filter(function (q) { return q.id === id; })[0];
        var sec = soru ? (soru.c || []).filter(function (c) { return c[0] === v; })[0] : null;
        p.push(sec ? sec[1] : String(v));
    });
    return p.join(' · ');
}
function _aosStil() {
    if (document.getElementById('aos-stil')) return;
    var st = document.createElement('style');
    st.id = 'aos-stil';
    st.textContent = [
        '#student-card-overlay .sc-pencere{background:#fff; border-radius:18px; width:100%; max-width:520px; max-height:92vh; overflow:auto; box-shadow:0 20px 60px rgba(0,0,0,.3); font-family:inherit;}',
        '#student-card-overlay .sc-bas{background:linear-gradient(135deg,#16A085,#F39C12); padding:20px 22px; border-radius:18px 18px 0 0; color:#fff; display:flex; align-items:center; gap:14px;}',
        '#student-card-overlay .sc-simge{font-size:2.3rem; line-height:1;}',
        '#student-card-overlay .sc-bas-yazi{flex:1; min-width:0;}',
        '#student-card-overlay .sc-ad{font-size:1.15rem; font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}',
        '#student-card-overlay .sc-ep{font-size:.82rem; opacity:.92; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}',
        '#student-card-overlay .sc-kapat{background:rgba(255,255,255,.25); border:none; color:#fff; width:34px; height:34px; border-radius:50%; font-size:1.4rem; cursor:pointer; flex-shrink:0; line-height:1;}',
        '#student-card-overlay .sc-bol{padding:14px 22px; border-bottom:1px solid #EEF2F7;}',
        '#student-card-overlay .sc-bol:last-child{border-bottom:0;}',
        '#student-card-overlay h4{margin:0 0 10px; font-size:.9rem; color:#1B4F9C; font-weight:900;}',
        '#student-card-overlay .sc-kutular{display:flex; gap:8px; flex-wrap:wrap;}',
        '#student-card-overlay .sc-k{flex:1 1 95px; background:#F7F9FC; border:1px solid #E6EBF2; border-radius:12px; padding:9px 12px;}',
        '#student-card-overlay .sc-k b{display:block; font-size:1.15rem; color:#1F2430; line-height:1.2;}',
        '#student-card-overlay .sc-k span{font-size:.76rem; color:#8A94A3; font-weight:700;}',
        '#student-card-overlay .sc-satir{font-size:.86rem; color:#55606D; margin-top:8px;}',
        '#student-card-overlay .sc-alan{display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; font-size:.8rem; color:#5B6B7C;}',
        '#student-card-overlay .sc-alan span{background:#F4F7FB; border:1px solid #E3E9F1; border-radius:999px; padding:3px 10px;}',
        '#student-card-overlay .sc-alan b{color:#1B4F9C;}',
        '#student-card-overlay .sc-bag{display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding:8px 10px; border-radius:10px; background:#F7F9FC; border:1px solid #E6EBF2; margin-bottom:6px; font-size:.88rem;}',
        '#student-card-overlay .sc-bag-ad{font-weight:800; color:#1F2430;}',
        '#student-card-overlay .sc-bag-yer{color:#55606D;}',
        '#student-card-overlay .sc-bag-t{margin-inline-start:auto; font-size:.76rem; color:#8A94A3;}',
        /* bekleyen istek: sınıf seçimi + öğretmen adına onayla (SINIF SEÇİMİ, 05.11.2026) */
        '#student-card-overlay .sc-bag-onay{flex-basis:100%; display:flex; flex-direction:column; gap:6px; padding-top:6px; border-top:1px dashed #E6EBF2; font-size:.82rem; color:#55606D;}',
        '#student-card-overlay .sc-onay-ok{color:#1E8449; font-weight:700;}',
        '#student-card-overlay .sc-bag-yok{color:#A9B2BD;}',
        '#student-card-overlay .sc-bag-tus{display:flex; gap:8px; flex-wrap:wrap; align-items:center;}',
        '#student-card-overlay .sc-bag-sec{flex:1 1 180px; width:auto; padding:8px 10px; font-size:.86rem;}',
        '#student-card-overlay .sc-onayla{flex:0 0 auto; padding:8px 12px; border:none; border-radius:9px; background:#16A085; color:#fff; font-weight:800; font-size:.84rem; cursor:pointer; font-family:inherit;}',
        '#student-card-overlay .sc-yok{margin:0; color:#A9B2BD; font-size:.88rem;}',
        '#student-card-overlay .sc-bilgi{display:flex; gap:8px 18px; flex-wrap:wrap; font-size:.86rem; color:#555;}',
        '#student-card-overlay .sc-alanlar{display:flex; flex-direction:column; gap:12px;}',
        '#student-card-overlay label{font-size:.76rem; font-weight:700; color:#16A085; margin-bottom:4px; display:block; text-transform:uppercase; letter-spacing:.3px;}',
        '#student-card-overlay input, #student-card-overlay select{width:100%; padding:10px 12px; border:1px solid #E9EEF5; border-radius:10px; font-family:inherit; font-size:.95rem; box-sizing:border-box; background:#FCFDFE;}',
        '#student-card-overlay .sc-tus{display:flex; gap:10px; margin-top:4px;}',
        '#student-card-overlay .sc-kaydet{flex:1; padding:12px; border:none; border-radius:10px; background:#16A085; color:#fff; font-weight:700; cursor:pointer; font-family:inherit; font-size:.95rem;}',
        '#student-card-overlay .sc-sil{padding:12px 16px; border:none; border-radius:10px; background:#EF5350; color:#fff; font-weight:700; cursor:pointer; font-family:inherit; font-size:.95rem;}',
        '@media (max-width:560px){ #student-card-overlay{padding:0 !important;} #student-card-overlay .sc-pencere{max-height:100vh; border-radius:0;}',
        '  #student-card-overlay .sc-bas{border-radius:0;} #student-card-overlay .sc-bol{padding:12px 14px;} }'
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
}

/* ÖĞRENCİ PENCERESİ: öğretmen bağları, kullanım, kayıt/paket/anket; ad · telefon · meslek · cinsiyet
   düzenleme ve sil (eski karttaki gibi). uid = kullanicilar belge kimliği (yerel denemede e-posta). */
function openStudentCard(uidEnc) {
    var uid = decodeURIComponent(String(uidEnc || ''));
    var o = _aos.veri && _aos.veri[uid];
    if (!o) return;
    _aosStil();
    var e = _fbEsc;
    var simge = o.cinsiyet === 'kadin' ? '👩‍🎓' : (o.cinsiyet === 'erkek' ? '👨‍🎓' : '🎓');
    var kutu = function (b, s) { return '<div class="sc-k"><b>' + b + '</b><span>' + s + '</span></div>'; };

    var bag;
    if (_aos.bagYok) bag = '<p class="sc-yok">Bağ bilgisi okunamadı (ogrenciBaglari).</p>';
    else if (!o.baglar.length) bag = '<p class="sc-yok">Henüz bir öğretmene bağlı değil.</p>';
    else bag = o.baglar.map(function (b) {
        var yer = b.seviye + (b.sinif ? ' / ' + b.sinif : '');
        var satir = '<div class="sc-bag"><span class="sc-bag-ad">👨‍🏫 ' + e(b.ad) + '</span>' +
               (yer ? '<span class="sc-bag-yer">' + e(yer) + '</span>' : '') +
               _aosRozet(b.durum === 'onayli' ? 'bagli' : 'bekliyor') +
               (b.t ? '<span class="sc-bag-t">' + _aogGun(b.t) + '</span>' : '') + '</div>';
        if (b.durum !== 'bekliyor') return satir;
        /* SINIF SEÇİMİ · YÖNETİCİ ONAYI (05.11.2026) — yönetici: "öğretmen ister onaylar ister başka sınıfına
           tanımlar, ayrıca yönetici de". Bekleyen istekte öğretmenin sınıfları listelenir (öğrencinin seçimi
           hazır seçili); «Öğretmen adına onayla» isteğe yoneticiOnay yazar; öğretmenin tarayıcısı siteye girince
           öğrenciyi o sınıfa kendiliğinden ekler. Kendi koduyla gelen istekte satır bellidir, sınıf seçilmez. */
        var S = (_aos.ogtSinif && _aos.ogtSinif[b.ogt]) || [], sec = b.onerilenLId ? b.onerilenLId + '|||' + b.onerilenCId : '';
        var kaynak = b.onerilenAd
            ? (b.onerenOgrenci ? 'Öğrencinin seçtiği sınıf: <b>' + e(b.onerilenAd) + '</b>' : 'Önerilen sınıf: <b>' + e(b.onerilenAd) + '</b>')
            : (b.satirVar ? 'Kendi koduyla geldi; satırı ' + e(yer || 'listede') + ' sınıfında' : 'Sınıf seçilmedi');
        var durumYazi = b.yoneticiOnay
            ? '<span class="sc-onay-ok">✅ Yönetici onayladı' + (b.onerilenAd ? ' · ' + e(b.onerilenAd) : '') + ' — öğretmen siteye girince eklenir</span>'
            : '';
        var secim = (!b.satirVar && S.length)
            ? '<select id="sc-bag-sec-' + e(b.ogt) + '" class="sc-bag-sec"><option value="">— sınıf seç —</option>' +
              S.map(function (c) {
                  var v = c.lId + '|||' + c.cId;
                  return '<option value="' + _aosAttr(v) + '" data-ad="' + _aosAttr(c.ad) + '"' + (v === sec ? ' selected' : '') + '>' + e(c.ad) + ' (' + c.mevcut + ')</option>';
              }).join('') + '</select>'
            : (!b.satirVar ? '<span class="sc-bag-yok">öğretmenin sınıf listesi okunamadı</span>' : '');
        return satir.replace('</div>', '') +
               '<div class="sc-bag-onay"><span class="sc-bag-kaynak">' + kaynak + '</span>' + durumYazi +
                 '<div class="sc-bag-tus">' + secim +
                   '<button type="button" class="sc-onayla" onclick="adminBagOnayla(\'' + encodeURIComponent(o.uid) + '\',\'' + encodeURIComponent(b.ogt) + '\')">' +
                   (b.yoneticiOnay ? '🔁 Sınıfı güncelle' : '✅ Öğretmen adına onayla') + '</button>' +
                 '</div></div></div>';
    }).join('');

    var sonYazi = '—';
    if (o.son) {
        try { sonYazi = new Date(o.son).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
        catch (x) { sonYazi = _aogGun(o.son); }
    }
    var ALAN = [['site', 'Ana sayfa'], ['kitap', 'Dijital kitap'], ['defter', 'Defter'], ['tahta', 'Tahta'], ['etkinlik', 'Etkinlik ve araçlar']];
    var alan = ALAN.filter(function (x) { return (+o.alan[x[0]] || 0) >= 60; })
        .map(function (x) { return '<span><b>' + e(_sureBicim(o.alan[x[0]])) + '</b> ' + x[1] + '</span>'; }).join('');
    var kul = (o.sure || o.gun)
        ? '<div class="sc-kutular">' + kutu(e(_sureBicim(o.sure)), 'toplam süre') + kutu(o.gun, 'gün girdi') +
          kutu(e(_sureBicim(o.hafta)), 'son 7 gün') + (o.oturum ? kutu(o.oturum, 'ziyaret') : '') + '</div>' +
          '<div class="sc-satir">Son görülme: <b>' + e(sonYazi) + '</b></div>' +
          (alan ? '<div class="sc-alan">' + alan + '</div>' : '')
        : '<p class="sc-yok">Kullanım kaydı yok — siteyi henüz kullanmamış.</p>';

    var anket = _aosAnketYazi(o.anket);
    var bilgi = '<div class="sc-bilgi"><span>📅 <b>Kayıt:</b> ' + (o.kayit ? _aogGun(o.kayit) : '—') + '</span>' +
                '<span>📦 <b>Paket:</b> ' + o.paket + '</span>' +
                (anket ? '<span>📝 <b>Anket:</b> ' + e(anket) + '</span>' : '') + '</div>';

    var sec = function (v, y) { return '<option value="' + v + '"' + (o.cinsiyet === v ? ' selected' : '') + '>' + y + '</option>'; };
    var duzen =
        '<div class="sc-alanlar">' +
          '<div><label for="sc-ad">Ad Soyad</label><input id="sc-ad" value="' + e(o.ad).replace(/"/g, '&quot;') + '" placeholder="Belirtilmedi"></div>' +
          '<div><label for="sc-tel">Telefon</label><input id="sc-tel" value="' + e(o.tel).replace(/"/g, '&quot;') + '" placeholder="Belirtilmedi"></div>' +
          '<div><label for="sc-meslek">Meslek</label><input id="sc-meslek" value="' + e(o.meslek).replace(/"/g, '&quot;') + '" placeholder="Belirtilmedi"></div>' +
          '<div><label for="sc-cins">Cinsiyet</label><select id="sc-cins">' + sec('', 'Belirtilmedi') + sec('erkek', 'Erkek') + sec('kadin', 'Kadın') + '</select></div>' +
          '<div class="sc-tus">' +
            '<button type="button" class="sc-kaydet" onclick="saveStudentCard(\'' + encodeURIComponent(uid) + '\')">💾 Kaydet</button>' +
            '<button type="button" class="sc-sil" onclick="deleteStudentCard(\'' + encodeURIComponent(uid) + '\')">🗑️ Sil</button>' +
          '</div>' +
        '</div>';

    var ov = document.getElementById('student-card-overlay');
    if (ov) ov.remove();
    ov = document.createElement('div');
    ov.id = 'student-card-overlay';
    ov.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.45); z-index:10000; display:flex; align-items:center; justify-content:center; padding:20px;';
    ov.onclick = function (ev) { if (ev.target === ov) ov.remove(); };
    ov.innerHTML =
        '<div class="sc-pencere" role="dialog" aria-label="Öğrenci bilgileri">' +
          '<div class="sc-bas"><div class="sc-simge">' + simge + '</div>' +
            '<div class="sc-bas-yazi"><div class="sc-ad">' + e(o.ad || 'İsimsiz Öğrenci') + '</div><div class="sc-ep">' + e(o.email || '—') + '</div></div>' +
            '<button type="button" class="sc-kapat" onclick="document.getElementById(\'student-card-overlay\').remove()" aria-label="Kapat">&times;</button>' +
          '</div>' +
          '<div class="sc-bol"><h4>🔗 Öğretmen bağı</h4>' + bag + '</div>' +
          '<div class="sc-bol"><h4>⏱ Site kullanımı</h4>' + kul + '</div>' +
          '<div class="sc-bol">' + bilgi + '</div>' +
          '<div class="sc-bol">' + duzen + '</div>' +
        '</div>';
    document.body.appendChild(ov);
}

/* YÖNETİCİ ONAYI (05.11.2026): bekleyen isteğe önerilen sınıf + yoneticiOnay yazılır; ekleme öğretmenin
   tarayıcısında olur (hesap/ogrencihesap.js → OH.yoneticiOnaylariIsle). Kendi koduyla gelen istekte sınıf
   seçilmez, satır bellidir. */
function adminBagOnayla(uidEnc, ogtEnc) {
    var uid = decodeURIComponent(String(uidEnc || '')), ogt = decodeURIComponent(String(ogtEnc || ''));
    var o = _aos.veri && _aos.veri[uid];
    if (!o) return;
    var b = o.baglar.filter(function (x) { return x.ogt === ogt; })[0];
    if (!b || b.durum !== 'bekliyor') return;
    var payload = { yoneticiOnay: true };
    try { payload.yoneticiOnayTarih = firebase.firestore.FieldValue.serverTimestamp(); } catch (e) { payload.yoneticiOnayTarih = Date.now(); }
    var secAd = '';
    if (!b.satirVar) {
        var sel = document.getElementById('sc-bag-sec-' + ogt), v = sel ? sel.value : '';
        if (!v) { _abUyar('Önce öğrencinin ekleneceği sınıfı seç.'); return; }
        var pr = v.split('|||'), opt = sel.options[sel.selectedIndex];
        secAd = (opt && opt.getAttribute('data-ad')) || '';
        payload.onerilenLId = pr[0]; payload.onerilenCId = pr[1]; payload.onerilenAd = secAd;
        if (!(b.onerenOgrenci && v === b.onerilenLId + '|||' + b.onerilenCId)) payload.onerenOgrenci = false;
    }
    var bitti = function () {
        Object.assign(b.doc, payload);                       /* önbellekteki bağ belgesi de güncel kalsın */
        b.yoneticiOnay = true;
        if (secAd) { b.onerilenLId = payload.onerilenLId; b.onerilenCId = payload.onerilenCId; b.onerilenAd = secAd; b.onerenOgrenci = !!payload.onerenOgrenci || b.onerenOgrenci; }
        _abUyar('Onay yazıldı: «' + (o.ad || o.email) + '» → ' + b.ad + (secAd ? ' · ' + secAd : '') +
                '. Öğretmen siteye girince öğrenci sınıfa kendiliğinden eklenir.');
        renderAdminStudentList('onbellek');
        openStudentCard(encodeURIComponent(uid));
    };
    if (typeof firebase !== 'undefined' && typeof isFirebaseReady !== 'undefined' && isFirebaseReady) {
        firebase.firestore().collection('ogrenciBaglari').doc(b.id).set(payload, { merge: true }).then(bitti, function (err) {
            _abUyar('Yazılamadı: ' + ((err && (err.message || err.code)) || err));
        });
    } else bitti();
}
window.adminBagOnayla = adminBagOnayla;

function saveStudentCard(uidEnc) {
    var uid = decodeURIComponent(String(uidEnc || '')), o = _aos.veri && _aos.veri[uid];
    if (!o) return;
    var al = function (id) { var el = document.getElementById(id); return el ? String(el.value || '').trim() : ''; };
    var payload = { name: al('sc-ad') || 'Belirtilmedi', phone: al('sc-tel'), meslek: al('sc-meslek'), cinsiyet: al('sc-cins') };
    var bitti = function () {
        Object.assign(o.doc, payload);                       /* önbellekteki belge de güncel kalsın (10 dk) */
        _abUyar('Öğrenci bilgileri güncellendi.');
        var ov = document.getElementById('student-card-overlay'); if (ov) ov.remove();
        renderAdminStudentList('onbellek');
    };
    if (typeof firebase !== 'undefined' && typeof isFirebaseReady !== 'undefined' && isFirebaseReady) {
        firebase.firestore().collection('kullanicilar').doc(uid).update(payload).then(bitti, function (err) {
            _abUyar('Güncellenemedi: ' + ((err && (err.message || err.code)) || err));
        });
    } else {
        try {
            var users = JSON.parse(localStorage.getItem('mockUsers') || '{}');
            if (users[uid]) { Object.assign(users[uid], payload); users[uid].profession = payload.meslek; localStorage.setItem('mockUsers', JSON.stringify(users)); }
        } catch (e) { }
        bitti();
    }
}

function deleteStudentCard(uidEnc) {
    var uid = decodeURIComponent(String(uidEnc || '')), o = _aos.veri && _aos.veri[uid];
    if (!o) return;
    _abSor('Bu öğrenciyi listeden silmek istediğinize emin misiniz?\n\n' + (o.ad ? o.ad + ' — ' : '') + (o.email || uid) +
           '\n\n(Bu işlem öğrencinin kayıt bilgisini kaldırır.)', function () {
        var bitti = function () {
            _abUyar('Öğrenci silindi.');
            var ov = document.getElementById('student-card-overlay'); if (ov) ov.remove();
            delete _abOnbellek.ogrenci;                        /* önbellek eski: liste yeniden okunur */
            renderAdminStudentList();
        };
        if (typeof firebase !== 'undefined' && typeof isFirebaseReady !== 'undefined' && isFirebaseReady) {
            firebase.firestore().collection('kullanicilar').doc(uid).delete().then(bitti, function (err) {
                _abUyar('Silinemedi: ' + ((err && (err.message || err.code)) || err));
            });
        } else {
            try {
                var users = JSON.parse(localStorage.getItem('mockUsers') || '{}');
                delete users[uid]; localStorage.setItem('mockUsers', JSON.stringify(users));
            } catch (e) { }
            bitti();
        }
    });
}


/* ==========================================================================
   ÖĞRETMEN ONAYLARI  (sistem/erisim.js ile birlikte çalışır)
   Öğretmen kaydı kullanicilar/{uid}.ogretmenOnay = 'bekliyor' ile açılır;
   hesap onaylanana kadar siteye giremez. Buradan onaylanınca alan 'onayli'
   olur ve öğretmenin ekranındaki perde ANINDA kalkar (kendi belgesini
   onSnapshot ile dinliyor). "Reddet" hesabı silmez, yalnız kapalı tutar.
   ========================================================================== */
/* Onay bekleyenlerin ad/e-postası. Onay mesajında kullanılıyor; adı inline
   onclick'e gömmek tırnak kaçışı gerektirirdi (Ayşe'nin gibi bir ad HTML'i
   kırardı), bu yüzden uid ile burada tutuluyor. */
var _onayBekleyen = {};

/* REDDEDİLENLER (26.10.2026) — yönetici: "yöneticinin reddettiği
   öğretmenleri görüp sonradan onay verebilmesini istiyorum". Bölüm artık
   iki liste: üstte onay bekleyenler (eskisi gibi), altta «Reddedilenler»
   (KidefErisim.reddedilenler). Reddedilen hesap silinmez, kapalı durur;
   «Onayla» onu açar ve hoş geldin mesajı gider — bekleyeni onaylamakla
   aynı yol (ogretmenOnayVer → KidefErisim.onayla). Red tarihi bu günden
   sonra reddedilenlerde görünür (reddet → redTarihi). Ad ve meslek artık
   HTML'e kaçırılarak basılıyor. */
function _onayBaslik(ikon, yazi, n, renk) {
    return '<div style="display:flex; align-items:center; gap:8px; margin:4px 0 8px; font-weight:800; color:' + renk + ';">' +
             ikon + ' ' + yazi +
             (n ? '<span style="background:' + renk + '; color:#fff; border-radius:999px; padding:1px 9px; font-size:0.78rem;">' + n + '</span>' : '') +
           '</div>';
}
function _onaySatir(o, red) {
    var isim = (o.name && o.name !== 'Belirtilmedi') ? o.name : '';
    var ad = isim || o.email || o._id;
    /* TELEFON DA TAŞINIYOR (08.10.2026) — hoş geldin mesajı
       doğrudan öğretmenin numarasına açılabilsin diye. */
    _onayBekleyen[o._id] = { ad: isim, email: (o.email || ''), tel: (o.phone || '') };
    var tarih = '';
    if (red) {
        var t = [], kayit = o.onayIstekTarihi || o.createdAt;
        if (kayit && kayit.toDate) t.push('Kayıt ' + _ogrTarih(kayit));
        if (o.redTarihi && o.redTarihi.toDate) t.push('Reddedildi ' + _ogrTarih(o.redTarihi));
        if (t.length) tarih = '<span class="aon-tarih" style="display:block; font-size:0.8rem; color:#9AA3AE; margin-top:3px;">' + t.join(' · ') + '</span>';
    }
    return '<div class="aon-satir' + (red ? ' aon-red' : '') + '" data-aon-uid="' + o._id + '" style="display:flex; align-items:center; gap:12px; ' +
                'background:' + (red ? '#FFFBFA' : '#fff') + '; border:1px solid ' + (red ? '#F3D9D5' : '#E9EEF5') + '; ' +
                'border-radius:10px; padding:11px 14px; margin-bottom:8px; flex-wrap:wrap;">' +
             '<div style="flex:1; min-width:180px;">' +
               '<strong style="display:block; color:#2c3e50;">' + _fbEsc(ad) + '</strong>' +
               /* TELEFON KOPYALANABİLİR (05.10.2026) — öğretmen:
                  "öğretmen telefonunu kolayca kopyalayabilsin".
                  Eskiden e-posta/meslek ile aynı yazının içindeydi,
                  fareyle seçmek zordu. Artık kendi rozetinde:
                  tıkla → panoya kopyalanır. (sistem/telkopya.js) */
               '<span style="font-size:0.85rem; color:#7f8c8d;">' + _fbEsc(o.email || '') +
                 (o.meslek ? ' · ' + _fbEsc(o.meslek) : '') + '</span>' +
               (window.KidefTelKopya ? window.KidefTelKopya.rozet(o.phone)
                                    : (o.phone ? '<span style="font-size:0.85rem; color:#7f8c8d;"> · ' + _fbEsc(o.phone) + '</span>' : '')) +
               tarih +
             '</div>' +
             /* BELGE İSTE (13.10.2026) — yönetici: "onaylamadan
                önce öğretmen olduğunu ispatlamasını istediğim bi
                mesaj olacak, öğretmenin ismi de olacak."
                Onaylamadan açılır; metin öğretmenin adıyla gelir,
                kopyalanıp WhatsApp'tan gönderilir. */
             '<button class="btn" style="background:#FEF3E2; color:#B5670A; padding:7px 14px; font-size:0.9rem; font-weight:700;" ' +
               'title="Onaylamadan önce öğretmenlik belgesi iste" ' +
               'onclick="ogretmenBelgeIste(\'' + o._id + '\')">Belge iste</button>' +
             '<button class="btn" style="background:#27ae60; color:#fff; padding:7px 16px; font-size:0.9rem;" ' +
               (red ? 'title="Hesabı aç; hoş geldin mesajı gider" ' : '') +
               'onclick="ogretmenOnayVer(\'' + o._id + '\', true)">Onayla</button>' +
             (red ? '' :
             '<button class="btn" style="background:#EDF1F7; color:#5b6b80; padding:7px 16px; font-size:0.9rem;" ' +
               'onclick="ogretmenOnayVer(\'' + o._id + '\', false)">Reddet</button>') +
           '</div>';
}

/* ÖĞRETMEN ONAYLARI EN ÜSTTE (27.10.2026) — yönetici: "yönetici panelinde en üstte
   öğretmen onaylayı ekleyelim, sadece yönetici giriş yaptığında görünecek sakın öğretmen
   girdiğinde görünmesin" · "30 saniyede bi otomatik güncellensin".
   · Bölüm panelin en üstünde, açık başlar; akordiyondan ayrı.
   · YALNIZ YÖNETİCİ: renderAdminPanel bölümü yalnız appState.userRole === 'admin' iken
     çizer. Rol değişirse (çıkış, başka hesap) _aonTik bölümü sayfadan söker, listeyi ve
     önbelleği siler (_aonSok). Sorgular zaten yalnız yöneticiye açık (kurallar).
   · Panel ekrandayken ve sekme önündeyken 30 sn'de bir SESSİZ yenileme: imza (kimlik, ad,
     e-posta, telefon, meslek, tarihler) değişmediyse liste yeniden çizilmez, yalnız saat
     yazısı tazelenir; değiştiyse kaydırma yeri korunarak çizilir, yeni bekleyen bir an
     parlar. Panel kapalıyken / sekme arkadayken sorgu yok. Panel yeniden çizilince son liste
     hemen konur (_aon.html), 30 sn'den eskiyse arkadan tazelenir. */
var _aon = { son: 0, imza: '', html: '', rozet: '', dolu: false, yuk: null, zam: null, bek: null, gor: false,
             din: null, dinUid: '', canli: null, kopuk: 0 };
function _aonYoneticiMi() {
    try { return typeof appState !== 'undefined' && !!appState && appState.userRole === 'admin'; }
    catch (e) { return false; }
}
function _aonMs(t) {
    try { return (t && t.toDate) ? (t.toDate().getTime() || 0) : (typeof t === 'number' ? t : 0); }
    catch (e) { return 0; }
}
function _aonImza(liste, red) {
    var f = function (o) {
        return [o._id, o.name || '', o.email || '', o.phone || '', o.meslek || '',
                _aonMs(o.onayIstekTarihi || o.createdAt), _aonMs(o.redTarihi)].join('\u0001');
    };
    return liste.map(f).join('\u0002') + '\u0003' + (red.hata ? '!' + red.hata : red.map(f).join('\u0002'));
}
function _aonSaat(hata) {
    var z = document.getElementById('admin-onay-zaman');
    if (!z) return;
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    var d = new Date(hata ? Date.now() : (_aon.son || Date.now()));
    var saat = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
    z.textContent = hata ? 'Canlı bağlantı koptu (' + saat + ') — yeniden bağlanılacak; 🔄 Yenile ile de tazelenir'
                         : 'Canlı · son güncelleme ' + saat;
    z.classList.toggle('aon-zaman-hata', !!hata);
}
function _aonCerceve() {
    var d = document.getElementById('admin-onay-details');
    if (d) d.classList.toggle('aon-var', !!_aon.dolu);
}
/* yönetici değilse bölüm sayfada kalmasın; liste ve önbellek silinir */
function _aonSok() {
    var d = document.getElementById('admin-onay-details');
    if (d && d.parentNode) d.parentNode.removeChild(d);
    if (typeof _ogsDur === 'function') _ogsDur();      /* canlı öğretmen sayacı (02.11.2026) */
    var ogsK = document.getElementById('ogs-kutu');
    if (ogsK && ogsK.parentNode) ogsK.parentNode.removeChild(ogsK);
    var aspD = document.getElementById('admin-supheli-details');      /* öğretmen olabilecek öğrenciler */
    if (aspD && aspD.parentNode) aspD.parentNode.removeChild(aspD);
    _onayBekleyen = {};
    _aon.son = 0; _aon.imza = ''; _aon.html = ''; _aon.rozet = ''; _aon.dolu = false; _aon.bek = null;
    if (_aon.zam) { clearInterval(_aon.zam); _aon.zam = null; }
    _aonDinlemeyiBirak();
}
/* OKUMA AZALT (27.10.2026): 30 sn'de bir sorgu yerine iki canlı dinleyici. İlk açılışta
   listeler bir kez okunur, sonra yalnız değişen belge gelir. Dinleyici koparsa (ağ, kural)
   60 sn sonra yeniden bağlanır; o arada «🔄 Yenile» elle okur. */
function _aonDinlemeyiBirak() {
    if (_aon.din) { _aon.din.forEach(function (u) { try { u(); } catch (e) { } }); }
    _aon.din = null; _aon.dinUid = ''; _aon.canli = null;
}
function _aonUid() {
    try { var u = firebase.auth().currentUser; return u ? u.uid : ''; } catch (e) { return ''; }
}
function _aonDinle() {
    if (!_aonYoneticiMi()) { _aonSok(); return; }
    if (typeof firebase === 'undefined' || !isFirebaseReady) return;
    var uid = _aonUid();
    if (_aon.din && _aon.dinUid === uid) return;
    _aonDinlemeyiBirak();
    _aon.dinUid = uid; _aon.canli = { liste: null, red: null };
    _ogs.bek = null;                                   /* canlı öğretmen sayacı: ilk teslim taban */
    var kol = firebase.firestore().collection('kullanicilar');
    var ad = function (x) { return String(x.name || ''); };
    var ms = function (t) { try { return (t && t.toDate) ? (t.toDate().getTime() || 0) : (typeof t === 'number' ? t : 0); } catch (e) { return 0; } };
    var koptu = function (e) {
        _aon.kopuk = Date.now();
        _aonDinlemeyiBirak();
        _aonSaat(true);
        try { console.warn('öğretmen onayları dinleyicisi koptu:', e && (e.code || e.message)); } catch (x) { }
    };
    var u1 = kol.where('ogretmenOnay', '==', 'bekliyor').onSnapshot(function (snap) {
        var l = [];
        snap.forEach(function (d) { var v = d.data() || {}; v._id = d.id; l.push(v); });
        l.sort(function (a, b) { return ad(a).localeCompare(ad(b), 'tr'); });
        _ogsBekleyen(l);                               /* yeni kayıt → sayaç yeniden sayar */
        if (_aon.canli) { _aon.canli.liste = l; _aonCanliCiz(); }
    }, koptu);
    var u2 = kol.where('ogretmenOnay', '==', 'reddedildi').onSnapshot(function (snap) {
        var l = [];
        snap.forEach(function (d) { var v = d.data() || {}; v._id = d.id; l.push(v); });
        l.sort(function (a, b) { return (ms(b.redTarihi) - ms(a.redTarihi)) || ad(a).localeCompare(ad(b), 'tr'); });
        if (_aon.canli) { _aon.canli.red = l; _aonCanliCiz(); }
    }, function (e) {
        /* reddedilenler alınamazsa bekleyenler yine gelsin */
        if (_aon.canli) { _aon.canli.red = { hata: (e && (e.code || e.message)) || String(e) }; _aonCanliCiz(); }
    });
    _aon.din = [u1, u2];
}
function _aonCanliCiz() {
    var c = _aon.canli;
    if (!c || !c.liste || !c.red) return;                 /* ikisi de gelsin */
    _aonCiz(c.liste, c.red, true);
}
function _aonStil() {
    if (document.getElementById('aon-stil')) return;
    var st = document.createElement('style');
    st.id = 'aon-stil';
    st.textContent =
        '#admin-onay-details.aon-var{ border-color:#F5C77E; box-shadow:0 0 0 2px rgba(245,199,126,.35), 0 4px 10px rgba(0,0,0,.05); }' +
        '.aon-zaman{ font-size:.78rem; color:#9AA3AE; }' +
        '.aon-zaman.aon-zaman-hata{ color:#B03A2E; }' +
        '#admin-onay-list .aon-satir.aon-yeni{ animation: aonYeni 3s ease-out 1; }' +
        '@keyframes aonYeni{ 0%, 40%{ background:#FFF3C4; box-shadow:0 0 0 3px #FFE08A; } 100%{ box-shadow:0 0 0 0 rgba(255,224,138,0); } }' +
        '@media (prefers-reduced-motion: reduce){ #admin-onay-list .aon-satir.aon-yeni{ animation:none; background:#FFF8DC; } }';
    (document.head || document.documentElement).appendChild(st);
}
function loadOgretmenOnaylari(sessiz) {
    sessiz = (sessiz === true);
    if (!_aonYoneticiMi()) { _aonSok(); return; }
    var kutu = document.getElementById('admin-onay-list');
    if (!kutu) return;
    if (typeof firebase === 'undefined' || !isFirebaseReady || !window.KidefErisim) {
        kutu.innerHTML = '<p>Bu kip çevrimdışıyken kullanılamaz.</p>';
        return;
    }
    if (sessiz && _aon.yuk) return;                     /* sessiz yenileme üst üste binmesin */
    _aonStil();
    if (!sessiz) kutu.innerHTML = '<p>Yükleniyor…</p>';
    /* reddedilenler alınamazsa bekleyenler yine gelsin */
    var redSoz = (window.KidefErisim.reddedilenler ? window.KidefErisim.reddedilenler() : Promise.resolve([]))
        .catch(function (e) { return { hata: (e && (e.code || e.message)) || String(e) }; });
    var is = Promise.all([window.KidefErisim.bekleyenler(), redSoz]).then(function (s) {
        if (_aon.yuk === is) _aon.yuk = null;
        if (!_aonYoneticiMi()) { _aonSok(); return; }
        _aonCiz(s[0] || [], s[1] || [], sessiz);
    }).catch(function (e) {
        if (_aon.yuk === is) _aon.yuk = null;
        if (!_aonYoneticiMi()) { _aonSok(); return; }
        var k = document.getElementById('admin-onay-list');
        if (!k) return;
        if (sessiz && _aon.html) { _aon.son = Date.now(); _aonSaat(true); return; }   /* eski liste kalsın */
        k.innerHTML = '<p>' + _fbEsc(_abHataMetni(e)) + '</p>' +
            '<button class="btn" onclick="loadOgretmenOnaylari()" style="margin-top:10px; font-size:.9rem;">🔄 Yenile</button>';
        k.removeAttribute('data-aon-imza');
        _aon.son = Date.now();
    });
    _aon.yuk = is;
}
window.loadOgretmenOnaylari = loadOgretmenOnaylari;
/* listeyi çizer (elle yenileme ve canlı dinleyici aynı yoldan) */
function _aonCiz(liste, red, sessiz) {
    (function () {
        var k = document.getElementById('admin-onay-list');   /* panel bu arada yeniden çizilmiş olabilir */
        if (!k) return;
        var imza = _aonImza(liste, red);
        _aon.son = Date.now();
        if (sessiz && imza === _aon.imza && k.getAttribute('data-aon-imza') === imza) { _aonSaat(); return; }
        var rozetHtml = liste.length
            ? '<span style="background:#e74c3c; color:#fff; border-radius:999px; padding:2px 10px; font-size:0.8rem; margin-left:8px;">' + liste.length + '</span>'
            : '';
        var rozet = document.getElementById('admin-onay-badge');
        if (rozet) rozet.innerHTML = rozetHtml;
        _onayBekleyen = {};
        var html = _onayBaslik('⏳', 'Onay bekleyenler', liste.length, '#B5670A');
        if (!liste.length) html += '<p style="margin:0 0 6px;">Onay bekleyen öğretmen yok.</p>';
        liste.forEach(function (o) { html += _onaySatir(o, false); });
        html += '<div class="aon-red-bolum" style="margin-top:16px; padding-top:12px; border-top:1px dashed #E3C9C5;">' +
                _onayBaslik('⛔', 'Reddedilenler', red.hata ? 0 : red.length, '#B03A2E');
        if (red.hata) html += '<p style="margin:0; color:#B03A2E; font-size:0.85rem;">Reddedilenler alınamadı: ' + _fbEsc(red.hata) + '</p>';
        else if (!red.length) html += '<p style="margin:0; font-size:0.85rem; color:#9AA3AE;">Reddedilen öğretmen yok.</p>';
        else {
            html += '<p style="margin:0 0 8px; font-size:0.82rem; color:#8A94A3; line-height:1.5;">' +
                    'Reddedilen hesap silinmez, kapalı durur. <b>Onayla</b>ya basınca açılır ve hoş geldin mesajı gider.</p>';
            red.forEach(function (o) { html += _onaySatir(o, true); });
        }
        html += '</div>';
        var ust = k.scrollTop;
        k.innerHTML = html;
        k.setAttribute('data-aon-imza', imza);
        k.scrollTop = ust;
        /* yeni gelen bekleyen bir an parlasın (ilk yüklemede değil) */
        if (_aon.bek) liste.forEach(function (o) {
            if (_aon.bek[o._id]) return;
            var r = k.querySelector('.aon-satir[data-aon-uid="' + String(o._id).replace(/["\\]/g, '') + '"]');
            if (r) r.classList.add('aon-yeni');
        });
        _aon.bek = {};
        liste.forEach(function (o) { _aon.bek[o._id] = 1; });
        _aon.imza = imza; _aon.html = html; _aon.rozet = rozetHtml; _aon.dolu = liste.length > 0;
        _aonCerceve();
        _aonSaat();
    })();
}
/* Her saniye bakar (yalnız birkaç karşılaştırma): yönetici değilse söker; dinleyici koptuysa
   60 sn sonra yeniden bağlanır. (30 sn'lik sorgu kalktı — OKUMA AZALT 27.10.2026) */
function _aonTik() {
    if (!_aonYoneticiMi()) { _aonSok(); return; }
    if (!document.getElementById('admin-onay-list')) return;
    if (_aon.din && _aon.dinUid === _aonUid()) return;
    if (document.visibilityState === 'hidden') return;          /* sekme arkada */
    if (Date.now() - _aon.kopuk < 60000) return;
    _aonDinle();
}
window._aonTik = _aonTik;
function _aonBaslat() {
    if (!_aonYoneticiMi()) { _aonSok(); return; }
    _aonStil();
    if (!_aon.zam) _aon.zam = setInterval(_aonTik, 1000);
    if (!_aon.gor) {
        _aon.gor = true;
        document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') _aonTik(); });
    }
    var kutu = document.getElementById('admin-onay-list');
    if (!kutu) return;
    if (_aon.html) {                                   /* son liste hemen görünsün */
        kutu.innerHTML = _aon.html;
        kutu.setAttribute('data-aon-imza', _aon.imza);
        var rz = document.getElementById('admin-onay-badge');
        if (rz) rz.innerHTML = _aon.rozet;
        _aonCerceve();
        _aonSaat();
    } else kutu.innerHTML = '<p>Yükleniyor…</p>';
    _aonDinle();                                       /* canlı: ilk liste gelince çizilir */
    if (_aon.canli && _aon.canli.liste && _aon.canli.red && !_aon.html) _aonCanliCiz();
}

/* ÖĞRETMENLER VE ÖĞRENCİLER YAN YANA (12.11.2026) — yönetici: "yönetici panelinde öğretmenler kısmına basınca öğretmen ve
   öğrenci kısmı açılıyor ya, masaüstünde açıldığında iki sekme olarak açılsın, başlık öğretmenler olmasın, solda
   öğretmenler sağda öğrenciler olsun, hem bir kerede karşılaştırma yapmış oluruz, hem ikisini aynı anda görmüş olurum".
   · Bölüm başlığı «👨‍🏫 Öğretmenler ve Öğrenciler» (iki listeyi de kapsıyor).
   · GENİŞ EKRAN (≥ 1024 px: masaüstü, yatay tablet): «👥 Öğretmen listesi» solda, «🎓 Öğrenci listesi» sağda; ikisi
     aynı anda AÇIK, başlıkları katlanmaz, her liste kendi içinde kayar. İkisi akordiyondan çıkarılır (name kalkar):
     «Ödeme Onayları» gibi öbür bölümleri açmak bunları kapatmaz. Arama · süzgeç · sıralama her listede ayrı çalışır
     (kimlikler ve kapsamlar ayrı: aog* / aos*).
   · DAR EKRAN (telefon, dik tablet): eskisi gibi — iki liste kapalı başlar, akordiyonun parçasıdır (name="admin-accordion").
     Pencere eşiği geçerse düzen kendiliğinden döner (geniş → dar: ikisi kapanır ve akordiyona girer).
   · OKUMA AZALT (27.10.2026) korunur: listeler panel çizilince değil, iki sütun EKRANDA GÖRÜNÜNCE açılır ve okunur
     (IntersectionObserver): panel gizliyken, bölüm kapalıyken ya da sütunlar sayfada henüz aşağıdayken sorgu yok.
     Okuma yine 'onbellek' (10 dk): taze önbellek varsa Firestore'a gidilmez. */
var _aoi = { mq: null, io: null };
function _aonIkiBolumler() {
    return { d: document.getElementById('admin-onay-details'),
             a: document.getElementById('admin-ogretmen-liste'),
             b: document.getElementById('admin-ogrenci-liste') };
}
/* iki sütun kipindeyken ve bölüm açıkken iki listeyi de aç (açıksa dokunmaz; ontoggle listeleri çizer) */
function _aonIkiAc() {
    var p = _aonIkiBolumler();
    if (!p.d || !p.a || !p.b || !p.d.open || !p.d.classList.contains('aog-iki-acik')) return;
    if (!p.a.open) p.a.open = true;
    if (!p.b.open) p.b.open = true;
}
/* iki sütun ekranda görününce _aonIkiAc çağrılır; her çağrıda gözcü yeniden kurulur (ilk bildirim bugünkü durumu verir) */
function _aonIkiGoz() {
    if (_aoi.io) { try { _aoi.io.disconnect(); } catch (e) { } _aoi.io = null; }
    var w = document.querySelector('#admin-onay-details .aog-iki');
    if (!w) return;
    if (typeof IntersectionObserver === 'undefined') { _aonIkiAc(); return; }          /* çok eski tarayıcı: görünürlük ölçülemez */
    _aoi.io = new IntersectionObserver(function (g) {
        for (var i = 0; i < g.length; i++) { if (g[i].isIntersecting) { _aonIkiAc(); return; } }
    }, { rootMargin: '0px 0px 240px 0px' });
    _aoi.io.observe(w);
}
/* genişliğe göre kipi uygula: geniş → sınıf + name kalkar; dar → iki liste kapanır, name geri gelir */
function _aonIkiUygula() {
    var p = _aonIkiBolumler();
    if (!p.d || !p.a || !p.b) return;
    var iki = !!(_aoi.mq && _aoi.mq.matches);
    if (iki === p.d.classList.contains('aog-iki-acik')) return;
    p.d.classList.toggle('aog-iki-acik', iki);
    if (iki) {
        p.a.removeAttribute('name'); p.b.removeAttribute('name');
    } else {
        p.a.open = false; p.b.open = false;                                              /* eski düzen: ikisi kapalı başlar */
        p.a.setAttribute('name', 'admin-accordion'); p.b.setAttribute('name', 'admin-accordion');
    }
}
/* renderAdminPanel her çizişte çağırır (yönetici değilse bölüm yoktur: hiçbir şey yapmaz) */
function _aonIkiKur() {
    var p = _aonIkiBolumler();
    if (!p.d || !p.a || !p.b) return;
    if (!_aoi.mq && window.matchMedia) {
        _aoi.mq = window.matchMedia('(min-width: 1024px)');
        var degisti = function () { _aonIkiUygula(); _aonIkiGoz(); };
        if (_aoi.mq.addEventListener) _aoi.mq.addEventListener('change', degisti);
        else if (_aoi.mq.addListener) _aoi.mq.addListener(degisti);
    }
    [p.a, p.b].forEach(function (s) {
        var ozet = s.querySelector(':scope > summary');
        if (ozet) ozet.addEventListener('click', function (e) {
            if (p.d.classList.contains('aog-iki-acik')) e.preventDefault();            /* iki sütunda başlıklar katlanmaz */
        });
    });
    p.d.addEventListener('toggle', function () { if (p.d.open) _aonIkiGoz(); });         /* bölüm kapatılıp yeniden açılınca */
    _aonIkiUygula();
    _aonIkiGoz();
}

/* Onaydan hemen sonra, elle paylaşılacak kısa mesajı gösterir.
   Öğretmen kodu varsa mesaja girsin diye OH.koduTuret'ten okunuyor;
   modül ya da kod yoksa kart yine açılıyor, yalnız kod satırı olmuyor.
   Kart açılmazsa onay YİNE GEÇERLİ — asıl iş rol güncellemesi. */
function paylasilacakMesaj(uid, bilgi) {
    try {
        if (!window.KidefHosgeldin) return;
        var kod = '';
        try { if (window.OH && OH.koduTuret) kod = OH.koduTuret(uid) || ''; } catch (e) { kod = ''; }
        /* E-POSTA (03.11.2026): kayıt e-postası da karta gider («E-postayla gönder») */
        window.KidefHosgeldin.goster((bilgi && bilgi.ad) || '', kod,
                                    (bilgi && bilgi.tel) || '', (bilgi && bilgi.email) || '');
    } catch (e) {
        try { console.warn('Paylaşılacak mesaj açılamadı:', e); } catch (x) {}
    }
}

/* Onaylarken öğretmenin adı/e-postası _onayBekleyen'den okunur ve hoş
   geldin mesajına geçirilir (KidefErisim.onayla). */
function ogretmenOnayVer(uid, onay) {
    if (!window.KidefErisim) return;
    var islem = onay
        ? window.KidefErisim.onayla(uid, _onayBekleyen[uid] || {})
        : window.KidefErisim.reddet(uid);
    var _bilgi = _onayBekleyen[uid] || {};
    islem.then(function () {
        if (typeof showCustomAlert === 'function') {
            showCustomAlert(onay ? 'Öğretmen onaylandı, hoş geldin mesajı gönderildi.'
                                 : 'Başvuru reddedildi. Hesap silinmedi; altta «Reddedilenler»de duruyor, istersen sonradan onaylayabilirsin.');
        }
        /* PAYLAŞILACAK MESAJ (07.10.2026) — öğretmen: "onayladıktan sonra
           onun ismiyle bi hoşgeldin mesajı ... hızlıca kopyalayabileyim,
           WhatsApp'tan paylaşacağım." Site içi mesaj zaten gidiyor
           (KidefErisim.onayla); bu kart ayrıca elde kopyalanacak kısa
           metni veriyor. */
        if (onay) paylasilacakMesaj(uid, _bilgi);
        loadOgretmenOnaylari();
        /* Öğretmenler listesi açıksa onun durum rozetleri de tazelensin (26.10.2026) */
        if (document.getElementById('aogGrid') && typeof renderAdminTeacherList === 'function') renderAdminTeacherList();
    }).catch(function (e) {
        if (typeof showCustomAlert === 'function') showCustomAlert('İşlem başarısız: ' + (e && (e.code || e.message)));
    });
}
window.ogretmenOnayVer = ogretmenOnayVer;

/* ONAYDAN ÖNCE: öğretmenlik belgesi isteyen mesajı açar (13.10.2026).
   Onay durumuna dokunmaz — yalnız kopyalanacak metni gösterir. */
function ogretmenBelgeIste(uid) {
    var b = _onayBekleyen[uid] || {};
    try {
        if (window.KidefHosgeldin && KidefHosgeldin.ispatIste) {
            KidefHosgeldin.ispatIste(b.ad || '', b.tel || '', b.email || '');   /* E-POSTA (03.11.2026) */
        } else if (typeof showCustomAlert === 'function') {
            showCustomAlert('Mesaj penceresi yüklenemedi.');
        }
    } catch (e) {
        try { console.warn('Belge isteme mesajı açılamadı:', e); } catch (x) { }
    }
}
window.ogretmenBelgeIste = ogretmenBelgeIste;

/* ===================================================================
   ÖĞRETMENLER — GERÇEK LİSTE (Firestore)

   ESKİDEN: bu tablo appState.teachers'ı yani hesap/ogretmen.js içindeki
   SABİT DATA_OGRETMENLER dizisini basıyordu (2 demo kayıt). Yani siteye
   kayıt olan gerçek öğretmenlerin hiçbiri burada görünmüyordu; tablonun
   Firestore ile bağlantısı yoktu.

   ŞİMDİ: kullanicilar koleksiyonundan role == 'teacher' olanlar okunur.
   Onay durumu, öğretmen kodu ve kayıt tarihi de gösterilir; buradan
   onaylanabilir ya da onayı kaldırılabilir (KidefErisim.onayla/reddet —
   onaylama aynı zamanda hoş geldin mesajını da gönderir).

   NOT: role alanı hiç yazılmamış eski öğretmen hesapları bu sorguya
   düşmez; o hesaplar bir kez giriş yapınca sistem/rol.js kendiliğinden
   role:'teacher' yazar ve listede belirirler.
   =================================================================== */
var _adminOgretmenler = {};      /* uid -> {ad, email, ogrenci, kullanim, anket} */
/* Firestore hatası → Türkçe (hesap/kayitalani.js). 26.10.2026: günlük okuma kotası dolunca
   listeler "resource-exhausted" diyordu; şimdi ne olduğu ve ne zaman düzeleceği yazıyor. */
function _abHataMetni(e) {
    if (window.KidefKayit && KidefKayit.hataMetni) return KidefKayit.hataMetni(e, 'okuma');
    return 'Liste alınamadı: ' + ((e && (e.code || e.message)) || e);
}

/* Öğretmenin KENDİ sınıf listesinden sınıf/öğrenci sayısı.
   userData, listelerim.js'in buluta yazdığı JSON metindir. "bagli":
   gerçekten hesabı olan ve bu öğretmene bağlanmış öğrenci sayısı. */
function _ogrSayisi(userData) {
    var s = { sinif: 0, ogrenci: 0, bagli: 0, seviye: 0 };
    if (!userData) return s;
    var d = null;
    try { d = (typeof userData === 'string') ? JSON.parse(userData) : userData; } catch (e) { return s; }
    var L = (d && d.levels) || {};
    Object.keys(L).forEach(function (lid) {
        s.seviye++;
        var C = (L[lid] && L[lid].classes) || {};
        Object.keys(C).forEach(function (cid) {
            s.sinif++;
            var o = (C[cid] && C[cid].students) || [];
            s.ogrenci += o.length;
            for (var i = 0; i < o.length; i++) if (o[i] && o[i].hesapUid) s.bagli++;
        });
    });
    return s;
}
function _sureBicim(sn) {
    if (window.KidefKullanim && KidefKullanim.bicim) return KidefKullanim.bicim(sn);
    sn = Math.max(0, Math.round(sn || 0));
    if (sn < 60) return sn + ' sn';
    var d = Math.floor(sn / 60), s2 = Math.floor(d / 60);
    return s2 < 1 ? d + ' dk' : s2 + ' sa ' + (d % 60) + ' dk';
}

function _ogrDurumRozet(onay) {
    var r = { renk: '#7f8c8d', zemin: '#EDF1F7', ad: 'Eski kayıt' };
    if (onay === 'onayli')     r = { renk: '#1E8449', zemin: '#E8F6EF', ad: 'Onaylı' };
    else if (onay === 'bekliyor')   r = { renk: '#B5670A', zemin: '#FEF3E2', ad: 'Bekliyor' };
    else if (onay === 'reddedildi') r = { renk: '#B03A2E', zemin: '#FDEDEC', ad: 'Reddedildi' };
    return '<span style="display:inline-block; padding:3px 10px; border-radius:999px; ' +
           'font-size:.78rem; font-weight:700; color:' + r.renk + '; background:' + r.zemin + ';">' +
           r.ad + '</span>';
}

function _ogrTarih(ts) {
    try {
        var d = (ts && ts.toDate) ? ts.toDate() : null;
        if (!d) return '—';
        return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) { return '—'; }
}

/* ===================================================================
   ÖĞRETMENLER LİSTESİ — KART + PENCERE              (19.10.2026)
   Öğretmen: "her öğretmenle ilgili bilgileri bi satırda göstermek
   yerine her şeyi bi popup içine ekleyelim". Eskiden geniş bir tablo
   satırıydı (ad, e-posta, telefon, durum, kod, kayıt, öğrenci, süre,
   tuşlar). Artık her öğretmen küçük bir kart: ad, durum, e-posta, tek
   satır özet ve destek rozeti. Karta basınca hesap/ogretmen-detay.js
   penceresi açılır: Genel · Ücret durumu · Takvim · Kayıt anketi ve
   Onayla / Onayı kaldır / Sil tuşları.
   Liste gelince Beklenen Destek özeti de hesaplanır (hesap/destek.js →
   KidefDestek.listeGeldi): son 30 günde giren onaylı öğretmen sayısı
   ve kişi başı tutar mufredat/_destek'e yazılır.
   =================================================================== */
var _aogSuzgec = 'hepsi';
/* OTURUM SÜZGECİ (08.11.2026) — yönetici: "yönetici panelindeki öğretmenler kısmında, filtrelere oturum
   sayısına göre de filtre ekleyelim". Oturum = siteye giriş sayısı (sistem/kullanimsure.js → kullanim.oturum;
   30 dakikadan uzun aradan sonraki her giriş yeni oturum). Durum süzgeci ve aramayla birlikte uygulanır
   (hepsi uymalı); çipte o aralıktaki öğretmen sayısı. Sıralamada «En çok oturum», kartta «N oturum». */
var _aogOturum = 'hepsi';
var _AOG_OTURUM = [['o0', 'Hiç', 0, 0], ['o1', '1', 1, 1], ['o2', '2–5', 2, 5], ['o6', '6–20', 6, 20], ['o21', '21+', 21, Infinity]];
function _aogOturumSayi(n) { return Math.max(0, parseInt(n, 10) || 0); }
function _aogOturumDilim(n) {
    n = _aogOturumSayi(n);
    for (var i = 0; i < _AOG_OTURUM.length; i++) if (n >= _AOG_OTURUM[i][2] && n <= _AOG_OTURUM[i][3]) return _AOG_OTURUM[i][0];
    return 'o0';
}
/* SIRALAMA (21.10.2026) — öğretmen: "öğretmenleri isimlerinin baş harfine, en
   çok siteyi kullanandan en az kullanana, en son kullanandan en eski kullanana
   göre sıralayabilelim". ad | sure | son; seçim hatırlanır. */
/* + ogrenci (21.10.2026): "en çok öğrencisi bulunanlardan da" — kendi sınıf listesindeki öğrenci sayısı */
var _aogSira = (function () { try { var v = localStorage.getItem('kidef_aog_sira'); return /^(ad|sure|son|ogrenci|kayit|oturum)$/.test(v || '') ? v : 'ad'; } catch (e) { return 'ad'; } })();
/* ÖĞRETMENLER BİR ARADA (02.11.2026) — birleşik bölüm, iç liste, büyük sayılar, kayıt tarihi,
   en alttaki Beklenen Destek için biçim (yalnız yönetici panelinde). */
function _ogtStil() {
    if (document.getElementById('ogt-birlesik-stil')) return;
    var st = document.createElement('style');
    st.id = 'ogt-birlesik-stil';
    st.textContent = [
        '#admin-onay-details .aon-alt-baslik{font-weight:800; color:#B5670A; font-size:1.02rem; margin:2px 0 6px;}',
        /* iç bölümler: öğretmen listesi + öğrenci listesi (ÖĞRENCİ LİSTESİ AYRINTILI, 05.11.2026) */
        '#admin-onay-details .aog-bolum{margin-top:14px; padding-top:12px; border-top:1px dashed #D5DEE8;}',
        '#admin-onay-details .aog-bolum > summary{cursor:pointer; list-style:none; display:flex; align-items:center; gap:8px;',
        '  font-weight:800; font-size:1.08rem; color:#1f5f99; outline:none;}',
        '#admin-onay-details .aog-bolum > summary::-webkit-details-marker{display:none;}',
        '#admin-onay-details .aog-bolum > summary::before{content:"\\25B6"; font-size:.8rem; color:#F39C12; transition:transform .3s;}',
        '#admin-onay-details .aog-bolum[open] > summary::before{transform:rotate(90deg);}',
        '#admin-onay-details .aog-bolum > summary small{font-weight:600; font-size:.78rem; color:#8A94A3;}',
        '#admin-ogrenci-liste > summary{color:#0E7C66;}',
        /* büyük sayılar (iki listede) */
        '#admin-onay-details .aog-sayilar{display:flex; align-items:stretch; gap:8px; flex-wrap:wrap; margin:0 0 12px;}',
        '#admin-onay-details .aog-sayi{display:flex; flex-direction:column; justify-content:center; min-width:86px;',
        '  padding:8px 14px; border-radius:12px; background:#F4F7FB; border:1px solid #E3E9F1;}',
        '#admin-onay-details .aog-sayi b{font-size:1.9rem; line-height:1.05; font-weight:900; color:#2c3e50; font-variant-numeric:tabular-nums;}',
        '#admin-onay-details .aog-sayi small{font-size:.78rem; font-weight:700; color:#7f8c8d; margin-top:3px;}',
        '#admin-onay-details .aog-sayi.ana{background:#EEF4FF; border-color:#D3E2FB;}',
        '#admin-onay-details .aog-sayi.ana b{font-size:2.3rem; color:#1B4F9C;}',
        '#admin-student-list .aog-sayi.ana{background:#EAF7F3; border-color:#CDEBE2;}',
        '#admin-student-list .aog-sayi.ana b{color:#0E7C66;}',
        '#admin-onay-details .aog-sayi.ok{background:#EAF7F3; border-color:#CDEBE2;}',
        '#admin-onay-details .aog-sayi.ok b{color:#16A085;}',
        '#admin-onay-details .aog-sayi.bek{background:#FFF4E6; border-color:#F8DDB8;}',
        '#admin-onay-details .aog-sayi.bek b{color:#E67E22;}',
        '#admin-onay-details .aog-sayi.red{background:#FDEDEC; border-color:#F5C6C1;}',
        '#admin-onay-details .aog-sayi.red b{color:#B03A2E;}',
        '#admin-onay-details .aog-sayi.gri b{color:#55606D;}',
        '#admin-onay-details .aog-sayi.sifir b{color:#B8C1CC;}',
        '#admin-onay-details .aog-sayi-ek{align-self:center; font-size:.9rem; color:#1B4F9C; font-weight:700;}',
        '#admin-student-list .aog-sayi-ek{color:#0E7C66;}',
        '@media (max-width:560px){',
        '  #admin-onay-details .aog-sayi{min-width:0; flex:1 1 40%; padding:6px 10px;}',
        '  #admin-onay-details .aog-sayi b{font-size:1.6rem;} #admin-onay-details .aog-sayi.ana b{font-size:1.9rem;}}',
        /* kayıt tarihi: yalnız «Kayıt tarihi» sıralamasında görünür */
        '#aogGrid .aog-kayit, #aosGrid .aog-kayit{display:none; font-size:.76rem; color:#8A94A3;}',
        '#aogGrid.aog-sira-kayit .aog-kayit, #aosGrid.aog-sira-kayit .aog-kayit{display:block;}',
        /* öğrenci listesi (05.11.2026): öğretmen seçimi, kart satırları, öğretmen başlıkları */
        '#admin-student-list .aos-ogt{border:1.5px solid #E1E7EF; border-radius:999px; padding:6px 10px; font-family:inherit; font-size:.82rem;',
        '  font-weight:800; color:#55606D; background:#fff; max-width:260px;}',
        '#aosGrid .aog-alt small{color:#8A94A3; font-weight:700;}',
        '#aosGrid .aog-alt i{color:#A9B2BD;}',
        '#aosGrid .aos-ogt-baslik{color:#0E7C66;}',
        /* OTURUM SÜZGECİ (08.11.2026): oturum çipleri ayrı satırda, sayı soluk, seçili çip mor */
        '#admin-teacher-list .aog-oturum-grup{flex:1 1 100%; margin-inline-start:0;}',
        '#admin-teacher-list .aog-suz.aog-otr small{font-size:.74rem; font-weight:700; opacity:.72; margin-inline-start:2px;}',
        '#admin-teacher-list .aog-suz.aog-otr.sec{background:#6C3FB5; border-color:#6C3FB5; color:#fff;}',
        /* ÖĞRETMENLER VE ÖĞRENCİLER YAN YANA (12.11.2026): geniş ekranda iki eşit sütun, solda öğretmenler sağda öğrenciler */
        '#admin-onay-details.aog-iki-acik .aog-iki{display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:16px;',
        '  align-items:stretch; margin-top:14px; padding-top:14px; border-top:1px dashed #D5DEE8;}',
        '#admin-onay-details.aog-iki-acik .aog-bolum{margin-top:0; padding:12px 14px 14px; border:1px solid #E3E9F1; border-top:4px solid #1f5f99;',
        '  border-radius:14px; background:#FBFCFE; min-width:0;}',
        '#admin-onay-details.aog-iki-acik #admin-ogrenci-liste{border-top-color:#0E7C66;}',
        '#admin-onay-details.aog-iki-acik .aog-bolum > summary{cursor:default; font-size:1.15rem;}',
        '#admin-onay-details.aog-iki-acik .aog-bolum > summary::before, #admin-onay-details.aog-iki-acik .aog-bolum > summary small{display:none;}',
        '#admin-onay-details.aog-iki-acik #admin-teacher-list, #admin-onay-details.aog-iki-acik #admin-student-list{',
        '  max-height:max(460px, calc(100vh - 230px)) !important; margin-top:12px !important; margin-bottom:0 !important;}',
        /* Beklenen Destek kendi akordiyonunda: içteki başlık tekrar etmesin */
        '#admin-destek-details #admin-destek-ayar .dst-a-ust > b:first-child{display:none;}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
}
/* KAYIT TARİHİ (02.11.2026) — yönetici: "sırala kısmında kayıt tarihine göre de öğretmenleri
   sıralayabilelim". createdAt; yoksa onay isteği tarihi; o da yoksa sitede görüldüğü ilk gün. */
function _aogTms(t) {
    try {
        if (!t) return 0;
        if (typeof t.toDate === 'function') return t.toDate().getTime() || 0;
        if (typeof t.seconds === 'number') return t.seconds * 1000;
        if (typeof t === 'number') return t;
        var d = new Date(t).getTime();
        return isNaN(d) ? 0 : d;
    } catch (e) { return 0; }
}
/* SINIF TAZELİĞİ (08.11.2026): «yönetici onayladı» işareti istek belgesinde kalıcı durur; öğrenci sonradan
   yeniden istek gönderince (istekTarih yenilenir) eski onay geçerli sayılmaz. hesap/ogrencihesap.js →
   OH.yoneticiOnayGecerli ile aynı kural; öğretmenin tarayıcısı da eski onayla öğrenci eklemez. */
function _aoyOnayGecerli(v) {
    if (!v || !v.yoneticiOnay) return false;
    var y = _aogTms(v.yoneticiOnayTarih), i = _aogTms(v.istekTarih);
    return !(y && i && y < i);
}
/* Önerilen sınıf eskimiş onayla birlikte yazıldıysa (öğrenci kendisi seçmediyse) o da eskidir: seçim kutusunda
   hazır seçili gelmez, «önerilen sınıf» yazmaz — yönetici öğrenciyi yanlışlıkla yine eski sınıfa onaylamasın. */
function _aoyOneri(v) {
    if (!v || !v.onerilenLId || !v.onerilenCId) return false;
    return !(v.yoneticiOnay && !_aoyOnayGecerli(v) && !v.onerenOgrenci);
}
function _aogKayitMs(o) {
    var ms = _aogTms(o && o.createdAt) || _aogTms(o && o.onayIstekTarihi);
    if (!ms) {
        var g = o && o.kullanim && o.kullanim.gun, ilk = g ? Object.keys(g).sort()[0] : '';
        if (ilk) { var p = ilk.split('-'); ms = new Date(+p[0], +p[1] - 1, +p[2]).getTime() || 0; }
    }
    return ms || 0;
}
function _aogGun(ms) {
    try { return new Date(ms).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    catch (e) { return '—'; }
}
var _AOG_AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
function _aogAy(ms) {
    if (!ms) return 'Kayıt tarihi bilinmeyen';
    var d = new Date(ms);
    return _AOG_AYLAR[d.getMonth()] + ' ' + d.getFullYear();
}

/* ==========================================================================
   SAYAÇ KUTUSU — ÖĞRETMEN VE ÖĞRENCİ SAYISI (02.11.2026 · 05.11.2026)
   02.11 — yönetici: "yönetici giriş yaptığında güncel öğretmen sayısı en üstte görünsün …" (o gün
   sayma animasyonu, yaylanma ve esneme ile).
   05.11 — yönetici: "öğretmen kısmını açıncaki rakam animasyonunu kaldıralım, en son rakam neyse o
   görünsün, öğrencilerde de rakam görünsün": animasyon kalktı; bilinen son sayı anında yazılır,
   taze sayı gelince sessizce değişir. Kutuda iki sayı: 👨‍🏫 öğretmen · 🎓 öğrenci.
   · Yalnız yönetici, panelin en üstünde. Öğretmenlere hiçbir yerde görünmez (sayı belli olmasın).
   · Öğretmen: kullanicilar'da role=='teacher' (öğretmen listesindeki kutuyla aynı). Öğrenci:
     role=='student' ya da rolü hiç yazılmamış eski hesaplar (öğrenci listesiyle aynı) = bütün
     belgeler − öğretmenler − yöneticiler. Firestore REST runAggregationQuery/count ile, üç sayım
     paralel (bütün listeyi okumadan; her sayım 1 okuma). REST kalıcı reddederse (kural, anahtar)
     kullanicilar okumasından sayılır (öğrenci listesiyle ortak 10 dk önbellek).
   · Ne zaman: yönetici girince (panel arkada çizilir); panel açılırken 60 sn'den eskiyse; öğretmen
     ya da öğrenci listesi okununca listeden; yeni öğretmen kaydı (canlı onay dinleyicisi) gelince.
     Son sayılar tarayıcıda (kidef_ogs_son): sayım gecikirse kutu onlarla açılır. Hiç sayı yoksa
     1,2 sn sonra «—».
   ========================================================================== */
var _ogs = { n: null, t: 0, taze: false, o: null, ot: 0, oTaze: false, gorunur: false, gozcu: null, hedef: null,
             istek: null, surer: false, restYok: false, tekrar: false, sonIstek: 0, zam: [], bosZam: null, bek: null };
var OGS_DEPO = 'kidef_ogs_son', OGS_TTL = 60e3;

function _ogsBicim(n) {
    if (n == null || !isFinite(n)) return '—';
    try { return Number(n).toLocaleString('tr-TR'); } catch (e) { return String(n); }
}
function _ogsSayiMi(x) { return typeof x === 'number' && isFinite(x) && x >= 0; }
function _ogsDepoOku() {
    try {
        var v = JSON.parse(localStorage.getItem(OGS_DEPO) || 'null');
        if (!v) return;
        if (_ogs.n == null && _ogsSayiMi(v.n)) { _ogs.n = v.n; _ogs.t = +v.t || 0; _ogs.taze = false; }
        if (_ogs.o == null && _ogsSayiMi(v.o)) { _ogs.o = v.o; _ogs.ot = +v.ot || 0; _ogs.oTaze = false; }
    } catch (e) { }
}
function _ogsDepoYaz() {
    try { localStorage.setItem(OGS_DEPO, JSON.stringify({ n: _ogs.n, t: _ogs.t, o: _ogs.o, ot: _ogs.ot })); } catch (e) { }
}
function _ogsStil() {
    if (document.getElementById('ogs-stil')) return;
    var st = document.createElement('style');
    st.id = 'ogs-stil';
    st.textContent = [
        '.ogs-kutu{display:flex; align-items:center; flex-wrap:wrap; gap:10px 0; margin:0 0 16px; padding:12px 24px 12px 14px;',
        '  border-radius:18px; border:1px solid #D3E2FB;',
        '  background:linear-gradient(120deg,#EEF4FF 0%,#F8FBFF 55%,#EAF7F3 100%); box-shadow:0 6px 18px rgba(27,79,156,.08);}',
        '.ogs-kutu.ogs-ilk{visibility:hidden;}',
        '.ogs-oge{display:flex; align-items:center; gap:14px; min-width:0; padding:2px 28px 2px 0;}',
        '.ogs-oge + .ogs-oge{border-inline-start:1px solid #D3E2FB; padding-inline-start:28px;}',
        '.ogs-simge{flex:0 0 auto; width:56px; height:56px; border-radius:16px; display:flex; align-items:center;',
        '  justify-content:center; font-size:1.9rem; background:#fff; box-shadow:0 2px 8px rgba(27,79,156,.12);}',
        '.ogs-sayi{display:inline-block; font-size:3.4rem; line-height:1; font-weight:900; color:#1B4F9C;',
        '  letter-spacing:-.02em; font-variant-numeric:tabular-nums; min-width:1ch;}',
        '.ogs-ogr .ogs-sayi{color:#0E7C66;}',
        '.ogs-sayi.ogs-bos{color:#B8C1CC;}',
        '.ogs-yazi{display:flex; flex-direction:column; font-size:1.15rem; font-weight:800; color:#2c3e50; line-height:1.15;}',
        '.ogs-yazi small{font-size:.8rem; font-weight:700; color:#8A94A3; margin-top:2px;}',
        '@media (max-width:560px){ .ogs-kutu{padding:10px 14px 10px 12px; gap:8px 0;}',
        '  .ogs-oge{gap:10px; padding:2px 14px 2px 0;} .ogs-oge + .ogs-oge{border:0; padding-inline-start:0;}',
        '  .ogs-simge{width:44px; height:44px; font-size:1.4rem;} .ogs-sayi{font-size:2.4rem;} .ogs-yazi{font-size:.95rem;} }'
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
}
function _ogsEtiket() {
    var p = [];
    if (_ogs.n != null) p.push(_ogsBicim(_ogs.n) + ' kayıtlı öğretmen');
    if (_ogs.o != null) p.push(_ogsBicim(_ogs.o) + ' kayıtlı öğrenci');
    return p.length ? p.join(', ') : 'Kayıtlı öğretmen ve öğrenci sayısı';
}
function _ogsOge(tur, simge, id, v, yazi) {
    return '<span class="ogs-oge ogs-' + tur + '" aria-hidden="true">' +
             '<span class="ogs-simge">' + simge + '</span>' +
             '<b class="ogs-sayi" id="' + id + '">' + (v == null ? '' : _ogsBicim(v)) + '</b>' +
             '<span class="ogs-yazi">' + yazi + '<small>kayıtlı</small></span>' +
           '</span>';
}
/* renderAdminPanel içinde, en üstte: bilinen son sayılar anında yazılır (animasyon yok) */
function _ogsHtml() {
    _ogsStil(); _ogsDepoOku();
    var bilinen = _ogs.n != null || _ogs.o != null;
    return '<div class="ogs-kutu' + (bilinen ? '' : ' ogs-ilk') + '" id="ogs-kutu" role="status" aria-label="' + _ogsEtiket() + '">' +
             _ogsOge('ogt', '👨‍🏫', 'ogs-sayi', _ogs.n, 'öğretmen') +
             _ogsOge('ogr', '🎓', 'ogs-sayi-ogr', _ogs.o, 'öğrenci') +
           '</div>';
}
function _ogsZaman(f, ms) { var id = setTimeout(f, ms); _ogs.zam.push(id); return id; }
function _ogsDur() {
    _ogs.zam.forEach(function (id) { clearTimeout(id); });
    _ogs.zam = []; _ogs.bosZam = null;
}
function _ogsYaz(id, v) {
    var s = document.getElementById(id);
    if (s && v != null) { s.textContent = _ogsBicim(v); s.classList.remove('ogs-bos'); }
}
/* bir süre sayı gelmezse (çevrimdışı, ilk giriş) o sayı «—» */
function _ogsBosBekle() {
    if (_ogs.bosZam) return;
    _ogs.bosZam = _ogsZaman(function () {
        _ogs.bosZam = null;
        var k = document.getElementById('ogs-kutu');
        if (!k) return;
        k.classList.remove('ogs-ilk');
        [['ogs-sayi', _ogs.n], ['ogs-sayi-ogr', _ogs.o]].forEach(function (p) {
            var s = document.getElementById(p[0]);
            if (s && p[1] == null) { s.textContent = '—'; s.classList.add('ogs-bos'); }
        });
        k.setAttribute('aria-label', _ogsEtiket());
    }, 1200);
}
/* bilinen sayıları yazar — animasyon yok (05.11.2026) */
function _ogsGoster() {
    var kutu = document.getElementById('ogs-kutu');
    if (!kutu) return;
    if (_ogs.n == null && _ogs.o == null) { _ogsBosBekle(); return; }
    kutu.classList.remove('ogs-ilk');
    _ogsYaz('ogs-sayi', _ogs.n); _ogsYaz('ogs-sayi-ogr', _ogs.o);
    kutu.setAttribute('aria-label', _ogsEtiket());
    if (_ogs.n == null || _ogs.o == null) _ogsBosBekle();
}
/* yeni öğretmen sayısı: sayımdan ya da öğretmen listesinden (t: alındığı an; eskisi yenisini ezmez) */
function _ogsBildir(n, t) {
    n = +n; t = +t || Date.now();
    if (!isFinite(n) || n < 0) return;
    if (_ogs.taze && t < _ogs.t) return;
    _ogs.n = n; _ogs.t = t; _ogs.taze = true;
    _ogsDepoYaz(); _ogsGoster();
}
/* yeni öğrenci sayısı: sayımdan ya da öğrenci listesinden (05.11.2026) */
function _ogsBildirOgr(n, t) {
    n = +n; t = +t || Date.now();
    if (!isFinite(n) || n < 0) return;
    if (_ogs.oTaze && t < _ogs.ot) return;
    _ogs.o = n; _ogs.ot = t; _ogs.oTaze = true;
    _ogsDepoYaz(); _ogsGoster();
}
/* Firestore REST count — rol: 'teacher' | 'admin' | null (bütün belgeler). Kurallar yöneticinin
   kimliğiyle denetlenir; her sayım 1 okuma faturalanır. null döner: alınamadı (4xx → restYok). */
function _ogsRestSay(op, jeton, rol) {
    var iptal = (typeof AbortController === 'function') ? new AbortController() : null;
    var sure = setTimeout(function () { try { if (iptal) iptal.abort(); } catch (e) { } }, 8000);
    var sorgu = { from: [{ collectionId: 'kullanicilar' }] };
    if (rol) sorgu.where = { fieldFilter: { field: { fieldPath: 'role' }, op: 'EQUAL', value: { stringValue: rol } } };
    return fetch('https://firestore.googleapis.com/v1/projects/' + encodeURIComponent(op.projectId) +
                 '/databases/(default)/documents:runAggregationQuery' + (op.apiKey ? '?key=' + encodeURIComponent(op.apiKey) : ''), {
        method: 'POST', cache: 'no-store', credentials: 'omit', signal: iptal ? iptal.signal : undefined,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jeton },
        body: JSON.stringify({ structuredAggregationQuery: { structuredQuery: sorgu, aggregations: [{ alias: 'n', count: {} }] } })
    }).then(function (r) {
        if (!r || !r.ok) {
            /* kalıcı ret (kural, adres, anahtar): bu oturumda listeden sayılır */
            if (r && /^(400|401|403|404)$/.test(String(r.status))) _ogs.restYok = true;
            throw new Error('http ' + (r && r.status));
        }
        return r.json();
    }).then(function (j) {
        var L = Array.isArray(j) ? j : [j];
        for (var i = 0; i < L.length; i++) {
            var f = L[i] && L[i].result && L[i].result.aggregateFields && L[i].result.aggregateFields.n;
            if (f) { var v = +(f.integerValue != null ? f.integerValue : f.doubleValue); if (isFinite(v)) return v; }
        }
        throw new Error('sayı yok');
    }).then(function (v) { clearTimeout(sure); return v; },
            function (e) {
                clearTimeout(sure);
                try { console.warn((rol || 'kullanıcı') + ' sayısı alınamadı:', (e && (e.message || e.name)) || e); } catch (x) { }
                return null;
            });
}
/* üç sayım paralel: öğretmen · bütün belgeler · yönetici → {n: öğretmen, o: öğrenci} (o hesaplanamadıysa null) */
function _ogsSay() {
    if (_ogs.istek) return _ogs.istek;
    var u = null, op = null;
    try { u = firebase.auth().currentUser; op = (firebase.app && firebase.app().options) || null; } catch (e) { }
    if (!u || typeof u.getIdToken !== 'function' || !op || !op.projectId || typeof fetch !== 'function')
        return Promise.resolve(null);
    _ogs.istek = u.getIdToken().then(function (jeton) {
        return Promise.all([_ogsRestSay(op, jeton, 'teacher'), _ogsRestSay(op, jeton, null), _ogsRestSay(op, jeton, 'admin')]);
    }).then(function (r) {
        _ogs.istek = null;
        if (r[0] == null) return null;
        return { n: r[0], o: (r[1] != null && r[2] != null) ? Math.max(0, r[1] - r[0] - r[2]) : null };
    }, function (e) {
        _ogs.istek = null;
        try { console.warn('sayım yapılamadı:', (e && (e.message || e.name)) || e); } catch (x) { }
        return null;
    });
    return _ogs.istek;
}
/* yedek yol (REST kalıcı reddederse): kullanicilar okunur, iki sayı da oradan — öğrenci listesiyle
   ortak 10 dk önbellek ('ogrenci' = bütün kullanıcılar) */
function _ogsListedenSay(zorla) {
    if (typeof firebase === 'undefined' || typeof isFirebaseReady === 'undefined' || !isFirebaseReady) return Promise.resolve(null);
    return _abSnap('ogrenci', function () {
        return firebase.firestore().collection('kullanicilar').get();
    }, !zorla).then(function (snap) {
        var n = 0, o = 0;
        snap.forEach(function (d) { var v = d.data() || {}; if (v.role === 'teacher') n++; else if (v.role === 'student' || !v.role) o++; });
        return { n: n, o: o, t: (_abOnbellek.ogrenci && _abOnbellek.ogrenci.t) || Date.now() };
    }, function () { return null; });
}
function _ogsTazele(zorla) {
    if (_ogs.surer) { if (zorla) _ogs.tekrar = true; return; }
    var ttl = _ogs.restYok ? AB_TTL : OGS_TTL, simdi = Date.now();
    var tazeN = _ogs.taze && simdi - _ogs.t < ttl, tazeO = _ogs.oTaze && simdi - _ogs.ot < ttl;
    if (!zorla && tazeN && tazeO) return;
    if (!zorla && simdi - _ogs.sonIstek < 15e3) return;      /* üst üste çizimlerde tek istek */
    _ogs.sonIstek = simdi; _ogs.surer = true;
    var is = _ogs.restYok ? _ogsListedenSay(zorla) : _ogsSay().then(function (r) {
        if (r) return { n: r.n, o: r.o, t: Date.now() };
        return _ogs.restYok ? _ogsListedenSay(zorla) : null;
    });
    is.then(null, function () { return null; }).then(function (r) {
        _ogs.surer = false;
        if (r) { _ogsBildir(r.n, r.t); if (r.o != null) _ogsBildirOgr(r.o, r.t); else _ogsGoster(); }
        else _ogsGoster();                                         /* saklı sayılarla */
        if (_ogs.tekrar) { _ogs.tekrar = false; _ogsTazele(true); }
    });
}
/* canlı onay dinleyicisi: bekleyenlere YENİ kimlik düştüyse (yeni kayıt) yeniden say */
function _ogsBekleyen(l) {
    var yeni = {}, eklendi = false;
    (l || []).forEach(function (o) { if (o && o._id) { yeni[o._id] = 1; if (_ogs.bek && !_ogs.bek[o._id]) eklendi = true; } });
    _ogs.bek = yeni;
    if (eklendi) _ogsTazele(true);
}
/* panel bölümü görünür mü: dev kök payıyla gözcü yalnız «gösteriliyor / gizli» farkını yakalar */
function _ogsGozcuHaber(es) {
    var e = es[es.length - 1], g = !!(e && e.isIntersecting);
    if (g === _ogs.gorunur) return;
    _ogs.gorunur = g;
    if (!g) { _ogsDur(); return; }
    _ogsTazele(false);                                 /* 60 sn'den eskiyse */
    _ogsGoster();
}
function _ogsKur() {
    if (!_aonYoneticiMi()) {
        _ogsDur();
        var o = document.getElementById('ogs-kutu');
        if (o && o.parentNode) o.parentNode.removeChild(o);
        return;
    }
    _ogsStil(); _ogsDepoOku();
    var sec = document.getElementById('admin-section');
    if (sec && typeof IntersectionObserver === 'function') {
        if (_ogs.hedef !== sec) {
            if (_ogs.gozcu) { try { _ogs.gozcu.disconnect(); } catch (e) { } }
            _ogs.hedef = sec; _ogs.gorunur = false;
            _ogs.gozcu = new IntersectionObserver(_ogsGozcuHaber, { rootMargin: '99999px 0px 99999px 0px' });
            _ogs.gozcu.observe(sec);
        }
    } else _ogs.gorunur = !!(sec && sec.offsetParent !== null);
    _ogsTazele(false);
    _ogsGoster();
}
window._ogsKur = _ogsKur;

function renderAdminTeacherList(kaynak) {
    var container = document.getElementById('admin-teacher-list');
    if (!container) return;
    if (window.KidefOgretmenDetay && KidefOgretmenDetay.stil) KidefOgretmenDetay.stil();
    _ogtStil();

    if (typeof firebase === 'undefined' || typeof isFirebaseReady === 'undefined' || !isFirebaseReady) {
        container.innerHTML = '<p style="color:#7f8c8d;">Bu liste çevrimdışıyken yüklenemiyor.</p>';
        return;
    }
    container.innerHTML = '<p style="color:#7f8c8d;">Yükleniyor…</p>';

    _abSnap('ogretmen', function () {
        return firebase.firestore().collection('kullanicilar').where('role', '==', 'teacher').get();
    }, kaynak === 'onbellek')
        .then(function (snap) {
            var liste = [];
            snap.forEach(function (d) { var v = d.data() || {}; v._id = d.id; liste.push(v); });
            liste.sort(function (a, b) {
                return String(a.name || a.email || '').localeCompare(String(b.name || b.email || ''), 'tr');
            });
            /* canlı öğretmen sayacı (02.11.2026): liste okunduğu anın sayısı */
            _ogsBildir(liste.length, (_abOnbellek.ogretmen && _abOnbellek.ogretmen.t) || Date.now());

            _adminOgretmenler = {};
            if (!liste.length) {
                container.innerHTML = '<p style="color:#7f8c8d;">Kayıtlı öğretmen yok.</p>' +
                    '<button class="btn" onclick="renderAdminTeacherList()" ' +
                    'style="margin-top:10px; font-size:.9rem;">🔄 Yenile</button>';
                if (window.KidefDestek) KidefDestek.listeGeldi(liste);
                return;
            }

            var sayac = { onayli: 0, bekliyor: 0, reddedildi: 0, eski: 0 };
            var toplam = { sure: 0, ogrenci: 0, sinif: 0, anketli: 0 };
            var kartlar = '';
            var demoTemizlenecek = [];              /* kalan demo şubeleri olan öğretmenler (21.10.2026) */
            liste.forEach(function (o) {
                var uid = o._id;
                /* KALAN DEMO ŞUBELER (21.10.2026) — öğretmen: "bazı öğretmenlerde bu demo
                   sınıflar kalmışsa onları sil otomatik olarak": liste demo düşülerek sayılır,
                   aşağıda buluta temizlenmiş yazılır (hesap/listelerim.js → llDemoTemizle) */
                try {
                    if (typeof llDemoTemizle === 'function' && o.userData) {
                        var _dd = (typeof o.userData === 'string') ? JSON.parse(o.userData) : o.userData;
                        var _dn = llDemoTemizle(_dd);
                        if (_dn) { o.userData = JSON.stringify(_dd); demoTemizlenecek.push({ uid: uid, userData: o.userData, n: _dn, o: o }); }
                    }
                } catch (e) { }
                var ad = o.name && o.name !== 'Belirtilmedi' ? o.name : '';
                var onay = o.ogretmenOnay;
                if (onay === 'onayli') sayac.onayli++;
                else if (onay === 'bekliyor') sayac.bekliyor++;
                else if (onay === 'reddedildi') sayac.reddedildi++;
                else sayac.eski++;

                var kod = '';
                try { if (window.OH && OH.koduTuret) kod = OH.koduTuret(uid); } catch (e) {}

                /* KULLANIM (08.10.2026): öğrenci sayısı öğretmenin KENDİ sınıf
                   listesinden (userData), süre kullanimsure.js'in yazdığı
                   kullanim alanından — ek sorgu yok. */
                var say = _ogrSayisi(o.userData);
                var kul = o.kullanim || {};
                _adminOgretmenler[uid] = {
                    ad: ad, email: o.email || '', tel: o.phone || '', kod: kod,
                    ogrenci: say, kullanim: kul, anket: o.anket || null,
                    userData: o.userData || '', doc: o
                };
                toplam.sure += (kul.toplamSn || 0);
                toplam.ogrenci += say.ogrenci; toplam.sinif += say.sinif;
                if (o.anket) toplam.anketli++;

                var ton = (window.KidefOgretmenDetay && KidefOgretmenDetay.renkTonu) ? KidefOgretmenDetay.renkTonu(uid) : 210;
                var harf = (window.KidefOgretmenDetay && KidefOgretmenDetay.basHarf) ? KidefOgretmenDetay.basHarf(ad, o.email) : '?';
                var ozet = [];
                ozet.push(say.ogrenci ? '<b>' + say.ogrenci + '</b> öğrenci' : 'öğrenci yok');
                if (say.sinif) ozet.push(say.sinif + ' sınıf');
                if (kul.toplamSn) ozet.push('<b>' + _sureBicim(kul.toplamSn) + '</b>');
                if (_aogOturumSayi(kul.oturum)) ozet.push(_aogOturumSayi(kul.oturum) + ' oturum');      /* OTURUM SÜZGECİ (08.11.2026) */
                if (kul.sonGoruldu) ozet.push('son ' + _ogrTarih(kul.sonGoruldu));
                /* CANLI DERS KULLANIMI (06.11.2026): bu ayki ders, süre, veri (hesap/canlikullanim.js) */
                try { var _ckl = (window.KidefCanliKullanim && KidefCanliKullanim.satir) ? KidefCanliKullanim.satir(o) : ''; if (_ckl) ozet.push(_ckl); } catch (e) { }
                var ara = (ad + ' ' + (o.email || '') + ' ' + kod + ' ' + (o.phone || '')).toLocaleLowerCase('tr-TR');
                var sonMs = 0;
                try { if (kul.sonGoruldu && kul.sonGoruldu.toDate) sonMs = kul.sonGoruldu.toDate().getTime() || 0; else if (typeof kul.sonGoruldu === 'number') sonMs = kul.sonGoruldu; } catch (e) { }
                /* isimsizler en sonda, «#» başlığı altında (U+FFFF her harften sonra dizilir) */
                var siraAd = ad ? ad.trim().toLocaleLowerCase('tr-TR') : ('￿' + (o.email || '').toLocaleLowerCase('tr-TR'));
                var durumAd = onay === 'bekliyor' ? 'bekliyor' : (onay === 'reddedildi' ? 'reddedildi' : 'onayli');
                var kayitMs = _aogKayitMs(o);                 /* KAYIT TARİHİ (02.11.2026) */

                kartlar +=
                    '<button type="button" class="aog-kart" data-aog-ara="' + _fbEsc(ara) + '" data-aog-durum="' + durumAd + '"' +
                    ' data-aog-ad="' + _fbEsc(siraAd) + '" data-aog-sure="' + (kul.toplamSn || 0) + '" data-aog-son="' + sonMs + '"' +
                    ' data-aog-ogrenci="' + (say.ogrenci || 0) + '" data-aog-sinif="' + (say.sinif || 0) + '"' +
                    ' data-aog-kayit="' + kayitMs + '" data-aog-oturum="' + _aogOturumSayi(kul.oturum) + '"' +
                    ' onclick="adminOgretmenDetay(\'' + uid + '\')" title="Ayrıntılar, ücret durumu, takvim ve anket">' +
                      '<span class="aog-avatar" style="background:hsl(' + ton + ',70%,93%); color:hsl(' + ton + ',45%,32%);">' + _fbEsc(harf) + '</span>' +
                      '<span class="aog-govde">' +
                        '<span class="aog-ust"><span class="aog-ad">' + _fbEsc(ad || '(isim yok)') + '</span>' + _ogrDurumRozet(onay) + '</span>' +
                        '<span class="aog-eposta">' + _fbEsc(o.email || '—') + '</span>' +
                        '<span class="aog-alt">' + ozet.join(' · ') + '</span>' +
                        '<span class="aog-kayit">' + (kayitMs ? 'kayıt ' + _aogGun(kayitMs) : 'kayıt tarihi yok') + '</span>' +
                        '<span data-dst-rozet="' + uid + '"></span>' +
                      '</span>' +
                      '<span class="aog-ok" aria-hidden="true">›</span>' +
                    '</button>';
            });

            var suz = function (id, yazi) {
                return '<button type="button" class="aog-suz' + (_aogSuzgec === id ? ' sec' : '') + '" data-aog-suz="' + id + '"' +
                    ' onclick="adminOgretmenSuz(\'' + id + '\')">' + yazi + '</button>';
            };
            var sira = function (id, yazi) {
                var ip = id === 'sure' ? 'Sitede geçirilen toplam süreye göre, çoktan aza' : (id === 'son' ? 'Son görülme tarihine göre, yeniden eskiye'
                       : (id === 'ogrenci' ? 'Sınıf listesindeki öğrenci sayısına göre, çoktan aza'
                       : (id === 'kayit' ? 'Kayıt tarihine göre, yeniden eskiye (ay başlıklarıyla)'
                       : (id === 'oturum' ? 'Oturum (siteye giriş) sayısına göre, çoktan aza' : 'Ada göre, baş harf başlıklarıyla'))));
                return '<button type="button" class="aog-suz aog-sir' + (_aogSira === id ? ' sec' : '') + '" data-aog-sira="' + id + '" title="' + ip + '"' +
                    ' onclick="adminOgretmenSirala(\'' + id + '\')">' + yazi + '</button>';
            };
            /* OTURUM SÜZGECİ (08.11.2026): aralık çipleri, yanında o aralıktaki öğretmen sayısı */
            var oturumSay = { hepsi: liste.length };
            liste.forEach(function (o) { var dl = _aogOturumDilim((o.kullanim || {}).oturum); oturumSay[dl] = (oturumSay[dl] || 0) + 1; });
            var oturumCip = function (id, yazi) {
                return '<button type="button" class="aog-suz aog-otr' + (_aogOturum === id ? ' sec' : '') + '" data-aog-otr="' + id + '"' +
                    ' onclick="adminOgretmenOturum(\'' + id + '\')">' + yazi + ' <small>(' + (oturumSay[id] || 0) + ')</small></button>';
            };
            container.innerHTML =
                /* Firebase Authentication'dan kullanıcı silmek bu listeyi
                   DEĞİŞTİRMEZ: liste kullanicilar koleksiyonundan okunuyor.
                   Kart, öğretmen penceresindeki "Onayı kaldır" → "Sil" ile gider. */
                /* BÜYÜK SAYILAR (02.11.2026) — yönetici: "bu kısımda öğretmen sayıları büyük görünsün" */
                '<div class="aog-sayilar">' +
                  '<span class="aog-sayi ana"><b>' + liste.length + '</b><small>öğretmen</small></span>' +
                  '<span class="aog-sayi ok' + (sayac.onayli ? '' : ' sifir') + '"><b>' + sayac.onayli + '</b><small>onaylı</small></span>' +
                  '<span class="aog-sayi bek' + (sayac.bekliyor ? '' : ' sifir') + '"><b>' + sayac.bekliyor + '</b><small>bekliyor</small></span>' +
                  '<span class="aog-sayi red' + (sayac.reddedildi ? '' : ' sifir') + '"><b>' + sayac.reddedildi + '</b><small>reddedildi</small></span>' +
                  (sayac.eski ? '<span class="aog-sayi"><b>' + sayac.eski + '</b><small>eski kayıt</small></span>' : '') +
                  '<span class="aog-sayi-ek">' +
                    'Σ ' + _sureBicim(toplam.sure) + ' · ' + toplam.ogrenci + ' öğrenci · ' +
                    toplam.sinif + ' sınıf · ' + toplam.anketli + ' anket' +
                  '</span>' +
                  /* CANLI DERS KULLANIMI (06.11.2026): bu ayın toplamı ve ücretsiz paya göre durum */
                  ((window.KidefCanliKullanim && KidefCanliKullanim.toplamSatir) ? KidefCanliKullanim.toplamSatir(liste) : '') +
                  '<button class="btn" onclick="renderAdminTeacherList()" ' +
                    'style="margin-inline-start:auto; align-self:center; font-size:.85rem;">🔄 Yenile</button>' +
                '</div>' +
                '<div class="aog-ara">' +
                  '<input type="search" id="aogAra" placeholder="Ad, e-posta, kod ya da telefon ara…" oninput="adminOgretmenSuz()">' +
                  suz('hepsi', 'Hepsi') + suz('onayli', 'Onaylı') + suz('bekliyor', 'Onay bekleyen') + suz('reddedildi', 'Reddedilen') +
                  suz('destek', '💛 Destek bildirimi') +
                  /* OTURUM SÜZGECİ (08.11.2026): ayrı satırda; durum süzgeciyle birlikte uygulanır */
                  '<span class="aog-sira-grup aog-oturum-grup"><span class="aog-sira" title="Oturum: siteye giriş sayısı — 30 dakikadan uzun aradan sonraki her giriş yeni oturum sayılır">Oturum:</span>' +
                  oturumCip('hepsi', 'Hepsi') + _AOG_OTURUM.map(function (d) { return oturumCip(d[0], d[1]); }).join('') + '</span>' +
                  '<span class="aog-sira-grup"><span class="aog-sira">Sırala:</span>' +
                  sira('ad', 'A → Z') + sira('sure', 'En çok kullanan') + sira('son', 'Son kullanan') + sira('ogrenci', 'En çok öğrencisi') +
                  sira('kayit', 'Kayıt tarihi') + sira('oturum', 'En çok oturum') + '</span>' +
                '</div>' +
                '<div class="aog-grid" id="aogGrid">' + kartlar +
                  '<p class="aog-bos" id="aogBos" style="display:none;">Bu süzgece uyan öğretmen yok.</p></div>';
            adminOgretmenSirala();
            adminOgretmenSuz();
            adminDemoTemizle(demoTemizlenecek);

            if (window.KidefDestek && KidefDestek.listeGeldi) KidefDestek.listeGeldi(liste);
            if (window.KidefOgretmenDetay && KidefOgretmenDetay.tazele) KidefOgretmenDetay.tazele();
        })
        .catch(function (e) {
            container.innerHTML = '<p style="color:#EF5350;">' + _fbEsc(_abHataMetni(e)) + '</p>' +
                '<button class="btn" onclick="renderAdminTeacherList()" ' +
                'style="margin-top:10px; font-size:.9rem;">🔄 Yenile</button>';
        });
}

/* KALAN DEMO ŞUBELER BULUTTAN SİLİNİR (21.10.2026): liste açılınca demo şubesi
   kalan öğretmenlerin temizlenmiş listesi buluta yazılır. Son 15 dakikada siteyi
   kullanan öğretmen atlanır: o sırada kendi listesini yazıyor olabilir, kendi
   tarayıcısı zaten açılışta temizler. Özet satırında rapor. */
function adminDemoTemizle(L) {
    if (!L || !L.length) return;
    var simdi = Date.now(), yaz = [], atla = 0;
    L.forEach(function (x) {
        var son = 0, kul = (x.o && x.o.kullanim) || {};
        try { if (kul.sonGoruldu && kul.sonGoruldu.toDate) son = kul.sonGoruldu.toDate().getTime() || 0; else if (typeof kul.sonGoruldu === 'number') son = kul.sonGoruldu; } catch (e) { }
        if (son && simdi - son < 15 * 60000) { atla++; return; }
        yaz.push(x);
    });
    var not = function (m) {
        var c = document.getElementById('admin-teacher-list');
        if (!c) return;
        var el = document.getElementById('aogDemoNot');
        if (!el) {
            el = document.createElement('p'); el.id = 'aogDemoNot';
            el.style.cssText = 'margin:0 0 10px; padding:8px 12px; border-radius:10px; background:#FFF7E0; color:#7A5A00; font-size:.85rem; line-height:1.5;';
            var grid = document.getElementById('aogGrid');
            if (grid) c.insertBefore(el, grid); else c.appendChild(el);
        }
        el.textContent = m;
    };
    if (!yaz.length) { not('🧹 ' + atla + ' öğretmende demo sınıf var; şu an sitede olduğu için dokunulmadı — kendi tarayıcısı açılışta siler.'); return; }
    var db = firebase.firestore(), tamam = 0, hata = 0, toplamSube = 0;
    var isler = yaz.map(function (x) {
        return db.collection('kullanicilar').doc(x.uid).set({
            userData: x.userData, lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).then(function () { tamam++; toplamSube += x.n; }, function () { hata++; });
    });
    Promise.all(isler).then(function () {
        var m = '🧹 ' + tamam + ' öğretmende kalan demo sınıflar silindi (' + toplamSube + ' şube).';
        if (hata) m += ' ' + hata + ' öğretmende yazılamadı.';
        if (atla) m += ' ' + atla + ' öğretmen şu an sitede, ona dokunulmadı (kendi tarayıcısı siler).';
        not(m);
        try { console.warn(m); } catch (e) { }
    });
}
window.adminDemoTemizle = adminDemoTemizle;

/* Arama kutusu ve süzgeç çipleri: kartları gizler/gösterir (yeniden
   sorgu yok). "Destek bildirimi" = onay bekleyen ödeme bildirimi olan. */
function adminOgretmenSuz(yeni) {
    if (yeni) _aogSuzgec = yeni;
    var ara = ((document.getElementById('aogAra') || {}).value || '').trim().toLocaleLowerCase('tr-TR');
    var gorunen = 0;
    [].forEach.call(document.querySelectorAll('#aogGrid .aog-kart'), function (k) {
        var uy = !ara || (k.getAttribute('data-aog-ara') || '').indexOf(ara) >= 0;
        if (uy && _aogSuzgec === 'onayli') uy = k.getAttribute('data-aog-durum') === 'onayli';
        else if (uy && _aogSuzgec === 'bekliyor') uy = k.getAttribute('data-aog-durum') === 'bekliyor';
        else if (uy && _aogSuzgec === 'reddedildi') uy = k.getAttribute('data-aog-durum') === 'reddedildi';
        else if (uy && _aogSuzgec === 'destek') uy = !!k.querySelector('[data-dst-rozet] .dst-cip.bekliyor');
        /* OTURUM SÜZGECİ (08.11.2026): oturum aralığı da uymalı */
        if (uy && _aogOturum !== 'hepsi') uy = _aogOturumDilim(k.getAttribute('data-aog-oturum')) === _aogOturum;
        k.style.display = uy ? '' : 'none';
        if (uy) gorunen++;
    });
    /* harf başlığı: altındaki kartların hepsi gizliyse o da gizli */
    [].forEach.call(document.querySelectorAll('#aogGrid .aog-harf'), function (h) {
        var e = h.nextElementSibling, var_ = false;
        while (e && !e.classList.contains('aog-harf')) { if (e.classList.contains('aog-kart') && e.style.display !== 'none') { var_ = true; break; } e = e.nextElementSibling; }
        h.style.display = var_ ? '' : 'none';
    });
    [].forEach.call(document.querySelectorAll('#admin-teacher-list .aog-suz:not(.aog-sir):not(.aog-otr)'), function (b) {
        b.classList.toggle('sec', b.getAttribute('data-aog-suz') === _aogSuzgec);
    });
    [].forEach.call(document.querySelectorAll('#admin-teacher-list .aog-otr'), function (b) {     /* OTURUM SÜZGECİ (08.11.2026) */
        b.classList.toggle('sec', b.getAttribute('data-aog-otr') === _aogOturum);
    });
    var bos = document.getElementById('aogBos');
    if (bos) bos.style.display = gorunen ? 'none' : '';
}
window.adminOgretmenSuz = adminOgretmenSuz;

/* OTURUM SÜZGECİ (08.11.2026): oturum çipi — durum süzgecinden ayrı seçilir, ikisi birlikte uygulanır */
function adminOgretmenOturum(yeni) {
    if (yeni) _aogOturum = yeni;
    adminOgretmenSuz();
}
window.adminOgretmenOturum = adminOgretmenOturum;

/* Kartları yerinde sıralar: ad (A→Z, harf başlıklarıyla) · sure (toplam
   süre, çoktan aza) · son (son görülme, yeniden eskiye) · ogrenci (öğrenci
   sayısı, çoktan aza; eşitlikte sınıf sayısı). Eşitlikte ada göre. */
function adminOgretmenSirala(yeni) {
    if (yeni) { _aogSira = yeni; try { localStorage.setItem('kidef_aog_sira', yeni); } catch (e) { } }
    var grid = document.getElementById('aogGrid');
    if (!grid) return;
    var kartlar = [].slice.call(grid.querySelectorAll('.aog-kart'));
    [].forEach.call(grid.querySelectorAll('.aog-harf'), function (h) { h.parentNode.removeChild(h); });
    var ad = function (k) { return k.getAttribute('data-aog-ad') || ''; };
    var say = function (k, n) { return parseFloat(k.getAttribute(n)) || 0; };
    kartlar.sort(function (a, b) {
        var f = 0;
        if (_aogSira === 'sure') f = say(b, 'data-aog-sure') - say(a, 'data-aog-sure');
        else if (_aogSira === 'son') f = say(b, 'data-aog-son') - say(a, 'data-aog-son');
        else if (_aogSira === 'ogrenci') f = (say(b, 'data-aog-ogrenci') - say(a, 'data-aog-ogrenci')) || (say(b, 'data-aog-sinif') - say(a, 'data-aog-sinif'));
        else if (_aogSira === 'kayit') f = (say(b, 'data-aog-kayit') || -1) - (say(a, 'data-aog-kayit') || -1);
        else if (_aogSira === 'oturum') f = say(b, 'data-aog-oturum') - say(a, 'data-aog-oturum');   /* OTURUM SÜZGECİ (08.11.2026) */
        return f || ad(a).localeCompare(ad(b), 'tr');
    });
    var bos = document.getElementById('aogBos'), sonHarf = null;
    kartlar.forEach(function (k) {
        if (_aogSira === 'ad') {
            var h = (ad(k).charAt(0) || '#').toLocaleUpperCase('tr-TR');
            if (!/[A-ZÇĞİÖŞÜ]/.test(h)) h = '#';
            if (h !== sonHarf) {
                sonHarf = h;
                var b = document.createElement('div');
                b.className = 'aog-harf'; b.textContent = h;
                grid.insertBefore(b, bos);
            }
        } else if (_aogSira === 'kayit') {                       /* ay başlıkları (02.11.2026) */
            var ay = _aogAy(say(k, 'data-aog-kayit'));
            if (ay !== sonHarf) {
                sonHarf = ay;
                var b2 = document.createElement('div');
                b2.className = 'aog-harf aog-ay'; b2.textContent = ay;
                grid.insertBefore(b2, bos);
            }
        }
        grid.insertBefore(k, bos);
    });
    grid.classList.toggle('aog-sira-kayit', _aogSira === 'kayit');
    [].forEach.call(document.querySelectorAll('#admin-teacher-list .aog-sir'), function (b) {
        b.classList.toggle('sec', b.getAttribute('data-aog-sira') === _aogSira);
    });
    adminOgretmenSuz();
}
window.adminOgretmenSirala = adminOgretmenSirala;

/* Tablodan onay verme / geri alma. Onaylama KidefErisim.onayla ile gider:
   rol + onay alanını yazar VE hoş geldin mesajını gönderir. */
function adminOgretmenDurum(uid, onay) {
    if (!window.KidefErisim) return;
    var islem = onay
        ? window.KidefErisim.onayla(uid, _adminOgretmenler[uid] || {})
        : window.KidefErisim.reddet(uid);
    var _bilgi = _adminOgretmenler[uid] || {};
    islem.then(function () {
        if (typeof showCustomAlert === 'function') {
            showCustomAlert(onay ? 'Öğretmen onaylandı, hoş geldin mesajı gönderildi.'
                                 : 'Öğretmenin erişimi kapatıldı. Öğretmen Onayları › Reddedilenler\'de duruyor; istersen sonradan onaylayabilirsin.');
        }
        if (onay) paylasilacakMesaj(uid, _bilgi);
        renderAdminTeacherList();
        if (typeof loadOgretmenOnaylari === 'function') loadOgretmenOnaylari();
    }).catch(function (e) {
        if (typeof showCustomAlert === 'function') {
            showCustomAlert('İşlem başarısız: ' + ((e && (e.code || e.message)) || e));
        }
    });
}
window.adminOgretmenDurum = adminOgretmenDurum;

/* ===================================================================
   ÖĞRETMEN KAYDINI SİLME  (yalnız yönetici, yalnız kapalı kayıt)

   NE SİLER: kullanicilar/{uid} belgesi. Tablo bu koleksiyondan
   okunduğu için satır listeden kalkar.

   NE SİLMEZ: Firebase Authentication hesabını. Tarayıcıdan başka bir
   kullanıcının kimlik hesabı silinemez — bunun için Admin SDK, yani
   konsol ya da Cloud Function gerekir. Bu yüzden onay kutusunda
   "hesabı konsoldan da sil" yazıyor: yoksa kişi tekrar giriş
   yapabilir. Girerse yeni belgesi kurallar gereği
   ogretmenOnay:'bekliyor' ile açılır (bkz. firestore.rules →
   kullanicilar/create), yani erişimi yine kapalı olur; onay
   bekleyenler listesinde yeniden belirir.

   Öğretmene ait diğer kayıtlar (mesajlar, sınıf listeleri, siparişler)
   bilerek ELLENMİYOR: tarayıcıdan toplu silme yarı yolda kalırsa
   veriyi tutarsız bırakır. Onlar gerekiyorsa konsoldan temizlenmeli.
   =================================================================== */
function adminOgretmenSil(uid) {
    var bilgi = _adminOgretmenler[uid] || {};
    var kim = bilgi.ad || bilgi.email || uid;

    /* Panel zaten yönetici sekmesinde ama silme geri alınamaz:
       rolü burada bir daha doğruluyoruz. */
    var rol = '';
    try { rol = (typeof appState !== 'undefined' && appState && appState.userRole) || ''; } catch (e) {}
    if (rol && rol !== 'admin') {
        _abUyar('Bu işlem yalnız yöneticiye açıktır.');
        return;
    }
    if (typeof firebase === 'undefined' || typeof isFirebaseReady === 'undefined' || !isFirebaseReady) {
        _abUyar('Silme çevrimdışıyken yapılamaz.');
        return;
    }

    var soru = kim + ' kaydı tamamen silinsin mi?\n\n' +
        'Bu işlem GERİ ALINAMAZ.\n\n' +
        '• Firestore\'daki öğretmen kaydı silinir, satır listeden kalkar.\n' +
        '• Firebase Authentication hesabı SİLİNMEZ — onu Firebase konsolundan\n' +
        '  ayrıca silmen gerekir, yoksa kişi tekrar giriş yapıp yeniden\n' +
        '  onay isteyebilir.\n' +
        '• Mesajları ve sınıf listeleri silinmez.';

    /* _abSor: varsa sitenin kendi onay kutusunu, yoksa confirm'i kullanır
       (bkz. dosya sonu). Onay verilmezse hiçbir şey yazılmaz. */
    _abSor(soru, function () {
        firebase.firestore().collection('kullanicilar').doc(uid).delete()
            .then(function () {
                delete _adminOgretmenler[uid];
                _abUyar(kim + ' kaydı silindi. Kimlik hesabını Firebase konsolundan da silmeyi unutma.');
                renderAdminTeacherList();
                if (typeof loadOgretmenOnaylari === 'function') loadOgretmenOnaylari();
            })
            .catch(function (e) {
                var kod = (e && (e.code || e.message)) || e;
                /* permission-denied neredeyse her zaman tek bir şeydir: canlı
                   kurallarda kullanicilar/{uid} için "allow delete: if isAdmin()"
                   yok. Yerel firestore.rules'ta var; yayınlanmamış olabilir. */
                var ek = (String(kod).indexOf('permission-denied') >= 0)
                    ? '\n\nFirestore kurallarında kullanicilar/{uid} için ' +
                      '"allow delete: if isAdmin();" satırı canlıda yayınlanmış olmalı.'
                    : '';
                _abUyar('Silinemedi: ' + kod + ek);
            });
    });
}
window.adminOgretmenSil = adminOgretmenSil;

// updateTeacherData, removeTeacher, addTeacher disabled as per new architecture
function updateTeacherData() {}
function removeTeacher() {}
function addTeacher() {}

// --- OFFLINE PACKAGES CRUD ---

function renderAdminOfflinePackages() {
    const container = document.getElementById('admin-offline-packages');
    if (!container) return;
    if (appState.packages.length === 0) {
        container.innerHTML = "<p>Çevrimdışı paket bulunmuyor.</p>"; return;
    }
    
    let html = `<div style="display:flex; flex-direction:column; gap:10px;">`;
    appState.packages.forEach((pkg, index) => {
        const reqs = pkg.requirements ? pkg.requirements.join(', ') : '';
        html += `
        <details name="admin-offline-packages" class="admin-details" style="background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <summary class="admin-summary" style="padding: 10px; display: flex; justify-content: space-between; align-items: center; border-radius:8px;">
                <strong style="color:#16A085; font-size: 0.9rem;">${pkg.title}</strong>
            </summary>
            
            <div style="padding: 10px; border-top: 1px solid #eee;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem; color: #555;">
                    <tr><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0; width: 100px;"><strong>Başlık:</strong></td><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;">${pkg.title}</td></tr>
                    <tr><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;"><strong>Açıklama:</strong></td><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;">${pkg.description}</td></tr>
                    <tr><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;"><strong>Süre:</strong></td><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;">${pkg.duration || ''} Saat</td></tr>
                    <tr><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;"><strong>Fiyat:</strong></td><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;">${pkg.price || ''} ₺</td></tr>
                    <tr><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;"><strong>Gereklilikler:</strong></td><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;">${reqs}</td></tr>
                    <tr><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;"><strong>Hedef:</strong></td><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;">${pkg.target || ''}</td></tr>
                </table>
                ${renderKazanimStepsHTML(pkg.id, pkg.title)}
            </div>
        </details>`;
    });
    html += `</div><p style="font-size: 0.75rem; color: #888; margin-top: 10px;">* Bu veriler <strong>js/data/paketler.js</strong> dosyasından yönetilmektedir.</p>`;
    container.innerHTML = html;
}

// updateOfflinePackageData, addOfflinePackage, removeOfflinePackage disabled as per new architecture
function updateOfflinePackageData() {}
function addOfflinePackage() {}
function removeOfflinePackage() {}

function renderAdminOnlinePackages() {
    const container = document.getElementById('admin-online-packages');
    if (!container) return;
    if (appState.onlinePackages.length === 0) {
        container.innerHTML = "<p>Canlı ders paketi bulunmuyor.</p>"; return;
    }
    
    let html = `<div style="display:flex; flex-direction:column; gap:10px;">`;
    appState.onlinePackages.forEach((pkg, index) => {
        html += `
        <details name="admin-online-packages" class="admin-details" style="background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <summary class="admin-summary" style="padding: 10px; display: flex; justify-content: space-between; align-items: center; border-radius:8px;">
                <strong style="color:#2980b9; font-size: 0.9rem;">${pkg.name}</strong>
            </summary>
            
            <div style="padding: 10px; border-top: 1px solid #eee;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem; color: #555;">
                    <tr><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0; width: 100px;"><strong>Paket Adı:</strong></td><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;">${pkg.name}</td></tr>
                    <tr><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;"><strong>Açıklama:</strong></td><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;">${pkg.desc}</td></tr>
                    <tr><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;"><strong>Saat:</strong></td><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;">${pkg.hours || ''} Saat / Ay</td></tr>
                    <tr><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;"><strong>Fiyat:</strong></td><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;">${pkg.price || ''} ₺</td></tr>
                    <tr><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;"><strong>Materyal:</strong></td><td style="padding: 6px 4px; border-bottom: 1px solid #f0f0f0;">${pkg.material || ''}</td></tr>
                </table>
                ${renderKazanimStepsHTML(pkg.id, pkg.name)}
            </div>
        </details>`;
    });
    html += `</div><p style="font-size: 0.75rem; color: #888; margin-top: 10px;">* Bu veriler <strong>js/data/paketler.js</strong> dosyasından yönetilmektedir.</p>`;
    container.innerHTML = html;
}

// updateOnlinePackageData, addOnlinePackage, removeOnlinePackage disabled as per new architecture
function updateOnlinePackageData() {}
function addOnlinePackage() {}
function removeOnlinePackage() {}

async function removeTeacher(id) {
    if (await showCustomConfirm("Bu öğretmeni silmek istediğinize emin misiniz?")) {
        appState.teachers = appState.teachers.filter(t => t.id !== id);
        delete teacherSchedules[id];
        saveTeachers();
        renderAdminTeacherList();
        refreshTeacherSelect();
    }
}

/* ------------------------------------------------------------------
   OGRETMEN KODU KARTI
   Ogretmenin sabit kodu (teacher_static_code) ogrenci davet kodlarinin
   onekidir: "${kod}-XXXX". Ogretmen bu kodu profilinde GORMELI, cunku
   ogrenciler sisteme baglanirken bu koda dayali kisisel kodu girer.
   Kod yoksa OH.ogretmenKoduSagla() buluttan getirir/uretir; karti da
   OH.koduYansit() sessizce tazeler.
   ------------------------------------------------------------------ */
function teacherKodKarti() {
    let kod = '';
    try { kod = localStorage.getItem('teacher_static_code') || ''; } catch (e) { }
    /* Kod henuz yoksa arka planda olustur; geldiginde karti tazeleyecek. */
    if (!kod) { try { if (window.OH && OH.ogretmenKoduSagla) OH.ogretmenKoduSagla(); } catch (e) { } }
    return `
        <div class="tch-kod-karti">
            <div class="tch-kod-sol">
                <div class="tch-kod-etiket">ÖĞRETMEN KODUM</div>
                <div class="tch-kod-deger" id="tchKodDeger">${kod || '…'}</div>
            </div>
            <div class="tch-kod-sag">
                <button type="button" class="tch-kod-kopyala" onclick="if(window.OH&&OH.koduKopyala)OH.koduKopyala(this)">Kopyala</button>
                <div class="tch-kod-not">Öğrencilerinin giriş kodları bu kod ile başlar.</div>
            </div>
        </div>`;
}

function renderTeacherPanel() {
    const teacherSection = document.getElementById('teacher-section');
    if (!teacherSection) return;

    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Get active teacher ID based on logged in email
    const activeTeacher = appState.teachers.find(t => t.email === appState.currentUser);
    if (!activeTeacher) {
        teacherSection.innerHTML = `
            <div class="glass-card">
                <h2 style="margin-bottom: 20px;">🎓 Öğretmen Kontrol Paneli</h2>
                ${teacherKodKarti()}
                <div style="background: #FFF3CD; color: #856404; padding: 15px; border-radius: 8px;">
                    Hesabınıza bağlı bir eğitmen profili bulunamadı. Lütfen yönetici ile iletişime geçin.
                </div>
            </div>
        `;
        return;
    }

    teacherSection.innerHTML = `
        <div class="glass-card">
            <h2 style="margin-bottom: 20px;">🎓 Öğretmen Kontrol Paneli - ${activeTeacher.name}</h2>

            ${teacherKodKarti()}

            <div style="margin-bottom: 20px;">
                <button class="btn btn-primary" style="background-color: #ff3b30; border-color: #ff3b30; font-size: 1.1rem; padding: 12px 24px; box-shadow: 0 4px 10px rgba(255, 59, 48, 0.4);" onclick="window.kidefCanliBaslat?kidefCanliBaslat():openLiveClassRoom()">
                    <span class="live-dot" style="background-color: white;"></span> Canlı Ders Başlat
                </button>
            </div>

            <details class="admin-details" name="teacher-accordion">
                <summary class="admin-summary">👤 Profilim</summary>
                <div style="margin-top: 15px; margin-bottom: 25px; padding-left: 15px; border-left: 3px solid #20C997;">
                    <p><strong>Ad Soyad:</strong> ${activeTeacher.name}</p>
                    <p><strong>E-posta:</strong> ${activeTeacher.email}</p>
                    <p><strong>Öğretmen Kodum:</strong> <span class="tch-kod-satir">${(function(){try{return localStorage.getItem('teacher_static_code')||'…';}catch(e){return '…';}})()}</span></p>
                    <!-- Kutu artık MEVCUT şifreyi GÖSTERMİYOR: eskiden değeri
                         hesap/ogretmen.js'teki açık metin "password" alanından
                         geliyordu, o dosya siteyle birlikte herkese açık
                         yayımlanıyordu. Alan boş açılır, yalnız YENİ şifreyi
                         yazmak içindir; kaydedince Firebase Auth güncellenir. -->
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                        <strong>Şifre:</strong>
                        <input type="password" id="teacher-profile-password" value="" placeholder="Yeni şifre" autocomplete="new-password" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc; width: 200px;" disabled>
                        <button class="btn btn-secondary" style="padding: 8px 15px; border-radius: 4px;" onclick="toggleTeacherPasswordVisibility()">👁️ Göster/Gizle</button>
                    </div>
                    <div style="margin-top: 15px; display: flex; gap: 10px;">
                        <button id="edit-teacher-password-btn" class="btn btn-primary" onclick="enableTeacherPasswordEdit()">Şifreyi Değiştir</button>
                        <button id="save-teacher-password-btn" class="btn btn-success" style="display: none;" onclick="saveTeacherPassword('${activeTeacher.id}')">Yeni Şifreyi Kaydet</button>
                    </div>
                </div>
            </details>

            <details class="admin-details" name="teacher-accordion">
                <summary class="admin-summary">Açık Randevu Talepleri (Bekleyenler)</summary>
                <div id="teacher-pending-lessons" style="margin-top: 15px; margin-bottom: 10px;"></div>
            </details>

            <details class="admin-details" name="teacher-accordion">
                <summary class="admin-summary">Onayladığım Dersler</summary>
                <div id="teacher-approved-lessons" style="margin-top: 15px; margin-bottom: 10px;"></div>
            </details>

            <details class="admin-details" name="teacher-accordion">
                <summary class="admin-summary">Öğrenci Gelişim Takibi</summary>
                <div id="teacher-student-progress" style="margin-top: 15px; margin-bottom: 10px;"></div>
            </details>

            <details class="admin-details" name="teacher-accordion">
                <summary class="admin-summary">Alarm ve Hatırlatıcılar</summary>
                <div style="margin-top: 15px;">
                    <div id="teacher-alarms-list" style="margin-bottom: 20px;"></div>
                    <div class="dark-box" style="background: linear-gradient(135deg, #2c3e50, #34495e); color: white; border: none; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                        <h4 style="margin-top:0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 1.5rem;">⏰</span> Yeni Hatırlatıcı Kur
                        </h4>
                        <div style="display:flex; gap:15px; flex-wrap:wrap; margin-top: 15px;">
                            <div class="form-group" style="flex:1; min-width: 120px;">
                                <label style="color: rgba(255,255,255,0.8);">Saat Seçin</label>
                                <input type="time" id="new-alarm-time" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 10px; font-size: 1.1rem; width: 100%; box-sizing: border-box;">
                            </div>
                            <div class="form-group" style="flex:3; min-width: 200px;">
                                <label style="color: rgba(255,255,255,0.8);">Not / Görev</label>
                                <input type="text" id="new-alarm-note" placeholder="Örn: Ayşe'nin okuma ödevini kontrol et" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 10px; font-size: 1.1rem; width: 100%; box-sizing: border-box;">
                                <div style="display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;">
                                    <span style="font-size: 0.8rem; color: #ccc;">Hızlı Seçim:</span>
                                    <button class="btn" style="background: rgba(32, 201, 151, 0.2); color: #20c997; border: 1px solid #20c997; padding: 3px 8px; font-size: 0.75rem; border-radius: 12px; cursor: pointer;" onclick="document.getElementById('new-alarm-note').value='Derse Hazırlık'">Derse Hazırlık</button>
                                    <button class="btn" style="background: rgba(253, 126, 20, 0.2); color: #fd7e14; border: 1px solid #fd7e14; padding: 3px 8px; font-size: 0.75rem; border-radius: 12px; cursor: pointer;" onclick="document.getElementById('new-alarm-note').value='Ödev Kontrolü'">Ödev Kontrolü</button>
                                    <button class="btn" style="background: rgba(13, 110, 253, 0.2); color: #0d6efd; border: 1px solid #0d6efd; padding: 3px 8px; font-size: 0.75rem; border-radius: 12px; cursor: pointer;" onclick="document.getElementById('new-alarm-note').value='Mola'">Mola</button>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; flex-wrap: wrap; gap: 10px;">
                            <div style="display: flex; gap: 10px;">
                                <button class="btn" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 5px 10px; font-size: 0.8rem;" onclick="setQuickTime(15)">+15 Dk</button>
                                <button class="btn" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 5px 10px; font-size: 0.8rem;" onclick="setQuickTime(30)">+30 Dk</button>
                                <button class="btn" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 5px 10px; font-size: 0.8rem;" onclick="setQuickTime(60)">+1 Saat</button>
                            </div>
                            <button class="btn btn-primary" style="background: #20C997; border: none; padding: 10px 20px; font-weight: bold;" onclick="addTeacherAlarm()">Alarmı Kur 🔔</button>
                        </div>
                    </div>
                </div>
            </details>

            <details class="admin-details" name="teacher-accordion">
                <summary class="admin-summary">📅 Ders Ver — Müsaitlik Takvimim</summary>
                <div id="teacher-schedule-editor" style="margin-top: 15px; margin-bottom: 10px;"></div>
            </details>
        </div>
    `;
    refreshTeacherDashboard();
}

function refreshTeacherDashboard() {
    renderPendingLessons();
    renderApprovedLessons();
    renderStudentProgress();
    renderTeacherAlarms();
    renderTeacherScheduleEditor();
}

function renderPendingLessons() {
    const container = document.getElementById('teacher-pending-lessons');
    if (!container) return;

    const activeTeacher = appState.teachers.find(t => t.email === appState.currentUser);
    if (!activeTeacher) return;
    const teacherId = activeTeacher.id;

    const relevantLessons = appState.pendingLessons.filter(l => l.status === "pending" && (l.requestedTeacherId === "any" || l.requestedTeacherId === teacherId));

    if (relevantLessons.length === 0) {
        container.innerHTML = "<p>Bekleyen randevu talebi bulunmuyor.</p>";
        return;
    }

    let html = '';
    relevantLessons.forEach(l => {
        let typeBadge = l.requestedTeacherId === "any" ? '<span style="background: #F39C12; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Havuz (Farketmez)</span>' : '<span style="background: #20C997; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Doğrudan Size Özel</span>';
        
        html += `
        <div style="background: #fff; border: 1px solid #E9EEF5; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div>
                <strong style="font-size: 1.1rem;">${l.studentEmail}</strong> <a href="tel:${l.studentPhone}" style="margin-left: 10px; font-size: 0.9rem;">${l.studentPhone}</a>
                <br>
                <span style="font-size: 0.9rem; color: #555;">Paket: ${l.package}</span><br>
                <span style="font-size: 0.9rem; color: #555;">Tarih/Saat: ${l.slots.join(', ')}</span><br>
                ${typeBadge}
            </div>
            <div>
                <button class="btn btn-success" onclick="approveLesson('${l.id}')">Dersi Kap (Onayla)</button>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

function subtractMinutes(timeStr, mins) {
    let [h, m] = timeStr.split(':').map(Number);
    let date = new Date();
    date.setHours(h, m, 0, 0);
    date.setMinutes(date.getMinutes() - mins);
    return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
}

function approveLesson(lessonId) {
    const lesson = appState.pendingLessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    const activeTeacher = appState.teachers.find(t => t.email === appState.currentUser);
    if (!activeTeacher) return;
    const teacherId = activeTeacher.id;

    // Check if slots are available
    if (teacherSchedules[teacherId]) {
        for (let slotStr of lesson.slots) {
            const timePart = slotStr.slice(-13); 
            const groupName = slotStr.slice(0, -14).trim();
            const group = teacherSchedules[teacherId].find(g => g.name === groupName);
            if (group) {
                const status = (group.data && group.data[timePart]) ? group.data[timePart] : "musait";
                if (status !== "musait") {
                    showCustomAlert(`Dikkat! Öğrencinin talep ettiği saatlerden biri (${groupName} ${timePart}) takviminizde "${status}" olarak işaretli. Çakışan saatler nedeniyle bu dersi onaylayamazsınız.`);
                    return; 
                }
            }
        }
    }

    lesson.status = "approved";
    lesson.teacherId = teacherId; // Teacher claimed it
    
    // Bekleyenlerden silip onaylananlara taşı
    appState.pendingLessons = appState.pendingLessons.filter(l => l.id !== lessonId);
    appState.approvedLessons.push(lesson);

    // Add alarms for the newly approved lesson
    let updatedCount = 0;
    lesson.slots.forEach(slotStr => {
        const timePart = slotStr.slice(-13); // "14:00 - 14:40"
        const startTimeStr = timePart.substring(0, 5); // "14:00"
        const alarmTime = subtractMinutes(startTimeStr, 5);
        
        if (!appState.teacherAlarms) appState.teacherAlarms = {};
        if (!appState.teacherAlarms[teacherId]) appState.teacherAlarms[teacherId] = [];
        
        appState.teacherAlarms[teacherId].push({
            id: Date.now() + Math.random(),
            time: alarmTime,
            note: `Ders Başlıyor (${slotStr}): ${lesson.studentName || 'Öğrenci'}`,
            isCompleted: false,
            isNotified: false
        });
        updatedCount++;
    });
    
    saveTeachers();
    
    if (updatedCount > 0) {
        showCustomAlert(`Ders başarıyla onaylandı!\nÖğrencinizin seçtiği ${updatedCount} saat dilimi sisteminize işlendi.`);
    } else {
        showCustomAlert("Ders başarıyla onaylandı!");
    }

    saveTeachers();
    refreshTeacherDashboard();
}

function renderApprovedLessons() {
    const container = document.getElementById('teacher-approved-lessons');
    if (!container) return;

    const activeTeacher = appState.teachers.find(t => t.email === appState.currentUser);
    if (!activeTeacher) return;
    const teacherId = activeTeacher.id;

    const myLessons = appState.approvedLessons.filter(l => l.teacherId === teacherId);

    if (myLessons.length === 0) {
        container.innerHTML = "<p>Henüz onayladığınız bir ders bulunmuyor.</p>";
        return;
    }

    let html = '';
    myLessons.forEach(l => {
        html += `
        <div style="background: #F8FAF9; border-left: 4px solid #20C997; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
            <strong style="font-size: 1.1rem;">${l.studentEmail}</strong> <a href="tel:${l.studentPhone}" style="margin-left: 10px; font-size: 0.9rem;">${l.studentPhone}</a>
            <br>
            <span style="font-size: 0.9rem; color: #555;">Paket: ${l.package}</span><br>
            <span style="font-size: 0.9rem; color: #555; font-weight: bold;">Tarih/Saat: ${l.slots.join(', ')}</span>
        </div>`;
    });
    container.innerHTML = html;
}

function renderStudentProgress() {
    const container = document.getElementById('teacher-student-progress');
    if (!container) return;

    const activeTeacher = appState.teachers.find(t => t.email === appState.currentUser);
    if (!activeTeacher) return;
    const teacherId = activeTeacher.id;

    const myLessons = appState.approvedLessons.filter(l => l.teacherId === teacherId);
    
    // Get unique students from approved lessons
    const studentsMap = {};
    myLessons.forEach(l => {
        if (!studentsMap[l.studentEmail]) {
            studentsMap[l.studentEmail] = { phone: l.studentPhone };
        }
    });

    const students = Object.keys(studentsMap);
    if (students.length === 0) {
        container.innerHTML = "<p>Kayıtlı öğrenciniz bulunmuyor.</p>";
        return;
    }

    if (!appState.studentProgress[teacherId]) {
        appState.studentProgress[teacherId] = {};
    }

    let html = '';
    students.forEach(email => {
        const progress = appState.studentProgress[teacherId][email] || { level: '', notes: '' };
        const idSafeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
        
        html += `
        <div style="background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <div style="margin-bottom: 10px;">
                <strong style="font-size: 1.1rem; color:#2C3E50;">${email}</strong>
                <a href="tel:${studentsMap[email].phone}" style="margin-left: 10px; font-size: 0.9rem;">${studentsMap[email].phone}</a>
            </div>
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                <div class="form-group" style="flex: 1; min-width: 150px;">
                    <label style="font-size: 0.85rem;">Seviye / Durum</label>
                    <input type="text" id="level_${idSafeEmail}" value="${progress.level}" placeholder="Örn: Başlangıç, A2, Harflere geçildi..." onblur="updateStudentProgress('${teacherId}', '${email}', '${idSafeEmail}')">
                </div>
                <div class="form-group" style="flex: 3; min-width: 250px;">
                    <label style="font-size: 0.85rem;">Öğretmen Notları</label>
                    <input type="text" id="notes_${idSafeEmail}" value="${progress.notes}" placeholder="Öğrenci hakkında özel notlarınız..." onblur="updateStudentProgress('${teacherId}', '${email}', '${idSafeEmail}')">
                </div>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

function updateStudentProgress(teacherId, email, idSafeEmail) {
    const level = document.getElementById(`level_${idSafeEmail}`).value.trim();
    const notes = document.getElementById(`notes_${idSafeEmail}`).value.trim();
    
    if (!appState.studentProgress[teacherId]) appState.studentProgress[teacherId] = {};
    appState.studentProgress[teacherId][email] = { level, notes };
    saveTeachers();
}

function renderTeacherAlarms() {
    const container = document.getElementById('teacher-alarms-list');
    if (!container) return;

    const activeTeacher = appState.teachers.find(t => t.email === appState.currentUser);
    if (!activeTeacher) return;
    const teacherId = activeTeacher.id;

    const alarms = appState.teacherAlarms[teacherId] || [];

    if (alarms.length === 0) {
        container.innerHTML = "<p style='color:#888;'>Kurulu bir alarm veya hatırlatıcı yok.</p>";
        return;
    }

    let html = '<div style="position: relative; padding-left: 20px; border-left: 2px solid #e3f2fd; margin-left: 10px;">';
    alarms.forEach(alarm => {
        const isPast = alarm.isCompleted;
        const iconColor = isPast ? "#ccc" : "#20C997";
        const cardBg = isPast ? "#f8f9fa" : "#ffffff";
        const textColor = isPast ? "#999" : "#333";
        const textDec = isPast ? "line-through" : "none";
        const shadow = isPast ? "none" : "0 4px 12px rgba(0,0,0,0.05)";
        const border = isPast ? "1px solid #eee" : "1px solid #e3f2fd";
        
        html += `
        <div style="position: relative; margin-bottom: 20px;">
            <div style="position: absolute; left: -29px; top: 15px; width: 16px; height: 16px; border-radius: 50%; background: ${iconColor}; border: 3px solid white; box-shadow: 0 0 0 2px ${iconColor}33;"></div>
            <div style="background: ${cardBg}; border: ${border}; box-shadow: ${shadow}; padding: 15px 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; transition: 0.3s ease;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: ${iconColor};">${alarm.time}</div>
                    <div style="text-decoration: ${textDec}; color: ${textColor}; font-size: 1.1rem;">
                        ${alarm.note}
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-sm" style="background: ${isPast ? '#e9ecef' : '#e8f9f4'}; color: ${isPast ? '#6c757d' : '#20c997'}; border: none; border-radius: 8px; font-weight: bold;" onclick="toggleAlarmStatus('${teacherId}', ${alarm.id})">
                        ${isPast ? 'Geri Al' : '✓ Tamamla'}
                    </button>
                    <button class="btn btn-sm" style="background: #ffebe9; color: #dc3545; border: none; border-radius: 8px; font-weight: bold;" onclick="removeTeacherAlarm('${teacherId}', ${alarm.id})">Sil</button>
                </div>
            </div>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
}

function addTeacherAlarm() {
    const activeTeacher = appState.teachers.find(t => t.email === appState.currentUser);
    if (!activeTeacher) return;
    const teacherId = activeTeacher.id;
    
    const time = document.getElementById('new-alarm-time').value;
    const note = document.getElementById('new-alarm-note').value.trim();

    if (!time || !note) return showCustomAlert("Lütfen saat ve not alanlarını doldurun.");

    if (!appState.teacherAlarms[teacherId]) appState.teacherAlarms[teacherId] = [];
    
    appState.teacherAlarms[teacherId].push({
        id: Date.now(),
        time: time,
        note: note,
        isCompleted: false
    });
    
    // Sort alarms by time
    appState.teacherAlarms[teacherId].sort((a, b) => a.time.localeCompare(b.time));
    
    saveTeachers();
    renderTeacherAlarms();
    
    document.getElementById('new-alarm-time').value = '';
    document.getElementById('new-alarm-note').value = '';
}

function setQuickTime(addMinutes) {
    const timeInput = document.getElementById('new-alarm-time');
    if (!timeInput) return;
    const now = new Date();
    now.setMinutes(now.getMinutes() + addMinutes);
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    timeInput.value = `${h}:${m}`;
}

function toggleAlarmStatus(teacherId, alarmId) {
    const alarm = appState.teacherAlarms[teacherId].find(a => a.id === alarmId);
    if (alarm) {
        alarm.isCompleted = !alarm.isCompleted;
        saveTeachers();
        renderTeacherAlarms();
    }
}

async function removeTeacherAlarm(teacherId, alarmId) {
    appState.teacherAlarms[teacherId] = appState.teacherAlarms[teacherId].filter(a => a.id !== alarmId);
    saveTeachers();
    renderTeacherAlarmsList();
}

function toggleTeacherPasswordVisibility() {
    const input = document.getElementById('teacher-profile-password');
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

function enableTeacherPasswordEdit() {
    const input = document.getElementById('teacher-profile-password');
    const editBtn = document.getElementById('edit-teacher-password-btn');
    const saveBtn = document.getElementById('save-teacher-password-btn');
    if (input && editBtn && saveBtn) {
        input.disabled = false;
        input.type = 'text'; // Değiştirirken görsün diye
        input.focus();
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
    }
}

function saveTeacherPassword(teacherId) {
    const input = document.getElementById('teacher-profile-password');
    if (!input || !input.value.trim()) {
        showCustomAlert("Şifre boş olamaz.");
        return;
    }
    /* Firebase Auth alt sınırı 6 karakter; daha kısası updatePassword'da
       hata verip kullanıcıyı "kaydettim" sanısında bırakıyordu. */
    if (input.value.trim().length < 6) {
        showCustomAlert("Şifre en az 6 karakter olmalı.");
        return;
    }
    
    const teacher = appState.teachers.find(t => t.id === teacherId);
    if (teacher) {
        teacher.password = input.value.trim();
        saveTeachers();
        
        // Update users mock as well so they can login with new password
        let users = JSON.parse(localStorage.getItem('mockUsers') || '{}');
        if (users[teacher.email]) {
            users[teacher.email].password = teacher.password;
            localStorage.setItem('mockUsers', JSON.stringify(users));
        }

        if (typeof firebase !== 'undefined' && isFirebaseReady) {
            const user = firebase.auth().currentUser;
            if (user) {
                user.updatePassword(teacher.password).then(() => {
                    showCustomAlert("Şifreniz başarıyla güncellendi.");
                }).catch(err => {
                    showCustomAlert("Firebase şifre güncelleme hatası: " + err.message + "\nLütfen çıkış yapıp tekrar giriş yaparak deneyin.");
                });
            } else {
                showCustomAlert("Şifreniz başarıyla güncellendi.");
            }
        } else {
            showCustomAlert("Şifreniz başarıyla güncellendi.");
        }
        
        // Reset UI
        input.disabled = true;
        input.type = 'password';
        document.getElementById('edit-teacher-password-btn').style.display = 'inline-block';
        document.getElementById('save-teacher-password-btn').style.display = 'none';
    }
}



function renderTeacherScheduleEditor() {
    const editor = document.getElementById('teacher-schedule-editor');
    if (!editor) return;

    const activeTeacher = appState.teachers.find(t => t.email === appState.currentUser);
    if (!activeTeacher) return;
    const teacherId = activeTeacher.id;

    editor.innerHTML = getTeacherCalendarEditorHtml(teacherId, false);
}

// ==========================================================================
// ÖĞRETMEN MÜSAİTLİK TAKVİMİ KALICILIĞI — Firestore: takvimler/{teacherId}
// ==========================================================================
function saveTeacherSchedule(teacherId){
    if (typeof firebase === 'undefined' || !firebase.firestore) return;
    var sched = teacherSchedules[teacherId];
    if (!sched) return;
    firebase.firestore().collection('takvimler').doc(String(teacherId)).set({
        schedule: sched
    }).catch(function(e){ console.warn('takvim kaydedilemedi:', e && e.code); });
}
function loadTeacherSchedules(){
    if (typeof firebase === 'undefined' || !firebase.firestore) return;
    firebase.firestore().collection('takvimler').get().then(function(snap){
        var changed=false;
        snap.forEach(function(d){
            var saved = d.data() || {};
            if (Array.isArray(saved.schedule)) { teacherSchedules[d.id] = saved.schedule; changed=true; }
        });
        if (changed) {
            if (typeof renderTeacherScheduleEditor === 'function' && document.getElementById('teacher-schedule-editor')) renderTeacherScheduleEditor();
            if (typeof renderAdminTeacherScheduleEditor === 'function' && document.getElementById('admin-teacher-schedule-editor') && document.getElementById('admin-teacher-schedule-editor').innerHTML.trim() !== '') renderAdminTeacherScheduleEditor();
            /* öğretmen penceresinin Takvim sekmesi açıksa onu da tazele */
            if (document.getElementById('ogd-takvim') && window.KidefOgretmenDetay && KidefOgretmenDetay.takvimCiz) KidefOgretmenDetay.takvimCiz();
        }
    }).catch(function(e){ console.warn('takvimler okunamadı:', e && e.code); });
}
window.saveTeacherSchedule = saveTeacherSchedule;
window.loadTeacherSchedules = loadTeacherSchedules;

async function toggleSlotStatus(teacherId, groupName, time, element, isStudentBooked = false) {
    if (isStudentBooked) {
        showCustomAlert("Bu saat spesifik olarak bir öğrenci randevusuna ayrılmıştır.\n\nEğer bu saati açmak istiyorsanız, öncelikle 'Tüm Randevu Talepleri' (veya Derslerim) bölümünden öğrencinin randevusunu iptal etmelisiniz.");
        return;
    }

    if (!teacherSchedules[teacherId]) teacherSchedules[teacherId] = (typeof createDefaultSchedule === 'function' ? createDefaultSchedule() : []);
    const group = teacherSchedules[teacherId].find(g => g.name === groupName);
    if (!group) return;
    const currentStatus = group.data[time] || "musait";
    
    if (currentStatus !== "musait") {
        const studentName = currentStatus === "dolu" ? "Bu" : `"${currentStatus}" isimli öğrencinin`;
        if (!await showCustomConfirm(`Emin misiniz? ${studentName} dersini iptal edip bu saati müsaite çevirmek üzeresiniz.`)) {
            return;
        }
    }

    const newStatus = currentStatus === "musait" ? "dolu" : "musait";
    group.data[time] = newStatus;
    
    element.classList.remove("musait", "dolu");
    element.classList.add(newStatus);
    
    const label = newStatus === "dolu" ? "Dolu" : "Müsait";
    const icon = newStatus === "dolu" ? "❌" : "✅";
    element.innerHTML = `${icon} ${time}<br><small style="font-size:0.7rem;">${label}</small>`;
    
    saveTeacherSchedule(teacherId);
}

// Sürüklenebilir Kamera Mantığı
window.addEventListener('DOMContentLoaded', () => {
    const dragItem = document.getElementById("draggable-camera");
    if (!dragItem) return;
    let active = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

    dragItem.addEventListener("mousedown", dragStart, false);
    document.addEventListener("mouseup", dragEnd, false);
    document.addEventListener("mousemove", drag, false);
    dragItem.addEventListener("touchstart", dragStart, {passive: false});
    document.addEventListener("touchend", dragEnd, false);
    document.addEventListener("touchmove", drag, {passive: false});

    function dragStart(e) {
        initialX = (e.type === "touchstart" ? e.touches[0].clientX : e.clientX) - xOffset;
        initialY = (e.type === "touchstart" ? e.touches[0].clientY : e.clientY) - yOffset;
        if (e.target === dragItem || dragItem.contains(e.target)) active = true;
    }
    function dragEnd(e) { initialX = currentX; initialY = currentY; active = false; }
    function drag(e) {
        if (active) {
            e.preventDefault();
            currentX = (e.type === "touchmove" ? e.touches[0].clientX : e.clientX) - initialX;
            currentY = (e.type === "touchmove" ? e.touches[0].clientY : e.clientY) - initialY;
            xOffset = currentX; yOffset = currentY;
            dragItem.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    }
});



/* ==========================================================================
   ÖĞRENCİYİ ÖĞRETMENE TANIMLA  (yalnız yönetici)

   NEDEN: Öğrencinin öğretmene bağlanmasının tek yolu, öğrencinin kodu
   kendi elleriyle girmesiydi. Kodu bilmeyen / girmeyen öğrenci sistemde
   duruyor ama hiçbir öğretmene bağlı olmuyordu. Artık yönetici bu işi
   öğrencinin yerine yapabiliyor.

   NASIL: Yönetici, öğrencinin ogrenciBaglari/{uid} belgesini "bekliyor"
   durumuyla açar (yoneticiTanimli:true). Bu belge öğretmenin canlı
   dinleyicisine (OH.istekleriDinle) anında düşer; öğretmen başlıktaki
   zilden görür, sınıfı seçer, onaylar.

   NİÇİN DOĞRUDAN "onayli" YAZMIYORUZ: Öğrenci satırı (adı, kodu, notları)
   öğretmenin KENDİ userData'sının içinde yaşar. Yönetici oraya yazarsa,
   öğretmenin tarayıcısındaki kopya bir sonraki save()'te üzerine yazar ve
   öğrenci kaybolur. Bu yüzden satırı her zaman öğretmenin kendisi açar.
   Yönetici yalnızca sınıfı ÖNERİR (onerilenLId/onerilenCId); öğretmenin
   penceresinde o sınıf hazır seçili gelir, tek tuş kalır.
   ========================================================================== */

var _abVeri = { ogrenciler: [], ogretmenler: [], baglar: {}, zaman: 0 };

function _abAd(v, uid) {
    var a = (v && v.name && v.name !== 'Belirtilmedi') ? v.name : '';
    return a || (v && v.email) || uid || '';
}

/* Öğretmenin userData'sındaki seviye/sınıf ağacını seçenek listesine çevirir. */
function _abSiniflar(v) {
    var cikti = [];
    try {
        var d = v && v.userData ? JSON.parse(v.userData) : null;
        if (!d || !d.levels) return cikti;
        var sira = (d.levelOrder && d.levelOrder.length) ? d.levelOrder : Object.keys(d.levels);
        sira.forEach(function (lId) {
            var lvl = d.levels[lId];
            if (!lvl || !lvl.classes) return;
            Object.keys(lvl.classes).forEach(function (cId) {
                var cls = lvl.classes[cId] || {};
                cikti.push({
                    lId: lId, cId: cId,
                    ad: (lvl.name || lId) + ' / ' + (cls.name || cId),
                    mevcut: (cls.students || []).length
                });
            });
        });
    } catch (e) { }
    return cikti;
}

function adminBaglamaYukle(zorla) {
    var kap = document.getElementById('admin-baglama');
    if (!kap) return;
    if (typeof firebase === 'undefined' || typeof isFirebaseReady === 'undefined' || !isFirebaseReady) {
        kap.innerHTML = '<p style="color:#7f8c8d;">Bu bölüm çevrimdışıyken kullanılamaz.</p>';
        return;
    }
    /* 60 sn'lik önbellek: aynı bölümü açıp kapamak koleksiyonu tekrar okumasın. */
    if (!zorla && _abVeri.zaman && (Date.now() - _abVeri.zaman) < 60000) { _abCiz(); return; }

    kap.innerHTML = '<p style="color:#7f8c8d;">Yükleniyor…</p>';
    var db2 = firebase.firestore();

    Promise.all([
        db2.collection('kullanicilar').get(),
        db2.collection('ogrenciBaglari').get().catch(function () { return { forEach: function () { } }; })
    ]).then(function (r) {
        var ogr = [], ogt = [];
        r[0].forEach(function (doc) {
            var v = doc.data() || {};
            v._id = doc.id;
            if (v.role === 'teacher' || v.role === 'admin') {
                ogt.push({ uid: doc.id, ad: _abAd(v, doc.id), email: v.email || '',
                           onay: v.ogretmenOnay || '', siniflar: _abSiniflar(v) });
            }
            /* Rolü hiç yazılmamış eski hesaplar da öğrenci sayılır. */
            if (v.role === 'student' || !v.role) {
                ogr.push({ uid: doc.id, ad: _abAd(v, doc.id), email: v.email || '',
                           cinsiyet: v.cinsiyet || '' });
            }
        });
        var baglar = {};
        r[1].forEach(function (doc) { baglar[doc.id] = doc.data() || {}; });

        ogr.sort(function (a, b) { return String(a.ad).localeCompare(String(b.ad), 'tr'); });
        /* Onayı bekleyen/reddedilen öğretmen siteye giremez; ona tanımlamak
           boşa gider. Bu yüzden onaylı olanlar (ve rolü eski kayıt olanlar)
           listenin başına, geri kalanlar sonuna alınır. */
        ogt.sort(function (a, b) {
            var ak = (a.onay === 'bekliyor' || a.onay === 'reddedildi') ? 1 : 0;
            var bk = (b.onay === 'bekliyor' || b.onay === 'reddedildi') ? 1 : 0;
            if (ak !== bk) return ak - bk;
            return String(a.ad).localeCompare(String(b.ad), 'tr');
        });

        _abVeri = { ogrenciler: ogr, ogretmenler: ogt, baglar: baglar, zaman: Date.now() };
        _abCiz();
    }).catch(function (e) {
        kap.innerHTML = '<p style="color:#EF5350;">Liste alınamadı: ' +
            _fbEsc((e && (e.code || e.message)) || e) + '</p>' +
            '<button class="btn" onclick="adminBaglamaYukle(true)" style="margin-top:10px; font-size:.9rem;">🔄 Yenile</button>';
    });
}
window.adminBaglamaYukle = adminBaglamaYukle;

/* Öğrencinin bağ belgeleri (eski tek kimlikli + yeni öğrenci__öğretmen kimlikli); ogretmenUid belge
   kimliğinden tamamlanır — SINIF SEÇİMİ (05.11.2026): eskiden yalnız eski kimlik bakılıyordu. */
function _abBaglari(uid) {
    var L = [];
    Object.keys(_abVeri.baglar).forEach(function (k) {
        var b = _abVeri.baglar[k] || {}, p = String(k).split('__');
        if (String(b.uid || p[0]) !== String(uid)) return;
        var ogt = b.ogretmenUid || (p.length > 1 ? p[1] : '');
        L.push(Object.assign({}, b, { _id: k, ogretmenUid: ogt }));
    });
    return L;
}
/* Bir öğrencinin şu anki bağı: rozet + açıklama (onaylı varsa o; yoksa bekleyen; önerilen sınıfla) */
function _abDurum(uid) {
    var L = _abBaglari(uid).filter(function (b) { return b.durum === 'onayli' || b.durum === 'bekliyor'; });
    L.sort(function (a, b) { return (a.durum === 'onayli' ? 0 : 1) - (b.durum === 'onayli' ? 0 : 1); });
    var b = L[0];
    if (!b) return { renk: '#9aa5b1', zemin: '#F0F3F7', ad: 'Bağlı değil', not: '' };
    var ogtAd = b.ogretmenAd || '';
    for (var i = 0; i < _abVeri.ogretmenler.length; i++) {
        if (_abVeri.ogretmenler[i].uid === b.ogretmenUid) { ogtAd = _abVeri.ogretmenler[i].ad; break; }
    }
    var yer = (b.seviyeAd || '') + (b.sinifAd ? ' / ' + b.sinifAd : '');
    if (b.durum === 'onayli') {
        return { renk: '#1E8449', zemin: '#E8F6EF', ad: 'Onaylı' + (L.length > 1 ? ' +' + (L.length - 1) : ''),
                 not: (ogtAd || '—') + (yer ? ' · ' + yer : '') };
    }
    return { renk: '#B5670A', zemin: '#FEF3E2', ad: _aoyOnayGecerli(b) ? 'Yönetici onayladı' : 'Bekliyor',
             not: (ogtAd || '—') + ((_aoyOneri(b) && b.onerilenAd) ? ' · ' + b.onerilenAd + (b.onerenOgrenci ? ' (öğrenci seçti)' : '') : (yer ? ' · ' + yer : '')) };
}

function _abCiz() {
    var kap = document.getElementById('admin-baglama');
    if (!kap) return;

    if (!_abVeri.ogretmenler.length) {
        kap.innerHTML = '<p style="color:#7f8c8d;">Sistemde kayıtlı öğretmen yok.</p>' +
            '<button class="btn" onclick="adminBaglamaYukle(true)" style="margin-top:10px; font-size:.9rem;">🔄 Yenile</button>';
        return;
    }

    var ogtSec = _abVeri.ogretmenler.map(function (t) {
        return '<option value="' + _fbEsc(t.uid) + '">' + _fbEsc(t.ad) +
               (t.email ? ' — ' + _fbEsc(t.email) : '') +
               (t.onay === 'bekliyor' ? '  (onay bekliyor)' : '') + '</option>';
    }).join('');

    var bekleyen = 0;
    Object.keys(_abVeri.baglar).forEach(function (k) {
        if (_abVeri.baglar[k] && _abVeri.baglar[k].durum === 'bekliyor') bekleyen++;
    });
    var rozet = document.getElementById('admin-baglama-badge');
    if (rozet) rozet.innerHTML = bekleyen
        ? '<span style="background:#F39C12; color:#fff; border-radius:999px; padding:2px 10px; font-size:0.8rem; margin-left:8px;">' +
          bekleyen + ' onay bekliyor</span>' : '';

    var kut = 'padding:9px 11px; border:1px solid #cbd5e1; border-radius:9px; background:#fff; font-family:inherit; font-size:.92rem;';

    kap.innerHTML =
        '<div style="display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end; margin-bottom:14px;">' +
          '<label style="flex:1 1 260px; min-width:0;">' +
            '<span style="display:block; font-size:.78rem; font-weight:700; color:#16A085; margin-bottom:4px;">ÖĞRETMEN</span>' +
            '<select id="abOgretmen" onchange="_abSinifTazele()" style="width:100%; box-sizing:border-box; ' + kut + '">' +
            ogtSec + '</select></label>' +
          '<label style="flex:1 1 240px; min-width:0;">' +
            '<span style="display:block; font-size:.78rem; font-weight:700; color:#16A085; margin-bottom:4px;">SINIF (isteğe bağlı)</span>' +
            '<select id="abSinif" style="width:100%; box-sizing:border-box; ' + kut + '"></select></label>' +
          /* ÖĞRETMEN ADINA ONAYLA (SINIF SEÇİMİ, 05.11.2026) */
          '<label style="flex:1 1 100%; display:flex; align-items:center; gap:8px; font-size:.86rem; color:#2c3e50; cursor:pointer;">' +
            '<input type="checkbox" id="abOnayla" style="width:17px; height:17px;"> Öğretmen adına onayla ' +
            '<small style="color:#8A94A3;">(sınıf seçiliyse; öğretmen siteye girince öğrenci o sınıfa kendiliğinden eklenir)</small></label>' +
        '</div>' +

        '<div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:10px;">' +
          '<input id="abAra" type="search" placeholder="Öğrenci ara (ad ya da e-posta)…" oninput="_abSuz()" ' +
            'style="flex:1 1 240px; min-width:0; ' + kut + '">' +
          '<button class="btn" onclick="_abHepsi(true)" style="font-size:.85rem;">Tümünü seç</button>' +
          '<button class="btn" onclick="_abHepsi(false)" style="font-size:.85rem;">Temizle</button>' +
          '<button class="btn" onclick="adminBaglamaYukle(true)" style="font-size:.85rem;">🔄 Yenile</button>' +
        '</div>' +

        '<div id="abListe" style="max-height:360px; overflow-y:auto; border:1px solid #E9EEF5; border-radius:12px; background:#fff;"></div>' +

        '<div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-top:12px;">' +
          '<span id="abSayac" style="flex:1; font-size:.86rem; color:#7f8c8d;">0 öğrenci seçildi</span>' +
          '<button class="btn" onclick="adminBagiKaldir()" ' +
            'style="background:#FDEDEC; color:#B03A2E; font-size:.9rem;">Bağı kaldır</button>' +
          '<button class="btn btn-primary" onclick="adminOgrenciTanimla()" style="font-size:.95rem;">' +
            'Seçilenleri bu öğretmene tanımla</button>' +
        '</div>';

    _abSinifTazele();
    _abSuz();
}

/* Seçili öğretmenin sınıfları — yönetici istersen sınıfı da önerir. */
function _abSinifTazele() {
    var s = document.getElementById('abOgretmen');
    var k = document.getElementById('abSinif');
    if (!s || !k) return;
    var t = null;
    for (var i = 0; i < _abVeri.ogretmenler.length; i++) {
        if (_abVeri.ogretmenler[i].uid === s.value) { t = _abVeri.ogretmenler[i]; break; }
    }
    var opt = '<option value="" data-ad="">— öğretmen kendisi seçsin —</option>';
    if (t && t.siniflar.length) {
        /* data-ad: sınıfın SADE adı. Seçenek metninde "(3 öğrenci)" de var;
           öneri kaydına o mevcut sayısı sızmasın diye ad ayrı taşınıyor. */
        opt += t.siniflar.map(function (c) {
            return '<option value="' + _fbEsc(c.lId + '|||' + c.cId) + '" data-ad="' + _fbEsc(c.ad) + '">' +
                   _fbEsc(c.ad) + ' (' + c.mevcut + ' öğrenci)</option>';
        }).join('');
    } else {
        opt = '<option value="">— bu öğretmenin sınıfı görünmüyor —</option>';
    }
    k.innerHTML = opt;
}
window._abSinifTazele = _abSinifTazele;

function _abSuz() {
    var l = document.getElementById('abListe');
    if (!l) return;
    var q = (document.getElementById('abAra') || {}).value || '';
    q = q.toLocaleLowerCase('tr').trim();

    var secili = _abSecilenler();
    var satir = '';
    var n = 0;
    _abVeri.ogrenciler.forEach(function (o) {
        var metin = (o.ad + ' ' + o.email).toLocaleLowerCase('tr');
        if (q && metin.indexOf(q) === -1) return;
        n++;
        var d = _abDurum(o.uid);
        var emj = o.cinsiyet === 'kadin' ? '👩‍🎓' : (o.cinsiyet === 'erkek' ? '👨‍🎓' : '👤');
        satir +=
            '<label style="display:flex; align-items:center; gap:10px; padding:9px 12px; border-bottom:1px solid #F2F5F9; cursor:pointer;">' +
              '<input type="checkbox" class="ab-tik" value="' + _fbEsc(o.uid) + '" onchange="_abSayacYaz()"' +
                (secili.indexOf(o.uid) > -1 ? ' checked' : '') + ' style="width:17px; height:17px; flex:0 0 auto;">' +
              '<span style="flex:0 0 auto; font-size:1.05rem;">' + emj + '</span>' +
              '<span style="flex:1 1 auto; min-width:0;">' +
                '<b style="display:block; color:#2c3e50; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' +
                  _fbEsc(o.ad) + '</b>' +
                '<span style="font-size:.82rem; color:#8a94a3;">' + _fbEsc(o.email) +
                  (d.not ? ' · ' + _fbEsc(d.not) : '') + '</span>' +
              '</span>' +
              '<span style="flex:0 0 auto; padding:3px 10px; border-radius:999px; font-size:.76rem; font-weight:700; ' +
                'color:' + d.renk + '; background:' + d.zemin + ';">' + d.ad + '</span>' +
            '</label>';
    });

    l.innerHTML = satir || '<p style="padding:16px; color:#8a94a3; margin:0;">Eşleşen öğrenci yok.</p>';
    _abSayacYaz();
}
window._abSuz = _abSuz;

function _abSecilenler() {
    var a = [];
    var t = document.querySelectorAll('#abListe .ab-tik');
    for (var i = 0; i < t.length; i++) if (t[i].checked) a.push(t[i].value);
    return a;
}

function _abSayacYaz() {
    var s = document.getElementById('abSayac');
    if (s) {
        var n = _abSecilenler().length;
        s.textContent = n ? (n + ' öğrenci seçildi') : 'Listeden öğrenci seç';
    }
}
window._abSayacYaz = _abSayacYaz;

function _abHepsi(ac) {
    var t = document.querySelectorAll('#abListe .ab-tik');
    for (var i = 0; i < t.length; i++) t[i].checked = !!ac;
    _abSayacYaz();
}
window._abHepsi = _abHepsi;

/* --- ASIL İŞ: seçili öğrencileri seçili öğretmene tanımla --- */
function adminOgrenciTanimla() {
    var uidler = _abSecilenler();
    if (!uidler.length) { _abUyar('Önce listeden en az bir öğrenci seç.'); return; }

    var sOgt = document.getElementById('abOgretmen');
    var ogtUid = sOgt && sOgt.value;
    if (!ogtUid) { _abUyar('Önce bir öğretmen seç.'); return; }

    var ogt = null;
    for (var i = 0; i < _abVeri.ogretmenler.length; i++) {
        if (_abVeri.ogretmenler[i].uid === ogtUid) { ogt = _abVeri.ogretmenler[i]; break; }
    }
    if (!ogt) { _abUyar('Öğretmen bulunamadı, listeyi yenile.'); return; }

    var sSnf = document.getElementById('abSinif');
    var snf = (sSnf && sSnf.value) || '';
    var snfAd = '';
    if (snf && sSnf.selectedIndex > -1) {
        var o = sSnf.options[sSnf.selectedIndex];
        snfAd = o.getAttribute('data-ad') || o.text;
    }

    /* Zaten başka bir öğretmene ONAYLI bağlı olanları ayrıca söyle. */
    var cakisan = uidler.filter(function (u) {
        return _abBaglari(u).some(function (b) { return b.durum === 'onayli' && b.ogretmenUid && b.ogretmenUid !== ogtUid; });
    }).length;
    /* ÖĞRETMEN ADINA ONAYLA (SINIF SEÇİMİ, 05.11.2026): sınıf seçiliyse istek yoneticiOnay ile gider,
       öğretmenin tarayıcısı öğrenciyi o sınıfa kendiliğinden ekler. */
    var onayKutu = document.getElementById('abOnayla'), onay = !!(onayKutu && onayKutu.checked);
    if (onay && !snf) { _abUyar('Öğretmen adına onaylamak için bir sınıf seç.'); return; }

    var soru = uidler.length + ' öğrenci "' + ogt.ad + '" öğretmenine tanımlansın mı?' +
        (snf ? '\nÖnerilen sınıf: ' + snfAd : '\nSınıfı öğretmen kendisi seçecek.') +
        (onay ? '\nÖğretmen adına ONAYLANACAK: öğretmen siteye girince öğrenci bu sınıfa kendiliğinden eklenir.' : '') +
        (cakisan ? '\n\nDİKKAT: ' + cakisan + ' öğrenci şu an BAŞKA bir öğretmene onaylı bağlı; bağları bu öğretmene taşınacak.' : '');

    _abSor(soru, function () { _abYaz(uidler, ogt, snf, snfAd, onay); });
}
window.adminOgrenciTanimla = adminOgrenciTanimla;

function _abYaz(uidler, ogt, snf, snfAd, onay) {
    var db2 = firebase.firestore();
    var damga;
    try { damga = firebase.firestore.FieldValue.serverTimestamp(); } catch (e) { damga = Date.now(); }

    var isler = uidler.map(function (uid) {
        var o = null;
        for (var i = 0; i < _abVeri.ogrenciler.length; i++) {
            if (_abVeri.ogrenciler[i].uid === uid) { o = _abVeri.ogrenciler[i]; break; }
        }
        var kayit = {
            uid: uid,
            email: (o && o.email) || '',
            ad: (o && o.ad) || '',
            tur: 'ogretmen',              /* satır öğretmen onaylarken açılacak */
            ogretmenUid: ogt.uid,
            ogretmenAd: ogt.ad,
            durum: 'bekliyor',
            yoneticiTanimli: true,
            istekTarih: damga
        };
        if (snf) {
            var pr = snf.split('|||');
            kayit.onerilenLId = pr[0];
            kayit.onerilenCId = pr[1];
            kayit.onerilenAd = snfAd || '';
            kayit.onerenOgrenci = false;
        }
        if (onay && snf) { kayit.yoneticiOnay = true; kayit.yoneticiOnayTarih = damga; }   /* öğretmen adına onay (05.11.2026) */
        return db2.collection('ogrenciBaglari')
                  .doc(taBagKimlik(uid, ogt.uid)).set(kayit, { merge: true });
    });

    Promise.all(isler).then(function () {
        _abUyar(uidler.length + ' öğrenci "' + ogt.ad + '" öğretmenine tanımlandı. ' +
                (onay && snf ? 'Öğretmen siteye girince öğrenciler ' + snfAd + ' sınıfına kendiliğinden eklenir.'
                             : 'Öğretmen kendi panelindeki zilden onaylayacak.'));
        delete _abOnbellek.bag;                               /* öğrenci listesi taze bağları görsün */
        adminBaglamaYukle(true);
    }).catch(function (e) {
        _abUyar('Tanımlama başarısız: ' + ((e && (e.code || e.message)) || e) +
                '\n(Firestore kuralları güncel mi? ogrenciBaglari için yöneticiye create izni gerekiyor.)');
    });
}

/* Seçili öğrencilerin bağını tamamen siler — öğrenci yeniden kod girebilir. */
function adminBagiKaldir() {
    var uidler = _abSecilenler();
    if (!uidler.length) { _abUyar('Önce listeden en az bir öğrenci seç.'); return; }
    _abSor(uidler.length + ' öğrencinin öğretmen bağı kaldırılsın mı?\n' +
           'Öğrencinin notları silinmez; yalnız bağ kaydı kalkar ve öğrenci yeniden kod girebilir.',
    function () {
        var db2 = firebase.firestore();
        /* Ogrencinin BUTUN baglari kaldirilir (birden cok ogretmeni olabilir);
           eski tek kimlikli kayit da silinir. */
        Promise.all(uidler.map(function (uid) {
            return db2.collection('ogrenciBaglari').where('uid', '==', uid).get()
                .then(function (snap) {
                    var sil = [];
                    snap.forEach(function (doc) { sil.push(doc.ref.delete()); });
                    sil.push(db2.collection('ogrenciBaglari').doc(uid).delete().catch(function () { }));
                    return Promise.all(sil);
                });
        })).then(function () {
            _abUyar(uidler.length + ' öğrencinin bağı kaldırıldı.');
            adminBaglamaYukle(true);
        }).catch(function (e) {
            _abUyar('Kaldırılamadı: ' + ((e && (e.code || e.message)) || e));
        });
    });
}
window.adminBagiKaldir = adminBagiKaldir;

/* Sitenin kendi pencereleri varsa onlar, yoksa tarayıcınınki. */
function _abUyar(m) {
    if (typeof showCustomAlert === 'function') return showCustomAlert(m);
    alert(m);
}
function _abSor(m, evet) {
    if (typeof showCustomConfirm === 'function') {
        var r = showCustomConfirm(m);
        if (r && r.then) { r.then(function (o) { if (o) evet(); }); return; }
        if (r) evet();
        return;
    }
    if (confirm(m)) evet();
}

/* ==========================================================================
   ÖĞRETMEN OLABİLECEK ÖĞRENCİLER (02.11.2026) — yönetici: öğretmenler öğrenci hesabıyla siteyi
   ücretsiz kullanmasın; panelde «öğretmen olabilir» listesi, tek tuşla öğretmen hesabına çevir.
   · Bölüm açılınca okunur (10 dk önbellek): kullanicilar (Kayıtlı Öğrenciler listesiyle ortak) ve
     ogrenciBaglari.
   · İşaretler (puan): tahtada süre 3 · mesleği öğretmen/hoca/eğitimci… 3 · e-posta meb.gov.tr /
     meb.k12.tr ya da adında öğretmen/hoca 2 · ankette «yetişkin» 1 · hiçbir öğretmene bağlı değil 1 ·
     sitede 3 saatten çok ya da 8 gün ve üstü 1. Puanı 2 ve üstü listelenir, en olası üstte.
   · «Öğretmen yap»: KidefErisim.onayla (rol teacher + onaylı + hoş geldin mesajı), ogrencidenCevrildi
     zamanı; öğretmen sayacı tazelenir. «Öğrenci»: inceleme.karar 'ogrenci' yazılır, kart alttaki
     «Öğrenci dediklerin» kümesine iner (oradan da öğretmen yapılabilir).
   ========================================================================== */
var _asp = { L: null, ogr: {}, ogt: {} };
var ASP_MESLEK = /öğretmen|ogretmen|hoca|eğitimci|egitimci|teacher|akademisyen|öğretim görevlisi|ogretim gorevlisi|müdür|mudur|idareci/;
function _aspStil() {
    if (document.getElementById('asp-stil')) return;
    var st = document.createElement('style');
    st.id = 'asp-stil';
    st.textContent = [
        '#admin-supheli .asp-ust{display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;',
        '  margin:0 0 10px; font-size:.88rem; color:#5B6B7F; font-weight:800;}',
        '#admin-supheli .asp-kart{display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap;',
        '  padding:12px 14px; margin:0 0 10px; border-radius:14px; background:#fff; border:1px solid #E6ECF3;',
        '  box-shadow:0 2px 8px rgba(15,42,67,.05);}',
        '#admin-supheli .asp-sol{flex:1 1 260px; min-width:0;}',
        '#admin-supheli .asp-ad{font-weight:800; color:#2c3e50; font-size:1rem;}',
        '#admin-supheli .asp-alt{font-size:.8rem; color:#8A94A3; margin-top:2px; overflow-wrap:anywhere;}',
        '#admin-supheli .asp-cipler{display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;}',
        '#admin-supheli .asp-cip{font-size:.78rem; font-weight:700; padding:3px 9px; border-radius:999px;',
        '  background:#F4F7FB; color:#4A5A6B; border:1px solid #E3E9F1; overflow-wrap:anywhere;}',
        '#admin-supheli .asp-cip.g3{background:#FDEDEC; color:#B03A2E; border-color:#F5C6C1;}',
        '#admin-supheli .asp-cip.g2{background:#FFF4E6; color:#B9690F; border-color:#F8DDB8;}',
        '#admin-supheli .asp-tus{display:flex; gap:8px; flex-wrap:wrap; align-items:center;}',
        '#admin-supheli .asp-tus button{border:0; border-radius:10px; padding:8px 14px; font-weight:800; font-size:.86rem; cursor:pointer;}',
        '#admin-supheli .asp-tus .asp-ogt{background:#16A085; color:#fff;}',
        '#admin-supheli .asp-tus .asp-ogr{background:#F1F5F9; color:#2C3E50;}',
        '#admin-supheli .asp-bos{color:#7f8c8d; font-size:.9rem; margin:0;}',
        '#admin-supheli details.asp-gizli{margin-top:14px;}',
        '#admin-supheli details.asp-gizli > summary{cursor:pointer; font-weight:800; color:#5B6B7F; font-size:.9rem; margin-bottom:8px;}',
        '#admin-supheli-badge .asp-rozet{background:#E67E22; color:#fff; border-radius:12px; padding:1px 9px; font-size:.75rem; margin-left:8px;}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
}
function _aspSure(sn) {
    sn = Math.round(+sn || 0);
    if (sn < 3600) return Math.max(1, Math.round(sn / 60)) + ' dk';
    var s = Math.floor(sn / 3600), d = Math.round((sn % 3600) / 60);
    return s + ' sa' + (d ? ' ' + d + ' dk' : '');
}
/* bagli: true / false / null (bağlar okunamadı: o işaret konmaz) */
function _aspIsaretler(v, bagli) {
    var I = [], kul = v.kullanim || {}, alan = kul.alan || {};
    var tahta = +alan.tahta || 0;
    if (tahta >= 60) I.push({ p: 3, y: '📺 Tahtada ' + _aspSure(tahta) });
    var meslek = String(v.meslek || '').trim();
    if (meslek && ASP_MESLEK.test(meslek.toLocaleLowerCase('tr'))) I.push({ p: 3, y: '💼 ' + meslek });
    var ep = String(v.email || '').toLowerCase(), m = ep.split('@')[0].match(/ogretmen|öğretmen|hoca|teacher/);
    if (/@meb\.(gov|k12)\.tr$/.test(ep)) I.push({ p: 2, y: '✉️ ' + ep.split('@')[1] });
    else if (m) I.push({ p: 2, y: '✉️ e-postada «' + m[0] + '»' });
    if (v.anket && v.anket.sinif === 'yetiskin') I.push({ p: 1, y: '📝 Ankette: yetişkin' });
    if (bagli === false) I.push({ p: 1, y: '🔗 Öğretmene bağlı değil' });
    var top = +kul.toplamSn || 0, gun = kul.gun ? Object.keys(kul.gun).length : 0;
    if (top >= 3 * 3600 || gun >= 8) I.push({ p: 1, y: '⏱ Sitede ' + _aspSure(top) + (gun ? ' · ' + gun + ' gün' : '') });
    return I;
}
function _aspBaglar(snap) {
    if (!snap) return null;
    var B = {};
    snap.forEach(function (d) {
        var v = d.data() || {};
        if (v.durum !== 'onayli') return;
        var u = v.uid || String(d.id).split('__')[0];
        if (u) B[u] = true;
    });
    return B;
}
function adminSupheliYukle(zorla) {
    var kap = document.getElementById('admin-supheli');
    if (!kap) return;
    _aspStil();
    if (typeof firebase === 'undefined' || typeof isFirebaseReady === 'undefined' || !isFirebaseReady) {
        kap.innerHTML = '<p class="asp-bos">Bu bölüm çevrimdışıyken kullanılamaz.</p>';
        return;
    }
    kap.innerHTML = '<p class="asp-bos">Yükleniyor…</p>';
    var D = firebase.firestore();
    Promise.all([
        _abSnap('ogrenci', function () { return D.collection('kullanicilar').get(); }, !zorla),
        _abSnap('bag', function () { return D.collection('ogrenciBaglari').get(); }, !zorla).then(null, function () { return null; })
    ]).then(function (r) {
        var B = _aspBaglar(r[1]), L = [];
        r[0].forEach(function (d) {
            var v = d.data() || {};
            if ((v.role && v.role !== 'student') || _asp.ogt[d.id]) return;      /* öğretmen, yönetici, az önce çevrilen */
            var I = _aspIsaretler(v, B ? !!B[d.id] : null);
            var p = I.reduce(function (s, x) { return s + x.p; }, 0);
            if (p < 2) return;
            L.push({ uid: d.id, ad: (v.name && v.name !== 'Belirtilmedi') ? v.name : (v.email || d.id), email: v.email || '',
                     kayit: _aogKayitMs(v), I: I, p: p, tahta: +((v.kullanim || {}).alan || {}).tahta || 0,
                     top: +(v.kullanim || {}).toplamSn || 0,
                     ogrenci: !!(_asp.ogr[d.id] || (v.inceleme && v.inceleme.karar === 'ogrenci')) });
        });
        L.sort(function (a, b) {
            return (b.p - a.p) || (b.tahta - a.tahta) || (b.top - a.top) || String(a.ad).localeCompare(String(b.ad), 'tr');
        });
        _asp.L = L;
        _aspCiz();
    }, function (e) {
        kap.innerHTML = '<p style="color:#EF5350;">Liste alınamadı: ' + _fbEsc((e && (e.code || e.message)) || e) + '</p>';
    });
}
function _aspKart(x) {
    var s = function (p) { return p >= 3 ? ' g3' : (p >= 2 ? ' g2' : ''); };
    return '<div class="asp-kart" data-asp-uid="' + _fbEsc(x.uid) + '">' +
        '<div class="asp-sol"><div class="asp-ad">' + _fbEsc(x.ad) + '</div>' +
          '<div class="asp-alt">' + _fbEsc(x.email) + (x.kayit ? ' · kayıt ' + _aogGun(x.kayit) : '') + '</div>' +
          '<div class="asp-cipler">' + x.I.map(function (i) { return '<span class="asp-cip' + s(i.p) + '">' + _fbEsc(i.y) + '</span>'; }).join('') + '</div>' +
        '</div>' +
        '<div class="asp-tus"><button type="button" class="asp-ogt" data-asp="ogt">Öğretmen yap</button>' +
          (x.ogrenci ? '' : '<button type="button" class="asp-ogr" data-asp="ogr">Öğrenci</button>') + '</div>' +
      '</div>';
}
function _aspCiz() {
    var kap = document.getElementById('admin-supheli');
    if (!kap || !_asp.L) return;
    var acik = _asp.L.filter(function (x) { return !x.ogrenci; }), gizli = _asp.L.filter(function (x) { return x.ogrenci; });
    var rz = document.getElementById('admin-supheli-badge');
    if (rz) rz.innerHTML = acik.length ? '<span class="asp-rozet">' + acik.length + '</span>' : '';
    kap.innerHTML =
        '<div class="asp-ust"><span>' + (acik.length ? acik.length + ' hesap · en olası üstte' : 'Öğretmen gibi görünen öğrenci hesabı yok') + '</span>' +
          '<button type="button" class="btn" data-asp="yenile" style="font-size:.85rem;">🔄 Yenile</button></div>' +
        acik.map(_aspKart).join('') +
        (gizli.length ? '<details class="asp-gizli"><summary>Öğrenci dediklerin (' + gizli.length + ')</summary>' +
                        gizli.map(_aspKart).join('') + '</details>' : '');
    kap.onclick = function (e) {
        var t = e.target && e.target.closest ? e.target.closest('[data-asp]') : null;
        if (!t || !kap.contains(t)) return;
        var is = t.getAttribute('data-asp'), kart = t.closest('[data-asp-uid]'), uid = kart && kart.getAttribute('data-asp-uid');
        if (is === 'yenile') adminSupheliYukle(true);
        else if (is === 'ogt' && uid) adminSupheliOgretmen(uid);
        else if (is === 'ogr' && uid) adminSupheliOgrenci(uid);
    };
}
function _aspBul(uid) { return (_asp.L || []).filter(function (x) { return x.uid === uid; })[0] || null; }
function adminSupheliOgretmen(uid) {
    var x = _aspBul(uid);
    if (!x) return;
    _abSor('«' + x.ad + '» öğretmen hesabına çevrilsin mi? Hesap öğretmen olur; deneme hakları ve destek düzeni ona da ' +
           'işler, hoş geldin mesajı gider.', function () {
        var E = window.KidefErisim, D = firebase.firestore();
        var is = (E && E.onayla) ? E.onayla(uid, { ad: x.ad, email: x.email })
                                 : D.collection('kullanicilar').doc(uid).update({ role: 'teacher', ogretmenOnay: 'onayli' });
        is.then(function () {
            D.collection('kullanicilar').doc(uid).update({ ogrencidenCevrildi: firebase.firestore.FieldValue.serverTimestamp() })
                .catch(function () { });
            _asp.ogt[uid] = 1;
            _asp.L = _asp.L.filter(function (y) { return y.uid !== uid; });
            delete _abOnbellek.ogrenci; delete _abOnbellek.ogretmen;
            if (typeof _ogsTazele === 'function') _ogsTazele(true);           /* öğretmen sayacı */
            _aspCiz();
            _abUyar('«' + x.ad + '» artık öğretmen hesabı.');
        }, function (e) {
            _abUyar('Çevrilemedi: ' + ((e && (e.code || e.message)) || e));
        });
    });
}
function adminSupheliOgrenci(uid) {
    var x = _aspBul(uid);
    if (!x) return;
    firebase.firestore().collection('kullanicilar').doc(uid)
        .update({ inceleme: { karar: 'ogrenci', t: firebase.firestore.FieldValue.serverTimestamp() } })
        .then(function () { _asp.ogr[uid] = 1; x.ogrenci = true; _aspCiz(); },
              function (e) { _abUyar('Kaydedilemedi: ' + ((e && (e.code || e.message)) || e)); });
}
window.adminSupheliYukle = adminSupheliYukle;
