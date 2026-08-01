/* ==========================================================================
   GOREV + ILERLEME KOPRUSU  —  gorevkopru.js  (v2)
   --------------------------------------------------------------------------
   Oyun sayfalarina eklenen KUCUK kopru. Iki isi vardir:

   1) SUREC KAYDI (her zaman):
      Ogretmenine BAGLI bir ogrenci bu oyunu NE ZAMAN oynarsa oynasin,
      sonuc  ogrenciIlerleme/{uid_oyun}  dokumanina islenir:
        - rekor  : bugune kadarki EN IYI yuzde
        - gecmis : rekor kirilan anlarin tarihli listesi (gelisim cizgisi)
        - oynama : toplam oynama sayisi, sonYuzde, ilk/son tarih
      Rekor kirilinca ogrenciye kucuk bir kutlama rozeti gosterilir.

   2) GOREV KAYDI (yalniz "?gorev=<id>" ile acilinca):
      Sonuc ayrica  gorevSonuc/{gorevId_ogrenciUid}  dokumanina yazilir.

   OYUN TARAFI TEK SATIR (degismedi):
     try{ if(window.KidefGorev && KidefGorev.aktif)
          KidefGorev.bildir({dogru:D, toplam:T}); }catch(e){}
     // ya da yuzde hazirsa: KidefGorev.bildir({puan:P})   (P: 0-100)

   Giris yapilmamissa / ogrenci bagli degilse kopru sessiz kalir.
   ========================================================================== */
