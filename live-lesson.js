/* ==========================================
   WEBRTC GERÇEK ZAMANLI VİDEO BAĞLANTISI
   Bire bir canlı ders (1 öğretmen + 1 öğrenci)
   Zoom titizliğiyle sağlamlaştırıldı:
   - ICE adaylarını tamponlama (yarış koşulu önlenir)
   - Otomatik yeniden bağlanma (ICE restart)
   - Oda ve sinyal verisi temizliği (eski adaylar bozmaz)
   - Bağlantı durumu göstergesi
   - beforeunload dinleyici sızıntısı düzeltildi
   ========================================== */
let peerConnection = null;

// --- Bağlantı durum değişkenleri ---
let _pendingCandidates = [];   // remoteDescription gelmeden biriken ICE adayları
let _remoteDescSet = false;    // karşı tarafın açıklaması set edildi mi
let _appliedOfferSdp = null;   // öğrenci: uygulanan teklif (yeniden bağlanma tespiti)
let _appliedAnswerSdp = null;  // öğretmen: uygulanan cevap
let _iceRestartTimer = null;   // yeniden bağlanma zamanlayıcısı
let _beforeUnloadBound = false;// beforeunload yalnızca bir kez bağlansın
let _chatFirstSnap = true;     // sohbet ilk yükleme (eski mesajlar için kırmızı nokta çıkmasın)

function _escLive(t) { return String(t).replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        {
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        },
        {
            urls: 'turn:openrelay.metered.ca:443',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        },
        {
            urls: 'turn:openrelay.metered.ca:443?transport=tcp',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        }
    ],
    iceCandidatePoolSize: 4
};

// Bağlantı durumu yazısını ekranda göster/gizle
function _setLiveStatus(text, color) {
    const waitMsg = document.getElementById('live-wait-msg');
    if (!waitMsg) return;
    if (text) {
        waitMsg.innerHTML = '<p style="color:' + (color || '#ccc') + '; font-size:1.05rem;">' + text + '</p>';
        waitMsg.style.display = 'block';
    } else {
        waitMsg.style.display = 'none';
    }
}

// Biriken ICE adaylarını, remoteDescription hazır olunca uygula
async function _flushCandidates() {
    if (!peerConnection || !_remoteDescSet) return;
    while (_pendingCandidates.length) {
        const c = _pendingCandidates.shift();
        try { await peerConnection.addIceCandidate(new RTCIceCandidate(c)); }
        catch (e) { console.warn('ICE adayı eklenemedi:', e); }
    }
}

// Bir ICE adayını uygula ya da (henüz hazır değilse) tampona al
function _queueCandidate(data) {
    if (!peerConnection) return;
    if (_remoteDescSet) {
        peerConnection.addIceCandidate(new RTCIceCandidate(data)).catch(e => console.warn('ICE adayı eklenemedi:', e));
    } else {
        _pendingCandidates.push(data);
    }
}

// Eski sinyal verilerini (ICE adayları) temizle — yeniden başlatmada bozulmayı önler
async function _clearRoomSignaling(roomRef) {
    for (const sub of ['callerCandidates', 'calleeCandidates']) {
        try {
            const snap = await roomRef.collection(sub).get();
            if (snap.empty) continue;
            const batch = db.batch();
            snap.forEach(d => batch.delete(d.ref));
            await batch.commit();
        } catch (e) { console.warn('Sinyal temizliği (' + sub + '):', e); }
    }
}

// Kamera göndericisine çok düşük kalite sınırı uygula (düşük CPU/bant genişliği)
function _applyCamEncoding(sender) {
    if (!sender) return;
    try {
        const p = sender.getParameters();
        if (!p.encodings || !p.encodings.length) p.encodings = [{}];
        p.encodings[0].maxBitrate = 120000;   // ~0.12 Mbps — çok düşük kamera kalitesi
        p.encodings[0].maxFramerate = 12;
        delete p.encodings[0].scaleResolutionDownBy;
        p.degradationPreference = 'balanced';
        sender.setParameters(p).catch(function(){});
    } catch(e) {}
}

// Öğretmen tarafı: bağlantı koptuğunda ICE restart ile yeniden dener
async function _hostIceRestart() {
    if (!peerConnection || !appState.isRoomHost || !appState.activeRoomId) return;
    try {
        const offer = await peerConnection.createOffer({ iceRestart: true });
        await peerConnection.setLocalDescription(offer);
        await db.collection('rooms').doc(appState.activeRoomId).update({
            offer: { type: offer.type, sdp: offer.sdp }
        });
    } catch (e) { console.warn('Yeniden bağlanma denemesi başarısız:', e); }
}

