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

    /* ---------- tezhip çerçevesi ----------
       Klasik kenar süsü: çift çerçeve, köşe gülleri ve kenarlarda
       tekrar eden küçük baklava dilimleri. Hepsi kontur — öğrenci
       çerçeveyi de boyayabiliyor. */
    function tezhip(renk) {
        var g = '', i, n = 9, en = 1000, boy = 1000, ic = 78, d = 46;
        for (i = 0; i <= n; i++) {
            var t = ic + (en - 2 * ic) * (i / n);
            g += '<path d="M' + t + ' ' + (ic - 17) + ' l' + d / 2 + ' ' + d / 2 +
                 ' l-' + d / 2 + ' ' + d / 2 + ' l-' + d / 2 + ' -' + d / 2 + ' Z"/>';
            g += '<path d="M' + t + ' ' + (boy - ic + 17) + ' l' + d / 2 + ' ' + d / 2 +
                 ' l-' + d / 2 + ' ' + d / 2 + ' l-' + d / 2 + ' -' + d / 2 + ' Z"/>';
        }
        for (i = 1; i < n; i++) {
            var u = ic + (boy - 2 * ic) * (i / n);
            g += '<circle cx="' + (ic - 17) + '" cy="' + u + '" r="' + d / 2.6 + '"/>';
            g += '<circle cx="' + (en - ic + 17) + '" cy="' + u + '" r="' + d / 2.6 + '"/>';
        }
        /* köşe gülleri */
        [[ic, ic], [en - ic, ic], [ic, boy - ic], [en - ic, boy - ic]].forEach(function (c) {
            g += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="34"/>';
            g += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="17"/>';
        });
        return '<svg class="pn-tezhip" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">' +
            '<g fill="none" stroke="' + renk + '" stroke-width="7">' +
            '<rect x="30" y="30" width="940" height="940" rx="26"/>' +
            '<rect x="' + ic + '" y="' + ic + '" width="' + (en - 2 * ic) + '" height="' + (boy - 2 * ic) + '" rx="14"/>' +
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
                    yolSvg(k, { sinif: 'pn-hatyol', kalinlik: 9 }) +
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
            hucre.push('<div class="pn-hal">' + yolSvg(y, { kalinlik: 11, sinif: 'pn-halyol' }) +
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
                    yolSvg(h.yalin, { kalinlik: 8, sinif: 'pn-buyukyol' }) +
                '</div>' +
                '<div class="pn-haller">' + hucre.join('') + '</div>' +
                (h.baglanir ? '' :
                    '<p class="pn-uyari">Bu harf kendinden sonraki harfe bağlanmaz.</p>') +
                (h.ornek ? '<div class="pn-ornekkelime">' +
                    yolSvg(h.ornek, { kalinlik: 10, sinif: 'pn-ornekyol' }) +
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
                hucre += '<span class="pn-yz">' +
                    yolSvg(h.yalin, {
                        kalinlik: 7, kesik: '26 20',
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
                    yolSvg(h.ornek, { kalinlik: 9, kesik: '26 20', cizgi: '#9AA6B6', sinif: 'pn-ornekyol' }) +
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