(function () {
    'use strict';

    var KG = window.KidefGorev = window.KidefGorev || {};
    KG.aktif = false;          /* en az bir kayit kanali acik mi?           */
    KG.gorev = null;           /* gorev kipi dokumani                       */
    KG.bag = null;             /* ogrenciBaglari/{uid} (onayli ise)         */
    KG.bildir = function () { return Promise.resolve(false); };

    var gorevId = '';
    try { gorevId = (new URLSearchParams(location.search)).get('gorev') || ''; } catch (e) { }
    gorevId = String(gorevId).replace(/[^A-Za-z0-9_-]/g, '');

    /* Oyun dosya adi: ilerleme kaydinin anahtari (orn. "renkler.html"). */
    var oyunDosya = '';
    try { oyunDosya = (location.pathname.split('/').pop() || '').toLowerCase(); } catch (e) { }
    if (!oyunDosya) oyunDosya = 'bilinmeyen.html';

    var CFG = {
        apiKey: "AIzaSyBGIQPJ_Bjm5I3-QmrrGpLR5MqmG3S5F8w",
        authDomain: "kidefarapca-98f9c.firebaseapp.com",
        projectId: "kidefarapca-98f9c",
        storageBucket: "kidefarapca-98f9c.firebasestorage.app",
        messagingSenderId: "503317118211",
        appId: "1:503317118211:web:a9c8cf15b854597e0b3d36"
    };
    var SDK = 'https://www.gstatic.com/firebasejs/8.10.1/';
    var GECMIS_SINIR = 80;     /* gelisim cizgisinde tutulan en fazla nokta */

    var db = null, user = null, basZaman = Date.now(), sonYazim = 0;

    /* ------------------------------------------------ kucuk rozet (site paleti) */
    var rozetEl = null, rozetSayac = null;
    function rozet(metin, tur) {   /* tur: '' | 'hata' | 'rekor' */
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
            rozetEl.style.background =
                tur === 'hata' ? 'linear-gradient(135deg,#E74C3C,#C0392B)' :
                tur === 'rekor' ? 'linear-gradient(135deg,#20C997,#16A085)' :
                'linear-gradient(135deg,#F39C12,#D84315)';
            rozetEl.textContent = metin;
            rozetEl.style.display = 'flex';
        } catch (e) { }
    }
    function rozetGizle(gecikme) {
        if (rozetSayac) clearTimeout(rozetSayac);
        rozetSayac = setTimeout(function () { try { if (rozetEl) rozetEl.style.display = 'none'; } catch (e) { } }, gecikme || 0);
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
                if (gorevId) { rozet('Görev sayılması için siteye e-posta ile giriş yapmalısın', 'hata'); rozetGizle(6000); }
                return;
            }
            var isler = [];
            /* 1) ogrenci baglantisi (surec kaydi icin) */
            isler.push(db.collection('ogrenciBaglari').doc(u.uid).get().then(function (doc) {
                var v = (doc.exists && doc.data()) || null;
                if (v && v.durum === 'onayli' && v.ogretmenUid) KG.bag = v;
            }).catch(function () { }));
            /* 2) gorev dokumani (gorev kipi) */
            if (gorevId) {
                isler.push(db.collection('gorevler').doc(gorevId).get().then(function (doc) {
                    if (doc.exists) { KG.gorev = doc.data() || {}; KG.gorev._id = gorevId; }
                }).catch(function () { }));
            }
            return Promise.all(isler).then(function () {
                if (gorevId && !KG.gorev) { rozet('Görev bulunamadı', 'hata'); rozetGizle(6000); }
                KG.aktif = !!(KG.gorev || KG.bag);
                if (KG.aktif) KG.bildir = gonder;
                if (KG.gorev) rozet('📋 GÖREV: ' + (KG.gorev.baslik || KG.gorev.oyun || ''));
            });
        }).catch(function (e) {
            console.warn('gorevkopru:', e && (e.code || e.message));
        });
    }

    /* ------------------------------------------------ yuzde hesabi */
    function yuzdeHesapla(s) {
        var y;
        if (s && s.toplam > 0) y = Math.round(100 * (parseFloat(s.dogru) || 0) / parseFloat(s.toplam));
        else y = Math.round(parseFloat(s && s.puan) || 0);
        return Math.max(0, Math.min(100, y));
    }

    /* ------------------------------------------------ SUREC: ogrenciIlerleme */
    function ilerlemeYaz(yuzde, simdi) {
        if (!KG.bag || !db || !user) return Promise.resolve({ rekor: yuzde, kirildi: false, yok: true });
        var ref = db.collection('ogrenciIlerleme').doc(user.uid + '_' + oyunDosya.replace(/[^a-z0-9]/g, ''));
        return ref.get().then(function (doc) {
            var eski = (doc.exists && doc.data()) || {};
            var eskiRekor = parseInt(eski.rekor);
            if (!isFinite(eskiRekor)) eskiRekor = -1;
            var kirildi = yuzde > eskiRekor;
            var gecmis = Array.isArray(eski.gecmis) ? eski.gecmis.slice() : [];
            if (kirildi) {
                gecmis.push({ t: simdi, y: yuzde });
                while (gecmis.length > GECMIS_SINIR) gecmis.shift();
            }
            return ref.set({
                ogrenciUid: user.uid,
                ogretmenUid: KG.bag.ogretmenUid,
                email: user.email || '',
                ad: KG.bag.ad || '',
                oyun: oyunDosya,
                rekor: Math.max(eskiRekor, yuzde, 0),
                sonYuzde: yuzde,
                oynama: (parseInt(eski.oynama) || 0) + 1,
                gecmis: gecmis,
                ilkTarih: eski.ilkTarih || simdi,
                sonTarih: simdi
            }, { merge: true }).then(function () {
                return { rekor: Math.max(eskiRekor, yuzde, 0), kirildi: kirildi };
            });
        });
    }

    /* ------------------------------------------------ GOREV: gorevSonuc */
    function gorevYaz(yuzde, s, simdi) {
        if (!KG.gorev || !db || !user) return Promise.resolve(null);
        var g = KG.gorev;
        var ref = db.collection('gorevSonuc').doc(gorevId + '_' + user.uid);
        return ref.get().then(function (doc) {
            var eski = (doc.exists && doc.data()) || {};
            var enIyi = Math.max(yuzde, parseInt(eski.yuzde) || 0);
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
            }, { merge: true }).then(function () { return { enIyi: enIyi }; });
        });
    }

    /* ------------------------------------------------ ana bildirim */
    function gonder(s) {
        if (!KG.aktif || !db || !user) return Promise.resolve(false);
        var simdi = Date.now();
        if (simdi - sonYazim < 1500) return Promise.resolve(false);   /* cift tetiklenme kalkani */
        sonYazim = simdi;

        var yuzde = yuzdeHesapla(s);

        return Promise.all([
            ilerlemeYaz(yuzde, simdi).catch(function (e) {
                console.warn('ilerleme yazilamadi:', e && (e.code || e.message)); return null;
            }),
            gorevYaz(yuzde, s, simdi).catch(function (e) {
                console.warn('gorev sonucu yazilamadi:', e && (e.code || e.message)); return null;
            })
        ]).then(function (r) {
            var il = r[0], gv = r[1];
            if (!il && !gv) { rozet('Sonuç kaydedilemedi — internetini kontrol et', 'hata'); rozetGizle(5000); return false; }
            if (il && il.kirildi) rozet('🎉 YENİ REKOR: %' + yuzde + (gv ? ' — görev de kaydedildi' : ''), 'rekor');
            else if (il && !il.yok) rozet('✓ Kaydedildi: %' + yuzde + ' (rekorun: %' + il.rekor + ')' + (gv ? ' — görev sayıldı' : ''));
            else if (gv) rozet('✓ Görev kaydedildi: %' + yuzde + (gv.enIyi > yuzde ? ' (en iyin: %' + gv.enIyi + ')' : ''));
            rozetGizle(6000);
            return true;
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();
})();
