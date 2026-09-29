/* ==========================================================================
   MERAK ÇARKI — ders başı ısınma çarkı        merak/merakcarki.js
   --------------------------------------------------------------------------
   NE YAPAR
   Öğretmen çarkı çevirir, dört türden biri çıkar (Fıkra · Kısa Hikâye türü
   anlatı · Kelime Kökeni · Kültür & Bilim · Bulmaca), o türden bir kart
   açılır. Kartın "cevap" kısmı gizlidir; sınıf tahmin ettikten sonra açılır.

   TEKRAR ETMEME  (öğretmen isteği)
   Hangi sınıfa hangi kartın çıktığı KAYIT ALTINA ALINIR; aynı sınıfa aynı
   kart bir daha çıkmaz. Her türde 36 kart var, öğretim yılı 36 hafta —
   yani bir sınıf her hafta aynı türü çekse bile yıl boyunca tekrar olmaz.

   NEREYE YAZILIR
     · Öğretmen girişi varsa: kullanicilar/{uid} belgesinde "merakCarki"
       alanına (JSON metni). BU KOLEKSİYON ZATEN KURALLARDA İZİNLİ —
       "kendi belgesini güncelleyebilir" — yeni kural yayınlamak gerekmez.
     · Her hâlükârda localStorage'a da yazılır: çevrimdışı da çalışır,
       giriş yoksa da çalışır (o zaman tek bir "genel" kova kullanılır).
   Sınıf listesi öğretmenin kendi verisinden okunur (localStorage
   'schoolData' → data.levels[lId].classes[cId]); bulut kopyası da
   kullanicilar/{uid}.userData alanından okunur.
   ========================================================================== */
