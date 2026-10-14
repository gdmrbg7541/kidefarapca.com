/* ==========================================================================
   METİN TAHLİLİ                               metintahlili/metintahlili.js
   --------------------------------------------------------------------------
   Öğretmen (14.10.2026): "arapça kelimelerin üstüne tıklayınca türkçesi
   yukarısında belirecek ... bi cümledeki tüm kelimelere tıklayınca veya bi
   tercüme tuşuna tıklayınca tüm cümlenin türkçesi arapça cümlenin altında
   çıkacak. Amaç türkçesi açılan kelimelerin düzgün türkçe cümlesini
   öğrenciye zihninden toparlatmak ve cümle kurmasını sağlamak."
   (14.10.2026-2): "bi sayfa gibi açılsın, popup/overlay şeklinde değil;
   switch şeklinde seçenekler olsun; biraz daha profesyonel olsun."

   VERİ — muhâdese ile ORTAK (muhadese/veri/<ders>.js):
     window.data.sentence = [ { words: [ {ar, tr, order}, ... ] }, ... ]
     window.data.dialog   = [ { p1: [...], p2: [...] }, ... ]
   İKİ SIRA VAR (muhadese/simultane.js de böyle okuyor):
     · dizinin KENDİ sırası → TÜRKÇE cümlenin sırası
     · order alanı          → ARAPÇA cümlenin sırası
   Bu yüzden Arapça satır order'a göre diziliyor, alttaki tam tercüme
   dizinin kendi sırasına göre kuruluyor.

   SEÇENEKLER (üst şeritteki anahtarlar, localStorage'da saklanır):
     oto   Hepsi açılınca cümlenin tercümesi kendiliğinden çıksın
     acik  Bütün Türkçeler açık (ana anahtar)
     hrk   Harekesiz oku (ekranda harekeler gizlenir, veri değişmez)
     kok   Kök şeridi (sarf köprüsünün sol alttaki tür şeridi)

   KALIPLAR TABLOSU BAĞI: kelime kutusu .word sınıfı alıyor ve
   KidefSarf.kelimeIsaretle() ile kökü işaretleniyor; gerisi muhâdesenin
   sarf köprüsünde (sol altta tür şeridi → kalıplar tablosu sekmesi).
   ========================================================================== */
