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
    /* Dersin hangi kitaptan olduğu (y2627 / sec10 / '' ) — bağlantıda k ile
       geliyor; null ise kitap ayrımı yapılmaz (eski bağlantılar). */
    var ONEK = (typeof window.KIDEF_MT_ONEK === 'string') ? window.KIDEF_MT_ONEK : null;
    var SINIF = window.KIDEF_MT_SINIF || null;      /* sınıf kartından gelindi */
    function dersBag(d, onek) {
        /* Sınıf listesinden açılan derse sınıfı da yazıyoruz: okuma
           ekranındaki ‹ tuşu geldiği sınıfa dönebilsin (15.10.2026,
           öğretmen: "bi sınıftan metin tahlili açıldı diyelim geriye
           basınca tekrar aynı sınıfa gitsin"). */
        return 'metintahlili.html?ders=' + encodeURIComponent(d)
             + '&k=' + encodeURIComponent(String(onek || '').replace(/\//g, ''))
             + (SINIF ? '&sinif=' + encodeURIComponent(SINIF) : '');
    }

    /* ‹ tuşunun gideceği adres: sınıftan gelindiyse o sınıfın listesi. */
    function geriAdres() {
        if (!SINIF) return 'metintahlili.html';
        return 'metintahlili.html?sinif=' + encodeURIComponent(SINIF) +
               (ONEK != null ? '&k=' + encodeURIComponent(ONEK) : '');
    }

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


    /* ---- SİMGELER (14.10.2026, Geylani: "emojiler yerine svg ler kullan")
       Hepsi 24x24 tuval, çizgi biçimi, rengi yazının rengi (currentColor).
       Emoji kullanmıyoruz: işletim sistemine göre değişiyor, yazdırmada ve
       akıllı tahtada bozuk çıkıyordu. */
    var SIMGE = {
        belge: '<path d="M7 3h7l3.5 3.5V21H7z"/><path d="M14 3v3.5h3.5"/>'
             + '<path d="M9.8 12h4.4"/><path d="M9.8 15.6h4.4"/>',
        konus: '<rect x="2.6" y="4.5" width="12" height="8" rx="2.4"/>'
             + '<path d="M6.2 12.5v3.2l3.6-3.2"/>'
             + '<rect x="9.4" y="11.4" width="12" height="8" rx="2.4"/>'
             + '<path d="M17.8 19.4v3.2l-3.6-3.2"/>',
        kisi:  '<circle cx="12" cy="8" r="3.3"/>'
             + '<path d="M5.5 20c.5-3.7 3.2-5.8 6.5-5.8s6 2.1 6.5 5.8"/>',
        ceviri:'<path d="M3.4 17.2 6.8 8.6l3.4 8.6"/><path d="M4.7 14.3h4.3"/>'
             + '<text x="17.4" y="18" font-family="arakom,serif" font-size="13.5" fill="currentColor" stroke="none" text-anchor="middle">ع</text>',
        geri:  '<path d="M19 12a7 7 0 1 1-2.1-5"/><path d="M19 4.6V9.4h-4.8"/>'
    };

    function simge(ad, sinif) {
        var w = document.createElement('span');
        w.innerHTML = '<svg class="mt-sim' + (sinif ? ' ' + sinif : '') + '"'
            + ' viewBox="0 0 24 24" aria-hidden="true" focusable="false">'
            + (SIMGE[ad] || '') + '</svg>';
        return w.firstElementChild;
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
    function dersBul(id, onek) {
        var a = agac(), bul = null;
        a.forEach(function (s) {
            (s.kitaplar || []).forEach(function (kt) {
                if (onek != null && (kt.onek || '') !== onek) return;
                kt.uniteler.forEach(function (u) {
                    u.dersler.forEach(function (d) {
                        if (!bul && d.id === id)
                            bul = { sinif: s, kitap: kt, unite: u, ders: d };
                    });
                });
            });
        });
        return bul;
    }

    /* ================= LİSTE EKRANI ================= */
    /* ---- sınıf renkleri: sitenin kendi paleti (index.html --ihc) ----- */
    var SINIF_RENK = { '5': '#16A085', '6': '#F39C12', '7': '#2563EB',
                       '8': '#7C3AED', '9': '#EE5253', '10': '#0E9E86' };
    function renkAl(s) { return SINIF_RENK[String(s)] || '#16A085'; }
    function rgba(hex, a) {
        var n = parseInt(String(hex).replace('#', ''), 16);
        return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' +
               (n & 255) + ',' + a + ')';
    }
    function renkVer(e, s) {
        var r = renkAl(s);
        e.style.setProperty('--mtc', r);
        e.style.setProperty('--mtcy', rgba(r, .10));
        e.style.setProperty('--mtcb', rgba(r, .34));
        e.style.setProperty('--mtck', rgba(r, .24));
    }
    function sayac(s) {                    /* sınıfın ders ve metin sayısı */
        var ders = 0, metin = 0;
        (s.kitaplar || []).forEach(function (kt) {
            (kt.uniteler || []).forEach(function (u) {
                ders += u.dersler.length;
                u.dersler.forEach(function (x) { metin += (x.cumle || 0); });
            });
        });
        return { ders: ders, metin: metin };
    }
    /* Kitap etiketinin kısa hâli: "Arapça 6 · 2026-2027" → "2026-2027".
       Şeritteki hap dar olduğu için orada bu kullanılıyor. */
    function kitapYil(kt) {
        if (!kt || !kt.yil) return '';
        return (kt.yil === 'secmeli') ? 'Seçmeli' : String(kt.yil);
    }
    function kitapKisa(kt) {
        var ad = String((kt && kt.ad) || '').trim();
        /* "Arapça 6 · 2026-2027" → "2026-2027" */
        var k = ad.replace(/^Arapça\s*\d+\s*[·\-—]\s*/i, '').trim();
        /* "Arapça 5" gibi yalnız sınıfın adı kalıyorsa yıl daha anlamlı;
           "Mektep Yayınları 2026-2027" gibi kendi adı olan kitap korunur. */
        if (!k || /^Arapça\s*\d+$/i.test(k)) return kitapYil(kt) || ad;
        return k;
    }
    /* Kitap etiketi (çip). kisa=true ise şerit için kısaltılmış ad. */
    function kitapCip(kt, kisa, cipSinif) {
        var c = el('span', cipSinif, kisa ? kitapKisa(kt) : (kt.ad || kitapKisa(kt)));
        var ipucu = [kt.ad || '', kt.alt || ''].filter(Boolean).join(' — ');
        if (ipucu) c.title = ipucu;
        return c;
    }

    /* "1. Ünite: Akrabalarım" → { no: '1', ad: 'Akrabalarım' }
       Numara artık kutuda yazdığı için başlıktan ayrılıyor. */
    function adBol(ad, tur, sira) {
        var m = new RegExp('^\\s*(\\d+)\\s*\\.\\s*' + tur + '\\s*:?\\s*(.*)$')
                    .exec(String(ad || ''));
        if (m) return { no: m[1], ad: m[2] };
        return { no: String(sira), ad: String(ad || '') };
    }

    /* ---- seçili kitap, onay ve kitap şeridi (15.10.2026) ------------ */
    function onekAd(kt) { return String((kt && kt.onek) || '').replace(/\//g, ''); }
    function V() { return window.KidefSinifVeri; }

    /* Listede hangi kitap gösterilecek: adreste k varsa o, yoksa sınıfın
       seçili kitabı, o da yoksa listenin ilki. */
    function kitapSayac(kt) {
        var ders = 0, metin = 0;
        ((kt && kt.uniteler) || []).forEach(function (u) {
            ders += u.dersler.length;
            u.dersler.forEach(function (x) { metin += (x.cumle || 0); });
        });
        return { ders: ders, metin: metin };
    }
    function kitapSec(s, kl) {
        var i, v = V();
        if (ONEK != null) {
            for (i = 0; i < kl.length; i++) if (onekAd(kl[i]) === ONEK) return kl[i];
        }
        if (v) {
            var sy = null;
            try { sy = v.seciliVeriYili(s.sinif); } catch (e) { sy = null; }
            if (sy) for (i = 0; i < kl.length; i++) if (kl[i].yil === sy.yil) return kl[i];
        }
        return kl[0];
    }
    /* İki kitaplı sınıfta öğretmen henüz "bu kitabı kullanıyorum" demediyse
       önce onu soruyoruz; üniteler o zamana kadar basılmıyor. */
    function onayGerek(s, kl) {
        var v = V();
        if (!v || !v.onayliMi || kl.length < 2) return false;
        try { return !v.onayliMi(s.sinif); } catch (e) { return false; }
    }
    function gosterilsinMi(s, kl) { return !onayGerek(s, kl); }

    function kitabaGec(s, kt) {
        var v = V();
        try { if (v && v.onayla) v.onayla(s.sinif, kt.yil); } catch (e) {}
        if (SINIF) {                       /* adres kitabı sabitliyor: yenile */
            location.href = 'metintahlili.html?sinif=' + encodeURIComponent(SINIF) +
                            '&k=' + encodeURIComponent(onekAd(kt));
            return;
        }
        listeYenile();
    }

    /* Panelin üstündeki şerit: seçili kitap + (iki kitaplıysa) geçiş. */
    function kitapSerit(s, kl, sec) {
        var kutu = el('div', 'mt-ks');
        if (onayGerek(s, kl)) {
            kutu.className = 'mt-ks mt-ks-soru';
            kutu.appendChild(el('b', 'mt-ks-bas',
                s.ad + ': bu sınıfta hangi kitabı kullanıyorsun?'));
            kutu.appendChild(el('p', 'mt-ks-not',
                'Metin tahlilleri seçtiğin kitaba göre listelenir. Seçimin ' +
                'bütün sitede geçerli olur; panelden her zaman değiştirebilirsin.'));
            var sir = el('div', 'mt-ks-tuslar');
            kl.forEach(function (kt) {
                var t = tus('mt-ks-tus');
                t.appendChild(el('b', null, kt.ad || kt.yil));
                if (kt.alt) t.appendChild(el('small', null, kt.alt));
                t.addEventListener('click', function () { kitabaGec(s, kt); });
                sir.appendChild(t);
            });
            kutu.appendChild(sir);
            return kutu;
        }
        var et = el('span', 'mt-ks-et', 'Seçili kitap');
        kutu.appendChild(et);
        var ad = el('b', 'mt-ks-ad', (sec && (sec.ad || sec.yil)) || '—');
        if (sec && sec.alt) ad.title = sec.alt;
        kutu.appendChild(ad);
        if (kl.length > 1) {
            kl.forEach(function (kt) {
                if (kt === sec) return;
                var t = tus('mt-ks-gec');
                t.appendChild(el('span', null, 'Bu sınıfta şunu kullanıyorum: '));
                t.appendChild(el('b', null, kt.ad || kt.yil));
                if (kt.alt) t.title = kt.alt;
                t.addEventListener('click', function () { kitabaGec(s, kt); });
                kutu.appendChild(t);
            });
        }
        return kutu;
    }

    /* Kitap değişince (şeritten, panelden ya da başka sekmeden) liste
       kendini yeniden çiziyor. */
    function listeYenile() {
        if (!KOK || DERS) return;
        KOK.innerHTML = '';
        listeKur();
    }
    document.addEventListener('kidef:veriyili', function () {
        try { if (!DERS) listeYenile(); } catch (e) {}
    });

    function listeKur() {
        var g = el('div', 'mt-liste-govde');
        var bas = el('div', 'mt-l-bas');
        var rozet = el('div', 'mt-l-rozet');
        bas.appendChild(el('h1', null, 'Metin Tahlili'));
        bas.appendChild(el('p', null,
            'Sınıf ve konusuna göre cümleler ve diyaloglar. Kelimeye dokununca ' +
            'Türkçesi üstünde belirir; hepsini açınca ya da “Tercüme” tuşuna ' +
            'basınca cümlenin tam Türkçesi altta çıkar.'));
        var cipler = el('div', 'mt-l-cip');
        bas.appendChild(cipler);
        g.appendChild(bas);

        var a = agac();
        /* Sınıf kartından gelindiyse yalnız o sınıf — ve k verildiyse yalnız
           o kitap — listelenir; öteki sınıflara "Bütün sınıflar" bağlantısı. */
        if (SINIF) {
            a = a.filter(function (x) { return String(x.sinif) === String(SINIF); })
                 .map(function (x) {
                     if (ONEK == null) return x;
                     var kt = (x.kitaplar || []).filter(function (k) {
                         return String(k.onek || '').replace('/', '') === ONEK;
                     });
                     return kt.length ? { sinif: x.sinif, ad: x.ad, kitaplar: kt } : null;
                 }).filter(Boolean);
            if (a.length) {
                var kt0 = a[0].kitaplar[0];
                bas.querySelector('h1').textContent =
                    a[0].ad + ' · Metin Tahlili';
                bas.querySelector('p').textContent =
                    'Kitabın cümleleri ve diyalogları; kelimeye dokununca Türkçesi ' +
                    'üstünde belirir, hepsi açılınca cümlenin tamamı altta çıkar.';
                /* başlıktaki sınıf rozeti ve çipler */
                rozet.textContent = String(a[0].sinif);
                renkVer(rozet, a[0].sinif);
                bas.insertBefore(rozet, bas.firstChild);
                var ks0 = kitapSec(a[0], (a[0].kitaplar || []));
                var t0 = kitapSayac(ks0);
                if (ks0 && ks0.ad) cipler.appendChild(el('span', 'mt-cip mt-cip-kitap', ks0.ad));
                cipler.appendChild(el('span', 'mt-cip', t0.ders + ' ders'));
                cipler.appendChild(el('span', 'mt-cip', t0.metin + ' metin'));
                var hepsi = el('a', 'mt-hepsi', 'Bütün sınıflar →');
                hepsi.href = 'metintahlili.html';
                bas.appendChild(hepsi);
            }
        }
        if (!a.length) g.appendChild(el('p', 'mt-yonerge', 'Ders listesi yüklenemedi.'));

        /* "Bütün sınıflar" ekranında üstte sınıf şeridi: bir sınıfa basınca
           o sınıf açılır, ötekiler kapanır ve sayfa oraya kayar. */
        var serit = null;
        if (!SINIF && a.length > 1) { serit = el('div', 'mt-serit'); g.appendChild(serit); }

        /* ---- SINIF: akordiyon başlığı + içinde üniteler --------------- */
        a.forEach(function (s, si) {
            var d = document.createElement('details');
            d.className = 'mt-sinif';
            renkVer(d, s.sinif);
            d.id = 'mtS' + s.sinif;
            if (si === 0) d.open = true;
            if (serit) {
                var p = tus('mt-serit-t');
                renkVer(p, s.sinif);
                p.setAttribute('data-sinif', s.sinif);
                if (si === 0) p.classList.add('acik');
                p.appendChild(el('span', 'mt-serit-no', String(s.sinif)));
                var pad = el('span', 'mt-serit-ad');
                pad.appendChild(el('b', null, s.ad));
                var pk = el('span', 'mt-serit-kitaplar');
                var ps = kitapSec(s, (s.kitaplar || []));
                if (ps) pk.appendChild(kitapCip(ps, true, 'mt-serit-kitap'));
                pad.appendChild(pk);
                p.appendChild(pad);
                p.addEventListener('click', function () {
                    d.open = true;
                    try { d.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
                    catch (e) { d.scrollIntoView(); }
                });
                serit.appendChild(p);
            }
            /* akordiyon: aynı anda tek sınıf açık kalsın */
            d.addEventListener('toggle', function () {
                if (d.open) {
                    g.querySelectorAll('details.mt-sinif').forEach(function (o) {
                        if (o !== d) o.open = false;
                    });
                }
                if (serit) {
                    var t = serit.querySelector('[data-sinif="' + s.sinif + '"]');
                    if (t) t.classList.toggle('acik', d.open);
                }
            });

            var sm = document.createElement('summary');
            sm.appendChild(el('span', 'mt-s-disk', String(s.sinif)));
            var sad = el('span', 'mt-s-ad');
            sad.appendChild(el('b', null, s.ad));
            /* Kitap etiketleri: her kitap kendi çipinde (6, 7 ve 10. sınıfın
               iki kitabı var; eskiden tek satırda birleşik yazılıyordu). */
            /* Başlıkta SEÇİLİ kitabın etiketi; iki kitaplı sınıfta yanına
               "2 kitap" notu düşülüyor (hangisinin açık olduğu belli olsun). */
            var kle = (s.kitaplar || []).filter(function (k) { return k && (k.ad || k.yil); });
            if (kle.length) {
                var ks = el('span', 'mt-s-kitaplar');
                var se = kitapSec(s, kle);
                if (se) ks.appendChild(kitapCip(se, false, 'mt-s-kitap'));
                if (kle.length > 1) ks.appendChild(el('span', 'mt-s-coklu', kle.length + ' kitaplı sınıf'));
                sad.appendChild(ks);
            }
            sm.appendChild(sad);
            /* Sayılar da YALNIZ seçili kitabın (iki kitabın toplamı
               gösterilirse "iki kitabın da cümleleri var" izlenimi doğuyor). */
            var t = kitapSayac(kitapSec(s, (s.kitaplar || [])));
            var sy = el('span', 'mt-sayi');
            sy.appendChild(el('b', null, t.ders + ' ders'));
            sy.appendChild(el('i', null, t.metin + ' metin'));
            sm.appendChild(sy);
            sm.appendChild(el('span', 'mt-s-ok', '▾'));
            d.appendChild(sm);

            var ic = el('div', 'mt-s-ic');
            /* SEÇİLİ KİTAP (15.10.2026) — öğretmen: "kitap seçilince
               tahliller ona göre değişmeli, iki kitabın da cümleleri
               varmış gibi duruyor". Artık yalnız o sınıfta SEÇİLİ olan
               kitabın üniteleri listeleniyor; öteki kitaba üstteki
               şeritten geçiliyor (geçiş sınıfın kitap seçimini de
               değiştiriyor, yani site genelinde geçerli). */
            var kl = (s.kitaplar || []).slice();
            var sec = kitapSec(s, kl);
            ic.appendChild(kitapSerit(s, kl, sec));
            if (gosterilsinMi(s, kl)) [sec].forEach(function (kt) {
                (kt.uniteler || []).forEach(function (u, ui) {
                    var ub = adBol(u.ad, 'Ünite', ui + 1);
                    var uk = document.createElement('details');
                    uk.className = 'mt-u';
                    uk.open = true;                    /* içindekiler hep açık gelsin */
                    var us = document.createElement('summary');
                    us.appendChild(el('span', 'mt-u-no', ub.no));
                    var uad = el('span', 'mt-u-ad');
                    uad.appendChild(el('b', null, ub.ad));
                    if (u.ar) {
                        var sp = el('span', 'mt-u-ar', u.ar);
                        sp.dir = 'rtl';
                        uad.appendChild(sp);
                    }
                    us.appendChild(uad);
                    us.appendChild(el('span', 'mt-u-sayi', u.dersler.length + ' ders'));
                    us.appendChild(el('span', 'mt-u-ok', '▾'));
                    uk.appendChild(us);

                    var kat = el('div', 'mt-d-kat');
                    u.dersler.forEach(function (x, di) {
                        var db = adBol(x.ad, 'Ders', di + 1);
                        var b = tus('mt-d');
                        b.appendChild(el('span', 'mt-d-no', db.no));
                        var orta = el('span', 'mt-d-orta');
                        orta.appendChild(el('b', 'mt-d-ad', db.ad));
                        if (x.ar) {
                            var ar = el('span', 'mt-d-ar', x.ar);
                            ar.dir = 'rtl';
                            orta.appendChild(ar);
                        }
                        b.appendChild(orta);
                        b.appendChild(el('span', 'mt-d-nokta'));
                        b.appendChild(el('span', 'mt-d-sayi', (x.cumle || 0) + ' metin'));
                        b.appendChild(el('span', 'mt-d-ok', '›'));
                        b.addEventListener('click', function () {
                            location.href = dersBag(x.id, kt.onek);
                        });
                        kat.appendChild(b);
                    });
                    uk.appendChild(kat);
                    ic.appendChild(uk);
                });
            });
            d.appendChild(ic);
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
            var r = el('span', 'mt-kisi mt-kisi-' + etiket);
            r.appendChild(simge('kisi'));
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
        var t = tus('mt-t mt-t-cev');
        t.appendChild(simge('ceviri'));
        t.appendChild(el('span', null, 'Tercüme'));
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
        var bilgi = dersBul(DERS, ONEK) || dersBul(DERS, null);

        /* ---------- üst şerit: başlık + ilerleme ---------- */
        var ust = el('header', 'mt-ust');
        var geri = tus('mt-geri');
        var geriAd = SINIF ? (SINIF + '. sınıfın ders listesi') : 'Ders listesi';
        geri.title = geriAd; geri.setAttribute('aria-label', geriAd);
        geri.innerHTML = '&#8249;';
        geri.addEventListener('click', function () { location.href = geriAdres(); });
        ust.appendChild(geri);

        var bas = el('div', 'mt-bas');
        bas.appendChild(el('b', null, bilgi ? (bilgi.sinif.ad + ' · ' + bilgi.ders.ad) : 'Metin Tahlili'));
        var ustYazi = bilgi ? bilgi.unite.ad : '';
        if (bilgi && bilgi.sinif.kitaplar && bilgi.sinif.kitaplar.length > 1)
            ustYazi = bilgi.kitap.ad + ' · ' + ustYazi;
        var s = el('small', null, ustYazi ? ustYazi + ' ' : '');
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
        var sifirla = tus('mt-t mt-t-kucuk');
        sifirla.appendChild(simge('geri'));
        sifirla.appendChild(el('span', null, 'Sıfırla'));
        sifirla.title = 'Bütün tercümeleri kapat ve başa dön';
        sifirla.addEventListener('click', function () {
            satirlar.forEach(function (x) { x.mtAc(false); });
            if (swAcik.mtKur) swAcik.mtKur(false);
            ilerlemeYaz();
            try { g.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { g.scrollTop = 0; }
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

        function bolum(sim, ad, sayi) {
            var h = el('h2', 'mt-bolum');
            h.appendChild(simge(sim, 'mt-bolum-sim'));
            h.appendChild(el('span', 'mt-bolum-ad', ad));
            h.appendChild(el('span', 'mt-bolum-sayi', String(sayi)));
            return h;
        }

        if (cumleler.length) {
            g.appendChild(bolum('belge', 'Cümleler', cumleler.length));
            cumleler.forEach(function (c, i) {
                var k = kartKur(i + 1);
                var sa = satirKur(c.words);
                k.appendChild(sa); satirlar.push(sa);
                g.appendChild(k);
            });
        }
        if (diyaloglar.length) {
            g.appendChild(bolum('konus', 'Diyaloglar', diyaloglar.length));
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

        /* Gövde kayarken üst şerit gölgelensin (sayfa hissi). */
        g.addEventListener('scroll', function () {
            var k = g.scrollTop > 4;
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
            if (window.self !== window.top && window.name !== 'kidefTahta') document.documentElement.classList.add('mt-cerceve');
        } catch (e) { document.documentElement.classList.add('mt-cerceve'); }
        if (DERS) okumaKur(); else listeKur();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();
})();
