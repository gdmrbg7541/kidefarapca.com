/* =====================================================================
   ALFABE — TELEFON DÜZENİ (17.10.2026)
   Öğretmen: "alfabe html'nin harflerin yazılış animasyonu başta olmak
   üzere tam olarak mobile uyarla".

   HARF TABLOSU: bilgisayarda 7 sütun x 4 satır labirent. Telefonda (dikey,
   en çok 600px) aynı labirent 4 sütun x 7 satır kurulur: 1 sağ üstte,
   sıra yılan gibi iner (1-4 sağdan sola, 5-8 soldan sağa, ...), 28 sol
   altta çıkar. Yan yana kaydırma gerekmez; 28 harfin hepsi aşağı doğru
   kayarak görülür ve kartlar iki kat büyük olur.

   Hücreler YENİDEN ÇİZİLMEZ: alfabe.js'in kurduğu 28 hücre (kartları,
   tıklama işleri, yazılış animasyonu) olduğu gibi yeni satırlara taşınır.
   Diziliş (aileler) düğmesi 4 sütuna göre paketler; duvarlar 4 sütunluk
   labirente göre çizilir. Ekran genişleyince (telefon yan çevrilince)
   tablo yeniden 7 sütuna döner — bilgisayardaki görünüm hiç değişmez.
   ===================================================================== */
