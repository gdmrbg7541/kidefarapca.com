/* ============================================================
   HARF BİRLEŞTİRME  —  alfabe.html  "p5" sekmesi
   ------------------------------------------------------------
   AMAÇ: Çocuk üç ayrı harfi görüp bunların tek kelime hâlinde
   nasıl birleştiğini ADIM ADIM izlesin; harfin RENGİ ona o
   harfin nasıl yazılacağını söylesin.

   RENK ANAHTARI (öğretmenin istediği kural)
     YEŞİL   → kelimenin BAŞINDA yazılan biçim      (لـ)
     MAVİ    → ORTADA yazılan biçim, iki yana bağlı (ـحـ)
     MOR     → SONDA yazılan biçim                  (ـق)
     KIRMIZI → kendinden SONRAKİ harfe BAĞLANMAZ    (ر و د ...)
     SİYAH   → bağlanmayan bir harften SONRA gelir,
               bu yüzden yalnız/başlangıç biçiminde yazılır (ج)

   ADIM DÜZENİ (öğretmenin ل ح ق örneği birebir uygulanır)
     0) boş        1) ل        2) لـ        3) لـ ح
     4) لـ ـحـ     5) لـ ـحـ ق  6) لـ ـحـ ـق  7) لحق
   Yani her harf için İKİ adım vardır: önce harf yalın gelir,
   sonra bulunduğu yere göre biçimini alır. En sonda hepsi
   birleşip gerçek kelime çıkar.

   SAYFA DÜZENİ: pdf çıktısı gibi beyaz kâğıtlar, her kâğıtta
   EN FAZLA 4 kelime satırı, dikey scroll. Her satırın SAĞINDA
   ve SOLUNDA öğrencinin kendi elyazısıyla birleştirip yazacağı
   çizgili alan var (ekranda parmak/kalem/fare ile yazılabilir,
   yazdırıldığında boş kutu olarak çıkar).
   ============================================================ */
