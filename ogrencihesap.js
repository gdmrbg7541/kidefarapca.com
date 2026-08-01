/* ==========================================================================
   OGRENCI HESAP SISTEMI  —  ogrencihesap.js
   --------------------------------------------------------------------------
   AKIS ("Kod bir kez -> sonra e-posta"):
     1) Ogretmen ogrenciyi ekler  -> zaten uretilen kisiye ozel kod
        (orn. TCH-4582-X8B2) buluta "davet" olarak yazilir.
     2) Ogrenci siteye E-POSTA ile kayit olur / giris yapar.
     3) Ogrenci bu kodu BIR KEZ girer -> ogretmene "istek" duser.
     4) Ogretmen onaylar -> hesap o ogrenci satirina KALICI baglanir.
     5) Bundan sonra ogrenci hep e-posta ile girer; kod bir daha sorulmaz
        ve kod tek kullanimliktir (kullanildi=true).

   E-POSTA ILE GIRIS YAPMAMIS HIC KIMSE MESAJ GONDEREMEZ.

   FIRESTORE KOLEKSIYONLARI
     davetler/{KOD}          -> ogretmenin yayinladigi davet
     ogrenciBaglari/{uid}    -> ogrencinin istegi / kalici baglantisi
     ogrenciOzet/{uid}       -> ogretmenin yazdigi, ogrenciye ozel ayna kayit
     ogrenciMesaj/{otoId}    -> ogrenciden ogretmene giden mesaj kutusu

   NOT: Bu dosya listelerim.js'e DOKUNMADAN calisir; gerekli yerlerde
   mevcut fonksiyonlari sarmalar (save, ogrenciYeniMesaj, renderSidebar...).
   ========================================================================== */