async function initWebRTCRoom(roomId, isHost) {
    if (!isFirebaseReady) {
        console.warn("Firebase hazır değil, WebRTC kullanılamıyor.");
        return;
    }

    appState.isRoomHost = isHost;
    const roomRef = db.collection('rooms').doc(roomId);

    // Durum değişkenlerini sıfırla (yeni bağlantı için temiz başlangıç)
    _pendingCandidates = [];
    _remoteDescSet = false;
    _appliedOfferSdp = null;
    _appliedAnswerSdp = null;
    if (_iceRestartTimer) { clearTimeout(_iceRestartTimer); _iceRestartTimer = null; }

    peerConnection = new RTCPeerConnection(configuration);

    // Sohbet geçmişini temizle (eski mesajlar tekrar yığılmasın)
    const chatContainer0 = document.getElementById('chat-messages');
    if (chatContainer0) chatContainer0.innerHTML = '';
    _clearChatUnread();
    _chatFirstSnap = true;

    // Sohbet Dinleyicisi (Gerçek Zamanlı)
    appState.unsubscribeChat = roomRef.collection('messages').orderBy('timestamp').onSnapshot(snapshot => {
        const chatContainer = document.getElementById('chat-messages');
        const myName = getLiveDisplayName();

        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                const data = change.doc.data();
                const msgDiv = document.createElement('div');
                msgDiv.className = 'chat-message';
                const isSiz = data.sender === myName;
                const displaySender = isSiz ? "Siz" : data.sender;
                msgDiv.innerHTML = `<div class="sender">${_escLive(displaySender)}</div><div style="font-size: 0.9rem;">${_escLive(data.text)}</div>`;
                chatContainer.appendChild(msgDiv);
                chatContainer.scrollTop = chatContainer.scrollHeight;

                // KIRMIZI NOKTA: ilk yükleme değilse, karşı taraftan geldiyse ve sohbet açık değilse
                if (!_chatFirstSnap && !isSiz) {
                    const sb = document.getElementById('live-sidebar');
                    const chatOpen = sb && sb.classList.contains('open') && sb.getAttribute('data-tab') === 'chat';
                    if (!chatOpen) _showChatUnread();
                }
            }
        });
        _chatFirstSnap = false;
    });

    // Tarayıcı kapatılınca öğretmen odayı kapatır (yalnızca bir kez bağla — sızıntı önlemi)
    if (!_beforeUnloadBound) {
        _beforeUnloadBound = true;
        window.addEventListener('beforeunload', () => {
            if (appState.activeRoomId && appState.isRoomHost && typeof db !== 'undefined' && db) {
                db.collection('rooms').doc(appState.activeRoomId).update({ status: 'closed' });
            }
        });
    }

    // Yerel kamera/mikrofonu bağlantıya ekle
    if (appState.localStream) {
        appState.localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, appState.localStream);
        });
        // Kameraya düşük kalite sınırını uygula
        const camSender = peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
        _applyCamEncoding(camSender);
    }

    // Karşı tarafın görüntüsü geldiğinde ekranda göster
    peerConnection.ontrack = event => {
        const stream = event.streams[0];
        const participantName = appState.isRoomHost ? "Öğrenci" : "Öğretmen";

        const grid = document.getElementById('main-video-grid');
        if (grid && !document.getElementById('remote-box')) {
            const div = document.createElement('div');
            div.className = 'participant-box';
            div.id = 'remote-box';
            div.innerHTML = '<video id="remote-video" autoplay playsinline></video><div class="participant-label">' + participantName + '</div>';
            grid.appendChild(div);
        }
        const remoteVideo = document.getElementById('remote-video');
        if (remoteVideo && remoteVideo.srcObject !== stream) {
            remoteVideo.srcObject = stream;
        }
        if (remoteVideo) remoteVideo.muted = !!appState.remoteMuted; // "tüm sesleri kapat" durumu korunsun

        _setLiveStatus('', null); // "bekleniyor" mesajını gizle

        if (appState.pipWindow) {
            const pipGrid = appState.pipWindow.document.getElementById('pip-participants-grid');
            if (pipGrid && !appState.pipWindow.document.getElementById('pip-remote-video')) {
                const div = appState.pipWindow.document.createElement('div');
                div.className = 'pip-participant-video';
                div.innerHTML = '<video id="pip-remote-video" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>';
                pipGrid.appendChild(div);
                const _prv = appState.pipWindow.document.getElementById('pip-remote-video');
                _prv.srcObject = stream;
                _prv.muted = !!appState.remoteMuted;
            }
        }
    };

    // Bağlantı durumu + otomatik yeniden bağlanma
    peerConnection.onconnectionstatechange = () => {
        if (!peerConnection) return;
        const st = peerConnection.connectionState;
        if (st === 'connected') {
            _setLiveStatus('', null);
            if (_iceRestartTimer) { clearTimeout(_iceRestartTimer); _iceRestartTimer = null; }
        } else if (st === 'connecting') {
            _setLiveStatus('Bağlanıyor…', '#ccc');
        } else if (st === 'disconnected') {
            // Geçici kopma: kısa bir süre bekle, düzelmezse yeniden dene
            _setLiveStatus('Bağlantı zayıfladı, yeniden bağlanılıyor…', '#F39C12');
            if (appState.isRoomHost && !_iceRestartTimer) {
                _iceRestartTimer = setTimeout(() => { _iceRestartTimer = null; _hostIceRestart(); }, 2500);
            }
        } else if (st === 'failed') {
            _setLiveStatus('Bağlantı koptu, yeniden bağlanılıyor…', '#EF5350');
            if (appState.isRoomHost) _hostIceRestart();
        }
    };

    if (isHost) {
        // ---- ÖĞRETMEN / YÖNETİCİ: odayı kurar, teklif gönderir ----
        const callerCandidatesCollection = roomRef.collection('callerCandidates');

        peerConnection.onicecandidate = event => {
            if (event.candidate) callerCandidatesCollection.add(event.candidate.toJSON());
        };

        // Eski sinyal verilerini temizle (öğretmen yenilerse eski adaylar bozmasın)
        await _clearRoomSignaling(roomRef);

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        await roomRef.set({
            offer: { type: offer.type, sdp: offer.sdp },
            createdAt: new Date(),
            status: 'active'
        });

        _setLiveStatus('Öğrenci bekleniyor…', '#ccc');

        // Oda dokümanını dinle: cevap gelince uygula (ilk bağlantı + yeniden bağlanma)
        appState.unsubscribeStatus = roomRef.onSnapshot(async snapshot => {
            const data = snapshot.data();
            if (!data) return;
            if (data.answer && data.answer.sdp !== _appliedAnswerSdp) {
                try {
                    _appliedAnswerSdp = data.answer.sdp;
                    if (peerConnection.signalingState === 'have-local-offer') {
                        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
                        _remoteDescSet = true;
                        await _flushCandidates();
                    }
                } catch (e) { console.warn('Cevap uygulanamadı:', e); }
            }
        });

        // Öğrencinin ICE adaylarını dinle
        appState.unsubscribeIce = roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') _queueCandidate(change.doc.data());
            });
        });

    } else {
        // ---- ÖĞRENCİ (misafir): odayı dinler, teklif gelince cevaplar ----
        const calleeCandidatesCollection = roomRef.collection('calleeCandidates');

        peerConnection.onicecandidate = event => {
            if (event.candidate) calleeCandidatesCollection.add(event.candidate.toJSON());
        };

        _setLiveStatus('Öğretmen bekleniyor…', '#ccc');

        // Oda dokümanını dinle: teklif gelince (veya yeniden bağlanınca) cevap ver
        appState.unsubscribeStatus = roomRef.onSnapshot(async snapshot => {
            const data = snapshot.data();
            if (!data) { _setLiveStatus('Öğretmen bekleniyor…', '#ccc'); return; }

            if (data.status === 'closed') {
                showCustomAlert("Dersi başlatan kişi (Öğretmen/Yönetici) dersten ayrıldı. Ders sonlandırılıyor.");
                closeLiveClassRoom();
                return;
            }

            if (data.offer && data.offer.sdp !== _appliedOfferSdp) {
                try {
                    _appliedOfferSdp = data.offer.sdp;
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
                    _remoteDescSet = true;
                    await _flushCandidates();

                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);
                    await roomRef.update({ answer: { type: answer.type, sdp: answer.sdp } });
                } catch (e) { console.warn('Teklif işlenemedi:', e); }
            }
        });

        // Öğretmenin ICE adaylarını dinle
        appState.unsubscribeIce = roomRef.collection('callerCandidates').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') _queueCandidate(change.doc.data());
            });
        });
    }
}