(function () {
    'use strict';

    /* --- 1) VERİ ------------------------------------------------
       Harfler OKUMA sırasıyla (sağdan sola) yazıldı: ilk eleman
       kelimenin ilk harfidir. Karışıklık olmasın diye kelimeler
       tek metin değil, harf harf dizildi. */
    var SATIRLAR = [
        { h: ['ل', 'ح', 'ق'], anlam: 'yetişti'        },
        { h: ['ج', 'م', 'ل'], anlam: 'deve'           },
        { h: ['س', 'ر', 'ج'], anlam: 'eyer'           },
        { h: ['ح', 'م', 'ل'], anlam: 'taşıdı'         },
        { h: ['و', 'ح', 'ش'], anlam: 'yabani hayvan'  },
        { h: ['خ', 'م', 'س'], anlam: 'beş'            },
        { h: ['ن', 'س', 'خ'], anlam: 'kopya'          },
        { h: ['ص', 'ح', 'ف'], anlam: 'sayfalar'       },
        { h: ['ح', 'ص', 'ل'], anlam: 'elde etti'      },
        { h: ['م', 'ق', 'ص'], anlam: 'makas'          },
        { h: ['ض', 'ل', 'ع'], anlam: 'kaburga'        },
        { h: ['م', 'ض', 'ى'], anlam: 'geçti'          },
        { h: ['ب', 'ع', 'ض'], anlam: 'bazı'           },
        { h: ['ك', 'ث', 'ر'], anlam: 'çoğaldı'        },
        { h: ['ر', 'ك', 'ل'], anlam: 'tekmeledi'      },
        { h: ['س', 'م', 'ك'], anlam: 'balık'          },
        { h: ['ل', 'ح', 'م'], anlam: 'et'             },
        { h: ['ح', 'ل', 'ب'], anlam: 'süt sağdı'      },
        { h: ['أ', 'ك', 'ل'], anlam: 'yedi'           },
        { h: ['ن', 'و', 'م'], anlam: 'uyku'           }
    ];

    /* Kendinden SONRAKİ harfe bağlanmayan harfler.
       (Bunlar sadece sağdan bağlanır; soldan bağlanmaz.) */
    var BIRLESMEZ = 'اأإآٱدذرزوؤةىء';
    var TATVIL    = 'ـ';                 /* uzatma çizgisi U+0640 */
    var SAYFA_SATIR = 4;                 /* bir kâğıtta en fazla 4 kelime */

    /* --- 2) RENK ve BİÇİM MOTORU -------------------------------- */
    function bagliMi(harf) { return BIRLESMEZ.indexOf(harf) < 0; }

    /* Bir kelimenin her harfi için { biçim, renk } üretir. */
    function coz(harfler) {
        var n = harfler.length, cikti = [], i;
        for (i = 0; i < n; i++) {
            var h        = harfler[i];
            var ileriBag = (i < n - 1) && bagliMi(h);          /* sonrakine bağlanır mı */
            var geriBag  = (i > 0) && bagliMi(harfler[i - 1]); /* öncekinden bağlı gelir mi */
            var bicim    = (geriBag ? TATVIL : '') + h + (ileriBag ? TATVIL : '');
            var renk;
            if (!ileriBag && i < n - 1)  renk = 'kirmizi';  /* sonrakiyle birleşmiyor */
            else if (i === 0)            renk = 'yesil';    /* kelimenin başı */
            else if (!geriBag)           renk = 'siyah';    /* bağlanmayan harften sonra */
            else if (i === n - 1)        renk = 'mor';      /* kelimenin sonu */
            else                         renk = 'mavi';     /* iki yana bağlı orta */
            cikti.push({ harf: h, bicim: bicim, renk: renk, ileriBag: ileriBag, geriBag: geriBag });
        }
        return cikti;
    }

    /* Adım listesi: her harf için "yalın" ve "biçimli" iki adım,
       en sonda da birleşik kelime. 3 harf → 8 adım (0..7). */
    function adimlar(coz) {
        var n = coz.length, liste = [[]], i, j, a, b;
        for (i = 0; i < n; i++) {
            a = [];
            for (j = 0; j < i; j++) a.push({ t: coz[j].bicim, r: coz[j].renk });
            a.push({ t: coz[i].harf, r: coz[i].renk, yeni: true });
            liste.push(a);
            b = [];
            for (j = 0; j <= i; j++) b.push({ t: coz[j].bicim, r: coz[j].renk, yeni: j === i });
            liste.push(b);
        }
        liste.push(coz.map(function (c) { return { t: c.harf, r: c.renk, bitisik: true }; }));
        return liste;
    }

    /* --- 3) HTML ÜRETİMİ ---------------------------------------- */
    function kacis(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function adimHtml(parcalar) {
        if (!parcalar.length) return '<span class="ab-bos">•</span>';
        var bitisik = parcalar[0].bitisik, i, cik = [];
        for (i = 0; i < parcalar.length; i++) {
            cik.push('<span class="ab-p ab-c-' + parcalar[i].r +
                     (parcalar[i].yeni ? ' ab-yeni' : '') + '">' +
                     kacis(parcalar[i].t) + '</span>');
        }
        /* BİTİŞİK adımda parçalar arasında BOŞLUK YOK: tarayıcı
           harfleri gerçek kelime gibi birbirine bağlar. Ayrı
           adımlarda ise her parça inline-block olduğu için
           yan yana durur ama BİRLEŞMEZ (istediğimiz de bu). */
        return '<span class="ab-dizi' + (bitisik ? ' ab-bitisik' : '') + '">' +
               cik.join('') + '</span>';
    }

    function satirHtml(sira) {
        var s   = SATIRLAR[sira];
        var c   = coz(s.h);
        var kay = c.map(function (x) {
            return '<span class="ab-kh ab-c-' + x.renk + '">' + kacis(x.harf) + '</span>';
        }).join('');
        var top = adimlar(c).length - 1;
        return '' +
        '<div class="ab-satir" data-sira="' + sira + '" data-adim="0" data-top="' + top + '">' +
        '  <div class="ab-alan ab-sol">' +
        '    <canvas class="ab-cz"></canvas>' +
        '    <button type="button" class="ab-sil" data-sil="1" title="Bu alanı temizle">⌫</button>' +
        '  </div>' +
        '  <div class="ab-orta">' +
        '    <div class="ab-ust">' +
        '      <span class="ab-no">' + (sira + 1) + '</span>' +
        '      <span class="ab-kaynak">' + kay + '</span>' +
        '    </div>' +
        '    <div class="ab-adim" data-rol="adim" title="Dokun → bir adım ilerle">' +
                 adimHtml([]) +
        '    </div>' +
        '    <div class="ab-anlam">' + kacis(s.anlam) + '</div>' +
        '    <div class="ab-tus">' +
        '      <button type="button" class="ab-t ab-geri" data-yon="-1" title="Geri">' +
        '        <i class="ab-ok ab-ok-sol"></i></button>' +
        '      <span class="ab-say">0 / ' + top + '</span>' +
        '      <button type="button" class="ab-t ab-ileri" data-yon="1" title="İleri">' +
        '        İleri <i class="ab-ok ab-ok-sag"></i></button>' +
        '    </div>' +
        '  </div>' +
        '  <div class="ab-alan ab-sag">' +
        '    <canvas class="ab-cz"></canvas>' +
        '    <button type="button" class="ab-sil" data-sil="1" title="Bu alanı temizle">⌫</button>' +
        '  </div>' +
        '</div>';
    }

    function anahtarHtml() {
        return '' +
        '<div class="ab-anahtar">' +
        '  <b>Renk anahtarı:</b>' +
        '  <span class="ab-et ab-c-yesil">yeşil = başta yazılış</span>' +
        '  <span class="ab-et ab-c-mavi">mavi = ortada yazılış</span>' +
        '  <span class="ab-et ab-c-mor">mor = sonda yazılış</span>' +
        '  <span class="ab-et ab-c-kirmizi">kırmızı = sonrakine bağlanmaz</span>' +
        '  <span class="ab-et ab-c-siyah">siyah = bağlanmayan harften sonra</span>' +
        '</div>';
    }

    function aracHtml() {
        return '' +
        '<div class="ab-arac">' +
        '  <button type="button" class="ab-ar" data-is="tumu">Hepsini ilerlet <i class="ab-ok ab-ok-sag"></i></button>' +
        '  <button type="button" class="ab-ar" data-is="sifirla">↺ Adımları sıfırla</button>' +
        '  <button type="button" class="ab-ar" data-is="temizle">🧽 Yazıları sil</button>' +
        '  <button type="button" class="ab-ar ab-yaz-tus" data-is="yazma">✍️ Yazma: açık</button>' +
        '  <button type="button" class="ab-ar" data-is="yazdir">🖨️ Yazdır</button>' +
        '  <span class="ab-ipucu">Boş çalışma kâğıdı için önce <b>sıfırla</b>, sonra <b>yazdır</b>.</span>' +
        '</div>';
    }

    function kagitlarHtml() {
        var toplam = Math.ceil(SATIRLAR.length / SAYFA_SATIR), cik = '', s, i;
        for (s = 0; s < toplam; s++) {
            cik += '<section class="ab-kagit">' +
                   '  <header class="ab-kbas">' +
                   '    <span class="ab-kad">Harf Birleştirme</span>' +
                   '    <span class="ab-kbos">Adı Soyadı: ..............................' +
                   '      &nbsp;&nbsp; Sınıf: ..............</span>' +
                   '    <span class="ab-ksay">' + (s + 1) + ' / ' + toplam + '</span>' +
                   '  </header>';
            for (i = s * SAYFA_SATIR; i < Math.min((s + 1) * SAYFA_SATIR, SATIRLAR.length); i++) {
                cik += satirHtml(i);
            }
            cik += '  <footer class="ab-kalt">kidefarapca.com</footer>' +
                   '</section>';
        }
        return cik;
    }

    /* --- 4) ADIM MAKİNESİ --------------------------------------- */
    function adimYaz(satir) {
        var sira = +satir.getAttribute('data-sira');
        var adim = +satir.getAttribute('data-adim');
        var liste = adimlar(coz(SATIRLAR[sira].h));
        var top  = liste.length - 1;
        if (adim < 0) adim = 0;
        if (adim > top) adim = top;
        satir.setAttribute('data-adim', adim);
        satir.querySelector('[data-rol="adim"]').innerHTML = adimHtml(liste[adim]);
        satir.querySelector('.ab-say').textContent = adim + ' / ' + top;
        satir.classList.toggle('ab-bitti', adim === top);
        satir.querySelector('.ab-geri').disabled  = (adim === 0);
        satir.querySelector('.ab-ileri').disabled = (adim === top);
    }

    function ilerlet(satir, yon) {
        satir.setAttribute('data-adim', (+satir.getAttribute('data-adim') || 0) + yon);
        adimYaz(satir);
        if (typeof window.playClick === 'function') { try { window.playClick(); } catch (e) {} }
    }

    /* --- 5) YAZI ALANLARI (parmak / kalem / fare) ---------------- */
    var yazmaAcik = true;

    function olcuAyarla(cv) {
        var kutu = cv.parentNode, r = kutu.getBoundingClientRect();
        if (!r.width || !r.height) return false;
        var o = Math.min(window.devicePixelRatio || 1, 2);
        var w = Math.round(r.width * o), h = Math.round(r.height * o);
        if (cv.width === w && cv.height === h) return true;
        var eski = null;
        if (cv.width > 1 && cv.height > 1) {
            eski = document.createElement('canvas');
            eski.width = cv.width; eski.height = cv.height;
            eski.getContext('2d').drawImage(cv, 0, 0);
        }
        cv.width = w; cv.height = h;
        var c = cv.getContext('2d');
        c.setTransform(o, 0, 0, o, 0, 0);
        c.lineWidth = 3; c.lineCap = 'round'; c.lineJoin = 'round';
        c.strokeStyle = '#1e293b'; c.fillStyle = '#1e293b';
        if (eski) c.drawImage(eski, 0, 0, r.width, r.height);
        return true;
    }

    function tumOlcu() {
        var l = document.querySelectorAll('#p5 .ab-cz'), i;
        for (i = 0; i < l.length; i++) olcuAyarla(l[i]);
    }

    function cizKur(cv) {
        var ciz = false, sx = 0, sy = 0;
        function yer(e) {
            var r = cv.getBoundingClientRect();
            return { x: e.clientX - r.left, y: e.clientY - r.top };
        }
        cv.addEventListener('pointerdown', function (e) {
            /* Parmakla sayfayı kaydırmak isteyen çocuğu engellemeyelim:
               dokunmatikte yalnız "yazma modu" açıkken çizeriz. */
            if (e.pointerType === 'touch' && !yazmaAcik) return;
            olcuAyarla(cv);
            var c = cv.getContext('2d'), p = yer(e);
            ciz = true; sx = p.x; sy = p.y;
            try { cv.setPointerCapture(e.pointerId); } catch (h) {}
            c.beginPath(); c.arc(p.x, p.y, c.lineWidth / 2, 0, 6.2832); c.fill();
            e.preventDefault();
        });
        cv.addEventListener('pointermove', function (e) {
            if (!ciz) return;
            var c = cv.getContext('2d'), p = yer(e);
            c.beginPath(); c.moveTo(sx, sy); c.lineTo(p.x, p.y); c.stroke();
            sx = p.x; sy = p.y;
            e.preventDefault();
        });
        function bitir() { ciz = false; }
        cv.addEventListener('pointerup', bitir);
        cv.addEventListener('pointercancel', bitir);
        cv.addEventListener('pointerleave', bitir);
    }

    function alanSil(cv) {
        var c = cv.getContext('2d');
        c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
        c.clearRect(0, 0, cv.width, cv.height); c.restore();
    }

    /* --- 6) KURULUM --------------------------------------------- */
    var kuruldu = false;

    function kur() {
        var kap = document.getElementById('abSar');
        if (!kap || kuruldu) return;
        kuruldu = true;

        kap.innerHTML = aracHtml() + anahtarHtml() + kagitlarHtml();

        var satirlar = kap.querySelectorAll('.ab-satir'), i;
        for (i = 0; i < satirlar.length; i++) adimYaz(satirlar[i]);

        var tuvaller = kap.querySelectorAll('.ab-cz');
        for (i = 0; i < tuvaller.length; i++) cizKur(tuvaller[i]);

        /* Dokunmatik cihazda yazma modu kapalı başlar ki sayfa
           parmakla rahat kaydırılsın; fare/kalem her hâlükârda yazar. */
        try {
            if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) yazmaAcik = false;
        } catch (e) {}
        yazmaGuncelle(kap);

        kap.addEventListener('click', function (e) {
            var t = e.target;
            var ar = t.closest ? t.closest('.ab-ar') : null;
            if (ar) { arac(kap, ar.getAttribute('data-is')); return; }
            var sil = t.closest ? t.closest('.ab-sil') : null;
            if (sil) { alanSil(sil.parentNode.querySelector('.ab-cz')); return; }
            var tus = t.closest ? t.closest('.ab-t') : null;
            if (tus) { ilerlet(tus.closest('.ab-satir'), +tus.getAttribute('data-yon')); return; }
            var ad = t.closest ? t.closest('[data-rol="adim"]') : null;
            if (ad) {
                var sr = ad.closest('.ab-satir');
                var son = (+sr.getAttribute('data-adim') === +sr.getAttribute('data-top'));
                ilerlet(sr, son ? -(+sr.getAttribute('data-top')) : 1);   /* sondaysa başa dön */
            }
        });

        if (window.MutationObserver) {
            var p5 = document.getElementById('p5');
            if (p5) new MutationObserver(function () {
                if (p5.classList.contains('active')) setTimeout(tumOlcu, 80);
            }).observe(p5, { attributes: true, attributeFilter: ['class'] });
        }
        var zaman = null;
        window.addEventListener('resize', function () {
            clearTimeout(zaman); zaman = setTimeout(tumOlcu, 220);
        });
        setTimeout(tumOlcu, 120);
    }

    function yazmaGuncelle(kap) {
        kap.classList.toggle('ab-yaz-kapali', !yazmaAcik);
        var b = kap.querySelector('.ab-yaz-tus');
        if (b) b.textContent = '✍️ Yazma: ' + (yazmaAcik ? 'açık' : 'kapalı');
    }

    function arac(kap, is) {
        var l, i;
        if (is === 'tumu') {
            l = kap.querySelectorAll('.ab-satir');
            for (i = 0; i < l.length; i++) {
                l[i].setAttribute('data-adim', (+l[i].getAttribute('data-adim') || 0) + 1);
                adimYaz(l[i]);
            }
        } else if (is === 'sifirla') {
            l = kap.querySelectorAll('.ab-satir');
            for (i = 0; i < l.length; i++) { l[i].setAttribute('data-adim', 0); adimYaz(l[i]); }
        } else if (is === 'temizle') {
            l = kap.querySelectorAll('.ab-cz');
            for (i = 0; i < l.length; i++) alanSil(l[i]);
        } else if (is === 'yazma') {
            yazmaAcik = !yazmaAcik; yazmaGuncelle(kap);
        } else if (is === 'yazdir') {
            tumOlcu(); window.print(); return;
        }
        if (typeof window.playClick === 'function') { try { window.playClick(); } catch (e) {} }
    }

    /* Sayfa hazır olunca kurulsun (sekme açılmasa da hafif bir iştir). */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', kur);
    } else { kur(); }

    window.AlfabeBirlestir = { kur: kur, coz: coz, adimlar: adimlar, veri: SATIRLAR, olc: tumOlcu };
})();