(function () {
    'use strict';

    var OH = window.OH = window.OH || {};

    var C_DAVET = 'davetler';
    var C_BAG   = 'ogrenciBaglari';
    var C_OZET  = 'ogrenciOzet';
    var C_MSG   = 'ogrenciMesaj';

    /* ---------------------------------------------------------------- 0. YARDIMCILAR */

    function fb() {
        return (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) ? firebase : null;
    }
    function oturum() {
        var f = fb();
        try { return (f && f.auth) ? f.auth().currentUser : null; } catch (e) { return null; }
    }
    function veri() {
        var f = fb();
        if (!f) return null;
        try {
            if (typeof db !== 'undefined' && db) return db;
            return f.firestore();
        } catch (e) { return null; }
    }
    function zamanDamga() {
        var f = fb();
        try { return f.firestore.FieldValue.serverTimestamp(); } catch (e) { return Date.now(); }
    }
    function esc(s) {
        if (typeof behKacis === 'function') return behKacis(s);
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
        });
    }
    function ikon(n, c) { return (typeof llIcon === 'function') ? llIcon(n, c) : ''; }

    function rol() {
        try { return (typeof appState !== 'undefined' && appState.userRole) ? appState.userRole : ''; } catch (e) { return ''; }
    }
    function ogretmenMi() { var r = rol(); return r === 'teacher' || r === 'admin'; }

    /* Girilen kodu tek bicime indirger: bosluk, farkli tire karakterleri,
       Turkce 'i/I' ve kucuk harf sorunlari burada temizlenir. */
    function kodDuzelt(s) {
        return String(s == null ? '' : s)
            .replace(/[\u2010-\u2015\u2212]/g, '-')
            .replace(/[\s\u00A0]+/g, '')
            .replace(/\u0131/g, 'i').replace(/\u0130/g, 'i')
            .toUpperCase();
    }
    OH.kodDuzelt = kodDuzelt;

    /* "TCH-4582-X8B2" -> "TCH-4582"   |   "TCH-4582" -> "TCH-4582" */
    function ogretmenKisim(k) {
        var m = /^([A-Z]{2,6}-[0-9]{3,6})/.exec(kodDuzelt(k));
        return m ? m[1] : '';
    }
    function ogretmenKoduMu(k) { return /^[A-Z]{2,6}-[0-9]{3,6}$/.test(kodDuzelt(k)); }

    /* Yeni ogrenci giris kodunun rastgele parcasi (karisan harfler yok). */
    function rastgeleParca() {
        var c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = '';
        for (var i = 0; i < 4; i++) r += c.charAt(Math.floor(Math.random() * c.length));
        return r;
    }

    /* Ogretmen panelinde "hangi sinifa eklensin?" listesi. */
    function siniflarSecenek() {
        var d = (typeof data !== 'undefined' && data) ? data : null;
        if (!d || !d.levels) return '<option value="">\u2014 s\u0131n\u0131f bulunamad\u0131 \u2014</option>';
        var sira = (d.levelOrder && d.levelOrder.length) ? d.levelOrder : Object.keys(d.levels);
        var o = ['<option value="">\u2014 seviye / s\u0131n\u0131f se\u00e7 \u2014</option>'];
        sira.forEach(function (lId) {
            var lvl = d.levels[lId];
            if (!lvl || !lvl.classes) return;
            Object.keys(lvl.classes).forEach(function (cId) {
                var cls = lvl.classes[cId] || {};
                o.push('<option value="' + esc(lId + '|||' + cId) + '">' +
                    esc(lvl.name || lId) + ' / ' + esc(cls.name || cId) + '</option>');
            });
        });
        return o.join('');
    }

    function tarihYaz(d) {
        var i = function (n) { return String(n).padStart(2, '0'); };
        return i(d.getDate()) + '.' + i(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + i(d.getHours()) + ':' + i(d.getMinutes());
    }

    /* Ogrencinin yerel oturum kaydi (listelerim.js'in bekledigi bicim). */
    function yerelOgrenci() {
        try { return JSON.parse(localStorage.getItem('logged_student') || 'null'); } catch (e) { return null; }
    }

    OH.bag = null;          // ogrenciBaglari/{uid} onbellegi
    OH.istekler = [];       // ogretmen: bekleyen istekler
    OH._kurulum = false;

    OH.bagliMi = function () { return !!(OH.bag && OH.bag.durum === 'onayli'); };
    OH.bekliyorMu = function () { return !!(OH.bag && OH.bag.durum === 'bekliyor'); };

    /* E-posta ile gercek bir oturum var mi? (anonim/misafir sayilmaz) */
    OH.epostaGirisiVar = function () {
        var u = oturum();
        return !!(u && !u.isAnonymous && u.email);
    };

    /* ================================================================ 1. OGRETMEN: DAVETLERI YAYINLA */

    /* Her ogrenci satirindaki loginCode'u buluta "davet" olarak yazar.
       Yalnizca degisenler yazilir (imza karsilastirmasi) -> gereksiz yazma olmaz. */
    OH.davetleriYayinla = function (zorla) {
        var u = oturum(), D = veri();
        if (!u || !D || !ogretmenMi()) return Promise.resolve(0);
        var d = (typeof data !== 'undefined' && data) ? data : null;
        if (!d || !d.levels) return Promise.resolve(0);

        var anahtarDepo = 'oh_yayin_' + u.uid;
        var yayin = {};
        try { yayin = JSON.parse(localStorage.getItem(anahtarDepo) || '{}'); } catch (e) { yayin = {}; }

        var tKod = localStorage.getItem('teacher_static_code') || '';
        var tAd = '';
        try {
            tAd = (typeof appState !== 'undefined' && appState.currentUserName) ? appState.currentUserName : '';
        } catch (e) { }
        if (!tAd || tAd === 'Belirtilmedi') tAd = (u.email || 'Ogretmen');

        var isler = [];
        var sira = (d.levelOrder && d.levelOrder.length) ? d.levelOrder : Object.keys(d.levels);

        sira.forEach(function (lId) {
            var lvl = d.levels[lId];
            if (!lvl || !lvl.classes) return;
            Object.keys(lvl.classes).forEach(function (cId) {
                var cls = lvl.classes[cId];
                var ogr = (cls && cls.students) || [];
                ogr.forEach(function (s, si) {
                    var kod = (s.loginCode || '').toString().trim().toUpperCase();
                    if (!kod) return;
                    var imza = [lId, cId, si, s.name || '', s.hesapUid || ''].join('~');
                    if (!zorla && yayin[kod] === imza) return;
                    yayin[kod] = imza;
                    isler.push(D.collection(C_DAVET).doc(kod).set({
                        kod: kod,
                        ogretmenUid: u.uid,
                        ogretmenAd: tAd,
                        ogretmenKod: tKod,
                        lId: lId, cId: cId, sIdx: si,
                        ad: s.name || '',
                        seviyeAd: lvl.name || '',
                        sinifAd: (cls.name || cId),
                        kullanildi: !!s.hesapUid,
                        ogrenciUid: s.hesapUid || null,
                        guncelleme: Date.now()
                    }, { merge: true }));
                });
            });
        });

        if (!isler.length) return Promise.resolve(0);
        return Promise.all(isler).then(function () {
            try { localStorage.setItem(anahtarDepo, JSON.stringify(yayin)); } catch (e) { }
            return isler.length;
        }).catch(function (e) {
            OH._sonYayinHata = (e && (e.code || e.message)) || 'bilinmeyen';
            console.warn('OH davet yayini:', OH._sonYayinHata,
                '\u2192 konsola OH.tani() yaz\u0131p sebebi g\u00f6rebilirsin.');
            return 0;
        });
    };

    /* ---------------------------------------------------------------- 1b. OGRETMEN KODU DAVETI

       Ogretmenin SABIT kodu (orn. TCH-4582) da bir davet dokumani olarak
       yayinlanir. Boylece ogrenci kisisel kodunu bilmese/kaybetse bile
       dogrudan ogretmen kodunu girip istek gonderebilir.
       Bu dokumanda lId/cId/sIdx YOKTUR; ogretmen onaylarken sinifi secer
       ve ogrenci satiri o an olusturulur.                                    */
    OH.ogretmenDavetiYayinla = function (zorla) {
        var u = oturum(), D = veri();
        if (!u || !D || !ogretmenMi()) return Promise.resolve('');
        var kod = kodDuzelt(OH.ogretmenKodu());
        if (!kod) return Promise.resolve('');

        var tAd = '';
        try { tAd = (typeof appState !== 'undefined' && appState.currentUserName) ? appState.currentUserName : ''; } catch (e) { }
        if (!tAd || tAd === 'Belirtilmedi') tAd = (u.email || '\u00d6\u011fretmen');

        var anahtar = 'oh_tkod_' + u.uid;
        try { if (!zorla && localStorage.getItem(anahtar) === kod + '~' + tAd) return Promise.resolve(kod); } catch (e) { }

        return D.collection(C_DAVET).doc(kod).set({
            kod: kod,
            tur: 'ogretmen',
            ogretmenUid: u.uid,
            ogretmenAd: tAd,
            ogretmenKod: kod,
            guncelleme: Date.now()
        }, { merge: true }).then(function () {
            try { localStorage.setItem(anahtar, kod + '~' + tAd); } catch (e) { }
            OH._sonYayinHata = '';
            return kod;
        }).catch(function (e) {
            OH._sonYayinHata = (e && (e.code || e.message)) || 'bilinmeyen';
            console.warn('OH \u00f6\u011fretmen kodu daveti yay\u0131nlanamad\u0131:', OH._sonYayinHata,
                '\u2192 konsola OH.tani() yaz\u0131p sebebi g\u00f6rebilirsin.');
            return '';
        });
    };

    /* ================================================================ 2. OGRETMEN: OGRENCI AYNA KAYITLARI */

    /* Onayli her ogrenci icin ogrenciOzet/{uid} yazar.
       Ogrenci ogretmenin ana verisini (kullanicilar/{ogretmenUid}.userData)
       ASLA okuyamaz; yalnizca kendi dilimini gorur. */
    OH.ozetleriYaz = function () {
        var u = oturum(), D = veri();
        if (!u || !D || !ogretmenMi()) return Promise.resolve(0);
        var d = (typeof data !== 'undefined' && data) ? data : null;
        if (!d || !d.levels) return Promise.resolve(0);

        var mesajlar = (Array.isArray(d.mesajlar) ? d.mesajlar : []);
        var isler = [];
        var tAd = '';
        try { tAd = (typeof appState !== 'undefined' && appState.currentUserName) ? appState.currentUserName : (u.email || ''); } catch (e) { tAd = u.email || ''; }

        Object.keys(d.levels).forEach(function (lId) {
            var lvl = d.levels[lId];
            if (!lvl || !lvl.classes) return;
            Object.keys(lvl.classes).forEach(function (cId) {
                var cls = lvl.classes[cId];
                var ogr = (cls && cls.students) || [];
                ogr.forEach(function (s, si) {
                    if (!s || !s.hesapUid) return;
                    var K = lId + '|' + cId + '|' + si;
                    /* Yalnizca bu ogrenciye gelen mesajlar + kendi cevaplari */
                    var benim = mesajlar.filter(function (m) {
                        return (m.hedef || []).indexOf(K) > -1;
                    }).map(function (m) {
                        return {
                            id: m.id, baslik: m.baslik || '', metin: m.metin || '',
                            tarih: m.tarih || '', ts: m.ts || 0,
                            gonderen: m.gonderen || 'ogretmen',
                            etiket: m.etiket || '',
                            hedef: [K],
                            okuyan: (m.okuyan || []).indexOf(K) > -1 ? [K] : [],
                            ozel: !!m.ozel,
                            cevaplar: (m.cevaplar || []).filter(function (c) { return c.k === K; })
                        };
                    });
                    isler.push(D.collection(C_OZET).doc(s.hesapUid).set({
                        ogretmenUid: u.uid,
                        ogretmenAd: tAd,
                        ogrenciUid: s.hesapUid,
                        lId: lId, cId: cId, sIdx: si,
                        ad: s.name || '',
                        seviyeAd: lvl.name || '',
                        sinifAd: (cls.name || cId),
                        odev: s.hw || [],
                        sinav: s.ex || [],
                        beceri: s.skills || {},
                        gorevler: s.personalMissions || [],
                        mesajlar: benim,
                        guncelleme: Date.now()
                    }, { merge: true }));
                });
            });
        });

        if (!isler.length) return Promise.resolve(0);
        return Promise.all(isler).then(function () { return isler.length; })
            .catch(function (e) { console.warn('OH ozet yazimi:', e && (e.code || e.message)); return 0; });
    };

    /* save() sonrasi tek seferde (gecikmeli) calisir. */
    var _kayitZaman = null;
    OH.kaydetSonrasi = function () {
        if (!ogretmenMi() || !oturum()) return;
        if (_kayitZaman) clearTimeout(_kayitZaman);
        _kayitZaman = setTimeout(function () {
            _kayitZaman = null;
            OH.davetleriYayinla();
            OH.ozetleriYaz();
        }, 1500);
    };

    /* ================================================================ 3. OGRETMEN: BEKLEYEN ISTEKLER */

    OH._istekAbone = null;

    OH.istekleriDinle = function () {
        var u = oturum(), D = veri();
        if (!u || !D || !ogretmenMi()) return;
        if (OH._istekAbone) { try { OH._istekAbone(); } catch (e) { } OH._istekAbone = null; }
        try {
            OH._istekAbone = D.collection(C_BAG)
                .where('ogretmenUid', '==', u.uid)
                .where('durum', '==', 'bekliyor')
                .onSnapshot(function (snap) {
                    OH.istekler = [];
                    snap.forEach(function (doc) {
                        var v = doc.data() || {};
                        v._id = doc.id;
                        OH.istekler.push(v);
                    });
                    OH.rozetGuncelle();
                    var g = document.getElementById('ohIstekGovde');
                    if (g && document.getElementById('ohIstekModal') &&
                        document.getElementById('ohIstekModal').style.display !== 'none') OH.istekCiz();
                }, function (e) { console.warn('OH istek dinleyici:', e && (e.code || e.message)); });
        } catch (e) { console.warn('OH istek dinleyici kurulamadi', e); }
    };

    OH.rozetGuncelle = function () {
        var n = OH.istekler.length;
        var b = document.getElementById('ohIstekTus');
        if (!b) return;
        var r = document.getElementById('ohIstekRozet');
        if (r) {
            r.textContent = n ? String(n) : '';
            r.style.display = n ? 'inline-flex' : 'none';
        }
        b.style.display = 'flex';
    };

    /* Sidebar'a "Bekleyen Istekler" tusunu yerlestirir. */
    OH.tusYerlestir = function () {
        if (!ogretmenMi()) return;
        var nav = document.getElementById('levelNav');
        if (!nav || document.getElementById('ohIstekTus')) return;
        var b = document.createElement('button');
        b.id = 'ohIstekTus';
        b.type = 'button';
        b.title = 'Hesabini baglamak isteyen ogrenciler';
        b.setAttribute('style',
            'display:flex; align-items:center; justify-content:center; gap:8px; width:calc(100% - 10px);' +
            'margin:0 5px 12px 5px; padding:9px 10px; border-radius:9px; cursor:pointer;' +
            'background:#fff; color:#B34700; border:1px solid #F0DACA;' +
            'box-shadow:0 1px 3px rgba(216,67,21,.07); font-family:inherit; font-size:.82rem; font-weight:700;');
        b.innerHTML = ikon('kullanici') + '<span>Bekleyen İstekler</span>' +
            '<span id="ohIstekRozet" style="display:none; align-items:center; justify-content:center;' +
            'min-width:20px; height:20px; padding:0 6px; border-radius:10px; background:#E74C3C; color:#fff;' +
            'font-size:.72rem; line-height:20px;"></span>';
        b.onclick = function () { OH.istekPaneliAc(); };
        /* Yeni yeri: SOL SUTUN kabi (#teacher-code-display) — ogretmen kodunun
           hemen altina. Kap yoksa eski davranis (levelNav) surer. */
        var kap = document.getElementById('teacher-code-display') || nav;
        var kod = kap.querySelector('.teacher-code-area') || nav.querySelector('.teacher-code-area');
        if (kod && kod.parentNode) kod.parentNode.insertBefore(b, kod.nextSibling);
        else kap.appendChild(b);
        OH.rozetGuncelle();
    };

    function istekKatman() {
        var k = document.getElementById('ohIstekModal');
        if (k) return k;
        k = document.createElement('div');
        k.id = 'ohIstekModal';
        k.setAttribute('style',
            'display:none; position:fixed; inset:0; z-index:10050; background:rgba(0,0,0,.55);' +
            'backdrop-filter:blur(4px); align-items:center; justify-content:center; padding:16px;');
        k.innerHTML =
            '<div style="background:#fff; width:100%; max-width:640px; max-height:86vh; border-radius:18px;' +
            'overflow:hidden; display:flex; flex-direction:column; box-shadow:0 18px 46px rgba(0,0,0,.35);">' +
            '<div style="background:linear-gradient(135deg,#F39C12 0%,#E67E22 48%,#D84315 100%); color:#fff;' +
            'padding:14px 18px; display:flex; align-items:center; justify-content:space-between;">' +
            '<strong style="font-size:1.02rem;">Hesap Bağlama İstekleri</strong>' +
            '<span id="ohIstekKapat" style="cursor:pointer; font-size:26px; line-height:1;">&times;</span></div>' +
            '<div id="ohIstekGovde" style="flex:1; overflow-y:auto; padding:16px; background:#FFF8F2;"></div>' +
            '</div>';
        document.body.appendChild(k);
        k.querySelector('#ohIstekKapat').onclick = function () { OH.istekPaneliKapat(); };
        return k;
    }

    OH.istekPaneliAc = function () {
        var k = istekKatman();
        OH.istekCiz();
        k.style.display = 'flex';
    };
    OH.istekPaneliKapat = function () {
        var k = document.getElementById('ohIstekModal');
        if (k) k.style.display = 'none';
    };

    OH.istekCiz = function () {
        var g = document.getElementById('ohIstekGovde');
        if (!g) return;
        if (!OH.istekler.length) {
            g.innerHTML =
                '<div style="text-align:center; padding:34px 12px; color:#8B6A57;">' +
                '<div style="opacity:.5;">' + ikon('kullanici', 'lli-xxl') + '</div>' +
                '<p style="margin:14px 0 6px; font-size:1rem;">Bekleyen istek yok.</p>' +
                '<p style="margin:0; font-size:.86rem; color:#A6836E;">Öğrenciniz e-posta ile kayıt olup kendi ' +
                'giriş kodunu girdiğinde isteği burada görünür.</p></div>';
            return;
        }
        g.innerHTML = OH.istekler.map(function (it) {
            /* Ogretmen koduyla gelen istekte ogrenci satiri hensuz yok:
               ogretmen once sinifi secer, satir onayda olusur. */
            var yeniMi = (it.tur === 'ogretmen' || !it.lId);
            var secim = !yeniMi ? '' :
                '<div style="margin:0 0 10px; padding:9px 10px; background:#FFF6EC; border:1px dashed #F0C9A6;' +
                'border-radius:10px;">' +
                '<div style="font-size:.78rem; color:#A6836E; margin-bottom:5px;">Bu \u00f6\u011frenci ' +
                '<b>\u00f6\u011fretmen kodunu</b> kulland\u0131 \u2014 hangi s\u0131n\u0131fa eklensin?</div>' +
                '<select id="ohSinifSec_' + esc(it._id) + '" style="width:100%; box-sizing:border-box; padding:9px;' +
                'border:1px solid #E8A87C; border-radius:9px; font-family:inherit; font-size:.88rem;' +
                'color:#B34700; background:#fff;">' + siniflarSecenek() + '</select></div>';
            return '' +
                '<div style="background:#fff; border:1px solid #F3E2D3; border-radius:13px; padding:13px 15px;' +
                'margin-bottom:11px; box-shadow:0 2px 7px rgba(216,67,21,.06);">' +
                '<div style="font-size:1rem; color:#9C3B0C; margin-bottom:3px;">' + esc(it.ad || 'Öğrenci') + '</div>' +
                '<div style="font-size:.84rem; color:#6B4A38; margin-bottom:2px;">' + esc(it.email || '') + '</div>' +
                '<div style="font-size:.79rem; color:#A6836E; margin-bottom:10px;">' +
                esc(it.seviyeAd || '') + (it.sinifAd ? ' / ' + esc(it.sinifAd) : '') +
                ' &nbsp;·&nbsp; Kod: ' + esc(it.kod || '') + '</div>' +
                secim +
                '<div style="display:flex; gap:8px;">' +
                '<button type="button" onclick="OH.istekOnayla(\'' + esc(it._id) + '\')" ' +
                'style="flex:1; padding:9px; border:none; border-radius:9px; cursor:pointer; font-family:inherit;' +
                'font-weight:700; color:#fff; background:linear-gradient(135deg,#20C997,#16A085);">Onayla</button>' +
                '<button type="button" onclick="OH.istekReddet(\'' + esc(it._id) + '\')" ' +
                'style="padding:9px 16px; border:1px solid #F0DACA; border-radius:9px; cursor:pointer;' +
                'font-family:inherit; font-weight:700; color:#B34700; background:#fff;">Reddet</button>' +
                '</div></div>';
        }).join('');
    };

    /* Onay: hesap ogrenci satirina kalici baglanir, kod tuketilir. */
    OH.istekOnayla = function (uid) {
        var u = oturum(), D = veri();
        if (!u || !D) return;
        var it = OH.istekler.filter(function (x) { return x._id === uid; })[0];
        if (!it) return;

        var d = (typeof data !== 'undefined' && data) ? data : null;
        var satir = null;

        /* --- OGRETMEN KODUYLA gelen istek: ogrenci satiri henuz YOK.
               Ogretmen paneldeki listeden sinifi secer, satir burada acilir
               ve kisiye ozel kod (TCH-4582-XXXX) o an uretilir.          --- */
        if (it.tur === 'ogretmen' || !it.lId) {
            var sec = document.getElementById('ohSinifSec_' + it._id);
            var deg = (sec && sec.value) || '';
            if (!deg) { alert('\u00d6nce \u00f6\u011frencinin eklenece\u011fi seviye/s\u0131n\u0131f\u0131 se\u00e7.'); return; }
            var pr = deg.split('|||'), nlId = pr[0], ncId = pr[1], ncls = null;
            try { ncls = d.levels[nlId].classes[ncId]; } catch (e) { ncls = null; }
            if (!ncls) { alert('Se\u00e7ilen s\u0131n\u0131f bulunamad\u0131.'); return; }
            if (!Array.isArray(ncls.students)) ncls.students = [];

            var tKod = kodDuzelt(OH.ogretmenKodu() || 'TCH');
            var yeniKod = tKod + '-' + rastgeleParca();
            var yeniSatir = {
                name: it.ad || it.email || '\u00d6\u011frenci',
                loginCode: yeniKod,
                hw: [], ex: [], history: [], personalMissions: [],
                skills: { 'Konu\u015fma': 5, 'Yazma': 5, 'Okuma': 5, 'Vezin': 5, 'S\u00f6zl\u00fck': 5, 'Terc\u00fcme': 5 },
                notes: ''
            };
            ncls.students.push(yeniSatir);
            satir = yeniSatir;
            it.lId = nlId; it.cId = ncId; it.sIdx = ncls.students.length - 1;
            it.kod = yeniKod;
            it.seviyeAd = (d.levels[nlId] && d.levels[nlId].name) || nlId;
            it.sinifAd = (ncls.name || ncId);
            it.tur = 'ogrenci';
        } else {
            try { satir = d.levels[it.lId].classes[it.cId].students[it.sIdx]; } catch (e) { satir = null; }
        }

        /* Koordinat kaymissa kodla yeniden bul (ogrenci silinip eklenmis olabilir). */
        if (!satir || (satir.loginCode || '').toUpperCase() !== (it.kod || '').toUpperCase()) {
            var bulundu = null;
            try {
                Object.keys(d.levels).forEach(function (lId) {
                    var lvl = d.levels[lId];
                    if (!lvl || !lvl.classes || bulundu) return;
                    Object.keys(lvl.classes).forEach(function (cId) {
                        if (bulundu) return;
                        var ogr = (lvl.classes[cId].students) || [];
                        for (var i = 0; i < ogr.length; i++) {
                            if ((ogr[i].loginCode || '').toUpperCase() === (it.kod || '').toUpperCase()) {
                                bulundu = { s: ogr[i], lId: lId, cId: cId, sIdx: i };
                                return;
                            }
                        }
                    });
                });
            } catch (e) { }
            if (!bulundu) {
                alert('Bu koda ait öğrenci satırı listenizde bulunamadı. Öğrenci silinmiş olabilir.');
                return;
            }
            satir = bulundu.s; it.lId = bulundu.lId; it.cId = bulundu.cId; it.sIdx = bulundu.sIdx;
        }

        satir.hesapUid = uid;
        satir.hesapEmail = it.email || '';
        if (typeof save === 'function') save();

        var tAdO = '';
        try { tAdO = (typeof appState !== 'undefined' && appState.currentUserName) ? appState.currentUserName : ''; } catch (e) { }
        if (!tAdO || tAdO === 'Belirtilmedi') tAdO = (u.email || '\u00d6\u011fretmen');

        var yaz = [
            D.collection(C_BAG).doc(uid).set({
                durum: 'onayli', lId: it.lId, cId: it.cId, sIdx: it.sIdx,
                kod: it.kod, tur: 'ogrenci',
                seviyeAd: it.seviyeAd || '', sinifAd: it.sinifAd || '',
                onayTarih: zamanDamga()
            }, { merge: true }),
            /* TAM alanlarla yaziyoruz: davet dokumani yeni olusuyorsa
               kurallar "create" icin ogretmenUid alanini zorunlu kilar. */
            D.collection(C_DAVET).doc(it.kod).set({
                kod: it.kod,
                ogretmenUid: u.uid,
                ogretmenAd: tAdO,
                ogretmenKod: kodDuzelt(OH.ogretmenKodu() || ''),
                lId: it.lId, cId: it.cId, sIdx: it.sIdx,
                ad: satir.name || '',
                seviyeAd: it.seviyeAd || '',
                sinifAd: it.sinifAd || '',
                kullanildi: true, ogrenciUid: uid, guncelleme: Date.now()
            }, { merge: true })
        ];
        Promise.all(yaz).then(function () {
            return OH.ozetleriYaz();
        }).then(function () {
            OH.istekCiz();
        }).catch(function (e) {
            alert('Onay kaydedilemedi: ' + (e && (e.message || e.code)));
        });
    };

    OH.istekReddet = function (uid) {
        var D = veri();
        if (!D) return;
        var devam = function () {
            D.collection(C_BAG).doc(uid).set({ durum: 'red', onayTarih: zamanDamga() }, { merge: true })
                .then(function () { OH.istekCiz(); })
                .catch(function (e) { alert('İşlem yapılamadı: ' + (e && (e.message || e.code))); });
        };
        /* Site tasarimli onay penceresi (listelerim.js yuklu degilse ham confirm) */
        if (typeof window.llOnay === 'function') window.llOnay('Bu isteği reddetmek istediğinize emin misiniz?', devam, { evet: 'Reddet' });
        else if (confirm('Bu isteği reddetmek istediğinize emin misiniz?')) devam();
    };

    /* ================================================================ 4. OGRETMEN: UZAKTAN GELEN OGRENCI MESAJLARI */

    OH._msgAbone = null;

    OH.mesajlariDinle = function () {
        var u = oturum(), D = veri();
        if (!u || !D || !ogretmenMi()) return;
        if (OH._msgAbone) { try { OH._msgAbone(); } catch (e) { } OH._msgAbone = null; }
        try {
            OH._msgAbone = D.collection(C_MSG)
                .where('ogretmenUid', '==', u.uid)
                .where('islendi', '==', false)
                .onSnapshot(function (snap) {
                    if (snap.empty) return;
                    var d = (typeof data !== 'undefined' && data) ? data : null;
                    if (!d) return;
                    if (!Array.isArray(d.mesajlar)) d.mesajlar = [];
                    var eklendi = 0, kapat = [];
                    snap.forEach(function (doc) {
                        var v = doc.data() || {};
                        var K = v.lId + '|' + v.cId + '|' + v.sIdx;
                        /* Ayni mesaj iki kez islenmesin */
                        var varMi = d.mesajlar.some(function (m) { return m.id === 'B' + doc.id; });
                        if (!varMi) {
                            var t = new Date(v.ts || Date.now());
                            d.mesajlar.push({
                                id: 'B' + doc.id,
                                kapsam: { tur: 'ogrenci', lId: v.lId, cId: v.cId, si: v.sIdx },
                                etiket: 'Öğrenciden mesaj',
                                baslik: '',
                                metin: String(v.metin || '').slice(0, 1000),
                                ts: v.ts || Date.now(),
                                tarih: v.tarih || tarihYaz(t),
                                gonderen: 'ogrenci',
                                ad: v.ad || 'Öğrenci',
                                ozel: true,
                                ogretmenOkudu: false,
                                hedef: [K],
                                okuyan: [K],
                                cevaplar: []
                            });
                            eklendi++;
                        }
                        kapat.push(doc.ref.set({ islendi: true }, { merge: true }));
                    });
                    if (eklendi && typeof save === 'function') save();
                    if (eklendi) {
                        try { if (typeof imCiz === 'function') imCiz(); } catch (e) { }
                        try { if (typeof duyuruSayacGuncelle === 'function') duyuruSayacGuncelle(); } catch (e) { }
                    }
                    Promise.all(kapat).catch(function () { });
                }, function (e) { console.warn('OH mesaj dinleyici:', e && (e.code || e.message)); });
        } catch (e) { console.warn('OH mesaj dinleyici kurulamadi', e); }
    };

    /* ================================================================ 5. OGRENCI: KOD GIRME EKRANI */

    function kodKatman() {
        var k = document.getElementById('ohKodModal');
        if (k) return k;
        k = document.createElement('div');
        k.id = 'ohKodModal';
        k.setAttribute('style',
            'display:none; position:fixed; inset:0; z-index:10060; background:rgba(0,0,0,.6);' +
            'backdrop-filter:blur(5px); align-items:center; justify-content:center; padding:16px;');
        k.innerHTML =
            '<div style="background:#fff; width:100%; max-width:470px; border-radius:20px; overflow:hidden;' +
            'box-shadow:0 18px 46px rgba(0,0,0,.4);">' +
            '<div style="background:linear-gradient(135deg,#F39C12 0%,#E67E22 48%,#D84315 100%); color:#fff;' +
            'padding:16px 20px; display:flex; align-items:center; justify-content:space-between;">' +
            '<strong style="font-size:1.05rem;">Sınıfıma Katıl</strong>' +
            '<span id="ohKodKapat" style="cursor:pointer; font-size:26px; line-height:1;">&times;</span></div>' +
            '<div id="ohKodGovde" style="padding:20px; background:#FFF8F2;"></div></div>';
        document.body.appendChild(k);
        k.querySelector('#ohKodKapat').onclick = function () { OH.kodModalKapat(); };
        return k;
    }

    OH.kodModalAc = function () {
        var k = kodKatman();
        OH.kodCiz();
        k.style.display = 'flex';
    };
    OH.kodModalKapat = function () {
        var k = document.getElementById('ohKodModal');
        if (k) k.style.display = 'none';
    };

    OH.kodCiz = function (mesaj, hataMi) {
        var g = document.getElementById('ohKodGovde');
        if (!g) return;

        if (!OH.epostaGirisiVar()) {
            g.innerHTML =
                '<p style="margin:0 0 14px; color:#6B4A38; line-height:1.6;">Öğretmeninin sınıfına katılmak için ' +
                'önce <b>e-posta ile giriş</b> yapmalısın. E-posta ile giriş yapmadan mesaj gönderemezsin.</p>' +
                '<button type="button" onclick="OH.kodModalKapat(); if(typeof showLoginModal===\'function\') showLoginModal();" ' +
                'style="width:100%; padding:13px; border:none; border-radius:12px; cursor:pointer; font-family:inherit;' +
                'font-weight:700; color:#fff; background:linear-gradient(135deg,#20C997,#16A085);">Giriş Yap / Kayıt Ol</button>';
            return;
        }

        if (OH.bagliMi()) {
            g.innerHTML =
                '<div style="text-align:center; padding:10px 0 4px;">' + ikon('onay', 'lli-xxl') + '</div>' +
                '<p style="margin:12px 0 6px; text-align:center; color:#16A085; font-size:1.05rem;">Hesabın bağlı.</p>' +
                '<p style="margin:0 0 16px; text-align:center; color:#6B4A38; font-size:.9rem;">' +
                esc(OH.bag.seviyeAd || '') + (OH.bag.sinifAd ? ' / ' + esc(OH.bag.sinifAd) : '') +
                '<br>Öğretmenin: ' + esc(OH.bag.ogretmenAd || '') + '</p>' +
                '<p style="margin:0; text-align:center; color:#A6836E; font-size:.83rem;">Bundan sonra sadece ' +
                'e-posta ile giriş yapman yeterli; kod bir daha sorulmaz.</p>';
            return;
        }

        /* Sinif ARSIVDE: ogretmen geri yukleyince otomatik baglanir. */
        if (OH.bag && OH.bag.durum === 'arsiv') {
            g.innerHTML =
                '<div style="text-align:center; padding:10px 0 4px; font-size:2rem;">🗄</div>' +
                '<p style="margin:12px 0 6px; text-align:center; color:#B34700; font-size:1.05rem;">Sınıfın arşive kaldırıldı</p>' +
                '<p style="margin:0 0 6px; text-align:center; color:#6B4A38; font-size:.9rem;">Öğretmenin ' +
                esc(OH.bag.ogretmenAd || '') + ' sınıfını arşive aldı. Sınıf geri yüklendiğinde hesabın ' +
                'kendiliğinden yeniden bağlanır; bir şey yapman gerekmez.</p>' +
                '<p style="margin:14px 0 0; text-align:center; color:#A6836E; font-size:.82rem;">Kodun: ' +
                esc(OH.bag.kod || '') + '</p>';
            return;
        }

        if (OH.bekliyorMu()) {
            g.innerHTML =
                '<div style="text-align:center; padding:10px 0 4px;">' + ikon('bekle', 'lli-xxl') + '</div>' +
                '<p style="margin:12px 0 6px; text-align:center; color:#B34700; font-size:1.05rem;">Onay bekleniyor</p>' +
                '<p style="margin:0 0 6px; text-align:center; color:#6B4A38; font-size:.9rem;">İsteğin ' +
                esc(OH.bag.ogretmenAd || 'öğretmenine') + ' iletildi. Onaylandığında sınıfın açılır.</p>' +
                '<p style="margin:14px 0 0; text-align:center; color:#A6836E; font-size:.82rem;">Kod: ' +
                esc(OH.bag.kod || '') + '</p>';
            return;
        }

        /* Sinif SILINMISSE: eski bag 'kopuk' — ogrenci hala ogrencidir,
           yeni (veya ayni) kodla yeniden baglanabilir. */
        var kopukNot = (OH.bag && OH.bag.durum === 'kopuk')
            ? '<div style="margin:0 0 12px; padding:10px 12px; background:#FDEDEC; border:1px solid #F5B7B1;' +
              'border-radius:10px; color:#943126; font-size:.85rem; line-height:1.5;">⚠️ Önceki sınıfın öğretmenin ' +
              'tarafından kaldırıldı. Öğrenciliğin ve geçmiş sonuçların duruyor; öğretmenin seni yeni sınıfa ' +
              'ekleyince aynı kodla ya da vereceği yeni kodla tekrar bağlanabilirsin.</div>'
            : '';
        g.innerHTML = kopukNot +
            '<p style="margin:0 0 6px; color:#6B4A38; line-height:1.6;">Öğretmeninin sana verdiği kodu buraya ' +
            '<b>bir kez</b> gir. Öğretmenin onayladıktan sonra bu kod bir daha sorulmaz; ' +
            'her zaman e-posta ile giriş yaparsın.</p>' +
            '<p style="margin:0 0 14px; color:#A6836E; font-size:.82rem;">İki kod da geçerlidir: sana özel kod ' +
            '(örn. <b>TCH-4582-X8B2</b>) ya da öğretmeninin kodu (örn. <b>TCH-4582</b>).</p>' +
            '<input type="text" id="ohKodGiris" maxlength="40" placeholder="ÖĞRETMEN KODUN" autocomplete="off" ' +
            'style="width:100%; box-sizing:border-box; padding:14px; border:1px solid #E8A87C; border-radius:12px;' +
            'font-family:inherit; font-size:1.05rem; letter-spacing:1px; text-transform:uppercase; text-align:center;' +
            'color:#B34700; background:#fff;">' +
            '<p id="ohKodNot" style="min-height:18px; margin:9px 0; font-size:.85rem; color:' +
            (hataMi ? '#E74C3C' : '#16A085') + ';">' + esc(mesaj || '') + '</p>' +
            '<button type="button" id="ohKodTus" ' +
            'style="width:100%; padding:13px; border:none; border-radius:12px; cursor:pointer; font-family:inherit;' +
            'font-weight:700; font-size:1rem; color:#fff;' +
            'background:linear-gradient(135deg,#F39C12,#D84315);">İstek Gönder</button>';

        var inp = document.getElementById('ohKodGiris');
        var tus = document.getElementById('ohKodTus');
        if (tus) tus.onclick = function () { OH.kodGonder(); };
        if (inp) {
            inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); OH.kodGonder(); } };
            setTimeout(function () { try { inp.focus(); } catch (e) { } }, 60);
        }
    };

    /* Cekirdek: verilen kodla ogretmene istek gonderir. ARAYUZDEN BAGIMSIZ;
       hem kod penceresi (kodGonder) hem kayit formundan kalan bekleyen kod
       (bekleyenKoduIsle) bunu kullanir.
       Donen deger: { ok:true }  ya da  { ok:false, mesaj:'...' }            */
    OH.kodIstekGonder = function (hamKod) {
        var u = oturum(), D = veri();
        if (!u || !D) return Promise.resolve({ ok: false, mesaj: 'Ba\u011flant\u0131 kurulamad\u0131. Sayfay\u0131 yenileyip tekrar dene.' });
        var kod = kodDuzelt(hamKod);
        if (!kod) return Promise.resolve({ ok: false, mesaj: 'L\u00fctfen kodunu yaz.' });

        var ara = function (k) { return D.collection(C_DAVET).doc(k).get(); };

        return ara(kod).then(function (doc) {
            /* Kisisel kod bulunamadiysa OGRETMEN KODUNU dene: ogrenci
               "TCH-4582-X8B2" yerine yalnizca "TCH-4582" yazmis olabilir. */
            if (doc.exists) return doc;
            var tk = ogretmenKisim(kod);
            if (tk && tk !== kod) return ara(tk);
            return doc;
        }).then(function (doc) {
            if (!doc || !doc.exists) {
                return { ok: false, mesaj: ogretmenKoduMu(kod)
                    ? 'Bu \u00f6\u011fretmen kodu hen\u00fcz sistemde kay\u0131tl\u0131 de\u011fil. \u00d6\u011fretmeninin siteye bir kez giri\u015f yapmas\u0131 yeterli, sonra tekrar dene.'
                    : 'Bu kod bulunamad\u0131. \u00d6\u011fretmeninin kodunu da yazabilirsin (\u00f6rn. TCH-4582).' };
            }
            var v = doc.data() || {};
            var gercekKod = kodDuzelt(v.kod || doc.id);
            /* Ogretmen kodu daveti YA "tur" alanindan YA DA koordinat
               yoklugundan anlasilir: lId'siz bir davete koordinat yazilmaz
               (undefined alan Firestore'da gecersizdir).                    */
            var ogretmenKoduIle = (v.tur === 'ogretmen') || (v.lId == null);

            if (!ogretmenKoduIle && v.kullanildi && v.ogrenciUid && v.ogrenciUid !== u.uid) {
                return { ok: false, mesaj: 'Bu kod daha \u00f6nce ba\u015fka bir hesaba ba\u011flanm\u0131\u015f.' };
            }

            var ad = '';
            try { ad = (typeof appState !== 'undefined' && appState.currentUserName) ? appState.currentUserName : ''; } catch (e) { }
            if (!ad || ad === 'Belirtilmedi' || ad === '\u00d6\u011frenci') ad = v.ad || (u.email || '');

            var kayit = {
                uid: u.uid,
                email: u.email || '',
                ad: ad,
                kod: gercekKod,
                tur: ogretmenKoduIle ? 'ogretmen' : 'ogrenci',
                ogretmenUid: v.ogretmenUid,
                ogretmenAd: v.ogretmenAd || '',
                seviyeAd: v.seviyeAd || '',
                sinifAd: v.sinifAd || '',
                durum: 'bekliyor',
                istekTarih: zamanDamga()
            };
            /* Ogretmen kodunda koordinat yoktur; undefined yazmak Firestore'da hatadir. */
            if (!ogretmenKoduIle) { kayit.lId = v.lId; kayit.cId = v.cId; kayit.sIdx = v.sIdx; }

            return D.collection(C_BAG).doc(u.uid).set(kayit, { merge: true }).then(function () {
                OH.bag = {
                    uid: u.uid, email: u.email || '', ad: ad, kod: gercekKod,
                    tur: kayit.tur,
                    ogretmenUid: v.ogretmenUid, ogretmenAd: v.ogretmenAd || '',
                    lId: kayit.lId, cId: kayit.cId, sIdx: kayit.sIdx,
                    seviyeAd: v.seviyeAd || '', sinifAd: v.sinifAd || '',
                    durum: 'bekliyor'
                };
                return { ok: true };
            });
        }).catch(function (e) {
            return { ok: false, mesaj: '\u0130stek g\u00f6nderilemedi: ' + (e && (e.message || e.code)) };
        });
    };

    /* Kod penceresindeki "Istek Gonder" tusu. */
    OH.kodGonder = function () {
        var el = document.getElementById('ohKodGiris');
        var not = document.getElementById('ohKodNot');
        if (not) { not.style.color = '#16A085'; not.textContent = 'Kod kontrol ediliyor\u2026'; }
        OH.kodIstekGonder((el && el.value) || '').then(function (r) {
            if (r && r.ok) { OH.kodCiz(); OH.bannerGuncelle(); }
            else OH.kodCiz((r && r.mesaj) || '\u0130stek g\u00f6nderilemedi.', true);
        });
    };

    /* KAYIT FORMUNDA girilen ogretmen kodu (oh_beklenen_kod):
       giris tamamlaninca burada otomatik isleme alinir.
       Basarili da olsa hatali da olsa kod penceresi acilip sonuc gosterilir. */
    OH.bekleyenKoduIsle = function () {
        var kod = '';
        try { kod = localStorage.getItem('oh_beklenen_kod') || ''; } catch (e) { }
        if (!kod) return;
        if (ogretmenMi() || !OH.epostaGirisiVar()) return;
        if (OH.bagliMi() || OH.bekliyorMu()) {
            try { localStorage.removeItem('oh_beklenen_kod'); } catch (e) { }
            return;
        }
        OH.kodIstekGonder(kod).then(function (r) {
            try { localStorage.removeItem('oh_beklenen_kod'); } catch (e) { }
            OH.bannerGuncelle();
            OH.kodModalAc();
            if (!(r && r.ok)) OH.kodCiz((r && r.mesaj) || '\u0130stek g\u00f6nderilemedi.', true);
        });
    };

    /* ================================================================ 6. OGRENCI: VERI KURULUMU (AYNA) */

    OH._ozetAbone = null;

    /* Onayli ogrenci icin, listelerim.js'in bekledigi bicimde YEREL bir veri
       iskeleti kurar. Boylece mevcut ogrenci ekranlari (mesaj kutusu, rozet)
       hicbir degisiklik olmadan calisir. */
    OH.ogrenciVeriKur = function (ozet) {
        if (!OH.bag || !ozet) return;
        var lId = OH.bag.lId, cId = OH.bag.cId, si = OH.bag.sIdx;
        var ogrenciler = [];
        for (var i = 0; i < si; i++) ogrenciler.push({ name: '', loginCode: '', hw: [], ex: [], skills: {}, notes: '' });
        ogrenciler.push({
            name: ozet.ad || OH.bag.ad || 'Öğrenci',
            loginCode: OH.bag.kod || '',
            hw: ozet.odev || [],
            ex: ozet.sinav || [],
            skills: ozet.beceri || {},
            personalMissions: ozet.gorevler || [],
            history: [],
            notes: '',
            hesapUid: OH.bag.uid
        });

        var yeni = { levels: {}, levelOrder: [lId], mesajlar: (ozet.mesajlar || []) };
        yeni.levels[lId] = {
            name: ozet.seviyeAd || OH.bag.seviyeAd || '',
            classes: {},
            planText: {},
            config: { hw: [], ex: [] }
        };
        yeni.levels[lId].classes[cId] = {
            name: ozet.sinifAd || OH.bag.sinifAd || '',
            students: ogrenciler
        };

        try {
            localStorage.setItem('schoolData', JSON.stringify(yeni));
            if (typeof loadDataFromLocal === 'function') loadDataFromLocal();
        } catch (e) { console.warn('OH veri kurulumu', e); }

        try {
            localStorage.setItem('logged_student', JSON.stringify({
                lId: lId, cId: cId, sIdx: si,
                name: ozet.ad || OH.bag.ad || 'Öğrenci',
                role: 'student',
                uid: OH.bag.uid,
                bulut: true
            }));
        } catch (e) { }

        try { if (typeof renderStudentDashboardContent === 'function') renderStudentDashboardContent(); } catch (e) { }
        try { if (typeof ogrMesajCiz === 'function' && document.getElementById('ogrMesajGovde')) ogrMesajCiz(); } catch (e) { }
    };

    OH.ozetiDinle = function () {
        var u = oturum(), D = veri();
        if (!u || !D || !OH.bagliMi()) return;
        if (OH._ozetAbone) { try { OH._ozetAbone(); } catch (e) { } OH._ozetAbone = null; }
        try {
            OH._ozetAbone = D.collection(C_OZET).doc(u.uid).onSnapshot(function (doc) {
                if (!doc.exists) return;
                OH.ogrenciVeriKur(doc.data());
            }, function (e) { console.warn('OH ozet dinleyici:', e && (e.code || e.message)); });
        } catch (e) { }
    };

    /* ================================================================ 7. OGRENCI: MESAJ KOPRUSU */

    /* Ogrencinin yazdigi mesaj, ogretmenin cihazinda olmadigi icin dogrudan
       ogretmenin verisine yazilamaz -> ogrenciMesaj koleksiyonuna dusurulur,
       ogretmenin uygulamasi oradan alip kendi listesine ekler. */
    OH.mesajGonder = function (metin) {
        var u = oturum(), D = veri();
        if (!u || !D || !OH.bagliMi()) return false;
        var t = new Date();
        var g = yerelOgrenci() || {};
        try {
            D.collection(C_MSG).add({
                ogretmenUid: OH.bag.ogretmenUid,
                ogrenciUid: u.uid,
                email: u.email || '',
                ad: g.name || OH.bag.ad || 'Öğrenci',
                lId: OH.bag.lId, cId: OH.bag.cId, sIdx: OH.bag.sIdx,
                metin: String(metin || '').slice(0, 1000),
                ts: t.getTime(),
                tarih: tarihYaz(t),
                islendi: false
            }).catch(function (e) { console.warn('OH mesaj gonderilemedi:', e && (e.code || e.message)); });
        } catch (e) { return false; }
        return true;
    };

    /* ================================================================ 8. BANNER (ILETISIM POP-UP) */

    OH.bannerGuncelle = function () {
        var b = document.getElementById('ohBanner');
        if (!b) return;
        if (ogretmenMi() || !OH.epostaGirisiVar() || OH.bagliMi()) { b.style.display = 'none'; return; }
        b.style.display = 'block';
        if (OH.bekliyorMu()) {
            b.innerHTML =
                '<div style="padding:11px 14px; background:#FFF1E6; border-bottom:1px solid #F3DCC9;' +
                'color:#B34700; font-size:.86rem; line-height:1.5;">Öğretmenine gönderdiğin katılım isteği ' +
                '<b>onay bekliyor</b>.</div>';
            return;
        }
        b.innerHTML =
            '<div style="padding:11px 14px; background:#FFF1E6; border-bottom:1px solid #F3DCC9;' +
            'color:#6B4A38; font-size:.86rem; line-height:1.5;">Öğretmeninin verdiği kodu girerek sınıfına ' +
            'katılabilirsin. ' +
            '<span onclick="OH.kodModalAc()" style="cursor:pointer; color:#D84315; font-weight:700;' +
            'text-decoration:underline;">Kodu gir</span></div>';
    };

    /* ================================================================ 9. SARMALAMALAR */

    function sarmala() {
        if (OH._kurulum) return;

        /* save() -> davet + ozet yayini */
        if (typeof window.save === 'function' && !window.save._oh) {
            var _save = window.save;
            var yeniSave = function () {
                var r = _save.apply(this, arguments);
                try { OH.kaydetSonrasi(); } catch (e) { }
                return r;
            };
            yeniSave._oh = true;
            window.save = yeniSave;
        }

        /* renderSidebar() -> "Bekleyen Istekler" tusu */
        if (typeof window.renderSidebar === 'function' && !window.renderSidebar._oh) {
            var _rs = window.renderSidebar;
            var yeniRS = function () {
                var r = _rs.apply(this, arguments);
                try { OH.tusYerlestir(); } catch (e) { }
                return r;
            };
            yeniRS._oh = true;
            window.renderSidebar = yeniRS;
        }

        /* ogrenciYeniMesaj() -> buluta da yaz + e-posta zorunlulugu */
        if (typeof window.ogrenciYeniMesaj === 'function' && !window.ogrenciYeniMesaj._oh) {
            var _oym = window.ogrenciYeniMesaj;
            var yeniOYM = function (metin) {
                var g = yerelOgrenci();
                /* Buluta bagli ogrenci: e-posta oturumu sart. */
                if (g && g.bulut) {
                    if (!OH.epostaGirisiVar() || !OH.bagliMi()) {
                        alert('Mesaj göndermek için e-posta ile giriş yapmış ve öğretmenin tarafından onaylanmış olman gerekir.');
                        return false;
                    }
                    OH.mesajGonder(metin);
                }
                return _oym.apply(this, arguments);
            };
            yeniOYM._oh = true;
            window.ogrenciYeniMesaj = yeniOYM;
        }

        /* ogrenciCevapYaz() -> ayni koprü */
        if (typeof window.ogrenciCevapYaz === 'function' && !window.ogrenciCevapYaz._oh) {
            var _ocy = window.ogrenciCevapYaz;
            var yeniOCY = function (id, metin) {
                var g = yerelOgrenci();
                if (g && g.bulut) {
                    if (!OH.epostaGirisiVar() || !OH.bagliMi()) {
                        alert('Mesaj göndermek için e-posta ile giriş yapmış ve öğretmenin tarafından onaylanmış olman gerekir.');
                        return false;
                    }
                    OH.mesajGonder(metin);
                }
                return _ocy.apply(this, arguments);
            };
            yeniOCY._oh = true;
            window.ogrenciCevapYaz = yeniOCY;
        }

        /* openMyMessages() -> banner */
        if (typeof window.openMyMessages === 'function' && !window.openMyMessages._oh) {
            var _omm = window.openMyMessages;
            var yeniOMM = async function () {
                var r = await _omm.apply(this, arguments);
                try { OH.bannerGuncelle(); } catch (e) { }
                return r;
            };
            yeniOMM._oh = true;
            window.openMyMessages = yeniOMM;
        }

        OH._kurulum = true;
    }

    /* ================================================================ 10. ACILIS */

    OH.baglantiyiYukle = function () {
        var u = oturum(), D = veri();
        OH.bag = null;
        if (!u || !D) { OH.bannerGuncelle(); return Promise.resolve(null); }
        if (ogretmenMi()) { OH.bannerGuncelle(); return Promise.resolve(null); }
        return D.collection(C_BAG).doc(u.uid).get().then(function (doc) {
            OH.bag = doc.exists ? doc.data() : null;
            if (OH.bagliMi()) {
                OH.ozetiDinle();
            } else {
                /* Onaysiz/kopuk/arsiv kullanicida ESKI SINIFTAN KALAN hicbir
                   sey gorunmesin: yerel ogrenci oturumu, ayna okul verisi ve
                   ozet dinleyicisi temizlenir. */
                var g = yerelOgrenci();
                if (g && g.bulut) {
                    try { localStorage.removeItem('logged_student'); } catch (e) { }
                    try { localStorage.removeItem('schoolData'); } catch (e) { }
                }
                if (OH._ozetAbone) { try { OH._ozetAbone(); } catch (e) { } OH._ozetAbone = null; }
            }
            OH.bannerGuncelle();
            return OH.bag;
        }).catch(function (e) {
            console.warn('OH baglanti okunamadi:', e && (e.code || e.message));
            OH.bannerGuncelle();
            return null;
        });
    };

    /* ================================================================ 8. OGRETMEN KODU (SABIT KOD) GARANTISI

       Ogretmenin sabit kodu (teacher_static_code) TEK kaynaktan gelir:
         kullanicilar/{uid}.teacherStaticCode
       Eskiden bu alan yalnizca listelerim.js'in kendi kayit/giris ekraninda
       yaziliyordu; auth.js uzerinden giren ogretmende ya da alanin
       eklenmesinden onceki hesaplarda kod HIC olusmuyordu -> profilde
       "Ogretmen Kodu" gorunmuyordu ve ogrenci davet kodlari "TCH-xxxx"
       yerine sadece "TCH" onekiyle uretiliyordu.

       Bu fonksiyon:
         1) Buluttaki kodu okur, varsa localStorage'a AYNEN yansitir.
         2) Yoksa uid'den TURETILMIS (deterministik) bir kod uretir,
            {merge:true} ile yazar ve yansitir.
       MEVCUT BIR KOD ASLA DEGISTIRILMEZ; cunku ogrenci giris kodlari
       "${teacher_static_code}-XXXX" bicimindedir ve kod degisirse
       daha once dagitilmis tum davetler gecersiz olurdu.                    */

    function koduTuret(uid) {
        var h = 0, s = String(uid || '');
        for (var i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
        var n = Math.abs(h) % 9000 + 1000;      /* 1000..9999 */
        return 'TCH-' + n;
    }

    OH.ogretmenKodu = function () {
        try { return localStorage.getItem('teacher_static_code') || ''; } catch (e) { return ''; }
    };

    OH.ogretmenKoduSagla = function () {
        var u = oturum(), D = veri();
        if (!u || !D || !ogretmenMi()) return Promise.resolve('');
        return D.collection('kullanicilar').doc(u.uid).get().then(function (doc) {
            var mevcut = (doc && doc.exists && doc.data() && doc.data().teacherStaticCode) || '';
            if (mevcut) {
                try { localStorage.setItem('teacher_static_code', mevcut); } catch (e) { }
                OH.koduYansit(mevcut);
                return mevcut;
            }
            var yeni = koduTuret(u.uid);
            return D.collection('kullanicilar').doc(u.uid)
                .set({ teacherStaticCode: yeni }, { merge: true })
                .then(function () {
                    try { localStorage.setItem('teacher_static_code', yeni); } catch (e) { }
                    OH.koduYansit(yeni);
                    return yeni;
                }).catch(function (e) {
                    console.warn('OH ogretmen kodu yazilamadi:', e && (e.code || e.message));
                    /* Bulut yazilamasa bile yerelde kullanilabilir olsun. */
                    try { if (!localStorage.getItem('teacher_static_code')) localStorage.setItem('teacher_static_code', yeni); } catch (e2) { }
                    OH.koduYansit(yeni);
                    return yeni;
                });
        }).catch(function (e) {
            console.warn('OH ogretmen kodu okunamadi:', e && (e.code || e.message));
            return OH.ogretmenKodu();
        });
    };

    /* Kod gec geldiyse ekrandaki alanlari sessizce tazele. */
    OH.koduYansit = function (kod) {
        if (!kod) return;
        try {
            var a = document.querySelectorAll('.tk-kod, .tch-kod-deger, .tch-kod-satir');
            for (var i = 0; i < a.length; i++) a[i].textContent = kod;
        } catch (e) { }
        try { if (typeof renderSidebar === 'function' && ogretmenMi()) renderSidebar(); } catch (e) { }
    };

    /* Panodaki kopyalama (profil kartindaki tus kullanir). */
    OH.koduKopyala = function (btn) {
        var kod = OH.ogretmenKodu();
        if (!kod) return;
        var bitti = function () {
            if (!btn) return;
            var eski = btn.textContent;
            btn.textContent = 'Kopyalandı ✓';
            setTimeout(function () { btn.textContent = eski; }, 1600);
        };
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(kod).then(bitti, function () { bitti(); });
                return;
            }
        } catch (e) { }
        try {
            var t = document.createElement('textarea');
            t.value = kod; document.body.appendChild(t); t.select();
            document.execCommand('copy'); document.body.removeChild(t); bitti();
        } catch (e) { }
    };

    /* ================================================================ 9. TANI (KONSOL)

       Tarayici konsoluna  OH.tani()  yazip Enter'a basmak yeterli:
       sistemin hangi asamada takildigi tek bakista gorunur.               */
    OH.tani = function () {
        var u = oturum(), D = veri(), c = console;
        c.log('%c\u2014 OH TANI \u2014', 'font-weight:700;color:#D84315;font-size:13px');
        c.log('firebase :', !!fb(), '| firestore:', !!D);
        c.log('oturum   :', u ? (u.email || '(anonim)') : 'YOK', '| uid:', u ? u.uid : '-');
        c.log('rol      :', rol() || '(yok)', '| ogretmenMi:', ogretmenMi());
        c.log('ogr.kodu :', OH.ogretmenKodu() || '(yok)');
        if (OH._sonYayinHata) c.log('son yayin hatasi :', OH._sonYayinHata);

        var d = (typeof data !== 'undefined' && data) ? data : null;
        var n = 0, nk = 0;
        try {
            Object.keys(d.levels).forEach(function (l) {
                var cl = d.levels[l].classes || {};
                Object.keys(cl).forEach(function (cx) {
                    ((cl[cx].students) || []).forEach(function (st) { n++; if (st.loginCode) nk++; });
                });
            });
        } catch (e) { }
        c.log('ogrenci  :', n, '| giris kodu olan:', nk);

        if (!u || !D) return Promise.resolve();
        return D.collection('kullanicilar').doc(u.uid).get().then(function (doc) {
            var v = (doc.exists && doc.data()) || {};
            c.log('kullanicilar/{uid}.role :', v.role || '(ALAN YOK \u2192 kurallar davet yazmayi REDDEDER)');
            c.log('kullanicilar/{uid}.teacherStaticCode :', v.teacherStaticCode || '(yok)');
            var k = kodDuzelt(OH.ogretmenKodu());
            if (!k) { c.log('davetler kontrolu: ogretmen kodu yok, atlandi'); return null; }
            return D.collection(C_DAVET).doc(k).get().then(function (dd) {
                c.log('davetler/' + k + ' :', dd.exists ? 'VAR \u2713' : 'YOK \u2717 (ogretmen kodu yayinlanmamis)');
                return null;
            });
        }).catch(function (e) {
            c.warn('TANI hatasi:', e && (e.code || e.message));
        });
    };

    /* ================================================================ 8b. HAYALET BAG TEMIZLIGI

       Sinif GECMISTE silinmis olabilir (bu ozellik eklenmeden once) ya da
       ogrenci listeden cikarilmistir. Ogretmen girisinde taranir:
       ONAYLI gorunen ama artik HICBIR sinifta bulunmayan hesaplarin
       - bagi 'kopuk' yapilir (ogrenci girisinde eski sinif gorunmez),
       - ayna ozeti (ogrenciOzet) silinir,
       - davet kodu yeniden kullanilabilir olur.
       Arsivlenen siniflarin baglari (durum 'arsiv') taramaya girmez.        */
    OH.bagTemizligi = function (deneme) {
        var u = oturum(), D = veri();
        if (!u || !D || !ogretmenMi()) return;
        var d = (typeof data !== 'undefined' && data) ? data : null;
        if (!d || !d.levels) {
            if ((deneme || 0) < 5) setTimeout(function () { OH.bagTemizligi((deneme || 0) + 1); }, 2500);
            return;
        }
        D.collection(C_BAG).where('ogretmenUid', '==', u.uid).get().then(function (snap) {
            snap.forEach(function (doc) {
                var v = doc.data() || {};
                if (v.durum !== 'onayli') return;
                var bulundu = false;
                try {
                    Object.keys(d.levels).forEach(function (lId) {
                        var cl = d.levels[lId].classes || {};
                        Object.keys(cl).forEach(function (cId) {
                            (cl[cId].students || []).forEach(function (st) {
                                if (st && st.hesapUid === doc.id) bulundu = true;
                            });
                        });
                    });
                } catch (e) { }
                if (bulundu) return;
                D.collection(C_BAG).doc(doc.id).set({ durum: 'kopuk', guncelleme: Date.now() }, { merge: true }).catch(function () { });
                D.collection(C_OZET).doc(doc.id).delete().catch(function () { });
                if (v.kod) D.collection(C_DAVET).doc(String(v.kod).toUpperCase())
                    .set({ kullanildi: false, ogrenciUid: null, guncelleme: Date.now() }, { merge: true }).catch(function () { });
                console.log('OH: "' + (v.ad || doc.id) + '" hiçbir sınıfta bulunamadı — bağı koparıldı.');
            });
        }).catch(function (e) { console.warn('OH bağ temizliği:', e && (e.code || e.message)); });
    };

    OH.baslat = function () {
        sarmala();
        var u = oturum();
        if (!u) {
            /* Cikis yapildi: bulut kaynakli ogrenci oturumunu temizle. */
            var g = yerelOgrenci();
            if (g && g.bulut) {
                try { localStorage.removeItem('logged_student'); localStorage.removeItem('schoolData'); } catch (e) { }
            }
            OH.bag = null;
            if (OH._ozetAbone) { try { OH._ozetAbone(); } catch (e) { } OH._ozetAbone = null; }
            if (OH._istekAbone) { try { OH._istekAbone(); } catch (e) { } OH._istekAbone = null; }
            if (OH._msgAbone) { try { OH._msgAbone(); } catch (e) { } OH._msgAbone = null; }
            return;
        }
        if (ogretmenMi()) {
            /* Ayni tarayicida once ogrenci olarak girilmisse, eski ozet
               dinleyicisi ogretmenin verisini ezmesin -> kapat. */
            if (OH._ozetAbone) { try { OH._ozetAbone(); } catch (e) { } OH._ozetAbone = null; }
            OH.bag = null;
            /* Ogretmen/yonetici hesabinda ARTIK yerel ogrenci oturumu olamaz;
               kalintisi ogretmen yuzeyini kilitler -> temizle. */
            if (yerelOgrenci()) { try { localStorage.removeItem('logged_student'); } catch (e) { } }
            OH.istekleriDinle();
            OH.mesajlariDinle();
            /* Sabit ogretmen kodu YOKSA burada olusur; davetler kod hazir
               olduktan SONRA yayinlanmali -> zincirleme calistiriyoruz. */
            OH.ogretmenKoduSagla().then(function () {
                /* Once OGRETMEN KODU daveti (ogrenciler bunu da girebilsin),
                   sonra kisiye ozel ogrenci davetleri. */
                OH.ogretmenDavetiYayinla();
                setTimeout(function () { OH.davetleriYayinla(); }, 1200);
                setTimeout(function () { OH.bagTemizligi(); }, 2600);
            });
            setTimeout(function () { OH.tusYerlestir(); }, 900);
        } else {
            var p = OH.baglantiyiYukle();
            /* Baglanti durumu OGRENILDIKTEN sonra kayittan kalan kod islenir;
               boylece zaten bagli/bekleyen hesaba ikinci istek atilmaz. */
            if (p && p.then) p.then(function () { OH.bekleyenKoduIsle(); });
            else OH.bekleyenKoduIsle();
        }
    };

    /* Rol Firestore'dan geldikten SONRA baslatilmali -> basariliGiris sarmalanir. */
    function girisSarmala() {
        if (typeof window.basariliGiris === 'function' && !window.basariliGiris._oh) {
            var _bg = window.basariliGiris;
            var yeniBG = function () {
                var r = _bg.apply(this, arguments);
                try { setTimeout(function () { OH.baslat(); }, 300); } catch (e) { }
                return r;
            };
            yeniBG._oh = true;
            window.basariliGiris = yeniBG;
        }
        if (typeof window.initAppAsGuest === 'function' && !window.initAppAsGuest._oh) {
            var _ig = window.initAppAsGuest;
            var yeniIG = function () {
                var r = _ig.apply(this, arguments);
                try { OH.baslat(); } catch (e) { }
                return r;
            };
            yeniIG._oh = true;
            window.initAppAsGuest = yeniIG;
        }
    }

    function kur() {
        sarmala();
        girisSarmala();
        /* Sayfa zaten acikken (yeniden yukleme) durumu yakala. */
        setTimeout(function () { try { OH.baslat(); } catch (e) { } }, 1800);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();

})();
