/* =====================================================================
   KİDEF · SINIF RAPORU (materyal kullanımı)  (sistem/materyalrapor.js)
   ---------------------------------------------------------------------
   ADI (26.10.2026): «Nerde Kalmıştık?» — öğretmen: "sınıflar açılan yan
   rapor popup ın ismini Nerde Kalmıştık? olsun". Pencere başlığı, sol
   kenardaki dikey dil ve ipuçları bu adla.

   Öğretmen (12.10.2026): "o sınıf listesindeki materyal kısmında hangi
   dosyaları açtığımı ne kadar süre işlediğimi gösteren bi rapor eklemek
   istiyorum, dikey bir popup şeklinde bakabileyim ... sınıf listesinde
   sol tarafta bi ok svg sine basınca çıksın."

   Öğretmen (25.10.2026): "Bir sınıfı açınca çıkan rapor kısmında açılan
   dokümanlar gösterilmesin ... 6A sınıfında materyallerden okul kitabı
   açıldı, o zaman o kitapta en son kaçıncı sayfada kalındı — zaten kitap
   tıklanınca en son nerede kalınmışsa orası açılması lazım ama rapordan
   da görülebilsin. Ayrıca oyun ve etkinlik kartları: ne kadar süre
   geçirildiği, hangi kartların kullanıldığı raporlarda olsun. Hangi
   dokümana bakılıp bakılmadığı önemli değil."

   NE YAPAR
   1) ÖLÇÜM — Sınıf panelinin "Materyaller" sekmesinde (#llMateryalKap)
      bir bağlantıya tıklanınca üç tür ayrılır:
        · kitap    : ders kitabı (kitap/N-sinif-YYYY-YYYY/). Kitap, BU
                     SINIFIN en son kaldığı sayfadan açılır (?s=…). Kitap
                     her sayfa çevrilişinde adresine ?s= yazıyor; sekme
                     açık kaldıkça oradan okunur, kapanınca son sayfa
                     sınıfa yazılır. Kitaplara hiçbir şey eklenmedi.
        · etkinlik : etkinlik kartları ve oyunlar (modül kartları,
                     Muhâdese dersleri, Kitap Etkinlikleri…). Kartın adı
                     ve sekmenin açık kaldığı süre yazılır.
        · belge    : sınıf belgeleri (PDF, Word…) ve Ders Kitabı dışındaki
                     belge kartları. Eskisi gibi yeni sekmede açılır ama
                     KAYDEDİLMEZ, raporda da görünmez (eski kayıtlar dahil).
   2) RAPOR — sol kenardaki «RAPOR» dili, sınıf listesindeki ok ya da
      "Sınıf değiştir" listesindeki ok soldan bir pano açar: ders
      kitabında kalınan sayfa («Kaldığı yerden aç»), kullanılan oyun ve
      etkinlik kartları (kaç kez, ne kadar), gün gün özet. O an açık olan
      kitap ve kartlar da "şu an açık" diye görünür.

   SÜRE NE ÖLÇÜYOR (öğretmenin seçimi)
   "Sekmenin AÇIK KALDIĞI süre". Ölçüm tamamen bu sayfadan yapılıyor;
   sekme arka planda unutulursa süre şişer — panoda bu not yazılı.

   MALİYET
   Kayıtlar önce tarayıcıda (localStorage) durur. Buluta yalnız DEĞİŞİKLİK
   olunca ve en sık 90 sn'de bir, tek belgeye yazılır:
       kullanicilar/{uid}.materyalKayit = [ {s,sa,k,y,a,t,sn,sf}, ... ]  (son 500)
       k: 'kitap' | 'etkinlik'   (eski kayıtlarda yok → yoldan anlaşılır)
       sf: kitapta kalınan sayfa ('34', 'kapak', 'son') — yalnız kitapta
   Belgeler artık yazılmadığı için kayıt da daha yavaş dolar.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefMateryalRapor) return;

    var ANAHTAR = 'kidefMateryalKayit';
    var EN_COK = 500;          /* tarayıcıda ve bulutta tutulan kayıt sayısı */
    var ESIK_SN = 4;           /* bundan kısa açılışlar yanlışlıkla sayılmasın */
    var YAZ_ARALIK_SN = 90;    /* buluta en sık bu kadarda bir */
    var YOKLA_MS = 4000;       /* açık sekme kapandı mı diye bakma sıklığı */
    var SAYFA_MS = 1500;       /* açık kitabın sayfasını okuma sıklığı */
    var EN_COK_TEK_SN = 6 * 3600;   /* tek açılışta en çok 6 saat sayılsın */

    /* Ders kitapları: kitap/8-sinif-2026-2027/… (site kökü ya da bilgisayardaki
       kopya fark etmez). Kidef Arapça 2. Baskı bu kalıba girmez; etkinlik
       olarak sayılır (26.10.2026'dan beri kart değil, belge ızgarasında A4
       kitap — bkz. turBul ve kartAdi). */
    var KITAP_DESEN = /(?:^|\/)kitap\/(\d+)-sinif-(\d{4}-\d{4})\//;
    var BELGE_UZANTI = /\.(pdf|docx?|pptx?|xlsx?|odt|ods|odp|rtf|zip|rar|jpe?g|png|gif|webp)$/i;

    var kayit = [];            /* {s:'lId|cId', sa:'sınıf adı', k, y:yol, a:ad, t:ms, sn:saniye, sf} */
    var kirli = false, sonYazim = 0, bulutOkundu = false;
    var sonRapor = null;       /* açık panonun sınıfı: {lId, cId} */

    /* ------------------------------------------------------------ ARAÇ */
    function kac(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function sure(sn) {
        sn = Math.max(0, Math.round(sn || 0));
        if (sn < 60) return sn + ' sn';
        var d = Math.round(sn / 60);
        if (d < 60) return d + ' dk';
        var s = Math.floor(d / 60);
        return s + ' sa' + (d % 60 ? ' ' + (d % 60) + ' dk' : '');
    }
    function gunAd(ms) {
        var d = new Date(ms), b = new Date();
        var ayni = d.toDateString() === b.toDateString();
        if (ayni) return 'bugün ' + iki(d.getHours()) + ':' + iki(d.getMinutes());
        var dun = new Date(b.getTime() - 86400000);
        if (d.toDateString() === dun.toDateString()) return 'dün ' + iki(d.getHours()) + ':' + iki(d.getMinutes());
        return iki(d.getDate()) + '.' + iki(d.getMonth() + 1) + '.' + d.getFullYear();
    }
    function gunKod(ms) {
        var d = new Date(ms);
        return d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate());
    }
    function iki(n) { return (n < 10 ? '0' : '') + n; }
    function yazi(el) { return el ? String(el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }
    function kisalt(s) { s = String(s || ''); return s.length > 90 ? s.slice(0, 88) + '…' : s; }

    /* Dosya adı: önce bağlantının yazısı, olmazsa dosya adı. */
    function baglantiAdi(a) {
        var t = (a.getAttribute('title') || '').trim();
        var y = yazi(a);
        var ad = y || t;
        if (ad) return kisalt(ad);
        var p = (a.getAttribute('href') || '').split('?')[0].split('/').pop();
        try { p = decodeURIComponent(p); } catch (e) { }
        return p || 'dosya';
    }
    function kisaYol(y) {
        var s = String(y || '').split('?')[0].split('#')[0];
        try { s = decodeURIComponent(s); } catch (e) { }
        return s.replace(/^.*?\/\/[^/]+\//, '');
    }

    /* ----------------------------------------------------- TÜR VE AD */
    /* kitap/8-sinif-2026-2027/index.html → kitap/8-sinif-2026-2027/ */
    function kitapYolu(y) {
        var m = /(?:^|\/)(kitap\/[^/?#]+\/)/.exec(String(y || ''));
        return m ? m[1] : String(y || '');
    }
    function kitapMi(y) { return KITAP_DESEN.test(String(y || '')); }
    function kitapAdi(y) {
        var m = KITAP_DESEN.exec(String(y || ''));
        return m ? m[1] + '. sınıf ders kitabı · ' + m[2] : 'Ders kitabı (çevrim içi)';
    }
    function sayfaYazi(sf) {
        sf = String(sf || '');
        if (!sf) return '';
        if (/^\d+$/.test(sf)) return 's. ' + sf;
        if (sf === 'kapak') return 'kapak';
        if (sf === 'son') return 'arka kapak';
        return sf;
    }

    /* Tıklanan bağlantının türü. */
    function turBul(a, yol) {
        if (kitapMi(yol)) return 'kitap';
        var kart = a.closest ? a.closest('.a4-kart') : null;
        if (kart && /ders kitab/i.test(yazi(kart.querySelector('.a4-ad')))) return 'kitap';
        /* Kidef Arapça kitabı belge ızgarasında duruyor ama eskisi gibi
           etkinlik sayılır, süresi ölçülür (26.10.2026) */
        if (/(?:^|\/)kitap\/kidef-arapca-2-baski\//.test(yol)) return 'etkinlik';
        if (a.closest && a.closest('.ihdoc-acc')) return 'belge';       /* sınıf belgeleri bloğu */
        if (BELGE_UZANTI.test(yol) || /(?:^|\/)dosyalar\//.test(yol)) return 'belge';
        return 'etkinlik';
    }
    /* Eski kayıtlarda tür yok: yoldan anlaşılır. */
    function kayitTur(r) {
        if (r.k) return r.k;
        var y = String(r.y || '');
        if (kitapMi(y)) return 'kitap';
        if (BELGE_UZANTI.test(y) || /(?:^|\/)dosyalar\//.test(y)) return 'belge';
        return 'etkinlik';
    }

    /* Etkinlik kartının adı: kartın başlığı; Muhâdese dersinde ders adı;
       Kitap Etkinliklerinde etkinlik adı ve kitaptaki sayfası. */
    function kartAdi(a) {
        try {
            /* Kidef Arapça kitabı: eski kartın adıyla (rapor satırları birleşsin) */
            if (a.classList.contains('a4-kart') && /kidef-arapca-2-baski/.test(a.getAttribute('href') || ''))
                return 'Kidef Arapça 📒 2. Baskı';
            if (a.classList.contains('game-card')) {
                var h = yazi(a.querySelector('h3'));
                if (h) return kisalt(h);
            }
            if (a.classList.contains('mh-ders')) {
                var mt = yazi(a.querySelector('.mh-t'));
                if (mt) return kisalt('Muhâdese · ' + mt);
            }
            if (a.classList.contains('ke-etk')) {
                var b = yazi(a.querySelector('.ke-metin b')), sf = yazi(a.querySelector('.ke-sayfa'));
                if (b) return kisalt('Kitap etkinliği · ' + b + (sf ? ' (' + sf + ')' : ''));
            }
            var parca = a.closest('.ke-parcalar');
            if (parca) {
                var ana = parca.previousElementSibling;
                var ab = ana ? yazi(ana.querySelector('.ke-metin b')) : '';
                return kisalt('Kitap etkinliği · ' + (ab ? ab + ' — ' : '') + yazi(a));
            }
        } catch (e) { }
        return baglantiAdi(a);
    }

    /* --------------------------------------------------------- DEPOLAMA */
    function yerelOku() {
        try {
            var a = JSON.parse(localStorage.getItem(ANAHTAR) || '[]');
            return Array.isArray(a) ? a : [];
        } catch (e) { return []; }
    }
    function yerelYaz() {
        try { localStorage.setItem(ANAHTAR, JSON.stringify(kayit.slice(-EN_COK))); } catch (e) { }
    }
    function dbAl() {
        try { if (typeof db !== 'undefined' && db) return db; } catch (e) { }
        try { return window.db || (window.firebase && firebase.firestore()); } catch (e) { }
        return null;
    }
    function kullanici() {
        try {
            var u = (window.firebase && firebase.auth && firebase.auth().currentUser) || null;
            return (u && !u.isAnonymous) ? u : null;
        } catch (e) { return null; }
    }
    function kimlik(r) { return r.t + '|' + r.y; }

    function birlestir(dis) {
        if (!dis || !dis.length) return false;
        var var_ = {}, i, eklendi = false;
        for (i = 0; i < kayit.length; i++) var_[kimlik(kayit[i])] = 1;
        for (i = 0; i < dis.length; i++) {
            var r = dis[i];
            if (!r || !r.t || !r.y) continue;
            if (!var_[kimlik(r)]) { kayit.push(r); var_[kimlik(r)] = 1; eklendi = true; }
        }
        kayit.sort(function (a, b) { return a.t - b.t; });
        if (kayit.length > EN_COK) kayit = kayit.slice(-EN_COK);
        yerelYaz();
        return eklendi;
    }

    /* Bulutu bir kez oku (oturum açılınca), sonra değiştikçe yaz. */
    function bulutuOku() {
        if (bulutOkundu) return;
        var u = kullanici(), D = dbAl();
        if (!u || !D) return;
        bulutOkundu = true;
        D.collection('kullanicilar').doc(u.uid).get().then(function (s) {
            var d = s && s.exists ? s.data() : null;
            if (d && Array.isArray(d.materyalKayit) && birlestir(d.materyalKayit)) {
                /* pano açıkken buluttan yeni kayıt geldiyse tazele */
                var o = document.getElementById('mrp-ort');
                if (o && o.classList.contains('acik') && sonRapor) ciz(sonRapor.lId, sonRapor.cId);
            }
        }).catch(function () { bulutOkundu = false; });
    }
    function bulutaYaz(zorla) {
        if (!kirli) return;
        if (!zorla && (Date.now() - sonYazim) / 1000 < YAZ_ARALIK_SN) return;
        var u = kullanici(), D = dbAl();
        if (!u || !D) return;                 /* giriş yoksa yalnız tarayıcıda durur */
        sonYazim = Date.now();
        kirli = false;
        D.collection('kullanicilar').doc(u.uid)
            .set({ materyalKayit: kayit.slice(-EN_COK) }, { merge: true })
            .catch(function () { kirli = true; });
    }

    /* ------------------------------------------------------------ ÖLÇÜM */
    function sinifAdi(lId, cId) {
        try {
            var d = (typeof data !== 'undefined' && data) ? data : (window.data || null);
            var lvl = d && d.levels ? d.levels[lId] : null;
            var sf = (lvl && lvl.classes && cId) ? lvl.classes[cId] : null;
            return (sf && sf.name) || (lvl && lvl.name) || '';
        } catch (e) { return ''; }
    }
    function aktifSinif() {
        try {
            var a = (typeof window.llAktifSinif === 'function') ? window.llAktifSinif() : null;
            if (!a || !a.lId) return null;
            return { anahtar: a.lId + '|' + a.cId, ad: sinifAdi(a.lId, a.cId) };
        } catch (e) { return null; }
    }

    var acikList = [];   /* {w, r, bas} */

    function izlemeyeAl(w, r) {
        if (!w) return;
        acikList.push({ w: w, r: r, bas: Date.now() });
    }

    /* AÇIK KİTABIN SAYFASI — kitap (uygulama.js) her çevrilişte adresine
       ?s=<basılı sayfa | kapak | son> yazıyor. Kitap aynı sitede olduğu için
       açılan sekmenin adresi buradan okunabiliyor. Sekme kapanırken son
       sayfa kaçmasın diye kitabın pagehide'ına da bir dinleyici konur
       (sayfa yenilenirse yeniden konur). */
    function sayfaOku(o) {
        if (!o || !o.r || o.r.k !== 'kitap') return;
        try {
            var w = o.w;
            if (!w || w.closed) return;
            var l = w.location, h = l && l.href;
            if (!h || h === 'about:blank') return;
            var yol = kisaYol(h);
            if (!kitapMi(yol)) return;
            var sf = new URLSearchParams(l.search || '').get('s');
            if (sf) o.r.sf = sf;
            var ky = kitapYolu(yol);
            if (ky !== o.r.y) { o.r.y = ky; o.r.a = kitapAdi(ky); }
            if (!w.__mrpDinle) {
                w.__mrpDinle = 1;
                w.addEventListener('pagehide', function () { sayfaOku(o); });
            }
        } catch (e) { }     /* başka siteye geçtiyse okunamaz; son okunan kalır */
    }
    setInterval(function () {
        for (var i = 0; i < acikList.length; i++) sayfaOku(acikList[i]);
    }, SAYFA_MS);

    setInterval(function () {
        if (!acikList.length) return;
        var kalan = [], i, o, gecen;
        for (i = 0; i < acikList.length; i++) {
            o = acikList[i];
            var kapandi = true;
            try { kapandi = !!o.w.closed; } catch (e) { kapandi = false; }
            gecen = Math.round((Date.now() - o.bas) / 1000);
            if (!kapandi && gecen < EN_COK_TEK_SN) { kalan.push(o); continue; }
            sayfaOku(o);
            gecen = Math.min(gecen, EN_COK_TEK_SN);
            if (gecen >= ESIK_SN) { o.r.sn = gecen; kayit.push(o.r); kirli = true; yerelYaz(); }
        }
        acikList = kalan;
        bulutaYaz(false);
    }, YOKLA_MS);

    function kapanisaYaz() {
        var i, gecen, degisti = false;
        for (i = 0; i < acikList.length; i++) {
            sayfaOku(acikList[i]);
            gecen = Math.min(Math.round((Date.now() - acikList[i].bas) / 1000), EN_COK_TEK_SN);
            if (gecen >= ESIK_SN) { acikList[i].r.sn = gecen; kayit.push(acikList[i].r); degisti = true; }
        }
        acikList = [];
        if (degisti) { kirli = true; yerelYaz(); }
        bulutaYaz(true);
    }
    window.addEventListener('pagehide', kapanisaYaz);
    window.addEventListener('beforeunload', kapanisaYaz);

    /* Bu sınıfın bu kitapta en son kaldığı sayfa (kapanmış kayıtlar ve o an
       açık olan kitap birlikte). */
    function sonSayfa(anahtar, ky) {
        var en = null, i, r;
        var hepsi = kayit.slice();
        for (i = 0; i < acikList.length; i++) { sayfaOku(acikList[i]); hepsi.push(acikList[i].r); }
        for (i = 0; i < hepsi.length; i++) {
            r = hepsi[i];
            if (!r || r.s !== anahtar || !r.sf || kayitTur(r) !== 'kitap' || kitapYolu(r.y) !== ky) continue;
            if (!en || r.t >= en.t) en = r;
        }
        return en ? { sf: String(en.sf), t: en.t } : null;
    }
    function sayfaliAdres(href, sf) {
        try {
            var u = new URL(href, location.href);
            u.searchParams.set('s', sf);
            return u.toString();
        } catch (e) {
            return href.split('#')[0].replace(/([?&])s=[^&]*&?/, '$1').replace(/[?&]$/, '') +
                (href.indexOf('?') < 0 ? '?' : '&') + 's=' + encodeURIComponent(sf);
        }
    }

    /* Kitabı bir sınıf için aç: o sınıfın kaldığı sayfadan. */
    function kitapAcAdres(href, anahtar, sinifAd) {
        var ky = kitapYolu(kisaYol(href));
        var son = (anahtar && kitapMi(ky)) ? sonSayfa(anahtar, ky) : null;
        var r = { s: anahtar || '', sa: sinifAd || '', k: 'kitap', y: ky, a: kitapAdi(ky), t: Date.now(), sn: 0 };
        if (son && son.sf) r.sf = son.sf;          /* hiç çevrilmese de açıldığı sayfa */
        return { adres: (son && son.sf) ? sayfaliAdres(href, son.sf) : href, r: r };
    }

    /* Materyaller sekmesindeki bağlantılar: betikle açılır ki sekmenin ne
       zaman kapandığı görülebilsin. Yalnız #llMateryalKap içi dinlenir —
       sitenin geri kalanına dokunulmaz. */
    document.addEventListener('click', function (e) {
        var kap = document.getElementById('llMateryalKap');
        if (!kap) return;
        var a = (e.target && e.target.closest) ? e.target.closest('a[href]') : null;
        if (!a || !kap.contains(a)) return;
        var href = a.getAttribute('href') || '';
        if (!href || href.charAt(0) === '#' || /^(javascript|mailto|tel):/i.test(href)) return;
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;

        var s = aktifSinif();
        var yol = kisaYol(a.href);
        var tur = turBul(a, yol);
        if (tur === 'kitap') birlestir(yerelOku());   /* başka sekmede kalınan sayfa da bilinsin */
        var adres = a.href, r = null;
        if (tur === 'kitap') {
            var k = kitapAcAdres(a.href, s ? s.anahtar : '', s ? s.ad : '');
            adres = k.adres; r = k.r;
        } else if (tur === 'etkinlik') {
            r = { s: s ? s.anahtar : '', sa: s ? s.ad : '', k: 'etkinlik',
                  y: yol, a: kartAdi(a), t: Date.now(), sn: 0 };
        }
        /* belge: eskisi gibi yeni sekmede açılır, kaydedilmez */
        var w = null;
        try { w = window.open(adres, '_blank'); } catch (x) { w = null; }
        if (w) { e.preventDefault(); if (r) izlemeyeAl(w, r); }
        /* engellendiyse tarayıcı kendi açsın, süre ölçülmez */
    }, true);

    /* ------------------------------------------------------------ RAPOR */
    function stil() {
        if (document.getElementById('mrpStil')) return;
        var s = document.createElement('style');
        s.id = 'mrpStil';
        s.textContent = [
            '#mrp-ort{ position:fixed; inset:0; z-index:6000; display:none;',
            '  background:rgba(23,33,48,.45); backdrop-filter:blur(3px); }',
            '#mrp-ort.acik{ display:block; }',
            /* SOLDAN açılır (Geylani, 12.10.2026): ok sınıf listesinin
               solunda, pano da aynı yönden girsin. */
            '#mrp-pano{ position:absolute; top:0; left:0; height:100%;',
            '  width:min(430px, 94vw); background:#fff; box-shadow:18px 0 44px -16px rgba(0,0,0,.45);',
            '  display:flex; flex-direction:column; transform:translateX(-100%);',
            '  transition:transform .32s cubic-bezier(.22,.8,.26,1); }',
            '#mrp-ort.acik #mrp-pano{ transform:none; }',
            '#mrp-bas{ flex:0 0 auto; padding:16px 18px 12px; border-bottom:1px solid #eef2f7;',
            '  display:flex; align-items:flex-start; gap:10px; }',
            '#mrp-bas h3{ margin:0; font-size:1.12rem; color:#117A65; line-height:1.25; }',
            '#mrp-bas small{ display:block; color:#8A93A0; font-size:.8rem; font-weight:600; margin-top:2px; }',
            '#mrp-kapat{ margin-left:auto; border:0; background:#EF5350; color:#fff; width:34px; height:34px;',
            '  border-radius:50%; font-size:1.25rem; line-height:1; cursor:pointer; flex:0 0 auto; }',
            '#mrp-ozet{ flex:0 0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:8px;',
            '  padding:12px 18px; border-bottom:1px solid #eef2f7; }',
            '.mrp-kutu{ background:#F4F8F7; border-radius:12px; padding:9px 8px; text-align:center; }',
            '.mrp-kutu b{ display:block; font-size:1.08rem; color:#117A65; }',
            '.mrp-kutu span{ font-size:.7rem; color:#8A93A0; font-weight:700; letter-spacing:.03em; }',
            '.mrp-kutu.mrp-kutu-kitap{ background:#FFF4E5; }',
            '.mrp-kutu.mrp-kutu-kitap b{ color:#B45309; }',
            '#mrp-liste{ flex:1 1 auto; min-height:0; overflow-y:auto; padding:10px 14px 18px; }',
            '.mrp-sat{ display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:12px; }',
            '.mrp-sat + .mrp-sat{ margin-top:4px; }',
            '.mrp-sat:nth-child(odd){ background:#FAFBFC; }',
            '.mrp-sira{ flex:0 0 auto; width:26px; height:26px; border-radius:50%; background:#E8F5F1;',
            '  color:#117A65; font-weight:700; font-size:.8rem; display:flex; align-items:center;',
            '  justify-content:center; }',
            '.mrp-ic{ flex:1 1 auto; min-width:0; }',
            '.mrp-ad{ font-size:.92rem; font-weight:600; color:#223; line-height:1.25;',
            '  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }',
            '.mrp-alt{ font-size:.72rem; color:#95A0AC; margin-top:2px; }',
            '.mrp-sag{ flex:0 0 auto; text-align:right; }',
            '.mrp-sure{ font-weight:700; color:#117A65; font-size:.9rem; white-space:nowrap; }',
            '.mrp-kez{ font-size:.7rem; color:#95A0AC; }',
            '.mrp-cubuk{ height:4px; border-radius:3px; background:#E7EEF4; margin-top:5px; overflow:hidden; }',
            '.mrp-cubuk i{ display:block; height:100%; background:linear-gradient(90deg,#16A085,#58C9A9); }',
            '.mrp-bol{ margin:14px 2px 6px; font-size:.74rem; font-weight:800; letter-spacing:.05em;',
            '  color:#8A93A0; text-transform:uppercase; }',
            '.mrp-bol:first-child{ margin-top:4px; }',
            '.mrp-acik{ display:inline-block; margin-left:6px; padding:1px 7px; border-radius:20px;',
            '  background:#E8F5F1; color:#117A65; font-size:.64rem; font-weight:800; letter-spacing:.03em;',
            '  vertical-align:middle; white-space:nowrap; }',
            /* ders kitabı kartı (25.10.2026) */
            '.mrp-kitap{ border:1px solid #F3DCC2; border-left:5px solid #D97706; border-radius:14px;',
            '  padding:12px 14px; background:linear-gradient(135deg,#FFF8EF 0%,#FFFFFF 72%); }',
            '.mrp-kitap + .mrp-kitap{ margin-top:8px; }',
            '.mrp-kitap-ust{ display:flex; align-items:center; gap:8px; font-weight:700; color:#7A4A12;',
            '  font-size:.9rem; line-height:1.25; }',
            '.mrp-kitap-ust svg{ width:20px; height:20px; flex:0 0 auto; color:#D97706; }',
            '.mrp-kitap-sayfa{ display:flex; align-items:baseline; gap:9px; margin:9px 0 3px; }',
            '.mrp-kitap-sayfa small{ color:#8A93A0; font-weight:800; font-size:.68rem; letter-spacing:.05em;',
            '  text-transform:uppercase; }',
            '.mrp-kitap-sayfa b{ font-size:1.55rem; color:#B45309; line-height:1; }',
            '.mrp-kitap-sayfa b.yok{ font-size:.92rem; color:#8A93A0; font-weight:600; }',
            '.mrp-kitap-ac{ margin-top:10px; border:0; border-radius:10px; background:#D97706; color:#fff;',
            '  font-weight:700; font-size:.84rem; padding:8px 13px; cursor:pointer; font-family:inherit; }',
            '.mrp-kitap-ac:hover{ background:#B45309; }',
            '.mrp-gun{ display:flex; align-items:center; gap:9px; font-size:.78rem; color:#55606C;',
            '  padding:4px 2px; }',
            '.mrp-gun b{ flex:0 0 78px; font-weight:600; color:#7b8a99; }',
            '.mrp-gun em{ flex:1 1 auto; min-width:0; height:9px; border-radius:5px;',
            '  background:#EDF2F6; overflow:hidden; display:block; }',
            '.mrp-gun em i{ display:block; height:100%; border-radius:5px;',
            '  background:linear-gradient(90deg,#16A085,#7ed3bb); }',
            '.mrp-gun span{ flex:0 0 auto; white-space:nowrap; font-weight:700; color:#55606C; }',
            '.mrp-yok{ padding:34px 18px; text-align:center; color:#8A93A0; font-size:.92rem; line-height:1.65; }',
            '.mrp-yok-kucuk{ padding:8px 4px 2px; text-align:left; color:#8A93A0; font-size:.82rem; line-height:1.55; }',
            '#mrp-not{ flex:0 0 auto; padding:9px 18px 13px; border-top:1px solid #eef2f7;',
            '  font-size:.7rem; color:#9AA5B1; line-height:1.5; }',
            /* sınıf listesindeki ok */
            '#ll-root .ll-rapor-ok{ flex:0 0 auto; width:26px; height:26px; margin:0 6px 0 0;',
            '  padding:0; border:0; cursor:pointer; color:#16A085; line-height:0;',
            '  background:rgba(22,160,133,.12); border-radius:8px;',
            '  display:inline-flex !important; align-items:center; justify-content:center; }',
            '#ll-root .ll-rapor-ok:hover{ color:#0E7A66; background:rgba(22,160,133,.26); }',
            '#ll-root .ll-rapor-ok svg{ width:17px; height:17px; display:block; }',
            '#ll-root .class-item.active-class .ll-rapor-ok{ color:#fff; background:rgba(255,255,255,.26); }',
            /* "Sınıf değiştir" açılır listesinde de aynı ok (12.10.2026). */
            '#llSinifSec .lss-sat{ display:flex; align-items:center; gap:2px; }',
            '#llSinifSec .lss-sat .lss-sinif{ flex:1 1 auto; min-width:0; }',
            '#llSinifSec .lss-rapor{ flex:0 0 auto; width:26px; height:26px; margin:0 0 0 7px;',
            '  padding:0; border:0; cursor:pointer; color:#16A085; line-height:0;',
            '  background:rgba(22,160,133,.12); border-radius:8px;',
            '  display:inline-flex !important; align-items:center; justify-content:center; }',
            '#llSinifSec .lss-rapor:hover{ color:#0E7A66; background:rgba(22,160,133,.26); }',
            '#llSinifSec .lss-rapor svg{ width:17px; height:17px; display:block; }',
            /* ---- SOL KENARDAKİ DİKEY «RAPOR» DİLİ (Geylani, 12.10.2026:
                 "rapor yazısı solda aşağıdan yukarıya olsun, tıklanınca
                  açılsın") — sınıf açıkken ekranın sol kenarında durur. */
            '#mrp-dil{ position:fixed; left:0; top:50%; transform:translateY(-50%);',
            '  z-index:5900; display:none; flex-direction:column; align-items:center; gap:9px;',
            '  background:#16A085; color:#fff; border:0; cursor:pointer; font-family:inherit;',
            '  border-radius:0 16px 16px 0; padding:20px 8px 16px;',
            '  box-shadow:4px 0 18px -5px rgba(0,0,0,.40); }',
            '#mrp-dil.mrp-gor{ display:inline-flex; }',
            '#mrp-dil:hover{ background:#0E7A66; padding-inline-end:12px; }',
            '#mrp-dil .mrp-dil-yaz{ writing-mode:vertical-rl; transform:rotate(180deg);',
            '  font-weight:800; letter-spacing:.17em; font-size:.84rem; line-height:1;',
            '  white-space:nowrap; }',
            '#mrp-dil .mrp-dil-ok{ width:15px; height:15px; display:block; flex:0 0 auto; }',
            '@media (max-width: 700px){ #mrp-dil{ padding:14px 6px 11px; }',
            '  #mrp-dil .mrp-dil-yaz{ font-size:.74rem; letter-spacing:.12em; } }'
        ].join('\n');
        document.head.appendChild(s);
    }

    function panoKur() {
        if (document.getElementById('mrp-ort')) return;
        stil();
        var o = document.createElement('div');
        o.id = 'mrp-ort';
        o.innerHTML =
            '<div id="mrp-pano" role="dialog" aria-modal="true" aria-label="Nerde Kalmıştık?">' +
            '<div id="mrp-bas"><div><h3 id="mrp-ad">Nerde Kalmıştık?</h3>' +
            '<small id="mrp-alt">ders kitabı, oyun ve etkinlik kartları</small></div>' +
            '<button id="mrp-kapat" title="Kapat" aria-label="Kapat">&times;</button></div>' +
            '<div id="mrp-ozet"></div><div id="mrp-liste"></div>' +
            '<div id="mrp-not">Kitapta kalınan sayfa, kitap bu sınıfın <b>Materyaller</b> sekmesinden ' +
            'açıldığında kaydedilir; kitap bu sınıf için bir dahaki sefere o sayfadan açılır. ' +
            'Süre, açılan sekmenin <b>açık kaldığı</b> süredir; sekme arka planda unutulursa ' +
            'olduğundan uzun görünür. Belgeler (PDF, Word…) rapora girmez.</div></div>';
        document.body.appendChild(o);
        o.addEventListener('click', function (e) { if (e.target === o) kapat(); });
        document.getElementById('mrp-kapat').onclick = kapat;
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && o.classList.contains('acik')) kapat();
        });
        /* «Kaldığı yerden aç» */
        document.getElementById('mrp-liste').addEventListener('click', function (e) {
            var b = e.target && e.target.closest ? e.target.closest('.mrp-kitap-ac') : null;
            if (!b || !sonRapor) return;
            var href;
            try { href = new URL(b.getAttribute('data-yol') + 'index.html', location.href).toString(); }
            catch (x) { href = b.getAttribute('data-yol') + 'index.html'; }
            var anahtar = sonRapor.lId + '|' + sonRapor.cId;
            var k = kitapAcAdres(href, anahtar, sinifAdi(sonRapor.lId, sonRapor.cId));
            var w = null;
            try { w = window.open(k.adres, '_blank'); } catch (x) { w = null; }
            if (w) { izlemeyeAl(w, k.r); kapat(); }
        });
    }

    function kapat() {
        var o = document.getElementById('mrp-ort');
        if (o) o.classList.remove('acik');
    }

    function kitapSvg() {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5' +
            'C4.7 19 4 18.3 4 17.5zM20 5.5c0-.8-.7-1.5-1.5-1.5H13v15h5.5c.8 0 1.5-.7 1.5-1.5z" fill="none" ' +
            'stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>';
    }

    function ac(lId, cId) {
        panoKur();
        birlestir(yerelOku());        /* öbür sekmelerin yazdıkları da gelsin */
        bulutuOku();
        if (!(lId && cId)) {
            var a0 = (typeof window.llAktifSinif === 'function') ? window.llAktifSinif() : null;
            lId = a0 && a0.lId; cId = a0 && a0.cId;
        }
        sonRapor = { lId: lId || '', cId: cId || '' };
        ciz(sonRapor.lId, sonRapor.cId);
        document.getElementById('mrp-liste').scrollTop = 0;
        requestAnimationFrame(function () {
            document.getElementById('mrp-ort').classList.add('acik');
        });
    }

    function ciz(lId, cId) {
        var anahtar = (lId && cId) ? (lId + '|' + cId) : '';
        var sinifAd = sinifAdi(lId, cId);
        var simdi = Date.now(), i, r;

        var ben = kayit.filter(function (x) { return x && x.s === anahtar; });
        /* o an açık olanlar da görünsün (süresi şimdiye kadar) */
        for (i = 0; i < acikList.length; i++) {
            var o = acikList[i];
            if (!o.r || o.r.s !== anahtar) continue;
            sayfaOku(o);
            var c = {}, k;
            for (k in o.r) if (Object.prototype.hasOwnProperty.call(o.r, k)) c[k] = o.r[k];
            c.sn = Math.min(Math.round((simdi - o.bas) / 1000), EN_COK_TEK_SN);
            c.acik = true;
            ben.push(c);
        }
        /* Sınıf adı listeden okunamadıysa kaydın kendi içindekini kullan. */
        if (!sinifAd) { for (var z = ben.length - 1; z >= 0; z--) if (ben[z].sa) { sinifAd = ben[z].sa; break; } }
        document.getElementById('mrp-ad').textContent = (sinifAd ? sinifAd + ' · ' : '') + 'Nerde Kalmıştık?';
        document.getElementById('mrp-alt').textContent = 'ders kitabında kalınan sayfa, oyun ve etkinlik kartları';

        /* --- topla: kitaplar ve kartlar; belgeler atlanır --- */
        var kitaplar = {}, kartlar = {}, gunler = {}, toplamSn = 0;
        for (i = 0; i < ben.length; i++) {
            r = ben[i];
            var tur = kayitTur(r);
            if (tur === 'belge') continue;
            var sn = r.sn || 0;
            toplamSn += sn;
            var g = gunKod(r.t);
            gunler[g] = (gunler[g] || 0) + sn;
            if (tur === 'kitap') {
                var ky = kitapYolu(r.y);
                var b = kitaplar[ky] || (kitaplar[ky] = { y: ky, ad: kitapAdi(ky), kez: 0, sn: 0, son: 0, sf: '', sfT: 0, acik: false });
                b.kez++; b.sn += sn;
                if (r.t > b.son) b.son = r.t;
                if (r.sf && r.t >= b.sfT) { b.sf = String(r.sf); b.sfT = r.t; }
                if (r.acik) b.acik = true;
            } else {
                var ad = r.a || kisaYol(r.y);
                var d = kartlar[ad] || (kartlar[ad] = { ad: ad, kez: 0, sn: 0, son: 0, acik: false });
                d.kez++; d.sn += sn;
                if (r.t > d.son) d.son = r.t;
                if (r.acik) d.acik = true;
            }
        }
        var kitapListe = Object.keys(kitaplar).map(function (k) { return kitaplar[k]; });
        kitapListe.sort(function (a, b) { return b.son - a.son; });
        var kartListe = Object.keys(kartlar).map(function (k) { return kartlar[k]; });
        kartListe.sort(function (a, b) { return (b.sn - a.sn) || (b.son - a.son); });

        var enYeniKitap = kitapListe[0];
        document.getElementById('mrp-ozet').innerHTML =
            '<div class="mrp-kutu mrp-kutu-kitap"><b>' + (enYeniKitap && enYeniKitap.sf ? kac(sayfaYazi(enYeniKitap.sf)) : '—') +
            '</b><span>KALINAN SAYFA</span></div>' +
            '<div class="mrp-kutu"><b>' + kartListe.length + '</b><span>KART</span></div>' +
            '<div class="mrp-kutu"><b>' + sure(toplamSn) + '</b><span>TOPLAM</span></div>';

        var kap = document.getElementById('mrp-liste');
        if (!kitapListe.length && !kartListe.length) {
            kap.innerHTML = '<div class="mrp-yok">Bu sınıfta henüz ders kitabı ya da etkinlik kartı açılmamış.<br>' +
                '<b>Materyaller</b> sekmesinden ders kitabını ya da bir oyun / etkinlik kartını açtığında ' +
                'burada kitapta kalınan sayfa, kullanılan kartlar ve süreleri görünür.</div>';
            return;
        }
        var h = '<div class="mrp-bol">Ders kitabı</div>';
        if (!kitapListe.length) {
            h += '<div class="mrp-yok-kucuk">Bu sınıfta ders kitabı henüz Materyaller sekmesinden açılmamış.</div>';
        }
        for (i = 0; i < kitapListe.length; i++) {
            var kb = kitapListe[i];
            var acilir = kitapMi(kb.y);
            h += '<div class="mrp-kitap">' +
                '<div class="mrp-kitap-ust">' + kitapSvg() + '<span>' + kac(kb.ad) + '</span>' +
                (kb.acik ? '<span class="mrp-acik">ŞU AN AÇIK</span>' : '') + '</div>' +
                '<div class="mrp-kitap-sayfa"><small>Kalınan sayfa</small>' +
                (kb.sf ? '<b>' + kac(sayfaYazi(kb.sf)) + '</b>'
                       : '<b class="yok">' + (acilir ? 'henüz kaydedilmedi' : 'bu kitapta izlenemiyor') + '</b>') +
                '</div>' +
                '<div class="mrp-alt">son açılış: ' + kac(gunAd(kb.son)) + ' · ' + kb.kez + ' kez · ' + sure(kb.sn) + '</div>' +
                (acilir ? '<button type="button" class="mrp-kitap-ac" data-yol="' + kac(kb.y) + '">' +
                    (kb.sf ? 'Kaldığı yerden aç (' + kac(sayfaYazi(kb.sf)) + ') ›' : 'Kitabı aç ›') + '</button>' : '') +
                '</div>';
        }
        h += '<div class="mrp-bol">Oyun ve etkinlik kartları · çok kullanılandan aza</div>';
        if (!kartListe.length) {
            h += '<div class="mrp-yok-kucuk">Bu sınıfta henüz bir oyun ya da etkinlik kartı açılmamış.</div>';
        } else {
            var enUzun = kartListe[0].sn || 1;
            for (i = 0; i < kartListe.length; i++) {
                var d2 = kartListe[i];
                h += '<div class="mrp-sat">' +
                    '<span class="mrp-sira">' + (i + 1) + '</span>' +
                    '<span class="mrp-ic"><span class="mrp-ad">' + kac(d2.ad) +
                    (d2.acik ? '<span class="mrp-acik">ŞU AN AÇIK</span>' : '') + '</span>' +
                    '<span class="mrp-alt">son: ' + kac(gunAd(d2.son)) + '</span>' +
                    '<span class="mrp-cubuk"><i style="width:' +
                    Math.max(4, Math.round(d2.sn / enUzun * 100)) + '%"></i></span></span>' +
                    '<span class="mrp-sag"><span class="mrp-sure">' + sure(d2.sn) + '</span><br>' +
                    '<span class="mrp-kez">' + d2.kez + ' kez</span></span>' +
                    '</div>';
            }
        }
        var gk = Object.keys(gunler).sort().slice(-10).reverse();
        if (gk.length) {
            var enb = 1;
            gk.forEach(function (g) { if (gunler[g] > enb) enb = gunler[g]; });
            h += '<div class="mrp-bol">Son günler</div>';
            gk.forEach(function (g) {
                var p = g.split('-');
                h += '<div class="mrp-gun"><b>' + p[2] + '.' + p[1] + '.' + p[0] + '</b>' +
                    '<em><i style="width:' + Math.max(5, Math.round(gunler[g] / enb * 100)) + '%"></i></em>' +
                    '<span>' + sure(gunler[g]) + '</span></div>';
            });
        }
        kap.innerHTML = h;
    }

    /* Sınıf listesindeki ok (listelerim.js çizer, biçimi buradan gelir). */
    function okSvg() {
        return '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" ' +
            'stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }

    /* ---- SOL KENARDAKİ DİKEY DİL -------------------------------- */
    var dilL = '', dilC = '';

    function dilKur() {
        if (document.getElementById('mrp-dil')) return;
        stil();
        var b = document.createElement('button');
        b.id = 'mrp-dil';
        b.type = 'button';
        b.title = 'Nerde Kalmıştık? — ders kitabında kalınan sayfa, kullanılan oyun ve etkinlik kartları';
        b.setAttribute('aria-label', 'Nerde Kalmıştık?');
        b.innerHTML = '<span class="mrp-dil-yaz">NERDE KALMIŞTIK?</span>'
            + '<svg class="mrp-dil-ok" viewBox="0 0 24 24" aria-hidden="true">'
            + '<path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6"'
            + ' stroke-linecap="round" stroke-linejoin="round"/></svg>';
        b.onclick = function () { ac(dilL, dilC); };
        document.body.appendChild(b);
    }

    /* Hangi sınıfın raporu? listelerim.js sınıf seçtikçe bildirir. */
    function sinifSec(lId, cId) {
        dilL = lId || ''; dilC = cId || '';
        dilKur();
        dilYokla();
        /* başka cihazda kalınan sayfa da bilinsin: kitap tıklanmadan önce
           bulut kayıtları bir kez okunur (oturumda bir okuma) */
        bulutuOku();
    }

    /* Dil yalnız Listelerim açıkken ve bir sınıf seçiliyken görünür. */
    function dilYokla() {
        var b = document.getElementById('mrp-dil');
        if (!b) return;
        var bol = document.getElementById('listelerim-section');
        var acik = !!(bol && getComputedStyle(bol).display !== 'none' && dilL && dilC);
        b.classList.toggle('mrp-gor', acik);
    }
    setInterval(dilYokla, 900);

    kayit = yerelOku();
    stil();
    window.KidefMateryalRapor = {
        ac: ac, kapat: kapat, okSvg: okSvg, sinifSec: sinifSec,
        kayitlar: function () { return kayit.slice(); },
        /* kitapta bu sınıfın kaldığı sayfa: KidefMateryalRapor.sonSayfa('lId|cId', 'kitap/8-sinif-2026-2027/') */
        sonSayfa: sonSayfa
    };
})();