function renderOnlinePackages() {
    const listEl = document.getElementById('online-package-list');
    if(!listEl) return;

    let html = '';

    // 1. ÖZEL DERS SEÇENEĞİ (SABİT OLARAK EN ÜSTTE)
    const isCustomSelected = appState.selectedOnlinePackages.find(x => x.id === 100);
    const customCount = appState.customLessonCount || 0;
    const customPrice = customCount * 720;
    const customTopic = appState.customLessonTopic || '';

    html += `
    <div class="glass-card online-package-card ${isCustomSelected ? 'selected' : ''}" style="display:flex; align-items:center; flex-wrap: wrap; gap: 18px; margin-bottom: 20px; border-color: #F39C12; padding: 20px;">
        <div class="online-package-info" style="flex:1; min-width: 260px;">
            <h4 style="color: #F39C12; display: flex; align-items: center; gap: 8px; font-size: 1.35rem; margin: 0 0 12px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F39C12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                Özel Ders Talep Et
            </h4>
            <input type="text" id="custom-lesson-topic" placeholder="İstediğiniz konuyu yazınız" style="width: 100%; padding: 13px 14px; border-radius: 10px; border: 1px solid #ccc; font-size: 1.05rem; box-sizing: border-box;" value="${customTopic}" oninput="appState.customLessonTopic = this.value; this.style.border='';">
        </div>
        <div style="display: flex; align-items: center; gap: 12px; background: #f8f9fa; padding: 8px 14px; border-radius: 10px; border: 1px solid #eee;">
            <div style="font-size: 0.95rem; color: #666; text-align: right;">Ders Sayısı<br><small>(Saat)</small></div>
            <button class="btn btn-sm" style="background: #e9ecef; border: none; font-size: 1.5rem; padding: 2px 14px; border-radius:8px;" onclick="changeCustomLessonCount(-1)">-</button>
            <span id="custom-lesson-count" style="font-size: 1.4rem; font-weight: bold; width: 26px; text-align: center;">${customCount}</span>
            <button class="btn btn-sm" style="background: #e9ecef; border: none; font-size: 1.5rem; padding: 2px 14px; border-radius:8px;" onclick="changeCustomLessonCount(1)">+</button>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; justify-content:center; gap:10px; margin-left:10px;">
            <div class="online-package-price" style="min-width: 100px; text-align: right; color: #F39C12; font-size: 1.3rem; font-weight: bold;">
                <span id="custom-lesson-price">${customPrice}</span> ₺
            </div>
            <div onclick="openPackageModal('online', 100);" style="padding: 6px 14px; font-size: 0.9rem; font-weight: bold; background: rgba(243, 156, 18, 0.1); color: #F39C12; border: 1px solid rgba(243, 156, 18, 0.4); border-radius: 20px; cursor: pointer; transition: 0.2s; white-space: nowrap; text-align:center;" onmouseover="this.style.background='#F39C12'; this.style.color='white';" onmouseout="this.style.background='rgba(243, 156, 18, 0.1)'; this.style.color='#F39C12';">Detaylar</div>
        </div>
    </div>
    `;

    listEl.innerHTML = html;
}

window.changeCustomLessonCount = function(delta) {
    let count = appState.customLessonCount || 0;
    const topicEl = document.getElementById('custom-lesson-topic');
    const topic = (topicEl ? topicEl.value : (appState.customLessonTopic || '')).trim();

    // Ders sayısını artırmadan ÖNCE konu yazılmış olmalı. Boşsa kırmızı çerçeveyle uyar.
    if (delta > 0 && !topic) {
        if (topicEl) {
            topicEl.style.border = '2px solid #EF5350';
            topicEl.placeholder = 'Lütfen önce çalışmak istediğiniz konuyu yazın';
            topicEl.focus();
        }
        return;
    }
    if (topicEl) topicEl.style.border = '';

    count += delta;
    if (count < 0) count = 0;
    appState.customLessonCount = count;

    document.getElementById('custom-lesson-count').innerText = count;
    document.getElementById('custom-lesson-price').innerText = count * 720;

    // Eğer paket seçiliyse, sepet fiyatını güncelle
    const index = appState.selectedOnlinePackages.findIndex(x => x.id === 100);
    if (index > -1) {
        if (count === 0) {
            // Sıfırlandıysa paketi seçilenlerden çıkar
            appState.selectedOnlinePackages.splice(index, 1);
            renderOnlinePackages();
        } else {
            appState.selectedOnlinePackages[index].price = count * 720;
            appState.selectedOnlinePackages[index].hours = `${count} Saat Özel Ders`;
            appState.selectedOnlinePackages[index].name = `Özel Ders: ${appState.customLessonTopic || 'Belirtilmedi'}`;
        }
    } else if (count > 0) {
        // Sıfırdan yukarı çıktıysa otomatik seç
        selectCustomOnlinePackage();
    }

    updateCustomLessonTotal();
};

window.updateCustomLessonTotal = function() {
    const liveTotalEl = document.getElementById('step1-live-total');
    if (liveTotalEl) {
        const total = appState.selectedOnlinePackages.reduce((sum, p) => sum + p.price, 0);
        liveTotalEl.innerHTML = `Ara Toplam: ${total.toLocaleString('tr-TR')} ₺`;
    }
};

window.selectCustomOnlinePackage = function(el) {
    let count = appState.customLessonCount || 0;

    const index = appState.selectedOnlinePackages.findIndex(x => x.id === 100);

    if (index > -1) {
        // Eğer zaten seçiliyse çıkar
        appState.selectedOnlinePackages.splice(index, 1);
        renderOnlinePackages();
    } else {
        // Seçili değilse ekle
        if (count === 0) {
            count = 1;
            appState.customLessonCount = 1;
        }

        const topic = appState.customLessonTopic || 'Belirtilmedi';
        appState.selectedOnlinePackages.push({
            id: 100,
            name: `Özel Ders: ${topic}`,
            price: count * 720,
            hours: `${count} Saat Özel Ders`,
            desc: "İsteğe özel birebir canlı ders",
            isCustom: true
        });
        renderOnlinePackages();
    }

    updateCustomLessonTotal();
};



