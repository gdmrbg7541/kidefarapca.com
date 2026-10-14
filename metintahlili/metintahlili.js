/* ==========================================================================
   METİN TAHLİLİ                               metintahlili/metintahlili.js
   --------------------------------------------------------------------------
   Öğretmen (14.10.2026): "arapça kelimelerin üstüne tıklayınca türkçesi
   yukarısında belirecek ... cümle iki satırsa iki satır arasında boşluk
   olacak, ikinci satırdaki kelimelerin türkçesi de yukarısında çıkacak ...
   bi cümledeki tüm kelimelere tıklayınca veya bi tercüme tuşuna tıklayınca
   tüm cümlenin türkçesi arapça cümlenin altında çıkacak. Amaç türkçesi
   açılan kelimelerin düzgün türkçe cümlesini öğrenciye zihninden
   toparlatmak ve cümle kurmasını sağlamak."

   VERİ — muhâdese ile ORTAK (muhadese/veri/<ders>.js):
     window.data.sentence = [ { words: [ {ar, tr, order}, ... ] }, ... ]
     window.data.dialog   = [ { p1: [...], p2: [...] }, ... ]
   İKİ SIRA VAR (muhadese/simultane.js de böyle okuyor):
     · dizinin KENDİ sırası → TÜRKÇE cümlenin sırası
     · order alanı          → ARAPÇA cümlenin sırası
   Bu yüzden Arapça satır order'a göre diziliyor, alttaki tam tercüme
   dizinin kendi sırasına göre kuruluyor.

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

    function el(tur, sinif, metin) {
        var e = document.createElement(tur);
        if (sinif) e.className = sinif;
        if (metin != null) e.textContent = metin;
        return e;
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
                    var b = document.createElement('button');
                    b.type = 'button'; b.className = 'mt-d';
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
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'mt-k word';          /* .word → sarf köprüsünün kancası */
            var tr = el('span', 'mt-tr', String(w.tr || '').trim());
            tr.dir = 'ltr';
            var ar = el('span', 'mt-a', String(w.ar).trim());
            ar.dir = 'rtl';
            b.appendChild(tr); b.appendChild(ar);
            try {
                if (window.KidefSarf && KidefSarf.kelimeIsaretle) KidefSarf.kelimeIsaretle(b, w.ar);
            } catch (e) { }
            b.addEventListener('click', function () {
                var acildi = !b.classList.contains('acik');
                b.classList.toggle('acik', acildi);
                acik += acildi ? 1 : -1;
                if (acildi && acik >= kelimeler.length) kutu.classList.add('cevrildi');
                tusSes();
            });
            satir.appendChild(b);
        });
        ic.appendChild(satir);

        var alt = el('div', 'mt-alt');
        var tus = document.createElement('button');
        tus.type = 'button'; tus.className = 'mt-t';
        tus.textContent = '🙇 Tercüme';
        tus.addEventListener('click', function () {
            kutu.classList.toggle('cevrildi');
            tusSes();
        });
        var tam = el('div', 'mt-tam');
        tam.appendChild(el('span', 'mt-tam-et', 'Türkçesi'));
        tam.appendChild(el('b', null, tamTurkce(kelimeler)));
        alt.appendChild(tus); alt.appendChild(tam);
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

    function okumaKur() {
        var D = window.data || {};
        var bilgi = dersBul(DERS);

        /* ---- üst şerit ---- */
        var ust = el('div', 'mt-ust');
        var geri = document.createElement('button');
        geri.type = 'button'; geri.className = 'mt-geri';
        geri.title = 'Listeye dön'; geri.setAttribute('aria-label', 'Listeye dön');
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

        var tuslar = el('div', 'mt-ust-tus');
        var hepsi = document.createElement('button');
        hepsi.type = 'button'; hepsi.className = 'mt-t mt-t-ana';
        hepsi.textContent = 'Hepsini aç';
        var sifirla = document.createElement('button');
        sifirla.type = 'button'; sifirla.className = 'mt-t';
        sifirla.textContent = 'Sıfırla';
        tuslar.appendChild(hepsi); tuslar.appendChild(sifirla);
        ust.appendChild(tuslar);
        KOK.appendChild(ust);

        /* ---- gövde ---- */
        var g = el('div', 'mt-govde');
        g.appendChild(el('div', 'mt-yonerge',
            'Arapça kelimeye dokun: Türkçesi hemen üstünde belirir. Bütün kelimeleri ' +
            'açınca (ya da “Tercüme” tuşuna basınca) cümlenin düzgün Türkçesi altta ' +
            'çıkar — önce kendin kurmayı dene. Kökü bilinen kelimeye dokununca sol ' +
            'alttaki şeritte türü yanar; oradan kalıplar tablosuna geçebilirsin.'));

        var satirlar = [];
        var cumleler = (D.sentence || []).filter(function (c) { return c && c.words && c.words.length; });
        var diyaloglar = (D.dialog || []).filter(function (d) { return d && (d.p1 || d.p2); });

        if (cumleler.length) {
            g.appendChild(el('h2', 'mt-bolum', '📝 Cümleler'));
            cumleler.forEach(function (c, i) {
                var k = kartKur(i + 1);
                var sa = satirKur(c.words);
                k.appendChild(sa); satirlar.push(sa);
                g.appendChild(k);
            });
        }
        if (diyaloglar.length) {
            g.appendChild(el('h2', 'mt-bolum', '💬 Diyaloglar'));
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

        hepsi.addEventListener('click', function () {
            var ac = hepsi.textContent === 'Hepsini aç';
            satirlar.forEach(function (x) { x.mtAc(ac); });
            hepsi.textContent = ac ? 'Hepsini kapat' : 'Hepsini aç';
            tusSes();
        });
        sifirla.addEventListener('click', function () {
            satirlar.forEach(function (x) { x.mtAc(false); });
            hepsi.textContent = 'Hepsini aç';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            tusSes();
        });
    }

    function kur() {
        KOK = document.getElementById('mtKok');
        if (!KOK) return;
        if (DERS) okumaKur(); else listeKur();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();
})();