(function () {
    'use strict';
    if (window.alfabeMobil) return;
    var mq = window.matchMedia ? window.matchMedia('(max-width: 600px)') : null;
    if (!mq || typeof ui === 'undefined') return;

    var MASA = { SUTUN: 7, SATIR: 4 };
    var TEL = { SUTUN: 4, SATIR: 7 };
    /* 4 sütunluk labirentin duvarları (TABLO_KENAR'ın telefon karşılığı) */
    var TEL_KENAR = [
        { n: '1-3',   kenar: 'alt', durum: 'cizgi' },   /* 4'ün altı açık  -> 4'ten 5'e iner   */
        { n: '5-7',   kenar: 'alt', durum: 'cizgi' },   /* 8'in altı açık  -> 8'den 9'a iner   */
        { n: '9-11',  kenar: 'alt', durum: 'cizgi' },   /* 12 -> 13 */
        { n: '13-15', kenar: 'alt', durum: 'cizgi' },   /* 16 -> 17 */
        { n: '17-19', kenar: 'alt', durum: 'cizgi' },   /* 20 -> 21 */
        { n: '21-23', kenar: 'alt', durum: 'cizgi' },   /* 24 -> 25 */
        { n: '1-4',   kenar: 'ust', durum: 'cizgi' },   /* üst kenar */
        { n: '25-28', kenar: 'alt', durum: 'cizgi' },   /* alt kenar */
        { n: '4,5,12,13,20,21', kenar: 'sol', durum: 'cizgi' },  /* sol kenar — 28 (çıkış) açık */
        { n: '8,9,16,17,24,25', kenar: 'sag', durum: 'cizgi' }   /* sağ kenar — 1 (giriş) açık  */
    ];
    var simdiki = null;

    function sayilar(n) {
        if (typeof kenarNumaralari === 'function') return kenarNumaralari(n);
        var c = [];
        String(n).split(',').forEach(function (p) {
            var m = p.trim().match(/^(\d+)\s*-\s*(\d+)$/);
            if (!m) { if (p.trim()) c.push(+p.trim()); return; }
            for (var i = +m[1]; i <= +m[2]; i++) c.push(i);
        });
        return c;
    }
    /* alfabe.js'teki tabloKenarlariUygula'nın boyutlu hâli */
    function duvarlariCiz(t, b, liste) {
        var hucre = function (r, c) { return t.querySelector('.ht-cell[data-r="' + r + '"][data-c="' + c + '"]'); };
        var yer = function (n) {
            var i = n - 1, r = Math.floor(i / b.SUTUN), s = i % b.SUTUN;
            return { r: r, c: (r % 2 === 0) ? s : b.SUTUN - 1 - s };
        };
        liste.forEach(function (k) {
            sayilar(k.n).forEach(function (n) {
                var p = yer(n), el = null, yon = null;
                if (k.kenar === 'ust') { el = hucre(p.r, p.c); yon = 'ust'; }
                else if (k.kenar === 'alt') {
                    if (p.r < b.SATIR - 1) { el = hucre(p.r + 1, p.c); yon = 'ust'; }
                    else { el = hucre(p.r, p.c); yon = 'alt'; }
                }
                else if (k.kenar === 'sag') { el = hucre(p.r, p.c); yon = 'sag'; }
                else if (k.kenar === 'sol') {
                    if (p.c < b.SUTUN - 1) { el = hucre(p.r, p.c + 1); yon = 'sag'; }
                    else { el = hucre(p.r, p.c); yon = 'sol'; }
                }
                if (!el) return;
                String(k.durum).trim().split(/\s+/).forEach(function (d) { if (d) el.classList.add('k-' + yon + '-' + d); });
            });
        });
    }

    function duzenle(zorla) {
        var hedef = mq.matches ? 'tel' : 'masa';
        var t = document.querySelector('#g1 .harf-tablo');
        if (!t || !t.tBodies[0]) return;
        var b = hedef === 'tel' ? TEL : MASA;
        var hucreler = Array.prototype.slice.call(t.querySelectorAll('td.ht-cell'));
        if (hucreler.length !== b.SUTUN * b.SATIR) return;
        var ilkSatir = t.tBodies[0].rows[0];
        var suAnki = (ilkSatir && ilkSatir.cells.length === TEL.SUTUN) ? 'tel' : 'masa';
        /* bilgisayarda tabloya hiç dokunulmaz */
        if (hedef === 'masa' && suAnki === 'masa' && !t.classList.contains('t4')) { simdiki = 'masa'; return; }
        if (!zorla && suAnki === hedef && simdiki === hedef) return;

        if (typeof dizilis !== 'undefined') { try { dizilis.dur(); } catch (e) { } }
        var noIle = {};
        hucreler.forEach(function (td) { noIle[td.getAttribute('data-n')] = td; });
        if (suAnki !== hedef) {
            var govde = document.createElement('tbody');
            for (var r = 0; r < b.SATIR; r++) {
                var tr = document.createElement('tr');
                for (var c = 0; c < b.SUTUN; c++) {
                    var n = (r % 2 === 0) ? r * b.SUTUN + c + 1 : r * b.SUTUN + (b.SUTUN - c);
                    var td = noIle[n];
                    if (!td) return;
                    td.setAttribute('data-r', r);
                    td.setAttribute('data-c', c);
                    td.classList.toggle('ht-son-satir', r === b.SATIR - 1);
                    td.classList.toggle('ht-son-sutun', c === b.SUTUN - 1);
                    tr.appendChild(td);
                }
                govde.appendChild(tr);
            }
            t.replaceChild(govde, t.tBodies[0]);
        }
        t.classList.toggle('t4', hedef === 'tel');
        /* duvarlar: eski kenar sınıfları silinir, yeni boyuta göre çizilir */
        hucreler.forEach(function (td) {
            Array.prototype.slice.call(td.classList).forEach(function (s) {
                if (/^k-(ust|alt|sag|sol)-/.test(s)) td.classList.remove(s);
            });
        });
        if (hedef === 'tel') duvarlariCiz(t, TEL, TEL_KENAR);
        else if (typeof tabloKenarlariUygula === 'function') tabloKenarlariUygula();
        else if (typeof TABLO_KENAR !== 'undefined') duvarlariCiz(t, MASA, TABLO_KENAR);

        if (typeof dizilis !== 'undefined') {
            dizilis.SUTUN = b.SUTUN;
            dizilis.SATIR = b.SATIR;
            /* kartları (alfabetik ya da aile dizilişinde) yeni hücrelerine oturt */
            try { dizilis.uygula(false); } catch (e) { }
        }
        simdiki = hedef;
        if (typeof harfGrid !== 'undefined' && harfGrid.layout) {
            requestAnimationFrame(function () { requestAnimationFrame(function () { try { harfGrid.layout(); } catch (e) { } }); });
        }
    }

    /* tablo yeniden kurulursa (ui.init) telefon düzeni yeniden uygulanır */
    var asilInit = ui.init;
    ui.init = function () {
        var s = asilInit.apply(this, arguments);
        simdiki = null;
        duzenle(true);
        return s;
    };
    if (mq.addEventListener) mq.addEventListener('change', function () { duzenle(); });
    else if (mq.addListener) mq.addListener(function () { duzenle(); });
    duzenle(true);

    window.alfabeMobil = { duzenle: duzenle, tel: function () { return simdiki === 'tel'; } };
})();