async function openLiveClassRoom() {
    const modal = document.getElementById('live-class-modal');
    if(modal) {
        modal.style.display = 'flex';

        // Ders penceresi TAM EKRAN açılsın
        modal.classList.remove('windowed');
        const _content0 = document.getElementById('live-modal-content');
        if (_content0) {
            _content0.classList.add('maximized');
            _content0.style.left = ''; _content0.style.top = ''; _content0.style.right = '';
        }

        // Ders açılınca sitedeki çalan ses/videoları durdur (Apple Music/başka sekme HARİÇ — tarayıcı izin vermez)
        _pausePageMedia();

        // Setup local camera first — sağlam edinim + anlaşılır hata mesajları
        let stream = null, lastErr = null;
        try {
            // KAMERA: çok düşük çözünürlük (yalnızca 'ideal' — kısıt hatası olmasın)
            stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 320 }, height: { ideal: 240 }, frameRate: { ideal: 12 } },
                audio: true
            });
        } catch (e1) {
            lastErr = e1;
            // Sade ayarla tekrar dene (kısıt sorunu olabilir)
            try { stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); lastErr = null; }
            catch (e2) {
                lastErr = e2;
                // Kamera alınamıyorsa (meşgul/yok) SADECE mikrofonla derse gir
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true }); lastErr = null;
                    showCustomAlert("Kameraya erişilemedi, derse yalnızca sesle bağlanıyorsunuz. (Kamera başka bir uygulama/sekmede açık olabilir.)");
                } catch (e3) { lastErr = e3; }
            }
        }

        if (stream) {
            appState.localStream = stream;
            try { const vt = stream.getVideoTracks()[0]; if (vt) vt.contentHint = 'motion'; } catch(e) {}

            // Eğer link ile gelmişse sesi ve görüntüyü baştan kapalı başlat
            if (appState.isInviteMode) {
                stream.getAudioTracks().forEach(track => track.enabled = false);
                stream.getVideoTracks().forEach(track => track.enabled = false);

                // İkonları da güncelleyelim (Kırmızı ve üstü çizili yapalım)
                const btnMute = document.getElementById('btn-mute');
                const btnVideo = document.getElementById('btn-video');

                const svgMicOff = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
                const svgVideoOff = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

                if(btnMute) { btnMute.innerHTML = svgMicOff; btnMute.style.background = '#EF5350'; }
                if(btnVideo) { btnVideo.innerHTML = svgVideoOff; btnVideo.style.background = '#EF5350'; }
            }

            const localVideo = document.getElementById('local-video');
            if(localVideo) {
                localVideo.srcObject = stream;
            }
        } else {
            console.error("Kamera/Mikrofon açılamadı:", lastErr);
            let msg = "Kamera ve mikrofonunuza erişilemiyor. ";
            const n = lastErr && lastErr.name;
            if (n === 'NotAllowedError' || n === 'SecurityError') {
                msg += "İzin reddedilmiş görünüyor. Adres çubuğundaki kamera simgesine tıklayıp 'İzin Ver' deyin, sonra sayfayı yenileyin.";
            } else if (n === 'NotReadableError' || n === 'AbortError' || n === 'TrackStartError') {
                msg += "Kamera/mikrofon başka bir uygulama veya sekme tarafından kullanılıyor (ör. başka bir ders/görüşme sekmesi, FaceTime, iPhone kamerası). Onları kapatıp tekrar deneyin.";
            } else if (n === 'NotFoundError' || n === 'OverconstrainedError' || n === 'DevicesNotFoundError') {
                msg += "Cihazda uygun bir kamera/mikrofon bulunamadı.";
            } else {
                msg += "Lütfen tarayıcı izinlerinizi kontrol edin.";
            }
            showCustomAlert(msg);
        }

        // Bekleme mesajını güncelle
        const waitMsg = document.getElementById('live-wait-msg');
        if (waitMsg) {
            waitMsg.innerHTML = '<p style="font-size: 1.1rem; color:#ccc;">Karşı taraf bekleniyor...</p>';
        }

        // NOT: Tarayıcının otomatik "mini pencere öner" ikonu (mediaSession enterpictureinpicture)
        // kaldırıldı — bazı ortamlarda hatalı/bozuk bir ekran ikonu olarak çıkıyordu.
        // Mini pencere artık ya alttaki düğmeyle ya da tam ekran paylaşımında otomatik açılır.
        try {
            if (navigator.mediaSession && navigator.mediaSession.setActionHandler) {
                navigator.mediaSession.setActionHandler('enterpictureinpicture', null);
            }
        } catch (e) {}

        // WebRTC bağlantısını başlat (gerçek görüntü/ses aktarımı)
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const inviteRoomId = urlParams.get('liveRoom');
            if (appState.isInviteMode && inviteRoomId) {
                // Davet linkiyle gelen: mevcut odaya katıl
                appState.activeRoomId = inviteRoomId;
                await initWebRTCRoom(inviteRoomId, false);
            } else if (appState.userRole === 'teacher' || appState.userRole === 'admin') {
                // Öğretmen/Yönetici: SABİT oda kur (davet linki hep aynı, tekrar kullanılabilir)
                if (!appState.activeRoomId) {
                    appState.activeRoomId = _stableRoomId();
                }
                await initWebRTCRoom(appState.activeRoomId, true);
            }
        } catch (e) {
            console.error('Canlı ders bağlantısı kurulamadı:', e);
        }

    }
}

function closeLiveClassRoom() {
    // ÖNCE medya/paylaşım/mini pencere temizliği — modal GİZLENMEDEN önce yapılmalı.
    // Aksi halde tarayıcı ekran paylaşımını/PiP'i tam kapatamaz ve paylaşılan pencerede
    // altta bir "paylaşımı durdur / mini pencere" kısayolu asılı kalır.
    try { if (document.pictureInPictureElement) document.exitPictureInPicture(); } catch (e) {}
    if (typeof closeLivePip === 'function') closeLivePip();
    if (typeof _stopScreenAudioMix === 'function') _stopScreenAudioMix();
    if (appState.screenStream) {
        appState.screenStream.getTracks().forEach(track => track.stop());
        appState.screenStream = null;
    }
    const _sv = document.getElementById('screen-video');
    if (_sv) { _sv.srcObject = null; _sv.style.display = 'none'; }
    const _rc = document.getElementById('live-class-room-container');
    if (_rc) _rc.classList.remove('screen-shared');
    if (typeof hideScreenShareBadge === 'function') hideScreenShareBadge();
    const _screenBtn = document.getElementById('btn-screen');
    if (_screenBtn) _screenBtn.style.background = 'rgba(32,201,151,0.8)';

    const modal = document.getElementById('live-class-modal');
    if(modal) {
        modal.style.display = 'none';
        modal.classList.remove('windowed');
        const _c = document.getElementById('live-modal-content');
        if (_c) { _c.classList.remove('maximized'); _c.style.left = ''; _c.style.top = ''; _c.style.right = ''; }
    }

    // Oda sahibi ayrılınca: odayı SİLME — sabit link tekrar kullanılabilsin diye
    // dokümanı 'closed' bırak (offer/answer temizlenir). Böylece link PASİF olur:
    // geç tıklayan "ders sonlandırıldı" görür; yönetici tekrar girince aynı oda 'active' olur.
    if (appState.isRoomHost && appState.activeRoomId && typeof db !== 'undefined' && db) {
        const rid = appState.activeRoomId;
        const rref = db.collection('rooms').doc(rid);
        rref.set({ status: 'closed', offer: null, answer: null }, { merge: true }).catch(() => {});
        _clearRoomSignaling(rref).catch(() => {}); // sinyal alt-koleksiyonlarını temizle (şişmesin)
    }

    // Firestore dinleyicilerini kapat
    ['unsubscribeChat', 'unsubscribeStatus', 'unsubscribeAnswer', 'unsubscribeIce'].forEach(k => {
        if (appState[k]) { try { appState[k](); } catch(e) {} appState[k] = null; }
    });

    // WebRTC bağlantısını kapat.
    // ÖNEMLİ: Ekran paylaşımı track'i replaceTrack ile sender'a geçmiş olabilir; bu track
    // appState.screenStream'den bağımsız yaşayabilir. Tüm sender/receiver track'lerini
    // durdurmazsak tarayıcı "bu pencereyi paylaşmayı durdur" çubuğunu asılı bırakır.
    if (peerConnection) {
        try { peerConnection.getSenders().forEach(s => { if (s && s.track) { try { s.track.stop(); } catch(e) {} } }); } catch(e) {}
        try { peerConnection.getReceivers().forEach(r => { if (r && r.track) { try { r.track.stop(); } catch(e) {} } }); } catch(e) {}
        try { peerConnection.close(); } catch(e) {}
        peerConnection = null;
    }

    // Ek güvenlik: sayfadaki video elementlerinin ekran/kamera akış referanslarını bırak
    ['screen-video', 'local-video', 'remote-video'].forEach(function(id){
        var v = document.getElementById(id);
        if (v && v.srcObject) {
            try { v.srcObject.getTracks().forEach(function(t){ try { t.stop(); } catch(e){} }); } catch(e){}
            v.srcObject = null;
        }
    });

    // Durum değişkenlerini sıfırla
    _pendingCandidates = [];
    _remoteDescSet = false;
    _appliedOfferSdp = null;
    _appliedAnswerSdp = null;
    if (_iceRestartTimer) { clearTimeout(_iceRestartTimer); _iceRestartTimer = null; }

    appState.activeRoomId = null;
    appState.isRoomHost = false;

    const remoteBox = document.getElementById('remote-box');
    if (remoteBox) remoteBox.remove();
    if (typeof hideScreenShareBadge === 'function') hideScreenShareBadge();
    if (typeof closeLivePip === 'function') closeLivePip();

    if(appState.localStream) {
        appState.localStream.getTracks().forEach(track => track.stop());
        appState.localStream = null;
    }
    if(appState.screenStream) {
        appState.screenStream.getTracks().forEach(track => track.stop());
        appState.screenStream = null;
    }

    // Davet linkiyle gelen misafir ayrıldıysa temiz sayfaya dön
    if (appState.isInviteMode) {
        window.location.href = window.location.origin + window.location.pathname;
    }
}