(function () {
    'use strict';

    var CFG = {
        apiKey: "AIzaSyBGIQPJ_Bjm5I3-QmrrGpLR5MqmG3S5F8w",
        authDomain: "kidefarapca-98f9c.firebaseapp.com",
        projectId: "kidefarapca-98f9c",
        storageBucket: "kidefarapca-98f9c.firebasestorage.app",
        messagingSenderId: "503317118211",
        appId: "1:503317118211:web:a9c8cf15b854597e0b3d36"
    };
    var SDK = 'https://www.gstatic.com/firebasejs/8.10.1/';
    var DEPO = 'merakCarkiGecmis';

    /* Tür renkleri SİTENİN KENDİ RENKLERİ (29.09.2026): turuncu ve yeşil
       sinifici/sinav.css'ten, mavi ve mor katalogdaki bölüm renklerinden.
       Yeni palet eklenmedi; kartın üst çizgisi, rozeti ve çark dilimi bu
       renkten çiziliyor. */
    var TUR = [
        { id: 'fikra',   ad: 'Fıkra',          kisa: 'Fıkra',   renk: '#E67E22', ikon: '😄' },
        { id: 'koken',   ad: 'Kelime Kökeni',  kisa: 'Köken',   renk: '#16A085', ikon: '🌿' },
        { id: 'kultur',  ad: 'Kültür & Bilim', kisa: 'Kültür',  renk: '#2E86DE', ikon: '🌍' },
        { id: 'bulmaca', ad: 'Gizemli Bulmaca', kisa: 'Bulmaca', renk: '#8E44AD', ikon: '🔍' }
    ];

    var MC = window.MerakCarki = {};
    var db = null, user = null;
    var sinifOgeleri = [];          /* [{anahtar, ad}] */
    var gecmis = {};                /* anahtar -> [kartId] */
    var seciliSinif = 'genel';
    var seciliTur = '';             /* '' = çark seçsin */
    var sonKart = null, sonTur = '';
    var aci = 0, donuyor = false;

    function $(s) { return document.querySelector(s); }
    function kac(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function veri() { return (window.MERAK_VERI || {}); }
    function turBul(id) { for (var i = 0; i < TUR.length; i++) if (TUR[i].id === id) return TUR[i]; return TUR[0]; }

    /* ==================================================== 1) KAYIT */
    function yerelYukle() {
        try {
            var d = JSON.parse(localStorage.getItem(DEPO) || 'null');
            if (d && typeof d === 'object') gecmis = d;
        } catch (e) { }
    }
    function yerelYaz() {
        try { localStorage.setItem(DEPO, JSON.stringify(gecmis)); } catch (e) { }
    }
    /* Buluta yaz: yalnız kendi belgesinin "merakCarki" alanına dokunur,
       role ve öteki alanlar olduğu gibi kalır ({merge:true}). */
    function bulutaYaz() {
        if (!db || !user) return;
        try {
            db.collection('kullanicilar').doc(user.uid).set({
                merakCarki: JSON.stringify(gecmis)
            }, { merge: true }).catch(function (e) {
                console.warn('merakcarki bulut yazma:', e && (e.code || e.message));
            });
        } catch (e) { }
    }
    function kaydet() { yerelYaz(); bulutaYaz(); }

    function cikanlar(anahtar) { return gecmis[anahtar] || (gecmis[anahtar] = []); }

    /* ==================================================== 2) SINIF LİSTESİ */
    function sinifAgaci(ham) {
        var l = [];
        try {
            var d = (typeof ham === 'string') ? JSON.parse(ham) : ham;
            if (!d || !d.levels) return l;
            Object.keys(d.levels).forEach(function (lId) {
                var lv = d.levels[lId] || {}, cls = lv.classes || {};
                Object.keys(cls).forEach(function (cId) {
                    l.push({
                        anahtar: lId + '/' + cId,
                        ad: (lv.name ? lv.name + ' · ' : '') + (cls[cId].name || cId)
                    });
                });
            });
        } catch (e) { }
        return l;
    }
    function sinifYerelden() {
        try { return sinifAgaci(localStorage.getItem('schoolData')); } catch (e) { return []; }
    }
    function sinifSeciciCiz() {
        var kutu = $('#mcSinifKutu'), sec = $('#mcSinif');
        if (!kutu || !sec) return;
        if (!sinifOgeleri.length) {
            kutu.hidden = true;
            seciliSinif = 'genel';
            durumYaz();
            return;
        }
        kutu.hidden = false;
        sec.innerHTML = sinifOgeleri.map(function (s) {
            return '<option value="' + kac(s.anahtar) + '">' + kac(s.ad) + '</option>';
        }).join('');
        var son = '';
        try { son = localStorage.getItem('merakCarkiSonSinif') || ''; } catch (e) { }
        var varMi = sinifOgeleri.some(function (s) { return s.anahtar === son; });
        seciliSinif = varMi ? son : sinifOgeleri[0].anahtar;
        sec.value = seciliSinif;
        durumYaz();
    }


    /* ==================================================== 1b) SİMGELER
       Dört türün animasyonlu SVG'si. Emoji yerine bunlar kullanılıyor:
       emoji cihazdan cihaza değişiyor, tahtada soluk kalıyor, kıpırdamıyor.
       Hepsi 24x24 kutuda, rengini currentColor'dan alıyor, id/gradient
       içermiyor (aynı simge sayfada defalarca geçiyor). Animasyonlar
       merakcarki.css'te; azaltılmış hareket ayarında kendiliğinden duruyor. */
    var MC_SIMGE = {
        /* gülen yüz — kahkahayla sallanır, gözler kırpar */
        fikra:
            '<g class="mcs-yuz">' +
            '<circle cx="12" cy="12" r="9.3" fill="currentColor"/>' +
            '<ellipse class="mcs-goz" cx="8.7" cy="9.7" rx="1.3" ry="1.75" fill="#fff"/>' +
            '<ellipse class="mcs-goz mcs-goz2" cx="15.3" cy="9.7" rx="1.3" ry="1.75" fill="#fff"/>' +
            '<path d="M6.5 13.5h11a5.5 5.5 0 0 1-11 0Z" fill="#fff"/>' +
            '<path class="mcs-dil" d="M10 18.3a5.5 5.5 0 0 0 4 0 2 2 0 0 0-4 0Z" fill="currentColor"/>' +
            '</g>',
        /* filiz — yapraklar salınır, sap hafif esner */
        koken:
            '<path d="M12 22.2V12.6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" fill="none"/>' +
            '<path class="mcs-yaprak mcs-yaprak-a" d="M11.5 14.6C11.5 9.8 8.2 6.3 3.2 5.9c-.4 5 2.9 8.7 8.3 8.7Z" fill="currentColor"/>' +
            '<path class="mcs-yaprak mcs-yaprak-b" d="M12.5 12.1c0-4.8 3.3-8.3 8.3-8.7.4 5-2.9 8.7-8.3 8.7Z" fill="currentColor" opacity=".72"/>' +
            '<circle class="mcs-tohum" cx="12" cy="20.8" r="1.6" fill="currentColor" opacity=".45"/>',
        /* küre — boylam daralıp genişler: dönüyormuş gibi */
        kultur:
            '<circle cx="12" cy="12" r="9.3" fill="currentColor"/>' +
            '<g fill="none" stroke="#fff" stroke-width="1.5" vector-effect="non-scaling-stroke">' +
            '<path d="M2.7 12h18.6"/><path d="M4.4 7.2h15.2"/><path d="M4.4 16.8h15.2"/>' +
            '<ellipse class="mcs-boylam" cx="12" cy="12" rx="4.4" ry="9.3"/>' +
            '</g>' +
            '<circle cx="12" cy="12" r="9.3" fill="none" stroke="#fff" stroke-width="1.5"/>',
        /* büyüteç — arar gibi gezinir, soru işareti nefes alır */
        bulmaca:
            '<g class="mcs-buyutec">' +
            '<path d="M15.6 15.6 20.8 20.8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" fill="none"/>' +
            '<circle cx="10.4" cy="10.4" r="6.6" fill="#fff" stroke="currentColor" stroke-width="2.2"/>' +
            '<text class="mcs-soru" x="10.4" y="13.9" text-anchor="middle" fill="currentColor">?</text>' +
            '<path class="mcs-parilti" d="M6.9 8.2a4.2 4.2 0 0 1 2.7-2.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none" opacity=".55"/>' +
            '</g>'
    };

    /* HTML içine giren simge (düğme, rozet, sayaç). */
    function simge(turId, ek) {
        var i = MC_SIMGE[turId];
        if (!i) return '';
        return '<svg class="mcs' + (ek ? ' ' + ek : '') + '" viewBox="0 0 24 24" ' +
            'aria-hidden="true" focusable="false">' + i + '</svg>';
    }
    /* Çarkın SVG'si içine giren simge. İÇ İÇE <svg> KULLANILMIYOR: .mcs'in
       CSS width/height'i sunum özniteliklerini eziyor ve em dış SVG'nin
       kullanıcı biriminde çözülünce simge devasa çıkıyordu. Onun yerine
       24x24'lük çizim ölçeklenip yerine taşınıyor; CSS'in boyutla işi yok.
       renk: dilim zemini koyu olduğu için beyaz. */
    function simgeIc(turId, x, y, boy) {
        var i = MC_SIMGE[turId];
        if (!i) return '';
        var o = (boy / 24).toFixed(4), t = turBul(turId);
        /* --d: simgenin AYRINTI rengi. Çizimin gövdesi beyaz (currentColor),
           normalde beyaz olan ayrıntılar dilimin rengine dönüyor; yoksa
           renkli dilim üstünde beyaz beyaza binip leke gibi duruyor. */
        return '<g class="mcs-ic" style="--d:' + (t ? t.renk : '#16324F') + '" ' +
            'transform="translate(' + x + ',' + y + ') scale(' + o + ')">' + i + '</g>';
    }
    /* Başlıktaki mini çark: ağır ağır döner, dört tür renginde. */
    function simgeCark() {
        var r = TUR.map(function (t) { return t.renk; });
        return '<svg class="mcs-mini" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
            '<g class="mcs-mini-don">' +
            '<path d="M12 12V2.6A9.4 9.4 0 0 1 21.4 12Z" fill="' + r[0] + '"/>' +
            '<path d="M12 12h9.4A9.4 9.4 0 0 1 12 21.4Z" fill="' + r[1] + '"/>' +
            '<path d="M12 12v9.4A9.4 9.4 0 0 1 2.6 12Z" fill="' + r[2] + '"/>' +
            '<path d="M12 12H2.6A9.4 9.4 0 0 1 12 2.6Z" fill="' + r[3] + '"/>' +
            '<circle cx="12" cy="12" r="9.4" fill="none" stroke="#fff" stroke-width="1.6"/>' +
            '</g>' +
            '<circle cx="12" cy="12" r="2.7" fill="#fff"/>' +
            '<path d="M12 4.6 9.6 0h4.8Z" fill="#F1C40F"/></svg>';
    }
    /* ÇARKI ÇEVİR düğmesindeki dönen ok. */
    function simgeDon() {
        return '<svg class="mcs mcs-ok" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
            '<g class="mcs-ok-don" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">' +
            '<path d="M20.4 12a8.4 8.4 0 1 1-2.9-6.4"/>' +
            '<path d="M20.6 3.4v5.1h-5.1"/></g></svg>';
    }

    /* ==================================================== 3) DURUM SATIRI */
    function toplamKart() {
        var n = 0; TUR.forEach(function (t) { n += (veri()[t.id] || []).length; }); return n;
    }
    function durumYaz() {
        var e = $('#mcDurum'); if (!e) return;
        var c = cikanlar(seciliSinif), top = toplamKart();
        var ad = 'bu tarayıcı';
        for (var i = 0; i < sinifOgeleri.length; i++) if (sinifOgeleri[i].anahtar === seciliSinif) ad = sinifOgeleri[i].ad;
        var parca = TUR.map(function (t) {
            var tum = (veri()[t.id] || []).length;
            var kalan = tum - c.filter(function (id) { return (veri()[t.id] || []).some(function (k) { return k.id === id; }); }).length;
            return '<span class="mc-kalan" style="--r:' + t.renk + '">' + simge(t.id) +
                t.kisa + ' <b>' + kalan + '</b></span>';
        }).join('');
        e.innerHTML = '<span class="mc-durum-ad">' + kac(ad) + '</span>' +
            '<span class="mc-durum-say">' + c.length + ' / ' + top + ' kart çıktı</span>' +
            '<span class="mc-kalanlar">' + parca + '</span>';
    }

    /* ==================================================== 4) ÇARK */
    function carkCiz() {
        var g = $('#mcDilimler'); if (!g) return;
        var n = TUR.length, dilim = 360 / n, html = '';
        for (var i = 0; i < n; i++) {
            var b = i * dilim - 90, s = b + dilim;
            var x1 = 100 + 96 * Math.cos(b * Math.PI / 180), y1 = 100 + 96 * Math.sin(b * Math.PI / 180);
            var x2 = 100 + 96 * Math.cos(s * Math.PI / 180), y2 = 100 + 96 * Math.sin(s * Math.PI / 180);
            html += '<path d="M100 100 L' + x1.toFixed(2) + ' ' + y1.toFixed(2) +
                ' A96 96 0 0 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2) + ' Z" fill="' + TUR[i].renk +
                '" stroke="#fff" stroke-width="2"/>';
            /* dilim yazısı: dilimin ortasına, dışa doğru */
            var o = b + dilim / 2;
            var tx = 100 + 62 * Math.cos(o * Math.PI / 180), ty = 100 + 62 * Math.sin(o * Math.PI / 180);
            /* Yazılar DÖNDÜRÜLMÜYOR: dilime göre çevirince alttakiler baş
               aşağı okunuyordu. Düz duruyorlar, dört dilimde de rahat okunur. */
            html += '<g transform="translate(' + tx.toFixed(2) + ',' + ty.toFixed(2) + ')">' +
                simgeIc(TUR[i].id, -11, -27, 22) +
                '<text class="mc-dilim-ad" text-anchor="middle" y="14">' + kac(TUR[i].kisa) + '</text></g>';
        }
        g.innerHTML = html;
    }

    /* Verilen türden, bu sınıfa HİÇ ÇIKMAMIŞ kartlardan rastgele biri. */
    function kartSec(turId) {
        var liste = veri()[turId] || [], c = cikanlar(seciliSinif);
        var aday = liste.filter(function (k) { return c.indexOf(k.id) < 0; });
        if (!aday.length) return null;
        return aday[Math.floor(Math.random() * aday.length)];
    }
    /* Kartı olan türler (hepsi bitmişse çark boşa dönmesin). */
    function doluTurler() {
        return TUR.filter(function (t) { return kartSec(t.id) !== null; });
    }

    MC.cevir = function () {
        if (donuyor) return;
        var hedefTur;
        if (seciliTur) {
            hedefTur = turBul(seciliTur);
            if (!kartSec(hedefTur.id)) { bittiUyar(hedefTur); return; }
        } else {
            var d = doluTurler();
            if (!d.length) { bittiUyar(null); return; }
            hedefTur = d[Math.floor(Math.random() * d.length)];
        }
        var i = TUR.indexOf(hedefTur), dilim = 360 / TUR.length;
        /* İbre yukarıda (12 yönü). Dilim i, -90°+i*dilim ile başlıyor;
           ortasının yukarı gelmesi için çarkı şu kadar döndürüyoruz. */
        var hedefAci = -(i * dilim + dilim / 2);
        var tur = 4 + Math.floor(Math.random() * 3);          /* 4-6 tam tur */
        aci = aci - (aci % 360) + tur * 360 + hedefAci;
        donuyor = true;
        var c = $('#mcCark');
        c.style.transition = 'transform 3.4s cubic-bezier(.17,.85,.28,1)';
        c.style.transform = 'rotate(' + aci + 'deg)';
        $('#mcCevir').disabled = true;
        $('#mcKart').hidden = true;
        setTimeout(function () {
            donuyor = false;
            $('#mcCevir').disabled = false;
            kartAc(hedefTur);
        }, 3500);
    };

    function bittiUyar(t) {
        var k = $('#mcKart'); if (!k) return;
        k.hidden = false;
        k.className = 'mc-kart mc-bitti';
        k.innerHTML = '<h2>' + (t ? kac(t.ad) + ' kartlarının hepsi çıktı' : 'Bütün kartlar çıktı') + '</h2>' +
            '<p>Bu sınıfa ' + (t ? 'bu türden ' : '') + 'gösterilmemiş kart kalmadı. ' +
            'Yeni bir yıl başlıyorsa ya da baştan başlamak istiyorsan bu sınıfın geçmişini sıfırlayabilirsin.</p>' +
            '<div class="mc-kart-tuslar">' +
            '<button type="button" class="mc-t-ana" onclick="MerakCarki.sifirla(' +
            (t ? "'" + t.id + "'" : '') + ')">' + (t ? kac(t.ad) + ' geçmişini sıfırla' : 'Bu sınıfın geçmişini sıfırla') + '</button>' +
            '</div>';
    }

    function kartAc(t) {
        var kart = kartSec(t.id);
        if (!kart) { bittiUyar(t); return; }
        sonKart = kart; sonTur = t.id;
        /* ÇIKAN KART İŞARETLENİR: bir daha bu sınıfa çıkmaz. */
        cikanlar(seciliSinif).push(kart.id);
        kaydet(); durumYaz();

        var k = $('#mcKart');
        k.hidden = false;
        k.className = 'mc-kart';
        k.style.setProperty('--r', t.renk);
        k.innerHTML =
            '<div class="mc-kart-ust"><span class="mc-rozet">' + simge(t.id) + kac(t.ad) + '</span>' +
            (kart.ar ? '<span class="mc-ar ar">' + kac(kart.ar) + '</span>' : '') + '</div>' +
            '<h2>' + kac(kart.bas) + '</h2>' +
            '<p class="mc-govde">' + kac(kart.ic) + '</p>' +
            '<div class="mc-cevap" id="mcCevap" hidden><b>Cevap</b><p>' + kac(kart.cevap) + '</p></div>' +
            '<div class="mc-kart-tuslar">' +
            '<button type="button" class="mc-t-ana" id="mcAc" onclick="MerakCarki.cevapAc()">Cevabı Aç</button>' +
            '<button type="button" class="mc-t-yan" onclick="MerakCarki.geriAl()">Bunu sayma</button>' +
            '</div>';
        /* Kart büyük; ekranın tepesine gelsin ki tamamı görünsün. Şerit
           kaydırmadan HEMEN ÖNCE yeniden ölçülüyor: yazı tipi sonradan
           yüklenince ya da giriş notu kalkınca yüksekliği değişiyor. */
        ustOlc();
        try { k.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { }
    }

    MC.cevapAc = function () {
        var c = $('#mcCevap'), t = $('#mcAc');
        if (!c) return;
        c.hidden = false;
        if (t) t.remove();
    };

    /* Yanlışlıkla çevrildiyse: kartı "çıkmadı" say, listeye geri koy. */
    MC.geriAl = function () {
        if (!sonKart) return;
        var c = cikanlar(seciliSinif), i = c.indexOf(sonKart.id);
        if (i >= 0) c.splice(i, 1);
        kaydet(); durumYaz();
        $('#mcKart').hidden = true;
        sonKart = null;
    };

    MC.sifirla = function (turId) {
        var c = cikanlar(seciliSinif);
        if (turId) {
            var liste = veri()[turId] || [];
            gecmis[seciliSinif] = c.filter(function (id) {
                return !liste.some(function (k) { return k.id === id; });
            });
        } else {
            gecmis[seciliSinif] = [];
        }
        kaydet(); durumYaz();
        $('#mcKart').hidden = true;
    };

    MC.turSec = function (id) {
        seciliTur = (seciliTur === id) ? '' : id;
        document.querySelectorAll('[data-mc-tur]').forEach(function (b) {
            var s = b.getAttribute('data-mc-tur') === seciliTur;
            b.classList.toggle('acik', s);
            b.setAttribute('aria-pressed', s ? 'true' : 'false');
        });
        var n = $('#mcTurNot');
        if (n) n.textContent = seciliTur
            ? turBul(seciliTur).ad + ' seçili — çark hep bu dilimde duracak.'
            : 'Tür seçmedin: çark rastgele bir türde duracak.';
    };

    /* ==================================================== 5) AÇILIŞ */
    function olaylar() {
        var b = $('#mcCevir'); if (b) b.addEventListener('click', MC.cevir);
        var s = $('#mcSinif');
        if (s) s.addEventListener('change', function () {
            seciliSinif = this.value;
            try { localStorage.setItem('merakCarkiSonSinif', seciliSinif); } catch (e) { }
            durumYaz(); $('#mcKart').hidden = true;
        });
        document.querySelectorAll('[data-mc-tur]').forEach(function (t) {
            t.addEventListener('click', function () { MC.turSec(t.getAttribute('data-mc-tur')); });
        });
        /* Boşluk tuşu çarkı çevirir: öğretmen tahtadayken fareye uzanmasın. */
        document.addEventListener('keydown', function (e) {
            if (e.code === 'Space' && !/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test((e.target || {}).tagName || '')) {
                e.preventDefault(); MC.cevir();
            }
        });
    }

    function yukle(src) {
        return new Promise(function (ok, hata) {
            var s = document.createElement('script');
            s.src = src; s.onload = ok; s.onerror = hata;
            document.head.appendChild(s);
        });
    }
    function sdkHazirla() {
        if (window.firebase && firebase.auth && firebase.firestore) return Promise.resolve();
        var p = Promise.resolve();
        if (!window.firebase) p = p.then(function () { return yukle(SDK + 'firebase-app.js'); });
        p = p.then(function () { return yukle(SDK + 'firebase-auth.js'); })
             .then(function () { return yukle(SDK + 'firebase-firestore.js'); });
        return p;
    }

    function buluttanTazele() {
        if (!db || !user) return Promise.resolve();
        return db.collection('kullanicilar').doc(user.uid).get().then(function (doc) {
            if (!doc.exists) return;
            var d = doc.data() || {};
            /* sınıf listesi: buluttaki kopya daha güncel olabilir */
            if (d.userData) {
                var l = sinifAgaci(d.userData);
                if (l.length) { sinifOgeleri = l; sinifSeciciCiz(); }
            }
            /* geçmiş: bulut ile yereli BİRLEŞTİR (iki bilgisayarda çalışılmış
               olabilir; kayıp olmasın, kesişim değil birleşim alınır). */
            if (d.merakCarki) {
                try {
                    var g = JSON.parse(d.merakCarki);
                    Object.keys(g || {}).forEach(function (k) {
                        var a = gecmis[k] || [], b = g[k] || [], birlesik = a.slice();
                        b.forEach(function (x) { if (birlesik.indexOf(x) < 0) birlesik.push(x); });
                        gecmis[k] = birlesik;
                    });
                    yerelYaz();
                } catch (e) { }
            }
            durumYaz();
        }).catch(function (e) {
            console.warn('merakcarki bulut okuma:', e && (e.code || e.message));
        });
    }

    /* Yapışık üst şeridi ölç: kart tepeye kaydırılırken şerit onu örtmesin.
       Yazı boyu ekran enine bağlı olduğu için değer sabit tutulamıyor. */
    function ustOlc() {
        var u = document.querySelector('.mc-ust');
        if (!u) return;
        document.documentElement.style.setProperty(
            '--mc-ust-y', Math.round(u.getBoundingClientRect().height) + 'px');
    }
    MC.ustOlc = ustOlc;

    /* Simgeleri sayfadaki yerlerine koy. HTML'de emoji BIRAKILMADI: tür
       sekmelerinde boş bir <span class="mc-tur-ikon"> duruyor, burada
       doluyor. Böylece simgeler tek yerden (MC_SIMGE) yönetiliyor. */
    function simgeleriYerlestir() {
        var t = document.querySelectorAll('.mc-tur-tus');
        for (var i = 0; i < t.length; i++) {
            var id = t[i].getAttribute('data-mc-tur'), y = t[i].querySelector('.mc-tur-ikon');
            var tur = turBul(id);
            if (tur) t[i].style.setProperty('--r', tur.renk);
            if (y) y.innerHTML = simge(id);
        }
        var u = document.querySelector('.mc-ust-ikon');
        if (u) u.innerHTML = simgeCark();
        var c = $('#mcCevir');
        if (c && c.querySelector('.mcs-ok') === null) c.insertAdjacentHTML('afterbegin', simgeDon());
    }

    function basla() {
        yerelYukle();
        sinifOgeleri = sinifYerelden();
        carkCiz();
        sinifSeciciCiz();
        olaylar();
        simgeleriYerlestir();
        MC.turSec('');                       /* "tür seçmedin" notunu yaz */
        ustOlc();
        window.addEventListener('resize', ustOlc);
        /* Yazı tipleri yüklenince şerit yükselir; o an tekrar ölç. */
        try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(ustOlc); } catch (e) { }
        /* Firebase yalnız varsa: giriş yoksa sayfa yine tam çalışır. */
        sdkHazirla().then(function () {
            if (!firebase.apps.length) firebase.initializeApp(CFG);
            db = firebase.firestore();
            return new Promise(function (res) {
                var kapat = firebase.auth().onAuthStateChanged(function (u) {
                    setTimeout(function () { try { kapat(); } catch (e) { } }, 0);
                    res(u);
                });
            });
        }).then(function (u) {
            if (!u || u.isAnonymous) return;
            user = u;
            var g = $('#mcGiris'); if (g) { g.hidden = true; ustOlc(); }
            return buluttanTazele();
        }).catch(function (e) {
            console.warn('merakcarki:', e && (e.code || e.message));
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla);
    else basla();
})();
