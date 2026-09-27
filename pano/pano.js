/* ==================================================================
   PANO — sayfa seçici, ölçekleme ve PDF indirme (pano.html)
   ------------------------------------------------------------------
   YEDİ SAYFA TÜRÜ var; hepsinin içeriğini pano-ciz.js çiziyor:
     · afis   Bu Günün Kökü           (A3, panoya)
     · agac   Kelime ailesi ağacı     (A3, panoya)
     · ifade  Günlük kalıp ifadeler   (A3, panoya)
     · hat    Tezhip çerçeveli boyama (A4, öğrenciye)
     · harf   Harf boyama + dört hâl  (A4, öğrenciye)
     · yazma  Kesik çizgili yazma     (A4, öğrenciye)
     · tablo  Harf bağlantı tablosu   (A3, panoya)

   VERİ NEREDEN:
     pano/panoveri.js   kök afişleri        (veri_kokler.js'ten üretildi)
     pano/panoifade.js  kalıp ifadeler      (veri/kalip.js'ten üretildi)
     pano/panohat.js    harf/kelime konturu (arakom.ttf'ten üretildi)
   Üçü de ÜRETİLMİŞ dosya; Arapçanın tek harfi elle yazılmadı.

   İKİ GÖRÜNÜM: pano (mantar zeminde raptiyeli) ve gerçek boyut (1:1).
   İNDİRME: seçili sayfa tek sayfalık PDF olarak iniyor — pano afişleri
   A3, öğrenci sayfaları A4.
   ================================================================== */