function toggleMute() {
    const btn = document.getElementById('btn-mute');
    if(appState.localStream) {
        const audioTrack = appState.localStream.getAudioTracks()[0];
        if(audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            const svgMicOn = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
            const svgMicOff = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
            btn.innerHTML = audioTrack.enabled ? svgMicOn : svgMicOff;
            btn.style.background = audioTrack.enabled ? 'rgba(255,255,255,0.2)' : '#EF5350';
        }
    }
}

// TÜM SESLERİ KAPAT: karşı taraftan gelen sesi (öğrenci sesini) sustur/aç
function toggleRemoteAudio() {
    appState.remoteMuted = !appState.remoteMuted;

    // Ana ekrandaki karşı taraf videosu
    const rv = document.getElementById('remote-video');
    if (rv) rv.muted = appState.remoteMuted;

    // Mini penceredeki karşı taraf videosu (açıksa)
    if (appState.pipWindow) {
        try {
            const prv = appState.pipWindow.document.getElementById('pip-remote-video');
            if (prv) prv.muted = appState.remoteMuted;
        } catch (e) {}
    }

    // Düğme görünümü (kapalıyken kırmızı ve üstü çizili hoparlör)
    const btn = document.getElementById('btn-speaker');
    if (btn) {
        const svgOn  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
        const svgOff = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
        btn.innerHTML = appState.remoteMuted ? svgOff : svgOn;
        btn.style.background = appState.remoteMuted ? '#EF5350' : 'rgba(255,255,255,0.2)';
    }
}

function toggleVideo() {
    const btn = document.getElementById('btn-video');
    if(appState.localStream) {
        const videoTrack = appState.localStream.getVideoTracks()[0];
        if(videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            const svgVideoOn = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;
            const svgVideoOff = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
            btn.innerHTML = videoTrack.enabled ? svgVideoOn : svgVideoOff;
            btn.style.background = videoTrack.enabled ? 'rgba(255,255,255,0.2)' : '#EF5350';
        }
    }
}

/* ==========================================
   MİNİ PENCERE (Picture-in-Picture)
   Ekran paylaşımında başka pencereye geçince
   ders arayüzü küçük pencerede görünür kalır
   ========================================== */
async function openLivePip() {
    // GÜVENİLİR MİNİ PENCERE: standart video Picture-in-Picture.
    // Chrome/Safari/Edge'de sağlam çalışır; başka pencere/uygulamaların ÜSTÜNDE yüzer.
    // (Kararsız Document PiP kaldırıldı — bazı ortamlarda sabitlenip uygulamayı kapatıyordu.)
    // Öncelik: PENCERE/SEKME paylaşımı açıksa paylaşılan içerik; yoksa öğrenci; o da yoksa kendi kameran.
    const screenV = document.getElementById('screen-video');
    const remoteVideo = document.getElementById('remote-video');
    const localVideo = document.getElementById('local-video');
    const vid = (screenV && screenV.srcObject && screenV.style.display !== 'none') ? screenV
              : (remoteVideo && remoteVideo.srcObject) ? remoteVideo
              : localVideo;

    // Zaten açıksa kapat (düğme aç/kapa gibi davransın)
    if (document.pictureInPictureElement) {
        try { await document.exitPictureInPicture(); } catch (e) {}
        _setPipBtnActive(false);
        return;
    }

    if (!vid || !vid.srcObject) {
        showCustomAlert('Mini pencere için henüz görüntü yok. Karşı taraf bağlanınca tekrar deneyin.');
        return;
    }

    if (!vid.requestPictureInPicture) {
        showCustomAlert('Tarayıcınız mini pencereyi desteklemiyor. Chrome, Safari veya Edge kullanın.');
        return;
    }

    try {
        try { await vid.play(); } catch (e) {}
        await vid.requestPictureInPicture();
        _setPipBtnActive(true);
        // Mini pencere kapatılınca (kullanıcı X'e basınca) düğme yeşilini geri al
        vid.addEventListener('leavepictureinpicture', function _lv() {
            _setPipBtnActive(false);
            vid.removeEventListener('leavepictureinpicture', _lv);
        }, { once: true });
    } catch (e) {
        console.warn('Mini pencere açılamadı:', e);
        showCustomAlert('Mini pencere açılamadı. Görüntü gelince tekrar deneyin.');
    }
}

// Tam ekran paylaşımında sessizce mini pencere aç (öğrenci görüntüsü üstte sabit kalsın).
// Görüntü henüz yoksa veya tarayıcı desteklemiyorsa sessizce çıkar (uyarı göstermez).
async function _autoOpenPipForShare() {
    try {
        if (document.pictureInPictureElement) return; // zaten açık
        const remoteVideo = document.getElementById('remote-video');
        const localVideo = document.getElementById('local-video');
        const vid = (remoteVideo && remoteVideo.srcObject) ? remoteVideo : localVideo;
        if (!vid || !vid.srcObject || !vid.requestPictureInPicture) return;
        try { await vid.play(); } catch (e) {}
        await vid.requestPictureInPicture();
        _setPipBtnActive(true);
        vid.addEventListener('leavepictureinpicture', function _lv() {
            _setPipBtnActive(false);
            vid.removeEventListener('leavepictureinpicture', _lv);
        }, { once: true });
    } catch (e) {
        // Tarayıcı kullanıcı hareketi ister veya reddederse: sessizce geç,
        // öğretmen alttaki mini-pencere düğmesiyle elle açabilir.
        console.warn('Otomatik mini pencere açılamadı (elle açılabilir):', e);
    }
}

// Pencere/sekme paylaşımında paylaşılan içeriği sessizce mini pencereye al
// (öğretmen pencereler arasında gezerken paylaşılan sayfayı üstte görebilsin).
async function _autoOpenSharedPip() {
    try {
        if (document.pictureInPictureElement) return; // zaten bir mini pencere açık
        const sv = document.getElementById('screen-video');
        if (!sv || !sv.srcObject || sv.style.display === 'none' || !sv.requestPictureInPicture) return;
        try { await sv.play(); } catch (e) {}
        await sv.requestPictureInPicture();
        _setPipBtnActive(true);
        sv.addEventListener('leavepictureinpicture', function _lv() {
            _setPipBtnActive(false);
            sv.removeEventListener('leavepictureinpicture', _lv);
        }, { once: true });
    } catch (e) {
        // Tarayıcı kullanıcı hareketi ister/reddederse sessizce geç; alttaki
        // mini-pencere düğmesiyle (⧉) elle açılabilir.
        console.warn('Paylaşılan içerik mini penceresi otomatik açılamadı (elle açılabilir):', e);
    }
}

