/* =====================================================================
   KİDEF · MATERYAL KULLANIM RAPORU        (sistem/materyalrapor.js)
   ---------------------------------------------------------------------
   Öğretmen (12.10.2026): "o sınıf listesindeki materyal kısmında hangi
   dosyaları açtığımı ne kadar süre işlediğimi gösteren bi rapor eklemek
   istiyorum, dikey bir popup şeklinde bakabileyim ... sınıf listesinde
   sol tarafta bi ok svg sine basınca çıksın."

   NE YAPAR
   1) ÖLÇÜM — Sınıf panelinin "Materyaller" sekmesinde (#llMateryalKap)
      bir dosyaya tıklandığında: dosya betikle açılır, pencere tutamacı
      saklanır ve sekme kapanana kadar geçen süre ölçülür. Kayıt o anda
      açık olan SINIFA yazılır.
   2) RAPOR — Sınıf listesindeki okа basınca sağdan dikey bir pano açılır:
      o sınıfta açılan dosyalar, kaç kez açıldığı, toplam süre ve son
      açılış. Üstte gün gün özet.

   SÜRE NE ÖLÇÜYOR (öğretmenin seçimi)
   "Sekmenin AÇIK KALDIĞI süre". Açılan sayfalara (flipbook, sunum, PDF)
   hiçbir şey eklenmedi; ölçüm tamamen bu sayfadan yapılıyor. Dolayısıyla
   sekme arka planda unutulursa süre şişer — panoda bu not yazılı.
   Daha doğrusu istenirse o sayfalara küçük bir ölçüm betiği eklenir.

   MALİYET
   Kayıtlar önce tarayıcıda (localStorage) durur. Buluta yalnız DEĞİŞİKLİK
   olunca ve en sık 90 sn'de bir, tek belgeye yazılır:
       kullanicilar/{uid}.materyalKayit = [ {s,sa,y,a,t,sn}, ... ]   (son 500)
   Bir ders boyunca birkaç dosya açılır; günde birkaç yazma eder. Öğretmen
   kullanım süresi ölçeri (sistem/kullanimsure.js) ayrı belgede, ona
   dokunulmadı.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefMateryalRapor) return;

    var ANAHTAR = 'kidefMateryalKayit';
    var EN_COK = 500;          /* tarayıcıda ve bulutta tutulan kayıt sayısı */
    var ESIK_SN = 4;           /* bundan kısa açılışlar yanlışlıkla sayılmasın */
    var YAZ_ARALIK_SN = 90;    /* buluta en sık bu kadarda bir */
    var YOKLA_MS = 4000;       /* açık sekme kapandı mı diye bakma sıklığı */
    var EN_COK_TEK_SN = 6 * 3600;   /* tek açılışta en çok 6 saat sayılsın */

    var kayit = [];            /* {s:'lId|cId', sa:'sınıf adı', y:yol, a:ad, t:ms, sn:saniye} */
    var kirli = false, sonYazim = 0, bulutOkundu = false;

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

    /* Dosya adı: önce bağlantının yazısı, olmazsa dosya adı. */
    function baglantiAdi(a) {
        var t = (a.getAttribute('title') || '').trim();
        var y = (a.textContent || '').replace(/\s+/g, ' ').trim();
        var ad = y || t;
        if (ad.length > 90) ad = ad.slice(0, 88) + '…';
        if (ad) return ad;
        var p = (a.getAttribute('href') || '').split('?')[0].split('/').pop();
        try { p = decodeURIComponent(p); } catch (e) { }
        return p || 'dosya';
    }
    function kisaYol(y) {
        var s = String(y || '').split('?')[0];
        try { s = decodeURIComponent(s); } catch (e) { }
        return s.replace(/^.*?\/\/[^/]+\//, '');
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
        if (!dis || !dis.length) return;
        var var_ = {}, i;
        for (i = 0; i < kayit.length; i++) var_[kimlik(kayit[i])] = 1;
        for (i = 0; i < dis.length; i++) {
            var r = dis[i];
            if (!r || !r.t || !r.y) continue;
            if (!var_[kimlik(r)]) { kayit.push(r); var_[kimlik(r)] = 1; }
        }
        kayit.sort(function (a, b) { return a.t - b.t; });
        if (kayit.length > EN_COK) kayit = kayit.slice(-EN_COK);
        yerelYaz();
    }

    /* Bulutu bir kez oku (oturum açılınca), sonra değiştikçe yaz. */
    function bulutuOku() {
        if (bulutOkundu) return;
        var u = kullanici(), D = dbAl();
        if (!u || !D) return;
        bulutOkundu = true;
        D.collection('kullanicilar').doc(u.uid).get().then(function (s) {
            var d = s && s.exists ? s.data() : null;
            if (d && Array.isArray(d.materyalKayit)) birlestir(d.materyalKayit);
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
    function aktifSinif() {
        try {
            var a = (typeof window.llAktifSinif === 'function') ? window.llAktifSinif() : null;
            if (!a || !a.lId) return null;
            var d = (typeof data !== 'undefined' && data) ? data : (window.data || null);
            var lvl = d && d.levels ? d.levels[a.lId] : null;
            var sf = (lvl && lvl.classes && a.cId) ? lvl.classes[a.cId] : null;
            return {
                anahtar: a.lId + '|' + a.cId,
                ad: (sf && sf.name) || (lvl && lvl.name) || ''
            };
        } catch (e) { return null; }
    }

    var acikList = [];   /* {win, r} */

    function izlemeyeAl(w, r) {
        if (!w) return;
        acikList.push({ w: w, r: r, bas: Date.now() });
    }
    setInterval(function () {
        if (!acikList.length) return;
        var kalan = [], i, o, gecen;
        for (i = 0; i < acikList.length; i++) {
            o = acikList[i];
            var kapandi = true;
            try { kapandi = !!o.w.closed; } catch (e) { kapandi = false; }
            gecen = Math.round((Date.now() - o.bas) / 1000);
            if (!kapandi && gecen < EN_COK_TEK_SN) { kalan.push(o); continue; }
            gecen = Math.min(gecen, EN_COK_TEK_SN);
            if (gecen >= ESIK_SN) { o.r.sn = gecen; kayit.push(o.r); kirli = true; yerelYaz(); }
        }
        acikList = kalan;
        bulutaYaz(false);
    }, YOKLA_MS);

    function kapanisaYaz() {
        var i, gecen, degisti = false;
        for (i = 0; i < acikList.length; i++) {
            gecen = Math.min(Math.round((Date.now() - acikList[i].bas) / 1000), EN_COK_TEK_SN);
            if (gecen >= ESIK_SN) { acikList[i].r.sn = gecen; kayit.push(acikList[i].r); degisti = true; }
        }
        acikList = [];
        if (degisti) { kirli = true; yerelYaz(); }
        bulutaYaz(true);
    }
    window.addEventListener('pagehide', kapanisaYaz);
    window.addEventListener('beforeunload', kapanisaYaz);

    /* Materyaller sekmesindeki dosya bağlantıları: betikle açılır ki
       sekmenin ne zaman kapandığı görülebilsin. Yalnız #llMateryalKap
       içi dinlenir — sitenin geri kalanına dokunulmaz. */
    document.addEventListener('click', function (e) {
        var kap = document.getElementById('llMateryalKap');
        if (!kap) return;
        var a = (e.target && e.target.closest) ? e.target.closest('a[href]') : null;
        if (!a || !kap.contains(a)) return;
        var href = a.getAttribute('href') || '';
        if (!href || href.charAt(0) === '#' || /^(javascript|mailto|tel):/i.test(href)) return;
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;

        var s = aktifSinif();
        var r = {
            s: s ? s.anahtar : '', sa: s ? s.ad : '',
            y: kisaYol(a.href), a: baglantiAdi(a), t: Date.now(), sn: 0
        };
        var w = null;
        try { w = window.open(a.href, '_blank'); } catch (x) { w = null; }
        if (w) { e.preventDefault(); izlemeyeAl(w, r); }
        else { r.sn = 0; }        /* engellendiyse tarayıcı kendi açsın, süre ölçülmez */
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
            '.mrp-gun{ display:flex; align-items:center; gap:9px; font-size:.78rem; color:#55606C;',
            '  padding:4px 2px; }',
            '.mrp-gun b{ flex:0 0 78px; font-weight:600; color:#7b8a99; }',
            '.mrp-gun em{ flex:1 1 auto; min-width:0; height:9px; border-radius:5px;',
            '  background:#EDF2F6; overflow:hidden; display:block; }',
            '.mrp-gun em i{ display:block; height:100%; border-radius:5px;',
            '  background:linear-gradient(90deg,#16A085,#7ed3bb); }',
            '.mrp-gun span{ flex:0 0 auto; white-space:nowrap; font-weight:700; color:#55606C; }',
            '.mrp-yok{ padding:34px 18px; text-align:center; color:#8A93A0; font-size:.92rem; line-height:1.65; }',
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
            /* Sınıf başlığının yanındaki RAPOR tuşu — sınıf açıkken hep görünür. */
            '.ll-rapor-tus{ display:inline-flex !important; align-items:center; gap:6px;',
            '  margin-inline-start:8px; padding:6px 13px; border:0; cursor:pointer;',
            '  border-radius:999px; background:#16A085; color:#fff; font-family:inherit;',
            '  font-weight:700; font-size:.86rem; line-height:1; white-space:nowrap;',
            '  box-shadow:0 3px 10px rgba(22,160,133,.30); flex:0 0 auto; }',
            '.ll-rapor-tus:hover{ background:#0E7A66; }',
            '.ll-rapor-tus svg{ width:16px; height:16px; display:block; }',
            '@media (max-width: 700px){ .ll-rapor-tus span{ display:none; }',
            '  .ll-rapor-tus{ padding:7px; } }'
        ].join('\n');
        document.head.appendChild(s);
    }

    function panoKur() {
        if (document.getElementById('mrp-ort')) return;
        stil();
        var o = document.createElement('div');
        o.id = 'mrp-ort';
        o.innerHTML =
            '<div id="mrp-pano" role="dialog" aria-modal="true" aria-label="Materyal kullanım raporu">' +
            '<div id="mrp-bas"><div><h3 id="mrp-ad">Materyal raporu</h3>' +
            '<small id="mrp-alt">hangi dosyayı ne kadar açtım</small></div>' +
            '<button id="mrp-kapat" title="Kapat" aria-label="Kapat">&times;</button></div>' +
            '<div id="mrp-ozet"></div><div id="mrp-liste"></div>' +
            '<div id="mrp-not">Süre, dosyanın açıldığı sekmenin <b>açık kaldığı</b> süredir; ' +
            'sekme arka planda unutulursa olduğundan uzun görünür. Ölçüm 12.10.2026\'da başladı.</div></div>';
        document.body.appendChild(o);
        o.addEventListener('click', function (e) { if (e.target === o) kapat(); });
        document.getElementById('mrp-kapat').onclick = kapat;
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && o.classList.contains('acik')) kapat();
        });
    }

    function kapat() {
        var o = document.getElementById('mrp-ort');
        if (o) o.classList.remove('acik');
    }

    function ac(lId, cId) {
        panoKur();
        kayit = yerelOku();
        bulutuOku();
        var anahtar = (lId && cId) ? (lId + '|' + cId) : (aktifSinif() || {}).anahtar || '';
        var sinifAd = '';
        try {
            var d = (typeof data !== 'undefined' && data) ? data : (window.data || null);
            var lvl = d && d.levels ? d.levels[lId] : null;
            var sf = lvl && lvl.classes ? lvl.classes[cId] : null;
            sinifAd = (sf && sf.name) || (lvl && lvl.name) || '';
        } catch (e) { }

        var ben = kayit.filter(function (r) { return r && r.s === anahtar; });
        /* Sınıf adı listeden okunamadıysa kaydın kendi içindekini kullan. */
        if (!sinifAd) { for (var z = ben.length - 1; z >= 0; z--) if (ben[z].sa) { sinifAd = ben[z].sa; break; } }
        document.getElementById('mrp-ad').textContent =
            (sinifAd ? sinifAd + ' · ' : '') + 'Materyal raporu';
        document.getElementById('mrp-alt').textContent =
            'hangi dosyayı kaç kez açtım, ne kadar işledim';

        /* --- özet --- */
        var toplamSn = 0, gunler = {}, i, r;
        var dosya = {};
        for (i = 0; i < ben.length; i++) {
            r = ben[i];
            toplamSn += (r.sn || 0);
            var g = gunKod(r.t);
            gunler[g] = (gunler[g] || 0) + (r.sn || 0);
            var k = r.y;
            if (!dosya[k]) dosya[k] = { ad: r.a, y: r.y, kez: 0, sn: 0, son: 0 };
            dosya[k].kez++; dosya[k].sn += (r.sn || 0);
            if (r.t > dosya[k].son) { dosya[k].son = r.t; dosya[k].ad = r.a; }
        }
        var liste = Object.keys(dosya).map(function (k) { return dosya[k]; });
        liste.sort(function (a, b) { return b.sn - a.sn; });

        document.getElementById('mrp-ozet').innerHTML =
            '<div class="mrp-kutu"><b>' + liste.length + '</b><span>DOSYA</span></div>' +
            '<div class="mrp-kutu"><b>' + ben.length + '</b><span>AÇILIŞ</span></div>' +
            '<div class="mrp-kutu"><b>' + sure(toplamSn) + '</b><span>TOPLAM</span></div>';

        var kap = document.getElementById('mrp-liste');
        if (!liste.length) {
            kap.innerHTML = '<div class="mrp-yok">Bu sınıfta henüz bir materyal açılmamış.<br>' +
                '<b>Materyaller</b> sekmesinden bir belge ya da etkinlik açtığında ' +
                'burada kaç kez açtığın ve ne kadar işlediğin görünür.</div>';
        } else {
            var enUzun = liste[0].sn || 1, h = '';
            h += '<div class="mrp-bol">Dosyalar · çok işlenenden aza</div>';
            for (i = 0; i < liste.length; i++) {
                var d2 = liste[i];
                h += '<div class="mrp-sat">' +
                    '<span class="mrp-sira">' + (i + 1) + '</span>' +
                    '<span class="mrp-ic"><span class="mrp-ad">' + kac(d2.ad) + '</span>' +
                    '<span class="mrp-alt">son: ' + kac(gunAd(d2.son)) + '</span>' +
                    '<span class="mrp-cubuk"><i style="width:' +
                    Math.max(4, Math.round(d2.sn / enUzun * 100)) + '%"></i></span></span>' +
                    '<span class="mrp-sag"><span class="mrp-sure">' + sure(d2.sn) + '</span><br>' +
                    '<span class="mrp-kez">' + d2.kez + ' kez</span></span>' +
                    '</div>';
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
        kap.scrollTop = 0;
        requestAnimationFrame(function () {
            document.getElementById('mrp-ort').classList.add('acik');
        });
    }

    /* Sınıf listesindeki ok (listelerim.js çizer, biçimi buradan gelir). */
    function okSvg() {
        return '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" ' +
            'stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }

    kayit = yerelOku();
    stil();
    window.KidefMateryalRapor = { ac: ac, kapat: kapat, okSvg: okSvg, kayitlar: function () { return kayit.slice(); } };
})();
