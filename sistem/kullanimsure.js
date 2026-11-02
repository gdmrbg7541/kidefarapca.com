/* =====================================================================
   KİDEF · SİTEDE GEÇİRİLEN SÜRE            (sistem/kullanimsure.js)
   ---------------------------------------------------------------------
   Öğretmen (08.10.2026): "öğretmen olarak giriş yapanların toplam ne
   kadar siteyi kullandıklarını hesaplayan bi sistem yapalım, bunu
   yönetici de görebilsin."

   KAÇAKLAR KAPANDI (02.11.2026) — yönetici: "öğretmenlerin sitede
   geçirdiği tüm zamandan sızan gözümüzden kaçan bi şey varsa ara bul,
   öğretmenin gerçekten ne kadar zaman geçirdiğini görmek istiyorum".
   Bulunan kaçaklar:
     1. SAYILMAYAN SAYFALAR: sayaç yalnız index.html ve sarf.html'de
        vardı. Dijital kitaplar (kitap/…), defter, tahta, alfabe,
        kelimeler, etkinlik ve oyun sayfaları HİÇ sayılmıyordu — öğretmen
        derste en çok buralarda. → Bu betik artık her sayfada çalışır:
        sistem/kapi.js (ana sayfa dışındaki her sayfanın başında) yükler.
     2. KAPANIŞTA KAYIP: buluta 5 dakikada bir yazılıyordu; sekme
        kapanırken başlatılan yazım çoğu zaman yetişmiyordu (Firestore'un
        kalıcı önbelleği kapalı). Kısa oturumun tamamı, uzununun son
        5 dakikası gidiyordu. → Sayılan her saniye ÖNCE tarayıcıya
        (localStorage) yazılır; buluta aktarım ondan sonra. Aktarım
        yarıda kalırsa sonraki açılışta tamamlanır; aynı parti iki kez
        yazılmaz (kullanim.parti.<tarayıcı> = parti numarası).
     3. ÇERÇEVE İÇİ HAREKET: kitap içi etkinlik, sözlük penceresi gibi
        çerçevelerdeki tıklama üstteki sayfaya ulaşmıyordu; 5 dk sonra
        süre duruyordu. → Aynı sitenin çerçeveleri de dinlenir; yabancı
        çerçeve (YouTube…) odaktayken en çok 15 dk etkin sayılır.
     4. VİDEO / SES: öğretmen dinletirken hareket olmadığından süre
        duruyordu. → Sayfada sesi açık oynayan video/ses varken etkin.
     5. SUNUM: tam ekranda (tahtaya yansıtma) hareketsizlik sınırı 15 dk.
     6. ÇİFT SAYIM: aynı tarayıcıda iki pencere birden görünürken ikisi
        de sayıyordu. → Yalnız EN SON dokunulan sekme sayar.

   NE SAYAR — ve neyi saymaz
     · Yalnız GERÇEK ETKİN süre: sayfa GÖRÜNÜR olacak ve son BOSTA_SN
       saniyede bir hareket (tıklama, tuş, kaydırma, dokunma) olacak —
       ya da yukarıdaki 3–5. Arka planda açık sekme, açık unutulmuş
       bilgisayar ve uyku süresi sayılmaz.
     · İki ölçüm arası ATLAMA_SN'den uzunsa (uyku, saat değişimi) o
       aralık atılır — süre şişmesin.

   AKIŞ
     sayaç (15 sn) → bellekte «açık» → en geç MUHUR_SN'de bir ve sayfa
     gizlenirken/kapanırken tarayıcıya PARÇA olarak mühürlenir
     (kidefSure:<uid>:<sekme>:<sıra>; parça bir kez yazılır, değişmez).
     Firebase'li sayfa (ana sayfa, sarf, defter…) parçaları kilitle
     toplar, bir PARTİ yapar (kidefSureUcus:<uid>) ve buluta yazar:
       kullanicilar/{uid}.kullanim = {
          toplamSn   : artımlı toplam (saniye)
          gun        : { "2026-11-02": saniye, ... }
          alan       : { site, kitap, defter, tahta, etkinlik }  (02.11.2026'dan beri)
          oturum     : ziyaret sayısı (tarayıcıda 30 dk ara = yeni ziyaret)
          sonGoruldu : sunucu zaman damgası
          parti      : { <tarayıcı>: son partinin numarası }  (çift yazım kalkanı)
       }
     Aktarım: girişten sonra bekleyen varsa hemen, sonra YAZ_ARALIK_SN'de
     bir; sekme gizlenince (son aktarımdan GIZLENINCE_EN_AZ_SN geçtiyse)
     bir kez daha. OKUMA AZALT (27.10.2026) gereği sık yazılmaz: her yazım
     belgeyi dinleyen her sekmede bir okumadır.
     Firebase yüklemeyen sayfa hesabı tarayıcıdaki oturum kaydından
     (firebase:authUser, sistem/kapi.js'teki gibi) bilir; giriş yoksa
     saymaz.

   NEDEN kullanicilar BELGESİ: yönetici zaten bu koleksiyonu okuyor
   (teacher-admin.js), ayrı bir koleksiyon yeni kural ve ikinci okuma
   demekti. Kurallarda "kendi belgesini güncelleyebilir" zaten var; bu
   betik yalnız kullanim alanına dokunur.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefKullanim) return;
    /* çerçevede çalışmaz: süreyi üstteki sayfa sayar */
    try { if (window.top !== window.self) return; } catch (e) { return; }

    var BOSTA_SN = 300;            /* 5 dk hareketsizlik -> duraklat */
    var BOSTA_SUNUM_SN = 900;      /* tam ekranda (sunum) 15 dk */
    var CERCEVE_EN_COK_SN = 900;   /* yabancı çerçeve odaktayken en çok 15 dk */
    var ATLAMA_SN = 120;           /* iki ölçüm arası bundan uzunsa aralığı at */
    var VURU_MS = 15000;           /* ölçüm aralığı */
    var MUHUR_SN = 60;             /* tarayıcıya en geç bu kadarda bir */
    var YAZ_ARALIK_SN = 300;       /* buluta en sık bu kadarda bir (OKUMA AZALT 27.10.2026) */
    var GIZLENINCE_EN_AZ_SN = 60;  /* sekme gizlenince: son aktarımdan bu kadar geçtiyse */
    var OTURUM_ARA_SN = 1800;      /* tarayıcıda 30 dk ara = yeni ziyaret */
    var PARCA_EN_COK_SN = 3 * 3600;/* tek parça en çok 3 saat (bozuk veriye karşı) */
    var PARCA_SINIR = 3000;        /* tarayıcıda en çok bu kadar parça */
    var ESKI_PARCA_GUN = 60;       /* başka hesabın aktarılmamış parçası bu kadar gün bekler */

    var ON = 'kidefSure:', UCUS = 'kidefSureUcus:', ETKIN = 'kidefSureEtkin', OTURUM = 'kidefSureOturum',
        KILIT = 'kidefSureKilit', TARAYICI = 'kidefTarayici', ESKI = 'kidefKullanimBekleyen';
    var OLAYLAR = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'mousemove'];

    var SEKME = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    var ALAN = alanBul();
    var basla = Date.now();
    var sonVuru = Date.now();      /* son ölçüm anı */
    var sonHareket = Date.now();   /* bu sekmede son kullanıcı hareketi */
    var sonEtkinYazim = 0;
    var acik = { sn: 0, gun: {}, ot: 0 }, acikUid = null;   /* henüz mühürlenmemiş */
    var parcaSira = 0, muhurSon = Date.now(), oturumToplam = 0;
    var cerceveOdakBas = 0, sonAktarim = Date.now(), aktariliyor = false;
    var authHazir = false, depoUid = null;
    var medyalar = [];
    /* tarayıcı deposu kapalıysa (gizli pencere, engel) eski yol: bellekten doğrudan buluta */
    var depoVar = (function () {
        try { var k = '__kidefSureDene'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return true; }
        catch (e) { return false; }
    })();
    var _tid = null;

    /* ------------------------------------------------------------ yardımcı */
    function yerel(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function yerelJ(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
    function yerelYaz(k, v) {
        try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); return true; }
        catch (e) { return false; }
    }
    function yerelSil(k) { try { localStorage.removeItem(k); } catch (e) { } }
    function anahtarlar(on) {
        var L = [];
        try {
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (k && k.indexOf(on) === 0) L.push(k);
            }
        } catch (e) { }
        return L;
    }
    function yuvarla(x) { return Math.round((+x || 0) * 10) / 10; }
    function bugun() {
        var d = new Date();
        var a = d.getMonth() + 1, g = d.getDate();
        return d.getFullYear() + '-' + (a < 10 ? '0' : '') + a + '-' + (g < 10 ? '0' : '') + g;
    }
    function tarayiciId() {
        if (_tid) return _tid;
        var t = yerel(TARAYICI);
        if (!t) { t = 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); yerelYaz(TARAYICI, t); }
        return (_tid = t);
    }
    function zamanAsimi(p, ms) {
        return new Promise(function (ok, red) {
            var t = setTimeout(function () { red(new Error('zaman aşımı')); }, ms);
            p.then(function (x) { clearTimeout(t); ok(x); }, function (e) { clearTimeout(t); red(e); });
        });
    }
    /* sayfanın türü: yöneticinin «nerede» dökümü için */
    function alanBul() {
        var p = String(location.pathname || '').toLowerCase();
        try { p = decodeURIComponent(p); } catch (e) { }
        if (/\/kitap\//.test(p) || /flipbook|ikikidijital/.test(p)) return 'kitap';
        if (/\/defter\.html$/.test(p)) return 'defter';
        if (/\/tahta\.html$/.test(p)) return 'tahta';
        if (/^\/(index\.html)?$/.test(p)) return 'site';
        return 'etkinlik';
    }

    /* ------------------------------------------------------------ hesap */
    /* Firebase (giriş) bu sayfada kurulu mu: firebase.auth() uygulama kurulmadan çağrılırsa hata verir */
    function fbVar() {
        try { return !!(window.firebase && typeof firebase.auth === 'function' && firebase.auth()); }
        catch (e) { return false; }
    }
    /* Firebase'li sayfada kesin bilgi; giriş henüz çözülmediyse undefined */
    function fbKullanici() {
        if (!fbVar()) return undefined;
        try {
            var u = firebase.auth().currentUser;
            if (u && !u.isAnonymous) return u;
        } catch (e) { return undefined; }
        return authHazir ? null : undefined;
    }
    /* Firebase yüklemeyen sayfa: tarayıcıdaki oturum kaydı — localStorage /
       sessionStorage ya da IndexedDB firebaseLocalStorageDb (sistem/kapi.js'teki gibi) */
    function depodanUid() {
        var bul = function (d) {
            try {
                for (var i = 0; i < d.length; i++) {
                    var k = d.key(i);
                    if (k && k.indexOf('firebase:authUser:') === 0) {
                        var v = JSON.parse(d.getItem(k) || 'null');
                        if (v && v.uid && !v.isAnonymous) return v.uid;
                    }
                }
            } catch (e) { }
            return null;
        };
        var u = null;
        try { u = bul(window.localStorage) || bul(window.sessionStorage); } catch (e) { }
        if (u || !window.indexedDB) { depoUid = u; return; }
        try {
            var r = indexedDB.open('firebaseLocalStorageDb');
            r.onupgradeneeded = function () { try { r.transaction.abort(); } catch (e) { } };
            r.onerror = function (e) { try { e.preventDefault(); } catch (x) { } };
            r.onsuccess = function () {
                var db = r.result, bulundu = null;
                try {
                    if (!db.objectStoreNames.contains('firebaseLocalStorage')) { db.close(); depoUid = null; return; }
                    var c = db.transaction('firebaseLocalStorage', 'readonly').objectStore('firebaseLocalStorage').openCursor();
                    c.onsuccess = function () {
                        var k = c.result;
                        if (!k) { try { db.close(); } catch (e) { } depoUid = bulundu; return; }
                        var x = k.value || {}, v = x.value;
                        if (!bulundu && String(x.fbase_key || k.key || '').indexOf('firebase:authUser:') === 0 &&
                            v && v.uid && !v.isAnonymous) bulundu = v.uid;
                        k.continue();
                    };
                    c.onerror = function () { try { db.close(); } catch (e) { } };
                } catch (e) { try { db.close(); } catch (x) { } }
            };
        } catch (e) { }
    }
    function uidSimdi() {
        var u = fbKullanici();
        if (u) return u.uid;
        if (u === null) return null;                   /* Firebase'li sayfa: giriş yok */
        return depoUid;
    }

    /* ------------------------------------------------------------ hareket */
    var etkinBizde = false;        /* «en son dokunulan sekme» kaydı şu an bizde mi */
    function hareket() {
        var s = Date.now();
        sonHareket = s;
        /* kayıt başka sekmedeyse hemen, bizdeyse en çok 3 sn'de bir yazılır */
        if (!etkinBizde || s - sonEtkinYazim > 3000) {
            sonEtkinYazim = s; etkinBizde = true;
            yerelYaz(ETKIN, { s: SEKME, t: s });
        }
    }
    OLAYLAR.forEach(function (t) {
        document.addEventListener(t, hareket, { passive: true, capture: true });
    });
    /* aynı sitenin çerçeveleri (kitap içi etkinlik, sözlük penceresi…): hareketleri
       ve oynattıkları ses/video da sayılır. Her ölçümde yeni çerçeve aranır. */
    function cerceveleriBagla(kok, derinlik) {
        if (derinlik > 2) return;
        var fs;
        try { fs = kok.getElementsByTagName('iframe'); } catch (e) { return; }
        for (var i = 0; i < fs.length; i++) {
            var d = null, w = null;
            try { w = fs[i].contentWindow; d = fs[i].contentDocument; } catch (e) { d = null; }
            if (!d) continue;                                   /* yabancı çerçeve */
            try {
                if (!d.__kidefSure) {
                    d.__kidefSure = true;
                    OLAYLAR.forEach(function (t) { d.addEventListener(t, hareket, { passive: true, capture: true }); });
                }
                if (w) medyaYakala(w);
            } catch (e) { }
            cerceveleriBagla(d, derinlik + 1);
        }
    }
    /* sayfaya eklenmeden çalınan ses (new Audio()) da görülsün: play() yakalanır */
    function medyaYakala(w) {
        try {
            var P = w.HTMLMediaElement && w.HTMLMediaElement.prototype;
            if (!P || !P.play || P.play.__kidefSure) return;
            var asil = P.play;
            var yeni = function () {
                try {
                    if (medyalar.indexOf(this) < 0) { medyalar.push(this); if (medyalar.length > 40) medyalar.shift(); }
                } catch (e) { }
                return asil.apply(this, arguments);
            };
            yeni.__kidefSure = true;
            P.play = yeni;
        } catch (e) { }
    }
    medyaYakala(window);
    function oynuyor(e) {
        try { return !!e && !e.paused && !e.ended && !e.muted && e.volume > 0 && e.readyState > 2; }
        catch (x) { return false; }
    }
    function medyaDom(kok, derinlik) {
        try {
            var m = kok.querySelectorAll('video, audio');
            for (var i = 0; i < m.length; i++) if (oynuyor(m[i])) return true;
            if (derinlik < 2) {
                var fs = kok.getElementsByTagName('iframe');
                for (var j = 0; j < fs.length; j++) {
                    var d = null;
                    try { d = fs[j].contentDocument; } catch (e) { d = null; }
                    if (d && medyaDom(d, derinlik + 1)) return true;
                }
            }
        } catch (e) { }
        return false;
    }
    function medyaOynuyor() {
        for (var i = 0; i < medyalar.length; i++) if (oynuyor(medyalar[i])) return true;
        return medyaDom(document, 0);
    }
    /* yabancı çerçevede (YouTube…) hareket görülmez: odak oradayken en çok 15 dk */
    function yabanciCerceveOdakta(simdi) {
        var a = null, yabanci = false, odak = false;
        try { a = document.activeElement; } catch (e) { }
        if (a && a.tagName === 'IFRAME') {
            var d = null;
            try { d = a.contentDocument; } catch (e) { d = null; }
            yabanci = !d;
        }
        try { odak = document.hasFocus(); } catch (e) { }
        if (!yabanci || !odak) { cerceveOdakBas = 0; return false; }
        if (!cerceveOdakBas) cerceveOdakBas = simdi;
        return (simdi - cerceveOdakBas) / 1000 <= CERCEVE_EN_COK_SN;
    }
    function tamEkran() {
        try { return !!(document.fullscreenElement || document.webkitFullscreenElement); } catch (e) { return false; }
    }
    function etkinMi(simdi) {
        if (document.visibilityState !== 'visible') return false;      /* arka planda sayma */
        var sinir = tamEkran() ? BOSTA_SUNUM_SN : BOSTA_SN;
        if ((simdi - sonHareket) / 1000 <= sinir) return true;
        if (medyaOynuyor()) return true;
        return yabanciCerceveOdakta(simdi);
    }
    /* ÇİFT SAYIM YOK: aynı tarayıcıda başka bir sekmeye bizden SONRA dokunulduysa
       (ve o dokunuş tazeyse) o sekme sayar, bu saymaz. */
    function baskaSekmede(simdi) {
        var e = yerelJ(ETKIN);
        if (!e || e.s === SEKME || !e.t) return false;
        return e.t > sonHareket && (simdi - e.t) / 1000 <= BOSTA_SN;
    }

    /* ------------------------------------------------------------ sayaç */
    var sonOturumT = 0;            /* depo yoksa da ziyaret bu sekmede bir kez sayılsın */
    function ekle(sn, simdi) {
        var g = bugun();
        acik.sn += sn;
        acik.gun[g] = (acik.gun[g] || 0) + sn;
        oturumToplam += sn;
        var o = Math.max(+yerel(OTURUM) || 0, sonOturumT);
        if (!o || simdi - o > OTURUM_ARA_SN * 1000) acik.ot += 1;
        sonOturumT = simdi;
        yerelYaz(OTURUM, String(simdi));
    }
    function vur() {
        var simdi = Date.now();
        var fark = (simdi - sonVuru) / 1000;
        sonVuru = simdi;
        try { cerceveleriBagla(document, 0); } catch (e) { }
        var uid = uidSimdi();
        if (uid && uid !== acikUid) {
            /* başka hesaba geçildi: eskinin birikeni mühürlenir. Hesap ilk kez belli
               olduysa (acikUid boş) o ana kadar birikenler bu hesabındır. */
            if (acikUid) { muhurle(); acik = { sn: 0, gun: {}, ot: 0 }; }
            acikUid = uid;
        } else if (uid === null && acikUid) {               /* çıkış yapıldı */
            muhurle();
            acik = { sn: 0, gun: {}, ot: 0 };
            acikUid = null;
        }
        if (fark <= 0 || fark > ATLAMA_SN) return;          /* uyku / saat sıçraması */
        if (!etkinMi(simdi) || baskaSekmede(simdi)) return;
        ekle(fark, simdi);
    }
    /* bellekteki saniyeler tarayıcıya PARÇA olarak (bir kez yazılır, değişmez) */
    function muhurle() {
        if (acik.sn < 1 || !depoVar) return false;           /* depo yoksa bellekte kalır */
        if (!acikUid) {
            if (Date.now() - basla > 120000) acik = { sn: 0, gun: {}, ot: 0 };   /* giriş yok: kimseye yazılmaz */
            return false;
        }
        if (anahtarlar(ON).length >= PARCA_SINIR) return false;               /* çok birikti: bellekte bekler */
        var p = { sn: yuvarla(acik.sn), gun: {}, a: ALAN, t: Date.now() };
        Object.keys(acik.gun).forEach(function (g) { var v = yuvarla(acik.gun[g]); if (v > 0) p.gun[g] = v; });
        if (acik.ot) p.ot = acik.ot;
        if (!yerelYaz(ON + acikUid + ':' + SEKME + ':' + (++parcaSira), p)) return false;
        acik = { sn: 0, gun: {}, ot: 0 };
        muhurSon = Date.now();
        return true;
    }

    /* ------------------------------------------------------------ buluta aktarım */
    function dbAl() {
        try { return (window.firebase && firebase.firestore) ? firebase.firestore() : null; } catch (e) { return null; }
    }
    function aktarabilir() {
        try { return fbVar() && !!dbAl() && !!(firebase.firestore.FieldValue && firebase.firestore.FieldValue.increment); }
        catch (e) { return false; }
    }
    /* sekmeler arası kilit: aynı parçayı iki sekme birden yazmasın */
    function kilitle(is) {
        try {
            if (navigator.locks && navigator.locks.request) {
                return navigator.locks.request('kidef-sure-aktar', { ifAvailable: true }, function (l) { return l ? is() : 0; });
            }
        } catch (e) { }
        var simdi = Date.now(), k = yerelJ(KILIT);
        if (k && k.s !== SEKME && simdi - k.t < 45000) return Promise.resolve(0);
        yerelYaz(KILIT, { s: SEKME, t: simdi });
        return new Promise(function (r) { setTimeout(r, 150); }).then(function () {
            var k2 = yerelJ(KILIT);
            if (!k2 || k2.s !== SEKME) return 0;
            return Promise.resolve().then(is).then(function (x) { yerelSil(KILIT); return x; },
                                                   function (e) { yerelSil(KILIT); throw e; });
        });
    }
    function gonder(ref, u, tid) {
        var FV = firebase.firestore.FieldValue, art = FV.increment;
        var k = { sonGoruldu: FV.serverTimestamp(), parti: {} };
        k.parti[tid] = u.id;
        var sn = Math.round(u.sn);
        if (sn > 0) k.toplamSn = art(sn);
        var g = {}, gv = false;
        Object.keys(u.gun || {}).forEach(function (d) { var v = Math.round(u.gun[d]); if (v > 0) { g[d] = art(v); gv = true; } });
        if (gv) k.gun = g;
        var a = {}, av = false;
        Object.keys(u.alan || {}).forEach(function (x) { var v = Math.round(u.alan[x]); if (v > 0) { a[x] = art(v); av = true; } });
        if (av) k.alan = a;
        if (u.ot > 0) k.oturum = art(u.ot);
        return zamanAsimi(ref.set({ kullanim: k }, { merge: true }), 20000);
    }
    function aktarIc(uid) {
        var D = dbAl(), ref = D.collection('kullanicilar').doc(uid), tid = tarayiciId();
        var uk = UCUS + uid, ucus = yerelJ(uk);
        var adim = Promise.resolve();
        if (ucus && ucus.id) {
            /* önceki aktarım yarıda kaldı: partideki parçalar kalmışsa sil (partide sayılı);
               bulutta işlenmişse partiyi bırak, işlenmemişse aynı numarayla yeniden yaz */
            (ucus.k || []).forEach(yerelSil);
            adim = zamanAsimi(ref.get(), 15000).then(function (s) {
                var v = (s && s.exists && s.data()) || {};
                var p = (v.kullanim && v.kullanim.parti) || {};
                if (p[tid] === ucus.id) { yerelSil(uk); ucus = null; }
            });
        } else ucus = null;
        return adim.then(function () {
            if (!ucus) {
                var L = anahtarlar(ON + uid + ':');
                if (!L.length) return 0;
                var top = { sn: 0, gun: {}, alan: {}, ot: 0 };
                L.forEach(function (k) {
                    var p = yerelJ(k);
                    if (!p || !(p.sn > 0)) return;
                    var sn = Math.min(p.sn, PARCA_EN_COK_SN), oran = sn / p.sn;
                    top.sn += sn;
                    Object.keys(p.gun || {}).forEach(function (g) { top.gun[g] = (top.gun[g] || 0) + (+p.gun[g] || 0) * oran; });
                    var a = p.a || 'etkinlik';
                    top.alan[a] = (top.alan[a] || 0) + sn;
                    top.ot += (+p.ot || 0);
                });
                ucus = { id: tid + '.' + Date.now().toString(36), sn: yuvarla(top.sn), gun: top.gun, alan: top.alan, ot: top.ot, k: L };
                if (!yerelYaz(uk, ucus)) return 0;
                L.forEach(yerelSil);
            }
            return gonder(ref, ucus, tid).then(function () { yerelSil(uk); return ucus.sn; });
        });
    }
    /* depo yok: bellekteki doğrudan yazılır; yazılamazsa belleğe geri döner */
    function bellektenAktar(uid) {
        if (acik.sn < 1) return Promise.resolve(0);
        var a = {}; a[ALAN] = acik.sn;
        var g = acik, u = { id: tarayiciId() + '.' + Date.now().toString(36), sn: g.sn, gun: g.gun, alan: a, ot: g.ot };
        acik = { sn: 0, gun: {}, ot: 0 };
        sonAktarim = Date.now();
        var FV = firebase.firestore.FieldValue, k = { sonGoruldu: FV.serverTimestamp() };
        if (Math.round(u.sn) > 0) k.toplamSn = FV.increment(Math.round(u.sn));
        var gg = {}; Object.keys(u.gun).forEach(function (d) { var v = Math.round(u.gun[d]); if (v > 0) gg[d] = FV.increment(v); });
        k.gun = gg; k.alan = {}; k.alan[ALAN] = FV.increment(Math.round(u.sn));
        if (u.ot > 0) k.oturum = FV.increment(u.ot);
        return dbAl().collection('kullanicilar').doc(uid).set({ kullanim: k }, { merge: true }).then(function () { return u.sn; }, function () {
            acik.sn += g.sn; acik.ot += g.ot;
            Object.keys(g.gun).forEach(function (d) { acik.gun[d] = (acik.gun[d] || 0) + g.gun[d]; });
            return 0;
        });
    }
    function aktar() {
        var u = fbKullanici();
        if (!u || !aktarabilir() || aktariliyor) return Promise.resolve(0);
        if (!depoVar) return bellektenAktar(u.uid);
        muhurle();
        aktariliyor = true;
        sonAktarim = Date.now();
        return Promise.resolve().then(function () { return kilitle(function () { return aktarIc(u.uid); }); })
            .then(function (x) { aktariliyor = false; return x || 0; },
                  function (e) {
                      aktariliyor = false;
                      try { console.warn('süre buluta yazılamadı (tarayıcıda bekliyor):', e && (e.code || e.message)); } catch (x) { }
                      return 0;
                  });
    }

    /* ------------------------------------------------------------ açılış */
    /* eski sürümün bekleyeni (kidefKullanimBekleyen) parçaya dönüşür */
    (function eskiyiTasi() {
        var b = yerelJ(ESKI);
        if (!b) return;
        if (b.uid && b.sn > 0) yerelYaz(ON + b.uid + ':eski:' + Date.now().toString(36), { sn: yuvarla(b.sn), gun: b.gun || {}, a: 'site', t: Date.now() });
        yerelSil(ESKI);
    })();
    /* çok eski (başka hesabın, hiç aktarılmamış) parçalar silinir */
    (function eskiParcalar() {
        var sinir = Date.now() - ESKI_PARCA_GUN * 86400000;
        anahtarlar(ON).forEach(function (k) { var p = yerelJ(k); if (!p || (p.t && p.t < sinir)) yerelSil(k); });
    })();
    depodanUid();
    if (document.visibilityState === 'visible') hareket();      /* sayfayı açan kullanıcıdır */

    /* --- olaylar --- */
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') { sonVuru = Date.now(); hareket(); }
        else {
            vur(); muhurle();
            if (!depoVar || Date.now() - sonAktarim >= GIZLENINCE_EN_AZ_SN * 1000) aktar();
        }
    });
    window.addEventListener('pagehide', function () { vur(); muhurle(); if (!depoVar) aktar(); });
    window.addEventListener('beforeunload', function () { vur(); muhurle(); });
    document.addEventListener('freeze', function () { vur(); muhurle(); });
    window.addEventListener('pageshow', function (e) { if (e && e.persisted) sonVuru = Date.now(); });
    window.addEventListener('storage', function (e) {
        if (!e || !e.key) return;
        if (e.key === ETKIN) etkinBizde = false;               /* başka sekmeye dokunuldu */
        else if (e.key.indexOf('firebase:authUser:') === 0) depodanUid();
    });

    setInterval(function () {
        vur();
        if (Date.now() - muhurSon >= MUHUR_SN * 1000) muhurle();
        if (fbKullanici() && Date.now() - sonAktarim >= YAZ_ARALIK_SN * 1000) aktar();
    }, VURU_MS);
    setInterval(depodanUid, 120000);

    /* Firebase'li sayfa: oturum gelince bekleyen parça varsa hemen aktar */
    (function authIzle() {
        var n = 0, t = setInterval(function () {
            n++;
            var bagli = false;
            if (fbVar()) {
                try {
                    firebase.auth().onAuthStateChanged(function (u) {
                        authHazir = true;
                        var id = (u && !u.isAnonymous) ? u.uid : null;
                        if (id && (anahtarlar(ON + id + ':').length || yerelJ(UCUS + id))) setTimeout(aktar, 4000);
                    });
                    bagli = true;
                } catch (e) { }
            }
            if (bagli || n > 480) clearInterval(t);                        /* en çok 2 dk bekler */
        }, 250);
    })();

    /* Okunur biçim: 3 sa 05 dk / 48 dk / 35 sn */
    function bicim(sn) {
        sn = Math.max(0, Math.round(sn || 0));
        if (sn < 60) return sn + ' sn';
        var d = Math.floor(sn / 60), s = Math.floor(d / 60);
        if (s < 1) return d + ' dk';
        return s + ' sa ' + (d % 60) + ' dk';
    }
    window.KidefKullanim = {
        bicim: bicim,
        alan: ALAN,
        /* bekleyenleri hemen yaz (çıkıştan önce çağrılabilir) */
        yaz: function () { vur(); muhurle(); return aktar(); },
        /* Bu sayfa açıldığından beri sayılan etkin saniye — profildeki
           'bu oturum' satırı bunu gösterir. */
        oturum: function () { vur(); return Math.round(oturumToplam); },
        _durum: function () {
            return { sekme: SEKME, alan: ALAN, acik: JSON.parse(JSON.stringify(acik)), uid: acikUid, depoUid: depoUid,
                     sonHareket: sonHareket, parca: anahtarlar(ON).length, authHazir: authHazir };
        },
        _vur: vur, _muhurle: muhurle, _aktar: aktar, _depodanUid: depodanUid
    };
})();