function closeLivePip() {
    if (appState.pipWindow) { try { appState.pipWindow.close(); } catch(e) {} appState.pipWindow = null; }
    if (document.pictureInPictureElement) { document.exitPictureInPicture().catch(function() {}); }
    _setPipBtnActive(false);
}

// Mini pencerede paylaşılan ekran önizlemesini ekle/kaldır
// (Tüm ekran paylaşımında gösterilmez - sonsuz ayna önlemi)
function syncPipScreenTile() {
    const pip = appState.pipWindow;
    if (!pip) return;
    let doc;
    try { doc = pip.document; } catch(e) { return; }
    if (!doc) return;
    const grid = doc.getElementById('pip-participants-grid');
    if (!grid) return;

    let surface = '';
    if (appState.screenStream) {
        const t = appState.screenStream.getVideoTracks()[0];
        surface = (t && t.getSettings && t.getSettings().displaySurface) || '';
    }
    const shouldShow = !!appState.screenStream && surface !== 'monitor';
    const existing = doc.getElementById('pip-screen-tile');

    if (shouldShow && !existing) {
        const sv = doc.createElement('div');
        sv.className = 'pip-participant-video';
        sv.id = 'pip-screen-tile';
        sv.style.flex = '1 1 100%';
        sv.innerHTML = '<video id="pip-screen-video" autoplay muted playsinline style="object-fit:contain;"></video><div class="pip-label">Paylaşılan Ekran</div>';
        grid.insertBefore(sv, grid.firstChild);
        sv.querySelector('video').srcObject = appState.screenStream;
    } else if (!shouldShow && existing) {
        existing.remove();
    }

    const note = doc.getElementById('pip-share-note');
    if (note) note.style.display = appState.screenStream ? 'block' : 'none';
}

/* Sitedeki (bu sayfadaki) çalan ses/videoları durdur — ders sesiyle çakışmasın.
   NOT: Tarayıcı güvenliği gereği Apple Music uygulaması veya BAŞKA sekmeler durdurulamaz. */
function _pausePageMedia() {
    try {
        document.querySelectorAll('audio, video').forEach(function(m) {
            if (m.id === 'local-video' || m.id === 'remote-video' || m.id === 'screen-video') return;
            if (m.closest && m.closest('#live-class-modal')) return;
            if (!m.paused) { try { m.pause(); } catch(e) {} }
        });
    } catch(e) {}
}

/* Ekran/sekme sesini mikrofonla karıştırıp tek ses parçası olarak öğrenciye gönderme (Web Audio) */
let _screenAudioCtx = null;
function _startScreenAudioMix(screenStream) {
    const screenAudio = screenStream.getAudioTracks()[0];
    if (!screenAudio) return null;   // paylaşımda ses yoksa karışım yok
    try {
        _screenAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const dest = _screenAudioCtx.createMediaStreamDestination();
        // Ekran/sekme sesi
        _screenAudioCtx.createMediaStreamSource(new MediaStream([screenAudio])).connect(dest);
        // Öğretmen mikrofonu (varsa) — hem video sesi hem öğretmenin sesi öğrenciye gitsin
        const mic = appState.localStream && appState.localStream.getAudioTracks()[0];
        if (mic) _screenAudioCtx.createMediaStreamSource(new MediaStream([mic])).connect(dest);
        return dest.stream.getAudioTracks()[0];
    } catch (e) {
        console.warn('Ses karışımı kurulamadı:', e);
        _stopScreenAudioMix();
        return null;
    }
}
function _stopScreenAudioMix() {
    try { if (_screenAudioCtx) _screenAudioCtx.close(); } catch(e) {}
    _screenAudioCtx = null;
}

async function toggleScreenShare() {
    const btn = document.getElementById('btn-screen');
    const screenVideo = document.getElementById('screen-video');

    if (appState.screenStream) {
        // Durdurmadan önce onay iste (yanlışlıkla kapanmasın)
        if (typeof showCustomConfirm === 'function') {
            if (await showCustomConfirm("Ekran/pencere paylaşımını durdurmak istiyor musunuz?")) {
                stopScreenShare();
            }
        } else {
            stopScreenShare();
        }
        return;
    }

    try {
        const _newScreenStream = await navigator.mediaDevices.getDisplayMedia({
            // Video: slayt için yeterince net, video için yeterince akıcı denge.
            video: {
                width:  { max: 1600 },
                height: { max: 900 },
                frameRate: { ideal: 12, max: 30 }
            },
            // Ses: sekme/pencere sesini de yakala (video/müzik sesi öğrenciye gitsin).
            // macOS'ta Chrome paylaşılan SEKME sesini yakalar; tam ekran genelde sessizdir.
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            },
            // Sonsuz ayna önlemi 1: bu sekme, paylaşım seçenekleri arasında görünmesin
            selfBrowserSurface: 'exclude',
            surfaceSwitching: 'include',
            preferCurrentTab: false
        });

        // ÜST ÜSTE BİNMEYİ ÖNLE: yeni paylaşım geldiğinde önceki paylaşım (ve ses karışımı)
        // tamamen kapatılsın; aynı anda birden fazla ekran/pencere paylaşımı olmasın.
        if (appState.screenStream && appState.screenStream !== _newScreenStream) {
            try { appState.screenStream.getTracks().forEach(t => t.stop()); } catch (e) {}
        }
        _stopScreenAudioMix();
        appState.screenStream = _newScreenStream;

        const screenTrack = appState.screenStream.getVideoTracks()[0];
        const hasScreenAudio = appState.screenStream.getAudioTracks().length > 0;

        // İÇERİĞE GÖRE AKILLI AYAR:
        // - Ses VAR (video paylaşılıyor): akıcı olsun → hareket ipucu, yüksek kare hızı.
        // - Ses YOK (slayt/yazı): net olsun → detay ipucu, düşük kare hızı (ısı düşük).
        try { screenTrack.contentHint = hasScreenAudio ? 'motion' : 'detail'; } catch(e) {}

        // Ekran görüntüsünü karşı tarafa gönder (kamera videosunun yerine geçer)
        if (peerConnection) {
            const sender = peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
            if (sender) {
                await sender.replaceTrack(screenTrack);
                try {
                    const params = sender.getParameters();
                    if (!params.encodings || !params.encodings.length) params.encodings = [{}];
                    params.encodings[0].maxBitrate = 2500000;   // ~2.5 Mbps
                    params.encodings[0].maxFramerate = hasScreenAudio ? 24 : 5;
                    delete params.encodings[0].scaleResolutionDownBy;
                    // Video: kareyi koru (akıcı) | Slayt: çözünürlüğü koru (net)
                    params.degradationPreference = hasScreenAudio ? 'maintain-framerate' : 'maintain-resolution';
                    await sender.setParameters(params);
                } catch(e) { console.warn('Kodlayıcı sınırı uygulanamadı:', e); }
            }

            // EKRAN SESİNİ ÖĞRENCİYE GÖNDER: ekran sesi + mikrofonu karıştır, tek ses parçası gönder
            if (hasScreenAudio) {
                const mixedAudio = _startScreenAudioMix(appState.screenStream);
                if (mixedAudio) {
                    const aSender = peerConnection.getSenders().find(s => s.track && s.track.kind === 'audio');
                    if (aSender) { try { await aSender.replaceTrack(mixedAudio); } catch(e) { console.warn('Ses karışımı gönderilemedi:', e); } }
                }
            }
        }

        // Ekran paylaşımı sırasında kişi/kamera kutuları HER DURUMDA köşeye küçülsün.
        const surface = (screenTrack.getSettings && screenTrack.getSettings().displaySurface) || '';
        const roomContainer = document.getElementById('live-class-room-container');
        if (roomContainer) roomContainer.classList.add('screen-shared');
        hideScreenShareBadge(); // uyarı/aynalama yazısı gösterme

        if (surface === 'monitor') {
            // Tüm ekran: sayfa içi önizleme yok (sonsuz ayna oluşmasın) — ama kutular yine küçük kalır.
            if (screenVideo) { screenVideo.srcObject = null; screenVideo.style.display = 'none'; }
            // Öğretmen pencereler arasında gezerken canlı ders çerçevesi (öğrenci görüntüsü)
            // üstte sabit kalsın diye mini pencereyi otomatik aç (hafif standart video PiP).
            _autoOpenPipForShare();
        } else {
            // Pencere/sekme: paylaşım tam alanda görünür, katılımcılar köşede küçülür
            if (screenVideo) {
                screenVideo.srcObject = appState.screenStream;
                screenVideo.style.display = 'block';
                try { await screenVideo.play(); } catch (e) {}  // hemen görünsün
            }
            // Pencere/sekme paylaşımında paylaşılan içeriği mini pencereye al: öğretmen
            // siteden çıkıp pencereler arasında gezerken paylaşılan sayfayı üstte görebilir.
            _autoOpenSharedPip();
        }

        if (btn) btn.style.background = '#EF5350'; // aktifken kırmızı

        screenTrack.onended = () => { stopScreenShare(); };
    } catch (err) {
        console.log("Ekran paylaşımı iptal edildi veya hata oluştu.", err);
    }
}

