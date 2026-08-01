/* ==========================================================================
   GOREV KOPRUSU  —  gorevkopru.js
   --------------------------------------------------------------------------
   Oyun sayfalarina eklenen KUCUK kopru. Sayfa "?gorev=<id>" ile acilirsa:
     1) Firebase yoksa SDK'yi kendisi yukler ve oturumu okur.
     2) gorevler/{id} dokumanini getirir, ekrana kucuk bir GOREV rozeti koyar.
     3) Oyun bitiminde oyunun cagirdigi  KidefGorev.bildir({...})  ile sonucu
        gorevSonuc/{gorevId_ogrenciUid} dokumanina yazar (en iyi yuzde saklanir).

   OYUN TARAFI TEK SATIR:
     try{ if(window.KidefGorev && KidefGorev.aktif)
          KidefGorev.bildir({dogru:D, toplam:T}); }catch(e){}
     // ya da yuzde hazirsa: KidefGorev.bildir({puan:P})   (P: 0-100)

   "?gorev" yoksa kopru TAMAMEN sessizdir; oyuna hicbir etkisi olmaz.
   ========================================================================== */
(function () {
    'use strict';

    var KG = window.KidefGorev = window.KidefGorev || {};
    KG.aktif = false;
    KG.gorev = null;
    KG.bildir = function () { return Promise.resolve(false); };

    var gorevId = '';
    try { gorevId = (new URLSearchParams(location.search)).get('gorev') || ''; } catch (e) { }
    gorevId = String(gorevId).replace(/[^A-Za-z0-9_-]/g, '');
    if (!gorevId) return;                      /* gorev kipi degil -> sessiz */

    var CFG = {
        apiKey: "AIzaSyBGIQPJ_Bjm5I3-QmrrGpLR5MqmG3S5F8w",
        authDomain: "kidefarapca-98f9c.firebaseapp.com",
        projectId: "kidefarapca-98f9c",
        storageBucket: "kidefarapca-98f9c.firebasestorage.app",
        messagingSenderId: "503317118211",
        appId: "1:503317118211:web:a9c8cf15b854597e0b3d36"
    };
    var SDK = 'https://www.gstatic.com/firebasejs/8.10.1/';

    var db = null, user = null, basZaman = Date.now(), sonYazim = 0;

    /* ------------------------------------------------ kucuk rozet (site paleti) */
    var rozetEl = null;
    function rozet(metin, hata) {
        try {
            if (!rozetEl) {
                rozetEl = document.createElement('div');
                rozetEl.id = 'kidefGorevRozet';
                rozetEl.setAttribute('style',
                    'position:fixed; top:10px; left:50%; transform:translateX(-50%); z-index:99999;' +
                    'max-width:88vw; padding:7px 16px; border-radius:999px; font-family:inherit;' +
                    'font-size:14px; font-weight:700; color:#fff; box-shadow:0 4px 14px rgba(0,0,0,.25);' +
                    'display:flex; align-items:center; gap:8px; pointer-events:none; white-space:nowrap;' +
                    'overflow:hidden; text-overflow:ellipsis;');
                (document.body || document.documentElement).appendChild(rozetEl);
            }
            rozetEl.style.background = hata
                ? 'linear-gradient(135deg,#E74C3C,#C0392B)'
                : 'linear-gradient(135deg,#F39C12,#D84315)';
            rozetEl.textContent = metin;
            rozetEl.style.display = 'flex';
        } catch (e) { }
    }
    function rozetGizle(gecikme) {
        setTimeout(function () { try { if (rozetEl) rozetEl.style.display = 'none'; } catch (e) { } }, gecikme || 0);
    }

    function yukle(src) {
        return new Promise(function (res, rej) {
            var s = document.createElement('script');
            s.src = src; s.onload = res; s.onerror = rej;
            document.head.appendChild(s);
        });
    }
    function sdkHazirla() {
        if (typeof firebase !== 'undefined' && firebase.firestore) return Promise.resolve();
        return yukle(SDK + 'firebase-app.js')
            .then(function () { return yukle(SDK + 'firebase-auth.js'); })
            .then(function () { return yukle(SDK + 'firebase-firestore.js'); });
    }

    function kur() {
        sdkHazirla().then(function () {
            if (!firebase.apps.length) firebase.initializeApp(CFG);
            db = firebase.firestore();
            return new Promise(function (res) {
                var kapat = firebase.auth().onAuthStateChanged(function (u) { kapat(); res(u); });
            });
        }).then(function (u) {
            user = u;
            if (!u || u.isAnonymous || !u.email) {
                rozet('Görev sayılması için siteye e-posta ile giriş yapmalısın', true);
                rozetGizle(6000);
                return;
            }
            return db.collection('gorevler').doc(gorevId).get().then(function (doc) {
                if (!doc.exists) { rozet('Görev bulunamadı', true); rozetGizle(6000); return; }
                KG.gorev = doc.data() || {};
                KG.gorev._id = gorevId;
                KG.aktif = true;
                KG.bildir = gonder;
                rozet('📋 GÖREV: ' + (KG.gorev.baslik || KG.gorev.oyun || ''));
            });
        }).catch(function (e) {
            console.warn('gorevkopru:', e && (e.code || e.message));
        });
    }

    /* ------------------------------------------------ sonucu yaz */
    function gonder(s) {
        if (!KG.aktif || !db || !user) return Promise.resolve(false);
        var simdi = Date.now();
        if (simdi - sonYazim < 1500) return Promise.resolve(false);   /* cift tetiklenme kalkani */
        sonYazim = simdi;

        var yuzde;
        if (s && s.toplam > 0) yuzde = Math.round(100 * (parseFloat(s.dogru) || 0) / parseFloat(s.toplam));
        else yuzde = Math.round(parseFloat(s && s.puan) || 0);
        yuzde = Math.max(0, Math.min(100, yuzde));

        var g = KG.gorev || {};
        var ref = db.collection('gorevSonuc').doc(gorevId + '_' + user.uid);
        return ref.get().then(function (doc) {
            var eski = (doc.exists && doc.data()) || {};
            var enIyi = Math.max(yuzde, parseInt(eski.yuzde) || 0);
            /* Gecikme damgasi ILK tamamlanmada atilir, sonra degismez. */
            var gec = (typeof eski.gec === 'boolean') ? eski.gec
                : !!(g.sonTarih && simdi > g.sonTarih);
            return ref.set({
                gorevId: gorevId,
                ogretmenUid: g.ogretmenUid || '',
                ogrenciUid: user.uid,
                email: user.email || '',
                oyun: g.oyun || '',
                baslik: g.baslik || '',
                yuzde: enIyi,
                sonYuzde: yuzde,
                dogru: (s && s.dogru != null) ? (parseFloat(s.dogru) || 0) : null,
                toplam: (s && s.toplam != null) ? (parseFloat(s.toplam) || 0) : null,
                deneme: (parseInt(eski.deneme) || 0) + 1,
                sureSn: Math.round((simdi - basZaman) / 1000),
                gec: gec,
                bitis: simdi
            }, { merge: true }).then(function () {
                rozet(yuzde >= enIyi
                    ? '✓ Görev kaydedildi: %' + yuzde
                    : '✓ Kaydedildi: %' + yuzde + ' (en iyin: %' + enIyi + ')');
                return true;
            });
        }).catch(function (e) {
            console.warn('gorev sonucu yazilamadi:', e && (e.code || e.message));
            rozet('Sonuç kaydedilemedi — internetini kontrol et', true);
            return false;
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();
})();
