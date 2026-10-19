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

   NEREDE — KART YOK (19.10.2026, öğretmen: "kart olmasın, popup olsun ve
   %de 98 ekranı kaplasın, bu popup sınıf açılınca her zaman görünecek,
   sınıf sekmesine bağlı olacak, sadece bi sınıf açılınca açılacak
   kapanırsa kapanacak"):
   · Sınıflarım'da bir sınıf açılınca pencere KENDİLİĞİNDEN açılır,
     ekranın %98'ini kaplar; o sınıfa bağlıdır (seviye + şube).
   · Sınıf açık kaldıkça durur: × pencereyi KÜÇÜLTÜR, sağ altta
     «Yazı Sayfası» düğmesi kalır, basınca geri açılır.
   · Sınıf kapanınca (başka sınıfa geçilince, Sınıflarım'dan çıkılınca)
     defter tarihiyle kaydedilir, pencere kapanır.
   · Aynı sınıf 45 dakika içinde yeniden açılırsa kaldığı defterden
     sürer (aynı ders); daha sonra açılırsa boş sayfa + «Son yazdığın».
   · Yalnız öğretmen/yönetici; öğrencinin kendi panelinde açılmaz.

   DÜZEN (19.10.2026, öğretmen: "tam ekran simge haline küçültmek (çarpı
   olmasın) ilerigeri tuşu, çöp yanyana ve solda olsun, kalemler hem sağda
   hem solda yukardan aşağıya doğru dizilsin, iki tarafta da silgi olsun,
   dosyayı pdf ye çevirme ve indirme seçeneği olsun, silmeye ikinci kez
   basınca tüm sayfayı sil seçeneği olsun, sayfalar ve ileri geri tuşu
   altta ortada olsun ve biraz daha şeffaf ve büyük olsun"):
   · üst çubuk: solda başlık + geri al · yinele · çöp; ortada çizgi düzeni
     ve kalınlık; sağda seviye notu · geçmiş · PDF · tam ekran · küçült.
   · iki yanda (tahtanın iki ucunda duran öğretmen için) yukarıdan aşağı
     5 renkli kalem + silgi; iki taraf birlikte seçilir.
   · çöpe bir kez, ya da seçili silgiye İKİNCİ kez basınca yanında
     «Tüm sayfayı sil» çıkar; ona basınca sayfa temizlenir (geri alınır).
   · altta ortada yarı saydam, büyük sayfa çubuğu: ‹ 1 / 3 › + yeni sayfa
     + sayfayı kaldır.
   · PDF: defterin bütün sayfaları (çizgileriyle) A4 yatay PDF olarak iner.
   ARAÇLAR: 5 renk kalem · silgi · 3 kalınlık · çizgi düzeni (gri
   çizgiler / Arapça büyük harf / Arapça küçük harf / boş) · geri al,
   yinele, temizle · sayfalar (ekle, kaldır, ‹ ›) · PDF · tam ekran.
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
   her ekranda keskin görünür, az yer tutar. Sayfa 625 birim yüksekliğinde;
   GENİŞLİĞİ EKRANA UYAR (19.10.2026, öğretmen: "yatay olarak alanın hepsini
   kaplasın ... sağda ve solda boşluk olmasın"): görünen genişlik ekran
   oranından gelir (1000 birimlik çekirdeğin ortası esas). Kâğıt alanı
   hep doldurur; başka ekranda açılan defterin bütün çizgileri yine
   görünür (gerekirse küçülür).
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
    function cizgileriCiz(ctx, mod, o, x0, x1) {
        if (x0 == null) x0 = 0;
        if (x1 == null) x1 = W;
        ctx.save();
        ctx.setTransform(o, 0, 0, o, -x0 * o, 0);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x0, 0, x1 - x0, H);
        function yatay(y, renk, kal, kesik) {
            ctx.beginPath();
            ctx.setLineDash(kesik ? [7, 7] : []);
            ctx.strokeStyle = renk; ctx.lineWidth = kal;
            ctx.moveTo(x0 + 18, y); ctx.lineTo(x1 - 18, y); ctx.stroke();
        }
        if (mod === 'c') {
            for (var y = 74; y < H - 16; y += 44) yatay(y, '#D6DBE2', 1.3, false);
        } else if (mod === 'b' || mod === 'k') {
            /* Arapça yazı satırı: üst çizgi (elif boyu), kesik orta çizgi
               (diş yüksekliği), koyu taban çizgisi, alt çizgi (inen harfler) */
            var boy = mod === 'b' ? 150 : 82, ara = mod === 'b' ? 34 : 22, y0 = mod === 'b' ? 36 : 28;
            for (var r = y0; r + boy <= H - 12; r += boy + ara) {
                ctx.fillStyle = '#F7F9FC';
                ctx.fillRect(x0 + 18, r + boy * 0.40, x1 - x0 - 36, boy * 0.25);
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
            ctx.moveTo(x1 - 44, 10); ctx.lineTo(x1 - 44, H - 10); ctx.stroke();
        }
        ctx.restore();
    }
    function cizimCiz(ctx, c, o, x0) {
        var p = c.p, n = p.length / 2;
        if (!n) return;
        ctx.save();
        ctx.setTransform(o, 0, 0, o, -(x0 || 0) * o, 0);
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
    /* GÖRÜNÜM — sayfanın ekranda görünen yatay aralığı [x0, x1].
       Yükseklik hep 0-625. Genişlik: 1000'lik çekirdek, ekran oranı
       (geniş ekranda iki yana açılır) ve çizgilerin vardığı yer —
       hangisi büyükse. Böylece aynı ekranda kâğıt alanın hepsini kaplar,
       başka ekranda hiçbir çizgi dışarıda kalmaz. */
    function sinirlar(s) {
        var a = Infinity, z = -Infinity;
        s.cizimler.forEach(function (c) {
            if (c.s) return;
            for (var i = 0; i < c.p.length; i += 2) { if (c.p[i] < a) a = c.p[i]; if (c.p[i] > z) z = c.p[i]; }
        });
        return a <= z ? [a, z] : null;
    }
    function gorunum(s, oran) {
        /* ekran 16:10'dan dar olsa da kâğıt alanı doldurur: boş kenarlar
           görünmez, yazılmış bir çizgi varsa o hep içeride kalır */
        var yari = H * (oran || W / H) / 2;
        var b = sinirlar(s);
        if (b) yari = Math.max(yari, W / 2 - b[0] + 5, b[1] - W / 2 + 5);
        return { x0: W / 2 - yari, x1: W / 2 + yari };
    }
    function onizlemeCiz(canvas, sayfa) {
        var g = gorunum(sayfa, canvas.width / canvas.height);
        var o = Math.min(canvas.width / (g.x1 - g.x0), canvas.height / H);
        var ctx = canvas.getContext('2d');
        cizgileriCiz(ctx, sayfa.mod, o, g.x0, g.x1);
        var tmp = document.createElement('canvas');
        tmp.width = canvas.width; tmp.height = canvas.height;
        var t = tmp.getContext('2d');
        sayfa.cizimler.forEach(function (c) { cizimCiz(t, c, o, g.x0); });
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
            '  justify-content:center; padding:0; animation:ysSol .18s ease-out; font-family:inherit;}',
            '#ysOrt.kucuk{display:none;}',
            '@keyframes ysSol{from{opacity:0}to{opacity:1}}',
            '#ysKutu{position:relative; width:98vw; height:98vh; height:98dvh; background:#EEF1F5; border-radius:16px;',
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
            '.ys-t.kucult{background:#F1F4F9;}',
            '.ys-t.kucult:hover{background:#E5EBF3;}',
            /* iki yandaki kalem sütunları (kâğıdın üstünde, ortada) */
            '.ys-yan{position:absolute; top:50%; transform:translateY(-50%); z-index:3; display:flex; flex-direction:column; gap:9px;',
            '  padding:9px; background:rgba(255,255,255,.78); border-radius:32px; box-shadow:0 8px 26px rgba(15,23,42,.16), 0 0 0 1px rgba(15,23,42,.06);',
            '  -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px);}',
            '.ys-yan.sol{left:10px;} .ys-yan.sag{right:10px;}',
            '.ys-yan .ys-renk{width:46px; height:46px; min-width:46px; border:0; border-radius:50%; color:#fff; display:flex;',
            '  align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(15,23,42,.18); padding:0; cursor:pointer;',
            '  transition:transform .12s, box-shadow .12s;}',
            '.ys-yan .ys-renk svg{width:21px; height:21px; opacity:.92;}',
            '.ys-yan .ys-renk:hover{transform:scale(1.07);}',
            '.ys-yan .ys-renk.sec{box-shadow:0 0 0 3px #fff, 0 0 0 6px var(--rk); transform:scale(1.06);}',
            '.ys-yan .ys-t{width:46px; height:46px; min-width:46px; padding:0; border-radius:50%; background:#fff;',
            '  box-shadow:0 2px 6px rgba(15,23,42,.14);}',
            '.ys-yan .ys-t svg{width:23px; height:23px;}',
            '.ys-yan .ys-t.sec{background:#1B4F9C; color:#fff;}',
            '.ys-yan .ys-ara{height:1px; background:rgba(15,23,42,.12); margin:1px 6px;}',
            /* altta ortada sayfa çubuğu: yarı saydam, büyük */
            '.ys-sayfalar{position:absolute; left:50%; bottom:14px; transform:translateX(-50%); z-index:3; display:flex; align-items:center;',
            '  gap:6px; padding:7px 10px; background:rgba(255,255,255,.55); border-radius:999px; opacity:.72;',
            '  box-shadow:0 8px 24px rgba(15,23,42,.14), 0 0 0 1px rgba(15,23,42,.06); -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px);',
            '  transition:opacity .15s, background .15s;}',
            '.ys-sayfalar:hover,.ys-sayfalar:focus-within{opacity:1; background:rgba(255,255,255,.88);}',
            '.ys-sayfalar .ys-t{width:52px; height:52px; min-width:52px; padding:0; border-radius:50%;}',
            '.ys-sayfalar .ys-t svg{width:28px; height:28px;}',
            '.ys-sayfalar .ys-sayfa{font-size:1.25rem; min-width:76px;}',
            '.ys-sayfalar .ys-ara{width:1px; height:30px; background:rgba(15,23,42,.14); margin:0 3px;}',
            /* «Tüm sayfayı sil» sorusu */
            '.ys-silsor{position:absolute; z-index:7; background:#fff; border-radius:14px; padding:7px;',
            '  box-shadow:0 14px 34px rgba(15,23,42,.24), 0 0 0 1px rgba(15,23,42,.06); animation:ysSol .12s ease-out;}',
            '.ys-silsor button{border:0; background:#C0392B; color:#fff; border-radius:10px; padding:11px 16px; font-family:inherit;',
            '  font-weight:800; font-size:.95rem; display:flex; align-items:center; gap:8px; cursor:pointer; white-space:nowrap;}',
            '.ys-silsor button:hover{background:#A93226;}',
            '.ys-silsor svg{width:20px; height:20px;}',
            '.ys-sahne{position:relative; flex:1 1 auto; display:flex; align-items:center; justify-content:center; padding:0; min-height:0;}',
            '.ys-kagit{position:relative; background:#fff;}',
            '.ys-kagit canvas{position:absolute; inset:0; width:100%; height:100%;}',
            '.ys-kagit .ys-ust{touch-action:none; cursor:crosshair;}',
            '.ys-kagit.silgi .ys-ust{cursor:none;}',
            '.ys-silgi-iz{position:absolute; pointer-events:none; border:2px solid rgba(27,79,156,.55); background:rgba(255,255,255,.35);',
            '  border-radius:50%; transform:translate(-50%,-50%); display:none;}',
            '.ys-kagit.silgi .ys-silgi-iz.gor{display:block;}',
            '.ys-ipucu{position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); pointer-events:none; text-align:center;',
            '  color:#A3ADBA; font-weight:800; font-size:1.05rem; transition:opacity .3s;}',
            '.ys-ipucu svg{display:block; margin:0 auto 6px; width:46px; height:46px; opacity:.6;}',
            '.ys-ipucu.gizli{opacity:0;}',
            '.ys-son{position:absolute; left:50%; top:14px; z-index:4; transform:translateX(-50%); background:#1F2430; color:#fff; border-radius:999px;',
            '  padding:8px 8px 8px 16px; display:flex; align-items:center; gap:10px; font-size:.85rem; box-shadow:0 8px 22px rgba(0,0,0,.25);}',
            '.ys-son button{border:0; background:#fff; color:#1F2430; border-radius:999px; padding:6px 13px; font-weight:800; cursor:pointer; font-family:inherit;}',
            '.ys-son .x{background:transparent; color:#fff; padding:6px 8px;}',
            '.ys-bildiri{position:absolute; left:50%; top:70px; transform:translateX(-50%); background:#1E8449; color:#fff; padding:9px 18px;',
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
            '@media (max-width:760px){#ysOrt{padding:0;} #ysKutu{border-radius:12px;}',
            '  .ys-arac{gap:4px; padding:7px 8px;} .ys-baslik span,.ys-ayrac,.ys-arac .ys-t span{display:none;}',
            '  .ys-t{min-width:32px; height:32px; padding:0 5px;} .ys-renk{width:26px; height:26px; min-width:26px;}',
            '  .ys-kal,.ys-mod{width:32px; height:30px; min-width:32px;} .ys-mod svg{width:26px; height:19px;}',
            '  .ys-yan{padding:4px; gap:5px;} .ys-yan.sol{left:3px;} .ys-yan.sag{right:3px;}',
            '  .ys-yan .ys-renk,.ys-yan .ys-t{width:30px; height:30px; min-width:30px;} .ys-yan .ys-renk svg,.ys-yan .ys-t svg{width:15px; height:15px;}',
            '  .ys-yan .ys-renk.sec{box-shadow:0 0 0 2px #fff, 0 0 0 4px var(--rk);}',
            '  .ys-sayfalar{bottom:8px; padding:5px 7px;} .ys-sayfalar .ys-t{width:42px; height:42px; min-width:42px;}',
            '  .ys-sayfalar .ys-sayfa{font-size:1.05rem; min-width:58px;}',
            '  .ys-son{font-size:.78rem; max-width:92%;}}',
            /* küçültülünce sağ altta kalan düğme */
            '#ysPil{position:fixed; right:16px; bottom:16px; z-index:99980; display:flex; align-items:center; gap:9px;',
            '  padding:9px 16px 9px 10px; border:0; border-radius:999px; background:#1B4F9C; color:#fff; cursor:pointer;',
            '  font-family:inherit; font-weight:800; font-size:.92rem; line-height:1.15; text-align:start;',
            '  box-shadow:0 10px 28px rgba(15,23,42,.32); animation:ysSol .18s ease-out;}',
            '#ysPil:hover{background:#163F7D;} #ysPil:focus-visible{outline:3px solid #F2B544; outline-offset:2px;}',
            '#ysPil i{display:flex; width:34px; height:34px; border-radius:50%; background:#fff; align-items:center; justify-content:center; flex:none;}',
            '#ysPil i svg{width:24px; height:24px;}',
            '#ysPil small{display:block; font-size:.72rem; font-weight:700; opacity:.85;}',
            '@media print{#ysPil{display:none;}}',
            '@media (prefers-reduced-motion: reduce){#ysOrt,#ysKutu,.ys-bildiri,#ysPil{animation:none;} .ys-panel{transition:none;}}'
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
        kucult: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v10"/><path d="m7.5 9.5 4.5 4.5 4.5-4.5"/><path d="M5 19.5h14"/></svg>',
        pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M12 11v6"/><path d="m9.5 14.5 2.5 2.5 2.5-2.5"/></svg>',
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
        D = kaynak || { id: yeniId(), sinif: sinif, sube: BAGLI ? BAGLI.sube : subeAdi(), tarih: Date.now(), guncelleme: 0,
                        sayfalar: [yeniSayfa(T.mod)], aktif: 0, notId: '', notAd: '', kirli: false };
        kur();
        cizimAyarla();
        if (!kaynak) sonDefterOnerisi();
    }

    function kur() {
        var ort = document.createElement('div');
        ort.id = 'ysOrt';
        var kalemler = RENKLER.map(function (r, i) {
            return '<button type="button" class="ys-renk" data-renk="' + i + '" style="background:' + r.k + '; --rk:' + r.k + '" title="' +
                   esc(r.ad) + ' kalem (' + (i + 1) + ')" aria-label="' + esc(r.ad) + ' kalem">' + IK.kalem + '</button>';
        }).join('');
        var yan = function (taraf) {
            return '<div class="ys-yan ' + taraf + '" aria-label="Kalemler">' + kalemler + '<div class="ys-ara"></div>' +
                '<button type="button" class="ys-t" data-is="silgi" title="Silgi (S) — seçiliyken bir daha basınca: Tüm sayfayı sil" aria-label="Silgi">' +
                IK.silgi + '</button></div>';
        };
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
                '<div class="ys-baslik">' + IK.defter + '<span>Yazı Sayfası<small>' + esc(etiket()) + '</small></span></div>' +
                '<div class="ys-grup">' +
                  '<button type="button" class="ys-t" data-is="geri" title="Geri al (Ctrl+Z)">' + IK.geri + '</button>' +
                  '<button type="button" class="ys-t" data-is="ileri" title="Yinele (Ctrl+Y)">' + IK.ileri + '</button>' +
                  '<button type="button" class="ys-t" data-is="temizle" title="Sayfayı sil">' + IK.temizle + '</button>' +
                '</div>' +
                '<div class="ys-ayrac"></div>' +
                '<div class="ys-grup">' + modlar + '</div>' +
                '<div class="ys-grup">' + kalin + '</div>' +
                '<span class="ys-bos"></span>' +
                '<button type="button" class="ys-t ana" data-is="notKaydet" title="Bu defteri seviye notlarına kaydet">' + IK.yildiz +
                  '<span id="ysNotYazi">Seviye notlarına kaydet</span></button>' +
                '<button type="button" class="ys-t" data-is="panel" title="Geçmiş ve seviye notları">' + IK.saat + '<span>Geçmiş</span></button>' +
                '<button type="button" class="ys-t" data-is="pdf" title="PDF olarak indir — bütün sayfalar">' + IK.pdf + '<span>PDF</span></button>' +
                '<button type="button" class="ys-t" data-is="tamEkran" title="Tam ekran">' + IK.tamEkran + '</button>' +
                '<button type="button" class="ys-t kucult" data-is="kucult" title="Simge durumuna küçült (Esc) — sınıf açık kaldıkça sağ altta durur" aria-label="Simge durumuna küçült">' +
                  IK.kucult + '</button>' +
              '</div>' +
              '<div class="ys-sahne" id="ysSahne">' +
                '<div class="ys-kagit" id="ysKagit">' +
                  '<canvas class="ys-alt"></canvas><canvas class="ys-ust"></canvas>' +
                  '<div class="ys-silgi-iz"></div>' +
                  '<div class="ys-ipucu">' + IK.kalem + 'Yazmaya başla — kalem, parmak ya da fare</div>' +
                '</div>' +
                yan('sol') + yan('sag') +
                '<div class="ys-sayfalar" aria-label="Sayfalar">' +
                  '<button type="button" class="ys-t" data-is="onceki" title="Önceki sayfa (←)">' + IK.onceki + '</button>' +
                  '<span class="ys-sayfa" id="ysSayfa">1 / 1</span>' +
                  '<button type="button" class="ys-t" data-is="sonraki" title="Sonraki sayfa (→)">' + IK.sonraki + '</button>' +
                  '<span class="ys-ara"></span>' +
                  '<button type="button" class="ys-t" data-is="yeniSayfa" title="Yeni sayfa">' + IK.yeniSayfa + '</button>' +
                  '<button type="button" class="ys-t" data-is="sayfaSil" title="Bu sayfayı kaldır">' + IK.sayfaSil + '</button>' +
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

    /* KÜÇÜLT — sınıf açık kaldıkça pencere kapanmaz, sağ alta iner.
       Yazılan o ana kadar tarihiyle kaydedilir (sekme kapanırsa kaybolmasın). */
    function kucult() {
        if (!UI || UI.kucuk) return;
        try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) { }
        var so = UI.ort.querySelector('.ys-soru-ort'); if (so) so.remove();
        silSorKapat();
        UI.panel.classList.remove('acik');
        if (D && D.kirli && !bosMu(D.sayfalar)) gecmiseKaydet();
        UI.kucuk = true;
        UI.ort.classList.add('kucuk');
        document.body.style.overflow = _govdeTasma || '';
        pilGoster();
    }
    function buyut() {
        if (!UI || !UI.kucuk) return;
        UI.kucuk = false;
        UI.ort.classList.remove('kucuk');
        pilKaldir();
        _govdeTasma = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        cizimAyarla();
    }
    function pilGoster() {
        pilKaldir();
        var b = document.createElement('button');
        b.type = 'button';
        b.id = 'ysPil';
        b.title = 'Yazı Sayfası — aç';
        b.innerHTML = '<i>' + IK.defter + '</i><span>Yazı Sayfası<small>' + esc(etiket()) + '</small></span>';
        b.addEventListener('click', buyut);
        document.body.appendChild(b);
    }
    function pilKaldir() { var b = document.getElementById('ysPil'); if (b) b.remove(); }
    function sinifAdi(s) {
        s = String(s == null ? '' : s);
        if (/^\d+$/.test(s)) return s + '. sınıf';
        return (BAGLI && BAGLI.sinif === s && BAGLI.seviyeAd) ? BAGLI.seviyeAd : s;
    }
    function etiket() {
        if (!D) return '';
        var a = sinifAdi(D.sinif);
        return D.sube ? a + ' · ' + D.sube : a;
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
        var kucuktu = UI && UI.kucuk;
        ort.remove();
        pilKaldir();
        if (!kucuktu) document.body.style.overflow = _govdeTasma || '';
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
        /* clientWidth: açılış canlandırması (scale) ölçüyü küçültmesin */
        var gw = Math.max(200, UI.sahne.clientWidth), gh = Math.max(140, UI.sahne.clientHeight);
        UI.oran = gw / gh;
        var g = gorunum(sayfa(), UI.oran), Lw = g.x1 - g.x0;
        UI.x0 = g.x0; UI.x1 = g.x1; UI.gSayfa = sayfa();
        var w = Math.min(gw, gh * (Lw / H)), h = w * (H / Lw);
        UI.kagit.style.width = Math.round(w) + 'px';
        UI.kagit.style.height = Math.round(h) + 'px';
        var dpr = Math.min(3, window.devicePixelRatio || 1);
        [UI.alt, UI.ust].forEach(function (c) {
            c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
        });
        UI.dpr = dpr;
        UI.olcek = (w * dpr) / Lw;
        UI.cssOlcek = w / Lw;
        UI.iz.style.width = UI.iz.style.height = (SILGI_W * UI.cssOlcek) + 'px';
        sayfaCiz();
    }
    function sayfa() { return D.sayfalar[D.aktif]; }
    function sayfaCiz() {
        if (!UI || !D) return;
        var s = sayfa();
        var b = sinirlar(s);
        if (s !== UI.gSayfa || (b && (b[0] < UI.x0 || b[1] > UI.x1))) { cizimAyarla(); return; }
        cizgileriCiz(UI.alt.getContext('2d'), s.mod, UI.olcek, UI.x0, UI.x1);
        var ctx = UI.ust.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, UI.ust.width, UI.ust.height);
        s.cizimler.forEach(function (c) { cizimCiz(ctx, c, UI.olcek, UI.x0); });
        UI.ipucu.classList.toggle('gizli', !bosMu(D.sayfalar));
        aracGuncelle();
    }

    /* ---------------- kalem ---------------- */
    var _cz = null, _kalemVar = false;
    function nokta(e) {
        var r = UI.ust.getBoundingClientRect();
        return [ UI.x0 + (e.clientX - r.left) / r.width * (UI.x1 - UI.x0), (e.clientY - r.top) / r.height * H ];
    }
    function izKonum(e) {
        var r = UI.kagit.getBoundingClientRect();
        UI.iz.style.left = (e.clientX - r.left) + 'px';
        UI.iz.style.top = (e.clientY - r.top) + 'px';
    }
    function kalemBas(e) {
        silSorKapat();
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
        cizimCiz(ctx, _cz.c, UI.olcek, UI.x0);
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
            ctx.setTransform(UI.olcek, 0, 0, UI.olcek, -UI.x0 * UI.olcek, 0);
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

    /* ---------------- «Tüm sayfayı sil» sorusu ---------------- */
    function silSorAc(btn) {
        silSorKapat();
        if (!sayfa().cizimler.length) { bildir('Sayfa zaten boş'); return; }
        var d = document.createElement('div');
        d.className = 'ys-silsor';
        d.setAttribute('role', 'dialog');
        d.innerHTML = '<button type="button" data-is="tumSil">' + IK.temizle + '<span>Tüm sayfayı sil</span></button>';
        UI.kutu.appendChild(d);
        var k = UI.kutu.getBoundingClientRect(), r = btn.getBoundingClientRect();
        var w = d.offsetWidth, h = d.offsetHeight, x, y;
        if (btn.closest('.ys-yan.sol')) { x = r.right - k.left + 12; y = r.top - k.top + r.height / 2 - h / 2; }
        else if (btn.closest('.ys-yan.sag')) { x = r.left - k.left - 12 - w; y = r.top - k.top + r.height / 2 - h / 2; }
        else { x = r.left - k.left + r.width / 2 - w / 2; y = r.bottom - k.top + 8; }
        d.style.left = Math.max(8, Math.min(k.width - w - 8, x)) + 'px';
        d.style.top = Math.max(8, Math.min(k.height - h - 8, y)) + 'px';
        UI.silSor = d; UI.silSorBtn = btn;
    }
    function silSorKapat() {
        if (UI && UI.silSor) { UI.silSor.remove(); UI.silSor = null; UI.silSorBtn = null; }
    }

    /* ---------------- PDF ----------------
       Her sayfa çizgileriyle birlikte yüksek çözünürlüklü bir resme
       çizilir (silgi izleri de doğru çıksın diye resim), altına sınıf ve
       tarih yazılır; sayfalar A4 yatay bir PDF'e konup indirilir. Dış
       kütüphane gerekmez: PDF burada, elle yazılıyor. */
    function trAscii(x) {
        var h = { 'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ş': 's', 'Ş': 'S', 'ü': 'u', 'Ü': 'U' };
        return String(x || '').replace(/[çÇğĞıİöÖşŞüÜ]/g, function (c) { return h[c]; })
            .replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'defter';
    }
    function sayfaGorseli(s, no, top) {
        var g = gorunum(s, W / H), Lw = g.x1 - g.x0;
        var PW = 2400, PH = Math.round(PW * H / Lw), AY = 70;
        var c = document.createElement('canvas');
        c.width = PW; c.height = PH + AY;
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, c.width, c.height);
        var o = PW / Lw;
        cizgileriCiz(ctx, s.mod, o, g.x0, g.x1);
        var tmp = document.createElement('canvas');
        tmp.width = PW; tmp.height = PH;
        var tc = tmp.getContext('2d');
        s.cizimler.forEach(function (ci) { cizimCiz(tc, ci, o, g.x0); });
        ctx.drawImage(tmp, 0, 0);
        ctx.fillStyle = '#E2E7EE'; ctx.fillRect(28, PH + 6, PW - 56, 2);
        ctx.fillStyle = '#7A8594';
        ctx.font = '600 28px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillText('Yazı Sayfası · ' + etiket() + ' · ' + tarihYaz(D.tarih || Date.now()), 28, PH + AY / 2 + 4);
        ctx.textAlign = 'right';
        ctx.fillText(no + ' / ' + top, PW - 28, PH + AY / 2 + 4);
        var url = c.toDataURL('image/jpeg', 0.9);
        var ikili = atob(url.slice(url.indexOf(',') + 1)), u = new Uint8Array(ikili.length);
        for (var i = 0; i < ikili.length; i++) u[i] = ikili.charCodeAt(i);
        return { jpeg: u, w: c.width, h: c.height };
    }
    function pdfYap(resimler) {
        var parca = [], boy = 0, yer = [];
        function yaz(x) {
            var b = x;
            if (typeof x === 'string') { b = new Uint8Array(x.length); for (var i = 0; i < x.length; i++) b[i] = x.charCodeAt(i) & 255; }
            parca.push(b); boy += b.length;
        }
        function nesne(no, govde) { yer[no] = boy; yaz(no + ' 0 obj\n'); govde(); yaz('\nendobj\n'); }
        var n = resimler.length, PW = 841.89, PH = 595.28, PAY = 20, kids = [];
        for (var i = 0; i < n; i++) kids.push((3 + i * 3) + ' 0 R');
        yaz('%PDF-1.4\n%âãÏÓ\n');
        nesne(1, function () { yaz('<< /Type /Catalog /Pages 2 0 R >>'); });
        nesne(2, function () { yaz('<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + n + ' >>'); });
        resimler.forEach(function (r, i) {
            var po = 3 + i * 3, co = po + 1, io = po + 2;
            var k = Math.min((PW - 2 * PAY) / r.w, (PH - 2 * PAY) / r.h);
            var iw = r.w * k, ih = r.h * k, ix = (PW - iw) / 2, iy = (PH - ih) / 2;
            nesne(po, function () {
                yaz('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PW + ' ' + PH + '] /Resources << /XObject << /Im' + i + ' ' +
                    io + ' 0 R >> >> /Contents ' + co + ' 0 R >>');
            });
            var akis = 'q ' + iw.toFixed(2) + ' 0 0 ' + ih.toFixed(2) + ' ' + ix.toFixed(2) + ' ' + iy.toFixed(2) + ' cm /Im' + i + ' Do Q';
            nesne(co, function () { yaz('<< /Length ' + akis.length + ' >>\nstream\n' + akis + '\nendstream'); });
            nesne(io, function () {
                yaz('<< /Type /XObject /Subtype /Image /Width ' + r.w + ' /Height ' + r.h +
                    ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + r.jpeg.length + ' >>\nstream\n');
                yaz(r.jpeg);
                yaz('\nendstream');
            });
        });
        var xref = boy, top = 3 + n * 3;
        yaz('xref\n0 ' + top + '\n0000000000 65535 f \n');
        for (var j = 1; j < top; j++) yaz(('0000000000' + yer[j]).slice(-10) + ' 00000 n \n');
        yaz('trailer\n<< /Size ' + top + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF');
        return new Blob(parca, { type: 'application/pdf' });
    }
    function pdfIndir() {
        if (!D) return;
        if (bosMu(D.sayfalar)) { bildir('Defter boş — önce bir şey yaz', true); return; }
        try {
            var top = D.sayfalar.length;
            var resimler = D.sayfalar.map(function (s, i) { return sayfaGorseli(s, i + 1, top); });
            var blob = pdfYap(resimler);
            var d = new Date(D.tarih || Date.now());
            var gun = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
            var ad = 'yazi-sayfasi_' + trAscii(D.sube || sinifAdi(D.sinif)) + '_' + gun + '.pdf';
            var url = URL.createObjectURL(blob), a = document.createElement('a');
            a.href = url; a.download = ad; a.rel = 'noopener';
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
            bildir('PDF indirildi · ' + top + ' sayfa');
        } catch (e) {
            bildir('PDF hazırlanamadı', true);
        }
    }

    function tikla(e) {
        var t = e.target;
        if (t === UI.ort) return;                                    /* dışına basınca kapanmaz (yanlışlıkla silinmesin) */
        var b = t.closest && t.closest('[data-is],[data-renk],[data-kal],[data-mod],[data-sek],[data-ac],[data-sil],[data-not],[data-notsil]');
        /* açık «Tüm sayfayı sil» sorusu: dışına basınca kapanır; onu açan
           düğmeye yeniden basmak da yalnız kapatır */
        if (UI.silSor && !UI.silSor.contains(t)) {
            var acan = UI.silSorBtn;
            silSorKapat();
            if (b && b === acan) return;
        }
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
        if (is === 'silgi') {
            /* seçili silgiye İKİNCİ kez basınca: «Tüm sayfayı sil» */
            if (T.arac === 'silgi') silSorAc(b);
            else { T.arac = 'silgi'; aracGuncelle(); }
        }
        else if (is === 'kalem') { T.arac = 'kalem'; aracGuncelle(); }
        else if (is === 'tumSil') { silSorKapat(); temizle(); bildir('Sayfa silindi — geri almak için ↶'); }
        else if (is === 'pdf') pdfIndir();
        else if (is === 'geri') geriAl();
        else if (is === 'ileri') yinele();
        else if (is === 'temizle') silSorAc(b);
        else if (is === 'onceki') sayfayaGit(D.aktif - 1);
        else if (is === 'sonraki') sayfayaGit(D.aktif + 1);
        else if (is === 'yeniSayfa') yeniSayfaEkle();
        else if (is === 'sayfaSil') sayfaKaldir();
        else if (is === 'notKaydet') notKaydetSor();
        else if (is === 'panel') panelAcKapa();
        else if (is === 'panelKapat') UI.panel.classList.remove('acik');
        else if (is === 'tamEkran') tamEkran();
        else if (is === 'kucult') kucult();
        else if (is === 'kapat') kapat();
        else if (is === 'sonAc') { var id = b.getAttribute('data-id'); var s = UI.ort.querySelector('.ys-son'); if (s) s.remove(); gecmistenAc(id); }
        else if (is === 'sonKapat') { var s2 = UI.ort.querySelector('.ys-son'); if (s2) s2.remove(); }
    }

    function tus(e) {
        if (!UI || UI.kucuk) return;
        var yazi = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');
        if (e.key === 'Escape') {
            e.preventDefault(); e.stopPropagation();
            if (UI.silSor) { silSorKapat(); return; }
            var so = UI.ort.querySelector('.ys-soru-ort');
            if (so) { so.remove(); return; }
            if (UI.panel.classList.contains('acik')) { UI.panel.classList.remove('acik'); return; }
            if (document.fullscreenElement) return;          /* tarayıcı tam ekrandan çıkar */
            kucult(); return;
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
        [].forEach.call(UI.ort.querySelectorAll('.ys-bildiri'), function (x) { x.remove(); });
        var b = document.createElement('div');
        b.className = 'ys-bildiri' + (hata ? ' hata' : '');
        b.textContent = m;
        UI.sahne.appendChild(b);
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
            var k = L.filter(function (x) { return (x.sube || '') === (D.sube || ''); })[0];
            if (!k) return;                              /* yalnız bu sınıfın (şubenin) son defteri */
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
                ic.innerHTML = '<p class="ys-bilgi">' + esc(sinifAdi(D.sinif)) + ' — bu tarayıcıda yazılanlar. Kapattığında yazıldığı tarihle buraya düşer; ' +
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
                    esc(sinifAdi(D.sinif)) + ': <b>' + L.length + ' / ' + NOT_EN_COK + '</b></p>' +
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
                D = { id: yeniId(), kaynakId: k.id, sinif: D.sinif, sube: D.sube || '', tarih: Date.now(), guncelleme: 0,
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
             sinifAdi(D.sinif) + ' seviye notlarına kaydedilsin. Bir ad ver:', D.notId ? 'Güncelle' : 'Kaydet', false, function (ad) {
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
       SINIFA BAĞLI AÇILIŞ — Sınıflarım'da (hesap/listelerim.js) açık sınıf
       izlenir. Oraya dokunulmadı: yalnız dışarı açtığı llAktifSinif() ve
       llSinifGorunurMu() okunuyor. Değişiklik iki ardışık bakışta (~1 sn)
       aynı kalırsa uygulanır; veri tazelenirken panelin bir an boşalması
       pencereyi kapatıp açmasın.
       ------------------------------------------------------------------ */
    var BAGLI = null;                         /* { anahtar, sinif, sube, seviyeAd } */
    var DEVAM_SN = 45 * 60;                   /* aynı ders sayılan süre */
    var _aday = '', _adaySay = 0;

    function acikSinif() {
        try {
            if (!ogretmenMi()) return null;
            if (typeof window.llSinifGorunurMu === 'function' && !window.llSinifGorunurMu()) return null;
            var c = document.getElementById('content');
            if (!c || !c.getClientRects().length) return null;          /* Sınıflarım ekranda değil */
            var a = (typeof window.llAktifSinif === 'function') ? window.llAktifSinif() : null;
            if (!a || !a.lId || !a.cId) return null;
            var d = (typeof data !== 'undefined' && data) ? data : null;
            var lvl = d && d.levels ? d.levels[a.lId] : null;
            var cls = lvl && lvl.classes ? lvl.classes[a.cId] : null;
            if (!cls) return null;
            var m = String(lvl.name || '').match(/\d+/);
            var sinif = m ? String(parseInt(m[0], 10)) : 'x' + String(a.lId).replace(/[^A-Za-z0-9_]/g, '').slice(0, 24);
            return { anahtar: a.lId + '|' + a.cId, sinif: sinif, sube: String(cls.name || ''), seviyeAd: String(lvl.name || '') };
        } catch (e) { return null; }
    }

    function sinifIcinAc(b) {
        BAGLI = b;
        gecmisListe(b.sinif).then(function (L) {
            if (BAGLI !== b) return;                                    /* bu arada sınıf değişti */
            var son = L.filter(function (x) { return (x.sube || '') === b.sube; })[0];
            if (son && son.kod && (Date.now() - (son.guncelleme || 0)) < DEVAM_SN * 1000) {
                ac(b.sinif, { id: son.id, sinif: b.sinif, sube: b.sube, tarih: son.tarih || son.guncelleme, guncelleme: son.guncelleme,
                              sayfalar: defterCoz(son.kod), aktif: 0, notId: son.notId || '', notAd: '', kirli: false });
            } else {
                ac(b.sinif);
            }
        }, function () { if (BAGLI === b) ac(b.sinif); });
    }

    function sinifIzle() {
        var b = acikSinif();
        var k = b ? b.anahtar : '';
        var simdiki = BAGLI ? BAGLI.anahtar : '';
        if (k === simdiki) { _aday = ''; _adaySay = 0; return; }
        if (k !== _aday) { _aday = k; _adaySay = 1; return; }
        if (++_adaySay < 2) return;
        _aday = ''; _adaySay = 0;
        kapat(true);                     /* önceki sınıfın defteri tarihiyle kaydedilir */
        BAGLI = null;
        if (b) sinifIcinAc(b);
    }
    setInterval(sinifIzle, 500);

    window.KidefYaziSayfasi = {
        ac: ac, kapat: kapat, kucult: kucult, buyut: buyut,
        bagli: function () { return BAGLI; },
        gorunum: function () { return UI ? { x0: UI.x0, x1: UI.x1 } : null; },
        pdf: function () { return D ? pdfYap(D.sayfalar.map(function (s, i) { return sayfaGorseli(s, i + 1, D.sayfalar.length); })) : null; },
        /* test ve öteki modüller için */
        kodla: defterKodla, coz: defterCoz, gecmisListe: gecmisListe
    };
})();