function showScreenShareBadge() {
    if (document.getElementById('screen-share-badge')) return;
    const roomContainer = document.getElementById('live-class-room-container');
    if (!roomContainer) return;
    const badge = document.createElement('div');
    badge.id = 'screen-share-badge';
    badge.style.cssText = 'position:absolute; top:12px; left:50%; transform:translateX(-50%); z-index:15; background:rgba(32,201,151,0.95); color:#fff; padding:8px 16px; border-radius:20px; font-size:0.85rem; box-shadow:0 3px 10px rgba(0,0,0,0.4); max-width:90%; text-align:center;';
    badge.innerHTML = '🖥️ Ekranınız paylaşılıyor — karşı taraf görüyor. (Sonsuz ayna oluşmaması için önizleme kapalı)';
    roomContainer.appendChild(badge);
}

function hideScreenShareBadge() {
    const badge = document.getElementById('screen-share-badge');
    if (badge) badge.remove();
}

function stopScreenShare() {
    const btn = document.getElementById('btn-screen');
    const screenVideo = document.getElementById('screen-video');

    closeLivePip();

    if (appState.screenStream) {
        appState.screenStream.getTracks().forEach(t => t.stop());
        appState.screenStream = null;
    }

    // Karşı tarafa tekrar kamera görüntüsünü gönder
    if (peerConnection && appState.localStream) {
        const camTrack = appState.localStream.getVideoTracks()[0];
        const sender = peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
        if (sender) {
            // ÖNEMLİ: sender'daki mevcut (ekran) track'i açıkça durdur — yoksa capture
            // arkaplanda canlı kalıp tarayıcının paylaşım göstergesi asılı kalabiliyor.
            if (sender.track && sender.track !== camTrack) {
                try { sender.track.stop(); } catch (e) {}
            }
            if (camTrack) {
                sender.replaceTrack(camTrack).catch(() => {});
                _applyCamEncoding(sender); // kamerayı tekrar düşük kaliteye döndür
            }
        }
        // Ses: karışımı bırak, mikrofonu tek başına geri gönder
        const micTrack = appState.localStream.getAudioTracks()[0];
        const aSender = peerConnection.getSenders().find(s => s.track && s.track.kind === 'audio');
        if (aSender && micTrack) { aSender.replaceTrack(micTrack).catch(() => {}); }
    }
    _stopScreenAudioMix();

    hideScreenShareBadge();
    const roomContainer = document.getElementById('live-class-room-container');
    if (roomContainer) roomContainer.classList.remove('screen-shared');
    if (screenVideo) {
        screenVideo.srcObject = null;
        screenVideo.style.display = 'none';
    }
    if (btn) btn.style.background = 'rgba(32,201,151,0.8)';
}

// Yönetici/öğretmen için SABİT oda kimliği (uid tabanlı) → davet linki hep aynı kalır.
function _stableRoomId() {
    try {
        if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
            return 'ders_' + firebase.auth().currentUser.uid;
        }
    } catch (e) {}
    return 'ders_local_host';
}

function generateInviteLink() {
    // Oda henüz kurulmadıysa kur (linke tıklayan doğrudan bu odaya bağlanır)
    if (!appState.activeRoomId) {
        if (appState.userRole === 'teacher' || appState.userRole === 'admin') {
            appState.activeRoomId = _stableRoomId();
            initWebRTCRoom(appState.activeRoomId, true);
        } else {
            showCustomAlert("Davet linkini yalnızca dersi başlatan (öğretmen/yönetici) oluşturabilir.");
            return;
        }
    }
    const link = window.location.origin + window.location.pathname + "?liveRoom=" + appState.activeRoomId;
    navigator.clipboard.writeText(link).then(() => {
        showCustomAlert("Davet linki panoya kopyalandı. Paylaştığınız kişi linke tıklayınca doğrudan derse katılır:\n" + link);
    }).catch(() => {
        showCustomAlert("Link kopyalanamadı. Lütfen manuel paylaşın: " + link);
    });
}

function toggleFullScreen() {
    const modal = document.getElementById('live-class-modal');
    const content = document.getElementById('live-modal-content');
    if (!modal || !content) return;

    if (content.classList.contains('maximized')) {
        // TAM EKRANDAN ÇIK → siteden bağımsız, taşınabilir küçük pencere
        content.classList.remove('maximized');
        modal.classList.add('windowed');
        _enableLiveDrag();
    } else {
        // PENCEREDEN → TAM EKRAN
        modal.classList.remove('windowed');
        content.classList.add('maximized');
        // Taşıma sırasında verilen konumu sıfırla
        content.style.left = ''; content.style.top = ''; content.style.right = '';
    }
}

