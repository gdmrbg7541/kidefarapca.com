/* ==================================================================
   KÂĞIT -> PDF  (sistem/kagitpdf.js)
   ------------------------------------------------------------------
   Ekrandaki bir "kâğıdı" (A4/A3 oranında bir kutu) olduğu gibi tek ya
   da çok sayfalık PDF'e çevirir. Pano afişleri ve değerlendirme
   ölçekleri bu dosyayı kullanıyor.

   NİYE HAZIR KÜTÜPHANE YOK: jsPDF tek başına ~350 KB ve yaptığı iş
   tam olarak aşağıdaki — sayfa başına bir görüntü. PDF'in görüntüyü
   olduğu gibi kabul eden yolları var; dosyayı bayt bayt kuruyoruz.

   KAYIPSIZ: görüntü JPEG değil, kayıpsız sıkıştırmayla (Flate + PNG'
   deki "Up" öngörücüsü) gömülüyor — ince çizgiler ve küçük punto
   JPEG'te tırtıklanıyor. Sıkıştırmayı tarayıcının kendi
   CompressionStream'i yapıyor; olmayan tarayıcıda JPEG'e düşülüyor.

   ÇİZİM: html2canvas. Sayfadaki her şey sitenin KENDİ yazı tipleriyle
   çizildiği için çıktı ekranda görünenin aynısı oluyor.

   KULLANIMI:
       KidefKagit.indir({
           kagitlar: [el1, el2, ...],   // her biri bir sayfa
           boy: 'A4',                   // 'A4' | 'A3'
           ad: 'Ölçek.pdf',
           hazirla: function (klon, i) {...},   // isteğe bağlı
           bitti: function (hata) {...}
       });
   ================================================================== */
