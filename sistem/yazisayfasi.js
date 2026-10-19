/* =====================================================================
   KİDEF · YAZI SAYFASI                         (sistem/yazisayfasi.js)
   ---------------------------------------------------------------------
   Öğretmen (19.10.2026): "popup şeklinde bi tane yazı sayfası yapalım,
   diyelimki dijital olarak bi şeyler çizmek istedim, 5 renk olsun, 1 kalem
   bi silgi, gri çizgiler, arapça küçük ve büyük harfler için çizgiler
   olsun, sınıf materyalleri açıkken bu popup açılsın, tarayıcı hafızasında
   ne yazılmışsa önceki derslerde görülebilsin, yazı sayfası kapanınca
   yazıldığı tarih kaydedilsin, eğer sayfa beğenilirse seviye notlarına
   kaydedilebilsin". Seçilen ek: defter gibi çok sayfa. Seviye notları
   hesapta (her cihazda).

   NEREDE: sınıf materyallerinde (İmam Hatip 5-10 ve sınıfın Materyaller
   sekmesi) «Yazı Sayfası» kartı — yalnız öğretmen/yönetici görür. Karta
   basınca o sınıfın (seviyenin) yazı sayfası açılır.

   ARAÇLAR: kalem · silgi · 5 renk · 3 kalınlık · çizgi düzeni (gri
   çizgiler / Arapça büyük harf / Arapça küçük harf / boş) · geri al,
   yinele, temizle · sayfalar (ekle, kaldır, ‹ ›) · tam ekran.
   Kısayollar: Ctrl+Z / Ctrl+Y, K kalem, S silgi, 1-5 renk, ← → sayfa, Esc.

   KAYIT
   · GEÇMİŞ (bu tarayıcı, IndexedDB «kidef-yazi»): yazılan defter açıkken
     arada bir ve KAPANINCA tarihiyle kaydedilir; «Geçmiş» panelinde
     sınıf sınıf, tarih sırasıyla görünür, açılıp devam edilir. Sınıf
     başına son 60 defter tutulur.
   · SEVİYE NOTLARI (hesap, her cihaz): kullanicilar/{uid}.seviyeNotlari
     = { s5: [ {id, ad, tarih, sayfa, kod} ] } — seviye başına en çok 20.
     Firestore kurallarına dokunulmadı (öğretmen kendi belgesini yazar).
   Çizimler resim değil, ÇİZGİ olarak saklanır (noktalar, sıkıştırılmış):
   her ekranda keskin görünür, az yer tutar. 1000 × 625 birimlik sayfa.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefYaziSayfasi) return;

    /* ------------------------------------------------------------------
       SABİTLER
       ------------------------------------------------------------------ */
    var W = 1000, H = 625;                     /* mantıksal sayfa (16:10) */
    var RENKLER = [
        { ad: 'Siyah',   k: '#1F2430' },
        { ad: 'Mavi',    k: '#1E5BD8' },
        { ad: 'Kırmızı', k: '#D93025' },
        { ad: 'Yeşil',   k: '#188038' },
        { ad: 'Turuncu', k: '#EA7A0C' }
    ];
    var KALINLIK = [
        { id: 'i', ad: 'İnce', w: 2.4 },
        { id: 'o', ad: 'Orta', w: 4.4 },
        { id: 'k', ad: 'Kalın', w: 8 }
    ];
    var SILGI_W = 28;
    var MODLAR = [
        { id: 'c', ad: 'Gri çizgiler' },
        { id: 'b', ad: 'Arapça · büyük harf' },
        { id: 'k', ad: 'Arapça · küçük harf' },
        { id: 'o', ad: 'Boş sayfa' }
    ];
    var GECMIS_EN_COK = 60;                    /* sınıf başına */
    var NOT_EN_COK = 20;                       /* seviye başına */
    var NOT_TEK_SINIR = 45000;                 /* bir notun en büyük boyu (karakter) */
    var NOT_TOPLAM_SINIR = 350000;             /* bütün seviye notları birlikte */
    var TERCIH = 'kidefYaziTercih';

    /* ------------------------------------------------------------------
       KÜÇÜK YARDIMCILAR
       ------------------------------------------------------------------ */
    function esc(x) {
        return String(x == null ? '' : x)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function rol() {
        try { return (typeof appState !== 'undefined' && appState) ? (appState.userRole || '') : ''; } catch (e) { return ''; }
    }
    function ogretmenMi() { var r = rol(); return r === 'teacher' || r === 'admin'; }
    function benKim() { try { return firebase.auth().currentUser || null; } catch (e) { return null; } }
    function tarihYaz(ms, saatli) {
        var d = new Date(ms);
        if (isNaN(d.getTime())) return '—';
        var o = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
        if (saatli) { o.hour = '2-digit'; o.minute = '2-digit'; }
        return d.toLocaleString('tr-TR', o);
    }
    function kisaTarih(ms) {
        var d = new Date(ms);
        return isNaN(d.getTime()) ? '' : d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    function tercihOku() {
        try { return JSON.parse(localStorage.getItem(TERCIH) || '{}') || {}; } catch (e) { return {}; }
    }
    function tercihYaz(t) {
        try { localStorage.setItem(TERCIH, JSON.stringify(t)); } catch (e) { }
    }
    function yeniId() { return 'y' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
    function subeAdi() {
        /* Öğretmen bir şube seçmişse (listelerim) geçmiş kaydında adı görünsün */
        try {
            if (typeof window.llAktifSinif !== 'function') return '';
            var a = window.llAktifSinif();
            if (!a || !a.lId || !a.cId || typeof data === 'undefined' || !data || !data.levels) return '';
            var c = data.levels[a.lId] && data.levels[a.lId].classes && data.levels[a.lId].classes[a.cId];
            return (c && c.name) ? String(c.name) : '';
        } catch (e) { return ''; }
    }

    /* ------------------------------------------------------------------
       ÇİZGİLERİ SAKLAMA BİÇİMİ
       Noktalar yarım birim hassasiyetle tam sayıya çevrilir, ardışık
       farklar "polyline" kodlamasıyla (ASCII 63-126) yazılır.
       Defter: "Y1|" + sayfalar (\n ile); sayfa: düzen harfi + çizgiler
       (boşlukla); çizgi: renk harfi ('0'-'4', silgi 'x') + kalınlık
       harfi ('i','o','k','s') + noktalar.
       ------------------------------------------------------------------ */
    function sayiKodla(n, out) {
        var v = n < 0 ? ~(n << 1) : (n << 1);
        while (v >= 0x20) { out.push(String.fromCharCode((0x20 | (v & 0x1f)) + 63)); v >>= 5; }
        out.push(String.fromCharCode(v + 63));
    }
    function sayilariCoz(s) {
        var res = [], i = 0, n = s.length;
        while (i < n) {
            var b, kay = 0, r = 0;
            do { b = s.charCodeAt(i++) - 63; r |= (b & 0x1f) << kay; kay += 5; } while (b >= 0x20 && i <= n);
            res.push((r & 1) ? ~(r >> 1) : (r >> 1));
        }
        return res;
    }
    function cizgiKodla(c) {
        var out = [c.s ? 'x' : String(c.r), c.s ? 's' : c.k];
        var px = 0, py = 0;
        for (var i = 0; i < c.p.length; i += 2) {
            var x = Math.round(c.p[i] * 2), y = Math.round(c.p[i + 1] * 2);
            sayiKodla(x - px, out); sayiKodla(y - py, out);
            px = x; py = y;
        }
        return out.join('');
    }
    function cizgiCoz(t) {
        if (!t || t.length < 2) return null;
        var sayi = sayilariCoz(t.slice(2)), p = [], x = 0, y = 0;
        for (var i = 0; i + 1 < sayi.length; i += 2) { x += sayi[i]; y += sayi[i + 1]; p.push(x / 2, y / 2); }
        if (!p.length) return null;
        var silgi = t.charAt(0) === 'x';
        return { r: silgi ? 0 : Math.max(0, Math.min(4, +t.charAt(0) || 0)), k: silgi ? 'o' : t.charAt(1), s: silgi ? 1 : 0, p: p };
    }
    function defterKodla(sayfalar) {
        return 'Y1|' + sayfalar.map(function (s) {
            return s.mod + s.cizimler.map(cizgiKodla).map(function (x) { return ' ' + x; }).join('');
        }).join('\n');
    }
    function defterCoz(kod) {
        if (!kod || kod.indexOf('Y1|') !== 0) return [yeniSayfa('c')];
        var L = kod.slice(3).split('\n').map(function (ps) {
            var mod = ps.charAt(0) || 'c';
            var c = ps.slice(1).split(' ').filter(Boolean).map(cizgiCoz).filter(Boolean);
            var s = yeniSayfa(mod); s.cizimler = c; return s;
        });
        return L.length ? L : [yeniSayfa('c')];
    }
    function yeniSayfa(mod) { return { mod: mod || 'c', cizimler: [], geri: [], ileri: [] }; }

    /* Ramer–Douglas–Peucker: çizgi biterken gereksiz noktalar atılır */
    function sadelestir(p, tol) {
        var n = p.length / 2;
        if (n <= 2) return p.slice();
        var tut = new Uint8Array(n); tut[0] = tut[n - 1] = 1;
        var yigin = [[0, n - 1]];
        while (yigin.length) {
            var ab = yigin.pop(), a = ab[0], b = ab[1];
            var ax = p[a * 2], ay = p[a * 2 + 1], bx = p[b * 2], by = p[b * 2 + 1];
            var dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy, en = -1, eni = -1;
            for (var i = a + 1; i < b; i++) {
                var px = p[i * 2], py = p[i * 2 + 1], d;
                if (L2 === 0) d = (px - ax) * (px - ax) + (py - ay) * (py - ay);
                else {
                    var t = ((px - ax) * dx + (py - ay) * dy) / L2;
                    t = Math.max(0, Math.min(1, t));
                    var qx = ax + t * dx - px, qy = ay + t * dy - py;
                    d = qx * qx + qy * qy;
                }
                if (d > en) { en = d; eni = i; }
            }
            if (en > tol * tol && eni > 0) { tut[eni] = 1; yigin.push([a, eni], [eni, b]); }
        }
        var out = [];
        for (var j = 0; j < n; j++) if (tut[j]) out.push(p[j * 2], p[j * 2 + 1]);
        return out;
    }
    function bosMu(sayfalar) {
        return !sayfalar.some(function (s) { return s.cizimler.length; });
    }

    /* ------------------------------------------------------------------
       ÇİZİM
       ------------------------------------------------------------------ */
    function kalinlikW(k) {
        for (var i = 0; i < KALINLIK.length; i++) if (KALINLIK[i].id === k) return KALINLIK[i].w;
        return KALINLIK[1].w;
    }
    function cizgileriCiz(ctx, mod, o) {
        ctx.save();
        ctx.setTransform(o, 0, 0, o, 0, 0);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, W, H);
        function yatay(y, renk, kal, kesik) {
            ctx.beginPath();
            ctx.setLineDash(kesik ? [7, 7] : []);
            ctx.strokeStyle = renk; ctx.lineWidth = kal;
            ctx.moveTo(18, y); ctx.lineTo(W - 18, y); ctx.stroke();
        }
        if (mod === 'c') {
            for (var y = 74; y < H - 16; y += 44) yatay(y, '#D6DBE2', 1.3, false);
        } else if (mod === 'b' || mod === 'k') {
            /* Arapça yazı satırı: üst çizgi (elif boyu), kesik orta çizgi
               (diş yüksekliği), koyu taban çizgisi, alt çizgi (inen harfler) */
            var boy = mod === 'b' ? 150 : 82, ara = mod === 'b' ? 34 : 22, y0 = mod === 'b' ? 36 : 28;
            for (var r = y0; r + boy <= H - 12; r += boy + ara) {
                ctx.fillStyle = '#F7F9FC';
                ctx.fillRect(18, r + boy * 0.40, W - 36, boy * 0.25);
                yatay(r, '#E1E5EB', 1.2, false);
                yatay(r + boy * 0.40, '#CDD3DB', 1.1, true);
                yatay(r + boy * 0.65, '#97A1AD', 1.9, false);
                yatay(r + boy, '#E1E5EB', 1.2, false);
            }
        }
        if (mod !== 'o') {
            /* Arapça sağdan başlar: kenar boşluğu çizgisi sağda */
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(232,124,124,.55)'; ctx.lineWidth = 1.4;
            ctx.moveTo(W - 44, 10); ctx.lineTo(W - 44, H - 10); ctx.stroke();
        }
        ctx.restore();
    }
    function cizimCiz(ctx, c, o) {
        var p = c.p, n = p.length / 2;
        if (!n) return;
        ctx.save();
        ctx.setTransform(o, 0, 0, o, 0, 0);
        ctx.globalCompositeOperation = c.s ? 'destination-out' : 'source-over';
        var w = c.s ? SILGI_W : kalinlikW(c.k);
        var renk = c.s ? '#000' : (RENKLER[c.r] || RENKLER[0]).k;
        if (n === 1) {
            ctx.beginPath(); ctx.fillStyle = renk;
            ctx.arc(p[0], p[1], w / 2, 0, Math.PI * 2); ctx.fill();
            ctx.restore(); return;
        }
        ctx.beginPath();
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = renk; ctx.lineWidth = w;
        ctx.moveTo(p[0], p[1]);
        for (var i = 1; i < n - 1; i++) {
            var mx = (p[i * 2] + p[i * 2 + 2]) / 2, my = (p[i * 2 + 1] + p[i * 2 + 3]) / 2;
            ctx.quadraticCurveTo(p[i * 2], p[i * 2 + 1], mx, my);
        }
        ctx.lineTo(p[(n - 1) * 2], p[(n - 1) * 2 + 1]);
        ctx.stroke();
        ctx.restore();
    }
    /* Küçük önizleme (geçmiş ve notlar listesi için) */
    function onizlemeCiz(canvas, sayfa) {
        var o = canvas.width / W;
        var ctx = canvas.getContext('2d');
        cizgileriCiz(ctx, sayfa.mod, o);
        var tmp = document.createElement('canvas');
        tmp.width = canvas.width; tmp.height = canvas.height;
        var t = tmp.getContext('2d');
        sayfa.cizimler.forEach(function (c) { cizimCiz(t, c, o); });
        ctx.drawImage(tmp, 0, 0);
    }
    function onizlemeUrl(sayfa) {
        try {
            var c = document.createElement('canvas');
            c.width = 240; c.height = 150;
            onizlemeCiz(c, sayfa);
            return c.toDataURL('image/png');
        } catch (e) { return ''; }
    }

    /* ------------------------------------------------------------------
       GEÇMİŞ — bu tarayıcıda (IndexedDB; olmazsa localStorage)
       ------------------------------------------------------------------ */
    var _idb = null;
    function idbAc() {
        if (_idb) return _idb;
        _idb = new Promise(function (res, rej) {
            try {
                if (!window.indexedDB) { rej(new Error('IndexedDB yok')); return; }
                var r = indexedDB.open('kidef-yazi', 1);
                r.onupgradeneeded = function () {
                    var db = r.result;
                    if (!db.objectStoreNames.contains('defterler')) {
                        var st = db.createObjectStore('defterler', { keyPath: 'id' });
                        st.createIndex('sinif', 'sinif');
                    }
                };
                r.onsuccess = function () { res(r.result); };
                r.onerror = function () { rej(r.error || new Error('IndexedDB açılamadı')); };
            } catch (e) { rej(e); }
        });
        _idb.catch(function () { _idb = null; });
        return _idb;
    }
    function lsAnahtar(sinif) { return 'kidefYaziGecmis_' + sinif; }
    function lsOku(sinif) { try { return JSON.parse(localStorage.getItem(lsAnahtar(sinif)) || '[]') || []; } catch (e) { return []; } }
    function lsYaz(sinif, L) { try { localStorage.setItem(lsAnahtar(sinif), JSON.stringify(L.slice(0, 15))); } catch (e) { } }

    function gecmisListe(sinif) {
        return idbAc().then(function (db) {
            return new Promise(function (res, rej) {
                var L = [];
                var tx = db.transaction('defterler', 'readonly');
                var ix = tx.objectStore('defterler').index('sinif');
                var q = ix.openCursor(IDBKeyRange.only(String(sinif)));
                q.onsuccess = function () {
                    var c = q.result;
                    if (c) { L.push(c.value); c.continue(); }
                    else res(L.sort(function (a, b) { return (b.guncelleme || 0) - (a.guncelleme || 0); }));
                };
                q.onerror = function () { rej(q.error); };
            });
        }).catch(function () {
            return lsOku(sinif).sort(function (a, b) { return (b.guncelleme || 0) - (a.guncelleme || 0); });
        });
    }
    function gecmisKoy(kayit) {
        return idbAc().then(function (db) {
            return new Promise(function (res, rej) {
                var tx = db.transaction('defterler', 'readwrite');
                tx.objectStore('defterler').put(kayit);
                tx.oncomplete = function () { res(); };
                tx.onerror = function () { rej(tx.error); };
            });
        }).then(function () {
            return gecmisListe(kayit.sinif).then(function (L) {
                var fazla = L.slice(GECMIS_EN_COK);
                return Promise.all(fazla.map(function (k) { return gecmisSil(k.id, k.sinif); }));
            });
        }).catch(function () {
            var L = lsOku(kayit.sinif).filter(function (k) { return k.id !== kayit.id; });
            L.unshift(kayit);
            lsYaz(kayit.sinif, L);
        });
    }
    function gecmisSil(id, sinif) {
        return idbAc().then(function (db) {
            return new Promise(function (res, rej) {
                var tx = db.transaction('defterler', 'readwrite');
                tx.objectStore('defterler').delete(id);
                tx.oncomplete = function () { res(); };
                tx.onerror = function () { rej(tx.error); };
            });
        }).catch(function () {
            lsYaz(sinif, lsOku(sinif).filter(function (k) { return k.id !== id; }));
        });
    }

    /* ------------------------------------------------------------------
       SEVİYE NOTLARI — hesapta (kullanicilar/{uid}.seviyeNotlari)
       ------------------------------------------------------------------ */
    function benBelge() {
        var u = benKim();
        try { return u ? firebase.firestore().collection('kullanicilar').doc(u.uid) : null; } catch (e) { return null; }
    }
    function notlarHepsi() {
        var ref = benBelge();
        if (!ref) return Promise.reject(new Error('giris'));
        return ref.get().then(function (s) {
            var d = s.exists ? (s.data() || {}) : {};
            return (d.seviyeNotlari && typeof d.seviyeNotlari === 'object') ? d.seviyeNotlari : {};
        });
    }
    function notlarYaz(sinif, L) {
        var ref = benBelge();
        if (!ref) return Promise.reject(new Error('giris'));
        var g = {}; g['seviyeNotlari.s' + sinif] = L;
        return ref.update(g);
    }

    /* ------------------------------------------------------------------
       STİL
       ------------------------------------------------------------------ */
    function stilKur() {
        if (document.getElementById('ys-stil')) return;
        var s = document.createElement('style');
        s.id = 'ys-stil';
        s.textContent = [
            '#ysOrt{position:fixed; inset:0; z-index:99990; background:rgba(15,23,42,.62); display:flex; align-items:center;',
            '  justify-content:center; padding:14px; animation:ysSol .18s ease-out; font-family:inherit;}',
            '@keyframes ysSol{from{opacity:0}to{opacity:1}}',
            '#ysKutu{position:relative; width:min(1280px,100%); height:min(860px,100%); background:#EEF1F5; border-radius:18px;',
            '  box-shadow:0 30px 80px rgba(15,23,42,.4); display:flex; flex-direction:column; overflow:hidden;',
            '  animation:ysCik .24s cubic-bezier(.2,1.1,.4,1); color:#1F2430;}',
            '@keyframes ysCik{from{transform:translateY(14px) scale(.985); opacity:0}to{transform:none; opacity:1}}',
            '#ysOrt:fullscreen{padding:0;} #ysOrt:fullscreen #ysKutu{width:100%; height:100%; border-radius:0;}',
            '.ys-arac{display:flex; align-items:center; gap:6px; flex-wrap:wrap; padding:9px 12px; background:#fff;',
            '  border-bottom:1px solid #E2E7EE; flex:none;}',
            '.ys-baslik{display:flex; align-items:center; gap:8px; font-weight:900; color:#1B4F9C; margin-inline-end:6px; white-space:nowrap;}',
            '.ys-baslik svg{width:26px; height:26px;}',
            '.ys-baslik small{display:block; font-size:.7rem; font-weight:700; color:#8A94A3;}',
            '.ys-grup{display:flex; align-items:center; gap:3px; padding:3px; background:#F2F5F9; border-radius:12px;}',
            '.ys-ayrac{width:1px; height:28px; background:#E2E7EE; margin:0 3px;}',
            '.ys-t{border:0; background:transparent; cursor:pointer; min-width:36px; height:36px; border-radius:9px; display:inline-flex;',
            '  align-items:center; justify-content:center; gap:6px; color:#3D4756; font-family:inherit; font-size:.82rem; font-weight:800;',
            '  padding:0 8px; transition:background .12s, color .12s, transform .12s;}',
            '.ys-t svg{width:20px; height:20px; flex:none;}',
            '.ys-t:hover{background:#E5EBF3;}',
            '.ys-t.sec{background:#1B4F9C; color:#fff;}',
            '.ys-t[disabled]{opacity:.35; cursor:default; background:transparent;}',
            '.ys-renk{width:30px; height:30px; min-width:30px; border-radius:50%; border:3px solid #fff; box-shadow:0 0 0 1.5px #D5DCE5;',
            '  cursor:pointer; transition:transform .12s, box-shadow .12s; padding:0;}',
            '.ys-renk:hover{transform:scale(1.1);}',
            '.ys-renk.sec{box-shadow:0 0 0 2.5px #1B4F9C; transform:scale(1.12);}',
            '.ys-kal{width:34px; height:34px; min-width:34px; border:0; background:transparent; border-radius:9px; cursor:pointer;',
            '  display:inline-flex; align-items:center; justify-content:center;}',
            '.ys-kal i{display:block; border-radius:50%; background:#3D4756;}',
            '.ys-kal.sec{background:#DCE7F7;}',
            '.ys-kal:hover{background:#E5EBF3;}',
            '.ys-mod{width:40px; height:34px; border:0; background:transparent; border-radius:9px; cursor:pointer; padding:0;',
            '  display:inline-flex; align-items:center; justify-content:center;}',
            '.ys-mod svg{width:30px; height:22px;}',
            '.ys-mod.sec{background:#DCE7F7;}',
            '.ys-mod:hover{background:#E5EBF3;}',
            '.ys-sayfa{font-weight:900; font-size:.85rem; min-width:46px; text-align:center; color:#1F2430; font-variant-numeric:tabular-nums;}',
            '.ys-bos{flex:1 1 auto;}',
            '.ys-t.ana{background:#FFF4DE; color:#9A6512;}',
            '.ys-t.ana:hover{background:#FDEBC8;}',
            '.ys-t.kapat{background:#F1F4F9; font-size:1.25rem; font-weight:700;}',
            '.ys-sahne{position:relative; flex:1 1 auto; display:flex; align-items:center; justify-content:center; padding:14px; min-height:0;}',
            '.ys-kagit{position:relative; background:#fff; border-radius:6px; box-shadow:0 10px 30px rgba(15,23,42,.14), 0 0 0 1px #DDE3EA;}',
            '.ys-kagit canvas{position:absolute; inset:0; width:100%; height:100%; border-radius:6px;}',
            '.ys-kagit .ys-ust{touch-action:none; cursor:crosshair;}',
            '.ys-kagit.silgi .ys-ust{cursor:none;}',
            '.ys-silgi-iz{position:absolute; pointer-events:none; border:2px solid rgba(27,79,156,.55); background:rgba(255,255,255,.35);',
            '  border-radius:50%; transform:translate(-50%,-50%); display:none;}',
            '.ys-kagit.silgi .ys-silgi-iz.gor{display:block;}',
            '.ys-ipucu{position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); pointer-events:none; text-align:center;',
            '  color:#A3ADBA; font-weight:800; font-size:1.05rem; transition:opacity .3s;}',
            '.ys-ipucu svg{display:block; margin:0 auto 6px; width:46px; height:46px; opacity:.6;}',
            '.ys-ipucu.gizli{opacity:0;}',
            '.ys-son{position:absolute; left:50%; bottom:18px; transform:translateX(-50%); background:#1F2430; color:#fff; border-radius:999px;',
            '  padding:8px 8px 8px 16px; display:flex; align-items:center; gap:10px; font-size:.85rem; box-shadow:0 8px 22px rgba(0,0,0,.25);}',
            '.ys-son button{border:0; background:#fff; color:#1F2430; border-radius:999px; padding:6px 13px; font-weight:800; cursor:pointer; font-family:inherit;}',
            '.ys-son .x{background:transparent; color:#fff; padding:6px 8px;}',
            '.ys-bildiri{position:absolute; left:50%; top:76px; transform:translateX(-50%); background:#1E8449; color:#fff; padding:9px 18px;',
            '  border-radius:999px; font-weight:800; font-size:.88rem; box-shadow:0 8px 22px rgba(0,0,0,.2); z-index:5;',
            '  animation:ysBildiri 2.6s ease forwards; pointer-events:none;}',
            '.ys-bildiri.hata{background:#B03A2E;}',
            '@keyframes ysBildiri{0%{opacity:0; transform:translate(-50%,-8px)}10%{opacity:1; transform:translate(-50%,0)}85%{opacity:1}100%{opacity:0}}',
            /* yan panel */
            '.ys-panel{position:absolute; top:0; bottom:0; right:0; width:min(400px,92%); background:#fff; box-shadow:-12px 0 30px rgba(15,23,42,.18);',
            '  display:flex; flex-direction:column; transform:translateX(105%); transition:transform .25s cubic-bezier(.2,.9,.3,1); z-index:6;}',
            '.ys-panel.acik{transform:none;}',
            '.ys-panel-bas{display:flex; align-items:center; gap:6px; padding:12px; border-bottom:1px solid #E8EDF3;}',
            '.ys-sek{border:0; background:#F2F5F9; border-radius:999px; padding:8px 14px; font-weight:800; font-size:.85rem; cursor:pointer;',
            '  color:#55606D; font-family:inherit;}',
            '.ys-sek.sec{background:#1B4F9C; color:#fff;}',
            '.ys-panel-ic{flex:1 1 auto; overflow:auto; padding:12px;}',
            '.ys-oge{display:flex; gap:11px; align-items:center; padding:9px; border:1px solid #E8EDF3; border-radius:12px; margin-bottom:9px;',
            '  cursor:pointer; transition:border-color .12s, box-shadow .12s; background:#fff;}',
            '.ys-oge:hover{border-color:#BFD3F2; box-shadow:0 6px 16px rgba(27,79,156,.08);}',
            '.ys-oge img,.ys-oge canvas{width:96px; height:60px; border-radius:6px; border:1px solid #E2E7EE; flex:none; background:#fff;}',
            '.ys-oge b{display:block; font-size:.88rem; color:#1F2430;}',
            '.ys-oge span{display:block; font-size:.78rem; color:#8A94A3; margin-top:2px;}',
            '.ys-oge .ys-ogesil{margin-inline-start:auto; border:0; background:#FDEDEC; color:#B03A2E; border-radius:8px; width:30px; height:30px;',
            '  cursor:pointer; flex:none; font-size:1rem;}',
            '.ys-oge.simdi{border-color:#1B4F9C; background:#F3F8FF;}',
            '.ys-yok{color:#A3ADBA; font-size:.9rem; text-align:center; padding:26px 8px; line-height:1.6;}',
            '.ys-bilgi{font-size:.8rem; color:#8A94A3; margin:0 0 10px; line-height:1.5;}',
            /* soru penceresi */
            '.ys-soru-ort{position:absolute; inset:0; background:rgba(15,23,42,.35); display:flex; align-items:center; justify-content:center; z-index:8;}',
            '.ys-soru{background:#fff; border-radius:16px; padding:18px; width:min(400px,92%); box-shadow:0 20px 50px rgba(0,0,0,.25);}',
            '.ys-soru p{margin:0 0 12px; font-weight:700; line-height:1.5;}',
            '.ys-soru input{width:100%; box-sizing:border-box; border:1.5px solid #D5DCE5; border-radius:10px; padding:10px 12px; font-family:inherit;',
            '  font-size:.95rem; margin-bottom:12px;}',
            '.ys-soru .ys-tuslar{display:flex; gap:8px; justify-content:flex-end;}',
            '.ys-soru button{border:0; border-radius:10px; padding:9px 16px; font-weight:800; cursor:pointer; font-family:inherit;}',
            '.ys-soru .evet{background:#1B4F9C; color:#fff;} .ys-soru .evet.kirmizi{background:#C0392B;}',
            '.ys-soru .hayir{background:#F1F4F9; color:#3D4756;}',
            /* telefonda araç çubuğu satırlara sarılır (kapat tuşu görünür kalsın) */
            '@media (max-width:760px){#ysOrt{padding:0;} #ysKutu{width:100%; height:100%; border-radius:0;}',
            '  .ys-arac{gap:4px; padding:7px 8px;} .ys-baslik small,.ys-ayrac,.ys-t span{display:none;}',
            '  .ys-t{min-width:32px; height:32px; padding:0 5px;} .ys-renk{width:26px; height:26px; min-width:26px;}',
            '  .ys-kal,.ys-mod{width:32px; height:30px; min-width:32px;} .ys-mod svg{width:26px; height:19px;}',
            '  .ys-t.kapat{position:absolute; top:7px; right:8px;} .ys-arac{padding-right:48px;}',
            '  .ys-sahne{padding:8px;} .ys-son{font-size:.78rem; max-width:92%;}}',
            '@media (prefers-reduced-motion: reduce){#ysOrt,#ysKutu,.ys-bildiri{animation:none;} .ys-panel{transition:none;}}'
        ].join('\n');
        document.head.appendChild(s);
    }

    /* ------------------------------------------------------------------
       SİMGELER
       ------------------------------------------------------------------ */
    var IK = {
        kalem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 4.8l4 4L8.4 19.6 3.6 20.4l.8-4.8z"/><path d="M13.6 6.4l4 4"/></svg>',
        silgi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.6 20.4h11.6"/><path d="M5.2 15.4 14.8 5.8a2 2 0 0 1 2.8 0l2.6 2.6a2 2 0 0 1 0 2.8L12 19.4H8.8l-3.6-3.6a.3.3 0 0 1 0-.4z"/><path d="M9.6 11l5.2 5.2"/></svg>',
        geri: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>',
        ileri: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/></svg>',
        temizle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
        onceki: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
        sonraki: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
        yeniSayfa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 11v6M9 14h6"/></svg>',
        sayfaSil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 14h6"/></svg>',
        yildiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z"/></svg>',
        saat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3 2"/></svg>',
        tamEkran: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
        defter: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="8" width="40" height="48" rx="4" fill="#fff" stroke="#1B4F9C" stroke-width="3"/>' +
            '<path d="M16 20h28M16 29h28M16 38h28M16 47h20" stroke="#C9D2DE" stroke-width="2.4" stroke-linecap="round"/>' +
            '<path d="M44 8v48" stroke="#F2A0A0" stroke-width="2"/>' +
            '<path d="M47 44 57 34l4 4-10 10-5.6 1.6z" fill="#F2B544" stroke="#9A6512" stroke-width="2" stroke-linejoin="round"/></svg>'
    };
    function modSvg(id) {
        var c = '#9AA4B2', s = '<svg viewBox="0 0 30 22" aria-hidden="true"><rect x="1" y="1" width="28" height="20" rx="3" fill="#fff" stroke="#C5CDD8"/>';
        if (id === 'c') s += '<path d="M4 7h22M4 11h22M4 15h22" stroke="' + c + '" stroke-width="1.2"/>';
        else if (id === 'b') s += '<path d="M4 4.5h22" stroke="#C9D0DA"/><path d="M4 10h22" stroke="#B9C1CC" stroke-dasharray="2 2"/><path d="M4 13.5h22" stroke="#6E7A89" stroke-width="1.5"/><path d="M4 18h22" stroke="#C9D0DA"/>';
        else if (id === 'k') s += '<path d="M4 3.5h22M4 9.5h22M4 12.5h22M4 17.5h22" stroke="#C9D0DA" stroke-width=".9"/><path d="M4 6.2h22M4 15.3h22" stroke="#6E7A89" stroke-width="1.2"/>';
        return s + '</svg>';
    }

    /* ------------------------------------------------------------------
       AÇIK DEFTER VE ARAYÜZ
       ------------------------------------------------------------------ */
    var D = null;        /* { id, sinif, sube, tarih, guncelleme, sayfalar, aktif, notId, notAd, kirli } */
    var T = null;        /* araç durumu { arac, renk, kal } */
    var UI = null;       /* öğeler */
    var _otoKayit = null, _gozBoyut = null, _govdeTasma = '';

    function ac(sinif, kaynak) {
        sinif = String(sinif || '');
        if (!sinif) return;
        if (!ogretmenMi()) return;
        stilKur();
        kapat(true);
        var t = tercihOku();
        T = { arac: 'kalem', renk: (t.renk >= 0 && t.renk < 5) ? t.renk : 0, kal: t.kal || 'o', mod: t.mod || 'c' };
        D = kaynak || { id: yeniId(), sinif: sinif, sube: subeAdi(), tarih: Date.now(), guncelleme: 0,
                        sayfalar: [yeniSayfa(T.mod)], aktif: 0, notId: '', notAd: '', kirli: false };
        kur();
        cizimAyarla();
        if (!kaynak) sonDefterOnerisi();
    }

    function kur() {
        var ort = document.createElement('div');
        ort.id = 'ysOrt';
        var renkler = RENKLER.map(function (r, i) {
            return '<button type="button" class="ys-renk" data-renk="' + i + '" style="background:' + r.k + '" title="' + esc(r.ad) +
                   ' (' + (i + 1) + ')" aria-label="' + esc(r.ad) + '"></button>';
        }).join('');
        var kalin = KALINLIK.map(function (k, i) {
            var r = [6, 10, 15][i];
            return '<button type="button" class="ys-kal" data-kal="' + k.id + '" title="' + esc(k.ad) + ' kalem"><i style="width:' + r + 'px;height:' + r + 'px"></i></button>';
        }).join('');
        var modlar = MODLAR.map(function (m) {
            return '<button type="button" class="ys-mod" data-mod="' + m.id + '" title="' + esc(m.ad) + '">' + modSvg(m.id) + '</button>';
        }).join('');
        ort.innerHTML =
            '<div id="ysKutu" role="dialog" aria-modal="true" aria-label="Yazı Sayfası">' +
              '<div class="ys-arac">' +
                '<div class="ys-baslik">' + IK.defter + '<span>Yazı Sayfası<small>' + esc(D.sinif) + '. sınıf' +
                  (D.sube ? ' · ' + esc(D.sube) : '') + '</small></span></div>' +
                '<div class="ys-grup">' +
                  '<button type="button" class="ys-t" data-is="kalem" title="Kalem (K)">' + IK.kalem + '</button>' +
                  '<button type="button" class="ys-t" data-is="silgi" title="Silgi (S)">' + IK.silgi + '</button>' +
                '</div>' +
                '<div class="ys-grup" style="gap:6px; padding:3px 6px;">' + renkler + '</div>' +
                '<div class="ys-grup">' + kalin + '</div>' +
                '<div class="ys-grup">' + modlar + '</div>' +
                '<div class="ys-ayrac"></div>' +
                '<button type="button" class="ys-t" data-is="geri" title="Geri al (Ctrl+Z)">' + IK.geri + '</button>' +
                '<button type="button" class="ys-t" data-is="ileri" title="Yinele (Ctrl+Y)">' + IK.ileri + '</button>' +
                '<button type="button" class="ys-t" data-is="temizle" title="Sayfayı temizle">' + IK.temizle + '</button>' +
                '<div class="ys-ayrac"></div>' +
                '<div class="ys-grup">' +
                  '<button type="button" class="ys-t" data-is="onceki" title="Önceki sayfa (←)">' + IK.onceki + '</button>' +
                  '<span class="ys-sayfa" id="ysSayfa">1 / 1</span>' +
                  '<button type="button" class="ys-t" data-is="sonraki" title="Sonraki sayfa (→)">' + IK.sonraki + '</button>' +
                  '<button type="button" class="ys-t" data-is="yeniSayfa" title="Yeni sayfa">' + IK.yeniSayfa + '</button>' +
                  '<button type="button" class="ys-t" data-is="sayfaSil" title="Bu sayfayı kaldır">' + IK.sayfaSil + '</button>' +
                '</div>' +
                '<span class="ys-bos"></span>' +
                '<button type="button" class="ys-t ana" data-is="notKaydet" title="Bu defteri seviye notlarına kaydet">' + IK.yildiz +
                  '<span id="ysNotYazi">Seviye notlarına kaydet</span></button>' +
                '<button type="button" class="ys-t" data-is="panel" title="Geçmiş ve seviye notları">' + IK.saat + '<span>Geçmiş</span></button>' +
                '<button type="button" class="ys-t" data-is="tamEkran" title="Tam ekran">' + IK.tamEkran + '</button>' +
                '<button type="button" class="ys-t kapat" data-is="kapat" title="Kapat (Esc) — tarihiyle kaydedilir">&times;</button>' +
              '</div>' +
              '<div class="ys-sahne" id="ysSahne">' +
                '<div class="ys-kagit" id="ysKagit">' +
                  '<canvas class="ys-alt"></canvas><canvas class="ys-ust"></canvas>' +
                  '<div class="ys-silgi-iz"></div>' +
                  '<div class="ys-ipucu">' + IK.kalem + 'Yazmaya başla — kalem, parmak ya da fare</div>' +
                '</div>' +
              '</div>' +
              '<aside class="ys-panel" id="ysPanel" aria-label="Geçmiş ve seviye notları">' +
                '<div class="ys-panel-bas">' +
                  '<button type="button" class="ys-sek sec" data-sek="gecmis">Geçmiş (bu tarayıcı)</button>' +
                  '<button type="button" class="ys-sek" data-sek="notlar">Seviye notları</button>' +
                  '<span class="ys-bos"></span>' +
                  '<button type="button" class="ys-t kapat" data-is="panelKapat" title="Paneli kapat">&times;</button>' +
                '</div>' +
                '<div class="ys-panel-ic" id="ysPanelIc"></div>' +
              '</aside>' +
            '</div>';
        document.body.appendChild(ort);
        _govdeTasma = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        var kagit = ort.querySelector('#ysKagit');
        UI = {
            ort: ort, kutu: ort.querySelector('#ysKutu'), sahne: ort.querySelector('#ysSahne'), kagit: kagit,
            alt: kagit.querySelector('.ys-alt'), ust: kagit.querySelector('.ys-ust'),
            iz: kagit.querySelector('.ys-silgi-iz'), ipucu: kagit.querySelector('.ys-ipucu'),
            sayfa: ort.querySelector('#ysSayfa'), panel: ort.querySelector('#ysPanel'), panelIc: ort.querySelector('#ysPanelIc'),
            sek: 'gecmis', olcek: 1, dpr: 1
        };
        ort.addEventListener('click', tikla);
        UI.ust.addEventListener('pointerdown', kalemBas);
        UI.ust.addEventListener('pointermove', kalemOynat);
        UI.ust.addEventListener('pointerup', kalemBirak);
        UI.ust.addEventListener('pointercancel', kalemBirak);
        UI.ust.addEventListener('pointerleave', function () { UI.iz.classList.remove('gor'); });
        document.addEventListener('keydown', tus, true);
        window.addEventListener('resize', boyutErtele);
        if (window.ResizeObserver) { _gozBoyut = new ResizeObserver(boyutErtele); _gozBoyut.observe(UI.sahne); }
        window.addEventListener('pagehide', sessizKaydet);
        document.addEventListener('visibilitychange', gorunurlukDegisti);
        _otoKayit = setInterval(function () { if (D && D.kirli) sessizKaydet(); }, 20000);
        aracGuncelle();
    }

    function kapat(sessiz) {
        var ort = document.getElementById('ysOrt');
        if (!ort) return;
        if (D && !bosMu(D.sayfalar) && D.kirli) gecmiseKaydet();
        try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) { }
        clearInterval(_otoKayit); _otoKayit = null;
        if (_gozBoyut) { try { _gozBoyut.disconnect(); } catch (e) { } _gozBoyut = null; }
        document.removeEventListener('keydown', tus, true);
        window.removeEventListener('resize', boyutErtele);
        window.removeEventListener('pagehide', sessizKaydet);
        document.removeEventListener('visibilitychange', gorunurlukDegisti);
        ort.remove();
        document.body.style.overflow = _govdeTasma || '';
        UI = null; D = null;
    }
    function gorunurlukDegisti() { if (document.visibilityState === 'hidden') sessizKaydet(); }
    function sessizKaydet() { if (D && D.kirli && !bosMu(D.sayfalar)) gecmiseKaydet(); }

    /* Kapanınca (ya da arada bir) tarayıcı geçmişine — yazıldığı tarihle */
    function gecmiseKaydet() {
        if (!D) return Promise.resolve();
        var simdi = Date.now();
        D.guncelleme = simdi;
        D.kirli = false;
        var kayit = {
            id: D.id, sinif: D.sinif, sube: D.sube || '', tarih: D.tarih || simdi, guncelleme: simdi,
            sayfa: D.sayfalar.length, kod: defterKodla(D.sayfalar),
            onizleme: onizlemeUrl(D.sayfalar[0]), notId: D.notId || ''
        };
        return gecmisKoy(kayit);
    }

    /* ---------------- tuval boyu ---------------- */
    var _boyutZ = null;
    function boyutErtele() { clearTimeout(_boyutZ); _boyutZ = setTimeout(cizimAyarla, 60); }
    function cizimAyarla() {
        if (!UI) return;
        var r = UI.sahne.getBoundingClientRect();
        var gw = Math.max(200, r.width - 28), gh = Math.max(140, r.height - 28);
        var w = Math.min(gw, gh * (W / H)), h = w * (H / W);
        UI.kagit.style.width = Math.round(w) + 'px';
        UI.kagit.style.height = Math.round(h) + 'px';
        var dpr = Math.min(3, window.devicePixelRatio || 1);
        [UI.alt, UI.ust].forEach(function (c) {
            c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
        });
        UI.dpr = dpr;
        UI.olcek = (w * dpr) / W;
        UI.cssOlcek = w / W;
        UI.iz.style.width = UI.iz.style.height = (SILGI_W * UI.cssOlcek) + 'px';
        sayfaCiz();
    }
    function sayfa() { return D.sayfalar[D.aktif]; }
    function sayfaCiz() {
        if (!UI || !D) return;
        var s = sayfa();
        cizgileriCiz(UI.alt.getContext('2d'), s.mod, UI.olcek);
        var ctx = UI.ust.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, UI.ust.width, UI.ust.height);
        s.cizimler.forEach(function (c) { cizimCiz(ctx, c, UI.olcek); });
        UI.ipucu.classList.toggle('gizli', !bosMu(D.sayfalar));
        aracGuncelle();
    }

    /* ---------------- kalem ---------------- */
    var _cz = null, _kalemVar = false;
    function nokta(e) {
        var r = UI.ust.getBoundingClientRect();
        return [ (e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H ];
    }
    function izKonum(e) {
        var r = UI.kagit.getBoundingClientRect();
        UI.iz.style.left = (e.clientX - r.left) + 'px';
        UI.iz.style.top = (e.clientY - r.top) + 'px';
    }
    function kalemBas(e) {
        if (e.pointerType === 'pen') _kalemVar = true;
        if (e.pointerType === 'touch' && _kalemVar) return;      /* avuç içi: kalem varken dokunma çizmez */
        if (e.button !== undefined && e.button > 0 && e.pointerType === 'mouse') return;
        e.preventDefault();
        try { UI.ust.setPointerCapture(e.pointerId); } catch (x) { }
        var p = nokta(e);
        /* kalemin silgi ucu (button 5 / buttons 32) da siler */
        var silgiMi = T.arac === 'silgi' || (e.pointerType === 'pen' && (e.button === 5 || (e.buttons & 32)));
        _cz = { id: e.pointerId, c: { r: T.renk, k: T.kal, s: silgiMi ? 1 : 0, p: [p[0], p[1]] } };
        UI.ipucu.classList.add('gizli');
        var ctx = UI.ust.getContext('2d');
        cizimCiz(ctx, _cz.c, UI.olcek);
        if (T.arac === 'silgi') { izKonum(e); UI.iz.classList.add('gor'); }
    }
    function kalemOynat(e) {
        if (T && T.arac === 'silgi' && UI) { izKonum(e); UI.iz.classList.add('gor'); }
        if (!_cz || e.pointerId !== _cz.id) return;
        e.preventDefault();
        var olaylar = (e.getCoalescedEvents && e.getCoalescedEvents()) || [e];
        if (!olaylar.length) olaylar = [e];
        var c = _cz.c, ctx = UI.ust.getContext('2d');
        olaylar.forEach(function (ev) {
            var p = nokta(ev), n = c.p.length;
            var lx = c.p[n - 2], ly = c.p[n - 1];
            if (Math.abs(p[0] - lx) + Math.abs(p[1] - ly) < 0.6) return;
            c.p.push(p[0], p[1]);
            /* yalnız son parça çizilir: önceki orta noktadan yeni orta noktaya */
            var m = c.p.length / 2;
            ctx.save();
            ctx.setTransform(UI.olcek, 0, 0, UI.olcek, 0, 0);
            ctx.globalCompositeOperation = c.s ? 'destination-out' : 'source-over';
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.strokeStyle = c.s ? '#000' : RENKLER[c.r].k;
            ctx.lineWidth = c.s ? SILGI_W : kalinlikW(c.k);
            ctx.beginPath();
            if (m === 2) {
                ctx.moveTo(c.p[0], c.p[1]);
                ctx.lineTo((c.p[0] + c.p[2]) / 2, (c.p[1] + c.p[3]) / 2);
            } else {
                var ax = c.p[(m - 3) * 2], ay = c.p[(m - 3) * 2 + 1];
                var bx = c.p[(m - 2) * 2], by = c.p[(m - 2) * 2 + 1];
                var cx = c.p[(m - 1) * 2], cy = c.p[(m - 1) * 2 + 1];
                ctx.moveTo((ax + bx) / 2, (ay + by) / 2);
                ctx.quadraticCurveTo(bx, by, (bx + cx) / 2, (by + cy) / 2);
            }
            ctx.stroke();
            ctx.restore();
        });
    }
    function kalemBirak(e) {
        if (!_cz || (e && e.pointerId !== _cz.id)) return;
        var c = _cz.c;
        _cz = null;
        c.p = sadelestir(c.p, 0.32).map(function (v) { return Math.round(v * 2) / 2; });
        var s = sayfa();
        s.cizimler.push(c);
        s.geri.push({ t: 'ekle' });
        s.ileri = [];
        D.kirli = true;
        sayfaCiz();
    }

    /* ---------------- işlemler ---------------- */
    function geriAl() {
        var s = sayfa(), a = s.geri.pop();
        if (!a) return;
        if (a.t === 'ekle') { s.ileri.push({ t: 'ekle', c: s.cizimler.pop() }); }
        else if (a.t === 'temizle') { s.ileri.push({ t: 'temizle', onceki: a.onceki }); s.cizimler = a.onceki.slice(); }
        D.kirli = true; sayfaCiz();
    }
    function yinele() {
        var s = sayfa(), a = s.ileri.pop();
        if (!a) return;
        if (a.t === 'ekle') { s.cizimler.push(a.c); s.geri.push({ t: 'ekle' }); }
        else if (a.t === 'temizle') { s.geri.push({ t: 'temizle', onceki: s.cizimler.slice() }); s.cizimler = []; }
        D.kirli = true; sayfaCiz();
    }
    function temizle() {
        var s = sayfa();
        if (!s.cizimler.length) return;
        s.geri.push({ t: 'temizle', onceki: s.cizimler.slice() });
        s.ileri = [];
        s.cizimler = [];
        D.kirli = true; sayfaCiz();
        bildir('Sayfa temizlendi — geri almak için ↶');
    }
    function sayfayaGit(i) {
        if (i < 0 || i >= D.sayfalar.length) return;
        D.aktif = i; sayfaCiz();
    }
    function yeniSayfaEkle() {
        D.sayfalar.splice(D.aktif + 1, 0, yeniSayfa(sayfa().mod));
        D.aktif++;
        D.kirli = true; sayfaCiz();
    }
    function sayfaKaldir() {
        if (D.sayfalar.length < 2) return;
        var s = sayfa();
        var yap = function () {
            D.sayfalar.splice(D.aktif, 1);
            D.aktif = Math.max(0, Math.min(D.aktif, D.sayfalar.length - 1));
            D.kirli = true; sayfaCiz();
        };
        if (!s.cizimler.length) { yap(); return; }
        soru('Bu sayfa (' + (D.aktif + 1) + '. sayfa) üzerindeki yazılarla birlikte kaldırılsın mı?', 'Kaldır', true, yap);
    }
    function modSec(m) {
        sayfa().mod = m;
        T.mod = m; tercihKaydet();
        D.kirli = true; sayfaCiz();
    }
    function tercihKaydet() { tercihYaz({ renk: T.renk, kal: T.kal, mod: T.mod }); }
    function tamEkran() {
        try {
            if (document.fullscreenElement) document.exitFullscreen();
            else if (UI.ort.requestFullscreen) UI.ort.requestFullscreen();
        } catch (e) { }
        setTimeout(cizimAyarla, 250);
    }

    function aracGuncelle() {
        if (!UI || !D) return;
        var s = sayfa();
        UI.kagit.classList.toggle('silgi', T.arac === 'silgi');
        [].forEach.call(UI.ort.querySelectorAll('[data-is="kalem"],[data-is="silgi"]'), function (b) {
            b.classList.toggle('sec', b.getAttribute('data-is') === T.arac);
        });
        [].forEach.call(UI.ort.querySelectorAll('[data-renk]'), function (b) { b.classList.toggle('sec', +b.getAttribute('data-renk') === T.renk && T.arac === 'kalem'); });
        [].forEach.call(UI.ort.querySelectorAll('[data-kal]'), function (b) { b.classList.toggle('sec', b.getAttribute('data-kal') === T.kal); });
        [].forEach.call(UI.ort.querySelectorAll('[data-mod]'), function (b) { b.classList.toggle('sec', b.getAttribute('data-mod') === s.mod); });
        var dz = function (is, kapali) { var b = UI.ort.querySelector('[data-is="' + is + '"]'); if (b) b.disabled = !!kapali; };
        dz('geri', !s.geri.length); dz('ileri', !s.ileri.length); dz('temizle', !s.cizimler.length);
        dz('onceki', D.aktif === 0); dz('sonraki', D.aktif >= D.sayfalar.length - 1); dz('sayfaSil', D.sayfalar.length < 2);
        UI.sayfa.textContent = (D.aktif + 1) + ' / ' + D.sayfalar.length;
        var ny = UI.ort.querySelector('#ysNotYazi');
        if (ny) ny.textContent = D.notId ? 'Seviye notunu güncelle' : 'Seviye notlarına kaydet';
    }

    function tikla(e) {
        var t = e.target;
        if (t === UI.ort) return;                                    /* dışına basınca kapanmaz (yanlışlıkla silinmesin) */
        var b = t.closest && t.closest('[data-is],[data-renk],[data-kal],[data-mod],[data-sek],[data-ac],[data-sil],[data-not],[data-notsil]');
        if (!b) return;
        if (b.hasAttribute('data-renk')) { T.renk = +b.getAttribute('data-renk'); T.arac = 'kalem'; tercihKaydet(); aracGuncelle(); return; }
        if (b.hasAttribute('data-kal')) { T.kal = b.getAttribute('data-kal'); T.arac = 'kalem'; tercihKaydet(); aracGuncelle(); return; }
        if (b.hasAttribute('data-mod')) { modSec(b.getAttribute('data-mod')); return; }
        if (b.hasAttribute('data-sek')) { UI.sek = b.getAttribute('data-sek'); panelCiz(); return; }
        if (b.hasAttribute('data-sil')) { e.stopPropagation(); gecmisSilSor(b.getAttribute('data-sil')); return; }
        if (b.hasAttribute('data-notsil')) { e.stopPropagation(); notSilSor(b.getAttribute('data-notsil')); return; }
        if (b.hasAttribute('data-ac')) { gecmistenAc(b.getAttribute('data-ac')); return; }
        if (b.hasAttribute('data-not')) { nottanAc(b.getAttribute('data-not')); return; }
        var is = b.getAttribute('data-is');
        if (is === 'kalem' || is === 'silgi') { T.arac = is; aracGuncelle(); }
        else if (is === 'geri') geriAl();
        else if (is === 'ileri') yinele();
        else if (is === 'temizle') temizle();
        else if (is === 'onceki') sayfayaGit(D.aktif - 1);
        else if (is === 'sonraki') sayfayaGit(D.aktif + 1);
        else if (is === 'yeniSayfa') yeniSayfaEkle();
        else if (is === 'sayfaSil') sayfaKaldir();
        else if (is === 'notKaydet') notKaydetSor();
        else if (is === 'panel') panelAcKapa();
        else if (is === 'panelKapat') UI.panel.classList.remove('acik');
        else if (is === 'tamEkran') tamEkran();
        else if (is === 'kapat') kapat();
        else if (is === 'sonAc') { var id = b.getAttribute('data-id'); var s = UI.ort.querySelector('.ys-son'); if (s) s.remove(); gecmistenAc(id); }
        else if (is === 'sonKapat') { var s2 = UI.ort.querySelector('.ys-son'); if (s2) s2.remove(); }
    }

    function tus(e) {
        if (!UI) return;
        var yazi = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');
        if (e.key === 'Escape') {
            e.preventDefault(); e.stopPropagation();
            var so = UI.ort.querySelector('.ys-soru-ort');
            if (so) { so.remove(); return; }
            if (UI.panel.classList.contains('acik')) { UI.panel.classList.remove('acik'); return; }
            if (document.fullscreenElement) return;          /* tarayıcı tam ekrandan çıkar */
            kapat(); return;
        }
        if (yazi) return;
        var k = e.key.toLowerCase();
        if ((e.ctrlKey || e.metaKey) && k === 'z' && !e.shiftKey) { e.preventDefault(); geriAl(); return; }
        if ((e.ctrlKey || e.metaKey) && (k === 'y' || (k === 'z' && e.shiftKey))) { e.preventDefault(); yinele(); return; }
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (k === 'k' || k === 'p') { T.arac = 'kalem'; aracGuncelle(); }
        else if (k === 's' || k === 'e') { T.arac = 'silgi'; aracGuncelle(); }
        else if (/^[1-5]$/.test(k)) { T.renk = +k - 1; T.arac = 'kalem'; tercihKaydet(); aracGuncelle(); }
        else if (e.key === 'ArrowLeft') sayfayaGit(D.aktif - 1);
        else if (e.key === 'ArrowRight') sayfayaGit(D.aktif + 1);
        else return;
        e.preventDefault();
    }

    /* ---------------- bildirim ve soru ---------------- */
    function bildir(m, hata) {
        if (!UI) return;
        var b = document.createElement('div');
        b.className = 'ys-bildiri' + (hata ? ' hata' : '');
        b.textContent = m;
        UI.kutu.appendChild(b);
        setTimeout(function () { b.remove(); }, 2700);
    }
    function soru(metin, evetYazi, kirmizi, evet, girdi) {
        var o = document.createElement('div');
        o.className = 'ys-soru-ort';
        o.innerHTML = '<div class="ys-soru" role="alertdialog"><p>' + esc(metin) + '</p>' +
            (girdi != null ? '<input type="text" maxlength="60" value="' + esc(girdi) + '">' : '') +
            '<div class="ys-tuslar"><button type="button" class="hayir">Vazgeç</button>' +
            '<button type="button" class="evet' + (kirmizi ? ' kirmizi' : '') + '">' + esc(evetYazi) + '</button></div></div>';
        UI.kutu.appendChild(o);
        var inp = o.querySelector('input');
        if (inp) { inp.focus(); inp.select(); }
        o.addEventListener('click', function (e) {
            if (e.target === o || e.target.classList.contains('hayir')) { o.remove(); return; }
            if (e.target.classList.contains('evet')) { var v = inp ? inp.value.trim() : ''; o.remove(); evet(v); }
        });
        if (inp) inp.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); var v = inp.value.trim(); o.remove(); evet(v); }
        });
    }

    /* ---------------- son defter önerisi ---------------- */
    function sonDefterOnerisi() {
        var sinif = D.sinif;
        gecmisListe(sinif).then(function (L) {
            if (!UI || !D || D.sinif !== sinif || !L.length || !bosMu(D.sayfalar)) return;
            var k = L[0];
            var d = document.createElement('div');
            d.className = 'ys-son';
            d.innerHTML = '<span>Son yazdığın: <b>' + esc(tarihYaz(k.guncelleme, true)) + '</b>' + (k.sayfa > 1 ? ' · ' + k.sayfa + ' sayfa' : '') + '</span>' +
                '<button type="button" data-is="sonAc" data-id="' + esc(k.id) + '">Aç</button>' +
                '<button type="button" class="x" data-is="sonKapat" aria-label="Kapat">&times;</button>';
            UI.sahne.appendChild(d);
            setTimeout(function () { if (d.parentNode) d.remove(); }, 12000);
        });
    }

    /* ---------------- panel: geçmiş + seviye notları ---------------- */
    function panelAcKapa() {
        var a = !UI.panel.classList.contains('acik');
        UI.panel.classList.toggle('acik', a);
        if (a) panelCiz();
    }
    function panelCiz() {
        [].forEach.call(UI.ort.querySelectorAll('[data-sek]'), function (b) { b.classList.toggle('sec', b.getAttribute('data-sek') === UI.sek); });
        var ic = UI.panelIc;
        ic.innerHTML = '<p class="ys-yok">Yükleniyor…</p>';
        if (UI.sek === 'gecmis') {
            gecmisListe(D.sinif).then(function (L) {
                if (!UI || UI.sek !== 'gecmis') return;
                ic.innerHTML = '<p class="ys-bilgi">' + esc(D.sinif) + '. sınıfta bu tarayıcıda yazılanlar. Kapattığında yazıldığı tarihle buraya düşer; ' +
                    'son ' + GECMIS_EN_COK + ' defter tutulur.</p>' +
                    (L.length ? L.map(function (k) {
                        var simdi = (k.id === D.id || k.id === D.kaynakId);
                        return '<div class="ys-oge' + (simdi ? ' simdi' : '') + '" data-ac="' + esc(k.id) + '">' +
                            (k.onizleme ? '<img alt="" src="' + esc(k.onizleme) + '">' : '<canvas width="240" height="150"></canvas>') +
                            '<div><b>' + esc(tarihYaz(k.guncelleme, true)) + '</b>' +
                            '<span>' + (k.sayfa || 1) + ' sayfa' + (k.sube ? ' · ' + esc(k.sube) : '') +
                            (simdi ? ' · şu an açık' : '') + '</span></div>' +
                            '<button type="button" class="ys-ogesil" data-sil="' + esc(k.id) + '" title="Geçmişten sil">&times;</button></div>';
                    }).join('') : '<p class="ys-yok">Henüz kayıtlı sayfa yok.<br>Yazdıklarını kapatınca burada görürsün.</p>');
            });
        } else {
            if (!benKim()) { ic.innerHTML = '<p class="ys-yok">Seviye notları hesabına kaydedilir; görmek için giriş yap.</p>'; return; }
            notlarHepsi().then(function (H2) {
                if (!UI || UI.sek !== 'notlar') return;
                var L = (H2['s' + D.sinif] || []).slice().sort(function (a, b) { return (b.tarih || 0) - (a.tarih || 0); });
                ic.innerHTML = '<p class="ys-bilgi">Beğendiğin defterler hesabında saklanır, her cihazda görünür. ' +
                    esc(D.sinif) + '. sınıf: <b>' + L.length + ' / ' + NOT_EN_COK + '</b></p>' +
                    (L.length ? L.map(function (n) {
                        return '<div class="ys-oge' + (n.id === D.notId ? ' simdi' : '') + '" data-not="' + esc(n.id) + '">' +
                            '<canvas width="240" height="150" data-onizle="' + esc(n.id) + '"></canvas>' +
                            '<div><b>' + esc(n.ad || 'Not') + '</b><span>' + esc(kisaTarih(n.tarih)) + ' · ' + (n.sayfa || 1) + ' sayfa' +
                            (n.id === D.notId ? ' · şu an açık' : '') + '</span></div>' +
                            '<button type="button" class="ys-ogesil" data-notsil="' + esc(n.id) + '" title="Notu sil">&times;</button></div>';
                    }).join('') : '<p class="ys-yok">Bu seviyede kayıtlı not yok.<br>Beğendiğin defteri ★ ile kaydet.</p>');
                L.forEach(function (n) {
                    var c = ic.querySelector('canvas[data-onizle="' + n.id + '"]');
                    if (c) { try { onizlemeCiz(c, defterCoz(n.kod)[0]); } catch (e) { } }
                });
            }).catch(function (e) {
                ic.innerHTML = '<p class="ys-yok">Seviye notları okunamadı (' + esc((e && (e.code || e.message)) || e) + ').</p>';
            });
        }
    }
    function gecmistenAc(id) {
        gecmisListe(D.sinif).then(function (L) {
            var k = L.filter(function (x) { return x.id === id; })[0];
            if (!k) return;
            var gec = function () {
                if (D && D.kirli && !bosMu(D.sayfalar) && D.id !== k.id) gecmiseKaydet();
                /* Eski dersin kaydı DEĞİŞMEZ: açılan defter yeni bir kayıt olarak
                   sürer; üzerine yazılırsa kapanınca bugünün tarihiyle ayrıca
                   kaydedilir, yalnız bakılırsa hiçbir şey yazılmaz. */
                var sayfalar = defterCoz(k.kod);
                D = { id: yeniId(), kaynakId: k.id, sinif: k.sinif, sube: k.sube || '', tarih: Date.now(), guncelleme: 0,
                      sayfalar: sayfalar, aktif: 0, notId: k.notId || '', notAd: '', kirli: false };
                if (UI) UI.panel.classList.remove('acik');
                sayfaCiz();
                bildir(tarihYaz(k.guncelleme, true) + ' açıldı');
            };
            gec();
        });
    }
    function gecmisSilSor(id) {
        soru('Bu sayfa geçmişten silinsin mi? (Seviye notlarındaki kopyası durur.)', 'Sil', true, function () {
            gecmisSil(id, D.sinif).then(function () {
                if (D && D.id === id) { D.id = yeniId(); D.kirli = true; }
                panelCiz();
            });
        });
    }

    /* ---------------- seviye notları ---------------- */
    function notKaydetSor() {
        if (!benKim()) { bildir('Seviye notları için giriş yapmalısın.', true); return; }
        if (bosMu(D.sayfalar)) { bildir('Sayfa boş — önce bir şeyler yaz.', true); return; }
        var varsayilan = D.notAd || (kisaTarih(Date.now()) + (D.sube ? ' · ' + D.sube : '') + ' · ' + D.sayfalar.length + ' sayfa');
        soru(D.notId ? 'Seviye notu güncellensin mi? Adını değiştirebilirsin:' :
             D.sinif + '. sınıf seviye notlarına kaydedilsin. Bir ad ver:', D.notId ? 'Güncelle' : 'Kaydet', false, function (ad) {
            notKaydet(ad || varsayilan);
        }, varsayilan);
    }
    function notKaydet(ad) {
        var kod = defterKodla(D.sayfalar);
        if (kod.length > NOT_TEK_SINIR) {
            bildir('Bu defter seviye notu için çok yoğun; birkaç sayfasını kaldırıp yeniden dene.', true);
            return;
        }
        notlarHepsi().then(function (Hp) {
            var L = (Hp['s' + D.sinif] || []).slice();
            var i = -1;
            for (var j = 0; j < L.length; j++) if (L[j].id === D.notId) { i = j; break; }
            if (i < 0 && L.length >= NOT_EN_COK) throw new Error('dolu');
            var toplam = 0;
            Object.keys(Hp).forEach(function (s) {
                (Hp[s] || []).forEach(function (n) { if (!(s === 's' + D.sinif && n.id === D.notId)) toplam += (n.kod || '').length; });
            });
            if (toplam + kod.length > NOT_TOPLAM_SINIR) throw new Error('alan');
            var not = { id: i >= 0 ? L[i].id : yeniId(), ad: String(ad).slice(0, 60), tarih: Date.now(), sayfa: D.sayfalar.length, kod: kod };
            if (i >= 0) L[i] = not; else L.push(not);
            return notlarYaz(D.sinif, L).then(function () { return not; });
        }).then(function (not) {
            D.notId = not.id; D.notAd = not.ad;
            D.kirli = true;
            aracGuncelle();
            bildir('★ Seviye notlarına kaydedildi');
            if (UI && UI.panel.classList.contains('acik') && UI.sek === 'notlar') panelCiz();
        }).catch(function (e) {
            var m = e && e.message;
            if (m === 'dolu') bildir('Bu seviyede ' + NOT_EN_COK + ' not var; yenisi için birini sil.', true);
            else if (m === 'alan') bildir('Seviye notlarına ayrılan yer doldu; eski notlardan birkaçını sil.', true);
            else if (m === 'giris') bildir('Seviye notları için giriş yapmalısın.', true);
            else bildir('Kaydedilemedi: ' + ((e && (e.code || e.message)) || e), true);
        });
    }
    function nottanAc(id) {
        notlarHepsi().then(function (Hp) {
            var n = (Hp['s' + D.sinif] || []).filter(function (x) { return x.id === id; })[0];
            if (!n) return;
            if (D && D.kirli && !bosMu(D.sayfalar)) gecmiseKaydet();
            D = { id: yeniId(), sinif: D.sinif, sube: D.sube, tarih: Date.now(), guncelleme: 0,
                  sayfalar: defterCoz(n.kod), aktif: 0, notId: n.id, notAd: n.ad || '', kirli: false };
            UI.panel.classList.remove('acik');
            sayfaCiz();
            bildir('“' + (n.ad || 'Not') + '” açıldı');
        });
    }
    function notSilSor(id) {
        soru('Bu seviye notu hesabından silinsin mi? Geri alınamaz.', 'Sil', true, function () {
            notlarHepsi().then(function (Hp) {
                var L = (Hp['s' + D.sinif] || []).filter(function (x) { return x.id !== id; });
                return notlarYaz(D.sinif, L);
            }).then(function () {
                if (D && D.notId === id) { D.notId = ''; D.notAd = ''; aracGuncelle(); }
                panelCiz();
                bildir('Not silindi');
            }).catch(function (e) { bildir('Silinemedi: ' + ((e && (e.code || e.message)) || e), true); });
        });
    }

    /* ------------------------------------------------------------------
       SINIF MATERYALLERİNDE KART
       ------------------------------------------------------------------ */
    window.ysKartTik = function (btn) {
        var m = btn && btn.closest ? btn.closest('[data-sinif]') : null;
        var s = m ? m.getAttribute('data-sinif') : '';
        if (!s) {
            try { var a = window.llAktifSinif && window.llAktifSinif(); if (a && a.sinif) s = a.sinif; } catch (e) { }
        }
        ac(s || '5');
    };
    function kartKaydet() {
        if (!window.KidefSinifModul || !KidefSinifModul.ekle) return false;
        KidefSinifModul.ekle({
            id: 'yazisayfasi',
            ad: 'Yazı Sayfası',
            sira: 5,
            renk: '#1B4F9C',
            aciklama: function () { return 'Tahtaya yaz, çiz · Arapça yazı çizgileri · sayfalar tarihiyle saklanır'; },
            svg: function () {
                return '<svg viewBox="0 0 64 64" class="kg" aria-hidden="true">' +
                    '<rect x="9" y="7" width="40" height="50" rx="5" fill="#fff" stroke="#1B4F9C" stroke-width="3"/>' +
                    '<path d="M15 21h28" stroke="#D0D7E2" stroke-width="2"/><path d="M15 29h28" stroke="#D0D7E2" stroke-width="1.6" stroke-dasharray="3 3"/>' +
                    '<path d="M15 34h28" stroke="#8C97A5" stroke-width="2.4"/><path d="M15 42h28M15 50h20" stroke="#D0D7E2" stroke-width="2"/>' +
                    '<path d="M43 7v50" stroke="#F2A0A0" stroke-width="2"/>' +
                    '<path d="M37 33c-3-6-9-6-11-1s3 7 7 3" fill="none" stroke="#1E5BD8" stroke-width="2.6" stroke-linecap="round"/>' +
                    '<path d="M44 46 55 35l4.6 4.6-11 11-6.4 1.8z" fill="#F2B544" stroke="#9A6512" stroke-width="2.2" stroke-linejoin="round"/>' +
                    '</svg>';
            },
            veriVar: function () { return ogretmenMi() ? { rozet: 'Yaz · Çiz' } : null; },
            dugme: true,
            tikla: 'ysKartTik'
        });
        return true;
    }
    if (!kartKaydet()) {
        document.addEventListener('DOMContentLoaded', kartKaydet);
    }

    /* GİRİŞTEN SONRA KART — sınıf kartları sınıf İLK açıldığında bir kez
       kurulur (index.html → ihIcKur). Hesap henüz okunmadan (giriş sürerken
       ya da misafirken) sınıf açılırsa kart o an çıkmaz, sonra da kendiliğinden
       gelmezdi. Rol değişince YALNIZ bu kart, kurulmuş ızgaralara eklenir ya da
       çıkarılır; öteki kartlara ve açık panellere dokunulmaz. */
    function kartiTazele() {
        var M = window.KidefSinifModul;
        if (!M || !M.html) return;
        var ogr = ogretmenMi();
        [].forEach.call(document.querySelectorAll('.ih-kartlar[data-sinif]'), function (m) {
            var g = m.querySelector('.game-grid');
            if (!g) return;                               /* henüz kurulmadı: kurulunca doğru çıkar */
            var k = g.querySelector('[data-smodul="yazisayfasi"]');
            if (!ogr) { if (k && k.parentNode) k.parentNode.removeChild(k); return; }
            if (k) return;
            var kap = document.createElement('div');
            kap.innerHTML = M.html(m.getAttribute('data-sinif'));
            var yeni = kap.querySelector('[data-smodul="yazisayfasi"]');
            if (!yeni) return;
            /* Kayıt sırasında kendisinden sonra gelen ilk kartın önüne;
               o yoksa Muhâdese'nin (data-smodul taşımayan kart) önüne. */
            var once = null;
            for (var x = yeni.nextElementSibling; x && !once; x = x.nextElementSibling)
                once = g.querySelector('[data-smodul="' + x.getAttribute('data-smodul') + '"]');
            if (!once) once = g.querySelector('.game-card:not([data-smodul])');
            g.insertBefore(yeni, once);
        });
    }
    var _sonRol = null;
    setInterval(function () {
        var r = rol();
        if (r === _sonRol) return;
        _sonRol = r;
        try { kartiTazele(); } catch (e) { }
    }, 1500);

    window.KidefYaziSayfasi = {
        ac: ac, kapat: kapat,
        /* test ve öteki modüller için */
        kodla: defterKodla, coz: defterCoz, gecmisListe: gecmisListe
    };
})();