// Canlı ders penceresini başlık çubuğundan tutup taşıma (fare + dokunma)
let _liveDragBound = false;
function _enableLiveDrag() {
    if (_liveDragBound) return;
    const header = document.getElementById('live-modal-header');
    const content = document.getElementById('live-modal-content');
    const modal = document.getElementById('live-class-modal');
    if (!header || !content || !modal) return;
    _liveDragBound = true;

    let dragging = false, sx = 0, sy = 0, startLeft = 0, startTop = 0;

    header.addEventListener('pointerdown', function(e) {
        if (!modal.classList.contains('windowed')) return;         // sadece pencere modunda
        if (e.target.closest('#fullscreen-btn') || e.target.closest('[title="Kapat"]')) return; // düğmeler hariç
        dragging = true;
        const rect = content.getBoundingClientRect();
        startLeft = rect.left; startTop = rect.top;
        sx = e.clientX; sy = e.clientY;
        content.style.left = startLeft + 'px';
        content.style.top = startTop + 'px';
        content.style.right = 'auto';
        try { header.setPointerCapture(e.pointerId); } catch(_) {}
        e.preventDefault();
    });

    header.addEventListener('pointermove', function(e) {
        if (!dragging) return;
        let nl = startLeft + (e.clientX - sx);
        let nt = startTop + (e.clientY - sy);
        // Pencereyi ekran içinde tut
        nl = Math.max(0, Math.min(window.innerWidth  - 80, nl));
        nt = Math.max(0, Math.min(window.innerHeight - 40, nt));
        content.style.left = nl + 'px';
        content.style.top = nt + 'px';
    });

    function endDrag(e) { dragging = false; try { header.releasePointerCapture(e.pointerId); } catch(_) {} }
    header.addEventListener('pointerup', endDrag);
    header.addEventListener('pointercancel', endDrag);
}

function toggleSidebar(tabId) {
    const sidebar = document.getElementById('live-sidebar');
    if (!sidebar) return;

    // KÜÇÜK (windowed) pencerede sohbet/panel açılmaz — sadece kırmızı nokta bildirimi olur
    const modal = document.getElementById('live-class-modal');
    if (modal && modal.classList.contains('windowed')) return;

    const isOpen = sidebar.classList.contains('open');
    const currentTab = sidebar.getAttribute('data-tab');
    if (isOpen && currentTab === tabId) {
        sidebar.classList.remove('open');      // aynı sekmeye tekrar basınca kapat
    } else {
        sidebar.classList.add('open');         // aç (CSS: genişlik 0 → 300px)
        switchSidebarTab(tabId);
    }
    if (tabId === 'chat') _clearChatUnread();
    _updateSidebarButtons();
}

function switchSidebarTab(tabId) {
    const sidebar = document.getElementById('live-sidebar');
    if (sidebar) sidebar.setAttribute('data-tab', tabId);
    const tabParticipants = document.getElementById('sidebar-content-participants');
    const tabChat = document.getElementById('sidebar-content-chat');
    const btnParticipants = document.getElementById('tab-btn-participants');
    const btnChat = document.getElementById('tab-btn-chat');

    if (tabId === 'participants') {
        tabParticipants.style.display = 'block';
        tabChat.style.display = 'none';
        btnParticipants.classList.add('active');
        btnChat.classList.remove('active');
        populateParticipants();
    } else {
        tabParticipants.style.display = 'none';
        tabChat.style.display = 'flex';
        btnParticipants.classList.remove('active');
        btnChat.classList.add('active');
        _clearChatUnread();   // sohbet açıldı → kırmızı noktayı temizle
    }
    _updateSidebarButtons();
}

// Sohbet okunmamış mesaj bildirimi (kırmızı nokta)
function _showChatUnread() {
    const d = document.getElementById('chat-unread-dot');
    if (d) d.style.display = 'block';
}
function _clearChatUnread() {
    const d = document.getElementById('chat-unread-dot');
    if (d) d.style.display = 'none';
}

// Aktif panel düğmesini YEŞİL vurgula (sohbet veya katılımcılar açıkken)
function _updateSidebarButtons() {
    const sb = document.getElementById('live-sidebar');
    const open = !!(sb && sb.classList.contains('open'));
    const tab = sb ? sb.getAttribute('data-tab') : null;
    const green = '#20C997', normal = 'rgba(255,255,255,0.2)';
    const bc = document.getElementById('btn-chat');
    const bp = document.getElementById('btn-participants');
    if (bc) bc.style.background = (open && tab === 'chat') ? green : normal;
    if (bp) bp.style.background = (open && tab === 'participants') ? green : normal;
}

// Mini pencere düğmesini aktifken yeşil yap
function _setPipBtnActive(on) {
    const b = document.getElementById('btn-pip');
    if (b) b.style.background = on ? '#20C997' : 'rgba(255,255,255,0.2)';
}

function getLiveDisplayName() {
    if (appState.currentUserName && appState.currentUserName !== "Belirtilmedi" && appState.currentUserName !== "Öğrenci") {
        return appState.currentUserName;
    }
    return appState.isRoomHost ? "Öğretmen" : "Öğrenci";
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';

    if (appState.activeRoomId && typeof db !== 'undefined' && db) {
        // Gerçek zamanlı: Firestore'a yaz, dinleyici iki tarafta da gösterir
        db.collection('rooms').doc(appState.activeRoomId).collection('messages').add({
            sender: getLiveDisplayName(),
            text: msg,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(() => {});
    } else {
        const chatBox = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.style.cssText = 'background: rgba(22,160,133,0.2); padding: 8px 12px; border-radius: 8px; margin-left: 20px; text-align: right;';
        div.innerHTML = '<strong style="color: #16A085; font-size: 0.8rem; display:block;">Siz</strong>';
        div.appendChild(document.createTextNode(msg));
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function populateParticipants() {
    const list = document.getElementById('participants-list');
    if (!list) return;

    const myName = getLiveDisplayName();
    const myTag = appState.isRoomHost ? 'Moderatör' : 'Katılımcı';
    const liStyle = 'padding: 10px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;';
    const avStyle = 'width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;';

    let html = '<li style="' + liStyle + '">' +
        '<div style="display:flex; align-items:center; gap: 10px;">' +
            '<div style="' + avStyle + ' background: #16A085;">' + (myName.charAt(0) || 'S').toUpperCase() + '</div>' +
            '<span>' + myName + ' (Siz)</span>' +
        '</div>' +
        '<div style="color: #20C997; font-size: 0.8rem;">' + myTag + '</div>' +
    '</li>';

    if (document.getElementById('remote-box')) {
        const remoteName = appState.isRoomHost ? 'Öğrenci' : 'Öğretmen';
        html += '<li style="' + liStyle + '">' +
            '<div style="display:flex; align-items:center; gap: 10px;">' +
                '<div style="' + avStyle + ' background: #F39C12;">' + remoteName.charAt(0) + '</div>' +
                '<span>' + remoteName + '</span>' +
            '</div>' +
            '<div style="color: #aaa; font-size: 0.8rem;">Bağlı</div>' +
        '</li>';
    }

    list.innerHTML = html;
}