window.KidefKagit = (function () {
    'use strict';

    /* Kaynak genişliği: kâğıt bu genişlikte çizilip HEDEF_EN'e
       ölçekleniyor. A4'te ≈300 dpi, A3'te ≈212 dpi. */
    var KAYNAK_EN = 1240, HEDEF_EN = 2480;
    var OLCU = { A3: [841.89, 1190.55], A4: [595.28, 841.89] };
    var JPEG_KALITE = 0.95;
    /* Kütüphane pano klasöründe duruyor (oraya girmişti); iki yerde iki
       kopya tutmamak için buradan da o yol kullanılıyor. */
    var KUTUPHANE = 'pano/html2canvas.min.js?v=1';

    function kutuphane(bitti, olmadi) {
        if (window.html2canvas) { bitti(); return; }
        var e = document.createElement('script');
        e.src = KUTUPHANE;
        e.onload = function () { window.html2canvas ? bitti() : olmadi(); };
        e.onerror = olmadi;
        document.head.appendChild(e);
    }

    function metniBayta(t) {
        var d = new Uint8Array(t.length);
        for (var i = 0; i < t.length; i++) d[i] = t.charCodeAt(i) & 0xFF;
        return d;
    }

    /* ---- elde PDF: her görüntü bir sayfa ----
       PDF'te her nesnenin dosya içindeki BAYT konumu xref tablosuna
       yazılıyor; o yüzden parçalar bayt bayt birleştiriliyor. */
    function pdfKur(gorseller, sayfa) {
        var parca = [], uzunluk = 0, konum = [];
        var EN = sayfa[0], BOY = sayfa[1];
        var n = gorseller.length;

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

        /* Nesne numaraları: 1 katalog, 2 sayfa ağacı,
           her sayfa için 3 nesne (sayfa, görüntü, içerik). */
        var ilk = 3, kimlik = [];
        for (var i = 0; i < n; i++) kimlik.push(ilk + i * 3);

        ekle('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
        nesne(1, '<< /Type /Catalog /Pages 2 0 R >>');
        nesne(2, '<< /Type /Pages /Kids [' +
                 kimlik.map(function (k) { return k + ' 0 R'; }).join(' ') +
                 '] /Count ' + n + ' >>');

        gorseller.forEach(function (g, i) {
            var s = kimlik[i], gor = s + 1, ic = s + 2;
            nesne(s, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + EN + ' ' + BOY +
                     '] /Resources << /XObject << /R0 ' + gor + ' 0 R >> >> /Contents ' +
                     ic + ' 0 R >>');
            nesne(gor, '<< /Type /XObject /Subtype /Image /Width ' + g.en +
                       ' /Height ' + g.boy + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 ' +
                       g.suzgec + ' /Length ' + g.bayt.length + ' >>', g.bayt);
            var icerik = 'q\n' + EN + ' 0 0 ' + BOY + ' 0 0 cm\n/R0 Do\nQ\n';
            nesne(ic, '<< /Length ' + icerik.length + ' >>', metniBayta(icerik));
        });

        var xref = uzunluk, sonNesne = 2 + n * 3;
        var t = 'xref\n0 ' + (sonNesne + 1) + '\n0000000000 65535 f \n';
        for (var k = 1; k <= sonNesne; k++) {
            t += ('0000000000' + (konum[k] || 0)).slice(-10) + ' 00000 n \n';
        }
        t += 'trailer\n<< /Size ' + (sonNesne + 1) + ' /Root 1 0 R >>\nstartxref\n' +
             xref + '\n%%EOF\n';
        ekle(t);

        var hepsi = new Uint8Array(uzunluk), y = 0;
        parca.forEach(function (d) { hepsi.set(d, y); y += d.length; });
        return new Blob([hepsi], { type: 'application/pdf' });
    }

    function baytlar(veriUrl) {
        var ham = atob(veriUrl.split(',')[1]);
        var d = new Uint8Array(ham.length);
        for (var i = 0; i < ham.length; i++) d[i] = ham.charCodeAt(i);
        return d;
    }

    /* Tuvali kayıpsız gömülecek baytlara çevirir. Her satırın başına
       PNG'deki "Up" öngörücüsü konuyor: bir satır üstündekinden
       çıkarılınca çoğu bayt sıfıra iniyor, sıkıştırma kat kat iyi. */
    function kayipsiz(tuval) {
        if (typeof CompressionStream === 'undefined') return Promise.resolve(null);
        var en = tuval.width, boy = tuval.height, im;
        try { im = tuval.getContext('2d').getImageData(0, 0, en, boy).data; }
        catch (e) { return Promise.resolve(null); }
        var satir = en * 3;
        var ham = new Uint8Array((satir + 1) * boy);
        var ust = new Uint8Array(satir), bu = new Uint8Array(satir);
        var y, x, k = 0, s, d;
        for (y = 0; y < boy; y++) {
            s = y * en * 4;
            for (x = 0; x < en; x++) {
                bu[x * 3] = im[s + x * 4];
                bu[x * 3 + 1] = im[s + x * 4 + 1];
                bu[x * 3 + 2] = im[s + x * 4 + 2];
            }
            ham[k++] = 2;
            for (d = 0; d < satir; d++) ham[k++] = (bu[d] - ust[d]) & 0xFF;
            ust.set(bu);
        }
        try {
            var akis = new Blob([ham]).stream().pipeThrough(new CompressionStream('deflate'));
            return new Response(akis).arrayBuffer().then(function (b) {
                return {
                    bayt: new Uint8Array(b), en: en, boy: boy,
                    suzgec: '/Filter /FlateDecode /DecodeParms << /Predictor 12 /Colors 3 ' +
                            '/BitsPerComponent 8 /Columns ' + en + ' >>'
                };
            }).catch(function () { return null; });
        } catch (e) { return Promise.resolve(null); }
    }

    function gorsel(tuval) {
        return kayipsiz(tuval).then(function (g) {
            return g || {
                bayt: baytlar(tuval.toDataURL('image/jpeg', JPEG_KALITE)),
                en: tuval.width, boy: tuval.height, suzgec: '/Filter /DCTDecode'
            };
        });
    }

    /* Dosya adı: Türkçe harfler ve "·" bazı sistemlerde bozuk iniyor. */
    function sade(t) {
        var a = 'çğıöşüÇĞİÖŞÜâîû', b = 'cgiosuCGIOSUaiu', o = '';
        for (var i = 0; i < t.length; i++) {
            var n = a.indexOf(t[i]);
            o += n < 0 ? t[i] : b[n];
        }
        return o.replace(/·/g, '-').replace(/[^\w .()-]+/g, ' ')
                .replace(/\s+/g, ' ').trim();
    }

    /* ÇÖZÜNÜRLÜK, SAYFA SAYISINA GÖRE. Tek sayfa tam çözünürlükte
       (A4'te ~300 dpi) çıkıyor; ama otuz kişilik bir sınıfın tamamı
       aynı çözünürlükte 25 MB'a varıyordu. Çok sayfalı çıktıda hedef
       genişlik düşürülüyor: A4'te ~200 dpi, baskıda hâlâ temiz. */
    function hedefEn(sayfaSayisi) {
        return sayfaSayisi > 6 ? 1654 : HEDEF_EN;
    }

    function tuvalAl(oge, hazirla, sira, hedef) {
        return window.html2canvas(oge, {
            backgroundColor: '#ffffff',
            scale: (hedef || HEDEF_EN) / KAYNAK_EN,
            useCORS: true, logging: false,
            width: KAYNAK_EN, height: Math.round(KAYNAK_EN * 1.41421),
            windowWidth: KAYNAK_EN + 200,
            onclone: function (belge) {
                /* Klonda kâğıt tam boya çekiliyor: bütün iç ölçüler
                   --ae üzerinden yazıldığı için ekranda ne kadar küçük
                   görünürse görünsün çıktı tam boy oluyor. */
                var k = belge.getElementById(oge.id);
                if (k) {
                    k.style.setProperty('--ae', KAYNAK_EN + 'px');
                    k.style.boxShadow = 'none';
                    k.style.transform = 'none';
                }
                if (hazirla) { try { hazirla(belge, k, sira); } catch (e) { } }
            }
        });
    }

    function indir(ayar) {
        var kagitlar = ayar.kagitlar || [ayar.kagit];
        var boy = OLCU[ayar.boy] ? ayar.boy : 'A4';
        function bitti(hata) { if (ayar.bitti) ayar.bitti(hata || null); }

        kutuphane(function () {
            var gorseller = [];
            var hedef = hedefEn(kagitlar.length);
            var zincir = Promise.resolve();
            kagitlar.forEach(function (k, i) {
                zincir = zincir
                    .then(function () { return tuvalAl(k, ayar.hazirla, i, hedef); })
                    .then(gorsel)
                    .then(function (g) { gorseller.push(g); });
            });
            zincir.then(function () {
                var belge = pdfKur(gorseller, OLCU[boy]);
                var u = URL.createObjectURL(belge);
                var a = document.createElement('a');
                a.href = u; a.download = sade(ayar.ad || 'belge') + '.pdf';
                document.body.appendChild(a); a.click(); a.remove();
                setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
                bitti();
            }).catch(function (e) { bitti(e || new Error('çizilemedi')); });
        }, function () {
            bitti(new Error('html2canvas yüklenemedi'));
        });
    }

    return { indir: indir, sade: sade, KAYNAK_EN: KAYNAK_EN };
})();