(function () {
    'use strict';

    /* Betik <head>'te çalışıyor (document.write ile yüklendi): gövde henüz
       yok, kök DOM hazır olunca aranır. */
    var KOK = null;
    var DERS = window.KIDEF_MT_DERS || '';

    /* Harekeler + Kur'an işaretleri. Veriye DOKUNULMAZ: özgün yazım
       data-ar'da durur, ekranda gizlenir. */
    var HAREKE = /[ً-ْٰٓ-ٕۖ-ۭ]/g;

    var AYAR_ANAHTAR = 'kidefMtAyar';
    var AYAR = { oto: true, acik: false, hrk: false, kok: true };
    try {
        var kayit = JSON.parse(localStorage.getItem(AYAR_ANAHTAR) || '{}');
        Object.keys(AYAR).forEach(function (k) {
            if (typeof kayit[k] === 'boolean') AYAR[k] = kayit[k];
        });
    } catch (e) { }
    function ayarYaz() {
        try { localStorage.setItem(AYAR_ANAHTAR, JSON.stringify(AYAR)); } catch (e) { }
    }

    function el(tur, sinif, metin) {
        var e = document.createElement(tur);
        if (sinif) e.className = sinif;
        if (metin != null) e.textContent = metin;
        return e;
    }
    function tus(sinif, metin) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = sinif;
        if (metin != null) b.textContent = metin;
        return b;
    }
    function tusSes() {
        try { if (typeof window.playClick === 'function') window.playClick(); } catch (e) { }
    }

    /* ---- ders ağacı (metintahlili/dersler.js) ------------------------ */
    function agac() { return window.METIN_TAHLILI || []; }
    function dersBul(id) {
        var a = agac();
        for (var i = 0; i < a.length; i++) {
            for (var j = 0; j < a[i].uniteler.length; j++) {
                var u = a[i].uniteler[j];
                for (var k = 0; k < u.dersler.length; k++) {
                    if (u.dersler[k].id === id) return { sinif: a[i], unite: u, ders: u.dersler[k] };
                }
            }
        }
        return null;
    }

    /* ================= LİSTE EKRANI ================= */
    function listeKur() {
        var g = el('div', 'mt-liste-govde');
        var bas = el('div', 'mt-l-bas');
        bas.appendChild(el('h1', null, 'Metin Tahlili'));
        bas.appendChild(el('p', null,
            'Sınıf ve konusuna göre cümleler ve diyaloglar. Kelimeye dokununca ' +
            'Türkçesi üstünde belirir; hepsini açınca ya da “Tercüme” tuşuna ' +
            'basınca cümlenin tam Türkçesi altta çıkar.'));
        g.appendChild(bas);

        var a = agac();
        if (!a.length) g.appendChild(el('p', 'mt-yonerge', 'Ders listesi yüklenemedi.'));

        a.forEach(function (s, si) {
            var d = document.createElement('details');
            d.className = 'mt-sinif';
            if (si === 0) d.open = true;
            var sm = document.createElement('summary');
            sm.appendChild(el('span', null, s.ad));
            var ders = 0, cumle = 0;
            s.uniteler.forEach(function (u) {
                ders += u.dersler.length;
                u.dersler.forEach(function (x) { cumle += (x.cumle || 0); });
            });
            sm.appendChild(el('span', 'mt-sayi', ders + ' ders · ' + cumle + ' metin'));
            d.appendChild(sm);
            s.uniteler.forEach(function (u) {
                var uk = el('div', 'mt-u');
                var h3 = el('h3', null, u.ad);
                if (u.ar) { var sp = el('span', null, u.ar); sp.dir = 'rtl'; h3.appendChild(sp); }
                uk.appendChild(h3);
                var kat = el('div', 'mt-d-kat');
                u.dersler.forEach(function (x) {
                    var b = tus('mt-d');
                    b.appendChild(el('b', null, x.ad));
                    if (x.ar) { var ar = el('span', 'mt-d-ar', x.ar); ar.dir = 'rtl'; b.appendChild(ar); }
                    b.appendChild(el('small', null, (x.cumle || 0) + ' cümle/diyalog'));
                    b.addEventListener('click', function () {
                        location.href = 'metintahlili.html?ders=' + encodeURIComponent(x.id);
                    });
                    kat.appendChild(b);
                });
                uk.appendChild(kat);
                d.appendChild(uk);
            });
            g.appendChild(d);
        });
        KOK.appendChild(g);
    }

    /* ================= OKUMA EKRANI ================= */
    function arapcaSira(k) {
        return k.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    }
    function tamTurkce(k) {
        return k.map(function (w) { return String(w.tr || '').trim(); })
                .filter(function (x) { return x; }).join(' ')
                .replace(/\s+([,.;:!?])/g, '$1').replace(/\s{2,}/g, ' ');
    }

    var satirlar = [];                 /* bütün konuşma sıraları */
    var ilerlemeYaz = function () { };

    /* Bir konuşma sırası: Arapça kelime satırı + "Tercüme" + tam Türkçe.
       etiket: diyalogda konuşmacı ('1' / '2'), düz cümlede yok. */
    function satirKur(ham, etiket) {
        var kelimeler = (ham || []).filter(function (w) { return w && w.ar; });
        var kutu = el('div', 'mt-s');
        if (etiket) {
            var r = el('span', 'mt-kisi mt-kisi-' + etiket, etiket === '1' ? '👤' : '🧑');
            r.title = etiket + '. konuşmacı';
            kutu.appendChild(r);
        }
        var ic = el('div', 'mt-s-ic');
        var satir = el('div', 'mt-satir');
        satir.dir = 'rtl';
        var acik = 0;

        arapcaSira(kelimeler).forEach(function (w) {
            var b = tus('mt-k word');           /* .word → sarf köprüsünün kancası */
            var tr = el('span', 'mt-tr', String(w.tr || '').trim());
            tr.dir = 'ltr';
            var ozgun = String(w.ar).trim();
            var ar = el('span', 'mt-a', AYAR.hrk ? ozgun.replace(HAREKE, '') : ozgun);
            ar.dir = 'rtl';
            ar.setAttribute('data-ar', ozgun);
            b.appendChild(tr); b.appendChild(ar);
            try {
                if (window.KidefSarf && KidefSarf.kelimeIsaretle) KidefSarf.kelimeIsaretle(b, w.ar);
            } catch (e) { }
            b.addEventListener('click', function () {
                var acildi = !b.classList.contains('acik');
                b.classList.toggle('acik', acildi);
                acik += acildi ? 1 : -1;
                /* ANAHTAR "oto": hepsi açılınca cümlenin tercümesi kendiliğinden. */
                if (AYAR.oto && acildi && acik >= kelimeler.length) kutu.classList.add('cevrildi');
                ilerlemeYaz();
                tusSes();
            });
            satir.appendChild(b);
        });
        ic.appendChild(satir);

        var alt = el('div', 'mt-alt');
        var t = tus('mt-t mt-t-cev', '🙇 Tercüme');
        t.addEventListener('click', function () {
            kutu.classList.toggle('cevrildi');
            ilerlemeYaz();
            tusSes();
        });
        var tam = el('div', 'mt-tam');
        tam.appendChild(el('span', 'mt-tam-et', 'Türkçesi'));
        tam.appendChild(el('b', null, tamTurkce(kelimeler)));
        alt.appendChild(t); alt.appendChild(tam);
        ic.appendChild(alt);
        kutu.appendChild(ic);

        kutu.mtAc = function (durum) {
            acik = durum ? kelimeler.length : 0;
            satir.querySelectorAll('.mt-k').forEach(function (x) {
                x.classList.toggle('acik', !!durum);
            });
            kutu.classList.toggle('cevrildi', !!durum);
        };
        return kutu;
    }

    function kartKur(sira, tur) {
        var k = el('article', 'mt-c' + (tur === 'diyalog' ? ' mt-c-diyalog' : ''));
        k.appendChild(el('div', 'mt-no', String(sira)));
        return k;
    }

    /* ---- anahtar (switch) --------------------------------------------- */
    function anahtar(ad, metin, baslik, degisti) {
        var l = el('label', 'mt-sw');
        l.title = baslik || '';
        var g = document.createElement('input');
        g.type = 'checkbox'; g.checked = !!AYAR[ad];
        g.addEventListener('change', function () {
            AYAR[ad] = g.checked;
            ayarYaz();
            l.classList.toggle('acik', g.checked);
            if (degisti) degisti(g.checked);
            tusSes();
        });
        l.classList.toggle('acik', g.checked);
        l.appendChild(g);
        l.appendChild(el('span', 'mt-sw-yol'));
        l.appendChild(el('span', 'mt-sw-ad', metin));
        l.mtKur = function (durum) {                 /* dışarıdan konumlandırma */
            g.checked = durum; AYAR[ad] = durum; ayarYaz();
            l.classList.toggle('acik', durum);
        };
        return l;
    }

    /* Harekeleri ekranda gizle / geri getir (veri değişmez). */
    function harekeUygula(gizle) {
        document.querySelectorAll('.mt-a').forEach(function (e) {
            var o = e.getAttribute('data-ar') || e.textContent;
            e.textContent = gizle ? o.replace(HAREKE, '') : o;
        });
    }

    function okumaKur() {
        var D = window.data || {};
        var bilgi = dersBul(DERS);

        /* ---------- üst şerit: başlık + ilerleme ---------- */
        var ust = el('header', 'mt-ust');
        var geri = tus('mt-geri');
        geri.title = 'Ders listesi'; geri.setAttribute('aria-label', 'Ders listesi');
        geri.innerHTML = '&#8249;';
        geri.addEventListener('click', function () { location.href = 'metintahlili.html'; });
        ust.appendChild(geri);

        var bas = el('div', 'mt-bas');
        bas.appendChild(el('b', null, bilgi ? (bilgi.sinif.ad + ' · ' + bilgi.ders.ad) : 'Metin Tahlili'));
        var s = el('small', null, bilgi ? bilgi.unite.ad + ' ' : '');
        if (bilgi && bilgi.ders.ar) {
            var sar = el('span', 'mt-bas-ar', bilgi.ders.ar); sar.dir = 'rtl';
            s.appendChild(sar);
        }
        bas.appendChild(s);
        ust.appendChild(bas);

        var ilerleme = el('div', 'mt-ilerleme');
        var ilrSayi = el('b', null, '0');
        var ilrToplam = el('span', 'mt-ilr-toplam', ' / 0');
        var ilrCubuk = el('span', 'mt-ilr-cubuk');
        var ilrDolu = el('i');
        ilrCubuk.appendChild(ilrDolu);
        var ilrYazi = el('span', 'mt-ilr-yazi');
        ilrYazi.appendChild(ilrSayi); ilrYazi.appendChild(ilrToplam);
        ilerleme.appendChild(ilrYazi); ilerleme.appendChild(ilrCubuk);
        ilerleme.title = 'Tercümesi açılan metin sayısı';
        ust.appendChild(ilerleme);
        KOK.appendChild(ust);

        /* ---------- anahtar çubuğu ---------- */
        var secenek = el('div', 'mt-secenek');
        var swAcik;
        secenek.appendChild(anahtar('oto', 'Hepsi açılınca tercüme',
            'Bir cümlenin bütün kelimeleri açılınca Türkçesi kendiliğinden çıksın'));
        swAcik = anahtar('acik', 'Türkçeler açık',
            'Bütün kelimelerin ve cümlelerin Türkçesini aç', function (d) {
                satirlar.forEach(function (x) { x.mtAc(d); });
                ilerlemeYaz();
            });
        secenek.appendChild(swAcik);
        secenek.appendChild(anahtar('hrk', 'Harekesiz oku',
            'Harekeleri gizler — metin değişmez, yalnız ekranda görünmez',
            function (d) { harekeUygula(d); }));
        secenek.appendChild(anahtar('kok', 'Kök şeridi',
            'Kelimeye dokununca sol altta beliren tür şeridi (kalıplar tablosu bağı)',
            function (d) { document.documentElement.classList.toggle('mt-koksuz', !d); }));

        var bosluk = el('span', 'mt-sec-bosluk');
        secenek.appendChild(bosluk);
        var sifirla = tus('mt-t mt-t-kucuk', '↺ Sıfırla');
        sifirla.title = 'Bütün tercümeleri kapat ve başa dön';
        sifirla.addEventListener('click', function () {
            satirlar.forEach(function (x) { x.mtAc(false); });
            if (swAcik.mtKur) swAcik.mtKur(false);
            ilerlemeYaz();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            tusSes();
        });
        secenek.appendChild(sifirla);
        KOK.appendChild(secenek);

        /* ---------- gövde ---------- */
        var g = el('div', 'mt-govde');
        g.appendChild(el('p', 'mt-ipucu',
            'Arapça kelimeye dokun — Türkçesi hemen üstünde belirir. Bütün kelimeleri ' +
            'açınca cümlenin düzgün Türkçesi altta çıkar; önce kendin kurmayı dene.'));

        satirlar = [];
        var cumleler = (D.sentence || []).filter(function (c) { return c && c.words && c.words.length; });
        var diyaloglar = (D.dialog || []).filter(function (d) { return d && (d.p1 || d.p2); });

        function bolum(simge, ad, sayi) {
            var h = el('h2', 'mt-bolum');
            h.appendChild(el('span', 'mt-bolum-sim', simge));
            h.appendChild(el('span', 'mt-bolum-ad', ad));
            h.appendChild(el('span', 'mt-bolum-sayi', String(sayi)));
            return h;
        }

        if (cumleler.length) {
            g.appendChild(bolum('📝', 'Cümleler', cumleler.length));
            cumleler.forEach(function (c, i) {
                var k = kartKur(i + 1);
                var sa = satirKur(c.words);
                k.appendChild(sa); satirlar.push(sa);
                g.appendChild(k);
            });
        }
        if (diyaloglar.length) {
            g.appendChild(bolum('💬', 'Diyaloglar', diyaloglar.length));
            diyaloglar.forEach(function (d, i) {
                var k = kartKur(i + 1, 'diyalog');
                ['p1', 'p2'].forEach(function (p, pi) {
                    if (!d[p] || !d[p].length) return;
                    var sa = satirKur(d[p], String(pi + 1));
                    k.appendChild(sa); satirlar.push(sa);
                });
                g.appendChild(k);
            });
        }
        if (!satirlar.length) g.appendChild(el('div', 'mt-c', 'Bu dersin metni bulunamadı.'));
        KOK.appendChild(g);

        /* ---------- ilerleme ---------- */
        ilrToplam.textContent = ' / ' + satirlar.length;
        ilerlemeYaz = function () {
            var n = 0;
            satirlar.forEach(function (x) { if (x.classList.contains('cevrildi')) n++; });
            ilrSayi.textContent = n;
            ilrDolu.style.width = (satirlar.length ? (n / satirlar.length * 100) : 0) + '%';
            ilerleme.classList.toggle('tam', satirlar.length > 0 && n === satirlar.length);
        };

        /* ---------- açılış durumu ---------- */
        if (AYAR.hrk) harekeUygula(true);
        document.documentElement.classList.toggle('mt-koksuz', !AYAR.kok);
        if (AYAR.acik) satirlar.forEach(function (x) { x.mtAc(true); });
        ilerlemeYaz();

        /* Üst şerit kayarken gölgelensin (sayfa hissi). */
        window.addEventListener('scroll', function () {
            var k = window.scrollY > 4;
            ust.classList.toggle('kaydi', k);
            secenek.classList.toggle('kaydi', k);
        }, { passive: true });
    }

    function kur() {
        KOK = document.getElementById('mtKok');
        if (!KOK) return;
        /* Kitabın içinde (tam sayfa alıştırma çerçevesi) açıldıysa sağ üstte
           kitabın kapatma tuşu duruyor: başlık ona çarpmasın. */
        try {
            if (window.self !== window.top) document.documentElement.classList.add('mt-cerceve');
        } catch (e) { document.documentElement.classList.add('mt-cerceve'); }
        if (DERS) okumaKur(); else listeKur();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();
})();
