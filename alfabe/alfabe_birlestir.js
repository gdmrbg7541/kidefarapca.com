/* ============================================================
   HARF BİRLEŞTİRME  —  alfabe.html  "p5" sekmesi
   ------------------------------------------------------------
   NE İŞE YARAR: Öğrencinin elindeki PDF'in CEVAP SLAYTI'dır.
   Tahtaya yansıtılır, öğretmen adım adım ilerletir, çocuk kendi
   kâğıdına yazar. Ekranda yazma alanı ya da yazdırma tuşu YOKTUR.

   EKRAN İKİYE BÖLÜNÜR
     SOLDA  : 4 sütunlu HARF TABLOSU. Sütunlar sağdan sola
              başta(yeşil) · ortada(mavi) · sonda(mor) · yalın(siyah).
              Kendinden sonrakiyle birleşmeyen harfler (ا د ذ ر ز و …)
              KIRMIZI yazılır. Tablo dikey kaydırılır; bir harfe
              dokunulunca Harf Tanıtımı'ndaki büyüteç açılır ve harfin
              nasıl yazıldığı animasyonla gösterilir (harfDetay).
              Başlığa basılınca tablo katlanır, liste tüm genişliği alır.
     SAĞDA  : soruların TAMAMI bir liste hâlinde. Her satırda solda
              adım tahtası (kelime burada kurulur), ortada harflerin
              AYRIK hâli, SAĞDA sıra numarası. İki alanda da harfler
              AYNI ve BÜYÜK puntodadır ve YAZI ÇİZGİSİ üstünde durur;
              "İleri" bastıkça harfler çizginin üstünde belirir.

   RENK ANAHTARI (öğretmenin istediği kural)
     YEŞİL   → BAŞTA yazılan biçim: yeni bir bağlantı kümesi
               başlatır (لـ). Kelimenin ilk harfi olmak ZORUNDA
               DEĞİLDİR — bağlanmayan bir harften sonra gelip
               kendisi sonrakine bağlanıyorsa o da yeşildir:
               و ح ش  →  و kırmızı, حـ YEŞİL, ـش mor
     MAVİ    → ORTADA yazılan biçim, iki yana bağlı (ـحـ)
     MOR     → SONDA yazılan biçim, öncekinden bağlı (ـق)
     KIRMIZI → kendinden SONRAKİ harfe BAĞLANMAZ    (ر و د ...)
     SİYAH   → iki yandan da bağlanmaz, YALNIZ yazılır (ج)

   ADIM DÜZENİ (öğretmenin ل ح ق örneği birebir uygulanır)
     0) boş        1) ل        2) لـ        3) لـ ح
     4) لـ ـحـ     5) لـ ـحـ ق  6) لـ ـحـ ـق  7) لحق
   Yani her harf için İKİ adım vardır: önce harf yalın gelir,
   sonra bulunduğu yere göre biçimini alır. En sonda hepsi
   birleşip gerçek kelime çıkar.
   İSTİSNA: harf bulunduğu yerde ZATEN yalın yazılıyorsa (kaşide
   almıyorsa) ikinci adım aynı şeyi tekrar edeceği için atlanır —
   bir kez belirmesi yeter.

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
            /* RENK KURALI — harfin GERÇEKTEN hangi biçimde yazıldığına bakar:
                 kirmizi : kendinden sonrakine BAĞLANMAZ (son harf değilse)
                 siyah   : iki yandan da bağlanmaz, YALNIZ yazılır
                 yesil   : yeni bir bağlantı kümesi BAŞLATIR (baştaki biçim).
                           Bu, kelimenin ilk harfi olabileceği gibi, bağlanmayan
                           bir harften SONRA gelip kendisi sonrakine bağlanan
                           harf de olabilir: و ح ش → و kırmızı, ح YEŞİL, ش mor.
                 mor     : kümenin SONUNDA, öncekinden bağlı
                 mavi    : iki yana da bağlı ORTA harf                       */
            if (!ileriBag && i < n - 1)        renk = 'kirmizi';
            else if (!geriBag && !ileriBag)    renk = 'siyah';
            else if (!geriBag)                 renk = 'yesil';
            else if (i === n - 1)              renk = 'mor';
            else                               renk = 'mavi';
            cikti.push({ harf: h, bicim: bicim, renk: renk, ileriBag: ileriBag, geriBag: geriBag });
        }
        return cikti;
    }

    /* Adım listesi: her harf için "yalın" ve "biçimli" iki adım,
       en sonda da birleşik kelime. 3 harf → 8 adım (0..7).

       İSTİSNA — NORMAL (YALIN) YAZILAN HARF:
       Harfin bulunduğu yerdeki biçimi yalın hâlinin AYNISIYSA (yani ne
       sağdan ne soldan bağlantı çizgisi/kaşide almıyorsa) ikinci adım
       birebir aynı şeyi gösteriyordu: harf bir kez beliriyor, sonra
       "değişiyormuş" gibi yeniden beliriyordu. Böyle harflerde TEK adım
       yeter — çizgili bir hâle dönüşmüyorlar.
       Örnek: و ح ش → و zaten yalın yazılır, tek adımda gelir. */
    function adimlar(coz) {
        var n = coz.length, liste = [[]], i, j, a, b;
        for (i = 0; i < n; i++) {
            a = [];
            for (j = 0; j < i; j++) a.push({ t: coz[j].bicim, r: coz[j].renk });
            a.push({ t: coz[i].harf, r: coz[i].renk, yeni: true });
            liste.push(a);
            if (coz[i].bicim === coz[i].harf) continue;   /* yalın kalıyor → 2. adım gereksiz */
            b = [];
            /* DİKKAT: burada "yeni" değil "donusum" işaretlenir. Harf zaten
               ekranda; yalnız biçim değiştiriyor (س → سـ). "yeni" olsaydı
               belirme animasyonu tekrar oynar, harf kaybolup yeniden
               görünürdü — süreklilik bozuluyordu. */
            for (j = 0; j <= i; j++) b.push({ t: coz[j].bicim, r: coz[j].renk, donusum: j === i });
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
        if (!parcalar.length) return '<span class="ab-dizi ab-bos-dizi"></span>';
        var bitisik = parcalar[0].bitisik, i, cik = [];
        for (i = 0; i < parcalar.length; i++) {
            cik.push('<span class="ab-p ab-c-' + parcalar[i].r +
                     (parcalar[i].yeni ? ' ab-yeni' : '') +
                     (parcalar[i].donusum ? ' ab-donusum' : '') + '">' +
                     kacis(parcalar[i].t) + '</span>');
        }
        /* BİTİŞİK adımda parçalar arasında BOŞLUK YOK: tarayıcı
           harfleri gerçek kelime gibi birbirine bağlar. Ayrı
           adımlarda ise her parça inline-block olduğu için
           yan yana durur ama BİRLEŞMEZ (istediğimiz de bu). */
        return '<span class="ab-dizi' + (bitisik ? ' ab-bitisik' : '') + '">' +
               cik.join('') + '</span>';
    }

    /* Bir örnek satırı.
       DİZİLİM (soldan sağa): [adım tahtası] [ayrık harfler] [sıra no]
       İki alan da YAZI ÇİZGİSİ üstünde ve AYNI puntoda. */
    function satirHtml(sira) {
        var s   = SATIRLAR[sira];
        var c   = coz(s.h);
        var kay = c.map(function (x) {
            return '<span class="ab-kh ab-c-' + x.renk + '">' + kacis(x.harf) + '</span>';
        }).join('');
        var top = adimlar(c).length - 1;
        return '' +
        '<div class="ab-satir" data-sira="' + sira + '" data-adim="0" data-top="' + top + '">' +
        '  <div class="ab-tahta ab-cizgili" data-rol="adim" title="Dokun → bir adım ilerle">' +
                 adimHtml([]) +
        '  </div>' +
        '  <div class="ab-kaynak ab-cizgili" title="Harflerin birleşmemiş hâli">' + kay + '</div>' +
        '  <div class="ab-sag">' +
        '    <span class="ab-no">' + (sira + 1) + '</span>' +
        '    <span class="ab-anlam">' + kacis(s.anlam) + '</span>' +
        '  </div>' +
        '</div>';
    }

    /* --- 3b) SOLDAKİ 4 SÜTUNLU HARF TABLOSU ---------------------
       Sütunlar SAĞDAN SOLA: başta(yeşil) · ortada(mavi) · sonda(mor)
       · yalın(siyah). Kendinden sonrakiyle birleşmeyen harfler tüm
       biçimlerinde KIRMIZI gösterilir. Bir satıra dokununca Harf
       Tanıtımı'ndaki büyüteç açılır: harfin büyük hâli ve yazılış
       animasyonu (harfDetay.open). */
    function tabloHtml() {
        if (typeof harfler === 'undefined' || !harfler.length) return '';
        var sut = [
            { a: 'n', ad: 'Yalın',  renk: 'siyah' },
            { a: 's', ad: 'Sonda',  renk: 'mor'   },
            { a: 'o', ad: 'Ortada', renk: 'mavi'  },
            { a: 'b', ad: 'Başta',  renk: 'yesil' }
        ];

        /* Aç/kapa düğmesinde YAZI YOK: büyük, canlı bir simge var. Simge
           küçük bir harf tablosudur — dört sütun, yazı çizgisi ve dört
           renkte ش biçimleri sırayla belirir. */
        var simge =
        '<svg class="ab-tb-svg" viewBox="0 0 60 48" aria-hidden="true" focusable="false">' +
        '  <rect x="2" y="3" width="56" height="42" rx="6" fill="#F7FAFC" stroke="#0E6655" stroke-width="2.2"/>' +
        '  <path d="M2 13h56" stroke="#0E6655" stroke-width="1.8"/>' +
        '  <path d="M16 13v32M30 13v32M44 13v32" stroke="#D6E4EC" stroke-width="1.4"/>' +
        '  <path d="M5 34h50" stroke="#CBD5E1" stroke-width="1.6" stroke-linecap="round"/>' +
        '  <circle cx="8"  cy="8" r="1.7" fill="#111827"/>' +
        '  <circle cx="23" cy="8" r="1.7" fill="#9333ea"/>' +
        '  <circle cx="37" cy="8" r="1.7" fill="#2563eb"/>' +
        '  <circle cx="51" cy="8" r="1.7" fill="#16a34a"/>' +
        '  <g class="tbs-h tbs-1"><text x="9"  y="34" fill="#111827">ش</text></g>' +
        '  <g class="tbs-h tbs-2"><text x="23" y="34" fill="#9333ea">ـش</text></g>' +
        '  <g class="tbs-h tbs-3"><text x="37" y="34" fill="#2563eb">ـشـ</text></g>' +
        '  <g class="tbs-h tbs-4"><text x="51" y="34" fill="#16a34a">شـ</text></g>' +
        '</svg>';

        /* BAŞLIK SATIRI: simge düğmesi ve dört sütun başlığı AYNI SATIRDA
           ve gövdeyle AYNI ızgarada — başlıklar sütunlarının tam üstünde
           durur. Tablo katlanınca başlıklar gizlenir, yalnız simge kalır. */
        var bas =
        '<div class="ab-tb-baslik">' +
        '  <button type="button" class="ab-tb-ust" data-rol="tb-kapa"' +
        '          title="Harf tablosu — aç / kapat" aria-label="Harf tablosu — aç / kapat"' +
        '          aria-expanded="true">' + simge +
        '    <span class="ab-tb-ok" aria-hidden="true"></span>' +
        '  </button>' +
        sut.map(function (x) {
            return '<span class="ab-tb-bs ab-c-' + x.renk + '">' + x.ad + '</span>';
        }).join('') +
        '</div>';

        var govde = harfler.map(function (h, i) {
            var kirmizi = !!h.nobind;                 /* sonrakiyle birleşmez */
            var hucre = sut.map(function (x) {
                var yazi = (x.a === 'n') ? h.h : h[x.a];
                var r = kirmizi ? 'kirmizi' : x.renk;
                return '<span class="ab-tb-h ab-c-' + r + '">' + kacis(yazi) + '</span>';
            }).join('');
            return '<button type="button" class="ab-tb-satir' + (kirmizi ? ' ab-tb-kirmizi' : '') +
                   '" data-idx="' + i + '" title="' + kacis(h.tr) +
                   ' — büyük hâli ve yazılış animasyonu için dokun">' +
                   '<span class="ab-tb-ad"><b>' + (i + 1) + '</b>' + kacis(h.tr) + '</span>' +
                   hucre + '</button>';
        }).join('');

        return '' +
        '<aside class="ab-tablo">' + bas +
        '  <div class="ab-tb-ic">' +
        '    <div class="ab-tb-kaydir"><div class="ab-tb-govde">' + govde + '</div></div>' +
        '  </div>' +
        '</aside>';
    }

    /* --- 3c) ETKİN KELİMENİN HARFLERİNİ TABLONUN ÜSTÜNE TAŞI --------
       Sıra hangi kelimedeyse o kelimenin harfleri soldaki tablonun EN
       ÜSTÜNE süzülür; sonraki soruya geçilince bu sefer onun harfleri
       yukarı gelir. Böylece çocuk aradığı harfi tablonun içinde
       aramıyor, hazır önünde buluyor.

       ANİMASYON: kaliplartablosu.html'deki bâb odağıyla (babodak.js)
       AYNI teknik — FLIP. Önce satırların ekrandaki ESKİ konumu
       ölçülür, DOM'da sıra değiştirilir, aradaki fark translateY ile
       geri uygulanır ve 1 saniyede sıfıra süzülür. Satırlar yerlerine
       kayarak gider, zıplamaz. */

    /* Kelimelerde geçen hemzeli/eş biçimler tablodaki temel harfe eşlenir. */
    var ESLE = { 'أ':'ا', 'إ':'ا', 'آ':'ا', 'ٱ':'ا', 'ى':'ي', 'ئ':'ي', 'ة':'ه', 'ؤ':'و' };
    function temel(h) { return ESLE[h] || h; }

    var sonKelime = null;

    function tabloSirala(kap, harfDizi, animasyonlu) {
        var govde = kap.querySelector('.ab-tb-govde');
        var kaydir = kap.querySelector('.ab-tb-kaydir');
        if (!govde || typeof harfler === 'undefined') return;

        var istenen = harfDizi.map(temel);
        var anahtar = istenen.join('');
        if (anahtar === sonKelime) return;         /* aynı kelime → boşuna oynatma */
        sonKelime = anahtar;

        var satirlar = [].slice.call(govde.children);
        /* FLIP 1: eski konumlar */
        var eski = satirlar.map(function (r) { return r.getBoundingClientRect().top; });

        /* Yeni sıra: önce kelimenin harfleri (kelimedeki sırayla),
           sonra kalanlar alfabe sırasında. */
        var once = [], sonra = [];
        satirlar.forEach(function (r) {
            var h = harfler[+r.getAttribute('data-idx')];
            var y = istenen.indexOf(h ? h.h : '');
            r.classList.toggle('ab-tb-odak', y >= 0);
            if (y >= 0) once.push({ r: r, y: y }); else sonra.push(r);
        });
        once.sort(function (a, b) { return a.y - b.y; });

        var yeniSira = once.map(function (x) { return x.r; }).concat(sonra);
        yeniSira.forEach(function (r) { govde.appendChild(r); });
        if (kaydir) kaydir.scrollTop = 0;          /* üste taşınanlar görünsün */

        if (!animasyonlu || (window.matchMedia &&
            matchMedia('(prefers-reduced-motion: reduce)').matches)) return;

        /* FLIP 2: yeni konumlar, farkı geri uygula, sonra sıfıra süz */
        govde.classList.add('ab-tb-kayiyor');
        satirlar.forEach(function (r, i) {
            var fark = eski[i] - r.getBoundingClientRect().top;
            if (!fark) return;
            r.style.transition = 'none';
            r.style.transform = 'translateY(' + fark + 'px)';
        });
        void govde.offsetHeight;                   /* reflow */
        satirlar.forEach(function (r) {
            if (!r.style.transform) return;
            r.style.transition = 'transform 1s cubic-bezier(.22,1,.36,1)';
            r.style.transform = '';
        });
        setTimeout(function () {
            satirlar.forEach(function (r) { r.style.transition = ''; r.style.transform = ''; });
            govde.classList.remove('ab-tb-kayiyor');
        }, 1050);
    }

    /* Renk anahtarı: rengin ADINI yazmak yerine o renkte İÇİ DOLU bir
       daire konur — çocuk rengi okuyup çevirmeden doğrudan görür.
       Daire currentColor ile boyanır, yani ab-c-* sınıfı yetiyor. */
    function anahtarHtml() {
        var satirlar = [
            ['yesil',   'başta yazılış'],
            ['mavi',    'ortada yazılış'],
            ['mor',     'sonda yazılış'],
            ['kirmizi', 'sonrakine bağlanmaz'],
            ['siyah',   'yalnız yazılır']
        ];
        var g = '<div class="ab-anahtar"><b>Renk anahtarı:</b>';
        for (var i = 0; i < satirlar.length; i++) {
            g += '<span class="ab-et ab-c-' + satirlar[i][0] + '">' +
                 '<i class="ab-daire" aria-hidden="true"></i>' +
                 '<span class="ab-et-yazi">' + satirlar[i][1] + '</span></span>';
        }
        return g + '</div>';
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

    /* Soruların TAMAMI listede durur; etkin satır vurgulanır ve
       görünüre çekilir. Liste kendi içinde dikey kaydırılır. */
    function listeHtml() {
        var cik = '', i;
        for (i = 0; i < SATIRLAR.length; i++) cik += satirHtml(i);
        return '<div class="ab-kagitlik"><div class="ab-liste">' + cik + '</div></div>';
    }

    /* --- 4) ADIM MAKİNESİ --------------------------------------- */
    /* PÜRÜZSÜZ GEÇİŞ: harf sayısı değişmiyorsa mevcut kutucuklar
       YERİNDE güncellenir. Böylece harfin DOM ögesi yaşamaya devam eder;
       س → سـ dönüşümünde öge silinip yeniden kurulmadığı için kaybolma /
       yeniden belirme olmaz. Yalnız adet ya da dizilim (bitişik) değişince
       kutu baştan çizilir. */
    function adimYaz(satir) {
        var sira = +satir.getAttribute('data-sira');
        var adim = +satir.getAttribute('data-adim');
        var liste = adimlar(coz(SATIRLAR[sira].h));
        var top  = liste.length - 1;
        if (adim < 0) adim = 0;
        if (adim > top) adim = top;
        satir.setAttribute('data-adim', adim);

        var kutu = satir.querySelector('[data-rol="adim"]');
        var parca = liste[adim];
        var dizi  = kutu.querySelector('.ab-dizi');
        var eski  = dizi ? dizi.querySelectorAll('.ab-p') : [];
        var bitisik = !!(parca.length && parca[0].bitisik);
        var yerinde = dizi && parca.length && eski.length === parca.length &&
                      dizi.classList.contains('ab-bitisik') === bitisik;

        if (yerinde) {
            for (var i = 0; i < parca.length; i++) {
                var el = eski[i], p = parca[i];
                var taban = 'ab-p ab-c-' + p.r;
                var ek = p.yeni ? ' ab-yeni' : (p.donusum ? ' ab-donusum' : '');
                el.className = taban;                       /* eski animasyonu sil */
                if (el.textContent !== p.t) el.textContent = p.t;
                if (ek) { void el.offsetWidth; el.className = taban + ek; }  /* yeniden tetikle */
            }
        } else {
            kutu.innerHTML = adimHtml(parca);
        }
        satir.classList.toggle('ab-bitti', adim === top);
    }

    /* Artık satır gizlenmiyor: hepsi listede. Yalnız etkin satır
       işaretlenir ve görünüre kaydırılır. */
    function pencereYaz(kap, animasyonlu) {
        var l = kap.querySelectorAll('.ab-satir'), i;
        for (i = 0; i < l.length; i++) {
            l[i].classList.toggle('ab-aktif', i === aktif);
            l[i].classList.toggle('ab-gecmis', i < aktif);
        }
        etkinGoster(kap);
        /* Sırası gelen kelimenin harfleri tablonun üstüne süzülsün */
        tabloSirala(kap, SATIRLAR[aktif].h, animasyonlu !== false);
    }

    /* ETKİN KELİMEYİ GÖRÜNÜRDE TUT.
       Öğretmen listeyi elle kaydırmış olabilir; "İleri"ye bastığında
       üzerinde çalışılan satır ekrandan çıkmışsa onu EKRANIN ORTASINA
       getiririz. Zaten tamamen görünüyorsa hiç oynatmayız — durduk yere
       kayan bir liste rahatsız ediyor. */
    function etkinGoster(kap) {
        var l = kap.querySelectorAll('.ab-satir');
        var s = l[aktif];
        var kagit = kap.querySelector('.ab-kagitlik');
        if (!s || !kagit) return;
        var kr = kagit.getBoundingClientRect(), sr = s.getBoundingClientRect();
        /* 4 piksel pay: kenara teğet duran satır "çıkmış" sayılmasın */
        if (sr.top >= kr.top - 4 && sr.bottom <= kr.bottom + 4) return;
        var hedef = kagit.scrollTop + (sr.top - kr.top);
        /* Satır kaba sığıyorsa ORTALA, sığmıyorsa üstünü hizala. */
        if (sr.height < kagit.clientHeight) hedef -= (kagit.clientHeight - sr.height) / 2;
        hedef = Math.max(0, Math.min(hedef, kagit.scrollHeight - kagit.clientHeight));
        var yumusak = !(window.matchMedia &&
                        matchMedia('(prefers-reduced-motion: reduce)').matches);
        try { kagit.scrollTo({ top: hedef, behavior: yumusak ? 'smooth' : 'auto' }); }
        catch (e) { kagit.scrollTop = hedef; }
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
        etkinGoster(kap);      /* adım ilerlese de satır gözden çıkmasın */
        ses();
    }

    /* Etkin satıra geçerken kısa bir belirme: göz nereye bakacağını bulsun. */
    function girAnimasyon(satir) {
        if (!satir) return;
        satir.classList.remove('ab-gir');
        void satir.offsetWidth;                 /* sınıfı yeniden tetikle */
        satir.classList.add('ab-gir');
        setTimeout(function () { satir.classList.remove('ab-gir'); }, 460);
    }

    /* --- 5) KURULUM --------------------------------------------- */
    var kuruldu = false;
    var tanitimZaman = 0, tanitimYapildi = false;

    /* TABLO TANITIMI: sekme İLK açıldığında tablo açık gelir, birkaç saniye
       sonra kendiliğinden katlanır. Amaç "burada bir harf tablosu var"
       demek; sonra ekranı listeye bırakmak. Kullanıcı bu arada düğmeye
       basarsa tanıtım iptal olur, karar onundur. */
    function tabloTanit(kap) {
        if (tanitimYapildi) return;
        tanitimYapildi = true;
        var dugme = kap.querySelector('[data-rol="tb-kapa"]');
        kap.classList.remove('ab-tablo-kapali');
        if (dugme) dugme.setAttribute('aria-expanded', 'true');
        tanitimZaman = setTimeout(function () {
            tanitimZaman = 0;
            kap.classList.add('ab-tablo-kapali');
            if (dugme) dugme.setAttribute('aria-expanded', 'false');
        }, 2600);
    }

    /* p5 paneli ilk kez "active" olduğunda tanıtımı başlat. */
    function tanitimBekle(kap) {
        var p5 = document.getElementById('p5');
        if (!p5) return;
        if (p5.classList.contains('active')) { tabloTanit(kap); return; }
        try {
            var izle = new MutationObserver(function () {
                if (p5.classList.contains('active')) { izle.disconnect(); tabloTanit(kap); }
            });
            izle.observe(p5, { attributes: true, attributeFilter: ['class'] });
        } catch (e) { tabloTanit(kap); }
    }

    function kur() {
        var kap = document.getElementById('abSar');
        if (!kap || kuruldu) return;
        kuruldu = true;

        kap.innerHTML =
            tabloHtml() +
            '<div class="ab-ana">' + anahtarHtml() + listeHtml() + seritHtml() + '</div>';

        var satirlar = kap.querySelectorAll('.ab-satir'), i;
        for (i = 0; i < satirlar.length; i++) adimYaz(satirlar[i]);
        aktif = 0;
        pencereYaz(kap, false);        /* ilk kurulumda animasyonsuz */
        durumYaz(kap);
        tanitimBekle(kap);             /* tablo açık gelsin, sonra katlansın */

        kap.addEventListener('click', function (e) {
            var t = e.target;
            /* Tabloyu katla / aç: kapalıyken liste tüm genişliği alır */
            var kapa = t.closest ? t.closest('[data-rol="tb-kapa"]') : null;
            if (kapa) {
                if (tanitimZaman) { clearTimeout(tanitimZaman); tanitimZaman = 0; }  /* kullanıcı devraldı */
                var kapali = kap.classList.toggle('ab-tablo-kapali');
                kapa.setAttribute('aria-expanded', kapali ? 'false' : 'true');
                ses();
                return;
            }
            /* Harf tablosu: büyüteç + yazılış animasyonu */
            var tb = t.closest ? t.closest('.ab-tb-satir') : null;
            if (tb) {
                if (typeof harfDetay !== 'undefined' && harfDetay.open) {
                    harfDetay.open(+tb.getAttribute('data-idx'));
                }
                return;
            }
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

        /* Klavye/sunum kumandası — yalnız bu sekme açıkken ve
           büyüteç kapalıyken. */
        document.addEventListener('keydown', function (e) {
            var p5 = document.getElementById('p5');
            if (!p5 || !p5.classList.contains('active')) return;
            var ov = document.getElementById('hd-overlay');
            if (ov && ov.style.display === 'flex') return;   /* büyüteç açıkken karışma */
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