(function () {
    'use strict';

    var CIZ = window.PanoCiz;
    var liste = document.getElementById('pnListe');
    var gruplar = document.getElementById('pnGruplar');
    var sahne = document.getElementById('pnSahne');
    var tusGercek = document.getElementById('pnGercek');
    var tusIndir = document.getElementById('pnIndir');
    var indirYazi = document.getElementById('pnIndirYazi');

    var gercek = false, secili = 0, aktif = '', SAYFA = [], hatIsteniyor = false;

    /* ÖLÇEK TAVANI — tür başına.
       Sığdırma "sığdığı kadar büyüt" diye çalışıyor; içeriği az olan
       sayfalarda (boyama gibi) bu, başlık yazısını gülünç derecede
       irileştirebiliyor. Boyama sayfalarında asıl büyüyecek şey kelime,
       yazı değil — o yüzden kelime kutusu boşluğu yutuyor (CSS'te
       flex), yazının tavanı da burada tutuluyor. */
    var TAVAN = { afis: 1.9, agac: 1.5, ifade: 1.5, hat: 1.35, harf: 1.25, yazma: 1.25, tablo: 1.3 };
    var tavan = 1.9;

    function esc(t) {
        return String(t == null ? '' : t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function koken() {
        /* karekodun göstereceği adres; dosyadan açıldıysa site adresi */
        return /^https?:/.test(location.origin || '') ? location.origin : 'https://kidefarapca.com';
    }

    /* ==================================================================
       GRUPLAR — soldaki şeritte sekme olarak duruyor.
       "hat" işaretli gruplar kontur verisini ister; o dosya (400 KB)
       sayfa açılırken değil, gruba ilk girildiğinde yükleniyor.
       ================================================================== */
    var GRUP = [
        { id: 'afis',  ad: 'Bu Günün Kökü',    ipucu: 'Özel günler · A3' },
        { id: 'agac',  ad: 'Kelime Ailesi',    ipucu: 'Kök ağacı · A3' },
        { id: 'ifade', ad: 'Günlük İfadeler',  ipucu: 'Kalıplar · A3' },
        { id: 'hat',   ad: 'Hat Boyama',       ipucu: 'Tezhipli · A4', hat: 1 },
        { id: 'harf',  ad: 'Harf Boyama',      ipucu: '28 harf · A4', hat: 1 },
        { id: 'yazma', ad: 'Yazma Şeridi',     ipucu: 'Kesik çizgi · A4', hat: 1 },
        { id: 'tablo', ad: 'Bağlantı Tablosu', ipucu: 'Dört hâl · A3', hat: 1 }
    ];

    function sayfalar(grupId) {
        var L = [], H = window.PANO_HAT;
        if (grupId === 'afis') {
            (window.PANO_VERI || []).forEach(function (p) {
                L.push({ tur: 'afis', id: 'afis-' + p.id, ad: p.ad, alt: p.tarih,
                         etiket: p.kok, renk: p.renk, boy: 'A3', veri: p });
            });
        } else if (grupId === 'agac') {
            (window.PANO_VERI || []).forEach(function (p) {
                L.push({ tur: 'agac', id: 'agac-' + p.id, ad: p.ad, alt: 'kelime ailesi',
                         etiket: p.kok, renk: p.renk, boy: 'A3', veri: p,
                         altYazi: 'Kelime Ailesi' });
            });
        } else if (grupId === 'ifade') {
            (window.PANO_IFADE || []).forEach(function (p) {
                L.push({ tur: 'ifade', id: 'ifade-' + p.id, ad: p.ad, alt: p.ar,
                         etiket: '', renk: p.renk, boy: 'A3', veri: p,
                         altYazi: 'Günlük İfadeler' });
            });
        } else if (grupId === 'hat' && H) {
            H.kelimeler.filter(function (k) { return k.grup !== 'harfornek'; })
                .forEach(function (k, i) {
                    L.push({ tur: 'hat', id: 'hat-' + k.id, ad: k.tr || k.ar,
                             alt: k.alt || 'hat boyama', etiket: '',
                             renk: ['#B7791F', '#16A085', '#7C3AED', '#C0392B'][i % 4],
                             boy: 'A4', veri: k, altYazi: 'Hat Boyama' });
                });
        } else if ((grupId === 'harf' || grupId === 'yazma') && H) {
            H.harfler.forEach(function (h, i) {
                L.push({
                    tur: grupId, id: grupId + '-' + i,
                    ad: (grupId === 'harf' ? 'Harf · ' : 'Yazma · ') + h.ad,
                    alt: h.lat ? 'okunuşu: ' + h.lat : h.ad,
                    etiket: h.ar,
                    renk: grupId === 'harf' ? '#0E7C66' : '#2563EB',
                    boy: 'A4', veri: h,
                    altYazi: grupId === 'harf' ? 'Harf Boyama' : 'Yazma Şeridi'
                });
            });
        } else if (grupId === 'tablo' && H) {
            [[0, 14], [14, 28]].forEach(function (a, n) {
                L.push({
                    tur: 'tablo', id: 'tablo-' + n,
                    ad: 'Harf Bağlantı Tablosu · ' + (n + 1) + '. bölüm',
                    alt: (a[0] + 1) + ' – ' + a[1] + '. harfler', etiket: '',
                    renk: '#34495E', boy: 'A3',
                    veri: H.harfler.slice(a[0], a[1]), altYazi: 'Bağlantı Tablosu'
                });
            });
        }
        L.forEach(function (s) { s.adres = koken() + '/pano.html#' + s.id; });
        return L;
    }

    /* ---------- kontur verisini geç yükle ---------- */
    function hatYukle(bitti, olmadi) {
        if (window.PANO_HAT) { bitti(); return; }
        if (hatIsteniyor) { setTimeout(function () { hatYukle(bitti, olmadi); }, 120); return; }
        hatIsteniyor = true;
        var e = document.createElement('script');
        e.src = 'pano/panohat.js?v=1';
        e.onload = function () { window.PANO_HAT ? bitti() : olmadi(); };
        e.onerror = olmadi;
        document.head.appendChild(e);
    }

    /* ==================================================================
       SOL ŞERİT
       ================================================================== */
    function grupCiz() {
        gruplar.innerHTML = GRUP.map(function (g) {
            return '<button type="button" data-g="' + g.id + '" aria-current="' + (g.id === aktif) + '">' +
                esc(g.ad) + '<span>' + esc(g.ipucu) + '</span></button>';
        }).join('');
        [].forEach.call(gruplar.querySelectorAll('button'), function (b) {
            b.onclick = function () { grupSec(b.getAttribute('data-g'), 0); };
        });
    }

    function listeCiz() {
        var h = '';
        SAYFA.forEach(function (p, i) {
            h += '<button type="button" data-i="' + i + '" aria-current="' + (i === secili) + '">' +
                '<span class="pn-nokta" style="background:' + esc(p.renk) + '"></span>' +
                '<span class="pn-ad">' + esc(p.ad) +
                (p.alt ? '<span class="pn-tar">' + esc(p.alt) + '</span>' : '') + '</span>' +
                (p.etiket ? '<span class="pn-kok">' + esc(p.etiket) + '</span>'
                          : '<span class="pn-olcu">' + esc(p.boy) + '</span>') +
                '</button>';
        });
        liste.innerHTML = h || '<p class="pn-bekle">Bu bölümde sayfa yok.</p>';
        [].forEach.call(liste.querySelectorAll('button'), function (b) {
            b.onclick = function () { sec(+b.getAttribute('data-i')); };
        });
    }

    function grupSec(id, n, hashKoru) {
        var g = GRUP.filter(function (x) { return x.id === id; })[0];
        if (!g) return;
        function kur() {
            aktif = id;
            SAYFA = sayfalar(id);
            secili = Math.max(0, Math.min(SAYFA.length - 1, n || 0));
            grupCiz(); listeCiz(); sec(secili, hashKoru);
        }
        if (g.hat && !window.PANO_HAT) {
            sahne.innerHTML = '<p class="pn-bekle">Hat verisi yükleniyor…</p>';
            hatYukle(kur, function () {
                sahne.innerHTML = '<p class="pn-bekle">Hat verisi yüklenemedi (pano/panohat.js).</p>';
            });
        } else kur();
    }

    /* ==================================================================
       AFİŞİ ÇİZ + SIĞDIR
       ================================================================== */

    /* Rengi beyazla karıştırıp açık ton üretir (oran: rengin payı).
       CSS'in color-mix()'i yerine bu kullanılıyor; indirme sırasında
       çalışan html2canvas yeni renk yazımlarını okuyamıyor. */
    function tint(hex, oran) {
        var h = String(hex || '').replace('#', '');
        if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        if (!/^[0-9a-fA-F]{6}$/.test(h)) return '#ffffff';
        var o = '#';
        for (var i = 0; i < 3; i++) {
            var d = parseInt(h.substr(i * 2, 2), 16);
            o += ('0' + Math.round(d * oran + 255 * (1 - oran)).toString(16)).slice(-2);
        }
        return o;
    }

    function ciz(s, adet) {
        var f = CIZ[s.tur];
        tavan = TAVAN[s.tur] || 1.9;
        sahne.innerHTML = '<div class="pn-asili">' +
            '<div class="pn-afis pn-t-' + s.tur + '" id="pnAfis" style="--renk:' + esc(s.renk) +
            ';--acik12:' + tint(s.renk, .12) + ';--acik8:' + tint(s.renk, .08) + '">' +
            (f ? f(s, { adet: adet }) : '') + '</div></div>';
        olcekle();
        return sigdir();
    }

    function sec(i, hashKoru) {
        if (!SAYFA.length) { sahne.innerHTML = ''; return; }
        secili = Math.max(0, Math.min(SAYFA.length - 1, i));
        [].forEach.call(liste.querySelectorAll('button'), function (b) {
            b.setAttribute('aria-current', (+b.getAttribute('data-i') === secili) + '');
        });
        var s = SAYFA[secili];
        document.body.classList.toggle('pn-a4', s.boy === 'A4');
        sayfaOlcusu(s.boy);

        if (s.tur === 'afis') {
            /* KAÇ ÖRNEK CÜMLE YAZILACAK
               Afişte olabildiğince çok örnek olsun ama yazılar da iri
               olsun isteniyor; ikisi birbirini çekiştiriyor. En çok
               örnekten başlanıyor, yazı boyu ESIK'in altına düşerse bir
               örnek eksiltiliyor. */
            var ESIK = 0.72, enIyi = null, adet;
            for (adet = Math.min(3, (s.veri.cumleler || []).length) || 1; adet >= 1; adet--) {
                var sk = ciz(s, adet);
                if (!enIyi || sk > enIyi.sk) enIyi = { adet: adet, sk: sk };
                if (sk >= ESIK) { enIyi = { adet: adet, sk: sk }; break; }
            }
            if (enIyi.adet !== adet) ciz(s, enIyi.adet);
        } else {
            ciz(s);
        }
        if (!hashKoru) { try { history.replaceState(null, '', '#' + s.id); } catch (e) { } }
    }

    /* Sayfa, panonun boş alanına sığacak kadar büyük olsun; "gerçek
       boyut" kipinde ise kâğıdın gerçek eni kadar. */
    function olcekle() {
        var a = document.getElementById('pnAfis');
        if (!a) return;
        var s = SAYFA[secili] || {};
        if (gercek) { a.style.setProperty('--ae', s.boy === 'A4' ? '210mm' : '297mm'); return; }
        /* Sahnenin İÇ ölçüsü (dolgu düşülmüş) alınmalı; yoksa sayfa alta
           taşıp el yazısı not ile alt bant kırpılıyor. */
        var c = getComputedStyle(sahne);
        var yatay = parseFloat(c.paddingLeft) + parseFloat(c.paddingRight);
        var dikey = parseFloat(c.paddingTop) + parseFloat(c.paddingBottom);
        var bosluk = 26;                       /* raptiye ve gölge payı */
        var en = Math.max(240, sahne.clientWidth - yatay - bosluk);
        var boy = Math.max(300, sahne.clientHeight - dikey - bosluk);
        a.style.setProperty('--ae', Math.floor(Math.min(en, boy / 1.41421)) + 'px');
    }

    /* Yazılar OLABİLDİĞİNCE İRİ olsun isteniyor; o yüzden ölçek yalnız
       küçültülmüyor, sığdığı yere kadar büyütülüyor de. Sığan en büyük
       değer ikili arama ile bulunuyor (12 adım ≈ binde bir hassasiyet). */
    function sigdir() {
        var a = document.getElementById('pnAfis');
        if (!a) return 1;
        var ic = a.querySelector('.pn-ic');
        if (!ic) return 1;
        var EN_KUCUK = 0.55, EN_BUYUK = tavan, sk = 1;
        a.style.setProperty('--sk', '1');

        /* DİKKAT — ölçüm hilesi. İçerik kutusunda 'margin-top:auto' olan
           bir öğe var; içerik kısa kalınca bu boşluk artan yeri yutuyor,
           yani scrollHeight her zaman clientHeight'a EŞİT çıkıyor. Sırf
           orana bakan bir karşılaştırma ("%1 payla sığıyor mu") bu yüzden
           hiçbir sayfada doğru olmaz: eşitlik = sığıyor, büyük = taşıyor.
           Baskıda satır kırılmaları biraz kayabildiği için de ölçüm
           sırasında alta geçici bir pay ekleniyor. */
        var payPx = Math.round(a.getBoundingClientRect().height * 0.012);
        var eskiDolgu = ic.style.paddingBottom;

        function sigiyorMu(deger) {
            a.style.setProperty('--sk', deger.toFixed(4));
            ic.style.paddingBottom = '';
            var taban = parseFloat(getComputedStyle(ic).paddingBottom) || 0;
            ic.style.paddingBottom = (taban + payPx) + 'px';
            return ic.scrollHeight <= ic.clientHeight;
        }

        var alt = EN_KUCUK, ust = EN_BUYUK;
        if (sigiyorMu(EN_BUYUK)) alt = EN_BUYUK;
        else {
            for (var n = 0; n < 12; n++) {
                var orta = (alt + ust) / 2;
                if (sigiyorMu(orta)) alt = orta; else ust = orta;
            }
        }
        sk = alt;
        a.style.setProperty('--sk', sk.toFixed(4));
        ic.style.paddingBottom = eskiDolgu;
        return sk;
    }

    /* Yazdırma kâğıdı: A3 ya da A4 (Ctrl+P yolu için) */
    function sayfaOlcusu(boy) {
        var e = document.getElementById('pnSayfaOlcu');
        if (!e) {
            e = document.createElement('style');
            e.id = 'pnSayfaOlcu';
            document.head.appendChild(e);
        }
        e.textContent = '@media print{@page{size:' + (boy === 'A4' ? 'A4' : 'A3') +
            ' portrait;margin:0}}';
    }

    var z = 0;
    window.addEventListener('resize', function () {
        clearTimeout(z); z = setTimeout(function () { olcekle(); sigdir(); }, 120);
    });

    /* ==================================================================
       İNDİRME — tek sayfalık PDF
       ------------------------------------------------------------------
       Görüntüyü html2canvas çiziyor: sayfadaki her şey sitenin KENDİ
       yazı tipleriyle çizildiği için çıktı ekranda görünenin aynısı
       oluyor. Kütüphane yanına kopyalandı (pano/html2canvas.min.js) —
       internetsiz de, dosyaya çift tıklayıp açınca da çalışsın diye.

       ÖLÇEK HİLESİ: klonda --ae sabit 1240 px'e çekiliyor. Bütün iç
       ölçüler --m = --ae * --sk üzerinden yazıldığı için sayfa, ekranda
       ne kadar küçük görünürse görünsün tam boyda çiziliyor.

       PDF NİYE ELDE YAPILIYOR: hazır bir PDF kütüphanesi (jsPDF vb.)
       tek başına ~350 KB daha yük demek ve yaptığı iş tam olarak
       aşağıdaki: tek sayfa, içine bir görüntü.

       KAYIPSIZ: görüntü JPEG değil, kayıpsız sıkıştırmayla (Flate)
       gömülüyor — boyama sayfalarındaki ince konturlar JPEG'te
       tırtıklanıyordu. Sıkıştırmayı tarayıcının kendi CompressionStream'i
       yapıyor, ek kütüphane yok; olmayan tarayıcıda JPEG'e düşülüyor.
       ================================================================== */
    var KAYNAK_EN = 1240, HEDEF_EN = 2480;
    var OLCU = { A3: [841.89, 1190.55], A4: [595.28, 841.89] };
    var JPEG_KALITE = 0.95;

    function kutuphane(bitti, olmadi) {
        if (window.html2canvas) { bitti(); return; }
        var e = document.createElement('script');
        e.src = 'pano/html2canvas.min.js?v=1';
        e.onload = function () { window.html2canvas ? bitti() : olmadi(); };
        e.onerror = olmadi;
        document.head.appendChild(e);
    }

    /* ---- elde PDF: tek sayfa, içinde tam sayfa görüntü ----
       PDF'te her nesnenin dosya içindeki BAYT konumu xref tablosuna
       yazılıyor; o yüzden parçalar bayt bayt birleştiriliyor. */
    function pdfKur(gorsel, en, boy, sayfa) {
        var parca = [], uzunluk = 0, konum = [];
        var EN = sayfa[0], BOY = sayfa[1];

        function metniBayta(t) {
            var d = new Uint8Array(t.length);
            for (var i = 0; i < t.length; i++) d[i] = t.charCodeAt(i) & 0xFF;
            return d;
        }
        function ekle(x) {
            var d = (typeof x === 'string') ? metniBayta(x) : x;
            parca.push(d); uzunluk += d.length;
        }
        function nesne(no, govde, akis) {
            konum[no] = uzunluk;
            ekle(no + ' 0 obj\n' + govde + '\n');
            if (akis) { ekle('stream\n'); ekle(akis); ekle('\nendstream\n'); }
            ekle('endobj\n');
        }

        ekle('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
        nesne(1, '<< /Type /Catalog /Pages 2 0 R >>');
        nesne(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
        nesne(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + EN + ' ' + BOY +
                 '] /Resources << /XObject << /R0 4 0 R >> >> /Contents 5 0 R >>');
        nesne(4, '<< /Type /XObject /Subtype /Image /Width ' + en + ' /Height ' + boy +
                 ' /ColorSpace /DeviceRGB /BitsPerComponent 8 ' + gorsel.suzgec +
                 ' /Length ' + gorsel.bayt.length + ' >>', gorsel.bayt);
        var icerik = 'q\n' + EN + ' 0 0 ' + BOY + ' 0 0 cm\n/R0 Do\nQ\n';
        nesne(5, '<< /Length ' + icerik.length + ' >>', metniBayta(icerik));

        var xref = uzunluk;
        var t = 'xref\n0 6\n0000000000 65535 f \n';
        for (var i = 1; i <= 5; i++) t += ('0000000000' + konum[i]).slice(-10) + ' 00000 n \n';
        t += 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
        ekle(t);

        var hepsi = new Uint8Array(uzunluk), n = 0;
        parca.forEach(function (d) { hepsi.set(d, n); n += d.length; });
        return new Blob([hepsi], { type: 'application/pdf' });
    }

    /* data:image/jpeg;base64,... -> bayt dizisi */
    function baytlar(veriUrl) {
        var ham = atob(veriUrl.split(',')[1]);
        var d = new Uint8Array(ham.length);
        for (var i = 0; i < ham.length; i++) d[i] = ham.charCodeAt(i);
        return d;
    }

    /* Tuvali kayıpsız (Flate) gömülecek baytlara çevirir.
       Her satırın başına PNG'deki "Up" öngörücüsü konuyor: bir satır
       üstündekinden çıkarılınca çoğu bayt sıfıra iniyor, sıkıştırma
       birkaç kat iyileşiyor. */
    function kayipsiz(tuval) {
        if (typeof CompressionStream === 'undefined') return Promise.resolve(null);
        var en = tuval.width, boy = tuval.height, im;
        try { im = tuval.getContext('2d').getImageData(0, 0, en, boy).data; }
        catch (e) { return Promise.resolve(null); }
        var satir = en * 3;
        var ham = new Uint8Array((satir + 1) * boy);
        var ust = new Uint8Array(satir);
        var bu = new Uint8Array(satir);
        var y, x, k = 0, s, d;
        for (y = 0; y < boy; y++) {
            s = y * en * 4;
            for (x = 0; x < en; x++) {
                bu[x * 3] = im[s + x * 4];
                bu[x * 3 + 1] = im[s + x * 4 + 1];
                bu[x * 3 + 2] = im[s + x * 4 + 2];
            }
            ham[k++] = 2;                               /* öngörücü: Up */
            for (d = 0; d < satir; d++) ham[k++] = (bu[d] - ust[d]) & 0xFF;
            ust.set(bu);
        }
        try {
            var akis = new Blob([ham]).stream().pipeThrough(new CompressionStream('deflate'));
            return new Response(akis).arrayBuffer().then(function (b) {
                return {
                    bayt: new Uint8Array(b),
                    suzgec: '/Filter /FlateDecode /DecodeParms << /Predictor 12 /Colors 3 ' +
                            '/BitsPerComponent 8 /Columns ' + en + ' >>'
                };
            }).catch(function () { return null; });
        } catch (e) { return Promise.resolve(null); }
    }

    /* Dosya adı: Türkçe harfler bazı sistemlerde bozuk iniyor. */
    function sade(t) {
        var a = 'çğıöşüÇĞİÖŞÜâîû', b = 'cgiosuCGIOSUaiu', o = '';
        for (var i = 0; i < t.length; i++) {
            var n = a.indexOf(t[i]);
            o += n < 0 ? t[i] : b[n];
        }
        /* "·" gibi harf olmayan işaretler bazı tarayıcılarda dosya adını
           tümden geçersiz kılıyor (indirilen dosya "download" oluyor). */
        return o.replace(/·/g, '-').replace(/[^\w .()-]+/g, ' ')
                .replace(/\s+/g, ' ').replace(/ -$/, '').trim();
    }

    function indir() {
        var a = document.getElementById('pnAfis');
        if (!a || tusIndir.disabled) return;
        var s = SAYFA[secili];
        var eskiYazi = indirYazi.textContent;
        tusIndir.disabled = true;
        indirYazi.textContent = 'Hazırlanıyor…';

        function bitir(yazi) {
            tusIndir.disabled = false;
            indirYazi.textContent = yazi || eskiYazi;
            if (yazi) setTimeout(function () { indirYazi.textContent = eskiYazi; }, 4000);
        }

        kutuphane(function () {
            window.html2canvas(a, {
                backgroundColor: '#ffffff',
                scale: HEDEF_EN / KAYNAK_EN,
                useCORS: true, logging: false,
                width: KAYNAK_EN, height: Math.round(KAYNAK_EN * 1.41421),
                windowWidth: KAYNAK_EN + 200,
                onclone: function (belge) {
                    var k = belge.getElementById('pnAfis');
                    if (!k) return;
                    k.style.setProperty('--ae', KAYNAK_EN + 'px');
                    k.style.boxShadow = 'none';
                    var as = k.closest ? k.closest('.pn-asili') : null;
                    if (as) as.style.transform = 'none';          /* eğikliği düzelt */
                    var sa = belge.getElementById('pnSahne');
                    if (sa) { sa.style.padding = '0'; sa.style.background = '#fff'; }
                }
            }).then(function (tuval) {
                return kayipsiz(tuval).then(function (g) {
                    if (!g) {
                        g = { bayt: baytlar(tuval.toDataURL('image/jpeg', JPEG_KALITE)),
                              suzgec: '/Filter /DCTDecode' };
                    }
                    var ad = sade(s.ad) + ' (' + s.boy + ').pdf';
                    var belge = pdfKur(g, tuval.width, tuval.height, OLCU[s.boy] || OLCU.A3);
                    var u = URL.createObjectURL(belge);
                    var b = document.createElement('a');
                    b.href = u; b.download = ad;
                    document.body.appendChild(b); b.click(); b.remove();
                    setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
                    bitir();
                });
            }).catch(function () { bitir('Olmadı, yazdırmayı dene'); });
        }, function () {
            bitir();
            window.print();
        });
    }

    /* ==================================================================
       TUŞLAR
       ================================================================== */
    tusGercek.onclick = function () {
        gercek = !gercek;
        document.body.classList.toggle('pn-gercek', gercek);
        tusGercek.classList.toggle('etkin', gercek);
        tusGercek.textContent = gercek ? 'Pano görünümü' : 'Gerçek boyut';
        olcekle(); sigdir();
    };
    tusIndir.onclick = indir;

    document.addEventListener('keydown', function (e) {
        if (e.target && /input|textarea/i.test(e.target.tagName)) return;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { sec(secili + 1); e.preventDefault(); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { sec(secili - 1); e.preventDefault(); }
    });

    /* ==================================================================
       KURULUM — adreste # varsa o sayfayı aç
       ================================================================== */
    var h = (location.hash || '').replace('#', '');
    var g = GRUP.filter(function (x) { return h.indexOf(x.id + '-') === 0; })[0];
    if (g) {
        grupSec(g.id, 0, true);
        /* liste kurulduktan sonra doğru sayfaya geç (hat verisi gecikebilir) */
        var dene = 0;
        (function bak() {
            var n = -1;
            SAYFA.forEach(function (p, i) { if (p.id === h) n = i; });
            if (n >= 0) { sec(n, true); return; }
            if (dene++ < 40) setTimeout(bak, 120);
        })();
    } else {
        grupSec('afis', 0);
    }

    /* sınama kancası */
    window.__pano = {
        grupSec: grupSec, sec: sec, grupIdler: GRUP.map(function (x) { return x.id; }),
        durum: function () {
            var a = document.getElementById('pnAfis');
            var ic = a && a.querySelector('.pn-ic');
            return {
                grup: aktif, sayfa: SAYFA.length, secili: secili,
                id: (SAYFA[secili] || {}).id, boy: (SAYFA[secili] || {}).boy,
                sk: a ? getComputedStyle(a).getPropertyValue('--sk').trim() : null,
                tasma: ic ? ic.scrollHeight - ic.clientHeight : null
            };
        }
    };
})();
