/* ============================================================
   HARF BİRLEŞTİRME  —  alfabe.html  "p5" sekmesi
   ------------------------------------------------------------
   NE İŞE YARAR: Öğrencinin elindeki PDF'in CEVAP SLAYTI'dır.
   Tahtaya yansıtılır, öğretmen adım adım ilerletir, çocuk kendi
   kâğıdına yazar. Bu yüzden ekranda yazma alanı, yazdırma tuşu
   ya da toplu ilerletme YOKTUR — burası sade bir sunum ekranıdır.

   OKUNURLUK KURALI (öğretmenin isteği)
     Ekranda AYNI ANDA EN FAZLA 4 örnek durur. 5. örneğe geçilince
     1. örnek yukarı doğru kayıp gider, 6. örneğe geçilince 2.
     örnek çıkar... Böylece GEÇ YAZAN öğrenci bir önceki soruları
     hâlâ görür ve kâğıdını tamamlayabilir. Geride kalan örnekler
     ÇÖZÜLMÜŞ (birleşik) hâlde bekler; cevap ekranda kalır.

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

   KUMANDA: tek bir "İleri" her şeyi sürer. Etkin örneğin adımları
   biter bitmez bir sonraki örneğe geçilir. Klavyede → / boşluk
   ileri, ← geri. Uzaktan kumandalı sunum tıklayıcıları da bu iki
   tuşu gönderdiği için tahtada kumandayla da çalışır.
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
    var PENCERE   = 4;                   /* ekranda aynı anda duran örnek sayısı */

    var aktif = 0;                       /* şu an işlenen örnek (0 tabanlı) */

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

    /* Bir örnek satırı. Yazma alanı YOK: burası cevap slaytı. */
    function satirHtml(sira) {
        var s   = SATIRLAR[sira];
        var c   = coz(s.h);
        var kay = c.map(function (x) {
            return '<span class="ab-kh ab-c-' + x.renk + '">' + kacis(x.harf) + '</span>';
        }).join('');
        var top = adimlar(c).length - 1;
        return '' +
        '<div class="ab-satir" data-sira="' + sira + '" data-adim="0" data-top="' + top + '">' +
        '  <div class="ab-bilgi">' +
        '    <span class="ab-no">' + (sira + 1) + '</span>' +
        '    <span class="ab-kaynak">' + kay + '</span>' +
        '  </div>' +
        '  <div class="ab-govde">' +
        '    <div class="ab-adim" data-rol="adim" title="Dokun → bir adım ilerle">' +
                 adimHtml([]) +
        '    </div>' +
        '    <div class="ab-anlam">' + kacis(s.anlam) + '</div>' +
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

    /* Alt kumanda şeridi: slaytı süren TEK yer. */
    function seritHtml() {
        return '' +
        '<div class="ab-serit">' +
        '  <button type="button" class="ab-nav ab-geri" data-yon="-1" title="Geri (← tuşu)">' +
        '    <i class="ab-ok ab-ok-sol"></i> Geri</button>' +
        '  <span class="ab-durum">' +
        '    <b class="ab-d-ornek">1 / ' + SATIRLAR.length + '</b>' +
        '    <span class="ab-d-adim">adım 0 / 0</span>' +
        '  </span>' +
        '  <button type="button" class="ab-nav ab-ileri" data-yon="1" title="İleri (→ ya da boşluk)">' +
        '    İleri <i class="ab-ok ab-ok-sag"></i></button>' +
        '</div>';
    }

    function listeHtml() {
        var cik = '', i;
        for (i = 0; i < SATIRLAR.length; i++) cik += satirHtml(i);
        return '<div class="ab-liste">' + cik + '</div>';
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
        satir.classList.toggle('ab-bitti', adim === top);
    }

    /* Görünür pencereyi çiz: [aktif-3 ... aktif] aralığı.
       Bu yüzden 5. örneğe geçince 1. örnek ekrandan çıkar. */
    function pencereYaz(kap) {
        var l = kap.querySelectorAll('.ab-satir');
        var bas = Math.max(0, aktif - (PENCERE - 1)), i;
        for (i = 0; i < l.length; i++) {
            l[i].classList.toggle('ab-gorunur', i >= bas && i <= aktif);
            l[i].classList.toggle('ab-aktif', i === aktif);
        }
    }

    function durumYaz(kap) {
        var l = kap.querySelectorAll('.ab-satir');
        var s = l[aktif];
        var adim = +s.getAttribute('data-adim'), top = +s.getAttribute('data-top');
        var o = kap.querySelector('.ab-d-ornek'); if (o) o.textContent = (aktif + 1) + ' / ' + l.length;
        var a = kap.querySelector('.ab-d-adim');  if (a) a.textContent = 'adım ' + adim + ' / ' + top;
        var g = kap.querySelector('.ab-geri');    if (g) g.disabled = (aktif === 0 && adim === 0);
        var il = kap.querySelector('.ab-ileri');
        if (il) il.disabled = (aktif === l.length - 1 && adim === top);
    }

    function ses() {
        if (typeof window.playClick === 'function') { try { window.playClick(); } catch (e) {} }
    }

    /* Tek kumanda: adımlar biterse KENDİLİĞİNDEN sonraki örneğe geçer. */
    function ilerle(kap, yon) {
        var l = kap.querySelectorAll('.ab-satir');
        if (!l.length) return;
        var s = l[aktif];
        var adim = +s.getAttribute('data-adim'), top = +s.getAttribute('data-top');

        if (yon > 0) {
            if (adim < top) {
                s.setAttribute('data-adim', adim + 1); adimYaz(s);
            } else if (aktif < l.length - 1) {
                /* Geride kalan örnek ÇÖZÜLMÜŞ hâlde bekler: geç yazan
                   öğrenci cevabı ekranda bulmaya devam etsin. */
                s.setAttribute('data-adim', top); adimYaz(s);
                aktif++;
                l[aktif].setAttribute('data-adim', 0); adimYaz(l[aktif]);
                pencereYaz(kap);
                girAnimasyon(l[aktif]);
            } else { return; }
        } else {
            if (adim > 0) {
                s.setAttribute('data-adim', adim - 1); adimYaz(s);
            } else if (aktif > 0) {
                aktif--;
                l[aktif].setAttribute('data-adim', +l[aktif].getAttribute('data-top'));
                adimYaz(l[aktif]);
                pencereYaz(kap);
            } else { return; }
        }
        durumYaz(kap);
        ses();
    }

    /* Yeni örnek aşağıdan yukarı kayarak gelir; üstteki örnek
       bu sırada ekrandan çıkmış olur — istenen "yukarı kayma" hissi. */
    function girAnimasyon(satir) {
        if (!satir) return;
        satir.classList.remove('ab-gir');
        /* sınıfı yeniden tetiklemek için bir kare bekle */
        void satir.offsetWidth;
        satir.classList.add('ab-gir');
        setTimeout(function () { satir.classList.remove('ab-gir'); }, 460);
    }

    /* --- 5) KURULUM --------------------------------------------- */
    var kuruldu = false;

    function kur() {
        var kap = document.getElementById('abSar');
        if (!kap || kuruldu) return;
        kuruldu = true;

        kap.innerHTML = anahtarHtml() + listeHtml() + seritHtml();

        var satirlar = kap.querySelectorAll('.ab-satir'), i;
        for (i = 0; i < satirlar.length; i++) adimYaz(satirlar[i]);
        aktif = 0;
        pencereYaz(kap);
        durumYaz(kap);

        kap.addEventListener('click', function (e) {
            var t = e.target;
            var nav = t.closest ? t.closest('.ab-nav') : null;
            if (nav) { if (!nav.disabled) ilerle(kap, +nav.getAttribute('data-yon')); return; }
            /* Yalnız ETKİN örneğin tahtasına dokunmak ilerletir;
               geride kalan çözülmüş örnekler yerinde durur. */
            var ad = t.closest ? t.closest('[data-rol="adim"]') : null;
            if (ad) {
                var sr = ad.closest('.ab-satir');
                if (sr && sr.classList.contains('ab-aktif')) ilerle(kap, 1);
            }
        });

        /* Klavye/sunum kumandası — yalnız bu sekme açıkken. */
        document.addEventListener('keydown', function (e) {
            var p5 = document.getElementById('p5');
            if (!p5 || !p5.classList.contains('active')) return;
            var hedef = e.target;
            if (hedef && /^(INPUT|TEXTAREA|SELECT)$/.test(hedef.tagName || '')) return;
            var k = e.key;
            if (k === 'ArrowRight' || k === ' ' || k === 'Spacebar' || k === 'PageDown' || k === 'Enter') {
                ilerle(kap, 1); e.preventDefault();
            } else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') {
                ilerle(kap, -1); e.preventDefault();
            }
        });
    }

    /* Sayfa hazır olunca kurulsun (sekme açılmasa da hafif bir iştir). */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', kur);
    } else { kur(); }

    /* olc(): eski sürümde tuval ölçüsünü ayarlardı. Yazma alanları
       kaldırıldı; dışarıdan çağrılırsa hata vermesin diye duruyor. */
    window.AlfabeBirlestir = {
        kur: kur, coz: coz, adimlar: adimlar, veri: SATIRLAR, olc: function () {}
    };
})();
