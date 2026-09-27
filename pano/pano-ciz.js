/* ==================================================================
   PANO ÇİZİCİLERİ — her sayfa türünün içeriğini üretir (pano.html)
   ------------------------------------------------------------------
   Burada yalnız ÇİZİM var: ölçekleme, liste, PDF pano.js'te.
   Her çizici, afiş çerçevesinin İÇİNİ döndürür:
       üst bant  +  .pn-ic (içerik)  +  alt bant
   Çerçevenin kendisini pano.js kuruyor.

   ÖLÇÜ KURALI: bütün ölçüler --m üzerinden yazılır (bkz. pano.css).
   Böylece "sığdıkça büyüsün" ayarı yazıyı da şekli de birlikte
   büyütüp küçültüyor.

   SVG KONTURLARI: harf ve kelimelerin dış çizgileri pano/panohat.js'
   ten geliyor (sitenin kendi yazı tipinden üretilmiş yollar). Yazı
   tipine bağlı olmadıkları için PDF'te de kenarları keskin çıkıyor.
   ================================================================== */
window.PanoCiz = (function () {
    'use strict';

    function esc(t) {
        return String(t == null ? '' : t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /* ---------- kontur yolunu SVG'ye çevir ----------
       y: {d, kutu:[x,y,en,boy]} — font birimiyle (em = 1024).
       Çizgi kalınlığı da font biriminde: sayfa büyüdükçe o da büyür. */
    function yolSvg(y, a) {
        if (!y || !y.d) return '';
        a = a || {};
        var k = y.kutu, p = (a.pay == null ? 26 : a.pay);
        return '<svg class="pn-yol ' + (a.sinif || '') + '" ' +
            'viewBox="' + (k[0] - p) + ' ' + (k[1] - p) + ' ' +
            (k[2] + p * 2) + ' ' + (k[3] + p * 2) + '" ' +
            'preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
            '<path d="' + y.d + '" fill="' + (a.dolgu || 'none') + '" ' +
            'stroke="' + (a.cizgi || '#2A3242') + '" ' +
            'stroke-width="' + (a.kalinlik == null ? 9 : a.kalinlik) + '" ' +
            (a.kesik ? 'stroke-dasharray="' + a.kesik + '" ' : '') +
            'stroke-linejoin="round" stroke-linecap="round"/></svg>';
    }

    /* ---------- çizgi kalınlığını eşitle ----------
       Çizgi kalınlığı viewBox biriminde; kutusu geniş olan bir kelime
       sayfaya sığmak için küçültülünce çizgisi de inceliyor ve
       "السلام عليكم" gibi uzun ibareler kıl gibi çıkıyordu. Kalınlığı
       kelimenin kutusuyla orantılı verince sayfadaki kalınlık hep aynı
       kalıyor — boyanacak alan her kelimede aynı genişlikte. */
    function esitKalinlik(y, istenen, temel) {
        if (!y || !y.kutu) return istenen;
        var buyuk = Math.max(y.kutu[2], y.kutu[3]);
        return Math.round(istenen * buyuk / (temel || 1100) * 10) / 10;
    }

    /* ---------- tezhip çerçevesi ----------
       Klasik kenar süsü: çift çerçeve, köşe gülleri, kenarlarda
       baklava dilimleri ve aralarında küçük noktalar. Hepsi kontur —
       öğrenci çerçeveyi de boyayabiliyor.

       DİKKAT — iki tuzağa dikkat edilerek çizildi:
       1) Çizim 1000x1000 KARE bir düzlemde. Kutu da kare (bkz.
          pano.css → .pn-hatkutu). Eskiden kutu dikdörtgendi ve çizim
          "preserveAspectRatio: none" ile esnetiliyordu; daireler
          yumurtaya dönüyor, süsler birbirine giriyordu.
       2) Kenar süsleri köşe güllerinin ÜSTÜNDEN başlamıyor: köşeden
          KOSE_PAY kadar içeride başlayıp bitiyor. Eskiden ilk süs tam
          köşe gülünün üzerine denk geliyor, üst üste biniyordu. */
    function tezhip(renk) {
        var DIS = 26, IC = 96, ORTA = (DIS + IC) / 2;   /* çerçeveler ve süs şeridi */
        var SON = 1000 - IC, KOSE_PAY = 78;             /* köşeden bırakılan boşluk */
        var ELMAS = 19, NOKTA = 5.5;
        var g = '';

        /* bir kenar boyunca süsleri dağıt: baklava · nokta · baklava … */
        function serit(bas, bit, yatayMi, kayit) {
            var uzunluk = bit - bas;
            var adet = Math.max(3, Math.round(uzunluk / 92));   /* aralık ~92 birim */
            for (var i = 0; i <= adet; i++) {
                var t = bas + uzunluk * (i / adet);
                var x = yatayMi ? t : kayit, y = yatayMi ? kayit : t;
                g += '<path d="M' + x + ' ' + (y - ELMAS) + ' L' + (x + ELMAS) + ' ' + y +
                     ' L' + x + ' ' + (y + ELMAS) + ' L' + (x - ELMAS) + ' ' + y + ' Z"/>';
                if (i < adet) {
                    var o = bas + uzunluk * ((i + 0.5) / adet);
                    var ox = yatayMi ? o : kayit, oy = yatayMi ? kayit : o;
                    g += '<circle cx="' + ox + '" cy="' + oy + '" r="' + NOKTA + '"/>';
                }
            }
        }
        serit(IC + KOSE_PAY, SON - KOSE_PAY, true, ORTA);            /* üst */
        serit(IC + KOSE_PAY, SON - KOSE_PAY, true, 1000 - ORTA);     /* alt */
        serit(IC + KOSE_PAY, SON - KOSE_PAY, false, ORTA);           /* sol */
        serit(IC + KOSE_PAY, SON - KOSE_PAY, false, 1000 - ORTA);    /* sağ */

        /* köşe gülleri — iç çerçevenin köşelerinde */
        [[IC, IC], [SON, IC], [IC, SON], [SON, SON]].forEach(function (c) {
            g += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="30"/>';
            g += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="15"/>';
            g += '<path d="M' + c[0] + ' ' + (c[1] - 30) + ' L' + (c[0] + 30) + ' ' + c[1] +
                 ' L' + c[0] + ' ' + (c[1] + 30) + ' L' + (c[0] - 30) + ' ' + c[1] + ' Z"/>';
        });

        return '<svg class="pn-tezhip" viewBox="0 0 1000 1000" ' +
            'preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
            '<g fill="none" stroke="' + renk + '" stroke-width="7" ' +
            'stroke-linejoin="round" stroke-linecap="round">' +
            '<rect x="' + DIS + '" y="' + DIS + '" width="' + (1000 - 2 * DIS) +
            '" height="' + (1000 - 2 * DIS) + '" rx="24"/>' +
            '<rect x="' + IC + '" y="' + IC + '" width="' + (SON - IC) +
            '" height="' + (SON - IC) + '" rx="12"/>' +
            g + '</g></svg>';
    }

    /* ---------- karekod (varsa) ----------
       Kütüphane gelmediyse hiç çizilmiyor; afiş yine tam. */
    function karekod(adres) {
        if (!window.qrcode) return '';
        try {
            var q = window.qrcode(0, 'M');
            q.addData(adres);
            q.make();
            var n = q.getModuleCount(), g = '', x, y;
            for (y = 0; y < n; y++) {
                for (x = 0; x < n; x++) {
                    if (q.isDark(y, x)) g += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02"/>';
                }
            }
            return '<svg class="pn-qr" viewBox="-1 -1 ' + (n + 2) + ' ' + (n + 2) + '" aria-hidden="true">' +
                '<rect x="-1" y="-1" width="' + (n + 2) + '" height="' + (n + 2) + '" fill="#fff"/>' +
                '<g fill="#2A3242">' + g + '</g></svg>';
        } catch (e) { return ''; }
    }

    function bant(s, rozet) {
        var r = (rozet == null) ? s.alt : rozet;
        return '<div class="pn-bant"><div class="pn-gun">' + esc(s.ad) + '</div>' +
            (r ? '<div class="pn-tarih">' + esc(r) + '</div>' : '') + '</div>';
    }
    function altBant(s, qr) {
        return '<div class="pn-alt">' +
            (qr ? '<span class="pn-qrkutu">' + qr + '</span>' : '') +
            '<span>kidefarapca.com</span><span class="pn-cizgi"></span>' +
            '<span>' + esc(s.altYazi || 'Arapça') + '</span></div>';
    }

    /* ==================================================================
       1) AFİŞ — "Bu Günün Kökü"
       ================================================================== */
    function afis(s, ayar) {
        var p = s.veri, adet = (ayar && ayar.adet) || 3;
        var harfler = String(p.kok || '').split('').map(function (x) {
            return '<span class="pn-harf">' + esc(x) + '</span>';
        }).join('');

        var satir = (p.turev || []).map(function (t) {
            var uzun = '';
            if (t.tr && t.kisa && t.tr !== t.kisa) {
                uzun = t.tr.indexOf(t.kisa) === 0
                    ? t.tr.slice(t.kisa.length).replace(/^[\s\/();,·-]+/, '')
                    : t.tr;
            }
            return '<div class="pn-sat"><span class="pn-ar">' + esc(t.ar) + '</span>' +
                '<span class="pn-tr">' + esc(t.kisa || t.tr) +
                (uzun ? '<span class="pn-uzun">' + esc(uzun) + '</span>' : '') +
                '</span></div>';
        }).join('');

        var ornek = (p.cumleler || []).slice(0, Math.max(1, adet));
        var cumle = ornek.length
            ? '<div class="pn-ornek">' + ornek.map(function (c) {
                return '<div class="pn-cumle"><div class="pn-car">' + esc(c.ar) + '</div>' +
                    '<div class="pn-ctr">' + esc(c.tr) +
                    (c.kaynak ? '<span class="pn-kaynak">' + esc(c.kaynak) + '</span>' : '') +
                    '</div></div>';
            }).join('') + '</div>'
            : '';

        return bant(s) +
            '<div class="pn-ic">' +
                '<p class="pn-uste">Bu günün kökü</p>' +
                '<div class="pn-kokkutu">' + harfler + '</div>' +
                '<div class="pn-kokalt">üç harf · bir anlam ailesi</div>' +
                '<div class="pn-turev">' + satir + '</div>' +
                cumle +
                '<p class="pn-not">' + esc(p.not || '') + '</p>' +
            '</div>' +
            altBant(s, karekod(s.adres));
    }

    /* ==================================================================
       2) KELİME AİLESİ AĞACI — kök ortada, türevler dallarda
       ================================================================== */
    function agac(s) {
        var p = s.veri;
        var harfler = String(p.kok || '').split('').map(function (x) {
            return '<span class="pn-harf">' + esc(x) + '</span>';
        }).join('');
        var dal = (p.turev || []).map(function (t, i) {
            return '<div class="pn-dal ' + (i % 2 ? 'sag' : 'sol') + '">' +
                '<span class="pn-dalcizgi"></span>' +
                '<span class="pn-dalkutu"><b>' + esc(t.ar) + '</b>' +
                '<i>' + esc(t.kisa || t.tr) + '</i></span></div>';
        }).join('');
        return bant(s) +
            '<div class="pn-ic pn-agacic">' +
                '<p class="pn-uste">Bir kök, bir kelime ailesi</p>' +
                '<div class="pn-kokkutu">' + harfler + '</div>' +
                '<div class="pn-govdecizgi"><div class="pn-dallar">' + dal + '</div></div>' +
                '<p class="pn-not">' + esc(p.not || '') + '</p>' +
            '</div>' +
            altBant(s, karekod(s.adres));
    }

    /* ==================================================================
       3) İFADE AFİŞİ — günlük kalıplar
       ================================================================== */
    function ifade(s) {
        var p = s.veri;
        var satir = (p.satir || []).map(function (w) {
            return '<div class="pn-isat"><span class="pn-iar">' + esc(w.ar) + '</span>' +
                '<span class="pn-itr">' + esc(w.tr) + '</span></div>';
        }).join('');
        return bant(s) +
            '<div class="pn-ic">' +
                (p.ar ? '<p class="pn-iust">' + esc(p.ar) + '</p>' : '') +
                '<div class="pn-ifade">' + satir + '</div>' +
            '</div>' +
            altBant(s, karekod(s.adres));
    }

    /* ==================================================================
       4) HAT BOYAMA — tezhip çerçeveli tek kelime
       ================================================================== */
    function hat(s) {
        var k = s.veri;
        /* Rozete uzun gün adı değil kısa bir etiket: başlık şeridi
           kalabalıklaşmasın. Gün adı aşağıda, kelimenin altında. */
        return bant(s, 'Hat Boyama') +
            '<div class="pn-ic pn-hatic">' +
                '<p class="pn-uste">Harflerin içini boya</p>' +
                '<div class="pn-hatkutu">' + tezhip(s.renk || '#B7791F') +
                    yolSvg(k, { sinif: 'pn-hatyol', kalinlik: esitKalinlik(k, 10, 1200) }) +
                '</div>' +
                '<div class="pn-hattr"><b>' + esc(k.tr) + '</b>' +
                    (k.alt ? '<i>' + esc(k.alt) + '</i>' : '') + '</div>' +
            '</div>' +
            altBant(s, '');
    }

    /* ==================================================================
       5) HARF SAYFASI — büyük harf + dört hâli + örnek kelime
       ================================================================== */
    function harf(s) {
        var h = s.veri;
        var hucre = [];
        function ek(y, ad) {
            if (!y) return;
            hucre.push('<div class="pn-hal">' +
                yolSvg(y, { kalinlik: esitKalinlik(y, 9, 900), sinif: 'pn-halyol' }) +
                '<span>' + ad + '</span></div>');
        }
        ek(h.yalin, 'yalın');
        if (h.baglanir) { ek(h.basta, 'başta'); ek(h.ortada, 'ortada'); }
        ek(h.sonda, 'sonda');

        return bant(s) +
            '<div class="pn-ic pn-harfic">' +
                '<p class="pn-uste">Boya, sonra ' +
                    (h.baglanir ? 'dört' : 'iki') + ' hâline bak</p>' +
                '<div class="pn-buyukharf">' +
                    yolSvg(h.yalin, { kalinlik: esitKalinlik(h.yalin, 9, 900), sinif: 'pn-buyukyol' }) +
                '</div>' +
                '<div class="pn-haller">' + hucre.join('') + '</div>' +
                (h.baglanir ? '' :
                    '<p class="pn-uyari">Bu harf kendinden sonraki harfe bağlanmaz.</p>') +
                (h.ornek ? '<div class="pn-ornekkelime">' +
                    yolSvg(h.ornek, { kalinlik: esitKalinlik(h.ornek, 9, 1100), sinif: 'pn-ornekyol' }) +
                    '<span>' + esc(h.ornek.tr) + '</span></div>' : '') +
            '</div>' +
            altBant(s, '');
    }

    /* ==================================================================
       6) YAZMA ŞERİDİ — kesik çizgili harf, üzerinden geçilecek
       ================================================================== */
    function yazma(s) {
        var h = s.veri, i, j, sr = '';
        for (i = 0; i < 3; i++) {
            var hucre = '';
            for (j = 0; j < 6; j++) {
                /* kesik çizginin boyu da kelimeyle birlikte ölçeklenmeli,
                   yoksa geniş harflerde nokta nokta görünüyor */
                var o = esitKalinlik(h.yalin, 1, 900);
                hucre += '<span class="pn-yz">' +
                    yolSvg(h.yalin, {
                        kalinlik: esitKalinlik(h.yalin, 6, 900),
                        kesik: (26 * o).toFixed(0) + ' ' + (20 * o).toFixed(0),
                        cizgi: (i === 0 && j === 0) ? '#2A3242' : '#9AA6B6',
                        sinif: 'pn-yzyol'
                    }) + '</span>';
            }
            sr += '<div class="pn-yzsatir">' + hucre + '</div>';
        }
        for (i = 0; i < 2; i++) sr += '<div class="pn-yzsatir pn-bos"></div>';

        return bant(s) +
            '<div class="pn-ic pn-yazmaic">' +
                '<p class="pn-uste">Kesik çizgilerin üzerinden geç, sonra boş satırları sen doldur</p>' +
                '<div class="pn-yzalan">' + sr + '</div>' +
                (h.ornek ? '<div class="pn-ornekkelime">' +
                    yolSvg(h.ornek, {
                        kalinlik: esitKalinlik(h.ornek, 8, 1100),
                        kesik: (26 * esitKalinlik(h.ornek, 1, 1100)).toFixed(0) + ' ' +
                               (20 * esitKalinlik(h.ornek, 1, 1100)).toFixed(0),
                        cizgi: '#9AA6B6', sinif: 'pn-ornekyol' }) +
                    '<span>' + esc(h.ornek.tr) + '</span></div>' : '') +
            '</div>' +
            altBant(s, '');
    }

    /* ==================================================================
       7) HARF BAĞLANTI TABLOSU — 14 harf, dört hâl (iki sayfa)
       ================================================================== */
    function tablo(s) {
        var liste = s.veri;
        var bas = '<div class="pn-tbsat pn-tbbas"><span class="pn-tbad">Harf</span>' +
            '<span>yalın</span><span>başta</span><span>ortada</span><span>sonda</span></div>';
        var sr = liste.map(function (h) {
            function huc(y) {
                return '<span>' + (y ? yolSvg(y, { dolgu: '#2A3242', cizgi: 'none', kalinlik: 0, sinif: 'pn-tbyol' }) : '—') + '</span>';
            }
            return '<div class="pn-tbsat">' +
                '<span class="pn-tbad">' + esc(h.ad) + (h.lat ? ' <i>' + esc(h.lat) + '</i>' : '') + '</span>' +
                huc(h.yalin) + huc(h.basta) + huc(h.ortada) + huc(h.sonda) +
                '</div>';
        }).join('');
        return bant(s) +
            '<div class="pn-ic pn-tabloic">' +
                '<p class="pn-uste">Harfler bitişince biçim değiştirir</p>' +
                '<div class="pn-tablo">' + bas + sr + '</div>' +
            '</div>' +
            altBant(s, '');
    }

    return {
        afis: afis, agac: agac, ifade: ifade,
        hat: hat, harf: harf, yazma: yazma, tablo: tablo,
        yolSvg: yolSvg
    };
})();
